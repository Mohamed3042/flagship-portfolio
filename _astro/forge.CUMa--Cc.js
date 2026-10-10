import{a as ee,al as Ee,a9 as fe,t as He,s as zt,V as B,i as de,aH as Zt,ao as Ke,aq as Rt,M as b,Z as te,G as Ie,at as pt,au as Jt,as as eo,X as T,av as to,j as Se,a0 as kt,a1 as Tt,ae as Pt,aF as oo,P as ao,a3 as no,D as Ce,_ as xe,Y as ft,a_ as so,d as io,a6 as s,aL as z,o as E,r as _,p as ro}from"./EditionWorld.astro_astro_type_script_index_0_lang.DKyZ0HWE.js";import{f as lo,s as co,k as uo,r as vo,F as dt,d as mt,l as po,c as fo,p as mo,O as be,S as ho}from"./plan.Bx2_yuUR.js";import{b as go}from"./brush.DZUCRkru.js";import{d as wo,a as yo,c as ht,f as gt,r as wt,m as xo}from"./forge-geo.DSoDvLxe.js";import{p as yt}from"./puffs.C0Gkyoc2.js";import"./preload-helper.4QTdcD_W.js";import"./BufferGeometryUtils.7-H983-K.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const $=12;function bo(o){const m=te(o.seed),p=o.count,v=new ee(1,1),a=new Ee;a.index=v.index,a.setAttribute("position",v.getAttribute("position")),a.instanceCount=p;const i=new Float32Array(p),n=new Float32Array(p*4);for(let d=0;d<p;d++){i[d]=d%$;for(let w=0;w<4;w++)n[d*4+w]=m()}a.setAttribute("aB",new fe(i,1)),a.setAttribute("aR",new fe(n,4));const c=o.face??{y:1,cx:0,hx:1.1,hz:.6},l={uBT:{value:new Array($).fill(-99)},uBP:{value:Array.from({length:$},()=>new B)},uBS:{value:new Array($).fill(1)},uT:{value:0},uRes:{value:new zt(1,1)},uPx:{value:1},uFace:{value:new He(c.y,c.cx,c.hx,c.hz)},uGain:{value:1}},h=new de({transparent:!0,depthWrite:!1,blending:Rt,blendSrc:Ke,blendDst:Ke,blendEquation:Zt,uniforms:l,vertexShader:`
      attribute float aB; attribute vec4 aR;
      uniform float uBT[${$}], uBS[${$}]; uniform vec3 uBP[${$}]; uniform vec4 uFace; uniform float uT, uPx; uniform vec2 uRes;
      varying float vK; varying vec2 vQ;
      const float G = 14.;
      vec3 fly(float t, vec3 p0, vec3 v0){
        float th = (v0.y + sqrt(max(v0.y * v0.y + 2. * G * (p0.y - uFace.x), 0.))) / G;
        vec3 land = p0 + vec3(v0.x, 0., v0.z) * th;
        bool onFace = abs(land.x - uFace.y) < uFace.z && abs(land.z) < uFace.w;
        if (t < th || !onFace) return vec3(p0.x + v0.x * t, p0.y + v0.y * t - .5 * G * t * t, p0.z + v0.z * t);
        vec3 p = vec3(land.x, uFace.x, land.z), v = vec3(v0.x * .72, -(v0.y - G * th) * .42, v0.z * .72); t -= th;
        float t2 = 2. * v.y / G;
        if (t < t2) return vec3(p.x + v.x * t, p.y + v.y * t - .5 * G * t * t, p.z + v.z * t);
        p = vec3(p.x + v.x * t2, uFace.x, p.z + v.z * t2); v = vec3(v.x * .7, v.y * .4, v.z * .7); t -= t2;
        return vec3(p.x + v.x * t, p.y + v.y * t - .5 * G * t * t, p.z + v.z * t);
      }
      void main(){
        int b = int(aB);
        float age = uT - uBT[b], life = .7 + aR.w * 1.4;
        vK = clamp(age / life, 0., 1.);
        if (age < 0. || age > life) {gl_Position = vec4(2., 2., 2., 1.); return;}
        float sp = (3. + aR.x * 7.) * uBS[b], az = aR.y * 6.2832, up = .25 + aR.z * 1.15;
        vec3 v0 = vec3(cos(az) * sp * (1. - .35 * up), (1. + up * 3.1) * (.7 + .45 * uBS[b]), sin(az) * sp * (1. - .35 * up) * .32);
        vec3 pos = fly(age, uBP[b], v0), prev = fly(max(age - .045, 0.), uBP[b], v0);
        vec4 c0 = projectionMatrix * viewMatrix * vec4(pos, 1.), c1 = projectionMatrix * viewMatrix * vec4(prev, 1.);
        if (c0.w < 1.2 || c1.w < 1.2) {gl_Position = vec4(2., 2., 2., 1.); return;}   // a spark that flies past the lens is gone
        vec2 s0 = c0.xy / c0.w, s1 = c1.xy / c1.w, dpx = (s0 - s1) * uRes * .5;
        float len = min(length(dpx), 160. * uPx), L = len + 3. * uPx * (1. - vK * .5);
        vec2 dir = len > .01 ? dpx / len : vec2(1., 0.), perp = vec2(-dir.y, dir.x);
        float w = (1.3 + 1.6 * aR.z) * uPx * (1. - vK * .6);
        vec2 off = (dir * (position.x * L - L * .5) + perp * position.y * w * 2.) / (uRes * .5);
        vQ = position.xy;
        gl_Position = vec4((s0 + off) * c0.w, c0.z, c0.w);
      }`,fragmentShader:`
      uniform float uGain; varying float vK; varying vec2 vQ;
      vec3 bb(float t){ vec3 c = mix(vec3(.4, .02, 0.), vec3(1., .26, .02), smoothstep(.05, .45, t)); c = mix(c, vec3(1., .62, .14), smoothstep(.45, .75, t)); return mix(c, vec3(1., .95, .78), smoothstep(.75, 1., t)); }
      void main(){
        float along = clamp(vQ.x + .5, 0., 1.), body = pow(along, 2.2), across = 1. - smoothstep(.0, .5, abs(vQ.y));
        float heat = 1. - vK, a = body * across * smoothstep(1., .55, vK) * (.3 + .7 * heat);
        gl_FragColor = vec4(bb(heat * heat * 1.1 + .06) * a * 3.2 * uGain, 0.);
      }`}),u=new b(a,h);u.frustumCulled=!1,u.renderOrder=20;let M=0;return{mesh:u,U:l,fire(d,w,R=1){const G=M++%$;l.uBT.value[G]=d,l.uBP.value[G].copy(w),l.uBS.value[G]=R},set(d,w,R,G=1){l.uBT.value[d]=w,l.uBP.value[d].copy(R),l.uBS.value[d]=G},tick(d,w,R,G){l.uT.value=d,l.uRes.value.set(w*G,R*G),l.uPx.value=G*Math.max(.7,R/760)},dispose(){a.dispose(),h.dispose()}}}const ve=8,xt=40;function So(o=31){const m=te(o),p=ve*xt,v=new ee(1,1),a=new Ee;a.index=v.index,a.setAttribute("position",v.getAttribute("position")),a.instanceCount=p;const i=new Float32Array(p),n=new Float32Array(p*4);for(let u=0;u<p;u++){i[u]=Math.floor(u/xt);for(let M=0;M<4;M++)n[u*4+M]=m()}a.setAttribute("aB",new fe(i,1)),a.setAttribute("aR",new fe(n,4));const c={uBT:{value:new Array(ve).fill(-99)},uBP:{value:Array.from({length:ve},()=>new B)},uT:{value:0}},l=new de({transparent:!0,depthWrite:!1,uniforms:c,vertexShader:`
      attribute float aB; attribute vec4 aR;
      uniform float uBT[${ve}]; uniform vec3 uBP[${ve}]; uniform float uT;
      varying vec2 vQ; varying float vK; varying float vS;
      void main(){
        int b = int(aB);
        float age = uT - uBT[b], life = 1.2 + aR.x * 1.3;
        vK = clamp(age / life, 0., 1.); vS = aR.w; vQ = position.xy;
        if (age < 0. || age > life) {gl_Position = vec4(2., 2., 2., 1.); return;}
        float sp = .8 + aR.y * 2.3, az = aR.z * 6.2832;
        vec3 v0 = vec3(cos(az) * sp, 1.1 + aR.w * 2.8, sin(az) * sp * .5);
        vec3 p = uBP[b] + v0 * age + vec3(0., -5.5 * age * age, 0.);
        vec4 vp = viewMatrix * vec4(p, 1.);
        vp.xy += position.xy * (.03 + .04 * aR.x);   // a flake is a small disc facing the camera
        gl_Position = projectionMatrix * vp;
      }`,fragmentShader:`
      varying vec2 vQ; varying float vK; varying float vS;
      void main(){
        float r = length(vQ * vec2(1., .6 + .4 * vS));
        if (r > .5) discard;
        vec3 scale = vec3(.12, .105, .095) * (.7 + .5 * vS);
        float hot = exp(-vK * 3.2);                                        // fresh flakes glow orange, then cool to grey
        vec3 col = mix(scale, vec3(1., .4, .08) * 1.25, hot * .85) + vec3(1., .85, .6) * hot * hot * .6;
        gl_FragColor = vec4(col, 1. - smoothstep(.62, 1., vK));
      }`}),h=new b(a,l);return h.frustumCulled=!1,h.renderOrder=19,{mesh:h,U:c,set(u,M,d){c.uBT.value[u]=M,c.uBP.value[u].copy(d)},tick(u){c.uT.value=u},dispose(){a.dispose(),l.dispose()}}}const Mo=`
