import{S as He,P as Ge,G as Fe,b as ce,s as le,V as v,J as Ke,M as re,a as ne,$ as Se,o as A,r as u,K as Te,ab as qe,p as Ue}from"./EditionWorld.astro_astro_type_script_index_0_lang.DMdfUXqr.js";import{a as Ee,L as Ie,b as Ne}from"./LineSegments2.DbhoVh7r.js";import{p as We,a as je}from"./_lineart.B_FASjdH.js";import{g as $e,s as Je}from"./lens.CiVdg4th.js";import{c as Qe}from"./_chapters.Cea_WLyx.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.CkYm9YKi.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function Ze(){try{const t=JSON.parse(document.querySelector("script[data-why-film]")?.textContent||"null");return t&&typeof t.href=="string"?t:null}catch{return null}}const ue=.5,Ce=new v(-1.938,1,0),Re=new v(-1.938,-1,0),Xe=new v(0,0,1),De=10,Pe=30,U=.015,Ye=[[.2,.367],[.567,.733],[.933,1.1],[1.333,1.5],[1.55,1.97],[2.067,2.233],[2.467,2.633],[2.833,3],[3.2,3.5],[3.567,3.733]],V=.012,ze=`
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
  }`,eo=`
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
  }`,oo=`
  uniform float uTime, uFill, uLiquid, uLookA, uLookB, uLookMix; uniform vec2 uRes;
  varying vec2 vUv; varying vec3 vN, vV;
  ${ze}
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
  }`;function to(){return new ce({transparent:!0,uniforms:{uMap:{value:null},uHas:{value:0},uRadius:{value:.045},uAspect:{value:16/9},uCrop:{value:1},uDim:{value:0},uOpacity:{value:1},uTime:{value:0},uBevel:{value:.04},uGain:{value:1},uKnee:{value:0},uMid:{value:.5},uFoil:{value:0},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uHas, uRadius, uAspect, uCrop, uDim, uOpacity, uTime, uBevel, uGain, uKnee, uMid, uFoil, uLookA, uLookB, uLookMix;
      varying vec2 vUv;
      ${ze}
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
        vec2 tc = vec2((vUv.x - .5) * uCrop + .5, vUv.y);   // (uCrop < 1: a taller window on the 16:9 film, its middle)
        if (uHas > .5) col = vec3(texture2D(uMap, tc - pull + off).r, texture2D(uMap, tc - pull).g, texture2D(uMap, tc - pull - off).b);
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
      }`})}const co=t=>{const ve=t.lang==="ar",N=ve?-1:1,W=matchMedia("(prefers-reduced-motion: reduce)").matches,C=new He,p=new Ge(Pe,t.viewport.aspect,.05,200),j=We({base:"#e9e6e0",mark:"#a49b8e",cell:104});C.add(j);const c=new Fe;C.add(c);const pe=new Ee().setPositions(je(ue)),$=new Ie({color:16777215,linewidth:1.7,transparent:!0,opacity:.96});c.add(new Ne(pe,$));const J=new ce({side:Ke,uniforms:{uTop:{value:Ce},uBot:{value:Re},uAcross:{value:Xe},uDepth:{value:ue},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uRes:{value:new le(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:eo,fragmentShader:oo}),Q=new re(new ne(1,1,1,96),J);Q.frustumCulled=!1,c.add(Q);const R=J.uniforms,s=Ze(),d=new Fe;C.add(d);const a=to(),B=new re(new ne(1,9/16),a),F=new re(new ne(1,9/16),new ce({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * vec2(1.16, 1.3); float d = length(max(abs(q) - vec2(.36, .3), 0.)); gl_FragColor = vec4(vec3(.16, .12, .09), .34 * exp(-d * d * 220.)); }"}));F.position.set(0,-.035,-.02),F.scale.setScalar(1.12),d.add(F,B),d.visible=!1;const Z=s?.poster&&(s.loop||s.watch)?t.media.screen(s.loop||s.watch,s.poster):null,me=Z&&/why-night/.test(s?.loop||"")?Qe([],{base:Z,skip:Ye,big:!0}):null,h=me??Z;let H=null;!h&&s?.poster&&t.textures.image(s.poster).then(e=>{H=e}).catch(()=>{});let D=0,X=0,x=-1,fe=!1;const Y={pos:new v,look:new v},ee={pos:new v,look:new v},de=e=>{c.visible=e===0,d.visible=e===1;const o=e?ee:Y;p.position.copy(o.pos),p.lookAt(o.look),p.updateMatrixWorld()},y=$e(C,p,[],e=>de(e?X:D));y.warm(t.renderer);const G=16/9,oe=2.6,he=1,K=[0,2,1];let M=-1,S=0;const P=new v,ge=new v,we=new v,Oe=Ce.clone().add(Re).multiplyScalar(.5);let E=1,m=!1,te=19,xe=1.4,T=0,q=0,g=1,ye=0,Me=0,ae=0,ke=-1;const be=()=>document.querySelector(".wo-why-col"),_e=(e,o)=>{const i=e*.96/G,l=i+40+(ae||300),r=76,k=o-64;return Math.round(Math.max(r+8,r+(k-r-l)/2))};function ie(){m=t.viewport.portrait;const e=t.viewport,o=Math.tan(Ue.degToRad(Pe/2));p.aspect=e.aspect,p.updateProjectionMatrix(),te=3.87/(m?.82:.4)/(2*o*e.aspect),xe=ue/(2*o*e.aspect)*.8;const i=j.material.uniforms;i.uRes.value.set(e.width*e.dpr,e.height*e.dpr),i.uCell.value=104*e.dpr,$.resolution.set(e.width,e.height),R.uRes.value.set(e.width*e.dpr,e.height*e.dpr),c.position.set(m?.15:.55*N,m?1.9:0,0),c.updateMatrixWorld();const l=e.width,r=e.height,k=2*De*o/r;let f,z,w;if(m){f=l*.96,z=l/2;const b=_e(l,r);w=b+f/G/2;const _=be()?.closest(".wo-why");_?.style.setProperty("--why-top",`${b}px`),_?.style.setProperty("--why-sh",`${Math.round(f/G)}px`)}else{f=Math.min(l*.64,r*1.28);const b=Math.max(28,l*.025);z=ve?b+f/2:l-b-f/2,w=r*.47}g=f*k,ye=(z-l/2)*k,Me=(r/2-w)*k;const O=m?G:16/9;E=16/9/O,B.scale.set(g,g*E,1),F.scale.set(g*1.12,g*1.12*E,1),F.position.set(0,-.035*g,-.02),a.uniforms.uAspect.value=O,a.uniforms.uCrop.value=O/(16/9)}return ie(),{scene:C,camera:p,light:!0,resize:ie,update({p:e,t:o,dt:i,active:l}){if(m&&o-ke>.5){ke=o;const n=be()?.offsetHeight??0;n>0&&Math.abs(n-ae)>2&&(ae=n,ie())}R.uFill.value=(.45+.55*A.out(u(0,.02,e)))*1.03,R.uLiquid.value=u(.01,.03,e),R.uTime.value=o,a.uniforms.uTime.value=o,!W&&e>.03?(M<0&&(M=o,S=0),o-M>oe+he&&(S=(S+1)%K.length,M=o)):(M=-1,S=0);const r=K[S],k=K[(S+1)%K.length],f=M<0?0:u(oe,oe+he,o-M);for(const n of[R,a.uniforms])n.uLookA.value=r,n.uLookB.value=k,n.uLookMix.value=f;T=Te(T,t.pointer.inside&&!m?t.pointer.x:0,2.5,i),q=Te(q,t.pointer.inside&&!m?t.pointer.y:0,2.5,i);const z=.6+.14*A.out(u(0,V*.45,e))+(Math.PI/2-.74)*A.out(u(0,V*.87,e)),w=A.out(u(0,V,e));c.rotation.set((q*.05-.06)*(1-w),T*.08*(1-w)+z,0),c.updateMatrixWorld(),ge.set(0,0,0).applyMatrix4(c.matrixWorld),we.copy(Oe).applyMatrix4(c.matrixWorld),P.lerpVectors(ge,we,A.out(u(0,V*.87,e)));const O=te*Math.pow(xe/te,w)*Ue.lerp(1,.8,u(V,U,e));Y.pos.set(P.x,P.y+.1*Math.sin(Math.PI*w),P.z+O),Y.look.copy(P);const b=W?0:1,_=A.out(u(U,U+.08,e)),Ve=A.in(u(.9,1,e));ee.pos.set(T*.5,q*.3,De*(1.02-.04*u(U,1,e)*b)-Ve*2.2),ee.look.set(T*.12,q*.08,0),d.position.set(ye,Me,0),d.rotation.set(-q*.03,T*.05*N,0),B.scale.set(g*(.94+.06*_),g*E*(.94+.06*_),1);const Le=l;h?(h.want(Le),Le&&e>=U?h.play():h.pause(),me?.frame(o),a.uniforms.uMap.value=h.texture,a.uniforms.uHas.value=1,qe(a,h.luma),a.uniforms.uFoil.value=0):H?(a.uniforms.uMap.value=H,a.uniforms.uHas.value=1,qe(a,H.userData.luma??.5),a.uniforms.uFoil.value=0):a.uniforms.uFoil.value=1;const se=e>=U?1:0;W||!fe?(D=se,fe=!0):x<0&&se!==D&&(x=0,X=se);const L=x<0?null:Je(x);if(L?.passed&&(D=X),L&&(x=x>1.7?-1:x+i),de(D),j.material.uniforms.uShift.value.set(e*120*N,e*40),y.mesh.visible=!!L,!L)y.resize(1,1);else{const n=Math.round(t.viewport.width*t.viewport.dpr),I=Math.round(t.viewport.height*t.viewport.dpr),Ae=I/6,Be=Math.hypot(n,I)/Ae*.6+1;y.resize(n,I),y.set({center:[n/2,I/2],unit:Ae,sphere:1,radius:L.passed?0:Be*L.grow,far:Be,puff:0,alpha:1,screen:L.screen,time:o})}y.capture(t.renderer)},hover(e,o){if(!d.visible||!s)return!1;const i=new Se;return i.setFromCamera(new le(e,o),p),i.intersectObject(B,!1).length>0},pick(e,o){if(!d.visible||!s)return null;const i=new Se;return i.setFromCamera(new le(e,o),p),i.intersectObject(B,!1).length?s.href:null},focus(e){e||h?.pause()},dispose(){pe.dispose(),$.dispose(),Q.geometry.dispose(),J.dispose(),B.geometry.dispose(),a.dispose(),F.geometry.dispose(),y.dispose()}}};export{co as default};
