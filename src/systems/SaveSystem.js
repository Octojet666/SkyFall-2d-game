const KEY = 'skyfall.save.v2';
const VER = 2;

function readRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch (e) {
    return null;
  }
}
export const SaveSystem = {
  write(s) {
    try {
      const data = Object.assign({ v: VER }, s);
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },
  read() {
    try {
      const raw = readRaw();
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || d.v !== VER) return null;
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
    } catch (e) {
      try { localStorage.removeItem(KEY); } catch (_) {}
      return null;
    }
  },
  readSave() {
    const d = this.read();
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
      metNpcs: d.metNpcs ? new Set(d.metNpcs) : new Set(),
      visitedRegions: d.visitedRegions ? new Set(d.visitedRegions) : new Set(),
      items: d.items || {},
      quests: d.quests || {},
    };
  },
  writeSave(s) {
    const data = {
      v: VER,
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
      metNpcs: s.metNpcs ? Array.from(s.metNpcs) : [],
      visitedRegions: s.visitedRegions ? Array.from(s.visitedRegions) : [],
      items: s.items || {},
      quests: s.quests || {},
    };
    return this.write(data);
  },
  clear() {
    try { localStorage.removeItem(KEY); } catch (_) {}
  },
  exists() {
    return this.read() != null;
  },
};
