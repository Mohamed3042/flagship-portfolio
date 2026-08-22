# Spotify room-wides cut — 2026-08-22

## Release state

- **VERIFIED:** the four owner-refused Cycles room sections are absent from the source and built page, and their former live paths are absent.
- **VERIFIED:** all eight refused media files plus the former theater master/poster have byte-identical archive copies under `public/worlds/spotify/archive/rendered-room-wides-20260822/`.
- **VERIFIED:** shared `cinema.js` and `cinema.css`, all seven WAN room plates, all twelve Side B legs, the finale, FLIP, and credits structure are unchanged.
- **VERIFIED:** source, build, staged Pages, and public browser gates all pass.
- **[INFERRED]:** all three new joins read as FLOWS in the engineering review; the owner sheet is the final taste authority.

## Intake and exact cut

| Refused plate | Old solo | Neighbor before | Neighbor after | Archived media |
|---|---:|---|---|---|
| `s01-line` | 2 | `room01` | `s03-room` | MP4 + JPG |
| `s03-room` | 3 | `s01-line` | `s04-arm` | MP4 + JPG |
| `s08-lanes` | 14 | `Three lanes` | `The groove canyon` | MP4 + JPG |
| `s14-chorus` | 31 | `Data-lit chorus` | `room07` | MP4 + JPG |

The fail-first public gate reported `REFUSED_ABSENT RED 4/4`: every refused plate was referenced and every MP4 returned HTTP 206. The post-cut source/build gate reports `REFUSED_ABSENT GREEN 4/4`.

## F1–F5

| Flow | Result | Evidence |
|---|---|---|
| F1 Story continuity | **VERIFIED** | Four complete plate sections and only their owning banners were removed. All surviving EN/AR pairs are 209/209. No refused caption fragment or orphaned plate wrapper remains. |
| F2 Act balance | **VERIFIED** | Plate counts by act: Prologue 7→5, Act I 4→3, Act II 4→4, Act III 2→2, Act IV 3→2. Every act retains at least one plate. Finale structure is unchanged. |
| F3 Scroll rhythm | **VERIFIED** | Desktop height 115,420→103,420; portrait 97,570→87,442; landscape 45,517→40,837. Each delta is exactly four removed 300vh plate sections. Minimum surviving scrub travel remains desktop 2,000 px, portrait 1,688 px, landscape 780 px. No horizontal overflow. |
| F4 Visual seams | **[INFERRED] FLOWS ×3** | `room01 → s04`: dark wide establishes the room, then the bright tonearm supplies the first close-up. `s07 → s09`: the quantized platter lights resolve into the green groove canyon. `room06 → room07`: purple chorus wide resolves into the needle-up record close-up. See `assets/spotify-room-wides-cut/seams/SEAMS.jpg`. No corrective slot spec was needed. |
| F5 Live verification | **VERIFIED ×4** | Source, build, staged Pages, and public each run 17 HTTP 206 probes, 51 Side A painted/paused seeks, 72 Side B forward/reverse painted checkpoints, full down/up traversal, desktop + portrait + landscape, AR/RTL, zero overflow, zero `play()` calls, and zero fatal browser errors. |

## Counts and master truth

| Surface | Before | After |
|---|---:|---:|
| Total page scenes | 36 | 32 |
| Side A page plates | 21 | 17 |
| WAN room plates | 7 | 7 |
| Cycles page plates | 14 | 10 |
| Theater Cycles shots | 15 | 11 |
| Theater frames | 2,712 | 1,920 |
| Theater runtime | 1:53 | 1:20 |

The new master is a stream-copy concat in `film_spotify.SHOTS` order with only `s01`, `s03`, `s08`, and `s14` omitted: `s02,s04,s05,s06,s07,s09,s10,s11,s12,s13,s15`. **VERIFIED:** H.264 High, yuv420p, 1280×536, 24 fps, exactly 1,920 frames / 80.000 s. SHA-256: `0C6CD8BBBFA7062A09665F4FEAB4A53F45DD4AF92C668BF14670BD9B621B5B8F`. The generated poster matches decoded frame 0 at SSIM 0.991482.

## Old → new solo map

| Scene identity | Old | New |
|---|---:|---:|
| Studio ident | 0 | 0 |
| `room01-silence-recut` | 1 | 1 |
| `s01-line` | 2 | — |
| `s03-room` | 3 | — |
| `s04-arm` | 4 | 2 |
| Silence has a line | 5 | 3 |
| `s02-pulse` | 6 | 4 |
| `room02-contact-recut` | 7 | 5 |
| Needle down | 8 | 6 |
| `s05-needle` | 9 | 7 |
| `room03-runway-recut` | 10 | 8 |
| Quantize | 11 | 9 |
| `s07-quantize` | 12 | 10 |
| Three lanes | 13 | 11 |
| `s08-lanes` | 14 | — |
| The groove canyon | 15 | 12 |
| `s09-canyon` | 16 | 13 |
| `s06-groove` | 17 | 14 |
| `room04-build-recut` | 18 | 15 |
| T01 · Consent downbeat | 19 | 16 |
| `s10-t01` | 20 | 17 |
| T02 · Delete is a word | 21 | 18 |
| `s11-t02` | 22 | 19 |
| T03 · Sixty hertz | 23 | 20 |
| `s12-t03` | 24 | 21 |
| Side B · green spine | 25 | 22 |
| `room05-lounge-recut` | 26 | 23 |
| The master fader | 27 | 24 |
| `s13-master` | 28 | 25 |
| `room06-chorus-recut` | 29 | 26 |
| Data-lit chorus | 30 | 27 |
| `s14-chorus` | 31 | — |
| `room07-needle-up-recut` | 32 | 28 |
| Needle up | 33 | 29 |
| `#flight` | 34 | 30 |
| End credits | 35 | 31 |

Granite tripwires moved exactly as expected: `room04` solo 18→15 and `room05` solo 26→23.

## Publication receipt

- Source commit: `f8fd61c8e7fbaf3d32e1e412109557b1a71d893a`
- Source PR / merge: `#18` / `c6be76b13194f4e65e620de773722156a68a33ef`
- Pages commit: `301731da40560156c3ca5ca5e45ba6c8cfad4aae`
- Pages HTML SHA-256: `FD9DFFEAB10A9EE99EE477372C02A1DB3643CB32E15E51D3B7BDEE9F98900192` (public bytes equal committed blob)
- Public URL: `https://mohamed3042.github.io/flagship-portfolio/worlds/spotify.html`
- Public four-path retirement: `REFUSED_ABSENT GREEN 4/4`; all former MP4 URLs return HTTP 404
- Review sheet: `C:\Users\GAMING\Downloads\spotify-review\REVIEW\seams.html`
- Review-sheet runtime: `PASS questions=40 keys=1-9,Enter,Space,X,I,D,0`; JSON export downloaded successfully

## Rollback — exactly three commands

1. `Copy-Item -LiteralPath public\worlds\spotify\archive\rendered-room-wides-20260822 -Destination $env:TEMP\spotify-room-wides-20260822 -Recurse -Force`
2. `git revert --no-edit -m 1 c6be76b13194f4e65e620de773722156a68a33ef`
3. `Copy-Item -Path $env:TEMP\spotify-room-wides-20260822\s*.mp4,$env:TEMP\spotify-room-wides-20260822\s*.jpg -Destination public\worlds\spotify\shots -Force; Copy-Item -Path $env:TEMP\spotify-room-wides-20260822\spotify-film.* -Destination public\worlds\spotify -Force`

