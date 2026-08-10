# Cake Studio World 09 — The Cake Is Made Twice

Date: 2026-08-10
Source branch: `feature/cake-studio-world`
Release: `v1.1.0` / visible badge `v1.1 · WORLD 09`
Deployment: not performed

## Why this pass exists

The v1.0 world was technically complete, but its 50 clips received equal scroll weight and its
live ending explained proof with abstract counters. It described the generated transformations
without fully directing them around Cake Studio's reason for existing.

The v1.1 film has one sentence:

> **The cake is made twice: first as a decision in software, then as an object in the kitchen.**

Cake Studio turns reusable pastry knowledge into ready forms and controlled decisions. A shop
operator can adapt a cake and deliver a customer mockup, baker sheet and true-size plaque without
asking a pastry chef to reinvent the design from a blank sketch every time. Physical baking,
printing and final material approval remain human production work.

The full methodology now lives in
[`public/worlds/CAKE-STUDIO-DIRECTORS-CUT.md`](../public/worlds/CAKE-STUDIO-DIRECTORS-CUT.md).

## Direction applied to the page

- The visitor's scroll hand is the operator; no video autoplays.
- Fifty source clips remain in their endpoint-locked order, but a 50-value director score replaces
  equal progress allocation.
- Shots 08–15 run at `0.55–0.60` weight so exploring ready forms feels inexpensive.
- Shot 16 holds at `1.65`; the nine-form library must register.
- Shot 17 holds at `1.85`; selection is the first decisive act.
- Shots 27, 38 and 50 each hold at `1.65` so colour error, rejection and loop closure become
  dramatic beats rather than connective frames.
- Eight bilingual chapter reasons explain what each image means for the actual operator: brief,
  ready forms, flexible design, exact placement, protected colour, measurable output, early error
  rejection and physical production.
- Chapter rhythm changes the proof accent from warm rose to measured teal without covering or
  cropping generated pixels.
- The title and lobby now lead with **The Cake Is Made Twice**, while the media inventory remains
  the same 50-shot, 250-second reel.

## Live-browser coda

The former measure/ledger/compiler abstractions became three product-specific diagrams:

1. Nine ready forms become one selected starting point: expertise becomes reusable structure.
2. Surface, edible image, bilingual plaque and decoration move around one retained cake body:
   flexibility is controlled change, not improvisation.
3. One 17-slot CakeDocument fans into the customer mockup, baker sheet and 1:1 plaque: the kitchen
   receives decisions, not a screenshot.

These scenes are live DOM diagrams of the system logic, not fabricated application screenshots.

## Fail-first verification

Structural/media gate:

- Before implementation, the new director contract went RED on six checks: version, directed
  assets, film thesis, pacing map, chapter argument and operator handoff.
- The real v1.1 source is GREEN at 30/30.
- Sabotage replaces `CST-050` and flattens the decisive shot-17 weight from `1.85` to `0.55`; the
  ordered chain and director score both go RED.

Live browser gate:

- Sabotage displaces the film frame 180px, empties the first chapter reason and removes the
  true-size plaque output. The directed browser gate goes RED on containment, chapter argument and
  bilingual production handoff: 9/57 checks fail.
- Real source passes 111/111 at 1440×1000 and 390×844.
- The independently built `dist/` page passes the same 111/111 checks.
- Checkpoints cover shots 01, 09, 17, 27, 38 and 50 at media time 2.5 seconds, reverse return to
  shot 17, the eight rhythm states, 50 unequal weights, three live coda compositions, one active
  buffer, byte-range delivery, paused video, zero `play()` attempts, Arabic RTL and coda-label
  parity, containment, horizontal fit, console and network.
- `npm run build` and the 26-story × two-language static portfolio audit pass.

## Evidence

- [Desktop directed contact sheet](assets/cake-studio-director-pass/desktop-contact-sheet.png)
- [Phone directed contact sheet](assets/cake-studio-director-pass/phone-contact-sheet.png)
- [Static verification](assets/cake-studio-director-pass/static-verification.json)
- [Static sabotage](assets/cake-studio-director-pass/static-sabotage.json)
- [Source browser verification](assets/cake-studio-director-pass/browser-verification.json)
- [Production-dist browser verification](assets/cake-studio-director-pass/dist-browser-verification.json)
- [Browser sabotage](assets/cake-studio-director-pass/browser-sabotage.json)

## Reproduce

```sh
npm run verify:cake-studio
node scripts/serve-static.mjs public 4617
npm run verify:cake-studio:browser -- --url http://127.0.0.1:4617/worlds/cake-studio.html
npm run build
node scripts/serve-static.mjs dist 4618
npm run verify:cake-studio:browser -- --url http://127.0.0.1:4618/worlds/cake-studio.html
```
