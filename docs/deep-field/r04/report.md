# DEEP FIELD — Round 4 (finishing)

## The three defects

**The portals hide the art — fixed.** The plate IS the aperture now. The
renderer sizes it to the rim itself — not to the figure's box, which the iris
ticks make larger, so `figures.ts` exports the ratio between them — the
stylesheet clips it to the ellipse and the frame covers it. Nothing of the
picture reaches past the rim; nothing inside the rim is empty. The desktop ring
went 45.3% → **52.8%** of the viewport height, the plate 327×184 → **481×430**,
which is 3.2× the area. The phone's 37.1% stands with the same fill. The iris
ticks are a third of their length, a third of their density, and their anchors
dropped from 0.90/0.74 to 0.42/0.30 — under the 0.86 that grows a diffraction
spike, which is what made eight of them read as legs.

**The hold was 202 px — fixed.** The split, measured off the shipped window:

| | desktop 1440×900 | phone 390×844 | floor |
|---|---|---|---|
| beat | 1,683 px | 1,668 px | — |
| assembly | **791** | 784 | 700 |
| hold | **471** | 467 | 450 |
| release | **421** | 417 | 400 |

Assembly clears its floor by ninety pixels, so the runway cap **stays at 36
viewport heights** (31,500 px): 40 was allowed to buy the hold and was not
needed. The 1%→99% distances, which is where the move is actually visible, are
539 px and 376 px. The reading stop and the copy ramp moved with the window.

**The labels were unreadable — fixed.** Captions are 13 px (tools) and 13.5 px
(repositories), uppercase, tracked .11–.13 em, in the page's full ink at
**18.86:1** — they were 12 px in the secondary ink under a hairline brighter
than they were. Leaders are now DRAWN: one 1 px hairline at 0.30 alpha from the
projected star to the chip's own edge, at the length and angle measured in the
frame that placed it, so a chip that slid down to clear the one above it still
belongs to its star. The WebGL hairlines dropped to 0.22 alpha. Chips also
gained a wall — in landscape their band stops 20 px short of the copy column,
because the longest of the twelve tools ran under the display type.

## Academy — restored on the owner's word

| Step | Result |
|---|---|
| Cherry-pick | `public/worlds/academy.{html,css,js}`, `academy/` (15 clips, posters, manifest) and `assets/academy/` (the production boards the page links to), byte for byte from `feature/academy-proven-spells`. Nothing overwritten — every path was new. |
| Pages deploy | `gh-pages` **e981542**, additions only, no other file touched. Every subtree hash matches **eb12233**, the state it was last live in ("Deploy Academy full-bleed phone cinema", 2026-08-21 23:47) — a NEWER build than the c4a973e one the last report named. |
| Verified | `worlds/academy.html` **200** (18,332 B), and its stylesheet, script, manifest, a poster, a clip and the WAN board all 200. |
| Portal | retargeted to `…/worlds/academy.html`, `live: true`, and the label is "Enter the world" like the other four. |

One thing the owner should know: the worlds floor's own `index.html` carries no
Academy card — and no Cut the Strings card either. That index was rebuilt from
a source that lists neither, so this is not an Academy problem and it is not
what "that page only" covered. Both pages answer 200 and the landing links
straight to them.

## The Arabic pass

Sixteen corrections. The two that mattered:

| Before | After | Why |
|---|---|---|
| مُطلِق نار **حلبي** (twice) | لعبةُ إطلاق نار في **حَلبة** | حلبي means "from Aleppo". |
| ويدٌ تقود **الخافضَ الرئيس** إلى **الوحدة** | ويدٌ تدفع **المستوى الرئيسَ** إلى **تمامه** | "fader…to unity" carried across word for word names nothing in Arabic. |

And the rest:

