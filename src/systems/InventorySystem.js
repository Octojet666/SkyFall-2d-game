export class InventorySystem {
  constructor(state) {
    this.state = state;
  }
  inventory() {
    if (!this.state.inventory) this.state.inventory = {};
    return this.state.inventory;
  }
  ensure(itemId, qty = 1) {
    const inv = this.inventory();
    inv[itemId] = (inv[itemId] || 0) + qty;
    this.state.inventory = inv;
    this.state.invDirty = true;
  }
  add(itemId, qty = 1) {
    this.ensure(itemId, qty);
  }
  remove(itemId, qty = 1) {
    const inv = this.inventory();
    if (!inv[itemId]) return 0;
    const before = inv[itemId];
    inv[itemId] = Math.max(0, inv[itemId] - qty);
    if (inv[itemId] <= 0) delete inv[itemId];
    this.state.inventory = inv;
    this.state.invDirty = true;
    return before;
  }
  has(itemId, qty = 1) {
    return (this.inventory()[itemId] || 0) >= qty;
  }
  count(itemId) {
    return this.inventory()[itemId] || 0;
  }
  itemDef(id) {
    if (!id) return null;
    return this.state.itemDefs?.[id] || null;
  }
  allItems() {
    const inv = this.inventory();
    const out = [];
    for (const id of Object.keys(inv)) {
      const qty = inv[id];
      if (qty <= 0) continue;
      const def = this.itemDef(id);
      if (!def) continue;
      out.push({ id, def, qty });
    }
    return out;
  }
  consumableCount() {
    let n = 0;
    for (const id of ['health_potion', 'super_potion', 'mana_potion']) {
      n += this.count(id);
    }
    return n;
  }
  quickPotion() {
    const inv = this.inventory();
    if (inv.super_potion && inv.super_potion > 0) {
      inv.super_potion--;
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + 90);
      delete inv.super_potion;
      this.state.inventory = inv;
      this.state.invDirty = true;
      return 'super_potion';
    }
    if (inv.health_potion && inv.health_potion > 0) {
      inv.health_potion--;
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + 40);
      delete inv.health_potion;
      this.state.inventory = inv;
      this.state.invDirty = true;
      return 'health_potion';
    }
    return null;
  }
  invDiff() {
    return this.state.invDirty || false;
  }
  markClean() {
    this.state.invDirty = false;
  }
}
