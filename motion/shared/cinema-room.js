/**
 * Cinema room, 2026-10-05. One fixed WebGL2 canvas behind the Motion gallery:
 *  - the room: the World's LED wall (src/scripts/world/shared.ts ledWall, the owner's pick for Home):
 *    a concave wall of dark panels with seams, a module grid and small crosses, deep blacks, playing
 *    the film on the screen frame for frame, big and dim, as Alche's wall carries the work in front of
 *    it (the owner, 2026-10-05; the violet tiles and giant MK it had before: git 8bdbac8). It slides
 *    a little as the page scrolls; the pointer warms the panels it passes. White mode: the World's
 *    pale paper with its "+" lattice (the Vision section);
 *  - the screen: inside the hero's screen element the film plays crisp on a rounded screen, one
 *    5-second chapter clip after another (the copy sits beside it, never over the film's own words);
 *  - every change (next chapter, another film) takes the next formation in turn: a gust of wind that
 *    blows the picture away as fine dust and carries the next one in, a soft fade, a pulse from the
 *    middle, dust rising like smoke, a sweep of light. The dust is grains of the pictures themselves,
 *    one to three pixels across (the owner, 2026-10-05: real dust, not blobs; different ways each time).
 * No dependencies. Returns null when WebGL2 is unavailable (the page keeps its poster fallback).
 *
 *   const room = createRoom(canvas, {hero, onChange, onEnded});
 *   room.play([{url, label}...], {film})   // a film's sequence of clips
 *   room.skip(), room.setActive(bool), room.dispose()
 *   room.video, room.contain                // the clip on screen
 */
const VERT = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos * .5 + .5; gl_Position = vec4(aPos, 0., 1.); }`;

// formations, in turn: 0 wind (left to right), 1 pulse (from the middle), 2 fade, 3 rise (bottom up), 4 sweep (light)
const ORDER = [0, 2, 1, 3, 2, 4];

const COMMON = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
// screen uv (0..1, y up) → uv inside a video drawn into rect r (x0,y0,x1,y1), cover or contain
vec2 fitUv(vec2 p, vec4 r, float va, float contain, vec2 res){
  vec2 q = (p - r.xy) / max(r.zw - r.xy, vec2(1e-4));
  float ra = (r.z - r.x) * res.x / max((r.w - r.y) * res.y, 1e-4);
  vec2 s = vec2(1.);
  if (contain < .5) { if (va > ra) s.x = ra / va; else s.y = va / ra; }
  else { if (va > ra) s.y = va / ra; else s.x = ra / va; }
  return (q - .5) * s + .5;
}
// how far the change has come at q (uv inside the screen): 0 the old picture, 1 the new; the dust lives between
float wave(vec2 q, float asp, float k, float style){
  if (style > 1.5 && style < 2.5) return smoothstep(.15, .85, k);
  float f = style < .5 ? q.x : style < 1.5 ? length((q - .5) * vec2(asp, 1.)) / length(vec2(asp, 1.) * .5) : style < 3.5 ? q.y : 1. - q.x;
  return clamp((k * 1.5 - .25 - f) / .22 + .5, 0., 1.);
}`;

