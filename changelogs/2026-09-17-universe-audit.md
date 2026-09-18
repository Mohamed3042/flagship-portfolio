# 2026-09-17 — Universe audit (technical), post-reel build

Built `dist` served by `scripts/serve-static.mjs`; headless Chrome with hardware WebGL
(`--use-angle=d3d11`). Detector: `impeccable detect` over the changed UI targets.

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 4 | one h1 per page, every control named, all targets ≥ 44px, no missing alt |
| 2 | Performance | 3 | native-DPR WebGL on phones by owner rule; Lighthouse performance below (heavy by design) |
| 3 | Responsive Design | 4 | no horizontal overflow at 390 / 768 / 1440; touch targets 44px |
| 4 | Theming | 3 | tokens throughout; particle text and scene palettes re-tint per theme; six theme packs untested visually beyond dark + light |
| 5 | Implementation Integrity | 4 | 10 detector findings, all pre-existing incumbent identity (gradient hero line, bounce easings, side-tab quote rule) |
| **Total** | | **18/20** | **Excellent** |

## Implementation Integrity verdict

**Pass.** The build expresses one product-specific system: the One Sky universe, the flight
grammar, particle headlines, transmissions, the gate run. Every detector finding predates this
work and belongs to the approved incumbent identity:

- 3× `bounce-easing` in `tokens.css`
- 1× `gradient-text` in `SkyHero.astro`
- 2× `gradient-text` in `tokens.css`
- 2× `layout-transition` in `tokens.css`
- 2× `side-tab` in `tokens.css`

None was introduced by the universe build; none is canonized in DESIGN.md (they are listed there
as carried defects, not rules).

## Measured

| Gate | Result |
|---|---|
| `verify-portfolio.mjs` | Static verification passed: 38 stories × 2 languages, correct canonicals, sky-map grouping, and private-safe case studies. (pass) |
| `test-portfolio.py` desktop | 76/76 clicks, 0 console errors, 0 bad responses, 0 failures |
| `test-portfolio.py` mobile | 76/76 clicks, 0 console errors, 0 bad responses, 0 failures |
| `test-flight.py` desktop `--all` | 76 pages, 0 failures, frame loop 179–185 fps, min u_end 4.98 |
| `test-flight.py` mobile `--all` (390×844 @3) | 76 pages, 0 failures, frame loop 178–185 fps, canvas 1170×2532 |
| `audit-flight.py` (7 pages × 3 widths) | console errors 0, overflow 0, h1≠1 0, unnamed controls 0, targets < 44px 0, DOM ≤ 969 nodes, JS heap ≤ 81 MB, story frame loop ≥ 179 fps |

### Lighthouse 13.4.1 (local static server; the WebGL scene is live during the run)

| Page / profile | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| home-mobile | 49 | 100 | 100 | 100 | 3.3 s | 3.7 s | 1,910 ms | 0.135 |
| home-desktop | 80 | 100 | 100 | 100 | 0.7 s | 0.7 s | 370 ms | 0.088 |
| story-mobile | 52 | 100 | 100 | 100 | 3.2 s | 3.6 s | 1,680 ms | 0.133 |
| story-desktop | 82 | 100 | 100 | 100 | 0.6 s | 0.7 s | 360 ms | 0.035 |

## Findings by severity

- **[P2] Performance on low-end phones is unmeasured.** Location: `src/lib/sky/world.ts` `DENSITY`,
  `boot.ts`. Impact: the owner's rule is native resolution and full density on every phone; a
  three-year-old Android will run hot. WCAG: none. Recommendation: keep the rule; if a real device
  report comes back, the one lever that does not reduce quality is `compileAsync` ordering and
  texture upload timing, not counts. Command: `/impeccable optimize` (only on a real-device report).
- **[P2] Reduced motion is deliberately not honoured.** Location: `src/layouts/BaseLayout.astro`
  (the matchMedia shim), owner's standing choice since 2026-06. Impact: users with vestibular
  sensitivity get the full flight. WCAG 2.3.3 (AAA). Recommendation: none while the owner's rule
  stands; recorded, not fixed.
- **[P3] Light theme.** Bloom is disabled under light themes and the lens flash goes to white;
  the four theme packs (neon, cinema, storybook, wave) were not visually captured this pass.
  Command: `/impeccable polish` with theme captures.
- **[P3] Detector findings above** (incumbent). Command: `/impeccable polish` if the owner wants the
  gradient hero line and the side-tab quote rule reconsidered; they are part of the approved look.

## Positive findings

- Zero console errors on 76 story pages in both languages at both sizes; every page mounts the
  flight in under a second and reaches the boundary.
- One `h1` per page, landmarks present, every image has alt text, every control has a name and a
  visible focus ring, every target is at least 44px.
- The DOM stays small (≤ 969 nodes) because the scene draws the headlines; JS heap peaks at
  81 MB on the model-loading Cake Studio page.
- Fully token-driven: page accents, theme packs and the scene palette all read the same tokens.

## Recommended actions

1. **[P2] `/impeccable optimize`** only after a real low-end phone report (do not add a tier).
2. **[P3] `/impeccable polish`** for the four remaining theme packs with captures.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `/impeccable audit` after fixes to see your score improve.
