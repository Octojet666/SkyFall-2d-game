export const RECIPES = {
  iron_sword_forge: {
    id: 'iron_sword_forge',
    name: 'Forge Iron Sword',
    category: 'weapon',
    output: 'iron_sword',
    outputQty: 1,
    materials: [['iron_ingot', 2], ['wood_craft', 1]],
    time: 4,
    station: 'blacksmith',
  },
  steel_sword_forge: {
    id: 'steel_sword_forge',
    name: 'Forge Steel Sword',
    category: 'weapon',
    output: 'steel_sword',
    outputQty: 1,
    materials: [['iron_ingot', 3], ['silver_ingot', 1], ['wood_craft', 2]],
    time: 6,
    station: 'blacksmith',
  },
  battle_axe_forge: {
    id: 'battle_axe_forge',
    name: 'Forge Battle Axe',
    category: 'weapon',
    output: 'battle_axe',
    outputQty: 1,
    materials: [['iron_ingot', 4], ['copper_ingot', 2], ['leather_craft', 1]],
    time: 6,
    station: 'blacksmith',
  },
  warhammer_forge: {
    id: 'warhammer_forge',
    name: 'Forge Warhammer',
    category: 'weapon',
    output: 'warhammer',
    outputQty: 1,
    materials: [['iron_ingot', 5], ['silver_ingot', 2], ['gold_ingot', 1]],
    time: 8,
    station: 'blacksmith',
  },
  spear_forge: {
    id: 'spear_forge',
    name: 'Forge Spear',
    category: 'weapon',
    output: 'spear',
    outputQty: 1,
    materials: [['iron_ingot', 2], ['wood_craft', 3]],
    time: 4,
    station: 'blacksmith',
  },
  dagger_forge: {
    id: 'dagger_forge',
    name: 'Forge Dagger',
    category: 'weapon',
    output: 'dagger',
    outputQty: 1,
    materials: [['iron_ingot', 1], ['copper_ingot', 1]],
    time: 2,
    station: 'blacksmith',
  },
  shortbow_forge: {
    id: 'shortbow_forge',
    name: 'Forge Shortbow',
    category: 'weapon',
    output: 'shortbow',
    outputQty: 1,
    materials: [['wood_craft', 3], ['leather_craft', 1], ['iron_ingot', 1]],
    time: 4,
    station: 'blacksmith',
  },
  longbow_forge: {
    id: 'longbow_forge',
    name: 'Forge Longbow',
    category: 'weapon',
    output: 'longbow',
    outputQty: 1,
    materials: [['wood_craft', 5], ['leather_craft', 2], ['iron_ingot', 2]],
    time: 6,
    station: 'blacksmith',
  },
  arrow_craft: {
    id: 'arrow_craft',
    name: 'Fletch Arrows',
    category: 'ammo',
    output: 'arrow',
    outputQty: 5,
    materials: [['wood_craft', 2], ['leather_craft', 1]],
    time: 2,
    station: 'blacksmith',
  },
  iron_helm_forge: {
    id: 'iron_helm_forge',
    name: 'Forge Iron Helm',
    category: 'armor',
    output: 'iron_helm',
    outputQty: 1,
    materials: [['iron_ingot', 2], ['leather_craft', 1]],
    time: 3,
    station: 'blacksmith',
  },
  leather_helm_forge: {
    id: 'leather_helm_forge',
    name: 'Stitch Leather Cap',
    category: 'armor',
    output: 'leather_helm',
    outputQty: 1,
    materials: [['leather_craft', 2], ['wood_craft', 1]],
    time: 2,
    station: 'blacksmith',
  },
  iron_chest_forge: {
    id: 'iron_chest_forge',
    name: 'Forge Iron Chestpiece',
    category: 'armor',
    output: 'iron_chest',
    outputQty: 1,
    materials: [['iron_ingot', 3], ['leather_craft', 1]],
    time: 4,
    station: 'blacksmith',
  },
  leather_vest_forge: {
    id: 'leather_vest_forge',
    name: 'Stitch Leather Vest',
    category: 'armor',
    output: 'leather_vest',
    outputQty: 1,
    materials: [['leather_craft', 3], ['wood_craft', 1]],
    time: 3,
    station: 'blacksmith',
  },
  iron_greaves_forge: {
    id: 'iron_greaves_forge',
    name: 'Forge Iron Greaves',
    category: 'armor',
    output: 'iron_greaves',
    outputQty: 1,
    materials: [['iron_ingot', 2], ['leather_craft', 2]],
    time: 3,
    station: 'blacksmith',
  },
  leather_boots_forge: {
    id: 'leather_boots_forge',
    name: 'Stitch Leather Boots',
    category: 'armor',
    output: 'leather_boots',
    outputQty: 1,
    materials: [['leather_craft', 2], ['wood_craft', 1]],
    time: 2,
    station: 'blacksmith',
  },
  iron_gloves_forge: {
    id: 'iron_gloves_forge',
    name: 'Forge Iron Gauntlets',
    category: 'armor',
    output: 'iron_gloves',
    outputQty: 1,
    materials: [['iron_ingot', 1], ['leather_craft', 1]],
    time: 2,
    station: 'blacksmith',
  },
  health_potion_craft: {
    id: 'health_potion_craft',
    name: 'Brew Healing Potion',
    category: 'potion',
    output: 'health_potion',
    outputQty: 2,
    materials: [['copper_ingot', 1], ['leather_craft', 1]],
    time: 2,
    station: 'potions',
  },
  super_potion_craft: {
    id: 'super_potion_craft',
    name: 'Brew Greater Healing Potion',
    category: 'potion',
    output: 'super_potion',
    outputQty: 1,
    materials: [['silver_ingot', 1], ['copper_ingot', 2]],
    time: 3,
    station: 'potions',
  },
  mana_potion_craft: {
    id: 'mana_potion_craft',
    name: 'Brew Mana Potion',
    category: 'potion',
    output: 'mana_potion',
    outputQty: 2,
    materials: [['copper_ingot', 2], ['silver_ingot', 1]],
    time: 3,
    station: 'potions',
  },
};
export const RECIPE_IDS = Object.keys(RECIPES);
export function recipeDef(id) {
  return RECIPES[id] || null;
}
export function recipesByStation(station) {
  return RECIPE_IDS.filter((id) => RECIPES[id].station === station);
}
export function canCraft(state, recipeId) {
  const r = RECIPES[recipeId];
  if (!r) return false;
  const inv = state.inventory || {};
  for (const [id, qty] of r.materials) {
    if ((inv[id] || 0) < qty) return false;
  }
  return true;
}
export function craft(state, recipeId) {
  const r = RECIPES[recipeId];
  if (!r || !canCraft(state, recipeId)) return null;
  const inv = state.inventory || {};
  for (const [id, qty] of r.materials) {
    inv[id] -= qty;
    if (inv[id] <= 0) delete inv[id];
  }
  const out = { id: r.output, qty: r.outputQty };
  if (!inv[r.output]) inv[r.output] = 0;
  inv[r.output] += r.outputQty;
  state.inventory = inv;
  return out;
}
export function recipeCost(recipeId) {
  const r = RECIPES[recipeId];
  if (!r) return null;
  let total = 0;
  for (const [id, qty] of r.materials) {
    const def = (typeof window !== 'undefined' && window.SKYFALL_ITEMS) ? window.SKYFALL_ITEMS[id] : null;
    if (def && typeof def.sell === 'number') total += def.sell * qty;
  }
  return total;
}
