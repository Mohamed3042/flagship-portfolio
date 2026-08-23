# Cake Studio bookend scrub parity

Date: 2026-08-23
ASK LOCK: make Cake Studio's 10-clip intro and 5-clip outro scrub through decoded video with the middle reel's cadence on desktop and both phone orientations—scroll-only clock, no visible proxy, snap, recut, media change, or unrelated-world change.

## Outcome

- **VERIFIED** — The still-public v1.7.2 page reproduced the reported defect before release: phone motion was a sampled WebP atlas followed by a delayed exact-frame/still handoff; desktop motion was video decoded through a canvas handoff.
- **VERIFIED** — v1.8.0 uses one scroll-clocked direct decoded-video transport for all three profiles. The intro remains I01–I10, the outro remains O01–O05, and the 50-shot reel is unchanged.
- **VERIFIED** — There are three paused video slots per bookend: one decoded first-touch anchor and two moving slots. Blob warm-ahead is two clips; decoded preload remains one neighbour; latest scroll position wins while a seek is in flight.
- **VERIFIED** — During measured motion the v1.8 bookends paint zero atlas, poster, terminal still, or canvas frames; after stopping they produce zero source swaps and zero pixel snaps after 100 ms; `play()` is never called.
- **VERIFIED** — All 196 media/still payloads under `public/worlds/cake-studio/` are SHA-256 identical to the pre-fix ledger. Only `v17/manifest.json` changed.
- **[INFERRED]** — Option (b) was the smallest owning-stage repair: reduce the bookend director to the reel's direct paused-video scrub path. This avoids changing shared `cinema.js` and its unrelated-world blast radius.
- **[LOST]** — The owner's original physical-phone trace was not recorded; the old public bytes were instead reproduced in Chrome DPR3 touch/coarse emulation. The final human checkpoint is the three-question phone-first review sheet.

## Root cause

| Path on v1.7.2 | Owning lines on `79b33bd` | What waited / substituted | Measured owner-speed cost before fix |
|---|---|---|---|
| Desktop bookends | `cake-studio.js:1215–1240`, `1498–1543` | A paused video seek had to decode, then `seeked` / `requestVideoFrameCallback` copied the result into a canvas. The canvas, not the video, was visible. | Final cadence-v2 owner trace: intro 37 non-video paints / two stop-surface snaps; outro 129 / two. |
| Phone bookends | `cake-studio.js:807–850`, `1002–1035`, `1131–1212` | While velocity was high, a 384×216 sampled WebP atlas was visible. A 180 ms velocity/settle timer then sought the 15 fps phone master and finally swapped to an exact frame / terminal still. | Portrait intro/outro: `0.700` / `1.091` unique pixel hashes/s versus reel `28.756`, holds `4550.2` / `3375.3` ms, 857 / 406 non-video paints, two snaps each. Landscape intro/outro: `0.443` / `1.148` versus reel `30.057`, holds `6633.7` / `3191.9` ms, 813 / 384 non-video paints, two snaps each. |

**VERIFIED encode boundary:** all 15 active v1.7 clips and the probed `CST-001` reel reference are H.264 High, 1280×720, yuv420p, 30 fps, 150 frames / 5.000 s, GOP 15 frames (0.5 s). The retired phone masters are H.264 640×360, 15 fps, GOP 8, with 687 intro and 347 outro frames. Some WAN bookends have materially higher bitrate than the reel and therefore add decode pressure, but the matching GOP recipe and the live atlas/canvas provenance prove encode was not the owning defect.

## Implementation

- `cake-studio-bookends.js` owns only the v1.8 direct transport: paused `currentTime` seeks, last-write-wins coalescing, direct-video visibility, exact decoded neighbour handoff, first-touch anchor, one decoded neighbour, and two Blob warm-ahead fetches.
- `cake-studio.js` retains the approved 50-shot reel/orientation code and physically removes the old v1.7 proxy director. `cinema.js` and `cinema.css` are byte-untouched.
- `cake-studio.html` replaces each canvas/phone/atlas/terminal stack with three direct video slots and loads the isolated v1.8 runtime.
- `cake-studio.css` exposes only the active decoded video, keeps contained desktop / full-bleed phone cover geometry, and keeps reduced motion on endpoint posters.
- The strict cadence v2 gate measures actual browser frame-presentation tokens with `requestVideoFrameCallback`; 48×27 RGB pixel hashes remain a separate visible-content/stop-snap channel. This prevents authored identical endpoint frames from being misreported as a decoder stall while preserving their visible pixel holds in the report.

## Cadence evidence

Thresholds are unchanged: each bookend's presented unique-frame rate is at least 90% of the same-run reel, presentation hold is at most reel hold + 33.333 ms, motion uses zero non-video paints, stopping causes zero source/pixel snaps, and `play()` remains zero.

