# Academy world proof — 2026-08-21

Rendered proof for `public/worlds/academy.html`. The original sections below describe the local world delivery; the final section records the later deployed phone full-bleed addendum.

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

## Deployed phone full-bleed addendum

Fail-first against the previous deployed cut:

```text
ACADEMY_PHONE_GATE_RED failures=24 checks=143
portrait frame: 390×219.375, object-fit contain, visible mattes
landscape frame: 376.875×211.984, object-fit contain, visible mattes
```

Final public gate:

```text
ACADEMY_PHONE_GATE_GREEN checks=145
390×844 portrait: stage == frame == viewport; cover; zero mattes
844×390 landscape: stage == frame == viewport; cover; zero mattes
14 clips forward + reverse in each profile; monotonic eased camera; four continuous joins
orientation progress preserved and current frame repainted
console=0 page=0 request=0 http=0
ACADEMY_LIVE_RANGE_GREEN — 14/14 clips returned HTTP 206
```

- `phone-addendum-red-before/academy-phone-verification.json` preserves the pre-fix measurement.
- `phone-addendum-green-deployed/academy-phone-verification.json` is the public measurement report.
- `phone-addendum-green-deployed/portrait/` contains the live portrait opening, four act bridges, and ending.
- `phone-addendum-green-deployed/landscape/` contains the live landscape opening, four act bridges, and ending.
- Source commit: `09363fb`; Pages commit: `eb12233`.
- Live URL: <https://mohamed3042.github.io/flagship-portfolio/worlds/academy.html>
