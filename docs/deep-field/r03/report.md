# DEEP FIELD — Round 3

## Shipped

Nineteen beats in the owner's order: hero → five worlds → four games → MK Voice →
five systems → tools → public work → contact. Worlds are **portals** — the stars gather
into an elliptical rim at 45% of the viewport (37% on a phone, where 45% would be wider
than the screen), eight iris ticks outside it, and the world's own key frame fades in
behind the closing rim once the browser has **decoded** it. Games, the voice engine and
the systems are Round 2 figures. Tools is twelve labelled stars; chips de-collide by
sliding down their leaders, never by moving the anchor. Film, its reel and its nine film
pages are gone from this surface.

## Provenance — every line on the page traces to a file

| Item | Line / fact | Source |
|---|---|---|
| Worlds order + five | the owner's own list | `docs/deep-field/r03-brief.md` |
| Cake world | title, "50 linked shots, 4:10" | live `worlds/index.html` card 09 |
| Kingdom of Running Things | title, "20 scroll-scrubbed shots", golden book | live `worlds/index.html` card 03 |
| Cut the Strings | title, "40 accepted takes… only clock" | `flagship-sss/public/worlds/strings.html` (EN only; AR written this round) |
| Academy of Proven Spells | title, "nothing is magic until it survives the proof", 14 accepted | `flagship-sss@feature/academy-proven-spells:public/worlds/academy.html` |
| The Album | title, "silence acquires a pulse…" | live `worlds/index.html` card 06 |
| Key frames | five AVIFs | see the frame table below |
| WAR STRIKES | 184 automation tests, ability-driven combat, data-driven content | `src/data/system-projects.ts` → `war-strikes` |
| Cocolani 3D | verified/inferred/lost, packaged-build audit, bilingual | `src/data/system-projects.ts` → `cocolani-3d` |
| ARTILLERY3D | 503 battle-map records, source citations, one authoritative server | `src/data/system-projects.ts` → `artillery3d` |
| Polyblast Arena | 60 Hz authoritative sim, bots, 4 maps, 9 weapons | the repository's own description, `Mohamed3042/polyblast-arena` |
| Engines (kickers) | UE 5.8 / Godot 4.7 ×3 | `Downloads/website/CLAUDE.md` project table |
| MK Voice | version ledger, four presets, warm start, held-out gates | `memory/mk-voice-versions-1180.md`, `memory/mk-voice-quality-audit-20260918.md` |
| Tool names | twelve labels | `~/.claude/skills/<name>/SKILL.md` frontmatter `name:` |
| Systems (5) | title, tag, blurb | the site's own project data, unchanged |
| Public work, contact | as shipped | unchanged from Round 2 |

Nothing private is named: no dataset, no voice, no person, no client, no company mark.
The games are worded inside the portfolio's own privacy review — War Strikes is a
code-and-docs module, not a shipped build; Cocolani 3D names no repository.

### The key frames

