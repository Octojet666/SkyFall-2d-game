import { Entity } from './Entity.js';
import { NPCS } from '../data/npcs.js';
import { COLORS } from '../utils/Constants.js';
import { Assets } from '../engine/Assets.js';

// The Pixel Adventure cast doubles as the village residents.
const CAST = ['vg', 'pink', 'frog', 'mask'];
export class Npc extends Entity {
  constructor(id) {
    const def = NPCS[id];
    if (!def) throw new Error('Unknown NPC: ' + id);
    super(def.x, def.y || 0, 12, 16);
    this.id = id;
    this.name = def.name;
    this.kind = def.kind || 'quest';
    this.shop = def.shop || null;
    this.quest = def.quest || null;
    this.dialogue = def.dialogue || {};
    this.color = def.color || '#7a5ab0';
    this.dark = def.dark || '#4a3278';
    this.region = def.region || 'ash';
    this.talkRange = 26 * 16;
    this.talking = false;
    this.talkTimer = 0;
    this.walkFrame = 0;
    this.walkDir = 1;
    this.animT = Math.random() * 3;
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 9973;
    this.castKey = CAST[hash % CAST.length];
  }
  draw(ctx, cam) {
    const sx = Math.round(this.x - cam.x);
    const sy = Math.round(this.y - cam.y);
    const sheet = Assets.manifest.sprites[this.castKey];
    if (sheet) {
      const anim = this.talking ? 'jump' : 'idle';
      const meta = sheet[anim] || sheet.idle;
      const shadow = Assets.spriteKey('shadow');
      if (shadow) Assets.drawSheet(ctx, shadow, 0, sx, sy + 1, { scale: 0.8 });
      Assets.drawSheet(ctx, meta, this.animT * 8, sx, sy, { scale: 0.78, dir: this.walkDir });
      if (this.talking) {
        ctx.fillStyle = COLORS.ember;
        ctx.fillRect(sx - 8, sy - 20, 16, 2);
      }
      this._drawName(ctx, sx, sy - 22);
      return;
    }
    ctx.fillStyle = this.talking ? '#ffffff' : this.color;
    ctx.fillRect(sx - 6, sy - 14, 12, 14);
    ctx.fillStyle = this.dark;
    ctx.fillRect(sx - 6, sy - 14, 12, 2);
    ctx.fillRect(sx - 6, sy - 2, 12, 2);
    ctx.fillStyle = '#e3d5b0';
    ctx.fillRect(sx - 4, sy - 12, 3, 4);
    ctx.fillRect(sx + 1, sy - 12, 3, 4);
    ctx.fillStyle = '#3a2a1c';
    ctx.fillRect(sx + (this.walkDir > 0 ? 3 : -1) - 1, sy - 6, 2, 6);
    if (this.talking) {
      ctx.fillStyle = COLORS.ember;
      ctx.fillRect(sx - 6, sy - 14, 12, 3);
    }
    this._drawName(ctx, sx, sy);
  }
  _drawName(ctx, sx, sy) {
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(6,6,12,0.75)';
    ctx.fillText(this.name, sx + 1, sy + 1);
    ctx.fillStyle = COLORS.bone;
    ctx.fillText(this.name, sx, sy);
    ctx.textAlign = 'left';
  }
  canTalkTo(player) {
    return Math.abs(this.x - player.x) < this.talkRange && Math.abs(this.y - player.y) < this.talkRange;
  }
  startTalk() {
    this.talking = true;
    this.talkTimer = 0.5;
  }
  update(dt) {
    this.animT += dt;
    this.talkTimer = Math.max(0, this.talkTimer - dt);
    if (this.talkTimer <= 0) this.talking = false;
    this.walkFrame += dt * 1.5;
  }
}
