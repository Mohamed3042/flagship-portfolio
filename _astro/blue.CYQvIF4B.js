import{z as e0,e as Ke,r as _e}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{C as o0,p as ye,F as Re,l as ke,M as a0,h as pe,f as s0,s as n0,b as Fe,c as i0,a as c0}from"./lines.BmTVWBym.js";import{g as r0,a as l0}from"./glyphs.ZiKOGUMk.js";import{f as ee,b as v0,af as Ve,ag as $e,ai as Qe,V as vt,d as _t,v as Ge,M as It,T as He,c as ue,A as Yt,k as ae,s as te,G as Xt,as as u0,x as d0,u as p0,aj as je,a7 as Xe,al as Ze,a9 as Ye,Q as Ce,a as f0,B as Me,ao as h0,P as m0}from"./three.module.pheUvn1h.js";import{r as he}from"./rig.ELttsU0l.js";import{l as x0,b as Be}from"./glow.woDtGN2v.js";import{s as w0}from"./mk.DfSSqgEe.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const y0=48,Y=(o,v,l)=>e0(o,v,l),jt=(o,v,l)=>Ke.out(_e(o,v,l)),qt=(o,v,l)=>Ke.inOut(_e(o,v,l));function g0(){return{uT:{value:0},uDawn:{value:0},uWin:{value:new ee(0,1.95,2.1,1.25)},uWall:{value:new ee(-4.8,1,0,0)},uBoxL:{value:new ee(1.4,1.3,-.9,0)},uPlate:{value:new ee(7.2,4.8,.5,0)},uPlateA:{value:new ee(7.2,4.8,.5,0)},uGhost:{value:0},uFog:{value:.014},uSky:{value:new ee(1,1,0,0)},uFront:{value:new ee(-8,0,2,-4.8)}}}const Ot=`
${o0}
uniform float uT, uDawn, uTime, uFog;
uniform vec4 uWin, uWall, uBoxL, uPlate, uPlateA, uSky, uFront;
uniform float uGhost;

const vec3 ICE = vec3(.62, .80, 1.);
vec3 dawnTint(vec3 c){ float l = luma(c); return mix(c, vec3(l) * vec3(1.55, 1.1, .6) + c * vec3(.10, .04, .0), uDawn); }

float dawnK(vec3 P){ return smoothstep(uFront.x + 2.5, uFront.x - 2.5, length(P - uFront.yzw)); }
vec3 dawnTintP(vec3 c, vec3 P){
  float k = max(uDawn, dawnK(P)), l = luma(c);
  float q = (length(P - uFront.yzw) - uFront.x) / 1.2;
  vec3 g = vec3(l) * vec3(1.35, 1.0, .58) + c * vec3(.10, .04, .0);
  return mix(c, g, k) + S(vec3(1., .86, .56)) * exp(-q * q) * .26 * step(0., uFront.x);
}

vec3 skyBase(vec3 d){
  float ty = d.y / max(length(d.xz), 1e-3);
  vec3 a = mix(S(vec3(.05, .16, .46)), S(vec3(.006, .022, .11)), smoothstep(0., .5, ty));
  vec3 b = mix(S(vec3(.03, .10, .30)), S(vec3(.003, .012, .06)), smoothstep(0., .45, -ty));
  return mix(b, a, step(0., d.y));
}

float skyGlow(vec3 d){
  vec2 g = d.xy / max(-d.z, .06) / .89;
  vec2 q = g / (vec2(.85, .5) * uSky.y);
  return exp(-dot(q, q) * 2.4) * step(d.z, -.02) * uSky.x;
}

vec3 envBlue(vec3 P, vec3 R){
  vec3 c = skyBase(R) * .9 + S(vec3(.8, .9, 1.)) * skyGlow(R) * .5;
  float t = (uWall.x - P.z) / min(R.z, -1e-3);
  vec3 H = P + R * max(t, 0.);
  vec2 q = abs(H.xy - uWin.xy) - uWin.zw;
  float inside = (1. - smoothstep(-.2, .5, max(q.x, q.y))) * step(0., t) * step(R.z, -1e-3);
  c += mix(S(vec3(.78, .9, 1.)), S(vec3(1., .84, .52)), max(uDawn, uWall.z)) * inside * uWall.y * 1.25;
  return c;
}

