import * as A from '../data/audio.js';
export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.music = null;
    this.sfx = null;
    this.masterGain = 0.6;
    this.musicGain = 0.5;
    this.sfxGain = 0.7;
    this.muted = false;
    this.musicOn = false;
    this.initialized = false;
  }
  init() {
    if (this.initialized) return;
    try {
      A.initAudio();
      if (!A.AUDIO.ctx) throw new Error('no audio');
      this.ctx = A.AUDIO.ctx;
      this.master = A.AUDIO.master;
      this.music = A.AUDIO.musicNode;
      this.sfx = A.AUDIO.sfxNode;
      this.masterGain = A.AUDIO.masterGain;
      this.musicGain = A.AUDIO.musicGain;
      this.sfxGain = A.AUDIO.sfxGain;
      this.initialized = true;
      this.resume();
    } catch (e) {
      this.initialized = false;
    }
  }
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playSfx(name, params = {}) {
    if (!this.sfx || this.muted) return;
    if (!this.ctx) return;
    A.sfx(name, params);
  }
  play(name, params = {}) {
    this.playSfx(name, params);
  }
  startMusic() {
    if (!this.music || !this.ctx) return;
    this.musicOn = true;
    A.startMusic();
  }
  stopMusic() {
    this.musicOn = false;
    A.stopMusic();
  }
  setMaster(v) {
    this.masterGain = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.masterGain;
    A.AUDIO.masterGain = this.masterGain;
  }
  setMusic(v) {
    this.musicGain = Math.max(0, Math.min(1, v));
    if (this.music) this.music.gain.value = this.musicGain * 0.5;
    A.AUDIO.musicGain = this.musicGain;
  }
  setSfx(v) {
    this.sfxGain = Math.max(0, Math.min(1, v));
    if (this.sfx) this.sfx.gain.value = this.sfxGain;
    A.AUDIO.sfxGain = this.sfxGain;
  }
  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : this.masterGain;
    A.AUDIO.masterGain = this.muted ? 0 : this.masterGain;
    return this.muted;
  }
  isMuted() {
    return this.muted;
  }
  isMusicOn() {
    return this.musicOn;
  }
  rain() {
    if (!this.muted && this.ctx) A.rainAmbience();
  }
  stopRain() {
    A.stopRainAmbience();
  }
  thunder() {
    if (!this.muted && this.ctx) A.playThunder();
  }
  hit() { this.playSfx('hit'); }
  kill() { this.playSfx('kill'); }
  hurt() { this.playSfx('hurt'); }
  pickup() { this.playSfx('pickup'); }
  levelup() { this.playSfx('levelup'); }
  gold() { this.playSfx('gold'); }
  shopBuy() { this.playSfx('shopBuy'); }
  shopSell() { this.playSfx('shopSell'); }
  equip() { this.playSfx('equip'); }
  quest() { this.playSfx('quest'); }
  boss() { this.playSfx('boss'); }
  spell() { this.playSfx('spell'); }
  block() { this.playSfx('block'); }
  door() { this.playSfx('door'); }
  arrow() { this.playSfx('arrow'); }
  impact() { this.playSfx('impact'); }
}
