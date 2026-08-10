# Cake Studio World 09 — Dimensional Coda

Date: 2026-08-10
Source branch: `feature/cake-studio-world`
Release: `v1.2.0` / visible badge `v1.2 · WORLD 09`

## Why this pass exists

The v1.1 director pass fixed the film's argument and pacing, but the final live-code scenes changed
visual language too abruptly. Cinematic patisserie footage fell into circles, lines and flat boxes.
The explanation was correct; the direction was not.

The v1.2 rule is simple: **continue the last physical object, then let that object explain the
software**. The final edible sheet is held at the exact accepted endpoint, a rose-gold optical seam
opens through it, and the same black-marble world continues as one procedural Three.js stage.

## Direction applied

- One dominant object proposition per act, with the camera and material state carrying the idea.
- The nine-form library is a real field of cake silhouettes and pastry materials, not nine icons.
- The controlled-design act keeps one measured cake body while seventeen glass data wafers and
  four physical parts separate and lock back into place.
- The handoff resolves into three recognizable objects: customer vitrine, curled baker sheet and
  true-size plaque.
- The generated 16:9 endpoint remains fully painted until the live dimensional surface is ready;
  outgoing and incoming scenes share subject, size and screen position.
- Copy remains live, bilingual and below the object stage. No generated UI, connector lines,
  autoplay or paid motion service is used.

The visual reasoning adapts the owner's Fable direction notes and the supplied motion references:
macro hero objects, exploded/assembled material states, type as stage architecture and scroll as a
deterministic playhead. It does not copy their implementations or depend on their services.

## Implementation

- `public/worlds/cake-studio-coda.js` renders the three acts with locally vendored Three.js r169.
- `public/worlds/cake-studio/three.module.js` and `THREE-LICENSE.txt` keep the runtime offline and
  licensed.
- `public/worlds/cake-studio.css` replaces the former schematic vocabulary with one 920vh pinned
  dimensional coda (840vh on phone).
- `public/worlds/cake-studio.js` now seeks the first film state immediately after metadata arrives,
  preventing a stale eased fraction on initial load.
- `CST-A-050-V2-OPTICAL-BRIDGE.txt` is a copy-ready WAN 2.7 First/Last Frame candidate. It does not
  replace the accepted shot until endpoint review passes.
- A graceful text fallback preserves the complete production argument when WebGL is unavailable.

## Proof

- Structural/media source gate: **40/40 GREEN**.
- Live browser source gate: **159/159 GREEN** at 1440×1000 and 390×844.
- Public GitHub Pages gate: **159/159 GREEN** against the deployed URL at the same two viewports.
- Verified: 50 film shots, exact 2.5-second seeks, reverse scrub, zero `play()` attempts, one active
  video buffer, WebGL 2 render, real pixel variance across nine sample zones, 9/4/3 object contract,
  endpoint bridge, Arabic parity, zero overflow, zero console errors and zero network failures.
- Static sabotage deliberately corrupts the last clip, flattens the decisive hold and removes the
  canvas contract: **RED, 4/40 failed**.
- Browser sabotage displaces the film, removes its reason, hides the WebGL stage and deletes one
  handoff object: **RED, 17/81 failed**.

## Evidence

- [Desktop film-to-object contact sheet](assets/cake-studio-dimensional-coda/desktop-coda-contact-sheet.png)
- [Phone film-to-object contact sheet](assets/cake-studio-dimensional-coda/phone-coda-contact-sheet.png)
- [Built-output browser verification](assets/cake-studio-dimensional-coda/dist-browser-verification.json)
- [Live GitHub Pages browser verification](assets/cake-studio-dimensional-coda/live-browser-verification.json)
- [Browser sabotage report](assets/cake-studio-dimensional-coda/browser-sabotage.json)

## Publication

- Feature source: `058ed52` on `feature/cake-studio-world`.
- Pages tree: `7fd9d97` on `gh-pages`; Pages build `31385136693` completed successfully.
- Live world: <https://mohamed3042.github.io/flagship-portfolio/worlds/cake-studio.html>
- The complete authoring archive remains on the feature branch. The 576 MB Pages tree carries all
  50 optimized world clips, all 51 WAN prompt files, the linked KF01 bridge and the runtime; only
  duplicated accepted masters, review sheets and unused keyframes are source-only.

Reproduce locally:

```sh
npm run verify:cake-studio
npm run verify:cake-studio:browser -- --url http://127.0.0.1:4617/worlds/cake-studio.html
npm run build
npm run build:ghpages
```

The permanent directing methodology is in
[`public/worlds/CAKE-STUDIO-DIRECTORS-CUT.md`](../public/worlds/CAKE-STUDIO-DIRECTORS-CUT.md).
