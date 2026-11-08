import { W, H, COLORS } from '../utils/Constants.js';
import { Assets } from '../engine/Assets.js';
export class Hud {
  constructor() {
    this.message = '';
    this.messageT = 0;
  }
  setMessage(msg, dur = 2.5) {
    this.message = msg;
    this.messageT = dur;
  }
  update(dt) {
    if (this.messageT > 0) this.messageT -= dt;
  }
  draw(ctx, game) {
    const p = game.player;
    if (!p) return;
    const cam = game.camera;
    this._stats(ctx, p, cam);
    this._message(ctx, cam);
    this._controls(ctx, cam);
  }
  _stats(ctx, p, cam) {
    ctx.textBaseline = 'alphabetic';
    const x = 30;
    let y = 14;
    const barW = 74;
    const barH = 6;
    const step = 10;
    ctx.fillStyle = 'rgba(8,7,14,0.55)';
    ctx.fillRect(2, 3, 110, 52);
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(2.5, 3.5, 109, 51);
    this._bar(ctx, x, y, barW, barH, p.hp, p.maxHp, COLORS.danger, '#331414', 'HP');
    this._bar(ctx, x, y + step, barW, barH, p.stamina || 60, p.maxStamina || 60, COLORS.heal, '#123322', 'STA');
    this._bar(ctx, x, y + step * 2, barW, barH, p.mana || 30, p.maxMana || 30, COLORS.mana, '#131f38', 'MP');
    y += step * 3 - 2;
    const xpNext = p.xpToNext || 20;
    this._bar(ctx, x, y, barW, 3, p.xp || 0, xpNext, '#c9a227', '#241f14', null);
    y += 10;
    ctx.font = '7px monospace';
    ctx.fillStyle = COLORS.textDim;
    ctx.fillText('LV ' + p.level, 6, y);
    ctx.fillStyle = COLORS.gold;
    ctx.fillText(p.gold + 'g', 34, y);
    this._rightStats(ctx, p, cam);
  }
  _rightStats(ctx, p, cam) {
    ctx.textAlign = 'right';
    ctx.font = '9px monospace';
    const weaponName = p.weaponName || 'Fists';
    const icon = p.weapon ? Assets.weapon(p.weapon) : null;
    const left = icon ? W - 106 : W - 86;
    ctx.fillStyle = 'rgba(8,7,14,0.78)';
    ctx.fillRect(left, 3, W - 3 - left, 28);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(left + 0.5, 3.5, W - 4 - left, 27);
    if (icon) Assets.drawWeaponIcon(ctx, p.weapon, left + 11, 17, 1);
    ctx.fillStyle = COLORS.ember;
    ctx.fillText(weaponName, W - 9, 14);
    ctx.fillStyle = COLORS.text;
    ctx.fillText('Kills ' + (p.killCount || 0), W - 9, 25);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  _bar(ctx, x, y, w, h, val, max, color, bg, label) {
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);
    if (max > 0) {
      const f = Math.max(0, Math.min(1, val / max));
      ctx.fillStyle = color;
      ctx.fillRect(x, y, Math.max(1, w * f), h);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    if (label) {
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = COLORS.bone;
      ctx.fillText(label, x - 3, y + h - 1);
      ctx.textAlign = 'left';
      const f = max > 0 ? Math.max(0, Math.min(1, val / max)) : 0;
      if (f < 0.999) {
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillText(Math.round(f * 100) + '%', x + w + 1, y + h - 1);
        ctx.fillStyle = COLORS.bone;
        ctx.fillText(Math.round(f * 100) + '%', x + w - 1, y + h - 1);
        ctx.textAlign = 'left';
      }
    }
  }
  _message(ctx, cam) {
    if (this.messageT <= 0 || !this.message) return;
    const a = Math.min(1, this.messageT);
    ctx.globalAlpha = a;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px monospace';
    const w = ctx.measureText(this.message).width + 16;
    const x = W / 2;
    const y = 104;
    ctx.fillStyle = 'rgba(10,8,16,0.85)';
    ctx.fillRect(x - w / 2, y - 10, w, 20);
    ctx.fillStyle = '#ffd23f';
    ctx.fillText(this.message, x, y + 1);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  _controls(ctx, cam) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = '7px monospace';
    ctx.fillStyle = 'rgba(8,7,14,0.7)';
    ctx.fillRect(0, H - 12, W, 12);
    ctx.fillStyle = COLORS.textDim;
    const txt = 'A/D move  SPACE jump  J attack  E talk  I bag  P stats  C hero  M map  ESC';
    ctx.fillText(txt, 6, H - 3);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}
