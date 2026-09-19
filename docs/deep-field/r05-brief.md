# DEEP FIELD — Director's brief, Round 5 (END GAME: "DARB")

Same roles and rules as `r01-brief.md` (§2, §3, §5 govern) unless this brief retires them
below. Work on `feature/deep-field` in `C:\Users\GAMING\Downloads\flagship-signal-20260918`.
Commit this brief first (`docs/deep-field/r05-brief.md`). Read `docs/deep-field/README.md`,
then `r04/report.md`; earlier rounds are history. Stop rule at the end.

This is the owner's flagship upgrade. It is one round with a build order (§7). If the
session cannot finish, ship the build order as far as it goes, packet it, push, stop —
never a broken branch, never a half-beat that reads as finished.

## 1. Round 4 verdict — checked by the director on the live v2 site

Accepted: the portal fill, the 471 px hold, the caption ladder, the Arabic pass, the
archive re-tone, the accessibility work, 895/895, v2 published at
`https://mohamed3042.github.io/flagship-portfolio-v2/`.

Defects, in order of weight. The first one is factual and ships today.

1. **The tools beat is false.** The copy reads "Twelve tools that do the repeating. Skills
   I wrote so the repeating half of the work runs itself." Eleven of the twelve labelled
   stars are third-party installs (`codebase-orientation`, `root-cause-debugging`,
   `edge-case-sweep`, `surgical-refactoring`, `security-reflexes`, `verify-ui-visually`,
   `stop-thrashing`, `leave-no-mess`, `impeccable`, `blender-assembly`,
   `auto-release-manager`). Only `agent-brain` is his. The owner's own skills, verified by
   git author and content, are the sixteen in §4.6. Replace the beat entirely.
2. **The intro is a cut, not an illusion.** The name assembles, releases, and the next
   thing on screen is a gate titled "The Cake Is Made Twice". The owner reads that as
   being hit with the cake at once, twice. There is no road between the name and the
   first world and no moment where the dark *resolves* into something. §4.1.
3. **The portal rim reads loose while scrolling.** The rim is a scatter of ~950 stars with
   0.9–1.05 units of depth jitter around a crisp elliptical plate; at rest they register
   (measured on v2 at 1024×768: rim 403 px, plate 367 px = rim × 1/1.1, exact), but in
   motion the owner sees the ring "unfit" from the picture. Hypothesis to prove or
   kill with an instrument before touching it: the plate is placed from the *pure* state
   while the stars draw with the *damped* dolly (`index.ts` ~930–935 vs `placePortal`),
   so the two disagree by the lag on every fast wheel notch; plus the clock-driven
   twinkle/drift on rim stars against a static plate. Record real input, measure rim
   radius vs plate box per frame, report the worst gap in px. §4.2 makes the rim exact by
   construction; the instrument stays in the suite.
4. **The portals are stills.** The five worlds each have 14–71 silent 1280×720 H.264
   clips on disk (`public/worlds/<world>/clips/`, manifests beside them) and the page
   shows one AVIF. §4.2.
5. **The games do not show the games.** An ellipse with a reticle, an arc, a hexagon: a
   reader learns nothing. §4.4.
6. **MK Voice is a waveform.** The owner's most accurate piece of software gets a generic
   figure. §4.5.
7. Carried: the still document's eyebrow (`.signal__kicker`) above every heading, and
   mobile Lighthouse performance 59 with three.js on the critical path — measure the
   deferral this round instead of declining to.

## 2. The direction: DARB (درب)

In Arabic the Milky Way is **درب التبانة** — literally a road. The band already on the
page becomes the destination, and the visitor drives toward it. Everything the site says
about itself — *point at the dark long enough and it fills with worlds* — now has a
mechanism, and it is the mechanism real constellations have:

> **A constellation is true from exactly one place. The road is the list of those places.**

Every figure on the page is a set of *ordinary field stars at different depths*, whose
world positions were chosen on the rays from one eye point. From anywhere else they are
sky. As the camera rolls toward that point the scatter blooms outward from the vanishing
point and *coincides* into the figure; the camera stops there (the hold); then it drives
on and the figure bursts around the visitor and is sky again. Perspective anamorphosis,
the Felice Varini kind — and it is physically honest, because Round 2 already gave every
star a fixed world position. Nothing flies. Nothing morphs. The road does the work.

