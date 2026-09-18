---
name: Deep Field
description: A pure-black scroll cosmos where the stars are the content, one accent carries every live path, and the still document is the base layer the cinema upgrades
colors:
  signal-bg: "#000000"
  signal-depth: "#04060c"
  signal-ink: "#F0F3F6"
  signal-ink-2: "#A7B2BF"
  signal-accent: "#8AB4FF"
  signal-line: "color-mix(in srgb,#F0F3F6 14%,transparent)"
  signal-hair: "color-mix(in srgb,#F0F3F6 8%,transparent)"
  portal-ground: "#05070d"
  seam-ground: "#05070B"
  haze-blue: "#0b1a3a"
  haze-violet: "#241048"
  archive-ink-3: "#8D97A4"
  archive-accent-2: "#B79BFF"
  archive-star: "#dfe8ff"
  archive-card: "#11151f"
typography:
  name:
    fontFamily: "Inter Variable, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(34px,5.4vw,66px)"
    fontWeight: 200
    lineHeight: 1.08
    letterSpacing: "0.06em"
  name-ar:
    fontFamily: "Cairo Variable, Inter Variable, sans-serif"
    fontSize: "clamp(34px,5.4vw,66px)"
    fontWeight: 200
    lineHeight: 1.28
    letterSpacing: "normal"
  title:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(34px,4vw,56px)"
    fontWeight: 200
    lineHeight: 1.08
    letterSpacing: "0.015em"
  title-ar:
    fontFamily: "Cairo Variable, Inter Variable, sans-serif"
    fontSize: "clamp(34px,4vw,56px)"
    fontWeight: 200
    lineHeight: 1.28
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0.01em"
  body-ar:
    fontFamily: "Cairo Variable, sans-serif"
    fontSize: "17.5px"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "normal"
  action:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 450
    letterSpacing: "0.02em"
  action-ar:
    fontFamily: "Cairo Variable, sans-serif"
    fontSize: "15.5px"
    fontWeight: 450
    letterSpacing: "normal"
  role:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.14em"
  star-caption:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    letterSpacing: "0.13em"
  star-caption-plain:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.11em"
  seek:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.16em"
rounded:
  ring: "2px"
  chip: "8px"
  skip: "0 0 10px 10px"
  portal-still: "2px"
  aperture: "50%"
spacing:
  gutter: "clamp(16px,4.2vw,72px)"
  measure: "1240px"
  datum: "46%"
  stack-still: "14px"
  stack-cinema: "clamp(8px,1.3vh,14px)"
  chapter-block: "clamp(36px,6vw,72px)"
  chapter-block-cinema: "clamp(28px,7vh,76px)"
  frame-block: "clamp(40px,6vw,88px)"
  copy-inline-end: "clamp(18px,2.2vw,30px)"
components:
  action-link:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    typography: "{typography.action}"
    height: "44px"
  action-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.signal-accent}"
  star-caption:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    typography: "{typography.star-caption}"
    padding: "10px 12px"
    height: "44px"
  star-caption-plain:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    typography: "{typography.star-caption-plain}"
    padding: "5px 8px"
  seek-control:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    typography: "{typography.seek}"
    rounded: "{rounded.chip}"
    padding: "10px 12px"
    height: "44px"
  seek-control-hover:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.chip}"
  seek-out:
    backgroundColor: "transparent"
    textColor: "{colors.signal-accent}"
    typography: "{typography.seek}"
    height: "44px"
  skip-link:
    backgroundColor: "{colors.signal-depth}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.skip}"
    padding: "12px 20px"
    height: "48px"
  portal-plate:
    backgroundColor: "{colors.portal-ground}"
    rounded: "{rounded.aperture}"
    padding: "0"
  portal-plate-still:
    backgroundColor: "{colors.portal-ground}"
    rounded: "{rounded.portal-still}"
    width: "560px"
---

# Design System: Deep Field

## Overview

**Creative North Star: "The Field Is The Content"**

This world governs the flagship portfolio's landing route (`src/pages/[lang]/index.astro`) and the archive that follows it on the same black. Its whole material is one particle starfield: nineteen beats in which the same stars leave the field, stand for a moment as a name, an aperture, a figure or an asterism, and are released back. There is no second population and no second illustration layer — the point cloud that is the sky is also the drawing.

