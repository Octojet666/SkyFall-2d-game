import { Entity } from './Entity.js';
import { ENEMY_KINDS, BOSS_KINDS, makeEnemy } from '../data/enemies.js';
import { COLORS } from '../utils/Constants.js';
import { Assets } from '../engine/Assets.js';

// Which Tiny RPG atlas each bestiary entry wears, plus how big it draws.
const ENEMY_SPRITES = {
  goblin: ['orc', 0.70],
  goblin_archer: ['orc', 0.66],
  wolf: ['bloodmonster', 0.55],
  skeleton: ['orc_pale', 0.80],
  skeleton_knight: ['orc_pale', 0.90],
  bandit: ['soldier_brown', 0.85],
  bandit_archer: ['soldier_brown', 0.80],
  cave_spider: ['bloodmonster', 0.46],
  orc: ['orc', 0.95],
  troll: ['orc_blue', 1.25],
  ice_creature: ['orc_blue', 0.80],
  dark_knight: ['soldier_dark', 0.95],
  forest_guardian: ['bloodmonster_moss', 1.45],
  ancient_lich: ['demon_violet', 1.25],
  frost_troll: ['orc_blue', 1.35],
  blackthorn_warlord: ['soldier_dark', 1.40],
};
export class Enemy extends Entity {
  constructor(kind, x, y, home, region) {
    const data = makeEnemy(kind, x, y, home, region);
    super(x, y, data.w, data.h);
    this.kind = kind;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.damage = data.damage;
    this.speed = data.speed;
    this.detection = data.detection;
    this.attackRange = data.attackRange;
    this.attackCooldown = data.attackCooldown;
    this.reward = data.reward;
    this.drops = data.drops.slice();
    this.color = data.color;
    this.dark = data.dark;
    this.behavior = data.behavior;
    this.boss = !!data.boss;
    this.heavy = !!data.heavy;
    this.phases = data.phases || 1;
    this.home = home;
    this.region = region;
    this.dir = 1;
    this.state = 'idle';
    this.cd = data.attackCooldown;
    this.hurt = 0;
    this.detects = 0;
    this.homeRange = 50;
    this.attackAnim = 0;
    this.rangedCd = 0;
    this.phase = 1;
    this.shield = 0;
    this.stun = 0;
    this.flash = 0;
    this.aggro = 0;
    this.id = Math.random().toString(36).slice(2);
    this.walkFrame = 0;
    this.walkTime = 0;
    this.frozen = 0;
    this.animT = Math.random() * 2;
    const sprite = ENEMY_SPRITES[kind] || ['orc', 0.85];
    this.spriteName = sprite[0];
    this.spriteScale = sprite[1];
  }
  animState() {
    if (this.hp <= 0) return 'death';
    if (this.hurt > 0) return 'hurt';
    if (this.attackAnim > 0) return 'attack1';
    if (this.state === 'chase' || this.state === 'return') return 'walk';
    return 'idle';
  }
  animFrame(state, frames) {
    if (!frames) return 0;
    if (state === 'attack1') {
      const t = Math.min(0.999, 1 - Math.max(0, this.attackAnim) / 0.35);
      return Math.floor(t * frames);
    }
    if (state === 'death') return frames - 1;
    if (state === 'hurt') return Math.floor(Math.random() * frames);
    const speed = state === 'walk' ? 9 : 5;
    return Math.floor(this.animT * speed) % frames;
  }
  get isBoss() { return this.boss; }
  get name() {
    const def = ENEMY_KINDS[this.kind] || BOSS_KINDS[this.kind];
    return def ? def.name : 'Enemy';
  }
  takeDamage(amount, knockback) {
    this.hp -= amount;
    this.hurt = 0.22;
    this.flash = 0.15;
    if (knockback) {
      this.vx = knockback;
      this.vy = -50;
    }
    if (this.hp <= 0) {
      this.die();
    }
  }
  die() {
    this._removed = true;
  }
  update(dt, player, world, entities) {
    this.animT += dt;
    this.cd = Math.max(0, this.cd - dt);
    this.hurt = Math.max(0, this.hurt - dt);
    this.flash = Math.max(0, this.flash - dt);
    this.frozen = Math.max(0, this.frozen - dt);
    if (this.attackAnim > 0) {
      const prev = this.attackAnim;
      this.attackAnim = Math.max(0, this.attackAnim - dt);
      // the blow lands part-way through the swing, not on the first frame
      if (prev > 0.12 && this.attackAnim <= 0.12) this.struck = true;
    }
    this.walkTime += dt;
    if (this.frozen > 0) {
      this.walkFrame += dt * 2;
      this._physics(dt, world, 0);
      return;
    }
    if (this.stun > 0) {
      this.stun -= dt;
      this.vx *= 0.8;
      this._physics(dt, world, 0);
      return;
    }
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy * 0.5);
    const inRange = dist < this.detection;
    const meleeRange = this.attackRange + 2;
    const canAttack = this.cd <= 0 && Math.abs(dx) < meleeRange && Math.abs(dy) < 22 && player.ground;
    const shouldChase = inRange && player.hp > 0;
    if (shouldChase) {
      this.aggro = Math.min(1, this.aggro + dt * 2);
      if (this.behavior === 'ranged' && dist > this.attackRange * 0.7) {
        this._moveToward(player.x, dt, world, 1);
        this.state = 'chase';
        if (this.cd <= 0 && dist < this.detection * 1.4) {
          this._rangedAttack(player, dt);
        }
      } else if (canAttack) {
        this._meleeAttack(dt);
        this.state = 'attack';
      } else {
        const chaseSpeed = this.speed * (0.6 + this.aggro * 0.4);
        this._moveToward(player.x, dt, world, chaseSpeed / this.speed);
        this.state = 'chase';
      }
      if (this.boss) {
        this._bossThink(player, dt, world, dx, dist);
      }
    } else {
      this.aggro = Math.max(0, this.aggro - dt * 0.5);
      if (Math.abs(this.x - this.home) > this.homeRange) {
        this._moveToward(this.home, dt, world, 0.5);
        this.state = 'return';
      } else {
        this.vx *= 0.9;
        this.state = 'idle';
        this.walkFrame += dt * 1.5;
      }
    }
    this._physics(dt, world, 0);
    if (this.hp <= 0) {
      this.die();
    }
  }
  _moveToward(tx, dt, world, speedMul) {
    const d = tx - this.x;
    const dir = Math.sign(d);
    this.dir = dir;
    const spd = this.speed * speedMul;
    this.vx += (dir * spd - this.vx) * Math.min(1, dt * 8);
  }
  _meleeAttack(dt) {
    if (this.attackAnim > 0.05) return;
    this.attackAnim = 0.22;
    this.cd = this.attackCooldown;
    this.vx = 0;
  }
  _rangedAttack(player, dt) {
    if (this.cd > 0) return;
    this.cd = this.attackCooldown * (0.8 + Math.random() * 0.4);
    this.attackAnim = 0.18;
    const dx = player.x - this.x;
    this.vx = Math.sign(dx) * 6;
    this.shot = true;
  }
  _bossThink(player, dt, world, dx, dist) {
    if (this.phase === 1 && this.hp < this.maxHp * 0.6) {
      this.phase = 2;
    }
    if (this.phase === 2 && this.hp < this.maxHp * 0.3) {
      this.phase = 3;
    }
    if (this.cd <= 0) {
      if (this.behavior === 'ranged' && dist > this.attackRange * 0.6) {
        this._rangedAttack(player, dt);
      } else if (Math.abs(dx) < 18 && Math.abs(player.y - this.y) < 20 && player.ground) {
        this._meleeAttack(dt);
        this.cd = this.attackCooldown * (0.7 + (this.phase - 1) * 0.1);
      } else {
        this.cd = 0.4;
      }
    }
    const wrath = (this.phase - 1) * 20;
    if (this.hp < this.maxHp * 0.5) {
      this.damage = Math.round(this.damage * (1 + (this.phase - 1) * 0.3));
    }
  }
  _physics(dt, world, extraVy) {
    const g = 900;
    this.vy = Math.min(this.vy + g * dt, 520);
    if (extraVy) this.vy += extraVy * dt;
    const vx = this.vx * dt;
    this.x += vx;
    if (this.vx !== 0 && this._collide(world)) {
      let stepped = false;
      if (this.ground) {
        for (let lift = 2; lift <= 16; lift += 2) {
          if (!this._collideAt(world, -lift)) {
            this.y -= lift;
            stepped = true;
            break;
          }
        }
      }
      if (!stepped) {
        this.x -= vx;
        this.vx *= -0.3;
      }
    }
    const vy = this.vy * dt;
    this.y += vy;
    if (this._collide(world)) {
      this.y -= vy;
      if (this.vy > 0) this.ground = true;
      this.vy = 0;
    }
    if (!this.ground) this.vx *= 0.92;
    this.walkFrame += dt * 10;
    this.x = Math.max(8, Math.min(world.W * 16 - 8, this.x));
  }
  _collideAt(world, dy) {
    const T = 16;
    const x0 = Math.floor((this.x - this.w / 2) / T);
    const x1 = Math.floor((this.x + this.w / 2) / T);
    const y = this.y + dy;
    const y0 = Math.floor((y - this.h) / T);
    const y1 = Math.floor(y / T);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (world.solid(tx, ty)) return true;
      }
    }
    return false;
  }
  _collide(world) {
    const T = 16;
    const x0 = Math.floor((this.x - this.w / 2) / T);
    const x1 = Math.floor((this.x + this.w / 2) / T);
    const y0 = Math.floor((this.y - this.h) / T);
    const y1 = Math.floor(this.y / T);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (world.solid(tx, ty)) return true;
      }
    }
    return false;
  }
  draw(ctx, cam) {
    const sx = Math.round(this.x - cam.x);
    const sy = Math.round(this.y - cam.y);
    const ch = Assets.char(this.spriteName);
    const state = this.animState();
    const frames = ch && ch.frames[state] ? ch.frames[state] : 0;
    if (!ch || !frames) {
      this._draw(ctx, sx, sy);
      return;
    }
    const shadow = Assets.spriteKey('shadow');
    if (shadow) Assets.drawSheet(ctx, shadow, 0, sx, sy + 1, { scale: this.spriteScale * 0.9 });
    Assets.drawChar(ctx, this.spriteName, state, this.animFrame(state, frames), sx, sy, {
      dir: this.dir,
      scale: this.spriteScale,
      flash: this.hurt > 0 || this.flash > 0,
    });
    this._drawPlate(ctx, sx, sy);
  }
  _drawPlate(ctx, sx, sy) {
    const top = sy - 21 * this.spriteScale;
    if (this.hp < this.maxHp) {
      const frac = Math.max(0, this.hp / this.maxHp);
      const w = Math.max(14, this.w);
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(sx - w / 2, top - 8, w, 3);
      ctx.fillStyle = frac > 0.5 ? '#50c070' : frac > 0.25 ? '#e8c050' : '#e05050';
      ctx.fillRect(sx - w / 2 + 1, top - 7, Math.max(1, (w - 2) * frac), 1);
    }
    if (this.boss) {
      ctx.fillStyle = '#ffd23f';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.name.toUpperCase(), sx, top - 12);
      ctx.textAlign = 'left';
    }
  }
  _draw(ctx, sx, sy) {
    const hurt = this.hurt > 0 && ((Math.floor(this._time() * 20) % 2) === 0);
    const flash = this.flash > 0;
    let col = this.color;
    if (hurt) col = '#ffffff';
    if (flash) col = '#ffffff';
    ctx.fillStyle = col;
    ctx.fillRect(sx - this.w / 2, sy - this.h, this.w, this.h);
    ctx.fillStyle = this.dark;
    ctx.fillRect(sx - this.w / 2, sy - this.h, this.w, 2);
    ctx.fillRect(sx - this.w / 2, sy - 2, this.w, 2);
    if (this.boss) {
      ctx.fillStyle = COLORS.ember;
      ctx.fillRect(sx - this.w / 2, sy - this.h - 4, this.w, 3);
    }
    if (this.hp < this.maxHp) {
      const frac = this.hp / this.maxHp;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(sx - this.w / 2, sy - this.h - 8, this.w, 3);
      ctx.fillStyle = frac > 0.5 ? '#50c070' : frac > 0.25 ? '#e8c050' : '#e05050';
      ctx.fillRect(sx - this.w / 2 + 1, sy - this.h - 7, Math.max(1, this.w * frac - 2), 1);
    }
    if (this.attackAnim > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      const off = this.dir > 0 ? this.w / 2 : -this.w / 2;
      ctx.fillRect(sx + off - 1, sy - 4, 4, 6);
    }
    this._drawFace(ctx, sx, sy, hurt);
    if (this.boss) {
      ctx.fillStyle = '#ffd23f';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.name.toUpperCase(), sx, sy - this.h - 14);
      ctx.textAlign = 'left';
    }
  }
  _drawFace(ctx, sx, sy, hurt) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(sx - 2, sy - this.h + 3, 2, 2);
    ctx.fillRect(sx + 1, sy - this.h + 3, 2, 2);
  }
  _time() {
    const t = (this.game && this.game.time) || { _time: 0 };
    return t._time || 0;
  }
}
