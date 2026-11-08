import { T, W, H, COLORS } from '../utils/Constants.js';
import { Assets } from '../engine/Assets.js';
import { RegionDef, regionById } from './Region.js';
import { Tileset } from './Tileset.js';
import { randInt, lerp, clamp } from '../utils/Random.js';
export class World {
  constructor() {
    this.T = T;
    this.W = 260;
    this.H = 30;
    this.tileset = new Tileset();
    this.height = this._buildHeight();
    this.decor = this._buildDecor();
    this.regions = this._buildRegions();
    this.transitions = this._buildTransitions();
    this.lighting = { dayPhase: 0, weather: 'clear', rain: 0, snow: 0, fog: 0, time: 0 };
    this.campfires = [];
    this.vaults = [];
    this.signs = [];
    this.miningNodes = [];
    this.lootChests = [];
    this.closedChests = new Set();
    this._genDetails();
  }
  _buildHeight() {
    const h = [];
    for (let i = 0; i < this.W; i++) {
      let base;
      if (i < 70) base = 12;
      else if (i < 110) base = 10;
      else if (i < 170) base = 8;
      else base = 12;
      const n = Math.sin(i * 0.18) * 1.5 + Math.sin(i * 0.07 + 1.3) * 2 + Math.sin(i * 0.31) * 0.6;
      h.push(Math.round(base + n));
    }
    for (let i = 0; i < this.W; i++) {
      if (i > 0 && i < this.W - 1 && Math.abs(h[i] - h[i - 1]) > 3) {
        h[i] = Math.round((h[i - 1] + h[i + 1]) / 2);
      }
    }
    // Region bases differ by up to 4 tiles, which would leave unjumpable walls.
    // Clamp every step (both directions) to 2 tiles; passes converge quickly.
    const MAX_STEP = 2;
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i < this.W; i++) {
        h[i] = Math.min(h[i - 1] + MAX_STEP, Math.max(h[i - 1] - MAX_STEP, h[i]));
      }
      for (let i = this.W - 2; i >= 0; i--) {
        h[i] = Math.min(h[i + 1] + MAX_STEP, Math.max(h[i + 1] - MAX_STEP, h[i]));
      }
    }
    return h;
  }
  _buildDecor() {
    const d = [];
    for (let i = 0; i < this.W; i++) d.push([]);
    return d;
  }
  _buildRegions() {
    const r = [];
    r.push({ id: 'ash', start: 0, end: 70, def: regionById('ash') });
    r.push({ id: 'forest', start: 70, end: 130, def: regionById('forest') });
    r.push({ id: 'frost', start: 130, end: 190, def: regionById('frost') });
    r.push({ id: 'ruin', start: 190, end: 230, def: regionById('ruin') });
    r.push({ id: 'underdark', start: 230, end: 255, def: regionById('underdark') });
    r.push({ id: 'blackthorn', start: 255, end: 260, def: regionById('blackthorn') });
    return r;
  }
  _buildTransitions() {
    const t = [];
    t.push({ x: 69 * T, to: 'forest', label: 'Path into the forest' });
    t.push({ x: 129 * T, to: 'frost', label: 'Road up to Frostveil Foothills' });
    t.push({ x: 189 * T, to: 'ruin', label: 'Gate to the Forgotten Ruins' });
    t.push({ x: 229 * T, to: 'underdark', label: 'Descent into the Underdark' });
    t.push({ x: 254 * T, to: 'blackthorn', label: 'Keep gates' });
    return t;
  }
  _genDetails() {
    // Props are laid out on a shared occupancy map so a chest never lands in a
    // house and two props never share a tile.
    const used = new Set();
    const free = (tx, span = 3) => {
      for (let i = -1; i <= span; i++) if (used.has(tx + i)) return false;
      return true;
    };
    const span = (tx, n) => { for (let i = 0; i < n; i++) used.add(tx + i); };

    // Village houses: three tiles wide on flat ground, snapped to the grid.
    this.houses = [];
    for (let tx = 6; tx < 64; tx += 12) {
      const h = this.height[tx];
      const flat = Math.abs(this.height[tx - 1] - h) <= 1 && Math.abs(this.height[tx + 1] - h) <= 1 && Math.abs(this.height[tx + 2] - h) <= 1;
      if (!flat || !free(tx)) continue;
      this.houses.push(tx);
      span(tx, 3);
    }

    for (let i = 0; i < 18; i++) {
      const tx = 4 + randInt(0, this.W - 8);
      if (!free(tx, 1)) continue;
      this.campfires.push({ tx, lit: true });
      used.add(tx);
    }
    for (let i = 0; i < 12; i++) {
      const tx = 3 + randInt(0, this.W - 8);
      if (tx <= 4 || tx >= this.W - 5 || !free(tx, 1)) continue;
      this.miningNodes.push({ tx, kind: pickMineKind(tx) });
      used.add(tx);
      // Crates sit on their own tile so they never stack on the ore node.
      const ctx2 = tx + 2;
      if (ctx2 < this.W - 3 && free(ctx2, 1)) {
        this.lootChests.push({ tx: ctx2, opened: false, reward: pickChestReward(ctx2) });
        used.add(ctx2);
      }
    }
    for (let i = 0; i < 10; i++) {
      const tx = 2 + randInt(0, this.W - 6);
      if (!free(tx, 1)) continue;
      this.signs.push({ tx, text: pickSignText(tx) });
      used.add(tx);
    }
  }
  regionAt(x) {
    const tx = Math.floor(x / T);
    for (const r of this.regions) {
      if (tx >= r.start && tx < r.end) return r.id;
    }
    return 'ash';
  }
  solid(tx, ty) {
    if (tx < 0 || tx >= this.W) return true;
    if (ty < 0) return false;
    if (ty >= this.height[tx]) return true;
    return false;
  }
  findGroundX(x, w = 12) {
    const start = Math.floor(x / T);
    for (let tx = start; tx >= 0; tx--) {
      if (this.height[tx] >= 6) return tx * T + T / 2;
    }
    return 40;
  }
  regionDef(id) {
    return regionById(id);
  }
  transitionAt(x) {
    for (const t of this.transitions) {
      if (Math.abs(x - t.x) < T * 1.5) return t;
    }
    return null;
  }
  timeScale() {
    const r = this.regionAt(0);
    return regionById(r).biome.daySpeed || 1;
  }
  draw(ctx, cam, time, dt) {
    const lit = this._drawSky(ctx, cam, time, dt);
    this._drawGround(ctx, cam, time);
    this._drawTransitions(ctx, cam);
    return lit;
  }
  _loadBg(key) {
    const img = Assets.background(key);
    if (!img) return null;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(img, 0, 0, W, H);
    return c;
  }
  _drawSky(ctx, cam, time, dt) {
    const base = this.regionAt(cam.x + W / 2);
    const def = regionById(base);
    if (this._bgKey !== def.bg) {
      this._bgKey = def.bg;
      this._bgPlate = this._loadBg(def.bg);
    }
    const day = this._dayFactor(time);
    this.lighting.dayPhase = day;
    let top = def.biome.skyTop;
    let bot = def.biome.skyBot;
    const dark = 1 - (day * 0.7 + 0.3);
    top = mulColor(top, lerp(0.35, 0.95, dark));
    bot = mulColor(bot, lerp(0.4, 1.0, dark));
    const plate = this._bgPlate || (this._bgPlate = this._loadBg(def.bg));
    if (plate) {
      ctx.drawImage(plate, 0, 0, W, H);
      const shade = Math.min(0.6, dark * 0.45);
      ctx.fillStyle = `rgba(6,6,12,${shade.toFixed(3)})`;
      ctx.fillRect(0, 0, W + 1, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, rgb(top));
      grad.addColorStop(1, rgb(bot));
      ctx.fillStyle = grad;
      ctx.fillRect(cam.x | 0, 0, W + 1, H);
    }
    this._drawSunMoon(ctx, cam, day);
    this._drawWeather(ctx, cam, day, time);
    this._drawFog(ctx, cam);
    return day;
  }
  // A full day/night cycle takes roughly four minutes; the game starts at noon.
  _dayFactor(time) {
    const speed = 0.026;
    const raw = Math.sin(time * speed + Math.PI / 2) * 0.5 + 0.5;
    return clamp(raw, 0, 1);
  }
  _drawSunMoon(ctx, cam, day) {
    const x = cam.x * 0.3 + W * 0.5;
    const y = 30 + (1 - day) * 120;
    ctx.fillStyle = day > 0.5 ? 'rgba(255,240,200,0.9)' : 'rgba(220,220,240,0.8)';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    if (day > 0.5) {
      ctx.fillStyle = 'rgba(255,240,200,0.2)';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  _drawWeather(ctx, cam, day, t) {
    if (this.weatherActive()) {
    }
    this._drawRain(ctx, cam, day, t);
    this._drawSnow(ctx, cam, day, t);
  }
  weatherActive() {
    return this.lighting.rain > 0.01 || this.lighting.snow > 0.01;
  }
  setWeather(w) {
    this.lighting.weather = w;
    this.lighting.rain = w === 'rain' ? 1 : 0;
    this.lighting.snow = w === 'snow' ? 1 : 0;
  }
  _drawRain(ctx, cam, day, t) {
    if (this.lighting.rain <= 0.01) return;
    ctx.strokeStyle = `rgba(180,200,220,${0.25 + this.lighting.rain * 0.4})`;
    ctx.lineWidth = 1;
    const base = Math.floor(cam.x / T) * T;
    const count = 40;
    for (let i = 0; i < count; i++) {
      const x = base + ((i * 67 + 13) % (W + 32)) - 16 + (cam.x % T);
      const y = ((i * 41 + 7) % (H + 20)) - 10 + ((Math.floor(t) % 20));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 2, y + 8);
      ctx.stroke();
    }
  }
  _drawSnow(ctx, cam, day, t) {
    if (this.lighting.snow <= 0.01) return;
    ctx.fillStyle = `rgba(230,232,236,${0.4 + this.lighting.snow * 0.5})`;
    const base = Math.floor(cam.x / T) * T;
    for (let i = 0; i < 30; i++) {
      const x = base + ((i * 53 + 11) % (W + 20)) - 10;
      const y = ((i * 37 + 5) % (H + 10)) - 5;
      ctx.fillRect(x, y, 2, 2);
    }
  }
  _drawFog(ctx, cam) {
    const def = regionById(this.regionAt(cam.x + W / 2));
    const fogCol = def.biome.fog;
    const a = clamp(def.biome.ambient[0] / 120, 0.15, 0.5);
    ctx.fillStyle = `rgba(${fogCol[0]|0},${fogCol[1]|0},${fogCol[2]|0},${a})`;
    ctx.fillRect(cam.x | 0, 0, W, H);
  }
  _drawGround(ctx, cam, time) {
    const x0 = Math.max(0, (cam.x / T) | 0 - 1);
    const x1 = Math.min(this.W - 1, (cam.x / T + W / T + 2) | 0);
    for (let tx = x0; tx <= x1; tx++) {
      const top = this.height[tx];
      const px = tx * T - cam.x | 0;
      const regionId = this.regionAt(tx * T);
      const def = regionById(regionId);
      const tiles = def.tiles;
      const varIdx = Math.abs(tx * 7 + Math.floor(time * 0.2)) % 3;
      let topTile = null;
      let fillTile = null;
      if (tiles) {
        topTile = this.tileset.at(tiles.sheet, tiles.top[varIdx % tiles.top.length]);
        fillTile = this.tileset.at(tiles.sheet, tiles.fill[(tx + top) % tiles.fill.length]);
      }
      if (!topTile) topTile = this.tileset.tile(def.groundKind, varIdx);
      ctx.drawImage(topTile, px, top * T - cam.y | 0, T, T);
      for (let ty = top + 1; ty < this.H; ty++) {
        const tile2 = fillTile
          ? this.tileset.at(tiles.sheet, tiles.fill[(tx + ty) % tiles.fill.length]) || fillTile
          : this.tileset.tile('dirt', (tx + ty) % 2);
        ctx.drawImage(tile2, px, ty * T - cam.y | 0, T, T);
      }
      // One gradient per column, so the fill darkens with depth without tile banding.
      const gy = top * T - cam.y;
      if (gy < H) {
        const grad = ctx.createLinearGradient(0, gy, 0, H);
        grad.addColorStop(0, 'rgba(12,7,4,0)');
        grad.addColorStop(1, 'rgba(12,7,4,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(px, gy, T + 1, H - gy);
      }
    }
    // Second pass: decor sits on top of every column's fill, so wide props
    // (houses, tree canopies) are not clipped by the next column.
    for (let tx = x0; tx <= x1; tx++) {
      this._drawEdgeDetail(ctx, tx * T - cam.x | 0, this.height[tx], tx, this.regionAt(tx * T), time, cam.y);
    }
  }
  _drawEdgeDetail(ctx, px, top, tx, regionId, time, camY) {
    const def = regionById(regionId);
    if (def.id === 'ash') {
      if (this.houses && this.houses.includes(tx)) this._drawHouse(ctx, px, top, tx, camY);
    } else if (def.id === 'frost') {
      if (tx % 9 === 3) this._drawSnowDrift(ctx, px, top, tx, camY);
    } else if (def.id === 'forest') {
      if (tx % 5 === 2) this._drawTree(ctx, px, top, tx, camY);
      else if (tx % 11 === 7) this._drawBush(ctx, px, top, tx, camY);
    } else if (def.id === 'ruin') {
      if (tx % 13 === 4) this._drawRuinPillar(ctx, px, top, tx, camY);
    } else if (def.id === 'underdark') {
      if (tx % 4 === 1) this._drawCrystal(ctx, px, top, tx, camY);
    }
  }
  /** A low leafy bush: every clump is a half-dome based on the ground line,
   *  so the foliage always meets the soil instead of hovering above it. */
  _drawBush(ctx, px, top, tx, camY) {
    const y = top * T - camY;
    const base = px + 8;
    // Contact shadow under the foliage keeps it visually weighted to the ground.
    ctx.fillStyle = 'rgba(18,12,7,0.22)';
    ctx.fillRect(px + 2, y - 1, 15, 2);
    // Back clump
    ctx.fillStyle = '#22421d';
    ctx.beginPath();
    ctx.ellipse(base, y, 9, 7, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Leaf clumps: three scalloped lobes of different heights reads as foliage
    ctx.fillStyle = '#2f5a26';
    ctx.beginPath();
    ctx.ellipse(base - 4, y, 4.5, 5, 0, Math.PI, Math.PI * 2);
    ctx.ellipse(base + 0.5, y, 5, 7, 0, Math.PI, Math.PI * 2);
    ctx.ellipse(base + 5, y, 4.5, 4.5, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Sunlit crown on each lobe
    ctx.fillStyle = '#3f7a30';
    ctx.beginPath();
    ctx.ellipse(base - 5, y - 2, 3, 2.5, 0, Math.PI, Math.PI * 2);
    ctx.ellipse(base + 0.5, y - 3, 3.5, 3.5, 0, Math.PI, Math.PI * 2);
    ctx.ellipse(base + 6, y - 1, 2.5, 2, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // A few leaf tips catching the light
    ctx.fillStyle = '#4d8f3a';
    ctx.fillRect(px + 4, y - 5, 2, 2);
    ctx.fillRect(px + 9, y - 6, 2, 2);
    ctx.fillRect(px + 12, y - 3, 2, 2);
  }
  /** A 3-tile-wide cottage whose base sits exactly on the ground line. */
  _drawHouse(ctx, px, top, tx, camY) {
    const y = top * T - camY;
    const w = T * 3;
    const h = 34;
    // Body
    ctx.fillStyle = '#7a5540';
    ctx.fillRect(px + 2, y - h, w - 4, h);
    ctx.fillStyle = '#5f4030';
    ctx.fillRect(px + 2, y - h, 3, h);
    ctx.fillRect(px + w - 5, y - h, 3, h);
    // Timber frame
    ctx.fillStyle = '#3f2c1e';
    ctx.fillRect(px + 2, y - h, w - 4, 2);
    ctx.fillRect(px + 2, y - h + 16, w - 4, 2);
    // Roof: two stacked slabs with a slight overhang
    ctx.fillStyle = '#8c2f1f';
    ctx.fillRect(px - 2, y - h - 6, w + 4, 7);
    ctx.fillStyle = '#a83a25';
    ctx.fillRect(px + 4, y - h - 12, w - 8, 6);
    // Door
    ctx.fillStyle = '#33241a';
    ctx.fillRect(px + 20, y - 18, 10, 18);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(px + 27, y - 9, 2, 2);
    // Window with a warm light
    ctx.fillStyle = '#2a1d14';
    ctx.fillRect(px + 8, y - 28, 8, 8);
    ctx.fillStyle = 'rgba(255,214,132,0.9)';
    ctx.fillRect(px + 9, y - 27, 6, 6);
    ctx.fillStyle = '#2a1d14';
    ctx.fillRect(px + 11, y - 27, 2, 6);
  }
  _drawTree(ctx, px, top, tx, camY) {
    const y = top * T - camY;
    const h = 28 + (tx % 3) * 3;
    // Trunk, slightly wider at the base so it reads as rooted.
    ctx.fillStyle = '#4a3421';
    ctx.fillRect(px + 7, y - h, 4, h);
    ctx.fillRect(px + 5, y - 6, 8, 6);
    // Canopy: three overlapping clumps instead of one flat disc.
    const cy = y - h - 6;
    ctx.fillStyle = '#1f3d1e';
    ctx.beginPath();
    ctx.ellipse(px + 9, cy + 4, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2c5526';
    ctx.beginPath();
    ctx.ellipse(px + 3, cy - 2, 9, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(px + 16, cy - 1, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3d7033';
    ctx.beginPath();
    ctx.ellipse(px + 6, cy - 6, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  _drawSnowDrift(ctx, px, top, tx, camY) {
    ctx.fillStyle = 'rgba(240,242,246,0.7)';
    ctx.beginPath();
    ctx.ellipse(px + 8, top * T - camY - 4, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  _drawRuinPillar(ctx, px, top, tx, camY) {
    const y = top * T - camY;
    ctx.fillStyle = '#6a5240';
    ctx.fillRect(px, y - 40, 8, 40);
    ctx.fillStyle = '#4a382a';
    ctx.fillRect(px + 1, y - 38, 6, 36);
    ctx.fillStyle = '#8a7258';
    ctx.fillRect(px + 2, y - 36, 2, 4);
  }
  _drawCrystal(ctx, px, top, tx, camY) {
    const y = top * T - camY;
    ctx.fillStyle = 'rgba(120,90,190,0.9)';
    ctx.beginPath();
    ctx.moveTo(px + 4, y);
    ctx.lineTo(px + 8, y - 12);
    ctx.lineTo(px + 12, y);
    ctx.fill();
    ctx.fillStyle = 'rgba(190,160,255,0.55)';
    ctx.beginPath();
    ctx.arc(px + 8, y - 7, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  _drawTransitions(ctx, cam) {
    for (const t of this.transitions) {
      const px = t.x - cam.x | 0;
      if (px < -20 || px > W + 20) continue;
      const tx = Math.max(0, Math.min(this.W - 1, Math.floor(t.x / T)));
      const groundY = this.height[tx] * T - cam.y | 0;
      // Waystone: a short lit post at the boundary, not a screen-tall bar.
      ctx.fillStyle = '#4a3a2a';
      ctx.fillRect(px - 2, groundY - 16, 4, 16);
      ctx.fillStyle = 'rgba(224,100,43,0.85)';
      ctx.fillRect(px - 3, groundY - 20, 6, 5);
      ctx.fillStyle = 'rgba(255,170,90,0.25)';
      ctx.beginPath();
      ctx.arc(px, groundY - 18, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawDecor(ctx, cam, time, lit) {
    this._drawCampfires(ctx, cam, time, lit);
    this._drawChests(ctx, cam, time);
    this._drawSigns(ctx, cam);
    this._drawMiningNodes(ctx, cam);
    this._drawVaults(ctx, cam, time, lit);
  }
  _drawCampfires(ctx, cam, time, lit) {
    for (const f of this.campfires) {
      const px = f.tx * T - cam.x | 0;
      const top = this.height[f.tx];
      const y = top * T - cam.y | 0;
      if (px < -20 || px > W + 20) continue;
      const flicker = lit ? 0.75 + Math.sin(time * 8 + f.tx) * 0.25 : 0.25;
      const glow = ctx.createRadialGradient(px, y - 7, 0, px, y - 7, 18);
      glow.addColorStop(0, `rgba(255,180,90,${(flicker * 0.55).toFixed(2)})`);
      glow.addColorStop(1, 'rgba(255,140,50,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(px - 18, y - 25, 36, 36);
      ctx.fillStyle = `rgba(255,196,110,${flicker})`;
      ctx.beginPath();
      ctx.arc(px, y - 8, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a2a1c';
      ctx.fillRect(px - 4, y - 2, 8, 4);
    }
  }
  _drawChests(ctx, cam, time) {
    const crate = Assets.spriteKey('crate');
    for (const c of this.lootChests) {
      const px = c.tx * T - cam.x | 0;
      const top = this.height[c.tx];
      const y = top * T - cam.y | 0;
      if (px < -20 || px > W + 20) continue;
      if (crate) {
        ctx.save();
        if (c.opened) ctx.globalAlpha = 0.45;
        Assets.drawSheet(ctx, crate, 0, px + T / 2, y + 1, { scale: 1 });
        ctx.restore();
        if (!c.opened) {
          const glow = 0.45 + Math.sin(time * 4 + c.tx) * 0.15;
          ctx.fillStyle = `rgba(255,190,90,${glow.toFixed(2)})`;
          ctx.fillRect(px + 6, y - 7, 3, 3);
        }
        continue;
      }
      ctx.fillStyle = c.opened ? 'rgba(80,60,40,0.5)' : '#6a4a2a';
      ctx.fillRect(px, y - 14, 16, 14);
      ctx.fillStyle = c.opened ? 'rgba(60,40,20,0.5)' : '#8a6a3a';
      ctx.fillRect(px + 2, y - 12, 12, 4);
      if (!c.opened) {
        ctx.fillStyle = COLORS.ember;
        ctx.fillRect(px + 6, y - 9, 4, 4);
      }
    }
  }
  _drawSigns(ctx, cam) {
    for (const s of this.signs) {
      const px = s.tx * T - cam.x | 0;
      const top = this.height[s.tx];
      const groundY = top * T - cam.y;
      if (px < -20 || px > W + 20) continue;
      const y = groundY - 26;
      // Post down to the ground so the board is not floating.
      ctx.fillStyle = '#4a3421';
      ctx.fillRect(px + 6, y + 12, 3, 14);
      ctx.fillStyle = '#6a4a2a';
      ctx.fillRect(px + 2, y, 14, 13);
      ctx.fillStyle = '#c8b88a';
      ctx.fillRect(px + 3, y + 2, 12, 9);
      ctx.fillStyle = '#3a2a1c';
      ctx.fillRect(px + 5, y + 4, 8, 1);
      ctx.fillRect(px + 5, y + 7, 6, 1);
    }
  }
  _drawMiningNodes(ctx, cam) {
    for (const n of this.miningNodes) {
      const px = n.tx * T - cam.x | 0;
      const top = this.height[n.tx];
      const y = top * T - cam.y | 0;
      if (px < -20 || px > W + 20) continue;
      ctx.fillStyle = n.kind.color;
      ctx.fillRect(px + 2, y - 4, 4, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(px + 3, y - 3, 2, 2);
    }
  }
  _drawVaults(ctx, cam, time, lit) {
  }
  collideRect(x, y, w, h) {
    const x0 = Math.floor(x / T);
    const x1 = Math.floor((x + w) / T);
    const y0 = Math.floor(y / T);
    const y1 = Math.floor((y + h) / T);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (this.solid(tx, ty)) return true;
      }
    }
    return false;
  }
  canMoveTo(x, y, w, h) {
    const old = this.collideRect(x, y, w, h);
    if (!old) return true;
    return false;
  }
}
function mulColor(c, f) { return c.map((v) => Math.round(v * f)); }
function rgb(c) { return `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`; }
function pickMineKind(tx) {
  const kinds = [
    { color: '#a89060', name: 'iron_ore', weight: 1 },
    { color: '#c8a060', name: 'copper_ore', weight: 1 },
    { color: '#b0b8c8', name: 'silver_ore', weight: 0.4 },
    { color: '#e8c060', name: 'gold_ore', weight: 0.15 },
    { color: '#5a3a8a', name: 'void_crystal', weight: 0.1 },
  ];
  let total = 0;
  for (const k of kinds) total += k.weight;
  let r = Math.random() * total;
  for (const k of kinds) {
    r -= k.weight;
    if (r <= 0) return k;
  }
  return kinds[0];
}
function pickChestReward(tx) {
  const pool = [
    { id: 'iron_ingot', weight: 1 },
    { id: 'copper_ingot', weight: 1 },
    { id: 'silver_ingot', weight: 0.4 },
    { id: 'gold_ingot', weight: 0.15 },
    { id: 'void_crystal', weight: 0.08 },
    { id: 'health_potion', weight: 0.3 },
    { id: 'super_potion', weight: 0.15 },
  ];
  let total = 0;
  for (const k of pool) total += k.weight;
  let r = Math.random() * total;
  for (const k of pool) {
    r -= k.weight;
    if (r <= 0) return k.id;
  }
  return 'iron_ingot';
}
function pickSignText(tx) {
  const texts = [
    'Watch for bandits east of here.',
    'The old quarry still yields iron.',
    'Travelers say the forest grows restless at night.',
    'Frostveil pass closes after dusk. Take care.',
    'Ruins ahead. Do not stray from the road.',
    'The Underdark has claimed more than one fool.',
    'Blackthorn Keep fell to shadow long ago.',
    'Iron sells for a fair price at the forge.',
    'Skeletal knights still patrol the ruins.',
    'Beware caves — things down there remember you.',
  ];
  return texts[tx % texts.length];
}
