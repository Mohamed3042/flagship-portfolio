import{u as Z,V as se,S as Y,q as le,y as I,aM as oe,H as ce,s as R,i as G,M as K,a as N,C as ue,a6 as H,x as re,bs as ve,a1 as fe,az as de,aP as ae,aF as pe,ao as me,aq as he,a0 as xe}from"./EditionWorld.astro_astro_type_script_index_0_lang.P9odppCQ.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ge=`
// never set, so 0: loops start at ZERO so the D3D compiler cannot unroll them (it unrolled every noise loop at every call
// site, and the ice block took 7 s to compile)
uniform int uZ;
#define ZERO uZ
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float h13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
vec3 h33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); vec3 u = f * f * (3. - 2. * f);
  return mix(mix(mix(h13(i), h13(i + vec3(1, 0, 0)), u.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), u.x), u.y),
             mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), u.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), u.x), u.y), u.z); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = ZERO; i < 5; i++){ v += a * vn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.1; a *= .5; } return v; }
float fbm3(vec2 p){ float v = 0., a = .5; for (int i = ZERO; i < 3; i++){ v += a * vn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.1; a *= .5; } return v / .875; }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
float sdRBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
// Voronoi: x = distance to the nearest border, y = the cell's hash, zw = the cell's centre
vec4 voronoi(vec2 p){
  vec2 n = floor(p), f = fract(p), mg = vec2(0.), mr = vec2(0.); float md = 8.;
  for (int j = ZERO - 1; j <= 1; j++) for (int i = ZERO - 1; i <= 1; i++){
    vec2 g = vec2(i, j), o = h22(n + g), r = g + o - f; float d = dot(r, r);
    if (d < md){ md = d; mr = r; mg = g; }
  }
  md = 8.;
  for (int j = ZERO - 2; j <= 2; j++) for (int i = ZERO - 2; i <= 2; i++){
    vec2 g = mg + vec2(i, j), o = h22(n + g), r = g + o - f;
    if (dot(mr - r, mr - r) > .00001) md = min(md, dot(.5 * (mr + r), normalize(r - mr)));
  }
  return vec4(md, h12(n + mg), n + mg + h22(n + mg));
}
`,we=`
vec3 S(vec3 c){ return pow(c, vec3(2.2)); }
const vec3 C_BLACK = vec3(.0012, .0021, .0034);    // #04070B
const vec3 C_NAVY = vec3(.0032, .0116, .0242);     // #0A1B2B
const vec3 C_GLACIER = vec3(.0122, .1144, .2384);  // #1C5F86
const vec3 C_CYAN = vec3(.2747, .6867, .9131);     // #8FD8F5
const vec3 C_FROST = vec3(.8228, .9216, .9647);    // #EAF6FB
const vec3 C_GOLD = vec3(1., .4564, .1022);        // #FFB45C
const vec3 C_ROSE = vec3(1., .2051, .1470);        // #FF7E6B
// thin-film colour of a fracture or a bubble skin
vec3 thinFilm(float t){ return .5 + .5 * cos(6.28318 * (vec3(0., .33, .67) + t)); }
`,be=`
vec3 invNeutral(vec3 o){
  const float S0 = .76, D = .24;
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
}`,Q=(o,e)=>{const i=e.length,r=e.map(([t,a])=>`vec2(${t.toFixed(3)},${a.toFixed(3)})`).join(",");return`const vec2 ${o}[${i}] = vec2[${i}](${r});
float sd_${o}(vec2 p){
  float d = dot(p - ${o}[0], p - ${o}[0]), s = 1.;
  for (int i = ZERO, j = ${i-1}; i < ${i}; j = i, i++){
    vec2 e = ${o}[j] - ${o}[i], w = p - ${o}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${o}[i].y, p.y < ${o}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`},ye=`${Q("MKM",Z[0])}
${Q("MKK",Z[1])}
float sdMK(vec2 p){ p += vec2(1.935, 1.); return min(sd_MKM(p), sd_MKK(p)); }`,Se=`
float feather(vec2 q, float L, float s){
  if (q.x < -.02 || q.x > L + .02) return 0.;
  float y = abs(q.y);
  float stem = smoothstep(.006 + .006 * (1. - q.x / L), .002, y) * smoothstep(L, L - .04, q.x);
  float t = y / .866, x0 = q.x - .5 * t, k = floor(x0 / s + .5) * s;
  float lb = max(L - k, 0.) * (.38 + .2 * h11(k * 13.7 + L));
  vec2 b = vec2(q.x - k, y), dir = vec2(.5, .866);
  float al = clamp(dot(b, dir), 0., lb);
  vec2 off = b - al * dir;
  float barb = smoothstep(.005, .0015, length(off)) * step(0., k) * step(k, L);
  vec2 nb = vec2(-dir.y, dir.x);
  float u = dot(b, dir), v = dot(b, nb), s2 = s * .45;
  float t2 = abs(v) / .866, u0 = u - .5 * t2, k2 = floor(u0 / s2 + .5) * s2;
  float lb2 = max(lb - k2, 0.) * .35;
  vec2 c = vec2(u - k2, abs(v));
  float al2 = clamp(dot(c, dir), 0., lb2);
  float fine = smoothstep(.0035, .001, length(c - al2 * dir)) * step(.0, k2) * step(k2, lb) * step(0., k) * step(k, L) * .7;
  return max(stem, max(barb, fine));
}
float frostFeathers(vec2 p, float cell, float g, float seed){
  vec2 base = floor(p / cell);
  float best = 0.;
  for (int j = ZERO - 1; j <= 1; j++) for (int i = ZERO - 1; i <= 1; i++){
    vec2 id = base + vec2(i, j);
    vec2 h = h22(id + seed);
    vec2 o = (id + h) * cell;
    vec2 inward = -normalize(o + 1e-4);
    float an = atan(inward.y, inward.x) + (h.x - .5) * 1.6;
    vec2 dd = vec2(cos(an), sin(an));
    vec2 q = mat2(dd.x, -dd.y, dd.y, dd.x) * (p - o);
    q.y += sin(q.x / cell * 3.1 + h.y * 6.) * cell * .06;
    float L = (.7 + .5 * h.y) * g;
    best = max(best, feather(q / cell, L, .075));
  }
  return best;
}
// hoarfrost: a fine rime haze plus feathers, 0..1 (cover: how much of the surface it has taken)
float hoarfrost(vec2 p, float cover){
  float haze = smoothstep(.35, .75, fbm(p * 3.) + cover * .6 - .3);
  float f = frostFeathers(p, .22, .3 + cover * .9, 3.1);
  return clamp(max(haze * .55, f) * smoothstep(0., .25, cover), 0., 1.);
}
`,Ce={ICE:`
vec3 pivotICE(vec2 uv){
  // diving into clear ice (keyframe mark-c): everything streams out from a bright core right of centre
  vec2 o = vec2(.16, .04), p = (uv - .5) * vec2(uAsp, 1.) - o;
  float r = length(p), a = atan(p.y, p.x);
  vec3 c = C_BLACK + C_NAVY * .5 * smoothstep(1.2, .0, r);
  c += C_GOLD * (exp(-r * 14.) * 1.2 + exp(-r * 4.) * .06);
  // broken ice: long straight edges crossing near the core (never all through one point, or it reads as a star), each a
  // bright line (gold near the core, cold further out), the sheet behind it a faint glassy tint, a rainbow hairline
  for (int i = ZERO; i < 12; i++){
    float fi = float(i), ang = h11(fi * 3.1) * 3.14159;
    vec2 dir = vec2(cos(ang), sin(ang)), nrm = vec2(-dir.y, dir.x);
    float off = (h11(fi * 7.7) - .5) * .55;
    float sd = dot(p, nrm) - off, d = abs(sd), along = dot(p, dir) - (h11(fi * 2.2) - .5) * .5;
    float len = .25 + .85 * h11(fi * 5.3);
    float seg = smoothstep(len, len * .55, abs(along));
    float w = .0012 + .0035 * h11(fi * 9.9);
    float near = exp(-length(p) * 2.6);
    c += mix(C_CYAN * .45, C_GOLD * 1.5, near) * exp(-d / w) * seg * (.35 + .65 * h11(fi * 1.9));
    c += mix(C_NAVY * .8, C_CYAN * .07, h11(fi)) * step(0., sd) * exp(-d * 5.) * seg * .45;
    c += thinFilm(d * 70. + fi) * exp(-d / (w * 3.)) * seg * .035;
  }
  // chains of bubbles riding out along a few curved lines, rings with bright rims, bigger as they near the lens
  for (int k = ZERO; k < 7; k++){
    float fk = float(k), ak = h11(fk * 5.3) * 6.28318, bend = (h11(fk * 2.1) - .5) * .8;
    for (int j = ZERO; j < 6; j++){
      float fj = float(j);
      float rr = fract(fj / 6. + h11(fk) + uTime * .03) * 1.5;
      float ang = ak + bend * rr;
      vec2 bc = vec2(cos(ang), sin(ang)) * rr;
      float size = .006 + .028 * rr * rr;
      float d = length(p - bc);
      float ring = smoothstep(size, size * .78, d) * (.25 + .75 * smoothstep(size * .55, size * .95, d));
      c += mix(C_FROST * .7, C_GOLD * 1.2, smoothstep(.6, .0, rr)) * ring * smoothstep(.04, .2, rr) * .55;
    }
  }
  c += (h12(uv * 913. + floor(uTime * 24.)) - .5) * .004;
  return c;
}`,CRACK:`
vec3 pivotCRACK(vec2 uv){
  vec2 p = (uv - .5) * vec2(uAsp, 1.);
  // a jagged slit down the middle of the frame, wider in the centre
  float w = .035 + .05 * smoothstep(.55, 0., abs(p.y)) + (fbm3(vec2(p.y * 7., 1.3)) - .5) * .05;
  float x = p.x + (fbm3(vec2(p.y * 3.1, 7.)) - .5) * .12;
  float slit = smoothstep(w, w * .3, abs(x));
  // the two walls of black ice seen from above, a faint frost glitter, lit cyan at their lips
  vec3 c = C_BLACK + C_NAVY * .6 * fbm(p * 6. + 3.);
  c += C_FROST * pow(h12(floor(uv * vec2(uAsp, 1.) * 420.)), 60.) * .4;
  float lip = exp(-max(abs(x) - w, 0.) * 40.) * (1. - slit);
  c += C_CYAN * lip * .18;
  // inside the slit: layered blue walls falling away to a deep cyan glow
  vec3 deep = mix(C_GLACIER * .7, C_CYAN * .55, smoothstep(.04, 0., abs(x)) * .8);
  deep *= .7 + .3 * sin(p.y * 90. + fbm3(p * 20.) * 4.);
  return mix(c, deep, slit);
}`,GLARE:`
vec3 pivotGLARE(vec2 uv){
  vec2 p = (uv - .5) * vec2(uAsp, 1.);
  float r = length(p - vec2(.08, .04));
  vec3 c = mix(vec3(1.25, 1.12, .95), C_GOLD * 1.25, smoothstep(.15, .85, r));
  c = mix(c, C_GLACIER * .9, smoothstep(.75, 1.5, r));
  // soft horizontal streaks of the glare
  c += vec3(1., .9, .75) * exp(-abs(p.y - .04) * 9.) * .12;
  c += (h12(uv * 777. + floor(uTime * 24.)) - .5) * .006;
  return c;
}`},z={mono:'"Space Grotesk Variable", system-ui, sans-serif',sans:'"Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif'},ie=()=>new URLSearchParams(location.search),J=ie().get("mt"),ke=o=>J!==null?Number(J):o;typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;function $e(){const o=ie().get("intro");let e=-1,i=-1,r=0;return(t,a)=>{const h=window.__iceIntro;return h!==void 0?Number(h):o!==null?Number(o):(i<0&&(i=t),e<0&&(r=a<.04?r+1:0,(r>=8||t-i>2.5)&&(e=t)),e<0?0:t-e)}}new se;const Te="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",Re=(o,e)=>`
uniform sampler2D tWorld; uniform vec2 uRes, uWorldRes, uCss; uniform float uTime, uKeep, uCa, uAsp, uPin, uPout;
varying vec2 vUv;
${ge}
${we}
${be}
${ye}
${Se}
${[...new Set([o,e].filter(Boolean))].map(i=>Ce[i]).join(`
`)}
vec3 pivotIn(vec2 uv){ return ${o?`pivot${o}(uv)`:"vec3(0.)"}; }
vec3 pivotOut(vec2 uv){ return ${e?`pivot${e}(uv)`:"vec3(0.)"}; }
vec3 finish(vec3 c){
  float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
  float post = .45 + .55 * vig;
  return invNeutral(max(c * mix(1., post, uKeep), 0.)) / post;
}
vec3 samp(vec2 uv){ vec2 d = (uv - .5) * uCa; return vec3(texture2D(tWorld, uv - d).r, texture2D(tWorld, uv).g, texture2D(tWorld, uv + d).b); }
vec3 blurLod(vec2 uv, float lod){
  vec2 o = exp2(lod) / uWorldRes * .75;
  return (textureLod(tWorld, uv + o, lod).rgb + textureLod(tWorld, uv + vec2(-o.x, o.y), lod).rgb + textureLod(tWorld, uv + vec2(o.x, -o.y), lod).rgb + textureLod(tWorld, uv - o, lod).rgb) * .25;
}
vec3 bloom(vec2 uv){ return blurLod(uv, 2.5) * .34 + blurLod(uv, 4.) * .3 + blurLod(uv, 5.5) * .22 + blurLod(uv, 7.) * .14; }
`,Le=`
void main(){
  vec2 uv = vUv;
  vec3 c = step(.999, max(uPin, uPout)) > .5 ? vec3(0.) : look(uv);
  if (uPin > .001) c = mix(c, pivotIn(uv), uPin);
  if (uPout > .001) c = mix(c, pivotOut(uv), uPout);
  gl_FragColor = vec4(finish(c), 1.);
}`,Ae=typeof location<"u"&&new URLSearchParams(location.search).has("nopivot"),Me=(()=>{const o=new re(new Uint8Array([0,0,0,255]),1,1);return o.needsUpdate=!0,o})();function Fe(o,e){const i=new Y,r=e.noWorld?null:new le(2,2,{type:ce,samples:e.msaa===!1||!o.quality?0:4,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:e.mips===!1?I:oe,magFilter:I,generateMipmaps:e.mips!==!1}),t={tWorld:{value:r?.texture??Me},uRes:{value:new R(2,2)},uWorldRes:{value:new R(2,2)},uCss:{value:new R(2,2)},uTime:{value:0},uKeep:{value:e.keep??.3},uCa:{value:.0025},uAsp:{value:1},uPin:{value:e.pin?1:0},uPout:{value:0},...e.uniforms},a=new G({vertexShader:Te,fragmentShader:Re(e.pin,e.pout)+e.frag+Le,uniforms:t,depthTest:!1,depthWrite:!1}),h=new K(new N(2,2),a);h.frustumCulled=!1;const b=new Y;b.add(h);const v=new ue;function T(){const{width:l,height:p,dpr:m,aspect:n}=o.viewport,[f,L]=e.size?e.size(l,p,m):[Math.max(2,Math.round(l*m)),Math.max(2,Math.round(p*m))];r&&(r.width!==f||r.height!==L)&&r.setSize(f,L),t.uWorldRes.value.set(f,L),t.uRes.value.set(Math.round(l*m),Math.round(p*m)),t.uCss.value.set(l,p),t.uAsp.value=n}function C(l,p=i,m=0){if(!r)return;const n=o.renderer,f=n.getRenderTarget(),L=n.getClearAlpha();n.getClearColor(v),n.setRenderTarget(r),n.setClearColor(m,1),n.clear(!0,!0,!0),n.render(p,l),n.setRenderTarget(f),n.setClearColor(v,L)}async function y(l,p=i){const m=o.renderer,n=m.getRenderTarget();r&&(m.setRenderTarget(r),await m.compileAsync(p,l).catch(()=>{}),m.setRenderTarget(n),p.traverse(f=>{const L=f.material;for(const E of Object.values(L?.uniforms??{})){const O=E?.value;O?.isTexture&&!O.isRenderTargetTexture&&O.image&&!O.isVideoTexture&&m.initTexture(O)}}),C(l,p)),await m.compileAsync(b,l).catch(()=>{})}T();const x=e.inW??.05,P=e.outW??.05;return{scene:b,world:i,rt:r,U:t,resize:T,draw:C,warm:y,tick(l,p){t.uTime.value=ke(l),t.uCa.value=(.0025+Math.min(Math.abs(p),4)*.006)*.65},setP(l){if(Ae){t.uPin.value=0,t.uPout.value=0;return}t.uPin.value=e.pin?1-H(0,x,l):0,t.uPout.value=e.pout?H(1-P,1,l):0},dispose(){r?.dispose(),a.dispose(),h.geometry.dispose()}}}function _e(o,e){let i=o.viewport.portrait;const r=n=>`${o.base.replace(/\/$/,"")}/editions/ice/${e}-${n?"phone":"desk"}.mp4`,t=document.createElement("video");t.muted=!0,t.playsInline=!0,t.preload="auto",t.crossOrigin="anonymous",t.setAttribute("playsinline",""),t.setAttribute("muted","");const a=new ve(t);a.colorSpace=fe,a.generateMipmaps=!1;const h=n=>{const f=new de().load(r(n).replace(/\.mp4$/,".webp"));return f.colorSpace=ae,f.generateMipmaps=!1,f.minFilter=I,f};let b=h(i),v=!1;t.addEventListener("loadeddata",()=>{v=!0});const T=30;let C=0,y=!1;const x=()=>{y=!0,t.currentTime=C};t.addEventListener("seeked",()=>{a.needsUpdate=!0,Math.abs(t.currentTime-C)>.5/T?x():y=!1}),t.style.cssText="position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;pointer-events:none;z-index:-1",t.setAttribute("aria-hidden","true"),document.body.append(t);const P=()=>t.play().then(()=>{t.pause(),a.needsUpdate=!0});let l="";const p=n=>fetch(r(n)).then(f=>{if(!f.ok)throw new Error(String(f.status));return f.blob()}).then(f=>{n===i&&(l&&URL.revokeObjectURL(l),l=URL.createObjectURL(f),t.src=l)}).catch(()=>{n===i&&(t.src=r(n))}).then(()=>{n===i&&P().catch(()=>addEventListener("pointerup",()=>P().catch(()=>{}),{once:!0,capture:!0}))});p(i);const m=new Promise(n=>{t.addEventListener("loadeddata",()=>{a.needsUpdate=!0,n()},{once:!0}),t.addEventListener("error",()=>n(),{once:!0}),setTimeout(n,8e3)});return{tex:a,video:t,ready:m,get aspect(){return t.videoWidth?t.videoWidth/t.videoHeight:i?720/1208:16/9},get poster(){return b},get live(){return v},set(n){this.frame(Math.min(Math.max(n,0),1)*Math.max(0,this.frames-1))},get frames(){return Math.round((t.duration||0)*T)},frame(n){t.duration&&(C=Math.min(Math.max(n,0)/T,Math.max(0,t.duration-1/T)),!y&&Math.abs(t.currentTime-C)>.5/T&&x())},orient(){return o.viewport.portrait===i?!1:(i=o.viewport.portrait,y=!1,v=!1,b.dispose(),b=h(i),t.addEventListener("loadeddata",()=>{a.needsUpdate=!0},{once:!0}),p(i),!0)},get tall(){return i},dispose(){t.removeAttribute("src"),t.load(),t.remove(),a.dispose(),b.dispose(),l&&URL.revokeObjectURL(l)}}}function je(o){const e={tPlate:{value:o.tex},tStill:{value:o.poster},uLive:{value:0},uFit:{value:new R(1,1)},uGain:{value:1}},i=new G({uniforms:e,depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .99999, 1.); }",fragmentShader:`uniform sampler2D tPlate, tStill; uniform vec2 uFit; uniform float uGain, uLive; varying vec2 vUv;
      vec3 lin(vec3 c){ return mix(c / 12.92, pow((c + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
      void main(){
        vec2 uv = (vUv - .5) * uFit + .5;
        vec3 c = uLive > .5 ? texture2D(tPlate, uv).rgb : texture2D(tStill, uv).rgb;
        gl_FragColor = vec4(lin(c) * uGain, 1.);
      }`}),r=new K(new N(2,2),i);return r.frustumCulled=!1,r.renderOrder=-10,{mesh:r,fit(t){const a=o.aspect;e.uFit.value.set(t>a?1:t/a,t>a?a/t:1),e.uLive.value=o.live?1:0,e.tStill.value=o.poster},gain(t){e.uGain.value=t},dispose(){i.dispose(),r.geometry.dispose()}}}const qe=["carve","frost","aurora","etch"],Pe=["shatter","sublimate","lift","melt"],Ee=`uniform vec2 uC, uH, uShift; uniform float uScale; varying vec2 vUv, vScr;
  void main(){ vUv = uv; vec2 q = uC + position.xy * uH * uScale + uShift; vScr = q * .5 + .5; gl_Position = vec4(q, 0., 1.); }`,Oe=`
uniform sampler2D tText, tPlate; uniform vec2 uTexel, uFit, uSrc, uC01; uniform float uR, uX, uRtl, uTime, uDim, uAsp, uSpark;
varying vec2 vUv, vScr;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + 1.), f.x), f.y); }
vec3 lin(vec3 c){ return mix(c / 12.92, pow((c + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
float A(vec2 uv){ return texture2D(tText, uv).a; }
float S(vec2 uv, float l){ return textureLod(tText, uv, l).a; }
void main(){
  float s = mix(vUv.x, 1. - vUv.x, uRtl), down = 1. - vUv.y;   // 0 at the reading start / the top
  vec2 uv = vUv; float keep = 1., crack = 0.;
  // ── leaving ──
#if EXIT == 0
  // shards: a Voronoi of the block; cracks run along the cell borders first, then each shard flies off on its own
  vec2 q = vec2(vUv.x * uAsp * 2.2, vUv.y * 2.2), qi = floor(q), qf = fract(q); vec2 best = vec2(9.), id = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), r = o + vec2(h21(qi + o), h21(qi + o + 9.)) * .9 + .05 - qf; float d = dot(r, r);
    if (d < best.x) {best.y = best.x; best.x = d; id = qi + o;} else if (d < best.y) best.y = d;
  }
  // (small moves only: a shard samples its own letters a little way off, so it drifts and drops, it never travels)
  float hc = h21(id + 7.), fly = smoothstep(.3 + hc * .25, 1., uX);
  vec2 dir = normalize(vec2(h21(id), h21(id + 3.)) - .5 + 1e-3);
  uv += dir * fly * vec2(.03, .1) + vec2(0., fly * fly * .07);
  crack = smoothstep(.05, .0, sqrt(best.y) - sqrt(best.x)) * smoothstep(0., .2, uX) * (1. - fly);
  keep = (1. - smoothstep(.45 + hc * .3, .85 + hc * .1, uX)) * step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
#elif EXIT == 1
  float nx = vn(vec2(s * 40., down * 10.)), ny = vn(vec2(s * 9., down * 3.) + 4.);
  uv.y -= uX * (.03 + ny * .1);
  keep = 1. - smoothstep(nx * .55 + ny * .35, nx * .55 + ny * .35 + .12, uX * 1.1);
#elif EXIT == 2
  // the curtain lifts off from the bottom: a letter goes once the rising edge passes it
  float nl = vn(vec2(s * 6. + uTime * .05, 1.)), fl = uX * 1.3 - .15;
  keep = smoothstep(fl - .15, fl, (1. - down) * .55 + nl * .3 + s * .15);
#else
  float nm = vn(vec2(s * 70., 2.));
  uv.y += uX * nm * .35;
  keep = 1. - smoothstep(.2, 1., uX + nm * .2);
#endif
  float t = A(uv), glow = 0.; vec3 col, gcol = vec3(0.);
  // ── forming ──
#if TRICK == 0
  float n = vn(vec2(s * 55., down * 9.)), edge = s + (n - .5) * .08, f = uR * 1.3 - .15;
  float shown = smoothstep(f + .02, f - .02, edge);
  vec2 e = uTexel * 2.5, g = vec2(S(uv + vec2(e.x, 0.), 1.5) - S(uv - vec2(e.x, 0.), 1.5), S(uv + vec2(0., e.y), 1.5) - S(uv - vec2(0., e.y), 1.5));
  float rim = clamp(length(g) * 2., 0., 1.);
  // the ice inside the letters: a close window on the lit source, refracted at the rim, over a cold frosted body
  vec2 puv = (uSrc + (vScr - uC01) * .42 - .5) * uFit + .5 + g * .045;
  vec3 pc = lin(texture2D(tPlate, clamp(puv, .002, .998)).rgb);
  col = mix(vec3(.42, .56, .7), pc * 2.1, .62) + vec3(.06, .09, .12);
  col += rim * vec3(.6, .85, 1.) * .8;
  col += vec3(.9, .97, 1.) * crack * 2.;
  col += vec3(1., .66, .3) * exp(-pow((edge - f + .22) * 6., 2.)) * (.4 + rim) * 1.6 * (1. - uX);
  col = mix(col, vec3(.92, .97, 1.), smoothstep(.05, 0., abs(edge - f)) * .85);
  t *= shown; glow = S(uv, 4.) * shown * .5;
#elif TRICK == 1
  // frost grows out from each letter's spine (its blurred coverage) with crystalline edges, then settles crisp
  float n1 = vn(vec2(s * 70., down * 18.)), n2 = vn(vec2(s * 16., down * 5.) + 5.);
  float seed = s * .55 + n2 * .45, grow = smoothstep(seed - .05, seed + .25, uR * 1.3);
  float spine = S(uv, 1.2) * .75 + n1 * .25, show = smoothstep(1.02 - grow, 1.08 - grow, spine);
  vec3 frost = vec3(.62, .82, 1.) * (.8 + smoothstep(.45, .85, n1) * .6);
  col = mix(frost, vec3(.95, .98, 1.), smoothstep(.6, 1., grow));
  vec2 cellS = floor(vUv / uTexel / 4.);
  col += vec3(1.4) * pow(h21(cellS), 80.) * (.5 + .5 * sin(uTime * 2.5 + h21(cellS + 1.) * 6.28)) * grow * uSpark;
  t *= mix(show, 1., smoothstep(.85, 1., grow));
  gcol = vec3(.45, .7, 1.) * S(uv, 2.5) * grow * .22 * (.2 + .8 * uSpark); glow = S(uv, 4.) * grow * .45;
#elif TRICK == 2
  float nA = vn(vec2(s * 7. + uTime * .06, down * 2.)), front = uR * 1.4 - .25;
  float shown = smoothstep(front, front - .14, down * .45 + s * .4 + (nA - .5) * .25);
  float fold = .5 + .5 * sin(s * 8. + uTime * .6 + nA * 3.);
  col = mix(mix(vec3(.3, 1., .62), vec3(.25, .85, .95), down), vec3(.72, .48, 1.), fold * .4) * 1.15;
  col = mix(col, vec3(1.), t * t * .25);
  t *= shown; gcol = col * S(uv, 3.) * shown * .35; glow = S(uv, 4.) * shown * .45;
#else
  float f = uR * 1.2 - .08, behind = smoothstep(f + .012, f - .012, s);
  float warm = smoothstep(f - .35, f, s) * behind, hot = exp(-pow((s - f) * 24., 2.)) * step(.001, uR) * (1. - step(.999, uR));
  col = mix(vec3(.9, .96, 1.), vec3(1.25, .82, .48), warm);
  t *= behind; gcol = vec3(2.4, 1.4, .55) * hot * S(uv, 1.5) + vec3(1., .7, .4) * S(uv, 3.) * warm * .25;
  glow = S(uv, 4.) * behind * .5;
#endif
  t *= keep; glow *= keep * uDim; gcol *= keep;
  // premultiplied: the letters, their light, and a soft dark lens under them so they read over any footage
  gl_FragColor = vec4(col * t + gcol, max(t, glow * mix(.85, .55, uSpark)));
}`,ee=(()=>{const o=new re(new Uint8Array([0,0,0,255]),1,1);return o.needsUpdate=!0,o})(),W=(o,e,i)=>{const r=Math.min(1,Math.max(0,(i-o)/(e-o)));return r*r*(3-2*r)};function te(o,e,i){const r=o.lang==="ar",t=e.font==="mono"?r?z.ar:z.mono:r?z.ar:z.sans,a=e.weight??(e.font==="mono"?500:e.font==="text"?400:600),h=r?0:e.track??0,b=e.lead??1.12,v={tText:{value:ee},tPlate:{value:i?.tex??ee},uFit:i?.fit??{value:new R(1,1)},uTexel:{value:new R(1,1)},uSrc:{value:new R(.5,.5)},uC01:{value:new R(.5,.5)},uC:{value:new R},uH:{value:new R(1,1)},uShift:{value:new R},uScale:{value:1},uR:{value:0},uX:{value:0},uRtl:{value:r?1:0},uTime:{value:0},uDim:{value:1},uAsp:{value:1},uSpark:{value:1}},T=new G({vertexShader:Ee,fragmentShader:Oe,uniforms:v,transparent:!0,depthTest:!1,depthWrite:!1,blending:he,blendSrc:me,blendDst:pe,defines:{TRICK:qe.indexOf(e.trick),EXIT:Pe.indexOf(e.exit??(e.trick==="carve"?"shatter":e.trick==="aurora"?"lift":e.trick==="etch"?"melt":"sublimate"))}}),C=new K(new N(2,2),T);C.frustumCulled=!1,C.renderOrder=5,C.visible=!1;let y=e.text,x=null,P=0,l=1,p=1,m=1,n=0,f=!1;function L(s,u){const c=(Array.isArray(y)?y:[y]).map(w=>e.upper&&!r?w.toUpperCase():w),k=e.wrap?.[o.viewport.portrait?"tall":"wide"];if(!k)return c;const g=[];for(const w of c){let d="";for(const S of w.split(" ")){const A=d?`${d} ${S}`:S;d&&s.measureText(A).width>k*u?(g.push(d),d=S):d=A}d&&g.push(d)}return g}let E=null;function O(s){const u=document.createElement("canvas"),c=u.getContext("2d"),k=q=>{c.font=`${a} ${Math.round(s*q)}px ${t}`,c.letterSpacing=`${h*s*q}px`};k(1);let g=L(c,s),w=Math.max(...g.map(q=>c.measureText(q).width)),d=1;const S=Math.ceil(s*.5);w+S*2>4096&&(d=(4096-S*2)/w,k(d),g=L(c,s*d),w=Math.max(...g.map(q=>c.measureText(q).width)));const A=Math.ceil(w+S*2),F=Math.ceil(s*d*(b*(g.length-1)+1.25)+S*2),$=E&&x&&E.width===A&&E.height===F,M=$?E.getContext("2d"):c;$?(M.clearRect(0,0,A,F),M.font=c.font,M.letterSpacing=c.letterSpacing):(u.width=A,u.height=F,k(d)),M.fillStyle="#fff",M.textBaseline="alphabetic",M.direction=r?"rtl":"ltr",M.textAlign=r?"right":"left",g.forEach((q,j)=>M.fillText(q,r?A-S:S,S+s*d*(.95+b*j))),$?x.needsUpdate=!0:(x?.dispose(),E=u,x=new xe(u),x.colorSpace=ae,x.minFilter=oe,x.generateMipmaps=!0,x.anisotropy=4);const U=E;v.tText.value=x,v.uTexel.value.set(1/U.width,1/U.height),l=U.width,p=U.height,m=s*d,P=s,n=S,f=o.viewport.portrait}const B=()=>!!e.only&&e.only!==(o.viewport.portrait?"tall":"wide");async function ne(){if(B())return;const s=o.viewport.portrait,{height:u,dpr:c}=o.viewport,k=Math.min(420,Math.max(14,Math.round(e.size[s?"tall":"wide"]*u*c)));if(x&&Math.abs(k/P-1)<.2&&f===s)return _();const g=Array.isArray(y)?y.join(" "):y;await Promise.race([document.fonts?.load(`${a} ${k}px ${t}`,g),new Promise(w=>setTimeout(w,2500))]).catch(()=>{}),O(k),_()}function _(){const s=o.viewport.portrait,{width:u,height:c}=o.viewport;let g=e.size[s?"tall":"wide"]*c/m,w=(l-n*2)*g;const d=(e.maxW??.9)*u;w>d&&(g*=d/w,w=d);const S=l*g,A=p*g,F=(p-n*2)*g,[$,M]=e.at[s?"tall":"wide"],[U,q]=e.pin??[0,.5],j=(r?1-$:$)*u,V=r?j-(.5-U)*w:j+(.5-U)*w,X=M*c+(.5-q)*F;v.uAsp.value=S/A,v.uSpark.value=e.size[s?"tall":"wide"]>=.03?1:0,v.uC.value.set(V/u*2-1,1-X/c*2),v.uH.value.set(S/u,A/c),v.uC01.value.set(V/u,1-X/c);const D=e.src?.[s?"tall":"wide"];D&&v.uSrc.value.set(D[0],D[1])}return{mesh:C,spec:e,ensure:ne,layout:_,drive(s,u,c){v.uR.value=s,v.uX.value=u,v.uTime.value=c,C.visible=s>.001&&u<.999&&!!x&&!B(),v.uScale.value=e.trick==="carve"?(1.05-.05*W(0,1,s))*(1+.2*u*u):1,v.uShift.value.set(0,e.exit==="sublimate"||!e.exit&&e.trick==="frost"?u*.03:0)},at(s,u){const c=e.in?W(e.in[0],e.in[1],s):1,k=e.out?W(e.out[0],e.out[1],s):0;this.drive(c,k,u)},async setText(s){String(s)!==String(y)&&(y=s,P&&(O(P),_()))},dispose(){x?.dispose(),T.dispose(),C.geometry.dispose()}}}async function ze(o,e,i,r){const t=i.map(a=>te(o,a,r));await Promise.all(t.map(a=>a.ensure()));for(const a of t)e.add(a.mesh);return{list:t,async add(a){const h=te(o,a,r);return await h.ensure(),e.add(h.mesh),t.push(h),h},remove(a){e.remove(a.mesh),a.dispose(),t.splice(t.indexOf(a),1)},update(a,h){for(const b of t)(b.spec.in||b.spec.out)&&b.at(a,h)},resize(){for(const a of t)a.ensure()},dispose(){for(const a of t)e.remove(a.mesh),a.dispose()}}}export{je as a,ke as c,$e as i,_e as p,Fe as s,ze as w};
