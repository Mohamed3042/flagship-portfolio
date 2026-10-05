/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/**
 * The companion + site mode, 2026-10-04 (v3). Loaded (deferred) on every page.
 *
 *  - A split pill on the screen edge: the top half switches the site between Crow (dark) and White
 *    (light); the bottom half swaps the companion between Opus and Crow. Choices persist.
 *  - Opus is a small orange pixel creature (block body, square eyes, stubby arms, four legs; after the
 *    Claude Code mascot). The Crow is its mirror twin: the same block in black with white eyes, a beak
 *    and a crest. Both live in one low-resolution pixel layer over the page, plus a full-resolution
 *    effects layer for glass, markers and lasers.
 *  - It follows you. It stares at your pointer (or where you last touched), jumps onto the frames of
 *    the work and the big titles and sits there while you read, follows you into the previews and the
 *    details sheet, and every time you stop scrolling it catches up a different way: spaceship, horse
 *    carriage (حنطور), tuk-tuk (توكتوك), bread bicycle (عجلة), motorbike (مكنة), magic carpet, camel,
 *    parachute, jetpack, skateboard, pogo stick, forklift, paper plane, balloons, teleporter, propeller
 *    cap, rocket, crow taxi; the crow flaps, glides, sleds on a jar lid, bursts into feathers.
 *  - It bullies you, gently. On a frame it smashes the glass, falls, cries, rebuilds it and fixes it
 *    with a magic potion; it also plays peekaboo, cleans windows on a rope, sprays graffiti, fishes,
 *    rides the frame like a seesaw. On titles: a highlighter, a laser pointer, a stretch. Sit on the
 *    same text for ten seconds and it steals words you have read (sack, vacuum, squeegee, eraser,
 *    magnet, letter by letter, a fishing rod; the crow pecks them); they come back when you scroll or
 *    tap. Buttons sometimes dodge your first press (fourteen ways) and then give in; keyboard presses
 *    are never blocked.
 *  - Left alone it lives its day (coding, napping, flexing with a real file from this site, a project-
 *    manager suit, glasses, coffee, popcorn, a rubber duck…); the crow does real crow things that make
 *    no sense (sunbathing like it died, funerals, gifts, cracking nuts with traffic, counting to five).
 *  - Click it to talk (sarcastic, page-aware lines in English and Arabic) or to play X O on a sheet of
 *    paper it pulls out of somewhere different every time. It cheats. Drag it anywhere.
 * Reduced motion: no travel, no pranks, no particles; a still companion that still talks and plays.
 * QA: window.__mk.{act, ride, perch, steal, prank, xo, state}.
 */
(() => {
  if (window.top !== window || window.__mkCompanion) return;
  window.__mkCompanion = true;
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ar = (root.lang || '').startsWith('ar') || new URLSearchParams(location.search).get('lang') === 'ar';
  const T = (en, a) => (ar ? a : en);
  const store = (k, v) => {try {localStorage.setItem(k, v);} catch {}};
  const recall = k => {try {return localStorage.getItem(k);} catch {return null;}};
  const base = (() => {const m = location.pathname.match(/^(.*?)\/(?:en|ar|motion|mk-|reclaim|worlds)(?:\/|$)/); return m ? m[1] : '';})();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const any = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = t => (t = clamp(t, 0, 1), t * t * (3 - 2 * t));
  const shuffle = a => {for (let i = a.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]];} return a;};
  const safe = fn => {try {return fn();} catch {return false;}};
  // a shuffle bag: everything comes up once before anything repeats
  const bag = items => {let pool = []; return ok => {if (!pool.some(ok)) pool = shuffle([...items]); const i = pool.findIndex(ok); return i < 0 ? null : pool.splice(i, 1)[0];};};
  const visible = el => !el.checkVisibility || el.checkVisibility({opacityProperty: true, visibilityProperty: true});

  // ── styles ────────────────────────────────────────────────────────────────────────────────────
  const css = `
  html.mk-switching::view-transition-old(root){animation:none}
  html.mk-switching::view-transition-new(root){animation:mk-reveal .75s cubic-bezier(.2,.8,.2,1) both}
  @keyframes mk-reveal{from{clip-path:circle(0 at var(--mk-x,95%) var(--mk-y,50%))}to{clip-path:circle(150vmax at var(--mk-x,95%) var(--mk-y,50%))}}
  .mk-dock{position:fixed;z-index:2147482500;inset-inline-end:12px;top:50%;translate:0 -50%;display:grid;gap:6px;padding:6px;border-radius:999px;background:rgba(14,14,18,.58);border:1px solid rgba(255,255,255,.14);-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);box-shadow:0 10px 30px rgba(0,0,0,.35);transition:opacity .4s,transform .4s}
  .mk-dock button{position:relative;display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;padding:0;transition:background .25s,transform .25s}
  .mk-dock button:hover{background:rgba(255,255,255,.18);transform:scale(1.08)}
  .mk-dock button:focus-visible{outline:2px solid #c2dfcc;outline-offset:2px}
  .mk-dock svg{width:20px;height:20px}
  .mk-dock canvas{width:27px;height:18px;image-rendering:pixelated}
  .mk-dock button span{position:absolute;inset-inline-end:calc(100% + 10px);top:50%;translate:0 -50%;white-space:nowrap;padding:6px 10px;border-radius:8px;background:rgba(14,14,18,.86);color:#fff;font:600 13px/1 system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;transform:translateX(6px)}
  [dir=rtl] .mk-dock button span{transform:translateX(-6px)}
  .mk-dock button:hover span,.mk-dock button:focus-visible span{opacity:1;transform:none}
  .film-chrome-hidden .mk-dock{opacity:0;pointer-events:none}
  @media (max-width:760px){.mk-dock{top:auto;bottom:118px;translate:none;gap:4px;padding:4px}.mk-dock button{width:34px;height:34px}.mk-dock button span{display:none}}
  .mk-world{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:2147482400}
  .mk-world canvas{position:absolute;left:0;top:0;image-rendering:crisp-edges;image-rendering:pixelated}
  .mk-fx{position:fixed;left:0;top:0;pointer-events:none;z-index:2147482390}
  .mk-hit{position:fixed;z-index:2147482450;left:0;top:0;padding:0;border:0;border-radius:10px;background:none;cursor:grab;touch-action:none;-webkit-tap-highlight-color:transparent}
  .mk-hit:active{cursor:grabbing}
  .mk-hit:focus-visible{outline:2px solid #c2dfcc;outline-offset:2px}
  .mk-bubble{position:fixed;z-index:2147482600;left:0;top:0;width:min(300px,78vw);padding:14px 16px 12px;border-radius:16px;background:#fffdf6;color:#17140f;box-shadow:0 18px 50px rgba(0,0,0,.4);font:500 15px/1.45 'Inter Variable',Inter,system-ui,sans-serif;transform-origin:var(--ox,50%) 100%;animation:mk-pop .3s cubic-bezier(.2,.9,.3,1.3)}
  .mk-bubble:after{content:"";position:absolute;bottom:-8px;left:var(--tail,50%);width:16px;height:16px;background:inherit;transform:translateX(-50%) rotate(45deg);border-radius:3px}
  .mk-bubble b{display:block;font-weight:800;font-size:13px;color:#a0552f;margin-bottom:4px}
  .mk-bubble p{margin:0 0 10px}
  .mk-bubble nav{display:flex;flex-wrap:wrap;gap:6px}
  .mk-bubble nav a,.mk-bubble nav button{font:600 13px/1 'Inter Variable',Inter,system-ui,sans-serif;padding:8px 11px;border-radius:999px;border:1px solid rgba(23,20,15,.16);background:rgba(23,20,15,.05);color:#17140f;cursor:pointer;text-decoration:none}
  .mk-bubble nav a:hover,.mk-bubble nav button:hover{background:rgba(23,20,15,.12)}
  .mk-bubble nav [data-xo]{background:#17140f;border-color:#17140f;color:#fffdf6}
  [data-companion=crow] .mk-bubble b{color:#4b3a8c}
  @keyframes mk-pop{from{opacity:0;transform:scale(.7) translateY(8px)}to{opacity:1;transform:none}}
  .mk-pop{position:fixed;z-index:2147482550;left:0;top:0;max-width:min(260px,72vw);padding:10px 12px;border-radius:12px;background:#15151b;color:#f4f2ee;border:1px solid rgba(255,255,255,.12);box-shadow:0 14px 40px rgba(0,0,0,.45);font:500 13px/1.5 'Inter Variable',Inter,system-ui,sans-serif;pointer-events:none;opacity:0;transform:translateY(8px) scale(.94) rotate(var(--r,0deg));transition:opacity .3s,transform .35s cubic-bezier(.2,.9,.3,1.3)}
  .mk-pop.is-in{opacity:1;transform:rotate(var(--r,0deg))}
  .mk-pop b{display:flex;align-items:center;gap:7px;font-weight:700;font-size:13px;margin-bottom:5px}
  .mk-pop b:before{content:"";width:9px;height:11px;border-radius:2px;background:#d97757}
  .mk-pop code{display:block;font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}
  .mk-pop .k{color:#f0a283}.mk-pop .s{color:#a6d97f}.mk-pop .f{color:#8fb4ff}.mk-pop .c{color:#9097a3}.mk-pop .n{color:#f0c27a}
  .mk-note{background:#ffe680;color:#2a2410;border:0;font-weight:650;font-size:14px;padding:12px 14px;box-shadow:0 10px 24px rgba(0,0,0,.3)}
  .mk-sfx{position:fixed;z-index:2147482500;left:0;top:0;pointer-events:none;font:800 16px/1 'Inter Variable',Inter,system-ui,sans-serif;color:#fff;text-shadow:0 1px 0 #000,0 0 10px rgba(0,0,0,.65);white-space:nowrap;animation:mk-sfx 1.7s ease-out forwards}
  @keyframes mk-sfx{0%{opacity:0;transform:translate(-50%,6px) scale(.8)}15%{opacity:1;transform:translate(-50%,0) scale(1.06)}100%{opacity:0;transform:translate(-50%,-38px) scale(1)}}
  .mk-sfx.rainbow{background:linear-gradient(90deg,#ff6b6b,#ffd166,#06d6a0,#4cc9f0,#b388ff,#ff6b6b);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;font-size:18px;animation:mk-sfx 2.4s ease-out forwards,mk-rainbow 1s linear infinite}
  @keyframes mk-rainbow{to{background-position:200% 0}}
  .mk-word{position:fixed;z-index:2147482560;pointer-events:none;white-space:pre;margin:0;padding:0;transform-origin:50% 50%}
  .mk-stolen{visibility:hidden}
  .mk-back{display:inline-block;animation:mk-back .7s cubic-bezier(.2,.9,.3,1.3) both}
  @keyframes mk-back{from{opacity:0;filter:blur(3px);transform:translateY(-10px) scale(1.4)}to{opacity:1;filter:none;transform:none}}
  .mk-tip{position:fixed;z-index:2147482580;left:0;top:0;padding:7px 11px;border-radius:10px;background:#15151b;color:#fff;font:650 13px/1.2 'Inter Variable',Inter,system-ui,sans-serif;white-space:nowrap;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.35);animation:mk-tip .25s cubic-bezier(.2,.9,.3,1.3)}
  @keyframes mk-tip{from{opacity:0;transform:translateY(6px) scale(.9)}}
  .mk-ring{position:fixed;z-index:2147482535;left:0;top:0;width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,#0b0722 0 48%,transparent 50%),conic-gradient(#7b5cff,#21d4fd,#b721ff,#ff5cc8,#7b5cff);-webkit-mask:radial-gradient(circle,#000 60%,transparent 63%);mask:radial-gradient(circle,#000 60%,transparent 63%);filter:drop-shadow(0 0 18px #9a7bff);animation:mk-spin .7s linear infinite}
  @keyframes mk-spin{to{rotate:360deg}}
  .mk-xo{position:fixed;z-index:2147482540;left:0;top:0;padding:10px 10px 34px;border-radius:6px;background:#fbf8f0;color:#1d1b16;box-shadow:0 18px 40px rgba(0,0,0,.35);rotate:-2deg;font:600 13px/1.3 'Inter Variable',Inter,system-ui,sans-serif}
  .mk-xo:before{content:"";position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(transparent 0 17px,rgba(80,120,200,.13) 17px 18px);pointer-events:none}
  .mk-xo.is-drawn{background:none;box-shadow:none;rotate:0deg;color:#fff}
  .mk-xo.is-drawn:before{display:none}
  .mk-xo.is-drawn svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.75))}
  [data-site-mode=white] .mk-xo.is-drawn{color:#141414}
  [data-site-mode=white] .mk-xo.is-drawn svg{filter:drop-shadow(0 1px 2px rgba(255,255,255,.9))}
  .mk-xo svg{position:relative;display:block;width:100%;height:auto;overflow:visible}
  .mk-xo path{fill:none;stroke-linecap:round;stroke-linejoin:round}
  .mk-xo .grid path{stroke:#2a2a33;stroke-width:2.2}
  .mk-xo.is-drawn .grid path{stroke:currentColor;stroke-dasharray:1;stroke-dashoffset:1;animation:mk-draw .45s ease-out forwards}
  .mk-xo .x{stroke:#2b5cd9;stroke-width:3.6}
  .mk-xo .o{stroke:#d97757;stroke-width:3.6}
  [data-companion=crow] .mk-xo .o{stroke:#7a5ce0}
  .mk-xo .mark{stroke-dasharray:1;stroke-dashoffset:1;animation:mk-draw .32s ease-out forwards}
  .mk-xo .gone{animation:mk-erase .5s ease-in forwards}
  .mk-xo .win{stroke:#e23b3b;stroke-width:3.2;stroke-dasharray:1;stroke-dashoffset:1;animation:mk-draw .45s ease-out forwards}
  @keyframes mk-draw{to{stroke-dashoffset:0}}
  @keyframes mk-erase{to{opacity:0;filter:blur(3px)}}
  .mk-xo .cells{position:absolute;left:10px;right:10px;top:10px;aspect-ratio:1;display:grid;grid-template-columns:repeat(3,1fr)}
  .mk-xo .cells button{border:0;background:none;padding:0;margin:0;cursor:pointer;border-radius:8px}
  .mk-xo .cells button:hover{background:rgba(43,92,217,.09)}
  .mk-xo .cells button:focus-visible{outline:2px solid #2b5cd9;outline-offset:-4px}
  .mk-xo .note{position:absolute;left:12px;right:36px;bottom:9px;margin:0;font-size:13px;color:#3a3830;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mk-xo .close{position:absolute;right:7px;bottom:6px;width:24px;height:24px;border:0;border-radius:50%;background:rgba(0,0,0,.07);color:#3a3830;font:700 15px/1 system-ui,sans-serif;cursor:pointer}
  .mk-xo.is-drawn .note,.mk-xo.is-drawn .close{color:inherit;text-shadow:0 1px 3px rgba(0,0,0,.7);background:none}
  [data-site-mode=white] .mk-xo.is-drawn .note,[data-site-mode=white] .mk-xo.is-drawn .close{text-shadow:0 1px 3px rgba(255,255,255,.9)}
  .mk-bait .nf-card-art,.mk-bait figure{box-shadow:0 0 0 2px var(--a,#7b5cff),0 0 26px color-mix(in srgb,var(--a,#7b5cff) 70%,transparent);animation:mk-bait 1.8s ease-in-out infinite}
  @keyframes mk-bait{50%{box-shadow:0 0 0 3px #fff,0 0 42px var(--a,#7b5cff)}}
  .mk-bait-tag{position:absolute;z-index:4;top:8px;inset-inline-end:8px;padding:6px 11px;border-radius:999px;background:linear-gradient(90deg,#ff5cc8,#7b5cff,#21d4fd,#ff5cc8);background-size:200% 100%;color:#fff;font:800 12px/1 'Inter Variable',Inter,system-ui,sans-serif;box-shadow:0 4px 14px rgba(123,92,255,.5);pointer-events:none;animation:mk-rainbow 2s linear infinite,mk-bob 1.2s ease-in-out infinite}
  @keyframes mk-bob{50%{translate:0 -3px}}
  .mk-bait-btn{position:fixed;z-index:2147482570;left:0;top:0;display:flex;align-items:center;gap:10px;padding:15px 24px 15px 15px;border:0;border-radius:999px;background:linear-gradient(135deg,#ff5cc8,#7b5cff 50%,#21d4fd);color:#fff;font:800 16px/1 'Inter Variable',Inter,system-ui,sans-serif;white-space:nowrap;cursor:pointer;box-shadow:0 0 0 4px rgba(255,255,255,.25),0 12px 40px rgba(123,92,255,.6),0 0 60px rgba(33,212,253,.5);animation:mk-beg 1.1s ease-in-out infinite}
  @keyframes mk-beg{50%{box-shadow:0 0 0 9px rgba(255,255,255,.16),0 12px 50px rgba(123,92,255,.85),0 0 90px rgba(33,212,253,.7)}}
  .mk-bait-btn b{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#fff;color:#7b5cff;font-size:12px}
  .mk-bait-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
  .mk-bait-btn.is-water{background:linear-gradient(180deg,#bfe8ff,#3d8bff 60%,#1d4fb8)}
  .mk-bait-btn.is-asleep{filter:grayscale(.85) brightness(.7);animation:none}
  .mk-bait-btn.is-decoy{pointer-events:none}
  .mk-ripple{position:fixed;z-index:2147482569;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;border:2px solid rgba(143,211,255,.95);border-radius:50%;pointer-events:none;animation:mk-ripple 1s ease-out both}
  @keyframes mk-ripple{from{transform:scale(.2);opacity:1}to{transform:scale(4.5);opacity:0}}
  .mk-confetti{position:fixed;z-index:2147482575;left:0;top:0;width:8px;height:12px;border-radius:2px;pointer-events:none}
  .mk-deco{position:fixed;z-index:2147482380;left:0;top:0;pointer-events:none;animation:mk-deco-in .6s cubic-bezier(.2,.9,.3,1.2) both}
  .mk-deco.is-out{animation:mk-deco-out .45s ease-in both}
  @keyframes mk-deco-in{from{opacity:0;transform:scale(.92)}}
  @keyframes mk-deco-out{to{opacity:0;transform:scale(1.04)}}
  .mk-deco>*{position:absolute}
  .mk-deco svg{overflow:visible}
  .mk-deco .lbl{font:800 13px/1 'Inter Variable',Inter,system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000}
  .is-tv .bezel{inset:-12px;border:14px solid #2b2722;border-radius:22px;box-shadow:inset 0 0 30px rgba(0,0,0,.85),0 12px 30px rgba(0,0,0,.5)}
  .is-tv .lines{inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.3) 0 1px,transparent 1px 3px);border-radius:10px}
  .is-tv .lbl{right:16px;top:14px;color:#9f9;text-shadow:0 0 6px #3f3}
  .is-reel .strip{top:-6px;bottom:-6px;width:22px;background-color:#0d0b09;background-image:linear-gradient(180deg,#e9e1cf 0 52%,transparent 52%);background-size:9px 15px;background-repeat:repeat-y;background-position:6px 4px}
  .is-reel .l{left:-22px}.is-reel .r{right:-22px}
  .is-reel .scr{inset:0;background:linear-gradient(90deg,transparent 31%,rgba(255,255,255,.35) 31.2%,transparent 31.5%,transparent 68%,rgba(255,255,255,.25) 68.2%,transparent 68.4%);animation:mk-scr .3s steps(3) infinite}
  @keyframes mk-scr{33%{transform:translateX(7px)}66%{transform:translateX(-5px)}}
  .is-pola .frame{inset:-12px -12px -54px;border:12px solid #fbfaf6;border-bottom-width:54px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
  .is-pola .cap{left:0;right:0;bottom:-42px;text-align:center;font:600 18px/1 'Segoe Print','Bradley Hand','Comic Sans MS',cursive;color:#2b2b2b}
  .is-marquee .b1,.is-marquee .b2{inset:-12px;border:6px dotted #ffd34d;border-radius:14px;filter:drop-shadow(0 0 6px #ffb703)}
  .is-marquee .b2{border-color:#fff7cc;inset:-12px;animation:mk-chase .45s steps(1) infinite}
  @keyframes mk-chase{50%{opacity:0}}
  .is-marquee .sign{left:50%;top:-46px;translate:-50% 0;padding:7px 14px;border-radius:8px;background:#b3121f;color:#ffe08a;font:900 14px/1 'Inter Variable',Inter,sans-serif;box-shadow:0 0 18px rgba(255,180,60,.6);white-space:nowrap}
  .is-comic .dots{inset:0;background:radial-gradient(circle,rgba(0,0,0,.4) 1.2px,transparent 1.7px) 0 0/7px 7px;mix-blend-mode:multiply}
  .is-comic .ink{inset:-5px;border:6px solid #111;border-radius:4px}
  .is-comic .pow{width:96px;height:96px;right:-34px;top:-38px}
  .is-comic .pow text{font:900 22px 'Inter Variable',Inter,sans-serif;fill:#e10600}
  .is-vhs .track{left:0;right:0;height:14%;background:linear-gradient(transparent,rgba(255,255,255,.22),transparent);animation:mk-track 2.4s linear infinite}
  @keyframes mk-track{from{top:-14%}to{top:100%}}
  .is-vhs .osd{left:14px;top:12px;font-size:16px}.is-vhs .date{right:14px;bottom:12px;font-size:14px}
  .is-thermal .cross{left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border:2px solid rgba(255,255,255,.8);border-radius:50%}
  .is-thermal .lbl{left:12px;top:12px}
    .mk-spot{position:fixed;inset:0;z-index:2147482370;pointer-events:none;animation:mk-deco-in .6s both}
  .mk-spot.is-out{animation:mk-deco-out .45s both}
  .is-coffin svg{inset:0;width:100%;height:100%}
  .is-coffin polygon{fill:none;stroke:#6b4423;stroke-width:7;vector-effect:non-scaling-stroke}
  .is-coffin .rip{left:50%;top:52%;translate:-50% -50%;font:800 20px/1 Georgia,serif;color:rgba(255,240,220,.88);text-shadow:0 2px 6px #000}
  .is-haunt .vig{inset:0;background:radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,.78))}
  .is-haunt .eye{width:12px;height:7px;margin:-3px 0 0 -6px;border-radius:50%;background:#ff2b2b;box-shadow:0 0 12px 4px rgba(255,40,40,.8);animation:mk-blink 3.6s infinite}
  @keyframes mk-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  .is-web .web{width:84px;height:84px;stroke:rgba(235,235,245,.92);stroke-width:.7;fill:none;stroke-dasharray:80;stroke-dashoffset:80;animation:mk-web 1.6s ease-out forwards}
  @keyframes mk-web{to{stroke-dashoffset:0}}
  .is-web .tl{left:-2px;top:-2px}.is-web .br{right:-2px;bottom:-2px;transform:scale(-1,-1)}
  .is-web .thread{left:64%;top:0;width:1px;height:20%;background:rgba(235,235,245,.85);animation:mk-thread 3s ease-in-out infinite alternate}
  @keyframes mk-thread{to{height:46%}}
  .is-web .spider{position:absolute;left:-6px;bottom:-7px;width:13px;height:10px;border-radius:50%;background:#111;box-shadow:-5px 1px 0 -3px #111,5px 1px 0 -3px #111,0 0 0 1px rgba(255,255,255,.35)}
  .is-pumpkin svg{inset:0;width:100%;height:100%}
  .is-pumpkin svg *{fill:#ffcf5a;filter:drop-shadow(0 0 6px #ff9a1a);animation:mk-candle 1.4s ease-in-out infinite alternate}
  @keyframes mk-candle{to{opacity:.72}}
  .is-slime svg{inset:0;width:100%;height:100%;fill:#7cff3a;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
  .is-slime path{transform-origin:50% 0;transform-box:fill-box;animation:mk-drip 1.8s ease-in both}
  @keyframes mk-drip{from{transform:scaleY(0)}}
  .is-ghost .gface{left:27%;top:22%;width:46%;height:56%;fill:#14141a;opacity:.82}
  .is-tomb .epitaph{left:50%;top:40%;translate:-50% -50%;text-align:center;font:800 clamp(16px,2.2vw,30px)/1.1 Georgia,'Times New Roman',serif;color:rgba(255,255,255,.9);text-shadow:0 -1px 0 rgba(0,0,0,.7),0 1px 0 rgba(255,255,255,.2);white-space:nowrap}
  .is-tomb .epitaph small{display:block;margin-top:6px;font-size:.55em;font-weight:600}
  .is-tomb .grass{left:4%;right:4%;bottom:-6px;height:12px;background:repeating-linear-gradient(90deg,#2f6b2f 0 3px,#3f8f3f 3px 5px,transparent 5px 7px)}
  .is-brew .brew{left:0;right:0;bottom:0;height:46%;background:linear-gradient(180deg,rgba(124,255,58,.8),rgba(30,120,20,.95));border-radius:0 0 8px 8px;box-shadow:0 -6px 22px rgba(124,255,58,.55);animation:mk-rise 1.2s ease-out both}
  @keyframes mk-rise{from{height:0}}
  .is-brew .bub{bottom:12%;width:12px;height:12px;border-radius:50%;border:2px solid rgba(220,255,200,.9);animation:mk-bub 1.6s ease-in infinite}
  .is-brew .bub:nth-child(2){left:18%;animation-delay:.2s}.is-brew .bub:nth-child(3){left:42%;animation-delay:.7s}.is-brew .bub:nth-child(4){left:66%;animation-delay:1.1s}.is-brew .bub:nth-child(5){left:84%;animation-delay:.4s}
  @keyframes mk-bub{from{transform:translateY(0);opacity:1}to{transform:translateY(-70px);opacity:0}}
  .is-moon .moon{right:-20px;top:-30px;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff9a8a,#c0182a 60%,#6d0a14);box-shadow:0 0 44px 12px rgba(220,30,40,.55)}
  .is-moon .fog{left:-10%;right:-10%;bottom:-8px;height:42%;background:linear-gradient(transparent,rgba(200,200,220,.42));filter:blur(8px);animation:mk-fog 4s ease-in-out infinite alternate}
  @keyframes mk-fog{to{transform:translateX(16px)}}
  .is-angel .halo{left:50%;top:-30px;width:46%;height:20px;translate:-50% 0;border-radius:50%;border:5px solid #ffd76a;box-shadow:0 0 18px 4px rgba(255,215,106,.85),inset 0 0 8px rgba(255,240,180,.8)}
  .is-angel .wing{top:8%;width:70px;height:94px;fill:#fff;stroke:#d9dde6;stroke-width:1.2;filter:drop-shadow(0 4px 12px rgba(255,255,255,.55))}
  .is-angel .l{left:-64px;transform-origin:100% 50%;animation:mk-flapL 1.3s ease-in-out infinite}
  .is-angel .r{right:-64px;transform-origin:0 50%;animation:mk-flapR 1.3s ease-in-out infinite}
  @keyframes mk-flapL{50%{transform:rotate(-14deg)}}
  @keyframes mk-flapR{50%{transform:rotate(14deg)}}
  .is-cloud .c{width:96px;height:34px;border-radius:999px;background:#fff;box-shadow:26px -15px 0 5px #fff,54px -6px 0 3px #fff,0 8px 24px rgba(160,190,255,.45);animation:mk-drift 6s ease-in-out infinite alternate}
  .is-cloud .c1{left:-30px;bottom:-14px}.is-cloud .c2{right:10px;bottom:-18px;animation-delay:-2s}.is-cloud .c3{left:16%;top:-22px;scale:.7;animation-delay:-4s}
  @keyframes mk-drift{to{translate:18px 0}}
  .is-rainbow .bow{left:-8%;width:116%;bottom:52%;height:auto;aspect-ratio:2;fill:none;stroke-width:6;stroke-linecap:round;stroke-dasharray:320;stroke-dashoffset:320;animation:mk-bow 1.5s ease-out forwards;filter:drop-shadow(0 0 6px rgba(255,255,255,.6))}
  @keyframes mk-bow{to{stroke-dashoffset:0}}
  .is-gold .frame{inset:-14px;border:14px solid #d4a017;border-image:linear-gradient(135deg,#fff3b0,#d4a017 30%,#fff6c4 50%,#b8860b 70%,#fff3b0) 1;box-shadow:0 0 34px rgba(255,215,0,.5)}
  .is-gold .rays{left:50%;bottom:100%;width:220%;height:140%;translate:-50% 0;background:repeating-conic-gradient(from -62deg at 50% 100%,rgba(255,240,170,.3) 0deg 5deg,transparent 5deg 13deg);-webkit-mask:linear-gradient(transparent,#000 70%);mask:linear-gradient(transparent,#000 70%);animation:mk-rays 9s linear infinite}
  @keyframes mk-rays{to{transform:rotate(6deg)}}
  .is-bubble .b{inset:-16%;border-radius:50%;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.8),transparent 16%),conic-gradient(from 0deg,rgba(255,120,200,.3),rgba(120,200,255,.3),rgba(160,255,180,.3),rgba(255,230,120,.3),rgba(255,120,200,.3));-webkit-mask:radial-gradient(circle,transparent 60%,#000 69%);mask:radial-gradient(circle,transparent 60%,#000 69%);animation:mk-spin 6s linear infinite}
  .is-box .side{left:0;right:0;bottom:0;height:60%;background:linear-gradient(#c4975a,#a87a43);border-top:3px solid #8c6338;box-shadow:inset 0 -10px 20px rgba(0,0,0,.2)}
  .is-box .flap{bottom:60%;width:46%;height:20%;background:#c4975a;border:2px solid #8c6338}
  .is-box .fl{left:-6%;transform:skewY(-14deg);transform-origin:100% 100%}.is-box .fr{right:-6%;transform:skewY(14deg);transform-origin:0 100%}
  .is-box .tape{left:46%;bottom:0;width:8%;height:60%;background:rgba(240,220,170,.6)}
  .is-rgbring .ring{inset:-7px;border-radius:14px;padding:4px;background:conic-gradient(#ff0040,#ffb300,#00ff88,#00b3ff,#a100ff,#ff0040);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:mk-rgb 1.6s linear infinite}
  @keyframes mk-rgb{from{filter:hue-rotate(0deg) drop-shadow(0 0 8px #00e5ff)}to{filter:hue-rotate(360deg) drop-shadow(0 0 8px #00e5ff)}}
  .is-lvl .lvl{left:50%;top:-14px;translate:-50% 0;font:900 clamp(20px,2.6vw,32px)/1 Orbitron,'Inter Variable',sans-serif;color:#ffe066;text-shadow:0 0 14px #ffb300,0 3px 0 #7a4b00;white-space:nowrap;animation:mk-lvl 2.6s cubic-bezier(.2,1.2,.3,1) both}
  @keyframes mk-lvl{from{transform:translateY(40px) scale(.5);opacity:0}30%{transform:translateY(-8px) scale(1.12);opacity:1}45%{transform:none}}
  .is-xp .xp{left:var(--x);bottom:24%;font:800 17px/1 Orbitron,'Inter Variable',sans-serif;color:#7cff6b;text-shadow:0 0 10px #2bff88,0 2px 0 #063;opacity:0;animation:mk-xp 2.2s ease-out infinite;animation-delay:var(--d);white-space:nowrap}
  @keyframes mk-xp{12%{opacity:1}to{transform:translateY(-80px);opacity:0}}
  .is-hp .hp{left:12%;right:12%;top:-24px;height:14px;border:2px solid #111;border-radius:4px;background:#3a0d0d;overflow:hidden;box-shadow:0 2px 0 rgba(0,0,0,.5)}
  .is-hp .hp i{position:absolute;inset:0;background:#41d651;transform-origin:0 50%;animation:mk-hp 5s ease-in-out infinite}
  @keyframes mk-hp{0%,100%{transform:scaleX(1);background:#41d651}38%,58%{transform:scaleX(.16);background:#ff4d4d}}
  .is-hp .hpl{left:12%;top:-46px;font:800 14px/1 'Inter Variable',sans-serif;color:#fff;text-shadow:0 1px 2px #000}
  .is-glitch .sl{left:-3%;right:-3%;height:7%;top:var(--y);background:rgba(0,255,240,.28);mix-blend-mode:screen;animation:mk-slice .45s steps(2) infinite;animation-delay:var(--d)}
  .is-glitch .sl:nth-child(even){background:rgba(255,0,200,.28)}
  @keyframes mk-slice{50%{transform:translateX(14px)}}
  .is-ach .ach{left:50%;bottom:8px;translate:-50% 0;display:grid;grid-template-columns:auto auto;gap:1px 10px;align-items:center;padding:8px 16px 8px 10px;border-radius:999px;background:rgba(10,10,16,.9);color:#fff;font:650 13px/1.25 'Inter Variable',sans-serif;box-shadow:0 0 0 2px #00e5ff,0 10px 24px rgba(0,0,0,.5);white-space:nowrap;animation:mk-ach .55s cubic-bezier(.2,1.3,.4,1) both}
  .is-ach .ach i{grid-row:span 2;font-style:normal;font-size:22px}
  .is-ach .ach small{font-weight:450;color:#c9c9d4}
  @keyframes mk-ach{from{transform:translateY(20px) scale(.8);opacity:0}}
  .is-wasd .keys{left:50%;bottom:-70px;translate:-50% 0;display:grid;grid-template-columns:repeat(3,30px);grid-template-rows:repeat(2,30px);gap:4px}
  .is-wasd .keys b{display:grid;place-items:center;border-radius:7px;background:#1b1b22;color:#e8e8f0;font:750 14px 'Inter Variable',sans-serif;box-shadow:0 3px 0 #000,inset 0 0 0 1px #33333d;animation:mk-key 1.6s steps(1) infinite;animation-delay:var(--d)}
  .is-wasd .keys b:first-child{grid-column:2}
  @keyframes mk-key{0%{background:#00e5ff;color:#001018;box-shadow:0 1px 0 #000,0 0 16px #00e5ff;transform:translateY(2px)}25%{background:#1b1b22;color:#e8e8f0;box-shadow:0 3px 0 #000,inset 0 0 0 1px #33333d;transform:none}}
  .is-run .sr{right:8px;top:8px;padding:6px 10px 7px;border-radius:9px;background:rgba(0,0,0,.78);color:#7cff6b;font:800 17px/1.1 'Inter Variable',sans-serif;font-variant-numeric:tabular-nums}
  .is-run .sr small{display:block;color:#ffd34d;font-size:12px;font-weight:650}
  .is-gg .gg{left:50%;top:50%;translate:-50% -50%;font:900 clamp(44px,7vw,92px)/1 Orbitron,'Inter Variable',sans-serif;color:transparent;-webkit-text-stroke:3px #fff;filter:drop-shadow(0 0 14px #ff00d4);animation:mk-gg .8s cubic-bezier(.2,1.4,.3,1) both}
  @keyframes mk-gg{from{transform:scale(2.2);opacity:0}}
  .is-nvg .scan{inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
  .is-nvg .vig{inset:0;background:radial-gradient(circle,transparent 42%,rgba(0,12,0,.86) 74%)}
  .is-nvg .lbl{left:12px;top:10px;color:#b6ff8a;text-shadow:0 0 6px #4f4}
  .is-scope svg{inset:0;width:100%;height:100%}
  .is-scope line,.is-scope circle{stroke:#111;stroke-width:1.6;fill:none;vector-effect:non-scaling-stroke}
  .is-scope .red{fill:#ff2b2b;stroke:none}
  .is-tgt .k{width:24px;height:24px;border:3px solid #ff3b3b;animation:mk-lock .9s cubic-bezier(.2,.9,.3,1) both}
  .is-tgt .k1{left:-6px;top:-6px;border-right:0;border-bottom:0;--tx:-40px;--ty:-30px}.is-tgt .k2{right:-6px;top:-6px;border-left:0;border-bottom:0;--tx:40px;--ty:-30px}
  .is-tgt .k3{left:-6px;bottom:-6px;border-right:0;border-top:0;--tx:-40px;--ty:30px}.is-tgt .k4{right:-6px;bottom:-6px;border-left:0;border-top:0;--tx:40px;--ty:30px}
  @keyframes mk-lock{from{transform:translate(var(--tx),var(--ty));opacity:0}}
  .is-tgt .lbl{left:50%;bottom:-30px;translate:-50% 0;color:#ff5c5c;white-space:nowrap;animation:mk-blink2 1s steps(1) infinite}
  @keyframes mk-blink2{50%{opacity:.35}}
  .is-radar .rad{inset:0;overflow:hidden;border-radius:10px}
  .is-radar .sweep{position:absolute;left:50%;top:50%;width:160%;aspect-ratio:1;translate:-50% -50%;background:conic-gradient(from 0deg,rgba(155,229,100,.6),rgba(155,229,100,0) 70deg,transparent);animation:mk-spin 2.6s linear infinite}
  .is-radar .rings{left:50%;top:50%;width:90%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 18%,rgba(155,229,100,.45) 18% 18.6%)}
  .is-radar .blip{width:8px;height:8px;margin:-4px;border-radius:50%;background:#c4ff9a;box-shadow:0 0 10px #8f8;animation:mk-blink2 1.3s steps(1) infinite;animation-delay:var(--d)}
  .is-camo svg{inset:0;width:100%;height:100%;mix-blend-mode:multiply;opacity:.8;overflow:hidden!important;border-radius:10px}
  .is-stamp .stamp{left:50%;top:50%;translate:-50% -50%;rotate:-14deg;padding:6px 16px;border:4px solid #d11;border-radius:6px;color:#d11;font:400 clamp(20px,3vw,34px)/1 'Black Ops One','Inter Variable',sans-serif;white-space:nowrap;background:rgba(255,255,255,.14);animation:mk-stamp .45s cubic-bezier(.3,1.6,.5,1) both}
  @keyframes mk-stamp{from{transform:scale(2.4);opacity:0}}
  .is-redact .bar{height:9%;left:var(--l);width:var(--w);top:var(--y);background:#0b0b0b;transform-origin:0 50%;animation:mk-redact .35s ease-out both;animation-delay:var(--d)}
  @keyframes mk-redact{from{transform:scaleX(0)}}
  .is-dot .dot{width:12px;height:12px;margin:-6px;border-radius:50%;background:#ff2020;box-shadow:0 0 12px 4px rgba(255,30,30,.75)}
  .is-dot .ring2{width:34px;height:34px;margin:-17px;border:2px solid rgba(255,60,60,.75);border-radius:50%}
  .is-done .banner{left:-4%;right:-4%;top:50%;translate:0 -50%;padding:10px 0;background:linear-gradient(90deg,transparent,rgba(10,20,10,.92) 12%,rgba(10,20,10,.92) 88%,transparent);color:#c4ff9a;text-align:center;font:400 clamp(18px,2.6vw,30px)/1.1 'Black Ops One','Inter Variable',sans-serif;animation:mk-banner .6s cubic-bezier(.2,.9,.3,1) both}
  @keyframes mk-banner{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
  .is-kapow .lines,.is-speed .lines{inset:-25%;background:repeating-conic-gradient(from 0deg at 50% 50%,transparent 0 4deg,rgba(255,255,255,.6) 4deg 5deg);-webkit-mask:radial-gradient(circle,transparent 28%,#000 66%);mask:radial-gradient(circle,transparent 28%,#000 66%)}
  .is-kapow svg,.is-boom svg{left:50%;top:50%;width:min(80%,260px);aspect-ratio:1;translate:-50% -50%;animation:mk-gg .6s cubic-bezier(.2,1.5,.3,1) both}
  .is-kapow text,.is-boom text{font:400 24px Bangers,'Comic Sans MS','Inter Variable',sans-serif;fill:#e10600;stroke:#111;stroke-width:1.2}
  .is-say .bub{left:50%;bottom:calc(100% + 18px);translate:-50% 0;width:max-content;max-width:min(260px,80vw);padding:10px 14px;border:3px solid #111;border-radius:22px;background:#fff;color:#111;font:400 18px/1.15 Bangers,'Comic Sans MS','Inter Variable',sans-serif;letter-spacing:.02em;text-align:center;animation:mk-gg .4s cubic-bezier(.2,1.4,.3,1) both}
  .is-say .bub::after{content:'';position:absolute;left:30%;bottom:-11px;width:16px;height:16px;background:#fff;border-right:3px solid #111;border-bottom:3px solid #111;transform:skew(-14deg) rotate(45deg)}
  .is-say .bub.think{border-radius:50%/44%;padding:16px 22px}
  .is-say .bub.think::after{width:12px;height:12px;border:3px solid #111;border-radius:50%;bottom:-24px;transform:none}
  .is-panels .g{top:-5px;bottom:-5px;width:12px;margin-left:-6px;background:#fff8e6;border-left:3px solid #111;border-right:3px solid #111}
  .is-panels .ink{inset:-5px;border:5px solid #111;border-radius:3px}
  .is-cap .cap{left:-8px;top:-10px;padding:7px 12px;background:#ffd400;border:3px solid #111;color:#111;font:400 18px/1 Bangers,'Comic Sans MS','Inter Variable',sans-serif;letter-spacing:.02em;box-shadow:3px 3px 0 #111;white-space:nowrap;animation:mk-ach .5s cubic-bezier(.2,1.3,.4,1) both}
  .is-sketch .paper{inset:0;background:repeating-linear-gradient(-32deg,rgba(40,40,40,.16) 0 1px,transparent 1px 5px);mix-blend-mode:multiply}
  .is-sketch .lbl{right:10px;bottom:8px;color:#222;text-shadow:none;font-family:'Segoe Print','Bradley Hand','Comic Sans MS',cursive;font-weight:600}
  .is-cmyk .dots{inset:0;background:radial-gradient(circle,rgba(0,170,255,.55) 32%,transparent 36%) 0 0/9px 9px,radial-gradient(circle,rgba(255,0,140,.45) 32%,transparent 36%) 4px 4px/9px 9px;mix-blend-mode:multiply}
  .is-cape .cape{right:96%;top:0;width:46%;height:92%;background:linear-gradient(90deg,#7a0c10,#c8151d 45%,#e8252d 70%,#a51219);clip-path:polygon(100% 0,100% 96%,76% 86%,54% 100%,30% 84%,6% 94%,14% 56%,38% 14%);transform-origin:100% 50%;animation:mk-cape 1.1s ease-in-out infinite}
  @keyframes mk-cape{50%{transform:scaleX(1.1) skewY(5deg)}}
  .is-cape .tie{left:-12px;top:-8px;width:18px;height:18px;border-radius:50%;background:#ffd400;border:3px solid #111}
  .is-thumb .tp{left:50%;top:50%;width:46%;aspect-ratio:.78;translate:-50% -50%;border-radius:50%;background:repeating-radial-gradient(ellipse at 50% 62%,transparent 0 5px,rgba(70,28,12,.5) 5px 7px);-webkit-mask:radial-gradient(ellipse,#000 52%,transparent 70%);mask:radial-gradient(ellipse,#000 52%,transparent 70%);rotate:-16deg;animation:mk-press .7s cubic-bezier(.3,1.4,.5,1) both}
  @keyframes mk-press{from{transform:scale(1.5);opacity:0}}
  .is-kiln .glow{inset:0;border-radius:10px;box-shadow:inset 0 0 42px 6px rgba(255,120,40,.75)}
  .is-kiln .lbl{left:12px;top:10px}
  .is-wheel .wh{left:6%;right:6%;bottom:-22px;height:22px;border-radius:50%;background:repeating-linear-gradient(90deg,#a85a38 0 14px,#8a4428 14px 28px);box-shadow:0 6px 0 #5e2c18;animation:mk-wheel .5s linear infinite}
  @keyframes mk-wheel{to{background-position:28px 0}}
  .is-carve svg{inset:0;width:100%;height:100%}
  .is-carve path{fill:none;stroke-linecap:round;stroke-dasharray:300;stroke-dashoffset:300;animation:mk-web 2.2s ease-out forwards}
  .is-carve .s1{stroke:rgba(70,28,12,.78);stroke-width:7}.is-carve .s2{stroke:rgba(255,220,190,.6);stroke-width:2;transform:translate(-1px,-1.5px)}
  .is-sun .rays{right:-46px;top:-46px;width:108px;height:108px;border-radius:50%;background:repeating-conic-gradient(#f6b75c 0 12deg,transparent 12deg 30deg);-webkit-mask:radial-gradient(circle,transparent 40%,#000 41%);mask:radial-gradient(circle,transparent 40%,#000 41%);animation:mk-spin 14s linear infinite}
  .is-sun .disc{right:-26px;top:-26px;width:68px;height:68px;border-radius:50%;background:radial-gradient(circle at 36% 34%,#ffe0a3,#f29b38 62%,#c86a1e);box-shadow:0 5px 0 rgba(90,38,22,.4)}
  .is-sun .disc::before{content:'';position:absolute;left:30%;top:40%;width:6px;height:6px;border-radius:50%;background:#5a2616;box-shadow:16px 0 0 #5a2616}
  .is-sun .disc::after{content:'';position:absolute;left:34%;top:56%;width:22px;height:10px;border-bottom:3px solid #5a2616;border-radius:0 0 50% 50%}
  [data-site-mode=white] .mk-sfx:not(.rainbow){color:#141414;text-shadow:0 1px 0 #fff,0 0 10px rgba(255,255,255,.85)}
  [data-site-mode=white] .mk-pop:not(.mk-note){background:#fff;color:#16161a;border-color:rgba(0,0,0,.1);box-shadow:0 14px 40px rgba(0,0,0,.16)}
  [data-site-mode=white] .mk-pop .k{color:#b4532f}[data-site-mode=white] .mk-pop .s{color:#2f7d32}[data-site-mode=white] .mk-pop .f{color:#2e5bd6}[data-site-mode=white] .mk-pop .c{color:#6b7078}[data-site-mode=white] .mk-pop .n{color:#a8661a}
  [data-site-mode=white] .mk-tip{background:#fff;color:#141414}
  [data-site-mode=white] .nf-row-top .nf-row-title{color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.7)}
  /* Crow mode: a quiet frame around the work (the feathers now come from the crow itself) */
  [data-site-mode=crow] .nf-card-art{outline:1px solid rgba(155,135,230,.22);outline-offset:3px}
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
  [data-site-mode=white] .calm-screen{--film-bg:#f3f1ec}
  [data-site-mode=white] .calm-intro p,[data-site-mode=white] .calm-intro .eyebrow{text-shadow:0 1px 14px rgba(255,255,255,.75)}
  [data-site-mode=white] .calm-intro p,[data-site-mode=white] .chapter-card p{color:#4a4a52}
  [data-site-mode=white] .is-poster-mode .film-header{background:rgba(243,241,236,.9);color:#141414}
  [data-site-mode=white] .is-poster-mode .film-header nav a{color:#141414}
  [data-site-mode=white] .mk-dock{background:rgba(255,255,255,.75);border-color:rgba(0,0,0,.12)}
  [data-site-mode=white] .mk-dock button{background:rgba(0,0,0,.06);color:#141414}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  // ── the pixel layer: one low-resolution canvas over the page, scaled up crisp ─────────────────
  const world = document.createElement('div');
  world.className = 'mk-world'; world.setAttribute('aria-hidden', 'true');
  const cv = document.createElement('canvas');
  world.append(cv);
  const hit = document.createElement('button');
  hit.type = 'button'; hit.className = 'mk-hit';
  hit.setAttribute('aria-label', T('Your companion. Click to chat or play.', 'رفيقك. انقر للحديث أو اللعب.'));
  let g = cv.getContext('2d'), U = 3, W = 1, H = 1;
  function fit() {
    const dpr = devicePixelRatio || 1;
    U = Math.max(2, Math.round((innerWidth < 600 ? 2.5 : 3) * dpr)) / dpr;   // whole device pixels per unit
    W = Math.ceil(innerWidth / U) + 1; H = Math.ceil(innerHeight / U) + 1;
    cv.width = W; cv.height = H;
    cv.style.width = `${W * U}px`; cv.style.height = `${H * U}px`;
    hit.style.width = `${18 * U + 8}px`; hit.style.height = `${12 * U + 8}px`;
    if (fxc.width > 1) {fxc.width = fxc.height = 1; fxOn();}
  }
  const R = (x, y, w, h, c) => {g.fillStyle = c; g.fillRect(x, y, w, h);};
  const P1 = (x, y, c) => {g.fillStyle = c; g.fillRect(x, y, 1, 1);};
  // a sprite from rows of characters ('.' is empty), filled in horizontal runs
  function S(x, y, rows, pal) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length;) {
        const ch = row[c]; let e = c + 1;
        while (e < row.length && row[e] === ch) e++;
        if (pal[ch]) R(x + c, y + r, e - c, 1, pal[ch]);
        c = e;
      }
    }
  }
  function line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    g.fillStyle = c;
    for (let i = 0; i < 900; i++) {
      g.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) {e += dy; x0 += sx;}
      if (e2 <= dx) {e += dx; y0 += sy;}
    }
  }
  function ring(cx, cy, r, c) {
    g.fillStyle = c;
    let x = r, y = 0, e = 1 - r;
    while (x >= y) {
      for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) g.fillRect(cx + a, cy + b, 1, 1);
      y++;
      if (e < 0) e += 2 * y + 1; else {x--; e += 2 * (y - x) + 1;}
    }
  }
  function disc(cx, cy, r, c) {g.fillStyle = c; for (let y = -r; y <= r; y++) {const w = Math.round(Math.sqrt(r * r - y * y)); g.fillRect(cx - w, cy + y, w * 2 + 1, 1);}}
  const alpha = (a, fn) => {const p = g.globalAlpha; g.globalAlpha = p * clamp(a, 0, 1); fn(); g.globalAlpha = p;};
  // draw facing left by mirroring around column ax
  const mirror = (ax, dir, fn) => {if (dir >= 0) return fn(); g.save(); g.translate(2 * ax + 1, 0); g.scale(-1, 1); fn(); g.restore();};
  const FONT = {
    Z: ['####', '..#.', '.#..', '####'], z: ['###', '.#.', '###'],
    R: ['##.', '#.#', '##.', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'], P: ['##.', '#.#', '##.', '#..', '#..'],
    '!': ['#', '#', '#', '.', '#'], '♪': ['.##', '.#.', '.#.', '##.', '##.'], '✓': ['....#', '...#.', '#.#..', '.#...'], '✗': ['#.#', '.#.', '#.#'],
  };
  const glyph = (ch, x, y, c) => {if (FONT[ch]) S(x, y, FONT[ch], {'#': c});};
  const text = (s, x, y, c) => {for (const ch of s) {glyph(ch, x, y, c); x += (FONT[ch]?.[0].length ?? 3) + 1;}};

  // ── state ─────────────────────────────────────────────────────────────────────────────────────
  let kind = root.dataset.companion === 'crow' ? 'crow' : root.dataset.companion === 'off' ? 'off' : 'opus';
  const C = {x: 0, y: 0, vy: 0, dir: 1, mode: 'idle', until: 0, why: '', act: null, ride: null, next: null, then: null, on: null, onType: '', onDx: 0,
    ox: 0, oy: 0, scrolled: 0, held: null, idleLook: [0, 0], lookAt: 0, blinkAt: 0, blinkUntil: 0, stareAt: 0, chaseAt: 0};
  const attention = {x: 0, y: 0, t: 0};
  const GRAV = 340;
  let frame = 0, frameAt = 0, last = performance.now(), drawAt = 0, lastInput = performance.now(), lastScroll = 0, lastTap = 0, lastTheft = performance.now(), lastScrollY = scrollY;
  let bubble = null, clicks = 0, lineIndex = 0, greeted = false, xo = null;
  let layerHost = document.body;
  const layer = () => layerHost;

  // ── the two characters, front view on an 18×10 grid; (ox, oy) is the grid's top-left ─────────
  const OP = {b: '#D97757', d: '#B65B3D', e: '#1B1311'};
  const CR = {b: '#2E2A37', d: '#1C1923', l: '#5B4C92', t: '#2F716A', w: '#F3EFE6', p: '#121016', y: '#E8A03E', yd: '#B46D24', g: '#9C97AA', shut: '#7A748C', rim: 'rgba(230,222,255,.26)'};
  // left-side cells [col, row]; the right side mirrors them (17 − col)
  const ARM = {
    out: [[1, 4], [2, 4], [1, 5], [2, 5]],
    up: [[1, 1], [2, 1], [1, 2], [2, 2], [1, 3], [2, 3], [2, 4]],
    lift: [[1, -1], [2, -1], [1, 0], [2, 0], [1, 1], [2, 1], [1, 2], [2, 2], [1, 3], [2, 3], [2, 4]],
    wave: [[0, 1], [1, 1], [1, 2], [2, 2], [1, 3], [2, 3], [2, 4]],
    down: [[1, 5], [2, 5], [1, 6], [2, 6]],
    flex: [[0, 4], [1, 4], [2, 4], [0, 5], [1, 5], [2, 5], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3]],
    hold: [[0, 4], [1, 4], [2, 4], [0, 5], [1, 5], [2, 5]],
    reach: [[1, 5], [2, 5], [0, 6], [1, 6], [-1, 6]],
    hang: [[1, -4], [2, -4], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
    fwd: [[3, 5], [4, 5], [3, 6], [4, 6]],
    fup: [[1, 1], [2, 1], [1, 2], [2, 2], [1, 3], [2, 3], [2, 4]], fmid: [[1, 4], [2, 4], [1, 5], [2, 5]], fdown: [[1, 5], [2, 5], [1, 6], [2, 6]],
    spread: [[1, 4], [2, 4], [1, 5], [2, 5]],
  };
  const WING = {
    out: [[2, 3], [1, 4], [2, 4], [0, 5], [1, 5], [2, 5], [1, 6], [2, 6]],
    fup: [[2, 4], [1, 3], [2, 3], [0, 2], [1, 2], [-1, 1], [0, 1], [-2, 0]],
    fmid: [[-3, 4], [-2, 4], [-1, 4], [0, 4], [1, 4], [2, 4], [-2, 5], [-1, 5], [0, 5], [1, 5], [2, 5]],
    fdown: [[2, 5], [1, 6], [2, 6], [0, 7], [1, 7], [-1, 8]],
    spread: [[-5, 4], [-4, 4], [-3, 4], [-2, 4], [-1, 4], [0, 4], [1, 4], [2, 4], [-6, 5], [-4, 5], [-3, 5], [-2, 5], [-1, 5], [0, 5], [1, 5], [2, 5], [-2, 3], [-1, 3], [0, 3], [1, 3], [2, 3]],
  };
  const wingFor = k => WING[k] || (k === 'up' || k === 'wave' || k === 'lift' ? WING.fup : k === 'out' || k === 'down' ? WING.out : ARM[k] || WING.out);
  function cells(list, ox, oy, side, c) {g.fillStyle = c; for (const [x, y] of list) g.fillRect(side < 0 ? ox + x : ox + 17 - x, oy + y, 1, 1);}
  const pose = () => ({eyes: 'open', look: [0, 0], armL: 'out', armR: 'out', legs: 'stand', flat: 0, breath: 0, beak: 0, x: 0, y: 0});
  const topOf = (oy, P) => oy + (P.flat ? 3 : P.breath ? 1 : 0);

  function drawOpus(ox, oy, P) {
    const flat = P.flat ? 3 : 0, top = oy + (flat || P.breath), wide = flat ? 1 : 0;
    if (P.legs !== 'tuck') {
      const dangle = P.legs === 'dangle';
      (dangle ? [3, 6, 11, 14] : [4, 6, 11, 13]).forEach((x, i) => {
        const lift = (P.legs === 'a' && i % 2 === 0) || (P.legs === 'b' && i % 2 === 1) ? 1 : 0;
        R(ox + x, oy + 8, 1, (dangle ? 3 : 2) - lift, i === 1 || i === 2 ? OP.d : OP.b);
      });
    }
    for (const s of [-1, 1]) {const k = s < 0 ? P.armL : P.armR; if (k !== 'fwd') cells(ARM[k] || ARM.out, ox, oy + (flat && (k === 'out' || k === 'down') ? 2 : 0) + (s < 0 ? P.dyL || 0 : P.dyR || 0), s, P.sleeve || OP.b);}
    R(ox + 3 - wide, top, 12 + wide * 2, oy + 8 - top, OP.b);
    R(ox + 14 + wide, top, 1, oy + 8 - top, OP.d);                 // the toy's right side, in shade
    R(ox + 3 - wide, oy + 7, 12 + wide * 2, 1, OP.d);               // and its underside
    const [lx, ly] = P.look, a = ox + 5 + lx, b = ox + 12 + lx, y = top + 2 + ly;
    g.fillStyle = OP.e;
    const f = (x, yy, w = 1, h = 1) => g.fillRect(x, yy, w, h);
    switch (P.eyes) {
      case 'closed': f(ox + 5, top + 3, 2); f(ox + 11, top + 3, 2); break;
      case 'blink': f(a, y + 1); f(b, y + 1); break;
      case 'happy': f(ox + 5, top + 1); f(ox + 6, top + 2); f(ox + 5, top + 3); f(ox + 12, top + 1); f(ox + 11, top + 2); f(ox + 12, top + 3); break;
      case 'wide': f(a - 1, y - 1, 2, 3); f(b, y - 1, 2, 3); break;
      case 'squint': f(a - 1, y + 1, 2); f(b, y + 1, 2); break;
      case 'dead': for (const [dx, dy] of [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]]) {f(ox + 5 + dx, top + 2 + dy); f(ox + 12 + dx, top + 2 + dy);} break;
      case 'heart': g.fillStyle = '#FF5C8A'; for (const x of [ox + 4, ox + 11]) {f(x, top + 1); f(x + 2, top + 1); f(x, top + 2, 3); f(x + 1, top + 3);} break;
      case 'none': break;
      default: f(a, y, 1, 2); f(b, y, 1, 2);
    }
    for (const s of [-1, 1]) if ((s < 0 ? P.armL : P.armR) === 'fwd') cells(ARM.fwd, ox, oy + (s < 0 ? P.dyL || 0 : P.dyR || 0), s, OP.d);
  }

  function drawCrow(ox, oy, P) {
    const c = CR, flat = P.flat ? 3 : 0, top = oy + (flat || P.breath), wide = flat ? 1 : 0;
    if (root.dataset.siteMode !== 'white') R(ox + 2 - wide, top - 1, 14 + wide * 2, oy + 9 - top, c.rim);   // rim light: a black bird on a black page
    if (P.legs !== 'tuck') {
      const len = P.legs === 'dangle' ? 3 : 2;
      [6, 11].forEach((x, i) => {
        const up = (P.legs === 'a' && i === 0) || (P.legs === 'b' && i === 1) ? 1 : 0;
        R(ox + x, oy + 8, 1, len - up, c.g); R(ox + x - 1, oy + 7 + len - up, 3, 1, c.g);
      });
    }
    for (const s of [-1, 1]) {const k = s < 0 ? P.armL : P.armR; if (k !== 'fwd') cells(wingFor(k), ox, oy + (flat ? 2 : 0) + (s < 0 ? P.dyL || 0 : P.dyR || 0), s, P.sleeve || c.b);}
    R(ox + 3 - wide, top, 12 + wide * 2, oy + 8 - top, c.b);
    R(ox + 14 + wide, top, 1, oy + 8 - top, c.d);
    R(ox + 3 - wide, oy + 7, 12 + wide * 2, 1, c.d);
    P1(ox + 4, top, c.l); P1(ox + 5, top, c.l); P1(ox + 4, top + 1, c.t); P1(ox + 13, top + 1, c.l);   // oil-slick sheen
    if (!flat && !P.hat) {P1(ox + 8, top - 1, c.b); P1(ox + 9, top - 1, c.b); P1(ox + 9, top - 2, c.b); P1(ox + 10, top - 2, c.l);}   // crest
    const [lx, ly] = P.look, y = top + 2, L = ox + 5, Rr = ox + 11;
    const f = (x, yy, col, w = 1, h = 1) => {g.fillStyle = col; g.fillRect(x, yy, w, h);};
    switch (P.eyes) {
      case 'closed': case 'blink': f(L, y + 1, c.shut, 2); f(Rr, y + 1, c.shut, 2); break;
      case 'happy': for (const x of [L - 1, Rr]) {f(x, y + 1, c.w); f(x + 1, y, c.w); f(x + 2, y + 1, c.w);} break;
      case 'wide': f(L - 1, y - 1, c.w, 3, 3); f(Rr, y - 1, c.w, 3, 3); f(L, y, c.p); f(Rr + 1, y, c.p); break;
      case 'squint': f(L, y, c.d, 2); f(Rr, y, c.d, 2); f(L, y + 1, c.w, 2); f(Rr, y + 1, c.w, 2); f(L + (lx > 0 ? 1 : 0), y + 1, c.p); f(Rr + (lx < 0 ? 0 : 1), y + 1, c.p); break;
      case 'dead': for (const x of [L - 1, Rr]) for (const [dx, dy] of [[0, -1], [2, -1], [1, 0], [0, 1], [2, 1]]) f(x + dx, y + dy, c.w); break;
      case 'heart': for (const x of [L - 1, Rr]) {f(x, y - 1, '#FF5C8A'); f(x + 2, y - 1, '#FF5C8A'); f(x, y, '#FF5C8A', 3); f(x + 1, y + 1, '#FF5C8A');} break;
      case 'none': break;
      default: {
        f(L, y, c.w, 2, 2); f(Rr, y, c.w, 2, 2);
        const py = y + (ly < 0 ? 0 : 1);
        f(lx < 0 ? L : L + 1, py, c.p); f(lx > 0 ? Rr + 1 : Rr, py, c.p);
      }
    }
    if (!flat || P.eyes !== 'closed') {   // the beak (open to caw)
      const by = top + 4;
      R(ox + 7, by, 4, 1, c.y);
      if (P.beak) {R(ox + 8, by + 1, 2, 1, c.p); R(ox + 8, by + 2, 2, 1, c.yd);} else R(ox + 8, by + 1, 2, 1, c.yd);
    }
    for (const s of [-1, 1]) if ((s < 0 ? P.armL : P.armR) === 'fwd') cells(ARM.fwd, ox, oy + (s < 0 ? P.dyL || 0 : P.dyR || 0), s, c.d);
  }
  // an edition dresses the companion: a witch for Halloween, a fairy for Heaven
  const HAT = ['..........kk......', '.........kkk......', '........kkkk......', '.......kkkkk......', '.......kkkkkk.....', '......kkkkkkk.....', '......pppyppp.....', '.....kkkkkkkkk....', '.kkkkkkkkkkkkkkkk.'];
  const HELMET = ['.....hhhhhhhh.....', '...hhhhhhhhhhhh...', '..dddddddddddddd..'];
  const hsl = (h, l = 60) => `hsl(${Math.round(h) % 360} 100% ${l}%)`;
  const WINGL = ['..ww.', '.wwwb', 'wwwwb', 'wwwb.', '.wb..', '..b..'], WINGR = WINGL.map(r => [...r].reverse().join(''));
  function costume(layer, ox, oy, P) {
    const ed = root.dataset.edition;
    if (!ed) return;
    const top = topOf(oy, P);
    if (ed === 'halloween' && layer === 'front' && !P.hat) S(ox, top - 9, HAT, {k: '#241B33', p: '#7B3FBF', y: '#FFD34D'});
    if (ed === 'heaven') {
      if (layer === 'back') {const up = frame % 4 < 2 ? 1 : 0; alpha(.85, () => {S(ox - 4, top + 1 - up, WINGL, {w: '#EAF6FF', b: '#B9DCFF'}); S(ox + 17, top + 1 - up, WINGR, {w: '#EAF6FF', b: '#B9DCFF'});});}
      else if (!P.hat) S(ox + 5, top - 4, ['.yyyyyy.', 'y......y', '.yyyyyy.'], {y: '#FFD76A'});
    }
    if (ed === 'rgb' && layer === 'front' && !P.hat) {const c = hsl(frame * 24); headphones(ox, top, c); line(ox + 2, top + 3, ox + 5, top + 6, '#2A2A2E'); P1(ox + 6, top + 6, c);}
    if (ed === 'tactical' && layer === 'front' && !P.hat) {const g = frame % 3 ? '#9BE564' : '#D6FFB0'; S(ox, top - 3, HELMET, {h: '#4B5320', d: '#2F3414'}); R(ox + 7, top - 5, 4, 2, '#26262A'); P1(ox + 7, top - 5, g); P1(ox + 10, top - 5, g);}
    if (ed === 'comic') {
      if (layer === 'back') {R(ox + 2, top + 1, 14, oy + 8 - top, '#C8102E'); for (let x = 2; x < 16; x++) if ((x + frame) % 3) P1(ox + x, oy + 9, '#C8102E');}
      else {R(ox + 4, top + 1, 4, 3, '#1B1B3A'); R(ox + 10, top + 1, 4, 3, '#1B1B3A'); R(ox + 8, top + 2, 2, 1, '#1B1B3A'); R(ox + 5, top + 2, 2, 1, '#FFFFFF'); R(ox + 11, top + 2, 2, 1, '#FFFFFF');}
    }
    if (ed === 'clay' && layer === 'front' && !P.hat) {
      line(ox + 9, top - 1, ox + 9, top - 3, '#6A994E'); P1(ox + 10, top - 2, '#81B29A');
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) P1(ox + 9 + dx, top - 5 + dy, '#F0EEE6');
      P1(ox + 9, top - 5, '#E9C46A');
      for (const [dx, dy] of [[12, 5], [13, 6], [11, 6]]) P1(ox + dx, top + dy, 'rgba(90,38,22,.35)');   // a thumbprint in the clay
    }
  }
  const drawChar = (who, ox, oy, P) => {costume('back', ox, oy, P); (who === 'crow' ? drawCrow : drawOpus)(ox, oy, P); costume('front', ox, oy, P);};

  // ── props ─────────────────────────────────────────────────────────────────────────────────────
  const SYN = ['#E8916F', '#7AA2F7', '#9ECE6A', '#BB9AF7', '#E0AF68', '#C0CAF5', '#C0CAF5'];
  const CODE = Array.from({length: 24}, () => {const out = []; let x = Math.floor(Math.random() * 3); while (x < 9) {const w = 1 + Math.floor(Math.random() * 3); out.push([x, Math.min(w, 9 - x), any(SYN)]); x += w + 1;} return out;});
  function laptop(ox, oy, t) {
    const x = ox + 19, y = oy;
    R(x - 1, y - 1, 12, 9, '#3B4049'); R(x, y, 10, 7, '#0E131A');
    const first = Math.floor(t * 2.2);
    for (let i = 0; i < 7; i++) for (const [cx, w, col] of CODE[(first + i) % CODE.length]) R(x + cx, y + i, w, 1, col);
    if (t % 1 < .5) P1(x + 1 + (first % 7), y + 6, '#FFFFFF');
    R(x - 3, y + 8, 16, 1, '#C9CED6'); R(x - 2, y + 9, 15, 1, '#8D939C');
    alpha(.13, () => R(ox + 9, oy + 1, 6, 7, '#8EC5FF'));   // the screen's light on his face
  }
  const nightcap = (ox, top) => {R(ox + 4, top - 1, 10, 1, '#3B5BA9'); R(ox + 6, top - 2, 7, 1, '#3B5BA9'); R(ox + 9, top - 3, 5, 1, '#3B5BA9'); R(ox + 12, top - 4, 3, 1, '#3B5BA9'); R(ox + 15, top - 5, 1, 2, '#F4F4F4');};
  const beret = (ox, top) => {R(ox + 4, top - 1, 10, 1, '#1E1E24'); R(ox + 5, top - 2, 8, 1, '#1E1E24'); R(ox + 7, top - 3, 4, 1, '#1E1E24'); P1(ox + 9, top - 4, '#1E1E24');};
  const tophat = (ox, top) => {R(ox + 5, top - 1, 8, 1, '#0D0D10'); R(ox + 6, top - 5, 6, 4, '#0D0D10'); R(ox + 6, top - 2, 6, 1, '#6B2A2A');};
  const bowtie = (ox, y) => {S(ox + 6, y, ['#..#', '####', '#..#'], {'#': '#C8372D'}); R(ox + 8, y + 1, 2, 1, '#7E1F18');};
  function suit(ox, oy) {
    R(ox + 3, oy + 4, 12, 4, '#26304A'); R(ox + 14, oy + 4, 1, 4, '#1B2236');
    R(ox + 7, oy + 4, 4, 1, '#F2F2F2'); R(ox + 8, oy + 5, 2, 1, '#F2F2F2');
    R(ox + 8, oy + 4, 2, 3, '#C8372D'); P1(ox + 8, oy + 7, '#C8372D'); P1(ox + 9, oy + 7, '#9E2A22');
  }
  const clipboard = (x, y) => {R(x, y, 4, 6, '#8B5A2B'); R(x + 1, y + 1, 2, 4, '#F5F5F0'); R(x + 1, y, 2, 1, '#9AA0A8'); P1(x + 1, y + 2, '#3FA34D'); P1(x + 2, y + 4, '#C8372D');};
  function mug(x, y, t) {
    R(x, y, 3, 3, '#F1EDE4'); R(x, y, 3, 1, '#6B3E26'); P1(x + 3, y + 1, '#F1EDE4');
    alpha(.55, () => {P1(x + 1 + Math.round(Math.sin(t * 6)), y - 2, '#DADADA'); P1(x + 1 + Math.round(Math.sin(t * 6 + 2)), y - 4, '#DADADA');});
  }
  const bucket = (x, y) => {R(x, y + 1, 6, 5, '#F4F1EA'); for (const c of [0, 2, 4]) R(x + c, y + 1, 1, 5, '#D33A3A'); R(x, y, 6, 1, '#FFF1B8'); P1(x + 1, y - 1, '#FFE08A'); P1(x + 4, y - 1, '#FFF1B8');};
  function clapper(x, y, open) {
    R(x, y + 2, 6, 4, '#1E1E24'); R(x + 1, y + 3, 4, 1, '#5A5A66');
    for (let i = 0; i < 6; i++) P1(x + i, open ? y + 1 - Math.floor(i / 2) : y + 1, i % 2 ? '#1E1E24' : '#F4F4F4');
  }
  const duck = (x, y) => S(x, y, ['.yy...', 'ykyo..', '.yy...', 'yyyyy.', 'yyyyyy', '.yyyy.'], {y: '#F7D046', k: '#1A1A1A', o: '#F08A24'});
  const bulb = (x, y) => S(x, y, ['.yyy.', 'yywyy', 'yyyyy', '.yyy.', '.ggg.', '..g..'], {y: '#FFE066', w: '#FFFFFF', g: '#9AA0A8'});
  const barbell = (x, y) => {R(x - 1, y, 22, 1, '#9AA0A8'); R(x - 3, y - 2, 2, 5, '#2A2D33'); R(x + 21, y - 2, 2, 5, '#2A2D33');};
  const headphones = (ox, top, col) => {R(ox + 3, top - 2, 12, 1, '#2A2A2E'); R(ox + 2, top - 1, 1, 2, '#2A2A2E'); R(ox + 15, top - 1, 1, 2, '#2A2A2E'); R(ox + 1, top + 1, 2, 3, col); R(ox + 15, top + 1, 2, 3, col);};
  function plant(x, gy, h, bloom) {
    R(x, gy - 3, 5, 4, '#C1663F'); R(x - 1, gy - 4, 7, 1, '#A4512F'); R(x + 1, gy - 4, 3, 1, '#4A3426');
    for (let i = 0; i < h; i++) {P1(x + 2, gy - 5 - i, '#4FAF5A'); if (i % 2) P1(x + (i % 4 === 1 ? 1 : 3), gy - 5 - i, '#7ED38A');}
    if (bloom) {const fy = gy - 5 - h; for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) P1(x + 2 + dx, fy + dy, '#FF6B9A'); P1(x + 2, fy, '#FFD166');}
  }
  const wateringCan = (x, y, tilt) => {R(x, y, 4, 3, '#5B8C6B'); P1(x + 1, y - 1, '#5B8C6B'); line(x + 4, y + 1, x + 6, tilt ? y + 3 : y - 1, '#5B8C6B');};
  const crate = (x, y) => {R(x, y, 6, 5, '#B98A52'); R(x, y, 6, 1, '#D2A56A'); R(x + 2, y, 2, 5, '#8C6338');};
  const handheld = (x, y) => {R(x, y, 6, 5, '#B8BCC4'); R(x + 1, y + 1, 4, 2, '#9BBC0F'); P1(x + 4, y + 4, '#D33A3A'); P1(x + 1, y + 4, '#2A2A2E');};
  const phone = (x, y, flash) => {R(x, y, 3, 5, '#202024'); R(x + 1, y + 1, 1, 3, '#4A6FA5'); if (flash) for (const [dx, dy] of [[1, -1], [0, -2], [2, -2], [1, -3], [1, -2]]) P1(x + dx, y + dy, '#FFFFFF');};
  function book(x, y, flip) {
    R(x, y, 9, 5, '#7A4A2A'); R(x + 1, y, 3, 4, '#F5F1E6'); R(x + 5, y, 3, 4, '#F5F1E6');
    for (let i = 0; i < 3; i += 2) {R(x + 1, y + 1 + i, 3, 1, '#C9C2B4'); R(x + 5, y + 1 + i, 3, 1, '#C9C2B4');}
    if (flip) R(x + 4, y - 1, 1, 4, '#FFFFFF');
  }
  function easel(x, gy, k) {
    line(x + 1, gy, x + 3, gy - 12, '#8B5A2B'); line(x + 9, gy, x + 7, gy - 12, '#8B5A2B');
    R(x, gy - 13, 11, 8, '#FFFDF5');
    const pic = ['.bbbbb.', 'bwbbbwb', 'bbbyybb', 'bbbbbbb', '.g...g.'];   // a portrait of the crow, unflattering
    let n = Math.floor(clamp(k, 0, 1) * 35);
    for (let r = 0; r < pic.length && n > 0; r++) for (let c = 0; c < 7 && n > 0; c++, n--) {const ch = pic[r][c]; if (ch !== '.') P1(x + 2 + c, gy - 12 + r, {b: '#2E2A37', w: '#F3EFE6', y: '#E8A03E', g: '#9C97AA'}[ch]);}
  }
  const tomb = (x, gy) => {R(x, gy - 9, 13, 10, '#8E8E96'); R(x + 1, gy - 10, 11, 1, '#8E8E96'); text('RIP', x + 1, gy - 8, '#45454D');};
  const notebook = (x, y, t) => {R(x, y, 4, 5, '#F5F1E6'); R(x + 1, y + 1, 2, 1, '#9A95A8'); R(x + 1, y + 3, 2, 1, '#9A95A8'); P1(x + 4, y + 1 + (Math.floor(t * 3) % 3), '#E3B04B');};
  function car(x, gy, step) {
    S(x - 7, gy - 6, ['...rrrrr.....', '..rwwrwwr....', 'rrrrrrrrrrrr.', 'rrrrrrrrrrrry'], {r: '#3185FC', w: '#BFE3FF', y: '#FFF6C9'});
    for (const wx of [x - 5, x + 2]) {R(wx, gy - 2, 2, 2, '#1E1E24'); P1(wx + (step % 2), gy - 2 + (step % 2), '#8A8A8A');}
  }
  function wheel(cx, cy, r, step, rim, spoke) {
    ring(cx, cy, r, rim);
    const a = (step % 2) * Math.PI / 4;
    for (let k = 0; k < 4; k++) {const an = a + k * Math.PI / 4, dx = Math.round(Math.cos(an) * (r - 1)), dy = Math.round(Math.sin(an) * (r - 1)); line(cx - dx, cy - dy, cx + dx, cy + dy, spoke);}
    P1(cx, cy, rim);
  }
  function hammer(x, y, up) {if (up) {R(x, y - 5, 1, 6, '#8B5A2B'); R(x - 1, y - 7, 3, 2, '#7A7F88');} else {R(x, y, 5, 1, '#8B5A2B'); R(x + 5, y - 1, 2, 3, '#7A7F88');}}
  const potion = (x, y) => S(x, y, ['.cc.', '.nn.', 'nppn', 'pppp', 'pppp', '.pp.'], {c: '#8B5A2B', n: '#CDEBFF', p: '#A35BFF'});
  function sack(x, y, n) {const k = Math.min(4, n), w = 5 + k, h = 6 + k; R(x, y - h + 2, w, h - 2, '#B98A52'); R(x + 1, y - h + 1, w - 2, 1, '#B98A52'); R(x + 1, y - h, w - 2, 1, '#6B4A2A'); R(x + w - 2, y - h + 3, 1, h - 5, '#8C6338');}
  function vacuum(ox, oy, gy, on) {
    const cx = ox + 22;
    R(cx, gy - 6, 8, 6, '#D33A3A'); R(cx + 1, gy - 7, 6, 1, '#E86A6A'); R(cx + 1, gy, 2, 1, '#222'); R(cx + 5, gy, 2, 1, '#222');
    line(cx, gy - 4, ox + 17, oy + 5, '#555B63');
    R(ox + 17, oy - 1, 2, 6, '#7A7F88'); R(ox + 16, oy - 2, 4, 1, '#3A3F47');
    if (on && frame % 2) P1(ox + 18, oy - 3, '#BDEBFF');
  }
  const squeegee = (x, y) => {R(x, y, 1, 5, '#8B5A2B'); R(x - 3, y - 1, 7, 1, '#2A2A2E'); R(x - 3, y - 2, 7, 1, '#4FA3FF');};
  const eraser = (x, y) => {R(x, y, 6, 4, '#FF8FA3'); R(x, y, 6, 1, '#FFB3C1'); R(x, y + 3, 6, 1, '#3B5BA9');};
  const magnet = (x, y) => {S(x, y, ['rr.rr', 'rr.rr', 'rr.rr', 'rrrrr', '.rrr.'], {r: '#E23B3B'}); R(x, y, 2, 1, '#C9CED6'); R(x + 3, y, 2, 1, '#C9CED6');};
  const GLASSES = {
    deal(ox, top) {R(ox + 3, top + 2, 12, 1, '#0A0A0C'); R(ox + 4, top + 3, 4, 1, '#0A0A0C'); R(ox + 10, top + 3, 4, 1, '#0A0A0C'); R(ox + 5, top + 4, 2, 1, '#0A0A0C'); R(ox + 11, top + 4, 2, 1, '#0A0A0C'); for (const x of [ox + 5, ox + 11]) {P1(x, top + 3, '#FFFFFF'); P1(x + 1, top + 4, '#FFFFFF');}},
    nerd(ox, top) {for (const x of [ox + 3, ox + 10]) {R(x, top + 1, 5, 1, '#111'); R(x, top + 4, 5, 1, '#111'); R(x, top + 1, 1, 4, '#111'); R(x + 4, top + 1, 1, 4, '#111'); alpha(.18, () => R(x + 1, top + 2, 3, 2, '#FFFFFF'));} R(ox + 8, top + 2, 2, 1, '#111');},
    round(ox, top) {for (const x of [ox + 3, ox + 10]) {R(x + 1, top + 1, 3, 1, '#E3B04B'); R(x + 1, top + 4, 3, 1, '#E3B04B'); R(x, top + 2, 1, 2, '#E3B04B'); R(x + 4, top + 2, 1, 2, '#E3B04B');} R(ox + 8, top + 2, 2, 1, '#E3B04B');},
    '3d'(ox, top) {R(ox + 3, top + 1, 12, 4, '#F4F1EA'); R(ox + 4, top + 2, 4, 2, '#E23B3B'); R(ox + 10, top + 2, 4, 2, '#2BC4E0');},
    monocle(ox, top) {R(ox + 11, top + 1, 3, 1, '#E3B04B'); R(ox + 11, top + 4, 3, 1, '#E3B04B'); R(ox + 10, top + 2, 1, 2, '#E3B04B'); R(ox + 14, top + 2, 1, 2, '#E3B04B'); line(ox + 14, top + 4, ox + 16, top + 8, '#E3B04B');},
    heart(ox, top) {for (const x of [ox + 3, ox + 10]) S(x, top + 1, ['##.##', '#####', '.###.', '..#..'], {'#': '#FF5C8A'});},
    shutter(ox, top) {for (const r of [1, 3]) R(ox + 3, top + r, 12, 1, '#00E5FF'); R(ox + 3, top + 1, 1, 4, '#00E5FF'); R(ox + 14, top + 1, 1, 4, '#00E5FF');},
    visor(ox, top, t) {R(ox + 2, top + 2, 14, 2, '#18E6C9'); alpha(.9, () => R(ox + 3 + Math.floor(t * 12) % 12, top + 2, 1, 2, '#FFFFFF'));},
    aviator(ox, top) {for (const x of [ox + 3, ox + 10]) {R(x, top + 1, 5, 1, '#E3B04B'); alpha(.85, () => {R(x, top + 2, 5, 2, '#1F4D3A'); R(x + 1, top + 4, 3, 1, '#1F4D3A');});} R(ox + 8, top + 1, 2, 1, '#E3B04B');},
  };
  const glassesBag = bag(Object.keys(GLASSES));
  const GIFTS = [
    {a: ['.rr.', 'rwwr', '.rr.'], p: {r: '#D33A3A', w: '#E8E8E8'}}, {a: ['yy...', 'y.yyy', 'yy.y.'], p: {y: '#E3B04B'}},
    {a: ['.yy.', 'ywyy', 'yyyy', '.yy.'], p: {y: '#E3B04B', w: '#FFF3C4'}}, {a: ['ggg.', 'g.gg', 'ggg.'], p: {g: '#B8BEC6'}},
    {a: ['.b.', 'y.y', '.y.'], p: {y: '#E3B04B', b: '#6EC6FF'}}, {a: ['ggkkk', 'ggkkk'], p: {g: '#B8BEC6', k: '#2A2A2E'}},
    {a: ['.bb.', 'bwbb', '.bb.'], p: {b: '#3185FC', w: '#CFE6FF'}}, {a: ['o'], p: {o: '#D97757'}},
  ];
  const TAGS = [
    {a: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'], c: '#FF5C8A'},
    {a: ['#...#...#', '##.###.##', '#########', '#########'], c: '#FFD166'},
    {a: ['#...#.#..#', '##.##.#.#.', '#.#.#.##..', '#...#.#.#.', '#...#.#..#'], c: '#7EF2FF'},
    {a: ['..###..', '.#####.', '##.#.##', '#######', '#.###.#', '.##.##.', '..###..'], c: '#9ECE6A'},
  ];

  // ── particles (in pixel units): feathers, dust, sparks, little glyphs, gifts ─────────────────
  const parts = [];
  const emit = p => {if (!still && parts.length < 260) parts.push({vx: 0, vy: 0, g: 0, t: 0, life: 1, ...p});};
  const FEATHER = [['..q', '.bl', '.b.', 'b..', 'b..'], ['q..', 'lb.', '.b.', '..b', '..b'], ['qbbl'], ['.q.', '.l.', '.b.', '.b.', '.b.']];
  const FPAL = {b: '#3C3550', l: '#7464BE', q: '#CFC8E2'};
  const feather = (x, y) => emit({kind: 'feather', x, y, ph: Math.random() * 6, life: 99});
  const dust = (x, y, n = 5) => {for (let i = 0; i < n; i++) emit({kind: 'dust', x: x + rnd(-6, 6), y: y - 1, vx: rnd(-14, 14), vy: rnd(-8, -2), life: .5 + Math.random() * .3});};
  let suckAt = null;   // the vacuum's nozzle: loose particles fly into it
  function stepParts(dt, floor) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t += dt;
      if (suckAt && p.kind !== 'glyph') {
        const dx = suckAt[0] - p.x, dy = suckAt[1] - p.y, d = Math.hypot(dx, dy);
        if (d < 70) {if (d < 2.5) {parts.splice(i, 1); continue;} p.down = 0; p.x += dx / d * 60 * dt; p.y += dy / d * 60 * dt; continue;}
      }
      if (p.kind === 'feather') {
        if (!p.down) {p.ph += dt * 3; p.vx = Math.sin(p.ph) * 9; p.x += p.vx * dt; p.y += 9 * dt; if (p.y >= floor - 1) {p.y = floor - 1; p.down = p.t;}}
        else if (p.t - p.down > 5) parts.splice(i, 1);
        continue;
      }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.t > p.life) parts.splice(i, 1);
    }
  }
  function drawParts() {
    for (const p of parts) {
      const k = 1 - p.t / p.life, x = Math.round(p.x), y = Math.round(p.y);
      switch (p.kind) {
        case 'px': alpha(k * 1.5, () => R(x, y, p.s || 1, p.s || 1, p.c)); break;
        case 'dust': alpha(k * .5, () => {const s = 1 + Math.round(p.t * 4); R(x - (s >> 1), y - (s >> 1), s, s, p.c || '#B9B4AA');}); break;
        case 'glyph': alpha(Math.min(1, k * 1.6), () => glyph(p.ch, x, y, p.c)); break;
        case 'spark': alpha(k, () => {P1(x, y, p.c); if (p.t % .2 < .1) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) P1(x + dx, y + dy, p.c);}); break;
        case 'sprite': alpha(Math.min(1, k * 2.5), () => S(x, y, p.frames[(frame + (p.ph | 0)) % p.frames.length], p.pal)); break;
        case 'item': alpha(Math.min(1, (p.life - p.t) / 2), () => {S(x, y, p.art.a, p.art.p); if (p.t % 1.4 < .15) P1(x + p.art.a[0].length, y - 1, '#FFFFFF');}); break;
        case 'feather': alpha(p.down ? clamp(1 - (p.t - p.down - 3) / 2, 0, 1) : 1, () => S(x, y, p.down ? FEATHER[2] : p.vx < -3 ? FEATHER[0] : p.vx > 3 ? FEATHER[1] : FEATHER[3], FPAL)); break;
      }
    }
  }

  // ── the effects layer: full resolution, for glass, cracks, potion, the marker and the laser ──
  const fxc = document.createElement('canvas');
  fxc.className = 'mk-fx'; fxc.setAttribute('aria-hidden', 'true'); fxc.width = fxc.height = 1;
  const fx = fxc.getContext('2d');
  let fdpr = 1;
  const FX = [];
  function fxOn() {if (fxc.width > 1) return; fdpr = Math.min(2, devicePixelRatio || 1); fxc.width = Math.round(innerWidth * fdpr); fxc.height = Math.round(innerHeight * fdpr); fxc.style.width = `${innerWidth}px`; fxc.style.height = `${innerHeight}px`;}
  const fxAdd = e => {fxOn(); FX.push(e); return e;};
  function fxStep(now, dt) {
    if (!FX.length) {if (fxc.width > 1) fxc.width = fxc.height = 1; return;}
    fx.setTransform(1, 0, 0, 1, 0, 0); fx.clearRect(0, 0, fxc.width, fxc.height); fx.setTransform(fdpr, 0, 0, fdpr, 0, 0);
    for (let i = FX.length - 1; i >= 0; i--) {let keep; try {keep = FX[i].draw(now, dt);} catch {keep = false;} if (keep === false) FX.splice(i, 1);}
  }
  function star(x, y, s, c, a = 1) {if (s <= 0) return; fx.save(); fx.globalAlpha = a; fx.fillStyle = c; fx.beginPath(); fx.moveTo(x, y - s); fx.quadraticCurveTo(x, y, x + s, y); fx.quadraticCurveTo(x, y, x, y + s); fx.quadraticCurveTo(x, y, x - s, y); fx.quadraticCurveTo(x, y, x, y - s); fx.fill(); fx.restore();}
  function shake(el, px = 6) {try {el.animate([{translate: '0 0'}, {translate: `${-px}px ${px / 2}px`}, {translate: `${px * .7}px ${-px / 3}px`}, {translate: `${-px / 3}px ${px / 4}px`}, {translate: '0 0'}], {duration: 320, composite: 'add'});} catch {}}
  // a frame can break if it shows a picture and sits comfortably on screen
  function breakable(el) {
    if (!el?.isConnected) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 110 && r.height >= 60 && r.top > 40 && r.left > -8 && r.right < innerWidth + 8 && r.top < innerHeight - 80 && !!(el.matches('img,video') || el.querySelector('img,video'));
  }
  // what the frame looks like right now, at full resolution (its picture, its corners, its background)
  function snapshot(el, r) {
    const c = document.createElement('canvas'), w = Math.max(1, Math.round(r.width * fdpr)), h = Math.max(1, Math.round(r.height * fdpr));
    c.width = w; c.height = h;
    const x = c.getContext('2d'), cs = getComputedStyle(el), rad = (parseFloat(cs.borderTopLeftRadius) || 0) * fdpr;
    x.beginPath(); if (x.roundRect) x.roundRect(0, 0, w, h, rad); else x.rect(0, 0, w, h); x.clip();
    x.fillStyle = /rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) ? (root.dataset.siteMode === 'white' ? '#e9e6df' : '#16161c') : cs.backgroundColor;
    x.fillRect(0, 0, w, h);
    const media = [...(el.matches('img,video') ? [el] : []), ...el.querySelectorAll('video.is-playing,img')].find(m => (m.videoWidth || m.naturalWidth) && getComputedStyle(m).visibility !== 'hidden' && +getComputedStyle(m).opacity > .05);
    if (media) try {
      const mr = media.getBoundingClientRect(), mw = media.videoWidth || media.naturalWidth, mh = media.videoHeight || media.naturalHeight, fitMode = getComputedStyle(media).objectFit;
      const dx = (mr.left - r.left) * fdpr, dy = (mr.top - r.top) * fdpr, bw = mr.width * fdpr, bh = mr.height * fdpr;
      if (fitMode === 'fill') x.drawImage(media, dx, dy, bw, bh);
      else {const s = (fitMode === 'contain' ? Math.min : Math.max)(bw / mw, bh / mh); x.save(); x.beginPath(); x.rect(dx, dy, bw, bh); x.clip(); x.drawImage(media, dx + (bw - mw * s) / 2, dy + (bh - mh * s) / 2, mw * s, mh * s); x.restore();}
    } catch {}
    const gr = x.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, 'rgba(255,255,255,.1)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.06)');
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    return c;
  }
  function makeShards(w, h, ix, iy) {
    const cols = clamp(Math.round(w / 64), 3, 10), rows = clamp(Math.round(h / 64), 2, 8), pts = [];
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) pts.push([i / cols * w + (i % cols ? rnd(-.33, .33) * w / cols : 0), j / rows * h + (j % rows ? rnd(-.33, .33) * h / rows : 0)]);
    const at = (i, j) => pts[j * (cols + 1) + i], out = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      for (const tri of Math.random() < .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]) {
        const hx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, hy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3, dx = hx - ix, dy = hy - iy, dd = Math.hypot(dx, dy) || 1, f = 280 * Math.max(.25, 1 - dd / Math.hypot(w, h));
        out.push({pts: tri.map(([x, y]) => [x - hx, y - hy]), hx, hy, x: hx, y: hy, a: 0, vx: dx / dd * f * rnd(.6, 1.3), vy: dy / dd * f * rnd(.6, 1.3) - rnd(40, 170), va: rnd(-5, 5)});
      }
    }
    return out;
  }
  function makeCracks(ix, iy, w, h) {
    const out = [];
    for (let i = 0; i < 9; i++) {
      let a = i / 9 * Math.PI * 2 + rnd(-.25, .25), x = ix, y = iy;
      const pts = [[x, y]], len = rnd(.45, 1) * Math.hypot(w, h) * .55;
      for (let s = 0; s < 7; s++) {a += rnd(-.4, .4); x += Math.cos(a) * len / 7; y += Math.sin(a) * len / 7; pts.push([x, y]);}
      out.push(pts);
    }
    const loop = []; for (let i = 0; i <= 12; i++) {const a = i / 12 * Math.PI * 2, rr = rnd(12, 20); loop.push([ix + Math.cos(a) * rr, iy + Math.sin(a) * rr]);}
    out.push(loop);
    return out;
  }
  function drawCracks(e, x0, y0, k, a) {
    fx.save(); fx.beginPath(); fx.rect(x0, y0, e.w, e.h); fx.clip(); fx.lineCap = 'round'; fx.lineJoin = 'round';
    for (const [lw, col, off] of [[1.8, `rgba(0,0,0,${.4 * a})`, 1], [1, `rgba(255,255,255,${.9 * a})`, 0]]) {
      fx.lineWidth = lw; fx.strokeStyle = col; fx.beginPath();
      for (const c of e.cracks) {const n = Math.max(1, Math.round((c.length - 1) * k)); fx.moveTo(x0 + c[0][0] + off, y0 + c[0][1] + off); for (let i = 1; i <= n; i++) fx.lineTo(x0 + c[i][0] + off, y0 + c[i][1] + off);}
      fx.stroke();
    }
    fx.restore();
  }
  function drawShard(e, s, x0, y0, edge) {
    fx.save(); fx.translate(x0 + s.x, y0 + s.y); fx.rotate(s.a);
    fx.beginPath(); fx.moveTo(s.pts[0][0], s.pts[0][1]); fx.lineTo(s.pts[1][0], s.pts[1][1]); fx.lineTo(s.pts[2][0], s.pts[2][1]); fx.closePath();
    fx.save(); fx.clip(); fx.drawImage(e.tex, -s.hx, -s.hy, e.w, e.h); fx.restore();
    if (edge > .01) {fx.strokeStyle = `rgba(255,255,255,${.6 * edge})`; fx.lineWidth = 1; fx.stroke();}
    fx.restore();
  }
  // the glass of one frame: cracks → shards on the floor → rebuilt → healed by the potion
  function glass(el) {
    const r0 = el.getBoundingClientRect();
    fxOn();
    const e = {el, w: r0.width, h: r0.height, tex: snapshot(el, r0), cracks: [], k: 0, shards: null, stage: 'whole', t: 0, sparks: [], hidden: false, prev: el.style.visibility, corner: null};
    const hide = () => {if (!e.hidden) {e.hidden = true; el.style.visibility = 'hidden';}};
    e.crack = (ix, iy, k) => {if (!e.cracks.length) e.cracks = makeCracks(ix, iy, e.w, e.h); e.k = Math.max(e.k, k); shake(el);};
    e.shatter = (ix, iy) => {e.shards = makeShards(e.w, e.h, ix, iy); e.stage = 'broken'; hide();};
    e.rebuild = () => {e.stage = 'rebuild'; e.t = 0; for (const s of e.shards) {s.bx = s.x; s.by = s.y; s.ba = s.a; s.d = Math.random() * .5;}};
    e.heal = () => {e.stage = 'heal'; e.t = 0;};
    e.snapCorner = () => {const s = Math.min(e.w, e.h) * .28; e.corner = {pts: [[e.w - s, 0], [e.w, 0], [e.w, s]], at: null}; e.stage = 'corner'; hide();};
    e.end = () => {if (e.done) return; e.done = true; if (e.hidden) el.style.visibility = e.prev;};
    e.draw = (now, dt) => {
      if (e.done || !el.isConnected) {e.end(); return false;}
      const r = el.getBoundingClientRect(), x0 = r.left, y0 = r.top;
      e.t += dt;
      if (e.stage === 'whole') drawCracks(e, x0, y0, e.k, 1);
      else if (e.stage === 'broken') {
        const floorRel = innerHeight - 4 - y0;
        fx.save(); fx.setLineDash([6, 6]); fx.strokeStyle = 'rgba(160,160,170,.4)'; fx.lineWidth = 1.5; fx.strokeRect(x0 + .5, y0 + .5, e.w - 1, e.h - 1); fx.restore();
        for (const s of e.shards) {
          if (!s.rest) {s.vy += 1500 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.a += s.va * dt; if (s.y > floorRel) {s.y = floorRel; s.vy *= -.28; s.vx *= .5; s.va *= .4; if (Math.abs(s.vy) < 60) s.rest = true;}}
          drawShard(e, s, x0, y0, .6);
        }
      } else if (e.stage === 'rebuild' || e.stage === 'heal') {
        const heal = e.stage === 'heal' ? clamp(e.t / 1.8, 0, 1) : 0;
        for (const s of e.shards) {
          if (e.stage === 'rebuild') {const q = clamp((e.t - s.d) / .6, 0, 1), k = 1 - (1 - q) ** 3; s.x = s.bx + (s.hx - s.bx) * k; s.y = s.by + (s.hy - s.by) * k; s.a = s.ba * (1 - k);}
          drawShard(e, s, x0, y0, 1 - heal);
        }
        if (e.stage === 'heal') {
          if (Math.random() < .7) e.sparks.push({x: rnd(0, e.w), y: rnd(0, e.h), t: 0, life: rnd(.4, .9), s: rnd(3, 8), c: any(['#C9A7FF', '#7EF2FF', '#FFE58A', '#FFFFFF'])});
          fx.save(); fx.beginPath(); fx.rect(x0, y0, e.w, e.h); fx.clip();
          const p = x0 - e.w * .4 + e.w * 1.8 * heal, gr = fx.createLinearGradient(p - 70, y0, p + 70, y0 + e.h);
          gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
          fx.fillStyle = gr; fx.fillRect(x0, y0, e.w, e.h); fx.restore();
        }
      } else if (e.stage === 'corner') {
        const c = e.corner.pts, cx = (c[0][0] + c[1][0] + c[2][0]) / 3, cy = (c[0][1] + c[1][1] + c[2][1]) / 3;
        fx.save(); fx.beginPath(); fx.rect(x0, y0, e.w, e.h); fx.moveTo(x0 + c[0][0], y0 + c[0][1]); fx.lineTo(x0 + c[1][0], y0 + c[1][1]); fx.lineTo(x0 + c[2][0], y0 + c[2][1]); fx.closePath(); fx.clip('evenodd'); fx.drawImage(e.tex, x0, y0, e.w, e.h); fx.restore();
        const at = e.corner.at, px = at ? at[0] : x0 + cx, py = at ? at[1] : y0 + cy;
        fx.save(); fx.translate(px, py); if (at) fx.rotate(.5);
        fx.beginPath(); c.forEach(([x, y], i) => (i ? fx.lineTo(x - cx, y - cy) : fx.moveTo(x - cx, y - cy))); fx.closePath();
        fx.save(); fx.clip(); fx.drawImage(e.tex, -cx, -cy, e.w, e.h); fx.restore(); fx.strokeStyle = 'rgba(255,255,255,.65)'; fx.stroke(); fx.restore();
      }
      for (let i = e.sparks.length - 1; i >= 0; i--) {const p = e.sparks[i]; p.t += dt; if (p.t > p.life) {e.sparks.splice(i, 1); continue;} star(x0 + p.x, y0 + p.y - p.t * 14, p.s * Math.sin(p.t / p.life * Math.PI), p.c);}
    };
    return fxAdd(e);
  }

  // ── DOM pop-ups that follow the companion (code cards, sticky notes), sound effects, tips ─────
  const pops = [];
  function popup(build, {cls = '', ms = 4200, dx = 0, dy = 0, rot = 0} = {}) {
    if (still) return;
    const el = document.createElement('div');
    el.className = `mk-pop ${cls}`; build(el);
    el.style.setProperty('--r', `${rot}deg`);
    layer().append(el);
    pops.push({el, dx, dy, w: el.offsetWidth, h: el.offsetHeight, until: performance.now() + ms});
    requestAnimationFrame(() => el.classList.add('is-in'));
  }
  function placePops(now) {
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i], cx = (C.ox + 9) * U + p.dx;
      p.el.style.left = `${clamp(cx - p.w / 2, 8, innerWidth - p.w - 8)}px`;
      p.el.style.top = `${clamp((C.oy - 4) * U + p.dy - p.h, 8, innerHeight - p.h - 8)}px`;
      if (now > p.until) {const el = p.el; el.classList.remove('is-in'); setTimeout(() => el.remove(), 400); pops.splice(i, 1);}
    }
  }
  const clearPops = () => {for (const p of pops) p.el.remove(); pops.length = 0;};
  function sfx(s, cls = '', at) {
    if (still || !s) return;
    const el = document.createElement('i');
    el.className = `mk-sfx ${cls}`; el.textContent = s;
    el.style.left = `${at ? at[0] : (C.ox + 9) * U}px`; el.style.top = `${at ? at[1] : (C.oy - 6) * U}px`;
    layer().append(el);
    el.addEventListener('animationend', () => el.remove(), {once: true});
    setTimeout(() => el.remove(), 3500);
  }
  function tip(el, s, ms = 1700) {
    const r = el.getBoundingClientRect(), t = document.createElement('div');
    t.className = 'mk-tip'; t.textContent = s;
    layer().append(t);
    const w = t.offsetWidth;
    t.style.left = `${clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8)}px`; t.style.top = `${Math.max(8, r.top - 42)}px`;
    setTimeout(() => t.remove(), ms);
    return t;
  }
  // a flex: a real file from this site (or a fact), a different one every time
  const code = s => s.replace(/<(k|s|f|c|n)>/g, '<span class="$1">').replace(/<\/(k|s|f|c|n)>/g, '</span>');
  const FLEX = [
    ['companion.js', ['<k>const</k> me = <f>draw</f>(<s>‘in code’</s>);', `<c>// ${T('no images, no libraries', 'بلا صور، بلا مكتبات')}</c>`, '<f>flex</f>(<n>2</n>);']],
    ['cinema-room.js', ['canvas.<f>getContext</f>(<s>‘webgl2’</s>);', `<c>// ${T('the projector room, raw WebGL2', 'غرفة العرض، WebGL2 خام')}</c>`, '<f>blur</f>() → <f>particles</f>() → <f>picture</f>()']],
    ['title-tone.js', ['<k>const</k> frame = <f>sample</f>(video);', 'title.tone = <s>‘readable’</s>;', `<c>// ${T('titles pick their own colour', 'العناوين تختار لونها بنفسها')}</c>`]],
    ['living-text.js', ['title → <f>particles</f>();', '<f>spring</f>(<k>back</k>);', `<c>// ${T('you touched it, didn’t you', 'لمستها، أليس كذلك')}</c>`]],
    ['film-world.js', ['<f>scroll</f>() → <f>film</f>();', `<c>// ${T('15 films, every frame a real app', '15 فيلماً، كل لقطة تطبيق حقيقي')}</c>`, '<f>play</f>();']],
    ['world/engine.ts', ['scenes: <n>11</n>, minutes: <n>5</n>', `<c>// ${T('three.js, one canvas', 'three.js، لوحة واحدة')}</c>`, '<f>render</f>(world);']],
    ['build-film.mjs', ['films.<f>map</f>(buildPage);', `<c>// ${T('one command, every page', 'أمر واحد، كل الصفحات')}</c>`, '<f>ship</f>();']],
    ['git log', ['<s>fix: it works</s>', '<s>fix: it really works</s>', '<s>fix: ok NOW it works</s>']],
  ];
  const flexBag = bag(FLEX);
  function flexCard() {
    const [name, lines] = flexBag(() => true);
    const n = name === 'companion.js' ? [...lines.slice(0, 2), `rides: <n>${RIDES.length}</n>, routines: <n>${ACTS.length}</n>`] : lines;
    popup(el => {el.innerHTML = `<b></b><code>${n.map(code).join('\n')}</code>`; el.querySelector('b').textContent = name;}, {ms: 5200});
  }
  const PM = [T('Let’s circle back', 'لنرجع لهذا لاحقاً'), T('Per my last email', 'حسب رسالتي الأخيرة'), T('Can we make it pop?', 'ممكن نخليه يلمع أكثر؟'), T('Quick sync?', 'اجتماع سريع؟'),
    T('Is it scalable?', 'هل هو قابل للتوسع؟'), T('Ship it Friday', 'نطلقه الخميس'), T('Add AI to it', 'أضف له ذكاءً اصطناعياً'), T('Low-hanging fruit', 'ثمار سهلة القطف'), T('Q4 roadmap', 'خطة الربع الرابع')];
  const SOUNDS = [T('meow', 'مياو'), T('ring ring', 'رن رن'), T('beep beep', 'بيب بيب'), T('hello?', 'ألو؟'), T('*dial-up noises*', '*صوت مودم قديم*'), T('ding!', 'دينغ!'), T('woof', 'هاو هاو'), T('*car alarm*', '*إنذار سيارة*')];

  // ── stealing words (only from text you have been sitting on for a while) ──────────────────────
  const TEXT_SEL = 'p, li, h3, h4, blockquote, figcaption, dd';
  const stolen = [];
  function wordsIn(el, min = 3) {
    const out = [], range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {acceptNode: n => (n.parentElement?.closest('.mk-stolen,.mk-back,a,button,code,script,style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)});
    for (let n = walker.nextNode(); n; n = walker.nextNode()) for (const m of n.data.matchAll(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu)) {
      if (m[0].length < min) continue;
      range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
      const r = range.getBoundingClientRect();
      if (r.width > 4 && r.top > 0 && r.bottom < innerHeight) out.push({node: n, start: m.index, end: m.index + m[0].length, text: m[0], r});
    }
    return out;
  }
  // hide a word (or a letter) where it is: it keeps its space, so nothing below moves
  function take(node, start, end) {
    const range = document.createRange(); range.setStart(node, start); range.setEnd(node, end);
    const span = document.createElement('span'); span.className = 'mk-stolen';
    try {range.surroundContents(span);} catch {return null;}
    stolen.push(span);
    return span;
  }
  function giveBack() {
    for (const span of stolen.splice(0)) {
      if (!span.isConnected) continue;
      span.className = 'mk-back';
      setTimeout(() => {if (span.isConnected) {const p = span.parentNode; span.replaceWith(document.createTextNode(span.textContent)); p?.normalize();}}, 800);
    }
  }
  function flyWord(s, r, host, to, how, dur) {
    const cs = getComputedStyle(host), el = document.createElement('span');
    el.className = 'mk-word'; el.textContent = s;
    const clear = /rgba\(\d+, \d+, \d+, 0\)|transparent/;
    const color = clear.test(cs.color) || clear.test(cs.webkitTextFillColor || '') ? (root.dataset.siteMode === 'white' ? '#141414' : '#ffffff') : cs.color;
    Object.assign(el.style, {left: `${r.left}px`, top: `${r.top}px`, height: `${r.height}px`, lineHeight: `${r.height}px`, fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, letterSpacing: cs.letterSpacing, color, direction: cs.direction});
    layer().append(el);
    const [tx, ty] = to(), dx = tx - (r.left + r.width / 2), dy = ty - (r.top + r.height / 2);
    const frames = how === 'fade' ? [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(6px)', transform: 'scale(1.15)'}]
      : how === 'line' ? [{transform: 'none'}, {transform: `translate(${dx * .15}px,${dy * .15}px)`, offset: .5}, {transform: `translate(${dx}px,${dy}px) scale(.3)`, opacity: .3}]
      : how === 'up' ? [{transform: 'none'}, {transform: `translate(0,${dy * .5}px) rotate(-6deg)`, offset: .6}, {transform: `translate(${dx}px,${dy}px) scale(.25)`, opacity: .2}]
      : how === 'swirl' ? [{transform: 'none'}, {transform: `translate(${dx * .3 + 30}px,${dy * .3 - 30}px) rotate(180deg) scale(.8)`, offset: .4}, {transform: `translate(${dx * .7 - 20}px,${dy * .7 + 10}px) rotate(400deg) scale(.5)`, offset: .75}, {transform: `translate(${dx}px,${dy}px) rotate(720deg) scale(.05)`, opacity: .2}]
      : [{transform: 'none'}, {transform: `translate(${dx * .5}px,${dy * .5 - 70}px) rotate(${rnd(-30, 30)}deg) scale(.9)`, offset: .5}, {transform: `translate(${dx}px,${dy}px) rotate(${rnd(-120, 120)}deg) scale(.15)`, opacity: .25}];
    el.animate(frames, {duration: dur, easing: how === 'line' ? 'cubic-bezier(.6,0,.9,.4)' : 'cubic-bezier(.3,.1,.4,1)', fill: 'forwards'}).finished.then(() => el.remove(), () => el.remove());
    setTimeout(() => el.remove(), dur + 500);
  }
  const mouth = () => [(C.ox + 18) * U, (C.oy + 3) * U];
  // take one word (or one letter) from the block: it vanishes in place, a copy flies to `to`
  function steal(el, {letter = false, to = mouth, how = 'arc', dur = 650, near} = {}) {
    const ws = wordsIn(el, letter ? 2 : 3); if (!ws.length) return false;
    let w;
    if (near !== undefined) {const top = Math.min(...ws.map(v => v.r.top)), first = ws.filter(v => v.r.top < top + 4); w = first.reduce((a, b) => (Math.abs((b.r.left + b.r.right) / 2 - near) < Math.abs((a.r.left + a.r.right) / 2 - near) ? b : a));}
    else w = any(ws.slice(0, Math.max(2, Math.ceil(ws.length * .6))));   // the part you have probably read
    let start = w.start, end = w.end, s = w.text, r = w.r;
    if (letter) {const i = Math.floor(Math.random() * s.length); start += i; end = start + 1; s = s[i]; const rg = document.createRange(); rg.setStart(w.node, start); rg.setEnd(w.node, end); r = rg.getBoundingClientRect();}
    const host = w.node.parentElement, span = take(w.node, start, end);
    if (!span) return false;
    flyWord(s, r, host, to, how, dur);
    return r;
  }
  // text blocks fully on screen: what you are reading (or have just read)
  function readable() {
    const out = [], modal = layerHost !== document.body ? layerHost : null;
    for (const el of document.querySelectorAll(`${TEXT_SEL}, ${TITLE_SEL}`)) {
      if ((modal && !modal.contains(el)) || el.closest('.mk-bubble,.mk-pop,.mk-xo,.mk-dock,a,button,nav,header,code,pre,[data-no-steal],dialog:not([open])')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 80 || r.height < 12 || r.top < 60 || r.bottom > innerHeight - 40 || r.left < 0 || r.right > innerWidth || !visible(el)) continue;
      if (parseFloat(getComputedStyle(el).fontSize) < 12 || wordsIn(el, 3).length < 3) continue;
      out.push({el, r});
    }
    return out;
  }

  // ── perches: the frames of the work and the big titles it can stand and sit on ───────────────
  const FRAME_SEL = '.nf-card-art, .nf-pop-media, .nf-sheet-media, .cx-poster figure, .cx-world, .chapter-card figure, .fcard__thumb, .portfolio-film-card, main figure, article figure, main picture, main img, main video, article img';
  const TITLE_SEL = 'h1, h2, [data-living-text]';
  function perches() {
    const out = [], seen = new Set(), modal = layerHost !== document.body ? layerHost : null, top = topU() * U + 20, bottom = floorPx() - 30;
    const add = (el, type) => {
      if (seen.has(el)) return; seen.add(el);
      if ((modal && !modal.contains(el)) || el.closest('.mk-bubble,.mk-pop,.mk-xo,.mk-dock,dialog:not([open])')) return;
      if (type === 'frame' && el.parentElement?.closest(FRAME_SEL)) return;   // the outermost frame only
      const r = el.getBoundingClientRect();
      if (r.width < (type === 'title' ? 100 : 90) || r.height < (type === 'title' ? 22 : 50)) return;
      if (r.width > innerWidth * .96 && r.height > innerHeight * .8) return;  // full-screen layers are not frames
      if (r.top < top || r.top > bottom || r.right < 30 || r.left > innerWidth - 30 || !visible(el)) return;
      out.push({el, type, r});
    };
    for (const el of document.querySelectorAll(FRAME_SEL)) add(el, 'frame');
    for (const el of document.querySelectorAll(TITLE_SEL)) add(el, 'title');
    return out;
  }
  function perchAt(x, y) {
    for (const e of document.elementsFromPoint(x, y)) {
      if (e.closest('.mk-world,.mk-hit,.mk-bubble,.mk-pop,.mk-xo,.mk-dock')) continue;
      const el = e.closest(FRAME_SEL) || e.closest(TITLE_SEL);
      if (el) {let top = el; while (top.parentElement?.closest(FRAME_SEL)) top = top.parentElement.closest(FRAME_SEL); return perches().find(p => p.el === top) ? top : null;}
    }
    return null;
  }
  const typeOf = el => (el.matches(FRAME_SEL) ? 'frame' : el.matches(TITLE_SEL) ? 'title' : el.matches(TEXT_SEL) ? 'text' : 'thing');
  function perch(el, x = C.x) {C.on = el; C.onType = typeOf(el); const r = el.getBoundingClientRect(); C.onDx = clamp(x * U - r.left, 10, Math.max(10, r.width - 10));}

  // ── what it does when left alone, and the mischief ────────────────────────────────────────────
  // pose(t, P, st) adjusts the sprite; back/front(t, o, st, P) draw props behind / in front of it
  // (o = {bx, by} standing origin, {ox, oy} drawn origin, top drawn body top); tick(t, st, dt)
  // runs side effects and may return 'done'; st.free means it moves itself; say is its click line.
  // on: where it can happen ('floor', 'frame', 'title', 'text', 'perch' = frame or title; none = anywhere)
  const side = () => (C.x < W / 2 ? 1 : -1);
  const lookUser = () => {if (!attention.t) return [0, 0]; const dx = attention.x - (C.ox + 9) * U, dy = attention.y - (C.oy + 3) * U; return [Math.abs(dx) < 24 ? 0 : Math.sign(dx), dy < -60 ? -1 : dy > 60 ? 1 : 0];};
  const edgeOf = () => C.on?.getBoundingClientRect();
  function thief(id, who, say, o) {
    return {id, who, on: 'text', dur: [o.dur, o.dur], say, can: () => wordsIn(C.on, o.letter ? 2 : 3).length >= 2,
      start(st) {st.el = C.on; st.n = 0; st.max = o.count(); st.next = o.first ?? 1.2; st.free = !!o.walk; o.start?.(st);},
      tick(t, st, dt) {
        if (!st.el.isConnected) return 'done';
        if (o.walk) o.walk(t, st, dt);
        else {const r = st.el.getBoundingClientRect(); C.y = r.top / U;}
        if (t > st.next && st.n < st.max) {st.next = t + o.every; const r = steal(st.el, {letter: o.letter, to: o.to || mouth, how: o.how, dur: o.fly || 650, near: o.near?.()}); if (r) {st.n++; o.got?.(st, r);}}
        return o.tick?.(t, st, dt);
      },
      pose: o.pose, front: o.front, end: o.end};
  }
  const ACTS = [
    {id: 'hello', who: 'both', dur: [2.6, 2.6], once: true, pose(t, P) {P.armR = frame % 4 < 2 ? 'wave' : 'up'; P.eyes = 'happy';}},
    {id: 'code', who: 'both', dur: [11, 16], say: T('Shh. Shipping. Pull requests don’t write themselves. Mine do, but still.', 'هس. أشحن الكود. طلبات الدمج لا تكتب نفسها. طلباتي تفعل، لكن مع ذلك.'),
      pose(t, P, st) {
        if (t % 7 < 6) P.look = [1, 1];
        if (st.kind === 'crow') {P.y = frame % 3 === 0 ? 1 : 0; P.beak = P.y;}   // hunt-and-peck
        else {P.armR = 'reach'; P.dyR = frame % 2 ? -1 : 0;}
      },
      front(t, o) {laptop(o.bx, o.by, t);},
      tick(t, st) {if (t > (st.next ??= 3.5)) {st.next = t + rnd(3, 5); const ok = Math.random() < .8; emit({kind: 'glyph', ch: ok ? '✓' : '✗', x: C.ox + 23, y: C.oy - 6, vy: -5, life: 1.4, c: ok ? '#7EE08A' : '#FF6B6B'});}}},
    {id: 'sleep', who: 'both', dur: [12, 18], say: T('Five more minutes. The build is still running.', 'خمس دقائق بعد. البناء ما زال يعمل.'),
      pose(t, P) {P.flat = 1; P.eyes = 'closed'; P.look = [0, 0]; P.hat = 1;},
      front(t, o, st) {if (st.kind === 'opus') nightcap(o.ox, o.top);},
      tick(t, st) {if (t > (st.next ??= .6)) {st.next = t + 1.2; st.z = !st.z; emit({kind: 'glyph', ch: st.z ? 'Z' : 'z', x: C.ox + 15, y: C.oy + 1, vx: 3, vy: -5, life: 2.2, c: '#B9B1FF'});}}},
    {id: 'flex', who: 'both', dur: [6, 7.5], say: T('These muscles? Pure TypeScript.', 'هذه العضلات؟ تايب سكريبت خالص.'),
      start() {flexCard();},
      pose(t, P) {const k = Math.floor(t * 1.4) % 3; P.armL = k !== 1 ? 'flex' : 'out'; P.armR = k !== 0 ? 'flex' : 'out'; P.eyes = k === 2 ? 'happy' : 'squint'; P.look = [0, -1];},
      tick() {if (Math.random() < .08) emit({kind: 'spark', x: C.ox + (Math.random() < .5 ? 0 : 17), y: C.oy + 1 + Math.random() * 3, life: .5, c: '#FFD34D'});}},
    {id: 'pm', who: 'both', dur: [8.5, 10], say: T('Let’s take this offline. By offline I mean never.', 'لنكمل هذا لاحقاً. وأقصد بلاحقاً: أبداً.'),
      start(st) {st.notes = shuffle([...PM]).slice(0, 3);},
      pose(t, P, st) {if (st.kind === 'opus') P.sleeve = '#26304A'; P.armL = 'hold'; P.look = t % 4 < 2 ? [-1, 0] : [0, 0];},
      front(t, o, st) {if (st.kind === 'opus') suit(o.ox, o.oy); else bowtie(o.ox, o.top + 6); clipboard(o.ox - 3, o.oy + 3);},
      tick(t, st) {for (let i = 0; i < 3; i++) if (t > .6 + i * 2.5 && !st['n' + i]) {st['n' + i] = 1; popup(el => {el.textContent = st.notes[i];}, {cls: 'mk-note', ms: 2700, dx: (i - 1) * 54, dy: -i * 6, rot: rnd(-6, 6)});}}},
    {id: 'glasses', who: 'both', dur: [6, 8], say: T('Deal with it.', 'تعامل مع الأمر.'),
      start(st) {st.v = glassesBag(() => true);},
      pose(t, P) {P.y = t > .9 && Math.floor(t * 2) % 2 ? -1 : 0; P.look = [0, 0]; if (t > 1 && t < 2.2) P.armL = 'up';},
      front(t, o, st) {GLASSES[st.v](o.ox, o.top - Math.round(Math.max(0, 1 - t / .8) * 26), t);}},
    {id: 'coffee', who: 'both', dur: [7, 10], say: T('Coffee in, code out. That’s the whole architecture.', 'قهوة تدخل، كود يخرج. هذه هي البنية كلها.'),
      pose(t, P) {const sip = t % 3.2 > 2.2; P.armR = sip ? 'fwd' : 'hold'; if (sip) P.eyes = 'closed'; else if (t > 1 && t % 3.2 < .7) P.eyes = 'happy';},
      front(t, o) {if (t % 3.2 > 2.2) mug(o.ox + 8, o.top + 4, t); else mug(o.ox + 17, o.oy + 3, t);}},
    {id: 'popcorn', who: 'both', dur: [8, 11], say: T('Fifteen films. I’ve seen them all. I still cry at Job Orbit.', 'خمسة عشر فيلماً. شاهدتها كلها. وما زلت أبكي في Job Orbit.'),
      pose(t, P) {P.armL = 'fwd'; P.armR = t % 1.6 < .4 ? 'up' : 'fwd'; P.look = [0, 0];},
      front(t, o) {bucket(o.ox + 6, o.oy + 4);},
      tick(t, st) {if (t > (st.next ??= 1)) {st.next = t + rnd(.8, 1.6); emit({kind: 'px', x: C.ox + 8 + Math.random() * 3, y: C.oy + 3, vx: rnd(-8, 8), vy: -20, g: 60, life: .9, c: '#FFF1B8'});}}},
    {id: 'director', who: 'opus', dur: [7, 9], say: T('Take 47. The pixels keep blinking.', 'اللقطة ٤٧. البكسلات لا تتوقف عن الرمش.'),
      pose(t, P) {P.armR = 'hold'; P.look = [-1, 0]; P.hat = 1;},
      front(t, o) {beret(o.ox, o.top); clapper(o.ox + 17, o.oy + 1, t % 2.4 < 2.1);},
      tick(t, st) {const n = Math.floor((t - 2.1) / 2.4); if (n >= 0 && n !== st.n) {st.n = n; sfx(any([T('Action!', 'أكشن!'), T('Cut!', 'ستوب!'), T('Take two!', 'إعادة!')]));}}},
    {id: 'bug', who: 'both', on: 'floor', dur: [7.2, 7.2], say: T('Found a bug. Fixed it. Added two more. Balance.', 'وجدت خطأً. أصلحته. وأضفت اثنين. توازن.'),
      start(st) {st.dir = side(); st.bx = C.x + st.dir * 14;},
      pose(t, P, st) {
        if (t < 5) {P.legs = frame % 2 ? 'a' : 'b'; P.look = [st.dir, 1];}
        else if (t < 5.5) {P.y = -Math.round(Math.sin((t - 5) / .5 * Math.PI) * 6); P.eyes = 'wide'; P.armL = P.armR = 'up';}
        else P.eyes = 'happy';
      },
      tick(t, st, dt) {
        if (t < 5) {st.bx += st.dir * 9 * dt; C.x += st.dir * 8.4 * dt;} else if (t < 5.5) C.x += (st.bx - C.x) * Math.min(1, dt * 8);
        if (t >= 5.5 && !st.done) {st.done = 1; for (let i = 0; i < 6; i++) emit({kind: 'spark', x: st.bx, y: C.y - 2, vx: rnd(-14, 14), vy: rnd(-16, -4), g: 30, life: .6, c: '#7EE08A'}); emit({kind: 'glyph', ch: '✓', x: st.bx - 2, y: C.y - 14, vy: -4, life: 1.4, c: '#7EE08A'});}
      },
      front(t, o, st) {if (t < 5.4) {const x = Math.round(st.bx), gy = o.by + 9; R(x, gy - 1, 3, 2, '#5BBF5B'); P1(st.dir > 0 ? x + 3 : x - 1, gy - 1, '#2E6B2E'); P1(x + (frame % 2 ? 0 : 2), gy, '#2E6B2E');}}},
    {id: 'duck', who: 'both', dur: [8, 9], say: T('I explain my code to the duck. The duck has never been wrong.', 'أشرح الكود للبطة. البطة لم تخطئ يوماً.'),
      pose(t, P) {P.look = [-1, 1]; if (t > 5.2) {P.eyes = t < 6 ? 'wide' : 'happy'; P.look = [0, -1];}},
      front(t, o) {duck(o.bx - 7, o.by + 4); if (t < 5.2) {for (let i = 0; i < Math.floor(t * 3) % 4; i++) P1(o.bx + 6 + i * 2, o.by - 3, '#FFD34D');} else bulb(o.bx + 7, o.by - 9);}},
    {id: 'lift', who: 'opus', dur: [7, 9], say: T('Lifting the heavy dependencies so you don’t have to.', 'أرفع الاعتماديات الثقيلة حتى لا تضطر أنت.'),
      pose(t, P, st) {st.up = t % 1.4 < .7; P.armL = P.armR = st.up ? 'lift' : 'out'; P.eyes = st.up ? 'squint' : 'open';},
      front(t, o, st) {barbell(o.ox - 1, st.up ? o.oy - 2 : o.oy + 3);},
      tick(t, st) {if (st.up && Math.random() < .05) emit({kind: 'px', x: C.ox + (Math.random() < .5 ? 2 : 15), y: C.oy + 1, vx: rnd(-12, 12), vy: -10, g: 50, life: .7, c: '#8EC5FF'});}},
    {id: 'music', who: 'both', dur: [8, 11], say: T('Lo-fi beats to refactor to.', 'موسيقى هادئة لإعادة الهيكلة.'),
      pose(t, P) {const beat = Math.floor(t * 2.4) % 2; P.y = beat ? -1 : 0; P.eyes = 'closed'; P.hat = 1; P.armL = beat ? 'up' : 'out'; P.armR = beat ? 'out' : 'up';},
      front(t, o, st) {headphones(o.ox, o.top, st.kind === 'crow' ? '#5B4C92' : '#3FA7D6');},
      tick(t, st) {if (t > (st.next ??= .4)) {st.next = t + rnd(.5, .9); emit({kind: 'glyph', ch: '♪', x: C.ox + (Math.random() < .5 ? -3 : 18), y: C.oy, vx: rnd(-3, 3), vy: -7, life: 1.6, c: any(['#FF6B9A', '#FFD34D', '#6EF2FF', '#9ECE6A'])});}}},
    {id: 'plant', who: 'opus', on: 'floor', dur: [8, 9], say: T('It grows a little every time you visit. No pressure.', 'تنمو قليلاً كل مرة تزورنا. بلا ضغط.'),
      start(st) {st.h = clamp(+(recall('mk-plant') || 1), 1, 8);},
      pose(t, P) {P.armR = 'hold'; P.look = [1, 1];},
      front(t, o, st) {const grown = t > 6 && st.h < 8 ? 1 : 0; plant(o.bx + 24, o.by + 9, st.h + grown, st.h >= 8 && t > 6); wateringCan(o.ox + 17, o.oy + 2, t > 1.5 && t < 6);},
      tick(t, st) {if (t > 1.5 && t < 6 && Math.random() < .3) emit({kind: 'px', x: C.ox + 23 + Math.random() * 2, y: C.oy + 4, vy: 16, g: 40, life: .45, c: '#6EC6FF'}); if (t > 6 && !st.grew) {st.grew = 1; if (st.h < 8) store('mk-plant', String(st.h + 1));}}},
    {id: 'crates', who: 'opus', on: 'floor', dur: [9.5, 9.5], say: T('Warehouse rules: lift with your legs. I have four.', 'قواعد المستودع: ارفع بساقيك. عندي أربع.'),
      pose(t, P) {const up = t % 3 < 1.6 && t < 9; P.armL = P.armR = up ? 'lift' : 'out'; P.eyes = up ? 'squint' : 'happy';},
      front(t, o) {const n = Math.min(3, Math.floor(t / 3)); for (let i = 0; i < n; i++) crate(o.bx - 9, o.by + 5 - i * 5); if (t % 3 < 1.6 && n < 3) crate(o.ox + 6, o.oy - 6);},
      tick(t, st) {const n = Math.floor(t / 3); if (n > (st.n ?? 0) && n <= 3) {st.n = n; sfx('+1');}}},
    {id: 'ultra', who: 'both', dur: [7, 9], say: T('Ultrathinking. Please hold.', 'أفكّر بعمق شديد. انتظر من فضلك.'),
      start() {sfx('ultrathink', 'rainbow');},
      pose(t, P) {P.legs = 'tuck'; P.y = -3 - Math.round(Math.sin(t * 2) * 1.5); P.eyes = 'closed'; P.armL = P.armR = 'down';},
      front(t, o) {const RB = ['#FF6B6B', '#FFD166', '#06D6A0', '#4CC9F0', '#B388FF', '#FF8FAB']; for (let i = 0; i < 12; i++) {const a = t * 1.6 + i * Math.PI / 6; P1(Math.round(o.bx + 9 + Math.cos(a) * 14), Math.round(o.by + 4 + Math.sin(a) * 7), RB[(i + Math.floor(t * 6)) % 6]);}}},
    {id: 'game', who: 'both', dur: [8, 10], say: T('I’m not playing. I’m QA testing. Very seriously.', 'لا ألعب. أختبر الجودة. بجدية تامة.'),
      pose(t, P) {if (t % 4.5 > 4) {P.y = -2; P.eyes = 'happy'; P.armL = P.armR = 'up';} else {P.armL = P.armR = 'fwd'; P.look = [Math.round(Math.sin(t * 5)), 1]; P.dyL = frame % 3 === 0 ? -1 : 0;}},
      front(t, o) {if (t % 4.5 <= 4) handheld(o.ox + 6, o.oy + 4);}},
    {id: 'selfie', who: 'both', dur: [6, 7], say: T('For my portfolio. Oh wait, this is the portfolio.', 'لمعرض أعمالي. آه، لحظة، هذا هو المعرض.'),
      pose(t, P) {P.armR = 'up'; P.eyes = t % 2 > 1.7 ? 'closed' : 'happy';},
      front(t, o) {phone(o.ox + 16, o.oy - 3, t % 2 > 1.7);}},
    {id: 'juggle', who: 'opus', dur: [7, 9], say: T('Juggling three deadlines. Classic.', 'أوازن ثلاثة مواعيد تسليم. كالعادة.'),
      pose(t, P) {const k = Math.floor(t * 4) % 2; P.armL = k ? 'up' : 'out'; P.armR = k ? 'out' : 'up'; P.look = [0, -1];},
      front(t, o) {for (let i = 0; i < 3; i++) {const a = t * 5 + i * 2.1; R(Math.round(o.bx + 8 + Math.cos(a) * 10), Math.round(o.by - 4 - Math.abs(Math.sin(a)) * 7), 2, 2, ['#FF6B6B', '#4CC9F0', '#FFD166'][i]);}}},
    {id: 'wipe', who: 'both', dur: [6, 7], say: T('Cleaning your screen. From the inside. You’re welcome.', 'أنظف شاشتك. من الداخل. على الرحب.'),
      pose(t, P) {P.armR = 'hold'; P.eyes = 'squint'; P.look = [1, 0];},
      front(t, o) {const x = Math.round(o.ox + 18 + Math.cos(t * 7) * 3), y = Math.round(o.oy + 2 + Math.sin(t * 7) * 2); R(x, y, 3, 3, '#8FD3FF'); P1(x, y, '#D6F1FF');},
      tick(t, st) {if (Math.random() < .12) emit({kind: 'spark', x: C.ox + 16 + Math.random() * 9, y: C.oy - 2 + Math.random() * 7, life: .5, c: '#BDEBFF'}); if (t > (st.n ??= 2)) {st.n = t + 2.5; sfx(T('squeak', 'زييييك'));}}},
    {id: 'read', who: 'both', dur: [8, 11], say: T('Reading the docs. Yes, someone actually does.', 'أقرأ التوثيق. نعم، هناك من يفعل ذلك فعلاً.'),
      pose(t, P) {P.armL = P.armR = 'fwd'; P.look = [Math.floor(t * 1.2) % 3 - 1, 1];},
      front(t, o) {book(o.ox + 4, o.oy + 5, t % 4 > 3.7);}},
    {id: 'dance', who: 'both', dur: [6, 7], say: T('Ship-it dance. Mandatory after every deploy.', 'رقصة الإطلاق. إلزامية بعد كل نشر.'),
      pose(t, P) {const k = Math.floor(t * 4) % 4; P.armL = k < 2 ? 'up' : 'out'; P.armR = k < 2 ? 'out' : 'up'; P.legs = k % 2 ? 'a' : 'b'; P.y = k % 2 ? -1 : 0; P.eyes = 'happy';},
      tick() {if (Math.random() < .1) emit({kind: 'spark', x: C.ox + rnd(-6, 24), y: C.oy + rnd(-8, 4), life: .5, c: any(['#FF6B9A', '#FFD34D', '#6EF2FF', '#B388FF'])});}},
    {id: 'paint', who: 'opus', on: 'floor', dur: [9, 11], say: T('Painting my rival, the crow. Unflattering on purpose.', 'أرسم منافسي، الغراب. بشكل غير لطيف عمداً.'),
      pose(t, P) {P.armR = frame % 3 ? 'hold' : 'reach'; P.look = [1, 0];},
      front(t, o) {easel(o.bx + 20, o.by + 9, t / 8);}},
    // the crow's own: real crow behaviour that makes no sense
    {id: 'sunbathe', who: 'crow', dur: [8, 10], say: T('I’m not dead. I’m sunbathing. Crows do this. Look it up.', 'لست ميتاً. أتشمس. الغربان تفعل هذا. ابحث عنها.'),
      pose(t, P) {P.flat = 1; P.armL = P.armR = 'spread'; P.eyes = t % 5 > 2.5 ? 'dead' : 'closed'; P.beak = 1; P.look = [0, 0];},
      front(t, o) {const x = o.bx + 26, y = o.by - 8; disc(x, y, 2, '#FFD166'); for (let i = 0; i < 8; i++) {const a = i * Math.PI / 4 + t * .5; P1(Math.round(x + Math.cos(a) * 4), Math.round(y + Math.sin(a) * 4), '#FFE08A');}}},
    {id: 'anting', who: 'crow', dur: [8, 9], say: T('Ant spa. They clean my feathers. Don’t make it weird.', 'منتجع النمل. ينظفون ريشي. لا تجعلها غريبة.'),
      pose(t, P) {P.armL = P.armR = frame % 4 < 2 ? 'fmid' : 'out'; P.eyes = 'happy';},
      front(t, o) {for (let i = 0; i < 6; i++) {const k = (t * .3 + i / 6) % 1, x = Math.round(i % 2 ? o.bx + 24 - k * 16 : o.bx - 6 + k * 16), y = Math.round(o.by + 9 - Math.sin(k * Math.PI) * (i % 3 ? 3 : 7)); P1(x, y, '#8A3522'); P1(x + 1, y, '#4A1C12');}}},
    {id: 'gift', who: 'crow', on: 'floor', dur: [7, 7.5], say: T('A gift. For you. Don’t ask where I got it.', 'هدية. لك. لا تسأل من أين حصلت عليها.'),
      start(st) {st.item = any(GIFTS);},
      pose(t, P) {if (t < 2) {P.y = frame % 2; P.look = [frame % 6 < 3 ? -1 : 1, 1];} else if (t < 3.6) P.legs = frame % 2 ? 'a' : 'b'; else P.eyes = 'happy';},
      front(t, o, st) {if (t >= 1.6 && t < 3.6) S(o.ox + 8, o.top + 6, st.item.a, st.item.p);},
      tick(t, st, dt) {
        if (t >= 2 && t < 3.6 && attention.t) {const tx = attention.x / U; if (Math.abs(tx - C.x) > 14) C.x += Math.sign(tx - C.x) * 12 * dt;}
        if (t >= 3.6 && !st.dropped) {st.dropped = 1; emit({kind: 'item', x: C.x - 1, y: C.y - st.item.a.length, art: st.item, life: 12}); sfx(T('for you', 'لك'));}
      }},
    {id: 'nut', who: 'crow', on: 'floor', dur: [9, 9], say: T('I use traffic as a nutcracker. That’s engineering.', 'أستخدم السيارات ككسارة جوز. هذه هندسة.'),
      start(st) {st.side = side(); st.nx = C.x + st.side * 16;},
      pose(t, P, st) {
        const carX = st.nx - st.side * 90 * (5.2 - t);
        if (t > 3 && t < 7 && Math.abs(carX - C.x) < 12) {P.y = -9; P.eyes = 'wide'; P.armL = P.armR = 'fup';}   // hops over the car
        else if (t > 6.6 && t < 8.4) {P.y = frame % 2; P.beak = frame % 2; P.look = [st.side, 1];}
        else P.look = t > 2.6 && t < 5.2 ? [-st.side, 0] : [st.side, 1];
      },
      front(t, o, st) {
        const nx = Math.round(st.nx), gy = o.by + 9;
        if (t < 5.2) {R(nx, gy - 2, 3, 3, '#8B5A2B'); P1(nx + 1, gy - 2, '#A9764A');}
        else if (t < 8.4) {P1(nx - 1, gy, '#8B5A2B'); P1(nx + 3, gy, '#8B5A2B'); P1(nx + 1, gy, '#E8D2A6');}
        const carX = Math.round(st.nx - st.side * 90 * (5.2 - t));
        if (carX > -20 && carX < W + 20) mirror(carX, st.side, () => car(carX, gy + 1, frame));
      }},
    {id: 'funeral', who: 'crow', on: 'floor', dur: [9, 9], say: T('A funeral for a deleted branch. Crows really do this. Show some respect.', 'جنازة لفرع محذوف. الغربان تفعل هذا فعلاً. احترم الموقف.'),
      start(st) {st.side = side();},
      pose(t, P) {P.hat = 1; P.y = t > 2 && t < 6.5 && Math.floor(t) % 2 ? 1 : 0; P.eyes = 'closed'; P.look = [0, 0];},
      back(t, o, st) {tomb(o.bx + 9 + st.side * 16 - 6, o.by + 9);},
      front(t, o, st) {
        tophat(o.ox, o.top);
        const k = Math.min(1, t / 1.5) * (t > 7.5 ? Math.max(0, 1 - (t - 7.5) / 1.2) : 1);
        if (k > 0) alpha(k, () => {const Pg = pose(); Pg.eyes = 'closed'; Pg.hat = 1; const gx = o.bx + st.side * 32; drawCrow(gx, o.by, Pg); tophat(gx, o.by);});
      }},
    {id: 'mimic', who: 'crow', dur: [7, 7.5], say: T('I can do any sound. Except silence.', 'أقلد أي صوت. إلا الصمت.'),
      start(st) {st.sounds = shuffle([...SOUNDS]).slice(0, 3);},
      pose(t, P) {P.beak = t % 2.2 < .5 ? 1 : 0; P.y = P.beak ? -1 : 0;},
      tick(t, st) {const i = Math.floor(t / 2.2); if (i < 3 && i !== st.i) {st.i = i; sfx(st.sounds[i]);}}},
    {id: 'count', who: 'crow', on: 'floor', dur: [8.4, 8.4], say: T('Crows count to five. After that it’s “many”. Like your estimates.', 'الغربان تعد إلى خمسة. بعدها "كثير". مثل تقديراتك.'),
      start(st) {st.side = side();},
      pose(t, P, st) {P.look = [st.side, 1]; P.y = t % 1.2 < .2 ? 1 : 0;},
      front(t, o, st) {const n = Math.min(5, Math.floor(t / 1.2)); for (let i = 0; i < n; i++) R(o.bx + 8 + st.side * (13 + i * 4), o.by + 8, 2, 2, '#A7A2B5');},
      tick(t, st) {const n = Math.floor(t / 1.2); if (n !== st.n && n >= 1 && n <= 6) {st.n = n; sfx(n <= 5 ? (ar ? '١٢٣٤٥'[n - 1] : String(n)) : T('…many', '…كثير'));}}},
    {id: 'grudge', who: 'crow', dur: [7, 8], say: T('I remember faces. You’re on the list. The nice list. Probably.', 'أتذكر الوجوه. أنت في القائمة. القائمة اللطيفة. غالباً.'),
      pose(t, P) {P.eyes = 'squint'; P.armR = 'hold'; P.look = lookUser();},
      front(t, o) {notebook(o.ox + 17, o.oy + 2, t);}},
    {id: 'hook', who: 'crow', on: 'floor', dur: [9.5, 9.5], say: T('I make my own tools. Some of you still can’t exit Vim.', 'أصنع أدواتي بنفسي. وبعضكم ما زال لا يعرف الخروج من Vim.'),
      start(st) {st.side = side();},
      pose(t, P, st) {P.look = [st.side, 1]; P.y = t < 3 && frame % 2 ? 1 : 0; if (t > 8.2) P.eyes = 'happy';},
      front(t, o, st) {
        const tx = o.bx + 9 + st.side * 15, gy = o.by + 9;
        alpha(.4, () => R(tx - 2, gy - 9, 5, 10, '#BFE8FF')); R(tx - 2, gy - 9, 1, 10, '#DDF3FF'); R(tx + 2, gy - 9, 1, 10, '#DDF3FF');
        if (t < 8.2) R(tx - 1, Math.round(t < 6 ? gy - 1 : gy - 1 - (t - 6) * 6), 2, 1, '#C9F27A');
        if (t < 3) line(o.bx + 9 + st.side * 4, gy, o.bx + 9 + st.side * 10, gy, '#B8BEC6');
        else {const hy = Math.round(t < 4.5 ? gy - 15 : t < 6 ? gy - 15 + (t - 4.5) / 1.5 * 12 : gy - 3 - (t - 6) * 6); line(tx, hy, tx, hy + 6, '#B8BEC6'); P1(tx + 1, hy + 6, '#B8BEC6'); P1(tx + 1, hy + 5, '#B8BEC6');}
      }},
    {id: 'cache', who: 'crow', on: 'floor', dur: [9, 9], say: T('Hiding snacks. You saw nothing. Moving them anyway.', 'أخبئ الطعام. لم ترَ شيئاً. سأنقله على أي حال.'),
      pose(t, P) {if (t < 2.5 || (t > 5 && t < 7)) {P.y = frame % 2; P.look = [0, 1];} else {P.look = [Math.floor(t * 2) % 2 ? -1 : 1, 0]; P.eyes = 'squint';}},
      front(t, o) {if (t < 1.4) R(o.bx + 7, o.by + 9, 3, 1, '#FFD166'); R(o.bx + 6, o.by + 9, 6, 1, '#6B4F35');},
      tick(t) {if ((t < 2.5 || (t > 5 && t < 7)) && Math.random() < .3) emit({kind: 'px', x: C.x + rnd(-2, 2), y: C.y - 1, vx: rnd(-20, 20), vy: rnd(-22, -8), g: 60, life: .6, c: '#7A5A3A'});}},
    {id: 'pitcher', who: 'crow', on: 'floor', dur: [9, 9], say: T('Aesop wrote a fable about me. I call it Tuesday.', 'كتب إيسوب حكاية عني. أنا أسميها يوم الثلاثاء.'),
      start(st) {st.side = side();},
      pose(t, P, st) {P.look = [st.side, 1]; if (t > 7.4) {P.y = 1; P.beak = 1;} else if (t % 1.3 < .25) P.beak = 1;},
      front(t, o, st) {
        const px = o.bx + 9 + st.side * 14, gy = o.by + 9, n = Math.min(5, Math.floor(t / 1.3)), lvl = 2 + n;
        alpha(.3, () => R(px - 3, gy - 9, 7, 10, '#BFE8FF')); R(px - 3, gy - 9, 1, 10, '#DDF3FF'); R(px + 3, gy - 9, 1, 10, '#DDF3FF'); R(px - 3, gy, 7, 1, '#DDF3FF');
        alpha(.85, () => R(px - 2, gy - lvl, 5, lvl, '#3D8BFF'));
        for (let i = 0; i < n; i++) P1(px - 2 + (i % 3) * 2, gy - 1 - Math.floor(i / 3), '#8E8A99');
      }},
    {id: 'bath', who: 'crow', on: 'floor', dur: [7, 8], say: T('Puddle bath. Five stars.', 'حمام في بركة. خمس نجوم.'),
      pose(t, P) {P.armL = P.armR = frame % 2 ? 'fup' : 'fmid'; P.eyes = 'happy';},
      back(t, o) {const gy = o.by + 9; R(o.bx - 3, gy, 24, 1, '#3D8BFF'); R(o.bx - 1, gy - 1, 20, 1, '#5FA8FF');},
      tick() {if (Math.random() < .35) emit({kind: 'px', x: C.x + rnd(-10, 10), y: C.y - 2, vx: rnd(-25, 25), vy: rnd(-30, -10), g: 80, life: .7, c: '#8EC5FF'});}},
    {id: 'hang', who: 'crow', dur: [7, 8], say: T('Upside down is my thinking position.', 'وضعية التفكير عندي: رأساً على عقب.'),
      pose(t, P) {P.eyes = t % 3 > 2.6 ? 'blink' : 'open'; P.x = Math.round(Math.sin(t * 2.4)); P.look = [0, 1];},
      self(t, o, P) {   // upside down from a pull-up bar: crows invented the gym
        const bar = o.by - 4, gy = o.by + 9;
        R(o.bx - 4, bar, 26, 1, '#9AA0A8'); R(o.bx - 4, bar, 1, gy - bar + 1, '#6B7078'); R(o.bx + 21, bar, 1, gy - bar + 1, '#6B7078');
        g.save(); g.translate(0, 2 * (o.by + 3) + 1); g.scale(1, -1); drawCrow(o.ox, o.by, P); g.restore();
      }},
    {id: 'preen', who: 'crow', dur: [6, 7], say: T('Shedding. These feathers are collectibles now.', 'أبدّل ريشي. هذا الريش صار مقتنيات.'),
      pose(t, P) {const k = t % 2 < 1; P.armL = k ? 'fmid' : 'out'; P.x = k ? -1 : 0; P.beak = frame % 3 === 0 ? 1 : 0; P.look = [-1, 1];},
      tick(t, st) {if (t > (st.n ??= .8)) {st.n = t + rnd(1.2, 2); feather(C.ox + 2, C.oy + 4);}}},
    {id: 'caw', who: 'crow', dur: [4, 4.5], say: T('Caw. That’s crow for “hire him”.', 'قاق. هذه بلغة الغربان: “وظّفوه”.'),
      pose(t, P) {P.beak = t % 1.3 < .35 ? 1 : 0; P.y = P.beak ? -1 : 0;},
      tick(t, st) {const i = Math.floor(t / 1.3); if (i !== st.i && i < 3) {st.i = i; sfx(T('caw', 'قاق'));}}},

    // ── mischief on the frames of the work ──
    {id: 'shatter', who: 'both', on: 'frame', dur: [26, 26], can: () => breakable(C.on), say: T('I broke it. I fixed it. Net zero. That’s agile.', 'كسرتها. وأصلحتها. المحصلة صفر. هذا هو الأجايل.'),
      start(st) {st.el = C.on; st.free = true; st.ph = 'perch'; st.at = 0; const r = st.el.getBoundingClientRect(); st.gl = glass(st.el); st.ix = clamp(C.x * U - r.left, 16, r.width - 16); st.iy = Math.min(36, r.height * .3);},
      tick(t, st, dt) {
        if (!st.el.isConnected) return 'done';
        const r = st.el.getBoundingClientRect(), edge = r.top / U, floor = floorU(), since = t - st.at, go = ph => {st.ph = ph; st.at = t;};
        switch (st.ph) {
          case 'perch':
            C.y = edge;
            if (t > 1.5 && !st.h1) {st.h1 = 1; st.gl.crack(st.ix, st.iy, .5); sfx(T('bonk', 'طاخ')); dust(C.x, edge, 4);}
            if (t > 2.8) {st.gl.shatter(st.ix, st.iy); sfx(T('CRASH!', 'كراااش!')); dust(C.x, edge, 10); C.on = null; st.vy = 0; go('fall');}
            break;
          case 'fall': st.vy += GRAV * dt; C.y = Math.min(floor, C.y + st.vy * dt); if (C.y >= floor) {dust(C.x, floor, 6); go('cry');} break;
          case 'cry':
            C.y = floor;
            if (Math.random() < .3) for (const ex of [5, 12]) emit({kind: 'px', x: C.ox + ex, y: C.oy + 5, vx: (ex < 9 ? -1 : 1) * rnd(4, 12), vy: rnd(-10, 0), g: 70, life: .7, c: '#6EC6FF'});
            if (since > .3 && !st.c1) {st.c1 = 1; sfx(T('waaah', 'واااااء'));}
            if (since > 1.9 && !st.c2) {st.c2 = 1; sfx(T('sniff…', 'شهق…'));}
            if (since > 3) {st.from = C.y; go('climb');}
            break;
          case 'climb': {const k = Math.min(1, since / .65); C.y = st.from + (edge - st.from) * k - Math.sin(k * Math.PI) * 16; if (k >= 1) {C.y = edge; st.gl.rebuild(); go('rebuild');}} break;
          case 'rebuild': {C.y = edge; const n = Math.floor(since / .35); if (n !== st.tap && n < 7) {st.tap = n; if (n % 2 === 0) sfx(T('tap', 'طق'));} if (since > 2.4) {st.gl.heal(); sfx(T('magic potion!', 'جرعة سحرية!')); go('potion');}} break;
          case 'potion':
            C.y = edge;
            if (Math.random() < .5) emit({kind: 'spark', x: C.ox + 19 + rnd(0, 6), y: C.oy + rnd(0, 6), vx: rnd(4, 20), vy: rnd(-6, 10), life: .7, c: any(['#C9A7FF', '#7EF2FF', '#FFE58A'])});
            if (since > 2.3) {st.gl.end(); perch(st.el, C.x); sfx(T('good as new!', 'زي الفل!')); go('proud');}
            break;
          case 'proud': C.y = edge; if (since > 1.6) return 'done';
        }
      },
      pose(t, P, st) {
        const since = t - st.at;
        switch (st.ph) {
          case 'perch':
            if (t < .7) break;   // a stare at you first
            P.look = [0, 1]; P.eyes = t > 1.5 && t < 2.2 ? 'wide' : 'squint';
            if (t > 1 && t < 1.5) P.y = -Math.round(Math.sin((t - 1) / .5 * Math.PI) * 9);
            if (t > 2.3 && t < 2.8) P.y = -Math.round(Math.sin((t - 2.3) / .5 * Math.PI) * 14);
            break;
          case 'fall': P.legs = 'dangle'; P.armL = P.armR = frame % 2 ? 'up' : 'wave'; P.eyes = 'wide'; break;
          case 'cry': P.eyes = 'closed'; P.x = frame % 2; P.armL = P.armR = 'fwd'; P.beak = 1; break;
          case 'climb': P.armL = P.armR = 'up'; P.eyes = 'squint'; break;
          case 'rebuild': P.armR = Math.floor(since / .175) % 2 ? 'up' : 'hold'; P.look = [0, 1]; P.eyes = 'squint'; break;
          case 'potion': P.armR = 'hold'; P.look = [1, 1]; P.eyes = 'happy'; break;
          case 'proud': P.armL = P.armR = 'flex'; P.eyes = 'happy'; break;
        }
      },
      front(t, o, st, P) {if (st.ph === 'rebuild') hammer(o.ox + 16, o.oy + (P.armR === 'up' ? 1 : 4), P.armR === 'up'); if (st.ph === 'potion') potion(o.ox + 17, o.oy + 1);},
      end(st) {st.gl?.end();}},
    {id: 'peek', who: 'both', on: 'frame', dur: [6.5, 6.5], say: T('Boo. Did I scare you? Be honest.', 'بخ! هل أخفتك؟ كن صريحاً.'),
      start(st) {st.free = true;},
      tick(t, st) {const r = edgeOf(); if (!r) return 'done'; C.y = r.top / U; if (t > 4 && !st.boo) {st.boo = 1; sfx(T('BOO!', 'بخ!'));}},
      pose(t, P) {if (t < 4) P.look = [Math.floor(t * 1.5) % 2 ? -1 : 1, 0]; else {P.armL = P.armR = 'up'; P.eyes = t < 4.6 ? 'wide' : 'happy'; P.sit = t > 5;}},
      self(t, o, P) {
        if (t >= 4.25) {drawChar(kind, o.ox, o.oy + (P.sit ? 2 : 0), P); return;}
        const sink = t < .8 ? 11 : t < 1.6 ? Math.round(11 - (t - .8) / .8 * 8) : t < 4 ? 3 : Math.round(3 - (t - 4) / .25 * 9), edge = o.by + 10;
        g.save(); g.beginPath(); g.rect(0, 0, W, edge); g.clip(); drawChar(kind, o.ox, o.oy + sink, P); g.restore();
      }},
    {id: 'abseil', who: 'both', on: 'frame', dur: [8, 8], can: () => edgeOf()?.height > 90, say: T('Window cleaning. Your screen had fingerprints. Yours.', 'تنظيف نوافذ. شاشتك عليها بصمات. بصماتك.'),
      start(st) {st.free = true; st.ax = C.x;},
      tick(t, st) {
        const r = edgeOf(); if (!r) return 'done';
        const top = r.top / U, span = Math.max(0, r.height / U - 14), d = t < .8 ? 0 : t < 5 ? (t - .8) / 4.2 : t < 6.8 ? 1 - (t - 5) / 1.8 : 0;
        st.top = top; C.y = top + (t < .8 || t > 6.8 ? 0 : 12 + d * span); C.x = st.ax + (t > .8 && t < 6.8 ? Math.sin(t * 2) * 2 : 0);
        if (t > .8 && t < 5 && Math.random() < .35) emit({kind: 'spark', x: C.ox + 18 + rnd(0, 4), y: C.oy + rnd(2, 7), life: .5, c: '#BDEBFF'});
        if (t > 1 && !st.s) {st.s = 1; sfx(T('squeak squeak', 'زيييك زيييك'));}
      },
      pose(t, P) {if (t > .8 && t < 6.8) {P.legs = 'dangle'; P.armL = 'up'; P.armR = Math.floor(t * 4) % 2 ? 'hold' : 'reach';}},
      back(t, o, st) {if (t > .8 && t < 6.8) line(st.ax, st.top, o.ox + 1, o.oy + 1, '#E8E2D6');},
      front(t, o, st, P) {if (t > .8 && t < 6.8) {R(o.ox + 18, o.oy + 2, 1, 5, '#2A2A2E'); R(o.ox + 17, o.oy + 4 + (P.armR === 'reach' ? 1 : 0), 3, 1, '#8B5A2B');}}},
    {id: 'graffiti', who: 'both', on: 'frame', dur: [8.5, 8.5], say: T('That wasn’t me. I was framed. Literally.', 'لم أكن أنا. تم تأطيري. حرفياً.'),
      start(st) {st.tag = any(TAGS); st.free = true; const r = C.on.getBoundingClientRect(); st.dx = clamp(C.x * U - r.left - 30, 8, Math.max(8, r.width - 60)) / U; st.dy = Math.min(10, r.height / U * .25);},
      tick(t, st) {
        const r = edgeOf(); if (!r) return 'done';
        C.y = r.top / U; st.x = r.left / U + st.dx; st.y = r.top / U + st.dy;
        if (t > 4.1 && !st.caught) {st.caught = 1; emit({kind: 'glyph', ch: '!', x: C.ox + 9, y: C.oy - 8, vy: -2, life: 1, c: '#FFD34D'});}
        if (t > 6.6 && !st.w) {st.w = 1; sfx(T('*whistles innocently*', '*يصفّر ببراءة*'));}
        if (t < 3.6 && Math.random() < .5) emit({kind: 'px', x: st.x + rnd(0, 14), y: st.y + rnd(0, 10), life: .4, c: st.tag.c});
      },
      pose(t, P) {if (t < 3.8) {P.armR = 'reach'; P.look = [1, 1];} else if (t < 4.8) P.eyes = 'wide'; else if (t < 6.4) {P.armR = Math.floor(t * 6) % 2 ? 'hold' : 'reach'; P.eyes = 'squint';} else {P.eyes = 'happy'; P.look = [0, -1];}},
      front(t, o, st) {
        const k = t < 3.6 ? t / 3.6 : t < 4.8 ? 1 : t < 6.4 ? 1 - (t - 4.8) / 1.6 : 0;
        if (k > 0 && st.x !== undefined) {const rows = st.tag.a, n = Math.ceil(rows.length * (t < 3.6 ? k : 1)); alpha(t < 3.6 ? 1 : k, () => {for (let r = 0; r < n; r++) for (let c = 0; c < rows[r].length; c++) if (rows[r][c] === '#') R(Math.round(st.x) + c * 2, Math.round(st.y) + r * 2, 2, 2, st.tag.c);});}
        if (t < 3.8) {R(o.ox + 18, o.oy + 4, 2, 4, '#D33A3A'); P1(o.ox + 18, o.oy + 3, '#F4F4F4');}
        else if (t > 4.8 && t < 6.4) R(o.ox + 17, o.oy + 5, 3, 3, '#8FD3FF');
      }},
    {id: 'fish', who: 'both', on: 'frame', dur: [9, 9], can: () => edgeOf()?.height > 70, say: T('Fishing for compliments. Biting yet?', 'أصطاد المديح. هل من صيد؟'),
      start(st) {st.catch = any(['fish', 'fish', 'boot', 'bug']);},
      pose(t, P) {P.sit = 1; P.armR = 'hold'; P.look = [1, 1]; if (t > 5.6 && t < 6.2) P.eyes = 'wide'; if (t > 6.2) {P.eyes = 'happy'; P.armR = 'up';}},
      front(t, o, st) {
        const hx = o.ox + 17, hy = o.oy + 5, tx = hx + 8, ty = hy - 9 + (t > 5.6 && t < 6.2 ? 3 : 0);
        line(hx, hy, tx, ty, '#8B5A2B');
        const depth = t < 1 ? t * 14 : 14 + Math.sin(t * 2) * 1.5, ly = t < 6.2 ? o.by + 10 + depth + (t > 5 && t < 5.6 ? 2 : 0) : o.by + 10 + depth - (t - 6.2) * 40;
        line(tx, ty, tx, Math.max(ty, ly), 'rgba(235,235,235,.8)');
        if (t < 6.2) {P1(tx, Math.round(ly), '#D33A3A'); P1(tx, Math.round(ly) + 1, '#F4F4F4');}
        else if (ly > ty - 10) {const y = Math.round(ly); if (st.catch === 'boot') S(tx - 2, y, ['bb..', 'bb..', 'bbbb'], {b: '#6B4A2A'}); else if (st.catch === 'bug') S(tx - 1, y, ['.g.', 'ggg', 'g.g'], {g: '#5BBF5B'}); else S(tx - 2, y, ['.o..', 'ooo.', 'oooo', 'ooo.', '.o..'], {o: '#FF9F43'});}
      },
      tick(t, st) {if (t > 5.6 && !st.bite) {st.bite = 1; sfx('!');} if (t > 6.6 && !st.got) {st.got = 1; sfx(st.catch === 'boot' ? T('a boot. classic.', 'جزمة. كالعادة.') : st.catch === 'bug' ? T('a bug! in production!', 'بق! في الإنتاج!') : T('got one!', 'اصطدت واحدة!'));}}},
    {id: 'corner', who: 'crow', on: 'frame', dur: [8, 8], can: () => breakable(C.on), say: T('Shiny corner. Mine now. Fine, I’ll put it back.', 'زاوية لامعة. صارت لي. حسناً، سأعيدها.'),
      start(st) {st.el = C.on; st.free = true; st.gl = glass(st.el); st.cx = (st.el.getBoundingClientRect().right - 12) / U;},
      tick(t, st, dt) {
        if (!st.el.isConnected) return 'done';
        C.y = st.el.getBoundingClientRect().top / U;
        if (t < 1.2) C.x += clamp(st.cx - C.x, -30 * dt, 30 * dt);
        if (t > 2.4 && !st.snap) {st.snap = 1; st.gl.snapCorner(); sfx(T('crack', 'طق'));}
        if (st.snap && st.gl.corner) st.gl.corner.at = t < 5.8 ? [(C.ox + 9) * U, (C.oy + 6) * U] : null;
        if (t > 6.4 && !st.back) {st.back = 1; st.gl.end(); perch(st.el, C.x); sfx(T('*innocent caw*', '*قاق بريء*'));}
      },
      pose(t, P) {if (t < 1.2) P.legs = frame % 2 ? 'a' : 'b'; else if (t < 2.4) {P.y = frame % 2; P.beak = frame % 2; P.look = [1, 1];} else if (t < 5.8) {P.eyes = 'happy'; P.look = lookUser();} else P.look = [1, 1];},
      end(st) {st.gl?.end();}},
    {id: 'seesaw', who: 'both', on: 'perch', dur: [7.5, 7.5], say: T('Physics is a suggestion.', 'الفيزياء مجرد اقتراح.'),
      start(st) {st.el = C.on; st.r = st.el.getBoundingClientRect(); st.prev = st.el.style.rotate; st.ang = 0; st.free = true;},
      tick(t, st, dt) {
        const r = st.r, cx = (r.left + r.right) / 2, goal = (t < 2.6 ? r.left + 24 : t < 5.6 ? r.right - 24 : cx) / U;
        st.walk = Math.abs(goal - C.x) > .6; C.x += clamp(goal - C.x, -24 * dt, 24 * dt);
        const want = clamp((C.x * U - cx) / (r.width / 2), -1, 1) * (t < 6.6 ? 5 : 0);
        st.ang += (want - st.ang) * Math.min(1, dt * 4);
        st.el.style.rotate = `${st.ang.toFixed(2)}deg`;
        C.y = (r.top + (C.x * U - cx) * Math.tan(st.ang * Math.PI / 180)) / U;
        if (Math.abs(st.ang) > 4 && !st.wh) {st.wh = 1; sfx(T('whoa', 'يا ساتر'));}
      },
      pose(t, P, st) {if (st.walk) P.legs = frame % 2 ? 'a' : 'b'; P.eyes = Math.abs(st.ang) > 3 ? 'wide' : 'happy';},
      end(st) {st.el.style.rotate = st.prev || ''; if (st.el.isConnected) perch(st.el, C.x);}},
    // ── mischief on titles ──
    {id: 'marker', who: 'both', on: 'title', dur: [8, 8], can: () => wordsIn(C.on, 4).length > 0, say: T('Highlighted the important part. You’re welcome.', 'ظلّلت الجزء المهم. على الرحب.'),
      start(st) {
        st.el = C.on; st.free = true; st.k = 0; st.fade = 1;
        const r0 = st.el.getBoundingClientRect(), w = wordsIn(st.el, 4).reduce((a, b) => (b.text.length > a.text.length ? b : a));
        st.w = {x: w.r.left - r0.left, y: w.r.top - r0.top, w: w.r.width, h: w.r.height};
        st.fx = fxAdd({draw: () => {
          if (st.dead || !st.el.isConnected) return false;
          const r = st.el.getBoundingClientRect(), x = r.left + st.w.x, y = r.top + st.w.y + st.w.h * .22, h = st.w.h * .66, e = st.w.w * st.k;
          fx.save(); fx.globalAlpha = .42 * st.fade; fx.fillStyle = '#FFE14D';
          fx.beginPath(); fx.moveTo(x - 4, y + 2); fx.lineTo(x + e + 4, y); fx.lineTo(x + e + 6, y + h); fx.lineTo(x - 3, y + h + 2); fx.closePath(); fx.fill(); fx.restore();
        }});
      },
      tick(t, st, dt) {
        const r = st.el.getBoundingClientRect(), wx = (r.left + st.w.x) / U, ww = st.w.w / U;
        C.y = r.top / U;
        if (t < 1.2) C.x += clamp(wx - C.x, -30 * dt, 30 * dt);
        else if (t < 3) {st.k = Math.min(1, (t - 1.2) / 1.8); C.x = wx + ww * st.k;}
        if (t > 3.1 && !st.s) {st.s = 1; sfx(T('important!', 'مهم!'));}
        if (t > 6.2) st.fade = Math.max(0, 1 - (t - 6.2) / 1.5);
      },
      pose(t, P) {P.armR = t > 1.2 && t < 3 ? 'reach' : 'out'; P.look = [1, 1]; if (t > 3) P.eyes = 'happy'; if (t > 1.2 && t < 3) P.legs = frame % 2 ? 'a' : 'b';},
      front(t, o) {if (t > 1.2 && t < 3.2) {R(o.ox + 18, o.oy + 6, 2, 4, '#FFE14D'); P1(o.ox + 18, o.oy + 10, '#2A2A2E');}},
      end(st) {st.dead = true;}},
    {id: 'laser', who: 'opus', on: 'title', dur: [7, 7], can: () => wordsIn(C.on, 3).length > 1, say: T('As you can see, this title is a title.', 'كما ترون، هذا العنوان عنوان.'),
      start(st) {
        st.el = C.on; const r0 = st.el.getBoundingClientRect();
        st.ws = wordsIn(st.el, 3).map(w => ({x: w.r.left - r0.left + w.r.width / 2, y: w.r.top - r0.top + w.r.height / 2})); st.p = {...st.ws[0]};
        st.fx = fxAdd({draw: () => {
          if (st.dead || !st.el.isConnected) return false;
          const r = st.el.getBoundingClientRect(), x = r.left + st.p.x + rnd(-1.5, 1.5), y = r.top + st.p.y + rnd(-1.5, 1.5), hx = (C.ox + 20) * U, hy = (C.oy + 4) * U;
          fx.save(); fx.strokeStyle = 'rgba(255,60,60,.25)'; fx.lineWidth = 1; fx.beginPath(); fx.moveTo(hx, hy); fx.lineTo(x, y); fx.stroke();
          const gr = fx.createRadialGradient(x, y, 0, x, y, 9); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,40,40,.95)'); gr.addColorStop(1, 'rgba(255,0,0,0)');
          fx.fillStyle = gr; fx.beginPath(); fx.arc(x, y, 9, 0, 7); fx.fill(); fx.restore();
        }});
      },
      tick(t, st, dt) {const goal = st.ws[Math.floor(t / .9) % st.ws.length]; st.p.x += (goal.x - st.p.x) * Math.min(1, dt * 8); st.p.y += (goal.y - st.p.y) * Math.min(1, dt * 8); if (t > .4 && !st.a) {st.a = 1; sfx(T('as you can see…', 'كما ترون…'));} if (t > 4.2 && !st.b) {st.b = 1; sfx(T('very important', 'مهم جداً'));}},
      pose(t, P) {P.armR = 'hold'; P.look = [1, 1];},
      front(t, o) {R(o.ox + 17, o.oy + 4, 3, 1, '#7A7F88'); P1(o.ox + 20, o.oy + 4, '#FF3B3B');},
      end(st) {st.dead = true;}},
    {id: 'stretch', who: 'both', on: 'title', dur: [6.4, 6.4], say: T('Titles are stretchy. Who knew. Me. I knew.', 'العناوين مطاطية. من كان يعرف؟ أنا. كنت أعرف.'),
      start(st) {st.el = C.on; st.prev = st.el.style.scale; st.prevO = st.el.style.transformOrigin; st.el.style.transformOrigin = 'left center'; st.free = true; st.r = st.el.getBoundingClientRect(); st.s = 1;},
      tick(t, st, dt) {
        const r = st.r, right = (r.right - 8) / U;
        if (!st.snap) C.y = r.top / U;
        if (t < 1.2) C.x += clamp(right - C.x, -30 * dt, 30 * dt);
        else if (t < 3.4) {st.s = 1 + .2 * smooth((t - 1.2) / 2.2); st.el.style.scale = `${st.s} 1`; C.x = (r.left + r.width * st.s - 8) / U;}
        else if (!st.snap) {st.snap = 1; st.fly = 0; sfx(T('boing', 'بوينغ')); st.el.style.scale = st.prev || ''; try {st.el.animate([{scale: `${st.s} 1`}, {scale: '.92 1'}, {scale: '1.04 1'}, {scale: '1 1'}], {duration: 500, easing: 'ease-out'});} catch {}}
        if (st.snap) {st.fly += dt; C.x = Math.max(r.left / U + 6, right - st.fly * 90); C.y = r.top / U - Math.sin(Math.min(1, st.fly / .6) * Math.PI) * 10;}
      },
      pose(t, P, st) {if (t < 1.2) P.legs = frame % 2 ? 'a' : 'b'; else if (!st.snap) {P.armL = P.armR = 'hold'; P.eyes = 'squint'; P.legs = frame % 3 ? 'a' : 'b';} else {P.eyes = 'wide'; P.armL = P.armR = 'up';}},
      end(st) {st.el.style.scale = st.prev || ''; st.el.style.transformOrigin = st.prevO || ''; if (st.el.isConnected) perch(st.el, C.x);}},
    // ── stealing words you have already read ──
    thief('sack', 'both', T('What words? I didn’t take any words.', 'أي كلمات؟ لم آخذ أي كلمات.'), {dur: 7.5, count: () => 3 + Math.floor(Math.random() * 3), every: 1.1,
      pose(t, P, st) {P.armR = 'hold'; P.look = [0, 1]; P.eyes = st.n >= st.max ? 'happy' : 'squint';},
      front(t, o, st) {sack(o.ox + 17, o.oy + 8, st.n);}}),
    thief('vacuum', 'opus', T('Just tidying up. Words make a mess.', 'أرتّب فقط. الكلمات تعمل فوضى.'), {dur: 7, letter: true, count: () => 8 + Math.floor(Math.random() * 5), every: .3, first: 1.1, how: 'swirl', fly: 520,
      to: () => [(C.ox + 18) * U, (C.oy - 2) * U],
      start() {sfx(T('vrrrrrr', 'فرررررر'));},
      tick(t, st) {suckAt = t < 6 ? [C.ox + 18, C.oy - 2] : null; if (Math.random() < .25) emit({kind: 'px', x: C.ox + 18 + rnd(-30, 30), y: C.oy - 2 + rnd(-20, 10), life: 2, c: '#9A958C'});},
      pose(t, P) {P.armR = 'hold'; P.look = [1, -1]; P.eyes = 'squint';},
      front(t, o) {vacuum(o.ox, o.oy, o.by + 9, t < 6);},
      end() {suckAt = null;}}),
    thief('squeegee', 'both', T('Wiped it. It was smudged. With words.', 'مسحتها. كانت متسخة. بالكلمات.'), {dur: 7, count: () => 6, every: .55, how: 'fade', fly: 500, near: () => (C.x + 4) * U,
      start(st) {const r = st.el.getBoundingClientRect(); st.a = (r.left + 20) / U; st.b = Math.min(r.right - 20, r.left + 360) / U; C.x = st.a;},
      walk(t, st) {const r = st.el.getBoundingClientRect(); C.y = r.top / U; C.x = st.a + (st.b - st.a) * clamp((t - 1) / 4.5, 0, 1);},
      tick(t) {if (t > 1 && t < 5.5 && Math.random() < .3) emit({kind: 'px', x: C.ox + 21, y: C.oy + 10, vy: 12, g: 30, life: .6, c: '#6EC6FF'}); if (t > 1.2 && t < 1.3) sfx(T('squeak', 'زييييك'));},
      pose(t, P) {P.armR = 'reach'; P.look = [1, 1]; if (t > 1 && t < 5.5) P.legs = frame % 2 ? 'a' : 'b';},
      front(t, o) {squeegee(o.ox + 20, o.oy + 7);}}),
    thief('letters', 'both', T('I only took the vowels. You weren’t using them.', 'أخذت الحروف المتحركة فقط. لم تكن تستعملها.'), {dur: 6.5, letter: true, count: () => 6 + Math.floor(Math.random() * 4), every: .5,
      start() {sfx(T('hehe', 'هيهي'));},
      pose(t, P) {P.armR = frame % 2 ? 'reach' : 'hold'; P.look = [0, 1]; P.eyes = 'squint';}}),
    thief('eraser', 'opus', T('Erased the typos. And some of the not-typos.', 'محوت الأخطاء. وبعض ما ليس أخطاء.'), {dur: 6.5, count: () => 3, every: 1.3, how: 'fade', fly: 600,
      got(st, r) {for (let i = 0; i < 6; i++) emit({kind: 'px', x: (r.left + r.width / 2) / U + rnd(-4, 4), y: (r.top + r.height / 2) / U, vx: rnd(-14, 14), vy: rnd(-10, 4), g: 60, life: .8, c: '#FF8FA3'});},
      pose(t, P) {P.armR = Math.floor(t * 8) % 2 ? 'reach' : 'hold'; P.look = [1, 1];},
      front(t, o) {eraser(o.ox + 18, o.oy + 6 + (frame % 2));}}),
    thief('magnet', 'opus', T('Words are slightly magnetic. Science.', 'الكلمات ممغنطة قليلاً. علم.'), {dur: 6.5, count: () => 4 + Math.floor(Math.random() * 2), every: .75, how: 'line', fly: 700,
      to: () => [(C.ox + 20) * U, (C.oy + 2) * U],
      got() {sfx(T('clink', 'تك'));},
      pose(t, P) {P.armR = 'hold'; P.look = [1, 1]; P.eyes = 'squint';},
      front(t, o) {magnet(o.ox + 18, o.oy + 1);}}),
    thief('rod', 'both', T('Catch and release. Mostly catch.', 'اصطد وأطلق. غالباً اصطد.'), {dur: 7, count: () => 2 + Math.floor(Math.random() * 2), every: 1.9, how: 'up', fly: 900,
      to: () => [(C.ox + 26) * U, (C.oy - 5) * U],
      pose(t, P) {P.sit = 1; P.armR = 'hold'; P.look = [1, 1];},
      front(t, o) {line(o.ox + 17, o.oy + 7, o.ox + 26, o.oy - 3, '#8B5A2B'); line(o.ox + 26, o.oy - 3, o.ox + 26, o.oy + 14 + Math.round(Math.sin(t * 3) * 2), 'rgba(235,235,235,.75)');}}),
    thief('peck', 'crow', T('Crunchy. Words are a good source of fibre.', 'مقرمشة. الكلمات مصدر جيد للألياف.'), {dur: 6.5, letter: true, count: () => 6 + Math.floor(Math.random() * 4), every: .5,
      to: () => [(C.ox + 9) * U, (C.oy + 5) * U],
      got(st) {if (st.n % 3 === 0) sfx(T('gulp', 'بلع'));},
      pose(t, P) {P.y = frame % 2; P.beak = frame % 2; P.look = [0, 1];}}),
    // buttons: it stands on the one you wanted and says no
    {id: 'guard', who: 'both', dur: [2.6, 2.6], once: true, say: T('Nope. Not this button. Try another one.', 'لا. ليس هذا الزر. جرّب غيره.'),
      start() {sfx(T('nope', 'لأ'));},
      pose(t, P) {P.armL = P.armR = 'up'; P.eyes = 'squint'; P.y = Math.floor(t * 4) % 2 ? -2 : 0; P.look = lookUser();},
      tick(t, st) {const n = Math.floor(t * 4); if (n !== st.n && n % 2 === 0 && C.on) {st.n = n; try {C.on.animate([{scale: '1 1'}, {scale: '1.05 .85'}, {scale: '1 1'}], {duration: 220});} catch {}}}},
    // X O
    {id: 'xo', who: 'both', dur: [3600, 3600], once: true, say: T('Focus. I’m winning.', 'ركّز. أنا أفوز.'),
      pose(t, P) {
        if (!xo) return;
        const b = xo.box, dx = b.left + b.size / 2 - (C.ox + 9) * U, dy = b.top + b.size / 2 - (C.oy + 3) * U;
        P.look = [Math.abs(dx) < 30 ? 0 : Math.sign(dx), dy < -40 ? -1 : dy > 40 ? 1 : 0];
        if (xo.how === 'draw' && !xo.ready) P.armR = 'reach';
        if (xo.ready && xo.busy && !xo.over) {P.armR = 'hold'; P.eyes = Math.floor(t * 2) % 2 ? 'squint' : 'open';}
        if (xo.mood === 'smug') {P.eyes = 'happy'; P.armL = P.armR = frame % 4 < 2 ? 'up' : 'out';}
        if (xo.mood === 'sad') P.eyes = 'closed';
        if (xo.mood === 'rage') {P.eyes = 'squint'; P.armL = P.armR = 'up'; P.y = frame % 2 ? -1 : 0;}
      },
      front(t, o) {if (xo) xoProps(o);}},
  ];
  // ── spells: for a few seconds a window of the work turns into something else ─────────────────
  const decos = [];
  function deco(el, html, cls = '', update) {
    const node = document.createElement('div');
    node.className = `mk-deco ${cls}`; node.innerHTML = html; node.setAttribute('aria-hidden', 'true');
    layer().append(node);
    const d = {el, node, update, r: null,
      place() {
        const r = el.getBoundingClientRect(), w = el.offsetWidth || r.width, h = el.offsetHeight || r.height;
        d.r = r;
        Object.assign(node.style, {left: `${r.left + r.width / 2 - w / 2}px`, top: `${r.top + r.height / 2 - h / 2}px`, width: `${w}px`, height: `${h}px`, rotate: el.style.rotate || ''});
        update?.(d);
      },
      end() {const i = decos.indexOf(d); if (i >= 0) decos.splice(i, 1); node.classList.add('is-out'); setTimeout(() => node.remove(), 500);}};
    d.place(); decos.push(d);
    return d;
  }
  function restyle(el, props) {
    const keys = [...Object.keys(props), 'transition'], prev = Object.fromEntries(keys.map(k => [k, el.style[k]]));
    el.style.transition = 'filter .6s ease, clip-path .7s ease, scale .6s ease, rotate .6s ease, opacity .6s ease';
    requestAnimationFrame(() => Object.assign(el.style, props));
    return () => {for (const k of Object.keys(props)) el.style[k] = prev[k]; setTimeout(() => {el.style.transition = prev.transition;}, 750);};
  }
  // clip-path animates only between shapes with the same number of points
  function morph(el, from, to, extra = {}) {
    const prev = {clipPath: el.style.clipPath, transition: el.style.transition, filter: el.style.filter};
    el.style.transition = 'clip-path .8s cubic-bezier(.2,.8,.2,1), filter .6s ease'; el.style.clipPath = from;
    void el.offsetWidth;
    requestAnimationFrame(() => {el.style.clipPath = to; Object.assign(el.style, extra);});
    return () => {el.style.clipPath = from; el.style.filter = prev.filter; setTimeout(() => {el.style.clipPath = prev.clipPath; el.style.transition = prev.transition;}, 820);};
  }
  const critters = [];
  function critter(el, draw) {const c = {el, t0: performance.now(), draw}; critters.push(c); return () => {const i = critters.indexOf(c); if (i >= 0) critters.splice(i, 1);};}
  const SPRITES = {
    bat: [['k.....k', 'kk.k.kk', '.krkrk.', '..k.k..'], ['.......', 'k.kkk.k', 'kkrkrkk', '..k.k..']],
    dove: [['..ww...', 'wwwwww.', '.wwwwwy', '..w.w..'], ['ww.....', '.wwwww.', '..wwwwy', '..w.w..']],
  };
  const critPal = k => (k === 'bat' ? {k: '#5A4688', r: '#FF5C5C'} : {w: root.dataset.siteMode === 'white' ? '#C9D6EA' : '#FFFFFF', y: '#FFB347'});
  const CAT = ['.o......o.', 'oo......oo', 'oooooooooo', 'okoooooko.', 'oooopoooo.', '.oooooooo.', 'oooooooooo', 'ossoossooo', '.oo....oo.'];
  const CATPAL = {o: '#F2A65A', s: '#D9823B', k: '#2A1D10', p: '#FF8FA3'};
  function fxNoise(el, ms = 650) {
    const n = document.createElement('canvas'); n.width = 80; n.height = 45;
    const nx = n.getContext('2d'), img = nx.createImageData(80, 45), t0 = performance.now();
    fxAdd({draw: now => {
      const k = (now - t0) / ms; if (k > 1) return false;
      for (let i = 0; i < img.data.length; i += 4) {const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;}
      nx.putImageData(img, 0, 0);
      const r = el.getBoundingClientRect(); fx.save(); fx.globalAlpha = (1 - k) * .85; fx.imageSmoothingEnabled = false; fx.drawImage(n, r.left, r.top, r.width, r.height); fx.restore();
    }});
  }
  // a small copy of the frame's picture, sampled into a grid of colours
  function sample(el, cols) {
    const r0 = el.getBoundingClientRect(); fxOn(); const tex = snapshot(el, r0);
    const rows = Math.max(6, Math.round(cols * r0.height / r0.width)), c = document.createElement('canvas'); c.width = cols; c.height = rows;
    const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(tex, 0, 0, cols, rows);
    let data = null; try {data = x.getImageData(0, 0, cols, rows).data;} catch {}
    return {r0, tex, cols, rows, small: c, at: (u, v) => {if (!data) return [200, 190, 170]; const px = Math.min(cols - 1, Math.floor(u * cols)), py = Math.min(rows - 1, Math.floor(v * rows)), i = (py * cols + px) * 4; return [data[i], data[i + 1], data[i + 2]];}};
  }
  function stainedGlass(el) {
    const sm = sample(el, 40), shards = makeShards(sm.r0.width, sm.r0.height, sm.r0.width / 2, sm.r0.height / 2);
    const GLASS = [[200, 16, 46], [31, 79, 191], [30, 140, 78], [242, 169, 0], [123, 63, 191], [224, 95, 160], [0, 150, 170]];
    for (const p of shards) {const c = sm.at(p.hx / sm.r0.width, p.hy / sm.r0.height), k = .6 + .7 * (c[0] * .3 + c[1] * .59 + c[2] * .11) / 255; p.fill = `rgb(${any(GLASS).map(v => Math.round(clamp(v * k, 0, 255))).join(',')})`;}
    const e = fxAdd({k: 0, draw: (now, dt) => {
      if (e.done) return false;
      e.k = Math.min(1, e.k + dt * 1.6);
      const r = el.getBoundingClientRect();
      fx.save(); fx.globalAlpha = e.k;
      for (const p of shards) {fx.beginPath(); p.pts.forEach(([x, y], i) => (i ? fx.lineTo(r.left + p.hx + x, r.top + p.hy + y) : fx.moveTo(r.left + p.hx + x, r.top + p.hy + y))); fx.closePath(); fx.fillStyle = p.fill; fx.fill(); fx.lineWidth = 3; fx.strokeStyle = '#1d1a16'; fx.stroke();}
      const gl = fx.createRadialGradient(r.left + r.width * .5, r.top, 0, r.left + r.width * .5, r.top, r.width); gl.addColorStop(0, 'rgba(255,250,220,.4)'); gl.addColorStop(1, 'rgba(255,250,220,0)');
      fx.fillStyle = gl; fx.fillRect(r.left, r.top, r.width, r.height); fx.restore();
    }});
    return () => {e.done = true;};
  }
  function constellation(el) {
    const sm = sample(el, 32); let pts = [];
    for (let y = 0; y < sm.rows; y++) for (let x = 0; x < sm.cols; x++) {const c = sm.at((x + .5) / sm.cols, (y + .5) / sm.rows); pts.push({x: (x + .5) / sm.cols, y: (y + .5) / sm.rows, v: c[0] + c[1] + c[2] + Math.random() * 40});}
    pts = pts.sort((a, b) => b.v - a.v).slice(0, 22);
    const links = pts.map((p, i) => {let best = -1, bd = 9; pts.forEach((q, j) => {if (j <= i) return; const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < bd) {bd = d; best = j;}}); return best;});
    const undo = restyle(el, {filter: 'brightness(.28) saturate(.6) hue-rotate(190deg)'});
    const e = fxAdd({t: 0, draw: (now, dt) => {
      if (e.done) return false;
      e.t += dt; const r = el.getBoundingClientRect(), k = Math.min(1, e.t / 1.2);
      fx.save(); fx.strokeStyle = 'rgba(190,210,255,.5)'; fx.lineWidth = 1;
      pts.forEach((p, i) => {const j = links[i]; if (j >= 0 && i / pts.length < k) {const q = pts[j]; fx.beginPath(); fx.moveTo(r.left + p.x * r.width, r.top + p.y * r.height); fx.lineTo(r.left + q.x * r.width, r.top + q.y * r.height); fx.stroke();}});
      fx.restore();
      pts.forEach((p, i) => star(r.left + p.x * r.width, r.top + p.y * r.height, (3 + (i % 3)) * (.75 + .25 * Math.sin(e.t * 3 + i)), '#ffffff', Math.min(1, k * 1.5)));
    }});
    return () => {e.done = true; undo();};
  }
  function pixelate(el) {
    const sm = sample(el, 28);
    const e = fxAdd({k: 0, draw: (now, dt) => {if (e.done) return false; e.k = Math.min(1, e.k + dt * 3); const r = el.getBoundingClientRect(); fx.save(); fx.imageSmoothingEnabled = false; fx.globalAlpha = e.k; fx.drawImage(sm.small, r.left, r.top, r.width, r.height); fx.restore();}});
    return () => {e.done = true;};
  }
  const starburst = () => Array.from({length: 32}, (_, i) => {const a = i / 32 * Math.PI * 2, r = i % 2 ? 26 : 48; return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`;}).join(' ');
  const webSvg = () => {const A = [0, 18, 36, 54, 72, 90].map(a => a * Math.PI / 180); return A.map(a => `<line x1="0" y1="0" x2="${(Math.cos(a) * 40).toFixed(1)}" y2="${(Math.sin(a) * 40).toFixed(1)}"/>`).join('') + [12, 22, 32].map(r => `<polyline points="${A.map(a => `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`).join(' ')}"/>`).join('');};
  const WING_SVG = '<path d="M58 6 C34 10 10 26 4 52 C14 46 22 44 28 46 C18 54 12 64 12 76 C22 66 30 62 38 62 C32 70 30 78 32 88 C42 76 50 60 56 40 Z"/><path d="M50 18 C38 26 26 38 20 50 M46 34 C36 44 30 54 26 64" fill="none"/>';
  const nameOf = el => (el.closest('[data-film]')?.querySelector('.nf-card-name') || el.closest('a,article,li')?.querySelector('h2,h3,b,.nf-card-name'))?.textContent?.trim() || '';
  const flock2 = (el, kind2, n) => {const r = el.getBoundingClientRect(), cx = (r.left + r.width / 2) / U, cy = (r.top + r.height / 2) / U; for (let i = 0; i < n; i++) {const an = kind2 === 'dove' ? rnd(-Math.PI * .85, -Math.PI * .15) : rnd(-Math.PI, 0) + rnd(-.3, .3); emit({kind: 'sprite', frames: SPRITES[kind2], pal: critPal(kind2), x: cx + rnd(-8, 8), y: cy + rnd(-4, 4), vx: Math.cos(an) * rnd(30, 70), vy: Math.sin(an) * rnd(30, 60), life: rnd(2, 3.2), ph: Math.floor(rnd(0, 4))});}};
  const camoSvg = () => {const tones = ['#4B5320', '#6B7A3A', '#3A3326', '#8A8455']; let out = ''; for (let i = 0; i < 26; i++) out += `<ellipse cx="${rnd(0, 100).toFixed(1)}" cy="${rnd(0, 100).toFixed(1)}" rx="${rnd(8, 22).toFixed(1)}" ry="${rnd(5, 14).toFixed(1)}" fill="${any(tones)}" transform="rotate(${rnd(-40, 40).toFixed(0)} 50 50)"/>`; return `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${out}</svg>`;};
  const CHEST = ['.kkkkkkkkkk.', 'kbbbbbbbbbbk', 'kkkkkyykkkkk', 'kbbbbyybbbbk', 'kbbbbbbbbbbk', 'kkkkkkkkkkkk'];
  const CHEST_PAL = {k: '#3B2414', b: '#8B5A2B', y: '#FFD34D'};
  const burst = (word, fill = '#ffd400') => `<svg viewBox="0 0 100 100"><polygon points="${starburst()}" fill="${fill}" stroke="#111" stroke-width="3"/><text x="50" y="58" text-anchor="middle">${word}</text></svg>`;
  const undoAll = (...fns) => () => fns.forEach(fn => safe(() => fn?.()));
  const loopAnim = (el, frames, opts) => safe(() => el.animate(frames, {iterations: Infinity, composite: 'add', ...opts}));
  const SPELL_PACKS = {
    // the everyday site: the cinema it already is
    studio: [
      {id: 'tv', name: T('Channel 3', 'القناة ٣'), cast(el) {const a = restyle(el, {filter: 'contrast(1.25) saturate(.55) sepia(.3) brightness(.95)'}), d = deco(el, '<i class="bezel"></i><i class="lines"></i><span class="lbl">CH 03</span>', 'is-tv'); fxNoise(el); return () => {a(); d.end();};}},
      {id: 'reel', name: T('Rolling!', 'تصوير!'), cast(el) {const a = restyle(el, {filter: 'sepia(.85) contrast(1.15) brightness(.95)'}), d = deco(el, '<i class="strip l"></i><i class="strip r"></i><i class="scr"></i>', 'is-reel'); return () => {a(); d.end();};}},
      {id: 'polaroid', name: T('Say cheese', 'ابتسم'), cast(el) {const a = restyle(el, {rotate: `${any([-3, 3, -2, 2])}deg`, filter: 'saturate(.8) contrast(1.05) sepia(.15)'}), d = deco(el, '<i class="frame"></i><span class="cap"></span>', 'is-pola'); d.node.querySelector('.cap').textContent = any(['#throwback', '#mood', 'best day ever', '10/10, would ship again']); return () => {a(); d.end();};}},
      {id: 'marquee', name: T('Now showing', 'يُعرض الآن'), cast(el) {const d = deco(el, `<i class="b1"></i><i class="b2"></i><span class="sign">${T('NOW SHOWING', 'يُعرض الآن')}</span>`, 'is-marquee'); return () => d.end();}},
      {id: 'comic', name: 'POW!', cast(el) {const a = restyle(el, {filter: 'contrast(1.45) saturate(1.5)'}), d = deco(el, `<i class="dots"></i><i class="ink"></i><svg class="pow" viewBox="0 0 100 100"><polygon points="${starburst()}" fill="#ffd400" stroke="#111" stroke-width="3"/><text x="50" y="58" text-anchor="middle">POW!</text></svg>`, 'is-comic'); return () => {a(); d.end();};}},
      {id: 'vhs', name: T('Be kind, rewind', 'رجّع الشريط'), cast(el) {const a = restyle(el, {filter: 'saturate(1.7) contrast(1.1) drop-shadow(3px 0 0 rgba(255,0,60,.55)) drop-shadow(-3px 0 0 rgba(0,220,255,.55))'}), d = deco(el, '<i class="track"></i><span class="lbl osd">PLAY ▶</span><span class="lbl date">OCT 04 2026</span>', 'is-vhs'); return () => {a(); d.end();};}},
      {id: 'thermal', name: T('Heat vision', 'رؤية حرارية'), cast(el) {const a = restyle(el, {filter: 'grayscale(1) invert(1) sepia(1) saturate(6) hue-rotate(170deg) contrast(1.3)'}), d = deco(el, '<i class="cross"></i><span class="lbl">THERMAL · 36.6°</span>', 'is-thermal'); return () => {a(); d.end();};}},
      {id: 'pixel', name: T('8-bit mode', 'وضع ٨ بت'), cast: pixelate},
      {id: 'spotlight', name: T('Spotlight', 'تحت الأضواء'), cast(el) {
        const node = document.createElement('div'); node.className = 'mk-spot'; layer().append(node);
        const d = {el, node, place() {const r = el.getBoundingClientRect(); node.style.background = `radial-gradient(ellipse ${Math.round(r.width * .75)}px ${Math.round(r.height * .85)}px at ${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px, transparent 60%, rgba(0,0,0,.78) 100%)`;}, end() {const i = decos.indexOf(d); if (i >= 0) decos.splice(i, 1); node.classList.add('is-out'); setTimeout(() => node.remove(), 500);}};
        d.place(); decos.push(d); return () => d.end();
      }},
      {id: 'popcorn', name: T('Popcorn time', 'وقت الفشار'), cast(el) {let on = true; const rain = () => {if (!on) return; const r = el.getBoundingClientRect(); for (let i = 0; i < 2; i++) emit({kind: 'px', x: (r.left + Math.random() * r.width) / U, y: (r.top - 30) / U, vy: rnd(20, 40), g: 30, life: 1.6, c: any(['#FFF1B8', '#FFE08A', '#FFFFFF']), s: 2}); setTimeout(rain, 90);}; rain(); return () => {on = false;};}},
    ],
    // Halloween: the witch curses the work
    halloween: [
      {id: 'coffin', name: T('Coffin curse!', 'لعنة التابوت!'), cast(el) {const a = morph(el, 'polygon(0% 0%, 100% 0%, 100% 24%, 100% 100%, 0% 100%, 0% 24%)', 'polygon(28% 0%, 72% 0%, 100% 24%, 82% 100%, 18% 100%, 0% 24%)', {filter: 'grayscale(.75) brightness(.75) contrast(1.15)'}), d = deco(el, '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="28,0 72,0 100,24 82,100 18,100 0,24"/></svg><span class="rip">R.I.P.</span>', 'is-coffin'); return () => {a(); d.end();};}},
      {id: 'haunted', name: T('It’s watching you', 'إنها تراقبك'), cast(el) {
        const a = restyle(el, {filter: 'grayscale(1) contrast(1.35) brightness(.6) sepia(.25)'});
        const d = deco(el, '<i class="vig"></i><i class="eye"></i><i class="eye"></i>', 'is-haunt', dd => {const r = dd.r, [e1, e2] = dd.node.querySelectorAll('.eye'), ax = attention.t ? clamp((attention.x - (r.left + r.width / 2)) / r.width, -.5, .5) : 0, ay = attention.t ? clamp((attention.y - (r.top + r.height * .35)) / r.height, -.5, .5) : 0; for (const [e, cx] of [[e1, .4], [e2, .6]]) {e.style.left = `${(cx + ax * .05) * 100}%`; e.style.top = `${(.34 + ay * .05) * 100}%`;}});
        return () => {a(); d.end();};
      }},
      {id: 'cobweb', name: T('Abandoned since 1999', 'مهجورة منذ ١٩٩٩'), cast(el) {const d = deco(el, `<svg class="web tl" viewBox="0 0 40 40">${webSvg()}</svg><svg class="web br" viewBox="0 0 40 40">${webSvg()}</svg><i class="thread"><b class="spider"></b></i>`, 'is-web'); return () => d.end();}},
      {id: 'pumpkin', name: T('Pumpkin head!', 'رأس يقطين!'), cast(el) {const a = restyle(el, {filter: 'sepia(1) saturate(4.5) hue-rotate(-12deg) brightness(.8) contrast(1.15)'}), d = deco(el, '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="24,32 38,32 31,18"/><polygon points="62,32 76,32 69,18"/><polygon points="45,46 55,46 50,37"/><path d="M20 58 L29 67 L35 60 L42 69 L50 61 L58 69 L65 60 L71 67 L80 58 L73 78 L27 78 Z"/></svg>', 'is-pumpkin'); return () => {a(); d.end();};}},
      {id: 'bats', name: T('Bats!', 'خفافيش!'), cast(el) {const a = restyle(el, {filter: 'brightness(.35) saturate(.6)'}); flock2(el, 'bat', 14); return a;}},
      {id: 'slime', name: T('Ectoplasm', 'مادة شبحية'), cast(el) {const drips = Array.from({length: 7}, (_, i) => {const x = 7 + i * 14 + rnd(-4, 4), w = rnd(4, 8), h = rnd(18, 46); return `<path d="M${(x - w).toFixed(1)} 0 Q${(x - w).toFixed(1)} ${(h * .6).toFixed(1)} ${x.toFixed(1)} ${h.toFixed(1)} Q${(x + w).toFixed(1)} ${(h * .6).toFixed(1)} ${(x + w).toFixed(1)} 0 Z" style="animation-delay:${rnd(0, .8).toFixed(2)}s"/>`;}).join(''); const d = deco(el, `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="0" y="0" width="100" height="5"/>${drips}</svg>`, 'is-slime'); return () => d.end();}},
      {id: 'ghost', name: T('Boooo', 'بوووو'), cast(el) {const a = restyle(el, {filter: 'grayscale(1) invert(1) brightness(1.1) opacity(.72)'}), bob = safe(() => el.animate([{translate: '0 0'}, {translate: '0 -10px'}, {translate: '0 0'}], {duration: 1600, iterations: Infinity, easing: 'ease-in-out', composite: 'add'})), d = deco(el, '<svg class="gface" viewBox="0 0 100 100"><ellipse cx="38" cy="40" rx="6" ry="9"/><ellipse cx="62" cy="40" rx="6" ry="9"/><ellipse cx="50" cy="66" rx="7" ry="9"/></svg>', 'is-ghost'); return () => {a(); d.end(); bob?.cancel?.();};}},
      {id: 'tomb', name: T('Rest in pixels', 'ارقد بسلام يا بكسل'), cast(el) {const a = morph(el, 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', 'inset(0% 7% 0% 7% round 46% 46% 6px 6px)', {filter: 'grayscale(1) brightness(.62) contrast(1.25)'}), d = deco(el, '<span class="epitaph">R.I.P.<small></small></span><i class="grass"></i>', 'is-tomb'); d.node.querySelector('small').textContent = nameOf(el) || '2026'; return () => {a(); d.end();};}},
      {id: 'cauldron', name: T('Double, double…', 'غليان وفقاعات…'), cast(el) {const a = restyle(el, {filter: 'hue-rotate(70deg) saturate(1.3)'}), d = deco(el, '<i class="brew"></i><i class="bub"></i><i class="bub"></i><i class="bub"></i><i class="bub"></i>', 'is-brew'); return () => {a(); d.end();};}},
      {id: 'zombie', name: T('Braaains', 'أدمغة…'), cast(el) {
        const r0 = el.getBoundingClientRect(), fx0 = rnd(.3, .7); shake(el, 8);
        return critter(el, (t, r) => {
          const gy = Math.round(r.bottom / U) - 1, x = Math.round((r.left + r.width * fx0) / U), up = Math.min(1, t / .7) * (t > 6.6 ? Math.max(0, 1 - (t - 6.6) / .6) : 1), h = Math.round(up * 13); if (h <= 0) return;
          R(x - 2, gy - h, 5, h, '#7FA36B'); R(x - 2, gy - h + 4, 5, 3, '#4A3B5C');
          const wave = Math.floor(t * 6) % 2;
          R(x - 3, gy - h - 4, 7, 4, '#8FB57A'); for (let i = 0; i < 4; i++) R(x - 3 + i * 2, gy - h - 7 - ((i + wave) % 2), 1, 3, '#8FB57A');
          if (t < 1) for (let i = 0; i < 2; i++) P1(x + Math.round(rnd(-6, 6)), gy - Math.round(rnd(0, 3)), '#6B4F35');
        });
      }},
      {id: 'moon', name: T('Blood moon', 'قمر دموي'), cast(el) {const a = restyle(el, {filter: 'sepia(1) saturate(5) hue-rotate(-38deg) brightness(.7) contrast(1.2)'}), d = deco(el, '<i class="moon"></i><i class="fog"></i>', 'is-moon'); flock2(el, 'bat', 5); return () => {a(); d.end();};}},
    ],
    // Heaven: the fairy blesses the work (sometimes with a cat)
    heaven: [
      {id: 'stained', name: T('Stained glass', 'زجاج معشّق'), cast: stainedGlass},
      {id: 'angel', name: T('Angel mode', 'وضع الملاك'), cast(el) {const float = safe(() => el.animate([{translate: '0 0'}, {translate: '0 -8px'}, {translate: '0 0'}], {duration: 2400, iterations: Infinity, easing: 'ease-in-out', composite: 'add'})), d = deco(el, `<i class="halo"></i><svg class="wing l" viewBox="0 0 60 92">${WING_SVG}</svg><svg class="wing r" viewBox="0 0 60 92"><g transform="translate(60 0) scale(-1 1)">${WING_SVG}</g></svg>`, 'is-angel'); return () => {float?.cancel?.(); d.end();};}},
      {id: 'clouds', name: T('Cloud nine', 'فوق السحاب'), cast(el) {const a = restyle(el, {filter: 'brightness(1.08) saturate(.9)'}), d = deco(el, '<i class="c c1"></i><i class="c c2"></i><i class="c c3"></i>', 'is-cloud'); return () => {a(); d.end();};}},
      {id: 'rainbow', name: T('Rainbow!', 'قوس قزح!'), cast(el) {const d = deco(el, `<svg class="bow" viewBox="0 0 200 100">${['#ff4d4d', '#ff9f1c', '#ffe14d', '#4dd06a', '#3fa7ff', '#7a5cff'].map((c, i) => `<path d="M${10 + i * 7} 100 A ${90 - i * 7} ${90 - i * 7} 0 0 1 ${190 - i * 7} 100" stroke="${c}"/>`).join('')}</svg>`, 'is-rainbow'); return () => d.end();}},
      {id: 'gold', name: T('Framed in gold', 'إطار من ذهب'), cast(el) {const a = restyle(el, {filter: 'brightness(1.08) saturate(1.12)'}), d = deco(el, '<i class="rays"></i><i class="frame"></i>', 'is-gold'); return () => {a(); d.end();};}},
      {id: 'doves', name: T('Coo', 'هديل'), cast(el) {flock2(el, 'dove', 9); const a = restyle(el, {filter: 'brightness(1.15)'}); return a;}},
      {id: 'cat', name: T('A cat. Obviously.', 'قطة. طبعاً.'), cast(el) {
        const at = rnd(.25, .75);
        return critter(el, (t, r) => {
          const x = Math.round((r.left + r.width * at) / U) - 5, y = Math.round(r.top / U) - 9;
          S(x, y, CAT, CATPAL);
          const sw = Math.round(Math.sin(t * 3) * 2); P1(x + 10, y + 6 + sw, CATPAL.o); P1(x + 11, y + 5 + sw, CATPAL.o); P1(x + 12, y + 4 + sw, CATPAL.s);
          if (Math.floor(t * 1.2) % 3 === 0 && t % .8 < .05) emit({kind: 'glyph', ch: 'z', x: x + 8, y: y - 3, vx: 3, vy: -5, life: 1.6, c: '#FFD7A8'});
        });
      }},
      {id: 'catbox', name: T('If it fits, it sits', 'إذا وسعتها جلست فيها'), cast(el) {
        const d = deco(el, '<i class="side"></i><i class="tape"></i><i class="flap fl"></i><i class="flap fr"></i>', 'is-box'), at = rnd(.35, .65);
        const c = critter(el, (t, r) => {const x = Math.round((r.left + r.width * at) / U) - 5, y = Math.round((r.top + r.height * .4) / U) - 4 - Math.round(Math.min(1, t / .6) * 2); g.save(); g.beginPath(); g.rect(0, 0, W, Math.round((r.top + r.height * .4) / U)); g.clip(); S(x, y, CAT.slice(0, 6), CATPAL); g.restore();});
        return () => {d.end(); c();};
      }},
      {id: 'bloom', name: T('Spring!', 'ربيع!'), cast(el) {
        const spots = Array.from({length: 7}, () => ({u: Math.random(), h: rnd(6, 13), c: any(['#FF8FAB', '#FFD166', '#B388FF', '#7EE0FF', '#FFFFFF'])}));
        return critter(el, (t, r) => {const gy = Math.round(r.bottom / U) - 1; for (const s of spots) {const x = Math.round((r.left + r.width * s.u) / U), h = Math.round(s.h * Math.min(1, t / 1.4)); R(x, gy - h, 1, h, '#4FAF5A'); if (t > 1.2) {for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) P1(x + dx, gy - h - 1 + dy, s.c); P1(x, gy - h - 1, '#FFE066');}}});
      }},
      {id: 'stars', name: T('Written in the stars', 'مكتوب في النجوم'), cast: constellation},
      {id: 'bubble', name: T('Bubble wrap', 'فقاعة حماية'), cast(el) {const float = safe(() => el.animate([{translate: '0 0'}, {translate: '0 -6px'}, {translate: '0 0'}], {duration: 2600, iterations: Infinity, easing: 'ease-in-out', composite: 'add'})), d = deco(el, '<i class="b"></i>', 'is-bubble'); return () => {float?.cancel?.(); d.end();};}},
    ],
    // RGB Overdrive: the gamer edition
    rgb: [
      {id: 'rgbring', name: T('RGB sync', 'مزامنة RGB'), cast(el) {const a = restyle(el, {filter: 'saturate(1.45) contrast(1.08)'}), d = deco(el, '<i class="ring"></i>', 'is-rgbring'); return undoAll(a, () => d.end());}},
      {id: 'levelup', name: T('Level up!', 'ارتقاء!'), cast(el) {
        const d = deco(el, `<span class="lvl">${T('LEVEL UP!', 'ارتقيت!')}</span>`, 'is-lvl'), an = safe(() => el.animate([{scale: '1'}, {scale: '1.06'}, {scale: '1'}], {duration: 650, iterations: 3, composite: 'add'}));
        const r = el.getBoundingClientRect(); for (let i = 0; i < 24; i++) emit({kind: 'spark', x: (r.left + Math.random() * r.width) / U, y: r.bottom / U, vy: -rnd(20, 60), life: 1.4, c: any(['#FFE066', '#FFB300', '#FFFFFF'])});
        return undoAll(() => d.end(), () => an?.cancel?.());
      }},
      {id: 'xp', name: '+XP', cast(el) {const d = deco(el, ['+100 XP', '+50 XP', '+250 XP', T('CRIT!', 'ضربة!'), '+10 XP', '+500 XP'].map((s, i) => `<span class="xp" style="--x:${4 + i * 15}%;--d:${(i * .37).toFixed(2)}s">${s}</span>`).join(''), 'is-xp'); return () => d.end();}},
      {id: 'hp', name: T('Low HP!', 'الصحة منخفضة!'), cast(el) {const d = deco(el, '<span class="hpl">HP</span><span class="hp"><i></i></span>', 'is-hp'); shake(el, 7); const tm = setInterval(() => shake(el, 6), 5000); return undoAll(() => d.end(), () => clearInterval(tm));}},
      {id: 'glitch', name: T('Glitch', 'خلل'), cast(el) {
        const a = restyle(el, {filter: 'drop-shadow(5px 0 0 rgba(255,0,80,.7)) drop-shadow(-5px 0 0 rgba(0,240,255,.7)) saturate(1.5)'});
        const an = loopAnim(el, [{translate: '0 0'}, {translate: '-7px 1px'}, {translate: '5px -1px'}, {translate: '0 0'}], {duration: 360, easing: 'steps(2)'});
        const d = deco(el, Array.from({length: 5}, (_, i) => `<i class="sl" style="--y:${rnd(5, 88).toFixed(0)}%;--d:-${(i * .09).toFixed(2)}s"></i>`).join(''), 'is-glitch');
        return undoAll(a, () => d.end(), () => an?.cancel?.());
      }},
      {id: 'achievement', name: T('Achievement!', 'إنجاز!'), cast(el) {
        const d = deco(el, '<span class="ach"><i>🏆</i><b></b><small></small></span>', 'is-ach');
        d.node.querySelector('b').textContent = T('Achievement unlocked', 'تم فتح إنجاز');
        d.node.querySelector('small').textContent = any([T('Stared at a project for 10 s', 'حدّقت في مشروع ١٠ ثوانٍ'), T('Found the companion', 'وجدت الرفيق'), T('Scrolled like a pro', 'تمرير احترافي'), T('Hovered with intent', 'مرّرت عن قصد')]);
        return () => d.end();
      }},
      {id: 'loot', name: T('Loot!', 'غنيمة!'), cast(el) {
        const at = rnd(.3, .7);
        return critter(el, (t, r) => {
          const x = Math.round((r.left + r.width * at) / U) - 6, y = Math.round(r.top / U) - 6, open = t > 1;
          if (open) alpha(.45 + .3 * Math.sin(t * 6), () => disc(x + 6, y - 1, 5, '#FFE066'));
          S(x, y - (open ? 3 : 0), CHEST.slice(0, 2), CHEST_PAL); S(x, y + 2, CHEST.slice(2), CHEST_PAL);
          if (open && Math.random() < .35) emit({kind: 'px', x: x + 6, y: y - 2, vx: rnd(-20, 20), vy: -rnd(30, 55), g: 90, life: 1, c: any(['#FFD34D', '#FFE066', '#FFFFFF']), s: 1});
        });
      }},
      {id: 'wasd', name: 'WASD', cast(el) {const d = deco(el, `<span class="keys">${['W', 'A', 'S', 'D'].map((k, i) => `<b style="--d:${(i * .4).toFixed(1)}s">${k}</b>`).join('')}</span>`, 'is-wasd'), an = loopAnim(el, [{translate: '0 -6px'}, {translate: '-6px 0'}, {translate: '0 6px'}, {translate: '6px 0'}, {translate: '0 -6px'}], {duration: 1600, easing: 'ease-in-out'}); return undoAll(() => d.end(), () => an?.cancel?.());}},
      {id: 'speedrun', name: T('Speedrun', 'سباق سرعة'), cast(el) {
        const t0 = performance.now(), d = deco(el, '<span class="sr"><b>0:00.00</b><small></small></span>', 'is-run', dd => {const s = (performance.now() - t0) / 1000; dd.node.querySelector('b').textContent = `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;});
        d.node.querySelector('small').textContent = any([T('World-record pace', 'وتيرة رقم قياسي'), T('Personal best pace', 'أفضل وتيرة شخصية'), T('−0.42 ahead', 'متقدم ٠٫٤٢')]);
        return () => d.end();
      }},
      {id: 'gg', name: 'GG', cast(el) {const an = safe(() => el.animate([{filter: 'hue-rotate(0deg) saturate(1.6)'}, {filter: 'hue-rotate(360deg) saturate(1.6)'}], {duration: 2200, iterations: Infinity})), d = deco(el, '<span class="gg">GG</span>', 'is-gg'); return undoAll(() => d.end(), () => an?.cancel?.());}},
    ],
    // Night Ops: the tactical edition
    tactical: [
      {id: 'nvg', name: T('Night vision', 'رؤية ليلية'), cast(el) {const a = restyle(el, {filter: 'grayscale(1) sepia(1) hue-rotate(52deg) saturate(4.5) brightness(1.15) contrast(1.25)'}), d = deco(el, '<i class="scan"></i><i class="vig"></i><span class="lbl">NV · 2</span>', 'is-nvg'); return undoAll(a, () => d.end());}},
      {id: 'scope', name: T('Scope', 'منظار'), cast(el) {
        const r0 = el.getBoundingClientRect(), rad = Math.min(r0.width, r0.height) / 2;
        const a = morph(el, `circle(${Math.ceil(Math.hypot(r0.width, r0.height) / 2)}px at 50% 50%)`, `circle(${Math.floor(rad)}px at 50% 50%)`, {filter: 'contrast(1.15)'});
        const d = deco(el, '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="50" r="49"/><line x1="50" y1="6" x2="50" y2="42"/><line x1="50" y1="58" x2="50" y2="94"/><line x1="6" y1="50" x2="42" y2="50"/><line x1="58" y1="50" x2="94" y2="50"/><circle class="red" cx="50" cy="50" r="1.4"/></svg>', 'is-scope');
        const an = loopAnim(el, [{translate: '0 0'}, {translate: '4px -3px'}, {translate: '-3px 2px'}, {translate: '0 0'}], {duration: 3200, easing: 'ease-in-out'});
        return undoAll(a, () => d.end(), () => an?.cancel?.());
      }},
      {id: 'target', name: T('Target acquired', 'تم تحديد الهدف'), cast(el) {const d = deco(el, `<i class="k k1"></i><i class="k k2"></i><i class="k k3"></i><i class="k k4"></i><span class="lbl">${T('Target acquired', 'تم تحديد الهدف')}</span>`, 'is-tgt'); return () => d.end();}},
      {id: 'radar', name: T('Radar', 'رادار'), cast(el) {const a = restyle(el, {filter: 'brightness(.5) saturate(.4) sepia(.4) hue-rotate(50deg)'}), d = deco(el, `<i class="rad"><i class="sweep"></i></i><i class="rings"></i>${[0, 1, 2].map(i => `<i class="blip" style="left:${rnd(15, 85).toFixed(0)}%;top:${rnd(15, 85).toFixed(0)}%;--d:${(i * .4).toFixed(1)}s"></i>`).join('')}`, 'is-radar'); return undoAll(a, () => d.end());}},
      {id: 'camo', name: T('Camouflage', 'تمويه'), cast(el) {const d = deco(el, camoSvg(), 'is-camo'); return () => d.end();}},
      {id: 'classified', name: T('Classified', 'سري للغاية'), cast(el) {const a = restyle(el, {filter: 'grayscale(.7) sepia(.35) contrast(1.1)'}), d = deco(el, `<span class="stamp">${T('CLASSIFIED', 'سري للغاية')}</span>`, 'is-stamp'); shake(el, 5); return undoAll(a, () => d.end());}},
      {id: 'redacted', name: T('Redacted', 'محجوب'), cast(el) {const d = deco(el, Array.from({length: 6}, (_, i) => `<i class="bar" style="--l:${rnd(4, 30).toFixed(0)}%;--w:${rnd(30, 62).toFixed(0)}%;--y:${(8 + i * 14 + rnd(-3, 3)).toFixed(0)}%;--d:${(i * .25).toFixed(2)}s"></i>`).join(''), 'is-redact'); return () => d.end();}},
      {id: 'airdrop', name: T('Airdrop!', 'إنزال جوي!'), cast(el) {
        const at = rnd(.3, .7), fall = 2.2;
        return critter(el, (t, r) => {
          const gx = Math.round((r.left + r.width * at) / U), gy = Math.round(r.top / U), k = Math.min(1, t / fall), y = Math.round(gy - 70 + 70 * k) - 7, sway = Math.round(Math.sin(t * 3) * 2 * (1 - k));
          if (k < 1) {for (let i = -6; i <= 6; i++) {const h = Math.round(Math.sqrt(36 - i * i) * .7); R(gx + i + sway, y - 12 - h, 1, h + 1, (i + 6) % 4 < 2 ? '#C83A2E' : '#F2E8DA');} line(gx - 6 + sway, y - 11, gx - 3, y, '#6B6B6B'); line(gx + 6 + sway, y - 11, gx + 3, y, '#6B6B6B');}
          R(gx - 4, y, 9, 7, '#4B5320'); R(gx - 4, y + 3, 9, 1, '#2F3414'); R(gx, y, 1, 7, '#2F3414'); P1(gx - 3, y + 1, '#C4D69A');
          if (k >= 1 && t < fall + .12) dust(gx, gy, 3);
        });
      }},
      {id: 'lockon', name: T('Locked on', 'تم القفل'), cast(el) {const t0 = performance.now(), d = deco(el, '<i class="dot"></i><i class="ring2"></i>', 'is-dot', dd => {const t = (performance.now() - t0) / 1000, x = 50 + Math.sin(t * 1.3) * 30 + Math.sin(t * 3.1) * 6, y = 50 + Math.cos(t * 1.7) * 26; for (const n of dd.node.children) {n.style.left = `${x}%`; n.style.top = `${y}%`;}}); return () => d.end();}},
      {id: 'complete', name: T('Mission complete', 'المهمة اكتملت'), cast(el) {const d = deco(el, `<span class="banner">✓ ${T('Mission complete', 'المهمة اكتملت')}</span>`, 'is-done'); return () => d.end();}},
    ],
    // Ink & Pow: the comic edition
    comic: [
      {id: 'kapow', name: 'KAPOW!', cast(el) {const a = restyle(el, {filter: 'contrast(1.4) saturate(1.6)'}), d = deco(el, `<i class="lines"></i>${burst('KAPOW!')}`, 'is-kapow'); shake(el, 8); return undoAll(a, () => d.end());}},
      {id: 'speech', name: T('Speech!', 'كلام!'), cast(el) {const d = deco(el, '<span class="bub"></span>', 'is-say'); d.node.querySelector('.bub').textContent = any([T('Holy deadlines!', 'يا للمواعيد النهائية!'), T('It compiles?! Impossible!', 'يعمل؟! مستحيل!'), T('Ship it, team!', 'انشروه يا فريق!'), T('Is this… a portfolio?!', 'هل هذا… معرض أعمال؟!'), T('To the release notes!', 'إلى ملاحظات الإصدار!')]); return () => d.end();}},
      {id: 'panels', name: T('Panels', 'لوحات'), cast(el) {const a = restyle(el, {filter: 'contrast(1.25) saturate(1.3)'}), d = deco(el, '<i class="ink"></i><i class="g" style="left:33.3%"></i><i class="g" style="left:66.6%"></i>', 'is-panels'); return undoAll(a, () => d.end());}},
      {id: 'meanwhile', name: T('Meanwhile…', 'في هذه الأثناء…'), cast(el) {const d = deco(el, '<span class="cap"></span>', 'is-cap'); d.node.querySelector('.cap').textContent = any([T('Meanwhile, in production…', 'في هذه الأثناء، في الإنتاج…'), T('Later that sprint…', 'لاحقاً في نفس الدورة…'), T('Elsewhere, a bug stirs…', 'في مكان آخر، خلل يتحرك…'), T('One deploy later…', 'بعد نشر واحد…')]); return () => d.end();}},
      {id: 'speed', name: T('Whoosh!', 'ووووش!'), cast(el) {const a = restyle(el, {filter: 'contrast(1.2)'}), d = deco(el, '<i class="lines"></i>', 'is-speed'), an = loopAnim(el, [{translate: '0 0'}, {translate: '10px 0'}, {translate: '0 0'}], {duration: 500, easing: 'ease-in-out'}); return undoAll(a, () => d.end(), () => an?.cancel?.());}},
      {id: 'sketch', name: T('Pencils', 'رسم بالرصاص'), cast(el) {const a = restyle(el, {filter: 'grayscale(1) contrast(1.7) brightness(1.2)'}), d = deco(el, `<i class="paper"></i><span class="lbl">${T('pencils by Opus', 'رسم أوبس')}</span>`, 'is-sketch'); return undoAll(a, () => d.end());}},
      {id: 'cmyk', name: T('Misprint', 'طباعة معيبة'), cast(el) {const a = restyle(el, {filter: 'drop-shadow(4px 2px 0 rgba(0,200,255,.75)) drop-shadow(-4px -2px 0 rgba(255,0,170,.7)) drop-shadow(2px -3px 0 rgba(255,230,0,.65))'}), d = deco(el, '<i class="dots"></i>', 'is-cmyk'); return undoAll(a, () => d.end());}},
      {id: 'boom', name: 'BOOM!', cast(el) {const d = deco(el, burst('BOOM!', '#ff9f1c'), 'is-boom'); shake(el, 12); const r = el.getBoundingClientRect(); for (let i = 0; i < 4; i++) setTimeout(() => dust((r.left + Math.random() * r.width) / U, r.bottom / U, 8), i * 150); return () => d.end();}},
      {id: 'cape', name: T('Hero mode', 'وضع البطل'), cast(el) {const d = deco(el, '<i class="cape"></i><i class="tie"></i>', 'is-cape'), an = loopAnim(el, [{translate: '0 0'}, {translate: '0 -5px'}, {translate: '0 0'}], {duration: 1800, easing: 'ease-in-out'}); return undoAll(() => d.end(), () => an?.cancel?.());}},
      {id: 'thought', name: T('Hmm…', 'همم…'), cast(el) {const d = deco(el, '<span class="bub think"></span>', 'is-say'); d.node.querySelector('.bub').textContent = any([T('hmm… needs more glass', 'همم… يحتاج زجاجاً أكثر'), T('what if… dark mode?', 'ماذا لو… وضع داكن؟'), T('is it Friday yet?', 'هل وصلنا الجمعة؟'), T('one more feature…', 'ميزة واحدة أخرى…')]); return () => d.end();}},
    ],
    // Terracotta: the clay edition
    clay: [
      {id: 'squish', name: T('Squish!', 'هرس!'), cast(el) {const a = restyle(el, {filter: 'saturate(1.15) contrast(.95)'}), an = loopAnim(el, [{scale: '1 1'}, {scale: '1.06 .92'}, {scale: '.95 1.06'}, {scale: '1 1'}], {duration: 1300, easing: 'ease-in-out'}); return undoAll(a, () => an?.cancel?.());}},
      {id: 'plasticine', name: T('Plasticine', 'صلصال'), cast(el) {return morph(el, 'inset(0% 0% 0% 0% round 0px)', 'inset(3% 3% 3% 3% round 34px)', {filter: 'saturate(1.45) contrast(.9) blur(.7px)'});}},
      {id: 'thumb', name: T('Thumbprint', 'بصمة'), cast(el) {const d = deco(el, '<i class="tp"></i>', 'is-thumb'); shake(el, 4); return () => d.end();}},
      {id: 'stopmotion', name: T('Stop-motion', 'إطار بإطار'), cast(el) {const an = loopAnim(el, Array.from({length: 7}, (_, i) => (i === 6 ? {translate: '0 0', rotate: '0deg'} : {translate: `${rnd(-3, 3).toFixed(1)}px ${rnd(-3, 3).toFixed(1)}px`, rotate: `${rnd(-1.4, 1.4).toFixed(2)}deg`, easing: 'steps(1, end)'})), {duration: 700}); return () => an?.cancel?.();}},
      {id: 'flowers', name: T('Clay garden', 'حديقة صلصال'), cast(el) {
        const spots = Array.from({length: 6}, () => ({u: rnd(.06, .94), h: rnd(5, 11), c: any(['#E07A5F', '#F2CC8F', '#81B29A', '#F4A261', '#E9C46A'])}));
        return critter(el, (t, r) => {const gy = Math.round(r.bottom / U) - 1; for (const s of spots) {const x = Math.round((r.left + r.width * s.u) / U), h = Math.round(s.h * Math.min(1, t / 1.2)); R(x, gy - h, 2, h, '#6A994E'); if (t > 1) {R(x - 2, gy - h - 3, 6, 3, s.c); R(x - 1, gy - h - 4, 4, 5, s.c); R(x, gy - h - 2, 2, 1, '#FFF1D6');}}});
      }},
      {id: 'wheel', name: T('Pottery wheel', 'عجلة الفخار'), cast(el) {const d = deco(el, '<i class="wh"></i>', 'is-wheel'), an = loopAnim(el, [{rotate: '0deg'}, {rotate: '3deg'}, {rotate: '-3deg'}, {rotate: '0deg'}], {duration: 1400, easing: 'ease-in-out'}); return undoAll(() => d.end(), () => an?.cancel?.());}},
      {id: 'kiln', name: T('Into the kiln', 'إلى الفرن'), cast(el) {const a = restyle(el, {filter: 'sepia(.6) saturate(1.7) hue-rotate(-14deg) brightness(1.06)'}), d = deco(el, `<i class="glow"></i><span class="lbl">${T('Firing at 1200°', 'حرق على ١٢٠٠°')}</span>`, 'is-kiln'), an = loopAnim(el, [{translate: '0 0'}, {translate: '0 -1px'}, {translate: '0 0'}], {duration: 240}); return undoAll(a, () => d.end(), () => an?.cancel?.());}},
      {id: 'crumbs', name: T('Sculpting…', 'نحت…'), cast(el) {let on = true; const drop = () => {if (!on || !el.isConnected) return; const r = el.getBoundingClientRect(); emit({kind: 'px', x: (r.left + Math.random() * r.width) / U, y: r.bottom / U, vx: rnd(-6, 6), vy: rnd(5, 20), g: 120, life: 1.4, c: any(['#B5623F', '#D97757', '#8A4428']), s: 2}); setTimeout(drop, 120);}; drop(); shake(el, 3); return () => {on = false;};}},
      {id: 'carve', name: T('A little carving', 'نقش صغير'), cast(el) {const d = deco(el, '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path class="s1" d="M30 62 Q50 80 70 62"/><path class="s1" d="M38 38 L38 46 M62 38 L62 46"/><path class="s2" d="M30 62 Q50 80 70 62"/><path class="s2" d="M38 38 L38 46 M62 38 L62 46"/></svg>', 'is-carve'); return () => d.end();}},
      {id: 'sun', name: T('Clay sun', 'شمس صلصال'), cast(el) {const a = restyle(el, {filter: 'brightness(1.06) saturate(1.1)'}), d = deco(el, '<i class="rays"></i><i class="disc"></i>', 'is-sun'); return undoAll(a, () => d.end());}},
    ],
  };
  const spellBags = {};
  const packNow = () => (SPELL_PACKS[root.dataset.edition] ? root.dataset.edition : 'studio');
  const spellable = el => {if (!el?.isConnected) return false; const r = el.getBoundingClientRect(); return r.width >= 110 && r.height >= 60 && r.top > 30 && r.bottom < innerHeight + 40 && r.left > -20 && r.right < innerWidth + 20;};
  const PACK_FX = {
    studio: {say: T('ta-da', 'تا-دا'), c: ['#FFFFFF', '#FFD34D'], eyes: 'happy'},
    halloween: {say: T('mwahaha', 'هاهاها'), c: ['#9CFF57', '#B388FF'], eyes: 'squint'},
    heaven: {say: T('sparkle!', 'لمعة!'), c: ['#FFF6C9', '#FFD76A', '#CFE6FF'], eyes: 'happy'},
    rgb: {say: 'GG EZ', c: ['#00E5FF', '#FF00D4', '#7CFF6B'], eyes: 'wide'},
    tactical: {say: T('copy that', 'عُلم'), c: ['#9BE564', '#D6FFB0'], eyes: 'squint'},
    comic: {say: 'KAPOW!', c: ['#FFD400', '#E10600', '#FFFFFF'], eyes: 'wide'},
    clay: {say: T('squish', 'هرس'), c: ['#D97757', '#F2CC8F', '#F0EEE6'], eyes: 'happy'},
  };
  function wand(o, pack, up) {
    const hx = o.ox + (up ? 16 : 17), hy = o.oy + (up ? 1 : 4);
    if (pack === 'halloween') {line(hx, hy, hx + 3, hy - 3, '#3B2A1E'); line(hx + 3, hy - 3, hx + 5, hy - 6, '#3B2A1E'); P1(hx + 5, hy - 7, frame % 2 ? '#9CFF57' : '#D6FFB0');}
    else if (pack === 'heaven') {line(hx, hy, hx + 4, hy - 5, '#E3B04B'); const k = frame % 2; for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]) P1(hx + 5 + dx, hy - 7 + dy, k && (dx || dy) ? '#FFF6C9' : '#FFD76A');}
    else if (pack === 'rgb') {line(hx, hy, hx + 4, hy - 5, '#1B1B22'); P1(hx + 5, hy - 6, hsl(frame * 40)); P1(hx + 4, hy - 6, hsl(frame * 40 + 120));}
    else if (pack === 'tactical') {R(hx, hy - 3, 3, 4, '#2E3326'); P1(hx + 1, hy - 3, frame % 2 ? '#FF3B3B' : '#7A1A1A');}
    else if (pack === 'comic') {line(hx, hy, hx + 4, hy - 5, '#F2C14E'); P1(hx + 5, hy - 6, '#111111'); P1(hx, hy, '#FF8FA3');}
    else if (pack === 'clay') {line(hx, hy, hx + 3, hy - 4, '#8B5A2B'); for (const [dx, dy] of [[4, -5], [5, -6], [6, -5], [5, -4]]) P1(hx + dx, hy + dy, '#B9BCC2');}
    else {line(hx, hy, hx + 4, hy - 5, '#141418'); P1(hx + 4, hy - 5, '#FFFFFF'); P1(hx + 5, hy - 6, '#FFFFFF');}
  }
  ACTS.push({id: 'spell', who: 'both', on: 'frame', dur: [11, 11], can: () => spellable(C.on),
    say: T('Magic. Don’t worry, it wears off. Probably.', 'سحر. لا تقلق، يزول. غالباً.'),
    start(st) {st.pack = packNow(); st.spell = (spellBags[st.pack] ||= bag(SPELL_PACKS[st.pack]))(() => true); st.el = C.on;},
    tick(t, st) {
      if (!st.el.isConnected) return 'done';
      if (t > .9 && !st.cast) {
        st.cast = 1; sfx(st.spell.name);
        const r = st.el.getBoundingClientRect(), tx = (r.left + r.width / 2) / U, ty = (r.top + r.height / 2) / U, sx = C.ox + 21, sy = C.oy - 6;
        for (let i = 0; i < 16; i++) {const k = rnd(.5, 1.2); emit({kind: 'spark', x: sx, y: sy, vx: (tx - sx) / k + rnd(-10, 10), vy: (ty - sy) / k + rnd(-10, 10), life: k * .9, c: any(PACK_FX[st.pack].c)});}
      }
      if (t > 1.6 && !st.on) {
        st.on = 1; st.undo = safe(() => st.spell.cast(st.el)) || null;
        const r = st.el.getBoundingClientRect(); for (let i = 0; i < 18; i++) emit({kind: 'spark', x: (r.left + Math.random() * r.width) / U, y: (r.top + Math.random() * r.height) / U, life: .7, c: any(PACK_FX[st.pack].c)});
        setTimeout(() => sfx(PACK_FX[st.pack].say), 900);
      }
      if (t > 9.6 && !st.off) {st.off = 1; st.undo?.(); st.undo = null;}
    },
    pose(t, P, st) {P.armR = t < 1.7 ? 'up' : 'hold'; P.look = t < .9 ? lookUser() : [0, 1]; if (t > 1.6 && t < 3) P.eyes = PACK_FX[st.pack].eyes;},
    front(t, o, st, P) {wand(o, st.pack, P.armR === 'up');},
    end(st) {st.undo?.(); st.undo = null;}});
  const ACT = Object.fromEntries(ACTS.map(a => [a.id, a]));
  const actBag = bag(ACTS.filter(a => !a.once && a.on !== 'text'));
  const theftBag = bag(ACTS.filter(a => a.on === 'text'));

  // ── how it follows you: the rides ─────────────────────────────────────────────────────────────
  // draw(r, x, y, phase, p, P, t) draws facing right with (x, y) the ground point under the rider;
  // it returns the rider's grid origin. phases: board → go → land (a fall comes first if the ride
  // needs the ground and the rider is up in the air).
  const rider = (x, y, lift, P, who = kind) => {const ox = x - 9, oy = y - 10 - lift; drawChar(who, ox, oy, P); return [ox, oy];};
  // vehicles pop in with a puff, carry the rider, then drive off and fade (ground rides share this)
  function vehicle(ph, p, x, outAt = .25) {
    const off = ph === 'land' ? Math.round(70 * smooth((p - outAt) / (1 - outAt))) : 0;
    const a = ph === 'board' ? smooth(p / .5) : ph === 'land' ? 1 - smooth((p - .5) / .5) : 1;
    const seated = ph === 'go' || (ph === 'board' && p > .6) || (ph === 'land' && p < outAt);
    const moving = ph === 'go' || (ph === 'land' && p > outAt);
    return {cx: x + off, a, seated, moving, step: moving ? frame % 4 : 0, bob: moving && frame % 2 ? -1 : 0};
  }
  function horse(hx, y, step, moving) {
    const H = '#8A5A3B', Hd = '#6B432B', M = '#2E1E14', K = '#1A110B', G = '#D9A441', Rd = '#D7263D', by = y - (moving && step % 2 ? 1 : 0);
    R(hx + 1, by - 14, 14, 6, H); R(hx + 2, by - 15, 6, 1, H); R(hx + 2, by - 9, 12, 1, Hd);
    R(hx + 13, by - 18, 3, 5, H); R(hx + 14, by - 20, 3, 2, H);
    R(hx + 15, by - 22, 4, 3, H); R(hx + 16, by - 19, 5, 2, H); R(hx + 20, by - 19, 1, 2, Hd);
    P1(hx + 17, by - 21, K); P1(hx + 20, by - 19, K);
    R(hx + 15, by - 24, 1, 2, H); P1(hx + 16, by - 23, H);
    R(hx + 12, by - 21, 2, 7, M); P1(hx + 14, by - 22, M);
    R(hx - 1, by - 14, 2, 2, M); R(hx - 2, by - 12, 2, 4, M);
    // a Cairo carriage horse: gold collar, red saddle pad, red pompom plume
    R(hx + 13, by - 14, 1, 5, G); R(hx + 5, by - 15, 5, 2, Rd); R(hx + 5, by - 15, 5, 1, G); R(hx + 16, by - 26, 1, 2, Rd); R(hx + 15, by - 28, 3, 2, Rd); P1(hx + 18, by - 20, G);
    [hx + 2, hx + 4, hx + 11, hx + 13].forEach((lx, i) => {
      const l = moving && ((step === 1 && (i === 0 || i === 3)) || (step === 3 && (i === 1 || i === 2))) ? 2 : 0;
      R(lx, by - 8, 1, y - 1 - l - (by - 8), i % 2 ? Hd : H); P1(lx, y - 1 - l, K);
    });
  }
  function camel(hx, y, step, moving) {
    const C1 = '#C9A26B', Cd = '#A88350', K = '#2A1D10', by = y - (moving && step % 2 ? 1 : 0);
    R(hx + 1, by - 17, 15, 6, C1); R(hx + 4, by - 21, 8, 4, C1); R(hx + 6, by - 22, 4, 1, C1); R(hx + 2, by - 11, 13, 1, Cd);
    R(hx + 15, by - 16, 2, 3, C1); R(hx + 16, by - 19, 2, 3, C1); R(hx + 16, by - 22, 4, 3, C1); R(hx + 19, by - 21, 2, 2, C1);
    P1(hx + 18, by - 22, K); P1(hx + 20, by - 21, Cd); P1(hx + 16, by - 23, Cd); R(hx - 1, by - 16, 1, 4, Cd);
    R(hx + 3, by - 22, 10, 3, '#B5302F'); R(hx + 3, by - 21, 10, 1, '#1F1F1F'); P1(hx + 3, by - 19, '#E3B04B'); P1(hx + 12, by - 19, '#E3B04B');
    [hx + 2, hx + 4, hx + 12, hx + 14].forEach((lx, i) => {
      const l = moving && ((step === 1 && (i === 0 || i === 3)) || (step === 3 && (i === 1 || i === 2))) ? 2 : 0;
      R(lx, by - 11, 1, y - 1 - l - (by - 11), i % 2 ? Cd : C1); P1(lx, y - 1 - l, K);
    });
  }
  const spr = document.createElement('canvas'); spr.width = 24; spr.height = 16;
  function sprite(who, P) {const keep = g; g = spr.getContext('2d'); g.clearRect(0, 0, 24, 16); drawChar(who, 3, 3, P); g = keep; return spr;}

  const RIDES = [
    {id: 'walk', who: 'both', basic: true, path: 'ground', speed: 32, board: 0, land: .1,
      draw(r, x, y, ph, p, P) {if (ph === 'go') P.legs = frame % 2 ? 'a' : 'b'; return rider(x, y, 0, P);}},
    {id: 'hop', who: 'both', basic: true, path: 'ground', speed: 40, hops: 1, hopH: 7, board: 0, land: .15,
      draw(r, x, y, ph, p, P) {if (ph === 'go') {P.armL = P.armR = 'up'; P.eyes = 'happy';} return rider(x, y, 0, P);}},
    {id: 'jump', who: 'both', basic: true, path: 'jump', speed: 110, min: .42, max: .85, board: .16, land: .22,
      draw(r, x, y, ph, p, P) {
        if (ph === 'board') {P.breath = 1; P.armL = P.armR = 'down'; P.eyes = 'squint';}
        else if (ph === 'go') {P.armL = P.armR = 'up'; P.legs = p > .5 ? 'dangle' : 'stand'; P.eyes = 'wide';}
        else if (p < .5) {P.breath = 1; P.armL = P.armR = 'out';}
        return rider(x, y, 0, P);
      }},
    {id: 'flap', who: 'crow', basic: true, path: 'fly', speed: 70, board: .1, land: .15,
      draw(r, x, y, ph, p, P) {if (ph === 'go') {P.armL = P.armR = ['fup', 'fmid', 'fdown', 'fmid'][frame % 4]; P.legs = 'tuck';} return rider(x, y, 0, P);},
      trail(r, x, y) {if (Math.random() < .03) feather(x, y - 6);}},
    {id: 'glide', who: 'crow', path: 'fly', speed: 60, board: .2, land: .2,
      draw(r, x, y, ph, p, P) {if (ph === 'go') {P.armL = P.armR = 'fmid'; P.legs = 'tuck'; P.eyes = 'happy';} return rider(x, y, 0, P);}},
    {id: 'ufo', who: 'both', path: 'fly', speed: 120, board: 1, land: 1.2, sfx: T('beam me up', 'اسحبني لفوق'),
      draw(r, x, y, ph, p, P) {
        let sy = 0, lift = 8, inside = true, beam = false, a = 1;
        if (ph === 'board') {sy = -Math.round(48 * (1 - smooth(p / .6))); beam = p > .45; inside = p > .8; lift = inside ? 8 : Math.round(8 * smooth((p - .5) / .3));}
        if (ph === 'land') {beam = p < .55; inside = p < .1; lift = inside ? 8 : Math.round(8 * (1 - smooth((p - .1) / .35))); sy = p > .5 ? -Math.round(90 * smooth((p - .5) / .5)) : 0; a = p > .75 ? 1 - (p - .75) / .25 : 1;}
        const Y = y + sy;
        if (beam) alpha(.22 + .08 * Math.sin(performance.now() / 60), () => {for (let i = Y - 3; i < y; i++) {const w = 3 + Math.round((i - Y + 3) * .35); R(x - w, i, w * 2 + 1, 1, '#C9FFF4');}});
        let o;
        if (inside) {P.legs = 'tuck'; o = rider(x, Y, 8, P);} else {P.legs = 'dangle'; P.armL = P.armR = 'up'; P.eyes = 'wide'; o = rider(x, y, lift, P);}
        alpha(a, () => {
          R(x - 9, Y - 20, 19, 12, 'rgba(160,226,255,.2)'); R(x - 7, Y - 22, 15, 2, 'rgba(160,226,255,.2)'); R(x - 4, Y - 23, 9, 1, 'rgba(160,226,255,.2)');
          alpha(.7, () => {R(x - 7, Y - 19, 1, 4, '#EFFFFF'); R(x - 5, Y - 21, 2, 1, '#EFFFFF');});
          R(x - 13, Y - 8, 27, 1, '#D5DCE3'); R(x - 16, Y - 7, 33, 1, '#AEB8C2'); R(x - 17, Y - 6, 35, 1, '#8D98A4'); R(x - 14, Y - 5, 29, 1, '#6F7985'); R(x - 9, Y - 4, 19, 1, '#555E69');
          for (let i = -15, k = 0; i <= 15; i += 5, k++) P1(x + i, Y - 6, ['#FFD34D', '#6EF2FF', '#FF6B9A'][(k + frame) % 3]);
          alpha(.55 + .3 * Math.sin(performance.now() / 40), () => R(x - 4, Y - 3, 9, 1, '#6EF2FF'));
        });
        return o;
      }},
    {id: 'hantour', who: 'both', path: 'ground', speed: 62, board: .7, land: 1, sfx: T('clip clop', 'طق طق'),
      draw(r, x, y, ph, p, P) {
        const v = vehicle(ph, p, x), {cx, bob, step} = v;
        alpha(v.a, () => {R(cx - 11, y - 26 + bob, 9, 2, '#3A2C24'); R(cx - 11, y - 24 + bob, 3, 13, '#3A2C24'); P1(cx - 10, y - 22 + bob, '#D9A441'); P1(cx - 10, y - 17 + bob, '#D9A441');});
        const body = () => alpha(v.a, () => {
          R(cx - 9, y - 12 + bob, 15, 6, '#2A2522'); R(cx - 9, y - 12 + bob, 15, 1, '#D9A441'); R(cx - 9, y - 7 + bob, 15, 1, '#D9A441'); R(cx + 6, y - 11 + bob, 1, 4, '#2A2522');
          wheel(cx - 3, y - 6, 5, step, '#C9A06A', '#6B4A2A');
          line(cx + 6, y - 9 + bob, cx + 16, y - 12, '#6B4A2A');
          line(cx + 3, y - 15 + bob, cx + 31, y - 19, '#3B2618');
          horse(cx + 14, y, step, v.moving);
        });
        let o;
        if (v.seated) {P.legs = 'tuck'; P.armR = 'fwd'; o = rider(cx - 1, y, 9 - bob, P); body();} else {body(); o = rider(x, y, 0, P);}
        return o;
      }},
    {id: 'tuktuk', who: 'both', path: 'ground', speed: 78, board: .6, land: .9, sfx: T('beep beep', 'بيب بيب'),
      draw(r, x, y, ph, p, P) {
        const v = vehicle(ph, p, x), {cx, bob, step} = v;
        const body = () => alpha(v.a, () => {
          R(cx - 12, y - 22 + bob, 23, 2, '#1F7A4D'); R(cx - 11, y - 20 + bob, 1, 11, '#1F7A4D'); R(cx + 9, y - 20 + bob, 1, 11, '#1F7A4D');
          for (let i = -11; i <= 10; i += 3) P1(cx + i, y - 20 + bob, i % 2 ? '#E3B04B' : '#D33A3A');
          R(cx - 12, y - 10 + bob, 23, 6, '#E8B33A'); R(cx - 12, y - 7 + bob, 23, 1, '#C8372D');
          R(cx + 11, y - 12 + bob, 4, 8, '#E8B33A'); P1(cx + 14, y - 10 + bob, '#FFF6C9');
          alpha(.35, () => R(cx + 10, y - 19 + bob, 1, 7, '#BFE8FF')); R(cx + 9, y - 13 + bob, 3, 1, '#2A2A2E');
          wheel(cx - 8, y - 4, 3, step, '#2A2A2E', '#8A8A8A'); wheel(cx + 12, y - 4, 3, step, '#2A2A2E', '#8A8A8A');
        });
        let o;
        if (v.seated) {P.legs = 'tuck'; P.armR = 'fwd'; o = rider(cx - 2, y, 7 - bob, P); body();} else {body(); o = rider(x, y, 0, P);}
        return o;
      },
      trail(r, x, y) {if (Math.random() < .25) emit({kind: 'dust', x: x - r.dir * 14, y: y - 3, vx: -r.dir * 8, vy: -3, life: .6, c: '#8F8F8F'});}},
    {id: 'bike', who: 'both', path: 'ground', speed: 52, board: .5, land: .8, sfx: T('fresh bread!', 'عيش سخن!'),
      draw(r, x, y, ph, p, P) {   // the Cairo bread bicycle: a tray of bread balanced on the head
        const v = vehicle(ph, p, x), {cx, step} = v, F = '#2E8BC0', K = '#1E1E24';
        const bike = () => alpha(v.a, () => {
          ring(cx - 7, y - 5, 4, K); ring(cx + 7, y - 5, 4, K); P1(cx - 7, y - 5, '#9AA0A8'); P1(cx + 7, y - 5, '#9AA0A8');
          line(cx - 7, y - 5, cx - 1, y - 11, F); line(cx - 1, y - 11, cx, y - 5, F); line(cx, y - 5, cx - 7, y - 5, F); line(cx - 1, y - 11, cx + 5, y - 11, F); line(cx, y - 5, cx + 5, y - 11, F); line(cx + 5, y - 12, cx + 7, y - 5, F);
          R(cx - 3, y - 12, 4, 1, K); R(cx + 4, y - 13, 3, 1, K);
          const a = step * Math.PI / 2; P1(cx + Math.round(Math.cos(a) * 2), y - 5 + Math.round(Math.sin(a) * 2), K); P1(cx - Math.round(Math.cos(a) * 2), y - 5 - Math.round(Math.sin(a) * 2), K);
        });
        let o;
        if (v.seated) {P.legs = step % 2 ? 'a' : 'b'; P.armR = 'reach'; P.armL = 'up'; bike(); o = rider(cx - 2, y, 10, P);} else {bike(); o = rider(x, y, 0, P);}
        if (v.seated || ph === 'board') {
          const [ox, oy] = o, wob = v.moving && frame % 3 === 0 ? 1 : 0, top = topOf(oy, P);
          R(ox - 3 + wob, top - 2, 24, 1, '#8B5A2B');
          for (let i = 0; i < 6; i++) {R(ox - 2 + i * 4 + wob, top - 4, 3, 2, '#D9A066'); P1(ox - 1 + i * 4 + wob, top - 4, '#F0C890');}
        }
        return o;
      }},
    {id: 'moto', who: 'both', path: 'ground', speed: 100, board: .6, land: .9, sfx: T('vroom', 'بررررم'),
      draw(r, x, y, ph, p, P) {   // an Egyptian delivery motorbike, box and all
        const v = vehicle(ph, p, x), {cx} = v, K = '#1E1E24', Rr = '#C8372D';
        const moto = () => alpha(v.a, () => {
          R(cx - 15, y - 19, 7, 7, '#E8B33A'); R(cx - 15, y - 16, 7, 1, Rr);
          for (const wx of [cx - 8, cx + 8]) {ring(wx, y - 5, 4, K); ring(wx, y - 5, 3, K); P1(wx, y - 5, '#9AA0A8');}
          R(cx - 5, y - 9, 8, 3, '#55595F'); R(cx - 12, y - 7, 6, 1, '#B8BEC6');
          R(cx - 2, y - 12, 7, 3, Rr); R(cx - 1, y - 13, 5, 1, Rr); R(cx - 8, y - 11, 6, 2, K);
          line(cx + 8, y - 5, cx + 6, y - 14, '#9AA0A8'); R(cx + 4, y - 15, 4, 1, K); P1(cx + 8, y - 13, '#FFF6C9');
        });
        let o;
        if (v.seated) {P.legs = 'tuck'; P.armR = 'reach'; moto(); o = rider(cx - 3, y, 9, P);} else {moto(); o = rider(x, y, 0, P);}
        return o;
      },
      trail(r, x, y) {if (Math.random() < .35) emit({kind: 'dust', x: x - r.dir * 17, y: y - 7, vx: -r.dir * 12, vy: -4, life: .7, c: '#A0A0A0'});}},
    {id: 'carpet', who: 'both', path: 'fly', speed: 95, board: .5, land: .7, sfx: T('shubbaik lubbaik!', 'شبيك لبيك!'),
      draw(r, x, y, ph, p, P, t) {
        let cy = y - 3, a = 1, vx = 0;
        if (ph === 'board') {a = Math.min(1, p * 2); cy = y - 3 + Math.round((1 - p) * 3);}
        if (ph === 'land') {const k = Math.max(0, p - .3) / .7; vx = Math.round(smooth(k) * 50); cy = y - 3 - Math.round(k * 26); a = 1 - Math.max(0, p - .5) * 2;}
        const riding = ph === 'go' || (ph === 'board' && p > .4) || (ph === 'land' && p < .3);
        let o;
        if (riding) {P.legs = 'tuck'; o = rider(x, cy, -2, P);} else o = rider(x, y, 0, P);
        alpha(a, () => {
          for (let i = -12; i <= 12; i++) {const wy = Math.round(Math.sin(i * .45 - t * 9) * (ph === 'go' ? 1.2 : .6)); R(x + vx + i, cy + wy, 1, 2, i % 3 ? '#9B2335' : '#7A1A2A'); if ((i + 30) % 4 === 0) P1(x + vx + i, cy + wy, '#E3B04B');}
          for (const e of [-13, 13]) {const wy = Math.round(Math.sin(e * .45 - t * 9)); P1(x + vx + e, cy + wy, '#E3B04B'); P1(x + vx + e + Math.sign(e), cy + wy + 1, '#E3B04B');}
        });
        return o;
      },
      trail(r, x, y) {if (Math.random() < .3) emit({kind: 'spark', x: x - r.dir * 13, y: y - 3 + rnd(-1, 1), vx: -r.dir * 10, life: .6, c: '#E3B04B'});}},
    {id: 'camel', who: 'both', path: 'ground', speed: 46, board: .6, land: 1, sfx: T('yalla yalla', 'يلا يلا'),
      draw(r, x, y, ph, p, P) {
        const v = vehicle(ph, p, x), {cx, step} = v, by = y - (v.moving && step % 2 ? 1 : 0);
        alpha(v.a, () => camel(cx - 9, y, step, v.moving));
        if (v.seated) {P.legs = 'tuck'; return rider(cx - 1, by, 20, P);}
        return rider(x, y, 0, P);
      }},
    {id: 'parachute', who: 'both', path: 'fall', speed: 26, board: .5, land: .9, need: (dx, dy) => dy > 30,
      draw(r, x, y, ph, p, P) {
        let open = 1, a = 1, drift = 0;
        if (ph === 'board') open = smooth(p);
        if (ph === 'land') {open = 1 - smooth(p); a = 1 - p; drift = Math.round(p * 8);}
        P.armL = P.armR = 'up'; P.legs = ph === 'land' ? 'stand' : 'dangle';
        const o = rider(x, y, 0, P), top = o[1] - 4;
        alpha(a, () => {
          const w = Math.round(4 + 10 * open), h = Math.round(2 + 5 * open), cx = x + drift;
          for (let i = 0; i < h; i++) {const rw = Math.max(1, Math.round(w * Math.sqrt(1 - ((h - 1 - i) / h) ** 2))); for (let k = -rw; k < rw; k++) P1(cx + k, top - 10 + i + (7 - h), Math.floor((k + 30) / 3) % 2 ? '#D97757' : '#F4EFE6');}
          line(cx - w, top - 4, x - 7, o[1] + 1, 'rgba(235,235,235,.8)'); line(cx + w - 1, top - 4, x + 7, o[1] + 1, 'rgba(235,235,235,.8)');
        });
        return o;
      }},
    {id: 'jetpack', who: 'opus', path: 'fly', speed: 110, board: .5, land: .5, sfx: T('whoosh', 'ووووش'),
      draw(r, x, y, ph, p, P) {
        const a = ph === 'board' ? p : ph === 'land' ? 1 - p : 1, ox = x - 9, oy = y - 10;
        alpha(a, () => {R(ox + 1, oy + 1, 2, 6, '#8A939E'); R(ox + 15, oy + 1, 2, 6, '#8A939E'); P1(ox + 1, oy + 1, '#C9D1DA'); P1(ox + 15, oy + 1, '#C9D1DA');});
        if (ph === 'go' || (ph === 'board' && p > .5)) for (const fx0 of [ox + 1, ox + 15]) {const n = 2 + (frame % 3); R(fx0, oy + 7, 2, n, '#FFB703'); P1(fx0 + (frame % 2), oy + 7 + n, '#FB5607');}
        P.legs = ph === 'go' ? 'dangle' : 'stand';
        return rider(x, y, 0, P);
      },
      trail(r, x, y) {if (Math.random() < .5) emit({kind: 'dust', x: x + rnd(-8, 8), y: y + 2, vy: 10, life: .6, c: '#9A9A9A'});}},
    {id: 'skate', who: 'both', path: 'ground', speed: 72, board: .4, land: .7,
      draw(r, x, y, ph, p, P) {
        const v = vehicle(ph, p, x, .2), {cx} = v;
        alpha(v.a, () => {R(cx - 9, y - 3, 18, 1, '#3B3B44'); P1(cx - 10, y - 4, '#3B3B44'); P1(cx + 9, y - 4, '#3B3B44'); R(cx - 7, y - 2, 2, 2, '#F4F4F4'); R(cx + 5, y - 2, 2, 2, '#F4F4F4');});
        if (v.seated) {P.armL = P.armR = 'hold'; P.eyes = frame % 10 < 8 ? 'open' : 'happy'; return rider(cx, y, 3, P);}
        return rider(x, y, 0, P);
      },
      trail(r, x, y) {if (Math.random() < .2) emit({kind: 'px', x: x - r.dir * 10, y: y - 1, vx: -r.dir * 20, life: .3, c: '#DADADA'});}},
    {id: 'pogo', who: 'opus', path: 'ground', speed: 44, hops: 1, hopH: 16, board: .3, land: .4, sfx: T('boing', 'بوينغ'),
      draw(r, x, y, ph, p, P) {
        const low = r.ty - y < 2;
        R(x, y - 13, 1, 13, '#9AA0A8');
        for (let i = 0; i < (low ? 2 : 4); i++) P1(x + (i % 2 ? 1 : -1), y - 4 + i, '#D33A3A');
        R(x - 3, y - 5, 7, 1, '#2A2A2E');
        P.armL = P.armR = 'fwd'; P.eyes = low ? 'squint' : 'happy';
        const o = rider(x, y, 5, P);
        R(x - 5, o[1] + 5, 11, 1, '#2A2A2E');
        return o;
      }},
    {id: 'forklift', who: 'opus', path: 'ground', speed: 50, board: .6, land: 1, sfx: T('beep beep beep', 'بيب بيب بيب'),
      draw(r, x, y, ph, p, P) {   // the warehouse guy's company car
        const v = vehicle(ph, p, x), {cx, step} = v;
        const lift = () => alpha(v.a, () => {
          R(cx - 10, y - 25, 14, 1, '#2A2A2A'); R(cx - 10, y - 24, 1, 12, '#2A2A2A'); R(cx + 3, y - 24, 1, 12, '#2A2A2A'); P1(cx - 4, y - 26, frame % 2 ? '#FF8A00' : '#7A3E00');
          R(cx - 10, y - 12, 15, 9, '#F2B705'); R(cx - 12, y - 11, 2, 7, '#3A3A3A'); R(cx + 6, y - 22, 2, 20, '#3A3A3A'); R(cx + 8, y - 3, 8, 1, '#3A3A3A');
          R(cx + 8, y - 9, 8, 6, '#B98A52'); R(cx + 11, y - 9, 2, 6, '#8C6338');
          wheel(cx - 6, y - 4, 3, step, '#222', '#666'); wheel(cx + 3, y - 3, 2, step, '#222', '#666');
        });
        let o;
        if (v.seated) {P.legs = 'tuck'; P.armR = 'fwd'; o = rider(cx - 3, y, 9, P); lift();} else {lift(); o = rider(x, y, 0, P);}
        return o;
      }},
    {id: 'plane', who: 'both', path: 'fly', speed: 90, board: .5, land: .7,
      draw(r, x, y, ph, p, P) {
        let a = 1, vx = 0, vy = 0;
        if (ph === 'board') a = smooth(p * 2);
        if (ph === 'land') {const k = smooth(Math.max(0, p - .25) / .75); vx = Math.round(k * 60); vy = -Math.round(k * 20); a = 1 - k;}
        const riding = ph === 'go' || (ph === 'board' && p > .5) || (ph === 'land' && p < .25);
        const plane = () => alpha(a, () => {for (let i = 0; i <= 26; i++) {const col = x - 13 + i + vx, top = y - 6 + Math.round(i * 5 / 26) + vy, bot = y + 1 - Math.round(i * 2 / 26) + vy; R(col, top, 1, y - 1 + vy - top + 1, '#F6F6F2'); if (bot >= y + vy) R(col, y + vy, 1, bot - (y + vy) + 1, '#C9CDD2');} line(x - 13 + vx, y - 6 + vy, x + 13 + vx, y - 1 + vy, '#DADDE2');});
        let o;
        if (riding) {P.legs = 'tuck'; o = rider(x, y, 1, P); plane();} else {plane(); o = rider(x, y, 0, P);}
        return o;
      }},
    {id: 'balloons', who: 'both', path: 'fly', speed: 55, board: .5, land: 1,
      draw(r, x, y, ph, p, P, t) {
        let up = 0, a = 1;
        if (ph === 'board') a = smooth(p * 2);
        if (ph === 'land') {up = Math.round(smooth(p) * 50); a = 1 - smooth(p);}
        const holding = ph !== 'land' || p < .15;
        if (holding) {P.armR = 'up'; P.legs = ph === 'go' ? 'dangle' : 'stand';}
        const o = rider(x, y, 0, P), hx = x + 7, hy = o[1] + 1 - (holding ? 0 : up);
        alpha(a, () => {for (const [dx, dy, c] of [[-6, -20, '#E84855'], [0, -24, '#F9DC5C'], [6, -19, '#3185FC']]) {const bx = hx + dx + Math.round(Math.sin(t * 2 + dx)), by = hy + dy; line(hx, hy, bx + 1, by + 5, 'rgba(235,235,235,.85)'); S(bx - 1, by, ['.##.', '####', '####', '####', '.##.'], {'#': c}); P1(bx, by + 1, 'rgba(255,255,255,.85)');}});
        return o;
      }},
    {id: 'teleport', who: 'opus', path: 'warp', speed: 400, min: .5, max: .5, board: .6, land: .6, sfx: T('bzzzt', 'بززززت'),
      draw(r, x, y, ph, p, P) {
        const k = ph === 'board' ? 1 - smooth(p) : ph === 'land' ? smooth(p) : 0;
        alpha((1 - k) * .5 + (ph === 'go' ? 0 : .2), () => R(x - 1, 0, 3, y, '#6EF2FF'));
        if (k > .02) {const s = sprite(kind, P), w = Math.max(1, Math.round(18 * k)); g.imageSmoothingEnabled = false; g.drawImage(s, 3, 0, 18, 13, x - (w >> 1), y - 13, w, 13);}
        if (Math.random() < .5) P1(x + Math.round(rnd(-9, 9)), y - Math.round(rnd(0, 14)), '#BFFFFF');
        return [x - 9, y - 10];
      }},
    {id: 'propeller', who: 'opus', path: 'fly', speed: 85, board: .5, land: .5,
      draw(r, x, y, ph, p, P) {
        P.legs = ph === 'go' ? 'dangle' : 'stand'; P.armL = P.armR = ph === 'go' ? 'out' : 'down'; P.hat = 1;
        const o = rider(x, y, 0, P), [ox, oy] = o, top = topOf(oy, P), a = ph === 'board' ? p : ph === 'land' ? 1 - p : 1;
        alpha(a, () => {R(ox + 5, top - 1, 8, 1, '#E84855'); R(ox + 7, top - 1, 2, 1, '#F9DC5C'); R(ox + 11, top - 1, 2, 1, '#3185FC'); R(ox + 8, top - 2, 2, 1, '#2A2A2E'); if (frame % 2) R(ox + 2, top - 3, 14, 1, '#E84855'); else R(ox + 6, top - 3, 6, 1, '#E84855');});
        return o;
      }},
    {id: 'rocket', who: 'opus', path: 'fly', speed: 150, board: .4, land: 1, sfx: T('3… 2… 1…', '٣… ٢… ١…'),
      draw(r, x, y, ph, p, P) {
        let rx = x, ry = y, a = 1;
        if (ph === 'land') {
          const k = smooth(Math.max(0, p - .2) / .5); ry = y - Math.round(k * 60); rx = x + Math.round(k * 20); a = p < .7 ? 1 : 0;
          if (p >= .7 && !r.st.boom) {r.st.boom = 1; for (let i = 0; i < 24; i++) {const an = i / 24 * Math.PI * 2; emit({kind: 'spark', x: r.dir > 0 ? rx : 2 * x - rx, y: ry - 2, vx: Math.cos(an) * 30, vy: Math.sin(an) * 30, g: 20, life: .9, c: any(['#FF6B6B', '#FFD166', '#4CC9F0', '#B388FF'])});}}
        }
        const riding = ph === 'go' || (ph === 'board' && p > .5) || (ph === 'land' && p < .2);
        const draw = () => alpha(a, () => {
          R(rx - 10, ry - 4, 20, 4, '#E84855'); R(rx - 10, ry - 3, 20, 1, '#F4F4F0');
          R(rx + 10, ry - 4, 2, 4, '#F4F4F0'); R(rx + 12, ry - 3, 2, 2, '#F4F4F0'); P1(rx + 14, ry - 2, '#F4F4F0');
          R(rx - 12, ry - 7, 3, 3, '#3185FC'); R(rx - 12, ry, 3, 3, '#3185FC');
          if (ph !== 'board' || p > .5) {const f = frame % 2; R(rx - 14 - f, ry - 3, 2 + f, 2, '#FFB703'); P1(rx - 15 - f * 2, ry - 3, '#FB5607');}
        });
        let o;
        if (riding) {P.legs = 'tuck'; P.eyes = 'wide'; o = rider(x, y, 2, P); draw();} else {draw(); o = rider(x, y, 0, P);}
        return o;
      },
      trail(r, x, y) {if (Math.random() < .6) emit({kind: 'spark', x: x - r.dir * 15, y: y - 2, vx: -r.dir * 20, vy: rnd(-4, 4), life: .4, c: any(['#FFB703', '#FB5607', '#FFFFFF'])});}},
    {id: 'crowtaxi', who: 'opus', path: 'fly', speed: 85, board: .7, land: .9, sfx: T('caw! (taxi)', 'قاق! (تاكسي)'),
      draw(r, x, y, ph, p, P) {   // the crow carries him
        let cy = 0, a = 1, held = true;
        if (ph === 'board') {cy = -Math.round(40 * (1 - smooth(p / .7))); held = p > .7;}
        if (ph === 'land') {held = p < .2; cy = p > .2 ? -Math.round(60 * smooth((p - .2) / .8)) : 0; a = 1 - Math.max(0, (p - .5) / .5);}
        const Pc = pose(); Pc.armL = Pc.armR = ['fup', 'fmid', 'fdown', 'fmid'][frame % 4]; Pc.look = [1, 1];
        let o;
        if (held) {P.armL = P.armR = 'up'; P.legs = 'dangle'; o = rider(x, y - 3, 0, P);} else o = rider(x, y, 0, P);
        alpha(a, () => drawCrow(x - 9, y - 22 + cy, Pc));
        return o;
      }},
    {id: 'opustaxi', who: 'crow', path: 'ground', speed: 40, board: .6, land: .9,
      draw(r, x, y, ph, p, P) {   // rides on Opus's head
        const v = vehicle(ph, p, x, .3), Po = pose(); Po.legs = v.moving ? (frame % 2 ? 'a' : 'b') : 'stand'; Po.look = [1, 0];
        if (ph === 'land' && p > .3) {Po.armR = 'wave'; Po.eyes = 'happy';}
        alpha(v.a, () => drawOpus(v.cx - 9, y - 10, Po));
        if (v.seated) {P.eyes = 'happy'; return rider(v.cx, y - 10, 0, P);}
        return rider(x, y, 0, P);
      }},
    {id: 'lid', who: 'crow', path: 'slide', speed: 70, board: .3, land: .8, need: (dx, dy) => dy > 20, sfx: T('wheee', 'ييييي'),
      draw(r, x, y, ph, p, P) {   // sledding on a jar lid, like the famous roof crow
        const skid = ph === 'land' ? Math.round(smooth(p) * 6) : 0, a = ph === 'land' && p > .6 ? 1 - (p - .6) / .4 : 1;
        alpha(a, () => {R(x - 6 + skid, y - 1, 12, 1, '#C8CCD2'); R(x - 5 + skid, y, 10, 1, '#9AA0A8');});
        P.armL = P.armR = 'fmid'; P.eyes = 'happy';
        return rider(x + (ph === 'land' && p > .5 ? 0 : skid), y - 1, 0, P);
      },
      trail(r, x, y) {if (Math.random() < .4) emit({kind: 'px', x: x - r.dir * 6, y: y - 1, vx: -r.dir * 15, vy: -6, g: 30, life: .4, c: '#E8EEF4'});}},
    {id: 'featherwarp', who: 'crow', path: 'warp', speed: 400, min: .5, max: .6, board: .5, land: .6,
      draw(r, x, y, ph, p, P) {
        if (ph === 'board' && !r.st.out) {r.st.out = 1; for (let i = 0; i < 9; i++) feather(r.sx + rnd(-8, 8), r.sy - rnd(4, 14));}
        if (ph === 'land' && !r.st.in) {r.st.in = 1; for (let i = 0; i < 8; i++) emit({kind: 'spark', x: r.tx + rnd(-10, 10), y: r.ty - rnd(2, 14), life: .5, c: '#B9A9FF'});}
        const k = ph === 'board' ? 1 - smooth(p) : ph === 'land' ? smooth(p) : 0;
        if (k > .02) alpha(k, () => rider(x, y, 0, P));
        return [x - 9, y - 10];
      }},
  ];
  RIDES.push(
    {id: 'broom', who: 'both', edition: 'halloween', path: 'fly', speed: 115, board: .4, land: .5, sfx: T('whoosh', 'ووووش'),
      draw(r, x, y, ph, p, P) {const a = ph === 'board' ? smooth(p * 2) : ph === 'land' ? 1 - smooth(p) : 1; P.legs = 'tuck'; const o = rider(x, y, 2, P); alpha(a, () => {line(x - 14, y - 1, x + 15, y - 4, '#7A4A2A'); for (let i = 0; i < 6; i++) line(x - 14, y - 1, x - 21, y - 4 + i, i % 2 ? '#D9A441' : '#B8862B');}); return o;},
      trail(r, x, y) {if (Math.random() < .5) emit({kind: 'spark', x: x - r.dir * 20, y: y - 2 + rnd(-2, 2), vx: -r.dir * 12, life: .6, c: any(['#9CFF57', '#B388FF'])});}},
    {id: 'cloud', who: 'both', edition: 'heaven', path: 'fly', speed: 70, board: .5, land: .7, sfx: T('floating', 'طفو'),
      draw(r, x, y, ph, p, P) {const a = ph === 'board' ? smooth(p * 2) : ph === 'land' ? 1 - smooth(p) : 1; P.legs = 'tuck'; P.eyes = 'happy'; const o = rider(x, y, 3, P); alpha(a, () => {for (const [dx, dy, rr] of [[-8, -1, 4], [-2, -3, 5], [5, -2, 4], [10, 0, 3], [-12, 1, 3]]) disc(x + dx, y + dy, rr, '#FFFFFF'); for (const [dx, dy, rr] of [[-4, 2, 3], [4, 2, 3]]) disc(x + dx, y + dy, rr, '#E3ECFF');}); return o;},
      trail(r, x, y) {if (Math.random() < .35) emit({kind: 'spark', x: x - r.dir * 14, y: y + rnd(-3, 1), vx: -r.dir * 8, life: .7, c: any(['#FFF6C9', '#CFE6FF', '#FFFFFF'])});}},
    {id: 'hoverboard', who: 'both', edition: 'rgb', path: 'ground', speed: 120, board: .35, land: .4, sfx: T('vrrrm', 'ڤررررم'),
      draw(r, x, y, ph, p, P) {const a = ph === 'board' ? smooth(p * 2) : ph === 'land' ? 1 - smooth(p) : 1, lift = Math.round(4 * a), o = rider(x, y, lift, P); R(x - 10, y - lift, 21, 2, '#1B1B22'); alpha(a, () => {for (let i = 0; i < 21; i++) P1(x - 10 + i, y - lift + 2, hsl(i * 17 + frame * 40));}); return o;},
      trail(r, x, y) {if (Math.random() < .7) emit({kind: 'spark', x: x - r.dir * 12, y: y + 1, vx: -r.dir * 10, life: .5, c: hsl(frame * 40 + rnd(0, 120))});}},
    {id: 'drone', who: 'both', edition: 'tactical', path: 'fly', speed: 100, board: .5, land: .5, sfx: T('bzzzz', 'بززززز'),
      draw(r, x, y, ph, p, P) {
        const a = ph === 'board' ? smooth(p * 2) : ph === 'land' ? 1 - smooth(p) : 1; P.armL = P.armR = 'up'; P.legs = 'dangle';
        const o = rider(x, y, 0, P), top = o[1];
        alpha(a, () => {const dy = top - 6, b = frame % 2; R(x - 5, dy, 11, 2, '#2E3326'); line(x - 5, dy, x - 11, dy - 2, '#2E3326'); line(x + 5, dy, x + 11, dy - 2, '#2E3326'); R(x - 15, dy - 3, 8, 1, b ? '#9AA08A' : '#5C6150'); R(x + 8, dy - 3, 8, 1, b ? '#5C6150' : '#9AA08A'); P1(x, dy + 2, '#FF3B3B'); line(x - 3, dy + 2, x - 7, top + 1, '#777777'); line(x + 3, dy + 2, x + 7, top + 1, '#777777');});
        return o;
      }},
    {id: 'capeflight', who: 'both', edition: 'comic', path: 'fly', speed: 150, board: .35, land: .45, sfx: T('to the sky!', 'إلى السماء!'),
      draw(r, x, y, ph, p, P) {P.armL = P.armR = 'up'; P.legs = 'tuck'; P.eyes = 'happy'; const w = Math.round(Math.sin(frame * 1.3) * 2); alpha(ph === 'go' ? 1 : .6, () => {for (let i = 0; i < 9; i++) R(x - 10 - i, y - 10 + Math.round(i * .4) + (i > 4 ? w : 0), 2, 7 - Math.round(i * .4), '#C8102E');}); return rider(x, y, 2, P);},
      trail(r, x, y) {if (Math.random() < .6) emit({kind: 'px', x: x - r.dir * 14, y: y - 4 + rnd(-5, 5), vx: -r.dir * 80, life: .25, c: '#FFFFFF', s: 1});}},
    {id: 'snail', who: 'both', edition: 'clay', path: 'ground', speed: 38, board: .5, land: .5, max: 4.5, sfx: T('slowly…', 'ببطء…'),
      draw(r, x, y, ph, p, P) {
        P.legs = 'tuck';
        R(x - 10, y - 2, 20, 2, '#9DBF6B'); R(x + 8, y - 6, 3, 4, '#9DBF6B'); line(x + 9, y - 6, x + 9, y - 9, '#9DBF6B'); line(x + 10, y - 6, x + 12, y - 9, '#9DBF6B'); P1(x + 9, y - 10, '#2A1D10'); P1(x + 12, y - 10, '#2A1D10');
        disc(x - 2, y - 7, 5, '#C76B45'); disc(x - 2, y - 7, 3, '#E08A5F'); disc(x - 2, y - 7, 1, '#9A4B2E');
        return rider(x, y, 9, P);
      },
      trail(r, x, y) {if (Math.random() < .3) emit({kind: 'px', x: x - r.dir * 10, y: y - 1, life: 1.6, c: 'rgba(200,230,170,.7)', s: 1});}},
  );
  const JUMP = RIDES.find(r => r.id === 'jump');
  const rideBag = bag(RIDES.filter(r => !r.basic)), basicBag = bag(RIDES.filter(r => r.basic));

  // ── lines ─────────────────────────────────────────────────────────────────────────────────────
  const path = location.pathname;
  const page = /\/world(\/|$)/.test(path) ? 'world' : /\/space(\/|$)/.test(path) ? 'space' : /\/motion\/[a-z-]+\/?$/.test(path) || root.classList.contains('nf-player') ? 'film' : document.querySelector('.nf-bill') || /\/motion\/?$/.test(path) ? 'gallery' : /\/(en|ar)\/?$/.test(path) ? 'home' : 'other';
  const XO_ASK = T('Bored? Let’s play X O. I’ll go easy on you. I won’t.', 'زهقان؟ نلعب إكس أو. سأتساهل معك. لن أتساهل.');
  const L = {
    opus: {
      any: [
        T('I’m the warehouse guy. I move pixels. Unpaid.', 'أنا عامل المستودع. أنقل البكسلات. بلا أجر.'),
        T('Everything here is real software. Even me. Sort of.', 'كل شيء هنا برمجيات حقيقية. حتى أنا. تقريباً.'),
        T('Click me again. I have nothing else going on.', 'انقر مرة أخرى. ليس عندي ما أفعله غير هذا.'),
        T('You scroll, I follow. Spaceship, horse carriage, tuk-tuk. I don’t do stairs.', 'أنت تمرّر وأنا ألحقك. مركبة فضائية، حنطور، توكتوك. لا أصعد السلالم.'),
        XO_ASK,
        T('Mohamed built fifteen apps. I built a tolerance to caffeine.', 'بنى محمد خمسة عشر تطبيقاً. وأنا بنيت مناعة ضد القهوة.'),
        T('Four legs, zero meetings. Living the dream.', 'أربع أرجل، صفر اجتماعات. أعيش الحلم.'),
        T('If a button runs away from you, that’s character development.', 'إذا هرب منك زر، فهذا تطوير للشخصية.'),
      ],
      gallery: [T('It’s Netflix, except every show here actually shipped.', 'إنه نتفليكس، لكن كل عرض هنا شُحن فعلاً.'), T('Hover a card. I’ll sit on it.', 'مرّر فوق بطاقة. وسأجلس عليها.'), T('Top pick is MK Suite. He made me say that. He was right.', 'الاختيار الأول MK Suite. أجبرني على قولها. وكان محقاً.')],
      film: [T('Press Space. I’ll take the credit.', 'اضغط المسافة. وسأنسب الفضل لنفسي.'), T('Those ticks on the bar are chapters, detective.', 'تلك العلامات على الشريط فصول، يا محقق.'), T('Yes, that’s the real app. No mock-ups were harmed.', 'نعم، هذا التطبيق الحقيقي. لم يُصب أي نموذج وهمي بأذى.')],
      world: [T('Five minutes of 3D and I’m eighteen pixels wide. Life is unfair.', 'خمس دقائق من الأبعاد الثلاثية وعرضي ثمانية عشر بكسل. الحياة ظالمة.'), T('Drag the glass mark. It’s not insured.', 'اسحب الشعار الزجاجي. إنه غير مؤمَّن.')],
      home: [T('Scroll. The film doesn’t watch itself.', 'مرّر. الفيلم لا يشاهد نفسه.'), T('That glass MK? I polish it every night.', 'ذلك الشعار الزجاجي؟ ألمّعه كل ليلة.')],
      classic: [T('The classic site. Like vinyl, for people who read.', 'الموقع الكلاسيكي. مثل الأسطوانات، لمن يحب القراءة.')],
    },
    crow: {
      any: [
        T('Caw. That’s crow for “hire him”.', 'قاق. هذه بلغة الغربان: “وظّفوه”.'),
        T('I collect shiny things. This portfolio qualifies.', 'أجمع الأشياء اللامعة. وهذا المعرض مؤهَّل.'),
        XO_ASK,
        T('Nevermore… boring portfolios.', 'لا مزيد… من المعارض المملة.'),
        T('I’m Opus’s evil twin. Same block, better beak.', 'أنا التوأم الشرير لأوبس. نفس المكعب، منقار أفضل.'),
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

  // ── the pill ──────────────────────────────────────────────────────────────────────────────────
  const dock = document.createElement('div');
  dock.className = 'mk-dock'; dock.setAttribute('role', 'group'); dock.setAttribute('aria-label', T('Site style', 'نمط الموقع'));
  const modeBtn = document.createElement('button'), palBtn = document.createElement('button');
  modeBtn.type = palBtn.type = 'button';
  const palIcon = document.createElement('canvas'); palIcon.width = 18; palIcon.height = 12;
  palBtn.append(palIcon);
  const modeLabel = document.createElement('span'), palLabel = document.createElement('span');
  dock.append(modeBtn, palBtn);
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  function icon(canvas, who) {const keep = g; g = canvas.getContext('2d'); g.clearRect(0, 0, canvas.width, canvas.height); const P = pose(); P.legs = 'tuck'; drawChar(who, 0, 2, P); g = keep;}
  function paintDock() {
    const white = root.dataset.siteMode === 'white';
    modeBtn.innerHTML = white ? moon : sun;
    modeLabel.textContent = white ? T('Crow mode', 'وضع الغراب') : T('White mode', 'الوضع الأبيض');
    modeBtn.append(modeLabel); modeBtn.setAttribute('aria-label', modeLabel.textContent);
    icon(palIcon, kind === 'crow' ? 'opus' : 'crow');
    palLabel.textContent = kind === 'off' ? T('Call Opus', 'استدعِ أوبس') : kind === 'crow' ? T('Swap to Opus', 'بدّل إلى أوبس') : T('Swap to Crow', 'بدّل إلى الغراب');
    palBtn.append(palLabel); palBtn.setAttribute('aria-label', palLabel.textContent);
  }
  function setMode(mode, from) {
    const apply = () => {
      root.dataset.siteMode = mode; store('mk-mode', mode);
      if (document.querySelector('[data-theme-menu]') || recall('mm-theme')) {   // the classic site's own theme follows
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
      document.startViewTransition(apply).finished.finally(() => root.classList.remove('mk-switching'));
    } else apply();
    if (mode === 'crow') flock(3);
  }
  modeBtn.addEventListener('click', () => setMode(root.dataset.siteMode === 'white' ? 'crow' : 'white', modeBtn));
  palBtn.addEventListener('click', () => setCompanion(kind === 'opus' ? 'crow' : 'opus'));

  // passing crows (Crow mode with Opus, and the flock when you switch to Crow mode)
  const visitors = [];
  function flock(n) {if (still) return; const left = Math.random() < .5; for (let i = 0; i < n; i++) visitors.push({x: left ? -14 - i * 24 : W + 14 + i * 24, y: rnd(20, Math.max(26, H * .28)) + i * 6, vx: (left ? 1 : -1) * rnd(50, 70), ph: Math.random() * 6});}

  // ── the companion ─────────────────────────────────────────────────────────────────────────────
  let floorAt = 0, floorVal = 0;
  function floorPx() {
    const now = performance.now();
    if (now - floorAt < 250) return floorVal;
    floorAt = now;
    let top = innerHeight - 8;
    // stand on the player's progress bar (not its gradient), the World HUD, or the home film's dock
    for (const [s, owner] of [['.nf-timeline', '.film-controls'], ['.portfolio-film-dock', '.film-controls'], ['.world-hud', null]]) {
      const el = document.querySelector(s);
      if (!el) continue;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(owner ? el.closest(owner) || el : el);
      if (r.height && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > .3 && r.top > innerHeight * .5) top = Math.min(top, r.top - 4);
    }
    return (floorVal = top);
  }
  const floorU = () => Math.floor(floorPx() / U);
  const topU = () => 16;   // hanging off the top edge
  const fresh = () => attention.t && performance.now() - attention.t < 12000;
  function lookAt() {
    if (!fresh()) return C.idleLook;
    const dx = attention.x - (C.ox + 9) * U, dy = attention.y - (C.oy + 3) * U;
    return [Math.abs(dx) < 24 ? 0 : Math.sign(dx), dy < -60 ? -1 : dy > 60 ? 1 : 0];
  }
  function setCompanion(next) {
    kind = next; root.dataset.companion = next; store('mk-companion', next);
    closeBubble(); xoClose(true); stopAct(); endRide(true); C.on = null; C.mode = 'idle'; C.until = performance.now() + 900; C.why = 'arrive';
    world.hidden = hit.hidden = next === 'off';
    if (next !== 'off') dust(C.x, C.y, 8);
    paintDock();
  }

  // input: where you are looking, and whether a scroll is yours (autoplay scrolls are ignored)
  addEventListener('pointermove', e => {if (e.pointerType === 'mouse') {attention.x = e.clientX; attention.y = e.clientY; attention.t = performance.now();} lastInput = performance.now();}, {passive: true});
  addEventListener('pointerdown', e => {
    attention.x = e.clientX; attention.y = e.clientY; attention.t = lastInput = performance.now();
    const mine = hit.contains(e.target) || bubble?.contains(e.target) || e.target.closest?.('.mk-xo');
    if (!mine) {lastTap = performance.now(); if (stolen.length) giveBack();}
    if (bubble && !bubble.contains(e.target) && !hit.contains(e.target)) closeBubble();
    if (C.act?.def.id === 'sleep') wake();
  }, {passive: true});
  addEventListener('touchmove', e => {const t = e.touches[0]; if (t) {attention.x = t.clientX; attention.y = t.clientY; attention.t = performance.now();} lastInput = performance.now();}, {passive: true});
  for (const t of ['wheel', 'keydown']) addEventListener(t, () => {lastInput = performance.now(); if (C.act?.def.id === 'sleep') wake();}, {passive: true});
  addEventListener('scroll', () => {
    const dy = scrollY - lastScrollY, now = performance.now(); lastScrollY = scrollY;
    if (kind === 'off' || still || !dy || now - lastInput > 1200) return;
    lastScroll = now;
    if (stolen.length) giveBack();
    if (C.mode === 'held' || xo) return;
    if (C.mode !== 'carried') {endRide(true); stopAct(); C.next = C.then = null; C.mode = 'carried'; C.scrolled = 0; C.vy = 0;}
    C.scrolled += Math.abs(dy);
    if (!C.on) C.y = clamp(C.y - dy / U, topU(), floorU());   // standing on the page, so the page carries it
  }, {passive: true});
  function wake() {stopAct(); C.mode = 'idle'; C.until = performance.now() + 1400; C.why = 'wake';}

  // travelling: pick a ride for the distance and the destination, then go
  function travel(tx, ty, el = null, then = null) {
    const now = performance.now(), floor = floorU(), dx = tx - C.x, dy = ty - C.y, d = Math.hypot(dx, dy), level = Math.abs(dy) < 3;
    C.then = then; C.next = null;
    if (d < 3) {if (el) perch(el, tx); C.y = ty; return arrive(now);}
    const ed = root.dataset.edition || '', ok = r => (r.who === 'both' || r.who === kind) && (!r.need || r.need(dx, dy)) && (!r.edition || r.edition === ed);
    const small = d < 45 || (C.scrolled < 50 && d < 70);
    let def = (small ? basicBag(r => ok(r) && (level || r.path !== 'ground')) : rideBag(ok)) || JUMP;
    if (!small && ed) {const own = RIDES.filter(r => r.edition === ed && ok(r)); if (own.length && Math.random() < .45) def = any(own);}   // an edition likes its own ride
    if (def.path === 'ground' && !level && ty < floor - 2) {C.next = {x: tx, y: ty, el}; startRide(def, now, tx, floor, null);}   // drive below it, then jump up
    else startRide(def, now, tx, ty, el);
  }
  // where to go after a scroll: the frame or title nearest to you (or the floor beside your thumb)
  function follow(now) {
    const a = fresh() ? attention : {x: C.x * U, y: innerHeight * .5}, list = perches();
    let best = null, bestD = Infinity;
    for (const p of list) {
      const dx = a.x < p.r.left ? p.r.left - a.x : a.x > p.r.right ? a.x - p.r.right : 0, dy = a.y < p.r.top ? p.r.top - a.y : a.y > p.r.bottom ? a.y - p.r.bottom : 0;
      const d = Math.hypot(dx, dy) + (p.type === 'title' ? 50 : 0) + (p.el === C.on ? -40 : 0) + (p.el.closest('.mk-bait') ? -90 : 0) + Math.random() * 40;
      if (d < bestD) {bestD = d; best = p;}
    }
    if (best && bestD < 320 && Math.random() < .85) {
      const x = clamp(a.x, best.r.left + 28, best.r.right - 28) / U;
      if (best.el === C.on && Math.abs(x - C.x) < 10) return idle(now, rnd(2500, 4000), 'arrive');
      return travel(x, best.r.top / U, best.el);
    }
    C.on = null;
    const ax = a.x / U, s = ax > W / 2 ? 1 : -1;
    let tx = ax + s * 26;
    if (Math.abs(tx - C.x) < 22) tx = ax - s * 26;
    travel(clamp(tx, 16, W - 16), floorU(), null);
  }
  function chase(el) {
    const now = performance.now();
    if (kind === 'off' || still || !el?.isConnected || xo || C.mode === 'held' || now - C.chaseAt < 1800 || C.act?.def.once) return;
    const r = el.getBoundingClientRect();
    if (r.width < 60 || r.top < 30 || r.top > innerHeight - 40) return;
    C.chaseAt = now; stopAct(); endRide(true);
    travel(clamp(attention.t ? attention.x : r.left + r.width / 2, r.left + 28, r.right - 28) / U, r.top / U, el);
  }
  function goto(el, then) {const r = el.getBoundingClientRect(); stopAct(); endRide(true); travel(clamp(r.left + 40, r.left + 20, r.right - 20) / U, r.top / U, el, then);}
  function startRide(def, now, tx, ty, el) {
    const lvl = def.path === 'ground' ? ty : null, drop = lvl !== null && lvl - C.y > 2 ? Math.sqrt(2 * (lvl - C.y) / GRAV) : 0, sy = drop ? lvl : C.y;
    const dist = Math.hypot(tx - C.x, def.path === 'ground' ? 0 : ty - sy);
    C.on = null;
    C.ride = {def, t0: now, sx: C.x, y0: C.y, sy, tx, ty, el, dir: tx >= C.x ? 1 : -1, drop, board: def.board ?? .4, go: clamp(dist / def.speed, def.min ?? .7, def.max ?? 3.4), land: def.land ?? .5,
      hops: def.hops ? Math.max(1, Math.round(Math.abs(tx - C.x) / 16)) : 0, st: {}, phase: drop ? 'drop' : 'board', p: 0};
    C.dir = C.ride.dir; C.mode = 'ride';
  }
  function ridePath(r, p) {
    const s = smooth(p);
    switch (r.def.path) {
      case 'ground': return [r.sx + (r.tx - r.sx) * s, r.ty - (r.hops ? Math.abs(Math.sin(p * Math.PI * r.hops)) * (r.def.hopH ?? 8) : 0)];
      case 'jump': {const k = 10 + Math.max(0, r.sy - r.ty) * .55; return [r.sx + (r.tx - r.sx) * p, Math.max(4, r.sy + (r.ty - r.sy) * p - 4 * p * (1 - p) * k)];}
      case 'fall': return [r.sx + (r.tx - r.sx) * s + Math.sin(p * 8) * 5 * (1 - p), r.sy + (r.ty - r.sy) * p];
      case 'slide': return [r.sx + (r.tx - r.sx) * p * p, r.sy + (r.ty - r.sy) * p * p];
      case 'warp': return p < .5 ? [r.sx, r.sy] : [r.tx, r.ty];
      default: {const arc = Math.min(40, 8 + Math.hypot(r.tx - r.sx, r.ty - r.sy) * .3) * (r.sy < r.ty - 20 ? .35 : 1); return [r.sx + (r.tx - r.sx) * s, Math.max(topU() - 2, r.sy + (r.ty - r.sy) * s - Math.sin(p * Math.PI) * arc)];}
    }
  }
  function stepRide(now) {
    const r = C.ride, e = (now - r.t0) / 1000, t1 = r.drop, t2 = t1 + r.board, t3 = t2 + r.go, t4 = t3 + r.land;
    if (e < t1) {r.phase = 'drop'; r.p = e / t1; C.x = r.sx; C.y = Math.min(r.sy, r.y0 + .5 * GRAV * e * e);}
    else if (e < t2) {if (r.phase === 'drop') dust(C.x, r.sy); r.phase = 'board'; r.p = (e - t1) / r.board; C.x = r.sx; C.y = r.sy;}
    else if (e < t3) {if (r.phase !== 'go') {sfx(r.def.sfx); if (r.phase === 'drop') dust(C.x, r.sy);} r.phase = 'go'; r.p = (e - t2) / r.go; [C.x, C.y] = ridePath(r, r.p); r.def.trail?.(r, C.x, C.y);}
    else if (e < t4) {r.phase = 'land'; r.p = (e - t3) / r.land; C.x = r.tx; C.y = r.ty;}
    else endRide();
  }
  function endRide(aborted) {
    const r = C.ride; if (!r) return;
    C.ride = null;
    if (aborted) {dust(C.x, C.y, 6); return;}
    C.x = r.tx; C.y = r.ty;
    if (r.el?.isConnected) perch(r.el, r.tx);
    if (C.next) {const n = C.next; C.next = null; return startRide(JUMP, performance.now(), n.x, n.y, n.el);}
    arrive(performance.now());
  }
  function arrive(now) {
    const then = C.then; C.then = null;
    if (then) return then();
    idle(now, C.on ? rnd(3000, 5000) : rnd(1400, 2400), 'arrive');   // sits and looks at you for a bit
  }
  // routines
  function idle(now, ms, why = '') {C.mode = 'idle'; C.until = now + ms; C.why = why; C.act = null;}
  function startAct(def, now, ms) {
    const st = {kind, t0: now, lookUser: lookUser()};
    C.act = {def, st, end: now + (ms ?? rnd(def.dur[0], def.dur[1]) * 1000), said: false}; C.mode = 'act';
    try {def.start?.(st);} catch {C.act = null; idle(now, 1500);}
  }
  function stopAct() {const a = C.act; if (!a) return; C.act = null; try {a.def.end?.(a.st);} catch {} clearPops();}
  function endAct() {stopAct(); idle(performance.now(), C.on ? rnd(2500, 4500) : rnd(1800, 3600));}
  function nextAct(now) {
    if (!greeted) {greeted = true; return startAct(ACT.hello, now);}
    if (now - lastInput > 45000) return startAct(ACT.sleep, now, 864e5);
    const here = C.on ? C.onType : 'floor';
    // perched on a frame: sometimes hop to the next one
    if (C.on && here === 'frame' && Math.random() < .25) {
      const me = C.on.getBoundingClientRect(), near = perches().filter(p => p.el !== C.on && p.type === 'frame' && Math.abs(p.r.top - me.top) < 260 && Math.abs(p.r.left - me.left) < 460);
      if (near.length) {const p = any(near); return travel(clamp((p.r.left + p.r.right) / 2 + rnd(-30, 30), p.r.left + 24, p.r.right - 24) / U, p.r.top / U, p.el);}
    }
    if (here === 'frame' && Math.random() < (root.dataset.edition ? .8 : .25) && safe(ACT.spell.can)) return startAct(ACT.spell, now);
    const fits = a => a.id !== 'spell' && (a.who === 'both' || a.who === kind) && (!a.on || a.on === here || (a.on === 'perch' && (here === 'frame' || here === 'title'))) && (!a.can || safe(a.can));
    const mischief = here !== 'floor' && Math.random() < .75;
    startAct(actBag(a => fits(a) && (!mischief || !!a.on)) || actBag(fits) || ACT.code, now);
  }

  // talking (only when clicked)
  function say() {
    if (xo) return;
    closeBubble(); clicks++;
    const set = L[kind === 'crow' ? 'crow' : 'opus'], pool = [...(set[page] || []), ...set.any];
    const special = clicks === 7 ? T('Okay, you clearly like me. Go watch a film.', 'حسناً، واضح أنك تحبني. اذهب وشاهد فيلماً.') : clicks === 1 ? night() : clicks === 3 ? XO_ASK : null;
    const doing = C.act && !C.act.said && C.act.def.say ? (C.act.said = true, C.act.def.say) : null;
    const text = doing || special || pool[lineIndex++ % pool.length];
    bubble = document.createElement('div');
    bubble.className = 'mk-bubble'; bubble.setAttribute('role', 'status');
    const motion = `${base}/${ar ? 'ar' : 'en'}`;
    bubble.innerHTML = `<b>${kind === 'crow' ? T('Crow', 'الغراب') : 'Opus'}</b><p></p><nav>
      <button type="button" data-xo>${T('Play X O', 'نلعب إكس أو')}</button>
      <button type="button" data-more>${T('Another one', 'واحدة أخرى')}</button>
      ${page !== 'gallery' ? `<a href="${motion}">${T('Show me the films', 'أرني الأفلام')}</a>` : ''}
      <a href="mailto:medo433447@gmail.com">${T('Contact Mohamed', 'تواصل مع محمد')}</a>
      <button type="button" data-swap>${kind === 'crow' ? T('Send Opus', 'أرسل أوبس') : T('Send the crow', 'أرسل الغراب')}</button>
      <button type="button" data-bye>${T('Go away', 'ابتعد')}</button></nav>`;
    bubble.querySelector('p').textContent = text;
    layer().append(bubble);
    bubble.dataset.w = bubble.offsetWidth; bubble.dataset.h = bubble.offsetHeight;
    placeBubble();
    bubble.querySelector('[data-xo]').addEventListener('click', e => {e.stopPropagation(); xoStart();});
    bubble.querySelector('[data-more]').addEventListener('click', e => {e.stopPropagation(); say();});
    bubble.querySelector('[data-swap]').addEventListener('click', e => {e.stopPropagation(); setCompanion(kind === 'crow' ? 'opus' : 'crow');});
    bubble.querySelector('[data-bye]').addEventListener('click', e => {e.stopPropagation(); setCompanion('off');});
  }
  function placeBubble() {
    if (!bubble) return;
    const w = +bubble.dataset.w, h = +bubble.dataset.h, cx = (C.ox + 9) * U, left = clamp(cx - w / 2, 10, innerWidth - w - 10);
    bubble.style.left = `${left}px`; bubble.style.top = `${Math.max(10, (C.oy - 3) * U - h - 14)}px`;
    bubble.style.setProperty('--tail', `${clamp(cx - left, 16, w - 16)}px`);
  }
  function closeBubble() {bubble?.remove(); bubble = null;}

  // drag and drop (a short press is a click)
  hit.addEventListener('pointerdown', e => {C.held = {sx: e.clientX, sy: e.clientY, at: performance.now(), moved: false, dx: e.clientX / U - C.x, dy: e.clientY / U - C.y}; hit.setPointerCapture(e.pointerId);});
  hit.addEventListener('pointermove', e => {
    const h = C.held; if (!h) return;
    if (!h.moved && Math.hypot(e.clientX - h.sx, e.clientY - h.sy) > 6) {h.moved = true; endRide(true); if (!xo) stopAct(); closeBubble(); C.on = null; C.mode = 'held';}
    if (h.moved) {C.x = clamp(e.clientX / U - h.dx, 12, W - 12); C.y = clamp(e.clientY / U - h.dy, 14, floorU());}
  });
  const release = () => {const h = C.held; C.held = null; if (!h) return; if (h.moved) {C.mode = 'fall'; C.vy = 0;} else if (performance.now() - h.at < 500) say();};
  hit.addEventListener('pointerup', release);
  hit.addEventListener('pointercancel', release);
  hit.addEventListener('keydown', e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); say();}});

  // ── it follows you into the previews and the details sheet ────────────────────────────────────
  function rehome() {
    const modal = [...document.querySelectorAll('dialog[open]')].reverse().find(d => safe(() => d.matches(':modal')));
    const next = modal || document.body;
    if (next === layerHost) return;
    layerHost = next;
    for (const el of [fxc, world, hit, bubble, ...pops.map(p => p.el), xo?.el]) if (el) next.append(el);
    if (C.on && !next.contains(C.on) && modal) C.on = null;
    if (modal) setTimeout(() => chase(modal.querySelector('.nf-sheet-media, figure, img, video') || modal), 380);
    else if (C.on && !C.on.isConnected) C.on = null;
  }
  new MutationObserver(rehome).observe(document.documentElement, {subtree: true, attributes: true, attributeFilter: ['open']});
  const preview = document.querySelector('[data-pop]');
  if (preview) new MutationObserver(() => {if (!preview.hidden && preview.classList.contains('is-in')) setTimeout(() => {if (preview.classList.contains('is-in')) chase(preview.querySelector('.nf-pop-media') || preview);}, 260);}).observe(preview, {attributes: true, attributeFilter: ['class', 'hidden']});

  // ── the loop ──────────────────────────────────────────────────────────────────────────────────
  function followPerch(floor) {
    const el = C.on; if (!el) return;
    const r = el.isConnected ? el.getBoundingClientRect() : null;
    if (!r || !r.width || r.top < topU() * U - 6 || r.top > (floor + 1) * U || r.right < 16 || r.left > innerWidth - 16 || !visible(el)) {
      C.on = null;
      if (C.mode === 'idle' || (C.mode === 'act' && !C.act.def.once)) {stopAct(); C.mode = 'fall'; C.vy = 0;}
      return;
    }
    C.onDx = clamp(C.onDx, 10, Math.max(10, r.width - 10));
    C.x = (r.left + C.onDx) / U; C.y = r.top / U;
  }
  function update(now, dt, floor) {
    if (still) {if (C.mode !== 'held') {C.mode = xo ? C.mode : 'idle'; if (!C.on) C.y = floor;} followPerch(floor); return;}
    if (C.on && C.mode !== 'ride' && C.mode !== 'held' && C.mode !== 'fall' && !C.act?.st.free) followPerch(floor);
    switch (C.mode) {
      case 'carried': if (now - lastScroll > 320) {C.mode = 'brace'; C.until = now + (C.scrolled > 40 ? 300 : 120);} break;
      case 'brace': if (now > C.until) follow(now); break;
      case 'ride': stepRide(now); break;
      case 'held': break;
      case 'fall': C.vy += GRAV * dt; C.y += C.vy * dt; if (C.y >= floor) {C.y = floor; C.vy = 0; dust(C.x, floor); if (kind === 'crow') feather(C.x, floor - 8); idle(now, 900, 'land');} break;
      case 'act': {let r; try {r = C.act.def.tick?.((now - C.act.st.t0) / 1000, C.act.st, dt);} catch {r = 'done';} if (C.act && (r === 'done' || now > C.act.end)) endAct();} break;
      default: if (now > C.until && !bubble) {if (xo) startAct(ACT.xo, now, 36e5); else nextAct(now);}
    }
    if ((C.mode === 'idle' || C.mode === 'act') && !C.on && !C.act?.st.free) {
      if (C.y < floor - .5) {C.vy += GRAV * dt; C.y = Math.min(floor, C.y + C.vy * dt); if (C.y >= floor) C.vy = 0;} else {C.y = floor; C.vy = 0;}
    }
    C.x = clamp(C.x, 12, W - 12);
    if (now > C.lookAt) {C.lookAt = now + rnd(900, 2200); C.idleLook = any([[-1, 0], [1, 0], [0, 0], [0, 1], [1, -1], [-1, -1], [0, 0]]);}
    for (let i = visitors.length - 1; i >= 0; i--) {const v = visitors[i]; v.x += v.vx * dt; v.ph += dt; if (Math.random() < .012) feather(v.x, v.y - 2); if (v.x < -60 || v.x > W + 60) visitors.splice(i, 1);}
    const calm = (C.mode === 'idle' || (C.mode === 'act' && !C.act.def.on && !C.act.def.once)) && !bubble && !xo;
    // staring at a frame or a title with the mouse: it comes and sits on it
    if (calm && hoverable && attention.t && now - attention.t > 1400 && now - C.stareAt > 6000) {
      C.stareAt = now;
      const el = perchAt(attention.x, attention.y);
      if (el && el !== C.on) {const r = el.getBoundingClientRect(); stopAct(); travel(clamp(attention.x, r.left + 24, r.right - 24) / U, r.top / U, el);}
    }
    // ten quiet seconds on the same text: it steals some of what you have read
    if (calm && now - Math.max(lastScroll, lastTap) > 10000 && now - lastTheft > 25000) {
      lastTheft = now;
      const blocks = readable(), read = blocks.filter(b => b.r.bottom < (attention.t && hoverable ? attention.y : innerHeight * .62));
      const b = any(read.length ? read : blocks), def = b && theftBag(a => a.who === 'both' || a.who === kind);
      if (b && def) goto(b.el, () => {if (C.on === b.el && safe(def.can)) startAct(def, performance.now()); else idle(performance.now(), 1500);});
    }
  }
  function render(now) {
    g.clearRect(0, 0, W, H);
    const ed = root.dataset.edition;
    for (const [i, v] of visitors.entries()) {
      const vx = Math.round(v.x), vy = Math.round(v.y + Math.sin(v.ph * 3) * 2);
      if (ed === 'halloween' || ed === 'heaven') {const big = ed === 'halloween' ? SPRITES.bat : SPRITES.dove, fr = big[(frame + i) % 2], pal = critPal(ed === 'halloween' ? 'bat' : 'dove'); mirror(vx, Math.sign(v.vx), () => {for (let r2 = 0; r2 < fr.length; r2++) for (let c2 = 0; c2 < fr[r2].length; c2++) if (pal[fr[r2][c2]]) R(vx - 7 + c2 * 2, vy - 4 + r2 * 2, 2, 2, pal[fr[r2][c2]]);});}
      else {const P = pose(); P.armL = P.armR = ['fup', 'fmid', 'fdown', 'fmid'][(frame + i) % 4]; P.legs = 'tuck'; P.look = [Math.sign(v.vx), 0]; drawCrow(vx - 9, vy - 10, P);}
    }
    if (kind !== 'off') {
      const floor = floorU(), x = Math.round(C.x), y = Math.round(C.y), P = pose();
      P.look = lookAt();
      P.breath = C.mode === 'idle' || C.mode === 'act' ? Math.floor(now / 900) % 2 : 0;
      if (now > C.blinkAt) {C.blinkUntil = now + 130; C.blinkAt = now + rnd(2600, 5200);}
      const blink = now < C.blinkUntil;
      if (C.mode !== 'ride' || C.ride.def.path !== 'warp') {const gy = C.on ? y : floor, h = Math.max(0, gy - y), w = Math.max(4, 14 - Math.round(h / 3)); alpha(.22 * clamp(1 - h / 90, .25, 1), () => {R(x - (w >> 1), gy - 1, w, 1, '#000'); R(x - (w >> 1) + 2, gy, w - 4, 1, '#000');});}
      let o = null;
      switch (C.mode) {
        case 'ride': {
          const r = C.ride;
          if (r.phase === 'drop') {P.legs = 'dangle'; P.armL = P.armR = frame % 2 ? 'up' : 'wave'; P.eyes = 'wide'; o = rider(x, y, 0, P); break;}
          if (r.phase === 'go' || r.phase === 'board') P.look = [1, 0];
          mirror(x, r.dir, () => {o = r.def.draw(r, x, y, r.phase, r.p, P, (now - r.t0) / 1000);});
          if (o && r.dir < 0) o = [2 * x - 17 - o[0], o[1]];
          break;
        }
        case 'carried': case 'brace': {
          if (!C.on && C.y <= topU() + .5) {P.armL = P.armR = 'hang'; P.legs = 'dangle'; P.eyes = 'wide';}
          else if (C.mode === 'brace') {P.breath = 1; P.armL = P.armR = 'down';}
          else if (C.on) P.sit = 1;
          else {P.armL = P.armR = 'up'; P.eyes = C.y < floor - 2 ? 'happy' : 'open';}
          if (P.sit) {P.legs = 'dangle'; o = rider(x, y, -2, P);} else o = rider(x, y, 0, P);
          if (C.mode === 'brace') glyph('!', o[0] + 9, o[1] - 8, '#FFD34D');
          break;
        }
        case 'held': P.legs = 'dangle'; P.armL = P.armR = 'up'; P.eyes = 'wide'; o = rider(x, y, 0, P); break;
        case 'fall': P.legs = 'dangle'; P.armL = P.armR = frame % 2 ? 'up' : 'wave'; P.eyes = 'wide'; o = rider(x, y, 0, P); break;
        case 'act': {
          const a = C.act, t = (now - a.st.t0) / 1000;
          safe(() => a.def.pose?.(t, P, a.st));
          if (blink && P.eyes === 'open') P.eyes = 'blink';
          if (P.sit && P.legs === 'stand') P.legs = 'dangle';
          const bx = x - 9, by = y - 10, ox = bx + (P.x || 0), oy = by + (P.y || 0) + (P.sit ? 2 : 0), ob = {bx, by, ox, oy, top: topOf(oy, P)};
          safe(() => a.def.back?.(t, ob, a.st, P));
          if (a.def.self) safe(() => a.def.self(t, ob, P, a.st)); else drawChar(kind, ox, oy, P);
          safe(() => a.def.front?.(t, ob, a.st, P));
          o = [ox, oy];
          break;
        }
        default: {
          if (C.why === 'arrive' && C.until - now > 900) P.eyes = 'happy';
          if (C.why === 'wake' && C.until - now > 700) P.eyes = 'wide';
          if (bubble) P.armR = frame % 4 < 2 ? 'wave' : 'up';
          if (blink && P.eyes === 'open') P.eyes = 'blink';
          if (C.on) {P.legs = 'dangle'; o = rider(x, y, -2, P);} else o = rider(x, y, 0, P);   // sitting on the frame's edge, legs over it
        }
      }
      if (o) {C.ox = o[0]; C.oy = o[1];}
    }
    for (const c of critters) {const r = c.el.isConnected ? c.el.getBoundingClientRect() : null; if (r) safe(() => c.draw((now - c.t0) / 1000, r));}
    drawParts();
  }
  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (now - frameAt > 100) {frameAt = now; frame++;}
    const floor = floorU();
    if (kind !== 'off') update(now, dt, floor);
    stepParts(dt, floor);
    const busy = critters.length || C.mode === 'ride' || parts.length || visitors.length || C.mode === 'held' || C.mode === 'fall' || C.mode === 'carried' || C.act?.st.free;
    if (now - drawAt > (busy ? 15 : 32)) {drawAt = now; render(now);}
    fxStep(now, dt);
    hit.style.transform = `translate(${C.ox * U - 4}px, ${(C.oy - 1) * U - 4}px)`;
    placePops(now); placeBubble(); baitPlace();
    for (const d of decos) d.place();
  }

  // ── the page bullies you too: buttons that do not want to be pressed ──────────────────────────
  const BTN = 'button, [role=button], a.nf-btn, a[class*="btn"], a[class*="button"], input[type=submit], input[type=button]';
  const spared = new WeakMap();
  let prankAt = -30000, prankOn = null, blocked = null;
  const anim = (el, frames, opts) => safe(() => el.animate(frames, {duration: 700, easing: 'cubic-bezier(.2,.9,.3,1.2)', ...opts}).finished.catch(() => {})) || Promise.resolve();
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function away(btn, e, dist) {
    const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let dx = cx - (e?.clientX ?? cx - 1), dy = cy - (e?.clientY ?? cy);
    const d = Math.hypot(dx, dy) || 1;
    dx = clamp(dx / d * dist, 8 - r.left, innerWidth - 8 - r.right); dy = clamp(dy / d * dist, 8 - r.top, innerHeight - 8 - r.bottom);
    return [dx, dy];
  }
  const press = btn => {blocked = null; safe(() => btn.click());};   // the gag is over: do what you asked
  const PRANKS = [
    {id: 'dodge', move: true, run: (b, e) => {const [dx, dy] = away(b, e, 90); return anim(b, [{translate: '0 0'}, {translate: `${dx}px ${dy}px`, offset: .22}, {translate: `${dx}px ${dy}px`, offset: .78}, {translate: '0 0'}], {duration: 1800});}},
    {id: 'shy', run: b => {tip(b, T('too shy…', 'مكسوف…')); return anim(b, [{scale: '1', rotate: '0deg'}, {scale: '.35', rotate: '-4deg', offset: .2}, {scale: '.35', rotate: '4deg', offset: .4}, {scale: '.35', rotate: '-4deg', offset: .6}, {scale: '.35', rotate: '0deg', offset: .8}, {scale: '1', rotate: '0deg'}], {duration: 1600});}},
    {id: 'spin', run: b => anim(b, [{rotate: '0deg'}, {rotate: '720deg'}], {duration: 1000, easing: 'cubic-bezier(.5,0,.3,1)'})},
    {id: 'flip', run: b => {tip(b, T('wrong way up', 'بالمقلوب')); return anim(b, [{rotate: '0deg'}, {rotate: '180deg', offset: .15}, {rotate: '180deg', offset: .85}, {rotate: '360deg'}], {duration: 1700});}},
    {id: 'peek', move: true, run: b => {const r = b.getBoundingClientRect(), s = r.left + r.width / 2 < innerWidth / 2 ? -1 : 1, far = s < 0 ? -(r.right + 20) : innerWidth - r.left + 20; return anim(b, [{translate: '0 0', rotate: '0deg'}, {translate: `${far}px 0`, offset: .2}, {translate: `${far}px 0`, offset: .45}, {translate: `${far * .55}px 0`, rotate: `${s * 10}deg`, offset: .6}, {translate: `${far * .55}px 0`, rotate: `${-s * 10}deg`, offset: .75}, {translate: '0 0', rotate: '0deg'}], {duration: 2200});}},
    {id: 'wobble', run: b => anim(b, [{scale: '1 1'}, {scale: '1.3 .7'}, {scale: '.8 1.2'}, {scale: '1.12 .9'}, {scale: '.95 1.05'}, {scale: '1 1'}], {duration: 800, easing: 'ease-out'})},
    {id: 'quake', then: true, run: b => anim(b, Array.from({length: 12}, (_, i) => ({translate: i === 11 ? '0 0' : `${rnd(-6, 6)}px ${rnd(-4, 4)}px`})), {duration: 650, easing: 'linear'})},
    {id: 'teleport', move: true, run: (b, e) => {const [dx, dy] = away(b, e, 140); return anim(b, [{opacity: 1, scale: '1', translate: '0 0'}, {opacity: 0, scale: '.5', translate: '0 0', offset: .12}, {opacity: 0, scale: '.5', translate: `${dx}px ${dy}px`, offset: .13}, {opacity: 1, scale: '1', translate: `${dx}px ${dy}px`, offset: .25}, {opacity: 1, scale: '1', translate: `${dx}px ${dy}px`, offset: .75}, {opacity: 0, scale: '.5', translate: `${dx}px ${dy}px`, offset: .87}, {opacity: 0, scale: '.5', translate: '0 0', offset: .88}, {opacity: 1, scale: '1', translate: '0 0'}], {duration: 2000, easing: 'linear'});}},
    {id: 'loading', then: true, run: async b => {const el = tip(b, '0%', 2700); let p = 0; const id = setInterval(() => {p = Math.min(99, p + rnd(9, 30)); el.textContent = `${T('Loading', 'جارٍ التحميل')}… ${Math.round(p)}%`;}, 180); await wait(1500); clearInterval(id); el.textContent = T('Loading… 99%', 'جارٍ التحميل… ٩٩٪'); await wait(900); el.textContent = '100%'; await wait(250);}},
    {id: 'sure', run: b => {tip(b, T('Are you sure? Press again.', 'متأكد؟ اضغط مرة ثانية.'), 2200); return anim(b, [{scale: '1'}, {scale: '.9'}, {scale: '1'}], {duration: 300});}},
    {id: 'mirror', run: b => {tip(b, T('?ereh gnihtyna kcilC', 'بالعكس؟')); return anim(b, [{scale: '1 1'}, {scale: '-1 1', offset: .15}, {scale: '-1 1', offset: .85}, {scale: '1 1'}], {duration: 1600});}},
    {id: 'ghost', run: b => {tip(b, T('I’m not here', 'أنا مش هنا')); return anim(b, [{opacity: 1}, {opacity: .06, offset: .2}, {opacity: .06, offset: .8}, {opacity: 1}], {duration: 1500});}},
    {id: 'grow', run: b => anim(b, [{scale: '1'}, {scale: '1.6', offset: .3}, {scale: '1.5', offset: .6}, {scale: '1'}], {duration: 1200})},
    {id: 'guard', run: b => {
      if (kind === 'off' || xo) return anim(b, [{rotate: '0deg'}, {rotate: '-8deg'}, {rotate: '8deg'}, {rotate: '0deg'}], {duration: 500});
      tip(b, kind === 'crow' ? T('The crow says no', 'الغراب يقول لا') : T('Opus says no', 'أوبس يقول لا'), 2200);
      goto(b, () => startAct(ACT.guard, performance.now()));
      return wait(2400);
    }},
  ];
  const prankBag = bag(PRANKS);
  function prank(btn, e, onlyMoves) {
    const now = performance.now();
    if (still || prankOn || now - prankAt < 20000 || (spared.get(btn) || 0) > now) return false;
    if (btn.closest('.mk-dock,.mk-bubble,.mk-xo,.mk-hit,.mk-bait,.mk-bait-btn,[data-no-prank],input[type=range]') || btn.disabled) return false;
    const r = btn.getBoundingClientRect();
    if (r.width < 22 || r.height < 18 || r.width > innerWidth * .8 || r.height > 220) return false;
    const p = prankBag(x => !onlyMoves || x.move); if (!p) return false;
    prankAt = now; prankOn = btn; spared.set(btn, now + 25000);   // after this it gives in
    blocked = {btn, until: now + 4000};
    Promise.resolve(p.run(btn, e)).then(() => {if (p.then && blocked?.btn === btn) press(btn);}).finally(() => {prankOn = null; if (blocked?.btn === btn) blocked = null;});
    return true;
  }
  // mouse: it runs from the pointer before you can press it; touch: it reacts to the press
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse' || Math.random() > .35) return;
    const b = e.target.closest?.(BTN); if (b && !b.contains(e.relatedTarget)) prank(b, e, true);
  }, true);
  document.addEventListener('pointerdown', e => {const b = e.target.closest?.(BTN); if (b && Math.random() < .4) prank(b, e, false);}, true);
  // the press that started the gag does not count; keyboard presses and our own replay always do
  document.addEventListener('click', e => {
    if (!blocked || !e.isTrusted || e.detail === 0 || !blocked.btn.contains(e.target) || performance.now() > blocked.until) return;
    e.preventDefault(); e.stopImmediatePropagation();
  }, true);

  // ── MK Voice: the most pressable card on the site. Pressing it summons a big glowing button,
  //    and the button trips you five different ways before it lets you in. Keyboard: straight in. ──
  const BAIT_SEL = '.nf-card[data-film="mk-voice"], .cx-poster a[href*="/mk-voice"]';
  const BAIT_LABELS = [T('Press to enter MK Voice', 'اضغط لتدخل MK Voice'), T('Press again. Harder.', 'اضغط مرة ثانية. أقوى.'), T('Almost. Once more.', 'تقريباً. مرة أخرى.'), T('Last one, promise.', 'آخر مرة، أعدك.'), T('OK, this one. Really.', 'حسناً، هذه. حقاً.'), T('Fine. Go in.', 'طيب. ادخل.')];
  let bait = null, baitDone = false;
  const label = (b, s) => {b.querySelector('span').textContent = s;};
  function ripples(x, y) {for (let i = 0; i < 3; i++) {const r = document.createElement('i'); r.className = 'mk-ripple'; Object.assign(r.style, {left: `${x}px`, top: `${y}px`, animationDelay: `${i * .16}s`}); layer().append(r); setTimeout(() => r.remove(), 1500);}}
  const TRIPS = [
    {id: 'water', run: async (b, e) => {ripples(e.clientX, e.clientY); b.classList.add('is-water'); tip(b, T('Splash. Your click sank.', 'بلوب. نقرتك غرقت.')); await anim(b, [{scale: '1 1'}, {scale: '1.14 .84'}, {scale: '.9 1.12'}, {scale: '1.05 .95'}, {scale: '1 1'}], {duration: 1200, easing: 'ease-out'}); b.classList.remove('is-water');}},
    {id: 'sleep', run: async b => {b.classList.add('is-asleep'); const was = b.querySelector('span').textContent; label(b, 'z z z'); tip(b, T('Shh. It’s napping.', 'هس. إنه نائم.')); await anim(b, [{rotate: '0deg'}, {rotate: '-7deg', offset: .25}, {rotate: '-7deg', offset: .85}, {rotate: '0deg'}], {duration: 1800}); label(b, was); b.classList.remove('is-asleep');}},
    {id: 'dodge', run: async (b, e) => {const [dx, dy] = away(b, e, 130); await anim(b, [{translate: '0 0'}, {translate: `${dx}px ${dy}px`, offset: .22}, {translate: `${dx}px ${dy}px`, offset: .78}, {translate: '0 0'}], {duration: 1500});}},
    {id: 'melt', run: async b => {tip(b, T('It melted. Hot day.', 'ذاب. الجو حار.')); await anim(b, [{scale: '1 1', translate: '0 0'}, {scale: '1.3 .3', translate: '0 34px', offset: .4}, {scale: '1.3 .3', translate: '0 34px', offset: .7}, {scale: '.9 1.15', translate: '0 -6px', offset: .85}, {scale: '1 1', translate: '0 0'}], {duration: 1700});}},
    {id: 'fake', run: async b => {const was = b.querySelector('span').textContent; for (const p of [12, 38, 64, 88, 97, 99]) {label(b, `${T('Opening MK Voice…', 'جارٍ فتح MK Voice…')} ${p}%`); await wait(230);} await wait(450); label(b, T('just kidding', 'أمزح')); await anim(b, [{rotate: '0deg'}, {rotate: '-4deg'}, {rotate: '4deg'}, {rotate: '0deg'}], {duration: 500}); await wait(400); label(b, was);}},
    {id: 'shell', run: async b => {
      const decoys = [0, 1].map(() => {const c = b.cloneNode(true); c.classList.add('is-decoy'); c.tabIndex = -1; c.setAttribute('aria-hidden', 'true'); layer().append(c); return c;});
      tip(b, T('Which one? None of them.', 'أيّهم؟ ولا واحد.'));
      await Promise.all([anim(b, [{translate: '0 0'}, {translate: '-130px 0'}, {translate: '130px 40px'}, {translate: '0 0'}], {duration: 1500}), anim(decoys[0], [{translate: '0 0'}, {translate: '130px 0'}, {translate: '-130px -40px'}, {translate: '0 0'}], {duration: 1500}), anim(decoys[1], [{translate: '0 0'}, {translate: '0 -80px'}, {translate: '0 80px'}, {translate: '0 0'}], {duration: 1500})]);
      decoys.forEach(c => c.remove());
    }},
    {id: 'tiny', run: async b => {tip(b, T('Too small to press now.', 'صار أصغر من أن يُضغط.')); await anim(b, [{scale: '1'}, {scale: '.07', offset: .3}, {scale: '.07', offset: .75}, {scale: '1.15', offset: .9}, {scale: '1'}], {duration: 1500});}},
    {id: 'flip', run: async b => {tip(b, T('¿ʇɐɥʍ', '؟ماذا')); await anim(b, [{rotate: '0deg'}, {rotate: '180deg', offset: .2}, {rotate: '180deg', offset: .8}, {rotate: '360deg'}], {duration: 1500});}},
    {id: 'guard', run: async b => {
      if (kind === 'off' || still) return anim(b, [{rotate: '0deg'}, {rotate: '-10deg'}, {rotate: '10deg'}, {rotate: '0deg'}], {duration: 500});
      tip(b, kind === 'crow' ? T('The crow is sitting on it.', 'الغراب جالس عليه.') : T('Opus is sitting on it.', 'أوبس جالس عليه.'));
      goto(b, () => startAct(ACT.guard, performance.now()));
      await wait(2300);
    }},
  ];
  function baitOpen(card) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'mk-bait-btn';
    btn.innerHTML = '<b aria-hidden="true">▶</b><span></span>';
    label(btn, BAIT_LABELS[0]);
    layer().append(btn);
    bait = {card, btn, n: 0, trips: shuffle([...TRIPS]).slice(0, 5), busy: false, w: btn.offsetWidth, h: btn.offsetHeight, at: performance.now()};
    baitPlace();
    anim(btn, [{scale: '0', opacity: 0}, {scale: '1.1', opacity: 1, offset: .7}, {scale: '1', opacity: 1}], {duration: 450});
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      if (!bait || bait.busy) return;
      if (e.detail === 0 || bait.n >= bait.trips.length) return baitWin();   // keyboard presses go straight in
      bait.busy = true;
      await bait.trips[bait.n++].run(btn, e);
      if (!bait) return;
      bait.busy = false; label(btn, BAIT_LABELS[bait.n]); bait.w = btn.offsetWidth; bait.h = btn.offsetHeight;
    });
  }
  function baitPlace() {
    if (!bait) return;
    const r = bait.card.getBoundingClientRect();
    if (!bait.card.isConnected || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return baitClose();
    bait.btn.style.left = `${r.left + r.width / 2 - bait.w / 2}px`; bait.btn.style.top = `${r.top + r.height / 2 - bait.h / 2}px`;
  }
  function baitClose() {if (!bait) return; const b = bait.btn; bait = null; anim(b, [{scale: '1', opacity: 1}, {scale: '0', opacity: 0}], {duration: 250}).then(() => b.remove());}
  function baitWin() {
    const {btn, card} = bait, r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('i'); c.className = 'mk-confetti';
      Object.assign(c.style, {left: `${cx}px`, top: `${cy}px`, background: any(['#ff5cc8', '#7b5cff', '#21d4fd', '#ffd166', '#06d6a0', '#ffffff'])});
      layer().append(c);
      anim(c, [{translate: '0 0', rotate: '0deg', opacity: 1}, {translate: `${rnd(-200, 200)}px ${rnd(-170, -40)}px`, rotate: `${rnd(-360, 360)}deg`, opacity: 1, offset: .35}, {translate: `${rnd(-260, 260)}px ${rnd(120, 320)}px`, rotate: `${rnd(-720, 720)}deg`, opacity: 0}], {duration: rnd(1100, 1600), easing: 'cubic-bezier(.2,.6,.4,1)'}).then(() => c.remove());
    }
    sfx(T('OK OK. You earned it.', 'طيب طيب. استحققتها.'), '', [cx, r.top - 10]);
    baitDone = true; baitClose();
    setTimeout(() => card.click(), 380);   // now it does what you asked
  }
  document.addEventListener('click', e => {
    if (baitDone || still || !e.isTrusted || e.detail === 0) return;
    const card = e.target.closest?.(BAIT_SEL); if (!card) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (!bait) baitOpen(card);
  }, true);
  addEventListener('keydown', e => {if (e.key === 'Escape') baitClose();});
  addEventListener('pointerdown', e => {if (bait && !bait.btn.contains(e.target) && !e.target.closest?.('.is-decoy,.mk-hit') && performance.now() - bait.at > 800) baitClose();}, {passive: true});
  function baitDress() {
    if (still) return;
    for (const card of document.querySelectorAll(BAIT_SEL)) {
      if (card.classList.contains('mk-bait')) continue;
      card.classList.add('mk-bait');
      const tag = document.createElement('span'); tag.className = 'mk-bait-tag'; tag.setAttribute('aria-hidden', 'true'); tag.textContent = T('Cool to press ✦', 'رائع للضغط ✦');
      (card.querySelector('.nf-card-art, figure') || card).append(tag);
    }
  }

  // ── X O on a sheet of paper it gets from somewhere different every time ───────────────────────
  const XO_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const portalBag = bag(['portal', 'pipe', 'printer', 'scroll', 'plane', 'hat', 'draw', 'courier', 'beam']);
  const jit = () => rnd(-1.6, 1.6);
  const winner = b => {for (const l of XO_LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return {who: b[l[0]], line: l}; return b.every(Boolean) ? {who: 'draw'} : null;};
  const winningMove = (b, who) => {for (let i = 0; i < 9; i++) if (!b[i]) {const c = [...b]; c[i] = who; if (winner(c)?.who === who) return i;} return null;};
  function aiMove(b) {
    const empty = b.map((v, i) => (v ? -1 : i)).filter(i => i >= 0);
    if (Math.random() < .18) return any(empty);   // it is good, not perfect
    const win = winningMove(b, 'O'); if (win !== null) return win;
    const block = winningMove(b, 'X'); if (block !== null) return block;
    if (!b[4]) return 4;
    const corners = [0, 2, 6, 8].filter(i => !b[i]);
    return corners.length ? any(corners) : any(empty);
  }
  const cellC = i => [20 + (i % 3) * 40, 20 + Math.floor(i / 3) * 40];
  function xoMark(i, who) {
    const [cx, cy] = cellC(i), ns = 'http://www.w3.org/2000/svg', gEl = document.createElementNS(ns, 'g');
    gEl.dataset.i = i;
    const path = (d, cls, delay = 0) => {const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); p.setAttribute('pathLength', '1'); p.setAttribute('class', `${cls} mark`); p.style.animationDelay = `${delay}s`; gEl.append(p);};
    if (who === 'X') {path(`M${cx - 11 + jit()} ${cy - 11 + jit()} L${cx + 11 + jit()} ${cy + 11 + jit()}`, 'x'); path(`M${cx + 11 + jit()} ${cy - 11 + jit()} L${cx - 11 + jit()} ${cy + 11 + jit()}`, 'x', .16);}
    else path(`M${cx + 1} ${cy - 12} C${cx + 16} ${cy - 12} ${cx + 15} ${cy + 12} ${cx} ${cy + 12} C${cx - 15} ${cy + 12} ${cx - 15} ${cy - 11} ${cx + 3} ${cy - 11}`, 'o');
    xo.el.querySelector('.marks').append(gEl);
    xo.el.querySelector(`.cells button[data-i="${i}"]`).setAttribute('aria-label', `${cellName(i)}: ${who}`);
  }
  const cellName = i => T(`Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}`, `الصف ${Math.floor(i / 3) + 1}، العمود ${(i % 3) + 1}`);
  const xoNote = s => {if (xo) xo.el.querySelector('.note').textContent = s;};
  function xoStart(force) {
    if (xo || kind === 'off') return;
    closeBubble(); stopAct(); endRide(true);
    const size = Math.round(clamp(innerWidth * .6, 170, 230)), cx = (C.ox + 9) * U;
    const left = clamp(cx - size / 2, 12, innerWidth - size - 12);
    let top = (C.oy - 6) * U - size - 34;
    if (top < 70) top = clamp((C.oy + 14) * U, 70, innerHeight - size - 46);
    const how = force || (still ? 'scroll' : portalBag(() => true));
    const el = document.createElement('div');
    el.className = `mk-xo${how === 'draw' ? ' is-drawn' : ''}`;
    el.setAttribute('role', 'group'); el.setAttribute('aria-label', T('X O with your companion', 'إكس أو مع رفيقك'));
    Object.assign(el.style, {left: `${left}px`, top: `${top}px`, width: `${size}px`});
    const lineD = (x1, y1, x2, y2) => `M${x1 + jit()} ${y1 + jit()} Q${(x1 + x2) / 2 + jit() * 2} ${(y1 + y2) / 2 + jit() * 2} ${x2 + jit()} ${y2 + jit()}`;
    el.innerHTML = `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="grid">${[[40, 4, 40, 116], [80, 4, 80, 116], [4, 40, 116, 40], [4, 80, 116, 80]].map((l, i) => `<path pathLength="1" style="animation-delay:${i * .18}s" d="${lineD(...l)}"/>`).join('')}</g><g class="marks"></g></svg><div class="cells">${Array.from({length: 9}, (_, i) => `<button type="button" data-i="${i}" aria-label="${cellName(i)}"></button>`).join('')}</div><p class="note" aria-live="polite"></p><button type="button" class="close" aria-label="${T('Put the game away', 'أبعد اللعبة')}">×</button>`;
    layer().append(el);
    xo = {el, how, board: Array(9).fill(null), busy: true, ready: false, over: false, cheated: false, mood: '', t0: performance.now(), box: {left, top, size}, side: side()};
    startAct(ACT.xo, performance.now(), 36e5);
    el.querySelector('.cells').addEventListener('click', e => {const b = e.target.closest('button[data-i]'); if (b) xoMove(+b.dataset.i);});
    el.querySelector('.close').addEventListener('click', () => {xoNote(T('Coward.', 'جبان.')); xoClose();});
    xoEnter().then(() => {if (!xo) return; xo.ready = true; xo.busy = false; xoNote(T('Your move. You’re X.', 'دورك. أنت X.'));});
  }
  // where the paper comes from, and how it gets to its spot
  async function xoEnter() {
    const {el, how, box} = xo, cx = box.left + box.size / 2, cy = box.top + box.size / 2;
    const from = (x, y) => `translate(${x - cx}px, ${y - cy}px)`;
    const beside = [(C.ox + 26) * U, (C.oy + 4) * U];
    if (still) return;
    switch (how) {
      case 'portal': {
        const ring = document.createElement('div'), rs = Math.round(box.size * 1.35); ring.className = 'mk-ring'; Object.assign(ring.style, {left: `${cx}px`, top: `${cy + 12}px`, width: `${rs}px`, height: `${rs}px`, margin: `${-rs / 2}px 0 0 ${-rs / 2}px`}); layer().append(ring);
        ring.animate([{scale: '0'}, {scale: '1.25'}], {duration: 380, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards'});
        sfx(T('fwoosh', 'فووووش'), '', [cx, box.top]);
        await anim(el, [{transform: 'scale(0) rotate(-220deg)', opacity: 0}, {transform: 'scale(0) rotate(-220deg)', opacity: 0, offset: .3}, {transform: 'scale(1.06) rotate(8deg)', opacity: 1, offset: .8}, {transform: 'none', opacity: 1}], {duration: 1100});
        await anim(ring, [{scale: '1.25'}, {scale: '0'}], {duration: 300, easing: 'ease-in', fill: 'forwards'}); ring.remove();
        break;
      }
      case 'pipe': case 'printer': case 'hat':
        sfx(how === 'pipe' ? T('bloop', 'بلوب') : how === 'printer' ? T('brrrt brrrt', 'بررت بررت') : T('ta-da', 'تا-دا'), '', beside);
        await anim(el, [{transform: `${from(...beside)} scale(.12)`, opacity: 0}, {transform: `${from(...beside)} scale(.12)`, opacity: 0, offset: .45}, {transform: `${from(beside[0], beside[1] - 30)} scale(.3)`, opacity: 1, offset: .6}, {transform: 'translateY(-12px) scale(1.04)', offset: .88}, {transform: 'none'}], {duration: 1500});
        break;
      case 'scroll': await anim(el, [{clipPath: 'inset(0 0 100% 0)'}, {clipPath: 'inset(0 0 0 0)'}], {duration: 900, easing: 'cubic-bezier(.3,.7,.3,1)'}); break;
      case 'plane': case 'courier': case 'beam': {
        const src = how === 'beam' ? [cx, -40] : [xo.side > 0 ? innerWidth + 60 : -60, cy - 80];
        el.style.opacity = '0';
        await wait(how === 'beam' ? 900 : 1150);
        el.style.opacity = '';
        await anim(el, [{transform: `${from(cx, how === 'beam' ? box.top - 60 : cy - 30)} scale(.25) rotate(25deg)`, opacity: .2}, {transform: 'none', opacity: 1}], {duration: 600});
        break;
      }
      case 'draw': sfx(T('scribble', 'خربشة'), '', [cx, box.top]); await wait(1300); break;
    }
  }
  // the pixel side of each entrance (drawn next to the companion or at the paper)
  function xoProps(o) {
    const e = (performance.now() - xo.t0) / 1000, bx = Math.round((xo.box.left + xo.box.size / 2) / U), by = Math.round((xo.box.top + xo.box.size / 2) / U);
    switch (xo.how) {
      case 'pipe': if (e < 2.3) {const h = Math.round(Math.min(1, e / .4) * 10 * (e > 1.7 ? Math.max(0, 1 - (e - 1.7) / .6) : 1)), px = o.bx + 22, gy = o.by + 9; if (h > 0) {R(px, gy - h + 1, 10, h, '#2FA84F'); R(px - 1, gy - h - 2, 12, 3, '#3CC960'); R(px + 1, gy - h + 1, 2, h, '#7BE38F');}} break;
      case 'hat': if (e < 2.4) {const px = o.bx + 21, gy = o.by + 9; R(px, gy - 6, 8, 6, '#141418'); R(px - 2, gy - 1, 12, 1, '#141418'); R(px, gy - 3, 8, 1, '#7E1F18'); if (e < 1.3 && frame % 2) P1(px + 3 + (frame % 3), gy - 8 - (frame % 4), '#FFE58A');} break;
      case 'printer': if (e < 2.4) {const px = o.bx + 20, gy = o.by + 9; R(px, gy - 7, 12, 7, '#C9CED6'); R(px + 1, gy - 8, 10, 1, '#8D939C'); R(px + 2, gy - 5, 8, 1, '#2A2A2E'); P1(px + 10, gy - 3, frame % 2 ? '#7EE08A' : '#2E6B2E'); if (e < 1.4) R(px + 3, gy - 8 - Math.round(e * 5), 6, Math.round(e * 5), '#FBF8F0');} break;
      case 'courier': if (e < 2.2) {
        const k = Math.min(1, e / 1.1), sx = xo.side > 0 ? W + 20 : -20, x = Math.round(sx + (bx - sx) * k), y = Math.round(by - 14 - (e > 1.1 ? (e - 1.1) * 70 : 0));
        const Pc = pose(); Pc.look = [Math.sign(bx - sx), 1];
        if (kind === 'crow') {Pc.armL = Pc.armR = 'up'; Pc.legs = 'dangle'; drawOpus(x - 9, y - 10, Pc); R(x - 4, y - 16, 9, 1, '#E84855'); if (frame % 2) R(x - 7, y - 17, 15, 1, '#E84855');}
        else {Pc.armL = Pc.armR = ['fup', 'fmid', 'fdown', 'fmid'][frame % 4]; drawCrow(x - 9, y - 10, Pc);}
        if (e < 1.1) R(x - 3, y + 1, 7, 6, '#FBF8F0');
      } break;
      case 'beam': if (e < 1.9) {
        const k = Math.min(1, e / .7), Y = Math.round(by - 50 - (1 - k) * 40 - (e > 1.3 ? (e - 1.3) * 120 : 0));
        if (e > .6 && e < 1.4) alpha(.25, () => {for (let i = Y; i < by; i++) {const w = 3 + Math.round((i - Y) * .3); R(bx - w, i, w * 2 + 1, 1, '#C9FFF4');}});
        R(bx - 13, Y - 4, 27, 1, '#D5DCE3'); R(bx - 16, Y - 3, 33, 1, '#AEB8C2'); R(bx - 14, Y - 2, 29, 1, '#6F7985'); R(bx - 8, Y - 7, 17, 3, 'rgba(160,226,255,.35)');
        for (let i = -12, n = 0; i <= 12; i += 6, n++) P1(bx + i, Y - 3, ['#FFD34D', '#6EF2FF', '#FF6B9A'][(n + frame) % 3]);
      } break;
      case 'plane': if (e < 1.2) {const k = Math.min(1, e / 1.15), sx = xo.side > 0 ? W + 20 : -20, x = Math.round(sx + (bx - sx) * k), y = Math.round(by - 26 + Math.sin(k * Math.PI) * -8); mirror(x, Math.sign(bx - sx), () => {for (let i = 0; i <= 12; i++) {const top = y - 3 + Math.round(i * 2 / 12); R(x - 6 + i, top, 1, y - top + 1, '#F6F6F2');} line(x - 6, y - 3, x + 6, y, '#C9CDD2');});} break;
    }
  }
  function xoMove(i) {
    if (!xo || xo.busy || xo.over || xo.board[i]) return;
    xo.board[i] = 'X'; xoMark(i, 'X');
    if (xoFinish()) return;
    xo.busy = true;
    xoNote(any([T('Hmm…', 'همم…'), T('Interesting choice. Wrong, but interesting.', 'اختيار مثير. خاطئ، لكن مثير.'), T('Bold.', 'جريء.'), T('Let me think. Done.', 'دعني أفكر. انتهيت.')]));
    setTimeout(() => {
      if (!xo || xo.over) return;
      // the bully move: when you are about to win, it sometimes rubs out one of your Xs
      const threat = winningMove(xo.board, 'X');
      if (threat !== null && !xo.cheated && Math.random() < .35) {
        const l = XO_LINES.find(k => k.includes(threat) && k.filter(j => xo.board[j] === 'X').length === 2), victim = l.find(j => xo.board[j] === 'X');
        xo.cheated = true; xo.board[victim] = null;
        xo.el.querySelector(`.marks g[data-i="${victim}"]`)?.classList.add('gone');
        setTimeout(() => xo?.el.querySelector(`.marks g.gone[data-i="${victim}"]`)?.remove(), 520);
        xo.el.querySelector(`.cells button[data-i="${victim}"]`).setAttribute('aria-label', cellName(victim));
        sfx(T('what X?', 'أي X؟'));
        xoNote(T('There was never an X there. Your move.', 'لم يكن هناك X أصلاً. دورك.'));
        xo.busy = false;
        return;
      }
      const j = aiMove(xo.board); xo.board[j] = 'O'; xoMark(j, 'O');
      xo.busy = false;
      if (!xoFinish()) xoNote(any([T('Your move.', 'دورك.'), T('Your turn. Take your time. Not too much.', 'دورك. خذ وقتك. ليس كثيراً.'), T('Go on.', 'هيا.')]));
    }, rnd(650, 1300));
  }
  function xoFinish() {
    const w = winner(xo.board); if (!w) return false;
    xo.over = true;
    if (w.line) {
      const [a, , c] = w.line, [x1, y1] = cellC(a), [x2, y2] = cellC(c), dx = (x2 - x1) * .18, dy = (y2 - y1) * .18, p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M${x1 - dx} ${y1 - dy} L${x2 + dx} ${y2 + dy}`); p.setAttribute('pathLength', '1'); p.setAttribute('class', 'win');
      xo.el.querySelector('svg').append(p);
    }
    if (w.who === 'X') {
      if (Math.random() < .5) {xo.mood = 'rage'; xoNote(T('No. We don’t talk about this.', 'لا. لن نتحدث عن هذا.')); setTimeout(xoRage, 900);}
      else {xo.mood = 'sad'; xoNote(T('You won. I let you. Obviously.', 'فزت. أنا تركتك تفوز. طبعاً.')); setTimeout(() => xoClose(), 2800);}
    } else if (w.who === 'O') {xo.mood = 'smug'; xoNote(T('I win. As predicted. By me.', 'فزت. كما توقعت. أنا.')); sfx(T('too easy', 'سهلة')); setTimeout(() => xoClose(), 3000);}
    else {xoNote(T('Draw. How boring. Again?', 'تعادل. ممل. مرة ثانية؟')); setTimeout(() => xoClose(), 2800);}
    return true;
  }
  // it lost: the paper gets crumpled and thrown away
  async function xoRage() {
    if (!xo) return;
    const el = xo.el;
    sfx('(╯°□°)╯︵ ┻━┻');
    await anim(el, [{transform: 'none'}, {transform: 'scale(.55) rotate(-25deg)', filter: 'brightness(.92)', offset: .35}, {transform: `translate(${(xo.side > 0 ? 1 : -1) * innerWidth * .7}px, ${innerHeight * .5}px) scale(.18) rotate(${xo.side > 0 ? 540 : -540}deg)`, opacity: .4}], {duration: 1100, easing: 'cubic-bezier(.5,0,.8,.5)', fill: 'forwards'});
    xoClose(true);
  }
  async function xoClose(now) {
    if (!xo) return;
    const x = xo; xo = null;
    if (!now && !still) {
      if (x.how === 'draw') await anim(x.el, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(5px)'}], {duration: 700, fill: 'forwards'});
      else if (x.how === 'portal') {
        const cx = x.box.left + x.box.size / 2, cy = x.box.top + x.box.size / 2, ring = document.createElement('div');
        const rs = Math.round(x.box.size * 1.35); ring.className = 'mk-ring'; Object.assign(ring.style, {left: `${cx}px`, top: `${cy + 12}px`, width: `${rs}px`, height: `${rs}px`, margin: `${-rs / 2}px 0 0 ${-rs / 2}px`}); layer().append(ring);
        ring.animate([{scale: '0'}, {scale: '1.2'}], {duration: 300, fill: 'forwards'});
        await anim(x.el, [{transform: 'none', opacity: 1}, {transform: 'scale(0) rotate(260deg)', opacity: 0}], {duration: 700, easing: 'ease-in', fill: 'forwards'});
        await anim(ring, [{scale: '1.2'}, {scale: '0'}], {duration: 260, fill: 'forwards'}); ring.remove();
      } else await anim(x.el, [{transform: 'none', opacity: 1}, {transform: 'scaleY(.04) scaleX(.6)', opacity: .8, offset: .5}, {transform: `translate(0, ${-innerHeight}px) scaleY(.04) scaleX(.3)`, opacity: 0}], {duration: 800, easing: 'cubic-bezier(.6,0,.8,.4)', fill: 'forwards'});
    }
    x.el.remove();
    if (C.act?.def.id === 'xo') endAct();
  }

  // ── start ─────────────────────────────────────────────────────────────────────────────────────
  document.body.append(fxc, world, hit, dock);
  fit();
  addEventListener('resize', () => {fit(); floorAt = 0; C.x = clamp(C.x, 12, W - 12); C.y = Math.min(C.y, floorU());}, {passive: true});
  C.x = W * (ar ? .16 : .84); C.y = floorU(); C.ox = Math.round(C.x) - 9; C.oy = Math.round(C.y) - 10;
  world.hidden = hit.hidden = kind === 'off';
  paintDock();
  rehome();
  baitDress();
  requestAnimationFrame(loop);
  addEventListener('mk:edition', e => {
    if (kind === 'off' || still) return;
    const cx = C.ox + 9, cy = C.oy + 4, fxs = PACK_FX[packNow()];
    for (let i = 0; i < 22; i++) {const an = rnd(0, Math.PI * 2), sp = rnd(15, 45); emit({kind: 'spark', x: cx, y: cy, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, life: .8, c: any(fxs.c)});}
    dust(C.x, C.y, 8); sfx(e.detail?.name || '');
  });
  if (!still) setInterval(() => {if (((root.dataset.siteMode === 'crow' && kind === 'opus') || root.dataset.edition) && !document.hidden && Math.random() < .5) flock(root.dataset.edition ? 2 : 1);}, 45000);
  // QA hooks
  window.__mk = {
    act(id) {if (ACT[id]) {endRide(true); stopAct(); startAct(ACT[id], performance.now());}},
    ride(id, tx) {const d = RIDES.find(r => r.id === id); if (d) {endRide(true); stopAct(); startRide(d, performance.now(), tx ?? (C.x < W / 2 ? W * .75 : W * .25), floorU(), null);}},
    perch(sel, id) {const el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return false; endRide(true); stopAct(); const r = el.getBoundingClientRect(); C.x = (r.left + Math.min(80, r.width / 2)) / U; C.y = r.top / U; perch(el); idle(performance.now(), 1e6); if (id && ACT[id]) startAct(ACT[id], performance.now()); return C.onType;},
    steal(sel, id) {const el = document.querySelector(sel); if (el) goto(el, () => startAct(ACT[id] || theftBag(() => true), performance.now()));},
    prank(id, sel) {const b = document.querySelector(sel), p = PRANKS.find(x => x.id === id); return b && p ? Promise.resolve(p.run(b, null)).then(() => true) : false;},
    xo(how) {xoStart(how); return !!xo;},
    state: () => ({mode: C.mode, act: C.act?.def.id, ride: C.ride?.def.id, phase: C.ride?.phase, on: C.onType, x: C.x, y: C.y, W, H, U, stolen: stolen.length, xo: xo && {how: xo.how, board: xo.board.join(',')}, rides: RIDES.map(r => r.id), acts: ACTS.map(a => a.id)}),
    spell(id) {const sp = Object.values(SPELL_PACKS).flat().find(x => x.id === id); if (!sp || !C.on) return false; endRide(true); stopAct(); startAct(ACT.spell, performance.now()); C.act.st.spell = sp; return true;},
    giveBack, flock, bait: () => {const c = document.querySelector(BAIT_SEL); if (c) {baitDone = false; baitOpen(c);} return !!c;},
  };
})();
