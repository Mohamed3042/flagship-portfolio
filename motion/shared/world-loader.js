/*! © 2026 Mohamed Mahmoud. All rights reserved. */


(() => {
  const root = document.documentElement;
  if (window.top !== window) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches, ar = root.lang === 'ar';
  const ease = 'cubic-bezier(.2,.8,.2,1)';


  try {history.scrollRestoration = 'manual';} catch {}
  if (!location.hash) scrollTo(0, 0);
  root.classList.add('world-hold');
  const held = e => {if (root.classList.contains('world-hold')) {e.preventDefault(); e.stopImmediatePropagation();}};
  addEventListener('wheel', held, {capture: true, passive: false});
  addEventListener('touchmove', held, {capture: true, passive: false});
  addEventListener('keydown', e => {if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) held(e);}, {capture: true});
  const release = () => root.classList.remove('world-hold');


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



  const r6 = !root.classList.contains('pop-world');
  if (r6) style.textContent += `#mk-blueprint.r6 p{left:50%;right:auto;translate:-50% -14px;width:max-content;max-width:calc(100% - 28px);padding:10px 16px;border-radius:10px;background:#000;box-shadow:0 0 0 6px #000;font:500 13px/1.5 ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;letter-spacing:.02em;color:rgba(244,244,246,.94);white-space:pre}
#mk-blueprint.r6 .bar{top:calc(var(--tag-y, calc(50% + var(--below, 22vh))) + 66px)}`;
  document.head.append(style);





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
  const DIAG = [[[0.635,0.18,1.365,1],[1.075,0.05,1.895,1]],[[-1.435,1,-0.985,0.15],[-1.515,0.25,-0.985,-0.65]],[[-0.535,1,-0.985,0.15],[-0.455,0.25,-0.985,-0.65]],[[1.075,0.05,1.935,-1],[0.775,-0.22,1.395,-1]]];
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


  const bar = el.querySelector('.bar');
  if (ar) bar.firstChild.style.transformOrigin = '100% 50%';
  addEventListener('world:progress', e => {const {done, total} = e.detail || {}; if (total) bar.style.setProperty('--k', String(done / total));});
  addEventListener('world:loaded', () => bar.style.setProperty('--k', '1'));
  setTimeout(() => bar.classList.add('on'), still ? 0 : 1100);

  const motto = ar ? 'برمجيات وأنظمة وعوالم سينمائية.' : 'Software, systems and cinematic worlds.', tag = el.querySelector('p');
  const line = r6 ? (ar ? 'محمد محمود · مهندس ذكاء اصطناعي وأتمتة' : 'Mohamed Mahmoud · AI & Automation Engineer') + '\n' + motto : motto;
  if (r6) el.classList.add('r6');
  tag.innerHTML = '<i></i>';
  if (still) tag.textContent = line;
  else setTimeout(function type(n = 1) {tag.textContent = line.slice(0, n); tag.append(Object.assign(document.createElement('i')));
    if (n < line.length) setTimeout(() => type(n + 1), r6 ? 20 : 26);}, r6 ? 350 : 1100);
  el.setAttribute('role', 'status'); el.setAttribute('aria-label', ar ? 'جارٍ تحميل العالم' : 'Loading the World');
  const g = el.querySelector('.mk');

  const place = (x, y, unit, glide) => {
    g.style.transition = glide ? `transform .6s ${ease}` : 'none';
    g.style.transform = `translate(${x}px, ${y}px) scale(${unit}, ${-unit})`;
    g.style.setProperty('--sw', String(1 / unit));
  };

  place(innerWidth / 2, innerHeight * (tall ? .44 : .43), innerWidth * (tall ? .92 : .52) / MW, false);



  const under = (y, unit) => {if (tall) el.style.setProperty('--tag-y', `${Math.round(Math.min(innerHeight - 64, y + unit + 30))}px`);};
  under(innerHeight * .44, innerWidth * .92 / MW);
  addEventListener('world:markrect', e => {const {x, y, unit} = e.detail; place(x, y, unit, true); under(y, unit);});

  const mount = () => {if (!document.body) return requestAnimationFrame(mount); document.body.prepend(el); window.__mkDrawnAt = performance.now() + 2400;};
  mount();




  let gone = false;
  function open(handover) {
    if (gone) return; gone = true;
    if (handover && !still) {
      el.classList.add('is-surge');
      const out = () => {if (el.classList.contains('is-open')) return; el.classList.add('is-open'); setTimeout(() => el.remove(), 100);};
      addEventListener('world:handover', out, {once: true});
      setTimeout(out, 3000);
      return;
    }
    if (still) el.style.transition = 'opacity .4s linear,visibility 0s .45s';
    el.classList.add('is-done'); setTimeout(() => el.remove(), 700);
    if (still || root.classList.contains('world-failed')) release();
  }
  addEventListener('world:surge', () => open(true));
  addEventListener('world:open', () => {open(false); release();});
  addEventListener('world:intro', e => {if (!e.detail && gone) release();});
  const born = performance.now();
  (function wait() {
    if (gone) return;
    const now = performance.now();
    if (root.classList.contains('world-failed') || (now - born > 14000 && now - heard > 5000) || now - born > 45000) return open(false);
    setTimeout(wait, 200);
  })();
})();
