import { clamp } from './Random.js';
export class Time {
  constructor() {
    this.last = performance.now();
    this.acc = 0;
    this.total = 0;
    this.step = 1 / 60;
    this.scale = 1;
    this.paused = false;
  }
  tick(now) {
    const raw = (now - this.last) / 1000;
    this.last = now;
    const dt = clamp(raw, 0, 0.1) * this.scale;
    if (!this.paused) {
      this.acc += dt;
      this.total += dt;
    }
    return dt;
  }
  stepLoop(onUpdate) {
    let steps = 0;
    const limit = 8;
    while (this.acc >= this.step && steps < limit) {
      onUpdate(this.step);
      this.acc -= this.step;
      steps++;
    }
  }
}
