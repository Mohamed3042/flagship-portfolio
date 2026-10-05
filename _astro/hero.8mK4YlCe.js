import{W as Ye,H as De,S as Ve,V as me,C as Z,a as Qe,M as J,P as we,b as Xe,c as We,D as Pe,d as $e,R as Ne,L as Ze,e as Je,f as ea,g as aa,h as ta,l as ia,i as Ge,j as sa,m as oa,G as ra,k as na,n as la,E as ua,o as pa,p as ge,q as ca,r as fa,Q as $,s as da,t as c,u as C,v as ze}from"./WorldChrome.astro_astro_type_script_index_0_lang.DA_sMiZ8.js";import"./preload-helper.DArFJGja.js";const M=[-3.1,-2.15,3.1,2.15];function ha(a=448){const h=Math.round(a*(M[3]-M[1])/(M[2]-M[0])),L=Xe.map(t=>t.map(([u,d])=>[u-We.width/2,d-We.height/2])),r=new Float32Array(a*h);for(let t=0;t<h;t++)for(let u=0;u<a;u++){const d=M[0]+(u+.5)/a*(M[2]-M[0]),w=M[1]+(t+.5)/h*(M[3]-M[1]);let x=1/0,R=!1;for(const B of L){let S=!1;for(let p=0,G=B.length-1;p<B.length;G=p++){const[f,b]=B[G],[z,k]=B[p],W=z-f,T=k-b,F=Math.max(0,Math.min(1,((d-f)*W+(w-b)*T)/(W*W+T*T)));x=Math.min(x,(d-f-W*F)**2+(w-b-T*F)**2),b>w!=k>w&&d<f+(w-b)/(k-b)*W&&(S=!S)}R||=S}r[t*a+u]=(R?-1:1)*Math.sqrt(x)}const v=r.slice(),q=new Float32Array(a*h),l=10,e=2*l+1,i=(t,u,d,w,x)=>{for(let R=0;R<w;R++){const B=p=>t[x(R,Math.min(d-1,Math.max(0,p)))];let S=0;for(let p=-l;p<=l;p++)S+=B(p);for(let p=0;p<d;p++)u[x(R,p)]=S/e,S+=B(p+l+1)-B(p-l)}};for(let t=0;t<3;t++)i(v,q,a,h,(u,d)=>u*a+d),i(q,v,h,a,(u,d)=>d*a+u);const g=new Uint16Array(a*h*2);for(let t=0;t<a*h;t++)g[t*2]=Pe.toHalfFloat(r[t]),g[t*2+1]=Pe.toHalfFloat(v[t]);const m=new $e(g,a,h,Ne,De);return m.minFilter=m.magFilter=Ze,m.needsUpdate=!0,m}const va=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp, uRipple, uBeat;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
  float mk(vec2 p){ vec2 q = clamp(p, uBox.xy, uBox.zw), f = texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).rg; return mix(f.r, f.g, clamp(uPuff * 2.2, 0., 1.)) + length(p - q); }
  float shape(vec2 p){ return mix(mk(p) - uPuff, length(p - uBall) - uRadius, uSphere); }
  // the loader's construction drawing (world-loader.js), in mark units: guides one CSS px wide (uLine), the outline 1.2
  float seg(float d, float w){ return 1. - smoothstep(w * .5 - .6 / uUnit, w * .5 + .6 / uUnit, abs(d)); }
  float far(vec2 m, vec2 a, vec2 b){ vec2 t = normalize(b - a); return dot(m - a, vec2(-t.y, t.x)); }
  vec3 drawing(vec2 m){
    float w = uLine, g = max(max(seg(m.y - 1., w), seg(m.y + 1., w)), seg(m.y, w));
    g = max(g, max(max(seg(m.x + 1.935, w), seg(m.x + .035, w)), max(seg(m.x - .215, w), seg(m.x - 1.935, w))));
    g = max(g, max(seg(far(m, vec2(-1.435, 1.), vec2(-.985, .15)), w), seg(far(m, vec2(-.535, 1.), vec2(-.985, .15)), w)));
    g = max(g, max(seg(far(m, vec2(.635, .18), vec2(1.365, 1.)), w), seg(far(m, vec2(1.075, .05), vec2(1.935, -1.)), w)));
    g = max(g, max(max(seg(length(m) - 2.3, w), seg(length(m) - 1.35, w)), seg(length(m - vec2(-.985, .15)) - .36, w)));
    vec2 q = clamp(m, uBox.xy, uBox.zw);
    float o = seg(texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).r + length(m - q), w * 1.2);
    return vec3(.88, .94, .91) * g * .38 * uGuides + vec3(.94, .97, .96) * o * .85 * uDraw;
  }
  // the pulse: the ball beats (uBeat: seconds since the first beat, about 1.4 a second) and every beat sends rings of waves
  // out from it through the glass and the lines, like a drop in liquid; a ring reaches r a little after its beat
  float beat(float t){ return t < 0. ? 0. : pow(max(sin(t * 8.8), 0.), 2.); }
  vec2 ripple(vec2 p){
    vec2 v = p - uBall; float r = length(v);
    return v / max(r, 1e-3) * uRipple * beat(uBeat - r / 1.6) * sin(r * 9. - uBeat * 12.) * exp(-r * .22);
  }
  void main(){
    vec2 p = (gl_FragCoord.xy - uCenter) / uUnit;               // mark units, y up
    if (uRipple > 0.) p += ripple(p);
    // liquid: the glass ripples as it fills and pulses, its edges and everything seen through it wavering
    p += uWobble * vec2(sin(p.y * 4.3 + uTime * 5.1) + .5 * sin(p.y * 9.1 - uTime * 7.3), cos(p.x * 3.7 - uTime * 4.4) + .5 * cos(p.x * 8.3 + uTime * 6.1)) * .045;
    float d = shape(p), px = 1. / uUnit;
    if (d > px * 1.5) {
      // round the glass: the black with the construction on it, the lines bulging away from the ball, which glows
      vec2 v = p - uBall; float r2 = dot(v, v), R2 = uRadius * uRadius;
      float rr = sqrt(r2);
      vec3 C = (uDraw + uGuides > 0. ? drawing(uBall + v * (1. - uWarp * .5 * R2 / (r2 + R2 + 1e-4))) : vec3(0.))
        + vec3(.8, .78, 1.) * uSphere * uWarp * exp(-d / (.08 + uRadius * .3)) * .45
        + vec3(.75, .72, 1.) * (uRipple > 0. ? beat(uBeat - rr / 1.6) * smoothstep(.55, 1., sin(rr * 9. - uBeat * 12.)) * exp(-rr * .7) * 1.6 * uRipple : 0.);
      float A = max(uVeil, max(C.r, max(C.g, C.b)));
      if (A <= .002) discard;
      gl_FragColor = vec4(min(C / A, 1.), A); return;
    }
    float e = max(.012, px);
    vec2 g = vec2(shape(p + vec2(e, 0.)) - shape(p - vec2(e, 0.)), shape(p + vec2(0., e)) - shape(p - vec2(0., e))) / (2. * e);
    g *= min(1., 1. / max(length(g), 1e-5));                      // outward; the blurred field fades it to nothing along a ridge
    // a pillow: round over a rim of width R, flat beyond; a puffed or ball-shaped glass is round all over
    float s = max(-d, 0.), R = max(mix(.07 + uPuff * 1.15, uRadius, uSphere), .035);
    float x = clamp(s / R, 0., 1.), c = sqrt(max(1. - (1. - x) * (1. - x), 0.)), h = R * c;
    float slope = min((1. - x) / max(c, .06), 9.);
    // streaks drawn down the glass (Alche's are vertical), strongest where it is thick
    float st = (noise(vec2(p.x * 9., p.y * .8 + uTime * .04)) - .5) + (noise(vec2(p.x * 23., p.y * 1.6)) - .5) * .45;
    vec3 n = normalize(vec3(g * slope + vec2(st * .1, st * .02) * smoothstep(0., .3, h) / (1. + uPuff * 2.), 1.));
    // through both faces and on to the name and the wall behind; each colour bent a little differently
    vec3 col; vec3 v = vec3(0., 0., -1.);
    vec2 grain = (vec2(hash(gl_FragCoord.xy + fract(uTime) * 61.), hash(gl_FragCoord.yx + 7.3)) - .5) * 1.2;
    // the ball is a crystal ball: what is behind it turned over, rushing out at its rim; the pillow bends it gently. As the
    // ball becomes the fat MK the one view dissolves into the other (mixing where they look made a colour-split splash)
    vec2 b = (p - uBall) / max(uRadius, 1e-3); float bb = min(dot(b, b), .992), rush = .55 + min(.8 / sqrt(1. - bb), 3.5);
    bool draws = uDraw + uGuides > 0.;
    for (int i = 0; i < 3; i++) {
      vec3 r = refract(v, n, 1. / (1.5 + (float(i) - 1.) * .018));
      float cp = 0., cb = 0.;
      if (uSphere < .999) { vec2 q = p + r.xy * (h * 2.8 + .3) / (1. + uPuff); cp = texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.); }
      if (uSphere > .001) { vec2 q = uBall - b * uRadius * rush * (1. + (float(i) - 1.) * .03); cb = texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.); }
      col[i] = mix(cp, cb, uSphere);
    }
    col *= mix(vec3(1.), uTint, clamp(h * 1.6, 0., .8));          // violet where the glass is deep
    float fres = .04 + .96 * pow(1. - n.z, 5.);
    vec3 refl = mix(vec3(.04, .035, .1), vec3(.8, .78, 1.05), smoothstep(-.4, .9, n.y));
    col = mix(col, refl, fres * .55);
    col += vec3(1., .98, 1.05) * pow(max(dot(reflect(v, n), normalize(vec3(-.35, .55, .75))), 0.), 70.) * .9;
    float a = smoothstep(px * 1.2, -px * .8, d) * uAlpha;
    float A = a + (1. - a) * uVeil;                               // the glass over the black veil (straight alpha)
    gl_FragColor = vec4(col * a / max(A, 1e-4), A);
  }`;function ma(a,h,L){const r=new Ye(1,1,{type:De}),v=ha(),q=new Ve({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:r.texture},uField:{value:v},uBox:{value:new Qe(...M)},uRes:{value:new me(1,1)},uCenter:{value:new me},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new Z("#8f7dff")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new me},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:va}),l=new J(new we(2,2),q);l.frustumCulled=!1,l.renderOrder=1e3,l.visible=!1,l.onBeforeRender=i=>{const g=i.getRenderTarget(),m=L.map(t=>t.visible);l.visible=!1,L.forEach(t=>{t.visible=!1}),i.setRenderTarget(r),i.clear(),i.render(a,h),i.setRenderTarget(g),L.forEach((t,u)=>{t.visible=m[u]}),l.visible=!0},a.add(l);const e=q.uniforms;return{mesh:l,resize(i,g){r.setSize(i,g),e.uRes.value.set(i,g)},set(i){e.uCenter.value.set(i.center[0],i.center[1]),e.uUnit.value=i.unit,e.uSphere.value=i.sphere,e.uRadius.value=i.radius,e.uPuff.value=i.puff,e.uAlpha.value=i.alpha,e.uTime.value=i.time,e.uVeil.value=i.veil??0,e.uWobble.value=i.wobble??0,e.uBall.value.set(...i.ball??[0,0]),e.uDraw.value=i.draw??0,e.uGuides.value=i.guides??0,e.uLine.value=i.line??.005,e.uWarp.value=i.warp??0,e.uRipple.value=i.ripple??0,e.uBeat.value=i.beat??0},dispose(){r.dispose(),v.dispose(),q.dispose(),l.geometry.dispose()}}}let N=!1;const xa=async a=>{const h=a.lang==="ar",L=matchMedia("(prefers-reduced-motion: reduce)").matches,r=new Je;r.environment=a.env;const v=new ea(32,a.viewport.aspect,.1,220);r.add(aa({base:"#040406",line:"#7d838c",accent:"#5b3cff",fade:.05,floorY:-3.2}));const q=ta(a.quality?700:300,[36,14,30],"#d9d4ff",2);r.add(q);const l=ia({radius:18,arc:2.1,height:13,rows:10});l.position.set(0,1.1,11),r.add(l);const e=l.material.uniforms,i=e.uWall.value;await Promise.allSettled([document.fonts.load('700 300px "Space Grotesk Variable"'),document.fonts.load('800 300px "Cairo Variable"')]);const g=Ge(h?["محمد محمود"]:["MOHAMED","MAHMOUD"],{font:h?'800 330px "Cairo Variable", sans-serif':'700 380px "Space Grotesk Variable", sans-serif',lineHeight:h?1.1:.84,rtl:h}),m=new J(new we(1,1/g.aspect),new sa({map:g.texture,alphaTest:.45,color:"#eaf5ef",toneMapped:!1}));m.position.set(0,.15,-2.4),r.add(m);const t=[{pat:1,hold:6,tint:"#5b3cff"},{pat:2,hold:4,tint:null},{pat:1,hold:5,tint:"#2f6bff"},{pat:1,hold:5,tint:"#d9a777"},{pat:2,hold:4,tint:null},{pat:1,hold:5,tint:"#b8bec8"},{pat:1,hold:5,tint:"#3d2bd9"}],u=(n,s)=>{e["uPat"+n].value=s.pat,e["uAsp"+n].value=i};let d=0,w=-1,x=-1;u("A",t[0]),u("B",t[0]);const R=new Z("#5b3cff"),B=new Z,S=new Z("#ffffff"),p=Ge(["MK"],{font:'700 900px "Space Grotesk Variable", sans-serif',width:2048});e.uLetters.value=p.texture,e.uLetterAsp.value=p.aspect,e.uLetterAmt.value=1,e.uLetterGlow.value=.4;const G=oa(.62),f=new ra,b=new J(G,na(a,"#e6dcff",{thickness:1.8,dispersion:11})),z=new la(new ua(G,28),new pa({color:"#ffffff",transparent:!0,opacity:.1}));f.add(b,z),f.position.set(0,.05,.9),r.add(f);const k=ma(r,v,[b,z]),W=new URLSearchParams(location.search).has("intro")?Number(new URLSearchParams(location.search).get("intro")):null,T=new ge,F=new J(new we(18,18),new Ve({toneMapped:!1,uniforms:{uK:{value:0},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uK, uTime; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
      void main(){
        vec2 p = (vUv - .5) * 18.;
        float r = length(p), a = atan(p.y, p.x);
        float wob = (noise(vec2(a * 2.4, uTime * 1.7)) - .5) * 1.4 + (noise(p * 1.3 + uTime) - .5) * .6;
        float R = uK * 8.5, w = .45 + uK * 1.1;
        float d = (r - R - wob) / w;
        float ring = exp(-d * d * 2.2) * (1. - uK * uK) + exp(-r * r * .6) * max(0., 1. - uK * 4.) * 1.5;   // the ring, and the flash at its birth
        if (ring < .03 || hash(floor(gl_FragCoord.xy) + floor(uTime * 60.)) > ring * 1.35) discard;   // sparkler grain
        vec3 hot = mix(vec3(.35, .45, 1.6), vec3(2.4, 2.25, 2.), smoothstep(.35, .95, ring));
        hot = mix(hot, vec3(2.2, 1.2, .5), smoothstep(.6, 1., noise(vec2(a * 5., 3.))) * .35 * ring);   // a warm streak here and there
        gl_FragColor = vec4(hot * (.5 + ring), 1.);
      }`}));F.position.set(0,0,-1.1),F.visible=!1,r.add(F);const xe=F.material.uniforms,be=new ca("#ffffff",2.4);be.position.set(4,6,6),r.add(be);const ee=new fa("#7b5cff",30,18,1.6);ee.position.set(-3,-1.5,2.5),r.add(ee);const D=new $,ye=new $,E=new $,Me=new da,_e=new ge(1,0,0),Ke=new ge(0,1,0),H=new $;let j=!1,U=-1,Re=1,ae=0,I=0,V=-1,Be=!1,Te="",Ae=0;addEventListener("world:reset",()=>{j=!0});let te=11;function qe(){const n=a.viewport,s=_=>2*(11-_)*Math.tan(ze.degToRad(v.fov/2))*n.aspect;te=Math.min(s(m.position.z)*(n.portrait?.94:.86),12.5),m.scale.set(te,te,1),Re=Math.min(1.4,s(f.position.z)*(n.portrait?.92:.52)/3.87),ae=n.portrait?.2:.38,k.resize(Math.round(n.width*n.dpr),Math.round(n.height*n.dpr))}qe();let ie=0,se=0,oe=0,re=1;return{scene:r,camera:v,resize:qe,focus(n){n&&U<0&&(U=performance.now()/1e3)},update({p:n,t:s,dt:_,active:Oe}){U<0&&(U=s);const K=C.out(c(0,1.8,s-U)),y=C.inOut(c(.4,1,n)),Se=a.pointer.inside?a.pointer.x:0,ke=a.pointer.inside?a.pointer.y:0;v.position.set(Se*.35*(1-y),.35+ke*.2*(1-y),12.6-K*1.6),v.lookAt(0,.05,0),Oe&&a.pointer.down&&!j&&(H.setFromAxisAngle(Ke,a.pointer.dragX*3.2),D.premultiply(H),H.setFromAxisAngle(_e,-a.pointer.dragY*2.6),D.premultiply(H)),j&&(D.slerp(E.identity(),1-Math.exp(-6*_)),D.angleTo(E)<.002&&(D.identity(),j=!1));const ne=window.__worldIntro??W;let o=L?9:ne!==null?ne:V<0?-1:s-V;const le=o<0?1:c(3.2,4.7,o);Me.set((Math.sin(s*.37)*.1+ke*.12)*le*(1-y*.6),(Math.sin(s*.23)*.38+Se*.22)*le*(1-y*.6),Math.sin(s*.19)*.03*le),ye.setFromEuler(Me),E.copy(ye).multiply(D),f.quaternion.slerp(E,1-Math.exp(-8*_));const Ee=Re*(.82+.18*K)*(1+y*.15);f.scale.setScalar(Ee),f.position.y=ae*(1-y)+.05+Math.sin(s*.9)*.06*(o<0?0:c(3.3,4.3,o)),I=_<.045&&s-U>.6?I+1:0,!N&&(I>=20||s-U>6)&&s-U>2.4&&performance.now()>=(window.__mkDrawnAt??0)&&(N=!0,V=s,o=0,a.emit("surge",null));const O=L?1:V<0?0:c(.1,1.9,s-V),ue=Math.max(0,1-O)*Math.min(1,O*8);F.visible=O>0&&O<1,F.position.y=f.position.y,xe.uK.value=C.out(O),xe.uTime.value=s,ee.intensity=30+Math.sin(s*1.3)*6+ue*260,z.material.opacity=.18+.2*(1-y)*K+ue*.6,w<0&&(w=s);const pe=(d+1)%t.length;if(x<0&&t.length>1&&s-w>t[d].hold&&(x=s,u("B",t[pe]),e.uTintB.value.set(t[pe].tint??"#"+e.uTint.value.getHexString())),x>=0){const A=c(0,1.3,s-x);e.uMix.value=C.inOut(A),A>=1&&(d=pe,u("A",t[d]),e.uTint.value.copy(e.uTintB.value),e.uMix.value=0,x=-1,w=s)}R.lerp(B.copy(e.uMix.value>.5?e.uTintB.value:e.uTint.value),1-Math.exp(-_*1.5)),b.material.attenuationColor.copy(R).lerp(S,.45),m.position.y=ae+.15+y*.9,m.material.color.setScalar(K*(1-y)),m.visible=y<.99,e.uTime.value=s,e.uLevel.value=(.13+.05*K)*(1+y*.1),e.uFlash.value=ue*.9,q.material.uniforms.uTime.value=s,{x:ie,y:se,z:oe,w:re}=f.quaternion;const ce=o>=0&&o<3.55,Fe=o<0&&!N&&I>4&&Ae<2;Fe&&Ae++,k.mesh.visible=ce||Fe,b.visible=z.visible=!ce||o>3.15;const fe=ne!==null||V>=0?o<3.55:!N;if(fe!==Be&&(Be=fe,a.emit("intro",fe)),ce||o<0){v.updateMatrixWorld(),f.updateMatrixWorld();const A=a.viewport.dpr,Ce=a.viewport.width*A,de=a.viewport.height*A;T.copy(f.position).project(v);const Y=(T.x*.5+.5)*Ce,Q=(T.y*.5+.5)*de;T.copy(f.position).applyMatrix4(v.matrixWorldInverse);const P=de/2/(-T.z*Math.tan(ze.degToRad(v.fov/2)))*f.scale.x;if(o<0){const X=`${Math.round(Y)},${Math.round(Q)},${Math.round(P)}`;X!==Te&&(Te=X,a.emit("markrect",{x:Y/A,y:a.viewport.height-Q/A,unit:P/A})),k.set({center:[Y,Q],unit:P,ball:[.09,0],sphere:1,radius:0,puff:0,alpha:1,veil:1,draw:1,guides:1,line:A/P,time:s})}else{const X=Math.hypot(Ce,de)/P*.6+1,he=o-.6,He=he<0?0:Math.pow(Math.max(Math.sin(he*8.8),0),2),Le=C.inOut(c(.5,1.4,o)),ve=C.in(c(1.5,2.3,o)),je=C.inOut(c(2.15,2.5,o)),Ie=C.inOut(c(2.4,3.3,o)),Ue=.55*Le*(1+.14*He*(1-ve));k.set({center:[Y,Q],unit:P,ball:[.09,0],sphere:1-je,radius:Ue+(X-Ue)*ve,puff:1.4*c(1.8,2.15,o)*(1-Ie),alpha:1-c(3.2,3.5,o),veil:1-c(2.25,2.32,o),draw:1-c(2,2.35,o),guides:1-C.inOut(c(0,.6,o)),line:A/P,warp:Le*(1-ve),ripple:.09*c(.6,.9,o)*(1-c(2.6,3.3,o)),beat:he,wobble:c(1.8,2.1,o)*(1-c(2.9,3.3,o)),time:s})}}},hud(){const n=s=>(s<0?"−":"+")+Math.abs(s).toFixed(3);return a.emit("quat",[ie,se,oe,re]),{qx:n(ie),qy:n(se),qz:n(oe),qw:n(re)}},dispose(){G.dispose(),g.texture.dispose(),p.texture.dispose(),k.dispose()}}};export{xa as default};
