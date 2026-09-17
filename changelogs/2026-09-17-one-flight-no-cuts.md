# 2026-09-17 — One universe: One Sky home + "One flight, no cuts" story pages

Branch `feature/universe-3d` (from `main` d06fb4a, the live One Sky home). Not deployed.

## Asked

The owner: transform the resume site and every project page into a fully immersive 3D
scroll-triggered cinematic universe, no reduced quality on phones, the densest rendering the
browser allows. Mid-build: replace the headlines nobody reads with particle 3D text, remake the
planets in real detail ("4K, not a ball with juice textures"), heavier particles and motion welcome.

## Shipped

- **Every story page is the next leg of the home's flight.** One fixed WebGL canvas behind the
  existing 5-beat spine; scroll flies a camera that never cuts: approach the story's own planet
  (hook) → skim its atmosphere (brief) → fly a lit rail through the system's mechanism, one gate
  per build step, parts rising ahead of the camera (build) → sweep the proof array, real sanitized
  screens as glass plates where a privacy-reviewed set exists (proof) → the amber boundary gate,
  seen whole then flown through (honesty) → the next story's planet already ahead (next).
  38 stories × 2 languages, RTL mirrored through the flight's `side` vector.
- **One planet per project**, shared by home and story (`src/data/flight.ts`): the home's eight
  featured seats are unchanged; every other story gets a deterministic seat from its slug.
- **Planet surfaces baked, not faked.** Domain-warped terrain, ridged mountains, oceans with
  specular, shores, snow, cloud shadows, night-side city lights, storm bands, crystalline ridges,
  lava fissures — rendered once into equirect textures (4096×2048 for a story's own planet,
  2048×1024 on the home, progressive from a quick small bake) and lit per frame by a small shader.
- **Particle headlines.** Each marked headline is rasterised with its own computed font (Inter
  860 / Al Rai Media, gradient runs kept) at 2× and sampled into up to 160k points that assemble in the
  scene where the layout put the words, behind a dark lens; they scatter as the beat leaves. DOM
  words stay (search, screen readers, gates); only their ink goes transparent.
- **Density**: 220k galaxy stars, 12k far stars, 12 nebula sheets + 5 dust lanes, comets, 60k
  local dust per story, 6k rail sparks, rigs for 29 story archetypes + 9 foundation stories, Cake
  Studio's real GLB cakes (Draco/KTX2) on the rail. One post stack: bloom, chromatic edges,
  velocity streaks, vignette, grain.
- **Transmissions.** Body copy is received as a signal: the story hook shows one short decoded
  line (the project blurb) with the full lead folded under "Full transmission"; every paragraph
  decodes word by word from accent signal blocks with a scan sweep as it enters; the build steps
  are gate readouts where only the gate the camera is passing unfolds its line; the home lead is
  four short sentences and the status line a live counter readout. Kickers and eyebrows are gone
  from every beat (the honesty label became a real headline). Particle headlines render in an
  overlay after the post stack, so bloom and lens effects never blur the lettering.
- **The reel (animate pass).** Scroll-driven shots, nothing on its own clock: a Vertigo dolly
  zoom on the hook while the planet's terminator sweeps into day; a banking flyby; a gate run
  where each gate carries a counter-rotating moiré iris that dissolves as you reach it, a
  shockwave that bursts on the crossing, a camera kick and an accent flash (only while
  scrolling); anamorphic flares on the brightest points; near dust rendered as lens bokeh; a
  hyperspace jump through the boundary (sky streaks, white flash, the next planet resolves);
  letterbox bars that close over the chrome for the action legs; a flash cut between pages
  (view transition). The home gets the dolly zoom into the dive with warp streaks, a banking
  roll, and bokeh dust along the route. Speed ramps: the camera floats at the hook and snaps
  through the run.
- **Less text (owner's second pass).** The build beat is the gate run: no cards, one short
  centred particle line per gate that assembles as the camera reaches it and streams past the
  viewer as it leaves; the brief is one display line over the limb (the old contract panel is
  gone); the proof line gets half the row; the honesty beat opens with its first sentence as a
  particle line; every longer body (brief, proof, honesty, home station boundaries) folds under
  one "Full transmission" control. Particle lines are measured word by word in the DOM, so
  wrapping, balance and Arabic bidi are the browser's own.
- **Audit pass.** `scripts/audit-flight.py` (console, overflow, landmarks, names, touch targets,
  focus ring, DOM/heap/fps at 390@3, 768@2, 1440) and four Lighthouse runs. Fixes: one `h1` per
  page (the contact close is an `h2`), every control 44px tall (nav links, brand, pills, folds).
  DESIGN.md + `.impeccable/design.json` written from the built world.
- **Phones**: the low tier and the pixel-ratio cap are gone; the canvas is the viewport at the
  device pixel ratio (1170×2532 on the 390×844@3 profile), same counts, same passes.

## Measured

- Mount on Windows Chrome (ANGLE/D3D11): scene built ≈ 320 ms, programs compiled ≈ 60 ms
  (was 2.3 s + 5.7 s before texture noise and baked planets).
- Headless Chrome, hardware WebGL: ≈ 180 fps at 1440×900 and at the phone profile; every page
  reaches the boundary (u ≥ 5.3).
- Gates on the built dist: `verify-portfolio.mjs` pass; `test-portfolio.py` desktop 76/76 clicks,
  0 console errors, 0 bad responses; mobile 76/76, 0, 0; `test-flight.py --all` desktop and mobile:
  see the run logs recorded in this session (76 pages each).
- Real-phone frame rate is NOT measured here: the owner's rule is native resolution regardless.

## Boundaries

- Browsers without WebGL (or a software rasteriser, or Save-Data without `?sky=force`) keep the
  CSS spine and the CSS sky exactly as before.
- The nine foundation stories keep their bespoke CSS-3D centerpieces; the flight surrounds them and
  their proof leg uses satellites instead of metric columns.
- `console.info` prints one mount-timing line per page; the gates fail only on errors.

## Files

`src/lib/sky/{world,post,text,rigs,story,flight-boot,flight-state}.ts` new; `engine.ts`,
`boot.ts`, `palette.ts`, `shaders.ts`, `storyscroll.ts`, the spine components, the two pages and
`tokens.css` changed; `scripts/test-flight.py` new (`npm run verify:flight[:mobile]`).
