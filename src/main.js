import { Game } from './engine/Game.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Npc } from './entities/Npc.js';
import { Pickup } from './entities/Pickup.js';
import { World } from './world/World.js';
import { WorldSpawner } from './world/WorldSpawner.js';
import { WorldEntities } from './world/WorldEntities.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { InventorySystem } from './systems/InventorySystem.js';
import { EquipmentSystem } from './systems/EquipmentSystem.js';
import { ShopSystem } from './systems/ShopSystem.js';
import { ProgressionSystem } from './systems/ProgressionSystem.js';
import { SaveSystem } from './systems/SaveSystem.js';
import { DialogueSystem } from './systems/DialogueSystem.js';
import { QuestSystem } from './systems/QuestSystem.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { Hud } from './ui/Hud.js';
import { InventoryUI } from './ui/InventoryUI.js';
import { CharacterUI } from './ui/CharacterUI.js';
import { CharacterSelectUI } from './ui/CharacterSelectUI.js';
import { ShopUI } from './ui/ShopUI.js';
import { QuestUI } from './ui/QuestUI.js';
import { MapUI } from './ui/MapUI.js';
import { DialogueUI } from './ui/DialogueUI.js';
import { PauseUI } from './ui/PauseUI.js';
import { MainMenu } from './ui/MainMenu.js';
import { ITEMS } from './data/items.js';
import { NPCS } from './data/npcs.js';
import { QUEST_DEFS } from './data/quests.js';
import { T, W, H } from './utils/Constants.js';
import { clamp } from './utils/Random.js';

const cv = document.getElementById('c');
const g = cv.getContext('2d');

const game = new Game(cv);
const audio = new AudioSystem();
game.audio = audio;
audio.init();
audio.startMusic();

const world = new World();
game.setWorld(world);

const collision = new (window.Collision || class {
  constructor(w) { this.world = w; }
  hits(e) {
    const T = 16;
    const x0 = Math.floor((e.x - e.w / 2) / T);
    const x1 = Math.floor((e.x + e.w / 2) / T);
    const y0 = Math.floor((e.y - e.h) / T);
    const y1 = Math.floor(e.y / T);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (this.world.solid(tx, ty)) return true;
      }
    }
    return false;
  }
})(world);
game.collision = collision;

const player = new Player(80, world.height[5] * T - 2);
player.game = game;
game.setPlayer(player);

const combat = new CombatSystem(player);
const inventory = new InventorySystem(player);
const equipment = new EquipmentSystem(player);
const shop = new ShopSystem(player);
const progression = new ProgressionSystem(player);
const save = SaveSystem;
const dialogue = new DialogueSystem(player);
const quest = new QuestSystem(player);

const hud = new Hud();
game.hud = hud;

// UI panels reach the systems through game.systems.
game.systems = { quest, progression, inventory, equipment, shop, combat, dialogue, save };

// Progression owns XP/levels; combat grants it, the HUD announces it.
progression.init();
combat.progression = progression;
combat.quest = quest;
quest.progression = progression;
player.onLevelUp = (lvl) => {
  hud.setMessage('Level ' + lvl + '! Attribute and skill points gained.', 3);
  combat.addSpriteFx('confetti', player.x, player.y - 14, { life: 0.8 });
};
const entities = new WorldEntities(world);
entities.player = player; // drawn last so the hero sits in front of the world
game.entities = entities;
game.combat = combat;
const spawner = new WorldSpawner(world, entities);
game.spawner = spawner;

const invUI = new InventoryUI();
const charUI = new CharacterUI();
const heroUI = new CharacterSelectUI();
const shopUI = new ShopUI();
const questUI = new QuestUI();
const mapUI = new MapUI();
const dialogueUI = new DialogueUI();
const pauseUI = new PauseUI();

function openShop(merchantId) {
  shopUI.open(game, merchantId);
  game.openOverlay(shopUI);
}
function openInv() {
  invUI.open(game);
  game.openOverlay(invUI);
}
function openChar() {
  charUI.open(game);
  game.openOverlay(charUI);
}
function openHero() {
  heroUI.open(game);
  game.openOverlay(heroUI);
}
function openQuest() {
  questUI.open(game);
  game.openOverlay(questUI);
}
function openMap() {
  mapUI.open(game);
  game.openOverlay(mapUI);
}

