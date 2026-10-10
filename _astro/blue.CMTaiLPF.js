import{t as tt,a6 as to,o as Kt,r as _t,_ as oo,al as Vt,a9 as $t,aE as Qt,V as de,i as _e,aj as Gt,M as Ie,ai as Ht,a as vt,a5 as Ye,s as at,a4 as et,G as Xe,aR as ao,an as so,Y as no,aF as jt,ao as Xt,aH as Zt,aq as Yt,Q as Rt,ac as io,ad as Mt,ar as co,P as ro}from"./EditionWorld.astro_astro_type_script_index_0_lang.BRlO4Qlr.js";import{C as lo,p as gt,F as Ft,l as Pt,M as vo,h as ht,f as uo,s as ho,b as Ct,c as po,a as fo}from"./lines.D4L7PIDt.js";import{g as mo,a as xo}from"./glyphs.CTedv612.js";import{r as ft}from"./rig.DWhQ1a_W.js";import{l as wo,b as Bt}from"./glow.C4hBpaTt.js";import{s as go}from"./mk.D49QKV_f.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const yo=48,Y=(o,d,l)=>to(o,d,l),je=(o,d,l)=>Kt.out(_t(o,d,l)),qe=(o,d,l)=>Kt.inOut(_t(o,d,l));function Mo(){return{uT:{value:0},uDawn:{value:0},uWin:{value:new tt(0,1.95,2.1,1.25)},uWall:{value:new tt(-4.8,1,0,0)},uBoxL:{value:new tt(1.4,1.3,-.9,0)},uPlate:{value:new tt(7.2,4.8,.5,0)},uPlateA:{value:new tt(7.2,4.8,.5,0)},uGhost:{value:0},uFog:{value:.014},uSky:{value:new tt(1,1,0,0)},uFront:{value:new tt(-8,0,2,-4.8)}}}const Oe=`
${lo}
uniform float uT, uDawn, uTime, uFog;
uniform vec4 uWin, uWall, uBoxL, uPlate, uPlateA, uSky, uFront;
uniform float uGhost;
// the room's own cool white, in linear light
const vec3 ICE = vec3(.62, .80, 1.);
vec3 dawnTint(vec3 c){ float l = luma(c); return mix(c, vec3(l) * vec3(1.55, 1.1, .6) + c * vec3(.10, .04, .0), uDawn); }
// the gold light reaches a thing when its front does: gold behind it, a bright edge on it as it passes
float dawnK(vec3 P){ return smoothstep(uFront.x + 2.5, uFront.x - 2.5, length(P - uFront.yzw)); }
vec3 dawnTintP(vec3 c, vec3 P){
  float k = max(uDawn, dawnK(P)), l = luma(c);
  float q = (length(P - uFront.yzw) - uFront.x) / 1.2;
  vec3 g = vec3(l) * vec3(1.35, 1.0, .58) + c * vec3(.10, .04, .0);
  return mix(c, g, k) + S(vec3(1., .86, .56)) * exp(-q * q) * .26 * step(0., uFront.x);
}
// the sky: pivot F's own gradient, brighter blue at the horizon, deeper overhead; below it the floor's far field
vec3 skyBase(vec3 d){
  float ty = d.y / max(length(d.xz), 1e-3);
  vec3 a = mix(S(vec3(.05, .16, .46)), S(vec3(.006, .022, .11)), smoothstep(0., .5, ty));
  vec3 b = mix(S(vec3(.03, .10, .30)), S(vec3(.003, .012, .06)), smoothstep(0., .45, -ty));
  return mix(b, a, step(0., d.y));
}
// pivot F's glow, in the directions of the far wall (the gnomonic image of the -z direction at a 48 degree lens)
float skyGlow(vec3 d){
  vec2 g = d.xy / max(-d.z, .06) / .89;
  vec2 q = g / (vec2(.85, .5) * uSky.y);
  return exp(-dot(q, q) * 2.4) * step(d.z, -.02) * uSky.x;
}
// what a glossy surface at P sees along R: the sky, its glow, and the window as the real rectangle it is
vec3 envBlue(vec3 P, vec3 R){
  vec3 c = skyBase(R) * .9 + S(vec3(.8, .9, 1.)) * skyGlow(R) * .5;
  float t = (uWall.x - P.z) / min(R.z, -1e-3);
  vec3 H = P + R * max(t, 0.);
  vec2 q = abs(H.xy - uWin.xy) - uWin.zw;
  float inside = (1. - smoothstep(-.2, .5, max(q.x, q.y))) * step(0., t) * step(R.z, -1e-3);
  c += mix(S(vec3(.78, .9, 1.)), S(vec3(1., .84, .52)), max(uDawn, uWall.z)) * inside * uWall.y * 1.25;
  return c;
}
// the haze the room dissolves into at a distance
vec3 hazeCol(){ return S(vec3(.04, .13, .37)) * .75; }
`;class Dt{constructor(d){this.cap=d;const l=new oo(1,1,1);this.geo=new Vt,this.geo.index=l.index,this.geo.setAttribute("position",l.getAttribute("position")),this.geo.setAttribute("normal",l.getAttribute("normal")),this.geo.setAttribute("uv",l.getAttribute("uv"));const i=()=>{const n=new $t(new Float32Array(d*4),4);return n.setUsage(Qt),n};this.A=i(),this.B=i(),this.C=i(),this.D=i(),this.geo.setAttribute("iA",this.A),this.geo.setAttribute("iB",this.B),this.geo.setAttribute("iC",this.C),this.geo.setAttribute("iD",this.D),this.geo.instanceCount=0}geo;A;B;C;D;n=0;reset(){this.n=0}add(d,l,i,n,ve,$,w,A,m,C,Q,u,R=0,E=1,_=0){if(this.n>=this.cap)return;const q=this.n++;this.A.setXYZW(q,d,l,i,n),this.B.setXYZW(q,ve,$,w,A),this.C.setXYZW(q,m,C,Q,u),this.D.setXYZW(q,R,E,_,0)}commit(){this.geo.instanceCount=this.n,this.A.needsUpdate=this.B.needsUpdate=this.C.needsUpdate=this.D.needsUpdate=!0}dispose(){this.geo.dispose()}}const bo=`
uniform float uT;
attribute vec4 iA, iB, iC, iD;
varying vec3 vW, vN, vL, vNl, vHalf; varying vec4 vC; varying float vK, vRev, vSeed;
void main(){
  float rev = clamp((uT - iD.x) / max(iD.y, .001), 0., 1.);
  rev = rev * rev * (3. - 2. * rev);
  float hy = max(rev, .0005);
  vec3 sz = iB.xyz;
  vec3 lp = position * sz;
  float baseY = -sz.y * .5;
  lp.y = baseY + (lp.y - baseY) * hy;
  vec3 cen = vec3(0., -sz.y * (1. - hy) * .5, 0.);
  float c = cos(iA.w), s = sin(iA.w);
  vec3 wp = vec3(c * lp.x + s * lp.z, lp.y, -s * lp.x + c * lp.z) + iA.xyz;
  vec3 nl = normal;
  vec3 nw = vec3(c * nl.x + s * nl.z, nl.y, -s * nl.x + c * nl.z);
  #ifdef MIRROR
    wp.y = -wp.y; nw.y = -nw.y;
  #endif
  vW = wp; vN = nw; vL = lp - cen; vNl = nl; vHalf = vec3(sz.x, sz.y * hy, sz.z) * .5;
  vC = iC; vK = iB.w; vRev = rev; vSeed = iD.z;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,Jt=`
float boxEdge(){
  vec3 a = max(vHalf - abs(vL), 0.);
  vec3 an = abs(vNl);
  float de = 1e3;
  de = mix(de, min(a.y, a.z), step(.5, an.x));
  de = mix(de, min(a.x, a.z), step(.5, an.y));
  de = mix(de, min(a.x, a.y), step(.5, an.z));
  return de;
}`,zo=(o,d)=>[d[0]*o,d[1],d[2]*o];function ko(o,d){if(!o){const i={tall:o,dir:d,wallH:3.6,back:-4.8,plate:{A:{hx:7.2,hz:4.8,cz:0},B:{hx:5.6,hz:6,cz:1.2}},win:{cx:0,hw:2.1,y0:.7,y1:3.2},ring:{a:10.6,b:8.2,cz:-.2},desks:[{A:[1.4,-.9,0],B:[.4,-1.5,0]},{A:[4.7,-1.4,0],B:[3.5,-.2,-.55]},{A:[-1.4,1.9,0],B:[-2.7,-.3,.55]},{A:[2.2,2.6,0],B:[-1.9,3,.2]},{A:[5,2.6,0],B:[2.4,3.3,-.2]}],counter:{A:[-3.2,-1.8,0],B:[-5.2,-1.4,Math.PI/2],len:4.6},shelf:{A:[-5.1,-4.45,0],B:[-5,-4.45,0],w:3.4},doors:[{side:1,at:-2.4,w:1.1,h:2.3},{side:1,at:1.5,w:1.1,h:2.3},{side:0,at:5,w:1.1,h:2.3}],gate:Math.PI+.1,spire:[-14.2,-1],strip:{x:4.5,y:2.95,z:-4.55,yaw:0,w:2.2,h:.8},crack:{x:2.95,z:-4.74,yaw:0,w:1.8,h:2.5},dial:{x:7.04,y:2.4,z:-.45,r:1,yaw:-Math.PI/2},exit:{door:1,lane:1.5},box:{y:.74}};return qt(i)}const l={tall:o,dir:d,wallH:3.6,back:-8.6,plate:{A:{hx:3.9,hz:8.6,cz:0},B:{hx:3.5,hz:9.8,cz:1.2}},win:{cx:0,hw:1.6,y0:.7,y1:3.3},ring:{a:6.6,b:11.8,cz:-.2},desks:[{A:[.9,-4.4,0],B:[.2,-4.6,0]},{A:[-1.4,-.6,0],B:[-1.6,-1.8,.5]},{A:[1.4,1.2,0],B:[1.7,-1.2,-.5]},{A:[-1.3,4.6,0],B:[-1.3,3,.2]},{A:[1.4,6.3,0],B:[1.4,4.8,-.2]}],counter:{A:[-2,-7,0],B:[-3,-6.4,Math.PI/2],len:3.2},shelf:{A:[-3.55,-3.3,Math.PI/2],B:[-3.1,-7.9,0],w:3},doors:[{side:1,at:-3.6,w:1.1,h:2.3},{side:1,at:2.4,w:1.1,h:2.3},{side:0,at:2.6,w:1.1,h:2.3}],gate:Math.PI+.13,spire:[-12.4,-1.6],strip:{x:3.78,y:2.85,z:-6.4,yaw:-Math.PI/2,w:2.4,h:.8},crack:{x:-2.9,z:-8.54,yaw:0,w:1.5,h:2.5},dial:{x:3.82,y:2.4,z:-1.1,r:.9,yaw:-Math.PI/2},exit:{door:0,lane:-3.6},box:{y:.74}};return qt(l)}function qt(o){const d=o.dir;if(d===1)return o;const l=i=>zo(d,i);return o.desks=o.desks.map(i=>({A:l(i.A),B:l(i.B)})),o.counter={...o.counter,A:l(o.counter.A),B:l(o.counter.B)},o.shelf={...o.shelf,A:l(o.shelf.A),B:l(o.shelf.B)},o.doors=o.doors.map(i=>i.side===0?{...i,at:i.at*d}:{...i,side:i.side*d}),o.gate=Math.PI-o.gate,o.spire=[o.spire[0]*d,o.spire[1]],o.strip={...o.strip,x:o.strip.x*d,yaw:o.strip.yaw*d},o.crack={...o.crack,x:o.crack.x*d},o.dial={...o.dial,x:o.dial.x*d,yaw:o.dial.yaw*d},o.win={...o.win,cx:o.win.cx*d},o}const ot={t0:31.6,t1:35.2},bt=(o,d)=>qe(ot.t0+o*.22,ot.t1-.9+o*.22,d),So=o=>qe(ot.t0,ot.t1,o);function Wt(o,d,l){const i=o.doors[d],n=Lt(o,l);return i.side===0?{x:i.at,z:o.back,yaw:0,nx:0,nz:1}:{x:i.side*n.hx,z:i.at,yaw:Math.PI/2,nx:-i.side,nz:0}}function Lt(o,d){const l=o.plate.A,i=o.plate.B;return{hx:l.hx+(i.hx-l.hx)*d,hz:l.hz+(i.hz-l.hz)*d,cz:l.cz+(i.cz-l.cz)*d}}const zt=(o,d,l)=>[o[0]+(d[0]-o[0])*l,o[1]+(d[1]-o[1])*l,o[2]+(d[2]-o[2])*l],xt=(o,d)=>[o.ring.a*Math.cos(d),o.ring.cz+o.ring.b*Math.sin(d)];function Po(o,d){const l=o.dir,i=A=>[A[0]*l,A[1],A[2]],n=(A,m,C,Q=48,u={})=>({t:A,p:i(m),l:i(C),fov:Q,...u}),ve=new de,$=(A,m,C,Q=44,u={})=>{const R=d(A,ve);return{t:A,p:[R.x+m[0]*l,R.y+m[1],R.z+m[2]],l:[R.x+C[0]*l,R.y+C[1],R.z+C[2]],fov:Q,...u}},w=(A,m,C,Q,u,R)=>{const E=[];for(let _=A;_<=m+1e-6;_+=C)E.push($(+_.toFixed(2),Q,u,R));return E};return o.tall?ft([n(0,[0,1.55,11.5],[0,1.55,-6],48),n(2.4,[.6,2,5.6],[.2,1.6,-8.6],52),n(4.8,[1.9,2.5,-.6],[1,1.15,-5],58),n(6.1,[1.8,3.4,1.4],[1,1.2,-5],58),n(8.3,[1,10,8],[.6,.2,-4.4],58),n(10.8,[0,24,17.5],[0,0,-2.2],56),n(14.6,[.4,23.4,18],[0,0,-2.4],56),n(16.4,[-.8,12,11.8],[2.6,.6,-2],62),n(18.5,[-1.6,3.2,4.6],[3.9,1.5,1.6],62),n(20,[-1.4,3.2,1.6],[3.9,1.7,-3.2],62),n(21.2,[-1,3.2,-2.6],[1.2,2.5,-7.4],62),n(22.2,[-2.4,3.4,-1],[-2,2.3,-8.6],60),n(23.6,[-2.4,3.4,-1],[-2.2,2.2,-8.6],60),n(25,[-.6,4,1.6],[.8,1.4,-5.2],60),n(26.4,[1.6,2.4,-.6],[1.5,1.4,-4.8],58),n(29.6,[1.6,3.2,1.4],[1.4,3.7,-4.8],62),n(31.8,[1.6,3.2,1.2],[1.4,3.7,-4.8],62),n(33.6,[.2,9,4.2],[.2,0,-3.4],62),n(35,[.2,7,3.6],[.3,.6,-4.2],60),n(36,[.8,4.4,.2],[.4,1.2,-4.8],56),n(36.9,[.8,3.4,2.4],[.3,1.35,-4.8],54),n(37.9,[1,3.2,2.2],[.5,1.4,-4.8],52),n(38.9,[-.4,2.8,2.4],[.9,1,-4.2],54),...w(39.8,41.8,.4,[-1.7,2.3,4.9],[.1,.3,0],56),n(43.2,[-1.2,4.6,3],[1.2,1,-4],58),n(44.4,[.4,3.2,3.2],[0,2.1,-8.6],58),n(46.4,[0,2.1,-3],[0,2.1,-8.6],60),n(48,[0,2,-6.4],[0,2,-8.6],62)]):ft([n(0,[0,1.55,11.5],[0,1.55,-6],48),n(2.4,[1.2,1.95,9.6],[.4,1.5,-3],48),n(4.8,[2.4,2.1,4],[1.6,1.3,-1],44),n(5.9,[2.8,2.6,5.4],[1.5,1.1,-1],45),n(8.2,[2.2,5.8,11.4],[.6,.4,-1.2],47),n(10.4,[-.4,9,16.8],[-.9,0,-1.2],48),n(14.8,[.2,8.6,16.6],[-.4,0,-1],47),n(16.4,[1.5,5.2,10.6],[3.6,1,-.2],46),n(18.3,[4.7,1.7,3.6],[7.2,1.5,1.5],40),n(19.8,[4.8,1.8,1.2],[7.2,1.5,-2.3],40),n(21,[3.4,2.3,1.8],[6.4,1.8,-3.2],42),n(22.1,[3.7,2.6,2.4],[5,2.1,-4.4],42),n(23.4,[3.4,2.8,2.8],[4.9,2.2,-4],42),n(26.4,[3.4,2.6,4.6],[2.1,1.4,-.9],46),n(29.6,[2.2,2.9,4.6],[1.9,2.6,-1],46),n(31.8,[2.2,2.8,4.6],[1.8,2.6,-1],46),n(33.3,[.7,5.4,9.2],[1,1,-.9],49),n(34.2,[.3,9.2,9],[.4,.2,-.3],50),n(35.4,[.4,6,10],[.4,.6,-.8],48),n(36,[.4,4,7.8],[.4,1,-1.4],46),n(36.9,[.2,3,5.8],[.3,1.25,-1.4],42),n(37.9,[.6,2.9,5.5],[.5,1.3,-1.4],40),n(38.9,[-.3,2.5,5.6],[.9,1,-.8],42),...w(40.2,41.9,.55,[-1.5,1.9,4.5],[1.7,.25,0],45),n(43.1,[3.6,2.8,9.2],[4.2,1,-.6],48),n(44.2,[2.5,2.7,7.6],[1.5,1.8,-3],50),n(45.2,[1.3,2.5,5.2],[.3,2,-4.8],52),n(46.5,[.2,2.1,1],[0,2,-4.8],54),n(48,[0,2,-2.6],[0,2,-4.8],60)])}const Wo="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }";function Ao(o,d){const l=new _e({uniforms:{...o,uTime:d.uTime},side:Gt,depthTest:!1,depthWrite:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); gl_Position = p.xyww; }",fragmentShader:`
      ${Oe}
      varying vec3 vD;
      void main(){
        vec3 d = normalize(vD);
        float below = step(d.y, 0.);
        vec3 dm = vec3(d.x, abs(d.y), d.z);
        vec3 col = skyBase(dm) * mix(1., .85, below);
        float gx = d.x / max(-d.z, .06) / .89, ty = d.y / max(length(d.xz), 1e-3);
        float gl = skyGlow(dm) * mix(1., .86 + .14 * sin(-ty * 95. + uTime * 1.2), below);
        col += S(vec3(.80, .90, 1.)) * gl * .85;
        float h = exp(-abs(d.y) / (fwidth(d.y) * 1.4 + 1e-5)) * (.55 + .45 * exp(-gx * gx * 3.));
        col += S(vec3(.80, .92, 1.)) * h;
        // when the window opens the sky is a sunrise of its own: gold at the horizon, indigo above (not the blue sky tinted grey)
        float sr = max(uDawn, uWall.z * .85);
        float up = max(ty, 0.);
        vec3 sun = mix(mix(S(vec3(1., .80, .54)), S(vec3(.60, .36, .46)), smoothstep(0., .28, up)), S(vec3(.09, .075, .30)), smoothstep(.18, .75, up));
        sun = mix(sun, mix(S(vec3(.70, .44, .34)), S(vec3(.10, .07, .20)), smoothstep(0., .45, -ty)), below);
        sun += S(vec3(1., .88, .62)) * gl * (.8 + .6 * uDawn) + S(vec3(1., .90, .70)) * h * .6;
        gl_FragColor = vec4(mix(col, sun, sr), 1.);
      }`}),i=new Ie(new Ht(100,40,20),l);return i.frustumCulled=!1,i.renderOrder=-100,{mesh:i,mat:l}}function Ro(o,d){const l=new _e({uniforms:{...o,uTime:d.uTime},transparent:!0,depthWrite:!1,depthTest:!0,vertexShader:Wo,fragmentShader:`
      ${Oe}
      varying vec3 vW;
      void main(){
        vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / dist;
        float cosT = clamp(V.y, 0., 1.);
        float dP = sdRBox(vW.xz - vec2(0., uPlate.w), uPlate.xy, uPlate.z);
        float inP = smoothstep(.06, -.06, dP);
        float Rf = .26 + .66 * pow(1. - cosT, 3.) + inP * .2;
        float far = 1. - exp(-dist * .02);
        vec3 tint = mix(S(vec3(.010, .034, .12)), S(vec3(.04, .12, .34)), far * far);
        tint = mix(tint, S(vec3(.022, .075, .22)), inP * .9);
        // light from the window lying along the floor, a long soft band down the room
        float dz = max(vW.z - uWall.x, 0.);
        float wx = (vW.x - uWin.x) / max(uWin.z * 1.3 + dz * .55, .5);
        tint += S(vec3(.5, .74, 1.)) * exp(-wx * wx) * exp(-dz * .16) * .05 * (1. + inP) * step(uWall.x, vW.z);
        // tile lines in the floor, fine inside the business, wide outside, fading with distance
        float cell = mix(1.8, .6, inP);
        vec2 g = vW.xz / cell, fw = fwidth(g);
        vec2 f = abs(fract(g - .5) - .5);
        float gl = (1. - smoothstep(0., 1.4, min(f.x / max(fw.x, 1e-4), f.y / max(fw.y, 1e-4)))) * (1. - smoothstep(.12, .4, max(fw.x, fw.y)));
        tint += S(vec3(.34, .56, 1.)) * gl * mix(.03, .05, inP) * exp(-dist * .045);
        // the plate where it began: a ghost of dashes, while the business takes its new shape
        float dA = sdRBox(vW.xz - vec2(0., uPlateA.w), uPlateA.xy, uPlateA.z);
        vec2 ga = vW.xz - vec2(0., uPlateA.w);
        float dash = step(.5, fract(atan(ga.y, ga.x) * 9.5));
        tint += S(vec3(.5, .78, 1.)) * exp(-abs(dA) / (max(fwidth(dA), 1e-4) * 1.2)) * dash * uGhost * .5 * exp(-dist * .02);
        // the plate's edge: a fine line of light and its glow
        float pw = max(fwidth(dP), 1e-4);
        tint += S(vec3(.55, .80, 1.)) * (exp(-abs(dP) / (pw * 1.3)) * .85 + exp(-abs(dP) * 6.) * .10) * exp(-dist * .02);
        // the light of the open window lies on the floor: the window's shape, its mullions, spreading as it travels
        float opn = uWall.z;
        float spread = 1. + dz * .1;
        float wxs = (vW.x - uWin.x) / (uWin.z * spread);
        float inWin = smoothstep(1.08, .92, abs(wxs)) * (1. - .75 * exp(-pow(wxs / .045, 2.))) * exp(-dz * .05) * step(uWall.x, vW.z);
        tint += S(vec3(1., .86, .58)) * inWin * opn * (.6 + inP * .35) * smoothstep(0., 1.2, dz);
        vec3 col = dawnTintP(tint, vW);
        gl_FragColor = vec4(col, 1. - Rf);
      }`}),i=new Ie(new vt(500,500),l);return i.rotation.x=-Math.PI/2,i.frustumCulled=!1,i.renderOrder=-50,{mesh:i,mat:l}}function Et(o,d,l){const i=new _e({uniforms:{...o,uTime:d.uTime,uSize:{value:new at(5,3)}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Ye,defines:l?{MIRROR:1}:{},vertexShader:`varying vec2 vQ; varying vec3 vW; uniform vec2 uSize;
      void main(){ vQ = position.xy * uSize; vec4 w = modelMatrix * vec4(position * vec3(uSize, 1.), 1.); vW = w.xyz;
        #ifdef MIRROR
          w.y = -w.y;
        #endif
        gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      ${Oe}
      varying vec2 vQ; varying vec3 vW;
      void main(){
        // a rounded rectangle of light, feathered; open: it spreads and warms
        vec2 hw = uWin.zw;
        float d = sdRBox(vQ, hw, .12);
        float soft = mix(.22, 2.2, uWall.z);
        float a = smoothstep(soft, -.02, d);
        float core = exp(-dot(vQ / (hw * 1.15), vQ / (hw * 1.15)) * 1.2);
        vec3 cool = S(vec3(.80, .91, 1.)), warm = S(vec3(1., .88, .58));
        // what the glass shows: pivot F's horizon (pale at the line, deeper overhead, a darker ground), until the window opens on light
        float hz = vQ.y / hw.y + .32;
        float sky = mix(1.12, .46, smoothstep(0., 1.4, hz));
        float lum = mix(.34 + .1 * smoothstep(-1.4, 0., hz), sky, smoothstep(-.05, .05, hz)) + exp(-hz * hz * 70.) * .5;
        lum = mix(lum, mix(.7, 1.15, smoothstep(-hw.y, hw.y, vQ.y)), smoothstep(0., .7, uWall.z));
        vec3 c = mix(cool, warm, max(uDawn, uWall.z)) * (a * (.5 + .7 * core) * lum + exp(-max(d, 0.) * 2.2) * .12) * uWall.y;
        #ifdef MIRROR
          c *= .5 * exp(-max(-vW.y, 0.) * .5);
        #endif
        gl_FragColor = vec4(c, 1.);
      }`}),n=new Ie(new vt(1,1),i);return n.frustumCulled=!1,n.renderOrder=-45,{mesh:n,mat:i}}const Tt=`
float pattern(float kind, vec2 q, float a, float b){
  float r = length(q);
  float edge = 1. - smoothstep(.82, 1., r);
  if (kind < .5) return (pow(max(1. - r, 0.), 2.2) * .55 + exp(-r * r * 18.) * .95) * edge;
  if (kind < 1.5) { float k = (r - a) / max(b, .015); return exp(-k * k) * edge; }
  if (kind < 2.5) return exp(-abs(q.x) * 2.2) * exp(-q.y * q.y * 90.) * (1. - smoothstep(.9, 1., abs(q.x)));
  if (kind < 3.5) { vec2 s = abs(q); return (exp(-s.x * 34.) * exp(-s.y * 3.2) + exp(-s.y * 34.) * exp(-s.x * 3.2)) * edge * .8 + exp(-r * r * 60.); }
  if (kind > 5.5) {   // a padlock: an outline of a body and its arch, a faint body fill
    vec2 p = q * 1.25;
    float body = sdRBox(p - vec2(0., -.2), vec2(.36, .27), .09);
    float arch = abs(length(p - vec2(0., .14)) - .25) - .055;
    arch = max(arch, -(p.y - .1));
    float dd = min(abs(body) - .028, arch);
    return (smoothstep(.03, -.01, dd) + smoothstep(.02, -.02, body) * .16) * (1. - smoothstep(.82, 1., r)) * a;
  }
  if (kind > 4.5) {   // a sweep: a = the hand's angle (clockwise from up), b = how long its trail is, in radians
    float da = mod(a - atan(q.x, q.y), 6.2831853);
    return exp(-da / max(b, .05)) * step(da, 5.6) * smoothstep(.2, .42, r) * (1. - smoothstep(.8, .98, r)) * .4;
  }
  vec2 s = abs(q); return smoothstep(1., .35, max(s.x, s.y)) * (.35 + .65 * smoothstep(1., .0, r));
}`;function eo(o){const d=new vt(2,2),l=new Vt;l.index=d.index,l.setAttribute("position",d.getAttribute("position")),l.setAttribute("uv",d.getAttribute("uv"));const i=()=>{const w=new $t(new Float32Array(o*4),4);return w.setUsage(Qt),w},n=i(),ve=i(),$=i();return l.setAttribute("aP",n),l.setAttribute("aC",ve),l.setAttribute("aF",$),l.instanceCount=0,{geo:l,P:n,C:ve,F:$}}function yt(o,d,l,i={}){const{geo:n,P:ve,C:$,F:w}=eo(o);let A=0;const m=new _e({uniforms:{...d,uTime:l.uTime},transparent:!0,depthWrite:!1,depthTest:i.depthTest??!0,blending:Ye,vertexShader:`
      attribute vec4 aP, aC, aF; varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), U = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float kind = aF.x;
        float sx = kind > 1.5 && kind < 2.5 ? 1.8 : 1.;
        vec3 w = aP.xyz + (R * position.x * sx + U * position.y) * aP.w * .5;
        vec4 mv = viewMatrix * vec4(w, 1.);
        gl_Position = aC.a <= .0005 || aP.w <= 0. ? vec4(2., 2., 2., 1.) : projectionMatrix * mv;
        vQ = position.xy; vCol = aC; vF = aF; vD = length(mv.xyz);
      }`,fragmentShader:`
      ${Oe}
      ${Tt}
      varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        float v = pattern(vF.x, vQ, vF.y, vF.z);
        vec3 c = dawnTint(vCol.rgb) * vCol.a * v * ${i.fog===!1?"1.":"exp(-uFog * vD * .5)"};
        if (max(c.r, max(c.g, c.b)) < .002) discard;
        gl_FragColor = vec4(c, 1.);
      }`}),C=new Ie(n,m);return C.frustumCulled=!1,C.renderOrder=i.order??6,{mesh:C,cap:o,reset(){A=0},set(Q,u,R,E,_,q,Z,Me,he=0,xe=0,ge=0){A>=o||(ve.setXYZW(A,Q,u,R,E),$.setXYZW(A,_,q,Z,Me),w.setXYZW(A,he,xe,ge,0),A++)},commit(){n.instanceCount=A,ve.needsUpdate=$.needsUpdate=w.needsUpdate=!0},dispose(){n.dispose(),m.dispose()}}}function ut(o,d,l,i,n={}){const{geo:ve,P:$,C:w,F:A}=eo(o);let m=0;const C=new _e({uniforms:{...d,uTime:l.uTime},transparent:!0,depthWrite:!1,depthTest:n.depthTest??!0,blending:Ye,side:et,vertexShader:`
      attribute vec4 aP, aC, aF; varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        float c = cos(aF.w), s = sin(aF.w);
        ${i==="floor"?"vec3 R = vec3(c, 0., -s), U = vec3(s, 0., c) * -1.;":"vec3 R = vec3(c, 0., -s), U = vec3(0., 1., 0.);"}
        vec3 w = aP.xyz + (R * position.x + U * position.y) * aP.w * .5;
        vec4 mv = viewMatrix * vec4(w, 1.);
        gl_Position = aC.a <= .0005 || aP.w <= 0. ? vec4(2., 2., 2., 1.) : projectionMatrix * mv;
        vQ = position.xy; vCol = aC; vF = aF; vD = length(mv.xyz);
      }`,fragmentShader:`
      ${Oe}
      ${Tt}
      varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        float v = pattern(vF.x, vQ, vF.y, vF.z);
        vec3 c = dawnTint(vCol.rgb) * vCol.a * v * exp(-uFog * vD * .5);
        if (max(c.r, max(c.g, c.b)) < .002) discard;
        gl_FragColor = vec4(c, 1.);
      }`}),Q=new Ie(ve,C);return Q.frustumCulled=!1,Q.renderOrder=n.order??-30,{mesh:Q,cap:o,reset(){m=0},set(u,R,E,_,q,Z,Me,he,xe,ge=0,ue=0,ke=0){m>=o||($.setXYZW(m,u,R,E,_),w.setXYZW(m,Z,Me,he,xe),A.setXYZW(m,ge,ue,ke,q),m++)},commit(){ve.instanceCount=m,$.needsUpdate=w.needsUpdate=A.needsUpdate=!0},dispose(){ve.dispose(),C.dispose()}}}const It=`
