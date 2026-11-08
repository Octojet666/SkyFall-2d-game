import { COLORS } from '../utils/Constants.js';
import { W, H } from '../utils/Constants.js';

export class DialogueUI {
  constructor() {}

  /** Greedy word wrap using the current font metrics. */
  _wrap(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/);
    const rows = [];
    let line = '';
    for (const word of words) {
      const next = line ? line + ' ' + word : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        rows.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) rows.push(line);
    return rows.length ? rows : [''];
  }

  draw(ctx, cam, dialogue) {
    if (!dialogue || !dialogue.active) return;

    const pad = 10;
    const lineH = 13;
    const gap = 3;
    const boxW = W - pad * 2;
    const innerW = boxW - pad * 2;
    const line = dialogue.currentLine();
    const speaker = dialogue.npc ? dialogue.npc.name + ': ' : '';
    const body = line != null ? String(line) : '';

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = '10px "Courier New",monospace';
    const rows = [];
    this._wrap(ctx, speaker + body, innerW).forEach((r) => rows.push({ text: r }));
    if (dialogue.hasChoices()) {
      for (const c of dialogue.choicesFor()) {
        rows.push({ text: '> ' + (c.short || c.text || ''), choice: true });
      }
    }

    const boxH = rows.length * (lineH + gap) + pad * 2 + 14;
    const bx = pad;
    const by = H - boxH - 8;

    ctx.fillStyle = 'rgba(10,8,16,0.94)';
    ctx.fillRect(bx, by, boxW, boxH);
    ctx.strokeStyle = COLORS.ember;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx + 1, by + 1, boxW - 2, boxH - 2);

    let yy = by + pad;
    rows.forEach((row, i) => {
      ctx.fillStyle = row.choice ? COLORS.gold : i === 0 && speaker ? COLORS.ember : COLORS.bone;
      ctx.fillText(row.text, bx + pad, yy);
      yy += lineH + gap;
    });

    ctx.fillStyle = COLORS.textDim;
    ctx.font = '8px "Courier New",monospace';
    ctx.fillText(dialogue.hasChoices() ? 'click / Enter to choose' : 'any key or click to continue', bx + pad, yy + 2);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}
