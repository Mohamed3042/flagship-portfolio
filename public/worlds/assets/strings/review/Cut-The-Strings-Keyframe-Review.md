# CUT THE STRINGS — Phase 1 Keyframe Review

Status: **APPROVED BY OWNER — PHASE 2 BOARD UNLOCKED**
Approval phrase: `APPROVE STILLS`
Approval received: **2026-08-21**

The mandatory still-review hard stop passed. The offline owner generation board is unlocked. No WAN video generation, page integration, film edit, or deployment has begun.

## Measured gate

- **VERIFIED** fail-first baseline: `fail-first-qa.json` failed with `0/41` frames and the complete `KF00–KF40` sequence missing.
- **VERIFIED** final gate: `keyframe-qa.json` reports `41/41`, zero errors, exact `1920x1088` RGB PNGs, unique pixel hashes, non-dark center exposure, and non-soft edge measurements.
- **VERIFIED** source inventory: 41 raw generations and 41 normalized review finals.
- **VERIFIED** rejected evidence retained: 13 superseded/crop-failing/dark variants remain under `rejected-v1/`.
- **VERIFIED** WAN/video spend at this gate: zero generated video files (`.mp4`, `.webm`, `.mov`) under the world asset tree.

## Review surfaces

- Landscape master: `CTS-contact-sheet-master.png`
- Landscape detail pages: `CTS-contact-sheet-01.png` through `CTS-contact-sheet-05.png`
- True `390x844` center-cover master: `CTS-contact-sheet-portrait-master.png`
- True `390x844` detail pages: `CTS-contact-sheet-portrait-01.png` through `CTS-contact-sheet-portrait-05.png`

## Hostile visual review

- **VERIFIED** all 41 landscape finals were inspected on the master and five detail sheets.
- **VERIFIED** all 41 real `390x844` center-cover crops were inspected; story-critical subjects remain readable.
- **VERIFIED** KF18 contains exactly eight complete rail outfits, four per side, plus one clearly dressed centered hero; both rail ends survive the phone crop.
- **VERIFIED** KF19 shows five light-string attachment lines for head, wrists, and knees.
- **VERIFIED** KF25 shows exactly four complete world doors.
- **VERIFIED** KF33 shows exactly four distinct forward shadows.
- **VERIFIED** KF38 shows exactly four complete lanterns, ordered white, emerald-teal, gold, amber, in both landscape and phone crop.
- **VERIFIED** KF35 retains one textile severed coil, an empty crate, clean cut ends, and the single straight symbolic shadow line.
- **VERIFIED** KF39 answers KF01 with packed upright figures and an upright group shadow.
- **VERIFIED** no final frame contains a legible caption, watermark, wordmark, or logo by manual visual inspection. Automated OCR was not used.

## Holds resolved before this gate

- Count and crop failures: KF18, KF25, KF33, KF38, KF39, KF40.
- Semantic failures: borrowed-puppet leakage into KF07, incorrect swatch count in KF12, undressed-hero read in KF18, metal-cable read / missing straight shadow in KF35.
- Exposure failures: KF18 and KF38–KF40 failed the unchanged darkness threshold, were relit, and then passed it.

## Approval boundary

Mohamed replied exactly:

`APPROVE STILLS`

The required owner board is now available at `../wan-production/WAN-GENERATION-BOARD.html`. It contains 40 approved first+last-frame pairs and never submits WAN jobs. At this checkpoint: **0 jobs submitted, 0 credits spent, 0 returned videos**. Page integration remains locked until owner-returned clips pass decoded endpoint and mid-clip acceptance review.
