import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { WEAPON_KINDS } from '../data/items.js';
import { ITEMS } from '../data/items.js';
import { weaponIconSrc } from '../data/weaponVisuals.js';
import { iconImg, weaponStatsLine } from './ShopUI.js';
export class InventoryUI {
  constructor() {
    this.overlay = new Overlay();
  }
  open(game) {
    const box = this.overlay.create(game.canvas);
    this.game = game;
    this.box = box;
    this.render();
    this.overlay.open();
    this.attachEvents();
  }
  close(game) {
    this.overlay.close();
    this.box.innerHTML = '';
  }
  render() {
    const inv = this.game.player.inventory || {};
    const gold = this.game.player.gold || 0;
    const weapon = this.game.player.weapon || null;
    const rows = [];
    rows.push(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-weight:bold;color:${COLORS.ember};font-size:15px">Inventory</span>
      <span style="color:${COLORS.gold}">Gold ${gold}</span>
    </div>`);
    if (Object.keys(inv).length === 0) {
      rows.push('<div style="color:' + COLORS.textDim + ';padding:8px">Your pack is empty.</div>');
    } else {
      for (const [id, qty] of Object.entries(inv)) {
        if (qty <= 0 || !ITEMS[id]) continue;
        const it = ITEMS[id];
        const eq = weapon === id ? ' (equipped)' : '';
        rows.push(this.itemRow(id, it, qty, eq));
      }
    }
    rows.push('<hr style="border-color:' + COLORS.border + ';margin:10px 0">');
    rows.push(`<button class="icon-btn" data-action="close" style="margin-top:6px">${iconImg('close')}Close (Esc)</button>`);
    this.overlay.show(rows.join('\n'));
  }
  itemRow(id, it, qty, eq) {
    const rarColor = rarityColor(it.rarity);
    let action = '';
    if (it.type === 'weapon' && WEAPON_KINDS.includes(it.type)) {
      action = eq
        ? ''
        : ` <button data-action="equip" data-id="${id}" style="color:${COLORS.ember}">Equip</button>`;
    }
    if (it.type === 'consumable') {
      action = ` <button data-action="use" data-id="${id}" style="color:${COLORS.heal}">Use</button>`;
    }
    if (it.type === 'material' || it.type === 'ammo') {
      action = ` <button data-action="drop" data-id="${id}" style="color:${COLORS.textDim}">Drop</button>`;
    }
    const icon = weaponIconSrc(id);
    const label = it.type === 'consumable'
      ? `${it.name} x${qty} [HP +${it.heal}]${action}`
      : `${it.name} x${qty}${eq}<span style="color:${rarColor};font-size:10px"> ${it.rarity}</span>${action}`;
    const stats = weaponStatsLine(it);
    return `<div class="wrow" style="align-items:flex-start">
      ${icon ? `<img class="wicon" src="${icon}" alt="">` : `<span class="wicon"></span>`}
      <span style="flex:1 1 auto;min-width:0">
        <div>${label}</div>
        ${stats ? `<div>${stats}</div>` : ''}
        ${it.desc ? `<div style="color:${COLORS.textDim};font-size:10px">${it.desc}</div>` : ''}
      </span>
    </div>`;
  }
  attachEvents() {
    const box = this.box;
    const game = this.game;
    box.addEventListener('click', (e) => {
      const a = e.target.dataset.action;
      const id = e.target.dataset.id;
      if (a === 'close') {
        this.close(game);
        game.closeOverlay();
        return;
      }
      if (a === 'equip' && id) {
        // Go through the equipment system so main-hand, saved state and the HUD
        // name all stay in sync with the sprite that is drawn in the hand.
        game.systems.equipment.equip(id);
        game.player.weaponName = ITEMS[id].name;
        game.player.invDirty = true;
        this.render();
        game.audio?.play('equip');
        return;
      }
      if (a === 'use' && id) {
        const used = game.systems.inventory.quickPotion();
        if (used) {
          game.audio?.play('pickup');
          game.hud.setMessage('Used ' + (ITEMS[id]?.name || 'potion'), 2);
        } else {
          game.hud.setMessage('No potions to use', 2);
        }
        this.render();
        return;
      }
      if (a === 'drop' && id) {
        const inv = game.player.inventory || {};
        if (inv[id] && inv[id] > 0) {
          inv[id]--;
          if (inv[id] <= 0) delete inv[id];
          game.player.inventory = inv;
          game.player.invDirty = true;
          game.audio?.play('pickup');
          this.render();
        }
        return;
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close(game);
        game.closeOverlay();
      }
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="close"]');
      if (b) b.focus();
    }, 0);
  }
  closeGame() {
    const g = this.game;
    if (g) this.close(g);
  }
}
function rarityColor(r) {
  return {
    common: COLORS.common,
    uncommon: COLORS.uncommon,
    rare: COLORS.rare,
    epic: COLORS.epic,
    legendary: COLORS.legendary,
  }[r] || COLORS.textDim;
}
