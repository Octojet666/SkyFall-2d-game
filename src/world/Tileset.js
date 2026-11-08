import { T, COLORS } from './Constants.js';
import { Assets } from '../engine/Assets.js';
export class Tileset {
  constructor() {
    this.cache = new Map();
    this.atlasCache = new Map();
  }
  /** Real terrain tile from the 16x16 atlas, or null while it loads. */
  at(sheetKey, coord) {
    if (!coord) return null;
    const id = sheetKey + ':' + coord[0] + ',' + coord[1];
    if (this.atlasCache.has(id)) return this.atlasCache.get(id);
    const t = Assets.tile(sheetKey, coord[0], coord[1]);
    if (t) this.atlasCache.set(id, t);
    return t;
  }
  tile(kind, variant = 0) {
    const key = kind + ':' + variant;
    if (this.cache.has(key)) return this.cache.get(key);
    const img = this._makeTile(kind, variant);
    this.cache.set(key, img);
    return img;
  }
  sized(width, height, draw) {
    const key = width + 'x' + height + ':' + draw.name;
    if (this.cache.has(key)) return this.cache.get(key);
    const img = this._makeSized(width, height, draw);
    this.cache.set(key, img);
    return img;
  }
  _makeTile(kind, variant) {
    const c = document.createElement('canvas');
    c.width = T;
    c.height = T;
    const g = c.getContext('2d');
    this._drawTile(g, kind, variant);
    return c;
  }
  _drawTile(g, kind, variant) {
    const seed = (variant * 7 + 3) % 13;
    switch (kind) {
      case 'grass':
        this._grass(g, seed);
        break;
      case 'grassForest':
        this._grassForest(g, seed);
        break;
      case 'snow':
        this._snow(g, seed);
        break;
      case 'snowDrift':
        this._snowDrift(g, seed);
        break;
      case 'dirt':
        this._dirt(g, seed);
        break;
      case 'stone':
        this._stone(g, seed);
        break;
      case 'ice':
        this._ice(g, seed);
        break;
      case 'iceCave':
        this._iceCave(g, seed);
        break;
      case 'rubblemid':
        this._ruin(g, seed, 0);
        break;
      case 'ruinwall':
        this._ruin(g, seed, 1);
        break;
      case 'cave':
        this._cave(g, seed);
        break;
      case 'cavern':
        this._cavern(g, seed);
        break;
      default:
        g.fillStyle = '#000';
        g.fillRect(0, 0, T, T);
    }
  }
  _grass(g, seed) {
    const [top, side] = COLORS.ground;
    g.fillStyle = side;
    g.fillRect(0, 0, T, T);
    g.fillStyle = top;
    g.fillRect(0, 0, T, T - 2);
    g.fillStyle = '#3a5a28';
    g.fillRect(0, T - 2, T, 2);
    this._grassTufts(g, seed, 0, T - 3);
    this._edgeDither(g, T - 3, T, 2, 0x2a);
  }
  _grassForest(g, seed) {
    this._grass(g, seed);
    g.fillStyle = 'rgba(30,50,20,0.55)';
    for (let i = 0; i < 3; i++) {
      const x = (seed * 5 + i * 6 + i * i) % T;
      const h = 4 + (i % 2) * 2;
      g.fillRect(x, T - 3 - h, 2, h);
    }
  }
  _snow(g, seed) {
    g.fillStyle = '#c4c2bc';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#e8e6e0';
    g.fillRect(0, 0, T, T - 1);
    this._snowTufts(g, seed);
    this._edgeDither(g, T - 2, T, 1, 0x1a);
  }
  _snowDrift(g, seed) {
    this._snow(g, seed);
    g.fillStyle = 'rgba(255,255,255,0.5)';
    const cx = (seed * 3 + 2) % T;
    g.beginPath();
    g.ellipse(cx, T - 2, 6, 2, 0, 0, Math.PI * 2);
    g.fill();
  }
  _dirt(g, seed) {
    g.fillStyle = '#462e1d';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#5a3a26';
    for (let i = 0; i < 6; i++) {
      const x = (seed * 3 + i * 7) % T;
      const y = (seed * 2 + i * 5) % T;
      g.fillRect(x, y, 2 + (i % 2), 1 + (i % 2));
    }
  }
  _stone(g, seed) {
    g.fillStyle = '#4a3c30';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#6a5a4a';
    g.fillRect(0, 0, T, 1);
    g.fillRect(0, 0, 1, T);
    for (let i = 0; i < 4; i++) {
      const x = (seed * 5 + i * 9) % (T - 2) + 1;
      const y = (seed * 3 + i * 7) % (T - 2) + 1;
      g.fillStyle = i % 2 ? '#5a4a3a' : '#3a2e24';
      g.fillRect(x, y, 2, 2);
    }
  }
  _ice(g, seed) {
    g.fillStyle = '#7fb8c8';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#bfe4ee';
    g.fillRect(0, 0, T, T - 1);
    this._iceShine(g, seed);
  }
  _iceShine(g, seed) {
    g.strokeStyle = 'rgba(255,255,255,0.6)';
    g.lineWidth = 1;
    for (let i = 0; i < 2; i++) {
      const x = (seed * 4 + i * 7) % T;
      g.beginPath();
      g.moveTo(x, 2);
      g.lineTo(x + 3, 6);
      g.stroke();
    }
  }
  _iceCave(g, seed) {
    g.fillStyle = '#2a3a42';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#3a5262';
    g.fillRect(0, 0, T, T - 2);
    this._iceShine(g, seed);
    this._edgeDither(g, T - 2, T, 2, 0x10);
  }
  _ruin(g, seed, v) {
    g.fillStyle = '#4a382a';
    g.fillRect(0, 0, T, T);
    if (v === 0) {
      g.fillStyle = '#6a5240';
      g.fillRect(1, 0, T - 2, T - 3);
      g.fillStyle = '#3a2a1c';
      g.fillRect(0, T - 3, T, 3);
      g.fillStyle = '#5a4230';
      g.fillRect(3, 2, 4, 4);
      g.fillRect(9, 6, 3, 3);
    } else {
      g.fillStyle = '#5a4230';
      g.fillRect(0, 0, T, T - 2);
      g.fillStyle = '#3a2a1c';
      g.fillRect(0, T - 2, T, 2);
      this._stoneBlock(g, seed, 3, 3, 5, 6);
    }
  }
  _stoneBlock(g, seed, x, y, w, h) {
    g.fillStyle = '#6a5a4a';
    g.fillRect(x, y, w, h);
    g.fillStyle = '#4a3c30';
    g.fillRect(x + 1, y + 1, w - 2, 1);
    g.fillRect(x + 1, y + 1, 1, h - 2);
  }
  _cave(g, seed) {
    g.fillStyle = '#1a1612';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#2a2420';
    g.fillRect(0, 0, T, T - 1);
    for (let i = 0; i < 3; i++) {
      const x = (seed * 3 + i * 5) % T;
      const y = (seed * 2 + i * 4) % T;
      g.fillStyle = i % 2 ? '#3a3028' : '#1a1410';
      g.fillRect(x, y, 2, 2);
    }
  }
  _cavern(g, seed) {
    g.fillStyle = '#241c18';
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#3a2c22';
    g.fillRect(0, 0, T, T - 2);
    for (let i = 0; i < 4; i++) {
      const x = (seed * 7 + i * 6) % T;
      const y = (seed * 5 + i * 8) % T;
      g.fillStyle = '#4a3a2a';
      g.fillRect(x, y, 2 + (i % 2), 1 + (i % 2));
    }
  }
  _grassTufts(g, seed, x0, y) {
    g.fillStyle = '#4a6b32';
    for (let i = 0; i < 2; i++) {
      const x = (seed * 7 + i * 9 + 3) % (T - 2) + 1;
      g.fillRect(x, y - 2, 1, 2);
      g.fillRect(x + 1, y - 1, 1, 1);
    }
  }
  _snowTufts(g, seed) {
    g.fillStyle = '#dfe0dc';
    for (let i = 0; i < 2; i++) {
      const x = (seed * 5 + i * 8 + 2) % (T - 2) + 1;
      g.fillRect(x, T - 4, 2, 1);
    }
    g.fillStyle = '#b8b6ae';
    g.fillRect(0, T - 4, T, 1);
  }
  _edgeDither(g, x0, y0, w, h, bump) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (((x + y + bump) & 1) === 0) {
          g.fillStyle = 'rgba(0,0,0,0.35)';
          g.fillRect(x0 + x, y0 + y, 1, 1);
        }
      }
    }
  }
  _makeSized(width, height, draw) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    draw(c.getContext('2d'), width, height);
    return c;
  }
}
