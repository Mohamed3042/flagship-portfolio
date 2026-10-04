/**
 * Cinema room, 2026-10-04. One fixed WebGL2 canvas behind the Motion gallery:
 *  - the room: the playing film's colours spill across the page (an enlarged, very soft copy of the
 *    frame), cut by projector beams with drifting dust and a faint flicker; the pointer is a hand in
 *    the beam and casts a soft shadow on everything;
 *  - the billboard: inside the hero's rectangle the film plays crisp, one 5-second chapter clip after
 *    another;
 *  - every change (next chapter, another film): the frame blurs, breaks into particles that drift and
 *    re-form as the new picture, then sharpens.
 * No dependencies. Returns null when WebGL2 is unavailable (the page keeps its poster fallback).
 *
 *   const room = createRoom(canvas, {hero, onChange, onEnded});
 *   room.play([{url, label}...], {film})   // a film's sequence of clips
 *   room.skip(), room.setActive(bool), room.dispose()
 */
const VERT = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos * .5 + .5; gl_Position = vec4(aPos, 0., 1.); }`;

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
}`;

const ROOM = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uA, uB;
uniform float uK, uVaA, uVaB, uFitA, uFitB, uTime, uFlick, uPtrOn, uLive, uSide, uLight;
uniform vec4 uRect; uniform vec2 uRes, uPtr;
${COMMON}
vec3 frame(vec2 uvA, vec2 uvB, float lod){
  vec3 a = textureLod(uA, clamp(uvA, 0., 1.), lod).rgb, b = textureLod(uB, clamp(uvB, 0., 1.), lod).rgb;
  return mix(a, b, smoothstep(.45, .55, uK));
}
void main(){
  vec2 uv = vUv, asp = vec2(uRes.x / uRes.y, 1.);
  // the room: the frame, enormous and soft, like light bouncing off the walls
  vec2 fa = fitUv(uv, vec4(-.15, -.15, 1.15, 1.15), uVaA, 0., uRes), fb = fitUv(uv, vec4(-.15, -.15, 1.15, 1.15), uVaB, 0., uRes);
  vec3 amb = frame(fa, fb, 7.2);
  amb = mix(vec3(dot(amb, vec3(.33))), amb, 1.35);                                   // a little more colour
  // projector beams from above and behind the viewer
  vec2 org = vec2(.5, 1.25) * asp, d = uv * asp - org;
  float ang = atan(d.x, -d.y), dist = length(d);
  float beams = 0.;
  for (int i = 0; i < 5; i++) {
    float a = (float(i) - 2.) * .19 + sin(uTime * .05 + float(i) * 1.7) * .03;
    beams += smoothstep(.09, 0., abs(ang - a)) * (.55 + .45 * noise(vec2(float(i) * 3.1, uTime * .2)));
  }
  float cone = smoothstep(.62, .2, abs(ang)) * smoothstep(2.2, .35, dist);
  beams *= cone;
  float dust = step(.9965, hash(floor((uv * asp + vec2(uTime * .006, -uTime * .011)) * uRes.y * .35))) * cone * 1.4;
  vec3 room = amb * (.2 + .2 * cone) + amb * beams * .32 + vec3(dust) * (.5 + amb);
  room *= uFlick;
  // White mode: the same light, falling on a pale wall instead of a dark room
  vec3 wall = vec3(.955, .945, .925) + amb * (.06 + .16 * cone) + amb * beams * .14 - vec3(dust) * .05;
  room = mix(room, wall, uLight);
  // the billboard: the film itself, crisp, inside the hero's rectangle
  float inside = step(uRect.x, uv.x) * step(uv.x, uRect.z) * step(uRect.y, uv.y) * step(uv.y, uRect.w) * uLive;
  vec2 va = fitUv(uv, uRect, uVaA, uFitA, uRes), vb = fitUv(uv, uRect, uVaB, uFitB, uRes);
  float ok = mix(step(0., va.x) * step(va.x, 1.) * step(0., va.y) * step(va.y, 1.), step(0., vb.x) * step(vb.x, 1.) * step(0., vb.y) * step(vb.y, 1.), smoothstep(.45, .55, uK));
  float blur = (uK < .5 ? smoothstep(0., .32, uK) : 1. - smoothstep(.68, 1., uK)) * 5.5;
  // depth of field: the side the title sits on (or the bottom, on phones) goes soft so the copy reads
  vec2 qr = (uv - uRect.xy) / max(uRect.zw - uRect.xy, vec2(1e-4));
  float dof = uSide > .5 ? smoothstep(.68, .04, qr.x) * 3.4 : uSide < -.5 ? smoothstep(.32, .96, qr.x) * 3.4 : smoothstep(.8, .12, qr.y) * 3.2;
  vec3 film = frame(va, vb, max(blur, dof));
  float particles = smoothstep(.22, .38, uK) * (1. - smoothstep(.62, .78, uK));       // the particle pass owns the middle
  film = mix(film, amb * .35, particles);
  vec3 col = mix(room, film, inside * ok);
  // a hand in the beam: soft shadow under the pointer, a warm rim at its edge
  vec2 pd = (uv - uPtr) * asp;
  float wob = noise(pd * 9. + uTime * .6) * .03;
  float r = length(pd) + wob;
  float shadow = smoothstep(.19, .07, r) * uPtrOn;
  float rim = smoothstep(.2, .17, r) * smoothstep(.15, .19, r) * uPtrOn;
  col *= 1. - shadow * mix(.62, .22, uLight * (1. - inside * ok));
  col += amb * rim * .35;
  col += (hash(uv * uRes + fract(uTime) * 91.) - .5) * .028;                        // grain
  o = vec4(max(col, 0.), 1.);
}`;

const PVERT = `#version 300 es
precision highp float;
in vec2 aGrid; in float aSeed;
uniform sampler2D uA, uB;
uniform float uK, uTime, uVaA, uFitA, uPt, uStyle;
uniform vec4 uRect; uniform vec2 uRes;
out vec3 vC; out float vA;
${COMMON}
void main(){
  // aGrid is a uv inside the film; find where that pixel sits on screen (inverse of a cover/contain fit)
  float ra = (uRect.z - uRect.x) * uRes.x / max((uRect.w - uRect.y) * uRes.y, 1e-4);
  vec2 s = vec2(1.);
  if (uFitA < .5) { if (uVaA > ra) s.x = ra / uVaA; else s.y = uVaA / ra; }
  else { if (uVaA > ra) s.y = uVaA / ra; else s.x = ra / uVaA; }
  vec2 q = (aGrid - .5) / s + .5;
  vec2 home = uRect.xy + q * (uRect.zw - uRect.xy);
  float p = sin(clamp(uK, 0., 1.) * 3.14159);
  vec2 asp = vec2(uRes.x / uRes.y, 1.);
  vec2 dir = normalize((q - .5) * asp + (vec2(hash(aGrid * 7.1), hash(aGrid * 3.7)) - .5) * .5 + 1e-4);
  float sw = (aSeed - .5) * 2.4 * p;
  dir = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * dir;
  vec2 drift = vec2(noise(aGrid * 6. + uTime * .5), noise(aGrid * 6. - uTime * .4)) - .5;
  // each film breaks apart its own way
  vec2 disp;
  if (uStyle < .5) disp = dir * (.04 + .18 * aSeed) + drift * .12;                                   // scatter
  else if (uStyle < 1.5) {                                                                           // orbit swirl
    vec2 c = (q - .5) * asp; float r = length(c), a = atan(c.y, c.x) + (2.6 - r * 1.4) * (aSeed + .5);
    disp = vec2(cos(a), sin(a)) * r * 1.2 - c;
  } else if (uStyle < 2.5) disp = vec2((aSeed - .5) * .14, -(.12 + .5 * aSeed)) + drift * .06;     // sprinkles falling
  else if (uStyle < 3.5) disp = vec2((aSeed - .5) * .03, sin(q.x * 18. + uTime * 4.) * .09 * (.5 + aSeed)); // sound wave
  else if (uStyle < 4.5) {float row = floor(q.y * 26.); disp = vec2((hash(vec2(row, 1.7)) - .25) * .55, (aSeed - .5) * .01);} // streaming rows
  else if (uStyle < 5.5) {float an = noise(q * 3. + uTime * .25) * 6.283; disp = vec2(cos(an), sin(an)) * (.08 + .16 * aSeed);} // flock flow
  else if (uStyle < 6.5) {vec2 cell = floor(q * vec2(12., 7.)); disp = (vec2(hash(cell + 3.), hash(cell + 7.)) - .5) * .55 * hash(cell) + vec2(0., -.08);} // tiles flip out
  else disp = vec2(.38 * (1. - q.y) * aSeed, (aSeed - .5) * .06);                                  // page sweep
  vec2 pos = home * asp + disp * p;
  pos /= asp;
  vec3 a = textureLod(uA, aGrid, 1.5).rgb, b = textureLod(uB, aGrid, 1.5).rgb;
  vC = mix(a, b, smoothstep(.42, .58, uK));
  float inRect = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
  vA = smoothstep(.1, .34, uK) * (1. - smoothstep(.66, .9, uK)) * inRect;
  gl_PointSize = uPt * (.7 + .9 * p * (.5 + aSeed));
  gl_Position = vec4(pos * 2. - 1., 0., 1.);
}`;

const PFRAG = `#version 300 es
precision highp float;
in vec3 vC; in float vA; out vec4 o;
void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if (r > .5) discard; float a = vA * smoothstep(.5, .3, r); o = vec4(vC * 1.08, a); }`;

export function createRoom(canvas, {hero, onChange, onEnded, style = 0} = {}) {
  const gl = canvas.getContext('webgl2', {antialias: false, alpha: false, depth: false, premultipliedAlpha: false, powerPreference: 'high-performance'});
  if (!gl) return null;
  const compile = (type, src) => {const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s;};
  const program = (vs, fs) => {const p = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p;};
  const roomProg = program(VERT, ROOM), partProg = program(PVERT, PFRAG);
  const loc = (p, names) => Object.fromEntries(names.map(n => [n, gl.getUniformLocation(p, n)]));
  const RU = loc(roomProg, ['uA', 'uB', 'uK', 'uVaA', 'uVaB', 'uFitA', 'uFitB', 'uTime', 'uFlick', 'uPtrOn', 'uLive', 'uSide', 'uLight', 'uRect', 'uRes', 'uPtr']);
  const PU = loc(partProg, ['uA', 'uB', 'uK', 'uTime', 'uVaA', 'uFitA', 'uPt', 'uStyle', 'uRect', 'uRes']);

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
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {data[k++] = (x + .5) / cols; data[k++] = (y + .5) / rows; data[k++] = Math.random();}
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

  let to = 0, from = 0, k = 1, transStart = 0, transDur = 1.2, list = [], index = -1, active = true, live = false, filmInfo = null, generation = 0;
  const pointer = {x: .5, y: .5, on: 0, target: 0};
  let flick = 1, raf = 0, dpr = 1, last = performance.now(), light = document.documentElement.dataset.siteMode === 'white' ? 1 : 0;
  const contain = s => (s.aspect > 1.2 && (innerWidth / innerHeight) < .9 ? 1 : 0); // keep a 16:9 film whole on a phone

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.25 : 1.5);
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
    from = to; to = next; index = i; k = 0; transStart = performance.now(); transDur = duration;
    live = true;
    onChange?.({index, count: list.length, item, film: filmInfo});
    // warm the following clip so the next change is instant
    const after = list[(i + 1) % list.length];
    if (after && after.url !== item.url) fetch(after.url, {priority: 'low'}).catch(() => {});
  }
  function advance() {
    if (!active) return;
    if (index + 1 < list.length) show(index + 1, 1.15);
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
    flick = .97 + .03 * Math.sin(now * .013) * Math.sin(now * .0071) + (Math.random() - .5) * .02;
    const rect = heroRect();
    const t = now / 1000;
    gl.disable(gl.BLEND);
    gl.useProgram(roomProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, (k < 1 ? sf : st).tex); gl.uniform1i(RU.uA, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, st.tex); gl.uniform1i(RU.uB, 1);
    gl.uniform1f(RU.uK, k < 1 ? k : 1);
    gl.uniform1f(RU.uVaA, (k < 1 ? sf : st).aspect); gl.uniform1f(RU.uVaB, st.aspect);
    gl.uniform1f(RU.uFitA, contain(k < 1 ? sf : st)); gl.uniform1f(RU.uFitB, contain(st));
    gl.uniform1f(RU.uTime, t); gl.uniform1f(RU.uFlick, flick); gl.uniform1f(RU.uPtrOn, pointer.on); gl.uniform1f(RU.uLive, live && st.ready ? 1 : 0);
    light += ((document.documentElement.dataset.siteMode === 'white' ? 1 : 0) - light) * (1 - Math.exp(-dt * 4));
    gl.uniform1f(RU.uLight, light);
    gl.uniform1f(RU.uSide, innerWidth / innerHeight < .9 ? 0 : document.documentElement.dir === 'rtl' ? -1 : 1);
    gl.uniform4f(RU.uRect, ...rect); gl.uniform2f(RU.uRes, canvas.width, canvas.height); gl.uniform2f(RU.uPtr, pointer.x, pointer.y);
    gl.bindVertexArray(roomVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (k > .08 && k < .92 && live) {
      const pxW = (rect[2] - rect[0]) * canvas.width, pxH = (rect[3] - rect[1]) * canvas.height, cell = 9 * dpr;
      buildGrid(Math.max(8, Math.round(pxW / cell)), Math.max(8, Math.round(pxH / cell)));
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(partProg);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sf.tex); gl.uniform1i(PU.uA, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, st.tex); gl.uniform1i(PU.uB, 1);
      gl.uniform1f(PU.uK, k); gl.uniform1f(PU.uTime, t); gl.uniform1f(PU.uVaA, st.aspect); gl.uniform1f(PU.uFitA, contain(st));
      gl.uniform1f(PU.uPt, cell * 1.05); gl.uniform1f(PU.uStyle, style); gl.uniform4f(PU.uRect, ...rect); gl.uniform2f(PU.uRes, canvas.width, canvas.height);
      gl.bindVertexArray(partVao);
      gl.drawArrays(gl.POINTS, 0, partCount);
    }
  }
  resize();
  addEventListener('resize', resize, {passive: true});
  raf = requestAnimationFrame(frame);

  return {
    /** Play a film's clips in order; the first change uses the longer "new film" transition. */
    play(items, info) {list = items; filmInfo = info; index = -1; show(0, 1.6);},
    skip() {advance();},
    goto(i) {if (list[i]) show(i, 1.1);},
    setActive(on) {
      active = on;
      const v = slots[to].video;
      if (!on) v.pause(); else if (live && v.paused && !(v.duration && v.currentTime >= v.duration - .32)) v.play().catch(() => {});
      else if (live && on && v.duration && v.currentTime >= v.duration - .32) advance();
    },
    get index() {return index;},
    dispose() {cancelAnimationFrame(raf); for (const s of slots) {s.video.pause(); s.video.removeAttribute('src'); s.video.load();}},
  };
}
