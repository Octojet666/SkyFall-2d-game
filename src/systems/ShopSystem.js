import { ITEMS, SHOP_BY_MERCHANT } from '../data/items.js';
import { NPCS } from '../data/npcs.js';
import { playShopBuy, playShopSell, playGold } from '../data/audio.js';
export class ShopSystem {
  constructor(state) {
    this.state = state;
  }
  merchantDef(merchantId) {
    return NPCS[merchantId] || (this.state.npcs && this.state.npcs[merchantId]) || null;
  }
  merchantStock(merchantId) {
    const npc = this.merchantDef(merchantId);
    if (!npc) return [];
    const shopKey = npc.shop || 'general';
    const stock = (SHOP_BY_MERCHANT[shopKey] || []);
    return stock.slice();
  }
  price(itemId, kind = 'buy') {
    const def = ITEMS[itemId];
    if (!def) return null;
    if (kind === 'buy') return def.buy || null;
    return def.sell || null;
  }
  canBuy(itemId) {
    const price = this.price(itemId, 'buy');
    if (price == null) return false;
    return (this.state.gold || 0) >= price;
  }
  buy(itemId) {
    const price = this.price(itemId, 'buy');
    if (price == null) return { ok: false, reason: 'unknown item' };
    if ((this.state.gold || 0) < price) return { ok: false, reason: 'not enough gold' };
    this.state.gold -= price;
    const inv = this.state.inventory || {};
    inv[itemId] = (inv[itemId] || 0) + 1;
    this.state.inventory = inv;
    this.state.invDirty = true;
    this.state.lastBuy = itemId;
    playShopBuy();
    playGold();
    return { ok: true, item: itemId, price };
  }
  canSell(itemId) {
    const def = ITEMS[itemId];
    if (!def) return false;
    if (typeof def.sell !== 'number') return false;
    const inv = this.state.inventory || {};
    return (inv[itemId] || 0) > 0;
  }
  sell(itemId) {
    const def = ITEMS[itemId];
    if (!def || typeof def.sell !== 'number') return { ok: false, reason: 'not sellable' };
    const inv = this.state.inventory || {};
    if ((inv[itemId] || 0) <= 0) return { ok: false, reason: 'none in inventory' };
    inv[itemId]--;
    if (inv[itemId] <= 0) delete inv[itemId];
    this.state.inventory = inv;
    this.state.gold += def.sell;
    this.state.invDirty = true;
    this.state.lastSell = itemId;
    playShopSell();
    playGold();
    return { ok: true, item: itemId, price: def.sell };
  }
  transaction(itemId, kind) {
    if (kind === 'buy') return this.buy(itemId);
    if (kind === 'sell') return this.sell(itemId);
    return { ok: false, reason: 'unknown transaction' };
  }
  merchantNpc(id) {
    return this.merchantDef(id);
  }
  shopInventory(merchantId) {
    const id = merchantId || this.state.shopMerchant;
    const npc = this.merchantNpc(id);
    if (!npc) return [];
    const stock = this.merchantStock(id);
    const inv = this.state.inventory || {};
    const out = [];
    for (const itemId of stock) {
      const def = ITEMS[itemId];
      if (!def) continue;
      out.push({
        id: itemId,
        def,
        buyPrice: def.buy > 0 ? def.buy : null,
        sellPrice: def.sell,
        inStock: true,
        playerHas: (inv[itemId] || 0) > 0,
        playerCount: inv[itemId] || 0,
      });
    }
    const playerItems = this.playerSellableItems();
    for (const it of playerItems) {
      if (!out.find((o) => o.id === it.id)) {
        out.push({
          id: it.id,
          def: it.def,
          buyPrice: null,
          sellPrice: it.def.sell,
          inStock: false,
          playerHas: true,
          playerCount: it.qty,
        });
      }
    }
    return out;
  }
  playerSellableItems() {
    const inv = this.state.inventory || {};
    const out = [];
    for (const [id, qty] of Object.entries(inv)) {
      if (qty <= 0) continue;
      const def = ITEMS[id];
      if (!def || typeof def.sell !== 'number') continue;
      out.push({ id, def, qty });
    }
    return out;
  }
  playerGold() {
    return this.state.gold || 0;
  }
  spendGold(amount) {
    if ((this.state.gold || 0) < amount) return false;
    this.state.gold -= amount;
    return true;
  }
  earnGold(amount) {
    this.state.gold += amount;
    return true;
  }
}