function startGame() {
  player.x = 80;
  player.y = world.height[5] * T - 2;
  player.maxHp = 50;
  player.maxStamina = 60;
  player.maxMana = 30;
  player.hp = player.maxHp;
  player.stamina = player.maxStamina;
  player.mana = player.maxMana;
  player.gold = 20;
  player.inventory = { health_potion: 2, gold: 5, wood_sword: 1 };
  player.weapon = 'wood_sword';
  player.weaponName = ITEMS.wood_sword.name;
  player.level = 1;
  player.xp = 0;
  player.xpToNext = 20;
  player.killCount = 0;
  player.killsByKind = {};
  player.bossesDefeated = {};
  player.metNpcs = new Set([world.regionAt(player.x)]);
  player.visitedRegions = new Set([world.regionAt(player.x)]);
  player.items = {};
  player.quests = {};
  player.stats = { strength: 3, agility: 3, defense: 2, intelligence: 2, critical: 0.05 };
  player.statPoints = 0;
  player.skillPoints = 0;
  player.skills = {};
  player.skillTreeProgress = {};
  player.invDirty = true;
  player.equipment = equipment.emptyEquipment();
  spawner.clear();
  spawner.spawnInitial();
  lastRegion = world.regionAt(player.x);
  hud.setMessage('A new journey begins.', 3);
  game.paused = false;
  if (menu) menu.active = false;
}

function loadSave() {
  const d = save.readSave();
  if (!d) {
    hud.setMessage('No save found. Starting fresh.', 2);
    return false;
  }
  player.x = d.x;
  player.y = d.y;
  player.gold = d.gold;
  player.inventory = d.inv || {};
  player.level = d.level || 1;
  player.xp = d.xp || 0;
  player.hp = d.hp || player.maxHp;
  player.maxHp = d.maxHp || 50;
  player.weapon = d.weapon || 'wood_sword';
  player.weaponName = ITEMS[player.weapon]?.name || 'Fists';
  player.setHero(d.char || undefined);
  player.killCount = d.killCount || 0;
  player.killsByKind = d.killsByKind || {};
  player.bossesDefeated = d.bossesDefeated || {};
  player.metNpcs = new Set(d.metNpcs || []);
  player.visitedRegions = new Set(d.visitedRegions || []);
  player.items = d.items || {};
  player.quests = d.quests || {};
  player.stats = d.stats || { strength: 3, agility: 3, defense: 2, intelligence: 2, critical: 0.05 };
  player.statPoints = d.statPoints || 0;
  player.skillPoints = d.skillPoints || 0;
  player.skills = d.skills || {};
  player.skillTreeProgress = d.skillTreeProgress || {};
  player.maxStamina = 60;
  player.maxMana = 30;
  player.hp = Math.min(player.hp, player.maxHp);
  player.invDirty = true;
  player.equipment = (d.equipment && Object.keys(d.equipment).length) ? d.equipment : equipment.emptyEquipment();
  spawner.clear();
  spawner.spawnInitial();
  lastRegion = world.regionAt(player.x);
  hud.setMessage('Welcome back, traveler.', 2.5);
  game.paused = false;
  if (menu) menu.active = false;
  return true;
}

const menu = new MainMenu(cv);
menu.start(startGame, loadSave, () => {});

game.running = true;
game.paused = true;

const dialogueUI_ref = dialogueUI;

let last = performance.now();
game.time.last = last;
let paused = true;

function openPause() {
  paused = true;
  game.paused = true;
  game.openOverlay(pauseUI);
}

function closePause() {
  paused = false;
  game.closeOverlay();
  game.paused = false;
}

function togglePause() {
  // Read the live state: starting or loading a game sets game.paused directly.
  if (game.paused) closePause();
  else openPause();
}

