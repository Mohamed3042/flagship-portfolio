/* Dive: a continuous camera move through a set of pictures, for the edition cutscenes.
   Each shot zooms into its focal point while the view glides there; the next picture grows out of
   exactly that region as a soft-edged inset until it fills the frame, so nothing ever cuts. Depth of
   field, a flare at every hand-off and bokeh past the lens carry it (the World's Growth scene does
   the same inside the 3D engine).
   const d = mkDive(canvas, {tint: '#ffb000', bokeh: 1});   // bokeh: how much lens dust drifts past (0 to 1)
   d.play([{src, f: [x, y], z}, ...], {seconds: 9, onDone});   // or d.seek(p) for scroll-driven use
   A shot may add video: 'clip.mp4' (that picture brought to life); the still shows until the clip plays,
   and only the shots on screen load and play. d.live(true) keeps redrawing while the reader rests.
*/
(() => {
  const VERT = 'attribute vec2 aP; varying vec2 vUv; void main(){ vUv = aP * .5 + .5; gl_Position = vec4(aP, 0., 1.); }';
  const FRAG = `
    precision highp float;
    uniform sampler2D tA, tB; uniform vec4 uA, uB; uniform float uMix, uBlurA, uBlurB, uFlare, uPush, uHasB; uniform vec2 uRes; uniform vec3 uTint; uniform float uBokeh;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
    vec3 look(sampler2D t, vec4 v, vec2 uv, float blur){
      vec2 p = vec2(v.x + (uv.x - .5) * v.z, 1. - (v.y - (uv.y - .5) * v.w));   // picture y runs down, the texture y runs up
      vec3 c = texture2D(t, p).rgb;
      if (blur > .0005) { for (int i = 1; i < 9; i++) { float a = float(i) * 2.39996, r = blur * sqrt(float(i) / 8.); c += texture2D(t, p + vec2(cos(a), sin(a) * uRes.x / uRes.y) * r).rgb; } c /= 9.; }
      return c;
    }
    void main(){
      vec2 uv = vUv;
      vec3 col = look(tA, uA, uv, uBlurA);
      if (uHasB > .5) {
        vec2 q = vec2(uB.x + (uv.x - .5) * uB.z, uB.y - (uv.y - .5) * uB.w);
        float inside = smoothstep(0., .16, min(q.x, 1. - q.x)) * smoothstep(0., .16, min(q.y, 1. - q.y));
        col = mix(col, look(tB, uB, uv, uBlurB), clamp(uMix * inside, 0., 1.));
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
      gl_FragColor = vec4(col, 1.);
    }`;
  const IMG = 1.5, cache = new Map();
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = x => {x = clamp(x); return x * x * (3 - 2 * x);};

  window.mkDive = function mkDive(canvas, opts = {}) {
    const gl = canvas.getContext('webgl', {antialias: false, alpha: false, preserveDrawingBuffer: false});
    if (!gl) return null;
    const sh = (type, src) => {const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s;};
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aP'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    const u = {tA: U('tA'), tB: U('tB'), uA: U('uA'), uB: U('uB'), uMix: U('uMix'), uBlurA: U('uBlurA'), uBlurB: U('uBlurB'), uFlare: U('uFlare'), uPush: U('uPush'), uHasB: U('uHasB'), uRes: U('uRes'), uTint: U('uTint'), uBokeh: U('uBokeh')};
    const tint = (opts.tint || '#ffb000').match(/[0-9a-f]{2}/gi).map(h => parseInt(h, 16) / 255);
    gl.uniform3f(u.uTint, tint[0], tint[1], tint[2]); gl.uniform1f(u.uBokeh, opts.bokeh ?? 1); gl.uniform1i(u.tA, 0); gl.uniform1i(u.tB, 1);
    const blank = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, blank); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([6, 8, 8, 255]));
    const textures = new Map(), clips = new Map();
    const setup = () => {gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);};
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // a shot's clip: a muted looping video whose current frame is uploaded each draw
    function clip(shot) {
      if (!shot?.video || quiet) return null;
      let c = clips.get(shot.video);
      if (!c) {
        const v = document.createElement('video');
        Object.assign(v, {muted: true, loop: true, playsInline: true, preload: 'auto', src: shot.video});
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        const g = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, g); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([6, 8, 8, 255])); setup();
        c = {v, gl: g, ready: false};
        clips.set(shot.video, c);
      }
      if (c.v.paused) c.v.play().catch(() => {});
      if (c.v.readyState >= 2) {gl.bindTexture(gl.TEXTURE_2D, c.gl); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c.v); c.ready = true;}
      return c.ready ? c : null;
    }
    function tex(src) {
      if (textures.has(src)) return textures.get(src);
      const t = {gl: blank, ok: false};
      textures.set(src, t);
      let img = cache.get(src);
      if (!img) {img = new Image(); img.decoding = 'async'; img.src = src; cache.set(src, img);}
      const up = () => {const g = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, g); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        t.gl = g; t.ok = true; draw();};
      if (img.complete && img.naturalWidth) up(); else img.addEventListener('load', up, {once: true});
      return t;
    }
    let shots = [], p = 0, raf = 0, at = 0, liveRaf = 0;
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5), w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);}
      gl.uniform2f(u.uRes, w, h);
      const A = w / h;
      return A > IMG ? [1, IMG / A] : [A / IMG, 1];
    }
    function draw() {
      if (!shots.length) return;
      // the hand-offs share the first part of the way; the last picture keeps the rest for a slow push
      const S = size(), last = shots.length - 1, END = last ? .86 : 0;
      const pos = last ? clamp(p / END) * last : 0;
      const s = Math.min(last, Math.floor(pos)), uu = s === last ? clamp((p - END) / (1 - END)) * .5 : pos - s;
      at = pos;
      const shot = shots[s], next = shots[s + 1], m = Math.pow(shot.z || 1.4, uu), e = smooth(uu);
      const w = S[0] / m, h = S[1] / m, keep = (c, half) => Math.min(1 - half, Math.max(half, c));
      const cx = keep(.5 + (shot.f[0] - .5) * e, w / 2), cy = keep(.5 + (shot.f[1] - .5) * e, h / 2);
      // the clips of the shots on screen play; the rest rest
      const using = new Set([shot.video, next?.video]);
      for (const [k, c] of clips) if (!using.has(k) && !c.v.paused) c.v.pause();
      gl.activeTexture(gl.TEXTURE0);
      const cA = clip(shot), A = tex(shot.src);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, cA ? cA.gl : A.gl);
      gl.uniform4f(u.uA, cx, cy, w, h);
      const mix = next ? smooth((uu - .42) / .5) : 0;
      if (next) {
        gl.activeTexture(gl.TEXTURE1);
        const cB = mix > 0 ? clip(next) : null, B = tex(next.src);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, cB ? cB.gl : B.gl);
        gl.uniform4f(u.uB, (cx - shot.f[0]) * shot.z + .5, (cy - shot.f[1]) * shot.z + .5, w * shot.z, h * shot.z);
        gl.uniform1f(u.uHasB, B.ok ? 1 : 0); tex(shots[s + 2]?.src || next.src);
      } else gl.uniform1f(u.uHasB, 0);
      gl.uniform1f(u.uMix, mix); gl.uniform1f(u.uBlurA, .0045 * mix); gl.uniform1f(u.uBlurB, mix > 0 ? .004 * (1 - mix) : 0);
      gl.uniform1f(u.uFlare, next ? Math.sin(Math.PI * clamp((uu - .45) / .5)) * .9 : 0); gl.uniform1f(u.uPush, pos * .5 + performance.now() / 50000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const api = {
      set(list) {shots = list; list.forEach(s => tex(s.src)); p = 0; draw(); return api;},
      seek(v) {p = v; draw(); return api;},
      play(list, {seconds = 9, onDone, onTick} = {}) {
        cancelAnimationFrame(raf); api.set(list);
        const t0 = performance.now(), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const step = now => {
          p = still ? 1 : clamp((now - t0) / 1000 / seconds); draw(); onTick?.(p);
          if (p < 1) raf = requestAnimationFrame(step); else onDone?.();
        };
        raf = requestAnimationFrame(step);
        return api;
      },
      stop() {cancelAnimationFrame(raf); for (const c of clips.values()) c.v.pause();},
      live(on) {   // keep redrawing (clips move) while a scroll-scrubbed page is in view
        cancelAnimationFrame(liveRaf); liveRaf = 0;
        if (on) {const loop = () => {draw(); liveRaf = requestAnimationFrame(loop);}; liveRaf = requestAnimationFrame(loop);}
        else for (const c of clips.values()) c.v.pause();
        return api;
      },
      get progress() {return p;},
      get pos() {return at;},   // which picture the camera is in (2.5 = halfway from the third to the fourth)
    };
    addEventListener('resize', () => draw(), {passive: true});
    return api;
  };
})();
