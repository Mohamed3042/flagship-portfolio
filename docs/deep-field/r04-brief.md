# DEEP FIELD — Director's brief, Round 4 (finishing)

Same roles and rules as `r01-brief.md` (§2, §3, §5 govern). Work on `feature/deep-field`.
This is the finishing round: after it the branch must be mergeable on the owner's word.
Stop rule at the end.

## Round 3 verdict

Accepted: the nineteen-beat flight in the owner's order, the provenance table, the games
and voice figures, the tools asterism, the unlinking of the film surfaces, 679/679, the
vsync-established frame times, the runway cap honoured.

Defects, in order of weight:

1. **The portals hide the art.** The ring is 405 px tall and the world's key frame inside
   it is a 327×184 thumbnail floating in the middle. The key frames are the most beautiful
   thing on the page and they read as postage stamps. Fix: the frame is seen THROUGH the
   aperture. Mask the image to the ellipse so it fills the ring edge to edge, the rim is
   the iris, nothing of the plate shows outside it. Desktop ring 50–55% of viewport
   height; phone 37% stays but with the same fill. Re-cut the frames at 2× the ring box
   (still at most 250 KB each, AVIF). The eight iris ticks get shorter and fainter; they
   read like legs now.
2. **The hold is 202 px.** A title, a line and a link cannot be read in two wheel notches.
   Rebalance each beat: hold at least 450 px, release at least 400 px, assembly gets the
   rest; if assembly then drops under 700 px, raise the runway cap to 40 viewport heights
   rather than shorten the hold. Report the new split.
3. **Tools labels are unreadable at held pose.** Labels 13–14 px, uppercase, tracked,
   ink at full alpha; leaders thinner than the labels. Same for the Public work labels.

The Academy portal: the page is 404 on the live worlds site because the 2026-09-17
Pages release rebuilt without it. The owner decides whether to restore it (a cherry-pick
of `feature/academy-proven-spells` plus a Pages deploy). Until his word, the portal keeps
pointing at the worlds floor as it does now. If his word arrives with this brief, do the
cherry-pick and the Pages deploy for that page only, verify the URL answers 200, and
retarget the portal.

## Round 4 scope

A. The three defects above.

B. **Arabic pass.** Every line on the landing proofread as Arabic written by a person:
grammar, gender agreement, no literal calques, product names stay Latin. Arabic type
runs 1–2 px larger than Latin at the same slot with a looser line-height; numerals
follow the site's existing convention. RTL at every beat: copy zone, links, seek nav,
labels of the asterisms, the language toggle. Phone AR contact sheet is mandatory.

C. **Accessibility.** The canvas is `aria-hidden`; one `h1` (the hero name), each beat a
heading in order; every link has a discernible name; visible focus rings on black (2 px
accent, offset); the seek nav and every link reachable by keyboard in reading order; the
skip link lands past the runway; no focus trapped inside the sticky stage; reduced
motion still renders every beat as a poster (capture it); contrast re-read from
`getComputedStyle` on the rendered page after the label changes.

D. **Phone as the owner sees it.** No device is attached, so: emulate 390×844 with 4×
CPU throttling and DPR 3 capped to 1.5 by the site, report p95 frame time under that;
confirm the adaptive count actually drops when frame time exceeds the phone budget
(plant a slow frame and show the count fall); confirm touch scroll on the runway is
native (no wheel-only handlers), no horizontal scroll, tap targets 44 px. The owner will
open the draft on his own phone; that is the acceptance.

E. **Archive re-tone.** The dense archive below the cinema takes the Deep Field tokens
(`#000` ground, `#F0F3F6` ink, `#8AB4FF` accent) so the canvas fade lands on the same
black with no colour step; check it in every site theme the archive supports and put one
row per theme in the packet. Hoist tokens to the nearest common ancestor, never `:root`
(old trap 6), then check the light theme for white-on-white.

F. **Ship readiness.** Rebase or merge `main` into `feature/deep-field` if it has moved;
build clean; suite green; Lighthouse on the draft (performance, accessibility, best
practices, SEO) with the four numbers in the report; a one-page `docs/deep-field/README.md`
that says what the landing is, how to run the harness, how to capture the packet, and
where the figures and portals live in the code. Then the impeccable documenter may run
once for DESIGN.md. No merge, no production deploy: the owner says the word.

## Evidence packet, `docs/deep-field/r04/`
Items 1–8 as in r03, plus:
9. `themes-archive.jpg`: the archive top under each theme, one row each, at 1440.
10. `a11y-focus.jpg`: four cells showing keyboard focus on a portal link, a figure link, a
    tools label and the seek nav.
11. `reduced-motion-en.jpg` and `reduced-motion-ar.jpg`: three beats each as posters.
Report adds: the beat split, the Lighthouse four, the adaptive-count proof, the Arabic
changes (a table of before/after lines), and a one-paragraph merge note: branch, commit,
what merging will change on the live site.

Send the sheets to the owner with SendUserFile, summarise in at most 150 words, STOP.
