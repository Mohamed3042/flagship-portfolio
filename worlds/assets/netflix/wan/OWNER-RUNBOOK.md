# THE ANTHOLOGY — owner-run WAN 2.7 production pack

Status: **READY FOR OWNER GENERATION**
Approval: revised 33-still contact sheet approved by Mohamed on **2026-08-08**
Generation owner: **Mohamed, using his own WAN account**
WAN credits spent by Codex: **0**

This is the single resumable source of truth for the 32 five-second clips. The approved stills are
in [`../keyframes/`](../keyframes/), and the master contact sheet is
[`../review/NFX-contact-sheet-master.png`](../review/NFX-contact-sheet-master.png).

## Locked generation settings

Use these settings for every attempt:

- Model: **WAN 2.7 image-to-video**
- Resolution: **720P / 1280×720 / 16:9**
- Duration: **5 seconds**
- Audio: **off**
- Prompt extension: **false / off**
- One output per attempt
- Download every result immediately; hosted result URLs expire
- Exact base cost: `32 × 10 = 320 credits`
- Planned allowance: **480 credits**
- Absolute owner-approved cap: **500 credits**

Use the supplied seed when the account exposes a seed field. If the provider hides seeds, write
`not exposed` in the run log instead of pretending a seed was applied.

**World style lock — paste exactly as written in every prompt:**

> Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture.

**Shared negative prompt — paste into the negative-prompt field for every clip:**

> blur, watermark, captions, readable text, logos, copied streaming interface, extra limbs, distorted hands, morphing, flicker, unintended cut, full-frame red wash, excessive bloom, generated letterbox bars

Every positive prompt below starts with the literal `Generate single shot.` and ends with
`No dialogue. No background music.` Do not enable automatic prompt rewriting.

## Continuity workflow

1. Clip `NFX-A-001` starts from the approved `NFX-KF01-opening-pulse.png`.
2. After accepting a clip, save it as `accepted/NFX-A-###.mp4` immediately.
3. Prefer the provider's native **Continue / first_clip** mode for the next clip. If unavailable,
   extract the accepted clip's last clean frame and use that PNG as the next first-frame image:

   ```powershell
   .\extract-endframe.ps1 -ClipId NFX-A-001
   ```

4. The six FLF transitions additionally receive the listed approved destination still as the
   **last-frame** image: `A002→KF03`, `A022→KF23`, `A024→KF25`, `A028→KF29`, `A031→KF32`, and
   `A032→KF01`. Do not upload the other storyboard targets as last frames unless the retake ladder
   reaches that step.
5. The target still for every non-FLF clip is a visual QA target, not a replacement for the
   inherited previous end frame.
6. Never overwrite an attempt. Save rejected downloads as
   `rejected/NFX-A-###-attempt-##.mp4`, and record their task IDs and credit cost.

## Seed families

| Family | Seed | Clips |
|---|---:|---|
| Filament / identity loop | `270701` | `001–002`, `030–032` |
| Anchor portals | `270702` | `003–016` |
| Supporting portals | `270703` | `017–022` |
| Build / freeze | `270704` | `023–024` |
| Human gate / resume | `270705` | `025–028` |
| Evidence theater | `270706` | `029` |

## Exact reference and filename map

All keyframe paths below are relative to `../keyframes/`. `A### end` means the last clean frame
from the immediately preceding accepted clip.

