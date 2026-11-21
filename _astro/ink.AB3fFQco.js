import{L as Ot,x as _,z as l,r as k,e as oe}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{f as Nt,i as qt,s as Wt,C as P,S as _t,r as Dt,a as me,F as st,b as Ne,l as Bt,c as Kt,p as Ht,d as j}from"./plan.JErftjW5.js";import{b as qe}from"./brush.Cn5mXixh.js";import{b as Lt,P as h,f as it,r as Xt,s as It,l as rt}from"./figure-styles.D3C0j1NR.js";import{f as nt,P as Et,M as C,c as O,d as N,V as se,af as We,ag as D,s as Gt,w as Yt,i as _e}from"./three.module.pheUvn1h.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const A=_t.ink,B=[[1.2,0,3],[-1.1,0,-8],[1.3,0,-19],[-2,0,-30]],z=new se(-2.1,0,-40.5),b=new se(2,0,-51.5),jt=Math.atan2(b.x-z.x,b.z-z.z),Vt=Math.atan2(z.x-b.x,z.z-b.z),u={angle:.5236,slash0:.745,split0:.775,split1:.82,back0:.865,back1:.9,seal:.905,burn0:.93,burn1:.985},vt=1.75,Zt=`
uniform vec4 uSplit; uniform vec4 uSeal; uniform float uCut, uBurn;
float paperFibre(vec2 uv){
  vec2 p = uv * uCss / 2.6;
  float a = vn(p * vec2(1., .13) + 3.), b = vn(p * vec2(.14, 1.) + 9.), c = vn(p * .5 + 1.), d = vn(p * 1.9);
  return a * .3 + b * .3 + c * .25 + d * .15;
}
vec3 sceneColor(vec2 uv){
  vec2 asp = vec2(uAsp, 1.), p = (uv - .5) * asp;
  vec3 hot = mix(S(vec3(.91, .255, .17)), S(vec3(1., .93, .86)), smoothstep(.4, 1., uSplit.y));
  float a = ${u.angle.toFixed(4)}; vec2 dir = vec2(cos(a), sin(a)), nrm = vec2(-dir.y, dir.x);
  float d = dot(p, nrm), along = dot(p, dir);
  float open = uSplit.x, gap = open * .028, slide = open * .36;
  float tear = (fbm(vec2(along * 13., 3.1)) - .5) * .028 + (vn(vec2(along * 95., 7.)) - .5) * .006;
  float side = d > tear ? 1. : -1.;
  vec2 q = p - dir * slide * side * (open > 0. ? 1. : 0.) - nrm * gap * side;
  float dq = dot(q, nrm) - tear;
  vec3 c;
  float inside = open > 0. ? step(0., dq * side) : 1.;
  vec2 quv = q / asp + .5;
  float edgeFill = 1. - smoothstep(.1, .3, open);
  inside *= open > 0. ? mix(step(0., quv.x) * step(quv.x, 1.) * step(0., quv.y) * step(quv.y, 1.), 1., edgeFill) : 1.;
  c = samp(open > 0. ? mix(quv, clamp(quv, 0., 1.), edgeFill) : uv);
  if (inside < .5) c = vec3(0.);
  float rimD = abs(dq);
  float fibre = smoothstep(.011, .0, rimD) * (.55 + .45 * vn(vec2(along * 160., rimD * 900.)));
  float shade = smoothstep(.05, .0, rimD) * .38;
  if (open > 0.) {c *= 1. - shade * inside; c = mix(c, S(vec3(.97, .94, .88)), fibre * inside * clamp(open * 6., 0., 1.));}
  float seam = exp(-abs(d) * 160.) * .9 + exp(-abs(d) * 26.) * .22;
  vec3 voidC = S(vec3(.012, .008, .009));
  if (inside < .5) c = voidC;

  float burnD = abs(d) + (fbm(p * 5. + vec2(3., 1.)) - .5) * .3 + (vn(p * 38.) - .5) * .04, front = uBurn * 1.6;
  float burnt = uBurn > .001 ? 1. - smoothstep(front - .012, front + .012, burnD) : 0.;
  float charEdge = uBurn > .001 ? smoothstep(.03, .0, abs(burnD - front)) : 0.;
  c = mix(c, voidC, burnt * inside);
  c += mix(vec3(.8, .16, .05), hot, .2) * charEdge * 1.1 * inside * (1. - smoothstep(.97, 1.1, uBurn)) + (uBurn > .001 ? vec3(.12, .03, .01) * smoothstep(.12, .0, abs(burnD - front - .05)) * inside * (1. - burnt) : vec3(0.));
  c += hot * (open > 0. ? (inside < .5 ? 1.6 * smoothstep(gap + .004, 0., abs(d)) + seam * .6 : 0.) : 0.) * uSplit.y;
  c += hot * seam * uSplit.y * .45 * (open > 0. ? 0. : 1.);
  float sl = uSplit.w, head = sl * 2.4 - 1.2;
  float line = smoothstep(.004, .0, abs(d)) * smoothstep(head, head - .5, along) * step(-1.3, along) * smoothstep(head + .12, head, along + .001);
  c = mix(c, S(vec3(1., .985, .95)) * 2., clamp(line * (sl > 0. ? 1. : 0.) * (1. - uSplit.x), 0., 1.));
  float f = paperFibre(uv);
  float paperOn = inside * (1. - burnt);
  c *= 1. + (f - .5) * .16 * paperOn;
  c *= 1. - .05 * smoothstep(.55, .75, vn(uv * uCss / 38. + 5.)) * paperOn;
  if (uSeal.x > .001) {
    float sz = uSeal.w * (1. + pow(1. - clamp(uSeal.x, 0., 1.), 2.) * .45);
    vec2 sq = rot(-.07) * ((uv - uSeal.yz) * asp) / sz;
    float box = sdBox(sq, vec2(.84)) - .12;
    float frame = smoothstep(.07, .035, abs(box + .03));
    float mark = smoothstep(.02, -.02, sdMK(sq / .4) * .4 + .005);
    float cover = smoothstep(.15, .5, fbm(uv * uCss / 7. + 11.) + .35 * uSeal.x);
    float m = max(frame, mark) * cover * smoothstep(.0, .2, uSeal.x) * (1. - burnt);
    c = mix(c, S(vec3(.91, .255, .17)) * (.9 + .2 * vn(uv * uCss / 3.)), m * .96);
  }
  return c;
}`,$t="vec3 look(vec3 c, vec2 uv){ return c; }",Jt=`
uniform float uAsp, uT, uHz, uZoom, uNight, uSun, uYaw, uMoonK; uniform vec3 uCamP;
varying vec2 vUv;

