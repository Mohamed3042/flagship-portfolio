# Round 06 — the object determines the unfolding

Direction: the owner's Round 06 brief (2026-09-18), given directly in the working session
rather than through the director pack. Two decisions the owner made the same day: the
Sync (Montage Pro) chapter leaves the cinema, and delivery is commit, push and a reply on
[PR #32](https://github.com/Mohamed3042/flagship-portfolio/pull/32). No merge, no deploy.

## The brief, and where each sentence landed

| The brief asked for | What the build does | Where |
|---|---|---|
| A planetary body that is not a generic sphere: grazing detail, a controlled gradient, one impossibly clean silver-blue rim; type tiny against it | The mass is a custom shader: a very dark graded body with a terminator, relief from a CPU-made three-octave noise texture that only shows where the light rakes the surface, a Fresnel razor rim toward the light, a thin haze shell just outside it, and one flare sprite where the light grazes the limb hardest. No hash noise compiles in GLSL. | `index.ts` (`massFragment`, `hazeFragment`, `noiseTexture`, `flareTexture`) |
| The lit edge fractures into a small number of deliberate metallic fragments — not a particle explosion | Nine fragments, each a tapered bar with a morph target that bends it to the ring's radius at its own depth. They sit on the limb glowing like the rim, lift off as the rim goes dark, and cool to metal on the way. The point cloud is dust for scale only: its size and weights dropped, and it is 12% ring-anchors plus faint scatter. | `shapes.ts` (`RING`, `shardRing`, `shardRim`), `artifacts.ts` (`sliverGeometry`, the fragments block) |
| Those fragments become the aperture; the camera moves through the thing that was already there | The fragments are placed along the alignment camera's viewing rays, so from the held pose they project to one broken ring and from any other they are a tunnel. The camera holds until the ring has formed, then goes through, the near pieces passing within a third of a unit. | `chapters.ts` (`forge`, `FORGE_HOLD`), `shapes.ts` (`selfCheck` proves every fragment projects to the same ring) |
| The aperture's silver becomes part of the workflow structure | The same nine meshes travel into the deck's two rails, the gate's two posts and header, and four corner stanchions; their morph influence returns to straight on the way. One `silver` material for the rim pieces, the rails, the nodes, the jaws and every screen bezel. | `shapes.ts` (`STRUCTURE`, `SLOT_OF`), `artifacts.ts` |
| Approach one structural edge extremely closely; the lighting changes; the surface becomes fibrous; the edge reveals thickness; it was a paper fold | The matter chapter's camera dives onto the front rail with a pace curve that decelerates into a creep. During the dive the rail's silver fades as paperboard fades in on the same line, and a low raking spot rises. The rail is the carton's front return: a 180° fold with a rounded crease and a cut end showing the board's core. | `chapters.ts` (`macroPace`), `artifacts.ts` (`graze`, `ret`, `hinge`) |
| Pull back and discover the carton forming around it; paperboard as a luxury hero object | A cake carton (front-opening) folds up around the seam as the camera pulls back: base, side walls, back wall, dust flaps, lid, tuck. The board carries a 512² CPU-generated fibre normal map and a roughness map derived from the same height field, rounded hinge creases, soft crease shadows on the base, paler cut edges, a dark printed interior, a contact shadow, and its own warm key and fill. | `artifacts.ts` (`paperTextures`, the carton block) |
| The carton gives the next threshold; warm light appears; we move through into the existing Cake Studio world; near geometry occludes far, lateral move shows parallax, warmth contaminates the cool material before the crossing | The world chapter turns to the box at rest, lifts the tuck and lid and drops the front wall. A warm key and a glow inside rise with the opening; the shared cool rim light dims and the hemisphere tint warms against the stage's `warmth()`. The camera swings across the opening's axis, crosses the sill, and the box scales into a hall (wider and much deeper) whose far wall is the published Cake Studio frame (CST-048), handed off to the crisp HTML plate at the reading stop. | `artifacts.ts` (room block, `warmth`), `index.ts` (rim light / hemisphere against warmth), `chapters.ts` (`world`) |
| On phones the portal owns the field during the approach; the reading stop restores everything; reveal and reading are different compositions, throughout | `data-mode="reveal"` and `"reading"` on the stage, switched by the reading stops. Reveal shows the line, the project name and the navigation; reading restores blurb, figure, boundary, disclosure, evidence captions and actions. The camera's free box is measured per composition and per caption phase, so the fit never targets a paragraph that is not being read. | `index.ts` (`setMode`, `copyBand`), `signal.css` (`[data-mode=reveal]`) |
| One Alche moment: a chapter title takes physical depth, reflective, then clears so the project is the hero | The forge chapter's line, "From signal to systems.", is drawn on canvases in the page's real display face (Inter Variable 850 / Al Rai Media in Arabic), as reflective planes with a seven-layer extrusion behind each word, inside the ring. The words separate in Z as the camera flies through and clear before the workflow arrives. The page keeps the same words as the chapter's `<h2>` with transparent ink, so search, seeks and screen readers keep them. | `artifacts.ts` (`buildTitle`), `signal.css` |
| Rhythm: spectacle → stillness → evidence → transformation → spectacle → stillness | horizon (spectacle) → forge (transformation, no copy) → system (stillness, evidence) → matter (transformation into a calm object stop, then evidence) → world (spectacle into a calm stop) → archive (stillness). Six chapters. | `chapters.ts` (`CHAPTERS`) |

Nothing is swapped at a chapter boundary: the fragments, the workflow, the carton and the
room are one scene graph (the `object` artifact) that lingers into the horizon and the
archive, so the pieces are already on the rim before they break and the hall dissolves
behind the camera as the constellation forms.

## What is in here

| Path | What it is |
|---|---|
| `after/sheet-{desktop,mobile}-{en,ar}.jpg` | Contact sheets: every pose in reading order, each tile labelled with progress, chapter, composition and the plate's handoff/fit state. |
| `after/{desktop,mobile}-{en,ar}-<pose>.jpg` | The same poses one per file at 1440×900 and 390×844. |
| `after/signal-realtime-{desktop,portrait}.mp4` | Real wheel input with direction changes and voluntary stops, encoded at the frames Chrome presented. |
| `after/realtime-report.json` | Observed cadence and every gap over 100 ms matched against the input timeline. |

`.impeccable/review/round06/` (local, not committed) holds the suite's own captures and `signal-report.json`.

## Gates

- `npm run typecheck` exit 0 (isolated `.typedeps` declarations, unchanged).
- `npm run build` 80 routes; `node scripts/verify-portfolio.mjs` green.
- `python scripts/test-signal.py --round round06`: **396/396** at 1440×900 and 390×844, EN and AR. New in this round: the two compositions are read from the rendered page (reveal collapses the explanation, reading restores it; the approach to the world is a reveal), and the copy band the camera is fitted against is keyed by caption phase, which is what closed a plate/narration overlap on Arabic portrait at the proof stop.
- The mechanical detector ran once on the changed UI files: advisories only (the fluid display clamps and the 14px cinema body size, both documented in DESIGN.md), no bans.

## Cadence (headless Chromium, software rasteriser, one Windows machine)

| View | Wall clock | Observed fps | Median gap | p95 gap | Gaps > 100 ms | of which during input |
|---|---|---|---|---|---|---|
| Desktop 1440×900 | 50.9 s | 83.3 | 9.1 ms | 15.1 ms | 20 | 7 |
| Portrait 390×844 | 48.9 s | 78.7 | 9.4 ms | 15.0 ms | 16 | 4 |

These are CDP screencast cadence numbers, not display refresh, GPU frame time or input
latency, and no physical device or Safari was involved. The gaps during input are one-time
costs where a texture first reaches the GPU (the Cake Studio frame, the title canvases)
and the object stage's construction at load; they are recorded, not explained away.

## Review

Two independent finish reviews, working from the captures and the direction contract and
never from the build conversation, plus two verdict passes on the recaptures:

1. The first full review returned **rebuild**, scoped to the material layer: the rim read
   as a soft band, the flare was occluded, the fragments and rails read matte, the paper
   fibre was too faint, a placeholder panel sat on the carton, the copy scrim showed an
   edge, the arrival captures drew under the grid, the title planes read flat. The
   material layer was re-derived; composition, timeline and modes were kept.
2. The second full review returned **fix** with seven items. The two metal items had one
   cause worth recording: the physical material's anisotropy path renders black on the
   software rasteriser the gates run on, so the shared silver is on the standard material
   against a bright reflection environment, which every backend shows the same way.
3. Verdict pass one scored the fragments resolved and the rest partial; verdict pass two
   scored the portrait horizon, the copy field, the board, the flare and the title spacing
   **resolved**, and left three open:

| Open item | State | What it would take |
|---|---|---|
| The rails at the workflow reading stop read darker than the posts and fragments | partial | They are seen along their length and reflect the environment's floor; a camera-side fill, or a normal break-up on the bars, would give them the band the fragments have. |
| The title planes do not read reflective in the shipped captures | unresolved | They face the eye exactly, so their reflection is the environment behind the camera; tilting each word a few degrees, or a pre-lit face texture, would show the band. |
| The fragment that becomes the back rail dominates the .27 pose while it travels | partial | Route its path lower, or stretch it even later. |

That is the review budget for this round. The owner decides whether to fund another pass
or accept these as recorded.

## What was not measured

Physical iPhone Safari, a real GPU's shading of the metal and the normal-mapped board,
battery, and the owner's own eye on the paperboard against the native reference. The
material work is bounded to what the brief named; the owner judges whether it reads.
