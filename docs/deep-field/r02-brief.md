# DEEP FIELD — Director's brief, Round 2

Same roles, same rules as `r01-brief.md` (sections 2, 3 and 5 still govern; do not re-read
the old notes). Work on `feature/deep-field`. Stop rule at the end.

## Round 1 verdict

Passes: the foundation. One renderer, scroll as the only clock, budgets green, 398/398,
EN and AR both hold, the hero name assembling from stars works in both scripts, the
reduced-motion poster works, the draft deploy exists. Keep all of it.

Fails, in order of weight:

1. **The field is flat.** Every frame between chapters is a uniform scatter of equal
   pinpricks on black. No brightness hierarchy, no visible depth, no density structure, no
   haze reads in any capture. Ten chapters "carrying the field alone" are ten identical
   black screens. This is the difference between a starfield and a deep field.
2. **The image-sampled constellation reads as garbage.** `world-ask-repos` sampled from a
   UI screenshot is a smeared rectangle of text lines; nobody can tell what it is on
   desktop or phone. Luminance sampling of screenshots is retired as a method.
3. **Composition is monotone and too small.** Every chapter is the same small text block
   pinned bottom-left, titles around 18 px on a 1440 px viewport, most of the frame dead.
   The eye has nowhere to go.

Decisions taken for you:
- Film source: look in `C:\Users\GAMING\Downloads\website` for the rendered career film
  (its pipeline commit reads "13 shots, 9,000 frames, burned captions"). If a rendered
  mp4/webm exists, encode a web copy (H.264, 720p, at most 25 MB, plus a poster frame)
  into this site's assets and use it as the reel. If none exists, the Film chapter is a
  poster-frame plane linking to the film pages. Do not block on this.
- CLS: fix the header webfont swap with fallback metric overrides (`size-adjust`,
  `ascent-override`, `descent-override`) or a preload. CLS must be 0 at both sizes.
- Frame time in milliseconds is accepted as the desktop measure. Real phone in Round 3.

## Round 2 scope

### A. Make the field deep
- Three populations inside the one point cloud, stable identity kept: dust (about 70%,
  1 px, alpha 0.25–0.55), mid (about 25%, 1.5–2.5 px), bright (about 5%, 3–5 px with a
  soft halo), plus 8–12 hero stars with a visible 4-point diffraction sprite.
- Density modulated by 3D noise so the sky has structure: one diagonal band (the milky
  way of this page) with the nebula haze anchored to it, and voids elsewhere. Haze is
  allowed up to the r01 alphas but must be visible: measure it. Mean luminance of the
  band region minus a void region on the desktop capture at least 6 of 255; report the
  number.
- Depth must be felt: near stars stream past larger and faster, far stars barely move.
  On scroll the dolly should read as flight, not as a texture sliding. Show it with a
  field strip (packet item 6).
- Twinkle and drift remain time-only; everything else stays a pure function of scrollY.

### B. Figures: designed constellations replace image sampling
Every world gets a hand-authored figure, an SVG of a few strokes drawn like a real star
chart, made of three layers that form together as the morph completes:
- 2–5k stars seated along the strokes (with a little scatter, so the line is made of
  stars, not a wire);
- 6–14 anchor stars at the vertices, brighter, halo, a faint spike on the two or three
  brightest;
- hairlines between anchors (thin line segments in 3D, alpha 0 to about 0.35, drawn in
  by dash offset as the morph passes 60%).
Give each figure shallow depth (a few units of z across strokes) so parallax reveals
volume, and let it breathe at rest (a slow rotation of at most 3° around y, time-only,
off under reduced motion). Titles stay in HTML.

Figures come from what each project actually is; nothing invented, nothing branded:
- ask-repos: a magnifying glass over a folder.
- Enterprise AI Automation Templates: a flow of five nodes with one gated branch.
- PetPoint Ops Hub: a storefront with a counter and a graph line.
- Medmac Box Studio: a cube whose dieline unfolds as the chapter is read (the fold is the
  morph: closed box at 0, flat dieline at 100%).
- Spaceframe World: a triangulated space-frame truss, the most literal constellation of
  the set.
- The remaining worlds: design one figure each from the project's real subject and list
  them in the report with one line of reasoning apiece.
- Hero keeps the name. Public work: the four repositories as four anchor stars joined by
  hairlines, labels in HTML anchored to projected positions, each label a link. Contact:
  the field breathes inward slightly and one star grows into the brightest hero star of
  the page behind the "Let's talk." block.
- Film: the stars part radially from the centre as the chapter arrives and reveal a 16:9
  plane with a hairline border; poster frame, or the reel muted with a sound toggle when
  at least half visible; keyboard-operable as before.

### C. Composition and scale
- Each chapter has a figure zone and a copy zone. Desktop: alternate copy left and right
  per chapter, figure in the opposite zone, figure at rest about 45% of viewport height.
  Phone: figure top, copy bottom, as now.
- Type: titles at display scale, `clamp(34px, 4vw, 56px)`, light weight, wide tracking;
  body 15–16 px, at most 60 characters per line. Everything else in r01 §2 stands (one
  family, one accent, opacity-plus-rise entrances).
- Morph windows: assembly over at least 8% of the page scroll so it reads as motion on a
  real wheel, held for the reading window, release over 5%.

### D. Everything else
- Extend the harness for the new checks (haze delta, figure presence per chapter, label
  registration for Public within 4 px, CLS 0). Keep it green.
- Draft deploy again; URL in the report.

## Evidence packet, `docs/deep-field/r02/`
Items 1–5 exactly as in r01 §5, plus:
6. `field-strip.jpg`: five frames across a 400 px scroll step at a chapter with no figure,
   same viewport, so streaming depth reads as motion.
7. `figures-desktop-en.jpg`: ONE sheet, four columns, one cell per chapter at its held
   pose (hero, every world, public, film, contact), so every figure is judged at once.
8. `real-input.mp4` as before (owner only).
The report adds: the haze delta, the list of figures with reasoning, the film-source
outcome.

Send the sheets to the owner with SendUserFile, summarise in at most 150 words, STOP.
Do not start Round 3. The next brief lands at `docs/deep-field/r03-brief.md`.