${Oe}
varying vec3 vW, vN, vL, vNl, vHalf; varying vec4 vC; varying float vK, vRev, vSeed;
${Jt}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  float ndv = clamp(dot(N, V), 0., 1.);
  float fr = pow(1. - ndv, 3.);
  float de = boxEdge();
  float px = max(fwidth(de), 1e-4);
  float lineE = smoothstep(px * 1.7, px * .3, de);
  float softE = exp(-de / (px * 7.));
  vec3 R = reflect(-V, N);
  vec3 env = envBlue(vW, R);
  float hgt = clamp(vW.y * .32, 0., 1.);
  vec3 body = mix(S(vec3(.02, .06, .19)), S(vec3(.07, .19, .46)), hgt);
  float refl = .16 + .8 * fr + .34 * max(N.y, 0.);
  vec3 Lw = normalize(vec3(uWin.x, uWin.y, uWall.x) - vW);
  float lam = max(dot(N, Lw), 0.);
  vec3 col = body * (.5 + .5 * ndv) + env * refl + S(vec3(.5, .74, 1.)) * lam * .13 * uWall.y;
  col += S(vec3(.2, .45, 1.)) * .045 * exp(-vW.y * 1.4) * (1. - max(N.y, 0.));
  float flash = 1. + (1. - vRev) * 3.5;
  float isScreen = step(.5, vK) * step(vK, 1.5), isStrip = step(1.5, vK) * step(vK, 2.5), isItem = step(2.5, vK);
  // the body of a lit piece glows from inside
  vec3 glowC = vC.rgb * vC.a;
  // screens: a dashboard of rows and a chart, lit from within (front and back faces)
  vec2 uq = vL.xy / max(vHalf.xy, vec2(1e-3));
  float faceZ = step(.5, abs(vNl.z));
  float rows = floor((uq.y * .5 + .5) * 7.);
  float rl = h12(vec2(rows, vSeed * 13.));
  float row = step(.35, fract((uq.y * .5 + .5) * 7.)) * step(uq.x * .5 + .5, .25 + rl * .7) * step(.15, rl) * step(-.9, uq.x);
  float chart = step(.3, uq.y) * step(uq.x, .85) * smoothstep(.0, .05, (uq.x * .5 + .5) * .6 - (uq.y - .3) * .8 + sin(uq.x * 5. + vSeed) * .1 + .15 - .05);
  float ui = (.5 + .5 * row * .9 + .15 * h12(floor(vL.xy * 40.) + vSeed)) * (1. - .35 * smoothstep(.85, 1., max(abs(uq.x), abs(uq.y))));
  col += isScreen * faceZ * glowC * ui * 1.2;
  col += isScreen * (1. - faceZ) * glowC * .15;
  // light strips
  col = mix(col, glowC * 1.6, isStrip);
  // small lit things on the shelves and the counter: glass with a glow inside
  float inner = .35 + .65 * smoothstep(1., 0., length(vec3(vL / max(vHalf, vec3(1e-3)))) * .75);
  col += isItem * glowC * inner * .9;
  // the box's own warm light on what is near it
  vec3 tb = uBoxL.xyz - vW; float db = length(tb);
  col += S(vec3(1., .74, .38)) * max(dot(N, tb / max(db, .01)), 0.) * uBoxL.w * .75 * exp(-db * db * .55);
  // edges: a fine white-blue rim
  vec3 rimC = mix(S(vec3(.55, .78, 1.)), glowC + S(vec3(.5, .75, 1.)) * .4, isItem * .7 + isScreen * .5);
  float up = .4 + .9 * smoothstep(.0, 1.5, vW.y);
  col += rimC * (lineE * 1.5 * up + softE * .13 * up) * flash;
  col *= .62 + .38 * smoothstep(0., .45, vW.y);
  #ifdef MIRROR
    col *= .95 * exp(-max(-vW.y, 0.) * .28);
  #endif
  float dist = length(cameraPosition - vW);
  col = mix(col, hazeCol(), 1. - exp(-dist * uFog));
  gl_FragColor = vec4(dawnTintP(col, vW), 1.);
}`,Ot=`
${Oe}
varying vec3 vW, vN, vL, vNl, vHalf; varying vec4 vC; varying float vK, vRev, vSeed;
${Jt}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  float s = dot(N, V); N *= s < 0. ? -1. : 1.;
  float ndv = clamp(abs(s), 0., 1.);
  float dist = length(cameraPosition - vW);
  // glass seen at a grazing angle shines, but a wall beside the camera must not become a slab of light: capped, and eased away up close
  float fr = min(pow(1. - ndv, 2.4), .34) * mix(1., smoothstep(.4, 4.5, dist), step(.4, max(vHalf.x, vHalf.y)));
  float de = boxEdge();
  float px = max(fwidth(de), 1e-4);
  float lineE = smoothstep(px * 1.8, px * .3, de);
  float softE = exp(-de / (px * 9.));
  float lineE2 = smoothstep(px * 1.5, px * .3, abs(de - .075)) * step(.14, de);
  vec3 R = reflect(-V, N);
  vec3 env = envBlue(vW, R);
  float big = step(vHalf.z, .06) * step(.4, max(vHalf.x, vHalf.y));
  float dxv = max(vHalf.x - abs(vL.x), 0.), dyv = max(vHalf.y - abs(vL.y), 0.);
  float pxx = max(fwidth(dxv), 1e-4), pxy = max(fwidth(dyv), 1e-4);
  float lineB = max(smoothstep(pxy * 1.8, pxy * .3, dyv), smoothstep(pxx * 1.8, pxx * .3, dxv) * .5);
  lineE = mix(lineE, lineB, big * step(.5, abs(vNl.z)));
  float grad = mix(mix(1.35, .35, smoothstep(0., 3.4, vW.y)), 1., 1. - big);
  // the glass: a light fill that is brighter lower down, the room's reflection, a frosted band at the height of a seated eye
  float fillY = mix(.026, .006, smoothstep(0., 3.4, vW.y));
  float band = smoothstep(.0, .05, vW.y - 1.05) * (1. - smoothstep(.0, .05, vW.y - 1.5));
  float grain = fbm(vW.xz * 3.1 + vW.y * 2.3);
  vec3 col = (S(vec3(.34, .58, 1.)) * (fillY * big + fr * .28) + env * .05 * big + S(vec3(.5, .76, 1.)) * band * big * (.02 + .035 * grain)) * grad;
  // glass glare: two soft diagonal bands of light, fixed to the pane, and a faint warm-white lower edge where the floor shows through
  float gs = vL.x * .42 - vL.y * .62 + vW.x * .07 + vW.z * .11;
  float glare = smoothstep(.0, .18, fract(gs)) * (1. - smoothstep(.18, .5, fract(gs))) * .5 + smoothstep(.55, .7, fract(gs * 1.7 + .3)) * (1. - smoothstep(.7, .78, fract(gs * 1.7 + .3))) * .35;
  // a travelling sheen across big panes
  float sq = (dot(vW.xz, vec2(.7, .7)) * .9 + vW.y * .5 - mod(uTime * .35, 24.) + 8.) * .5;
  float sw = exp(-sq * sq);
  col += S(vec3(.7, .88, 1.)) * sw * .05 * big;
  col += S(vec3(.55, .8, 1.)) * glare * big * .028 * (.6 + .4 * smoothstep(0., 3., vW.y));
  // door leaves: a little brighter; frame bars: all edge
  float leaf = step(1.5, vK) * step(vK, 2.5), bar = step(.5, vK) * step(vK, 1.5), wglass = step(2.5, vK);
  col += S(vec3(.4, .66, 1.)) * leaf * (.05 + fr * .4);
  col += wglass * (S(vec3(.8, .92, 1.)) * (.05 + fr * .6) * (1. + uWall.z * 1.5));
  float flashAmt = vC.a;
  float rev = 1. + (1. - vRev) * 3.;
  col += S(vec3(.45, .72, 1.)) * lineE2 * .24 * rev * step(.5, bar + leaf);
  col += mix(S(vec3(.55, .8, 1.)), S(vec3(.9, .96, 1.)), flashAmt) * (lineE * (mix(1.25, .8, big) + flashAmt * 2.4) + softE * (mix(.12, .07, big) + flashAmt * .5)) * mix(1., 1.35, bar) * rev;
  // the push lights the leaf where it was pushed, falling away to its edges (never a flat slab of light, even close up)
  col += S(vec3(.5, .78, 1.)) * flashAmt * leaf * .3 * exp(-(pow(vL.x / max(vHalf.x, .05), 2.) * 1.7 + pow(vL.y / max(vHalf.y, .05) + .05, 2.) * 1.2)) * (.7 + .6 * grain);
  col *= vRev;
  #ifdef MIRROR
    col *= .62 * exp(-max(-vW.y, 0.) * .3);
  #endif
  col *= exp(-dist * uFog * 1.2);
  gl_FragColor = vec4(dawnTintP(col, vW), 1.);
}`;function Fo(o,d,l){const i=new Dt(128),n=new Dt(128),ve=(V,B,D)=>new _e({uniforms:{...d,uTime:l.uTime},vertexShader:bo,fragmentShader:V,defines:B?{MIRROR:1}:{},side:D?et:B?Gt:so,transparent:D,depthWrite:!D,depthTest:!0,blending:D?Ye:ao}),$=[ve(It,!1,!1),ve(It,!0,!1),ve(Ot,!1,!0),ve(Ot,!0,!0)],w=new Xe,A=(V,B,D)=>{const J=new Ie(V.geo,B);return J.frustumCulled=!1,J.renderOrder=D,w.add(J),J};A(i,$[0],0),A(i,$[1],0),A(n,$[2],-40),A(n,$[3],-40);const m=ut(24,d,l,"floor",{order:-32});w.add(m.mesh);const C=V=>Math.sin(V),Q=V=>Math.cos(V),u=(V,B,D,J,r,N,we,ye,G,ae,be,a,e,s,c,p,z=1.4,L=0)=>{const H=B+Q(J)*r+C(J)*we,t=D-C(J)*r+Q(J)*we;V.add(H,N,t,J,ye,G,ae,be,a,e,s,c,p,z,L)},R=[.42,.72,1],E=[.72,.9,1],_=[.2,.46,1];function q(V,B,D,J,r){const N=[...B].sort((G,ae)=>G.a-ae.a);let we=0;const ye=(G,ae)=>{if(ae-G<.1)return;const be=Math.max(1,Math.ceil((ae-G)/J)),a=(ae-G)/be;for(let e=0;e<be;e++)r(G+e*a+.02,G+(e+1)*a-.02,0,D,0)};for(const G of N)ye(we,G.a-.06),G.y0>.05&&r(G.a-.04,G.b+.04,0,G.y0-.02,0),G.y1<D-.05&&r(G.a-.04,G.b+.04,G.y1+.02,D,0),we=G.b+.06;ye(we,V)}const Z=new Float32Array(o.doors.length),Me=new Float32Array(o.doors.length),he=o.desks.map(()=>({x:0,z:0,yaw:0,lift:0})),xe={x:0,z:0,yaw:0,lift:0},ge={x:0,z:0,yaw:0,lift:0};function ue(V,B){const D=bt(V,B),J=zt(o.desks[V].A,o.desks[V].B,D);return{x:J[0],z:J[1],yaw:J[2],lift:Math.sin(D*Math.PI)*.22,e:D}}function ke(V,B){i.reset(),n.reset(),m.reset();const D=So(V),J=Lt(o,D),r=o.back,N=o.wallH;d.uPlate.value.set(J.hx,J.hz,.5,J.cz),d.uGhost.value=Y(ot.t0,ot.t0+1,V)*(1-Y(ot.t1+.2,ot.t1+2.6,V));const we=.9;for(let a=0;a<o.desks.length;a++){const e=ue(a,V),s=we+1.5+a*.28,c=e.lift;he[a]=e;const p=[e.x,e.z,e.yaw],z=c,L=a===0?1.35:1;u(i,p[0],p[1],p[2],0,z+.74,0,a===0?2.5:2.2,.07,L,0,0,0,0,0,s,1.2),u(i,p[0],p[1],p[2],a===0?-1.1:-.98,z+.36,0,.06,.72,.9,0,0,0,0,0,s+.1,1.2),u(i,p[0],p[1],p[2],a===0?1.1:.98,z+.36,0,.06,.72,.9,0,0,0,0,0,s+.1,1.2),u(i,p[0],p[1],p[2],0,z+.69,.47,a===0?2.3:2,.02,.02,2,E[0],E[1],E[2],1.6,s+.3,1);const H=a===0?-.6*o.dir:a%2?.35:-.35;u(i,p[0],p[1],p[2],H,z+.84,-.14,.08,.13,.08,0,0,0,0,0,s+.2,1),u(i,p[0],p[1],p[2],H,z+1.16,-.18,.92,.54,.04,1,R[0],R[1],R[2],1.15,s+.35,1.1,a*1.7+.3),u(i,p[0],p[1],p[2],a===0?-.4:a%2?.2:-.2,z+.24,.95,.46,.48,.46,0,0,0,0,0,s+.25,1.2),e.lift>.02&&m.set(e.x,.01,e.z,3.4,e.yaw,R[0],R[1],R[2],.55*Math.sin(e.e*Math.PI),4)}{const a=bt(5,V),e=zt(o.counter.A,o.counter.B,a),s=Math.sin(a*Math.PI)*.2,c=o.counter.len,p=we+1;Object.assign(xe,{x:e[0],z:e[1],yaw:e[2],lift:s}),u(i,e[0],e[1],e[2],0,s+.55,0,c,1.1,.85,0,0,0,0,0,p,1.5),u(i,e[0],e[1],e[2],0,s+1.13,0,c+.1,.06,.98,0,0,0,0,0,p+.15,1.2),u(i,e[0],e[1],e[2],0,s+.13,.43,c-.3,.03,.03,2,E[0],E[1],E[2],1.8,p+.35,1),u(i,e[0],e[1],e[2],c*.22,s+1.34,-.12,.58,.36,.05,1,R[0],R[1],R[2],1.1,p+.45,1,6.1),u(i,e[0],e[1],e[2],-c*.15,s+1.26,.05,.32,.2,.26,3,R[0],R[1],R[2],1,p+.5,1),u(i,e[0],e[1],e[2],-c*.3,s+1.22,-.1,.22,.12,.22,3,_[0],_[1],_[2],1,p+.55,1),u(i,e[0],e[1],e[2],-c*.02,s+1.2,-.14,.16,.08,.16,3,E[0],E[1],E[2],1.1,p+.6,1),s>.02&&m.set(e[0],.01,e[1],c*.9,e[2],R[0],R[1],R[2],.5*Math.sin(a*Math.PI),4)}{const a=bt(6,V),e=zt(o.shelf.A,o.shelf.B,a),s=Math.sin(a*Math.PI)*.2,c=o.shelf.w,p=we+.8;Object.assign(ge,{x:e[0],z:e[1],yaw:e[2],lift:s});const z=3,L=.5;u(i,e[0],e[1],e[2],-c/2,s+z/2,0,.06,z,L,0,0,0,0,0,p,1.5),u(i,e[0],e[1],e[2],c/2,s+z/2,0,.06,z,L,0,0,0,0,0,p+.1,1.5);for(let t=0;t<5;t++)u(i,e[0],e[1],e[2],0,s+.06+t*.72,0,c,.05,L,0,0,0,0,0,p+.2+t*.12,1.2);u(i,e[0],e[1],e[2],0,s+z/2,-L/2+.02,c-.06,z-.06,.02,0,0,0,0,0,p+.3,1.3);const H=[R,E,_,R,E];for(let t=0;t<4;t++){let M=-c/2+.2+t%2*.08;for(let g=0;g<4;g++){const b=.22+.2*((t*7+g*3)%4)/3,P=.24+.22*((t*5+g*2)%3)/2,W=.26+.08*((g+t)%2);if(M+b>c/2-.1)break;const O=H[(t+g)%5];u(i,e[0],e[1],e[2],M+b/2,s+.09+t*.72+.025+P/2,.02,b,P,W,3,O[0],O[1],O[2],.75+.35*((t+g)%3),p+.6+(t*4+g)*.06,1,t*4+g),M+=b+.16+.1*((t+g)%2)}}s>.02&&m.set(e[0],.01,e[1],c*1.1,e[2],R[0],R[1],R[2],.5*Math.sin(a*Math.PI),4)}const ye=J.hx,ae=J.cz+J.hz-r,be=.05;{const a=[{a:o.win.cx-o.win.hw+ye,b:o.win.cx+o.win.hw+ye,y0:o.win.y0,y1:o.win.y1}];o.doors.forEach((e,s)=>{e.side===0&&a.push({a:e.at-e.w/2+ye,b:e.at+e.w/2+ye,y0:0,y1:e.h})}),q(2*ye,a,N,3.4,(e,s,c,p)=>{const z=we+.3+Math.abs((e+s)/2-ye)*.1;n.add(-ye+(e+s)/2,(c+p)/2,r,0,s-e,p-c,be,0,0,0,0,0,z,1.6,0)})}for(const a of[-1,1]){const e=[];o.doors.forEach(c=>{c.side===a&&e.push({a:c.at-r-c.w/2,b:c.at-r+c.w/2,y0:0,y1:c.h})});const s=a*ye;q(ae,e,N,3.2,(c,p,z,L)=>{const H=we+.5+c/ae*.8+(a>0?.1:0);n.add(s,(z+L)/2,r+(c+p)/2,Math.PI/2,p-c,L-z,be,0,0,0,0,0,H,1.6,0)})}{const a=o.win.hw,e=B*a*1.02,s=o.win.cx,c=o.win.y1-o.win.y0,p=(o.win.y0+o.win.y1)/2,z=we+1.1;n.add(s-a/2-e,p,r+.07,0,a-.03,c-.04,.03,3,0,0,0,0,z,1.8,0),n.add(s+a/2+e,p,r+.07,0,a-.03,c-.04,.03,3,0,0,0,0,z,1.8,0),n.add(s,o.win.y0-.03,r+.02,0,a*2+.1,.06,.08,1,0,0,0,0,z+.2,1.2,0),n.add(s,o.win.y1+.03,r+.02,0,a*2+.1,.06,.08,1,0,0,0,0,z+.2,1.2,0),n.add(s-a-.03,p,r+.02,0,.06,c+.12,.08,1,0,0,0,0,z+.3,1.2,0),n.add(s+a+.03,p,r+.02,0,.06,c+.12,.08,1,0,0,0,0,z+.3,1.2,0),n.add(s,(o.win.y0+o.win.y1)/2,r+.02,0,.05,c,.06,1,0,0,0,0,z+.35,1.2,0)}o.doors.forEach((a,e)=>{const s=Wt(o,e,D),c=Z[e],p=Me[e],z=we+1.8+e*.22,L=s.x,H=s.z,t=s.yaw,M=a.w-.1,g=a.h-.04,b=C(t)*s.nx+Q(t)*s.nz,P=c*.03*b,W=Q(p),O=C(p),pe=W*M/2-M/2,U=-O*M/2+P;n.add(L+Q(t)*pe+C(t)*U,g/2+.02,H-C(t)*pe+Q(t)*U,t+p,M,g,.045,2,0,0,0,c,z,1.5,0),n.add(L-Q(t)*(a.w/2-.02),a.h/2,H+C(t)*(a.w/2-.02),t,.07,a.h,.1,1,0,0,0,c,z+.1,1.2,0),n.add(L+Q(t)*(a.w/2-.02),a.h/2,H-C(t)*(a.w/2-.02),t,.07,a.h,.1,1,0,0,0,c,z+.1,1.2,0),n.add(L,a.h+.01,H,t,a.w+.1,.07,.1,1,0,0,0,c,z+.15,1.2,0),u(i,L,H,t+p,M/2-.12,1.02,P,.03,.22,.1,2,E[0],E[1],E[2],1.6+c*3,z+.4,1)}),i.commit(),n.commit(),m.commit()}return{group:w,update:ke,deskAt:ue,deskXZ:he,counterXZ:xe,shelfXZ:ge,doorFlash:Z,doorWob:Me,dispose(){i.dispose(),n.dispose(),m.dispose(),$.forEach(V=>V.dispose())}}}const pt=Math.PI/180,Le={w:.92,d:.92,h:.92},kt={w:1.3,d:.78,h:.62},Ee=4.4,Te={a:26.6,b:28.3,c:33.2,d:35.4},wt={open:34.6,set1:38.1,shut:38.9},Co=`
${Oe}
${vo}
uniform vec3 uFace; uniform float uCore, uOpenK;
varying vec2 vQ; varying vec3 vN, vW;
void main(){
  vec2 pq = vQ * uFace.xy;
  float d = sdRBox(pq, uFace.xy * .5, .06);
  float px = max(fwidth(d), 1e-4);
  if (d > px) discard;
  vec3 V = normalize(cameraPosition - vW);
  bool outer = gl_FrontFacing;
  vec3 N = normalize(vN) * (outer ? 1. : -1.);
  float ndv = clamp(dot(N, V), 0., 1.);
  float fr = pow(1. - ndv, 2.2);
  vec2 q = vQ * 2.;
  float r = length(q);
  float inside = smoothstep(px, -px, d);
  vec3 amber = S(vec3(1., .56, .14)), hot = S(vec3(1., .90, .62));
  float edge = exp(-abs(d) / (px * 1.5)), edgeSoft = exp(min(d, 0.) / .05);
  float edge2 = exp(-abs(d + .035) / (px * 1.2)) * .35;
  vec3 col;
  if (outer) {
    // frosted amber glass lit from inside: the light shows through toward the middle, the room's glare slides across it
    float core = uCore * exp(-r * r * 1.5);
    float glare = smoothstep(.0, .5, dot(q, vec2(-.6, .8)) + .15) * (1. - smoothstep(.5, 1.2, dot(q, vec2(-.6, .8)) + .15)) * .5;
    col = amber * (.12 + .55 * core + .25 * uOpenK) + hot * core * .5 + amber * fr * .8 + hot * glare * (.08 + .12 * uCore);
    float k = min(uFace.x * .66, uFace.y * 1.3) / 3.87;
    float dm = sdMK(pq / k) * k;
    float isMark = step(uFace.z, 4.5);
    float fill = smoothstep(px * 1.2, -px * 1.2, dm) * isMark;
    col = mix(col, hot * 2.4, fill * .95) + amber * exp(-max(dm, 0.) / .07) * .55 * isMark * (.4 + uCore);
    // vents low on the face and three status lights that breathe (on the four walls only)
    float wall = step(uFace.z, 3.5);
    float vy = (q.y + .9) * 4.2;
    float slot = smoothstep(.3, .22, abs(fract(vy) - .5)) * step(abs(q.x), .62) * step(0., vy) * step(vy, 3.);
    col = max(col - amber * slot * .32 * wall, 0.) + hot * slot * wall * .04;
    float led = 0.;
    for (int i = 0; i < 3; i++) led += smoothstep(.07, .03, length(q - vec2(.56 - .14 * float(i), .8))) * (.55 + .45 * sin(uTime * (1.7 + float(i) * .6) + float(i) * 2.));
    col += hot * led * wall * 1.6;
  } else {
    // the inside: a hot core and a machined grid
    vec2 f = abs(fract(pq * 3.4 - .5) - .5) / (fwidth(pq * 3.4) + 1e-4);
    float grid = 1. - smoothstep(0., 1.3, min(f.x, f.y));
    col = mix(amber, hot, exp(-r * r * 2.)) * (.7 + 1.5 * uCore) * (.55 + .45 * uOpenK) + amber * .25;
    col += hot * grid * .22 * (.4 + exp(-r * r * 1.2)) + hot * exp(-abs(r - .45) * 14.) * .22 * uOpenK;
  }
  col += hot * (edge * 2.1 + edge2 + edgeSoft * .4) * (.6 + .6 * uCore);
  gl_FragColor = vec4(dawnTintP(col, vW) * inside, 1.);
}`,Bo=`
${Oe}
uniform vec2 uSize; uniform float uIcon, uWarm, uAlpha, uSeed;
varying vec2 vQ;
float sdTri(vec2 p, vec2 a, vec2 b, vec2 c){
  vec2 e0 = b - a, e1 = c - b, e2 = a - c, v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 q0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0., 1.), q1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0., 1.), q2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0., 1.);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(q0, q0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(q1, q1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(q2, q2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}
// the pictograms, in a [-1, 1] square: a signed distance (negative inside the ink)
float pic(float id, vec2 p, float t){
  float d = 1e3;
  if (id < .5) {            // quotes: a page, three lines, a stamp
    float page = abs(sdRBox(p, vec2(.50, .66), .09)) - .035;
    d = min(page, sdRBox(p - vec2(-.06, .30), vec2(.26, .035), .035));
    d = min(d, sdRBox(p - vec2(-.06, .10), vec2(.26, .035), .035));
    d = min(d, sdRBox(p - vec2(-.16, -.10), vec2(.16, .035), .035));
    d = min(d, abs(length(p - vec2(.17, -.32)) - .13) - .03);
  } else if (id < 1.5) {    // records: three stacked rows
    for (int i = 0; i < 3; i++) {
      float y = (float(i) - 1.) * .44;
      float row = abs(sdRBox(p - vec2(0., y), vec2(.62, .15), .15)) - .032;
      float dot_ = length(p - vec2(-.42, y)) - .06;
      float bar = sdRBox(p - vec2(.1 + .1 * sin(t * 1.3 + float(i) * 2.), y), vec2(.26, .028), .028);
      d = min(d, min(row, min(dot_, bar)));
    }
  } else if (id < 2.5) {    // voice: a waveform
    for (int i = 0; i < 9; i++) {
      float k = float(i) - 4.;
      float h = (.12 + .62 * abs(sin(t * 2.4 + k * .85 + uSeed)) * (1. - abs(k) * .16));
      d = min(d, sdRBox(p - vec2(k * .15, 0.), vec2(.045, h), .045));
    }
  } else if (id < 3.5) {    // films: a frame with a play mark
    float fr = abs(sdRBox(p, vec2(.66, .46), .1)) - .035;
    float tri = sdTri(p - vec2(.04, 0.), vec2(-.2, .26), vec2(-.2, -.26), vec2(.3, 0.));
    d = min(fr, tri);
    d = min(d, sdRBox(p - vec2(-.5, 0.), vec2(.018, .34), .018));
    d = min(d, sdRBox(p - vec2(.5, 0.), vec2(.018, .34), .018));
  } else {                  // messages: a bubble with three dots
    float b = abs(sdRBox(p - vec2(0., .06), vec2(.66, .42), .16)) - .035;
    float tail = sdTri(p, vec2(-.38, -.34), vec2(-.5, -.66), vec2(-.1, -.34));
    d = min(b, abs(tail) - .02);
    for (int i = 0; i < 3; i++) d = min(d, length(p - vec2((float(i) - 1.) * .28, .06 + .05 * sin(t * 3. + float(i) * 1.4))) - .065);
  }
  return d;
}
void main(){
  vec2 p = vQ * uSize * .5;
  float d = sdRBox(p, uSize * .5, .07);
  float px = max(fwidth(d), 1e-4);
  if (d > px) discard;
  float inside = smoothstep(px, -px, d);
  vec3 cool = S(vec3(.55, .80, 1.)), warm = S(vec3(1., .66, .24));
  vec3 ink = mix(cool, warm, uWarm);
  // glass: a deep body that is brighter toward the bottom edge, a sheen across the top left
  vec3 col = mix(S(vec3(.03, .10, .30)), S(vec3(.01, .035, .13)), smoothstep(-1., 1., vQ.y)) * .9;
  col += ink * .035 * smoothstep(.2, -.9, vQ.y);
  col += S(vec3(.5, .75, 1.)) * .05 * smoothstep(.1, 1., dot(vQ, vec2(-.7, .7)));
  // two fine frame lines and corner ticks
  float l1 = exp(-abs(d + .004) / (px * 1.4)), l2 = exp(-abs(d + .05) / (px * 1.2)) * .35;
  col += ink * (l1 * 1.7 + l2 + exp(min(d, 0.) / .06) * .16);
  vec2 cq = abs(vQ * uSize * .5) - (uSize * .5 - .12);
  col += ink * 1.3 * step(0., min(cq.x, cq.y)) * step(max(cq.x, cq.y), .06) * .6;
  // the pictogram
  vec2 ip = (p - vec2(0., .12)) / .36;
  float di = pic(uIcon, ip, uTime) * .36;
  float i0 = smoothstep(px * 1.2, -px * 1.2, di);
  col += ink * (i0 * 1.9 + exp(-max(di, 0.) / .055) * .3);
  col = mix(col, col * 1.0 + ink * .0, 0.);
  gl_FragColor = vec4(dawnTint(col) * inside * uAlpha, .9 * inside * uAlpha);
}`;function Do(o,d,l,i,n,ve,$){const w=new Xe,A=d.dir,m={value:.12},C={value:0},Q=new Xe;w.add(Q);const u=[],R=new vt(1,1),E=t=>{const M=new _e({uniforms:{...l,uTime:i.uTime,uFace:{value:new de(1,1,t)},uCore:m,uOpenK:C},vertexShader:"varying vec2 vQ; varying vec3 vN, vW; void main(){ vQ = position.xy; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Co,transparent:!0,depthWrite:!1,depthTest:!0,blending:Ye,side:et});u.push(M);const g=new Ie(R,M);return g.frustumCulled=!1,g.renderOrder=2,g},_=[0,1,2,3,4,5].map(()=>new Xe),q=[0,1,2,3,4,5].map(t=>E(t));_.forEach((t,M)=>{t.add(q[M]),Q.add(t)}),q[1].rotation.y=Math.PI,q[2].rotation.y=-Math.PI/2,q[3].rotation.y=Math.PI/2,q[4].rotation.x=-Math.PI/2,q[5].rotation.x=Math.PI/2;const Z=new _e({uniforms:{...l,uTime:i.uTime,uK:{value:0}},vertexShader:"varying vec3 vP; varying vec3 vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${Oe}
      uniform float uK; varying vec3 vP; varying vec3 vW;
      void main(){
        float u = vP.y + .5;                       // 0 base .. 1 top
        float a = atan(vP.z, vP.x);
        float streak = .55 + .45 * sin(a * 9. + uTime * .9 + u * 3.) * sin(a * 5. - uTime * .6);
        float f = pow(clamp(1. - u, 0., 1.), 1.6) * smoothstep(0., .05, u);
        vec3 V = normalize(cameraPosition - vW);
        float rim = pow(clamp(1. - abs(dot(normalize(vec3(vP.x, 0., vP.z)), V)), 0., 1.), 1.2);
        vec3 c = S(vec3(1., .70, .30)) * f * streak * (.10 + .42 * rim) * uK;
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`,transparent:!0,depthWrite:!1,blending:Ye,side:et}),Me=new Ie(new no(.5,.36,1,28,1,!0),Z);Me.frustumCulled=!1,Me.renderOrder=1,w.add(Me);const he=gt({count:90,shared:i,atten:1,fog:.008,core:.9,uniforms:{uSB:{value:new de},uSK:{value:0},uST:l.uT},pt:`
      uniform vec3 uSB; uniform float uSK, uST;
      float hh(float n){ return fract(sin(n * 91.3) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float life = 2.2 + hh(id) * 1.6;
        float a = mod(uST * (.55 + hh(id + 5.) * .3) + hh(id + 3.) * life, life) / life;
        float ang = hh(id + 7.) * 6.2832, rad = (.1 + .38 * hh(id + 9.)) * (.6 + .9 * a);
        pos = uSB + vec3(cos(ang + a * 2.) * rad, .1 + a * (1.3 + hh(id + 11.) * 1.5), sin(ang + a * 2.) * rad);
        size = (.03 + .05 * hh(id + 13.)) * (1. - a * .6);
        col = vec4(vec3(1., .78, .45), (1. - a) * smoothstep(0., .08, a) * uSK);
      }`});he.mesh.renderOrder=9,w.add(he.mesh);const xe=new vt(1,1),ge=1.4,ue=$?.86:.92,ke=ve.map((t,M)=>{const g=new Xe,b=new _e({uniforms:{...l,uTime:i.uTime,uSize:{value:new at(ge,ue)},uIcon:{value:M},uWarm:{value:1},uAlpha:{value:1},uSeed:{value:M*1.3}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xy * 2.; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Bo,transparent:!0,depthWrite:!1,depthTest:!0,blending:Yt,blendEquation:Zt,blendSrc:Xt,blendDst:jt,side:et}),P=new Ie(xe,b);P.scale.set(ge,ue,1),P.frustumCulled=!1,P.renderOrder=7,g.add(P);const W=o.lang==="ar",O=wo(t,{font:W?Ft.ar:Ft.sans,px:150,weight:W?700:600,color:"#ffffff",align:"center",rtl:W});return O.U.uColor.value.setRGB(.9,1.3,1.9),O.mesh.position.set(0,-ue*.335,.01),O.set(ue*.2),O.mesh.renderOrder=8,g.add(O.mesh),g.visible=!1,w.add(g),{g,m:b,label:O}}),V=Pt({count:12,shared:i,fog:.01});w.add(V.mesh);const B=yt(10,l,i);w.add(B.mesh);const D=ut(6,l,i,"floor",{order:-20});w.add(D.mesh);const r={pos:new de,w:Le.w,d:Le.d,h:Le.h,yaw:0,core:.12,tileAt:[new de,new de,new de,new de,new de],top:new de},N=new de,we=new de,ye=new de,G=new de(1,0,0),ae=new Rt,be=new Rt,a=new de,e=new de,s=new de,c=(t,M,g)=>{if($){const W=2.55+t*.5,O=(t%2?.8:-.8)*A;return g.set(M.x+O,M.y+W,M.z-.4-t*.04)}const b=(t-2)*.6;return g.set(M.x+2.9*Math.sin(b)*A,M.y+2+.35*Math.cos(b)-Math.abs(t-2)*.06,M.z-.1-.7*(1-Math.cos(b)))},p=(t,M,g)=>{const b=n.counterXZ,P=n.shelfXZ,W=n.deskAt(2,M),O=n.deskAt(3,M),pe=n.deskAt(0,M),U=Math.sin(P.yaw),se=Math.cos(P.yaw);switch(t){case 0:return g.set(b.x,2.1+b.lift,b.z+.15);case 1:return g.set(P.x+U*1.35,2.15+P.lift,P.z+se*1.35);case 2:return g.set(W.x,1.95+W.lift,W.z-.1);case 3:return g.set(O.x,1.95+O.lift,O.z-.1);default:return g.set(pe.x+Math.cos(pe.yaw)*-1*A+Math.sin(pe.yaw)*.15,pe.lift+1.6,pe.z-Math.sin(pe.yaw)*-1*A+Math.cos(pe.yaw)*.15)}},z={pos:new de,w:0,set:0};function L(t,M){ye.copy(M.position);const g=qe(33.4,35.4,t),b=Le.w+(kt.w-Le.w)*g,P=Le.d+(kt.d-Le.d)*g,W=Le.h+(kt.h-Le.h)*g,O=n.deskAt(0,t),pe=O.lift+.775,U=.56*A,se=-.2,h=N.set(O.x+Math.cos(O.yaw)*U+Math.sin(O.yaw)*se,pe+W/2+.005,O.z-Math.sin(O.yaw)*U+Math.cos(O.yaw)*se),k=1-je(2.4,Ee,t),K=Math.sin(t*1.9)*.07*k;r.pos.set(h.x+K,h.y+k*7.2,h.z+Math.sin(t*1.3)*.05*k),r.w=b,r.d=P,r.h=W,r.yaw=O.yaw,Q.position.copy(r.pos),Q.rotation.y=O.yaw;const I=Math.max(0,je(Te.a,Te.b,t)-qe(Te.c,Te.d,t)),re=Y(wt.open,wt.open+1,t)*(1-Y(wt.set1,wt.shut,t)),ne=ee=>je(Te.a+.15*ee,Te.b+.1*ee,t)-qe(Te.c+.1*ee,Te.d,t),fe=Math.max(0,ne(1))*99*pt,Pe=Math.max(0,ne(2))*88*pt,T=Math.max(0,ne(3))*82*pt,ze=Math.max(0,ne(4))*82*pt,Ue=[[b,W],[b,W],[P,W],[P,W],[b,P],[b,P]];q.forEach((ee,me)=>{ee.scale.set(Ue[me][0],Ue[me][1],1),u[me].uniforms.uFace.value.set(Ue[me][0],Ue[me][1],me===5?5:me)}),_[0].position.set(0,0,P/2),_[0].rotation.set(fe,0,0),q[0].position.set(0,W/2,0),_[1].position.set(0,0,-P/2),_[1].rotation.set(-Pe,0,0),q[1].position.set(0,W/2,0),_[2].position.set(-b/2,0,0),_[2].rotation.set(0,0,T),q[2].position.set(0,W/2,0),_[3].position.set(b/2,0,0),_[3].rotation.set(0,0,-ze),q[3].position.set(0,W/2,0),ae.setFromAxisAngle(G,-re*38*pt),a.set(0,0,P/2).applyQuaternion(ae).add(s.set(0,W,-P/2)),be.setFromAxisAngle(G,Math.PI/2-.1),e.set(0,W+1.12*I+.02,-P*.12*I),_[4].quaternion.copy(ae).slerp(be,I),_[4].position.copy(a).lerp(e,I),q[4].position.set(0,0,0),_[5].position.set(0,0,0),q[5].position.set(0,0,0),Q.position.y=r.pos.y-W/2,C.value=Math.min(1,I+re*.7);const $e=Math.exp(-Math.max(t-Ee,0)*1.6)*(t>=Ee?1:0),it=.5+.08*Math.sin(t*2.1),Qe=.12+.38*Y(Ee-.4,Ee+.1,t)*0+(t<Ee?.12:0)+$e*.95+(t>=Ee?it:0)*1+I*.55+re*.35;m.value=Qe,r.core=Qe,l.uBoxL.value.set(r.pos.x,r.pos.y,r.pos.z,Math.min(1.1,(t>=Ee-.6?.55:.2)*(.6+Qe*.6))),r.top.set(r.pos.x,r.pos.y+W/2,r.pos.z),he.U.uSB.value.copy(r.top),he.U.uSK.value=I,he.U.uAtten.value=o.viewport.height/(2*Math.tan(M.fov*Math.PI/360));const v=I*.95+($e>.02,0);Z.uniforms.uK.value=v,Me.visible=v>.01,Me.position.set(r.pos.x,r.pos.y+W/2+1.3,r.pos.z),Me.scale.set(b*.95,2.6,P*.95),V.clear(0),B.reset(),D.reset();let S=0;const x=r.pos.y+W/2+.12,ie=Y(Ee+.5,Ee+2.4,t);if(t<Ee+2.6&&(V.set(S++,r.pos.x,x,r.pos.z,r.pos.x,12,r.pos.z,.75,.9,1,.9,1.7,ie,1,0),ie<.98&&B.set(r.pos.x,x+ie*(12-x)*0+.02,r.pos.z,.5,.8,.92,1,1.3,0)),t>=Ee-.15){const ee=t-Ee,me=Math.exp(-Math.max(ee,0)*2.2);B.set(r.pos.x,r.pos.y,r.pos.z,3.8+me*2,1,.66,.24,.5*me+.08,0);for(let Be=0;Be<2;Be++){const De=Math.max(0,ee-Be*.28)/1.7;De>0&&De<1&&D.set(r.pos.x,pe+.006,r.pos.z,4.2,0,1,.72,.34,(1-De)*(1-De)*.9,1,De*.85+.08,.06+.05*De)}}if(t>=Ee&&t<Ee+2.6){const ee=(t-Ee)/2.4,me=1+ee*9.5;D.set(r.pos.x,.012,r.pos.z,me*2,0,.7,.88,1,(1-ee)*(1-ee)*.6,1,.95,.018+.02*ee)}B.set(r.pos.x,r.pos.y,r.pos.z,4.5+Qe*2.5,1,.56,.16,.09+Qe*.1,0),I>.02&&B.set(r.pos.x,r.pos.y+.3,r.pos.z,2+I*1.6,1,.8,.5,.32*I,0);const Re=Te.a+1.6,Fe=r.pos;for(let ee=0;ee<ke.length;ee++){const me=ke[ee],Be=Re+ee*.26,De=c(ee,Fe,we),We=r.tileAt[ee],f=je(Be,Be+1.3,t),j=qe(31.7+ee*.28,33.7+ee*.28,t);let F=.15+.85*f,y=Y(Be,Be+.5,t);if(me.g.visible=t>Be-.05,We.set(Fe.x,Fe.y+.2,Fe.z).lerp(De,f),We.y+=Math.sin(f*Math.PI)*.35,j>0&&(p(ee,t,N),We.lerp(N,j),We.y+=Math.sin(j*Math.PI)*.9,F=.15+.85*f-.34*j),We.y+=Math.sin(t*1.4+ee*1.3)*.035*j,ee===4&&z.w>0&&(We.lerp(z.pos,z.w),F=(.62+.1*z.w)*(1-.92*je(0,1,z.set)),y=Math.max(y,z.w),z.set>.985&&(me.g.visible=!1)),me.g.position.copy(We),me.g.rotation.y=Math.atan2(ye.x-We.x,ye.z-We.z),me.g.scale.setScalar(Math.max(F,.001)),me.m.uniforms.uAlpha.value=y,me.m.uniforms.uWarm.value=Math.exp(-Math.max(0,t-(Be+1))*1.2)*(1-j)+0+(1-Y(Be,Be+1,t))*0,H(me,y*(me.g.visible?1:0)),j>.02){const oe=j*(1-(ee===4?z.w:0));V.set(S++,r.top.x,r.top.y,r.top.z,We.x,We.y-ue*F*.5,We.z,.5,.8,1,.5*oe,1.2,0,Math.min(1,j*1.2),0)}me.g.visible&&y>.05&&B.set(We.x,We.y,We.z,ge*2.1*F,.3,.6,1,.12*y,0)}V.dirty(),B.commit(),D.commit(),V.setCount(Math.max(S,1))}function H(t,M){t.label.U.uAlpha.value=M}return{group:w,state:r,carry:z,update:L,prewarm(t){for(const M of ke)M.g.visible=t},dispose(){R.dispose(),xe.dispose(),u.forEach(t=>t.dispose()),ke.forEach(t=>{t.m.dispose(),t.label.dispose()}),Z.dispose(),Me.geometry.dispose(),V.dispose(),B.dispose(),D.dispose(),he.dispose()}}}const Ce={draw0:6.8,draw1:10.3,shut0:11.1,shut1:12.6,longEnd:10.6},Ze=14,dt=256,qo="10.6",Nt=`
uniform float uDraw, uPerim, uHW, uRk;
uniform vec4 uRP[${Ze}];
uniform float uRU[${Ze}];
// brightness the turned-back pulses leave on the ring: a flash at the impact and a wave running both ways
vec2 hits(float u){
  float fl = 0., wv = 0.;
  for (int i = 0; i < ${Ze}; i++){
    if (i == 0 && uT < ${qo}) continue;
    float period = uRP[i].x, a = mod(uT - uRP[i].y, period) / period;
    float tau = (a - .46) * period;
    if (tau > 0. && tau < 3. && uT > uRP[i].w) {
      float du = abs(fract(u - uRU[i] + .5) - .5) * uPerim;
      float k = exp(-tau * 1.35);
      fl += exp(-du * du / (.35 + tau * .35)) * k * 1.7;
      float w = (du - tau * 3.6) / .6;
      wv += exp(-w * w) * k * .9;
    }
  }
  return vec2(fl, wv);
}
float arcFrom(float u, float g){ return abs(fract(u - g + .5) - .5) * 2.; }
`;function Eo(o,d,l,i,n,ve){const $=new Xe;d.tall;const w=.9,A=d.gate,m=1024,C=new Float32Array(m+1);let Q=xt(d,A);for(let t=1;t<=m;t++){const M=xt(d,A+t/m*Math.PI*2);C[t]=C[t-1]+Math.hypot(M[0]-Q[0],M[1]-Q[1]),Q=M}const u=C[m],R=t=>{const M=(t%1+1)%1*u;let g=0,b=m;for(;b-g>1;){const W=g+b>>1;C[W]<=M?g=W:b=W}const P=(M-C[g])/Math.max(1e-6,C[b]-C[g]);return A+(g+P)/m*Math.PI*2},E=(t,M=0)=>{const g=R(t),b=xt(d,g);if(!M)return b;const P=Math.cos(g)/d.ring.a,W=Math.sin(g)/d.ring.b,O=Math.hypot(P,W);return[b[0]+P/O*M,b[1]+W/O*M]},_=[];for(let t=0;t<Ze;t++){const M=t===0?0:(t+(ht(t*3.1)-.5)*.5)/Ze,g=E(M),b=t===0?5:6.2+ht(t*1.7)*3.4,P=t===0?.6:ht(t*5.3)*b;_.push({f:.25+ht(t*7.9)*.5,E:g,u:M,period:b,phase:P,start:t===0?5.4:8.4+ht(t*2.2)*1.8})}const q=new de,Z=d.spire,Me=t=>{const M=new Float32Array((dt+1)*2*3),g=new Float32Array((dt+1)*2),b=new Float32Array((dt+1)*2),P=[];for(let O=0;O<=dt;O++){const pe=O/dt;for(let U=0;U<2;U++){const se=t?U:U*2-1,h=t?E(pe):E(pe,se*w),k=(O*2+U)*3;M[k]=h[0],M[k+1]=t?se*.95+.02:.012,M[k+2]=h[1],g[O*2+U]=pe,b[O*2+U]=se}if(O<dt){const U=O*2;P.push(U,U+1,U+2,U+1,U+3,U+2)}}const W=new io;return W.setAttribute("position",new Mt(M,3)),W.setAttribute("aU",new Mt(g,1)),W.setAttribute("aV",new Mt(b,1)),W.setIndex(P),W},he={uDraw:{value:0},uPerim:{value:u},uHW:{value:w},uRk:{value:0},uRP:{value:_.map(t=>new tt(t.period,t.phase,t.f,t.start))},uRU:{value:_.map(t=>t.u)},uGateU:{value:0},uGlow:{value:0}},xe=t=>new _e({uniforms:{...l,uTime:i.uTime,...he},transparent:!0,depthWrite:!1,depthTest:!0,blending:Ye,side:et,vertexShader:"attribute float aU, aV; varying float vU, vV, vD; void main(){ vU = aU; vV = aV; vec4 mv = modelViewMatrix * vec4(position, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:t}),ge=xe(`
      ${Oe}
      ${Nt}
      uniform float uGateU;
      varying float vU, vV, vD;
      void main(){
        float arc = arcFrom(vU, uGateU);
        float drawn = smoothstep(uDraw + .004, uDraw - .02, arc) * step(.0005, uDraw);
        float hq = (arc - uDraw) / .018;
        float head = exp(-hq * hq) * step(uDraw, .995) * step(.0005, uDraw);
        float y = vV * uHW, pxw = max(fwidth(y), 1e-3);
        float core = smoothstep(pxw * 1.5 + .018, 0., abs(y));
        float glow = exp(-abs(y) * 3.4) * .30 + exp(-abs(y) * 1.1) * .10;
        float edge = exp(-abs(abs(y) - uHW * .93) / (pxw * 1.1 + .012)) * .38;
        vec2 h = hits(vU);
        float flow = .5 + .5 * sin(vU * uPerim * 1.9 - uTime * 1.2);
        vec3 ice = S(vec3(.72, .92, 1.)) , blue = S(vec3(.16, .46, 1.));
        vec3 c = ice * (core * 2.3 + core * (h.x * 1.6 + h.y * 1.1)) + blue * (glow * (1.6 + h.x * 2. + h.y * 1.2) + edge * .8 + glow * flow * .25) + ice * h.x * exp(-abs(y) * 2.2) * .5;
        c *= 1. + uRk * (.9 + .5 * core);
        c += S(vec3(1., .96, .9)) * head * (core * 4. + exp(-abs(y) * 2.) * 1.6);
        c *= drawn + head;
        c *= exp(-vD * uFog * .5);
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`),ue=new Ie(Me(!1),ge);ue.frustumCulled=!1,ue.renderOrder=-35;const ke=xe(`
      ${Oe}
      ${Nt}
      uniform float uGateU;
      varying float vU, vV, vD;
      void main(){
        float arc = arcFrom(vU, uGateU);
        float drawn = smoothstep(uDraw + .004, uDraw - .02, arc) * step(.0005, uDraw);
        float h = clamp(vV, 0., 1.);                // 0 on the floor .. 1 at the top
        vec2 hh = hits(vU);
        float flow = .55 + .45 * sin(vU * uPerim * 2.4 - uTime * .9 + h * 3.);
        float a = pow(1. - h, 2.4) * (.10 + .04 * flow) + (hh.y * .5 + hh.x * .7) * pow(1. - h, 1.4) * .5;
        float top = exp(-abs(h - .98) * 60.) * .06;
        vec3 c = mix(S(vec3(.16, .46, 1.)), S(vec3(.75, .92, 1.)), clamp(hh.x * .6, 0., 1.)) * (a + top) * drawn;
        c *= exp(-vD * uFog * .5);
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`),V=new Ie(Me(!0),ke);V.frustumCulled=!1,V.renderOrder=-34,$.add(ue,V);const B=Pt({count:460,shared:i,fog:.006});$.add(B.mesh);const D=yt(48,l,i);$.add(D.mesh);const J=ut(40,l,i,"floor",{order:-28});$.add(J.mesh);const r=xt(d,A),N=Math.cos(A)/d.ring.a,we=Math.sin(A)/d.ring.b,ye=Math.hypot(N,we),G=[N/ye,we/ye],ae=[-G[1],G[0]],be=1.35,a=3.1,e=new _e({uniforms:{...l,uTime:i.uTime,uClose:{value:0},uLock:{value:0},uCalm:{value:0},uSize:{value:new at(be*2,a)}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      ${Oe}
      uniform float uClose, uLock, uCalm; uniform vec2 uSize;
      varying vec2 vQ;
      void main(){
        float h = vQ.y + .5;                        // 0 floor .. 1 top
        float edgeY = 1. - uClose;
        if (h < edgeY - .004) discard;
        vec2 p = vec2(vQ.x * uSize.x, (h - 1.) * uSize.y);   // metres from the top centre
        float slat = (1. - h) * uSize.y / .2;
        float f = fract(slat), px = max(fwidth(slat), 1e-3);
        float line = smoothstep(px * 1.5 + .04, 0., abs(f - .5) - .46 + .04);
        float bar = exp(-(h - edgeY) * uSize.y / .06) * step(uClose, .999);
        float rim = exp(-abs(abs(vQ.x) - .5) * uSize.x / .05);
        vec3 ice = S(vec3(.72, .92, 1.)), blue = S(vec3(.16, .46, 1.));
        vec3 c = (blue * (.12 + .05 * f) + ice * (line * .6 + rim * .35)) * mix(1., .3, uCalm) + ice * bar * 2.4;
        // a lock, once it is shut: a body, a shackle
        vec2 lp = (p - vec2(0., -1.55)) / .42;
        float body = sdRBox(lp - vec2(0., -.22), vec2(.5, .38), .1);
        float shackle = abs(length(lp - vec2(0., .26) * vec2(1., 1.) - vec2(0., .06)) - .3) - .06;
        shackle = max(shackle, -(lp.y - .1));
        float lk = smoothstep(px * 2.4 + .01, -.01, min(abs(body) - .035, shackle)) * uLock;
        c += ice * lk * mix(1.8, .7, uCalm);
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`,transparent:!0,depthWrite:!1,depthTest:!0,blending:Ye,side:et}),s=new Ie(new vt(1,1),e);s.scale.set(be*2,a,1),s.position.set(r[0],a/2,r[1]),s.rotation.y=Math.atan2(-ae[1],ae[0]),s.frustumCulled=!1,s.renderOrder=3,$.add(s);const c=gt({count:Ze*7,shared:i,atten:1,fog:.004,core:.9,uniforms:{uRP:he.uRP,uRE:{value:_.map(t=>new at(t.E[0],t.E[1]))},uS0:{value:q},uEnd0:{value:new at(Z[0],Z[1])},uPk:{value:0},uPk0:{value:0},uPT:l.uT,uPDawn:l.uDawn},pt:`
      uniform vec4 uRP[${Ze}]; uniform vec2 uRE[${Ze}]; uniform vec3 uS0; uniform vec2 uEnd0; uniform float uPk, uPk0, uPT, uPDawn;
      float sm3(float x){ x = clamp(x, 0., 1.); return x * x * (3. - 2. * x); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float fi = floor(id / 7.); int i = int(fi); float k = id - fi * 7.;
        vec4 P = uRP[i];
        vec2 E = i == 0 ? uEnd0 : uRE[i];
        float f = P.z;
        vec2 S = uS0.xz;
        float x1 = i == 0 ? S.x : S.x + (E.x - S.x) * f;
        vec2 p0 = S, p1 = vec2(x1, S.y), p2 = vec2(x1, E.y), p3 = E;
        float l0 = length(p1 - p0), l1 = length(p2 - p1), l2 = length(p3 - p2), Lt = max(l0 + l1 + l2, 1e-3);
        float a = mod(uPT - P.y - k * .085, P.x) / P.x;
        float s = a < .46 ? sm3(a / .46) : a < .53 ? 1. : 1. - sm3((a - .53) / .47);
        float d = s * Lt;
        vec2 q = d < l0 ? mix(p0, p1, d / max(l0, 1e-4)) : d < l0 + l1 ? mix(p1, p2, (d - l0) / max(l1, 1e-4)) : mix(p2, p3, (d - l0 - l1) / max(l2, 1e-4));
        float on = step(P.w, uPT) * (i == 0 ? uPk0 : uPk);
        float vis = sm3(a * 18.) * (1. - sm3((a - .94) * 16.)) * on;
        float fq = (a - .5) / .035;
        float flare = 1. + 1.7 * exp(-fq * fq);
        float trail = 1. - k / 7.;
        pos = vec3(q.x, .14 + .08 * sin(s * 3.14159), q.y);
        size = (.52 * trail * flare + (k < .5 ? .12 : 0.)) * (k < .5 ? 1.2 : .9);
        size *= clamp(distance(cameraPosition, pos) / 10., .2, 1.);   // close up they stay small
        vec3 c = mix(vec3(.42, .72, 1.), vec3(.9, .97, 1.), trail * trail);
        col = vec4(c * (k < .5 ? 3.2 : 1.8), vis * trail * trail * (.6 + .5 * flare));
      }`});c.mesh.renderOrder=9,$.add(c.mesh);const p=new de;let z=0;const L=(t,M,g,b,P,W,O,pe,U,se,h,k=0,K=1,I=0)=>{z<460&&B.set(z++,t,M,g,b,P,W,O,pe,U,se,h,k,K,I)};function H(t,M,g){const b=n.deskAt(0,t);q.set(b.x+Math.cos(b.yaw)*.7*d.dir+Math.sin(b.yaw)*1.42,0,b.z-Math.sin(b.yaw)*.7*d.dir+Math.cos(b.yaw)*1.42);const P=qe(Ce.draw0,Ce.draw1,t),W=qe(Ce.shut0,Ce.shut1,t),O=Y(Ce.shut1-.1,Ce.shut1+.5,t);he.uDraw.value=P,he.uRk.value=Math.exp(-Math.pow((t-(Ce.draw1+.15))/.45,2)),e.uniforms.uClose.value=W,e.uniforms.uLock.value=O,e.uniforms.uCalm.value=Y(Ce.shut1+1.5,Ce.shut1+4,t);const pe=Y(8.4,9.8,t),U=Y(5.2,5.8,t);c.U.uPk.value=pe,c.U.uPk0.value=U,c.U.uAtten.value=g/(2*Math.tan(M.fov*Math.PI/360)),c.U.uEnd0.value.set(t<Ce.longEnd?Z[0]:r[0]-G[0]*.12,t<Ce.longEnd?Z[1]:r[1]-G[1]*.12),z=0,B.clear(0),D.reset(),J.reset();const se=96;for(const[h,k,K,I,re,ne]of[[0,2.5,1,.78,.94,1],[w*.93,1.2,.55,.3,.6,1],[-w*.93,1.2,.55,.3,.6,1]])for(let fe=0;fe<se;fe++){const Pe=fe/se,T=(fe+1)/se,ze=Math.min(Pe,1-Pe)*2,Ue=Math.min(T,1-T)*2,$e=Math.min(ze,Ue),it=Math.max(Math.abs(Ue-ze),1e-4),Qe=Math.min(1,Math.max(0,(P-$e)/it));if(Qe<=0)continue;const v=E(Pe,h),S=E(T,h),x=ze<Ue,ie=x?v:S,Re=x?S:v;L(ie[0],.014,ie[1],Re[0],.014,Re[1],I,re,ne,K,k,0,Qe,Qe<1?1.2:0)}for(let h=1;h<Ze;h++){const k=_[h],K=je(8.3+h*.09,9.5+h*.09,t);if(K<=0)continue;const I=q.x+(k.E[0]-q.x)*k.f,re=[[q.x,q.z],[I,q.z],[I,k.E[1]],k.E],ne=[0,1,2].map(T=>Math.hypot(re[T+1][0]-re[T][0],re[T+1][1]-re[T][1])),fe=ne[0]+ne[1]+ne[2];let Pe=0;for(let T=0;T<3;T++){const ze=Pe/fe,Ue=(Pe+ne[T])/fe;Pe+=ne[T];const $e=Math.min(1,Math.max(0,(K-ze)/Math.max(Ue-ze,1e-4)));$e>0&&ne[T]>.01&&L(re[T][0],.016,re[T][1],re[T+1][0],.016,re[T+1][1],.3,.62,1,.85,1.5,0,$e,0)}}{const h=Y(5,5.9,t),k=q.x,K=r[1];L(q.x,.02,q.z,k,.02,K,.75,.93,1,.9*h,2.2,0,1,0);const I=r[0]-G[0]*.02;L(k,.02,K,I,.02,K,.75,.93,1,.9*h,2.2,0,1,0);const re=1-Y(Ce.shut0+.2,Ce.shut1+.1,t),ne=(1-re)*.98;L(r[0],.02,r[1],Z[0],.02,Z[1],.5,.8,1,.85*h,2,ne,1,0),L(r[0],.02,r[1],Z[0],.02,Z[1],.16,.36,.9,.35*h,1.4,0,ne+.001,0);const fe=6.5,Pe=.22,T=Bt(Pe,fe,Pe,Z[0],fe/2,Z[1]);for(const ze of T)L(ze[0],ze[1],ze[2],ze[3],ze[4],ze[5],.4,.7,1,.55*h,1.1,0,1,0);D.set(Z[0],fe,Z[1],2.4,.5,.78,1,.5*h*(.35+.65*re),0),D.set(Z[0],fe,Z[1],7,.3,.55,1,.12*h,0),D.set(Z[0],fe,Z[1],1.2,.7,.9,1,.5*h,3)}{const h=.4+.5*Y(Ce.shut0-.6,Ce.shut1,t)+.5*Math.exp(-Math.max(t-Ce.shut1,0)*1.8)*(t>Ce.shut1?1:0),k=Y(6.8,7.8,t);for(const K of[-1,1]){const I=r[0]+ae[0]*be*K,re=r[1]+ae[1]*be*K;for(const ne of Bt(.2,a,.2,I,a/2,re))L(ne[0],ne[1],ne[2],ne[3],ne[4],ne[5],.7,.9,1,.9*h*k,1.5,0,1,0);D.set(I,a,re,1.3,.6,.85,1,.25*h*k,0)}{const K=be+.1,I=.07,re=.07,ne=a+.08,fe=(T,ze,Ue)=>[r[0]+ae[0]*K*T+G[0]*I*ze,ne+re*Ue,r[1]+ae[1]*K*T+G[1]*I*ze],Pe=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(T=>fe(T[0],T[1],T[2]));for(const[T,ze]of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])L(Pe[T][0],Pe[T][1],Pe[T][2],Pe[ze][0],Pe[ze][1],Pe[ze][2],.7,.9,1,.9*h*k,1.5,0,1,0)}if(t>Ce.shut1-.1){const K=Math.max(0,t-Ce.shut1),I=Math.min(1,K/1.6);I<1&&J.set(r[0],.02,r[1],6,0,.7,.9,1,(1-I)*(1-I)*.9,1,I*.85+.1,.05+.05*I),D.set(r[0],.1,r[1],3.4,.6,.85,1,.6*Math.exp(-K*3),0)}}for(let h=0;h<Ze;h++){const k=_[h],K=h===0?t<Ce.longEnd?Z:[r[0]-G[0]*.12,r[1]-G[1]*.12]:k.E,ne=(((t-k.phase)%k.period+k.period)%k.period/k.period-.46)*k.period;if(ne>0&&ne<2.2&&t>k.start+.1){const fe=ne/2.2;J.set(K[0],.02,K[1],4.2,0,.65,.9,1,(1-fe)*(1-fe)*1.5,1,fe*.8+.1,.04+.035*fe),J.set(K[0],.02,K[1],4.2,0,.8,.95,1,(1-fe)*(1-fe)*.8,1,Math.max(0,fe*.8-.08)+.06,.03)}}D.set(r[0],.5,r[1],3,.5,.8,1,.16*Y(6.8,7.6,t)*(1-.6*W),0),B.setCount(Math.max(z,1)),B.dirty(),D.commit(),J.commit(),p.set(0,0,0)}return{group:$,update:H,gate:r,S0:q,perim:u,ringPt:E,routes:_,dispose(){ue.geometry.dispose(),V.geometry.dispose(),ge.dispose(),ke.dispose(),e.dispose(),s.geometry.dispose(),B.dispose(),c.dispose(),D.dispose(),J.dispose()}}}const te={wake:15.4,doors:[17.5,23],strip:[18.2,24.4],crack:[20,26.4],dial:[18.2,27.4],dialTurn:[19.4,26]},St={1:[18.35,18.8],0:[20.2,20.65],2:[22.1,22.55]},Io=`
${Oe}
varying vec3 vN, vW;
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float fr = pow(1. - clamp(dot(N, V), 0., 1.), 2.);
  vec3 c = S(vec3(.80, .94, 1.)) * (1.1 + 2.8 * fr * 0. + 1.6 * (1. - fr)) + S(vec3(.3, .6, 1.)) * fr * 2.2;
  gl_FragColor = vec4(dawnTintP(c, vW), 1.);
}`,Oo=`
${Oe}
uniform float uK;
varying vec3 vP, vW;
void main(){
  float u = clamp(vP.z / 2.6, 0., 1.);
  float f = pow(1. - u, 1.5) * smoothstep(0., .04, u);
  float a = atan(vP.y, vP.x);
  float stripe = .75 + .25 * sin(a * 7. + uTime * 2. - u * 9.);
  vec3 c = S(vec3(.5, .82, 1.)) * f * stripe * uK * .55;
  gl_FragColor = vec4(dawnTintP(c, vW), 1.);
}`;function No(o,d,l,i,n,ve,$){const w=new Xe,A=Pt({count:420,shared:i,fog:.006}),m=yt(110,l,i),C=ut(16,l,i,"wall",{order:4});w.add(A.mesh,m.mesh,C.mesh);let Q=0;const u=(v,S,x,ie,Re,Fe,ee,me,Be,De,We,f=0,j=1,F=0)=>{Q<420&&De>.002&&A.set(Q++,v,S,x,ie,Re,Fe,ee,me,Be,De,We,f,j,F)},R=new Ht(.2,24,16),E=new co(.62,2.6,28,1,!0);E.translate(0,-1.3,0),E.rotateX(-Math.PI/2);const _=[0,1,2].map(v=>{const S=new Ie(R,new _e({uniforms:{...l,uTime:i.uTime},vertexShader:"varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Io,transparent:!0,depthWrite:!1,blending:Ye}));S.frustumCulled=!1,S.renderOrder=8;const x=new _e({uniforms:{...l,uTime:i.uTime,uK:{value:0}},vertexShader:"varying vec3 vP, vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Oo,transparent:!0,depthWrite:!1,blending:Ye,side:et}),ie=new Ie(E,x);return ie.frustumCulled=!1,ie.renderOrder=7,w.add(S,ie),{orb:S,beam:ie,beamMat:x,pos:new de,face:new de(0,0,1),k:v}}),q=ve.perim,Z=(v,S)=>((.1+v/3+(v===1?-1:1)*2.7*(S-te.wake)/q)%1+1)%1,Me=(v,S,x,ie)=>{const Re=Z(v,S),Fe=ve.ringPt(Re),ee=ve.ringPt(Re+(v===1?-.004:.004));x.set(Fe[0],1.2+.12*Math.sin(S*1.7+v*2.1),Fe[1]),ie.set(ee[0]-Fe[0],0,ee[1]-Fe[1]).normalize()},he=(v,S,x)=>[v,S,x],xe=v=>Wt(d,v,0),ge=(v,S,x=1.25)=>{const ie=xe(v);return he(ie.x-ie.nx*S,x,ie.z-ie.nz*S)},ue=v=>{const S=xe(v);return he(S.x,1.2,S.z)},ke=(()=>{const v=[];return[1,0,2].forEach((x,ie)=>{const[Re,Fe]=St[x];v.push({t:Re-.75,p:ge(x,1.5,1.5),l:ue(x)}),v.push({t:Re-.35,p:ge(x,.95),l:ue(x)}),v.push({t:Re,p:ge(x,.5),l:ue(x)}),v.push({t:Re+.22,p:ge(x,.95),l:ue(x)}),v.push({t:Fe,p:ge(x,.5),l:ue(x)}),v.push({t:Fe+.25,p:ge(x,1),l:ue(x)})}),v.sort((x,ie)=>x.t-ie.t),v.filter((x,ie)=>ie===0||x.t-v[ie-1].t>.03)})(),V=ft(ke),B=d.strip,D=[Math.sin(B.yaw),Math.cos(B.yaw)],J=[Math.cos(B.yaw),-Math.sin(B.yaw)],r=(v,S,x)=>he(B.x+J[0]*(v-.5)*B.w+D[0]*S,x,B.z+J[1]*(v-.5)*B.w+D[1]*S),N=d.wallH+.55,we=[{t:te.strip[0]-.4,p:r(.6,-2.4,3.6),l:r(.5,0,2.9)},{t:te.strip[0]+.9,p:r(.55,-.4,N),l:r(.5,0,2.9)},{t:te.strip[0]+1.7,p:r(.12,1.5,3.25),l:r(.12,0,2.95)},{t:te.strip[0]+3,p:r(.88,1.5,3.25),l:r(.88,0,2.95)},{t:te.strip[0]+4.3,p:r(.14,1.5,3.2),l:r(.14,0,2.95)},{t:te.strip[0]+5.2,p:r(.5,1.7,3.5),l:r(.5,0,2.95)},{t:te.strip[0]+6.2,p:r(.55,-.4,N),l:r(.5,0,2.9)},{t:te.strip[0]+7,p:r(.6,-2.4,3.6),l:r(.5,0,2.9)}],ye=ft(we),G=v=>{const S=te.strip[0]+1.7;if(v<S)return .12;const x=v-S;return x<1.3?.12+.76*qe(0,1.3,x):x<2.6?.88-.74*qe(1.3,2.6,x):x<3.5?.14+.36*qe(2.6,3.5,x):.5},ae=d.crack,be=[Math.sin(ae.yaw),Math.cos(ae.yaw)],a=[Math.cos(ae.yaw),-Math.sin(ae.yaw)],e=[[-.3,3.25],[-.14,2.97],[-.27,2.62],[.02,2.32],[-.07,1.97],[.21,1.66],[.09,1.31],[.4,1]],s=[[[.02,2.32],[.26,2.2],[.42,1.93]],[[-.07,1.97],[-.3,1.8],[-.36,1.52]]],c=(v,S,x=.05)=>he(ae.x+a[0]*v+be[0]*x,S,ae.z+a[1]*v+be[1]*x),p=e.slice(1).map((v,S)=>Math.hypot(v[0]-e[S][0],v[1]-e[S][1])),z=p.reduce((v,S)=>v+S,0),L=v=>{let S=Math.min(Math.max(v,0),1)*z;for(let x=0;x<p.length;x++){if(S<=p[x]||x===p.length-1){const ie=Math.min(1,S/p[x]);return[e[x][0]+(e[x+1][0]-e[x][0])*ie,e[x][1]+(e[x+1][1]-e[x][1])*ie]}S-=p[x]}return e[e.length-1]},H=[22,24],t=[{t:te.crack[0]-.4,p:c(-.2,3.7,-2.4),l:c(-.2,3,0)},{t:te.crack[0]+.8,p:c(-.3,N,-.3),l:c(-.3,3.1,0)},{t:te.crack[0]+1.6,p:c(.5,3.5,1.3),l:c(-.28,3.05,0)},...[0,.25,.5,.75,1].map(v=>{const S=L(v);return{t:H[0]+v*(H[1]-H[0]),p:c(S[0]+.8,S[1]+.35,1.25),l:c(S[0],S[1],0)}}),{t:H[1]+1,p:c(.2,1.9,1.5),l:c(.1,1.4,0)},{t:H[1]+2,p:c(.3,N,-.3),l:c(.2,2,0)},{t:H[1]+2.5,p:c(.3,3.8,-2.4),l:c(.2,2,0)}],M=ft(t.sort((v,S)=>v.t-S.t)),g=32,b=8,P=.125,W=.075,O=$.idx("A"),pe=$.idx("Z")-$.idx("A")+1,U=mo({atlas:$,count:g*b,shared:i,plane:{right:new de(J[0],0,J[1]),up:new de(0,1,0)},glow:.5,fog:.004,uniforms:{uScroll:{value:0},uScan:{value:.5},uLit:{value:0},uOn:{value:0},uSW:{value:B.w},uBase:{value:O},uRange:{value:pe}},inst:`
      uniform float uScroll, uScan, uLit, uOn, uSW, uBase, uRange;
      float hh(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      void inst(float id, out vec3 pos, out float glyph, out float size, out vec4 col, out vec4 fx){
        float COLS = ${g}., ROWS = ${b}.;
        float j = floor(id / COLS), c = id - j * COLS;
        float s = uScroll / ${P}, whole = floor(s), fr = s - whole;
        float Lg = whole - j;                               // the log line this slot shows
        float y = (j + fr - ROWS * .5 + .5) * ${P};
        float x = (c - COLS * .5 + .5) * ${W};
        float H = ROWS * ${P} * .5 - .1;
        float edge = smoothstep(H, H - .16, abs(y));
        float word = step(.2, hh(vec2(floor((c + 2.) / 6.), Lg * 1.7)));
        float gap = step(.5, mod(c + 2., 6.));
        float tag = c < 4. ? 1. : 0.;
        float on = max(tag, word * gap) * step(.12, hh(vec2(Lg, 4.7)));
        float flick = floor(uTime * (.25 + hh(vec2(c, Lg)) * .6) + hh(vec2(Lg, c)) * 9.);
        glyph = uBase + floor(hh(vec2(c * 1.31 + Lg * 2.9, flick)) * uRange);
        size = .1;
        float u = (x / uSW) + .5;
        float scan = uLit * exp(-pow(abs(u - uScan) / .085, 2.));
        float pick = step(.8, hh(vec2(Lg, 9.1)));
        vec3 base = mix(vec3(.18, .42, .95), vec3(.5, .8, 1.), pick) * (.38 + .5 * pick);
        vec3 lit = vec3(.9, .97, 1.) * 2.3;
        col = vec4(mix(base, lit, clamp(scan, 0., 1.)), on * edge * uOn);
        pos = vec3(x, y, .012);
        fx = vec4(0.);
      }`});U.mesh.position.set(B.x,B.y,B.z),w.add(U.mesh);const se=d.dial,h=24,k=[Math.cos(se.yaw),-Math.sin(se.yaw)],K=[Math.sin(se.yaw),Math.cos(se.yaw)],I=(v,S)=>he(se.x+k[0]*Math.sin(v)*S*se.r+K[0]*.03,se.y+Math.cos(v)*S*se.r,se.z+k[1]*Math.sin(v)*S*se.r+K[1]*.03),re=ut(2,l,i,"wall",{order:3});w.add(re.mesh);const ne=new de,fe=new de,Pe=new de(0,1,0);new de,new de;const T=new de,ze=new de,Ue=[V,ye,M],$e=v=>[Y(te.doors[0],te.doors[0]+.6,v)*(1-Y(te.doors[1],te.doors[1]+1.2,v)),Y(te.strip[0]-.2,te.strip[0]+.8,v)*(1-Y(te.strip[1]-.8,te.strip[1]+.4,v)),Y(te.crack[0]-.2,te.crack[0]+.8,v)*(1-Y(te.crack[1]-1.4,te.crack[1]-.2,v))],it=(v,S,x,ie)=>{Me(v,S,x,ie);const Re=$e(S)[v];if(Re>.001){const Fe=Ue[v](S);ne.copy(Fe.p),fe.copy(Fe.l).sub(ne).normalize(),x.lerp(ne,Re),ie.lerp(fe,Re).normalize()}};function Qe(v,S){Q=0,A.clear(0),m.reset(),C.reset(),re.reset();const x=n.doorFlash,ie=n.doorWob;for(let f=0;f<x.length;f++){x[f]=0,ie[f]=0;const j=St[f];if(j){for(const F of j){const y=v-F;y>0&&y<1.6&&(x[f]+=Math.exp(-y*4.5),ie[f]+=Math.sin(y*26)*Math.exp(-y*5.5)*.085),y>-.08&&y<=0&&(x[f]+=(1+y/.08)*.5)}x[f]=Math.min(1,x[f])}}const Re=Y(te.wake,te.wake+1.2,v);_.forEach((f,j)=>{it(j,v,f.pos,f.face);const F=$e(v)[j],y=Re*(v>te.wake?1:0);if(f.orb.visible=y>.01,f.beam.visible=y>.01,f.orb.position.copy(f.pos),f.orb.scale.setScalar(Math.max(y,.001)),f.beam.position.copy(f.pos),f.beam.lookAt(ne.copy(f.pos).add(f.face)),f.beam.scale.set(.5,.5,1),f.beamMat.uniforms.uK.value=y*(.28+.9*F),y>.01){const oe=(le,ce,Se,Ne,Ge,Je)=>{const Ve=f.face,Ae=ne.copy(Pe).cross(Ve);Ae.lengthSq()<1e-4&&Ae.set(1,0,0),Ae.normalize();const Ke=fe.copy(Ve).cross(Ae).normalize(),He=f.pos.x+Ve.x*ce,ct=f.pos.y+Ve.y*ce,At=f.pos.z+Ve.z*ce;for(let mt=0;mt<Ne;mt++){const rt=Se+mt/Ne*Math.PI*2,lt=Se+(mt+.62)/Ne*Math.PI*2;u(He+(Ae.x*Math.cos(rt)+Ke.x*Math.sin(rt))*le*y,ct+(Ae.y*Math.cos(rt)+Ke.y*Math.sin(rt))*le*y,At+(Ae.z*Math.cos(rt)+Ke.z*Math.sin(rt))*le*y,He+(Ae.x*Math.cos(lt)+Ke.x*Math.sin(lt))*le*y,ct+(Ae.y*Math.cos(lt)+Ke.y*Math.sin(lt))*le*y,At+(Ae.z*Math.cos(lt)+Ke.z*Math.sin(lt))*le*y,.72,.92,1,Ge,Je,0,1,0)}};oe(.42,.1,v*.8+j,40,.95,1.8),oe(.29,.26,-v*1.7+j*2,20,.75,1.4);const X=Math.min(1,Math.max(.35,S.position.distanceTo(f.pos)/5));m.set(f.pos.x,f.pos.y,f.pos.z,2*y*X,.45,.75,1,.34*X,0),m.set(f.pos.x,f.pos.y,f.pos.z,.7*y,.85,.96,1,1,0),m.set(f.pos.x,f.pos.y,f.pos.z,2.4*y*X,.6,.85,1,.4*X,3);for(let le=1;le<=9;le++){it(j,v-le*.075,T,ze);const ce=1-le/10;m.set(T.x,T.y,T.z,(.9*ce+.2)*y,.5,.8,1,.5*ce*ce*ce,0)}}});for(let f=0;f<d.doors.length;f++){const j=St[f];if(!j)continue;const F=xe(f),y=d.doors[f];for(const oe of j){const X=v-oe;if(oe===j[1]&&X>.1&&X<2.2&&C.set(F.x-F.nx*.02,1.28,F.z-F.nz*.02,.8,F.yaw,.8,.95,1,1.4*Math.min(1,(X-.1)*6)*Math.exp(-Math.max(0,X-1)*1.8),6,1,0),X>-.05&&X<1){const le=Math.max(0,X)/1;if(C.set(F.x,1.15,F.z,y.w*3.2,F.yaw,.65,.9,1,(1-le)*(1-le)*1.3,1,le*.8+.06,.09),X>-.05&&X<.25){const ce=Math.min(1,Math.max(.4,Math.hypot(S.position.x-F.x,S.position.z-F.z)/6));m.set(F.x-F.nx*.05,1.2,F.z-F.nz*.05,2.4*ce,.75,.93,1,1.2*ce*(1-Math.max(X,0)/.25),0)}}}}const Fe=Y(2.8,4.4,v);U.U.uOn.value=Fe,U.U.uScroll.value=v*.32;const ee=$e(v)[1]*(v<te.strip[0]+6?1:0);if(U.U.uLit.value=ee,U.U.uScan.value=G(v),ee>.02){const f=r(G(v),.02,B.y-B.h*.55),j=r(G(v),.02,B.y+B.h*.55);u(f[0],f[1],f[2],j[0],j[1],j[2],.85,.95,1,.9*ee,1.6,0,1,0),m.set((f[0]+j[0])/2,B.y,(f[2]+j[2])/2,1.2,.6,.85,1,.35*ee,0)}{const f=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([j,F])=>r(.5+j*1.04,.02,B.y+F*(B.h+.1)));for(let j=0;j<4;j++)u(f[j][0],f[j][1],f[j][2],f[(j+1)%4][0],f[(j+1)%4][1],f[(j+1)%4][2],.5,.78,1,.55*Fe,1.2,0,1,0)}const me=je(20.9,21.8,v),Be=je(21.6,22.1,v),De=qe(H[0],H[1],v),We=Y(24.6,26.2,v);if(me>0){const f=e.length-1,j=H[1]-H[0];for(let F=0;F<f;F++){const y=Math.min(1,Math.max(0,me*f-F));if(y<=0)continue;const oe=c(e[F][0],e[F][1]),X=c(e[F+1][0],e[F+1][1]),le=Math.min(1,Math.max(0,De*f-F)),ce=Math.max(0,v-(H[0]+(F+1)/f*j)),Se=le*(.2*Math.exp(-ce*.5)+.8*Math.exp(-ce*1.1))*(1-We*.85);le<1&&u(oe[0],oe[1],oe[2],X[0],X[1],X[2],1,1,1,.95*(1-le),1.7,0,y,0),Se>.01&&(u(oe[0],oe[1],oe[2],X[0],X[1],X[2],.5,.8,1,Se,3.4,0,1,0),u(oe[0],oe[1],oe[2],X[0],X[1],X[2],1,1,1,Se*.7,1.3,0,1,0),m.set((oe[0]+X[0])/2,(oe[1]+X[1])/2,(oe[2]+X[2])/2,1.3,.35,.65,1,.7*Se,0)),le<1&&m.set((oe[0]+X[0])/2,(oe[1]+X[1])/2,(oe[2]+X[2])/2,.5,.8,.9,1,.14*y,0)}for(const F of s)for(let y=0;y<F.length-1;y++){const oe=Math.min(1,Math.max(0,me*1.4-.3-y*.35));if(oe<=0)continue;const X=c(F[y][0],F[y][1]),le=c(F[y+1][0],F[y+1][1]),ce=Math.min(1,Math.max(0,De*1.3-.15+.12*y)),Se=Math.max(0,v-(H[0]+j*(.2+.25*y))),Ne=ce*Math.exp(-Se*1.1)*(1-We);ce<1&&u(X[0],X[1],X[2],le[0],le[1],le[2],1,1,1,.8*(1-ce),1.2,0,oe,0),Ne>.01&&u(X[0],X[1],X[2],le[0],le[1],le[2],.5,.8,1,Ne*.8,2.2,0,1,0)}if(Be>0){const F=Be*(1-We),y=-.62,oe=.74,X=.78,le=3.5,ce=.24,Se=(Ne,Ge,Je,Ve)=>{const Ae=c(Ne,Ge),Ke=c(Ne+Je*ce,Ge),He=c(Ne,Ge+Ve*ce);u(Ae[0],Ae[1],Ae[2],Ke[0],Ke[1],Ke[2],.6,.88,1,.9*F,1.8,0,1,0),u(Ae[0],Ae[1],Ae[2],He[0],He[1],He[2],.6,.88,1,.9*F,1.8,0,1,0)};Se(y,X,1,1),Se(oe,X,-1,1),Se(y,le,1,-1),Se(oe,le,-1,-1)}if(De>0&&De<1){const F=L(De),y=c(F[0],F[1],.08);m.set(y[0],y[1],y[2],1.9,.45,.75,1,.8,0),m.set(y[0],y[1],y[2],.55,1,1,1,1.6,0),m.set(y[0],y[1],y[2],2.2,.8,.95,1,.7,3),C.set(y[0],y[1],y[2],1.4,ae.yaw,.6,.85,1,.6,1,v*1.7%1*.8+.1,.08)}}{const f=Y(te.dial[0],te.dial[0]+1.2,v)*(1-Y(te.dial[1]-1.2,te.dial[1],v));if(f>.01){const j=qe(te.dialTurn[0],te.dialTurn[1],v),F=j*Math.PI*2,y=je(te.dial[0],te.dial[0]+1.5,v);for(let ce=0;ce<h;ce++){const Se=ce/h*Math.PI*2,Ne=ce%6===0;if(y*h<ce)continue;const Ge=F>Se?Math.exp(-(F-Se)*.35):0,Je=Math.exp(-Math.pow(F-Se,2)*30),Ve=ce>=h/2?1:0,Ae=I(Se,Ne?.78:.86),Ke=I(Se,1),He=Ve?[.2,.42,1]:[.62,.86,1],ct=Math.min(1,Ge*.85+Je);u(Ae[0],Ae[1],Ae[2],Ke[0],Ke[1],Ke[2],He[0]+(1-He[0])*ct*.6,He[1]+(1-He[1])*ct*.6,1,(.45+.55*ct)*f,Ne?2.6:1.5,0,1,0)}for(let ce=0;ce<48;ce++){if(y*48<ce)continue;const Se=ce/48*Math.PI*2,Ne=(ce+1)/48*Math.PI*2,Ge=I(Se,1.02),Je=I(Ne,1.02),Ve=ce>=24;u(Ge[0],Ge[1],Ge[2],Je[0],Je[1],Je[2],Ve?.25:.7,Ve?.5:.9,1,(Ve?.5:.75)*f,1.8,0,1,0)}const oe=I(F,.8),X=I(F+Math.PI,.14),le=I(0,0);u(X[0],X[1],X[2],oe[0],oe[1],oe[2],.85,.96,1,.95*f,2.8,0,1,1.1),m.set(le[0],le[1],le[2],.5,.85,.96,1,.9*f,0),m.set(oe[0],oe[1],oe[2],.5,.7,.9,1,.7*f,0),re.set(se.x+K[0]*.02,se.y,se.z+K[1]*.02,se.r*2.1,se.yaw,.5,.78,1,.5*f,5,F,.9)}}A.setCount(Math.max(Q,1)),A.dirty(),m.commit(),C.commit(),re.commit()}return{group:w,update:Qe,sents:_,T_SEAL:H,dispose(){R.dispose(),E.dispose(),_.forEach(v=>{v.orb.material.dispose(),v.beamMat.dispose()}),A.dispose(),m.dispose(),C.dispose(),re.dispose(),U.dispose()}}}const st=.4,nt={emerge:34.8,land:35.3,toTile:36,pick:36.6,back:37.3,set:38.1,step:38.8,down:39.35,out:44.4},Uo=`
${Oe}
varying vec3 vN, vW;
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  #ifdef MIRROR
    N.y = -N.y;
  #endif
  float s = dot(N, V);
  if (s < 0.) N = -N;
  float ndv = clamp(abs(s), 0., 1.);
  float fr = pow(1. - ndv, 2.2);
  vec3 R = reflect(-V, N);
  vec3 env = envBlue(vW, R);
  vec3 irid = .5 + .5 * cos(6.2832 * (vec3(0., .33, .67) + fr * 1.1 + vW.y * .2));
  // polished blue glass: a body that glows from inside, the room in its surface, a bright iridescent rim
  vec3 col = S(vec3(.20, .46, .95)) * (.30 + .22 * N.y + .28 * pow(ndv, 1.4)) + env * (.22 + .8 * fr);
  col += mix(S(vec3(.70, .88, 1.)), irid, .4) * fr * 1.9;
  col += S(vec3(.92, .97, 1.)) * pow(max(dot(R, normalize(vec3(.35, .65, -.65))), 0.), 24.) * 1.8;
  // a warm kiss from the machine when they are close
  float db = distance(vW, uBoxL.xyz);
  col += S(vec3(1., .72, .36)) * exp(-db * db * .7) * uBoxL.w * (.3 + fr) * .8;
  #ifdef MIRROR
    col *= .2 * exp(-max(-vW.y, 0.) * .9);    // the floor holds only a faint reflection: the mark must never read as a doubled mark
  #endif
  // glass: it shines, and it dims what is behind it
  float a = clamp(.5 + .38 * fr + .18 * (1. - ndv), 0., .96);
  #ifdef MIRROR
    a *= .4;
  #endif
  gl_FragColor = vec4(dawnTintP(col, vW), a);
}`;function Ko(o,d,l,i,n,ve){const $=new Xe,w=d.dir,A=a=>new _e({uniforms:{...l,uTime:i.uTime},defines:a?{MIRROR:1}:{},vertexShader:`varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vec3 n = normalize(mat3(modelMatrix) * normal);
      #ifdef MIRROR
        w.y = -w.y; n.y = -n.y;
      #endif
      vW = w.xyz; vN = n; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:Uo,side:et,transparent:!0,depthWrite:!1,blending:Yt,blendEquation:Zt,blendSrc:Xt,blendDst:jt}),m=[A(!1),A(!0)],C=[0,1].map(a=>go(a,.55)),Q=C.map(a=>{const e=new Xe,s=new Ie(a.geometry,m[0]),c=new Ie(a.geometry,m[1]);s.position.set(0,a.geometry.boundingBox.max.y,0),c.position.copy(s.position);for(const p of[s,c])p.frustumCulled=!1,p.renderOrder=6;return c.renderOrder=5,e.add(s,c),$.add(e),{piv:e,real:s,refl:c,s:a}}),u=C[0].geometry.boundingBox.max.y-C[0].geometry.boundingBox.min.y;Q.forEach(a=>{a.real.position.y=u/2,a.refl.position.y=u/2,a.piv.scale.setScalar(st)});const R=yt(10,l,i),E=ut(8,l,i,"floor",{order:-26});$.add(R.mesh,E.mesh);const _=a=>n.deskAt(0,a),q=(a,e,s)=>{const c=_(a);return[c.x+Math.cos(c.yaw)*e+Math.sin(c.yaw)*s,c.z-Math.sin(c.yaw)*e+Math.cos(c.yaw)*s]},Z=a=>_(a).lift+.775,Me=.56*w,he=-.2,xe=[Me,he],ge=[.3*w,.5],ue=[-.95*w,.5],ke=[.15*w,.52],V=[1.12*w,.5],B=Wt(d,d.exit.door,1),D=d.exit.lane,J=a=>q(a,1.5*w,.98),r=d.ring.a*Math.sqrt(Math.max(0,1-Math.pow((D-d.ring.cz)/d.ring.b,2)))*w,N=r+2.6*w,we=a=>{const e={x:0,y:0,z:0,gait:0,phase:0,lean:0,squash:0,scale:1,look:w,vis:1},s=nt,c=(h,k)=>{e.x=h[0],e.z=h[1],e.y=k},p=(h,k,K,I)=>q(h,k[0]+(K[0]-k[0])*I,k[1]+(K[1]-k[1])*I);if(a<s.emerge)return e.vis=0,c(q(a,Me,he),Z(a)+.5),e;if(a<s.land){const h=(a-s.emerge)/(s.land-s.emerge),k=ve.state.h,K=q(a,xe[0],xe[1]),I=q(a,ge[0],ge[1]);return e.x=K[0]+(I[0]-K[0])*h,e.z=K[1]+(I[1]-K[1])*h,e.y=Z(a)+k*(1-h)+Math.sin(Math.PI*h)*.55,e.scale=.3+.7*je(0,.5,h),e.squash=-.12*Math.sin(Math.PI*Math.min(1,h*1.2)),e.look=w,e}if(a<s.toTile){const h=qe(s.land+.12,s.toTile,a),k=p(a,ge,ue,h);return c(k,Z(a)),e.gait=1,e.phase=h*3,e.lean=-.12*w,e.look=-w,e}if(a<s.pick){const h=(a-s.toTile)/(s.pick-s.toTile);return c(q(a,ue[0],ue[1]),Z(a)+Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(h-.3)/.5))))*.42),e.squash=h<.3?.16*Math.sin(Math.PI*h/.3):h<.8?-.14*Math.sin(Math.PI*(h-.3)/.5):.1*Math.exp(-(h-.8)*12),e.look=-w,e}if(a<s.back){const h=qe(s.pick,s.back,a),k=p(a,ue,ke,h);return c(k,Z(a)),e.gait=1,e.phase=3+h*3,e.lean=.1*w,e.look=w,e}if(a<s.set){const h=(a-s.back)/(s.set-s.back),k=h<.22?Math.sin(Math.PI*h/.22)*.2:0,K=Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(h-.22)/.4))))*.5,I=h>.62?Math.exp(-(h-.62)*11)*.14:0;return c(q(a,ke[0],ke[1]),Z(a)+K),e.squash=k-(K>0?.12*Math.sin(Math.PI*Math.min(1,(h-.22)/.4)):0)+I,e.look=w,e}if(a<s.step){const h=qe(s.set+.15,s.step,a),k=p(a,ke,V,h);return c(k,Z(a)),e.gait=.8,e.phase=6+h*2,e.lean=-.07*w,e.look=w,e}if(a<s.down){const h=(a-s.step)/(s.down-s.step),k=q(a,V[0],V[1]),K=J(a);return e.x=k[0]+(K[0]-k[0])*h,e.z=k[1]+(K[1]-k[1])*h,e.y=Z(a)*(1-h*h)+Math.sin(Math.PI*h)*.3,e.squash=h>.85?.2*Math.exp(-(h-.85)*18):-.1*Math.sin(Math.PI*h),e.look=w,e}const z=Math.min(1,(a-s.down)/(s.out-s.down)),L=z*z*(2-z),H=J(s.down),t=H[0],M=H[1],g=B.x-w*.2,b=g-w*1.2,P=[[t,M],[t+(b-t)*.35,D],[b,D],[g+w*1.6,D],[N,D]],W=P.slice(1).map((h,k)=>Math.hypot(h[0]-P[k][0],h[1]-P[k][1])),O=W.reduce((h,k)=>h+k,0);let pe=L*O,U=0;for(;U<W.length-1&&pe>W[U];)pe-=W[U],U++;const se=Math.min(1,pe/W[U]);return e.x=P[U][0]+(P[U+1][0]-P[U][0])*se,e.z=P[U][1]+(P[U+1][1]-P[U][1])*se,e.y=0,e.gait=1,e.phase=8+L*O/1.1,e.lean=.12*w,e.look=w,e},ye=(a,e=new de)=>{const s=we(a);return e.set(s.x,s.y+.4,s.z)},G=(a,e)=>{const s=a-Math.floor(a),c=((s-e*.5)%1+1)%1*2,p=c<1?Math.sin(Math.PI*c):0,z=c>1?Math.exp(-(c-1)*7)*(c<1.8?1:0):0;return{air:p,land:z,u:c}},ae=new de;function be(a,e){const s=we(a);R.reset(),E.reset();const c=ve.carry;if(c.w=Y(nt.toTile+.25,nt.toTile+.65,a),c.set=Y(nt.back+.3,nt.back+.75,a),$.visible=s.vis>0&&a<nt.out+6,!$.visible){R.commit(),E.commit();return}const p=1.42,z=ve.state.top;ae.set(s.x,s.y+p+.55*(1-c.set)*0,s.z),c.pos.copy(ae),c.set>0&&c.pos.lerp(z,je(0,1,c.set));for(let H=0;H<2;H++){const t=Q[H],M=s.phase,g=G(M,H),b=s.gait,P=g.air*b,W=g.land*b,O=(1-b)*Math.sin(a*2.2+H*1.7)*.012,pe=1+.22*P-.3*W+s.squash+O,U=1/Math.sqrt(Math.max(pe,.4)),se=(1-b)*0+0,h=t.s.centre.x*st*s.scale,k=P*.24;t.piv.position.set(s.x+h*1+se,s.y+k*s.scale,s.z+t.s.centre.z*st),t.piv.scale.set(st*U*s.scale,st*pe*s.scale,st*s.scale),t.piv.rotation.z=s.lean*b+s.lean*.4*(1-b)+(b>0?.16*Math.sin(M*Math.PI*2+H*Math.PI):0)+Math.sin(a*1.6+H)*.01*(1-b);const K=t.piv.position.x,I=t.piv.position.z;if(W>.04){E.set(K,s.y+.006,I,1.1,0,.55,.82,1,.6*W,0);const re=Math.min(1,(g.u-1)/.8);E.set(K,s.y+.007,I,1.9,0,.7,.92,1,.7*(1-re)*(1-re),1,.1+re*.8,.06+.05*re)}}R.set(s.x,s.y+.45*st*2,s.z,2.4*s.scale,.45,.75,1,.12*s.vis,0);const L=Math.abs(s.x-r);if(s.y<.2&&a>nt.down&&L<3){const H=1-L/3;R.set(r,.6,D,3.4,.6,.86,1,.5*H*H,0)}R.commit(),E.commit()}return{group:$,update:be,at:ye,pose:we,ringX:r,lane:D,dispose(){m.forEach(a=>a.dispose()),C.forEach(a=>a.geometry.dispose()),R.dispose(),E.dispose()}}}function _o(o,d,l,i){const n=new Xe,ve=o.tall?5.5:11,$=o.back+.6,w=o.tall?24:15,A=gt({count:i,shared:l,atten:1,fog:.01,core:.6,uniforms:{uDT:d.uT,uDD:d.uDawn,uDK:{value:0},uDW:{value:ve},uDZ:{value:new at($,w)}},pt:`
      uniform float uDT, uDD, uDK, uDW; uniform vec2 uDZ;
      float hh(float n){ return fract(sin(n * 127.1) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        vec3 b = vec3(hh(id) * 2. - 1., hh(id + 7.), hh(id + 13.));
        pos = vec3(b.x * uDW, .12 + b.y * b.y * 5.6, uDZ.x + b.z * uDZ.y);
        pos += vec3(sin(uTime * .21 + id), sin(uTime * .33 + id * 1.7) * .45, cos(uTime * .17 + id * .7)) * .7;
        float tw = .5 + .5 * sin(uTime * (.7 + hh(id + 3.) * 1.7) + id);
        size = .035 + .06 * hh(id + 5.) * hh(id + 5.);
        col = vec4(mix(vec3(.5, .78, 1.), vec3(1., .84, .55), uDD), (.18 + .5 * tw) * uDK * (.4 + .6 * hh(id + 11.)));
      }`});A.mesh.renderOrder=8;const m=gt({count:64,shared:l,atten:1,fog:0,core:.8,uniforms:{uFD:d.uDawn,uFK:{value:0}},pt:`
      uniform float uFD, uFK;
      float hh(float n){ return fract(sin(n * 91.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float a = (hh(id) - .5) * 2.5, dist = 90. + hh(id + 3.) * 110.;
        float tall = step(.82, hh(id + 5.));
        pos = vec3(sin(a) * dist, .3 + tall * (2. + hh(id + 7.) * 6.), -cos(a) * dist - 10.);
        float tw = .6 + .4 * sin(uTime * (.4 + hh(id + 9.)) + id * 3.);
        size = (.9 + hh(id + 11.) * 1.8) * (1. + tall);
        col = vec4(mix(vec3(.42, .68, 1.), vec3(1., .86, .6), uFD), (.22 + .3 * hh(id + 13.)) * tw * uFK);
      }`});return m.mesh.renderOrder=1,n.add(A.mesh,m.mesh),{mesh:n,U:A.U,far:m.U,dispose(){A.dispose(),m.dispose()}}}const Vo=o=>`
uniform float uFlood, uFR, uRay, uAna, uDawn;
uniform vec2 uSun;
vec3 look(vec2 uv){
  vec3 c = samp(uv) + bloom(uv) * (.52 - .22 * uDawn);
  // the window's rays: what is bright streams away from it through the glass and the furniture
  if (uRay > .001) {
    vec2 d = (uSun - uv) * (.85 / ${o}.);
    vec2 p = uv + d * (.3 * h12(uv * 913.));
    vec3 acc = vec3(0.); float w = 1.;
    for (int i = 0; i < ${o}; i++) { p += d; acc += max(textureLod(tWorld, p, 2.5).rgb - vec3(.45), 0.) * w; w *= ${Math.pow(.96,24/o).toFixed(3)}; }
    c += acc * mix(vec3(.55, .78, 1.), vec3(1., .82, .5), uDawn) * uRay * ${(.034*24/o).toFixed(4)};
  }
  if (uAna > .001) {
    vec3 a = vec3(0.);
    for (int i = -6; i <= 6; i++) { float fi = float(i); a += max(textureLod(tWorld, uv + vec2(fi * .018, 0.), 3.).rgb - vec3(.7), 0.) * exp(-fi * fi * .06); }
    c += a * mix(vec3(.5, .75, 1.), vec3(1., .85, .55), uDawn) * uAna * .07;
  }
  c = mix(vec3(luma(c)), c, 1. + .3 * smoothstep(.0, .6, uRay));   // the warm light must not grey the blue it falls on
  float r = length((uv - .5) * vec2(uAsp, 1.));
  c *= 1. - (.16 + .22 * uDawn) * smoothstep(.45, 1.15, r);
  // the light takes the frame: it blooms from the window outward, ragged at its edge, until the frame is pivot G
  float rr = length((uv - uSun) * vec2(uAsp, 1.)) + (fbm(uv * 3.2 + vec2(uTime * .05, 0.)) - .5) * .4;
  float fl = max(smoothstep(uFR + .55, uFR - .15, rr), uFlood);
  return mix(c, pivotG(uv), fl);
}`,Ut={en:["Quotes","Records","Voice","Films","Messages"],ar:["عروض الأسعار","السجلات","الصوت","الأفلام","الرسائل"]};async function Yo(o){await uo(fo);const d=await xo(o),l=Mo(),i=ho(o,{atlas:d,pin:"F",pout:"G",inW:.07,outW:.075,frag:Vo(Ct(o,12,18,24)),uniforms:{uFlood:{value:0},uFR:{value:-1},uRay:{value:0},uAna:{value:0},uDawn:l.uDawn,uSun:{value:new at(.5,.5)}}}),n=new ro(48,o.viewport.aspect,.05,400),ve=o.lang==="ar"?-1:1,$=()=>o.viewport.aspect<.72,w=new de;function A(Q){const u=ko(Q,ve);l.uWin.value.set(u.win.cx,(u.win.y0+u.win.y1)/2,u.win.hw,(u.win.y1-u.win.y0)/2),l.uWall.value.set(u.back,1,0,0),l.uPlate.value.set(u.plate.A.hx,u.plate.A.hz,.5,u.plate.A.cz),l.uPlateA.value.set(u.plate.A.hx,u.plate.A.hz,.5,u.plate.A.cz);const R=new Xe;i.world.add(R);const E=Ao(l,i.G),_=Ro(l,i.G),q=Et(l,i.G,!1),Z=Et(l,i.G,!0),Me=new at((u.win.hw+5.5)*2,u.win.y1-u.win.y0+8),he=(u.win.y0+u.win.y1)/2;for(const N of[q,Z])N.mat.uniforms.uSize.value.copy(Me),N.mesh.position.set(u.win.cx,he,u.back-.06);const xe=Fo(u,l,i.G),ge=o.lang==="ar"?Ut.ar:Ut.en,ue=Do(o,u,l,i.G,xe,ge,Q),ke=Eo(o,u,l,i.G,xe),V=No(o,u,l,i.G,xe,ke,d),B=Ko(o,u,l,i.G,xe,ue),D=_o(u,l,i.G,Ct(o,220,380,640));R.add(E.mesh,_.mesh,q.mesh,Z.mesh,xe.group,ue.group,ke.group,V.group,B.group,D.mesh);const J=Po(u,B.at),r=[E.mat,_.mat,q.mat,Z.mat];return{L:u,group:R,machine:ue,update(N,we,ye){const G=qe(43.3,44.7,N),ae=Y(46,47.6,N),be=1-Y(1.2,4.5,N);l.uT.value=N,l.uDawn.value=ae,l.uFront.value.set(-6+36*Y(44,46.6,N)+30*Y(46.2,47.6,N),u.win.cx,he,u.back),l.uSky.value.set(.26+.74*be+.06*Y(41,43.2,N)+.85*G*(1-.5*ae),.5+.5*be+.2*G,0,0);const a=.5+.5*(1-Y(4,9,N))+.6*Y(40.6,43.2,N);l.uWall.value.set(u.back,a+.9*G,G,0);const e=po(o,we,ye),s=J(N);n.position.copy(s.p),n.position.x+=e.x*.3,n.position.y+=e.y*.15,n.lookAt(s.l),s.roll&&n.rotateZ(s.roll),Math.abs(n.fov-s.fov)>.001&&(n.fov=s.fov,n.updateProjectionMatrix()),n.updateMatrixWorld(),E.mesh.position.copy(n.position),_.mesh.position.set(n.position.x,0,n.position.z),V.update(N,n),xe.update(N,G),B.update(N,n),ue.update(N,n),ke.update(N,n,o.viewport.height),D.U.uDK.value=Y(2.5,5,N);const c=o.viewport.height/(2*Math.tan(n.fov*Math.PI/360));D.U.uAtten.value=c,D.far.uAtten.value=c,D.far.uFK.value=Y(3,7,N),w.set(u.win.cx,he,u.back).project(n);const p=w.z>1?1:0;i.U.uSun.value.set(p?5:w.x*.5+.5,p?5:w.y*.5+.5);const z=Y(47.5,48,N);i.U.uFR.value=-.7+3.4*Y(45.2,47.7,N),i.U.uRay.value=Y(43.4,44.8,N)*(1-.6*z),i.U.uAna.value=Math.max(.3*Y(2,5,N),Y(43.6,45,N))*(1-z),i.U.uFlood.value=z},dispose(){i.world.remove(R),E.mesh.geometry.dispose(),_.mesh.geometry.dispose(),q.mesh.geometry.dispose(),Z.mesh.geometry.dispose(),r.forEach(N=>N.dispose()),xe.dispose(),ue.dispose(),ke.dispose(),V.dispose(),B.dispose(),D.dispose()}}}let m=$(),C=A(m);return C.machine.prewarm(!0),await i.warm(n),C.machine.prewarm(!1),{scene:i.scene,camera:n,update({p:Q,t:u,dt:R,v:E}){i.tick(u,E),i.setP(Q),C.update(Q*yo,u,R),i.draw(n)},resize(){i.resize(),n.aspect=o.viewport.aspect,n.updateProjectionMatrix(),$()!==m&&(m=$(),C.dispose(),C=A(m))},dispose(){C.dispose(),i.dispose()}}}export{Yo as default};
