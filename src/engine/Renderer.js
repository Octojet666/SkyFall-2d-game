import { W, H, COLORS, SCALE } from './Constants.js';
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    // Back the canvas with s times the logical resolution and draw in 320x180
    // units. Sprites stay nearest-neighbour, but text is rasterised at the real
    // pixel size instead of being upscaled into mush by the browser.
    const s = Math.max(1, Math.min(6, Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H))));
    this.scale = s;
    this.canvas.width = W * s;
    this.canvas.height = H * s;
    // The bitmap is mapped 1:1 to CSS pixels, so nothing is resampled.
    this.canvas.style.width = `${W * s}px`;
    this.canvas.style.height = `${H * s}px`;
    const stage = this.canvas.parentElement;
    if (stage) {
      stage.style.width = `${W * s}px`;
      stage.style.height = `${H * s}px`;
    }
    this.ctx.setTransform(s, 0, 0, s, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }
  clear() {
    this.ctx.fillStyle = '#0a0816';
    this.ctx.fillRect(0, 0, W, H);
  }
  translate(x, y) {
    this.ctx.save();
    this.ctx.translate(Math.round(x), Math.round(y));
  }
  restore() {
    this.ctx.restore();
  }
  shake(sx, sy) {
    this.ctx.save();
    this.ctx.translate(Math.round(sx), Math.round(sy));
  }
  stretch() {
    this.ctx.save();
    this.ctx.scale(SCALE, SCALE);
  }
}
