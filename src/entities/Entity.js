export class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.ground = false;
    this._id = 0;
    this._removed = false;
    this._alive = true;
    this.spawnX = x;
    this.spawnY = y;
    this.fallLimit = Infinity;
    this.onFall = null;
  }
  get left() { return this.x - this.w / 2; }
  get right() { return this.x + this.w / 2; }
  get top() { return this.y - this.h; }
  get bottom() { return this.y; }
  update(dt) {}
  draw(ctx, cam) {}
  destroy() {
    this._removed = true;
    this._alive = false;
  }
  revive(x, y) {
    this._removed = false;
    this._alive = true;
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.vx = 0;
    this.vy = 0;
  }
}
