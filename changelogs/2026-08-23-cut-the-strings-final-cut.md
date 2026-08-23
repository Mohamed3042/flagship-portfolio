# CUT THE STRINGS — final cut

Date: 2026-08-23  
Owner decision: “finish it… im not generating more… some previous clips i saw was better than new made ones and vice versa let it check”

## Outcome

- **VERIFIED** — The film contains 40/40 occupied slots and a 200.000-second silent standalone master.
- **VERIFIED** — All 56 returns were SHA-256 bound; the three read-only source folders have zero measured mutations.
- **VERIFIED** — The final set is 32 sole R1 returns plus eight best-of-three decisions; “newest = best” was never used as a rule.
- **VERIFIED** — Four RED best-available defects ship visibly disclosed: 009, 016, 020, 022.
- **VERIFIED** — Forty normalized masters meet 1280×720, H.264 yuv420p, 30 fps, 150 frames, 5.000 seconds, silent, fast-start, GOP ≤0.5 seconds, watermark removed, and a frozen final 0.5 seconds.
- **VERIFIED** — Forty adjacent seams, including CTS-A-040→CTS-A-001, clear the unchanged 0.90 endpoint-correlation floor. Minimum outgoing/anchor = 0.958376; minimum incoming/anchor = 0.977216; minimum outgoing/incoming = 0.957166.
- **VERIFIED** — The page has 40 scroll-scrub videos, 41 decoded approved anchors, zero own-clock `play()` calls, zero horizontal overflow, and full forward/reverse traversal at 1440×1000 DPR1, 390×844 DPR3, and 844×390 DPR3.
- **VERIFIED** — The prepared selective Pages commit is `1986367abd782557c6a65acc5a58d81d947a6e18`; source and prepared Pages HTML are byte-equal at SHA-256 `5ca28cbe4493e50e0f19c33ecb0f6c2b1ab2cd8ee55bce0ff3b842d65591cbe7`.
- **[LOST]** — Historical exact WAN jobs and credit spend cannot be recovered without the owner’s WAN manifest.
- **[INFERRED]** — Observed minimum credits are 560: 56 returned files × the documented 10-credit base minimum. This is not exact spend.
- **VERIFIED** — No WAN, Grok, or image-generation request was submitted in this final-cut slice.

## 56-file custody and normalization receipt

- **VERIFIED** — Full source filename, source directory, size, mtime, SHA-256, chosen take, output SHA-256, and rejected-candidate table: `public/worlds/assets/strings/wan-production/custody-normalization.json`.
- **VERIFIED** — Candidate instrument and eye table: `public/worlds/assets/strings/wan-production/final-take-table.json`.
- **VERIFIED** — Raw custody copies: 40 files under `public/worlds/assets/strings/wan-production/raw/`.
- **VERIFIED** — Accepted masters: `CTS-A-001.mp4` through `CTS-A-040.mp4`, exactly 40 files under `public/worlds/assets/strings/wan-production/accepted/`.
- **VERIFIED** — Rejected candidates: 16 files — 009 R1/R2a; 012 R1/R2a; 014 R1/R2b; 016 R1/R2b; 020 R1/R2a; 022 R2a/R2b; 031 R1/R2b; 039 R1/R2b.
- **VERIFIED** — Standalone: `public/worlds/assets/strings/CUT-THE-STRINGS-FINAL.mp4`, 76,298,278 bytes, SHA-256 `524435459df0c60dec9cbe564db690cc520412fc340a1f8105eaeb20556c930e`.
- **VERIFIED** — Mapping sources: `return-frame-extraction.json` for R1; `the dools-precheck/precheck.json` for R2a/R2b filename-head mapping; `hash-ledger-56.json` for the bound 56-file ledger. No R3 filename head was present.

## Contested take table

