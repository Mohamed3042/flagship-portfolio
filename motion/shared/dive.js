/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/* Dive: a continuous camera move through a set of pictures, for the edition cutscenes and Space.
   Each shot glides toward its focal point while a real camera travels into the picture: its depth map (name.d.webp:
   red is how near each pixel is, green what is behind near things; made once with Depth Anything V2) lets near things
   slide past far ones, and its background layer (name.bg.webp) shows what is behind an edge when the camera looks past
   it. The next picture grows out of exactly that region as a soft-edged inset until it fills the frame, so nothing ever
   cuts. Depth of field, a flare at every hand-off and bokeh past the lens carry it. The pointer leans the camera; at
   rest the picture breathes. A shot can bring its own effects (fx: fog, flicker, rays, dust, bats) or take the dive's.
   A picture without a depth map stays flat. (The flat version is archived in src/legacy/dive-flat.js.txt.)
   const d = mkDive(canvas, {tint: '#ffb000', bokeh: 1, depth: .16, fx});
   d.play([{src, f: [x, y], z, fx?, video?}, ...], {seconds: 9, onDone});   // or d.seek(p) for scroll-driven use
   fx = {fog: [{d, y: [y0, y1], color, a, wind: [x, y], scale}], flicker: {amt, glow}, rays: {at: [x, y], amt},
         dust: {color, amt, rise}, bats: {n, at: [x, y], r: [rx, ry], d, size, color}}
   A shot may add video: 'clip.mp4' (that picture brought to life, flat); only the shots on screen load and play.
   d.live(true) keeps redrawing while a scroll-scrubbed reader rests (it does so by itself when a picture has depth).
*/
(() => {
  const VERT = `#version 300 es
in vec2 aP; out vec2 vUv; void main(){ vUv = aP * .5 + .5; gl_Position = vec4(aP, 0., 1.); }`;
  const FRAG = `#version 300 es
precision highp float;
uniform sampler2D tA, tB, dA, dB, gA, gB;
uniform vec4 uA, uB; uniform vec3 cA, cB; uniform float hA, hB;
uniform float uMix, uBlurA, uBlurB, uFlare, uPush, uHasB, uBokeh, uT, uFx;
uniform vec2 uRes; uniform vec3 uTint;
uniform int uFogN; uniform vec4 uFog[3], uFogC[3]; uniform vec2 uFogW[3];
uniform vec2 uFlick; uniform vec3 uRays; uniform vec4 uDust; uniform float uRise;
uniform vec4 uBat, uBatR; uniform vec3 uBatC;
in vec2 vUv; out vec4 o;
const float IMG = 1.5;
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float h2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
// c: the picture centred, one unit tall; pictures sit in their textures upside down (flipped on upload)
vec2 tc(vec2 c){ vec2 p = clamp(c / vec2(IMG, 1.) + .5, .001, .999); return vec2(p.x, 1. - p.y); }
vec2 viewC(vec4 v, vec2 uv){ return (vec2(v.x + (uv.x - .5) * v.z, v.y - (uv.y - .5) * v.w) - .5) * vec2(IMG, 1.); }
// where this pixel's line of sight crosses nearness w (1: the nearest thing, 0: infinitely far), the camera moved by cam
vec2 rayAt(vec2 C, vec3 cam, float w){ return C * (1. - cam.z * w) + cam.xy * w; }
// march the line of sight from near to far to the first surface; past an occlusion edge, carry on through what is behind
void march(sampler2D dep, vec2 C, vec3 cam, out vec2 hc, out float hw, out bool behind){
  const int N = 40; float dw = 1. / float(N);
  hc = C; hw = 0.; behind = false;
  float wPrev = 1., dPrev = textureLod(dep, tc(rayAt(C, cam, 1.)), 0.).r - 1.;
  if (dPrev >= 0.) { hc = rayAt(C, cam, 1.); hw = 1.; return; }
  for (int i = 1; i <= N; i++) {
    float w = 1. - dw * float(i);
    vec4 s = textureLod(dep, tc(rayAt(C, cam, w)), 0.);
    float d = (behind ? s.g : s.r) - w;
    if (d > 4. * dw && !behind) { behind = true; d = s.g - w; }
    if (d >= 0.) {
      float wh = mix(wPrev, w, dPrev / (dPrev - d + 1e-6));
      for (int j = 0; j < 2; j++) {
        vec4 q = textureLod(dep, tc(rayAt(C, cam, wh)), 0.);
        float dh = (behind ? q.g : q.r) - wh;
        if (dh >= 0.) { w = wh; d = dh; } else { wPrev = wh; dPrev = dh; }
        wh = mix(wPrev, w, dPrev / (dPrev - d + 1e-6));
      }
      hc = rayAt(C, cam, wh); hw = wh; return;
    }
    wPrev = w; dPrev = d;
  }
}
vec3 see(sampler2D img, sampler2D dep, sampler2D bg, float has, vec4 v, vec3 cam, vec2 uv, float blur, out vec2 hc, out float hw){
  vec2 C = viewC(v, uv); hc = C; hw = 0.; bool behind = false;
  if (has > .5) march(dep, C, cam, hc, hw, behind);
  vec2 t = tc(hc);
  vec3 col = behind ? textureLod(bg, t, 0.).rgb : textureLod(img, t, 0.).rgb;
  // where the camera stretches a sliver of picture over many pixels (the side of an edge), show what is behind instead
  float st = min(length(dFdx(hc)), length(dFdy(hc))) / max(min(length(dFdx(C)), length(dFdy(C))), 1e-7);
  if (has > .5 && !behind) col = mix(textureLod(bg, t, 0.).rgb, col, smoothstep(.25, .6, st));
  if (blur > .0005) { vec3 b = col; for (int i = 1; i < 9; i++) { float a = float(i) * 2.39996, r = blur * sqrt(float(i) / 8.); b += textureLod(img, t + vec2(cos(a), sin(a) * uRes.x / uRes.y) * r, 0.).rgb; } col = b / 9.; }
  return col;
}
float bat(vec2 p, float flap, float aa){
  p.x = abs(p.x);
  if (p.x > 1.1 || abs(p.y) > 1.1) return 0.;
  float body = 1. - smoothstep(-aa, aa, length(p / vec2(.12, .28)) - 1.);
  float head = 1. - smoothstep(-aa, aa, length((p - vec2(0., .27)) / vec2(.1)) - 1.);
  float ear = 1. - smoothstep(-aa, aa, length((p - vec2(.06, .39)) / vec2(.035, .08)) - 1.);
  float k = clamp((p.x - .05) / .95, 0., 1.);
  float top = .1 + (mix(-.55, .6, flap) - .1) * k + .25 * sin(k * 3.1416) * (1. - .6 * flap);
  float bot = top - mix(.52, .06, k) * (.5 + .5 * abs(sin(k * 7.85)));
  float wing = (1. - smoothstep(-aa, aa, p.y - top)) * (1. - smoothstep(-aa, aa, bot - p.y)) * (1. - smoothstep(1., 1.06, p.x));
  return max(max(body, head), max(ear, wing));
}
// the current picture's life: its own lights flicker and glow, fog drifts at its depths, dust floats, rays breathe, bats fly
vec3 effects(vec3 col, vec2 C, vec3 cam, vec2 hc, float hw){
  vec2 t = tc(hc);
  float warm = smoothstep(.1, .3, col.r - col.b) * smoothstep(.5, .85, max(col.r, col.g));
  float n = noise(t * 11. + vec2(uT * 2.7, -uT * 1.9)) * .65 + noise(t * 31. + uT * 6.3) * .35 - .5;
  col *= 1. + uFlick.x * warm * n * 2. * uFx;
  vec3 bl = textureLod(tA, t, 4.5).rgb * .6 + textureLod(tA, t, 6.).rgb * .4;
  col += bl * smoothstep(.08, .25, bl.r - bl.b) * smoothstep(.3, .6, max(bl.r, bl.g)) * uFlick.y * (1. + 1.2 * n) * uFx;
  for (int i = 0; i < 3; i++) {
    if (i >= uFogN) break;
    float wf = uFog[i].x;
    vec2 cf = rayAt(C, cam, wf), uvf = cf / vec2(IMG, 1.) + .5;
    float band = smoothstep(uFog[i].y, uFog[i].y + .1, uvf.y) * (1. - smoothstep(uFog[i].z - .1, uFog[i].z, uvf.y));
    vec2 p = cf * uFogC[i].a + uFogW[i] * uT;
    float f = fbm(p + .6 * vec2(fbm(p * .6 + vec2(0., uT * .05)), fbm(p * .6 + vec2(5.2, -uT * .04))));
    f = smoothstep(.42, .8, f) * band * uFog[i].w * smoothstep(0., .03, wf - hw) * uFx;
    col = mix(col, uFogC[i].rgb * (.8 + .4 * f), f);
  }
  if (uDust.a > 0.) for (int L = 0; L < 3; L++) {
    float fl = float(L), wd = .2 + .25 * fl;
    vec2 g = rayAt(C, cam, wd) * (16. - 4. * fl) + vec2(sin(uT * .2 + fl) * .3, uT * uRise * (1. + .4 * fl));
    vec2 id = floor(g), fr = fract(g);
    float r1 = h2(id + fl * 7.1);
    vec2 pp = .25 + .5 * vec2(h2(id + 3.7), h2(id + 9.2)) + .1 * vec2(sin(uT * .8 + r1 * 6.28), cos(uT * .6 + r1 * 4.));
    float m = smoothstep(.07 + .03 * fl, 0., length(fr - pp)) * step(.6, r1) * (.5 + .5 * sin(uT * 2.3 + r1 * 40.));
    col += uDust.rgb * m * uDust.a * smoothstep(0., .03, wd - hw) * uFx;
  }
  if (uRays.z > 0.) {
    vec2 cl = (uRays.xy - .5) * vec2(IMG, 1.), st = (cl - C) / 24., cs = C;
    float acc = 0., wt = 1.;
    for (int i = 0; i < 24; i++) { cs += st; acc += smoothstep(.86, 1., dot(textureLod(tA, tc(cs), 2.).rgb, vec3(.3, .55, .15))) * wt; wt *= .96; }
    float ang = atan(C.y - cl.y, C.x - cl.x);
    vec3 rays = vec3(1., .94, .78) * acc / 24. * uRays.z * uFx * (.65 + .35 * sin(ang * 9. + uT * .35) * sin(ang * 5. - uT * .23));
    col = 1. - (1. - col) * (1. - clamp(rays, 0., 1.));
  }
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uBat.w) break;
    float fi = float(i), s = h2(vec2(fi, 7.3)), s2 = h2(vec2(fi, 1.9));
    float ph = uT * (.32 + .22 * s) + s * 6.283;
    vec2 bp = (uBat.xy - .5) * vec2(IMG, 1.) + vec2(cos(ph) * uBatR.x * (.55 + .45 * s2), sin(ph * 2.) * uBatR.y * (.5 + .5 * s));
    float wb = uBat.z * (.8 + .4 * s2), sz = uBatR.z * (.7 + .6 * s);
    vec2 lp = (rayAt(C, cam, wb) - bp) / sz; lp.y = -lp.y;
    float flap = .5 + .5 * sin(uT * (8. + 5. * s) + s * 30.);
    col = mix(col, uBatC, bat(lp, flap, 1.5 * uA.w / (uRes.y * sz)) * .95 * smoothstep(0., .02, wb - hw) * uFx);
  }
  return col;
}
void main(){
  vec2 uv = vUv, hcA; float hwA;
  vec3 col = see(tA, dA, gA, hA, uA, cA, uv, uBlurA, hcA, hwA);
  if (uFx > .001) col = effects(col, viewC(uA, uv), cA, hcA, hwA);
  if (uHasB > .5 && uMix > .001) {
    vec2 q = vec2(uB.x + (uv.x - .5) * uB.z, uB.y - (uv.y - .5) * uB.w);
    float inside = smoothstep(0., .16, min(q.x, 1. - q.x)) * smoothstep(0., .16, min(q.y, 1. - q.y));
    vec2 hcB; float hwB;
    col = mix(col, see(tB, dB, gB, hB, uB, cB, uv, uBlurB, hcB, hwB), clamp(uMix * inside, 0., 1.));
  }
  float asp = uRes.x / uRes.y;
  for (int i = 0; i < 12; i++) {
    float fi = float(i), ph = fract(hash(vec2(fi, 3.1)) + uPush * (.35 + hash(vec2(fi, 7.)) * .5));
    vec2 dir = normalize(vec2(hash(vec2(fi, 1.)) - .5, hash(vec2(fi, 2.)) - .5) + 1e-3);
    vec2 c = .5 + dir * (.05 + ph * .9) * vec2(1., asp);
    float r = (.012 + ph * .06) * (.6 + hash(vec2(fi, 5.)));
    float d = length((uv - c) * vec2(asp, 1.));
    col += uTint * smoothstep(r, r * .82, d) * (1. - ph) * ph * .32 * uBokeh;
  }
  float ds = length((uv - vec2(.5, .55)) * vec2(asp, 1.));
  col += uTint * (exp(-ds * 5.) * .45 + exp(-ds * 22.) * .6) * uFlare;
  col *= 1. - .35 * pow(length(uv - .5) * 1.25, 2.4);
  col += (hash(uv * uRes + fract(uPush * 13.)) - .5) * .035;
  o = vec4(col, 1.);
}`;
  const IMG = 1.5, cache = new Map();
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = x => {x = clamp(x); return x * x * (3 - 2 * x);};
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const load = src => {let img = cache.get(src); if (!img) {img = new Image(); img.decoding = 'async'; img.src = src; cache.set(src, img);} return img;};

  window.mkDive = function mkDive(canvas, opts = {}) {
    const gl = canvas.getContext('webgl2', {antialias: false, alpha: false, preserveDrawingBuffer: false});
    if (!gl) return null;
    const sh = (type, src) => {const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s;};
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog); gl.useProgram(prog);
    gl.bindVertexArray(gl.createVertexArray());
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aP'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n), u = {};
    for (const n of ['uA', 'uB', 'cA', 'cB', 'hA', 'hB', 'uMix', 'uBlurA', 'uBlurB', 'uFlare', 'uPush', 'uHasB', 'uRes', 'uTint', 'uBokeh', 'uT', 'uFx', 'uFogN', 'uFog', 'uFogC', 'uFogW', 'uFlick', 'uRays', 'uDust', 'uRise', 'uBat', 'uBatR', 'uBatC']) u[n] = U(n);
    ['tA', 'tB', 'dA', 'dB', 'gA', 'gB'].forEach((n, i) => gl.uniform1i(U(n), i));
    const tint = hex(opts.tint || '#ffb000'), DOLLY = opts.depth ?? .16;
    gl.uniform3f(u.uTint, ...tint); gl.uniform1f(u.uBokeh, opts.bokeh ?? 1);
    const blank = (rgba = [6, 8, 8, 255]) => {const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba)); return t;};
    const black = blank(), flat = blank([0, 0, 0, 255]);
    const params = mips => {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    const upload = (img, {mips = false, raw = false} = {}) => {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, raw ? gl.NONE : gl.BROWSER_DEFAULT_WEBGL);   // a depth map's bytes must arrive untouched
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      if (mips) gl.generateMipmap(gl.TEXTURE_2D);
      params(mips);
      return t;
    };
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textures = new Map(), clips = new Map();
    // a picture: its colour, and if they exist, its depth map and the layer behind its edges
    function tex(src) {
      if (textures.has(src)) return textures.get(src);
      const t = {gl: black, ok: false, dep: flat, bg: black, depth: false};
      textures.set(src, t);
      const base = src.replace(/\.(webp|jpe?g|png)(\?.*)?$/i, '');
      const when = (img, fn) => {if (img.complete && img.naturalWidth) fn(); else {img.addEventListener('load', fn, {once: true}); img.addEventListener('error', () => {}, {once: true});}};
      const img = load(src), dep = load(base + '.d.webp'), bg = load(base + '.bg.webp');
      when(img, () => {t.gl = upload(img, {mips: true}); t.ok = true; draw();});
      let parts = 0;
      const both = () => {if (++parts === 2) {t.dep = upload(dep, {raw: true}); t.bg = upload(bg); t.depth = true; wake(); draw();}};
      when(dep, both); when(bg, both);
      return t;
    }
    // a shot's clip: a muted looping video whose current frame is uploaded each draw (shown flat)
    function clip(shot) {
      if (!shot?.video || quiet) return null;
      let c = clips.get(shot.video);
      if (!c) {
        const v = document.createElement('video');
        Object.assign(v, {muted: true, loop: true, playsInline: true, preload: 'auto', src: shot.video});
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        c = {v, gl: blank(), ready: false};
        clips.set(shot.video, c);
      }
      if (c.v.paused) c.v.play().catch(() => {});
      if (c.v.readyState >= 2) {gl.bindTexture(gl.TEXTURE_2D, c.gl); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.BROWSER_DEFAULT_WEBGL); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c.v); params(false); c.ready = true;}
      return c.ready ? c : null;
    }
    // the effects of the shot in front (its own, or the dive's)
    let fxFor = null;
    function setFx(fx) {
      if (fx === fxFor) return; fxFor = fx;
      const f = fx || {}, fog = f.fog || [], b = f.bats || {}, x3 = [0, 1, 2];
      gl.uniform1i(u.uFogN, fog.length);
      gl.uniform4fv(u.uFog, x3.flatMap(i => fog[i] ? [fog[i].d, ...fog[i].y, fog[i].a] : [0, 0, 0, 0]));
      gl.uniform4fv(u.uFogC, x3.flatMap(i => fog[i] ? [...hex(fog[i].color), fog[i].scale] : [0, 0, 0, 1]));
      gl.uniform2fv(u.uFogW, x3.flatMap(i => fog[i] ? fog[i].wind : [0, 0]));
      gl.uniform2f(u.uFlick, f.flicker?.amt ?? 0, f.flicker?.glow ?? 0);
      gl.uniform3f(u.uRays, ...(f.rays?.at ?? [0, 0]), f.rays?.amt ?? 0);
      gl.uniform4f(u.uDust, ...hex(f.dust?.color ?? '#ffffff'), f.dust?.amt ?? 0); gl.uniform1f(u.uRise, f.dust?.rise ?? 0);
      gl.uniform4f(u.uBat, ...(b.at ?? [0, 0]), b.d ?? 0, b.n ?? 0); gl.uniform4f(u.uBatR, ...(b.r ?? [0, 0]), b.size ?? 0, 0);
      gl.uniform3f(u.uBatC, ...hex(b.color ?? '#000000'));
    }
    let shots = [], p = 0, at = 0, playT0 = 0, playing = null, raf = 0, forced = false, visible = true, lastNow = 0;
    const lean = [0, 0], want = [0, 0];
    function size() {
      const coarse = matchMedia('(pointer: coarse)').matches;
      const dpr = Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.5), w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);}
      gl.uniform2f(u.uRes, w, h);
      const A = w / h;
      return A > IMG ? [1, IMG / A] : [A / IMG, 1];
    }
    function bind(unit, t) {gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);}
    function draw(now = performance.now()) {
      if (!shots.length) return;
      const dt = Math.min(.1, (now - (lastNow || now)) / 1000); lastNow = now;
      // the hand-offs share the first part of the way; the last picture keeps the rest for a slow push
      const S = size(), last = shots.length - 1, END = last ? .86 : 0;
      const pos = last ? clamp(p / END) * last : 0;
      const s = Math.min(last, Math.floor(pos)), uu = s === last ? clamp((p - END) / (1 - END)) * .5 : pos - s;
      at = pos;
      const shot = shots[s], next = shots[s + 1], m = Math.pow(shot.z || 1.4, uu), e = smooth(uu);
      const w = S[0] / m, h = S[1] / m, keep = (c, half) => Math.min(1 - half, Math.max(half, c));
      const cx = keep(.5 + (shot.f[0] - .5) * e, w / 2), cy = keep(.5 + (shot.f[1] - .5) * e, h / 2);
      // the camera: it travels toward the focal point as it zooms; the pointer leans it; at rest it breathes
      const t = now / 1000, k = 1 - Math.exp(-dt * 3);
      lean[0] += (want[0] - lean[0]) * k; lean[1] += (want[1] - lean[1]) * k;
      const lx = quiet ? 0 : lean[0] * .022 + Math.sin(t * .21) * .006, ly = quiet ? 0 : lean[1] * .016 + Math.sin(t * .17 + 1) * .004;
      const lam = DOLLY * e, fx = (shot.f[0] - .5) * IMG, fy = shot.f[1] - .5;
      gl.uniform3f(u.cA, lam * fx + lx, lam * fy + ly, lam);
      gl.uniform3f(u.cB, lx, ly, 0);
      gl.uniform1f(u.uT, quiet ? 0 : t);
      // the clips of the shots on screen play; the rest rest
      const using = new Set([shot.video, next?.video]);
      for (const [key, c] of clips) if (!using.has(key) && !c.v.paused) c.v.pause();
      const cA = clip(shot), A = tex(shot.src);
      bind(0, cA ? cA.gl : A.gl); bind(2, A.dep); bind(4, A.bg);
      gl.uniform1f(u.hA, !cA && A.depth ? 1 : 0);
      gl.uniform4f(u.uA, cx, cy, w, h);
      const fxs = shot.fx ?? opts.fx;
      setFx(fxs);
      gl.uniform1f(u.uFx, fxs && !cA ? smooth(uu / .12) : 0);   // the effects come in as the shot begins
      const mix = next ? smooth((uu - .42) / .5) : 0;
      if (next) {
        const cB = mix > 0 ? clip(next) : null, B = tex(next.src);
        bind(1, cB ? cB.gl : B.gl); bind(3, B.dep); bind(5, B.bg);
        gl.uniform1f(u.hB, !cB && B.depth ? 1 : 0);
        gl.uniform4f(u.uB, (cx - shot.f[0]) * shot.z + .5, (cy - shot.f[1]) * shot.z + .5, w * shot.z, h * shot.z);
        gl.uniform1f(u.uHasB, B.ok ? 1 : 0); tex(shots[s + 2]?.src || next.src);
      } else gl.uniform1f(u.uHasB, 0);
      gl.uniform1f(u.uMix, mix); gl.uniform1f(u.uBlurA, .0045 * mix); gl.uniform1f(u.uBlurB, mix > 0 ? .004 * (1 - mix) : 0);
      gl.uniform1f(u.uFlare, next ? Math.sin(Math.PI * clamp((uu - .45) / .5)) * .9 : 0); gl.uniform1f(u.uPush, pos * .5 + now / 50000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    // one loop: it runs while a play() is going, and while a picture with depth (or a forced live()) is on screen
    const alive = () => forced || (!quiet && shots.some(sh => textures.get(sh.src)?.depth || sh.fx || opts.fx));
    function loop(now) {
      raf = 0;
      if (playing) {p = playing.still ? 1 : clamp((now - playT0) / 1000 / playing.seconds); playing.onTick?.(p); if (p >= 1) {const done = playing.onDone; playing = null; done?.();}}
      draw(now);
      if (playing || (alive() && visible && !document.hidden)) raf = requestAnimationFrame(loop);
    }
    const wake = () => {if (!raf) raf = requestAnimationFrame(loop);};
    new IntersectionObserver(es => {visible = es[0].isIntersecting; if (visible) wake();}).observe(canvas);
    document.addEventListener('visibilitychange', wake);
    addEventListener('pointermove', ev => {
      const r = canvas.getBoundingClientRect(); if (!r.width) return;
      want[0] = clamp(((ev.clientX - r.left) / r.width) * 2 - 1, -1, 1); want[1] = clamp(((ev.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    }, {passive: true});
    const api = {
      set(list) {shots = list; list.forEach(s => tex(s.src)); p = 0; draw(); wake(); return api;},
      seek(v) {p = v; draw(); wake(); return api;},
      play(list, {seconds = 9, onDone, onTick} = {}) {
        api.set(list);
        playing = {seconds, onDone, onTick, still: quiet}; playT0 = performance.now();
        wake();
        return api;
      },
      stop() {playing = null; for (const c of clips.values()) c.v.pause();},
      live(on) {forced = !!on; if (on) wake(); else for (const c of clips.values()) c.v.pause(); return api;},
      get progress() {return p;},
      get pos() {return at;},   // which picture the camera is in (2.5 = halfway from the third to the fourth)
    };
    addEventListener('resize', () => draw(), {passive: true});
    return api;
  };
})();
