import{e as M,r as m}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{c as Ve,v as De,Q as ye,b as we,d as Ue,p as Ce,e as Me}from"./veil.BPBXkkAK.js";import{p as We}from"./planet.CI0CEvU1.js";import{s as Fe}from"./streaks.CdPwFN3t.js";import{l as Le}from"./flare.8amwt7rx.js";import{g as _e}from"./dock.B1CndkR6.js";import{S as Be,P as Ie,V as n,c as Oe,B as xe,d as P,s as Se,A as V,M as ae,$ as Ye,T as je,k as be,aq as qe,ap as Qe,i as ke}from"./three.module.pheUvn1h.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";import"./index.CNYhKAAp.js";import"./screen.BZncAErq.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Te={seed:[2.6,1.1,.7],sea:-1,ocean:"#5e220a",low:"#2a0e04",high:"#d9843e",cloud:0,city:0,ice:0,bands:1,craters:0,lava:.32,atmo:"#ff9a52",air:.35,bandFreq:4.5,storm:2.4},i=ke.degToRad,v=[0,.2,.5,.8,1];function b(r,t){let a=0;for(;a<v.length-2&&r>v[a+1];)a++;const x=v[a],D=v[a+1],g=Math.min(1,Math.max(0,(r-x)/(D-x))),S=D-x,A=u=>u<=0?(t[1]-t[0])/(v[1]-v[0]):u>=v.length-1?(t[u]-t[u-1])/(v[u]-v[u-1]):(t[u+1]-t[u-1])/(v[u+1]-v[u-1]),c=g*g,d=c*g;return(2*d-3*c+1)*t[a]+(d-2*c+g)*S*A(a)*.5+(-2*d+3*c)*t[a+1]+(d-c)*S*A(a+1)*.5}const h=60,Ze=`
  uniform float uT, uK; varying vec2 vUv;
  float h(float x){ return fract(sin(x * 127.1) * 43758.5453); }
  float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h(i), h(i + 1.), f); }
  void main(){
    float x = vUv.x * 40. + uT * .25;
    float patchK = smoothstep(.3, .65, n1(vUv.x * 7. + uT * .03));
    float fold = n1(x * 1.3) * .6 + n1(x * 3.7 - uT * .4) * .4;
    float rays = .55 + .45 * n1(vUv.x * 700. + uT * 1.5);
    float y = clamp(vUv.y, 0., 1.);
    float a = smoothstep(0., .18, y) * pow(1. - y, 1.6) * (.3 + 1.1 * fold) * rays * rays * patchK;
    vec3 col = mix(vec3(.79, .36, .34), vec3(.95, .62, .52), smoothstep(.0, .3, y) * (1. - y));
    gl_FragColor = vec4(col * a * uK * 1.6, 1.);
  }`,Ee=`
  uniform float uK, uT; varying float vD; varying vec2 vG;
  void main(){
    vec2 g = abs(fract(vG) - .5) / max(fwidth(vG), vec2(1e-3));
    float l = 1. - min(min(g.x, g.y), 1.);
    float fade = smoothstep(1., .25, vD) * smoothstep(.0, .12, vD);
    float run = .6 + .4 * sin(vG.x * .7 - uT * 2.);
    gl_FragColor = vec4(max(vec3(.86, .84, .8) * l * fade * uK * run * .7, 0.), 1.);
  }`,$e=`
  uniform float uY, uK, uS; varying vec2 vNdc;
  void main(){
    float d = (vNdc.y - uY) * uS;
    vec3 up = vec3(.62, .32, .14) * (exp(-max(d, 0.) * 1.6) * .11 + .01);
    vec3 dn = vec3(.5, .22, .09) * (.012 + .095 * exp(min(d, 0.) * 2.5));
    vec3 col = mix(dn, up, smoothstep(-.12, .12, d));
    gl_FragColor = vec4(col * uK, 1.);
  }`,ca=r=>{const t=new Be,a=new Ie(36,r.viewport.aspect,.1,3e3),x=Ve(r);t.add(x.mesh),x.uniforms.uLevel.value=1.05;const D=new n(.2,.05,-1).normalize(),g=De(r,{bandPole:new n(.4,1,.2),star:D,band:.2,bandWidth:.2});t.add(g.mesh);const S=We(r,Te,{radius:h,thick:.012,air:{int:9,mie:.7,ext:4}});t.add(S.group);const A=S.uniforms,c=new Oe(900,900,160,160),d=c.getAttribute("position"),u=new Float32Array(d.count),j=new Float32Array(d.count*2);for(let e=0;e<d.count;e++){const s=d.getX(e),_=d.getY(e),o=Math.hypot(s,_);d.setZ(e,-1800/Math.max(o,h*1.05)+4),u[e]=o/450,j[e*2]=s/9,j[e*2+1]=_/9}c.setAttribute("aD",new xe(u,1)),c.setAttribute("aG",new xe(j,2));const U=new P({vertexShader:"attribute float aD; attribute vec2 aG; varying float vD; varying vec2 vG; void main(){ vD = aD; vG = aG; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ee,transparent:!0,depthWrite:!1,blending:V,side:Se,uniforms:{uK:{value:0},uT:{value:0}}}),te=new ae(c,U);te.rotation.x=-Math.PI/2+.12,t.add(te);const oe=new Ye(h,h*1.3,512,1),C=new P({vertexShader:"uniform float uR; varying vec2 vUv; void main(){ vUv = vec2(atan(position.y, position.x) / 6.2832 + .5, (length(position.xy) / uR - 1.) / .3); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ze,transparent:!0,depthWrite:!1,blending:V,side:Se,uniforms:{uT:{value:0},uK:{value:0},uR:{value:h}}}),G=new ae(oe,C);G.frustumCulled=!1,t.add(G);const se=new je(h*1.003,384,192),q=new P({transparent:!0,depthWrite:!1,blending:V,toneMapped:!1,uniforms:{uK:{value:0},uT:{value:0},uC:{value:new n},uLimb:{value:.8},uA:{value:new n},uB:{value:new n},uMid:{value:0},uSpan:{value:.5},uX:{value:new be(.63,.13)}},vertexShader:"varying vec3 vN; void main(){ vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uK, uT, uLimb, uMid, uSpan; uniform vec3 uC, uA, uB; uniform vec2 uX; varying vec3 vN;
      float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float a = 0., w = .5; for (int i = 0; i < 5; i++){ a += w * n2(p); p = p * 2.03 + vec2(1.7, 9.2); w *= .5; } return a; }
      void main(){
        float c = dot(normalize(vN), uC);
        float across = (c - uLimb) / (1. - uLimb);
        float along = atan(dot(vN, uB), dot(vN, uA)) - uMid;
        float band = smoothstep(uX.x - uX.y, uX.x - uX.y * .25, across) * smoothstep(uX.x + uX.y, uX.x + uX.y * .25, across) * smoothstep(uSpan, uSpan * .55, abs(along));

        vec2 q = vec2(along * 7. + uT * .04, across * 60.);
        float cl = fbm(q) * .6 + fbm(q * vec2(3.3, 1.6) - vec2(uT * .09, 0.)) * .4;
        cl = smoothstep(.4, .75, cl) * (.55 + .45 * smoothstep(.3, .7, fbm(vec2(along * 2.2, 3.1))));

        float lit = 0.;
        for (int i = 0; i < 4; i++){
          float fi = float(i), ph = fract(uT * (.37 + fi * .05) + fi * .29);
          float strike = exp(-ph * 9.) + .6 * exp(-abs(ph - .09) * 40.) + .3;
          float u = -uSpan * .7 + fract(fi * .31 + floor(uT * (.37 + fi * .05) + fi * .29) * .618) * uSpan * 1.4;
          vec2 dd = vec2((along - u) / (.26 * uSpan), (across - uX.x) / (uX.y * .55));
          lit += strike * exp(-dot(dd, dd));
        }
        float base = .34 + .12 * n2(vec2(along * 3. + uT * .1, 0.));
        float a = band * cl * (base + 1.3 * lit) * uK;
        vec3 col = mix(vec3(.62, .26, .09), vec3(1., .8, .56), clamp(lit, 0., 1.));
        gl_FragColor = vec4(col * a, 1.);
      }`}),ne=new ae(se,q);t.add(ne);const R=new qe(new Qe({map:_e(),color:"#ffd9a8",transparent:!0,depthWrite:!1,blending:V,opacity:0}));t.add(R);const X=new P({vertexShader:ye,fragmentShader:$e,transparent:!0,depthTest:!1,depthWrite:!1,blending:V,uniforms:{uY:{value:0},uK:{value:0},uS:{value:1}}}),ie=we(X,1800);t.add(ie);const W=new P({vertexShader:ye,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uK:{value:0},uR:{value:new be(-.4,-.76)}},fragmentShader:"uniform float uK; uniform vec2 uR; varying vec2 vNdc; void main(){ gl_FragColor = vec4(.012, .008, .006, smoothstep(uR.x, uR.y, vNdc.y) * uK); }"}),re=we(W,1700);t.add(re);const Q=Ue(r);Q.attach(a,t);const k=Fe(r);t.add(k.mesh);const Z=Le("#ffd8aa");t.add(Z.mesh);let F=!1;const ue=()=>{F=r.viewport.portrait,a.fov=F?52:36,a.aspect=r.viewport.aspect,a.updateProjectionMatrix()};ue();const le=new n,z=new n,ce=new n,E=new n,Ke=new n(0,1,0),T=new n,K=new n,$=new n,Ae=new n,L=new n,H=new n,de=new n,f=new n;return{scene:t,camera:a,resize:ue,update({p:e,t:s,dt:_}){const o=F?1:0,ve=b(e,[1.32,1.1,2.05,1.2,1.45])*h,B=i(b(e,[-80,-48,8,66,96]))+Math.sin(s*.3)*i(.4),J=i(b(e,[4,2,21,3,4]));f.set(Math.cos(J)*Math.sin(B),Math.sin(J),Math.cos(J)*Math.cos(B)).multiplyScalar(ve),a.position.copy(f);const y=Math.asin(Math.min(.999,h/ve));T.copy(f).multiplyScalar(-1).normalize(),K.set(Math.cos(B),0,-Math.sin(B)),K.addScaledVector(T,-K.dot(T)).normalize(),$.crossVectors(K,T).normalize();const N=(l,Y,Pe)=>Pe.copy(T).multiplyScalar(Math.cos(l)).addScaledVector(K,Math.sin(l)).multiplyScalar(Math.cos(Y)).addScaledVector($,Math.sin(Y)).normalize(),fe=Ce(r,s,_),pe=i(b(e,[5,o?3.5:2,o?3:6,o?4:3,7]))+i(.8)*Math.sin(s*.4)+fe.y*i(1),I=i(b(e,[0,0,o?4:10,o?2:-2,0]))+fe.x*i(1.5);N(y+pe,I,E),le.copy(f).add(E);const me=b(e,[.2,0,1,0,0]);ce.copy(T).multiplyScalar(-(1-me)).addScaledVector(Ke,me).normalize(),a.up.copy(ce),a.lookAt(le);const Ge=i(b(e,[0,0,o?32:25,o?-34:-28,-24]))+Math.sin(s*.5)*i(.6);a.rotateZ(-Ge),a.updateMatrixWorld();const w=[[-12,0,0],[-9,4,.2],[100,28,.5],[-14,-40,.64],[o?1.2:1.6,o?-5:-11,.8],[6,-12,1]];let p=0;for(;p<w.length-2&&e>w[p+1][2];)p++;const Re=M.inOut(m(w[p][2],w[p+1][2],e));N(y+i(w[p][0]),i(w[p][1]),H),N(y+i(w[p+1][0]),i(w[p+1][1]),de);const O=Ae.copy(H).lerp(de,Re).normalize();S.update(O,s,.2+s*.015+e*.6),A.uLight.value=1.05;const Xe=f.clone().multiplyScalar(-1),ze=O.angleTo(Xe.normalize()),he=M.out(m(y-i(.2),y+i(2),ze));Me(a,O,z);const Ne=1+2*Math.exp(-Math.pow((e-.8)/.07,2));Z.set(z,z.z>0?he:0,r.viewport.aspect,Ne),U.uniforms.uK.value=M.inOut(m(.3,.42,e))*(1-M.inOut(m(.62,.74,e)))*1.1,U.uniforms.uT.value=s,C.uniforms.uK.value=M.inOut(m(.3,.44,e))*(1-M.inOut(m(.6,.72,e)))*1.3,C.uniforms.uT.value=s,G.position.set(0,0,0),G.lookAt(f),G.scale.setScalar(1/Math.cos(y));{const l=q.uniforms,Y=H.copy(f).normalize();l.uC.value.copy(Y),l.uLimb.value=h/f.length(),l.uA.value.copy(K),l.uB.value.copy($),l.uMid.value=I,l.uSpan.value=o?.3:.75,l.uX.value.set(o?.6:.63,o?.2:.13),l.uK.value=Math.exp(-Math.pow((e-.2)/.1,2))*(o?2:1.4),l.uT.value=s,ne.visible=l.uK.value>.003}const ee=Math.exp(-Math.pow((e-.2)/.13,2));N(y,I,L),Me(a,L,z),X.uniforms.uY.value=z.y,X.uniforms.uS.value=F?1.6:1,X.uniforms.uK.value=ee*(.9+.1*Math.sin(s*1.7)),A.uLava.value=Te.lava*(1+1.4*ee),W.uniforms.uK.value=ee*.96,W.uniforms.uR.value.set(o?-.72:-.4,o?-.9:-.76),a.getWorldDirection(E);const ge=.5+2.6*M.in(m(.55,1,e))+1.2*Math.sin(Math.PI*e);k.set(a,e*700+s*30*ge,1.5+ge*3,.3+.65*m(.5,.9,e)),N(y+pe+i(o?9:6),I+i(o?4:10),L),R.position.copy(f).addScaledVector(L,400),R.material.opacity=M.out(m(.62,.74,e))*(.85+.15*Math.sin(s*3)),R.scale.setScalar(30+4*Math.sin(s*2)),Q.update(s,{star:O,starVis:he,frost:.35+.65*Math.sin(Math.PI*e),bendX:Math.sin(Math.PI*e)*.8,bendY:-.4+e*.8,haze:.45}),g.set(s,1)},dispose(){x.dispose(),g.dispose(),S.dispose(),c.dispose(),U.dispose(),oe.dispose(),C.dispose(),Q.dispose(),k.dispose(),Z.dispose(),X.dispose(),ie.geometry.dispose(),W.dispose(),re.geometry.dispose(),se.dispose(),q.dispose(),R.material.dispose()}}};export{ca as default};
