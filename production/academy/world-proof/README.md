# Academy world proof — 2026-08-21

Local rendered proof for `public/worlds/academy.html`. No deploy or push is represented here.

## Fail-first media mark gate

Untouched source control (expected RED):

```text
RED — the mark survived: 174 px at (1192, 675, 1214, 699) [5 files, region 140x70+1130+650, frame 60]
```

Shipped derivatives after the measured 82×54 cleanup (expected GREEN):

```text
GREEN — no common-bright cluster (0 px, floor 30) [5 files, region 140x70+1130+650, frame 60]
```

`academy-shipped-midframes-contact.png` is the decoded midpoint inspection of every accepted public derivative.

## Structural and browser gates

```text
ACADEMY_WORLD_GATE_GREEN
16 preserved returns · 14 accepted web clips · 2 held outside the reel
H.264 1280x720 30fps · silent · yuv420p · GOP15 · faststart

ACADEMY_BROWSER_GATE_GREEN
desktop painted ACA-009 @ 2.793s (1280x720, 69.2% painted)
mobile painted ACA-006 @ 2.399s; overflow 0px
proof state proven; Arabic rtl; reduced-motion poster ACA-008
```

Astro production build: 56 pages generated successfully.
