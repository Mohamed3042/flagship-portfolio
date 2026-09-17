---
name: Mohamed Mahmoud — One Sky
description: One WebGL universe; every page is a scroll-flown leg of the same flight, and every headline is drawn in the scene
colors:
  space-top: "#03030a"
  space-bottom: "#070713"
  nebula-blue: "#2997ff"
  nebula-violet: "#a259ff"
  nebula-pink: "#ff5e8a"
  nebula-cyan: "#64d2ff"
  boundary-amber: "#ffc36b"
  public-green: "#8ff0ae"
  ink: "#f5f5f7"
  ink-secondary: "#a1a1a6"
  ink-tertiary: "#82838b"
  glass-border: "rgba(255,255,255,0.12)"
  panel-glass: "rgba(10,11,24,0.78)"
typography:
  display:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(40px, 7.4vw, 98px)"
    fontWeight: 860
    lineHeight: 1.01
    letterSpacing: "-0.04em"
  display-arabic:
    fontFamily: "Al Rai Media, Cairo Variable, sans-serif"
    fontSize: "clamp(34px, 6.4vw, 86px)"
    fontWeight: 860
    lineHeight: 1.18
    letterSpacing: "0"
  gate:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(34px, 5.6vw, 84px)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(36px, 5vw, 72px)"
    fontWeight: 850
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter Variable, Cairo Variable, sans-serif"
    fontSize: "clamp(16px, 1.6vw, 21px)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Space Grotesk Variable, Cairo Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.04em"
rounded:
  pill: "999px"
  control: "14px"
  card: "16px"
  panel: "26px"
spacing:
  tight: "12px"
  standard: "18px"
  card: "24px"
  beat: "clamp(70px, 10vh, 120px)"
components:
  button-primary:
    backgroundColor: "linear-gradient(120deg, {colors.nebula-blue}, {colors.nebula-violet})"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "50px"
  button-story-primary:
    backgroundColor: "var(--accent)"
    textColor: "#08090d"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "46px"
  button-ghost:
    backgroundColor: "rgba(8,9,20,0.45)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "50px"
  transmission-fold:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    height: "44px"
  station-panel:
    backgroundColor: "{colors.panel-glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 3vw, 40px)"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "44px"
---

# Design System: Mohamed Mahmoud — One Sky

## Overview

**Creative North Star: "One Sky"**

The whole site is a single universe rendered live in WebGL, and every page is a leg of the same flight through it. The home flies a lit route through eight star systems and pulls back to the whole disc; each project page is the next leg, approaching that project's own planet, running a rail of gates through the system's mechanism, sweeping its proof array and leaving through an amber boundary toward the next planet. Scroll is the clock: nothing plays on its own time, only stars twinkle and planets spin. The reading layer sits on top of the scene, drawn by the scene itself: every headline is a cloud of particles that assembles where the layout placed it and scatters as it leaves, and body copy arrives as a decoded transmission. The eye is meant to watch, not read; a beat carries one short line, and the full text folds under a single control.

The world is dark, luminous and dense by decision: deep space, four nebula accents, a tinted planet per project, bloom and lens effects, letterbox bars that close for the action legs. Phones render the identical scene at native resolution. Browsers without WebGL keep the same words on the same CSS spine.

**Key Characteristics:** one continuous scene across pages; particle headlines and decoded body copy; one short line per beat with the rest folded; scroll-scrubbed camera, effects and transitions; per-project accent that tints the planet, the rail, the gates and the controls; amber reserved for the boundary; identical density on every device.

## Colors

A near-black ground, four nebula accents that belong to the universe, and one accent per project that belongs to its page.

