import { Entity } from './Entity.js';
export class WorldEntity extends Entity {
  constructor(x, y, kind, data = {}) {
    super(x, y, data.w || 12, data.h || 12);
    this.kind = kind;
    this.data = data;
    this._removed = false;
  }
  update(dt) {}
  draw(ctx, cam) {}
}
