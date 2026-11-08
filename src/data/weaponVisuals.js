// Per-weapon presentation data for the MedievalFantasy - Volume I sprites.
// `sprite` names the PNG in assets/sprites/weapons (some weapons share art),
// `scale` keeps small blades small, `kind` picks the held/attack pose.
import { WEAPON_GRIPS } from './weaponGrips.js';

export const WEAPON_SPRITE_DIR = 'assets/sprites/weapons/';

export const WEAPON_VISUALS = {
  wood_sword: { sprite: 'wood_sword', scale: 1.0, kind: 'blade' },
  iron_sword: { sprite: 'iron_sword', scale: 1.0, kind: 'blade' },
  steel_sword: { sprite: 'steel_sword', scale: 1.0, kind: 'blade' },
  rapier: { sprite: 'rapier', scale: 1.0, kind: 'blade' },
  dagger: { sprite: 'dagger', scale: 0.78, kind: 'blade' },
  runed_sword: { sprite: 'runed_sword', scale: 1.05, kind: 'blade' },
  hand_axe: { sprite: 'hand_axe', scale: 0.92, kind: 'axe' },
  battle_axe: { sprite: 'battle_axe', scale: 1.05, kind: 'axe' },
  war_pick: { sprite: 'war_pick', scale: 1.0, kind: 'axe' },
  mace: { sprite: 'mace', scale: 0.95, kind: 'axe' },
  warhammer: { sprite: 'warhammer', scale: 1.05, kind: 'axe' },
  flail: { sprite: 'flail', scale: 1.1, kind: 'axe' },
  spear: { sprite: 'spear', scale: 1.05, kind: 'pole' },
  halberd: { sprite: 'halberd', scale: 1.1, kind: 'pole' },
  shortbow: { sprite: 'shortbow', scale: 0.95, kind: 'bow' },
  longbow: { sprite: 'shortbow', scale: 1.15, kind: 'bow' },
  crossbow: { sprite: 'crossbow', scale: 1.0, kind: 'bow' },
  runed_staff: { sprite: 'runed_staff', scale: 1.05, kind: 'staff' },
};

/** Rest angle (radians) of each weapon class, blade pointing up-forward. */
export const REST_ANGLE = { blade: -0.16, axe: -0.1, pole: -0.05, bow: -0.62, staff: -0.12 };

/** Swing arc for melee classes; bows/staffs only recoil. */
export const SWING = {
  blade: [-1.15, 0.95],
  axe: [-1.4, 1.15],
  pole: [-0.75, 0.7],
  staff: [-0.5, 0.5],
  bow: [0, 0],
};

export function weaponVisual(itemId) {
  const v = WEAPON_VISUALS[itemId];
  if (!v) return null;
  const grip = WEAPON_GRIPS[v.sprite] || [2, 14];
  return { ...v, grip, src: WEAPON_SPRITE_DIR + v.sprite + '.png' };
}

export function weaponIconSrc(itemId) {
  const v = weaponVisual(itemId);
  return v ? v.src : null;
}

export function weaponSpriteList() {
  return Object.keys(WEAPON_VISUALS).map((id) => weaponVisual(id).src);
}
