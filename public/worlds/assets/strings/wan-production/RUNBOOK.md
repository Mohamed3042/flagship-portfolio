# CUT THE STRINGS — WAN 2.7 owner runbook

## Locked procedure

1. Open `WAN-GENERATION-BOARD.html`.
2. In WAN 2.7 First & Last Frame mode, upload the card's FIRST still and LAST still.
3. Lock 720P / 1280x720 / 16:9, 5 seconds, audio off, prompt extension off, one output, and the listed seed.
4. Copy the shared negative prompt and the card's exact prompt without rewriting either.
5. Generate one output. Download an accepted candidate immediately using the exact card filename.
6. Record the provider task ID, real credits and status in `run-log.csv`; tick Done only after the file is saved.
7. Change only one variable per retake. Stop and report before projected spend exceeds 660 credits.

The board never submits jobs. Done means owner-generated and locally saved, not editorially accepted.

## Mapping

| Clip | Pair | First frame | Last frame | Output | Seed |
|---|---|---|---|---|---:|
| CTS-A-001 | KF01 -> KF02 | `../keyframes/CTS-KF01-the-crate.png` | `../keyframes/CTS-KF02-borrowed-marionette.png` | `accepted/CTS-A-001.mp4` | 271101 |
| CTS-A-002 | KF02 -> KF03 | `../keyframes/CTS-KF02-borrowed-marionette.png` | `../keyframes/CTS-KF03-the-tangle.png` | `accepted/CTS-A-002.mp4` | 271101 |
| CTS-A-003 | KF03 -> KF04 | `../keyframes/CTS-KF03-the-tangle.png` | `../keyframes/CTS-KF04-t-pose-freeze.png` | `accepted/CTS-A-003.mp4` | 271101 |
| CTS-A-004 | KF04 -> KF05 | `../keyframes/CTS-KF04-t-pose-freeze.png` | `../keyframes/CTS-KF05-grey-drain.png` | `accepted/CTS-A-004.mp4` | 271101 |
| CTS-A-005 | KF05 -> KF06 | `../keyframes/CTS-KF05-grey-drain.png` | `../keyframes/CTS-KF06-painted-eye.png` | `accepted/CTS-A-005.mp4` | 271101 |
| CTS-A-006 | KF06 -> KF07 | `../keyframes/CTS-KF06-painted-eye.png` | `../keyframes/CTS-KF07-drawer-of-failures.png` | `accepted/CTS-A-006.mp4` | 271101 |
| CTS-A-007 | KF07 -> KF08 | `../keyframes/CTS-KF07-drawer-of-failures.png` | `../keyframes/CTS-KF08-the-vow.png` | `accepted/CTS-A-007.mp4` | 271101 |
| CTS-A-008 | KF08 -> KF09 | `../keyframes/CTS-KF08-the-vow.png` | `../keyframes/CTS-KF09-first-cut.png` | `accepted/CTS-A-008.mp4` | 271101 |
| CTS-A-009 | KF09 -> KF10 | `../keyframes/CTS-KF09-first-cut.png` | `../keyframes/CTS-KF10-the-photograph.png` | `accepted/CTS-A-009.mp4` | 271101 |
| CTS-A-010 | KF10 -> KF11 | `../keyframes/CTS-KF10-the-photograph.png` | `../keyframes/CTS-KF11-skin-laid.png` | `accepted/CTS-A-010.mp4` | 271101 |
| CTS-A-011 | KF11 -> KF12 | `../keyframes/CTS-KF11-skin-laid.png` | `../keyframes/CTS-KF12-two-swatches.png` | `accepted/CTS-A-011.mp4` | 271101 |
| CTS-A-012 | KF12 -> KF13 | `../keyframes/CTS-KF12-two-swatches.png` | `../keyframes/CTS-KF13-neck-seam.png` | `accepted/CTS-A-012.mp4` | 271101 |
| CTS-A-013 | KF13 -> KF14 | `../keyframes/CTS-KF13-neck-seam.png` | `../keyframes/CTS-KF14-glass-eyes.png` | `accepted/CTS-A-013.mp4` | 271101 |
| CTS-A-014 | KF14 -> KF15 | `../keyframes/CTS-KF14-glass-eyes.png` | `../keyframes/CTS-KF15-the-groom.png` | `accepted/CTS-A-014.mp4` | 271101 |
| CTS-A-015 | KF15 -> KF16 | `../keyframes/CTS-KF15-the-groom.png` | `../keyframes/CTS-KF16-cloth-from-photo.png` | `accepted/CTS-A-015.mp4` | 271101 |
| CTS-A-016 | KF16 -> KF17 | `../keyframes/CTS-KF16-cloth-from-photo.png` | `../keyframes/CTS-KF17-the-fitting.png` | `accepted/CTS-A-016.mp4` | 271101 |
| CTS-A-017 | KF17 -> KF18 | `../keyframes/CTS-KF17-the-fitting.png` | `../keyframes/CTS-KF18-wardrobe-rail.png` | `accepted/CTS-A-017.mp4` | 271101 |
| CTS-A-018 | KF18 -> KF19 | `../keyframes/CTS-KF18-wardrobe-rail.png` | `../keyframes/CTS-KF19-the-stringing.png` | `accepted/CTS-A-018.mp4` | 271101 |
| CTS-A-019 | KF19 -> KF20 | `../keyframes/CTS-KF19-the-stringing.png` | `../keyframes/CTS-KF20-first-motion.png` | `accepted/CTS-A-019.mp4` | 271101 |
| CTS-A-020 | KF20 -> KF21 | `../keyframes/CTS-KF20-first-motion.png` | `../keyframes/CTS-KF21-the-breath.png` | `accepted/CTS-A-020.mp4` | 271101 |
| CTS-A-021 | KF21 -> KF22 | `../keyframes/CTS-KF21-the-breath.png` | `../keyframes/CTS-KF22-the-cut.png` | `accepted/CTS-A-021.mp4` | 271101 |
| CTS-A-022 | KF22 -> KF23 | `../keyframes/CTS-KF22-the-cut.png` | `../keyframes/CTS-KF23-first-step.png` | `accepted/CTS-A-022.mp4` | 271101 |
| CTS-A-023 | KF23 -> KF24 | `../keyframes/CTS-KF23-first-step.png` | `../keyframes/CTS-KF24-bench-becomes-road.png` | `accepted/CTS-A-023.mp4` | 271101 |
| CTS-A-024 | KF24 -> KF25 | `../keyframes/CTS-KF24-bench-becomes-road.png` | `../keyframes/CTS-KF25-four-doors.png` | `accepted/CTS-A-024.mp4` | 271102 |
| CTS-A-025 | KF25 -> KF26 | `../keyframes/CTS-KF25-four-doors.png` | `../keyframes/CTS-KF26-marble-hall.png` | `accepted/CTS-A-025.mp4` | 271102 |
| CTS-A-026 | KF26 -> KF27 | `../keyframes/CTS-KF26-marble-hall.png` | `../keyframes/CTS-KF27-hardest-light.png` | `accepted/CTS-A-026.mp4` | 271103 |
| CTS-A-027 | KF27 -> KF28 | `../keyframes/CTS-KF27-hardest-light.png` | `../keyframes/CTS-KF28-sky-islands.png` | `accepted/CTS-A-027.mp4` | 271103 |
| CTS-A-028 | KF28 -> KF29 | `../keyframes/CTS-KF28-sky-islands.png` | `../keyframes/CTS-KF29-arena-holds.png` | `accepted/CTS-A-028.mp4` | 271104 |
| CTS-A-029 | KF29 -> KF30 | `../keyframes/CTS-KF29-arena-holds.png` | `../keyframes/CTS-KF30-low-poly-island.png` | `accepted/CTS-A-029.mp4` | 271104 |
| CTS-A-030 | KF30 -> KF31 | `../keyframes/CTS-KF30-low-poly-island.png` | `../keyframes/CTS-KF31-same-face.png` | `accepted/CTS-A-030.mp4` | 271105 |
| CTS-A-031 | KF31 -> KF32 | `../keyframes/CTS-KF31-same-face.png` | `../keyframes/CTS-KF32-artillery-hill.png` | `accepted/CTS-A-031.mp4` | 271105 |
| CTS-A-032 | KF32 -> KF33 | `../keyframes/CTS-KF32-artillery-hill.png` | `../keyframes/CTS-KF33-return-walk.png` | `accepted/CTS-A-032.mp4` | 271106 |
| CTS-A-033 | KF33 -> KF34 | `../keyframes/CTS-KF33-return-walk.png` | `../keyframes/CTS-KF34-the-shelf.png` | `accepted/CTS-A-033.mp4` | 271102 |
| CTS-A-034 | KF34 -> KF35 | `../keyframes/CTS-KF34-the-shelf.png` | `../keyframes/CTS-KF35-severed-coil.png` | `accepted/CTS-A-034.mp4` | 271101 |
| CTS-A-035 | KF35 -> KF36 | `../keyframes/CTS-KF35-severed-coil.png` | `../keyframes/CTS-KF36-the-ledger.png` | `accepted/CTS-A-035.mp4` | 271101 |
| CTS-A-036 | KF36 -> KF37 | `../keyframes/CTS-KF36-the-ledger.png` | `../keyframes/CTS-KF37-empty-page.png` | `accepted/CTS-A-036.mp4` | 271101 |
| CTS-A-037 | KF37 -> KF38 | `../keyframes/CTS-KF37-empty-page.png` | `../keyframes/CTS-KF38-workshop-wide.png` | `accepted/CTS-A-037.mp4` | 271101 |
| CTS-A-038 | KF38 -> KF39 | `../keyframes/CTS-KF38-workshop-wide.png` | `../keyframes/CTS-KF39-crate-outbound.png` | `accepted/CTS-A-038.mp4` | 271101 |
| CTS-A-039 | KF39 -> KF40 | `../keyframes/CTS-KF39-crate-outbound.png` | `../keyframes/CTS-KF40-last-light.png` | `accepted/CTS-A-039.mp4` | 271101 |
| CTS-A-040 | KF40 -> KF01 | `../keyframes/CTS-KF40-last-light.png` | `../keyframes/CTS-KF01-the-crate.png` | `accepted/CTS-A-040.mp4` | 271101 |
