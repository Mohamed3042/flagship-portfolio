# Round 02 — the director's pass, implemented

Source of the direction: `docs/design-direction/signal-round-02/DIRECTOR_HANDOFF.md` on
`design/signal-director-pack-20260918`, discussed in
[PR #32](https://github.com/Mohamed3042/flagship-portfolio/pull/32).

Everything in this folder was produced by `scripts/capture-signal-round02.py` and
`scripts/measure-signal-round02.py` against a served production build of the tree
described in the reply on that PR. Nothing here is carried over from an earlier round.

## What is in here

| Path | What it is |
|---|---|
| `before/` | The eight poses plus the seam, captured from the build as it stood before this pass. |
| `after/` | The same poses from the build after it, at the same viewports, in the same order. |
| `after/signal-round02-desktop.mp4` | A normal-paced forward and reverse pass at 1440×900, 56.5 s. |
| `after/signal-round02-portrait.mp4` | The same at 390×844, 51.9 s. |
| `after/capture-report.json` | Per-pose scene state: progress, live chapter, tier, plate rect. |
| `measured.json` | Pixel and computed-style readings behind the claims in the reply. |

## How the stills are comparable

The harness injects a shim that hands the renderer one frozen timestamp, so ambient
motion stops while a pose is captured. Two runs of the same pose therefore differ only
where the composition differs. The shim lives in the capture script and changes no
product code; scroll progress is still read from `scrollY`, not from the clock.

## How the recording is paced

The recording is frame-stepped, not screen-recorded. One virtual clock drives both the
scroll position and the renderer's ambient time, a frame is taken at each step, and
ffmpeg encodes the sequence at the same rate. The result is the pace it claims to be on
any machine — a real-time capture of a headless browser is a recording of how fast that
machine happened to be that minute. Both files run the full path forward and then in
reverse, through the true entry, every reading stop, and out into the real project rows.

## Conditions

Chromium 1440×900 and 390×844 at device pixel ratio 1, English and Arabic, on one
Windows 11 machine, against `node scripts/serve-static.mjs dist 4618`. Portrait uses
Playwright's mobile emulation. **No physical phone was tested**, so no claim is made
about Safari, real touch scrolling, thermals or battery.
