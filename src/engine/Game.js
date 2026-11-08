import { W, H, T } from './Constants.js';
import { Time } from './Time.js';
import { Input } from './Input.js';
import { Renderer } from './Renderer.js';
import { Camera } from './Camera.js';
import { Collision } from './Collision.js';
import { EntityManager } from './EntityManager.js';
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.camera = new Camera();
    this.input = new Input(canvas);
    this.time = new Time();
    this.world = null;
    this.collision = null;
    this.entities = new EntityManager();
    this.player = null;
    this.state = 'playing';
    this.overlay = null;
    this.paused = false;
    this.running = false;
    this.onDeath = null;
    this.onRegionEnter = null;
    this.lastRegion = null;
    this.dialogue = null;
    this.shop = null;
    this.inventoryUI = null;
    this.characterUI = null;
    this.mapUI = null;
    this.questUI = null;
  }
  setWorld(world) {
    this.world = world;
    this.collision = new Collision(world);
    this.camera.followHome = true;
  }
  setPlayer(player) {
    this.player = player;
  }
  start() {
    this.running = true;
    this.time.last = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }
  loop(now) {
    if (!this.running) return;
    const dt = this.time.tick(now);
    if (this.paused || this.overlay) {
      this.draw(dt);
      requestAnimationFrame((t) => this.loop(t));
      return;
    }
    this.time.stepLoop((s) => this.update(s));
    this.draw(dt);
    this.input.endFrame();
    requestAnimationFrame((t) => this.loop(t));
  }
  update(dt) {
    if (this.dialogue) {
      this.dialogue.update(dt);
      this.draw(dt);
      return;
    }
    if (this.shop) {
      this.shop.update(dt);
      this.draw(dt);
      return;
    }
    if (this.inventoryUI) {
      this.inventoryUI.update(dt);
      this.draw(dt);
      return;
    }
    if (this.characterUI) {
      this.characterUI.update(dt);
      this.draw(dt);
      return;
    }
    if (this.mapUI) {
      this.mapUI.update(dt);
      this.draw(dt);
      return;
    }
    if (this.questUI) {
      this.questUI.update(dt);
      this.draw(dt);
      return;
    }
    if (!this.player) return;
    this.player.update(dt);
    this.entities.updateAll(dt);
    this.camera.follow(this.player, this.world.W * T, this.world.H * T, dt);
    this.checkRegionTransition();
  }
  checkRegionTransition() {
    if (!this.player || !this.world) return;
    const region = this.world.regionAt(this.player.x);
    if (this.lastRegion !== region) {
      this.lastRegion = region;
      if (this.onRegionEnter) this.onRegionEnter(region);
    }
  }
  draw(dt) {
    this.renderer.clear();
    if (!this.world) return;
    const t = this.time.total;
    const lit = this.world.draw(this.renderer.ctx, this.camera, t, dt);
    const shake = this.camera.shakeAmt();
    this.renderer.shake(shake.x, shake.y);
    this.world.drawDecor(this.renderer.ctx, this.camera, t, lit);
    this.entities.drawAll(this.renderer.ctx, this.camera);
    if (this.combat && this.combat.draw) this.combat.draw(this.renderer.ctx, this.camera);
    this.renderer.restore();
    this.drawHUD();
    if (this.camera.isFading()) {
      const a = clamp(this.camera.fade / 0.6, 0, 1);
      this.renderer.ctx.globalAlpha = a;
      this.renderer.ctx.fillStyle = this.camera.fadeColor;
      this.renderer.ctx.fillRect(0, 0, W, H);
      this.renderer.ctx.globalAlpha = 1;
    }
  }
  drawHUD() {
    if (this.hud) this.hud.draw(this.renderer.ctx, this);
  }
  openOverlay(ui) {
    this.overlay = ui;
    if (ui && typeof ui.open === 'function') ui.open(this);
  }
  closeOverlay() {
    if (this.overlay) {
      if (typeof this.overlay.close === 'function') this.overlay.close(this);
      this.overlay = null;
    }
    this.dialogue = null;
    this.shop = null;
    this.inventoryUI = null;
    this.characterUI = null;
    this.mapUI = null;
    this.questUI = null;
  }
  stop() {
    this.running = false;
    this.input.destroy();
  }
}