### Primary
- **Nebula Blue** (#2997ff): the site's own accent; the home's primary button gradient starts here, the lit route and map stars read from it, and it is the default page accent.
- **Nebula Violet** (#a259ff): the gradient's second stop and the second galaxy arm; it never carries text on its own.

### Secondary
- **Nebula Pink** (#ff5e8a) and **Nebula Cyan** (#64d2ff): the third and fourth galaxy arms and the gradient ends of the home headline's second line. Together with blue and violet they are the only colours the galaxy is painted in.
- **Project accent** (`--accent`, from `body[data-accent]`; eleven values in tokens.css): tints that project's planet, rail, gates, iris, transmission blocks, primary story button, scan sweeps and folds. Its `cardA`/`cardB` pair is the planet's own two colours.

### Tertiary
- **Boundary Amber** (#ffc36b): the honest boundary gate, its pylons and glow, and the top rule of the handoff. Nothing else on the site is amber.
- **Public Green** (#8ff0ae): the "Public repository" chip and the green tints inside rigs that mean verified, signed or passed.

### Neutral
- **Space** (#03030a → #070713): the backdrop gradient the scene paints, the headline lens behind every particle line, and the ground behind body copy.
- **Ink** (#f5f5f7), **Ink Secondary** (#a1a1a6), **Ink Tertiary** (#82838b): headline, body and label text; tertiary only for labels and captions on dark surfaces.
- **Glass** (rgba(255,255,255,.12) border over rgba(10,11,24,.78)): the home station panel and the gate readouts; blur only on desktop.

### Named Rules
**The Amber Is The Boundary Rule.** Amber marks the honest limit and nothing else; a warning, a chip or a highlight never borrows it.

**The Planet Owns Its Accent Rule.** A project's accent comes from its data, never from a status taxonomy; the planet, the rail and the controls on that page all read the same pair.

## Typography

**Display Font:** Inter Variable (Latin), Al Rai Media (Arabic display, Bold and Black only)
**Body Font:** Inter Variable (Latin), Cairo Variable (Arabic)
**Label Font:** Space Grotesk Variable (Cairo in Arabic)

**Character:** heavy, tight Latin display drawn as particles; Arabic display in the owner's own broadcast face; a technical label face that reads as instrument copy, never as code.

### Hierarchy
- **Display** (860, clamp(40px, 7.4vw, 98px), 1.01, -0.04em): the home hero and story hooks, always as particle text.
- **Gate line** (850, clamp(34px, 5.6vw, 84px), 1.02): one line per build step, centred over the rail; only the active gate is assembled.
- **Headline** (850, clamp(36px, 5vw, 72px), 1.05): brief, proof and honesty lines; chapter titles on the home; particle text.
- **Body** (400, clamp(16px, 1.6vw, 21px), 1.65, max 65ch): one short line per beat, decoded as a transmission; the full text folds.
- **Label** (500, 12–13px, +0.04em): instrument copy: metric captions, the fold control, the scroll cue, nav pills.

### Named Rules
**The One Line Rule.** A beat shows one short line; everything longer folds under "Full transmission". The words stay in the document for search and screen readers.

**The Scene Draws The Headline Rule.** Every display or headline element carries `data-ptext`; its DOM ink is transparent while the flight is live and the particles are the type. Never add a visible DOM headline beside a particle one.

**The No Kicker Rule.** No eyebrow, kicker or section number above a headline anywhere.

## Layout

One fixed canvas behind a normal document. The home is a single column of stops (`[data-sky-stop]`): a centred hero, five beats that alternate start/end, eight stations on a 12-column grid (panel spans 7, alternating sides), the sky map as a sticky intro beside a two-column list, and a centred contact close. A story page is the five-beat spine (`[data-flight-stop]`): a hook with the copy column start-aligned and the planet in the end half (the planet rides above the headline on phones), a brief with one display line, a pinned gate run, a pinned proof beat split half and half between the line and the metric captions, and a centred honesty line over the boundary. Containers cap at 1440px on the home and 1180px on the spine; side padding is clamp(20px, 5vw, 72px); beats pad clamp(70px, 10vh, 120px) vertically. Breakpoints: 1020px (stations stack, blur off), 980px (story grids stack, hook padding moves above the headline), 760px (phone camera framing, 5vh letterbox), 560px (proof metrics stack).

## Elevation & Depth

Depth is real: the scene has a camera, bloom, bokeh on near dust, and lens effects. The DOM layer is flat by comparison and uses tonal layering, a single glass border, and one dark lens behind every particle headline (drawn in the scene, not in CSS). Shadows exist only on the glass panels and the station screenshots (`0 40px 120px -40px rgba(0,0,0,.8)`, `0 30px 70px -24px rgba(0,0,0,.85)`), always offset downward and soft.

### Named Rules
**The Lens Rule.** Text over a live scene sits on a dark radial lens (space at 94% fading to 80%), never on a box.

**The Letterbox Rule.** During the action legs the 7vh bars close over the chrome; the chrome never fights the scene for the frame.

## Shapes

Pills for every control (999px), 14px for the story's primary link, 16px cards, 26px glass panels, 12px screenshot plates. Gates are thin toroids (ring, hex, square, valve), the boundary a spoked amber ring, the proof array square columns on ring bases. Rigs are luminous accent light-and-glass, never grey solids.

## Components

### Buttons
- **Shape:** pill (999px), 50px tall on the home, 46px and 14px radius on a story.
- **Primary:** the home's blue→violet gradient with a white face and a downward glow; a story's primary is its accent as a flat fill with near-black text.
- **Hover / Focus:** rise 2px, a single light sweep across the face (`::after` gradient, 0.9s expo); focus is a 2px accent outline offset 3px.
- **Ghost:** dark translucent fill with an 18% white border.

### Transmission fold (`details.tx-more`)
- **Style:** pill summary, 44px tall, accent-bordered at 34%, a pulsing accent dot, label type.
- **State:** open fills the pill with the accent at 12%; the body inside is standard body copy.

### Station panel (home)
- **Corner:** 26px. **Background:** glass over the scene (blur 14px on desktop; a denser fill on phones). **Border:** 1px white at 9%, an accent hairline across the top. **Padding:** clamp(24px, 3vw, 40px). Holds the title, chip, one line, a three-layer screenshot stack, three metrics and the folded boundary.

### Gate run (story)
- One centred gate line per build step, particle text, the progress bar beneath; gates light, the iris dissolves and a shockwave bursts as the camera crosses; only the active step's line is assembled.

### Navigation
- Brand and links in label type at 44px minimum height; the language and theme pills are 44px circles; on phones the links collapse into the 980px menu. The letterbox bars pass over the nav during the action legs.

### Particle headline (signature)
- Any `[data-ptext]` element: measured word by word in the DOM, rasterised at 2× with its own font, sampled at one point per CSS pixel at 40px (three at display size), drawn in an overlay after the post stack behind the lens; assembles on entry, scatters and streams past the viewer on exit.

## Do's and Don'ts

### Do:
- **Do** drive every effect from scroll: camera, gates, iris, warp, flash, letterbox all read the flight parameter.
- **Do** give each beat one short line and fold the rest under "Full transmission".
- **Do** render the same scene on phones at native device pixel ratio with the same counts and passes.
- **Do** keep the words in the DOM (search, screen readers, gates) and let the scene draw them.
- **Do** tint a page from its project's accent pair and keep amber for the boundary.

### Don't:
- **Don't** add a kicker, eyebrow, section number or a second visible headline beside a particle one.
- **Don't** add a phone quality tier, a pixel-ratio cap or a reduced particle count.
- **Don't** play any sequence on its own clock; only twinkle and spin are ambient.
- **Don't** put text on a box over the scene; use the lens.
- **Don't** hand-tune hash noise into a shader: all noise samples the 256² noise texture (compile time).
