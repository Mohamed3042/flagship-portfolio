# Mohamed Mahmoud — Automation Engineer Portfolio

A cinematic, bilingual English/Arabic portfolio built with Astro and full RTL support. The site presents 30 evidence-backed project stories: thirteen Automation Engineering flagships, nine operating-foundation stories, and eight Engineering Lab studies.

Every new story is grounded in its source repository. Private projects are presented as sanitized case studies without repository links, source excerpts, credentials, or rights-restricted assets.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:4321`. The root redirects to `/en` or `/ar` from the browser language; the language control switches between equivalent routes.

Key routes:

- `/en` and `/ar` — bilingual homepages
- `/en/work/<slug>` and `/ar/work/<slug>` — all 30 project stories
- `#foundation` — nine earlier operating stories
- `#lab` — seven architecture, restoration, and private-safe Engineering Lab studies

The compact world control in the fixed navigation changes the art direction
without changing a route or duplicating content. Astronomy is the incumbent
default; Razer · Chroma, Disney · Storybook, COD · Tactical, Netflix · Cinema,
Spotify · Pulse, Apple · Titanium, and Samsung · Galaxy are opt-in identity
studies. The selected world persists across English, Arabic, and all stories.

## Production build

```bash
npm run build
npm run preview
```

The static output is written to `dist/`. Canonical URLs, sitemap entries, and social metadata target `https://mohamed-mahmoud-kuwait.netlify.app`.

## Social images

```bash
npm run og
```

This regenerates the English and Arabic OpenGraph cards and the touch icon in `public/`.

## Architecture

Shared facts and bilingual story content live in `src/data/`. The original nine stories retain their bespoke components; the 17 new project families share a narrative spine while each uses a project-specific systems visual. Identity state and motion values live in `src/lib/theme.ts`; world-level materials live in `src/styles/worlds.css`. See `NOTES.md` for the original rebuild notes and `PRODUCT.md` for the current product contract.
