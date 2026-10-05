import{W as $e,H as Ve,S as Oe,V as we,C as J,a as Ne,M as ee,P as be,b as Ze,c as De,D as Ge,d as Je,R as ea,L as aa,e as ta,f as ia,g as sa,h as ra,l as oa,i as _e,j as na,k as la,m as ua,G as ca,n as pa,o as fa,p as va,E as da,q as ha,r as xe,s as ma,t as ga,Q as N,u as wa,v as o,w as A,x as ze}from"./WorldChrome.astro_astro_type_script_index_0_lang.0sjmUTXf.js";import"./preload-helper.DArFJGja.js";const R=[-3.1,-2.15,3.1,2.15];function xa(a=448){const d=Math.round(a*(R[3]-R[1])/(R[2]-R[0])),q=Ze.map(t=>t.map(([c,v])=>[c-De.width/2,v-De.height/2])),n=new Float32Array(a*d);for(let t=0;t<d;t++)for(let c=0;c<a;c++){const v=R[0]+(c+.5)/a*(R[2]-R[0]),w=R[1]+(t+.5)/d*(R[3]-R[1]);let x=1/0,B=!1;for(const T of q){let C=!1;for(let p=0,P=T.length-1;p<T.length;P=p++){const[f,b]=T[P],[ae,F]=T[p],y=ae-f,D=F-b,L=Math.max(0,Math.min(1,((v-f)*y+(w-b)*D)/(y*y+D*D)));x=Math.min(x,(v-f-y*L)**2+(w-b-D*L)**2),b>w!=F>w&&v<f+(w-b)/(F-b)*y&&(C=!C)}B||=C}n[t*a+c]=(B?-1:1)*Math.sqrt(x)}const h=n.slice(),k=new Float32Array(a*d),u=10,e=2*u+1,i=(t,c,v,w,x)=>{for(let B=0;B<w;B++){const T=p=>t[x(B,Math.min(v-1,Math.max(0,p)))];let C=0;for(let p=-u;p<=u;p++)C+=T(p);for(let p=0;p<v;p++)c[x(B,p)]=C/e,C+=T(p+u+1)-T(p-u)}};for(let t=0;t<3;t++)i(h,k,a,d,(c,v)=>c*a+v),i(k,h,d,a,(c,v)=>v*a+c);const g=new Uint16Array(a*d*2);for(let t=0;t<a*d;t++)g[t*2]=Ge.toHalfFloat(n[t]),g[t*2+1]=Ge.toHalfFloat(h[t]);const m=new Je(g,a,d,ea,Ve);return m.minFilter=m.magFilter=aa,m.needsUpdate=!0,m}const ba=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp, uRipple, uBeat, uScreen;
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
    // the whole screen pulses (uScreen > 0 bulges it like a fisheye toward you, < 0 pinches it): every pixel, glass or
    // not, looks at a point pulled toward the middle, each colour a little differently at the edges
    vec2 sc = (gl_FragCoord.xy - uRes * .5) / uRes.y, bulge = sc * uScreen * .45 * exp(-dot(sc, sc) * 1.5);
    vec2 p = (gl_FragCoord.xy - bulge * uRes.y - uCenter) / uUnit;   // mark units, y up
    if (uRipple > 0.) p += ripple(p);
    // liquid: the glass ripples as it fills and pulses, its edges and everything seen through it wavering
    p += uWobble * vec2(sin(p.y * 4.3 + uTime * 5.1) + .5 * sin(p.y * 9.1 - uTime * 7.3), cos(p.x * 3.7 - uTime * 4.4) + .5 * cos(p.x * 8.3 + uTime * 6.1)) * .045;
    float d = shape(p), px = 1. / uUnit;
    if (d > px * 1.5) {
      // round the glass: the black with the construction on it, the lines bulging away from the ball, which glows
      vec2 v = p - uBall; float r2 = dot(v, v), R2 = uRadius * uRadius;
      float rr = sqrt(r2);
      vec3 C = (uDraw + uGuides > 0. ? drawing(uBall + v * (1. - uWarp * .5 * R2 / (r2 + R2 + 1e-4))) : vec3(0.))
        + vec3(.82, 1., .93) * uSphere * uWarp * exp(-d / (.08 + uRadius * .3)) * .45
        + vec3(.78, 1., .9) * (uRipple > 0. ? beat(uBeat - rr / 1.6) * smoothstep(.55, 1., sin(rr * 9. - uBeat * 12.)) * exp(-rr * .7) * 1.6 * uRipple : 0.);
      if (abs(uScreen) > .002) {   // the room, bent by the pulse, under what is left of the black
        vec3 w;
        for (int i = 0; i < 3; i++) w[i] = texture2D(uBg, clamp((gl_FragCoord.xy - bulge * uRes.y * (1. + (float(i) - 1.) * .07)) / uRes, .001, .999))[i];
        gl_FragColor = vec4(w * (1. - uVeil) + C, 1.); return;
      }
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
    col *= mix(vec3(1.), uTint, clamp(h * 1.6, 0., .8));          // mint where the glass is deep
    float fres = .04 + .96 * pow(1. - n.z, 5.);
    vec3 refl = mix(vec3(.025, .05, .045), vec3(.84, .98, .93), smoothstep(-.4, .9, n.y));
    col = mix(col, refl, fres * .55);
    col += vec3(1.) * pow(max(dot(reflect(v, n), normalize(vec3(-.35, .55, .75))), 0.), 70.) * .9;
    float a = smoothstep(px * 1.2, -px * .8, d) * uAlpha;
    float A = a + (1. - a) * uVeil;                               // the glass over the black veil (straight alpha)
    gl_FragColor = vec4(col * a / max(A, 1e-4), A);
  }`;function ya(a,d,q){const n=new $e(1,1,{type:Ve}),h=xa(),k=new Oe({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:n.texture},uField:{value:h},uBox:{value:new Ne(...R)},uRes:{value:new we(1,1)},uCenter:{value:new we},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new J("#8fe3c4")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new we},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0},uScreen:{value:0}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:ba}),u=new ee(new be(2,2),k);u.frustumCulled=!1,u.renderOrder=1e3,u.visible=!1,u.onBeforeRender=i=>{const g=i.getRenderTarget(),m=q.map(t=>t.visible);u.visible=!1,q.forEach(t=>{t.visible=!1}),i.setRenderTarget(n),i.clear(),i.render(a,d),i.setRenderTarget(g),q.forEach((t,c)=>{t.visible=m[c]}),u.visible=!0},a.add(u);const e=k.uniforms;return{mesh:u,resize(i,g){n.setSize(i,g),e.uRes.value.set(i,g)},set(i){e.uCenter.value.set(i.center[0],i.center[1]),e.uUnit.value=i.unit,e.uSphere.value=i.sphere,e.uRadius.value=i.radius,e.uPuff.value=i.puff,e.uAlpha.value=i.alpha,e.uTime.value=i.time,e.uVeil.value=i.veil??0,e.uWobble.value=i.wobble??0,e.uBall.value.set(...i.ball??[0,0]),e.uDraw.value=i.draw??0,e.uGuides.value=i.guides??0,e.uLine.value=i.line??.005,e.uWarp.value=i.warp??0,e.uRipple.value=i.ripple??0,e.uBeat.value=i.beat??0,e.uScreen.value=i.screen??0},dispose(){n.dispose(),h.dispose(),k.dispose(),u.geometry.dispose()}}}let Z=!1;const Ba=async a=>{const d=a.lang==="ar",q=matchMedia("(prefers-reduced-motion: reduce)").matches,n=new ta;n.environment=a.env;const h=new ia(32,a.viewport.aspect,.1,220);n.add(sa({base:"#040406",line:"#7d838c",accent:"#21c47b",fade:.05,floorY:-3.2}));const k=ra(a.quality?700:300,[36,14,30],"#dcf3ea",2);n.add(k);const u=oa({radius:18,arc:2.1,height:13,rows:10});u.position.set(0,1.1,11),n.add(u);const e=u.material.uniforms,i=e.uWall.value;await Promise.allSettled([document.fonts.load('700 300px "Space Grotesk Variable"'),document.fonts.load('800 300px "Cairo Variable"')]);const g=_e(d?["محمد محمود"]:["MOHAMED","MAHMOUD"],{font:d?'800 330px "Cairo Variable", sans-serif':'700 380px "Space Grotesk Variable", sans-serif',lineHeight:d?1.1:.84,rtl:d}),m=new ee(new be(1,1/g.aspect),new na({map:g.texture,alphaTest:.45,color:"#eaf5ef",toneMapped:!1}));m.position.set(0,.15,-2.4),n.add(m);const t=la,c=(l,s)=>{e["uPat"+l].value=s.pat,e["uAsp"+l].value=i};let v=0,w=-1,x=-1;c("A",t[0]),c("B",t[0]);const B=new J("#16996f"),T=new J,C=new J("#ffffff"),p=_e(["MK"],{font:'700 900px "Space Grotesk Variable", sans-serif',width:2048});e.uLetters.value=p.texture,e.uLetterAsp.value=p.aspect,e.uLetterAmt.value=1,e.uLetterGlow.value=.4;const P=ua(.62),f=new ca,b=new ee(P,pa(a,"#e0f4ec",{thickness:1.8,dispersion:11})),ae=fa(b.material),F=new va(new da(P,28),new ha({color:"#ffffff",transparent:!0,opacity:.1}));f.add(b,F),f.position.set(0,.05,.9),n.add(f);const y=ya(n,h,[b,F]),D=new URLSearchParams(location.search).has("intro")?Number(new URLSearchParams(location.search).get("intro")):null,L=new xe,G=new ee(new be(18,18),new Oe({toneMapped:!1,uniforms:{uK:{value:0},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
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
        vec3 hot = mix(vec3(.3, 1.35, .95), vec3(2.3, 2.4, 2.25), smoothstep(.35, .95, ring));
        hot = mix(hot, vec3(2.2, 1.2, .5), smoothstep(.6, 1., noise(vec2(a * 5., 3.))) * .35 * ring);   // a warm streak here and there
        gl_FragColor = vec4(hot * (.5 + ring), 1.);
      }`}));G.position.set(0,0,-1.1),G.visible=!1,n.add(G);const ye=G.material.uniforms,Me=new ma("#ffffff",2.4);Me.position.set(4,6,6),n.add(Me);const te=new ga("#21c47b",30,18,1.6);te.position.set(-3,-1.5,2.5),n.add(te);const _=new N,Re=new N,E=new N,Be=new wa,Ke=new xe(1,0,0),He=new xe(0,1,0),j=new N;let I=!1,U=-1,Te=1,ie=0,Y=0,z=-1,Se=!1,Ae="",qe=0;addEventListener("world:reset",()=>{I=!0});let se=11;function ke(){const l=a.viewport,s=V=>2*(11-V)*Math.tan(ze.degToRad(h.fov/2))*l.aspect;se=Math.min(s(m.position.z)*(l.portrait?.94:.86),12.5),m.scale.set(se,se,1),Te=Math.min(1.4,s(f.position.z)*(l.portrait?.92:.52)/3.87),ie=l.portrait?.2:.38,y.resize(Math.round(l.width*l.dpr),Math.round(l.height*l.dpr))}ke();let re=0,oe=0,ne=0,le=1;return{scene:n,camera:h,resize:ke,focus(l){l&&U<0&&(U=performance.now()/1e3)},update({p:l,t:s,dt:V,active:Ee}){U<0&&(U=s);const O=A.out(o(0,1.8,s-U)),M=A.inOut(o(.4,1,l)),Ce=a.pointer.inside?a.pointer.x:0,Fe=a.pointer.inside?a.pointer.y:0;h.position.set(Ce*.35*(1-M),.35+Fe*.2*(1-M),12.6-O*1.6),h.lookAt(0,.05,0),Ee&&a.pointer.down&&!I&&(j.setFromAxisAngle(He,a.pointer.dragX*3.2),_.premultiply(j),j.setFromAxisAngle(Ke,-a.pointer.dragY*2.6),_.premultiply(j)),I&&(_.slerp(E.identity(),1-Math.exp(-6*V)),_.angleTo(E)<.002&&(_.identity(),I=!1));const ue=window.__worldIntro??D;let r=q?9:ue!==null?ue:z<0?-1:s-z;const ce=r<0?1:o(2.9,4.4,r);Be.set((Math.sin(s*.37)*.1+Fe*.12)*ce*(1-M*.6),(Math.sin(s*.23)*.38+Ce*.22)*ce*(1-M*.6),Math.sin(s*.19)*.03*ce),Re.setFromEuler(Be),E.copy(Re).multiply(_),f.quaternion.slerp(E,1-Math.exp(-8*V));const je=Te*(.82+.18*O)*(1+M*.15);f.scale.setScalar(je),f.position.y=ie*(1-M)+.05+Math.sin(s*.9)*.06*(r<0?0:o(3,4,r)),Y=V<.045&&s-U>.6?Y+1:0,!Z&&(Y>=20||s-U>6)&&s-U>2.4&&performance.now()>=(window.__mkDrawnAt??0)&&(Z=!0,z=s,r=0,a.emit("surge",null));const K=q?1:z<0?0:o(.1,1.9,s-z),pe=Math.max(0,1-K)*Math.min(1,K*8);G.visible=K>0&&K<1,G.position.y=f.position.y,ye.uK.value=A.out(K),ye.uTime.value=s,te.intensity=30+Math.sin(s*1.3)*6+pe*260,F.material.opacity=.18+.2*(1-M)*O+pe*.6,w<0&&(w=s);const H=(v+1)%t.length;if(x<0&&t.length>1&&s-w>t[v].hold&&(x=s,c("B",t[H]),e.uTintB.value.set(t[H].tint??"#"+e.uTint.value.getHexString()),e.uTint2B.value.set(t[H].tint2??t[H].tint??"#"+e.uTint2.value.getHexString())),x>=0){const S=o(0,1.3,s-x);e.uMix.value=A.inOut(S),S>=1&&(v=H,c("A",t[v]),e.uTint.value.copy(e.uTintB.value),e.uTint2.value.copy(e.uTint2B.value),e.uMix.value=0,x=-1,w=s)}B.lerp(T.copy(e.uMix.value>.5?e.uTintB.value:e.uTint.value).lerp(e.uMix.value>.5?e.uTint2B.value:e.uTint2.value,.5),1-Math.exp(-V*1.5)),b.material.attenuationColor.copy(B).lerp(C,.45),m.position.y=ie+.15+M*.9,m.material.color.setScalar(O*(1-M)),m.visible=M<.99,e.uTime.value=s,ae.value=s,e.uLevel.value=(.13+.05*O)*(1+M*.1),e.uFlash.value=pe*.9,k.material.uniforms.uTime.value=s,{x:re,y:oe,z:ne,w:le}=f.quaternion;const fe=r>=0&&r<3.2,Le=r<0&&!Z&&Y>4&&qe<2;Le&&qe++,y.mesh.visible=fe||Le,b.visible=F.visible=!fe||r>2.8;const ve=ue!==null||z>=0?r<3.2:!Z;if(ve!==Se&&(Se=ve,a.emit("intro",ve)),fe||r<0){h.updateMatrixWorld(),f.updateMatrixWorld();const S=a.viewport.dpr,Ue=a.viewport.width*S,de=a.viewport.height*S;L.copy(f.position).project(h);const Q=(L.x*.5+.5)*Ue,X=(L.y*.5+.5)*de;L.copy(f.position).applyMatrix4(h.matrixWorldInverse);const W=de/2/(-L.z*Math.tan(ze.degToRad(h.fov/2)))*f.scale.x;if(r<0){const $=`${Math.round(Q)},${Math.round(X)},${Math.round(W)}`;$!==Ae&&(Ae=$,a.emit("markrect",{x:Q/S,y:a.viewport.height-X/S,unit:W/S})),y.set({center:[Q,X],unit:W,ball:[.09,0],sphere:1,radius:0,puff:0,alpha:1,veil:1,draw:1,guides:1,line:S/W,time:s})}else{const $=Math.hypot(Ue,de)/W*.6+1,he=r-.5,Ie=he<0?0:Math.pow(Math.max(Math.sin(he*8.8),0),2),We=A.inOut(o(.4,1.1,r)),me=A.in(o(1.2,1.85,r)),Ye=A.inOut(o(1.75,2.05,r)),Qe=A.inOut(o(1.95,2.9,r)),Pe=.55*We*(1+.14*Ie*(1-me)),ge=r-1.85,Xe=ge<0?A.in(o(1.4,1.85,r)):Math.exp(-ge*2.6)*Math.cos(ge*7.5);y.set({center:[Q,X],unit:W,ball:[.09,0],sphere:1-Ye,radius:Pe+($-Pe)*me,puff:1.4*o(1.45,1.75,r)*(1-Qe),alpha:1-o(2.85,3.15,r),veil:1-o(1.8,1.86,r),draw:1-o(1.5,1.85,r),guides:1-A.inOut(o(0,.5,r)),line:S/W,warp:We*(1-me),ripple:.09*o(.5,.8,r)*(1-o(1.8,2.4,r)),beat:he,screen:q?0:Xe*(1-o(2.9,3.15,r)),wobble:o(1.6,1.9,r)*(1-o(2.5,2.9,r)),time:s})}}},hud(){const l=s=>(s<0?"−":"+")+Math.abs(s).toFixed(3);return a.emit("quat",[re,oe,ne,le]),{qx:l(re),qy:l(oe),qz:l(ne),qw:l(le)}},dispose(){P.dispose(),g.texture.dispose(),p.texture.dispose(),y.dispose()}}};export{Ba as default};
