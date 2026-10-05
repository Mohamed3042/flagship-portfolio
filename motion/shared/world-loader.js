/**
 * World loader (Alche's opening, studied frame by frame in the owner's recording): black, the MK monogram drawn in thin
 * construction lines with its guides (circles, the M's diagonals run long, cap and base lines across the screen) and the
 * tagline: that is the loading phase. When the World has really loaded (the hero fires world:surge after a run of smooth
 * frames) the guides fade and the clean monogram holds; then the World's glass appears in the middle as a bead and swells
 * into a ball, and the drawing is cut away behind it, so the ball is a window onto the World (src/scripts/world/lens.ts
 * draws the glass, on the same clock: seconds since the surge); as the ball spreads into a fat glass MK the black falls
 * away. Fallbacks: world-failed, or 9 s. Classic <head> script so it covers the first paint; html[data-loader=blueprint]
 * tells the shared arcade loader to stand aside. (The earlier versions: src/legacy/world-loader-blob.js.txt, and the
 * blueprint-bending ball in git 31ba6b8.)
 */
(() => {
  const root = document.documentElement;
  if (window.top !== window) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches, ar = root.lang === 'ar';
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const style = document.createElement('style');
  style.textContent = `
#mk-blueprint{position:fixed;inset:0;z-index:2147483000;background:#000;display:grid;place-items:center;overflow:hidden;transition:opacity .5s ${ease},visibility 0s .6s}
#mk-blueprint svg,#mk-blueprint canvas{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#mk-blueprint .g{fill:none;stroke:rgba(225,240,233,.38);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:mkbp-draw 1.6s ${ease} forwards;animation-delay:var(--d)}
#mk-blueprint .m{fill:none;stroke:rgba(240,248,244,.85);stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:mkbp-draw 2s ${ease} .35s forwards}
#mk-blueprint p{position:absolute;left:0;right:0;top:calc(50% + var(--below, 22vh));margin:0;text-align:center;font:500 15px/1.4 'Space Grotesk Variable','Inter Variable','Cairo',system-ui,sans-serif;color:rgba(225,240,233,.7);opacity:0;animation:mkbp-in 1s ${ease} .9s forwards}
#mk-blueprint.is-open p{animation:mkbp-out .35s forwards}
#mk-blueprint.is-open .g{transition:opacity .35s ease;opacity:0}
#mk-blueprint.is-done{opacity:0;visibility:hidden;pointer-events:none}
@keyframes mkbp-draw{to{stroke-dashoffset:0}}
@keyframes mkbp-in{to{opacity:1}}
@keyframes mkbp-out{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion:reduce){#mk-blueprint .g,#mk-blueprint .m{animation:none;stroke-dashoffset:0}#mk-blueprint p{animation:none;opacity:1}}`;
  document.head.append(style);

  // the drawing: the monogram's 1000×1000 box fills most of the screen (a taller frame on phones); the long guides run far past it
  const tall = innerHeight > innerWidth * 1.15;
  const VB = tall ? [-60, -420, 1120, 1850] : [-250, -100, 1500, 1200];
  const lines = [], circles = [];
  const L = (x1, y1, x2, y2, d) => {lines.push([x1, y1, x2, y2]); return `<line class="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--l:${Math.round(Math.hypot(x2 - x1, y2 - y1))};--d:${d}s"/>`;};
  const C = (cx, cy, r, d) => {circles.push([cx, cy, r]); return `<circle class="g" cx="${cx}" cy="${cy}" r="${r}" style="--l:${Math.round(2 * Math.PI * r)};--d:${d}s"/>`;};
  // the monogram itself, as strokes: M (two posts and the V) and K (post, two arms)
  const M = 'M140 720 L140 290 L330 560 L520 290 L520 720', K = 'M600 290 L600 720 M860 290 L600 540 L860 720';
  const svg = `<svg viewBox="${VB.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ${L(-1000, 290, 2000, 290, 0)}${L(-1000, 720, 2000, 720, .1)}${L(-1000, 505, 2000, 505, .25)}
    ${L(140, -1000, 140, 2000, .15)}${L(520, -1000, 520, 2000, .2)}${L(600, -1000, 600, 2000, .3)}${L(860, -1000, 860, 2000, .35)}
    ${L(-50, 20, 710, 1100, .2)}${L(710, 20, -50, 1100, .25)}${L(860, 290, 1300, -130, .4)}${L(600, 540, 1500, 1360, .45)}
    ${C(500, 505, 430, .3)}${C(500, 505, 250, .45)}${C(330, 560, 70, .6)}
    <path class="m" d="${M}" style="--l:1500"/><path class="m" d="${K}" style="--l:1100"/>
  </svg>`;
  const el = document.createElement('div');
  el.id = 'mk-blueprint';
  el.style.setProperty('--below', tall ? '17vh' : '22vh');
  el.innerHTML = `${svg}<p>${ar ? 'برمجيات وأنظمة وعوالم سينمائية.' : 'Software, systems and cinematic worlds.'}</p>`;
  el.setAttribute('role', 'status'); el.setAttribute('aria-label', ar ? 'جارٍ تحميل العالم' : 'Loading the World');
  const mount = () => document.body ? document.body.prepend(el) : requestAnimationFrame(mount);
  mount();

  // Keep in step with hero.ts: the bead appears at .75 s and is a ball .36 of the short side across by 1.05 s; from 1.02 s
  // the black falls away while the ball spreads into the glass MK.
  let gone = false;
  function open() {
    if (gone) return; gone = true;
    const done = () => {el.classList.add('is-done'); setTimeout(() => el.remove(), 700);};
    if (still) return done();
    el.classList.add('is-open');                                          // the guides and the tagline fade; the monogram holds
    const cx = innerWidth / 2, cy = innerHeight / 2, R = Math.min(innerWidth, innerHeight) * .36, t0 = performance.now();
    const out = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    (function frame(now) {
      const t = (now - t0) / 1000, r = t < .75 ? 0 : 6 + (R - 6) * out((t - .75) / .3);
      el.style.webkitMaskImage = el.style.maskImage = r > 0 ? `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r - 1}px, #000 ${r + 1}px)` : '';
      el.style.opacity = String(1 - Math.min(1, Math.max(0, (t - 1.02) / .2)));
      if (t < 1.25) requestAnimationFrame(frame); else done();
    })(t0);
  }
  addEventListener('world:surge', open);
  const born = performance.now();
  (function wait() {
    if (gone) return;
    if (root.classList.contains('world-failed') || performance.now() - born > 9000) return open();
    setTimeout(wait, 200);
  })();
})();
