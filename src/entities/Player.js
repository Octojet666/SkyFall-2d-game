import { Entity } from './Entity.js';
import { T, COLORS } from '../utils/Constants.js';
import { clamp } from '../utils/Random.js';
import { Assets } from '../engine/Assets.js';
import { ITEMS } from '../data/items.js';
import { WEAPON_VISUALS, REST_ANGLE, SWING } from '../data/weaponVisuals.js';
import { heroById, DEFAULT_HERO } from '../data/characters.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 12, 16);
    this.facingRight = true;
    this.ground = false;
    this.hp = 50;
    this.maxHp = 50;
    this.stamina = 60;
    this.maxStamina = 60;
    this.mana = 30;
    this.maxMana = 30;
    this.level = 1;
    this.xp = 0;
    this.xpToNext = 20;
    this.gold = 20;
    this.inventory = {};
    this.equipment = {};
    this.weapon = 'wood_sword';
    this.weaponName = 'Wooden Sword';
    this.statPoints = 0;
    this.skillPoints = 0;
    this.skills = {};
    this.skillTreeProgress = {};
    this.killCount = 0;
    this.killsByKind = {};
    this.bossesDefeated = {};
    this.metNpcs = new Set();
    this.visitedRegions = new Set();
    this.items = {};
    this.dirty = true;
    this.invDirty = false;
    this.hurt = 0;
    this.attackAnim = 0;
    this.attackCd = 0;
    this.blockCd = 0;
    this.dodgeCd = 0;
    this.blockActive = false;
    this.blockDuration = 0;
    this.lastHitTime = 0;
    this.dodgeDir = 0;
    this.dodgeTimer = 0;
    this.facingRight = true;
    this.onDeath = null;
    this.onLevelUp = null;
    this.spawnX = x;
    this.spawnY = y;
    this.fallLimit = 2000;
    this.walkFrame = 0;
    this.walkTime = 0;
    this.idleFrame = 0;
    this.idleTime = 0;
    this.attackFrame = 0;
    this.facingRight = true;
    this.animT = 0;
    this.landed = 0;
    this.heroId = DEFAULT_HERO;
  }
  /** Appearance definition (sprite source, scale, hand anchor) for the hero. */
  get hero() {
    return heroById(this.heroId);
  }
  /** Swap the character mid-game; the save carries the choice. */
  setHero(id) {
    const h = heroById(id);
    if (!h) return false;
    const changed = h.id !== this.heroId;
    this.heroId = h.id;
    this.animT = 0;
    this.attackAnim = 0;
    this.hurt = 0;
    return changed;
  }
  animState() {
    if (this.hp <= 0) return 'death';
    if (this.hurt > 0) return 'hurt';
    if (this.attackAnim > 0) return 'attack1';
    if (!this.ground) return Math.abs(this.vx) > 20 ? 'walk' : 'idle';
    return Math.abs(this.vx) > 18 ? 'walk' : 'idle';
  }
  animFrame(state, frames) {
    if (!frames) return 0;
    if (state === 'attack1') {
      const t = clamp(1 - this.attackAnim / 0.2, 0, 0.999);
      return Math.floor(t * frames);
    }
    if (state === 'hurt') return Math.floor((1 - clamp(this.hurt / 0.25, 0, 1)) * frames);
    if (state === 'death') return frames - 1;
    const speed = state === 'walk' ? 11 : 5;
    return Math.floor(this.animT * speed) % frames;
  }
  get facingDir() {
    return this.facingRight ? 1 : -1;
  }
  equippable(id) {
    return id && this.equipment && this.equipment[id];
  }
  setFacingRight(v) {
    this.facingRight = !!v;
  }
  _solidAt(dy) {
    if (!this.game || !this.game.collision) return false;
    return this.game.collision.hits({ x: this.x, y: this.y + (dy || 0), w: this.w, h: this.h });
  }
  _move(ax, dt, world) {
    const speed = 90 + (this._stat('agility') - 3) * 1.5;
    const sprinting = !!(this.game && this.game.input && this.game.input.down('ShiftLeft') && this.stamina > 2);
    const sprintMul = sprinting ? 1.5 : 1;
    const accel = 14;
    this.vx += (ax * speed - this.vx) * Math.min(1, dt * accel);
    if (ax === 0) this.vx *= this.ground ? 0.80 : 0.92;
    if (ax !== 0) this.setFacingRight(ax > 0);

    this.vy = Math.min(this.vy + 900 * dt, 520);

    const dodging = this.dodgeTimer > 0;
    const dx = this.vx * dt * (dodging ? 1 : sprintMul);
    this.x += dx;
    if (dx !== 0 && this._collide()) {
      // Walk up small ledges instead of catching on them.
      let stepped = false;
      if (this.ground) {
        for (let lift = 2; lift <= 16; lift += 2) {
          if (!this._solidAt(-lift)) {
            this.y -= lift;
            stepped = true;
            break;
          }
        }
      }
      if (!stepped) {
        this.x -= dx;
        this.vx = 0;
      }
    }
    this.x = clamp(this.x, 8, world.W * T - 8);

    const wasAir = !this.ground;
    const dy = this.vy * dt;
    this.y += dy;
    if (this._collide()) {
      this.y -= dy;
      this.ground = this.vy >= 0;
      this.vy = 0;
    } else {
      this.ground = this._solidAt(1);
    }
    if (wasAir && this.ground) {
      this.landed = 0.18;
      const combat = this.game && this.game.combat;
      if (combat && combat.addSpriteFx) combat.addSpriteFx('dust', this.x, this.y, { life: 0.22, scale: 0.9 });
    }
    if (this.landed > 0) this.landed -= dt;

    if (this.y > this.fallLimit) {
      this.x = this.spawnX;
      this.y = this.spawnY;
      this.vy = 0;
    }
  }
  tryMove(ax, dt, world) {
    const speed = 90 + (this._stat('agility') - 3) * 1.5;
    const sprint = 1.5;
    const accel = 14;
    this.vx += (ax * speed - this.vx) * Math.min(1, dt * accel);
    if (ax === 0) this.vx *= 0.82;
    this.setFacingRight(ax > 0);
    this.x += this.vx * dt * sprint;
    if (this.vx !== 0 && this._collide()) {
      this.x -= this.vx * dt * sprint;
      this.vx = 0;
    }
    this.x = clamp(this.x, 4, world.W * T - 4);
  }
  _stat(key) {
    const stats = (typeof this.stats !== 'undefined') ? this.stats : {};
    const base = { strength: 3, agility: 3, defense: 2, intelligence: 2, critical: 0.05 }[key] || 0;
    return (stats[key] != null ? stats[key] : base);
  }
  _collide() {
    if (!this.game) return false;
    return this.game.collision.hits(this);
  }
  jump(dt) {
    if (this.ground) {
      // ~52px of lift (gravity 900) clears the tallest legal step of 3 tiles.
      this.vy = -305 - (this._stat('agility') - 3) * 3;
      this.ground = false;
      this._playSfx && this._playSfx('jump');
    }
  }
  trySprint(dt) {
    const down = this.game && this.game.input && this.game.input.down('ShiftLeft');
    if (down && this.ground && this.stamina > 2) {
      this.stamina = Math.max(0, this.stamina - dt * 14);
      return true;
    }
    return false;
  }
  regenStamina(dt) {
    this.stamina = Math.min(this.maxStamina, this.stamina + dt * 8);
  }
  regenMana(dt) {
    this.mana = Math.min(this.maxMana, this.mana + dt * 3);
  }
  tryAttack() {
    if (this.attackCd > 0) return false;
    // Cooldown comes from the weapon so a rapier really is faster than a flail.
    const def = ITEMS[this.weapon];
    this.attackCd = def && def.speed ? def.speed : 0.32;
    this.attackAnim = 0.2;
    this.lastHitTime = 0;
    return true;
  }
  tryBlock() {
    if (this.blockCd > 0) return false;
    if (this.stamina < 8) return false;
    this.blockCd = 0.5;
    this.blockActive = true;
    this.blockDuration = 0.5;
    this.stamina = Math.max(0, this.stamina - 8);
    return true;
  }
  tryDodge(dir) {
    if (this.dodgeCd > 0) return false;
    if (this.stamina < 14) return false;
    this.dodgeCd = 0.45;
    this.dodgeTimer = 0.16;
    this.dodgeDir = dir;
    this.vx = dir * 260;
    this.vy = -120;
    this.stamina = Math.max(0, this.stamina - 14);
    this.ground = false;
    return true;
  }
  usePotion() {
    const inv = this.inventory || {};
    if (inv.super_potion && inv.super_potion > 0) {
      inv.super_potion--;
      this.hp = Math.min(this.maxHp, this.hp + 90);
      if (inv.super_potion <= 0) delete inv.super_potion;
      this.inventory = inv;
      this.invDirty = true;
      return 'super_potion';
    }
    if (inv.health_potion && inv.health_potion > 0) {
      inv.health_potion--;
      this.hp = Math.min(this.maxHp, this.hp + 40);
      if (inv.health_potion <= 0) delete inv.health_potion;
      this.inventory = inv;
      this.invDirty = true;
      return 'health_potion';
    }
    return null;
  }
  hurtFlash(dt) {
    if (this.hurt > 0) {
      this.hurt -= dt;
      return true;
    }
    return false;
  }
  attackAnimActive(dt) {
    if (this.attackAnim > 0) {
      this.attackAnim -= dt;
      return true;
    }
    return false;
  }
  update(dt) {
    if (!this.game) return;
    this.regenStamina(dt);
    this.regenMana(dt);
    let ax = 0;
    const inp = this.game.input;
    if (inp.down('KeyD') || inp.down('ArrowRight')) ax += 1;
    if (inp.down('KeyA') || inp.down('ArrowLeft')) ax -= 1;
    const sprinting = this.trySprint(dt);
    if (this.ground) {
      this.walkTime += dt;
      if (Math.abs(this.vx) > 20) {
        this.walkFrame += dt * 10;
      } else {
        this.idleTime += dt;
        this.idleFrame += dt * 2;
      }
    } else {
      if (this.vy < 0) this.idleFrame += dt * 3;
      else this.idleFrame += dt * 2;
    }
    this._move(ax, dt, this.game.world);
    if (inp.hit('Space') || inp.hit('KeyW')) this.jump(dt);
    if (inp.hit('Mouse') || inp.hit('KeyJ')) this.tryAttack();
    if (inp.hit('KeyK')) this.tryBlock();
    if (inp.hit('ShiftLeft') && this.ground && this.stamina > 14 && ax !== 0) {
      if (Math.random() < 0.3) this.tryDodge(ax || this.facingDir);
    }
    if (inp.hit('Digit1')) this.usePotion();
    this.animT += dt;
    if (this.attackAnimActive(dt)) {
      this.attackFrame += dt * 20;
    }
    if (this.hurtFlash(dt)) {}
    if (this.dodgeTimer > 0) this.dodgeTimer -= dt;
  }
  draw(ctx, cam) {
    const sx = Math.round(this.x - cam.x);
    const sy = Math.round(this.y - cam.y);
    const state = this.animState();
    const hero = this.hero;
    const dir = this.facingRight ? 1 : -1;
    const shadow = Assets.spriteKey('shadow');
    if (shadow) Assets.drawSheet(ctx, shadow, 0, sx, sy + 1, { scale: hero.kind === 'atlas' ? 0.85 : 0.62 });
    let drawn = false;
    if (hero.kind === 'atlas') {
      const ch = Assets.char(hero.sprite);
      const frames = ch && ch.frames[state] ? ch.frames[state] : 0;
      drawn = !!frames && Assets.drawChar(ctx, hero.sprite, state, this.animFrame(state, frames), sx, sy, {
        dir,
        scale: hero.scale,
        flash: this.hurt > 0,
      });
    } else {
      const sheet = Assets.manifest.sprites[hero.sprite];
      const animKey = (hero.anims && hero.anims[state]) || 'idle';
      const meta = sheet && (sheet[animKey] || sheet.idle);
      if (meta) {
        drawn = Assets.drawSheet(ctx, meta, this.animFrame(state, meta.frames), sx, sy, {
          dir,
          scale: hero.scale,
        });
      }
    }
    if (!drawn) {
      this._drawBody(ctx, sx, sy);
      return;
    }
    this._drawHeldWeapon(ctx, sx, sy);
    if (this.blockActive) {
      ctx.strokeStyle = 'rgba(120,190,255,0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy - 10, 13, -0.6, 1.4);
      ctx.stroke();
    }
    if (this.hp < this.maxHp && this.hp > 0) {
      const w = 16;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(sx - w / 2, sy - 26, w, 3);
      ctx.fillStyle = '#e05050';
      ctx.fillRect(sx - w / 2 + 1, sy - 25, Math.max(1, (w - 2) * (this.hp / this.maxHp)), 1);
    }
  }
  _drawBody(ctx, sx, sy) {
    const hurt = this.hurt > 0 && ((Math.floor(this._time() * 20) % 2) === 0);
    const col = hurt ? '#ffffff' : COLORS.player;
    ctx.fillStyle = col;
    ctx.fillRect(sx - 6, sy - 14, 12, 14);
    ctx.fillStyle = COLORS.playerDark;
    ctx.fillRect(sx - 6, sy - 14, 12, 2);
    ctx.fillRect(sx - 6, sy - 4, 12, 2);
    ctx.fillStyle = COLORS.playerLight;
    ctx.fillRect(sx - 4, sy - 12, 3, 2);
    ctx.fillRect(sx + 1, sy - 12, 3, 2);
    const f = this.facingDir;
    ctx.fillStyle = '#3a2a1c';
    ctx.fillRect(sx + f * 4 - 1, sy - 6, 3, 6);
    ctx.fillStyle = '#5a3a2a';
    ctx.fillRect(sx + f * 4, sy - 6, 1, 6);
    const leap = this.vy < -20;
    if (leap) {
      ctx.fillStyle = '#3a2a1c';
      ctx.fillRect(sx - 3, sy - 4, 2, 2);
      ctx.fillRect(sx + 1, sy - 4, 2, 2);
    }
    if (this.attackAnim > 0) {
      ctx.fillStyle = COLORS.playerLight;
      const off = this.facingDir > 0 ? 6 : -8;
      ctx.fillRect(sx + off - 1, sy - 10, 4, 3);
    }
    if (this.hp < this.maxHp) {
      ctx.fillStyle = 'rgba(224,80,80,0.6)';
      ctx.fillRect(sx - 6, sy - 16, 12, 2);
    }
    this._drawHeldWeapon(ctx, sx, sy);
  }
  /**
   * The equipped weapon, anchored at the grip so the hand is always on the
   * handle. Blades sweep through an arc while attacking, bows just recoil.
   */
  _drawHeldWeapon(ctx, sx, sy) {
    const id = this.weapon;
    const vis = id && WEAPON_VISUALS[id];
    if (!vis) return;
    const hero = this.hero;
    // Heroes whose art already carries a weapon (the orcs' mace) skip the overlay.
    if (hero.heldWeapon === false) return;
    const dir = this.facingDir;
    const kind = vis.kind || 'blade';
    const hand = hero.hand || [7, -13];
    const wscale = hero.scale * (hero.weaponScale || 1);
    let angle = REST_ANGLE[kind] ?? 0;
    let hx = sx + dir * hand[0];
    let hy = sy + hand[1];
    if (this.attackAnim > 0) {
      const p = clamp(1 - this.attackAnim / 0.2, 0, 1);
      const arc = Math.sin(p * Math.PI);
      if (kind === 'bow') {
        hx -= dir * arc * 2;
      } else {
        const [a0, a1] = SWING[kind] || SWING.blade;
        const e = 1 - Math.pow(1 - p, 2.2);
        angle = a0 + (a1 - a0) * e;
        hx += dir * arc * 3.2 * wscale;
        hy -= arc * 1.2 * wscale;
      }
    }
    Assets.drawWeapon(ctx, id, hx, hy, { dir, angle, scale: wscale });
  }

  _time() {
    const t = this.game && this.game.time;
    return t ? t._time || 0 : 0;
  }
}