### Rules that change (and only these)

| Round 1–4 rule | Round 5 |
|---|---|
| The camera never moves; the dolly is a term in the field | The camera rides the road: position and heading are pure functions of `u`. Still one scroll number, still one renderer, still `evaluate(u)` with no per-frame state. Forward, reverse, deep link and Home/End land on the same frame. |
| Figures are field stars that FLY to seats (the two-rate polar morph) | Figures are field stars whose HOMES lie on rays from the beat's alignment point (§4.3). No flights. The morph machinery survives only for animated targets (game holograms, §4.4) and the two-pose skill figures (§4.6). |
| A portal plate is a still | A portal is a gate on the road: an anamorphic rim, a window with parallax, the world's own clip inside, and a pass-through (§4.2). |
| Tools = twelve labelled stars | The Workshop drive-by: sixteen of the owner's own skills, one by one (§4.6). |
| Runway cap 36 vh | Cap 44 vh landscape / 46 portrait. The new sectors are paid for in scroll distance like everything else; report the split per beat class. |
| One accent; colour only inside a world's frame | **World light.** The road and every gate carry warm gold light (sample it from the owner's keyframes in `Downloads\darb-intake\refs\picks\`); the field stays white; the UI keeps the one blue accent and its one meaning. Two hues, two jobs. |
| Restraint is the look | The owner has pinned a look: his keyframe boards in `refs\picks\` (road, gate tunnel, games row, ring-face, five capsules, beat board). Build toward them in real time. Their words, signs, icons, cars and the walking figure are NOT content — every word on the page stays HTML from the data files, and one board even carries the wrong name. |

Everything else stands: the tokens on `.showroom:has(.signal)`, one accent, one family per
language, nothing readable drawn into the canvas, the still document as the base layer,
`visibility:hidden` + `inert`, the 47/28/25 window and its floors for reading beats, the
Arabic step, the caption ladder, CLS 0, the archive black under six themes, no drawn
hairline on a rim, no cards, no glass, no second engine.

### The road

- A fourth star shell: a ground plane below the eye. Density falls off with distance from
  the lane centre; two brighter point streams at the lane edges converge on the vanishing
  point. Points only — no lines, no grid, no texture, no asphalt. The same material and
  wrap as the other shells, so it is infinite for free.
- Bends between sectors: `x' = x + k(u)·z²` applied to every shell in the same frame,
  `k` non-zero only *between* beats and exactly zero through every hold, so anamorphic
  alignment is never asked to survive a bend. Six bends: after the hero, after the worlds,
  after the games, after the voice, after the systems, after the workshop. Each bend
  swings the band across the sky and reveals the next sector's first figure as a far
  bloom on the road ahead. The visitor always sees where the road goes.
- Sector milestones: one caption star at each bend — WORLDS · GAMES · VOICE · SYSTEMS ·
  WORKSHOP · PUBLIC (Arabic on `/ar`). The tracked uppercase caption is native *on a
  star*; this is the only place it is allowed, per DESIGN.md.
- Speed: the dolly-per-pixel is constant on the straights; the reading stop is a real stop
  (dolly constant across the hold, as REST already does). Twinkle and drift keep the sky
  alive while the road is stopped.
- The floor may mirror: a gate's points drawn a second time, reflected below the road
  plane at ≤30% alpha, is what makes the owner's boards read as a wet floor. Points only.
- Stations are visible on both sides of the road at depth, as in `road-establishing.png`:
  the next two gates are always in view as far blooms.

## 3. What stays exactly as it is

The archive, the footer, the header seam, the seek nav, the skip link, the still
document's structure (extended, not replaced), the five systems figures' *subjects*
(re-seated as anamorphic constellations, §4.3), the public-work constellation, the contact
star, every Arabic line from Round 4, and every harness check that still applies.

## 4. Scope

### 4.1 Hero — you drive through your own name

- The name is an anamorphic constellation (Latin on `/en`, Arabic on `/ar`), homes on the
  rays from the alignment point at depths spread over ~[8, 45] units. At `u = 0` the
  camera is *before* alignment: the visitor sees a fine sky and the role line, and the
  name is not yet readable — a faint radial hint at most. The first wheel notches roll the
  camera forward; the scattered stars converge into the name; the hold is at exact
  alignment ("anamorphic needs a held pose" — old trap); the release drives *through*
  it and the letters burst radially past the frame edges. Then the road.
