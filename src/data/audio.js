export const AUDIO = {
  masterGain: 0.6,
  sfxGain: 0.7,
  musicGain: 0.5,
  mute: false,
  ctx: null,
  master: null,
  sfxNode: null,
  musicNode: null,
  loaded: false,
  musicPlaying: false,
  _osc: null,
  _sFade: 0,
  _musicPhase: 0,
  _stepTimers: {},
  _ambienceNode: null,
};
export const SFX = {
  hit: 'hit',
  kill: 'kill',
  hurt: 'hurt',
  footstep: 'footstep',
  pickup: 'pickup',
  levelup: 'levelup',
  gold: 'gold',
  shopBuy: 'shopBuy',
  shopSell: 'shopSell',
  equip: 'equip',
  quest: 'quest',
  boss: 'boss',
  spell: 'spell',
  block: 'block',
  door: 'door',
};
export function initAudio() {
  if (AUDIO.ctx) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    AUDIO.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = AUDIO.masterGain;
    master.connect(ctx.destination);
    AUDIO.master = master;
    const sfx = ctx.createGain();
    sfx.gain.value = AUDIO.sfxGain;
    sfx.connect(master);
    AUDIO.sfxNode = sfx;
    const music = ctx.createGain();
    music.gain.value = AUDIO.musicGain * 0.5;
    music.connect(master);
    AUDIO.musicNode = music;
    AUDIO.loaded = true;
    scheduleMusic(ctx, music);
  } catch (e) {
    AUDIO.loaded = false;
  }
}
function scheduleMusic(ctx, musicNode) {
  AUDIO._stepTimers = {};
  AUDIO._musicPhase = 0;
  const step = (time) => {
    if (!ctx || !AUDIO.musicPlaying) return;
    AUDIO._musicPhase += 0.016;
    const beat = AUDIO._musicPhase;
    if ((Math.floor(beat * 4) & 1) === 0) {
      playTone(ctx, musicNode, 110, 0.05, 0.4, 'sine', 0.15);
    }
    if (Math.floor(beat * 2) % 2 === 0) {
      playTone(ctx, musicNode, 165, 0.04, 0.3, 'triangle', 0.12);
    }
    if (beat % 0.5 < 0.05) {
      playTone(ctx, musicNode, 220, 0.03, 0.2, 'sine', 0.08);
    }
    const next = (Math.floor(beat * 4) + 1) / 4;
    const delay = Math.max(0, next - AUDIO._musicPhase);
    AUDIO._nextTimer = setTimeout(() => {
      if (ctx && AUDIO.musicPlaying) step(ctx.currentTime);
    }, delay * 1000);
  };
  AUDIO._musicStep = step;
  if (AUDIO.musicPlaying) step(ctx.currentTime);
}
export function startMusic() {
  if (!AUDIO.ctx || !AUDIO.musicNode) return;
  AUDIO.musicPlaying = true;
  AUDIO._musicPhase = 0;
  AUDIO._musicStep(AUDIO.ctx.currentTime);
}
export function stopMusic() {
  AUDIO.musicPlaying = false;
  if (AUDIO._nextTimer) {
    clearTimeout(AUDIO._nextTimer);
    AUDIO._nextTimer = null;
  }
}
export function playTone(ctx, dest, freq, dur, vol, type = 'square', ease = 0.02) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + ease);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
export function noiseBurst(dest, dur, vol, high = false) {
  if (!AUDIO.ctx) return;
  const ctx = AUDIO.ctx;
  const t = ctx.currentTime;
  const bufSize = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    let n = Math.random() * 2 - 1;
    if (high) n *= (i / bufSize);
    data[i] = n;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(g);
  g.connect(dest);
  src.start(t);
}
export function sfx(name, params = {}) {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  const ctx = AUDIO.ctx;
  if (!ctx) return;
  switch (name) {
    case SFX.hit:
      playTone(ctx, AUDIO.sfxNode, 180 + Math.random() * 40, 0.08, 0.25, 'square', 0.01);
      noiseBurst(AUDIO.sfxNode, 0.05, 0.15, true);
      break;
    case SFX.kill:
      playTone(ctx, AUDIO.sfxNode, 240, 0.1, 0.2, 'triangle', 0.01);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 320, 0.12, 0.18, 'triangle', 0.01), 60);
      break;
    case SFX.hurt:
      playTone(ctx, AUDIO.sfxNode, 120, 0.12, 0.28, 'sawtooth', 0.01);
      break;
    case SFX.footstep:
      noiseBurst(AUDIO.sfxNode, 0.04, 0.08, true);
      break;
    case SFX.pickup:
      playTone(ctx, AUDIO.sfxNode, 520, 0.06, 0.15, 'sine', 0.01);
      playTone(ctx, AUDIO.sfxNode, 680, 0.08, 0.12, 'sine', 0.01);
      break;
    case SFX.levelup:
      playTone(ctx, AUDIO.sfxNode, 440, 0.1, 0.2, 'sine', 0.01);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 550, 0.1, 0.2, 'sine', 0.01), 80);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 660, 0.14, 0.22, 'sine', 0.01), 160);
      break;
    case SFX.gold:
      playTone(ctx, AUDIO.sfxNode, 880, 0.05, 0.12, 'sine', 0.01);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 1100, 0.07, 0.1, 'sine', 0.01), 60);
      break;
    case SFX.shopBuy:
      playTone(ctx, AUDIO.sfxNode, 330, 0.08, 0.15, 'triangle', 0.01);
      break;
    case SFX.shopSell:
      playTone(ctx, AUDIO.sfxNode, 220, 0.08, 0.15, 'triangle', 0.01);
      break;
    case SFX.equip:
      playTone(ctx, AUDIO.sfxNode, 260, 0.06, 0.15, 'sine', 0.01);
      playTone(ctx, AUDIO.sfxNode, 390, 0.08, 0.12, 'sine', 0.01);
      break;
    case SFX.quest:
      playTone(ctx, AUDIO.sfxNode, 390, 0.1, 0.18, 'triangle', 0.01);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 520, 0.12, 0.18, 'triangle', 0.01), 100);
      break;
    case SFX.boss:
      playTone(ctx, AUDIO.sfxNode, 90, 0.3, 0.3, 'sawtooth', 0.02);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 70, 0.3, 0.3, 'sawtooth', 0.02), 150);
      break;
    case SFX.spell:
      playTone(ctx, AUDIO.sfxNode, 300, 0.12, 0.2, 'sine', 0.01);
      noiseBurst(AUDIO.sfxNode, 0.1, 0.18, true);
      break;
    case SFX.block:
      playTone(ctx, AUDIO.sfxNode, 120, 0.06, 0.18, 'triangle', 0.01);
      noiseBurst(AUDIO.sfxNode, 0.04, 0.12, true);
      break;
    case SFX.door:
      playTone(ctx, AUDIO.sfxNode, 150, 0.12, 0.15, 'triangle', 0.01);
      setTimeout(() => playTone(ctx, AUDIO.sfxNode, 110, 0.14, 0.12, 'triangle', 0.01), 80);
      break;
    case SFX.arrow:
      playTone(ctx, AUDIO.sfxNode, 480, 0.05, 0.12, 'sine', 0.01);
      noiseBurst(AUDIO.sfxNode, 0.06, 0.1, true);
      break;
    case SFX.thunder:
      noiseBurst(AUDIO.sfxNode, 0.5, 0.25, true);
      playTone(ctx, AUDIO.sfxNode, 55, 0.4, 0.2, 'sine', 0.02);
      break;
    case SFX.rain:
      noiseBurst(AUDIO.sfxNode, 0.3, 0.06, true);
      break;
    case SFX.impact:
      noiseBurst(AUDIO.sfxNode, 0.08, 0.3, true);
      playTone(ctx, AUDIO.sfxNode, 100, 0.1, 0.2, 'square', 0.01);
      break;
    default:
      playTone(ctx, AUDIO.sfxNode, 220, 0.1, 0.15, 'square', 0.01);
  }
}
export function setMaster(v) {
  AUDIO.masterGain = clamp(v, 0, 1);
  if (AUDIO.master) AUDIO.master.gain.value = AUDIO.masterGain;
}
export function setMusic(v) {
  AUDIO.musicGain = clamp(v, 0, 1);
  if (AUDIO.musicNode) AUDIO.musicNode.gain.value = AUDIO.musicGain * 0.5;
}
export function setSfx(v) {
  AUDIO.sfxGain = clamp(v, 0, 1);
  if (AUDIO.sfxNode) AUDIO.sfxNode.gain.value = AUDIO.sfxGain;
}
export function toggleMute() {
  AUDIO.mute = !AUDIO.mute;
  if (AUDIO.master) AUDIO.master.gain.value = AUDIO.mute ? 0 : AUDIO.masterGain;
  return AUDIO.mute;
}
export function isMuted() {
  return AUDIO.mute;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
export function resumeAudio() {
  if (AUDIO.ctx && AUDIO.ctx.state === 'suspended') {
    AUDIO.ctx.resume();
  }
}
export function rainAmbience() {
  if (!AUDIO.ctx || AUDIO.mute) return;
  const interval = setInterval(() => {
    if (!AUDIO.musicPlaying || AUDIO.mute) { clearInterval(interval); return; }
    sfx('rain');
  }, 180);
  AUDIO._rainTimer = interval;
}
export function stopRainAmbience() {
  if (AUDIO._rainTimer) {
    clearInterval(AUDIO._rainTimer);
    AUDIO._rainTimer = null;
  }
}
export function thunder() {
  if (!AUDIO.ctx || AUDIO.mute) return;
  sfx('thunder');
  setTimeout(() => sfx('thunder'), 200 + Math.random() * 400);
}
export function playHit(vol = 1) {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 200 + Math.random() * 60, 0.07 * vol, 0.2 * vol, 'square', 0.01);
  noiseBurst(AUDIO.sfxNode, 0.05 * vol, 0.12 * vol, true);
}
export function playKill() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 260, 0.1, 0.2, 'triangle', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 360, 0.12, 0.18, 'triangle', 0.01), 60);
}
export function playHurt() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 110, 0.14, 0.3, 'sawtooth', 0.01);
}
export function playPickup() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 540, 0.07, 0.16, 'sine', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 700, 0.09, 0.14, 'sine', 0.01), 60);
}
export function playLevelUp() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 440, 0.1, 0.2, 'sine', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 550, 0.1, 0.2, 'sine', 0.01), 80);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 660, 0.14, 0.22, 'sine', 0.01), 160);
}
export function playGold() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 880, 0.05, 0.12, 'sine', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 1100, 0.07, 0.1, 'sine', 0.01), 60);
}
export function playShopBuy() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 330, 0.08, 0.16, 'triangle', 0.01);
}
export function playShopSell() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 220, 0.08, 0.16, 'triangle', 0.01);
}
export function playEquip() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 260, 0.07, 0.16, 'sine', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 390, 0.09, 0.14, 'sine', 0.01), 70);
}
export function playQuest() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 390, 0.1, 0.18, 'triangle', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 520, 0.12, 0.18, 'triangle', 0.01), 100);
}
export function playBoss() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 90, 0.3, 0.32, 'sawtooth', 0.02);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 70, 0.3, 0.32, 'sawtooth', 0.02), 150);
}
export function playSpell() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 300, 0.12, 0.22, 'sine', 0.01);
  noiseBurst(AUDIO.sfxNode, 0.1, 0.18, true);
}
export function playBlock() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 120, 0.06, 0.2, 'triangle', 0.01);
  noiseBurst(AUDIO.sfxNode, 0.04, 0.14, true);
}
export function playDoor() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 150, 0.12, 0.16, 'triangle', 0.01);
  setTimeout(() => AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 110, 0.14, 0.13, 'triangle', 0.01), 80);
}
export function playArrow() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 480, 0.05, 0.12, 'sine', 0.01);
  noiseBurst(AUDIO.sfxNode, 0.06, 0.1, true);
}
export function playThunder() {
  if (!AUDIO.ctx || AUDIO.mute) return;
  sfx('thunder');
  setTimeout(() => sfx('thunder'), 200 + Math.random() * 400);
}
export function playRain() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  noiseBurst(AUDIO.sfxNode, 0.3, 0.06, true);
}
export function playImpact() {
  if (!AUDIO.sfxNode || AUDIO.mute) return;
  noiseBurst(AUDIO.sfxNode, 0.08, 0.3, true);
  AUDIO.ctx && playTone(AUDIO.ctx, AUDIO.sfxNode, 100, 0.1, 0.2, 'square', 0.01);
}
export const SFX_NAMES = Object.values(SFX);
