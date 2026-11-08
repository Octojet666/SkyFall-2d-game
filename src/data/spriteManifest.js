// Paths and frame counts for every sheet the renderer loads. These are the
// numbers to edit if your own art is laid out differently.
export const SPRITE_MANIFEST = {
  "characters": {
    "soldier": {
      "atlas": "assets/atlas/soldier.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 6,
        "attack2": 9,
        "hurt": 4,
        "death": 4
      }
    },
    "soldier_dark": {
      "atlas": "assets/atlas/soldier_dark.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 6,
        "attack2": 9,
        "hurt": 4,
        "death": 4
      }
    },
    "soldier_brown": {
      "atlas": "assets/atlas/soldier_brown.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 6,
        "attack2": 9,
        "hurt": 4,
        "death": 4
      }
    },
    "orc": {
      "atlas": "assets/atlas/orc.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 6,
        "attack2": 6,
        "hurt": 4,
        "death": 4
      }
    },
    "orc_pale": {
      "atlas": "assets/atlas/orc_pale.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 6,
        "attack2": 6,
        "hurt": 4,
        "death": 4
      }
    },
    "orc_blue": {
      "atlas": "assets/atlas/orc_blue.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 6,
        "attack2": 6,
        "hurt": 4,
        "death": 4
      }
    },
    "demon": {
      "atlas": "assets/atlas/demon.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 7,
        "attack2": 7,
        "hurt": 4,
        "death": 4
      }
    },
    "demon_violet": {
      "atlas": "assets/atlas/demon_violet.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 7,
        "attack2": 7,
        "hurt": 4,
        "death": 4
      }
    },
    "bloodmonster": {
      "atlas": "assets/atlas/bloodmonster.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 8,
        "attack2": 8,
        "hurt": 4,
        "death": 4
      }
    },
    "bloodmonster_moss": {
      "atlas": "assets/atlas/bloodmonster_moss.png",
      "frames": {
        "idle": 6,
        "walk": 8,
        "attack1": 8,
        "attack2": 8,
        "hurt": 4,
        "death": 4
      }
    }
  },
  "terrain": {
    "tile": 16,
    "sheets": {
      "terrain": "assets/tiles/terrain.png",
      "snow": "assets/tiles/terrain_snow.png",
      "cave": "assets/tiles/terrain_cave.png",
      "ruin": "assets/tiles/terrain_ruin.png"
    }
  },
  "backgrounds": {
    "blue": "assets/bg/blue.png",
    "brown": "assets/bg/brown.png",
    "gray": "assets/bg/gray.png",
    "green": "assets/bg/green.png",
    "pink": "assets/bg/pink.png",
    "purple": "assets/bg/purple.png",
    "yellow": "assets/bg/yellow.png"
  },
  "sprites": {
    "vg": {
      "idle": {
        "src": "assets/sprites/npc/vg_idle.png",
        "frames": 11,
        "fw": 32,
        "fh": 32
      },
      "run": {
        "src": "assets/sprites/npc/vg_run.png",
        "frames": 12,
        "fw": 32,
        "fh": 32
      },
      "jump": {
        "src": "assets/sprites/npc/vg_jump.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "fall": {
        "src": "assets/sprites/npc/vg_fall.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "hit": {
        "src": "assets/sprites/npc/vg_hit.png",
        "frames": 7,
        "fw": 32,
        "fh": 32
      },
      "djump": {
        "src": "assets/sprites/npc/vg_djump.png",
        "frames": 6,
        "fw": 32,
        "fh": 32
      }
    },
    "pink": {
      "idle": {
        "src": "assets/sprites/npc/pink_idle.png",
        "frames": 11,
        "fw": 32,
        "fh": 32
      },
      "run": {
        "src": "assets/sprites/npc/pink_run.png",
        "frames": 12,
        "fw": 32,
        "fh": 32
      },
      "jump": {
        "src": "assets/sprites/npc/pink_jump.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "fall": {
        "src": "assets/sprites/npc/pink_fall.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "hit": {
        "src": "assets/sprites/npc/pink_hit.png",
        "frames": 7,
        "fw": 32,
        "fh": 32
      },
      "djump": {
        "src": "assets/sprites/npc/pink_djump.png",
        "frames": 6,
        "fw": 32,
        "fh": 32
      }
    },
    "frog": {
      "idle": {
        "src": "assets/sprites/npc/frog_idle.png",
        "frames": 11,
        "fw": 32,
        "fh": 32
      },
      "run": {
        "src": "assets/sprites/npc/frog_run.png",
        "frames": 12,
        "fw": 32,
        "fh": 32
      },
      "jump": {
        "src": "assets/sprites/npc/frog_jump.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "fall": {
        "src": "assets/sprites/npc/frog_fall.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "hit": {
        "src": "assets/sprites/npc/frog_hit.png",
        "frames": 7,
        "fw": 32,
        "fh": 32
      },
      "djump": {
        "src": "assets/sprites/npc/frog_djump.png",
        "frames": 6,
        "fw": 32,
        "fh": 32
      }
    },
    "mask": {
      "idle": {
        "src": "assets/sprites/npc/mask_idle.png",
        "frames": 11,
        "fw": 32,
        "fh": 32
      },
      "run": {
        "src": "assets/sprites/npc/mask_run.png",
        "frames": 12,
        "fw": 32,
        "fh": 32
      },
      "jump": {
        "src": "assets/sprites/npc/mask_jump.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "fall": {
        "src": "assets/sprites/npc/mask_fall.png",
        "frames": 1,
        "fw": 32,
        "fh": 32
      },
      "hit": {
        "src": "assets/sprites/npc/mask_hit.png",
        "frames": 7,
        "fw": 32,
        "fh": 32
      },
      "djump": {
        "src": "assets/sprites/npc/mask_djump.png",
        "frames": 6,
        "fw": 32,
        "fh": 32
      }
    },
    "fruits": {
      "apple": {
        "src": "assets/sprites/items/apple.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "bananas": {
        "src": "assets/sprites/items/bananas.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "cherries": {
        "src": "assets/sprites/items/cherries.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "kiwi": {
        "src": "assets/sprites/items/kiwi.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "melon": {
        "src": "assets/sprites/items/melon.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "orange": {
        "src": "assets/sprites/items/orange.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "pineapple": {
        "src": "assets/sprites/items/pineapple.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      },
      "strawberry": {
        "src": "assets/sprites/items/strawberry.png",
        "frames": 17,
        "fw": 32,
        "fh": 32
      }
    },
    "collected": {
      "src": "assets/sprites/items/collected.png",
      "frames": 6,
      "fw": 32,
      "fh": 32
    },
    "crate": {
      "src": "assets/sprites/items/crate1.png",
      "fw": 28,
      "fh": 24,
      "ax": 14,
      "ay": 22
    },
    "crate_break": {
      "src": "assets/sprites/items/crate1_break.png",
      "frames": 4,
      "fw": 28,
      "fh": 24,
      "ax": 14,
      "ay": 18
    },
    "dust": {
      "src": "assets/sprites/fx/dust.png",
      "frames": 1,
      "fw": 16,
      "fh": 16
    },
    "shadow": {
      "src": "assets/sprites/fx/shadow.png",
      "frames": 1,
      "fw": 16,
      "fh": 16
    },
    "confetti": {
      "src": "assets/sprites/fx/confetti.png",
      "frames": 6,
      "fw": 16,
      "fh": 16
    },
    "arrow": {
      "src": "assets/sprites/proj/arrow.png",
      "frames": 1,
      "fw": 32,
      "fh": 32
    }
  }
};
