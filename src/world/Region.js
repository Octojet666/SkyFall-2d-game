import { T, COLORS } from './Constants.js';
export class RegionDef {
  constructor(name, id, groundKind, decorate, biome, tiles, bg) {
    this.name = name;
    this.id = id;
    this.groundKind = groundKind;
    this.decorate = decorate;
    this.biome = biome;
    // tiles: { sheet, top: [[col,row],...], fill: [[col,row],...] } from the 16x16 terrain atlas
    this.tiles = tiles || null;
    this.bg = bg || 'brown';
  }
}

// (7,0) is the seamless middle grass-top tile; (6,0)/(8,0) are the end caps and
// would leave dark seams if repeated along a run.
const GRASS = { sheet: 'terrain', top: [[7, 0]], fill: [[7, 1]] };
const GRASS_DARK = { sheet: 'terrain', top: [[7, 0]], fill: [[7, 2]] };
const SNOW = { sheet: 'snow', top: [[7, 0]], fill: [[7, 1]] };
const SAND = { sheet: 'ruin', top: [[7, 4]], fill: [[7, 5]] };
const ROCK = { sheet: 'cave', top: [[7, 4]], fill: [[7, 5]] };
const BRICK = { sheet: 'terrain', top: [[7, 4]], fill: [[18, 5], [18, 6]] };
export const REGIONS = [
  new RegionDef('Ashenfall Village', 'ash', 'grass', () => 0, {
    skyTop: COLORS.bgDay,
    skyBot: [90, 80, 70],
    fog: [30, 24, 26],
    ambient: [60, 56, 50],
    daySpeed: 1,
  }, GRASS, 'brown'),
  new RegionDef('Whispering Forest', 'forest', 'grassForest', () => 1, {
    skyTop: [36, 52, 76],
    skyBot: [70, 70, 60],
    fog: [22, 28, 22],
    ambient: [50, 60, 48],
    daySpeed: 1.1,
  }, GRASS_DARK, 'green'),
  new RegionDef('Frostveil Foothills', 'frost', 'snow', () => 2, {
    skyTop: [92, 104, 120],
    skyBot: [150, 150, 158],
    fog: [120, 124, 132],
    ambient: [120, 124, 132],
    daySpeed: 1.2,
  }, SNOW, 'gray'),
  new RegionDef('Forgotten Ruins', 'ruin', 'ruinwall', () => 3, {
    skyTop: [60, 48, 40],
    skyBot: [80, 60, 48],
    fog: [40, 30, 26],
    ambient: [90, 70, 52],
    daySpeed: 0.9,
  }, SAND, 'brown'),
  new RegionDef('The Underdark', 'underdark', 'cave', () => 4, {
    skyTop: [8, 8, 14],
    skyBot: [14, 12, 18],
    fog: [6, 6, 10],
    ambient: [20, 18, 26],
    daySpeed: 0,
  }, ROCK, 'purple'),
  new RegionDef('Blackthorn Keep', 'blackthorn', 'stone', () => 5, {
    skyTop: [40, 40, 52],
    skyBot: [70, 64, 60],
    fog: [28, 26, 32],
    ambient: [60, 56, 60],
    daySpeed: 1,
  }, BRICK, 'gray'),
];
export const regionById = (id) => REGIONS.find((r) => r.id === id);