- Reduced motion, no JS, no WebGL: the name is a poster at alignment, as today.
- The `h1` stays in the document exactly where it is. LCP must not move: the hero's HTML
  copy is still the first paint; nothing new loads before it.
- Between the name and the first gate: at least one beat of open road with the WORLDS
  milestone and the Cake gate blooming far ahead. No world title on screen until its own
  beat. "The Cake Is Made Twice" is the world's real title and stays.

### 4.2 Worlds — gates, windows, clips, pass-throughs

- **Rim:** the aperture figure re-seated as anamorphic stars with depth spread. At the
  hold it is a crisp diamond-dust ellipse *by construction*; on approach it blooms; on
  pass-through it opens around the visitor. No x/y jitter at alignment. Keep the eight
  iris ticks at their Round 4 length and alpha.
- **Tunnel:** a gate is not one ring but three to five, spaced in depth along the road
  (`gate-tunnel-cake.png`). The anamorphic rim already puts stars at spread depths; group
  them into rings so that on approach the rings bloom one behind another and on
  pass-through they sweep past the frame one at a time. The plate sits at the innermost
  ring.
- **One state per frame:** the plate is placed from the same applied camera the stars are
  drawn with, never from the pure state while the field lags. Add a suite check: in a
  real-input recording, rim radius vs plate half-height agree within 3 px on every frame.
- **Window:** the plate's content is 110% of the rim and shifts against it with the
  camera's heading (and pointer on `pointer:fine`, ±2% max) so the rim reads as a hole in
  space, not a sticker on it. Keep the inner-vignette fall; keep `data-decoded` gating.
- **Clip:** each world plays its own clip inside the rim. Source: `public/worlds/<world>/
  clips/` via the world's `manifest.json`; pick the clip whose poster is (or is nearest
  to) the current key frame, re-encode at 960×540, H.264, silent, ≤1.2 MB, 5 s, plus a
  poster = the current AVIF. Behaviour: `pointer:fine` → `currentTime` is scrubbed by
  local progress across assembly+hold (the visitor's hand runs the world, exactly like the
  worlds themselves); `pointer:coarse` → muted `playsinline` loop while the beat is
  active. Never loaded before its beat is within two beats of arriving; never on the
  critical path; the poster covers until `canplay`. Frame index / `currentTime` is a pure
  function of `u` — assert it forward and reverse.
- **Pass-through:** across the release the rim expands past the viewport and the plate
  covers the screen for ~150 px of scroll — the visitor is *inside* the world — then it
  fades to black and the road is there on the far side, with the next gate blooming. This
  is the transition between films. The seek nav's target for a world is its hold, as now.
- Every gate keeps its title, its one line and "Enter the world" as today.

### 4.3 Systems and public work — true constellations

The five systems figures and the public constellation keep their drawings and become
anamorphic (homes on rays, depth spread). Fit to own extent, seat for the near edge of the
depth spread (old trap), captions registered by the camera as now. Suite: at the held
pose ≥97% of a figure's stars project within 1.5 px of their target; at ±20 units of
dolly they must NOT (plant a flat figure with all depths equal and make it fail the
"is it three-dimensional" check).

### 4.4 Games — the stars play the game

Each game is a gate whose plate is a **hologram**: a real clip of the game reduced to
its Sobel edges, sampled to ~4,000 points per frame, and played back as the site's own
stars on the plate's plane — the point-cloud film, the game's actual motion in this
page's one material. Scrubbed by `u` (the visitor's hand runs the match), 12 fps, 8–10 s.

- **Pipeline:** `scripts/build-holograms.py`: clip → frames → Sobel normalised to the
  frame's own 97th percentile (old lesson: edges, never luminance) → blue-noise weighted
  sample → `Uint16` x/y per frame → one binary per game, ≤400 KB gz, lazy-loaded.
