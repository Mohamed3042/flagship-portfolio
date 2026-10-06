import{u as L,q as z,y as R,aM as G,H,s as p,a as q,M as b,i as C,aO as E,bk as U,al as F,a9 as S,S as B,af as j,V as K,C as N,a2 as Q,I as V}from"./EditionWorld.astro_astro_type_script_index_0_lang.KM0kS1M1.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const D=`
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
vec3 h31(float p){ vec3 q = fract(vec3(p) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xxy + q.yzz) * q.zyx); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vnoise(p); p = p * 2.03 + 17.1; a *= .5; } return v; }
float fbm3(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 3; i++){ v += a * vnoise(p); p = p * 2.03 + 17.1; a *= .5; } return v; }
float lum(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
`,I=`
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
}`,ce=(()=>{const t=(a,c)=>{const s=c.length,l=c.map(([i,v])=>`vec2(${(i-1.935).toFixed(3)},${(v-1).toFixed(3)})`).join(",");return`const vec2 ${a}[${s}] = vec2[${s}](${l});
float sd_${a}(vec2 p){
  float d = dot(p - ${a}[0], p - ${a}[0]), s = 1.;
  for (int i = 0, j = ${s-1}; i < ${s}; j = i, i++){
    vec2 e = ${a}[j] - ${a}[i], w = p - ${a}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${a}[i].y, p.y < ${a}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`};return`${t("mkM",L[0])}
${t("mkK",L[1])}
float sdMK(vec2 p){ return min(sd_mkM(p), sd_mkK(p)); }`})(),ve=n=>{const e=parseInt(n.replace("#",""),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]},$="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",J=`
uniform sampler2D tSrc, tOld;
uniform vec2 uView, uRevealAt, uGrid, uPtr;
uniform float uTime, uBlend, uCell, uLayer, uSizeL, uLenL, uDetThr, uSeed, uS, uSrcK, uPtrOn, uVel;
uniform float uSize, uLen, uJit, uSat, uCool, uWarm, uDry, uCoh, uAngle, uSwirl, uWind, uShim, uDepth, uReveal, uFine;
attribute float aCell;
varying vec2 vQ; varying vec3 vCol, vCol2; varying vec4 vS; varying vec2 vHalf; varying float vCurv;
${D}
vec4 src(vec2 uv, float w, float lod){
  vec2 c = clamp(uv, .002, .998);
  vec4 a = textureLod(tSrc, c, lod);
  return w >= .999 ? a : mix(textureLod(tOld, c, lod), a, w);
}
void main(){
  float id = aCell;
  vec2 cell = vec2(mod(id, uGrid.x), floor(id / uGrid.x));
  vec2 hh = h22(vec2(id * .731 + uSeed, uLayer * 17.3 + 1.7));
  // each stroke re-seeds once per cycle, at a phase of its own: its jitter eases from the last state to the next
  float T = 11. / max(.2, uShim);
  float cyc = uTime / T + h11(id * 1.37 + uSeed * 3.1), k0 = floor(cyc), sw = smoothstep(0., .09, fract(cyc));
  vec4 ra = vec4(h22(vec2(id + k0 * 13.1, uSeed + 1.)), h22(vec2(id * 1.7 + k0 * 7.3, uSeed + 3.3)));
  vec4 rb = vec4(h22(vec2(id + (k0 - 1.) * 13.1, uSeed + 1.)), h22(vec2(id * 1.7 + (k0 - 1.) * 7.3, uSeed + 3.3)));
  vec4 rj = mix(rb, ra, sw);
  vec3 rc = mix(h31(id * 3.7 + (k0 - 1.) * 5.1 + uSeed), h31(id * 3.7 + k0 * 5.1 + uSeed), sw) - .5;
  vec2 p0 = (cell + hh - .5) * uCell + (rj.xy - .5) * uCell * .5 * min(uShim, 1.2);
  vec2 uv0 = p0 / uView;
  float asp = uView.x / uView.y, hv = h21(vec2(id, uSeed + 9.));
  float dn = clamp(length((uv0 - uRevealAt) * vec2(asp, 1.)) / (.5 * length(vec2(asp, 1.)) + .25), 0., 1.);
  float tg = dn * .72 + hv * .28;
  float grow = smoothstep(tg, tg + .14, uReveal * 1.14);
  float tb = clamp(dn * .55 + hv * .45, 0., 1.);
  float wB = uBlend >= 1. ? 1. : smoothstep(tb, tb + .2, uBlend * 1.2);
  if (grow < .002) { gl_Position = vec4(2., 2., 2., 1.); return; }

  float r = max(2., uSizeL * uSize * uS * .42);
  vec2 e = vec2(r) / uView;
  float lodT = log2(max(1., r * 1.4 * uSrcK)), lodC = max(0., log2(max(1., uSizeL * uSize * uS * .5 * uSrcK)));
  vec4 c0 = src(uv0, wB, lodC);
  float jxx = 0., jxy = 0., jyy = 0.;
  for (int i = 0; i < 5; i++) {                              // the structure tensor of the picture around the stroke (at the stroke's own scale)
    vec2 o = (i == 0 ? vec2(0.) : i == 1 ? vec2(1., 0.) : i == 2 ? vec2(-1., 0.) : i == 3 ? vec2(0., 1.) : vec2(0., -1.)) * e * 1.7;
    vec2 q = uv0 + o;
    float gx = lum(src(q + vec2(e.x, 0.), wB, lodT).rgb) - lum(src(q - vec2(e.x, 0.), wB, lodT).rgb);
    float gy = lum(src(q + vec2(0., e.y), wB, lodT).rgb) - lum(src(q - vec2(0., e.y), wB, lodT).rgb);
    jxx += gx * gx; jxy += gx * gy; jyy += gy * gy;
  }
  float tr = jxx + jyy, df = jxx - jyy;
  float edge = sqrt(tr) * .5, coh = sqrt(df * df + 4. * jxy * jxy) / max(tr, 1e-5);
  float thg = .5 * atan(2. * jxy, df) + 1.5708;              // along the edge, not across it
  float nz = vnoise(p0 * .006 + vec2(uTime * .03, uSeed)) * 2. - 1.;
  float thd = uAngle + uSwirl * nz + uWind * sin(dot(p0, vec2(.011, .004)) - uTime * 1.3 + nz * 2.);
  float wt = clamp(edge * 16., 0., 1.) * mix(.45, 1., coh) * uCoh;
  vec2 av = vec2(cos(2. * thg), sin(2. * thg)) * wt + vec2(cos(2. * thd), sin(2. * thd)) * (1. - wt);
  vec2 dpt = (uv0 - uPtr) * vec2(asp, 1.);
  float stir = exp(-dot(dpt, dpt) * 70.) * uPtrOn;                 // the pointer turns the strokes round itself, gently
  float thT = atan(dpt.y, dpt.x) + 1.5708;
  av = mix(av, vec2(cos(2. * thT), sin(2. * thT)), stir * .8);
  float th = .5 * atan(av.y, av.x) + (rj.z - .5) * (.16 + .2 * uShim);
  vec2 dir = vec2(cos(th), sin(th)), nrm = vec2(-dir.y, dir.x);

  float sz = mix(1., 1. - uDepth, c0.a);
  float wid = uSizeL * uSize * sz * uS * mix(.8, 1.25, rj.w);
  float len = uLenL * uLen * sz * uS * mix(.78, 1.3, rj.z) * (1. + min(abs(uVel), 3.) * .3);   // a fast scroll drags the strokes out
  float lodD = max(0., lodC - 1.);
  vec3 d0 = src(uv0, wB, lodD).rgb;
  vec3 s1 = src(uv0 + dir * len * .4 / uView, wB, lodD).rgb, s2 = src(uv0 - dir * len * .4 / uView, wB, lodD).rgb;
  vec3 s3 = src(uv0 + nrm * wid * .7 / uView, wB, lodD).rgb, s4 = src(uv0 - nrm * wid * .7 / uView, wB, lodD).rgb;
  float det = (length(s1 - d0) + length(s2 - d0) + length(s3 - d0) + length(s4 - d0)) * .25;
  if (uDetThr > 0. && det < uDetThr * uFine) { gl_Position = vec4(2., 2., 2., 1.); return; }
  len *= mix(1., .62, smoothstep(.05, .3, det));

  // the brush picks up the colours along its way: head and tail take a little of what lies either side
  vec3 cH = mix(c0.rgb, s2, .5), cT = mix(c0.rgb, s1, .5);
  float jv = rc.x * .18 * uJit;
  vec3 jh = vec3(rc.y, -rc.y * .4, rc.z) * .22 * uJit, jc = vec3(rc.z, rc.x, rc.y) * .022 * uJit;
  vec3 outc[2]; outc[0] = cH; outc[1] = cT;
  for (int k = 0; k < 2; k++) {
    vec3 col = outc[k];
    float l = lum(col);
    col = mix(col, col * vec3(.84, .9, 1.16) + vec3(-.01, 0., .04), uCool * (1. - smoothstep(.12, .55, l)));   // shadows go cool
    col = mix(col, col * vec3(1.12, 1.02, .84) + vec3(.025, .012, -.02), uWarm * smoothstep(.5, .95, l));       // lights go warm
    l = lum(col);
    col = clamp(mix(vec3(l), col, uSat), 0., 1.4);
    col *= 1. + jv; col *= 1. + jh; col += jc;                                                                 // broken colour
    outc[k] = max(col, 0.);
  }

  float base = uLayer * .28 + rj.w * .26 + hv * .1;
  vS = vec4(hv * 91.7 + id * .013, clamp(mix(.62, 1., rj.x) - uDry * .35, .1, 1.), base, grow);
  vec2 hs = vec2(len, wid) * .5;
  vec2 lp = position.xy * (hs + vec2(2., hs.y * .5 + 2.));
  vQ = lp; vHalf = hs; vCol = outc[0]; vCol2 = outc[1]; vCurv = (rj.x - .5) * .6 * (.3 + uShim * .5);
  gl_Position = vec4((p0 + dir * lp.x + nrm * lp.y) / uView * 2. - 1., 0., 1.);
}`,Y=`
uniform vec2 uView; uniform float uHeroT;
attribute vec4 aA, aB, aC;
varying vec2 vQ; varying vec3 vCol, vCol2; varying vec4 vS; varying vec2 vHalf; varying float vCurv;
void main(){
  float g = clamp((uHeroT - aB.y) / aB.z, 0., 1.);
  g = 1. - pow(1. - g, 2.2);
  if (g < .002) { gl_Position = vec4(2., 2., 2., 1.); return; }
  vec2 hs = aA.zw * .5, lp = position.xy * (hs + 2.);
  vec2 dir = vec2(cos(aB.x), sin(aB.x)), nrm = vec2(-dir.y, dir.x);
  vQ = lp; vHalf = hs; vCol = aC.rgb; vCol2 = aC.rgb * 1.12; vCurv = 0.;
  vS = vec4(aA.x * .013 + aA.y * .007 + aB.y * 3.1, aB.w, aC.w, g);
  gl_Position = vec4((aA.xy + dir * lp.x + nrm * lp.y) / uView * 2. - 1., 0., 1.);
}`,O=`
precision highp float;
uniform float uAlpha;
varying vec2 vQ; varying vec3 vCol, vCol2; varying vec4 vS; varying vec2 vHalf; varying float vCurv;
layout(location = 0) out highp vec4 oC;
layout(location = 1) out highp vec4 oH;
${D}
void main(){
  float hl = vHalf.x, hw = vHalf.y;
  float uu = vQ.x / hl * .5 + .5;                 // 0 at the head of the stroke, 1 at its tail
  float s2 = abs(uu * 2. - 1.);
  float v = (vQ.y - vCurv * hw * (s2 * s2 - .4)) / hw;   // across it, the stroke bowed a little
  float seed = vS.x, load = vS.y, base = vS.z, grow = vS.w;
  float nb = max(3., hw * .95);                   // bristle lines, about one per 2 px
  float bi = floor((v * .5 + .5) * nb);
  float br = h21(vec2(bi, seed)), br2 = h21(vec2(bi + 7.7, seed * 1.31));
  float tailAt = mix(.42, 1.14, br * load);       // where this bristle runs out of paint
  float ragged = (vnoise(vec2(vQ.x * .09 + seed, bi)) - .5) * .14;
  float dryA = 1. - smoothstep(tailAt - .04, tailAt + .025, uu + ragged);
  float pe = uu < .5 ? 3.4 : 1.9;                 // a blunt head, a rounder tail
  float w = pow(clamp(1. - pow(s2, pe), 0., 1.), 1. / pe);
  float d = max((abs(v) - w * mix(1., .82, smoothstep(.2, 1., uu))) * hw * .9, (s2 - 1.) * hl);
  float cov = clamp(.5 - d / max(fwidth(d), 1e-3), 0., 1.) * dryA;
  cov *= smoothstep(grow, grow - .035, uu);       // the stroke is laid from its head to its tail
  float tailThin = smoothstep(.5, 1., uu);
  vec3 col = mix(vCol, vCol2, smoothstep(.05, .95, uu)) * (1. + (br - .5) * .17 + (br2 - .5) * .07);
  col = mix(col, col * 1.07, (1. - smoothstep(0., .35, uu)) * .6);
  float edgeR = smoothstep(.5, .86, abs(v)) * (1. - smoothstep(.86, 1.02, abs(v)));
  float h = base + .34 * edgeR * (1. - tailThin * .6) + (br - .5) * .48 * (1. - tailThin * .4) + .2 * (1. - v * v) - .22 * tailThin;
  float th = mix(1., .45, tailThin) * mix(.75, 1., br);
  float a = cov * uAlpha;
  oC = vec4(col, a);
  oH = vec4(h, th, 0., a);
}`,X=`
precision highp float;
uniform vec3 uGround;
layout(location = 0) out highp vec4 oC;
layout(location = 1) out highp vec4 oH;
void main(){ oC = vec4(uGround, 1.); oH = vec4(0., 0., 0., 1.); }`,Z=`
uniform sampler2D tC, tH;
uniform vec2 uRes, uCss, uRake;
uniform float uAsp, uKeep, uCa, uRelief, uSpec, uWeave, uGlow;
varying vec2 vUv;
${I}
float hsh(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float wv(vec2 p){   // plain weave: threads over and under, each a little different
  vec2 t = p / 3.6, c = floor(t), f = fract(t);
  float chk = mod(c.x + c.y, 2.), hx = sin(f.x * 3.14159), hy = sin(f.y * 3.14159);
  float th = .72 + .28 * hsh(c);
  return mix(hx * (.55 + .45 * hy), hy * (.55 + .45 * hx), chk) * th * .55 + .1;
}
void main(){
  vec2 uv = vUv, px = 1. / uRes;
  vec2 d = (uv - .5) * uCa;                                         // the engine parts the colours: sample them the other way
  vec3 c = vec3(texture2D(tC, uv - d).r, texture2D(tC, uv).g, texture2D(tC, uv + d).b);
  vec2 h0 = texture2D(tH, uv).rg;
  float hl = texture2D(tH, uv - vec2(px.x, 0.)).r, hr = texture2D(tH, uv + vec2(px.x, 0.)).r;
  float hd = texture2D(tH, uv - vec2(0., px.y)).r, hu = texture2D(tH, uv + vec2(0., px.y)).r;
  vec2 gp = vec2(hr - hl, hu - hd) * .5 * (uRes.y / uCss.y);
  vec2 W = uv * uCss;
  vec2 gw = vec2(wv(W + vec2(1., 0.)) - wv(W - vec2(1., 0.)), wv(W + vec2(0., 1.)) - wv(W - vec2(0., 1.))) * .5;
  float wk = uWeave * pow(1. - h0.g, 1.7);
  vec3 n = normalize(vec3(-(gp * uRelief * 1.15 + gw * wk * 1.15), 1.));
  vec3 L = normalize(vec3(uRake, .62));
  float sh = dot(n, L) / L.z;
  c *= clamp(mix(1., sh, .9), .5, 1.55);
  vec3 H = normalize(L + vec3(0., 0., 1.));
  c += pow(max(dot(n, H), 0.), 40.) * uSpec * h0.g * vec3(1., .94, .82) * .5;
  vec3 lin = pow(max(c, 0.), vec3(2.2));
  float vig = smoothstep(1.25, .35, length((uv - .5) * vec2(uAsp, 1.)));
  float post = .45 + .55 * vig;                                     // what the engine multiplies by next
  gl_FragColor = vec4(invNeutral(max(lin * mix(1., post, uKeep), 0.)) / post, 1.);
}`,A={size:1,len:1,jit:.8,sat:1.12,cool:.35,warm:.35,dry:.25,relief:1,spec:.55,coh:1,angle:0,swirl:.5,wind:0,shim:.7,depth:.5,fine:1,weave:1,glow:.1,ground:[.8,.7,.52],rake:[-.7,.55],reveal:1,revealAt:[.5,.5]},ee=["size","len","jit","sat","cool","warm","dry","relief","spec","coh","angle","swirl","wind","shim","depth","fine","weave","glow"],te=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,T=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,_=[{cell:40,w:30,l:125,det:0,seed:1},{cell:13.5,w:15,l:54,det:0,seed:2},{cell:10,w:8,l:26,det:.04,seed:3},{cell:6.5,w:4.6,l:14,det:.12,seed:4}];class ae{constructor(e){this.ctx=e,this.renderer=e.renderer;const t={type:H,depthBuffer:!0,samples:0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,generateMipmaps:!0,minFilter:G,magFilter:R};this.srcA=new z(2,2,t),this.srcB=new z(2,2,t),this.cur=this.srcA,this.old=this.srcB,this.canvas=new z(2,2,{count:2,type:H,depthBuffer:!1,minFilter:R,magFilter:R}),this.U={tSrc:{value:this.cur.texture},tOld:{value:this.old.texture},uView:{value:new p(2,2)},uRevealAt:{value:new p(.5,.5)},uTime:{value:0},uBlend:{value:1},uS:{value:1},uSrcK:{value:.5},uPtr:{value:new p(.5,.5)},uPtrOn:{value:0},uVel:{value:0},uSize:{value:1},uLen:{value:1},uJit:{value:1},uSat:{value:1},uCool:{value:0},uWarm:{value:0},uDry:{value:0},uCoh:{value:1},uAngle:{value:0},uSwirl:{value:0},uWind:{value:0},uShim:{value:1},uDepth:{value:.5},uReveal:{value:1},uFine:{value:1}},this.PU={tC:{value:this.canvas.textures[0]},tH:{value:this.canvas.textures[1]},uRes:{value:new p(2,2)},uCss:{value:new p(2,2)},uRake:{value:new p(-.7,.55)},uAsp:{value:1},uKeep:{value:.3},uCa:{value:.0025},uRelief:{value:1},uSpec:{value:.5},uWeave:{value:1},uGlow:{value:.1}};const a=new q(2,2),c=new b(a,new C({glslVersion:U,vertexShader:$,fragmentShader:X,uniforms:this.groundU,depthTest:!1,depthWrite:!1,blending:E}));c.frustumCulled=!1,c.renderOrder=0,this.strokeScene.add(c),_.forEach((v,d)=>{const u=new F;u.index=a.index,u.setAttribute("position",a.getAttribute("position")),u.setAttribute("aCell",new S(new Float32Array(1),1));const r={...this.U,uCell:{value:v.cell},uGrid:{value:new p(1,1)},uLayer:{value:d},uSizeL:{value:v.w},uLenL:{value:v.l},uDetThr:{value:v.det},uSeed:{value:v.seed},uAlpha:{value:1}},o=new b(u,new C({glslVersion:U,vertexShader:J,fragmentShader:O,uniforms:r,depthTest:!1,depthWrite:!1,transparent:!0}));o.frustumCulled=!1,o.renderOrder=1+d,this.strokeScene.add(o),this.layers.push({mesh:o,geom:u,U:r,n:0,perm:new Float32Array(0)})});const s=new F;s.index=a.index,s.setAttribute("position",a.getAttribute("position"));for(const v of["aA","aB","aC"])s.setAttribute(v,new S(new Float32Array(4),4));s.instanceCount=0;const l={uView:this.U.uView,uHeroT:{value:0},uAlpha:{value:1}},i=new b(s,new C({glslVersion:U,vertexShader:Y,fragmentShader:O,uniforms:l,depthTest:!1,depthWrite:!1,transparent:!0}));i.frustumCulled=!1,i.renderOrder=10,this.strokeScene.add(i),this.hero={mesh:i,geom:s,U:l},this.resize()}renderer;srcA;srcB;cur;old;canvas;strokeScene=new B;strokeCam=new j(-1,1,1,-1,0,1);layers=[];hero;groundU={uGround:{value:new K(.8,.7,.52)}};U;PU;shown={...A,ground:[...A.ground],rake:[...A.rake],revealAt:[.5,.5]};owner=null;blend=1;snap=!0;key="";keep=new N;refs=0;warmed=!1;lastT=-1;resize(){const{width:e,height:t,dpr:a}=this.ctx.viewport,c=this.ctx.quality,s=`${e}x${t}x${a.toFixed(3)}x${c}`;if(s===this.key)return;this.key=s;const l=Math.max(2,Math.round(e*a)),i=Math.max(2,Math.round(t*a));(this.canvas.width!==l||this.canvas.height!==i)&&this.canvas.setSize(l,i);const v=[.5,.55,.6][c],d=Math.max(2,Math.round(e*v)),u=Math.max(2,Math.round(t*v));for(const o of[this.srcA,this.srcB])(o.width!==d||o.height!==u)&&o.setSize(d,u);const r=Q(Math.hypot(e,t)/1700,.62,1.2)*[1.14,1.05,1][c];this.U.uView.value.set(e,t),this.U.uS.value=r,this.U.uSrcK.value=v,this.PU.uRes.value.set(l,i),this.PU.uCss.value.set(e,t),this.PU.uAsp.value=e/t,this.layers.forEach((o,g)=>{const w=_[g].cell*r,k=Math.ceil(e/w)+1,m=Math.ceil(t/w)+1,h=k*m;if(o.U.uCell.value=w,o.U.uGrid.value.set(k,m),h!==o.n){const x=new Float32Array(h);for(let f=0;f<h;f++)x[f]=f;let P=9301+g*977;for(let f=h-1;f>0;f--){P=P*1664525+1013904223>>>0;const M=P%(f+1),W=x[f];x[f]=x[M],x[M]=W}o.geom.setAttribute("aCell",new S(x,1)),o.geom.instanceCount=h,o.n=h,o.perm=x}})}makePresent(){const e=new C({vertexShader:$,fragmentShader:Z,uniforms:this.PU,depthTest:!1,depthWrite:!1}),t=new b(new q(2,2),e);t.frustumCulled=!1,t.renderOrder=-1;const a=new B;a.add(t);const c=new j(-1,1,1,-1,0,1);return{scene:a,camera:c,quad:t,mat:e}}setHero(e){const t=e.length,a=new Float32Array(t*4),c=new Float32Array(t*4),s=new Float32Array(t*4);e.forEach((l,i)=>{a.set([l.x,l.y,l.len,l.wid],i*4),c.set([l.ang,l.t0,l.dur,l.load],i*4),s.set([l.col[0],l.col[1],l.col[2],l.h],i*4)}),this.hero.geom.setAttribute("aA",new S(a,4)),this.hero.geom.setAttribute("aB",new S(c,4)),this.hero.geom.setAttribute("aC",new S(s,4)),this.hero.geom.instanceCount=t}heroTime(e,t=1){this.hero.U.uHeroT.value=e,this.hero.U.uAlpha.value=t}async warm(e,t){const a=this.renderer,c=a.getRenderTarget(),s=[];this.warmed||(this.warmed=!0,a.setRenderTarget(this.canvas),s.push(a.compileAsync(this.strokeScene,this.strokeCam).catch(()=>{}))),e&&t&&(a.setRenderTarget(this.cur),s.push(a.compileAsync(e,t).catch(()=>{}))),a.setRenderTarget(c),await Promise.all(s)}speed(e){this.PU.uCa.value=.0025+Math.min(Math.abs(e),4)*.006*.65}ref(){this.refs++}unref(){--this.refs<=0&&this.dispose()}paint(e,t,a,c,s,l=!1){const i=this.renderer;if(this.lastT===s.t&&this.owner!==e)return;if(this.lastT=s.t,this.resize(),this.owner!==e){if(this.owner===null||l)this.blend=1,this.snap=!0;else{const h=this.cur;this.cur=this.old,this.old=h,this.blend=0}this.owner=e,this.U.tSrc.value=this.cur.texture,this.U.tOld.value=this.old.texture}const v=i.getRenderTarget(),d=i.getClearAlpha();i.getClearColor(this.keep),i.setRenderTarget(this.cur),i.setClearColor(this.keep.setRGB(0,0,0),1),i.clear(!0,!0,!0),i.render(t,a);const u={...A,...c},r=this.shown,o=this.U,g=this.snap?1:1-Math.exp(-2.4*s.dt);for(const h of ee)r[h]+=(u[h]-r[h])*g;for(let h=0;h<3;h++)r.ground[h]+=(u.ground[h]-r.ground[h])*g;r.rake[0]+=(u.rake[0]-r.rake[0])*g,r.rake[1]+=(u.rake[1]-r.rake[1])*g,this.snap=!1,this.blend=Math.min(1,this.blend+s.dt/1.7),o.uBlend.value=this.blend,o.uTime.value=T?0:s.t;const w=this.ctx.pointer,k=w.inside&&!te&&!T?1:0;o.uPtrOn.value+=(k-o.uPtrOn.value)*(1-Math.exp(-4*s.dt)),o.uPtr.value.set(w.x*.5+.5,w.y*.5+.5),o.uVel.value=T?0:s.v,o.uSize.value=r.size,o.uLen.value=r.len,o.uJit.value=r.jit,o.uSat.value=r.sat,o.uCool.value=r.cool,o.uWarm.value=r.warm,o.uDry.value=r.dry,o.uCoh.value=r.coh,o.uAngle.value=r.angle,o.uSwirl.value=r.swirl,o.uWind.value=r.wind,o.uShim.value=r.shim,o.uDepth.value=r.depth,o.uFine.value=r.fine,o.uReveal.value=u.reveal,o.uRevealAt.value.set(u.revealAt[0],u.revealAt[1]),this.hero.mesh.visible=!!u.hero,this.groundU.uGround.value.set(r.ground[0],r.ground[1],r.ground[2]);const m=this.PU;m.uRake.value.set(r.rake[0],r.rake[1]),m.uRelief.value=r.relief,m.uSpec.value=r.spec,m.uWeave.value=r.weave,m.uGlow.value=r.glow,i.setRenderTarget(this.canvas),i.setClearColor(this.keep.setRGB(r.ground[0],r.ground[1],r.ground[2]),1),i.clear(!0,!1,!1),i.render(this.strokeScene,this.strokeCam),i.setRenderTarget(v),i.setClearColor(this.keep.setRGB(0,0,0),d)}dispose(){this.srcA.dispose(),this.srcB.dispose(),this.canvas.dispose();for(const e of this.layers)e.geom.dispose(),e.mesh.material.dispose();this.hero.geom.dispose(),this.hero.mesh.material.dispose(),delete this.ctx.__painter}}function re(n){const e=n;return e.__painter??=new ae(n)}const oe="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",se=`
uniform float uTime, uP, uAsp, uQ; uniform vec2 uLean;
varying vec2 vUv;
${D}
`,ie=`
void main(){ gl_FragColor = paint(vUv, (vUv - .5) * vec2(uAsp, 1.)); }`,le=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,y={x:0,y:0,t:-1};function ue(n,e,t){if(y.t!==e){y.t=e;const a=n.pointer.inside&&!le;y.x=V(y.x,a?n.pointer.x:0,2.6,t),y.y=V(y.y,a?n.pointer.y:0,2.6,t)}return y}function he(){const n=new URLSearchParams(location.search).get("intro");let e=-1,t=-1,a=0;return(c,s)=>n!==null?Number(n):(t<0&&(t=c),e<0&&(a=s<.04?a+1:0,(a>=8||c-t>2.5)&&(e=c)),e<0?0:c-e)}async function de(n){try{await Promise.race([Promise.all(n.map(e=>document.fonts.load(e))),new Promise(e=>setTimeout(e,2500))])}catch{}}const fe={serif:'"Fraunces Variable", Georgia, serif',ar:'"Cairo Variable", system-ui, sans-serif'},me=(n,e,t)=>{const a=Math.min(1,Math.max(0,(t-n)/(e-n)));return a*a*(3-2*a)},pe=(n,e,t)=>n+(e-n)*t;async function ge(n,e){const t=re(n);t.ref();const a=t.makePresent(),c=new B,s=new j(-1,1,1,-1,0,1),l={uTime:{value:0},uP:{value:0},uAsp:{value:n.viewport.aspect},uQ:{value:n.quality},uLean:{value:new p},...e.uniforms},i=new C({vertexShader:oe,fragmentShader:se+e.frag+ie,uniforms:l,depthTest:!1,depthWrite:!1}),v=new b(new q(2,2),i);v.frustumCulled=!1,c.add(v),e.onResize?.(n.viewport,t),await t.warm(c,s);const d={scene:a.scene,camera:a.camera,update(u){const r=ue(n,u.t,u.dt);l.uTime.value=T?0:u.t,l.uP.value=u.p,l.uLean.value.set(r.x,r.y);const o=e.tick({f:u,U:l,lean:r,ctx:n,painter:t});t.speed(u.v),t.paint(e.id,c,s,o,u)},resize(u){t.resize(),l.uAsp.value=u.aspect,e.onResize?.(u,t)},focus:u=>e.onFocus?.(u),pick:e.pick,hover:e.hover,dispose(){i.dispose(),v.geometry.dispose(),a.mat.dispose(),a.quad.geometry.dispose(),e.dispose?.(),t.unref()}};return e.light!==void 0&&Object.defineProperty(d,"light",{get:typeof e.light=="function"?e.light:()=>e.light}),d}export{T as C,fe as F,D as H,I,ce as M,de as f,re as g,he as i,ue as l,pe as m,ge as p,ve as r,me as s};