game.pauseActions = {
  resume: closePause,
  save: () => autosave(),
  // Leave the pause menu, then open the roster as a normal overlay: closing it
  // puts you straight back in the world instead of into a frozen blank screen.
  hero: () => {
    paused = false;
    game.paused = false;
    game.closeOverlay();
    openHero();
  },
  quit: () => {
    autosave();
    game.closeOverlay();
    menu.active = true;
    game.paused = true;
    paused = true;
  },
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    if (dialogue.active) {
      dialogue.end();
      releaseDialogueOverlay();
      return;
    }
    if (game.overlay === pauseUI) {
      closePause();
      return;
    }
    if (game.overlay) {
      game.closeOverlay();
      return;
    }
    if (menu && menu.active) return;
    openPause();
    return;
  }
  if (game.paused || game.overlay || dialogue.active) return;
  if (e.code === 'KeyI') openInv();
  else if (e.code === 'KeyC') openHero();
  else if (e.code === 'KeyP') openChar();
  else if (e.code === 'KeyM') openMap();
  else if (e.code === 'KeyJ') openQuest();
});

function nvc(n) {
  const def = NPCS[n.id];
  if (!def || !def.dialogue) return null;
  if (n.id === 'elder_maren') {
    if (quest.currentStage('goblin_clearing') === 2) {
      return def.dialogue.complete.slice();
    }
    if (quest.has('goblin_clearing') && quest.currentStage('goblin_clearing') === 1) {
      return [
        def.dialogue.main[0],
        def.dialogue.main[1],
        'I have slain ' + (player.killsByKind['goblin'] || 0) + ' goblins. Need 3.',
        def.dialogue.main[2],
      ];
    }
  }
  return def.dialogue.greetings.slice();
}

/** Offer a quest on first talk, then hand it in once its final stage is reached. */
function handleQuestTalk(npc) {
  const id = npc && npc.quest;
  const def = id ? QUEST_DEFS[id] : null;
  if (!def) return;
  if (!quest.has(id)) {
    quest.start(id);
    hud.setMessage('Quest started: ' + def.name, 3);
    return;
  }
  const stage = quest.currentStage(id);
  if (stage === def.stages.length - 1) {
    const r = quest.claim(id);
    if (r) hud.setMessage('Quest complete! +' + r.gold + 'g +' + r.xp + ' XP', 3);
    else hud.setMessage('Finish the task before I can pay you.', 2.5);
    return;
  }
  if (stage >= 0) {
    hud.setMessage(def.stages[stage].name + ' - ' + def.stages[stage].desc, 3);
  }
}

function tryTalk() {
  if (dialogue.active || game.overlay) return;
  let best = null;
  let bestD = 26 * T + 1;
  for (const n of entities.npcs) {
    const d = Math.abs(n.x - player.x) + Math.abs(n.y - player.y);
    if (d < bestD) { bestD = d; best = n; }
  }
  if (!best) return;
  const lines = nvc(best);
  if (!lines) return;
  if (best.kind === 'shop') {
    openShop(best.id);
    return;
  }
  dialogue.start(best, lines, {
    done: () => handleQuestTalk(best),
  });
  game.openOverlay(dialogue);
}

function autosave() {
  save.writeSave({
    x: player.x,
    y: player.y,
    gold: player.gold,
    inv: player.inventory,
    level: player.level,
    xp: player.xp,
    hp: player.hp,
    maxHp: player.maxHp,
    weapon: player.weapon,
    char: player.heroId,
    quest: 0,
    kills: player.killCount,
    stats: player.stats,
    equipment: player.equipment,
    inventory: player.inventory,
    xpToNext: player.xpToNext,
    statPoints: player.statPoints,
    skillPoints: player.skillPoints,
    skills: player.skills,
    skillTreeProgress: player.skillTreeProgress,
    killCount: player.killCount,
    killsByKind: player.killsByKind,
    bossesDefeated: player.bossesDefeated,
    metNpcs: Array.from(player.metNpcs),
    visitedRegions: Array.from(player.visitedRegions),
    items: player.items,
    quests: player.quests,
  });
}

let lastRegion = world.regionAt(player.x);
player.visitedRegions.add(lastRegion);
spawner.spawnInitial();

let tick = 0;
let spawnTimer = 0;
let travelCd = 0;
let prevPlayerX = player.x;

