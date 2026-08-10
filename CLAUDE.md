# CLAUDE.md — Project handoff for any AI agent

Read this first. It explains what this project is, the two codebases involved, what has been
done, the current live state, the active/pending work, and the non-obvious gotchas. Keep it
updated as you make progress.

---

## 1. What this is

A **premium, cinematic, bilingual (English + العربية, full RTL) portfolio** for **Mohamed Mahmoud**
(brand nickname **"Medmac"**) — a Digital Marketing Specialist in **Kuwait**. Apple-keynote
aesthetic: near-black canvas, gradient accents, an animated "aurora" hero, scroll-reveal motion,
animated proof metrics, and **11 project "story" pages** that each tell their story through a
page-level **parallax StoryScroll spine** (Lenis + GSAP). *(As of the 2026-06-30 rework — see §7.5
and `continue.md`. The boxed self-playing explainer was removed; the interactive Claude Design film
survives as a lazy "explore it yourself" tail.)*

**Owner is positioned as "a whole marketing team in one person"** — runs the ads, grows audiences,
builds the CRM, ships software, and automates with AI.

## 2. TWO codebases (don't confuse them)

Both live under: `C:\Users\GAMING\Claude\Projects\MY Resume\`

| Folder | What it is | Deployed? |
|---|---|---|
| `Flagship Portfolio Site/` | The **original hand-built static site** (plain HTML/CSS/JS, **no build step**). It is the **reference for the look + the vetted copy/numbers**, and it **holds the source assets**: `assets/films/*.html` (8 interactive films), `assets/cartoons/*.html` (8 auto-playing cartoon explainers), `assets/img/work/*.jpg`, `assets/js/aurora.js`, `assets/css/site.css`. | **No** |
| `flagship-rebuild/` ← **YOU ARE HERE** | A **from-scratch Astro 5 rebuild** of that static site. **This is the LIVE, deployed site.** | **Yes** |

> ⚠️ Briefs the owner pastes are sometimes written against the **static** site's structure
> (`work/*.html`, `story-film-wrap`, "no build step"). The **live** site is this **Astro** project.
> Editing the static `work/*.html` will **not** change the live site. When a brief targets the
> static structure, confirm whether the owner wants it on the **live Astro site** (almost always yes)
> and translate the change into this Astro project instead.

## 3. Live deployment (Netlify public canonical + GitHub Pages mirror)

- **Public canonical:** Netlify — https://mohamed-khalil-kw.netlify.app
  (`astro.config.mjs` `SITE` points here; drives canonical/sitemap/hreflang/OG).
- **Mirror:** GitHub Pages — https://engineeringprojectswork-droid.github.io/flagship-portfolio/
  (a *project site*: build with `DEPLOY_TARGET=ghpages` / `npm run build:ghpages`,
  which sets `base:'/flagship-portfolio'`; its pages canonical-tag back to Netlify).
- **Legacy:** the old Vercel host (`mohamed-mahmoud-kw.vercel.app`) is login-walled
  by Deployment Protection — retired; never name it in canonicals.
- **Account:** `engineeringprojectswork@gmail.com`.
  **Git remote:** `engineeringprojectswork-droid/flagship-portfolio` on GitHub.
- **Redeploy both (run from the long path):**
  ```
  npm run build
  npx --no-install vercel deploy --prod --yes
  npx --no-install netlify deploy --prod --dir dist
  ```
- `astro.config.mjs` `SITE` = the **Netlify** URL (drives canonical/sitemap/hreflang/OG).
  It MUST be the public, crawlable origin — the Vercel host is login-walled, so canonical
  must not name it. Update this (and the SSR fallbacks) only if the public domain changes.
- Do **NOT** deploy unless the owner says so — they review locally, then say "deploy".
  (When they do say deploy, it's authorized.)

## 4. Stack & architecture (this Astro project)

- **Astro 5**, **static output** (prerendered), **TypeScript strict**.
- **Styling:** hand-rolled CSS design tokens in `src/styles/tokens.css` (NO Tailwind) + Astro
  component-scoped styles. **Six switchable themes** (2026-07-05): dark (default, attribute
  absent) · light · **neon · cinema · storybook · wave** — the four packs are `[data-theme]`
  token blocks in `tokens.css` mapped 1:1 from the Claude Design theme sheets (grounds,
  surfaces, space/glass/glow tokens, radius + per-theme `--dur-*`/`--ease-*`/`--px-*` motion
  tokens). The per-story accent system stays in charge of `--accent`/`--grad`. Selection: a
  keyboard-accessible listbox in the nav (`Nav.astro`), engine in `BaseLayout` (no-FOUC inline
  script + `localStorage['mm-theme']` — the SAME key the Flagship-One-Page site reads, so the
  visitor's choice follows them — + `mm:themechange` event). **`src/lib/theme.ts`** is the JS
  registry: `THEMES`, `THEME_MOTION` (per-theme scrub smoothing, parallax depth scale,
  storybook's curved-path drift, glow gain, Lenis lerp — read by `motion.ts`/`storyscroll.ts`/
  `home.ts`/`interactions.ts`; dark/light frozen at pre-pack values; one map, no forks) and
  `THEME_AURORA` (hero-canvas palettes). `space.ts` draws a per-theme particle identity
  (neon grid/scanlines + signal dots · cinema dust motes + scroll-beat letterbox via
  `html.beat-pinned` · storybook sparkles · wave scroll-velocity waveform); bespoke per-theme
  heroes are a noted follow-up (this pass theme-tints the existing canvas/ribbon).
  Inspired-by aesthetics only — no trademarks or brand names in shipped UI.
- **i18n:** real routes `/en` + `/ar` via a `[lang]` dynamic param + `getStaticPaths`. Content is a
  typed dictionary (`src/i18n/ui.ts`) + co-located `{en,ar}` pairs in components (NO duplicated DOM).
  Per-page `hreflang`/canonical, `@astrojs/sitemap`. `/` redirects to saved/preferred locale.
- **Fonts:** self-hosted via Fontsource — Inter (Latin) + IBM Plex Sans Arabic.
- **Motion:** `src/lib/aurora.ts` (ported aurora canvas, re-inits across View Transitions) and
  `src/lib/interactions.ts` (reveal, count-up, parallax, scroll-progress). ClientRouter View Transitions.
- **Icons:** `simple-icons` for real brand logos + custom monogram tiles/glyphs in `src/lib/icons.ts`,
  rendered by `src/components/Tech.astro` / `TechRow.astro`.

### File map
```
src/
  data/        profile.ts   ← SINGLE SOURCE OF TRUTH for every number
               projects.ts  ← the 11 stories: slug, order, accent, card copy, prev/next
  i18n/        ui.ts (shared chrome strings) · utils.ts (pick, dir, mirrorPath, workPath, locales…)
  styles/      tokens.css   ← the whole design system + effects
  lib/         aurora.ts · interactions.ts · icons.ts (brand-icon registry) · theme.ts
               (THEMES/THEME_MOTION/THEME_AURORA) · space.ts (per-theme particle layer)
  layouts/     BaseLayout.astro  (head/SEO/JSON-LD/hreflang/theme/nav/footer/ClientRouter)
  components/  Nav, Footer, Hero, Statements, Metrics, ProjectsGrid, Team, About, Contact, Tech, TechRow
               viz/StatRing.astro
               work/  StoryHero · FilmEmbed · Pager  +  the 11 story components
                      (MetaAds, AlMaali, Crm, BrandSystem, SheepApp, HrSystem, MedmacWebsite,
                       AiWorkflow, MyResume, BrandEcosystem, ProcurementAutomated)
  pages/       index.astro (root redirect) · [lang]/index.astro · [lang]/work/[slug].astro · 404.astro
public/        films/*.html (8) · img/work/*.jpg (8) · og/{en,ar}.png · apple-touch-icon.png · robots.txt
scripts/       generate-og.mjs   (npm run og)
```
The story route `[lang]/work/[slug].astro` maps each slug → its work component. Each work component
renders: `<StoryHero>` → `<FilmEmbed>` (the interactive film) → bespoke content sections → metrics →
`<Pager>`. The 8 films are in `public/films/` and embedded via `FilmEmbed`'s iframe.

## 5. NON-NEGOTIABLE RULES

1. **Real data only (career-critical).** Every number on the site MUST trace to `src/data/profile.ts`
   (or the verbatim figures in `projects.ts`). **Never invent, round into a new claim, or alter a
   figure.** Example caught & fixed: an agent added a ring claiming "24% of RFQs were live" but
   4/23 = 17% and the source only used 24% as a bar width — it was removed.
2. **Honesty framing (verbatim):** the owner *generates leads* (sales closes them); software is
   *spec-driven, AI-assisted* (he's architect/operator/reviewer, not solo hand-coder); business
   impact wasn't measured, so it isn't claimed. Keep the "Honest credit" notes intact.
3. **AR/EN parity + correct RTL** everywhere. Keep both languages in sync.
4. **Don't edit the self-contained assets** (`public/films/*`, the source `assets/films|cartoons/*`).
   They're finished artifacts — embed them, don't modify them.
5. Match the existing look; keep it tasteful (Apple-calm, not gaudy).

## 6. CRITICAL gotcha — running the dev server / preview

This project's path contains a **space** (`...\MY Resume\flagship-rebuild`), which breaks the
Claude Preview launcher two different ways:
- Passing the spaced path to the runner fails (`'C:\Program' is not recognized`).
- Using the Windows 8.3 **short path** (`MYRESU~1\FLAGSH~2`) starts the server but makes Vite's dev
  cwd ≠ Node's module resolution path → Vite's `fs.allow` rejects `/@vite/client` and **the dev CSS
  is never injected** (page renders completely unstyled, `document.styleSheets.length === 0`).

**The working setup (already in place):**
- `C:\Users\GAMING\Downloads\website\run-flagship.cmd` does `cd /d "<long path>" && npm run dev -- --port 4321`.
- `website/.claude/launch.json` has a `flagship` config that runs it via `cmd /c`. Use `preview_start("flagship")`.
- `astro.config.mjs` also sets `vite.server.fs.strict:false` (dev-only belt-and-suspenders).
- The **production build is unaffected** by all of this — `npm run build` always produces correct CSS.
- Screenshots of pages with running animation (aurora canvas / embedded films) may time out — verify
  via `preview_inspect`/`preview_eval` (computed styles, DOM) instead, or screenshot static sections.

Commands: `npm run dev` (4321) · `npm run build` → `dist/` · `npm run preview` · `npm run og`.

## 7. Where I've reached (history, newest last)

1. **Built the Astro rebuild** from the static reference: aurora homepage (hero → cinematic
   statements → animated metrics → 8-card projects grid → "team you'd hire" → about → contact) and
   the 8 story pages, each embedding its interactive film. Verified EN/AR + dark/light.
2. **Deployed** to Netlify; then **renamed** the site to `mohamed-mahmoud-kuwait` (the plain
   `mohamed-mahmoud`/`-portfolio`/`-kw` subdomains were taken) and updated all URL references.
3. **Removed the brand-system ad-image gallery** (the cramped mosaic) at the owner's request —
   "to be redesigned later". The 8 images remain in `public/img/work/`.
4. **Visual upgrade ("best visual version"):** built the brand-icon system (`icons.ts` +
   `Tech`/`TechRow`) and replaced every plain text/tool chip with real brand-icon chips
   (logos via simple-icons; monogram tiles for Canva/AE/Premiere/Kling/Wan; glyphs for ComfyUI,
   Rented GPUs, Python-stdlib tools). Added `StatRing` (sheep **59/59**, medmac **96–100**),
   platform-logo rows (al-maali: Facebook/Instagram/TikTok/YouTube; hr-system: Gmail/WhatsApp),
   section accent glows, card shine-sweep, hover lifts, and a gradient **shimmer** on the hero +
   statement finale. Fixed a **light-mode hero** contrast bug (headline was dark-on-dark).
   Deployed. All green.
5. **Parallax/3D StoryScroll rework (2026-06-30) — Claude Design package.** Replaced the boxed
   explainer with a page-level **5-beat scroll spine** on all stories, added home upgrades, and a
   **9th** story (`my-resume`). Full detail in **`continue.md`**. **Deployed to both hosts.**
6. **Cosmic Keynote (2026-06-30) — space + glow overhaul.** Global starfield/nebula layer
   (`src/lib/space.ts` → fixed `#space` canvas, theme-aware, reduced-motion static, VT-safe);
   the two-glow signature (scroll-driven `.glow-text` drop-shadow + the Apple-Intelligence
   `.glow-frame` shape aura, both driven by a `--glow` written in `interactions.ts`); a light
   **ribbon hero** (dark keeps the converging-core canvas; the old "always dark" hack retired);
   and per-section **biomes** (`src/components/Biome.astro` — nebula/aurora/grid/constellation/
   warp/comet/globe/singularity) behind the home sections + every `/work` hook. Tokens, glow
   utilities + the `.pin`/`.pin__stage` scene scaffold live in `tokens.css`. Built green (22
   pages), verified (EN/AR, light/dark, mobile, RTL, console clean), and **deployed to both hosts**.
   See `DEPLOY-STATUS.md`.
7. **Audit-fix pass (2026-06-30) — commit `c12f7e2`, deployed to both hosts.** A 7-dimension
   read-only audit + a visual scroll-through found the real issues behind "full of issues on
   scroll": (a) **SEO** — `SITE` named the login-walled Vercel host → canonical now Netlify
   (the public origin); (b) two **broken centerpieces** — Mosaic (brand-system) was frozen
   scattered by a local `--q:0` shadowing the engine var, and BrowserDials (medmac) rendered
   empty dials from `var(--q,0)` instead of `,1`; (c) **metric sparklines** escaped their cards
   (`.metric` needed `position:relative;overflow:hidden`); (d) **biomes** painted over
   Team/About/Contact text (`.section` z-index); (e) **light-theme AA** for accent small text
   (new `--accent-ink`). Plus the **AssetSlot** empty state redesigned into an intentional accent
   glass panel (no more dashed "screenshot" boxes), glow-halo floor zeroed, Orbit `:global` fix,
   Arabic Pager arrows, Lenis teardown on mobile resize, theme-color light variant, localized
   Person JSON-LD, 404 noindex. See `DEPLOY-STATUS.md`.
8. **Theme packs + 2 new stories (2026-07-05).** (a) Stories 10+11: `brand-ecosystem`
   (Medmac B2B sales kit — 4 HTML docs, 22 division profiles from ONE 5-page template,
   up to 60 print-ready A4 PDFs, zero prices by design; honesty: *no client-delivery
   metrics recorded yet*; accent `rose`, CartridgeFan centerpiece) and
   `procurement-automated` (AI-directed buying — first live run 4 Jul 2026: 5 verified
   listings, 2 CAD workstations, recommended unit 170 KWD ~6% below market, same-day
   purchase; honesty: *final negotiated price pending*; accent `mint`, VerdictDial
   centerpiece). Films in `public/films/` (`brand-ecosystem-film.html`;
   `procurement-automated-film.html` + its `support.js` runtime). (b) The 6-theme system
   (see §4 Styling): 4 theme packs, nav theme menu, `lib/theme.ts` THEME_MOTION map,
   per-theme space/aurora canvas palettes. (c) The 8 archive JPGs in `public/img/work/`
   (ad5, cover3, eq1–4, hire1, scaffold) are now WIRED as real Mosaic tiles on the
   brand-system story (they were unreferenced since the old gallery was removed).
   Mobile Lighthouse on the built EN home after the pack: **97 perf / 95 a11y**.

## 8. ACTIVE / PENDING (current)

The Cosmic Keynote is **live on both hosts** (`npm run build` green, 22 pages). What's left:

1. **Real screenshots** — every centerpiece/card still has a marked `▦ ASSET SLOT` placeholder
   (`src/components/work/spine/AssetSlot.astro`, 16:10 / 16:11). Pass a real image path as its
   `src` prop to fill — no layout shift. The 8 existing `public/img/work/*` ad creatives fill the
   Brand & Content slots; the owner still owes the 6 private shots (Meta/CRM/analytics/app/HR/Cowork)
   + 2 Brand (AI concept, restored photo). See `DEPLOY-STATUS.md` for the shot-list.
2. **Lighthouse re-check** — re-run on a clean machine. Desktop was 100/100/100/100 pre-Cosmic; the
   changes are additive CSS + one cheap starfield rAF + a throttled, dataset-gated glow pass (no
   blocking resources, no CLS from the fixed canvas, code-split preserved), so expect parity.
3. **Pin model** — the owner chose "pin every section." Shipped as: pinned filmstrip + all 9 work
   Build/Proof pins + cinematic statement scenes + biomes everywhere; connective home sections use
   scrub-reveal-in-flow (kept off hard-pin for mobile-Lighthouse safety). `.pin`/`.pin__stage`
   scaffold is in `tokens.css` to pin more sections per-section if desired.
4. **Open decision:** the indigo (Web·Live) accent was lightened from the spec'd `#5e5ce6` to
   `#7574ee` so it passes AA as small text — confirmed **keep** this session.
5. **Netflix World — THE ANTHOLOGY owner-run WAN handoff (2026-08-08):** generated and
   mechanically normalized **33 stills** (`KF00` style anchor + `KF01–KF32`) to exact
   **1920×1088** PNGs under `public/worlds/assets/netflix/keyframes/`; contact sheets and the
   reconstructable prompt/verdict manifest are in `public/worlds/assets/netflix/review/` and
   `public/worlds/assets/netflix/keyframe-review.md`. The owner approved regenerating the ten
   first-pass rejects (`KF06`, `KF12`, `KF16`, `KF18`, `KF20`, `KF21`, `KF23`, `KF24`, `KF28`,
   `KF29`); Revision 2 now scores **33 PASS / 0 REJECT**. The originals and first-pass sheets are
   archived in `review/rejected-v1/`; selected raw retries are in `review/regenerated-v2/raw/`.
   The owner explicitly approved Revision 2, then chose to generate WAN 2.7 clips himself from
   his own account. **0 WAN credits were spent by Codex.** The copy-ready 32-clip prompts, exact
   reference/FLF mapping, fixed seeds, filenames, QA ladder, and resumable task log live in
   `public/worlds/assets/netflix/wan/OWNER-RUNBOOK.md`. Generated clips are still pending; do not
   edit/deploy `netflix.html` until the accepted MP4 chain is added under `wan/accepted/`.

**Full architecture + DOM contract + verification status:** see `continue.md` (self-contained handoff).

9. **The Worlds — eight scroll-cinema films (2026-08-03).** `public/worlds/` — self-contained
   scroll-cinema layer finishing the WAN production bible without further generation: shared
   dependency-free engine (`cinema.js` — scroll-loop scene liveness + `scene:live/idle` events,
   no IntersectionObserver; `?solo=N&p=X` QA harness; `.L en/.L ar` bilingual span system with
   !important visibility invariants; assets versioned `?v=2`), lobby (`index.html`), and eight
   films. Disney Storybook is the flagship: the owner's 32 real WAN 2.7 clips (DSN-H-001..032,
   re-encoded 1280×648 — bottom crop removes the WAN watermark) chain-play in 6 chapters, then
   code renders the remaining acts; 160 s master in theater mode. The other seven worlds
   (astronomy, razer, cod, netflix, spotify, apple, samsung) are fully code-rendered to their
   `wan-production-bible` creative briefs. Nav gained a base-aware **Worlds/العوالم** entry
   (`nav.worlds`). AssetSlot now prefixes `BASE_URL` on root-absolute `src` (fixed live 404s of
   `/img/work/*` on the Pages subpath). Three iteration passes per film logged in
   `WORLDS-ITERATION-LOG.md`; plan in `PLAN.md`. Deployed to `gh-pages` (worktree publish),
   verified live at https://mohamed3042.github.io/flagship-portfolio/worlds/ .

10. **Worlds Second Edition (2026-08-04).** `cinema.js`/`cinema.css` gained an opt-in
    projection-booth layer (`body[data-film|data-ticks|data-letterbox]`): slate HUD with
    scene counter + running timecode, scene tick rail, projector mattes, RTL-aware
    arrow-key scene stepping. New shared scene patterns `.ident` (studio ident) and
    `.credits` (end-credits roll), plus shared `.grain`/`.grade`. Every film got an ident,
    an end-credits roll, slate labels and one new bespoke set piece (disney vault ·
    astronomy spectrograph · razer bootlog · apple caliper · netflix carousel · spotify
    groove canyon · samsung eight folds · cod comms check). Lobby gained a marquee, living
    posters, per-film spec rows, a projection-booth manifest and a public filmography.
    **Brand correction: the studio mark is Mohamed Mahmoud — Medmac is a former employer
    and must never brand personal work.** Gotcha found the hard way: a pinned scene with
    no travel never scrubs (`span = height - vh = 0`), so `.scene.ident`/`.scene.credits`
    ship default runways in `cinema.css`.

11. **Worlds Third Edition — rendered plates (2026-08-04).** `render/` holds a headless
    Blender pipeline: `harness.py` (GPU/OptiX setup, AgX, physical camera with DOF,
    area/spot/point rigs, world sky + star field + participating medium, PBR helpers with
    roughness break-up and brushed-metal normals, bevel/subsurf, compositor grade) and one
    `w_<world>.py` scene script per world. `batch.sh` renders every world and encodes each
    to `public/worlds/render/<world>.mp4` (h264, `-g 4` dense keyframes so scroll-seeking
    lands frame-accurately) plus a poster jpg. `cinema.js` v4 adds the **plate** module:
    a scene carrying `data-plate="render/<world>.mp4"` mounts a lazy `<video>` whose
    `currentTime` tracks that scene's `--p` — the visitor scrubs a real ray-traced camera
    move. Solo-aware, so `?solo=N&p=X` can capture a still headlessly.
    Blender 5.x API gotchas encoded in the harness: the compositor is a **node group** on
    the scene (`scene.compositing_node_group`) and its source must be a Render Layers node
    or Blender skips the render entirely (black frames at ~1 s); most compositor options
    are now **menu sockets** taking UI labels (`'Bloom'`, not `'BLOOM'` — the default
    `Streaks` stamps a fake anamorphic cross on every highlight); node-socket keyframes
    live on the owning node tree, not the socket; and a bright emissive star world lights
    the set like a dome light unless gated behind `Is Camera Ray`.
    Budget: 48 frames, 960×480, 40 samples + OptiX denoise ≈ 10 min/world on an RTX 5070
    Ti; all eight plates together weigh well under 2 MB.

12. **Cake Studio World v1.2 — dimensional coda (2026-08-10).** The 50-shot directed film keeps
    its weighted, reversible scroll score, but its former circles/lines/boxes ending is gone. The
    exact `CST-KF01-opening-sheet.png` endpoint now holds through a rose-gold optical match cut into
    one locally rendered Three.js r169 patisserie: nine cake forms → one measured cake with four
    controlled parts and seventeen data wafers → customer vitrine, baker sheet and true-size
    plaque. Scroll is the only playhead; the WebGL renderer sleeps away from the coda, caps DPR,
    supports reverse travel and falls back to bilingual text. Source proof is **40/40 structural**
    and **159/159 live-browser** across desktop/phone with zero console/network errors; deliberate
    static and browser sabotage both turn the gates red. Direction source:
    `public/worlds/CAKE-STUDIO-DIRECTORS-CUT.md`. Copy-ready optional WAN bridge:
    `public/worlds/assets/cake-studio/wan-prompts/CST-A-050-V2-OPTICAL-BRIDGE.txt`. Published to
    GitHub Pages at `gh-pages` commit `7fd9d97`; the live CDN also passes **159/159**.

## 9. Companion docs
- `NOTES.md` — the engineering rationale & "what I improved over the original".
- `README.md` — quickstart (preview/build/deploy).
- This `CLAUDE.md` — the living project/agent handoff (keep it current).
