import{V as T,a6 as Ye,a2 as Je,p as Be,s as Le,C as fe,t as Se,i as be,a4 as Me,a5 as Ae,M as me,a as Ee,G as ze,Y as Pe,ab as Ne,_ as Te,a0 as et,a1 as tt,aM as ot,b as st,Q as at,P as nt}from"./EditionWorld.astro_astro_type_script_index_0_lang.B6nfWhaD.js";import{p as Fe,C as Ke,b as We,l as xe,h as we,F as ke,g as He,s as rt,d as it,c as ct,e as lt}from"./lines.D8CnBSb7.js";import{g as ut,a as dt}from"./glyphs.DXIXJ2EW.js";import{r as vt}from"./rig.DUcVWY7J.js";import{s as ft}from"./mk.DKSNb5ei.js";import{l as qe,b as Ze}from"./glow.DtyPQKgD.js";import{C as ht}from"./plan.Bzh-bcoD.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ge=(o,a,e)=>[o**2.2,a**2.2,e**2.2],X={silver:Ge(.81,.84,.89),ice:Ge(.91,.95,1),cyan:Ge(.42,.84,1),amber:Ge(1,.72,.32),grey:Ge(.64,.66,.71),red:Ge(1,.23,.29),blue:Ge(.23,.42,1)},ye="float sst(float a, float b, float x){ float d = b - a; d = d == 0. ? 1e-9 : d; float t = clamp((x - a) / d, 0., 1.); return t * t * (3. - 2. * t); }",pt=48,A=(o,a,e)=>Je((o-a)/(e-a)),q=(o,a,e)=>Ye(a,e,o),ve=o=>1-(1-o)**3,he=o=>o<.5?4*o*o*o:1-(-2*o+2)**3/2,ge=(o,a,e)=>o+(a-o)*e;function $e(o){const a=o?3.3:6.2,e=o?9.4:6.4,n=-34,i=.62,t=i/.095,s=o?60:40,m=t/(2*Math.tan(Be.degToRad(s/2))),v=o?1.9:3.3,f=o?.68:.7,c=[-13,-14.75,-16.5,-18.25,-20,-21.75],z=[1,0,2,3,0,1],l=[2,0,1,0,0,2],d=[2.6,3.1,3.3,2.5,2.8,3.2],F=[.78,.7,.64,.84,.82,.66],h=c.map((M,r)=>({x:(r%2?-1:1)*v,z:M,h:d[r]*(o?.78:.85),r:.6*f,kind:z[r],hue:l[r],lvl:F[r],y0:o?((r>>1)+r%2)%2*3.9:0,t0:2.6+r*.5})),b=a/6.2;return{tall:o,W:a,HH:e,ZB:n,S:i,H0:t,fov:s,d0:m,vessels:h,doorX:[-4.4*b,0,4.4*b],doorW:2.5*(o?.62:1),doorH:4.3,kin:new T(2.15*b,2.35,n+6.7),mOut:new T(-2.2*b,2.9,n-5.2),gate:new T(-2.2*b,2.9,n),sheet:new T(o?0:.2,o?3.4:2.7,n+7),card:new T(o?0:2.5,o?2.6:2.3,n+6.6),ctr:new T(-a,e/2,n/2),box:new T(2*a,e/2,-n/2),ringR:o?21:27}}function mt(o,a,e){for(let n=0;n<8;n++)e.uHit.value[n].set(0,0,0,-1);for(let n=0;n<a.length;n++){const i=a[n],t=o-i.t;if(t<0||t>3.4)continue;const s=n&7;e.uHit.value[s].set(i.x,i.y,i.z,t),e.uHitK.value[s].set(i.k,i.r,i.c,0)}}const xt=`
float fbm3(vec2 p){ float v = 0., a = .5; for (int i = 0; i < FBM_N; i++){ v += a * vn(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
// the pivot's lattice in pattern units (edge .095): x = the lines (every edge on its own brightness), y = the nodes
vec2 lattice(vec2 p){
  const float s = .095; float hh = s * .8660254;
  vec2 n0 = vec2(0., 1.), n1 = vec2(-.8660254, .5), n2 = vec2(.8660254, .5);
  vec2 t0 = vec2(1., 0.), t1 = vec2(.5, .8660254), t2 = vec2(.5, -.8660254);
  float c0 = dot(p, n0) / hh, c1 = dot(p, n1) / hh, c2 = dot(p, n2) / hh;
  float d0 = abs(fract(c0 + .5) - .5) * hh, d1 = abs(fract(c1 + .5) - .5) * hh, d2 = abs(fract(c2 + .5) - .5) * hh;
  float w0 = fwidth(d0) + 1e-6, w1 = fwidth(d1) + 1e-6, w2 = fwidth(d2) + 1e-6;
  float e0 = (1. - sst(.35 * w0, 1.55 * w0, d0)) * (.3 + .7 * h12(vec2(floor(c0 + .5), floor(dot(p, t0) / s) + 1.3)));
  float e1 = (1. - sst(.35 * w1, 1.55 * w1, d1)) * (.3 + .7 * h12(vec2(floor(c1 + .5) + 7., floor(dot(p, t1) / s) + 5.1)));
  float e2 = (1. - sst(.35 * w2, 1.55 * w2, d2)) * (.3 + .7 * h12(vec2(floor(c2 + .5) + 13., floor(dot(p, t2) / s) + 9.7)));
  float nd = max(max(d0, d1), d2), px = (w0 + w1 + w2) / 3.;
  float node = 1. - sst(.6 * px, 2.6 * px, nd);
  float dens = max(max(fwidth(c0), fwidth(c1)), fwidth(c2));
  float fade = 1. - sst(.12, .34, dens);
  return vec2((e0 + e1 + e2) * fade, node * fade);
}`,yt="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",gt=`
${Ke}
${ye}
${xt}
uniform float uTime, uH0, uFogK, uBase, uStorm, uAlarmAmt, uGround, uLightK, uFade, uCopy, uPart;
uniform vec3 uTint, uAlarm, uOrigin, uAxU, uAxV, uNorm, uCtr, uBox;
uniform vec4 uLights[16]; uniform vec4 uHit[8]; uniform vec4 uHitK[8];
varying vec3 vW;
#ifdef DOORS
uniform vec4 uDoor[3]; uniform vec3 uDoorX; uniform vec2 uDoorS;
vec3 doorsLight(vec2 q, float px, out float cut){
  vec3 add = vec3(0.); cut = 0.;
  for (int i = 0; i < 3; i++){
    vec4 D = uDoor[i]; vec2 hs = uDoorS * .5, c = vec2(uDoorX[i], hs.y), d = q - c;
    float sdr = sdBox(d, hs);
    float inside = sst(px * 1.2, -px * 1.2, sdr);
    cut = max(cut, inside);
    float fr = 1. - sst(px * .5, px * 1.5, abs(sdr)), fr2 = (1. - sst(px * .4, px * 1.2, abs(sdr + .1))) * .45;
    float gap = D.z * hs.x * .96;
    float leaf = inside * step(gap, abs(d.x));
    float seam = (1. - sst(px * .5, px * 1.5, abs(abs(d.x) - gap))) * inside;
    vec3 sil = S(vec3(.78, .83, .91));
    add += sil * (fr * (.16 + .8 * D.w) + fr2 * (.08 + .35 * D.w) + seam * (.12 + .6 * D.w));
    add += S(vec3(.1, .13, .2)) * leaf * (.35 - .1 * abs(d.y) / hs.y);
    // the light beyond the door
    float inner = inside * (1. - step(gap, abs(d.x)));
    add += S(vec3(.7, .86, 1.)) * inner * (.25 + .9 * sst(1., 0., abs(d.x) / max(gap, .02))) * D.z * 1.3;
    add += S(vec3(.5, .7, 1.)) * exp(-max(sdr, 0.) * 2.4) * D.z * .1;
    // it asks: a beam down and up the door, a lens above it
    float s = D.x, act = step(.001, s) * step(s, 1.999), yb = (s <= 1. ? 1. - s : s - 1.) * uDoorS.y;
    float by = abs(q.y - yb), inX = sst(hs.x + px, hs.x - px * 2., abs(d.x));
    add += S(vec3(.75, .93, 1.)) * (exp(-pow(by / (px * 1.3), 2.)) * 2.1 + exp(-pow(by / .24, 2.)) * .28) * inX * act * step(0., q.y);
    vec2 ec = c + vec2(0., hs.y + .4); float er = length(q - ec);
    float ring = 1. - sst(px * .5, px * 1.6, abs(er - .17));
    float pupil = exp(-er * er / .0018) * (.5 + .5 * sin(uTime * 17. + float(i) * 2.)) * act;
    add += S(vec3(.8, .92, 1.)) * (ring * (.4 + .6 * act + .5 * step(.001, D.y)) + pupil * 1.2);
    float k1 = clamp(D.y * 2., 0., 1.), k2 = clamp(D.y * 2. - 1., 0., 1.);
    vec2 a = ec + vec2(-.08, -.002), b = ec + vec2(-.025, -.066), cc = ec + vec2(.09, .072);
    float tk = min(k1 > .001 ? sdSeg(q, a, mix(a, b, k1)) : 9., k2 > .001 ? sdSeg(q, b, mix(b, cc, k2)) : 9.);
    add += S(vec3(.85, .95, 1.)) * (1. - sst(px * .7, px * 1.9, tk)) * 1.6;
  }
  return add;
}
#endif
void main(){
  vec2 p = vec2(dot(vW - uOrigin, uAxU), dot(vW - uOrigin, uAxV)) / uH0;
  // contacts: the glass flexes (the lattice bulges away from the contact) and a ring runs out along it
  float flare = 0., ringSum = 0.; vec3 hitCol = vec3(0.); float hw = 0.;
  for (int i = 0; i < 8; i++){
    vec4 h = uHit[i]; if (h.w < 0.) continue;
    vec4 K = uHitK[i]; float age = h.w, R = K.y;
    float d3 = distance(vW, h.xyz);
    vec2 hq = vec2(dot(h.xyz - uOrigin, uAxU), dot(h.xyz - uOrigin, uAxV)) / uH0;
    p -= (p - hq) * (K.x * exp(-age * 1.3) * .5 * exp(-d3 * d3 / (R * R)));
    float rr = age * 3.6 + .15;
    float ring = exp(-pow((d3 - rr) * 2.1 / (.7 + R * .3), 2.)) * exp(-age * 1.15) * K.x;
    float core = exp(-d3 * d3 / (R * R * .3 + .02)) * exp(-age * 4.2) * K.x * 2.4;
    vec3 hc = K.z < .5 ? vec3(.86, .92, 1.) : (K.z < 1.5 ? uAlarm : vec3(.25, .75, 1.));
    hitCol += hc * (ring * .9 + core); flare += ring * .9 + core; ringSum += ring;
  }
  // the low warp of the pivot, and the lattice
  p += (vec2(fbm3(p * 1.4 + 3.), fbm3(p * 1.4 + 17.)) - .5) * .05;
  vec2 L = lattice(p);
  float shim = .85 + .15 * sin(uTime * .5 + h12(floor(p / .095)) * 6.28318);
  // light: the vessels' glow, the base the room always has
  float lsum = 0.;
  for (int i = 0; i < 16; i++){ vec4 l = uLights[i]; if (l.w <= 0.) continue; vec3 d = vW - l.xyz; lsum += l.w * exp(-dot(d, d) * .09); }
  #ifdef GROUND
  float lit = uBase * .45 + uLightK * lsum;
  #else
  float lit = uBase + uLightK * lsum;
  #endif
  // the storm: random cells flash in the alarm's colour
  #ifdef GROUND
  float stormCell = 0.;
  #else
  float stormCell = step(.93, h12(floor(p * 15.) + floor(uTime * 13.) * 3.7)) * uStorm;
  #endif
  float px = fwidth(p.y) + 1e-6;
  float cut = 0.; vec3 add = vec3(0.);
  #ifdef DOORS
  add += doorsLight(vW.xy, fwidth(vW.y) + 1e-6, cut);
  #endif
  vec3 col = uTint * (L.x * .62 * shim * lit * (1. + 1.4 * flare)) + S(vec3(.95, .97, 1.)) * L.y * .6 * shim * lit * (1. + flare);
  col += hitCol * (L.x * .9 + L.y * 1.2 + .06) * 1.2;
  col += mix(vec3(1.), uAlarm, .85) * stormCell * (L.x + L.y + .12) * 1.5;
  col = col * (1. - cut) + add;
  // glass: a faint film that catches the light at an angle, and the partition's own sheen and copy wave
  vec3 V = normalize(cameraPosition - vW);
  float ndv = abs(dot(V, uNorm)), film = (.002 + .012 * pow(max(1. - ndv, 0.), 3.)) * (.4 + lit);
  #ifdef PART
  film += (.006 + .03 * pow(max(1. - ndv, 0.), 2.)) * uPart;
  float cb = exp(-pow((vW.z - (3. - uCopy * 26.)) * .85, 2.)) * step(.001, uCopy) * step(uCopy, .999);
  col += S(vec3(.55, .85, 1.)) * cb * (L.x * 1.4 + L.y * 2. + .03) * uPart;
  film += cb * .04;
  #endif
  col += uTint * film;
  #ifdef GROUND
  vec2 o = max(abs(vW.xz - uCtr.xz) - uBox.xz, 0.);
  float outside = length(o);
  col *= mix(1., uGround * .55 * exp(-outside * .05) + .0, sst(0., .6, outside));
  col *= sst(260., 40., length(vW.xz - uCtr.xz));
  #endif
  col *= exp(-length(cameraPosition - vW) * uFogK) * uFade;
  gl_FragColor = vec4(col, 1.);
}`;function wt(){const o=a=>Array.from({length:a},()=>new Se(0,0,0,0));return{uLights:{value:o(16)},uHit:{value:o(8).map(a=>a.set(0,0,0,-1))},uHitK:{value:o(8)},uAlarm:{value:new fe(...X.red)},uAlarmAmt:{value:0},uStorm:{value:0},uGround:{value:0},uBase:{value:.03},uTint:{value:new fe(...X.silver)},uCopy:{value:0},uPart:{value:0},uDoor:{value:o(3)},uDoorX:{value:new T},uDoorS:{value:new Le}}}function Mt(o){const{L:a,LU:e,st:n,world:i}=o,{W:t,HH:s,ZB:m}=a,v={uTime:n.G.uTime,uH0:{value:a.H0},uFogK:{value:.03},uLightK:{value:.8},uFade:{value:1},...e},f=(h,b,M,r,I,H,P,V,B)=>{const U=new be({vertexShader:yt,fragmentShader:gt,defines:{...b,FBM_N:o.q?3:2},transparent:!0,depthWrite:!1,blending:Ae,side:Me,uniforms:{...v,uOrigin:{value:new T(...H)},uAxU:{value:new T(...P)},uAxV:{value:new T(...V)},uNorm:{value:new T(...B)},uCtr:{value:a.ctr},uBox:{value:a.box}}}),y=new me(new Ee(1,1),U);return y.position.set(M[0],M[1],M[2]),y.rotation.set(r[0],r[1],r[2]),y.scale.set(I[0],I[1],1),y.frustumCulled=!1,y.renderOrder=1,i.add(y),{id:h,mesh:y,mat:U}},c=Math.PI/2,z=-t,l=[f("floor",{GROUND:1},[z,0,m/2],[-c,0,0],[700,700],[z,0,0],[1,0,0],[0,0,-1],[0,1,0]),f("ceiling",{},[z,s,m/2],[c,0,0],[4*t,-m],[z+.21,s,0],[1,0,0],[0,0,-1],[0,-1,0]),f("far",{DOORS:1},[z,s/2,m],[0,0,0],[4*t,s],[0,0,m],[1,0,0],[0,1,0],[0,0,1]),f("right",{},[t,s/2,m/2],[0,-c,0],[-m,s],[t,0,0],[0,0,-1],[0,1,0],[1,0,0]),f("outer",{},[-3*t,s/2,m/2],[0,c,0],[-m,s],[-3*t,0,0],[0,0,-1],[0,1,0],[1,0,0]),f("part",{PART:1},[-t,s/2,m/2],[0,-c,0],[-m,s],[-t,0,.3],[0,0,-1],[0,1,0],[1,0,0]),f("facade",{},[z,s/2,0],[0,0,0],[4*t,s],[0,0,0],[1,0,0],[0,1,0],[0,0,1])];l[2].mat.uniforms,e.uDoorX.value.set(a.doorX[0],a.doorX[1],a.doorX[2]),e.uDoorS.value.set(a.doorW,a.doorH);const d=Fe({count:40,shared:n.G,core:.8,uniforms:{uHit:e.uHit,uHitK:e.uHitK,uAlarm:e.uAlarm},pt:`
      uniform vec4 uHit[8]; uniform vec4 uHitK[8]; uniform vec3 uAlarm;
      float rn(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float e = floor(id / 5.), k = id - e * 5.; int ei = int(e);
        vec4 h = uHit[ei], K = uHitK[ei];
        pos = vec3(0.); size = 0.; col = vec4(0.);
        if (h.w < 0.) return;
        float age = h.w;
        vec3 base = K.z < .5 ? vec3(.86, .92, 1.) : (K.z < 1.5 ? uAlarm * 1.2 : vec3(.25, .78, 1.));
        if (k < .5){ pos = h.xyz; size = (22. + 70. * K.x) * exp(-age * 7.5); col = vec4(base * 2.4 * exp(-age * 5.5), 1.); }
        else {
          float a = rn(e * 9. + k) * 6.2832, sp = (.8 + 2.2 * rn(e * 5. + k * 3.)) * (.5 + K.y * .35);
          vec3 dir = vec3(cos(a), sin(a), (rn(k + e * 3.) - .5) * .5);
          pos = h.xyz + dir * sp * (1. - exp(-age * 3.2)) / 3.2; pos.y -= age * age * .35;
          size = 5.5 * exp(-age * 1.9); col = vec4(base * 1.6 * exp(-age * 1.5), 1.);
        }
      }`});return d.mesh.renderOrder=6,i.add(d.mesh),{planes:l,update(h){const b=l[6].mesh;b.visible=h>6.5,v.uFade.value=q(h,1.2,5.4)},dispose(){for(const h of l)i.remove(h.mesh),h.mesh.geometry.dispose(),h.mat.dispose();i.remove(d.mesh),d.dispose()}}}const bt=[new fe(.72,.88,1),new fe(.16,.62,1),new fe(1,.78,.52)],zt=[new fe(.4,.75,1),new fe(.14,.55,1),new fe(.6,.78,1)],_e=`
float wh(vec2 x, float t, float a){ return a * (sin(x.x * 7. + t * 1.3 + sin(x.y * 5. + t * .9)) * .5 + sin(x.y * 9.3 - t * 1.7 + x.x * 3.) * .35 + sin((x.x + x.y) * 13. + t * 2.3) * .15); }`,St=`
float caust(vec2 uv, float time){
  vec2 p = mod(uv * 6.28318, 6.28318) - 250.; vec2 i = p; float c = 1., inten = .005;
  for (int n = 0; n < CAUST_N; n++){
    float t = time * (1. - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1. / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
  }
  c /= float(CAUST_N); c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.);
}`,De="varying vec3 vL, vW, vN; void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix) * normal; gl_Position = projectionMatrix * viewMatrix * w; }",Ct=`
${ye}${_e}${St}
uniform float uTime, uLvl, uH, uShake, uDim, uCool; uniform vec3 uCol;
varying vec3 vL, vW, vN;
void main(){
  float surf = uLvl + wh(vL.xz, uTime, .012 + .05 * uShake);
  float inside = sst(surf + .012, surf - .06, vL.y);
  if (inside < .004) discard;
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float ndv = max(dot(N, V), 0.), fres = pow(max(1. - ndv, 0.), 2.2);
  float depth = max(surf - vL.y, 0.), beam = exp(-depth * 1.2);
  float ang = atan(vL.z, vL.x) / 6.28318;
  float c = caust(vec2(ang * 3., vL.y * 1.4 + uTime * .015), uTime * .42);
  vec3 col;
  if (gl_FrontFacing) col = uCol * ((.09 + .5 * beam) * (.3 + .7 * ndv) + (.2 + .28 * beam) * fres + .22 * c * beam);
  else col = uCol * (.04 + .2 * beam + c * (.22 + 1.1 * beam));
  col = mix(col, vec3(dot(col, vec3(.4))) * vec3(.45, .8, 1.4), uCool);
  col += vec3(1.) * exp(-pow((vL.y - surf) * 9., 2.)) * .45;
  col *= inside * uDim;
  if (vW.y < 0.) col *= .3 * exp(vW.y * .8);
  gl_FragColor = vec4(col, 1.);
}`,At=`
${_e}
uniform float uTime, uShake; varying vec3 vW; varying vec2 vXZ; varying float vR; uniform float uRad;
void main(){
  vec2 hz = vec2(position.x, -position.y); float h = wh(hz, uTime, .012 + .05 * uShake);
  vec4 w = modelMatrix * vec4(position.x, h, -position.y, 1.); vW = w.xyz; vXZ = hz; vR = length(hz) / uRad;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,kt=`
${ye}${_e}
uniform float uTime, uShake, uDim, uCool, uPulse; uniform vec3 uCol; varying vec3 vW; varying vec2 vXZ; varying float vR;
void main(){
  float a = .012 + .05 * uShake, e = .02, h0 = wh(vXZ, uTime, a);
  vec3 n = normalize(vec3(-(wh(vXZ + vec2(e, 0.), uTime, a) - h0) / e, 1., -(wh(vXZ + vec2(0., e), uTime, a) - h0) / e));
  vec3 V = normalize(cameraPosition - vW), Ld = normalize(vec3(.3, 1., .5));
  float spec = pow(max(dot(reflect(-Ld, n), V), 0.), 36.), fres = pow(max(1. - dot(n, V), 0.), 2.);
  float rim = sst(.55, 1., vR);
  vec3 col = uCol * (.55 + rim * .9 + fres * .7) + vec3(1.) * spec * 1.6;
  col *= sst(1.02, .94, vR) * uDim * (1. + uPulse * 1.8);
  col = mix(col, vec3(dot(col, vec3(.4))) * vec3(.45, .8, 1.4), uCool);
  if (vW.y < 0.) col *= .3 * exp(vW.y * .8);
  gl_FragColor = vec4(col, 1.);
}`,Ht=`
${ye}
uniform float uH, uGlass; varying vec3 vL, vW, vN;
void main(){
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float fr = pow(max(1. - abs(dot(N, V)), 0.), 4.5);
  vec3 Nv = normalize((viewMatrix * vec4(N, 0.)).xyz);
  float st = exp(-pow((Nv.x - .62) * 9., 2.)) * .45 + exp(-pow((Nv.x + .5) * 11., 2.)) * .22;
  float vy = vL.y / uH, fy = sst(0., .08, vy) * sst(1.03, .9, vy);
  vec3 col = vec3(.62, .78, 1.) * (fr * .7 + st * .32 * fy + .003);
  col += vec3(.9, .95, 1.) * (exp(-pow(vy * 40., 2.)) + exp(-pow((vy - 1.) * 40., 2.))) * .55;
  col *= uGlass;
  if (vW.y < 0.) col *= .3 * exp(vW.y * .8);
  gl_FragColor = vec4(col, 1.);
}`,Gt=`
${ye}
uniform vec3 uCol; uniform float uDim, uLvl, uBH, uTop, uCool, uPulse; varying vec3 vL, vW, vN;
void main(){
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float ndv = abs(dot(N, V)), y = clamp((vL.y - uTop) / uBH, 0., 1.);
  float f = exp(-y * 4.2) * pow(ndv, 1.5) * sst(0., .04, uLvl);
  vec3 col = uCol * f * .1 * uDim * (1. + uPulse * 2.2);
  col = mix(col, vec3(dot(col, vec3(.4))) * vec3(.45, .8, 1.4), uCool);
  if (vW.y < 0.) col *= .3 * exp(vW.y * .8);
  gl_FragColor = vec4(col, 1.);
}`;function Pt(o){const a=[],e=(t,s,m,v)=>a.push([t,s,m,v]),n=(t,s=!1)=>{for(let m=0;m<t.length-1;m++)e(t[m][0],t[m][1],t[m+1][0],t[m+1][1]);s&&e(t[t.length-1][0],t[t.length-1][1],t[0][0],t[0][1])},i=(t,s,m,v,f,c=3)=>Array.from({length:c+1},(z,l)=>{const d=(v+(f-v)*l/c)*Math.PI/180;return[t+Math.cos(d)*m,s+Math.sin(d)*m]});if(o===0)n([[-.3,-.42],[.3,-.42],[.3,.2],[.08,.42],[-.3,.42]],!0),n([[.08,.42],[.08,.2],[.3,.2]]),e(-.18,.08,.18,.08),e(-.18,-.06,.18,-.06),e(-.18,-.2,.18,-.2),e(-.18,-.34,.04,-.34);else if(o===1){const t=[0,.46],s=[.4,.23],m=[.4,-.23],v=[0,-.46],f=[-.4,-.23],c=[-.4,.23],z=[0,0];n([t,s,m,v,f,c],!0),e(z[0],z[1],c[0],c[1]),e(z[0],z[1],s[0],s[1]),e(z[0],z[1],v[0],v[1]),e(-.2,.345,.2,.115+0)}else if(o===2)[.14,.3,.5,.78,.96,.62,.4,.24,.12].forEach((s,m)=>e(-.4+m*.1,-s/2,-.4+m*.1,s/2));else{const c=[[-.3,.34],[.3,.34],...i(.3,.22000000000000003,.12,90,0).slice(1),[.42,0],...i(.3,0,.12,0,-90).slice(1),[-.02,-.12],[-.12,-.4],[-.2,-.12],[-.3,-.12],...i(-.3,0,.12,-90,-180).slice(1),[-.42,.22000000000000003],...i(-.3,.22000000000000003,.12,180,90).slice(1)];n(c,!0),e(-.2,.11,-.17,.11),e(-.015,.11,.015,.11),e(.17,.11,.2,.11)}return a}function Ft(o){const{L:a,LU:e,st:n,world:i,ctx:t}=o,s=We(t,28,40,56),m=new ze;i.add(m);const v={value:0},f={value:1},c=[],z=new be({vertexShader:De,fragmentShader:Ht,transparent:!0,depthWrite:!1,blending:Ae,side:Me,uniforms:{uH:{value:1},uGlass:f}}),l=[],d=(x,O,G)=>{const{r:u,h:W}=x,S=(G?zt:bt.map(ie=>ie.clone()))[x.hue].clone(),k=new ze;k.position.set(O,x.y0,x.z);const g={uTime:n.G.uTime,uLvl:{value:0},uH:{value:W},uShake:v,uDim:{value:G?.62:1},uCool:{value:0},uPulse:{value:0},uCol:{value:S},uRad:{value:u*.9}},R=new me(new Pe(u*.9,u*.9,W,s,1,!0).translate(0,W/2,0),new be({vertexShader:De,fragmentShader:Ct,defines:{CAUST_N:o.q?4:3},uniforms:g,transparent:!0,depthWrite:!1,blending:Ae,side:Me})),ne=new be({vertexShader:At,fragmentShader:kt,uniforms:g,transparent:!0,depthWrite:!1,blending:Ae,side:Me}),Z=new me(new Ne(.001,u*.9,s,7),ne),D=z.clone();D.uniforms={uH:{value:W+.08},uGlass:{value:G?.6:1}};const J=new me(new Pe(u,u,W+.08,s,1,!0).translate(0,(W+.08)/2-.04,0),D),ee=new Pe(u*1.32,u*1.38,.2,s,1,!0).translate(0,.1-.04,0),_=new me(ee,D.clone());_.material.uniforms={uH:{value:.2},uGlass:{value:G?.6:1}};const w=new me(new Ne(u*.84,u,s).rotateX(-Math.PI/2).translate(0,W+.04,0),D),E=new me(new Ne(u*.84,u*1.38,s).rotateX(-Math.PI/2).translate(0,.06,0),D),j=Math.max(.6,a.HH-.15-(x.y0+W)),te=new Pe(u*.4,u*.88,j,28,1,!0).translate(0,W+j/2,0),re=new be({vertexShader:De,fragmentShader:Gt,transparent:!0,depthWrite:!1,blending:Ae,side:Me,uniforms:{uCol:g.uCol,uDim:g.uDim,uLvl:g.uLvl,uCool:g.uCool,uPulse:g.uPulse,uBH:{value:j},uTop:{value:W}}}),oe=new me(te,re);c.push(R.geometry,Z.geometry,J.geometry,ee,w.geometry,E.geometry,te);for(const ie of[R,Z,J,_,w,E,oe])ie.frustumCulled=!1,ie.renderOrder=3;k.add(R,Z,J,_,w,E,oe);const de=new ze;return de.position.copy(k.position),de.scale.y=-1,de.add(...[R,Z,J,_,w,E].map(ie=>ie.clone())),m.add(k),G||m.add(de),{cfg:x,x:O,group:k,refl:de,U:g,surf:Z,mats:[R.material,ne,re],glass:[D,_.material],col:S,amount:0}},F=a.vessels.length;for(const x of a.vessels)l.push(d(x,x.x,!1));const h=x=>-2*a.W-x;for(const x of a.vessels)l.push(d({...x,mirror:!0},h(x.x),!0));const b=We(t,14,22,34),M=Array.from({length:16},()=>new Se),r=Array.from({length:16},()=>new Se),I=Fe({count:b*16,shared:n.G,atten:3.5,core:.6,uniforms:{uVA:{value:M},uVB:{value:r}},pt:`
      ${ye}
      uniform vec4 uVA[16]; uniform vec4 uVB[16];
      float hs(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float v = floor(id / ${b}.), m = id - v * ${b}.; int vi = int(v);
        vec4 A = uVA[vi], B = uVB[vi];
        pos = vec3(0.); size = 0.; col = vec4(0.);
        if (A.w <= .02) return;
        float s = hs(id * 3.1 + 1.), a = hs(id * 5.7 + 2.) * 6.2832, rr = sqrt(hs(id * 7.3 + 3.)) * A.z * .78;
        float rise = fract(hs(id * 11.1 + 4.) + uTime * (.035 + .05 * hs(id * 13.7)));
        float y = rise * A.w;
        pos = vec3(A.x + cos(a + uTime * .2 * s) * rr, A.y + y, B.w + sin(a + uTime * .2 * s) * rr);
        size = (1.6 + 3.4 * s) * 2.2; float tw = .6 + .4 * sin(uTime * (1.5 + 3. * s) + id);
        col = vec4(B.rgb * 1.5 * tw * sst(0., .08, rise) * sst(1., .85, rise), 1.);
      }`});I.mesh.renderOrder=6,i.add(I.mesh);const H=l.map((x,O)=>({v:x,segs:Pt(x.cfg.kind),mirror:O>=F})),P=H.reduce((x,O)=>x+O.segs.length,0),V=xe({count:P*2,shared:n.G,fog:.012}),B=xe({count:l.length,shared:n.G,fog:.012});V.mesh.renderOrder=7,B.mesh.renderOrder=7,i.add(V.mesh,B.mesh);const U=xe({count:l.length*2,shared:n.G,fog:.01});i.add(U.mesh);{let x=0;for(const O of l){const G=O.cfg;if(G.y0>0){const u=O.x>-a.W?a.W:O.x>-a.W*2?-a.W:-3*a.W;U.set(x++,O.x,G.y0-.02,G.z,u,G.y0-.02,G.z,...X.silver,.5,1.3,0,1,0),U.set(x++,O.x,G.y0-.02,G.z,u,G.y0-1.2,G.z,...X.silver,.22,1.1,0,1,0)}}U.clear(x),U.setCount(Math.max(1,x)),U.dirty()}const y=a.tall?.6:.72,C=X.ice.map(x=>x*1.05),$=X.cyan.map(x=>x*1.05);return{shake:v,lightUniform:e.uLights.value,fillLevel:x=>l[x].amount,update(x){const O=q(x,41,45.5),G=e.uCopy.value,u=1-.35*q(x,8,9.5)-.27*q(x,16.2,18)+.22*q(x,26,28.5)+.4*q(x,35,37);let W=0;l.forEach((S,k)=>{const g=S.cfg,R=k>=F,ne=ve(A(x,g.t0,g.t0+2.1)),Z=R?ve(Math.min(1,Math.max(0,(G-(3-g.z)/26)/.1))):0;S.amount=R?Z:ne;const D=g.h*.9*g.lvl*S.amount;S.U.uLvl.value=D,S.surf.position.y=D,S.U.uCool.value=O,S.U.uPulse.value=R?Math.exp(-Math.pow((G-(3-g.z)/26-.1)*9,2))*(G>0&&G<1?1:0):Math.exp(-Math.pow((x-g.t0-2.1)*1.7,2)),S.refl.children[1].position.y=D,S.U.uDim.value=(R?.85:1)*(.4+.6*Math.min(1,S.amount*3))*u;const J=(R?.8:1)*(.08+.92*Math.min(1,S.amount*3))*u;for(const K of S.glass)K.uniforms.uGlass.value=J;e.uLights.value[k<16?k:0].set(S.x,g.y0+g.h*.55,g.z,S.amount*(R?.8:1)*(.7+g.lvl*.5)*u),M[k].set(S.x,g.y0,g.r,D),r[k].set(S.col.r*(R?.7:1),S.col.g,S.col.b,g.z);const _=A(x,g.t0+.5,g.t0+2.3),w=S.x,E=g.y0+g.h+.66*y+.18,j=R?-1:1,te=H[k].segs.length,re=(R?.62:.95)*(.6+.4*Math.min(1,S.amount*2));for(let K=0;K<te;K++){const se=H[k].segs[K],le=Math.min(1,Math.max(0,_*te-K)),ue=R?$:C;V.set(W++,w+se[0]*y*j,E+se[1]*y,g.z+g.r*.1,w+se[2]*y*j,E+se[3]*y,g.z+g.r*.1,ue[0],ue[1],ue[2],le>0?re:0,1.6,0,le,le<1?1.6:0),V.set(W++,w+se[0]*y*j,E+se[1]*y,g.z+g.r*.1,w+se[2]*y*j,E+se[3]*y,g.z+g.r*.1,ue[0],ue[1],ue[2],le>0?re*.16:0,7,0,le,0)}const oe=A(x,g.t0+.7,g.t0+1.7)*(1-A(x,g.t0+1.9,g.t0+2.4)),de=E-.46*y,ie=g.y0+D+.02,pe=R?X.cyan:X.ice;B.set(k,S.x,de,g.z+g.r*.1,S.x,ie,g.z+g.r*.1,pe[0],pe[1],pe[2],oe>0?.8:0,1.4,0,oe,oe<1?2.2:0)}),V.dirty(),B.dirty()},dispose(){i.remove(m,I.mesh,V.mesh,B.mesh,U.mesh),c.forEach(x=>x.dispose());for(const x of l)x.mats.forEach(O=>O.dispose()),x.glass.forEach(O=>O.dispose());z.dispose(),I.dispose(),V.dispose(),B.dispose(),U.dispose()}}}function Xe(o){const a=o.tall,e=o.fov,n=o.d0,i=a?.5:1,t=[],s=(F,h,b,M=e)=>t.push({t:F,p:h,l:b,fov:M}),m=n-.1,v=a?-1.2:-1.6,f=2.2,c=7.4,z=F=>{if(F<=f)return n-(n-m)*(F/f)**2;const h=(F-f)/(c-f),b=.36;return m+(v-m)*((3-b)*h*h+(b-2)*h*h*h)};for(let F=0;F<c-.01;F+=.4){const h=z(F),b=ge(3.2,a?3:2.7,q(F,3.5,7.4)),M=.035*q(F,4,7.4);s(F,[0,b,h],[0,b-20*M,h-20])}const l=(F,h,b,M=e)=>s(F,[h[0]*i,h[1],h[2]],[b[0]*i,b[1],b[2]],M);l(7.4,[.2,a?3:2.7,a?-1.2:-1.6],[.15,2.6,-24]),l(9.6,[0,2.6,-3],[.5,3,-34],e*.62),l(13,[-.3,2.6,-5.5],[1.8,3.1,-34],e*.56),l(16.8,[.2,2.7,-9],[.3,2.8,-34],e*.5),l(19,[0,2.7,-9.4],[.3,2.8,-34],e*.5),l(22,[-.5,2.8,-9.8],[-1,2.9,-36],e*.5),l(24.5,[-.2,2.7,-11.5],[.6,2.7,-30],e*.6),l(26.5,[.6,2.7,-14.5],[.4,2.7,-27.5],e*.7),l(28.2,[.2,2.7,-17.2],[.2,2.7,-27],e*.8),l(31,[0,2.7,-18],[.1,2.7,-27],e*.8),l(33.4,[-.4,2.7,-18.5],[-.6,2.7,-27],e*.82),a?(s(33.8,[-.3,2.8,-17.8],[-.9,2.7,-26],e*.84),s(35,[-.5,5.2,-15.4],[-1.6,1.8,-23],e*.9),s(36.4,[-1.2,10.8,-12.2],[-3.3,0,-19],e),s(37.9,[-3.3,24,-9],[-3.3,0,-20],e*.9)):(l(34.4,[-.5,2.8,-17.2],[-2.5,2.7,-26],e*.84),l(35.4,[-.1,3,-13.2],[-6.5,2.6,-24],e*.89),l(36.4,[.9,3.2,-9.6],[-9,2.3,-23.5],e*.94),l(37.2,[.2,5,-10.2],[-7.5,1.5,-20],e));const d=-o.W;return a?(s(39.3,[d-.2,30,18],[d,0,-17],58),s(40.6,[d,30,40],[d,0,-15],58),s(42.7,[d,28,64],[d,1,-15],58),s(44.4,[d,8,100],[d,6.2,-17],58),s(48,[d,5.6,132],[d,5.6,-17],58)):(s(38.2,[d+9.2,14,-2],[d,1,-17],e),s(39.4,[d+22.2,21,14],[d,1,-17],e),s(41,[d+34.2,24,28],[d,1.4,-17],e),s(43,[d+46.2,15,44],[d,3,-17],e),s(44.4,[d+62,7.5,70],[d,6.4,-17],e),s(48,[d+90,5.6,90],[d,5.6,-17],e)),vt(t)}function Wt(){const a=[],e=[];for(let i=0;i<=16;i++){const t=(180+250*i/16)*Math.PI/180;e.push([.5+Math.cos(t)*.5,Math.sin(t)*.5])}const n=e[e.length-1];for(let i=0;i<=5;i++)a.push([0,2.2-i*.44]);return a.push(...e.slice(1)),a.map(([i,t])=>[i-n[0],t-n[1]])}function Rt(){const o=[],a=[];for(let i=0;i<=8;i++){const t=(95+112*i/8)*Math.PI/180;o.push([1.15+Math.cos(t)*.62,-.62+Math.sin(t)*.62])}const e=o[o.length-1];for(let i=0;i<o.length-1;i++)a.push([o[i][0]-e[0],o[i][1]-e[1],o[i+1][0]-e[0],o[i+1][1]-e[1]]);const n=(i,t,s,m)=>a.push([i-e[0],t-e[1],s-e[0],m-e[1]]);return n(1.15,0,4.5,0),n(1.15,.12,4.5,.12),n(1.15,.12,1.15,0),n(4.5,.12,4.5,0),n(2.9,.06,4.4,.06),a}function Ut(o){const{L:a,st:e,world:n,ctx:i,dir:t}=o,s=a.W/6.2,m=a.ZB-.3,[v,f,c]=X.grey.map(C=>C*1.5),z=Wt(),l=z.length-1,d=14,F=1.9,h=[{x:-4.6*s*t,y:3.6,ta:9.3,dir:t,ph:0},{x:-1.5*s*t,y:4.2,ta:10.2,dir:-t,ph:1.3},{x:2.2*s*t,y:3.4,ta:11,dir:t,ph:2.1},{x:5*s*t,y:4,ta:11.8,dir:-t,ph:3.4}],b=xe({count:h.length*(l+d)*2,shared:e.G,fog:.016});b.mesh.renderOrder=5,n.add(b.mesh);const M=new Float32Array(l+1),r=new Float32Array(l+1),I=Rt(),H=xe({count:I.length*2,shared:e.G,fog:.016});H.mesh.renderOrder=5,n.add(H.mesh);const P=a.doorX[1],V=We(i,1200,2400,4e3),B={uT:{value:0},uWallZ:{value:a.ZB},uF0:{value:new Se(12.9,9*s*t,4.5,t)},uF1:{value:new Se(13.8,-10*s*t,6.5,-t)},uC0:{value:new T(3.3*s*t,3,0)},uC1:{value:new T(-3.3*s*t,3.1,0)},uSz:{value:1},uS:{value:s},uCol:{value:new fe(v,f,c)}},U=Fe({count:V,shared:e.G,atten:0,core:.55,uniforms:B,fog:.01,pt:`
      ${ye}
      uniform float uT, uWallZ, uSz, uS; uniform vec4 uF0, uF1; uniform vec3 uC0, uC1, uCol;
      float hs(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float fl = mod(id, 2.); vec4 F = fl < .5 ? uF0 : uF1; vec3 C = fl < .5 ? uC0 : uC1;
        float n = floor(id / 2.), r1 = hs(n * 1.7 + 1.), r2 = hs(n * 3.1 + 2.), r3 = hs(n * 5.3 + 3.), r4 = hs(n * 7.9 + 4.), r5 = hs(n * 9.7 + 5.);
        float tc = F.x + (r1 - .5) * 1.1, u = (uT - (tc - 3.2)) / 3.2;
        pos = vec3(0.); size = 0.; col = vec4(0.);
        if (u < 0. || u > 1.9) return;
        vec3 O = vec3(F.y, C.y + F.z, uWallZ - 17.), Cw = vec3(C.x, C.y, uWallZ - .1);
        vec3 ad = normalize(Cw - O); float Ln = length(Cw - O);
        vec3 e1 = normalize(cross(ad, vec3(0., 1., .02))), e2 = cross(ad, e1);
        float e = u < 1. ? u * u * (3. - 2. * u) : 1.;
        float R = uS * mix(6.2, 1.9, e) * sqrt(r2) * (1. + .22 * sin(uT * 2. + r3 * 6.28));
        float ph = r4 * 6.2832 + uT * (1.2 + r5) + e * 9.;
        pos = O + ad * Ln * e + (e1 * cos(ph) + e2 * sin(ph)) * R;
        float cl = max(u - 1., 0.);
        // at the glass the cloud flattens against it and slides
        pos.z = mix(pos.z, uWallZ - .06 - .1 * r5, sst(.0, .08, cl) * step(1., u));
        vec2 sl = normalize(vec2(F.w * (.4 + r2), -.5 - r3)) * (1. - exp(-cl * 2.2)) * (1.2 + 2.4 * r5) * uS;
        pos.xy += sl * step(1., u);
        float flash = exp(-cl * 11.) * step(1., u), live = 1. - sst(.15, .9, cl);
        size = (3. + 2.6 * r5 + 11. * flash) * uSz;
        float tw = .6 + .4 * sin(uT * (9. + 7. * r1) + n);
        col = vec4(uCol * (.85 * tw * live + 3. * flash) * sst(0., .12, u), 1.);
      }`});U.mesh.renderOrder=5,n.add(U.mesh);const y=(C,$,L,x)=>(we(C*7.31+$*3.17+Math.floor(L*24)*1.13)-.5)*x;return{update(C){const $=C>7&&C<17.6;if(b.mesh.visible=H.mesh.visible=$,U.mesh.visible=C>9&&C<17.4,!$)return;B.uT.value=C;let L=0;for(const x of h){const O=C-x.ta,G=O>-2.1&&O<2.4,u=ve(A(O,-1.9,0)),W=he(A(O,0,.5)),S=he(A(O,.5,1.45)),k=A(O,1.5,2.3),g=Math.sin(O*3+x.ph)*(1-u)*1.5+Math.sin(O*5.1+x.ph)*.06*(1-k),R=x.x+x.dir*(1-u)*1.8+x.dir*S*.45+g*.35,ne=x.y+(1-u)*5.2-S*1.3,Z=m+W*.26-k*.4,D=g*.5+S*x.dir*.5+(we(x.ph)-.5)*.1,J=Math.cos(D),ee=Math.sin(D),_=G?1-k:0,w=W*(1-S),E=.02+.1*k;for(let K=0;K<=l;K++)M[K]=R+(z[K][0]*J-z[K][1]*ee)*F+y(K,1,C,E),r[K]=ne+(z[K][0]*ee+z[K][1]*J)*F+y(K,2,C,E);for(let K=0;K<l;K++){const se=K/l<k*1.2-.15?0:1,le=G?_*se*(.8+.2*we(K+C*9))*(1+w*K/l):0,ue=K===l-1?w*2.5:0;b.set(L++,M[K],r[K],Z,M[K+1],r[K+1],Z,v,f,c,le,3.4,0,1,ue),b.set(L++,M[K],r[K],Z,M[K+1],r[K+1],Z,v,f,c,le*.22,9,0,1,0)}const j=M[0],te=r[0],re=j+x.dir*1.6,oe=a.HH+6,de=(1-W*.7+S*.5)*.8*x.dir;let ie=j,pe=te;for(let K=1;K<=d;K++){const se=K/d,le=j+(re-j)*se+Math.sin(se*Math.PI)*de,ue=te+(oe-te)*se,N=G?_*(1-se*.9)*.6*(1-S*.5):0;b.set(L++,ie,pe,Z,le,ue,Z,v,f,c,N,1.4,0,1,0),b.set(L++,ie,pe,Z,le,ue,Z,v,f,c,N*.2,5,0,1,0),ie=le,pe=ue}}b.dirty();{const O=ve(A(C,13.7,14.6)),G=A(C,16.15,16.95),u=C>13.7-.1&&C<17.1,S=.42+(Math.sin(Math.PI*A(C,14.7,15.2))*.15+Math.sin(Math.PI*A(C,15.45,15.9))*.23+Math.sin(Math.PI*A(C,16,16.3))*.3),k=P+.05+(1-O)*9,g=1.6-(1-O)*3,R=m+.06*O-G*.3,ne=1.05,Z=Math.cos(S),D=Math.sin(S),J=.02+.12*G;let ee=0;for(let _=0;_<I.length;_++){const[w,E,j,te]=I[_],re=_/I.length<G*1.15-.1?0:1,oe=u?re*(.85+.15*we(_+C*11))*(1-G*.6):0,de=_===I.length-1?1.4:3.8,ie=_===7?2*(1-G):0,pe=k+(w*Z-E*D)*ne+y(_,5,C,J),K=g+(w*D+E*Z)*ne+y(_,6,C,J),se=k+(j*Z-te*D)*ne+y(_,5,C,J),le=g+(j*D+te*Z)*ne+y(_,6,C,J);H.set(ee++,pe,K,R,se,le,R,v,f,c,oe,de,0,1,ie),H.set(ee++,pe,K,R,se,le,R,v,f,c,oe*.2,10,0,1,0)}H.dirty()}},dispose(){n.remove(b.mesh,H.mesh,U.mesh),b.dispose(),H.dispose(),U.dispose()}}}function Ot(o,a=1){const e=o.W/6.2,n=o.ZB,i=o.W,t=[],s=(c,z,l,d,F,h,b=0)=>t.push({t:c,x:z,y:l,z:d,k:F,r:h,c:b});s(6.3,0,3,0,1.3,3.8),[[9.4,-4.6,3.6],[10.3,-1.5,4.2],[11.1,2.2,3.4],[11.9,5,4]].forEach(([c,z,l])=>{const d=z*e*a;s(c+.1,d,l,n,1,1.7),s(c+.85,d+(d>0?-.4:.4)*e,l-1.2,n,.55,1.2)}),s(12.9,3.3*e*a,3,n,1.4,3),s(13.2,4.4*e*a,2.3,n,1.1,2.4),s(13.8,-3.3*e*a,3.1,n,1.4,3),s(14.1,-4.4*e*a,2.4,n,1.1,2.4);const m=o.doorX[1];[[14.7,1],[15.5,1.1],[16.05,1.5]].forEach(([c,z])=>s(c+.05,m,1.6,n,z,2.1)),s(20.7,o.gate.x,o.gate.y,n,1.5,2.6,2),s(24.6,o.gate.x+1.5*e,o.gate.y+.2,n,1.3,2.6,2),s(26.65,o.gate.x,o.gate.y,n,1.1,2.2,2);const v=i;return[[37.9,-14*e,2.4,0],[38.1,v,3.4,-6],[38.3,-3.6*e,4.4,0],[38.5,-9*e,Oe(o),-4],[38.6,v,2.2,-13],[38.8,1.5*e,2,0],[38.95,-4*e,Oe(o),-14],[39.1,v,4.6,-20],[39.3,-11*e,3.2,0],[39.45,-8*e,Oe(o),-22],[39.7,v,2.8,-25],[39.9,-2*e,3,0],[40.2,-12*e,Oe(o),-10]].forEach(([c,z,l,d],F)=>s(c+.6,z,l,d,1.1+F%3*.2,3.2+F%4*.5,1)),t.sort((c,z)=>c.t-z.t),t}const Oe=o=>o.HH,p={mark:16.8,split:18.3,keys:19.4,kHome:21,mThrough:20.7,mOut:22.5,msgIn:22,dock:23,sealed:23.9,pass:24.4,toK:25.5,unlock:25.9,open:26.2,read:27.4,joined:28.4,seal:28.6,fold:29.1,cube:31.1,card:29.3,finger:29.7,stamp:31.9,doors:30.2,copy:32.8},Bt={i:o=>o*o*(1.5-.5*o),o:o=>1-(1-o)*(1-o)*(1+.5*o),io:he,l:o=>o};function Ie(o,a,e){if(o<=a[0][0])return e.set(a[0][1],a[0][2],a[0][3]);for(let i=1;i<a.length;i++)if(o<=a[i][0]){const t=a[i-1],s=a[i],m=Bt[s[4]??"io"](A(o,t[0],s[0]));return e.set(ge(t[1],s[1],m),ge(t[2],s[2],m),ge(t[3],s[3],m))}const n=a[a.length-1];return e.set(n[1],n[2],n[3])}const Ve=()=>({pos:new T,rx:0,ry:0,rz:0,s:1,vis:0});function Lt(o){const a=o.W/6.2,e=o.ZB+6.6,n=o.ZB,i=o.tall?.55:.75,t={M:{...Ve(),shaft:0,glow:0},K:{...Ve(),shaft:0,glow:0,turn:0},page:{...Ve(),fold:0,scr:0,cage:0,lock:0,unlock:0,read:0,spin:0},mark:{pos:new T,s:1,pulse:0},tags:{priv:0,pub:0},ring:0},s=-.985*i,m=1.075*i,v=new T(0,2.75,e),f=new T((o.tall?1.7:2.15)*a,2.35,e+.1),c=-2.2*a,z=new T(c,2.9,n-5.2),l=o.sheet,d=new T(l.x+(o.tall?0:1.2),l.y+(o.tall?2.8:1.65),l.z+.1),F=o.tall?1:1.45,h=o.tall?.3:.55,b=new T(f.x-1.5*a,2.7,e-.1);function M(r){const{M:I,K:H,page:P,mark:V}=t,B=ve(A(r,p.mark,p.mark+1.5)),U=-.5*(1-ve(A(r,p.mark,p.split+1)))+.16*Math.sin((r-p.mark)*.8);Ie(r,[[p.mark,v.x+s,v.y,v.z],[p.split,v.x+s,v.y,v.z],[p.keys+.3,v.x-1.9*a,v.y+.1,v.z],[20.5,c,2.9,n+1.6,"io"],[p.mThrough+.5,c,2.9,n-.4,"l"],[p.mOut,z.x,z.y,z.z,"o"],[25.8,z.x,z.y,z.z,"l"],[26.6,c,2.9,n+.3,"i"],[27.6,d.x+s*.52,d.y,d.z,"o"],[p.joined,d.x+s*.52,d.y,d.z,"l"]],I.pos),Ie(r,[[p.mark,v.x+m,v.y,v.z],[p.split,v.x+m,v.y,v.z],[p.keys+.3,v.x+1.9*a,v.y+.1,v.z],[p.kHome,f.x,f.y,f.z,"io"],[25,f.x,f.y,f.z,"l"],[25.8,f.x+.55*a,2.7,e-.1,"io"],[26.05,f.x+.38*a,2.7,e-.1,"l"],[26.5,f.x+.6*a,2.8,e-.1,"io"],[27.5,d.x+m*.52,d.y,d.z,"io"],[p.joined,d.x+m*.52,d.y,d.z,"l"]],H.pos);const y=he(A(r,27,p.joined));I.s=H.s=ge(i,i*.52,y),I.vis=H.vis=B*(1-ve(A(r,34.4,35.4))),I.ry=H.ry=U*(1-y);const C=ve(A(r,p.split+.2,p.keys+.9)),$=he(A(r,27.2,28.1));I.shaft=H.shaft=C*(1-$);const L=he(A(r,25.3,25.9))*(1-he(A(r,26.5,27.1)));H.rz=-L*Math.PI/2,I.rz=0,H.turn=he(A(r,26.05,26.35))*(Math.PI/2)*(1-he(A(r,26.4,26.7))),I.glow=.5+.5*Math.sin(A(r,23,23.9)*Math.PI)+.6*A(r,p.mThrough-.3,p.mThrough+.3)*(1-A(r,21.2,22)),H.glow=.5+.8*A(r,25.6,26.1)*(1-A(r,26.3,26.9)),V.pos.copy(d),V.s=i*.52,V.pulse=A(r,p.joined,p.joined+.5)*(1-A(r,p.joined+.5,p.joined+1.6)),Ie(r,[[p.msgIn,-9.5*a,4.7,n-12],[p.dock,c+1.6*a,3.1,n-4.6,"o"],[p.sealed,c+1.6*a,3.1,n-4.6,"l"],[p.pass+.1,c+.9*a,3,n-.3,"i"],[25,c+1.5*a,2.9,n+2,"l"],[p.toK,b.x,b.y,b.z,"o"],[p.open,b.x,b.y,b.z,"l"],[p.read,l.x,l.y,l.z,"io"],[p.fold,l.x,l.y,l.z,"l"],[p.cube,l.x-1.9*a,l.y+.1,l.z+.4,"io"]],P.pos),P.s=ge(h,F,he(A(r,p.open,p.read))),P.vis=ve(A(r,p.msgIn,p.msgIn+.6));const x=he(A(r,p.dock,p.sealed)),O=he(A(r,p.dock+.1,p.sealed+.1)),G=he(A(r,p.open,p.read)),u=he(A(r,p.open+.1,p.read-.1)),W=he(A(r,p.fold,p.cube)),S=he(A(r,p.seal,p.cube-.4));r<p.open?(P.fold=x,P.scr=O):r<p.seal?(P.fold=1-G,P.scr=1-u):(P.fold=W,P.scr=S),P.cage=ve(A(r,p.dock+.5,p.sealed))*(1-ve(A(r,p.unlock,p.open+.3))),P.lock=ve(A(r,p.dock+.5,p.sealed)),P.unlock=ve(A(r,p.unlock,p.unlock+.35)),P.read=1-P.scr;const k=Math.max(0,r-p.cube+.8);P.spin=k,P.ry=r<p.cube-.8?.3*Math.sin(r*.6)*P.fold:k*.5+.3*Math.sin((p.cube-.8)*.6),P.rx=r<p.cube-.8?.16*P.fold:.3+Math.sin(k*.4)*.12,P.rz=0,t.tags.priv=ve(A(r,p.kHome-.3,p.kHome+.6))*(1-A(r,27.2,27.8)),t.tags.pub=ve(A(r,p.mOut-.6,p.mOut+.4))*(1-A(r,26.4,26.9)),t.ring=ve(A(r,p.kHome-.4,p.kHome+.8))*(1-A(r,27.2,28))}return{out:t,run:M,kin:f,mOutP:z,joinP:d,C0:v,sc:i,cM:s,cK:m,cube:b,gateX:c}}const Nt="varying vec3 vN, vW, vL; void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",Dt=`
${ye}
uniform vec3 uGlow; uniform float uSweep, uVis;
varying vec3 vN, vW, vL;
vec3 env(vec3 r){
  vec3 c = vec3(.010, .013, .022);
  c += vec3(.16, .21, .30) * sst(-.1, 1., r.y) * .8;
  c += vec3(1.) * 2.6 * sst(.5, .8, dot(r, normalize(vec3(.55, .6, .6))));
  c += vec3(.5, .74, 1.) * 1.7 * sst(.55, .88, dot(r, normalize(vec3(-.8, .3, .5))));
  c += vec3(1., .82, .6) * .8 * sst(.65, .95, dot(r, normalize(vec3(.3, -.6, .75))));
  c += vec3(.9, .95, 1.) * .55 * sst(.93, .99, abs(r.x)) * sst(-.2, .6, r.y);
  c += vec3(1.) * .9 * sst(.9, .99, dot(r, normalize(vec3(0., 1., .15))));
  return c;
}
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW); if (!gl_FrontFacing) N = -N;
  vec3 R = reflect(-V, N);
  float fr = pow(max(1. - dot(N, V), 0.), 4.);
  vec3 satin = vec3(.78, .83, .92) * (.045 + .15 * sst(-1.4, 1.4, vL.y + .35 * sin(vL.x * 3.1)));
  vec3 col = satin + env(R) * (.12 + .88 * fr);
  col += uGlow * (fr * 1.2 + .04);
  float sw = exp(-pow((dot(vL.xy, normalize(vec2(1., .55))) - uSweep) * 1.9, 2.)) * .7;
  col += vec3(1.) * sw * (.3 + fr);
  gl_FragColor = vec4(col * uVis, 1.);
}`;function It(o,a){const{st:e,world:n,ar:i,camera:t}=o,s=a.out,m=[],v=[],f=[],c=new ze;n.add(c);const z=new fe(1,.6,.22),l=new fe(.28,.75,1),d=2.8;[0,1].forEach(y=>{const C=ft(y,.5,!0),$={uGlow:{value:(y?z:l).clone()},uSweep:{value:0},uVis:{value:1}},L=new be({vertexShader:Nt,fragmentShader:Dt,uniforms:$,side:Me});v.push(L);const x=new ze,O=new me(C.geometry,L);x.rotation.order="ZYX";const G=new Pe(.1,.1,d,20).translate(0,.1-d/2,0),u=new me(G,L),W=new ze,S=[],k=y?[[-.36,-2.05],[-.24,-2.32],[-.4,-2.58]]:[[.3,-2.05],[.42,-2.3],[.26,-2.58]];for(const[g,R]of k){const ne=new Te(Math.abs(g),.2,.2);f.push(ne),ne.translate(g/2+Math.sign(g)*.05,0,0);const Z=new me(ne,L);Z.position.y=R,S.push(Z),W.add(Z)}x.add(O,u,W),f.push(C.geometry,G);for(const g of[O,u,...S])g.frustumCulled=!1;c.add(x),m.push({group:x,shaft:u,teeth:W,tooth:S,U:$})});const F=i?ke.ar:ke.mono,h=y=>qe(y,{font:F,px:96,weight:i?700:600,color:"#ffffff",rtl:i,align:"center"}),b=h(i?"خاص":"PRIVATE"),M=h(i?"عام":"PUBLIC");b.U.uColor.value.setRGB(...X.amber.map(y=>y*1.2)),M.U.uColor.value.setRGB(...X.cyan.map(y=>y*1.3)),b.set(.34),M.set(.34),b.mesh.renderOrder=M.mesh.renderOrder=9,n.add(b.mesh,M.mesh);const r=xe({count:2,shared:e.G,fog:.01});r.mesh.renderOrder=7,n.add(r.mesh);const I=48,H=xe({count:I,shared:e.G,fog:.01});H.mesh.renderOrder=6,n.add(H.mesh);const P=Fe({count:2,shared:e.G,core:.9,uniforms:{uHalo:{value:new Se},uHalo2:{value:new Se}},pt:`
      uniform vec4 uHalo, uHalo2;
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        vec4 h = id < .5 ? uHalo : uHalo2;
        pos = h.xyz; size = h.w; col = vec4(vec3(.7, .88, 1.) * (id < .5 ? 1.2 : 1.6), step(1., h.w));
      }`});P.mesh.renderOrder=8,n.add(P.mesh);const V=P.U.uHalo.value,B=P.U.uHalo2.value,U=(y,C,$,L)=>{y.mesh.visible=$>.02,y.U.uAlpha.value=$*.95,y.mesh.position.set(C.x,L,C.z),y.mesh.quaternion.copy(t.quaternion)};return{update(y){const{M:C,K:$,mark:L}=s,x=[C,$];m.forEach((D,J)=>{const ee=x[J],_=ee.vis;D.group.visible=_>.01,D.group.position.copy(ee.pos),D.group.rotation.set(0,ee.ry+(J?$.turn:0),ee.rz),D.group.scale.setScalar(ee.s*(.55+.45*_)),D.shaft.scale.y=Math.max(1e-4,ee.shaft),D.shaft.visible=ee.shaft>.005,D.teeth.visible=ee.shaft>.02,D.teeth.scale.set(1,Math.max(1e-4,ee.shaft),1),D.tooth.forEach((w,E)=>w.scale.x=Math.max(.001,Math.min(1,(ee.shaft-.72)*3.5-E*.1))),D.U.uVis.value=_,D.U.uSweep.value=(y*.5+J*1.3)%6-2.4,D.U.uGlow.value.copy(J?z:l).multiplyScalar(.35+.9*ee.glow)});const O=$.pos.y+$.s*1.12,G=C.pos.y+C.s*1.12,u=t.position.distanceTo($.pos),W=t.position.distanceTo(C.pos),S=o.tall?.019:.03;b.set(S*u),M.set(S*W),U(b,$.pos,s.tags.priv,O+.012*u+.3),U(M,C.pos,s.tags.pub,G+.012*W+.3),r.set(0,$.pos.x,O+.06,$.pos.z,$.pos.x,O+.4,$.pos.z,X.amber[0],X.amber[1],X.amber[2],s.tags.priv*.6,1.1,0,1,0),r.set(1,C.pos.x,G+.06,C.pos.z,C.pos.x,G+.4,C.pos.z,X.cyan[0],X.cyan[1],X.cyan[2],s.tags.pub*.6,1.1,0,1,0),r.dirty();const k=1.3,g=a.kin.x,R=a.kin.z,ne=s.ring;for(let D=0;D<I;D++){const J=D/I*Math.PI*2,ee=(D+1)/I*Math.PI*2,_=Math.min(1,Math.max(0,ne*1.3*I-D));H.set(D,g+Math.cos(J)*k,.02,R+Math.sin(J)*k,g+Math.cos(ee)*k,.02,R+Math.sin(ee)*k,X.amber[0]*1.3,X.amber[1]*1.3,X.amber[2]*1.3,ne*.9,1.6,0,_,0)}o.LU.uLights.value[15].set(g,1.2,R,ne*.9),H.dirty();const Z=Math.max(0,1-Math.abs(y-17.4)/1.1);V.set(a.C0.x,a.C0.y,a.C0.z,Z>0?40+260*Z*Z:0),B.set(L.pos.x,L.pos.y,L.pos.z,L.pulse>.01?40+380*L.pulse:0)},dispose(){n.remove(c,b.mesh,M.mesh,r.mesh,H.mesh,P.mesh),v.forEach(y=>y.dispose()),f.forEach(y=>y.dispose()),b.dispose(),M.dispose(),r.dispose(),H.dispose(),P.dispose()}}}const Vt={en:{body:"Hello, it’s Sara from the flower shop. Could you please move my order to Friday morning and keep my address and my card details private? Thank you.",name:"Sara"},ar:{body:"مرحباً، معك سارة من محل الزهور. هل يمكنك نقل طلبي إلى صباح الجمعة والحفاظ على سرّية عنواني وبيانات بطاقتي؟ شكراً لك.",name:"سارة"}},Et="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",Kt=`
${Ke}
${ye}
uniform sampler2D uTex, tGlyph; uniform vec2 uGrid; uniform vec4 uRect; uniform float uScr, uAlpha, uTime, uGA, uGC, uGS, uGN, uSeed, uGlow;
varying vec2 vUv;
float glyphIndex(float r){ float n = uGA + 26. + uGN, k = floor(r * n); if (k < uGA) return k; k -= uGA; if (k < 26.) return uGC + k; return uGS + (k - 26.); }
float gsample(float g, vec2 c){ if (c.x < 0. || c.x > 1. || c.y < 0. || c.y > 1.) return 0.; vec2 cell = vec2(mod(g, uGrid.x), floor(g / uGrid.x)); return texture2D(tGlyph, (cell + c) / uGrid).r; }
void main(){
  vec2 uv = vUv;
  float tx = texture2D(uTex, uRect.xy + uv * uRect.zw).a;
  const float N = 11.;
  vec2 g = uv * N, id = floor(g), f = fract(g);
  float h = h12(id + uSeed);
  float t0 = (id.x * .5 + id.y) / (N * 1.5) * .55 + h * .35;
  float on = sst(t0, t0 + .12, uScr);
  float r = floor(uTime * (2.5 + h * 5.) + h * 60.);
  float gi = glyphIndex(h12(id + r * 7.13 + uSeed * 3.));
  float d = gsample(gi, (f - .5) * 1.18 + .5);
  float aa = fwidth(d) * .8 + .004;
  float soup = sst(.5 - aa, .5 + aa, d) * (.5 + .5 * h);
  vec3 ink = S(vec3(.88, .94, 1.)), sc = S(vec3(.45, .84, 1.)), sil = S(vec3(.78, .83, .91));
  vec3 col = ink * tx * (1. - on) * 1.05 + sc * soup * on * 1.25;
  float e = min(min(uv.x, 1. - uv.x), min(uv.y, 1. - uv.y));
  float fw = fwidth(e) + 1e-5;
  col += sil * (1. - sst(fw * .8, fw * 2.2, e)) * (.45 + .6 * uScr + uGlow);
  col += S(vec3(.12, .2, .34)) * (.35 + .5 * uScr) * (.5 + .5 * sst(0., .5, 1. - uv.y));
  gl_FragColor = vec4(col * uAlpha, 1.);
}`,je=new at,_t=new T;function $t(o,a){const{world:e,atlas:n,st:i,tall:t,ar:s}=o,m=a.out,v=m.page,f=1.1,c=512,z=(t?3:4)*c,l=(t?4:3)*c,d=t?[{i:0,parent:1,e:[0,1],at:[1,0],delay:.3},{i:1,parent:-1,e:[0,0],at:[1,1],delay:0},{i:2,parent:1,e:[0,-1],at:[1,2],delay:.1},{i:3,parent:2,e:[0,-1],at:[1,3],delay:0},{i:4,parent:1,e:[-1,0],at:[0,1],delay:.15},{i:5,parent:1,e:[1,0],at:[2,1],delay:.2}]:[{i:0,parent:1,e:[-1,0],at:[0,1],delay:.3},{i:1,parent:-1,e:[0,0],at:[1,1],delay:0},{i:2,parent:1,e:[1,0],at:[2,1],delay:.1},{i:3,parent:2,e:[1,0],at:[3,1],delay:0},{i:4,parent:1,e:[0,1],at:[1,0],delay:.15},{i:5,parent:1,e:[0,-1],at:[1,2],delay:.2}],F=document.createElement("canvas");F.width=z,F.height=l;const h=F.getContext("2d"),b=Vt[s?"ar":"en"];h.fillStyle="#fff",h.strokeStyle="#fff",h.textBaseline="alphabetic",h.lineJoin="round",h.lineCap="round";const M=t?60:70;h.font=`500 ${M}px ${s?ke.ar:ke.sans}`,h.direction=s?"rtl":"ltr";const r=c*.09,I=(t?1:4)*c-r*2,H=[];{let w="";for(const E of b.body.split(" ")){const j=w?w+" "+E:E;h.measureText(j).width>I&&w?(H.push(w),w=E):w=j}w&&H.push(w)}const P=M*(s?1.7:1.42);if(h.textAlign=s?"right":"left",t){const w=Math.ceil(H.length/4);H.forEach((E,j)=>{const te=Math.floor(j/w),re=j%w;h.fillText(E,s?c*2-r:c+r,te*c+(c-w*P)/2+M*.85+re*P)})}else{const w=c+(c-H.length*P)/2+M*.85;H.forEach((E,j)=>h.fillText(E,s?z-r:r,w+j*P))}const[V,B]=[d[4].at[0]*c,d[4].at[1]*c],[U,y]=[d[5].at[0]*c,d[5].at[1]*c];h.lineWidth=7,h.beginPath(),h.arc(V+c*.5,B+c*.36,c*.13,0,Math.PI*2),h.stroke(),h.beginPath(),h.arc(V+c*.5,B+c*.78,c*.26,Math.PI*1.15,Math.PI*1.85),h.stroke(),h.font=`600 ${M*1.05}px ${s?ke.ar:ke.sans}`,h.textAlign="center",h.fillText(b.name,V+c*.5,B+c*.94);for(let w=0;w<4;w++){const E=y+c*(.22+w*.17),j=c*(.74-w%2*.22-(w===3?.2:0));h.lineWidth=12,h.beginPath(),h.moveTo(U+c*.13,E),h.lineTo(U+c*.13+j,E),h.stroke()}const C=new et(F);C.colorSpace=tt,C.anisotropy=8,C.generateMipmaps=!0,C.minFilter=ot,C.needsUpdate=!0;const $={uTex:{value:C},tGlyph:{value:n.tex},uGrid:{value:new Le(n.cols,n.rows)},uScr:{value:1},uAlpha:{value:1},uTime:i.G.uTime,uGA:{value:n.idx("0")},uGC:{value:n.idx("A")},uGS:{value:n.idx("+")},uGN:{value:n.rain-3-n.idx("+")},uGlow:{value:0}},L=new ze,x=new ze;L.add(x);const O=[],G=[],u=[],W=new st({color:66314,transparent:!0,opacity:.93,depthWrite:!1,side:Me});d.forEach(w=>{const E=new Ee(f,f);G.push(E);const j=new be({vertexShader:Et,fragmentShader:Kt,transparent:!0,depthWrite:!1,blending:Ae,side:Me,uniforms:{...$,uRect:{value:new Se(w.at[0]*c/z,1-(w.at[1]+1)*c/l,c/z,c/l)},uSeed:{value:w.i*3.7}}});O.push(j);const te=new me(E,j),re=new me(E,W);te.renderOrder=8,re.renderOrder=7,te.frustumCulled=re.frustumCulled=!1,te.position.set(w.e[0]*f/2,w.e[1]*f/2,0),re.position.copy(te.position),re.position.z=-.003;const oe=new ze;oe.add(te,re),u.push(oe)}),d.forEach(w=>{if(w.parent<0){x.add(u[w.i]);return}const E=d[w.parent];u[w.i].position.set((E.e[0]+w.e[0])*f/2,(E.e[1]+w.e[1])*f/2,0),u[w.parent].add(u[w.i])}),e.add(L),L.visible=!1;const S=150,k=ut({atlas:n,count:S,shared:i.G,glow:.5,uniforms:{uVis:{value:0}},shade:"uniform float uVis; uniform float uTime; vec4 shade(vec4 col, float a, float halo, vec4 fx){ float tw = .6 + .4 * sin(uTime * (1. + fx.x * 3.) + fx.y * 6.); return vec4(col.rgb * (a + halo) * uVis * tw, col.a); }"});k.mesh.renderOrder=9;const g=[];for(let w=0;w<n.rain-3;w++)(w<n.idx("0")||w>=n.idx("A"))&&g.push(w);for(let w=0;w<S;w++){const E=we(w*1.1),j=we(w*2.3+5),te=we(w*3.7+9);k.set(w,(E-.5)*f*.82,(j-.5)*f*.82,(te-.5)*f*.82,g[Math.floor(we(w*7.7)*g.length)],f*.15,.45,.85,1,1,we(w*4.1),we(w*6.3),0,0)}k.setCount(S),k.dirty(),L.add(k.mesh);const R=xe({count:26,shared:i.G,fog:.01});R.mesh.renderOrder=9,e.add(R.mesh);const ne=Ze(1,1,1),Z=new T,D=new T,J=new T,ee=t?0:-f*.5,_=t?f*.5:0;return{group:L,centre:Z,update(w){const E=v.vis>.01;if(L.visible=E,R.mesh.visible=E,!E)return;L.position.copy(v.pos),L.rotation.set(v.rx,v.ry,v.rz,"YXZ"),L.scale.setScalar(v.s*(.4+.6*v.vis));const j=v.fold;$.uScr.value=v.scr,$.uAlpha.value=v.vis,$.uGlow.value=v.cage*.25,x.position.set(ge(ee,0,j),ge(_,0,j),ge(0,f/2,j));for(const Q of d){if(Q.parent<0)continue;const ce=Math.min(1,Math.max(0,j*1.3-Q.delay));je.setFromAxisAngle(_t.set(-Q.e[1],Q.e[0],0),ce*ce*(3-2*ce)*Math.PI/2),u[Q.i].quaternion.copy(je)}k.U.uVis.value=j*v.scr*v.vis,k.mesh.visible=j*v.scr>.05;const te=v.s,re=f*te*1.55,oe=v.pos,de=v.cage,ie=1+(1-de)*.25;Z.copy(oe);for(let Q=0;Q<12;Q++){const ce=ne[Q];D.set(ce[0],ce[1],ce[2]).multiplyScalar(re*ie).applyQuaternion(L.quaternion).add(oe),J.set(ce[3],ce[4],ce[5]).multiplyScalar(re*ie).applyQuaternion(L.quaternion).add(oe),R.set(Q,D.x,D.y,D.z,J.x,J.y,J.z,X.ice[0],X.ice[1],X.ice[2],de*.75,1.4,0,1,0)}const pe=oe.x,K=oe.y+re*.5+.5*(.5+te),se=.7*(.5+te),le=oe.z,ue=v.unlock*.13,N=Math.max(0,Math.min(1,v.lock*(1-Math.max(0,(w-26.7)*2.2))*v.vis));let Y=0;const ae=(Q,ce,Ce,Re,Ue,Qe=1.6)=>R.set(12+Y++,pe+Q*se,K+ce*se,le,pe+Ce*se,K+Re*se,le,X.ice[0],X.ice[1],X.ice[2],Ue,Qe,0,1,0);ae(-.28,-.2,.28,-.2,N),ae(.28,-.2,.28,.16,N),ae(.28,.16,-.28,.16,N),ae(-.28,.16,-.28,-.2,N),ae(0,-.02,0,-.12,N*.9,2.4),ae(-.04,.04,.04,.04,N*.9,2.4),ae(-.17,.16,-.17,.28,N),ae(.17,.16+ue,.17,.28+ue,N);for(let Q=0;Q<6;Q++){const ce=Math.PI-Q/6*Math.PI,Ce=Math.PI-(Q+1)/6*Math.PI,Re=Math.cos(ce)*.17,Ue=Math.cos(Ce)*.17;ae(Re,.28+Math.sin(ce)*.17+ue*(Re+.17)/.34,Ue,.28+Math.sin(Ce)*.17+ue*(Ue+.17)/.34,N)}R.dirty()},dispose(){e.remove(L,R.mesh),C.dispose(),O.forEach(w=>w.dispose()),W.dispose(),G.forEach(w=>w.dispose()),k.dispose(),R.dispose()}}}const Xt=`
${Ke}
${ye}
uniform float uA, uScan, uTime, uHit; varying vec2 vUv;
void main(){
  vec2 p = (vUv - .5) * vec2(1.9, 2.4);
  float d = sdRBox(p, vec2(.95, 1.2) - .12, .12), px = fwidth(p.y) + 1e-5;
  float line = 1. - sst(px * .6, px * 1.8, abs(d));
  float fill = sst(px, -px, d);
  vec3 sil = S(vec3(.78, .83, .91)), cy = S(vec3(.5, .86, 1.));
  vec3 col = sil * line * (.6 + uHit * 1.2) + S(vec3(.05, .09, .16)) * fill * (.5 + .5 * sst(1.2, -1.2, p.y));
  // corner ticks
  vec2 q = abs(p) - vec2(.95, 1.2) + .12; float tk = step(.0, q.x) * 0.;
  col += cy * exp(-pow((p.y - uScan) / .018, 2.)) * fill * step(0., uScan + 1.3) * step(uScan, 1.3) * .9;
  col += cy * exp(-pow((p.y - uScan) / .25, 2.)) * fill * step(0., uScan + 1.3) * step(uScan, 1.3) * .07;
  col += cy * fill * uHit * .25 * exp(-length(p) * 1.2);
  gl_FragColor = vec4(col * uA, 1.);
}`;function jt(o){const{L:a,LU:e,st:n,world:i,ar:t,camera:s}=o,m=a.card,v=a.W,f=a.tall?.8:1.35,c={uA:{value:0},uScan:{value:-9},uTime:n.G.uTime,uHit:{value:0}},z=new Ee(1.9,2.4),l=new me(z,new be({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Xt,uniforms:c,transparent:!0,depthWrite:!1,blending:Ae,side:Me}));l.position.copy(m),l.scale.setScalar(f),l.renderOrder=6,l.frustumCulled=!1,i.add(l);const d=640,F=[];for(let u=0;u<=d;u++){const W=u/d,S=W*Math.PI*2*7.4,k=.05+W*.8;let g=Math.cos(S)*k*(.84+.06*W),R=Math.sin(S)*k*1.07;g+=Math.sin(S*3+k*4)*.008+Math.sin(k*9)*.02*W,R+=Math.cos(S*2+k*5)*.008,R=R<0?R*(1-.16*W):R,F.push([g,R+.02])}const h=xe({count:d,shared:n.G,fog:.005});h.mesh.renderOrder=7,i.add(h.mesh);const b=ht.verified[t?"ar":"en"],M=qe(b,{font:t?ke.ar:ke.sans,px:150,weight:700,color:"#ffffff",rtl:t,align:"center"});M.U.uColor.value.setRGB(...X.cyan.map(u=>u*1.4)),M.mesh.renderOrder=9,i.add(M.mesh);const r=xe({count:60,shared:n.G,fog:.005});r.mesh.renderOrder=9,i.add(r.mesh);const I=xe({count:a.vessels.length*2,shared:n.G,fog:.008});I.mesh.renderOrder=6,i.add(I.mesh);const H=.46,P=H*M.aspect,V=[],B=(P*.6+.22)*f,U=H*.7*f,y=.14*f,C=-.09,$=Math.cos(C),L=Math.sin(C);{const u=(W,S,k)=>{for(let g=0;g<=3;g++){const R=(k+g*30)*Math.PI/180;V.push([W+Math.cos(R)*y,S+Math.sin(R)*y])}};u(B-y,U-y,0),u(-B+y,U-y,90),u(-B+y,-U+y,180),u(B-y,-U+y,270),V.push(V[0]);for(const W of V){const S=W[0],k=W[1];W[0]=S*$-k*L,W[1]=S*L+k*$}}const x=X.cyan.map(u=>u*1.2),O=X.cyan.map(u=>u*1.3),G=X.cyan.map(u=>u*1.5);return{fingerLen:d,update(u){const W=u>p.card-.3&&u<42,S=u>p.copy-.3&&u<40.5;l.visible=h.mesh.visible=r.mesh.visible=W,M.mesh.visible=W&&u>p.stamp-.01,I.mesh.visible=S;for(let N=0;N<3;N++){const Y=p.doors+N*.95,ae=e.uDoor.value[N],Q=A(u,Y,Y+1.6)*2,ce=A(u,Y+1.7,Y+2.2),Ce=ve(A(u,Y+2.2,Y+2.8))*(1-he(A(u,Y+3.5,Y+4.2)));ae.set(Q>=2?0:Q,ce*(1-A(u,Y+3.8,Y+4.3)),Ce,q(u,Y-.3,Y+.4)*(1-q(u,Y+4.3,Y+5))*.6+.4*A(u,Y+1.7,Y+2.3)*(1-q(u,Y+3.8,Y+4.4)))}const k=A(u,p.copy,p.copy+2.8);if(e.uCopy.value=k,e.uPart.value=q(u,p.copy-.6,p.copy+.6)*(1-q(u,38.2,39.6)),!W)return;const g=ve(A(u,p.card,p.card+.8))*(1-q(u,40,41.5));c.uA.value=g,l.visible=g>.01;const R=A(u,p.finger,p.finger+2.1);c.uScan.value=u<p.stamp-.3?-9:-1.3+2.6*A(u,p.stamp+.1,p.stamp+.9);const ne=m.x,Z=m.y+.22*f,D=m.z+.03,J=.98*f,ee=g*(1-q(u,40,41.5));for(let N=0;N<d;N++){const Y=F[N],ae=F[N+1],Q=Math.min(1,Math.max(0,R*d-N));h.set(N,ne+Y[0]*J,Z+Y[1]*J,D,ne+ae[0]*J,Z+ae[1]*J,D,x[0],x[1],x[2],Q>0?ee*(.55+.4*(N/d))*(1-.6*q(u,p.stamp,p.stamp+.5)):0,1.7,0,Q,Q<1?2.2:0)}h.dirty();const _=u-p.stamp,w=_>-.01&&_<99;M.mesh.visible=w&&g>.02;const E=A(_,0,.26),j=_>.26?Math.sin((_-.26)*20)*Math.exp(-(_-.26)*7)*.07:0,te=_<0?1:1+1.4*(1-E)*(1-E)+j;M.set(H*te*f),M.mesh.position.set(m.x,m.y-.8*f,m.z+.06),M.mesh.rotation.set(0,0,-.09);const re=q(_,0,.1)*(1-q(u,40,41.5));M.U.uAlpha.value=re,c.uHit.value=_>.24?Math.exp(-(_-.24)*4.2):0;const oe=m.x,de=m.y-.8*f,ie=m.z+.06,pe=q(_,.1,.5),K=V.length-1;for(let N=0;N<K;N++){const Y=V[N],ae=V[N+1],Q=Math.min(1,Math.max(0,pe*K-N));r.set(N,oe+Y[0],de+Y[1],ie,oe+ae[0],de+ae[1],ie,O[0],O[1],O[2],re*.9,2,0,Q,0)}const se=A(_,.26,1),le=(1-se)*(_>.26?1:0)*(1-q(u,40,41.5));for(let N=0;N<40;N++){const Y=N/40*Math.PI*2,ae=(N+1)/40*Math.PI*2,Q=.5+se*1.9;r.set(20+N,oe+Math.cos(Y)*Q*.86,de+Math.sin(Y)*Q,ie,oe+Math.cos(ae)*Q*.86,de+Math.sin(ae)*Q,ie,X.ice[0],X.ice[1],X.ice[2],le*.7,1.5,0,1,0)}r.dirty();let ue=0;for(const N of a.vessels){const Y=p.copy+2.8*((3-N.z)/26),ae=A(u,Y,Y+.7),Q=-2*v-N.x,ce=N.y0+N.h*.5,Ce=u>Y-.2?1:0;I.set(ue++,N.x,ce,N.z,Q,ce,N.z,X.cyan[0],X.cyan[1],X.cyan[2],Ce*.12*(1-q(u,38.2,39.6)),1.2,0,1,0),I.set(ue++,N.x,ce,N.z,Q,ce,N.z,G[0],G[1],G[2],ae>0&&ae<1?1:0,2,Math.max(0,ae-.22),ae,3)}I.dirty()},dispose(){i.remove(l,h.mesh,M.mesh,r.mesh,I.mesh),z.dispose(),l.material.dispose(),h.dispose(),M.dispose(),r.dispose(),I.dispose()}}}const qt=`
${ye}
uniform vec3 uCol; uniform float uI, uT, uDraw; varying vec2 vUv;
void main(){
  float a = vUv.x, h = vUv.y;
  float draw = (1. - sst(uDraw - .015, uDraw, a)) * step(.001, uDraw);
  float fall = pow(max(1. - h, 0.), 2.4);
  float sweep = pow(clamp(.5 + .5 * cos((a - fract(uT * .2)) * 6.2832), 0., 1.), 10.);
  float pulse = .6 + .4 * sin(uT * 7.5);
  float stripes = .82 + .18 * sin(a * 520.);
  vec3 col = uCol * (fall * (.18 + 1.2 * sweep) * pulse + exp(-h * 36.) * 1.1) * uI * draw * stripes;
  gl_FragColor = vec4(min(col, vec3(6.)), 1.);
}`;function Zt(o){const{L:a,LU:e,st:n,world:i,ctx:t}=o,s=a.ringR,m=a.ctr.x,v=a.ctr.z,f=192,c=xe({count:f,shared:n.G,fog:.004});c.mesh.renderOrder=6,i.add(c.mesh);const z={uCol:{value:new fe},uI:{value:0},uT:n.G.uTime,uDraw:{value:0}},l=new Pe(s,s,3.4,160,1,!0).translate(m,1.7,v),d=new me(l,new be({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:qt,uniforms:z,transparent:!0,depthWrite:!1,blending:Ae,side:Me}));d.frustumCulled=!1,d.renderOrder=4,i.add(d);const F=96,h=xe({count:F*3,shared:n.G,fog:.004});h.mesh.renderOrder=6,i.add(h.mesh);const b=We(t,700,1500,2600),M={uT:{value:0},uCtr:{value:a.ctr},uBox:{value:a.box},uCol:{value:new fe(...X.grey)},uFl:{value:new fe}},r=Fe({count:b*3,shared:n.G,atten:0,core:.55,uniforms:M,fog:0,pt:`
      ${ye}
      uniform float uT; uniform vec3 uCtr, uBox, uCol, uFl;
      float hs(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float pid = floor(id / 3.), k = id - pid * 3.;
        float r1 = hs(pid * 1.7 + 1.), r2 = hs(pid * 3.1 + 2.), r3 = hs(pid * 5.3 + 3.), r4 = hs(pid * 7.9 + 4.), r5 = hs(pid * 9.7 + 5.);
        float th = r1 * 6.2832, ph = acos(mix(.05, 1., r2));
        vec3 dir = normalize(vec3(sin(ph) * cos(th), cos(ph) * .8 + .12, sin(ph) * sin(th)));
        vec3 start = uCtr + dir * (60. + 40. * r3) + vec3(0., 6., 0.);
        float tb = 1. / max(abs(dir.x) / uBox.x, max(abs(dir.y) / uBox.y, abs(dir.z) / uBox.z));
        vec3 end = uCtr + dir * tb * 1.015;
        float ta = 38.3 + r4 * 2.0, u = (uT - (ta - 2.3)) / 2.3 - k * .022;
        pos = vec3(0.); size = 0.; col = vec4(0.);
        if (u < 0. || u > 1.8) return;
        float e = u < 1. ? u * u * (1.6 - .6 * u) : 1.;
        pos = mix(start, end, e);
        float a = r5 * 6.2832 + uT * 2.;
        vec3 side = normalize(cross(dir, vec3(0., 1., .3)) + vec3(1e-4));
        pos += side * sin(u * 8. + r4 * 6.28) * (1. - e) * (2. + 5. * r3) + vec3(0., cos(a), 0.) * (1. - e) * 1.5;
        float cl = max(u - 1., 0.);
        pos += (normalize(vec3(r3 - .5, r2 - .5, r5 - .5) + vec3(1e-4)) * (.5 + 2.5 * r1)) * (1. - exp(-cl * 3.)) * step(1., u);
        float flash = exp(-cl * 9.) * step(1., u), live = 1. - sst(.1, .8, cl);
        float tr = k < .5 ? 1. : (k < 1.5 ? .5 : .22);
        size = (2.4 + 2.2 * r5 + 8. * flash) * (k < .5 ? 1. : .8);
        float tw = .6 + .4 * sin(uT * (8. + 6. * r1) + pid);
        col = vec4(mix(uCol * 1.4 * tw * live, uFl * 2.1, flash) * tr, 1.);
      }`});r.mesh.renderOrder=6,i.add(r.mesh);const I=new fe(...X.red),H=new fe(...X.blue),P=new fe,V=new fe(...X.silver),B=new fe(.45,.62,1);return{update(U){const y=q(U,40.9,43.4);e.uAlarm.value.copy(P.copy(I).lerp(H,y)),M.uFl.value.copy(e.uAlarm.value);const C=A(U,36.9,37.9),$=1-q(U,44.6,46.2),L=C>0&&$>.002;z.uDraw.value=C*1,z.uCol.value.copy(e.uAlarm.value),z.uI.value=(C>0?(.8+.5*Math.exp(-Math.pow((U-39.3)/1.4,2))+(1-y)*.5)*ge(1,.55,y):0)*$,d.visible=c.mesh.visible=L,h.mesh.visible=U>38.1&&U<42,r.mesh.visible=U>35.8&&U<42.6;const x=C,O=(1.1+.9*Math.exp(-Math.pow((U-39.3)/1.6,2)))*$;if(L)for(let G=0;G<f;G++){const u=G/f*Math.PI*2,W=(G+1)/f*Math.PI*2,S=Math.min(1,Math.max(0,x*f*1-G));c.set(G,m+Math.cos(u)*s,.05,v+Math.sin(u)*s,m+Math.cos(W)*s,.05,v+Math.sin(W)*s,e.uAlarm.value.r*O,e.uAlarm.value.g*O,e.uAlarm.value.b*O,S>0?1:0,3.2,0,S,S<1?3:0)}if(L&&c.dirty(),h.mesh.visible)for(let G=0;G<3;G++){const u=A(U,38.2+G*.9,40.1+G*.9),W=ge(s*.62,s*.985,ve(u)),S=u>0&&u<1?(1-u)*(1-u)*.8*$:0;for(let k=0;k<F;k++){const g=k/F*Math.PI*2,R=(k+1)/F*Math.PI*2;h.set(G*F+k,m+Math.cos(g)*W,.04,v+Math.sin(g)*W,m+Math.cos(R)*W,.04,v+Math.sin(R)*W,e.uAlarm.value.r,e.uAlarm.value.g,e.uAlarm.value.b,S,1.6,0,1,0)}}h.mesh.visible&&h.dirty(),e.uStorm.value=Math.exp(-Math.pow((U-39.4)/1.4,2))*.95*(1-y*.5),e.uGround.value=q(U,36.4,38.4),e.uBase.value=.03+.2*q(U,36.2,38)*(1-.55*q(U,45,47)),e.uTint.value.copy(P.copy(V).lerp(B,q(U,41,45))),M.uT.value=U},dispose(){i.remove(c.mesh,d,r.mesh,h.mesh),h.dispose(),c.dispose(),l.dispose(),d.material.dispose(),r.dispose()}}}function Qt(o){const{L:a,st:e,world:n,ctx:i}=o,{W:t,HH:s,ZB:m}=a,v=[-4.5,-9,-13.5,-18,-22.5,-27,-31.5].filter(M=>M>m+1),f=xe({count:12+v.length*5,shared:e.G,fog:.006});f.mesh.renderOrder=4,n.add(f.mesh);const c=Ze(4*t,s,-m,-t,s/2,m/2),[z,l,d]=X.silver,F=-3*t,h={uAir:{value:0},uBox:{value:new Se(F,4*t,m,s)}},b=Fe({count:We(i,120,220,360),shared:e.G,atten:5,core:.5,uniforms:h,fog:.012,pt:`
      uniform float uAir; uniform vec4 uBox;
      float hs(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float a = hs(id * 1.3 + 1.), b = hs(id * 2.9 + 2.), c = hs(id * 4.1 + 3.), d = hs(id * 6.7 + 4.);
        float rise = fract(c + uTime * (.012 + .02 * d));
        pos = vec3(uBox.x + a * uBox.y + sin(uTime * .15 + id) * .25, rise * uBox.w, uBox.z * b + cos(uTime * .12 + id * 1.7) * .25);
        size = 1.6 + 2.2 * d;
        col = vec4(vec3(.62, .74, 1.) * (.1 + .16 * d) * uAir * sin(rise * 3.1416), 1.);
      }`});return b.mesh.renderOrder=2,n.add(b.mesh),{update(M){const r=q(M,36.2,37.8)*(1-q(M,45.6,47.2)),I=(.2+.75*r)*q(M,2.4,5),H=1.5+1.2*r;let P=0;for(const B of c)f.set(P++,B[0],B[1],B[2],B[3],B[4],B[5],z,l,d,I,H,0,1,0);const V=(.14+.5*r)*q(M,2.4,5);for(const B of v)f.set(P++,F,0,B,t,0,B,z,l,d,V,1.2,0,1,0),f.set(P++,t,0,B,t,s,B,z,l,d,V,1.2,0,1,0),f.set(P++,t,s,B,F,s,B,z,l,d,V,1.2,0,1,0),f.set(P++,F,s,B,F,0,B,z,l,d,V,1.2,0,1,0),f.set(P++,-t,0,B,-t,s,B,z,l,d,V*.8,1.2,0,1,0);f.dirty(),h.uAir.value=q(M,4,7)*(1-q(M,36,37.5))},dispose(){n.remove(f.mesh,b.mesh),f.dispose(),b.dispose()}}}const Yt=`
${ye}
uniform float uFac, uH0, uTanH, uBlue, uHz, uDim, uHR; uniform vec2 uGlint;
uniform vec2 uFacOrg;
uniform vec3 uCamPos, uCamR, uCamU, uCamF, uGrade;
uniform vec4 uLights[16];
vec3 bgE(vec2 uv){ return mix(S(vec3(.008, .010, .016)), S(vec3(.028, .032, .046)), sst(1.2, 0., length((uv - vec2(.5, .62)) * vec2(uAsp, 1.)))); }
// pivot F, with its horizon where the room's own ground puts it
vec3 skyF(vec2 uv, float hy){
  float px = fwidth(uv.y);
  vec2 p = (uv - vec2(.5, hy)) * vec2(uAsp, 1.); float y = p.y;
  vec3 sky = mix(S(vec3(.05, .16, .46)), S(vec3(.006, .022, .11)), sst(0., .55, y));
  vec3 flo = mix(S(vec3(.03, .10, .30)), S(vec3(.003, .012, .06)), sst(0., .5, -y));
  vec3 col = mix(flo, sky, sst(-px * 1.2, px * 1.2, y));
  float gl = exp(-dot(p / vec2(.85, .5), p / vec2(.85, .5)) * 2.4);
  col += S(vec3(.80, .90, 1.)) * gl * .85;
  col += S(vec3(.8, .92, 1.)) * exp(-abs(y) / (px * 1.4)) * (.55 + .45 * exp(-p.x * p.x * 3.)) * (1. - sst(uHR * (uAsp * .5 + .3) - .2, uHR * (uAsp * .5 + .3), abs(p.x)));
  float rf = exp(-pow(p.x / (.35 + .8 * -y), 2.)) * sst(0., -.45, y) * step(y, 0.);
  col += S(vec3(.5, .72, 1.)) * rf * .22 * (.8 + .2 * sin(y * 90. + uTime * 1.2));
  return col;
}
vec3 look(vec2 uv){
  vec3 col = (samp(uv) + bloom(uv) * .55) * uDim;
  vec3 bg = bgE(uv);
  // until the camera is through it, the wall is the pivot's own lattice, laid on the room as a plane at z = 0
  if (uFac > .001){
    vec2 nd = (uv - .5) * 2.;
    vec3 ray = normalize(uCamF + uCamR * (nd.x * uTanH * uAsp) + uCamU * (nd.y * uTanH));
    float t = -uCamPos.z / ray.z;
    vec3 hit = uCamPos + ray * max(t, 0.);
    vec2 pat = (hit.xy - uFacOrg) / uH0 + vec2(uAsp * .5, .5);
    vec2 uvp = t > 0. ? vec2(pat.x / uAsp, pat.y) : uv;
    vec3 f = pivotE(uvp);
    float ls = 0.;
    for (int i = 0; i < 16; i++){ vec4 l = uLights[i]; if (l.w <= 0.) continue; vec3 d = hit - l.xyz; ls += l.w * exp(-dot(d, d) * .055); }
    f *= 1. + 1.4 * ls;
    f += f * exp(-pow((uvp.x * uAsp + uvp.y * .35 - uGlint.x) * 3.6, 2.)) * uGlint.y * 1.7;
    bg = mix(bg, f, uFac * step(0., t));
  }
  col += bg;
  if (uBlue > .001){
    vec3 sky = skyF(uv, uHz);
    col = mix(col * mix(vec3(1.), uGrade, uBlue), sky + col * .45 * uGrade, uBlue);
  }
  return col;
}`;async function ro(o){const a=await dt(o);await He();const e=wt(),n={uFac:{value:1},uGlint:{value:new Le(-9,0)},uH0:{value:6.5},uTanH:{value:.364},uBlue:{value:0},uHR:{value:0},uHz:{value:.5},uDim:{value:1},uFacOrg:{value:new Le(0,3.2)},uCamPos:{value:new T},uCamR:{value:new T},uCamU:{value:new T},uCamF:{value:new T},uGrade:{value:new T(.55,.78,1.3)},uLights:e.uLights},i=rt(o,{atlas:a,pin:"E",pout:"F",inW:.04,outW:.055,uniforms:n,frag:Yt}),t=new nt(40,o.viewport.aspect,.05,400),s=o.lang==="ar",m=it(o);let v=o.viewport.portrait,f=[],c=Xe($e(v)),z=[],l;const d=()=>{for(const b of f)b.dispose();f=[]},F=async(b,M=!1)=>{v=b;const r=$e(v);l={ctx:o,st:i,atlas:a,G:i.G,world:i.world,L:r,tall:v,ar:s,dir:m,q:o.quality,LU:e,camera:t},n.uH0.value=r.H0,c=Xe(r),t.fov=r.fov,t.updateProjectionMatrix(),n.uTanH.value=Math.tan(Be.degToRad(r.fov/2));const I=Mt(l);M&&await He();const H=Ft(l);M&&await He();const P=Ut(l);M&&await He();const V=Lt(r),B={update:x=>V.run(x),dispose(){}},U=It(l,V);M&&await He();const y=$t(l,V);M&&await He();const C=jt(l);M&&await He();const $=Zt(l),L=Qt(l);f=[I,H,P,B,U,y,C,$,L],z=Ot(r,m)};await F(v,!0),c(0,t),n.uFacOrg.value.set(0,3.2),await i.warm(t);const h=new T;return{scene:i.scene,camera:t,update({p:b,t:M,dt:r,v:I}){const H=b*pt;i.tick(M,I),i.setP(b);const P=c(H),V=ct(o,M,r),B=lt(M),U=q(H,3,5)*(1-q(H,35,36.5));t.position.copy(P.p),t.position.x+=V.x*.22+Math.sin(B*.31)*.035*U,t.position.y+=V.y*.12+Math.sin(B*.43+1.3)*.022*U,h.copy(P.l),h.x+=V.x*.1+Math.sin(B*.27+2)*.05*U,h.y+=V.y*.06,t.lookAt(h),Math.abs(t.fov-P.fov)>.001&&(t.fov=P.fov,t.updateProjectionMatrix(),n.uTanH.value=Math.tan(Be.degToRad(P.fov/2))),t.updateMatrixWorld();const y=t.matrixWorld.elements;n.uCamR.value.set(y[0],y[1],y[2]),n.uCamU.value.set(y[4],y[5],y[6]),n.uCamF.value.set(-y[8],-y[9],-y[10]),n.uCamPos.value.copy(t.position),n.uFac.value=1-q(H,6.2,6.4);{const L=o.viewport.aspect,x=A(H,.5,3.9);n.uGlint.value.set(m>0?-.7+(L+1.4)*x:L+.7-(L+1.4)*x,Math.sin(Math.PI*Math.min(1,x))*q(H,.3,1.2))}mt(H,z,e);for(const L of f)L.update(H);const C=n.uCamF.value,$=Math.asin(Math.max(-1,Math.min(1,-C.y)));n.uHz.value=.5+.5*Math.tan($)/Math.tan(Be.degToRad(t.fov/2)),n.uBlue.value=q(H,42.2,46.6),n.uHR.value=q(H,42.4,46.2),n.uDim.value=1-.9*q(H,45.4,47.6),i.draw(t)},resize(){i.resize(),t.aspect=o.viewport.aspect,t.updateProjectionMatrix(),o.viewport.portrait!==v&&(d(),F(o.viewport.portrait))},dispose(){d(),i.dispose()}}}export{ro as default};