| Before | After | Why |
|---|---|---|
| واعتماد **مقاس** | واعتمادٌ **مَقيس** | مقاس is a size; measured is مَقيس. |
| عشرون لقطة **تُفرَك** بالتمرير | عشرون لقطةً **يقودها التمرير** | فَرْك is a rubbing motion. |
| تُبقي الشيفرةُ المملكةَ **تجري** | …المملكةَ **جاريةً** | أبقى takes a حال, not a verb clause. |
| أكاديمية التعاويذ **المُثبتة** | …**المُثبَتة** | unpointed it reads as "the one that fastens". |
| أُعيد بناؤه من **عميلٍ** متوقّف | …من **تطبيقٍ** متوقّف | عميل is a customer before it is a client. |
| وسم كل **استنتاج** … أو **مستنتجًا** | وسم كل **نتيجة**: **متحقَّقٌ منها** أو مُستنتَجة | the same word as the thing and as one of its states. |
| خادمٌ **موثوق** واحد | خادمٌ **مرجعيٌّ** واحد | authoritative, not well-liked. |
| كي **يُنجز** النصفُ … نفسَه | كي **يُنجِزَ** … | active, with a subject and an object. |
| **صوّب** نحو العتمة | **وجِّه النظر** إلى العتمة | صوّب aims a weapon. |
| **فيلم تمرير** | **سينما التمرير** | a word-for-word compound. |
| …ودول الخليج **وعن بُعد** | …**ومع الفرق التي تعمل عن بُعد** | a place you work with, not a manner. |
| **تخطَّ المشهد إلى** الأعمال | تخطَّ المشهد **وانتقل إلى** الأعمال | an English preposition. |
| **4** مستودعات عامة | **٤** مستودعات عامة | the site's own convention (`toLocaleString('ar-EG')`). |
| على زمن تشغيل **ما زال مكتبةُ** Python | …**لا يزال مكتبةَ** Python | ما زال takes a منصوب predicate. |
| **حافة** تكامل · عام | **واجهة** تكامل · عام | حافة is a cliff edge. |

The last two are in shared project data and reach the archive and the work
pages too. Both were grammar, not taste.

