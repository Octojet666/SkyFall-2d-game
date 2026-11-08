import { REGIONS } from './Region.js';
import { T, COLORS } from './Constants.js';
export class WorldMap {
  constructor() {
    this.regions = REGIONS.slice();
    this.visited = new Set();
    this.connected = new Set(['ash', 'forest']);
    this.discovered = new Set(['ash', 'forest']);
    this.icons = [];
  }
  markVisited(id) {
    this.visited.add(id);
  }
  connect(id) {
    this.connected.add(id);
  }
  discover(id) {
    this.discovered.add(id);
  }
  reset() {
    this.visited.clear();
    this.visited.add('ash');
    this.connected.clear();
    this.connected.add('ash', 'forest');
    this.discovered.clear();
    this.discovered.add('ash', 'forest');
    this.icons.length = 0;
  }
  icon(x, y, color, label) {
    this.icons.push({ x, y, color, label });
  }
  draw(ctx, cam, viewW, viewH) {
    ctx.save();
    ctx.fillStyle = 'rgba(10,8,16,0.92)';
    ctx.fillRect(0, 0, viewW, viewH);
    const padX = 24;
    const padY = 24;
    const usableW = viewW - padX * 2;
    const usableH = viewH - padY * 2 - 20;
    const cols = 3;
    const rows = Math.ceil(this.regions.length / cols);
    const cellW = usableW / cols;
    const cellH = usableH / rows;
    ctx.textAlign = 'left';
    ctx.font = '9px "Courier New", monospace';
    let idx = 0;
    for (const r of this.regions) {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padX + col * cellW;
      const y = padY + row * cellH;
      const known = this.discovered.has(r.id);
      ctx.fillStyle = known ? 'rgba(40,34,30,0.9)' : 'rgba(20,16,20,0.9)';
      ctx.fillRect(x, y, cellW - 4, cellH - 4);
      ctx.strokeStyle = known ? COLORS.ember : 'rgba(90,58,38,0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cellW - 5, cellH - 5);
      ctx.fillStyle = known ? COLORS.bone : 'rgba(120,100,80,0.6)';
      const label = known ? r.name : '???';
      ctx.fillText(label, x + 6, y + 12);
      if (known) {
        ctx.fillStyle = this.visited.has(r.id) ? COLORS.ember : 'rgba(200,180,120,0.7)';
        ctx.fillRect(x + 6, y + 20, 8, 3);
        ctx.fillStyle = this.connected.has(r.id) ? COLORS.ember : 'rgba(120,100,80,0.5)';
        ctx.fillText(this.connected.has(r.id) ? 'reachable' : 'locked', x + 6, y + 30);
      }
      idx++;
    }
    ctx.fillStyle = COLORS.bone;
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillText('World Map', padX, padY - 6);
    ctx.restore();
  }
}
