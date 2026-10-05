import{W as Ie,H as De,S as _e,V as fe,C as ee,a as Ye,M as ae,P as xe,b as Qe,c as Ue,D as Ge,d as Xe,R as $e,L as Ne,e as Ze,f as Je,g as ea,h as aa,l as ta,i as Pe,j as sa,k as ia,m as ra,G as oa,n as la,o as na,p as ua,E as ca,q as pa,r as ge,s as ma,t as ha,Q as Z,u as va,v as b,w as V,x as We}from"./WorldChrome.astro_astro_type_script_index_0_lang.BJ9pWh04.js";import"./preload-helper.DArFJGja.js";const B=[-3.1,-2.15,3.1,2.15];function da(e=448){const d=Math.round(e*(B[3]-B[1])/(B[2]-B[0])),A=Qe.map(i=>i.map(([o,p])=>[o-Ue.width/2,p-Ue.height/2])),l=new Float32Array(e*d);for(let i=0;i<d;i++)for(let o=0;o<e;o++){const p=B[0]+(o+.5)/e*(B[2]-B[0]),g=B[1]+(i+.5)/d*(B[3]-B[1]);let x=1/0,R=!1;for(const T of A){let F=!1;for(let m=0,G=T.length-1;m<T.length;G=m++){const[h,w]=T[G],[te,k]=T[m],y=te-h,P=k-w,C=Math.max(0,Math.min(1,((p-h)*y+(g-w)*P)/(y*y+P*P)));x=Math.min(x,(p-h-y*C)**2+(g-w-P*C)**2),w>g!=k>g&&p<h+(g-w)/(k-w)*y&&(F=!F)}R||=F}l[i*e+o]=(R?-1:1)*Math.sqrt(x)}const f=l.slice(),q=new Float32Array(e*d),c=10,s=2*c+1,r=(i,o,p,g,x)=>{for(let R=0;R<g;R++){const T=m=>i[x(R,Math.min(p-1,Math.max(0,m)))];let F=0;for(let m=-c;m<=c;m++)F+=T(m);for(let m=0;m<p;m++)o[x(R,m)]=F/s,F+=T(m+c+1)-T(m-c)}};for(let i=0;i<3;i++)r(f,q,e,d,(o,p)=>o*e+p),r(q,f,d,e,(o,p)=>p*e+o);const a=new Uint16Array(e*d*2);for(let i=0;i<e*d;i++)a[i*2]=Ge.toHalfFloat(l[i]),a[i*2+1]=Ge.toHalfFloat(f[i]);const v=new Xe(a,e,d,$e,De);return v.minFilter=v.magFilter=Ne,v.needsUpdate=!0,v}const fa=`
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
  }`;function ga(e,d,A){const l=new Ie(1,1,{type:De}),f=da(),q=new _e({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:l.texture},uField:{value:f},uBox:{value:new Ye(...B)},uRes:{value:new fe(1,1)},uCenter:{value:new fe},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new ee("#d9dce3")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new fe},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0},uScreen:{value:0},uFar:{value:10}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:fa}),c=new ae(new xe(2,2),q);c.frustumCulled=!1,c.renderOrder=1e3,c.visible=!1;let s=!0;c.onBeforeRender=a=>{const v=a.getRenderTarget(),i=A.map(o=>o.visible);c.visible=!1,s&&A.forEach(o=>{o.visible=!1}),a.setRenderTarget(l),a.clear(),a.render(e,d),a.setRenderTarget(v),A.forEach((o,p)=>{o.visible=i[p]}),c.visible=!0},e.add(c);const r=q.uniforms;return{mesh:c,resize(a,v){l.setSize(a,v),r.uRes.value.set(a,v)},hideGlass(a){s=a},set(a){r.uCenter.value.set(a.center[0],a.center[1]),r.uUnit.value=a.unit,r.uSphere.value=a.sphere,r.uRadius.value=a.radius,r.uPuff.value=a.puff,r.uAlpha.value=a.alpha,r.uTime.value=a.time,r.uVeil.value=a.veil??0,r.uWobble.value=a.wobble??0,r.uBall.value.set(...a.ball??[0,0]),r.uDraw.value=a.draw??0,r.uGuides.value=a.guides??0,r.uLine.value=a.line??.005,r.uWarp.value=a.warp??0,r.uRipple.value=a.ripple??0,r.uBeat.value=a.beat??0,r.uScreen.value=a.screen??0,r.uFar.value=a.far??10},dispose(){l.dispose(),f.dispose(),q.dispose(),c.geometry.dispose()}}}let J=!1;const ya=async e=>{const d=e.lang==="ar",A=matchMedia("(prefers-reduced-motion: reduce)").matches,l=new Ze;l.environment=e.env;const f=new Je(32,e.viewport.aspect,.1,220);l.add(ea({base:"#040406",line:"#7d838c",accent:"#8a8f99",fade:.05,floorY:-3.2}));const q=aa(e.quality?700:300,[36,14,30],"#ecebe7",2);l.add(q);const c=ta({radius:18,arc:2.1,height:13,rows:10});c.position.set(0,1.1,11),l.add(c);const s=c.material.uniforms,r=s.uWall.value;await Promise.allSettled([document.fonts.load('700 300px "Space Grotesk Variable"'),document.fonts.load('800 300px "Cairo Variable"')]);const a=Pe(d?["محمد محمود"]:["MOHAMED","MAHMOUD"],{font:d?'800 330px "Cairo Variable", sans-serif':'700 380px "Space Grotesk Variable", sans-serif',lineHeight:d?1.1:.84,rtl:d}),v=new ae(new xe(1,1/a.aspect),new sa({map:a.texture,alphaTest:.45,color:"#f1f0ee",toneMapped:!1}));v.position.set(0,.15,-2.4),l.add(v);const i=ia,o=(n,t)=>{s["uPat"+n].value=t.pat,s["uAsp"+n].value=r};let p=0,g=-1,x=-1;o("A",i[0]),o("B",i[0]);const R=new ee("#8c8f97"),T=new ee,F=new ee("#ffffff"),m=Pe(["MK"],{font:'700 900px "Space Grotesk Variable", sans-serif',width:2048});s.uLetters.value=m.texture,s.uLetterAsp.value=m.aspect,s.uLetterAmt.value=1,s.uLetterGlow.value=.4;const G=ra(.34),h=new oa,w=new ae(G,la(e,"#eef0f3",{thickness:1.8,dispersion:11})),te=na(w.material),k=new ua(new ca(G,28),new pa({color:"#ffffff",transparent:!0,opacity:.18}));h.add(w,k),h.position.set(0,.05,.9),l.add(h);const y=ga(l,f,[w,k]),P=new URLSearchParams(location.search).has("intro")?Number(new URLSearchParams(location.search).get("intro")):null,C=new ge,W=new ae(new xe(18,18),new _e({toneMapped:!1,uniforms:{uK:{value:0},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
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
      }`}));W.position.set(0,0,-1.1),W.visible=!1,l.add(W);const we=W.material.uniforms,ye=new ma("#ffffff",2.4);ye.position.set(4,6,6),l.add(ye);const se=new ha("#d9b27a",30,18,1.6);se.position.set(-3,-1.5,2.5),l.add(se);const D=new Z,be=new Z,j=new Z,Me=new va,ze=new ge(1,0,0),Ve=new ge(0,1,0),I=new Z;let Y=!1,L=-1,Be=1,ie=0,Q=0,_=-1,Re=!1,Te="",Se=0;addEventListener("world:reset",()=>{Y=!0});let re=11;function Ae(){const n=e.viewport,t=z=>2*(11-z)*Math.tan(We.degToRad(f.fov/2))*n.aspect;re=Math.min(t(v.position.z)*(n.portrait?.94:.86),12.5),v.scale.set(re,re,1),Be=Math.min(1.4,t(h.position.z)*(n.portrait?.92:.52)/3.87),ie=n.portrait?.2:.38,y.resize(Math.round(n.width*n.dpr),Math.round(n.height*n.dpr))}Ae();let oe=0,le=0,ne=0,ue=1;return{scene:l,camera:f,resize:Ae,focus(n){n&&L<0&&(L=performance.now()/1e3)},update({p:n,t,dt:z,active:Ke}){L<0&&(L=t);const K=V.out(b(0,1.8,t-L)),M=V.inOut(b(.4,1,n)),qe=e.pointer.inside?e.pointer.x:0,Fe=e.pointer.inside?e.pointer.y:0;f.position.set(qe*.35*(1-M),.35+Fe*.2*(1-M),12.6-K*1.6),f.lookAt(0,.05,0),Ke&&e.pointer.down&&!Y&&(I.setFromAxisAngle(Ve,e.pointer.dragX*3.2),D.premultiply(I),I.setFromAxisAngle(ze,-e.pointer.dragY*2.6),D.premultiply(I)),Y&&(D.slerp(j.identity(),1-Math.exp(-6*z)),D.angleTo(j)<.002&&(D.identity(),Y=!1));const ce=window.__worldIntro??P;let u=A?9:ce!==null?ce:_<0?-1:t-_;const pe=u<0?1:b(1.8,3.3,u);Me.set((Math.sin(t*.37)*.08+Fe*.08)*pe*(1-M*.6),(Math.sin(t*.23)*.18+qe*.1)*pe*(1-M*.6),Math.sin(t*.19)*.03*pe),be.setFromEuler(Me),j.copy(be).multiply(D),h.quaternion.slerp(j,1-Math.exp(-8*z));const Oe=Be*(.82+.18*K)*(1+M*.15);h.scale.setScalar(Oe),h.position.y=ie*(1-M)+.05+Math.sin(t*.9)*.06*(u<0?0:b(3,4,u)),Q=z<.045&&t-L>.6?Q+1:0,!J&&(Q>=20||t-L>6)&&t-L>2.4&&performance.now()>=(window.__mkDrawnAt??0)&&(J=!0,_=t,u=0,e.emit("surge",null));const O=A?1:_<0?0:b(.1,1.9,t-_),me=Math.max(0,1-O)*Math.min(1,O*8);W.visible=O>0&&O<1,W.position.y=h.position.y,we.uK.value=V.out(O),we.uTime.value=t,se.intensity=30+Math.sin(t*1.3)*6+me*260,k.material.opacity=.18+.2*(1-M)*K+me*.6,g<0&&(g=t);const H=(p+1)%i.length;if(x<0&&i.length>1&&t-g>i[p].hold&&(x=t,o("B",i[H]),s.uTintB.value.set(i[H].tint??"#"+s.uTint.value.getHexString()),s.uTint2B.value.set(i[H].tint2??i[H].tint??"#"+s.uTint2.value.getHexString())),x>=0){const S=b(0,1.3,t-x);s.uMix.value=V.inOut(S),S>=1&&(p=H,o("A",i[p]),s.uTint.value.copy(s.uTintB.value),s.uTint2.value.copy(s.uTint2B.value),s.uMix.value=0,x=-1,g=t)}R.lerp(T.copy(s.uMix.value>.5?s.uTintB.value:s.uTint.value).lerp(s.uMix.value>.5?s.uTint2B.value:s.uTint2.value,.5),1-Math.exp(-z*1.5)),w.material.attenuationColor.copy(R).lerp(F,.45),v.position.y=ie+.15+M*.9,v.material.color.setScalar(K*(1-M)),v.visible=M<.99,s.uTime.value=t,te.value=t,s.uLevel.value=(.13+.05*K)*(1+M*.1),s.uFlash.value=me*.9,q.material.uniforms.uTime.value=t,{x:oe,y:le,z:ne,w:ue}=h.quaternion;const he=u>=0&&u<2.15,ke=u<0&&!J&&Q>4&&Se<2;ke&&Se++,y.mesh.visible=he||ke,w.visible=k.visible=!he||u>1.1;const ve=ce!==null||_>=0?u<2.15:!J;if(ve!==Re&&(Re=ve,e.emit("intro",ve)),he||u<0){f.updateMatrixWorld(),h.updateMatrixWorld();const S=e.viewport.dpr,Ce=e.viewport.width*S,de=e.viewport.height*S;C.copy(h.position).project(f);const X=(C.x*.5+.5)*Ce,$=(C.y*.5+.5)*de;C.copy(h.position).applyMatrix4(f.matrixWorldInverse);const U=de/2/(-C.z*Math.tan(We.degToRad(f.fov/2)))*h.scale.x;if(u<0){const E=`${Math.round(X)},${Math.round($)},${Math.round(U)}`;E!==Te&&(Te=E,e.emit("markrect",{x:X/S,y:e.viewport.height-$/S,unit:U/S})),y.set({center:[X,$],unit:U,ball:[.09,0],sphere:1,radius:0,puff:0,alpha:1,veil:1,draw:1,guides:1,line:S/U,time:t})}else{const E=Math.hypot(Ce,de)/U*.6+1,He=b(.45,1.1,u),Ee=(Math.exp(4.2*He)-1)/(Math.exp(4.2)-1),N=u>=1.1,Le=u-1.1,je=N?Math.exp(-Le*3.4)*Math.cos(Le*8.5):V.in(b(.85,1.1,u));y.hideGlass(!N),y.set({center:[X,$],unit:U,ball:[.09,0],sphere:1,radius:N?0:E*Ee,far:E,puff:0,alpha:1,veil:N?0:1,draw:1-b(.75,1,u),guides:1-V.inOut(b(0,.45,u)),line:S/U,warp:1-b(.7,1,u),screen:A?0:je*(1-b(1.9,2.15,u)),time:t})}}},hud(){const n=t=>(t<0?"−":"+")+Math.abs(t).toFixed(3);return e.emit("quat",[oe,le,ne,ue]),{qx:n(oe),qy:n(le),qz:n(ne),qw:n(ue)}},dispose(){G.dispose(),a.texture.dispose(),m.texture.dispose(),y.dispose()}}};export{ya as default};
