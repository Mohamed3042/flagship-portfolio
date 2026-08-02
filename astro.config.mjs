// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// This one build serves TWO public hosts, which need different roots:
//   • Netlify, at the domain ROOT            → base '/'   (the DEFAULT)
//   • GitHub Pages, a *project site* under   → base '/flagship-portfolio'
//     /flagship-portfolio/
// `base` is prepended to every bundled asset and to every internal-link helper,
// so the build is self-contained under whichever root it is served from.
// Netlify builds straight from Git (plain `npm run build`, no env), so the root
// host is the default; the GitHub Pages deploy sets DEPLOY_TARGET=ghpages first
// (see `npm run build:ghpages`).
const GH_PAGES = process.env.DEPLOY_TARGET === 'ghpages';
const SITE = GH_PAGES
  ? 'https://mohamed3042.github.io'
  : 'https://mohamed-mahmoud-kuwait.netlify.app';
const BASE = GH_PAGES ? '/flagship-portfolio' : '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'never',
  // Real, indexable routes per language. `/` does a client redirect to the
  // saved/preferred locale. Both /en and /ar are explicit, prerendered routes.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', ar: 'ar-KW' },
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    // Dev-only: the preview runner launches with an 8.3 short-path cwd while
    // Node resolves modules to the long path, which trips Vite's fs allow-list
    // (/@vite/client + CSS would 404). Relaxing the check fixes local preview;
    // it has no effect on the static production build.
    server: {
      fs: { strict: false },
    },
  },
});
