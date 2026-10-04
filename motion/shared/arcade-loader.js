/**
 * Arcade loader, 2026-10-03. While a page loads, it sits under coloured frosted glass (blur + saturate,
 * so the page's own colours glow through) and two original pixel bots (coral and white) play Pong on a
 * glass cabinet. Once ready the cabinet leaves and the glass clears, so the landing fades in sharp.
 * Classic <head> script (no defer/async) so it covers the first paint. Ready = window load, plus the
 * film's first frame on film pages (html.film-ready), capped at 6 s. Skipped inside iframes (embedded
 * films) and with html[data-arcade=off]. Reduced motion: one still frame. No dependencies.
 */
(() => {
  const root = document.documentElement;
  if (window.top !== window || root.classList.contains('mk-loading') || root.dataset.arcade === 'off' || root.dataset.loader === 'blueprint') return;   // the World has its own
  root.classList.add('mk-loading');
  const born = performance.now(), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const style = document.createElement('style');
  style.textContent = `
#mk-arcade{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:rgba(6,10,8,.34);-webkit-backdrop-filter:blur(30px) saturate(190%);backdrop-filter:blur(30px) saturate(190%);transition:background 1s ${ease},-webkit-backdrop-filter 1.1s ${ease},backdrop-filter 1.1s ${ease},visibility 0s 1.1s}
#mk-arcade.is-done{background:rgba(6,10,8,0);-webkit-backdrop-filter:blur(0) saturate(100%);backdrop-filter:blur(0) saturate(100%);visibility:hidden;pointer-events:none}
#mk-arcade .mk-cab{position:relative;padding:12px;border-radius:22px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 30px 90px rgba(0,0,0,.45);transition:opacity .4s ease,transform .5s ${ease}}
#mk-arcade.is-done .mk-cab{opacity:0;transform:scale(.94) translateY(6px)}
#mk-arcade canvas{display:block;width:min(70vw,460px);aspect-ratio:160/90;image-rendering:pixelated;border-radius:12px}
#mk-arcade .mk-cab:after{content:'';position:absolute;inset:12px;border-radius:12px;pointer-events:none;background:repeating-linear-gradient(#0000 0 2px,#0000002a 2px 3px)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){#mk-arcade{background:rgba(6,10,8,.9)}}`;
  document.head.append(style);

  const W = 160, H = 90;
  const BOTS = [ // 8x8 original pixel bots: '.' clear; a coral body, b white body, k visor, e eyes
    ['..aaaa..', '.aaaaaa.', 'aa.aa.aa', 'aaaaaaaa', 'aaaaaaaa', 'a.aaaa.a', '.a.aa.a.', '.a....a.'],
    ['..bbbb..', '.bbbbbb.', 'bkkkkkkb', 'bkekkekb', 'bbbbbbbb', 'b.bbbb.b', '.b.bb.b.', '.b....b.'],
  ];
  const COLORS = {a: '#e07a5f', b: '#eef2f0', k: '#0b1310', e: '#7ad3ff'};
  const FONT = { // 3x5 glyphs, row-major
    L: '100100100100111', O: '111101101101111', A: '010101111101101', D: '110101101101110',
    I: '111010010010111', N: '101111111111101', G: '011100101101011', '.': '000000000000010',
  };
  let ctx, frame = 0, raf = 0, done = false;
  const ball = {x: 80, y: 40, vx: 1.6, vy: 1.1}, bots = [{y: 38}, {y: 38}];

  const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    px(0, 0, W, H, 'rgba(4,10,7,.82)');
    for (let y = 4; y < H - 14; y += 6) px(W / 2, y, 1, 3, '#2a4a39');                          // net
    px(0, H - 12, W, 1, '#2a4a39');
    bots.forEach((bot, side) => {
      const x = side ? W - 18 : 10;
      BOTS[side].forEach((row, j) => [...row].forEach((ch, i) => ch !== '.' && px(x + i, bot.y - 4 + j, 1, 1, COLORS[ch])));
      px(side ? x - 3 : x + 10, bot.y - 6, 2, 12, side ? '#eef2f0' : '#e07a5f');                  // paddle
    });
    for (let t = 1; t <= 3; t++) px(ball.x - ball.vx * t * 2, ball.y - ball.vy * t * 2, 2, 2, `rgba(122,211,164,${.3 / t})`);
    px(ball.x, ball.y, 2, 2, '#c9ffe3');
    const word = 'LOADING' + '.'.repeat(1 + (Math.floor(frame / 18) % 3)), color = frame % 36 < 26 ? '#9fe7c2' : '#5c8f74';
    [...word].forEach((ch, n) => [...FONT[ch]].forEach((bit, i) => bit === '1' && px(W / 2 - 18 + n * 4 + (i % 3), H - 8 + Math.floor(i / 3), 1, 1, color)));
  }
  function step() {
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.y < 2 || ball.y > H - 16) ball.vy *= -1;
    bots.forEach((bot, side) => {                                                                  // lazy tracking
      bot.y += (((side ? ball.vx > 0 : ball.vx < 0) ? ball.y : H / 2 - 6) - bot.y) * 0.09;
      const face = side ? W - 21 : 20;
      if ((side ? ball.x >= face : ball.x <= face) && Math.abs(ball.y - bot.y) < 8) {
        ball.vx = Math.max(-3, Math.min(3, -ball.vx * 1.04)); ball.vy += (ball.y - bot.y) * 0.08; ball.x = face + (side ? -1 : 1);
      }
    });
    if (ball.x < 0 || ball.x > W) Object.assign(ball, {x: W / 2, y: 40, vx: Math.random() < .5 ? -1.6 : 1.6, vy: 1.1});
  }
  function loop() { if (done) return; frame++; step(); draw(); raf = requestAnimationFrame(loop); }

  function mount() {
    if (document.getElementById('mk-arcade')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mk-arcade';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', root.lang === 'ar' ? 'جارٍ التحميل' : 'Loading');
    overlay.innerHTML = '<div class="mk-cab"><canvas width="160" height="90" aria-hidden="true"></canvas></div>';
    document.body.prepend(overlay);
    ctx = overlay.querySelector('canvas').getContext('2d');
    still ? draw() : loop();
  }
  function finish() {
    if (done) return;
    const wait = 600 - (performance.now() - born);                                                  // let one rally show
    if (wait > 0) return void setTimeout(finish, wait);
    done = true; cancelAnimationFrame(raf);
    root.classList.remove('mk-loading');
    const overlay = document.getElementById('mk-arcade');
    overlay?.classList.add('is-done');
    setTimeout(() => overlay?.remove(), 1200);
  }
  function whenReady() {
    const film = document.querySelector('[data-film-story]') && root.dataset.portfolioMediaReady !== 'false';
    // Pages with a World canvas also wait for its first frame (or its failure / reduced motion).
    const world = document.querySelector('[data-world-canvas]') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ready = () => (!film || root.classList.contains('film-ready') || root.classList.contains('is-poster-mode'))
      && (!world || root.classList.contains('world-first-frame') || root.classList.contains('world-failed'));
    if (ready()) return finish();
    const watch = new MutationObserver(() => ready() && (watch.disconnect(), finish()));
    watch.observe(root, {attributes: true, attributeFilter: ['class']});
    setTimeout(finish, 2500);                                                                      // never hold a slow network hostage
  }
  if (document.body) mount();
  else new MutationObserver((_, watch) => document.body && (watch.disconnect(), mount())).observe(root, {childList: true});
  document.readyState === 'complete' ? whenReady() : addEventListener('load', whenReady, {once: true});
  setTimeout(finish, 6000);
  addEventListener('pageshow', event => event.persisted && finish());                                // back/forward cache
})();
