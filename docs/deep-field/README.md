# DEEP FIELD

The flagship portfolio's landing route: a scroll-driven WebGL cosmos in which
the stars themselves assemble into the content. Pure black, one accent, a fine
particle field with a galactic band through it, and nineteen beats that a
single scroll number drives from end to end.

One line of story, used once on the page: *point at the dark long enough and it
fills with worlds.*

Both languages ship every round — `/en` and `/ar` — and the Arabic route is
right-to-left throughout, with its own type scale.

## What the visitor sees

Nineteen beats, in the owner's own order of pride:

| Beat | What it is |
|---|---|
| hero | the name assembles out of the field and releases back into it |
| five **worlds** | portals: the stars open an aperture and the world's own key frame is seen through it, edge to edge |
| four **games** | figures drawn from what each game actually is — an arena and a reticle, an island under a sky, a shell on its arc, a low-poly bowl |
| **MK Voice** | a waveform on a timeline with a gate mark across it |
| five **systems** | the Round 2 figures for the five projects the site's own featured order ranks first |
| **tools** | twelve labelled stars, hairlines, no drawing: the asterism is the chapter |
| **public work** | the four checkable repositories as a labelled constellation |
| **contact** | the field slows, one star brightens and becomes the reply |

Below the cinema the canvas fades to nothing and the site's dense project
archive follows, on the same black.

## Where things live in the code

| Thing | File |
|---|---|
| The scroll script: beats, the four-point window, the reading stops, the copy | `src/lib/signal/chapters.ts` |
| The field: shaders, the band, the tunnel, the hairlines, the adaptive count | `src/lib/signal/field.ts` |
| Every figure, hand-drawn as strokes and anchors — **including the portal aperture** | `src/lib/signal/figures.ts` |
| The renderer: camera, seating, the portals' placement, the labels' registration, the governor, the probe | `src/lib/signal/index.ts` |
| Sampling a figure or a glyph into a point set | `src/lib/signal/targets.ts` |
| Tiers, star counts, the band's constants | `src/lib/signal/types.ts` |
| One beat's markup — the still document the cinema upgrades | `src/components/signal/Chapter.astro` |
| The stage, the skip link and the seek nav | `src/components/signal/Stage.astro` |
| The route: which copy each beat gets, and from where | `src/pages/[lang]/index.astro` |
| Worlds, games, the voice engine, the tools — the data the beats read | `src/data/deep-field.ts` |
| Every style, the Arabic type step, the archive re-tone | `src/styles/signal.css` |

**The portals.** A world's key frame is HTML, not a texture. The renderer owns
where it goes: it projects the aperture's own centre and rim height with the
frame's camera and writes the box, the stylesheet clips it to the ellipse, and
the image covers it. `PORTAL_RIM_SHARE` in `figures.ts` is the ratio between
the figure's box and the rim inside it — the iris ticks stand outside the rim,
so the two are not the same number. The frames are encoded by
`scripts/build-world-frames.mjs` into `src/assets/worlds/*.avif`.

**The labelled stars.** Each label is a POINT at the projected star with its
chip hanging off it, positioned every frame from where the camera says that
star is. Registration belongs to the camera, never to a guess. The chips
de-collide by sliding down their leaders, never by moving the anchor, and in
landscape their band stops short of the copy column.

## Running the harness

The suite and every capture script read a BUILT site over a local static
server, never the dev server.

```bash
npm run build
node scripts/serve-static.mjs dist 4618
python scripts/test-signal.py
```

895 checks at the time of writing: determinism forward, reverse and on a direct
jump; one active chapter; hidden chapters out of the tab order; every figure
seated where the composition says; every portal's plate filling its rim,
clipped, decoded before it is blended in; label registration within 4 px, with
a planted 6 px drift that must be caught; the beat split against its floors;
contrast read off the rendered page; the archive's ground and ink under all six
site themes, with a planted white ground that must be caught; accessibility;
the band, with its own controls; CLS; reduced motion; and the no-JS document.

`scripts/signal_probes.py` holds anything the suite and the capture scripts
both have to agree about. Put it there rather than in two places.

## Capturing the evidence packet

With the build served on 4618:

```bash
python scripts/measure-deep-field.py --out docs/deep-field/rNN/budgets.json
python scripts/measure-deep-field-phone.py --out docs/deep-field/rNN/phone.json
python scripts/capture-deep-field.py --out docs/deep-field/rNN
python scripts/capture-deep-field-a11y.py --out docs/deep-field/rNN
python scripts/capture-archive-themes.py docs/deep-field/rNN
python scripts/record-signal-realtime.py --out docs/deep-field/rNN
python scripts/run-lighthouse.py --url "<draft>/en/" --out docs/deep-field/rNN
```

`capture-deep-field.py` takes `--only desktop,phone,arabic,morph,field,figures,portals`
so one sheet can be re-cut without re-shooting the others; it merges into the
existing `captures.json` rather than replacing it.

Images stay under 600 KB. `.mp4` files under `docs/deep-field/` are
gitignored: the sheets and the report are the packet, and a recording is for
the owner to watch.

## What the numbers mean

- **Frame interval** is wall-clock milliseconds between frames of the page's
  own `requestAnimationFrame` loop. It is compared to a budget in
  milliseconds — 55 fps is 18.2 ms, 30 fps is 33.3 ms — and it is only called
  a frame RATE when `measure-deep-field.py`'s quantisation control establishes
  that the loop is locked to the display.
- **Frame cost** is the slope of a least-squares line through four draw counts,
  each terminated by a one-pixel `readPixels`. `gl.finish()` is not a barrier
  in this browser and reported 0.0 ms for 80,000 points.
- **Phone** numbers are emulation on a desktop GPU with the CPU throttled 4x.
  They bound the work the page asks for. They are not a device.
- Every capture settles the frame before it reads it: seek, then
  `requestAnimationFrame` twice plus 260 ms. The desktop app's browser pane
  pauses rAF while hidden — do not measure there.

## Rounds

`rNN-brief.md` is the director's brief for round NN; `rNN/report.md` is what
that round shipped and what it measured. Read the latest brief and the latest
report; the earlier ones are history.
