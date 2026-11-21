import{T as fe}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{C as Pt,M as Ht,l as Mo,b as Et,p as de,F as ee,f as To,s as So,c as Ro,a as zo}from"./lines.WrF8Llk6.js";import{a as Po,S as Fo}from"./plan.Bzh-bcoD.js";import{V as dt,af as Wo,ag as oe,c as yt,C as Nt,k as ro,M as et,G as jt,d as ot,A as _t,as as Bo,s as gt,x as _o,ai as io,a as Co,F as Io,f as vo,b as po,w as Go,P as Ne}from"./three.module.pheUvn1h.js";import{b as qo,l as we}from"./glow.DcedqMUT.js";import{r as je,m as He}from"./films.CzXWMnFX.js";import{r as uo}from"./rig.D3XFOzcH.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const wt=Math.PI/180,ye=Math.PI*2,ct=42,le=33.5,Lo=40,be={R:20,deg0:60},xt={w:1.6,h:1,bz:.035},at=(t,e,s,o=0)=>[t*e*Math.sin(s*wt),o,-e*Math.cos(s*wt)],nt=t=>Math.min(1,Math.max(0,t)),ft=(t,e,s)=>t+(e-t)*s,Z=(t,e,s)=>{const o=nt((s-t)/(e-t));return o*o*(3-2*o)},$t=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,Uo=t=>1-Math.pow(1-t,3),V=t=>(t=Math.sin(t*127.1+311.7)*43758.5453,t-Math.floor(t)),Do=t=>{let e=t>>>0;return()=>(e=e*1664525+1013904223>>>0)/4294967296};function Yt(t,e,s,o){const f=3*t,c=3*(s-t)-f,n=1-f-c,p=3*e,u=3*(o-e)-p,b=1-p-u,v=T=>((n*T+c)*T+f)*T,r=T=>((b*T+u)*T+p)*T,M=T=>(3*n*T+2*c)*T+f;return T=>{if(T<=0)return 0;if(T>=1)return 1;let y=T;for(let P=0;P<6;P++){const F=v(y)-T;if(Math.abs(F)<1e-6)return r(y);const R=M(y);if(Math.abs(R)<1e-6)break;y-=F/R}let B=0,d=1;y=T;for(let P=0;P<24;P++){const F=v(y)-T;if(Math.abs(F)<1e-6)break;F>0?d=y:B=y,y=(B+d)/2}return r(y)}}function Lt(t,e,s){const o=new Wo;o.index=t.index;for(const f of["position","uv","normal"])t.getAttribute(f)&&o.setAttribute(f,t.getAttribute(f));o.instanceCount=e;for(const[f,[c,n]]of Object.entries(s))o.setAttribute(f,new oe(c,n));return o}const Ko=(t,e)=>({uT:{value:0},uTime:t.uTime,uDir:{value:e},uRes:t.uRes,uPx:t.uPx,uTrk:{value:new dt(be.R,be.deg0*wt,e)}}),rt=`
uniform float uT, uDir;
float phiOf(vec3 p){ float a = atan(uDir * p.x, -p.z); return a < -.9 ? a + 6.2831853 : a; }
float arriveAt(vec3 p){ return 1. + (phiOf(p) + .84) / .30 + p.y * .05; }
float litAt(vec3 p, float jit, float soft){ return smoothstep(0., soft, uT - arriveAt(p) - jit); }
`,bt=`
const vec3 TW = vec3(1., .644, .323), TA = vec3(1., .323, .045);
`,fo=`
${bt}


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
`;function Pe(t,e){const[s,o]=e.size??[xt.w,xt.h],f=e.bezel??xt.bz,c=new yt(s+2*f,o+2*f),n={uT:t.uT,uTime:t.uTime,uDir:t.uDir,uSc:{value:new ro(s,o)},uBz:{value:f},uOn:{value:1},uDim:{value:1},uHl:{value:e.hl??new Nt(1,.644,.323)},...e.uniforms},p=M=>{const T=M?{...n,uPlane:{value:e.reflect.plane},uMirrorK:{value:e.reflect.k}}:n;return new ot({uniforms:T,side:M?gt:_o,transparent:M,depthWrite:!M,blending:M?_t:Bo,alphaToCoverage:!!e.msaa&&!M,vertexShader:`
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
        ${Pt}
        ${Ht}
        ${fo}
        ${e.decl??""}
        ${e.pic}
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
        }`})},u=p(!1),b=new et(c,u);b.frustumCulled=!1;const v=new jt;v.add(b);let r=null;if(e.reflect){r=p(!0);const M=new et(c,r);M.frustumCulled=!1,M.renderOrder=-8,v.add(M)}return{group:v,mesh:b,mat:u,U:n,dispose(){c.dispose(),u.dispose(),r?.dispose()}}}const Fe=`
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
  float flash = 1. + 2.4 * smoothstep(.06, .0, ft) * (.4 + act);
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
`;function zt(t,e,s={}){const o=Mo({count:e,shared:t,uniforms:s.uniforms,fog:s.fog,order:s.order,depthTest:s.depthTest,ends:`
      attribute vec3 aA; attribute vec3 aB; attribute vec4 aC; attribute vec4 aP;
      ${s.decl??""}
      void ends(float id, out vec3 A, out vec3 B, out vec4 col, out vec4 par){ A = aA; B = aB; col = aC; par = aP; ${s.body??""} }`}),f=new oe(new Float32Array(e*3),3),c=new oe(new Float32Array(e*3),3),n=new oe(new Float32Array(e*4),4),p=new oe(new Float32Array(e*4),4);for(const b of[f,c,n,p])b.setUsage(io);o.geo.setAttribute("aA",f),o.geo.setAttribute("aB",c),o.geo.setAttribute("aC",n),o.geo.setAttribute("aP",p);let u=0;return{layer:o,mesh:o.mesh,count:e,get n(){return u},begin(){u=0},add(b,v,r,M,T,y,B,d,P,F=1,R=1,h=0,x=1,g=0){return u>=e?!1:(f.setXYZ(u,b,v,r),c.setXYZ(u,M,T,y),n.setXYZW(u,B,d,P,F),p.setXYZW(u,R,h,x,g),u++,!0)},setRange(b,v,r){p.setY(b,v),p.setZ(b,r)},setAlpha(b,v){n.setW(b,v)},end(){o.geo.instanceCount=u,this.dirty()},dirty(){f.needsUpdate=c.needsUpdate=n.needsUpdate=p.needsUpdate=!0},attrs:{A:f,B:c,C:n,P:p},dispose(){o.dispose()}}}const Zt=132,ce=12,re=3,Xt=1.3,Rt={r:38.6,y:2.15,deskY:1.6},Ve=`
