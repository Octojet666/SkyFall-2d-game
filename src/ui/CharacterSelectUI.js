import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { Assets } from '../engine/Assets.js';
import { HEROES } from '../data/characters.js';
import { iconImg } from './ShopUI.js';

const CARD_W = 86;
const CARD_H = 98;

/**
 * Choose-your-character screen. Every card renders a live idle animation from
 * the hero's own sheet, so the preview is exactly what you look like in game.
 * Opened from the pause menu or the C key at any time.
 */
export class CharacterSelectUI {
  constructor() {
    this.overlay = new Overlay();
    this.cards = [];
    this.raf = 0;
    this.t = 0;
  }
  open(game) {
    this.game = game;
    this.box = this.overlay.create(game.canvas);
    this.box.style.width = 'min(94%, 630px)';
    this.box.style.maxWidth = '630px';
    this.box.style.padding = '10px 12px';
    this.t = 0;
    this.render();
    this.overlay.open();
    this.attachEvents();
    this.loop();
  }
  close() {
    this.stopLoop();
    this.overlay.close();
    if (this.box) this.box.innerHTML = '';
    this.cards = [];
  }
  render() {
    const p = this.game && this.game.player;
    const current = p ? p.heroId : null;
    const rows = [];
    rows.push(`<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
      <span style="font-weight:bold;color:${COLORS.ember};font-size:15px">Choose your character</span>
      <span style="color:${COLORS.textDim};font-size:11px">Click a card or press 1-5</span>
    </div>`);
    rows.push('<div class="hero-grid">');
    HEROES.forEach((h, i) => {
      const sel = h.id === current ? ' sel' : '';
      rows.push(`<div class="hero-card${sel}" data-hero="${h.id}" data-idx="${i}">
        <canvas class="hero-canvas" width="${CARD_W}" height="${CARD_H}"></canvas>
        <div class="hero-name">${h.name}</div>
        <div class="hero-blurb">${h.blurb}</div>
        <div class="hero-tag">${sel ? 'Equipped' : 'Key ' + (i + 1)}</div>
      </div>`);
    });
    rows.push('</div>');
    rows.push(`<hr style="border-color:${COLORS.border};margin:10px 0">`);
    rows.push(`<button class="icon-btn" data-action="close">${iconImg('close')}Done (Esc)</button>`);
    this.overlay.show(rows.join('\n'));
    this.cards = [];
    for (const el of this.box.querySelectorAll('.hero-card')) {
      this.cards.push({ el, id: el.dataset.hero, ctx: el.querySelector('canvas').getContext('2d') });
    }
  }
  /** Pick a hero and repaint just the card labels. */
  choose(id) {
    const p = this.game && this.game.player;
    if (!p || !id) return;
    p.setHero(id);
    const hero = p.hero;
    this.game.hud.setMessage(hero.name + ' takes up the road.', 2);
    for (const c of this.cards) {
      const sel = c.id === id;
      c.el.classList.toggle('sel', sel);
      const tag = c.el.querySelector('.hero-tag');
      if (tag) tag.textContent = sel ? 'Equipped' : 'Key ' + (HEROES.findIndex((h) => h.id === c.id) + 1);
    }
  }
  loop() {
    this.stopLoop();
    const step = () => {
      this.t += 1 / 60;
      this.drawPreviews();
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
  stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  /** Idle animation for every card, drawn from the same sheets the game uses. */
  drawPreviews() {
    if (!this.cards.length) return;
    const p = this.game && this.game.player;
    const weapon = p ? p.weapon : null;
    for (const c of this.cards) {
      const hero = HEROES.find((h) => h.id === c.id);
      if (!hero) continue;
      const ctx = c.ctx;
      ctx.clearRect(0, 0, CARD_W, CARD_H);
      const ctx2 = ctx;
      const feetX = CARD_W / 2;
      const feetY = CARD_H - 22;
      const scale = hero.kind === 'atlas' ? 1.25 : 1.15;
      // Soft ground pad so the pose reads as standing.
      ctx2.fillStyle = 'rgba(0,0,0,0.28)';
      ctx2.beginPath();
      ctx2.ellipse(feetX, feetY + 2, 15, 3.5, 0, 0, Math.PI * 2);
      ctx2.fill();
      let drew = false;
      if (hero.kind === 'atlas') {
        drew = Assets.drawChar(ctx2, hero.sprite, 'idle', this.t * 6, feetX, feetY, { dir: 1, scale });
      } else {
        const sheet = Assets.manifest.sprites[hero.sprite];
        const meta = sheet && (sheet.idle || null);
        if (meta) drew = Assets.drawSheet(ctx2, meta, this.t * 9, feetX, feetY, { dir: 1, scale });
      }
      if (!drew) {
        ctx2.fillStyle = COLORS.ember;
        ctx2.fillRect(feetX - 5, feetY - 14, 10, 14);
      }
      // Show the equipped weapon in the preview hand, exactly like in game.
      // Heroes that already carry their own weapon (the orcs' mace) skip it.
      if (weapon && hero.heldWeapon !== false) {
        Assets.drawWeapon(ctx2, weapon, feetX + (hero.hand[0] * scale) / hero.scale, feetY + (hero.hand[1] * scale) / hero.scale, {
          dir: 1,
          angle: -0.16,
          scale: scale * (hero.weaponScale || 1),
        });
      }
    }
  }
  attachEvents() {
    const box = this.box;
    const g = this.game;
    box.addEventListener('click', (e) => {
      const card = e.target.closest ? e.target.closest('.hero-card') : null;
      if (card && card.dataset.hero) {
        this.choose(card.dataset.hero);
        return;
      }
      if (e.target.dataset && e.target.dataset.action === 'close') {
        this.close();
        g.closeOverlay();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Handled here: stop the window listener from also opening the pause menu.
        e.stopPropagation();
        this.close();
        g.closeOverlay();
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= HEROES.length) this.choose(HEROES[n - 1].id);
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="close"]');
      if (b) b.focus({ preventScroll: true });
      box.scrollTop = 0;
    }, 0);
  }
}
