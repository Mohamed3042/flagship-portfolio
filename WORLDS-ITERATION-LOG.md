# Worlds — Iteration Log

Protocol: every world page gets ≥3 passes before deploy. Pass 1 = build-time self-check
(structure, tag balance, engine contract, EN/AR pairs, zero external requests). Pass 2 =
browser pass over every page + key scenes via the engine's `?solo=N&p=X` harness (console
clean, scene composition, motion laws). Pass 3 = live scroll-through on the deployed URL
in a real browser.

## Pass 1 — build-time (all 8)
- Contract audit: closed html, cinema.js/css linked, `.L en/ar` pair parity, disclosure,
  rail, lang toggle, no external URLs. cod/netflix/razer/spotify complete from their
  directors; samsung lacked engine+disclosure+canvas JS (added); apple cut off after s7
  (s8–s12 + runtime written to its CSS contract); astronomy was head+CSS only (full body
  + 4 canvases written to its class contract).
- netflix: fixed `transl3d` typo + missing `)` in `.g-cap-a` opacity (director's own
  dying note identified both).

## Pass 2 — browser (fixes applied)
- Engine: replaced IntersectionObserver liveness with scroll-loop center-band liveness +
  `scene:live/idle` events (IO never fires in some embedded webviews); rAF scheduler got a
  120 ms timeout fallback; added `?solo` QA harness; versioned shared assets (`?v=2`).
- disney: chain player verified (arm/live/progress); WAN watermark found bottom-right in
  all 32 clips → re-encoded with bottom crop to 1280×648 (2:1), posters + 160 s master
  rebuilt clean; GATE wax seal timing (full by p≈.88) + seat position fixed.
- lobby: 8 posters render; capture quirk in the embedded pane (black at scrollY>0) is
  pane-only, verified via tall-viewport capture.
- astronomy: `DSN·AST` chip typo → `AST · 28MM WIDE`; title, map signature (canvas
  constellation route), GATE key-turn, prove field all verified.
- apple: removed cyclic `--mf:var(--mf,1)` self-references that killed the s8 sector
  transforms; deleted a mispositioned shadow ellipse; centered s8/s12 figs; s10 hand
  circuit + s11 calibration verified.
