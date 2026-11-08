import assert from 'node:assert';

const localStorage = {
  data: {},
  getItem(k) { return this.data[k] ?? null; },
  setItem(k, v) { this.data[k] = v; },
  removeItem(k) { delete this.data[k]; },
};

const SaveSystem = {};
SaveSystem.KEY = 'skyfall.save.v2';
SaveSystem.VER = 2;
SaveSystem.write = (s) => {
  try {
    localStorage.setItem(SaveSystem.KEY, JSON.stringify(Object.assign({ v: SaveSystem.VER }, s)));
    return true;
  } catch {
    return false;
  }
};
SaveSystem.read = () => {
  try {
    const raw = localStorage.getItem(SaveSystem.KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || d.v !== SaveSystem.VER) return null;
    if (typeof d.x !== 'number' || !Number.isFinite(d.x)) return null;
    if (d.y != null && (typeof d.y !== 'number' || !Number.isFinite(d.y))) return null;
    if (typeof d.gold !== 'number' || !Number.isFinite(d.gold)) return null;
    if (!d.inv || typeof d.inv !== 'object') return null;
    if (typeof d.level !== 'number' || !Number.isFinite(d.level)) return null;
    if (typeof d.xp !== 'number' || !Number.isFinite(d.xp)) return null;
    if (typeof d.hp !== 'number' || !Number.isFinite(d.hp)) return null;
    if (typeof d.maxHp !== 'number' || !Number.isFinite(d.maxHp)) return null;
    if (d.weapon && typeof d.weapon !== 'string') return null;
    if (d.char && typeof d.char !== 'string') return null;
    return d;
  } catch {
    try { localStorage.removeItem(SaveSystem.KEY); } catch {}
    return null;
  }
};
SaveSystem.readSave = () => {
  const d = SaveSystem.read();
  if (!d) return null;
  return {
    x: d.x,
    y: d.y,
    gold: d.gold,
    inv: d.inv,
    level: d.level,
    xp: d.xp,
    hp: d.hp,
    maxHp: d.maxHp,
    weapon: d.weapon || null,
    char: d.char || null,
    quest: d.quest || 0,
    kills: d.kills || 0,
    stats: d.stats || null,
    equipment: d.equipment || null,
    inventory: d.inventory || null,
    xpToNext: d.xpToNext || null,
    statPoints: d.statPoints || 0,
    skillPoints: d.skillPoints || 0,
    skills: d.skills || {},
    skillTreeProgress: d.skillTreeProgress || {},
    killCount: d.killCount || 0,
    killsByKind: d.killsByKind || {},
    bossesDefeated: d.bossesDefeated || {},
    metNpcs: new Set(d.metNpcs || []),
    visitedRegions: new Set(d.visitedRegions || []),
    items: d.items || {},
    quests: d.quests || {},
  };
};
SaveSystem.writeSave = (s) => {
  const data = {
    v: SaveSystem.VER,
    x: s.x,
    y: s.y,
    gold: s.gold,
    inv: s.inv || {},
    level: s.level,
    xp: s.xp,
    hp: s.hp,
    maxHp: s.maxHp,
    weapon: s.weapon || null,
    char: s.char || null,
    quest: s.quest || 0,
    kills: s.kills || 0,
    stats: s.stats || null,
    equipment: s.equipment || null,
    inventory: s.inventory || null,
    xpToNext: s.xpToNext || null,
    statPoints: s.statPoints || 0,
    skillPoints: s.skillPoints || 0,
    skills: s.skills || {},
    skillTreeProgress: s.skillTreeProgress || {},
    killCount: s.killCount || 0,
    killsByKind: s.killsByKind || {},
    bossesDefeated: s.bossesDefeated || {},
    metNpcs: Array.from(s.metNpcs || []),
    visitedRegions: Array.from(s.visitedRegions || []),
    items: s.items || {},
    quests: s.quests || {},
  };
  return SaveSystem.write(data);
};
SaveSystem.clear = () => {
  try { localStorage.removeItem(SaveSystem.KEY); } catch {}
};
SaveSystem.exists = () => SaveSystem.read() != null;

SaveSystem.clear();
const state = {
  x: 120, y: 200, gold: 50, inv: { health_potion: 2 }, level: 3, xp: 10, hp: 40, maxHp: 60,
  weapon: 'iron_sword', char: 'frog', quest: 1, kills: 2, stats: null, equipment: null, inventory: null,
  xpToNext: 52, statPoints: 1, skillPoints: 1, skills: {}, skillTreeProgress: {},
  killCount: 2, killsByKind: {}, bossesDefeated: {}, metNpcs: new Set(['elder_maren']),
  visitedRegions: new Set(['ash', 'forest']), items: {}, quests: {},
};
assert.equal(SaveSystem.writeSave(state), true);
const back = SaveSystem.readSave();
assert.equal(back.x, 120);
assert.equal(back.gold, 50);
assert.equal(back.inv.health_potion, 2);
assert.equal(back.level, 3);
assert.equal(back.char, 'frog');
assert.equal(back.metNpcs.has('elder_maren'), true);
assert.equal(back.visitedRegions.has('forest'), true);
SaveSystem.clear();
SaveSystem.write({ x: 5, gold: 3, inv: { potion: 1 }, level: 1, xp: 0, hp: 50, maxHp: 50 });
const r2 = SaveSystem.readSave();
assert.ok(r2, 'valid v2 save should read back');
assert.equal(r2.gold, 3);
assert.equal(r2.inv.potion, 1);
assert.equal(SaveSystem.read().gold, 3);
localStorage.setItem(SaveSystem.KEY, '{bad');
assert.equal(SaveSystem.read(), null);
SaveSystem.clear();
console.log('save tests ok');
