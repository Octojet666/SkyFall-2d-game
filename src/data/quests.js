export const QUEST_DEFS = {
  goblin_clearing: {
    id: 'goblin_clearing',
    name: 'Clear the Goblin Camp',
    summary: 'Slay three goblins and report back to Elder Maren.',
    region: 'ash',
    npc: 'elder_maren',
    stages: [
      { name: 'Accept quest', desc: 'Speak with Elder Maren to take up the task.', done: false },
      { name: 'Slay goblins', desc: 'Kill 3 goblins.', done: false, need: 3, kind: 'goblin' },
      { name: 'Report back', desc: 'Return to Elder Maren.', done: false, stage: 2 },
    ],
    rewards: { gold: 50, xp: 30, item: null },
    completeText: 'Elder Maren thanks you and rewards you.',
  },
  forest_ears: {
    id: 'forest_ears',
    name: 'Goblin Ears for Brann',
    summary: 'Collect 5 goblin ears and deliver them to Brann the Smith.',
    region: 'forest',
    npc: 'brann_smith',
    stages: [
      { name: 'Accept quest', desc: 'Speak with Brann the Smith.', done: false },
      { name: 'Collect ears', desc: 'Gather 5 goblin ears.', done: false, need: 5, item: 'goblin_ear' },
      { name: 'Deliver ears', desc: 'Return to Brann the Smith.', done: false, stage: 2 },
    ],
    rewards: { gold: 80, xp: 45, item: 'iron_sword' },
    completeText: 'Brann nods and rewards your diligence.',
  },
  ruin_descent: {
    id: 'ruin_descent',
    name: 'Investigate the Ruins',
    summary: 'Descend into the Forgotten Ruins and return with a silver ingot.',
    region: 'forest',
    npc: 'runekeeper',
    stages: [
      { name: 'Accept quest', desc: 'Speak with Runekeeper Sol.', done: false },
      { name: 'Enter the ruins', desc: 'Reach the Forgotten Ruins region.', done: false, region: 'ruin' },
      { name: 'Bring silver', desc: 'Retrieve a silver ingot.', done: false, item: 'silver_ingot' },
      { name: 'Return to Runekeeper', desc: 'Return with your find.', done: false, stage: 3 },
    ],
    rewards: { gold: 120, xp: 70, item: 'mana_potion' },
    completeText: 'Runekeeper Sol studies your find and nods.',
  },
  blackthorn_invitation: {
    id: 'blackthorn_invitation',
    name: 'The Keep Calls',
    summary: 'Travel to Blackthorn Keep and speak with Warden Kael.',
    region: 'ruin',
    npc: 'forge_warden',
    stages: [
      { name: 'Accept quest', desc: 'Speak with Warden Kael.', done: false },
      { name: 'Reach the keep', desc: 'Travel to Blackthorn Keep.', done: false, region: 'blackthorn' },
      { name: 'Speak with the Warden', desc: 'Tell Warden Kael you are ready.', done: false, stage: 2 },
    ],
    rewards: { gold: 60, xp: 40, item: null },
    completeText: 'Warden Kael marks you as a real threat to the Warlord.',
  },
  blackthorn_warlord: {
    id: 'blackthorn_warlord',
    name: 'Topple the Warlord',
    summary: 'Defeat the Blackthorn Warlord and return his token.',
    region: 'blackthorn',
    npc: 'forge_warden',
    stages: [
      { name: 'Accept quest', desc: 'Accept the warlord contract.', done: false },
      { name: 'Defeat the Warlord', desc: 'Kill the Blackthorn Warlord boss.', done: false, boss: 'blackthorn_warlord' },
      { name: 'Return the token', desc: 'Bring the token back to Warden Kael.', done: false, stage: 2 },
    ],
    rewards: { gold: 250, xp: 120, item: 'steel_sword' },
    completeText: 'Warden Kael salutes you. The keep is breathing again.',
  },
  merchant_missing: {
    id: 'merchant_marvel',
    name: 'Find the Wandering Merchant',
    summary: 'Find Vessa the Wanderer in the Whispering Forest and buy a potion from her.',
    region: 'ash',
    npc: 'itinerantmerchant',
    stages: [
      { name: 'Accept quest', desc: 'Speak with anyone about the missing trader.', done: false },
      { name: 'Find Vessa', desc: 'Meet Vessa in the forest.', done: false, npc: 'itinerantmerchant' },
      { name: 'Buy a potion', desc: 'Purchase any potion from Vessa.', done: false, item: 'health_potion' },
    ],
    rewards: { gold: 30, xp: 20, item: 'super_potion' },
    completeText: 'Vessa grins and slides you a stronger bottle.',
  },
  bow_hunter: {
    id: 'bow_hunter',
    name: 'The Archer’s Trial',
    summary: 'Defeat 8 enemies with a bow equipped.',
    region: 'forest',
    npc: 'itinerantmerchant',
    stages: [
      { name: 'Accept quest', desc: 'Take the archer’s trial.', done: false },
      { name: 'Ranged kills', desc: 'Kill 8 enemies while a bow is equipped.', done: false, need: 8, kind: 'ranged_kills' },
    ],
    rewards: { gold: 90, xp: 55, item: 'longbow' },
    completeText: 'The merchant nods at your aim.',
  },
  smithing_run: {
    id: 'smithing_run',
    name: 'Iron Run',
    summary: 'Bring 4 iron ingots to Brann the Smith.',
    region: 'ash',
    npc: 'brann_smith',
    stages: [
      { name: 'Accept quest', desc: 'Take the iron run.', done: false },
      { name: 'Collect iron', desc: 'Gather 4 iron ingots.', done: false, need: 4, item: 'iron_ingot' },
      { name: 'Deliver iron', desc: 'Return to Brann the Smith.', done: false, stage: 2 },
    ],
    rewards: { gold: 70, xp: 40, item: 'iron_chest' },
    completeText: 'Brann stacks your iron and smiles.',
  },
  frost_herbs: {
    id: 'frost_herbs',
    name: 'Frostveil Potions',
    summary: 'Collect 3 greater healing potions in Frostveil Foothills.',
    region: 'frost',
    npc: 'potion_merchant',
    stages: [
      { name: 'Accept quest', desc: 'Speak with One-Eyed Nera.', done: false },
      { name: 'Collect potions', desc: 'Find 3 greater healing potions.', done: false, need: 3, item: 'super_potion' },
      { name: 'Return to Nera', desc: 'Bring them back.', done: false, stage: 2 },
    ],
    rewards: { gold: 100, xp: 60, item: 'mana_potion' },
    completeText: 'Nera taps her eye patch and hands you coin.',
  },
  cave_spider_gather: {
    id: 'cave_spider_gather',
    name: 'Spider Silk',
    summary: 'Defeat 6 cave spiders in the Underdark.',
    region: 'underdark',
    npc: 'runekeeper',
    stages: [
      { name: 'Accept quest', desc: 'Speak with Runekeeper Sol about the caves.', done: false },
      { name: 'Spider kills', desc: 'Kill 6 cave spiders.', done: false, need: 6, kind: 'cave_spider' },
    ],
    rewards: { gold: 85, xp: 50, item: 'leather_vest' },
    completeText: 'Runekeeper Sol takes your report and rewards you.',
  },
};
export const QUEST_ORDER = Object.keys(QUEST_DEFS);
export function questDef(id) {
  return QUEST_DEFS[id] || null;
}
export function startQuest(state, id) {
  if (!state.quests[id]) {
    state.quests[id] = {
      id,
      stages: QUEST_DEFS[id].stages.map((s) => ({ ...s })),
      completed: false,
      claimed: false,
    };
  }
  const q = state.quests[id];
  if (q.completed) return;
  q.stages[0].done = true;
}
export function advanceQuest(state, id, stage) {
  const q = state.quests[id];
  if (!q || q.completed) return;
  const def = QUEST_DEFS[id];
  if (!def) return;
  if (stage === 0) {
    startQuest(state, id);
    return;
  }
  const target = q.stages[stage];
  if (!target) return;
  if (target.done) return;
  if (target.kind) {
    if (!state.killCounts) state.killCounts = {};
    if (!state.killCounts[target.kind]) state.killCounts[target.kind] = 0;
    state.killCounts[target.kind]++;
    if (state.killCounts[target.kind] >= target.need) target.done = true;
  }
  if (target.item) {
    if (!state.items) state.items = {};
    if (!state.items[target.item]) state.items[target.item] = 0;
    state.items[target.item]++;
    if (state.items[target.item] >= target.need) target.done = true;
  }
  if (target.region) {
    if (!state.visitedRegions) state.visitedRegions = new Set();
    if (state.visitedRegions.has(target.region)) target.done = true;
  }
  if (target.npc) {
    if (!state.metNpcs) state.metNpcs = new Set();
    if (state.metNpcs.has(target.npc)) target.done = true;
  }
  if (target.boss) {
    if (!state.bosses) state.bosses = new Set();
    if (state.bosses.has(target.boss)) target.done = true;
  }
  // A stage with no criteria ("report back", "accept the task") is satisfied
  // simply by reaching it. Later stages are never auto-completed.
  const hasCriteria = target.kind || target.item || target.region || target.npc || target.boss;
  if (!hasCriteria) target.done = true;
}
export function completeQuest(state, id) {
  const q = state.quests[id];
  if (!q || q.completed) return null;
  const def = QUEST_DEFS[id];
  const last = q.stages[q.stages.length - 1];
  if (last && last.done === false) return null;
  q.completed = true;
  return def.rewards;
}
export function claimQuest(state, id) {
  const q = state.quests[id];
  if (!q || !q.completed || q.claimed) return null;
  q.claimed = true;
  const def = QUEST_DEFS[id];
  return def.rewards;
}
export function activeQuestIds(state) {
  return Object.keys(state.quests).filter((id) => {
    const q = state.quests[id];
    return !q.claimed && !q.completed;
  });
}
export function questProgress(state, id) {
  const q = state.quests[id];
  if (!q) return null;
  const def = QUEST_DEFS[id];
  const stage = q.stages.findIndex((s) => s.done === false);
  return {
    id,
    name: def.name,
    currentStage: stage >= 0 ? stage : def.stages.length - 1,
    stages: q.stages.map((s) => ({ ...s })),
    completed: q.completed,
    claimed: q.claimed,
  };
}
