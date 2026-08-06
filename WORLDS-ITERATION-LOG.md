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
