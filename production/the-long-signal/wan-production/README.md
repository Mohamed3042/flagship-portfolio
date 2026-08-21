# THE LONG SIGNAL — WAN 2.7 owner generation pack

Open `WAN-GENERATION-BOARD.html` and generate `SIG-001` through `SIG-040` in order.

The board is offline and owner-operated. It stores status, task IDs, seeds, attempts, and notes in browser `localStorage`; it has no WAN API, submission form, network endpoint, or credit-spending action.

## Locked settings

| Setting | Value |
|---|---|
| Model | WAN 2.7 |
| Mode | First + Last Frame |
| Resolution | 720P |
| Duration | 5 seconds |
| Outputs | 1 |
| `prompt_extend` | OFF |
| Audio | OFF |

Use both supplied endpoint PNGs exactly. Clip `SIG-NNN` starts on `KFNN` and ends on the next keyframe. `SIG-040` starts on `KF40` and ends on `KF01` to close the loop.

The fixed seed families are DUST `101101`, CROSSING `202202`, WORLDS `303303`, LATTICE `404404`, and RETURN `505505`. Paste the board's shared negative prompt into WAN's negative field for every job.

## Credit boundary

- Zero-retake target: 400 credits.
- Planned budget: 600 credits.
- Stop and report if projected spend exceeds 660 credits.
- The board currently spends and has spent 0 credits.

Change one variable per retry: remove secondary action → reduce amplitude → state direction and speed more plainly → simplify light → rewind to the last clean clip → only then use a nearby seed.

## Download and return

Download every result immediately. Save the untouched WAN download as the exact filename shown on its card: `SIG-001.mp4` through `SIG-040.mp4`.

Use **Copy manifest CSV** after recording task ID, seed used, attempt count, status, and notes. Return the 40 MP4 files plus that CSV in `THE-LONG-SIGNAL-WAN-RETURNS.zip`. If one ZIP is too large, split it by act without changing any MP4 filename.

## Owner visual accept/reject check

Mark **Done / downloaded** only when:

- the supplied first and last frames are visibly respected;
- the described dominant action progresses at roughly 25%, 50%, and 75%;
- the action settles by 4.5 seconds and the endpoint holds cleanly;
- there is one continuous shot with no cut, dissolve, morph, flicker, warped hand, count change, text, logo, watermark, or letterbox bar;
- it is not a still zoom or camera-only move.

Returned clips still require the production acceptance gate: decoded first/last anchor measurements, three midpoint contact sheets per clip, duration/frame-count checks, and an end-to-end watch before integration.

## Rebuild and verify

```powershell
node production/the-long-signal/wan-production/build-board.mjs
node production/the-long-signal/wan-production/verify-wan-board.mjs
node production/the-long-signal/wan-production/verify-wan-board-browser.cjs
```