| Label | Slot | Instrument scores | Instrument order | Eye pick | Runner-up | Eye verdict and reason |
|---|---:|---|---|---|---|---|
| VERIFIED | 009 | R1 69.506154 · R2a 69.687401 · R2b 73.685648 | R2b > R2a > R1 | R2b | R2a | RED best available — shortest dissolve; carving/hands still cross-dissolve over the wide portrait at about 2.3–3.3 s. |
| VERIFIED | 012 | R1 64.862142 · R2a 71.875099 · R2b 87.755942 | R2b > R2a > R1 | R2b | R2a | GREEN — clearest physical swatch occlusion/reveal. |
| VERIFIED | 014 | R1 66.452014 · R2a 68.010498 · R2b 46.820762 | R2a > R1 > R2b | R2a | R1 | GREEN — the previous retake beats the newer R2b; continuous pull-back and one comb action. |
| VERIFIED | 016 | R1 71.306446 · R2a 60.014696 · R2b 68.869476 | R1 > R2b > R2a | R2a | R1 | RED best available by hostile eye pass — confines the duplicate-body dissolve to about 2.9–3.6 s. This is an explicit eye override of the aggregate score. |
| VERIFIED | 020 | R1 85.792051 · R2a 70.794515 · R2b 72.088250 | R1 > R2b > R2a | R2b | R2a | RED best available by hostile eye pass — keeps head/body intact longest; late chest dissolve remains about 3.3–4.2 s. This is an explicit eye override of the aggregate score. |
| VERIFIED | 022 | R1 88.650877 · R2a 92.295333 · R2b 87.405441 | R2a > R1 > R2b | R1 | R2b | RED best available by hostile eye pass — the original beats both retakes; one solid hero, but multiple poses rather than one grounded step. |
| VERIFIED | 031 | R1 90.877458 · R2a 87.409427 · R2b 88.607074 | R1 > R2b > R2a | R2a | R2b | GREEN by hostile eye pass — the previous retake’s physical doorway wipe is cleaner. |
| VERIFIED | 039 | R1 63.066354 · R2a 77.451937 · R2b 77.401138 | R2a > R2b > R1 | R2a | R2b | GREEN — the previous retake wins the near-tie with physical walk-in and sit. |

The full 40-row table, including candidate endpoint, structural, ghost, watermark, duration, audio, source hash, and master hash fields, is `final-take-table.json`.

## R3 closure and boards

- **VERIFIED** — `clips.json` is reconciled from 44 to 40 shipped clips.
- **VERIFIED** — 012B, 016B, 022B, 039B and all six R3 rewrites are preserved in `R3-NOT-PRODUCED.json` with status `NOT_PRODUCED — owner closed generation 2026-08-23`.
- **VERIFIED** — The four approved mid-stills remain in the keyframe tree and are not film slots.
- **VERIFIED** — Main board: `public/worlds/assets/strings/wan-production/WAN-GENERATION-BOARD.html` — **this one** is the 40-card shipped-take board.
- **VERIFIED** — Archive board: `public/worlds/assets/strings/wan-production/WAN-R3-GENERATION-BOARD.html` — ten preserved cards, zero produced, disabled generation controls, hard closure banner.
- **VERIFIED** — Both boards passed a fail-first rendered browser gate: sabotage removed a shipped card and produced `BOARD_BROWSER_RED 42/46`; restored boards produced `BOARD_BROWSER_GREEN 46/46` at 1440×1100 and 390×844 with zero browser errors.

## Proof matrix

| Label | Surface | Result |
|---|---|---|
| VERIFIED | Fail-first accepted-master gate | `FINAL_MASTERS_RED accepted=0/40 missing=40 extra=0` before normalization. |
| VERIFIED | Final accepted-master gate | `FINAL_MASTERS_GREEN accepted=40/40 missing=0 extra=0`. |
| VERIFIED | Seam fail-first | Wrong KF20 anchor injected at seam 001→002: `SEAM_GATE_RED seams=40 red=1 floor=0.90`. |
| VERIFIED | Seam final | `SEAM_GATE_GREEN seams=40 red=0 floor=0.90`. |
| VERIFIED | Source page | `PAGE_PROOF_GREEN label=source ranges=40/40 viewports=3/3 scrubs=40/40`. |
| VERIFIED | Production build | `npm.cmd run build:ghpages`; Astro 5.18.2 built 56 pages successfully. |
| VERIFIED | Built `dist` | `PAGE_PROOF_GREEN label=staged ranges=40/40 viewports=3/3 scrubs=40/40`. |
| VERIFIED | Selective Pages tree | `PAGE_PROOF_GREEN label=pages-tree ranges=40/40 viewports=3/3 scrubs=40/40`. |
| [LOST] | Public URL | Not measured at the time of this pre-publish receipt; append live evidence after the Pages commit is pushed. |

