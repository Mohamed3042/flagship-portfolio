/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/**
 * World loader (Alche's opening, studied frame by frame in the owner's recording): black, the MK drawn in thin
 * construction lines, its outline with guides along its edges (circles, the M's V and the K's arms run long, cap and base
 * lines across the screen) and the tagline: that is the loading phase. The outline stands exactly where the World's glass
 * mark will stand (hero.ts sends world:markrect while the World loads). When the World has really loaded and the drawing
 * is finished (the hero fires world:surge), the typed line and the bar fade (.35 s) while the World paints this very
 * picture (the black and the lines) into its last pass; on world:handover the loader goes in one frame and the World opens
 * alche's window from the middle of the screen onto the live Open (world-58b: open-window.ts, engine.ts uOpen). Nothing
 * scrolls until .8 s into the window, so the walk always starts at the top, as Alche's does. Fallbacks: world-failed, or
 * 14 s (a .4 s fade with reduced motion). Classic <head> script so it covers the first paint; html[data-loader=blueprint]
 * tells the shared arcade loader to stand aside. (The ball that swelled and puffed into a glass MK: lens.ts, git 08d2cb16;
 * the earlier versions: src/legacy/world-loader-blob.js.txt; the iris, git 38ace7e.)
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
  // never stuck: a World that has not opened after 20 s lets the page go, unless it is still loading (its scenes report
  // in, world:progress), and after 45 s in any case
  const born0 = performance.now();
  let heard = born0;
  addEventListener('world:progress', () => {heard = performance.now();});
  (function guard() {const now = performance.now(); if (now - born0 > 45000 || (now - born0 > 20000 && now - heard > 5000)) release(); else setTimeout(guard, 1000);})();

  const style = document.createElement('style');
  style.textContent = `
#mk-blueprint{position:fixed;inset:0;z-index:2147483000;overflow:hidden;transition:opacity .6s ${ease},visibility 0s .7s}
#mk-blueprint .bg{position:absolute;inset:0;background:#000}
#mk-blueprint svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#mk-blueprint .mk{transform-box:view-box;transform-origin:0 0}
#mk-blueprint .g{fill:none;stroke:rgba(232,232,236,.38);stroke-width:var(--sw);stroke-dasharray:1;stroke-dashoffset:1;opacity:0;animation:mkbp-draw .6s ${ease} forwards;animation-delay:var(--d)}
#mk-blueprint .m{fill:none;stroke:rgba(246,246,248,.85);stroke-width:calc(var(--sw) * 1.2);opacity:0;animation:mkbp-in .7s ${ease} 1.45s forwards}
#mk-blueprint p{position:absolute;left:0;right:0;top:var(--tag-y, calc(50% + var(--below, 22vh)));margin:0;padding:14px 0;translate:0 -14px;text-align:center;background:linear-gradient(transparent,#000 30%,#000 70%,transparent);transition:top .6s ${ease};font:400 12.5px/1.4 ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;letter-spacing:.04em;color:rgba(240,240,242,.78);white-space:pre}
#mk-blueprint p i{display:inline-block;width:.55em;height:1.05em;vertical-align:-.15em;background:rgba(240,240,242,.8);margin-left:1px;animation:mkbp-blink .9s steps(1) infinite}
@keyframes mkbp-blink{50%{opacity:0}}
#mk-blueprint .bar{position:absolute;left:50%;width:132px;margin-left:-66px;top:calc(var(--tag-y, calc(50% + var(--below, 22vh))) + 34px);height:1px;background:rgba(240,240,242,.12);opacity:0;transition:opacity .5s,top .6s ${ease}}
#mk-blueprint .bar i{position:absolute;inset:0;background:rgba(240,240,242,.62);transform-origin:0 50%;transform:scaleX(var(--k,0));transition:transform .45s ${ease}}
#mk-blueprint .bar.on{opacity:1}
#mk-blueprint.is-surge p,#mk-blueprint.is-surge .bar{animation:mkbp-out .35s forwards}
@media (min-aspect-ratio:1001/1000){#mk-blueprint svg{-webkit-mask-image:linear-gradient(90deg,transparent 10%,rgba(0,0,0,.16) 12%,rgba(0,0,0,.84) 16%,#000 18%,#000 82%,rgba(0,0,0,.84) 84%,rgba(0,0,0,.16) 88%,transparent 90%);mask-image:linear-gradient(90deg,transparent 10%,rgba(0,0,0,.16) 12%,rgba(0,0,0,.84) 16%,#000 18%,#000 82%,rgba(0,0,0,.84) 84%,rgba(0,0,0,.16) 88%,transparent 90%)}}
#mk-blueprint.is-open .bg,#mk-blueprint.is-open svg{visibility:hidden}
#mk-blueprint.is-done{opacity:0;visibility:hidden;pointer-events:none}
@keyframes mkbp-draw{from{opacity:1;stroke-dashoffset:1}to{opacity:1;stroke-dashoffset:0}}
@keyframes mkbp-in{to{opacity:1}}
@keyframes mkbp-out{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion:reduce) and (prefers-reduced-motion:no-preference){#mk-blueprint .g{animation:none;stroke-dashoffset:0;opacity:1}#mk-blueprint .m{animation:none;opacity:1}}`;
  // (world-13, item 22, the World only; Pop & Ship keeps its loader as it was) the owner's 03: the thin grey line sat on the
  // guides and the first 3 s were only lines. The line now stands on a solid black ground no guide crosses, in a readable
  // weight, and the name and role (profile.ts, as the World's opening shows them) type in first, from .35 s
  const r6 = !root.classList.contains('pop-world');
  if (r6) style.textContent += `#mk-blueprint.r6 p{left:50%;right:auto;translate:-50% -14px;width:max-content;max-width:calc(100% - 28px);padding:10px 16px;border-radius:10px;background:#000;box-shadow:0 0 0 6px #000;font:500 13px/1.5 ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;letter-spacing:.02em;color:rgba(244,244,246,.94);white-space:pre}
#mk-blueprint.r6 .bar{top:calc(var(--tag-y, calc(50% + var(--below, 22vh))) + 66px)}`;
  document.head.append(style);

  // the drawing, in the mark's own units (3.87 wide, 2 tall, centred, y up; the polygons of shared.ts MARK_POLYGONS), formed
  // as Alche's construction A is (recorded live at 30 fps, 2026-10-05): each stroke a bundle of three thin lines run across
  // the screen (both edges and the middle), the stems' edges and the guides, two circles; then the outline comes up out of
  // them and the tagline types in. The lens draws the very same (lens.ts drawing(): the same lists, keep in step).
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
  const VERT = [-1.935,-1.515,-0.455,-0.035,0.215,0.635], HORZ = [1,-1,0,0.15,-0.65,0.05,1.55,-1.5], CIRC = [[0,0,2.3],[0,0,1.35],[-0.985,0.15,0.36]];
  const DIAG = [[[0.635,0.18,1.365,1],[1.075,0.05,1.895,1]],[[-1.435,1,-0.985,0.15],[-1.515,0.25,-0.985,-0.65]],[[-0.535,1,-0.985,0.15],[-0.455,0.25,-0.985,-0.65]],[[1.075,0.05,1.935,-1],[0.775,-0.22,1.395,-1]]];   // K's arm, M's left arm, M's right arm, K's leg, in the order they come
  const far2 = ([x1, y1, x2, y2], d) => {const k = F / Math.hypot(x2 - x1, y2 - y1); return L(x1 - (x2 - x1) * k, y1 - (y2 - y1) * k, x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, d);};
  const guides = [
    ...VERT.map((x, i) => L(x, -F, x, F, i * .05)),
    ...DIAG.flatMap(([a, b], i) => [a, a.map((v, j) => (v + b[j]) / 2), b].map((l, j) => far2(l, .3 + i * .2 + j * .05))),
    ...HORZ.map((y, i) => L(i % 2 ? F : -F, y, i % 2 ? -F : F, y, .95 + i * .04)),
    ...CIRC.map(([x, y, r], i) => C([x, y], r, 1.15 + i * .1)),
  ].join('');
  const tall = innerHeight > innerWidth * 1.15;
  const el = document.createElement('div');
  el.id = 'mk-blueprint';
  el.style.setProperty('--below', tall ? '17vh' : '22vh');
  el.innerHTML = `<div class="bg"></div><svg aria-hidden="true"><g class="mk">${guides}${outline(M)}${outline(K)}</g></svg><p></p><span class="bar" aria-hidden="true"><i></i></span>`;
  // what has loaded: a hairline under the tagline, filled as the World's scenes are built (world:progress); it comes up
  // with the tagline
  const bar = el.querySelector('.bar');
  if (ar) bar.firstChild.style.transformOrigin = '100% 50%';
  addEventListener('world:progress', e => {const {done, total} = e.detail || {}; if (total) bar.style.setProperty('--k', String(done / total));});
  addEventListener('world:loaded', () => bar.style.setProperty('--k', '1'));
  setTimeout(() => bar.classList.add('on'), still ? 0 : 1100);
  // the tagline types in, a mono face and a caret, as Alche's motto does
  const motto = ar ? 'برمجيات وأنظمة وعوالم سينمائية.' : 'Software, systems and cinematic worlds.', tag = el.querySelector('p');
  const line = r6 ? (ar ? 'محمد محمود · مهندس ذكاء اصطناعي وأتمتة' : 'Mohamed Mahmoud · AI & Automation Engineer') + '\n' + motto : motto;
  if (r6) el.classList.add('r6');
  tag.innerHTML = '<i></i>';
  if (still) tag.textContent = line;
  else setTimeout(function type(n = 1) {tag.textContent = line.slice(0, n); tag.append(Object.assign(document.createElement('i')));
    if (n < line.length) setTimeout(() => type(n + 1), r6 ? 20 : 26);}, r6 ? 350 : 1100);
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
  // (world-11c, owner's iPhone 11 Nov: on a phone the typed line ran across the MK's strokes) on a tall screen the line stands
  // under the outline (the mark is two units tall, centred on y), on a soft black band that hides the construction lines
  // behind it; wide screens keep their place, with the same band
  const under = (y, unit) => {if (tall) el.style.setProperty('--tag-y', `${Math.round(Math.min(innerHeight - 64, y + unit + 30))}px`);};
  under(innerHeight * .44, innerWidth * .92 / MW);
  addEventListener('world:markrect', e => {const {x, y, unit} = e.detail; place(x, y, unit, true); under(y, unit);});
  // the World waits for the drawing (the outline's 2 s from .35 s) before it takes the picture over
  const mount = () => {if (!document.body) return requestAnimationFrame(mount); document.body.prepend(el); window.__mkDrawnAt = performance.now() + 2400;};
  mount();

  // the surge: the typed line and the bar fade, the black and the lines stay; on world:handover (the World draws the same
  // picture from that frame on) the loader goes at once and the World's window opens; without a surge (the World failed, or
  // 14 s went by) the loader fades away instead (a plain .4 s fade with reduced motion)
  let gone = false;
  function open(handover) {
    if (gone) return; gone = true;
    if (handover && !still) {
      el.classList.add('is-surge');
      const out = () => {if (el.classList.contains('is-open')) return; el.classList.add('is-open'); setTimeout(() => el.remove(), 100);};
      addEventListener('world:handover', out, {once: true});
      setTimeout(out, 3000);   // (never stuck over the World)
      return;
    }
    if (still) el.style.transition = 'opacity .4s linear,visibility 0s .45s';
    el.classList.add('is-done'); setTimeout(() => el.remove(), 700);
    if (still || root.classList.contains('world-failed')) release();
  }
  addEventListener('world:surge', () => open(true));
  addEventListener('world:open', () => {open(false); release();});   // a World with no glass to hand over to (Pop & Ship's film): fade out, page free
  addEventListener('world:intro', e => {if (!e.detail && gone) release();});   // the opening is over: the page is yours
  const born = performance.now();
  (function wait() {
    if (gone) return;
    const now = performance.now();   // (a World still loading keeps its loader; hero.ts opens itself 3 s after it has loaded)
    if (root.classList.contains('world-failed') || (now - born > 14000 && now - heard > 5000) || now - born > 45000) return open(false);
    setTimeout(wait, 200);
  })();
})();
