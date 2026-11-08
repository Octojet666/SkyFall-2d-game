import { Enemy } from '../entities/Enemy.js';
import { Npc } from '../entities/Npc.js';
import { Pickup } from '../entities/Pickup.js';
import { Projectile } from '../entities/Projectile.js';
import { ENEMY_KINDS, BOSS_KINDS } from '../data/enemies.js';
import { NPCS } from '../data/npcs.js';
import { T } from '../utils/Constants.js';
export class WorldEntities {
  constructor(world) {
    this.world = world;
    this.enemies = [];
    this.npcs = [];
    this.pickups = [];
    this.projectiles = [];
    this._nextProjId = 1;
  }
  spawnEnemies(count, kind, startX, spread, y, home) {
    for (let i = 0; i < count; i++) {
      const x = startX + i * spread + Math.random() * 8;
      const groundY = this.world.height[Math.floor(x / T)] * T;
      const e = new Enemy(kind, x, groundY, home || x, this.world.regionAt(x));
      this.enemies.push(e);
    }
  }
  spawnNpc(id) {
    const def = NPCS[id];
    if (!def) return;
    const n = new Npc(id);
    n.y = this.world.height[Math.floor(n.x / T)] * T;
    this.npcs.push(n);
  }
  spawnPickup(x, y, itemId, qty = 1) {
    const p = new Pickup(x, y, itemId, qty);
    this.pickups.push(p);
  }
  spawnProjectile(x, y, vx, vy, damage, kind, color, slow = 0) {
    const p = new Projectile(x, y, vx, vy, damage, kind, color, slow);
    p.onHit = (proj) => this.onProjectileHit(proj);
    this.projectiles.push(p);
    return p;
  }
  onProjectileHit(proj) {
    this.projectiles = this.projectiles.filter((p) => p !== proj);
  }
  clear() {
    this.enemies.length = 0;
    this.npcs.length = 0;
    this.pickups.length = 0;
    this.projectiles.length = 0;
  }
  update(dt, player, world, combat) {
    for (const e of this.enemies.slice()) {
      e.game = { time: { _time: 0 } };
      e.update(dt, player, world, this.enemies);
      if (combat) this._resolveEnemyOffense(e, player, combat);
      if (e._removed) {
        this._onEnemyKilled(e, combat, world);
        this.enemies.splice(this.enemies.indexOf(e), 1);
      }
    }
    for (const p of this.projectiles.slice()) {
      p.update(dt, world);
      if (!p._removed && combat) {
        if (p.owner === 'enemy') {
          if (Math.abs(p.x - player.x) < player.w / 2 + 6 && Math.abs(p.y - (player.y - player.h / 2)) < player.h / 2 + 6) {
            combat.applyPlayerDamage(p.damage);
            p._removed = true;
          }
        } else {
          for (const e of this.enemies) {
            if (Math.abs(p.x - e.x) < e.w / 2 + 6 && Math.abs(p.y - (e.y - e.h / 2)) < e.h / 2 + 8) {
              combat.applyDamage(e, p.damage, Math.sign(p.vx) * 90, player);
              p._removed = true;
              break;
            }
          }
        }
      }
      if (p._removed) {
        this.projectiles.splice(this.projectiles.indexOf(p), 1);
      }
    }
    if (combat) this._openChests(player, combat);
    for (const pk of this.pickups.slice()) {
      pk.update(dt);
      if (pk._removed || pk.collected) {
        this.pickups.splice(this.pickups.indexOf(pk), 1);
      } else if (this._canPickup(pk, player)) {
        this._collectPickup(pk, player, combat);
        pk.collect();
      }
    }
    for (const n of this.npcs) {
      n.game = { time: { _time: 0 } };
      n.update(dt);
    }
  }
  /** Enemy melee blows and arrows actually reach the player here. */
  _resolveEnemyOffense(e, player, combat) {
    if (e.shot) {
      e.shot = false;
      const dx = player.x - e.x;
      const dy = (player.y - player.h / 2) - (e.y - e.h / 2);
      const len = Math.max(1, Math.hypot(dx, dy));
      const speed = 190;
      const proj = this.spawnProjectile(e.x, e.y - e.h * 0.6, (dx / len) * speed, (dy / len) * speed, e.damage, 'arrow', '#d8c8a0');
      proj.owner = 'enemy';
    }
    if (e.struck) {
      e.struck = false;
      const dx = Math.abs(player.x - e.x);
      const dy = Math.abs(player.y - player.y);
      const reach = e.attackRange + player.w / 2 + e.w / 2 + 6;
      if (dx <= reach && Math.abs((player.y - player.h / 2) - (e.y - e.h / 2)) < 26 && player.hp > 0) {
        combat.applyPlayerDamage(e.damage);
      }
    }
  }
  _canPickup(pk, player) {
    return Math.abs(pk.x - player.x) < 16 && Math.abs(pk.y - player.y) < 20;
  }
  /** Crates are real: walk into one and it breaks open with its loot. */
  _openChests(player, combat) {
    for (const c of this.world.lootChests || []) {
      if (c.opened) continue;
      const cx = c.tx * T + T / 2;
      const gy = this.world.height[c.tx] * T;
      if (Math.abs(player.x - cx) > 16 || Math.abs(player.y - gy) > 26) continue;
      c.opened = true;
      if (this.world.closedChests) this.world.closedChests.add(c.tx);
      combat.addSpriteFx('crate_break', cx, gy, { life: 0.45 });
      const inv = player.inventory || {};
      inv[c.reward] = (inv[c.reward] || 0) + 1;
      player.inventory = inv;
      player.invDirty = true;
      combat.addFloatingText(cx, gy - 22, '+' + c.reward.replace(/_/g, ' '), '#ffd23f', 1.2);
    }
  }
  _collectPickup(pk, player, combat) {
    if (combat) combat.addSpriteFx('collected', pk.x, pk.y + 2, { life: 0.3 });
    if (pk.coin) {
      player.gold = (player.gold || 0) + pk.qty;
      combat.addFloatingText(pk.x, pk.y - 16, '+' + pk.qty + 'g', '#ffd23f', 0.9);
      player.invDirty = true;
      return;
    }
    const inv = player.inventory || {};
    inv[pk.itemId] = (inv[pk.itemId] || 0) + pk.qty;
    player.inventory = inv;
    player.invDirty = true;
    combat.addFloatingText(pk.x, pk.y - 16, '+' + pk.qty + ' ' + pk.itemId, '#ffd23f', 0.9);
  }
  // Rewards (XP, gold, kill counters) are granted by CombatSystem.kill — this
  // only handles presentation plus physical loot lying on the ground.
  _onEnemyKilled(e, combat, world) {
    if (!e.reward) return;
    combat.addFloatingText(e.x, e.y - 16, '+' + e.reward.xp + ' XP', '#ffd23f', 0.9);
    const drops = e.drops || [];
    for (const [id, chance] of drops) {
      if (Math.random() < chance) {
        this.spawnPickup(e.x, e.y - 8, id, 1);
      }
    }
    if (e.boss) {
      for (let i = 0; i < 5; i++) this.spawnPickup(e.x + (i - 2) * 8, e.y - 8, 'gold', 3);
    }
  }
  drawAll(ctx, cam) {
    this.draw(ctx, cam);
  }
  draw(ctx, cam) {
    for (const e of this.enemies) {
      if (e._removed) continue;
      e.draw(ctx, cam);
    }
    for (const n of this.npcs) {
      n.draw(ctx, cam);
    }
    for (const pk of this.pickups) {
      pk.draw(ctx, cam);
    }
    for (const p of this.projectiles) {
      p.draw(ctx, cam);
    }
    // The player is drawn last so it always reads in front of the world.
    if (this.player) this.player.draw(ctx, cam);
  }
}