**Type.** Every Arabic slot runs 1–2 px over its Latin twin with looser leading
and no tracking: the body line 16/1.62 → **17.5/1.85**, a link 14 → 15.5, the
eyebrows 11 → 12.5, the role 13 → 14.5. They are `em` steps on the existing
clamps, so the responsive curve is shifted rather than replaced. The star
captions keep the Latin size because they are Latin — and their tracking had to
be given back explicitly: the site's own `[dir="rtl"] *{letter-spacing:normal
!important}` was reaching into `dir="ltr"` repository names.

RTL holds at every beat: `contact-phone-ar.jpg` is the mandatory sheet, and
`reduced-motion-ar.jpg` shows the copy zone, the links and the asterism
labels mirrored at three more.

## Accessibility

All read off the rendered page, in four views, plus a keyboard walk.

| Claim | Measured |
|---|---|
| one `h1`, a heading on every beat, no level skipped | 1 / 19 / no skip |
| every reachable link and button has a name | 0 unnamed |
| no canvas in the accessibility tree | all `aria-hidden` |
| the skip link lands past the runway | target top ≥ runway bottom |
| focus ring | 2 px solid `rgb(138,180,255)` at a 4 px offset (3 px on a caption), and absent when not focused |
| tab order | never enters an inert chapter; reaches the seek nav; LEAVES the stage |
| reduced motion | every beat a poster, held still over 900 ms, WebGL live |
| contrast | 18.86 title · 9.76 line · 18.86 action · 18.86 captions · 8.84 worst in the archive |
| Lighthouse accessibility | **100** |

`a11y-focus.jpg` takes focus with the KEYBOARD, not `el.focus()`, because
`:focus-visible` is the browser's judgement and a scripted focus does not
always earn a ring. Two things the walk found: `blur()` leaves the sequential
focus navigation starting point where it was, and `focus()` on an element at
the head of the body SCROLLS there — which sent the renderer chasing nineteen
chapters while handing focus to each arriving one, so the walk was reading the
renderer's own focus handoff and calling it a tab order. And one real defect:
the route's `:focus-visible` rule drew a second ring around the label ANCHOR, a
zero-by-zero point on the star. The chip keeps the ring; the point does not.

The caption cell is taken on the public repositories, not the tools: a tool's
chip carries no `href` — none of those repositories are public — so it is a
name and not a control, and a name cannot take focus.

## Phone

390×844, touch, device pixel ratio 3, CPU throttled 4× through the DevTools
protocol. Not a device, and nothing here is called one.

| | Measured |
|---|---|
| pixel ratio | device says **3**, drawing buffer is **1.5** → 740,610 fragments a frame instead of 2,962,440 |
| worst p95 frame interval, six poses, under the throttle | **8.4 ms** against 33.3 |
| adaptive count | 58,000 → **24,000** (its floor) under a planted 45 ms per frame, interval 4.2 → 50 ms; back to 58,000 when the load is removed |
| the control | the same wait with nothing planted — count **does not move** |
| touch | the runway and the sticky frame register **no listeners at all**; the wheel and touchmove handlers on `window` belong to the site's smooth-scroll library and to ScrollTrigger. A swipe that emits no wheel event scrolls **469 px** |
| horizontal scroll | **0 px** |
| tap targets | no control under 44 px |

## The archive, re-toned

`--bg` is **#000000** and the worst ink contrast is **8.84:1** in all six
themes — dark, light, neon, cinema, storybook, wave. One row per theme in
`themes-archive.jpg`.

The tokens sit on `.showroom:has(.signal)`, the nearest common ancestor of the
cinema and the archive, never `:root`. A token swap alone was not enough twice,
and the light theme proved it both times. First: nothing in the archive paints
a background — the ground is the body's, and the body is not a descendant of
`.showroom`, so `--bg` read black while the page stayed white. Second: the body
rule that fixed that was written `background:var(--signal-bg)` — and
`--signal-bg` is declared BELOW the body, so the var had no value, the
declaration was invalid at computed-value time, and `background` fell back to
transparent. The dark themes looked right because the browser's default canvas
is dark. The ground is a literal now, and the suite reads the painted body back
and compares it to the token.

Nine literal-valued theme rules are answered one by one; they paint colours
rather than reading tokens, and left alone they were a white contact band at
the foot of a black page. The footer, which is site chrome outside the token
scope, takes the route's ink while the route is black.

## Budgets

`serve-static dist 4618`; `measure-deep-field.py`; `measure-deep-field-phone.py`;
`test-signal.py`; `capture-deep-field.py`; `capture-deep-field-a11y.py`;
`capture-archive-themes.py`; `record-signal-realtime.py`; `run-lighthouse.py`.

| Bar | Measured |
|---|---|
| desktop ≤18.2 ms | **4.3** p95 (vsync established; RTX 5070 Ti @ 240 Hz) |
| phone-emu ≤33.3 ms | **4.3** p95 · **8.4** under a 4× CPU throttle |
| draw cost | **0.054 / 0.040 ms** (168k / 58k stars) |
| JS ≤350 KB gz | **227.5** — three.js 135.2, the route 27.4, GSAP 27.2, ScrollTrigger 17.8, BaseLayout 8.2, Lenis 5.2 |
| key frames ≤250 KB each | **114.1** worst, **320.6** for all five |
| paint <1.5 s | **0.40 s** localhost · 0.61 s on the draft |
| CLS 0 | **0** at 1440 and 390, EN and AR, and 0 in every Lighthouse run |
| contrast ≥4.5:1 | **18.86 / 9.76 / 8.84** |
| runway ≤36 vh | **36.0** vh = **31,500 px** (38 vh portrait = 31,228) |
| portal ring 50–55% h | **52.8%** desktop · **37.1%** phone |
| real input | 27.4 s, 99.8 fps observed, longest gap 93.2 ms, **0** gaps over 100 ms |
| suite | **895/895** (679 at the end of Round 3) |

### Lighthouse — three runs a preset, median, on the draft

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| desktop | **94** (92–96) | **100** | **100** | **69** |
| mobile | **59** (56–64) | **100** | **100** | **69** |
| the same build, served locally | 91 | 100 | 100 | **100** |

**SEO 69 is the preview, not the page.** A Netlify draft answers with
`X-Robots-Tag: noindex`, which fails `is-crawlable`; the live site sends no such
header, and the same build served locally scores 100. **Mobile performance 59
is real**: LCP 4.7 s and TBT 810 ms on Lighthouse's simulated slow-4G phone,
with 2.45 s of script evaluation — three.js is 135 KB gz of the 227, and GSAP,
ScrollTrigger and Lenis are another 50 because the site runs its heavy motion
on every width by the owner's own decision. That is what a WebGL cinema costs
on a cold simulated 4G phone. It is not what the page does once it is running:
under a 4× CPU throttle the frame interval is 8.4 ms against a 33.3 ms budget.
The only genuinely cheap fix left — deferring three.js off the critical path —
moves the work inside Lighthouse's own TBT window rather than out of it, so it
was not taken on a finishing round without measuring it first.

## Red

- **Mobile Lighthouse performance is 59.** Diagnosed above. The owner's own
  phone, on his own network, is the acceptance.
- **The cost probe still cannot prove it scales.** 3.2× the stars cost 1.5× the
  milliseconds, because both draws are under a tenth of one and the barrier
  dominates. The draw passes its budget by a factor of 300 either way; the
  control does not pass. Unchanged from Round 3.
- **Four of the five key frames cannot reach 2× the ring box.** The owner's
  generated masters are 1280×720 and the Spotify frame is letterboxed to 536,
  so the plate gets 1.68× (cake, disney, academy), 2.00× (strings) and 1.25×
  (spotify) of its own box. Nothing was upscaled to hide it; at DPR 1.5 every
  frame still covers the plate, which the suite checks.
- **Phone is still emulation.** An RTX 5070 Ti with its CPU throttled is not a
  phone GPU, and Safari is not measured at all.
- **`valid-source-maps` fails** in every Lighthouse run: the build ships no
  source maps. A choice, not a defect.
- **The still document ships an eyebrow above every heading.** The documenter
  found it: `.signal__kicker` — 11 px, tracked, uppercase, secondary ink —
  renders above the title on all nineteen beats with no JS, no WebGL and for
  every crawler. The cinema hides it, and `signal.css`'s own comment states
  the ban, so the form is live precisely on the layer this design calls its
  base. Not fixed: the still document's composition is not one of this
  round's four scopes, and changing it is a design decision, not a repair.
- **LinkedIn answers 999 to a script** and was not machine-checked; unchanged
  from the shipped site.
- The machine's C: drive hit **zero bytes free** mid-round and took the suite
  down with an `ENOSPC`. 36 GB was reclaimed from the npm cache and Node's
  compile cache — regenerable tooling caches only, nothing of the owner's.

## Published as a second Pages site

The owner asked for this build live at its own GitHub URL with the existing
site untouched, so it is a SECOND Pages project rather than a deploy over the
first one.

| | |
|---|---|
| Live | **https://mohamed3042.github.io/flagship-portfolio-v2/** — `/en/` and `/ar/` both 200, zero failed requests and zero page errors in either |
| Repository | `Mohamed3042/flagship-portfolio-v2`, public, branch `gh-pages`, commit `fee5498`. The BUILT site only; the source stays in `flagship-portfolio` on `feature/deep-field` |
| Built by | `node scripts/build-ghpages.mjs --base flagship-portfolio-v2 --outDir dist-v2` |
| The first site | untouched. `/flagship-portfolio/en/`, `/worlds/` and `/worlds/academy.html` all still 200 |

`GH_PAGES_BASE` **defaults to the original**, so a build with no new variable
set is byte-identical to the one that has been shipping: the second site cannot
move the first one by accident.

**`worlds/` is deliberately absent from v2.** It is 1.68 GB of the 1.7 GB
build — the scroll-film pages and their clips — and nothing on the site links
to it by a relative path: the five portals point at
`https://mohamed3042.github.io/flagship-portfolio/worlds/…` absolutely, which
is where those pages already live. v2 is 30 MB. `robots.txt` was rewritten for
the v2 tree to name its own sitemap instead of the Netlify one.

