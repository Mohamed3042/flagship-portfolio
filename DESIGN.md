---
name: Mohamed Mahmoud — Cosmic Keynote
description: Bilingual project-led portfolio with evidence-bearing imagery and spatial exhibits
colors:
  space-top: "#03030a"
  space-bottom: "#070713"
  primary: "#2997ff"
  secondary: "#a259ff"
  cyan: "#64d2ff"
  ink: "#f5f5f7"
  ink-secondary: "#a1a1a6"
  primary-button: "color-mix(in srgb,var(--accent) 70%,#000)"
typography:
  display:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(48px,5.1vw,74px)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(30px,3.4vw,48px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter Variable, Cairo Variable, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  label:
    fontFamily: "Space Grotesk Variable, Cairo Variable, sans-serif"
    fontSize: "14px"
rounded:
  control: "8px"
  button: "10px"
  directory: "12px"
  project: "14px"
spacing:
  compact: "8px"
  standard: "16px"
  card: "24px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary-button}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    padding: "12px 21px"
    height: "48px"
---
# Design System: Mohamed Mahmoud

## Overview

**Creative North Star: "Cosmic Keynote"**

Retain the established dark, luminous, bilingual identity. The revised homepage puts actual product screens and clearly labelled interactive mechanisms in the foreground; its cosmic environment is supporting scenery, not substitute evidence. Existing Worlds and individual case studies keep their own established art direction.

**Key Characteristics:** inspectable product imagery; spatial foreground exhibits; compact project browsing; equivalent English and Arabic navigation.

This document records the implemented homepage extension and its inherited primitives. Source authority is `src/styles/tokens.css`, `src/styles/showroom.css`, `src/components/showroom/`, and the shared navigation. It does not impose the homepage composition on the separate cinematic Worlds.

## Colors

### Primary
The inherited blue controls focus and interaction. Primary filled buttons use the darker mixed-blue value above so white action text remains readable.

### Secondary
Violet and cyan provide the inherited cosmic lighting vocabulary. Individual project accents come from each project's existing cardA/cardB data, never a new status taxonomy.

### Neutral
The deep-space pair forms the page environment. Primary and secondary ink follow the existing theme tokens; panels derive from the current space and foreground rather than forcing dark values into light mode. Six pre-existing themes remain available.

**The Evidence Foreground Rule.** Color and stars frame the work; they must not replace a product screenshot or a legible project name.

## Typography

Latin display and body use the existing Inter family. Arabic display uses Al Rai Media, with Cairo for Arabic body text. Space Grotesk remains the interface-label face. Font binaries are existing project dependencies, not generated deliverables.

The homepage display reduces to 40px on phones, 36px at the narrowest breakpoint; Arabic display uses its own 37px phone setting. Section headings fall to 30px on phones. Featured titles use 25px on phones, while directory titles are 15px in the two-column browser. Body copy is 14–17px depending on role. Qualifiers stay attached to their exact measured figures.

## Layout

The wide container is at most 1360px, with 40px side margins at normal desktop width. At 1150px it uses 24px margins; at phone widths it uses 16px. Featured projects use a 12-column grid with alternating 7/5 and 5/7 spans, equal columns on tablets, and one column on phones. The directory uses four, three, then two columns; its optional list view uses one column on phones.

The five process steps form a compact row on desktop and expandable vertical steps on phones. The new mobile navigation appears below 980px. Native anchors, including Engineering Lab and Foundation, continue to filter the project directory.

## Elevation & Depth

Most content surfaces use a single subtle border and tonal separation. Real screenshot panels are the deliberate exception: they overlap a genuine Three.js exhibit and use a downward soft shadow. The renderer has one canvas, scissored to visible exhibit regions, rather than one WebGL context per object. Off-screen and hidden-tab work stops. Existing ambient background behavior is preserved outside the new renderer.

## Shapes

Controls and imagery use restrained rounded rectangles. Navigation targets and primary controls are at least 44px tall, with the primary action at least 48px. Circular process nodes represent an actual ordered sequence, not decorative section numbering. The engineering mechanism is real geometry; it is explicitly illustrative and is not a structural-analysis output.

## Components

**Featured project:** a real screenshot, alternate-image selectors where available, project identity and public/private status, verbatim summary and qualified proof, expandable evidence and limitations, then story/demo/repository links. Only approved public repository links are exposed.

**Project browser:** search, group filters, list/grid switch, an announced result count, clearable empty state, and explicit show-more batches. All 38 projects remain present in the HTML; with JavaScript disabled, all remain visible.

**Preview dialog:** a native modal for inspecting the full-size screenshot or a project's evidence. Escape closes it, focus returns to its trigger, and background scrolling is locked while open.

**Spatial exhibit:** structure, carton and approval-gate models share one renderer. An accessible range input controls assembly; drag controls rotation. Motion is pausable and respects the native reduced-motion preference. Missing WebGL or Save-Data leaves an actual product screenshot.

**Navigation:** existing links, language and theme controls are preserved; a keyboard-operable native details menu supplies phone navigation.

## Do's and Don'ts

- **Do** use the existing verified project data and approved screenshots; keep limits inspectable.
- **Do** mirror layout, text direction and navigation in Arabic.
- **Do** label conceptual mechanisms as illustrations and preserve a usable static fallback.
- **Don't** add a private repository link, fabricated result, simulated live session, or unreviewed customer screenshot.
- **Don't** restore full-screen empty spacing ahead of the work or shrink meaningful body copy to fit more cards.
- **Don't** generalize this homepage's layout into a replacement for the separate Worlds.
