# Cake Studio World 09 — The Edible Compiler

> Historical v1.0 completion record. The director-led v1.1 cut supersedes the page framing and
> pacing; see [The Cake Is Made Twice](2026-08-10-cake-studio-director-pass.md). The accepted media
> chain documented below is unchanged.

Date: 2026-08-10
Source branch: `feature/cake-studio-world`
Release: `v1.0.0` / visible badge `v1.0 · WORLD 09`
Deployment: not performed

## Outcome

The owner's corrected WAN handoff is now a complete bilingual scroll-cinema world. Fifty
First & Last Frame shots form one reversible 4:10 reel across eight chapters, followed by three
live-code scenes that expose the real Cake Studio workflow: true-size output, revision proof,
inspection, and the final production receipt.

The picture is never cropped and no caption or control covers it. The same controller runs on
desktop and phone. Scroll is the only playhead; the page contains no `play()` call and the two
video elements remain paused while `currentTime` follows the visitor forward or backward.

## Media intake and normalization

- 66 files from the owner's `cakez` folder mapped to 50/50 corrected prompts.
- 16 `(1)` files were byte-identical duplicate downloads, not alternate generations.
- The new audit gate first failed on the exact 19 missing accepted slots, then passed at 50/50.
- Maximum accepted endpoint differences: first MAD 8.725; last MAD 14.485; limit 18.
- Every remaining candidate received a five-frame motion-strip review before acceptance.
- Web outputs are silent H.264, 1280×720 at 30 fps, CRF 24, faststart, 15-frame fixed GOP.
- Ten keyframes per five-second shot make reverse seeking local and responsive.
- Total deploy reel: 96,665,935 bytes / 250 seconds. Source masters remain separate.
- The fixed provider corner mark was removed before web scaling; the 50-tile corner set test is
  included below.

## Verification

Static/media gate:

- Sabotage: replaced `CST-050` in the in-memory page fixture; ordered-chain check went RED.
- Real page: 26/26 GREEN, including ordered media/poster chain, bilingual shot copy, accepted
  ledger, hashes, dense silent encodes, contained frame, no autoplay path, and lobby truth.

Live browser gate:

- Sabotage: translated the live film frame 180px; three containment checkpoints went RED while
  shot identity, timing and no-autoplay checks remained green.
- Real page: 53/53 GREEN at 1440×1000 and 390×844.
- The production `dist/` artifact independently passed the same 53/53 browser run.
- Shot/time checkpoints: 01 @ 2.500 s, 35 @ 2.500 s, 50 @ 2.500 s.
- Reverse checkpoint: 50 back to 35 @ 2.500 s.
- One active video buffer, `seekable.length === 1`, every video paused, zero intercepted
  `play()` calls.
- Byte-range server response 206; 0 console errors, 0 page errors, 0 bad responses, 0 failed
  requests, 0px horizontal overflow in English and Arabic RTL.

The first visual capture found the desktop opening sheet crossing its explanatory paragraph. The
sheet rig was lowered and the complete 53-check browser run passed again after the composition fix.

## Evidence

- [Desktop contact sheet](assets/cake-studio-world/desktop-contact-sheet.png)
- [Phone contact sheet](assets/cake-studio-world/phone-contact-sheet.png)
- [Worlds lobby](assets/cake-studio-world/lobby-desktop.png)
- [50-clip watermark set test](assets/cake-studio-world/watermark-set-test.png)
- [Static verification](assets/cake-studio-world/static-verification.json)
- [Browser verification](assets/cake-studio-world/browser-verification.json)
- [Production-dist browser verification](assets/cake-studio-world/dist-browser-verification.json)
- [Browser sabotage proof](assets/cake-studio-world/browser-sabotage.json)
- [Media verification summary](assets/cake-studio-world/media-verification.json)

## Reproduce

```sh
node scripts/audit-cake-studio-media.mjs --source /path/to/cakez --skip-sheets
node scripts/build-cake-studio-media.mjs
npm run verify:cake-studio
node scripts/serve-static.mjs public 4617
npm run verify:cake-studio:browser -- --url http://127.0.0.1:4617/worlds/cake-studio.html
npm run build
npm run build:ghpages
```
