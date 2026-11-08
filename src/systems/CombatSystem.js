import { ITEMS, WEAPON_KINDS } from '../data/items.js';
import { Assets } from '../engine/Assets.js';
import { SFX_NAMES, sfx, playHit, playKill, playHurt, playBlock, playArrow, playSpell, playImpact } from '../data/audio.js';
import { clamp, rand, chance, weighted } from '../utils/Random.js';
export class CombatSystem {
  constructor(state) {
    this.state = state;
    this.damageNumbers = [];
    this.trails = [];
    this.slowField = [];
    this.spriteFx = [];
  }
  weaponStats() {
    const def = ITEMS[this.state.weapon];
    if (!def) return { damage: 5, speed: 0.34, range: 16, knockback: 80, crit: 0.05, type: 'melee' };
    return {
      damage: def.damage,
      speed: def.speed,
      range: def.range,
      knockback: def.knockback,
      crit: def.crit,
      type: def.type,
      ammo: def.ammo,
      id: def.id,
    };
  }
  meleeDamage() {
    const w = this.weaponStats();
    const base = w.damage + (this.state.level || 1) * 1.5;
    const strengthBonus = (this.state.stats && this.state.stats.strength) ? (this.state.stats.strength - 3) * 0.6 : 0;
    const equippedBonus = (this.state.equipment && this.state.equipment.main) ? (ITEMS[this.state.equipment.main]?.damage || 0) : 0;
    const skillBonus = this.skillBonus();
    const critBonus = chance(this.critChance()) ? base * 0.5 : 0;
    return Math.round(base + strengthBonus + equippedBonus + skillBonus + critBonus);
  }
  critChance() {
    const base = this.weaponStats().crit;
    const skillBonus = (this.state.skills && this.state.skills.archer_steady_hand) ? 0.04 : 0;
    const equipBonus = (this.state.equipment && this.state.equipment.main) ? (ITEMS[this.state.equipment.main]?.crit || 0) : 0;
    return clamp(base + skillBonus + equipBonus, 0, 0.4);
  }
  skillBonus() {
    let bonus = 0;
    if (this.state.skills && this.state.skills.warrior_mighty_hit) {
      bonus += 2 + (this.state.skills.warrior_mighty_hit - 1) * 1.2;
    }
    return bonus;
  }
  init() {
    this.state.attackCd = 0;
    this.state.attackAnim = 0;
    this.state.blockCd = 0;
    this.state.dodgeCd = 0;
    this.state.lastHitTime = 0;
  }
  tryAttack() {
    if (this.state.attackCd > 0) return null;
    const w = this.weaponStats();
    if (w.type === 'ranged') return this.tryRanged();
    this.state.attackCd = w.speed;
    this.state.attackAnim = 0.18;
    this.state.lastHitTime = 0;
    playImpact(0.6);
    return { type: 'melee', range: w.range, damage: this.meleeDamage(), knockback: w.knockback, weapond: w.id };
  }
  tryRanged() {
    if (this.state.attackCd > 0) return null;
    const w = this.weaponStats();
    const ammo = w.ammo;
    const inv = this.state.inventory || {};
    if (ammo && (inv[ammo] || 0) <= 0) {
      return { type: 'fail', reason: 'no ammo' };
    }
    if (ammo) inv[ammo]--;
    this.state.attackCd = w.speed;
    this.state.attackAnim = 0.16;
    this.state.lastHitTime = 0;
    playArrow();
    return { type: 'ranged', range: w.range, damage: this.rangedDamage(), knockback: w.knockback, ammo, weapon: w.id };
  }
  rangedDamage() {
    const w = this.weaponStats();
    const base = w.damage + (this.state.level || 1) * 1.2;
    const agilityBonus = (this.state.stats && this.state.stats.agility) ? (this.state.stats.agility - 3) * 0.5 : 0;
    const skillBonus = (this.state.skills && this.state.skills.archer_steady_hand) ? 2 + (this.state.skills.archer_steady_hand - 1) * 1.2 : 0;
    const critBonus = chance(this.critChance()) ? base * 0.5 : 0;
    return Math.round(base + agilityBonus + skillBonus + critBonus);
  }
  applyDamage(enemy, amount, knockback = 0, owner = null) {
    const block = this.state.blockActive;
    let reduced = amount;
    if (block) {
      const reduction = 0.6 + (this.state.skills && this.state.skills.warrior_iron_jaw ? (this.state.skills.warrior_iron_jaw - 1) * 0.5 : 0);
      reduced = Math.round(amount * reduction);
      this.state.blockActive = false;
      playBlock();
    }
    enemy.hp -= reduced;
    enemy.hurt = 0.2;
    enemy.vx = (enemy.x < (owner ? owner.x : this.state.x)) ? -knockback : knockback;
    enemy.vy = -60;
    if (enemy.hp <= 0) {
      this.kill(enemy, reduced);
      return { killed: true, damage: reduced };
    }
    this.damageNumbers.push({
      x: enemy.x,
      y: enemy.y - 16,
      text: '-' + reduced,
      life: 0.8,
      color: '#ff5050',
      vy: -20,
    });
    playHit(0.7);
    return { killed: false, damage: reduced };
  }
  applyPlayerDamage(amount, onHit) {
    const steadyFeet = (this.state.skills && this.state.skills.warrior_steady_feet) ? (this.state.skills.warrior_steady_feet - 1) * 2 : 0;
    const reduced = Math.max(1, Math.round(amount - steadyFeet));
    this.state.hp -= reduced;
    this.state.hurt = 0.25;
    this.state.lastHitTime = 0;
    this.state.vx = (this.state.facingRight ? 1 : -1) * 90;
    this.state.vy = -70;
    this.state.blockActive = false;
    playHurt();
    this.damageNumbers.push({
      x: this.state.x,
      y: this.state.y - 16,
      text: '-' + reduced,
      life: 0.8,
      color: '#ff5050',
      vy: -20,
    });
    if (this.state.hp <= 0) {
      this.killPlayer();
      return { killed: true, damage: reduced };
    }
    if (onHit) onHit();
    return { killed: false, damage: reduced };
  }
  kill(enemy, damage) {
    const reward = enemy.reward || { xp: 10, goldMin: 3, goldMax: 7 };
    if (this.progression) this.progression.addXp(reward.xp);
    else this.state.xp += reward.xp;
    this.state.gold += Math.round(rand(reward.goldMin, reward.goldMax));
    this.addFloatingText(enemy.x, enemy.y - 16, '+' + reward.xp + ' XP', '#ffd23f', 0.9);
    this.addFloatingText(enemy.x, enemy.y - 28, '+' + Math.round(rand(reward.goldMin, reward.goldMax)) + 'g', '#ffd23f', 0.7);
    const drops = this.dropFor(enemy);
    for (const d of drops) {
      this.state.inventory[d.id] = (this.state.inventory[d.id] || 0) + d.qty;
    }
    playKill();
    this.state.killCount = (this.state.killCount || 0) + 1;
    if (enemy.kind) {
      this.state.killsByKind = this.state.killsByKind || {};
      this.state.killsByKind[enemy.kind] = (this.state.killsByKind[enemy.kind] || 0) + 1;
      if (this.quest) this.quest.noteKill(enemy.kind);
    }
    if (enemy.boss) {
      this.state.bossesDefeated = this.state.bossesDefeated || {};
      this.state.bossesDefeated[enemy.kind] = true;
    }
  }
  killPlayer() {
    this.state.hp = Math.max(1, this.state.maxHp || 50);
    this.state.x = 100;
    this.state.y = 200;
    this.state.gold = Math.max(0, Math.floor(this.state.gold * 0.85));
    this.addFloatingText(this.state.x, this.state.y - 40, 'You fell.', '#ff5050', 1.2);
    if (this.state.onDeath) this.state.onDeath();
  }
  dropFor(enemy) {
    if (!enemy.drops || enemy.drops.length === 0) return [];
    const table = [];
    for (const [id, baseChance] of enemy.drops) {
      let chance = baseChance;
      if (enemy.boss) chance = Math.min(0.95, chance + 0.15);
      if (this.state.skills && this.state.skills.survival_copper_touch) {
        chance = Math.min(0.95, chance + (this.state.skills.survival_copper_touch - 1) * 0.04);
      }
      table.push([id, chance]);
    }
    const out = [];
    for (const [id, c] of table) {
      if (Math.random() < c) {
        out.push({ id, qty: 1 });
      }
    }
    return out;
  }
  /** One-shot sprite animation from the asset packs (pickup pop, crate break, confetti). */
  addSpriteFx(key, x, y, opts = {}) {
    const meta = Assets.spriteKey(key);
    if (!meta) return;
    const frames = Math.max(1, meta.frames || 1);
    this.spriteFx.push({
      meta,
      x,
      y,
      t: 0,
      life: opts.life || Math.max(0.25, frames / 18),
      scale: opts.scale || 1,
    });
  }
  addFloatingText(x, y, text, color, life = 1) {
    this.damageNumbers.push({ x, y, text, life, color, vy: -18, vx: (Math.random() - 0.5) * 10 });
  }
  update(dt) {
    for (const n of this.damageNumbers) {
      n.life -= dt;
      n.y += n.vy * dt;
      n.x += n.vx * dt;
      n.vy *= 0.92;
    }
    this.damageNumbers = this.damageNumbers.filter((n) => n.life > 0);
    for (const fx of this.spriteFx) fx.t += dt;
    this.spriteFx = this.spriteFx.filter((fx) => fx.t < fx.life);
    for (const t of this.trails) {
      t.life -= dt;
    }
    this.trails = this.trails.filter((t) => t.life > 0);
    if (this.state.attackAnim > 0) this.state.attackAnim = Math.max(0, this.state.attackAnim - dt);
    if (this.state.attackCd > 0) this.state.attackCd = Math.max(0, this.state.attackCd - dt);
    if (this.state.blockCd > 0) this.state.blockCd = Math.max(0, this.state.blockCd - dt);
    if (this.state.dodgeCd > 0) this.state.dodgeCd = Math.max(0, this.state.dodgeCd - dt);
    if (this.state.blockActive) {
      this.state.blockDuration = (this.state.blockDuration || 0) - dt;
      if (this.state.blockDuration <= 0) this.state.blockActive = false;
    }
    for (const f of this.slowField) {
      f.life -= dt;
      f.r = (f.r || 60) + 120 * dt;
    }
    this.slowField = this.slowField.filter((f) => f.life > 0);
  }
  draw(ctx, cam) {
    for (const fx of this.spriteFx) {
      const frames = Math.max(1, fx.meta.frames || 1);
      const frame = (fx.t / fx.life) * frames;
      Assets.drawSheet(ctx, fx.meta, frame, fx.x - cam.x, fx.y - cam.y, { scale: fx.scale });
    }
    for (const n of this.damageNumbers) {
      const a = clamp(n.life, 0, 1);
      ctx.globalAlpha = a;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = n.color;
      ctx.fillText(n.text, n.x - cam.x, n.y - cam.y);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }
    for (const t of this.trails) {
      const a = clamp(t.life / t.max, 0, 1);
      ctx.globalAlpha = a * 0.6;
      ctx.fillStyle = t.color;
      const s = t.size || 3;
      ctx.fillRect(t.x - cam.x - s / 2, t.y - cam.y - s / 2, s, s);
      ctx.globalAlpha = 1;
    }
    for (const f of this.slowField) {
      const a = clamp(f.life, 0, 1) * 0.25;
      ctx.globalAlpha = a;
      ctx.strokeStyle = '#9ad0ff';
      ctx.lineWidth = 2;
      const r = f.r;
      ctx.beginPath();
      ctx.arc(f.x - cam.x, f.y - cam.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  addTrail(x, y, color, size = 3, life = 0.3) {
    this.trails.push({ x, y, color, size, life, max: life });
  }
  addSlowField(x, y, r = 60, life = 1.2) {
    this.slowField.push({ x, y, r, life });
  }
}
