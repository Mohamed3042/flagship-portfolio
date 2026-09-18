---
name: From Signal to Systems
description: Near-monochrome deep-space cinema where colour is evidence and status is carried in rule weight, never in hue
colors:
  signal-bg: "#05070A"
  signal-depth: "#0B1017"
  signal-ink: "#F0F3F6"
  signal-ink-2: "#98A5B1"
  signal-accent: "#70B8FF"
  signal-line: "color-mix(in srgb,#F0F3F6 13%,transparent)"
  signal-hair: "color-mix(in srgb,#F0F3F6 8%,transparent)"
  cta-ink: "#04121F"
  mass-shipped: "rgb(0,1,2)"
  scene-graphite: "#1A222A"
  scene-card: "#C6CCD3"
  scene-paperboard: "#B2ABA0"
  scene-fold-edge: "#3C434B"
typography:
  display:
    fontFamily: "Inter Variable, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(40px,5.3vw,76px)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  display-ar:
    fontFamily: "Al Rai Media, Inter Variable, Cairo Variable, sans-serif"
    fontSize: "clamp(40px,5.3vw,76px)"
    fontWeight: 850
    lineHeight: 1.24
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(30px,4.6vw,58px)"
    fontWeight: 820
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline-cinema:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(26px,2.5vw,40px)"
    fontWeight: 820
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter Variable, Cairo Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.62
  body-limit:
    fontFamily: "Inter Variable, Cairo Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Space Grotesk Variable, Cairo Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.55
  label-status:
    fontFamily: "Space Grotesk Variable, Cairo Variable, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  hair: "2px"
  plate-cinema: "6px"
  control: "10px"
  plate: "12px"
  artifact: "14px"
  pill: "99px"
spacing:
  gutter: "clamp(16px,4.2vw,72px)"
  stack: "14px"
  chapter-gap: "clamp(18px,2.6vw,30px)"
  chapter-block: "clamp(44px,7vw,92px)"
  frame-block: "clamp(40px,6vw,88px)"
  measure: "1240px"
  datum: "42%"
components:
  cta-primary:
    backgroundColor: "{colors.signal-accent}"
    textColor: "{colors.cta-ink}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "48px"
  cta-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "48px"
  cta-quiet-hover:
    backgroundColor: "{colors.signal-depth}"
    textColor: "{colors.signal-ink}"
  evidence-screenshot:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    typography: "{typography.label}"
    padding: "9px 0 0"
  evidence-illustration:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    typography: "{typography.label}"
    padding: "9px 0 0"
  evidence-synthetic:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    typography: "{typography.label}"
    padding: "9px 0 0"
  evidence-media:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    typography: "{typography.label}"
    padding: "9px 0 0"
  evidence-gap:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    padding: "9px 0 0"
  plate:
    backgroundColor: "{colors.signal-depth}"
    rounded: "{rounded.plate}"
    width: "min(46%,620px)"
  status:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    typography: "{typography.label-status}"
    padding: "3px 0"
  action-link:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink}"
    height: "48px"
  action-link-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.signal-ink-2}"
    height: "44px"
---

# Design System: From Signal to Systems

## Overview

**Creative North Star: "Night Sky, Lit Object"**

This world governs one thing: the landing route's first viewport and the seven-chapter cinematic segment that follows it. Everything in it is charcoal and silver until a real product capture enters the frame. The stage is dark in every one of the site's six themes, because the scene it frames is a night sky and a lit object — the stylesheet deliberately touches nothing on `:root`, so the theme system outside the stage survives untouched.

The density is low and the surfaces are few. There are two material families: the flat HTML layer (ground, reading scrims, hairlines, captures) and the rendered layer (graphite, satin, steel, paperboard, thin luminous edges). No glass, no rainbow nebula, no chrome. Depth is carried by tonal separation and one long soft drop under a capture; it is never carried by an outline that pretends to be light.

The system's governing idea is that a visual makes a claim, so the claim is labelled in type. Four evidence kinds render as rule weight and font weight — never as a coloured chip — and a chapter that names a project with no approved capture draws the absence as a broken rule rather than filling it with something that merely looks like proof.

**Key Characteristics:**
- Near-monochrome ground with exactly one accent that only ever marks a real path.
- Status carried in rule weight, dash and doubling; never in hue.
- One registration datum at 42% that holds still across all seven chapters.
- Every frame a pure function of scroll; no animation queue, no entrance motion.
- The still document is the base layer, not the fallback.