Proof files are under `public/worlds/assets/strings/review/`: `final-board-browser-qa.json`, `final-seam-table.json`, `page-proof-source.json`, `page-proof-staged.json`, `page-proof-pages-tree.json`, and `page-proof/` screenshots.

## Review sheet

- **VERIFIED** — Manifest: `C:\Users\GAMING\Downloads\cut-the-strings-review\REVIEW\takes.manifest.json`.
- **VERIFIED** — Sheet: `C:\Users\GAMING\Downloads\cut-the-strings-review\REVIEW\takes.html`.
- **VERIFIED** — Eight blind A/B pairs, 25 questions, balanced pick side, reverse-keyed ghost items, mark-both tasks, “Nothing to mark,” keyboard navigation, and a 25-answer download passed with zero browser errors.
- **VERIFIED** — Next-slice input is `answers_takes.json`; score with `python C:\Users\GAMING\agent-brain\tools\review_score.py --manifest C:\Users\GAMING\Downloads\cut-the-strings-review\REVIEW\takes.manifest.json --answers C:\Users\GAMING\Downloads\cut-the-strings-review\REVIEW\answers_takes.json --overlay`.

## One-slot owner flip

**VERIFIED command template** — after `review-blind-key.json` resolves the chosen A/B side to R1/R2a/R2b, replace only that slot with the same endpoint-preserving normalization filter, then rebuild the standalone/ledgers and rerun the unchanged gates:

```powershell
ffmpeg -hide_banner -loglevel error -y -nostdin -i '<bound sourcePath from hash-ledger-56.json>' -filter_complex "[0:v]fps=30,crop=1174:660:50:0,scale=1280:720:flags=lanczos,split=2[main][end];[main]trim=end_frame=135,setpts=PTS-STARTPTS[head];[end]trim=start_frame=149:end_frame=150,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=0.466667[tail];[head][tail]concat=n=2:v=1:a=0[out]" -map "[out]" -an -frames:v 150 -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -g 15 -keyint_min 15 -sc_threshold 0 -movflags +faststart 'public/worlds/assets/strings/wan-production/accepted/CTS-A-0xx.mp4'
```

## Rollback

- **VERIFIED recipe** — source: revert the final source commit with `git revert <final-source-commit>` and merge normally.
- **VERIFIED recipe** — Pages: from a clean worktree at `gh-pages`, run `git revert 1986367abd782557c6a65acc5a58d81d947a6e18` and push the revert commit. No force push is required.

## Questions, assumptions, and deviations

- **VERIFIED** — Questions asked: 0. The owner closed the only fork: finish from existing returns, generate nothing, publish before taste review.
- **[INFERRED]** — The film is 40 slots; the four B-splits were never produced and are not empty placeholders.
- **[INFERRED]** — Aggregate instrument score is advisory when the hostile 16-frame eye grid exposes a named artifact the scalar score rewards incorrectly.
- **VERIFIED deviation from FOLLOW** — `r2_finalize.py` cloned frame 4.47 into the hold; the first unchanged seam gate found 28 outgoing anchors below 0.90. The final normalizer preserves the technical lock but freezes the measured final source endpoint instead. The same unchanged gate then passed 40/40.
- **[LOST] deviation from FOLLOW** — `claude-video-vision` returned one frame for requested multi-frame five-second watches, so it could not grade motion. Complete local 16-frame grids were used and the plugin did not override them.
- **[INFERRED] deviation from the older production prompt** — The finishing dispatch superseded unproduced R3 split cards and decorative code-scene expansion with the correct 40-slot partial the owner asked to finish.
- **VERIFIED** — `NEVER = 0 items confirmed`: zero generation/submission, zero missing slots, zero silently dropped RED take, zero prompt rewrite, zero loosened gate, zero source-oracle mutation, zero `git add -A`, zero write to another world tree, zero historical unknown rendered as 0.
