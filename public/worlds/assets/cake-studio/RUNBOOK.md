# Cake Studio — owner-run WAN 2.7 production pack

Status: **READY FOR OWNER GENERATION**  
Owner direction: proceed with WAN 2.7 on **2026-08-09**  
Generation owner: **Mohamed, using his own WAN account**  
WAN credits spent by Codex: **0**

This folder is the complete offline source of truth for the 50 five-second clips. The approved
51-still sequence is in [`keyframes/`](keyframes/), and the embedded visual board is
[`index.html`](index.html). Open the board first; every positive prompt, input image, target image,
seed, output filename, and acceptance checkbox is on one card.

## Locked settings

- Model: **WAN 2.7 image-to-video**
- Resolution: **720P / 1280×720 / 16:9**
- Duration: **5 seconds**
- Audio: **off**
- Prompt extension / automatic rewrite: **off**
- Outputs per attempt: **1**
- Download every result immediately; hosted result URLs expire
- Initial-pass cost: **50 × 10 = 500 credits**
- Retake cap: **not specified** — complete or assess the first pass before authorizing extra spend

Use the supplied seed when the account exposes a seed field. If it does not, record
`not exposed` in the run log; never claim a hidden seed was applied.

Every prompt is self-contained: one paste per clip, nothing else to copy. A negative field is
NOT required (`negative-prompt.txt` still exists if you ever want one).

## Workflow — every clip is a first+last pair of approved stills

1. Open the clip's card. Upload the LEFT still as the first frame and the RIGHT still as the
   last frame (WAN First&LastFrame mode). Both are approved keyframes shipped in `keyframes/`.
2. Paste the card's single prompt. Keep 720P, 5 s, audio off, prompt extension off, one output.
3. Generate, then download the result immediately into `accepted/` under the exact filename.
4. Because both endpoints are approved stills, adjacent clips join byte-exactly — there is no
   end-frame extraction step between clips.
5. `extract-endframe.command` remains only as a retake fallback if you ever deliberately
   continue from a generated frame instead of an approved still.
6. Never overwrite an attempt. Put rejected downloads in `rejected/` using the exact attempt
   pattern, and record task ID, seed visibility, credits, and finding in `run-log.csv`.

## Exact input/output map