attribute vec3 aPos; attribute vec2 aSz; attribute vec3 aMeta;
${rt}
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
}`,Ye=`
uniform float uTime;
varying vec2 vUv; varying vec4 vA; varying vec3 vW; varying float vL;
${Pt}
${Ht}
${Fe}
${fo}
void main(){
  const vec2 SC = vec2(${xt.w.toFixed(2)}, ${xt.h.toFixed(2)});
  const float BZ = ${xt.bz.toFixed(3)};
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
}`,Ze=t=>`
${rt}
${bt}
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
  ${t?"pos.y = -pos.y; amp *= .06;":""}
  size = .62 * (.8 + .4 * hb(j + 5.));
  col = vec4(tc * amp * 1.25, keep * step(0., age));
}`,Oo=`
${rt}
float hd(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
void pt(float id, out vec3 pos, out float size, out vec4 col){
  float a = hd(id) * 6.2831853, r = sqrt(hd(id + 1.7)) * 38.;
  vec3 base = vec3(r * sin(a), 1. + hd(id + 3.3) * 30., -r * cos(a));
  pos = base + vec3(sin(uTime * .07 + id), cos(uTime * .05 + id * 1.3), sin(uTime * .06 + id * .7)) * .8;
  float lit = litAt(pos, hd(id + 9.) * .8, 1.);
  float tw = .55 + .45 * sin(uTime * (.6 + hd(id + 5.) * 1.6) + id);
  size = .09 + .09 * hd(id + 7.);
  col = vec4(vec3(1., .72, .42) * (.35 + .5 * hd(id + 2.)) * tw, lit);
}`,$o=`
attribute vec3 aApex; attribute vec3 aDir; attribute vec2 aLR; attribute float aSeed;
${rt}
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
}`,Eo=`
uniform float uInt;
varying float vT; varying float vN; varying float vK;
${bt}
void main(){
  float a = vK * vN * pow(max(1. - vT, 0.), 1.25) * smoothstep(0., .08, vT) * uInt;
  gl_FragColor = vec4(TW * a, 1.);
}`,No=`
uniform float uTime; uniform vec4 uM0;
varying vec3 vW;
${rt}
${Pt}
${bt}
uniform float uBanks, uRB;
void main(){
  vec2 q = vW.xz;
  float r = length(q);
  if (r > ${(ct+3).toFixed(1)}) discard;
  float lit = litAt(vec3(vW.x, 0., vW.z), 0., 1.2);
  vec3 c = S(vec3(.014, .011, .010));
  float w = max(fwidth(q.x), fwidth(q.y));
  vec2 g = abs(fract(q / 3. + .5) - .5) * 3.;
  float gl = 1. - smoothstep(0., w * 1.4, min(g.x, g.y));
  vec2 g2 = abs(fract(q / 12. + .5) - .5) * 12.;
  float gl2 = 1. - smoothstep(0., w * 1.6, min(g2.x, g2.y));
  float gfade = exp(-r * .02);
  c += S(vec3(.55, .40, .28)) * (gl * .05 + gl2 * .08) * gfade * lit;

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

  float dm = length(q - uM0.xy);
  c += S(vec3(.5, .66, 1.)) * exp(-dm * .22) * .015 * uM0.z;
  gl_FragColor = vec4(c, 1.);
}`,jo=`
uniform float uTime, uM0I; uniform vec3 uM0;
varying vec3 vW; varying vec3 vN;
${rt}
${Pt}
${bt}
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

  float lip = exp(-abs(vW.y - ${Rt.deskY.toFixed(2)}) * 70.) * (1. - top);
  c += S(vec3(.5, .62, .95)) * lip * .12 + TW * lip * .2 * lit;
  gl_FragColor = vec4(c, 1.);
}`;function Ho(t,e,s,o){const f=e.G,c=e.world,n=t.quality>0,p=[],u=_=>(p.push(_),_),b=_=>_%11===5,v=[],r=[],M=[],T=[xt.w+2*xt.bz,xt.h+2*xt.bz];for(let _=0;_<Zt;_++){if(b(_))continue;const E=_/Zt*360;for(let l=0;l<ce;l++){if(V(_*13.7+l*3.1+1.3)<.04)continue;const G=re+l*Xt,K=at(o,ct,E,G),j=V(_*7.3+l*1.9+5.5);v.push(...K),r.push(...T),M.push(-o*E*wt,j,V(j*91.7)>.9?1:.08+.3*V(j*33.1))}}const y=v.length/3,B=new yt(1,1),d=Lt(B,y,{aPos:[new Float32Array(v),3],aSz:[new Float32Array(r),2],aMeta:[new Float32Array(M),3]}),P={uT:s.uT,uTime:s.uTime,uDir:s.uDir},F=new URLSearchParams(location.search).has("sf"),R=new et(d,new ot({uniforms:P,vertexShader:Ve,fragmentShader:F?"varying vec2 vUv; varying vec4 vA; varying vec3 vW; varying float vL; void main(){ gl_FragColor = vec4(vA.x, .6, 1. - vA.x, 1.); }":Ye,alphaToCoverage:!1}));R.frustumCulled=!1;const h=new et(d,new ot({uniforms:P,vertexShader:Ve,fragmentShader:Ye,defines:{MIRROR:1},transparent:!0,depthWrite:!1,blending:_t,side:gt}));h.frustumCulled=!1,h.renderOrder=-8,c.add(R,h),u({dispose(){d.dispose(),B.dispose(),R.material.dispose(),h.material.dispose()}});const x=zt(f,6e3,{decl:rt,fog:.004,order:3,body:"float jit = fract(sin(id * 12.9898) * 43758.5453) * .35; col.a *= litAt((A + B) * .5, jit, 1.);",uniforms:{uT:s.uT,uDir:s.uDir}}),g=[.66,.58,.5],i=(_,E,l,D=1)=>x.add(_[0],_[1],_[2],E[0],E[1],E[2],g[0],g[1],g[2],l,D),S=re+ce*Xt;for(let _=0;_<Zt;_++){const E=_/Zt*360,l=(_+1)/Zt*360;if(b(_)){for(const G of[ct+.35,ct+1.1])i(at(o,G,E,0),at(o,G,E,S+.6),.26);for(const G of[0,5,10,S*.5+2.5,S+.6])i(at(o,ct+.35,E,G),at(o,ct+1.1,E,G),.2)}for(let G=0;G<=ce;G+=2){const K=re-.62+G*Xt;i(at(o,ct+.3,E,K),at(o,ct+.3,l,K),.15)}for(let G=0;G<ce;G+=4){const K=re-.62+G*Xt,j=K+4*Xt,tt=_+(G>>2)&1;i(at(o,ct+.3,tt?E:l,K),at(o,ct+.3,tt?l:E,j),.1)}}const z=Et(t,24,32,40);for(let _=0;_<z;_++){const E=(_+.5)/z*360;if(Math.abs((E+180)%360-180)<7)continue;const D=E*wt,G=[o*Math.cos(D),0,Math.sin(D)],K=at(o,le,E,0);for(const j of[-1.2,1.2])x.add(K[0]+G[0]*j,0,K[2]+G[2]*j,K[0]+G[0]*j,29,K[2]+G[2]*j,1,.72,.5,.34,1.1);for(let j=0;j<12;j++){const tt=1.2+j*2.3;x.add(K[0]-G[0]*1.2,tt,K[2]-G[2]*1.2,K[0]+G[0]*1.2,tt,K[2]+G[2]*1.2,1,.72,.5,.22,1)}}x.end(),c.add(x.mesh),u(x);const W=z*24,L={uT:s.uT,uDir:s.uDir,uBanks:{value:z},uRB:{value:le}},a=de({count:W,shared:f,pt:Ze(!1),atten:900,fog:.003,uniforms:L,core:.55,order:6}),m=de({count:W,shared:f,pt:Ze(!0),atten:900,fog:.003,uniforms:L,core:.4,order:-7,depthTest:!0});c.add(a.mesh,m.mesh),u(a),u(m);const C=14,k=[],U=[];for(let _=0;_<C;_++){const E=_/C*ye;k.push(Math.cos(E),Math.sin(E),0,Math.cos(E),Math.sin(E),1);const l=(_+1)%C;U.push(_*2,_*2+1,l*2+1,_*2,l*2+1,l*2)}const w=new Co;w.setAttribute("position",new Io(k,3)),w.setIndex(U);const A=[],q=[],$=[],N=[];for(let _=0;_<z;_++){const E=(_+.5)/z*360;if(!(Math.abs((E+180)%360-180)<7))for(let l=0;l<12;l+=2){const D=1.2+(l+.5)*2.3,G=at(o,le,E,D),K=at(o,ct-1,E+(V(_*3+l)-.5)*6,Math.min(15,3+D*.42+V(_+l*5)*3)),j=[K[0]-G[0],K[1]-G[1],K[2]-G[2]];A.push(...G),q.push(...j),$.push(Math.hypot(...j),1.7+V(l+_)*1.1),N.push(V(_*31+l))}}const X=Lt(w,A.length/3,{aApex:[new Float32Array(A),3],aDir:[new Float32Array(q),3],aLR:[new Float32Array($),2],aSeed:[new Float32Array(N),1]}),Y=new et(X,new ot({uniforms:{uT:s.uT,uDir:s.uDir,uInt:{value:.06}},vertexShader:$o,fragmentShader:Eo,transparent:!0,depthWrite:!1,blending:_t,side:gt}));Y.frustumCulled=!1,Y.renderOrder=2,c.add(Y),u({dispose(){X.dispose(),w.dispose(),Y.material.dispose()}});const it={uT:s.uT,uDir:s.uDir,uTime:s.uTime,uM0:{value:new vo(0,-38.6,1,0)},uBanks:{value:z},uRB:{value:le}},mt=new ot({uniforms:it,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:No}),At=new et(new yt(ct*2+8,ct*2+8),mt);At.rotation.x=-Math.PI/2,At.renderOrder=-10,At.frustumCulled=!1,c.add(At),u({dispose(){At.geometry.dispose(),mt.dispose()}});const Ft=Pe(s,{msaa:n,hl:new Nt(.5,.56,.7).convertSRGBToLinear(),reflect:{plane:Rt.deskY,k:.5},uniforms:{uWipe:{value:0}},decl:"uniform float uWipe;",pic:`
      ${Fe}
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
      }`});Ft.group.position.set(0,Rt.y,-38.6),c.add(Ft.group),u(Ft);const Ct=new po(7,.08,3.85),Wt=new ot({uniforms:{uT:s.uT,uDir:s.uDir,uTime:s.uTime,uM0:{value:new dt(0,Rt.y,-38.6)},uM0I:{value:1}},vertexShader:"varying vec3 vW; varying vec3 vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:jo}),kt=new et(Ct,Wt);kt.position.set(0,Rt.deskY-.04,-38.6+1.925-.05),c.add(kt),u({dispose(){Ct.dispose(),Wt.dispose()}});const Mt=de({count:Et(t,900,2200,3600),shared:f,pt:Oo,atten:900,fog:.004,uniforms:{uT:s.uT,uDir:s.uDir},core:.6,order:7});return c.add(Mt.mesh),u(Mt),{m0:Ft,desk:Wt,floor:mt,lamps:a,lampsMirror:m,dust:Mt,beams:Y,field:R,rig:x,lens(_,E){const l=_/(2*Math.tan(E*wt/2));a.U.uAtten.value=m.U.uAtten.value=Mt.U.uAtten.value=l},dispose(){for(const _ of p)_.dispose()}}}const Vo=`
