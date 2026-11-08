export const SKILLS = {
  warrior_tree: {
    id: 'warrior_tree',
    name: 'Warrior',
    desc: 'Melee strength and survivability.',
    branches: [
      { id: 'mighty_hit', name: 'Mighty Hit', desc: 'Heavy melee attacks deal bonus damage.', max: 5, cost: 1, effect: 'warrior_mighty_hit' },
      { id: 'second_wind', name: 'Second Wind', desc: 'Heal a small amount when below half health.', max: 3, cost: 1, effect: 'warrior_second_wind' },
      { id: 'steady_feet', name: 'Steady Feet', desc: 'Reduced stagger from enemy attacks.', max: 3, cost: 1, effect: 'warrior_steady_feet' },
      { id: 'battle_lust', name: 'Battle Lust', desc: 'Kill an enemy to briefly gain attack speed.', max: 2, cost: 2, effect: 'warrior_battle_lust' },
      { id: 'iron_jaw', name: 'Iron Jaw', desc: 'Flat damage reduction from melee hits.', max: 5, cost: 1, effect: 'warrior_iron_jaw' },
    ],
  },
  archer_tree: {
    id: 'archer_tree',
    name: 'Archer',
    desc: 'Ranged damage and accuracy.',
    branches: [
      { id: 'steady_hand', name: 'Steady Hand', desc: 'Bow shots rarely miss and deal more damage.', max: 5, cost: 1, effect: 'archer_steady_hand' },
      { id: 'multi_shot', name: 'Multi Shot', desc: 'Fire an extra arrow every few shots.', max: 3, cost: 2, effect: 'archer_multi_shot' },
      { id: 'far_shot', name: 'Far Shot', desc: 'Bow range increases.', max: 4, cost: 1, effect: 'archer_far_shot' },
      { id: 'quick_draw', name: 'Quick Draw', desc: 'Faster bow attack speed.', max: 3, cost: 1, effect: 'archer_quick_draw' },
    ],
  },
  mage_tree: {
    id: 'mage_tree',
    name: 'Mage',
    desc: 'Mana, spells, and magical protection.',
    branches: [
      { id: 'spark', name: 'Spark', desc: 'Fling a small lightning projectile.', max: 3, cost: 1, effect: 'mage_spark' },
      { id: 'frost_flake', name: 'Frost Flake', desc: 'Cast an ice projectile that slows enemies.', max: 3, cost: 1, effect: 'mage_frost_flake' },
      { id: 'flame_cone', name: 'Flame Cone', desc: 'AOE fire damage in front of you.', max: 2, cost: 3, effect: 'mage_flame_cone' },
      { id: 'arcane_shield', name: 'Arcane Shield', desc: 'Brief magic damage reduction.', max: 3, cost: 1, effect: 'mage_arcane_shield' },
      { id: 'mana_tide', name: 'Mana Tide', desc: 'Slower mana drain for spells.', max: 3, cost: 1, effect: 'mage_mana_tide' },
    ],
  },
  survival_tree: {
    id: 'survival_tree',
    name: 'Survivalist',
    desc: 'Health, stamina, and resourcefulness.',
    branches: [
      { id: 'hardy_lungs', name: 'Hardy Lungs', desc: 'More stamina and faster recovery.', max: 5, cost: 1, effect: 'survival_hardy_lungs' },
      { id: 'copper_touch', name: 'Copper Touch', desc: 'Slightly better loot drops.', max: 3, cost: 1, effect: 'survival_copper_touch' },
      { id: 'trapper', name: 'Trapper', desc: 'Set simple traps for bonus loot odds.', max: 2, cost: 2, effect: 'survival_trapper' },
      { id: 'alert', name: 'Alert', desc: 'Enemies detect you later.', max: 4, cost: 1, effect: 'survival_alert' },
      { id: 'swift_foot', name: 'Swift Foot', desc: 'Faster movement speed.', max: 3, cost: 1, effect: 'survival_swift_foot' },
    ],
  },
};
export const SKILL_TREE_KEYS = Object.keys(SKILLS);
export function skillTree(id) {
  return SKILLS[id] || null;
}
export function skillDef(treeId, skillId) {
  const tree = skillTree(treeId);
  if (!tree) return null;
  return tree.branches.find((b) => b.id === skillId) || null;
}
export const EFFECT_HP_PER_LEVEL = {
  warrior_mighty_hit: (level, stats) => stats.strength * 0.4 + 2,
  warrior_second_wind: (level) => 6 + level * 2,
  warrior_steady_feet: (level, stats) => 6 + level * 2,
  warrior_battle_lust: (level) => 0.25 + level * 0.05,
  warrior_iron_jaw: (level) => 3 + level * 1.5,
  archer_steady_hand: (level) => 0.06 + level * 0.02,
  archer_multi_shot: (level) => 0.2 + level * 0.05,
  archer_far_shot: (level) => 12 + level * 4,
  archer_quick_draw: (level) => 0.05 + level * 0.02,
  mage_spark: (level) => 10 + level * 4,
  mage_frost_flake: (level) => 8 + level * 3,
  mage_flame_cone: (level) => 14 + level * 5,
  mage_arcane_shield: (level) => 6 + level * 2.5,
  mage_mana_tide: (level) => 0.1 + level * 0.05,
  survival_hardy_lungs: (level) => 8 + level * 3,
  survival_copper_touch: (level) => 0.05 + level * 0.02,
  survival_alert: (level) => 8 + level * 3,
  survival_swift_foot: (level) => 4 + level * 2,
};
export const BASE_STATS = {
  strength: 3,
  agility: 3,
  defense: 2,
  intelligence: 2,
  critical: 0.05,
  maxHp: 50,
  maxStamina: 60,
  maxMana: 30,
};
export function effectiveStats(base, equipment, skills) {
  const s = { ...base };
  if (equipment) {
    s.strength += (equipment.strength || 0);
    s.agility += (equipment.agility || 0);
    s.defense += (equipment.defense || 0);
    s.intelligence += (equipment.intelligence || 0);
    s.critical += (equipment.critical || 0);
  }
  if (skills) {
    for (const [id, lvl] of Object.entries(skills || {})) {
      const eff = EFFECT_HP_PER_LEVEL[id];
      if (eff) {
        s.maxHp = Math.round(s.maxHp + eff(lvl) * 0.5);
      }
    }
  }
  return s;
}
export const SKILL_COST = 1;
export const XP_PER_LEVEL = (lvl) => Math.round(20 + lvl * 14);
export const STAT_POINTS_PER_LEVEL = 1;
export const STARTING_SKILLS = {};
export function startSkillPoints(state) {
  if (state.skillPoints === undefined) state.skillPoints = 0;
  if (state.skills === undefined) state.skills = {};
  if (state.skillTreeProgress === undefined) state.skillTreeProgress = {};
}
export function allocateSkill(state, treeId, skillId) {
  const tree = skillTree(treeId);
  if (!tree) return false;
  const skill = tree.branches.find((b) => b.id === skillId);
  if (!skill) return false;
  const cur = (state.skillTreeProgress[treeId] && state.skillTreeProgress[treeId][skillId]) || 0;
  if (cur >= skill.max) return false;
  if ((state.skillPoints || 0) < skill.cost) return false;
  state.skillPoints -= skill.cost;
  if (!state.skillTreeProgress[treeId]) state.skillTreeProgress[treeId] = {};
  state.skillTreeProgress[treeId][skillId] = (state.skillTreeProgress[treeId][skillId] || 0) + 1;
  if (!state.skills) state.skills = {};
  state.skills[skill.effect] = (state.skills[skill.effect] || 0) + 1;
  return true;
}
export function skillLevel(state, effectId) {
  return (state.skills && state.skills[effectId]) || 0;
}