| Clip | Storyboard | First-frame upload | Last-frame upload | Accepted filename | Seed |
|---|---|---|---|---|---:|
| CST-A-001 | KF01 → KF02 | `keyframes/CST-KF01-opening-sheet.png` | `keyframes/CST-KF02-sheet-rises.png` | `accepted/CST-A-001.mp4` | 270711 |
| CST-A-002 | KF02 → KF03 | `keyframes/CST-KF02-sheet-rises.png` | `keyframes/CST-KF03-sheet-portal.png` | `accepted/CST-A-002.mp4` | 270711 |
| CST-A-003 | KF03 → KF04 | `keyframes/CST-KF03-sheet-portal.png` | `keyframes/CST-KF04-portal-folds-to-cake.png` | `accepted/CST-A-003.mp4` | 270711 |
| CST-A-004 | KF04 → KF05 | `keyframes/CST-KF04-portal-folds-to-cake.png` | `keyframes/CST-KF05-blank-cake.png` | `accepted/CST-A-004.mp4` | 270711 |
| CST-A-005 | KF05 → KF06 | `keyframes/CST-KF05-blank-cake.png` | `keyframes/CST-KF06-piping-stair-begins.png` | `accepted/CST-A-005.mp4` | 270711 |
| CST-A-006 | KF06 → KF07 | `keyframes/CST-KF06-piping-stair-begins.png` | `keyframes/CST-KF07-escher-atrium.png` | `accepted/CST-A-006.mp4` | 270711 |
| CST-A-007 | KF07 → KF08 | `keyframes/CST-KF07-escher-atrium.png` | `keyframes/CST-KF08-product-berry.png` | `accepted/CST-A-007.mp4` | 270711 |
| CST-A-008 | KF08 → KF09 | `keyframes/CST-KF08-product-berry.png` | `keyframes/CST-KF09-product-chocolate-round.png` | `accepted/CST-A-008.mp4` | 270712 |
| CST-A-009 | KF09 → KF10 | `keyframes/CST-KF09-product-chocolate-round.png` | `keyframes/CST-KF10-product-chocolate-sheet.png` | `accepted/CST-A-009.mp4` | 270712 |
| CST-A-010 | KF10 → KF11 | `keyframes/CST-KF10-product-chocolate-sheet.png` | `keyframes/CST-KF11-product-heart.png` | `accepted/CST-A-010.mp4` | 270712 |
| CST-A-011 | KF11 → KF12 | `keyframes/CST-KF11-product-heart.png` | `keyframes/CST-KF12-product-oval.png` | `accepted/CST-A-011.mp4` | 270712 |
| CST-A-012 | KF12 → KF13 | `keyframes/CST-KF12-product-oval.png` | `keyframes/CST-KF13-product-photo-wrap.png` | `accepted/CST-A-012.mp4` | 270712 |
| CST-A-013 | KF13 → KF14 | `keyframes/CST-KF13-product-photo-wrap.png` | `keyframes/CST-KF14-product-ivory-sheet.png` | `accepted/CST-A-013.mp4` | 270712 |
| CST-A-014 | KF14 → KF15 | `keyframes/CST-KF14-product-ivory-sheet.png` | `keyframes/CST-KF15-product-tiered.png` | `accepted/CST-A-014.mp4` | 270712 |
| CST-A-015 | KF15 → KF16 | `keyframes/CST-KF15-product-tiered.png` | `keyframes/CST-KF16-product-vintage-round.png` | `accepted/CST-A-015.mp4` | 270712 |
| CST-A-016 | KF16 → KF17 | `keyframes/CST-KF16-product-vintage-round.png` | `keyframes/CST-KF17-nine-form-spiral.png` | `accepted/CST-A-016.mp4` | 270712 |
| CST-A-017 | KF17 → KF18 | `keyframes/CST-KF17-nine-form-spiral.png` | `keyframes/CST-KF18-one-click-choice.png` | `accepted/CST-A-017.mp4` | 270713 |
| CST-A-018 | KF18 → KF19 | `keyframes/CST-KF18-one-click-choice.png` | `keyframes/CST-KF19-anamorphic-surface-map.png` | `accepted/CST-A-018.mp4` | 270713 |
| CST-A-019 | KF19 → KF20 | `keyframes/CST-KF19-anamorphic-surface-map.png` | `keyframes/CST-KF20-surface-hover.png` | `accepted/CST-A-019.mp4` | 270713 |
| CST-A-020 | KF20 → KF21 | `keyframes/CST-KF20-surface-hover.png` | `keyframes/CST-KF21-part-hover.png` | `accepted/CST-A-020.mp4` | 270714 |
| CST-A-021 | KF21 → KF22 | `keyframes/CST-KF21-part-hover.png` | `keyframes/CST-KF22-part-placed.png` | `accepted/CST-A-021.mp4` | 270714 |
| CST-A-022 | KF22 → KF23 | `keyframes/CST-KF22-part-placed.png` | `keyframes/CST-KF23-edible-wrap-unfurls.png` | `accepted/CST-A-022.mp4` | 270714 |
| CST-A-023 | KF23 → KF24 | `keyframes/CST-KF23-edible-wrap-unfurls.png` | `keyframes/CST-KF24-typeset-path-rises.png` | `accepted/CST-A-023.mp4` | 270714 |
| CST-A-024 | KF24 → KF25 | `keyframes/CST-KF24-typeset-path-rises.png` | `keyframes/CST-KF25-cream-outline-monument.png` | `accepted/CST-A-024.mp4` | 270714 |
| CST-A-025 | KF25 → KF26 | `keyframes/CST-KF25-cream-outline-monument.png` | `keyframes/CST-KF26-piping-tip-portal.png` | `accepted/CST-A-025.mp4` | 270714 |
| CST-A-026 | KF26 → KF27 | `keyframes/CST-KF26-piping-tip-portal.png` | `keyframes/CST-KF27-twenty-patch-field.png` | `accepted/CST-A-026.mp4` | 270715 |
| CST-A-027 | KF27 → KF28 | `keyframes/CST-KF27-twenty-patch-field.png` | `keyframes/CST-KF28-press-error-cast.png` | `accepted/CST-A-027.mp4` | 270715 |
| CST-A-028 | KF28 → KF29 | `keyframes/CST-KF28-press-error-cast.png` | `keyframes/CST-KF29-patch-scan.png` | `accepted/CST-A-028.mp4` | 270715 |
| CST-A-029 | KF29 → KF30 | `keyframes/CST-KF29-patch-scan.png` | `keyframes/CST-KF30-corrected-patches.png` | `accepted/CST-A-029.mp4` | 270715 |
| CST-A-030 | KF30 → KF31 | `keyframes/CST-KF30-corrected-patches.png` | `keyframes/CST-KF31-calibrated-glaze-arch.png` | `accepted/CST-A-030.mp4` | 270715 |
| CST-A-031 | KF31 → KF32 | `keyframes/CST-KF31-calibrated-glaze-arch.png` | `keyframes/CST-KF32-sheet-enters-press.png` | `accepted/CST-A-031.mp4` | 270715 |
| CST-A-032 | KF32 → KF33 | `keyframes/CST-KF32-sheet-enters-press.png` | `keyframes/CST-KF33-sheet-exits-press.png` | `accepted/CST-A-032.mp4` | 270716 |
| CST-A-033 | KF33 → KF34 | `keyframes/CST-KF33-sheet-exits-press.png` | `keyframes/CST-KF34-steel-rule-alignment.png` | `accepted/CST-A-033.mp4` | 270716 |
| CST-A-034 | KF34 → KF35 | `keyframes/CST-KF34-steel-rule-alignment.png` | `keyframes/CST-KF35-one-to-one-bridge.png` | `accepted/CST-A-034.mp4` | 270716 |
| CST-A-035 | KF35 → KF36 | `keyframes/CST-KF35-one-to-one-bridge.png` | `keyframes/CST-KF36-six-proof-facets.png` | `accepted/CST-A-035.mp4` | 270716 |
| CST-A-036 | KF36 → KF37 | `keyframes/CST-KF36-six-proof-facets.png` | `keyframes/CST-KF37-revision-seal.png` | `accepted/CST-A-036.mp4` | 270717 |
| CST-A-037 | KF37 → KF38 | `keyframes/CST-KF37-revision-seal.png` | `keyframes/CST-KF38-changed-revision.png` | `accepted/CST-A-037.mp4` | 270717 |
| CST-A-038 | KF38 → KF39 | `keyframes/CST-KF38-changed-revision.png` | `keyframes/CST-KF39-stale-layer-rejected.png` | `accepted/CST-A-038.mp4` | 270718 |
| CST-A-039 | KF39 → KF40 | `keyframes/CST-KF39-stale-layer-rejected.png` | `keyframes/CST-KF40-twelve-rule-cage.png` | `accepted/CST-A-039.mp4` | 270718 |
| CST-A-040 | KF40 → KF41 | `keyframes/CST-KF40-twelve-rule-cage.png` | `keyframes/CST-KF41-nine-defects-revealed.png` | `accepted/CST-A-040.mp4` | 270718 |
| CST-A-041 | KF41 → KF42 | `keyframes/CST-KF41-nine-defects-revealed.png` | `keyframes/CST-KF42-defects-lift-away.png` | `accepted/CST-A-041.mp4` | 270718 |
| CST-A-042 | KF42 → KF43 | `keyframes/CST-KF42-defects-lift-away.png` | `keyframes/CST-KF43-nine-corrected-cakes.png` | `accepted/CST-A-042.mp4` | 270718 |
| CST-A-043 | KF43 → KF44 | `keyframes/CST-KF43-nine-corrected-cakes.png` | `keyframes/CST-KF44-cake-aperture.png` | `accepted/CST-A-043.mp4` | 270718 |
| CST-A-044 | KF44 → KF45 | `keyframes/CST-KF44-cake-aperture.png` | `keyframes/CST-KF45-glaze-settles.png` | `accepted/CST-A-044.mp4` | 270719 |
| CST-A-045 | KF45 → KF46 | `keyframes/CST-KF45-glaze-settles.png` | `keyframes/CST-KF46-photos-peel-live.png` | `accepted/CST-A-045.mp4` | 270719 |
| CST-A-046 | KF46 → KF47 | `keyframes/CST-KF46-photos-peel-live.png` | `keyframes/CST-KF47-cream-paper-arch.png` | `accepted/CST-A-046.mp4` | 270719 |
| CST-A-047 | KF47 → KF48 | `keyframes/CST-KF47-cream-paper-arch.png` | `keyframes/CST-KF48-print-room-aperture.png` | `accepted/CST-A-047.mp4` | 270719 |
| CST-A-048 | KF48 → KF49 | `keyframes/CST-KF48-print-room-aperture.png` | `keyframes/CST-KF49-world-folds-to-sheet.png` | `accepted/CST-A-048.mp4` | 270719 |
| CST-A-049 | KF49 → KF50 | `keyframes/CST-KF49-world-folds-to-sheet.png` | `keyframes/CST-KF50-loop-closure.png` | `accepted/CST-A-049.mp4` | 270711 |
| CST-A-050 | KF50 → KF01 | `keyframes/CST-KF50-loop-closure.png` | `keyframes/CST-KF01-opening-sheet.png` | `accepted/CST-A-050.mp4` | 270711 |