attribute vec3 aPos; attribute vec3 aRot; attribute float aSeed;
${rt}
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
${Pt}
${Ht}
${bt}
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
}`;function Zo(t,e,s){const o=Et(t,1800,5200,9e3),f=Et(t,90,200,320),c=Math.max(2,Math.round(o/f)),n=f*c,p=Do(7),u=new Float32Array(n*3),b=new Float32Array(n*3),v=new Float32Array(n),r=zt(e.G,n,{decl:rt,fog:.004,order:2,body:"float jit = .5 + fract(sin(id * 12.9898) * 43758.5453) * .5; col.a *= litAt(B, jit, 1.3);",uniforms:{uT:s.uT,uDir:s.uDir}});let M=0;for(let P=0;P<f;P++){const F=p()*ye,R=35*Math.sqrt(p()),h=R*Math.sin(F),x=-R*Math.cos(F);for(let g=0;g<c;g++,M++){const i=35-g/(c-1)*15.5+(p()-.5)*1.1,S=.85+p()*.35,z=h+(p()-.5)*.8,W=x+(p()-.5)*.8;u.set([z,i,W],M*3),b.set([p()*ye,(p()-.5)*.3,S],M*3),v[M]=p(),r.add(h,Lo,x,z,i+.5*S,W,1,.8,.6,.03,1)}}r.end();const T=new yt(1,1),y=Lt(T,n,{aPos:[u,3],aRot:[b,3],aSeed:[v,1]}),B=new ot({uniforms:{uT:s.uT,uDir:s.uDir,uTime:s.uTime},vertexShader:Vo,fragmentShader:Yo,transparent:!0,depthWrite:!1,blending:_t,side:gt}),d=new et(y,B);return d.frustumCulled=!1,d.renderOrder=4,e.world.add(d,r.mesh),{mesh:d,wires:r,count:n,dispose(){y.dispose(),T.dispose(),B.dispose(),r.dispose()}}}const Xo=`
float sq(float x){ return x * x; }
float smin(float a, float b, float k){ float h = max(k - abs(a - b), 0.) / k; return min(a, b) - h * h * k * .25; }
float smax(float a, float b, float k){ return -smin(-a, -b, k); }
float hump(float x, float a, float b, float c, float d){ return smoothstep(a, b, x) * (1. - smoothstep(c, d, x)); }


vec3 fxLiquid(vec2 p, float u, float t, float px){
  float exitK = 1. - smoothstep(.86, 1., u);
  float d = sdMK(p);
  float rise = smoothstep(.1, .74, u);
  float lvl = mix(-1.18, 1.25, rise);
  float calm = 1. - smoothstep(.55, .92, u);
  float wave = (sin(p.x * 3.1 + t * 5.) * .06 + sin(p.x * 7.3 - t * 3.7) * .03) * calm * smoothstep(.1, .3, u);
  float dLiq = smax(d, p.y - (lvl + wave), .05);

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
  float top = exp(-abs(p.y - (lvl + wave)) * 26.) * step(d, 0.) * smoothstep(.1, .3, u);
  liq += vec3(.5, .95, 1.) * top * .9;
  vec3 bg = mix(vec3(.004, .012, .03), vec3(.006, .02, .05), smoothstep(-1.5, 1.5, p.y));
  float vessel = smoothstep(px * 2., 0., abs(d)) * .22 * (1. - cov) + smoothstep(px * 3., 0., abs(d)) * .06;
  vec3 col = bg + vec3(.2, .7, 1.) * vessel;
  col = mix(col, liq, cov * smoothstep(-.02, .05, u));
  return col * mix(.0, 1., exitK) + bg * (1. - exitK);
}


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

  float bw = 1.6;
  float bR = exp(-sq((s - sp + .05) * bw)), bG = exp(-sq((s - sp) * bw)), bB = exp(-sq((s - sp - .05) * bw));
  vec3 band = vec3(bR * 1., bG * .95, bB * 1.05);

  vec2 q = p + nxy * (.5 + 1.2 * bG) * inside;
  float lines = smoothstep(.035, .0, abs(fract(q.x * 3.2 + q.y * .6) - .5) - .46) * .55 + smoothstep(.03, .0, abs(fract(q.y * 3.2) - .5) - .47) * .25;
  vec3 bg = vec3(.006, .011, .022) + vec3(.1, .3, .5) * lines * .07;
  bg += band * vec3(.45, .62, .9) * .22 + vec3(.03, .06, .11) * smoothstep(1.6, -1.6, p.y);

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
`,mo=`
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
`,Xe=["liquid","glass","pixels","ink","light"],Qt=8.6,Jt=11,me=14.2,Qo=3.6,he=17.2,Jo=21;function Ae(t,e){const s=at(t,e.tall?26:28,e.tall?58:62,e.tall?8.2:9.2),o=at(t,15,46,9),f=o[0]-s[0],c=o[2]-s[2],n=Math.hypot(f,c),p=[f/n,0,c/n],u=[p[2],0,-p[0]];return{G:s,N:p,R:u,yaw:Math.atan2(p[0],p[2])}}function Qe(t,e){if(e.tall)return{S:2.75,at:[[-.5,7.4],[.6,3.7],[-.5,0],[.6,-3.7],[-.5,-7.4]].map(([c,n])=>[c*t,n])};const s=3.3,o=6.4;return{S:s,at:[[-o,2],[-o/2,-2],[0,2],[o/2,-2],[o,2]].map(([f,c])=>[f*t,c])}}const ta=`
uniform float uAlpha, uTime, uSeed, uLit; uniform vec3 uTint;
varying vec2 vUv;
${Pt}
${Ht}
${mo}
void main(){
  vec4 c = cardPaper(vUv, uSeed, uLit);
  if (c.a < .004) discard;
  gl_FragColor = vec4(c.rgb * uTint, c.a * uAlpha);
}`;function ea(t,e,s,o,f){const c=e.world,n=t.quality>0,p=[],u={value:0},b={value:0},v=h=>`
    uniform float uTl;
    ${Xo}
    vec3 pic(vec2 uv, vec2 pw){
      vec2 p = (uv - .5) * vec2(1.6, 1.) * 3.1;
      float px = max(fwidth(p.y), 1e-5);
      float u = clamp(uTl, 0., 99.) / ${Qo.toFixed(1)}; u = fract(u);
      float t = uTl;
      return ${h}(p, u, t, px);
    }`,r=Xe.map((h,x)=>{const g=Pe(s,{msaa:n,pic:v("fx"+h[0].toUpperCase()+h.slice(1)),uniforms:{uTl:x===4?b:u},decl:"",hl:new Nt(1,.644,.323)});return g.U.uOn.value=0,g.group.visible=!1,c.add(g.group),p.push(g),g}),M=new yt(1,1),T=Xe.map((h,x)=>{const g=new ot({uniforms:{uAlpha:{value:1},uTime:s.uTime,uSeed:{value:3+x*1.7},uLit:{value:1},uTint:{value:new dt(1,1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:ta,transparent:!0,depthWrite:!1}),i=new et(M,g);return i.visible=!1,i.frustumCulled=!1,i.renderOrder=12,c.add(i),p.push({dispose(){g.dispose()}}),i});p.push({dispose(){M.dispose()}});const y=zt(e.G,160,{decl:rt,fog:.003,order:3,body:"col.a *= litAt((A + B) * .5, .0, 1.2);",uniforms:{uT:s.uT,uDir:s.uDir}}),B={key:""};new dt;const d=(h,x,g,i=0)=>[h.G[0]+h.R[0]*x+h.N[0]*i,h.G[1]+g,h.G[2]+h.R[2]*x+h.N[2]*i];function P(){const h=`${o}${f.tall}`;if(B.key===h)return;B.key=h;const x=Ae(o,f),g=Qe(o,f);y.begin();const i=(k,U,w,A=1)=>y.add(k[0],k[1],k[2],U[0],U[1],U[2],.9,.74,.56,w,A),S=g.at.map(([k])=>k),z=g.at.map(([,k])=>k),W=Math.min(...S)-g.S*1.9,L=Math.max(...S)+g.S*1.9,a=Math.min(...z)-g.S*1.5,m=Math.max(...z)+g.S*1.5,C=17;for(const k of[W,L])i(d(x,k,-x.G[1],-.6),d(x,k,C-x.G[1],-.6),.3,1.2),i(d(x,k,-x.G[1],-1.4),d(x,k,C-x.G[1],-1.4),.22),i(d(x,k,a,-.6),d(x,k,a,-1.4),.2),i(d(x,k,m,-.6),d(x,k,m,-1.4),.2);for(const k of[a,m,(a+m)/2])i(d(x,W,k,-.6),d(x,L,k,-.6),.22);i(d(x,W,C-x.G[1],-.6),d(x,L,C-x.G[1],-.6),.3,1.2),g.at.forEach(([k,U])=>{const w=g.S*.8+.2,A=g.S*.5+.2;for(const[q,$]of[[[-w,-A],[w,-A]],[[w,-A],[w,A]],[[w,A],[-w,A]],[[-w,A],[-w,-A]]])i(d(x,k+q[0],U+q[1],-.3),d(x,k+$[0],U+$[1],-.3),.16);i(d(x,k,U-A,-.3),d(x,k,a,-.6),.1)}),y.end()}c.add(y.mesh),p.push(y);const F=(h,x,g,i,S,z)=>{const W=i.G[0]-g.x,L=i.G[2]-g.z,a=Math.hypot(W,L),m=[g.x+W/a*7.4,g.y+.6,g.z+L/a*7.4],C=d(i,S.at[h][0],S.at[h][1],.15),k=f.tall?1.9:2.3,U=S.S*1.04;if(x<Jt){const w=Uo(nt((x-Qt)/2)),A=[m[0]-i.R[0]*9*o*-1+0,m[1]+4.5,m[2]-i.R[2]*9*o*-1];z.pos.set(A[0]+(m[0]-A[0])*w,A[1]+(m[1]-A[1])*w+Math.sin(x*1.7)*.06*w,A[2]+(m[2]-A[2])*w),z.roll=(1-w)*.5*o,z.s=k*(.55+.45*w)}else{const w=nt((x-Jt-h*.16)/(me-Jt-.6)),A=$t(w),q=[(m[0]+C[0])/2+i.N[0]*2.5,Math.max(m[1],C[1])+2.4+h%2*1.2,(m[2]+C[2])/2+i.N[2]*2.5],$=1-A;z.pos.set($*$*m[0]+2*$*A*q[0]+A*A*C[0],$*$*m[1]+2*$*A*q[1]+A*A*C[1],$*$*m[2]+2*$*A*q[2]+A*A*C[2]),z.roll=Math.sin(A*Math.PI)*(.35+.1*h)*(h%2?1:-1)*o,z.s=k+(U-k)*A}z.yaw=i.yaw},R={pos:new dt,yaw:0,roll:0,s:1};return{screens:r,cards:T,tl:u,update(h,x){P();const g=Ae(o,f),i=Qe(o,f),S=h>Qt-.5&&h<26;y.mesh.visible=S||h>6,u.value=Math.max(0,h-me-.35),b.value=Math.min(u.value,2.95);const z=$t(nt((h-he)/1.3)),W=$t(nt((h-he-.5)/(Jo-he-.5)));for(let L=0;L<5;L++){const a=r[L],m=T[L],C=h-(me+L*.08);a.group.visible=h>6&&h<28;let k=d(g,i.at[L][0],i.at[L][1]);L===4&&(k=d(g,i.at[4][0]+(1*o-i.at[4][0])*W,i.at[4][1]+((f.tall?2:2.2)-i.at[4][1])*W,W*4.6)),a.group.position.set(k[0],k[1],k[2]),a.group.rotation.set(0,g.yaw,0),a.group.scale.setScalar(i.S),a.U.uOn.value=Z(0,.5,C),a.U.uDim.value=L===4?1:1-.78*z,L===4&&a.group.scale.setScalar(i.S*(1+.55*W));const U=L===0?h>Qt&&C<.45:h>Jt&&C<.45;m.visible=U,U&&(F(L,h,x,g,i,R),m.position.copy(R.pos),m.rotation.set(0,R.yaw,0),m.rotateZ(R.roll),m.scale.set(R.s*1.6,R.s,1),m.material.uniforms.uAlpha.value=1-Z(0,.45,C),m.material.uniforms.uLit.value=.6+.4*Z(Qt,Qt+1.2,h))}for(let L=1;L<5;L++)h<Jt&&(T[L].visible=!1)},dispose(){for(const h of p)h.dispose()}}}const Je=be,O={strip:11.14,bin:41.5,line:45,gates:[48.5,51.7,54.9,58.1],panel0:61,pitch:1.4,panels:16,stop:85.5,end:84};function Vt(t){const e=Je.R,s=Je.deg0*wt,o=v=>s+v/e,f=(v,r=0,M=0)=>{const T=o(v),y=e-r;return[t*y*Math.sin(T),M,-y*Math.cos(T)]},c=v=>{const r=o(v);return[t*Math.cos(r),0,Math.sin(r)]};return{R:e,phi:o,at:f,tan:c,inward:v=>{const r=o(v);return[-t*Math.sin(r),0,Math.cos(r)]},side:v=>{const r=c(v);return[-r[2],0,r[0]]},yawBack:v=>{const r=c(v);return Math.atan2(-r[0],-r[2])},yawAlong:v=>{const r=c(v);return Math.atan2(r[0],r[2])},dir:t,p0:s}}const We=`