## Colors

A near-monochrome charcoal-and-silver environment with a single cool signal blue; colour that means anything arrives from a product screenshot.

### Primary
- **Signal Blue** (`--signal-accent`): the one accent. In the rendered scene it marks only the path a record has actually travelled through the workflow and stops at the approval gate; in HTML it is the primary action fill, the focus ring, the selection highlight, the caret, and the hover colour of a chapter action. Verified at 9.59:1 on the ground and 9.08:1 on the reading surface.

  **Correction, Round 03.** This entry previously claimed the primary action's own text read 8.99:1. It did not. `.signal a{color:inherit}` is (0,1,1) and `.signal__cta{color:#04121F}` was (0,1,0), so the button inherited the stage's ink and shipped WHITE on its own blue at **1.89:1** — measured on the rendered page, in all six themes and both languages, for the whole of the previous build. The rule is now `.signal .signal__cta` and the measured value is the intended one. A palette documented from intent rather than from the rendered page will do this again; measure the element, not the declaration.

### Neutral
- **Night Ground** (`--signal-bg`): the whole stage, the scrims, and the renderer's clear colour. Measured relative luminance 0.002061.
- **Reading Surface** (`--signal-depth`): plates, the quiet action's hover, the skip control, and the satin family in the rendered scene.
- **Primary Ink** (`--signal-ink`): display type, project names, an approved capture's caption. Verified 18.11:1 on the ground.
- **Secondary Ink** (`--signal-ink-2`): body copy, limitations, status, role line, quiet second actions. Verified 8.02:1 on the ground and 7.59:1 on the reading surface — safe for body text at any size.
- **Line and Hair** (`--signal-line` at 13% ink, `--signal-hair` at 8% ink): the only two border strengths. Line bounds an artifact; hair separates chapters and draws the datum.

### Tertiary (rendered-scene materials only)
- **Graphite**, **Steel** (the secondary ink value), **Card**, **Paperboard**, **Fold Edge**: the believable-object palette. Paperboard carries a deterministic fibre roughness map; nothing in this family is emissive.
- **Opening Mass** (`rgb(0,1,2)`): the shipped value, measured in the finish review. It renders darker than the ground — a silhouette cut out of the sky, described only by its rim.

### Named Rules
**The Colour Is Evidence Rule.** Colour arrives from real product screenshots, never from the environment. If a surface is not a capture, it is charcoal, silver or ink.

**The One Path Rule.** The accent marks one thing at a time and only a thing that is real: the travelled path, the matched clip, the focused control. It never invents a status, and a number never takes a hue to mean pass or fail.

## Typography

**Display Font:** Inter Variable (inherited from `tokens.css`)
**Arabic Display Font:** Al Rai Media (self-hosted, weights 500–950; Arabic body stays on Cairo Variable, which has the regular weight Al Rai Media lacks)
**Body Font:** Inter Variable, with Cairo Variable for Arabic
**Label Font:** Space Grotesk Variable

**Character:** Very heavy, very tight Latin display against small, plain, wide-tracked technical labels. The display voice is the loudest element on any screen; everything below it is deliberately quiet so a single narration line can carry a chapter.

### Hierarchy
- **Display** (850, `clamp(40px,5.3vw,76px)`, 1.02, -0.04em): the first viewport headline only, at most 22ch, balanced. Its second line drops to 74% ink mixed toward the ground.
- **Arabic Display** (850, same size, 1.24, letter-spacing 0): Al Rai Media. Arabic never inherits the Latin negative tracking; the RTL block resets it to zero and opens the leading.
- **Headline** (820, `clamp(30px,4.6vw,58px)`, 1.05, -0.035em): the chapter narration line. It *is* the heading — nothing sits above it. Capped at 18ch in the document. Inside the cinema it drops to `clamp(26px,2.5vw,40px)` and the cap is released.
- **Title** (700, 17px, -0.01em): project name. The proof figure shares this size in primary ink with tabular numerals.
- **Body** (400, 15px, 1.62, secondary ink): the project blurb, capped at 56ch. Falls to 14px with the cap released inside the cinema.
- **Limitation** (400, 13px, 1.6, secondary ink, 56ch): the boundary paragraph; its lead-in phrase sets 650 in primary ink inline, on the same line, never above the heading.
- **Label** (400, 12px, 1.55, Space Grotesk): the evidence caption, capped at 54ch; 11px below 560px.
- **Status Label** (600, 11px, 0.08em, uppercase): Public / Private. In Arabic the tracking goes to zero, the uppercasing is dropped and the size rises to 12px.