## Copy-ready positive prompts

### CST-A-001 — Opening Sheet → Sheet Rises · FLF to KF02

```text
Generate single shot. The baker's brown hands in deep-teal cuffs slowly raise the edible sheet and stand it on the marble in one smooth upright wave, fingertips steadying the top edge. Camera pushes in gently, about ten percent closer. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-002 — Sheet Rises → Sheet Portal · FLF to KF03

```text
Generate single shot. The hands ease the standing sheet open into a self-supporting arch, and a warm miniature bakery interior fades into view inside it. Camera continues the same slow push in. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-003 — Sheet Portal → Portal Folds To Cake · FLF to KF04

```text
Generate single shot. The hands fold the arch forward and down over a hidden round form, its lower half wrapping into a smooth cake top. Camera orbits five degrees to the right, slow and level. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-004 — Portal Folds To Cake → Blank Cake · FLF to KF05

```text
Generate single shot. The hands smooth the last edge flat onto the ivory cake, then withdraw completely from frame, leaving the blank cylinder alone on the marble. Camera lowers fifteen centimetres, slow and steady. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-005 — Blank Cake → Piping Stair Begins · FLF to KF06

```text
Generate single shot. The tall stainless piping tip glides down over the cake with machine-straight precision and pipes one continuous ivory cream line onto the top. Camera holds centered and eases slightly closer. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-006 — Piping Stair Begins → Escher Atrium · FLF to KF07

```text
Generate single shot. The piped cream climbs stair by stair into an impossible tiered ivory atrium, each step extruded clean and sharp as if printed. Camera tilts up slowly, following the rising cream. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-007 — Escher Atrium → Product Berry · FLF to KF08

