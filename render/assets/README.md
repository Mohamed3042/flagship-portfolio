# Drop 3D assets here

`render/assets/<world>/` — anything in a world's folder gets imported into that
world's set and lit by its existing rig. Drop and I wire it.

**Formats, best first:** `.blend` (append-ready, keeps materials) · `.fbx` · `.glb`/`.gltf` · `.obj`+`.mtl`
Textures next to the model, or packed into the .blend.

**Scale matters.** These sets are built in real metres — a keycap is 0.8 m across
in razer's macro set, the observatory dome is 6 m. If a model comes in at the
wrong scale I will fix it, but tell me the intended real-world size if it is
ambiguous.

## Do NOT generate these

Not a style preference — these are the things an image-to-3D model reliably
fails at, or that I can get better and faster from somewhere else.

| Don't | Because |
|---|---|
| HDRIs, tileable PBR (asphalt, concrete, metal, paper, leather) | Poly Haven addon is installed and I can pull these myself, and `Downloads/mix` already has 4K sets. Pure wasted effort. |
| Walls, floors, ceilings, domes, rooms, streets | architecture wants exact metric dimensions and clean topology. I build these parametrically in minutes. |
| Chain-link, wire mesh, railings, cables, thin lattices | photogrammetry-style reconstruction turns thin repeating structure into melted sludge. Geometry nodes or an alpha card beats it every time. |
| Glass, chrome or liquid as *hero* geometry at macro | the surface is the whole shot; a reconstructed mesh has no clean normals to carry a reflection. |
| Anything with text, logos or a brand mark on it | comes back as unreadable mush. I set real type. |
| The spotify deck, tonearm, cartridge, record | see below — their positions are solved against each other. |

## What would help most, ranked

Sizes are the real-world size on the object's longest axis, in metres. I
normalise each import to it, so a wrong *import* scale is recoverable — a
wrong *intended* size is not something I can guess.

**1. spotify** — the film is rendering now, so dressing lands soonest.

| Prop | Size |
|---|---|
| Crate of LP sleeves, spines out | 0.34 × 0.34 × 0.32 |
| 19" rack unit, real knobs + jacks + VU meter | 0.483 × 0.30 × 0.088 |
| Near-field monitor, waveguide + port | 0.20 × 0.26 × 0.34 |
| Reel-to-reel tape machine | 0.48 × 0.28 × 0.55 |
| Wall diffuser, skyline or QRD | 0.60 × 0.60 × 0.12 |
| Studio stool | 0.38 dia × 0.62 |
| Patchbay, 1U | 0.483 × 0.15 × 0.044 |
| Headphones, hung on a hook | 0.20 × 0.09 × 0.19 |

**2. cod** — weakest set in the repo. 7 cubes and 4 cylinders make a street.

| Prop | Size |
|---|---|
| Utility / junction box, conduit + hinges | 0.60 × 0.35 × 0.90 |
| Oil drum, 55 gal, dented and rusted | 0.58 dia × 0.89 |
| Wooden pallet | 1.20 × 0.80 × 0.14 |
| Jersey barrier, concrete | 2.00 × 0.60 × 0.80 |
| Sandbag, single (I'll stack them) | 0.50 × 0.30 × 0.20 |
| Traffic signal head, 3-lamp | 0.30 × 0.30 × 0.90 |
| Parked sedan, unremarkable, dusty | 4.50 × 1.80 × 1.45 |

**3. netflix** — the seats are extruded cubes.

| Prop | Size |
|---|---|
| Cinema seat, single, seat folded up | 0.65 × 0.75 × 1.05 |
| 35 mm projector head | 1.20 × 0.60 × 1.50 |
| Film reel + flat can | reel 0.35 dia × 0.05 |
| Rope stanchion, brass | 0.35 dia base × 1.00 |

**4. astronomy** — the telescope is a cylinder with collars.

| Prop | Size |
|---|---|
| Telescope OTA, tube rings + finder scope | 0.30 dia × 1.80 |
| Equatorial mount head + counterweight bar | 0.50 × 0.30 × 0.60 |
| Pier / tripod | 1.20 tall |
| Parabolic dish antenna on a mount | 3.00 dia |
| Desert rocks, set of 5, weathered | 0.30 – 1.50 |

**5. disney** — a writing desk built from 6 cylinders and 5 cubes.

| Prop | Size |
|---|---|
| Leather-bound book, closed, tooled spine | 0.16 × 0.24 × 0.05 |
| Inkwell + quill | 0.07 dia × 0.09 |
| Brass dividers / compass | 0.18 long |
| Candlestick with a part-burnt candle | 0.12 dia base × 0.30 |
| Rolled parchment | 0.05 dia × 0.35 |

**6. razer** — keycaps are beveled cubes. Macro set, so these get scrutinised.

| Prop | Size |
|---|---|
| Keycap, OEM profile, row 3, blank | 0.018 × 0.018 × 0.010 |
| Mech switch, stem + housing + legs | 0.014 × 0.014 × 0.0115 |
| TKL keyboard chassis, no keys | 0.36 × 0.14 × 0.035 |
| Gaming mouse | 0.125 × 0.068 × 0.042 |

apple and samsung are deliberately abstract — primitives are correct there,
nothing needed.

## Spotify — "The Album", what would actually raise it

The set (`render/film_spotify.py`) is built at true metric scale and lit by a solved
rig. Anything dropped in has to be **real size in metres** or it will read wrong next
to a 0.152 m record.

**Generate these — they are background dressing, where a generated mesh is free money:**

| Prop | Real size | Why it helps |
|---|---|---|
| 19" rack unit with real knobs, jacks and a VU meter | 0.483 × 0.30 × 0.088 m | s12 is eight flat faceplates; knobs would carry that whole shot |
| Crate of LP sleeves, spines out | 0.34 × 0.34 × 0.32 m | the room has no records in it — the one prop the story is *about* |
| Near-field monitor with a waveguide and a port | 0.20 × 0.26 × 0.34 m | mine is a box with two discs; s03 and s14 both hold on them |
| Wall diffuser (quadratic residue / skyline) | 0.60 × 0.60 × 0.12 m | the back wall panels are flat grey rectangles |
| Studio stool, mic stand, coiled cable, patchbay | — | the room reads clean-but-empty in the wides |

**Do NOT generate the deck, tonearm, cartridge or record.** They are hero geometry in
four macro shots at up to 135 mm, they are parametric, and their positions are *solved*
against each other (the bearing height is derived from the stylus drop). A generated
mesh would break that solve and would not survive the macro.

**Workflow that fits this pipeline:** one clean three-quarter reference image per prop on
a plain background → Hunyuan3D → export `.glb` → drop in `render/assets/spotify/` →
tell me the intended real-world size. `H.dressing()` normalises each root to a given
size on its longest axis and drops it so its base sits on the floor, so a wrong import
scale is recoverable, but a wrong *intended* size is not something I can guess.

## Already installed and in play
Poly Haven addon, HDRI Maker, Physical Starlight & Atmosphere, DECALmachine,
MESHmachine, Material Library, flaredvfx. If you have your own library paths for
any of these, tell me and I will point Blender at them.
