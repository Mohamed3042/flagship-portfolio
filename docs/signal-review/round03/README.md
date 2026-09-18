# Round 03 — the director's corrections to `03e164c`

Direction: `DIRECTOR / Round 02 — response to 03e164c` in
[PR #32](https://github.com/Mohamed3042/flagship-portfolio/pull/32), and the same text in
the owner's handoff folder as `DIRECTOR-DECISIONS-03e164c.md`.

Everything here was produced against a served production build of the commit named in the
PR reply. Nothing is carried over from Round 02; the Round 02 set stays in `../round02/`
as the comparison.

## What is in here

| Path | What it is |
|---|---|
| `after/` | Twelve poses — the carton and the portal each captured at BOTH of their stops — at 1440×900 and 390×844, EN and AR. |
| `after/signal-authored-*.mp4` | The frame-stepped forward/reverse pass. Authored pacing; it proves composition and sequence, and nothing about runtime. |
| `after/signal-realtime-*.mp4` | **A real-time pass**, driven by mouse-wheel input with direction changes and voluntary stops, encoded at the timestamps Chrome presented each frame. |
| `after/realtime-report.json` | Observed cadence from that session: frames presented, median and p95 inter-frame gap, longest gap, gaps over 100 ms. |
| `after/capture-report.json` | Per-pose scene state: progress, live chapter, tier, plate rectangle, `data-fit`. |
| `after/theme-*-*.png` | The seam below the cinema in light and dark. |
| `measured.json` (round02) | Still current for the token and contrast measurements it records. |

## Why two chapters are captured twice

The carton has an interval that is **only** the object — no screenshot exists on screen
at all — and a later stop where the capture is the subject and the object has left. One
frame cannot show whether those two were ever confused with each other, which is the
whole question the director asked about that chapter. The portal is captured on approach,
where the near pilasters occlude the room and slide across it, and again inside.

## The two recordings are different claims

The **authored** pass steps one virtual clock for scroll and ambient time and encodes at
that rate. It shows what the sequence is. It says nothing about frame rate.

The **real-time** pass scrolls with `mouse.wheel`, lets the browser render at whatever
rate it manages, and encodes the frames Chrome actually presented at the times it
presented them. Its cadence numbers are in `realtime-report.json`.

Read the gaps carefully: the script contains deliberate holds where the page is not
scrolling, and a browser presents no frames when nothing changes — so a gap during a
hold is a still page, not a stall. The number worth reading is the median and p95 gap
during motion.

**Not measured, in either file:** GPU frame time, input latency, physical touch
scrolling, Safari, or any real device. Headless Chromium, one Windows machine.

## Conditions

Chromium via local Chrome, device pixel ratio 1, viewports 1440×900 and 390×844, English
and Arabic, against `node scripts/serve-static.mjs dist 4618`. Portrait uses Playwright's
mobile emulation. Stills freeze the renderer's ambient clock so two runs of a pose differ
only where the composition differs.