| Clip | Storyboard path | First-frame input | Last-frame input | Accepted filename | Seed |
|---|---|---|---|---|---:|
| A001 | KF01 → KF02 | `NFX-KF01-opening-pulse.png` | — | `NFX-A-001.mp4` | 270701 |
| A002 | KF02 → KF03 | A001 end | `NFX-KF03-projector-ignition.png` | `NFX-A-002.mp4` | 270701 |
| A003 | KF03 → KF04 | A002 end | — | `NFX-A-003.mp4` | 270702 |
| A004 | KF04 → KF05 | A003 end | — | `NFX-A-004.mp4` | 270702 |
| A005 | KF05 → KF06 | A004 end | — | `NFX-A-005.mp4` | 270702 |
| A006 | KF06 → KF07 | A005 end | — | `NFX-A-006.mp4` | 270702 |
| A007 | KF07 → KF08 | A006 end | — | `NFX-A-007.mp4` | 270702 |
| A008 | KF08 → KF09 | A007 end | — | `NFX-A-008.mp4` | 270702 |
| A009 | KF09 → KF10 | A008 end | — | `NFX-A-009.mp4` | 270702 |
| A010 | KF10 → KF11 | A009 end | — | `NFX-A-010.mp4` | 270702 |
| A011 | KF11 → KF12 | A010 end | — | `NFX-A-011.mp4` | 270702 |
| A012 | KF12 → KF13 | A011 end | — | `NFX-A-012.mp4` | 270702 |
| A013 | KF13 → KF14 | A012 end | — | `NFX-A-013.mp4` | 270702 |
| A014 | KF14 → KF15 | A013 end | — | `NFX-A-014.mp4` | 270702 |
| A015 | KF15 → KF16 | A014 end | — | `NFX-A-015.mp4` | 270702 |
| A016 | KF16 → KF17 | A015 end | — | `NFX-A-016.mp4` | 270702 |
| A017 | KF17 → KF18 | A016 end | — | `NFX-A-017.mp4` | 270703 |
| A018 | KF18 → KF19 | A017 end | — | `NFX-A-018.mp4` | 270703 |
| A019 | KF19 → KF20 | A018 end | — | `NFX-A-019.mp4` | 270703 |
| A020 | KF20 → KF21 | A019 end | — | `NFX-A-020.mp4` | 270703 |
| A021 | KF21 → KF22 | A020 end | — | `NFX-A-021.mp4` | 270703 |
| A022 | KF22 → KF23 | A021 end | `NFX-KF23-all-portals-assembled.png` | `NFX-A-022.mp4` | 270703 |
| A023 | KF23 → KF24 | A022 end | — | `NFX-A-023.mp4` | 270704 |
| A024 | KF24 → KF25 | A023 end | `NFX-KF25-global-freeze.png` | `NFX-A-024.mp4` | 270704 |
| A025 | KF25 → KF26 | A024 end | — | `NFX-A-025.mp4` | 270705 |
| A026 | KF26 → KF27 | A025 end | — | `NFX-A-026.mp4` | 270705 |
| A027 | KF27 → KF28 | A026 end | — | `NFX-A-027.mp4` | 270705 |
| A028 | KF28 → KF29 | A027 end | `NFX-KF29-evidence-theater.png` | `NFX-A-028.mp4` | 270705 |
| A029 | KF29 → KF30 | A028 end | — | `NFX-A-029.mp4` | 270706 |
| A030 | KF30 → KF31 | A029 end | — | `NFX-A-030.mp4` | 270701 |
| A031 | KF31 → KF32 | A030 end | `NFX-KF32-final-filament.png` | `NFX-A-031.mp4` | 270701 |
| A032 | KF32 → KF01 | A031 end | `NFX-KF01-opening-pulse.png` | `NFX-A-032.mp4` | 270701 |

## Copy-ready positive prompts

### NFX-A-001 — Dormant filament wakes

```text
Generate single shot. The short dormant red filament extends horizontally in both directions at a constant slow speed until it traces the rigid screen edge. Camera pushes forward 0.6 meters slowly on axis. The extension settles by 4.5 seconds and the completed edge holds perfectly stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-002 — Projector ignition · FLF to KF03

```text
Generate single shot. One projector-white beam ignites from the center of the traced screen edge and brightens the original screening hall by one measured step. Camera pulls backward 1 meter slowly on axis. The beam reaches constant intensity by 4.5 seconds and the readable hall holds perfectly stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-003 — P01 threshold opens

```text
Generate single shot. The central rigid screen plane opens straight backward into one cool-cyan consent threshold while preserving its rectangular geometry. Camera pushes forward 1 meter slowly through the plane on axis. The threshold finishes opening by 4.5 seconds and holds square to camera. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-004 — P01 folios meet the human gate

```text
Generate single shot. Three blank physical folios glide forward together along cool-cyan paper rails and stop before the untouched red release latch. Camera tracks forward 0.5 meters slowly along the rail axis. The folios stop by 4.5 seconds and the human gate remains clearly untouched in a stable composition. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-005 — P01 to P02 shutter handoff

