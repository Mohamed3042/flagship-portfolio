# THE ALBUM — Side A Recut — Grok 1080p / 15s Motion Board

Status: `READY_FOR_MANUAL_GROK_GENERATION`

This is a parallel motion-study route. It does not replace the approved WAN 5-second FLF chain. Generate seven 15-second Grok takes, then compare each take's best clean 5-second window with its WAN counterpart.

## Locked generation settings

- Model: `grok-imagine-video-1.5`
- Mode: image-to-video
- Resolution: `1080p`
- Duration: `15` seconds
- Aspect ratio: `16:9`
- Audio intent: silent; strip any returned audio before editorial comparison
- Input: upload only the named `input/Gxx-start.png`
- One continuous shot, one dominant action, one camera move
- Preserve Grok provenance/watermark; do not crop, cover, or remove it

Why one input: xAI's 1080p image-to-video mode locks the supplied image as frame zero. Its multi-reference mode supports up to seven images but is capped at 720p and does not lock frame zero. The target still on the board is therefore a landing reference for review, not a second Grok upload.

## Shared preservation block

Append this block to every prompt:

> Preserve the exact supplied listening-room geometry, unbranded matte surfaces, deck, furniture, plants, instruments, and physical materials. Signal green is the only strongly saturated color; violet remains an undertone. No people, hands, faces, windows, daylight, readable text, logos, icons, captions, cuts, morphing, duplicated props, melted hardware, impossible reflections, flicker, or sudden exposure change. No dialogue. No background music. No sound effects. Silent audio. Photoreal dark listening room, single signal-green light, violet undertone, deep black shadow, film grain.

## G01 — First Light

Upload: `input/G01-start.png`  
Editorial target: `../keyframes/final/KF02.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Hold the near-black room for 2 seconds. From 2–8 seconds, make one slow 40mm push forward by 0.6 meter toward the centered turntable; the lone signal-green point grows just enough to reveal that it is a reflection in the vinyl groove. From 8–10.5 seconds, one separate tiny signal-green status LED wakes physically on the front-right edge of the deck. No other light changes. By 11 seconds, settle into a stable dark composition where exactly two green points bracket the deck, then hold perfectly still through 15 seconds.
```

Timing: `hold 0–2 | reveal 2–8 | LED 8–10.5 | settle 11–15`

## G02 — Contact

Upload: `input/G02-start.png`  
Editorial target: `../keyframes/final/KF03.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Hold for 1.5 seconds, then crane smoothly down and forward by 1.2 meters from the wide room toward the centered turntable, ending in an 85mm extreme macro. The vinyl rotates steadily; its groove pattern appears to wagon-wheel backward while the rigid tone arm lowers at constant speed. At 9.5 seconds the stylus makes clean physical contact, the apparent rotation resolves instantly into true forward motion, and one narrow green streak follows the contacted groove. Stop all action by 11.5 seconds and hold the seated stylus and stable streak through 15 seconds.
```

Timing: `wide 0–1.5 | crane/contact 1.5–9.5 | resolve 9.5–11.5 | hold 11.5–15`

## G03 — The Sundial

Upload: `input/G03-start.png`  
Editorial target: `../keyframes/final/KF04.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Use a locked-off 50mm camera with no translation and no more than a slow 2-degree drift. From 2–10.5 seconds, one narrow vertical signal-green column climbs the ribbed wall from the deck toward the plain circular wall disc. At the same time, every existing cast shadow rotates slowly around that column like a sundial while every physical object remains fixed. The column reaches the bottom center of the disc at 10.5 seconds. The shadows settle naturally by 11.5 seconds. Hold the stable wall mark, column, shadows, and room through 15 seconds.
```

Timing: `hold 0–2 | climb/rotate 2–10.5 | settle 10.5–11.5 | hold 11.5–15`

## G04 — The Aligned Desk

Upload: `input/G04-start.png`  
Editorial target: `../keyframes/final/KF05.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Make one slow 50mm lateral desk track to the right by 0.5 meter over 11 seconds. Existing black audio cables lie randomly on the desk at first. From 4–8 seconds, parallax causes those same connected cables to align into one clean waveform silhouette without levitating, stretching, or disconnecting. Hold the perfect alignment for half a second at 8 seconds, then let perspective break it apart naturally. A faint matching green waveform ghost fades across the otherwise blank monitor from 9–12 seconds. Settle and hold the workstation through 15 seconds.
```

Timing: `random 0–4 | align 4–8.5 | release/ghost 8.5–12 | hold 12–15`

## G05 — The Passing Car

Upload: `input/G05-start.png`  
Editorial target: `../keyframes/final/KF06.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Make one slow 45mm lateral track to the right by 0.6 meter, moving continuously but never arriving. From 3–10.5 seconds, two soft paired signal-green shadow pools sweep horizontally across the solid lounge poster wall as if car headlights pass outside, although no window, doorway, vehicle, or exterior ever appears. The existing plain vertical green practical swells once between 8–9 seconds with physically plausible falloff, then returns to baseline. The shadows leave the posters by 11.5 seconds. Keep the sofa, guitar, shelves, and plants perfectly fixed; settle through 15 seconds.
```

Timing: `still 0–3 | shadow sweep 3–10.5 | practical swell 8–9 | settle 11.5–15`

## G06 — The Synchronized Room

Upload: `input/G06-start.png`  
Editorial target: `../keyframes/final/KF07.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Make one smooth 35mm open-out by 1 meter from the workstation to reveal the whole listening room over 10 seconds. Between 6–9 seconds, every existing reflective surface—blank monitor, dark TV panel, glass, vinyl, and equipment face—shows the same single signal-green waveform pulse at exactly the same instant. The pulse happens once only. From 9–11 seconds every reflective surface dims together until only one small centered deck light remains. Stop the camera by 11 seconds and hold the coherent, calm full room unchanged through 15 seconds.
```

Timing: `desk 0–2 | open-out 2–10 | shared pulse 6–9 | dim/hold 9–15`

## G07 — Needle Up

Upload: `input/G07-start.png`  
Editorial target: `../keyframes/final/KF01.png`

```text
Single continuous 15-second shot. The supplied image is the exact starting frame. Hold the 85mm turntable macro for 2 seconds. From 2–8 seconds, the rigid tone arm lifts vertically by 8 millimeters at a slow constant speed. Dust visible only inside the tone-arm light follows the rotating groove, spirals once into a brief translucent ghost of that groove, then dissipates without smoke or particles entering elsewhere. From 8–11 seconds, make one restrained 8-degree tilt down toward the vinyl reflection until the frame resolves to one tiny signal-green point in deep black. Stop all motion by 11.5 seconds and hold that loop-closing point through 15 seconds.
```

Timing: `macro hold 0–2 | lift/dust 2–8 | tilt 8–11 | loop hold 11.5–15`

## Comparison protocol

1. Preserve every raw Grok return unchanged in `outputs/raw/grok/`.
2. Record actual model, mode, resolution, duration, watermark/provenance, and generation ID.
3. Measure actual pixels and duration; do not trust the selected UI labels.
4. Strip audio only in a separate normalized comparison copy.
5. Extract frames at `0.0`, `3.0`, `7.5`, `12.0`, and `14.8` seconds.
6. Score room identity, action causality, camera fidelity, geometry stability, ending stability, center crop, and unwanted text/logo artifacts.
7. Compare the best contiguous 5-second Grok window against the matching full 5-second WAN take; keep the full 15-second Grok take as a separate creative option.

The Grok path is a comparison candidate only. No provider wins until decoded frames and scrub behavior are measured.

