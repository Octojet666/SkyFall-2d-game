import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { iconImg } from './ShopUI.js';

/**
 * Pause menu. Opened by Esc; the actions are supplied by main.js through
 * `game.pauseActions` so this stays free of game wiring.
 */
export class PauseUI {
  constructor() {
    this.overlay = new Overlay();
    this.box = null;
    this.note = '';
  }
  open(game) {
    this.game = game;
    this.box = this.overlay.create(game.canvas);
    this.note = '';
    this.render();
    this.overlay.open();
    this.attachEvents();
  }
  close() {
    this.overlay.close();
    if (this.box) this.box.innerHTML = '';
  }
  render() {
    const p = this.game && this.game.player;
    const rows = [];
    rows.push(`<div style="font-weight:bold;color:${COLORS.ember};font-size:16px;margin-bottom:6px">Paused</div>`);
    if (p) {
      rows.push(`<div style="color:${COLORS.textDim};font-size:12px;margin-bottom:10px">
        Level ${p.level} &middot; ${p.gold}g &middot; ${p.killCount || 0} kills
      </div>`);
    }
    rows.push(`<div style="display:flex;flex-direction:column;gap:6px">
      <button class="icon-btn" data-action="resume">${iconImg('play')}Resume (Esc)</button>
      <button class="icon-btn" data-action="hero">${iconImg('help')}Change Character (C)</button>
      <button class="icon-btn" data-action="save">${iconImg('check')}Save Game</button>
      <button class="icon-btn" data-action="quit">${iconImg('close')}Save &amp; Quit to Title</button>
    </div>`);
    if (this.note) {
      rows.push(`<div style="margin-top:10px;color:${COLORS.gold};font-size:12px">${this.note}</div>`);
    }
    rows.push(`<hr style="border-color:${COLORS.border};margin:12px 0">`);
    rows.push(`<div style="color:${COLORS.textDim};font-size:11px;line-height:1.6">
      A/D move &middot; Space jump &middot; Shift sprint &middot; J attack<br>
      F block &middot; E talk/shop &middot; I bag &middot; P stats &middot; C character &middot; J journal &middot; M map
    </div>`);
    this.box.innerHTML = rows.join('\n');
  }
  attachEvents() {
    const box = this.box;
    const game = this.game;
    box.addEventListener('click', (e) => {
      const action = e.target.dataset && e.target.dataset.action;
      if (!action) return;
      const acts = game.pauseActions || {};
      if (action === 'resume' && acts.resume) acts.resume();
      else if (action === 'hero' && acts.hero) acts.hero();
      else if (action === 'save' && acts.save) {
        const ok = acts.save();
        this.note = ok === false ? 'Could not write the save.' : 'Progress saved.';
        this.render();
      } else if (action === 'quit' && acts.quit) acts.quit();
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="resume"]');
      if (b) b.focus({ preventScroll: true });
    }, 0);
  }
}