uniform vec4 uShim, uShimF; uniform float uShimA, uShimFA;
vec3 sceneColor(vec2 uv){
  vec2 d = (uv - uShim.xy) / max(uShim.zw, vec2(1e-3));
  float m = smoothstep(1.15, .15, length(d)) * uShimA;
  vec2 e = (uv - uShimF.xy) / max(uShimF.zw, vec2(1e-3));
  float mf = smoothstep(1.25, .1, length(e)) * uShimFA;
  float w = sin(uv.y * 170. - uTime * 11.) * .5 + sin(uv.x * 91. + uv.y * 40. - uTime * 7.3) * .5;
  float w2 = sin(uv.y * 210. - uTime * 19.) * .5 + sin(uv.x * 140. + uv.y * 30. - uTime * 13.) * .5;
  vec2 q = uv + vec2(w * .0026, sin(uv.y * 60. - uTime * 5.) * .002) * m + vec2(w2 * .0062, w2 * .0030 - .0016) * mf;
  return samp(q);
}`,Le=new B(-4.6,0,-2.6),zo=.42,bt=new B(0,1.2,0);function Ft(o=512,m=21){const p=document.createElement("canvas");p.width=p.height=o;const v=p.getContext("2d"),a=te(m);v.fillStyle="#0a0706",v.fillRect(0,0,o,o);const i=11,n=o/i;for(let h=0;h<i;h++){let u=-a()*o*.3;const M=h*n+(a()-.5)*3;for(;u<o;){const d=o*(.11+a()*.12),w=20+a()*26;v.fillStyle=`rgb(${w*1.25|0},${w*.8|0},${w*.64|0})`,v.fillRect(u+3+a()*3,M+3+a()*2,d-6-a()*4,n-6-a()*3);for(let R=0;R<26;R++)v.fillStyle=`rgba(0,0,0,${a()*.5})`,v.fillRect(u+a()*d,M+a()*n,2+a()*9,1+a()*4);a()>.72&&(v.fillStyle=`rgba(110,80,55,${a()*.14})`,v.fillRect(u+a()*d,M+a()*n,3+a()*8,2+a()*4)),u+=d}}const c=v.createLinearGradient(0,0,0,o);c.addColorStop(0,"rgba(0,0,0,.4)"),c.addColorStop(1,"rgba(0,0,0,0)"),v.fillStyle=c,v.fillRect(0,0,o,o);const l=new kt(p);return l.colorSpace=Tt,l.wrapS=l.wrapT=Pt,l.anisotropy=4,l}function St(o){return o.moveTo(-.8,-.3),o.lineTo(.8,-.3),o.lineTo(.8,1.9),o.absarc(0,1.9,.8,0,Math.PI,!1),o.lineTo(-.8,-.3),o}const Ro=`
uniform float uT, uGain; varying vec2 vP;
float fh(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 fh2(vec2 p){ return vec2(fh(p), fh(p + 19.19)); }
float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(fh(i), fh(i + vec2(1., 0.)), f.x), mix(fh(i + vec2(0., 1.)), fh(i + vec2(1., 1.)), f.x), f.y); }
float fb(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * fn(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
vec3 heat(float t){
  vec3 c = vec3(0.);
  c = mix(c, vec3(.36, .018, .005), smoothstep(.1, .22, t));
  c = mix(c, vec3(.9, .1, .02), smoothstep(.24, .4, t));
  c = mix(c, vec3(1., .4, .07), smoothstep(.4, .56, t));
  c = mix(c, vec3(1., .74, .26), smoothstep(.56, .74, t));
  c = mix(c, vec3(1., .95, .8), smoothstep(.74, .9, t));
  c = mix(c, vec3(1., .99, .97), smoothstep(.9, 1.04, t));
  return c * smoothstep(.08, .2, t);
}
void main(){
  vec2 p = vP - vec2(0., 1.2);
  float r = length(vec2(p.x / .9, p.y / 1.3));                              // 0 at the middle of the opening, 1 at its rim
  // coal lumps: irregular cells that drift up. Each lump is hot in its middle and cools to a dark crust at its edge.
  vec2 g = vec2(p.x * 8.5, (p.y + uT * .16) * 7.);
  vec2 i = floor(g), f = fract(g);
  float lump = 0., glow = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y)), id = i + o;
    vec2 c = o + .15 + .7 * fh2(id);
    float rad = .3 + .3 * fh(id + 4.1);
    float d = length(f - c) / rad + .35 * (fn(f * 3. + id) - .5);   // ragged edges: irregular lumps, not beads
    float bright = .45 + .55 * fh(id + 9.7);
    float m = 1. - smoothstep(.5, 1., d);
    lump = max(lump, m * bright);
    glow = max(glow, m * bright * (1. - .6 * d));
  }
  float core = exp(-r * r * 1.6);
  float crack = fb(vec2(p.x * 4., p.y * 3. - uT * 1.2));
  float flick = .9 + .07 * sin(uT * 17. + crack * 8.) + .05 * sin(uT * 29.);
  float t = clamp(.1 + .2 * lump + .6 * glow + .34 * core * glow - .35 * smoothstep(.75, 1.3, r) + .1 * crack, 0., 1.);
  vec3 col = heat(t) * (.5 + .9 * core * glow + .25 * lump) * flick * uGain;
  gl_FragColor = vec4(col, 1.);
}`;function ko(){const o=new Ie;o.position.copy(Le),o.rotation.y=zo,o.name="forge-mouth";const m=new pt;m.moveTo(-1.8,-2),m.lineTo(1.8,-2),m.lineTo(1.8,3.2),m.lineTo(-1.8,3.2),m.closePath(),m.holes.push(St(new Jt));const p=Ft(512,12);p.repeat.set(1/2.6,1/2.6);const v=new eo(m,{depth:.9,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:3,curveSegments:16});v.translate(0,0,-.45);const a=new b(v,new T({map:p,color:"#ffffff",roughness:.97,metalness:0,envMapIntensity:0}));o.add(a);const i=new de({uniforms:{uT:{value:0},uGain:{value:1}},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ro}),n=new b(new to(St(new pt),28),i);n.position.z=-.2,n.renderOrder=2,o.add(n);const c=new Se("#ff8a3c",0,7,2);c.position.copy(bt).add(new B(0,.3,1.1)).applyEuler(o.rotation).add(Le);const l=bt.clone().applyEuler(o.rotation).add(Le);return{group:o,light:c,centre:l,uT:i.uniforms.uT,uGain:i.uniforms.uGain,dispose(){v.dispose(),a.material.dispose(),p.dispose(),n.geometry.dispose(),i.dispose()}}}function To(o,m,p=3){const v=te(p),a=new ee(1,1),i=new Ee;i.index=a.index,i.setAttribute("position",a.getAttribute("position")),i.instanceCount=o;const n=new Float32Array(o*4);for(let u=0;u<o*4;u++)n[u]=v();i.setAttribute("aR",new fe(n,4));const c={uT:{value:0},uStart:{value:0},uFade:{value:0},uHeat:{value:0},uOrigin:{value:m.clone()}},l=new de({transparent:!0,depthWrite:!1,blending:Rt,blendSrc:Ke,blendDst:oo,uniforms:c,vertexShader:`
      attribute vec4 aR; uniform float uT, uStart, uFade; uniform vec3 uOrigin;
      varying vec2 vUv; varying float vK, vH, vA, vS;
      void main(){
        float life = 8. + aR.x * 3., age = uT - uStart - aR.y * 3.;
        vK = clamp(age / life, 0., 1.); vS = aR.z * 31. + aR.w * 17.;
        if (age < 0. || age > life || uFade <= 0.) {gl_Position = vec4(2., 2., 2., 1.); return;}
        // an eruption, then a slow climb: the top of the column stays inside the frame
        float up = (1. - exp(-age * .9)) * 1.6 + age * .08;
        float ang = aR.x * 6.2832, rad = sqrt(aR.y) * (.12 + .45 * vK);     // a thin column, widening as it rises
        float curl = sin(age * .8 + up * 2.2 + aR.z * 6.283) * (.12 + .3 * vK);  // each wisp curls as it climbs
        vec3 p = uOrigin + vec3(cos(ang) * rad + curl, up * (.6 + .4 * aR.w), sin(ang) * rad + cos(age * .6 + up * 1.6) * .18 * vK);
        vH = clamp((p.y - uOrigin.y) / 3.2, 0., 1.);
        // a tall, thin billboard: a wisp, stretched upward
        float sw = mix(.12, .32, aR.w) * (.5 + 1.4 * vK), sh = sw * (2.4 + 1.6 * aR.z);
        vec4 vp = viewMatrix * vec4(p, 1.);
        vp.xy += vec2(position.x * sw, position.y * sh);
        gl_Position = projectionMatrix * vp;
        vUv = position.xy + .5;
        vA = smoothstep(0., .18, vK) * smoothstep(1., .5, vK) * uFade;
      }`,fragmentShader:`
      uniform float uHeat; varying vec2 vUv; varying float vK, vH, vA, vS;
      float fh(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(fh(i), fh(i + vec2(1., 0.)), f.x), mix(fh(i + vec2(0., 1.)), fh(i + vec2(1., 1.)), f.x), f.y); }
      float fb(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * fn(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
      void main(){
        vec2 q = vUv * 2. - 1.;
        float n = fb(vec2(q.x * 2.2 + vS * .1, q.y * 1.1 - vK * 3. + vS * .05));          // streaks that rise
        float edge = (1. - smoothstep(.2, 1., abs(q.x))) * (1. - smoothstep(.6, 1., abs(q.y)));   // thin at the edges
        float a = edge * smoothstep(.25, .8, n) * vA * .14 * (1. - .55 * vH);            // low opacity, fading up high
        vec3 cool = vec3(.3, .3, .32) * (.55 + .45 * n) * (1. - .35 * vH);             // grey, and greyer up high
        vec3 warm = vec3(1., .5, .2) * uHeat * (1. - vH) * (1. - vH) * (.5 + .5 * n) * 1.4;   // lit from below by the steel
        gl_FragColor = vec4((cool + warm) * a, a);
      }`}),h=new b(i,l);return h.frustumCulled=!1,h.renderOrder=30,{mesh:h,U:c,dispose(){i.dispose(),l.dispose()}}}const _e=[1.4,2.05,2.7,3.3],O=[3.5,5.3],t={bar0:1.3,bar1:3.1,rise0:8.8,rise1:11.9,lift0:14.6,travel1:17,plunge0:17,plunge1:18.9,out0:21.2,out1:24.2,hamon0:24.6,hamon1:30.4,polish0:26.6,polish1:31.6,name0:33,name1:37.2,nameOut:40.5,glide0:37,glide1:45},Ot=o=>o<O[0]?o*t.rise0/O[0]:o<O[1]?z(t.rise0,t.rise1,(o-O[0])/(O[1]-O[0])):t.rise1+(o-O[1])*(45-t.rise1)/(45-O[1]),Po=o=>o<2.4?o*3.2/2.4:o<O[1]?3.2+(o-2.4)*(t.rise1-3.2)/(O[1]-2.4):Ot(o),k={y:1,cx:.12,hx:1.2,hz:.5},x=new B(3.75,0,-1.15),pe=.62,Fo=3.4,Oo=[0,.015,1],Ao=.124,Mt=(o,m,p,v=!0)=>{const a=document.createElement("canvas");a.width=o,a.height=m,p(a.getContext("2d"));const i=new kt(a);return v&&(i.colorSpace=Tt),i.anisotropy=4,i.wrapS=i.wrapT=Pt,i};async function Ho(o){await lo([`900 80px ${dt.serif}`,`900 80px ${dt.ar}`]);const m=o.lang==="ar",p=o.quality,v=new He(.5,.5,.2,.2),a=new He(.1,.5,.1,.1),i=co(o,{pin:1,pout:1,bloom:.5,expo:1.05,tone:.55,color:Mo,uniforms:{uShim:{value:v},uShimF:{value:a},uShimA:{value:0},uShimFA:{value:0}}}),n=i.world,c=new ao(32,o.viewport.aspect,.1,120);n.add(c);const l=wo(o,{base:"#030203",panels:[{dir:[-.1,.02,1],w:1.5,h:16,color:"#fff4e4",power:7},{dir:[.05,.03,1],w:.5,h:16,color:"#ffc796",power:5},{dir:[-.3,.05,1],w:1.2,h:16,color:"#ffa860",power:3},{dir:[0,1,.3],w:34,h:7,color:"#fff0dc",power:1.6},{dir:[-1,.3,.2],w:24,h:9,color:"#ff9a58",power:2.2},{dir:[.1,-.5,1],w:14,h:2,color:"#ff7a30",power:1.1},{dir:[.4,.25,1],w:3,h:9,color:"#ffe2c0",power:2.6},{dir:[-.5,-.1,1],w:2.4,h:12,color:"#ffb070",power:1.8}],moon:{dir:[.19,.1,1],radius:7,power:8.5}});n.add(new no("#2a1a12","#080504",.06));const h=ko();n.add(h.group,h.light);const u=new Se("#ff8a3a",0,0,2);n.add(u);const M=new Se("#ffb070",0,0,2);M.position.set(.2,2.1,1.3),n.add(M);const d=new Ce("#e9e6df",0);d.position.set(-3,5,-5),n.add(d);const w=new Ce("#ffcf9a",0);w.position.set(1.5,5,9),w.target.position.set(x.x*.6,0,0),n.add(w,w.target);const R=new Ce("#d9d2c6",0);R.position.set(5,3,4),n.add(R),Mt(1024,512,r=>{const f=te(4);r.fillStyle="#2b1a14",r.fillRect(0,0,1024,512);for(let y=0;y<16;y++)for(let A=-1;A<9;A++){const K=A*128+(y%2?64:0),q=y*32,U=40+f()*40;r.fillStyle=`rgb(${U+40},${U*.62+18},${U*.5+12})`,r.fillRect(K+3,q+3,122,26);for(let Q=0;Q<30;Q++)r.fillStyle=`rgba(0,0,0,${f()*.25})`,r.fillRect(K+3+f()*120,q+3+f()*24,2+f()*8,1+f()*3)}}).repeat.set(2.4,1.6);const $e=Ft(512,4);$e.repeat.set(10,7);const We=new b(new ee(46,22),new T({map:$e,roughness:1,color:"#ffffff"}));We.position.set(0,6,-8.5),n.add(We);const Qe=new b(new ee(60,40).rotateX(-Math.PI/2),new T({color:"#0f0c0b",roughness:.75,metalness:.1,envMap:l,envMapIntensity:.12}));Qe.position.y=-2,n.add(Qe);const At=[[-2.6,.93],[-1.9,.97],[-1.1,1],[1.35,1],[1.5,.97],[1.55,.78],[1.2,.66],[.65,.55],[.55,.1],[.8,-.25],[.95,-.8],[-.95,-.8],[-.8,-.25],[-.55,.1],[-.62,.5],[-1.2,.62],[-1.8,.74],[-2.3,.85]],Bt=new b(yo(At,.05),new T({color:"#2c2d32",metalness:.85,roughness:.32,envMap:l,envMapIntensity:.7}));n.add(Bt);const Gt=new T({color:"#4a4a50",metalness:.9,roughness:.22,envMap:l,envMapIntensity:.9}),je=new b(ht(new xe(2.45,.03,1.02,1,1,1),50),Gt);je.position.set(.12,1,0),n.add(je);const Ne=Mt(256,256,r=>{const f=te(9);r.fillStyle="#251a13",r.fillRect(0,0,256,256);for(let y=0;y<400;y++)r.fillStyle=`rgba(${f()>.5?"0,0,0":"90,60,40"},${f()*.22})`,r.fillRect(f()*256,0,1+f()*2,256)}),Ve=new b(new ft(.95,1.05,1.25,40),new T({map:Ne,roughness:.95,color:"#6b5444"}));Ve.position.set(0,-1.4,0),n.add(Ve);const oe=new Ie;oe.position.copy(x),n.add(oe);const Ut=new T({map:Ne,color:"#3a2a20",roughness:.85,envMap:l,envMapIntensity:.12}),ae=(r,f,y,A,K,q)=>{const U=new b(new xe(r,f,y),Ut);U.position.set(A,K,q),oe.add(U)};ae(3.5,3.15,.14,0,-.425,.55),ae(3.5,3.15,.14,0,-.425,-.55),ae(.14,3.15,1.1,-1.72,-.425,0),ae(.14,3.15,1.1,1.72,-.425,0),ae(3.5,.2,1.1,0,-1.9,0);for(const r of[.55,-.8]){const f=new b(ht(new xe(3.62,.09,1.24),50),new T({color:"#1a1a1d",metalness:.9,roughness:.42,envMap:l,envMapIntensity:.3}));f.position.set(0,r,0),oe.add(f)}const qt=new T({color:"#1a1a1d",metalness:.9,roughness:.42,envMap:l,envMapIntensity:.3});for(const r of[-1,1])for(const f of[-1,1]){const y=new b(new xe(.13,3.22,.17),qt);y.position.set(r*1.73,-.425,f*.57),oe.add(y)}const N=new so("#ffa860",0,0,.3,.55,2);N.position.set(x.x-1.6,4.4,x.z+2.6),N.target.position.set(x.x,1.1,x.z+.5),n.add(N,N.target);const ne=new de({uniforms:{uT:{value:0},uRing:{value:-9},uGlow:{value:0},uSpot:{value:0}},vertexShader:"varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform float uT, uRing, uGlow, uSpot; varying vec2 vUv; varying vec3 vW;

      float wh(vec2 p){ return sin(p.x * 3. + uT * 1.1) * .5 + sin(p.y * 5. - uT * 1.4) * .3 + sin((p.x + p.y) * 7. + uT * 2.1) * .2; }
      void main(){
        vec2 p = vW.xz - vec2(${x.x}, ${x.z}); float r = length(p * vec2(.9, 2.2));
        float ring = uRing > 0. ? sin(r * 14. - uRing * 9.) * exp(-r * 1.6) * exp(-uRing * .7) * smoothstep(0., .6, uRing) : 0.;
        float h = wh(p * 2.) * .05 + ring * .12;
        float dx = wh(p * 2. + vec2(.02, 0.)) - wh(p * 2. - vec2(.02, 0.)) + ring * .8, dz = wh(p * 2. + vec2(0., .02)) - wh(p * 2. - vec2(0., .02));
        vec3 n = normalize(vec3(-dx * .4, 1., -dz * .4));
        vec3 L = normalize(vec3(-.6, .5, .8)); float spec = pow(max(dot(reflect(-L, n), normalize(cameraPosition - vW)), 0.), 40.);
        // the pool: dark water, lit warm from the steel, with the hot glow brightest where the blade went in
        vec3 col = vec3(.02, .022, .026) + vec3(1., .42, .14) * uGlow * (.35 + .65 * exp(-r * .9)) * (.7 + .3 * n.y) + vec3(1., .8, .6) * spec * (.4 + uGlow) + vec3(1., .72, .48) * uSpot * pow(max(dot(reflect(-normalize(vec3(-1.6, 3.4, 2.6)), n), normalize(cameraPosition - vW)), 0.), 50.) * 2.2;
        gl_FragColor = vec4(col, 1.);
      }`}),De=new b(new ee(3.3,.96).rotateX(-Math.PI/2),ne);De.position.set(x.x,1,x.z),n.add(De);const Me=new Se("#ff9a50",0,9,2);Me.position.set(x.x,2.1,x.z+.9),n.add(Me);const Xe=new T({color:"#202022",metalness:.8,roughness:.55,envMap:l,envMapIntensity:.5}),Ye=gt(Xe,{emit:1}),se=new b(wt(2.6,.2,.5,.03),Xe);se.position.set(.12,k.y+.1,0),n.add(se);const Ze=new T({color:"#bfc2c8",metalness:.9,roughness:.5,envMap:l,envMapIntensity:.22}),H=gt(Ze,{steel:"#d8dade",emit:1,mirror:1,moon:Oo}),W=new b(xo(.34),Ze);W.scale.setScalar(pe),n.add(W);const ie=new Ie;n.add(ie);const Ct=new T({color:"#0d0d0f",metalness:.6,roughness:.42,envMap:l,envMapIntensity:.45}),Je=new b(wt(.66,.44,.52,.06),Ct),et=new b(new ft(.065,.08,2.4,16),new T({color:"#150f0b",roughness:.9}));Je.position.set(0,0,0),et.position.set(0,1.2,0),ie.add(Je,et);const tt=new zt(1.55,3.3),ot=2.4,me=.56,at=2.35,V=bo({count:[500,1e3,1700][p],face:k,seed:7});n.add(V.mesh);const he=So(31);n.add(he.mesh);const D=To([140,220,320][p],new B(x.x,1.05,x.z+.1),3);n.add(D.mesh);const re=yt({count:[10,16,24][p],low:"#e08a50",high:"#bdb6ae",size:[1,1.9],rise:.5,spread:[2.8,0,.5],life:9,loop:!0,seed:9,gain:.07});re.U.uOrigin.value.set(x.x,1.05,x.z+.1),n.add(re.mesh);const le=yt({count:[8,14,20][p],low:"#4a2a18",high:"#2c241f",size:[4,8],rise:.18,spread:[16,0,5],life:16,loop:!0,seed:21,gain:.08});le.U.uOrigin.value.set(0,0,-2.5),n.add(le.mesh);const ge=io(240,[16,8,9],"#ff8a3a",1.5,5);ge.position.set(.5,2,-1),n.add(ge);const X=go(m?[mt.name.ar]:[mt.name.en.toUpperCase()],{rtl:m,italic:!m,color:"#f3ebdd",color2:"#b0a698",weight:900,px:m?330:250,seed:4,width:2048});c.add(X.mesh),X.mesh.position.z=-4;const Lt=uo(),_t=new URLSearchParams(location.search).has("T")?Number(new URLSearchParams(location.search).get("T")):null,Ht=vo([{t:0,pos:[.2,2.1,10],look:[.1,1.35,0],fov:32},{t:3.2,pos:[.3,1.95,7.7],look:[.12,1.3,0],fov:32},{t:8.6,pos:[.1,2,7.9],look:[.12,1.45,0],fov:32},{t:13,pos:[0,2.1,8.6],look:[.12,1.75,0],fov:32},{t:15.5,pos:[.6,2.3,9.2],look:[.9,1.9,-.2],fov:32},{t:18,pos:[3,2.3,8.2],look:[3.7,1.5,-1.15],fov:32},{t:22,pos:[3.7,2.2,7],look:[3.75,1.8,-1.15],fov:30},{t:30,pos:[3.75,2.2,6.7],look:[3.75,2.05,-1.15],fov:25},{t:38,pos:[3.75,2.15,6.3],look:[3.75,2.08,-1.15],fov:25},{t:45,pos:[3.75,2.1,3.4],look:[3.75,2.1,-1.15],fov:25,hold:!0}]),Y=new B,ze=new B,Re=new B,Kt=r=>{const f=k.y+1.08*pe,y=E.inOut(_(t.lift0,t.lift0+1.6,r)),A=E.inOut(_(t.lift0+1.2,t.travel1,r)),K=E.inOut(_(t.plunge0,t.plunge1,r)),q=E.inOut(_(t.out0,t.out1,r)),U=k.y-.75+1.08*pe,Q=z(.12,x.x,A),S=z(0,x.z,A);let e=f+y*.8+Math.sin(A*Math.PI)*.45;e=z(e,U,K),e=z(e,2.2,q);const Te=s(t.out1,t.out1+2,r)*Math.sin(r*.9)*.035;return Y.set(Q,e+Te,S)},ke=r=>r<t.plunge0+.35?z(.8,.5,s(t.rise0,t.plunge0,r)):.5*Math.exp(-(r-t.plunge0-.35)*1.4),Z=(r,f,y)=>(Re.set(r,f,y).project(c),[Re.x*.5+.5,Re.y*.5+.5]),nt=new B(Math.cos(.42),0,-Math.sin(.42));let ce=!1;const It={scene:i.scene,camera:c,focus(r){!r&&ce&&(ce=!1,o.emit("intro",!1))},update({p:r,t:f,dt:y,v:A,active:K}){const q=po(o,f,y);i.tick(f,A);const U=Math.min(Lt(f,y),be),Q=Math.max(U,be*s(0,.12,r)),S=_t??Q+r*(ho.forge-be),e=Ot(S),Te=Po(S),Pe=K&&Q<be-.05&&r<.02;Pe!==ce&&(ce=Pe,o.emit("intro",Pe));const Fe=o.viewport.aspect,Oe=Fe<.9;let ue=at,Ae=!1,J=0,Be=0;_e.forEach((L,j)=>{const F=L-S,ye=ze.set(.12+(j*5%3-1)*.32,k.y+.2,0);F<=0&&Be++,F>0&&F<.36?(ue=me+(at-me)*Math.pow(F/.36,.62),Ae=!0):F<=0&&F>-.24&&(ue=me+(1.15-me)*E.out(-F/.24),Ae=!0),F<=0&&(J=Math.max(J,Math.exp(F*13))),V.set(j,L,ye,.9+j*.06),he.set(j,L,ye)}),V.set(7,O[0]+.1,ze.set(.12,k.y+.3,0),.8),ie.visible=Ae&&S<_e[_e.length-1]+.3,ie.position.set(tt.x-ot*Math.sin(ue),tt.y-ot*Math.cos(ue),0),ie.rotation.z=-ue;const we=.2-.021875*Be-J*.018*(Be?1:0),Ge=s(t.rise0,t.rise1-.4,e);se.scale.set(1+(.2-we)*1.5,Math.max(.001,we/.2*(1-Ge)),1+(.2-we)*.8),se.position.y=k.y+we*(1-Ge)/2+.002,se.visible=S>.25&&Ge<.999;const st=s(t.bar0,t.bar1,e)*(1-.3*s(3.4,8.5,e))+J*.1;Ye.uHeat.value=st*.8,Ye.uT.value=S;const Et=E.inOut(_(t.rise0,t.rise1,e)),P=s(t.glide0,t.glide1,e);Kt(e),W.position.copy(Y),W.visible=S>O[0]-.1;const Ue=pe+(Fo-pe)*P;W.scale.setScalar(Ue),W.rotation.y=Math.sin(e*.5)*.05*s(t.out1,30,e)*(1-P),H.uRevealY.value=z(-1.3,1.35,Et),H.uHeat.value=ke(e),H.uMoonR.value=Ao*E.out(_(35.5,44.5,e)),H.uLights.value=1-.95*s(34,42,e),H.uHair.value=1-s(38,43,e),H.uPolish.value=_(t.polish0,t.polish1,e),H.uHamon.value=_(t.hamon0,t.hamon1,e),H.uT.value=e,D.U.uT.value=e,D.U.uStart.value=t.plunge0+.55,D.U.uFade.value=s(t.plunge0+.4,t.plunge0+1.4,e)*(1-s(23.5,28.5,e)),D.U.uHeat.value=.6*Math.exp(-Math.max(0,e-t.plunge0)*.5)*s(t.plunge0,t.plunge0+.6,e),re.U.uT.value=e,re.U.uFade.value=s(t.plunge0+2,t.plunge0+6,e)*(1-s(34,40,e)),le.U.uT.value=e,le.U.uFade.value=s(.5,4,e),ne.uniforms.uT.value=e,ne.uniforms.uRing.value=e>t.plunge0+.6?e-t.plunge0-.6:-9,ne.uniforms.uGlow.value=ke(e)*s(t.plunge0-1,t.plunge0+.5,e)*(1-s(t.plunge1,t.plunge1+3,e))+.42,Me.intensity=12*s(t.plunge0,t.plunge1,e)*(1-s(34,40,e)),ne.uniforms.uSpot.value=N.intensity/26,ge.material.uniforms.uTime.value=e,ge.material.uniforms.uOpacity.value=s(1,4,e)*(1-s(18,22,e)),V.tick(S,o.viewport.width,o.viewport.height,o.viewport.dpr),he.tick(S);const $t=1+.07*Math.sin(S*7.3)+.05*Math.sin(S*17.1)+.03*Math.sin(S*41);h.light.intensity=26*$t*s(.4,2.5,e)*(1-.4*s(24,32,e)),h.uT.value=S,h.uGain.value=s(0,1.5,e)*(1-.3*s(24,32,e)),u.position.copy(Y).add(ze.set(0,0,1.6)),W.visible||u.position.set(.12,2,1.4),u.intensity=(e<t.rise0-.1?st*20:ke(e)*40)*s(1,3,e),M.intensity=J*150*(S<9.5?1:0),d.intensity=1.1*s(t.hamon0,t.polish1+2,e),R.intensity=.6*s(t.hamon0,t.polish1+2,e),w.intensity=.12*s(t.plunge1,t.out1,e)*(1-s(t.nameOut-2,t.nameOut+1,e)),N.intensity=26*s(t.plunge1,t.out1,e)*(1-s(t.nameOut-2,t.nameOut+1,e));const g=Ht(Te),Wt=Math.hypot(g[0]-g[3],g[1]-g[4],g[2]-g[5]);if(Oe&&e<t.glide0&&(g[6]=Math.max(g[6],fo(e<14.5?3.3:3.1,Wt,Fe))),Oe){const L=s(19,26,e)*(1-s(40,44,e))*(1-P);g[1]=z(g[1],3.5,L),g[4]=z(g[4],1.55,L)}if(P>0){const L=Y.x-1.65*Ue,j=Y.y-.1*Ue,F=Y.z,ye=[L,j-.03,F+z(7.45,1.3,P)],Yt=[L,j,F];for(let I=0;I<3;I++)g[I]=z(g[I],ye[I],P),g[I+3]=z(g[I+3],Yt[I],P);g[6]=z(g[6],25,P),g[7]=z(g[7],0,P)}const it=J*.014*(S<9.5?1:0);mo(c,g,q.x*(1-P),q.y*(1-P)),c.position.x+=Math.sin(e*91)*it,c.position.y+=Math.cos(e*77)*it,c.updateMatrixWorld(!0);const qe=8*Math.tan(ro.degToRad(c.fov/2)),Qt=qe*Fe,jt=Math.min(Qt*.8,qe*.62);X.mesh.scale.setScalar(jt),X.mesh.position.set(0,-qe*(Oe?.3:.335),-4),X.set(E.inOut(_(t.name0,t.name1,e)),1-s(t.nameOut,t.nameOut+2,e));const[rt,lt]=Z(k.cx,k.y+.3,0),[Nt]=Z(k.cx+1.3,k.y+.3,0),[,Vt]=Z(k.cx,k.y+1.3,0);v.set(rt,lt,Math.abs(Nt-rt)*1.1+.02,Math.abs(Vt-lt)*.9+.02),i.U.uShimA.value=s(.6,2,e)*(1-s(9,12.5,e))*.9;const C=h.centre,[ct,ut]=Z(C.x,C.y,C.z),[Dt]=Z(C.x+nt.x*.8,C.y,C.z+nt.z*.8),[,Xt]=Z(C.x,C.y+.75,C.z);a.set(ct,ut,Math.abs(Dt-ct)*1.2+.02,Math.abs(Xt-ut)*1.1+.02),i.U.uShimFA.value=s(0,1.5,e)*(1-.4*s(24,32,e))*(1-P),i.U.uPin.value=0,i.U.uPout.value=s(.9,1,r);const vt=location.search;vt.includes("nb")&&(i.U.uBloom.value=0),vt.includes("nosp")&&(V.mesh.visible=!1),i.draw(c)},resize(){i.resize()},dispose(){i.dispose(),X.dispose(),V.dispose(),he.dispose(),D.dispose(),re.dispose(),le.dispose(),l.dispose(),h.dispose(),ce&&o.emit("intro",!1)}};return i.resize(),await i.warm(c),It}export{Ho as default};