- **Capture, bounded at two hours per game:** Godot 4.7 builds record themselves with
  `--write-movie` (Polyblast Arena, ARTILLERY3D, Cocolani 3D); WARSTRIKE (UE 5.8) via the
  packaged build windowed at 1280×720 and `ffmpeg -f gdigrab`, spectating a bot match or a
  free-cam fly-through of an arena. Prefer moments that *say what the game is*: a run and
  a shot in an arena, a shell on its arc landing, the island from the sea, the bowl map.
  Existing on disk: `Documents\ddtank3d\ARTILLERY3D\docs\proof\mira-q1\MIRA_ARTILLERY_PACKAGED_q3.mp4`
  (4 s, 1920×1080). Fallback if a build will not run in a recordable state inside the
  bound: a flipbook of that game's own boot-shots, cross-faded, hologrammed the same way —
  and say so in the report.
- **Rights, no exceptions:** WARSTRIKE and Cocolani are rebuilt from other people's games
  and WARSTRIKE's holo cast is third-party. Capture with the games' own default
  characters or with no characters, never a Valorant holo, never a texture close-up. The
  hologram is edges only. Raw video is NOT shown for any game until the owner ticks it on
  `docs/deep-field/r05/clips-review.html` (a review sheet: the four source clips, one
  poster each, a yes/no per clip). Until his tick, holograms only.
- Each game keeps its title, engine, line and links; the copy is the archive's, as now.
- One signature per game if the budget allows, in this order: ARTILLERY3D's release is an
  arc (the road lifts and drops for ~200 px); WAR STRIKES' rim is a reticle that closes as
  the hologram lands; Cocolani's road becomes water (the ground shell's density collapses
  to a mirror line under the island); Polyblast spawns (the hologram's first frame is
  assembled from the rim itself). Each is one paragraph of shader, not a system.
- The owner's `games-row.png` pins the framing (four gates on the winding road); nothing
  inside those gates on the board is content.

### 4.5 MK Voice — the studio, the five voices, the calibration

A sector of three parts, with the road passing between them.

1. **The studio gate.** Title "MK Voice", the Round 4 line (private build, demo on
   request — the claim does not grow), one link. Inside the gate: the calibration
   figure — two spectrogram point-fields, *reference* and *clone*, drawn from a real
   held-out comparison as shapes only, converging as a dial of stars sweeps from open to
   the measured position. No number is printed unless it is already public in the site's
   own data; otherwise the dial has no scale and the convergence is the statement.
   The gate's figure is the ring-face from the owner's keyframe `voice-ringface.png`: a
   calm face drawn as concentric contour rings with the waveform ribbon crossing it at the
   mouth. Reference and clone are two such faces, and the calibration is the second one
   settling exactly onto the first.
2. **The five voices.** Five CAPSULES on alternating sides of the road (`capsule-*.png`
   in the picks: the owner's holders). A capsule is two rings of warm gold points, top and
   base, a sheath of very fine points between them, and a podium disc of gold points on
   the road; its cross-section is that character's own waveform ring (the real amplitude
   envelope of a clone output as a closed curve — shape only, no audio ships). Inside it
   stands the character, full body, as a plate (image, or the loop where one exists);
   behind and slightly beside it, the "star version" — the same figure as edge stars,
   faint, already waiting, exactly as the boards show it. The caption is the name in both
   scripts:

   | key | Latin | Arabic |
   |---|---|---|
   | keeber | El Keeber | الكبير أوي |
   | hazalqoum | Hazalqoum | حزلقوم |
   | lemby | El Lemby | اللمبي |
   | bayoumi | Bayoumi Fouad | بيومي فؤاد |
   | daheeh | El Daheeh | الدحيح |

   As the camera passes each one: the illustration's own Sobel edges light as stars over
   the picture, the picture fades, the star version holds for a breath in 3D (depth
   spread), then releases back into the field — the owner's words: they fade into the
   space, become their stars version, and go. This is the one place a raster figure is
   sampled, and it is sampled as edges (old lesson), never luminance.
3. **The illustrations are the owner's assets, not yours.** One exists:
   `C:\Users\GAMING\mk-voice\design\characters\daheeh-v2.png` (1254², with
   `daheeh-provenance.md` beside it — the model for all five). The other four the owner
   generates with his image tool from licensed references; the asset bill is §6. Until a
   file arrives, that capsule ships as its waveform ring and name only — never a
   placeholder face, never a generated likeness of yours. Ship to
   `src/assets/voice/<key>.avif` at 800², ≤150 KB, with a provenance line per file in the
   report. Valorant agent portraits in the app folder are third-party; they do not exist
   for this page.
