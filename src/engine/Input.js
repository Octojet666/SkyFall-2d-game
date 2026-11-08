import { W, H } from './Constants.js';
export class Input {
  constructor(canvas) {
    this.keys = Object.create(null);
    this.pressed = Object.create(null);
    this._codes = new Set();
    this.mouse = { x: 0, y: 0, left: 0, right: 0 };
    this.canvas = canvas;
    this._boundDown = this._onDown.bind(this);
    this._boundUp = this._onUp.bind(this);
    this._boundMove = this._onMove.bind(this);
    this._boundClick = this._onClick.bind(this);
    this._boundRClick = this._onRightClick.bind(this);
    window.addEventListener('keydown', this._boundDown);
    window.addEventListener('keyup', this._boundUp);
    canvas.addEventListener('mousemove', this._boundMove);
    canvas.addEventListener('mousedown', this._boundClick);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('mouseup', this._boundRClick);
  }
  _onDown(e) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    if (!this.keys[e.code]) this.pressed[e.code] = 1;
    this.keys[e.code] = 1;
    this._codes.add(e.code);
  }
  _onUp(e) {
    this.keys[e.code] = 0;
    this._codes.delete(e.code);
  }
  _onMove(e) {
    const r = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - r.left) / r.width * W;
    this.mouse.y = (e.clientY - r.top) / r.height * H;
    this.mouse.left = 1;
  }
  _onClick(e) {
    if (e.button === 0) this.mouse.left = 1;
  }
  _onRightClick(e) {
    if (e.button === 2) this.mouse.right = 1;
  }
  down(code) { return !!this.keys[code]; }
  hit(code) { return !!this.pressed[code]; }
  mouseLeft() { return !!this.mouse.left; }
  mouseRight() { return !!this.mouse.right; }
  endFrame() {
    for (const k of this._codes) this.pressed[k] = 0;
    this.mouse.left = 0;
    this.mouse.right = 0;
  }
  destroy() {
    window.removeEventListener('keydown', this._boundDown);
    window.removeEventListener('keyup', this._boundUp);
    this.canvas.removeEventListener('mousemove', this._boundMove);
    this.canvas.removeEventListener('mousedown', this._boundClick);
    this.canvas.removeEventListener('contextmenu', this._boundClick);
    this.canvas.removeEventListener('mouseup', this._boundRClick);
  }
}