uniform vec3 uTrk;
vec3 trackAt(float s, float c, float h){ float f = uTrk.y + s / uTrk.x, r = uTrk.x - c; return vec3(uTrk.z * r * sin(f), h, -r * cos(f)); }
vec3 trackTan(float s){ float f = uTrk.y + s / uTrk.x; return vec3(uTrk.z * cos(f), 0., sin(f)); }
vec3 trackIn(float s){ float f = uTrk.y + s / uTrk.x; return vec3(-uTrk.z * sin(f), 0., cos(f)); }
`,Ot=22.8,ve=2,Gt=1.65,ae=16,ie=4,xe=2.2,Be=8.5,oa=22,St=ae*Gt,_e=[Yt(.65,0,.35,1),Yt(.16,1,.3,1),Yt(.65,0,.35,1),Yt(.7,0,.84,0),Yt(.34,1.56,.64,1)],aa=[-9.5,-4.8,0,4.8,9.5],ho=3.1,xo=6.6,Ce=t=>(t-Ot)*ve*Gt,sa=t=>O.strip+Ce(t)-Be,go=(t,e=.95)=>ho+xo*_e[2](nt((Ce(t)-Be)/St))+e;function na(t,e){const s=Ce(e)-Be,o=_e[2](nt(s/St));return t.at(O.strip+s+13+3*o,0,Math.max(.7,go(e)-3.4))}const la=`
${We}
attribute vec4 aT; attribute vec2 aI;
uniform float uPitch, uLaneW, uS0;
varying vec2 vUv; varying vec4 vI;
void main(){
  vec3 w = trackAt(uS0 + aT.x + position.y * uPitch * .88, aT.y + position.x * uLaneW * .9, .03);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  vUv = uv; vI = vec4(aT.z, aT.w, aI.x, aI.y);
}`,ca=`
uniform float uT; varying vec2 vUv; varying vec4 vI;
${Pt}
${bt}
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
}`,ra=`
${We}
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
${bt}
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
${Pt}
${Ht}
${mo}
void main(){
  vec4 c = cardPaper(vUv, vSeed, 1.);
  if (c.a < .004) discard;
  vec2 g = (vUv - .5) * vec2(8., 5.);
  float d = abs(fract(g.x + g.y * 1.3) - .5) + abs(fract(g.x - g.y * 1.3) - .5);
  float lat = smoothstep(.05, .0, abs(d - .5) - .01);
  vec3 back = S(vec3(.05, .05, .06)) + vec3(1., .66, .34) * lat * .2;

  float rim = 1. - smoothstep(0., .07, min(min(vUv.x * 1.6, (1. - vUv.x) * 1.6), min(vUv.y, 1. - vUv.y)));
  vec3 col = gl_FrontFacing ? c.rgb * (.82 + vFlash * 1.1) + vec3(1., .72, .4) * vFlash * (.12 + .9 * rim) : back * (1. + vFlash * 2.);
  gl_FragColor = vec4(col * vFog, c.a);
}`;function to(t,e,s,o,f){const c=e.world,n=t.quality>0,p=[],u=Vt(o),b=(l,D,G)=>u.at(O.strip+l,D,G),v=new jt;c.add(v);const r={value:0},M={value:1},T=ie*ae,y=new Float32Array(T*4),B=new Float32Array(T*2);for(let l=0;l<ie;l++)for(let D=0;D<ae;D++){const G=l*ae+D,K=V(l*17+D*3.7+2.2),j=l===0?D%4===0||K>.9:l===1?D%4===2||D%8===7:l===2?D%2===1&&K>.2:K>.6;y.set([D*Gt+Gt/2,(l-(ie-1)/2)*xe*1.1,j?1:0,Ot+D/ve],G*4),B.set([l,D],G*2)}const d=new yt(1,1),P=Lt(d,T,{aT:[y,4],aI:[B,2]}),F={uT:s.uT,uTrk:s.uTrk,uS0:{value:O.strip}},R=new ot({uniforms:{...F,uPitch:{value:Gt},uLaneW:{value:xe}},vertexShader:la,fragmentShader:ca,side:gt}),h=new et(P,R);h.frustumCulled=!1;const x=new ot({uniforms:F,vertexShader:ra,fragmentShader:ia,transparent:!0,depthWrite:!1,blending:_t,side:gt}),g=new et(P,x);g.frustumCulled=!1,g.renderOrder=6,v.add(h,g),p.push({dispose(){P.dispose(),d.dispose(),R.dispose(),x.dispose()}});const i=Et(t,44,60,80),S=zt(e.G,i*5+8,{decl:rt+"uniform float uBeat, uFade;",fog:.0025,order:5,body:"col.a *= litAt(B, 0., 1.) * (.72 + .5 * uBeat) * uFade;",uniforms:{uT:s.uT,uDir:s.uDir,uBeat:r,uFade:M}});S.begin();for(let l=0;l<5;l++){const D=l===2;let G=null;for(let K=0;K<=i;K++){const j=-12+K/i*(St+16),tt=ho+xo*_e[l](nt(j/St)),I=b(j,aa[l],tt);G&&S.add(G[0],G[1],G[2],I[0],I[1],I[2],D?1:.96,D?.8:.66,D?.5:.36,D?1:.8,D?3:1.9),G=I}}S.end(),v.add(S.mesh),p.push(S);const z=zt(e.G,8,{fog:.002,order:6});v.add(z.mesh),p.push(z);const W=Et(t,12,14,16),L=9,a=W*3,m=a*L+W,C=zt(e.G,m,{fog:.003,order:6,body:"col.a *= smoothstep(2.5, 9., min(length(A - cameraPosition), length(B - cameraPosition)));"});v.add(C.mesh),p.push(C);const k=new Float32Array(W*3),U=new Float32Array(W*4),w=new Float32Array(W),A=Lt(d,W,{aPos:[k,3],aRot:[U,4],aSeed:[w,1]});for(const l of["aPos","aRot"])A.getAttribute(l).setUsage(io);const q=new ot({vertexShader:va,fragmentShader:pa,side:gt,alphaToCoverage:n}),$=new et(A,q);$.frustumCulled=!1,v.add($),p.push({dispose(){A.dispose(),q.dispose()}});const N=[],X=[],Y=[],it=[],mt=[],At=[],Ft=[],Ct=new Float32Array(W),Wt=new Float32Array(W),kt=f.tall;for(let l=0;l<W;l++){const D=l%2?1:-1,G=2.4+l*(St-3.6)/(W-1),K=O.strip+G;X.push(kt?u.at(K,D*1.9,3.3+(l>>1)%3*1.1+G/St):u.at(K,D*4.3,2.3+(l>>1&1)*.9+G/St*.8)),Y.push(u.at(K,D*(kt?1.21:3.63),.06));const j=u.tan(K),tt=u.inward(K),I=kt?.12:.42;mt.push(Math.atan2(-j[0]-D*tt[0]*I,-j[2]-D*tt[2]*I));const Q=V(l*7.7)<.5?-1:1,vt=O.strip-4+V(l*3.1)*(St+8);N.push(kt?u.at(vt,Q*(.8+V(l*6.1)*2.4),3.4+V(l*5.3)*7.2):u.at(vt,Q*(4.2+V(l*6.1)*5.4),3.2+V(l*5.3)*5.6)),it.push(u.yawBack(vt)+(V(l*2.3)-.5)*1.7),At.push(Ot+G/(Gt*ve)),Ft.push((kt?.95:.98)+V(l*4.4)*(kt?.18:.2)),w[l]=2+l*3.7}const Mt=[];for(let l=0;l<W;l++)l<W-1&&Mt.push([l,l+1,0]),Mt.push([l,(l+3)%W,1],[l,(l*5+2)%W===l?(l+7)%W:(l*5+2)%W,1]),Mt.push([l,l,2]);const _=N.map(l=>[...l]),E=(l,D)=>$t(nt((D-(At[l]-1.3))/1.5));return{group:v,N:W,track:u,update(l){const D=l>20.3&&l<34.3;if(v.visible=D,!D)return;const G=(l-Ot)*ve,K=1-Z(30.4,32.2,l);M.value=K,r.value=Math.exp(-Math.max(0,G-Math.floor(G))*5)*Z(Ot-.5,Ot,l);for(let I=0;I<W;I++){const Q=E(I,l),vt=[Math.sin(l*.4+I)*.5,Math.cos(l*.31+I*1.3)*.35,Math.sin(l*.27+I*.7)*.5],pt=Z(20.6+I*.04,21.6+I*.04,l)*K,J=l-At[I],Tt=J>0?Math.exp(-J*2.4):0;Ct[I]=Tt,Wt[I]=Ft[I]*pt*.5;for(let lt=0;lt<3;lt++)_[I][lt]=ft(N[I][lt]+vt[lt]*(1-Q),X[I][lt],Q);k.set(_[I],I*3),U[I*4]=ft(it[I]+Math.sin(l*.3+I)*.2,mt[I],Q),U[I*4+1]=(1-Q)*(V(I*9.1)-.5)*.4,U[I*4+2]=Ft[I]*pt*(1+.12*Tt),U[I*4+3]=Tt*pt}A.getAttribute("aPos").needsUpdate=!0,A.getAttribute("aRot").needsUpdate=!0,C.begin();const j=u.side(O.strip+St*.5);Mt.forEach(([I,Q,vt],pt)=>{if(vt===2){const Dt=Z(.6,1,E(I,l))*(.22+1.8*Ct[I])*K;if(Dt>.004){const ht=_[I],It=Y[I],ne=ht[1]-Wt[I];C.add(ht[0],ne,ht[2],It[0],It[1],It[2],1,.84,.55,Dt,1.1+1.6*Ct[I])}return}const J=vt===0,Tt=E(I,l),lt=E(Q,l),ut=J?Math.min(Tt,lt):Math.max(Tt,lt),Ge=nt((l-21-pt%7*.1)/.9),pe=J?0:Z(.04,.5,ut);if(Ge<=0||pe>=1)return;const Ut=[_[I][0],_[I][1]+Wt[I],_[I][2]],ue=[_[Q][0],_[Q][1]+Wt[Q],_[Q][2]],qe=J?Ct[Q]:0,bo=(J?1-ut:1)*(1+V(pt*2.1)*1.2)*(1-pe*.5)+(J?.02:.2),Le=(1-(J?ut:0))*.35;let Ue=Ut[0],De=Ut[1],Ke=Ut[2];for(let Dt=1;Dt<=L;Dt++){const ht=Dt/L,It=4*ht*(1-ht),ne=Math.sin(l*1.3+pt+ht*6)*Le*It,Oe=ft(Ut[0],ue[0],ht)+j[0]*ne,$e=ft(Ut[1],ue[1],ht)-bo*It+Math.sin(l*1.7+pt*2+ht*5)*Le*.5*It,Ee=ft(Ut[2],ue[2],ht)+j[2]*ne,Ao=J?.55+.9*ut:.42,ko=(J?.8+.4*ut:.6)*Ge*(1-pe)*(1+1.4*qe)*K;C.add(Ue,De,Ke,Oe,$e,Ee,1,J&&ut>.5?.86:.64,J&&ut>.5?.6:.32,ko*Ao,J?1.6+ut*1.2+qe*1.5:1.1),Ue=Oe,De=$e,Ke=Ee}}),C.end();const tt=G*Gt;if(z.begin(),G>-.5&&G<ae+1){const I=ie*xe*1.1/2+.8,Q=b(tt,-I,.08),vt=b(tt,I,.08);z.add(Q[0],Q[1],Q[2],vt[0],vt[1],vt[2],1,.86,.6,.95,2.6);const pt=b(tt,-I,3.2),J=b(tt,I,3.2);z.add(pt[0],pt[1],pt[2],J[0],J[1],J[2],1,.72,.4,.25,1.2);for(const Tt of[-I,I]){const lt=b(tt,Tt,.08),ut=b(tt,Tt,3.2);z.add(lt[0],lt[1],lt[2],ut[0],ut[1],ut[2],1,.72,.4,.35,1.2)}}z.end()},dispose(){for(const l of p)l.dispose()}}}const se=[31.1,32.3,33.4,34.4,35.3,36.1,36.8,37.4],ke=30.4;function ua(t){let e=0;for(let s=0;s<se.length;s++)t>=se[s]-.62&&(e=s+1);return t>=37.9&&(e=9),t>=ke?Math.max(1,e):0}const H={s:O.bin,c:0,w:6.4,d:4,h:1.9},st={s:O.bin,c:0,h:6.4},fa=`
attribute vec4 aA;
attribute vec4 aL;
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
  vI = vec4(aA.z, clamp(1. + s / .9, 0., 1.), k, step(0., s));
}`,da=`
uniform float uTime, uT; varying vec2 vUv; varying vec4 vI;
${Pt}
${Ht}
${Fe}
${bt}
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

    vec2 a = vec2(-.7, .42), b = vec2(.7, -.42);
    vec2 pa = q - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    float dl = length(pa - ba * min(h, vI.y)) - .018;
    float on = step(h, vI.y) * smoothstep(px * 2., -px, dl);
    col = mix(col, TW * 1.3, on * smoothstep(0., .2, vI.y));
  } else {

    vec2 g = (vUv - .5) * vec2(8., 5.);
    float d = abs(fract(g.x + g.y * 1.3) - .5) + abs(fract(g.x - g.y * 1.3) - .5);
    float lat = smoothstep(.05, .0, abs(d - .5) - .01);
    col = S(vec3(.03, .035, .05)) + TW * (lat * .35 + smoothstep(px * 3., 0., abs(dOut + .03)) * .6);
  }
  gl_FragColor = vec4(col, cov);
}`;function ma(t,e,s,o,f){const c=e.world,n=t.quality>0,p=[],u=Vt(o),b=u.tan(H.s),v=u.side(H.s),r=new jt;c.add(r);const M=(w,A,q)=>new dt(...u.at(w,A,q)),T=u.yawBack(H.s),y=se.length,B=new Float32Array(y*4),d=new Float32Array(y*4);for(let w=0;w<y;w++)B.set([se[w],.78+.1*V(w*3.3),1+w*2.9,1+w%2],w*4),d.set([(V(w*7.1)-.5)*3.4,(V(w*4.7)-.5)*1.8,(V(w*9.3)-.5)*2.2,.08+w*.045],w*4);const P=new yt(1,1),F=Lt(P,y,{aA:[B,4],aL:[d,4]}),R=new ot({uniforms:{uT:s.uT,uTime:s.uTime,uHook:{value:M(st.s,st.c,st.h)},uFloor:{value:M(H.s,H.c,.35)},uA:{value:new dt(...b)},uR:{value:new dt(...v)},uFace:{value:T}},vertexShader:fa,fragmentShader:da,side:gt,alphaToCoverage:n}),h=new et(F,R);h.frustumCulled=!1,r.add(h),p.push({dispose(){F.dispose(),P.dispose(),R.dispose()}});const x=zt(e.G,40,{decl:rt,fog:.003,order:5,body:"col.a *= litAt((A + B) * .5, 0., 1.);",uniforms:{uT:s.uT,uDir:s.uDir}});x.begin();const g=u.at(H.s,H.c,0),i=(w,A,q)=>[g[0]+v[0]*w+b[0]*q,A,g[2]+v[2]*w+b[2]*q];for(const[w,A,q,$,N,X]of qo(H.w,H.h,H.d,0,H.h/2,0)){const Y=i(w,A,q),it=i($,N,X);x.add(Y[0],Y[1],Y[2],it[0],it[1],it[2],1,.8,.52,.85,1.6)}x.end(),r.add(x.mesh),p.push(x);const S=new po(H.w,H.h,H.d),z=new ot({uniforms:{uInner:{value:1}},transparent:!0,depthWrite:!1,blending:_t,side:gt,vertexShader:"varying vec3 vN, vV; varying float vY; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); vY = position.y; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"varying vec3 vN, vV; varying float vY; void main(){ float f = pow(1. - abs(dot(normalize(vN), normalize(vV))), 2.2); float top = smoothstep(-1.15, 1.15, vY); gl_FragColor = vec4(vec3(1., .66, .34) * (f * .16 + .01) * (.5 + top), 1.); }"}),W=new et(S,z);W.position.set(g[0],H.h/2,g[2]),W.rotation.y=u.yawAlong(H.s),W.frustumCulled=!1,W.renderOrder=4,r.add(W),p.push({dispose(){S.dispose(),z.dispose()}});const L=new yt(H.w*1.5,H.d*1.7),a=new ot({uniforms:{uK:{value:0}},transparent:!0,depthWrite:!1,blending:_t,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform float uK; varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * 2.; float a = exp(-dot(q, q) * 2.6) * uK; gl_FragColor = vec4(vec3(1., .62, .3) * a * .5, 1.); }"}),m=new et(L,a);m.rotation.x=-Math.PI/2,m.position.set(g[0],.06,g[2]),m.rotation.z=-u.yawAlong(H.s),m.frustumCulled=!1,m.renderOrder=3,r.add(m),p.push({dispose(){L.dispose(),a.dispose()}});const C=Array.from({length:9},(w,A)=>we("v"+(A+1),{font:ee.mono,px:240,weight:700}));for(const w of C)w.mesh.rotation.y=T,w.mesh.visible=!1,w.mesh.renderOrder=8,w.mesh.frustumCulled=!1,r.add(w.mesh),p.push(w);const k=u.at(H.s+2.2,H.c-5,5.2),U=u.at(H.s,H.c,10.8);return{group:r,track:u,update(w){const A=w>26.5&&w<47;if(r.visible=A,!A)return;a.uniforms.uK.value=Z(30,33,w)*(.5+.5*nt((w-31)/7));const q=ua(w),$=f.tall?U:k;if(C.forEach((N,X)=>{N.mesh.visible=q===X+1}),q>0){const N=C[q-1],X=w-(q===9?37.9:se[q-1]-.62),Y=1+.28*Math.exp(-Math.max(X,0)*7),it=Z(ke-.3,ke+.2,w),mt=(f.tall?5.4:6)*Y;N.set(mt),N.mesh.position.set($[0],$[1]-.1*mt,$[2]),q===9?N.U.uColor.value.setRGB(1.5,1.4,1.15):N.U.uColor.value.setRGB(1.35,.82,.4),N.U.uAlpha.value=it}},dispose(){for(const w of p)w.dispose()}}}const Me=37.7,eo=38.4,Te=40.2,ha=50.2,Se=4,Re=O.gates[0],ze=41.2,qt=O.stop,Bt=ze+(qt-Re)/Se,Ie=3.7,xa=`
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

  float cells = mix(18., 600., smoothstep(.15, .8, fin));
  vec2 cuv = (floor(uv * cells) + .5) / cells;
  vec3 c = mapSample(mix(cuv, uv, smoothstep(.5, .85, fin)));
  float l = luma(c);
  vec3 rough = vec3(l) * vec3(.85, .95, 1.1) * (.72 + .28 * h12(floor(uv * cells) + floor(uTime * 9.)));
  vec3 col = mix(rough * .75, c, smoothstep(.12, .7, fin));
  col *= mix(.8, 1.08, fin);

  float bx = (uv.x - uSweep) * 5.;
  float band = exp(-bx * bx) * step(0., uSweep) * step(uSweep, 1.);
  col = col * (1. + (uFlash * .8 + band * .45) * (1. - fin * .4)) + vec3(1., .76, .46) * band * .05 * (1. - fin * .6);
  col += vec3(1., .78, .5) * uGlow * smoothstep(.0, .12, min(min(uv.x, 1. - uv.x), min(uv.y, 1. - uv.y))) * 0.;

  float w = px * 1.4;
  vec3 W = vec3(1., .86, .62);
  if (uGate.x > .01) {
    float a = rectL(uv, vec2(.45), w) + rectL(uv, vec2(.4), w) * .7;
    vec2 q = abs(uv - .5) - .45;
    float tick = step(abs(q.x), px * 14. / uAsp) * step(abs(q.y), px * 1.2) + step(abs(q.y), px * 14.) * step(abs(q.x), px * 1.2 / uAsp);
    float cx = step(abs(uv.x - .5), px * .8 / uAsp) * step(abs(uv.y - .5), px * 9.) + step(abs(uv.y - .5), px * .8) * step(abs(uv.x - .5), px * 9. / uAsp);
    col = mix(col, col * .6 + W * .0, uGate.x * .3) + W * (a * .8 + tick * .5 + cx * .5) * uGate.x;
  }
  if (uGate.y > .01) {
    vec2 g = uv * 3., id = floor(g), f = fract(g) - .5;
    float cell = smoothstep(px * 4., 0., max(abs(f.x), abs(f.y) * 1.) - .46 + px * 2.);
    float last = step(abs(id.x - 2.), .1) * step(abs(id.y - 2.), .1);
    float edge = smoothstep(px * 2.5, 0., abs(max(abs(f.x), abs(f.y)) - .47));
    col = mix(col, col * (.45 + .25 * h12(id + 3.)) + vec3(.02), uGate.y * (1. - last * .8));
    col += W * edge * (.35 + last * .9) * uGate.y;
  }
  if (uGate.z > .01) {
    float hw = .5625 / uAsp * .5;
    vec2 d = abs(uv - .5) - vec2(hw, .5);
    float inside = smoothstep(px * 2., -px * 2., max(d.x, d.y));
    col = mix(col, col * .4, uGate.z * (1. - inside));
    col += W * smoothstep(px * 2.4, 0., abs(max(d.x, d.y))) * .85 * uGate.z;
  }
  if (uGate.w > .01) {
    float bar = (1. - uAsp / 2.39) * .5;
    float barM = smoothstep(bar - px, bar + px, uv.y) * smoothstep(bar - px, bar + px, 1. - uv.y);
    col = mix(col, col * barM * .5, uGate.w * (1. - barM));
    float sq = rectL(uv, vec2(.5 / uAsp, .5), w);
    col = mix(col, col * barM, uGate.w * .0) + W * (smoothstep(px * 2., 0., abs(uv.y - bar)) + smoothstep(px * 2., 0., abs(1. - uv.y - bar))) * .7 * uGate.w + W * sq * .6 * uGate.w;
  }
  return col;
}`;function wo(t){const e=Vt(t),s=[{t:Me-.1,p:[st.s,0,st.h],l:[0,0,0],hold:!0},{t:eo,p:[st.s,0,st.h],l:[0,0,0],hold:!0},{t:eo+.85,p:[st.s+.9,0,st.h+2.1],l:[0,0,0]},{t:Te,p:[O.line,0,4.4],l:[0,0,0]},{t:ze,p:[Re,0,3],l:[0,0,0]},{t:ft(ze,Bt,.5),p:[ft(Re,qt,.5),0,3],l:[0,0,0]},{t:Bt,p:[qt,0,3.2],l:[0,0,0],hold:!0}],o=uo(s),f=new dt;return{path:o,tr:e,sch(c){const n=o(c).p;return[n.x,n.y,n.z]},sAt(c){return o(c).p.x},pos(c){const n=o(c).p,p=e.at(n.x,n.y,n.z);return f.set(p[0],p[1],p[2])}}}const ge=new URLSearchParams(location.search).has("svt")?Number(new URLSearchParams(location.search).get("svt")):null,oo=(()=>{const t=new Go(new Uint8Array([20,20,24,255]),1,1);return t.needsUpdate=!0,t})();function ga(t,e,s,o){const f=e.world,c=t.films.find(d=>d.id==="mk-voice");let n=t.viewport.portrait,p=je(t,c,n),u=He(c,n);p.prime();let b=null,v=!1;const r={tMap:{value:oo},uMapAsp:{value:u.clipAsp},uMapRaw:{value:0},uAsp:{value:u.clipAsp},uFin:{value:0},uFlash:{value:0},uSweep:{value:-1},uGlow:{value:0},uGate:{value:new vo}};function M(){b&&(f.remove(b.group),b.dispose());const d=u.clipAsp,P=d>=1?[1.6,1.6/d]:[1.6*d,1.6];b=Pe(s,{size:P,bezel:.02,msaa:t.quality>0,uniforms:r,decl:"",pic:xa,hl:new Nt(1,.66,.34)}),b.group.visible=!1,f.add(b.group),r.uAsp.value=d,r.uMapAsp.value=u.clipAsp}M();const T=wo(o),y=T.tr,B={pos:new dt,yaw:0,s:0,fin:0,size:1};return{get screen(){return b},track:y,pose:B,S_STOP:qt,sAt:d=>T.sAt(d),resize(){t.viewport.portrait!==n&&(n=t.viewport.portrait,p=je(t,c,n),u=He(c,n),p.prime(),M())},update(d,P,F,R){const h=b,x=d>Me-.2;h.group.visible=x;const g=ge!==null,i=p.frame(R&&!g),S=t.textures.video(u.clip);g?(S.video.paused||S.video.pause(),Math.abs(S.video.currentTime-ge)>.04&&(S.video.currentTime=ge)):!R&&v&&S.video.currentTime>.05&&(S.video.currentTime=0),v=R;const z=g?R&&S.video.readyState>=2:i.live,W=g&&z?{tex:S.texture,asp:u.clipAsp,live:z}:i;if(R&&W.live?(r.tMap.value=W.tex,r.uMapRaw.value=1,r.uMapAsp.value=W.asp):S.video.readyState>=2?(r.tMap.value=S.texture,r.uMapRaw.value=1,r.uMapAsp.value=u.clipAsp):(r.tMap.value=W.tex??oo,r.uMapRaw.value=W.live?1:0,r.uMapAsp.value=W.asp),e.U.tVid.value=W.tex??e.U.tVid.value,e.U.uVidAsp.value=W.asp,e.U.uVidRaw.value=W.live?1:0,!x)return B;const L=T.pos(d),a=T.sAt(d),m=y.yawBack(a);B.pos.copy(L),B.s=a;const C=$t(nt((d-Me)/.7)),k=Ie*(.18+.82*C);if(h.group.position.copy(L),B.yaw=m,F>0){let X=Math.atan2(P.x-L.x,P.z-L.z)-m;X=Math.atan2(Math.sin(X),Math.cos(X)),B.yaw=m+X*F}h.group.rotation.set(0,B.yaw,0),h.group.scale.setScalar(k/1.6),B.size=k;const U=O.panel0-1,w=O.panel0+O.pitch*(O.panels-1)+1.5;r.uFin.value=Math.min(1,d<Te?.1:a<U?.12+.1*Z(O.line,U,a):.22+.78*Z(U,w,a)),d>Bt&&(r.uFin.value=1);const A=r.uGate.value;O.gates.forEach((N,X)=>{const Y=Math.abs(a-N)/Se,it=nt(1-Y/.46),mt=.55+.45*(Math.floor(d*14+X*3)%2===0?1:.35);A.setComponent(X,a<N-5||a>N+5?0:Z(0,.25,it)*mt)});let q=0,$=-1;for(let N=0;N<O.panels;N++){const X=O.panel0+N*O.pitch,Y=(a-X)/Se;q=Math.max(q,Math.exp(-Y*Y*16)),Y>-.3&&Y<.55&&($=(Y+.3)/.85)}return r.uFlash.value=d<Te?0:q,r.uSweep.value=$,B},dispose(){b&&b.dispose()}}}const Kt=5.2,te=7.6,wa=`
${We}
attribute vec3 aP;
uniform float uKs, uHalfW, uHeight, uT;
varying vec2 vUv; varying vec4 vI; varying vec3 vN; varying vec3 vV;
void main(){
  float s = aP.x, kind = aP.y;
  vec3 w;
  float depth = .55;
  if (kind < 1.5) {
    float side = kind < .5 ? -1. : 1.;
    w = trackAt(s + position.y * depth, side * (uHalfW - .02), 2.65 + position.x * 3.5);
  } else {
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
${bt}
void main(){
  if (dot(vN, vV) < 0.) discard;
  vec2 q = (vUv - .5) * 2.;
  float h = abs(q.x), a = abs(q.y);

  float face = smoothstep(1., .86, h) * smoothstep(1., .5, a);
  float core = exp(-a * a * 7.) * smoothstep(1., .92, h);
  float frame = smoothstep(1., .96, max(h, a)) * (1. - smoothstep(.96, .86, max(h, a)));
  float lit = .02 + .06 * vI.y + 1.1 * vI.x;
  float up = vI.w < 1.5 ? mix(.6, 1., vUv.x) : 1.;
  vec3 hot = mix(TA, vec3(1., .9, .74), clamp(vI.x * .9 + vI.y * .3, 0., 1.));
  gl_FragColor = vec4(hot * lit * (face * .55 + core * .75) * up + TW * frame * (.05 + .25 * vI.x), 1.);
}`;function ao(t,e,s,o,f){const c=e.world,n=[],p=f.tall?1.85:3,u=Vt(o),b=new jt;c.add(b);const v=(a,m,C)=>u.at(a,m,C),r=zt(e.G,2600,{decl:rt,fog:.003,order:5,body:"col.a *= litAt(vec3((A.x + B.x) * .5, 0., (A.z + B.z) * .5), .0, 1.);",uniforms:{uT:s.uT,uDir:s.uDir}});r.begin();const M=(a,m,C,k=1,U=[1,.78,.52])=>r.add(a[0],a[1],a[2],m[0],m[1],m[2],U[0],U[1],U[2],C,k),T=(a,m,C,k,U,w)=>{const A=[v(a,-m,C),v(a,m,C),v(a,m,k),v(a,-m,k)];for(let q=0;q<4;q++)M(A[q],A[(q+1)%4],U,w)},y=(a,m,C,k,U,w=1,A)=>{const q=Math.max(1,Math.ceil((m-a)/1.2));for(let $=0;$<q;$++)M(v(a+(m-a)*$/q,C,k),v(a+(m-a)*($+1)/q,C,k),U,w,A)};O.gates.forEach(a=>{T(a,p+.5,0,Kt+.4,.85,1.8),T(a+.18,p+.35,0,Kt+.25,.4,1)});for(let a=0;a<O.panels;a++)T(O.panel0+a*O.pitch,p,0,Kt,.22,1);const B=O.gates[0]-1.5,d=O.end+1;for(const[a,m,C]of[[-p,0,.3],[p,0,.3],[-p,Kt,.3],[p,Kt,.3],[-1.4,0,.16],[1.4,0,.16]])y(B,d,a,m,C);y(st.s-2.5,O.stop+.5,0,te,.9,2,[1,.84,.6]),y(st.s-2.5,O.stop+.5,0,te+.18,.35,1);for(let a=st.s;a<O.stop;a+=6)M(v(a,0,0),v(a,0,te),.22,1);const P=O.stop+.5,F=te+1.8,R=5.6;for(const a of[-R,R]){M(v(P,a,0),v(P,a,F),.8,2),M(v(P+.5,a,0),v(P+.5,a,F),.45,1),M(v(P,a,0),v(P+.5,a,0),.5,1),M(v(P,a,F),v(P+.5,a,F),.6,1);for(let m=0;m<F-1;m+=1.6)M(v(P,a,m),v(P+.5,a,m+1.6),.25,1)}M(v(P,-R,F),v(P,R,F),.95,2.4),M(v(P+.5,-R,F),v(P+.5,R,F),.5,1.2);for(let a=-R;a<R-.1;a+=1.4)M(v(P,a,F),v(P+.5,a+1.4,F),.22,1);r.end(),b.add(r.mesh),n.push(r);const h=zt(e.G,16,{fog:.003,order:6});b.add(h.mesh),n.push(h);const x=O.panels*4,g=new Float32Array(x*3);for(let a=0;a<O.panels;a++)for(let m=0;m<4;m++)g.set([O.panel0+a*O.pitch,m,(a*4+m)*.37],(a*4+m)*3);const i=new yt(1,1),S=Lt(i,x,{aP:[g,3]}),z={value:0},W=new ot({uniforms:{uT:s.uT,uTrk:s.uTrk,uKs:z,uHalfW:{value:p},uHeight:{value:Kt}},vertexShader:wa,fragmentShader:ya,transparent:!0,depthWrite:!1,blending:_t,side:gt}),L=new et(S,W);return L.frustumCulled=!1,L.renderOrder=5,b.add(L),n.push({dispose(){S.dispose(),i.dispose(),W.dispose()}}),{group:b,track:u,portal:v(P,0,F),update(a,m,C,k,U){const w=a>28&&a<61;if(b.visible=w,!w)return;z.value=k?m:-50,h.begin();const A=k?m:st.s,q=a>U?v(P,0,F):v(A,0,te),$=k?C:v(st.s,0,st.h+1.2),N=u.side(A);h.add(q[0],q[1],q[2],$[0],$[1],$[2],1,.84,.6,.8,1.2),h.add(q[0]-N[0]*.5,q[1]+.15,q[2]-N[2]*.5,q[0]+N[0]*.5,q[1]+.15,q[2]+N[2]*.5,1,.84,.6,.95,5),h.end()},dispose(){for(const a of n)a.dispose()}}}const so=50.4,ba=54,Aa=54,ka=57.2,no=60,Ma=3.2;function yo(t,e,s){const o=Vt(t),f=o.at(qt,0,Ma),c=o.tan(qt),n=[-c[0],0,-c[2]],p=o.side(qt),u=Z(Bt-.2,so+1.8,s),b=Z(so,ba,s),v=Math.tan(e.fov*wt/2),r=e.tall?e.keeperW*e.keeperAsp/2:e.keeperW/2,M=e.tall?e.keeperW/2:e.keeperW/e.keeperAsp/2,T=Math.min(M/v,r/(e.aspect*v)),y=Z(Aa,ka,s),B=-t*(8+80*b)*wt,d=ft(ft(6.4,8.6,u),9.4,b)*(1-y)+T*y,P=ft(ft(1.3,2.6,u),3.6,b)*(1-y)+0*y,F=B*1,R=[n[0]*Math.cos(F)+p[0]*Math.sin(F),0,n[2]*Math.cos(F)+p[2]*Math.sin(F)],h=[f[0]+R[0]*d,f[1]+P,f[2]+R[2]*d],x=[f[0],f[1]+(1-y)*(.2+2.5*u),f[2]];return{pos:h,look:x,K:f,alpha:B}}function lo(t,e,s,o,f){const c=t.lang==="ar",n=e.world,p=[],u=B=>c?Po(String(B)):String(B),b=[{n:u(fe.count),w:c?"فيلماً":"films",at:51},{n:u(fe.chapters),w:c?"فصلاً":"chapters",at:52.3},{n:u(fe.minutes),w:c?"دقيقة":"minutes",at:53.6}],v=new jt;n.add(v);const r=f.tall,M=r?15:24,T=r?11.5:12.5,y=33;return b.forEach(B=>{const d=yo(o,f,B.at),P=d.K[0]-d.pos[0],F=d.K[2]-d.pos[2],R=d.pos[0],h=d.pos[2],x=P*P+F*F,g=2*(R*P+h*F),i=R*R+h*h-y*y,S=(-g+Math.sqrt(Math.max(g*g-4*x*i,0)))/(2*x),z=R+P*S,W=h+F*S,L=9.4,a=new jt;a.position.set(z,L,W),a.lookAt(0,L,0);const m=new ot({uniforms:{uA:{value:0},uBox:{value:new ro(M,T)}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform float uA; uniform vec2 uBox; varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * uBox; vec2 d = abs(q) - uBox * .5 + 1.4; float sd = length(max(d, 0.)) + min(max(d.x, d.y), 0.) - 1.4; float a = smoothstep(.7, -.7, sd) * .86; float rim = smoothstep(.12, 0., abs(sd + .35)) * .0 + smoothstep(.07, 0., abs(abs(q.y) - uBox.y * .5 + .6)) * smoothstep(uBox.x * .5, uBox.x * .5 - 2., abs(q.x)) * .55; gl_FragColor = vec4(vec3(1., .74, .46) * rim * uA, a * uA); }"}),C=new et(new yt(M,T),m);C.renderOrder=9,C.frustumCulled=!1,a.add(C);const k=we(B.n,{font:c?ee.ar:ee.sans,px:300,weight:700,color:new Nt(1,.86,.6),rtl:c,align:"center",fog:0});k.set(T*.56),k.mesh.position.set(0,T*.1,.05),k.mesh.renderOrder=10;const U=we(B.w,{font:c?ee.ar:ee.mono,px:160,weight:c?600:500,color:new Nt(1,.62,.32),rtl:c,align:"center",fog:0});U.set(T*.17),U.mesh.position.set(0,-T*.31,.05),U.mesh.renderOrder=10,a.add(k.mesh,U.mesh),v.add(a),p.push({dispose(){k.dispose(),U.dispose(),C.geometry.dispose(),m.dispose()}}),a.userData={mat:m,nm:k,wd:U,at:B.at}}),{group:v,update(B){const d=B>49.5;if(v.visible=d,!!d)for(const P of v.children){const F=P.userData,R=Z(F.at-.95,F.at-.4,B)*(1-Z(F.at+.35,F.at+.95,B));F.mat.uniforms.uA.value=R,F.nm.U.uAlpha.value=R,F.wd.U.uAlpha.value=R,P.visible=R>.002}},dispose(){for(const B of p)B.dispose()}}}const Ta=29.2;function Sa(t){const e=Math.min(1,Math.max(0,(1.5-t)/1));return 46+18*e*e*(3-2*e)}function Ra(t,e){const s=Math.tan(e*wt/2),o=Math.min(.4,.43*t);return{dist:.8/(2*s*o),lift:.045*2*(.8/(2*s*o))*s}}function co(t,e){const s=(i,S,z)=>at(e,i,S,z),o=Ra(t.aspect,t.fov),f=Rt.y-o.lift,c=Rt.r-o.dist,n=(i,S,z,W={})=>({t:i,p:S,l:z,fov:t.fov,...W}),p=Ae(e,t),u=(i,S,z)=>[p.G[0]+p.N[0]*i+p.R[0]*S,z,p.G[2]+p.N[2]*i+p.R[2]*S],b=(i,S)=>[p.G[0]+p.R[0]*i,S,p.G[2]+p.R[2]*i],v=t.tall?0:-2*e,r=p.G[1],M=t.tall?4.5:0,T=Vt(e),y=(i,S,z)=>T.at(i,S,z),B=[];for(let i=oa;i<=Ta+.01;i+=.6)B.push(n(i,y(sa(i),0,go(i)),na(T,i)));const d=(i,S=0)=>y(O.bin,0,i+S),P=t.tall?[n(31.2,y(31.6,0,6.6),d(5.6)),n(34.5,y(32.2,0,6.5),d(6.2)),n(37.4,y(33.6,0,6.6),d(6.8)),n(39,y(36,0,6.8),y(O.bin+4.5,0,6.6))]:[n(31.2,y(31.8,0,5.8),d(3)),n(34.5,y(32.6,0,5.4),d(3.4)),n(37.4,y(34,0,5.4),d(4.4)),n(39,y(36.2,0,6),y(O.bin+4,0,7.2))],F=wo(e),R=[];for(let i=40.4;i<=Bt-.39;i+=.8){const S=F.sAt(i),z=F.pos(i);R.push(n(i,y(S-6.4,ft(.35,-.9,Z(40.4,Bt,i)),4.7),[z.x,z.y+.2,z.z]))}const h={aspect:t.aspect,fov:t.fov,tall:t.tall,keeperW:Ie,keeperAsp:t.tall?9/16:16/9},x=[];for(let i=Bt;i<=no+.001;i+=.4){const S=yo(e,h,Math.min(i,no));x.push(n(i,S.pos,S.look))}const g=[n(0,s(c,0,f),s(Rt.r,0,f),{hold:!0}),n(1.5,s(c,0,f),s(Rt.r,0,f),{hold:!0}),n(3.6,s(30,-1,3.4),s(40,1,3.6+M*.5)),n(5.4,s(15.5,-3,6),s(41,3,7.4+M)),n(6.7,s(13.8,4,9),s(33,9,17.5+M*.5)),n(7.5,s(13.5,9,9.8),s(31,14,20+M*.6)),n(8.4,s(13.1,16,10.5),s(34,32,13.5+M*.3)),n(9.2,s(12.5,26,11),s(34,46,12.5)),...t.tall?[n(11,u(12.5,0,r+1.5),b(0,r+5)),n(14.5,u(11.5,0,r+0),b(0,r+2.6)),n(17.6,u(10.5,0,r-2.2),b(0,r-1.6))]:[n(11,u(16.5,0,r-.6),b(v,r+.3)),n(14.6,u(15.5,0,r-.4),b(v,r+.2)),n(17.6,u(14.8,0,r+.2),b(v,r+.6))],...B,...P,...R,...x];return{at:uo(g),camR:c,camY:f}}const za=`
uniform float uBloom; uniform vec3 uBloomTint;
vec3 look(vec2 uv){
  vec3 c = samp(uv);
  c += bloom(uv) * uBloom * uBloomTint;
  return c;
}`;async function Ua(t){const e=t.lang==="ar"?-1:1;await To(zo);const s={uBloom:{value:.5},uBloomTint:{value:new dt(.6,.8,1.15)}},o=So(t,{pin:"B",pout:"C",msaa:!0,inW:.025,outW:.04,uniforms:s,frag:za}),f=Ko(o.G,e),c={tall:t.viewport.portrait,aspect:t.viewport.aspect,fov:46},n=new Ne(46,t.viewport.aspect,.1,400),p=()=>({aspect:c.aspect,fov:c.fov,tall:c.tall,keeperW:Ie,keeperAsp:c.tall?9/16:16/9}),u=Ho(t,o,f,e),b=Zo(t,o,f),v=ea(t,o,f,e,c);let r=to(t,o,f,e,c);const M=ma(t,o,f,e,c),T=ga(t,o,f,e);let y=ao(t,o,f,e,c),B=lo(t,o,f,e,p()),d=co(c,e),P=c.tall;const F=()=>{c.aspect=t.viewport.aspect,c.tall=t.viewport.portrait,c.fov=Sa(c.aspect),n.aspect=c.aspect,n.fov=c.fov,n.updateProjectionMatrix(),d=co(c,e),T.resize(),P!==c.tall&&(B.dispose(),o.world.remove(B.group),B=lo(t,o,f,e,p()),y.dispose(),o.world.remove(y.group),y=ao(t,o,f,e,c),r.dispose(),o.world.remove(r.group),r=to(t,o,f,e,c),P=c.tall)};F(),await o.warm(n);const R=new URLSearchParams(location.search),h=R.has("sT")?Number(R.get("sT")):null,x={raw:R.has("sraw")?Number(R.get("sraw"))||1:0},g=R.get("sc")?.split(":").map(Number),i=new Ne;return R.has("sdbg")&&(window.__studio={st:o,hall:u,cloud:b,ways:v,web:r,takes:M,keeper:T,tunnel:y,counts:B,camera:n,S:f,qa:x,at(S){d.at(S,i);const z=new dt;return i.getWorldDirection(z),[i.position.x,i.position.y,i.position.z,z.x,z.y,z.z,i.fov]}}),{scene:o.scene,camera:n,update({p:S,t:z,dt:W,v:L}){const a=S*Fo.studio;o.tick(z,L),o.setP(S),x.raw===1?o.U.uPin.value=o.U.uPout.value=0:x.raw===2&&(o.U.uPin.value=0,o.U.uPout.value=1),f.uT.value=h??a,d.at(a,n);const m=Ro(t,z,W),C=Math.min(1,Math.max(0,Math.min(S-.03,.88-S)*14));n.translateX(m.x*.35*C),n.translateY(m.y*.2*C),n.updateMatrixWorld(),g&&(n.position.set(g[0],g[1],g[2]),n.lookAt(g[3],g[4],g[5]),g[6]&&(n.fov=g[6],n.updateProjectionMatrix()),n.updateMatrixWorld()),u.lens(t.viewport.height,n.fov),u.m0.U.uWipe.value=Z(1.2,3.4,a);const k=Z(1.5,5.5,a),U=1-Z(54.6,57,a);s.uBloom.value=(.5+.45*k)*U,s.uBloomTint.value.set(.6+.4*k,.8+.2*k,1.15-.15*k),v.update(a,n.position),r.update(a),M.update(a);const w=$t(nt((a-50.6)/2.4)),A=T.update(a,n.position,w,a>=ha),q=c.tall?A.size/2:A.size/(16/9)/2;y.update(a,A.s,[A.pos.x,A.pos.y+q+.15,A.pos.z],a>37.5,Bt),B.update(a),o.draw(n)},resize(){o.resize(),F()},dispose(){u.dispose(),b.dispose(),v.dispose(),r.dispose(),M.dispose(),T.dispose(),y.dispose(),B.dispose(),o.dispose()}}}export{Ua as default};
