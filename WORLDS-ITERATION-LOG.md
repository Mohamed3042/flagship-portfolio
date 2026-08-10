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

## Pass 6 — The Album goes photoreal (2026-08-07)

**Live:** https://mohamed3042.github.io/flagship-portfolio/worlds/spotify.html

The film stops being only *drawn* and starts being *photographed*, and then grows a
second movement. 18 Wan clips shipped out of 25 offered: six room takes, one per act
of The Album, each now the FIRST surface of its act (photograph → Cycles plate → live
code, three surfaces per act, in that order because it is the argument); and twelve
more as **Side B**, a 60-second scroll-scrubbed flight. Nothing was removed — every
canvas, SVG and CSS scene the film had is still in it. Treatment first, in
`public/worlds/spotify-DIRECTORS-CUT.md`; the build follows it exactly.

**Side B is one scene, not twelve.** The scene's `--p` is the position in the whole
movement: `leg = floor(p × 12)`, and the fraction is the time inside that leg. Two
`<video>` elements double-buffer — the one showing the current leg is seeked, the other
armed with the leg the scroll is heading towards — so there is no scene boundary to
fall through and the whole minute scrubs as a single take. The cut is authored in the
HTML (each caption carries its own clip and poster); the controller never names a file.
A poster `<img>` under the videos always holds the current leg, so a leg that has not
finished loading shows the right still instead of black. Page-local JS, per disney's
precedent — `cinema.js` and `cinema.css` were not touched, so the other seven worlds
did not need re-verifying.

