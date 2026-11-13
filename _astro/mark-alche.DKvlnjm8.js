import{z as _,B as U,F as W,I as q,W as R,y as D,H as O,s as L,b as z,Q as F,O as N,M as k,a as A,S as P,J as j,K as H,k as I}from"./EditionWorld.astro_astro_type_script_index_0_lang.BDhigT5H.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const K={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function J({depthK:d=.245,bevelK:i=.05,stroke:c=.07}={}){const m=_(U.M,U.K,2.15,c);let r=1e9,n=-1e9;for(const l of m)for(const[s]of l)r=Math.min(r,s),n=Math.max(n,s);const a=n-r,h=a*d,p=h*i,o=new W(q(m),{depth:h-2*p,curveSegments:4,bevelEnabled:!0,bevelThickness:p,bevelSize:p*.9,bevelSegments:3});return o.center(),o.computeVertexNormals(),o.userData.mkMark="alche",o.userData.width=a+2*p*.9,o}const Q=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,X=`
  uniform sampler2D uCopy; uniform float uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx; uniform vec2 uSpot;
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  float h1(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h1(i), h1(i + vec2(1., 0.)), f.x), mix(h1(i + vec2(0., 1.)), h1(i + vec2(1., 1.)), f.x), f.y); }
  void main(){
    vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
    vec3 V = normalize(-vV);
    vec2 uv = vC.xy / vC.w * .5 + .5;
    // the bend: none on a face that looks at the visitor, strong where the surface turns away (against the normal)
    vec2 bendDir = n.xy * (1. - max(n.z, 0.) * .7);
    // (world-38e) the frost as alche's rainy glass: read in the LETTER'S OWN surface (its uv: the face's x/y, a side
    // wall's depth/height), so the spots sit on the glass and turn with it. A fine first read (nine cells across the
    // letter) pushes a second read about by up to a whole uv: many small, irregular spots and streaks with firm borders,
    // like dried rain on a window; between them the glass is clear (no nudge: the wall's tiles and LED dots sharp).
    vec3 an = abs(normalize(vON));
    vec2 luv = (an.z >= max(an.x, an.y) ? vL.xy : an.x > an.y ? vL.zy : vL.xz) / uSpan;
    vec2 q = luv * 9.;
    vec2 wv = vec2(vn(q + vec2(uTime * .1, 0.)) * .65 + vn(q * 2.1 + vec2(5.2, -uTime * .1)) * .35,
                   vn(q * 1.3 + vec2(17.1, -uTime * .1)) * .65 + vn(q * 2.3 + vec2(-3.7, uTime * .1)) * .35);
    float nz = vn(q * 2.6 + (wv - .5) * 2. * uWarp) * .7 + vn(q * 5.3 + (wv.yx - .5) * 2. * uWarp) * .3;
    float rough = smoothstep(uSpot.x, uSpot.y, nz) * uRough;
    vec3 col = vec3(0.);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 rp = floor(gl_FragCoord.xy / uGrainPx) + fi * vec2(17.3, 31.7);   // (world-38e) the sand in grains of alche's pixel (his picture is drawn at 1.5 x CSS)
      float slide = .005 + h1(rp) * .007;
      vec2 j = (vec2(h1(rp + 3.1), h1(rp + 7.7)) - .5) * rough * .3;
      vec2 o = -bendDir;
      col.r += texture2D(uCopy, uv + o * (uBend + slide) + j).r;
      col.g += texture2D(uCopy, uv + o * (uBend + slide * 2.) + j).g;
      col.b += texture2D(uCopy, uv + o * (uBend + slide * 4.) + j).b;
    }
    col *= .9 / 8.;
    col = pow(max(col, 0.), vec3(1. / 2.2));   // alche's maths works on display values (his page writes them raw); ours are linear: encode, work, decode
    // the boost and the faint environment, by the angle (face-on ~2x the copy, the rim ~1.1x)
    float cs = clamp(dot(n, V), 0., 1.), F = .1 + .9 * pow(1. - cs, 5.);
    vec3 r = reflect(-V, n);
    vec3 env = vec3(.44) * (.35 + .65 * smoothstep(-.3, .9, r.y)) * uEnv;
    col = col + mix(col, env, .9 * F) * (1. - F);
    col *= uBoost;
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function G(d,i){const c=d.__sceneSize;return c?i.set(c[0],c[1]):d.getDrawingBufferSize(i)}function Z({scale:d=.5,copy:i=0,span:c=4,bend:m=.1,rough:r=.1,boost:n=1.2,env:a=1,glint:h=1,warp:p=4,spot:o=[.5,.64]}={}){const l=new R(4,4,{type:O,depthBuffer:!0,generateMipmaps:!1,minFilter:D,magFilter:D}),s={uCopy:{value:l.texture},uTime:{value:0},uBend:{value:m},uRough:{value:r},uBoost:{value:n},uEnv:{value:a},uGlint:{value:h},uOn:{value:1},uSpan:{value:c},uWarp:{value:p},uSpot:{value:new L(o[0],o[1])},uGrainPx:{value:1}},g=new z({uniforms:s,vertexShader:Q,fragmentShader:X,toneMapped:!1}),v=new L;function M(u,b,S,e){G(u,v);const t=i?Math.round(Math.min(v.x*.87,i*1.5)):Math.max(4,Math.round(v.x*d)),f=i?Math.round(Math.min(v.y*.6,i*1.25)):Math.max(4,Math.round(v.y*d));(l.width!==t||l.height!==f)&&l.setSize(t,f);const w=u.getRenderTarget(),y=e.map(T=>T.visible),E=u.getClearAlpha();e.forEach(T=>{T.visible=!1}),u.setRenderTarget(l),u.setClearAlpha(1),u.clear(),u.render(b,S),u.setRenderTarget(w),u.setClearAlpha(E),e.forEach((T,B)=>{T.visible=y[B]})}return{material:g,uniforms:s,capture:M,target:l,dispose(){l.dispose(),g.dispose()}}}function $(d=K.open){const i=new F,c=new F,m=new F,r=new I,n=new L;let a={...d},h=0,p=0,o=0,l=!1,s=0,g=0;const v=new L,M=e=>{const t=e.clientX/innerWidth*2-1,f=-(e.clientY/innerHeight*2-1);l&&(s+=t-p,g+=f-o),p=t,o=f,l=!0},u=()=>{l=!1};addEventListener("pointermove",M,{passive:!0}),addEventListener("pointerdown",u,{passive:!0}),addEventListener("pointerup",u,{passive:!0}),addEventListener("pointercancel",u,{passive:!0});const b=14;function S(e,t={}){e=Math.min(e,.05),t.room&&(a=t.room),h=t.blendW??h;const f=Math.max(0,1-Math.hypot(p,o)*1.5)*a.hover;if(!t.still){const E=a.gain??b;n.x-=g*E*f*(1-.7*h),n.y+=s*E*f}s=g=0,n.multiplyScalar(Math.max(0,1-e*(a.friction??1)));const w=n.y*e-(a.auto*e+Math.max(-30,Math.min(30,t.scrollV??0))*a.scroll)*(t.still?0:1);m.setFromEuler(r.set(n.x*e,w,0)),i.premultiply(m),i.slerp(c,Math.min(1,e*a.ret*(1-.8*h))),i.normalize();const y=1-Math.exp(-e*3);return v.x+=((t.desk?(t.pointerX??0)*a.lean:0)-v.x)*y,v.y+=((t.desk?(t.pointerY??0)*a.lean:0)-v.y)*y,i}return{update:S,quaternion:i,spin:n,lean:v,kick(e,t){n.x+=e,n.y+=t},reset(){i.identity(),n.set(0,0)},dispose(){removeEventListener("pointermove",M),removeEventListener("pointerdown",u),removeEventListener("pointerup",u),removeEventListener("pointercancel",u)}}}const V="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function ee({engineVig:d=.55}={}){let i=1;const c=()=>new R(4,4,{type:O,depthBuffer:!1,generateMipmaps:!1,minFilter:D,magFilter:D}),m=new R(4,4,{type:O,depthBuffer:!0,generateMipmaps:!1,minFilter:D,magFilter:D}),r=[c(),c(),c()],n=[c(),c(),c()],a=new N(-1,1,1,-1,0,1),h=new k(new A(2,2));h.frustumCulled=!1;const p=new P;p.add(h);const o=new z({uniforms:{tIn:{value:null},uDir:{value:new L},uBright:{value:0}},vertexShader:V,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),l=new z({uniforms:{tMain:{value:m.texture},t1:{value:r[0].texture},t2:{value:r[1].texture},t3:{value:r[2].texture},uAsp:{value:1},uEV:{value:d},uOn:{value:1}},vertexShader:V,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),s=new k(new A(2,2),l);s.frustumCulled=!1,s.renderOrder=1e6,s.visible=!1;let g=[];const v=new L,M=(e,t,f,w,y,E)=>{o.uniforms.tIn.value=t,o.uniforms.uDir.value.set(w,y),o.uniforms.uBright.value=E,h.material=o,e.setRenderTarget(f),e.render(p,a)};function u(e,t,f){G(e,v);const w=Math.max(4,v.x),y=Math.max(4,v.y);(m.width!==w||m.height!==y||r[0].width!==Math.max(2,Math.round(w/4/i)))&&(m.setSize(w,y),[4,8,16].forEach((x,C)=>{r[C].setSize(Math.max(2,Math.round(w/x/i)),Math.max(2,Math.round(y/x/i))),n[C].setSize(r[C].width,r[C].height)})),l.uniforms.uAsp.value=w/y;const E=e.getRenderTarget(),T=e.getClearAlpha();s.visible=!1,e.setRenderTarget(m),e.setClearAlpha(1),e.clear(),e.render(t,f);let B=m.texture;for(let x=0;x<3;x++)M(e,B,n[x],1/n[x].width,0,x===0?1:0),M(e,n[x].texture,r[x],0,1/r[x].height,0),B=r[x].texture;e.setRenderTarget(E),e.setClearAlpha(T)}function b(e){g=e.children.filter(t=>t!==s).map(t=>[t,t.visible]);for(const[t]of g)t.visible=!1;s.visible=!0}function S(){for(const[e,t]of g)e.visible=t;g=[],s.visible=!1}return{quad:s,render:u,only:b,show:S,uniforms:l.uniforms,setPx(e){i=Math.max(1,e)},dispose(){m.dispose(),r.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),o.dispose(),l.dispose(),h.geometry.dispose(),s.geometry.dispose()}}}function te(d,{font:i='700 300px "Space Grotesk Variable", sans-serif',rtl:c=!1,level:m=1.5,spacing:r="0px"}={}){const n=document.createElement("canvas"),a=n.getContext("2d");a.font=i,a.direction=c?"rtl":"ltr",a.letterSpacing=r,a.textAlign="left",a.textBaseline="alphabetic";const h=a.measureText(d),p=8,o=Math.ceil(h.actualBoundingBoxLeft),l=Math.ceil(h.actualBoundingBoxRight),s=Math.ceil(h.actualBoundingBoxAscent),g=Math.ceil(h.actualBoundingBoxDescent);n.width=o+l+p*2,n.height=s+g+p*2,a.font=i,a.direction=c?"rtl":"ltr",a.letterSpacing=r,a.textAlign="left",a.textBaseline="alphabetic",a.fillStyle="#fff",a.fillText(d,p+o,p+s);const v=new j(n);v.anisotropy=8,v.generateMipmaps=!0,v.minFilter=H;const M=n.width/n.height,u=(o+l)/n.width,b={uTex:{value:v},uLevel:{value:m},uOn:{value:1}},S=new z({uniforms:b,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new k(new A(1,1/M),S);return{mesh:e,uniforms:b,fit:f=>{e.scale.setScalar(f/u)},aspect:M,glyphShare:u,dispose(){v.dispose(),S.dispose(),e.geometry.dispose()}}}export{K as M,J as a,Z as b,ee as c,te as d,$ as m};
