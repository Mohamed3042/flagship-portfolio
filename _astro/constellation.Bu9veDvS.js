import{S as je,C as U,P as Ue,D as Se,T as _e,j as Ze,U as be,M as E,a as Ye,b as De,t as Xe,X as $e,s as te,G as oe,m as Te,Y as Je,Z as Ke,V as g,_ as Qe,J as S,r as P,$ as et,p as ae,o as Ge}from"./EditionWorld.astro_astro_type_script_index_0_lang.BfGWMqYB.js";import{f as tt,P as b,s as ot,g as ie,h as at,I as it,i as Re,a as rt}from"./_pearKit.B4KjjW-O.js";import"./preload-helper.4QTdcD_W.js";/* empty css                      *//*! © 2026 Mohamed Mahmoud. All rights reserved. */const _=["studio","business","people","utility"],D=[{r:9.7,orbit:8.6,top:0,gap:.3},{r:7.6,orbit:6.55,top:.26,gap:.38},{r:5.55,orbit:4.6,top:.52,gap:.55},{r:3.6,orbit:2.75,top:.78,gap:.9}],re=-.36,nt=1.1,Z=new g(-.5,1,.62).normalize(),st=new g(-.9,.44,0).normalize(),We="varying vec3 vP, vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",Ce=`
  float hair(float d, float w){ float px = fwidth(d); float ww = max(w, px * .75); return (1. - smoothstep(ww - px * .6, ww + px * .6, abs(d))) * min(1., w / ww); }
  float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float mottle(vec2 w){ return .93 + .1 * vn(w * 1.3) + .05 * vn(w * 4.1 + 7.); }   // the paper's cloudy body (smooth: no shimmer at a slant)
  float pool(vec3 w){ return .5 + .62 * exp(-dot(w.xz, w.xz) / 60.); }   // a warm light over the centre, the rim in the dark`,lt=`
  uniform vec3 uPaper, uFoil, uFoilHi, uLightDir; uniform vec4 uSph[15];
  uniform float uR0, uR1, uOrbit, uDraw, uTicks, uFocus, uGlint, uAbove, uAboveH, uTop, uNameAmt;
  uniform sampler2D uName; uniform vec2 uBand;
  varying vec3 vP, vW;
  ${Ce}
  void main(){
    float r = length(vP.xz), an = fract(atan(vP.z, vP.x) / 6.28318 + 1.), wa = atan(vW.z, vW.x);
    // paper: warm black, cloudy, a sheen where the light skims it
    vec3 col = uPaper * mottle(vW.xz);
    col *= .86 + .3 * pow(max(0., .5 + .5 * cos(wa - uGlint)), 3.);
    // engraving, drawn in going round (a compass): the rim first, then the ticks, the orbit and the name
    float D = uDraw * 1.3, d1 = step(an, D), d2 = step(an, D - .15), d3 = step(an, D - .3);
    float e = hair(r - (uR1 - .1), .011) * d1 + hair(r - (uR1 - .5), .007) * d1 + hair(r - (uR0 + .14), .006) * d2;
    float n = uTicks, idx = floor(an * n + .5), tick = (an * n - idx) / n * 6.28318 * r;
    float major = step(mod(idx, 5.), .5), len = mix(.12, .3, major);
    e = max(e, hair(tick, mix(.0045, .0075, major)) * step(uR1 - .5, r) * step(r, uR1 - .5 + len) * d2);
    float dn = 160., da = (fract(an * dn) - .5) / dn * 6.28318 * r;   // the orbit the films ride, dotted
    e = max(e, smoothstep(.03, .015, length(vec2(da, r - uOrbit))) * d3 * .85);
    // the family's name, engraved three times round the tier
    float u = 1. - fract(an * 3.), v = (r - uBand.x) / (uBand.y - uBand.x);
    if (v > 0. && v < 1.) { vec4 t = texture2D(uName, vec2(u, 1. - v)); e = max(e, t.a * d3 * uNameAmt); }
    // the pen: a spark where the compass is drawing
    float spark = exp(-pow((an - D) * 70., 2.)) * step(D, 1.) * step(.01, uDraw) * smoothstep(.2, .02, abs(r - (uR1 - .1)));
    // gold foil: brighter where its grooves face the light
    float glint = .62 + .75 * pow(max(0., .5 + .5 * cos(wa - uGlint)), 10.);
    vec3 foil = mix(uFoil, uFoilHi, clamp(glint - .7, 0., 1.)) * glint * (1. + uFocus * .3);
    col = mix(col, foil, clamp(e, 0., 1.));
    // shadows: the tier above, then each sphere (straight down the light)
    float sh = 0.;
    if (uAbove > 0.) { vec2 q = vW.xz + uLightDir.xz / uLightDir.y * uAboveH; sh = smoothstep(uAbove + .32, uAbove - .06, length(q)) * .6; }
    for (int i = 0; i < 15; i++) {
      vec4 s = uSph[i]; if (s.w <= 0.) continue;
      vec2 c = s.xz - uLightDir.xz / uLightDir.y * (s.y - uTop);
      sh = max(sh, smoothstep(s.w * 1.5, s.w * .2, length(vW.xz - c)) * .6);
    }
    col *= (1. - sh) * pool(vW);
    col += uFoilHi * spark * 2.2;
    gl_FragColor = vec4(col, 1.);
  }`,ut=`
  uniform vec3 uPaper, uFoil; uniform float uDraw, uGlint; uniform sampler2D uNums;
  varying vec3 vP, vW;
  ${Ce}
  void main(){
    float r = length(vW.xz), an = fract(atan(vW.z, vW.x) / 6.28318 + 1.), wa = atan(vW.z, vW.x);
    vec3 col = uPaper * mottle(vW.xz * .7);
    // the limb: a degree scale round the whole instrument, numbers every thirty degrees
    float L0 = 10.5, L1 = 11.4, d = step(an, uDraw * 1.2);
    float e = (hair(r - L0, .008) + hair(r - L1, .012) + hair(r - (L1 + .16), .006)) * d;
    float n = 360., idx = floor(an * n + .5), tick = (an * n - idx) / n * 6.28318 * r;
    float m5 = step(mod(idx, 5.), .5), m10 = step(mod(idx, 10.), .5);
    e = max(e, hair(tick, mix(.004, .007, m5)) * step(L0, r) * step(r, L0 + mix(.14, mix(.3, .5, m10), m5)) * d);
    float u = fract(an * 12.), v = (r - (L0 + .56)) / .3;   // read from outside: left to right along the near side, tops inward
    if (v > 0. && v < 1. && abs(u - .5) < .1) { float t = texture2D(uNums, vec2((1. - (u - .4) / .2) / 12. + floor(an * 12.) / 12., 1. - v)).a; e = max(e, t * d * .9); }
    // faint rings and spokes beyond: the chart runs on into the dark
    float ring = hair(fract(r / 1.2 + .5) - .5, .0035 / 1.2) * step(L1 + .5, r);
    float spoke = hair((fract(an * 24. + .5) - .5) / 24. * 6.28318 * r, .004) * step(L1 + .5, r);
    e = max(e, (ring + spoke * .7) * .3 * d);
    float glint = .55 + .7 * pow(max(0., .5 + .5 * cos(wa - uGlint)), 10.);
    col = mix(col, uFoil * glint, clamp(e, 0., 1.));
    col *= 1. - smoothstep(10.9, 8.9, length(vW.xz + vec2(.35, -.42))) * .55;   // the stack's shadow
    col *= pool(vW) * smoothstep(34., 16., r);
    gl_FragColor = vec4(col, 1.);
  }`,ft=async r=>{const Y=r.lang==="ar",O=Y?-1:1,G=matchMedia("(prefers-reduced-motion: reduce)").matches;await tt(r.lang);const m=new je;m.background=new U(b.black);const I=ot(r.renderer),n=new Ue(30,r.viewport.aspect,.1,200),ne=new Se("#fff1d6",2.6);ne.position.copy(Z).multiplyScalar(30),m.add(ne);const se=new Se("#ffd9a0",1.1);se.position.set(8,4,-12),m.add(se),m.add(new _e("#ffffff",.1));const le=new Ze("#ffd9a0",14,9,1.6);le.position.set(.4,3.2,2.2),m.add(le);const ue=new U(b.gold),Fe=new U(b.goldHi),ce=new U("#15110e"),Ee=t=>et[_[t]][r.lang],N=document.createElement("canvas");N.width=1152,N.height=64;{const t=N.getContext("2d");t.font='500 34px "Inter Variable", sans-serif',t.textAlign="center",t.textBaseline="middle",t.fillStyle="#fff";for(let o=0;o<12;o++)t.fillText(String((12-o)%12*30),o*96+48,34)}const X=new be(N);X.anisotropy=4;const A=new E(new Ye(90,90),new De({uniforms:{uPaper:{value:ce},uFoil:{value:ue.clone().multiplyScalar(.7)},uDraw:{value:0},uGlint:{value:0},uNums:{value:X}},vertexShader:We,fragmentShader:ut}));A.rotation.x=-Math.PI/2,A.position.y=re,m.add(A);const de=ie(I,{color:"#c08f3e",rough:.3,leaf:2.5,squares:!1}),pe=Array.from({length:15},()=>new Xe),M=D.map((t,o)=>{const i=t.top-re,d=new $e(t.r,t.r,i,r.quality?220:140,1,!1),l=document.createElement("canvas"),s=[t.r-1.06,t.r-.68],a=Math.PI*2*(s[0]+s[1])/2/3;l.height=112,l.width=Math.min(2048,Math.round(l.height*a/(s[1]-s[0])));const u=l.getContext("2d");u.fillStyle="#fff",u.textBaseline="middle",u.textAlign="center",u.direction=Y?"rtl":"ltr",u.font=Y?'400 70px "Amiri", serif':'italic 300 78px "Fraunces Variable", serif',u.fillText(Ee(o),l.width*.5,62);const p=new be(l);p.anisotropy=8;const v=new De({uniforms:{uPaper:{value:ce.clone().multiplyScalar(1.05+o*.1)},uFoil:{value:ue},uFoilHi:{value:Fe},uLightDir:{value:Z},uSph:{value:pe},uR0:{value:D[o+1]?.r??0},uR1:{value:t.r},uOrbit:{value:t.orbit},uDraw:{value:0},uTicks:{value:o===0?240:o===1?180:120},uFocus:{value:0},uGlint:{value:0},uAbove:{value:D[o+1]?.r??0},uAboveH:{value:0},uTop:{value:t.top},uName:{value:p},uBand:{value:new te(s[0],s[1])},uNameAmt:{value:.9}},vertexShader:We,fragmentShader:lt}),z=new E(d,[de,v,v]);z.position.y=re+i/2;const h=new oe;return h.add(z),m.add(h),{T:t,k:o,pivot:h,mesh:z,top:v,nameTex:p,lift:0,gild:0}}),me=Te(.42),$=ie(I,{color:"#e2b057",rough:.34,leaf:7,squares:!1});$.envMapIntensity=1.9;const T=new E(me,$);T.scale.setScalar(.38);const H=new oe;H.add(T),m.add(H);const B=[],J=new Je(1,r.quality?48:32,r.quality?32:20),fe=[];_.forEach((t,o)=>Ke[t].apps.forEach((i,d,l)=>{const s=new oe,a=at({paper:"#15110e",ink:b.cream,warm:b.goldHi,cell:6,amb:.04,gain:1.1});a.fragmentShader=a.fragmentShader.replace("float shade = clamp((1. - (uAmb + (1. - uAmb) * lam)) * uGain, 0., 1.);","float shade = clamp((uAmb + (1. - uAmb) * lam) * uGain, 0., 1.); float rim = pow(1. - abs(dot(n, normalize(cameraPosition - vW))), 3.);").replace("col += uWarm * uEmit;","col = mix(col, uInk, smoothstep(.6, .92, rim) * .8); col += uWarm * uEmit;").replace("void main(){",`uniform float uCut; varying vec3 vO;
      void main(){ if (vO.y > uCut) discard;`),a.vertexShader=a.vertexShader.replace("varying vec3 vN, vW;","varying vec3 vN, vW; varying vec3 vO;").replace("vec4 w = modelMatrix","vO = position; vec4 w = modelMatrix"),a.uniforms.uCut={value:2},fe.push(a);const u=new E(J,a),p=ie(I,{rough:.26,leaf:1}),v={value:-2},z=p.onBeforeCompile;p.onBeforeCompile=(L,e)=>{z.call(p,L,e),L.uniforms.uCutG=v,L.fragmentShader=L.fragmentShader.replace("void main() {",`uniform float uCutG;
void main() {
  if (vLeafP.y + .09 * sin(vLeafP.x * 17.) * sin(vLeafP.z * 13.) <= uCutG) discard;`)},p.customProgramCacheKey=()=>"pear-gold-sphere";const h=new E(J,p);s.add(u,h),m.add(s),B.push({fam:o,i:d,n:l.length,grp:s,dots:u,dm:a,gild:h,gm:p,gu:v,world:new g,px:new te})}));const ve=new it;B.forEach(()=>ve.seg([0,0,0],[0,1,0],{w:.8,c:b.gold}));const w=ve.build();m.add(w);const he=w.geometry.getAttribute("aA"),ge=w.geometry.getAttribute("aB"),we=w.geometry.getAttribute("aC"),Oe=ae.degToRad(40),Ie=-.55;let R=[];const k={portrait:!1,oy:0,ox:0};function xe(){const t=k.portrait=r.viewport.portrait;n.fov=t?44:30,n.updateProjectionMatrix();const o=Math.tan(ae.degToRad(n.fov/2)),i=r.viewport.aspect,d=(a,u)=>a/(u*o*i),l=ae.degToRad(t?38:28),s=d(11.6,t?1.5:.66);k.ox=t?0:-O*.23,k.oy=t?.2:.02,R=[{p:0,el:.34,d:t?12:9.5,ty:1,tz:0},{p:.35,el:l,d:s,ty:.2,tz:0},{p:.82,el:l+.03,d:s*.97,ty:.2,tz:0},{p:1,el:l-.1,d:s*.55,ty:.1,tz:7.2}],rt(fe,r.viewport.dpr),Re(w,n,r.viewport)}xe();const Ne=t=>{let o=0;for(;o<R.length-2&&t>R[o+1].p;)o++;const i=R[o],d=R[o+1],l=Ge.inOut(P(i.p,d.p,t)),s=a=>i[a]+(d[a]-i[a])*l;return{el:s("el"),d:Math.exp(Math.log(i.d)+(Math.log(d.d)-Math.log(i.d))*l),ty:s("ty"),tz:s("tz")}},ye=new Qe,Me=new te,He=M.map(t=>t.mesh),ke=(t,o)=>{Me.set(t,o),ye.setFromCamera(Me,n);const i=ye.intersectObjects(He,!1)[0];return i?M.findIndex(d=>d.mesh===i.object):-1};let W=-1,ze=-1;addEventListener("world:index-hover",t=>{const o=t.detail;ze=o?_.indexOf(o):-1});let x=0,V=0,K=0;const q=new g,Le=new g,Pe=new g,Q=new g,Be=new g(0,1,0),Ae=new g,j=()=>r.viewport.width,C=()=>r.viewport.height,Ve=(t,o)=>(Q.copy(t).project(n),o.set((Q.x+1)/2*j(),(1-Q.y)/2*C()));return{scene:m,camera:n,resize:xe,focus(t){t||(W=-1)},update({p:t,t:o,dt:i}){x=S(x,t,7,i);const d=k.portrait,l=P(-.05,.3,x),s=P(.82,1,x);V=S(V,r.pointer.inside&&!d?r.pointer.x:0,2.5,i),K=S(K,r.pointer.inside&&!d?r.pointer.y:0,2.5,i);const a=Ne(x),u=O*(Ie+Oe*x+(G?0:Math.sin(o*.07)*.02));q.set(Math.sin(u)*a.tz,a.ty,Math.cos(u)*a.tz),n.up.copy(Be),n.position.set(Math.sin(u)*Math.cos(a.el),Math.sin(a.el),Math.cos(u)*Math.cos(a.el)).multiplyScalar(a.d).add(q),n.lookAt(q),Le.setFromMatrixColumn(n.matrix,0),Pe.setFromMatrixColumn(n.matrix,1),n.position.addScaledVector(Le,V*a.d*.024).addScaledVector(Pe,K*a.d*.016),n.lookAt(q),n.rotateZ(-V*.014);const p=1-Ge.inOut(s);n.setViewOffset(j(),C(),k.ox*j()*p,k.oy*C()*p,j(),C()),n.updateMatrixWorld();const v=Math.atan2(n.position.z+Z.z*30,n.position.x+Z.x*30);Ae.copy(st).applyQuaternion(n.quaternion);const z=W>=0?W:ze;M.forEach(e=>{const y=z===e.k?1:0,c=Math.max(y,e.k===0?s:0);e.lift=S(e.lift,y*.3,4,i),e.gild=S(e.gild,c,4,i);const F=(e.k-1.5)*Math.PI/2+Math.PI/4+x*1.2*(e.k%2?-1:1);e.pivot.rotation.y=u-Math.PI/2+O*F+(G?0:Math.sin(o*.11+e.k)*.025),e.pivot.position.y=e.lift;const f=e.top.uniforms;f.uDraw.value=P((3-e.k)*.17,.5+(3-e.k)*.17,l),f.uFocus.value=S(f.uFocus.value,c,3,i),f.uGlint.value=v,f.uAboveH.value=D[e.k+1]?D[e.k+1].top-e.T.top+M[e.k+1].lift-e.lift:0,f.uTop.value=e.T.top+e.lift});const h=A.material.uniforms;h.uDraw.value=P(.62,1,l),h.uGlint.value=v,H.rotation.y=u+(G?0:Math.sin(o*.22)*.42);const L=.36+.12*(1-P(0,.3,x));T.scale.setScalar(L),H.position.y=D[3].top+M[3].lift+.08+L+(G?0:Math.sin(o*.6)*.025),B.forEach((e,y)=>{const c=M[e.fam],F=c.pivot.rotation.y+O*(e.i-(e.n-1)/2)*c.T.gap,f=P(.45+(3-e.fam)*.1,.62+(3-e.fam)*.1,l),ee=.42*(1+c.gild*.1),qe=G?0:Math.sin(o*.8+y*1.7)*.05;e.grp.position.set(Math.cos(F)*c.T.orbit,c.T.top+c.lift+nt*.8+qe,-Math.sin(F)*c.T.orbit),e.grp.scale.setScalar(ee),e.grp.rotation.y=F*.5+o*.1,e.world.copy(e.grp.position),pe[y].set(e.world.x,e.world.y,e.world.z,ee*(e.grp.visible?1:0)),e.gu.value=1.15-c.gild*2.3,e.dm.uniforms.uCut.value=e.gu.value,e.dm.uniforms.uGain.value=1.1*f,e.dm.uniforms.uLight.value.copy(Ae),e.dots.visible=c.gild<.999,e.gild.visible=c.gild>.001,e.grp.visible=f>.001,Ve(e.world,e.px),e.dm.uniforms.uShift.value.set(-e.px.x,e.px.y-C()),he.setXYZ(y,e.world.x,c.T.top+c.lift+.005,e.world.z),ge.setXYZ(y,e.world.x,e.world.y-ee,e.world.z),we.setW(y,.55*f)}),he.needsUpdate=!0,ge.needsUpdate=!0,we.needsUpdate=!0,Re(w,n,r.viewport)},hover(t,o){return W=k.portrait||!r.pointer.inside?-1:ke(t,o),W>=0},pick(t,o){const i=ke(t,o);return i>=0&&r.emit("jump",{id:_[i]}),null},dispose(){A.geometry.dispose(),A.material.dispose(),X.dispose(),J.dispose(),me.dispose(),$.dispose(),w.geometry.dispose(),w.material.dispose(),M.forEach(t=>{t.mesh.geometry.dispose(),t.nameTex.dispose(),t.top.dispose()}),B.forEach(t=>{t.dm.dispose(),t.gm.dispose()}),de.dispose(),I.dispose()}}};export{ft as default};
