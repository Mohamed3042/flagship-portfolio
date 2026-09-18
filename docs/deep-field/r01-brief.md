# DEEP FIELD — Director's brief, Round 1

Executor: Opus 5 (this session). Director/judge: Fable 5.1 (a separate session, near its
token limit; it sees ONE evidence packet per round and nothing else). Owner: Mohamed.
Owner rules: terse replies, no invented facts, proof or it didn't ship, full autonomy —
never stop to ask "what next". Genuine forks only (downloads, big approach changes).

## 0. What this is

The flagship portfolio landing (Mohamed3042/flagship-portfolio) gets a fresh visual
direction. The previous "From Signal to Systems" object stage (planet rim → fragments →
rails → paper fold → carton → Cake Studio hall) is retired as a design. Its engine,
harness and lessons are kept. Every earlier design document, review verdict and open item
about that stage is history, not instruction.

You are building a scroll-driven WebGL cosmos: pure-black space, a fine particle starfield,
and the illusion that the stars themselves assemble into the content as the visitor
scrolls. Taste reference: the xAI/Grok landing look (black, ultra-fine white stars,
monochrome, expensive restraint, one cool accent, all light comes from the stars) plus the
@webloved TikTok scroll pieces the owner liked (notes exist: `grep -ri "webloved\|tiktok"`
in this worktree's `CLAUDE.md` and `claude-design-pack-2/`). Do not copy any brand asset
or logo. All copy and project data comes from the existing site content and data files:
real, public-safe data only. Never invent a project, a number or a claim about the owner.

## 1. Situation — do this first, in this order

Worktree: `C:\Users\GAMING\Downloads\flagship-signal-20260918`, branch
`feature/signal-to-systems` (based on `design/visual-showroom-20260917`, NOT `main`,
because the cinema hands off to that branch's dense project archive). `public/` and
`node_modules` are junctions into `Downloads\flagship-sss`: never write there.
Read-only neighbours: `Downloads\flagship-sss` (main line, `feature/universe-3d`,
released, has particle headlines worth a look), and the previous session's notes at
`C:\Users\GAMING\.claude\projects\C--Users-GAMING-Downloads-website\memory\signal-round06-object-unfolds.md`
and `signal-to-systems-landing.md` (nineteen traps; read them once, each cost a round).

1. Preserve the unfinished Round 06 work: 13 modified files plus untracked
   `docs/signal-review/round06/`. Commit on `feature/signal-to-systems` as
   `wip: Round 06 object stage, preserved before the Deep Field pivot` (leave any file
   over 5 MB out of git). Push.
2. Create `feature/deep-field` from that commit. All new work goes there. Never touch
   `main`, `gh-pages`, or production deploys.
3. Recon, 30 minutes maximum: `src/lib/signal/*` (renderer, camera, particles with stable
   point identity, chapters, types), `src/components/signal/Chapter.astro`,
   `src/pages/[lang]/index.astro`, `src/styles/signal.css`, `scripts/test-signal.py`, the
   capture scripts, and the archive section below the cinema. Decide what stays. Write the
   decision (10 lines) into the round report. Rule: one canvas, one renderer, one scroll
   source of truth. No second engine.
4. Run Agent Brain once for the task:
   `python "C:/Users/GAMING/agent-brain/tools/brain.py" context --task "deep field cosmos landing"`
   and take only the relevant lessons.
5. Load /impeccable for the build. Cap its automated review to ONE finish-review pass per
   round; the director's verdict replaces the second pass. No documenter until the final
   round.

## 2. The direction (replaces every earlier design document)

Name: DEEP FIELD. One line of story, used at most once on the page: point at the dark long
enough and it fills with worlds.

Look:
- Ground `#000000` at the top; below the fold it may warm to `#04060c`. Nebula haze: two
  or three very soft radial fields (deep blue `#0b1a3a` at 8% alpha or less, violet
  `#241048` at 5% or less), dithered so there is no banding, never bright.
- Stars: GPU points. Desktop 80k, phone 25k, adaptive by measured fps, never a static
  fallback (the owner reviews on his phone; phones get the real show). Deep z spread, size
  attenuated by depth, soft sprite with a tight core and faint halo. Colour mix 90% cool
  white `#dfe8ff`, 8% warm `#ffe3c0`, 2% blue `#9cc4ff`. Twinkle is a per-star phase,
  ±15% alpha, slow, never a strobe. Up to 12 hero stars carry a 4-point diffraction sprite.
  Blending: `NormalBlending` (additive clips in headless captures: old trap 4). Fake bloom
  with sprite halos; a real bloom pass only if desktop stays at 55 fps or better.
- Type: one family, light weight, wide tracking, small sizes, HTML overlay, never WebGL
  text. Ink `#F0F3F6`, one accent `#8ab4ff`. Text enters by opacity plus a 4 px rise over
  300 ms; never bounce, never gradient text. LESS TEXT: a chapter is a title and at most
  one line, plus the real project data it points to.
- Chrome: small wordmark top-left, language toggle top-right, a 1 px accent progress
  hairline along the very top, a scroll hint on the hero only that fades on first scroll.
  44 px minimum hit targets.
- Grain 2–3%, vignette 15% or less. No lens-flare textures, no chromatic aberration, no
  light-leak gradients.

Motion:
- Native scroll is the only source of progress. Every frame is a pure evaluation of scrollY
  (plus time for twinkle and drift), so reverse scroll reconstructs instead of replaying.
  The camera dollies forward along z with scroll (damped, about 0.08 per frame); stars that
  pass the near plane wrap to the far plane (endless field); a constant slow drift keeps
  the sky alive when the user stops; pointer micro-parallax of 0.3° or less, damped.
- THE ILLUSION, constellation morph: at each chapter a subset of stars (12–20k) flies into
  a target formation, holds while the chapter is in its reading window, then releases back
  into the field as the visitor scrolls on. Targets are sampled from (a) the chapter title
  rendered to an offscreen canvas (glyph fill), (b) the project's existing key image,
  luminance-sampled to a point set with tiny z jitter, or (c) an existing mesh surface.
  Per-particle stagger by noise, ease-out-quart in, ease-in on release, scrub-reversible.
  Stable point identity: the same star always plays the same role.
- No cuts, ever. Chapter boundaries are held poses that blend. The whole canvas element
  fades as a pure function of scrollY before the archive begins (old trap 8).
- Reduced motion (read `window.__mmNativeMatchMedia`; the site patches `matchMedia`):
  drift and twinkle stop, each morph sits at its held pose, the page still reads as a
  poster.

Chapters (the scroll script), mapped to the site's EXISTING content and data:
0. Hero: black; a few stars fade in over 1.2 s, then the field; the name assembles from
   stars (morph a); the role line beneath in HTML; scroll hint.
1. Worlds: the featured projects the current site already features. Each is one
   constellation morph from its existing key image or mesh (the Cake Studio hall mesh in
   this worktree is fair game), with title, one line, and a link to its archive entry.
2. Film: the stars part to reveal the career reel plane, letterboxed, muted autoplay with
   a sound toggle, keyboard-operable (Round 04 made the film watchable by keyboard; keep
   that).
3. Public work: the checkable repositories as a literal constellation, labelled stars
   joined by hairlines; labels are HTML anchored to projected 3D positions (registration
   belongs to the camera: old trap 10).
4. Contact: the field slows; one star brightens and becomes the contact link; email,
   GitHub, LinkedIn, CV if the site has one. Then the canvas fades and the existing
   archive follows.

Bilingual: the EN and AR routes both ship every round (`src/pages/[lang]/index.astro`).
RTL must hold.

Budgets, reported every round with the command used; a miss is a defect, not a footnote:
desktop 1440×900 at 55 fps or better; phone emulation 390×844 at 30 fps or better; JS at
most 350 KB gzipped in total including three; first paint under 1.5 s on the built site;
CLS 0; DPR capped at 1.5; contrast 4.5:1 or better read from `getComputedStyle` on the
rendered page, never from intent; keyboard reaches every link; no horizontal scroll at
390 px.

## 3. Non-negotiables

- Fix every bug you meet. Keep `scripts/test-signal.py` green and extend it for the new
  stage; retire checks that only tested the object stage. Verify with the harness and
  headless Playwright captures (`requestAnimationFrame` twice plus 260 ms before reading;
  language in every filename). The desktop app's browser pane pauses rAF while hidden:
  do not measure there.
- Old open items about the rail tubes, the .27 strut and title reflectivity die with the
  object stage. Do not chase them.
- Investigate before changing. When a "defect" appears, first prove the instrument can
  fail (inject a known offset and check it is caught). Five earlier rounds were the
  instrument, not the product.
- Content is ground truth only. Procedural and generated visuals are fine; brand assets
  and other people's art are not.
- No production deploy, no merge, no posts to PR #32. A Netlify DRAFT deploy each round is
  wanted if `netlify status` shows the CLI is already authenticated; put the URL in the
  report. If it is not authenticated, say so and do not set it up.
- Small named commits, ending with the attribution line your session requires. Push
  `feature/deep-field` at the end of the round.

## 4. Round 1 scope (stop when this is done)

Foundation and the hero, end to end, on the built site:
- Steps 1–5 above.
- The starfield, camera, drift, parallax, adaptive count, grain and vignette, chrome,
  progress hairline, reduced-motion path.
- The constellation-morph system with stable point identity, exercised by the hero (the
  name assembles from stars) and by ONE Worlds project constellation, so the illusion is
  judged early.
- The remaining chapters as real sections with their real content in place, only the
  field behind them (no morphs yet); the canvas fade before the archive.
- Harness updated and green; budgets measured; the evidence packet below.

Later rounds, not now. Round 2: all Worlds morphs, Film, Public work, Contact. Round 3:
polish, phone on a real device, the Arabic pass, accessibility, archive re-tone. Round 4:
merge and deploy decision with the owner.

## 5. Evidence packet — the ONLY thing the director will look at

Folder `docs/deep-field/r01/`, committed; every image at most 600 KB; mp4s out of git.
1. `report.md`, at most 350 words: the base decision (10 lines), what shipped, the budget
   table with measured numbers and the command used, what is red and why, the draft URL,
   the exact next step. No prose about effort.
2. `contact-desktop-en.jpg`: ONE contact sheet, 4 columns, captures at scroll progress
   0, .05, .12, .2, .3, .45, .6, .75, .9 and 1.0 at 1440×900 DPR 1, each cell labelled
   with its progress and the fps measured at that point.
3. `contact-phone-en.jpg`: the same at 390×844.
4. `contact-phone-ar.jpg`: the Arabic route at 390×844.
5. `morph-strip.jpg`: 6 frames through one morph (25% to 100% of its window) so the
   assembly reads as motion.
6. `real-input.mp4`: a 20 s real-input wheel-scroll recording (the owner watches it; the
   director does not).

When done: send the three contact sheets and the morph strip to the owner with
SendUserFile, write a summary of at most 150 words in chat, and STOP. Do not start
Round 2. The owner relays the packet to the director; the next brief lands at
`docs/deep-field/r02-brief.md`.
