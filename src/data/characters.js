/**
 * Playable heroes.
 *
 * Two art sources are supported so the roster can grow without new code:
 *   kind: 'atlas' — a 100x100 Tiny RPG atlas (idle/walk/attack1/attack2/hurt/death)
 *   kind: 'sheet' — a 32x32 Pixel-Adventure sheet (idle/run/jump/fall/hit),
 *                   remapped onto the same six states through `anims`.
 *
 * The roster below is the whole of Tiny RPG Character Pack 01 — the soldier
 * skins and the orcs that ship in the same pack as the helmeted knight, so
 * everybody shares one animation set and one 100x100 atlas layout.
 *
 * `hand` is where the equipped weapon is held, in pixels relative to the feet
 * (positive x is the front hand while facing right); `weaponScale` shrinks the
 * weapon for the smaller bodies. `heldWeapon: false` marks a hero whose art
 * already carries its own weapon (the orc mace), so the equipment overlay is
 * skipped instead of drawing a second blade in the same fist.
 */
export const HEROES = [
  {
    id: 'knight',
    name: 'Wanderer',
    kind: 'atlas',
    sprite: 'soldier',
    scale: 1.15,
    hand: [7, -13],
    weaponScale: 1,
    blurb: 'Plate, shield and a long road. The one who left Ashenfall.',
  },
  {
    id: 'sellsword',
    name: 'Sellsword',
    kind: 'atlas',
    sprite: 'soldier_brown',
    scale: 1.15,
    hand: [7, -13],
    weaponScale: 1,
    blurb: 'Sand-toned plate and no banner. Fights for whoever pays first.',
  },
  {
    id: 'nightblade',
    name: 'Nightblade',
    kind: 'atlas',
    sprite: 'soldier_dark',
    scale: 1.15,
    hand: [7, -13],
    weaponScale: 1,
    blurb: 'Blackened steel, violet cloak. Walks the Thornwatch road alone.',
  },
  {
    id: 'brute',
    name: 'Brute',
    kind: 'atlas',
    sprite: 'orc',
    scale: 1.2,
    hand: [8, -12],
    heldWeapon: false,
    blurb: 'Tusks, iron mace and a short temper. Hits first, regrets later.',
  },
  {
    id: 'rimefang',
    name: 'Rimefang',
    kind: 'atlas',
    sprite: 'orc_blue',
    scale: 1.2,
    hand: [8, -12],
    heldWeapon: false,
    blurb: 'Frost-touched orc out of the northern caves. Brings the cold with him.',
  },
];

export const DEFAULT_HERO = 'knight';

const BY_ID = {};
for (const h of HEROES) BY_ID[h.id] = h;

export function heroById(id) {
  return BY_ID[id] || BY_ID[DEFAULT_HERO];
}