The ground is pure black (`#000000`, relative luminance 0) and there is exactly one accent. Everything readable is HTML over the canvas; nothing legible is ever drawn into the canvas. Depth is carried by three scaled shells of stars with fixed world positions, by a faint band on its own 27° tilt with a painted haze that agrees with it, and by grain and a vignette — never by a card, a panel or a border box. The only rounded rectangle allowed to appear over the field is a chapter-navigation control, and only once a pointer or keyboard asks for it.

The scoping is a load-bearing design decision, not an implementation detail. The tokens are declared on `.showroom:has(.signal)` and never on `:root`, so the cinema and the archive below it — which are siblings, not ancestor and descendant — both resolve them, while the site's six-theme system, the header, the dialog in the top layer and every other route are untouched. The one exception is a paint rule on `body:has(.signal)`, because the body owns the page ground and is not a descendant of `.showroom`; it paints the literal `#000000`, and the suite reads the painted body back and compares it to the token so the two cannot drift.

**Key Characteristics:**
- Pure black ground, one accent (`#8AB4FF`), one ink and one secondary ink. Measured on the rendered page at 18.86:1 title, 9.76:1 body line, 18.86:1 actions and captions (`docs/deep-field/r04/report.md`).
- One canvas, one renderer, one scroll number. Every frame is a pure function of progress `u`, so reverse scroll, a restored position, a deep link and Home/End all land on the frame forward scroll produces.
- The still HTML document is the base layer, not a fallback: no JS, no WebGL context and reduced motion all land on a complete, readable list of work.
- A beat is 47% assembly, 28% hold, 25% release — the reading is paid for in scroll distance, not in a dwell timer.
- Type is one family per language, light and small, over a soft field with no edge.

## Colors

A black sky, two greys and one cool blue; the only saturated colour on the page arrives inside a world's own key frame.

### Primary
- **Signal Blue** (`--signal-accent`): the single accent. It marks the focus ring, the text selection, an action's hover, the route's 1px progress hairline, the leading edge of the hero's scroll-hint rule, the "View work" exit in the seek nav, and the archive's `--accent` below the cinema. Measured 9.85:1 on the ground as declared; the round's contrast pass reads it off the rendered page.

### Neutral
- **Night Ground** (`--signal-bg`): the stage, the renderer's clear colour, and the body's painted ground for the whole route. Pure black, luminance 0, in all six site themes — what the stage frames is a night sky, so it does not take a theme.
- **Depth** (`--signal-depth`): the skip control, the archive's base surface, and the window chrome below the cinema. Near-black, not a lift.
- **Primary Ink** (`--signal-ink`): every heading, every action, and every star caption. 18.86:1.
- **Secondary Ink** (`--signal-ink-2`): the one body line per beat, the role line, the seek controls at rest, and the footer while the route is black. 9.56:1 as declared, 9.76:1 read off the body line on the page.
- **Line and Hair** (`--signal-line` at 14% ink, `--signal-hair` at 8% ink): the only two edge strengths. Line bounds the aperture and the still portal; hair separates chapters in the still document.
- **Tertiary Ink** (`--ink-3` = `#8D97A4`, archive only): held at 7.02:1 on black, above the level several of the site's own themes push their tertiary to.

### Tertiary (the sky's own materials)
- **Haze Blue** (`#0b1a3a`) and **Haze Violet** (`#241048`): five radial fields laid along the band's own axis, each under 0.10 alpha, painted in CSS under the stars and dithered by the grain above them so they cannot band. They are visible because they agree with the star band, not because they are strong.
- **Portal Ground** (`#05070d`): what an aperture holds before its frame has decoded.
- **Archive Star** (`#dfe8ff`) and **Archive Accent 2** (`#B79BFF`): carried into the archive's inherited tokens below the seam.

### Named Rules
**The Colour Is Evidence Rule.** Colour arrives from a real product capture — a world's key frame inside its aperture, a screenshot in the archive. Every authored surface on this route is black, ink or the one accent.

**The Nearest Ancestor Rule.** These tokens are declared on `.showroom:has(.signal)` and never on `:root`. A token on `:root` is the whole document and would follow the visitor into the header, the top-layer dialog and the next route; a token on `.signal` is invisible to the archive, which is its sibling, and an unresolvable `var()` computes to the guaranteed-invalid value and takes the whole declaration with it. Declare route tokens on the nearest common ancestor of everything that must read them.

