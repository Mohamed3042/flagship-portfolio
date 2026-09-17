# Systems in Orbit — implementation review

The English and Arabic homepages now use the approved, denser, project-led composition. This is a source/review branch, not a production deployment. The separate cinematic Worlds and case-study content were retained.

## Implemented

Split-layout hero with real product screenshots and a shared Three.js renderer. The visitor can switch between a structure, folding carton and approval-gate illustration, rotate the object, adjust its mechanism and pause motion. Illustrations are explicitly labelled; none is presented as a live product session or engineering analysis.

Eight screenshot-led featured projects keep their exact summaries, measurements, qualifiers, public/private status and expandable proof/limits. Full-size screenshot inspection and alternate-image selection work with keyboard and touch. The original process sequence is a compact five-step disclosure instead of several screenfuls of slogans.

The directory keeps all 38 stories and adds search, group filters, result counts, no-results recovery, grid/list views, quick previews and explicit show-more batches. Without JavaScript, all 38 remain visible. Mobile navigation supplies the previously missing section links. English/Arabic routes, direction and the existing six-theme system are retained.

## Verified

Both `npm run build` and `npm run build:ghpages` succeeded and generated 80 static routes. The existing static verifier passed for all 38 stories in both languages, canonicals, group membership and private-safe links. The new browser suite passed 121 checks on each build target; the lifecycle suite passed 14 additional checks. These are local results, not GitHub Actions runs.

Chrome was exercised at 1440×900, 390×844, 320px and 768px widths, with English/Arabic, light mode, native reduced motion, explicit static fallback and JavaScript disabled. The tested pages had zero horizontal overflow, zero browser exceptions and zero failing HTTP responses. Physical iPhone/Safari performance and battery behavior were not measured.

## Before / after

| Metric | Prior live desktop | New desktop | Prior live phone | New phone |
|---|---:|---:|---:|---:|
| First featured project title from page top | 3,611 px | 1,326 px | 3,271 px | 1,436 px |
| Page height, with all 38 directory projects shown | 18,752 px | 8,464 px | 22,665 px | 13,384 px |
| Initial page height, new directory shows 12 before Show more | 18,752 px | 6,314 px | 22,665 px | 9,638 px |

The fully expanded comparison is like-for-like on directory project count. The initial-height comparison also reflects progressive disclosure. Measurements are CSS pixels at the viewport sizes above, not a performance benchmark.

## Screenshots and evidence

[Desktop](desktop.jpg) · [Phone](mobile.jpg) · [Featured work](desktop-work.jpg) · [Project directory](desktop-atlas.jpg) · [Arabic phone](arabic-mobile.jpg) · [Packaging exhibit](desktop-box.jpg) · [Automation exhibit](desktop-flow.jpg)

Machine-readable results: [browser-report.json](browser-report.json), [lifecycle-report.json](lifecycle-report.json). Capture hashes and conversion provenance: [provenance.json](provenance.json).

## Reproduce and preview

Use the existing repository dependencies and assets. Run `npm run build:ghpages`, then `node scripts/serve-static.mjs dist 4617`. Open `http://127.0.0.1:4617/flagship-portfolio/en` or the corresponding `/ar` route. This serves the local build; it does not publish anything.

Run the primary regression suite with `python scripts/test-showroom.py --base-url http://127.0.0.1:4617/flagship-portfolio --round ghpages`. For the root-path lifecycle suite, build with `npm run build`, then run `python scripts/test-showroom-lifecycle.py`. Existing static verification is `node scripts/verify-portfolio.mjs` against the root build.

## Scope and handoff

Source branch: `design/visual-showroom-20260917`, based on `d06fb4a`. No main/gh-pages branch update, deployment, Actions workflow, credentials change or source-asset mutation was performed. The original Spotify working branch was left intact. The local isolated checkout shares read-only-use public assets and dependencies with the existing checkout through junctions; edits are confined to its own source, tests and documentation.

Design rules are recorded in `DESIGN.md` and `.impeccable/design.json`. The Impeccable finishing review and documentation pass were performed in-session, not by independent sub-agents. The Impeccable executable was absent at the documented fallback path, so no CLI detector result is claimed. Native browser testing supplied the technical evidence.

Existing ambient-background and theme-animation behavior remains outside the new renderer's pause/reduced-motion scope. No real audio comparison was added without approved samples, and no fabricated project screens were generated. The three new mechanisms are illustrations, not replicas of a production session.
