import{V as de,al as Mo,a9 as tt,a as ye,C as $e,s as co,M as te,G as Ne,i as oe,a5 as _e,aO as To,a4 as ge,an as So,aE as io,ac as zo,ag as Ro,t as vo,_ as po,x as Po,P as Nt}from"./EditionWorld.astro_astro_type_script_index_0_lang.D1p_8KHB.js";import{C as Pe,M as He,l as Fo,b as je,p as ft,F as ot,f as Wo,s as Bo,c as _o,a as Co}from"./lines.DUbwF6Xg.js";import{a as Io,S as qo}from"./plan.Bzh-bcoD.js";import{b as Go,l as wt}from"./glow.I689Zo8b.js";import{r as jt,m as Ht}from"./films.D7DIN3yk.js";import{r as uo}from"./rig.DYrQiR9D.js";import{b as dt}from"./world.CZEQHzNq.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const we=Math.PI/180,yt=Math.PI*2,re=42,lt=33.5,Lo=40,bt={R:20,deg0:60},xe={w:1.6,h:1,bz:.035},ae=(e,t,s,o=0)=>[e*t*Math.sin(s*we),o,-t*Math.cos(s*we)],ne=e=>Math.min(1,Math.max(0,e)),fe=(e,t,s)=>e+(t-e)*s,Z=(e,t,s)=>{const o=ne((s-e)/(t-e));return o*o*(3-2*o)},Ee=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,Uo=e=>1-Math.pow(1-e,3),V=e=>(e=Math.sin(e*127.1+311.7)*43758.5453,e-Math.floor(e)),Do=e=>{let t=e>>>0;return()=>(t=t*1664525+1013904223>>>0)/4294967296};function Ye(e,t,s,o){const f=3*e,r=3*(s-e)-f,n=1-f-r,p=3*t,u=3*(o-t)-p,b=1-p-u,v=T=>((n*T+r)*T+f)*T,c=T=>((b*T+u)*T+p)*T,M=T=>(3*n*T+2*r)*T+f;return T=>{if(T<=0)return 0;if(T>=1)return 1;let y=T;for(let P=0;P<6;P++){const F=v(y)-T;if(Math.abs(F)<1e-6)return c(y);const z=M(y);if(Math.abs(z)<1e-6)break;y-=F/z}let B=0,d=1;y=T;for(let P=0;P<24;P++){const F=v(y)-T;if(Math.abs(F)<1e-6)break;F>0?d=y:B=y,y=(B+d)/2}return c(y)}}function Le(e,t,s){const o=new Mo;o.index=e.index;for(const f of["position","uv","normal"])e.getAttribute(f)&&o.setAttribute(f,e.getAttribute(f));o.instanceCount=t;for(const[f,[r,n]]of Object.entries(s))o.setAttribute(f,new tt(r,n));return o}const Ko=(e,t)=>({uT:{value:0},uTime:e.uTime,uDir:{value:t},uRes:e.uRes,uPx:e.uPx,uTrk:{value:new de(bt.R,bt.deg0*we,t)}}),ce=`
uniform float uT, uDir;
float phiOf(vec3 p){ float a = atan(uDir * p.x, -p.z); return a < -.9 ? a + 6.2831853 : a; }
float arriveAt(vec3 p){ return 1. + (phiOf(p) + .84) / .30 + p.y * .05; }
float litAt(vec3 p, float jit, float soft){ return smoothstep(0., soft, uT - arriveAt(p) - jit); }
`,be=`
const vec3 TW = vec3(1., .644, .323), TA = vec3(1., .323, .045);
`,fo=`
${be}
// the bezel of a screen (sc: the glass in world units, bz: the bezel's width, hl: the colour of its lit edge): its colour,
// its coverage (cov), the glass's mask (scr)
vec3 housingCol(vec2 p, vec2 sc, float bz, float px, vec3 hl, out float cov, out float scr){
  float dOut = sdRBox(p, sc * .5 + bz, bz * .9), dIn = sdRBox(p, sc * .5, bz * .35);
  cov = smoothstep(px, -px, dOut);
  scr = smoothstep(px, -px, dIn);
  vec3 h = S(vec3(.030, .032, .040));
  float top = smoothstep(bz * 1.3, 0., (sc.y * .5 + bz) - p.y) * smoothstep(-bz * .6, 0., dOut);
  float lft = smoothstep(bz * 1.3, 0., p.x + sc.x * .5 + bz) * .5;
  h += hl * (.55 * top + .35 * lft * top + .05);
  return h;
}
`;function Pt(e,t){const[s,o]=t.size??[xe.w,xe.h],f=t.bezel??xe.bz,r=new ye(s+2*f,o+2*f),n={uT:e.uT,uTime:e.uTime,uDir:e.uDir,uSc:{value:new co(s,o)},uBz:{value:f},uOn:{value:1},uDim:{value:1},uHl:{value:t.hl??new $e(1,.644,.323)},...t.uniforms},p=M=>{const T=M?{...n,uPlane:{value:t.reflect.plane},uMirrorK:{value:t.reflect.k}}:n;return new oe({uniforms:T,side:M?ge:So,transparent:M,depthWrite:!M,blending:M?_e:To,alphaToCoverage:!!t.msaa&&!M,vertexShader:`
        ${M?"uniform float uPlane;":""}
        varying vec2 vUv; varying vec3 vW;
        void main(){
          vUv = uv;
          vec4 w = modelMatrix * vec4(position, 1.);
          ${M?"w.y = 2. * uPlane - w.y;":""}
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,fragmentShader:`
        uniform float uTime, uT, uDir, uBz, uOn, uDim; uniform vec2 uSc; uniform vec3 uHl;
        ${M?"uniform float uPlane, uMirrorK;":""}
        varying vec2 vUv; varying vec3 vW;
        ${Pe}
        ${He}
        ${fo}
        ${t.decl??""}
        ${t.pic}
        void main(){
          vec2 p = (vUv - .5) * (uSc + 2. * uBz);
          float px = max(fwidth(p.y), 1e-5);
          float cov, scr;
          vec3 col = housingCol(p, uSc, uBz, px, uHl, cov, scr);
          if (cov < .004) discard;
          vec3 s = pic(p / uSc + .5, p) * uDim * uOn;
          col = mix(col, s, scr);
          ${M?"col *= uMirrorK * exp(max(uPlane - vW.y, 0.) * -.06); cov = 1.;":""}
          gl_FragColor = vec4(col, cov);
        }`})},u=p(!1),b=new te(r,u);b.frustumCulled=!1;const v=new Ne;v.add(b);let c=null;if(t.reflect){c=p(!0);const M=new te(r,c);M.frustumCulled=!1,M.renderOrder=-8,v.add(M)}return{group:v,mesh:b,mat:u,U:n,dispose(){r.dispose(),u.dispose(),c?.dispose()}}}const Ft=`
float fbm3(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 3; i++){ v += a * vn(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
vec3 palA(float k){ k = floor(k * 5.);
  return k < 1. ? vec3(.012, .04, .17) : k < 2. ? vec3(.0, .10, .16) : k < 3. ? vec3(.06, .03, .18) : k < 4. ? vec3(.008, .07, .11) : vec3(.03, .08, .21); }
vec3 palB(float k){ k = floor(k * 5.);
  return k < 1. ? vec3(.16, .38, 1.) : k < 2. ? vec3(.06, .72, .86) : k < 3. ? vec3(.46, .32, 1.) : k < 4. ? vec3(.14, .86, .74) : vec3(.5, .72, 1.); }
vec3 picture(vec2 uv, float seed, float act, float t, float lod){
  float rate = mix(.09, .42, act);
  float tt = t * rate + seed * 17.;
  float slot = floor(tt), ft = fract(tt);
  vec3 A = palA(h11(slot * 2.1 + seed * 13.)), B = palB(h11(slot * 3.7 + seed * 29.));
  float flash = 1. + 2.4 * smoothstep(.06, .0, ft) * (.4 + act);      // a cut: a flash, then the new shot
  if (lod > .97) return (A + B * .136) * flash;
  float kr = h11(slot * 1.37 + seed * 91.);
  float kind = kr < .13 ? 0. : kr < .3 ? 1. : kr < .47 ? 2. : kr < .66 ? 3. : kr < .74 ? 4. : 5.;
  vec2 p = (uv - .5) * vec2(1.6, 1.);
  float tf = t * .16 + seed * 10.;
  float m;
  if (kind < 1.) {
    float n = fbm3(p * 1.6 + vec2(tf * .4, slot * 3.1));
    m = smoothstep(.3, .85, n);
  } else if (kind < 2.) {
    float a = h11(slot + seed) * 3.14159;
    float s = dot(p, vec2(cos(a), sin(a))) * (2.5 + 5. * h11(slot + 4.)) + tf * 1.5;
    m = smoothstep(.15, .5, abs(fract(s) - .5) * 2.) * (.35 + .65 * fbm3(p * 2. + slot));
  } else if (kind < 3.) {
    vec2 c0 = (vec2(h11(slot + 1.), h11(slot + 2.)) - .5) * vec2(1.2, .6);
    float d = length(p - c0);
    m = smoothstep(.34, .0, abs(fract(d * 4.5 - tf * 1.2) - .5) - .1) * exp(-d * .9);
  } else if (kind < 4.) {
    vec2 g = p * (8. + 6. * h11(slot + 8.)), id = floor(g), f = fract(g) - .5;
    m = smoothstep(.42, .08, length(f)) * (.5 + .5 * sin(id.x * .5 + id.y * .7 + tf * 3.));
  } else if (kind < 5.) {
    float d = sdMK(p * 2.2);
    m = smoothstep(.07, .0, abs(d)) * .9 + smoothstep(.0, -.5, d) * .22;
  } else {
    float y = p.y * 2. - (h11(slot + 5.) - .5) * .9;
    m = exp(-abs(y) * 16.) + .28 * exp(-abs(y) * 2.4);
  }
  m = mix(m, .22, lod);
  return (A + B * m * .62) * flash;
}
`;function Re(e,t,s={}){const o=Fo({count:t,shared:e,uniforms:s.uniforms,fog:s.fog,order:s.order,depthTest:s.depthTest,ends:`
      attribute vec3 aA; attribute vec3 aB; attribute vec4 aC; attribute vec4 aP;
      ${s.decl??""}
      void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){ A = aA; B = aB; col = aC; par = aP; ${s.body??""} }`}),f=new tt(new Float32Array(t*3),3),r=new tt(new Float32Array(t*3),3),n=new tt(new Float32Array(t*4),4),p=new tt(new Float32Array(t*4),4);for(const b of[f,r,n,p])b.setUsage(io);o.geo.setAttribute("aA",f),o.geo.setAttribute("aB",r),o.geo.setAttribute("aC",n),o.geo.setAttribute("aP",p);let u=0;return{layer:o,mesh:o.mesh,count:t,get n(){return u},begin(){u=0},add(b,v,c,M,T,y,B,d,P,F=1,z=1,m=0,x=1,g=0){return u>=t?!1:(f.setXYZ(u,b,v,c),r.setXYZ(u,M,T,y),n.setXYZW(u,B,d,P,F),p.setXYZW(u,z,m,x,g),u++,!0)},setRange(b,v,c){p.setY(b,v),p.setZ(b,c)},setAlpha(b,v){n.setW(b,v)},end(){o.geo.instanceCount=u,this.dirty()},dirty(){f.needsUpdate=r.needsUpdate=n.needsUpdate=p.needsUpdate=!0},attrs:{A:f,B:r,C:n,P:p},dispose(){o.dispose()}}}const Ze=132,rt=12,ct=3,Xe=1.3,ze={r:38.6,y:2.15,deskY:1.6},Vt=`
attribute vec3 aPos; attribute vec2 aSz; attribute vec3 aMeta;
${ce}
varying vec2 vUv; varying vec4 vA; varying vec3 vW; varying float vL;
void main(){
  float yaw = aMeta.x;
  vec3 R = vec3(cos(yaw), 0., -sin(yaw));
  vec3 w = aPos + R * (position.x * aSz.x) + vec3(0., 1., 0.) * (position.y * aSz.y);
  #ifdef MIRROR
  w.y = -w.y;
  #endif
  vec4 mv = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mv;
  vUv = uv;
  float seed = aMeta.y;
  vA = vec4(seed, litAt(aPos, seed * .7, .8), aMeta.z, -mv.z);
  vL = litAt(aPos, -.4, .8);
  vW = w;
}`,Yt=`
uniform float uTime;
varying vec2 vUv; varying vec4 vA; varying vec3 vW; varying float vL;
${Pe}
${He}
${Ft}
${fo}
void main(){
  const vec2 SC = vec2(${xe.w.toFixed(2)}, ${xe.h.toFixed(2)});
  const float BZ = ${xe.bz.toFixed(3)};
  vec2 p = (vUv - .5) * (SC + 2. * BZ);
  float px = max(fwidth(p.y), 1e-5);
  float seed = vA.x, on = vA.y, act = vA.z, dist = vA.w;
  float cov, scr;
  vec3 col = housingCol(p, SC, BZ, px, TW * vL, cov, scr);
  if (cov < .004) discard;
  vec2 uvs = p / SC + .5;
  float lod = smoothstep(.035, .16, fwidth(uvs.x));
  float opened = smoothstep(.08, .7, on);
  float inside = step(abs(uvs.y - .5), opened * .5 + .003) * step(.002, on);
  float eo = (on - .32) * 4.5;
  float flashK = 1. + 1.5 * exp(-eo * eo);
  vec3 pic = picture(uvs, seed, act, uTime, lod) * mix(.26, 1., act) * flashK;
  float lineB = smoothstep(.0, .1, on) * (1. - smoothstep(.12, .45, on));
  vec3 lineC = vec3(.55, .78, 1.) * lineB * smoothstep(.012, .0, abs(uvs.y - .5)) * 1.4;
  float sheen = smoothstep(.2, 1., sin(uvs.x * 2.3 + uvs.y * 1.7 + seed * 6.283) * .5 + .5);
  vec3 glass = S(vec3(.006, .007, .011)) + TW * .012 * sheen * vL;
  float raster = mix(.9 + .1 * sin(uvs.y * 380.), 1., lod);
  col = mix(col, glass + (pic * raster) * inside + lineC, scr);
  col *= exp(-dist * .0028);
  #ifdef MIRROR
  col *= .12 * exp(max(-vW.y, 0.) * -.07);
  gl_FragColor = vec4(col, 1.);
  #else
  gl_FragColor = vec4(col, cov);
  #endif
}`,Zt=e=>`
${ce}
${be}
uniform float uBanks, uRB;
float hb(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
void pt(float id, out vec3 pos, out float size, out vec4 col){
  const float LPB = 24.;
  float b = floor(id / LPB), j = id - b * LPB;
  float cx = mod(j, 2.), ry = floor(j / 2.);
  float deg = (b + .5) / uBanks * 360.;
  float phi = radians(deg);
  vec3 c = vec3(uDir * uRB * sin(phi), 1.2 + ry * 2.3, -uRB * cos(phi));
  vec3 tang = vec3(uDir * cos(phi), 0., sin(phi));
  pos = c + tang * (cx - .5) * 1.5;
  float dd0 = abs(mod(deg + 180., 360.) - 180.);
  float keep = step(7., dd0);
  float ton = arriveAt(vec3(c.x, 0., c.z)) + ry * .09 + hb(j + b * 7.) * .08;
  float age = uT - ton;
  float up = smoothstep(0., .25, age);
  float warm = smoothstep(.1, 1.5, age);
  float fl = 1. - .55 * step(.5, fract(age * 9. + hb(j))) * (1. - smoothstep(.2, .6, age));
  vec3 tc = mix(TA * 1.1, TW, warm);
  float amp = up * fl * (.85 + .3 * hb(j * 3. + b));
  ${e?"pos.y = -pos.y; amp *= .06;":""}
  size = .62 * (.8 + .4 * hb(j + 5.));
  col = vec4(tc * amp * 1.25, keep * step(0., age));
}`,Oo=`
${ce}
float hd(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
void pt(float id, out vec3 pos, out float size, out vec4 col){
  float a = hd(id) * 6.2831853, r = sqrt(hd(id + 1.7)) * 38.;
  vec3 base = vec3(r * sin(a), 1. + hd(id + 3.3) * 30., -r * cos(a));
  pos = base + vec3(sin(uTime * .07 + id), cos(uTime * .05 + id * 1.3), sin(uTime * .06 + id * .7)) * .8;
  float lit = litAt(pos, hd(id + 9.) * .8, 1.);
  float tw = .55 + .45 * sin(uTime * (.6 + hd(id + 5.) * 1.6) + id);
  size = .09 + .09 * hd(id + 7.);
  col = vec4(vec3(1., .72, .42) * (.35 + .5 * hd(id + 2.)) * tw, lit);
}`,Eo=`
attribute vec3 aApex; attribute vec3 aDir; attribute vec2 aLR; attribute float aSeed;
${ce}
varying float vT; varying float vN; varying float vK;
void main(){
  float t = position.z;
  vec3 d = normalize(aDir);
  vec3 u = normalize(cross(d, vec3(0., 1., 0.)));
  vec3 v = cross(d, u);
  vec3 radial = u * position.x + v * position.y;
  vec3 w = aApex + d * (t * aLR.x) + radial * (t * aLR.y);
  vec3 n = normalize(radial * aLR.x - d * aLR.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  vec3 V = normalize(cameraPosition - w);
  vN = pow(abs(dot(n, V)), 1.4);
  vT = t;
  vK = litAt(vec3(aApex.x, 0., aApex.z), .15 + aSeed * .25, .6);
}`,$o=`
uniform float uInt;
varying float vT; varying float vN; varying float vK;
${be}
void main(){
  float a = vK * vN * pow(max(1. - vT, 0.), 1.25) * smoothstep(0., .08, vT) * uInt;
  gl_FragColor = vec4(TW * a, 1.);
}`,No=`
uniform float uTime; uniform vec4 uM0;
varying vec3 vW;
${ce}
${Pe}
${be}
uniform float uBanks, uRB;
void main(){
  vec2 q = vW.xz;
  float r = length(q);
  if (r > ${(re+3).toFixed(1)}) discard;
  float lit = litAt(vec3(vW.x, 0., vW.z), 0., 1.2);
  vec3 c = S(vec3(.014, .011, .010));
  float w = max(fwidth(q.x), fwidth(q.y));
  vec2 g = abs(fract(q / 3. + .5) - .5) * 3.;
  float gl = 1. - smoothstep(0., w * 1.4, min(g.x, g.y));
  vec2 g2 = abs(fract(q / 12. + .5) - .5) * 12.;
  float gl2 = 1. - smoothstep(0., w * 1.6, min(g2.x, g2.y));
  float gfade = exp(-r * .02);
  c += S(vec3(.55, .40, .28)) * (gl * .05 + gl2 * .08) * gfade * lit;
  // a pool under every bank
  float a = atan(uDir * vW.x, -vW.z); if (a < 0.) a += 6.2831853;
  float step_ = 6.2831853 / uBanks;
  float k = floor(a / step_);
  float pools = 0.;
  for (int i = -1; i <= 1; i++){
    float ab = (k + float(i) + .5) * step_;
    float dd = length(q - vec2(uDir * uRB * sin(ab), -uRB * cos(ab)));
    pools += exp(-dd * dd / 26.);
  }
  c += TW * pools * .02 * lit;
  // the first monitor's light on its desk's surround and the floor
  float dm = length(q - uM0.xy);
  c += S(vec3(.5, .66, 1.)) * exp(-dm * .22) * .015 * uM0.z;
  gl_FragColor = vec4(c, 1.);
}`,jo=`
uniform float uTime, uM0I; uniform vec3 uM0;
varying vec3 vW; varying vec3 vN;
${ce}
${Pe}
${be}
void main(){
  vec3 c = S(vec3(.020, .026, .046)) * .9;
  float top = step(.5, vN.y);
  vec2 d = vW.xz - uM0.xz;
  float f = clamp(d.y, 0., 6.);
  float spread = .8 + f * .55;
  float dxs = d.x / spread;
  float pool = exp(-dxs * dxs) * exp(-f * .5) * smoothstep(-.4, .05, d.y);
  c += S(vec3(.5, .66, 1.)) * pool * .55 * uM0I * top;
  float lit = litAt(vW, .2, 1.4);
  c += TW * .03 * lit * (.5 + .5 * fbm(vW.xz * 1.3));
  // the desk's lit lip
  float lip = exp(-abs(vW.y - ${ze.deskY.toFixed(2)}) * 70.) * (1. - top);
  c += S(vec3(.5, .62, .95)) * lip * .12 + TW * lip * .2 * lit;
  gl_FragColor = vec4(c, 1.);
}`;function Ho(e,t,s,o){const f=t.G,r=t.world,n=e.quality>0,p=[],u=_=>(p.push(_),_),b=_=>_%11===5,v=[],c=[],M=[],T=[xe.w+2*xe.bz,xe.h+2*xe.bz];for(let _=0;_<Ze;_++){if(b(_))continue;const $=_/Ze*360;for(let l=0;l<rt;l++){if(V(_*13.7+l*3.1+1.3)<.04)continue;const q=ct+l*Xe,K=ae(o,re,$,q),j=V(_*7.3+l*1.9+5.5);v.push(...K),c.push(...T),M.push(-o*$*we,j,V(j*91.7)>.9?1:.08+.3*V(j*33.1))}}const y=v.length/3,B=new ye(1,1),d=Le(B,y,{aPos:[new Float32Array(v),3],aSz:[new Float32Array(c),2],aMeta:[new Float32Array(M),3]}),P={uT:s.uT,uTime:s.uTime,uDir:s.uDir},F=new URLSearchParams(location.search).has("sf"),z=new te(d,new oe({uniforms:P,vertexShader:Vt,fragmentShader:F?"varying vec2 vUv; varying vec4 vA; varying vec3 vW; varying float vL; void main(){ gl_FragColor = vec4(vA.x, .6, 1. - vA.x, 1.); }":Yt,alphaToCoverage:!1}));z.frustumCulled=!1;const m=new te(d,new oe({uniforms:P,vertexShader:Vt,fragmentShader:Yt,defines:{MIRROR:1},transparent:!0,depthWrite:!1,blending:_e,side:ge}));m.frustumCulled=!1,m.renderOrder=-8,r.add(z,m),u({dispose(){d.dispose(),B.dispose(),z.material.dispose(),m.material.dispose()}});const x=Re(f,6e3,{decl:ce,fog:.004,order:3,body:"float jit = fract(sin(id * 12.9898) * 43758.5453) * .35; col.a *= litAt((A + B) * .5, jit, 1.);",uniforms:{uT:s.uT,uDir:s.uDir}}),g=[.66,.58,.5],i=(_,$,l,D=1)=>x.add(_[0],_[1],_[2],$[0],$[1],$[2],g[0],g[1],g[2],l,D),S=ct+rt*Xe;for(let _=0;_<Ze;_++){const $=_/Ze*360,l=(_+1)/Ze*360;if(b(_)){for(const q of[re+.35,re+1.1])i(ae(o,q,$,0),ae(o,q,$,S+.6),.26);for(const q of[0,5,10,S*.5+2.5,S+.6])i(ae(o,re+.35,$,q),ae(o,re+1.1,$,q),.2)}for(let q=0;q<=rt;q+=2){const K=ct-.62+q*Xe;i(ae(o,re+.3,$,K),ae(o,re+.3,l,K),.15)}for(let q=0;q<rt;q+=4){const K=ct-.62+q*Xe,j=K+4*Xe,ee=_+(q>>2)&1;i(ae(o,re+.3,ee?$:l,K),ae(o,re+.3,ee?l:$,j),.1)}}const R=je(e,24,32,40);for(let _=0;_<R;_++){const $=(_+.5)/R*360;if(Math.abs(($+180)%360-180)<7)continue;const D=$*we,q=[o*Math.cos(D),0,Math.sin(D)],K=ae(o,lt,$,0);for(const j of[-1.2,1.2])x.add(K[0]+q[0]*j,0,K[2]+q[2]*j,K[0]+q[0]*j,29,K[2]+q[2]*j,1,.72,.5,.34,1.1);for(let j=0;j<12;j++){const ee=1.2+j*2.3;x.add(K[0]-q[0]*1.2,ee,K[2]-q[2]*1.2,K[0]+q[0]*1.2,ee,K[2]+q[2]*1.2,1,.72,.5,.22,1)}}x.end(),r.add(x.mesh),u(x);const W=R*24,L={uT:s.uT,uDir:s.uDir,uBanks:{value:R},uRB:{value:lt}},a=ft({count:W,shared:f,pt:Zt(!1),atten:900,fog:.003,uniforms:L,core:.55,order:6}),h=ft({count:W,shared:f,pt:Zt(!0),atten:900,fog:.003,uniforms:L,core:.4,order:-7,depthTest:!0});r.add(a.mesh,h.mesh),u(a),u(h);const C=14,A=[],U=[];for(let _=0;_<C;_++){const $=_/C*yt;A.push(Math.cos($),Math.sin($),0,Math.cos($),Math.sin($),1);const l=(_+1)%C;U.push(_*2,_*2+1,l*2+1,_*2,l*2+1,l*2)}const w=new zo;w.setAttribute("position",new Ro(A,3)),w.setIndex(U);const k=[],G=[],E=[],N=[];for(let _=0;_<R;_++){const $=(_+.5)/R*360;if(!(Math.abs(($+180)%360-180)<7))for(let l=0;l<12;l+=2){const D=1.2+(l+.5)*2.3,q=ae(o,lt,$,D),K=ae(o,re-1,$+(V(_*3+l)-.5)*6,Math.min(15,3+D*.42+V(_+l*5)*3)),j=[K[0]-q[0],K[1]-q[1],K[2]-q[2]];k.push(...q),G.push(...j),E.push(Math.hypot(...j),1.7+V(l+_)*1.1),N.push(V(_*31+l))}}const X=Le(w,k.length/3,{aApex:[new Float32Array(k),3],aDir:[new Float32Array(G),3],aLR:[new Float32Array(E),2],aSeed:[new Float32Array(N),1]}),Y=new te(X,new oe({uniforms:{uT:s.uT,uDir:s.uDir,uInt:{value:.06}},vertexShader:Eo,fragmentShader:$o,transparent:!0,depthWrite:!1,blending:_e,side:ge}));Y.frustumCulled=!1,Y.renderOrder=2,r.add(Y),u({dispose(){X.dispose(),w.dispose(),Y.material.dispose()}});const ie={uT:s.uT,uDir:s.uDir,uTime:s.uTime,uM0:{value:new vo(0,-38.6,1,0)},uBanks:{value:R},uRB:{value:lt}},he=new oe({uniforms:ie,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:No}),ke=new te(new ye(re*2+8,re*2+8),he);ke.rotation.x=-Math.PI/2,ke.renderOrder=-10,ke.frustumCulled=!1,r.add(ke),u({dispose(){ke.geometry.dispose(),he.dispose()}});const Fe=Pt(s,{msaa:n,hl:new $e(.5,.56,.7).convertSRGBToLinear(),reflect:{plane:ze.deskY,k:.5},uniforms:{uWipe:{value:0}},decl:"uniform float uWipe;",pic:`
      ${Ft}
      vec3 markPic(vec2 uv){
        vec2 p = (uv - .5) * vec2(1.6, 1.);
        float d = sdMK(p * 2.15);
        vec3 bg = mix(S(vec3(.02, .06, .20)), S(vec3(.0, .16, .30)), smoothstep(-.5, .6, p.y + .15 * sin(uTime * .2 + p.x * 2.)));
        float ol = smoothstep(.05, .0, abs(d)), fl = smoothstep(.0, -.35, d);
        vec3 c = bg * .8 + vec3(.25, .75, 1.) * (ol * .9 + fl * .18);
        c += vec3(.3, .6, 1.) * exp(-abs(p.x - (fract(uTime * .12) * 2.4 - 1.2)) * 8.) * .12 * smoothstep(.2, -.1, d);
        return c;
      }
      vec3 pic(vec2 uv, vec2 p){
        vec2 q = (uv - .5) * 2.;
        vec3 sc = mix(S(vec3(.80, .86, 1.)), S(vec3(.93, .96, 1.)), smoothstep(-1., 1., q.y));
        sc *= 1. - .22 * smoothstep(.55, 1.6, length(q));
        vec3 mine = markPic(uv);
        float e = uWipe * 1.12 - (1. - uv.y);
        float m = smoothstep(0., .06, e);
        float edge = exp(-abs(e) * 70.) * step(.001, uWipe) * (1. - smoothstep(.96, 1., uWipe));
        return mix(sc, mine, m) + vec3(.6, .8, 1.) * edge * .9;
      }`});Fe.group.position.set(0,ze.y,-38.6),r.add(Fe.group),u(Fe);const Ce=new po(7,.08,3.85),We=new oe({uniforms:{uT:s.uT,uDir:s.uDir,uTime:s.uTime,uM0:{value:new de(0,ze.y,-38.6)},uM0I:{value:1}},vertexShader:"varying vec3 vW; varying vec3 vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:jo}),Ae=new te(Ce,We);Ae.position.set(0,ze.deskY-.04,-38.6+1.925-.05),r.add(Ae),u({dispose(){Ce.dispose(),We.dispose()}});const Me=ft({count:je(e,900,2200,3600),shared:f,pt:Oo,atten:900,fog:.004,uniforms:{uT:s.uT,uDir:s.uDir},core:.6,order:7});return r.add(Me.mesh),u(Me),{m0:Fe,desk:We,floor:he,lamps:a,lampsMirror:h,dust:Me,beams:Y,field:z,rig:x,lens(_,$){const l=_/(2*Math.tan($*we/2));a.U.uAtten.value=h.U.uAtten.value=Me.U.uAtten.value=l},dispose(){for(const _ of p)_.dispose()}}}const Vo=`
attribute vec3 aPos; attribute vec3 aRot; attribute float aSeed;
${ce}
uniform float uTime;
varying vec2 vUv; varying vec4 vI;
void main(){
  float yaw = aRot.x + sin(uTime * .35 + aSeed * 40.) * .2 + sin(uTime * .13 + aSeed * 7.) * .1;
  float pitch = aRot.y + sin(uTime * .27 + aSeed * 21.) * .05;
  float s = aRot.z;
  vec3 l = vec3(position.x * 1.6 * s, position.y * s, 0.);
  l = vec3(l.x, l.y * cos(pitch), l.y * sin(pitch));
  vec3 w = aPos + vec3(l.x * cos(yaw) + l.z * sin(yaw), l.y, -l.x * sin(yaw) + l.z * cos(yaw));
  vec4 mv = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mv;
  vUv = uv;
  float ph = fract(dot(aPos, vec3(.031, .047, .019)) + .16 * sin(aPos.y * .2) + uTime * .03);
  float glint = pow(max(0., sin(uTime * .9 + aSeed * 50. + yaw * 2.)), 28.);
  float lit = litAt(aPos, .5 + aSeed * .5, 1.3);
  float away = 1. - .72 * smoothstep(27., 36., uT);
  vI = vec4(ph, lit * (.8 + 1.6 * glint) * away, aSeed, exp(-length(mv.xyz) * .0045) * smoothstep(5., 20., length(mv.xyz)));
}`,Yo=`
varying vec2 vUv; varying vec4 vI;
${Pe}
${He}
${be}
void main(){
  vec2 q = (vUv - .5) * vec2(1.6, 1.);
  float px = max(fwidth(q.y), 1e-4);
  float ph = vI.x, e = ph * ph * (3. - 2. * ph);
  float db = sdRBox(q, vec2(.8, .5) - .012, .03);
  float line = 1. - smoothstep(0., px * 1.5, abs(db));
  float fill = smoothstep(px, -px, db) * .06;
  float s = mix(.6, 1., e);
  vec2 m = rot((1. - e) * (vI.z - .5) * 1.4) * q;
  float k = .27 * s;
  float d = sdMK(m / k) * k;
  float ol = 1. - smoothstep(0., px * 1.5, abs(d));
  float fm = smoothstep(px, -px, d) * smoothstep(.3, .95, ph);
  vec3 warm = mix(TW * .9, vec3(1., .88, .68), vI.z * .8);
  float farK = smoothstep(.06, .2, px);
  float nearC = line * .5 + fill + ol * .55 + fm * .6;
  float flatC = .025 + line * .06 + fm * .14;
  vec3 col = warm * mix(nearC, flatC, farK) * vI.y * vI.w * .22;
  gl_FragColor = vec4(col, 1.);
}`;function Zo(e,t,s){const o=je(e,1800,5200,9e3),f=je(e,90,200,320),r=Math.max(2,Math.round(o/f)),n=f*r,p=Do(7),u=new Float32Array(n*3),b=new Float32Array(n*3),v=new Float32Array(n),c=Re(t.G,n,{decl:ce,fog:.004,order:2,body:"float jit = .5 + fract(sin(id * 12.9898) * 43758.5453) * .5; col.a *= litAt(B, jit, 1.3);",uniforms:{uT:s.uT,uDir:s.uDir}});let M=0;for(let P=0;P<f;P++){const F=p()*yt,z=35*Math.sqrt(p()),m=z*Math.sin(F),x=-z*Math.cos(F);for(let g=0;g<r;g++,M++){const i=35-g/(r-1)*15.5+(p()-.5)*1.1,S=.85+p()*.35,R=m+(p()-.5)*.8,W=x+(p()-.5)*.8;u.set([R,i,W],M*3),b.set([p()*yt,(p()-.5)*.3,S],M*3),v[M]=p(),c.add(m,Lo,x,R,i+.5*S,W,1,.8,.6,.03,1)}}c.end();const T=new ye(1,1),y=Le(T,n,{aPos:[u,3],aRot:[b,3],aSeed:[v,1]}),B=new oe({uniforms:{uT:s.uT,uDir:s.uDir,uTime:s.uTime},vertexShader:Vo,fragmentShader:Yo,transparent:!0,depthWrite:!1,blending:_e,side:ge}),d=new te(y,B);return d.frustumCulled=!1,d.renderOrder=4,t.world.add(d,c.mesh),{mesh:d,wires:c,count:n,dispose(){y.dispose(),T.dispose(),B.dispose(),c.dispose()}}}const Xo=`
float sq(float x){ return x * x; }
float smin(float a, float b, float k){ float h = max(k - abs(a - b), 0.) / k; return min(a, b) - h * h * k * .25; }
float smax(float a, float b, float k){ return -smin(-a, -b, k); }
float hump(float x, float a, float b, float c, float d){ return smoothstep(a, b, x) * (1. - smoothstep(c, d, x)); }

// ── 1. liquid ──────────────────────────────────────────────────────────────────────────────
vec3 fxLiquid(vec2 p, float u, float t, float px){
  float exitK = 1. - smoothstep(.86, 1., u);
  float d = sdMK(p);
  float rise = smoothstep(.1, .74, u);
  float lvl = mix(-1.18, 1.25, rise);
  float calm = 1. - smoothstep(.55, .92, u);
  float wave = (sin(p.x * 3.1 + t * 5.) * .06 + sin(p.x * 7.3 - t * 3.7) * .03) * calm * smoothstep(.1, .3, u);
  float dLiq = smax(d, p.y - (lvl + wave), .05);
  // the pour: chains of drops fall into the tops of the strokes until the vessel is full
  float streams = smoothstep(.0, .06, u) * (1. - smoothstep(.5, .66, u));
  float dS = 9.;
  for (int s = 0; s < 4; s++){
    float fs = float(s);
    float sx = s == 0 ? -1.72 : s == 1 ? -.27 : s == 2 ? .43 : 1.6;
    for (int k = 0; k < 5; k++){
      float fk = float(k);
      float ph = fract(t * (.55 + .08 * fs) + fk * .2 + fs * .31);
      float y = mix(3.1, 1.05 + (s == 0 || s == 3 ? .0 : .0), ph);
      float stretch = 1. + (1. - ph) * .9;
      vec2 c = vec2(sx + sin(t * 2. + fk + fs) * .05, y);
      dS = min(dS, length((p - c) * vec2(1., 1. / stretch)) - (.1 + .02 * h11(fk + fs * 7.)));
    }
  }
  dS = mix(9., dS, streams);
  float dAll = smin(dLiq, dS, .22);
  vec2 g = vec2(dFdx(dAll), dFdy(dAll)); float gl = length(g); g = gl > 1e-6 ? g / gl : vec2(0., 1.);
  float inner = clamp(-dAll / .3, 0., 1.);
  vec2 nxy = g * (1. - inner) * .9;
  vec3 n = vec3(nxy, sqrt(max(1. - dot(nxy, nxy), 0.)));
  float cov = smoothstep(px, -px, dAll);
  vec3 L = normalize(vec3(-.5, .7, .6));
  float diff = max(dot(n, L), 0.);
  float spec = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 36.);
  float fres = pow(1. - n.z, 2.2);
  float depth = smoothstep(-1.2, 1.3, p.y);
  vec3 body = mix(vec3(.0, .10, .22), vec3(.0, .46, .70), depth);
  float caus = pow(.5 + .5 * sin(p.x * 8. + sin(p.y * 6. + t * 2.1) * 1.7 + t * .8), 6.) * .22;
  vec3 liq = body * (.45 + .75 * diff) + vec3(.35, .85, 1.) * (fres * .9 + caus * inner) + vec3(1.) * spec * .8;
  float top = exp(-abs(p.y - (lvl + wave)) * 26.) * step(d, 0.) * smoothstep(.1, .3, u);   // the surface's bright lip
  liq += vec3(.5, .95, 1.) * top * .9;
  vec3 bg = mix(vec3(.004, .012, .03), vec3(.006, .02, .05), smoothstep(-1.5, 1.5, p.y));
  float vessel = smoothstep(px * 2., 0., abs(d)) * .22 * (1. - cov) + smoothstep(px * 3., 0., abs(d)) * .06;
  vec3 col = bg + vec3(.2, .7, 1.) * vessel;
  col = mix(col, liq, cov * smoothstep(-.02, .05, u));
  return col * mix(.0, 1., exitK) + bg * (1. - exitK);
}

// ── 2. glass ───────────────────────────────────────────────────────────────────────────────
vec3 fxGlass(vec2 p, float u, float t, float px){
  float exitK = 1. - smoothstep(.88, 1., u);
  float e = smoothstep(.05, .66, u);
  vec2 ax = normalize(vec2(1., .5));
  float s = dot(p, ax);
  float sp = mix(-3.3, 3.5, e);
  float d = sdMK(p);
  vec2 g = vec2(dFdx(d), dFdy(d)); float gl = length(g); g = gl > 1e-6 ? g / gl : vec2(0., 1.);
  float bv = smoothstep(-.16, .0, d);
  vec2 nxy = g * bv * .9;
  vec3 n = vec3(nxy, sqrt(max(1. - dot(nxy, nxy), 0.)));
  float inside = smoothstep(px, -px, d);
  float rev = smoothstep(sp + .35, sp - .45, s);
  // the band of light, its colour fringes a hair apart
  float bw = 1.6;
  float bR = exp(-sq((s - sp + .05) * bw)), bG = exp(-sq((s - sp) * bw)), bB = exp(-sq((s - sp - .05) * bw));
  vec3 band = vec3(bR * 1., bG * .95, bB * 1.05);
  // behind the glass: fine lines, bent by the bevel and the band
  vec2 q = p + nxy * (.5 + 1.2 * bG) * inside;
  float lines = smoothstep(.035, .0, abs(fract(q.x * 3.2 + q.y * .6) - .5) - .46) * .55 + smoothstep(.03, .0, abs(fract(q.y * 3.2) - .5) - .47) * .25;
  vec3 bg = vec3(.006, .011, .022) + vec3(.1, .3, .5) * lines * .07;
  bg += band * vec3(.45, .62, .9) * .22 + vec3(.03, .06, .11) * smoothstep(1.6, -1.6, p.y);
  // the slab: smoked, its bevel catching a key light and the band
  vec3 L = normalize(vec3(-.55, .6, .55));
  float key = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 18.) * bv;
  float rim = pow(1. - n.z, 1.6);
  vec3 slab = vec3(.02, .034, .06) + vec3(.1, .26, .4) * lines * .5 * (1. - bv) + vec3(.02, .05, .09) * smoothstep(-1., 1., p.y);
  slab += vec3(.6, .85, 1.) * (key * 1.2 + rim * .8) * rev;
  slab += band * vec3(.7, .9, 1.2) * (.32 + 1.3 * bv) * inside;
  slab += vec3(.9, .96, 1.) * pow(bG, 3.) * bv * .8;
  vec3 col = bg;
  col = mix(col, slab, inside * smoothstep(0., .1, rev));
  col += vec3(.55, .8, 1.) * smoothstep(px * 2., 0., abs(d)) * .35 * rev;
  return col * exitK + vec3(.006, .011, .022) * (1. - exitK);
}

// ── 3. pixels ──────────────────────────────────────────────────────────────────────────────
vec3 pixLayer(vec2 p, float cs, float f, float seed){
  vec2 id = floor(p / cs), cp = (id + .5) * cs;
  float d = sdMK(cp);
  float cov = smoothstep(cs * .62, -cs * .62, d);
  float r = h12(id + seed);
  float on = step(r, f * 1.25);
  vec2 q = fract(p / cs) - .5;
  float gap = smoothstep(.5, .43, max(abs(q.x), abs(q.y)));
  float depth = smoothstep(-1., 1., cp.y);
  vec3 c = mix(vec3(.12, .45, 1.), vec3(.75, .95, 1.), depth);
  c = mix(c, vec3(1., .62, .3), step(.92, h12(id + seed + 5.)) * .8);
  float near = smoothstep(cs * 5., 0., d) * (1. - cov);
  float chatter = on * step(.55, h12(id + seed + 9.)) * near;
  return (c * cov + vec3(.1, .3, .7) * chatter * .5) * on * gap;
}
vec3 fxPixels(vec2 p, float u, float t, float px){
  float exitK = 1. - smoothstep(.88, 1., u);
  float st = clamp(u / .7, 0., 1.) * 5.;
  float k = floor(min(st, 4.999)), f = fract(min(st, 4.999));
  float cs0 = .86 / exp2(k), cs1 = cs0 * .5;
  float jitter = h11(floor(t * 3.) + k) * .0;
  vec3 a = pixLayer(p, cs0, 1., 11. + k), b = pixLayer(p, cs1, f, 13. + k);
  vec3 mosaic = mix(a, b, smoothstep(.2, .85, f));
  float d = sdMK(p);
  float crisp = smoothstep(.62, .76, u) * smoothstep(px, -px, d);
  vec3 sharp = mix(vec3(.12, .45, 1.), vec3(.8, .96, 1.), smoothstep(-1., 1., p.y));
  vec3 bg = vec3(.004, .01, .026) + vec3(.02, .05, .12) * smoothstep(.1, .0, abs(fract(p.x * 2. + .5) - .5) - .47) * .5;
  vec3 col = bg + mosaic * (1. - crisp * .6) + sharp * crisp * (.9 + .2 * sin(t * 2. + p.y * 3.));
  return col * exitK + bg * (1. - exitK);
}

// ── 4. ink ─────────────────────────────────────────────────────────────────────────────────
// a brush stroke: a to b, width w, drawn from u0 for dur; returns coverage (x) and wetness (y)
vec2 inkStroke(vec2 p, vec2 a, vec2 b, float w, float u, float u0, float dur, float seed, float px){
  float pr = smoothstep(0., 1., clamp((u - u0) / dur, 0., 1.));
  vec2 ab = b - a; float L = length(ab);
  vec2 dir = ab / L, nrm = vec2(-dir.y, dir.x);
  vec2 pa = p - a;
  float s = dot(pa, dir) / L, side = dot(pa, nrm);
  float bristle = vn(vec2(side * 26. + seed * 9., s * 2.4 + seed));
  float dry = smoothstep(.45, 1., s) * smoothstep(.0, .6, pr);
  float wob = (vn(vec2(s * 5. + seed, seed * 3.)) - .5) * .06;
  float hw = w * (1. + .12 * (vn(vec2(s * 3.1, seed)) - .5)) + wob * .0;
  float across = hw - abs(side + wob);
  float along = min(s + .12 / L, (1.12 - s + .02));
  float cov = smoothstep(0., px * 2.5 + .02, across) * smoothstep(.0, .06 / L, along);
  cov *= 1. - dry * step(bristle, .46 + .2 * dry) * .9;
  cov *= step(s, pr * 1.08 - .04) * step(.001, pr);
  float head = exp(-abs(s - pr * 1.04) * L * 5.) * step(.001, pr) * (1. - step(.999, pr));
  return vec2(cov, head);
}
vec3 fxInk(vec2 p, float u, float t, float px){
  float exitK = 1. - smoothstep(.9, 1., u);
  vec2 uv = p * .33;
  float paperN = vn(p * 7.) * .5 + vn(p * 23.) * .25;
  vec3 paper = vec3(.52, .45, .34) * (.86 + .22 * paperN) * (1. - .22 * smoothstep(1.3, 3.2, length(p * vec2(.55, 1.))));
  float cov = 0., wet = 0.;
  vec2 r;
  float w = .25;
  r = inkStroke(p, vec2(-1.725, 1.02), vec2(-1.725, -1.02), .22, u, .04, .1, 1., px); cov = max(cov, r.x); wet = max(wet, r.y);
  r = inkStroke(p, vec2(-1.5, 1.04), vec2(-.985, -.5), .27, u, .13, .1, 2., px); cov = max(cov, r.x); wet = max(wet, r.y);
  r = inkStroke(p, vec2(-.985, -.5), vec2(-.47, 1.04), .27, u, .22, .1, 3., px); cov = max(cov, r.x); wet = max(wet, r.y);
  r = inkStroke(p, vec2(-.245, 1.02), vec2(-.245, -1.02), .22, u, .31, .1, 4., px); cov = max(cov, r.x); wet = max(wet, r.y);
  r = inkStroke(p, vec2(.425, 1.02), vec2(.425, -1.02), .22, u, .4, .1, 5., px); cov = max(cov, r.x); wet = max(wet, r.y);
  r = inkStroke(p, vec2(.62, .0), vec2(1.7, 1.04), .27, u, .49, .1, 6., px); cov = max(cov, r.x); wet = max(wet, r.y);
  r = inkStroke(p, vec2(.7, -.06), vec2(1.74, -1.04), .27, u, .58, .1, 7., px); cov = max(cov, r.x); wet = max(wet, r.y);
  float d = sdMK(p);
  cov *= smoothstep(.07, -.01, d);
  float settle = smoothstep(.7, .84, u);
  cov = max(cov, settle * smoothstep(px * 1.5, -px * 1.5, d));
  // a few drops flicked off the brush
  float drops = 0.;
  for (int i = 0; i < 8; i++){
    float fi = float(i);
    float ua = .05 + fi * .075;
    vec2 c = vec2(mix(-1.8, 1.8, h11(fi * 3.7)), mix(-1.1, 1.1, h11(fi * 5.3 + 1.)));
    c += (vec2(h11(fi + 9.), h11(fi + 4.)) - .5) * 1.;
    drops += smoothstep(.035, .0, length(p - c) - .012 * (1. + h11(fi))) * smoothstep(ua, ua + .02, u) * step(.7, h11(fi * 1.9));
  }
  cov = max(cov, drops);
  vec3 ink = vec3(.004, .006, .014) + vec3(.35, .45, .65) * wet * .5 + vec3(.1, .13, .2) * settle * smoothstep(.1, -.3, d) * .0;
  vec3 col = mix(paper, ink, cov);
  col += vec3(.5, .65, 1.) * smoothstep(.05, -.02, d) * smoothstep(0., .6, -d) * .0;
  return col * exitK + paper * (1. - exitK) * .5;
}

// ── 5. light ───────────────────────────────────────────────────────────────────────────────
vec3 fxLight(vec2 p, float u, float t, float px){
  float exitK = 1. - smoothstep(.9, 1., u);
  float e = smoothstep(.0, .72, u);
  float r = length(p), a = atan(p.y, p.x);
  const float N = 72.;
  float kf = floor((a + 3.14159265) / 6.2831853 * N);
  float ca = (kf + .5) / N * 6.2831853 - 3.14159265;
  float across = abs(a - ca) * r;
  float rid = h11(kf * 1.37 + 3.), rid2 = h11(kf * 2.11 + 8.);
  float wd = .010 + .016 * rid2 + .004 * r;
  float prof = exp(-across * across / (wd * wd));
  float delay = rid * .4;
  float ee = clamp((e - delay) / (1. - delay), 0., 1.);
  float head = mix(5.2, .1, ee * ee * (3. - 2. * ee));
  float lenR = 1.6 + 1.8 * rid2;
  float streak = smoothstep(head - .08, head + .12, r) * (1. - smoothstep(head + .12, head + lenR, r));
  float d = sdMK(p);
  float outside = smoothstep(-.02, .1, d);
  float rays = prof * streak * outside * smoothstep(0., .08, e) * (1. - .88 * ee * ee);
  float acc = smoothstep(.05, .5, u);
  float mask = smoothstep(px * 1.5, -px * 1.5, d);
  float peak = hump(u, .5, .76, .86, .98);
  float core = smoothstep(0., -.4, d);
  float grain = .82 + .18 * vn(p * 34. + vec2(t * 2., 0.));
  vec3 W = vec3(1., .66, .33), HOT = vec3(1., .95, .84);
  vec3 col = vec3(.010, .0065, .004);
  col += W * rays * 1.25;
  col += mix(W * 1.0, HOT * 1.2, core * (.5 + .5 * peak)) * mask * acc * grain * (.78 + .45 * peak);
  col += W * exp(-max(d, 0.) * 5.5) * .2 * acc * (1. - mask) * (.6 + .6 * peak);
  col += vec3(1., .78, .5) * exp(-abs(p.y) * 11.) * exp(-abs(p.x) * .5) * peak * .6;
  col += vec3(1., .85, .6) * exp(-r * r * .5) * .05 * acc;
  return col * exitK + vec3(.010, .0065, .004) * (1. - exitK);
}
`,ho=`
float cline(float d, float w){ return smoothstep(w, 0., abs(d)); }
vec4 cardPaper(vec2 uv, float seed, float lit){
  vec2 q = (uv - .5) * vec2(1.6, 1.);
  float px = max(fwidth(q.y), 1e-5);
  float dOut = sdRBox(q, vec2(.8, .5) - .004, .03);
  float cov = smoothstep(px, -px, dOut);
  float fib = vn(q * 160.) * .5 + vn(q * 40.) * .5;
  vec3 paper = vec3(.52, .46, .36) * (.9 + .1 * fib) * mix(.5, 1., lit);
  vec2 f = q * 1.12;
  float fr = cline(sdRBox(f, vec2(.68, .41), .02), px * 1.6);
  float hy = (h11(seed) - .5) * .5;
  float hz = cline(f.y + .13 + hy * .3, px * 1.2) * step(abs(f.x), .68);
  float sk = (vn(q * 90. + seed) - .5) * .004;
  float kind = floor(h11(seed * 1.7 + 2.) * 3.);
  vec2 mq = (q + sk) * (2.8 + h11(seed + 6.) * 1.6) - vec2(.5 * (h11(seed + 1.) - .5), -.1 + .3 * (h11(seed + 4.) - .5));
  float mk = kind < 2.5 ? cline(sdMK(mq), px * 2. * 3.3) * .95 : 0.;
  float cir = kind > 1.5 ? cline(length(f - vec2(.2 * (h11(seed + 9.) - .5), .08)) - .17, px * 1.4) * .9 : 0.;
  float mv = cline(f.y - .27 + (h11(seed + 3.) - .3) * .5 * (f.x + .3) + sk, px * 1.2) * step(abs(f.x + .1), .45) * .7;
  float dots = smoothstep(.02, .0, length(vec2(abs(f.x) - .6, f.y - .33)) - .008);
  float draw = clamp(fr * .9 + hz * .55 + mk + cir + mv * .6 + dots, 0., 1.);
  vec3 col = mix(paper, vec3(.04, .05, .09), draw * .92);
  col = mix(col, paper * .65, smoothstep(px * 3., 0., abs(dOut + px * 2.)) * .6);
  return vec4(col, cov);
}
`,Xt=["liquid","glass","pixels","ink","light"],Qe=8.6,Je=11,ht=14.2,Qo=3.6,mt=17.2,Jo=21;function kt(e,t){const s=ae(e,t.tall?26:28,t.tall?58:62,t.tall?8.2:9.2),o=ae(e,15,46,9),f=o[0]-s[0],r=o[2]-s[2],n=Math.hypot(f,r),p=[f/n,0,r/n],u=[p[2],0,-p[0]];return{G:s,N:p,R:u,yaw:Math.atan2(p[0],p[2])}}function Qt(e,t){if(t.tall)return{S:2.75,at:[[-.5,7.4],[.6,3.7],[-.5,0],[.6,-3.7],[-.5,-7.4]].map(([r,n])=>[r*e,n])};const s=3.3,o=6.4;return{S:s,at:[[-o,2],[-o/2,-2],[0,2],[o/2,-2],[o,2]].map(([f,r])=>[f*e,r])}}const ea=`
uniform float uAlpha, uTime, uSeed, uLit; uniform vec3 uTint;
varying vec2 vUv;
${Pe}
${He}
${ho}
void main(){
  vec4 c = cardPaper(vUv, uSeed, uLit);
  if (c.a < .004) discard;
  gl_FragColor = vec4(c.rgb * uTint, c.a * uAlpha);
}`;function ta(e,t,s,o,f){const r=t.world,n=e.quality>0,p=[],u={value:0},b={value:0},v=m=>`
    uniform float uTl;
    ${Xo}
    vec3 pic(vec2 uv, vec2 pw){
      vec2 p = (uv - .5) * vec2(1.6, 1.) * 3.1;
      float px = max(fwidth(p.y), 1e-5);
      float u = clamp(uTl, 0., 99.) / ${Qo.toFixed(1)}; u = fract(u);
      float t = uTl;
      return ${m}(p, u, t, px);
    }`,c=Xt.map((m,x)=>{const g=Pt(s,{msaa:n,pic:v("fx"+m[0].toUpperCase()+m.slice(1)),uniforms:{uTl:x===4?b:u},decl:"",hl:new $e(1,.644,.323)});return g.U.uOn.value=0,g.group.visible=!1,r.add(g.group),p.push(g),g}),M=new ye(1,1),T=Xt.map((m,x)=>{const g=new oe({uniforms:{uAlpha:{value:1},uTime:s.uTime,uSeed:{value:3+x*1.7},uLit:{value:1},uTint:{value:new de(1,1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:ea,transparent:!0,depthWrite:!1}),i=new te(M,g);return i.visible=!1,i.frustumCulled=!1,i.renderOrder=12,r.add(i),p.push({dispose(){g.dispose()}}),i});p.push({dispose(){M.dispose()}});const y=Re(t.G,160,{decl:ce,fog:.003,order:3,body:"col.a *= litAt((A + B) * .5, .0, 1.2);",uniforms:{uT:s.uT,uDir:s.uDir}}),B={key:""};new de;const d=(m,x,g,i=0)=>[m.G[0]+m.R[0]*x+m.N[0]*i,m.G[1]+g,m.G[2]+m.R[2]*x+m.N[2]*i];function P(){const m=`${o}${f.tall}`;if(B.key===m)return;B.key=m;const x=kt(o,f),g=Qt(o,f);y.begin();const i=(A,U,w,k=1)=>y.add(A[0],A[1],A[2],U[0],U[1],U[2],.9,.74,.56,w,k),S=g.at.map(([A])=>A),R=g.at.map(([,A])=>A),W=Math.min(...S)-g.S*1.9,L=Math.max(...S)+g.S*1.9,a=Math.min(...R)-g.S*1.5,h=Math.max(...R)+g.S*1.5,C=17;for(const A of[W,L])i(d(x,A,-x.G[1],-.6),d(x,A,C-x.G[1],-.6),.3,1.2),i(d(x,A,-x.G[1],-1.4),d(x,A,C-x.G[1],-1.4),.22),i(d(x,A,a,-.6),d(x,A,a,-1.4),.2),i(d(x,A,h,-.6),d(x,A,h,-1.4),.2);for(const A of[a,h,(a+h)/2])i(d(x,W,A,-.6),d(x,L,A,-.6),.22);i(d(x,W,C-x.G[1],-.6),d(x,L,C-x.G[1],-.6),.3,1.2),g.at.forEach(([A,U])=>{const w=g.S*.8+.2,k=g.S*.5+.2;for(const[G,E]of[[[-w,-k],[w,-k]],[[w,-k],[w,k]],[[w,k],[-w,k]],[[-w,k],[-w,-k]]])i(d(x,A+G[0],U+G[1],-.3),d(x,A+E[0],U+E[1],-.3),.16);i(d(x,A,U-k,-.3),d(x,A,a,-.6),.1)}),y.end()}r.add(y.mesh),p.push(y);const F=(m,x,g,i,S,R)=>{const W=i.G[0]-g.x,L=i.G[2]-g.z,a=Math.hypot(W,L),h=[g.x+W/a*7.4,g.y+.6,g.z+L/a*7.4],C=d(i,S.at[m][0],S.at[m][1],.15),A=f.tall?1.9:2.3,U=S.S*1.04;if(x<Je){const w=Uo(ne((x-Qe)/2)),k=[h[0]-i.R[0]*9*o*-1+0,h[1]+4.5,h[2]-i.R[2]*9*o*-1];R.pos.set(k[0]+(h[0]-k[0])*w,k[1]+(h[1]-k[1])*w+Math.sin(x*1.7)*.06*w,k[2]+(h[2]-k[2])*w),R.roll=(1-w)*.5*o,R.s=A*(.55+.45*w)}else{const w=ne((x-Je-m*.16)/(ht-Je-.6)),k=Ee(w),G=[(h[0]+C[0])/2+i.N[0]*2.5,Math.max(h[1],C[1])+2.4+m%2*1.2,(h[2]+C[2])/2+i.N[2]*2.5],E=1-k;R.pos.set(E*E*h[0]+2*E*k*G[0]+k*k*C[0],E*E*h[1]+2*E*k*G[1]+k*k*C[1],E*E*h[2]+2*E*k*G[2]+k*k*C[2]),R.roll=Math.sin(k*Math.PI)*(.35+.1*m)*(m%2?1:-1)*o,R.s=A+(U-A)*k}R.yaw=i.yaw},z={pos:new de,yaw:0,roll:0,s:1};return{screens:c,cards:T,tl:u,update(m,x){P();const g=kt(o,f),i=Qt(o,f),S=m>Qe-.5&&m<26;y.mesh.visible=S||m>6,u.value=Math.max(0,m-ht-.35),b.value=Math.min(u.value,2.95);const R=Ee(ne((m-mt)/1.3)),W=Ee(ne((m-mt-.5)/(Jo-mt-.5)));for(let L=0;L<5;L++){const a=c[L],h=T[L],C=m-(ht+L*.08);a.group.visible=m>6&&m<28;let A=d(g,i.at[L][0],i.at[L][1]);L===4&&(A=d(g,i.at[4][0]+(1*o-i.at[4][0])*W,i.at[4][1]+((f.tall?2:2.2)-i.at[4][1])*W,W*4.6)),a.group.position.set(A[0],A[1],A[2]),a.group.rotation.set(0,g.yaw,0),a.group.scale.setScalar(i.S),a.U.uOn.value=Z(0,.5,C),a.U.uDim.value=L===4?1:1-.78*R,L===4&&a.group.scale.setScalar(i.S*(1+.55*W));const U=L===0?m>Qe&&C<.45:m>Je&&C<.45;h.visible=U,U&&(F(L,m,x,g,i,z),h.position.copy(z.pos),h.rotation.set(0,z.yaw,0),h.rotateZ(z.roll),h.scale.set(z.s*1.6,z.s,1),h.material.uniforms.uAlpha.value=1-Z(0,.45,C),h.material.uniforms.uLit.value=.6+.4*Z(Qe,Qe+1.2,m))}for(let L=1;L<5;L++)m<Je&&(T[L].visible=!1)},dispose(){for(const m of p)m.dispose()}}}const Jt=bt,O={strip:11.14,bin:41.5,line:45,gates:[48.5,51.7,54.9,58.1],panel0:61,pitch:1.4,panels:16,stop:85.5,end:84};function Ve(e){const t=Jt.R,s=Jt.deg0*we,o=v=>s+v/t,f=(v,c=0,M=0)=>{const T=o(v),y=t-c;return[e*y*Math.sin(T),M,-y*Math.cos(T)]},r=v=>{const c=o(v);return[e*Math.cos(c),0,Math.sin(c)]};return{R:t,phi:o,at:f,tan:r,inward:v=>{const c=o(v);return[-e*Math.sin(c),0,Math.cos(c)]},side:v=>{const c=r(v);return[-c[2],0,c[0]]},yawBack:v=>{const c=r(v);return Math.atan2(-c[0],-c[2])},yawAlong:v=>{const c=r(v);return Math.atan2(c[0],c[2])},dir:e,p0:s}}const Wt=`
uniform vec3 uTrk;
vec3 trackAt(float s, float c, float h){ float f = uTrk.y + s / uTrk.x, r = uTrk.x - c; return vec3(uTrk.z * r * sin(f), h, -r * cos(f)); }
vec3 trackTan(float s){ float f = uTrk.y + s / uTrk.x; return vec3(uTrk.z * cos(f), 0., sin(f)); }
vec3 trackIn(float s){ float f = uTrk.y + s / uTrk.x; return vec3(-uTrk.z * sin(f), 0., cos(f)); }
`,Oe=22.8,vt=2,qe=1.65,at=16,it=4,xt=2.2,Bt=8.5,oa=22,Se=at*qe,_t=[Ye(.65,0,.35,1),Ye(.16,1,.3,1),Ye(.65,0,.35,1),Ye(.7,0,.84,0),Ye(.34,1.56,.64,1)],aa=[-9.5,-4.8,0,4.8,9.5],mo=3.1,xo=6.6,Ct=e=>(e-Oe)*vt*qe,sa=e=>O.strip+Ct(e)-Bt,go=(e,t=.95)=>mo+xo*_t[2](ne((Ct(e)-Bt)/Se))+t;function na(e,t){const s=Ct(t)-Bt,o=_t[2](ne(s/Se));return e.at(O.strip+s+13+3*o,0,Math.max(.7,go(t)-3.4))}const la=`
${Wt}
attribute vec4 aT; attribute vec2 aI;   // aT: along, across, hit, beat time; aI: lane, index
uniform float uPitch, uLaneW, uS0;
varying vec2 vUv; varying vec4 vI;
void main(){
  vec3 w = trackAt(uS0 + aT.x + position.y * uPitch * .88, aT.y + position.x * uLaneW * .9, .03);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  vUv = uv; vI = vec4(aT.z, aT.w, aI.x, aI.y);
}`,ra=`
uniform float uT; varying vec2 vUv; varying vec4 vI;
${Pe}
${be}
void main(){
  vec2 q = vUv - .5;
  float px = max(fwidth(vUv.x), 1e-4);
  float d = sdRBox(q, vec2(.5) - .03, .05);
  float cov = smoothstep(px, -px, d);
  if (cov < .004) discard;
  float age = uT - vI.y;
  float played = step(0., age), hit = vI.x;
  float flash = hit * played * exp(-max(age, 0.) * 2.6);
  float glow = hit * played * exp(-max(age, 0.) * .5);
  float bar = step(mod(vI.w, 4.), .5);
  float near = exp(-abs(age + .25) * 5.) * (1. - hit);
  float rim = smoothstep(px * 2.5, 0., abs(d)) * (.1 + .28 * played + .9 * flash + .5 * bar);
  vec3 col = S(vec3(.016, .014, .013)) * (1. + 3. * bar) + S(vec3(.05, .042, .035)) * smoothstep(.5, -.2, q.y) * .6;
  col += TA * glow * .1 + TW * flash * 1.5 + TW * rim * .45 + TA * near * .18;
  col += vec3(1., .94, .82) * flash * flash * smoothstep(.55, .0, length(q)) * .9;
  gl_FragColor = vec4(col, 1.);
}`,ca=`
${Wt}
attribute vec4 aT; attribute vec2 aI;
uniform float uT, uS0;
varying vec2 vUv; varying float vK;
void main(){
  vec3 base = trackAt(uS0 + aT.x, aT.y, 0.);
  vec3 rgt = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]));
  float age = uT - aT.w, k = aT.z * step(0., age) * exp(-max(age, 0.) * 3.0);
  float h = 2.6 * (.35 + .65 * smoothstep(0., .2, age));
  vec3 w = base + rgt * position.x * 1.5 + vec3(0., (position.y + .5) * h, 0.);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  vUv = uv; vK = k;
}`,ia=`
varying vec2 vUv; varying float vK;
${be}
void main(){
  if (vK < .004) discard;
  float x = (vUv.x - .5) * 2.;
  float a = exp(-x * x * 5.) * (1. - vUv.y) * (1. - vUv.y) * vK;
  gl_FragColor = vec4(mix(TA, TW, .6) * a * 1.3, 1.);
}`,va=`
attribute vec3 aPos; attribute vec4 aRot; attribute float aSeed;
varying vec2 vUv; varying float vSeed; varying float vFog; varying float vFlash;
void main(){
  float yaw = aRot.x, roll = aRot.y, s = aRot.z;
  vec3 l = vec3(position.x * 1.6 * s, position.y * s, 0.);
  l.xy = mat2(cos(roll), sin(roll), -sin(roll), cos(roll)) * l.xy;
  vec3 w = aPos + vec3(l.x * cos(yaw) + l.z * sin(yaw), l.y, -l.x * sin(yaw) + l.z * cos(yaw));
  vec4 mv = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mv;
  vUv = uv; vSeed = aSeed; vFog = exp(-length(mv.xyz) * .004); vFlash = aRot.w;
}`,pa=`
varying vec2 vUv; varying float vSeed; varying float vFog; varying float vFlash;
${Pe}
${He}
${ho}
void main(){
  vec4 c = cardPaper(vUv, vSeed, 1.);
  if (c.a < .004) discard;
  vec2 g = (vUv - .5) * vec2(8., 5.);
  float d = abs(fract(g.x + g.y * 1.3) - .5) + abs(fract(g.x - g.y * 1.3) - .5);
  float lat = smoothstep(.05, .0, abs(d - .5) - .01);
  vec3 back = S(vec3(.05, .05, .06)) + vec3(1., .66, .34) * lat * .2;
  // its beat has landed: the card flares and its edge catches
  float rim = 1. - smoothstep(0., .07, min(min(vUv.x * 1.6, (1. - vUv.x) * 1.6), min(vUv.y, 1. - vUv.y)));
  vec3 col = gl_FrontFacing ? c.rgb * (.82 + vFlash * 1.1) + vec3(1., .72, .4) * vFlash * (.12 + .9 * rim) : back * (1. + vFlash * 2.);
  gl_FragColor = vec4(col * vFog, c.a);
}`;function eo(e,t,s,o,f){const r=t.world,n=e.quality>0,p=[],u=Ve(o),b=(l,D,q)=>u.at(O.strip+l,D,q),v=new Ne;r.add(v);const c={value:0},M={value:1},T=it*at,y=new Float32Array(T*4),B=new Float32Array(T*2);for(let l=0;l<it;l++)for(let D=0;D<at;D++){const q=l*at+D,K=V(l*17+D*3.7+2.2),j=l===0?D%4===0||K>.9:l===1?D%4===2||D%8===7:l===2?D%2===1&&K>.2:K>.6;y.set([D*qe+qe/2,(l-(it-1)/2)*xt*1.1,j?1:0,Oe+D/vt],q*4),B.set([l,D],q*2)}const d=new ye(1,1),P=Le(d,T,{aT:[y,4],aI:[B,2]}),F={uT:s.uT,uTrk:s.uTrk,uS0:{value:O.strip}},z=new oe({uniforms:{...F,uPitch:{value:qe},uLaneW:{value:xt}},vertexShader:la,fragmentShader:ra,side:ge}),m=new te(P,z);m.frustumCulled=!1;const x=new oe({uniforms:F,vertexShader:ca,fragmentShader:ia,transparent:!0,depthWrite:!1,blending:_e,side:ge}),g=new te(P,x);g.frustumCulled=!1,g.renderOrder=6,v.add(m,g),p.push({dispose(){P.dispose(),d.dispose(),z.dispose(),x.dispose()}});const i=je(e,44,60,80),S=Re(t.G,i*5+8,{decl:ce+"uniform float uBeat, uFade;",fog:.0025,order:5,body:"col.a *= litAt(B, 0., 1.) * (.72 + .5 * uBeat) * uFade;",uniforms:{uT:s.uT,uDir:s.uDir,uBeat:c,uFade:M}});S.begin();for(let l=0;l<5;l++){const D=l===2;let q=null;for(let K=0;K<=i;K++){const j=-12+K/i*(Se+16),ee=mo+xo*_t[l](ne(j/Se)),I=b(j,aa[l],ee);q&&S.add(q[0],q[1],q[2],I[0],I[1],I[2],D?1:.96,D?.8:.66,D?.5:.36,D?1:.8,D?3:1.9),q=I}}S.end(),v.add(S.mesh),p.push(S);const R=Re(t.G,8,{fog:.002,order:6});v.add(R.mesh),p.push(R);const W=je(e,12,14,16),L=9,a=W*3,h=a*L+W,C=Re(t.G,h,{fog:.003,order:6,body:"col.a *= smoothstep(2.5, 9., min(length(A - cameraPosition), length(B - cameraPosition)));"});v.add(C.mesh),p.push(C);const A=new Float32Array(W*3),U=new Float32Array(W*4),w=new Float32Array(W),k=Le(d,W,{aPos:[A,3],aRot:[U,4],aSeed:[w,1]});for(const l of["aPos","aRot"])k.getAttribute(l).setUsage(io);const G=new oe({vertexShader:va,fragmentShader:pa,side:ge,alphaToCoverage:n}),E=new te(k,G);E.frustumCulled=!1,v.add(E),p.push({dispose(){k.dispose(),G.dispose()}});const N=[],X=[],Y=[],ie=[],he=[],ke=[],Fe=[],Ce=new Float32Array(W),We=new Float32Array(W),Ae=f.tall;for(let l=0;l<W;l++){const D=l%2?1:-1,q=2.4+l*(Se-3.6)/(W-1),K=O.strip+q;X.push(Ae?u.at(K,D*1.9,3.3+(l>>1)%3*1.1+q/Se):u.at(K,D*4.3,2.3+(l>>1&1)*.9+q/Se*.8)),Y.push(u.at(K,D*(Ae?1.21:3.63),.06));const j=u.tan(K),ee=u.inward(K),I=Ae?.12:.42;he.push(Math.atan2(-j[0]-D*ee[0]*I,-j[2]-D*ee[2]*I));const Q=V(l*7.7)<.5?-1:1,ve=O.strip-4+V(l*3.1)*(Se+8);N.push(Ae?u.at(ve,Q*(.8+V(l*6.1)*2.4),3.4+V(l*5.3)*7.2):u.at(ve,Q*(4.2+V(l*6.1)*5.4),3.2+V(l*5.3)*5.6)),ie.push(u.yawBack(ve)+(V(l*2.3)-.5)*1.7),ke.push(Oe+q/(qe*vt)),Fe.push((Ae?.95:.98)+V(l*4.4)*(Ae?.18:.2)),w[l]=2+l*3.7}const Me=[];for(let l=0;l<W;l++)l<W-1&&Me.push([l,l+1,0]),Me.push([l,(l+3)%W,1],[l,(l*5+2)%W===l?(l+7)%W:(l*5+2)%W,1]),Me.push([l,l,2]);const _=N.map(l=>[...l]),$=(l,D)=>Ee(ne((D-(ke[l]-1.3))/1.5));return{group:v,N:W,track:u,update(l){const D=l>20.3&&l<34.3;if(v.visible=D,!D)return;const q=(l-Oe)*vt,K=1-Z(30.4,32.2,l);M.value=K,c.value=Math.exp(-Math.max(0,q-Math.floor(q))*5)*Z(Oe-.5,Oe,l);for(let I=0;I<W;I++){const Q=$(I,l),ve=[Math.sin(l*.4+I)*.5,Math.cos(l*.31+I*1.3)*.35,Math.sin(l*.27+I*.7)*.5],pe=Z(20.6+I*.04,21.6+I*.04,l)*K,J=l-ke[I],Te=J>0?Math.exp(-J*2.4):0;Ce[I]=Te,We[I]=Fe[I]*pe*.5;for(let le=0;le<3;le++)_[I][le]=fe(N[I][le]+ve[le]*(1-Q),X[I][le],Q);A.set(_[I],I*3),U[I*4]=fe(ie[I]+Math.sin(l*.3+I)*.2,he[I],Q),U[I*4+1]=(1-Q)*(V(I*9.1)-.5)*.4,U[I*4+2]=Fe[I]*pe*(1+.12*Te),U[I*4+3]=Te*pe}k.getAttribute("aPos").needsUpdate=!0,k.getAttribute("aRot").needsUpdate=!0,C.begin();const j=u.side(O.strip+Se*.5);Me.forEach(([I,Q,ve],pe)=>{if(ve===2){const De=Z(.6,1,$(I,l))*(.22+1.8*Ce[I])*K;if(De>.004){const me=_[I],Ie=Y[I],nt=me[1]-We[I];C.add(me[0],nt,me[2],Ie[0],Ie[1],Ie[2],1,.84,.55,De,1.1+1.6*Ce[I])}return}const J=ve===0,Te=$(I,l),le=$(Q,l),ue=J?Math.min(Te,le):Math.max(Te,le),qt=ne((l-21-pe%7*.1)/.9),pt=J?0:Z(.04,.5,ue);if(qt<=0||pt>=1)return;const Ue=[_[I][0],_[I][1]+We[I],_[I][2]],ut=[_[Q][0],_[Q][1]+We[Q],_[Q][2]],Gt=J?Ce[Q]:0,bo=(J?1-ue:1)*(1+V(pe*2.1)*1.2)*(1-pt*.5)+(J?.02:.2),Lt=(1-(J?ue:0))*.35;let Ut=Ue[0],Dt=Ue[1],Kt=Ue[2];for(let De=1;De<=L;De++){const me=De/L,Ie=4*me*(1-me),nt=Math.sin(l*1.3+pe+me*6)*Lt*Ie,Ot=fe(Ue[0],ut[0],me)+j[0]*nt,Et=fe(Ue[1],ut[1],me)-bo*Ie+Math.sin(l*1.7+pe*2+me*5)*Lt*.5*Ie,$t=fe(Ue[2],ut[2],me)+j[2]*nt,ko=J?.55+.9*ue:.42,Ao=(J?.8+.4*ue:.6)*qt*(1-pt)*(1+1.4*Gt)*K;C.add(Ut,Dt,Kt,Ot,Et,$t,1,J&&ue>.5?.86:.64,J&&ue>.5?.6:.32,Ao*ko,J?1.6+ue*1.2+Gt*1.5:1.1),Ut=Ot,Dt=Et,Kt=$t}}),C.end();const ee=q*qe;if(R.begin(),q>-.5&&q<at+1){const I=it*xt*1.1/2+.8,Q=b(ee,-I,.08),ve=b(ee,I,.08);R.add(Q[0],Q[1],Q[2],ve[0],ve[1],ve[2],1,.86,.6,.95,2.6);const pe=b(ee,-I,3.2),J=b(ee,I,3.2);R.add(pe[0],pe[1],pe[2],J[0],J[1],J[2],1,.72,.4,.25,1.2);for(const Te of[-I,I]){const le=b(ee,Te,.08),ue=b(ee,Te,3.2);R.add(le[0],le[1],le[2],ue[0],ue[1],ue[2],1,.72,.4,.35,1.2)}}R.end()},dispose(){for(const l of p)l.dispose()}}}const st=[31.1,32.3,33.4,34.4,35.3,36.1,36.8,37.4],At=30.4;function ua(e){let t=0;for(let s=0;s<st.length;s++)e>=st[s]-.62&&(t=s+1);return e>=37.9&&(t=9),e>=At?Math.max(1,t):0}const H={s:O.bin,c:0,w:6.4,d:4,h:1.9},se={s:O.bin,c:0,h:6.4},fa=`
attribute vec4 aA;    // release time, fall duration, seed, flips
attribute vec4 aL;    // landing: across, along, yaw, stack height
uniform float uT; uniform vec3 uHook, uFloor, uA, uR; uniform float uFace;
varying vec2 vUv; varying vec4 vI;
float eio(float t){ return t * t * (3. - 2. * t); }
void main(){
  float s = uT - aA.x, tf = aA.y, k = clamp(s / tf, 0., 1.);
  float appear = smoothstep(-1.15, -.9, s);
  vec3 land = uFloor + uR * aL.x + uA * aL.y + vec3(0., aL.w + .03, 0.);
  vec3 pos = vec3(mix(uHook.x, land.x, eio(k) * .6 + k * .4), mix(uHook.y, land.y, k * k), mix(uHook.z, land.z, eio(k) * .6 + k * .4));
  float sp = max(s - tf, 0.);
  pos.y += (.55 + .25 * fract(aA.z * 7.3)) * exp(-6. * sp) * abs(sin(sp * 10.5)) * step(0., s - tf);
  // before the release the take hovers at the hook and shivers as it is crossed out
  float hover = 1. - step(0., s);
  pos += uA * 0. + vec3(0., sin(uT * 7. + aA.z) * .04 * hover, 0.);
  float th = -(1.5707963 + 6.2831853 * aA.w) * (k * k * (3. - 2. * k));
  float roll = (fract(aA.z * 3.7) - .5) * 1.4 * (1. - k) * (1. - k);
  float yaw = uFace + aL.z * k;
  float sz = 1.35 * appear;
  vec3 l = vec3(position.x * 1.6 * sz, position.y * sz, 0.);
  l.xy = mat2(cos(roll), sin(roll), -sin(roll), cos(roll)) * l.xy;
  l = vec3(l.x, l.y * cos(th) - l.z * sin(th), l.y * sin(th) + l.z * cos(th));
  l = vec3(l.x * cos(yaw) + l.z * sin(yaw), l.y, -l.x * sin(yaw) + l.z * cos(yaw));
  gl_Position = projectionMatrix * viewMatrix * vec4(pos + l, 1.);
  vUv = uv;
  vI = vec4(aA.z, clamp(1. + s / .9, 0., 1.), k, step(0., s));   // seed, the slash's progress, fall, released
}`,da=`
uniform float uTime, uT; varying vec2 vUv; varying vec4 vI;
${Pe}
${He}
${Ft}
${be}
void main(){
  vec2 q = (vUv - .5) * vec2(1.6, 1.);
  float px = max(fwidth(q.y), 1e-5);
  float dOut = sdRBox(q, vec2(.8, .5) - .004, .035), cov = smoothstep(px, -px, dOut);
  if (cov < .004) discard;
  vec3 col;
  if (gl_FrontFacing) {
    float dIn = sdRBox(q, vec2(.8, .5) - .035, .02);
    vec3 pic = picture(vUv, vI.x, .7, uTime + vI.x * 3., 0.) * .8;
    col = mix(S(vec3(.04, .045, .06)), pic, smoothstep(px, -px, dIn));
    // crossed out: a warm stroke drawn corner to corner
    vec2 a = vec2(-.7, .42), b = vec2(.7, -.42);
    vec2 pa = q - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    float dl = length(pa - ba * min(h, vI.y)) - .018;
    float on = step(h, vI.y) * smoothstep(px * 2., -px, dl);
    col = mix(col, TW * 1.3, on * smoothstep(0., .2, vI.y));
  } else {
    // the back of a card: a lattice in tungsten on dark glass
    vec2 g = (vUv - .5) * vec2(8., 5.);
    float d = abs(fract(g.x + g.y * 1.3) - .5) + abs(fract(g.x - g.y * 1.3) - .5);
    float lat = smoothstep(.05, .0, abs(d - .5) - .01);
    col = S(vec3(.03, .035, .05)) + TW * (lat * .35 + smoothstep(px * 3., 0., abs(dOut + .03)) * .6);
  }
  gl_FragColor = vec4(col, cov);
}`;function ha(e,t,s,o,f){const r=t.world,n=e.quality>0,p=[],u=Ve(o),b=u.tan(H.s),v=u.side(H.s),c=new Ne;r.add(c);const M=(w,k,G)=>new de(...u.at(w,k,G)),T=u.yawBack(H.s),y=st.length,B=new Float32Array(y*4),d=new Float32Array(y*4);for(let w=0;w<y;w++)B.set([st[w],.78+.1*V(w*3.3),1+w*2.9,1+w%2],w*4),d.set([(V(w*7.1)-.5)*3.4,(V(w*4.7)-.5)*1.8,(V(w*9.3)-.5)*2.2,.08+w*.045],w*4);const P=new ye(1,1),F=Le(P,y,{aA:[B,4],aL:[d,4]}),z=new oe({uniforms:{uT:s.uT,uTime:s.uTime,uHook:{value:M(se.s,se.c,se.h)},uFloor:{value:M(H.s,H.c,.35)},uA:{value:new de(...b)},uR:{value:new de(...v)},uFace:{value:T}},vertexShader:fa,fragmentShader:da,side:ge,alphaToCoverage:n}),m=new te(F,z);m.frustumCulled=!1,c.add(m),p.push({dispose(){F.dispose(),P.dispose(),z.dispose()}});const x=Re(t.G,40,{decl:ce,fog:.003,order:5,body:"col.a *= litAt((A + B) * .5, 0., 1.);",uniforms:{uT:s.uT,uDir:s.uDir}});x.begin();const g=u.at(H.s,H.c,0),i=(w,k,G)=>[g[0]+v[0]*w+b[0]*G,k,g[2]+v[2]*w+b[2]*G];for(const[w,k,G,E,N,X]of Go(H.w,H.h,H.d,0,H.h/2,0)){const Y=i(w,k,G),ie=i(E,N,X);x.add(Y[0],Y[1],Y[2],ie[0],ie[1],ie[2],1,.8,.52,.85,1.6)}x.end(),c.add(x.mesh),p.push(x);const S=new po(H.w,H.h,H.d),R=new oe({uniforms:{uInner:{value:1}},transparent:!0,depthWrite:!1,blending:_e,side:ge,vertexShader:"varying vec3 vN, vV; varying float vY; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); vY = position.y; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"varying vec3 vN, vV; varying float vY; void main(){ float f = pow(1. - abs(dot(normalize(vN), normalize(vV))), 2.2); float top = smoothstep(-1.15, 1.15, vY); gl_FragColor = vec4(vec3(1., .66, .34) * (f * .16 + .01) * (.5 + top), 1.); }"}),W=new te(S,R);W.position.set(g[0],H.h/2,g[2]),W.rotation.y=u.yawAlong(H.s),W.frustumCulled=!1,W.renderOrder=4,c.add(W),p.push({dispose(){S.dispose(),R.dispose()}});const L=new ye(H.w*1.5,H.d*1.7),a=new oe({uniforms:{uK:{value:0}},transparent:!0,depthWrite:!1,blending:_e,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform float uK; varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * 2.; float a = exp(-dot(q, q) * 2.6) * uK; gl_FragColor = vec4(vec3(1., .62, .3) * a * .5, 1.); }"}),h=new te(L,a);h.rotation.x=-Math.PI/2,h.position.set(g[0],.06,g[2]),h.rotation.z=-u.yawAlong(H.s),h.frustumCulled=!1,h.renderOrder=3,c.add(h),p.push({dispose(){L.dispose(),a.dispose()}});const C=Array.from({length:9},(w,k)=>wt("v"+(k+1),{font:ot.mono,px:240,weight:700}));for(const w of C)w.mesh.rotation.y=T,w.mesh.visible=!1,w.mesh.renderOrder=8,w.mesh.frustumCulled=!1,c.add(w.mesh),p.push(w);const A=u.at(H.s+2.2,H.c-5,5.2),U=u.at(H.s,H.c,10.8);return{group:c,track:u,update(w){const k=w>26.5&&w<47;if(c.visible=k,!k)return;a.uniforms.uK.value=Z(30,33,w)*(.5+.5*ne((w-31)/7));const G=ua(w),E=f.tall?U:A;if(C.forEach((N,X)=>{N.mesh.visible=G===X+1}),G>0){const N=C[G-1],X=w-(G===9?37.9:st[G-1]-.62),Y=1+.28*Math.exp(-Math.max(X,0)*7),ie=Z(At-.3,At+.2,w),he=(f.tall?5.4:6)*Y;N.set(he),N.mesh.position.set(E[0],E[1]-.1*he,E[2]),G===9?N.U.uColor.value.setRGB(1.5,1.4,1.15):N.U.uColor.value.setRGB(1.35,.82,.4),N.U.uAlpha.value=ie}},dispose(){for(const w of p)w.dispose()}}}const Mt=37.7,to=38.4,Tt=40.2,ma=50.2,St=4,zt=O.gates[0],Rt=41.2,Ge=O.stop,Be=Rt+(Ge-zt)/St,It=3.7,xa=`
uniform sampler2D tMap; uniform float uMapAsp, uMapRaw, uAsp, uFin, uFlash, uSweep, uGlow; uniform vec4 uGate;
vec3 mapSample(vec2 uv){
  vec2 s = uAsp > uMapAsp ? vec2(1., uMapAsp / uAsp) : vec2(uAsp / uMapAsp, 1.);
  vec3 c = texture2D(tMap, (uv - .5) * s + .5).rgb;
  return mix(c, S(c), uMapRaw);
}
float rectL(vec2 uv, vec2 half_, float w){ vec2 d = abs(uv - .5) - half_; float dd = max(d.x, d.y); return smoothstep(w, 0., abs(dd)); }
vec3 pic(vec2 uv, vec2 pw){
  float px = max(fwidth(uv.y), 1e-5);
  float fin = uFin;
  // rough: a coarse grey mosaic of the picture, noisy; finished: the film itself, bright
  float cells = mix(18., 600., smoothstep(.15, .8, fin));
  vec2 cuv = (floor(uv * cells) + .5) / cells;
  vec3 c = mapSample(mix(cuv, uv, smoothstep(.5, .85, fin)));
  float l = luma(c);
  vec3 rough = vec3(l) * vec3(.85, .95, 1.1) * (.72 + .28 * h12(floor(uv * cells) + floor(uTime * 9.)));
  vec3 col = mix(rough * .75, c, smoothstep(.12, .7, fin));
  col *= mix(.8, 1.08, fin);
  // each panel the keeper passes lays a band of light across its face
  float bx = (uv.x - uSweep) * 5.;
  float band = exp(-bx * bx) * step(0., uSweep) * step(uSweep, 1.);
  col = col * (1. + (uFlash * .8 + band * .45) * (1. - fin * .4)) + vec3(1., .76, .46) * band * .05 * (1. - fin * .6);
  col += vec3(1., .78, .5) * uGlow * smoothstep(.0, .12, min(min(uv.x, 1. - uv.x), min(uv.y, 1. - uv.y))) * 0.;
  // the gates: abstract checks that flicker over it
  float w = px * 1.4;
  vec3 W = vec3(1., .86, .62);
  if (uGate.x > .01) {   // safe areas, corner marks, a cross
    float a = rectL(uv, vec2(.45), w) + rectL(uv, vec2(.4), w) * .7;
    vec2 q = abs(uv - .5) - .45;
    float tick = step(abs(q.x), px * 14. / uAsp) * step(abs(q.y), px * 1.2) + step(abs(q.y), px * 14.) * step(abs(q.x), px * 1.2 / uAsp);
    float cx = step(abs(uv.x - .5), px * .8 / uAsp) * step(abs(uv.y - .5), px * 9.) + step(abs(uv.y - .5), px * .8) * step(abs(uv.x - .5), px * 9. / uAsp);
    col = mix(col, col * .6 + W * .0, uGate.x * .3) + W * (a * .8 + tick * .5 + cx * .5) * uGate.x;
  }
  if (uGate.y > .01) {   // a contact sheet: nine frames, the ninth lit
    vec2 g = uv * 3., id = floor(g), f = fract(g) - .5;
    float cell = smoothstep(px * 4., 0., max(abs(f.x), abs(f.y) * 1.) - .46 + px * 2.);
    float last = step(abs(id.x - 2.), .1) * step(abs(id.y - 2.), .1);
    float edge = smoothstep(px * 2.5, 0., abs(max(abs(f.x), abs(f.y)) - .47));
    col = mix(col, col * (.45 + .25 * h12(id + 3.)) + vec3(.02), uGate.y * (1. - last * .8));
    col += W * edge * (.35 + last * .9) * uGate.y;
  }
  if (uGate.z > .01) {   // a phone-sized outline: the frame cut to 9:16
    float hw = .5625 / uAsp * .5;
    vec2 d = abs(uv - .5) - vec2(hw, .5);
    float inside = smoothstep(px * 2., -px * 2., max(d.x, d.y));
    col = mix(col, col * .4, uGate.z * (1. - inside));
    col += W * smoothstep(px * 2.4, 0., abs(max(d.x, d.y))) * .85 * uGate.z;
  }
  if (uGate.w > .01) {   // wide bars, and the square
    float bar = (1. - uAsp / 2.39) * .5;
    float barM = smoothstep(bar - px, bar + px, uv.y) * smoothstep(bar - px, bar + px, 1. - uv.y);
    col = mix(col, col * barM * .5, uGate.w * (1. - barM));
    float sq = rectL(uv, vec2(.5 / uAsp, .5), w);
    col = mix(col, col * barM, uGate.w * .0) + W * (smoothstep(px * 2., 0., abs(uv.y - bar)) + smoothstep(px * 2., 0., abs(1. - uv.y - bar))) * .7 * uGate.w + W * sq * .6 * uGate.w;
  }
  return col;
}`;function wo(e){const t=Ve(e),s=[{t:Mt-.1,p:[se.s,0,se.h],l:[0,0,0],hold:!0},{t:to,p:[se.s,0,se.h],l:[0,0,0],hold:!0},{t:to+.85,p:[se.s+.9,0,se.h+2.1],l:[0,0,0]},{t:Tt,p:[O.line,0,4.4],l:[0,0,0]},{t:Rt,p:[zt,0,3],l:[0,0,0]},{t:fe(Rt,Be,.5),p:[fe(zt,Ge,.5),0,3],l:[0,0,0]},{t:Be,p:[Ge,0,3.2],l:[0,0,0],hold:!0}],o=uo(s),f=new de;return{path:o,tr:t,sch(r){const n=o(r).p;return[n.x,n.y,n.z]},sAt(r){return o(r).p.x},pos(r){const n=o(r).p,p=t.at(n.x,n.y,n.z);return f.set(p[0],p[1],p[2])}}}const gt=new URLSearchParams(location.search).has("svt")?Number(new URLSearchParams(location.search).get("svt")):null,oo=(()=>{const e=new Po(new Uint8Array([20,20,24,255]),1,1);return e.needsUpdate=!0,e})();function ga(e,t,s,o){const f=t.world,r=e.films.find(d=>d.id==="mk-voice");let n=e.viewport.portrait,p=jt(e,r,n),u=Ht(r,n);p.prime();let b=null,v=!1;const c={tMap:{value:oo},uMapAsp:{value:u.clipAsp},uMapRaw:{value:0},uAsp:{value:u.clipAsp},uFin:{value:0},uFlash:{value:0},uSweep:{value:-1},uGlow:{value:0},uGate:{value:new vo}};function M(){b&&(f.remove(b.group),b.dispose());const d=u.clipAsp,P=d>=1?[1.6,1.6/d]:[1.6*d,1.6];b=Pt(s,{size:P,bezel:.02,msaa:e.quality>0,uniforms:c,decl:"",pic:xa,hl:new $e(1,.66,.34)}),b.group.visible=!1,f.add(b.group),c.uAsp.value=d,c.uMapAsp.value=u.clipAsp}M();const T=wo(o),y=T.tr,B={pos:new de,yaw:0,s:0,fin:0,size:1};return{get screen(){return b},track:y,pose:B,S_STOP:Ge,sAt:d=>T.sAt(d),resize(){e.viewport.portrait!==n&&(n=e.viewport.portrait,p=jt(e,r,n),u=Ht(r,n),p.prime(),M())},update(d,P,F,z){const m=b,x=d>Mt-.2;m.group.visible=x;const g=gt!==null,i=p.frame(z&&!g),S=e.textures.video(u.clip);g?(S.video.paused||S.video.pause(),Math.abs(S.video.currentTime-gt)>.04&&(S.video.currentTime=gt)):!z&&v&&S.video.currentTime>.05&&(S.video.currentTime=0),v=z;const R=g?z&&S.video.readyState>=2:i.live,W=g&&R?{tex:S.texture,asp:u.clipAsp,live:R}:i;if(z&&W.live?(c.tMap.value=W.tex,c.uMapRaw.value=1,c.uMapAsp.value=W.asp):S.video.readyState>=2?(c.tMap.value=S.texture,c.uMapRaw.value=1,c.uMapAsp.value=u.clipAsp):(c.tMap.value=W.tex??oo,c.uMapRaw.value=W.live?1:0,c.uMapAsp.value=W.asp),t.U.tVid.value=W.tex??t.U.tVid.value,t.U.uVidAsp.value=W.asp,t.U.uVidRaw.value=W.live?1:0,!x)return B;const L=T.pos(d),a=T.sAt(d),h=y.yawBack(a);B.pos.copy(L),B.s=a;const C=Ee(ne((d-Mt)/.7)),A=It*(.18+.82*C);if(m.group.position.copy(L),B.yaw=h,F>0){let X=Math.atan2(P.x-L.x,P.z-L.z)-h;X=Math.atan2(Math.sin(X),Math.cos(X)),B.yaw=h+X*F}m.group.rotation.set(0,B.yaw,0),m.group.scale.setScalar(A/1.6),B.size=A;const U=O.panel0-1,w=O.panel0+O.pitch*(O.panels-1)+1.5;c.uFin.value=Math.min(1,d<Tt?.1:a<U?.12+.1*Z(O.line,U,a):.22+.78*Z(U,w,a)),d>Be&&(c.uFin.value=1);const k=c.uGate.value;O.gates.forEach((N,X)=>{const Y=Math.abs(a-N)/St,ie=ne(1-Y/.46),he=.55+.45*(Math.floor(d*14+X*3)%2===0?1:.35);k.setComponent(X,a<N-5||a>N+5?0:Z(0,.25,ie)*he)});let G=0,E=-1;for(let N=0;N<O.panels;N++){const X=O.panel0+N*O.pitch,Y=(a-X)/St;G=Math.max(G,Math.exp(-Y*Y*16)),Y>-.3&&Y<.55&&(E=(Y+.3)/.85)}return c.uFlash.value=d<Tt?0:G,c.uSweep.value=E,B},dispose(){b&&b.dispose()}}}const Ke=5.2,et=7.6,wa=`
${Wt}
attribute vec3 aP;      // along, kind, seed
uniform float uKs, uHalfW, uHeight, uT;
varying vec2 vUv; varying vec4 vI; varying vec3 vN; varying vec3 vV;
void main(){
  float s = aP.x, kind = aP.y;
  vec3 w;
  float depth = .55;
  if (kind < 1.5) {          // a wall panel: the outer wall, the inner one
    float side = kind < .5 ? -1. : 1.;
    w = trackAt(s + position.y * depth, side * (uHalfW - .02), 2.65 + position.x * 3.5);
  } else {                   // two strips in the ceiling either side of the slot the cable runs through
    float side = kind < 2.5 ? -1. : 1.;
    w = trackAt(s + position.y * depth, side * (.5 + (position.x + .5) * (uHalfW - .55)), uHeight - .02);
  }
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  vN = kind < .5 ? trackIn(s) : kind < 1.5 ? -trackIn(s) : vec3(0., -1., 0.);
  vV = cameraPosition - w;
  float d = uKs - s;
  vI = vec4(exp(-d * d / 1.6), smoothstep(-.6, 1.4, d), aP.z, kind);
  vUv = uv;
}`,ya=`
varying vec2 vUv; varying vec4 vI; varying vec3 vN; varying vec3 vV;
${be}
void main(){
  if (dot(vN, vV) < 0.) discard;
  vec2 q = (vUv - .5) * 2.;
  float h = abs(q.x), a = abs(q.y);   // 0 at the middle, 1 at the edge: across the height, across the width
  // a softbox: a lit face with soft ends, a hotter core down its middle (a tube behind the diffuser), a faint dark frame
  float face = smoothstep(1., .86, h) * smoothstep(1., .5, a);
  float core = exp(-a * a * 7.) * smoothstep(1., .92, h);
  float frame = smoothstep(1., .96, max(h, a)) * (1. - smoothstep(.96, .86, max(h, a)));
  float lit = .02 + .06 * vI.y + 1.1 * vI.x;
  float up = vI.w < 1.5 ? mix(.6, 1., vUv.x) : 1.;
  vec3 hot = mix(TA, vec3(1., .9, .74), clamp(vI.x * .9 + vI.y * .3, 0., 1.));
  gl_FragColor = vec4(hot * lit * (face * .55 + core * .75) * up + TW * frame * (.05 + .25 * vI.x), 1.);
}`;function ao(e,t,s,o,f){const r=t.world,n=[],p=f.tall?1.85:3,u=Ve(o),b=new Ne;r.add(b);const v=(a,h,C)=>u.at(a,h,C),c=Re(t.G,2600,{decl:ce,fog:.003,order:5,body:"col.a *= litAt(vec3((A.x + B.x) * .5, 0., (A.z + B.z) * .5), .0, 1.);",uniforms:{uT:s.uT,uDir:s.uDir}});c.begin();const M=(a,h,C,A=1,U=[1,.78,.52])=>c.add(a[0],a[1],a[2],h[0],h[1],h[2],U[0],U[1],U[2],C,A),T=(a,h,C,A,U,w)=>{const k=[v(a,-h,C),v(a,h,C),v(a,h,A),v(a,-h,A)];for(let G=0;G<4;G++)M(k[G],k[(G+1)%4],U,w)},y=(a,h,C,A,U,w=1,k)=>{const G=Math.max(1,Math.ceil((h-a)/1.2));for(let E=0;E<G;E++)M(v(a+(h-a)*E/G,C,A),v(a+(h-a)*(E+1)/G,C,A),U,w,k)};O.gates.forEach(a=>{T(a,p+.5,0,Ke+.4,.85,1.8),T(a+.18,p+.35,0,Ke+.25,.4,1)});for(let a=0;a<O.panels;a++)T(O.panel0+a*O.pitch,p,0,Ke,.22,1);const B=O.gates[0]-1.5,d=O.end+1;for(const[a,h,C]of[[-p,0,.3],[p,0,.3],[-p,Ke,.3],[p,Ke,.3],[-1.4,0,.16],[1.4,0,.16]])y(B,d,a,h,C);y(se.s-2.5,O.stop+.5,0,et,.9,2,[1,.84,.6]),y(se.s-2.5,O.stop+.5,0,et+.18,.35,1);for(let a=se.s;a<O.stop;a+=6)M(v(a,0,0),v(a,0,et),.22,1);const P=O.stop+.5,F=et+1.8,z=5.6;for(const a of[-z,z]){M(v(P,a,0),v(P,a,F),.8,2),M(v(P+.5,a,0),v(P+.5,a,F),.45,1),M(v(P,a,0),v(P+.5,a,0),.5,1),M(v(P,a,F),v(P+.5,a,F),.6,1);for(let h=0;h<F-1;h+=1.6)M(v(P,a,h),v(P+.5,a,h+1.6),.25,1)}M(v(P,-z,F),v(P,z,F),.95,2.4),M(v(P+.5,-z,F),v(P+.5,z,F),.5,1.2);for(let a=-z;a<z-.1;a+=1.4)M(v(P,a,F),v(P+.5,a+1.4,F),.22,1);c.end(),b.add(c.mesh),n.push(c);const m=Re(t.G,16,{fog:.003,order:6});b.add(m.mesh),n.push(m);const x=O.panels*4,g=new Float32Array(x*3);for(let a=0;a<O.panels;a++)for(let h=0;h<4;h++)g.set([O.panel0+a*O.pitch,h,(a*4+h)*.37],(a*4+h)*3);const i=new ye(1,1),S=Le(i,x,{aP:[g,3]}),R={value:0},W=new oe({uniforms:{uT:s.uT,uTrk:s.uTrk,uKs:R,uHalfW:{value:p},uHeight:{value:Ke}},vertexShader:wa,fragmentShader:ya,transparent:!0,depthWrite:!1,blending:_e,side:ge}),L=new te(S,W);return L.frustumCulled=!1,L.renderOrder=5,b.add(L),n.push({dispose(){S.dispose(),i.dispose(),W.dispose()}}),{group:b,track:u,portal:v(P,0,F),update(a,h,C,A,U){const w=a>28&&a<61;if(b.visible=w,!w)return;R.value=A?h:-50,m.begin();const k=A?h:se.s,G=a>U?v(P,0,F):v(k,0,et),E=A?C:v(se.s,0,se.h+1.2),N=u.side(k);m.add(G[0],G[1],G[2],E[0],E[1],E[2],1,.84,.6,.8,1.2),m.add(G[0]-N[0]*.5,G[1]+.15,G[2]-N[2]*.5,G[0]+N[0]*.5,G[1]+.15,G[2]+N[2]*.5,1,.84,.6,.95,5),m.end()},dispose(){for(const a of n)a.dispose()}}}const so=50.4,ba=54,ka=54,Aa=57.2,no=60,Ma=3.2;function yo(e,t,s){const o=Ve(e),f=o.at(Ge,0,Ma),r=o.tan(Ge),n=[-r[0],0,-r[2]],p=o.side(Ge),u=Z(Be-.2,so+1.8,s),b=Z(so,ba,s),v=Math.tan(t.fov*we/2),c=t.tall?t.keeperW*t.keeperAsp/2:t.keeperW/2,M=t.tall?t.keeperW/2:t.keeperW/t.keeperAsp/2,T=Math.min(M/v,c/(t.aspect*v)),y=Z(ka,Aa,s),B=-e*(8+80*b)*we,d=fe(fe(6.4,8.6,u),9.4,b)*(1-y)+T*y,P=fe(fe(1.3,2.6,u),3.6,b)*(1-y)+0*y,F=B*1,z=[n[0]*Math.cos(F)+p[0]*Math.sin(F),0,n[2]*Math.cos(F)+p[2]*Math.sin(F)],m=[f[0]+z[0]*d,f[1]+P,f[2]+z[2]*d],x=[f[0],f[1]+(1-y)*(.2+2.5*u),f[2]];return{pos:m,look:x,K:f,alpha:B}}function lo(e,t,s,o,f){const r=e.lang==="ar",n=t.world,p=[],u=B=>r?Io(String(B)):String(B),b=[{n:u(dt.count),w:r?"فيلماً":"films",at:51},{n:u(dt.chapters),w:r?"فصلاً":"chapters",at:52.3},{n:u(dt.minutes),w:r?"دقيقة":"minutes",at:53.6}],v=new Ne;n.add(v);const c=f.tall,M=c?15:24,T=c?11.5:12.5,y=33;return b.forEach(B=>{const d=yo(o,f,B.at),P=d.K[0]-d.pos[0],F=d.K[2]-d.pos[2],z=d.pos[0],m=d.pos[2],x=P*P+F*F,g=2*(z*P+m*F),i=z*z+m*m-y*y,S=(-g+Math.sqrt(Math.max(g*g-4*x*i,0)))/(2*x),R=z+P*S,W=m+F*S,L=9.4,a=new Ne;a.position.set(R,L,W),a.lookAt(0,L,0);const h=new oe({uniforms:{uA:{value:0},uBox:{value:new co(M,T)}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform float uA; uniform vec2 uBox; varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * uBox; vec2 d = abs(q) - uBox * .5 + 1.4; float sd = length(max(d, 0.)) + min(max(d.x, d.y), 0.) - 1.4; float a = smoothstep(.7, -.7, sd) * .86; float rim = smoothstep(.12, 0., abs(sd + .35)) * .0 + smoothstep(.07, 0., abs(abs(q.y) - uBox.y * .5 + .6)) * smoothstep(uBox.x * .5, uBox.x * .5 - 2., abs(q.x)) * .55; gl_FragColor = vec4(vec3(1., .74, .46) * rim * uA, a * uA); }"}),C=new te(new ye(M,T),h);C.renderOrder=9,C.frustumCulled=!1,a.add(C);const A=wt(B.n,{font:r?ot.ar:ot.sans,px:300,weight:700,color:new $e(1,.86,.6),rtl:r,align:"center",fog:0});A.set(T*.56),A.mesh.position.set(0,T*.1,.05),A.mesh.renderOrder=10;const U=wt(B.w,{font:r?ot.ar:ot.mono,px:160,weight:r?600:500,color:new $e(1,.62,.32),rtl:r,align:"center",fog:0});U.set(T*.17),U.mesh.position.set(0,-T*.31,.05),U.mesh.renderOrder=10,a.add(A.mesh,U.mesh),v.add(a),p.push({dispose(){A.dispose(),U.dispose(),C.geometry.dispose(),h.dispose()}}),a.userData={mat:h,nm:A,wd:U,at:B.at}}),{group:v,update(B){const d=B>49.5;if(v.visible=d,!!d)for(const P of v.children){const F=P.userData,z=Z(F.at-.95,F.at-.4,B)*(1-Z(F.at+.35,F.at+.95,B));F.mat.uniforms.uA.value=z,F.nm.U.uAlpha.value=z,F.wd.U.uAlpha.value=z,P.visible=z>.002}},dispose(){for(const B of p)B.dispose()}}}const Ta=29.2;function Sa(e){const t=Math.min(1,Math.max(0,(1.5-e)/1));return 46+18*t*t*(3-2*t)}function za(e,t){const s=Math.tan(t*we/2),o=Math.min(.4,.43*e);return{dist:.8/(2*s*o),lift:.045*2*(.8/(2*s*o))*s}}function ro(e,t){const s=(i,S,R)=>ae(t,i,S,R),o=za(e.aspect,e.fov),f=ze.y-o.lift,r=ze.r-o.dist,n=(i,S,R,W={})=>({t:i,p:S,l:R,fov:e.fov,...W}),p=kt(t,e),u=(i,S,R)=>[p.G[0]+p.N[0]*i+p.R[0]*S,R,p.G[2]+p.N[2]*i+p.R[2]*S],b=(i,S)=>[p.G[0]+p.R[0]*i,S,p.G[2]+p.R[2]*i],v=e.tall?0:-2*t,c=p.G[1],M=e.tall?4.5:0,T=Ve(t),y=(i,S,R)=>T.at(i,S,R),B=[];for(let i=oa;i<=Ta+.01;i+=.6)B.push(n(i,y(sa(i),0,go(i)),na(T,i)));const d=(i,S=0)=>y(O.bin,0,i+S),P=e.tall?[n(31.2,y(31.6,0,6.6),d(5.6)),n(34.5,y(32.2,0,6.5),d(6.2)),n(37.4,y(33.6,0,6.6),d(6.8)),n(39,y(36,0,6.8),y(O.bin+4.5,0,6.6))]:[n(31.2,y(31.8,0,5.8),d(3)),n(34.5,y(32.6,0,5.4),d(3.4)),n(37.4,y(34,0,5.4),d(4.4)),n(39,y(36.2,0,6),y(O.bin+4,0,7.2))],F=wo(t),z=[];for(let i=40.4;i<=Be-.39;i+=.8){const S=F.sAt(i),R=F.pos(i);z.push(n(i,y(S-6.4,fe(.35,-.9,Z(40.4,Be,i)),4.7),[R.x,R.y+.2,R.z]))}const m={aspect:e.aspect,fov:e.fov,tall:e.tall,keeperW:It,keeperAsp:e.tall?9/16:16/9},x=[];for(let i=Be;i<=no+.001;i+=.4){const S=yo(t,m,Math.min(i,no));x.push(n(i,S.pos,S.look))}const g=[n(0,s(r,0,f),s(ze.r,0,f),{hold:!0}),n(1.5,s(r,0,f),s(ze.r,0,f),{hold:!0}),n(3.6,s(30,-1,3.4),s(40,1,3.6+M*.5)),n(5.4,s(15.5,-3,6),s(41,3,7.4+M)),n(6.7,s(13.8,4,9),s(33,9,17.5+M*.5)),n(7.5,s(13.5,9,9.8),s(31,14,20+M*.6)),n(8.4,s(13.1,16,10.5),s(34,32,13.5+M*.3)),n(9.2,s(12.5,26,11),s(34,46,12.5)),...e.tall?[n(11,u(12.5,0,c+1.5),b(0,c+5)),n(14.5,u(11.5,0,c+0),b(0,c+2.6)),n(17.6,u(10.5,0,c-2.2),b(0,c-1.6))]:[n(11,u(16.5,0,c-.6),b(v,c+.3)),n(14.6,u(15.5,0,c-.4),b(v,c+.2)),n(17.6,u(14.8,0,c+.2),b(v,c+.6))],...B,...P,...z,...x];return{at:uo(g),camR:r,camY:f}}const Ra=`
uniform float uBloom; uniform vec3 uBloomTint;
vec3 look(vec2 uv){
  vec3 c = samp(uv);
  c += bloom(uv) * uBloom * uBloomTint;
  return c;
}`;async function La(e){const t=e.lang==="ar"?-1:1;await Wo(Co);const s={uBloom:{value:.5},uBloomTint:{value:new de(.6,.8,1.15)}},o=Bo(e,{pin:"B",pout:"C",msaa:!0,inW:.025,outW:.04,uniforms:s,frag:Ra}),f=Ko(o.G,t),r={tall:e.viewport.portrait,aspect:e.viewport.aspect,fov:46},n=new Nt(46,e.viewport.aspect,.1,400),p=()=>({aspect:r.aspect,fov:r.fov,tall:r.tall,keeperW:It,keeperAsp:r.tall?9/16:16/9}),u=Ho(e,o,f,t),b=Zo(e,o,f),v=ta(e,o,f,t,r);let c=eo(e,o,f,t,r);const M=ha(e,o,f,t,r),T=ga(e,o,f,t);let y=ao(e,o,f,t,r),B=lo(e,o,f,t,p()),d=ro(r,t),P=r.tall;const F=()=>{r.aspect=e.viewport.aspect,r.tall=e.viewport.portrait,r.fov=Sa(r.aspect),n.aspect=r.aspect,n.fov=r.fov,n.updateProjectionMatrix(),d=ro(r,t),T.resize(),P!==r.tall&&(B.dispose(),o.world.remove(B.group),B=lo(e,o,f,t,p()),y.dispose(),o.world.remove(y.group),y=ao(e,o,f,t,r),c.dispose(),o.world.remove(c.group),c=eo(e,o,f,t,r),P=r.tall)};F(),await o.warm(n);const z=new URLSearchParams(location.search),m=z.has("sT")?Number(z.get("sT")):null,x={raw:z.has("sraw")?Number(z.get("sraw"))||1:0},g=z.get("sc")?.split(":").map(Number),i=new Nt;return z.has("sdbg")&&(window.__studio={st:o,hall:u,cloud:b,ways:v,web:c,takes:M,keeper:T,tunnel:y,counts:B,camera:n,S:f,qa:x,at(S){d.at(S,i);const R=new de;return i.getWorldDirection(R),[i.position.x,i.position.y,i.position.z,R.x,R.y,R.z,i.fov]}}),{scene:o.scene,camera:n,update({p:S,t:R,dt:W,v:L}){const a=S*qo.studio;o.tick(R,L),o.setP(S),x.raw===1?o.U.uPin.value=o.U.uPout.value=0:x.raw===2&&(o.U.uPin.value=0,o.U.uPout.value=1),f.uT.value=m??a,d.at(a,n);const h=_o(e,R,W),C=Math.min(1,Math.max(0,Math.min(S-.03,.88-S)*14));n.translateX(h.x*.35*C),n.translateY(h.y*.2*C),n.updateMatrixWorld(),g&&(n.position.set(g[0],g[1],g[2]),n.lookAt(g[3],g[4],g[5]),g[6]&&(n.fov=g[6],n.updateProjectionMatrix()),n.updateMatrixWorld()),u.lens(e.viewport.height,n.fov),u.m0.U.uWipe.value=Z(1.2,3.4,a);const A=Z(1.5,5.5,a),U=1-Z(54.6,57,a);s.uBloom.value=(.5+.45*A)*U,s.uBloomTint.value.set(.6+.4*A,.8+.2*A,1.15-.15*A),v.update(a,n.position),c.update(a),M.update(a);const w=Ee(ne((a-50.6)/2.4)),k=T.update(a,n.position,w,a>=ma),G=r.tall?k.size/2:k.size/(16/9)/2;y.update(a,k.s,[k.pos.x,k.pos.y+G+.15,k.pos.z],a>37.5,Be),B.update(a),o.draw(n)},resize(){o.resize(),F()},dispose(){u.dispose(),b.dispose(),v.dispose(),c.dispose(),M.dispose(),T.dispose(),y.dispose(),B.dispose(),o.dispose()}}}export{La as default};
