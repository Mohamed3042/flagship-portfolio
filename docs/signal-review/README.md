# From Signal to Systems — implementation review

The English and Arabic landing pages now open on a scroll-controlled spatial sequence
that replaces the "Systems in orbit" showroom composition. This is a source/review
branch. Nothing here was deployed, and no `main` or `gh-pages` branch was touched.

## What was implemented

One shared WebGL renderer and one point cloud with stable point identity carry seven
chapters: a rim-lit horizon, an anamorphic star form, a controlled workflow, a folding
carton, aligned media tracks, a World portal, and the project archive. Native document
scroll is the only source of progress. Every frame is a pure evaluation of that one
number, with no animation queue and no played/unplayed state, so reverse scroll, a
restored scroll position, a direct chapter address, Home and End all reconstruct the
same scene rather than replaying it.

The signature illusion is anamorphic: points are sampled along the viewing rays of one
alignment camera, so the form reads flat from that pose and reveals ordered depth when
the camera moves laterally. The figure is nonverbal, so English and Arabic share it.

Four chapters rest at a reading stop where motion decays to zero and a 3D surface hands
off to a real HTML screenshot aligned to its projected rectangle. Evidence status is
carried in type and rule weight — solid for an approved capture, hairline for an
authored illustration, dashed for a synthetic replay, doubled for authorized World media
— and a chapter naming a project with no approved capture draws the gap as an unwoven
rule instead of concealing it.

The existing archive, the six-theme system, both language routes, all 38 story routes
and the separate cinematic Worlds are retained.

## Verified

`npm run build` completes green at 80 static routes. `node scripts/verify-portfolio.mjs`
passes for all 38 stories across both languages, with correct canonicals, group
membership and private-safe links. `npx tsc --noEmit` reports no error in
`src/lib/signal/**`; the repository's pre-existing missing `@types/three` still affects
`showroom-scene.ts` and `sky/engine.ts` and was not introduced or fixed here.

`python scripts/test-signal.py` passes 125 checks against a served production build, at
1440×900 and 390×844, in English and Arabic. They cover determinism at seven sample
points forward, in reverse and by direct jump; exactly one live chapter; zero keyboard
targets inside hidden chapters; stopping the scroll stopping progression; Home and End;
no navigation as a scroll side effect; no audio element; no horizontal overflow; one
renderer canvas; no second ambient star field; the reduced-motion path showing all seven
chapters with nothing inert; and the no-JavaScript path keeping every chapter and its
links.

## Measured

**Reverse reconstruction.** A forward pass and a reverse pass were captured at the same
sixty progress values. At the four reading stops the reverse frame matches the forward
frame at SSIM 0.999940, 1.000000, 0.997764 and 0.999972. Mid-transition frames differ by
the ambient breath, which is time-based by design and decays to zero at rest. Recording:
`.impeccable/review/signal-forward-reverse.mp4`.

**Highlight clipping.** After moving the point material from additive to normal blending,
peak luminance measures 227–245 per frame with zero pixels at or above 250 outside the
product screenshots' own white interface. The earlier additive build peaked at 255 with
13,643 pixels at or above 250, including a clipped spine through the system chapter.

**Contrast.** `--signal-ink-2 #98A5B1` on `--signal-bg #05070A` computes to 8.02:1, and
7.59:1 on `--signal-depth #0B1017`. The arithmetic is recorded in `src/styles/signal.css`.

These are local results on one Windows machine. They are not a field measurement, not a
Lighthouse run, and not a GitHub Actions result. Physical iPhone Safari performance and
battery behaviour were not measured, so no claim is made about them.

## Review

The build was reviewed twice by an independent finish reviewer working from the
recaptured screenshots and the direction contract, not from the build conversation. The
first review returned eight material findings; the second scored the fix batch and
returned three. Both rounds are reflected in the current state.

Two defects the reviewer found were structural and would not have surfaced from reading
the source: the renderer's canvas was scoped inside the stage element, so no scene was
drawn behind the first viewport at all; and the constellation shape drew one particle per
project, which rendered 38 projects as empty black.

## Round 02 — the director's pass

A second round, directed from `docs/design-direction/signal-round-02/` and discussed in
[PR #32](https://github.com/Mohamed3042/flagship-portfolio/pull/32), reworked the
opening, the formation, the carton, the portal and the seam below the cinema. Its
evidence — matched before/after poses at two viewports in both languages, a normal-paced
forward/reverse recording, and the measurements behind each claim — is in
[`round02/`](round02/README.md).

All three items this document previously listed as open are closed by that round, and
two of the three had a different cause than was recorded here:

1. **The Email tile.** The route-scoped override *did* reach the band. Every
   `--signal-*` token was declared on `.signal`, and `.sr-contact` is a sibling of
   `.signal`, not a descendant, so `var(--signal-accent)` was unresolvable there and all
   five `--cf-*` overrides computed to the guaranteed-invalid value. The tiles had no
   wash at all, over a canvas whose palette is hard-coded in the shared component's
   script; the same failure had silently removed the live-status dot, both card hover
   states, the project-card accent wash and the atlas wordmark colour. The tokens now sit
   on `.showroom`. `--cf-green` is deliberately *not* re-pointed: it drives the
   "Available now" dot, which reports a fact rather than decorating a band.
2. **The horizon at 390px.** It was not outside the frame. It was behind the hero
   screenshot, which `min-width:150%` had enlarged across the whole band — the captured
   strip measures `rgb(245,248,247)` above *and* below the rim's row. The opening is now
   framed on the rim's real geometry against a protected region declared once as
   `--signal-sky`, and the same strip measures `rgb(19,29,48)` below the crest.
3. **Clipped limitations.** The three-line clamp is gone. Each reading stop carries the
   limitation's own first sentence and a native `<details>` holding the rest, split from
   the project's text. Nothing was rewritten or shortened.

The recorded "the opening mass inverts" discrepancy is also resolved: the mass sphere sat
on a different plane from the rim it is the limb of, so the lit arc was drawn inside the
silhouette. Both now read their radius, centre and plane from one exported constant.

## Screenshots

[First viewport](desktop-intro.jpg) · [Star forge](desktop-forge.jpg) ·
[Inside the system](desktop-system-read.jpg) · [Light becomes matter](desktop-matter-read.jpg) ·
[A window becomes a World](desktop-world.jpg) · [Everything has a place](desktop-archive.jpg)

Portrait: [first viewport](mobile-intro.jpg) · [reading stop](mobile-matter-read.jpg).
Arabic: [star forge](arabic-desktop-forge.jpg). Reduced motion: [still composition](reduced.jpg).

Forward and reverse pass: [signal-forward-reverse.mp4](signal-forward-reverse.mp4).

## Reproduce

```
npm run build
node scripts/serve-static.mjs dist 4618
python scripts/test-signal.py --base-url http://127.0.0.1:4618
node scripts/verify-portfolio.mjs
```

Open `http://127.0.0.1:4618/en` or `/ar`. This serves the local build; it publishes
nothing.

## Scope

Branch `feature/signal-to-systems`, based on `design/visual-showroom-20260917`. No
deployment, no `main` or `gh-pages` update, no credentials change and no source-asset
mutation was performed. The worktree shares `public/` and `node_modules` with the
existing checkout through junctions; edits are confined to its own source, tests and
documentation.

The close is re-toned through overrides scoped to this route in `src/styles/signal.css`,
which only the landing page imports. `Contact.astro`, the 38 story routes and the
separate cinematic Worlds keep their own art direction and were not modified.
