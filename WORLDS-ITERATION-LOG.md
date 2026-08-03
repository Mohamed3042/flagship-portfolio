# Worlds — Iteration Log

Protocol: every world page gets ≥3 passes before deploy. Pass 1 = build-time self-check
(structure, tag balance, engine contract, EN/AR pairs, zero external requests). Pass 2 =
browser pass over every page + key scenes via the engine's `?solo=N&p=X` harness (console
clean, scene composition, motion laws). Pass 3 = live scroll-through on the deployed URL
in a real browser.

## Pass 1 — build-time (all 8)
- Contract audit: closed html, cinema.js/css linked, `.L en/ar` pair parity, disclosure,
  rail, lang toggle, no external URLs. cod/netflix/razer/spotify complete from their
  directors; samsung lacked engine+disclosure+canvas JS (added); apple cut off after s7
  (s8–s12 + runtime written to its CSS contract); astronomy was head+CSS only (full body
  + 4 canvases written to its class contract).
- netflix: fixed `transl3d` typo + missing `)` in `.g-cap-a` opacity (director's own
  dying note identified both).

## Pass 2 — browser (fixes applied)
- Engine: replaced IntersectionObserver liveness with scroll-loop center-band liveness +
  `scene:live/idle` events (IO never fires in some embedded webviews); rAF scheduler got a
  120 ms timeout fallback; added `?solo` QA harness; versioned shared assets (`?v=2`).
- disney: chain player verified (arm/live/progress); WAN watermark found bottom-right in
  all 32 clips → re-encoded with bottom crop to 1280×648 (2:1), posters + 160 s master
  rebuilt clean; GATE wax seal timing (full by p≈.88) + seat position fixed.
- lobby: 8 posters render; capture quirk in the embedded pane (black at scrollY>0) is
  pane-only, verified via tall-viewport capture.
- astronomy: `DSN·AST` chip typo → `AST · 28MM WIDE`; title, map signature (canvas
  constellation route), GATE key-turn, prove field all verified.
- apple: removed cyclic `--mf:var(--mf,1)` self-references that killed the s8 sector
  transforms; deleted a mispositioned shadow ellipse; centered s8/s12 figs; s10 hand
  circuit + s11 calibration verified.
- global: `.L` language visibility rules hardened with `!important` (scoped
  `display:block` rules were resurfacing the hidden language, e.g. apple's meter).
- samsung: orbit/frags/cosmos/aurora canvases written + verified (orbit settle, violet
  crease); netflix portal fog, spotify track duotone, cod inventory, razer room wave all
  screenshot-verified, consoles clean.

## Pass 3 — live (after gh-pages deploy)
- Recorded in DEPLOY-STATUS notes / final session report: full scroll-through of lobby +
  all 8 films on https://mohamed3042.github.io/flagship-portfolio/worlds/ in a real
  browser, EN + AR, plus video playback checks on disney (chain advance + theater).