### Named Rules
**The Line Is The Heading Rule.** A chapter's narration line is the `<h2>`. No eyebrow, no kicker, no label sits above it. Qualifying words go inline inside the paragraph they qualify.

**The Arabic Is Not Tracked Latin Rule.** Arabic display swaps the face to Al Rai Media and resets letter-spacing to 0 and line-height to 1.24. Never ship Arabic display type on the Latin metrics.

## Layout

The segment is a single centred measure of at most 1240px inside a gutter of `clamp(16px,4.2vw,72px)`.

**The registration datum** is one inline offset — 42% on desktop, 0 on portrait — declared once as `--signal-datum`. The copy column is exactly that width, the in-flow plate begins exactly there, the chapter grid's first track is exactly that, and the hairline rule is drawn at exactly that. It does not move between chapters, between breakpoints of the same class, or between representations: in the still document it is a visible 1px hair; in the cinema it becomes the scrim's falloff edge and the copy column's trailing rule at the same offset.

**The still document** stacks seven chapters at `clamp(44px,7vw,92px)` block padding inside a frame padded `clamp(40px,6vw,88px)`, each separated from the next by a hairline. Above 900px the chapter becomes a two-track grid (`var(--signal-datum) 1fr`) with zero column gap; the copy pads `clamp(20px,2.6vw,38px)` toward the datum and the plate pads the same distance away from it.

**The cinema** applies only when motion is accepted *and* a live WebGL context has drawn a matching frame (`[data-graphics=webgl]`). The canvas and the frame each stick to the top and are pulled back out of flow with a negative margin, so a runway of 9 viewport heights (7 in portrait) owns the entire scroll length alone. All seven chapters share one grid cell; the inactive ones are `visibility:hidden` and inert, so they leave the tab order, the accessibility tree and find-in-page together.

**Portrait (≤899px)** is a different composition, not a crop. The datum collapses to 0, the intro goes to one column, the narration takes the full measure across the bottom under a bottom-up scrim, and the plate keeps the upper band and crops at full scale. The opening artifact crops inward to 5/4 at `min-width:150%` rather than scaling down. Below 560px the chapter block padding fixes at 38px and labels drop a point.

**Breakpoints:** 900px (composition), 899px (portrait), 560px (compact).

### Named Rules
**The Datum Holds Rule.** Nothing floats free. Every copy column, in-flow plate and chapter rule registers against `--signal-datum`, and the datum holds still for the whole segment.

**The Crop, Don't Shrink Rule.** The opening artifact and the chapter plate cross the frame edge rather than scaling down to fit inside it. A smaller viewport gets less of the artifact at full size, never all of it at toy size.

## Elevation & Depth

Tonal layering first, with exactly three soft downward shadows, all of them long and all of them pulled back by a large negative spread so they read as a lit object above a floor rather than as a raised card. There is no ambient hover shadow anywhere and no hard offset shadow. Borders do the rest of the work, at two strengths only: 13% and 8% ink.

### Shadow Vocabulary
- **Opening artifact** (`box-shadow: 0 34px 70px -30px rgb(0 0 0 / .85)`): the first viewport's named capture.
- **In-flow plate** (`box-shadow: 0 30px 60px -28px rgb(0 0 0 / .8)`): a plate in the still document.
- **Cinema plate** (`box-shadow: 0 24px 48px -24px rgb(0 0 0 / .9)`): the handed-off capture over the rendered scene.
- **Doubled rule** (`box-shadow: 0 -4px 0 -3px color-mix(in srgb,#F0F3F6 14%,transparent)`): not elevation. This is the media evidence kind's second rule, drawn with `box-shadow` because it is a line, not a shadow.

### Named Rules
**The Falloff, Not The Box Rule.** The copy in the cinema sits on a gradient scrim that decays to fully transparent on the reading-direction side (and upward in portrait). A scrim with a visible edge makes the rectangle the loudest shape on screen; it must fall off, never terminate.

## Shapes

Restrained rounded rectangles on a tight scale: 14px for the opening artifact, 12px for a plate, 10px for a control, 6px for the plate once the renderer owns its transform, 2px on the focus ring, 99px only on the scrollbar thumb. The skip control is square at the top and 10px at the bottom, because it hangs off the top edge.