| World | Source | Out | Bytes |
|---|---|---|---|
| cake-studio | `worlds/cake-studio/posters/CST-047.jpg` (the index's own card) | 1180×664 AVIF | 89.8 KB |
| disney | `worlds/disney2/posters/kf-19.jpg` (the index's own card) | 1180×542 | 52.4 KB |
| strings | `worlds/assets/strings/keyframes/CTS-KF22-the-cut.png` | 1180×669 | 54.7 KB |
| academy | `academy/posters/ACA-001.jpg`, from the branch | 1180×664 | 11.4 KB |
| spotify | `worlds/spotify/live/j09-pupil.jpg` | 1180×494 | 17.3 KB |

`scripts/build-world-frames.mjs` re-cuts them. The Spotify vinyl frames carry the
service's mark, so the flight through space was taken instead: generated art, no logo.

## Budgets

`serve-static dist 4618`; `measure-deep-field.py`; `test-signal.py`; `capture-deep-field.py`.

| Bar | Measured |
|---|---|
| desktop ≤18.2 ms | **4.3** p95 (vsync established this run: ~232 fps at 240 Hz) |
| phone-emu ≤33.3 ms | **4.3** p95 |
| draw cost | **0.054 / 0.045 ms** (168k / 58k stars) |
| JS ≤350 KB gz | **214.7** |
| key frames ≤250 KB each | **89.8** worst, **225.6** for all five |
| paint <1.5 s | **0.42 s** localhost |
| CLS 0 | **0** at 1440 and 390, EN and AR |
| contrast ≥4.5:1 | **18.9 / 9.8** |
| runway ≤36 vh | **36.0** vh = **31,500 px** at 1440×900 (38 vh portrait) |
| assembly ≥1,152 px | **1,178** (window) · **802** (1%→99%) |
| release | **303** (window) · **271** (1%→99%) · hold **202** |
| portal ring 40–48% h | **45.3%** desktop · 37.1% phone |
| real input | 27.4 s, 99.4 fps observed, longest gap 40.8 ms, **0** gaps over 100 ms |
| suite | **679/679** |

The runway total: 19 beats over 36 viewport heights, 1,683 px a beat, of which the
window spends 70% assembling, 12% holding and 18% releasing.

## The figures, and why each

| Beat | Figure | Stars |
|---|---|---|
| five worlds | one aperture: an elliptical rim with eight iris ticks, and the world seen through it | 820 |
| WAR STRIKES | an arena bowl with its stands, and a reticle over the middle of it — a sight is something you look through | 2,375 |
| Cocolani 3D | an island under a sky: a waterline, land rising out of it, one tree, one sun | 912 |
| ARTILLERY3D | a shell on its arc: a barrel, a parabola, a burst where it lands | 900 |
| Polyblast Arena | a low-poly arena: a triangulated hexagonal bowl with a pit | 1,622 |
| MK Voice | a waveform on a timeline with a gate mark across it — the engine is a run of passes measured against a bar | 2,637 |
| tools | twelve labelled stars, hairlines, no drawing: the asterism IS the chapter | 900 |
| hero, five systems, public, contact | Round 2, unchanged | 150–6,000 |

Three Round 2 figures — the carton that unfolds, the pen, the truss — keep their code in
`figures.ts` but leave the landing with the sixth, seventh and eighth systems.

## What was unlinked from the landing

1. The **Film** chapter, with "Watch the career film" (`/films/my-resume.html`) and
   "All 9 films" (`#foundation`). The built landing now contains the string `films/`
   zero times, in both languages; the pages themselves are untouched and still reachable
   from their own project pages.
2. `src/assets/film/career-reel-720.mp4` (13.9 MB) and its poster — deleted.
3. The three systems past the five-beat cap: `medmac-box-studio`,
   `sheep-business-management`, `spaceframe-world`. Their archive entries below the
   cinema are unchanged.

## Red

- **The Academy is not live.** It was on gh-pages at `c4a973e`; the 2026-09-17 release
  (`b475f8a`) rebuilt that tree without it, and `worlds/academy.html` answers 404 today.
  Its portal therefore leads to the worlds floor, not to a dead link, and says so in its
  own label. The page exists on `feature/academy-proven-spells`. Restoring it is a
  cherry-pick plus a Pages deploy — a production deploy, which this round may not make.
- **The release is 303 px, not Round 2's 706.** Nineteen beats at 1,152 px of assembly
  AND 706 px of release need just over 40 viewport heights; the cap is 36. The assembly
  minimum held and the release paid for it.
- **The cost probe can no longer prove it scales.** 3.2× the stars cost 1.675× the
  milliseconds, because both draws are under a tenth of one and the barrier dominates.
  The draw passes its budget by a factor of 300 either way; the control does not pass.
- **`loading="lazy"` defers nothing here.** All five frames are fetched at first paint —
  every chapter lives inside a sticky frame at the top of the document, so the browser
  considers them in view. 225.6 KB total, measured, which is inside every budget.
- Phone is still emulation on an RTX 5070 Ti. LinkedIn answers 999 to a script and was
  not machine-checked; it is unchanged from the shipped site.

Draft: https://6aad9358cea964b1a86448b9--mohamed-mahmoud-portfolio.netlify.app/en

## Next

Round 4: a real phone, the Arabic pass, accessibility, the archive re-tone, then the
merge and deploy decision with the owner.
