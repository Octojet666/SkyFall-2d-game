import { Entity } from './Entity.js';
import { Assets } from '../engine/Assets.js';

const FRUITS = ['apple', 'bananas', 'cherries', 'kiwi', 'melon', 'orange', 'pineapple', 'strawberry'];
const FRUIT_FOR = {
  health_potion: 'apple',
  super_potion: 'cherries',
  mana_potion: 'kiwi',
  potion: 'melon',
};

export class Pickup extends Entity {
  constructor(x, y, itemId, qty = 1) {
    super(x, y, 10, 8);
    this.itemId = itemId;
    this.qty = qty;
    this.coin = itemId === 'gold';
    this.collected = false;
    this.life = 20;
    this.bob = Math.random() * Math.PI * 2;
    this.animT = Math.random() * 4;
    let hash = 0;
    for (let i = 0; i < (itemId || '').length; i++) hash = (hash * 31 + itemId.charCodeAt(i)) % 9973;
    this.fruitKey = FRUIT_FOR[itemId] || FRUITS[hash % FRUITS.length];
  }
  update(dt) {
    this.animT += dt;
    this.bob += dt * 3;
    this.life -= dt;
    if (this.life <= 0) {
      this._removed = true;
    }
  }
  draw(ctx, cam) {
    const sx = Math.round(this.x - cam.x);
    const sy = Math.round(this.y - cam.y + Math.sin(this.bob) * 2);
    if (!this.coin) {
      const meta = (Assets.manifest.sprites.fruits || {})[this.fruitKey];
      if (meta && Assets.drawSheet(ctx, meta, this.animT * 14, sx, sy - 4, { scale: 0.62 })) {
        return;
      }
    }
    if (this.coin) {
      ctx.fillStyle = '#e8c050';
      ctx.fillRect(sx - 4, sy - 4, 8, 6);
      ctx.fillStyle = '#a88830';
      ctx.fillRect(sx - 4, sy - 4, 8, 1);
      ctx.fillStyle = '#ffd860';
      ctx.fillRect(sx - 3, sy - 3, 6, 1);
      ctx.fillStyle = '#3a2a1a';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', sx, sy - 7);
      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = '#50c070';
      ctx.fillRect(sx - 4, sy - 3, 8, 6);
      ctx.fillStyle = '#3a8a52';
      ctx.fillRect(sx - 4, sy - 3, 8, 1);
      ctx.fillStyle = '#7ae092';
      ctx.fillRect(sx - 3, sy - 2, 6, 1);
    }
  }
  collect() {
    this.collected = true;
    this._removed = true;
  }
}