### Public before — RED

The same cadence-v2 instrument later used on the release produced `CAKE_CADENCE_RED failures=81`. Values below are `presented fps / non-video paints / total stop snaps`; every bookend had zero direct-video presentation fps.

| Profile / speed | RED intro | RED outro | LIVE intro: fps / reel ratio / hold | LIVE outro: fps / reel ratio / hold |
|---|---:|---:|---:|---:|
| desktop / slow | 0.000 / 177 / 0 | 0.000 / 198 / 0 | 31.752 / 4.908 / 25.1 ms | 61.039 / 9.434 / 25.1 ms |
| desktop / owner | 0.000 / 37 / 2 | 0.000 / 129 / 2 | 28.355 / 3.412 / 20.8 ms | 55.693 / 6.702 / 758.3 ms |
| desktop / fast | 0.000 / 208 / 1 | 0.000 / 139 / 3 | 23.912 / 3.155 / 545.9 ms | 54.860 / 7.239 / 16.6 ms |
| phone portrait / slow | 0.000 / 1702 / 2 | 0.000 / 881 / 2 | 29.937 / 5.031 / 20.9 ms | 35.140 / 5.905 / 29.2 ms |
| phone portrait / owner | 0.000 / 842 / 2 | 0.000 / 441 / 2 | 32.465 / 6.880 / 29.2 ms | 33.196 / 7.035 / 37.5 ms |
| phone portrait / fast | 0.000 / 287 / 2 | 0.000 / 148 / 2 | 17.233 / 3.839 / 108.4 ms | 35.099 / 7.819 / 29.2 ms |
| phone landscape / slow | 0.000 / 1589 / 2 | 0.000 / 836 / 2 | 31.826 / 7.199 / 33.3 ms | 33.752 / 7.635 / 33.4 ms |
| phone landscape / owner | 0.000 / 792 / 2 | 0.000 / 418 / 2 | 17.237 / 3.600 / 37.6 ms | 33.954 / 7.091 / 29.2 ms |
| phone landscape / fast | 0.000 / 272 / 2 | 0.000 / 141 / 2 | 17.679 / 3.344 / 37.6 ms | 36.129 / 6.834 / 25.0 ms |

### Release bytes — GREEN

| Surface | Result | Minimum bookend/reel cadence ratio | Maximum bookend presentation hold | Non-video paints / stop snaps |
|---|---:|---:|---:|---:|
| source | GREEN | 3.0533 | 45.9 ms | 0 / 0 |
| production build | GREEN | 2.7219 | 41.7 ms | 0 / 0 |
| staged Pages tree | GREEN | 2.2910 | 62.5 ms | 0 / 0 |
| public live URL | GREEN | 3.1554 | 758.3 ms | 0 / 0 |

The two long live desktop holds remained below the same-run reel holds: owner outro `758.3 <= 1300.1 + 33.333 ms`; fast intro `545.9 <= 4016.9 + 33.333 ms`. Phone bookend maximum was 108.4 ms. All 54 GREEN bookend segments (three profiles × three speeds × two bookends across three local surfaces and live) had zero proxy paints, source snaps, pixel snaps, `play()` calls, and network/page errors.

## Manifest and media custody

- Schema/version: `cake-studio-bookends/v1` / `1.7.2` → `cake-studio-bookends/v2` / `1.8.0`.
- Active transport contract: `direct-video-anchor-three-slot`, clock `scroll`, slots `3`, decoded preload window `1`, Blob warm-ahead `2`, seek coalescing `last-write-wins`, visible proxy `none`, profiles desktop / phone portrait / phone landscape.
- `phoneMaster`, `phoneScrubAtlas`, and `phoneTerminalStill` moved to `retiredDelivery` with `status: inert`, `active: false`, reasons, and their exact old SHA-256 hashes. No throw was bypassed; the strict verifier now enforces the v2 contract and rejects proxy resurrection.
- Pre-fix ledger: 197 files. Post-fix ledger: 197 files. Difference count: one manifest (`b16f225fbbe46633c4c5511b671155d3d3fe628baeb4e79974449bb00b130cf9` → `564a73da0e2ef2433e10e7243ad03a75558aa830a2e5fe3ff68a745ba3238bd8`). Media/still payload differences: zero.
- Windows source/Pages checkout SHA-256: HTML `7f1fee9863f16e94fbfb30f78106d3a05b8b8d6f5517ed64fab4c98e9fe3b749`; CSS `1f8d5c61c09462c5209e55b8d303efe0b4942c56093db3539f3febe37beb22c5`; reel JS `5c283e2dac691d3369252599044ba1dc6233755fd0d3932eaec9300ad8d9096b`; bookend JS `cb7b33275a51a680b06c48b488790890c14d26e32a011de4b4e693b839163d82`; manifest `564a73da0e2ef2433e10e7243ad03a75558aa830a2e5fe3ff68a745ba3238bd8`.
- Pages Git-blob and public-live SHA-256 are byte-equal: HTML `137b662a879394620ebaad68c1b674eec4453563fc988c4a293656d22bf6840e`; CSS `18e458dd2c21fbd5b60753f0df56cd8c81c24cc51e7a401645e6cc512c20cb6a`; reel JS `5c283e2d…`; bookend JS `cb7b3327…`; manifest `564a73da…`. The HTML/CSS delta from checkout hashes is Git line-ending normalization, not a content delta.

