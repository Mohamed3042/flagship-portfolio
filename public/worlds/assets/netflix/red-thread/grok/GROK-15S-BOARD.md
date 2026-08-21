# THE ANTHOLOGY - Red Thread Cut - Grok Imagine 2.0 comparison board

Status: **VERIFIED board only - no Grok or WAN generation has run**

## Locked Grok settings

| Field | Value |
|---|---|
| Product | Grok Imagine 2.0 |
| Surface | `grok.com/imagine` consumer UI |
| Backend model ID | **[LOST]** not exposed by the consumer UI |
| Mode | Image-to-video |
| Input | Matching `NRT-GROK-N##-input-1920x1080.png` |
| Duration | 15 seconds |
| Resolution | 1080p |
| Aspect ratio | 16:9 |
| Audio prompt | No dialogue. No music. Restrained physical ambience only. |
| First pass | One raw generation per shot; no retakes before review |

Mohamed confirmed that his generation surface is **Imagine 2.0**. xAI publicly identifies Imagine Image 2.0 as its new consumer Quality Mode, but its public developer catalog does not currently expose a `grok-imagine-video-2.0` identifier. This board therefore uses the truthful consumer product label and records the underlying video backend as **[LOST]**. The requested run target remains 15-second, 1080p image-to-video; returned duration and dimensions must be measured after every generation.

Official references:

- https://docs.x.ai/developers/model-capabilities/video/generation
- https://x.ai/news/grok-imagine-image-2
- https://docs.x.ai/grok/faq

## The board

| Shot | 0-5 seconds - setup | 5-12 seconds - signature illusion | 12-15 seconds - landing |
|---|---|---|---|
| N01 The Filament | Macro push; filament wakes without breaking its axis. | Upward tilt reveals that the lower line was the glass reflection. | Real filament and reflection stop as one vertical line. |
| N02 The Beam Carves | A horizontal beam begins a matched lateral track. | Hall architecture exists only after the beam passes and stays solid. | Completed hall settles on one centered red aisle. |
| N03 The Archive | Patient dolly follows the shelf edge-light. | Forced perspective reveals the far and near case as one impossible object. | One unlabeled case slides out 20 cm and stops. |
| N04 The Four Doors | Track begins with four complete portals. | Four floor pools fuse only at the exact optical midpoint. | Camera settles squarely on the white-slatted noir portal. |
| N05 Noir into Fog | Push crosses the threshold and reveals an ordinary empty editing desk. | White slats rotate and tighten into the teal fog cone without a cut. | Desk falls into black; camera lands inside the cone. |
| N06 The Gate Freeze | Camera starts a 25-degree orbit around the frozen instant. | Only parallax moves; lamp, fog, and every dust particle stay absolutely frozen. | Cursor pulses once, returns to baseline, camera stops. |
| N07 Evidence Theater | Aisle push enters the beam; the initial blank-frame rail disperses. | Dust reforms as blank apertures while a restrained spectrum blooms. | Dust disperses; spectrum collapses to one red line. |
| N08 The Return | Line holds, then detaches as the final screen contour disappears. | Reflection lengthens while the void consumes all theater geometry. | Line lands on the N01 axis as closely as raw Grok generation permits. |

## Manual run sequence

For each shot:

1. Open Grok Imagine 2.0 on `grok.com/imagine` and choose image-to-video.
2. Upload the matching file from `inputs/`.
3. Set 15 seconds, 1080p, and 16:9.
4. Paste the matching file from `prompts/` without rewriting it.
5. Generate exactly once, download the result immediately, and preserve the raw file using the manifest's `outputName`.
6. Record the request ID, actual dimensions, duration, watermark, and any failure before considering a retake.

Do not remove, cover, or crop away a Grok watermark. The xAI website/app FAQ states that the watermark is required and removing or obscuring it is prohibited.

## Fair comparison protocol

- WAN reference: complete 5-second 720p clip.
- Grok raw: complete 15-second 1080p clip.
- Predeclared Grok comparison window: `00:05.000-00:10.000`; do not cherry-pick another window after viewing the result.
- Normalize both comparison copies to 1280x720, mute audio, and keep raw provider files untouched.
- Grade input fidelity, causal motion, geometry stability, red-thread continuity, centered portrait survival, landing stability, flicker, and unintended cuts.
- N08 receives two grades: raw Grok loop accuracy and a separately labeled conformed loop using the exact N01 endpoint. Never present the conformed version as raw generation.

## Cost boundary

- **[LOST]:** Mohamed's consumer subscription quota and account-specific charging were not inspected.
- **VERIFIED current spend:** Grok $0; WAN 0 credits.

The exact prompts and audit state are stored in `grok-15s-run-manifest.json`. This board does not approve or trigger the gated WAN run.