One thing that cost a build: Git Bash rewrites an argument that looks like an
absolute POSIX path, so `--base /flagship-portfolio-v2` arrived as
`C:/Program Files/Git/flagship-portfolio-v2` — which Astro accepted for the
asset URLs and then wrote verbatim into every `<loc>` of the sitemap. The base
is normalised in the config now and the flag is documented without the slash.

**Both copies are indexable.** Two public copies of the same content on one
domain compete in search; a `noindex` or a canonical on v2 is one line if you
want the first site to stay the one Google finds.

## Merge note

Branch `feature/deep-field`, at the head of this round. `origin/main` moved
four commits after this branch forked (the One Sky universe work) and is
**merged in**, not rebased: the landing route stays Deep Field's, and
everything main added beside it — the flight engine and its data, the work-page
spine, the transmissions layer, the 44 px touch targets, the metric-matched
fallback faces — came across. `tokens.css` is the union of both sides, not a
choice between them.

Merging this to `main` changes, on the live site: the landing route at `/en`
and `/ar` becomes the Deep Field cinema in place of the One Sky home; the
archive below it and the site footer go black on that route in every theme;
`sky/story.ts` gets four corrected type assertions; and two Arabic lines change
on the work pages and in the archive (`لا يزال مكتبةَ Python`, `واجهة تكامل`),
plus the two `aria-label`s that now contain their buttons' visible words. The
Academy world is already live on `gh-pages` and does not depend on this merge.
`npm run build` is clean, `npm run typecheck` is clean, the suite is 895/895.

**No merge and no production deploy of the site have been made.** The owner
says the word.

Draft: https://6aadab9f6ac48df0e2d65dfb--mohamed-mahmoud-portfolio.netlify.app/en/
