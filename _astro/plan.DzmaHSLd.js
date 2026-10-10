import{ao as b,ap as O,aH as I,aq as U,V as p,C as d,i as h,a4 as T,an as V,ac as W,ad as M,ay as z,I as A,aB as D,a0 as B,aQ as K,aM as q}from"./EditionWorld.astro_astro_type_script_index_0_lang.DKyZ0HWE.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function re(){const a=Array.from({length:8},()=>new p(0,9,0)),e=Array.from({length:8},()=>new p),s=new Array(8).fill(.02);return{LP:a,LC:e,LR:s,u:{uLP:{value:a},uLC:{value:e},uLR:{value:s},uAmbLo:{value:new d("#0a0807")},uAmbHi:{value:new d("#231b13")},uMoonDir:{value:new p(.36,.88,.3).normalize()},uMoonCol:{value:new d("#33436a")},uFogCol:{value:new d("#0b0908")},uFogK:{value:.012},uT:{value:0}}}}function le(a,e,s,n,t,o,r,i){a.LP[e].set(s,n,t),a.LC[e].set(o[0]*r,o[1]*r,o[2]*r),a.LR[e]=1/(i*i)}const ue=[1,.72,.42],y={transparent:!0,depthWrite:!1,blending:U,blendEquation:I,blendSrc:b,blendDst:b,blendSrcAlpha:O,blendDstAlpha:b},L=`
  float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float h31(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }
  float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); vec3 u = f * f * (3. - 2. * f);
    return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), u.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), u.x), u.y),
               mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), u.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), u.x), u.y), u.z); }
  float fbm2(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * vn2(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
  float fbm3(vec3 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * vn3(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= .5; } return v; }
`,_=`
  uniform vec3 uLP[8]; uniform vec3 uLC[8]; uniform float uLR[8];
  uniform vec3 uAmbLo; uniform vec3 uAmbHi; uniform vec3 uMoonDir; uniform vec3 uMoonCol; uniform vec3 uFogCol; uniform float uFogK; uniform float uT;
  vec3 marbleCol(vec3 q, vec3 base, vec3 vein){
    float w = fbm3(q * .55 + 4.1);
    float t = q.x * .8 + q.y * .45 + q.z * .6 + (w - .5) * 5.;
    float a = abs(sin(t * 1.5 + fbm3(q * 1.3) * 2.6));
    float v1 = pow(1. - a, 9.);
    float b = abs(sin(t * 3.4 + 1.3 + fbm3(q * 2.5 + 7.) * 3.2));
    float v2 = pow(1. - b, 14.) * .55;
    float cloud = fbm3(q * .8 + 11.2);
    vec3 c = base * (.9 + .16 * cloud);
    return mix(c, vein, clamp((v1 + v2) * (.25 + .75 * smoothstep(.3, .75, w)), 0., 1.) * .85);
  }
  // a bump from a height field's screen derivatives (Mikkelsen)
  vec3 bumpN(vec3 N, vec3 P, float h, float k){
    vec3 dpx = dFdx(P), dpy = dFdy(P); float hx = dFdx(h), hy = dFdy(h);
    vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
    vec3 g = sign(det) * (hx * r1 + hy * r2);
    return normalize(abs(det) * N - k * g);
  }
  vec3 envTex(vec3 r){
    float up = r.y * .5 + .5;
    vec3 c = mix(uAmbLo * 1.4, uAmbHi * 2.6, up * up);
    c += uMoonCol * 3.2 * smoothstep(.6, .96, r.y);
    c += uMoonCol * .7 * smoothstep(.8, .98, abs(r.x)) * smoothstep(-.1, .4, r.y);
    c += vec3(.5, .32, .16) * .3 * smoothstep(.55, 0., abs(r.y - .12));
    return c;
  }
  vec3 shade(vec3 P, vec3 N, vec3 V, vec3 alb, float gloss, float spec, float wrap, float mir, float sss, vec3 sc){
    vec3 diff = mix(uAmbLo, uAmbHi, N.y * .5 + .5) * alb, sp = vec3(0.);
    for (int i = 0; i < 8; i++){
      vec3 L = uLP[i]; if (mir > .5) L.y = -L.y;
      vec3 d = L - P; float d2 = dot(d, d); float att = 1. / (1. + d2 * uLR[i]);
      vec3 Ld = d * inversesqrt(max(d2, 1e-4)); float nl = dot(N, Ld);
      float lam = max((nl + wrap) / (1. + wrap), 0.);
      vec3 lc = uLC[i] * att;
      diff += alb * lc * lam;
      diff += sss * lc * alb * vec3(1., .5, .32) * pow(1. - abs(nl), 3.) * .3;
      vec3 H = normalize(Ld + V);
      sp += lc * pow(max(dot(N, H), 0.), gloss) * step(0., nl);
    }
    vec3 md = uMoonDir; if (mir > .5) md.y = -md.y;
    float nm = dot(N, md);
    diff += alb * uMoonCol * max((nm + wrap * .5) / (1. + wrap * .5), 0.);
    sp += uMoonCol * pow(max(dot(N, normalize(md + V)), 0.), gloss) * step(0., nm);
    return diff + sp * sc * spec * (gloss + 8.) / 48.;
  }
`,G=`
  varying vec3 vW; varying vec3 vN; varying vec3 vNo; varying vec3 vO; varying vec2 vUv; varying float vMir; varying float vAO;
  attribute float aAO;
  void main(){
    vAO = aAO;
    vec4 lp = vec4(position, 1.); vec3 ln = normal;
    #ifdef USE_INSTANCING
      lp = instanceMatrix * lp; ln = mat3(instanceMatrix) * ln;
    #endif
    vec4 w = modelMatrix * lp;
    vW = w.xyz; vO = lp.xyz; vNo = ln; vUv = uv;
    vN = normalize(mat3(modelMatrix) * ln);
    vMir = determinant(mat3(modelMatrix)) < 0. ? 1. : 0.;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,H=`
  varying vec3 vW; varying vec3 vN; varying vec3 vNo; varying vec3 vO; varying vec2 vUv; varying float vMir; varying float vAO;
  uniform float uTwo; uniform float uUseAO;
  struct Surf { vec3 alb; float gloss; float spec; float wrap; float sss; vec3 emi; float refl; float ao; float a; vec3 N; vec3 sc; };
  ${L}
  ${_}
`,$=`
  void main(){
    Surf s; s.alb = vec3(.5); s.gloss = 30.; s.spec = .2; s.wrap = 0.; s.sss = 0.; s.emi = vec3(0.); s.refl = 0.; s.ao = 1.; s.a = 1.; s.sc = vec3(1.);
    s.N = normalize(vN);
    if (uTwo > .5 && !gl_FrontFacing) s.N = -s.N;
    surf(s);
    s.ao *= mix(1., mix(.3, 1., vAO), uUseAO);
    vec3 V = normalize(cameraPosition - vW);
    float nv = clamp(dot(s.N, V), 0., 1.);
    vec3 col = shade(vW, s.N, V, s.alb, s.gloss, s.spec, s.wrap, vMir, s.sss, s.sc) * s.ao;
    if (s.refl > 0.) col += envTex(reflect(-V, s.N)) * s.sc * s.refl * (.2 + .8 * pow(1. - nv, 4.)) * s.ao;
    col += s.emi;
    float dist = length(cameraPosition - vW);
    col = mix(col, uFogCol, 1. - exp(-dist * uFogK));
    gl_FragColor = vec4(col, s.a);
  }`;function c(a,e){return new h({uniforms:{...a.u,uTwo:{value:e.twoSided?1:0},uUseAO:{value:0},...e.uniforms??{}},vertexShader:G,fragmentShader:H+(e.pars??"")+e.surf+$,side:e.twoSided?T:V,transparent:!!e.transparent})}const u=a=>({value:new d(a)}),j=`
  uniform vec3 uBase; uniform vec3 uVein; uniform float uScale; uniform float uGloss; uniform float uSss; uniform float uRefl;
  uniform sampler2D uEng; uniform float uHasEng; uniform float uWorld;
  void surf(inout Surf s){
    vec3 p = (uWorld > .5 ? vW : vO) * uScale;
    s.alb = marbleCol(p, uBase, uVein);
    s.alb *= 1. + (vn3(vO * 90.) - .5) * .06;
    s.gloss = uGloss; s.spec = .55; s.wrap = .42; s.sss = uSss; s.refl = uRefl;
    if (uHasEng > .5 && vNo.z > .5){
      float e = texture2D(uEng, vUv).r, e2 = texture2D(uEng, vUv + vec2(.0012, -.0022)).r;
      s.alb = mix(s.alb, s.alb * .4, e);
      s.alb += vec3(.9, .84, .7) * max(e2 - e, 0.) * .2;
      s.spec *= 1. - e * .8;
    }
  }`;function ce(a,e={}){return c(a,{surf:j,uniforms:{uBase:u(e.base??"#efe9dc"),uVein:u(e.vein??"#8f8a82"),uScale:{value:e.scale??1.5},uGloss:{value:e.gloss??70},uSss:{value:e.sss??.55},uRefl:{value:e.refl??.16},uEng:{value:e.eng??null},uHasEng:{value:e.eng?1:0},uWorld:{value:e.world?1:0},uUseAO:{value:e.ao?1:0}}})}const Y=`
  void surf(inout Surf s){
    float n1 = vn3(vW * 55.);
    vec3 gn = vec3(n1 - .5, vn3(vW * 120. + 3.) - .5, vn3(vW * 80. + 9.) - .5);
    s.N = normalize(s.N + gn * .1);
    float wear = smoothstep(.62, .85, vn3(vW * 7.));
    vec3 gold = mix(vec3(1., .66, .26), vec3(.95, .78, .42), n1);
    s.alb = mix(gold * .2, vec3(.22, .07, .04), wear * .4);
    s.gloss = 70.; s.spec = 1.5; s.sc = gold; s.refl = .95;
  }`,ve=(a,e=!1)=>c(a,{surf:Y,twoSided:e}),J=`
  void surf(inout Surf s){
    s.alb = vec3(.18, .12, .05); s.gloss = 90.; s.spec = 1.3; s.sc = vec3(1., .72, .36); s.refl = .8;
  }`,fe=a=>c(a,{surf:J}),Z=`
  void surf(inout Surf s){
    float w = vn2(vUv * 150.) * .5 + vn2(vUv.yx * 310.) * .5;
    float fold = fbm2(vUv * 18.);
    s.alb = vec3(.88, .85, .78) * (.88 + .16 * w) * (.92 + .1 * fold);
    s.gloss = 8.; s.spec = .05; s.wrap = .7; s.sss = 1.;
  }`,me=a=>c(a,{surf:Z,twoSided:!0}),Q=`
  uniform float uOn; uniform vec3 uGlow;
  void surf(inout Surf s){
    s.alb = vec3(.3); s.gloss = 60.; s.spec = .4; s.emi = uGlow * (.06 + uOn * 3.2);
  }`,pe=a=>c(a,{surf:Q,uniforms:{uOn:{value:0},uGlow:u("#ffd9a0")}}),X=`
  uniform float uBay; uniform float uWin; uniform float uTop; uniform vec3 uStoneA; uniform vec3 uStoneB; uniform float uCur; uniform float uJoint; uniform float uVar;
  float sdBox2(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
  void surf(inout Surf s){
    float u = vUv.x, v = vUv.y;
    float row = floor(v / .6), off = mod(row, 2.) * .8, bu = u + off;
    float bid = floor(bu / 1.6) + row * 31.;
    vec2 cell = vec2(fract(bu / 1.6), fract(v / .6));
    float edge = min(min(cell.x, 1. - cell.x) * 1.6, min(cell.y, 1. - cell.y) * .6);
    float joint = smoothstep(.014, .0, edge) * uJoint;
    vec3 stone = mix(uStoneA, uStoneB, .5 + (h21(vec2(bid, 7.3)) - .5) * uVar);
    stone *= 1. + (fbm2(vec2(bu * .9, v * 1.4) + bid) - .5) * uVar * 1.1;
    float h = -joint * .6 + fbm2(vec2(u, v) * 9.) * .12;
    float bu2 = mod(u, uBay) - uBay * .5;
    float pe = uBay * .5 - abs(bu2);                 // metres from the nearest bay joint
    float pil = smoothstep(.5, .46, pe);             // pilaster, .5 m each side of the joint
    float flute = smoothstep(.2, .5, abs(fract(u * 9.) - .5) * 2.);
    stone = mix(stone, stone * 1.18 + vec3(.03, .025, .015), pil);
    h += pil * (.55 - flute * .12) * smoothstep(0., 7.2, uTop - v + 3.);
    // dado: a recessed, darker polished panel
    float panel = sdBox2(vec2(bu2, v - .78), vec2(uBay * .5 - .66, .52));
    float inP = smoothstep(.01, -.01, panel) * (1. - pil);
    stone = mix(stone, stone * .5 + marbleCol(vec3(u, v, 1.3) * .8, vec3(.32, .2, .13), vec3(.12, .07, .04)) * .5, inP * step(v, 1.5));
    h += -inP * .5 * step(v, 1.5) + smoothstep(.0, .06, -panel) * .15;
    h += smoothstep(.04, .0, abs(v - 1.58)) * .4;                         // chair rail
    // arched windows
    vec3 emi = vec3(0.);
    if (uWin > .5){
      float wr = sdBox2(vec2(bu2, v - 4.2), vec2(1.0, 1.3)), wc = length(vec2(bu2, v - 5.5)) - 1.0;
      float sd = min(wr, wc);
      float win = smoothstep(.012, -.012, sd) * (1. - pil);
      vec3 sky = mix(vec3(.012, .02, .05), vec3(.05, .09, .19), smoothstep(2.9, 6.5, v));
      sky += vec3(.45, .55, .8) * exp(-length(vec2(bu2 + .3, v - 5.1)) * 2.6) * .4;
      float city = step(.992, h21(floor(vec2(bu2 * 9., v * 9.)))) * smoothstep(3.6, 3.0, v);
      sky += vec3(1., .7, .4) * city * .5;
      float bar = max(smoothstep(.04, .03, abs(bu2)), smoothstep(.04, .03, abs(v - 4.3)));
      bar = max(bar, smoothstep(.04, .03, abs(sd + .35)) * step(5.5, v));
      emi = sky * win * (1. - bar) * 1.4;
      float fr = smoothstep(.34, .06, sd) * (1. - win) * (1. - pil);
      stone = mix(stone, stone * 1.22, fr);
      stone = mix(stone, vec3(.045, .032, .02), win * bar);
      h += -win * .9 + fr * .45 + smoothstep(.02, .14, -sd) * smoothstep(.2, .1, -sd) * .3;
      s.refl = win * (1. - bar) * .5;
    }
    // cornice
    float ct = uTop - v;
    float cor = smoothstep(.9, .8, ct) * step(0., ct) * (.5 + .5 * sin(ct * 22.));
    h += cor * .5 + smoothstep(.1, .0, ct) * step(0., ct) * .4;
    stone *= mix(1., .62, smoothstep(.32, .0, ct) * step(0., ct));
    s.alb = stone;
    s.ao = mix(.5, 1., smoothstep(0., 1.3, v)) * mix(.78, 1., smoothstep(0., .5, abs(bu2) * 0. + pe + .2));
    s.N = bumpN(s.N, vW, h * .02, .6);
    s.gloss = 22.; s.spec = .1; s.wrap = .35;
    s.emi = emi;
  }`;function de(a,e){return c(a,{surf:X,uniforms:{uBay:{value:e.bay},uWin:{value:e.win},uTop:{value:e.top},uStoneA:u(e.a??"#8b6b4a"),uStoneB:u(e.b??"#a88458"),uCur:{value:0},uJoint:{value:e.joint??1},uVar:{value:e.vary??1}}})}const ee=`
  uniform float uMode; uniform float uRef;
  void surf(inout Surf s){
    vec2 p = vW.xz;
    vec3 cream = vec3(.86, .78, .62), dark = vec3(.12, .075, .05), mid = vec3(.46, .31, .19);
    float isDark = 0., ring = 0.;
    if (uMode < .5){
      float ax = abs(p.x);
      vec2 q = vec2(ax, mod(p.y + 5., 10.) - 5.);
      float d = max(q.x / 3.9, abs(q.y) / 4.75);
      if (d < 1.){ float f = fract(d * 6.); isDark = step(.13, f) * step(f, .3) + step(.58, f) * step(f, .66); ring = 1.; }
      if (d > 1.){   // the field beside the runner: diamonds of two marbles
        vec2 r = vec2(p.x + p.y, p.x - p.y) * .7071 / 1.35; vec2 tc = floor(r);
        isDark = mod(tc.x + tc.y, 2.) * .85; vec2 fr = abs(fract(r) - .5);
        isDark = max(isDark, step(.46, max(fr.x, fr.y)) * .9);
      }
      isDark = max(isDark, step(abs(ax - 6.55), .05) + step(abs(ax - 6.3), .02));
    } else {
      float rr = length(p), ang = atan(p.y, p.x);
      float f = fract(rr / 2.2);
      isDark = step(.08, f) * step(f, .16) + step(.5, f) * step(f, .54);
      float chk = mod(floor(rr / 1.1) + floor(ang / 6.28318 * 40.), 2.);
      isDark = max(isDark, chk * step(rr, 17.) * step(7., rr) * .8);
    }
    vec3 pat = mix(marbleCol(vec3(p.x, 0., p.y) * .9, cream, vec3(.55, .42, .28)), marbleCol(vec3(p.x, 3., p.y) * 1.1, dark, vec3(.4, .28, .18)), clamp(isDark, 0., 1.));
    pat = mix(pat, mid, .0);
    float tile = 1.35;
    vec2 tg = abs(fract(p / tile) - .5) * tile;
    float grout = smoothstep(.012, .0, .5 * tile - max(tg.x, tg.y));
    pat *= 1. - grout * .5;
    s.alb = pat; s.gloss = 140.; s.spec = 1.; s.wrap = .0;
    vec3 V = normalize(cameraPosition - vW);
    float fres = pow(1. - clamp(dot(vec3(0., 1., 0.), V), 0., 1.), 4.);
    float R = mix(.2, .72, fres) * uRef * mix(1., .75, clamp(isDark, 0., 1.) * 0. + (1. - clamp(isDark, 0., 1.)) * .25);
    s.a = 1. - R;
    s.N = normalize(s.N + (vec3(vn2(p * 40.), 0., vn2(p * 40. + 9.)) - .5) * .015);
  }`;function xe(a,e,s=1){return c(a,{surf:ee,uniforms:{uMode:{value:e},uRef:{value:s}},transparent:!0})}const ae=`
  uniform float uMid; uniform float uSky;
  void surf(inout Surf s){
    float u = vUv.x, v = vUv.y;
    float sk = abs(v - uMid);
    float glass = smoothstep(2.1, 1.9, sk);
    vec2 cs = vec2(u, v) / 1.9, cf = fract(cs) - .5;
    float e = min(.5 - abs(cf.x), .5 - abs(cf.y));          // 0 at a coffer's rim
    float inside = smoothstep(.09, .15, e);
    float h = -inside * .7 + smoothstep(0., .05, e) * .2;
    float ros = smoothstep(.1, .08, length(cf));
    vec3 plaster = vec3(.5, .4, .29) * (.8 + .3 * fbm2(vec2(u, v) * 3.));
    s.alb = mix(plaster, vec3(.9, .62, .22), ros * inside);
    s.sc = mix(vec3(1.), vec3(1., .72, .36), ros);
    s.spec = .12 + ros * 1.2; s.gloss = 40.; s.wrap = .4; s.ao = mix(.55, 1., inside);
    s.N = bumpN(s.N, vW, h * .015, .6);
    // the skylight: ribbed glass with the moon-coloured night behind
    float rib = smoothstep(.06, .03, abs(fract(u / 1.9) - .5) * 1.9 - .87 + .0) ;
    float ribs = smoothstep(.07, .0, abs(fract(u / 1.9 + .5) - .5) * 1.9);
    vec3 night = mix(vec3(.05, .08, .17), vec3(.16, .22, .38), smoothstep(2.1, 0., sk)) * uSky;
    night += vec3(.5, .6, .9) * exp(-length(vec2(u - 12., v - uMid)) * .35) * .5 * uSky;
    s.emi = night * glass * (1. - ribs * .85);
    s.alb = mix(s.alb, vec3(.04, .03, .02), glass * ribs);
    s.ao = mix(s.ao, 1., glass);
  }`,he=(a,e)=>c(a,{surf:ae,uniforms:{uMid:{value:e},uSky:{value:1}}});function be(a,e){return new h({...y,depthTest:!1,uniforms:{uC:u(a),uK:{value:0},uS:{value:e}},vertexShader:"uniform float uS; varying vec2 vP; void main(){ vP = position.xy; vec4 c = viewMatrix * modelMatrix * vec4(0., 0., 0., 1.); c.xy += position.xy * uS; gl_Position = projectionMatrix * c; }",fragmentShader:"uniform vec3 uC; uniform float uK; varying vec2 vP; void main(){ float d = length(vP) * 2.; float g = exp(-d * d * 3.4) * .9 + exp(-d * 5.5) * .4; gl_FragColor = vec4(uC * g * uK, 0.); }"})}function ge(a){return new h({...y,side:T,depthTest:!0,uniforms:{uC:u(a),uK:{value:0},uT:{value:0}},vertexShader:"varying vec3 vP; varying vec3 vN; varying vec3 vW; void main(){ vP = position; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uC; uniform float uK, uT; varying vec3 vP; varying vec3 vN; varying vec3 vW; ${L}
      void main(){
        float nv = abs(dot(normalize(vN), normalize(cameraPosition - vW)));
        float along = smoothstep(.5, .26, abs(vP.y));
        float n = .55 + .9 * fbm3(vec3(vP.x * 5. + uT * .02, vP.y * 2. - uT * .05, vP.z * 5.));
        float a = pow(nv, 1.6) * along * n * uK;
        gl_FragColor = vec4(uC * a, 0.);
      }`})}function ye(a,e){const s=new W,n=a.length/3,t=new Float32Array(n);for(let i=0;i<n;i++)t[i]=Math.sin(i*12.9898)*43758.5453%1,t[i]=Math.abs(t[i]);s.setAttribute("position",new M(a,3)),s.setAttribute("aR",new M(t,1));const o=new h({...y,uniforms:{uC:u(e),uK:{value:0},uT:{value:0},uPx:{value:800}},vertexShader:`attribute float aR; uniform float uT, uPx; varying float vA;
      void main(){
        vec3 p = position + vec3(sin(uT * .21 + aR * 40.), cos(uT * .17 + aR * 23.) * .6 - uT * .0, sin(uT * .19 + aR * 11.)) * .45;
        p.y += mod(uT * .05 * (.4 + aR) + aR * 9., 1.) * .0;
        vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.);
        gl_PointSize = clamp(uPx * .0042 * (.5 + aR) * 9. / max(-mv.z, 1.), 1., 5.);
        vA = .35 + .65 * (.5 + .5 * sin(uT * (.6 + aR) + aR * 50.));
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:"uniform vec3 uC; uniform float uK; varying float vA; void main(){ float d = length(gl_PointCoord - .5) * 2.; float a = smoothstep(1., .1, d) * vA * uK; gl_FragColor = vec4(uC * a, 0.); }"}),r=new z(s,o);return r.frustumCulled=!1,r}const oe=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,te=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,m={x:0,y:0,t:-1};function we(a,e,s){if(m.t!==e){m.t=e;const n=a.pointer.inside&&!te&&!oe;m.x=A(m.x,n?a.pointer.x:0,2.6,s),m.y=A(m.y,n?a.pointer.y:0,2.6,s)}return m}const N=new p,R=new p(0,1,0),g=new D,C=new p,E=new p;function Se(a,e,s,n,t,o=1){N.copy(s).sub(e).setLength(Math.min(6,e.distanceTo(s))).add(e),g.lookAt(e,s,R),C.setFromMatrixColumn(g,0),E.setFromMatrixColumn(g,1),a.position.copy(e).addScaledVector(C,n*.3*o).addScaledVector(E,t*.18*o),a.up.copy(R),a.lookAt(N),a.rotateZ(-n*.014),a.updateMatrixWorld()}const Me=a=>{const e=typeof location<"u"?new URLSearchParams(location.search).get(a):null;return e===null?null:Number(e)},Ae=()=>Promise.allSettled([document.fonts.load('600 100px "Fraunces Variable"',"Aa"),document.fonts.load('italic 600 100px "Fraunces Variable"',"Aa"),document.fonts.load("700 100px Amiri","ابت"),document.fonts.load("400 100px Amiri","ابت"),document.fonts.load('500 100px "Inter Variable"',"Aa"),document.fonts.load('500 100px "JetBrains Mono Variable"',"Aa"),document.fonts.load('700 100px "Cairo Variable"',"ابت")]),Ne=a=>a.replace(/\d/g,e=>"٠١٢٣٤٥٦٧٨٩"[+e]),se=(a,e)=>e?{still:a.poster,clip:a.loop.replace(/loop\.mp4$/,"hero-tall.mp4")}:{still:a.card,clip:a.loop};function Re(a,e,s){const n=se(e,s);let t=null,o=null,r=null;return a.textures.image(n.still).then(i=>{t=i}).catch(()=>{}),{frame(i){if(i&&!o){const v=a.textures.video(n.clip);o=v.video,r=v.texture}o&&(i&&o.paused&&o.play().catch(()=>{}),!i&&!o.paused&&o.pause());const l=!!(i&&o&&o.readyState>=2);return l?{tex:r,live:l}:{tex:t,live:!1}},pause(){o&&!o.paused&&o.pause()},still:()=>t}}function Ce(a,e,s,n=1024){const t=document.createElement("canvas"),o=t.getContext("2d");t.width=n,t.height=Math.round(n/s),o.fillStyle="#000",o.fillRect(0,0,t.width,t.height),o.fillStyle="#fff",o.textAlign="center",o.textBaseline="middle",o.direction=e?"rtl":"ltr";const r=e?"Amiri, serif":'"Fraunces Variable", Georgia, serif',i=(P,F,w,k,S=0)=>{let f=F;for(o.font=`${w} ${f}px ${r}`,o.letterSpacing=`${e?0:S*f}px`;o.measureText(P).width>k&&f>8;)f*=.94,o.font=`${w} ${f}px ${r}`,o.letterSpacing=`${e?0:S*f}px`;return f},l=t.height,v=t.width;i(a[0],l*(a[1]?.34:.5),700,v*.88,.06),o.fillText(a[0],v/2,a[1]?l*.36:l*.5),a[1]&&(i(a[1],l*.17,500,v*.9,.05),o.fillText(a[1],v/2,l*.72));const x=new B(t);return x.colorSpace=K,x.anisotropy=8,x.minFilter=q,x}function Ee(a,e,s=.03){const n=a.length;if(e>=a[n-1])return n-1;if(e<=a[0])return 0;let t=0;for(;t<n-2&&e>=a[t+1];)t++;const o=a[t],r=a[t+1],i=Math.min(s,(r-o)*.22),l=Math.min(1,Math.max(0,(e-o-i)/(r-o-2*i)));return t+(l<.5?4*l*l*l:1-Math.pow(-2*l+2,3)/2)}function Te(a,e,s,n,t){if(Math.abs(e)<1e-4&&Math.abs(s)<1e-4){a.clearViewOffset();return}a.setViewOffset(n,t,-e*n/2,s*t/2,n,t)}const Le={stops:[.14,.31,.48,.64,.79,.95]},ne=(a,e=15)=>+(.075+a*(.885/Math.max(1,e-1))).toFixed(4),Pe={stops:Array.from({length:15},(a,e)=>ne(e))},Fe={sweep1:[.1,.42],sweep2:[.52,.88]},ke={stops:[.13,.27,.41,.55,.69,.83]},Oe={star:{en:["THE SOLUTION MACHINE","MAPS MANUAL WORK, BUILDS THE INTERNAL TOOL, VERIFIES THE RESULT"],ar:["آلة الحلول","يرسم العمل اليدوي، ويبني الأداة الداخلية، ويتحقق من النتيجة"]},mk:{en:["MK","FIFTEEN APPS · FIFTEEN FILMS"],ar:["MK","خمسة عشر تطبيقاً · خمسة عشر فيلماً"]},phone:{en:["MK VOICE","YOUR VOICE. NINE WORLDS. ONE STUDIO."],ar:["MK VOICE","صوتك. تسعة عوالم. استوديو واحد."]},laptop:{en:["ENGINEERING SMART SYSTEM","A PERSON AT EVERY GATE"],ar:["ENGINEERING SMART SYSTEM","والإنسان حاضر عند كل بوابة"]},controller:{en:["MK SUITE","EIGHTEEN APPS IN ONE LAUNCHER"],ar:["MK SUITE","ثمانية عشر تطبيقًا في مشغّل واحد"]}},Ie=[{no:"2026.206",head:{en:"Paid social pilot, 2026",ar:"تجربة الإعلانات المدفوعة، ٢٠٢٦"},big:{en:"206",ar:"٢٠٦"},line:{en:"leads, on WhatsApp",ar:"عميلاً محتملاً عبر واتساب"},sub:{en:"$172.78 spent · about $0.84 a lead · best campaign $0.50",ar:"١٧٢٫٧٨ دولار أُنفقت · نحو ٠٫٨٤ دولار للعميل · أفضل حملة ٠٫٥٠"}},{no:"2025.878",head:{en:"Paid social, 2025–2026",ar:"الإعلانات المدفوعة، ٢٠٢٥–٢٠٢٦"},big:{en:"≈878K",ar:"≈٨٧٨ ألف"},line:{en:"impressions",ar:"ظهور"},sub:{en:"420+ leads and calls · $0.84 to $3.12 a lead",ar:"+٤٢٠ عميل محتمل ومكالمة · من ٠٫٨٤ إلى ٣٫١٢ دولار"}},{no:"2026.012",head:{en:"A bilingual CRM, built in-house",ar:"نظام CRM ثنائي اللغة، مبني داخلياً"},big:{en:"12",ar:"١٢"},line:{en:"tabs, 45 active leads",ar:"تبويباً و٤٥ عميلاً نشطاً"},sub:{en:"200+ contacts captured · 22 offers routed to the sales engineer",ar:"+٢٠٠ جهة اتصال · ٢٢ عرضاً حُوّلت إلى مهندس المبيعات"}},{no:"2025.1M",head:{en:"Al-Ma’ali Satellite Channel · Facebook",ar:"قناة المعالي الفضائية · فيسبوك"},big:{en:"9.2K → 1M+",ar:"٩٫٢ ألف ← +١ مليون"},line:{en:"followers, 2021–2025",ar:"متابع، ٢٠٢١–٢٠٢٥"},sub:{en:"Instagram 3K → 50K · TikTok 0 → 33K · YouTube 0 → 43K",ar:"إنستغرام ٣ آلاف ← ٥٠ ألفاً · تيك توك ٠ ← ٣٣ ألفاً · يوتيوب ٠ ← ٤٣ ألفاً"}},{no:"2024.AI",head:{en:"Education",ar:"التعليم"},big:{en:"BSc",ar:"بكالوريوس"},line:{en:"Artificial Intelligence, 2020–2024",ar:"الذكاء الاصطناعي، ٢٠٢٠–٢٠٢٤"},sub:{en:"Egyptian Russian University · Verified AI Engineer Certification, Sahl",ar:"الجامعة المصرية الروسية · شهادة مهندس ذكاء اصطناعي مُعتمد، سهل"}},{no:"2026.015",head:{en:"The collection",ar:"المجموعة"},big:{en:"15",ar:"١٥"},line:{en:"apps, fifteen films",ar:"تطبيقاً، وخمسة عشر فيلماً"},sub:{en:"Kuwait · Automation Engineer",ar:"الكويت · مهندس أتمتة"}}];export{Ie as A,Pe as G,Le as H,Oe as I,Fe as R,ue as W,c as a,fe as b,Ee as c,le as d,Ae as e,xe as f,ve as g,ce as h,y as i,be as j,ke as k,Se as l,re as m,Ne as n,pe as o,we as p,Me as q,Re as r,Te as s,me as t,Ce as u,he as v,de as w,ge as x,ye as y};
