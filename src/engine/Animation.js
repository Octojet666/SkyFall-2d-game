export class Animation {
  constructor(frames, opts = {}) {
    this.frames = frames;
    this.fps = opts.fps ?? 12;
    this.loop = opts.loop ?? true;
    this.onDone = opts.onDone ?? null;
    this.frame = 0;
    this.time = 0;
    this.done = false;
    this._owner = null;
  }
  setOwner(owner) { this._owner = owner; }
  update(dt) {
    if (this.done) return;
    this.time += dt;
    const need = 1 / this.fps;
    while (this.time >= need) {
      this.time -= need;
      this.frame++;
      if (this.frame >= this.frames.length) {
        if (this.loop) this.frame = 0;
        else {
          this.frame = this.frames.length - 1;
          this.done = true;
          if (this.onDone) this.onDone(this._owner);
        }
      }
    }
  }
  current() {
    return this.frames[this.frame] ?? this.frames[0];
  }
  reset() {
    this.frame = 0;
    this.time = 0;
    this.done = false;
  }
}
export const makeFrames = (draw, count, period = 1) => {
  return Array.from({ length: count }, (_, i) => ({ draw, idx: i, period }));
};