```text
Generate single shot. The tiered atrium rotates slowly like a display carousel and condenses into one berry-topped ivory cake at center. Camera settles into a symmetrical frontal frame. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-008 — Product Berry → Product Chocolate Round · FLF to KF09

```text
Generate single shot. The ivory cake's fluted walls turn glossy chocolate brown in one smooth wave while the berry crest becomes a chocolate crest. Camera tracks left slowly, keeping the cake centered. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-009 — Product Chocolate Round → Product Chocolate Sheet · FLF to KF10

```text
Generate single shot. The round chocolate cake stretches and squares cleanly into the long rectangular chocolate sheet cake, edges snapping straight with digital precision. Camera continues the same slow left track. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-010 — Product Chocolate Sheet → Product Heart · FLF to KF11

```text
Generate single shot. The rectangle softens, its top edge dips into a center cleft, and the form rounds into the white heart cake with red berry trim. Camera keeps the same measured left track. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-011 — Product Heart → Product Oval · FLF to KF12

```text
Generate single shot. The heart's cleft closes and its sides lengthen smoothly into the fluted ivory oval cake. Camera orbits six degrees clockwise, slow. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-012 — Product Oval → Product Photo Wrap · FLF to KF13

```text
Generate single shot. The oval rises into a taller smooth cylinder while a deep-teal printed wrap flows around its side like a photograph applying itself. Camera lowers slightly toward a side-on angle in the window light. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-013 — Product Photo Wrap → Product Ivory Sheet · FLF to KF14

