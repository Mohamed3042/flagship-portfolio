import{V as J,t as He,a as Re,al as at,i as ye,a4 as be,a5 as ze,M as xe,C as st,aT as Ye,x as lt,aV as rt,bt as nt,aD as it,s as Me,a6 as A,Z as Xe,a2 as pe,p as ct,ac as ut,an as ft,ag as vt,P as dt,G as pt}from"./EditionWorld.astro_astro_type_script_index_0_lang.B6El-kZd.js";import{b as we,l as fe,p as ve,F as Ge,C as ht,f as mt,d as wt,s as xt,g as $e,a as gt,c as bt}from"./lines.adH-S6Oh.js";import{S as yt,C as Ke}from"./plan.Bzh-bcoD.js";import{t as Qe,f as Lt}from"./glow.C1NjnXHn.js";import{r as Tt}from"./rig.DgWxFY0i.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const St=yt.mind,Ne=a=>{const t=parseInt(a.slice(1),16);return[t>>16&255,t>>8&255,t&255].map(l=>Math.pow(l/255,2.2))},Se=(a,t=1)=>{const[l,i,c]=Ne(a);return`vec3(${(l*t).toFixed(4)},${(i*t).toFixed(4)},${(c*t).toFixed(4)})`},de={vio:"#8b5cff",lil:"#c9b8ff",cya:"#5cd6ff",ros:"#ff7ab8",amb:"#ffb340",wht:"#f3eeff"},he={SP:1.15,DZ:6,Z0:3,KL:13},Ee=[0,0,-82],ue={z:[-88,-98.5,-109],y:0},te={c:[0,-3.2,-98.5]},ke={R:5.2,apo:5.2*Math.cos(Math.PI/6),cell:.21,half:8.8,ringZ:[-5.4,-3.3,3.3,5.4],ringR:[.72,1,1,.72]},n={lineIn:[.7,3.5],breakAt:5,breakStep:.17,convert:.7,hover:.35,loom:[7.2,19.2],tree:[20.8,.42,.42],arrive:19.8,found:24.3,retract:26.4,straight:[27,29],disc:[28,.65],minds:[28.7,.45,.18],act:[29.5,1.5],flow:[35.2,.85],fold:[38.4,40.9],push:[41,44.4]},ge=`
const vec3 C_VIO = ${Se(de.vio)}, C_LIL = ${Se(de.lil)}, C_CYA = ${Se(de.cya)}, C_ROS = ${Se(de.ros)}, C_AMB = ${Se(de.amb)}, C_WHT = ${Se(de.wht)};
// the accent families (cyan, rose, amber) carry less light than the violet: they are two to three times as bright to the eye
const vec3 FAM[9] = vec3[9](C_VIO, C_CYA * .62, C_VIO, C_ROS * .8, C_LIL * .85, C_AMB * .56, C_VIO, C_CYA * .62, C_VIO);
`,Le=`
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float h13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
`;function At(){const a=()=>Array.from({length:9},()=>new He);return{uT:{value:0},uL0:{value:0},uReveal:{value:0},uThr:{value:0},uSheet:{value:0},uNB:{value:9},uField:{value:0},uBeadPx:{value:40},uCam:{value:new J},uBead:{value:a()},uBeadA:{value:a()},uFold:{value:0}}}const Ce=`
uniform float uT, uL0, uReveal, uThr, uSheet, uNB, uFold, uField, uBeadPx;
uniform vec3 uCam;
uniform vec4 uBead[9];
uniform vec4 uBeadA[9];
`,Ct=`
float beadV(float b){ return 7.0 + .55 * sin(b * 2.4); }
vec3 beadPath(float b, float z){
  vec4 s = uBead[int(b)];
  float d = clamp((s.z - z) / 66., 0., 1.);
  float amp = smoothstep(0., .16, d) * (1. - smoothstep(.72, 1., d));
  float ph = b * 1.9 + 1.3;
  vec2 wv = vec2(sin(z * .115 + ph) + .55 * sin(z * .047 + ph * 2.1), cos(z * .081 + ph * .7) + .5 * sin(z * .059 + ph * 1.4)) * amp * vec2(3.6, 2.5);
  vec2 xy = mix(s.xy, vec2(0.), smoothstep(.35, 1., d)) + wv;
  return vec3(xy, z);
}
float beadZ(float b, float T){
  vec4 s = uBead[int(b)];
  float tau = max(T - s.w, 0.), te = 1.3;
  return s.z - beadV(b) * (tau - te * (1. - exp(-tau / te)));
}
vec3 beadPos(float b, float T){ return beadPath(b, beadZ(b, T)); }
`,Je=`
const vec3 CRYC = vec3(${te.c.map(a=>a.toFixed(3)).join(",")});
vec3 foldP(vec3 P){
  float f = uFold;
  if (f <= 0.) return P;
  vec3 r = P - CRYC;
  float s = f * f * (3. - 2. * f), zn = clamp(r.z / 10.5, -1.5, 1.5);
  float ang = s * 1.5 * zn, ca = cos(ang), sa = sin(ang);
  r.xy = mat2(ca, sa, -sa, ca) * r.xy;
  r *= mix(vec3(1.), vec3(.55, .5, .62), s);
  r.y += sin(3.14159 * f) * 2.6 * (1. - zn * zn);
  // the ends are drawn into the gem's taper, so everything lands inside its hull
  float az = abs(r.z);
  r.xy *= 1. - s * .9 * smoothstep(2.2, 7.6, az);
  r.z = sign(r.z) * mix(az, min(az, 7.6), s);
  return CRYC + r;
}`;function _e(a,t,l){const i=te.c,c=t*t*(3-2*t);let u=a[0]-i[0],r=a[1]-i[1],s=a[2]-i[2];const y=Math.max(-1.5,Math.min(1.5,s/10.5)),L=c*1.5*y,d=Math.cos(L),z=Math.sin(L),P=d*u-z*r,F=z*u+d*r;u=P*(1+(.55-1)*c),r=F*(1+(.5-1)*c),s=s*(1+(.62-1)*c),r+=Math.sin(Math.PI*t)*2.6*(1-y*y);const R=Math.abs(s),g=Math.min(1,Math.max(0,(R-2.2)/5.4)),B=g*g*(3-2*g);return u*=1-c*.9*B,r*=1-c*.9*B,s=Math.sign(s)*(R+(Math.min(R,7.6)-R)*c),l.set(i[0]+u,i[1]+r,i[2]+s)}const zt=`
const float SP = ${he.SP.toFixed(3)}, DZ = ${he.DZ.toFixed(3)}, Z0 = ${he.Z0.toFixed(3)}, KL = ${he.KL.toFixed(1)};
float layerZ(float L){ return -Z0 - L * DZ; }
// the first two layers keep the pivot's dense grid; the loom proper is looser
float spL(float L){ return mix(SP, SP * 1.45, smoothstep(.8, 2.2, L)); }
float layerSurf(vec2 g, float L){ return layerZ(L) + .85 * sin(g.x * .16 + L * 1.7 + uTime * .1) * cos(g.y * .2 - L * .9 + uTime * .08); }
vec3 loomPt(float L, float ix, float iy){
  float sp = spL(L);
  vec2 jt = (h22(vec2(ix + L * 37.1, iy + 7.3 + L * 11.9)) - .5) * sp * .8;
  vec2 g = (vec2(ix, iy) - vec2(GX - 1., GY - 1.) * .5) * sp + jt;
  float hh = h12(vec2(ix * 1.31 + L, iy * 2.17));
  g += .12 * vec2(sin(uTime * .31 + hh * 6.28), cos(uTime * .27 + hh * 5.1));
  return vec3(g, layerSurf(g, L));
}
// the field gathers into the loom's corridor as the camera swings out
vec2 sheetHalf(float L){ return max(mix(vec2(GX, GY) * spL(L) * .5, vec2(11.5, 7.5), min(uSheet, 1.)) * (1. - clamp(uSheet - 1., 0., 1.)), vec2(.001)); }
float panelFade(vec2 xy, float L){ vec2 e = abs(xy) / sheetHalf(L); return 1. - smoothstep(.66, 1., max(e.x, e.y)); }
// the light the beads leave in a layer, at a place: colour * intensity (lvl: the intensity alone)
vec3 act(float L, vec2 xy, out float lvl){
  float zL = layerZ(L);
  vec3 sum = vec3(0.); lvl = 0.;
  for (int k = 0; k < 9; k++){
    if (float(k) >= uNB) break;
    float b = float(k);
    float age = (zL - beadZ(b, uT)) / beadV(b);          // seconds since the bead passed this layer (< 0: still coming)
    if (age < -1.5) continue;                             // too far ahead to be felt (the work is only done for the floors it has reached)
    vec2 dd = xy - beadPath(b, zL).xy;
    float d2 = dot(dd, dd), after = step(0., age), a = max(age, 0.);
    float wake = exp(-d2 / 4.2);                          // the corridor it weaves
    float ring = exp(-pow((sqrt(d2) - 4.6 * a) / .9, 2.)) * exp(-a * .55) * after;
    float pre = exp(-d2 / 7.) * smoothstep(-1.4, 0., age) * (1. - after);
    float I = wake * (pre * .7 + after * (1.1 * exp(-a * .9) + .3 * exp(-a * .05))) + ring * .7;
    sum += FAM[k] * I; lvl += I;
  }
  return sum;
}
vec3 bez(vec3 a, vec3 b, vec3 c, vec3 d, float u){ float v = 1. - u; return a * v * v * v + 3. * b * v * v * u + 3. * c * v * u * u + d * u * u * u; }
`,Pt=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(0.); size = 0.; col = vec4(0.);
  float PERL = GX * GY;
  float Lw = floor(id / PERL), i = id - Lw * PERL;
  float L = uL0 + Lw;
  if (L < 0. || L > KL - 1.) return;
  float rev = clamp(uReveal - L, 0., 1.);
  if (rev <= 0.) return;
  float ix = mod(i, GX), iy = floor(i / GX);
  pos = loomPt(L, ix, iy);
  float edge = panelFade(pos.xy, L);
  if (edge <= .01) return;
  float h = h12(vec2(i * .73, L * 5.1 + 2.));
  float lv; vec3 A = act(L, pos.xy, lv);
  // the question listens: two rings spread across the field from the sentence
  float qr = 0., rr0 = length(pos.xy);
  for (int q = 0; q < 2; q++){ float a0 = uT - (q == 0 ? 3.3 : 4.6); if (a0 > 0.) qr += exp(-pow((rr0 - a0 * 9.) / 1.5, 2.)) * exp(-a0 * .8); }
  qr *= 1. - smoothstep(.5, 2.5, L);
  float tw = .72 + .28 * sin(uTime * (.5 + h * 1.7) + h * 40.);
  float dc = distance(pos, uCam);
  float near = smoothstep(.5, 4., dc);
  size = (4.2 + 3.4 * h) * (1. + .55 * min(lv, 1.6)) * (1. + .7 * smoothstep(6., 1.5, dc)) * (1. + .3 * (1. - min(uSheet, 1.)) * (1. - smoothstep(.5, 2.5, L))) * (1. + .6 * qr);
  float field = (1. - min(uSheet, 1.)) * (1. - smoothstep(.5, 2.5, L));   // the pivot's own field, brighter, while it is the whole picture
  vec3 base = mix(C_VIO, C_LIL, h * h) * (.6 + .4 * h) * tw * (1. + .35 * field);
  col = vec4((base * (1. + 1.4 * qr) + A * .95 + C_LIL * qr * .55) * edge * rev * near, 1.);
}`,Ft=`
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float PER = GX * GY * MT * (SEG + 1.);
  float Lw = floor(id / PER);
  float L = uL0 + Lw;
  if (L < 0. || L > KL - 2.) return;
  float rev = clamp(uReveal - L - .5, 0., 1.) * uThr;
  if (rev <= 0.) return;
  if (uCam.z - layerZ(L) < -DZ * 1.3) return;
  float r = id - Lw * PER;
  float k = floor(r / (SEG + 1.)), s = r - k * (SEG + 1.);
  float i = floor(k / MT), m = k - i * MT;
  if (m > .5 && h12(vec2(i * 2.3 + 1., L * 4.1)) > .55) return;          // a second thread leaves only some points: the weave's crossings
  float ix = mod(i, GX), iy = floor(i / GX);
  vec2 hh = h22(vec2(i * 1.7 + m * 91.3 + L * 7.1, L * 3.3 + m * 5.7));
  float ox = m < .5 ? (hh.x < .3 ? 0. : (hh.x < .5 ? -1. : (hh.x < .7 ? 1. : (hh.x < .85 ? -2. : 2.)))) : (hh.x < .25 ? -3. : (hh.x < .5 ? -1. : (hh.x < .75 ? 1. : 3.)));
  float oy = hh.y < .45 ? 0. : (hh.y < .72 ? -1. : (hh.y < .95 ? 1. : 2.));
  float jx = clamp(ix + ox, 0., GX - 1.), jy = clamp(iy + oy, 0., GY - 1.);
  vec3 a = loomPt(L, ix, iy), b = loomPt(L + 1., jx, jy);
  float ef = panelFade(a.xy, L) * panelFade(b.xy, L + 1.);
  if (ef <= .01) return;
  vec2 sa = (h22(vec2(i + 13.1 * m, L + 2.2)) - .5) * 1.1, sb = (h22(vec2(i + 31.7 * m, L + 8.8)) - .5) * 1.1;
  vec3 c1 = a + vec3(sa, -DZ * .4), c2 = b + vec3(sb, DZ * .4);
  float hf = h12(vec2(i * 3.7 + m, L * 1.3));
  vec3 amb = hf < .07 ? C_CYA : hf < .12 ? C_ROS : hf < .15 ? C_AMB : mix(C_VIO, C_LIL, hf * hf);
  float base = .026 + .026 * h12(vec2(i, L * 2. + m));
  // the beads: a pulse carried down this thread, and the light they leave behind
  float zA = layerZ(L), run = DZ / 13.;
  vec3 wake = vec3(0.); float pw = 0., pu = -1.; vec3 pc = C_VIO;
  for (int q = 0; q < 9; q++){
    if (float(q) >= uNB) break;
    float bb = float(q);
    float age = (zA - beadZ(bb, uT)) / beadV(bb);
    if (age < 0.) continue;                               // it has not reached this floor: no pulse, no wake
    vec2 d = a.xy - beadPath(bb, zA).xy;
    float w = exp(-dot(d, d) / 3.6);
    float on = w * smoothstep(0., .08, age) * (1. - smoothstep(run, run + .25, age));
    if (on > pw){ pw = on; pu = age / run; pc = FAM[q]; }
    float after = smoothstep(run * .6, run * 1.3, age);
    wake += FAM[q] * w * after * (.8 * exp(-max(age - run, 0.) * .6) + .2 * exp(-max(age, 0.) * .05));
  }
  // a few threads always carry a pulse of their own
  float ha = h12(vec2(i * 5.1 + 3., L * 9.7 + m * 2.));
  float ua = fract(uTime * (.1 + .16 * ha) + ha * 7.) * 1.9;
  if (step(ha, .07) > .5 && ua < 1. && .5 * smoothstep(0., .1, ua) > pw){ pw = .5 * smoothstep(0., .1, ua); pu = ua; pc = amb; }
  float lf = smoothstep(-DZ * 1.3, -DZ * .2, uCam.z - zA);
  float vis = ef * rev * lf;
  if (s >= SEG){
    if (pw < .04 || pu < 0. || pu > 1.12) return;
    float u1 = clamp(pu, 0., 1.), u0 = clamp(pu - .2, 0., 1.);
    A = bez(a, c1, c2, b, u0); B = bez(a, c1, c2, b, u1);
    float nf = smoothstep(3., 11., distance((A + B) * .5, uCam));
    col = vec4(mix(pc, C_WHT, .3) * pw * 1.9 * vis * nf, 1.);
    par = vec4(1.4, 0., 1., 1.2);
    return;
  }
  float u0 = s / SEG, u1 = (s + 1.) / SEG, us = (s + .5) / SEG;
  A = bez(a, c1, c2, b, u0); B = bez(a, c1, c2, b, u1);
  float nf = smoothstep(4., 16., distance((A + B) * .5, uCam));
  float bump = pw * exp(-pow((us - clamp(pu, 0., 1.2)) / .2, 2.)) * step(0., pu);
  vec3 c = amb * base + wake * .95 + pc * bump * 1.2;
  col = vec4(c * vis * nf, 1.);
  par = vec4(1., 0., 1., 0.);
}`,Mt=`
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float L = floor(id / 4.), e = id - L * 4.;
  if (L > KL - 1.) return;
  float rev = clamp(uReveal - L, 0., 1.) * smoothstep(0., 1., uSheet);
  if (rev <= 0.) return;
  vec2 h = sheetHalf(L) * .98;
  float z = layerZ(L);
  vec2 c0 = e < .5 ? vec2(-1., -1.) : e < 1.5 ? vec2(1., -1.) : e < 2.5 ? vec2(1., 1.) : vec2(-1., 1.);
  vec2 c1 = e < .5 ? vec2(1., -1.) : e < 1.5 ? vec2(1., 1.) : e < 2.5 ? vec2(-1., 1.) : vec2(-1., -1.);
  A = vec3(c0 * h, z); B = vec3(c1 * h, z);
  vec3 fl = vec3(0.);
  for (int k = 0; k < 9; k++){
    if (float(k) >= uNB) break;
    float age = (z - beadZ(float(k), uT)) / beadV(float(k));
    fl += FAM[k] * exp(-abs(age - .25) * 1.5) * .6;
  }
  float nf = smoothstep(2., 10., distance((A + B) * .5, uCam));
  col = vec4((C_VIO * .035 + fl) * rev * nf * (1. - smoothstep(-DZ, -DZ * .2, uCam.z - z)) * 1.0, 1.);
  par = vec4(1., 0., 1., 0.);
}`,Et=`
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float PER = GX * GY * 2.;
  float Lw = floor(id / PER), L = uL0 + Lw;
  if (L < 0. || L > KL - 1.) return;
  float rev = clamp(uReveal - L, 0., 1.) * smoothstep(.4, 1., uSheet);
  if (rev <= 0.) return;
  float r = id - Lw * PER, k = floor(r / 2.), dirI = r - k * 2.;
  float ix = mod(k, GX), iy = floor(k / GX);
  float jx = ix + (dirI < .5 ? 1. : 0.), jy = iy + (dirI < .5 ? 0. : 1.);
  if (jx > GX - 1. || jy > GY - 1.) return;
  A = loomPt(L, ix, iy); B = loomPt(L, jx, jy);
  float ef = panelFade(A.xy, L) * panelFade(B.xy, L);
  if (ef <= .01) return;
  float lv; vec3 lit = act(L, (A.xy + B.xy) * .5, lv);
  float nf = smoothstep(3., 12., distance((A + B) * .5, uCam));
  float lf = smoothstep(-DZ * 1.3, -DZ * .2, uCam.z - layerZ(L));
  col = vec4((C_VIO * .02 + lit * .66) * ef * rev * nf * lf, 1.);
  par = vec4(.9, 0., 1., 0.);
}`,Rt=`
#define RS 40.
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float per = KL * RS;
  float b = floor(id / per), r = id - b * per;
  if (b >= uNB) return;
  float L = floor(r / RS), j = r - L * RS;
  float rev = clamp(uReveal - L, 0., 1.) * smoothstep(.2, 1., uSheet);
  if (rev <= 0.) return;
  float zL = layerZ(L);
  float age = (zL - beadZ(b, uT)) / beadV(b);
  if (age < 0. || age > 6.5) return;
  vec2 c = beadPath(b, zL).xy;
  float rad = .5 + 4.6 * age + .2 * sin(uTime * 1.9 + b * 2.3 + L);
  float a0 = 6.28318 * j / RS, a1 = 6.28318 * (j + 1.) / RS;
  vec2 p0 = c + rad * vec2(cos(a0), sin(a0)), p1 = c + rad * vec2(cos(a1), sin(a1));
  float ef = panelFade(p0, L) * panelFade(p1, L);
  if (ef <= .01) return;
  A = vec3(p0, layerSurf(p0, L)); B = vec3(p1, layerSurf(p1, L));
  float nf = smoothstep(2., 9., distance((A + B) * .5, uCam));
  float f = smoothstep(0., .15, age) * exp(-age * .55);
  col = vec4(mix(FAM[int(b)], C_WHT, .25) * f * 1.1 * ef * rev * nf, 1.);
  par = vec4(1.1, 0., 1., 0.);
}`,Gt=`
#define NS 26.
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float b = floor(id / NS), k = id - b * NS;
  if (b >= uNB) return;
  vec4 s = uBead[int(b)];
  float T0 = uT - k * .07, T1 = uT - (k + 1.) * .07;
  if (T0 < s.w + .05) return;
  A = beadPos(b, T0); B = beadPos(b, max(T1, s.w));
  float f = 1. - k / NS;
  float far = 1. - smoothstep(-80., -84., A.z);
  col = vec4(mix(FAM[int(b)], C_WHT, .35) * f * f * 1.7 * far, 1.);
  par = vec4(.8 + 1.6 * f, 0., 1., k < .5 ? 1.2 : 0.);
}`,kt=`
#define NS 26.
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(0.); size = 0.; col = vec4(0.);
  float b = floor(id / NS), k = id - b * NS;
  if (b >= uNB) return;
  vec4 s = uBead[int(b)];
  float T0 = uT - k * .07;
  if (T0 < s.w + .05) return;
  pos = beadPos(b, T0);
  float f = 1. - k / NS, dc = distance(pos, uCam);
  float far = 1. - smoothstep(-80., -84., pos.z);
  size = (13. + 30. * f) * clamp(14. / max(dc, 2.), .5, 1.4);
  col = vec4(FAM[int(b)] * (.1 + .5 * f * f) * far * smoothstep(1., 5., dc), 1.);
}`,Bt=`
varying vec2 vXY; varying float vL, vFog;
void main(){
  float L = uL0 + float(gl_InstanceID);
  vL = L;
  vec2 h = sheetHalf(L);
  vec3 P = vec3(position.xy * h * 2., layerZ(L));
  vXY = P.xy;
  vec4 mv = viewMatrix * modelMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mv;
  vFog = exp(-uFog * length(mv.xyz));
}`,$t=`
varying vec2 vXY; varying float vL, vFog;
void main(){
  float L = vL;
  if (L < 0. || L > KL - 1.) discard;
  float rev = clamp(uReveal - L, 0., 1.) * smoothstep(.2, 1., uSheet);
  if (rev <= 0.) discard;
  float lv; vec3 A = act(L, vXY, lv);
  float e = panelFade(vXY, L);
  float nf = smoothstep(3., 16., abs(uCam.z - layerZ(L)));   // the floors near the camera are not a wash: they are lit pools far below
  gl_FragColor = vec4(A * .075 * e * e * rev * nf * vFog, 1.);
}`,_t=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(0.); size = 0.; col = vec4(0.);
  if (id >= uNB) return;
  vec4 s2 = uBeadA[int(id)];
  float c = clamp((uT - s2.x) / .7, 0., 1.);
  float born = smoothstep(.45, .95, c);
  pos = beadPos(id, uT);
  float dc = distance(pos, uCam);
  float far = 1. - smoothstep(-78., -83., pos.z);
  pos += vec3(sin(uTime * 1.7 + id * 2.1), cos(uTime * 1.3 + id * 3.7), sin(uTime * 1.1 + id)) * .3 * born;   // alive even when the scroll rests
  size = uBeadPx * clamp(15. / max(dc, 1.), .55, 1.3) * born * (1. + .8 * sin(c * 3.1416) + .08 * sin(uTime * 3. + id)) * far;
  col = vec4(mix(FAM[int(id)], C_WHT, .5) * 2.6, 1.);
}`,Dt=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  float a = h11(id * .731 + 11.), b = h11(id * 1.37 + 17.), c = h11(id * 2.11 + 13.), d = h11(id * 3.9 + 5.);
  pos = vec3((a - .5) * 46., (b - .5) * 24., -4. - c * 40.);
  pos += vec3(sin(uTime * .09 + id), cos(uTime * .11 + id * 1.3), 0.) * .35;
  size = 1.7 + 1.6 * d;
  float tw = .6 + .4 * sin(uTime * (.5 + d) + id);
  float dc = distance(pos, uCam);
  col = vec4(mix(C_VIO, C_LIL, d * d) * (.34 + .3 * a) * tw * smoothstep(.6, 4., dc) * (1. - .7 * min(uSheet, 1.)) * uField, 1.);
}`,Ot=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  float a = h11(id * .731), b = h11(id * 1.37 + 7.), c = h11(id * 2.11 + 3.), d = h11(id * 3.9 + 1.);
  pos = vec3((a - .5) * 74., (b - .5) * 42., 16. - c * 160.);
  pos += vec3(sin(uTime * .1 + id), cos(uTime * .13 + id * 1.3), 0.) * .6;
  size = 1.5 + 2.2 * d;
  float tw = .6 + .4 * sin(uTime * (.4 + d) + id);
  float dc = distance(pos, uCam);
  col = vec4(mix(C_VIO, C_LIL, d) * (.3 + .3 * a) * tw * smoothstep(.6, 4., dc) * uField, 1.);
}`;function Vt(a,t,l){const i=we(a,22,28,36),c=we(a,13,16,20),u=2,r=we(a,4,6,8),s=we(a,8,9,10),y=`#define GX ${i}.
#define GY ${c}.
#define MT ${u}.
#define SEG ${r}.
`,L=`${ge}${Le}${Ce}${Ct}`,d=`${L}${y}${zt}`,z=i*c*u*(r+1),P=fe({count:s*z,shared:t.G,uniforms:l,fog:.024,ends:d+Ft,order:4}),F=ve({count:s*i*c,shared:t.G,uniforms:l,fog:.02,atten:17,core:.55,pt:d+Pt,order:3}),R=fe({count:s*i*c*2,shared:t.G,uniforms:l,fog:.025,ends:d+Et,order:3}),g=fe({count:9*he.KL*40,shared:t.G,uniforms:l,fog:.017,ends:d+Rt,order:5}),B=fe({count:he.KL*4,shared:t.G,uniforms:l,fog:.012,ends:d+Mt,order:4}),T=fe({count:234,shared:t.G,uniforms:l,fog:.01,ends:`${L}${Gt}`,order:6}),U=ve({count:234,shared:t.G,uniforms:l,fog:0,atten:0,core:.2,pt:`${L}${kt}`,order:5,depthTest:!1}),oe=new Re(1,1),o=new at;o.index=oe.index,o.setAttribute("position",oe.getAttribute("position")),o.setAttribute("uv",oe.getAttribute("uv")),o.instanceCount=s;const f=new ye({uniforms:{...t.G,...l,uFog:{value:.017}},transparent:!0,depthWrite:!1,blending:ze,side:be,vertexShader:`uniform float uTime, uFog;
${d}${Bt}`,fragmentShader:`uniform float uTime;
${d}${$t}`}),M=new xe(o,f);M.frustumCulled=!1,M.renderOrder=2;const q=ve({count:9,shared:t.G,uniforms:l,fog:0,atten:0,core:.9,pt:`${L}${_t}`,order:7,depthTest:!1}),N=ve({count:we(a,1400,2800,4800),shared:t.G,uniforms:l,fog:.008,atten:0,core:.4,pt:`${ge}${Le}${Ce}${Ot}`,order:2});for(const w of[R,P,g,B,T])w.material.side=be;const Y=ve({count:we(a,900,1800,3200),shared:t.G,uniforms:l,fog:.006,atten:0,core:.4,pt:`${ge}${Le}${Ce}${Dt}`,order:2,depthTest:!1}),C=[Y,N,R,F,P,g,B,T,U,q];return{layers:{dust2:Y,dust:N,weft:R,points:F,threads:P,rings:g,plates:B,trails:T,glows:U,beads:q},meshes:[...C.map(w=>w.mesh),M],WIN:s,dispose(){for(const w of C)w.dispose();o.dispose(),oe.dispose(),f.dispose()}}}const Fe=[[.62,.8,1.6],[-.55,.55,1.3],[1.35,.4,1.1],[-1.3,.32,1]],De=128,We=40,Oe=.3,qt=`
uniform sampler2D uMap; uniform vec3 uCol; uniform float uA, uSq, uGlow, uHot, uSweep;
varying vec2 vUv;
void main(){
  vec2 q = vUv - .5; q.x /= max(uSq, .002);
  vec2 uv = q + .5;
  float inside = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
  float a = texture2D(uMap, uv).a * inside;
  float g = texture2D(uMap, uv, 2.5).a * inside;
  float glint = exp(-pow((uv.x - uSweep) / .09, 2.)) * 1.7;
  gl_FragColor = vec4(uCol * (a * (1. + uHot * 1.3 + glint) + g * (uGlow + glint * .4)) * uA, 1.);
}`,Nt=`
uniform float uA; varying vec2 vUv;
void main(){
  vec2 q = (vUv - .5) * 2.;
  float a = exp(-(q.x * q.x * 1.8 + q.y * q.y * 5.5)) * (1. - smoothstep(.8, 1., max(abs(q.x), abs(q.y))));
  gl_FragColor = vec4(0., 0., 0., a * uA);
}`,It=`
uniform sampler2D uDustTex; uniform vec2 uDustDim; uniform vec4 uWordC[9]; uniform float uDir;
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(0.); size = 0.; col = vec4(0.);
  vec4 d = texelFetch(uDustTex, ivec2(int(mod(id, uDustDim.x)), int(floor(id / uDustDim.x))), 0);
  if (d.z < -.5) return;
  int w = int(d.z + .5);
  vec4 C = uWordC[w];
  float c = clamp((uT - uBeadA[w].x) / ${n.convert.toFixed(2)}, 0., 1.);
  if (c <= 0.) return;
  float e = smoothstep(0., 1., clamp((c - d.w * .42) / .58, 0., 1.));
  if (e >= .999) return;
  vec3 P0 = vec3(C.x + uDir * d.x * C.z, C.y + d.y * C.w, 0.);
  vec3 B = vec3(C.x, C.y, 0.);
  float a = 6.2832 * h11(id * .31), rr = (.4 + h11(id * .7)) * C.w * .8;
  vec3 sw = vec3(cos(a + e * 4.), sin(a + e * 4.), 0.) * rr * sin(e * 3.1416);
  pos = mix(P0, B, e * e * (3. - 2. * e)) + sw * .55 + vec3(0., 0., 1.4 * sin(e * 3.1416) * (h11(id) - .3));
  size = (3. + 2.6 * h11(id * 1.7)) * (1. - e * .45);
  col = vec4(mix(C_LIL, C_WHT, .55) * (1. + 1.7 * sin(e * 3.1416)), 1.);
}`,Ue="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }";function Wt(a,t,l,i,c){const u=a.lang==="ar",r=Ke.question[a.lang].split(" ").map((x,O)=>{const E=Qe(x,{font:u?Ge.ar:Ge.sans,px:De,weight:u?600:500,rtl:u,align:"center",pad:We}),S=new ye({uniforms:{uMap:{value:E.tex},uCol:{value:new st(.96,.9,1.25)},uA:{value:0},uSq:{value:1},uGlow:{value:.9},uHot:{value:0},uSweep:{value:-5}},vertexShader:Ue,fragmentShader:qt,transparent:!0,depthWrite:!1,blending:ze}),G=new xe(new Re(1,1),S);return G.renderOrder=8,G.frustumCulled=!1,G.visible=!1,t.world.add(G),{text:x,tex:E,mesh:G,mat:S,wEm:(E.w-2*We)/De,x:0,y:0,row:0,idx:O}}),s=r.length;i.uNB.value=s;const y=new ye({uniforms:{uA:{value:0}},vertexShader:Ue,fragmentShader:Nt,transparent:!0,depthWrite:!1,blending:Ye}),L=new xe(new Re(1,1),y);L.renderOrder=6,L.frustumCulled=!1,L.visible=!1,t.world.add(L);const d=fe({count:s+24,shared:t.G,fog:0,order:9,depthTest:!1});d.material.side=be,l.add(d.mesh);const z=we(a,7,5,4),P=Xe(9),F=[];for(const x of r){const O=x.tex.tex.image,E=O.getContext("2d",{willReadFrequently:!0}),S=O.width,G=O.height,K=E.getImageData(0,0,S,G).data;for(let ee=2;ee<G;ee+=z)for(let ae=2;ae<S;ae+=z)K[(ee*S+ae)*4+3]>150&&F.push(ae/S-.5,.5-ee/G,x.idx,P())}const R=Math.max(1,F.length/4),g=128,B=Math.ceil(R/g),T=new Float32Array(g*B*4).fill(-1);T.set(F);const U=new lt(T,g,B,rt,nt);U.minFilter=U.magFilter=it,U.generateMipmaps=!1,U.needsUpdate=!0;const oe=Array.from({length:9},()=>new He),o=ve({count:g*B,shared:t.G,fog:0,atten:0,core:.7,order:9,depthTest:!1,uniforms:{...i,uDustTex:{value:U},uDustDim:{value:new Me(g,B)},uWordC:{value:oe},uDir:{value:c}},pt:`${ge}${Le}${Ce}${It}`});l.add(o.mesh),o.mesh.visible=!1;let f=1,M=[],q=20,N=12,Y=0,C=1.75,w=[],b="";const $=()=>{const x=a.viewport.portrait,O=a.viewport.aspect,E=`${x}-${O.toFixed(2)}`;if(E===b)return;b=E;const S=x?62:48;N=28*Math.tan(ct.degToRad(S/2)),q=N*O;const G=x?3:2,K=(x?.86:.7)*q;f=(x?.064:.088)*N*(u?1.1:1);const ee=(m,e)=>{let v=0;for(let p=m;p<e;p++)v+=r[p].wEm+(p>m?Oe:0);return v},ae=m=>{const e=[];if(m===1)e.push([]);else if(m===2)for(let h=1;h<s;h++)e.push([h]);else for(let h=1;h<s-1;h++)for(let k=h+1;k<s;k++)e.push([h,k]);let v=[],p=1e9;for(const h of e){const k=[0,...h,s];let I=0;for(let D=0;D<k.length-1;D++)I=Math.max(I,ee(k[D],k[D+1]));I<p&&(p=I,v=k)}return{e:v,w:p}};let j=ae(1);for(let m=1;m<=G&&(j=ae(m),!(j.w*f<=K));m++);j.w*f>K&&(f=K/j.w),M=[];for(let m=0;m<j.e.length-1;m++)M.push(Array.from({length:j.e[m+1]-j.e[m]},(e,v)=>j.e[m]+v));w=M.map(m=>ee(m[0],m[m.length-1]+1)),Y=(x?.1:.05)*N,C=1.75,M.forEach((m,e)=>{let v=-w[e]*f/2;for(const p of m){const h=r[p];h.row=e,h.x=v+h.wEm*f/2,h.y=Y+((M.length-1)/2-e)*C*f,v+=(h.wEm+Oe)*f;const k=h.tex.h/De*f;h.mesh.scale.set(h.tex.aspect*k,k,1),h.mesh.position.z=0}});const le=Math.max(...w)*f+9*f,ce=M.length*C*f+6*f;L.scale.set(le,ce,1),L.position.set(0,Y,-.4),r.forEach((m,e)=>{i.uBead.value[e].set(m.x,m.y,0,n.breakAt+e*n.breakStep+n.convert+n.hover),i.uBeadA.value[e].set(n.breakAt+e*n.breakStep,0,0,0),oe[e].set(m.x,m.y,m.mesh.scale.x,m.mesh.scale.y)});for(let m=s;m<9;m++)i.uBead.value[m].set(0,0,0,1e9),i.uBeadA.value[m].set(1e9,0,0,0)};$();const _=x=>1-Math.pow(1-x,4),[X,ie]=n.lineIn;return{words:r,layout:$,update(x,O){$();const E=O&&x<n.breakAt+s*n.breakStep+n.convert+.4;for(const e of r)e.mesh.visible=E;if(L.visible=E,d.mesh.visible=E,o.mesh.visible=E&&x>n.breakAt-.1,!E)return;const S=_(pe((x-X)/(ie-X))),G=Math.max(...w)*f/2,K=-(q*.5+G+3)*(1-S),ee=A(n.breakAt-.5,n.breakAt-.05,x),ae=!a.viewport.portrait;let j=0,le=0;const ce=Oe*f/2;for(const e of r){const v=e.idx,p=pe((x-(n.breakAt+v*n.breakStep))/n.convert);le+=p;const h=.28*A(.05,.35,S)+.72*A(.62+.02*v,.94+.02*v,S);e.mat.uniforms.uA.value=h*(1-A(.06,.46,p)),e.mat.uniforms.uSq.value=1,e.mat.uniforms.uHot.value=Math.sin(Math.PI*p)*.9+(1-S)*0,e.mat.uniforms.uGlow.value=.7+.5*(1-S)+.08*Math.sin(t.G.uTime.value*1.3+v*.7),e.mesh.position.set(c*(e.x+K),e.y,0);const k=-q*.5-2+(x-3)*17,I=e.wEm*f/2,D=(k-(e.x+K-I))/(2*I);e.mat.uniforms.uSweep.value=x>3&&x<5.2?u?1-D:D:-5;const se=M[e.row],V=se.indexOf(v),Z=e.wEm*f/2,re=e.x-Z-(V>0?ce:.14*f),H=e.x+Z+(V<se.length-1?ce:.14*f),Q=(re+H)/2,me=(H-re)/2-ee*(V>0&&V<se.length-1?ce:ce*.5),Pe=1-Math.pow(A(0,.8,p),.8),Te=e.y-.72*f,Ie=Math.max(me*Pe,0),Be=(.55+.45*S)*(1-A(.7,.95,p))*(.35+.65*A(.2,.6,S));d.set(j++,Q+K-Ie,Te,0,Q+K+Ie,Te,0,1.25*Be,1*Be,1.9*Be,1,ae?2:1.6,0,1,0)}for(let e=0;e<M.length;e++){r[M[e][0]];const v=r[M[e][M[e].length-1]],p=v.y-.72*f,h=v.x+v.wEm*f/2+.14*f+K,k=(1-S)*(q*.6)+.5*f,I=(1-ee)*(1-A(.2,1,le/s)),D=(1-S)*.6*f;d.set(j++,h-k*1.6,p,0,h+D+.2*f,p,0,1.9*I,1.5*I,2.7*I,1,ae?2.8:2.2,0,1,3);const se=Math.pow(1-S,1.3)*(1-ee);for(let V=0;V<Fe.length;V++){const Z=Fe[V][0],re=Fe[V][1],H=Fe[V][2],Q=h+(1-S)*.5*f-Z*.12*f;d.set(j++,Q-(1-S)*q*re*1.1-.2*f,p+Z*f,0,Q,p+Z*f,0,1.2*se,.95*se,2*se,1,H*(ae?1:.85),0,1,1.6)}}d.clear(j),d.dirty();const m=pe(A(.5,1,S)*(1-le/s*1.1));y.uniforms.uA.value=.78*m},dispose(){for(const x of r)x.tex.dispose(),x.mat.dispose(),x.mesh.geometry.dispose(),t.world.remove(x.mesh);y.dispose(),L.geometry.dispose(),t.world.remove(L),d.dispose(),l.remove(d.mesh),o.dispose(),l.remove(o.mesh),U.dispose()}}}const ne=a=>a.toFixed(3),Ut=a=>`
#define TLV ${a}.
const float TB[6] = float[6](3., 3., 3., 3., 2., 2.);
const float TLEN[6] = float[6](7.4, 6.0, 5.0, 4.2, 3.5, 3.0);
const float TWIN[6] = float[6](1., 0., 2., 0., 1., 0.);
const float TPR[6] = float[6](0., .06, .14, .24, .34, .44);
const float TSD[6] = float[6](.34, .22, .14, .1, .07, .05);
const vec3 TROOT = vec3(${Ee.map(ne).join(",")});
const float TS0 = ${ne(n.tree[0])}, LVT = ${ne(n.tree[1])}, DURB = ${ne(n.tree[2])}, TF = ${ne(n.found)}, RET = ${ne(n.retract)}, STR0 = ${ne(n.straight[0])}, STR1 = ${ne(n.straight[1])};
float tOff(float lv){ return lv < 1.5 ? 0. : lv < 2.5 ? 3. : lv < 3.5 ? 12. : lv < 4.5 ? 39. : lv < 5.5 ? 120. : 282.; }
float tLevel(float e){ return e < 3. ? 1. : e < 12. ? 2. : e < 39. ? 3. : e < 120. ? 4. : e < 282. ? 5. : 6.; }
// walk from the root down to a branch's node: its place (P), its parent's (Q), whether the way down is open (aliveP), whether
// this branch ends in a dead end, whether it is on the winning path, and when it is tried (tdel)
void treeWalk(float lv, float k, out vec3 P, out vec3 Q, out float aliveP, out float dead, out float win, out float tdel){
  P = TROOT; Q = TROOT; aliveP = 1.; dead = 0.; win = 1.; tdel = 0.;
  float anc = 1., azp = 0., key = 1.;
  vec3 pd = vec3(0., 0., -1.);
  for (int j = 0; j < 6; j++){
    if (float(j) >= lv) break;
    float S = 1.;
    for (int m = 1; m < 6; m++){ if (m > j && float(m) < lv) S *= TB[m]; }
    float d = mod(floor(k / S), TB[j]);
    key = fract(key * 7.31 + (d + 1.) * .371 + float(j) * .113 + .17) + 1.;
    float hr = h11(key * 17.31), hs = h11(key * 5.91 + 2.), ht = h11(key * 3.17 + 4.), hp = h11(key * 2.31 + 9.);
    win *= step(abs(d - TWIN[j]), .5);
    float dj = (1. - win) * step(hp, TPR[j]);
    if (float(j) == lv - 1.){ dead = dj; aliveP = anc; }
    anc *= (1. - dj);
    float polar = mix(.30, .80, float(j) / 5.) * (.75 + .5 * hs);
    float az = 6.2832 * (d + .6 * hr) / TB[j] + azp;
    vec3 nd = vec3(sin(polar) * cos(az), sin(polar) * sin(az), -cos(polar));
    vec3 dir = normalize(mix(pd, nd, .62));
    azp = az + 1.1 * (hs - .5);
    Q = P; P += dir * TLEN[j] * (.82 + .36 * ht); pd = dir;
    tdel += d * TSD[j] + .26 * h11(key * 9.1);
  }
}
// the winner straightens into the chain
vec3 chainAt(float v){ return vec3(0., 0., TROOT.z - 27. * v / TLV); }
vec3 crv(vec3 Q, vec3 P, vec3 perp, float bow, float u){ return mix(Q, P, u) + perp * sin(3.14159 * u) * bow; }
`,jt=`
#define SEGT 4.
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float e = floor(id / (SEGT + 1.)), s = id - e * (SEGT + 1.);
  if (e >= NE) return;
  float lv = tLevel(e), k = e - tOff(lv);
  vec3 P, Q; float aliveP, dead, win, tdel;
  treeWalk(lv, k, P, Q, aliveP, dead, win, tdel);
  if (aliveP < .5) return;
  float T = uT;
  float wig = 1. - smoothstep(STR0, STR1, T);
  if (win > .5){ P = foldP(mix(chainAt(lv), P, wig)); Q = foldP(mix(chainAt(lv - 1.), Q, wig)); }
  vec3 dv = P - Q;
  vec3 perp = normalize(cross(dv, vec3(0., 1., .001)) + 1e-4);
  float bow = (h11(tdel * 13.7 + lv * 3.1 + k * .37) - .5) * .5 * length(dv) * mix(1., wig, win);
  float tS = TS0 + (lv - 1.) * LVT + tdel * .9, tEnd = tS + DURB;
  float lit = clamp((T - tS) / DURB, 0., 1.);
  float sk = smoothstep(TS0 - 1.4 + (lv - 1.) * .09, TS0 - .8 + (lv - 1.) * .09, T);
  float tw = TF + (TLV - lv) * .11;
  float cry = win * smoothstep(tw, tw + .4, T);
  float fadeNW = 1. - (1. - win) * smoothstep(TF + 1.5, TF + 5., T);
  float ret = (1. - win) * smoothstep(RET + (TLV - lv) * .12, RET + (TLV - lv) * .12 + .8, T);
  float vis = 1. - ret;
  float since = max(T - tEnd, 0.);
  float ember = .1 + .5 * exp(-since * .7);
  float wl = mix(2.7, 1., (lv - 1.) / max(TLV - 1., 1.));
  if (s >= SEGT){
    // the pulse that tries this branch, or (on the chain) the one that runs down it
    float u1 = lit, u0 = max(lit - .32, 0.);
    float on = step(.001, lit) * step(lit, .999);
    vec3 pc = mix(C_LIL, C_WHT, .5);
    float br = 1.8;
    if (win > .5 && T > TF + 1.){
      float g = mod(uTime * 1.1 + 1.5, TLV + 4.);   // the chain's pulses run on the room's own clock, so they keep going when the scroll rests
      u1 = clamp(g - (lv - 1.), 0., 1.); u0 = clamp(g - (lv - 1.) - .6, 0., 1.);
      on = step(.001, u1 - u0) * smoothstep(TF + .8, TF + 1.8, T) * step(g, TLV + .6); br = 1.45;
    }
    if (on < .5 || sk <= 0.) return;
    u1 = min(u1, vis); u0 = min(u0, vis);
    if (u1 - u0 < .005) return;
    A = crv(Q, P, perp, bow, u0); B = crv(Q, P, perp, bow, u1);
    col = vec4(pc * br * fadeNW, 1.);
    par = vec4(max(wl * .75, 1.4), 0., 1., win > .5 && T > TF + 1. ? .9 : 1.6);
    return;
  }
  float u0 = s / SEGT, u1 = min((s + 1.) / SEGT, vis), us = (s + .5) / SEGT;
  if (u0 >= vis) return;
  float litF = step(us, lit);
  vec3 base = mix(C_VIO, C_LIL, .25);
  vec3 c = base * (.15 * sk * (1. - litF) + litF * ember);
  c = c * fadeNW + mix(C_LIL, C_WHT, .6) * cry * 1.25;
  A = crv(Q, P, perp, bow, u0); B = crv(Q, P, perp, bow, u1);
  col = vec4(c, 1.);
  par = vec4(mix(wl * .8, 2.8, cry), 0., 1., 0.);
}`,Zt=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = TROOT; size = 0.; col = vec4(0.);
  float T = uT;
  if (id < .5){
    // the root: the beads arrive here
    float arr = smoothstep(${ne(n.arrive-1.6)}, ${ne(n.arrive)}, T), dec = exp(-max(T - ${ne(n.arrive)}, 0.) * 1.4);
    size = (9. + 20. * dec) * arr;
    col = vec4(mix(C_LIL, C_WHT, .6) * (1.1 + 1.6 * dec), 1.) * arr;
    return;
  }
  float e = id - 1.;
  if (e >= NE) return;
  float lv = tLevel(e), k = e - tOff(lv);
  vec3 P, Q; float aliveP, dead, win, tdel;
  treeWalk(lv, k, P, Q, aliveP, dead, win, tdel);
  if (aliveP < .5) return;
  float wig = 1. - smoothstep(STR0, STR1, T);
  if (win > .5) P = foldP(mix(chainAt(lv), P, wig));
  pos = P;
  float tS = TS0 + (lv - 1.) * LVT + tdel * .9, tEnd = tS + DURB;
  float since = T - tEnd;
  float flash = step(0., since) * exp(-max(since, 0.) * 2.4);
  float tw = TF + (TLV - lv) * .11;
  float cry = win * smoothstep(tw, tw + .4, T);
  float fadeNW = 1. - (1. - win) * smoothstep(TF + 1.5, TF + 5., T);
  float ret = (1. - win) * smoothstep(RET + (TLV - lv) * .12 + .5, RET + (TLV - lv) * .12 + 1.1, T);
  float sk = smoothstep(TS0 - 1.4 + (lv - 1.) * .09, TS0 - .8 + (lv - 1.) * .09, T);
  float burst = win * exp(-max(T - tw, 0.) * 3.2) * step(tw, T);
  vec3 c = mix(C_VIO, C_LIL, .4) * (.3 + .7 * flash) * fadeNW;
  c = mix(c, mix(C_ROS, C_WHT, .25) * 2.2 * flash, dead * flash * .85);
  c += mix(C_LIL, C_WHT, .6) * (cry * 1.4 + burst * 2.4);
  size = (3. + 2.6 * flash + 3. * dead * flash + 5. * cry + 34. * burst + 2.5 * (1. - step(lv, 2.5))) * sk * (1. - ret);
  col = vec4(c * (1. - ret), 1.);
}`;function Ht(a,t,l){const i=we(a,5,6,6),c=i===5?282:606,u=`${ge}${Le}${Ce}${Je}${Ut(i)}#define NE ${c}.
`,r=fe({count:c*5,shared:t.G,uniforms:l,fog:.012,ends:u+jt,order:5});r.material.side=be;const s=ve({count:c+1,shared:t.G,uniforms:l,fog:.01,atten:0,core:.8,pt:u+Zt,order:6});return{edges:r,nodes:s,meshes:[r.mesh,s.mesh],dispose(){r.dispose(),s.dispose()}}}const qe=6,et=7,tt=10,ot=2.7,Yt=[de.cya,"#a58bff",de.amb],Xt=`
const float CZ[3] = float[3](${ue.z.map(a=>a.toFixed(2)).join(",")});
const vec3 FAMG[3] = vec3[3](C_CYA, vec3(.44, .24, 1.), C_AMB);
#define SUBS ${qe}.
#define NN ${et}.
#define EPG ${tt}.
const int EA[10] = int[10](0, 0, 0, 1, 2, 2, 3, 4, 5, 1);
const int EB[10] = int[10](1, 2, 3, 4, 4, 5, 5, 6, 6, 6);
const float ELY[10] = float[10](0., 0., 0., 1., 1., 1., 1., 2., 2., 1.);
const float NLY[7] = float[7](0., 1., 1., 1., 2., 2., 3.);
vec3 subCenter(float m, float s){
  float col = mod(s, 3.), row = floor(s / 3.);
  float zc = CZ[int(m)] + (col - 1.) * 3.15 + (h11(m * 7. + s * 3.1) - .5) * .6;
  float yc = -4.9 - row * 4.7 + (h11(m * 3. + s * 5.7) - .5) * .5;
  float xc = (h11(m * 11. + s * 2.3) - .5) * 6.;
  return vec3(xc, yc, zc);
}
vec3 subNode(float m, float s, float n){
  vec2 yz = n < .5 ? vec2(0., 0.) : n < 3.5 ? vec2(-1.2, (n - 2.) * 1.25) : n < 5.5 ? vec2(-2.4, (n - 4.5) * 1.6) : vec2(-3.5, 0.);
  float sc = .82 + .36 * h11(m * 9. + s * 4.), q = h11(m * 5. + s * 11. + n * 2.3);
  yz += (vec2(h11(q * 71.), h11(q * 37. + 3.)) - .5) * .55 * step(.5, n);
  float dx = (h11(m * 13. + s * 7. + n * 3.7) - .5) * 1.5;
  return subCenter(m, s) + vec3(dx, yz) * sc;
}
float groupGrow(float m, float s){ float t0 = ${n.minds[0]} + m * ${n.minds[1]} + s * ${n.minds[2]}; return smoothstep(t0, t0 + .8, uT); }
float groupAct(float m){ float a0 = ${n.act[0]} + m * ${n.act[1]}; return smoothstep(a0, a0 + 1., uT) * (1. - .45 * smoothstep(a0 + 3.4, a0 + 4.6, uT)); }
float cryFade(){ return 1. - .35 * smoothstep(.5, 1., uFold); }
// where a mind is in its pass: the signal's phase (0..1) runs down its three layers, then rests
float minePhase(float m, float s){ return fract(uTime * (.34 + .22 * h11(m * 5. + s * 9.)) + h11(m * 17. + s * 3.) * 9.); }
`,Kt=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(0.); size = 0.; col = vec4(0.);
  float m = floor(id / (SUBS * NN)), r = id - m * SUBS * NN, s = floor(r / NN), n = r - s * NN;
  float g = groupGrow(m, s);
  if (g <= 0.) return;
  float h = h11(id * .37 + 3.);
  pos = foldP(subNode(m, s, n));
  float act = groupAct(m);
  float ph = minePhase(m, s);
  float fl = exp(-pow((ph - NLY[int(n)] * .27 - .04) / .05, 2.)) * (.25 + .75 * act);
  float hub = n < .5 ? 1. : 0.;
  size = (3.6 + 1.6 * h + 3.2 * hub + 7. * fl) * g;
  vec3 c = mix(FAMG[int(m)], C_WHT, .25 + .45 * fl) * (.5 + .45 * hub + 1.5 * fl);
  col = vec4(c * cryFade(), 1.);
}`,Qt=`
void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){
  A = vec3(0.); B = vec3(0.); col = vec4(0.); par = vec4(0.);
  float per = SUBS * (EPG + 1.) * 2.;
  float m = floor(id / per), r = id - m * per, k = floor(r / 2.), dash = r - k * 2.;
  float s = floor(k / (EPG + 1.)), e = k - s * (EPG + 1.);
  float g = groupGrow(m, s);
  if (g <= 0.) return;
  vec3 a, b;
  float lay = 0.;
  if (e < EPG - .5){ int ei = int(e); a = subNode(m, s, float(EA[ei])); b = subNode(m, s, float(EB[ei])); lay = ELY[ei]; }
  else { a = vec3(0., -${(ot*.92).toFixed(2)}, CZ[int(m)]); b = subCenter(m, s); lay = -1.; }
  A = foldP(a); B = foldP(b);
  float act = groupAct(m);
  float link = step(EPG - .5, e);
  vec3 fc = FAMG[int(m)];
  if (dash < .5){
    col = vec4(fc * (.1 + .16 * link + .2 * act) * cryFade(), 1.);
    par = vec4(1., 0., g, 0.);
    return;
  }
  float ph = minePhase(m, s);
  float u = lay < -.5 ? fract(uTime * .5 + h11(m * 31. + s * 13.) * 9.) : (ph - lay * .27) / .27;   // the pulse's place along the link
  if (u < 0. || u > 1.) return;
  float d1 = u, d0 = max(u - .4, 0.);
  col = vec4(mix(fc, C_WHT, .4) * (.25 + 1.4 * act) * (1. + link) * cryFade() * step(u, g), 1.);
  par = vec4(1.5, d0, d1, 1.4);
}`,Jt=`
uniform vec3 uCol; uniform float uA, uOn, uPulse, uFill, uArc, uSpin;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - .5) * 2.;
  float R = .5, r = length(p), px = fwidth(r) * 1.3, d = r - R;
  float body = smoothstep(px, -px, d);
  float rim = smoothstep(.014 + px, .003, abs(d));
  float inner = smoothstep(.008 + px, .002, abs(r - R * .84)) * .3;
  float g = clamp(r / R, 0., 1.);
  float sheen = exp(-pow(length(p - vec2(-.17, .2)) / .22, 2.)) * .2;
  vec3 fill = uCol * (.015 + .2 * pow(g, 2.6) + sheen) * body * uFill;
  float ang = atan(p.x, p.y), a01 = fract(ang / 6.2832 + 1.);
  float rr = R * 1.17;
  float ring2 = smoothstep(.01 + px, .002, abs(r - rr));
  float on = step(.001, uArc);
  float arc = ring2 * (1. - smoothstep(uArc - .003, uArc + .003, a01)) * on;
  float head = exp(-pow((a01 - uArc) / .012, 2.)) * ring2 * on * step(uArc, .999);
  float sat = exp(-pow(length(p - rr * vec2(sin(uSpin), cos(uSpin))) / .018, 2.)) * on;
  float halo = exp(-max(d, 0.) * 7.5) * (1. - body) * .5 * (1. - smoothstep(.62, .98, r));
  float pr = exp(-pow((r - R * (1. + .7 * uPulse)) / .03, 2.)) * (1. - uPulse) * step(.001, uPulse);
  vec3 col = fill + uCol * (rim * 1.5 + inner * uFill + halo * uOn + arc * .55 + head * 2.4 + sat * 2.2 + pr * 1.5);
  gl_FragColor = vec4(col * uA, 1.);
}`,eo=`
uniform float uA; varying vec2 vUv;
void main(){
  float r = length((vUv - .5) * 2.), px = fwidth(r) * 1.3;
  gl_FragColor = vec4(vec3(.012, .008, .035), smoothstep(.5 + px, .5 - px, r) * .93 * uA);
}`,to=`
uniform sampler2D uMap; uniform vec3 uCol; uniform float uA;
varying vec2 vUv;
void main(){
  float a = texture2D(uMap, vUv).a, g = texture2D(uMap, vUv, 2.5).a;
  gl_FragColor = vec4(uCol * (a * 1.15 + g * .5) * uA, 1.);
}`,Ve="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }";function oo(a,t,l,i){const c=`${ge}${Le}${Ce}${Je}${Xt}`,u=ve({count:3*qe*et,shared:t.G,uniforms:l,fog:.01,atten:0,core:.7,pt:c+Kt,order:6}),r=fe({count:3*qe*(tt+1)*2,shared:t.G,uniforms:l,fog:.01,ends:c+Qt,order:5});r.material.side=be;const s=a.lang==="ar",y=Ke.method[a.lang],L=ot,d=2*L/.5,z=new Re(1,1),P=y.map((o,f)=>{const M=new J(...Ne(Yt[f])),q=new ye({uniforms:{uCol:{value:M},uA:{value:0},uOn:{value:0},uPulse:{value:0},uFill:{value:0},uArc:{value:0},uSpin:{value:0}},vertexShader:Ve,fragmentShader:Jt,transparent:!0,depthWrite:!1,blending:ze}),N=new xe(z,q);N.renderOrder=7,N.frustumCulled=!1,N.visible=!1;const Y=new ye({uniforms:{uA:{value:0}},vertexShader:Ve,fragmentShader:eo,transparent:!0,depthWrite:!1,blending:Ye}),C=new xe(z,Y);C.renderOrder=6.7,C.frustumCulled=!1,C.visible=!1;const w=Qe(o,{font:s?Ge.ar:Ge.mono,px:128,weight:700,rtl:s,align:"center",pad:30}),b=new ye({uniforms:{uMap:{value:w.tex},uCol:{value:new J(1.05,.98,1.3)},uA:{value:0}},vertexShader:Ve,fragmentShader:to,transparent:!0,depthWrite:!1,blending:ze}),$=new xe(z,b);return $.renderOrder=8,$.frustumCulled=!1,$.visible=!1,t.world.add(C),t.world.add(N),t.world.add($),{mesh:N,mat:q,occ:C,omat:Y,label:$,lmat:b,tex:w}}),F=fe({count:8,shared:t.G,fog:0,order:7,depthTest:!1});F.material.side=be;const R=new J,g=new J,B=new J,T=new J,U=o=>ue.z[0]+(ue.z[2]-ue.z[0])*o,oe=o=>pe((o-n.flow[0])/(2*n.flow[1]));return{meshes:[u.mesh,r.mesh,F.mesh],update(o,f,M,q){M.getWorldDirection(g);const N=oe(o),Y=A(n.flow[0]-.1,n.flow[0]+.2,o)*(1-A(n.flow[0]+2*n.flow[1]+.2,n.flow[0]+2*n.flow[1]+.7,o));for(let w=0;w<8;w++){const b=Math.max(N-w*.05,0),$=Math.max(N-(w+1)*.05,0),_=(1-w/8)*Y;_e([0,ue.y,U(b)],f,B),_e([0,ue.y,U($)],f,T),F.set(w,B.x,B.y,B.z,T.x,T.y,T.z,1.5*_*_,1.25*_*_,2.2*_*_,_>.01?1:0,2.4-w*.18,0,1,w===0?1.5:0)}F.dirty();const C=Math.exp(-Math.pow((o-(n.flow[0]+2*n.flow[1]+.55))/.3,2));for(let w=0;w<P.length;w++){const b=P[w],$=n.disc[0]+w*n.disc[1],_=A($,$+1,o),X=_<1?1+.12*Math.sin(_*Math.PI):1,ie=1-A(.12,.55,f),x=q&&_>0&&ie>0;if(b.mesh.visible=b.occ.visible=b.label.visible=x,!x)continue;_e([0,ue.y,ue.z[w]],f,R),R.x*=i;const O=d*(.35+.65*_)*X*(1-.5*f);b.mesh.position.copy(R),b.mesh.quaternion.copy(M.quaternion),b.mesh.scale.setScalar(O),b.occ.position.copy(R).addScaledVector(g,-.02),b.occ.quaternion.copy(M.quaternion),b.occ.scale.setScalar(O),b.label.position.copy(R).addScaledVector(g,-.08),b.label.quaternion.copy(M.quaternion);const E=n.act[0]+w*n.act[1],S=A(E+3.4,E+4.2,o),G=A(E,E+1,o),K=n.flow[0]+w*n.flow[1];b.mat.uniforms.uA.value=_*ie,b.omat.uniforms.uA.value=_*ie,b.mat.uniforms.uOn.value=.5+.5*G+.35*S+.5*C,b.mat.uniforms.uFill.value=.5+.9*G+.5*S+.6*C,b.mat.uniforms.uPulse.value=o>=K?pe((o-K)/1.3):pe((o-($+.5))/1.4),b.mat.uniforms.uArc.value=o>E?pe((o-E)/3.4):0,b.mat.uniforms.uSpin.value=t.G.uTime.value*(.9+.25*w),b.lmat.uniforms.uA.value=A($+.4,$+1.1,o)*ie*(.6+.3*G+.15*S+.25*C);const ee=b.tex.h/128*(s?1.2:1.05)*(1-.4*f);b.label.scale.set(b.tex.aspect*ee,ee,1)}},dispose(){u.dispose(),r.dispose(),F.dispose(),z.dispose();for(const o of P)o.mat.dispose(),o.omat.dispose(),o.lmat.dispose(),o.tex.dispose(),t.world.remove(o.mesh),t.world.remove(o.occ),t.world.remove(o.label)}}}const ao=`
${ht}
${ge}
uniform float uA, uLat, uReveal, uRim, uTime, uAsp, uViewH, uDir, uSwX, uSwA;
varying vec2 vUv; varying float vFace, vAx; varying vec3 vN, vV, vBary, vEdge;
// pivot E's lattice, drawn on the facet: pu is the surface in screen-height units, its origin the middle of the screen the
// camera ends square to. At the camera's last place this is the pivot's own picture.
vec3 latticeE(vec2 pu, out float fade){
  float px = max(fwidth(pu.x), fwidth(pu.y));
  vec2 p = pu + vec2(uAsp * .5, .5);
  p += (vec2(fbm(p * 1.4 + 3.), fbm(p * 1.4 + 17.)) - .5) * .05;
  float s = .095, hh = s * .8660254;
  vec2 n1 = vec2(-.8660254, .5), n2 = vec2(.8660254, .5);
  vec2 t0 = vec2(1., 0.), t1 = vec2(.5, .8660254), t2 = vec2(.5, -.8660254);
  float c0 = p.y / hh, c1 = dot(p, n1) / hh, c2 = dot(p, n2) / hh;
  float d0 = abs(fract(c0 + .5) - .5) * hh, d1 = abs(fract(c1 + .5) - .5) * hh, d2 = abs(fract(c2 + .5) - .5) * hh;
  float lw = px * .55;
  float e0 = smoothstep(lw + px, lw - px * .2, d0) * (.3 + .7 * h12(vec2(floor(c0 + .5), floor(dot(p, t0) / s) + 1.3)));
  float e1 = smoothstep(lw + px, lw - px * .2, d1) * (.3 + .7 * h12(vec2(floor(c1 + .5) + 7., floor(dot(p, t1) / s) + 5.1)));
  float e2 = smoothstep(lw + px, lw - px * .2, d2) * (.3 + .7 * h12(vec2(floor(c2 + .5) + 13., floor(dot(p, t2) / s) + 9.7)));
  float nd = max(max(d0, d1), d2), node = smoothstep(px * 2.6, px * .6, nd);
  float shim = .85 + .15 * sin(uTime * .5 + h12(floor(p / s)) * 6.28318);
  fade = 1. - smoothstep(s * .07, s * .22, px);
  float sw = 1. + uSwA * 1.7 * exp(-pow((pu.x - uSwX) / .13, 2.));   // the crystal's last light runs out along its lattice
  return (S(vec3(.78, .83, .91)) * (e0 + e1 + e2) * .62 * shim + S(vec3(.95, .97, 1.)) * node * .9 * shim + S(vec3(.7, .78, .95)) * node * .12 * smoothstep(px * 14., 0., nd)) * sw;
}
void main(){
  vec3 n = normalize(vN), V = normalize(vV);
  float ndv = clamp(dot(n, V), 0., 1.);
  float rim = pow(1. - ndv, 3.2);
  float zt = clamp(vAx * .5 + .5, 0., 1.);
  vec3 tint = zt < .5 ? mix(C_CYA, vec3(.5, .34, 1.), zt * 2.) : mix(vec3(.5, .34, 1.), C_AMB, (zt - .5) * 2.);
  tint = mix(tint, vec3(.62, .5, 1.), .3);
  float hf = fract(vFace * 7.3 + .21);
  float sp = pow(.5 + .5 * sin(uTime * .8 + vFace * 60.), 14.);
  float rv = smoothstep(zt * .5, zt * .5 + .3, uReveal);
  // each facet is a dark pane with its border lit (only the real edges, not the diagonal of a quad)
  vec3 w = vBary / max(fwidth(vBary), vec3(1e-5));          // pixels to the edge opposite each corner
  float dpx = min(min(vEdge.x > .5 ? w.x : 1e5, vEdge.y > .5 ? w.y : 1e5), vEdge.z > .5 ? w.z : 1e5);
  float border = exp(-dpx / 2.2) * .85 + exp(-dpx / 16.) * .5;
  float lit = .55 + 1.0 * hf;
  vec3 body = tint * (.03 + border * lit * .55 + rim * .5 + .5 * sp * border) * uRim * rv;
  float fade; vec3 lat = latticeE(vec2(vUv.x * uDir, vUv.y) / uViewH, fade) * fade * uLat * rv;
  gl_FragColor = vec4((body + lat) * uA, 1.);
}`,so=`
attribute vec2 aUV; attribute float aFace; attribute float aAx; attribute vec3 aBary; attribute vec3 aEdge;
varying vec2 vUv; varying float vFace, vAx; varying vec3 vN, vV, vBary, vEdge;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz);
  vUv = aUV; vFace = aFace; vAx = aAx; vBary = aBary; vEdge = aEdge;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,lo=`
uniform vec3 uVert[26];
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(0.); size = 0.; col = vec4(0.);
  float a = clamp(uCry, 0., 1.);
  if (a <= 0.) return;
  pos = uVert[int(id)];
  float tw = .5 + .5 * sin(uTime * (.9 + h11(id * 3.1)) + id * 7.);
  size = (3.2 + 3.4 * tw) * a;
  col = vec4(mix(C_LIL, C_WHT, .5) * (.5 + 1.1 * tw) * a, 1.);
}`,ro=`
void pt(float id, out vec3 pos, out float size, out vec4 col){
  pos = vec3(${te.c.map(a=>a.toFixed(3)).join(",")});
  float a = smoothstep(.0, 1., uCry);
  size = 90. * a;
  col = vec4(vec3(.5, .36, 1.) * .22 * a, 1.);
}`;function no(a,t,l,i){const{R:c,half:u,ringZ:r,ringR:s}=ke,y=Xe(11),L=(e,v,p)=>Array.from({length:6},(h,k)=>{const I=(30+60*k)*Math.PI/180,D=c*v*(1+(y()-.5)*p);return new J(D*Math.cos(I),D*Math.sin(I),e+(y()-.5)*p*5)}),d=L(r[0],s[0],.16),z=L(r[1],s[1],0),P=L(r[2],s[2],0),F=L(r[3],s[3],.16),R=new J((y()-.5)*.8,(y()-.5)*.8,-u),g=new J((y()-.5)*.8,(y()-.5)*.8,u),B=[],T=(e,v,p,h,k=!1)=>{B.push({v:[e,v,p],real:[1,1,0],band:k},{v:[e,p,h],real:[0,1,1],band:k})};for(let e=0;e<6;e++){const v=(e+1)%6;B.push({v:[R,d[v],d[e]],real:[1,1,1],band:!1}),T(d[e],d[v],z[v],z[e]),T(z[e],z[v],P[v],P[e],!0),T(P[e],P[v],F[v],F[e]),B.push({v:[g,F[e],F[v]],real:[1,1,1],band:!1})}const U=[],oe=[],o=[],f=[],M=[],q=[],N=[],Y=new J(0,0,-1),C=new J,w=new J,b=new J,$=new J;B.forEach((e,v)=>{const[p,h,k]=e.v;C.copy(h).sub(p).cross(k.clone().sub(p)).normalize(),$.copy(p).add(h).add(k).multiplyScalar(1/3);const I=C.dot($)<0;I&&C.negate(),e.band&&$.copy(C).multiplyScalar(C.dot(p)),w.copy(Y).addScaledVector(C,-Y.dot(C)).normalize(),b.copy(C).cross(w);const D=[e.real[1],e.real[2],e.real[0]],se=I?[0,2,1]:[0,1,2];for(const V of se){const Z=e.v[V];U.push(Z.x,Z.y,Z.z),oe.push(C.x,C.y,C.z);const re=Z.clone().sub($);o.push(re.dot(w),re.dot(b)),f.push(v*.6180339%1),M.push(Z.z/u),q.push(V===0?1:0,V===1?1:0,V===2?1:0),N.push(D[0],D[1],D[2])}});const _=new ut,X=(e,v,p)=>_.setAttribute(e,new vt(v,p));X("position",U,3),X("normal",oe,3),X("aUV",o,2),X("aFace",f,1),X("aAx",M,1),X("aBary",q,3),X("aEdge",N,3);const ie=Lt({color:"#9b82ff",fill:.02,rim:.5,pow:3,side:be,alpha:0}),x=new xe(_,ie.mat),O=new ye({uniforms:{uA:{value:0},uLat:{value:0},uReveal:{value:0},uRim:{value:1},uTime:t.G.uTime,uAsp:{value:a.viewport.aspect},uViewH:{value:ke.cell/.095},uDir:{value:i},uSwX:{value:-9},uSwA:{value:0}},vertexShader:so,fragmentShader:ao,transparent:!0,depthWrite:!1,blending:ze,side:ft}),E=new xe(_,O);for(const e of[x,E])e.position.set(...te.c),e.frustumCulled=!1,e.renderOrder=5,e.visible=!1,l.add(e);E.renderOrder=6;const S=[];for(const e of[d,z,P,F])for(let v=0;v<6;v++)S.push([e[v],e[(v+1)%6]]);for(let e=0;e<6;e++)S.push([d[e],z[e]],[z[e],P[e]],[P[e],F[e]],[R,d[e]],[g,F[e]]);const G=fe({count:S.length,shared:t.G,fog:0,order:7,depthTest:!1});G.material.side=be,l.add(G.mesh),G.mesh.visible=!1;const K=[...d,...z,...P,...F,R,g],ee=K.map(e=>new J(e.x+te.c[0],e.y+te.c[1],e.z+te.c[2])),ae={value:0},j=ve({count:26,shared:t.G,uniforms:{uVert:{value:ee},uCry:ae},fog:0,atten:0,core:.8,pt:`${ge}${Le}uniform float uCry;${lo}`,order:8,depthTest:!1}),le=ve({count:1,shared:t.G,uniforms:{uCry:ae},fog:0,atten:0,core:.3,pt:`uniform float uCry;${ro}`,order:2,depthTest:!1});l.add(j.mesh,le.mesh),j.mesh.visible=le.mesh.visible=!1;const ce=Ne(de.lil),m=[x,E,G.mesh,j.mesh,le.mesh];return{meshes:[x,E,G.mesh,j.mesh,le.mesh],setAspect(e){O.uniforms.uAsp.value=e},sweep(e,v){const p=(a.viewport.aspect+.5)/2;O.uniforms.uSwX.value=i*(e-.5)*2*p,O.uniforms.uSwA.value=v},update(e,v){const p=e>.5;for(let H=0;H<m.length;H++)m[H].visible=p;if(!p)return;const h=A(.55,1,e),k=h*1.35,I=1-Math.pow(1-h,3),D=.6+.4*I,se=(1-I)*(1-I)*.9,V=Math.cos(se)*D,Z=Math.sin(se)*D;x.scale.setScalar(D),E.scale.setScalar(D),x.rotation.z=E.rotation.z=se;for(let H=0;H<K.length;H++){const Q=K[H];ee[H].set(te.c[0]+V*Q.x-Z*Q.y,te.c[1]+Z*Q.x+V*Q.y,te.c[2]+Q.z*D)}ie.U.uAlpha.value=h*(1-v),O.uniforms.uA.value=h,O.uniforms.uLat.value=v,O.uniforms.uReveal.value=k,O.uniforms.uRim.value=1-v,ae.value=h*(1-v);const re=(.35+.8*h)*(1-v);for(let H=0;H<S.length;H++){const Q=S[H][0],me=S[H][1],Pe=(Q.z+me.z)/2/u*.5+.5,Te=A(Pe*.5,Pe*.5+.3,k);G.set(H,te.c[0]+V*Q.x-Z*Q.y,te.c[1]+Z*Q.x+V*Q.y,te.c[2]+Q.z*D,te.c[0]+V*me.x-Z*me.y,te.c[1]+Z*me.x+V*me.y,te.c[2]+me.z*D,ce[0]*2.2*re*Te,ce[1]*2.2*re*Te,ce[2]*2.2*re*Te,1,1.15,0,1,0)}G.dirty()},dispose(){_.dispose(),ie.mat.dispose(),O.dispose(),G.dispose(),j.dispose(),le.dispose()}}}const Ae=Math.PI/180,W=(a,t,l,i,c,u=0,r)=>{const s=Math.cos(i*Ae),y=30;return{t:a,p:t,l:r??[t[0]-Math.sin(l*Ae)*s*y,t[1]+Math.sin(i*Ae)*y,t[2]-Math.cos(l*Ae)*s*y],fov:c,roll:u*Ae}},je=(a,t)=>t?1:Math.round(Math.min(1.85,Math.max(1,1.95/a))*20)/20;function Ze(a,t,l=1){const i=t?.74:1,c=t?1.2:1,u=t?1.34:1,r=t?90:0,s=te.c,y=ke.apo,L=48*(t?1.29:1),d=ke.cell/(.19*Math.tan((t?56:40)*Ae/2)),[z,P]=n.push,F=[W(0,[0,0,14],0,0,L,0),W(5,[0,.25,12.6],0,0,L,0),W(7.4,[0,.35,8.6],1,-.5,48*u,0),W(9.2,[.4*i,.55,4.2],3,-1,50*u,0),W(10.8,[.9*i,.9,-2.6],6,-1.5,51*u,r*.06),W(12.2,[2.6*i,1.5,-12.5],14,-3,52*u,r*.4-2),W(13.8,[7*c,2.3,-24],29,-5,52*u,r*.85-4),W(15.4,[12*c,3,-35],40,-6,52*u,r-2),W(17,[16*c,2.8,-47],44,-5,51*u,r),W(19.2,[14*c,2.2,-66],44,-4,50*u,r+1.5),W(22,[12*c*(1+(l-1)*.5),1.6,-75],56,-4,48*u,r+2.5,[0,0,-88]),W(25,[26*l,2.4,-93+(l-1)*6],84,-5,46*u,r,[0,-.4,-97]),W(28.8,[23*l*(t?1.1:1),2,-94],90,-4,45*u,r,[0,-1,-96]),W(31.4,[26*l*(t?1.2:1),2.2,-92],90,-4,44*u,r,[0,-2.4,-96.5]),W(33.6,[24*l*(t?1.3:1),1.3,-93.5],90,-4,44*u,r,[0,-3.6,-97]),W(36,[22.5*l*(t?1.3:1),.8,-99],90,-4,44*u,r,[0,-3.6,-99.2]),W(38.4,[24*l*(t?1.3:1),1,-101],90,-3,44*u,r,[0,-3.4,-98.5]),W(z,[25*l,-.5,-99.2],90,-1,44*u,r,[0,s[1],s[2]]),W(z+(P-z)*.55,[y+d+6,s[1],s[2]],90,0,42*u,r*.4,[y,s[1],s[2]]),{...W(P,[y+d,s[1],s[2]],90,0,t?56:40,0,[y,s[1],s[2]]),hold:!0},{...W(48,[y+d,s[1],s[2]],90,0,t?56:40,0,[y,s[1],s[2]]),hold:!0}],R=g=>({...g,p:[a*g.p[0],g.p[1],g.p[2]],l:[a*g.l[0],g.l[1],g.l[2]],roll:a*(g.roll??0)});return Tt(F.map(R))}const io=`
uniform float uHaze, uMist, uEnd, uDfade, uLatK, uShock, uPlanK;
uniform vec2 uFocus, uRootUV, uPlanUV;
vec3 look(vec2 uv){
  vec3 w = samp(uv);
  vec3 b = bloom(uv);
  vec2 q = (uv - .5) * vec2(uAsp, 1.);
  float hz = exp(-length((uv - uFocus) * vec2(uAsp, 1.)) * 1.7);
  vec3 g = S(vec3(.005, .003, .013)) + S(vec3(.16, .06, .38)) * .55 * hz * uHaze;
  float m = fbm(q * 1.5 + vec2(uTime * .012, 3.1));
  g += S(vec3(.09, .04, .24)) * m * m * .55 * uMist;
  g = mix(g, pivotD(uv), uDfade);                       // the question arrives over the pivot's own field, which hands over to the loom's first floor
  vec3 c = g + w + b * .85 * (1. - uLatK);              // the pivot that ends the room has no bloom: the last lattice is drawn bare
  // the beads reach the root: a shock ring runs out from it, and its core flares (in screen space, at the root's own place)
  vec2 dq = (uv - uRootUV) * vec2(uAsp, 1.);
  float rr = length(dq), sh = step(0., uShock);
  c += S(vec3(.62, .5, 1.)) * sh * (exp(-pow((rr - uShock * 1.15) / (.011 + .026 * uShock), 2.)) * .5 * exp(-uShock * 2.6) + exp(-rr * rr * 110.) * .6 * exp(-uShock * 3.2));
  // the plan is whole: the chain flares once, where it hangs
  vec2 pq = (uv - uPlanUV) * vec2(uAsp, 1.);
  c += S(vec3(.5, .4, 1.)) * uPlanK * exp(-dot(pq, pq) * 5.);
  return mix(c, pivotE(uv), uEnd);
}`;async function mo(a){await mt(gt);const t=wt(a),l=At(),i=xt(a,{pin:"D",pout:"E",msaa:!1,frag:io,uniforms:{uHaze:{value:1},uMist:{value:0},uEnd:{value:0},uDfade:{value:1},uLatK:{value:0},uShock:{value:-1},uPlanK:{value:0},uFocus:{value:new Me(.5,.32)},uRootUV:{value:new Me(-9,0)},uPlanUV:{value:new Me(-9,0)}}}),c=new dt(48,a.viewport.aspect,.05,420),u=new pt;u.scale.x=t,i.world.add(u);const r=Vt(a,i,l);for(const T of r.meshes)u.add(T);await $e();const s=Wt(a,i,u,l,t),y=Ht(a,i,l);for(const T of y.meshes)u.add(T);await $e();const L=oo(a,i,l,t);for(const T of L.meshes)u.add(T);const d=no(a,i,u,t);await $e();let z=a.viewport.portrait,P=je(a.viewport.aspect,z),F=Ze(t,z,P);const R=new J,g=new J,B=(T,U,oe)=>{const o=T*St;l.uT.value=o,F(o,c);const f=o>n.arrive?Math.exp(-(o-n.arrive)*5.5):0;f>.002&&(c.position.x+=Math.sin(o*47)*.1*f,c.position.y+=Math.cos(o*41)*.08*f);const M=bt(a,U,oe),q=1-A(.86,.92,T);q>0&&(c.translateX(M.x*.5*q),c.translateY(M.y*.3*q)),c.updateMatrixWorld(),l.uCam.value.set(t*c.position.x,c.position.y,c.position.z);const N=(-c.position.z-he.Z0)/he.DZ;l.uL0.value=pe(Math.floor(N)-2,0,he.KL-r.WIN);const Y=A(2.2,7,o);l.uField.value=Y,i.U.uDfade.value=1-Y,l.uReveal.value=Y*1.4+A(5.4,11,o)*13,l.uBeadPx.value=a.viewport.portrait?34:44,l.uThr.value=A(5.6,9,o),l.uSheet.value=A(7.5,13,o)+A(26,34,o);const C=A(n.fold[0],n.fold[1],o);l.uFold.value=C;const w=o<35,b=o>17.5&&o<44,$=o>27.5&&o<44;for(const X of r.meshes)X.visible=w;for(const X of y.meshes)X.visible=b;for(const X of L.meshes)X.visible=$;s.update(o,o<n.loom[0]+1),L.update(o,C,c,$);const _=A(n.push[0]+.4,n.push[1],o);d.update(C,_),i.U.uLatK.value=_,d.sweep(pe((o-43.7)/1.8),(1-A(45,45.9,o))*A(43.5,43.9,o)),i.U.uHaze.value=(.45+.55*(1-A(3,11,o)))*(1-A(38,43,o)),i.U.uMist.value=A(5,12,o)*(1-A(.9,.95,T)),R.set(t*Ee[0],Ee[1],Ee[2]).project(c),i.U.uRootUV.value.set(R.z<1?R.x*.5+.5:-9,R.y*.5+.5),i.U.uShock.value=o-n.arrive,g.set(t*0,ue.y,ue.z[1]).project(c),i.U.uPlanUV.value.set(g.z<1?g.x*.5+.5:-9,g.y*.5+.5),i.U.uPlanK.value=.22*Math.exp(-Math.pow((o-(n.flow[0]+2*n.flow[1]+.55))/.3,2)),i.U.uEnd.value=A(.925,.985,T)};B(.9,0,.016),s.update(2,!0),L.update(33,0,c,!0);for(const T of[...r.meshes,...y.meshes,...L.meshes,...d.meshes])T.visible=!0;return await i.warm(c),B(0,0,.016),{scene:i.scene,camera:c,update({p:T,t:U,dt:oe,v:o}){i.tick(U,o),i.setP(T),B(T,U,oe),i.draw(c)},resize(){i.resize(),c.aspect=a.viewport.aspect,c.updateProjectionMatrix();const T=je(a.viewport.aspect,a.viewport.portrait);(z!==a.viewport.portrait||T!==P)&&(z=a.viewport.portrait,P=T,F=Ze(t,z,P)),s.layout(),d.setAspect(a.viewport.aspect)},dispose(){s.dispose(),r.dispose(),y.dispose(),L.dispose(),d.dispose(),i.dispose()}}}export{mo as default};
