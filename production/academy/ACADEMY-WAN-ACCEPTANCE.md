# Academy WAN return acceptance

Status: **VERIFIED — 14 ACCEPTED / 2 HOLD**
Audit date: 2026-08-21

All 16 owner-supplied returns were measured at 5.062 seconds, 1274×722, H.264, 30fps, with an audio track present. Every take was decoded at one frame per second across its full duration before the editorial decision.

| ID | Verdict | Decoded-frame finding |
|---|---|---|
| ACA-001 | ACCEPTED | Repaired rear three-quarter owl recedes to the lit gate and finishes tiny over the stairs. |
| ACA-002 | HOLD | Rejected frontal owl flies at camera, then morph-cuts into the stairwell. |
| ACA-003 | ACCEPTED | Clean camera/environment move from stair shaft to library landing. |
| ACA-004 | ACCEPTED | Continuous reveal from ten library lights to open grimoire and quill. |
| ACA-005 | ACCEPTED | Ink lifts as gold motes and resolves on the sorting mirror. |
| ACA-006 | ACCEPTED | Light motif leaves the mirror and resolves on exactly six portraits; intermediate thread count is not claimed as exact. |
| ACA-007 | ACCEPTED | Six-frame corridor lands cleanly in the potion chamber. |
| ACA-008 | ACCEPTED | Crimson ring forms and the miniature fractures under one coherent wand hand. |
| ACA-009 | ACCEPTED | Debris reassembles, the tower lifts, and the ring closes green-gold. |
| ACA-010 | ACCEPTED | One current carries the camera from the proven miniature to ten lights. |
| ACA-011 | ACCEPTED | Ten lights remain through the push; the endpoint contains expected owl-post traffic. |
| ACA-012 | ACCEPTED | Owl exits left and the camera completes the move on the restricted lantern. |
| ACA-013 | ACCEPTED | Lantern composition yields to a blank ruled ledger and one plain line. |
| ACA-014 | ACCEPTED | Ledger dissolves through a restrained star field into the telescope platform. |
| ACA-015 | ACCEPTED | Brass lens advances and reveals owl plus sealed letter for the loop handoff. |
| ACA-016 | HOLD | Frontal owl grows toward camera throughout, contradicting the repaired rear-facing opening. |

## Editorial cut

**[INFERRED]** ACA-001 cuts directly to ACA-003, so the repaired gate endpoint hands off to the clean stair-shaft move without ACA-002. ACA-015 cuts directly into ACA-001 as a lens-crossing match cut, so ACA-016 cannot reverse the repaired travel direction.

The two held source files remain preserved in `wan-returns`; neither is copied into the public film. Machine-readable hashes and reasons live in `wan-acceptance.json`.

## Web delivery gate

Accepted clips are normalized to silent H.264, 1280×720, 30fps, yuv420p, GOP15, faststart. The fixed provider mark is removed from the measured 52×46 corner region before scaling. The common-bright set gate must fail on untouched controls and pass on the shipped files.
