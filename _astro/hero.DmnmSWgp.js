import{W as $e,H as _e,S as Ve,V as xe,C as ae,a as Ne,M as te,P as ye,b as Ze,c as Pe,D as De,d as Je,R as ea,L as aa,e as ta,f as sa,g as ia,h as ra,l as oa,i as ze,j as na,k as la,m as ua,G as ca,n as pa,o as ma,p as ha,E as va,q as da,r as j,s as fa,t as ga,Q as J,u as xa,v as wa,w as g,x as U,y as we}from"./WorldChrome.astro_astro_type_script_index_0_lang.BvQbj_81.js";import"./preload-helper.DArFJGja.js";const M=[-3.1,-2.15,3.1,2.15];function ya(e=448){const f=Math.round(e*(M[3]-M[1])/(M[2]-M[0])),q=Ze.map(i=>i.map(([o,h])=>[o-Pe.width/2,h-Pe.height/2])),u=new Float32Array(e*f);for(let i=0;i<f;i++)for(let o=0;o<e;o++){const h=M[0]+(o+.5)/e*(M[2]-M[0]),x=M[1]+(i+.5)/f*(M[3]-M[1]);let w=1/0,R=!1;for(const B of q){let k=!1;for(let v=0,P=B.length-1;v<B.length;P=v++){const[n,y]=B[P],[se,F]=B[v],b=se-n,D=F-y,C=Math.max(0,Math.min(1,((h-n)*b+(x-y)*D)/(b*b+D*D)));w=Math.min(w,(h-n-b*C)**2+(x-y-D*C)**2),y>x!=F>x&&h<n+(x-y)/(F-y)*b&&(k=!k)}R||=k}u[i*e+o]=(R?-1:1)*Math.sqrt(w)}const c=u.slice(),A=new Float32Array(e*f),m=10,s=2*m+1,r=(i,o,h,x,w)=>{for(let R=0;R<x;R++){const B=v=>i[w(R,Math.min(h-1,Math.max(0,v)))];let k=0;for(let v=-m;v<=m;v++)k+=B(v);for(let v=0;v<h;v++)o[w(R,v)]=k/s,k+=B(v+m+1)-B(v-m)}};for(let i=0;i<3;i++)r(c,A,e,f,(o,h)=>o*e+h),r(A,c,f,e,(o,h)=>h*e+o);const a=new Uint16Array(e*f*2);for(let i=0;i<e*f;i++)a[i*2]=De.toHalfFloat(u[i]),a[i*2+1]=De.toHalfFloat(c[i]);const d=new Je(a,e,f,ea,_e);return d.minFilter=d.magFilter=aa,d.needsUpdate=!0,d}const ba=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp, uRipple, uBeat, uScreen, uFar;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
  float mk(vec2 p){ vec2 q = clamp(p, uBox.xy, uBox.zw), f = texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).rg; return mix(f.r, f.g, clamp(uPuff * 2.2, 0., 1.)) + length(p - q); }
  float shape(vec2 p){ return mix(mk(p) - uPuff, length(p - uBall) - uRadius, uSphere); }
  // the loader's construction drawing (world-loader.js), in mark units: guides one CSS px wide (uLine), the outline 1.2
  float seg(float d, float w){ return 1. - smoothstep(w * .5 - .4 / uUnit, w * .5 + .4 / uUnit, abs(d)); }
  float far(vec2 m, vec2 a, vec2 b){ vec2 t = normalize(b - a); return dot(m - a, vec2(-t.y, t.x)); }
  // (Alche's construction A, live at 30 fps: each stroke a bundle of three lines run across the screen, stems and guides,
  // two circles; generated from the same list as world-loader.js draws)
  vec3 drawing(vec2 m){
    float w = uLine, g = 0.;
    g = max(g, seg(m.x - (-1.935), w));
    g = max(g, seg(m.x - (-1.515), w));
    g = max(g, seg(m.x - (-.455), w));
    g = max(g, seg(m.x - (-.035), w));
    g = max(g, seg(m.x - (.215), w));
    g = max(g, seg(m.x - (.635), w));
    g = max(g, seg(m.y - (1.), w));
    g = max(g, seg(m.y - (-1.), w));
    g = max(g, seg(m.y - (0.), w));
    g = max(g, seg(m.y - (.15), w));
    g = max(g, seg(m.y - (-.65), w));
    g = max(g, seg(m.y - (.05), w));
    g = max(g, seg(m.y - (1.55), w));
    g = max(g, seg(m.y - (-1.5), w));
    g = max(g, seg(far(m, vec2(.635, .18), vec2(1.365, 1.)), w));
    g = max(g, seg(far(m, vec2(.855, .115), vec2(1.63, 1.)), w));
    g = max(g, seg(far(m, vec2(1.075, .05), vec2(1.895, 1.)), w));
    g = max(g, seg(far(m, vec2(-1.435, 1.), vec2(-.985, .15)), w));
    g = max(g, seg(far(m, vec2(-1.475, .625), vec2(-.985, -.25)), w));
    g = max(g, seg(far(m, vec2(-1.515, .25), vec2(-.985, -.65)), w));
    g = max(g, seg(far(m, vec2(-.535, 1.), vec2(-.985, .15)), w));
    g = max(g, seg(far(m, vec2(-.495, .625), vec2(-.985, -.25)), w));
    g = max(g, seg(far(m, vec2(-.455, .25), vec2(-.985, -.65)), w));
    g = max(g, seg(far(m, vec2(1.075, .05), vec2(1.935, -1.)), w));
    g = max(g, seg(far(m, vec2(.925, -.085), vec2(1.665, -1.)), w));
    g = max(g, seg(far(m, vec2(.775, -.22), vec2(1.395, -1.)), w));
    g = max(g, seg(length(m - vec2(0., 0.)) - 2.3, w));
    g = max(g, seg(length(m - vec2(0., 0.)) - 1.35, w));
    g = max(g, seg(length(m - vec2(-.985, .15)) - .36, w));
    vec2 q = clamp(m, uBox.xy, uBox.zw);
    float o = seg(texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).r + length(m - q), w * 1.2);
    // in linear light, so that once encoded for the screen they match the loader's SVG lines (a hand-over must not brighten)
    return vec3(.85, .85, .87) * g * .11 * uGuides + vec3(.92, .92, .94) * o * .64 * uDraw;
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
        + vec3(.95, .96, 1.) * uSphere * step(.001, uRadius) * exp(-d / (.03 + uRadius * .05)) * .85
        + vec3(.92, .93, .97) * (uRipple > 0. ? beat(uBeat - rr / 1.6) * smoothstep(.55, 1., sin(rr * 9. - uBeat * 12.)) * exp(-rr * .7) * 1.6 * uRipple : 0.);
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
    float sB = clamp(uRadius / max(uFar, 1e-3), 0., 1.), up = smoothstep(.1, .28, sB), mg = mix(.5, 1., smoothstep(.5, 1., sB));
    bool draws = uDraw + uGuides > 0.;
    for (int i = 0; i < 3; i++) {
      vec3 r = refract(v, n, 1. / (1.5 + (float(i) - 1.) * .018));
      float cp = 0., cb = 0.;
      if (uSphere < .999) { vec2 q = p + r.xy * (h * 2.8 + .3) / (1. + uPuff); cp = texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.); }
      if (uSphere > .001) {
        vec2 q = uBall - b * uRadius * rush * (1. + (float(i) - 1.) * .03);                                  // turned over
        vec2 qm = uBall + b * uRadius * mg * (1. + (float(i) - 1.) * .025 * (1. - sB)) * (1. + pow(bb, 3.) * .35 * (1. - sB));   // upright, magnified, stretched at the rim
        cb = mix(texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.),
                 texture2D(uBg, clamp((uCenter + qm * uUnit + grain * (1. - sB)) / uRes, .001, .999))[i], up);
      }
      col[i] = mix(cp, cb, uSphere);
    }
    float glassy = 1. - smoothstep(.6, 1., sB) * uSphere;        // a ball past the screen is nothing but the bend
    col *= mix(vec3(1.), uTint, clamp(h * 1.6, 0., .8) * glassy);   // tinted where the glass is deep
    col += vec3(.97, .98, 1.) * smoothstep(.8, .955, sqrt(bb)) * (1. - smoothstep(.975, .998, sqrt(bb))) * uSphere * .85 * glassy;   // the white rim
    float fres = .04 + .96 * pow(1. - n.z, 5.);
    vec3 refl = mix(vec3(.03, .03, .035), vec3(.95, .95, .97), smoothstep(-.4, .9, n.y));
    col = mix(col, refl, fres * .55 * glassy);
    col += vec3(1.) * pow(max(dot(reflect(v, n), normalize(vec3(-.35, .55, .75))), 0.), 70.) * .9 * glassy;
    float a = smoothstep(px * 1.2, -px * .8, d) * uAlpha;
    float A = a + (1. - a) * uVeil;                               // the glass over the black veil (straight alpha)
    gl_FragColor = vec4(col * a / max(A, 1e-4), A);
  }`;function Ma(e,f,q){const u=new $e(1,1,{type:_e}),c=ya(),A=new Ve({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:u.texture},uField:{value:c},uBox:{value:new Ne(...M)},uRes:{value:new xe(1,1)},uCenter:{value:new xe},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new ae("#d9dce3")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new xe},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0},uScreen:{value:0},uFar:{value:10}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:ba}),m=new te(new ye(2,2),A);m.frustumCulled=!1,m.renderOrder=1e3,m.visible=!1;let s=!0;m.onBeforeRender=a=>{const d=a.getRenderTarget(),i=q.map(o=>o.visible);m.visible=!1,s&&q.forEach(o=>{o.visible=!1}),a.setRenderTarget(u),a.clear(),a.render(e,f),a.setRenderTarget(d),q.forEach((o,h)=>{o.visible=i[h]}),m.visible=!0},e.add(m);const r=A.uniforms;return{mesh:m,resize(a,d){u.setSize(a,d),r.uRes.value.set(a,d)},hideGlass(a){s=a},set(a){r.uCenter.value.set(a.center[0],a.center[1]),r.uUnit.value=a.unit,r.uSphere.value=a.sphere,r.uRadius.value=a.radius,r.uPuff.value=a.puff,r.uAlpha.value=a.alpha,r.uTime.value=a.time,r.uVeil.value=a.veil??0,r.uWobble.value=a.wobble??0,r.uBall.value.set(...a.ball??[0,0]),r.uDraw.value=a.draw??0,r.uGuides.value=a.guides??0,r.uLine.value=a.line??.005,r.uWarp.value=a.warp??0,r.uRipple.value=a.ripple??0,r.uBeat.value=a.beat??0,r.uScreen.value=a.screen??0,r.uFar.value=a.far??10},dispose(){u.dispose(),c.dispose(),A.dispose(),m.geometry.dispose()}}}let ee=!1;const Ta=async e=>{const f=e.lang==="ar",q=matchMedia("(prefers-reduced-motion: reduce)").matches,u=new ta;u.environment=e.env;const c=new sa(32,e.viewport.aspect,.1,220);u.add(ia({base:"#040406",line:"#7d838c",accent:"#8a8f99",fade:.05,floorY:-3.2}));const A=ra(e.quality?700:300,[36,14,30],"#ecebe7",2);u.add(A);const m=oa({radius:18,arc:2.1,height:13,rows:10});m.position.set(0,1.1,11),u.add(m);const s=m.material.uniforms,r=s.uWall.value;await Promise.allSettled([document.fonts.load('700 300px "Space Grotesk Variable"'),document.fonts.load('800 300px "Cairo Variable"')]);const a=ze(f?["محمد محمود"]:["MOHAMED","MAHMOUD"],{font:f?'800 330px "Cairo Variable", sans-serif':'700 380px "Space Grotesk Variable", sans-serif',lineHeight:f?1.1:.84,rtl:f}),d=new te(new ye(1,1/a.aspect),new na({map:a.texture,alphaTest:.45,color:"#f1f0ee",toneMapped:!1}));d.position.set(0,.15,-2.4),u.add(d);const i=la,o=(l,t)=>{s["uPat"+l].value=t.pat,s["uAsp"+l].value=r};let h=0,x=-1,w=-1;o("A",i[0]),o("B",i[0]);const R=new ae("#8c8f97"),B=new ae,k=new ae("#ffffff"),v=ze(["MK"],{font:'700 900px "Space Grotesk Variable", sans-serif',width:2048});s.uLetters.value=v.texture,s.uLetterAsp.value=v.aspect,s.uLetterAmt.value=1,s.uLetterGlow.value=.4;const P=ua(.34),n=new ca,y=new te(P,pa(e,"#eef0f3",{thickness:1.8,dispersion:11})),se=ma(y.material),F=new ha(new va(P,28),new da({color:"#ffffff",transparent:!0,opacity:.18}));n.add(y,F),n.position.set(0,.05,.9),u.add(n);const b=Ma(u,c,[y,F]),D=new URLSearchParams(location.search).has("intro")?Number(new URLSearchParams(location.search).get("intro")):null,C=new j,z=new te(new ye(18,18),new Ve({toneMapped:!1,uniforms:{uK:{value:0},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
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
        vec3 hot = mix(vec3(1.1, .98, .82), vec3(2.3, 2.3, 2.25), smoothstep(.35, .95, ring));
        hot = mix(hot, vec3(2.2, 1.2, .5), smoothstep(.6, 1., noise(vec2(a * 5., 3.))) * .35 * ring);   // a warm streak here and there
        gl_FragColor = vec4(hot * (.5 + ring), 1.);
      }`}));z.position.set(0,0,-1.1),z.visible=!1,u.add(z);const be=z.material.uniforms,Me=new fa("#ffffff",2.4);Me.position.set(4,6,6),u.add(Me);const ie=new ga("#d9b27a",30,18,1.6);ie.position.set(-3,-1.5,2.5),u.add(ie);const _=new J,Re=new J,I=new J,Be=new xa,Ke=new j(1,0,0),Oe=new j(0,1,0),Y=new J,re=new j,He=new j;let Q=!1,L=-1,Te=1,oe=0,X=0,V=-1,Se=!1,qe="",Ae=0;addEventListener("world:reset",()=>{Q=!0});let ne=11;function ke(){const l=e.viewport,t=W=>2*(11-W)*Math.tan(we.degToRad(c.fov/2))*l.aspect;ne=Math.min(t(d.position.z)*(l.portrait?.94:.86),12.5),d.scale.set(ne,ne,1),Te=Math.min(1.4,t(n.position.z)*(l.portrait?.92:.52)/3.87),oe=l.portrait?.2:.38,b.resize(Math.round(l.width*l.dpr),Math.round(l.height*l.dpr))}ke();let le=0,ue=0,ce=0,pe=1;return{scene:u,camera:c,resize:ke,focus(l){l&&L<0&&(L=performance.now()/1e3)},update({p:l,t,dt:W,active:Ee}){L<0&&(L=t);const K=U.out(g(0,1.8,t-L)),T=U.inOut(g(.4,1,l)),Fe=e.pointer.inside?e.pointer.x:0,Ce=e.pointer.inside?e.pointer.y:0;c.position.set(Fe*.35*(1-T),.35+Ce*.2*(1-T),12.6-K*1.6+T*2.4),c.lookAt(0,.05,0),Ee&&e.pointer.down&&!Q&&(Y.setFromAxisAngle(Oe,e.pointer.dragX*3.2),_.premultiply(Y),Y.setFromAxisAngle(Ke,-e.pointer.dragY*2.6),_.premultiply(Y)),Q&&(_.slerp(I.identity(),1-Math.exp(-6*W)),_.angleTo(I)<.002&&(_.identity(),Q=!1));const me=window.__worldIntro??D;let p=q?9:me!==null?me:V<0?-1:t-V;const he=p<0?1:g(1.8,3.3,p),Le=U.inOut(g(.03,.2,l));Be.set((Math.sin(t*.37)*.08+Ce*.08)*he*(1-T*.6),(Math.sin(t*.23)*.18+Fe*.1)*he*(1-Le)+wa(e,Le,t,W),Math.sin(t*.19)*.03*he),Re.setFromEuler(Be),I.copy(Re).multiply(_),n.quaternion.slerp(I,1-Math.exp(-8*W));const je=Te*(.82+.18*K);n.scale.setScalar(je),n.position.y=oe*(1-T)+.05+Math.sin(t*.9)*.06*(p<0?0:g(3,4,p)),X=W<.045&&t-L>.6?X+1:0,!ee&&(X>=20||t-L>6)&&t-L>2.4&&performance.now()>=(window.__mkDrawnAt??0)&&(ee=!0,V=t,p=0,e.emit("surge",null));const O=q?1:V<0?0:g(.1,1.9,t-V),ve=Math.max(0,1-O)*Math.min(1,O*8);z.visible=O>0&&O<1,z.position.y=n.position.y,be.uK.value=U.out(O),be.uTime.value=t,ie.intensity=30+Math.sin(t*1.3)*6+ve*260,F.material.opacity=.18+.2*(1-T)*K+ve*.6,x<0&&(x=t);const H=(h+1)%i.length;if(w<0&&i.length>1&&t-x>i[h].hold&&(w=t,o("B",i[H]),s.uTintB.value.set(i[H].tint??"#"+s.uTint.value.getHexString()),s.uTint2B.value.set(i[H].tint2??i[H].tint??"#"+s.uTint2.value.getHexString())),w>=0){const S=g(0,1.3,t-w);s.uMix.value=U.inOut(S),S>=1&&(h=H,o("A",i[h]),s.uTint.value.copy(s.uTintB.value),s.uTint2.value.copy(s.uTint2B.value),s.uMix.value=0,w=-1,x=t)}R.lerp(B.copy(s.uMix.value>.5?s.uTintB.value:s.uTint.value).lerp(s.uMix.value>.5?s.uTint2B.value:s.uTint2.value,.5),1-Math.exp(-W*1.5)),y.material.attenuationColor.copy(R).lerp(k,.45),d.position.y=oe+.15+T*.9,d.material.color.setScalar(K*(1-U.inOut(g(.15,.5,T)))),d.visible=T<.5,s.uTime.value=t,se.value=t,s.uLevel.value=(.13+.05*K)*(1+T*.1),s.uFlash.value=ve*.9,A.material.uniforms.uTime.value=t,{x:le,y:ue,z:ce,w:pe}=n.quaternion,c.updateMatrixWorld(),re.copy(n.position).project(c);const Ie=-He.copy(n.position).applyMatrix4(c.matrixWorldInverse).z;e.heroMark={x:re.x,y:re.y,ppu:e.viewport.height/2/(Ie*Math.tan(we.degToRad(c.fov/2)))*n.scale.x,q:n.quaternion};const de=p>=0&&p<2.15,Ue=p<0&&!ee&&X>4&&Ae<2;Ue&&Ae++,b.mesh.visible=de||Ue,y.visible=F.visible=!de||p>1.1;const fe=me!==null||V>=0?p<2.15:!ee;if(fe!==Se&&(Se=fe,e.emit("intro",fe)),de||p<0){c.updateMatrixWorld(),n.updateMatrixWorld();const S=e.viewport.dpr,We=e.viewport.width*S,ge=e.viewport.height*S;C.copy(n.position).project(c);const $=(C.x*.5+.5)*We,N=(C.y*.5+.5)*ge;C.copy(n.position).applyMatrix4(c.matrixWorldInverse);const G=ge/2/(-C.z*Math.tan(we.degToRad(c.fov/2)))*n.scale.x;if(p<0){const E=`${Math.round($)},${Math.round(N)},${Math.round(G)}`;E!==qe&&(qe=E,e.emit("markrect",{x:$/S,y:e.viewport.height-N/S,unit:G/S})),b.set({center:[$,N],unit:G,ball:[.09,0],sphere:1,radius:0,puff:0,alpha:1,veil:1,draw:1,guides:1,line:S/G,time:t})}else{const E=Math.hypot(We,ge)/G*.6+1,Ye=g(.45,1.1,p),Qe=(Math.exp(4.2*Ye)-1)/(Math.exp(4.2)-1),Z=p>=1.1,Ge=p-1.1,Xe=Z?Math.exp(-Ge*3.4)*Math.cos(Ge*8.5):U.in(g(.85,1.1,p));b.hideGlass(!Z),b.set({center:[$,N],unit:G,ball:[.09,0],sphere:1,radius:Z?0:E*Qe,far:E,puff:0,alpha:1,veil:Z?0:1,draw:1-g(.75,1,p),guides:1-U.inOut(g(0,.45,p)),line:S/G,warp:1-g(.7,1,p),screen:q?0:Xe*(1-g(1.9,2.15,p)),time:t})}}},hud(){const l=t=>(t<0?"−":"+")+Math.abs(t).toFixed(3);return e.emit("quat",[le,ue,ce,pe]),{qx:l(le),qy:l(ue),qz:l(ce),qw:l(pe)}},dispose(){P.dispose(),a.texture.dispose(),v.texture.dispose(),b.dispose()}}};export{Ta as default};
