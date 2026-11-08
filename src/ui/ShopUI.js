import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { weaponIconSrc } from '../data/weaponVisuals.js';

const BTN = 'assets/sprites/ui/';
export function iconImg(name, cls = 'ibtn') {
  return `<img class="${cls}" src="${BTN}btn_${name}.png" alt="">`;
}
export function weaponStatsLine(def) {
  if (!def || typeof def.damage !== 'number' || !def.damage) return '';
  const bits = [`DMG <b>${def.damage}</b>`];
  if (def.speed) bits.push(`SPD <b>${def.speed.toFixed(2)}s</b>`);
  if (def.type === 'ranged') bits.push(`RNG <b>${def.range}</b>`, `AMMO <b>${def.ammo || 'arrow'}</b>`);
  else if (def.range) bits.push(`RNG <b>${def.range}</b>`);
  if (def.crit) bits.push(`CRIT <b>${Math.round(def.crit * 100)}%</b>`);
  return `<span class="wmeta">${bits.join(' &middot; ')}</span>`;
}
export class ShopUI {
  constructor() {
    this.overlay = new Overlay();
  }
  open(game, merchantId) {
    const box = this.overlay.create(game.canvas);
    this.game = game;
    this.box = box;
    if (merchantId) this.merchantId = merchantId;
    this.render();
    this.overlay.open();
    this.attachEvents();
  }
  close(game) {
    this.overlay.close();
    this.box.innerHTML = '';
  }
  render() {
    const g = this.game;
    const shop = g.systems.shop;
    const npc = shop.merchantNpc(this.merchantId);
    const name = npc ? npc.name : 'Merchant';
    const stock = shop.shopInventory(this.merchantId);
    const gold = shop.playerGold();
    const rows = [];
    rows.push(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-weight:bold;color:${COLORS.ember};font-size:15px">${name}'s Shop</span>
      <span style="color:${COLORS.gold}">Gold ${gold}</span>
    </div>`);
    if (stock.length === 0) {
      rows.push('<div style="color:' + COLORS.textDim + '">Nothing for sale right now.</div>');
    } else {
      for (const it of stock) {
        const def = it.def;
        const rarColor = rarityColor(def.rarity);
        const canBuy = it.buyPrice != null && gold >= it.buyPrice;
        const canSell = it.sellPrice != null && it.playerHas && it.playerCount > 0;
        const icon = weaponIconSrc(it.id);
        const stats = weaponStatsLine(def);
        const price = [];
        if (it.buyPrice != null) price.push(`Buy ${it.buyPrice}g`);
        if (it.sellPrice != null && it.playerHas) price.push(`Sell ${it.sellPrice}g (x${it.playerCount})`);
        let line = `<div class="wrow" style="font-size:12px;align-items:flex-start">`;
        line += icon ? `<img class="wicon" src="${icon}" alt="">` : `<span class="wicon"></span>`;
        line += `<div style="flex:1 1 auto;min-width:0">`;
        line += `<div><span style="color:${rarColor}">${def.name}</span>`;
        if (def.desc) line += ` <span style="color:${COLORS.textDim};font-size:10px">${def.desc}</span>`;
        line += `</div>`;
        if (stats) line += `<div>${stats}</div>`;
        line += `</div>`;
        line += `<div style="flex:0 0 auto;text-align:right">`;
        line += `<div style="color:${COLORS.gold};font-size:11px;white-space:nowrap">${price.join(' &middot; ')}</div>`;
        line += `<div style="display:flex;gap:5px;justify-content:flex-end;margin-top:2px">`;
        if (it.buyPrice != null) {
          line += `<button class="icon-btn" data-action="buy" data-id="${it.id}" ${canBuy?'':'disabled style="opacity:0.4"'}>${iconImg('gold')}${canBuy?'Buy':'No gold'}</button>`;
        }
        if (canSell) {
          line += `<button class="icon-btn" data-action="sell" data-id="${it.id}">${iconImg('minus')}Sell</button>`;
        }
        line += `</div></div>`;
        line += `</div>`;
        rows.push(line);
      }
    }
    rows.push(`<hr style="border-color:${COLORS.border};margin:10px 0">`);
    rows.push(`<button class="icon-btn" data-action="close">${iconImg('close')}Close (Esc)</button>`);
    this.overlay.show(rows.join('\n'));
  }
  attachEvents() {
    const box = this.box;
    const g = this.game;
    box.addEventListener('click', (e) => {
      const a = e.target.dataset.action;
      const id = e.target.dataset.id;
      if (a === 'close') {
        this.close(g);
        g.closeOverlay();
        return;
      }
      if (a === 'buy' && id) {
        const res = g.systems.shop.buy(id);
        if (res.ok) {
          g.hud.setMessage('Bought ' + (g.systems.shop.merchantStock(g.merchantId).find(i=>i.id===id)?.def?.name || id), 2);
          this.render();
        } else {
          g.hud.setMessage(res.reason || 'Cannot buy', 2);
        }
        return;
      }
      if (a === 'sell' && id) {
        const res = g.systems.shop.sell(id);
        if (res.ok) {
          g.hud.setMessage('Sold for ' + res.price + 'g', 2);
          this.render();
        } else {
          g.hud.setMessage(res.reason || 'Cannot sell', 2);
        }
        return;
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close(g);
        g.closeOverlay();
      }
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="buy"]') || box.querySelector('button');
      if (b) b.focus({ preventScroll: true });
      box.scrollTop = 0;
    }, 0);
  }
}
function rarityColor(r) {
  const map = {
    common: '#c8c0a8',
    uncommon: '#5fae3a',
    rare: '#5080d0',
    epic: '#9a3ac8',
    legendary: '#e0642b',
  };
  return map[r] || '#9a8a6a';
}