- global: `.L` language visibility rules hardened with `!important` (scoped
  `display:block` rules were resurfacing the hidden language, e.g. apple's meter).
- samsung: orbit/frags/cosmos/aurora canvases written + verified (orbit settle, violet
  crease); netflix portal fog, spotify track duotone, cod inventory, razer room wave all
  screenshot-verified, consoles clean.

## Pass 4 — Spotify becomes a rendered film (2026-08-06)

The four 960×480 scroll plates were a turntable on an infinite floor. Replaced by
**"The Album" — 15 shots, 1,860 frames, 2.39:1 at 1280×536**, one built set (Room 6:
concrete shell, slat ceiling, parquet, bench, deck, monitors, 19" rack) at TRUE METRIC
SCALE, plus a separate 46 m groove-canyon set for shot 9. `render/film_spotify.py` +
`render/filmlib.py`; `render/film_batch.sh` renders, encodes and cuts the master.
Every shot is woven into the page beside the code scene that makes the same claim, and
`data-theater` plays the master cut.

Six things that were wrong and what they cost:

- **The tonearm's stylus rendered below the record.** Pivot height was guessed. It has to be
  SOLVED: the tip hangs 33.9 mm under the bearing, so the bearing sits at deck + 64.1 mm.
  Two macro shots were framed on the arm *post* before this surfaced.
- **f/1.8 on a 135 mm macro is 0.4 mm of depth of field.** At real scale the lens is real:
  nothing can be sharp at portrait stops. The macro shots are f/6.3–f/11 now. Note that
  Cycles' `aperture_fstop` changes blur ONLY — it does not meter — so stopping down must
  NOT be paid back with exposure. Doing that once cost every macro two stops.
- **A 1.6 m softbox hung over a glossy disc is not a room light, it is a reflection the size
  of the record.** The key moved off the mirror axis; the deck gets a spot instead.
- **A 42 W raking light 5 cm above the bench renders the bench white**, not the grooves.
  Raking macro light has to be a tight spot, aimed.
- **`harness.grade()` rebuilds the compositor node group on every call**, so a second pass
  silently discards the first. Dispersion had to move INTO `grade()`.
- **The compositor vignette stamps a hard-edged oval** across the frame (its Blur size does
  not take on 5.x). Removed; lens shading comes from the rig.

Cost, measured not guessed: 101 s/frame at 1440 with 4K textures and a world volume →
**21 s/frame** at 1280 with the same sets mirrored to 2048. Box projection samples every
map three times per shading event, so a 4K map that a 1280-wide delivery cannot resolve is
paid for on every ray. `HAZE`, `BOUNCE`, `MB` and `RES_X` are env knobs on the film script
so the next person can measure instead of guess.

## Pass 3 — live (after gh-pages deploy)
- Recorded in DEPLOY-STATUS notes / final session report: full scroll-through of lobby +
  all 8 films on https://mohamed3042.github.io/flagship-portfolio/worlds/ in a real
  browser, EN + AR, plus video playback checks on disney (chain advance + theater).

## Pass 5 — Spotify ships as a real film (2026-08-07)

**Live:** https://mohamed3042.github.io/flagship-portfolio/worlds/spotify.html

15 shots, 2712 frames, 1920×804 scope, 128 samples, OptiX. Master 113.000 s = 1:53,
which is 2712/24 exactly; the page derives that runtime from the shot table rather
than carrying it as a second copy of the number.

**The one that mattered:** every "Cycles OptiX" plate this repo had ever shipped was a
CPU render. `harness.init()` calls `read_factory_settings()`, which resets the
*preferences* too, so `cycles.preferences.compute_device_type` went back to NONE — and
with no backend, `scene.cycles.device = 'GPU'` silently falls back to CPU. Every world
script called `setup_gpu()` *before* `init()`. Found because the owner sent a Task
Manager screenshot showing the 5070 Ti at 2%. 21 s/frame → 5.8 s/frame at higher
settings. Everything I had "optimised" before that was tuning the wrong machine: the
2K texture mirror was worth 5× on CPU and nothing at all on GPU (43 s vs 45 s).

**Completeness guards.** `film_batch.sh` graded renders with `frames -lt 8`, a fixed
floor over a variable population; an 11-of-96 partial passed it and shipped as a
finished shot. Fixed to grade against the count each shot declares. Then sweeping for
the predicate found the same defect in three more scripts — `batch.sh`, `rerender.sh`,
`batch_seq.sh`, all `-lt 8`, each already knowing the right number because it sets
FRAMES itself. Audited the 40 already-published plates: no truncation had ever shipped.

**Corrected an unmeasured claim.** I had asserted scroll-scrubbed video needs `-g 4`
from first principles. Measured: seek cost across g=4/8/12/24/single-keyframe was
3.9–9.9 ms max with *no* correlation to keyframe density, while size correlated
steeply (1930 KB at g=4 vs 1043 KB at g=12). Settled at g=12; plates 25M → 18M.

**Deploy traps.** `npm run build:ghpages` was broken on Windows — POSIX env syntax
through cmd.exe — so the Pages build could not be produced on the machine it ships
from. And `.nojekyll` existed only as a hand-placed file on the gh-pages branch, so
replacing that branch with a fresh `dist/` would have dropped it and Jekyll would have
skipped all 30 assets under `_astro/`. Both fixed at the source.

**Prop pipeline** (`filmlib.place_prop`, `prop_path`, `harness.decimate_to`): the film
never imported `render/assets/spotify/` at all. Now it does, one file per mark, with a
triangle budget — generated models arrive at a flat ~1.5M tris each. First real run put
a 0.480 m prop in at 0.525 m: the depsgraph was captured before the view-layer update,
so the bounds were pre-decimate. Scale is solved iteratively now, not divided once.

**Still undressed.** The room has no records in it. Crate, rack unit, near-field
monitor, reel-to-reel and patchbay are exported but not yet delivered; boombox and
SM7dB are staged in `assets/spotify/_pending/`, deliberately out of the live folder so
all 15 shots stay identical. Dressing means re-rendering s03, s13, s14 and s15 together
— dressing only the later ones would give the room a boombox two thirds through.
