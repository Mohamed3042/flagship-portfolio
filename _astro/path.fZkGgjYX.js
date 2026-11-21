import{L as J,B as ie,x as W}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{G as Te,a as Pe,B as se,C as Ae,V as c,d as N,a7 as re,a9 as Ge,a0 as He,b0 as We,az as Be,U as De,R as Le,j as _e,M as K,c as ee,S as Ee,l as Ue,v as Ve,T as Ne,k as ce,s as Fe,af as Oe,f as qe,r as ke,Q as Ie,ag as Ke,ai as Ye,y as je}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ze=`
  uniform vec3 uCam, uBox; uniform float uTime;

  vec3 wrapAt(vec3 seed, vec3 drift, out float e){
    vec3 f = fract((seed * uBox + drift - uCam) / uBox);
    vec3 m = .5 - abs(f - .5); e = min(min(m.x, m.y), m.z) * 2.;
    return uCam + (f - .5) * uBox;
  }
`;function Qe(e,{box:t=[70,40,70],focus:o=14,size:a=1,color:n="#ffe2a8",seed:u=3}={}){const i=J(u),l=new Float32Array(e*3),r=new Float32Array(e);for(let z=0;z<e;z++)l[z*3]=i(),l[z*3+1]=i(),l[z*3+2]=i(),r[z]=i();const f=new Pe;f.setAttribute("position",new se(l,3)),f.setAttribute("aRand",new se(r,1));const p={uCam:{value:new c},uBox:{value:new c(...t)},uTime:{value:0},uFocus:{value:o},uSize:{value:a},uAmt:{value:1},uCol:{value:new Ae(n)},uPx:{value:1}},y=new N({uniforms:p,transparent:!0,depthWrite:!1,blending:Ge,blendSrc:re,blendDst:re,vertexShader:`
      ${Ze}
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

        vA = (.45 + .55 * pow(.5 + .5 * sin(uTime * (1.3 + r * 3.) + r * 60.), 3.)) * smoothstep(0., .25, e) * smoothstep(.8, 3., z) / (1. + blur * blur * 6.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uCol; uniform float uAmt; varying float vA, vSoft;
      void main(){
        vec2 q = gl_PointCoord - .5; float d = length(q) * 2.;
        float core = exp(-d * d * mix(9., 2.2, clamp(vSoft, 0., 1.)));
        float rim = smoothstep(1., .82, d) * smoothstep(.55, .9, d) * clamp(vSoft - .4, 0., 1.) * .5;
        float a = (core + rim) * smoothstep(1., .9, d) * vA * uAmt;
        gl_FragColor = vec4(uCol * a * 1.6, 0.);
      }`}),k=new He(f,y);return k.frustumCulled=!1,k.renderOrder=1300,{object:k,U:p,update(z,_,F){p.uCam.value.copy(z.position),p.uTime.value=_,p.uPx.value=F},dispose(){f.dispose(),y.dispose()}}}function xt(e,{motes:t=1,focus:o=14}={}){const a=Qe(Math.round([160,300,420][e]*t),{focus:o}),n=new Te;return n.add(a.object),{group:n,motes:a,update(u,i,l,r=1){a.update(u,i,l),a.U.uAmt.value=r},dispose(){a.dispose()}}}const $e=`
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
  }`,me=new WeakMap;function Xe(e){const t=e.renderer,o=me.get(t);if(o)return o;const a=e.quality===0?64:128,n=new We(a,a,a,{depthBuffer:!1,type:De,format:Be}),u=n.texture;u.wrapS=u.wrapT=u.wrapR=Le,u.minFilter=u.magFilter=_e,u.generateMipmaps=!1;const i=new N({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:$e,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),l=new K(new ee(2,2),i);l.frustumCulled=!1;const r=new Ee,f=new Ue;r.add(l);const p=t.getRenderTarget();for(let y=0;y<a;y++)i.uniforms.uZ.value=(y+.5)/a,t.setRenderTarget(n,y),t.render(r,f);return t.setRenderTarget(p),i.dispose(),l.geometry.dispose(),me.set(t,u),u}const d=(e,t=1)=>new Ae(e).multiplyScalar(t),C=1.32,v={pearl:d("#F7F2EC"),rose:d("#CDB8B4"),peach:d("#F6C7A1"),champagne:d("#F3DDAE"),apricot:d("#E9B97F"),ink:d("#2A2522"),zenith:d("#F8EEE6",C),horizon:d("#FBC48C",C),haze:d("#F6CFAE",C),sunCol:d("#FFDAB0",1.5*C),skyAmb:d("#F4DDCF",.95*C),groundAmb:d("#F2C2A0",.85*C),feather:d("#FBEFE3"),shaft:d("#D6A774"),trans:d("#FFCB95"),keyCol:d("#FFF1E2",1.15*C),cloudLit:d("#FFE6C9",1.3*C),cloudShade:d("#C49284"),cloudDeep:d("#9C726B")},R={rise:14,plumage:26,wing:24,above:18,skywriting:24},wt={wide:38,tall:58},yt={y:-30,amp:16},gt={y:132,amp:12},E={from:.012,to:.16,yaw:.45},St=(e,t=new c,o=1)=>{const a=E.from+(E.to-E.from)*e;return t.set(Math.sin(E.yaw*o)*Math.cos(a),Math.sin(a),-Math.cos(E.yaw)*Math.cos(a)).normalize()},Je={at:new c(0,17,-34),S:4},zt={u:[0,.06]},bt={u:[.06,.16],settle:[.06,.5],glint:[.48,.68],unfold:[.64,.97]},At={u:[.16,.26],fan:[.2,.62],stop:.66},Y={u:[.26,.82],first:.07,last:.88},g={x:60,z:-80,cam:26,orb:14,wall:46,y0:40,rise:9,dTheta:.7,theta0:1.4,top:196,gap:{at:2.2,half:.7,below:72}},et=e=>g.theta0-e*g.dTheta,Ft={u:[.82,.92],beat:[.32,.78]},kt={u:[.92,1],write:[.24,.74],land:[.84,1]},Ct={motes:.7,focus:14},tt="varying vec3 vDir; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vDir = w.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w; }",at=`
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
  }`;function Mt(){const e={uSun:{value:new c(0,.05,-1)},uSunCol:{value:v.sunCol.clone()},uZenith:{value:v.zenith.clone()},uHorizon:{value:v.horizon.clone()},uHaze:{value:v.haze.clone()},uRose:{value:v.rose.clone()},uGlow:{value:1}},t=new N({uniforms:e,vertexShader:tt,fragmentShader:at,side:Ve,depthWrite:!1}),o=new K(new Ne(100,32,16),t);return o.frustumCulled=!1,o.renderOrder=-1e3,{mesh:o,U:e,update(a,n){o.position.copy(a.position),e.uSun.value.copy(n)},dispose(){o.geometry.dispose(),t.dispose()}}}const ot="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",nt=`
  precision highp sampler3D;
  uniform sampler3D uNoise; uniform float uY, uAmp, uScale, uTime, uFogD, uRingR, uRingW, uRingAmt, uFlat, uHoleR, uHoleF, uSteps, uMirror;
  uniform vec3 uSun, uSunCol, uSky, uLit, uShade, uDeep, uHaze, uHorizon; uniform vec2 uRingAt, uHoleAt;
  varying vec3 vW;
  float gM;
  float H(vec2 xz){
    vec4 n = texture(uNoise, vec3(xz * uScale, uTime * .003));

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

    if (ro.y <= top) { gl_FragColor = vec4(mix(uLit, uHaze, .35), 1.); return; }
    gM = texture(uNoise, vec3(vW.xz * uScale * .21 + .31, .57)).a;
    vec3 hit = vW; float hh = 0.;
    if (rd.y < -1e-3 && ro.y > uY) {

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

      float a = prev, b = t;
      for (int j = 0; j < 4; j++) { float m = (a + b) * .5; vec3 p = ro + rd * m; if (p.y - uY <= H(p.xz)) b = m; else a = m; }
      hit = ro + rd * b; hh = H(hit.xz);
    }

    float e = 1.6;
    vec3 n = normalize(vec3(Hd(hit.xz - vec2(e, 0.)) - Hd(hit.xz + vec2(e, 0.)), 2. * e, Hd(hit.xz - vec2(0., e)) - Hd(hit.xz + vec2(0., e))));
    float sh = 1.;
    for (int k = 1; k <= 3; k++) { vec3 s = hit + L * float(k) * 9.; if (s.y - uY < H(s.xz)) sh -= .22; }
    float wrap = clamp(dot(n, L) * .5 + .5, 0., 1.);
    float hk = clamp(hh / max(uAmp, 1e-3), 0., 1.);
    vec3 col = mix(uDeep, uShade, smoothstep(0., .6, hk));
    col = mix(col, uLit, pow(wrap, 1.4) * sh * (.4 + .6 * hk));
    col *= .82 + .18 * smoothstep(0., .5, hk);
    col += uSky * .1 * max(n.y, 0.);
    float fwd = pow(max(dot(rd, L), 0.), 5.), edge = pow(1. - abs(dot(n, -rd)), 2.);
    col += uSunCol * fwd * edge * 1.1 * sh;
    if (uRingAmt > 0.) col += uSunCol * exp(-pow((length(hit.xz - uRingAt) - uRingR) / uRingW, 2.)) * .5 * uRingAmt;

    if (uMirror > 0.) {
      col = mix(col, uLit * .82, uMirror * .7);
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
  }`;function Rt(e,{y:t=0,amp:o=9,scale:a=1/170,size:n=9e3}={}){const u={uNoise:{value:Xe(e)},uY:{value:t},uAmp:{value:o},uScale:{value:a},uTime:{value:0},uFogD:{value:.00015384615384615385},uRingAt:{value:new ce},uRingR:{value:0},uRingW:{value:18},uRingAmt:{value:0},uFlat:{value:0},uHoleAt:{value:new ce},uHoleR:{value:0},uHoleF:{value:30},uSteps:{value:e.quality===0?8:12},uMirror:{value:0},uSun:{value:new c(0,.05,-1)},uSunCol:{value:v.sunCol.clone()},uSky:{value:v.skyAmb.clone()},uLit:{value:v.cloudLit.clone()},uShade:{value:v.cloudShade.clone()},uDeep:{value:v.cloudDeep.clone()},uHaze:{value:v.haze.clone()},uHorizon:{value:v.horizon.clone()}},i=new N({uniforms:u,vertexShader:ot,fragmentShader:nt,side:Fe}),l=new ee(n,n).rotateX(-Math.PI/2),r=new K(l,i);r.frustumCulled=!1,r.renderOrder=-900;const f=()=>t+o*1.6;return{mesh:r,U:u,update(p,y,k){r.position.set(p.position.x,f(),p.position.z),u.uTime.value=y,u.uSun.value.copy(k)},dispose(){l.dispose(),i.dispose()}}}const ut=`
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
  mat3 euler(vec3 e){
    float cy = cos(e.y), sy = sin(e.y), cx = cos(e.x), sx = sin(e.x), cz = cos(e.z), sz = sin(e.z);
    mat3 Y = mat3(cy, 0., -sy, 0., 1., 0., sy, 0., cy), X = mat3(1., 0., 0., 0., cx, sx, 0., -sx, cx), Z = mat3(cz, sz, 0., -sz, cz, 0., 0., 0., 1.);
    return Y * X * Z;
  }
  mat3 ortho(mat3 m){ vec3 a = normalize(m[0]), b = normalize(m[1] - dot(m[1], a) * a); return mat3(a, b, cross(a, b)); }

  void main(){
    vec4 r = aSeed; float len = aSize.x * uScale, wid = aSize.y * uScale;

    vec3 p = position; float yy = p.y;
    float curl = aShape.y;
    vec3 lp = vec3(p.x * wid, yy * len, -curl * len * yy * yy * .35);
    vec3 ln = normalize(vec3(0., curl * yy * .7, 1.));


    vec3 wp; mat3 wm;
    float ph = r.x * 40., w = 2.6 + r.y * 1.8;
    #if MODE == 0

      float s = fract(r.x + uTime * uFlockSpeed * (.85 + .3 * r.y)), a = 6.2832 * s;
      vec3 rib = vec3(sin(a), sin(2. * a + uTime * .21) * .32, cos(a) * .45 + sin(a * 3. + uTime * .13) * .12) * uFlock.w;
      vec3 ax = normalize(uFlockAxis), bx = normalize(cross(ax, vec3(0., 1., 0.)) + 1e-4), cx = cross(bx, ax);
      rib = bx * rib.x + vec3(0., rib.y, 0.) + ax * rib.z;
      vec3 off = (r.yzw - .5) * uFlockThick * (.6 + .8 * abs(sin(a * 2. + uTime * .3)));
      wp = uFlock.xyz + rib + off;
      wm = euler(vec3(sin(uTime * w * .5 + ph) * .5, a + 1.57, sin(uTime * w * .7 + ph) * .7));
    #elif MODE == 1

      float sw = sin(uTime * w * .45 + ph);
      vec3 drift = uWind * uTime * (.7 + .6 * r.z) + vec3(sw * uSwing, uFall * uTime * (.6 + .8 * r.w), cos(uTime * w * .21 + ph) * uSwing * .6) + uOff * (.7 + .6 * r.y);
      vec3 f = fract((aHome + drift - uCam) / uBox);
      wp = uCam + (f - .5) * uBox;
      wm = euler(vec3(.35 + cos(uTime * w * .45 + ph) * .6, r.z * 6.28 + uTime * .15, sw * .9 + (r.w - .5) * .6));
    #else
      wp = aHome; wm = quatMat(aQuat);
    #endif


    mat3 hm = quatMat(aQuat);
    float d0 = aDelay * (1. - uWin), k = smoothstep(d0, d0 + uWin, uSettle);

    float ls = max(0., uSettle - d0 - uWin) / max(uWin, 1e-3);
    float rock = uRock * exp(-ls * 4.) * sin(ls * 11.) * step(.999, k);

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
  }`,lt=`
  uniform vec3 uSun, uSunCol, uSky, uGround, uBase, uShaft, uTrans, uFog, uKey, uKeyCol; uniform float uSheen, uAmt, uFogD, uGlintAmt, uWarm, uSolid, uSatin;
  varying vec2 vUv; varying vec3 vN, vW; varying vec4 vShape, vSeed; varying float vGlint, vTone; varying vec2 vState;
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(float x){ float i = floor(x), f = fract(x); return mix(h21(vec2(i, 1.7)), h21(vec2(i + 1., 1.7)), f * f * (3. - 2. * f)); }
  void main(){
    float x = vUv.x, y = vUv.y, asym = vShape.x, down = vShape.z, sd = vSeed.w;

    float wT = 2. / (1. + asym), wL = wT * asym, sx0 = -1. + wL;
    float sx = sx0 + .06 * sin(3.1416 * y) * (1. - asym) - .04 * y * y;
    float y0 = .1;
    float t = clamp((y - y0) / (1. - y0), 0., 1.);
    float env = pow(sin(3.1416 * pow(t, .72)), .5) * smoothstep(0., .04, t);
    float d = x - sx, side = step(0., d);
    float wv = mix(wL, wT, side) * env;
    float r = abs(d) / max(wv, 1e-3);

    float slope = .38, F = 64.;
    float by = y - abs(d) * slope;
    float b = by * F;
    float aa = clamp(fwidth(b) * 1.5, 0., 1.);
    float stri = (.5 + .5 * cos(b * 6.2832)) * (1. - aa);

    float edge = 1. - .1 * vn(b * .35 + sd * 50.) - .05 * vn(b * 1.7 + sd * 9.);
    float vane = smoothstep(edge, edge - .14, r) * step(y0, y);
    for (int i = 0; i < 3; i++){
      float fi = float(i);
      float at = .3 + fract(sd * (fi + 1.) * 7.13) * .58, gw = .006 + fract(sd * (fi + 3.) * 3.7) * .01;
      float onSide = step(.5, fract(sd * (fi + 2.) * 5.31)) == side ? 1. : 0.;
      float gap = smoothstep(gw * (.4 + r), 0., abs(by - at)) * smoothstep(.3, .75, r) * onSide * step(fi, 1. + floor(fract(sd * 11.) * 2.));
      vane *= 1. - gap;
    }

    float uz = vState.x;
    float open = uz * smoothstep(1. - uz * .95, 1.02 - uz * .95, y) * side * smoothstep(.0, .05, d) * smoothstep(.38 + uz * .25, .2 + uz * .2, r);
    float glowGap = uz * side * exp(-pow((r - (.3 + uz * .2)) * 9., 2.)) * smoothstep(1. - uz, 1.05 - uz, y) * smoothstep(1.02, .9, y);
    vane *= 1. - open;

    float dz = down * (1. - smoothstep(y0, y0 + .28, y));
    float hairs = .5 + .5 * sin(b * 3.1 + vn(b * .5) * 6.);
    vane *= mix(1., .25 + .55 * hairs * smoothstep(1.3, .3, r), dz);

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



    vec3 N = normalize(vN); N = gl_FrontFacing ? N : -N;
    vec3 V = normalize(cameraPosition - vW), L = normalize(uSun);
    float nl = dot(N, L), front = max(nl, 0.), back = max(-nl, 0.);
    float thin = mix(.55, 1., r) * (1. - shaft);
    vec3 alb = mix(uBase * vTone * (1. - stri * .07), uShaft, shaft) * (1. + (vSeed.z - .5) * .05);


    alb *= mix(.45, 1., smoothstep(y0, .6, y)) * mix(.88, 1., smoothstep(0., .5, r));

    alb *= mix(1., .64, smoothstep(.7, 1., r) * (1. - dz));
    vec3 amb = mix(uGround, uSky, .5 + .5 * N.y);

    vec3 col = alb * (amb * mix(.76, .95, front) + uSunCol * front * .6);


    float key = max(dot(N, normalize(uKey)), 0.);
    col += alb * uKeyCol * key * key * .9;


    col += uSunCol * pow(max(dot(reflect(-L, N), V), 0.), 10.) * uSatin * (1. - shaft);



    float fwd = pow(max(dot(-V, L), 0.), 3.);
    float rim = (smoothstep(.55, 1., min(r, 1.)) + dz * .5) * (1. - shaft) * step(y0, y);
    col += uTrans * uSunCol * (back * .6 + fwd * .65) * rim * rim * thin * uWarm;

    float gz = pow(1. - abs(dot(N, V)), 3.);
    vec3 film = .5 + .5 * cos(6.2832 * (gz * 1.4 + vSeed.x * .3 + vec3(0., .33, .67)));
    col += film * vec3(1., .86, .9) * gz * uSheen * (1. - shaft);

    col += uSunCol * vGlint * uGlintAmt * (.4 + front);

    col += uTrans * uSunCol * glowGap * 3.5;

    float fd = 1. - exp(-length(vW - cameraPosition) * uFogD);
    col = mix(col, uFog, fd);
    gl_FragColor = vec4(col, alpha);
  }`,fe=(()=>{const e=new ee(1,1,1,6);return e.translate(0,.5,0),e})(),ve=new c,pe=new ke,U=new c,O=new c,de=new c,V=new Ie;function Tt(e,t){return O.copy(e).normalize(),U.crossVectors(O,t).normalize(),U.lengthSq()<1e-6&&U.set(1,0,0),de.crossVectors(U,O).normalize(),pe.makeBasis(U,O,de),V.setFromRotationMatrix(pe),[V.x,V.y,V.z,V.w]}function it(e,{mode:t="still",msaa:o=!0,seed:a=5,scale:n=1}={}){const u=e.length,i=J(a),l=new Oe;l.index=fe.index,l.setAttribute("position",fe.getAttribute("position"));const r=new Float32Array(u*3),f=new Float32Array(u*4),p=new Float32Array(u*2),y=new Float32Array(u*4),k=new Float32Array(u*4),z=new Float32Array(u),_=new Float32Array(u*2);e.forEach((m,w)=>{r.set(m.pos,w*3),f.set(m.quat,w*4),p.set([m.len,m.width],w*2),y.set([i(),i(),i(),i()],w*4),k.set([m.asym??.55,m.curl??.12,m.down??.6,m.tone??1],w*4),z[w]=m.delay??0});const F=(m,w,b=!1)=>{const le=new Ke(m,w);return b&&le.setUsage(Ye),le},te=F(r,3,t==="still"),ae=F(f,4,t==="still"),oe=F(_,2,!0);l.setAttribute("aHome",te),l.setAttribute("aQuat",ae),l.setAttribute("aSize",F(p,2)),l.setAttribute("aSeed",F(y,4)),l.setAttribute("aShape",F(k,4)),l.setAttribute("aDelay",F(z,1)),l.setAttribute("aState",oe),l.instanceCount=u;const B={uTime:{value:0},uSettle:{value:t==="still"?1:0},uWin:{value:.35},uLift:{value:0},uBreathe:{value:1},uFlock:{value:new qe(0,0,0,10)},uFlockAxis:{value:new c(0,0,1)},uFlockSpeed:{value:.045},uFlockThick:{value:3},uCam:{value:new c},uBox:{value:new c(60,40,60)},uWind:{value:new c(.3,0,0)},uFall:{value:-.7},uSwing:{value:1.4},uOff:{value:new c},uRock:{value:.16},uRuffle:{value:0},uGlint:{value:-999},uGlintW:{value:0},uGlintAxis:{value:new c(1,0,0)},uGlintAmt:{value:1.6},uScale:{value:n},uSun:{value:new c(0,.1,-1)},uSunCol:{value:v.sunCol.clone()},uSky:{value:v.skyAmb.clone()},uGround:{value:v.groundAmb.clone()},uBase:{value:v.feather.clone()},uShaft:{value:v.shaft.clone()},uTrans:{value:v.trans.clone()},uSheen:{value:.15},uAmt:{value:1},uFog:{value:v.haze.clone()},uFogD:{value:1/2500},uWarm:{value:1},uSolid:{value:1},uSatin:{value:.3},uKey:{value:new c(-.45,.6,.65)},uKeyCol:{value:v.keyCol.clone()}},ne=new N({uniforms:B,vertexShader:ut,fragmentShader:lt,side:Fe,defines:{MODE:t==="ribbon"?0:t==="wrap"?1:2,...o?{}:{NO_MSAA:1}},alphaToCoverage:o,transparent:!1,depthWrite:!0}),ue=new K(l,ne);return ue.frustumCulled=!1,{mesh:ue,U:B,count:u,setHome(m,w,b){r[m*3]=w.x,r[m*3+1]=w.y,r[m*3+2]=w.z,f[m*4]=b.x,f[m*4+1]=b.y,f[m*4+2]=b.z,f[m*4+3]=b.w},setState(m,w,b=0){_[m*2]=w,_[m*2+1]=b,oe.needsUpdate=!0},commit(){te.needsUpdate=!0,ae.needsUpdate=!0},update(m,w,b){B.uTime.value=w,B.uCam.value.copy(m.position),b&&B.uSun.value.copy(b),ve.set(-.5,.55,1).applyQuaternion(m.quaternion).normalize(),B.uKey.value.copy(ve)},dispose(){l.dispose(),ne.dispose()}}}function Pt(e,{box:t=[60,40,60],len:o=1,msaa:a=!0,seed:n=9,fall:u=-.7}={}){const i=J(n),l=[];for(let f=0;f<e;f++){const p=o*(.55+i()*.9);l.push({pos:[i()*t[0],i()*t[1],i()*t[2]],quat:[0,0,0,1],len:p,width:p*(.28+i()*.1),asym:.6+i()*.35,curl:.1+i()*.2,down:.5+i()*.5})}const r=it(l,{mode:"wrap",msaa:a,seed:n});return r.U.uBox.value.set(...t),r.U.uFall.value=u,r}const st=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,rt=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,G={x:0,y:0,t:-1};function Gt(e,t,o){if(G.t!==t){G.t=t;const a=e.pointer.inside&&!rt&&!st;G.x=ie(G.x,a?e.pointer.x:0,2.6,o),G.y=ie(G.y,a?e.pointer.y:0,2.6,o)}return G}const he=new c,ct=new c(0,1,0),j=new ke,xe=new c,we=new c;function Ht(e,t,o,a,n,u=0,i=1){he.copy(o).sub(t).setLength(Math.min(6,t.distanceTo(o))).add(t),e.position.set(t.x,t.y,t.z),j.lookAt(t,o,ct),xe.setFromMatrixColumn(j,0),we.setFromMatrixColumn(j,1),e.position.addScaledVector(xe,a*.32*i).addScaledVector(we,n*.2*i),e.up.set(0,1,0),e.lookAt(he),e.rotateZ(-a*.016+u)}function Wt(e,t,o,a,n){if(Math.abs(t)<1e-4&&Math.abs(o)<1e-4){e.clearViewOffset();return}e.setViewOffset(a,n,-t*a/2,o*n/2,a,n)}const Bt=()=>Promise.allSettled(['300 100px "Fraunces Variable"','400 100px "Fraunces Variable"','500 100px "Inter Variable"','600 100px "Inter Variable"','300 100px "Cairo Variable"','600 100px "Cairo Variable"'].map(e=>document.fonts.load(e))),s=(e,t,o)=>new c(e,t,o),x=(e,t)=>({from:e,to:t}),h=Je.at,A=(e,t)=>t>0?e:x(s(-e.from.x,e.from.y,e.from.z),s(-e.to.x,e.to.y,e.to.z)),M={riseStart:x(s(0,-26,48),s(0,-19,0)),plumageIn:x(s(6,15.5,22),s(h.x,h.y+.5,h.z)),plumageClose:x(s(6,17.4,-13),s(h.x-.4,h.y+.1,h.z)),plumageWide:x(s(40,22,14),s(h.x+1,h.y+6,h.z)),wingStop:x(s(25,26.5,-12),s(27.5,26.5,-35)),wingStopTall:x(s(27,26,6),s(27.5,26.5,-35))},T={risePlumage:2.2,plumageWing:2.6,wingUpdraft:3.1,aboveSky:2.4},ye=e=>new je(e,!1,"centripetal",.5),D=(e,t,o)=>{e=W(e);const a=e*e,n=a*e;return(n-2*a+e)*t+(-2*n+3*a)+(n-a)*o};function L(e){const t=ye(e.map(a=>a.from)),o=ye(e.map(a=>a.to));return{len:t.getLength(),at(a,n,u){return t.getPointAt(W(a),n),o.getPointAt(W(a),u),n},split(a,n,u,i){return t.getPointAt(W(a),u),o.getPointAt(W(n),i),u}}}const P=(e,t,o)=>e*t/Math.max(.001,o),Ce=e=>{const t=new Map;return o=>{let a=t.get(o);return a||t.set(o,a=e(o)),a}},mt=Ce(e=>L([M.riseStart,x(s(1,-12,40),s(0,-2,-10)),x(s(3,5,30),s(h.x,h.y-3,h.z)),M.plumageIn].map(t=>A(t,e))));function Dt(e,t,o,a){const n=mt(t);return n.at(D(e,.35,P(T.risePlumage,R.rise,n.len)),o,a)}const ft=Ce(e=>L([M.plumageIn,x(s(8,16.6,8),s(h.x,h.y+.3,h.z)),M.plumageClose,x(s(22,19.5,2),s(h.x+1,h.y+2.5,h.z)),M.plumageWide].map(t=>A(t,e))));function Lt(e,t,o,a){const n=ft(t);return n.at(D(e,P(T.risePlumage,R.plumage,n.len),P(T.plumageWing,R.plumage,n.len)),o,a)}function Me(e,t,o,a){const n=et(e),u=g.y0+e*g.rise,i=Math.cos(n),l=Math.sin(n);return o.set((g.x+i*g.cam)*t,u+1.2,g.z+l*g.cam),a.set((g.x+i*g.orb)*t,u+.5,g.z+l*g.orb),o}const Re=(e,t)=>(e-Y.first)/(Y.last-Y.first)*(t-1),vt=(e,t)=>{const o=s(0,0,0),a=s(0,0,0);return Me(Re(0,e),t,o,a),x(o,a)},S=s(.27,-.03,-.96).normalize(),$=(e,t,o,a=300)=>x(s(e,t,o),s(e+S.x*a,t+S.y*a,o+S.z*a)),X={beat:$(52,189,-128),out:$(58,187,-150)};function pt(e,t,o,a){return Me(Re(1,e),t,o,a),a.set(o.x+S.x*t*300,o.y+S.y*300,o.z+S.z*300)}const Z=e=>Math.atan2(e.x,-e.z),Q=e=>Math.asin(W(e.y/e.length(),-1,1)),H=new c,q=new c;function _t(e,t,o,a,n){H.subVectors(t,e),q.subVectors(o,e);let u=Z(q)-Z(H);u>Math.PI&&(u-=Math.PI*2),u<-Math.PI&&(u+=Math.PI*2);const i=Z(H)+u*a,l=Q(H)+(Q(q)-Q(H))*a,r=H.length()+(q.length()-H.length())*a;return n.set(Math.sin(i)*Math.cos(l),Math.sin(l),-Math.cos(i)*Math.cos(l)).multiplyScalar(r).add(e)}const ge=new Map;function Et(e,t,o,a,n){const u=`${t}${o}`;let i=ge.get(u);if(!i){const l=s(0,0,0),r=s(0,0,0);pt(o,t,l,r),ge.set(u,i=L([x(l,r),A($(44,185,-104),t),A(X.beat,t),A(X.out,t)]))}return i.at(D(e,P(T.wingUpdraft,R.above,i.len),P(T.aboveSky,R.above,i.len)),a,n)}const I=s(58+S.x*50,138.6,-150+S.z*50),Se=new Map;function Ut(e,t,o,a){let n=Se.get(t);if(!n){const l=I,r=x(s(l.x-S.x*22,143.6,l.z-S.z*22),s(l.x,139,l.z));Se.set(t,n=L([A(X.out,t),A(x(s(l.x-S.x*42,150,l.z-S.z*42),s(l.x,139.5,l.z)),t),A(r,t)]))}const u=D(e,P(T.aboveSky,R.skywriting,n.len),0),i=1-Math.pow(1-W(u*1.7),3);return n.split(u,i,o,a)}const Vt=(e,t=new c)=>t.set(I.x*e,I.y,I.z),ze=new Map,be=new Map;function Nt(e,t,o,a,n,u,i){const l=`${t}${o}${a}`;let r=ze.get(l),f=be.get(l);const p=t?M.wingStopTall:M.wingStop;return r||ze.set(l,r=L([M.plumageWide,x(s(30,31,-6),s(16,29,-35)),p].map(y=>A(y,o)))),f||be.set(l,f=L([A(p,o),A(x(s(46,33,-30),s(62,33,-60)),o),vt(a,o)])),e<n?r.at(D(e/n,P(T.plumageWing,R.wing*n,r.len),0),u,i):f.at(D((e-n)/(1-n),0,P(T.wingUpdraft,R.wing*(1-n),f.len)),u,i)}export{Ct as A,Re as B,gt as D,wt as F,Je as M,v as P,zt as R,yt as S,g as T,Y as U,At as W,xt as a,Xe as b,Rt as c,St as d,Tt as e,it as f,st as g,Pt as h,Lt as i,bt as j,Et as k,Ht as l,Ft as m,Bt as n,Ut as o,Gt as p,kt as q,Dt as r,Mt as s,Vt as t,Me as u,pt as v,Nt as w,_t as x,Wt as y,et as z};