const ROOM = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uA, uB;
uniform float uK, uVaA, uVaB, uFitA, uFitB, uTime, uPtrOn, uLive, uLight, uStyle, uRadius, uScroll;
uniform vec4 uRect; uniform vec2 uRes, uPtr;
${COMMON}
float line(float x, float w){ float d = abs(fract(x - .5) - .5) / fwidth(x); return 1. - min(d / w, 1.); }
// the World's LED wall, seen from the middle of its curve: column by angle, row by height. It plays the film on the
// screen, frame for frame, big and dim, the way Alche's wall carries the work in front of it (the owner, 2026-10-05: the
// wall should sync with the screen, not show violet tiles)
vec3 ledWall(vec2 uv, vec3 pic){
  vec2 s = (uv - .5) * 2. * vec2(uRes.x / uRes.y, 1.) * .62;
  float th = atan(s.x), hgt = s.y / sqrt(1. + s.x * s.x) + uScroll;
  vec2 w = vec2(th, hgt) * 5., pid = floor(w);
  vec3 c = pow(pic, vec3(2.2)) * (.15 + .05 * hash(pid + 9.));                     // linear light, like the World; dim, panels a little uneven
  // the hardware: modules inside each panel, dark seams between them, a small cross where four meet
  float module = max(line(w.x * 6., .8), line(w.y * 6., .8)), seam = max(line(w.x, 1.6), line(w.y, 1.6));
  vec3 col = c * (1. - .3 * module) + vec3(.012, .013, .02) * module;
  col *= 1. - .9 * seam;
  vec2 cc = abs(fract(w + .5) - .5);
  return col + vec3(.1, .105, .125) * step(min(cc.x, cc.y), .006) * step(max(cc.x, cc.y), .05);
}
// an LED wall lights every pixel of the film on its own: magnified, the pixels keep hard edges (one screen pixel of
// anti-aliasing), as on the World's walls (2026-10-05, the owner: the soft copy read as a blur)
vec2 sharp(sampler2D t, vec2 q){
  vec2 n = vec2(textureSize(t, 0)), p = q * n - .5, i = floor(p), f = p - i;
  f = clamp((f - .5) / max(fwidth(p), vec2(1e-3)) + .5, 0., 1.);
  return (i + f + .5) / n;
}
// White mode: the World's pale paper, a fine grid and a lattice of crosses
vec3 paper(vec2 uv){
  vec2 px = uv * uRes + vec2(0., uScroll * uRes.y * .4);
  float cell = uRes.y / 8.5, w = max(.6, uRes.y / 1500.);
  vec2 c = mod(px, cell) - cell * .5;
  float plus = step(abs(c.x), w) * step(abs(c.y), cell * .06) + step(abs(c.y), w) * step(abs(c.x), cell * .06);
  vec2 fc = abs(mod(px, cell * .25) - cell * .125);
  vec3 col = vec3(.83, .85, .87) * (1.05 - .14 * pow(length((uv - .5) * vec2(uRes.x / uRes.y, 1.)), 1.6));
  col *= 1. - .035 * step(cell * .125 - .7, max(fc.x, fc.y));
  return mix(col, vec3(.97, .98, .985), clamp(plus, 0., 1.) * .6);
}
void main(){
  vec2 uv = vUv, asp = vec2(uRes.x / uRes.y, 1.);
  // the film's light, enormous and soft, washing the wall
  vec2 fa = fitUv(uv, vec4(-.15, -.15, 1.15, 1.15), uVaA, 0., uRes), fb = fitUv(uv, vec4(-.15, -.15, 1.15, 1.15), uVaB, 0., uRes);
  vec3 amb = mix(textureLod(uA, clamp(fa, 0., 1.), 7.2).rgb, textureLod(uB, clamp(fb, 0., 1.), 7.2).rgb, smoothstep(.3, .7, uK));
  // the wall's copy of the film: the whole frame filling the wall, pixel-sharp, breathing slowly
  vec4 wr = vec4(-.04, -.04, 1.04, 1.04) + vec4(-1., -1., 1., 1.) * .015 * sin(uTime * .11);
  vec2 wa = fitUv(uv, wr, uVaA, 0., uRes), wb = fitUv(uv, wr, uVaB, 0., uRes);
  vec3 pic = mix(textureLod(uA, sharp(uA, clamp(wa, 0., 1.)), 0.).rgb, textureLod(uB, sharp(uB, clamp(wb, 0., 1.)), 0.).rgb, smoothstep(.3, .7, uK));
  amb = mix(vec3(dot(amb, vec3(.33))), amb, 1.35);                                   // a little more colour
  vec3 avg = textureLod(uB, vec2(.5), 10.).rgb;                                       // the film's own colour: the tiles take it on
  vec3 tint = pow(avg / max(max(avg.r, avg.g), max(avg.b, .05)), vec3(2.2));       // the film's own colour
  vec3 room = mix(pow(ledWall(uv, pic), vec3(1. / 2.2)), paper(uv) + amb * .04, uLight);   // the wall to screen colour (the film is already)
  // the pointer warms the panels it passes
  vec2 pd = (uv - uPtr) * asp;
  room += tint * .12 * exp(-dot(pd, pd) * 30.) * uPtrOn * (1. - uLight);
  // the screen: a rounded rectangle, the film crisp inside it, its light spilling round its edge
  vec2 P = uv * uRes, r0 = uRect.xy * uRes, r1 = uRect.zw * uRes, ctr = (r0 + r1) * .5, hs = (r1 - r0) * .5;
  vec2 dd = abs(P - ctr) - hs + uRadius;
  float sd = length(max(dd, 0.)) + min(max(dd.x, dd.y), 0.) - uRadius;
  float inside = (1. - smoothstep(-1., 1., sd)) * uLive;
  room += amb * .22 * exp(-max(sd, 0.) / (uRes.y * .05)) * uLive * (1. - uLight * .6);
  vec2 qr = (uv - uRect.xy) / max(uRect.zw - uRect.xy, vec2(1e-4));
  float t = wave(qr, hs.x / max(hs.y, 1.), uK, uStyle), band = 4. * t * (1. - t);
  bool fade = uStyle > 1.5 && uStyle < 2.5;
  vec2 va = fitUv(uv, uRect, uVaA, uFitA, uRes), vb = fitUv(uv, uRect, uVaB, uFitB, uRes);
  float okA = step(0., va.x) * step(va.x, 1.) * step(0., va.y) * step(va.y, 1.), okB = step(0., vb.x) * step(vb.x, 1.) * step(0., vb.y) * step(vb.y, 1.);
  float soft = fade ? band * 5. : band * 1.4;                                        // a fade blurs through; the others soften only at the front
  vec3 film = mix(textureLod(uA, clamp(va, 0., 1.), soft).rgb * okA, textureLod(uB, clamp(vb, 0., 1.), soft).rgb * okB, smoothstep(.4, .6, t));
  if (!fade) film = mix(film, amb * .25, band * .9);                                // at the front the picture has turned to dust (the dust pass draws it)
  if (uStyle > 3.5) film += vec3(1., .98, .94) * smoothstep(.12, 0., abs(t - .5)) * step(.01, band) * .6;   // the sweep: a line of light
  vec3 col = mix(room, film, inside);
  col += (hash(uv * uRes + fract(uTime) * 91.) - .5) * .028;                        // grain
  o = vec4(max(col, 0.), 1.);
}`;

const PVERT = `#version 300 es
precision highp float;
in vec2 aGrid; in float aSeed;
uniform sampler2D uA, uB;
uniform float uK, uTime, uVa, uFit, uPt, uStyle;
uniform vec4 uRect; uniform vec2 uRes;
out vec3 vC; out float vA;
${COMMON}
void main(){
  // aGrid is a uv inside the film; find where that grain sits on screen (inverse of the cover/contain fit)
  float ra = (uRect.z - uRect.x) * uRes.x / max((uRect.w - uRect.y) * uRes.y, 1e-4);
  vec2 s = vec2(1.);
  if (uFit < .5) { if (uVa > ra) s.x = ra / uVa; else s.y = uVa / ra; }
  else { if (uVa > ra) s.y = uVa / ra; else s.x = ra / uVa; }
  vec2 q = (aGrid - .5) / s + .5;
  vec2 home = uRect.xy + q * (uRect.zw - uRect.xy);
  float t = wave(q, ra, uK, uStyle);
  float s2 = fract(aSeed * 7.31), s3 = fract(aSeed * 13.7);
  bool leaving = aSeed < .5;                                   // half the grains leave with the old picture, half bring the new one
  // where it travels: with the wind, out from the middle, up like smoke, or back against the sweep
  vec2 dir = uStyle < .5 ? vec2(1., (s2 - .5) * .5) : uStyle < 1.5 ? normalize((q - .5) * vec2(ra, 1.) + 1e-4) : uStyle < 3.5 ? vec2((s2 - .5) * .5, 1.) : vec2(-1., (s2 - .5) * .3);
  vec2 turb = vec2(noise(q * 6. + uTime * .7 + s3 * 9.), noise(q * 6. - uTime * .6 + 4.1)) - .5;
  float life = leaving ? smoothstep(.35, 1., t) : 1. - smoothstep(0., .65, t);    // 0 at home, 1 far away
  float reach = (.05 + .3 * s2 * s2) * (uStyle > .5 && uStyle < 1.5 ? 1.4 : 1.);
  vec2 off = (dir * reach + turb * .16) * life * (leaving ? 1. : -1.);
  if (!leaving && uStyle < 1.5 && uStyle > .5) off = -dir * reach * life * .8 + turb * .1 * life;   // the pulse draws the new picture back in
  vec2 pos = home + off / vec2(uRes.x / uRes.y, 1.);
  vC = (leaving ? textureLod(uA, aGrid, 1.).rgb : textureLod(uB, aGrid, 1.).rgb) * (1.05 + .7 * s2);
  float inRect = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
  vA = smoothstep(0., .06, life) * (1. - life) * 1.6 * inRect * (.7 + .3 * sin(uTime * 9. + s3 * 40.));   // in flight only, glinting
  gl_PointSize = uPt * (.5 + 1. * s3);
  gl_Position = vec4(pos * 2. - 1., 0., 1.);
}`;

const PFRAG = `#version 300 es
precision highp float;
in vec3 vC; in float vA; out vec4 o;
uniform float uLight;
void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if (r > .5) discard; float a = vA * smoothstep(.5, .15, r);
  o = uLight > .5 ? vec4(vC * .9, a) : vec4(vC * a, a); }`;

export function createRoom(canvas, {hero, onChange, onEnded} = {}) {
  const gl = canvas.getContext('webgl2', {antialias: false, alpha: false, depth: false, premultipliedAlpha: false, powerPreference: 'high-performance'});
  if (!gl) return null;
  const compile = (type, src) => {const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s;};
  const program = (vs, fs) => {const p = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p;};
  const roomProg = program(VERT, ROOM), partProg = program(PVERT, PFRAG);
  const loc = (p, names) => Object.fromEntries(names.map(n => [n, gl.getUniformLocation(p, n)]));
  const RU = loc(roomProg, ['uA', 'uB', 'uK', 'uVaA', 'uVaB', 'uFitA', 'uFitB', 'uTime', 'uPtrOn', 'uLive', 'uLight', 'uStyle', 'uRadius', 'uScroll', 'uRect', 'uRes', 'uPtr']);
  const PU = loc(partProg, ['uA', 'uB', 'uK', 'uTime', 'uVa', 'uFit', 'uPt', 'uStyle', 'uRect', 'uRes', 'uLight']);

  const tri = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tri);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const roomVao = gl.createVertexArray();
  gl.bindVertexArray(roomVao);
  const aPos = gl.getAttribLocation(roomProg, 'aPos');
  gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const partVao = gl.createVertexArray(), partBuf = gl.createBuffer();
  let partCount = 0, gridKey = '';
  function buildGrid(cols, rows) {
    const key = `${cols}x${rows}`; if (key === gridKey) return; gridKey = key;
    const data = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {data[k++] = (x + Math.random()) / cols; data[k++] = (y + Math.random()) / rows; data[k++] = Math.random();}
    partCount = cols * rows;
    gl.bindVertexArray(partVao); gl.bindBuffer(gl.ARRAY_BUFFER, partBuf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const g = gl.getAttribLocation(partProg, 'aGrid'), s = gl.getAttribLocation(partProg, 'aSeed');
    gl.enableVertexAttribArray(g); gl.vertexAttribPointer(g, 2, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(s); gl.vertexAttribPointer(s, 1, gl.FLOAT, false, 12, 8);
  }

  // two video slots, each with its texture
  const slots = [0, 1].map(() => {
    const video = document.createElement('video');
    Object.assign(video, {muted: true, playsInline: true, preload: 'auto', loop: false});
    video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 8, 10, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    return {video, tex, aspect: 16 / 9, ready: false, url: ''};
  });
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const upload = s => {
    if (s.video.readyState < 2) return;
    gl.bindTexture(gl.TEXTURE_2D, s.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, s.video);
    gl.generateMipmap(gl.TEXTURE_2D);
    s.aspect = (s.video.videoWidth || 16) / (s.video.videoHeight || 9);
    s.ready = true;
  };

  let to = 0, from = 0, k = 1, transStart = 0, transDur = 1.2, list = [], index = -1, active = true, live = false, filmInfo = null, generation = 0, changes = 0, style = 2;
  const pointer = {x: .5, y: .5, on: 0, target: 0};
  let raf = 0, dpr = 1, last = performance.now(), light = document.documentElement.dataset.siteMode === 'white' ? 1 : 0;
  const contain = s => {const r = hero?.getBoundingClientRect(); return r && s.aspect > 1.2 && r.width / Math.max(1, r.height) < 1.2 ? 1 : 0;};   // keep a wide film whole on a narrow screen

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.5 : 1.5);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function heroRect() {
    if (!hero) return [0, 0, 0, 0];
    const r = hero.getBoundingClientRect();
    return [r.left / innerWidth, 1 - r.bottom / innerHeight, r.right / innerWidth, 1 - r.top / innerHeight];
  }

  function waitReady(video, ms = 4000) {
    return new Promise((resolve, reject) => {
      if (video.readyState >= 3) return resolve();
      const done = () => {clearTimeout(t); video.removeEventListener('canplay', done); video.removeEventListener('error', fail); resolve();};
      const fail = () => {clearTimeout(t); video.removeEventListener('canplay', done); video.removeEventListener('error', fail); reject(new Error('clip failed'));};
      const t = setTimeout(fail, ms);
      video.addEventListener('canplay', done); video.addEventListener('error', fail);
    });
  }

  async function show(i, duration) {
    const g = ++generation;
    const item = list[i]; if (!item) return;
    const next = 1 - to, s = slots[next];
    s.video.pause();
    if (s.url !== item.url) {s.url = item.url; s.ready = false; s.video.src = item.url; s.video.load();}
    try {await waitReady(s.video);} catch {if (g === generation) advance(); return;}
    if (g !== generation) return;
    s.video.currentTime = 0;
    await s.video.play().catch(() => {});
    upload(s);
    slots[to].video.pause();
    style = live ? ORDER[changes++ % ORDER.length] : 2;   // the very first picture fades in; after that each change takes the next formation
    from = to; to = next; index = i; k = 0; transStart = performance.now(); transDur = duration;
    live = true;
    onChange?.({index, count: list.length, item, film: filmInfo});
    // warm the following clip so the next change is instant
    const after = list[(i + 1) % list.length];
    if (after && after.url !== item.url) fetch(after.url, {priority: 'low'}).catch(() => {});
  }
  function advance() {
    if (!active) return;
    if (index + 1 < list.length) show(index + 1, 1.6);
    else onEnded?.(filmInfo);
  }
  for (const s of slots) s.video.addEventListener('timeupdate', () => {
    const v = s.video;
    if (slots[to] === s && k >= 1 && active && v.duration && v.currentTime >= v.duration - .32) {v.pause(); advance();}
  });
  for (const s of slots) s.video.addEventListener('ended', () => {if (slots[to] === s && active) advance();});

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    pointer.x = e.clientX / innerWidth; pointer.y = 1 - e.clientY / innerHeight; pointer.target = 1;
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => {pointer.target = 0;});

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (k < 1) k = Math.min(1, (now - transStart) / 1000 / transDur);
    const st = slots[to], sf = slots[from];
    if (!st.video.paused) upload(st);
    pointer.on += (pointer.target - pointer.on) * (1 - Math.exp(-dt * 6));
    const rect = heroRect(), t = now / 1000, A = k < 1 ? sf : st;
    light += ((document.documentElement.dataset.siteMode === 'white' ? 1 : 0) - light) * (1 - Math.exp(-dt * 4));
    gl.disable(gl.BLEND);
    gl.useProgram(roomProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A.tex); gl.uniform1i(RU.uA, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, st.tex); gl.uniform1i(RU.uB, 1);
    gl.uniform1f(RU.uK, k < 1 ? k : 1); gl.uniform1f(RU.uStyle, style); gl.uniform1f(RU.uScroll, scrollY / innerHeight * .22);
    gl.uniform1f(RU.uVaA, A.aspect); gl.uniform1f(RU.uVaB, st.aspect);
    gl.uniform1f(RU.uFitA, contain(A)); gl.uniform1f(RU.uFitB, contain(st));
    gl.uniform1f(RU.uTime, t); gl.uniform1f(RU.uPtrOn, pointer.on); gl.uniform1f(RU.uLive, live && st.ready ? 1 : 0);
    gl.uniform1f(RU.uLight, light); gl.uniform1f(RU.uRadius, (innerWidth < 760 ? 14 : 18) * dpr);
    gl.uniform4f(RU.uRect, ...rect); gl.uniform2f(RU.uRes, canvas.width, canvas.height); gl.uniform2f(RU.uPtr, pointer.x, pointer.y);
    gl.bindVertexArray(roomVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // the dust: grains of both pictures in flight, a pixel or three across (not for a plain fade)
    if (k > .02 && k < .98 && live && style !== 2) {
      const pxW = (rect[2] - rect[0]) * canvas.width, pxH = (rect[3] - rect[1]) * canvas.height, cell = 2.6 * dpr;
      buildGrid(Math.max(8, Math.round(pxW / cell)), Math.max(8, Math.round(pxH / cell)));
      gl.enable(gl.BLEND);
      if (light > .5) gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); else gl.blendFunc(gl.ONE, gl.ONE);   // in the dark they glint like dust in a beam
      gl.useProgram(partProg);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sf.tex); gl.uniform1i(PU.uA, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, st.tex); gl.uniform1i(PU.uB, 1);
      gl.uniform1f(PU.uK, k); gl.uniform1f(PU.uTime, t); gl.uniform1f(PU.uVa, st.aspect); gl.uniform1f(PU.uFit, contain(st));
      gl.uniform1f(PU.uPt, 2.2 * dpr); gl.uniform1f(PU.uStyle, style); gl.uniform1f(PU.uLight, light);
      gl.uniform4f(PU.uRect, ...rect); gl.uniform2f(PU.uRes, canvas.width, canvas.height);
      gl.bindVertexArray(partVao);
      gl.drawArrays(gl.POINTS, 0, partCount);
    }
  }
  resize();
  addEventListener('resize', resize, {passive: true});
  raf = requestAnimationFrame(frame);

  return {
    /** Play a film's clips in order; the first change uses the longer "new film" transition. */
    play(items, info) {list = items; filmInfo = info; index = -1; show(0, 2);},
    skip() {advance();},
    goto(i) {if (list[i]) show(i, 1.4);},
    setActive(on) {
      active = on;
      const v = slots[to].video;
      if (!on) v.pause(); else if (live && v.paused && !(v.duration && v.currentTime >= v.duration - .32)) v.play().catch(() => {});
      else if (live && on && v.duration && v.currentTime >= v.duration - .32) advance();
    },
    get index() {return index;},
    /** The clip on screen and how it is fitted. */
    get video() {return slots[to].ready ? slots[to].video : null;},
    get contain() {return !!contain(slots[to]);},
    dispose() {cancelAnimationFrame(raf); for (const s of slots) {s.video.pause(); s.video.removeAttribute('src'); s.video.load();}},
  };
}
