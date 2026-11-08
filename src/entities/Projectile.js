import { Entity } from './Entity.js';
export class Projectile extends Entity {
  constructor(x, y, vx, vy, damage, kind, color, slow = 0) {
    super(x, y, 4, 4);
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.kind = kind || 'arrow';
    this.color = color || '#e8c050';
    this.slow = slow;
    this.life = 2.2;
    this.bounces = 0;
    this.owner = null;
    this.spawnX = x;
    this.spawnY = y;
  }
  update(dt, world) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 600 * dt;
    if (this.x < 0 || this.x > world.W * 16) this.life = 0;
    if (this.y > world.H * 16 + 40) this.life = 0;
    if (this.life <= 0) {
      this._removed = true;
      return;
    }
    if (this._collide(world)) {
      this._removed = true;
      if (this.onHit) this.onHit(this);
    }
  }
  _collide(world) {
    const T = 16;
    const x0 = Math.floor((this.x - this.w / 2) / T);
    const x1 = Math.floor((this.x + this.w / 2) / T);
    const y0 = Math.floor((this.y - this.h) / T);
    const y1 = Math.floor((this.y + this.h) / T);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (world.solid(tx, ty)) return true;
      }
    }
    return false;
  }
  draw(ctx, cam) {
    const sx = this.x - cam.x;
    const sy = this.y - cam.y;
    ctx.fillStyle = this.color;
    ctx.fillRect(sx - this.w / 2, sy - this.h, this.w, this.h);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillRect(sx - this.w / 2 + 1, sy - this.h + 1, 2, 2);
    if (this.slow > 0) {
      ctx.strokeStyle = 'rgba(120,180,255,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, 8 + this.slow * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