Above 900px the opening artifact drops its trailing radius and trailing border entirely and runs off the frame edge. Rules are 1px except an approved capture's, which is 2px; the synthetic kind's is 1px dashed; the gap rule is a repeating linear gradient of 5px marks and 6px voids drawn as a 1px background strip — an unwoven line.

The rendered scene's forms are ordered and physical: an aperture, an anamorphic emblem, a workflow lattice, a dieline and its folded carton, three media tracks, a portal and a constellation. Point identity is the array index and is stable across all of them, so a morph is an index-wise interpolation and never a reseed.

## Components

### Buttons
- **Shape:** softly rounded rectangle (10px), minimum 48px tall, padding 12px 22px.
- **Primary:** signal-blue fill with near-black blue text, 700 weight, 15px, with an inline SVG arrow that mirrors under RTL. Hover mixes 18% white into the accent.
- **Quiet:** transparent on a 13% ink border, primary ink. Hover fills to the reading surface and lifts the border to 26% ink.
- **Focus:** a 2px accent outline at 4px offset with a 2px radius, applied to every focusable element in the stage.

### Evidence Caption (signature component)

The most important component in the system. The caption names what the dominant visual actually is, and the naming is done by weight and rule, not by colour:

- **Approved capture** (`screenshot`): 2px solid rule at 55% ink, primary ink, 600 weight.
- **Authored illustration** (`illustration`): 1px hairline rule, secondary ink, 400.
- **Synthetic replay** (`synthetic`): 1px dashed rule at 22% ink, secondary ink, 400.
- **Authorized media** (`media`): 1px hairline plus a doubled rule 4px above it, 400.
- **The gap** (no approved capture on a chapter that names a project): the unwoven rule — a repeating gradient of 5px marks and 6px voids — under a sentence that states the absence.

All five sit at 12px Space Grotesk, 54ch, 9px above the rule.

### Plate (approved capture)
- **Still document:** full width of its column, 12px radius, 13% ink border, reading-surface ground, in-flow plate shadow.
- **In cinema, handed off from a 3D surface:** the renderer owns transform, width, height and opacity (`--plate-blend`), positioned absolutely from a measured rect in canvas pixels and therefore placed physically — it does not mirror with reading direction.
- **In cinema, with no 3D surface to hand off from** (`data-handoff=flow`): still-composed beside the copy at `min(46%,620px)`, top `clamp(64px,13svh,140px)`, 12px radius, bordered. It reads as an artifact, never as a full-bleed background.

### Chapter Actions
A real destination, never a second CTA group. First action: 15px, 650, primary ink, 48px minimum. Every subsequent action steps down to 14px, 550, secondary ink, 44px. Hover moves to the accent and underlines. External actions carry an inline 16px SVG arrow that mirrors under RTL.

### Status
A word, not a pill: uppercase 11px label type in secondary ink with a 13% ink rule above it and 3px of block padding. No fill, no border box, no colour coding.

### Navigation
The stage's only navigation control is the skip link — clipped and transparent until focused, then fixed at the gutter as a 48px reading-surface control that leaves the nine-viewport runway. A long runway without a way past it is a keyboard trap.

### Datum
A 1px hairline at the datum offset. In the cinema it is redrawn as a vertical gradient fading at both ends between 12svh and 88svh, then hidden once the copy scrim's own trailing rule takes over.

## Do's and Don'ts

### Do:
- **Do** let colour arrive only from a real product capture; keep every authored surface charcoal, silver or ink.
- **Do** carry evidence status in rule weight, dash and doubling (2px solid / 1px hairline / 1px dashed / hairline plus doubled rule) so it never depends on telling two hues apart.
- **Do** draw the absence: a chapter naming a project with no approved capture gets the unwoven rule and a sentence saying so.
- **Do** register every column, plate and rule against `--signal-datum` (42% desktop, 0 portrait) and hold it still across all seven chapters.
- **Do** make every frame a pure function of scroll progress, so reverse scroll, restored scroll, deep links and Home/End evaluate to exactly the same state.
- **Do** let residual motion decay to zero at a reading stop; a reading stop that still drifts is not readable.
- **Do** keep the same story at every tier — desktop 32000 morph points / 2200 stars at pixel ratio 1.5, phone 12000 / 900 at 1.25, light 6000 / 420 at 1.0 — rather than substituting static art for a smaller budget.
- **Do** ship the still composition as the base layer: all seven chapters in document order with their real plates, which is what reduced motion, no WebGL, no JS and a lost context all land on.
- **Do** swap the Arabic display face to Al Rai Media and reset its tracking to 0 and leading to 1.24.
- **Do** crop the opening artifact and the plate past the frame edge instead of scaling them down.
- **Do** keep colour scoped: this stylesheet touches nothing on `:root`, and its seam overrides apply to the landing route alone.

