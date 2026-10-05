import{W as He,H as Pe,S as Ge,V as de,C as Q,a as je,M as X,P as me,b as Ie,c as Ce,D as Le,d as Ye,R as Qe,L as Xe,e as $e,f as Ne,g as Ze,h as Je,l as ea,i as Ue,j as aa,m as ta,G as ia,k as sa,n as oa,E as na,o as ra,p as he,q as la,r as ua,Q as Y,s as ca,t as d,u as k,v as We}from"./WorldChrome.astro_astro_type_script_index_0_lang.diVCe7cR.js";import"./preload-helper.DArFJGja.js";const M=[-3.1,-2.15,3.1,2.15];function pa(e=448){const h=Math.round(e*(M[3]-M[1])/(M[2]-M[0])),C=Ie.map(t=>t.map(([u,f])=>[u-Ce.width/2,f-Ce.height/2])),n=new Float32Array(e*h);for(let t=0;t<h;t++)for(let u=0;u<e;u++){const f=M[0]+(u+.5)/e*(M[2]-M[0]),x=M[1]+(t+.5)/h*(M[3]-M[1]);let w=1/0,T=!1;for(const R of C){let S=!1;for(let c=0,P=R.length-1;c<R.length;P=c++){const[p,y]=R[P],[G,L]=R[c],U=G-p,A=L-y,q=Math.max(0,Math.min(1,((f-p)*U+(x-y)*A)/(U*U+A*A)));w=Math.min(w,(f-p-U*q)**2+(x-y-A*q)**2),y>x!=L>x&&f<p+(x-y)/(L-y)*U&&(S=!S)}T||=S}n[t*e+u]=(T?-1:1)*Math.sqrt(w)}const v=n.slice(),B=new Float32Array(e*h),l=10,a=2*l+1,i=(t,u,f,x,w)=>{for(let T=0;T<x;T++){const R=c=>t[w(T,Math.min(f-1,Math.max(0,c)))];let S=0;for(let c=-l;c<=l;c++)S+=R(c);for(let c=0;c<f;c++)u[w(T,c)]=S/a,S+=R(c+l+1)-R(c-l)}};for(let t=0;t<3;t++)i(v,B,e,h,(u,f)=>u*e+f),i(B,v,h,e,(u,f)=>f*e+u);const g=new Uint16Array(e*h*2);for(let t=0;t<e*h;t++)g[t*2]=Le.toHalfFloat(n[t]),g[t*2+1]=Le.toHalfFloat(v[t]);const m=new Ye(g,e,h,Qe,Pe);return m.minFilter=m.magFilter=Xe,m.needsUpdate=!0,m}const fa=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp;
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
  void main(){
    vec2 p = (gl_FragCoord.xy - uCenter) / uUnit;               // mark units, y up
    // liquid: the glass ripples as it fills and pulses, its edges and everything seen through it wavering
    p += uWobble * vec2(sin(p.y * 4.3 + uTime * 5.1) + .5 * sin(p.y * 9.1 - uTime * 7.3), cos(p.x * 3.7 - uTime * 4.4) + .5 * cos(p.x * 8.3 + uTime * 6.1)) * .045;
    float d = shape(p), px = 1. / uUnit;
    if (d > px * 1.5) {
      // round the glass: the black with the construction on it, the lines bulging away from the ball, which glows
      vec2 v = p - uBall; float r2 = dot(v, v), R2 = uRadius * uRadius;
      vec3 C = (uDraw + uGuides > 0. ? drawing(uBall + v * (1. - uWarp * .5 * R2 / (r2 + R2 + 1e-4))) : vec3(0.))
        + vec3(.8, .78, 1.) * uSphere * uWarp * exp(-d / (.08 + uRadius * .3)) * .45;
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
    // the ball is a crystal ball: what is behind it turned over, rushing out at its rim (the pillow bends it gently)
    vec2 b = (p - uBall) / max(uRadius, 1e-3); float bb = min(dot(b, b), .992);
    for (int i = 0; i < 3; i++) {
      vec3 r = refract(v, n, 1. / (1.5 + (float(i) - 1.) * .018));
      vec2 q = mix(p + r.xy * (h * 2.8 + .3) / (1. + uPuff), uBall - b * uRadius * (.55 + .8 / sqrt(1. - bb)) * (1. + (float(i) - 1.) * .05), uSphere);
      col[i] = texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (uDraw + uGuides > 0. ? drawing(q)[i] : 0.);
    }
    col *= mix(vec3(1.), uTint, clamp(h * 1.6, 0., .8));          // violet where the glass is deep
    float fres = .04 + .96 * pow(1. - n.z, 5.);
    vec3 refl = mix(vec3(.04, .035, .1), vec3(.8, .78, 1.05), smoothstep(-.4, .9, n.y));
    col = mix(col, refl, fres * .55);
    col += vec3(1., .98, 1.05) * pow(max(dot(reflect(v, n), normalize(vec3(-.35, .55, .75))), 0.), 70.) * .9;
    float a = smoothstep(px * 1.2, -px * .8, d) * uAlpha;
    float A = a + (1. - a) * uVeil;                               // the glass over the black veil (straight alpha)
    gl_FragColor = vec4(col * a / max(A, 1e-4), A);
  }`;function da(e,h,C){const n=new He(1,1,{type:Pe}),v=pa(),B=new Ge({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:n.texture},uField:{value:v},uBox:{value:new je(...M)},uRes:{value:new de(1,1)},uCenter:{value:new de},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new Q("#8f7dff")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new de},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:fa}),l=new X(new me(2,2),B);l.frustumCulled=!1,l.renderOrder=1e3,l.visible=!1,l.onBeforeRender=i=>{const g=i.getRenderTarget(),m=C.map(t=>t.visible);l.visible=!1,C.forEach(t=>{t.visible=!1}),i.setRenderTarget(n),i.clear(),i.render(e,h),i.setRenderTarget(g),C.forEach((t,u)=>{t.visible=m[u]}),l.visible=!0},e.add(l);const a=B.uniforms;return{mesh:l,resize(i,g){n.setSize(i,g),a.uRes.value.set(i,g)},set(i){a.uCenter.value.set(i.center[0],i.center[1]),a.uUnit.value=i.unit,a.uSphere.value=i.sphere,a.uRadius.value=i.radius,a.uPuff.value=i.puff,a.uAlpha.value=i.alpha,a.uTime.value=i.time,a.uVeil.value=i.veil??0,a.uWobble.value=i.wobble??0,a.uBall.value.set(...i.ball??[0,0]),a.uDraw.value=i.draw??0,a.uGuides.value=i.guides??0,a.uLine.value=i.line??.005,a.uWarp.value=i.warp??0},dispose(){n.dispose(),v.dispose(),B.dispose(),l.geometry.dispose()}}}let ve=!1;const ma=async e=>{const h=e.lang==="ar",C=matchMedia("(prefers-reduced-motion: reduce)").matches,n=new $e;n.environment=e.env;const v=new Ne(32,e.viewport.aspect,.1,220);n.add(Ze({base:"#040406",line:"#7d838c",accent:"#5b3cff",fade:.05,floorY:-3.2}));const B=Je(e.quality?700:300,[36,14,30],"#d9d4ff",2);n.add(B);const l=ea({radius:18,arc:2.1,height:13,rows:10});l.position.set(0,1.1,11),n.add(l);const a=l.material.uniforms,i=a.uWall.value;await Promise.allSettled([document.fonts.load('700 300px "Space Grotesk Variable"'),document.fonts.load('800 300px "Cairo Variable"')]);const g=Ue(h?["محمد محمود"]:["MOHAMED","MAHMOUD"],{font:h?'800 330px "Cairo Variable", sans-serif':'700 380px "Space Grotesk Variable", sans-serif',lineHeight:h?1.1:.84,rtl:h}),m=new X(new me(1,1/g.aspect),new aa({map:g.texture,alphaTest:.45,color:"#eaf5ef",toneMapped:!1}));m.position.set(0,.15,-2.4),n.add(m);const t=[{pat:1,hold:6,tint:"#5b3cff"},{pat:2,hold:4,tint:null},{pat:1,hold:5,tint:"#2f6bff"},{pat:1,hold:5,tint:"#d9a777"},{pat:2,hold:4,tint:null},{pat:1,hold:5,tint:"#b8bec8"},{pat:1,hold:5,tint:"#3d2bd9"}],u=(r,s)=>{a["uPat"+r].value=s.pat,a["uAsp"+r].value=i};let f=0,x=-1,w=-1;u("A",t[0]),u("B",t[0]);const T=new Q("#5b3cff"),R=new Q,S=new Q("#ffffff"),c=Ue(["MK"],{font:'700 900px "Space Grotesk Variable", sans-serif',width:2048});a.uLetters.value=c.texture,a.uLetterAsp.value=c.aspect,a.uLetterAmt.value=1,a.uLetterGlow.value=.4;const P=ta(.62),p=new ia,y=new X(P,sa(e,"#e6dcff",{thickness:1.8,dispersion:11})),G=new oa(new na(P,28),new ra({color:"#ffffff",transparent:!0,opacity:.1}));p.add(y,G),p.position.set(0,.05,.9),n.add(p);const L=da(n,v,[y,G]),U=new URLSearchParams(location.search).has("intro")?Number(new URLSearchParams(location.search).get("intro")):null,A=new he,q=new X(new me(18,18),new Ge({toneMapped:!1,uniforms:{uK:{value:0},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
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
      }`}));q.position.set(0,0,-1.1),q.visible=!1,n.add(q);const ge=q.material.uniforms,xe=new la("#ffffff",2.4);xe.position.set(4,6,6),n.add(xe);const $=new ua("#7b5cff",30,18,1.6);$.position.set(-3,-1.5,2.5),n.add($);const z=new Y,we=new Y,E=new Y,ye=new ca,ze=new he(1,0,0),De=new he(0,1,0),H=new Y;let j=!1,W=-1,be=1,N=0,Z=0,D=-1,Me=!1,Te="";addEventListener("world:reset",()=>{j=!0});let J=11;function Re(){const r=e.viewport,s=V=>2*(11-V)*Math.tan(We.degToRad(v.fov/2))*r.aspect;J=Math.min(s(m.position.z)*(r.portrait?.94:.86),12.5),m.scale.set(J,J,1),be=Math.min(1.4,s(p.position.z)*(r.portrait?.92:.52)/3.87),N=r.portrait?.2:.38,L.resize(Math.round(r.width*r.dpr),Math.round(r.height*r.dpr))}Re();let ee=0,ae=0,te=0,ie=1;return{scene:n,camera:v,resize:Re,focus(r){r&&W<0&&(W=performance.now()/1e3)},update({p:r,t:s,dt:V,active:Ve}){W<0&&(W=s);const _=k.out(d(0,1.8,s-W)),b=k.inOut(d(.4,1,r)),Ae=e.pointer.inside?e.pointer.x:0,Be=e.pointer.inside?e.pointer.y:0;v.position.set(Ae*.35*(1-b),.35+Be*.2*(1-b),12.6-_*1.6),v.lookAt(0,.05,0),Ve&&e.pointer.down&&!j&&(H.setFromAxisAngle(De,e.pointer.dragX*3.2),z.premultiply(H),H.setFromAxisAngle(ze,-e.pointer.dragY*2.6),z.premultiply(H)),j&&(z.slerp(E.identity(),1-Math.exp(-6*V)),z.angleTo(E)<.002&&(z.identity(),j=!1));const se=window.__worldIntro??U,o=C?9:se!==null?se:D<0?-1:s-D,oe=o<0?1:d(1.5,3,o);ye.set((Math.sin(s*.37)*.1+Be*.12)*oe*(1-b*.6),(Math.sin(s*.23)*.38+Ae*.22)*oe*(1-b*.6),Math.sin(s*.19)*.03*oe),we.setFromEuler(ye),E.copy(we).multiply(z),p.quaternion.slerp(E,1-Math.exp(-8*V));const _e=be*(.82+.18*_)*(1+b*.15);p.scale.setScalar(_e),p.position.y=N*(1-b)+.05+Math.sin(s*.9)*.06*(o<0?0:d(1.6,2.6,o)),Z=V<.045&&s-W>.6?Z+1:0,!ve&&Z>=20&&s-W>2.4&&performance.now()>=(window.__mkDrawnAt??0)&&(ve=!0,D=s,e.emit("surge",null));const K=C?1:D<0?0:d(.1,1.9,s-D),ne=Math.max(0,1-K)*Math.min(1,K*8);q.visible=K>0&&K<1,q.position.y=p.position.y,ge.uK.value=k.out(K),ge.uTime.value=s,$.intensity=30+Math.sin(s*1.3)*6+ne*260,G.material.opacity=.18+.2*(1-b)*_+ne*.6,x<0&&(x=s);const re=(f+1)%t.length;if(w<0&&t.length>1&&s-x>t[f].hold&&(w=s,u("B",t[re]),a.uTintB.value.set(t[re].tint??"#"+a.uTint.value.getHexString())),w>=0){const F=d(0,1.3,s-w);a.uMix.value=k.inOut(F),F>=1&&(f=re,u("A",t[f]),a.uTint.value.copy(a.uTintB.value),a.uMix.value=0,w=-1,x=s)}T.lerp(R.copy(a.uMix.value>.5?a.uTintB.value:a.uTint.value),1-Math.exp(-V*1.5)),y.material.attenuationColor.copy(T).lerp(S,.45),m.position.y=N+.15+b*.9,m.material.color.setScalar(_*(1-b)),m.visible=b<.99,a.uTime.value=s,a.uLevel.value=(.13+.05*_)*(1+b*.1),a.uFlash.value=ne*.9,B.material.uniforms.uTime.value=s,{x:ee,y:ae,z:te,w:ie}=p.quaternion;const le=o>=0&&o<1.85;L.mesh.visible=le,y.visible=G.visible=!le||o>1.5;const ue=se!==null||D>=0?o<1.85:!ve;if(ue!==Me&&(Me=ue,e.emit("intro",ue)),le||o<0){v.updateMatrixWorld(),p.updateMatrixWorld();const F=e.viewport.dpr,Se=e.viewport.width*F,ce=e.viewport.height*F;A.copy(p.position).project(v);const pe=(A.x*.5+.5)*Se,fe=(A.y*.5+.5)*ce;A.copy(p.position).applyMatrix4(v.matrixWorldInverse);const O=ce/2/(-A.z*Math.tan(We.degToRad(v.fov/2)))*p.scale.x;if(o<0){const I=`${Math.round(pe)},${Math.round(fe)},${Math.round(O)}`;I!==Te&&(Te=I,e.emit("markrect",{x:pe/F,y:e.viewport.height-fe/F,unit:O/F}))}else{const I=Math.hypot(Se,ce)/O*.6+1,qe=k.out(d(.35,.47,o)),Ke=Math.sin(Math.max(0,o-.35)*26)*Math.exp(-Math.max(0,o-.35)*6)*.22,Fe=k.in(d(.6,.92,o)),Oe=k.inOut(d(.85,1.1,o)),Ee=k.inOut(d(1.05,1.6,o)),ke=.5*qe*(1+Ke);L.set({center:[pe,fe],unit:O,ball:[.09,0],sphere:1-Oe,radius:ke+(I-ke)*Fe,puff:1.4*d(.6,.85,o)*(1-Ee),alpha:1-d(1.55,1.8,o),veil:1-d(.9,.95,o),draw:1-d(.75,1,o),guides:1-k.inOut(d(0,.35,o)),line:F/O,warp:qe*(1-Fe),wobble:d(.6,.8,o)*(1-d(1.3,1.6,o)),time:s})}}},hud(){const r=s=>(s<0?"−":"+")+Math.abs(s).toFixed(3);return e.emit("quat",[ee,ae,te,ie]),{qx:r(ee),qy:r(ae),qz:r(te),qw:r(ie)}},dispose(){P.dispose(),g.texture.dispose(),c.texture.dispose(),L.dispose()}}};export{ma as default};
