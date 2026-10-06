import{B as ze,H as Ae,i as z,M as P,a as F,S as Fe,C as w,s as k,F as A,u as se,V as I,G as H,ay as de,bb as Ue,az as Z,b as q,bc as Ne,bd as Be,be as He,bf as Y,as as ie,aq as E,ac as De,aj as me,E as Ve,ap as he,Z as xe,p as we,a4 as ge,a0 as Q,a1 as J,_ as ye,aD as Le,Q as Se}from"./EditionWorld.astro_astro_type_script_index_0_lang.D4T00N5d.js";import{a as Ge}from"./BufferGeometryUtils.9-HlmqBK.js";import{a as Ee,L as Ke,b as _e}from"./LineSegments2.CXDSwISX.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const X="#f3e9d3",V={c:"#1d9fd9",m:"#e2287e",y:"#f7d31d",k:"#17130f"},K=e=>new w(e),L=e=>{const o=K(X),t=K(e);return new w(t.r/o.r,t.g/o.g,t.b/o.b)};new w(0,1,1),new w(1,0,1),new w(1,1,0),new w(0,0,0),new w(1,1,1);const ft=(...e)=>e.reduce((o,t)=>o.multiply(L(V[t])),K(X)),$={css:{value:new k(1,1)},dpr:{value:1}},$e="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",ee=`
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y); }`,qe=`
  uniform sampler2D tScene; uniform vec2 uRes, uAnchor; uniform float uDpr, uTime, uCell, uScale, uGrain, uComp, uSweep, uRough;
  uniform vec4 uMisCM, uMisYK, uPlates, uSpeed, uFlood; uniform vec3 uPaper, uInkC, uInkM, uInkY, uInkK, uBlue; uniform float uSpeedN, uSpeedInk, uSpeedBg, uPencil, uPencilOn;
  varying vec2 vUv;
  ${ee}
  vec3 srgb(vec3 c){ c = clamp(c, 0., 1.); return mix(c * 12.92, 1.055 * pow(c, vec3(1. / 2.4)) - .055, step(.0031308, c)); }
  // the four plates for a colour (full grey replacement: the darkness goes to the black plate)
  vec4 sep(vec3 lin){ vec3 s = srgb(lin); float k = 1. - max(s.r, max(s.g, s.b)); return vec4(clamp((1. - s - k) / max(1. - k, 1e-4), 0., 1.), k); }
  // a plate's screen: dots on a grid turned to the plate's angle, each one's area its coverage, so 100% prints solid;
  // the dot's edge is a little rough, as ink on newsprint is. px: CSS px from the grid's anchor; cell: a cell in device px
  float screen(vec2 px, float v, float ang, float cellPx){
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(c * px.x - s * px.y, s * px.x + c * px.y) / uCell;
    float d = length(fract(q) - .5) + (vnoise(q * 3.1 + ang * 7.) - .5) * uRough * (1. - v);
    float r = sqrt(v) * .7, aa = .7 / cellPx;
    float dotv = (1. - smoothstep(r - aa, r + aa, d)) * smoothstep(.0, .035, v);
    return mix(dotv, 1., smoothstep(.86, .99, v));   // a dark tint fills in, and a solid prints solid
  }
  // the inverse of the post pass's tone map (three's Neutral, exposure 1), so what the press means is what shows
  vec3 invNeutral(vec3 o){
    const float S = .76, D = .24;
    float P = max(o.r, max(o.g, o.b));
    vec3 c1 = o;
    if (P >= S) {
      P = min(P, .996);
      float peak = D * D / (1. - P) - D + S;
      float g = 1. - 1. / (.15 * (peak - P) + 1.);
      c1 = (o - P * g) / max(1. - g, 1e-4) * peak / P;
    }
    float m = min(c1.r, min(c1.g, c1.b)), x = m < .04 ? sqrt(max(m, 0.) / 6.25) : m + .04;
    return c1 + (x - m);
  }
  void main(){
    vec2 fc = gl_FragCoord.xy;
    float cellPx = uCell * uDpr * uScale;
    // each plate sits a touch out of register: it is sampled (and screened) where it was laid down
    vec2 oC = uMisCM.xy * uDpr, oM = uMisCM.zw * uDpr, oY = uMisYK.xy * uDpr, oK = uMisYK.zw * uDpr;
    float vC = sep(texture2D(tScene, (fc - oC) / uRes).rgb).x;
    float vM = sep(texture2D(tScene, (fc - oM) / uRes).rgb).y;
    float vY = sep(texture2D(tScene, (fc - oY) / uRes).rgb).z;
    float vK = sep(texture2D(tScene, (fc - oK) / uRes).rgb).w;
    vec4 raw = texture2D(tScene, vUv);
    // the plates roll on one after another (the opening): a ragged roller front sweeping across the sheet
    float sx = uSweep > 0. ? vUv.x : 1. - vUv.x;
    float front = sx * .86 + (1. - vUv.y) * .14 + (vnoise(vec2(vUv.y * 40., 3.)) - .5) * .03;
    vec4 rv = smoothstep(front - .012, front + .012, uPlates * 1.08 - .04);   // y, m, c, k
    float sc = uDpr * uScale;   // the grid in CSS px (scaled by a dive), anchored to a point on the page
    float iY = screen((fc - oY - uAnchor) / sc, vY, 0., cellPx) * rv.x;
    float iM = screen((fc - oM - uAnchor) / sc, vM, 1.309, cellPx) * rv.y;
    float iC = screen((fc - oC - uAnchor) / sc, vC, .2618, cellPx) * rv.z;
    float iK = screen((fc - oK - uAnchor) / sc, vK, .7854, cellPx) * rv.w;
    // speed lines: solid ink wedges radiating from a point, thick at the frame, tapering in to nothing, redrawn 12 times
    // a second like a hand-drawn panel; their amount sets how many there are and how far in they reach. uSpeedBg: only
    // on what is behind the subject (a backdrop marks itself with alpha .996), as an artist draws them
    if (uSpeed.z > .001) {
      vec2 sv = (vUv - uSpeed.xy) * vec2(uRes.x / uRes.y, 1.);
      float ang = atan(sv.y, sv.x), rad = length(sv), fr = floor(uTime * 12.);
      float a = (ang / 6.28318 + .5) * uSpeedN, si = floor(a), sf = fract(a) - .5;
      float on = step(1. - min(1., uSpeed.z) * .62, h21(vec2(si, fr * .37 + 1.3)));
      float r0 = uSpeed.w + (1. - min(1., uSpeed.z)) * .25 + h21(vec2(si, fr + 9.1)) * .3;
      float w = clamp((rad - r0) * 1.6, 0., 1.) * (.16 + .3 * h21(vec2(si, 3.3)));
      float aa = length(fwidth(sv)) / max(rad, 1e-3) / 6.28318 * uSpeedN;
      float bg = mix(1., step(.99, raw.a) * step(raw.a, .9985), uSpeedBg);
      float ln = on * (1. - smoothstep(w - aa, w + aa, abs(sf))) * step(r0, rad) * bg;
      iK = max(iK, ln * uSpeedInk);
      iM = max(iM, ln * (1. - uSpeedInk));
    }
    // the newsprint: fibres along the sheet, a soft mottle, a fine tooth
    vec2 pp = fc / uDpr;
    float fib = vnoise(pp * vec2(.85, .2)) * .55 + vnoise(pp * vec2(.2, 1.1) + 7.) * .45;
    float mott = vnoise(pp * .011) * .6 + vnoise(pp * .029 + 3.) * .4;
    vec3 paper = uPaper * (1. - uGrain * (.05 * fib + .035 * mott + .025 * h21(fc)));
    // the blue-line pencils under the inks (the opening): every edge of the picture, sketched in non-photo blue, the
    // strokes coming in one after another
    if (uPencil > .001) {
      vec2 dx = vec2(1.5 * uDpr / uRes.x, 0.), dy = vec2(0., 1.5 * uDpr / uRes.y);
      float e = length(texture2D(tScene, vUv + dx).rgb - texture2D(tScene, vUv - dx).rgb) + length(texture2D(tScene, vUv + dy).rgb - texture2D(tScene, vUv - dy).rgb);
      float drawn = step(vnoise(pp * .045 + 4.) * .8 + vnoise(pp * .4) * .2, uPencil * 1.1);
      paper = mix(paper, uBlue, smoothstep(.06, .28, e) * drawn * .8 * min(1., uPencil * 3.) * uPencilOn);
    }
    // the inks lie a little unevenly, and multiply where they overlap (cyan over yellow is green)
    float dens = .9 + .1 * vnoise(pp * .5 + 2.);
    vec3 col = paper;
    col *= mix(vec3(1.), uInkY, iY * dens);
    col *= mix(vec3(1.), uInkM, iM * dens);
    col *= mix(vec3(1.), uInkC, iC * dens);
    col *= mix(vec3(1.), uInkK, iK);
    // a film is not printed: it shows in its own colours (alpha 0)
    col = mix(raw.rgb, col, smoothstep(.0, .98, raw.a));
    col = mix(col, uFlood.rgb, uFlood.a);
    float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uRes.x / uRes.y, 1.)));
    gl_FragColor = vec4(invNeutral(max(col, 0.)) / mix(1., .45 + .55 * vig, uComp), 1.);
  }`,Oe=()=>({tScene:{value:null},uRes:{value:new k(1,1)},uDpr:{value:1},uTime:{value:0},uCell:{value:6.2},uScale:{value:1},uAnchor:{value:new k(0,0)},uRough:{value:.07},uMisCM:{value:new A},uMisYK:{value:new A},uPlates:{value:new A(1,1,1,1)},uSweep:{value:1},uSpeed:{value:new A(.5,.5,0,.3)},uSpeedN:{value:150},uSpeedInk:{value:1},uSpeedBg:{value:0},uFlood:{value:new A(1,1,1,0)},uPaper:{value:K(X)},uInkC:{value:L(V.c)},uInkM:{value:L(V.m)},uInkY:{value:L(V.y)},uInkK:{value:L(V.k)},uGrain:{value:1},uComp:{value:1},uPencil:{value:0},uPencilOn:{value:1},uBlue:{value:K("#8fc9e6")}});function vt(e,o,t=0){const a=(n,s)=>Math.sin(o*n+s)*.22,r=1+t*7;e.uMisCM.value.set((.55+a(.31,0))*r,(-.35+a(.27,1))*r,(-.45+a(.23,2))*r,(.5+a(.29,3))*r),e.uMisYK.value.set((.35+a(.19,4))*r,(.6+a(.21,5))*r,0,0)}function pt(e,o,t,{budget:a=36e5}={}){const r=new ze(1,1,{type:Ae,samples:e.quality?4:0,depthBuffer:!0,stencilBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),n=Oe();n.tScene.value=r.texture;const s=new z({vertexShader:$e,fragmentShader:qe,uniforms:n,depthTest:!1,depthWrite:!1}),u=new P(new F(2,2),s);u.frustumCulled=!1;const i=new Fe;i.add(u);const l=()=>[Math.max(2,Math.round(e.viewport.width*e.viewport.dpr)),Math.max(2,Math.round(e.viewport.height*e.viewport.dpr))],c=(x,d)=>Math.min(1,Math.sqrt(a/(x*d)));function v(){$.css.value.set(e.viewport.width,e.viewport.height),$.dpr.value=e.viewport.dpr}function f(){const[x,d]=l(),C=c(x,d),p=Math.max(2,Math.round(x*C)),M=Math.max(2,Math.round(d*C));(r.width!==p||r.height!==M)&&r.setSize(p,M),n.uRes.value.set(x,d),n.uDpr.value=e.viewport.dpr,n.uCell.value=e.viewport.portrait?5.4:e.viewport.width<1100?5.8:6.4,v()}f();const m=new w;function g(x,d=o,C=t){const p=e.renderer,M=p.getRenderTarget(),h=p.getClearAlpha();p.getClearColor(m),v(),p.setRenderTarget(r),p.setClearColor(16777215,1),p.clear(!0,!0,!0),p.render(d,C),p.setRenderTarget(M),p.setClearColor(m,h),n.uTime.value=x}function R(x,d,C){const p=e.renderer,M=p.getRenderTarget(),h=p.getClearAlpha();p.getClearColor(m),p.setRenderTarget(x),p.setClearColor(16777215,1),p.clear(!0,!0,!0),p.render(d,C),p.setRenderTarget(M),p.setClearColor(m,h)}function T(...x){const d=e.renderer,C=d.getRenderTarget();d.setRenderTarget(r);const p=[[o,t],...x].map(([M,h])=>d.compileAsync(M,h).catch(()=>{}));return d.setRenderTarget(C),Promise.all(p).then(()=>{for(const[M,h]of x)g(0,M,h);g(0)})}return{scene:i,U:n,rt:r,resize:f,render:g,draw:R,warm:T,dispose(){r.dispose(),s.dispose(),u.geometry.dispose()}}}const te={value:new I(-.52,.7,.5).normalize()},Ye=new w("#33305e"),Me=`
  #ifdef USE_INSTANCING
    mat4 IM = instanceMatrix;
  #else
    mat4 IM = mat4(1.);
  #endif