```text
Generate single shot. One rigid projector shutter sweeps from left to right at constant slow speed, replacing the cool-cyan folio set with the enclosed forest-green chamber around one brass local key. Camera slides right 0.7 meters slowly in the same direction. The shutter clears by 4.5 seconds and the key chamber holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-006 — P02 to P04 portal turn

```text
Generate single shot. The same rigid portal plane rotates 180 degrees slowly around its vertical axis to reveal the kraft dieline, folding jig, and raised printer-approval lever on its reverse face. Camera pushes forward 0.5 meters slowly on axis. The rotation settles by 4.5 seconds and the raised lever holds untouched. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-007 — P04 to P05 rising occlusion

```text
Generate single shot. One projector-white occlusion band travels upward at constant slow speed, revealing the true-size cake form inside its physical measurement frame on the trailing side. Camera cranes upward 0.2 meters slowly with a level horizon. The band exits by 4.5 seconds and the measured form holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-008 — P05 to P07 measured slide

```text
Generate single shot. The rigid cake measurement frame slides left at constant slow speed as one physical occluding plane, revealing open archive drawers and the permanent-delete control protected under glass. Camera tracks left 0.7 meters slowly parallel to the frame. The slide settles by 4.5 seconds and the protected control holds clearly visible. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-009 — P07 to P10 shutter reveal

```text
Generate single shot. One vertical projector shutter sweeps right at constant slow speed, revealing harmless simulation pieces contained inside a restrained ember timing ring. Camera slides right 0.6 meters slowly with the shutter. The reveal completes by 4.5 seconds and every piece holds still inside the ring. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-010 — P10 to P11 portal lift

```text
Generate single shot. One rigid black screen plane lifts vertically at constant slow speed, revealing four warm-amber branch paths converging into one transparent operations hub. Camera cranes upward 0.25 meters slowly with a level horizon. The plane clears by 4.5 seconds and the four paths hold cleanly separated before the hub. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-011 — P11 to P12 diagonal wipe

```text
Generate single shot. One narrow projector-white wipe sweeps diagonally from upper left to lower right at constant speed, revealing three manufactured retry rails, empty square evidence cubes, flat checkpoint discs, and one distant amber alert. Camera slides right 0.5 meters slowly. The wipe clears by 4.5 seconds and the rigid geometry holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-012 — P12 to P13 evidence sweep

```text
Generate single shot. The single amber alert sends one rectangular projector-white sweep across the retry rails, revealing a blank source sheet transformed into a grid artifact beside paginated paper. Camera tracks left 0.6 meters slowly. The sweep finishes by 4.5 seconds and both output forms hold front-facing. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-013 — P13 to P23 panel rise

```text
Generate single shot. One rigid silver grid panel rises vertically at constant slow speed, uncovering a steel spaceframe lattice with two visible load paths leading into a fabrication jig. Camera cranes upward 0.3 meters slowly with a level horizon. The panel clears by 4.5 seconds and both load paths hold readable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-014 — P23 to P24 jig slide

```text
Generate single shot. The fabrication jig slides right at constant slow speed as one rigid occluding plane, revealing magenta material swatches converging on one nearly seamless center pair. Camera slides right 0.7 meters slowly parallel to the jig. The move settles by 4.5 seconds and the center pair holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-015 — P24 to P28 center opening

```text
Generate single shot. The nearly seamless center pair separates horizontally in one coordinated slow motion, revealing a crystal provenance wafer, three non-text truth-state rings, and a cyan point-cloud reconstruction. Camera pushes forward 0.5 meters slowly through the opening. The pair stops by 4.5 seconds and the digital reconstruction holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-016 — Anchor portals to support triptych

```text
Generate single shot. One rigid cyan glass panel slides upward at constant slow speed, revealing the three-bay print-craft, custody-chain, and editorial page-fitting triptych behind it. Camera cranes upward 0.25 meters slowly with a level horizon. The panel clears by 4.5 seconds and all three bays hold distinctly separated. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-017 — Supporting triptych one to two

```text
Generate single shot. One projector-white dividing bar sweeps left to right at constant slow speed across the three bays, revealing the green lifecycle and feed ring, coral measured aperture, and violet broadcast-wave triptych on its trailing side. Camera slides right 0.6 meters slowly. The bar clears by 4.5 seconds and the three mechanisms hold distinct. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-018 — Supporting triptych two to three

```text
Generate single shot. The three rigid bay doors rotate downward together by 90 degrees at constant slow speed, revealing CRM trays, content-engine media, and generation-safe desktop identities behind them. Camera pushes forward 0.45 meters slowly on axis. The doors settle by 4.5 seconds and the three new bays hold stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-019 — Supporting triptych three to four

