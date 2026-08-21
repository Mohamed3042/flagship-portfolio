# WAN Side A Return Audit

Date: 2026-08-21  
Scope: seven Side A plate/poster replacements only

## Decision

- **VERIFIED:** 8 WAN returns were received and hash-bound into production custody.
- **VERIFIED:** 7 returns were accepted for A01-A07.
- **VERIFIED:** The first A04 return (raw index 3) was rejected because its waveform detaches from the monitor plane.
- **VERIFIED:** The A04 retake (raw index 7) was selected because the waveform remains contained inside the monitor glass.
- **[INFERRED]:** 80 credits used: 8 observed output files multiplied by the locked 10-credit rate. Provider billing was not queried.

## Normalization Gate

The raw gate failed before normalization: all eight returns exposed AAC tracks, reported 5.062-second container duration, and shared a bright WAN mark in the bottom band.

The normalized gate passes for every accepted clip:

- H.264 / yuv420p
- 1280 x 660 after one identical 60-pixel bottom crop
- 30 fps, 150 frames, exactly 5.000 seconds
- no audio stream
- fast-start metadata and 12-frame GOP
- exact frame-zero anchor, conditioned landing, and final 15-frame destination hold

## Accepted Mapping

| Shot | Selected raw index | Runtime plate |
|---|---:|---|
| A01 First Light | 0 | `spotify/live/room01-silence-recut.mp4` |
| A02 Contact | 1 | `spotify/live/room02-contact-recut.mp4` |
| A03 The Sundial | 2 | `spotify/live/room03-runway-recut.mp4` |
| A04 The Aligned Desk | 7 | `spotify/live/room04-build-recut.mp4` |
| A05 The Passing Car | 4 | `spotify/live/room05-lounge-recut.mp4` |
| A06 The Synchronized Room | 5 | `spotify/live/room06-chorus-recut.mp4` |
| A07 Needle Up | 6 | `spotify/live/room07-needle-up-recut.mp4` |

## Preservation

- **VERIFIED:** The original seven runtime plates and posters were copied byte-for-byte into `public/worlds/spotify/archive/side-a-pre-recut-20260821/`.
- **VERIFIED:** The source page changes exactly seven `data-plate` and `data-plate-poster` pairs; no copy, FLIP, Side B, caption, finale, CSS, or JavaScript source was edited.
- **VERIFIED:** Grok is not part of this run because no Grok returns were supplied.

Machine-readable evidence: `production/spotify-side-a-recut/wan-returns/WAN-RECUT-RUN-MANIFEST.json`.
