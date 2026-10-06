import{m as Ce,i as R,C as S,V as A,M as q,I as Re,s as L,B as Z,aD as X,H as $,bg as pe,S as B,af as Te,a as Q,ai as De,aj as Oe,b9 as Le,ba as We,P as Ne,ay as Fe,aC as k,o as p,r as h,a2 as he,p as Ge}from"./EditionWorld.astro_astro_type_script_index_0_lang.DjiVaGuA.js";import{N as E,F as Ae,a as O,m as Be,s as ge,q as qe,d as Ue,n as Pe,c as je,p as Ve,l as $e}from"./common.Den9xvki.js";import{s as Ee}from"./snow.2CpLRtdg.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const we=new L(1.935,1),_e=()=>Re.map(e=>e.map(([i,n])=>new L(i-we.x,n-we.y))),xe=`
  uniform vec2 uM[12]; uniform vec2 uK[12];
  float sdPolyM(vec2 p){
    float d = dot(p - uM[0], p - uM[0]), s = 1.;
    for (int i = 0, j = 11; i < 12; j = i, i++){
      vec2 e = uM[j] - uM[i], w = p - uM[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
      d = min(d, dot(b, b));
      bvec3 c = bvec3(p.y >= uM[i].y, p.y < uM[j].y, e.x * w.y > e.y * w.x);
      if (all(c) || all(not(c))) s *= -1.;
    }
    return s * sqrt(d);
  }
  float sdPolyK(vec2 p){
    float d = dot(p - uK[0], p - uK[0]), s = 1.;
    for (int i = 0, j = 11; i < 12; j = i, i++){
      vec2 e = uK[j] - uK[i], w = p - uK[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
      d = min(d, dot(b, b));
      bvec3 c = bvec3(p.y >= uK[i].y, p.y < uK[j].y, e.x * w.y > e.y * w.x);
      if (all(c) || all(not(c))) s *= -1.;
    }
    return s * sqrt(d);
  }
  float markSD(vec2 p){ return min(sdPolyM(p), sdPolyK(p)); }
`,be=()=>{const[e,i]=_e();return{uM:{value:e},uK:{value:i}}},Ke=`
  float dendrite(vec2 p, float g){
    vec2 s = vec2(1., 1.7320508);
    vec2 a = mod(p, s) - s * .5, b = mod(p - s * .5, s) - s * .5;
    vec2 v = dot(a, a) < dot(b, b) ? a : b;
    float h = h21(floor((p - v) * 3.17) + .5);
    float an = h * 6.2832, cs = cos(an), sn = sin(an);
    v = mat2(cs, -sn, sn, cs) * v;
    float r = length(v), th = atan(v.y, v.x);
    float armI = floor((th + 3.6652) / 1.0472);                 // which of the six arms (they grow unevenly, as frost does)
    th = mod(th + .5236, 1.0472) - .5236;                       // onto the nearest of the six arms
    vec2 q = vec2(cos(th), abs(sin(th))) * r;                   // x along the arm, y across it
    float R = (.36 + .16 * h) * g * (.45 + .55 * h21(vec2(armI, h * 17.)));
    float tip = smoothstep(R, R - .05, q.x);
    float arm = smoothstep(.016, .005, q.y) * tip;
    float sB = q.y / .866, x0 = q.x - .5 * sB, sp = .085;      // the side branch through q leaves the arm at x0
    float k = floor(x0 / sp + .5) * sp;
    float bl = max(R - k, 0.) * .5;
    vec2 bq = q - vec2(k, 0.);
    float al = clamp(dot(bq, vec2(.5, .866)), 0., bl);
    float br = smoothstep(.012, .004, length(bq - al * vec2(.5, .866))) * step(.04, k) * step(k, R);
    return max(arm, br) * step(.001, g);
  }
`;function He({env:e,bg:i,depth:n=.62,quality:r}){const a=Ce(n),l=r===0?3:5,c=new R({uniforms:{uEnv:{value:e},tBg:{value:i??null},uHasBg:{value:i?1:0},uSunDir:{value:new A(.6,.1,-.8).normalize()},uSunCol:{value:new S(5,4.2,3.2)},uTime:{value:0},uGrow:{value:1},uClear:{value:1},uSweep:{value:-9},uLight:{value:1},uEnvGain:{value:1},uDepth:{value:n},uFrostCol:{value:new S("#eef5fb")},uTrace:{value:.1},uAbsorb:{value:1},uBubbles:{value:1},...be()},vertexShader:`
      varying vec3 vW, vN, vO;
      void main(){
        vO = position;
        vec4 w = modelMatrix * vec4(position, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform samplerCube uEnv; uniform sampler2D tBg; uniform mat4 modelMatrix, projectionMatrix;
      uniform vec3 uSunDir, uSunCol, uFrostCol; uniform float uHasBg, uTime, uGrow, uClear, uSweep, uLight, uEnvGain, uDepth, uTrace, uAbsorb, uBubbles;
      varying vec3 vW, vN, vO;
      ${E}
      ${xe}
      ${Ke}
      vec3 env(vec3 d, float lod){ return textureLod(uEnv, d, lod).rgb * uEnvGain; }
      // what lies behind, in world direction d: the picture behind the block where the bent ray lands on screen
      vec3 behind(vec3 d, float lod){
        vec4 c = projectionMatrix * (viewMatrix * vec4(d, 0.));
        vec3 s = textureLod(tBg, clamp(c.xy / max(c.w, 1e-3) * .5 + .5, .002, .998), lod).rgb;
        return uHasBg > .5 ? s : env(d, lod);
      }
      vec3 film(float t){ return .5 + .5 * cos(6.2832 * (vec3(0., .33, .67) + t)); }
      // the three fractures: planes through the letters, each a ragged disc (centre, radius)
      const vec3 FN0 = vec3(.62, .48, .62), FN1 = vec3(-.55, .78, .3), FN2 = vec3(.2, -.42, .88);
      const vec3 FC0 = vec3(-1.05, .35, 0.), FC1 = vec3(.95, -.25, 0.), FC2 = vec3(1.45, .55, 0.);
      vec4 crack(vec3 o, vec3 rd, float L, vec3 n, vec3 c, float R, vec3 rdW, out vec3 nW){
        n = normalize(n); nW = normalize(mat3(modelMatrix) * n);
        float dn = dot(n, rd); if (abs(dn) < 1e-3) return vec4(0.);
        float t = dot(n, c - o) / dn; if (t < 0. || t > L) return vec4(0.);
        vec3 h = o + rd * t;
        float rr = length(h - c) + (vnoise(h.xy * 4.) - .5) * .55 + (vnoise(h.xy * 17.) - .5) * .12;
        float m = smoothstep(R, R - .03, rr) * (.6 + .4 * vnoise(h.xy * 9. + 2.));
        float graze = pow(1. - abs(dn), 1.5);
        vec3 refl = env(reflect(rdW, nW), 1.);
        vec3 col = refl * (.1 + .55 * graze) + film(vnoise(h.xy * 2.6) * 1.6 + dot(rdW, nW) * 1.3) * (.05 + .14 * graze);
        col += uSunCol * pow(max(dot(reflect(rdW, nW), uSunDir), 0.), 28.) * (.35 + 2.2 * exp(-pow((h.x - uSweep) * 1.4, 2.)));
        col += vec3(.9, .95, 1.) * smoothstep(R - .015, R - .002, rr) * smoothstep(R + .01, R - .002, rr) * .5;   // its lit edge
        return vec4(col * m, m);
      }
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec3 N = normalize(vN);
        // the face is never quite flat: slow melt ripples
        vec2 rp = vO.xy * 3.1 + vO.z;
        N = normalize(N + (vec3(vnoise(rp), vnoise(rp + 5.2), vnoise(rp + 9.4)) - .5) * .05);
        float cosi = clamp(dot(-V, N), 0., 1.);
        float F = .02 + .98 * pow(1. - cosi, 5.);
        vec3 R = reflect(V, N);
        vec3 refl = env(R, 0.) + uSunCol * pow(max(dot(R, uSunDir), 0.), 900.) * 6.;
        // into the ice: each colour bent by its own index
        vec3 tR = refract(V, N, 1. / 1.302), tG = refract(V, N, 1. / 1.309), tB = refract(V, N, 1. / 1.318);
        mat3 toObj = transpose(mat3(modelMatrix));
        vec3 rd = normalize(toObj * tG), No = normalize(toObj * vN);
        float sd0 = markSD(vO.xy);
        // where it leaves: through the back face, or (near the edges, and in through a wall) through the far wall
        float zb = -(uDepth * .5 + .06);
        float tCap = rd.z < -1e-3 ? (zb - vO.z) / rd.z : 9.;
        vec2 fl = normalize(rd.xy + 1e-5);
        float tWall = abs(No.z) > .6 ? max(-sd0, .004) / max(length(rd.xy), 1e-3) : .42 / max(dot(rd.xy, -normalize(No.xy + 1e-5)), .05);
        bool viaWall = tWall < tCap;
        float L = clamp(min(tCap, tWall), .02, 2.2);
        vec3 nOut = viaWall ? normalize(mat3(modelMatrix) * vec3(abs(No.z) > .6 ? fl : -normalize(No.xy + 1e-5), 0.)) : normalize(mat3(modelMatrix) * vec3(0., 0., -1.));
        // bubbles: a few depth layers of small spheres, gathered in drifting columns
        float glow = 0., shade = 0.;
        for (int k = 0; k < ${l}; k++){
          float s = (float(k) + .5) / ${l}.;
          vec3 q = vO + rd * L * s;
          float cl = smoothstep(.55, .85, vnoise(vec2(q.x * 2.4, q.y * .45 + float(k) * 3.1)));   // columns of bubbles
          vec2 c = q.xy * vec2(10., 7.) + float(k) * vec2(3.7, 1.9);
          vec2 id = floor(c), f = fract(c) - .5, h = h22(id);
          float on = step(h.x, (.015 + .4 * cl * cl) * uBubbles);
          vec2 d = (f - (h22(id + 4.1) - .5) * .45) * vec2(1., .55 + .7 * h.y);
          float r = .06 + .14 * h.y * h.y, dd = length(d) / r;
          glow += on * (smoothstep(1., .86, dd) - smoothstep(.86, .6, dd) * .8 + smoothstep(.28, 0., length(d / r - vec2(-.32, .36))) * 1.2);
          shade += on * smoothstep(.8, .3, dd);
        }
        // three fractures: thin mirrors inside
        vec3 n0, n1, n2;
        vec3 rdW = normalize(tG);
        vec4 c0 = crack(vO, rd, L, FN0, FC0, .95, rdW, n0), c1 = crack(vO, rd, L, FN1, FC1, .8, rdW, n1), c2 = crack(vO, rd, L, FN2, FC2, .6, rdW, n2);
        // out through a face that is never quite flat; past a fracture the view is shifted
        vec3 Nb = normalize(nOut + (vec3(vnoise(rp * .7 + 2.), vnoise(rp * .7 + 7.), vnoise(rp * .7 + 4.)) - .5) * .05);
        vec3 bend = (n0 * c0.w + n1 * c1.w + n2 * c2.w) * .045;
        vec3 eR = refract(tR, -Nb, 1.302), eG = refract(tG, -Nb, 1.309), eB = refract(tB, -Nb, 1.318);
        float tir = dot(eG, eG) < .01 ? 1. : 0.;
        if (tir > .5) { eR = reflect(tR, -Nb); eG = reflect(tG, -Nb); eB = reflect(tB, -Nb); }
        float lod = (1. - uLight) * 4.;
        vec3 col = vec3(behind(normalize(eR + bend), lod).r, behind(normalize(eG + bend), lod).g, behind(normalize(eB + bend), lod).b);
        col *= exp(-vec3(.42, .12, .035) * L * uAbsorb);              // the blue of thick ice
        col *= mix(.4, 1., uLight) * (1. - tir * .35);
        col = col * (1. - min(shade, 1.) * .3) + env(-N, 3.) * glow * .14 + uSunCol * glow * .012;
        // light the bubbles and flaws scatter toward you when the sun is behind the ice
        col += uSunCol * pow(max(dot(V, uSunDir), 0.), 18.) * .018 * L * uLight;
        col = col * (1. - F) + refl * F;
        col += uSunCol * pow(max(dot(R, uSunDir), 0.), 70.) * .08 * smoothstep(.85, .3, abs(No.z));   // the bevels catch it
        col += c0.rgb + c1.rgb + c2.rgb;
        // frost: dendrites crystallize along the edges and grow inward, then clear from the sun's side
        float ins = max(-sd0, 0.);
        float g = clamp((uGrow * 1.25 - ins * 3.4) * 1.5 + (vnoise(vO.xy * 7.) - .5) * .5, 0., 1.);
        float cr = max(dendrite(vO.xy * 3.4 + vO.z, g), dendrite(vO.xy * 7. + 3.7, g) * .85);
        float rime = smoothstep(.3, 1., g) * (.3 + .35 * vnoise(vO.xy * 30.));
        float fr = max(cr, rime);
        float side = smoothstep(.75, .1, abs(N.z));                    // the bevels and walls keep a trace
        float across = clamp(vO.x / 3.9 + .5, 0., 1.), fromSun = uSunDir.x > 0. ? 1. - across : across;   // 0 on the sun's side
        float front = uClear * 1.5 - .35;
        float keep = smoothstep(front - .05, front + .2, fromSun + (vnoise(vO.xy * 4.) - .5) * .25);
        fr *= max(keep, uTrace * side * (.5 + .5 * cr));
        vec3 fcol = uFrostCol * (env(N, 4.5) * .7 + behind(V, 5.) * .25 + uSunCol * max(dot(N, uSunDir), 0.) * .1 + .08);
        fcol *= 1. + cr * .45;                                           // the crystals brighter than the rime between them
        float sp = step(.993, h21(floor(vO.xy * 160.) + floor(uTime * 3.))) * pow(max(dot(R, uSunDir), 0.), 4.);
        fcol += uSunCol * sp * .6;
        col = mix(col, fcol, clamp(fr, 0., 1.));
        gl_FragColor = vec4(col, 1.);
      }`});return{mesh:new q(a,c),material:c,uniforms:c.uniforms,dispose(){a.dispose(),c.dispose()}}}const ye="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function Ie(e){const i=e.quality,n=new Z(1,1,{type:$,samples:i?4:0,generateMipmaps:!0,minFilter:X,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),r=[0,1].map(()=>new Z(192,192,{type:$,depthBuffer:!1})),a=new R({vertexShader:ye,depthTest:!1,depthWrite:!1,blending:pe,uniforms:{tPrev:{value:r[0].texture},uA:{value:new L(-9,-9)},uB:{value:new L(-9,-9)},uR:{value:.06},uDecay:{value:.01},uAsp:{value:1},uOn:{value:0},uTime:{value:0}},fragmentShader:`
      uniform sampler2D tPrev; uniform vec2 uA, uB; uniform float uR, uDecay, uAsp, uOn, uTime; varying vec2 vUv;
      ${E}
      void main(){
        float prev = texture2D(tPrev, vUv).r;
        vec2 s = vec2(uAsp, 1.), p = vUv * s, a = uA * s, b = uB * s, ab = b - a;
        float d = length(p - a - ab * clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0., 1.));
        float w = smoothstep(uR, uR * .45, d + (vnoise(p * 40.) - .5) * uR * .5) * uOn;
        // it refrosts in patches, from the edges of the wipe in (the decay is fastest where it is barely clear)
        float v = max(prev - uDecay * (.55 + .9 * vnoise(p * 9. + 3.)) * (1.25 - prev * .5), 0.);
        gl_FragColor = vec4(max(v, w), 0., 0., 1.);
      }`}),l=new B,c=new Te(-1,1,1,-1,0,1);l.add(new q(new Q(2,2),a));let v=0;const x=new R({vertexShader:ye,depthTest:!1,depthWrite:!1,blending:pe,uniforms:{tScene:{value:n.texture},tWipe:{value:r[0].texture},uCover:{value:0},uTime:{value:0},uAsp:{value:1},uLod:{value:4},uTint:{value:new S(.9,.95,1)}},fragmentShader:`
      uniform sampler2D tScene, tWipe; uniform float uCover, uTime, uAsp, uLod; uniform vec3 uTint; varying vec2 vUv;
      ${E}
      ${Ae}
      void main(){
        vec3 sharp = texture2D(tScene, vUv).rgb;
        if (uCover < .002) { gl_FragColor = vec4(sharp, 1.); return; }
        vec2 p = vec2((vUv.x - .5) * uAsp, vUv.y - .5);
        // how far in from the frame, with the frost's ragged front
        // (in units of the shorter side, so a phone's narrow screen is not frosted from edge to edge)
        float sm = min(uAsp, 1.), e = min(min(vUv.x, 1. - vUv.x) * uAsp, min(vUv.y, 1. - vUv.y)) / sm;
        float n = fbm3(p * 2.6 + 1.3), n2 = vnoise(p * 9.);
        float corner = smoothstep(.5, .05, length(vec2(min(vUv.x, 1. - vUv.x) * uAsp, min(vUv.y, 1. - vUv.y)) / sm));   // it gathers in the corners
        float reach = uCover * (.1 + .15 * n + .2 * corner);
        float field = smoothstep(reach + .02, reach - .12, e + (n2 - .5) * .05);
        float g = clamp((reach - e) * 5. + .35, 0., 1.);
        float cr = 0.;
        if (field > .002) {   // (only where the frost reaches: the middle of the screen pays nothing)
          cr = max(frostFeathers(p, .2, g, 3.), frostFeathers(p + .07, .11, g * .95, 11.) * .8);
          cr = max(cr, frostFeathers(p + .19, .055, g * .9, 23.) * .55);
        }
        float clear = texture2D(tWipe, vUv).r;
        float f = field * (1. - clear);
        cr *= field * (1. - smoothstep(.15, .7, clear));
        // behind the frost the picture scatters: a soft blur, lifted toward white
        vec2 o = vec2(1.5, 0.) / vec2(textureSize(tScene, 0)) * exp2(uLod);
        vec3 soft = (textureLod(tScene, vUv + o, uLod).rgb + textureLod(tScene, vUv - o, uLod).rgb + textureLod(tScene, vUv + o.yx * uAsp, uLod).rgb + textureLod(tScene, vUv - o.yx * uAsp, uLod).rgb) * .25;
        soft = mix(soft, textureLod(tScene, vUv, uLod + 1.5).rgb, .5);
        vec3 haze = soft * .74 + uTint * (.22 + .12 * n);
        vec3 col = mix(sharp, haze, f * (.72 + .26 * n2));
        col += uTint * cr * (.42 + .32 * n2);
        // where a wipe is refrosting, a thin wet bloom first
        float wet = smoothstep(.05, .35, clear) * smoothstep(.95, .5, clear) * field;
        col = mix(col, soft * .92 + uTint * .1, wet * .4);
        // the edge of a fresh wipe: a thin bright film of melt
        col += uTint * smoothstep(.55, .75, clear) * smoothstep(.98, .8, clear) * field * .12;
        gl_FragColor = vec4(col, 1.);
      }`}),W=new B,T=new q(new Q(2,2),x);T.frustumCulled=!1,W.add(T);const C=x.uniforms,g=a.uniforms,u=new L(-9,-9),m=new L;let N="";return{scene:W,camera:c,target:n,uniforms:C,resize(s,w){const d=`${s}x${w}`;d!==N&&(N=d,n.setSize(s,w)),C.uAsp.value=g.uAsp.value=s/Math.max(1,w),C.uLod.value=Math.log2(Math.max(s,w)/1600)+4},step(s,w,d){const b=e.pointer;m.set(b.x*.5+.5,b.y*.5+.5);const U=d&&b.inside&&!O;(!U||u.x<-1||m.distanceTo(u)>.3)&&u.copy(m),g.uA.value.copy(u),g.uB.value.copy(m),g.uOn.value=U?1:0,g.uR.value=Be?.085:.06,g.uDecay.value=w*.085,g.uTime.value=s,u.copy(m),g.tPrev.value=r[v].texture,v^=1;const z=e.renderer,F=z.getRenderTarget();z.setRenderTarget(r[v]),z.render(l,c),z.setRenderTarget(F),C.tWipe.value=r[v].texture,C.uTime.value=s},warm(){const s=e.renderer,w=s.getRenderTarget();g.tPrev.value=r[0].texture,s.setRenderTarget(r[1]),s.render(l,c),s.setRenderTarget(w)},dispose(){n.dispose(),r.forEach(s=>s.dispose()),a.dispose(),x.dispose(),T.geometry.dispose(),l.children[0].geometry.dispose()}}}function Ye(e,i,n){return new q(new De(100,48,24),new R({side:Oe,depthWrite:!1,uniforms:e,vertexShader:"varying vec3 vD; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vD = w.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`${i}
varying vec3 vD;
void main(){ vec3 dir = normalize(vD); vec3 col; ${n}
 gl_FragColor = vec4(col, 1.); }`}))}function Ze(e,i,n=128){const r=new Le(n,{type:$,generateMipmaps:!0,minFilter:X}),a=new We(.1,1e3,r);i.add(a);const l=c=>{c&&a.position.copy(c),a.update(e,i)};return l(),{texture:r.texture,update:l,dispose(){r.dispose(),i.traverse(c=>{const v=c;v.isMesh&&(v.geometry.dispose(),v.material.dispose())})}}}let V=!1;const Y=`
  ${E}
  uniform vec3 uSunDir, uZenith, uHorizon, uGlow, uSunCol, uSnowSky, uRock;
  vec3 whiteSky(vec3 d){
    float y = d.y, up = max(y, 0.);
    vec3 c = mix(uHorizon, uZenith, pow(up, .5));
    float mu = dot(d, uSunDir);
    float hz = exp(-up * 9.);
    c += uGlow * (pow(max(mu, 0.), 5.) * .3 + pow(max(mu, 0.), 40.) * .8 + pow(max(mu, 0.), 400.) * 2.) * (.45 + .55 * hz);
    c += uSunCol * smoothstep(.99982, .99992, mu) + uGlow * pow(max(mu, 0.), 3000.) * 5.;
    c += uGlow * exp(-abs(y - uSunDir.y) * 140.) * pow(max(mu, 0.), 6.) * .35;   // a flat streak of light through the sun
    float az = atan(d.x, -d.z);
    float peaks = (.003 + .032 * pow(fbm3(vec2(az * 2.6, 1.7)), 2.2) * smoothstep(.25, .75, vnoise(vec2(az * 1.3 + 2., 4.)))) * smoothstep(.12, .4, abs(az));
    if (y > -.002 && y < peaks) {
      float snowy = smoothstep(.45, .75, vnoise(vec2(az * 70., y * 500.)) + y / max(peaks, 1e-3) * .45);
      c = mix(mix(uRock, uHorizon * .92, snowy * .55), c, .4);
    }
    if (y < 0.) c = mix(uHorizon * 1.02, uSnowSky, smoothstep(0., -.2, y)) + uGlow * pow(max(mu, 0.), 30.) * .4 * exp(y * 12.);
    return c;
  }
`,ot=async e=>{const i=e.lang==="ar",n=i?-1:1,r=new B,a=new Ne(30,e.viewport.aspect,.1,900),l={uSunDir:{value:new A},uZenith:{value:new S("#4a7cb6")},uHorizon:{value:new S("#e3e7ea")},uGlow:{value:new S("#ffcf98").multiplyScalar(1.3)},uSunCol:{value:new S(40,33,24)},uSnowSky:{value:new S("#c4d3e2")},uRock:{value:new S("#2a3440")}};((o,t)=>l.uSunDir.value.set(n*Math.sin(o)*Math.cos(t),Math.sin(t),-Math.cos(o)*Math.cos(t)).normalize())(.05,.1);const v=new B,x=new Z(1,1,{type:$,generateMipmaps:!0,minFilter:X,depthBuffer:!0}),W=new R({uniforms:{tBg:{value:x.texture}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1., 1.); }",fragmentShader:"uniform sampler2D tBg; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tBg, vUv).rgb, 1.); }"});r.add(ge(W,-10));const T=new R({uniforms:l,depthWrite:!1,vertexShader:qe(1),fragmentShader:`${Y}
varying vec4 vDir; void main(){ gl_FragColor = vec4(whiteSky(normalize(vDir.xyz / vDir.w)), 1.); }`});v.add(ge(T,-10));const C=new B;C.add(Ye(l,Y,"col = whiteSky(dir);"));const g=Ze(e.renderer,C,e.quality?128:64),u=He({env:g.texture,bg:x.texture,depth:.66,quality:e.quality}),m=u.uniforms;m.uSunDir.value=l.uSunDir.value,m.uTrace.value=.08,r.add(u.mesh);const N=new Fe,s=new q(new Q(900,900).rotateX(-Math.PI/2),new R({uniforms:{...l,uMarkInv:{value:N},uTime:{value:0},uSunLight:{value:new S(1.5,1.26,.98)},uAmb:{value:new S("#aec6de")},...be()},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${Y}
      uniform mat4 uMarkInv; uniform float uTime; uniform vec3 uSunLight, uAmb;
      varying vec3 vW;
      ${xe}
      // sastrugi: broad wind-carved ridges, soft (snow is matte), with a finer grain riding on them
      float rip(vec2 p){ vec2 q = p * vec2(.22, .5); return fbm3(q + vec2(fbm3(q * .5) * 1.4, 0.)) + vnoise(p * vec2(1.1, 2.4)) * .12; }
      void main(){
        vec2 p = vW.xz;
        float e = .05, h0 = rip(p), hx = rip(p + vec2(e, 0.)), hz = rip(p + vec2(0., e));
        vec3 n = normalize(vec3(-(hx - h0) / e * .14, 1., -(hz - h0) / e * .14));
        vec3 V = normalize(vW - cameraPosition);
        float dif = max(dot(n, uSunDir), 0.);
        vec3 col = vec3(.93, .96, 1.) * (uAmb * (.62 + .38 * n.y) * .8 + uSunLight * (dif * .45 + .08));
        // glitter: a few facets of crystals catching the sun
        vec2 gc = floor(p * 22.);
        vec3 fn = normalize(vec3(h22(gc) - .5, 1.6).xzy);
        float gl = step(.988, h21(gc + 7.)) * pow(max(dot(reflect(V, fn), uSunDir), 0.), 90.);
        col += uSunLight * gl * 3. * smoothstep(40., 5., length(vW - cameraPosition));
        // the block's shadow (the sun is behind it: it comes toward you), and in it the light the ice gathers into threads
        vec3 o = (uMarkInv * vec4(vW, 1.)).xyz, s = normalize(mat3(uMarkInv) * uSunDir);
        float t = -o.z / s.z;
        vec2 sp = o.xy + s.xy * t;
        float sd = markSD(sp);
        float sh = smoothstep(.05, -.06, sd) * step(0., t);
        float cn = vnoise(sp * 3.2 + vec2(uTime * .05, 0.)) + vnoise(sp * 7.1 - uTime * .04) * .6;
        float caust = pow(1. - abs(sin(cn * 7.)), 18.) * .8 + pow(1. - abs(sin(cn * 13. + 1.)), 24.) * .45;
        col = col * (1. - sh * .42) + uSunLight * vec3(.85, .95, 1.1) * sh * caust * .22 + vec3(.2, .45, .9) * sh * smoothstep(-.14, 0., sd) * .1;
        // the far snow melts into the horizon
        float far = 1. - exp(-length(vW - cameraPosition) * .012);
        col = mix(col, whiteSky(normalize(vec3(V.x, -.01, V.z))), far);
        gl_FragColor = vec4(col, 1.);
      }`}));v.add(s);const w=Ee(e.quality);r.add(w.mesh);const d=w.uniforms;d.uFogCol.value.set("#f2f4f6"),d.uFlake.value.set("#ffffff");const b=Ie(e),U=b.uniforms;let z=!1,F=1,J="",ee=0;const _=10,te=new A,oe=new A,ae=()=>{const o=e.viewport,t=Math.round(o.width*o.dpr),M=Math.round(o.height*o.dpr);b.resize(t,M),(x.width!==t||x.height!==M)&&x.setSize(t,M)};function re(){const o=e.viewport;ae();const t=`${o.portrait}:${o.aspect.toFixed(3)}`;if(t===J)return;J=t,z=o.portrait,a.aspect=o.aspect,a.fov=z?50:30,a.updateProjectionMatrix();const M=Math.tan(Ge.degToRad(a.fov/2)),f=2*_*M*o.aspect,G=2*_*M;F=z?f*.84/3.95:Math.min(f*(o.aspect<1.85?.38:.44)/3.95,G*.5/2.1),ee=z?0:he((o.aspect-1.15)*.45,0,.25)*n,u.mesh.scale.setScalar(F),u.mesh.position.set(0,F*1.03-.04,0),g.update(new A(0,u.mesh.position.y,0))}re();const y=e.renderer,Se=y.getRenderTarget();y.setRenderTarget(x),await y.compileAsync(v,a).catch(()=>{}),y.setRenderTarget(b.target),await y.compileAsync(r,a).catch(()=>{}),y.setRenderTarget(Se),b.warm(),await Ue();let P=-1,j=-1,ne=-1,K=!1,se=-1;const ie=Pe("twopen"),H=()=>{K&&(K=!1,e.emit("intro",!1)),V||(V=!0,e.emit("ice-open",!0))};return{scene:b.scene,camera:a,light:!0,resize(){re()},focus(o){o&&!V&&scrollY<innerHeight*.5&&!O&&ie===null&&(K=!0,e.emit("intro",!0),setTimeout(H,4600)),o||H()},update({p:o,t,dt:M}){j<0&&(j=t,se=V?1:0),(P<0||t-P<.5&&t-ne>.1&&t-j<4)&&(P=t),ne=t;const f=O?12:ie??(se?12+t-j:t-P);f>3.6&&H();const G=e.viewport,ze=p.inOut(h(.6,2.4,f)),le=p.inOut(h(2.3,3.6,f)),ue=1-p.inOut(h(1,3.4,f)),Me=f<1.6?k(.96,.24,p.inOut(h(.5,1.6,f))):k(.24,0,p.inOut(h(1.6,3.1,f))),ce=p.in(h(.66,1,o)),ke=p.out(h(3.2,8.5,f))*(1-p.inOut(h(.06,.42,o)))+p.inOut(h(.6,.95,o))*.55;m.uGrow.value=ze,m.uClear.value=le,m.uTime.value=t,m.uSweep.value=k(-3.2,3.6,p.inOut(h(2.7,4.5,f)))*n,m.uLight.value=k(.25,1,p.inOut(h(1.8,3.4,f))),m.uEnvGain.value=k(.75,1,le);const ve=p.inOut(h(.04,1,o))*-.4*n+(O?0:Math.sin(t*.13)*.02),I=p.inOut(h(0,1,o)),me=_-I*1.6+ue*.6,de=u.mesh.position.y;te.set(Math.sin(ve)*me,de*.62+I*.25,Math.cos(ve)*me),oe.set(0,de*(z?1.05:.98),0),je(a,ee*(1-I*.6),0,G.width,G.height),a.updateProjectionMatrix();const fe=Ve(e,t,M);$e(a,te,oe,fe.x,fe.y),u.mesh.rotation.y=(O?0:Math.sin(t*.21)*.05)+p.inOut(h(.1,1,o))*.18*n,u.mesh.updateMatrixWorld(),N.copy(u.mesh.matrixWorld).invert();const D=Math.max(ue,ce);d.uAmt.value=k(.06,.95,D),d.uSpeed.value=k(.45,1.5,D),d.uLen.value=k(1.1,1.3,D),d.uNear.value=k(.25,1,D),d.uFog.value=he(Me+ce*.82),d.uGlint.value=(1-D)*.8,d.uLow.value=1-D,w.step(t,M,G.aspect),s.material.uniforms.uTime.value=t,ae(),U.uCover.value=O?0:ke,b.step(t,M,f>3),y.setClearColor(0,0),y.setRenderTarget(x),y.clear(),y.render(v,a),y.setRenderTarget(b.target),y.clear(),y.render(r,a)},dispose(){u.dispose(),g.dispose(),w.dispose(),b.dispose(),x.dispose(),T.dispose(),W.dispose(),s.geometry.dispose(),s.material.dispose()}}};export{ot as default};