## Verification and publication

- **VERIFIED fail-first:** shell sabotage reintroduced a proxy and failed; browser sabotage injected a retired atlas and failed 22 strict checks; the old public page is RED under cadence v2.
- **VERIFIED static/media:** `CAKE_STUDIO_V18_SHELL_OK`, `CAKE_STUDIO_BOOKENDS_PASS`, `WAN_PACK_GATE_OK`, `V17_MEDIA_GATE_OK`, and `CAKE_STUDIO_V17_PHONE_MASTERS_OK`.
- **VERIFIED production build:** `npm.cmd run build:ghpages` built 56 routes; the five active Cake files are byte-equal between source and `dist`.
- **VERIFIED rendered browser:** source, production build, staged Pages tree, and live URL each passed all 205 strict browser checks. The live run covered six profiles, 62 screenshots, all 15 active clip ranges with HTTP 206, exact decoded CST-001/CST-050 anchors, reduced motion, Arabic layout, and zero browser/network errors.
- **VERIFIED orientation:** build, staged, and live orientation gates are GREEN with zero failures across portrait ↔ landscape restoration and reduced-motion restoration.
- **VERIFIED publication:** implementation `79b426ac4fc7ce97ea615246a25c2d06066b61f1`, PR [#28](https://github.com/Mohamed3042/flagship-portfolio/pull/28), merged main `e6dab0857bde077a9d738b75061051812c4a2a73`; selective Pages commit `8edff86492602e4072250e1de0de3c3817160961` reached legacy Pages status `built`.
- **VERIFIED public URL:** <https://mohamed3042.github.io/flagship-portfolio/worlds/cake-studio.html>. Its five active file hashes equal the Pages commit blobs.
- **VERIFIED human handoff:** the live page was opened at `#top` before `REVIEW_SHEET_cake-bookends-v1.html`. The one-page sheet has exactly three questions, an automatic “I can't tell” choice, keyboard navigation, and a validated JSON export. Physical-phone judgment remains intentionally pending.
- **VERIFIED evidence custody:** the compact committed packet contains the live contact sheet, cadence summary, and source/Pages/live hash ledger. The complete 1,099-file / 2,225,240,218-byte diagnostic corpus was preserved (not deleted) at `C:\Users\GAMING\Documents\Codex\2026-08-23\cake-bookends-scrub-parity\evidence-archive\cake-studio-bookend-scrub-parity`.

## Rollback

- Source: `git revert -m 1 e6dab0857bde077a9d738b75061051812c4a2a73` on a clean branch from `main`, then merge normally.
- Pages: from a clean worktree based on the published `gh-pages`, `git revert 8edff86492602e4072250e1de0de3c3817160961` and push. No force push and no media restore are required because the release does not change media bytes.

## Deviations and NEVER receipt

- **VERIFIED deviation from the initial cadence v1 instrument:** raw unique pixel colors conflated a newly presented decoded frame with an adjacent authored frame containing identical pixels. The v2 gate grades actual browser presentation tokens and retains raw pixel cadence/holds separately. The thresholds were not lowered.
- **VERIFIED deviation from the hardware diagnostic:** one visible-hardware run hit the authored I05 endpoint pattern at a sampling alias. Quantising playback timestamps fixed that hold but made the unchanged low-motion outro fail; that product experiment was fully reverted. Release runtime hash returned to `cb7b3327…`.
- **VERIFIED:** Questions asked: zero. Assumption 1 (all media/copy/order/timing unchanged) and assumption 2 option (b) were explicit in the dispatch and preserved.
- **VERIFIED:** `NEVER = 0 items confirmed`: zero generation; zero own-clock playback; zero proxy paints in final motion; zero clip/reel/phone-master/still/copy/order/timing/framing/reduced-motion changes; zero `cinema.js` / unrelated-world edits; zero manifest/verifier bypass; zero `git add -A`; zero destructive deletion.