vec3 hazeCol(){ return S(vec3(.04, .13, .37)) * .75; }
`;class De{constructor(v){this.cap=v;const l=new v0(1,1,1);this.geo=new Ve,this.geo.index=l.index,this.geo.setAttribute("position",l.getAttribute("position")),this.geo.setAttribute("normal",l.getAttribute("normal")),this.geo.setAttribute("uv",l.getAttribute("uv"));const i=()=>{const n=new $e(new Float32Array(v*4),4);return n.setUsage(Qe),n};this.A=i(),this.B=i(),this.C=i(),this.D=i(),this.geo.setAttribute("iA",this.A),this.geo.setAttribute("iB",this.B),this.geo.setAttribute("iC",this.C),this.geo.setAttribute("iD",this.D),this.geo.instanceCount=0}geo;A;B;C;D;n=0;reset(){this.n=0}add(v,l,i,n,ut,$,w,A,m,C,Q,d,R=0,E=1,_=0){if(this.n>=this.cap)return;const q=this.n++;this.A.setXYZW(q,v,l,i,n),this.B.setXYZW(q,ut,$,w,A),this.C.setXYZW(q,m,C,Q,d),this.D.setXYZW(q,R,E,_,0)}commit(){this.geo.instanceCount=this.n,this.A.needsUpdate=this.B.needsUpdate=this.C.needsUpdate=this.D.needsUpdate=!0}dispose(){this.geo.dispose()}}const M0=`
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
}`,Je=`
float boxEdge(){
  vec3 a = max(vHalf - abs(vL), 0.);
  vec3 an = abs(vNl);
  float de = 1e3;
  de = mix(de, min(a.y, a.z), step(.5, an.x));
  de = mix(de, min(a.x, a.z), step(.5, an.y));
  de = mix(de, min(a.x, a.y), step(.5, an.z));
  return de;
}`,b0=(o,v)=>[v[0]*o,v[1],v[2]*o];function z0(o,v){if(!o){const i={tall:o,dir:v,wallH:3.6,back:-4.8,plate:{A:{hx:7.2,hz:4.8,cz:0},B:{hx:5.6,hz:6,cz:1.2}},win:{cx:0,hw:2.1,y0:.7,y1:3.2},ring:{a:10.6,b:8.2,cz:-.2},desks:[{A:[1.4,-.9,0],B:[.4,-1.5,0]},{A:[4.7,-1.4,0],B:[3.5,-.2,-.55]},{A:[-1.4,1.9,0],B:[-2.7,-.3,.55]},{A:[2.2,2.6,0],B:[-1.9,3,.2]},{A:[5,2.6,0],B:[2.4,3.3,-.2]}],counter:{A:[-3.2,-1.8,0],B:[-5.2,-1.4,Math.PI/2],len:4.6},shelf:{A:[-5.1,-4.45,0],B:[-5,-4.45,0],w:3.4},doors:[{side:1,at:-2.4,w:1.1,h:2.3},{side:1,at:1.5,w:1.1,h:2.3},{side:0,at:5,w:1.1,h:2.3}],gate:Math.PI+.1,spire:[-14.2,-1],strip:{x:4.5,y:2.95,z:-4.55,yaw:0,w:2.2,h:.8},crack:{x:2.95,z:-4.74,yaw:0,w:1.8,h:2.5},dial:{x:7.04,y:2.4,z:-.45,r:1,yaw:-Math.PI/2},exit:{door:1,lane:1.5},box:{y:.74}};return qe(i)}const l={tall:o,dir:v,wallH:3.6,back:-8.6,plate:{A:{hx:3.9,hz:8.6,cz:0},B:{hx:3.5,hz:9.8,cz:1.2}},win:{cx:0,hw:1.6,y0:.7,y1:3.3},ring:{a:6.6,b:11.8,cz:-.2},desks:[{A:[.9,-4.4,0],B:[.2,-4.6,0]},{A:[-1.4,-.6,0],B:[-1.6,-1.8,.5]},{A:[1.4,1.2,0],B:[1.7,-1.2,-.5]},{A:[-1.3,4.6,0],B:[-1.3,3,.2]},{A:[1.4,6.3,0],B:[1.4,4.8,-.2]}],counter:{A:[-2,-7,0],B:[-3,-6.4,Math.PI/2],len:3.2},shelf:{A:[-3.55,-3.3,Math.PI/2],B:[-3.1,-7.9,0],w:3},doors:[{side:1,at:-3.6,w:1.1,h:2.3},{side:1,at:2.4,w:1.1,h:2.3},{side:0,at:2.6,w:1.1,h:2.3}],gate:Math.PI+.13,spire:[-12.4,-1.6],strip:{x:3.78,y:2.85,z:-6.4,yaw:-Math.PI/2,w:2.4,h:.8},crack:{x:-2.9,z:-8.54,yaw:0,w:1.5,h:2.5},dial:{x:3.82,y:2.4,z:-1.1,r:.9,yaw:-Math.PI/2},exit:{door:0,lane:-3.6},box:{y:.74}};return qe(l)}function qe(o){const v=o.dir;if(v===1)return o;const l=i=>b0(v,i);return o.desks=o.desks.map(i=>({A:l(i.A),B:l(i.B)})),o.counter={...o.counter,A:l(o.counter.A),B:l(o.counter.B)},o.shelf={...o.shelf,A:l(o.shelf.A),B:l(o.shelf.B)},o.doors=o.doors.map(i=>i.side===0?{...i,at:i.at*v}:{...i,side:i.side*v}),o.gate=Math.PI-o.gate,o.spire=[o.spire[0]*v,o.spire[1]],o.strip={...o.strip,x:o.strip.x*v,yaw:o.strip.yaw*v},o.crack={...o.crack,x:o.crack.x*v},o.dial={...o.dial,x:o.dial.x*v,yaw:o.dial.yaw*v},o.win={...o.win,cx:o.win.cx*v},o}const oe={t0:31.6,t1:35.2},be=(o,v)=>qt(oe.t0+o*.22,oe.t1-.9+o*.22,v),S0=o=>qt(oe.t0,oe.t1,o);function We(o,v,l){const i=o.doors[v],n=Le(o,l);return i.side===0?{x:i.at,z:o.back,yaw:0,nx:0,nz:1}:{x:i.side*n.hx,z:i.at,yaw:Math.PI/2,nx:-i.side,nz:0}}function Le(o,v){const l=o.plate.A,i=o.plate.B;return{hx:l.hx+(i.hx-l.hx)*v,hz:l.hz+(i.hz-l.hz)*v,cz:l.cz+(i.cz-l.cz)*v}}const ze=(o,v,l)=>[o[0]+(v[0]-o[0])*l,o[1]+(v[1]-o[1])*l,o[2]+(v[2]-o[2])*l],xe=(o,v)=>[o.ring.a*Math.cos(v),o.ring.cz+o.ring.b*Math.sin(v)];function P0(o,v){const l=o.dir,i=A=>[A[0]*l,A[1],A[2]],n=(A,m,C,Q=48,d={})=>({t:A,p:i(m),l:i(C),fov:Q,...d}),ut=new vt,$=(A,m,C,Q=44,d={})=>{const R=v(A,ut);return{t:A,p:[R.x+m[0]*l,R.y+m[1],R.z+m[2]],l:[R.x+C[0]*l,R.y+C[1],R.z+C[2]],fov:Q,...d}},w=(A,m,C,Q,d,R)=>{const E=[];for(let _=A;_<=m+1e-6;_+=C)E.push($(+_.toFixed(2),Q,d,R));return E};return o.tall?he([n(0,[0,1.55,11.5],[0,1.55,-6],48),n(2.4,[.6,2,5.6],[.2,1.6,-8.6],52),n(4.8,[1.9,2.5,-.6],[1,1.15,-5],58),n(6.1,[1.8,3.4,1.4],[1,1.2,-5],58),n(8.3,[1,10,8],[.6,.2,-4.4],58),n(10.8,[0,24,17.5],[0,0,-2.2],56),n(14.6,[.4,23.4,18],[0,0,-2.4],56),n(16.4,[-.8,12,11.8],[2.6,.6,-2],62),n(18.5,[-1.6,3.2,4.6],[3.9,1.5,1.6],62),n(20,[-1.4,3.2,1.6],[3.9,1.7,-3.2],62),n(21.2,[-1,3.2,-2.6],[1.2,2.5,-7.4],62),n(22.2,[-2.4,3.4,-1],[-2,2.3,-8.6],60),n(23.6,[-2.4,3.4,-1],[-2.2,2.2,-8.6],60),n(25,[-.6,4,1.6],[.8,1.4,-5.2],60),n(26.4,[1.6,2.4,-.6],[1.5,1.4,-4.8],58),n(29.6,[1.6,3.2,1.4],[1.4,3.7,-4.8],62),n(31.8,[1.6,3.2,1.2],[1.4,3.7,-4.8],62),n(33.6,[.2,9,4.2],[.2,0,-3.4],62),n(35,[.2,7,3.6],[.3,.6,-4.2],60),n(36,[.8,4.4,.2],[.4,1.2,-4.8],56),n(36.9,[.8,3.4,2.4],[.3,1.35,-4.8],54),n(37.9,[1,3.2,2.2],[.5,1.4,-4.8],52),n(38.9,[-.4,2.8,2.4],[.9,1,-4.2],54),...w(39.8,41.8,.4,[-1.7,2.3,4.9],[.1,.3,0],56),n(43.2,[-1.2,4.6,3],[1.2,1,-4],58),n(44.4,[.4,3.2,3.2],[0,2.1,-8.6],58),n(46.4,[0,2.1,-3],[0,2.1,-8.6],60),n(48,[0,2,-6.4],[0,2,-8.6],62)]):he([n(0,[0,1.55,11.5],[0,1.55,-6],48),n(2.4,[1.2,1.95,9.6],[.4,1.5,-3],48),n(4.8,[2.4,2.1,4],[1.6,1.3,-1],44),n(5.9,[2.8,2.6,5.4],[1.5,1.1,-1],45),n(8.2,[2.2,5.8,11.4],[.6,.4,-1.2],47),n(10.4,[-.4,9,16.8],[-.9,0,-1.2],48),n(14.8,[.2,8.6,16.6],[-.4,0,-1],47),n(16.4,[1.5,5.2,10.6],[3.6,1,-.2],46),n(18.3,[4.7,1.7,3.6],[7.2,1.5,1.5],40),n(19.8,[4.8,1.8,1.2],[7.2,1.5,-2.3],40),n(21,[3.4,2.3,1.8],[6.4,1.8,-3.2],42),n(22.1,[3.7,2.6,2.4],[5,2.1,-4.4],42),n(23.4,[3.4,2.8,2.8],[4.9,2.2,-4],42),n(26.4,[3.4,2.6,4.6],[2.1,1.4,-.9],46),n(29.6,[2.2,2.9,4.6],[1.9,2.6,-1],46),n(31.8,[2.2,2.8,4.6],[1.8,2.6,-1],46),n(33.3,[.7,5.4,9.2],[1,1,-.9],49),n(34.2,[.3,9.2,9],[.4,.2,-.3],50),n(35.4,[.4,6,10],[.4,.6,-.8],48),n(36,[.4,4,7.8],[.4,1,-1.4],46),n(36.9,[.2,3,5.8],[.3,1.25,-1.4],42),n(37.9,[.6,2.9,5.5],[.5,1.3,-1.4],40),n(38.9,[-.3,2.5,5.6],[.9,1,-.8],42),...w(40.2,41.9,.55,[-1.5,1.9,4.5],[1.7,.25,0],45),n(43.1,[3.6,2.8,9.2],[4.2,1,-.6],48),n(44.2,[2.5,2.7,7.6],[1.5,1.8,-3],50),n(45.2,[1.3,2.5,5.2],[.3,2,-4.8],52),n(46.5,[.2,2.1,1],[0,2,-4.8],54),n(48,[0,2,-2.6],[0,2,-4.8],60)])}const k0="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }";function W0(o,v){const l=new _t({uniforms:{...o,uTime:v.uTime},side:Ge,depthTest:!1,depthWrite:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); gl_Position = p.xyww; }",fragmentShader:`
      ${Ot}
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

        float sr = max(uDawn, uWall.z * .85);
        float up = max(ty, 0.);
        vec3 sun = mix(mix(S(vec3(1., .80, .54)), S(vec3(.60, .36, .46)), smoothstep(0., .28, up)), S(vec3(.09, .075, .30)), smoothstep(.18, .75, up));
        sun = mix(sun, mix(S(vec3(.70, .44, .34)), S(vec3(.10, .07, .20)), smoothstep(0., .45, -ty)), below);
        sun += S(vec3(1., .88, .62)) * gl * (.8 + .6 * uDawn) + S(vec3(1., .90, .70)) * h * .6;
        gl_FragColor = vec4(mix(col, sun, sr), 1.);
      }`}),i=new It(new He(100,40,20),l);return i.frustumCulled=!1,i.renderOrder=-100,{mesh:i,mat:l}}function A0(o,v){const l=new _t({uniforms:{...o,uTime:v.uTime},transparent:!0,depthWrite:!1,depthTest:!0,vertexShader:k0,fragmentShader:`
      ${Ot}
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

        float dz = max(vW.z - uWall.x, 0.);
        float wx = (vW.x - uWin.x) / max(uWin.z * 1.3 + dz * .55, .5);
        tint += S(vec3(.5, .74, 1.)) * exp(-wx * wx) * exp(-dz * .16) * .05 * (1. + inP) * step(uWall.x, vW.z);

        float cell = mix(1.8, .6, inP);
        vec2 g = vW.xz / cell, fw = fwidth(g);
        vec2 f = abs(fract(g - .5) - .5);
        float gl = (1. - smoothstep(0., 1.4, min(f.x / max(fw.x, 1e-4), f.y / max(fw.y, 1e-4)))) * (1. - smoothstep(.12, .4, max(fw.x, fw.y)));
        tint += S(vec3(.34, .56, 1.)) * gl * mix(.03, .05, inP) * exp(-dist * .045);

        float dA = sdRBox(vW.xz - vec2(0., uPlateA.w), uPlateA.xy, uPlateA.z);
        vec2 ga = vW.xz - vec2(0., uPlateA.w);
        float dash = step(.5, fract(atan(ga.y, ga.x) * 9.5));
        tint += S(vec3(.5, .78, 1.)) * exp(-abs(dA) / (max(fwidth(dA), 1e-4) * 1.2)) * dash * uGhost * .5 * exp(-dist * .02);

        float pw = max(fwidth(dP), 1e-4);
        tint += S(vec3(.55, .80, 1.)) * (exp(-abs(dP) / (pw * 1.3)) * .85 + exp(-abs(dP) * 6.) * .10) * exp(-dist * .02);

        float opn = uWall.z;
        float spread = 1. + dz * .1;
        float wxs = (vW.x - uWin.x) / (uWin.z * spread);
        float inWin = smoothstep(1.08, .92, abs(wxs)) * (1. - .75 * exp(-pow(wxs / .045, 2.))) * exp(-dz * .05) * step(uWall.x, vW.z);
        tint += S(vec3(1., .86, .58)) * inWin * opn * (.6 + inP * .35) * smoothstep(0., 1.2, dz);
        vec3 col = dawnTintP(tint, vW);
        gl_FragColor = vec4(col, 1. - Rf);
      }`}),i=new It(new ue(500,500),l);return i.rotation.x=-Math.PI/2,i.frustumCulled=!1,i.renderOrder=-50,{mesh:i,mat:l}}function Ee(o,v,l){const i=new _t({uniforms:{...o,uTime:v.uTime,uSize:{value:new ae(5,3)}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Yt,defines:l?{MIRROR:1}:{},vertexShader:`varying vec2 vQ; varying vec3 vW; uniform vec2 uSize;
      void main(){ vQ = position.xy * uSize; vec4 w = modelMatrix * vec4(position * vec3(uSize, 1.), 1.); vW = w.xyz;
        #ifdef MIRROR
          w.y = -w.y;
        #endif
        gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      ${Ot}
      varying vec2 vQ; varying vec3 vW;
      void main(){

        vec2 hw = uWin.zw;
        float d = sdRBox(vQ, hw, .12);
        float soft = mix(.22, 2.2, uWall.z);
        float a = smoothstep(soft, -.02, d);
        float core = exp(-dot(vQ / (hw * 1.15), vQ / (hw * 1.15)) * 1.2);
        vec3 cool = S(vec3(.80, .91, 1.)), warm = S(vec3(1., .88, .58));

        float hz = vQ.y / hw.y + .32;
        float sky = mix(1.12, .46, smoothstep(0., 1.4, hz));
        float lum = mix(.34 + .1 * smoothstep(-1.4, 0., hz), sky, smoothstep(-.05, .05, hz)) + exp(-hz * hz * 70.) * .5;
        lum = mix(lum, mix(.7, 1.15, smoothstep(-hw.y, hw.y, vQ.y)), smoothstep(0., .7, uWall.z));
        vec3 c = mix(cool, warm, max(uDawn, uWall.z)) * (a * (.5 + .7 * core) * lum + exp(-max(d, 0.) * 2.2) * .12) * uWall.y;
        #ifdef MIRROR
          c *= .5 * exp(-max(-vW.y, 0.) * .5);
        #endif
        gl_FragColor = vec4(c, 1.);
      }`}),n=new It(new ue(1,1),i);return n.frustumCulled=!1,n.renderOrder=-45,{mesh:n,mat:i}}const Te=`
float pattern(float kind, vec2 q, float a, float b){
  float r = length(q);
  float edge = 1. - smoothstep(.82, 1., r);
  if (kind < .5) return (pow(max(1. - r, 0.), 2.2) * .55 + exp(-r * r * 18.) * .95) * edge;
  if (kind < 1.5) { float k = (r - a) / max(b, .015); return exp(-k * k) * edge; }
  if (kind < 2.5) return exp(-abs(q.x) * 2.2) * exp(-q.y * q.y * 90.) * (1. - smoothstep(.9, 1., abs(q.x)));
  if (kind < 3.5) { vec2 s = abs(q); return (exp(-s.x * 34.) * exp(-s.y * 3.2) + exp(-s.y * 34.) * exp(-s.x * 3.2)) * edge * .8 + exp(-r * r * 60.); }
  if (kind > 5.5) {
    vec2 p = q * 1.25;
    float body = sdRBox(p - vec2(0., -.2), vec2(.36, .27), .09);
    float arch = abs(length(p - vec2(0., .14)) - .25) - .055;
    arch = max(arch, -(p.y - .1));
    float dd = min(abs(body) - .028, arch);
    return (smoothstep(.03, -.01, dd) + smoothstep(.02, -.02, body) * .16) * (1. - smoothstep(.82, 1., r)) * a;
  }
  if (kind > 4.5) {
    float da = mod(a - atan(q.x, q.y), 6.2831853);
    return exp(-da / max(b, .05)) * step(da, 5.6) * smoothstep(.2, .42, r) * (1. - smoothstep(.8, .98, r)) * .4;
  }
  vec2 s = abs(q); return smoothstep(1., .35, max(s.x, s.y)) * (.35 + .65 * smoothstep(1., .0, r));
}`;function t0(o){const v=new ue(2,2),l=new Ve;l.index=v.index,l.setAttribute("position",v.getAttribute("position")),l.setAttribute("uv",v.getAttribute("uv"));const i=()=>{const w=new $e(new Float32Array(o*4),4);return w.setUsage(Qe),w},n=i(),ut=i(),$=i();return l.setAttribute("aP",n),l.setAttribute("aC",ut),l.setAttribute("aF",$),l.instanceCount=0,{geo:l,P:n,C:ut,F:$}}function ge(o,v,l,i={}){const{geo:n,P:ut,C:$,F:w}=t0(o);let A=0;const m=new _t({uniforms:{...v,uTime:l.uTime},transparent:!0,depthWrite:!1,depthTest:i.depthTest??!0,blending:Yt,vertexShader:`
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
      ${Ot}
      ${Te}
      varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        float v = pattern(vF.x, vQ, vF.y, vF.z);
        vec3 c = dawnTint(vCol.rgb) * vCol.a * v * ${i.fog===!1?"1.":"exp(-uFog * vD * .5)"};
        if (max(c.r, max(c.g, c.b)) < .002) discard;
        gl_FragColor = vec4(c, 1.);
      }`}),C=new It(n,m);return C.frustumCulled=!1,C.renderOrder=i.order??6,{mesh:C,cap:o,reset(){A=0},set(Q,d,R,E,_,q,Z,Mt,pt=0,xt=0,yt=0){A>=o||(ut.setXYZW(A,Q,d,R,E),$.setXYZW(A,_,q,Z,Mt),w.setXYZW(A,pt,xt,yt,0),A++)},commit(){n.instanceCount=A,ut.needsUpdate=$.needsUpdate=w.needsUpdate=!0},dispose(){n.dispose(),m.dispose()}}}function de(o,v,l,i,n={}){const{geo:ut,P:$,C:w,F:A}=t0(o);let m=0;const C=new _t({uniforms:{...v,uTime:l.uTime},transparent:!0,depthWrite:!1,depthTest:n.depthTest??!0,blending:Yt,side:te,vertexShader:`
      attribute vec4 aP, aC, aF; varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        float c = cos(aF.w), s = sin(aF.w);
        ${i==="floor"?"vec3 R = vec3(c, 0., -s), U = vec3(s, 0., c) * -1.;":"vec3 R = vec3(c, 0., -s), U = vec3(0., 1., 0.);"}
        vec3 w = aP.xyz + (R * position.x + U * position.y) * aP.w * .5;
        vec4 mv = viewMatrix * vec4(w, 1.);
        gl_Position = aC.a <= .0005 || aP.w <= 0. ? vec4(2., 2., 2., 1.) : projectionMatrix * mv;
        vQ = position.xy; vCol = aC; vF = aF; vD = length(mv.xyz);
      }`,fragmentShader:`
      ${Ot}
      ${Te}
      varying vec2 vQ; varying vec4 vCol, vF; varying float vD;
      void main(){
        float v = pattern(vF.x, vQ, vF.y, vF.z);
        vec3 c = dawnTint(vCol.rgb) * vCol.a * v * exp(-uFog * vD * .5);
        if (max(c.r, max(c.g, c.b)) < .002) discard;
        gl_FragColor = vec4(c, 1.);
      }`}),Q=new It(ut,C);return Q.frustumCulled=!1,Q.renderOrder=n.order??-30,{mesh:Q,cap:o,reset(){m=0},set(d,R,E,_,q,Z,Mt,pt,xt,yt=0,dt=0,St=0){m>=o||($.setXYZW(m,d,R,E,_),w.setXYZW(m,Z,Mt,pt,xt),A.setXYZW(m,yt,dt,St,q),m++)},commit(){ut.instanceCount=m,$.needsUpdate=w.needsUpdate=A.needsUpdate=!0},dispose(){ut.dispose(),C.dispose()}}}const Ie=`