4. **Owner intake.** `C:\Users\GAMING\Downloads\darb-intake\` — `portraits\<key>.png`
   (full body, #05070D ground, with `provenance.txt`), optional `portraits-video\<key>-loop.mp4`
   (5 s, silent), and `refs\` (reference plates and clips for your eyes). The request
   list with every prompt is `docs/deep-field/r05-asset-requests.md`. A loop, where it
   exists, plays inside the capsule exactly like a world gate — scrubbed on
   `pointer:fine`, muted loop on `pointer:coarse`, the PNG as poster. Ingest whatever is
   there at the start of step 5 and again before the packet; list what arrived and what
   did not in the report.

### 4.6 The Workshop — sixteen skills, one by one, at road speed

Replace the tools beat with a drive-by: a title beat ("The Workshop" — copy states
plainly that these are skills the owner wrote), then sixteen stations beside the road,
~300 px of scroll each, no hold, no per-skill copy. Each station is a two-pose figure
(the `foldAt` machinery kept from Round 2) that performs its action once as the camera
passes, scrubbed by `u`, with its name as a caption chip on the anchor star. Both poses
hand-drawn strokes and anchors in `figures.ts`; pose A is the input, pose B the output:

| skill | pose A → pose B |
|---|---|
| agent-brain | scattered notes → a connected graph |
| metahuman-cloner | a photo frame → a wire head |
| mh-oneshot | a three-panel character sheet → a standing figure |
| head-texture-pipeline | a face → its unwrapped UV (the butterfly) |
| photo-to-metahuman-skin | a flat swatch → wrapped over a head |
| garment-clone | a flat pattern piece → a garment on a torso |
| blender-character-forge | a stick armature → a posed one |
| map-reimagine | a flat plan → an isometric block map |
| asset-library | a heap → a sorted grid |
| superblender | a small gear → meshing into a large one |
| scroll-world | a framed diorama → the frame flies open |
| prompt-king | a page of script → a film strip |
| calm-ui | a cluttered panel → three calm lines |
| review-sheet | an empty grid → scored cells |
| checklist-board | boxes → ticked boxes |
| dispatch | one node → routed to three |

Descriptions come from each skill's own `SKILL.md` frontmatter (`~/.claude/skills/`),
one line each, for the still document. Left out on purpose, as in Round 3: job hunting,
personal machines, private client work (`job-market-intel`, `endgame-handover`,
`quotation-builder-prompter`, `machine-toolbox`; `prompt-king-mohamed` folds into
`prompt-king`). None of these repositories is public today; the chips are names, not
links. Never print a private path.

### 4.7 The still document, accessibility, Arabic

- Every new beat exists in the still document: each gate with its poster picture in
  flow, each game with a poster of its hologram (one PNG per game), the five voices as a
  list with their pictures where they exist, the workshop as a list of sixteen names and
  lines, the milestones as headings. No JS, no WebGL and reduced motion land on a complete,
  readable page. Reduced motion renders every beat at its held pose, as now.
- Fix the carried eyebrow: `.signal__kicker` goes from the still document too. The hero's
  scroll hint moves to its own slot.
- One `h1`, headings in order, canvas `aria-hidden`, focus rings, the seek nav reaching
  every beat including the sixteen stations as one stop ("The Workshop"), the skip link
  past the runway, contrast re-read on the rendered page.
- Arabic pass on every new line, by the Round 4 standard (a person's Arabic, product
  names Latin, the type step). Phone AR contact sheet is mandatory.

### 4.8 Performance

- Budgets unchanged: JS ≤350 KB gz, desktop p95 frame interval ≤18.2 ms, phone-emu
  ≤33.3 ms under 4× throttle, CLS 0, paint <1.5 s, key frames ≤250 KB. New: clips ≤1.2 MB
  each and lazy; holograms ≤400 KB gz each and lazy; caricatures ≤150 KB each.
- **Measure the three.js deferral this time.** Three Lighthouse runs per preset, median,
  before and after. Keep it if mobile performance rises; report either way.
- Phone: 390×844 emulation under throttle as Round 4, plus the clip-loop policy proved
  (coarse pointer → loop, fine → scrub). The owner opens v2 on his own phone; that is the
  acceptance.

## 5. Harness

Extend `scripts/test-signal.py` and `scripts/signal_probes.py`; never a second place for
a shared number. New checks, each with a planted failure that must go red:

1. Anamorphic alignment (§4.3), with the flat-figure plant.
2. Rim–plate registration per frame in a real-input recording, ≤3 px, with a planted
   two-frame lag that must be caught.
3. Determinism forward/reverse for clip `currentTime`, hologram frame index and every
   two-pose action (all pure in `u`).
4. Bends are exactly zero across every hold (`k(u) = 0` on the hold range of every beat).
5. Lazy media: no clip, hologram or caricature request before its beat is within two
   beats; none on the critical path (assert from the network log).
6. Rights guard: the four hologram sources are listed in `docs/deep-field/r05/sources.json`
   with a `raw_allowed` flag that defaults false; the build refuses a raw `<video>` for
   any game whose flag is false.
7. Everything Round 4 already checks, re-run: 895 checks stay green or are replaced by
   their Round 5 equivalents with the reason written in the commit.

## 6. Owner asks — the only two things that may wait on him

Neither blocks the round. Build around them; leave the exact slot ready.

**A. Five character plates** — full body, text-free, in the style of his own capsule
boards (`refs\picks\capsule-*.png`), from licensed identity references he supplies; plus
five idle loops. The prompts, the style-anchor rule (image 2 = his board of that
character), the character lines and the filenames are in
`docs/deep-field/r05-asset-requests.md` §1–2. He may also deliver keyframes and clips
(`refs\keyframes\K*.png`, `V-*.mp4`: the gate tunnel with the real cake frame inside, the
road, the ring-face, a capsule dissolve, the games row); those are for your eyes and
never ship. Two of these names are characters played by actors; his call, his
provenance line.

**B. Raw game clips.** `docs/deep-field/r05/clips-review.html`, one tick per clip. Default
is holograms only, which ship regardless.

Merge to `main` and any deploy of the first site remain his word, as always.

## 7. Build order (ship in this order; packet at wherever the session ends)

1. Brief committed. Road shell + bends + milestones + camera on the road, with the
   existing figures still working (morph path intact) — suite green at every step.
2. Hero anamorphosis (§4.1). Capture `anamorph-strip.jpg` before moving on.
3. Gates: anamorphic rim, one-state-per-frame, window, clip, pass-through (§4.2), for all
   five worlds. Registration instrument in the suite.
4. Systems and public re-seated as constellations (§4.3).
5. MK Voice sector (§4.5) with Daheeh in place and four rings awaiting files.
6. Workshop drive-by (§4.6).
7. Game holograms (§4.4), captures bounded, review sheet written.
8. Still document, a11y, Arabic, performance measurement (§4.7–4.8).
9. Packet, push, publish to the **v2** Pages site only
   (`node scripts/build-ghpages.mjs --base flagship-portfolio-v2 --outDir dist-v2`, base
   WITHOUT the leading slash — old trap). Never the first site, never `main`.

## 8. Evidence packet, `docs/deep-field/r05/`

Items 1–11 as in r04 (contact sheets desktop EN / phone EN / phone AR, morph strip, field
strip, figures, portals, budgets, phone, a11y, reduced motion, themes), plus:

12. `anamorph-strip.jpg`: the hero at five camera positions — scatter, half, aligned,
    half-past, burst.
13. `road-strip.jpg`: the six bends, one cell each, milestone caption visible.
14. `gate-strip.jpg`: one world at approach / hold / pass-through / beyond.
15. `holograms.jpg`: four games × three frames each.
16. `voice-sheet.jpg`: the studio gate, then each capsule at picture / edges / stars.
17. `workshop-strip.jpg`: sixteen stations, pose A and pose B.
18. `clips-review.html` and `sources.json` (§4.4, §5.6).
19. `real-input-720.mp4`: one uninterrupted scroll of the whole road at wheel speed.

`report.md` ≤500 words: the beat split per class (reading beat / station / gate) against
its floors, the runway in vh, the rim–plate worst gap, the Lighthouse before/after of the
three.js deferral (three runs, median, spread), the provenance table extended with every
clip, hologram source and illustration, the Arabic before/after table, the red list, and
a one-paragraph merge note. Every number measured, none assumed.

Send the sheets to the owner with SendUserFile, summarise in at most 150 words, STOP.
No merge, no first-site deploy, no PR posts without his word.
