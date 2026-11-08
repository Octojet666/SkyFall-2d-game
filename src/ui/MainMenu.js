import { COLORS } from '../utils/Constants.js';
import { W, H } from '../utils/Constants.js';
export class MainMenu {
  constructor(canvas) {
    this.canvas = canvas;
    this.active = true;
    this.choice = 'new';
    this.cursor = 0;
    this.options = ['New Game', 'Continue', 'Settings', 'Quit'];
    this.settings = {
      master: 0.7,
      music: 0.5,
      sfx: 0.7,
      muted: false,
    };
    this.cursorTimer = 0;
  }
  start(newGameFn, continueFn, settingsFn) {
    this.newGameFn = newGameFn;
    this.continueFn = continueFn;
    this.settingsFn = settingsFn;
  }
  update(dt, game) {
    if (!this.active) return;
    this.cursorTimer -= dt;
    if (this.cursorTimer <= 0) {
      this.cursorTimer = 0.08;
    }
    if (game && game.input) {
      if (game.input.hit('KeyW') || game.input.hit('ArrowUp')) {
        this.cursor = Math.max(0, this.cursor - 1);
        this.cursorTimer = 0.15;
      }
      if (game.input.hit('KeyS') || game.input.hit('ArrowDown')) {
        this.cursor = Math.min(this.options.length - 1, this.cursor + 1);
        this.cursorTimer = 0.15;
      }
      if (game.input.hit('Space') || game.input.hit('Enter')) {
        this.select(game);
      }
      if (game.input.hit('KeyE')) {
        if (this.cursor === 0) this.select(game);
      }
    }
  }
  select(game) {
    const action = this.options[this.cursor];
    if (!action) return;
    if (action === 'New Game') {
      if (this.newGameFn) this.newGameFn(game);
      this.active = false;
      return true;
    }
    if (action === 'Continue') {
      if (this.continueFn) {
        const ok = this.continueFn(game);
        if (ok) this.active = false;
      }
      return;
    }
    if (action === 'Settings') {
      this.openSettings();
      return;
    }
    if (action === 'Quit') {
      if (game) game.stop();
      return 'quit';
    }
  }
  openSettings() {
  }
  draw(ctx, game) {
    if (!this.active) return;
    ctx.fillStyle = 'rgba(10,8,16,0.95)';
    ctx.fillRect(0, 0, W, H);
    const title = 'SKYFALL';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 38px "Courier New",monospace';
    ctx.fillStyle = COLORS.ember;
    ctx.fillText(title, W / 2, 60);
    ctx.font = '12px "Courier New",monospace';
    ctx.fillStyle = COLORS.bone;
    ctx.fillText('A 2D fantasy RPG', W / 2, 88);
    ctx.font = '10px "Courier New",monospace';
    ctx.fillStyle = COLORS.textDim;
    const menuY = 140;
    for (let i = 0; i < this.options.length; i++) {
      const x = W / 2 - 80;
      const y = menuY + i * 26;
      ctx.fillStyle = i === this.cursor ? COLORS.ember : COLORS.bone;
      ctx.fillText((i === this.cursor ? '>' : ' ') + this.options[i], x, y);
    }
    ctx.font = '9px "Courier New",monospace';
    ctx.fillStyle = COLORS.textDim;
    ctx.fillText('A/D or arrows to move, Space/Enter to select, Esc to quit', W / 2, H - 30);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}
