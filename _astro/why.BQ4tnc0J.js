import{S as _e,P as Ve,G as be,b as le,s as te,V as v,a6 as He,M as ae,a as ie,_ as Le,o as L,r as u,J as Ae,ab as Be,p as Fe}from"./EditionWorld.astro_astro_type_script_index_0_lang.CBQfr0hb.js";import{a as Ge,L as Ee,b as Ie}from"./LineSegments2.DhLWPrkc.js";import{p as Ke,a as Ne}from"./_lineart.Bc9ydRz6.js";import{g as We,s as je}from"./lens.BTPBI_AT.js";import{c as $e}from"./_chapters.DityxA5G.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.CkYm9YKi.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function Je(){try{const t=JSON.parse(document.querySelector("script[data-why-film]")?.textContent||"null");return t&&typeof t.href=="string"?t:null}catch{return null}}const se=.5,Se=new v(-1.938,1,0),Te=new v(-1.938,-1,0),Qe=new v(0,0,1),Ue=10,qe=30,q=.015,Ze=[[.2,.367],[.567,.733],[.933,1.1],[1.333,1.5],[1.55,1.97],[2.067,2.233],[2.467,2.633],[2.833,3],[3.2,3.5],[3.567,3.733]],P=.012,Re=`
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
  vec3 foil(float h){
    h = fract(h) * 4.;
    vec3 a = vec3(.92, .6, .4), b = vec3(1., .86, .58), c = vec3(.98, .95, .9), d = vec3(1., .74, .46);
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
  }`,Xe=`
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
  }`,Ye=`
  uniform float uTime, uFill, uLiquid, uLookA, uLookB, uLookMix; uniform vec2 uRes;
  varying vec2 vUv; varying vec3 vN, vV;
  ${Re}
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
  }`;function eo(){return new le({transparent:!0,uniforms:{uMap:{value:null},uHas:{value:0},uRadius:{value:.045},uAspect:{value:16/9},uDim:{value:0},uOpacity:{value:1},uTime:{value:0},uBevel:{value:.04},uGain:{value:1},uKnee:{value:0},uMid:{value:.5},uFoil:{value:0},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uHas, uRadius, uAspect, uDim, uOpacity, uTime, uBevel, uGain, uKnee, uMid, uFoil, uLookA, uLookB, uLookMix;
      varying vec2 vUv;
      ${Re}
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
      }`})}const no=t=>{const re=t.lang==="ar",G=re?-1:1,E=matchMedia("(prefers-reduced-motion: reduce)").matches,R=new _e,p=new Ve(qe,t.viewport.aspect,.05,200),I=Ke({base:"#e9e6e0",mark:"#a49b8e",cell:104});R.add(I);const c=new be;R.add(c);const ne=new Ge().setPositions(Ne(se)),K=new Ee({color:16777215,linewidth:1.7,transparent:!0,opacity:.96});c.add(new Ie(ne,K));const N=new le({side:He,uniforms:{uTop:{value:Se},uBot:{value:Te},uAcross:{value:Qe},uDepth:{value:se},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uRes:{value:new te(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:Xe,fragmentShader:Ye}),W=new ae(new ie(1,1,1,96),N);W.frustumCulled=!1,c.add(W);const D=N.uniforms,s=Je(),m=new be;R.add(m);const a=eo(),A=new ae(new ie(1,9/16),a),B=new ae(new ie(1,9/16),new le({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * vec2(1.16, 1.3); float d = length(max(abs(q) - vec2(.36, .3), 0.)); gl_FragColor = vec4(vec3(.16, .12, .09), .34 * exp(-d * d * 220.)); }"}));B.position.set(0,-.035,-.02),B.scale.setScalar(1.12),m.add(B,A),m.visible=!1;const j=s?.poster&&(s.loop||s.watch)?t.media.screen(s.loop||s.watch,s.poster):null,ue=j&&/why-night/.test(s?.loop||"")?$e([],{base:j,skip:Ze,big:!0}):null,f=ue??j;let _=null;!f&&s?.poster&&t.textures.image(s.poster).then(e=>{_=e}).catch(()=>{});let C=0,$=0,w=-1,ce=!1;const J={pos:new v,look:new v},Q={pos:new v,look:new v},ve=e=>{c.visible=e===0,m.visible=e===1;const o=e?Q:J;p.position.copy(o.pos),p.lookAt(o.look),p.updateMatrixWorld()},x=We(R,p,[],e=>ve(e?$:C));x.warm(t.renderer);const Z=2.6,pe=1,V=[0,2,1];let y=-1,F=0;const z=new v,me=new v,fe=new v,De=Se.clone().add(Te).multiplyScalar(.5);let d=!1,X=19,de=1.4,S=0,T=0,U=1,he=0,ge=0,Y=0,we=-1;const xe=()=>document.querySelector(".wo-why-col"),Ce=(e,o)=>{const i=e*.96*9/16,l=i+40+(Y||300),r=76,M=o-64;return Math.round(Math.max(r+8,r+(M-r-l)/2))};function ee(){d=t.viewport.portrait;const e=t.viewport,o=Math.tan(Fe.degToRad(qe/2));p.aspect=e.aspect,p.updateProjectionMatrix(),X=3.87/(d?.82:.4)/(2*o*e.aspect),de=se/(2*o*e.aspect)*.8;const i=I.material.uniforms;i.uRes.value.set(e.width*e.dpr,e.height*e.dpr),i.uCell.value=104*e.dpr,K.resolution.set(e.width,e.height),D.uRes.value.set(e.width*e.dpr,e.height*e.dpr),c.position.set(d?.15:.55*G,d?1.9:0,0),c.updateMatrixWorld();const l=e.width,r=e.height,M=2*Ue*o/r;let h,O,g;if(d){h=l*.96,O=l/2;const k=Ce(l,r);g=k+h*9/32,xe()?.closest(".wo-why")?.style.setProperty("--why-top",`${k}px`)}else{h=Math.min(l*.64,r*1.28);const k=Math.max(28,l*.025);O=re?k+h/2:l-k-h/2,g=r*.47}U=h*M,he=(O-l/2)*M,ge=(r/2-g)*M,A.scale.setScalar(U),B.scale.set(U*1.12,U*1.12,1),B.position.set(0,-.035*U,-.02),a.uniforms.uAspect.value=16/9}return ee(),{scene:R,camera:p,light:!0,resize:ee,update({p:e,t:o,dt:i,active:l}){if(d&&o-we>.5){we=o;const n=xe()?.offsetHeight??0;n>0&&Math.abs(n-Y)>2&&(Y=n,ee())}D.uFill.value=(.45+.55*L.out(u(0,.02,e)))*1.03,D.uLiquid.value=u(.01,.03,e),D.uTime.value=o,a.uniforms.uTime.value=o,!E&&e>.03?(y<0&&(y=o,F=0),o-y>Z+pe&&(F=(F+1)%V.length,y=o)):(y=-1,F=0);const r=V[F],M=V[(F+1)%V.length],h=y<0?0:u(Z,Z+pe,o-y);for(const n of[D,a.uniforms])n.uLookA.value=r,n.uLookB.value=M,n.uLookMix.value=h;S=Ae(S,t.pointer.inside&&!d?t.pointer.x:0,2.5,i),T=Ae(T,t.pointer.inside&&!d?t.pointer.y:0,2.5,i);const O=.6+.14*L.out(u(0,P*.45,e))+(Math.PI/2-.74)*L.out(u(0,P*.87,e)),g=L.out(u(0,P,e));c.rotation.set((T*.05-.06)*(1-g),S*.08*(1-g)+O,0),c.updateMatrixWorld(),me.set(0,0,0).applyMatrix4(c.matrixWorld),fe.copy(De).applyMatrix4(c.matrixWorld),z.lerpVectors(me,fe,L.out(u(0,P*.87,e)));const k=X*Math.pow(de/X,g)*Fe.lerp(1,.8,u(P,q,e));J.pos.set(z.x,z.y+.1*Math.sin(Math.PI*g),z.z+k),J.look.copy(z);const ze=E?0:1,Oe=L.out(u(q,q+.08,e)),Pe=L.in(u(.9,1,e));Q.pos.set(S*.5,T*.3,Ue*(1.02-.04*u(q,1,e)*ze)-Pe*2.2),Q.look.set(S*.12,T*.08,0),m.position.set(he,ge,0),m.rotation.set(-T*.03,S*.05*G,0),A.scale.setScalar(U*(.94+.06*Oe));const ye=l;f?(f.want(ye),ye&&e>=q?f.play():f.pause(),ue?.frame(o),a.uniforms.uMap.value=f.texture,a.uniforms.uHas.value=1,Be(a,f.luma),a.uniforms.uFoil.value=0):_?(a.uniforms.uMap.value=_,a.uniforms.uHas.value=1,Be(a,_.userData.luma??.5),a.uniforms.uFoil.value=0):a.uniforms.uFoil.value=1;const oe=e>=q?1:0;E||!ce?(C=oe,ce=!0):w<0&&oe!==C&&(w=0,$=oe);const b=w<0?null:je(w);if(b?.passed&&(C=$),b&&(w=w>1.7?-1:w+i),ve(C),I.material.uniforms.uShift.value.set(e*120*G,e*40),x.mesh.visible=!!b,!b)x.resize(1,1);else{const n=Math.round(t.viewport.width*t.viewport.dpr),H=Math.round(t.viewport.height*t.viewport.dpr),Me=H/6,ke=Math.hypot(n,H)/Me*.6+1;x.resize(n,H),x.set({center:[n/2,H/2],unit:Me,sphere:1,radius:b.passed?0:ke*b.grow,far:ke,puff:0,alpha:1,screen:b.screen,time:o})}x.capture(t.renderer)},hover(e,o){if(!m.visible||!s)return!1;const i=new Le;return i.setFromCamera(new te(e,o),p),i.intersectObject(A,!1).length>0},pick(e,o){if(!m.visible||!s)return null;const i=new Le;return i.setFromCamera(new te(e,o),p),i.intersectObject(A,!1).length?s.href:null},focus(e){e||f?.pause()},dispose(){ne.dispose(),K.dispose(),W.geometry.dispose(),N.dispose(),A.geometry.dispose(),a.dispose(),B.geometry.dispose(),x.dispose()}}};export{no as default};