```text
Generate single shot. One horizontal projector shutter descends at constant slow speed, revealing the folio sorter and invitation latch, calibrated blank display, and three harmless tool dies around one manual dial. Camera cranes downward 0.2 meters slowly with a level horizon. The shutter clears by 4.5 seconds and every desktop mechanism holds open and non-medical. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-020 — Supporting triptych four to five

```text
Generate single shot. Three blank rigid panels slide apart laterally in one coordinated slow motion, revealing a three-control workbench, bounded terrain-study die, and blank cartridge rack with deliberately empty art bays. Camera pulls backward 0.5 meters slowly on axis. The panels stop by 4.5 seconds and the open workbench composition holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-021 — Supporting triptych five to six

```text
Generate single shot. One black projector plane sweeps right at constant slow speed, revealing the private restoration, evidence-backed dispatch, and design-study maquette triptych on its trailing side. Camera slides right 0.6 meters slowly with the plane. The sweep clears by 4.5 seconds and all three project bays hold front-facing. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-022 — Thirty portals assemble · FLF to KF23

```text
Generate single shot. Thirty rigid portal planes rise simultaneously from concealed floor slots into exact three-by-five grids on each side of the main screen, exactly fifteen left and fifteen right. Camera pulls backward 1 meter slowly on the center axis. All portals lock into position by 4.5 seconds and the symmetrical hall holds perfectly stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-023 — Freeze reaches center

```text
Generate single shot. One vertical projector-white freeze boundary sweeps from the far left edge to the exact center at constant slow speed, draining the left fifteen portals to monochrome while the right fifteen remain alive. Camera pushes forward 0.2 meters slowly on axis. The boundary stops at center by 4.5 seconds and the half-frozen hall holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-024 — Global freeze and empty seat · FLF to KF25

```text
Generate single shot. The same freeze boundary completes its sweep from center to the far right at constant slow speed, stopping every portal in its exact pose. Camera pushes forward 2 meters slowly down the centered aisle toward the one empty seat and red standby practical. The boundary exits by 4.5 seconds and the strict symmetrical gate composition holds perfectly still. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-025 — Hand approaches the release control

```text
Generate single shot. One anonymous medium-brown right hand in a black cuff enters slowly from the lower right and stops exactly 1 centimeter above the circular release control. Camera pushes forward 0.12 meters slowly toward the control. The hand settles by 4.5 seconds without touching and the poised composition holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-026 — Human release decision

```text
Generate single shot. The same index finger lowers vertically by 1 centimeter at constant slow speed and fully depresses the same circular release control. Camera pushes forward 0.05 meters slowly on axis. The control reaches its stop by 4.5 seconds and the same hand holds the final depressed pose without lifting. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-027 — Motion resumes from the control

```text
Generate single shot. One visible resume boundary travels outward from the depressed control through the exact hall, relighting the frozen portal poses in their original directions while the same hand remains pressed. Camera pulls backward 1 meter slowly on axis. The boundary reaches the far side by 4.5 seconds and the relit hall holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-028 — Reflection handoff to evidence · FLF to KF29

```text
Generate single shot. One projector-white reflection sweep travels forward along the center floor at constant slow speed, exposing the already-built evidence theater with three tungsten lamps above six towers of five shallow proof drawers. Camera pulls backward 1.2 meters slowly on axis. The sweep clears by 4.5 seconds and the exact thirty-drawer theater holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-029 — Evidence light becomes identity pulse

```text
Generate single shot. One controlled light handoff travels from left to right at constant slow speed, extinguishing the three tungsten evidence lamps in sequence and ending as one restrained red identity pulse beneath the blank black screen. Camera pushes forward 0.8 meters slowly on axis. The handoff completes by 4.5 seconds and the single red pulse holds stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-030 — Identity pulse gathers the spectrum

```text
Generate single shot. Restrained desaturated accent strands descend from the screen perimeter toward the central red identity pulse at constant slow speed. Camera pulls backward 0.6 meters slowly on axis. The strands reach a balanced inward formation by 4.5 seconds and hold without a rainbow wash. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-031 — Spectrum collapses · FLF to KF32