/** The player's blade connects part-way through the swing. */
function resolvePlayerSwing() {
  if (player.attackAnim <= 0) {
    player._swingDone = false;
    return;
  }
  if (player._swingDone || player.attackAnim > 0.12) return;
  player._swingDone = true;
  const dir = player.facingDir;
  // Reach follows the weapon: a dagger needs you close, a halberd does not.
  const reach = (combat.weaponStats().range || 16) + 8 + player.w / 2;
  let hitAny = false;
  for (const e of entities.enemies.slice()) {
    if (e._removed || e.hp <= 0) continue;
    const dx = (e.x - player.x) * dir;
    if (dx < -8 || Math.abs(e.x - player.x) > reach + e.w / 2) continue;
    if (Math.abs((e.y - e.h / 2) - (player.y - player.h / 2)) > 24 + e.h / 2) continue;
    hitAny = true;
    const crit = Math.random() < combat.critChance();
    const dmg = Math.round(combat.meleeDamage() * (crit ? 1.6 : 1));
    combat.applyDamage(e, dmg, dir * 150, player);
    if (crit) combat.addFloatingText(e.x, e.y - 26, 'CRIT', '#ffd23f', 0.8);
  }
  if (hitAny) {
    game.camera.shakeOnce(2.4);
    combat.trails.push({ x: player.x + dir * 11, y: player.y - 11, life: 0.16, max: 0.16, size: 9, color: '#fff3c4' });
  }
}

function update(dt) {
  tick++;
  spawnTimer += dt;

  player.update(dt);
  game.camera.follow(player, world.W * T, world.H * T, dt);
  resolvePlayerSwing();
  entities.update(dt, player, world, combat);
  combat.update(dt);
  hud.update(dt);

  if (player.hp <= 0) {
    player.hp = player.maxHp;
    player.x = 80;
    player.y = world.height[5] * T - 2;
    player.gold = Math.floor(player.gold * 0.85);
    hud.setMessage('You fell. The village remembers you.', 3);
  }

  if (player.invDirty) {
    player.invDirty = false;
  }


  if (spawnTimer > 4) {
    spawnTimer = 0;
    if (Math.random() < 0.5) {
      const tx = 4 + Math.floor(Math.random() * (world.W - 6));
      const top = world.height[tx] || 10;
      const gold = 1 + Math.floor(Math.random() * 3);
      entities.spawnPickup(tx * T + 8, top * T - 6, 'gold', gold);
    } else {
      const tx = 4 + Math.floor(Math.random() * (world.W - 6));
      const top = world.height[tx] || 10;
      const kind = ['health_potion', 'super_potion', 'iron_ingot', 'copper_ingot'][Math.floor(Math.random() * 4)];
      entities.spawnPickup(tx * T + 8, top * T - 6, kind, 1);
    }
  }

  const reg = world.regionAt(player.x);
  if (reg !== lastRegion) {
    lastRegion = reg;
    player.visitedRegions.add(reg);
    hud.setMessage('Entering ' + (world.regionDef(reg)?.name || reg), 2);
    audio.play('door');
    if (reg === 'underdark') world.setWeather('rain');
    else if (reg === 'frost') world.setWeather('snow');
    else world.setWeather('clear');
  }

  // Travel: crossing a boundary post teleports you to the *start* of the next
  // region, so the destination always exists (the old +24 tiles ran past the
  // last region and dropped the player outside the world).
  if (travelCd > 0) travelCd -= dt;
  const tr = world.transitionAt(player.x);
  // Reach the post on foot and you travel; no need to come to a full stop, and
  // the destination is far enough past the post that it cannot chain.
  const crossed = tr && player.x >= tr.x && player.x < tr.x + 20;
  if (tr && travelCd <= 0 && crossed && player.ground) {
    const target = tr.to;
    if (target && world.regionDef(target)) {
      const region = world.regions.find((r) => r.id === target);
      const destX = clamp((region ? region.start : tr.x / T) * T + 3 * T, 3 * T, (world.W - 4) * T);
      const top = world.height[Math.floor(destX / T)] || 10;
      player.x = destX;
      player.y = top * T - 2;
      player.vx = 0;
      player.vy = 0;
      player.ground = false;
      travelCd = 1.2;
      game.camera.x = destX - W / 2;
      player.visitedRegions.add(target);
      if (target === 'forest') {
        if (!player.metNpcs.has('itinerantmerchant')) {
          spawner.spawnNpc('itinerantmerchant');
          player.metNpcs.add('itinerantmerchant');
        }
      }
      if (target === 'frost') {
        if (!player.metNpcs.has('potion_merchant')) {
          spawner.spawnNpc('potion_merchant');
          player.metNpcs.add('potion_merchant');
        }
      }
      if (target === 'ruin') {
        if (!player.metNpcs.has('runekeeper')) {
          spawner.spawnNpc('runekeeper');
          player.metNpcs.add('runekeeper');
        }
      }
      if (target === 'blackthorn') {
        if (!player.metNpcs.has('forge_warden')) {
          spawner.spawnNpc('forge_warden');
          player.metNpcs.add('forge_warden');
        }
      }
      hud.setMessage('Traveled to ' + (world.regionDef(target)?.name || target), 2);
      audio.play('door');
      if (target === 'underdark') world.setWeather('rain');
      else if (target === 'frost') world.setWeather('snow');
      else world.setWeather('clear');
    }
  }

  if (tick % 600 === 0) autosave();

  prevPlayerX = player.x;

  // World entities and the player are drawn by Game.draw (camera-aware).
  dialogueUI_ref.draw(g, { x: 0, y: 0 }, dialogue);
}

