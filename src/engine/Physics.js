import { GRAVITY, MAX_FALL, T } from './Constants.js';
import { clamp } from './Random.js';
let _G = GRAVITY;
export const Physics = {
  setGravity(g) { _G = g; },
  get gravity() { return _G; },
  update(e, dt) {
    e.vy = Math.min(e.vy + _G * dt, MAX_FALL);
  },
  canJump(e) {
    return e.ground;
  },
  jump(e, strength) {
    if (!this.canJump(e)) return;
    e.vy = -strength;
    e.ground = false;
  },
  applyGravityOnly(e, dt) {
    e.vy = Math.min(e.vy + _G * dt, MAX_FALL);
    e.y += e.vy * dt;
    if (e.y > e.fallLimit) {
      e.y = e.spawnY;
      e.vy = 0;
      if (e.onFall) e.onFall(e);
    }
  },
  groundAt(x, y, world) {
    const tx = Math.floor(x / T);
    const ty = Math.floor(y / T);
    return world.solid(tx, ty);
  },
};