### Don't:
- **Don't** use hue to carry a status, a result or a quality judgement. The accent is not a success colour and secondary ink is not a warning.
- **Don't** put an eyebrow, kicker or label above a narration line or a heading. Qualifiers go inline in the paragraph they qualify.
- **Don't** use gradient-filled or shimmering text anywhere in this world; the close carries its weight in type.
- **Don't** add a hard offset shadow or an ambient hover shadow; the only shadows are the three long soft drops above.
- **Don't** give a scrim a visible edge. It falls off on every free side or it becomes the loudest rectangle on screen.
- **Don't** add an entrance animation, a scroll-reveal or an animation queue to this segment. There is no queue; there is only scroll progress.
- **Don't** render an evidence label as a coloured chip, pill or badge.
- **Don't** let a plate become a full-bleed background behind the copy.
- **Don't** move the datum per chapter, or let a plate or action float free of it.
- **Don't** introduce glass, blur panels, rainbow nebulae, glyph-font icons or a system display face; icons are inline SVG and the display face is Inter Variable / Al Rai Media.
- **Don't** extend these rules to the cinematic Worlds under `public/worlds/`, the 38 project story routes, or the shared `Contact.astro` component. They keep their own art direction; the landing route re-tones only the close, and only through route-scoped overrides.

## Known limitations carried by this build

Recorded as defects the shipped artifact carries, by the owner's explicit decision to ship as it stands. **None of these is a design-system rule, and no future surface should inherit them.**

*Four of the five items recorded here were resolved in the director's Round 02 pass; each is kept, struck, with what it actually turned out to be. A limitation that is quietly deleted teaches nothing.*

- ~~**The opening mass inverts.**~~ Resolved. The cause was not a blend: the mass sphere sat at `z = -5.0` while the rim arc it is the limb of sits at `z = -3.1`, so the sphere's silhouette overshot the arc and the lit rim was drawn *inside* the black body instead of along its edge. The renderer now reads `RIM` from `shapes.ts` for radius, centre **and** plane, so the two cannot drift again. Tone-mapped output is measured, not specified: the shipped `0x2A3446` renders at `rgb(19,29,48)` against a `rgb(5,7,10)` ground. ACES at exposure 0.82 crushes shadows hard, so a mass colour is chosen by measuring the composited frame, never by reading the hex.
- ~~**The Email tile in the closing contact band still renders violet.**~~ Resolved, and the recorded mechanism was wrong. The `.sr-contact .cf` override *does* win the cascade. It failed because every `--signal-*` token was declared on `.signal`, and `.sr-contact` is a **sibling** of `.signal`, not a descendant — so `var(--signal-accent)` was unresolvable there, all five `--cf-*` overrides computed to the guaranteed-invalid value, and the tiles' `--acc` went with them. The tiles were not violet; they had no wash at all, over a canvas whose palette is a literal array in the shared component's script. The tokens now sit on `.showroom`, the nearest common ancestor. Measured after: `--signal-accent` resolves to `#70B8FF` inside `.sr-contact`, all three chips paint, and the live-status dot — invisible for the whole previous build — is back at `rgb(48,209,88)`.
- ~~**The opening mass and its rim fall outside the frame at 390px.**~~ Resolved. The rim was never off-frame; it was behind the hero screenshot, which `min-width:150%` had enlarged over the band. The opening is now framed on the rim's real geometry against a protected region declared once as `--signal-sky`.
- ~~**Limitation paragraphs clip on a line boundary.**~~ Resolved. The clamp is replaced by a true first sentence plus a native `<details>` holding the rest, split from the project's own text. No limitation copy was rewritten, shortened or invented for the cinema.
- **The primary action's focus ring was its own fill.** `outline: 2px solid var(--signal-accent)` on a button already filled with `--signal-accent` is an invisible focus ring. The stage's focus ring is still the accent everywhere else; on the filled action it is now the ink.
- **The close's kicker element is hidden, not removed.** `.cf-kicker` still exists in the inherited `Contact.astro` markup; the landing route sets it to `display:none` so no eyebrow renders above the closing heading. Other routes that mount that component still show it.
