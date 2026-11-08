import { W, H, COLORS } from '../utils/Constants.js';
export class Overlay {
  constructor() {
    this.active = false;
    this.el = null;
  }
  create(canvas) {
    if (this.el) return this.el;
    const wrap = document.createElement('div');
    wrap.id = 'overlay-wrap';
    wrap.style.cssText = `
      position:absolute; inset:0; z-index:50; pointer-events:none;
      display:flex; align-items:center; justify-content:center;
    `;
    const box = document.createElement('div');
    box.id = 'overlay-box';
    box.style.cssText = `
      background:${COLORS.ash}; color:${COLORS.bone};
      border:3px double ${COLORS.ember};
      padding:14px 18px; width:86%; box-sizing:border-box;
      max-width:520px; max-height:92%; overflow:auto; overflow-wrap:anywhere;
      pointer-events:auto;
      font:13px/1.45 "Courier New",monospace;
      box-shadow:0 0 20px rgba(0,0,0,0.6);
    `;
    wrap.appendChild(box);
    canvas.parentElement.appendChild(wrap);
    this.el = box;
    this.wrap = wrap;
    return box;
  }
  open() {
    if (!this.el) return;
    this.el.style.display = '';
    this.active = true;
  }
  close() {
    if (!this.el) return;
    this.el.style.display = 'none';
    this.active = false;
  }
  show(html) {
    if (!this.el) return;
    this.el.innerHTML = html;
    this.el.scrollTop = 0;
    const btn = this.el.querySelector('button');
    if (btn) setTimeout(() => btn.focus({ preventScroll: true }), 0);
  }
  on(event, handler) {
    if (!this.el) return;
    this.el.addEventListener(event, handler);
  }
  destroy() {
    if (this.wrap && this.wrap.parentNode) {
      this.wrap.parentNode.removeChild(this.wrap);
    }
    this.el = null;
    this.wrap = null;
    this.active = false;
  }
  focusFirstButton() {
    const b = this.el && this.el.querySelector('button');
    if (b) b.focus({ preventScroll: true });
  }
  findButton(label) {
    if (!this.el) return null;
    return this.el.querySelector(`button[data-action="${label}"]`) || null;
  }
}
