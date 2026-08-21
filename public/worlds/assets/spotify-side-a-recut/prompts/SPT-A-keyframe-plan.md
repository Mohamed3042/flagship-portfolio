# THE ALBUM — Side A Recut — Phase 1 Keyframe Plan

## Hard gate

Generate and review exactly eight stills: one style anchor plus seven loop keyframes. Do not request or generate WAN video until Mohamed replies `APPROVE STILLS`.

## Immutable constraints

- Canvas after normalization: exactly 1920 × 1088 RGB PNG.
- Room geometry and object placement come from the extracted room references.
- Story action and essential objects remain inside the center 50% of frame.
- No people, hands, faces, daylight, windows, additional props, readable text, logos, brands, or watermarks.
- Existing third-party marks in references are replaced with blank matte surfaces or abstract non-lexical groove motifs.
- Only signal green may be strongly saturated. Violet is an undertone/accent.
- Style lock, verbatim: `photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain`
- The seven boundaries form a closed physical chain: KF01 → KF02 → KF03 → KF04 → KF05 → KF06 → KF07 → KF01.

## Image roles and boundary chain

| Asset | Boundary state | Feeds take |
|---|---|---|
| STYLE | Neutral full-room visual bible; no story event in progress | All |
| KF01 | Near-black vinyl/deck; exactly one tiny signal-green point reflected in the record | A01 start / A07 end |
| KF02 | Same deck; deck LED wakes as the second green point | A01 end / A02 start |
| KF03 | Stylus seated; one narrow green groove streak; spiral motion resolved forward | A02 end / A03 start |
| KF04 | Wide wall state; green column has reached the round wall mark; shadows settled | A03 end / A04 start |
| KF05 | Workstation landed; the brief cable alignment is releasing; faint abstract waveform ghost remains on the blank monitor | A04 end / A05 start |
| KF06 | Lounge state; impossible passing-car shadow has peaked; green practical swelled; no window | A05 end / A06 start |
| KF07 | Wide synchronized-room state; all reflective screens dim together; only deck remains lit | A06 end / A07 start |

## Generation prompts

### STYLE — style anchor

Create a photorealistic cinematic style anchor for the exact listening room shown in the supplied reference images. Reconstruct the same fixed architecture and object placement: ribbed acoustic rear wall, centered circular wall disc, centered record deck and console, workstation and monitor on the left, lounge seating, shelving, posters and guitar on the right. Do not add, remove, or relocate physical objects. Neutralize every recognizable brand, logo, wordmark, poster title, and readable screen element into blank matte surfaces or subtle abstract non-lexical groove motifs. No people, hands, faces, windows, daylight, or watermark. Wide 16:9 composition, 40–50 mm cinematic lens, low exposure with readable physical detail, practical LED and monitor spill, very light haze. Keep the deck and major composition inside the center 50% for portrait cropping. Only signal green may be strongly saturated; violet is a restrained undertone. This anchor is a visual bible, not an action frame. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: `room01-silence-last.png`, `room04-build-last.png`, `room05-lounge-last.png`, `room06-chorus-last.png`.

### KF01 — first light / loop closure

Use supplied Image 1 as the immutable style bible and Image 2 for the real deck and room layout. Same room, same materials, same object placement, same palette, exposure, optics, and grain. Frame a cinematic 40 mm low push position toward the centered record deck. The room is almost entirely black but physical vinyl, stylus, console edges, and the round wall disc remain barely legible. Show exactly one tiny signal-green point reflected in the vinyl groove, inside the center 50%. No other green emitter is awake. This is both the first state of A01 and the exact final state of A07. No people, hands, faces, text, logos, brands, windows, daylight, or watermark. Replace referenced markings with blank matte surfaces. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room01-silence-first.png`, `room02-contact-first.png`.

### KF02 — deck wakes

Use supplied Image 1 as the immutable style bible and Images 2–3 for the real deck geometry. Preserve the same room, exact physical object placement, materials, palette, exposure, optics, and grain. Same centered 40 mm deck view as KF01, with the vinyl reflection still present and the deck LED now awake as a second tiny signal-green point. Exactly two green points, both inside the center 50%, with no broad glow and no other active light source. Vinyl and stylus remain physically plausible. No people, hands, faces, text, logos, brands, windows, daylight, or watermark; all markings are blank. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room02-contact-first.png`, `room02-contact-last.png`.

### KF03 — contact resolved

Use supplied Image 1 as the immutable style bible and Image 2 for the real record-deck geometry. Preserve materials, palette, exposure, and grain. Extreme but spatially plausible 85 mm macro of the same centered turntable: stylus physically seated in the groove, a single narrow signal-green streak following the groove, the spiral visually resolved in the normal forward direction. The contact point and essential deck silhouette stay inside the center 50%. Deep black surrounds it; violet appears only as a faint undertone. No people, hands, faces, text, logos, brands, watermark, impossible mechanism, extra needles, or floating parts. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room02-contact-last.png`.

### KF04 — sundial settled

Use supplied Image 1 as the immutable style bible and Images 2–3 for the real room and rear-wall geometry. Preserve the same architecture and object placement. Fixed 50 mm wide room view with only a restrained 2° compositional drift: one narrow vertical signal-green light column has climbed the ribbed rear wall and terminates exactly at the centered circular wall disc; cast shadows have completed their slow rotation and now sit settled and physically coherent. Keep disc, column, and deck inside the center 50%. Dark practical room detail remains readable; violet is only an undertone. No people, hands, faces, text, logos, brands, windows, daylight, or watermark. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room03-runway-last.png`, `room01-silence-last.png`.

### KF05 — aligned desk

Use supplied Image 1 as the immutable style bible and Image 2 for the real left workstation and room geometry. Preserve architecture, furniture, deck placement, materials, palette, exposure, and grain. Cinematic 50 mm lateral endpoint at the same workstation: ordinary cable clutter has just aligned into one plausible waveform-like curve for half a beat; the dark blank monitor carries only a faint abstract signal-green waveform ghost with no letters, numbers, icons, interface, or logo. Keep the aligned cable shape and monitor inside the center 50%. No levitation, impossible joins, people, hands, faces, readable text, logos, brands, windows, daylight, or watermark. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room04-build-last.png`.

### KF06 — passing car without a window

Use supplied Image 1 as the immutable style bible and Image 2 for the real lounge, poster wall, guitar, and room geometry. Preserve architecture, furniture, object placement, materials, palette, exposure, and grain. Cinematic 45 mm lateral endpoint: a pair of soft passing-car-like shadows has swept across the poster wall even though the room has no visible window; the shadow peak feels optically real and temporary, while the existing signal-green practical has swelled once. Keep the shadow event and practical light inside the center 50%. Posters are abstract unbranded shapes with no readable words or faces. No car, window, people, hands, faces, text, logos, brands, daylight, or watermark. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room05-lounge-last.png`.

### KF07 — synchronized room / needle-up start

Use supplied Image 1 as the immutable style bible and Image 2 for the exact full-room geometry. Preserve architecture, furniture, deck, workstation, lounge, shelving, materials, palette, exposure, and grain. Wide 35 mm open-room endpoint: every reflective screen and glossy surface has just synchronized to the same heartbeat and has now dimmed together; only the centered deck retains one small signal-green light. Keep deck and remaining light inside the center 50%. The room is coherent and calm, ready for the needle to rise in A07 and return to KF01. No people, hands, faces, readable text, logos, brands, windows, daylight, or watermark. Style lock: photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

References: generated `STYLE.png`, `room06-chorus-last.png`.