${Ot}
varying vec3 vW, vN, vL, vNl, vHalf; varying vec4 vC; varying float vK, vRev, vSeed;
${Je}
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

  vec3 glowC = vC.rgb * vC.a;

  vec2 uq = vL.xy / max(vHalf.xy, vec2(1e-3));
  float faceZ = step(.5, abs(vNl.z));
  float rows = floor((uq.y * .5 + .5) * 7.);
  float rl = h12(vec2(rows, vSeed * 13.));
  float row = step(.35, fract((uq.y * .5 + .5) * 7.)) * step(uq.x * .5 + .5, .25 + rl * .7) * step(.15, rl) * step(-.9, uq.x);
  float chart = step(.3, uq.y) * step(uq.x, .85) * smoothstep(.0, .05, (uq.x * .5 + .5) * .6 - (uq.y - .3) * .8 + sin(uq.x * 5. + vSeed) * .1 + .15 - .05);
  float ui = (.5 + .5 * row * .9 + .15 * h12(floor(vL.xy * 40.) + vSeed)) * (1. - .35 * smoothstep(.85, 1., max(abs(uq.x), abs(uq.y))));
  col += isScreen * faceZ * glowC * ui * 1.2;
  col += isScreen * (1. - faceZ) * glowC * .15;

  col = mix(col, glowC * 1.6, isStrip);

  float inner = .35 + .65 * smoothstep(1., 0., length(vec3(vL / max(vHalf, vec3(1e-3)))) * .75);
  col += isItem * glowC * inner * .9;

  vec3 tb = uBoxL.xyz - vW; float db = length(tb);
  col += S(vec3(1., .74, .38)) * max(dot(N, tb / max(db, .01)), 0.) * uBoxL.w * .75 * exp(-db * db * .55);

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
}`,Oe=`
${Ot}
varying vec3 vW, vN, vL, vNl, vHalf; varying vec4 vC; varying float vK, vRev, vSeed;
${Je}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  float s = dot(N, V); N *= s < 0. ? -1. : 1.;
  float ndv = clamp(abs(s), 0., 1.);
  float dist = length(cameraPosition - vW);

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

  float fillY = mix(.026, .006, smoothstep(0., 3.4, vW.y));
  float band = smoothstep(.0, .05, vW.y - 1.05) * (1. - smoothstep(.0, .05, vW.y - 1.5));
  float grain = fbm(vW.xz * 3.1 + vW.y * 2.3);
  vec3 col = (S(vec3(.34, .58, 1.)) * (fillY * big + fr * .28) + env * .05 * big + S(vec3(.5, .76, 1.)) * band * big * (.02 + .035 * grain)) * grad;

  float gs = vL.x * .42 - vL.y * .62 + vW.x * .07 + vW.z * .11;
  float glare = smoothstep(.0, .18, fract(gs)) * (1. - smoothstep(.18, .5, fract(gs))) * .5 + smoothstep(.55, .7, fract(gs * 1.7 + .3)) * (1. - smoothstep(.7, .78, fract(gs * 1.7 + .3))) * .35;

  float sq = (dot(vW.xz, vec2(.7, .7)) * .9 + vW.y * .5 - mod(uTime * .35, 24.) + 8.) * .5;
  float sw = exp(-sq * sq);
  col += S(vec3(.7, .88, 1.)) * sw * .05 * big;
  col += S(vec3(.55, .8, 1.)) * glare * big * .028 * (.6 + .4 * smoothstep(0., 3., vW.y));

  float leaf = step(1.5, vK) * step(vK, 2.5), bar = step(.5, vK) * step(vK, 1.5), wglass = step(2.5, vK);
  col += S(vec3(.4, .66, 1.)) * leaf * (.05 + fr * .4);
  col += wglass * (S(vec3(.8, .92, 1.)) * (.05 + fr * .6) * (1. + uWall.z * 1.5));
  float flashAmt = vC.a;
  float rev = 1. + (1. - vRev) * 3.;
  col += S(vec3(.45, .72, 1.)) * lineE2 * .24 * rev * step(.5, bar + leaf);
  col += mix(S(vec3(.55, .8, 1.)), S(vec3(.9, .96, 1.)), flashAmt) * (lineE * (mix(1.25, .8, big) + flashAmt * 2.4) + softE * (mix(.12, .07, big) + flashAmt * .5)) * mix(1., 1.35, bar) * rev;

  col += S(vec3(.5, .78, 1.)) * flashAmt * leaf * .3 * exp(-(pow(vL.x / max(vHalf.x, .05), 2.) * 1.7 + pow(vL.y / max(vHalf.y, .05) + .05, 2.) * 1.2)) * (.7 + .6 * grain);
  col *= vRev;
  #ifdef MIRROR
    col *= .62 * exp(-max(-vW.y, 0.) * .3);
  #endif
  col *= exp(-dist * uFog * 1.2);
  gl_FragColor = vec4(dawnTintP(col, vW), 1.);
}`;function R0(o,v,l){const i=new De(128),n=new De(128),ut=(V,B,D)=>new _t({uniforms:{...v,uTime:l.uTime},vertexShader:M0,fragmentShader:V,defines:B?{MIRROR:1}:{},side:D?te:B?Ge:d0,transparent:D,depthWrite:!D,depthTest:!0,blending:D?Yt:u0}),$=[ut(Ie,!1,!1),ut(Ie,!0,!1),ut(Oe,!1,!0),ut(Oe,!0,!0)],w=new Xt,A=(V,B,D)=>{const J=new It(V.geo,B);return J.frustumCulled=!1,J.renderOrder=D,w.add(J),J};A(i,$[0],0),A(i,$[1],0),A(n,$[2],-40),A(n,$[3],-40);const m=de(24,v,l,"floor",{order:-32});w.add(m.mesh);const C=V=>Math.sin(V),Q=V=>Math.cos(V),d=(V,B,D,J,r,N,wt,gt,G,at,bt,a,t,s,c,f,z=1.4,L=0)=>{const H=B+Q(J)*r+C(J)*wt,e=D-C(J)*r+Q(J)*wt;V.add(H,N,e,J,gt,G,at,bt,a,t,s,c,f,z,L)},R=[.42,.72,1],E=[.72,.9,1],_=[.2,.46,1];function q(V,B,D,J,r){const N=[...B].sort((G,at)=>G.a-at.a);let wt=0;const gt=(G,at)=>{if(at-G<.1)return;const bt=Math.max(1,Math.ceil((at-G)/J)),a=(at-G)/bt;for(let t=0;t<bt;t++)r(G+t*a+.02,G+(t+1)*a-.02,0,D,0)};for(const G of N)gt(wt,G.a-.06),G.y0>.05&&r(G.a-.04,G.b+.04,0,G.y0-.02,0),G.y1<D-.05&&r(G.a-.04,G.b+.04,G.y1+.02,D,0),wt=G.b+.06;gt(wt,V)}const Z=new Float32Array(o.doors.length),Mt=new Float32Array(o.doors.length),pt=o.desks.map(()=>({x:0,z:0,yaw:0,lift:0})),xt={x:0,z:0,yaw:0,lift:0},yt={x:0,z:0,yaw:0,lift:0};function dt(V,B){const D=be(V,B),J=ze(o.desks[V].A,o.desks[V].B,D);return{x:J[0],z:J[1],yaw:J[2],lift:Math.sin(D*Math.PI)*.22,e:D}}function St(V,B){i.reset(),n.reset(),m.reset();const D=S0(V),J=Le(o,D),r=o.back,N=o.wallH;v.uPlate.value.set(J.hx,J.hz,.5,J.cz),v.uGhost.value=Y(oe.t0,oe.t0+1,V)*(1-Y(oe.t1+.2,oe.t1+2.6,V));const wt=.9;for(let a=0;a<o.desks.length;a++){const t=dt(a,V),s=wt+1.5+a*.28,c=t.lift;pt[a]=t;const f=[t.x,t.z,t.yaw],z=c,L=a===0?1.35:1;d(i,f[0],f[1],f[2],0,z+.74,0,a===0?2.5:2.2,.07,L,0,0,0,0,0,s,1.2),d(i,f[0],f[1],f[2],a===0?-1.1:-.98,z+.36,0,.06,.72,.9,0,0,0,0,0,s+.1,1.2),d(i,f[0],f[1],f[2],a===0?1.1:.98,z+.36,0,.06,.72,.9,0,0,0,0,0,s+.1,1.2),d(i,f[0],f[1],f[2],0,z+.69,.47,a===0?2.3:2,.02,.02,2,E[0],E[1],E[2],1.6,s+.3,1);const H=a===0?-.6*o.dir:a%2?.35:-.35;d(i,f[0],f[1],f[2],H,z+.84,-.14,.08,.13,.08,0,0,0,0,0,s+.2,1),d(i,f[0],f[1],f[2],H,z+1.16,-.18,.92,.54,.04,1,R[0],R[1],R[2],1.15,s+.35,1.1,a*1.7+.3),d(i,f[0],f[1],f[2],a===0?-.4:a%2?.2:-.2,z+.24,.95,.46,.48,.46,0,0,0,0,0,s+.25,1.2),t.lift>.02&&m.set(t.x,.01,t.z,3.4,t.yaw,R[0],R[1],R[2],.55*Math.sin(t.e*Math.PI),4)}{const a=be(5,V),t=ze(o.counter.A,o.counter.B,a),s=Math.sin(a*Math.PI)*.2,c=o.counter.len,f=wt+1;Object.assign(xt,{x:t[0],z:t[1],yaw:t[2],lift:s}),d(i,t[0],t[1],t[2],0,s+.55,0,c,1.1,.85,0,0,0,0,0,f,1.5),d(i,t[0],t[1],t[2],0,s+1.13,0,c+.1,.06,.98,0,0,0,0,0,f+.15,1.2),d(i,t[0],t[1],t[2],0,s+.13,.43,c-.3,.03,.03,2,E[0],E[1],E[2],1.8,f+.35,1),d(i,t[0],t[1],t[2],c*.22,s+1.34,-.12,.58,.36,.05,1,R[0],R[1],R[2],1.1,f+.45,1,6.1),d(i,t[0],t[1],t[2],-c*.15,s+1.26,.05,.32,.2,.26,3,R[0],R[1],R[2],1,f+.5,1),d(i,t[0],t[1],t[2],-c*.3,s+1.22,-.1,.22,.12,.22,3,_[0],_[1],_[2],1,f+.55,1),d(i,t[0],t[1],t[2],-c*.02,s+1.2,-.14,.16,.08,.16,3,E[0],E[1],E[2],1.1,f+.6,1),s>.02&&m.set(t[0],.01,t[1],c*.9,t[2],R[0],R[1],R[2],.5*Math.sin(a*Math.PI),4)}{const a=be(6,V),t=ze(o.shelf.A,o.shelf.B,a),s=Math.sin(a*Math.PI)*.2,c=o.shelf.w,f=wt+.8;Object.assign(yt,{x:t[0],z:t[1],yaw:t[2],lift:s});const z=3,L=.5;d(i,t[0],t[1],t[2],-c/2,s+z/2,0,.06,z,L,0,0,0,0,0,f,1.5),d(i,t[0],t[1],t[2],c/2,s+z/2,0,.06,z,L,0,0,0,0,0,f+.1,1.5);for(let e=0;e<5;e++)d(i,t[0],t[1],t[2],0,s+.06+e*.72,0,c,.05,L,0,0,0,0,0,f+.2+e*.12,1.2);d(i,t[0],t[1],t[2],0,s+z/2,-L/2+.02,c-.06,z-.06,.02,0,0,0,0,0,f+.3,1.3);const H=[R,E,_,R,E];for(let e=0;e<4;e++){let M=-c/2+.2+e%2*.08;for(let y=0;y<4;y++){const b=.22+.2*((e*7+y*3)%4)/3,k=.24+.22*((e*5+y*2)%3)/2,W=.26+.08*((y+e)%2);if(M+b>c/2-.1)break;const O=H[(e+y)%5];d(i,t[0],t[1],t[2],M+b/2,s+.09+e*.72+.025+k/2,.02,b,k,W,3,O[0],O[1],O[2],.75+.35*((e+y)%3),f+.6+(e*4+y)*.06,1,e*4+y),M+=b+.16+.1*((e+y)%2)}}s>.02&&m.set(t[0],.01,t[1],c*1.1,t[2],R[0],R[1],R[2],.5*Math.sin(a*Math.PI),4)}const gt=J.hx,at=J.cz+J.hz-r,bt=.05;{const a=[{a:o.win.cx-o.win.hw+gt,b:o.win.cx+o.win.hw+gt,y0:o.win.y0,y1:o.win.y1}];o.doors.forEach((t,s)=>{t.side===0&&a.push({a:t.at-t.w/2+gt,b:t.at+t.w/2+gt,y0:0,y1:t.h})}),q(2*gt,a,N,3.4,(t,s,c,f)=>{const z=wt+.3+Math.abs((t+s)/2-gt)*.1;n.add(-gt+(t+s)/2,(c+f)/2,r,0,s-t,f-c,bt,0,0,0,0,0,z,1.6,0)})}for(const a of[-1,1]){const t=[];o.doors.forEach(c=>{c.side===a&&t.push({a:c.at-r-c.w/2,b:c.at-r+c.w/2,y0:0,y1:c.h})});const s=a*gt;q(at,t,N,3.2,(c,f,z,L)=>{const H=wt+.5+c/at*.8+(a>0?.1:0);n.add(s,(z+L)/2,r+(c+f)/2,Math.PI/2,f-c,L-z,bt,0,0,0,0,0,H,1.6,0)})}{const a=o.win.hw,t=B*a*1.02,s=o.win.cx,c=o.win.y1-o.win.y0,f=(o.win.y0+o.win.y1)/2,z=wt+1.1;n.add(s-a/2-t,f,r+.07,0,a-.03,c-.04,.03,3,0,0,0,0,z,1.8,0),n.add(s+a/2+t,f,r+.07,0,a-.03,c-.04,.03,3,0,0,0,0,z,1.8,0),n.add(s,o.win.y0-.03,r+.02,0,a*2+.1,.06,.08,1,0,0,0,0,z+.2,1.2,0),n.add(s,o.win.y1+.03,r+.02,0,a*2+.1,.06,.08,1,0,0,0,0,z+.2,1.2,0),n.add(s-a-.03,f,r+.02,0,.06,c+.12,.08,1,0,0,0,0,z+.3,1.2,0),n.add(s+a+.03,f,r+.02,0,.06,c+.12,.08,1,0,0,0,0,z+.3,1.2,0),n.add(s,(o.win.y0+o.win.y1)/2,r+.02,0,.05,c,.06,1,0,0,0,0,z+.35,1.2,0)}o.doors.forEach((a,t)=>{const s=We(o,t,D),c=Z[t],f=Mt[t],z=wt+1.8+t*.22,L=s.x,H=s.z,e=s.yaw,M=a.w-.1,y=a.h-.04,b=C(e)*s.nx+Q(e)*s.nz,k=c*.03*b,W=Q(f),O=C(f),ft=W*M/2-M/2,U=-O*M/2+k;n.add(L+Q(e)*ft+C(e)*U,y/2+.02,H-C(e)*ft+Q(e)*U,e+f,M,y,.045,2,0,0,0,c,z,1.5,0),n.add(L-Q(e)*(a.w/2-.02),a.h/2,H+C(e)*(a.w/2-.02),e,.07,a.h,.1,1,0,0,0,c,z+.1,1.2,0),n.add(L+Q(e)*(a.w/2-.02),a.h/2,H-C(e)*(a.w/2-.02),e,.07,a.h,.1,1,0,0,0,c,z+.1,1.2,0),n.add(L,a.h+.01,H,e,a.w+.1,.07,.1,1,0,0,0,c,z+.15,1.2,0),d(i,L,H,e+f,M/2-.12,1.02,k,.03,.22,.1,2,E[0],E[1],E[2],1.6+c*3,z+.4,1)}),i.commit(),n.commit(),m.commit()}return{group:w,update:St,deskAt:dt,deskXZ:pt,counterXZ:xt,shelfXZ:yt,doorFlash:Z,doorWob:Mt,dispose(){i.dispose(),n.dispose(),m.dispose(),$.forEach(V=>V.dispose())}}}const fe=Math.PI/180,Lt={w:.92,d:.92,h:.92},Se={w:1.3,d:.78,h:.62},Et=4.4,Tt={a:26.6,b:28.3,c:33.2,d:35.4},we={open:34.6,set1:38.1,shut:38.9},F0=`
${Ot}
${a0}
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

    float core = uCore * exp(-r * r * 1.5);
    float glare = smoothstep(.0, .5, dot(q, vec2(-.6, .8)) + .15) * (1. - smoothstep(.5, 1.2, dot(q, vec2(-.6, .8)) + .15)) * .5;
    col = amber * (.12 + .55 * core + .25 * uOpenK) + hot * core * .5 + amber * fr * .8 + hot * glare * (.08 + .12 * uCore);
    float k = min(uFace.x * .66, uFace.y * 1.3) / 3.87;
    float dm = sdMK(pq / k) * k;
    float isMark = step(uFace.z, 4.5);
    float fill = smoothstep(px * 1.2, -px * 1.2, dm) * isMark;
    col = mix(col, hot * 2.4, fill * .95) + amber * exp(-max(dm, 0.) / .07) * .55 * isMark * (.4 + uCore);

    float wall = step(uFace.z, 3.5);
    float vy = (q.y + .9) * 4.2;
    float slot = smoothstep(.3, .22, abs(fract(vy) - .5)) * step(abs(q.x), .62) * step(0., vy) * step(vy, 3.);
    col = max(col - amber * slot * .32 * wall, 0.) + hot * slot * wall * .04;
    float led = 0.;
    for (int i = 0; i < 3; i++) led += smoothstep(.07, .03, length(q - vec2(.56 - .14 * float(i), .8))) * (.55 + .45 * sin(uTime * (1.7 + float(i) * .6) + float(i) * 2.));
    col += hot * led * wall * 1.6;
  } else {

    vec2 f = abs(fract(pq * 3.4 - .5) - .5) / (fwidth(pq * 3.4) + 1e-4);
    float grid = 1. - smoothstep(0., 1.3, min(f.x, f.y));
    col = mix(amber, hot, exp(-r * r * 2.)) * (.7 + 1.5 * uCore) * (.55 + .45 * uOpenK) + amber * .25;
    col += hot * grid * .22 * (.4 + exp(-r * r * 1.2)) + hot * exp(-abs(r - .45) * 14.) * .22 * uOpenK;
  }
  col += hot * (edge * 2.1 + edge2 + edgeSoft * .4) * (.6 + .6 * uCore);
  gl_FragColor = vec4(dawnTintP(col, vW) * inside, 1.);
}`,C0=`
${Ot}
uniform vec2 uSize; uniform float uIcon, uWarm, uAlpha, uSeed;
varying vec2 vQ;
float sdTri(vec2 p, vec2 a, vec2 b, vec2 c){
  vec2 e0 = b - a, e1 = c - b, e2 = a - c, v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 q0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0., 1.), q1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0., 1.), q2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0., 1.);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(q0, q0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(q1, q1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(q2, q2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}

float pic(float id, vec2 p, float t){
  float d = 1e3;
  if (id < .5) {
    float page = abs(sdRBox(p, vec2(.50, .66), .09)) - .035;
    d = min(page, sdRBox(p - vec2(-.06, .30), vec2(.26, .035), .035));
    d = min(d, sdRBox(p - vec2(-.06, .10), vec2(.26, .035), .035));
    d = min(d, sdRBox(p - vec2(-.16, -.10), vec2(.16, .035), .035));
    d = min(d, abs(length(p - vec2(.17, -.32)) - .13) - .03);
  } else if (id < 1.5) {
    for (int i = 0; i < 3; i++) {
      float y = (float(i) - 1.) * .44;
      float row = abs(sdRBox(p - vec2(0., y), vec2(.62, .15), .15)) - .032;
      float dot_ = length(p - vec2(-.42, y)) - .06;
      float bar = sdRBox(p - vec2(.1 + .1 * sin(t * 1.3 + float(i) * 2.), y), vec2(.26, .028), .028);
      d = min(d, min(row, min(dot_, bar)));
    }
  } else if (id < 2.5) {
    for (int i = 0; i < 9; i++) {
      float k = float(i) - 4.;
      float h = (.12 + .62 * abs(sin(t * 2.4 + k * .85 + uSeed)) * (1. - abs(k) * .16));
      d = min(d, sdRBox(p - vec2(k * .15, 0.), vec2(.045, h), .045));
    }
  } else if (id < 3.5) {
    float fr = abs(sdRBox(p, vec2(.66, .46), .1)) - .035;
    float tri = sdTri(p - vec2(.04, 0.), vec2(-.2, .26), vec2(-.2, -.26), vec2(.3, 0.));
    d = min(fr, tri);
    d = min(d, sdRBox(p - vec2(-.5, 0.), vec2(.018, .34), .018));
    d = min(d, sdRBox(p - vec2(.5, 0.), vec2(.018, .34), .018));
  } else {
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

  vec3 col = mix(S(vec3(.03, .10, .30)), S(vec3(.01, .035, .13)), smoothstep(-1., 1., vQ.y)) * .9;
  col += ink * .035 * smoothstep(.2, -.9, vQ.y);
  col += S(vec3(.5, .75, 1.)) * .05 * smoothstep(.1, 1., dot(vQ, vec2(-.7, .7)));

  float l1 = exp(-abs(d + .004) / (px * 1.4)), l2 = exp(-abs(d + .05) / (px * 1.2)) * .35;
  col += ink * (l1 * 1.7 + l2 + exp(min(d, 0.) / .06) * .16);
  vec2 cq = abs(vQ * uSize * .5) - (uSize * .5 - .12);
  col += ink * 1.3 * step(0., min(cq.x, cq.y)) * step(max(cq.x, cq.y), .06) * .6;

  vec2 ip = (p - vec2(0., .12)) / .36;
  float di = pic(uIcon, ip, uTime) * .36;
  float i0 = smoothstep(px * 1.2, -px * 1.2, di);
  col += ink * (i0 * 1.9 + exp(-max(di, 0.) / .055) * .3);
  col = mix(col, col * 1.0 + ink * .0, 0.);
  gl_FragColor = vec4(dawnTint(col) * inside * uAlpha, .9 * inside * uAlpha);
}`;function B0(o,v,l,i,n,ut,$){const w=new Xt,A=v.dir,m={value:.12},C={value:0},Q=new Xt;w.add(Q);const d=[],R=new ue(1,1),E=e=>{const M=new _t({uniforms:{...l,uTime:i.uTime,uFace:{value:new vt(1,1,e)},uCore:m,uOpenK:C},vertexShader:"varying vec2 vQ; varying vec3 vN, vW; void main(){ vQ = position.xy; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:F0,transparent:!0,depthWrite:!1,depthTest:!0,blending:Yt,side:te});d.push(M);const y=new It(R,M);return y.frustumCulled=!1,y.renderOrder=2,y},_=[0,1,2,3,4,5].map(()=>new Xt),q=[0,1,2,3,4,5].map(e=>E(e));_.forEach((e,M)=>{e.add(q[M]),Q.add(e)}),q[1].rotation.y=Math.PI,q[2].rotation.y=-Math.PI/2,q[3].rotation.y=Math.PI/2,q[4].rotation.x=-Math.PI/2,q[5].rotation.x=Math.PI/2;const Z=new _t({uniforms:{...l,uTime:i.uTime,uK:{value:0}},vertexShader:"varying vec3 vP; varying vec3 vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${Ot}
      uniform float uK; varying vec3 vP; varying vec3 vW;
      void main(){
        float u = vP.y + .5;
        float a = atan(vP.z, vP.x);
        float streak = .55 + .45 * sin(a * 9. + uTime * .9 + u * 3.) * sin(a * 5. - uTime * .6);
        float f = pow(clamp(1. - u, 0., 1.), 1.6) * smoothstep(0., .05, u);
        vec3 V = normalize(cameraPosition - vW);
        float rim = pow(clamp(1. - abs(dot(normalize(vec3(vP.x, 0., vP.z)), V)), 0., 1.), 1.2);
        vec3 c = S(vec3(1., .70, .30)) * f * streak * (.10 + .42 * rim) * uK;
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`,transparent:!0,depthWrite:!1,blending:Yt,side:te}),Mt=new It(new p0(.5,.36,1,28,1,!0),Z);Mt.frustumCulled=!1,Mt.renderOrder=1,w.add(Mt);const pt=ye({count:90,shared:i,atten:1,fog:.008,core:.9,uniforms:{uSB:{value:new vt},uSK:{value:0},uST:l.uT},pt:`
      uniform vec3 uSB; uniform float uSK, uST;
      float hh(float n){ return fract(sin(n * 91.3) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float life = 2.2 + hh(id) * 1.6;
        float a = mod(uST * (.55 + hh(id + 5.) * .3) + hh(id + 3.) * life, life) / life;
        float ang = hh(id + 7.) * 6.2832, rad = (.1 + .38 * hh(id + 9.)) * (.6 + .9 * a);
        pos = uSB + vec3(cos(ang + a * 2.) * rad, .1 + a * (1.3 + hh(id + 11.) * 1.5), sin(ang + a * 2.) * rad);
        size = (.03 + .05 * hh(id + 13.)) * (1. - a * .6);
        col = vec4(vec3(1., .78, .45), (1. - a) * smoothstep(0., .08, a) * uSK);
      }`});pt.mesh.renderOrder=9,w.add(pt.mesh);const xt=new ue(1,1),yt=1.4,dt=$?.86:.92,St=ut.map((e,M)=>{const y=new Xt,b=new _t({uniforms:{...l,uTime:i.uTime,uSize:{value:new ae(yt,dt)},uIcon:{value:M},uWarm:{value:1},uAlpha:{value:1},uSeed:{value:M*1.3}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xy * 2.; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:C0,transparent:!0,depthWrite:!1,depthTest:!0,blending:Ye,blendEquation:Ze,blendSrc:Xe,blendDst:je,side:te}),k=new It(xt,b);k.scale.set(yt,dt,1),k.frustumCulled=!1,k.renderOrder=7,y.add(k);const W=o.lang==="ar",O=x0(e,{font:W?Re.ar:Re.sans,px:150,weight:W?700:600,color:"#ffffff",align:"center",rtl:W});return O.U.uColor.value.setRGB(.9,1.3,1.9),O.mesh.position.set(0,-dt*.335,.01),O.set(dt*.2),O.mesh.renderOrder=8,y.add(O.mesh),y.visible=!1,w.add(y),{g:y,m:b,label:O}}),V=ke({count:12,shared:i,fog:.01});w.add(V.mesh);const B=ge(10,l,i);w.add(B.mesh);const D=de(6,l,i,"floor",{order:-20});w.add(D.mesh);const r={pos:new vt,w:Lt.w,d:Lt.d,h:Lt.h,yaw:0,core:.12,tileAt:[new vt,new vt,new vt,new vt,new vt],top:new vt},N=new vt,wt=new vt,gt=new vt,G=new vt(1,0,0),at=new Ce,bt=new Ce,a=new vt,t=new vt,s=new vt,c=(e,M,y)=>{if($){const W=2.55+e*.5,O=(e%2?.8:-.8)*A;return y.set(M.x+O,M.y+W,M.z-.4-e*.04)}const b=(e-2)*.6;return y.set(M.x+2.9*Math.sin(b)*A,M.y+2+.35*Math.cos(b)-Math.abs(e-2)*.06,M.z-.1-.7*(1-Math.cos(b)))},f=(e,M,y)=>{const b=n.counterXZ,k=n.shelfXZ,W=n.deskAt(2,M),O=n.deskAt(3,M),ft=n.deskAt(0,M),U=Math.sin(k.yaw),st=Math.cos(k.yaw);switch(e){case 0:return y.set(b.x,2.1+b.lift,b.z+.15);case 1:return y.set(k.x+U*1.35,2.15+k.lift,k.z+st*1.35);case 2:return y.set(W.x,1.95+W.lift,W.z-.1);case 3:return y.set(O.x,1.95+O.lift,O.z-.1);default:return y.set(ft.x+Math.cos(ft.yaw)*-1*A+Math.sin(ft.yaw)*.15,ft.lift+1.6,ft.z-Math.sin(ft.yaw)*-1*A+Math.cos(ft.yaw)*.15)}},z={pos:new vt,w:0,set:0};function L(e,M){gt.copy(M.position);const y=qt(33.4,35.4,e),b=Lt.w+(Se.w-Lt.w)*y,k=Lt.d+(Se.d-Lt.d)*y,W=Lt.h+(Se.h-Lt.h)*y,O=n.deskAt(0,e),ft=O.lift+.775,U=.56*A,st=-.2,p=N.set(O.x+Math.cos(O.yaw)*U+Math.sin(O.yaw)*st,ft+W/2+.005,O.z-Math.sin(O.yaw)*U+Math.cos(O.yaw)*st),S=1-jt(2.4,Et,e),K=Math.sin(e*1.9)*.07*S;r.pos.set(p.x+K,p.y+S*7.2,p.z+Math.sin(e*1.3)*.05*S),r.w=b,r.d=k,r.h=W,r.yaw=O.yaw,Q.position.copy(r.pos),Q.rotation.y=O.yaw;const I=Math.max(0,jt(Tt.a,Tt.b,e)-qt(Tt.c,Tt.d,e)),rt=Y(we.open,we.open+1,e)*(1-Y(we.set1,we.shut,e)),nt=tt=>jt(Tt.a+.15*tt,Tt.b+.1*tt,e)-qt(Tt.c+.1*tt,Tt.d,e),ht=Math.max(0,nt(1))*99*fe,kt=Math.max(0,nt(2))*88*fe,T=Math.max(0,nt(3))*82*fe,zt=Math.max(0,nt(4))*82*fe,Ut=[[b,W],[b,W],[k,W],[k,W],[b,k],[b,k]];q.forEach((tt,mt)=>{tt.scale.set(Ut[mt][0],Ut[mt][1],1),d[mt].uniforms.uFace.value.set(Ut[mt][0],Ut[mt][1],mt===5?5:mt)}),_[0].position.set(0,0,k/2),_[0].rotation.set(ht,0,0),q[0].position.set(0,W/2,0),_[1].position.set(0,0,-k/2),_[1].rotation.set(-kt,0,0),q[1].position.set(0,W/2,0),_[2].position.set(-b/2,0,0),_[2].rotation.set(0,0,T),q[2].position.set(0,W/2,0),_[3].position.set(b/2,0,0),_[3].rotation.set(0,0,-zt),q[3].position.set(0,W/2,0),at.setFromAxisAngle(G,-rt*38*fe),a.set(0,0,k/2).applyQuaternion(at).add(s.set(0,W,-k/2)),bt.setFromAxisAngle(G,Math.PI/2-.1),t.set(0,W+1.12*I+.02,-k*.12*I),_[4].quaternion.copy(at).slerp(bt,I),_[4].position.copy(a).lerp(t,I),q[4].position.set(0,0,0),_[5].position.set(0,0,0),q[5].position.set(0,0,0),Q.position.y=r.pos.y-W/2,C.value=Math.min(1,I+rt*.7);const $t=Math.exp(-Math.max(e-Et,0)*1.6)*(e>=Et?1:0),ie=.5+.08*Math.sin(e*2.1),Qt=.12+.38*Y(Et-.4,Et+.1,e)*0+(e<Et?.12:0)+$t*.95+(e>=Et?ie:0)*1+I*.55+rt*.35;m.value=Qt,r.core=Qt,l.uBoxL.value.set(r.pos.x,r.pos.y,r.pos.z,Math.min(1.1,(e>=Et-.6?.55:.2)*(.6+Qt*.6))),r.top.set(r.pos.x,r.pos.y+W/2,r.pos.z),pt.U.uSB.value.copy(r.top),pt.U.uSK.value=I,pt.U.uAtten.value=o.viewport.height/(2*Math.tan(M.fov*Math.PI/360));const u=I*.95+($t>.02,0);Z.uniforms.uK.value=u,Mt.visible=u>.01,Mt.position.set(r.pos.x,r.pos.y+W/2+1.3,r.pos.z),Mt.scale.set(b*.95,2.6,k*.95),V.clear(0),B.reset(),D.reset();let P=0;const x=r.pos.y+W/2+.12,it=Y(Et+.5,Et+2.4,e);if(e<Et+2.6&&(V.set(P++,r.pos.x,x,r.pos.z,r.pos.x,12,r.pos.z,.75,.9,1,.9,1.7,it,1,0),it<.98&&B.set(r.pos.x,x+it*(12-x)*0+.02,r.pos.z,.5,.8,.92,1,1.3,0)),e>=Et-.15){const tt=e-Et,mt=Math.exp(-Math.max(tt,0)*2.2);B.set(r.pos.x,r.pos.y,r.pos.z,3.8+mt*2,1,.66,.24,.5*mt+.08,0);for(let Bt=0;Bt<2;Bt++){const Dt=Math.max(0,tt-Bt*.28)/1.7;Dt>0&&Dt<1&&D.set(r.pos.x,ft+.006,r.pos.z,4.2,0,1,.72,.34,(1-Dt)*(1-Dt)*.9,1,Dt*.85+.08,.06+.05*Dt)}}if(e>=Et&&e<Et+2.6){const tt=(e-Et)/2.4,mt=1+tt*9.5;D.set(r.pos.x,.012,r.pos.z,mt*2,0,.7,.88,1,(1-tt)*(1-tt)*.6,1,.95,.018+.02*tt)}B.set(r.pos.x,r.pos.y,r.pos.z,4.5+Qt*2.5,1,.56,.16,.09+Qt*.1,0),I>.02&&B.set(r.pos.x,r.pos.y+.3,r.pos.z,2+I*1.6,1,.8,.5,.32*I,0);const Rt=Tt.a+1.6,Ft=r.pos;for(let tt=0;tt<St.length;tt++){const mt=St[tt],Bt=Rt+tt*.26,Dt=c(tt,Ft,wt),Wt=r.tileAt[tt],h=jt(Bt,Bt+1.3,e),j=qt(31.7+tt*.28,33.7+tt*.28,e);let F=.15+.85*h,g=Y(Bt,Bt+.5,e);if(mt.g.visible=e>Bt-.05,Wt.set(Ft.x,Ft.y+.2,Ft.z).lerp(Dt,h),Wt.y+=Math.sin(h*Math.PI)*.35,j>0&&(f(tt,e,N),Wt.lerp(N,j),Wt.y+=Math.sin(j*Math.PI)*.9,F=.15+.85*h-.34*j),Wt.y+=Math.sin(e*1.4+tt*1.3)*.035*j,tt===4&&z.w>0&&(Wt.lerp(z.pos,z.w),F=(.62+.1*z.w)*(1-.92*jt(0,1,z.set)),g=Math.max(g,z.w),z.set>.985&&(mt.g.visible=!1)),mt.g.position.copy(Wt),mt.g.rotation.y=Math.atan2(gt.x-Wt.x,gt.z-Wt.z),mt.g.scale.setScalar(Math.max(F,.001)),mt.m.uniforms.uAlpha.value=g,mt.m.uniforms.uWarm.value=Math.exp(-Math.max(0,e-(Bt+1))*1.2)*(1-j)+0+(1-Y(Bt,Bt+1,e))*0,H(mt,g*(mt.g.visible?1:0)),j>.02){const ot=j*(1-(tt===4?z.w:0));V.set(P++,r.top.x,r.top.y,r.top.z,Wt.x,Wt.y-dt*F*.5,Wt.z,.5,.8,1,.5*ot,1.2,0,Math.min(1,j*1.2),0)}mt.g.visible&&g>.05&&B.set(Wt.x,Wt.y,Wt.z,yt*2.1*F,.3,.6,1,.12*g,0)}V.dirty(),B.commit(),D.commit(),V.setCount(Math.max(P,1))}function H(e,M){e.label.U.uAlpha.value=M}return{group:w,state:r,carry:z,update:L,prewarm(e){for(const M of St)M.g.visible=e},dispose(){R.dispose(),xt.dispose(),d.forEach(e=>e.dispose()),St.forEach(e=>{e.m.dispose(),e.label.dispose()}),Z.dispose(),Mt.geometry.dispose(),V.dispose(),B.dispose(),D.dispose(),pt.dispose()}}}const Ct={draw0:6.8,draw1:10.3,shut0:11.1,shut1:12.6,longEnd:10.6},Zt=14,ve=256,D0="10.6",Ne=`
uniform float uDraw, uPerim, uHW, uRk;
uniform vec4 uRP[${Zt}];
uniform float uRU[${Zt}];

vec2 hits(float u){
  float fl = 0., wv = 0.;
  for (int i = 0; i < ${Zt}; i++){
    if (i == 0 && uT < ${D0}) continue;
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
`;function q0(o,v,l,i,n,ut){const $=new Xt;v.tall;const w=.9,A=v.gate,m=1024,C=new Float32Array(m+1);let Q=xe(v,A);for(let e=1;e<=m;e++){const M=xe(v,A+e/m*Math.PI*2);C[e]=C[e-1]+Math.hypot(M[0]-Q[0],M[1]-Q[1]),Q=M}const d=C[m],R=e=>{const M=(e%1+1)%1*d;let y=0,b=m;for(;b-y>1;){const W=y+b>>1;C[W]<=M?y=W:b=W}const k=(M-C[y])/Math.max(1e-6,C[b]-C[y]);return A+(y+k)/m*Math.PI*2},E=(e,M=0)=>{const y=R(e),b=xe(v,y);if(!M)return b;const k=Math.cos(y)/v.ring.a,W=Math.sin(y)/v.ring.b,O=Math.hypot(k,W);return[b[0]+k/O*M,b[1]+W/O*M]},_=[];for(let e=0;e<Zt;e++){const M=e===0?0:(e+(pe(e*3.1)-.5)*.5)/Zt,y=E(M),b=e===0?5:6.2+pe(e*1.7)*3.4,k=e===0?.6:pe(e*5.3)*b;_.push({f:.25+pe(e*7.9)*.5,E:y,u:M,period:b,phase:k,start:e===0?5.4:8.4+pe(e*2.2)*1.8})}const q=new vt,Z=v.spire,Mt=e=>{const M=new Float32Array((ve+1)*2*3),y=new Float32Array((ve+1)*2),b=new Float32Array((ve+1)*2),k=[];for(let O=0;O<=ve;O++){const ft=O/ve;for(let U=0;U<2;U++){const st=e?U:U*2-1,p=e?E(ft):E(ft,st*w),S=(O*2+U)*3;M[S]=p[0],M[S+1]=e?st*.95+.02:.012,M[S+2]=p[1],y[O*2+U]=ft,b[O*2+U]=st}if(O<ve){const U=O*2;k.push(U,U+1,U+2,U+1,U+3,U+2)}}const W=new f0;return W.setAttribute("position",new Me(M,3)),W.setAttribute("aU",new Me(y,1)),W.setAttribute("aV",new Me(b,1)),W.setIndex(k),W},pt={uDraw:{value:0},uPerim:{value:d},uHW:{value:w},uRk:{value:0},uRP:{value:_.map(e=>new ee(e.period,e.phase,e.f,e.start))},uRU:{value:_.map(e=>e.u)},uGateU:{value:0},uGlow:{value:0}},xt=e=>new _t({uniforms:{...l,uTime:i.uTime,...pt},transparent:!0,depthWrite:!1,depthTest:!0,blending:Yt,side:te,vertexShader:"attribute float aU, aV; varying float vU, vV, vD; void main(){ vU = aU; vV = aV; vec4 mv = modelViewMatrix * vec4(position, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:e}),yt=xt(`
      ${Ot}
      ${Ne}
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
      }`),dt=new It(Mt(!1),yt);dt.frustumCulled=!1,dt.renderOrder=-35;const St=xt(`
      ${Ot}
      ${Ne}
      uniform float uGateU;
      varying float vU, vV, vD;
      void main(){
        float arc = arcFrom(vU, uGateU);
        float drawn = smoothstep(uDraw + .004, uDraw - .02, arc) * step(.0005, uDraw);
        float h = clamp(vV, 0., 1.);
        vec2 hh = hits(vU);
        float flow = .55 + .45 * sin(vU * uPerim * 2.4 - uTime * .9 + h * 3.);
        float a = pow(1. - h, 2.4) * (.10 + .04 * flow) + (hh.y * .5 + hh.x * .7) * pow(1. - h, 1.4) * .5;
        float top = exp(-abs(h - .98) * 60.) * .06;
        vec3 c = mix(S(vec3(.16, .46, 1.)), S(vec3(.75, .92, 1.)), clamp(hh.x * .6, 0., 1.)) * (a + top) * drawn;
        c *= exp(-vD * uFog * .5);
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`),V=new It(Mt(!0),St);V.frustumCulled=!1,V.renderOrder=-34,$.add(dt,V);const B=ke({count:460,shared:i,fog:.006});$.add(B.mesh);const D=ge(48,l,i);$.add(D.mesh);const J=de(40,l,i,"floor",{order:-28});$.add(J.mesh);const r=xe(v,A),N=Math.cos(A)/v.ring.a,wt=Math.sin(A)/v.ring.b,gt=Math.hypot(N,wt),G=[N/gt,wt/gt],at=[-G[1],G[0]],bt=1.35,a=3.1,t=new _t({uniforms:{...l,uTime:i.uTime,uClose:{value:0},uLock:{value:0},uCalm:{value:0},uSize:{value:new ae(bt*2,a)}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      ${Ot}
      uniform float uClose, uLock, uCalm; uniform vec2 uSize;
      varying vec2 vQ;
      void main(){
        float h = vQ.y + .5;
        float edgeY = 1. - uClose;
        if (h < edgeY - .004) discard;
        vec2 p = vec2(vQ.x * uSize.x, (h - 1.) * uSize.y);
        float slat = (1. - h) * uSize.y / .2;
        float f = fract(slat), px = max(fwidth(slat), 1e-3);
        float line = smoothstep(px * 1.5 + .04, 0., abs(f - .5) - .46 + .04);
        float bar = exp(-(h - edgeY) * uSize.y / .06) * step(uClose, .999);
        float rim = exp(-abs(abs(vQ.x) - .5) * uSize.x / .05);
        vec3 ice = S(vec3(.72, .92, 1.)), blue = S(vec3(.16, .46, 1.));
        vec3 c = (blue * (.12 + .05 * f) + ice * (line * .6 + rim * .35)) * mix(1., .3, uCalm) + ice * bar * 2.4;

        vec2 lp = (p - vec2(0., -1.55)) / .42;
        float body = sdRBox(lp - vec2(0., -.22), vec2(.5, .38), .1);
        float shackle = abs(length(lp - vec2(0., .26) * vec2(1., 1.) - vec2(0., .06)) - .3) - .06;
        shackle = max(shackle, -(lp.y - .1));
        float lk = smoothstep(px * 2.4 + .01, -.01, min(abs(body) - .035, shackle)) * uLock;
        c += ice * lk * mix(1.8, .7, uCalm);
        gl_FragColor = vec4(dawnTint(c), 1.);
      }`,transparent:!0,depthWrite:!1,depthTest:!0,blending:Yt,side:te}),s=new It(new ue(1,1),t);s.scale.set(bt*2,a,1),s.position.set(r[0],a/2,r[1]),s.rotation.y=Math.atan2(-at[1],at[0]),s.frustumCulled=!1,s.renderOrder=3,$.add(s);const c=ye({count:Zt*7,shared:i,atten:1,fog:.004,core:.9,uniforms:{uRP:pt.uRP,uRE:{value:_.map(e=>new ae(e.E[0],e.E[1]))},uS0:{value:q},uEnd0:{value:new ae(Z[0],Z[1])},uPk:{value:0},uPk0:{value:0},uPT:l.uT,uPDawn:l.uDawn},pt:`
      uniform vec4 uRP[${Zt}]; uniform vec2 uRE[${Zt}]; uniform vec3 uS0; uniform vec2 uEnd0; uniform float uPk, uPk0, uPT, uPDawn;
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
        size *= clamp(distance(cameraPosition, pos) / 10., .2, 1.);
        vec3 c = mix(vec3(.42, .72, 1.), vec3(.9, .97, 1.), trail * trail);
        col = vec4(c * (k < .5 ? 3.2 : 1.8), vis * trail * trail * (.6 + .5 * flare));
      }`});c.mesh.renderOrder=9,$.add(c.mesh);const f=new vt;let z=0;const L=(e,M,y,b,k,W,O,ft,U,st,p,S=0,K=1,I=0)=>{z<460&&B.set(z++,e,M,y,b,k,W,O,ft,U,st,p,S,K,I)};function H(e,M,y){const b=n.deskAt(0,e);q.set(b.x+Math.cos(b.yaw)*.7*v.dir+Math.sin(b.yaw)*1.42,0,b.z-Math.sin(b.yaw)*.7*v.dir+Math.cos(b.yaw)*1.42);const k=qt(Ct.draw0,Ct.draw1,e),W=qt(Ct.shut0,Ct.shut1,e),O=Y(Ct.shut1-.1,Ct.shut1+.5,e);pt.uDraw.value=k,pt.uRk.value=Math.exp(-Math.pow((e-(Ct.draw1+.15))/.45,2)),t.uniforms.uClose.value=W,t.uniforms.uLock.value=O,t.uniforms.uCalm.value=Y(Ct.shut1+1.5,Ct.shut1+4,e);const ft=Y(8.4,9.8,e),U=Y(5.2,5.8,e);c.U.uPk.value=ft,c.U.uPk0.value=U,c.U.uAtten.value=y/(2*Math.tan(M.fov*Math.PI/360)),c.U.uEnd0.value.set(e<Ct.longEnd?Z[0]:r[0]-G[0]*.12,e<Ct.longEnd?Z[1]:r[1]-G[1]*.12),z=0,B.clear(0),D.reset(),J.reset();const st=96;for(const[p,S,K,I,rt,nt]of[[0,2.5,1,.78,.94,1],[w*.93,1.2,.55,.3,.6,1],[-w*.93,1.2,.55,.3,.6,1]])for(let ht=0;ht<st;ht++){const kt=ht/st,T=(ht+1)/st,zt=Math.min(kt,1-kt)*2,Ut=Math.min(T,1-T)*2,$t=Math.min(zt,Ut),ie=Math.max(Math.abs(Ut-zt),1e-4),Qt=Math.min(1,Math.max(0,(k-$t)/ie));if(Qt<=0)continue;const u=E(kt,p),P=E(T,p),x=zt<Ut,it=x?u:P,Rt=x?P:u;L(it[0],.014,it[1],Rt[0],.014,Rt[1],I,rt,nt,K,S,0,Qt,Qt<1?1.2:0)}for(let p=1;p<Zt;p++){const S=_[p],K=jt(8.3+p*.09,9.5+p*.09,e);if(K<=0)continue;const I=q.x+(S.E[0]-q.x)*S.f,rt=[[q.x,q.z],[I,q.z],[I,S.E[1]],S.E],nt=[0,1,2].map(T=>Math.hypot(rt[T+1][0]-rt[T][0],rt[T+1][1]-rt[T][1])),ht=nt[0]+nt[1]+nt[2];let kt=0;for(let T=0;T<3;T++){const zt=kt/ht,Ut=(kt+nt[T])/ht;kt+=nt[T];const $t=Math.min(1,Math.max(0,(K-zt)/Math.max(Ut-zt,1e-4)));$t>0&&nt[T]>.01&&L(rt[T][0],.016,rt[T][1],rt[T+1][0],.016,rt[T+1][1],.3,.62,1,.85,1.5,0,$t,0)}}{const p=Y(5,5.9,e),S=q.x,K=r[1];L(q.x,.02,q.z,S,.02,K,.75,.93,1,.9*p,2.2,0,1,0);const I=r[0]-G[0]*.02;L(S,.02,K,I,.02,K,.75,.93,1,.9*p,2.2,0,1,0);const rt=1-Y(Ct.shut0+.2,Ct.shut1+.1,e),nt=(1-rt)*.98;L(r[0],.02,r[1],Z[0],.02,Z[1],.5,.8,1,.85*p,2,nt,1,0),L(r[0],.02,r[1],Z[0],.02,Z[1],.16,.36,.9,.35*p,1.4,0,nt+.001,0);const ht=6.5,kt=.22,T=Be(kt,ht,kt,Z[0],ht/2,Z[1]);for(const zt of T)L(zt[0],zt[1],zt[2],zt[3],zt[4],zt[5],.4,.7,1,.55*p,1.1,0,1,0);D.set(Z[0],ht,Z[1],2.4,.5,.78,1,.5*p*(.35+.65*rt),0),D.set(Z[0],ht,Z[1],7,.3,.55,1,.12*p,0),D.set(Z[0],ht,Z[1],1.2,.7,.9,1,.5*p,3)}{const p=.4+.5*Y(Ct.shut0-.6,Ct.shut1,e)+.5*Math.exp(-Math.max(e-Ct.shut1,0)*1.8)*(e>Ct.shut1?1:0),S=Y(6.8,7.8,e);for(const K of[-1,1]){const I=r[0]+at[0]*bt*K,rt=r[1]+at[1]*bt*K;for(const nt of Be(.2,a,.2,I,a/2,rt))L(nt[0],nt[1],nt[2],nt[3],nt[4],nt[5],.7,.9,1,.9*p*S,1.5,0,1,0);D.set(I,a,rt,1.3,.6,.85,1,.25*p*S,0)}{const K=bt+.1,I=.07,rt=.07,nt=a+.08,ht=(T,zt,Ut)=>[r[0]+at[0]*K*T+G[0]*I*zt,nt+rt*Ut,r[1]+at[1]*K*T+G[1]*I*zt],kt=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(T=>ht(T[0],T[1],T[2]));for(const[T,zt]of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])L(kt[T][0],kt[T][1],kt[T][2],kt[zt][0],kt[zt][1],kt[zt][2],.7,.9,1,.9*p*S,1.5,0,1,0)}if(e>Ct.shut1-.1){const K=Math.max(0,e-Ct.shut1),I=Math.min(1,K/1.6);I<1&&J.set(r[0],.02,r[1],6,0,.7,.9,1,(1-I)*(1-I)*.9,1,I*.85+.1,.05+.05*I),D.set(r[0],.1,r[1],3.4,.6,.85,1,.6*Math.exp(-K*3),0)}}for(let p=0;p<Zt;p++){const S=_[p],K=p===0?e<Ct.longEnd?Z:[r[0]-G[0]*.12,r[1]-G[1]*.12]:S.E,nt=(((e-S.phase)%S.period+S.period)%S.period/S.period-.46)*S.period;if(nt>0&&nt<2.2&&e>S.start+.1){const ht=nt/2.2;J.set(K[0],.02,K[1],4.2,0,.65,.9,1,(1-ht)*(1-ht)*1.5,1,ht*.8+.1,.04+.035*ht),J.set(K[0],.02,K[1],4.2,0,.8,.95,1,(1-ht)*(1-ht)*.8,1,Math.max(0,ht*.8-.08)+.06,.03)}}D.set(r[0],.5,r[1],3,.5,.8,1,.16*Y(6.8,7.6,e)*(1-.6*W),0),B.setCount(Math.max(z,1)),B.dirty(),D.commit(),J.commit(),f.set(0,0,0)}return{group:$,update:H,gate:r,S0:q,perim:d,ringPt:E,routes:_,dispose(){dt.geometry.dispose(),V.geometry.dispose(),yt.dispose(),St.dispose(),t.dispose(),s.geometry.dispose(),B.dispose(),c.dispose(),D.dispose(),J.dispose()}}}const et={wake:15.4,doors:[17.5,23],strip:[18.2,24.4],crack:[20,26.4],dial:[18.2,27.4],dialTurn:[19.4,26]},Pe={1:[18.35,18.8],0:[20.2,20.65],2:[22.1,22.55]},E0=`
${Ot}
varying vec3 vN, vW;
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float fr = pow(1. - clamp(dot(N, V), 0., 1.), 2.);
  vec3 c = S(vec3(.80, .94, 1.)) * (1.1 + 2.8 * fr * 0. + 1.6 * (1. - fr)) + S(vec3(.3, .6, 1.)) * fr * 2.2;
  gl_FragColor = vec4(dawnTintP(c, vW), 1.);
}`,I0=`
${Ot}
uniform float uK;
varying vec3 vP, vW;
void main(){
  float u = clamp(vP.z / 2.6, 0., 1.);
  float f = pow(1. - u, 1.5) * smoothstep(0., .04, u);
  float a = atan(vP.y, vP.x);
  float stripe = .75 + .25 * sin(a * 7. + uTime * 2. - u * 9.);
  vec3 c = S(vec3(.5, .82, 1.)) * f * stripe * uK * .55;
  gl_FragColor = vec4(dawnTintP(c, vW), 1.);
}`;function O0(o,v,l,i,n,ut,$){const w=new Xt,A=ke({count:420,shared:i,fog:.006}),m=ge(110,l,i),C=de(16,l,i,"wall",{order:4});w.add(A.mesh,m.mesh,C.mesh);let Q=0;const d=(u,P,x,it,Rt,Ft,tt,mt,Bt,Dt,Wt,h=0,j=1,F=0)=>{Q<420&&Dt>.002&&A.set(Q++,u,P,x,it,Rt,Ft,tt,mt,Bt,Dt,Wt,h,j,F)},R=new He(.2,24,16),E=new h0(.62,2.6,28,1,!0);E.translate(0,-1.3,0),E.rotateX(-Math.PI/2);const _=[0,1,2].map(u=>{const P=new It(R,new _t({uniforms:{...l,uTime:i.uTime},vertexShader:"varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:E0,transparent:!0,depthWrite:!1,blending:Yt}));P.frustumCulled=!1,P.renderOrder=8;const x=new _t({uniforms:{...l,uTime:i.uTime,uK:{value:0}},vertexShader:"varying vec3 vP, vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:I0,transparent:!0,depthWrite:!1,blending:Yt,side:te}),it=new It(E,x);return it.frustumCulled=!1,it.renderOrder=7,w.add(P,it),{orb:P,beam:it,beamMat:x,pos:new vt,face:new vt(0,0,1),k:u}}),q=ut.perim,Z=(u,P)=>((.1+u/3+(u===1?-1:1)*2.7*(P-et.wake)/q)%1+1)%1,Mt=(u,P,x,it)=>{const Rt=Z(u,P),Ft=ut.ringPt(Rt),tt=ut.ringPt(Rt+(u===1?-.004:.004));x.set(Ft[0],1.2+.12*Math.sin(P*1.7+u*2.1),Ft[1]),it.set(tt[0]-Ft[0],0,tt[1]-Ft[1]).normalize()},pt=(u,P,x)=>[u,P,x],xt=u=>We(v,u,0),yt=(u,P,x=1.25)=>{const it=xt(u);return pt(it.x-it.nx*P,x,it.z-it.nz*P)},dt=u=>{const P=xt(u);return pt(P.x,1.2,P.z)},St=(()=>{const u=[];return[1,0,2].forEach((x,it)=>{const[Rt,Ft]=Pe[x];u.push({t:Rt-.75,p:yt(x,1.5,1.5),l:dt(x)}),u.push({t:Rt-.35,p:yt(x,.95),l:dt(x)}),u.push({t:Rt,p:yt(x,.5),l:dt(x)}),u.push({t:Rt+.22,p:yt(x,.95),l:dt(x)}),u.push({t:Ft,p:yt(x,.5),l:dt(x)}),u.push({t:Ft+.25,p:yt(x,1),l:dt(x)})}),u.sort((x,it)=>x.t-it.t),u.filter((x,it)=>it===0||x.t-u[it-1].t>.03)})(),V=he(St),B=v.strip,D=[Math.sin(B.yaw),Math.cos(B.yaw)],J=[Math.cos(B.yaw),-Math.sin(B.yaw)],r=(u,P,x)=>pt(B.x+J[0]*(u-.5)*B.w+D[0]*P,x,B.z+J[1]*(u-.5)*B.w+D[1]*P),N=v.wallH+.55,wt=[{t:et.strip[0]-.4,p:r(.6,-2.4,3.6),l:r(.5,0,2.9)},{t:et.strip[0]+.9,p:r(.55,-.4,N),l:r(.5,0,2.9)},{t:et.strip[0]+1.7,p:r(.12,1.5,3.25),l:r(.12,0,2.95)},{t:et.strip[0]+3,p:r(.88,1.5,3.25),l:r(.88,0,2.95)},{t:et.strip[0]+4.3,p:r(.14,1.5,3.2),l:r(.14,0,2.95)},{t:et.strip[0]+5.2,p:r(.5,1.7,3.5),l:r(.5,0,2.95)},{t:et.strip[0]+6.2,p:r(.55,-.4,N),l:r(.5,0,2.9)},{t:et.strip[0]+7,p:r(.6,-2.4,3.6),l:r(.5,0,2.9)}],gt=he(wt),G=u=>{const P=et.strip[0]+1.7;if(u<P)return .12;const x=u-P;return x<1.3?.12+.76*qt(0,1.3,x):x<2.6?.88-.74*qt(1.3,2.6,x):x<3.5?.14+.36*qt(2.6,3.5,x):.5},at=v.crack,bt=[Math.sin(at.yaw),Math.cos(at.yaw)],a=[Math.cos(at.yaw),-Math.sin(at.yaw)],t=[[-.3,3.25],[-.14,2.97],[-.27,2.62],[.02,2.32],[-.07,1.97],[.21,1.66],[.09,1.31],[.4,1]],s=[[[.02,2.32],[.26,2.2],[.42,1.93]],[[-.07,1.97],[-.3,1.8],[-.36,1.52]]],c=(u,P,x=.05)=>pt(at.x+a[0]*u+bt[0]*x,P,at.z+a[1]*u+bt[1]*x),f=t.slice(1).map((u,P)=>Math.hypot(u[0]-t[P][0],u[1]-t[P][1])),z=f.reduce((u,P)=>u+P,0),L=u=>{let P=Math.min(Math.max(u,0),1)*z;for(let x=0;x<f.length;x++){if(P<=f[x]||x===f.length-1){const it=Math.min(1,P/f[x]);return[t[x][0]+(t[x+1][0]-t[x][0])*it,t[x][1]+(t[x+1][1]-t[x][1])*it]}P-=f[x]}return t[t.length-1]},H=[22,24],e=[{t:et.crack[0]-.4,p:c(-.2,3.7,-2.4),l:c(-.2,3,0)},{t:et.crack[0]+.8,p:c(-.3,N,-.3),l:c(-.3,3.1,0)},{t:et.crack[0]+1.6,p:c(.5,3.5,1.3),l:c(-.28,3.05,0)},...[0,.25,.5,.75,1].map(u=>{const P=L(u);return{t:H[0]+u*(H[1]-H[0]),p:c(P[0]+.8,P[1]+.35,1.25),l:c(P[0],P[1],0)}}),{t:H[1]+1,p:c(.2,1.9,1.5),l:c(.1,1.4,0)},{t:H[1]+2,p:c(.3,N,-.3),l:c(.2,2,0)},{t:H[1]+2.5,p:c(.3,3.8,-2.4),l:c(.2,2,0)}],M=he(e.sort((u,P)=>u.t-P.t)),y=32,b=8,k=.125,W=.075,O=$.idx("A"),ft=$.idx("Z")-$.idx("A")+1,U=r0({atlas:$,count:y*b,shared:i,plane:{right:new vt(J[0],0,J[1]),up:new vt(0,1,0)},glow:.5,fog:.004,uniforms:{uScroll:{value:0},uScan:{value:.5},uLit:{value:0},uOn:{value:0},uSW:{value:B.w},uBase:{value:O},uRange:{value:ft}},inst:`
      uniform float uScroll, uScan, uLit, uOn, uSW, uBase, uRange;
      float hh(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      void inst(float id, out vec3 pos, out float glyph, out float size, out vec4 col, out vec4 fx){
        float COLS = ${y}., ROWS = ${b}.;
        float j = floor(id / COLS), c = id - j * COLS;
        float s = uScroll / ${k}, whole = floor(s), fr = s - whole;
        float Lg = whole - j;
        float y = (j + fr - ROWS * .5 + .5) * ${k};
        float x = (c - COLS * .5 + .5) * ${W};
        float H = ROWS * ${k} * .5 - .1;
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
      }`});U.mesh.position.set(B.x,B.y,B.z),w.add(U.mesh);const st=v.dial,p=24,S=[Math.cos(st.yaw),-Math.sin(st.yaw)],K=[Math.sin(st.yaw),Math.cos(st.yaw)],I=(u,P)=>pt(st.x+S[0]*Math.sin(u)*P*st.r+K[0]*.03,st.y+Math.cos(u)*P*st.r,st.z+S[1]*Math.sin(u)*P*st.r+K[1]*.03),rt=de(2,l,i,"wall",{order:3});w.add(rt.mesh);const nt=new vt,ht=new vt,kt=new vt(0,1,0);new vt,new vt;const T=new vt,zt=new vt,Ut=[V,gt,M],$t=u=>[Y(et.doors[0],et.doors[0]+.6,u)*(1-Y(et.doors[1],et.doors[1]+1.2,u)),Y(et.strip[0]-.2,et.strip[0]+.8,u)*(1-Y(et.strip[1]-.8,et.strip[1]+.4,u)),Y(et.crack[0]-.2,et.crack[0]+.8,u)*(1-Y(et.crack[1]-1.4,et.crack[1]-.2,u))],ie=(u,P,x,it)=>{Mt(u,P,x,it);const Rt=$t(P)[u];if(Rt>.001){const Ft=Ut[u](P);nt.copy(Ft.p),ht.copy(Ft.l).sub(nt).normalize(),x.lerp(nt,Rt),it.lerp(ht,Rt).normalize()}};function Qt(u,P){Q=0,A.clear(0),m.reset(),C.reset(),rt.reset();const x=n.doorFlash,it=n.doorWob;for(let h=0;h<x.length;h++){x[h]=0,it[h]=0;const j=Pe[h];if(j){for(const F of j){const g=u-F;g>0&&g<1.6&&(x[h]+=Math.exp(-g*4.5),it[h]+=Math.sin(g*26)*Math.exp(-g*5.5)*.085),g>-.08&&g<=0&&(x[h]+=(1+g/.08)*.5)}x[h]=Math.min(1,x[h])}}const Rt=Y(et.wake,et.wake+1.2,u);_.forEach((h,j)=>{ie(j,u,h.pos,h.face);const F=$t(u)[j],g=Rt*(u>et.wake?1:0);if(h.orb.visible=g>.01,h.beam.visible=g>.01,h.orb.position.copy(h.pos),h.orb.scale.setScalar(Math.max(g,.001)),h.beam.position.copy(h.pos),h.beam.lookAt(nt.copy(h.pos).add(h.face)),h.beam.scale.set(.5,.5,1),h.beamMat.uniforms.uK.value=g*(.28+.9*F),g>.01){const ot=(lt,ct,Pt,Nt,Gt,Jt)=>{const Vt=h.face,At=nt.copy(kt).cross(Vt);At.lengthSq()<1e-4&&At.set(1,0,0),At.normalize();const Kt=ht.copy(Vt).cross(At).normalize(),Ht=h.pos.x+Vt.x*ct,ce=h.pos.y+Vt.y*ct,Ae=h.pos.z+Vt.z*ct;for(let me=0;me<Nt;me++){const re=Pt+me/Nt*Math.PI*2,le=Pt+(me+.62)/Nt*Math.PI*2;d(Ht+(At.x*Math.cos(re)+Kt.x*Math.sin(re))*lt*g,ce+(At.y*Math.cos(re)+Kt.y*Math.sin(re))*lt*g,Ae+(At.z*Math.cos(re)+Kt.z*Math.sin(re))*lt*g,Ht+(At.x*Math.cos(le)+Kt.x*Math.sin(le))*lt*g,ce+(At.y*Math.cos(le)+Kt.y*Math.sin(le))*lt*g,Ae+(At.z*Math.cos(le)+Kt.z*Math.sin(le))*lt*g,.72,.92,1,Gt,Jt,0,1,0)}};ot(.42,.1,u*.8+j,40,.95,1.8),ot(.29,.26,-u*1.7+j*2,20,.75,1.4);const X=Math.min(1,Math.max(.35,P.position.distanceTo(h.pos)/5));m.set(h.pos.x,h.pos.y,h.pos.z,2*g*X,.45,.75,1,.34*X,0),m.set(h.pos.x,h.pos.y,h.pos.z,.7*g,.85,.96,1,1,0),m.set(h.pos.x,h.pos.y,h.pos.z,2.4*g*X,.6,.85,1,.4*X,3);for(let lt=1;lt<=9;lt++){ie(j,u-lt*.075,T,zt);const ct=1-lt/10;m.set(T.x,T.y,T.z,(.9*ct+.2)*g,.5,.8,1,.5*ct*ct*ct,0)}}});for(let h=0;h<v.doors.length;h++){const j=Pe[h];if(!j)continue;const F=xt(h),g=v.doors[h];for(const ot of j){const X=u-ot;if(ot===j[1]&&X>.1&&X<2.2&&C.set(F.x-F.nx*.02,1.28,F.z-F.nz*.02,.8,F.yaw,.8,.95,1,1.4*Math.min(1,(X-.1)*6)*Math.exp(-Math.max(0,X-1)*1.8),6,1,0),X>-.05&&X<1){const lt=Math.max(0,X)/1;if(C.set(F.x,1.15,F.z,g.w*3.2,F.yaw,.65,.9,1,(1-lt)*(1-lt)*1.3,1,lt*.8+.06,.09),X>-.05&&X<.25){const ct=Math.min(1,Math.max(.4,Math.hypot(P.position.x-F.x,P.position.z-F.z)/6));m.set(F.x-F.nx*.05,1.2,F.z-F.nz*.05,2.4*ct,.75,.93,1,1.2*ct*(1-Math.max(X,0)/.25),0)}}}}const Ft=Y(2.8,4.4,u);U.U.uOn.value=Ft,U.U.uScroll.value=u*.32;const tt=$t(u)[1]*(u<et.strip[0]+6?1:0);if(U.U.uLit.value=tt,U.U.uScan.value=G(u),tt>.02){const h=r(G(u),.02,B.y-B.h*.55),j=r(G(u),.02,B.y+B.h*.55);d(h[0],h[1],h[2],j[0],j[1],j[2],.85,.95,1,.9*tt,1.6,0,1,0),m.set((h[0]+j[0])/2,B.y,(h[2]+j[2])/2,1.2,.6,.85,1,.35*tt,0)}{const h=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([j,F])=>r(.5+j*1.04,.02,B.y+F*(B.h+.1)));for(let j=0;j<4;j++)d(h[j][0],h[j][1],h[j][2],h[(j+1)%4][0],h[(j+1)%4][1],h[(j+1)%4][2],.5,.78,1,.55*Ft,1.2,0,1,0)}const mt=jt(20.9,21.8,u),Bt=jt(21.6,22.1,u),Dt=qt(H[0],H[1],u),Wt=Y(24.6,26.2,u);if(mt>0){const h=t.length-1,j=H[1]-H[0];for(let F=0;F<h;F++){const g=Math.min(1,Math.max(0,mt*h-F));if(g<=0)continue;const ot=c(t[F][0],t[F][1]),X=c(t[F+1][0],t[F+1][1]),lt=Math.min(1,Math.max(0,Dt*h-F)),ct=Math.max(0,u-(H[0]+(F+1)/h*j)),Pt=lt*(.2*Math.exp(-ct*.5)+.8*Math.exp(-ct*1.1))*(1-Wt*.85);lt<1&&d(ot[0],ot[1],ot[2],X[0],X[1],X[2],1,1,1,.95*(1-lt),1.7,0,g,0),Pt>.01&&(d(ot[0],ot[1],ot[2],X[0],X[1],X[2],.5,.8,1,Pt,3.4,0,1,0),d(ot[0],ot[1],ot[2],X[0],X[1],X[2],1,1,1,Pt*.7,1.3,0,1,0),m.set((ot[0]+X[0])/2,(ot[1]+X[1])/2,(ot[2]+X[2])/2,1.3,.35,.65,1,.7*Pt,0)),lt<1&&m.set((ot[0]+X[0])/2,(ot[1]+X[1])/2,(ot[2]+X[2])/2,.5,.8,.9,1,.14*g,0)}for(const F of s)for(let g=0;g<F.length-1;g++){const ot=Math.min(1,Math.max(0,mt*1.4-.3-g*.35));if(ot<=0)continue;const X=c(F[g][0],F[g][1]),lt=c(F[g+1][0],F[g+1][1]),ct=Math.min(1,Math.max(0,Dt*1.3-.15+.12*g)),Pt=Math.max(0,u-(H[0]+j*(.2+.25*g))),Nt=ct*Math.exp(-Pt*1.1)*(1-Wt);ct<1&&d(X[0],X[1],X[2],lt[0],lt[1],lt[2],1,1,1,.8*(1-ct),1.2,0,ot,0),Nt>.01&&d(X[0],X[1],X[2],lt[0],lt[1],lt[2],.5,.8,1,Nt*.8,2.2,0,1,0)}if(Bt>0){const F=Bt*(1-Wt),g=-.62,ot=.74,X=.78,lt=3.5,ct=.24,Pt=(Nt,Gt,Jt,Vt)=>{const At=c(Nt,Gt),Kt=c(Nt+Jt*ct,Gt),Ht=c(Nt,Gt+Vt*ct);d(At[0],At[1],At[2],Kt[0],Kt[1],Kt[2],.6,.88,1,.9*F,1.8,0,1,0),d(At[0],At[1],At[2],Ht[0],Ht[1],Ht[2],.6,.88,1,.9*F,1.8,0,1,0)};Pt(g,X,1,1),Pt(ot,X,-1,1),Pt(g,lt,1,-1),Pt(ot,lt,-1,-1)}if(Dt>0&&Dt<1){const F=L(Dt),g=c(F[0],F[1],.08);m.set(g[0],g[1],g[2],1.9,.45,.75,1,.8,0),m.set(g[0],g[1],g[2],.55,1,1,1,1.6,0),m.set(g[0],g[1],g[2],2.2,.8,.95,1,.7,3),C.set(g[0],g[1],g[2],1.4,at.yaw,.6,.85,1,.6,1,u*1.7%1*.8+.1,.08)}}{const h=Y(et.dial[0],et.dial[0]+1.2,u)*(1-Y(et.dial[1]-1.2,et.dial[1],u));if(h>.01){const j=qt(et.dialTurn[0],et.dialTurn[1],u),F=j*Math.PI*2,g=jt(et.dial[0],et.dial[0]+1.5,u);for(let ct=0;ct<p;ct++){const Pt=ct/p*Math.PI*2,Nt=ct%6===0;if(g*p<ct)continue;const Gt=F>Pt?Math.exp(-(F-Pt)*.35):0,Jt=Math.exp(-Math.pow(F-Pt,2)*30),Vt=ct>=p/2?1:0,At=I(Pt,Nt?.78:.86),Kt=I(Pt,1),Ht=Vt?[.2,.42,1]:[.62,.86,1],ce=Math.min(1,Gt*.85+Jt);d(At[0],At[1],At[2],Kt[0],Kt[1],Kt[2],Ht[0]+(1-Ht[0])*ce*.6,Ht[1]+(1-Ht[1])*ce*.6,1,(.45+.55*ce)*h,Nt?2.6:1.5,0,1,0)}for(let ct=0;ct<48;ct++){if(g*48<ct)continue;const Pt=ct/48*Math.PI*2,Nt=(ct+1)/48*Math.PI*2,Gt=I(Pt,1.02),Jt=I(Nt,1.02),Vt=ct>=24;d(Gt[0],Gt[1],Gt[2],Jt[0],Jt[1],Jt[2],Vt?.25:.7,Vt?.5:.9,1,(Vt?.5:.75)*h,1.8,0,1,0)}const ot=I(F,.8),X=I(F+Math.PI,.14),lt=I(0,0);d(X[0],X[1],X[2],ot[0],ot[1],ot[2],.85,.96,1,.95*h,2.8,0,1,1.1),m.set(lt[0],lt[1],lt[2],.5,.85,.96,1,.9*h,0),m.set(ot[0],ot[1],ot[2],.5,.7,.9,1,.7*h,0),rt.set(st.x+K[0]*.02,st.y,st.z+K[1]*.02,st.r*2.1,st.yaw,.5,.78,1,.5*h,5,F,.9)}}A.setCount(Math.max(Q,1)),A.dirty(),m.commit(),C.commit(),rt.commit()}return{group:w,update:Qt,sents:_,T_SEAL:H,dispose(){R.dispose(),E.dispose(),_.forEach(u=>{u.orb.material.dispose(),u.beamMat.dispose()}),A.dispose(),m.dispose(),C.dispose(),rt.dispose(),U.dispose()}}}const se=.4,ne={emerge:34.8,land:35.3,toTile:36,pick:36.6,back:37.3,set:38.1,step:38.8,down:39.35,out:44.4},N0=`
${Ot}
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

  vec3 col = S(vec3(.20, .46, .95)) * (.30 + .22 * N.y + .28 * pow(ndv, 1.4)) + env * (.22 + .8 * fr);
  col += mix(S(vec3(.70, .88, 1.)), irid, .4) * fr * 1.9;
  col += S(vec3(.92, .97, 1.)) * pow(max(dot(R, normalize(vec3(.35, .65, -.65))), 0.), 24.) * 1.8;

  float db = distance(vW, uBoxL.xyz);
  col += S(vec3(1., .72, .36)) * exp(-db * db * .7) * uBoxL.w * (.3 + fr) * .8;
  #ifdef MIRROR
    col *= .2 * exp(-max(-vW.y, 0.) * .9);
  #endif

  float a = clamp(.5 + .38 * fr + .18 * (1. - ndv), 0., .96);
  #ifdef MIRROR
    a *= .4;
  #endif
  gl_FragColor = vec4(dawnTintP(col, vW), a);
}`;function U0(o,v,l,i,n,ut){const $=new Xt,w=v.dir,A=a=>new _t({uniforms:{...l,uTime:i.uTime},defines:a?{MIRROR:1}:{},vertexShader:`varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vec3 n = normalize(mat3(modelMatrix) * normal);
      #ifdef MIRROR
        w.y = -w.y; n.y = -n.y;
      #endif
      vW = w.xyz; vN = n; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:N0,side:te,transparent:!0,depthWrite:!1,blending:Ye,blendEquation:Ze,blendSrc:Xe,blendDst:je}),m=[A(!1),A(!0)],C=[0,1].map(a=>w0(a,.55)),Q=C.map(a=>{const t=new Xt,s=new It(a.geometry,m[0]),c=new It(a.geometry,m[1]);s.position.set(0,a.geometry.boundingBox.max.y,0),c.position.copy(s.position);for(const f of[s,c])f.frustumCulled=!1,f.renderOrder=6;return c.renderOrder=5,t.add(s,c),$.add(t),{piv:t,real:s,refl:c,s:a}}),d=C[0].geometry.boundingBox.max.y-C[0].geometry.boundingBox.min.y;Q.forEach(a=>{a.real.position.y=d/2,a.refl.position.y=d/2,a.piv.scale.setScalar(se)});const R=ge(10,l,i),E=de(8,l,i,"floor",{order:-26});$.add(R.mesh,E.mesh);const _=a=>n.deskAt(0,a),q=(a,t,s)=>{const c=_(a);return[c.x+Math.cos(c.yaw)*t+Math.sin(c.yaw)*s,c.z-Math.sin(c.yaw)*t+Math.cos(c.yaw)*s]},Z=a=>_(a).lift+.775,Mt=.56*w,pt=-.2,xt=[Mt,pt],yt=[.3*w,.5],dt=[-.95*w,.5],St=[.15*w,.52],V=[1.12*w,.5],B=We(v,v.exit.door,1),D=v.exit.lane,J=a=>q(a,1.5*w,.98),r=v.ring.a*Math.sqrt(Math.max(0,1-Math.pow((D-v.ring.cz)/v.ring.b,2)))*w,N=r+2.6*w,wt=a=>{const t={x:0,y:0,z:0,gait:0,phase:0,lean:0,squash:0,scale:1,look:w,vis:1},s=ne,c=(p,S)=>{t.x=p[0],t.z=p[1],t.y=S},f=(p,S,K,I)=>q(p,S[0]+(K[0]-S[0])*I,S[1]+(K[1]-S[1])*I);if(a<s.emerge)return t.vis=0,c(q(a,Mt,pt),Z(a)+.5),t;if(a<s.land){const p=(a-s.emerge)/(s.land-s.emerge),S=ut.state.h,K=q(a,xt[0],xt[1]),I=q(a,yt[0],yt[1]);return t.x=K[0]+(I[0]-K[0])*p,t.z=K[1]+(I[1]-K[1])*p,t.y=Z(a)+S*(1-p)+Math.sin(Math.PI*p)*.55,t.scale=.3+.7*jt(0,.5,p),t.squash=-.12*Math.sin(Math.PI*Math.min(1,p*1.2)),t.look=w,t}if(a<s.toTile){const p=qt(s.land+.12,s.toTile,a),S=f(a,yt,dt,p);return c(S,Z(a)),t.gait=1,t.phase=p*3,t.lean=-.12*w,t.look=-w,t}if(a<s.pick){const p=(a-s.toTile)/(s.pick-s.toTile);return c(q(a,dt[0],dt[1]),Z(a)+Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(p-.3)/.5))))*.42),t.squash=p<.3?.16*Math.sin(Math.PI*p/.3):p<.8?-.14*Math.sin(Math.PI*(p-.3)/.5):.1*Math.exp(-(p-.8)*12),t.look=-w,t}if(a<s.back){const p=qt(s.pick,s.back,a),S=f(a,dt,St,p);return c(S,Z(a)),t.gait=1,t.phase=3+p*3,t.lean=.1*w,t.look=w,t}if(a<s.set){const p=(a-s.back)/(s.set-s.back),S=p<.22?Math.sin(Math.PI*p/.22)*.2:0,K=Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(p-.22)/.4))))*.5,I=p>.62?Math.exp(-(p-.62)*11)*.14:0;return c(q(a,St[0],St[1]),Z(a)+K),t.squash=S-(K>0?.12*Math.sin(Math.PI*Math.min(1,(p-.22)/.4)):0)+I,t.look=w,t}if(a<s.step){const p=qt(s.set+.15,s.step,a),S=f(a,St,V,p);return c(S,Z(a)),t.gait=.8,t.phase=6+p*2,t.lean=-.07*w,t.look=w,t}if(a<s.down){const p=(a-s.step)/(s.down-s.step),S=q(a,V[0],V[1]),K=J(a);return t.x=S[0]+(K[0]-S[0])*p,t.z=S[1]+(K[1]-S[1])*p,t.y=Z(a)*(1-p*p)+Math.sin(Math.PI*p)*.3,t.squash=p>.85?.2*Math.exp(-(p-.85)*18):-.1*Math.sin(Math.PI*p),t.look=w,t}const z=Math.min(1,(a-s.down)/(s.out-s.down)),L=z*z*(2-z),H=J(s.down),e=H[0],M=H[1],y=B.x-w*.2,b=y-w*1.2,k=[[e,M],[e+(b-e)*.35,D],[b,D],[y+w*1.6,D],[N,D]],W=k.slice(1).map((p,S)=>Math.hypot(p[0]-k[S][0],p[1]-k[S][1])),O=W.reduce((p,S)=>p+S,0);let ft=L*O,U=0;for(;U<W.length-1&&ft>W[U];)ft-=W[U],U++;const st=Math.min(1,ft/W[U]);return t.x=k[U][0]+(k[U+1][0]-k[U][0])*st,t.z=k[U][1]+(k[U+1][1]-k[U][1])*st,t.y=0,t.gait=1,t.phase=8+L*O/1.1,t.lean=.12*w,t.look=w,t},gt=(a,t=new vt)=>{const s=wt(a);return t.set(s.x,s.y+.4,s.z)},G=(a,t)=>{const s=a-Math.floor(a),c=((s-t*.5)%1+1)%1*2,f=c<1?Math.sin(Math.PI*c):0,z=c>1?Math.exp(-(c-1)*7)*(c<1.8?1:0):0;return{air:f,land:z,u:c}},at=new vt;function bt(a,t){const s=wt(a);R.reset(),E.reset();const c=ut.carry;if(c.w=Y(ne.toTile+.25,ne.toTile+.65,a),c.set=Y(ne.back+.3,ne.back+.75,a),$.visible=s.vis>0&&a<ne.out+6,!$.visible){R.commit(),E.commit();return}const f=1.42,z=ut.state.top;at.set(s.x,s.y+f+.55*(1-c.set)*0,s.z),c.pos.copy(at),c.set>0&&c.pos.lerp(z,jt(0,1,c.set));for(let H=0;H<2;H++){const e=Q[H],M=s.phase,y=G(M,H),b=s.gait,k=y.air*b,W=y.land*b,O=(1-b)*Math.sin(a*2.2+H*1.7)*.012,ft=1+.22*k-.3*W+s.squash+O,U=1/Math.sqrt(Math.max(ft,.4)),st=(1-b)*0+0,p=e.s.centre.x*se*s.scale,S=k*.24;e.piv.position.set(s.x+p*1+st,s.y+S*s.scale,s.z+e.s.centre.z*se),e.piv.scale.set(se*U*s.scale,se*ft*s.scale,se*s.scale),e.piv.rotation.z=s.lean*b+s.lean*.4*(1-b)+(b>0?.16*Math.sin(M*Math.PI*2+H*Math.PI):0)+Math.sin(a*1.6+H)*.01*(1-b);const K=e.piv.position.x,I=e.piv.position.z;if(W>.04){E.set(K,s.y+.006,I,1.1,0,.55,.82,1,.6*W,0);const rt=Math.min(1,(y.u-1)/.8);E.set(K,s.y+.007,I,1.9,0,.7,.92,1,.7*(1-rt)*(1-rt),1,.1+rt*.8,.06+.05*rt)}}R.set(s.x,s.y+.45*se*2,s.z,2.4*s.scale,.45,.75,1,.12*s.vis,0);const L=Math.abs(s.x-r);if(s.y<.2&&a>ne.down&&L<3){const H=1-L/3;R.set(r,.6,D,3.4,.6,.86,1,.5*H*H,0)}R.commit(),E.commit()}return{group:$,update:bt,at:gt,pose:wt,ringX:r,lane:D,dispose(){m.forEach(a=>a.dispose()),C.forEach(a=>a.geometry.dispose()),R.dispose(),E.dispose()}}}function K0(o,v,l,i){const n=new Xt,ut=o.tall?5.5:11,$=o.back+.6,w=o.tall?24:15,A=ye({count:i,shared:l,atten:1,fog:.01,core:.6,uniforms:{uDT:v.uT,uDD:v.uDawn,uDK:{value:0},uDW:{value:ut},uDZ:{value:new ae($,w)}},pt:`
      uniform float uDT, uDD, uDK, uDW; uniform vec2 uDZ;
      float hh(float n){ return fract(sin(n * 127.1) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        vec3 b = vec3(hh(id) * 2. - 1., hh(id + 7.), hh(id + 13.));
        pos = vec3(b.x * uDW, .12 + b.y * b.y * 5.6, uDZ.x + b.z * uDZ.y);
        pos += vec3(sin(uTime * .21 + id), sin(uTime * .33 + id * 1.7) * .45, cos(uTime * .17 + id * .7)) * .7;
        float tw = .5 + .5 * sin(uTime * (.7 + hh(id + 3.) * 1.7) + id);
        size = .035 + .06 * hh(id + 5.) * hh(id + 5.);
        col = vec4(mix(vec3(.5, .78, 1.), vec3(1., .84, .55), uDD), (.18 + .5 * tw) * uDK * (.4 + .6 * hh(id + 11.)));
      }`});A.mesh.renderOrder=8;const m=ye({count:64,shared:l,atten:1,fog:0,core:.8,uniforms:{uFD:v.uDawn,uFK:{value:0}},pt:`
      uniform float uFD, uFK;
      float hh(float n){ return fract(sin(n * 91.7) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float a = (hh(id) - .5) * 2.5, dist = 90. + hh(id + 3.) * 110.;
        float tall = step(.82, hh(id + 5.));
        pos = vec3(sin(a) * dist, .3 + tall * (2. + hh(id + 7.) * 6.), -cos(a) * dist - 10.);
        float tw = .6 + .4 * sin(uTime * (.4 + hh(id + 9.)) + id * 3.);
        size = (.9 + hh(id + 11.) * 1.8) * (1. + tall);
        col = vec4(mix(vec3(.42, .68, 1.), vec3(1., .86, .6), uFD), (.22 + .3 * hh(id + 13.)) * tw * uFK);
      }`});return m.mesh.renderOrder=1,n.add(A.mesh,m.mesh),{mesh:n,U:A.U,far:m.U,dispose(){A.dispose(),m.dispose()}}}const _0=o=>`
uniform float uFlood, uFR, uRay, uAna, uDawn;
uniform vec2 uSun;
vec3 look(vec2 uv){
  vec3 c = samp(uv) + bloom(uv) * (.52 - .22 * uDawn);

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
  c = mix(vec3(luma(c)), c, 1. + .3 * smoothstep(.0, .6, uRay));
  float r = length((uv - .5) * vec2(uAsp, 1.));
  c *= 1. - (.16 + .22 * uDawn) * smoothstep(.45, 1.15, r);

  float rr = length((uv - uSun) * vec2(uAsp, 1.)) + (fbm(uv * 3.2 + vec2(uTime * .05, 0.)) - .5) * .4;
  float fl = max(smoothstep(uFR + .55, uFR - .15, rr), uFlood);
  return mix(c, pivotG(uv), fl);
}`,Ue={en:["Quotes","Records","Voice","Films","Messages"],ar:["عروض الأسعار","السجلات","الصوت","الأفلام","الرسائل"]};async function L0(o){await s0(c0);const v=await l0(o),l=g0(),i=n0(o,{atlas:v,pin:"F",pout:"G",inW:.07,outW:.075,frag:_0(Fe(o,12,18,24)),uniforms:{uFlood:{value:0},uFR:{value:-1},uRay:{value:0},uAna:{value:0},uDawn:l.uDawn,uSun:{value:new ae(.5,.5)}}}),n=new m0(48,o.viewport.aspect,.05,400),ut=o.lang==="ar"?-1:1,$=()=>o.viewport.aspect<.72,w=new vt;function A(Q){const d=z0(Q,ut);l.uWin.value.set(d.win.cx,(d.win.y0+d.win.y1)/2,d.win.hw,(d.win.y1-d.win.y0)/2),l.uWall.value.set(d.back,1,0,0),l.uPlate.value.set(d.plate.A.hx,d.plate.A.hz,.5,d.plate.A.cz),l.uPlateA.value.set(d.plate.A.hx,d.plate.A.hz,.5,d.plate.A.cz);const R=new Xt;i.world.add(R);const E=W0(l,i.G),_=A0(l,i.G),q=Ee(l,i.G,!1),Z=Ee(l,i.G,!0),Mt=new ae((d.win.hw+5.5)*2,d.win.y1-d.win.y0+8),pt=(d.win.y0+d.win.y1)/2;for(const N of[q,Z])N.mat.uniforms.uSize.value.copy(Mt),N.mesh.position.set(d.win.cx,pt,d.back-.06);const xt=R0(d,l,i.G),yt=o.lang==="ar"?Ue.ar:Ue.en,dt=B0(o,d,l,i.G,xt,yt,Q),St=q0(o,d,l,i.G,xt),V=O0(o,d,l,i.G,xt,St,v),B=U0(o,d,l,i.G,xt,dt),D=K0(d,l,i.G,Fe(o,220,380,640));R.add(E.mesh,_.mesh,q.mesh,Z.mesh,xt.group,dt.group,St.group,V.group,B.group,D.mesh);const J=P0(d,B.at),r=[E.mat,_.mat,q.mat,Z.mat];return{L:d,group:R,machine:dt,update(N,wt,gt){const G=qt(43.3,44.7,N),at=Y(46,47.6,N),bt=1-Y(1.2,4.5,N);l.uT.value=N,l.uDawn.value=at,l.uFront.value.set(-6+36*Y(44,46.6,N)+30*Y(46.2,47.6,N),d.win.cx,pt,d.back),l.uSky.value.set(.26+.74*bt+.06*Y(41,43.2,N)+.85*G*(1-.5*at),.5+.5*bt+.2*G,0,0);const a=.5+.5*(1-Y(4,9,N))+.6*Y(40.6,43.2,N);l.uWall.value.set(d.back,a+.9*G,G,0);const t=i0(o,wt,gt),s=J(N);n.position.copy(s.p),n.position.x+=t.x*.3,n.position.y+=t.y*.15,n.lookAt(s.l),s.roll&&n.rotateZ(s.roll),Math.abs(n.fov-s.fov)>.001&&(n.fov=s.fov,n.updateProjectionMatrix()),n.updateMatrixWorld(),E.mesh.position.copy(n.position),_.mesh.position.set(n.position.x,0,n.position.z),V.update(N,n),xt.update(N,G),B.update(N,n),dt.update(N,n),St.update(N,n,o.viewport.height),D.U.uDK.value=Y(2.5,5,N);const c=o.viewport.height/(2*Math.tan(n.fov*Math.PI/360));D.U.uAtten.value=c,D.far.uAtten.value=c,D.far.uFK.value=Y(3,7,N),w.set(d.win.cx,pt,d.back).project(n);const f=w.z>1?1:0;i.U.uSun.value.set(f?5:w.x*.5+.5,f?5:w.y*.5+.5);const z=Y(47.5,48,N);i.U.uFR.value=-.7+3.4*Y(45.2,47.7,N),i.U.uRay.value=Y(43.4,44.8,N)*(1-.6*z),i.U.uAna.value=Math.max(.3*Y(2,5,N),Y(43.6,45,N))*(1-z),i.U.uFlood.value=z},dispose(){i.world.remove(R),E.mesh.geometry.dispose(),_.mesh.geometry.dispose(),q.mesh.geometry.dispose(),Z.mesh.geometry.dispose(),r.forEach(N=>N.dispose()),xt.dispose(),dt.dispose(),St.dispose(),V.dispose(),B.dispose(),D.dispose()}}}let m=$(),C=A(m);return C.machine.prewarm(!0),await i.warm(n),C.machine.prewarm(!1),{scene:i.scene,camera:n,update({p:Q,t:d,dt:R,v:E}){i.tick(d,E),i.setP(Q),C.update(Q*y0,d,R),i.draw(n)},resize(){i.resize(),n.aspect=o.viewport.aspect,n.updateProjectionMatrix(),$()!==m&&(m=$(),C.dispose(),C=A(m))},dispose(){C.dispose(),i.dispose()}}}export{L0 as default};
