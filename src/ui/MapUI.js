import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { WorldMap } from '../world/WorldMap.js';
export class MapUI {
  constructor() {
    this.overlay = new Overlay();
    this.map = new WorldMap();
  }
  open(game) {
    const box = this.overlay.create(game.canvas);
    this.game = game;
    this.box = box;
    this.render();
    this.overlay.open();
    this.attachEvents();
  }
  close(game) {
    this.overlay.close();
    this.box.innerHTML = '';
  }
  render() {
    const g = this.game;
    const viewW = 520;
    const viewH = 340;
    const canvas = document.createElement('canvas');
    canvas.width = viewW;
    canvas.height = viewH;
    const ctx = canvas.getContext('2d');
    ctx.scale(1, 1);
    ctx.imageSmoothingEnabled = false;
    this.map.draw(ctx, null, viewW, viewH);
    const img = canvas.toDataURL();
    this.box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-weight:bold;color:${COLORS.ember};font-size:15px">World Map</span>
        <span style="color:${COLORS.textDim};font-size:11px">regions explored are marked</span>
      </div>
      <img src="${img}" style="width:100%;border:1px solid ${COLORS.border};image-rendering:pixelated">
      <hr style="border-color:${COLORS.border};margin:10px 0">
      <button data-action="close">Close (Esc)</button>
    `;
  }
  attachEvents() {
    const box = this.box;
    const g = this.game;
    box.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'close') {
        this.close(g);
        g.closeOverlay();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close(g);
        g.closeOverlay();
      }
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="close"]');
      if (b) b.focus();
    }, 0);
  }
}
