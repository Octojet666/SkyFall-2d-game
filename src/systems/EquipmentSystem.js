import { ITEMS } from '../data/items.js';
import { playEquip } from '../data/audio.js';
export class EquipmentSystem {
  constructor(state) {
    this.state = state;
  }
  emptyEquipment() {
    return {
      head: null,
      chest: null,
      hands: null,
      legs: null,
      feet: null,
      main: null,
      off: null,
      amulet: null,
      ring: null,
    };
  }
  init() {
    if (!this.state.equipment) this.state.equipment = this.emptyEquipment();
  }
  equip(itemId) {
    const def = ITEMS[itemId];
    if (!def) return false;
    if (def.type === 'weapon' || def.type === 'ranged') {
      this.state.weapon = itemId;
      this.state.weaponName = def.name;
      this.state.equipment.main = itemId;
      this.state.invDirty = true;
      playEquip();
      return true;
    }
    if (def.type === 'armor' && def.slot) {
      const slot = slotKey(def.slot);
      const old = this.state.equipment[slot];
      this.state.equipment[slot] = itemId;
      if (old && old !== itemId) {
        this.removeFromInv(old);
      }
      this.addToInv(itemId, 1);
      this.state.invDirty = true;
      playEquip();
      return true;
    }
    if (def.type === 'accessory' && def.slot) {
      const slot = slotKey(def.slot);
      const old = this.state.equipment[slot];
      this.state.equipment[slot] = itemId;
      if (old && old !== itemId) {
        this.removeFromInv(old);
      }
      this.addToInv(itemId, 1);
      this.state.invDirty = true;
      playEquip();
      return true;
    }
    return false;
  }
  unequip(slot) {
    const itemId = this.state.equipment[slot];
    if (!itemId) return null;
    const def = ITEMS[itemId];
    if (!def) return null;
    if (def.slot) {
      this.state.equipment[slot] = null;
      this.addToInv(itemId, 1);
      this.state.invDirty = true;
      playEquip();
      return itemId;
    }
    return null;
  }
  unequipAll() {
    const out = [];
    const slots = ['head', 'chest', 'hands', 'legs', 'feet', 'main', 'off', 'amulet', 'ring'];
    for (const s of slots) {
      const id = this.state.equipment[s];
      if (id) {
        out.push(id);
        this.state.equipment[s] = null;
        this.addToInv(id, 1);
      }
    }
    this.state.invDirty = true;
    this.state.weapon = null;
    this.state.weaponName = 'Fists';
    playEquip();
    return out;
  }
  currentWeapon() {
    return this.state.weapon || null;
  }
  equippedItem(slot) {
    return this.state.equipment[slot] || null;
  }
  equippedDef(id) {
    if (!id) return null;
    return ITEMS[id] || null;
  }
  equippedStats() {
    const e = this.state.equipment || {};
    const stats = {
      defense: 0,
      strength: 0,
      agility: 0,
      intelligence: 0,
      critical: 0,
      maxHp: 0,
      maxStamina: 0,
      maxMana: 0,
    };
    const forEach = (cb) => {
      for (const slot of ['head', 'chest', 'hands', 'legs', 'feet', 'main', 'off', 'amulet', 'ring']) {
        const id = e[slot];
        if (id) cb(id);
      }
    };
    forEach((id) => {
      const def = ITEMS[id];
      if (!def) return;
      if (typeof def.defense === 'number') stats.defense += def.defense;
      if (typeof def.strength === 'number') stats.strength += def.strength;
      if (typeof def.agility === 'number') stats.agility += def.agility;
      if (typeof def.intelligence === 'number') stats.intelligence += def.intelligence;
      if (typeof def.critical === 'number') stats.critical += def.critical;
      if (typeof def.maxHp === 'number') stats.maxHp += def.maxHp;
      if (typeof def.maxStamina === 'number') stats.maxStamina += def.maxStamina;
      if (typeof def.maxMana === 'number') stats.maxMana += def.maxMana;
    });
    return stats;
  }
  moveToInventory(itemId, qty = 1) {
    this.addToInv(itemId, qty);
  }
  addToInv(itemId, qty = 1) {
    const inv = this.state.inventory || {};
    inv[itemId] = (inv[itemId] || 0) + qty;
    this.state.inventory = inv;
    this.state.invDirty = true;
  }
  removeFromInv(itemId, qty = 1) {
    const inv = this.state.inventory || {};
    if (!inv[itemId]) return 0;
    const before = inv[itemId];
    inv[itemId] = Math.max(0, inv[itemId] - qty);
    if (inv[itemId] <= 0) delete inv[itemId];
    this.state.inventory = inv;
    this.state.invDirty = true;
    return before;
  }
  slotKey(slotName) {
    const map = {
      head: 'head',
      helmet: 'head',
      chest: 'chest',
      chestpiece: 'chest',
      torso: 'chest',
      hands: 'hands',
      gloves: 'hands',
      legs: 'legs',
      greaves: 'legs',
      pants: 'legs',
      feet: 'feet',
      boots: 'feet',
      main: 'main',
      mainhand: 'main',
      off: 'off',
      offhand: 'off',
      amulet: 'amulet',
      necklace: 'amulet',
      ring: 'ring',
      rings: 'ring',
    };
    return map[slotName] || slotName;
  }
  equippedItemsList() {
    const out = [];
    const e = this.state.equipment || {};
    for (const [slot, id] of Object.entries(e)) {
      if (!id) continue;
      const def = ITEMS[id];
      if (!def) continue;
      out.push({ slot, id, def });
    }
    return out;
  }
  equipmentDirty() {
    return this.state.invDirty || false;
  }
}
