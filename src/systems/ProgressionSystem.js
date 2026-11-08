import { XP_PER_LEVEL, BASE_STATS, STAT_POINTS_PER_LEVEL, allocateSkill, skillLevel } from '../data/skills.js';
import { playLevelUp } from '../data/audio.js';
export class ProgressionSystem {
  constructor(state) {
    this.state = state;
  }
  init() {
    if (this.state.level == null) this.state.level = 1;
    if (this.state.xp == null) this.state.xp = 0;
    if (this.state.xpToNext == null) this.state.xpToNext = XP_PER_LEVEL(1);
    if (this.state.stats == null) this.state.stats = Object.assign({}, BASE_STATS);
    if (this.state.statPoints == null) this.state.statPoints = 0;
    if (this.state.skillPoints == null) this.state.skillPoints = 0;
    if (this.state.skills == null) this.state.skills = {};
    if (this.state.skillTreeProgress == null) this.state.skillTreeProgress = {};
    if (this.state.killCount == null) this.state.killCount = 0;
    if (this.state.killsByKind == null) this.state.killsByKind = {};
    if (this.state.bossesDefeated == null) this.state.bossesDefeated = {};
    if (this.state.metNpcs == null) this.state.metNpcs = new Set();
    if (this.state.visitedRegions == null) this.state.visitedRegions = new Set();
    if (this.state.items == null) this.state.items = {};
    if (this.state.quests == null) this.state.quests = {};
    if (this.state.inventory == null) this.state.inventory = {};
    if (this.state.equipment == null) this.state.equipment = {};
  }
  xpToNext() {
    return XP_PER_LEVEL(this.state.level || 1);
  }
  addXp(amount) {
    this.state.xp = (this.state.xp || 0) + amount;
    let leveled = false;
    while ((this.state.xp || 0) >= this.xpToNext()) {
      this.state.xp -= this.xpToNext();
      this.state.level = (this.state.level || 1) + 1;
      this.state.statPoints = (this.state.statPoints || 0) + STAT_POINTS_PER_LEVEL;
      this.state.skillPoints = (this.state.skillPoints || 0) + 1;
      const hpGain = 8 + (this.state.stats?.strength || 0) * 0.5;
      if (this.state.maxHp != null) {
        this.state.maxHp = (this.state.maxHp || 50) + hpGain;
        this.state.hp = Math.min(this.state.hp + hpGain, this.state.maxHp);
      }
      const staminaGain = 4 + (this.state.stats?.agility || 0) * 0.3;
      if (this.state.maxStamina != null) {
        this.state.maxStamina = (this.state.maxStamina || 60) + staminaGain;
      }
      const manaGain = 3 + (this.state.stats?.intelligence || 0) * 0.4;
      if (this.state.maxMana != null) {
        this.state.maxMana = (this.state.maxMana || 30) + manaGain;
      }
      leveled = true;
    }
    if (leveled) {
      playLevelUp();
      if (this.state.onLevelUp) this.state.onLevelUp(this.state.level);
    }
    this.state.xp = Math.max(0, this.state.xp);
  }
  addStatPoints(n = 1) {
    this.state.statPoints = (this.state.statPoints || 0) + n;
  }
  spendStatPoint(stat) {
    const valid = ['strength', 'agility', 'defense', 'intelligence', 'critical'];
    if (!valid.includes(stat)) return false;
    if ((this.state.statPoints || 0) < 1) return false;
    if (!this.state.stats) this.state.stats = Object.assign({}, BASE_STATS);
    if (stat === 'critical') {
      this.state.stats.critical = (this.state.stats.critical || 0.05) + 0.02;
    } else {
      this.state.stats[stat] = (this.state.stats[stat] || 0) + 1;
    }
    this.state.statPoints = (this.state.statPoints || 0) - 1;
    this.recomputeDerived();
    return true;
  }
  recomputeDerived() {
    const base = BASE_STATS;
    const stats = this.state.stats || {};
    const equip = this.state.equipment || {};
    const statsBonus = {};
    forEachEquip(equip, (id) => {
      const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
    });
    const add = (key, val) => {
      if (typeof val === 'number') statsBonus[key] = (statsBonus[key] || 0) + val;
    };
    forEachEquip(equip, (id) => {
      const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
      if (!def) return;
      add('defense', def.defense);
      add('strength', def.strength);
      add('agility', def.agility);
      add('intelligence', def.intelligence);
      add('critical', def.critical);
      add('maxHp', def.maxHp);
      add('maxStamina', def.maxStamina);
      add('maxMana', def.maxMana);
    });
    const eff = Object.assign({}, BASE_STATS);
    eff.strength = (stats.strength || base.strength) + (statsBonus.strength || 0);
    eff.agility = (stats.agility || base.agility) + (statsBonus.agility || 0);
    eff.defense = (stats.defense || base.defense) + (statsBonus.defense || 0);
    eff.intelligence = (stats.intelligence || base.intelligence) + (statsBonus.intelligence || 0);
    eff.critical = (stats.critical || base.critical) + (statsBonus.critical || 0);
    eff.maxHp = (stats.maxHp || base.maxHp) + (statsBonus.maxHp || 0);
    eff.maxStamina = (stats.maxStamina || base.maxStamina) + (statsBonus.maxStamina || 0);
    eff.maxMana = (stats.maxMana || base.maxMana) + (statsBonus.maxMana || 0);
    if (this.state.maxHp != null) {
      const newMax = Math.round(eff.maxHp);
      if (this.state.maxHp !== newMax) {
        this.state.maxHp = newMax;
        this.state.hp = Math.min(this.state.hp, this.state.maxHp);
      }
    }
    if (this.state.maxStamina != null) {
      this.state.maxStamina = Math.round(eff.maxStamina);
    }
    if (this.state.maxMana != null) {
      this.state.maxMana = Math.round(eff.maxMana);
    }
    this.state.effectiveStats = eff;
  }
  effective() {
    return this.state.effectiveStats || Object.assign({}, BASE_STATS);
  }
  increaseLevel() {
    this.state.level = (this.state.level || 1) + 1;
    this.state.xp = Math.max(0, (this.state.xp || 0) - this.xpToNext());
    this.addStatPoints(STAT_POINTS_PER_LEVEL);
    this.state.skillPoints = (this.state.skillPoints || 0) + 1;
    this.recomputeDerived();
  }
  allocate(skillTreeId, skillId) {
    return allocateSkill(this.state, skillTreeId, skillId);
  }
  skillLevel(skillEffectId) {
    return skillLevel(this.state, skillEffectId);
  }
  maxHp() {
    return this.state.maxHp || 50;
  }
  maxStamina() {
    return this.state.maxStamina || 60;
  }
  maxMana() {
    return this.state.maxMana || 30;
  }
  effectiveMaxHp() {
    let base = this.state.maxHp || 50;
    const equip = this.state.equipment || {};
    forEachEquip(equip, (id) => {
      const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
      if (def && typeof def.maxHp === 'number') base += def.maxHp;
    });
    return Math.round(base);
  }
  effectiveMaxStamina() {
    let base = this.state.maxStamina || 60;
    const equip = this.state.equipment || {};
    forEachEquip(equip, (id) => {
      const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
      if (def && typeof def.maxStamina === 'number') base += def.maxStamina;
    });
    return Math.round(base);
  }
  effectiveMaxMana() {
    let base = this.state.maxMana || 30;
    const equip = this.state.equipment || {};
    forEachEquip(equip, (id) => {
      const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
      if (def && typeof def.maxMana === 'number') base += def.maxMana;
    });
    return Math.round(base);
  }
  equipBonus(key) {
    const equip = this.state.equipment || {};
    let bonus = 0;
    forEachEquip(equip, (id) => {
      const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
      if (def && typeof def[key] === 'number') bonus += def[key];
    });
    return bonus;
  }
  playerDefense() {
    const eff = this.effective();
    return eff.defense || 0;
  }
  playerAttackDamage(baseDamage) {
    const eff = this.effective();
    const strengthBonus = (eff.strength - 3) * 0.6;
    const skillBonus = this.skillBonus();
    return Math.round(baseDamage + strengthBonus + skillBonus);
  }
  skillBonus() {
    let bonus = 0;
    if (this.state.skills && this.state.skills.warrior_mighty_hit) {
      bonus += 2 + (this.state.skills.warrior_mighty_hit - 1) * 1.2;
    }
    return bonus;
  }
  playerCritChance() {
    const eff = this.effective();
    return clamp((eff.critical || 0.05) + (this.state.skills?.archer_steady_hand ? 0.04 : 0), 0, 0.4);
  }
  playerAttackSpeed() {
    return 1;
  }
  playerMovementSpeed() {
    let base = 90;
    const stats = this.state.stats || {};
    base += (stats.agility || 0) * 1.5;
    if (this.state.skills && this.state.skills.survival_swift_foot) {
      base += (this.state.skills.survival_swift_foot - 1) * 2.5;
    }
    return base;
  }
  playerStamina() {
    return this.state.stamina != null ? this.state.stamina : this.effectiveMaxStamina();
  }
  playerMana() {
    return this.state.mana != null ? this.state.mana : this.effectiveMaxMana();
  }
  setStamina(v) {
    this.state.stamina = clamp(v, 0, this.effectiveMaxStamina());
  }
  setMana(v) {
    this.state.mana = clamp(v, 0, this.effectiveMaxMana());
  }
  consumeStamina(amount) {
    this.state.stamina = (this.state.stamina || this.effectiveMaxStamina()) - amount;
    return this.state.stamina >= 0;
  }
  consumeMana(amount) {
    this.state.mana = (this.state.mana || this.effectiveMaxMana()) - amount;
    return this.state.mana >= 0;
  }
  regenStamina(dt) {
    if ((this.state.stamina || 0) < this.effectiveMaxStamina()) {
      this.state.stamina = Math.min(this.effectiveMaxStamina(), (this.state.stamina || 0) + dt * 8);
    }
  }
  regenMana(dt) {
    if ((this.state.mana || 0) < this.effectiveMaxMana()) {
      this.state.mana = Math.min(this.effectiveMaxMana(), (this.state.mana || 0) + dt * 3);
    }
  }
  restoreHealth(amount) {
    this.state.hp = Math.min(this.effectiveMaxHp(), (this.state.hp || this.effectiveMaxHp()) + amount);
  }
  damageHealth(amount) {
    this.state.hp = Math.max(0, (this.state.hp || this.effectiveMaxHp()) - amount);
    if (this.state.hp <= 0 && this.state.onDeath) this.state.onDeath();
  }
  isAlive() {
    return (this.state.hp || 0) > 0;
  }
}
function forEachEquip(equip, cb) {
  for (const slot of ['head', 'chest', 'hands', 'legs', 'feet', 'main', 'off', 'amulet', 'ring']) {
    const id = equip[slot];
    if (id) cb(id);
  }
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
