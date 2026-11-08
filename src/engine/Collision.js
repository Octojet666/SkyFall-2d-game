import { T } from './Constants.js';
export class Collision {
  constructor(world) {
    this.world = world;
  }
  solid(tx, ty) {
    return this.world.solid(tx, ty);
  }
  hits(e) {
    const x0 = Math.floor((e.x - e.w / 2) / T);
    const x1 = Math.floor((e.x + e.w / 2) / T);
    const y0 = Math.floor((e.y - e.h) / T);
    const y1 = Math.floor(e.y / T);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (this.solid(tx, ty)) return true;
      }
    }
    return false;
  }
  move(e, dt) {
    e.vy = Math.min(e.vy + GRAVITY * dt, MAX_FALL);
    e.ground = false;
    const vx = e.vx * dt;
    e.x += vx;
    if (e.vx !== 0 && this.hits(e)) {
      e.x -= vx;
      e.vx = 0;
    }
    const vy = e.vy * dt;
    e.y += vy;
    if (this.hits(e)) {
      e.y -= vy;
      if (e.vy > 0) e.ground = true;
      e.vy = 0;
    }
    const mapW = this.world.W * T;
    const mapH = this.world.H * T;
    e.x = clamp(e.x, 4, mapW - 4);
    if (e.y > mapH + 200) {
      e.y = 40;
      e.ground = true;
      e.vy = 0;
      if (e.onFall) e.onFall(e);
    }
  }
}
function GRAVITY() { return 900; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
