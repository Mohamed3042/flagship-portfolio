# What to send next

Two lists. **A** is stuff you already generated — it's sitting in the other
account's library, I saw it in your screenshots. Nothing to make, just export.
**B** is stuff that does not exist yet.

Drop everything in `render/assets/<world>/`.

## Naming — the one thing that saves us both time

Hunyuan returns hash names (`e0d77c648fac91bd….glb`) and strips the metric size
out of the filename. **Rename each file to the keyword in the `save as` column.**
One word, that's it. The set finds props by that keyword, so a correct name
means the prop lands on its mark with zero work from either of us.

If renaming 8 files is more annoying than it sounds, send
`hunyuan_individual_asset_refs_all_worlds.zip` instead and I'll match every
hash to its reference automatically.

---

## A. Already generated — just export these

### spotify — the priority. All five are in the third screenshot.

| save as | what it was | real size (longest axis) |
|---|---|---|
| `crate.glb` | wooden crate of LPs, spines out | 0.34 m |
| `rack_u.glb` | 19" rack unit, knobs + jacks + VU meter | 0.483 m |
| `monitor.glb` | near-field monitor, waveguide + port | 0.34 m |
| `reel.glb` | reel-to-reel tape machine | 0.55 m |
| `patchbay.glb` | 1U patchbay | 0.483 m |

`crate.glb` is the one that matters most — the film is about a record and the
room currently contains none.

Skip for now: the **wooden diffuser** and the **studio stool**. The diffuser
hangs on a wall and my placer only rotates flat on the floor, so I need to
build the wall mount before it's useful. The room already builds a stool.

### other worlds — no deadline, send whenever

| world | save as | real size |
|---|---|---|
| netflix | `seat.glb` red cinema seat | 1.05 m |
| netflix | `stanchion.glb` brass rope post | 1.00 m |
| disney | `candlestick.glb` | 0.30 m |
| razer | `keycap.glb` single keycap | 0.018 m |
| razer | `switch.glb` mech switch, green stem | 0.0115 m |
| razer | `mousepad.glb` | 0.355 m |

---

## B. Does not exist yet — generate these

Only if you feel like it. Nothing is blocked on them.

| world | save as | real size | prompt |
|---|---|---|---|
| cod | `utilitybox.glb` | 0.90 m | grey steel street utility cabinet, conduit entries, hinged door, weathered paint |
| cod | `barrier.glb` | 2.00 m | concrete jersey barrier, chipped edges, rebar shadow, road grime |
| cod | `sandbag.glb` | 0.50 m | single filled hessian sandbag, slumped, dusty |
| astronomy | `mount.glb` | 0.60 m | equatorial telescope mount head with counterweight bar, white enamel |
| disney | `inkwell.glb` | 0.09 m | glass inkwell with brass collar and a quill resting in it |

### How to prompt so it survives Hunyuan

Single object, centred, filling the frame. Plain mid-grey seamless background.
Three-quarter view from slightly above. Soft even studio light, no hard
shadows. Sharp focus, whole object visible, nothing cropped.

**No text, no logos, no brand marks** — they reconstruct as unreadable mush. I
set real type where a mark is needed.

### Still do not generate

Thin repeating structure — mic booms, cables, chain-link, railings, wire mesh.
The Rode arm came back as a fragmentary bent tube, which is exactly this
failure. I build those parametrically. Also skip walls, floors, HDRIs and
tileable textures: Poly Haven and the `mix` library already cover them.
