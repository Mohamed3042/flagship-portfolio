# ARCANE WORLD — WAN 2.7 owner generation pack

Open `WAN-GENERATION-BOARD.html` and generate `ARC-001` through `ARC-040` in order.

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

Use both supplied endpoint PNGs exactly. Clip `ARC-NNN` starts on `ARC-KFNN` and ends on the next keyframe. `ARC-040` starts on `ARC-KF40` and ends on `ARC-KF01` to close the loop.

The fixed seed families are UPPER_CITY `173201`, DESCENT `284302`, CORE `395403`, DISTRICTS `416504`, and BRIDGE `527605`. Paste the board's shared negative prompt into WAN's negative field for every job.

## Credit boundary

- Zero-retake target: 400 credits.
- Planned budget: 600 credits.
- Stop and report if projected spend exceeds 660 credits.
- The board currently spends and has spent 0 credits.

Change one variable per retry: remove secondary action → reduce amplitude → state direction and speed more plainly → simplify light → confirm the supplied last frame → rewind to the last clean clip → only then use a nearby seed.

## Download and return

Download every result immediately. Save the untouched WAN download as the exact filename shown on its card: `ARC-001.mp4` through `ARC-040.mp4`.

Use **Copy manifest CSV** after recording task ID, seed used, attempt count, status, and notes. Return the 40 MP4 files plus that CSV in `ARCANE-WORLD-WAN-RETURNS.zip`. If one ZIP is too large, split it by act without changing any MP4 filename.

## Owner visual accept/reject check

Mark **Done / downloaded** only when:

- the supplied first and last frames are visibly respected;
- the described dominant action progresses at roughly 25%, 50%, and 75%;
- the action settles by 4.5 seconds and the endpoint holds cleanly;
- there is one continuous shot with no cut, morph, flicker, warped hand, count change, text, logo, watermark, or letterbox bar;
- the engineer remains faceless and the undercity remains industrious rather than threatening;
- it is not a still zoom or camera-only move.

Returned clips still require the production acceptance gate: decoded first/last anchor measurements, middle frames near 1.2/2.5/3.8 seconds, duration/frame-count checks, and an end-to-end watch before integration.

## Rebuild and verify

```powershell
node production/arcane-world/wan-production/build-board.mjs
node production/arcane-world/wan-production/verify-wan-board.mjs
python C:\Users\GAMING\.codex\skills\webapp-testing\scripts\with_server.py --server "node scripts/serve-static.mjs . 4317" --port 4317 -- python production/arcane-world/wan-production/verify-wan-board-browser.py
```
