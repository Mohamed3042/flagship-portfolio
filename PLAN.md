# PLAN — Eight Worlds, One Cinema

**Author:** Claude (Fable 5), directing autonomously on behalf of Mohamed Mahmoud.
**Date:** 2026-08-03
**Mission:** Finish the portfolio's cinematic layer designed in `wan-production-bible/` — without asking the owner to generate another frame.

---

## 1. The situation

The production bible specifies eight scroll-driven "world" films (3,168 WAN clips, 4h24m of generated
material). The owner generated exactly **32 clips** — Disney Storybook homepage chain `DSN-H-001 → 032`
(Prologue + MAP acts of "The Kingdom of Running Things") — and is done generating. The plan therefore
changes from *generate everything* to *one true film + seven machine-made films*:

- **Disney Storybook** becomes the flagship: the only world with real WAN footage, cut from the 32
  clips (160 s master + 32 chained scenes) — and when the footage runs out at `DSN-H-032`
  ("Hidden Spool", the moment the repeatable loop is found), **the code takes over the storytelling**,
  rendering the remaining acts (BUILD → GATE → PROVE → Finale) as live paper-craft cinematography.
  The handoff is the thesis of the whole portfolio: *the human proves the loop, the system runs it.*
- **The other seven worlds** (Astronomy, Razer Chroma, COD Tactical, Netflix Cinema, Spotify Pulse,
  Apple Titanium, Samsung Galaxy) are realized entirely in code — canvas, SVG, CSS choreography —
  each one faithful to its `creative-brief.md`: exact palette values, lens grammar, motion laws,
  act structure, and truth bans. No WAN required.

## 2. Where it lives (architecture)

House convention: finished cinematic artifacts are **self-contained HTML** under `public/` (see the
existing `public/films/*.html` embedded across 11 story pages). The worlds follow it:

```
public/worlds/
  index.html            ← the lobby: 8 world posters, EN/AR, links into each film
  cinema.js             ← shared scroll-cinema engine (no dependencies, no GSAP)
  cinema.css            ← shared theater chrome (progress rail, chapter cards, lang toggle)
  disney.html           ← flagship: 32 real clips + code continuation
  disney/
    clips/dsn-h-0NN.mp4 ← 32 remuxed faststart clips (silent, h264 720p30)
    posters/dsn-h-0NN.jpg
    disney-master.mp4   ← lossless concat of all 32 (160 s) for theater mode
  astronomy.html  razer.html  cod.html  netflix.html  spotify.html  apple.html  samsung.html
```

Zero coupling to the Astro build: relative URLs only, so the pages work under the
`/flagship-portfolio/` GitHub Pages base, under Netlify root, and from `file://`. The Astro site gets
exactly one source touch — a **Worlds** nav entry (EN/AR, base-aware) pointing at `worlds/`.

## 3. The engine (`cinema.js`)

Same philosophy as the site's `biome.ts`: one passive rAF scroll listener, CSS `--p` progress
variables, sticky pinning — plus a **video director** for Disney:

- `play-on-enter` per the bible's scroll-binding contract; pause + rewind on exit.
- Poster-first: every `<video>` is `preload="none" muted playsinline`, poster jpg shows instantly,
  the file loads only near the viewport, next clip prefetches while the current one plays.
  Never fetch 32 videos at page load (continuity-spec rule).
- Reduced-motion: films flatten to poster frames + full copy. Everything keyboard-reachable.
- Bilingual: every caption carries `en`/`ar` pairs; a toggle swaps `lang`/`dir` live (`mm-lang`
  persisted).

## 4. The truth rules (from the bible, non-negotiable)

- No invented metrics; numbers stay in the Astro stories. Worlds are labeled motion studies.
- No third-party logos, wordmarks, UI replicas, or characters — each world uses its documented
  *visual grammar* (palette, light behavior, motion clock), never its marks. Disclosure line on
  every page: original, brand-inspired, AI-assisted study.
- No readable generated text inside footage; all copy is live DOM.

## 5. Execution order

1. ✅ Map the 32 files → `DSN-H-001..032` (done: contiguous run, zero gaps), remux faststart,
   strip silent audio, extract 32 posters, concat 160 s master.
2. This PLAN.md commits to `main` before any build code — the plan lives on GitHub first.
3. Engine + lobby (`cinema.js`, `cinema.css`, `index.html`).
4. `disney.html` — the flagship cut.
5. Seven parallel subagents, one per world, each briefed on its `creative-brief.md` + the engine
   contract. Integration + nav entry follows.
6. **Three iteration passes per page minimum** (bible protocol): scroll end-to-end in a real
   browser, console clean, network sane, screenshot evidence, fix, repeat. Logged in
   `WORLDS-ITERATION-LOG.md`.
7. `npm run build:ghpages` → root-absolute-ref sanity grep → publish `dist/` to `gh-pages` →
   verify live at `https://mohamed3042.github.io/flagship-portfolio/worlds/`.

## 6. Out of scope (noted, untouched)

- Netlify/Vercel mirrors and the canonical `SITE` value (currently points at the old Netlify
  origin) — separate SEO decision for the owner.
- The remaining 3,136 WAN clips. The bible remains valid if generation ever resumes; nothing here
  blocks it. The worlds' code films are honest about what they are.
