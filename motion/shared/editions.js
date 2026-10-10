/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/* Special editions: Halloween, Heaven, RGB Overdrive, Night Ops, Ink & Pow, Terracotta.
   html[data-edition] is set before first paint by site-mode.js (from ?edition= or earlier in the visit).
   This file owns the picker (any [data-edition-picker] button), the edition fonts and, on the World
   page, the atmosphere layer. The World engine (colour grade) and the companion (costume, ride,
   spells) read html[data-edition] themselves, so a switch on the World page is live. */
(() => {
  if (window.mkEditions) return;
  const root = document.documentElement, ar = root.lang === 'ar', T = (en, a) => (ar ? a : en);
  const base = (document.currentScript?.src ? new URL(document.currentScript.src).pathname : '/motion/shared/editions.js').replace(/\/motion\/shared\/editions\.js$/, '');
  const onWorld = root.classList.contains('world-walk') && !root.dataset.world;   // (an edition's own World is its look: no grade or air over it)
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ar) {
    const type = document.createElement('link');
    type.rel = 'stylesheet'; type.href = `${base}/motion/shared/arabic-type.css?v=1`;
    document.head.append(type);
  }
  const ED = [
    {id: '', name: T('Standard', 'العادي'), note: T('The studio as it is', 'الاستوديو كما هو'), sw: 'linear-gradient(135deg,#b9dacc,#0b1210)'},
    {id: 'halloween', name: T('Halloween', 'الهالوين'), note: T('Witching hour: fog, bats and curses', 'ساعة السحر: ضباب وخفافيش ولعنات'), sw: 'linear-gradient(135deg,#ff8a1f,#3a0f5c)', font: 'Creepster'},
    {id: 'heaven', name: T('Heaven', 'الجنة'), note: T('Cloud nine: light, doves and blessings', 'فوق السحاب: نور وحمام وبركات'), sw: 'linear-gradient(135deg,#fff3c4,#9cc2ff)', font: 'Cormorant+Garamond:wght@500;600;700'},
    {id: 'rgb', name: T('RGB Overdrive', 'RGB بأقصى سرعة'), note: T('Gamer glow, every colour at once', 'توهج الألعاب، كل الألوان معاً'), sw: 'conic-gradient(#ff0040,#ffb300,#00ff88,#00b3ff,#a100ff,#ff0040)', font: 'Orbitron:wght@600;800'},
    {id: 'tactical', name: T('Night Ops', 'عمليات ليلية'), note: T('Night vision, scopes, classified files', 'رؤية ليلية ومناظير وملفات سرية'), sw: 'linear-gradient(135deg,#9be564,#0d140d)', font: 'Black+Ops+One'},
    {id: 'comic', name: T('Ink & Pow', 'حبر وبوم'), note: T('Halftone panels and sound effects', 'لوحات منقطة ومؤثرات صوتية'), sw: 'radial-gradient(circle at 30% 30%,#ffd400 0 38%,#e10600 40%)', font: 'Bangers'},
    {id: 'keynote', name: T('Keynote', 'كينوت'), note: T('Make.: a launch film made in code', 'Make.: فيلم إطلاق مصنوع بالكود'), sw: 'linear-gradient(135deg,#F2EEE6 0 50%,#0B0B0C 50%)'},
    {id: 'clay', name: T('Terracotta', 'تيراكوتا'), note: T('Warm clay, stop-motion, handmade', 'طين دافئ وحركة إطار بإطار'), sw: 'linear-gradient(135deg,#d97757,#f0eee6)'},
    {id: 'ice', name: T('Top of the World', 'قمة العالم'), note: T('The Pole and Everest, in ice and light', 'القطب وإيفرست، جليد وضوء'), sw: 'linear-gradient(135deg,#e9eff3 0 50%,#9fd6ff 50%)'},
    {id: 'blueprint', name: T('Blueprint', 'المخطط'), note: T('A live drafting session, plotted', 'جلسة رسم هندسي حيّة'), sw: 'linear-gradient(135deg,#1d4f91 0 50%,#ffb547 50%)'},
    {id: 'doodle', name: T('Doodle', 'خربشة'), note: T('A living marker sketchbook', 'دفتر رسم حيّ بالقلم'), sw: 'linear-gradient(135deg,#f3a43a 0 50%,#f4efe4 50%)'},
    {id: 'crossover', name: T('Crossover', 'عبور'), note: T('One movie through six animation worlds', 'فيلم واحد عبر ستة عوالم متحركة'), sw: 'linear-gradient(135deg,#06130a 0 50%,#ffd23f 50%)'},
    {id: 'impression', name: T('Impression', 'انطباع'), note: T('Painted live in oil, stroke by stroke', 'مرسومة مباشرةً بالزيت، ضربة بعد ضربة'), sw: 'linear-gradient(135deg,#e9dcc2 0 50%,#e8833a 50%)'},
    {id: 'museum', name: T('Hall of Solutions', 'قاعة الحلول'), note: T('The museum: a marble hall at night', 'المتحف: قاعة رخامية ليلاً'), sw: 'linear-gradient(135deg,#080706 0 50%,#d9b36a 50%)'},
    {id: 'machine', name: T('Solution Machine', 'آلة الحلول'), note: T('Inside the machine: one movie, eight rooms', 'داخل الآلة: فيلم واحد، ثماني غرف'), sw: 'linear-gradient(135deg,#06070a 0 50%,#ffb340 50%)'},
    {id: 'rounds', name: T('Four Rounds', 'أربع جولات'), note: T('One fighter, four arts: blade, eight limbs, ring and cage', 'مقاتل واحد وأربعة فنون: النصل والأطراف الثمانية والحلبة والقفص'), sw: 'linear-gradient(135deg,#0b0908 0 50%,#e8412c 50%)'},
  ];
  const byId = id => ED.find(e => e.id === (id || '')) || ED[0];

  const css = document.createElement('style');
  css.textContent = `
  .ed-pick{display:inline-flex;align-items:center;gap:8px;min-height:34px;padding:6px 13px 6px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:inherit;font:650 13px/1.2 'Inter Variable',Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap;backdrop-filter:blur(10px)}
  .ed-pick:hover{border-color:rgba(255,255,255,.5)}
  .ed-pick:focus-visible{outline:2px solid currentColor;outline-offset:3px}
  .ed-dot{width:14px;height:14px;border-radius:50%;background:var(--sw);box-shadow:0 0 0 1px rgba(255,255,255,.25)}
  [data-site-mode=white] .ed-pick,html[data-world-tone=light] .ed-pick{border-color:rgba(0,0,0,.2);background:rgba(0,0,0,.05)}
  .ed-menu{position:fixed;z-index:2147482700;width:min(340px,calc(100vw - 24px));padding:10px;border-radius:20px;background:rgba(14,15,18,.9);color:#f2f2f4;border:1px solid rgba(255,255,255,.14);box-shadow:0 24px 60px rgba(0,0,0,.5);backdrop-filter:blur(20px);font:400 14px/1.35 'Inter Variable',Inter,system-ui,sans-serif;transform-origin:var(--ox,90%) 0;animation:ed-in .28s cubic-bezier(.2,.9,.3,1.15)}
  @keyframes ed-in{from{opacity:0;transform:translateY(-6px) scale(.96)}}
  .ed-menu{box-sizing:border-box;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scroll-padding-block:58px 10px;max-height:calc(100dvh - 24px)}
  .ed-menu-head{position:sticky;top:-10px;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-10px -10px 6px;padding:10px 12px;background:#111216;border-bottom:1px solid #ffffff18}
  .ed-menu h2{margin:0;font-size:15px;font-weight:650;line-height:1.4}
  .ed-menu button.ed-close{display:grid;grid-template-columns:1fr;gap:0;place-items:center;flex:0 0 44px;width:44px;height:44px;padding:0;font-size:26px;line-height:1}
  .ed-menu button{display:grid;grid-template-columns:34px 1fr;gap:2px 12px;align-items:center;width:100%;padding:9px 10px;border:0;border-radius:14px;background:none;color:inherit;font:inherit;text-align:start;cursor:pointer}
  .ed-menu button:hover,.ed-menu button:focus-visible{background:rgba(255,255,255,.08)}
  .ed-menu button:focus-visible{outline:2px solid currentColor;outline-offset:-3px}
  .ed-menu button[aria-checked=true]{background:rgba(255,255,255,.12)}
  .ed-menu .ed-sw{grid-row:span 2;width:34px;height:34px;border-radius:11px;background:var(--sw);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
  .ed-menu b{font-weight:650;font-size:15px}
  .ed-menu small{font-size:13px;color:rgba(242,242,244,.66)}
  [data-site-mode=white] .ed-menu{background:rgba(250,250,248,.94);color:#141416;border-color:rgba(0,0,0,.1)}
  [data-site-mode=white] .ed-menu-head{background:#fafaf8;border-color:#0002}
  [data-site-mode=white] .ed-menu small{color:rgba(20,20,22,.62)}
  [data-site-mode=white] .ed-menu button:hover,[data-site-mode=white] .ed-menu button[aria-checked=true]{background:rgba(0,0,0,.06)}
  @media (max-width:640px){.ed-pick .ed-name{display:none}.ed-pick{padding:6px 9px}.ed-menu{width:calc(100vw - 24px);transform-origin:50% 0}}

  /* One stable navigation layout for Home and every World. The scene keeps its
     own colours; essential links stay visible and usable at every width. */
  .m-nav[data-site-nav][data-no-prank],.world-header[data-site-nav][data-no-prank]{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto auto;align-items:center;height:auto;gap:clamp(12px,1.5vw,24px);box-sizing:border-box;padding:12px clamp(12px,4vw,64px);isolation:isolate}
  [data-site-nav][data-no-prank] :is(.m-brand,.world-brand){min-width:0;margin:0}
  [data-site-nav][data-no-prank] :is(a,button,nav){box-sizing:border-box}
  [data-site-nav][data-no-prank] .world-brand>span:not(.world-mark){min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  [data-site-nav][data-no-prank] .world-mark{flex-shrink:0}
  [data-site-nav][data-no-prank] [data-primary-nav]{display:flex;align-items:center;gap:clamp(12px,1.5vw,24px)}
  [data-site-nav][data-no-prank] [data-primary-nav] a{display:flex;align-items:center;min-height:44px;padding:6px 0;white-space:nowrap}
  [data-site-nav][data-no-prank] .style-switch{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-flow:column;gap:0;margin:0;min-width:0;padding:3px}
  [data-site-nav][data-no-prank] .style-switch a{display:flex;align-items:center;justify-content:center;min-height:36px;padding:7px 12px;border:0;white-space:nowrap;font-size:13px;line-height:1.3}
  [data-site-nav][data-no-prank] :is(.ed-pick,.m-language,.world-lang){display:flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;box-sizing:border-box;margin:0}
  [data-site-nav][data-no-prank] .ed-pick{max-width:180px}
  [data-site-nav][data-no-prank] .ed-name{overflow:hidden;text-overflow:ellipsis}
  [data-site-nav][data-no-prank] :is(.m-language,.world-lang){white-space:nowrap;font-size:12px}
  [data-site-nav][data-no-prank] .style-switch:not(:has([aria-current])) .style-switch-thumb{opacity:0}
  @media(max-width:1100px){[data-site-nav][data-no-prank] .m-brand>span,[data-site-nav][data-no-prank] .world-brand>span:not(.world-mark){display:none}}
  @media(max-width:900px){
    .m-nav[data-site-nav][data-no-prank],.world-header[data-site-nav][data-no-prank]{grid-template-columns:44px minmax(0,1fr) 44px 44px;gap:4px;padding:8px 12px}
    [data-site-nav][data-no-prank] :is(.m-brand,.world-brand){grid-column:1;grid-row:1;justify-self:start}
    [data-site-nav][data-no-prank] .style-switch{grid-column:2;grid-row:1;justify-self:center;width:min(100%,240px)}
    [data-site-nav][data-no-prank] .style-switch a{padding:6px 4px;font-size:12px;min-height:36px}
    [data-site-nav][data-no-prank] .ed-pick{grid-column:3;grid-row:1;width:44px;padding:0;gap:0}
    [data-site-nav][data-no-prank] .ed-name{display:none}
    [data-site-nav][data-no-prank] :is(.m-language,.world-lang){grid-column:4;grid-row:1;width:44px;padding:0}
    [data-site-nav][data-no-prank] [data-primary-nav]{grid-column:1/-1;grid-row:2;justify-content:space-evenly;gap:8px;width:100%}
    [data-site-nav][data-no-prank] [data-primary-nav] a{min-height:44px;font-size:13px;line-height:1.4;padding:6px 4px}
  }
  @media(prefers-reduced-motion:reduce){.ed-menu{animation:none}}

  .ed-air{position:fixed;inset:0;z-index:3;pointer-events:none;overflow:hidden;opacity:0;transition:opacity 1.2s ease}
  .ed-air.is-on{opacity:1}
  .ed-air i,.ed-air b,.ed-air span{position:absolute;display:block}
  .ed-air .fog{left:-25%;right:-25%;bottom:-12%;height:48%;background:radial-gradient(ellipse at 30% 80%,rgba(176,150,214,.3),transparent 62%),radial-gradient(ellipse at 76% 92%,rgba(150,128,196,.26),transparent 56%);filter:blur(12px);animation:ed-fog 22s ease-in-out infinite alternate}
  .ed-air .fog.f2{bottom:-20%;opacity:.8;animation-duration:31s;animation-direction:alternate-reverse}
  @keyframes ed-fog{to{transform:translateX(9%)}}
  .ed-air .moon{top:9%;right:22%;width:clamp(60px,7vw,110px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 38% 36%,#fff8de,#ffc75a 58%,#d9772b);box-shadow:0 0 70px 18px rgba(255,170,70,.32);opacity:.62}
  .ed-air .moon::after{content:'';position:absolute;inset:18% 12% 30% 34%;border-radius:50%;background:rgba(160,80,30,.18);filter:blur(3px)}
  .ed-air .flash{inset:0;background:#e6ddff;opacity:0}
  .ed-air .flash.go{animation:ed-flash 1.1s ease-out}
  @keyframes ed-flash{4%{opacity:.34}9%{opacity:0}14%{opacity:.22}24%{opacity:0}}
  .ed-air .rays{top:-35vh;left:50%;width:170vw;height:125vh;translate:-50% 0;background:repeating-conic-gradient(from -40deg at 50% 0%,rgba(255,246,214,.17) 0 4deg,transparent 4deg 11deg);-webkit-mask:linear-gradient(#000,transparent 78%);mask:linear-gradient(#000,transparent 78%);animation:ed-rays 26s ease-in-out infinite alternate}
  @keyframes ed-rays{to{transform:rotate(7deg)}}
  .ed-air .bank{left:-10%;right:-10%;bottom:-9vh;height:28vh;background:radial-gradient(ellipse at 18% 70%,#fff 0 22%,transparent 46%),radial-gradient(ellipse at 46% 85%,#f4f8ff 0 24%,transparent 48%),radial-gradient(ellipse at 78% 72%,#fff 0 20%,transparent 44%);filter:blur(9px);opacity:.82;animation:ed-fog 28s ease-in-out infinite alternate}
  .ed-air .mote{bottom:-10px;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;background:#fffbe6;box-shadow:0 0 10px 3px rgba(255,236,170,.7);animation:ed-rise var(--d) linear infinite;animation-delay:var(--w)}
  @keyframes ed-rise{to{transform:translate(var(--dx),-110vh)}}
  .ed-air .edge{inset:0;padding:3px;background:conic-gradient(#ff0040,#ffb300,#00ff88,#00b3ff,#a100ff,#ff0040);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:ed-hue 3.2s linear infinite;filter:drop-shadow(0 0 8px #00e5ff)}
  .ed-air .glow{left:8%;right:8%;bottom:-70px;height:130px;background:radial-gradient(ellipse,rgba(0,255,200,.5),transparent 70%);filter:blur(22px);animation:ed-glow 3.2s linear infinite}
  @keyframes ed-glow{to{filter:blur(22px) hue-rotate(360deg)}}
  @keyframes ed-hue{to{filter:hue-rotate(360deg) drop-shadow(0 0 8px #00e5ff)}}
  .ed-air .c{width:44px;height:44px;border:2px solid rgba(155,229,100,.75)}
  .ed-air .tl{top:84px;left:22px;border-right:0;border-bottom:0}.ed-air .tr{top:84px;right:22px;border-left:0;border-bottom:0}
  .ed-air .bl{bottom:58px;left:22px;border-right:0;border-top:0}.ed-air .br{bottom:58px;right:22px;border-left:0;border-top:0}
  .ed-air .reticle{left:50%;top:50%;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;border:1.5px solid rgba(155,229,100,.4);background:linear-gradient(rgba(155,229,100,.45),rgba(155,229,100,.45)) center/1.5px 26px no-repeat,linear-gradient(90deg,rgba(155,229,100,.45),rgba(155,229,100,.45)) center/26px 1.5px no-repeat}
  .ed-air .rec{right:78px;bottom:66px;font:650 13px 'Inter Variable',Inter,sans-serif;color:#9be564}
  .ed-air .rec::first-letter{color:#ff3b3b}
  .ed-air .rec{animation:ed-blink 1.2s steps(1) infinite}
  @keyframes ed-blink{50%{opacity:.35}}
  .ed-air .tape{left:50%;top:78px;translate:-50% 0;font:600 13px 'Inter Variable',Inter,sans-serif;color:rgba(155,229,100,.8);white-space:nowrap;-webkit-mask:linear-gradient(90deg,transparent,#000 25%,#000 75%,transparent);mask:linear-gradient(90deg,transparent,#000 25%,#000 75%,transparent);width:min(520px,70vw);overflow:hidden}
  .ed-air .tape em{display:inline-block;font-style:normal;animation:ed-tape 30s linear infinite}
  @keyframes ed-tape{to{transform:translateX(-50%)}}
  .ed-air .panel{inset:9px;border:5px solid #111;border-radius:3px;box-shadow:0 0 0 9px #fff8e6}
  .ed-air .dots{width:46vmin;height:46vmin;background:radial-gradient(circle,#e10600 34%,transparent 37%) 0 0/12px 12px;-webkit-mask:radial-gradient(circle at var(--at),#000,transparent 70%);mask:radial-gradient(circle at var(--at),#000,transparent 70%);opacity:.5}
  .ed-air .dots.a{top:0;left:0;--at:0 0}.ed-air .dots.b{right:0;bottom:0;--at:100% 100%;background-image:radial-gradient(circle,#1d4ed8 34%,transparent 37%)}
  .ed-air .pow{width:min(240px,40vw);aspect-ratio:1;display:grid;place-items:center;font:400 clamp(30px,5vw,56px)/1 Bangers,'Inter Variable',sans-serif;color:#e10600;-webkit-text-stroke:2px #111;rotate:-8deg;animation:ed-pow 1.5s cubic-bezier(.2,1.4,.4,1) both}
  .ed-air .pow::before{content:'';position:absolute;inset:0;z-index:-1;background:#ffd400;clip-path:polygon(50% 0,61% 30%,95% 18%,72% 45%,100% 62%,66% 66%,72% 100%,50% 76%,26% 100%,32% 68%,0 64%,28% 46%,6% 16%,40% 30%);filter:drop-shadow(4px 4px 0 #111)}
  @keyframes ed-pow{0%{transform:scale(0) rotate(-30deg)}18%{transform:scale(1.12)}26%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:scale(.9)}}
  .ed-air .grain{inset:-50%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");mix-blend-mode:overlay;opacity:.32;animation:ed-grain .5s steps(4) infinite}
  @keyframes ed-grain{25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-2%,-1%)}}
  .ed-air .warm{inset:0;background:radial-gradient(ellipse at center,transparent 52%,rgba(122,46,18,.42))}
  .ed-air .print{right:4vw;bottom:9vh;width:clamp(90px,12vw,170px);aspect-ratio:.8;border-radius:50%;opacity:.16;background:repeating-radial-gradient(ellipse at 50% 60%,transparent 0 5px,#5a2a16 5px 7px);-webkit-mask:radial-gradient(ellipse,#000 55%,transparent 72%);mask:radial-gradient(ellipse,#000 55%,transparent 72%);rotate:-18deg}
  @media (prefers-reduced-motion:reduce) and (prefers-reduced-motion:no-preference){.ed-air *{animation:none!important}}
  /* the World chrome takes the edition's colours and display type */
  html[data-edition=halloween]{--w-accent:#ff8a1f;--w-panel:rgba(26,8,38,.6)}
  html[data-edition=heaven]{--w-accent:#f2c14e;--w-panel:rgba(18,40,92,.5)}
  html[data-edition=heaven] .world-header{background:linear-gradient(rgba(14,32,74,.7),transparent)}
  html[data-edition=rgb]{--w-accent:#00e5ff;--w-panel:rgba(10,4,24,.6)}
  html[data-edition=tactical]{--w-accent:#9be564;--w-panel:rgba(8,14,8,.66)}
  html[data-edition=comic]{--w-accent:#ffd400;--w-panel:rgba(20,24,38,.72)}
  html[data-edition=clay]{--w-accent:#d97757;--w-panel:rgba(48,20,12,.55)}
  html[data-edition] .world-mark{background:var(--w-accent)}
  html[data-edition] .wo-button.is-primary{background:var(--w-accent);border-color:var(--w-accent)}
  html[data-edition] .style-switch-thumb{background:var(--w-accent)}
  html[data-edition=halloween] :is(.wo-display,.wo-headline,.wo-serif-title,.wo-film-name,.wo-outline,.wo-boxes){font-family:Creepster,var(--w-display);font-weight:400;letter-spacing:.02em}
  html[data-edition=heaven] :is(.wo-display,.wo-headline,.wo-serif-title,.wo-film-name,.wo-boxes){font-family:'Cormorant Garamond',var(--w-serif);font-weight:600;letter-spacing:-.01em}
  html[data-edition=rgb] :is(.wo-display,.wo-headline,.wo-serif-title,.wo-film-name,.wo-boxes){font-family:Orbitron,var(--w-display);font-weight:800;letter-spacing:0}
  html[data-edition=tactical] :is(.wo-display,.wo-headline,.wo-serif-title,.wo-film-name,.wo-boxes){font-family:'Black Ops One',var(--w-display);font-weight:400;letter-spacing:.01em}
  html[data-edition=comic] :is(.wo-display,.wo-headline,.wo-serif-title,.wo-film-name,.wo-boxes){font-family:Bangers,var(--w-display);font-weight:400;letter-spacing:.03em}
  html[data-edition=clay] :is(.wo-display,.wo-headline,.wo-serif-title,.wo-film-name,.wo-boxes){font-family:'Fraunces Variable',Fraunces,var(--w-serif);font-weight:600;font-variation-settings:'SOFT' 100,'WONK' 1;letter-spacing:-.02em}
  html[data-edition=rgb] .wo-display{background:linear-gradient(90deg,#ff0040,#ffb300,#00ff88,#00b3ff,#a100ff);-webkit-background-clip:text;background-clip:text;color:transparent}
  html[data-edition=comic] .wo-film,html[data-edition=comic] .wo-finale-card{border:4px solid #111;box-shadow:8px 8px 0 #111;border-radius:6px}
  html[data-edition=clay] .wo-button{border-radius:16px;box-shadow:0 4px 0 rgba(90,38,22,.55)}
  `;
  document.head.append(css);

  const fonts = new Set();
  function font(e) {
    if (!e.font || fonts.has(e.font)) return;
    fonts.add(e.font);
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${e.font}&display=swap`;
    document.head.append(l);
  }

  // ── the atmosphere over the World (between the 3D canvas and its copy) ──
  let air = null, flashTimer = 0;
  const motes = n => Array.from({length: n}, () => `<b class="mote" style="--x:${(Math.random() * 100).toFixed(1)}%;--s:${(2 + Math.random() * 4).toFixed(1)}px;--d:${(9 + Math.random() * 12).toFixed(1)}s;--w:-${(Math.random() * 20).toFixed(1)}s;--dx:${((Math.random() - .5) * 120).toFixed(0)}px"></b>`).join('');
  const tape = () => {const s = ['N', '015', '030', 'NE', '060', '075', 'E', '105', '120', 'SE', '150', '165', 'S', '195', '210', 'SW', '240', '255', 'W', '285', '300', 'NW', '330', '345'].join(' · '); return `<em>${s} · ${s} · </em>`;};
  const AIR = {
    halloween: () => '<i class="fog"></i><i class="fog f2"></i><i class="moon"></i><i class="flash"></i>',
    heaven: () => `<i class="rays"></i><i class="bank"></i>${motes(26)}`,
    rgb: () => '<i class="glow"></i><i class="edge"></i>',
    tactical: () => `<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i><i class="reticle"></i><span class="tape">${tape()}</span><span class="rec">● ${T('Recording', 'تسجيل')}</span>`,
    comic: () => '<i class="dots a"></i><i class="dots b"></i><i class="panel"></i>',
    clay: () => '<i class="warm"></i><i class="print"></i><i class="grain"></i>',
  };
  function atmosphere(id) {
    if (!onWorld) return;
    const old = air; air = null; clearTimeout(flashTimer);
    if (old) {old.classList.remove('is-on'); setTimeout(() => old.remove(), 1200);}
    if (!AIR[id]) return;
    air = document.createElement('div');
    air.className = `ed-air is-${id}`; air.setAttribute('aria-hidden', 'true'); air.innerHTML = AIR[id]();
    document.body.append(air);
    requestAnimationFrame(() => requestAnimationFrame(() => air?.classList.add('is-on')));
    if (id === 'halloween' && !still) {
      const strike = () => {const f = air?.querySelector('.flash'); if (!f) return; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); flashTimer = setTimeout(strike, 9000 + Math.random() * 14000);};
      flashTimer = setTimeout(strike, 3500);
    }
  }
  // comic: a sound effect pops up whenever the walk moves to the next scene
  const POWS = ['POW!', 'ZAP!', 'WHAM!', 'KRAK!', 'BOOM!', 'SHAZAM!', 'BLAM!', 'ZOOM!', 'THWIP!', 'KAPOW!'];
  if (onWorld) new MutationObserver(() => {
    if (root.dataset.edition !== 'comic' || !air || still) return;
    const p = document.createElement('b');
    p.className = 'pow'; p.textContent = POWS[Math.floor(Math.random() * POWS.length)];
    const left = Math.random() < .5;
    Object.assign(p.style, {[left ? 'left' : 'right']: `${4 + Math.random() * 14}vw`, top: `${14 + Math.random() * 46}vh`});
    air.append(p); setTimeout(() => p.remove(), 1600);
  }).observe(root, {attributes: true, attributeFilter: ['data-world-scene']});

  // ── applying an edition ──
  function apply(id, how = 'live') {
    const e = byId(id);
    try {sessionStorage.setItem('mk-edition', e.id);} catch {}
    if (e.id) root.dataset.edition = e.id; else delete root.dataset.edition;
    font(e); atmosphere(e.id); label();
    if (how === 'live') {
      const u = new URL(location.href);
      if (e.id) u.searchParams.set('edition', e.id); else u.searchParams.delete('edition');
      history.replaceState(history.state, '', u);
    }
    dispatchEvent(new CustomEvent('mk:edition', {detail: {id: e.id, name: e.name}}));
  }
  // editions with a World of their own (src/scripts/editions/<id>; keep in step when one lands); the rest dress the World
  const PAGES = new Set(['tactical', 'keynote', 'halloween', 'heaven', 'rgb', 'comic', 'clay', 'doodle', 'blueprint', 'ice', 'crossover', 'impression', 'museum', 'machine', 'rounds']), edPage = root.hasAttribute('data-edition-page'), L = ar ? 'ar' : 'en';
  function go(id) {
    if (PAGES.has(id)) {location.href = `${base}/${L}/edition/${id}`; return;}
    if (edPage) {location.href = id ? `${base}/${L}/world?edition=${id}` : `${base}/${L}/world?edition=`; return;}
    if (onWorld || !id) return apply(id);
    location.href = `${base}/${L}/world?edition=${id}`;
  }

  // ── the picker ──
  const pickers = () => document.querySelectorAll('[data-edition-picker]');
  function label() {
    const e = byId(root.dataset.world || root.dataset.edition);
    for (const b of pickers()) {
      b.style.setProperty('--sw', e.id ? e.sw : 'conic-gradient(#ff8a1f,#e9c46a,#00e5ff,#9be564,#ffd400,#d97757,#ff8a1f)');   // standard: a swatch of every edition
      const n = b.querySelector('.ed-name'); if (n) n.textContent = e.id ? e.name : b.dataset.label || T('Editions', 'إصدارات');
    }
  }
  let menu = null, opener = null;
  function close(focus = false) {
    if (!menu) return;
    menu.remove(); menu = null;
    opener?.setAttribute('aria-expanded', 'false');
    if (focus) opener?.focus();
    removeEventListener('pointerdown', outside, true); removeEventListener('keydown', keys, true);
    removeEventListener('resize', placeMenu); window.visualViewport?.removeEventListener('resize', placeMenu);
  }
  const outside = ev => {if (menu && !menu.contains(ev.target) && !opener?.contains(ev.target)) close();};
  function keys(ev) {
    if (!menu) return;
    if (ev.key === 'Escape') {ev.preventDefault(); ev.stopPropagation(); close(true); return;}
    if (ev.key === 'Tab') {close(true); return;}
    if (['ArrowDown','ArrowUp','Home','End'].includes(ev.key)) {
      ev.preventDefault(); ev.stopPropagation();
      const items = [...menu.querySelectorAll('button[role^=menuitem]')], i = items.indexOf(document.activeElement);
      const j = ev.key === 'Home' ? 0 : ev.key === 'End' ? items.length - 1 : (i + (ev.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((b, n) => b.tabIndex = n === j ? 0 : -1);
      items[j].focus({preventScroll:true}); items[j].scrollIntoView({block:'nearest'});
    }
  }
  function placeMenu() {
    if (!menu || !opener) return;
    const view = window.visualViewport, vh = view?.height || innerHeight, vw = view?.width || innerWidth;
    const r = opener.getBoundingClientRect(), w = Math.min(340, vw - 24);
    const top = Math.max(12, Math.min(r.bottom + 8, vh - 160));
    const left = vw <= 640 ? 12 : Math.max(12, Math.min(vw - w - 12, ar ? r.left : r.right - w));
    Object.assign(menu.style, {left:`${left}px`,top:`${top}px`,maxHeight:`${Math.max(120,vh - top - 12)}px`});
    menu.style.setProperty('--ox', `${r.left + r.width / 2 - left}px`);
  }
  function open(btn) {
    if (menu) return close();
    opener = btn;
    const cur = root.dataset.world || root.dataset.edition || '';
    menu = document.createElement('div');
    menu.className = 'ed-menu'; menu.id = 'mk-editions-menu'; menu.dataset.noPrank = ''; menu.dataset.lenisPrevent = ''; menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', T('Special editions', 'الإصدارات الخاصة'));
    menu.innerHTML = `<div class="ed-menu-head"><h2>${T('Special editions', 'الإصدارات الخاصة')}</h2><button class="ed-close" type="button" role="menuitem" tabindex="-1" aria-label="${T('Close editions','إغلاق الإصدارات')}">×</button></div>` + ED.map(e => `<button type="button" role="menuitemradio" tabindex="-1" aria-checked="${e.id === cur}" data-ed="${e.id}"><i class="ed-sw" style="--sw:${e.sw}"></i><b></b><small></small></button>`).join('');
    menu.querySelectorAll('[data-ed]').forEach((b, i) => {b.querySelector('b').textContent = ED[i].name; b.querySelector('small').textContent = ED[i].note;});
    menu.querySelector('.ed-close').addEventListener('click', () => close(true));
    menu.addEventListener('click', ev => {const b = ev.target.closest('button[data-ed]'); if (!b) return; close(); go(b.dataset.ed);});
    document.body.append(menu);
    placeMenu();
    btn.setAttribute('aria-expanded', 'true');
    const selected = menu.querySelector('[aria-checked=true]') || menu.querySelector('[data-ed]');
    selected.tabIndex = 0; selected.focus({preventScroll:true}); selected.scrollIntoView({block:'nearest'});
    addEventListener('pointerdown', outside, true); addEventListener('keydown', keys, true);
    addEventListener('resize', placeMenu); window.visualViewport?.addEventListener('resize', placeMenu);
  }
  function wire() {
    for (const header of document.querySelectorAll('.m-nav,.world-header')) {
      header.dataset.siteNav = ''; header.dataset.noPrank = ''; header.dataset.noSteal = '';
      const primary = header.querySelector('nav:not(.style-switch)');
      if (primary) primary.dataset.primaryNav = '';
    }
    for (const b of pickers()) {
      if (b.dataset.wired) continue;
      b.dataset.wired = '1'; b.dataset.label = b.querySelector('.ed-name')?.textContent || '';
      b.setAttribute('aria-label', T('Choose a World edition', 'اختر إصداراً من العالم'));
      b.setAttribute('aria-controls', 'mk-editions-menu'); b.dataset.noPrank = '';
      b.addEventListener('click', () => open(b));
    }
    label();
  }

  window.mkEditions = {list: ED, apply, go};
  const start = () => {wire(); const e = byId(root.dataset.edition); font(e); atmosphere(e.id);};
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start); else start();
})();
