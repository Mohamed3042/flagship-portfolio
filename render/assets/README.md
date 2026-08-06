# Drop 3D assets here

`render/assets/<world>/` — anything in a world's folder gets imported into that
world's set and lit by its existing rig. Drop and I wire it.

**Formats, best first:** `.blend` (append-ready, keeps materials) · `.fbx` · `.glb`/`.gltf` · `.obj`+`.mtl`
Textures next to the model, or packed into the .blend.

**Scale matters.** These sets are built in real metres — a keycap is 0.8 m across
in razer's macro set, the observatory dome is 6 m. If a model comes in at the
wrong scale I will fix it, but tell me the intended real-world size if it is
ambiguous.

## What would help most, ranked

| World | Wanted | Why |
|---|---|---|
| cod | street props: junction/utility box, oil drums, pallets, a parked car, chain-link, traffic mast | the set is the weakest — my boxes read as boxes |
| netflix | cinema seat row, projector head, film reels | seats are currently extruded cubes |
| spotify | **see the shot-by-shot list below** — the world is a 15-shot film now | the set is built; what it needs is dressing |
| astronomy | telescope tube + mount, dish antenna, desert rocks | the tube is a cylinder with collars |
| disney | leather-bound books, quill, inkwell, brass dividers, candlestick | props are primitives |
| razer | keyboard chassis, keycap with real profile (OEM/Cherry), desk mat | keycaps are beveled cubes |
| shared | HDRIs (night sky, studio, street), tileable PBR: asphalt, concrete, brushed metal, paper, leather | lighting and surface truth, every world |

apple and samsung are deliberately abstract — primitives are correct there.

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
