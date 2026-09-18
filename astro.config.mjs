// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// This one build serves public hosts that need different roots:
//   • Netlify, at the domain ROOT            → base '/'   (the DEFAULT)
//   • GitHub Pages, a *project site* under   → base '/flagship-portfolio'
//     /flagship-portfolio/
//   • a SECOND Pages project site            → base '/flagship-portfolio-v2'
// `base` is prepended to every bundled asset and to every internal-link helper,
// so the build is self-contained under whichever root it is served from.
// Netlify builds straight from Git (plain `npm run build`, no env), so the root
// host is the default; the GitHub Pages deploy sets DEPLOY_TARGET=ghpages first
// (see `npm run build:ghpages`).
//
// GH_PAGES_BASE names the project site. It DEFAULTS to the original, so a
// build with no new variable set is byte-identical to the one that has been
// shipping — the second site is opt-in and cannot move the first one by
// accident:
//   node scripts/build-ghpages.mjs --base flagship-portfolio-v2
//
// WRITE IT WITHOUT A LEADING SLASH. Git Bash on Windows rewrites an argument
// that looks like an absolute POSIX path into a Windows one, so `--base
// /flagship-portfolio-v2` arrives as `C:/Program Files/Git/flagship-portfolio-v2`
// — which Astro accepted for the asset URLs and then wrote verbatim into every
// <loc> of the sitemap. The slash is added here instead, where no shell can
// touch it.
const GH_PAGES = process.env.DEPLOY_TARGET === 'ghpages';
const SITE = GH_PAGES
  ? 'https://mohamed3042.github.io'
  : 'https://mohamed-mahmoud-kuwait.netlify.app';
const PROJECT_BASE = `/${(process.env.GH_PAGES_BASE || 'flagship-portfolio')
  .replace(/^[A-Za-z]:[\/].*?([^\/]+)$/, '$1')
  .replace(/^\/+|\/+$/g, '')}`;
const BASE = GH_PAGES ? PROJECT_BASE : '/';

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
