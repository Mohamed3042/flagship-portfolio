# Disney II — 80-shot continuation production pack

Status: reference-ready. The 80 endpoint stills and 80 single video prompts are production inputs; the Wan clips have not been generated or accepted yet. The deployed 20-shot page is intentionally unchanged.

## Visual WAN generation board

Serve the repository root, then open:

`http://127.0.0.1:41874/public/worlds/assets/disney2/wan-production/WAN-GENERATION-BOARD.html`

The board presents all 80 jobs in the same first-frame, last-frame, prompt, copy, and generated-status form used by the Cake Studio board. Act and status filters make the queue manageable. Generated marks are browser-local operator notes; the board cannot submit a Wan job or spend video credits.

The public HTML/JavaScript shell references the canonical `production/disney-continuation-80/keyframes/` files while the repository root is served, so it does not duplicate the 200 MB reference set. An immutable source-commit raw-file fallback keeps the frames visible from a published Astro route.

## What this pack adds

- 80 linear First & Last Frame shots: `DSN2-021` through `DSN2-100`.
- 80 new endpoint stills: `KF21` through `KF100`, all 1920×960 PNG.
- 80 one-prompt files: `prompts/DSN2-021.txt` through `prompts/DSN2-100.txt`.
- Exact continuity chain: `KF01 → KF21 → KF22 ... → KF100`.
- Eight ten-shot acts, extending the finished film from 100 seconds to a planned 500 seconds (8:20), or 15,000 frames at 30 fps.

`KF01` is the existing final boundary of `DSN2-020`, because the current film returns to the sealed book. It is therefore the first frame of `DSN2-021`. Do not substitute `KF20`.

## One-clip generation recipe

For each row of `RUN-MANIFEST.csv`:

1. Select Wan 2.7 First & Last Frame.
2. Upload the named `first` PNG from `keyframes/`.
3. Upload the named `last` PNG from `keyframes/`.
4. Paste the complete matching file from `prompts/` as the one and only prompt.
5. Set duration to exactly 5 seconds, with no audio.
6. Save the result as the row's `file` value, for example `wan/DSN2-021.mp4`.
7. Record the provider task ID, seed, and result status in `RUN-MANIFEST.csv`.

Do not add a second prompt or a separate negative prompt. The physical-motion, camera, no-cut, no-new-object, text, logo, face, and watermark locks are already baked into each prompt.

## Acceptance gate for every returned clip

Reject the clip if any gate fails:

- H.264 MP4, 1358×624 delivery canvas, exactly 30 fps, 150 frames, and 5.000 seconds, matching the current film.
- Frame 0 matches the supplied first reference and frame 149 matches the supplied last reference after the standard center-crop.
- Inspect decoded frames 0, 38, 75, 113, and 149. Endpoint agreement alone is insufficient.
- One continuous physical operation and one camera move; no cut, dissolve, teleport, liquid morph, invented object, or unexplained reset.
- Motion reaches the last-frame composition by 4.5 seconds and holds through 5.0 seconds.
- No readable text, letters, numbers, subtitles, logos, faces, or watermark.
- No black frame, duplicate/frozen accident, corrupt decode, or discontinuity at either boundary.

Keep rejected results outside `wan/`. Regenerate against the same immutable endpoint pair; never edit a reference to excuse a bad result.

## Files

- `shot-manifest.json` — authoritative story, still prompt, and video prompt for all 80 shots.
- `RUN-MANIFEST.csv` — operator queue and generation provenance.
- `keyframes/` — canonical FLF reference images, including the inherited `KF01` anchor.
- `prompts/` — exactly one paste-ready Wan prompt per clip.
- `review/` — act contact sheets for visual continuity review.
- `public/worlds/assets/disney2/wan-production/WAN-GENERATION-BOARD.html` — visual 80-card operator board.
- `drafts/` — four authored 20-shot source manifests retained for traceability.
- `tools/build-pack.py` — deterministic merger and prompt/run-manifest builder.
- `tools/build-generation-board.py` — deterministic board-data builder from the canonical manifest.
- `tools/verify-generation-board-browser.py` — rendered desktop/phone interaction gate.
- `tools/verify-production-pack.py` — fail-closed manifest, image, and prompt verifier.
- `tools/make-contact-sheet.py` — rendered review-sheet generator.
- `tools/normalize-keyframe.ps1` — exact 1920×960 RGB normalization through ffmpeg.

## Rebuild and verify

From the repository root:

```powershell
python production\disney-continuation-80\tools\build-pack.py
python production\disney-continuation-80\tools\build-generation-board.py
python production\disney-continuation-80\tools\verify-production-pack.py
python production\disney-continuation-80\tools\verify-generation-board-browser.py --url http://127.0.0.1:41874/public/worlds/assets/disney2/wan-production/WAN-GENERATION-BOARD.html
```

The final required sentinel is:

```text
DISNEY_CONTINUATION_GREEN 80/80 keyframes=80 prompts=80 chain=KF01->KF100 canvas=1920x960
WAN_BOARD_BROWSER_GREEN 20/20 desktop+phone
```

## Integration remains gated

Only after all 80 MP4s pass the media and decoded-frame gates:

1. Copy accepted clips as `public/worlds/disney2/clips/DSN2-021.mp4` through `DSN2-100.mp4`.
2. Derive posters from the accepted, cropped clips—not from uncropped source stills.
3. Extend the page's chapter figures and all exact-count expectations from 20 to 100.
4. Preserve two-video selective buffering, scroll-owned paused playback, EN/AR parity, reduced-motion behavior, and byte-range delivery.
5. Run desktop, phone, reverse-scroll, decoded-pixel, zero-`play()` and HTTP 206 proof before deployment.
