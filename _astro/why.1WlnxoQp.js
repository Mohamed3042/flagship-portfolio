import{S as Ce,P as _e,G as ye,b as ie,s as ee,V as v,a6 as Oe,M as oe,a as te,_ as Me,o as L,r as n,J as ke,ab as be,p as Le}from"./EditionWorld.astro_astro_type_script_index_0_lang.CO9kuGXq.js";import{a as Pe,L as Ve,b as He}from"./LineSegments2.DbmrU1-f.js";import{p as Ge,a as Ee}from"./_lineart.DV7zweF3.js";import{g as Ke,s as Ne}from"./lens.C3ivOUU2.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.CkYm9YKi.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function We(){try{const t=JSON.parse(document.querySelector("script[data-why-film]")?.textContent||"null");return t&&typeof t.href=="string"?t:null}catch{return null}}const ae=.5,Ae=new v(-1.938,1,0),Be=new v(-1.938,-1,0),Ie=new v(0,0,1),Fe=10,Te=30,S=.3,Ue=`
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
  vec3 foil(float h){
    h = fract(h) * 4.;
    vec3 a = vec3(1., .56, .8), b = vec3(1., .86, .5), c = vec3(.97, .95, .99), d = vec3(1., .7, .58);
    return h < 1. ? mix(a, b, smoothstep(0., 1., h)) : h < 2. ? mix(b, c, smoothstep(1., 2., h)) : h < 3. ? mix(c, d, smoothstep(2., 3., h)) : mix(d, a, smoothstep(3., 4., h));
  }
  float surf(vec2 p, float t){ vec2 w = vec2(fbm(p + vec2(t, -t * .7)), fbm(p + vec2(5.2 - t * .8, 1.3 + t))); return fbm(p * 1.2 + w * 1.7 - t * .25); }
  vec3 look(float i, vec2 q, float time, float g){
    float t = time * .07, h = surf(q, t), e = .025;
    vec2 slope = vec2(surf(q + vec2(e, 0.), t) - h, surf(q + vec2(0., e), t) - h) / e;
    vec3 nrm = normalize(vec3(-slope * .45, 1.));
    float glint = pow(max(dot(nrm, normalize(vec3(-.35, .55, .75))), 0.), 28.), steep = smoothstep(1.2, 3.5, length(slope));
    if (i < .5) {                                     // holographic chrome: banded metal carrying a foil sheen
      vec3 metal = mix(vec3(.2, .19, .2), vec3(.98), smoothstep(.25, .75, fract(h * 2.2 + .3)));
      return mix(metal, metal * foil(h * 1.7 + time * .015 + (g - .5) * .05) * 1.15, .5) + glint * .35;
    }
    if (i < 1.5) {                                    // pearl: pale nacre, foil fringes where it folds
      vec3 c = mix(vec3(.9, .88, .87), vec3(1., .99, .98), smoothstep(.35, .8, h));
      return mix(c, foil(h * 2.5 + .2 + time * .01), steep * .4 + .1) + glint * .25;
    }
    float broad = pow(max(dot(nrm, normalize(vec3(.3, .6, .74))), 0.), 9.);   // dark gloss: black liquid, white light, warm fringes
    vec3 c = vec3(.015) + mix(vec3(.96, .9, .85), foil(h * 3. + .3), .5) * steep * .55 + vec3(1.) * (broad * .8 + glint);
    return c * step(g * .25, c + .02);
  }
  vec3 liquid(vec2 q, float time, float A, float B, float m, vec2 frag){
    float g = hash(floor(frag) + floor(time * 18.));
    bool toB = m > 0. && surf(q * .5 - 1., time * .05) * .8 + hash(floor(frag * .5) + 7.3) * .2 <= m * 1.05;
    return look(toB ? B : A, q, time, g);
  }`,je=`
  uniform vec3 uTop, uBot, uAcross; uniform float uDepth;
  varying vec2 vUv; varying vec3 vN, vV;
  void main(){
    float u = position.x + .5, v = .5 - position.y;               // u: front edge 0 → back 1; v: top 0 → bottom 1
    vec3 along = normalize(uBot - uTop);
    vec3 p = mix(uTop, uBot, v) + uAcross * (.5 - u) * uDepth;
    vUv = vec2(u, v);
    vN = normalize(normalMatrix * cross(along, uAcross));
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vV = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`,$e=`
  uniform float uTime, uFill, uLiquid, uLookA, uLookB, uLookMix; uniform vec2 uRes;
  varying vec2 vUv; varying vec3 vN, vV;
  ${Ue}
  void main(){
    if (vUv.y > uFill + (hash(floor(gl_FragCoord.xy * .5)) - .5) * .02) discard;   // it is drawn from the top
    vec3 n = normalize(vN), e = normalize(-vV);
    float facing = abs(dot(n, e));
    vec3 holo = foil(facing * 1.2 + vUv.y * .7 + vUv.x * .2 + uTime * .03 + (gl_FrontFacing ? 0. : .5));
    holo *= .62 + .38 * smoothstep(.05, .6, facing);
    holo += pow(max(dot(reflect(-e, n), normalize(vec3(-.3, .6, .75))), 0.), 24.) * .55;
    vec3 col = holo;
    if (uLiquid > 0.) {
      vec2 sp = (gl_FragCoord.xy / uRes - .5) * vec2(uRes.x / uRes.y, 1.);
      col = mix(holo, liquid(sp * 1.6 + 2., uTime, uLookA, uLookB, uLookMix, gl_FragCoord.xy), uLiquid);
    }
    gl_FragColor = vec4(col, 1.);
  }`;function Je(){return new ie({transparent:!0,uniforms:{uMap:{value:null},uHas:{value:0},uRadius:{value:.045},uAspect:{value:16/9},uDim:{value:0},uOpacity:{value:1},uTime:{value:0},uBevel:{value:.04},uGain:{value:1},uKnee:{value:0},uMid:{value:.5},uFoil:{value:0},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uHas, uRadius, uAspect, uDim, uOpacity, uTime, uBevel, uGain, uKnee, uMid, uFoil, uLookA, uLookB, uLookMix;
      varying vec2 vUv;
      ${Ue}
      float box(vec2 uv){ vec2 q = abs((uv - .5) * vec2(uAspect, 1.)) - vec2(uAspect, 1.) * .5 + uRadius; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRadius; }
      vec3 film(float t){ return .55 + .45 * cos(6.28318 * (vec3(0., .33, .67) + t)); }
      void main(){
        float d = box(vUv), aa = fwidth(d), inside = smoothstep(aa, -aa, d);
        vec2 off = vec2(0.), pull = vec2(0.);
        float k = clamp(1. + d / uBevel, 0., 1.);
        vec2 e = vec2(.002, 0.), g = vec2(box(vUv + e.xy) - box(vUv - e.xy), box(vUv + e.yx) - box(vUv - e.yx));
        g /= max(length(g), 1e-5);
        float along = dot((vUv - .5) * vec2(uAspect, 1.), vec2(-g.y, g.x));
        if (k > 0.) {
          float ripple = sin(along * 9. + uTime * 1.3) * .6 + sin(along * 23. - uTime * 2.1) * .4;
          pull = g / vec2(uAspect, 1.) * uBevel * k * (.9 + .04 * ripple);
          off = g / vec2(uAspect, 1.) * uBevel * .28 * k;
        }
        vec3 col = vec3(.05);
        if (uHas > .5) col = vec3(texture2D(uMap, vUv - pull + off).r, texture2D(uMap, vUv - pull).g, texture2D(uMap, vUv - pull - off).b);
        vec3 toned = (col - uMid) * (1. + .25 * uKnee) + uMid;
        col = mix(col, toned, uKnee) * uGain;
        if (uFoil > 0.) col = mix(col, liquid(((vUv - pull) - .5) * vec2(uAspect, 1.) * 1.7 + 2., uTime, uLookA, uLookB, uLookMix, gl_FragCoord.xy), uFoil);
        col = mix(col, col * .28, uDim);
        if (k > 0.) {
          float lit = .35 + .65 * max(dot(g, normalize(vec2(-.35, 1.))), 0.);
          col *= 1. + .45 * k * k * (1. - .7 * uKnee);
          col += film(k * 1.3 + along * .5 + uTime * .04) * k * k * .2 * (1. - .7 * uKnee);
          col += vec3(1., .98, .95) * smoothstep(.62, .82, k) * smoothstep(.98, .82, k) * lit * .7 * (1. - .7 * uKnee);
        }
        float lip = exp(-pow((1. + d / uBevel) * 8., 2.));
        col *= 1. - .35 * lip;
        col += vec3(.95, .92, .88) * smoothstep(aa * 2., 0., abs(d + .004)) * .35 * (1. - .7 * uKnee);
        gl_FragColor = vec4(col, inside * uOpacity);
      }`})}const to=t=>{const se=t.lang==="ar",H=se?-1:1,G=matchMedia("(prefers-reduced-motion: reduce)").matches,R=new Ce,p=new _e(Te,t.viewport.aspect,.05,200),E=Ge({base:"#e9e6e0",mark:"#a49b8e",cell:104});R.add(E);const c=new ye;R.add(c);const le=new Pe().setPositions(Ee(ae)),K=new Ve({color:16777215,linewidth:1.7,transparent:!0,opacity:.96});c.add(new He(le,K));const N=new ie({side:Oe,uniforms:{uTop:{value:Ae},uBot:{value:Be},uAcross:{value:Ie},uDepth:{value:ae},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uRes:{value:new ee(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:je,fragmentShader:$e}),W=new oe(new te(1,1,1,96),N);W.frustumCulled=!1,c.add(W);const D=N.uniforms,s=We(),m=new ye;R.add(m);const a=Je(),A=new oe(new te(1,9/16),a),B=new oe(new te(1,9/16),new ie({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * vec2(1.16, 1.3); float d = length(max(abs(q) - vec2(.36, .3), 0.)); gl_FragColor = vec4(vec3(.16, .12, .09), .34 * exp(-d * d * 220.)); }"}));B.position.set(0,-.035,-.02),B.scale.setScalar(1.12),m.add(B,A),m.visible=!1;const f=s?.poster&&(s.loop||s.watch)?t.media.screen(s.loop||s.watch,s.poster):null;let O=null;!f&&s?.poster&&t.textures.image(s.poster).then(e=>{O=e}).catch(()=>{});let z=0,I=0,w=-1,re=!1;const j={pos:new v,look:new v},$={pos:new v,look:new v},ue=e=>{c.visible=e===0,m.visible=e===1;const o=e?$:j;p.position.copy(o.pos),p.lookAt(o.look),p.updateMatrixWorld()},x=Ke(R,p,[],e=>ue(e?I:z));x.warm(t.renderer);const J=2.6,ne=1,P=[0,2,1];let y=-1,F=0;const C=new v,ce=new v,ve=new v,qe=Ae.clone().add(Be).multiplyScalar(.5);let d=!1,Q=19,pe=1.4,T=0,U=0,q=1,me=0,fe=0,X=0,de=-1;const he=()=>document.querySelector(".wo-why-col"),Se=(e,o)=>{const i=e*.96*9/16,l=i+40+(X||300),r=76,M=o-64;return Math.round(Math.max(r+8,r+(M-r-l)/2))};function Y(){d=t.viewport.portrait;const e=t.viewport,o=Math.tan(Le.degToRad(Te/2));p.aspect=e.aspect,p.updateProjectionMatrix(),Q=3.87/(d?.82:.4)/(2*o*e.aspect),pe=ae/(2*o*e.aspect)*.8;const i=E.material.uniforms;i.uRes.value.set(e.width*e.dpr,e.height*e.dpr),i.uCell.value=104*e.dpr,K.resolution.set(e.width,e.height),D.uRes.value.set(e.width*e.dpr,e.height*e.dpr),c.position.set(d?.15:.55*H,d?1.9:0,0),c.updateMatrixWorld();const l=e.width,r=e.height,M=2*Fe*o/r;let h,_,g;if(d){h=l*.96,_=l/2;const k=Se(l,r);g=k+h*9/32,he()?.closest(".wo-why")?.style.setProperty("--why-top",`${k}px`)}else{h=Math.min(l*.64,r*1.28);const k=Math.max(28,l*.025);_=se?k+h/2:l-k-h/2,g=r*.47}q=h*M,me=(_-l/2)*M,fe=(r/2-g)*M,A.scale.setScalar(q),B.scale.set(q*1.12,q*1.12,1),B.position.set(0,-.035*q,-.02),a.uniforms.uAspect.value=16/9}return Y(),{scene:R,camera:p,light:!0,resize:Y,update({p:e,t:o,dt:i,active:l}){if(d&&o-de>.5){de=o;const u=he()?.offsetHeight??0;u>0&&Math.abs(u-X)>2&&(X=u,Y())}D.uFill.value=(.45+.55*L.out(n(0,.03,e)))*1.03,D.uLiquid.value=n(.015,.06,e),D.uTime.value=o,a.uniforms.uTime.value=o,!G&&e>.06?(y<0&&(y=o,F=0),o-y>J+ne&&(F=(F+1)%P.length,y=o)):(y=-1,F=0);const r=P[F],M=P[(F+1)%P.length],h=y<0?0:n(J,J+ne,o-y);for(const u of[D,a.uniforms])u.uLookA.value=r,u.uLookB.value=M,u.uLookMix.value=h;T=ke(T,t.pointer.inside&&!d?t.pointer.x:0,2.5,i),U=ke(U,t.pointer.inside&&!d?t.pointer.y:0,2.5,i);const _=.6+.14*L.out(n(0,.05,e))+(Math.PI/2-.74)*L.out(n(0,.1,e)),g=L.out(n(0,.115,e));c.rotation.set((U*.05-.06)*(1-g),T*.08*(1-g)+_,0),c.updateMatrixWorld(),ce.set(0,0,0).applyMatrix4(c.matrixWorld),ve.copy(qe).applyMatrix4(c.matrixWorld),C.lerpVectors(ce,ve,L.out(n(0,.1,e)));const k=Q*Math.pow(pe/Q,g)*Le.lerp(1,.8,n(.28,.34,e));j.pos.set(C.x,C.y+.1*Math.sin(Math.PI*g),C.z+k),j.look.copy(C);const Re=G?0:1,De=L.out(n(S,S+.08,e)),ze=L.in(n(.9,1,e));$.pos.set(T*.5,U*.3,Fe*(1.02-.04*n(S,1,e)*Re)-ze*2.2),$.look.set(T*.12,U*.08,0),m.position.set(me,fe,0),m.rotation.set(-U*.03,T*.05*H,0),A.scale.setScalar(q*(.94+.06*De));const ge=l&&e>S-.06;f?(f.want(ge),ge&&e>=S?f.play():f.pause(),a.uniforms.uMap.value=f.texture,a.uniforms.uHas.value=1,be(a,f.luma),a.uniforms.uFoil.value=0):O?(a.uniforms.uMap.value=O,a.uniforms.uHas.value=1,be(a,O.userData.luma??.5),a.uniforms.uFoil.value=0):a.uniforms.uFoil.value=1;const Z=e>=S?1:0;G||!re?(z=Z,re=!0):w<0&&Z!==z&&(w=0,I=Z);const b=w<0?null:Ne(w);if(b?.passed&&(z=I),b&&(w=w>1.7?-1:w+i),ue(z),E.material.uniforms.uShift.value.set(e*120*H,e*40),x.mesh.visible=!!b,!b)x.resize(1,1);else{const u=Math.round(t.viewport.width*t.viewport.dpr),V=Math.round(t.viewport.height*t.viewport.dpr),we=V/6,xe=Math.hypot(u,V)/we*.6+1;x.resize(u,V),x.set({center:[u/2,V/2],unit:we,sphere:1,radius:b.passed?0:xe*b.grow,far:xe,puff:0,alpha:1,screen:b.screen,time:o})}x.capture(t.renderer)},hover(e,o){if(!m.visible||!s)return!1;const i=new Me;return i.setFromCamera(new ee(e,o),p),i.intersectObject(A,!1).length>0},pick(e,o){if(!m.visible||!s)return null;const i=new Me;return i.setFromCamera(new ee(e,o),p),i.intersectObject(A,!1).length?s.href:null},focus(e){e||f?.pause()},dispose(){le.dispose(),K.dispose(),W.geometry.dispose(),N.dispose(),A.geometry.dispose(),a.dispose(),B.geometry.dispose(),x.dispose()}}};export{to as default};