```text
Generate single shot. The printed wrap fades to ivory as the cylinder spreads and squares into the long rectangular sheet cake. Camera settles at a shallow fourteen-degree elevation. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-014 — Product Ivory Sheet → Product Tiered · FLF to KF15

```text
Generate single shot. A second smaller round tier rises smoothly from the sheet's center and seats itself perfectly, forming the two-tier cake. Camera rises toward a high forty-two-degree view of the top. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-015 — Product Tiered → Product Vintage Round · FLF to KF16

```text
Generate single shot. The lower tier narrows while ornate piping curls grow around both tiers, resolving into the vintage round cake with its small topper. Camera orbits eight degrees right, slow. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-016 — Product Vintage Round → Nine Form Spiral · FLF to KF17

```text
Generate single shot. Eight more finished cakes rise smoothly from the dark stands around the vintage cake, arranging themselves into one elegant spiral display like a catalog coming alive, exactly nine cakes total, none extra. Camera pulls back slowly to reveal the whole display. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-017 — Nine Form Spiral → One Click Choice · FLF to KF18

```text
Generate single shot. The baker's brown hand in a deep-teal cuff enters from the lower left and reaches once toward the front berry cake; everything else stays perfectly still. Camera continues a gentle pull back and settles. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-018 — One Click Choice → Anamorphic Surface Map · FLF to KF19

```text
Generate single shot. The chosen berry cake glides forward off the display in one clean straight line, as if selected, while the other eight sink into deep-teal shadow. Camera pushes forward with it, slow. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-019 — Anamorphic Surface Map → Surface Hover · FLF to KF20

```text
Generate single shot. Fine rose-gold contour lines fade in across the cake's top like a precise surface map, and a small cluster of berries and cream appears hovering above the marked rim. Camera drifts to the exact angle where the map lines align. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-020 — Surface Hover → Part Hover · FLF to KF21

```text
Generate single shot. The hovering decoration glides along above the rim to the front right and sinks lower, aligning itself precisely over its marked landing spot. Camera orbits six degrees right, matching the drift. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-021 — Part Hover → Part Placed · FLF to KF22

```text
Generate single shot. The baker's hand steadies the decoration as it settles the last few centimetres and seats itself perfectly onto the cake surface. Camera pushes in fifteen centimetres, close and slow. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-022 — Part Placed → Edible Wrap Unfurls · FLF to KF23

```text
Generate single shot. The baker's fingers lift the edge of the cake's ivory side wrap and peel it outward into one smooth curling strip. Camera eases back and lowers toward the side. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-023 — Edible Wrap Unfurls → Typeset Path Rises · FLF to KF24

```text
Generate single shot. The peeled strip curls upward and its cream edge flows into one elegant abstract flourish standing above the cake, flowing curves only, never letters. Camera orbits left slowly, following the strip. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-024 — Typeset Path Rises → Cream Outline Monument · FLF to KF25

```text
Generate single shot. The flourish thickens and grows into a balanced pair of monumental piped cream scrolls flanking the tall silver piping tip. Camera tilts up slowly with the rising forms. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-025 — Cream Outline Monument → Piping Tip Portal · FLF to KF26

