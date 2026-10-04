/**
 * The companion + site mode, 2026-10-04. Loaded (deferred) on every page.
 *
 *  - A split pill on the screen edge: top half switches the site between Crow (dark, feathered) and
 *    White (light); bottom half swaps the companion between Opus and Crow. Choices persist.
 *  - The companion: an original pixel character drawn in code. Opus is the warehouse worker (hard hat,
 *    hi-vis stripe); Crow is a crow. It lives on the bottom of the screen and stays with you while you
 *    scroll: wanders, sweeps or pecks, watches the pointer, stumbles on fast scrolls, sleeps when you
 *    go quiet, can be dragged and dropped. It only talks when clicked: sarcastic, page-aware lines in
 *    English and Arabic, plus a few useful shortcuts.
 * Reduced motion: it stays put (no walking, no drifting feathers). No dependencies.
 */
(() => {
  if (window.top !== window || window.__mkCompanion) return;
  window.__mkCompanion = true;
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ar = (root.lang || '').startsWith('ar') || new URLSearchParams(location.search).get('lang') === 'ar';
  const T = (en, a) => (ar ? a : en);
  const store = (k, v) => {try {localStorage.setItem(k, v);} catch {}};
  const base = (() => {const m = location.pathname.match(/^(.*?)\/(?:en|ar|motion|mk-|reclaim|worlds)(?:\/|$)/); return m ? m[1] : '';})();

  // ── styles (modes, feathers, the pill, the companion, the bubble) ─────────────────────────────
  const FEATHER = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 120'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#2a1f4d'/><stop offset='.45' stop-color='#4b3a8c'/><stop offset='.7' stop-color='#1e6b66'/><stop offset='1' stop-color='#0a0a10'/></linearGradient></defs><path d='M22 6C34 22 38 52 30 80c-4 14-8 24-10 32-6-14-16-32-16-54C4 34 12 16 22 6z' fill='url(#g)'/><path d='M20 118C19 90 20 40 22 4' stroke='#d8d2f0' stroke-width='1.3' fill='none'/><g stroke='#0a0a12' stroke-opacity='.45' stroke-width='.8'><path d='M21 30l9-8M21 42l11-8M21 54l11-7M21 66l9-5M21 30l-9-6M21 44l-12-6M21 58l-13-5M21 72l-12-3'/></g></svg>`);
  const css = `
  html.mk-switching::view-transition-old(root){animation:none}
  html.mk-switching::view-transition-new(root){animation:mk-reveal .75s cubic-bezier(.2,.8,.2,1) both}
  @keyframes mk-reveal{from{clip-path:circle(0 at var(--mk-x,95%) var(--mk-y,50%))}to{clip-path:circle(150vmax at var(--mk-x,95%) var(--mk-y,50%))}}
  .mk-dock{position:fixed;z-index:2147482500;inset-inline-end:12px;top:50%;translate:0 -50%;display:grid;gap:6px;padding:6px;border-radius:999px;background:rgba(14,14,18,.58);border:1px solid rgba(255,255,255,.14);-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);box-shadow:0 10px 30px rgba(0,0,0,.35);transition:opacity .4s,transform .4s}
  .mk-dock button{position:relative;display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;padding:0;transition:background .25s,transform .25s}
  .mk-dock button:hover{background:rgba(255,255,255,.18);transform:scale(1.08)}
  .mk-dock button:focus-visible{outline:2px solid #c2dfcc;outline-offset:2px}
  .mk-dock svg{width:20px;height:20px}
  .mk-dock canvas{width:28px;height:28px;image-rendering:pixelated}
  .mk-dock button span{position:absolute;inset-inline-end:calc(100% + 10px);top:50%;translate:0 -50%;white-space:nowrap;padding:6px 10px;border-radius:8px;background:rgba(14,14,18,.86);color:#fff;font:600 13px/1 system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;transform:translateX(6px)}
  [dir=rtl] .mk-dock button span{transform:translateX(-6px)}
  .mk-dock button:hover span,.mk-dock button:focus-visible span{opacity:1;transform:none}
  .film-chrome-hidden .mk-dock{opacity:0;pointer-events:none}
  @media (max-width:760px){.mk-dock{top:auto;bottom:118px;translate:none;gap:4px;padding:4px}.mk-dock button{width:34px;height:34px}.mk-dock button span{display:none}}
  [data-site-mode=white] .nf-row-top .nf-row-title{color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.7)}
  .mk-pal{position:fixed;z-index:2147482400;left:0;top:0;width:54px;height:54px;padding:0;border:0;background:none;cursor:pointer;touch-action:none;-webkit-tap-highlight-color:transparent}
  .mk-pal canvas{width:100%;height:100%;image-rendering:pixelated;display:block;filter:drop-shadow(0 3px 4px rgba(0,0,0,.45))}
  .mk-pal:focus-visible{outline:2px solid #c2dfcc;outline-offset:2px;border-radius:8px}
  .mk-pal-shadow{position:fixed;z-index:2147482399;left:0;top:0;width:34px;height:8px;border-radius:50%;background:radial-gradient(rgba(0,0,0,.45),transparent 70%);pointer-events:none}
  .mk-bubble{position:fixed;z-index:2147482600;left:0;top:0;width:min(300px,78vw);padding:14px 16px 12px;border-radius:16px;background:#fffdf6;color:#17140f;box-shadow:0 18px 50px rgba(0,0,0,.4);font:500 15px/1.45 'Inter Variable',system-ui,sans-serif;transform-origin:var(--ox,50%) 100%;animation:mk-pop .3s cubic-bezier(.2,.9,.3,1.3)}
  .mk-bubble:after{content:"";position:absolute;bottom:-8px;left:var(--tail,50%);width:16px;height:16px;background:inherit;transform:translateX(-50%) rotate(45deg);border-radius:3px}
  .mk-bubble b{display:block;font-weight:800;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#a0552f;margin-bottom:4px}
  .mk-bubble p{margin:0 0 10px}
  .mk-bubble nav{display:flex;flex-wrap:wrap;gap:6px}
  .mk-bubble nav a,.mk-bubble nav button{font:600 13px/1 'Inter Variable',system-ui,sans-serif;padding:8px 11px;border-radius:999px;border:1px solid rgba(23,20,15,.16);background:rgba(23,20,15,.05);color:#17140f;cursor:pointer;text-decoration:none}
  .mk-bubble nav a:hover,.mk-bubble nav button:hover{background:rgba(23,20,15,.12)}
  [data-companion=crow] .mk-bubble b{color:#4b3a8c}
  @keyframes mk-pop{from{opacity:0;transform:scale(.7) translateY(8px)}to{opacity:1;transform:none}}
  .mk-zzz{position:fixed;z-index:2147482401;pointer-events:none;font:800 14px/1 system-ui,sans-serif;color:#fff;text-shadow:0 1px 4px #000;animation:mk-zzz 2.4s ease-in-out infinite}
  @keyframes mk-zzz{0%{opacity:0;transform:translate(0,0)}30%{opacity:1}100%{opacity:0;transform:translate(10px,-26px)}}
  .mk-drift{position:fixed;z-index:2147482300;top:-140px;width:30px;height:90px;background:url("${FEATHER}") center/contain no-repeat;pointer-events:none;opacity:.85;animation:mk-fall linear forwards}
  @keyframes mk-fall{to{transform:translate(var(--dx),calc(100vh + 200px)) rotate(var(--rot))}}
  /* Crow mode: feathers tucked into the frames of the work */
  [data-site-mode=crow] .nf-card-art:before,[data-site-mode=crow] .cx-poster figure:before,[data-site-mode=crow] .chapter-card figure:before{content:"";position:absolute;z-index:3;top:-14px;inset-inline-end:-4px;width:30px;height:90px;background:url("${FEATHER}") center/contain no-repeat;transform:rotate(28deg);filter:drop-shadow(0 4px 6px rgba(0,0,0,.6));pointer-events:none}
  [data-site-mode=crow] .chapter-card figure,[data-site-mode=crow] .cx-poster figure{position:relative;overflow:visible}
  [data-site-mode=crow] .nf-card-art{overflow:visible;outline:1px solid rgba(155,135,230,.22);outline-offset:3px}
  [data-site-mode=crow] .nf-card-art img{border-radius:6px}
  [data-site-mode=crow] .nf-row-title:before,[data-site-mode=crow] .cx-head h2:before,[data-site-mode=crow] .calm-intro h1:before{content:"";display:inline-block;width:.5em;height:1.4em;margin-inline-end:.3em;vertical-align:-.25em;background:url("${FEATHER}") center/contain no-repeat;transform:rotate(-18deg)}
  [data-site-mode=crow] .nf-sheet,[data-site-mode=crow] .nf-pop{box-shadow:0 0 0 1px rgba(155,135,230,.3),0 22px 60px rgba(0,0,0,.8)}
  /* White mode */
  [data-site-mode=white] .motion-body--cinema{--cx-bg:#f3f1ec;--cx-ink:#141414;--cx-muted:#5a5a62;background:#f3f1ec;color:#141414}
  [data-site-mode=white] .motion-body--cinema .nf-room{background:#f3f1ec}
  [data-site-mode=white] .nf-bill-shade{background:linear-gradient(77deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.45) 32%,transparent 62%),linear-gradient(0deg,#f3f1ec 0%,rgba(243,241,236,.7) 12%,transparent 30%),linear-gradient(180deg,rgba(0,0,0,.45),transparent 22%)}
  [dir=rtl][data-site-mode=white] .nf-bill-shade{background:linear-gradient(-77deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.45) 32%,transparent 62%),linear-gradient(0deg,#f3f1ec 0%,rgba(243,241,236,.7) 12%,transparent 30%),linear-gradient(180deg,rgba(0,0,0,.45),transparent 22%)}
  [data-site-mode=white] .nf-card-name{color:#fff}
  [data-site-mode=white] .nf-row-title,[data-site-mode=white] .cx-head h2,[data-site-mode=white] .cx-end h2{color:#141414}
  [data-site-mode=white] .nf-num{color:#f3f1ec;-webkit-text-stroke-color:rgba(20,20,20,.45)}
  [data-site-mode=white] .cx-section p,[data-site-mode=white] .cx-end p,[data-site-mode=white] .cx-eyebrow{color:#55555c}
  [data-site-mode=white] .nf-pop,[data-site-mode=white] .nf-sheet{background:#fff;color:#141414}
  [data-site-mode=white] .nf-pop-title,[data-site-mode=white] .nf-sheet-tagline{color:#141414}
  [data-site-mode=white] .nf-pop-meta,[data-site-mode=white] .nf-sheet-meta{color:#3a3a40}
  [data-site-mode=white] .nf-pop-tagline,[data-site-mode=white] .nf-sheet-desc{color:#55555c}
  [data-site-mode=white] .nf-sheet-media:after{background:linear-gradient(0deg,#fff 0%,transparent 45%)}
  [data-site-mode=white] .nf-sheet-chapters a{color:#2a2a2e;border-top-color:#e5e2dc}
  [data-site-mode=white] .nf-sheet-chapters a:hover{background:#f1eee8;color:#000}
  [data-site-mode=white] .nf-round{background:rgba(0,0,0,.05);border-color:rgba(0,0,0,.35);color:#141414}
  [data-site-mode=white] .nf-round-play{background:#141414;border-color:#141414;color:#fff}
  [data-site-mode=white] .m-nav{background:rgba(243,241,236,.82)!important;color:#141414}
  [data-site-mode=white] .m-footer{color:#3a3a40}
  [data-site-mode=white] .nf-player .calm-story,[data-site-mode=white] body:has(.calm-story:not([hidden])) {background:#f3f1ec}
  [data-site-mode=white] .calm-story{color:#141414}
  [data-site-mode=white] .calm-intro p,[data-site-mode=white] .chapter-card p{color:#4a4a52}
  [data-site-mode=white] .is-poster-mode .film-header{background:rgba(243,241,236,.9);color:#141414}
  [data-site-mode=white] .is-poster-mode .film-header nav a{color:#141414}
  [data-site-mode=white] .mk-dock{background:rgba(255,255,255,.75);border-color:rgba(0,0,0,.12)}
  [data-site-mode=white] .mk-dock button{background:rgba(0,0,0,.06);color:#141414}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  // ── pixel art (16×16, drawn in code) ────────────────────────────────────────────────────────
  const px = (g, x, y, c, w = 1, h = 1) => {g.fillStyle = c; g.fillRect(x, y, w, h);};
  function drawOpus(g, f) {
    // f: {leg 0..3, blink, arm: 'down'|'wave'|'broom', look -1..1, bob, sleep, whoa}
    g.clearRect(0, 0, 16, 16);
    const y = f.bob ? 1 : 0, K = '#2b1d14', O = '#e07a4f', D = '#b85a35', Y = '#ffcf3f', H = '#d99a19', V = '#c8ff3d';
    // hard hat
    px(g, 5, 1 + y, K, 6); px(g, 4, 2 + y, K); px(g, 11, 2 + y, K); px(g, 5, 2 + y, Y, 6); px(g, 3, 3 + y, K, 10); px(g, 4, 3 + y, H, 8); px(g, 6, 2 + y, '#fff3b0', 2);
    // head + body (a bean)
    px(g, 4, 4 + y, K); px(g, 11, 4 + y, K); px(g, 5, 4 + y, O, 6);
    for (let r = 5; r <= 11; r++) {px(g, 3, r + y, K); px(g, 12, r + y, K); px(g, 4, r + y, O, 8);}
    px(g, 4, 11 + y, D, 8); px(g, 4, 12 + y, K, 8);
    // hi-vis stripe
    px(g, 4, 9 + y, V, 8);
    // eyes
    const lx = 5 + Math.round(f.look), rx = 9 + Math.round(f.look);
    if (f.sleep) {px(g, lx, 6 + y, K, 2); px(g, rx, 6 + y, K, 2);}
    else if (f.blink) {px(g, lx, 7 + y, K, 2); px(g, rx, 7 + y, K, 2);}
    else if (f.whoa) {px(g, lx, 5 + y, '#fff', 2, 3); px(g, rx, 5 + y, '#fff', 2, 3); px(g, lx + 1, 6 + y, K); px(g, rx + 1, 6 + y, K);}
    else {px(g, lx, 6 + y, '#fff', 2, 2); px(g, rx, 6 + y, '#fff', 2, 2); px(g, lx + 1, 7 + y, K); px(g, rx + 1, 7 + y, K);}
    // mouth (a smirk; it is sarcastic)
    if (f.whoa) px(g, 7, 8 + y, K, 2, 1); else {px(g, 7, 8 + y, K, 2); px(g, 9, 7 + y, K);}
    // arms
    if (f.arm === 'wave') {px(g, 13, 5 + y, K); px(g, 13, 4 + y, O); px(g, 14, 3 + y, O); px(g, 2, 8 + y, O);}
    else if (f.arm === 'broom') {px(g, 13, 7 + y, O); px(g, 14, 4, '#8a5a2b', 1, 9); px(g, 13, 13, '#d9b36b', 3, 2); px(g, 2, 8 + y, O);}
    else {px(g, 2, 8 + y, O); px(g, 13, 8 + y, O);}
    // legs (walk cycle)
    const L = [[5, 9], [4, 10], [5, 9], [6, 8]][f.leg % 4];
    px(g, L[0], 13, K, 2, 2); px(g, L[1], 13, K, 2, 2); px(g, L[0], 15, '#3a2a20', 2); px(g, L[1], 15, '#3a2a20', 2);
  }
  function drawCrow(g, f) {
    // f: {leg, blink, flap 0..2, peck, look, bob, sleep, whoa}
    g.clearRect(0, 0, 16, 16);
    const y = f.bob ? 1 : 0, K = '#121218', S = '#3b2f6b', T = '#1e5c58', B = '#f2b632';
    const hy = f.peck ? 3 : 0;
    // tail
    px(g, 1, 8 + y, K, 3); px(g, 0, 9 + y, K, 3); px(g, 1, 10 + y, S, 2);
    // body
    for (let r = 6; r <= 11; r++) px(g, 3, r + y, K, 8);
    px(g, 4, 7 + y, S, 3); px(g, 5, 9 + y, T, 3);
    // wing
    if (f.flap === 1) {px(g, 4, 3 + y, K, 5, 3); px(g, 5, 4 + y, S, 3);} else if (f.flap === 2) {px(g, 4, 11 + y, K, 5, 2);} else {px(g, 4, 8 + y, '#1b1b26', 5, 2);}
    // head
    px(g, 9, 3 + y + hy, K, 5, 5); px(g, 10, 2 + y + hy, K, 3);
    // eye
    if (f.sleep || f.blink) px(g, 11, 5 + y + hy, '#555', 2, 1);
    else {px(g, 11, 4 + y + hy, '#ffffff', 2, 2); px(g, 12 + (f.look > .3 ? 0 : 0), 5 + y + hy, K);}
    if (f.whoa) px(g, 11, 4 + y + hy, '#ffd34d', 2, 2);
    // beak
    px(g, 14, 5 + y + hy, B, 2, 1); px(g, 14, 6 + y + hy, '#c98a1c', 1, 1);
    // legs
    const L = f.leg % 2 ? [6, 9] : [7, 8];
    px(g, L[0], 12 + y, B, 1, 3); px(g, L[1], 12 + y, B, 1, 3); px(g, L[0] - 1, 15, B, 2); px(g, L[1], 15, B, 2);
  }

  // ── lines ─────────────────────────────────────────────────────────────────────────────────
  const path = location.pathname;
  const page = /\/world(\/|$)/.test(path) ? 'world' : /\/motion\/[a-z-]+\/?$/.test(path) || root.classList.contains('nf-player') ? 'film' : /\/motion\/?$/.test(path) ? 'gallery' : /\/classic/.test(path) ? 'classic' : /\/(en|ar)\/?$/.test(path) ? 'home' : 'other';
  const L = {
    opus: {
      any: [
        T('I’m the warehouse guy. I move pixels. Unpaid.', 'أنا عامل المستودع. أنقل البكسلات. بلا أجر.'),
        T('Everything here is real software. Even me. Sort of.', 'كل شيء هنا برمجيات حقيقية. حتى أنا. تقريباً.'),
        T('Click me again. I have nothing else going on.', 'انقر مرة أخرى. ليس عندي ما أفعله غير هذا.'),
        T('You scrolled 400 pixels. I walked 400 pixels. We are not the same.', 'مرّرت ٤٠٠ بكسل، ومشيتُ ٤٠٠ بكسل. لسنا متساويين.'),
        T('Mohamed built fifteen apps. I built… this hat.', 'بنى محمد خمسة عشر تطبيقاً. وأنا بنيت… هذه الخوذة.'),
      ],
      gallery: [T('It’s Netflix, except every show here actually shipped.', 'إنه نتفليكس، لكن كل عرض هنا شُحن فعلاً.'), T('Hover a card. I dare you.', 'مرّر فوق بطاقة. أتحداك.'), T('Top pick is MK Suite. He made me say that. He was right.', 'الاختيار الأول MK Suite. أجبرني على قولها. وكان محقاً.')],
      film: [T('Press Space. I’ll take the credit.', 'اضغط المسافة. وسأنسب الفضل لنفسي.'), T('Those ticks on the bar are chapters, detective.', 'تلك العلامات على الشريط فصول، يا محقق.'), T('Yes, that’s the real app. No mock-ups were harmed.', 'نعم، هذا التطبيق الحقيقي. لم يُصب أي نموذج وهمي بأذى.')],
      world: [T('Five minutes of 3D and I’m sixteen pixels tall. Life is unfair.', 'خمس دقائق من الثلاثي الأبعاد وطولي ستة عشر بكسل. الحياة ظالمة.'), T('Drag the glass mark. It’s not insured.', 'اسحب الشعار الزجاجي. إنه غير مؤمَّن.')],
      home: [T('Scroll. The film doesn’t watch itself.', 'مرّر. الفيلم لا يشاهد نفسه.'), T('That glass MK? I polish it every night.', 'ذلك الشعار الزجاجي؟ ألمّعه كل ليلة.')],
      classic: [T('The classic site. Like vinyl, for people who read.', 'الموقع الكلاسيكي. مثل الأسطوانات، لمن يحب القراءة.')],
    },
    crow: {
      any: [
        T('Caw. That’s crow for “hire him”.', 'قاق. هذه بلغة الغربان: “وظّفوه”.'),
        T('I collect shiny things. This portfolio qualifies.', 'أجمع الأشياء اللامعة. وهذا المعرض مؤهَّل.'),
        T('Nevermore… boring portfolios.', 'لا مزيد… من المعارض المملة.'),
        T('I was told to be helpful. I chose dramatic.', 'طُلب مني أن أكون مفيداً. فاخترت الدراما.'),
      ],
      gallery: [T('Fifteen films. I watched them all. Twice. Caw.', 'خمسة عشر فيلماً. شاهدتها كلها. مرتين. قاق.'), T('Hover a card. Shiny things inside.', 'مرّر فوق بطاقة. في الداخل أشياء لامعة.')],
      film: [T('Space bar plays it. I peck it for you, if you like.', 'زر المسافة يشغّله. أنقره لك إن شئت.'), T('Full screen button, bottom right. Big screen, bigger crow.', 'زر ملء الشاشة في الأسفل. شاشة أكبر، غراب أكبر.')],
      world: [T('I flew the whole walkthrough. You can scroll it.', 'طرتُ الجولة كلها. ويمكنك أن تمرّرها.')],
      home: [T('Scroll down. There’s a film. And another world.', 'مرّر للأسفل. هناك فيلم. وعالم آخر.')],
      classic: [T('Old-school page. I approve. Crows are old-school.', 'صفحة قديمة الطراز. أوافق. الغربان قديمة الطراز.')],
    },
  };
  const night = () => {const h = (new Date().getUTCHours() + 3) % 24; return h < 5 ? T(`It’s ${h || 12} AM in Kuwait. Who reads portfolios now? Respect.`, `الساعة ${h || 12} بعد منتصف الليل في الكويت. من يقرأ المعارض الآن؟ احترام.`) : null;};

  // ── the pill ──────────────────────────────────────────────────────────────────────────────
  const dock = document.createElement('div');
  dock.className = 'mk-dock'; dock.setAttribute('role', 'group'); dock.setAttribute('aria-label', T('Site style', 'نمط الموقع'));
  const modeBtn = document.createElement('button'), palBtn = document.createElement('button');
  modeBtn.type = palBtn.type = 'button';
  const palIcon = document.createElement('canvas'); palIcon.width = palIcon.height = 16;
  palBtn.append(palIcon);
  const modeLabel = document.createElement('span'), palLabel = document.createElement('span');
  dock.append(modeBtn, palBtn);
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
  const feather = `<img src="${FEATHER}" alt="" width="14" height="40" style="transform:rotate(28deg)">`;
  function paintDock() {
    const white = root.dataset.siteMode === 'white';
    modeBtn.innerHTML = white ? feather : sun;
    modeLabel.textContent = white ? T('Crow mode', 'وضع الغراب') : T('White mode', 'الوضع الأبيض');
    modeBtn.append(modeLabel);
    modeBtn.setAttribute('aria-label', modeLabel.textContent);
    const pal = root.dataset.companion;
    const g = palIcon.getContext('2d');
    (pal === 'crow' ? drawOpus : drawCrow)(g, {leg: 0, blink: false, arm: 'down', look: 0, bob: 0, flap: 0});
    palLabel.textContent = pal === 'off' ? T('Call Opus', 'استدعِ أوبس') : pal === 'crow' ? T('Swap to Opus', 'بدّل إلى أوبس') : T('Swap to Crow', 'بدّل إلى الغراب');
    palBtn.append(palLabel);
    palBtn.setAttribute('aria-label', palLabel.textContent);
  }
  function setMode(mode, from) {
    const apply = () => {
      root.dataset.siteMode = mode; store('mk-mode', mode);
      // the classic site's own theme follows
      if (document.querySelector('[data-theme-menu]') || localStorage.getItem('mm-theme')) {
        store('mm-theme', mode === 'white' ? 'light' : 'dark');
        if (mode === 'white') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
      }
      paintDock();
      dispatchEvent(new CustomEvent('mk:mode', {detail: mode}));
    };
    const b = from?.getBoundingClientRect();
    if (b) {root.style.setProperty('--mk-x', `${b.left + b.width / 2}px`); root.style.setProperty('--mk-y', `${b.top + b.height / 2}px`);}
    if (document.startViewTransition && !still) {
      root.classList.add('mk-switching');
      const vt = document.startViewTransition(apply);
      vt.finished.finally(() => root.classList.remove('mk-switching'));
    } else apply();
    if (mode === 'crow' && !still) for (let i = 0; i < 7; i++) setTimeout(dropFeather, i * 140);
  }
  modeBtn.addEventListener('click', () => setMode(root.dataset.siteMode === 'white' ? 'crow' : 'white', modeBtn));
  palBtn.addEventListener('click', () => setCompanion(root.dataset.companion === 'opus' ? 'crow' : 'opus'));
  document.body.append(dock);
  paintDock();

  function dropFeather() {
    const f = document.createElement('i');
    f.className = 'mk-drift';
    f.style.left = `${Math.random() * 100}vw`;
    f.style.setProperty('--dx', `${(Math.random() - .5) * 240}px`);
    f.style.setProperty('--rot', `${(Math.random() - .5) * 720}deg`);
    f.style.animationDuration = `${5 + Math.random() * 4}s`;
    document.body.append(f);
    f.addEventListener('animationend', () => f.remove());
  }
  if (!still) setInterval(() => {if (root.dataset.siteMode === 'crow' && !document.hidden && Math.random() < .35) dropFeather();}, 9000);

  // ── the companion ─────────────────────────────────────────────────────────────────────────
  const SCALE = 54 / 16;
  const pal = document.createElement('button');
  pal.type = 'button'; pal.className = 'mk-pal';
  const cv = document.createElement('canvas'); cv.width = cv.height = 16;
  pal.append(cv);
  const shadow = document.createElement('i'); shadow.className = 'mk-pal-shadow';
  const g = cv.getContext('2d');
  let kind = root.dataset.companion, x = innerWidth * .78, y = 0, vy = 0, dir = -1, targetX = x, state = 'idle', stateUntil = 0, frame = 0, frameAt = 0;
  let lastScroll = scrollY, scrollV = 0, lastActive = performance.now(), dragging = false, grab = {x: 0, y: 0}, clicks = 0, bubble = null, lineIndex = 0, downAt = 0, moved = false;
  const floorY = () => {
    let top = innerHeight - 8;
    // stand on the player's progress bar (not its gradient), the World HUD, or the home film's dock
    for (const [s, owner] of [['.nf-timeline', '.film-controls'], ['.portfolio-film-dock', '.film-controls'], ['.world-hud', null]]) {
      const el = document.querySelector(s);
      if (!el) continue;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(owner ? el.closest(owner) || el : el);
      if (r.height && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > .3 && r.top > innerHeight * .5) top = Math.min(top, r.top - 4);
    }
    return top;
  };
  function setCompanion(next) {
    kind = next; root.dataset.companion = next; store('mk-companion', next);
    closeBubble();
    pal.hidden = shadow.hidden = next === 'off';
    // a little puff
    if (next !== 'off' && !still) {state = 'whoa'; stateUntil = performance.now() + 600; vy = -6;}
    paintDock();
  }
  pal.setAttribute('aria-label', T('Your companion. Click to chat.', 'رفيقك. انقر للحديث.'));
  document.body.append(shadow, pal);
  pal.hidden = shadow.hidden = kind === 'off';
  y = floorY();

  function say() {
    closeBubble();
    clicks++;
    const set = L[kind === 'crow' ? 'crow' : 'opus'];
    const pool = [...(set[page] || []), ...set.any];
    const special = clicks === 6 ? T('Okay, you clearly like me. Go watch a film.', 'حسناً، واضح أنك تحبني. اذهب وشاهد فيلماً.') : clicks === 1 ? night() : null;
    const text = special || pool[lineIndex++ % pool.length];
    bubble = document.createElement('div');
    bubble.className = 'mk-bubble'; bubble.setAttribute('role', 'status');
    const motion = `${base}/${ar ? 'ar' : 'en'}/motion`;
    bubble.innerHTML = `<b>${kind === 'crow' ? T('Crow', 'الغراب') : 'Opus'}</b><p></p><nav>
      <button type="button" data-more>${T('Another one', 'واحدة أخرى')}</button>
      ${page !== 'gallery' ? `<a href="${motion}">${T('Show me the films', 'أرني الأفلام')}</a>` : ''}
      <a href="mailto:medo433447@gmail.com">${T('Contact Mohamed', 'تواصل مع محمد')}</a>
      <button type="button" data-swap>${kind === 'crow' ? T('Send Opus', 'أرسل أوبس') : T('Send the crow', 'أرسل الغراب')}</button>
      <button type="button" data-bye>${T('Go away', 'ابتعد')}</button></nav>`;
    bubble.querySelector('p').textContent = text;
    document.body.append(bubble);
    placeBubble();
    bubble.querySelector('[data-more]').addEventListener('click', e => {e.stopPropagation(); say();});
    bubble.querySelector('[data-swap]').addEventListener('click', e => {e.stopPropagation(); setCompanion(kind === 'crow' ? 'opus' : 'crow');});
    bubble.querySelector('[data-bye]').addEventListener('click', e => {e.stopPropagation(); setCompanion('off');});
    state = 'talk'; stateUntil = performance.now() + 4000;
  }
  function placeBubble() {
    if (!bubble) return;
    const w = bubble.offsetWidth, h = bubble.offsetHeight;
    const cx = x + 27, left = Math.max(10, Math.min(innerWidth - w - 10, cx - w / 2));
    bubble.style.left = `${left}px`; bubble.style.top = `${Math.max(10, y - 54 - h - 14)}px`;
    bubble.style.setProperty('--tail', `${Math.max(16, Math.min(w - 16, cx - left))}px`);
  }
  function closeBubble() {bubble?.remove(); bubble = null;}
  addEventListener('pointerdown', e => {if (bubble && !bubble.contains(e.target) && !pal.contains(e.target)) closeBubble();}, {passive: true});

  // drag & click
  pal.addEventListener('pointerdown', e => {dragging = true; moved = false; downAt = performance.now(); grab = {x: e.clientX - x, y: e.clientY - (y - 54)}; pal.setPointerCapture(e.pointerId);});
  pal.addEventListener('pointermove', e => {
    if (!dragging) return;
    const nx = e.clientX - grab.x, ny = e.clientY - grab.y + 54;
    if (Math.abs(nx - x) + Math.abs(ny - y) > 3) moved = true;
    x = Math.max(0, Math.min(innerWidth - 54, nx)); y = Math.min(floorY(), ny); vy = 0; state = 'held'; placeBubble();
  });
  pal.addEventListener('pointerup', () => {
    dragging = false;
    if (!moved && performance.now() - downAt < 400) say();
    else {state = 'fall'; stateUntil = 0; if (!bubble) {/* dropped: a little complaint next click */}}
  });
  pal.addEventListener('keydown', e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); say();}});
  for (const t of ['pointermove', 'scroll', 'keydown']) addEventListener(t, () => {lastActive = performance.now();}, {passive: true});
  let ptr = {x: -1, y: -1};
  addEventListener('pointermove', e => {ptr = {x: e.clientX, y: e.clientY};}, {passive: true});

  function pick(now) {
    // the living algorithm: a small weighted state machine
    const r = Math.random();
    if (now - lastActive > 40000) {state = 'sleep'; stateUntil = now + 1e9; return;}
    if (still) {state = 'idle'; stateUntil = now + 3000; return;}
    if (r < .45) {state = 'walk'; targetX = 30 + Math.random() * (innerWidth - 140); stateUntil = now + 9000;}
    else if (r < .65) {state = kind === 'crow' ? 'peck' : 'sweep'; stateUntil = now + 2600 + Math.random() * 2000;}
    else if (r < .8) {state = 'look'; stateUntil = now + 2000;}
    else if (r < .9 && kind === 'crow') {state = 'fly'; targetX = 30 + Math.random() * (innerWidth - 140); vy = -7; stateUntil = now + 4000;}
    else {state = 'idle'; stateUntil = now + 1800 + Math.random() * 2400;}
  }
  let zzz = null;
  function loop(now) {
    requestAnimationFrame(loop);
    if (kind === 'off' || document.hidden) return;
    const floor = floorY();
    // scrolling: fast scrolls make it stumble (or take off)
    scrollV = scrollV * .85 + (scrollY - lastScroll) * .15; lastScroll = scrollY;
    if (Math.abs(scrollV) > 26 && state !== 'held' && state !== 'whoa' && !still) {state = 'whoa'; stateUntil = now + 700; vy = kind === 'crow' ? -9 : -5;}
    if (state === 'sleep' && now - lastActive < 1000) {state = 'idle'; stateUntil = now + 800;}
    if (now > stateUntil && state !== 'held') pick(now);
    // movement
    if (!dragging) {
      if (state === 'walk' || state === 'fly') {
        const step = (state === 'fly' ? 2.6 : kind === 'crow' ? 1.1 : 0.9);
        if (Math.abs(targetX - x) < 3) {state = 'idle'; stateUntil = now + 1200;}
        else {dir = targetX > x ? 1 : -1; x += dir * step;}
      }
      vy += .5; y += vy;
      if (state === 'fly' && y > floor - 60 && Math.abs(targetX - x) > 20) vy = Math.min(vy, -1.5 + Math.sin(now * .02) * .5);
      if (y >= floor) {y = floor; if (vy > 6) {state = 'whoa'; stateUntil = now + 500;} vy = 0;}
      x = Math.max(0, Math.min(innerWidth - 54, x));
    }
    // sprite frame (10 fps)
    if (now - frameAt > 100) {
      frameAt = now; frame++;
      const lookX = ptr.x < 0 ? 0 : Math.max(-1, Math.min(1, (ptr.x - (x + 27)) / 200));
      const f = {leg: state === 'walk' ? frame : 0, blink: frame % 37 === 0, arm: state === 'sweep' ? 'broom' : state === 'talk' ? 'wave' : 'down', look: state === 'look' || state === 'talk' ? lookX : dir * .6,
        bob: (state === 'walk' || state === 'sweep') && frame % 2, sleep: state === 'sleep', whoa: state === 'whoa' || state === 'held', flap: state === 'fly' || state === 'whoa' ? 1 + (frame % 2) : 0, peck: state === 'peck' && frame % 6 < 2};
      (kind === 'crow' ? drawCrow : drawOpus)(g, f);
    }
    pal.style.transform = `translate(${x}px, ${y - 54}px) scaleX(${kind === 'crow' ? dir : -dir})`;
    shadow.style.transform = `translate(${x + 10}px, ${floor - 4}px) scale(${Math.max(.3, 1 - (floor - y) / 160)})`;
    if (state === 'sleep') {
      if (!zzz) {zzz = document.createElement('i'); zzz.className = 'mk-zzz'; zzz.textContent = 'z z'; document.body.append(zzz);}
      zzz.style.left = `${x + 36}px`; zzz.style.top = `${y - 70}px`;
    } else if (zzz) {zzz.remove(); zzz = null;}
    if (bubble) placeBubble();
  }
  requestAnimationFrame(loop);
  addEventListener('resize', () => {x = Math.min(x, innerWidth - 54);}, {passive: true});
})();
