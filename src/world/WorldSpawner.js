import { Enemy } from '../entities/Enemy.js';
import { Npc } from '../entities/Npc.js';
import { Pickup } from '../entities/Pickup.js';
import { ENEMY_KINDS } from '../data/enemies.js';
import { NPCS } from '../data/npcs.js';
import { T } from '../utils/Constants.js';
export class WorldSpawner {
  constructor(world, entities) {
    this.world = world;
    this.entities = entities || null;
    this.placedEnemies = new Map();
    this.placedNpcs = new Map();
    this.placedPickups = new Map();
  }
  clear() {
    this.placedEnemies.clear();
    this.placedNpcs.clear();
    this.placedPickups.clear();
    if (this.entities) this.entities.clear();
  }
  spawnInitial() {
    this.spawnEnemies();
    this.spawnNpcs();
    this.spawnStartingPickups();
  }
  spawnEnemies() {
    this.placedEnemies.clear();
    const specs = [
      { kind: 'goblin', start: 78 * T, count: 5, spread: 12 * T, y: 10 * T },
      { kind: 'goblin', start: 92 * T, count: 4, spread: 10 * T, y: 10 * T },
      { kind: 'wolf', start: 104 * T, count: 3, spread: 14 * T, y: 9 * T },
      { kind: 'goblin_archer', start: 114 * T, count: 3, spread: 12 * T, y: 10 * T },
      { kind: 'skeleton', start: 140 * T, count: 3, spread: 12 * T, y: 8 * T },
      { kind: 'bandit', start: 150 * T, count: 2, spread: 14 * T, y: 9 * T },
      { kind: 'wolf', start: 160 * T, count: 2, spread: 12 * T, y: 9 * T },
      { kind: 'skeleton_knight', start: 168 * T, count: 1, spread: 0, y: 8 * T },
      { kind: 'cave_spider', start: 235 * T, count: 4, spread: 8 * T, y: 10 * T },
      { kind: 'orc', start: 242 * T, count: 1, spread: 0, y: 9 * T },
      { kind: 'ice_creature', start: 135 * T, count: 3, spread: 12 * T, y: 8 * T },
      { kind: 'troll', start: 155 * T, count: 1, spread: 0, y: 8 * T },
      { kind: 'dark_knight', start: 257 * T, count: 1, spread: 0, y: 8 * T },
    ];
    const taken = [];
    for (const s of specs) {
      for (let i = 0; i < s.count; i++) {
        let x = s.start + (s.spread ? i * s.spread + Math.random() * 10 : 0);
        // Specs overlap at some tiles; nudge so two enemies never spawn inside each other.
        let guard = 0;
        while (taken.some((tx) => Math.abs(tx - x) < 26) && guard++ < 12) x += 30;
        if (x > this.world.W * T - 8) continue;
        taken.push(x);
        // Drop them exactly on the surface; the old yBase floor left enemies
        // standing inside the dirt wherever the ground was higher than it.
        const top = this.world.height[Math.floor(x / T)] || 10;
        const y = top * T;
        const e = new Enemy(s.kind, x, y, x, this.world.regionAt(x));
        this.placedEnemies.set(e.id, e);
        if (this.entities) this.entities.enemies.push(e);
      }
    }
  }
  spawnNpcs() {
    this.placedNpcs.clear();
    const npcIds = Object.keys(NPCS);
    for (const id of npcIds) {
      const def = NPCS[id];
      if (!def) continue;
      const n = new Npc(id);
      const tx = Math.floor(n.x / T);
      n.y = (this.world.height[tx] || 10) * T;
      this.placedNpcs.set(id, n);
      if (this.entities) this.entities.npcs.push(n);
    }
  }
  /** Place one NPC by id (used when a region is first entered). */
  spawnNpc(id) {
    if (!this.entities || this.placedNpcs.has(id)) return this.placedNpcs.get(id) || null;
    const def = NPCS[id];
    if (!def) return null;
    const n = new Npc(id);
    const tx = Math.floor(n.x / T);
    n.y = (this.world.height[tx] || 10) * T;
    this.placedNpcs.set(id, n);
    this.entities.npcs.push(n);
    return n;
  }
  spawnStartingPickups() {
    this.placedPickups.clear();
    for (let i = 0; i < 6; i++) {
      const tx = 6 + i * 8;
      const top = this.world.height[tx] || 10;
      const pk = new Pickup(tx * T + 8, top * T - 6, 'gold', 3 + Math.floor(Math.random() * 4));
      this.placedPickups.set('g_' + i, pk);
      if (this.entities) this.entities.pickups.push(pk);
    }
  }
  spawnLoot(x, y, itemId, qty = 1) {
    const p = new Pickup(x, y, itemId, qty);
    this.placedPickups.set('p_' + (this.placedPickups.size + 1) + '_' + itemId, p);
    return p;
  }
  enemiesInRegion(regionId) {
    const out = [];
    for (const e of this.placedEnemies.values()) {
      if (this.world.regionAt(e.x) === regionId) out.push(e);
    }
    return out;
  }
  npcsInRegion(regionId) {
    const out = [];
    for (const n of this.placedNpcs.values()) {
      if (n.region === regionId) out.push(n);
    }
    return out;
  }
  nearbyNpc(x, y, range = 26 * T) {
    let best = null;
    let bestD = range + 1;
    for (const n of this.placedNpcs.values()) {
      const d = Math.abs(n.x - x) + Math.abs(n.y - y);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    return best;
  }
}
