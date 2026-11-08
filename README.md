# SkyFall

A 2D side-scrolling fantasy RPG written in plain JavaScript. No engine, no
framework, no build step — just ES modules, a canvas, Web Audio and
localStorage. Walk six connected regions, fight with weapon-specific swings,
loot and equip gear, level up, learn skills, take quests from NPCs, and save
your run.

**Read this first: this repo contains code only.** I did not commit the pixel
art I developed the game against, because the sheets are third-party assets
whose licences don't allow redistributing the files. See
[Artwork](#artwork-you-need-to-supply) below — the game boots and runs, but it
draws plain shapes until you drop your own sprites into `assets/`.

## Running it

ES modules need to be served over HTTP, so `file://` will not work. Any static
server is fine:

```
python tools/serve.py 8000
```

then open <http://localhost:8000/index.html>.

`tools/serve.py` is a tiny no-cache server so you don't reload stale files
while editing. Nothing is installed or built.

## Controls

| Action | Key |
| --- | --- |
| Move | **A / D** or **← / →** |
| Jump | **Space** or **W** |
| Sprint / dodge | **Shift** |
| Attack | **Left mouse** or **J** |
| Block | **F** |
| Interact / talk / shop | **E** |
| Use potion | **1** |
| Inventory | **I** |
| Character & skills | **P** |
| Choose your character | **C** |
| World map | **M** |
| Quest journal | **J** |
| Close panel / pause | **Esc** |

## What's in the code

- Fixed 320×180 canvas, integer-scaled so pixels stay sharp.
- Fixed-timestep game loop, camera with smoothing and shake, tile collision,
  input handling, entity manager.
- Systems for combat, inventory, equipment, shop, quests, dialogue, progression,
  crafting, save/load and sound.
- Six regions with their own tilesets, weather and enemy tables, plus bosses.
- Five playable characters that can be switched at any time from the pause menu
  or the **C** key. The choice is cosmetic and is written into the save.
- A code-drawn HUD and menus; no UI framework, no external fonts.
- Saves in `localStorage` under `skyfall.save.v2`, with validation and a
  corrupt-save fallback.

## Artwork you need to supply

`src/data/spriteManifest.js` lists every image the renderer asks for, and
`src/engine/Assets.js` loads that list once at startup. If a file is missing the
load fails quietly and the game falls back to procedural drawing, so you can
start it with an empty `assets/` folder and fill it in piece by piece. Expect a
wall of 404s in the console until then — one per sheet, nothing breaks.

The full file list, sizes and grid layouts are in [ASSETS.md](ASSETS.md). The
short version:

```
assets/
  atlas/      900×600 character sheets, 9×6 grid of 100×100 cells
  tiles/      352×176 tilesets, 16×16 tiles
  bg/         64×64 background tiles
  sprites/    npc, items, fx, proj, ui and 16×16 weapon icons
```

Keep the filenames and frame counts the same and everything plugs in with no
code changes. If your sheets are laid out differently, edit the numbers in
`spriteManifest.js` (and `weaponGrips.js` for weapon hold points) — those two
files exist precisely so the art can be swapped.

## Where the original art came from

I built this against three free packs. They are **not** included here; download
them from the authors and follow their terms:

- **Pixel Adventure 1** by Pixel Frog — tiles, backgrounds, NPC sprites, items
  and effects. CC0, free for anything, no credit needed.
  <https://pixelfrog-assets.itch.io/pixel-adventure-1>
- **Tiny RPG Character Asset Pack 01 and 02** by Zerie — the soldier, orc,
  demon and blood monster animations. Free for personal and commercial game
  projects, modification allowed, **redistribution of the files not allowed**.
  <https://zerie.itch.io/tiny-rpg-character-asset-pack> ·
  <https://zerie.itch.io/tiny-rpg-character-asset-pack-02>
- **Medieval Fantasy vol. I — Weapons** by Narik — the 16×16 weapon and shield
  icons. Free for personal and commercial use, **no redistribution**.
  <https://soulofkiran.itch.io/medieval-fantasy-volume-one>

That "no redistribution" clause is exactly why this repository ships without
them: putting the PNGs in a public repo would be handing out the asset packs.
Any art you add is your call — check its licence before you publish.

## Tests

```
node tests/save.test.mjs
```

The save test runs the serialisation and validation rules against an in-memory
storage stub, so it needs nothing installed.

## Debug hooks

The game exposes `window.__game`, `window.__player`, `window.__menu` and
`window.__step(frames, dt)` for poking at a live session from the console.
`__step` advances the simulation deterministically, which is handy because
browsers throttle animation frames in background tabs.

## Licence

Code is MIT — see [LICENSE](LICENSE). Artwork is not covered by that licence;
whatever you add stays under its own terms.
