export const ITEMS = {
  health_potion: {
    id: 'health_potion',
    name: 'Healing Potion',
    type: 'consumable',
    rarity: 'common',
    heal: 40,
    buy: 20,
    sell: 10,
    desc: 'Restores a good chunk of health.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#50c070';
      ctx.fillRect(x, y + 4, s, s - 8);
      ctx.fillStyle = '#3a8a52';
      ctx.fillRect(x + 1, y + 5, s - 2, 2);
      ctx.fillStyle = '#7ae092';
      ctx.fillRect(x + 2, y + 6, s - 4, 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x + s / 2 - 2, y, 4, 4);
      ctx.fillStyle = '#c8402a';
      ctx.fillRect(x + s / 2 - 1, y + 1, 2, 3);
    },
  },
  super_potion: {
    id: 'super_potion',
    name: 'Greater Healing Potion',
    type: 'consumable',
    rarity: 'uncommon',
    heal: 90,
    buy: 50,
    sell: 25,
    desc: 'Restores a large mount of health.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#70d090';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#50a870';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillStyle = '#9af0b2';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x + s / 2 - 3, y, 6, 4);
      ctx.fillStyle = '#e8503a';
      ctx.fillRect(x + s / 2 - 2, y + 1, 4, 3);
    },
  },
  mana_potion: {
    id: 'mana_potion',
    name: 'Mana Potion',
    type: 'consumable',
    rarity: 'common',
    heal: 0,
    mana: 60,
    buy: 25,
    sell: 12,
    desc: 'Restores mana for casting.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#4a6ab0';
      ctx.fillRect(x, y + 4, s, s - 8);
      ctx.fillStyle = '#6a8ad0';
      ctx.fillRect(x + 1, y + 5, s - 2, 2);
      ctx.fillStyle = '#aac0f0';
      ctx.fillRect(x + 2, y + 6, s - 4, 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x + s / 2 - 2, y, 4, 4);
      ctx.fillStyle = '#6080d0';
      ctx.fillRect(x + s / 2 - 1, y + 1, 2, 3);
    },
  },
  wood_sword: {
    id: 'wood_sword',
    name: 'Wooden Sword',
    type: 'weapon',
    rarity: 'common',
    damage: 5,
    speed: 0.32,
    range: 14,
    knockback: 60,
    crit: 0.03,
    buy: 10,
    sell: 5,
    sprite: 'wood_sword',
    desc: 'A crude blade, but better than fists.',
    icon: (ctx, x, y, s) => {
      drawSword(ctx, x, y, s, '#7a5a3a', '#4a3218', '#1a0e04');
    },
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: 'weapon',
    rarity: 'common',
    damage: 9,
    speed: 0.34,
    range: 16,
    knockback: 80,
    crit: 0.04,
    buy: 70,
    sell: 35,
    sprite: 'iron_sword',
    desc: 'A reliable steel-edged blade.',
    icon: (ctx, x, y, s) => {
      drawSword(ctx, x, y, s, '#9a8a6a', '#6a5a4a', '#3a2a1c');
    },
  },
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    type: 'weapon',
    rarity: 'uncommon',
    damage: 13,
    speed: 0.32,
    range: 17,
    knockback: 90,
    crit: 0.06,
    buy: 160,
    sell: 80,
    sprite: 'steel_sword',
    desc: 'Well-balanced and sturdy.',
    icon: (ctx, x, y, s) => {
      drawSword(ctx, x, y, s, '#c8c0b0', '#8a8270', '#3a3228');
    },
  },
  battle_axe: {
    id: 'battle_axe',
    name: 'Battle Axe',
    type: 'weapon',
    rarity: 'uncommon',
    damage: 17,
    speed: 0.55,
    range: 15,
    knockback: 140,
    crit: 0.05,
    buy: 210,
    sell: 105,
    sprite: 'battle_axe',
    desc: 'Slow, heavy, and punishing.',
    icon: (ctx, x, y, s) => {
      drawAxe(ctx, x, y, s, '#9a7a4a', '#5a3a1c', '#1a1208');
    },
  },
  warhammer: {
    id: 'warhammer',
    name: 'Warhammer',
    type: 'weapon',
    rarity: 'rare',
    damage: 21,
    speed: 0.6,
    range: 14,
    knockback: 170,
    crit: 0.07,
    buy: 420,
    sell: 210,
    sprite: 'warhammer',
    desc: 'Smash through anything.',
    icon: (ctx, x, y, s) => {
      drawHammer(ctx, x, y, s, '#8a8a92', '#4a4a52', '#1a1a22');
    },
  },
  spear: {
    id: 'spear',
    name: 'Spear',
    type: 'weapon',
    rarity: 'common',
    damage: 10,
    speed: 0.36,
    range: 22,
    knockback: 70,
    crit: 0.05,
    buy: 80,
    sell: 40,
    sprite: 'spear',
    desc: 'Reach matters.',
    icon: (ctx, x, y, s) => {
      drawSpear(ctx, x, y, s, '#9a8a6a', '#6a5a4a', '#2a1a0c');
    },
  },
  dagger: {
    id: 'dagger',
    name: 'Dagger',
    type: 'weapon',
    rarity: 'uncommon',
    damage: 7,
    speed: 0.22,
    range: 12,
    knockback: 40,
    crit: 0.12,
    buy: 120,
    sell: 60,
    sprite: 'dagger',
    desc: 'Fast and cruel in close quarters.',
    icon: (ctx, x, y, s) => {
      drawDagger(ctx, x, y, s, '#b8b0a0', '#6a6258', '#1a1610');
    },
  },
  shortbow: {
    id: 'shortbow',
    name: 'Shortbow',
    type: 'ranged',
    rarity: 'uncommon',
    damage: 9,
    speed: 0.45,
    range: 60,
    knockback: 30,
    ammo: 'arrow',
    buy: 150,
    sell: 75,
    sprite: 'shortbow',
    desc: 'Quick to draw, light to carry.',
    icon: (ctx, x, y, s) => {
      drawBow(ctx, x, y, s, '#8a6a3a', '#4a3218', '#1a1008');
    },
  },
  longbow: {
    id: 'longbow',
    name: 'Longbow',
    type: 'ranged',
    rarity: 'rare',
    damage: 14,
    speed: 0.55,
    range: 90,
    knockback: 40,
    ammo: 'arrow',
    buy: 360,
    sell: 180,
    sprite: 'longbow',
    desc: 'For hunters of dangerous game.',
    icon: (ctx, x, y, s) => {
      drawBow(ctx, x, y, s, '#9a7a4a', '#5a3a1c', '#1a1208');
    },
  },
  hand_axe: {
    id: 'hand_axe',
    name: 'Hand Axe',
    type: 'weapon',
    rarity: 'common',
    damage: 8,
    speed: 0.4,
    range: 13,
    knockback: 85,
    crit: 0.04,
    buy: 90,
    sell: 45,
    sprite: 'hand_axe',
    desc: 'Cheap iron that chops harder than it should.',
    icon: (ctx, x, y, s) => drawAxe(ctx, x, y, s, '#9a7a4a', '#5a3a1c', '#1a1208'),
  },
  mace: {
    id: 'mace',
    name: 'Iron Mace',
    type: 'weapon',
    rarity: 'uncommon',
    damage: 12,
    speed: 0.46,
    range: 13,
    knockback: 110,
    crit: 0.04,
    buy: 150,
    sell: 75,
    sprite: 'mace',
    desc: 'Blunt force; armour is only a suggestion.',
    icon: (ctx, x, y, s) => drawHammer(ctx, x, y, s, '#9a9aa2', '#5a5a62', '#1a1a22'),
  },
  rapier: {
    id: 'rapier',
    name: 'Rapier',
    type: 'weapon',
    rarity: 'uncommon',
    damage: 10,
    speed: 0.22,
    range: 19,
    knockback: 40,
    crit: 0.16,
    buy: 240,
    sell: 120,
    sprite: 'rapier',
    desc: 'A needle that finds the seam in any guard.',
    icon: (ctx, x, y, s) => drawDagger(ctx, x, y, s, '#c8c8d0', '#7a7a86', '#1a1a22'),
  },
  war_pick: {
    id: 'war_pick',
    name: 'War Pick',
    type: 'weapon',
    rarity: 'uncommon',
    damage: 15,
    speed: 0.44,
    range: 16,
    knockback: 95,
    crit: 0.07,
    buy: 280,
    sell: 140,
    sprite: 'war_pick',
    desc: 'Punches through plate and bone alike.',
    icon: (ctx, x, y, s) => drawAxe(ctx, x, y, s, '#b8b8c0', '#6a6a74', '#1a1a22'),
  },
  halberd: {
    id: 'halberd',
    name: 'Halberd',
    type: 'weapon',
    rarity: 'rare',
    damage: 16,
    speed: 0.5,
    range: 24,
    knockback: 120,
    crit: 0.05,
    buy: 320,
    sell: 160,
    sprite: 'halberd',
    desc: 'A spear that also disagrees with shields.',
    icon: (ctx, x, y, s) => drawSpear(ctx, x, y, s, '#c8c8d0', '#6a6a74', '#2a1a0c'),
  },
  runed_sword: {
    id: 'runed_sword',
    name: 'Runed Blade',
    type: 'weapon',
    rarity: 'rare',
    damage: 19,
    speed: 0.3,
    range: 18,
    knockback: 90,
    crit: 0.11,
    buy: 560,
    sell: 280,
    sprite: 'runed_sword',
    desc: 'The old runes drink blood and give back speed.',
    icon: (ctx, x, y, s) => drawSword(ctx, x, y, s, '#d05a4a', '#8a2a20', '#3a1210'),
  },
  flail: {
    id: 'flail',
    name: 'Flail',
    type: 'weapon',
    rarity: 'epic',
    damage: 24,
    speed: 0.62,
    range: 15,
    knockback: 190,
    crit: 0.06,
    buy: 640,
    sell: 320,
    sprite: 'flail',
    desc: 'Impossible to block, impossible to aim.',
    icon: (ctx, x, y, s) => drawHammer(ctx, x, y, s, '#c8b8a0', '#6a5a4a', '#1a1208'),
  },
  crossbow: {
    id: 'crossbow',
    name: 'Crossbow',
    type: 'ranged',
    rarity: 'rare',
    damage: 18,
    speed: 0.7,
    range: 100,
    knockback: 55,
    crit: 0.08,
    ammo: 'arrow',
    buy: 520,
    sell: 260,
    sprite: 'crossbow',
    desc: 'Slow to wind, brutal when it lands.',
    icon: (ctx, x, y, s) => drawBow(ctx, x, y, s, '#9a8a6a', '#5a4a3a', '#1a1208'),
  },
  runed_staff: {
    id: 'runed_staff',
    name: 'Runed Staff',
    type: 'weapon',
    rarity: 'rare',
    damage: 15,
    speed: 0.46,
    range: 24,
    knockback: 60,
    crit: 0.05,
    buy: 380,
    sell: 190,
    sprite: 'runed_staff',
    desc: 'Crackling focus for a shard of blue fire.',
    icon: (ctx, x, y, s) => drawSpear(ctx, x, y, s, '#6ad0f0', '#3a6a8a', '#2a1a0c'),
  },
  arrow: {
    id: 'arrow',
    name: 'Arrow',
    type: 'ammo',
    rarity: 'common',
    damage: 0,
    buy: 4,
    sell: 2,
    desc: 'A simple fletched arrow.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#8a6a3a';
      ctx.fillRect(x + 4, y + 2, s - 8, 3);
      ctx.fillStyle = '#c8b08a';
      ctx.fillRect(x + 6, y + 1, s - 12, 1);
      ctx.fillStyle = '#3a2a1c';
      ctx.fillRect(x + s - 2, y + 3, 2, 1);
    },
  },
  iron_ingot: {
    id: 'iron_ingot',
    name: 'Iron Ingot',
    type: 'material',
    rarity: 'common',
    buy: 8,
    sell: 4,
    desc: 'A bar of worked iron.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#9a8a6a';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#6a5a4a';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillStyle = '#c8b89a';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  copper_ingot: {
    id: 'copper_ingot',
    name: 'Copper Ingot',
    type: 'material',
    rarity: 'common',
    buy: 5,
    sell: 2,
    desc: 'A reddish worked metal.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#b8784a';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#7a4a2a';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillStyle = '#d89a6a';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  silver_ingot: {
    id: 'silver_ingot',
    name: 'Silver Ingot',
    type: 'material',
    rarity: 'uncommon',
    buy: 30,
    sell: 15,
    desc: 'Pale and cold to the touch.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#c8c8d8';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#8a8a9a';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillStyle = '#e8e8f0';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  gold_ingot: {
    id: 'gold_ingot',
    name: 'Gold Ingot',
    type: 'material',
    rarity: 'rare',
    buy: 120,
    sell: 60,
    desc: 'Heavy, bright, and valuable.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#e8c060';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#a88830';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillStyle = '#f8e090';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  void_crystal: {
    id: 'void_crystal',
    name: 'Void Crystal',
    type: 'material',
    rarity: 'epic',
    buy: 0,
    sell: 220,
    desc: 'A shard of something not of this world.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#5a3a8a';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#8a5ac8';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillStyle = '#b88ae0';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  leather_craft: {
    id: 'leather_craft',
    name: 'Cured Leather',
    type: 'material',
    rarity: 'common',
    buy: 6,
    sell: 3,
    desc: 'Tough leather for armor and gear.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#7a5a3a';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#4a3218';
      for (let i = 0; i < 3; i++) ctx.fillRect(x + i * 4, y + 4, 2, s - 8);
    },
  },
  wood_craft: {
    id: 'wood_craft',
    name: 'Hardwood Plank',
    type: 'material',
    rarity: 'common',
    buy: 3,
    sell: 1,
    desc: 'A solid plank of seasoned wood.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#7a5232';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#4a3018';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillRect(x + 2, y + 6, s - 4, 2);
      ctx.fillStyle = '#9a6a42';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  iron_helm: {
    id: 'iron_helm',
    name: 'Iron Helm',
    type: 'armor',
    slot: 'head',
    rarity: 'common',
    defense: 4,
    weight: 3,
    buy: 50,
    sell: 25,
    desc: 'Simple head defense.',
    icon: (ctx, x, y, s) => {
      drawArmorHead(ctx, x, y, s, '#9a8a6a', '#5a4a3a', '#2a1a0c');
    },
  },
  leather_helm: {
    id: 'leather_helm',
    name: 'Leather Cap',
    type: 'armor',
    slot: 'head',
    rarity: 'common',
    defense: 2,
    weight: 1,
    buy: 20,
    sell: 10,
    desc: 'Light and easy to wear.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#7a5a3a';
      ctx.fillRect(x, y + 3, s, s - 6);
      ctx.fillStyle = '#4a3218';
      ctx.fillRect(x + 1, y + 4, s - 2, 2);
      ctx.fillRect(x + 2, y + 6, s - 4, 2);
      ctx.fillStyle = '#9a7a52';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
    },
  },
  iron_chest: {
    id: 'iron_chest',
    name: 'Iron Chestpiece',
    type: 'armor',
    slot: 'chest',
    rarity: 'common',
    defense: 7,
    weight: 5,
    buy: 80,
    sell: 40,
    desc: 'Solid protection for the torso.',
    icon: (ctx, x, y, s) => {
      drawArmorChest(ctx, x, y, s, '#9a8a6a', '#5a4a3a', '#2a1a0c');
    },
  },
  leather_vest: {
    id: 'leather_vest',
    name: 'Leather Vest',
    type: 'armor',
    slot: 'chest',
    rarity: 'common',
    defense: 3,
    weight: 2,
    buy: 35,
    sell: 18,
    desc: 'Flexible and quiet.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#7a5a3a';
      ctx.fillRect(x, y + 2, s, s - 4);
      ctx.fillStyle = '#4a3218';
      ctx.fillRect(x + 1, y + 3, s - 2, 2);
      ctx.fillRect(x + 1, y + 5, s - 2, 2);
    },
  },
  iron_greaves: {
    id: 'iron_greaves',
    name: 'Iron Leg Armor',
    type: 'armor',
    slot: 'legs',
    rarity: 'common',
    defense: 5,
    weight: 4,
    buy: 60,
    sell: 30,
    desc: 'Durable shin and thigh guards.',
    icon: (ctx, x, y, s) => {
      drawArmorLegs(ctx, x, y, s, '#9a8a6a', '#5a4a3a', '#2a1a0c');
    },
  },
  leather_boots: {
    id: 'leather_boots',
    name: 'Leather Boots',
    type: 'armor',
    slot: 'feet',
    rarity: 'common',
    defense: 2,
    weight: 1,
    buy: 18,
    sell: 9,
    desc: 'Sturdy boots for long roads.',
    icon: (ctx, x, y, s) => {
      ctx.fillStyle = '#5a3a1c';
      ctx.fillRect(x + 1, y + 4, s - 2, s - 8);
      ctx.fillStyle = '#3a2410';
      ctx.fillRect(x + 2, y + 5, s - 4, 2);
      ctx.fillRect(x + 2, y + 7, s - 4, 2);
    },
  },
  iron_gloves: {
    id: 'iron_gloves',
    name: 'Iron Gauntlets',
    type: 'armor',
    slot: 'hands',
    rarity: 'common',
    defense: 3,
    weight: 2,
    buy: 40,
    sell: 20,
    desc: 'Heavy but protective gloves.',
    icon: (ctx, x, y, s) => {
      drawArmorHands(ctx, x, y, s, '#9a8a6a', '#5a4a3a', '#2a1a0c');
    },
  },
};
const drawSword = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = light;
  ctx.fillRect(x + 2, y + 2, s - 12, s - 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 2, y + 2, s - 12, 2);
  ctx.fillRect(x + 2, y + s - 6, s - 12, 2);
  ctx.fillStyle = dark;
  ctx.fillRect(x + s - 6, y + 1, 4, s - 2);
  ctx.fillStyle = light;
  ctx.fillRect(x + s - 5, y + 2, 2, s - 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 4, y + 1, 2, 2);
};
const drawAxe = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + s - 8, y + 2, 3, s - 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + s - 7, y + 3, 1, s - 6);
  ctx.fillStyle = light;
  ctx.fillRect(x + 2, y + 3, s - 10, 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 3, y + 4, s - 12, 2);
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.ellipse(x + s / 2, y + s / 2, s / 2 - 2, s / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.ellipse(x + s / 2, y + s / 2 - 1, s / 2 - 5, s / 3 - 2, 0, 0, Math.PI * 2);
  ctx.fill();
};
const drawHammer = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + s - 6, y + 2, 4, s - 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + s - 5, y + 3, 2, s - 6);
  ctx.fillStyle = light;
  ctx.fillRect(x + 2, y + 2, s - 8, 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 3, y + 3, s - 10, 2);
  ctx.fillStyle = dark;
  ctx.fillRect(x + s / 2 - 4, y + s / 2 - 3, 8, 6);
  ctx.fillStyle = mid;
  ctx.fillRect(x + s / 2 - 3, y + s / 2 - 2, 6, 4);
};
const drawSpear = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + s / 2 - 1, y + 1, 2, s - 2);
  ctx.fillStyle = mid;
  ctx.fillRect(x + s / 2 - 1, y + 1, 2, 2);
  ctx.fillRect(x + s / 2 - 1, y + s - 3, 2, 2);
  ctx.fillStyle = light;
  ctx.fillRect(x + s / 2, y + 2, 2, s - 4);
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.arc(x + s / 2, y + 1, 3, 0, Math.PI * 2);
  ctx.fill();
};
const drawDagger = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + s / 2 - 1, y + 1, 2, s - 2);
  ctx.fillStyle = light;
  ctx.fillRect(x + s / 2 - 1, y + 2, 2, s - 4);
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.moveTo(x + 2, y + s / 2);
  ctx.lineTo(x + s - 3, y + s / 2 - 3);
  ctx.lineTo(x + s - 3, y + s / 2 + 3);
  ctx.closePath();
  ctx.fill();
};
const drawBow = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + 2, y + 2, s - 4, 3);
  ctx.fillRect(x + 2, y + s - 5, s - 4, 3);
  ctx.strokeStyle = light;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + s / 2, y + s / 2, (s - 6) / 2, 0, Math.PI);
  ctx.stroke();
  ctx.fillStyle = mid;
  ctx.fillRect(x + s / 2 - 1, y + 4, 2, s - 8);
};
const drawArmorHead = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + 2, y + s - 5, s - 4, 3);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 2, y + 4, s - 4, s - 9);
  ctx.fillStyle = light;
  ctx.fillRect(x + 3, y + 5, s - 6, 2);
  ctx.fillRect(x + 3, y + s - 6, s - 6, 2);
};
const drawArmorChest = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + 2, y + 2, s - 4, 3);
  ctx.fillRect(x + 2, y + s - 5, s - 4, 3);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 2, y + 5, s - 4, s - 10);
  ctx.fillStyle = light;
  ctx.fillRect(x + 3, y + 6, s - 6, 2);
  ctx.fillRect(x + 3, y + s - 7, s - 6, 2);
};
const drawArmorLegs = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + 2, y + 2, 3, s - 4);
  ctx.fillRect(x + s - 5, y + 2, 3, s - 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 5, y + 3, s - 10, s - 6);
  ctx.fillStyle = light;
  ctx.fillRect(x + 6, y + 4, s - 12, 2);
  ctx.fillRect(x + 6, y + s - 6, s - 12, 2);
};
const drawArmorHands = (ctx, x, y, s, light, mid, dark) => {
  ctx.fillStyle = dark;
  ctx.fillRect(x + 2, y + 2, s - 4, 3);
  ctx.fillRect(x + 2, y + s - 5, s - 4, 3);
  ctx.fillStyle = mid;
  ctx.fillRect(x + 2, y + 5, s - 4, s - 10);
  ctx.fillStyle = light;
  ctx.fillRect(x + 3, y + 6, s - 6, 2);
  ctx.fillRect(x + 3, y + s - 7, s - 6, 2);
};
export const WEAPON_KINDS = ['weapon', 'ranged'];
export const CONSUMABLE_KINDS = ['consumable'];
export const SHOP_BY_MERCHANT = {
  blacksmith: ['hand_axe', 'iron_sword', 'spear', 'dagger', 'steel_sword', 'mace', 'battle_axe', 'rapier', 'war_pick', 'halberd', 'runed_staff', 'warhammer', 'shortbow', 'crossbow', 'longbow', 'runed_sword', 'flail', 'iron_ingot', 'copper_ingot', 'silver_ingot', 'gold_ingot', 'void_crystal', 'leather_craft', 'wood_craft', 'iron_helm', 'iron_chest', 'iron_greaves', 'iron_gloves', 'leather_helm', 'leather_vest', 'leather_boots'],
  general: ['health_potion', 'super_potion', 'mana_potion', 'arrow', 'shortbow', 'iron_ingot', 'copper_ingot', 'leather_craft', 'wood_craft'],
  potions: ['health_potion', 'super_potion', 'mana_potion'],
};
