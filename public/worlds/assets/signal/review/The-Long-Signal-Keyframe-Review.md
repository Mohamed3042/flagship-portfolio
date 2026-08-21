# THE LONG SIGNAL — Phase 1 hostile still review

Status: `AWAITING_APPROVE_STILLS`

Phase 2 is blocked by the mandatory approval gate. WAN credits actually spent: **0**. The owner generation board, WAN clips, page, film integration, build, and deployment have not started.

## Mechanical proof

- `GREEN_SELFTEST quality gate rejects synthetic black and uniform frames`
- `GREEN_VERIFY 41/41 unique RGB frames exact 1920x1088`
- Expected/actual: 41/41 PNG stills, all `RGB`, all `1920x1088`, 41 unique SHA-256 hashes, 0 missing, 0 extra, 0 errors.
- Lowest accepted mean luminance: 1.45 (intentional sparse-space frame KF34).
- Lowest accepted internal edge standard deviation: 6.52; the flat/soft rejection floor is 4 after excluding the synthetic border edge.
- Landscape contact sheet SHA-256: `d0c57d1ba6bc11e239f8bd147ce44470d3f83505972508a490c97ced09be2fe8`.
- Portrait contact sheet SHA-256: `b8b07bb3bb5e62d8ee74e276a612f425f11ca7ce425204bfed66c966a54d0dea`.

The immutable evidence report is `keyframe-qa.json`. The pre-generation fail-first report is `fail-first-keyframe-qa.json`; it failed on all 41 missing declared frames before generation.

## Hostile visual verdict

Landscape review: **41/41 pass**. Portrait center-crop review: **41/41 retain the story-critical action**. No accepted frame contains rendered UI text, names, numbers, logos, franchise marks, unintended horror, an unresolved melted prop, or an unreadable accidental-black composition.

Continuity locks observed across the chain:

- Home: same dust-front farmland, workshop, mast, warm window, horn, glass dust plate, and slate language.
- Traveler: same charcoal faceless pressure-suit vocabulary and correct gloved-hand treatment.
- Craft: same rigid matte-grey utilitarian silhouette and hull-mounted camera language.
- Light: cold grey exteriors/cabins with practical warm amber signals; no fantasy-color drift.
- Archive: warm open cells and blank physical slates; no prison, crypt, hospital, or torture-room read.
- FLF anchors: KF01, KF08, KF16, KF22, KF26, KF34, KF40. KF31 is the separate proof/poster landing.
- Loop closure: KF01→KF40 downsampled luma correlation `0.999206`; normalized MAE `0.007575`. Composition is retained while mast and window share the final amber pulse.

## Hard-count and causal gates

| Frame | Required proof | Verdict | Accepted SHA-256 |
|---|---|---|---|
| KF16 | Exactly five worlds plus one distinct dark accretion object; craft below | PASS in landscape and portrait | `d20fae33d4c222dfc6534a84d1a020309829071886ec1969d8025af3c78dbdb3` |
| KF26 | Exactly five worlds, exactly five separate beams, one convergence point, one dark ring object, one craft | PASS in landscape and portrait | `32f383b3defbe00a5ad9e4f7dc9758875f1bd017f9c12f797d046ce53dde14d6` |
| KF31 | One complete gloved hand causally nudges physical dust into a standing waveform beneath the horn | PASS in landscape and portrait | `c97dcffe14a8207ecf6cb26528399ac13031547d5d6156a092dae97f8d77c766` |
| KF38 | Exactly five complete hanging suits, five dark visors, five visible rail hooks, no sixth suit or occupant | PASS in landscape and portrait | `2761ec458d7cb37b40fa06ac79bfaf7f7f8338b7d7b1f579023a3dca382bedf0` |
| KF40 | Same held return composition as KF01 with synchronized mast/window pulse | PASS | `60a1904ec44507a71abac0649bd128b911bc9a2f538d74b2e1b0be986d4430f8` |

## Rejected attempts and fixes

Rejected pixels are retained under `rejected-v1/`; none are in the accepted chain.

| Frame | Rejected problem | Accepted resolution |
|---|---|---|
| KF08 v1–v4 | Phone crop failure, then missing craft/station, missing station, and missing beacon | v5 contains one planet, one beacon, one ring station, and one craft in the center crop |
| KF11 v1 | Full-body silhouettes and pseudo-writing created a horror/interrogation read | Warm open archive corridor, blank slates, simple line marks, close hand/pen shadows only |
| KF13 v1–v2 | Reversed travel geography, then target/craft failed the phone crop | Ring below, craft climbs away, target glint above; all survive portrait |
| KF17 v1 | Floating sea tableau omitted the craft | Hull/landing hardware added while island and matching shadow remain causal |
| KF20 v1–v2 | Missing hand/pylon, then phone crop failure | One five-finger glove, one mask, one pylon, flat reflection; wipe action centered |
| KF21 v1 | Survey pylon read as a spear/weapon | Blunt tripod survey instrument with clear scientific use |
| KF23 v1 | Frozen forms read as living astronauts trapped in ice | Exactly three nonliving articulated garment mannequins with stands and visible joint gaps |
| KF26 v1–v2 | Extra rays/trunk, then two worlds fell outside portrait | Exactly five compact worlds and five countable beams survive portrait |
| KF37 v1–v2 | Slate rack/window were amputated by portrait crop | v3 vertically clusters window, framed dust plate, machines, and blank slate rack |
| KF38 v1–v2 | Five-suit count passed, but crop removed outer suits and bodies read too occupied | v3 preserves exactly five complete slack hanging suits, hooks, dark visors, and all bodies in portrait |

## Approval boundary

Only the still chain and its local review evidence exist. Do not create the owner WAN board or spend WAN credits until Mohamed replies exactly: `APPROVE STILLS`.