function frame(now) {
  if (!game.running) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  // A finished conversation must release the overlay, or the world stays frozen.
  if (game.overlay === dialogue && !dialogue.active) game.overlay = null;
  if (!game.paused && !game.overlay && !dialogue.active) {
    game.time.acc += dt;
    while (game.time.acc >= game.time.step) {
      update(game.time.step);
      game.time.acc -= game.time.step;
    }
  }
  game.draw(dt);
  if (dialogue.active) {
    dialogueUI_ref.draw(g, { x: 0, y: 0 }, dialogue);
  }
  if (menu && menu.active && !game.overlay && !dialogue.active) {
    menu.update(dt, game);
    menu.draw(g, game);
  }
  game.input.endFrame();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

cv.addEventListener('mousedown', (e) => {
  if (e.button === 0 && !game.overlay && !dialogue.active && !game.paused) {
    const atk = combat.tryAttack();
    if (atk && atk.type === 'fail') {
      hud.setMessage('No ammo', 1.5);
    }
  }
});

function releaseDialogueOverlay() {
  if (!dialogue.active && game.overlay === dialogue) game.overlay = null;
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && dialogue.active) {
    if (dialogue.hasChoices()) dialogue.choose(0);
    else dialogue.advance();
    releaseDialogueOverlay();
  }
});

document.addEventListener('click', (e) => {
  if (dialogue.active) {
    if (dialogue.hasChoices()) dialogue.choose(0);
    else dialogue.advance();
    releaseDialogueOverlay();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyF' && !game.overlay && !dialogue.active && !game.paused && !(menu && menu.active)) {
    player.tryBlock();
  }
  if (e.code === 'KeyE' && !game.overlay && !dialogue.active && !game.paused && !(menu && menu.active)) {
    tryTalk();
  }
  if (e.code === 'Enter' && !dialogue.active && !game.overlay && (menu && menu.active)) {
    menu.update(1 / 60, game);
  }
});

window.addEventListener('beforeunload', () => {
  autosave();
});

export { game, player, world, entities, spawner, combat, inventory, equipment, shop, progression, save, dialogue, quest, hud, audio, menu };
window.__game = game;
window.__player = player;
window.__menu = menu;

// Dev/test hook: advance the world deterministically without waiting on rAF
// (browser tabs that are not painting throttle requestAnimationFrame).
window.__step = (frames = 1, dt = 1 / 60) => {
  for (let i = 0; i < frames; i++) {
    if (!game.paused && !game.overlay && !dialogue.active) update(dt);
    game.time.total += dt;
  }
  game.draw(dt);
  return { x: player.x, y: player.y, ground: player.ground, camY: game.camera.y };
};
