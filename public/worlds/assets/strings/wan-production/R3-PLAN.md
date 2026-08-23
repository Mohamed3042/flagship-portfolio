# CUT THE STRINGS — R3 retake plan (Fable 5, 2026-08-22 — owner-approved shape)

Owner verdict on R2 (answers_r2.json, agrees 8/8 with the pre-check): PASS 014, 031. FAIL 009, 012, 016, 020, 022, 039.

## Root causes, read from the two stills of each clip

| clip | KF first → KF last (camera per keyframe-plan.json) | what the R2 camera line said | cause |
|---|---|---|---|
| 009 | KF09 85 mm macro on blade + curl → KF10 50 mm lateral, photograph + carving + calipers | "camera locked" | contradiction: the stills are two framings; WAN obeyed "locked" and blended |
| 020 | KF20 50 mm two-shot (hands, control bar, shadow) → KF21 static 85 mm chest macro | "pushes forward only twenty centimetres" | contradiction: a two-shot to a macro is a full push-in |
| 022 | KF22 40 mm push-through above the scissors → KF23 35 mm low bench-level, she is closer and stepping | "camera locked at bench level" | contradiction: KF22 is not at bench level; two scales blended |
| 039 | KF39 40 mm push on the open crate, no hero → KF40 held 50 mm wide, hero seated at bench centre | "already seated just outside frame-left; track left one metre" | false premise: her KF40 seat is INSIDE KF39's frame, where she is absent. No single take can reveal her; only a fade |
| 012 | KF12 locked 90 mm top-down on the swatches → KF13 60 mm front view of the hero's neck ring | occlusion wipe | subject/angle change; WAN blended before the paper covered the lens |
| 016 | KF16 50 mm bench, hero seated, no mirror → KF17 55 mm hero standing dressed on a stand + mirror | "tracks twenty centimetres right until one true mirror reflection" | subject-set change: pose, place and a mirror appear; no continuous action connects the stills |

Four are camera lines that contradict the stills (PROMPT-QA rule 2, on the camera line — merged by Fable in 7ef9345). Two (012, 016) plus 039 are beat problems: a mid-still is required.

## R3 shape