**Cost.** 41 MB of new footage (27.3 MB of clips, 12.6 MB Side B master, 1.1 MB of
posters), well inside the 70 MB ceiling. Centre scope crop 1920×1080 → 1920×804, then
delivered at 1600×670, CRF 26, `-g 12` (pass 5's measurement, reused). One clip needed
CRF 28 to fit a 2.6 MB per-clip cap. The 25 offered clips are all 1920×1080 / 30 fps /
exactly 150 frames.

Traps, all paid for this pass:

- **The watermark gate had to be built before it could be trusted.** Thresholding
  brightness in the bottom-right found the room's own lamps and monitors as well as the
  mark. The instrument that works is a set test: the mark is burned into the SAME pixels
  of every clip, so keep only the pixels bright in ALL of them and the scene content
  cancels. It reports `(1748,1011)-(1887,1063)` — identically for the 7-clip room set and
  the 18-clip mix set measured separately, which is the control proving it reads the mark
  and not the room. The 138 px bottom band the scope crop removes starts at row 942, so
  the mark clears by 69 px and no clip needed an asymmetric crop. Fail-first: the same
  gate run on three deliberately *squashed* (uncropped) encodes goes RED with 1033 px at
  the mark's scaled position; on all 18 shipped clips it is GREEN at 0 px.
- **ffmpeg eats the stdin of the loop that is driving it.** The first ingest run wrote
  `om02-contact.mp4`, `oom03-runway.mp4` and `listener.mp4` — leading characters chewed
  off the next slug because ffmpeg consumed bytes from the heredoc feeding the `while
  read` loop. It exited 0 and printed a tidy table. Every ffmpeg call now passes
  `-nostdin`.
- **A pixel-distance matcher is worthless on a corpus with one palette.** Matching each
  clip's last frame to every other clip's first, to recover the intended chain, returned
  0.17–0.32 for everything — no separation at all. The one reading that survived is the
  control: the portal clip against its own source still, at 0.075, an order below the
  noise. Which is exactly how a metric tells you it cannot discriminate: it CAN separate
  a true match, and nothing else stands out. The cut was made from the motion instead.
- **`python -m http.server` answers a Range request 206 but never sends
  `Accept-Ranges`.** Chrome decides seekability from that header, so `video.seekable` is
  empty, every `currentTime` write is silently a no-op, and the page grades as "does not
  scrub" — including the fifteen Cycles plates that have been live and correct since pass
  5. That identical failure on known-good plates is what named the server. There is a
  `scripts/serve-static.mjs` now that sends the header, and the harness asserts
  `Accept-Ranges: bytes` *before* it grades anything, so a future bad server names itself.
- **rAF never fires in a hidden or embedded webview.** `cinema.js` has carried a 120 ms
  timer fallback for this since pass 2; the new flight controller did not, so it stuck on
  leg 01 while the page scrolled past it. Found because the in-app preview pane reports
  `document.hidden === true`. Same fallback added.
- **Three checks in a row passed in the wrong state.** (1) A convergence test on
  `currentTime` alone accepted leg 03 still sitting at 2.498 s when asked for leg 05 at
  2.5 s, and reported a 0 ms settle. (2) "Exactly one caption is visible" passed while
  the visible one was the OUTGOING caption — so the harness photographed the previous
  leg's headline and printed the correct one beside it. (3) A 0.05 opacity floor let a
  4%-opacity caption through, which is plainly legible over a dark plate. The fix each
  time is the same shape: **name the element the state must be in, do not count
  elements**, and pick the threshold from what is visible rather than what is tidy.
- **Long cross-fades destroy graphic matches.** The legs are joined by a ring becoming a
  record and a tunnel mouth becoming an earcup; a 220 ms dissolve blended an eye into a
  field of orbiting records. The video swap is 90 ms now and the captions cross
  asymmetrically — outgoing clears in 160 ms, incoming starts after it — because
  symmetric timing put two headlines at the same coordinates for a third of a second.

**Credits rewritten, because they had to be.** The page said "path-traced, no AI
footage" and "no official artwork reproduced". The first stopped being true with this
commit; the second was always a stretch, since the footage plainly shows the Spotify
logomark. The credits now name the real pipeline — keyframes GPT-Image, motion Wan,
plates Blender Cycles, engine cinema.js — and the disclosure says unaffiliated fan
tribute and names Spotify AB as the trademark holder.

**Named, not dropped.** Seven clips did not ship and the treatment says why each one
lost: the galaxy-ceiling room (the strongest clip not used — it does leg 01's job, and
only one door can open), floating headphones, the doorway walk-in, the equaliser room,
a violet neon tunnel that has a cut *inside* it, a dreamscape alternate, and the flatter
second take of the chorus room. Two of the ten designed journey stations have no motion
clip at all: the mood matrix is the same corridor as the infinite playlist in the
footage, and "the drop" was never generated as a shot — so the drop is delivered as a
change in physics at leg 07 rather than as a picture of an explosion.

## 2026-08-09 — Disney: THE PARALLAX CUT (owner correction: "fully parallax playing, no autoplay at all, no side stuff")
- The autoplay parallax edition is retired: the 20-chapter film is now SCRUBBED —
  scroll writes `currentTime` (leg = floor(p·20), fraction = clip time), forward and
  reverse, and `play()` is never called on the film. The same scroll writes
  `--journey` (whole-film) + `--depth` (in-chapter) so all four paper planes travel
  with the picture. One mode for desktop, phone, and reduced-motion — no forks.
- Side chrome deleted: SHOT chip, big leg number, page rail, scene ticks, HUD,
  theater/master button, build districts. The only words on the picture are the cue
  (chapter title + one story line, subtitle-style, bottom center). Nav chrome fades
  to nothing while any scene is live; keyboard focus brings it back.
- Frame: full-bleed on landscape; on portrait the reel keeps its true 1358×624 aspect
  as a floating strip with gold hairlines, blurred far plane filling the surround.
- Clips re-encoded from the RAW WAN takes (`crop=1358:624:0:0`, CRF16, `-g 6` — 25
  keyframes per 5 s clip) so reverse scrub decodes ≤6 frames per seek; 20/20 first
  frames match their posters (max raw diff 2.2, wrong-scene threshold 33).
- `verify-disney2.py` rewritten for this contract: play() instrumented at zero across
  every context, scrub-obedience gates (position → exact film time, settled), clock
  freeze without scroll, ordered plane travel + whole-film drift, chrome absence,
  full-bleed/strip geometry, truth-copy phrases, byte ranges, FIN. 173 checks green
  on the LIVE URL; the suite goes red against the retired edition (fail-first).
- Live: main `b1942ab`, gh-pages `697a4da`. Proof frames:
  `Downloads/uberstrike handoff/disney-parallax-cut-proof/`.

## 2026-08-09 — Disney v3.2: ROSTRUM CAMERA (owner direction) + clip-06 story break found
- Full-bleed everywhere (object-fit:cover). The frames are wider than the screen, so
  the scroll pans each chapter's hidden width via `--pan` → `object-position`,
  serpentine (odd chapters sweep back) so joins land on the same edge — projector and
  camera in one hand. Cue tightened to one quiet focus at the foot, clear of the matte.
  Suite adds pan-sweep, renderer object-position, serpentine join-continuity, cover
  and cue-focus gates: 203 checks green on the LIVE URL.
- Full-chain audit (all 20 clips, first frame vs own keyframe + last frame vs next):
  every endpoint clean (max join diff 14.8, threshold 16), zero cross-slot matches.
  Mid-clip sweep (t=1.2/2.5/3.8 contact sheets) found ONE story break the endpoint
  gates cannot see: **DSN2-006 detours to the closed clasped book (~1.8–4.3 s)** —
  Act I imagery inside the ink chapter; caught live by the owner. All other 19 clips
  are on-story (closed book in 19/20 is the scripted seal). Regen package with a
  book-forbidding prompt, upload rules, CRF16/g6 finalize line and a mid-clip gate:
  `Downloads/kingdom-run/REGEN-006.md` (10 credits).

## 2026-08-09 — Disney v3.3: THE WEIGHTED CAMERA

- **Pass 1 — RED against v3.2:** Added frame-sampled step response, lockstep,
  steady-scroll, chapter-grammar, idle-park, jump-snap and version gates before the
  implementation. The old page failed 23 times: one-frame pan/clock jumps, zero glide,
  no idle state, moving chapter edges and the old badge.
- **Pass 2 — local GREEN, deployed RED:** One time-based exponentially smoothed playhead
  (`TAU=140 ms`) now drives film time, pan, depth and journey. The first CDN run exposed
  a second clock inside asynchronous Range seeks: reduced-motion pan moved across 81
  frames while the clip clock moved across three. Buffering each of the same two armed
  five-second slots into an object URL made seeking local and restored measured lockstep.
- **Pass 3 — shipped:** 236/236 locally and 236/236 on the canonical live URL across
  desktop, phone and reduced-motion. Desktop pan/clock spread over 81/83 frames, their
  halfway crossings both landed on frame 22, and only 1.8%/2.6% remained at 500 ms.
  Sixteen-frame local and deployed contact sheets show arrive / cross / parked join /
  settle without a lateral teleport or zig-zag.
- **Gate retunes:** pan-sweep sampling `.10/.90 → .15/.85` to stay outside the new
  `.12/.88` plateaus (travel requirement unchanged at ≥60%); join continuity tightened
  `.12 → .04`; observation wait `260 → 550 ms` so the harness sees a full weighted
  response. No acceptance gate was loosened.
- **Scope held:** page-local HTML/controller plus QA/capture harness only; no shared
  cinema CSS/JS, clips or query strings changed. DSN2-006 remains the named, out-of-scope
  story issue. Cost: 0 credits / 0 generations / 0 paid services.
- Source: `739350c`, `b6ac62c`; Pages: `91db92d`. Full reports and dailies:
  `changelogs/2026-08-09-kingdom-weighted-camera.md`.
