# DEEP FIELD — Director's brief, Round 3

Same roles and rules as `r01-brief.md` (§2, §3, §5 govern). Work on `feature/deep-field`.
Stop rule at the end. This round is CONTENT, ordered by the owner in his own words; the
look from Round 2 is accepted and must not regress.

## Round 2 verdict

Accepted: the three-population field with the band, the hand-drawn constellations (folder
and magnifier, gated flow, hub, storefront, cake, carton that unfolds, pen, truss), the
alternating zones and display type, CLS 0, 489/489, the haze delta with its controls.
This is the visual language of the site now. Keep every part of it.

Rejected by the owner: the career film on the Film plane and the nine "earlier work on
film" pages. They are old locally rendered trials made before he knew a local Blender
render cannot compete with generated video. They leave the landing entirely (do not delete
the pages; unlink them from this surface). The `src/assets` copy of the 720p film and its
poster go too.

## What the owner wants on the landing, in his order of pride

Sources are listed so nothing is invented. Every caption line on the page must trace to a
file; put the provenance table in the report (item, line, source path), never on the page.
Public-safe only: no private data, no ripped or third-party art, no company logos, no
named people or cloned voices.

1. **Worlds** — his confirmed cinematic scroll worlds, five of them: the cake world,
   the kingdom of running things, the doll / threads world, the Harry-Potter-like world,
   the Spotify world. Live at `https://mohamed3042.github.io/flagship-portfolio/worlds/`;
   the sources and their key frames are in this repository (worlds pages and assets) and
   in `Downloads\flagship-sss`. Resolve the real slugs and titles from the live index and
   the repo, take each world's own key frame (his generated art: allowed), and link each
   portal to its live world page. Only these five. Worlds that were locally rendered
   trials are not featured; if a slug is ambiguous, the memory note
   `C:\Users\GAMING\.claude\projects\C--Users-GAMING-Downloads-website\memory\worlds-quality-verdicts.md`
   records his verdicts.
2. **Games** — the four games he built: WAR STRIKES (Unreal Engine 5.8), Cocolani 3D
   (Godot 4.7), ARTILLERY3D (Godot 4.7), Polyblast Arena (Godot 4.7). Facts from
   `C:\Users\GAMING\Downloads\website\CLAUDE.md` (project table), `Downloads\website\memory\`,
   and the auto-memory index at the path above (`warstrike-*`, `cocolani-*`,
   `artillery3d-*`, `polyblast-*`). Word them truthfully as remakes or re-implementations
   where that is what they are; engine, scope and what was built are the substance
   (tests, networking, pipelines). No screenshots: figures only.
3. **MK Voice** — private voice engine; the owner calls its features unique. Sources:
   `mk-voice-project.md`, `mk-voice-versions-1180.md`, `mk-voice-quality-audit-20260918.md`
   in the auto-memory folder, plus the project's own README if the path there resolves.
   Describe the engineering (pipeline, versions, measured quality gates), never a voice, a
   person or a dataset. Caption ends "Private build. Demo on request."
4. **Tools** — the skills and automations he built to skip repetitive work: the Claude
   Code skills under `C:\Users\GAMING\.claude\skills\*\SKILL.md` (name and description
   from the frontmatter) and `Mohamed3042/agent-brain`. Pick 10–14 whose names and
   descriptions are public-safe (skip anything about job hunting, personal devices,
   private clients). Show them as a constellation of labelled stars, one line for the
   whole chapter.
5. **Systems** — the Round 2 figures stay, but at most five: keep the five the site's own
   featured order ranks first.
6. **Public work** and **Contact** as shipped.

## Chapter design

- Worlds are **portals**, not figures: as the beat arrives, stars gather into a ring (an
  aperture, 40–48% of viewport height, slightly elliptical, breathing), the world's key
  frame fades in inside it with a hairline rim, held for the reading window, then the ring
  releases into the field. Title, one line, "Enter the world →". Five portals in a row of
  beats; alternate zones as before.
- Games, MK Voice and Systems are **figures** in the Round 2 language. Draw each game from
  its real subject (an arena with a reticle, an island under a sky, a shell on its arc, a
  low-poly arena); MK Voice is a waveform on a timeline with a gate mark. List every new
  figure in the report with one line of reasoning.
- Tools is a **labelled constellation** like Public work: 10–14 anchors, hairlines, HTML
  labels registered to the camera, each label linking to its repo page when public.
- Order of the flight: hero → Worlds (5) → Games (4) → MK Voice → Systems (5) → Tools →
  Public work → Contact. Region title cards are not wanted; the seek nav is the map.
- Length budget: the runway at most 36 viewport heights on desktop; derive the assembly,
  hold and release distances from that and report the total height. Assembly must still
  read as motion on a real wheel; the Round 2 minimums stand.
- LESS TEXT: a title, one line, one or two links per beat. Nothing else.
- EN and AR: every new line ships in both, Arabic written properly, not machine-mangled;
  product names stay Latin.

## Harness and budgets
Extend `test-signal.py` for the new beats (portal presence and the image decoded before
its blend rises above 0: the old plate trap; label registration for Tools within 4 px;
no dead links; both languages). All Round 1 budgets stand; JS may rise to at most 350 KB
gzipped as before; key frames served as AVIF or WebP at most 250 KB each, lazy below the
fold. Draft deploy again; URL in the report.

## Evidence packet, `docs/deep-field/r03/`
Items 1–7 as in r02 (the figures sheet now has one cell per beat, portals included), plus:
8. `portals-desktop-en.jpg`: the five portals at held pose, one row, so the world art is
   judged at full cell size.
Report adds: the provenance table, the figure list, the total runway height, and the
list of exactly what was unlinked from the landing.

Send the sheets to the owner with SendUserFile, summarise in at most 150 words, STOP.
Do not start Round 4 (real phone, the Arabic pass, accessibility, archive re-tone, then
the merge and deploy decision with the owner).