float ridge(float X, float seed){
  float n = fbm3(vec2(X * .8 + seed * 7., seed)) * .72 + .28 * vn(vec2(X * 2.3 + seed * 3., seed + 5.));
  float m = smoothstep(.3, .66, n);
  float crag = (vn(vec2(X * 6. + seed, seed * 2.)) - .5) * .16 + (vn(vec2(X * 21. + seed, 1.)) - .5) * .05;
  float base = .1 + 1.0 * m;
  return base + crag * (.3 + m);
}
void main(){
  vec2 s = (vUv - .5) * vec2(uAsp, 1.);
  float y = (s.y - uHz) / uZoom, x = s.x / uZoom + uYaw, aa = fwidth(y) * 1.3;
  float grad = smoothstep(-.02, .8, y);
  vec3 skyN = mix(S(vec3(.3, .295, .29)), S(vec3(.012, .012, .014)), grad), skyD = mix(S(vec3(.97, .945, .89)), S(vec3(.66, .63, .6)), grad);
  vec3 haze = mix(S(vec3(.92, .9, .85)), S(vec3(.34, .33, .32)), uNight);
  vec3 col = mix(skyD, skyN, uNight);
  col *= 1. + (fbm(vec2(x * 1.4 + y * .35, y * 24.) + 2.) - .5) * .3 * (.35 + grad);
  col *= 1. + (fbm(vec2(x * .5, y * 3.) + 7.) - .5) * .16;
  vec2 mc = vec2(0., .2 * uMoonK), md = vec2(x, y) - mc; float mr = .1, dm = length(md);
  float moon = smoothstep(mr + aa, mr - aa, dm);
  vec3 paper = S(vec3(.99, .975, .925));
  col += paper * exp(-max(dm - mr, 0.) * 8.) * .26 * uNight + paper * exp(-max(dm - mr, 0.) * 2.5) * .06 * uNight;
  col = mix(col, paper * (1. - .15 * smoothstep(.46, .72, fbm3(md * 22. + 5.)) - .05 * smoothstep(.0, mr, dm)), moon);
  vec2 sc = vec2(.43, .035 + .03 * (1. - uSun)), sd = vec2(x, y) - sc; float sr = .068, ds = length(sd);
  vec3 verm = S(vec3(.91, .255, .17));
  col += verm * exp(-max(ds - sr, 0.) * 9.) * .2 * uSun;
  col = mix(col, verm * (.95 + .1 * vn(sd * 90.)), smoothstep(sr + aa, sr - aa, ds) * uSun);

  for (int k = 0; k < 5; k++){
    float fk = float(k), par = .02 + .028 * fk, f = .85 + .3 * fk, sc2 = 1. + (14. - uCamP.z) * .0016 * (1. + fk);
    float X = (x + uCamP.x * par * .1) * f * sc2 + 17. * fk;
    float h = -.012 + (.2 - .034 * fk) * (1.05 * ridge(X, fk * 3.3 + 1.)) + .02 * fk;
    float bleed = .0016 + .0055 * vn(vec2(X * 40., fk + 3.)) + .003 * fk;
    float mask = smoothstep(h + bleed + aa, h - bleed - aa, y);
    float gN = mix(.3, .014, fk / 4.), gD = mix(.7, .08, pow(fk / 4., .8));
    vec3 g = S(vec3(mix(gD, gN, uNight)));
    float dep = .13 - .012 * fk;
    float streak = vn(vec2(X * 5., y * 70. + fk));
    vec3 body = mix(g, haze, clamp(smoothstep(h - dep * .08, h - dep, y) * (.78 + .22 * fbm(vec2(X * 2.4, y * 6. + fk))), 0., 1.));
    body *= 1. + (streak - .5) * .22 + (fbm(vec2(X * 14., y * 26.)) - .5) * .12;
    body *= 1. - .35 * smoothstep(.014, .0, h - y) * smoothstep(-.003, .004, h - y);
    body = mix(body, haze, smoothstep(.07, .0, y));
    col = mix(col, body, mask);
    col *= 1. - .1 * smoothstep(h + .05, h, y) * (1. - mask) * (.4 + .6 * fk / 4.);
    float mist = smoothstep(.0, -.2, y - h * .4) * (.35 + .65 * fbm(vec2(X * .9 + uT * .004, y * 3. + fk * 5.))) * (.55 - .06 * fk);
    col = mix(col, haze * 1.03, mist * smoothstep(.1, -.06, y) * step(fk, 3.5) + mist * .5 * step(3.5, fk));
  }
  col = mix(col, haze, smoothstep(-.015, -.07, y));
  gl_FragColor = vec4(col, 1.);
}`;async function na(g){await Nt([`900 80px ${st.serif}`,`900 80px ${st.ar}`]);const x=g.lang==="ar",K=g.quality,c=qt(g),n=Ot(31),f=Wt(g,{pin:1,pout:2,bloom:.08,expo:1,tone:0,color:Zt,look:$t,uniforms:{uSplit:{value:new nt(0,0,3.1,0)},uSeal:{value:new nt(0,.82,.22,.1)},uCut:{value:0},uBurn:{value:0}}}),w=f.world,m=new Et(34,g.viewport.aspect,.1,400);w.add(m);const ie=new C(new O(2,2),new N({depthTest:!1,depthWrite:!1,uniforms:{uAsp:{value:1},uT:{value:0},uHz:{value:0},uZoom:{value:1},uNight:{value:1},uSun:{value:0},uYaw:{value:0},uMoonK:{value:1},uCamP:{value:new se}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1., 1.); }",fragmentShader:P+Jt}));ie.frustumCulled=!1,ie.renderOrder=-10,w.add(ie);const U=ie.material.uniforms,de=new N({uniforms:{uT:{value:0},uNight:{value:1}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:P+`uniform float uT, uNight; varying vec3 vW;
      void main(){
        float dist = length(vW - cameraPosition);
        vec3 haze = mix(S(vec3(.92, .9, .85)), S(vec3(.34, .33, .32)), uNight);
        vec3 near = mix(S(vec3(.965, .94, .87)), S(vec3(.86, .83, .76)), uNight * .55);
        float streak = fbm(vec2(vW.x * .15, vW.z * 2.4) + 3.), blot = fbm(vW.xz * .11 + 9.), dry = vn(vec2(vW.x * .9, vW.z * 11.));
        vec3 c = near * (.9 + .14 * streak) * (.92 + .12 * blot);
        c = mix(c, c * .72, smoothstep(.58, .8, fbm(vW.xz * .34 + 1.)) * .55);
        c *= 1. - .07 * smoothstep(.6, .85, dry) * (1. - smoothstep(10., 40., dist));
        float fog = 1. - exp(-dist * .04 * (1. + .5 * uNight));
        gl_FragColor = vec4(mix(c, haze, clamp(fog, 0., 1.)), 1.);
      }`}),ut=new C(new O(400,400).rotateX(-Math.PI/2),de);w.add(ut);const pe=(e,t,a,o)=>[{t:e-1.1,pos:t,look:a,fov:o,hold:!0},{t:e+1.1,pos:t,look:a,fov:o,hold:!0}],V=c?7.4:6.4,De=c?47:34,re=(c?0:1.95)*(x?-1:1),Be=c?.5:0,ne=e=>{const t=B[e];return pe(Ne.ink[e]*A,[t[0]-re*.35,1.35,t[2]+V],[t[0]-re,1.3-Be,t[2]],De)},fe=e=>{const t=B[e],a=(c?2.35:3.75)/2,o=B[e+1][0]-re*.35>t[0]?1:-1;return[{t:(Ne.ink[e]+Ne.ink[e+1])/2*A,pos:[t[0]+o*(a+2.1),1.4,t[2]+1.2],look:[B[e+1][0]-re,1.3-Be,B[e+1][2]],fov:De}]},he=(e,t)=>[t[0],t[1]+Math.tan(e*Math.PI/180)*60,t[2]-60],T=c?{x:-3,z:-36.6}:{x:-1,z:-35.4},xe=c?50:34,ge=c?[.2,1.3,-48]:[-.4,1.3,-44],Ke=[{t:0,pos:[0,1,15],look:he(6.9,[0,1,15]),fov:13,hold:!0},{t:2.4,pos:[0,1,15],look:he(6.9,[0,1,15]),fov:13,hold:!0},{t:5.8,pos:[0,1.15,12.5],look:he(3.2,[0,1.15,12.5]),fov:30},...ne(0),...fe(0),...ne(1),...fe(1),...ne(2),...fe(2),...ne(3),{t:40,pos:[1.4,1.4,-27.5],look:[-.4,1.4,-50],fov:36},...pe(.72*A,[T.x,1.38,T.z],ge,xe),...pe(.88*A,[T.x,1.38,T.z],ge,xe),{t:A,pos:[T.x,1.38,T.z],look:ge,fov:xe,hold:!0}],lt=Dt(Ke),F=Ke.map(e=>[e.pos[0],e.pos[2]]),ct=(e,t)=>{for(let a=0;a<F.length-1;a++){const[o,s]=F[a],[r,d]=F[a+1],v=r-o,i=d-s,y=v*v+i*i||1,M=_(((e-o)*v+(t-s)*i)/y),I=o+v*M,E=s+i*M;if(Math.hypot(e-I,t-E)<1.7)return!1}for(const a of B)if(Math.abs(e-a[0])<2.4&&t<a[2]+V+1&&t>a[2]-.4)return!1;if(Math.hypot(e-z.x,t-z.z)<2.4||Math.hypot(e-b.x,t-b.z)<3.4)return!1;{const a=T.x,o=T.z,s=b.x-a,r=b.z-o,d=_(((e-a)*s+(t-o)*r)/(s*s+r*r)),v=a+s*d,i=o+r*d;if(Math.hypot(e-v,t-i)<4.2)return!1}return!0},Z=[3e3,6400,1e4][K],He=new Float32Array(Z*3),Le=new Float32Array(Z*4);for(let e=0,t=0;t<Z&&e<Z*8;e++){const a=Math.floor(n()*(F.length-1)),o=n(),s=F[a][0],r=F[a][1],d=F[a+1][0],v=F[a+1][1],i=.9+Math.pow(n(),1.8)*26,y=n()*6.283,M=s+(d-s)*o+Math.cos(y)*i*1.2,I=r+(v-r)*o+Math.sin(y)*i,E=ct(M,I);!E&&n()<.5||(He.set([M,E?0:.22+n()*.36,I],t*3),Le.set([n(),n(),n(),n()],t*4),t++)}const q=new We,we=new O(1,1,1,7);q.index=we.index,q.setAttribute("position",we.getAttribute("position")),q.setAttribute("uv",we.getAttribute("uv")),q.instanceCount=Z,q.setAttribute("aBase",new D(He,3)),q.setAttribute("aR",new D(Le,4));const ve=new N({transparent:!0,depthWrite:!1,uniforms:{uT:{value:0},uNight:{value:1},uWind:{value:1}},vertexShader:`
      attribute vec3 aBase; attribute vec4 aR; uniform float uT, uWind; varying vec2 vUv; varying float vFog, vTone, vSeed;
      void main(){
        vUv = uv; vSeed = aR.y;
        float reed = step(.5, fract(aR.x * 7.3));
        float hgt = (aBase.y > 0. ? aBase.y * (.8 + aR.x * .6) : .9 + aR.x * 1.9) * mix(1., 1.35, reed), u = uv.y;
        vec3 baseP = vec3(aBase.x, 0., aBase.z);
        float wave = sin(dot(baseP.xz, vec2(.21, .33)) - uT * 1.1) * .55 + sin(dot(baseP.xz, vec2(.57, -.2)) - uT * 2.2 + aR.y * 6.) * .22 + sin(uT * .7 + aR.z * 6.28) * .08;
        float gust = smoothstep(.2, .9, sin(dot(baseP.xz, vec2(.05, .07)) - uT * .45) * .5 + .5);
        float bend = ((aR.w - .5) * .5 + wave * (.5 + .5 * gust)) * uWind;
        vec3 toCam = cameraPosition - baseP; toCam.y = 0.; vec3 right = normalize(vec3(toCam.z, 0., -toCam.x) + 1e-5);
        float width = (.07 + aR.z * .055) * pow(1. - u, .8) * (aBase.y > 0. ? .5 : 1.) * mix(1., .5, reed);
        vec3 p = baseP + vec3(0., u * hgt, 0.) + right * (bend * u * u * 1.15 + (uv.x - .5) * 2. * width);
        p.y -= bend * bend * u * u * .25;
        float dist = length(p - cameraPosition);
        vFog = 1. - exp(-dist * .016); vTone = aR.y;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:P+`
      uniform float uNight; varying vec2 vUv; varying float vFog, vTone, vSeed;
      void main(){
        float across = abs(vUv.x - .5) * 2., u = vUv.y;
        float rag = (vn(vec2(vUv.y * 9. + vSeed * 40., vSeed * 11.)) - .5) * .34;
        float body = smoothstep(1., .72, across + rag * .5);
        float streak = vn(vec2(vUv.x * 16. + vSeed * 50., u * 2.4 + vSeed * 9.));
        float hairs = mix(.5, 1., smoothstep(.2, .62, streak));
        float load = mix(1., .5, pow(u, 1.3)) * (.85 + .15 * vTone);
        float tip = smoothstep(1., .94, u + rag * .06);
        float wash = step(.72, vTone);
        float a = body * hairs * load * tip * (1. - vFog * .7) * mix(1., .42, wash);
        vec3 haze = mix(S(vec3(.92, .9, .85)), S(vec3(.34, .33, .32)), uNight);
        vec3 inkC = mix(S(vec3(.01)), S(vec3(.22)), wash);
        gl_FragColor = vec4(mix(inkC, haze, vFog * .45), clamp(a * 1.3, 0., 1.));
      }`}),be=new C(q,ve);be.frustumCulled=!1,be.renderOrder=4,w.add(be);const ye=[40,90,150][K],H=new We,Se=new O(1,1),Xe=new Float32Array(ye*4);for(let e=0;e<ye*4;e++)Xe[e]=n();H.index=Se.index,H.setAttribute("position",Se.getAttribute("position")),H.setAttribute("uv",Se.getAttribute("uv")),H.instanceCount=ye,H.setAttribute("aR",new D(Xe,4));const Me=new N({transparent:!0,depthWrite:!1,uniforms:{uT:{value:0},uCam:{value:new se},uAmt:{value:1}},vertexShader:`
      attribute vec4 aR; uniform float uT; uniform vec3 uCam; uniform float uAmt; varying vec2 vUv; varying float vA, vR;
      void main(){
        vUv = uv; vR = aR.x;
        float life = 14. + aR.y * 10., ph = mod(uT * (.6 + aR.z * .5) + aR.w * life, life) / life;
        vec3 p = uCam + vec3(-9. + ph * 20. + sin(uT * .8 + aR.x * 9.) * .8, 3.2 - ph * 3.4 + (aR.y - .5) * 3., -4. - aR.z * 18. + sin(uT * .6 + aR.w * 12.) * 1.5);
        p.x += (aR.x - .5) * 12.;
        float s = .05 + aR.y * .06 + .06 * step(.93, aR.x);
        float ang = -.5 + sin(uT * (.7 + aR.z) + aR.w * 6.) * .6 + aR.x * 1.5, ca = cos(ang), sa = sin(ang);
        vec2 qd = position.xy; qd = vec2(ca * qd.x - sa * qd.y, sa * qd.x + ca * qd.y);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        p += (right * qd.x + up * qd.y) * s * 2.2;
        vA = smoothstep(0., .08, ph) * smoothstep(1., .85, ph) * step(aR.x, uAmt);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:P+"varying vec2 vUv; varying float vA, vR; void main(){ vec2 c = vUv * 2. - 1.; float head = length((c - vec2(.38, 0.)) * vec2(1., 1.5)) - .4; float tail = sdSeg(c, vec2(-.7, .16), vec2(.1, 0.)) - (.03 + .12 * smoothstep(-.7, .1, c.x)); float d = min(head, tail) + (fbm3(c * 3. + vR * 30.) - .5) * .3; float a = smoothstep(.07, -.07, d) * vA; gl_FragColor = vec4(S(vec3(.02)), a * .92); }"}),Re=new C(H,Me);Re.frustumCulled=!1,Re.renderOrder=6,w.add(Re);const mt=[280,520,860][K],dt=[24,44,70][K],Ie=Lt();Ie.apply(h.guard);const ke=Ie.capsules();let Ee=0;const pt=()=>{const e=ke.map(i=>Math.hypot(i[3]-i[0],i[4]-i[1],i[5]-i[2])+i[6]*2.6),t=e.reduce((i,y)=>i+y,0);let a=n()*t,o=0;for(;a>e[o]&&o<ke.length-1;)a-=e[o++];const s=ke[o],r=n(),d=n()*6.283,v=Math.sqrt(n())*s[6]*1.4;return Ee=Math.atan2(s[4]-s[1],s[3]-s[0]),[s[0]+(s[3]-s[0])*r+Math.cos(d)*v,s[1]+(s[4]-s[1])*r+Math.sin(d)*v,s[2]+(s[5]-s[2])*r+(n()-.5)*.2]},Ge=e=>{const t=new Float32Array(e*3),a=new Float32Array(e*3),o=new Float32Array(e*4),s=new Float32Array(e*2);for(let v=0;v<e;v++){t.set(pt(),v*3);const i=n()*6.283,y=5+n()*11;a.set([Math.cos(i)*y,(n()-.2)*7,Math.sin(i)*y*.8-3],v*3),o.set([n(),n(),n(),n()],v*4),s.set([(Ee+(n()-.5)*1.1)/6.283+1,n()],v*2)}const r=new We,d=new O(1,1,1,5);return r.index=d.index,r.setAttribute("position",d.getAttribute("position")),r.setAttribute("uv",d.getAttribute("uv")),r.instanceCount=e,r.setAttribute("aHome",new D(t,3)),r.setAttribute("aAway",new D(a,3)),r.setAttribute("aR",new D(o,4)),r.setAttribute("aX",new D(s,2)),r},L={uT:{value:0},uGather:{value:0},uScatter:{value:-1},uOrigin:{value:b.clone()},uScale:{value:vt},uFade:{value:1}},Ye=`
    attribute vec3 aHome, aAway; attribute vec4 aR; attribute vec2 aX; uniform float uT, uGather, uScatter, uScale; uniform vec3 uOrigin; varying vec2 vUv; varying vec4 vR; varying float vK;
    vec3 foePos(out float st){
      st = clamp(uGather * 1.5 - aR.x * .5, 0., 1.); st = st * st * (3. - 2. * st);
      vec3 p = uOrigin + mix(aAway * 1., aHome * uScale, st);
      p += vec3(sin(uT * 1.7 + aR.y * 30.), cos(uT * 1.3 + aR.z * 20.), sin(uT * .9 + aR.w * 17.)) * .05 * st * uScale;
      if (uScatter >= 0.) {
        float ts = max(uScatter - aR.x * .22, 0.);
        vec3 d = normalize(aHome * uScale - vec3(0., 1.1 * uScale, 0.) + (aR.xyz - .5) * 1.2 + vec3(0., .3, .0));
        p += d * (1. - exp(-ts * 2.6)) * (2.2 + aR.y * 3.4) - vec3(0., .5 * 5. * ts * ts, 0.);
      }
      return p;
    }`,ft=new N({transparent:!0,depthWrite:!1,uniforms:L,vertexShader:Ye+`
      void main(){
        vUv = uv; vR = aR; float st; vec3 p = foePos(st);
        float s = (.04 + aR.z * aR.z * .26) * (.25 + .75 * st) * uScale * (uScatter >= 0. ? 1. - smoothstep(.2, 1.8, uScatter - aR.x * .22) * .9 : 1.);
        vK = st;
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        p += (right * position.x + up * position.y) * s * 2.;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:P+`
      uniform float uFade; varying vec2 vUv; varying vec4 vR; varying float vK;
      void main(){
        vec2 c = vUv * 2. - 1.; float n = fbm3(c * 2.2 + vR.w * 40.), r = length(c);
        float blot = smoothstep(.95 - n * .75, .35 - n * .3, r);
        float drop = smoothstep(.12, .05, length(c - (vec2(vR.x, vR.y) - .5) * 1.5)) * step(.6, vR.w);
        float a = max(blot, drop) * (.6 + .4 * vR.y) * vK * uFade;
        gl_FragColor = vec4(mix(S(vec3(.012)), S(vec3(.12)), vR.z * .6), clamp(a, 0., .96));
      }`}),$=new C(Ge(mt),ft);$.frustumCulled=!1,$.renderOrder=8,w.add($);const ht=new N({transparent:!0,depthWrite:!1,side:Gt,uniforms:L,vertexShader:Ye+`
      void main(){
        vUv = uv; vR = aR; float st; vec3 p = foePos(st); vK = st;
        float len = (.35 + aR.z * .85) * uScale * (.2 + .8 * st), ang = aX.x * 6.283 + (1. - st) * 2. * (aR.y - .5), u = uv.y - .5;
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vec2 d = vec2(cos(ang), sin(ang)), n = vec2(-d.y, d.x);
        float w = (.02 + aR.w * .035) * uScale * (1. - abs(u) * 1.7) * (uScatter >= 0. ? 1. - smoothstep(.1, 1.2, uScatter - aR.x * .22) : 1.);
        vec2 l = d * u * len + n * ((uv.x - .5) * 2. * w + sin(u * 5. + aR.y * 9.) * len * .12 * (1. - 4. * u * u));
        p += right * l.x + up * l.y;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:P+"uniform float uFade; varying vec2 vUv; varying vec4 vR; varying float vK; void main(){ float across = abs(vUv.x - .5) * 2.; float hairs = .5 + .5 * smoothstep(.2, .7, vn(vec2(vUv.x * 9. + vR.x * 40., vUv.y * 1.5 + vR.y * 9.))); float a = smoothstep(1., .5, across) * hairs * smoothstep(.0, .12, vUv.y) * smoothstep(1., .88, vUv.y) * vK * uFade * .9; gl_FragColor = vec4(S(vec3(.012)), a); }"}),J=new C(Ge(dt),ht);J.frustumCulled=!1,J.renderOrder=8,w.add(J);const X=it(g,["ink"],{seed:3,px:[448,640,896][K]});X.set({ink:1}),X.mesh.renderOrder=3.5,w.add(X.mesh);const S=it(g,["clutter"],{seed:7,px:[448,640,896][K]});S.set({clutter:1}),S.mesh.renderOrder=3.6,w.add(S.mesh);const je=new N({transparent:!0,depthWrite:!1,uniforms:{},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:P+"varying vec2 vUv; void main(){ vec2 c = vUv * 2. - 1.; float a = smoothstep(1., .15, length(c * vec2(.8, 1.))) * (.55 + .45 * fbm(vUv * 6.)); gl_FragColor = vec4(S(vec3(.03)), a * .45); }"}),Ve=(e,t,a)=>{const o=new C(new O(1,1).rotateX(-Math.PI/2),je);return o.scale.set(a,1,a*.5),o.position.set(e,.02,t),o.renderOrder=2,w.add(o),o},xt=Ve(z.x,z.z,1.9),gt=Ve(b.x,b.z,4.2),wt=[{t:.55,pose:h.stand},{t:.66,pose:h.iaido,ease:"io"},{t:.745,pose:h.iaido},{t:.754,pose:h.draw,ease:"snap"},{t:.79,pose:h.follow,ease:"out"},{t:.85,pose:h.follow},{t:.905,pose:h.sheath,ease:"io"}],Ce=new Float32Array(h.stand.length),Ze=new Float32Array(h.stand.length),$e=new Float32Array(h.stand.length),Ae=g.films.slice(me.ink[0],me.ink[0]+me.ink[1]).map(e=>Xt(g,e,c)),ze=new Yt(new Uint8Array([20,20,20,255]),1,1);ze.needsUpdate=!0;const Je=B.map((e,t)=>{const a=new N({transparent:!0,depthWrite:!0,uniforms:{uTex:{value:ze},uHas:{value:0},uLive:{value:0},uAsp:{value:1.7777777777777777},uCAsp:{value:1.7777777777777777},uClear:{value:0},uLamp:{value:1},uT:{value:0},uSeed:{value:t*7.3},uNight:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:P+`
        uniform sampler2D uTex; uniform float uHas, uLive, uAsp, uCAsp, uClear, uLamp, uT, uSeed, uNight; varying vec2 vUv; varying vec3 vW;
        vec3 film(vec2 uv, float blur){
          vec2 s = uAsp > uCAsp ? vec2(1., uCAsp / uAsp) : vec2(uAsp / uCAsp, 1.), t = (uv - .5) * s + .5;
          vec3 c = vec3(0.); float w = 0.;
          for (int i = 0; i < 9; i++){ vec2 o = vec2(float(i % 3) - 1., float(i / 3) - 1.) * blur; c += texture2D(uTex, t + o).rgb; w += 1.; }
          c /= w; if (uLive > .5) c = pow(c, vec3(2.2));
          return c;
        }
        void main(){
          vec2 p = (vUv - .5) * vec2(uAsp, 1.), half_ = vec2(uAsp, 1.) * .5;
          float rag = (fbm(vUv * vec2(uAsp, 1.) * 9. + uSeed) - .5) * .07 + (vn(vUv * 140. + uSeed) - .5) * .012;
          float d0 = sdBox(p, half_ - .06) + rag, aa = fwidth(d0) * 1.2;
          float body = smoothstep(.06 + aa, .06 - aa, d0);
          float frameD = smoothstep(.085, .062, d0) - smoothstep(.062, .036, d0);
          float fibre = .86 + .26 * fbm(vUv * vec2(uAsp, 1.) * 22. + uSeed) + .06 * vn(vUv * 400.);
          vec3 paper = S(vec3(.97, .925, .8)) * fibre;
          float mg = .1 + .02 * vn(vUv * 9. + uSeed);
          float d1 = sdBox(p, half_ - .06 - mg) + (fbm(vUv * vec2(uAsp, 1.) * 14. + uSeed + 4.) - .5) * .035 * (1. - uClear * .6);
          float pic = smoothstep(.03, -.03, d1);
          float blur = mix(.05, .0016, uClear);
          vec3 f = uHas > .5 ? film(vUv, blur) : S(vec3(.5, .42, .3));
          vec3 tint = uHas > .5 ? film(vUv, .22) : S(vec3(.5, .42, .3));
          vec3 warm = mix(S(vec3(1., .9, .7)), vec3(1.), uClear * .8);
          float glowIn = exp(-max(d1, 0.) * 7.);
          vec3 lamp = paper * (.62 + .45 * uLamp) * warm * (.55 + 1.0 * glowIn) + tint * glowIn * .55 * warm;
          vec3 picC = mix(f * mix(1.6, 1.15, uClear), paper * .5, .1 * (1. - uClear)) * warm * (.85 + .15 * fibre);
          vec3 c = mix(lamp, picC, pic * mix(.8, 1., uClear));
          c *= .9 + .1 * smoothstep(.0, .07, -d0 - .06);
          float inkF = frameD * (.8 + .2 * vn(vUv * 80.));
          c = mix(c, S(vec3(.02)), inkF);
          float halo = exp(-max(d0, 0.) * 6.) * .26 * uLamp * (1. - uClear * .5);
          float a = max(body, frameD * .95);
          gl_FragColor = vec4(c + S(vec3(1., .8, .55)) * halo * (1. - a), max(a, halo * .5));
        }`}),o=new C(new O(1,1),a);o.position.set(e[0],0,e[2]),o.renderOrder=3,w.add(o);const s=new C(new O(1,1).rotateX(-Math.PI/2),je);return s.renderOrder=2,w.add(s),{mesh:o,m:a,sh:s,s:e}}),Q=qe(x?[j.round[0].ar]:[j.round[0].en],{rtl:x,italic:!x,color:"#f4eee2",color2:"#bbb4a6",weight:900,px:x?320:280,seed:6,width:2048}),ee=qe(x?[j.art[0].ar]:[j.art[0].en.toUpperCase()],{rtl:x,italic:!x,color:"#e8412c",color2:"#9c2a1c",weight:800,px:x?260:190,seed:11,width:2048,drops:.6}),te=qe(x?[j.round[0].ar]:[j.round[0].en],{rtl:x,italic:!x,color:"#0a0908",color2:"#1c1a17",weight:900,px:x?320:280,seed:9,width:2048,drops:0});m.add(te.mesh,Q.mesh,ee.mesh);let Ue=-1;const bt=new se,yt={scene:f.scene,camera:m,light:!1,focus(e){e||Ae.forEach(t=>t.pause())},update({p:e,t,dt:a,v:o,active:s}){const r=Bt(g,t,a);f.tick(t,o);const d=e*A,v=g.viewport.aspect,i=lt(d),y=Math.hypot(i[0]-i[3],i[1]-i[4],i[2]-i[5]);c&&d>5&&e<.6&&(i[6]=Math.max(i[6],Kt(3.6,y,v))),Ht(m,i,r.x,r.y,d>5?1:.15);const M=m.getWorldDirection(bt),I=Math.asin(_(M.y,-1,1)),E=Math.atan2(M.x,-M.z),St=m.fov,Qe=Math.tan(_e.degToRad(St/2)),Mt=Math.tan(_e.degToRad(18))/Qe,ue=1-l(.12,.7,e)*.92,Rt=l(.64,.76,e)*(1-l(.93,.985,e));U.uAsp.value=v,U.uT.value=t,U.uHz.value=-Math.tan(I)/(2*Qe),U.uZoom.value=Mt,U.uYaw.value=E/.65,U.uNight.value=_(ue),U.uSun.value=location.search.includes("nosun")?0:Rt,U.uCamP.value.copy(m.position),de.uniforms.uNight.value=_(ue),de.uniforms.uT.value=t,ve.uniforms.uT.value=t,ve.uniforms.uNight.value=_(ue),ve.uniforms.uWind.value=1+l(.6,.78,e)*.5,Me.uniforms.uT.value=t,Me.uniforms.uCam.value.copy(m.position);let et=-1,Te=1e9;Je.forEach((p,W)=>{const le=m.position.distanceTo(p.mesh.position);le<Te&&(Te=le,et=W)});const tt=s&&e<.6&&Te<V+3.2?et:-1;Je.forEach((p,W)=>{const le=Ae[W],ce=le.frame(W===tt),Ft=m.position.distanceTo(p.mesh.position),Y=c?2.35:3.75,Oe=c?Y*1.5:Y*9/16,Pt=1-l(V+.6,V+6.5,Ft);p.mesh.scale.set(Y,Oe,1),p.mesh.position.y=Oe/2+.22,p.sh.scale.set(Y*1.3,1,Y*.5),p.sh.position.set(p.s[0],.02,p.s[2]+.1),p.mesh.lookAt(m.position.x,p.mesh.position.y,m.position.z);const R=p.m.uniforms;R.uAsp.value=Y/Oe,R.uCAsp.value=ce.asp,R.uTex.value=ce.tex??ze,R.uHas.value=ce.tex?1:0,R.uLive.value=ce.live?1:0,R.uClear.value=Pt,R.uLamp.value=(.9+.1*Math.sin(t*3.1+W))*l(.035,.09,e),R.uT.value=t,R.uNight.value=_(ue),p.mesh.visible=p.sh.visible=e>.075}),Ue=tt;const at=e>.5,kt=e<.742?0:e<.754?k(.742,.754,e):e<.86?1:1-k(.86,.9,e);X.mesh.visible=xt.visible=at,at&&(It(wt,e,Ce),Ce[1]+=Math.sin(t*1.3)*.004,X.update(m,z,jt,Ce,{t,sword:e<.905?kt:-1,amt:l(.5,.6,e)*(1-l(.96,.985,e)),scale:1}));const Fe=e>.3;if(S.mesh.visible=gt.visible=Fe,Fe){rt(h.stance,h.guard,.5+.5*Math.sin(t*.9),Ze);const p=l(u.split0,u.split0+.02,e);rt(Ze,h.hit,p,$e);const W=e>u.split0+.008?(e-u.split0-.008)*A*.5:0;S.U.uGather.value=l(.3,.66,e),S.U.uScatter.value=W,S.update(m,b,Vt,$e,{t,amt:1-l(.9,.93,e),scale:vt})}location.search.includes("nofoe")&&(S.mesh.visible=!1,$.visible=J.visible=!1),L.uT.value=t,L.uGather.value=l(.3,.66,e)*.85,L.uScatter.value=e>u.split0+.008?(e-u.split0-.008)*A:-1,L.uFade.value=1-l(.9,.93,e),$.visible=J.visible=Fe;const Ct=f.U.uSplit.value,At=oe.inOut(k(u.split0,u.split1,e))*(1-oe.inOut(k(u.back0,u.back1,e))*.93),zt=k(u.slash0,u.split0,e);Ct.set(At,l(u.split0-.01,u.split0+.02,e)*.85+l(u.burn0,1,e)*.5,3.1,zt),f.U.uSeal.value.set(k(u.seal,u.seal+.035,e),.79,.27,c?.075:.09),f.U.uBurn.value=k(u.burn0,u.burn1,e);const ot=k(.02,.075,e),Pe=l(.07,.097,e),ae=10*Math.tan(_e.degToRad(m.fov/2)),Ut=ae*v,G=Math.min(Ut*.6,ae*1.12);Q.mesh.scale.setScalar(G),Q.mesh.position.set(0,ae*(c?.16:.17),-5),Q.set(oe.inOut(ot),1-Pe),te.mesh.scale.setScalar(G),te.mesh.position.set(G*.014,ae*(c?.16:.17)-G*.012,-5.02),te.set(oe.inOut(ot),(1-Pe)*.85);const Tt=G*.58;ee.mesh.scale.setScalar(Tt),ee.mesh.position.set(0,ae*(c?.16:.17)-G*.17,-5),ee.set(oe.inOut(k(.045,.085,e)),1-Pe),f.bell(e>.018&&e<.14?(e-.018)*A:-1,.5,c?.42:.52,1),f.U.uPin.value=1-l(0,.035,e),f.U.uPout.value=l(.965,1,e),f.draw(m)},resize(){f.resize()},pick(e,t){return Ue>=0?g.films[me.ink[0]+Ue].url:null},dispose(){f.dispose(),Q.dispose(),ee.dispose(),te.dispose(),X.dispose(),S.dispose(),Ae.forEach(e=>e.pause())}};return f.resize(),await f.warm(m),yt}export{na as default};
