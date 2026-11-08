// Sprite/asset pipeline. Loads the pixel-art sheets listed in spriteManifest.js
// once, then hands out cheap drawImage calls. Everything degrades gracefully:
// if an image is still loading the callers fall back to procedural drawing.

import { SPRITE_MANIFEST } from '../data/spriteManifest.js';
import { weaponVisual, weaponSpriteList } from '../data/weaponVisuals.js';

const BASE = new URL('../../', import.meta.url).href;

function abs(p) {
  if (!p) return null;
  if (p.startsWith('http') || p.startsWith('/')) return p;
  return BASE + p;
}

const images = new Map();
const tiles = new Map();

function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = abs(path);
  });
}

export const Assets = {
  manifest: SPRITE_MANIFEST,
  loaded: false,
  progress: 0,
  _promise: null,

  /** Begin loading every sheet referenced by the manifest. */
  init() {
    if (this._promise) return this._promise;
    const jobs = [];
    const push = (p) => p && !images.has(p) && jobs.push(loadImage(p).then((img) => img && images.set(p, img)));

    const m = this.manifest;
    for (const key of Object.keys(m.characters)) push(m.characters[key].atlas);
    for (const key of Object.keys(m.terrain.sheets)) push(m.terrain.sheets[key]);
    for (const key of Object.keys(m.backgrounds)) push(m.backgrounds[key]);
    for (const p of weaponSpriteList()) push(p);
    for (const [key, meta] of Object.entries(m.sprites)) {
      if (Array.isArray(meta)) continue;
      if (meta && meta.src) push(meta.src);
      else if (meta && typeof meta === 'object') {
        for (const v of Object.values(meta)) if (v && v.src) push(v.src);
      }
    }

    let done = 0;
    const total = jobs.length || 1;
    this._promise = Promise.all(jobs.map((j) => j.then(() => { done++; this.progress = done / total; })))
      .then(() => { this.loaded = true; this.progress = 1; return true; });
    return this._promise;
  },

  image(path) {
    return images.get(path) || null;
  },

  sheet(path) {
    return images.get(path) || null;
  },

  char(name) {
    const def = this.manifest.characters[name];
    if (!def) return null;
    const img = images.get(def.atlas);
    if (!img) return null;
    return { img, frames: def.frames };
  },

  spriteKey(key) {
    const v = this.manifest.sprites[key];
    return v && v.src ? v : null;
  },

  /** Visual description (image + grip + pose) for an equippable weapon id. */
  weapon(id) {
    const v = weaponVisual(id);
    if (!v) return null;
    const img = images.get(v.src);
    if (!img) return null;
    return { ...v, img };
  },

  /** Small centred weapon glyph for HUD panels. */
  drawWeaponIcon(ctx, id, cx, cy, scale = 1) {
    const w = this.weapon(id);
    if (!w) return false;
    const s = 16 * scale;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(w.img, Math.round(cx - s / 2), Math.round(cy - s / 2), s, s);
    ctx.restore();
    return true;
  },

  /**
   * Draw a held weapon anchored at its grip. `angle` swings the blade around
   * the hand; facing left mirrors the whole thing so the pose stays correct.
   */
  drawWeapon(ctx, id, x, y, opts = {}) {
    const w = this.weapon(id);
    if (!w) return false;
    const dir = opts.dir === -1 ? -1 : 1;
    const scale = (opts.scale || 1) * w.scale;
    const angle = opts.angle || 0;
    ctx.save();
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    ctx.translate(Math.round(x), Math.round(y));
    if (dir === -1) ctx.scale(-1, 1);
    if (angle) ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(w.img, -w.grip[0], -w.grip[1], 16, 16);
    ctx.restore();
    return true;
  },

  /** Lazily crop a 16x16 tile out of a terrain sheet. */
  tile(sheetKey, col, row) {
    const sheets = this.manifest.terrain.sheets;
    const path = sheets[sheetKey] || sheets.terrain;
    const img = images.get(path);
    if (!img) return null;
    const id = path + ':' + col + ',' + row;
    let c = tiles.get(id);
    if (c) return c;
    const ts = this.manifest.terrain.tile || 16;
    c = document.createElement('canvas');
    c.width = ts;
    c.height = ts;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(img, col * ts, row * ts, ts, ts, 0, 0, ts, ts);
    tiles.set(id, c);
    return c;
  },

  background(key) {
    const p = this.manifest.backgrounds[key];
    return p ? images.get(p) || null : null;
  },

  /**
   * Flat-tinted copy of one 100x100 atlas cell. Compositing has to happen on a
   * scratch canvas; doing `source-atop` on the scene canvas would paint the
   * whole cell rect white over the world behind the character.
   */
  _tintedCell(img, sx, sy, tone) {
    const key = sx + ',' + sy + ',' + tone;
    let c = this._tintCache && this._tintCache.get(key);
    if (c) return c;
    if (!this._tintCache) this._tintCache = new Map();
    c = document.createElement('canvas');
    c.width = 100;
    c.height = 100;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(img, sx, sy, 100, 100, 0, 0, 100, 100);
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = tone;
    g.globalAlpha = 0.5;
    g.fillRect(0, 0, 100, 100);
    this._tintCache.set(key, c);
    return c;
  },

  /**
   * Draw one frame of a Tiny RPG style character atlas.
   * Frames are 100x100 with the character's feet at (50, 60).
   */
  drawChar(ctx, name, anim, frameFloat, x, y, opts = {}) {
    const ch = this.char(name);
    if (!ch) return false;
    const frames = ch.frames[anim] || ch.frames.idle || 0;
    if (!frames) return false;
    const f = Math.max(0, Math.floor(frameFloat)) % frames;
    const scale = opts.scale || 1;
    const dir = opts.dir === -1 ? -1 : 1;
    const row = ATLAS_ROWS.indexOf(anim);
    const sy = (row < 0 ? 0 : row) * 100;
    const w = 100 * scale;
    const h = 100 * scale;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (dir === -1) ctx.scale(-1, 1);
    const src = opts.flash ? this._tintedCell(ch.img, f * 100, sy, opts.flash === true ? '#ffffff' : opts.flash) : ch.img;
    ctx.drawImage(src, opts.flash ? 0 : f * 100, opts.flash ? 0 : sy, 100, 100, -50 * scale, -60 * scale, w, h);
    ctx.restore();
    return true;
  },

  /** Draw a plain sheet (32x32 or 16x16 cells) anchored at its own bbox. */
  drawSheet(ctx, meta, frameFloat, x, y, opts = {}) {
    if (!meta || !meta.src) return false;
    const img = images.get(meta.src);
    if (!img) return false;
    const fw = meta.fw || 32;
    const fh = meta.fh || 32;
    const frames = Math.max(1, meta.frames || 1);
    const f = Math.max(0, Math.floor(frameFloat)) % frames;
    const scale = opts.scale || 1;
    const ax = (meta.ax !== undefined ? meta.ax : fw / 2) * scale;
    const ay = (meta.ay !== undefined ? meta.ay : fh) * scale;
    const dir = opts.dir === -1 ? -1 : 1;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (dir === -1) ctx.scale(-1, 1);
    ctx.drawImage(img, f * fw, 0, fw, fh, -ax, -ay, fw * scale, fh * scale);
    ctx.restore();
    return true;
  },
};

export const ATLAS_ROWS = ['idle', 'walk', 'attack1', 'attack2', 'hurt', 'death'];

/** Kick loading off immediately; callers can await Assets.init() if they care. */
Assets.init();

export default Assets;
