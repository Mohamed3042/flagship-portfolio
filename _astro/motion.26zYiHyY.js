import{u as H,V as ce,S as Q,q as ue,y as I,aY as re,H as ve,s as T,i as W,M as B,a as V,C as fe,a6 as J,x as se,bu as de,a1 as pe,az as he,aS as ie,aF as me,ao as xe,aq as ge,t as N,a0 as be}from"./EditionWorld.astro_astro_type_script_index_0_lang.2KBVOvcs.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ye=`
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
`,ke=`
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
}`,ee=(o,e)=>{const s=e.length,a=e.map(([t,r])=>`vec2(${t.toFixed(3)},${r.toFixed(3)})`).join(",");return`const vec2 ${o}[${s}] = vec2[${s}](${a});
float sd_${o}(vec2 p){
  float d = dot(p - ${o}[0], p - ${o}[0]), s = 1.;
  for (int i = ZERO, j = ${s-1}; i < ${s}; j = i, i++){
    vec2 e = ${o}[j] - ${o}[i], w = p - ${o}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${o}[i].y, p.y < ${o}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`},qe=`${ee("MKM",H[0])}
${ee("MKK",H[1])}
float sdMK(vec2 p){ p += vec2(1.935, 1.); return min(sd_MKM(p), sd_MKK(p)); }`,Ce=`
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
`,Pe={ICE:`
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
}`},X={mono:'"Space Grotesk Variable", system-ui, sans-serif',sans:'"Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif'},ne=()=>new URLSearchParams(location.search),te=ne().get("mt"),Se=o=>te!==null?Number(te):o;typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;function Ue(){const o=ne().get("intro");let e=-1,s=-1,a=0;return(t,r)=>{const x=window.__iceIntro;return x!==void 0?Number(x):o!==null?Number(o):(s<0&&(s=t),e<0&&(a=r<.04?a+1:0,(a>=8||t-s>2.5)&&(e=t)),e<0?0:t-e)}}new ce;const Te="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",Le=(o,e)=>`
uniform sampler2D tWorld; uniform vec2 uRes, uWorldRes, uCss; uniform float uTime, uKeep, uCa, uAsp, uPin, uPout;
varying vec2 vUv;
${ye}
${we}
${ke}
${qe}
${Ce}
${[...new Set([o,e].filter(Boolean))].map(s=>Pe[s]).join(`
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
`,Ee=`
void main(){
  vec2 uv = vUv;
  vec3 c = step(.999, max(uPin, uPout)) > .5 ? vec3(0.) : look(uv);
  if (uPin > .001) c = mix(c, pivotIn(uv), uPin);
  if (uPout > .001) c = mix(c, pivotOut(uv), uPout);
  gl_FragColor = vec4(finish(c), 1.);
}`,Re=typeof location<"u"&&new URLSearchParams(location.search).has("nopivot"),Ae=(()=>{const o=new se(new Uint8Array([0,0,0,255]),1,1);return o.needsUpdate=!0,o})();function $e(o,e){const s=new Q,a=e.noWorld?null:new ue(2,2,{type:ve,samples:e.msaa===!1||!o.quality?0:4,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:e.mips===!1?I:re,magFilter:I,generateMipmaps:e.mips!==!1}),t={tWorld:{value:a?.texture??Ae},uRes:{value:new T(2,2)},uWorldRes:{value:new T(2,2)},uCss:{value:new T(2,2)},uTime:{value:0},uKeep:{value:e.keep??.3},uCa:{value:.0025},uAsp:{value:1},uPin:{value:e.pin?1:0},uPout:{value:0},...e.uniforms},r=new W({vertexShader:Te,fragmentShader:Le(e.pin,e.pout)+e.frag+Ee,uniforms:t,depthTest:!1,depthWrite:!1}),x=new B(new V(2,2),r);x.frustumCulled=!1;const y=new Q;y.add(x);const f=new fe;function S(){const{width:l,height:h,dpr:d,aspect:i}=o.viewport,[v,L]=e.size?e.size(l,h,d):[Math.max(2,Math.round(l*d)),Math.max(2,Math.round(h*d))];a&&(a.width!==v||a.height!==L)&&a.setSize(v,L),t.uWorldRes.value.set(v,L),t.uRes.value.set(Math.round(l*d),Math.round(h*d)),t.uCss.value.set(l,h),t.uAsp.value=i,t.uTall&&(t.uTall.value=o.viewport.portrait?1:0)}function k(l,h=s,d=0){if(!a)return;const i=o.renderer,v=i.getRenderTarget(),L=i.getClearAlpha();i.getClearColor(f),i.setRenderTarget(a),i.setClearColor(d,1),i.clear(!0,!0,!0),i.render(h,l),i.setRenderTarget(v),i.setClearColor(f,L)}async function O(l,h=s){const d=o.renderer,i=d.getRenderTarget();a&&(d.setRenderTarget(a),await d.compileAsync(h,l).catch(()=>{}),d.setRenderTarget(i),h.traverse(v=>{const L=v.material;for(const F of Object.values(L?.uniforms??{})){const P=F?.value;P?.isTexture&&!P.isRenderTargetTexture&&P.image&&!P.isVideoTexture&&d.initTexture(P)}}),k(l,h)),await d.compileAsync(y,l).catch(()=>{})}S();const q=e.inW??.05,g=e.outW??.05;return{scene:y,world:s,rt:a,U:t,resize:S,draw:k,warm:O,tick(l,h){t.uTime.value=Se(l),t.uCa.value=(.0025+Math.min(Math.abs(h),4)*.006)*.65},setP(l){if(t.uP&&(t.uP.value=l),Re){t.uPin.value=0,t.uPout.value=0;return}t.uPin.value=e.pin?1-J(0,q,l):0,t.uPout.value=e.pout?J(1-g,1,l):0},dispose(){a?.dispose(),r.dispose(),x.geometry.dispose()}}}function ze(o,e){let s=o.viewport.portrait;const a=i=>`${o.base.replace(/\/$/,"")}/editions/ice/${e}-${i?"phone":"desk"}.mp4`,t=document.createElement("video");t.muted=!0,t.playsInline=!0,t.preload="auto",t.crossOrigin="anonymous",t.setAttribute("playsinline",""),t.setAttribute("muted","");const r=new de(t);r.colorSpace=pe,r.generateMipmaps=!1;const x=i=>{const v=new he().load(a(i).replace(/\.mp4$/,".webp"));return v.colorSpace=ie,v.generateMipmaps=!1,v.minFilter=I,v};let y=x(s),f=!1;t.addEventListener("loadeddata",()=>{f=!0});const S=30;let k=0,O=!1;const q=()=>{O=!0,t.currentTime=k};t.addEventListener("seeked",()=>{r.needsUpdate=!0,Math.abs(t.currentTime-k)>.5/S?q():O=!1}),t.style.cssText="position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;pointer-events:none;z-index:-1",t.setAttribute("aria-hidden","true"),document.body.append(t);const g=()=>t.play().then(()=>{t.pause(),r.needsUpdate=!0});let l="";const h=i=>fetch(a(i)).then(v=>{if(!v.ok)throw new Error(String(v.status));return v.blob()}).then(v=>{i===s&&(l&&URL.revokeObjectURL(l),l=URL.createObjectURL(v),t.src=l)}).catch(()=>{i===s&&(t.src=a(i))}).then(()=>{i===s&&g().catch(()=>addEventListener("pointerup",()=>g().catch(()=>{}),{once:!0,capture:!0}))});h(s);const d=new Promise(i=>{t.addEventListener("loadeddata",()=>{r.needsUpdate=!0,i()},{once:!0}),t.addEventListener("error",()=>i(),{once:!0}),setTimeout(i,8e3)});return{tex:r,video:t,ready:d,get aspect(){return t.videoWidth?t.videoWidth/t.videoHeight:s?720/1208:16/9},get poster(){return y},get live(){return f},set(i){this.frame(Math.min(Math.max(i,0),1)*Math.max(0,this.frames-1))},get frames(){return Math.round((t.duration||0)*S)},frame(i){t.duration&&(k=Math.min(Math.max(i,0)/S,Math.max(0,t.duration-1/S)),!O&&Math.abs(t.currentTime-k)>.5/S&&q())},orient(){return o.viewport.portrait===s?!1:(s=o.viewport.portrait,O=!1,f=!1,y.dispose(),y=x(s),t.addEventListener("loadeddata",()=>{r.needsUpdate=!0},{once:!0}),h(s),!0)},get tall(){return s},dispose(){t.removeAttribute("src"),t.load(),t.remove(),r.dispose(),y.dispose(),l&&URL.revokeObjectURL(l)}}}function Ge(o){const e={tPlate:{value:o.tex},tStill:{value:o.poster},uLive:{value:0},uFit:{value:new T(1,1)},uGain:{value:1}},s=new W({uniforms:e,depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .99999, 1.); }",fragmentShader:`uniform sampler2D tPlate, tStill; uniform vec2 uFit; uniform float uGain, uLive; varying vec2 vUv;
      vec3 lin(vec3 c){ return mix(c / 12.92, pow((c + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
      void main(){
        vec2 uv = (vUv - .5) * uFit + .5;
        vec3 c = uLive > .5 ? texture2D(tPlate, uv).rgb : texture2D(tStill, uv).rgb;
        gl_FragColor = vec4(lin(c) * uGain, 1.);
      }`}),a=new B(new V(2,2),s);return a.frustumCulled=!1,a.renderOrder=-10,{mesh:a,fit(t){const r=o.aspect;e.uFit.value.set(t>r?1:t/r,t>r?r/t:1),e.uLive.value=o.live?1:0,e.tStill.value=o.poster},gain(t){e.uGain.value=t},dispose(){s.dispose(),a.geometry.dispose()}}}const Oe=["carve","frost","aurora","etch"],De=["shatter","sublimate","lift","melt"],_e=`uniform vec2 uC, uH, uShift; uniform float uScale; varying vec2 vUv, vScr;
  void main(){ vUv = uv; vec2 q = uC + position.xy * uH * uScale + uShift; vScr = q * .5 + .5; gl_Position = vec4(q, 0., 1.); }`,Me=`
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
}`,oe=(()=>{const o=new se(new Uint8Array([0,0,0,255]),1,1);return o.needsUpdate=!0,o})(),K=(o,e,s)=>{const a=Math.min(1,Math.max(0,(s-o)/(e-o)));return a*a*(3-2*a)};function ae(o,e,s){const a=o.lang==="ar",t=e.font==="mono"?a?X.ar:X.mono:a?X.ar:X.sans,r=e.weight??(e.font==="mono"?500:e.font==="text"?400:600),x=a?0:e.track??0,y=e.lead??1.12,f={tText:{value:oe},tPlate:{value:s?.tex??oe},uFit:s?.fit??{value:new T(1,1)},uTexel:{value:new T(1,1)},uSrc:{value:new T(.5,.5)},uC01:{value:new T(.5,.5)},uC:{value:new T},uH:{value:new T(1,1)},uShift:{value:new T},uScale:{value:1},uR:{value:0},uX:{value:0},uRtl:{value:a?1:0},uTime:{value:0},uDim:{value:1},uAsp:{value:1},uSpark:{value:1}},S=new W({vertexShader:_e,fragmentShader:Me,uniforms:f,transparent:!0,depthTest:!1,depthWrite:!1,blending:ge,blendSrc:xe,blendDst:me,defines:{TRICK:Oe.indexOf(e.trick),EXIT:De.indexOf(e.exit??(e.trick==="carve"?"shatter":e.trick==="aurora"?"lift":e.trick==="etch"?"melt":"sublimate"))}}),k=new B(new V(2,2),S);k.frustumCulled=!1,k.renderOrder=5,k.visible=!1;const O=new N;let q=e.text,g=null,l=0,h=1,d=1,i=1,v=0,L=!1;function F(n,u){const c=(Array.isArray(q)?q:[q]).map(m=>e.upper&&!a?m.toUpperCase():m),C=e.wrap?.[o.viewport.portrait?"tall":"wide"];if(!C)return c;const b=[];for(const m of c){let p="";for(const w of m.split(" ")){const E=p?`${p} ${w}`:w;p&&n.measureText(E).width>C*u?(b.push(p),p=w):p=E}p&&b.push(p)}return b}let P=null;function Y(n){const u=document.createElement("canvas"),c=u.getContext("2d"),C=A=>{c.font=`${r} ${Math.round(n*A)}px ${t}`,c.letterSpacing=`${x*n*A}px`};C(1);let b=F(c,n),m=Math.max(...b.map(A=>c.measureText(A).width)),p=1;const w=Math.ceil(n*.5);m+w*2>4096&&(p=(4096-w*2)/m,C(p),b=F(c,n*p),m=Math.max(...b.map(A=>c.measureText(A).width)));const E=Math.ceil(m+w*2),D=Math.ceil(n*p*(y*(b.length-1)+1.25)+w*2),M=P&&g&&P.width===E&&P.height===D,R=M?P.getContext("2d"):c;M?(R.clearRect(0,0,E,D),R.font=c.font,R.letterSpacing=c.letterSpacing):(u.width=E,u.height=D,C(p)),R.fillStyle="#fff",R.textBaseline="alphabetic",R.direction=a?"rtl":"ltr",R.textAlign=a?"right":"left",b.forEach((A,$)=>R.fillText(A,a?E-w:w,w+n*p*(.95+y*$))),M?g.needsUpdate=!0:(g?.dispose(),P=u,g=new be(u),g.colorSpace=ie,g.minFilter=re,g.generateMipmaps=!0,g.anisotropy=4);const _=P;f.tText.value=g,f.uTexel.value.set(1/_.width,1/_.height),h=_.width,d=_.height,i=n*p,l=n,v=w,L=o.viewport.portrait}const Z=()=>!!e.only&&e.only!==(o.viewport.portrait?"tall":"wide");async function le(){if(Z())return;const n=o.viewport.portrait,{height:u,dpr:c}=o.viewport,C=Math.min(420,Math.max(14,Math.round(e.size[n?"tall":"wide"]*u*c)));if(g&&Math.abs(C/l-1)<.2&&L===n)return U();const b=Array.isArray(q)?q.join(" "):q;await Promise.race([document.fonts?.load(`${r} ${C}px ${t}`,b),new Promise(m=>setTimeout(m,2500))]).catch(()=>{}),Y(C),U()}function U(){const n=o.viewport.portrait,{width:u,height:c}=o.viewport;let b=e.size[n?"tall":"wide"]*c/i,m=(h-v*2)*b;const p=(e.maxW??.9)*u;m>p&&(b*=p/m,m=p);const w=h*b,E=d*b,D=(d-v*2)*b,[M,R]=e.at[n?"tall":"wide"],[_,A]=e.pin??[0,.5],$=(a?1-M:M)*u,z=a?$-(.5-_)*m:$+(.5-_)*m,G=R*c+(.5-A)*D;f.uAsp.value=w/E,O.set((z-m/2)/u,1-(G+D/2)/c,(z+m/2)/u,1-(G-D/2)/c),f.uSpark.value=e.size[n?"tall":"wide"]>=.03?1:0,f.uC.value.set(z/u*2-1,1-G/c*2),f.uH.value.set(w/u,E/c),f.uC01.value.set(z/u,1-G/c);const j=e.src?.[n?"tall":"wide"];j&&f.uSrc.value.set(j[0],j[1])}return{mesh:k,spec:e,ensure:le,layout:U,ink:O,drive(n,u,c){f.uR.value=n,f.uX.value=u,f.uTime.value=c,k.visible=n>.001&&u<.999&&!!g&&!Z(),f.uScale.value=e.trick==="carve"?(1.05-.05*K(0,1,n))*(1+.2*u*u):1,f.uShift.value.set(0,e.exit==="sublimate"||!e.exit&&e.trick==="frost"?u*.03:0)},at(n,u){const c=e.in?K(e.in[0],e.in[1],n):1,C=e.out?K(e.out[0],e.out[1],n):0;this.drive(c,C,u)},async setText(n){String(n)!==String(q)&&(q=n,l&&(Y(l),U()))},dispose(){g?.dispose(),S.dispose(),k.geometry.dispose()}}}async function Xe(o,e,s,a){const t=s.map(r=>ae(o,r,a));await Promise.all(t.map(r=>r.ensure()));for(const r of t)e.add(r.mesh);return{list:t,async add(r){const x=ae(o,r,a);return await x.ensure(),e.add(x.mesh),t.push(x),x},remove(r){e.remove(r.mesh),r.dispose(),t.splice(t.indexOf(r),1)},update(r,x){for(const y of t)(y.spec.in||y.spec.out)&&y.at(r,x)},resize(){for(const r of t)r.ensure()},dispose(){for(const r of t)e.remove(r.mesh),r.dispose()}}}const je=`
uniform float uP, uTall, uDir; uniform vec4 uInk, uK;
#define PXL (1. / uCss.y)
float E(float a, float b, float x){ float t = clamp((x - a) / (b - a), 0., 1.); return t * t * (3. - 2. * t); }
vec2 Q(vec2 uv){ return (uv - .5) * vec2(uAsp, 1.); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0., 1.); return length(pa - ba * h); }
// a stroke w px either side, antialiased over one px; a glow falling off over r px
float ink(float d, float w){ return clamp(w + .5 - d / PXL, 0., 1.); }
float glow(float d, float r){ return exp(-d / (r * PXL)); }
// the side instruments' inset from the view's edge (the desktop dock sits at mid-height on the right)
#define EDGE ((uTall > .5 ? 28. : 84.) * PXL)
// soft inside-ness of the ink box b (uv), padded by pad
float inBox(vec2 uv, vec4 b, float pad){ return smoothstep(b.x - pad, b.x, uv.x) * smoothstep(b.z + pad, b.z, uv.x) * smoothstep(b.y - pad, b.y, uv.y) * smoothstep(b.w + pad, b.w, uv.y); }
// light that belongs to the footage: stronger where the picture is lit, held back in the black
float lit(vec3 c){ return .5 + 1.5 * smoothstep(.02, .4, luma(c)); }
const vec3 HOT = vec3(1.7, 1.42, 1.12);
// the beam: a hairline of gold with a near and a far glow
vec3 beam(float d, float w){ return C_GOLD * (ink(d, w + .25) * 1.8 + glow(d, 8.) * .55 + glow(d, 36.) * .16); }
// a hairline of cold light, for rulers and ticks that are not the beam
vec3 cold(float d, float w){ return C_FROST * (ink(d, w) * 1.1 + glow(d, 5.) * .18); }
// the beam's head: a white-hot point with a thin anamorphic flare
vec3 spark(vec2 p, vec2 h, float s){
  vec2 d = abs(p - h) / PXL; float r = length(d);
  return HOT * (exp(-r / (2.2 * s)) * 2.2 + exp(-r / (14. * s)) * .35 + exp(-d.y / 1.1) * exp(-d.x / (70. * s)) * .55);
}
// the footage's own contour lines: iso-lines of its softened brightness, slid by k
float contour(vec2 uv, float n, float k){
  float f = sqrt(luma(blurLod(uv, 2.))) * n + k, w = max(fwidth(f), 1e-4), e = abs(fract(f + .5) - .5);
  return (1. - smoothstep(w * .25, w * 1.1, e)) * smoothstep(.04, .3, luma(texture2D(tWorld, uv).rgb));
}
// a survey band at height y0, w tall (q units)
float band(float y, float y0, float w){ float t = (y - y0) / w; return exp(-t * t); }
// gold dust, twinkling (ambient: the only clock-driven part)
float dust(vec2 q, float density){
  vec2 g = q * 52., id = floor(g), f = fract(g) - .5; float h = h12(id);
  if (h > density) return 0.;
  vec2 o = (h22(id + 3.) - .5) * .7;
  return exp(-length(f - o) * 16.) * (.35 + .65 * (.5 + .5 * sin(uTime * (1.3 + h * 2.7) + h * 50.)));
}
`,Ke={mark:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv); float hw = uAsp * .5, y = uTall > .5 ? .2 : .25;
  float reach = E(.03, .36, uP), pinch = E(.58, .93, uP), on = E(.0, .04, uP);
  vec2 L = vec2(mix(-hw - .02, -.02, pinch), mix(y, -.02, pinch)), H = vec2(mix(-hw - .02, hw + .02, reach), y);
  H = mix(H, vec2(.02, -.02), pinch);
  float d = sdSeg(q, L, H);
  vec3 col = beam(d, .55 + pinch) * lit(c) * on * (1. + pinch * 1.5);
  col += spark(q, H, 1. + pinch * 1.6) * on * (reach < .999 || pinch > .01 ? 1. : .35);
  // the survey: a band slides down the block and leaves its contour lines in the ice
  float y0 = mix(.42, -.04, E(.08, .44, uP)), b = band(q.y, y0, .045) * (1. - E(.42, .5, uP)) * E(.06, .1, uP);
  col += mix(C_CYAN, C_FROST, .4) * contour(uv, 7., 0.) * b * .7 + C_CYAN * glow(abs(q.y - y0), 1.5) * b * .5;
  col += C_GOLD * dust(q + vec2(0., uP * .08), .1) * glow(abs(q.y - y), 140.) * on * 1.4;
  return c + col;
}`,night:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv); float hw = uAsp * .5;
  vec2 P = vec2(0., uTall > .5 ? -.05 : -.035); float rx = hw * 1.05, ry = uTall > .5 ? .052 : .075;
  float on = E(.06, .14, uP) * (1. - E(.84, .98, uP)), reach = E(.08, .4, uP), spread = E(.16, .5, uP), spin = uP * .5;
  vec2 e = (q - P) / vec2(rx, ry); float r = max(length(e), 1e-4);
  vec2 g = vec2(e.x / rx, e.y / ry) / r; float d = abs(r - 1.) / max(length(g), 1e-4);
  float th = atan(e.y, e.x), dth = abs(mod(th + 1.5708 + 3.14159, 6.28318) - 3.14159);   // from the near side
  vec3 col = beam(d, .5) * step(dth, reach * 3.1416) * lit(c);
  for (int k = ZERO; k < 2; k++){   // the two heads running round
    float a = -1.5708 + (k == 0 ? 1. : -1.) * reach * 3.1416;
    col += spark(q, P + vec2(cos(a) * rx, sin(a) * ry), .8) * (1. - E(.92, 1., reach));
  }
  // meridians: twelve lines from the pole out past the ring, in the ice's perspective
  float m = 0.;
  for (int k = ZERO; k < 12; k++){
    float a = float(k) * .5236 + spin;
    vec2 tip = P + vec2(cos(a) * rx, sin(a) * ry) * (1. + (sin(a) > 0. ? 2.4 : .45) * spread);   // (the near side stays short: the words are there)
    m = max(m, ink(sdSeg(q, P, mix(P, tip, spread)), .35) * (.55 + .45 * smoothstep(-.2, .3, -sin(a))));
  }
  col += C_FROST * m * .5 * lit(c) * spread;
  col += spark(q, P, 1.3) * (.6 + .4 * sin(uTime * 2.1)) * E(.1, .2, uP);
  col *= on * (1. - .85 * inBox(uv, uInk, .015) * (1. - E(.6, .7, uP)));   // (behind "90° N" while it stands)
  // "Polar night": a band climbs the aurora and leaves its contour lines in the curtain
  float y0 = mix(-.12, .52, E(.58, .86, uP)), b = band(q.y, y0, .06) * E(.56, .6, uP) * (1. - E(.86, .95, uP));
  col += mix(vec3(.15, 1., .7), C_CYAN, .5) * contour(uv, 8., 0.) * b * .6;
  col += C_GOLD * dust(q, .06) * glow(d, 60.) * on;
  return c + col;
}`,floes:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv); float hw = uAsp * .5, n = uK.x, x = uDir * (hw - EDGE), ya = .3, yb = -.24;
  float on = E(.02, .07, uP) * (1. - E(.93, .985, uP));
  float at = clamp((uP - uK.y) / (uK.z - uK.y), 0., 1.), yh = mix(ya, yb, at), sp = (ya - yb) / (n - 1.), f = at * (n - 1.);
  float i = clamp(floor((ya - q.y) / sp + .5), 0., n - 1.), ty = ya - i * sp;
  float passed = step(i, f + .5), cur = 1. - smoothstep(.2, .55, abs(i - f));
  float len = (5. + 3. * passed + 12. * cur) * PXL, inward = -uDir * (q.x - x);   // ticks reach in toward the picture
  vec3 col = mix(C_FROST * .8, C_GOLD * 1.7, max(passed, cur)) * ink(abs(q.y - ty), .5) * step(-1.5 * PXL, inward) * step(inward, len);
  float inside = step(yb - 2. * PXL, q.y) * step(q.y, ya + 2. * PXL);
  col += mix(cold(abs(q.x - x), .45) * .7, beam(abs(q.x - x), .6) * 1.2, step(yh, q.y)) * inside;
  col += spark(q, vec2(x, yh), 1.);
  return c + col * on;
}`,crevasse:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv); float hw = uAsp * .5, x = uDir * (hw - EDGE);
  float on = E(.04, .12, uP) * (1. - E(.9, .99, uP)), yh = mix(.36, uTall > .5 ? -.24 : -.38, E(.06, .96, uP));
  float d = abs(q.x - x), top = .4;
  vec3 col = beam(d, .5) * step(yh, q.y) * step(q.y, top) * lit(c);
  float sp = 24. * PXL, f = (q.y + uP * .9) / sp, e = abs(fract(f + .5) - .5) * sp, big = 1. - step(.01, fract(floor(f + .5) / 5. + .001));
  float tl = (big > .5 ? 12. : 6.) * PXL;
  col += cold(e, .45) * step(abs(q.x - x - uDir * tl * .5), tl * .5) * step(-.42, q.y) * step(q.y, top) * .9;
  col += spark(q, vec2(x, yh), 1.1);
  float b = band(q.y, yh, .06) * smoothstep(-.02, .16, uDir * q.x);   // (the gauge's side: the words are on the other)
  col += C_CYAN * contour(uv, 7., uP * 1.5) * b * .55;
  col += C_GOLD * dust(q + vec2(0., -uP * .3), .08) * glow(abs(q.y - yh), 200.) * .8;
  return c + col * on;
}`,core:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv); float hw = uAsp * .5, n = uK.x, x = uDir * (hw - EDGE), ya = .3, yb = uTall > .5 ? -.22 : -.3;
  float on = E(.03, .09, uP) * (1. - E(.9, .97, uP)), at = clamp((uP - uK.y) / (uK.z - uK.y), 0., 1.), yh = mix(ya, yb, at);
  vec3 col = mix(cold(abs(q.x - x), .5) * .8, beam(abs(q.x - x), .7) * 1.3, step(yh, q.y)) * step(yb, q.y) * step(q.y, ya);
  float sp = (ya - yb) / (n - 1.), i = clamp(floor((ya - q.y) / sp + .5), 0., n - 1.);
  vec2 node = vec2(x, ya - i * sp);
  float rd = length(q - node), k = i / (n - 1.), passed = step(k, at + .001), cur = 1. - smoothstep(.15, .5, abs(i - at * (n - 1.)));
  float R = (5. + 4. * cur) * PXL;
  col += mix(C_FROST, C_GOLD * 1.8, max(passed, cur)) * (ink(abs(rd - R), .7) + passed * ink(rd, 2.6)) + C_GOLD * glow(rd, 9.) * cur * .8;
  col += spark(q, vec2(x, yh), .8 + .6 * cur);
  // the leader, from the year in front in toward the core
  vec2 a = vec2(x - uDir * 14. * PXL, yh), b = vec2(x - uDir * 64. * PXL, yh);
  float lead = sdSeg(q, a, b);
  col += C_GOLD * ink(lead, .4) * 1.2;
  // the survey band sweeps across the core once a year, leaving its rings as lines
  float xs = mix(-hw, hw, fract(at * (n - 1.) + .05)), bb = exp(-pow((q.x - xs) / .05, 2.));
  col += mix(C_CYAN, C_FROST, .3) * contour(uv, 9., 0.) * bb * .45;
  return c + col * on;
}`,climb:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv); float hw = uAsp * .5, x = uDir * (hw - EDGE);
  float on = E(.1, .18, uP) * (1. - E(.94, .995, uP));
  float snow = smoothstep(.18, .55, luma(c)), cl = contour(uv, 10., -uP * 4.);
  vec3 col = mix(C_GOLD, C_FROST, .35) * cl * snow * .5;
  float sp = 18. * PXL, f = (q.y - uP * 1.4) / sp, e = abs(fract(f + .5) - .5) * sp, big = 1. - step(.01, fract(floor(f + .5) / 5. + .001));
  float tl = (big > .5 ? 13. : 6.) * PXL;
  float rule = step(abs(q.x - x - uDir * tl * .5), tl * .5) * step(-.32, q.y) * step(q.y, .32);
  col += cold(e, .45) * rule * (1. - smoothstep(.22, .32, abs(q.y))) * .9;
  // the marker: a short beam pointing at the ruler at the centre line, its head on the ruler
  float m = sdSeg(q, vec2(x - uDir * 40. * PXL, 0.), vec2(x, 0.));
  col += beam(m, .5) + spark(q, vec2(x, 0.), .9);
  col += C_GOLD * dust(q + vec2(0., uP * .5), .05) * snow * .9;
  return c + col * on;
}`,summit:`
vec3 gfx(vec2 uv, vec3 c){
  vec2 q = Q(uv);
  vec2 i0 = Q(uInk.xy), i1 = Q(uInk.zw);
  float y = i0.y - 16. * PXL, draw = E(.4, .56, uP);
  float s = uDir > 0. ? i0.x : i1.x, t = uDir > 0. ? i1.x : i0.x, hx = mix(s, t, draw);
  float has = step(.001, uInk.z - uInk.x);
  vec3 col = (beam(sdSeg(q, vec2(s, y), vec2(hx, y)), .6) + spark(q, vec2(hx, y), 1.1) * (1. - E(.95, 1., draw)) + spark(q, vec2(hx, y), .5) * E(.95, 1., draw) * (.6 + .4 * sin(uTime * 1.7))) * has * E(.39, .41, uP);
  float y0 = mix(.1, -.55, E(.0, .38, uP)), b = band(q.y, y0, .07);
  float cloud = smoothstep(.04, .3, luma(c)) * step(q.y, .12);
  col += C_GOLD * contour(uv, 9., 0.) * cloud * (b * 1.1 + .12 * E(.2, .4, uP));
  col += C_GOLD * dust(q + vec2(0., -uP * .25), .07) * (.3 + .7 * E(.3, .6, uP)) * 1.2;
  return c + col;
}`},Ie=o=>`
vec3 look(vec2 uv){ vec3 b = bloom(uv); return gfx(uv, samp(uv) + b * smoothstep(.04, .35, luma(b)) * ${o.toFixed(3)}); }`,Ne=(o,e=[0,0,0,0])=>({uP:{value:0},uTall:{value:o.viewport.portrait?1:0},uDir:{value:o.lang==="ar"?-1:1},uInk:{value:new N},uK:{value:new N(...e)}});export{je as M,Ke as S,Ge as a,Ie as b,Se as c,Ue as i,Ne as m,ze as p,$e as s,Xe as w};
