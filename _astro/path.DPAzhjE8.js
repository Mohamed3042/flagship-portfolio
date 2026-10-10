import{G as Te,ac as Ge,ad as le,C as Ae,V as c,i as q,ao as re,aq as Pe,ay as He,Z as J,bg as We,aZ as De,aV as Be,ae as Le,y as _e,M as K,a as ee,S as Ee,bh as Ve,aj as Ue,ai as qe,s as ue,a4 as ke,al as Ne,t as Oe,aB as Fe,Q as Ie,a9 as Ke,aE as Ye,I as ce,a2 as D,aI as Ze}from"./EditionWorld.astro_astro_type_script_index_0_lang.C5-V8Ssb.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const je=`
  uniform vec3 uCam, uBox; uniform float uTime;
  // a particle's place: its seed in the box, drifting, wrapped round the camera; e: how near the box's edge (0 at it)
  vec3 wrapAt(vec3 seed, vec3 drift, out float e){
    vec3 f = fract((seed * uBox + drift - uCam) / uBox);
    vec3 m = .5 - abs(f - .5); e = min(min(m.x, m.y), m.z) * 2.;
    return uCam + (f - .5) * uBox;
  }
`;function Qe(e,{box:t=[70,40,70],focus:o=14,size:a=1,color:n="#ffe2a8",seed:s=3}={}){const i=J(s),l=new Float32Array(e*3),u=new Float32Array(e);for(let b=0;b<e;b++)l[b*3]=i(),l[b*3+1]=i(),l[b*3+2]=i(),u[b]=i();const m=new Ge;m.setAttribute("position",new le(l,3)),m.setAttribute("aRand",new le(u,1));const d={uCam:{value:new c},uBox:{value:new c(...t)},uTime:{value:0},uFocus:{value:o},uSize:{value:a},uAmt:{value:1},uCol:{value:new Ae(n)},uPx:{value:1}},y=new q({uniforms:d,transparent:!0,depthWrite:!1,blending:Pe,blendSrc:re,blendDst:re,vertexShader:`
      ${je}
      attribute float aRand; uniform float uFocus, uSize, uPx; varying float vA, vSoft;
      void main(){
        float r = aRand, e;
        vec3 drift = vec3(sin(uTime * (.12 + r * .1) + r * 40.) * 2., uTime * (.25 + r * .35), cos(uTime * (.1 + r * .08) + r * 17.) * 2.);
        vec3 w = wrapAt(position, drift, e);
        vec4 mv = viewMatrix * vec4(w, 1.);
        float z = -mv.z, blur = clamp(abs(z - uFocus) / uFocus, 0., 1.6);
        float px = uSize * uPx * (1.4 + r * 2.2) * (36. / max(z, .5)) * (1. + blur * 5.);
        gl_PointSize = clamp(px, 1., 90.);
        vSoft = blur;
        // energy spreads over a defocused disc; twinkle; fade at the box's edges and close to the lens
        vA = (.45 + .55 * pow(.5 + .5 * sin(uTime * (1.3 + r * 3.) + r * 60.), 3.)) * smoothstep(0., .25, e) * smoothstep(.8, 3., z) / (1. + blur * blur * 6.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uCol; uniform float uAmt; varying float vA, vSoft;
      void main(){
        vec2 q = gl_PointCoord - .5; float d = length(q) * 2.;
        float core = exp(-d * d * mix(9., 2.2, clamp(vSoft, 0., 1.)));
        float rim = smoothstep(1., .82, d) * smoothstep(.55, .9, d) * clamp(vSoft - .4, 0., 1.) * .5;   // a bokeh's brighter rim
        float a = (core + rim) * smoothstep(1., .9, d) * vA * uAmt;
        gl_FragColor = vec4(uCol * a * 1.6, 0.);
      }`}),F=new He(m,y);return F.frustumCulled=!1,F.renderOrder=1300,{object:F,U:d,update(b,_,k){d.uCam.value.copy(b.position),d.uTime.value=_,d.uPx.value=k},dispose(){m.dispose(),y.dispose()}}}function vt(e,{motes:t=1,focus:o=14}={}){const a=Qe(Math.round([160,300,420][e]*t),{focus:o}),n=new Te;return n.add(a.object),{group:n,motes:a,update(s,i,l,u=1){a.update(s,i,l),a.U.uAmt.value=u},dispose(){a.dispose()}}}const $e=`
  uniform float uZ; varying vec2 vUv;
  vec3 hash33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
  float grad(vec3 x, float P){
    vec3 i = floor(x), f = fract(x), u = f * f * f * (f * (f * 6. - 15.) + 10.);
    #define G(o) dot(hash33(mod(i + o, P)) * 2. - 1., f - o)
    return mix(mix(mix(G(vec3(0, 0, 0)), G(vec3(1, 0, 0)), u.x), mix(G(vec3(0, 1, 0)), G(vec3(1, 1, 0)), u.x), u.y),
               mix(mix(G(vec3(0, 0, 1)), G(vec3(1, 0, 1)), u.x), mix(G(vec3(0, 1, 1)), G(vec3(1, 1, 1)), u.x), u.y), u.z);
  }
  float cell(vec3 x, float P){
    vec3 i = floor(x), f = fract(x); float d = 9.;
    for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) for (int c = -1; c <= 1; c++) {
      vec3 o = vec3(a, b, c), r = o + hash33(mod(i + o, P)) - f; d = min(d, dot(r, r));
    }
    return clamp(sqrt(d), 0., 1.);
  }
  float worleyFbm(vec3 p, float f){ return (1. - cell(p * f, f)) * .625 + (1. - cell(p * f * 2., f * 2.)) * .25 + (1. - cell(p * f * 4., f * 4.)) * .125; }
  float remap(float v, float a, float b, float c, float d){ return c + (v - a) / (b - a) * (d - c); }
  void main(){
    vec3 p = vec3(vUv, uZ);
    float n = 0., amp = .5, f = 4.;
    for (int k = 0; k < 5; k++){ n += amp * grad(p * f, f); f *= 2.; amp *= .5; }
    n = clamp(n * .9 + .5, 0., 1.);
    float wLow = worleyFbm(p, 4.), wHigh = worleyFbm(p, 8.);
    float pw = clamp(remap(n, wLow - 1., 1., 0., 1.), 0., 1.);
    float m = 0.; amp = .5; f = 2.;
    for (int k = 0; k < 4; k++){ m += amp * grad(p * f + 7.3, f); f *= 2.; amp *= .5; }
    gl_FragColor = vec4(pw, wLow, wHigh, clamp(m * .95 + .5, 0., 1.));
  }`,fe=new WeakMap;function Xe(e){const t=e.renderer,o=fe.get(t);if(o)return o;const a=e.quality===0?64:128,n=new We(a,a,a,{depthBuffer:!1,type:Be,format:De}),s=n.texture;s.wrapS=s.wrapT=s.wrapR=Le,s.minFilter=s.magFilter=_e,s.generateMipmaps=!1;const i=new q({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:$e,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),l=new K(new ee(2,2),i);l.frustumCulled=!1;const u=new Ee,m=new Ve;u.add(l);const d=t.getRenderTarget();for(let y=0;y<a;y++)i.uniforms.uZ.value=(y+.5)/a,t.setRenderTarget(n,y),t.render(u,m);return t.setRenderTarget(d),i.dispose(),l.geometry.dispose(),fe.set(t,s),s}const p=(e,t=1)=>new Ae(e).multiplyScalar(t),C=1.32,h={pearl:p("#F7F2EC"),rose:p("#CDB8B4"),peach:p("#F6C7A1"),champagne:p("#F3DDAE"),apricot:p("#E9B97F"),ink:p("#2A2522"),zenith:p("#F8EEE6",C),horizon:p("#FBC48C",C),haze:p("#F6CFAE",C),sunCol:p("#FFDAB0",1.5*C),skyAmb:p("#F4DDCF",.95*C),groundAmb:p("#F2C2A0",.85*C),feather:p("#FBEFE3"),shaft:p("#D6A774"),trans:p("#FFCB95"),keyCol:p("#FFF1E2",1.15*C),cloudLit:p("#FFE6C9",1.3*C),cloudShade:p("#C49284"),cloudDeep:p("#9C726B")},R={rise:14,plumage:26,wing:24,above:18,skywriting:24},wt={wide:38,tall:58},gt={y:-30,amp:16},yt={y:132,amp:12},E={from:.012,to:.16,yaw:.45},xt=(e,t=new c,o=1)=>{const a=E.from+(E.to-E.from)*e;return t.set(Math.sin(E.yaw*o)*Math.cos(a),Math.sin(a),-Math.cos(E.yaw)*Math.cos(a)).normalize()},Je={at:new c(0,17,-34),S:4},bt={u:[0,.06]},St={u:[.06,.16],settle:[.06,.5],glint:[.48,.68],unfold:[.64,.97]},zt={u:[.16,.26],fan:[.2,.62],stop:.66},Y={u:[.26,.82],first:.07,last:.88},x={x:60,z:-80,cam:26,orb:14,wall:46,y0:40,rise:9,dTheta:.7,theta0:1.4,top:196,gap:{at:2.2,half:.7,below:72}},et=e=>x.theta0-e*x.dTheta,At={u:[.82,.92],beat:[.32,.78]},kt={u:[.92,1],write:[.08,.55],land:[.8,1]},Ft={motes:.7,focus:14},tt="varying vec3 vDir; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vDir = w.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w; }",at=`
  uniform vec3 uSun, uSunCol, uZenith, uHorizon, uHaze, uRose; uniform float uGlow;
  varying vec3 vDir;
  void main(){
    vec3 d = normalize(vDir), L = normalize(uSun);
    float h = d.y, up = smoothstep(-.01, .62, h);
    vec3 col = mix(uHorizon * .94, uZenith, pow(up, 1.05)) * .86;
    vec2 dh = normalize(d.xz + 1e-5), lh = normalize(L.xz + 1e-5);
    float away = .5 - .5 * dot(dh, lh);
    col = mix(col, uRose, away * (1. - up) * .38);
    col = mix(col, uHaze, smoothstep(0., -.06, h));
    float c = max(dot(d, L), 0.);
    float disc = smoothstep(.99992, .99996, c);
    col += uSunCol * (disc * 9. + pow(c, 300.) * 1.4 + pow(c, 28.) * .45 + pow(c, 5.) * .22 + pow(c, 2.) * .08) * uGlow;
    col += uSunCol * exp(-abs(h - .01) * 22.) * (.1 + .45 * pow(c, 3.)) * uGlow;
    gl_FragColor = vec4(col, 1.);
  }`;function Ct(){const e={uSun:{value:new c(0,.05,-1)},uSunCol:{value:h.sunCol.clone()},uZenith:{value:h.zenith.clone()},uHorizon:{value:h.horizon.clone()},uHaze:{value:h.haze.clone()},uRose:{value:h.rose.clone()},uGlow:{value:1}},t=new q({uniforms:e,vertexShader:tt,fragmentShader:at,side:Ue,depthWrite:!1}),o=new K(new qe(100,32,16),t);return o.frustumCulled=!1,o.renderOrder=-1e3,{mesh:o,U:e,update(a,n){o.position.copy(a.position),e.uSun.value.copy(n)},dispose(){o.geometry.dispose(),t.dispose()}}}const ot="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",nt=`
  precision highp sampler3D;
  uniform sampler3D uNoise; uniform float uY, uAmp, uScale, uTime, uFogD, uRingR, uRingW, uRingAmt, uFlat, uHoleR, uHoleF, uSteps, uMirror;
  uniform vec3 uSun, uSunCol, uSky, uLit, uShade, uDeep, uHaze, uHorizon; uniform vec2 uRingAt, uHoleAt;
  varying vec3 vW;
  float gM;   // the slow modulation, read once per pixel (it barely changes along one ray): half the march's texture reads
  float H(vec2 xz){
    vec4 n = texture(uNoise, vec3(xz * uScale, uTime * .003));
    // billows: rounded heaps (the power), bigger and taller in places (the slow modulation)
    float h = pow(smoothstep(.2, .95, n.r * .72 + n.g * .28), 1.35) * (.4 + 1.25 * gM);
    float flat_ = uFlat;
    if (uRingAmt > 0.) {
      float d = length(xz - uRingAt);
      float inside = smoothstep(uRingR, uRingR - uRingW * 3., d);
      flat_ = max(flat_, inside * uRingAmt);
      h += exp(-pow((d - uRingR) / uRingW, 2.)) * .35 * uRingAmt;
      h += inside * uRingAmt * .03 * sin((uRingR - d) * .09);
    }
    h *= 1. - flat_ * mix(.975, .995, uMirror);
    if (uHoleR > 0.) h *= smoothstep(uHoleR, uHoleR + uHoleF, length(xz - uHoleAt));
    return h * uAmp;
  }
  float Hd(vec2 xz){ return H(xz) + (texture(uNoise, vec3(xz * uScale * 3.3, .21)).b - .5) * .09 * uAmp * (1. - uFlat); }
  void main(){
    vec3 ro = cameraPosition, rd = normalize(vW - ro), L = normalize(uSun);
    float top = uY + uAmp * 1.6;
    // seen from inside the slab or below it (inside the cloud): a bright, even white, and nothing else to work out
    if (ro.y <= top) { gl_FragColor = vec4(mix(uLit, uHaze, .35), 1.); return; }
    gM = texture(uNoise, vec3(vW.xz * uScale * .21 + .31, .57)).a;
    vec3 hit = vW; float hh = 0.;
    if (rd.y < -1e-3 && ro.y > uY) {
      // march down through the slab from where the ray enters its top to where it reaches the floor
      float t0 = max(0., (top - ro.y) / rd.y), t1 = (uY - ro.y) / rd.y;
      t1 = min(t1, t0 + 900.);
      float dt = (t1 - t0) / uSteps, t = t0, prev = t0;
      bool found = false;
      for (int i = 0; i < 16; i++) {
        if (float(i) >= uSteps) break;
        vec3 p = ro + rd * t;
        if (p.y - uY <= H(p.xz)) { found = true; break; }
        prev = t; t += dt;
      }
      // refine between the last step above and the first below
      float a = prev, b = t;
      for (int j = 0; j < 4; j++) { float m = (a + b) * .5; vec3 p = ro + rd * m; if (p.y - uY <= H(p.xz)) b = m; else a = m; }
      hit = ro + rd * b; hh = H(hit.xz);
    }
    // the normal also feels a finer noise (the cauliflower of a cumulus), only for its light
    float e = 1.6;
    vec3 n = normalize(vec3(Hd(hit.xz - vec2(e, 0.)) - Hd(hit.xz + vec2(e, 0.)), 2. * e, Hd(hit.xz - vec2(0., e)) - Hd(hit.xz + vec2(0., e))));
    float sh = 1.;
    for (int k = 1; k <= 3; k++) { vec3 s = hit + L * float(k) * 9.; if (s.y - uY < H(s.xz)) sh -= .22; }
    float wrap = clamp(dot(n, L) * .5 + .5, 0., 1.);
    float hk = clamp(hh / max(uAmp, 1e-3), 0., 1.);
    vec3 col = mix(uDeep, uShade, smoothstep(0., .6, hk));
    col = mix(col, uLit, pow(wrap, 1.4) * sh * (.4 + .6 * hk));
    col *= .82 + .18 * smoothstep(0., .5, hk);   // the hollows between heaps, deeper
    col += uSky * .1 * max(n.y, 0.);
    float fwd = pow(max(dot(rd, L), 0.), 5.), edge = pow(1. - abs(dot(n, -rd)), 2.);
    col += uSunCol * fwd * edge * 1.1 * sh;
    if (uRingAmt > 0.) col += uSunCol * exp(-pow((length(hit.xz - uRingAt) - uRingR) / uRingW, 2.)) * .5 * uRingAmt;
    // flattened, the deck turns to pearl: it mirrors the sky, softly, and the sun glitters on it
    if (uMirror > 0.) {
      col = mix(col, uLit * .82, uMirror * .7);   // (a pearl base, not the cloud's hollows)
      vec3 rf = reflect(rd, normalize(mix(n, vec3(0., 1., 0.), .7)));
      float fr = .25 + .75 * pow(1. - max(-rd.y, 0.), 4.);
      vec3 skyc = mix(uHorizon, uSky * 1.25, smoothstep(0., .4, rf.y));
      col = mix(col, skyc, uMirror * fr * .75);
      col += uSunCol * pow(max(dot(rf, L), 0.), 260.) * uMirror * 2.2;
    }
    float dist = length(hit - ro);
    vec3 fogC = mix(uHaze, uHorizon, pow(max(dot(rd, L), 0.), 3.) * .8);
    col = mix(col, fogC, 1. - exp(-dist * uFogD));
    gl_FragColor = vec4(col, 1.);
  }`;function Mt(e,{y:t=0,amp:o=9,scale:a=1/170,size:n=9e3}={}){const s={uNoise:{value:Xe(e)},uY:{value:t},uAmp:{value:o},uScale:{value:a},uTime:{value:0},uFogD:{value:.00015384615384615385},uRingAt:{value:new ue},uRingR:{value:0},uRingW:{value:18},uRingAmt:{value:0},uFlat:{value:0},uHoleAt:{value:new ue},uHoleR:{value:0},uHoleF:{value:30},uSteps:{value:e.quality===0?8:12},uMirror:{value:0},uSun:{value:new c(0,.05,-1)},uSunCol:{value:h.sunCol.clone()},uSky:{value:h.skyAmb.clone()},uLit:{value:h.cloudLit.clone()},uShade:{value:h.cloudShade.clone()},uDeep:{value:h.cloudDeep.clone()},uHaze:{value:h.haze.clone()},uHorizon:{value:h.horizon.clone()}},i=new q({uniforms:s,vertexShader:ot,fragmentShader:nt,side:ke}),l=new ee(n,n).rotateX(-Math.PI/2),u=new K(l,i);u.frustumCulled=!1,u.renderOrder=-900;const m=()=>t+o*1.6;return{mesh:u,U:s,update(d,y,F){u.position.set(d.position.x,m(),d.position.z),s.uTime.value=y,s.uSun.value.copy(F)},dispose(){l.dispose(),i.dispose()}}}const st=`
  attribute vec3 aHome; attribute vec4 aQuat, aSeed, aShape; attribute vec2 aSize; attribute float aDelay; attribute vec2 aState;
  uniform float uTime, uSettle, uWin, uLift, uBreathe, uFlockSpeed, uFlockThick, uFall, uSwing, uRock, uGlint, uGlintW, uScale, uRuffle;
  uniform vec4 uFlock; uniform vec3 uCam, uBox, uWind, uGlintAxis, uFlockAxis, uOff;
  varying vec2 vUv; varying vec3 vN, vW; varying vec4 vShape, vSeed; varying float vGlint, vTone; varying vec2 vState;

  mat3 quatMat(vec4 q){
    vec3 a = q.xyz * 2.; float x = q.x, y = q.y, z = q.z, w = q.w;
    return mat3(1. - y * a.y - z * a.z, x * a.y + w * a.z, x * a.z - w * a.y,
                x * a.y - w * a.z, 1. - x * a.x - z * a.z, y * a.z + w * a.x,
                x * a.z + w * a.y, y * a.z - w * a.x, 1. - x * a.x - y * a.y);
  }
  mat3 euler(vec3 e){   // yaw (y), pitch (x), roll (z)
    float cy = cos(e.y), sy = sin(e.y), cx = cos(e.x), sx = sin(e.x), cz = cos(e.z), sz = sin(e.z);
    mat3 Y = mat3(cy, 0., -sy, 0., 1., 0., sy, 0., cy), X = mat3(1., 0., 0., 0., cx, sx, 0., -sx, cx), Z = mat3(cz, sz, 0., -sz, cz, 0., 0., 0., 1.);
    return Y * X * Z;
  }
  mat3 ortho(mat3 m){ vec3 a = normalize(m[0]), b = normalize(m[1] - dot(m[1], a) * a); return mat3(a, b, cross(a, b)); }

  void main(){
    vec4 r = aSeed; float len = aSize.x * uScale, wid = aSize.y * uScale;
    // the quad: x across (-.5..5), y from the quill (0) to the tip (1); curled back along its length
    vec3 p = position; float yy = p.y;
    float curl = aShape.y;
    vec3 lp = vec3(p.x * wid, yy * len, -curl * len * yy * yy * .35);
    vec3 ln = normalize(vec3(0., curl * yy * .7, 1.));

    // wander: where it would be if it were not home
    vec3 wp; mat3 wm;
    float ph = r.x * 40., w = 2.6 + r.y * 1.8;
    #if MODE == 0
      // a murmuration: a ribbon looping round uFlock.xyz (radius .w), folding over itself as it goes
      float s = fract(r.x + uTime * uFlockSpeed * (.85 + .3 * r.y)), a = 6.2832 * s;
      vec3 rib = vec3(sin(a), sin(2. * a + uTime * .21) * .32, cos(a) * .45 + sin(a * 3. + uTime * .13) * .12) * uFlock.w;
      vec3 ax = normalize(uFlockAxis), bx = normalize(cross(ax, vec3(0., 1., 0.)) + 1e-4), cx = cross(bx, ax);
      rib = bx * rib.x + vec3(0., rib.y, 0.) + ax * rib.z;
      vec3 off = (r.yzw - .5) * uFlockThick * (.6 + .8 * abs(sin(a * 2. + uTime * .3)));
      wp = uFlock.xyz + rib + off;
      wm = euler(vec3(sin(uTime * w * .5 + ph) * .5, a + 1.57, sin(uTime * w * .7 + ph) * .7));
    #elif MODE == 1
      // loose feathers in a box that wraps round the camera: they glide side to side as they fall (or rise)
      float sw = sin(uTime * w * .45 + ph);
      vec3 drift = uWind * uTime * (.7 + .6 * r.z) + vec3(sw * uSwing, uFall * uTime * (.6 + .8 * r.w), cos(uTime * w * .21 + ph) * uSwing * .6) + uOff * (.7 + .6 * r.y);
      vec3 f = fract((aHome + drift - uCam) / uBox);
      wp = uCam + (f - .5) * uBox;
      wm = euler(vec3(.35 + cos(uTime * w * .45 + ph) * .6, r.z * 6.28 + uTime * .15, sw * .9 + (r.w - .5) * .6));
    #else
      wp = aHome; wm = quatMat(aQuat);
    #endif

    // home, and the blend: each feather lands in its own moment (aDelay), swooping in on an arc
    mat3 hm = quatMat(aQuat);
    float d0 = aDelay * (1. - uWin), k = smoothstep(d0, d0 + uWin, uSettle);
    // landing: a small rocking settle about the quill once it is down (a function of the scroll, not of time)
    float ls = max(0., uSettle - d0 - uWin) / max(uWin, 1e-3);
    float rock = uRock * exp(-ls * 4.) * sin(ls * 11.) * step(.999, k);
    // a band of the form (uGlint ± uGlintW along uGlintAxis): it glints, and on hover it ruffles as if wind ran through
    float band = uGlintW > 0. ? exp(-pow((dot(aHome, uGlintAxis) - uGlint) / uGlintW, 2.)) : 0.;
    rock += uRuffle * band * sin(uTime * 7. + aHome.x * 2.3 + r.x * 6.) * .24;
    rock += uBreathe * sin(uTime * 1.3 + aHome.x * 1.7 + aHome.y * 1.1) * .035 * k;
    float cr = cos(rock), sr = sin(rock);
    mat3 R = mat3(1., 0., 0., 0., cr, sr, 0., -sr, cr);
    lp = R * lp; ln = R * ln;
    mat3 m = ortho(mat3(mix(wm[0], hm[0], k), mix(wm[1], hm[1], k), mix(wm[2], hm[2], k)));
    vec3 hp = aHome;
    vec3 pos = mix(wp, hp, k) + vec3(0., uLift * sin(3.1416 * k), 0.) * (1. - step(.999, k));
    vec3 world = (modelMatrix * vec4(pos + m * lp, 1.)).xyz;
    vN = normalize(mat3(modelMatrix) * (m * ln));
    vW = world; vUv = vec2(p.x * 2., yy); vShape = aShape; vSeed = r; vState = aState;
    vGlint = band * k;
    vTone = aShape.w;
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.);
  }`,it=`
  uniform vec3 uSun, uSunCol, uSky, uGround, uBase, uShaft, uTrans, uFog, uKey, uKeyCol; uniform float uSheen, uAmt, uFogD, uGlintAmt, uWarm, uSolid, uSatin;
  varying vec2 vUv; varying vec3 vN, vW; varying vec4 vShape, vSeed; varying float vGlint, vTone; varying vec2 vState;
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(float x){ float i = floor(x), f = fract(x); return mix(h21(vec2(i, 1.7)), h21(vec2(i + 1., 1.7)), f * f * (3. - 2. * f)); }
  void main(){
    float x = vUv.x, y = vUv.y, asym = vShape.x, down = vShape.z, sd = vSeed.w;
    // the vane's two halves: the shaft off centre so the narrow leading side and the wide trailing side fit the quad
    float wT = 2. / (1. + asym), wL = wT * asym, sx0 = -1. + wL;
    float sx = sx0 + .06 * sin(3.1416 * y) * (1. - asym) - .04 * y * y;
    float y0 = .1;
    float t = clamp((y - y0) / (1. - y0), 0., 1.);
    float env = pow(sin(3.1416 * pow(t, .72)), .5) * smoothstep(0., .04, t);
    float d = x - sx, side = step(0., d);
    float wv = mix(wL, wT, side) * env;
    float r = abs(d) / max(wv, 1e-3);
    // barbs: lines rising from the shaft toward the tip
    float slope = .38, F = 64.;
    float by = y - abs(d) * slope;
    float b = by * F;
    float aa = clamp(fwidth(b) * 1.5, 0., 1.);
    float stri = (.5 + .5 * cos(b * 6.2832)) * (1. - aa);
    // the ragged edge and the splits where the barbs have come apart
    float edge = 1. - .1 * vn(b * .35 + sd * 50.) - .05 * vn(b * 1.7 + sd * 9.);
    float vane = smoothstep(edge, edge - .14, r) * step(y0, y);
    for (int i = 0; i < 3; i++){
      float fi = float(i);
      float at = .3 + fract(sd * (fi + 1.) * 7.13) * .58, gw = .006 + fract(sd * (fi + 3.) * 3.7) * .01;
      float onSide = step(.5, fract(sd * (fi + 2.) * 5.31)) == side ? 1. : 0.;
      float gap = smoothstep(gw * (.4 + r), 0., abs(by - at)) * smoothstep(.3, .75, r) * onSide * step(fi, 1. + floor(fract(sd * 11.) * 2.));
      vane *= 1. - gap;
    }
    // the unzip (an app's feather opening): the barbs part from the shaft on the trailing side, tip first
    float uz = vState.x;
    float open = uz * smoothstep(1. - uz * .95, 1.02 - uz * .95, y) * side * smoothstep(.0, .05, d) * smoothstep(.38 + uz * .25, .2 + uz * .2, r);
    float glowGap = uz * side * exp(-pow((r - (.3 + uz * .2)) * 9., 2.)) * smoothstep(1. - uz, 1.05 - uz, y) * smoothstep(1.02, .9, y);
    vane *= 1. - open;
    // the downy base: wisps instead of a closed vane
    float dz = down * (1. - smoothstep(y0, y0 + .28, y));
    float hairs = .5 + .5 * sin(b * 3.1 + vn(b * .5) * 6.);
    vane *= mix(1., .25 + .55 * hairs * smoothstep(1.3, .3, r), dz);
    // the edge breaks into the barbs' own tips: feathery, not a leaf (fades out where the barbs are finer than a pixel)
    float fr = smoothstep(.62, 1., r) * (1. - aa);
    vane *= 1. - fr * (.55 + .45 * sin(b * 3.1416 + vn(b * 2.3 + sd * 20.) * 5.)) * .45;
    float sw = .035 * (1. - .75 * y) + .012 * (1. - step(y0, y));
    float shaft = smoothstep(sw, sw * .35, abs(d)) * step(y, .985) * (1. - step(1. - .04, y) * .7) * mix(.75, 1., step(y0, y));
    float alpha = clamp(max(vane, shaft) * uSolid, 0., 1.) * uAmt;
    #ifdef NO_MSAA
      if (alpha < .2 + .6 * h21(gl_FragCoord.xy)) discard;
      alpha = 1.;
    #else
      if (alpha < .02) discard;
    #endif

    // light: a thin translucent leaf. Front light wraps; light from behind shines through, warmer and stronger at the thin
    // edges; looking toward the sun through it, it glows.
    vec3 N = normalize(vN); N = gl_FrontFacing ? N : -N;
    vec3 V = normalize(cameraPosition - vW), L = normalize(uSun);
    float nl = dot(N, L), front = max(nl, 0.), back = max(-nl, 0.);
    float thin = mix(.55, 1., r) * (1. - shaft);
    vec3 alb = mix(uBase * vTone * (1. - stri * .07), uShaft, shaft) * (1. + (vSeed.z - .5) * .05);
    // the base lies under the row above it: a soft shade there gives plumage its layers (and the vane's middle, along
    // the shaft, a touch of depth)
    alb *= mix(.45, 1., smoothstep(y0, .6, y)) * mix(.88, 1., smoothstep(0., .5, r));
    // a darker edge where it lies over the next feather, so each one reads on its own
    alb *= mix(1., .64, smoothstep(.7, 1., r) * (1. - dz));
    vec3 amb = mix(uGround, uSky, .5 + .5 * N.y);
    // faces turned from the sun fall into a soft rose shade; faces toward it take the warm light
    vec3 col = alb * (amb * mix(.76, .95, front) + uSunCol * front * .6);
    // the bright sky behind the viewer lights the faces turned to it: a warm key from high on the viewer's side, which
    // gives every feather its own light and shade (the mood frames' cream highlights)
    float key = max(dot(N, normalize(uKey)), 0.);
    col += alb * uKeyCol * key * key * .9;
    // satin: a soft sheen where a feather turns its face to the sun (each feather a little different, so the plumage
    // sparkles instead of reading as one flat colour)
    col += uSunCol * pow(max(dot(reflect(-L, N), V), 0.), 10.) * uSatin * (1. - shaft);
    // backlit: light comes through at the thin edges and the splits (a warm rim), and the whole leaf glows only when the
    // sun is right behind it
    // (only the rims and the down glow: a whole feather glowing orange reads as a ghost of the sky behind it)
    float fwd = pow(max(dot(-V, L), 0.), 3.);
    float rim = (smoothstep(.55, 1., min(r, 1.)) + dz * .5) * (1. - shaft) * step(y0, y);
    col += uTrans * uSunCol * (back * .6 + fwd * .65) * rim * rim * thin * uWarm;
    // opal: a faint thin-film shimmer, only where it is seen edge on
    float gz = pow(1. - abs(dot(N, V)), 3.);
    vec3 film = .5 + .5 * cos(6.2832 * (gz * 1.4 + vSeed.x * .3 + vec3(0., .33, .67)));
    col += film * vec3(1., .86, .9) * gz * uSheen * (1. - shaft);
    // the glint wave that runs across a form as the sun clears the horizon
    col += uSunCol * vGlint * uGlintAmt * (.4 + front);
    // the unzip's light
    col += uTrans * uSunCol * glowGap * 3.5;
    // distance haze
    float fd = 1. - exp(-length(vW - cameraPosition) * uFogD);
    col = mix(col, uFog, fd);
    gl_FragColor = vec4(col, alpha);
  }`,me=(()=>{const e=new ee(1,1,1,6);return e.translate(0,.5,0),e})(),he=new c,de=new Fe,V=new c,N=new c,pe=new c,U=new Ie;function Rt(e,t){return N.copy(e).normalize(),V.crossVectors(N,t).normalize(),V.lengthSq()<1e-6&&V.set(1,0,0),pe.crossVectors(V,N).normalize(),de.makeBasis(V,N,pe),U.setFromRotationMatrix(de),[U.x,U.y,U.z,U.w]}function lt(e,{mode:t="still",msaa:o=!0,seed:a=5,scale:n=1}={}){const s=e.length,i=J(a),l=new Ne;l.index=me.index,l.setAttribute("position",me.getAttribute("position"));const u=new Float32Array(s*3),m=new Float32Array(s*4),d=new Float32Array(s*2),y=new Float32Array(s*4),F=new Float32Array(s*4),b=new Float32Array(s),_=new Float32Array(s*2);e.forEach((f,g)=>{u.set(f.pos,g*3),m.set(f.quat,g*4),d.set([f.len,f.width],g*2),y.set([i(),i(),i(),i()],g*4),F.set([f.asym??.55,f.curl??.12,f.down??.6,f.tone??1],g*4),b[g]=f.delay??0});const k=(f,g,S=!1)=>{const ie=new Ke(f,g);return S&&ie.setUsage(Ye),ie},te=k(u,3,t==="still"),ae=k(m,4,t==="still"),oe=k(_,2,!0);l.setAttribute("aHome",te),l.setAttribute("aQuat",ae),l.setAttribute("aSize",k(d,2)),l.setAttribute("aSeed",k(y,4)),l.setAttribute("aShape",k(F,4)),l.setAttribute("aDelay",k(b,1)),l.setAttribute("aState",oe),l.instanceCount=s;const W={uTime:{value:0},uSettle:{value:t==="still"?1:0},uWin:{value:.35},uLift:{value:0},uBreathe:{value:1},uFlock:{value:new Oe(0,0,0,10)},uFlockAxis:{value:new c(0,0,1)},uFlockSpeed:{value:.045},uFlockThick:{value:3},uCam:{value:new c},uBox:{value:new c(60,40,60)},uWind:{value:new c(.3,0,0)},uFall:{value:-.7},uSwing:{value:1.4},uOff:{value:new c},uRock:{value:.16},uRuffle:{value:0},uGlint:{value:-999},uGlintW:{value:0},uGlintAxis:{value:new c(1,0,0)},uGlintAmt:{value:1.6},uScale:{value:n},uSun:{value:new c(0,.1,-1)},uSunCol:{value:h.sunCol.clone()},uSky:{value:h.skyAmb.clone()},uGround:{value:h.groundAmb.clone()},uBase:{value:h.feather.clone()},uShaft:{value:h.shaft.clone()},uTrans:{value:h.trans.clone()},uSheen:{value:.15},uAmt:{value:1},uFog:{value:h.haze.clone()},uFogD:{value:1/2500},uWarm:{value:1},uSolid:{value:1},uSatin:{value:.3},uKey:{value:new c(-.45,.6,.65)},uKeyCol:{value:h.keyCol.clone()}},ne=new q({uniforms:W,vertexShader:st,fragmentShader:it,side:ke,defines:{MODE:t==="ribbon"?0:t==="wrap"?1:2,...o?{}:{NO_MSAA:1}},alphaToCoverage:o,transparent:!1,depthWrite:!0}),se=new K(l,ne);return se.frustumCulled=!1,{mesh:se,U:W,count:s,setHome(f,g,S){u[f*3]=g.x,u[f*3+1]=g.y,u[f*3+2]=g.z,m[f*4]=S.x,m[f*4+1]=S.y,m[f*4+2]=S.z,m[f*4+3]=S.w},setState(f,g,S=0){_[f*2]=g,_[f*2+1]=S,oe.needsUpdate=!0},commit(){te.needsUpdate=!0,ae.needsUpdate=!0},update(f,g,S){W.uTime.value=g,W.uCam.value.copy(f.position),S&&W.uSun.value.copy(S),he.set(-.5,.55,1).applyQuaternion(f.quaternion).normalize(),W.uKey.value.copy(he)},dispose(){l.dispose(),ne.dispose()}}}function Tt(e,{box:t=[60,40,60],len:o=1,msaa:a=!0,seed:n=9,fall:s=-.7}={}){const i=J(n),l=[];for(let m=0;m<e;m++){const d=o*(.55+i()*.9);l.push({pos:[i()*t[0],i()*t[1],i()*t[2]],quat:[0,0,0,1],len:d,width:d*(.28+i()*.1),asym:.6+i()*.35,curl:.1+i()*.2,down:.5+i()*.5})}const u=lt(l,{mode:"wrap",msaa:a,seed:n});return u.U.uBox.value.set(...t),u.U.uFall.value=s,u}const rt=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,ut=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,P={x:0,y:0,t:-1};function Gt(e,t,o){if(P.t!==t){P.t=t;const a=e.pointer.inside&&!ut&&!rt;P.x=ce(P.x,a?e.pointer.x:0,2.6,o),P.y=ce(P.y,a?e.pointer.y:0,2.6,o)}return P}const ve=new c,ct=new c(0,1,0),Z=new Fe,we=new c,ge=new c;function Pt(e,t,o,a,n,s=0,i=1){ve.copy(o).sub(t).setLength(Math.min(6,t.distanceTo(o))).add(t),e.position.set(t.x,t.y,t.z),Z.lookAt(t,o,ct),we.setFromMatrixColumn(Z,0),ge.setFromMatrixColumn(Z,1),e.position.addScaledVector(we,a*.32*i).addScaledVector(ge,n*.2*i),e.up.set(0,1,0),e.lookAt(ve),e.rotateZ(-a*.016+s)}function Ht(e,t,o,a,n){if(Math.abs(t)<1e-4&&Math.abs(o)<1e-4){e.clearViewOffset();return}e.setViewOffset(a,n,-t*a/2,o*n/2,a,n)}const Wt=()=>Promise.allSettled(['300 100px "Fraunces Variable"','400 100px "Fraunces Variable"','500 100px "Inter Variable"','600 100px "Inter Variable"','300 100px "Cairo Variable"','600 100px "Cairo Variable"'].map(e=>document.fonts.load(e))),r=(e,t,o)=>new c(e,t,o),w=(e,t)=>({from:e,to:t}),v=Je.at,z=(e,t)=>t>0?e:w(r(-e.from.x,e.from.y,e.from.z),r(-e.to.x,e.to.y,e.to.z)),M={riseStart:w(r(0,-26,48),r(0,-19,0)),plumageIn:w(r(6,15.5,22),r(v.x,v.y+.5,v.z)),plumageClose:w(r(6,17.4,-13),r(v.x-.4,v.y+.1,v.z)),plumageWide:w(r(40,22,14),r(v.x+1,v.y+6,v.z)),wingStop:w(r(25,26.5,-12),r(27.5,26.5,-35)),wingStopTall:w(r(27,26,6),r(27.5,26.5,-35))},T={risePlumage:2.2,plumageWing:2.6,wingUpdraft:3.1,aboveSky:2.4},ye=e=>new Ze(e,!1,"centripetal",.5),B=(e,t,o)=>{e=D(e);const a=e*e,n=a*e;return(n-2*a+e)*t+(-2*n+3*a)+(n-a)*o};function L(e){const t=ye(e.map(a=>a.from)),o=ye(e.map(a=>a.to));return{len:t.getLength(),at(a,n,s){return t.getPointAt(D(a),n),o.getPointAt(D(a),s),n},split(a,n,s,i){return t.getPointAt(D(a),s),o.getPointAt(D(n),i),s}}}const G=(e,t,o)=>e*t/Math.max(.001,o),Ce=e=>{const t=new Map;return o=>{let a=t.get(o);return a||t.set(o,a=e(o)),a}},ft=Ce(e=>L([M.riseStart,w(r(1,-12,40),r(0,-2,-10)),w(r(3,5,30),r(v.x,v.y-3,v.z)),M.plumageIn].map(t=>z(t,e))));function Dt(e,t,o,a){const n=ft(t);return n.at(B(e,.35,G(T.risePlumage,R.rise,n.len)),o,a)}const mt=Ce(e=>L([M.plumageIn,w(r(8,16.6,8),r(v.x,v.y+.3,v.z)),M.plumageClose,w(r(22,19.5,2),r(v.x+1,v.y+2.5,v.z)),M.plumageWide].map(t=>z(t,e))));function Bt(e,t,o,a){const n=mt(t);return n.at(B(e,G(T.risePlumage,R.plumage,n.len),G(T.plumageWing,R.plumage,n.len)),o,a)}function Me(e,t,o,a){const n=et(e),s=x.y0+e*x.rise,i=Math.cos(n),l=Math.sin(n);return o.set((x.x+i*x.cam)*t,s+1.2,x.z+l*x.cam),a.set((x.x+i*x.orb)*t,s+.5,x.z+l*x.orb),o}const Re=(e,t)=>(e-Y.first)/(Y.last-Y.first)*(t-1),ht=(e,t)=>{const o=r(0,0,0),a=r(0,0,0);return Me(Re(0,e),t,o,a),w(o,a)},A=r(.27,-.03,-.96).normalize(),$=(e,t,o,a=300)=>w(r(e,t,o),r(e+A.x*a,t+A.y*a,o+A.z*a)),X={beat:$(52,189,-128),out:$(58,187,-150)};function dt(e,t,o,a){return Me(Re(1,e),t,o,a),a.set(o.x+A.x*t*300,o.y+A.y*300,o.z+A.z*300)}const j=e=>Math.atan2(e.x,-e.z),Q=e=>Math.asin(D(e.y/e.length(),-1,1)),H=new c,O=new c;function Lt(e,t,o,a,n){H.subVectors(t,e),O.subVectors(o,e);let s=j(O)-j(H);s>Math.PI&&(s-=Math.PI*2),s<-Math.PI&&(s+=Math.PI*2);const i=j(H)+s*a,l=Q(H)+(Q(O)-Q(H))*a,u=H.length()+(O.length()-H.length())*a;return n.set(Math.sin(i)*Math.cos(l),Math.sin(l),-Math.cos(i)*Math.cos(l)).multiplyScalar(u).add(e)}const xe=new Map;function _t(e,t,o,a,n){const s=`${t}${o}`;let i=xe.get(s);if(!i){const l=r(0,0,0),u=r(0,0,0);dt(o,t,l,u),xe.set(s,i=L([w(l,u),z($(44,185,-104),t),z(X.beat,t),z(X.out,t)]))}return i.at(B(e,G(T.wingUpdraft,R.above,i.len),G(T.aboveSky,R.above,i.len)),a,n)}const I=r(58+A.x*50,138.6,-150+A.z*50),be=new Map;function Et(e,t,o,a){let n=be.get(t);if(!n){const s=I,i=w(r(s.x-A.x*22,143.6,s.z-A.z*22),r(s.x,139,s.z));be.set(t,n=L([z(X.out,t),z(w(r(60,164,-158),r(s.x+40,145,s.z-120)),t),z(i,t)]))}return n.at(B(e,G(T.aboveSky,R.skywriting,n.len),0),o,a)}const Vt=(e,t=new c)=>t.set(I.x*e,I.y,I.z),Se=new Map,ze=new Map;function Ut(e,t,o,a,n,s,i){const l=`${t}${o}${a}`;let u=Se.get(l),m=ze.get(l);const d=t?M.wingStopTall:M.wingStop;return u||Se.set(l,u=L([M.plumageWide,w(r(30,31,-6),r(16,29,-35)),d].map(y=>z(y,o)))),m||ze.set(l,m=L([z(d,o),z(w(r(46,33,-30),r(62,33,-60)),o),ht(a,o)])),e<n?u.at(B(e/n,G(T.plumageWing,R.wing*n,u.len),0),s,i):m.at(B((e-n)/(1-n),0,G(T.wingUpdraft,R.wing*(1-n),m.len)),s,i)}export{Ft as A,Re as B,yt as D,wt as F,Je as M,h as P,bt as R,gt as S,x as T,Y as U,zt as W,vt as a,Xe as b,Mt as c,xt as d,Rt as e,lt as f,rt as g,Tt as h,Bt as i,St as j,_t as k,Pt as l,At as m,Wt as n,Et as o,Gt as p,kt as q,Dt as r,Ct as s,Vt as t,Me as u,dt as v,Ut as w,Lt as x,Ht as y,et as z};