`,be=`
  uniform float uBulge; varying vec3 vN; varying vec3 vP; varying vec2 vUv;
  void main(){
    ${Me}
    vUv = uv;
    vec3 nb = normal + vec3(position.xy * uBulge, 0.) * step(.7, abs(normal.z));   // a flat face shaded as if domed
    vec4 mv = modelViewMatrix * IM * vec4(position, 1.);
    vP = mv.xyz; vN = normalize(normalMatrix * mat3(IM) * nb);
    gl_Position = projectionMatrix * mv;
  }`;function _(e={}){const o=new w(e.color??"#ffffff"),t=o.clone().multiplyScalar(e.mid??.66),a=o.clone().multiplyScalar(e.dark??.3).lerp(Ye,.28);return new z({side:e.side??Z,uniforms:{uLit:{value:o},uMid:{value:t},uDark:{value:a},uKey:te,uBands:{value:new k(...e.bands??[.36,.66])},uRim:{value:e.rim??0},uSpec:{value:e.spec??0},uShine:{value:e.shine??40},uPrint:{value:e.print??1},uMap:{value:e.map??null},uHasMap:{value:e.map?1:0},uBulge:{value:e.bulge??0}},vertexShader:be,fragmentShader:`
      uniform vec3 uLit, uMid, uDark, uKey; uniform vec2 uBands; uniform float uRim, uSpec, uShine, uPrint, uHasMap; uniform sampler2D uMap;
      varying vec3 vN; varying vec3 vP; varying vec2 vUv;
      void main(){
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.), V = normalize(-vP);
        vec3 L = normalize((viewMatrix * vec4(uKey, 0.)).xyz);
        float l = dot(n, L) * .5 + .5, a = fwidth(l) * .9 + .002;
        float t1 = smoothstep(uBands.x - a, uBands.x + a, l), t2 = smoothstep(uBands.y - a, uBands.y + a, l);
        vec3 c = mix(uDark, mix(uMid, uLit, t2), t1);
        if (uHasMap > .5) c *= texture2D(uMap, vUv).rgb;
        float fr = 1. - max(dot(n, V), 0.), fa = fwidth(fr) + .002;
        c = mix(c, vec3(1.), uRim * smoothstep(.72 - fa, .72 + fa, fr) * (1. - t2));
        float sp = pow(max(dot(n, normalize(L + V)), 0.), uShine), sa = fwidth(sp) + .002;
        c = mix(c, vec3(1.), uSpec * smoothstep(.5 - sa, .5 + sa, sp));
        gl_FragColor = vec4(c, uPrint);
      }`})}function dt({bulge:e=.22,print:o=1,sky:t="#2f58c9",skyLow:a="#9ccaf2",ground:r="#26162e",glow:n="#ff8a1a",glow2:s="#ffe14a"}={}){return new z({uniforms:{uKey:te,uPrint:{value:o},uBulge:{value:e},uSky:{value:new w(t)},uSkyLow:{value:new w(a)},uGround:{value:new w(r)},uGlow:{value:new w(n)},uGlow2:{value:new w(s)},uTurn:{value:0}},vertexShader:be,fragmentShader:`
      uniform vec3 uKey, uSky, uSkyLow, uGround, uGlow, uGlow2; uniform float uPrint, uTurn;
      varying vec3 vN; varying vec3 vP; varying vec2 vUv;
      void main(){
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.), V = normalize(-vP);
        vec3 rw = (vec4(reflect(-V, n), 0.) * viewMatrix).xyz;   // the reflection, in the world
        float y = rw.y + rw.x * (.12 + uTurn), aa = fwidth(y) * .9 + .004;
        vec3 sky = mix(uSkyLow, uSky, smoothstep(.16, .62, y));
        sky = mix(sky, vec3(1.), 1. - smoothstep(.11 - aa, .11 + aa, y));                       // a white band over the horizon
        sky = mix(sky, vec3(1.), smoothstep(.4 - aa, .4 + aa, y) * (1. - smoothstep(.47 - aa, .47 + aa, y)) * .85);   // a streak
        vec3 grd = mix(uGround, mix(uGlow, uGlow2, smoothstep(-.55, -.85, y)), smoothstep(-.1, -.42, y));
        vec3 c = mix(grd, sky, smoothstep(-aa, aa, y));
        vec3 L = normalize((viewMatrix * vec4(uKey, 0.)).xyz);
        float l = dot(n, L), la = fwidth(l) + .003;
        c *= mix(.5, 1., smoothstep(-.32 - la, -.32 + la, l));
        float sp = pow(max(dot(n, normalize(L + V)), 0.), 70.), sa = fwidth(sp) + .002;
        c = mix(c, vec3(1.), smoothstep(.5 - sa, .5 + sa, sp));
        gl_FragColor = vec4(c, uPrint);
      }`})}const le=(e,o=Z)=>new q({color:new w(e),side:o}),mt=e=>new z({uniforms:{uColor:{value:new w(e)}},vertexShader:"void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uColor; void main(){ gl_FragColor = vec4(uColor, .996); }"}),je=`
  uniform float uW; uniform vec2 uCss;
  void main(){
    ${Me}
    vec4 mv = modelViewMatrix * IM * vec4(position, 1.);
    vec3 vn = normalize(normalMatrix * mat3(IM) * normal);
    vec4 p0 = projectionMatrix * mv, p1 = projectionMatrix * (mv + vec4(vn * .02, 0.));
    vec2 d = p1.xy / p1.w - p0.xy / p0.w;
    float L = length(d);
    p0.xy += (L > 1e-7 ? d / L : vec2(0.)) * uW * 2. / uCss * p0.w;
    gl_Position = p0;
  }`;function Ze(e,o=3.4,t="#000000"){const a=new De;a.setAttribute("position",e.getAttribute("position")),e.index&&a.setIndex(e.index);const r=Ge(a,.001);r.computeVertexNormals();const n=new z({side:me,uniforms:{uW:{value:o},uCss:$.css,uColor:{value:new w(t)},uPrint:{value:1}},vertexShader:je,fragmentShader:"uniform vec3 uColor; uniform float uPrint; void main(){ gl_FragColor = vec4(uColor, uPrint); }"}),s=new P(r,n);return s.name="hull",s}function Qe(e=2,o="#000000"){const t=new Ee({color:new w(o).getHex(),linewidth:e,worldUnits:!1});return t.uniforms.resolution=$.css,t}function ae(e,o=2,t="#000000"){const a=new Ke().setPositions(e instanceof Float32Array?e:new Float32Array(e));return new _e(a,Qe(o,t))}function Je(e,{angle:o=28,width:t=1.5,color:a="#000000"}={}){const r=new Ve(e,o),n=ae(r.getAttribute("position").array,t,a);return r.dispose(),n}function Xe(e,o=3,t=0,a="#000000"){const r=[];return e.forEach((n,s)=>{const u=e[(s+1)%e.length];r.push(n.x,n.y,t,u.x,u.y,t)}),ae(r,o,a)}function ne(e,o=3.4,t=0){return e.add(Ze(e.geometry,o)),t>0&&e.add(Je(e.geometry,{width:t})),e}function et(e=14,o=.64,t=3,a=.24){const r=xe(t),n=[];for(let s=0;s<e*2;s++){const u=s/(e*2)*Math.PI*2+(r()-.5)*.1,i=s%2?o*(1-r()*a*.4):1-r()*a;n.push(new k(Math.cos(u)*i,Math.sin(u)*i))}return n}function tt({spikes:e=14,inner:o=.64,seed:t=3,fill:a="#ffffff",ring:r=null,line:n=4}={}){const s=et(e,o,t),u=new H,i=new P(new ie(new E(s)),le(a));if(u.add(i),r){const c=s.map(f=>f.clone().multiplyScalar(.8)),v=new P(new ie(new E(c)),le(r));v.position.z=.002,u.add(v)}const l=Xe(s,n,.004);return u.add(l),{group:u,fill:i,edge:l,dispose(){u.traverse(c=>{c.geometry?.dispose(),c.material?.dispose?.()})}}}function ht({a:e="#f7d31d",b:o="#ff8a2a",glow:t="#ffffff",n:a=28}={}){const r={uC:{value:new k(.5,.5)},uAsp:{value:1},uRot:{value:0},uN:{value:a},uA:{value:new w(e)},uB:{value:new w(o)},uGlow:{value:new w(t)},uGlowR:{value:.45},uFlat:{value:0},uFlatCol:{value:new w("#ffffff")}},n=new P(new F(2,2),new z({depthTest:!1,depthWrite:!1,uniforms:r,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1., 1.); }",fragmentShader:`
      uniform vec2 uC; uniform float uAsp, uRot, uN, uGlowR, uFlat; uniform vec3 uA, uB, uGlow, uFlatCol; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - uC) * vec2(uAsp, 1.);
        float r = length(p), a = atan(p.y, p.x) + uRot;
        float k = a / 6.28318 * uN, s = fract(k), id = floor(k);
        float w = .5 + .07 * sin(r * 4.3 + id * 2.1);               // each ray a little uneven, as drawn
        float aa = length(fwidth(p)) / max(r, 1e-3) / 6.28318 * uN * .8;   // a pixel, in ray units (no seam at the atan's cut)
        float ray = smoothstep(w - aa, w + aa, s) * (1. - smoothstep(1. - aa, 1., s));
        vec3 c = mix(uA, uB, ray);
        c = mix(c, uGlow, 1. - smoothstep(uGlowR * .3, uGlowR, r));
        gl_FragColor = vec4(mix(c, uFlatCol, uFlat), .996);   // a backdrop (the press draws speed lines only on these)
      }`}));return n.frustumCulled=!1,n.renderOrder=-1e3,{mesh:n,U:r,dispose(){n.geometry.dispose(),n.material.dispose()}}}function at(e,o){const t=e,a=t*.2,r=new E([new k(-a*.62,t*.5),new k(a*.62,t*.5),new k(a*.3,-t*.18),new k(-a*.3,-t*.18)]),n=new E;n.absarc(0,-t*.4,a*.42,0,Math.PI*2,!1);const s=new he([r,n],{depth:o,curveSegments:8,bevelEnabled:!0,bevelThickness:t*.03,bevelSize:t*.02,bevelSegments:2});return s.center(),s.computeVertexNormals(),s}function nt(e,o){const t=e*.36,a=e*.1,r=new E([[-t,-a],[-a,-a],[-a,-t],[a,-t],[a,-a],[t,-a],[t,a],[a,a],[a,t],[-a,t],[-a,a],[-t,a]].map(([s,u])=>new k(s,u))),n=new he(r,{depth:o,curveSegments:2,bevelEnabled:!0,bevelThickness:e*.03,bevelSize:e*.02,bevelSegments:2});return n.center(),n.computeVertexNormals(),n}const j=(e,o=15,t=.34)=>{if(e<=0)return 0;const a=o*Math.sqrt(1-t*t);return 1-Math.exp(-t*o*e)*(Math.cos(a*e)+t*o/a*Math.sin(a*e))};function xt(e,{face:o="#f7d31d",side:t="#e2287e",size:a=1,line:r=4.5,seed:n=5,burstFill:s="#ffffff",burstRing:u=null}={}){const i=new H,l=new H;i.add(l);const c=_({color:o,spec:.6,shine:30}),v=_({color:t,mid:.7,dark:.38}),f=new de().set(1,.22,0,0,0,1,0,0,0,0,1,0,0,0,0,1),m=xe(n),g=[];let R=0;const T=[...e.toUpperCase()];T.forEach((h,S)=>{if(h===" "){R+=a*.35;return}const b=a*(1+S*.07),y=h==="!"?at(b,b*.4):h==="+"?nt(b,b*.4):Ue(h,{size:b,depth:b*.4,bevel:b*.035,curve:4});y.applyMatrix4(f),y.computeBoundingBox();const U=y.boundingBox,W=U.max.x-U.min.x,N=new P(y,[c,v]);ne(N,r);const B=new I(R+W/2,(S-T.length/2)*a*.05,0);R+=W+a*-.02,g.push({mesh:N,at:B,rot:(m()-.5)*.22,delay:S*.05}),l.add(N)});const x=R;for(const h of g)h.at.x-=x/2;const d=tt({spikes:16,inner:.7,seed:n+2,fill:s,ring:u,line:r*.9});d.group.scale.set(x*.72,a*1.55,1),d.group.position.z=-a*.5,i.add(d.group);let C=-1,p=0;function M(h,S){if(i.visible=h>.001,h>.001&&p<=.001&&(C=S),p=h,!i.visible)return;const b=C<0?9:S-C,y=Math.pow(Math.min(1,h*1.15),.7);for(const W of g){const N=b-W.delay,B=j(N),We=(j(N+.01)-B)/.01,re=Math.max(-.45,Math.min(.7,We/14))*.55,O=B*y;W.mesh.scale.set(O*(1-re*.45),O*(1+re),O),W.mesh.position.copy(W.at).y+=(1-B)*-a*.6,W.mesh.rotation.z=W.rot*(1+2.5*(1-B))}const U=j(b-.03,12,.4)*y;d.group.scale.set(x*.72*U,a*1.55*U,1),d.group.rotation.z=Math.sin(S*.7)*.03+(1-U)*.4}return{group:i,set:M,width:x,dispose(){g.forEach(h=>{h.mesh.geometry.dispose(),h.mesh.children.forEach(S=>{S.geometry.dispose(),S.material.dispose()})}),c.dispose(),v.dispose(),d.dispose()}}}function wt(e,o,t=!0){e.traverse(a=>{const r=a.material;if(r)for(const n of Array.isArray(r)?r:[r])n.stencilWrite=t,n.stencilRef=o,n.stencilFunc=He,n.stencilFail=Y,n.stencilZFail=Y,n.stencilZPass=Y})}function gt(e){const o=new P(new F(1,1),new q({colorWrite:!1,depthWrite:!1,stencilWrite:!0,stencilRef:e,stencilFunc:Be,stencilZPass:Ne}));return o.renderOrder=-2e3,o}function yt(e){const o=e.comicLean??={x:0,y:0,t:-1},t=matchMedia("(pointer: coarse)").matches;return{step(a,r){if(o.t!==r){o.t=r;const n=e.pointer.inside&&!t;o.x=se(o.x,n?e.pointer.x:0,2.6,a),o.y=se(o.y,n?e.pointer.y:0,2.6,a)}return o}}}const ue=new I,ce=new I,fe=new I;function St(e,o,t,a,r,n=1){e.position.copy(o),e.lookAt(t),!(n<=0)&&(e.updateMatrixWorld(),ce.setFromMatrixColumn(e.matrixWorld,0),fe.setFromMatrixColumn(e.matrixWorld,1),ue.copy(t).sub(o).setLength(5).add(o),e.position.addScaledVector(ce,a*.32*n).addScaledVector(fe,r*.2*n),e.lookAt(ue),e.rotateZ(-a*.016*n))}const Mt=()=>Promise.allSettled(['900 100px "Inter Variable"','700 100px "Inter Variable"','500 100px "Inter Variable"','italic 900 100px "Inter Variable"','900 100px "Cairo Variable"','700 100px "Cairo Variable"'].map(e=>document.fonts.load(e))),bt=()=>new Promise(e=>requestAnimationFrame(()=>e())),Ct=()=>matchMedia("(prefers-reduced-motion: reduce)").matches,Ce=30,kt=1/Math.tan(we.degToRad(Ce/2)),Pt=e=>e.x1-e.x0,Rt=e=>e.y1-e.y0,D=6;function It({frame:e=.016}={}){const o={uSize:{value:new k(2,2)},uFrame:{value:e},uCount:{value:0},uHole:{value:1},uDir:{value:1},uPanels:{value:Array.from({length:D},()=>new A)},uPrint:{value:new Array(D).fill(0)},uCurl:{value:new A(0,0,9,0)},uCurlR:{value:.2},uEdge:{value:0},uTime:{value:0}},t=new z({uniforms:o,side:ge,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec2 uSize; uniform float uFrame, uCount, uHole, uDir, uCurlR, uEdge, uTime; uniform vec4 uPanels[${D}]; uniform float uPrint[${D}];
      uniform vec4 uCurl;   // the page turning above: its axis (direction xy), where it is (z), how far it has lifted (w)
      varying vec2 vUv;
      ${ee}
      void main(){
        vec2 p = (vUv - .5) * uSize;
        float aa = fwidth(p.x) * .8;
        vec3 col = vec3(1.);
        for (int i = 0; i < ${D}; i++) {
          if (float(i) >= uCount) break;
          vec4 r = uPanels[i];
          vec2 c = (r.xy + r.zw) * .5, h = (r.zw - r.xy) * .5, q = abs(p - c) - h;
          float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.);       // signed distance to the panel's outer edge
          float ink = 1. - smoothstep(-aa, aa, d) ;                    // inside the outer edge
          ink *= smoothstep(-uFrame - aa, -uFrame + aa, d);            // …and not yet past the frame's inner edge
          // the roller prints the panel's picture in, sweeping across it with a ragged front
          float sx = ((uDir > 0. ? p.x - r.x : r.z - p.x) / max(r.z - r.x, 1e-3)) * .85 + (r.w - p.y) / max(r.w - r.y, 1e-3) * .15;
          float front = uPrint[i] * 1.12 - .06 + (vnoise(vec2(p.y * 38., float(i) * 7.)) - .5) * .05;
          if (uHole > .5 && d < -uFrame && sx < front) discard;
          col = mix(col, vec3(0.), ink);
        }
        // the edge of the sheet, inked when it is seen
        vec2 e = abs(p) - uSize * .5;
        col = mix(col, vec3(0.), uEdge * (1. - smoothstep(-.006 - aa, -.006 + aa, max(e.x, e.y))));
        // the shadow of a page turning above: dark where it is close, along its fold
        float dd = dot(p, uCurl.xy) - uCurl.z;
        col *= 1. - uCurl.w * .55 * smoothstep(-uCurlR * .2, uCurlR * .25, dd) * exp(-max(dd, 0.) / (uCurlR * 2.2));
        gl_FragColor = vec4(col, 1.);
      }`}),a=new P(new F(1,1),t);return{mesh:a,U:o,size(n,s){a.scale.set(n,s,1),o.uSize.value.set(n,s)},panels(n){o.uCount.value=n.length,n.forEach((s,u)=>o.uPanels.value[u].set(s.x0,s.y0,s.x1,s.y1))},print(n,s){o.uPrint.value[n]=s},dispose(){a.geometry.dispose(),t.dispose()}}}function Tt({R:e=.34,ang:o=.28}={}){const t={uSize:{value:new k(2,2)},uN:{value:new k(1,0)},uLine:{value:9},uR:{value:e},uMap:{value:null},uKey:te,uTime:{value:0},uBack:{value:null},uHasBack:{value:0},uGhost:{value:.22}},a=new z({uniforms:t,side:ge,vertexShader:`
      uniform vec2 uSize, uN; uniform float uLine, uR; varying vec2 vUv; varying vec3 vN; varying vec3 vP;
      void main(){
        vUv = uv;
        vec2 p = (uv - .5) * uSize;
        float d = dot(p, uN) - uLine;                 // how far past the fold's axis (the lifted side)
        vec3 pos = vec3(p, 0.), nrm = vec3(0., 0., 1.);
        if (d > 0.) {
          float th = d / uR; vec2 foot = p - uN * d;
          if (th < 3.14159) { pos = vec3(foot + uN * uR * sin(th), uR * (1. - cos(th))); nrm = vec3(-uN * sin(th), cos(th)); }
          else { pos = vec3(foot - uN * (d - 3.14159 * uR), 2. * uR); nrm = vec3(0., 0., -1.); }
        }
        vec4 mv = modelViewMatrix * vec4(pos, 1.);
        vP = mv.xyz; vN = normalize(normalMatrix * nrm);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform sampler2D uMap, uBack; uniform vec3 uKey; uniform float uHasBack, uGhost; varying vec2 vUv; varying vec3 vN; varying vec3 vP;
      ${ee}
      void main(){
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
        vec3 L = normalize((viewMatrix * vec4(uKey, 0.)).xyz);
        float l = dot(n, L) * .5 + .5, a = fwidth(l) + .003;
        float shade = mix(.62, 1., smoothstep(.42 - a, .42 + a, l));   // the bend in two tones
        vec4 c;
        if (gl_FrontFacing) c = texture2D(uMap, vUv);
        else {
          // the back: what is printed there (an inside cover), and the front showing through the cheap paper
          vec2 b = vec2(1. - vUv.x, vUv.y);
          vec3 back = uHasBack > .5 ? texture2D(uBack, b).rgb : vec3(1.);
          c = vec4(mix(back, back * texture2D(uMap, b).rgb, uGhost), 1.);
        }
        gl_FragColor = vec4(c.rgb * shade, c.a);
      }`}),r=new P(new F(1,1,96,64),a);r.frustumCulled=!1;let n=1,s=o;return{mesh:r,U:t,size(i,l){t.uSize.value.set(i,l)},set(i,l=n,c=s){n=l,s=c,t.uN.value.set(Math.cos(c)*l,Math.sin(c)*-1),t.uN.value.normalize();const v=t.uSize.value.x/2,f=t.uSize.value.y/2,m=v*Math.abs(t.uN.value.x)+f*Math.abs(t.uN.value.y);t.uLine.value=m-i*(2*m+Math.PI*t.uR.value),r.visible=i>0&&i<1},shadow(i,l){i.set(t.uN.value.x,t.uN.value.y,t.uLine.value,l>0&&l<1?Math.min(1,l*8,(1-l)*6):0)},dispose(){r.geometry.dispose(),a.dispose()}}}const ot=e=>new Promise(o=>{const t=new Image;t.decoding="async",t.onload=()=>o(t),t.onerror=()=>o(null),t.src=e});function ke(e,o,t,a,r,n){let s=a;for(e.font=`${t} ${s}px ${r}`;e.measureText(o).width>n&&s>8;)s*=.94,e.font=`${t} ${s}px ${r}`;return s}function oe(e,o,t,a,r,{fill:n="#ffffff",drop:s="#e2287e",line:u=.13,align:i="left",family:l='"Inter Variable", sans-serif',skew:c=-.18,weight:v="italic 900",max:f=9999}={}){e.save();const m=ke(e,o,v,r,l,f);e.translate(t,a),e.transform(1,0,c,1,0,0),e.textAlign=i,e.textBaseline="alphabetic",e.lineJoin="round",e.miterLimit=2;const g=m*.07;return e.lineWidth=m*u*2,e.strokeStyle="#000",e.fillStyle=s,e.strokeText(o,g,g),e.fillText(o,g,g),e.strokeText(o,0,0),e.fillStyle=n,e.fillText(o,0,0),e.restore(),m}async function Wt(e,o,t,a,r=1){const u=document.createElement("canvas"),i=u.getContext("2d");u.width=Math.round(600*r),u.height=Math.round(900*r),i.scale(r,r),i.fillStyle="#fff",i.fillRect(0,0,600,900);const l=await ot(e.poster);if(l){const f=Math.max(600/l.naturalWidth,750/l.naturalHeight),m=l.naturalWidth*f,g=l.naturalHeight*f;i.drawImage(l,(600-m)/2,150+(750-g)/2,m,g)}i.fillStyle="#ffd400",i.fillRect(0,0,600,168),i.fillStyle="#000",i.fillRect(0,164,600,10),i.fillStyle="#e2287e",i.fillRect(0,0,600,34),i.fillStyle="#fff",i.font='800 21px "Inter Variable", sans-serif',i.textBaseline="middle",i.textAlign="left",i.fillText(a==="ar"?"حبر وبوم · مجموعة MK":"INK & POW · THE MK COLLECTION",22,18),oe(i,e.name.toUpperCase(),26,138,92,{fill:"#ffffff",drop:"#e2287e",max:440}),i.fillStyle="#fff",i.fillRect(482,44,96,108),i.lineWidth=6,i.strokeStyle="#000",i.strokeRect(482,44,96,108),i.fillStyle="#000",i.textAlign="center",i.font='900 20px "Inter Variable", sans-serif',i.fillText(a==="ar"?"العدد":"ISSUE",530,66),i.font='italic 900 58px "Inter Variable", sans-serif',i.fillText(String(o+1).padStart(2,"0"),530,116),i.fillStyle="#000",i.fillRect(0,836,600,64),i.fillStyle="#ffd400",i.textAlign="left",i.direction=a==="ar"?"rtl":"ltr";const c=e.edition[a]??"";ke(i,c,"800",26,a==="ar"?'"Cairo Variable", sans-serif':'"Inter Variable", sans-serif',480),i.textAlign=a==="ar"?"right":"left",i.fillText(c,a==="ar"?576:24,869),i.direction="ltr",i.textAlign="right",i.font='900 22px "Inter Variable", sans-serif',i.fillStyle="#fff",i.fillText(`${String(o+1).padStart(2,"0")}/${String(t).padStart(2,"0")}`,a==="ar"?96:578,869),i.lineWidth=10,i.strokeStyle="#000",i.strokeRect(5,5,590,890);const v=new Q(u);return v.colorSpace=J,v.anisotropy=8,v.generateMipmaps=!0,v.minFilter=Le,v}function zt(e,o,t,a){const r=e<1.15,n=r?900:2048,s=Math.round(n/e),u=o==="ar",i=document.createElement("canvas"),l=i.getContext("2d");i.width=n,i.height=s,l.fillStyle="#ff00ff",l.fillRect(0,0,n,s);const c=n*.06;l.fillStyle="#fff",l.fillRect(c,s*.16,n-2*c,s*.72),l.lineWidth=8,l.strokeStyle="#000",l.strokeRect(c,s*.16,n-2*c,s*.72),oe(l,u?"في هذا العدد":"IN THIS ISSUE",u?n-c:c,s*.12,r?64:96,{fill:"#ffff00",drop:"#000000",align:u?"right":"left",family:u?'"Cairo Variable", sans-serif':'"Inter Variable", sans-serif',weight:u?"900":"italic 900",max:n-2*c});const v=r?1:3,f=Math.ceil(t.length/v),m=c+30,g=s*.16+34,R=(n-2*c-60)/v,T=(s*.72-60)/f,x=Math.min(T*.5,r?30:40);t.forEach((C,p)=>{const M=Math.floor(p/f),h=p%f,S=u?n-m-M*R:m+M*R,b=g+h*T+T/2,y=x*1.5;l.fillStyle=["#ffff00","#00ffff","#ff00ff"][p%3],l.fillRect(u?S-y:S,b-y/2,y,y),l.lineWidth=4,l.strokeStyle="#000",l.strokeRect(u?S-y:S,b-y/2,y,y),l.fillStyle="#000",l.textBaseline="middle",l.textAlign="center",l.font=`italic 900 ${x*.72}px "Inter Variable", sans-serif`,l.fillText(String(p+1).padStart(2,"0"),u?S-y/2:S+y/2,b+1),l.textAlign=u?"right":"left",l.font=`800 ${x}px "Inter Variable", sans-serif`,l.fillText(C,u?S-y-16:S+y+16,b+1)}),l.fillStyle="#fff",l.textAlign=u?"right":"left",l.textBaseline="middle",l.direction=u?"rtl":"ltr",l.font=`800 ${r?22:30}px ${u?'"Cairo Variable"':'"Inter Variable"'}, sans-serif`,l.fillText(a,u?n-c:c,s*.94);const d=new Q(i);return d.colorSpace=J,d.anisotropy=8,d}function At(e=1){const r=new H,n=new P(new ye(1-.01,1.5-.01,.028),_({color:"#ffffff",mid:.8,dark:.55}));ne(n,2.2),n.position.z=-.028/2,r.add(n);const s=new H;s.position.set(-e*1/2,0,.003),r.add(s);const u=new q({color:"#ffffff",side:Z}),i=_({color:"#ffffff",side:me,mid:.86,dark:.7}),l=new F(1,1.5);l.translate(e*1/2,0,0);const c=new P(l,u),v=new P(l,i);s.add(c,v);const f=ae([-1/2,-1.5/2,0,1/2,-1.5/2,0,1/2,-1.5/2,0,1/2,1.5/2,0,1/2,1.5/2,0,-1/2,1.5/2,0,-1/2,1.5/2,0,-1/2,-1.5/2,0].map((m,g)=>g%3===0?m+e*1/2:m),2.4);return s.add(f),{group:r,hinge:s,front:c,block:n,W:1,H:1.5,cover(m){u.map=m,u.needsUpdate=!0},open(m){s.rotation.y=-e*m*Math.PI*.96},dispose(){n.geometry.dispose(),l.dispose(),u.dispose(),i.dispose()}}}const G={pitch:.2,margin:.5},Pe=(e,o)=>(o*G.pitch+G.margin)/2-.35-e*G.pitch;function Ft(e,o){const t=G.pitch,a=e*t+G.margin,r=1.24,n=1.1,s=.03,u=new H,i=_({color:"#ffffff",mid:.74,dark:.42}),l=(f,m,g,R,T,x)=>{const d=new P(new ye(f,m,g),i);return d.position.set(R,T,x),ne(d,2.6),u.add(d),d};l(r,s,a,0,0,0),l(s,n,a,-r/2,n/2,0),l(s,n,a,r/2,n/2,0),l(r,n,s,0,n/2,-a/2);const c=l(r,n,s,0,n/2,a/2);if(o){const f=new P(new F(r*.82,n*.5),new q({map:o}));f.position.set(0,n*.5,a/2+s/2+.002),u.add(f)}return{group:u,front:c,L:a,W:r,H:n,pitch:t,slot:f=>Pe(f,e),dispose(){u.traverse(f=>f.geometry?.dispose()),i.dispose()}}}function Ut(e,o){const t=document.createElement("canvas"),a=t.getContext("2d");t.width=1024,t.height=512,a.fillStyle="#fff",a.fillRect(0,0,1024,512),a.fillStyle="#000",a.fillRect(24,24,976,464),a.fillStyle="#ffd400",a.fillRect(36,36,952,440),oe(a,o==="ar"?"MK":"MK COLLECTION",512,250,150,{fill:"#ffffff",drop:"#e2287e",align:"center",max:900}),a.fillStyle="#000",a.font='900 64px "Inter Variable", sans-serif',a.textAlign="center",a.fillText(o==="ar"?`الأعداد 1–${e}`:`ISSUES 1–${e}`,512,400);const r=new Q(t);return r.colorSpace=J,r.anisotropy=8,r}const ve=Math.tan(we.degToRad(Ce/2)),Re=e=>[2*e,2],Ie=e=>e<1.15;function Nt(e,o){const[t,a]=Re(e);let r;if(Ie(e)){const n=-t/2+.05,s=t/2-.05,u=a/2-.21,i=-a/2+.15,l=.04,c=u-i,v=u-c*.27,f=v-c*.25;r=[{x0:n,y0:v+l/2,x1:s,y1:u},{x0:n,y0:f+l/2,x1:(n+s)/2-l/2,y1:v-l/2},{x0:(n+s)/2+l/2,y0:f+l/2,x1:s,y1:v-l/2},{x0:n,y0:i,x1:s,y1:f-l/2}]}else{const n=-t/2+Math.max(.16,t*.065),s=t/2-Math.max(.12,t*.045),u=a/2-.2,i=-a/2+.2,l=.055,c=s-n,v=u-i,f=u-v*.53;r=[{x0:n,y0:f+l/2,x1:n+c*.6-l/2,y1:u},{x0:n+c*.6+l/2,y0:f+l/2,x1:s,y1:u},{x0:n,y0:i,x1:n+c*.38-l/2,y1:f-l/2},{x0:n+c*.38+l/2,y0:i,x1:s,y1:f-l/2}]}return o?r.map(n=>({x0:-n.x1,y0:n.y0,x1:-n.x0,y1:n.y1})):r}function Bt(e){const[o,t]=Re(e);return Ie(e)?[{x0:-o/2+.05,y0:-t/2+.15,x1:o/2-.05,y1:t/2-.21}]:[{x0:-o/2+Math.max(.16,o*.065),y0:-t/2+.2,x1:o/2-Math.max(.12,o*.045),y1:t/2-.2}]}const Ht=(e,o)=>(o?-1:1)*(2*e+.16);function Dt(e,o,t=.86){const a=e.x1-e.x0,r=e.y1-e.y0,n=Math.max(r/(2*ve),a/(2*ve*o))/t;return new I((e.x0+e.x1)/2,(e.y0+e.y1)/2,n)}function Te(e,o,t,a=!1){const r=Pe(e,o),n=a?-1:1;return t?{pos:new I(n*1.25,3.3,r+6.3),look:new I(n*-.1,.8,r-.3)}:{pos:new I(n*2.15,2.3,r+3.55),look:new I(n*-.45,1.05,r-.55)}}const rt=new Se,pe=new de,st=new I(0,1,0);function it(e,o,t,a=new Se){const r=Te(-1,e,o,t);return pe.lookAt(r.pos,r.look,st),a.setFromRotationMatrix(pe)}function Vt(e,o,t,a,r,n,s,u=1){e.position.set(t,a,-.55),e.quaternion.copy(it(r,n,s,rt).invert()),e.scale.setScalar(u),o.position.copy(Te(-1,r,n,s).pos).multiplyScalar(-1)}export{Ce as A,Wt as B,ft as C,Te as D,Pe as E,oe as F,Bt as G,gt as H,wt as I,Xe as J,ne as K,Me as L,Pt as M,ee as N,Rt as O,Dt as P,Ht as Q,Qe as R,ae as S,te as T,Vt as U,Je as a,tt as b,dt as c,le as d,xt as e,Mt as f,vt as g,Ze as h,bt as i,kt as j,St as k,yt as l,zt as m,Re as n,Nt as o,pt as p,Ie as q,ht as r,Ct as s,Tt as t,It as u,mt as v,_ as w,Ut as x,Ft as y,At as z};
