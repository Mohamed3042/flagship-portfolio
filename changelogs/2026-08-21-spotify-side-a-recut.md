# THE ALBUM — Side A Recut

Date: 2026-08-21  
Source branch: `feature/spotify-side-a-recut`

## Shipped decision

- **VERIFIED:** Seven WAN 2.7 First & Last Frame takes replace the seven retired Side A room plates at the existing Spotify URL.
- **VERIFIED:** Eight WAN outputs were received. The first A04 was rejected because its waveform detached into the room; the A04 retake keeps the effect inside the monitor and is the selected take.
- **VERIFIED:** The page edit is seven source/poster substitutions. Shipped captions, claims, act structure, FLIP, finale, Side B assets, CSS and JavaScript remain unchanged.
- **VERIFIED:** Original room plates and posters have byte-identical archive copies under `public/worlds/spotify/archive/side-a-pre-recut-20260821/`.
- **VERIFIED:** Grok is not included because no Grok returns were supplied.

## Media normalization

The raw intake gate failed before normalization: all eight files carried AAC streams, reported 5.062-second container duration, and shared a bright WAN mark in the bottom band.

All seven accepted masters now pass:

- H.264 / yuv420p, 1280×660, 30 fps
- 150 frames and exactly 5.000 seconds
- silent, fast-start, 12-frame GOP
- one identical 60-pixel bottom crop, measured from the common mark intersection
- exact frame-zero anchor, 9-frame opening/landing conditioning, and final 15-frame destination hold

## Rendered proof

- **VERIFIED:** `npm run build:ghpages` completed: 56 pages built.
- **VERIFIED:** The production build contains all seven media files with source/build SHA-256 equality.
- **VERIFIED:** Every new file serves `206` with `Accept-Ranges: bytes` and scrubs `0.0 → 2.5 → 4.9` seconds in Chrome.
- **VERIFIED:** Desktop 1440×900 and phone 390×844 at DPR 3 both decode all seven plates at 1280×660.
- **VERIFIED:** Side B still selects scrub mode on desktop and its sampled states land on the named leg, caption and frame; phone selects chain mode.
- **VERIFIED:** Phone horizontal overflow is zero and the full `91,156 px` page traverses top-to-bottom and back to the top.
- **VERIFIED:** Arabic and all eight `?solo=N&p=X` checks pass.
- **VERIFIED:** The repository-wide static verifier still reports 56 failures on untouched homepage links and Git-remote disclosure checks; none names Spotify or a recut asset.

Evidence:

- [Desktop rendered contact sheet](assets/spotify-side-a-recut/desktop-recut-contact-sheet.jpg)
- [Phone rendered contact sheet](assets/spotify-side-a-recut/phone-recut-contact-sheet.jpg)
- [Production-build browser measurements](assets/spotify-side-a-recut/dist-browser-verification.json)
- Run manifest: `production/spotify-side-a-recut/wan-returns/WAN-RECUT-RUN-MANIFEST.json`

## Credit reconciliation

- Zero-retake plan: 70 credits.
- Planned 1.50× allowance: 105 credits.
- **[INFERRED]:** 80 credits actually used, calculated from eight observed WAN output files at the locked 10-credit rate. Provider billing was not queried.

## Publication

Live URL: <https://mohamed3042.github.io/flagship-portfolio/worlds/spotify.html>
