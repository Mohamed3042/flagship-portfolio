# DEEP FIELD — Round 2

## Shipped

Three populations in one cloud: dust 70% (0.9–1.4 px, α .25–.55), mid 25% (1.5–2.5), bright
5% (3–5, halo), 12 spiked hero stars. A star's world position is now **fixed** and only its
depth wraps — Round 1 scaled x/y *by* depth, which is why nothing moved. Density is 3D
noise: one diagonal band, clumps and rifts inside it, voids elsewhere, haze on the band.
Eleven hand-drawn figures replace image sampling: stars on strokes, 6–14 anchors, hairlines
drawn in past 60%, ±3° breathing. The carton opens into its dieline as its chapter is read.
Film parts the stars for a 16:9 plane; Public labels four anchors; Contact draws the field
onto one beacon. Copy alternates sides, titles 56 px, figures 35–47% of viewport height,
runway 16 → 32 vh.

## Budgets

`serve-static dist 4618`; `measure-deep-field.py`; `test-signal.py`.

| Bar | Measured |
|---|---|
| desktop ≤18.2 ms | **6.2** p95 |
| phone-emu ≤33.3 ms | **6.2** p95 |
| draw cost | **0.152 / 0.038 ms** (168k / 58k stars) |
| JS ≤350 KB gz | **209.6** |
| paint <1.5 s | **0.43 s** localhost |
| CLS 0 | **0** at 1440 and 390, EN and AR |
| contrast ≥4.5:1 | **18.9 / 9.8** |
| assembly ≥1,152 px | **1,153**; release **706** |
| suite | **489/489** |

## The band

Band **10.55**, void **4.50**, **delta 6.06 of 255** (desktop, field only, copy excluded).
Controls: a flat frame reads 0.00, a planted band of 10 reads 9.43, the same line rotated
90° reads −3.63, the void halves agree to 0.38. Stars carry 3.4 of it, the haze 2.7.

## The figures, and why each

| Chapter | Figure |
|---|---|
| hero | the name, 6,000 stars |
| ask-repos | a magnifier over a folder: it reads a corpus and answers from it |
| enterprise-…-templates | five nodes, one gated branch: the approval it exists to keep |
| relayops | a hub, five systems, one retry: one control plane |
| petpoint-ops-hub | a storefront, a counter, a report rising over it |
| cake-studio | a three-tier cake on its turntable: its proof view renders one |
| medmac-box-studio | a carton opening into its dieline — the fold IS the reading |
| sheep-business-management | a pen, one gate, a tally: a counted cycle, audited |
| spaceframe-world | a two-plane triangulated truss: already a constellation |
| public | four repositories as four anchors, registered to 0.05 px |
| contact | one star, weight 1.0, the only beacon on the page |

One star per 2.2 px of stroke gives **900–2,693**, not 2–5k: at 2,000 the magnifier is one
star every 1.3 px, which is a wire.

## Film source

`website\film\what-i-have-done-so-far-16x9.mp4` (1920×1080, 9,000 frames, 300 s) → 720p
H.264, **13.9 MB**, plus a poster, into `src/assets`; `public/` here is a junction into
another repo. **No audio track**, so the control is play/pause, not sound, and
`preload="none"` holds the download until the plane is half revealed.

## Red

- One cost fit of ten is non-linear (R² 0.82 at u=0); median 0.9994, the worst is reported.
- Phone figures are emulation on an RTX 5070 Ti. Round 3 owns a device.
- No frame RATE is claimed: the loop is not established to be display-locked.
- 8% of page scroll is honoured as **distance** — 1,153 px, 8% of Round 1's page. Twelve
  chapters cannot each own 13% of one page.

Draft: https://6aad81428aa7ec9721b3ca89--mohamed-mahmoud-portfolio.netlify.app/en

## Next

Round 3: a real phone, the Arabic pass, accessibility, archive re-tone.