**The One Accent Rule.** One hue, one meaning: a live path the visitor can take. It never reports a status, a result or a quality. The only other hue that ships on this route is the availability dot in the closing band, which reports something true.

## Typography

**Latin Face:** Inter Variable (inherited from the page; the route sets `font-family:inherit`, deliberately, rather than reaching for the site's label token)
**Arabic Face:** Cairo Variable
**Label/Mono Face:** none. One family per language is the rule, and a second family was also the late webfont swap that moved the seek group after first paint.

**Character:** Very light, very large, widely-tracked headings over very small, quiet body copy. A beat is a heading, at most one line, and the links that let a reader check it. Weight 200 at up to 66px is the loudest thing on the page and it is still thin — the field behind it has to stay visible through the words.

### Hierarchy
- **Name** (200, `clamp(34px,5.4vw,66px)`, 1.08, 0.06em): the hero `<h1>`. Once a live context has drawn the name out of the stars, this element is visually hidden but stays in the document and the accessibility tree exactly where it was.
- **Title** (200, `clamp(34px,4vw,56px)`, 1.08, 0.015em, balanced): every other beat's `<h2>`. It steps to `clamp(30px,8vw,40px)` in portrait and `clamp(28px,3.2vw,40px)` on a short frame.
- **Body line** (400, 16px, 1.62, secondary ink, max 52ch): at most one per beat. It is dropped entirely below 620px of frame height — except the hero's, which is the page's one line of story.
- **Action** (450, 14px, 0.02em, primary ink, min 44px): a real destination with a 15px inline SVG arrow that mirrors under RTL.
- **Role** (400, 13px, 0.14em, uppercase, secondary ink): the hero's second line only.
- **Star caption** (600, 13.5px, 0.13em, uppercase, full ink): the name of a repository hanging off its own star. The tools variant is one step down (13px, 0.11em) because twelve of them share one ladder.
- **Seek control** (500, 12px, 0.16em, uppercase, secondary ink): the chapter navigation.

### Named Rules
**The Caption Is Read, Not Decoded Rule.** A name on a star is a caption: 13–13.5px, uppercase, tracked 0.11–0.13em, in the page's *full* ink. It was 12px in the secondary ink under a hairline brighter than itself, which on black at held pose is a grey smear. The leader carries the connection so the caption does not have to shout; the hairline is dimmer than the caption it serves (0.30 alpha drawn, 0.22 in the WebGL links).

**The Arabic Step Rule.** Arabic is not Latin at a smaller size. Every slot runs 1–2px larger with looser leading and no tracking: body 16/1.62 → 17.5/1.85, action 14 → 15.5, role 13 → 14.5, seek 12 → 13.5. These are steps on the existing clamps, so the responsive curve is shifted, not replaced. The uppercase transform is dropped, because Arabic has no case.

**The Latin Exception Rule.** A star caption stays at the Latin size and keeps its tracking in both routes, because it is a repository or skill name and is marked `dir=ltr`. The site's global `[dir="rtl"] *{letter-spacing:normal !important}` reaches every descendant of the Arabic route, so this exception is stated for exactly the elements that declared themselves left-to-right, and it needs `!important` because the rule it answers has it.

## Layout

The route is one centred measure of at most 1240px inside a gutter of `clamp(16px,4.2vw,72px)`, on a scroll runway of **36 viewport heights** in landscape and 38 in portrait.

**The still document** stacks all nineteen beats in document order at `clamp(36px,6vw,72px)` of block padding inside a frame padded `clamp(40px,6vw,88px)`, each separated from the next by an 8%-ink hairline, each carrying its real portal picture in flow. This is what the server ships: `data-graphics` is deliberately absent from the markup and the renderer adds `webgl` only once it holds a live context.

**The cinema** applies on `[data-graphics=webgl]` alone, and never on the motion query. Reduced motion here is a different composition, not a switched-off one — the visitor still gets the real field and the real constellations, held still at their poses. Gating the block on `no-preference` once produced a page laid out as a document while the renderer still treated it as a cinema. The haze, the canvas, the grade and the frame each stick to the top and are pulled back out of flow with a matching negative margin, so the runway owns the whole scroll length alone. All nineteen chapters share one grid cell; the inactive ones are `visibility:hidden` *and* `inert`, so they leave the tab order, the accessibility tree and find-in-page together, and the visibility switch is delayed 260ms so a boundary is a cross-dissolve rather than a cut.

**The two zones.** Above 900px the copy takes a column of `min(46%,620px)` and the figure takes the other, and the side alternates on every beat across the whole page, so two neighbours never share a column. `justify-self` is logical, so Arabic mirrors without a second rule. Two beats are centred with the figure *behind* the words: the name at the top and the one star at the end.

**The beat split.** A four-point window in local progress: `in0 0, in1 0.47, out0 0.75, out1 1` — 47% assembly, 28% hold, 25% release. Measured on the shipped window (`docs/deep-field/r04/report.md`): at 1440×900 the beat is 1,683px, of which **791px assembles, 471px holds and 421px releases**; at 390×844 it is 1,668px / 784 / 467 / 417. The floors exported from `chapters.ts` and checked by the harness are 700 / 450 / 400. Assembly clears its floor by ninety pixels, so the runway cap stayed at 36 viewport heights (31,500px) rather than being extended to buy the hold. The fractions are what ship; the pixels are that window on the review viewport.

**Breakpoints:** 900px (composition), 899px (portrait), 700px of frame height (tighter setting), 620px of frame height (the body line goes). A 100svh frame with `overflow:clip` silently eats whatever does not fit, and what does not fit is the end of the block — the links — so a short frame gets a tighter setting, never a shorter chapter.

### Named Rules
**The Still Document Is The Base Layer Rule.** The composition the server ships is complete and worth reading on its own. The cinema is added on top of it and never supplies it. No JS, no context, a lost context and reduced motion all land on the same document.

**The One Source Of Truth Rule.** One canvas, one renderer, one scroll number. Nothing in the scene reads a clock (except twinkle and drift), a random source or a previous frame, so every entry point evaluates to the same state.

**The Reading Is Paid In Pixels Rule.** A hold is measured in scroll distance against a floor, not in a fraction that looks reasonable. 202px of hold is a title, a line and a link arriving and leaving inside two notches of a wheel.

## Elevation & Depth

There are no cards and no raised surfaces on the cinema. Depth is entirely optical: three star shells at 190 / 76 / 25 scene units, each a scaled copy of the others so none of them shows an edge while the shallow one sweeps past many times faster; a star's world position is fixed and only its depth wraps, so the parallax is real rather than an impression of it; a band defined in direction space, which projects to the same stripe at every depth and therefore holds still while the clumps inside it stream past.

Over that: a painted vignette (`radial-gradient(112% 92% at 50% 48%,transparent 52%,rgb(0 0 0 / .15) 100%)`) and an SVG fractal-noise grain at 0.028 opacity. No texture download, no light leak, no chromatic aberration.

Text legibility is bought with a scrim that has no edge — a radial field behind the copy, inset `-48px -80px -56px -96px`, decaying to fully transparent on every free side. The centred beats get a lighter one (0.56 at the centre instead of 0.82), because what that scrim sits over is the single star the beat is about.

### Shadow Vocabulary
- **Aperture inner fall** (`box-shadow: inset 0 0 0 1px <14% ink>, inset 0 0 34px 12px rgb(0 0 0 / .62)`): the only shadow on the cinema. The picture falls into the black at the rim instead of stopping at it, so the stars standing on the rim are what the eye reads as the edge.
- **Archive ambient** (`--shadow: 0 30px 80px -20px rgb(0 0 0 / .8)`): inherited by the archive below the seam. Long, soft, pulled back by a large negative spread.

### Named Rules
**The Scrim Has No Edge Rule.** Copy sits on a soft field, never on a box. A scrim that terminates makes the rectangle the loudest shape on screen.

**The Rim Is The Only Line Rule.** The aperture's edge is made of stars and an inner vignette. A drawn hairline circle would be a line painted over the one figure that must not have a line drawn on it.

## Shapes

The form language is the ellipse and the point. A world's portal is clipped to `ellipse(50% 50% at 50% 50%)` with `border-radius:50%`, and the renderer sizes that box to the **rim** and not to the figure's fitted box — the eight iris ticks stand outside the rim, so `figures.ts` derives and exports `PORTAL_RIM_SHARE` rather than the ratio being typed twice. That is what makes "edge to edge" exact: nothing of the picture reaches past the rim and nothing inside the rim is empty. Measured, the desktop ring went 45.3% → 52.8% of viewport height and the plate 327×184 → 481×430 (3.2× the area).

Rectangles are rare and quiet: a 2px radius on the focus ring and on the still document's portal, 8px on a seek control whose border is transparent until a pointer or keyboard asks for it, and `0 0 10px 10px` on the skip link because it hangs off the top edge. A label anchor has no shape at all — it is a zero-by-zero point on the projected star with its chip hanging off it, which is what makes registration checkable to the pixel (the harness holds it within 4px and plants a 6px drift that must be caught).

Every hairline on this route is 1px. A drawn leader runs from the projected anchor to the chip's own edge at the length and angle measured in the same frame that placed it.

## Components

### Action link
- **Character:** a real destination, never a second call-to-action group.
- **Shape:** none — text and a 15px inline SVG arrow, 8px apart, 44px minimum height.
- **Colour:** primary ink at rest; the accent plus an underline on hover.
- **RTL:** the arrow mirrors with `scaleX(-1)`.

### Star caption (signature component)
The defining component. Each is a POINT at a projected star with a chip hanging off it, positioned every frame from where the camera says that star is.
- **Repository caption:** 13.5px, 600, 0.13em, uppercase, full ink, 10px 12px padding, 44px minimum — it is a link.
- **Tool caption:** 13px, 0.11em, 5px 8px, no minimum height. None of those repositories are public, so the chip is not a control and owes no 44px target; it is the star's name.
- **Leader:** one 1px hairline at 30% ink from the anchor to the chip edge, dimmer than the caption it serves.
- **De-collision:** a chip slides down its own leader. The anchor never moves off its star — the anchor is what the camera projected and what the registration check reads. In landscape the chips' band stops 20px short of the copy column.
- **Focus:** the ring belongs to the chip (2px accent, 3px offset, 2px radius), not to the zero-by-zero anchor.
- **Still document:** hidden. Without the scene there is nothing to anchor to, and the same repositories are already links in the beat's own action row.

### Portal plate
- **In the cinema:** the renderer projects the rim's centre and height with the frame's camera and writes the box and a physical `left`/`transform` in CSS pixels — deliberately physical, because the projection arithmetic is already correct in both directions and a logical property would mirror it a second time and put every world off the Arabic screen.
- **Blend:** two gates multiplied. `--signal-portal` is the beat — the picture arrives *behind* the closing rim, a little after the ring is readable, and stays through the hold and the first of the release. `data-decoded` is the browser's: until `img.decode()` resolves the opacity is held at exactly 0, so an aperture never opens onto a blank rectangle that fills in afterwards.
- **In the still document:** a plain picture in flow, max 560px, 2px radius, with the same 14%-ink hairline rim and its intrinsic width and height on the element so the space is reserved before the bytes arrive.

### Seek navigation
Labels, not buttons: 12px uppercase tracked secondary ink on a transparent border, 44px hit box, 8px radius that only appears on hover or focus. Three bordered pills over a starfield were the only rounded rectangles on the page. It lives inside the sticky frame but *outside* every inert-toggled chapter panel, so it is reachable at any progress. A scroll film that can only be advanced by scrolling is a film a keyboard cannot watch.

### Skip link
Clipped and transparent until focused, then fixed at the gutter as a 48px depth-coloured control whose target is past the entire runway.

### Focus ring
2px solid accent at 4px offset with a 2px radius, on every focusable element in the stage; 3px offset on a star caption. Verified on the rendered page at `rgb(138,180,255)`, present under keyboard focus and absent otherwise.

### The seams
- **Above:** while the header overlaps the stage it takes an 84%-black ground, an 11%-ink lower edge and light controls; the theme control is hidden (it offers six themes to a stage that is black in all six) and, while the hero is the live chapter, the wordmark gives up its ink and keeps its dot — it is still a real link in the accessibility tree the whole time. Everything returns the moment the header leaves the stage.
- **Below:** the archive takes the Deep Field tokens through `.showroom:has(.signal)` so the cinema does not fade onto whichever of six themes the visitor chose. The light theme is the one that must be checked by instrument, because its rules paint light surfaces and dark ink with literal values a token swap cannot reach; those are answered one by one.

## Do's and Don'ts

### Do:
- **Do** declare route tokens on the nearest common ancestor of everything that reads them (`.showroom:has(.signal)`), never on `:root`, and paint the body ground with a literal because the body sits above the declaring element.
- **Do** ship the still document as the base layer: nineteen beats in document order with their real pictures, which is where no-JS, no-WebGL, a lost context and reduced motion all land.
- **Do** gate the cinema on a live context alone, and give reduced motion the same composition held still rather than a switched-off one.
- **Do** make every frame a pure function of one scroll number, so reverse scroll, a restored position and a deep link agree.
- **Do** pay for reading in scroll distance: 0.47 assembly / 0.28 hold / 0.25 release, checked against floors of 700 / 450 / 400 px on the window that actually ships.
- **Do** size a portal plate to the rim and clip it to the ellipse, and derive the rim's share of the figure's box rather than typing the ratio twice.
- **Do** hold a picture's opacity at exactly 0 until `img.decode()` resolves.
- **Do** anchor a label to a projected point and let the chip hang off it; de-collide by sliding the chip down a drawn leader, never by moving the anchor.
- **Do** set a star caption at 13–13.5px, uppercase, tracked, in full ink, with a leader dimmer than the caption.
- **Do** step every Arabic slot up 1–2px with looser leading and no tracking, and restate the tracking for Latin `dir=ltr` captions with `!important`, because the site's global RTL rule has it.
- **Do** make a chapter's copy arrive on activation by opacity and a 4px rise, not scrubbed by scroll — scrubbed text parks at whatever fraction the visitor stopped at.
- **Do** keep the composition alive on a short frame by tightening the setting, not by shortening the chapter.

### Don't:
- **Don't** use hue to carry a status, a result or a quality. One accent, one meaning: a live path.
- **Don't** draw anything readable into the canvas. Type is HTML over the field.
- **Don't** put a card, a panel or a bordered pill over the field. A control's border appears on hover or focus and not before.
- **Don't** give a scrim a visible edge, and don't let it cover the one star a beat is about.
- **Don't** draw a hairline over an aperture; its rim is stars and an inner vignette.
- **Don't** hide an inactive chapter with opacity alone — `visibility:hidden` plus `inert`, so it leaves the tab order, the accessibility tree and find-in-page together.
- **Don't** use a logical property for a position the renderer already computed from the camera's projection; that arithmetic is physical and mirroring it twice puts the element off the Arabic screen.
- **Don't** add a second type family to this route. One family per language, inherited from the page.
- **Don't** introduce glass, blur panels, a hard offset shadow, a system display face, or a glyph icon font; icons are inline SVG.
- **Don't** put a kicker, eyebrow or tracked label above a heading (see the carried defect below). The tracked uppercase caption form is native to this world *on a star, in a seek control and on the role line* — not above a title.
- **Don't** extend these rules past this route. The cinematic Worlds under `public/worlds/`, the project story routes, the work pages and the shared `Contact.astro` keep their own art direction and the site's six-theme system is untouched; the landing only re-tones the close and the archive through route-scoped overrides.

## Known limitations carried by this build

Recorded as defects the shipped artifact carries. **None of these is a design-system rule, and no future surface should inherit them.**

- **The route ships an eyebrow above every heading.** `.signal__kicker` — 11px, weight 500, 0.24em, uppercase, secondary ink — renders above the title on all nineteen beats in the still document, fed by a per-act `kicker` in `chapters.ts`'s `COPY`. The cinema hides it (`.signal[data-graphics=webgl] .signal__kicker{display:none}`) and the stylesheet's own comment states the ban, so it is live precisely on the layer this system calls the base layer: no JS, no WebGL, and every crawler. The hero's scroll hint uses the same slot. It is documented here as a defect, not as a token or a component; the frontmatter carries no kicker role deliberately.
- **`.cf-kicker` is hidden, not removed.** The inherited `Contact.astro` markup still contains its eyebrow element; this route sets `display:none`. Other routes that mount that component still show it.
- **Mobile Lighthouse performance is 59** on the simulated slow-4G phone (LCP 4.7s, TBT 810ms), against a measured worst p95 frame interval of 8.4ms under a 4× CPU throttle. Diagnosed in `docs/deep-field/r04/report.md`; not a visual-system decision.
- **`valid-source-maps` fails** in every Lighthouse run: the build ships no source maps.
