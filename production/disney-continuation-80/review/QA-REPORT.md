# Continuation reference QA — 2026-08-11

## Final result

`DISNEY_CONTINUATION_GREEN 80/80 keyframes=80 prompts=80 chain=KF01->KF100 canvas=1920x960`

The gate verifies the exact eight-field schema, shots 21–100, eight acts of ten, the complete endpoint chain, one manifest-identical prompt file per clip, 80 exact run-manifest rows, 80 unique new RGB PNGs at 1920×960, and the inherited 1920×960 `KF01` anchor.

## Fail-first evidence

- Before the image range existed, the pack gate reported `PACK_RED 87`: 79 required endpoint images were absent and eight prompt locks were incomplete.
- After all assets landed, the strengthened semantic gate intentionally reported `PACK_RED 26`, then `PACK_RED 5`, exposing inconsistent wording around camera, material, text, and new-object locks.
- Builder and verifier changes resolved those contract failures; the unchanged final command now returns the green sentinel above.

## Rendered review

The following labeled contact sheets were opened and visually inspected at full rendered resolution:

- `act-vii.png` — KF21–KF30
- `act-viii.png` — KF31–KF40
- `act-ix.png` — KF41–KF50
- `act-x.png` — KF51–KF60
- `act-xi.png` — KF61–KF70
- `act-xii.png` — KF71–KF80
- `act-xiii.png` — KF81–KF90
- `act-xiv.png` — KF91–KF100

Observed pass: coherent dark cut-paper/parchment/felt/wire/wax/brass art direction; candle-gold practical light with restrained cool fill; readable cause-and-effect progression; center-weighted 2:1 action; no obvious readable text, logos, facial detail, or watermarks.

Targeted retakes were required for KF29, KF33, KF35, and KF37 after visible pseudo-writing, bridge, seal-glyph, and missing-wedge defects. Those rejected outputs are not canonical.

The first lantern design specified an exact large count that the rendered endpoints did not reliably satisfy. The story and FLF prompt were corrected to preserve the actual supplied lantern constellation and to explain later occlusion behind solid orbital rings. This removes a false cardinality claim and makes endpoint fidelity the binding contract.

## Repository proof

- `npm.cmd run build`: 56 pages built successfully.
- `npm.cmd run verify:static`: 26 stories × 2 languages passed.
- The production pack changes no public page or current Disney runtime asset.

## Still open

Wan results `DSN2-021.mp4` through `DSN2-100.mp4` do not yet exist. Each returned video must pass decoded-frame checks at frames 0, 38, 75, 113, and 149 plus codec, dimension, fps, duration, boundary, no-cut, no-text, and no-watermark gates before page integration.
