/**
 * World loader (Alche's opening): black, the MK monogram drawn in thin construction lines with its
 * guides (circles, the M's diagonals run long, cap and base lines across the screen) and the
 * tagline. When the World has really loaded (the hero fires world:surge after a run of smooth
 * frames), a portal bursts out of the middle and opens onto the World, in step with the ring of
 * light behind the glass. Fallbacks: world-failed, or 9 s. Classic <head> script so it covers the
 * first paint; html[data-loader=blueprint] tells the shared arcade loader to stand aside.
 */
(() => {
  const root = document.documentElement;
  if (window.top !== window) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches, ar = root.lang === 'ar';
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const style = document.createElement('style');
  style.textContent = `
#mk-blueprint{position:fixed;inset:0;z-index:2147483000;background:#000;display:grid;place-items:center;overflow:hidden;transition:opacity .7s ${ease} .25s,visibility 0s 1s}
#mk-blueprint svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#mk-blueprint .g{fill:none;stroke:rgba(225,240,233,.38);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:mkbp-draw 1.6s ${ease} forwards;animation-delay:var(--d)}
#mk-blueprint .m{fill:none;stroke:rgba(240,248,244,.85);stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:mkbp-draw 2s ${ease} .35s forwards}
#mk-blueprint p{position:absolute;left:0;right:0;top:calc(50% + var(--below, 22vh));margin:0;text-align:center;font:500 15px/1.4 'Space Grotesk Variable','Inter Variable','Cairo',system-ui,sans-serif;color:rgba(225,240,233,.7);opacity:0;animation:mkbp-in 1s ${ease} .9s forwards}
#mk-blueprint i{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px;border-radius:50%;opacity:0;background:radial-gradient(circle,#fff 0 16%,transparent 34%),conic-gradient(from 0deg,#6a4dff,#f4efff,#3b2bd1,#c9b8ff,#160a5c,#8f74ff,#6a4dff);-webkit-mask:radial-gradient(circle,#000 62%,transparent 71%);mask:radial-gradient(circle,#000 62%,transparent 71%);box-shadow:0 0 60px 20px rgba(140,110,255,.55)}
#mk-blueprint.is-burst i{animation:mkbp-burst 1.05s cubic-bezier(.6,0,.2,1) forwards}
#mk-blueprint.is-burst svg{transition:opacity .45s;opacity:0}
#mk-blueprint.is-burst p{animation:mkbp-out .35s forwards}
#mk-blueprint.is-done{opacity:0;visibility:hidden;pointer-events:none}
@keyframes mkbp-draw{to{stroke-dashoffset:0}}
@keyframes mkbp-in{to{opacity:1}}
@keyframes mkbp-out{from{opacity:1}to{opacity:0}}
@keyframes mkbp-burst{0%{opacity:0;transform:scale(1) rotate(0)}12%{opacity:1}55%{opacity:1;transform:scale(40) rotate(140deg)}100%{opacity:0;transform:scale(260) rotate(260deg)}}
@media (prefers-reduced-motion:reduce){#mk-blueprint .g,#mk-blueprint .m{animation:none;stroke-dashoffset:0}#mk-blueprint p{animation:none;opacity:1}}`;
  document.head.append(style);

  // the drawing: the monogram's 1000×1000 box fills most of the screen (a taller frame on phones);
  // the long guides run far past it
  const tall = innerHeight > innerWidth * 1.15;
  const box = `viewBox="${tall ? '-60 -420 1120 1850' : '-250 -100 1500 1200'}" preserveAspectRatio="xMidYMid meet"`;
  const L = (x1, y1, x2, y2, d) => `<line class="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--l:${Math.round(Math.hypot(x2 - x1, y2 - y1))};--d:${d}s"/>`;
  const C = (cx, cy, r, d) => `<circle class="g" cx="${cx}" cy="${cy}" r="${r}" style="--l:${Math.round(2 * Math.PI * r)};--d:${d}s"/>`;
  // the monogram itself, as strokes: M (two posts and the V) and K (post, two arms)
  const M = 'M140 720 L140 290 L330 560 L520 290 L520 720', K = 'M600 290 L600 720 M860 290 L600 540 L860 720';
  const svg = `<svg ${box} aria-hidden="true">
    ${L(-1000, 290, 2000, 290, 0)}${L(-1000, 720, 2000, 720, .1)}${L(-1000, 505, 2000, 505, .25)}
    ${L(140, -1000, 140, 2000, .15)}${L(520, -1000, 520, 2000, .2)}${L(600, -1000, 600, 2000, .3)}${L(860, -1000, 860, 2000, .35)}
    ${L(-50, 20, 710, 1100, .2)}${L(710, 20, -50, 1100, .25)}${L(860, 290, 1300, -130, .4)}${L(600, 540, 1500, 1360, .45)}
    ${C(500, 505, 430, .3)}${C(500, 505, 250, .45)}${C(330, 560, 70, .6)}
    <path class="m" d="${M}" style="--l:1500"/><path class="m" d="${K}" style="--l:1100"/>
  </svg>`;
  const el = document.createElement('div');
  el.id = 'mk-blueprint';
  el.style.setProperty('--below', tall ? '17vh' : '22vh');
  el.innerHTML = `${svg}<i aria-hidden="true"></i><p>${ar ? 'برمجيات وأنظمة وعوالم سينمائية.' : 'Software, systems and cinematic worlds.'}</p>`;
  el.setAttribute('role', 'status'); el.setAttribute('aria-label', ar ? 'جارٍ تحميل العالم' : 'Loading the World');
  const mount = () => document.body ? document.body.prepend(el) : requestAnimationFrame(mount);
  mount();

  let gone = false;
  function open() {
    if (gone) return; gone = true;
    if (still) {el.classList.add('is-done'); setTimeout(() => el.remove(), 1100); return;}
    el.classList.add('is-burst');
    setTimeout(() => el.classList.add('is-done'), 650);
    setTimeout(() => el.remove(), 1800);
  }
  addEventListener('world:surge', open);
  const born = performance.now();
  (function wait() {
    if (gone) return;
    if (root.classList.contains('world-failed') || performance.now() - born > 9000) return open();
    setTimeout(wait, 200);
  })();
})();
