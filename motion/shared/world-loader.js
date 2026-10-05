/**
 * World loader (Alche's opening): black, the MK monogram drawn in thin construction lines with its guides (circles, the
 * M's diagonals run long, cap and base lines across the screen) and the tagline. When the World has really loaded (the
 * hero fires world:surge after a run of smooth frames), a glass ball pops up in the middle of the drawing: it bends the
 * lines like a lens (upside down in the middle, stretched at the rim, swirling), splits them into colours at the edge,
 * and fills with the World's violet light; then the drawing fades away round it and the World's own glass, the same
 * ball, carries on: it swells into a fat glass MK and deflates into the mark (src/scripts/world/lens.ts). Fallbacks: world-failed, or 9 s. Classic <head> script so it covers the first paint; html[data-loader=blueprint]
 * tells the shared arcade loader to stand aside. (The earlier blurry burst: src/legacy/world-loader-blob.js.txt.)
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

  // The glass ball. The finished drawing, painted into a canvas, is what it bends.
  function ball() {
    const dpr = Math.min(devicePixelRatio || 1, 2), W = Math.round(innerWidth * dpr), H = Math.round(innerHeight * dpr);
    const s = Math.min(W / VB[2], H / VB[3]), ox = (W - VB[2] * s) / 2 - VB[0] * s, oy = (H - VB[3] * s) / 2 - VB[1] * s;
    const P = (x, y) => [ox + x * s, oy + y * s];
    const art = document.createElement('canvas'); art.width = W; art.height = H;
    const g = art.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(225,240,233,.5)'; g.lineWidth = 1.2 * dpr;
    for (const [x1, y1, x2, y2] of lines) {g.beginPath(); g.moveTo(...P(x1, y1)); g.lineTo(...P(x2, y2)); g.stroke();}
    for (const [cx, cy, r] of circles) {g.beginPath(); g.arc(...P(cx, cy), r * s, 0, Math.PI * 2); g.stroke();}
    g.strokeStyle = 'rgba(245,250,248,.95)'; g.lineWidth = 1.6 * dpr;
    g.stroke(new Path2D(`${M} ${K}`.replace(/([\d.]+) ([\d.]+)/g, (_, x, y) => P(+x, +y).join(' '))));
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const gl = cv.getContext('webgl', {premultipliedAlpha: false, alpha: true, antialias: true});
    if (!gl) return null;
    const sh = (type, src) => {const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o;};
    const pg = gl.createProgram();
    gl.attachShader(pg, sh(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }'));
    gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, `precision highp float;
      uniform sampler2D uArt; uniform vec2 uRes, uC; uniform float uR, uT, uHole, uViolet; varying vec2 v;
      void main(){
        vec2 px = v * uRes, d = (px - uC) / uR;
        float r = length(d);
        if (r > 1. || r < uHole) { gl_FragColor = vec4(0.); return; }      // outside: the drawing; inside the hole: the World
        float z = sqrt(1. - r * r);
        // a glass ball: what is behind it shows upside down in the middle, stretched towards the rim, and it swirls
        float a = atan(d.y, d.x) + (1. - r) * (1.7 + uT * 1.1);
        float k = -.6 + 1.45 * r * r;
        vec3 col;
        for (int i = 0; i < 3; i++) {
          float sp = 1. + (float(i) - 1.) * .06 * (1. - z * .7);                   // each colour bends a little differently
          vec2 q = (uC + vec2(cos(a), sin(a)) * r * uR * k * sp) / uRes;
          col[i] = texture2D(uArt, clamp(q, .001, .999)).r;
        }
        col *= 1.5;
        // the World's light inside it
        float swirl = .5 + .5 * sin(a * 3. - uT * 2. + r * 6.);
        col += vec3(.33, .22, 1.) * uViolet * (.25 + .75 * swirl) * (.4 + .6 * z) + vec3(.9, .88, 1.) * uViolet * pow(swirl, 8.) * .5;
        // the glass: a fresnel glow at the rim, a hairline edge, a soft highlight
        col += vec3(.7, .76, 1.) * pow(1. - z, 3.) * .8;
        col += vec3(1.) * smoothstep(.975, .995, r) * (1. - smoothstep(.995, 1., r)) * .9;
        col += vec3(1.) * smoothstep(.28, 0., length(d - vec2(-.35, .42))) * .22;
        float edge = smoothstep(uHole, uHole + .04, r);                           // the window's rim is soft
        gl_FragColor = vec4(col, edge);
      }`));
    gl.linkProgram(pg); gl.useProgram(pg);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pg, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture()); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, art);
    for (const [k, val] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, val);
    const U = n => gl.getUniformLocation(pg, n);
    gl.uniform2f(U('uRes'), W, H);
    const [cx, cy] = P(500, 505);
    gl.uniform2f(U('uC'), cx, H - cy);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    el.append(cv);
    const u = {r: U('uR'), t: U('uT'), hole: U('uHole'), violet: U('uViolet')};
    return {cx: cx / dpr, cy: cy / dpr, dpr, W, H, draw(R, t, hole, violet) {
      gl.uniform1f(u.r, R * dpr); gl.uniform1f(u.t, t); gl.uniform1f(u.hole, hole); gl.uniform1f(u.violet, violet);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    }};
  }

  let gone = false;
  function open() {
    if (gone) return; gone = true;
    const done = () => {el.classList.add('is-done'); setTimeout(() => el.remove(), 700);};
    const b = !still && ball();
    if (!b) return done();
    el.classList.add('is-open');
    const R0 = Math.min(innerWidth, innerHeight) * (tall ? .3 : .22);      // the World's lens (lens.ts) starts at this size, in the middle
    const t0 = performance.now();
    const spring = x => 1 - Math.exp(-7 * x) * Math.cos(9 * x);            // pops up with a little overshoot
    (function frame(now) {
      const t = (now - t0) / 1000;
      // 0–.45 s it pops up; .45–.85 s it swirls and fills with light; then the World's own glass takes its place, the
      // same ball, and goes on to swell into the mark, while the drawing fades away around it
      b.draw(R0 * spring(Math.min(t / .45, 1.4)), t, 0, Math.min(1, t / .8));
      el.style.opacity = String(1 - Math.min(1, Math.max(0, (t - .85) / .3)));
      if (t < 1.2) requestAnimationFrame(frame); else done();
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
