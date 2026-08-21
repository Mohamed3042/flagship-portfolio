# Spotify phone cinema repair — 2026-08-21

## Scope

**VERIFIED:** This change only alters Side B transport binding in
`public/worlds/spotify.html`. Shared `cinema.js`, `cinema.css`, the approved
Side B visual treatment, and all Spotify media bytes are unchanged.

## Defect 1 — listening-room wall reads as granite

**VERIFIED:** The pre-fix deployed page was stepped through all 36 scenes with
`?solo=N&p=X` at 1440×1000 desktop and 390×844 DPR3 phone viewports. Each of
the seven Side A listening-room clips was captured at `p=.12`, `.50`, and
`.88`.

| `solo` | deployed room clip | result |
|---:|---|---|
| 1 | `room01-silence-recut.mp4` | Ribbed wall; no granite read |
| 7 | `room02-contact-recut.mp4` | No granite read |
| 10 | `room03-runway-recut.mp4` | Ribbed wall; no granite read |
| 18 | `room04-build-recut.mp4` | **GRANITE READ** — mottled left wall |
| 26 | `room05-lounge-recut.mp4` | **GRANITE READ** — mottled long wall |
| 29 | `room06-chorus-recut.mp4` | Ribbed wall; no granite read |
| 32 | `room07-needle-up-recut.mp4` | No granite read |

**VERIFIED cause class: (a), clip pixels.** The same mottling exists in raw
frames decoded directly from `room04-build-recut.mp4` and
`room05-lounge-recut.mp4`, before the browser or CSS sees them. The desktop
and phone render use the same `brightness(1.06) saturate(1.04)` filter,
`object-fit: cover`, and no `.grade` or `.grain` overlay. All seven deployed
room clips decode at 1280×660. The phone crop enlarges the affected wall but
does not create its texture.

**VERIFIED:** Side B's room-facing legs (`j01-portal.mp4` and
`j11-return.mp4`) retain ribbed/paneled walls and do not show this defect.
Therefore no Side B regeneration spend is required.

**[INFERRED] Credit boundary:** correcting the two affected Side A source
clips would cost 20 WAN credits at the project's locked 10-credit-per-clip
rate. No generation was performed here. Both clips route to the already
running Side A recut session. Any future affected Side B leg would require
owner approval before spend.

Evidence:

- [All seven phone room clips, rows p=.12/.50/.88](evidence/granite-all-rooms-phone-contact.png)
- [Raw decoded frames, columns room01…room07 and rows 0.6s/2.5s/4.4s](evidence/granite-source-decoded-contact.png)
- [Room 04 phone p=.50](evidence/granite-room04-phone-p50.png)
- [Room 04 desktop p=.88](evidence/granite-room04-desktop-p88.png)
- [Room 05 phone p=.50](evidence/granite-room05-phone-p50.png)
- [Room 05 desktop p=.50](evidence/granite-room05-desktop-p50.png)

## Defect 2 — Side B autoplay feel on phone

**VERIFIED fail-first:** Before grading, all 12 deployed Side B MP4 URLs
returned HTTP 206 with `Accept-Ranges: bytes`. The current deployed phone gate
then went RED:

- phone selected `mode-chain` instead of `mode-scrub`;
- Side B called `play()` once;
- 2 of 5 forward/reverse progress samples missed the requested leg/time.

The owning cause was the coarse-pointer branch: it shortened the runway,
called `video.play()`, and advanced legs from `ended` events instead of scene
scroll progress.

**VERIFIED fix:** Every motion-capable viewport now uses the existing
double-buffered scrub path. The active leg and `video.currentTime` derive from
the flight scene's `--p` in both directions. The chain autoplay branch and its
phone-only runway override were removed. Reduced-motion still uses the
approved still-frame mode.

Before/after:

- [Before — deployed phone chain had autonomously advanced to leg 05](evidence/before-live-sideb-phone-autoplay.png)
- [After — built phone remains paused at scroll-selected leg 01](evidence/after-local-sideb-phone-stationary.png)
- [Fail-first deployed scrub gate JSON](evidence/before-live-sideb-scrub-gate.json)
- [Post-fix built scrub gate JSON](evidence/after-local-sideb-scrub-gate.json)

## Local release gates

**VERIFIED:** `npm run build:ghpages` completed with 56 pages. All 12 built
Side B URLs returned HTTP 206 and `Accept-Ranges: bytes` before scrub grading.

**VERIFIED:** The rendered scroll matrix is GREEN on desktop 1440×1000,
phone portrait 390×844 DPR3, and phone landscape 844×390 DPR3:

- full page scroll reached the exact bottom and returned to the exact top;
- all 12 legs mapped correctly forward and reverse (72 viewport-leg samples);
- all Side B videos remained paused and `play()` was never called;
- stationary/touch-hold drift was 0.000 seconds;
- decoded frame pixels were painted at every sample and matched on reverse;
- no horizontal overflow or browser error occurred;
- phone leg 12 and the final page ending rendered without a blank video frame.

Evidence:

- [Complete rendered scroll matrix JSON](evidence/after-local-scroll-matrix.json)
- [Phone portrait leg 12 ending](evidence/after-local-phone-portrait-ending.png)
- [Phone landscape leg 12 ending](evidence/after-local-phone-landscape-ending.png)
- [Phone portrait final page ending](evidence/after-local-phone-portrait-page-end.png)

## Deployed release gates

**VERIFIED:** Source fix PR #13 merged to `main` as `760d451`. The selective
Pages deployment is `bfd5010`; its only changed path is
`worlds/spotify.html`. The deployed HTML SHA-256 is
`0E2AC875D3DBB8241962A19BC698F8DA6DBD074EC88520A2B5A3AA51166FF273`,
an exact match for the audited source/build bytes.

**VERIFIED:** Before deployed scrub grading, all 12 public Side B MP4 URLs
returned HTTP 206, `Accept-Ranges: bytes`, and the requested two-byte range.
The focused deployed phone gate is GREEN: `mode-scrub`, zero `play()` calls,
zero stationary drift, zero stationary-finger drift, and zero mapping errors.

**VERIFIED:** The exhaustive deployed matrix is GREEN on desktop, phone
portrait, and phone landscape. Each viewport reached the exact page bottom,
returned to scroll position 0, mapped all 12 legs forward and reverse, painted
decoded pixels at every checkpoint, reproduced the same pixels in reverse,
and recorded zero browser errors. The deployed portrait/landscape leg 12 and
portrait final credits were visually inspected and are intact.

Evidence:

- [Deployed focused phone scrub gate JSON](evidence/after-deployed-sideb-scrub-gate.json)
- [Deployed stationary phone frame](evidence/after-deployed-sideb-phone-stationary.png)
- [Complete deployed rendered scroll matrix JSON](evidence/after-deployed-scroll-matrix.json)
- [Deployed desktop middle peak](evidence/after-deployed-desktop-mid-peak.png)
- [Deployed phone portrait leg 12 ending](evidence/after-deployed-phone-portrait-ending.png)
- [Deployed phone landscape leg 12 ending](evidence/after-deployed-phone-landscape-ending.png)
- [Deployed phone portrait final page ending](evidence/after-deployed-phone-portrait-page-end.png)
