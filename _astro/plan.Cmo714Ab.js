import{u as b,S as y,q,aD as S,y as k,aY as P,H as $,s as m,i as L,M as N,a as D,C as A,I as M}from"./EditionWorld.astro_astro_type_script_index_0_lang.C5-V8Ssb.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const F=`
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
vec3 S(vec3 c){ return pow(c, vec3(2.2)); }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
float bayer(vec2 p){ p = floor(mod(p, 4.)); return (mod(p.x * 4. + p.y * 8. + mod(p.x * p.y, 2.) * 3., 16.) + .5) / 16.; }
`,O=`
vec3 invNeutral(vec3 o){
  const float S0 = .76, D = .24;
  // the forward map pulls bright colours toward white; a saturated colour above ~.8 has no preimage, so it is scaled down
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
}`,T=(t,e)=>{const o=e.length,a=e.map(([r,p])=>`vec2(${r.toFixed(3)},${p.toFixed(3)})`).join(",");return`const vec2 ${t}[${o}] = vec2[${o}](${a});
float sd_${t}(vec2 p){
  float d = dot(p - ${t}[0], p - ${t}[0]), s = 1.;
  for (int i = 0, j = ${o-1}; i < ${o}; j = i, i++){
    vec2 e = ${t}[j] - ${t}[i], w = p - ${t}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${t}[i].y, p.y < ${t}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`},E=`${T("MKM",b[0])}
${T("MKK",b[1])}
float sdMK(vec2 p){ p += vec2(1.935, 1.); return min(sd_MKM(p), sd_MKK(p)); }`,K=`
// 1: the arcade's blocks (a 12-row grid): indigo into violet, a few cells lit hot
vec3 pivot1(vec2 uv, float asp){
  vec2 n = vec2(floor(12. * asp + .5), 12.), id = floor(uv * n), c = (id + .5) / n;
  float h = h12(id + 3.7), g = h12(id + 17.3);
  vec3 col = mix(S(vec3(.06, .03, .2)), S(vec3(.25, .06, .42)), clamp(c.y * .75 + h * .25, 0., 1.));
  vec3 hot = h < .25 ? S(vec3(1., .18, .58)) : h < .5 ? S(vec3(1., .62, .11)) : h < .75 ? S(vec3(.18, .89, .9)) : S(vec3(1., .82, .25));
  return mix(col, hot * (.7 + .3 * g), step(.87, g));
}
// the mosaic hand-over: q 0..1 how far the picture has broken into blocks (1 = pivot1's grid), m 0..1 how far the blocks
// have taken pivot1's colours (cell by cell, staggered)
vec3 mosaic(sampler2D t, vec2 uv, float asp, float worldH, float q, float m){
  float k = floor(3.99 * (1. - q) + .0001);
  vec2 n = vec2(floor(12. * asp + .5), 12.) * exp2(k), id = floor(uv * n), cuv = (id + .5) / n;
  float lod = max(0., log2(worldH / n.y));
  vec3 c = textureLod(t, cuv, lod).rgb;
  float h = h12(floor(uv * vec2(floor(12. * asp + .5), 12.)) + 5.3);
  float w = smoothstep(0., .3, m * 1.3 - h * .3);
  return mix(c, pivot1(uv, asp), w);
}
// 2: white, spokes in black, the mark in black with a white gap round it; ph re-rolls the spokes (12 fps in the anime)
vec3 pivot2(vec2 uv, float asp, float ph){
  vec2 p = (uv - .5) * vec2(asp, 1.);
  float a = atan(p.y, p.x) / 6.28318 + .5, r = length(p), N = 72.;
  float cell = floor(a * N), fa = fract(a * N), hh = h12(vec2(cell, ph));
  float inner = mix(.2, .34, h12(vec2(cell, ph + 9.)));
  float hw = (.12 + .38 * hh * hh) * smoothstep(inner, inner + .6, r);
  float aaw = N / 6.28318 * fwidth(uv.y) / max(r, .01) * 1.2;
  float spoke = smoothstep(hw + aaw, hw - aaw, abs(fa - .5)) * smoothstep(inner - .002, inner + .002, r);
  float d = sdMK(rot(.14) * p / .205), px = fwidth(uv.y) / .205 * 1.2;
  spoke *= smoothstep(.12, .3, d);
  return mix(vec3(1. - spoke), vec3(0.), smoothstep(px, -px, d));
}
// 3: cream paper and nine inked lines; b = 0 radial speed lines, b = 1 the wavy motion lines of a character zipping off
vec3 paper3(vec2 uv, float asp, float xoff){
  vec2 p = (uv - .5) * vec2(asp, 1.); p.x += xoff;
  return mix(S(vec3(.98, .93, .8)), S(vec3(.92, .8, .58)), smoothstep(.45, 1.1, length(p - vec2(xoff, 0.))));
}
float lines3(vec2 uv, float asp, float b, float xoff){
  vec2 p = (uv - .5) * vec2(asp, 1.); p.x += xoff;
  float line = 0.;
  for (int i = 0; i < 9; i++){
    float fi = float(i), h = h12(vec2(fi, 4.2)), a = (fi / 9. + .04 * h) * 6.28318 + .3;
    vec2 dir = vec2(cos(a), sin(a));
    float y0 = -.4 + fi * .1 + (h - .5) * .03, xs = -asp * .5 - .05 + h * .22, len = asp * (.45 + .3 * h12(vec2(fi, 9.1)));
    vec2 prev = mix(dir * .22, vec2(xs, y0), b);
    float dmin = 9.;
    for (int k = 1; k <= 10; k++){
      float s = float(k) / 10.;
      vec2 c = mix(dir * (.22 + s * 1.1), vec2(xs + len * s, y0 + .02 * sin(s * 12. + fi * 1.7)), b);
      float w = .003 + .0075 * pow(max(sin(3.14159 * s), 0.), .6);
      dmin = min(dmin, sdSeg(p, prev, c) - w);
      prev = c;
    }
    line = max(line, smoothstep(.0015, -.0015, dmin));
  }
  return line;
}
vec3 pivot3(vec2 uv, float asp, float b, float xoff){ return mix(paper3(uv, asp, xoff), S(vec3(.13, .08, .07)), lines3(uv, asp, b, xoff)); }
// 4: foam: bubbles in three sizes on teal, a white head of foam at the top; ph lifts them
vec3 pivot4(vec2 uv, float asp, float ph){
  vec2 p = vec2(uv.x * asp, uv.y);
  vec3 col = mix(S(vec3(.0, .36, .5)), S(vec3(.35, .8, .86)), smoothstep(0., 1., uv.y * .9 + .05));
  vec3 foam = S(vec3(.86, 1., 1.));
  for (int L = 0; L < 3; L++){
    float fl = float(L), sc = 4.5 + fl * 4.2;
    vec2 q = p * sc - vec2(0., ph * (.8 + fl * .5)), id = floor(q), f = fract(q) - .5, j = (h22(id + fl * 13.) - .5) * .5;
    float r = .18 + .24 * h12(id + 5.5 + fl), d = length(f - j) - r, fill = smoothstep(.03, -.03, d);
    float rim = smoothstep(.06, .0, abs(d + .015)), hi = smoothstep(.06, .0, length(f - j - vec2(-.5, .55) * r) - r * .18);
    float alive = step(.28, h12(id + 91. + fl));
    col = mix(col, foam, fill * .42 * alive);
    col += foam * (rim * .55 + hi * .6) * alive;
  }
  float top = smoothstep(.62, 1., uv.y + (fbm(p * 3.) - .5) * .35);
  return mix(col, S(vec3(.95, 1., 1.)), top * .85);
}
// 5: golden hour: apricot into butter, a low sun's glow, soft bokeh discs; ph drifts them
vec3 pivot5(vec2 uv, float asp, float ph){
  vec3 col = mix(S(vec3(1., .58, .28)), S(vec3(1., .82, .48)), smoothstep(0., 1., uv.y * .85 + .12));
  col += S(vec3(1., .8, .5)) * exp(-length((uv - vec2(.5, .62)) * vec2(asp, 1.)) * 2.4) * .16;
  for (int i = 0; i < 24; i++){
    float fi = float(i); vec2 c = h22(vec2(fi, 3.1)); c = vec2(c.x * asp, fract(c.y + ph * (.02 + .02 * h11(fi))));
    float r = .035 + .07 * h11(fi * 7.3), d = length(vec2(uv.x * asp, uv.y) - c) / r;
    col += S(vec3(1., .84, .55)) * (smoothstep(1., .85, d) * .13 + smoothstep(.8, 1., d) * smoothstep(1.04, .96, d) * .09);
  }
  return col;
}
`,z="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",U=`
uniform sampler2D tWorld; uniform vec2 uRes, uWorldRes, uCss; uniform float uTime, uKeep, uCa, uAsp;
varying vec2 vUv;
${F}
${O}
${E}
${K}
// what the engine multiplies by next is undone (a breath of its vignette kept), then its tone map
vec3 finish(vec3 c){
  float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
  float post = .45 + .55 * vig;
  return invNeutral(max(c * mix(1., post, uKeep), 0.)) / post;
}
// the world, with the engine's colour parting (red out, blue in) sampled the other way round
vec3 samp(vec2 uv){ vec2 d = (uv - .5) * uCa; return vec3(texture2D(tWorld, uv - d).r, texture2D(tWorld, uv).g, texture2D(tWorld, uv + d).b); }
`;function W(t,e){const o=new y,a=new q(2,2,{type:$,samples:e.msaa===!1||!t.quality?0:4,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:e.mips?P:e.nearest?S:k,magFilter:e.nearest?S:k,generateMipmaps:!!e.mips}),r={tWorld:{value:a.texture},uRes:{value:new m(2,2)},uWorldRes:{value:new m(2,2)},uCss:{value:new m(2,2)},uTime:{value:0},uKeep:{value:.3},uCa:{value:.0025},uAsp:{value:1},...e.uniforms},p=new L({vertexShader:z,fragmentShader:U+e.frag,uniforms:r,depthTest:!1,depthWrite:!1}),h=new N(new D(2,2),p);h.frustumCulled=!1;const d=new y;d.add(h);const x=new A;function g(){const{width:n,height:s,dpr:c,aspect:i}=t.viewport,[f,l]=e.size?e.size(n,s,c):[Math.max(2,Math.round(n*c)),Math.max(2,Math.round(s*c))];(a.width!==f||a.height!==l)&&a.setSize(f,l),r.uWorldRes.value.set(f,l),r.uRes.value.set(Math.round(n*c),Math.round(s*c)),r.uCss.value.set(n,s),r.uAsp.value=i}function w(n,s=o,c=0){const i=t.renderer,f=i.getRenderTarget(),l=i.getClearAlpha();i.getClearColor(x),i.setRenderTarget(a),i.setClearColor(c,1),i.clear(!0,!0,!0),i.render(s,n),i.setRenderTarget(f),i.setClearColor(x,l)}async function C(n){const s=t.renderer,c=s.getRenderTarget();s.setRenderTarget(a),await s.compileAsync(o,n).catch(()=>{}),s.setRenderTarget(c),o.traverse(i=>{const f=i.material;for(const R of Object.values(f?.uniforms??{})){const u=R?.value;u?.isTexture&&!u.isRenderTargetTexture&&u.image&&!u.isVideoTexture&&s.initTexture(u)}const l=f?.map;l?.isTexture&&l.image&&s.initTexture(l)}),w(n)}return g(),{scene:d,world:o,rt:a,U:r,resize:g,draw:w,warm:C,tick(n,s){r.uTime.value=n,r.uCa.value=(.0025+Math.min(Math.abs(s),4)*.006)*.65},dispose(){a.dispose(),p.dispose(),h.geometry.dispose()}}}const V=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,v={x:0,y:0,t:-1};function H(t,e,o){if(v.t!==e){v.t=e;const a=t.pointer.inside&&!V;v.x=M(v.x,a?t.pointer.x:0,2.6,o),v.y=M(v.y,a?t.pointer.y:0,2.6,o)}return v}function G(){const t=new URLSearchParams(location.search).get("intro");let e=-1,o=-1,a=0;return(r,p)=>t!==null?Number(t):(o<0&&(o=r),e<0&&(a=p<.04?a+1:0,(a>=8||r-o>2.5)&&(e=r)),e<0?0:r-e)}async function _(t){try{await Promise.race([Promise.all(t.map(e=>document.fonts.load(e))),new Promise(e=>setTimeout(e,2500))])}catch{}}const B={mono:'"JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace',sans:'"Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif',serif:'"Fraunces Variable", Georgia, serif'},j={tty:24,arcade:110,anime:35,cartoon:36,reef:40,story:34};Object.values(j).reduce((t,e)=>t+e,0);const Y={title:3.4,first:6.6,step:5.2,mk:82.2,lock:83.4,round:87.8,fight:90.6,charge:96.6,fire:98.5,hit:99.5,ko:100.6,freeze:102.8,inv:106.2,pout:108.2},J={select:{en:"SELECT YOUR FILM",ar:"اختر فيلمك"},chapters:{en:"CHAPTERS",ar:"الفصول"},runtime:{en:"RUNTIME",ar:"المدة"},vs:{en:"VS",ar:"ضد"},deadline:{en:"THE DEADLINE",ar:"الموعد النهائي"},round:{en:"ROUND 1",ar:"الجولة 1"},fight:{en:"FIGHT!",ar:"هيّا!"},special:{en:"HOT FIX!",ar:"إصلاح عاجل!"},ko:{en:"K.O.",ar:"ضربة قاضية"},title:{en:"CROSSOVER",ar:"عبور"},titleSub:{en:"six worlds, one mark",ar:"ستة عوالم، علامة واحدة"},words:{en:["MAP","BUILD","VERIFY"],ar:["ارسم","ابنِ","تحقّق"]},end:{en:"The End?",ar:"النهاية؟"}};export{Y as A,F as C,B as F,E as M,K as P,j as S,J as a,_ as f,G as i,H as l,W as s};
