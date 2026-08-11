# Cake Studio World 09 — Cinematic Bookends

Date: 2026-08-11
Source branch: `feature/cake-studio-v15`
Release: `v1.6.0` / visible badge `v1.6 · WORLD 09`

## Why this pass exists

The 50-shot film was the quality anchor, but the surrounding page delayed it behind nearly five
introductory screens and followed it with roughly twelve screens of live 3D, operational UI and
technical credits. The result changed visual language at both edges of the strongest material.

The v1.6 rule is: **enter the film quickly, preserve its photographic language through the final
frame, and let one closing thought end the story**.

## Direction applied

- A 190vh title beat replaces the former ident, cold open and explanatory prelude.
- All 50 accepted core clips remain present, in order and reversible.
- A 230vh photographic outro replaces the active proof-room coda and technical credits.
- The intro joins the exact decoded first frame of `CST-001`; the outro starts on the exact decoded
  last frame of `CST-050`. Source PNG similarity is not treated as seam proof.
- The closing hero carries one short bilingual thought and two live actions: project story and back
  to worlds.
- The previous coda and credits are preserved as inert templates. Their GLBs and authored source
  remain in the repository but are not requested by the active page.
- No new 3D generation was used. The approved photographic frames were the strongest source.

## Implementation

- `scripts/build-cake-studio-bookends.mjs` extracts decoded seam endpoints and creates two silent,
  six-second, 1280×720 H.264 scroll plates with dense keyframes and held joins.
- `public/worlds/cinema.js` supports explicit bookend motion during reduced-motion preference and
  paints each decoded seek into a deterministic canvas.
- `public/worlds/cake-studio.js` initializes the first core clip on a decoded frame instead of a
  stale poster.
- `scripts/verify-cake-studio-bookends.mjs` validates the source structure, media and decoded seams.
- `scripts/verify-cake-studio-bookends-browser.py` validates rendered pixels, transport, reverse
  scroll, bilingual behavior and accessible closing actions on desktop and phone.

## Local proof

- Structural/media gate: **39/39 GREEN**.
- Live-browser gate: **81 checks GREEN** at 1440×1000 and 390×844 with reduced motion enabled.
- Deliberate browser sabotage: **RED as required**.
- Intro endpoint → shot 01: SSIM `0.995626`.
- Shot 50 → outro endpoint: SSIM `0.993276`.
- Rendered outro canvas → decoded hero reference: zero raw and edge mismatch on desktop and phone.
- Runtime: zero `play()` calls, zero active legacy coda nodes, zero Three.js/GLB requests, zero
  console errors, page errors or failed requests.

Evidence directory:
`C:\Users\GAMING\Documents\Codex\2026-08-11\cake-studio-v16-local-final`

Reproduce locally:

```sh
npm run build:cake-studio:bookends
npm run verify:cake-studio
python scripts/verify-cake-studio-bookends-browser.py --url http://127.0.0.1:4701/worlds/cake-studio.html
npm run build
npm run build:ghpages
```

## Publication

- Source commit: `34cd53e`.
- Main merge: PR `#4`, commit `40ac8c9`.
- Pages tree: `ba10b17`; Pages build `31463600293` completed successfully.
- Public browser gate: **81 checks GREEN** at desktop and reduced-motion phone viewports.
- Public evidence:
  `C:\Users\GAMING\Documents\Codex\2026-08-11\cake-studio-v16-public`.
- Live URL: <https://mohamed3042.github.io/flagship-portfolio/worlds/cake-studio.html>
