import { W, H } from './Constants.js';
import { clamp, lerp } from './Random.js';
export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = W;
    this.h = H;
    this.shake = 0;
    this.fade = 0;
    this.fadeColor = '#000';
  }
  follow(target, mapW, mapH, dt) {
    const k = 1 - Math.pow(0.001, dt);
    const tx = target.x - this.w / 2;
    const ty = target.y - this.h / 2;
    this.x = lerp(this.x, clamp(tx, 0, Math.max(0, mapW - this.w)), k);
    this.y = lerp(this.y, clamp(ty, 0, Math.max(0, mapH - this.h)), k);
    this.shake = Math.max(0, this.shake - dt * 22);
    this.fade = Math.max(0, this.fade - dt * 2.2);
  }
  shakeAmt() {
    if (this.shake <= 0) return { x: 0, y: 0 };
    const a = this.shake;
    return { x: (Math.random() * 2 - 1) * a, y: (Math.random() * 2 - 1) * a * 0.6 };
  }
  shakeOnce(amt) {
    this.shake = Math.max(this.shake, amt);
  }
  fadeTo(color, dur = 0.6) {
    this.fadeColor = color;
    this.fade = dur;
  }
  isFading() {
    return this.fade > 0;
  }
}