```text
Generate single shot. Camera glides straight toward the giant piping tip until its polished opening fills the frame like a doorway, the baker's hands steadying its rim from above. One slow centered push, nothing else moves. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-026 — Piping Tip Portal → Twenty Patch Field · FLF to KF27

```text
Generate single shot. Camera passes through the piping-tip opening into a long mirrored calibration hall where a flat sheet carries a grid of twenty colour patches, four across and five deep. One straight slow forward glide of about one metre, all twenty patches staying in place. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-027 — Twenty Patch Field → Press Error Cast · FLF to KF28

```text
Generate single shot. A fine off-colour mist drifts once across the patch grid from left to right, dulling every colour as it passes, while the baker's hand enters with a slim brush at the corner. Camera rises gently overhead, keeping all twenty patches in frame. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-028 — Press Error Cast → Patch Scan · FLF to KF29

```text
Generate single shot. The baker's hand draws a thin rose-gold measuring beam across the grid row by row, and every colour snaps back to true behind it. Camera tracks right at the beam's exact speed, all twenty patches staying in place. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-029 — Patch Scan → Corrected Patches · FLF to KF30

```text
Generate single shot. The beam crosses the final row and all twenty patches settle into clean calibrated colour, none split, merged, added or lost. Camera continues the same slow right track, then rests. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-030 — Corrected Patches → Calibrated Glaze Arch · FLF to KF31

```text
Generate single shot. The twenty patches lift off the sheet as twenty glossy glaze droplets, one per patch, and arc down the hall into one calibrated colour arch. Camera lowers from overhead to a frontal hero angle. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-031 — Calibrated Glaze Arch → Sheet Enters Press · FLF to KF32

```text
Generate single shot. The droplet arch settles into one controlled colour ribbon while the blank sheet glides along the runway toward the teal-and-brass press. Camera settles frontal and symmetrical. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-032 — Sheet Enters Press → Sheet Exits Press · FLF to KF33

```text
Generate single shot. The press rollers draw the sheet through and it emerges on the far side perfectly clean and unchanged in size, the baker's hands receiving its edge. Camera tracks alongside, level and slow. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-033 — Sheet Exits Press → Steel Rule Alignment · FLF to KF34

```text
Generate single shot. The baker's hands lay a polished steel rule beside the sheet and slide it flush against the long edge in one precise motion. Camera lowers slowly toward the sheet plane. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-034 — Steel Rule Alignment → One To One Bridge · FLF to KF35

```text
Generate single shot. The steel rule extends forward into a long narrow rose-gold-edged bridge running down the hall, and the hands withdraw. Camera tracks forward low along the bridge. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-035 — One To One Bridge → Six Proof Facets · FLF to KF36

```text
Generate single shot. Exactly six small rose-gold facets rise from the bridge surface and hover in two neat rows of three. Camera continues the low forward track toward them. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-036 — Six Proof Facets → Revision Seal · FLF to KF37

```text
Generate single shot. The six facets glide together and click into one six-faceted rose-gold proof ring, and the baker's two hands catch it around a small layered stack. Camera orbits a few degrees clockwise with the motion, then rests. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-037 — Revision Seal → Changed Revision · FLF to KF38

```text
Generate single shot. The hands set the ringed stack down on the runway, and one altered top layer slides sideways out of the open ring, resting apart from the approved stack. Camera settles into a centered close view. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-038 — Changed Revision → Stale Layer Rejected · FLF to KF39

```text
Generate single shot. The altered layer drifts back into deep-teal shadow and dims while the ring seals around the approved stack in warm light. Focus eases from the fading layer to the sealed stack. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-039 — Stale Layer Rejected → Twelve Rule Cage · FLF to KF40

```text
Generate single shot. Exactly twelve thin rose-gold inspection beams rise and stand around the approved cake, in three separated groups of four, like rules taking their positions. Camera pulls back slowly to give them room. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-040 — Twelve Rule Cage → Nine Defects Revealed · FLF to KF41

```text
Generate single shot. The twelve beams fan outward and their light reveals nine cake silhouettes on nine separate landings of a dark spiral stair, all twelve beams staying. Camera rises vertically, slow, through the open cage. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-041 — Nine Defects Revealed → Defects Lift Away · FLF to KF42

