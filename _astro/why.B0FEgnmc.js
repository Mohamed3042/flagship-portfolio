import{b as Z,s as W,C as Se,M as J,a as Q,E as He,m as Ee,S as We,P as Ie,G as Be,j as v,$ as Ke,ah as Fe,o as L,r as n,a6 as Ue,ai as Re,q as Te}from"./EditionWorld.astro_astro_type_script_index_0_lang.JhFZ_HeY.js";import{a as Ne,L as je,b as $e}from"./LineSegments2.Dj80lHT6.js";import{g as Je,s as Qe}from"./lens.DTA0xrkm.js";import{c as Ze}from"./_chapters.BXoDCon3.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function Xe({base:o="#e8ebed",mark:S="#8e979c",cell:D=104}={}){const P=new Z({depthTest:!1,depthWrite:!1,uniforms:{uBase:{value:new Se(o)},uMark:{value:new Se(S)},uCell:{value:D},uRes:{value:new W(1,1)},uShift:{value:new W},uDark:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec3 uBase, uMark; uniform float uCell, uDark; uniform vec2 uRes, uShift; varying vec2 vUv;
      void main(){
        vec2 px = vUv * uRes + uShift;
        vec2 c = mod(px, uCell) - uCell * .5;
        float arm = 6., w = .6;
        float plus = (step(abs(c.x), w) * step(abs(c.y), arm) + step(abs(c.y), w) * step(abs(c.x), arm));
        float hair = step(abs(mod(px.y + uCell * 1.5, uCell * 4.) - uCell * 2.), .5) * .25;
        vec2 fc = abs(mod(px, uCell * .25) - uCell * .125);                 // Alche's faint fine grid between the crosses
        float fine = step(uCell * .125 - .6, max(fc.x, fc.y));
        vec3 col = uBase * (1.05 - .16 * pow(length((vUv - .5) * vec2(uRes.x / uRes.y, 1.)), 1.6));   // lighter in the middle
        col *= 1. - .035 * fine;
        col = mix(col, uMark, clamp(plus, 0., 1.) * .55 + hair * .35);
        col = mix(col, vec3(.02, .025, .03), uDark);
        gl_FragColor = vec4(col, 1.);
      }`}),p=new J(new Q(2,2),P);return p.frustumCulled=!1,p.renderOrder=-10,p}function Ye(o=.55){const S=new He(Ee(o,!1),12);return Array.from(S.attributes.position.array)}function eo(){try{const o=JSON.parse(document.querySelector("script[data-why-film]")?.textContent||"null");return o&&typeof o.href=="string"?o:null}catch{return null}}const ve=.5,qe=new v(-1.938,1,0),De=new v(-1.938,-1,0),oo=new v(0,0,1),Pe=10,Oe=30,q=.015,to=[[.2,.367],[.567,.733],[.933,1.1],[1.333,1.5],[1.55,1.97],[2.067,2.233],[2.467,2.633],[2.833,3],[3.2,3.5],[3.567,3.733]],E=.012,_e=`
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
  }`,ao=`
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
  }`,io=`
  uniform float uTime, uFill, uLiquid, uLookA, uLookB, uLookMix; uniform vec2 uRes;
  varying vec2 vUv; varying vec3 vN, vV;
  ${_e}
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
  }`;function so(){return new Z({transparent:!0,uniforms:{uMap:{value:null},uHas:{value:0},uRadius:{value:.045},uAspect:{value:16/9},uCrop:{value:1},uDim:{value:0},uOpacity:{value:1},uTime:{value:0},uBevel:{value:.04},uGain:{value:1},uKnee:{value:0},uMid:{value:.5},uFoil:{value:0},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uHas, uRadius, uAspect, uCrop, uDim, uOpacity, uTime, uBevel, uGain, uKnee, uMid, uFoil, uLookA, uLookB, uLookMix;
      varying vec2 vUv;
      ${_e}
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
      }`})}const mo=o=>{const S=o.lang==="ar",D=S?-1:1,P=matchMedia("(prefers-reduced-motion: reduce)").matches,p=new We,m=new Ie(Oe,o.viewport.aspect,.05,200),X=Xe({base:"#e9e6e0",mark:"#a49b8e",cell:104});p.add(X);const c=new Be;p.add(c);const pe=new Ne().setPositions(Ye(ve)),Y=new je({color:16777215,linewidth:1.7,transparent:!0,opacity:.96});c.add(new $e(pe,Y));const ee=new Z({side:Ke,uniforms:{uTop:{value:qe},uBot:{value:De},uAcross:{value:oo},uDepth:{value:ve},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uRes:{value:new W(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0}},vertexShader:ao,fragmentShader:io}),oe=new J(new Q(1,1,1,96),ee);oe.frustumCulled=!1,c.add(oe);const O=ee.uniforms,s=eo(),h=new Be;p.add(h);const a=so(),B=new J(new Q(1,9/16),a),F=new J(new Q(1,9/16),new Z({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 q = (vUv - .5) * vec2(1.16, 1.3); float d = length(max(abs(q) - vec2(.36, .3), 0.)); gl_FragColor = vec4(vec3(.16, .12, .09), .34 * exp(-d * d * 220.)); }"}));F.position.set(0,-.035,-.02),F.scale.setScalar(1.12),h.add(F,B),h.visible=!1;const te=s?.poster&&(s.loop||s.watch)?o.media.screen(s.loop||s.watch,s.poster):null,me=te&&/why-night/.test(s?.loop||"")?Ze([],{base:te,skip:to,big:!0}):null,g=me??te;let I=null;!g&&s?.poster&&o.textures.image(s.poster).then(e=>{I=e}).catch(()=>{});let _=0,ae=0,y=-1,fe=!1;const ie={pos:new v,look:new v},se={pos:new v,look:new v},de=e=>{c.visible=e===0,h.visible=e===1;const t=e?se:ie;m.position.copy(t.pos),m.lookAt(t.look),m.updateMatrixWorld()},M=Je(p,m,[],e=>de(e?ae:_));M.warm(o.renderer);const K=16/9,le=2.6,he=1,N=[0,2,1];let k=-1,U=0;const z=new v,ge=new v,we=new v,ze=qe.clone().add(De).multiplyScalar(.5);let j=1,f=!1,re=19,xe=1.4,R=0,T=0,w=1,ye=0,Me=0,ue=0,ke=-1;const be=()=>document.querySelector(".wo-why-col"),Ge=(e,t)=>{const i=e*.96/K,l=i+40+(ue||300),r=76,b=t-64;return Math.round(Math.max(r+8,r+(b-r-l)/2))};function ne(){f=o.viewport.portrait;const e=o.viewport,t=Math.tan(Te.degToRad(Oe/2));m.aspect=e.aspect,m.updateProjectionMatrix(),re=3.87/(f?.82:.4)/(2*t*e.aspect),xe=ve/(2*t*e.aspect)*.8;const i=X.material.uniforms;i.uRes.value.set(e.width*e.dpr,e.height*e.dpr),i.uCell.value=104*e.dpr,Y.resolution.set(e.width,e.height),O.uRes.value.set(e.width*e.dpr,e.height*e.dpr),c.position.set(f?.15:.55*D,f?1.9:0,0),c.updateMatrixWorld();const l=e.width,r=e.height,b=2*Pe*t/r;let d,G,x;if(f){d=l*.96,G=l/2;const C=Ge(l,r);x=C+d/K/2;const H=be()?.closest(".wo-why");H?.style.setProperty("--why-top",`${C}px`),H?.style.setProperty("--why-sh",`${Math.round(d/K)}px`)}else{d=Math.min(l*.64,r*1.28);const C=Math.max(28,l*.025);G=S?C+d/2:l-C-d/2,x=r*.47}w=d*b,ye=(G-l/2)*b,Me=(r/2-x)*b;const V=f?K:16/9;j=16/9/V,B.scale.set(w,w*j,1),F.scale.set(w*1.12,w*1.12*j,1),F.position.set(0,-.035*w,-.02),a.uniforms.uAspect.value=V,a.uniforms.uCrop.value=V/(16/9)}return ne(),{scene:p,camera:m,light:!0,resize:ne,update({p:e,t,dt:i,active:l}){if(f&&t-ke>.5){ke=t;const u=be()?.offsetHeight??0;u>0&&Math.abs(u-ue)>2&&(ue=u,ne())}O.uFill.value=(.45+.55*L.out(n(0,.02,e)))*1.03,O.uLiquid.value=n(.01,.03,e),O.uTime.value=t,a.uniforms.uTime.value=t,!P&&e>.03?(k<0&&(k=t,U=0),t-k>le+he&&(U=(U+1)%N.length,k=t)):(k=-1,U=0);const r=N[U],b=N[(U+1)%N.length],d=k<0?0:n(le,le+he,t-k);for(const u of[O,a.uniforms])u.uLookA.value=r,u.uLookB.value=b,u.uLookMix.value=d;R=Ue(R,o.pointer.inside&&!f?o.pointer.x:0,2.5,i),T=Ue(T,o.pointer.inside&&!f?o.pointer.y:0,2.5,i);const G=.6+.14*L.out(n(0,E*.45,e))+(Math.PI/2-.74)*L.out(n(0,E*.87,e)),x=L.out(n(0,E,e));c.rotation.set((T*.05-.06)*(1-x),R*.08*(1-x)+G,0),c.updateMatrixWorld(),ge.set(0,0,0).applyMatrix4(c.matrixWorld),we.copy(ze).applyMatrix4(c.matrixWorld),z.lerpVectors(ge,we,L.out(n(0,E*.87,e)));const V=re*Math.pow(xe/re,x)*Te.lerp(1,.8,n(E,q,e));ie.pos.set(z.x,z.y+.1*Math.sin(Math.PI*x),z.z+V),ie.look.copy(z);const C=P?0:1,H=L.out(n(q,q+.08,e)),Ve=L.in(n(.9,1,e));se.pos.set(R*.5,T*.3,Pe*(1.02-.04*n(q,1,e)*C)-Ve*2.2),se.look.set(R*.12,T*.08,0),h.position.set(ye,Me,0),h.rotation.set(-T*.03,R*.05*D,0),B.scale.set(w*(.94+.06*H),w*j*(.94+.06*H),1);const Ce=l;g?(g.want(Ce),Ce&&e>=q?g.play():g.pause(),me?.frame(t),a.uniforms.uMap.value=g.texture,a.uniforms.uHas.value=1,Re(a,g.luma),a.uniforms.uFoil.value=0):I?(a.uniforms.uMap.value=I,a.uniforms.uHas.value=1,Re(a,I.userData.luma??.5),a.uniforms.uFoil.value=0):a.uniforms.uFoil.value=1;const ce=e>=q?1:0;P||!fe?(_=ce,fe=!0):y<0&&ce!==_&&(y=0,ae=ce);const A=y<0?null:Qe(y);if(A?.passed&&(_=ae),A&&(y=y>1.7?-1:y+i),de(_),X.material.uniforms.uShift.value.set(e*120*D,e*40),M.mesh.visible=!!A,!A)M.resize(1,1);else{const u=Math.round(o.viewport.width*o.viewport.dpr),$=Math.round(o.viewport.height*o.viewport.dpr),Ae=$/6,Le=Math.hypot(u,$)/Ae*.6+1;M.resize(u,$),M.set({center:[u/2,$/2],unit:Ae,sphere:1,radius:A.passed?0:Le*A.grow,far:Le,puff:0,alpha:1,screen:A.screen,time:t})}M.capture(o.renderer)},hover(e,t){if(!h.visible||!s)return!1;const i=new Fe;return i.setFromCamera(new W(e,t),m),i.intersectObject(B,!1).length>0},pick(e,t){if(!h.visible||!s)return null;const i=new Fe;return i.setFromCamera(new W(e,t),m),i.intersectObject(B,!1).length?s.href:null},focus(e){e||g?.pause()},dispose(){pe.dispose(),Y.dispose(),oe.geometry.dispose(),ee.dispose(),B.geometry.dispose(),a.dispose(),F.geometry.dispose(),M.dispose()}}};export{mo as default};