- **Single clips, rewritten camera:** 009, 020.
- **Split with a mid-still (M):** 012 → 012 + 012B (M012 paper fills the lens); 016 → 016 + 016B (M016 linen fills the lens); 022 → 022 + 022B (M022 unstrung, bench level); 039 → 039 + 039B (M039 seated before the open crate).
- **Count:** 10 clips, 4 new stills. Film 40 → 44 clips (+20 s). Credits: 100 minimum, 150 planned (×1.5). Cumulative minimum 400 + 80 + 100 = 580 (planned 600; stop-and-report above 660).
- **Naming:** halves are `CTS-A-012` / `CTS-A-012B` etc.; `clips.json` gains 4 cards; the 40-series numbers stay untouched. Sol owns the sort key in integration.
- **Seeds:** scene family as before (workshop 271101; 031's hill family unaffected).
- **Prompt rules applied to every card:** both stills' cameras read first; ONE continuous move that connects them; ≤ 2 physical beats on whole/half seconds; no forbidden nouns in the positive block (the negative block carries them); facing matches travel; the stills outvote the prompt. Boilerplate tail identical to the 32 accepted clips.

Boilerplate tail (verbatim on every prompt):
`Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.`

Negative block: `wan-production/negative-prompt.txt` at 7ef9345, unchanged.

## The four mid-stills (Sol generates; anchor + the two neighbouring approved stills as references; 1920x1088; centerSafeLock; preserveLock)

**CTS-KF12M-swatches-fill-lens.png** — Locked macro. The two joined kraft-paper swatches from KF12 held up flat, filling the entire frame edge to edge; the joining seam a single vertical line at centre; paper grain; the lamp's warm tungsten falloff from top-left; adult fingertips gripping the left and right edges only. No bench, no hero. Counts: exactly two swatches, one seam. Same palette and light as KF12.

**CTS-KF16M-linen-fills-lens.png** — Locked. One cream linen garment panel from KF16 held up flat, filling the frame edge to edge, weave visible, warm falloff from top-left, adult fingertips at the two top corners only. No bench, no hero, no mirror. Counts: one panel. Same palette and light as KF16.

**CTS-KF22M-unstrung-bench-level.png** — 35 mm at bench level, KF23's camera height and lens. The unstrung hero standing CENTRED on the scarred bench, balanced, both feet flat, facing the lens, wearing KF22's dress; the severed dark string ends lying on the bench around her feet; no hands, no scissors, no strings above her; lamp at left, tool wall behind, shelf at right. Her size in frame = KF22's size (she has not stepped yet). Counts: one hero, zero strings above.

**CTS-KF39M-seated-before-open-crate.png** — KF39's exact 40 mm composition and light: the open crate packed with finished figures at centre, lamp at left, tool-wall silhouettes behind, ledger and tools at left. Added: the hero (KF40 identity, KF40 dress) seated on the near edge of the bench at centre-right, directly in front of the open crate, facing the lens, hands resting on the wood, calm. Counts: one hero, one open crate, the same figure count inside it as KF39.

Gate before any WAN spend: contact sheet of the four, landscape and true 390x844 crop, owner replies `APPROVE STILLS`.

## The ten prompts

### CTS-A-009 — KF09 → KF10  (123 words)
Generate single shot. Start on the 85 mm macro as the knife finishes its stroke and the curl drops. The camera pulls back and tilts up in one slow continuous move until the pinned portrait photograph and the carved block share a 50 mm frame. The hand sets the knife down, opens the brass caliper from the photograph's cheek to the carved cheek; both tips land and stop. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-020 — KF20 → KF21  (122 words)
Generate single shot. Start on the 50 mm two-shot: adult hands hold the brass control bar tilted, her right arm raised, her wall shadow matching. The camera pushes forward in one slow continuous move, passing the hands and bar out of the top of frame, until her pale-limewood chest fills an 85 mm macro. Her chest completes one subtle slow breath; the grain flexes once and stops. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-012 — KF12 → KF12M  (120 words)
Generate single shot. Locked 90 mm top-down macro on the two joined kraft swatches lying flat on the bench. Adult hands enter from the bottom of frame, take the swatches by their outer edges and lift them straight up toward the lens in one steady motion until the paper fills the frame edge to edge, centre seam vertical, fingertips at the left and right edges. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-012B — KF12M → KF13  (125 words)
Generate single shot. Start on the joined swatches filling the frame edge to edge, fingertips at the left and right edges. The hands lower the swatches straight down out of the bottom of frame in one steady motion, uncovering the 60 mm view behind them: the hero seated in her corset, the thin warm seam line around her neck ring. The hands exit below frame; the seam line brightens once. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-016 — KF16 → KF16M  (125 words)
Generate single shot. Locked 50 mm view of the bench: the garment photograph on the wall, the cut linen panels, the hero seated at camera right. Adult hands enter from the bottom of frame, take the largest linen panel by its top corners and raise it straight up toward the lens in one steady motion until the cream weave fills the frame edge to edge, fingertips at the top corners. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-016B — KF16M → KF17  (122 words)
Generate single shot. Start on the cream linen panel filling the frame edge to edge, fingertips at its top corners. The hands lower the panel out of the bottom of frame, uncovering the 55 mm view behind it: the hero standing on her stand in the fitted linen-and-brass outfit, the mirror behind her showing her back. One hand pins one brass fastening at her hip and stops. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-022 — KF22 → KF22M  (124 words)
Generate single shot. Start on the 40 mm frame: adult hands close the brass scissors through all the luminous strings above the hero standing centred on the bench. The severed ends fall dark onto the bench as the hands withdraw upward out of frame. The camera lowers and eases forward in one slow continuous move to bench level at 35 mm; the unstrung hero stands centred, facing the lens. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-022B — KF22M → KF23  (114 words)
Generate single shot. Bench-level 35 mm view of the unstrung hero standing centred, facing the lens, severed string ends dark on the bench. She takes exactly one grounded step toward the lens and settles with both feet flat on the scarred bench, her aged-brass joints articulating cleanly, while the camera eases forward a hand's width to keep her framed. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-039 — KF39 → KF39M  (124 words)
Generate single shot. Locked 40 mm view of the bench: the open crate packed with finished figures at centre, the lamp at left, the tool wall behind. The hero walks in from the left edge of frame along the front of the bench, pauses beside the crate and sits on the near edge of the bench facing the lens, hands resting on the wood, the crate open behind her. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

### CTS-A-039B — KF39M → KF40  (125 words)
Generate single shot. Start on the 40 mm view of the hero seated on the bench edge before the open crate. She reaches back, lowers the crate lid closed behind her and rests her hands on the wood again. The camera dollies backward in one slow continuous move until the whole workshop fills the 50 mm frame, the bench centred beneath the lamp, the hero seated calmly at its centre. Settle by 4.5s; hold the final 0.5s perfectly still and match the supplied last frame. @Image1 locks scene geometry and art direction. One continuous take. No cuts, shake, extra subjects, readable text, or logos. marionette workshop storybook, warm limewood and brass, single tungsten workbench light, deep umber shadow, film grain. No dialogue. No background music.

## Self-check per prompt (PROMPT-QA)

| card | both cameras read | one continuous move | beats | forbidden nouns in positive block | facing = travel |
|---|---|---|---|---|---|
| 009 | macro → lateral 50 | pull-back + tilt-up | curl drops; caliper opens | none | n/a |
| 020 | two-shot → chest macro | push-in | breath (+ motes drift) | none | n/a |
| 012 | top-down locked | none (locked) | hands enter; lift | none | n/a |
| 012B | flat paper → 60 mm front | none (reveal by lowering the occluder) | lower; seam brightens | none | n/a |
| 016 | 50 mm locked | none (locked) | hands enter; raise | none | n/a |
| 016B | flat linen → 55 mm | none (reveal by lowering the occluder) | lower; pin | none | n/a |
| 022 | 40 mm high → 35 mm bench level | lower + ease forward | strings fall; hands withdraw | none | n/a |
| 022B | 35 mm bench level | ease forward a hand's width | one step | none | faces lens, steps toward lens |
| 039 | 40 mm locked | none (locked) | walk in; sit | none | enters from left edge, walks right |
| 039B | 40 mm → 50 mm wide | dolly back | lid closes (she is the carrier) | none | n/a |

Owner answers (2026-08-22): R3 shape GO (10 clips, 4 mid-stills, 44-clip film, 100 min / 150 planned); 022 SPLIT; mid-stills generated by Sol in the same session; R3 sent to Sol now, same session.
