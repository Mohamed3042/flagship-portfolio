# Round 04 — the director's decisions on `b1bdd94`

Direction: `DIRECTOR / Round 03 — decisions for b1bdd94` in
[PR #32](https://github.com/Mohamed3042/flagship-portfolio/pull/32), and the same text in
the owner's handoff folder as `DIRECTOR-DECISIONS-b1bdd94.md`.

Work order as given: keyboard regression and test migration → isolated type repair →
cinematic archive and header seam → portrait recognition, portal framing and phase-correct
labels.

## What is in here

| Path | What it is |
|---|---|
| `after/` | Thirteen poses at 1440×900 and 390×844, EN and AR. The carton and the portal each at both of their stops; the archive arrival is now a beat with a frame of its own. |
| `after/signal-authored-*.mp4` | Frame-stepped forward/reverse. Authored pacing; composition and sequence only. |
| `after/signal-realtime-*.mp4` | Real wheel input, direction changes, voluntary stops, encoded at the frames Chrome presented. |
| `after/realtime-report.json` | Observed cadence **and** every gap over 100 ms matched against the input timeline. |
| `after/capture-report.json` | Per-pose scene state, plate rectangle and `data-fit`. |

## On the cadence numbers

The observed rates are **CDP screencast-frame cadence in that headless Chromium session**.
They are not display refresh, GPU throughput, input latency or phone frame rate, and no
physical device or Safari was involved.

Round 03 said the long gaps were the scripted holds. That was not fully true and the
correlation is now in the report: **13 of 16 fall inside a hold** — where the page is not
scrolling and a browser presents no frames because nothing changed — but **3 fall during
active input**, 108–268 ms each, clustered where stage textures decode. Those are real
hitches, recorded as such.

## Registration

`data-fit="exact"` holds at every stop, and the suite asserts it. A separate pixel-level
check compares two renders of the same frame, one with the HTML image suppressed: it
confirms the image paints the whole rectangle it is placed at. The tighter claim — that
nothing outside that rectangle changes — is **recorded and not asserted**, because the
observed changed region is consistently larger than the plate and I have not established
whether that is a second draw or frame-to-frame noise. The measured corners are in
`.impeccable/review/round04/signal-report.json` under `registration_px`.

## Native boards

Received and verified this round. `signal-round02-full-resolution-boards.zip`,
8,322,902 bytes, SHA-256 `9c31a1bb…1244bd`, extracted to the director folder outside this
repository. All eleven files match the archive's own `SHA256SUMS.txt`; three of the four
boards also match the Round 02 asset manifest byte-for-byte. Paths are acknowledged in the
PR reply.
