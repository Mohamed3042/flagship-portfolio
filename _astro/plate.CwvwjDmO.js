import{u as b,V as E,S as y,q as $,y as w,aM as F,H as S,s as g,i as k,M as A,a as P,C as j,a6 as C,x as z,bn as W,a1 as D}from"./EditionWorld.astro_astro_type_script_index_0_lang.Bwhdv6R4.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const N=`
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
`,G=`
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
`,U=`
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
}`,L=(o,t)=>{const a=t.length,e=t.map(([r,i])=>`vec2(${r.toFixed(3)},${i.toFixed(3)})`).join(",");return`const vec2 ${o}[${a}] = vec2[${a}](${e});
float sd_${o}(vec2 p){
  float d = dot(p - ${o}[0], p - ${o}[0]), s = 1.;
  for (int i = ZERO, j = ${a-1}; i < ${a}; j = i, i++){
    vec2 e = ${o}[j] - ${o}[i], w = p - ${o}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${o}[i].y, p.y < ${o}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`},K=`${L("MKM",b[0])}
${L("MKK",b[1])}
float sdMK(vec2 p){ p += vec2(1.935, 1.); return min(sd_MKM(p), sd_MKK(p)); }`,B=`
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
`,Z={ICE:`
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
}`},M=()=>new URLSearchParams(location.search),R=M().get("mt"),I=o=>R!==null?Number(R):o;typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;function ee(){const o=M().get("intro");let t=-1,a=-1,e=0;return(r,i)=>{const v=window.__iceIntro;return v!==void 0?Number(v):o!==null?Number(o):(a<0&&(a=r),t<0&&(e=i<.04?e+1:0,(e>=8||r-a>2.5)&&(t=r)),t<0?0:r-t)}}const te=(o,t,a,e)=>[t,a,e][o.quality];new E;const V="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",Y=(o,t)=>`
uniform sampler2D tWorld; uniform vec2 uRes, uWorldRes, uCss; uniform float uTime, uKeep, uCa, uAsp, uPin, uPout;
varying vec2 vUv;
${N}
${G}
${U}
${K}
${B}
${[...new Set([o,t].filter(Boolean))].map(a=>Z[a]).join(`
`)}
vec3 pivotIn(vec2 uv){ return ${o?`pivot${o}(uv)`:"vec3(0.)"}; }
vec3 pivotOut(vec2 uv){ return ${t?`pivot${t}(uv)`:"vec3(0.)"}; }
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
`,H=`
void main(){
  vec2 uv = vUv;
  vec3 c = step(.999, max(uPin, uPout)) > .5 ? vec3(0.) : look(uv);
  if (uPin > .001) c = mix(c, pivotIn(uv), uPin);
  if (uPout > .001) c = mix(c, pivotOut(uv), uPout);
  gl_FragColor = vec4(finish(c), 1.);
}`,Q=typeof location<"u"&&new URLSearchParams(location.search).has("nopivot"),J=(()=>{const o=new z(new Uint8Array([0,0,0,255]),1,1);return o.needsUpdate=!0,o})();function oe(o,t){const a=new y,e=t.noWorld?null:new $(2,2,{type:S,samples:t.msaa===!1||!o.quality?0:4,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:t.mips===!1?w:F,magFilter:w,generateMipmaps:t.mips!==!1}),r={tWorld:{value:e?.texture??J},uRes:{value:new g(2,2)},uWorldRes:{value:new g(2,2)},uCss:{value:new g(2,2)},uTime:{value:0},uKeep:{value:t.keep??.3},uCa:{value:.0025},uAsp:{value:1},uPin:{value:t.pin?1:0},uPout:{value:0},...t.uniforms},i=new k({vertexShader:V,fragmentShader:Y(t.pin,t.pout)+t.frag+H,uniforms:r,depthTest:!1,depthWrite:!1}),v=new A(new P(2,2),i);v.frustumCulled=!1;const f=new y;f.add(v);const m=new j;function x(){const{width:n,height:l,dpr:s,aspect:c}=o.viewport,[d,p]=t.size?t.size(n,l,s):[Math.max(2,Math.round(n*s)),Math.max(2,Math.round(l*s))];e&&(e.width!==d||e.height!==p)&&e.setSize(d,p),r.uWorldRes.value.set(d,p),r.uRes.value.set(Math.round(n*s),Math.round(l*s)),r.uCss.value.set(n,l),r.uAsp.value=c}function u(n,l=a,s=0){if(!e)return;const c=o.renderer,d=c.getRenderTarget(),p=c.getClearAlpha();c.getClearColor(m),c.setRenderTarget(e),c.setClearColor(s,1),c.clear(!0,!0,!0),c.render(l,n),c.setRenderTarget(d),c.setClearColor(m,p)}async function q(n,l=a){const s=o.renderer,c=s.getRenderTarget();e&&(s.setRenderTarget(e),await s.compileAsync(l,n).catch(()=>{}),s.setRenderTarget(c),l.traverse(d=>{const p=d.material;for(const O of Object.values(p?.uniforms??{})){const h=O?.value;h?.isTexture&&!h.isRenderTargetTexture&&h.image&&!h.isVideoTexture&&s.initTexture(h)}}),u(n,l)),await s.compileAsync(f,n).catch(()=>{})}x();const T=t.inW??.05,_=t.outW??.05;return{scene:f,world:a,rt:e,U:r,resize:x,draw:u,warm:q,tick(n,l){r.uTime.value=I(n),r.uCa.value=(.0025+Math.min(Math.abs(l),4)*.006)*.65},setP(n){if(Q){r.uPin.value=0,r.uPout.value=0;return}r.uPin.value=t.pin?1-C(0,T,n):0,r.uPout.value=t.pout?C(1-_,1,n):0},dispose(){e?.dispose(),i.dispose(),v.geometry.dispose()}}}function re(o,t){const a=o.viewport.portrait,e=document.createElement("video");e.muted=!0,e.playsInline=!0,e.preload="auto",e.crossOrigin="anonymous",e.setAttribute("playsinline",""),e.setAttribute("muted",""),e.src=`${o.base.replace(/\/$/,"")}/editions/ice/${t}-${a?"phone":"desk"}.mp4`;const r=new W(e);r.colorSpace=D,r.generateMipmaps=!1;const i=30;let v=0,f=!1;const m=()=>{f=!0,e.currentTime=v};e.addEventListener("seeked",()=>{r.needsUpdate=!0,Math.abs(e.currentTime-v)>.5/i?m():f=!1});const x=new Promise(u=>{e.readyState>=2&&u(),e.addEventListener("loadeddata",()=>{e.play().then(()=>e.pause(),()=>{}).finally(()=>{r.needsUpdate=!0,u()})},{once:!0}),e.addEventListener("error",()=>u(),{once:!0})});return{tex:r,video:e,ready:x,get aspect(){return e.videoWidth?e.videoWidth/e.videoHeight:a?390/844:16/9},set(u){this.frame(Math.min(Math.max(u,0),1)*Math.max(0,this.frames-1))},get frames(){return Math.round((e.duration||0)*i)},frame(u){e.duration&&(v=Math.min(Math.max(u,0)/i,Math.max(0,e.duration-1/i)),!f&&Math.abs(e.currentTime-v)>.5/i&&m())},dispose(){e.removeAttribute("src"),e.load(),r.dispose()}}}function ae(o){const t={tPlate:{value:o.tex},uFit:{value:new g(1,1)},uGain:{value:1}},a=new k({uniforms:t,depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .99999, 1.); }",fragmentShader:`uniform sampler2D tPlate; uniform vec2 uFit; uniform float uGain; varying vec2 vUv;
      vec3 lin(vec3 c){ return mix(c / 12.92, pow((c + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
      void main(){ gl_FragColor = vec4(lin(texture2D(tPlate, (vUv - .5) * uFit + .5).rgb) * uGain, 1.); }`}),e=new A(new P(2,2),a);return e.frustumCulled=!1,e.renderOrder=-10,{mesh:e,fit(r){const i=o.aspect;t.uFit.value.set(r>i?1:r/i,r>i?i/r:1)},gain(r){t.uGain.value=r},dispose(){a.dispose(),e.geometry.dispose()}}}export{ae as a,te as b,ee as i,re as p,oe as s};