```text
Generate single shot. From each of the nine cakes one faulty piece lifts straight up along its own beam and hangs in the air, nine pieces, one per cake. Camera cranes down a slow diagonal toward the center. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-042 — Defects Lift Away → Nine Corrected Cakes · FLF to KF43

```text
Generate single shot. The nine lifted faults dissolve into flour sparkle and the nine corrected cakes glide into one warm staircase display, exactly nine, nothing extra. Camera pulls back and levels into a frontal poster frame. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-043 — Nine Corrected Cakes → Cake Aperture · FLF to KF44

```text
Generate single shot. The top cake's face opens like a circular aperture, revealing a living miniature bakery world glowing inside. Camera settles symmetrical with all nine forms visible. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-044 — Cake Aperture → Glaze Settles · FLF to KF45

```text
Generate single shot. Camera glides straight through the cake aperture into the miniature bakery and arrives on one ivory heart-marked cake as three ruby glaze droplets fall beside it. One slow forward push, about one metre. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-045 — Glaze Settles → Photos Peel Live · FLF to KF46

```text
Generate single shot. The three droplets land and spread into one neat glossy glaze edge while, around the room, nine cakes each begin peeling a thin photo sheet from their tops, one sheet per cake. Camera makes a slow half orbit to the left. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-046 — Photos Peel Live → Cream Paper Arch · FLF to KF47

```text
Generate single shot. The nine peeling sheets rise, curve inward and weave into one continuous cream-and-paper arch, nine sheets becoming one, none left over. Camera cranes up slowly through their center. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-047 — Cream Paper Arch → Print Room Aperture · FLF to KF48

```text
Generate single shot. The cream arch straightens and glazes into a tall glass print-room vitrine framed in rose gold, a miniature bakery glowing inside. Camera tilts down slowly as it forms. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-048 — Print Room Aperture → World Folds To Sheet · FLF to KF49

```text
Generate single shot. The vitrine compresses into a single thin edible sheet standing curled on the black marble, the miniature world folding flat into its translucent glow. Camera dollies back forty centimetres, slow. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-049 — World Folds To Sheet → Loop Closure · FLF to KF50

```text
Generate single shot. The backlit sheet's glow softens to plain ivory as it settles into a gentle open curl and the baker's brown hands return to take its edges; the six-faceted reflection fades, three facets per side. Camera eases back to the opening distance. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

### CST-A-050 — Loop Closure → Opening Sheet · FLF to KF01

```text
Generate single shot. The baker's brown hands lower the sheet the last few centimetres toward the marble and hold it exactly as at the very start, closing the loop. Camera locked off, no movement. The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly. One continuous take, no cuts, no camera shake, no new objects, no readable text or logos. Photoreal optical patisserie, deep teal and rose gold, black marble, flour-haze backlight, restrained film grain. No dialogue. No background music.
```

## Acceptance gate

Accept a take only when all of these are true:

- One continuous shot; no cut, flash edit, surprise camera move, or prompt-invented secondary action.
- The named subject performs only the named dominant action and the camera follows the specified move.
- Motion settles by about 4.5 seconds; the last half-second is clean and stable.
- Materials, rear-light direction, flour haze, marble veining, buttercream texture, lens character,
  center-safe composition, and restrained grain remain continuous.
- No readable text, label, logo, watermark, face in printed imagery, anatomy mutation, flicker,
  melted tool, dirty/clinical/horror drift, or generated letterbox bar.
- Every locked count survives: nine cakes, 20 patches/droplets, six proof facets, 12 beams, and the
  specific one-to-one mappings named by the prompt.
- FLF clips arrive cleanly at their supplied destination still.

Retake exactly one variable at a time:

1. Remove secondary wording.
2. Reduce motion amplitude.
3. Make direction or speed more explicit.
4. Simplify lighting behavior.
5. Supply the approved storyboard target as `last_frame`.
6. Rewind to the last clean accepted clip.
7. Only then try a nearby seed.

The initial pass costs 500 credits. No retake ceiling was supplied, so stop and decide a cap before
additional spending.
