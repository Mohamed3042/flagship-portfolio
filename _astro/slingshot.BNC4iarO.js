import{S as De,P as Ue,k as n,a as Ve,_ as we,b as P,$ as ye,A as D,M as ae,ax as ke,ar as Ce,B as Me,b0 as Le,a$ as We,p as M,r as m,s as _e}from"./EditionWorld.astro_astro_type_script_index_0_lang.C4nb-NPV.js";import{c as Fe,v as Be,Q as be,b as xe,d as Ie,p as Oe,e as Se}from"./veil.BhADdog2.js";import{p as Ye}from"./planet.Bb2mLwZi.js";import{s as je}from"./streaks.Bdj1JSBn.js";import{l as qe}from"./flare.Bzf44Asl.js";import{g as Qe}from"./dock.Btqs2mFp.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";import"./index.D-RV0eV7.js";import"./screen.Cp6_NyDj.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Te={seed:[2.6,1.1,.7],sea:-1,ocean:"#5e220a",low:"#2a0e04",high:"#d9843e",cloud:0,city:0,ice:0,bands:1,craters:0,lava:.32,atmo:"#ff9a52",air:.35,bandFreq:4.5,storm:2.4},i=_e.degToRad,v=[0,.2,.5,.8,1];function S(r,t){let a=0;for(;a<v.length-2&&r>v[a+1];)a++;const b=v[a],U=v[a+1],g=Math.min(1,Math.max(0,(r-b)/(U-b))),x=U-b,A=l=>l<=0?(t[1]-t[0])/(v[1]-v[0]):l>=v.length-1?(t[l]-t[l-1])/(v[l]-v[l-1]):(t[l+1]-t[l-1])/(v[l+1]-v[l-1]),c=g*g,d=c*g;return(2*d-3*c+1)*t[a]+(d-2*c+g)*x*A(a)*.5+(-2*d+3*c)*t[a+1]+(d-c)*x*A(a+1)*.5}const h=60,Ze=`
  uniform float uT, uK; varying vec2 vUv;
  float h(float x){ return fract(sin(x * 127.1) * 43758.5453); }
  float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h(i), h(i + 1.), f); }
  void main(){
    float x = vUv.x * 40. + uT * .25;
    float patchK = smoothstep(.3, .65, n1(vUv.x * 7. + uT * .03));
    float fold = n1(x * 1.3) * .6 + n1(x * 3.7 - uT * .4) * .4;
    float rays = .55 + .45 * n1(vUv.x * 700. + uT * 1.5);
    float y = clamp(vUv.y, 0., 1.);   // (above 1, pow(1. - y) is NaN: a black dotted line on the curtain's top edge)
    float a = smoothstep(0., .18, y) * pow(1. - y, 1.6) * (.3 + 1.1 * fold) * rays * rays * patchK;
    vec3 col = mix(vec3(.79, .36, .34), vec3(.95, .62, .52), smoothstep(.0, .3, y) * (1. - y));
    gl_FragColor = vec4(col * a * uK * 1.6, 1.);
  }`,$e=`
  uniform float uK, uT; varying float vD; varying vec2 vG;
  void main(){
    vec2 g = abs(fract(vG) - .5) / max(fwidth(vG), vec2(1e-3));
    float l = 1. - min(min(g.x, g.y), 1.);
    float fade = smoothstep(1., .25, vD) * smoothstep(.0, .12, vD);
    float run = .6 + .4 * sin(vG.x * .7 - uT * 2.);
    gl_FragColor = vec4(max(vec3(.86, .84, .8) * l * fade * uK * run * .7, 0.), 1.);
  }`,Ee=`
  uniform float uY, uK, uS; varying vec2 vNdc;
  void main(){
    float d = (vNdc.y - uY) * uS;   // (phones: a taller sky, a steeper falloff, so it spans the darks instead of one flat tone)
    vec3 up = vec3(.62, .32, .14) * (exp(-max(d, 0.) * 1.6) * .11 + .01);
    vec3 dn = vec3(.5, .22, .09) * (.012 + .095 * exp(min(d, 0.) * 2.5));
    vec3 col = mix(dn, up, smoothstep(-.12, .12, d));   // (soft: the limb curves away from a straight line at the sides)
    gl_FragColor = vec4(col * uK, 1.);
  }`,ua=r=>{const t=new De,a=new Ue(36,r.viewport.aspect,.1,3e3),b=Fe(r);t.add(b.mesh),b.uniforms.uLevel.value=1.05;const U=new n(.2,.05,-1).normalize(),g=Be(r,{bandPole:new n(.4,1,.2),star:U,band:.2,bandWidth:.2});t.add(g.mesh);const x=Ye(r,Te,{radius:h,thick:.012,air:{int:9,mie:.7,ext:4}});t.add(x.group);const A=x.uniforms,c=new Ve(900,900,160,160),d=c.getAttribute("position"),l=new Float32Array(d.count),Y=new Float32Array(d.count*2);for(let e=0;e<d.count;e++){const s=d.getX(e),_=d.getY(e),o=Math.hypot(s,_);d.setZ(e,-1800/Math.max(o,h*1.05)+4),l[e]=o/450,Y[e*2]=s/9,Y[e*2+1]=_/9}c.setAttribute("aD",new we(l,1)),c.setAttribute("aG",new we(Y,2));const V=new P({vertexShader:"attribute float aD; attribute vec2 aG; varying float vD; varying vec2 vG; void main(){ vD = aD; vG = aG; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:$e,transparent:!0,depthWrite:!1,blending:D,side:ye,uniforms:{uK:{value:0},uT:{value:0}}}),te=new ae(c,V);te.rotation.x=-Math.PI/2+.12,t.add(te);const oe=new ke(h,h*1.3,512,1),k=new P({vertexShader:"uniform float uR; varying vec2 vUv; void main(){ vUv = vec2(atan(position.y, position.x) / 6.2832 + .5, (length(position.xy) / uR - 1.) / .3); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ze,transparent:!0,depthWrite:!1,blending:D,side:ye,uniforms:{uT:{value:0},uK:{value:0},uR:{value:h}}}),G=new ae(oe,k);G.frustumCulled=!1,t.add(G);const se=new Ce(h*1.003,384,192),j=new P({transparent:!0,depthWrite:!1,blending:D,toneMapped:!1,uniforms:{uK:{value:0},uT:{value:0},uC:{value:new n},uLimb:{value:.8},uA:{value:new n},uB:{value:new n},uMid:{value:0},uSpan:{value:.5},uX:{value:new Me(.63,.13)}},vertexShader:"varying vec3 vN; void main(){ vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uK, uT, uLimb, uMid, uSpan; uniform vec3 uC, uA, uB; uniform vec2 uX; varying vec3 vN;
      float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float a = 0., w = .5; for (int i = 0; i < 5; i++){ a += w * n2(p); p = p * 2.03 + vec2(1.7, 9.2); w *= .5; } return a; }
      void main(){
        float c = dot(normalize(vN), uC);                    // 1 straight below the ship, uLimb on the limb
        float across = (c - uLimb) / (1. - uLimb);           // 0 on the limb, rising toward the ship
        float along = atan(dot(vN, uB), dot(vN, uA)) - uMid; // round the limb
        float band = smoothstep(uX.x - uX.y, uX.x - uX.y * .25, across) * smoothstep(uX.x + uX.y, uX.x + uX.y * .25, across) * smoothstep(uSpan, uSpan * .55, abs(along));   // (a few degrees under the horizon)
        // cloud: streaks drawn out along the band, billows across it, a slow drift
        vec2 q = vec2(along * 7. + uT * .04, across * 60.);
        float cl = fbm(q) * .6 + fbm(q * vec2(3.3, 1.6) - vec2(uT * .09, 0.)) * .4;
        cl = smoothstep(.4, .75, cl) * (.55 + .45 * smoothstep(.3, .7, fbm(vec2(along * 2.2, 3.1))));
        // lightning: four cells running along the band, each a quick double strike and a slow fade
        float lit = 0.;
        for (int i = 0; i < 4; i++){
          float fi = float(i), ph = fract(uT * (.37 + fi * .05) + fi * .29);
          float strike = exp(-ph * 9.) + .6 * exp(-abs(ph - .09) * 40.) + .3;   // (the struck cloud keeps a glow between strikes)
          float u = -uSpan * .7 + fract(fi * .31 + floor(uT * (.37 + fi * .05) + fi * .29) * .618) * uSpan * 1.4;
          vec2 dd = vec2((along - u) / (.26 * uSpan), (across - uX.x) / (uX.y * .55));
          lit += strike * exp(-dot(dd, dd));
        }
        float base = .34 + .12 * n2(vec2(along * 3. + uT * .1, 0.));   // the storm-lit glow that stays between strikes
        float a = band * cl * (base + 1.3 * lit) * uK;
        vec3 col = mix(vec3(.62, .26, .09), vec3(1., .8, .56), clamp(lit, 0., 1.));
        gl_FragColor = vec4(col * a, 1.);
      }`}),ne=new ae(se,j);t.add(ne);const N=new Le(new We({map:Qe(),color:"#ffd9a8",transparent:!0,depthWrite:!1,blending:D,opacity:0}));t.add(N);const R=new P({vertexShader:be,fragmentShader:Ee,transparent:!0,depthTest:!1,depthWrite:!1,blending:D,uniforms:{uY:{value:0},uK:{value:0},uS:{value:1}}}),ie=xe(R,1800);t.add(ie);const C=new P({vertexShader:be,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uK:{value:0},uR:{value:new Me(-.4,-.76)}},fragmentShader:"uniform float uK; uniform vec2 uR; varying vec2 vNdc; void main(){ gl_FragColor = vec4(.012, .008, .006, smoothstep(uR.x, uR.y, vNdc.y) * uK); }"}),re=xe(C,1700);t.add(re);const q=Ie(r);q.attach(a,t);const Q=je(r);t.add(Q.mesh);const Z=qe("#ffd8aa");t.add(Z.mesh);let L=!1;const le=()=>{L=r.viewport.portrait,a.fov=L?52:36,a.aspect=r.viewport.aspect,a.updateProjectionMatrix()};le();const ue=new n,z=new n,ce=new n,$=new n,Ke=new n(0,1,0),T=new n,K=new n,E=new n,Ae=new n,W=new n,H=new n,de=new n,f=new n;return{scene:t,camera:a,resize:le,update({p:e,t:s,dt:_}){const o=L?1:0,ve=S(e,[1.32,1.1,2.05,1.2,1.45])*h,F=i(S(e,[-80,-48,8,66,96]))+Math.sin(s*.3)*i(.4),J=i(S(e,[4,2,21,3,4]));f.set(Math.cos(J)*Math.sin(F),Math.sin(J),Math.cos(J)*Math.cos(F)).multiplyScalar(ve),a.position.copy(f);const w=Math.asin(Math.min(.999,h/ve));T.copy(f).multiplyScalar(-1).normalize(),K.set(Math.cos(F),0,-Math.sin(F)),K.addScaledVector(T,-K.dot(T)).normalize(),E.crossVectors(K,T).normalize();const X=(u,O,Pe)=>Pe.copy(T).multiplyScalar(Math.cos(u)).addScaledVector(K,Math.sin(u)).multiplyScalar(Math.cos(O)).addScaledVector(E,Math.sin(O)).normalize(),fe=Oe(r,s,_),pe=i(S(e,[5,o?3.5:2,o?3:6,o?4:3,7]))+i(.8)*Math.sin(s*.4)+fe.y*i(1),B=i(S(e,[0,0,o?4:10,o?2:-2,0]))+fe.x*i(1.5);X(w+pe,B,$),ue.copy(f).add($);const me=S(e,[.2,0,1,0,0]);ce.copy(T).multiplyScalar(-(1-me)).addScaledVector(Ke,me).normalize(),a.up.copy(ce),a.lookAt(ue);const Ge=i(S(e,[0,0,o?32:25,o?-34:-28,-24]))+Math.sin(s*.5)*i(.6);a.rotateZ(-Ge),a.updateMatrixWorld();const y=[[-12,0,0],[-9,4,.2],[100,28,.5],[-14,-40,.64],[o?1.2:1.6,o?-5:-11,.8],[6,-12,1]];let p=0;for(;p<y.length-2&&e>y[p+1][2];)p++;const Ne=M.inOut(m(y[p][2],y[p+1][2],e));X(w+i(y[p][0]),i(y[p][1]),H),X(w+i(y[p+1][0]),i(y[p+1][1]),de);const I=Ae.copy(H).lerp(de,Ne).normalize();x.update(I,s,.2+s*.015+e*.6),A.uLight.value=1.05;const Re=f.clone().multiplyScalar(-1),ze=I.angleTo(Re.normalize()),he=M.out(m(w-i(.2),w+i(2),ze));Se(a,I,z);const Xe=1+2*Math.exp(-Math.pow((e-.8)/.07,2));Z.set(z,z.z>0?he:0,r.viewport.aspect,Xe),V.uniforms.uK.value=M.inOut(m(.3,.42,e))*(1-M.inOut(m(.62,.74,e)))*1.1,V.uniforms.uT.value=s,k.uniforms.uK.value=M.inOut(m(.3,.44,e))*(1-M.inOut(m(.6,.72,e)))*1.3,k.uniforms.uT.value=s,G.position.set(0,0,0),G.lookAt(f),G.scale.setScalar(1/Math.cos(w));{const u=j.uniforms,O=H.copy(f).normalize();u.uC.value.copy(O),u.uLimb.value=h/f.length(),u.uA.value.copy(K),u.uB.value.copy(E),u.uMid.value=B,u.uSpan.value=o?.3:.75,u.uX.value.set(o?.6:.63,o?.2:.13),u.uK.value=Math.exp(-Math.pow((e-.2)/.1,2))*(o?2:1.4),u.uT.value=s,ne.visible=u.uK.value>.003}const ee=Math.exp(-Math.pow((e-.2)/.13,2));X(w,B,W),Se(a,W,z),R.uniforms.uY.value=z.y,R.uniforms.uS.value=L?1.6:1,R.uniforms.uK.value=ee*(.9+.1*Math.sin(s*1.7)),A.uLava.value=Te.lava*(1+1.4*ee),C.uniforms.uK.value=ee*.96,C.uniforms.uR.value.set(o?-.72:-.4,o?-.9:-.76),a.getWorldDirection($);const ge=.5+2.6*M.in(m(.55,1,e))+1.2*Math.sin(Math.PI*e);Q.set(a,e*700+s*30*ge,1.5+ge*3,.3+.65*m(.5,.9,e)),X(w+pe+i(o?9:6),B+i(o?4:10),W),N.position.copy(f).addScaledVector(W,400),N.material.opacity=M.out(m(.62,.74,e))*(.85+.15*Math.sin(s*3)),N.scale.setScalar(30+4*Math.sin(s*2)),q.update(s,{star:I,starVis:he,frost:.35+.65*Math.sin(Math.PI*e),bendX:Math.sin(Math.PI*e)*.8,bendY:-.4+e*.8,haze:.45}),g.set(s,1)},dispose(){b.dispose(),g.dispose(),x.dispose(),c.dispose(),V.dispose(),oe.dispose(),k.dispose(),q.dispose(),Q.dispose(),Z.dispose(),R.dispose(),ie.geometry.dispose(),C.dispose(),re.geometry.dispose(),se.dispose(),j.dispose(),N.material.dispose()}}};export{ua as default};
