import{u as T,I as F,S as L,q as V,aD as z,y as $,aM as K,H as E,s as y,i as k,M as B,a as I,C as j,a6 as q,x as H,al as Y,a9 as A,aE as X,aT as O,a5 as G,ac as Z,ad as Q,ay as J}from"./EditionWorld.astro_astro_type_script_index_0_lang.B6El-kZd.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ee=`
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float h13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
vec3 S(vec3 c){ return pow(c, vec3(2.2)); }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
float sdRBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
float bayer(vec2 p){ p = floor(mod(p, 4.)); return (mod(p.x * 4. + p.y * 8. + mod(p.x * p.y, 2.) * 3., 16.) + .5) / 16.; }
`,te=`
vec3 invNeutral(vec3 o){
  const float S0 = .76, D = .24;
  // the forward map pulls bright colours toward white: a saturated colour above ~.8 has no preimage, so it is scaled down
  // (hue kept) to what the map can give back, while neutrals (whites) keep their full range
  float P0 = max(o.r, max(o.g, o.b)), sat = (P0 - min(o.r, min(o.g, o.b))) / max(P0, 1e-4);
  o *= min(1., mix(.996, .82, smoothstep(.12, .55, sat)) / max(P0, 1e-4));
  float P = max(o.r, max(o.g, o.b));
  vec3 c = o;
  if (P >= S0) {
    P = min(P, .996);
    float peak = D * D / (1. - P) - D + S0, g = 1. - 1. / (.15 * (peak - P) + 1.);
    c = (o - P * g) / max(1. - g, 1e-4) * peak / P;
  }
  float m = min(c.r, min(c.g, c.b)), x = m < .04 ? sqrt(max(m, 0.) / 6.25) : m + .04;
  return c + (x - m);
}`,D=(e,t)=>{const s=t.length,o=t.map(([c,a])=>`vec2(${c.toFixed(3)},${a.toFixed(3)})`).join(",");return`const vec2 ${e}[${s}] = vec2[${s}](${o});
float sd_${e}(vec2 p){
  float d = dot(p - ${e}[0], p - ${e}[0]), s = 1.;
  for (int i = 0, j = ${s-1}; i < ${s}; j = i, i++){
    vec2 e = ${e}[j] - ${e}[i], w = p - ${e}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${e}[i].y, p.y < ${e}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`},oe=`${D("MKM",T[0])}
${D("MKK",T[1])}
float sdMK(vec2 p){ p += vec2(1.935, 1.); return min(sd_MKM(p), sd_MKK(p)); }
float sdMKM(vec2 p){ p += vec2(1.935, 1.); return sd_MKM(p); }
float sdMKK(vec2 p){ p += vec2(1.935, 1.); return sd_MKK(p); }`,ae={A:`
uniform sampler2D tGlyph; uniform vec2 uGlyphGrid; uniform float uRain;
float glyphD(float g, vec2 c){
  if (c.x < 0. || c.x > 1. || c.y < 0. || c.y > 1.) return 0.;
  vec2 cell = vec2(mod(g, uGlyphGrid.x), floor(g / uGlyphGrid.x));
  return texture2D(tGlyph, (cell + c) / uGlyphGrid).r;
}
vec3 pivotA(vec2 uv){
  float asp = uAsp, px = fwidth(uv.y);
  vec3 col = S(vec3(.010, .006, .003)) + S(vec3(.5, .22, .04)) * .06 * exp(-length((uv - vec2(.5, 0.)) * vec2(asp * .6, 1.)) * 1.6);
  vec2 p = vec2(uv.x * asp, 1. - uv.y);
  for (int L = 0; L < 3; L++){
    float fl = float(L), k = fl / 2.;
    float rows = floor(mix(52., 22., k)), h = 1. / rows, w = h * .58, s = h * 1.12;
    float colId = floor(p.x / w);
    float alive = step(mix(.34, .5, k), h12(vec2(colId, 31. + fl * 7.)));
    float speed = mix(.045, .16, h12(vec2(colId, 5.1 + fl))) * mix(.6, 1.2, k);
    float len = mix(.3, .8, h12(vec2(colId, 9.7 + fl)));
    float head = fract(h12(vec2(colId, 2.2 + fl)) + uTime * speed) * (1. + len);
    float ry = floor(p.y / h), yc = (ry + .5) * h, d = head - yc;
    float tail = (d > 0. && d < len) ? pow(1. - d / len, 1.7) : 0.;
    float isHead = smoothstep(h * 1.1, h * .3, abs(d));
    float rate = mix(.5, 3., h12(vec2(colId, ry)));
    float g = floor(h12(vec2(colId, ry) + floor(uTime * rate + h12(vec2(ry, colId)) * 9.) * 7.13) * uRain);
    vec2 lc = vec2(p.x - (colId + .5) * w, -(p.y - yc));
    float dd = glyphD(g, lc / s + .5), aa = 4. * px / s * .8;
    float gl = smoothstep(.5 - aa, .5 + aa, dd);
    float halo = pow(clamp(dd * 2., 0., 1.), 3.) * (1. - gl);
    float lvl = mix(.34, 1., k) * alive;
    vec3 ink = mix(S(vec3(.9, .38, .04)), S(vec3(1., .72, .26)), tail);
    ink = mix(ink, S(vec3(1., .95, .82)), isHead);
    float b = max(tail, isHead * 1.1);
    col += ink * (gl * b * 1.15 + halo * b * .45) * lvl;
    col += S(vec3(1., .5, .1)) * lvl * tail * exp(-pow(lc.x / (w * 1.1), 2.)) * .055;
    col += S(vec3(1., .7, .3)) * lvl * exp(-d * d / (h * h * 9.)) * exp(-pow(lc.x / (w * 1.3), 2.)) * .12 * step(0., d);
  }
  return col;
}`,B:`
vec3 pivotB(vec2 uv){
  float asp = uAsp, px = fwidth(uv.y);
  vec2 p = (uv - .5) * vec2(asp, 1.);
  float hw = min(.4, .43 * asp), hh = hw / 1.6;
  vec2 c = vec2(0., .045);
  float bz = .010;
  float dOut = sdRBox(p - c, vec2(hw + bz, hh + bz), .02), dIn = sdRBox(p - c, vec2(hw, hh), .012);
  float deskY = c.y - hh - bz - .018;
  vec3 col = mix(S(vec3(.010, .014, .030)), S(vec3(.016, .022, .048)), smoothstep(.6, -.5, p.y));
  // the room: a faint desk plane under the monitor, its far edge a hairline of light
  float desk = smoothstep(deskY + px * 2., deskY - px * 2., p.y);
  col = mix(col, S(vec3(.022, .028, .05)), desk * .9);
  col += S(vec3(.5, .62, .95)) * exp(-abs(p.y - deskY) / (px * 1.6)) * .10 * smoothstep(-.9, .0, -abs(p.x) * .9 + .4);
  // light the screen throws: round it, and down onto the desk
  float halo = exp(-max(dOut, 0.) * 13.) * .55 + exp(-max(dOut, 0.) * 3.5) * .16;
  col += S(vec3(.5, .66, 1.)) * halo * (1. - desk * .4);
  float dm = sdRBox(vec2(p.x, 2. * deskY - p.y) - c, vec2(hw + bz, hh + bz), .02);
  col += S(vec3(.5, .66, 1.)) * (exp(-max(dm, 0.) * 11.) * .22 + exp(-max(dm, 0.) * 3.) * .06) * desk * exp((p.y - deskY) * 6.);
  // the bezel: dark glass-black metal, a lit hairline along its top
  float bezel = smoothstep(px * 1.5, -px * 1.5, dOut) * (1. - smoothstep(px * 1.5, -px * 1.5, dIn));
  vec3 bz3 = S(vec3(.035, .04, .055)) + S(vec3(.5, .56, .7)) * .5 * smoothstep(.0, -hh * .08, (p.y - c.y) - (hh + bz * .5)) * smoothstep(-px * 3., 0., (p.y - c.y) - (hh - bz));
  col = mix(col, bz3, bezel);
  // the screen: bright, cool white, a little brighter at the top, a soft falloff to its corners
  float scr = smoothstep(px * 1.2, -px * 1.2, dIn);
  vec2 q = (p - c) / vec2(hw, hh);
  vec3 sc = mix(S(vec3(.80, .86, 1.)), S(vec3(.93, .96, 1.)), smoothstep(-1., 1., q.y));
  sc *= 1. - .22 * smoothstep(.55, 1.6, length(q));
  col = mix(col, sc * 1.02, scr);
  return col;
}`,C:`
uniform sampler2D tVid; uniform float uVidAsp, uVidRaw;
vec3 pivotC(vec2 uv){
  vec2 s = uAsp > uVidAsp ? vec2(1., uVidAsp / uAsp) : vec2(uAsp / uVidAsp, 1.);
  vec3 c = texture2D(tVid, (uv - .5) * s + .5).rgb;
  return mix(c, S(c), uVidRaw);   // three uploads a video as plain 8-bit (no hardware sRGB decode): uVidRaw = 1 while the sampler is the video
}`,D:`
vec3 pivotD(vec2 uv){
  float asp = uAsp, px = fwidth(uv.y);
  vec2 p = vec2(uv.x * asp, uv.y);
  vec3 col = S(vec3(.005, .003, .013)) + S(vec3(.16, .06, .38)) * .55 * exp(-length((uv - vec2(.5, .32)) * vec2(asp, 1.)) * 1.7);
  for (int L = 0; L < 2; L++){
    float fl = float(L), rows = mix(36., 15., fl);
    vec2 g = p * rows, id0 = floor(g);
    for (int i = -1; i <= 1; i++) for (int k = -1; k <= 1; k++){
      vec2 id = id0 + vec2(float(i), float(k));
      vec2 j = (h22(id + fl * 19.) - .5) * mix(.62, .46, fl);
      float d = length(g - id - .5 - j) / rows;
      float r = mix(.0015, .0034, fl) * (.7 + .6 * h12(id + 3. + fl));
      float tw = .72 + .28 * sin(uTime * (.5 + h12(id) * 1.7) + h12(id + 9.) * 6.28318);
      float core = smoothstep(r + px, r - px, d);
      float halo = exp(-d / (r * 4.5)) * .20;
      col += S(vec3(.62, .46, 1.)) * (core + halo) * mix(.42, 1., fl) * tw;
      col += S(vec3(.94, .9, 1.)) * core * .55 * fl * tw;
    }
  }
  return col;
}`,E:`
vec3 pivotE(vec2 uv){
  float asp = uAsp, px = fwidth(uv.y);
  vec2 p = vec2(uv.x * asp, uv.y);
  p += (vec2(fbm(p * 1.4 + 3.), fbm(p * 1.4 + 17.)) - .5) * .05;
  float s = .095, hh = s * .8660254;
  vec2 n0 = vec2(0., 1.), n1 = vec2(-.8660254, .5), n2 = vec2(.8660254, .5);
  vec2 t0 = vec2(1., 0.), t1 = vec2(.5, .8660254), t2 = vec2(.5, -.8660254);
  float c0 = dot(p, n0) / hh, c1 = dot(p, n1) / hh, c2 = dot(p, n2) / hh;
  float d0 = abs(fract(c0 + .5) - .5) * hh, d1 = abs(fract(c1 + .5) - .5) * hh, d2 = abs(fract(c2 + .5) - .5) * hh;
  float lw = px * .55;
  float e0 = smoothstep(lw + px, lw - px * .2, d0) * (.3 + .7 * h12(vec2(floor(c0 + .5), floor(dot(p, t0) / s) + 1.3)));
  float e1 = smoothstep(lw + px, lw - px * .2, d1) * (.3 + .7 * h12(vec2(floor(c1 + .5) + 7., floor(dot(p, t1) / s) + 5.1)));
  float e2 = smoothstep(lw + px, lw - px * .2, d2) * (.3 + .7 * h12(vec2(floor(c2 + .5) + 13., floor(dot(p, t2) / s) + 9.7)));
  float nd = max(max(d0, d1), d2), node = smoothstep(px * 2.6, px * .6, nd);
  float shim = .85 + .15 * sin(uTime * .5 + h12(floor(p / s)) * 6.28318);
  vec3 col = mix(S(vec3(.008, .010, .016)), S(vec3(.028, .032, .046)), smoothstep(1.2, 0., length((uv - vec2(.5, .62)) * vec2(asp, 1.))));
  col += S(vec3(.78, .83, .91)) * (e0 + e1 + e2) * .62 * shim;
  col += S(vec3(.95, .97, 1.)) * node * .9 * shim;
  col += S(vec3(.7, .78, .95)) * node * .12 * smoothstep(px * 14., 0., nd);
  return col;
}`,F:`
vec3 pivotF(vec2 uv){
  float asp = uAsp, px = fwidth(uv.y);
  vec2 p = (uv - vec2(.5, .5)) * vec2(asp, 1.);
  float y = p.y;
  vec3 sky = mix(S(vec3(.05, .16, .46)), S(vec3(.006, .022, .11)), smoothstep(0., .55, y));
  vec3 flo = mix(S(vec3(.03, .10, .30)), S(vec3(.003, .012, .06)), smoothstep(0., .5, -y));
  vec3 col = mix(flo, sky, smoothstep(-px * 1.2, px * 1.2, y));
  float gl = exp(-dot(p / vec2(.85, .5), p / vec2(.85, .5)) * 2.4);
  col += S(vec3(.80, .90, 1.)) * gl * .85;
  col += S(vec3(.8, .92, 1.)) * exp(-abs(y) / (px * 1.4)) * (.55 + .45 * exp(-p.x * p.x * 3.)) ;
  // the floor takes the glow in long soft reflections
  float rf = exp(-pow(p.x / (.35 + .8 * -y), 2.)) * smoothstep(0., -.45, y) * step(y, 0.);
  col += S(vec3(.5, .72, 1.)) * rf * .22 * (.8 + .2 * sin(y * 90. + uTime * 1.2));
  return col;
}`,G:`
vec3 pivotG(vec2 uv){
  vec2 p = (uv - .5) * vec2(uAsp, 1.);
  float r = length(p);
  vec3 col = mix(S(vec3(1., .965, .86)), S(vec3(1., .80, .42)), smoothstep(.08, .9, r));
  col += S(vec3(1., .97, .9)) * exp(-r * r * 3.2) * .3;
  col += S(vec3(1., .86, .5)) * (fbm(p * 2.2 + vec2(uTime * .03, 0.)) - .5) * .09;
  col *= mix(1., .6, smoothstep(.5, 1.2, r));
  return col;
}`},S={mono:'"JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace',sans:'"Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif'},W=()=>new URLSearchParams(location.search),N=W().get("mt"),re=e=>N!==null?Number(N):e,pe=e=>e.lang==="ar"?-1:1,se=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,x={x:0,y:0,t:-1};function de(e,t,s){if(x.t!==t){x.t=t;const o=e.pointer.inside&&!se;x.x=F(x.x,o?e.pointer.x:0,2.6,s),x.y=F(x.y,o?e.pointer.y:0,2.6,s)}return x}function fe(){const e=W().get("intro");let t=-1,s=-1,o=0;return(c,a)=>{const u=window.__machineIntro;return u!==void 0?Number(u):e!==null?Number(e):(s<0&&(s=c),t<0&&(o=a<.04?o+1:0,(o>=8||c-s>2.5)&&(t=c)),t<0?0:c-t)}}const me=()=>new Promise(e=>requestAnimationFrame(()=>e(0)));async function he(e){try{await Promise.race([Promise.all(e.map(t=>document.fonts.load(t))),new Promise(t=>setTimeout(t,2500))])}catch{}}const xe=[`500 40px ${S.mono}`,`700 40px ${S.mono}`,`700 40px ${S.ar}`,`600 40px ${S.sans}`],ge=(e,t,s,o)=>[t,s,o][e.quality];function we(e){return e=Math.sin(e*127.1+311.7)*43758.5453,e-Math.floor(e)}const ce="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",le=(e,t)=>`
uniform sampler2D tWorld; uniform vec2 uRes, uWorldRes, uCss; uniform float uTime, uKeep, uCa, uAsp, uPin, uPout;
varying vec2 vUv;
${ee}
${te}
${oe}
${[...new Set([e,t].filter(Boolean))].map(s=>ae[s]).join(`
`)}
vec3 pivotIn(vec2 uv){ return ${e?`pivot${e}(uv)`:"vec3(0.)"}; }
vec3 pivotOut(vec2 uv){ return ${t?`pivot${t}(uv)`:"vec3(0.)"}; }
// what the engine multiplies by next is undone (a breath of its vignette kept), then its tone map
vec3 finish(vec3 c){
  float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
  float post = .45 + .55 * vig;
  return invNeutral(max(c * mix(1., post, uKeep), 0.)) / post;
}
// the world, with the engine's colour parting (red out, blue in) sampled the other way round
vec3 samp(vec2 uv){ vec2 d = (uv - .5) * uCa; return vec3(texture2D(tWorld, uv - d).r, texture2D(tWorld, uv).g, texture2D(tWorld, uv + d).b); }
vec3 blurLod(vec2 uv, float lod){
  vec2 o = exp2(lod) / uWorldRes * .75;
  return (textureLod(tWorld, uv + o, lod).rgb + textureLod(tWorld, uv + vec2(-o.x, o.y), lod).rgb + textureLod(tWorld, uv + vec2(o.x, -o.y), lod).rgb + textureLod(tWorld, uv - o, lod).rgb) * .25;
}
// a soft glow from the target's own mips (the target is made with mips: true)
vec3 bloom(vec2 uv){ return blurLod(uv, 2.5) * .34 + blurLod(uv, 4.) * .3 + blurLod(uv, 5.5) * .22 + blurLod(uv, 7.) * .14; }
`,ie=`
void main(){
  vec2 uv = vUv;
  vec3 c = step(.999, max(uPin, uPout)) > .5 ? vec3(0.) : look(uv);
  if (uPin > .001) c = mix(c, pivotIn(uv), uPin);
  if (uPout > .001) c = mix(c, pivotOut(uv), uPout);
  gl_FragColor = vec4(finish(c), 1.);
}`,ne=typeof location<"u"&&new URLSearchParams(location.search).has("nopivot"),_=(()=>{const e=new H(new Uint8Array([0,0,0,255]),1,1);return e.needsUpdate=!0,e})();function ye(e,t){const s=new L,o=new V(2,2,{type:E,samples:t.msaa===!1||!e.quality?0:4,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:t.mips===!1?$:t.nearest?z:K,magFilter:t.nearest?z:$,generateMipmaps:t.mips!==!1}),c={uRes:{value:new y(2,2)},uPx:{value:1},uTime:{value:0}},a={tWorld:{value:o.texture},uRes:{value:new y(2,2)},uWorldRes:{value:new y(2,2)},uCss:{value:new y(2,2)},uTime:c.uTime,uKeep:{value:t.keep??.3},uCa:{value:.0025},uAsp:{value:1},uPin:{value:t.pin?1:0},uPout:{value:0},tGlyph:{value:t.atlas?.tex??_},uGlyphGrid:{value:new y(t.atlas?.cols??16,t.atlas?.rows??9)},uRain:{value:t.atlas?.rain??100},tVid:{value:_},uVidAsp:{value:16/9},uVidRaw:{value:0},...t.uniforms},u=new k({vertexShader:ce,fragmentShader:le(t.pin,t.pout)+t.frag+ie,uniforms:a,depthTest:!1,depthWrite:!1}),d=new B(new I(2,2),u);d.frustumCulled=!1;const g=new L;g.add(d);const n=new j;function m(){const{width:l,height:i,dpr:p,aspect:h}=e.viewport,[r,v]=t.size?t.size(l,i,p):[Math.max(2,Math.round(l*p)),Math.max(2,Math.round(i*p))];(o.width!==r||o.height!==v)&&o.setSize(r,v),a.uWorldRes.value.set(r,v),a.uRes.value.set(Math.round(l*p),Math.round(i*p)),a.uCss.value.set(l,i),c.uRes.value.set(r,v),c.uPx.value=r/Math.max(1,l),a.uAsp.value=h}function b(l,i=s,p=0,h=[]){const r=e.renderer,v=r.getRenderTarget(),w=r.getClearAlpha(),f=r.autoClear;if(r.getClearColor(n),r.setRenderTarget(o),r.setClearColor(p,1),r.clear(!0,!0,!0),r.render(i,l),h.length){r.autoClear=!1;for(const[R,U]of h)r.clearDepth(),r.render(R,U);r.autoClear=f}r.setRenderTarget(v),r.setClearColor(n,w)}async function P(l){const i=e.renderer,p=i.getRenderTarget();i.setRenderTarget(o),await i.compileAsync(s,l).catch(()=>{}),i.setRenderTarget(p),s.traverse(h=>{const r=h.material;for(const w of Object.values(r?.uniforms??{})){const f=w?.value;f?.isTexture&&!f.isRenderTargetTexture&&f.image&&!f.isVideoTexture&&i.initTexture(f)}const v=r?.map;v?.isTexture&&v.image&&!v.isVideoTexture&&i.initTexture(v)}),b(l)}m();const C=t.inW??.05,M=t.outW??.05;return{scene:g,world:s,rt:o,U:a,G:c,resize:m,draw:b,warm:P,tick(l,i){c.uTime.value=re(l),a.uCa.value=(.0025+Math.min(Math.abs(i),4)*.006)*.65},setP(l){if(ne){a.uPin.value=0,a.uPout.value=0;return}a.uPin.value=t.pin?1-q(0,C,l):0,a.uPout.value=t.pout?q(1-M,1,l):0},dispose(){o.dispose(),u.dispose(),d.geometry.dispose()}}}const ve=`
attribute vec3 aA; attribute vec3 aB; attribute vec4 aC; attribute vec4 aP;
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){ A = aA; B = aB; col = aC; par = aP; }`;function be(e){const{count:t,shared:s}=e,o=new Y,c=new I(1,1);o.index=c.index,o.setAttribute("position",c.getAttribute("position")),o.setAttribute("uv",c.getAttribute("uv")),o.instanceCount=t;const a=e.ends?null:{a:new A(new Float32Array(t*3),3),b:new A(new Float32Array(t*3),3),c:new A(new Float32Array(t*4),4),p:new A(new Float32Array(t*4),4)};if(a){o.setAttribute("aA",a.a),o.setAttribute("aB",a.b),o.setAttribute("aC",a.c),o.setAttribute("aP",a.p);for(const n of Object.values(a))n.setUsage(X)}const u={uFog:{value:e.fog??0},...s,...e.uniforms},d=new k({uniforms:u,transparent:!0,depthWrite:!1,depthTest:e.depthTest??!0,blending:e.normal?O:G,defines:e.normal?{NORMAL:1}:{},vertexShader:`
      uniform vec2 uRes; uniform float uPx, uFog, uTime;
      varying float vAcross, vHw, vU, vFog, vPx, vHead; varying vec4 vCol;
      ${e.ends??ve}
      void main(){
        float id = float(gl_InstanceID);
        vec3 A, B; vec4 col, par; ends(id, A, B, col, par);
        if (col.a <= .001 || par.x <= 0. || par.z <= par.y) { gl_Position = vec4(2., 2., 2., 1.); return; }
        mat4 M = projectionMatrix * viewMatrix * modelMatrix;
        vec4 ca = M * vec4(A, 1.), cb = M * vec4(B, 1.);
        vec4 c0 = mix(ca, cb, par.y), c1 = mix(ca, cb, par.z);
        const float NEAR = .08;
        if (c0.w < NEAR && c1.w < NEAR) { gl_Position = vec4(2., 2., 2., 1.); return; }
        vec4 e0 = c0, e1 = c1;
        if (c0.w < NEAR) e0 = mix(c0, c1, (NEAR - c0.w) / (c1.w - c0.w));
        if (c1.w < NEAR) e1 = mix(c1, c0, (NEAR - c1.w) / (c0.w - c1.w));
        vec2 s0 = e0.xy / e0.w * uRes * .5, s1 = e1.xy / e1.w * uRes * .5;
        vec2 d = s1 - s0; float L = length(d);
        vec2 dir = L > 1e-3 ? d / L : vec2(1., 0.), nrm = vec2(-dir.y, dir.x);
        float hw = max(par.x * uPx * .5, .6) + 1.;
        float u = position.x + .5, v = position.y * 2.;
        vec2 sp = mix(s0, s1, u) + nrm * v * hw + dir * (u * 2. - 1.) * hw;
        vec4 ec = mix(e0, e1, u);
        gl_Position = vec4(sp / (uRes * .5) * ec.w, ec.z, ec.w);
        vAcross = v * hw; vHw = hw; vU = u; vPx = par.x * uPx; vHead = par.w; vCol = col; vFog = exp(-uFog * ec.w);
      }`,fragmentShader:`
      varying float vAcross, vHw, vU, vFog, vPx, vHead; varying vec4 vCol;
      void main(){
        float a = clamp(vHw - 1. + .5 - abs(vAcross), 0., 1.) * min(1., vPx + .25);
        float head = 1. + vHead * smoothstep(.8, 1., vU);
        if (a <= .002) discard;
        #ifdef NORMAL
          gl_FragColor = vec4(vCol.rgb * head, vCol.a * a * vFog);
        #else
          gl_FragColor = vec4(vCol.rgb * head * vCol.a * a * vFog, 1.);
        #endif
      }`}),g=new B(o,d);return g.frustumCulled=!1,g.renderOrder=e.order??4,{mesh:g,material:d,U:u,geo:o,count:t,attrs:a,setCount(n){o.instanceCount=n},set(n,m,b,P,C,M,l,i,p,h,r=1,v=1.2,w=0,f=1,R=0){a.a.setXYZ(n,m,b,P),a.b.setXYZ(n,C,M,l),a.c.setXYZW(n,i,p,h,r),a.p.setXYZW(n,v,w,f,R)},clear(n=0){if(a)for(let m=n;m<t;m++)a.c.setW(m,0)},dirty(){if(a)for(const n of Object.values(a))n.needsUpdate=!0},dispose(){o.dispose(),d.dispose(),c.dispose()}}}function Ae(e){const{count:t,shared:s}=e,o=new Z;o.setAttribute("position",new Q(new Float32Array(t*3),3));const c={uAtten:{value:e.atten??0},uFog:{value:e.fog??0},uCore:{value:e.core??.5},...s,...e.uniforms},a=new k({uniforms:c,transparent:!0,depthWrite:!1,depthTest:e.depthTest??!0,blending:e.normal?O:G,defines:e.normal?{NORMAL:1}:{},vertexShader:`
      uniform float uPx, uAtten, uFog, uTime;
      varying vec4 vCol; varying float vFog;
      ${e.pt}
      void main(){
        float id = float(gl_VertexID);
        vec3 pos; float size; vec4 col; pt(id, pos, size, col);
        if (col.a <= .001 || size <= 0.) { gl_Position = vec4(2., 2., 2., 1.); gl_PointSize = 0.; return; }
        vec4 mv = viewMatrix * modelMatrix * vec4(pos, 1.);
        gl_Position = projectionMatrix * mv;
        float s = size * uPx; if (uAtten > 0.) s *= uAtten / max(-mv.z, .1);
        gl_PointSize = clamp(s, 1., 96.);
        vCol = col; vFog = exp(-uFog * length(mv.xyz));
      }`,fragmentShader:`
      uniform float uCore; varying vec4 vCol; varying float vFog;
      void main(){
        float r = length(gl_PointCoord - .5) * 2.;
        if (r > 1.) discard;
        float soft = pow(1. - r, 2.), core = smoothstep(.35, .0, r) * uCore;
        float a = (soft * .55 + core) * vCol.a * vFog;
        #ifdef NORMAL
          gl_FragColor = vec4(vCol.rgb, a);
        #else
          gl_FragColor = vec4(vCol.rgb * a, 1.);
        #endif
      }`}),u=new J(o,a);return u.frustumCulled=!1,u.renderOrder=e.order??3,o.setDrawRange(0,t),{mesh:u,material:a,U:c,geo:o,count:t,setCount(d){o.setDrawRange(0,d)},dispose(){o.dispose(),a.dispose()}}}export{ee as C,S as F,oe as M,xe as a,ge as b,de as c,pe as d,re as e,he as f,me as g,we as h,fe as i,be as l,Ae as p,ye as s};
