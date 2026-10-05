/**
 * World loader (Alche's opening, studied frame by frame in the owner's recording): black, the MK drawn in thin
 * construction lines, its outline with guides along its edges (circles, the M's V and the K's arms run long, cap and base
 * lines across the screen) and the tagline: that is the loading phase. The outline stands exactly where the World's glass
 * mark will stand (hero.ts sends world:markrect while the World loads). When the World has really loaded and the drawing
 * is finished (the hero fires world:surge), the loader hands its picture over: the World's lens draws the same black and
 * the same lines on the same spot, so its glass can bend them, and the loader goes in that frame (lens.ts: a crystal
 * ball pops in the mark, swells past the screen and becomes the glass MK; the owner, 2026-10-05, "liquid glass PULSING of
 * those letters"; a window cut in the black read as a cartoon iris). Nothing scrolls until the opening is over, so the
 * walk always starts at the top, as Alche's does. Fallbacks: world-failed, or 14 s. Classic <head> script so it covers
 * the first paint; html[data-loader=blueprint] tells the shared arcade loader to stand aside. (The earlier versions:
 * src/legacy/world-loader-blob.js.txt; the iris, git 38ace7e; the bead that swelled into a ball, git 37ba4f3.)
 */
(() => {
  const root = document.documentElement;
  if (window.top !== window) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches, ar = root.lang === 'ar';
  const ease = 'cubic-bezier(.2,.8,.2,1)';

  // Hold the page still until the opening is over (scrolling while it loaded dropped you into the middle of the walk)
  try {history.scrollRestoration = 'manual';} catch {}
  if (!location.hash) scrollTo(0, 0);
  root.classList.add('world-hold');
  const held = e => {if (root.classList.contains('world-hold')) {e.preventDefault(); e.stopImmediatePropagation();}};
  addEventListener('wheel', held, {capture: true, passive: false});
  addEventListener('touchmove', held, {capture: true, passive: false});
  addEventListener('keydown', e => {if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) held(e);}, {capture: true});
  const release = () => root.classList.remove('world-hold');
  setTimeout(release, 20000);   // never stuck: a World that has not opened by then lets the page go

  const style = document.createElement('style');
  style.textContent = `
#mk-blueprint{position:fixed;inset:0;z-index:2147483000;overflow:hidden;transition:opacity .6s ${ease},visibility 0s .7s}
#mk-blueprint .bg{position:absolute;inset:0;background:#000}
#mk-blueprint svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#mk-blueprint .mk{transform-box:view-box;transform-origin:0 0}
#mk-blueprint .g{fill:none;stroke:rgba(225,240,233,.38);stroke-width:var(--sw);stroke-dasharray:1;stroke-dashoffset:1;animation:mkbp-draw 1.6s ${ease} forwards;animation-delay:var(--d)}
#mk-blueprint .m{fill:none;stroke:rgba(240,248,244,.85);stroke-width:calc(var(--sw) * 1.2);stroke-dasharray:1;stroke-dashoffset:1;animation:mkbp-draw 2s ${ease} .35s forwards}
#mk-blueprint p{position:absolute;left:0;right:0;top:calc(50% + var(--below, 22vh));margin:0;text-align:center;font:500 15px/1.4 'Space Grotesk Variable','Inter Variable','Cairo',system-ui,sans-serif;color:rgba(225,240,233,.7);opacity:0;animation:mkbp-in 1s ${ease} .9s forwards}
#mk-blueprint.is-open p{animation:mkbp-out .35s forwards}
#mk-blueprint.is-open .bg,#mk-blueprint.is-open svg{visibility:hidden}
#mk-blueprint.is-done{opacity:0;visibility:hidden;pointer-events:none}
@keyframes mkbp-draw{to{stroke-dashoffset:0}}
@keyframes mkbp-in{to{opacity:1}}
@keyframes mkbp-out{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion:reduce) and (prefers-reduced-motion:no-preference){#mk-blueprint .g,#mk-blueprint .m{animation:none;stroke-dashoffset:0}#mk-blueprint p{animation:none;opacity:1}}`;
  document.head.append(style);

  // the drawing, in the mark's own units (3.87 wide, 2 tall, centred, y up; the polygons of shared.ts MARK_POLYGONS): the
  // glyph's outline, as Alche's construction A is its outline, with the guides run far past the screen
  const MW = 3.87, F = 30;
  const M = [[0, 0], [0, 2], [.5, 2], [.95, 1.15], [1.4, 2], [1.9, 2], [1.9, 0], [1.48, 0], [1.48, 1.25], [.95, .35], [.42, 1.25], [.42, 0]];
  const K = [[0, 0], [0, 2], [.42, 2], [.42, 1.18], [1.15, 2], [1.68, 2], [.86, 1.05], [1.72, 0], [1.18, 0], [.56, .78], [.42, .93], [.42, 0]].map(([x, y]) => [x + 2.15, y]);
  const at = ([x, y]) => [x - MW / 2, y - 1];
  const f3 = v => v.toFixed(3);
  const outline = P => `<path class="m" pathLength="1" d="M${P.map(p => at(p).map(f3).join(' ')).join(' L')} Z"/>`;
  const L = (x1, y1, x2, y2, d) => `<line class="g" pathLength="1" x1="${f3(x1)}" y1="${f3(y1)}" x2="${f3(x2)}" y2="${f3(y2)}" style="--d:${d}s"/>`;
  const C = ([cx, cy], r, d) => `<circle class="g" pathLength="1" cx="${f3(cx)}" cy="${f3(cy)}" r="${r}" style="--d:${d}s"/>`;
  const long = (a, b, d) => {const [x1, y1] = at(a), [x2, y2] = at(b), k = F / Math.hypot(x2 - x1, y2 - y1); return L(x1 - (x2 - x1) * k, y1 - (y2 - y1) * k, x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, d);};
  const h = MW / 2;
  const guides = [
    L(-F, 1, F, 1, 0), L(-F, -1, F, -1, .1), L(-F, 0, F, 0, .25),                                                   // cap, base, middle
    L(-h, -F, -h, F, .15), L(1.9 - h, -F, 1.9 - h, F, .2), L(2.15 - h, -F, 2.15 - h, F, .3), L(h, -F, h, F, .35),   // the stems' outer edges
    long([.5, 2], [.95, 1.15], .2), long([1.4, 2], [.95, 1.15], .25), long([2.57, 1.18], [3.3, 2], .4), long([3.01, 1.05], [3.87, 0], .45),
    C([0, 0], 2.3, .3), C([0, 0], 1.35, .45), C(at([.95, 1.15]), .36, .6),
  ].join('');
  const tall = innerHeight > innerWidth * 1.15;
  const el = document.createElement('div');
  el.id = 'mk-blueprint';
  el.style.setProperty('--below', tall ? '17vh' : '22vh');
  el.innerHTML = `<div class="bg"></div><svg aria-hidden="true"><g class="mk">${guides}${outline(M)}${outline(K)}</g></svg><p>${ar ? 'برمجيات وأنظمة وعوالم سينمائية.' : 'Software, systems and cinematic worlds.'}</p>`;
  el.setAttribute('role', 'status'); el.setAttribute('aria-label', ar ? 'جارٍ تحميل العالم' : 'Loading the World');
  const g = el.querySelector('.mk');
  // (the lines' widths are in the mark's units, one CSS px whatever its size, so the dashes that draw them stay whole)
  const place = (x, y, unit, glide) => {
    g.style.transition = glide ? `transform .6s ${ease}` : 'none';
    g.style.transform = `translate(${x}px, ${y}px) scale(${unit}, ${-unit})`;
    g.style.setProperty('--sw', String(1 / unit));
  };
  // where the mark will stand, until the World says exactly (hero.ts: about half the width, nine tenths on phones)
  place(innerWidth / 2, innerHeight * (tall ? .44 : .43), innerWidth * (tall ? .92 : .52) / MW, false);
  addEventListener('world:markrect', e => {const {x, y, unit} = e.detail; place(x, y, unit, true);});
  // the World waits for the drawing (the outline's 2 s from .35 s) before it takes the picture over
  const mount = () => {if (!document.body) return requestAnimationFrame(mount); document.body.prepend(el); window.__mkDrawnAt = performance.now() + 2400;};
  mount();

  // the surge: the World's lens has the same picture on the same spot from this frame on, so the black and the lines go at
  // once and only the tagline fades; without a surge (the World failed, or 9 s went by) the loader fades away instead
  let gone = false;
  function open(handover) {
    if (gone) return; gone = true;
    if (handover && !still) {el.classList.add('is-open'); setTimeout(() => el.remove(), 500); return;}
    el.classList.add('is-done'); setTimeout(() => el.remove(), 700);
    if (still || root.classList.contains('world-failed')) release();
  }
  addEventListener('world:surge', () => open(true));
  addEventListener('world:intro', e => {if (!e.detail && gone) release();});   // the opening is over: the page is yours
  const born = performance.now();
  (function wait() {
    if (gone) return;
    if (root.classList.contains('world-failed') || performance.now() - born > 14000) return open(false);   // (a slow World opens itself after 6 s: hero.ts)
    setTimeout(wait, 200);
  })();
})();
