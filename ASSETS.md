# Asset spec

Everything the renderer loads is listed in `src/data/spriteManifest.js`, and
`src/engine/Assets.js` walks that manifest once at startup. Missing files are
not fatal: the load resolves with `null` and the caller draws a placeholder
shape, so you can fill `assets/` in gradually and the game will keep running.

Drop files in with the paths and layouts below and nothing else needs to
change. If your art is laid out differently, change the numbers in the
manifest instead of the code.

Use transparent PNGs and keep filtering nearest-neighbour (the canvas is
already scaled with `image-rendering: pixelated`).

## Characters — `assets/atlas/<name>.png`

One 900×600 sheet per character: a 9 × 6 grid of 100 × 100 cells.

Rows are fixed, top to bottom:

| Row | Animation | Frames used |
| --- | --- | --- |
| 0 | `idle` | 6 |
| 1 | `walk` | 8 |
| 2 | `attack1` | 6–8, depends on the sheet |
| 3 | `attack2` | 6–9, depends on the sheet |
| 4 | `hurt` | 4 |
| 5 | `death` | 4 |

Extra columns are ignored, so a sheet can hold a longer animation than the
game uses.

Each cell is drawn anchored to the character's feet at 60 px down from the top
of the cell and horizontally centred, so keep the feet on that line and leave
the rest as headroom. If your art sits elsewhere in the cell you will see it
float or sink.

Sheets the game asks for:

| File | idle | walk | attack1 | attack2 | hurt | death |
| --- | --- | --- | --- | --- | --- | --- |
| `soldier.png` | 6 | 8 | 6 | 9 | 4 | 4 |
| `soldier_brown.png` | 6 | 8 | 6 | 9 | 4 | 4 |
| `soldier_dark.png` | 6 | 8 | 6 | 9 | 4 | 4 |
| `orc.png` | 6 | 8 | 6 | 6 | 4 | 4 |
| `orc_blue.png` | 6 | 8 | 6 | 6 | 4 | 4 |
| `orc_pale.png` | 6 | 8 | 6 | 6 | 4 | 4 |
| `demon.png` | 6 | 8 | 7 | 7 | 4 | 4 |
| `demon_violet.png` | 6 | 8 | 7 | 7 | 4 | 4 |
| `bloodmonster.png` | 6 | 8 | 8 | 8 | 4 | 4 |
| `bloodmonster_moss.png` | 6 | 8 | 8 | 8 | 4 | 4 |

You do not need all ten. The playable roster is in
`src/data/characters.js` and the bestiary in `src/data/enemies.js` — trim
either list to the sheets you actually have, or point several entries at one
sheet with a different tint.

## Tiles — `assets/tiles/*.png`

`terrain.png`, `terrain_snow.png`, `terrain_cave.png`, `terrain_ruin.png`.

352 × 176, i.e. 22 × 11 cells of 16 × 16. Tile indices in
`src/world/Tileset.js` refer to positions in that grid, so if you change the
sheet size you need to change those indices too.

## Backgrounds — `assets/bg/*.png`

`blue.png`, `brown.png`, `gray.png`, `green.png`, `pink.png`, `purple.png`,
`yellow.png` — 64 × 64 each, tiled behind the parallax layers. The regions pick
one of these per area.

## NPC and villager sheets — `assets/sprites/npc/`

Four sets: `vg`, `pink`, `frog`, `mask`. Each is six files of 32 × 32 frames:

| File | Frames |
| --- | --- |
| `<set>_idle.png` | 11 |
| `<set>_run.png` | 12 |
| `<set>_jump.png` | 1 |
| `<set>_fall.png` | 1 |
| `<set>_hit.png` | 7 |
| `<set>_djump.png` | 6 |

## Items — `assets/sprites/items/`

| File | Size | Notes |
| --- | --- | --- |
| `apple.png`, `bananas.png`, `cherries.png`, `kiwi.png`, `melon.png`, `orange.png`, `pineapple.png`, `strawberry.png` | 32 × 32 | 17 frames each |
| `collected.png` | 32 × 32 | 6 frames |
| `crate1.png` | 28 × 24 | single frame, anchored 14 px from the left and 22 px from the top |
| `crate1_break.png` | 28 × 24 | 4 frames, anchored 14 px / 18 px |

## Effects and projectiles — `assets/sprites/fx/`, `assets/sprites/proj/`

| File | Size | Notes |
| --- | --- | --- |
| `fx/dust.png` | 16 × 16 | 1 frame |
| `fx/shadow.png` | 16 × 16 | 1 frame |
| `fx/confetti.png` | 96 × 16 | 6 frames |
| `proj/arrow.png` | 32 × 32 | 1 frame |

## Weapons — `assets/sprites/weapons/`

Eighteen 16 × 16 icons, one per weapon in `src/data/items.js`:

`wood_sword`, `iron_sword`, `steel_sword`, `runed_sword`, `rapier`, `dagger`,
`hand_axe`, `battle_axe`, `war_pick`, `mace`, `warhammer`, `flail`, `halberd`,
`spear`, `shortbow`, `crossbow`, `runed_staff`.

Each icon is held by its grip point, stored per weapon in
`src/data/weaponGrips.js` as `[x, y]` inside the 16 × 16 cell. If your icons
have the handle somewhere else, edit those two numbers — that is the only
adjustment needed.

## UI icons — `assets/sprites/ui/`

Sixteen-pixel square icons referenced by name from the shop and pause menus:
`btn_check`, `btn_close`, `btn_gold`, `btn_help`, `btn_minus`, `btn_pause`,
`btn_play`, `btn_plus`.

## Sound

There are no audio files. Music and effects are synthesised with the Web Audio
API in `src/systems/AudioSystem.js`, so nothing to supply here.