```text
Generate single shot. All remaining desaturated accent strands contract inward together at constant slow speed until they form one living study-red filament at the center of the original hall. Camera pushes forward 0.4 meters slowly on axis. The contraction finishes by 4.5 seconds and the single filament holds perfectly stable. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

### NFX-A-032 — Seamless loop closure · FLF to KF01

```text
Generate single shot. The living red filament shortens from both ends at constant slow speed until it returns to the exact dormant opening length without changing width or position. Camera pulls backward 0.4 meters slowly on axis. The filament settles by 4.5 seconds and the opening composition holds perfectly stable for the loop. Premium anthology cinema, deep black negative space, sparse signal-red key, controlled reflections, fine film texture. No dialogue. No background music.
```

## Acceptance gate

Accept an attempt only when all of these are true:

- One continuous shot; no cut, flash edit, or surprise camera move.
- The named subject performs only the named dominant action.
- Camera direction, distance, and speed match the prompt.
- Motion settles by about 4.5 seconds and the final half-second is clean.
- No readable generated text, logo, watermark, extra limb, hand mutation, flicker, or rubber screen.
- Blacks retain 2–4% detail; red remains a sparse locator, never a full-frame grade.
- FLF clips arrive cleanly at their approved last-frame still.
- `A022` preserves exactly 15 portals left + 15 right; `A023` preserves that geometry;
  `A028`/KF29 preserves exactly 6 towers × 5 drawers.

If a clip fails, change exactly one variable per retry in this order:

1. Remove secondary wording.
2. Reduce motion amplitude.
3. Make direction or speed more explicit.
4. Simplify light behavior.
5. Supply the approved target still as `last_frame`.
6. Rewind to the last clean accepted clip.
7. Only then try a nearby seed.

Stop before the projected total can exceed **500 credits**.

## Resumable task log

Fill one row per attempt. Add rows for retakes; do not replace the rejected attempt record.

| Clip | Attempt | Provider task ID | Seed applied | Status | Credits | Saved file | Notes |
|---|---:|---|---|---|---:|---|---|
| A001 | 01 |  | 270701 | pending | 0 |  |  |
| A002 | 01 |  | 270701 | pending | 0 |  |  |
| A003 | 01 |  | 270702 | pending | 0 |  |  |
| A004 | 01 |  | 270702 | pending | 0 |  |  |
| A005 | 01 |  | 270702 | pending | 0 |  |  |
| A006 | 01 |  | 270702 | pending | 0 |  |  |
| A007 | 01 |  | 270702 | pending | 0 |  |  |
| A008 | 01 |  | 270702 | pending | 0 |  |  |
| A009 | 01 |  | 270702 | pending | 0 |  |  |
| A010 | 01 |  | 270702 | pending | 0 |  |  |
| A011 | 01 |  | 270702 | pending | 0 |  |  |
| A012 | 01 |  | 270702 | pending | 0 |  |  |
| A013 | 01 |  | 270702 | pending | 0 |  |  |
| A014 | 01 |  | 270702 | pending | 0 |  |  |
| A015 | 01 |  | 270702 | pending | 0 |  |  |
| A016 | 01 |  | 270702 | pending | 0 |  |  |
| A017 | 01 |  | 270703 | pending | 0 |  |  |
| A018 | 01 |  | 270703 | pending | 0 |  |  |
| A019 | 01 |  | 270703 | pending | 0 |  |  |
| A020 | 01 |  | 270703 | pending | 0 |  |  |
| A021 | 01 |  | 270703 | pending | 0 |  |  |
| A022 | 01 |  | 270703 | pending | 0 |  |  |
| A023 | 01 |  | 270704 | pending | 0 |  |  |
| A024 | 01 |  | 270704 | pending | 0 |  |  |
| A025 | 01 |  | 270705 | pending | 0 |  |  |
| A026 | 01 |  | 270705 | pending | 0 |  |  |
| A027 | 01 |  | 270705 | pending | 0 |  |  |
| A028 | 01 |  | 270705 | pending | 0 |  |  |
| A029 | 01 |  | 270706 | pending | 0 |  |  |
| A030 | 01 |  | 270701 | pending | 0 |  |  |
| A031 | 01 |  | 270701 | pending | 0 |  |  |
| A032 | 01 |  | 270701 | pending | 0 |  |  |

After all 32 clips are accepted, push the accepted MP4s, extracted end frames, and this updated log.
The implementation agent can then normalize codecs/watermark cropping, build the scroll-scrub page,
run desktop/mobile/reduced-motion QA, and deploy.
