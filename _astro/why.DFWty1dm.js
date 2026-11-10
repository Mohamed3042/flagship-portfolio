import{S as Se,P as Re,G as ge,b as te,s as Y,V as u,a5 as De,M as Z,a as ee,_ as xe,o as M,r as l,J as we,ab as ye,p as Me}from"./EditionWorld.astro_astro_type_script_index_0_lang.BfGWMqYB.js";import{a as ze,L as Ce,b as _e}from"./LineSegments2.BWnucqkd.js";import{p as Oe,a as Pe}from"./_lineart.CgUCis1p.js";import{g as Ve,s as Ge}from"./lens.1i5tTHzq.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function He(){try{const o=JSON.parse(document.querySelector("script[data-why-film]")?.textContent||"null");return o&&typeof o.href=="string"?o:null}catch{return null}}const oe=.5,ke=new u(-1.938,1,0),be=new u(-1.938,-1,0),Ee=new u(0,0,1),Le=10,Ae=30,T=.3,Be=`
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
  }`,Ke=`
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
  }`,Ne=`
  uniform float uTime, uFill, uLiquid, uLookA, uLookB, uLookMix; uniform vec2 uRes;
  varying vec2 vUv; varying vec3 vN, vV;
  ${Be}
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
  }`;function We(){return new te({transparent:!0,uniforms:{uMap:{value:null},uHas:{value:0},uRadius:{value:.045},uAspect:{value:16/9},uDim:{value:0},uOpacity:{value:1},uTime:{value:0},uBevel:{value:.04},uGain:{value:1},uKnee:{value:0},uMid:{value:.5},uFoil:{value:0},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uHas, uRadius, uAspect, uDim, uOpacity, uTime, uBevel, uGain, uKnee, uMid, uFoil, uLookA, uLookB, uLookMix;
      varying vec2 vUv;
      ${Be}
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
      }`})}const Xe=o=>{const ae=o.lang==="ar",G=ae?-1:1,H=matchMedia("(prefers-reduced-motion: reduce)").matches,q=new Se,n=new Re(Ae,o.viewport.aspect,.05,200),E=Oe({base:"#e9e6e0",mark:"#a49b8e",cell:104});q.add(E);const r=new ge;q.add(r);const ie=new ze().setPositions(Pe(oe)),K=new Ce({color:16777215,linewidth:1.7,transparent:!0,opacity:.96});r.add(new _e(ie,K));const N=new te({side:De,uniforms:{uTop:{value:ke},uBot:{value:be},uAcross:{value:Ee},uDepth:{value:oe},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uRes:{value:new Y(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:Ke,fragmentShader:Ne}),W=new Z(new ee(1,1,1,96),N);W.frustumCulled=!1,r.add(W);const S=N.uniforms,s=He(),c=new ge;q.add(c);const a=We(),k=new Z(new ee(1,9/16),a),b=new Z(new ee(1,9/16),new te({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * vec2(1.16, 1.3); float d = length(max(abs(q) - vec2(.36, .3), 0.)); gl_FragColor = vec4(vec3(.16, .12, .09), .34 * exp(-d * d * 220.)); }"}));b.position.set(0,-.035,-.02),b.scale.setScalar(1.12),c.add(b,k),c.visible=!1;const v=s?.poster&&(s.loop||s.watch)?o.media.screen(s.loop||s.watch,s.poster):null;let _=null;!v&&s?.poster&&o.textures.image(s.poster).then(e=>{_=e}).catch(()=>{});let R=0,I=0,d=-1,se=!1;const j={pos:new u,look:new u},J={pos:new u,look:new u},le=e=>{r.visible=e===0,c.visible=e===1;const t=e?J:j;n.position.copy(t.pos),n.lookAt(t.look),n.updateMatrixWorld()},h=Ve(q,n,[],e=>le(e?I:R));h.warm(o.renderer);const $=2.6,re=1,O=[0,2,1];let g=-1,L=0;const D=new u,ue=new u,ne=new u,Fe=ke.clone().add(be).multiplyScalar(.5);let x=!1,Q=19,ce=1.4,A=0,B=0,F=1,ve=0,pe=0;function me(){x=o.viewport.portrait;const e=o.viewport,t=Math.tan(Me.degToRad(Ae/2));n.aspect=e.aspect,n.updateProjectionMatrix(),Q=3.87/(x?.82:.4)/(2*t*e.aspect),ce=oe/(2*t*e.aspect)*.8;const i=E.material.uniforms;i.uRes.value.set(e.width*e.dpr,e.height*e.dpr),i.uCell.value=104*e.dpr,K.resolution.set(e.width,e.height),S.uRes.value.set(e.width*e.dpr,e.height*e.dpr),r.position.set(x?.15:.55*G,x?1.9:0,0),r.updateMatrixWorld();const p=e.width,U=e.height,z=2*Le*t/U;let m,C,f;if(x)m=p*.92,C=p/2,f=112+m*9/32;else{m=Math.min(p*.64,U*1.28);const P=Math.max(28,p*.025);C=ae?P+m/2:p-P-m/2,f=U*.47}F=m*z,ve=(C-p/2)*z,pe=(U/2-f)*z,k.scale.setScalar(F),b.scale.set(F*1.12,F*1.12,1),b.position.set(0,-.035*F,-.02),a.uniforms.uAspect.value=16/9}return me(),{scene:q,camera:n,light:!0,resize:me,update({p:e,t,dt:i,active:p}){S.uFill.value=(.45+.55*M.out(l(0,.03,e)))*1.03,S.uLiquid.value=l(.015,.06,e),S.uTime.value=t,a.uniforms.uTime.value=t,!H&&e>.06?(g<0&&(g=t,L=0),t-g>$+re&&(L=(L+1)%O.length,g=t)):(g=-1,L=0);const U=O[L],z=O[(L+1)%O.length],m=g<0?0:l($,$+re,t-g);for(const y of[S,a.uniforms])y.uLookA.value=U,y.uLookB.value=z,y.uLookMix.value=m;A=we(A,o.pointer.inside&&!x?o.pointer.x:0,2.5,i),B=we(B,o.pointer.inside&&!x?o.pointer.y:0,2.5,i);const C=.6+.14*M.out(l(0,.05,e))+(Math.PI/2-.74)*M.out(l(0,.1,e)),f=M.out(l(0,.115,e));r.rotation.set((B*.05-.06)*(1-f),A*.08*(1-f)+C,0),r.updateMatrixWorld(),ue.set(0,0,0).applyMatrix4(r.matrixWorld),ne.copy(Fe).applyMatrix4(r.matrixWorld),D.lerpVectors(ue,ne,M.out(l(0,.1,e)));const P=Q*Math.pow(ce/Q,f)*Me.lerp(1,.8,l(.28,.34,e));j.pos.set(D.x,D.y+.1*Math.sin(Math.PI*f),D.z+P),j.look.copy(D);const Ue=H?0:1,Te=M.out(l(T,T+.08,e)),qe=M.in(l(.9,1,e));J.pos.set(A*.5,B*.3,Le*(1.02-.04*l(T,1,e)*Ue)-qe*2.2),J.look.set(A*.12,B*.08,0),c.position.set(ve,pe,0),c.rotation.set(-B*.03,A*.05*G,0),k.scale.setScalar(F*(.94+.06*Te));const fe=p&&e>T-.06;v?(v.want(fe),fe&&e>=T?v.play():v.pause(),a.uniforms.uMap.value=v.texture,a.uniforms.uHas.value=1,ye(a,v.luma),a.uniforms.uFoil.value=0):_?(a.uniforms.uMap.value=_,a.uniforms.uHas.value=1,ye(a,_.userData.luma??.5),a.uniforms.uFoil.value=0):a.uniforms.uFoil.value=1;const X=e>=T?1:0;H||!se?(R=X,se=!0):d<0&&X!==R&&(d=0,I=X);const w=d<0?null:Ge(d);if(w?.passed&&(R=I),w&&(d=d>1.7?-1:d+i),le(R),E.material.uniforms.uShift.value.set(e*120*G,e*40),h.mesh.visible=!!w,!w)h.resize(1,1);else{const y=Math.round(o.viewport.width*o.viewport.dpr),V=Math.round(o.viewport.height*o.viewport.dpr),de=V/6,he=Math.hypot(y,V)/de*.6+1;h.resize(y,V),h.set({center:[y/2,V/2],unit:de,sphere:1,radius:w.passed?0:he*w.grow,far:he,puff:0,alpha:1,screen:w.screen,time:t})}h.capture(o.renderer)},hover(e,t){if(!c.visible||!s)return!1;const i=new xe;return i.setFromCamera(new Y(e,t),n),i.intersectObject(k,!1).length>0},pick(e,t){if(!c.visible||!s)return null;const i=new xe;return i.setFromCamera(new Y(e,t),n),i.intersectObject(k,!1).length?s.href:null},focus(e){e||v?.pause()},dispose(){ie.dispose(),K.dispose(),W.geometry.dispose(),N.dispose(),k.geometry.dispose(),a.dispose(),b.geometry.dispose(),h.dispose()}}};export{Xe as default};
