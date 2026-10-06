import{G as ie,ac as yt,ad as Pe,C as L,V as P,i as V,ak as ae,am as De,av as $t,I as St,b4 as fa,aF as pa,b5 as va,ae as da,a8 as jt,M as E,a as he,S as Mt,b6 as Yt,ai as ma,aj as Ct,aN as ha,s as F,K as ye,az as Ee,p as At,aE as We,F as ne,O as _e,aB as Re,a3 as Ke,bg as ga,a4 as Rt,aM as Dt,m as wa,an as xa,be as ba,ag as ft,X as ya,aq as Se,ar as nt,ap as He,bk as Sa,B as Ma,_ as wt,a1 as Ca,au as zt,H as U,Q as Zt,ao as Aa,as as Kt,b as za,u as Gt,r as xt,o as Xt,aV as ka}from"./EditionWorld.astro_astro_type_script_index_0_lang.CZFCBfSl.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ta=`
  uniform vec3 uCam, uBox; uniform float uTime;
  // a particle's place: its seed in the box, drifting, wrapped round the camera; e: how near the box's edge (0 at it)
  vec3 wrapAt(vec3 seed, vec3 drift, out float e){
    vec3 f = fract((seed * uBox + drift - uCam) / uBox);
    vec3 m = .5 - abs(f - .5); e = min(min(m.x, m.y), m.z) * 2.;
    return uCam + (f - .5) * uBox;
  }
`;function Ra(e,{box:t=[70,40,70],focus:a=14,size:o=1,color:s="#ffe2a8",seed:n=3}={}){const r=St(n),i=new Float32Array(e*3),l=new Float32Array(e);for(let g=0;g<e;g++)i[g*3]=r(),i[g*3+1]=r(),i[g*3+2]=r(),l[g]=r();const p=new yt;p.setAttribute("position",new Pe(i,3)),p.setAttribute("aRand",new Pe(l,1));const c={uCam:{value:new P},uBox:{value:new P(...t)},uTime:{value:0},uFocus:{value:a},uSize:{value:o},uAmt:{value:1},uCol:{value:new L(s)},uPx:{value:1}},u=new V({uniforms:c,transparent:!0,depthWrite:!1,blending:De,blendSrc:ae,blendDst:ae,vertexShader:`
      ${Ta}
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
      }`}),f=new $t(p,u);return f.frustumCulled=!1,f.renderOrder=1300,{object:f,U:c,update(g,h,x){c.uCam.value.copy(g.position),c.uTime.value=h,c.uPx.value=x},dispose(){p.dispose(),u.dispose()}}}function Uo(e,{motes:t=1,focus:a=14}={}){const o=Ra(Math.round([160,300,420][e]*t),{focus:a}),s=new ie;return s.add(o.object),{group:s,motes:o,update(n,r,i,l=1){o.update(n,r,i),o.U.uAmt.value=l},dispose(){o.dispose()}}}const Da=`
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
  }`,Lt=new WeakMap;function Ga(e){const t=e.renderer,a=Lt.get(t);if(a)return a;const o=e.quality===0?64:128,s=new fa(o,o,o,{depthBuffer:!1,type:va,format:pa}),n=s.texture;n.wrapS=n.wrapT=n.wrapR=da,n.minFilter=n.magFilter=jt,n.generateMipmaps=!1;const r=new V({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:Da,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),i=new E(new he(2,2),r);i.frustumCulled=!1;const l=new Mt,p=new Yt;l.add(i);const c=t.getRenderTarget();for(let u=0;u<o;u++)r.uniforms.uZ.value=(u+.5)/o,t.setRenderTarget(s,u),t.render(l,p);return t.setRenderTarget(c),r.dispose(),i.geometry.dispose(),Lt.set(t,n),n}const La=[{u:0,elev:5,zenith:"#5f93d0",horizon:"#f2ebe4",below:"#d9d8e0",dawn:"#f0ab98",dawnAmt:.34,glow:"#ffcf96",glowAmt:.85,sun:"#ffd5a4",sunGain:3.6,ambTop:"#7f9cc9",ambBot:"#cfc6cf",gain:1},{u:.32,elev:6.5,zenith:"#6699d3",horizon:"#f4efe9",below:"#dcdce3",dawn:"#f2b6a2",dawnAmt:.26,glow:"#ffd6a2",glowAmt:.85,sun:"#ffdbae",sunGain:3.8,ambTop:"#86a2cd",ambBot:"#d4ccd2",gain:1.02},{u:.62,elev:9.5,zenith:"#6ea2d9",horizon:"#f6f2ec",below:"#e0e0e6",dawn:"#f5c5ae",dawnAmt:.16,glow:"#ffdeb2",glowAmt:.9,sun:"#ffe0b8",sunGain:4,ambTop:"#8eaad2",ambBot:"#dad3d6",gain:1.05},{u:.86,elev:15,zenith:"#7eb0e1",horizon:"#faf7f1",below:"#e8e7ea",dawn:"#ffdcc0",dawnAmt:.1,glow:"#ffe6c2",glowAmt:1.2,sun:"#ffe6c6",sunGain:3.5,ambTop:"#a0bbdc",ambBot:"#e3ddda",gain:1.12},{u:1,elev:19,zenith:"#76abe0",horizon:"#f9f6f0",below:"#e5e4e8",dawn:"#ffe0c6",dawnAmt:.08,glow:"#ffe8c8",glowAmt:.95,sun:"#ffeacd",sunGain:3.2,ambTop:"#98b5da",ambBot:"#e0dad8",gain:1.06}],fe=e=>new L(e),Xe=La.map(e=>({...e,c:{zenith:fe(e.zenith),horizon:fe(e.horizon),below:fe(e.below),dawn:fe(e.dawn),glow:fe(e.glow),sun:fe(e.sun),ambTop:fe(e.ambTop),ambBot:fe(e.ambBot)}})),qt=0;function Qt(){return{uSunDir:{value:new P(0,.05,-1).normalize()},uSunCol:{value:new L(1,.8,.6)},uZenith:{value:new L},uHorizon:{value:new L},uBelow:{value:new L},uDawnCol:{value:new L},uGlowCol:{value:new L},uAmbTop:{value:new L},uAmbBot:{value:new L},uDawn:{value:0},uGlow:{value:1},uSkyGain:{value:1.2},uFlood:{value:0},uDeep:{value:0},uWave:{value:new F}}}const qa=(e,t=new P)=>{const a=At.degToRad(e);return t.set(Math.sin(qt)*Math.cos(a),Math.sin(a),-Math.cos(qt)*Math.cos(a))};function Jt(e,t,a=0,o=0,s=0){t=ye(t);let n=0;for(;n<Xe.length-2&&t>Xe[n+1].u;)n++;const r=Xe[n],i=Xe[n+1],l=ye((t-r.u)/(i.u-r.u)),p=(c,u)=>u.copy(r.c[c]).lerp(i.c[c],l);return qa(Ee(r.elev,i.elev,l),e.uSunDir.value),p("sun",e.uSunCol.value).multiplyScalar(Ee(r.sunGain,i.sunGain,l)*(1+a*.35)),p("zenith",e.uZenith.value),p("horizon",e.uHorizon.value),p("below",e.uBelow.value),p("dawn",e.uDawnCol.value),p("glow",e.uGlowCol.value),p("ambTop",e.uAmbTop.value),p("ambBot",e.uAmbBot.value),e.uDawn.value=Ee(r.dawnAmt,i.dawnAmt,l),e.uGlow.value=Ee(r.glowAmt,i.glowAmt,l)*(1+a*2.2),e.uSkyGain.value=Ee(r.gain,i.gain,l)*(1+a*.55),e.uFlood.value=a,e.uDeep.value=o,e.uWave.value.set(s*3.4-.2,Math.sin(Math.min(1,Math.max(0,s))*Math.PI)*1.1),e}const ee=`
  uniform vec3 uSunDir, uSunCol, uZenith, uHorizon, uBelow, uDawnCol, uGlowCol, uAmbTop, uAmbBot;
  uniform float uDawn, uGlow, uSkyGain, uFlood, uDeep; uniform vec2 uWave;
`,Ge=`
  // the flood: a wave of golden light running out from the sun across the whole sky (uWave: its front, radians from
  // the sun; its strength), clear behind it
  float waveAt(vec3 d){ float a = acos(clamp(dot(d, uSunDir), -1., 1.)), x = a - uWave.x; return uWave.y * (exp(-x * x / (x > 0. ? .006 : .03)) + .06 * smoothstep(.1, -.5, x)); }
  vec3 skyColor(vec3 d){
    float y = d.y, mu = dot(d, uSunDir);
    vec3 zen = uZenith * mix(vec3(1.), vec3(.5, .66, .92), uDeep);   // deep: the high clear blue above the clouds
    vec3 hor = mix(uHorizon, uZenith * vec3(.72, .86, 1.04), uDeep * .78);   // (and the low sky turns blue with it)
    vec3 c = mix(hor, zen, 1. - exp(-max(y, 0.) * 8.5));
    c = mix(c, uBelow, smoothstep(0., -.22, y));
    // the rose of dawn: low along the horizon, strongest toward the sun
    vec2 dh = normalize(d.xz + vec2(1e-5)), sh = normalize(uSunDir.xz + vec2(1e-5));
    float az = dot(dh, sh) * .5 + .5;
    c += uDawnCol * uDawn * exp(-abs(y + .01) * 7.) * (.18 + .82 * az * az * az);
    // the glow round the sun: broad, then tight (Mie)
    float g = max(mu, 0.);
    c += uGlowCol * uGlow * (pow(g, 8.) * .16 + pow(g, 48.) * .45 + pow(g, 420.) * 1.6);
    // the flood: light pours out from the sun across the whole sky
    c = mix(c, uGlowCol * 1.5 + vec3(.2), uFlood * (.05 + .42 * pow(g, 4.)));
    c += vec3(1., .64, .26) * waveAt(d) * 1.45;
    return c * uSkyGain;
  }
  vec3 sunDisc(vec3 d){ float mu = dot(d, uSunDir); return uSunCol * (smoothstep(.99982, .99993, mu) * 24. + pow(max(mu, 0.), 2400.) * 3.); }
`,Bt=new WeakMap;function Ba(e,t){const a=e.renderer,o=Math.round(t*10)/10;let s=Bt.get(a);s||Bt.set(a,s=new Map);const n=s.get(o);if(n)return n;const r=Jt(Qt(),o),i=new Mt,l=[],p=new ma(50,48,24),c=new V({side:Ct,depthWrite:!1,uniforms:{...r},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`${ee}${Ge}
      varying vec3 vD;
      float hh(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * vn(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
      void main(){
        vec3 d = normalize(vD);
        vec3 c = skyColor(d);
        float sl = dot(c, vec3(.3, .5, .2));
        c = mix(c, vec3(sl) * vec3(.92, .96, 1.05), .5) * mix(1., .62, smoothstep(.05, .5, d.y));   // overhead: quieter, darker
        c += uGlowCol * uSkyGain * (exp(-abs(d.y - .015) * 34.) * .9 + exp(-abs(d.y) * 9.) * .25);   // the band of dawn round the horizon
        c += sunDisc(d) * .05;
        // a skyline of cloud towers all round (gold reflects shapes, not a smooth gradient): lit gold on the side the sun
        // is, pearl and blue-grey in shade; below the horizon a lumpy floor of cloud, bright tops and shaded hollows
        float az = atan(d.x, -d.z);
        float top = -.02 + pow(fbm(vec2(az * 2.4 + 3., 1.7)), 2.) * .62;
        vec3 flat_ = normalize(vec3(d.x, 0., d.z) + vec3(1e-4)), sunH = normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-4));
        float facing = dot(flat_, sunH);
        vec3 lit = uSunCol * .3 + uAmbBot * .75, shade = uAmbTop * .5 + uAmbBot * .3;
        float lum = fbm(vec2(az * 10., d.y * 16.));
        vec3 cloud = mix(shade * 1.4, lit * 1.1, smoothstep(.25, .68, lum) * (.62 + .38 * max(-facing, 0.)));
        float fl = fbm(d.xz / max(-d.y, .06) * .9);
        vec3 ground = mix(shade * .9, lit, smoothstep(.36, .74, fl));
        c = mix(c, cloud, smoothstep(top + .012, top - .012, d.y));
        c = mix(c, mix(cloud, ground, smoothstep(-.02, -.22, d.y)), smoothstep(.0, -.05, d.y));
        gl_FragColor = vec4(c, 1.);
      }`});i.add(new E(p,c)),l.push(p,c);const u=new ha(a),f=u.fromScene(i,.02,.1,100).texture;return u.dispose(),l.forEach(g=>g.dispose()),s.set(o,f),f}const ea=1,J=e=>(e.traverse(t=>t.layers.enable(ea)),e),Ne=6e4,pt="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",st=`
  uniform mat4 uProjInv, uCamWorld;
  vec3 dirAt(vec2 uv){ vec4 v = uProjInv * vec4(uv * 2. - 1., 1., 1.); return normalize(mat3(uCamWorld) * (v.xyz / v.w)); }
  float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
`,Ua=`
  precision highp sampler3D;
  uniform sampler3D uNoise;
  uniform vec4 uSea, uSheet, uCalm; uniform vec4 uBankC[6], uBankR[6]; uniform int uBanks; uniform vec3 uWind;
  float gDetail = 1.;   // the fine erosion, faded with distance (far off it would only alias)
  float gRamp = 3.5;    // how soft a surface is: about a step wide, so a far cloud never aliases between steps
  // where the towers keep away (the cathedral, the stair): 1 inside the box, fading over 40 units
  float calmAt(vec2 xz){ vec2 c = vec2(clamp(xz.x, uCalm.x, uCalm.y), clamp(xz.y, uCalm.z, uCalm.w)); return 1. - smoothstep(0., 40., length(xz - c)); }
  float seaTop(vec2 xz, vec2 at){
    vec2 q = xz * uSea.w;
    float roll = texture(uNoise, vec3(q, .31)).a;
    float tw = texture(uNoise, vec3(q * 1.7 + .27, .73)).g;
    return uSea.x + (roll - .5) * uSea.y + pow(clamp((tw - .52) * 2.3, 0., 1.), 1.7) * uSea.z * (1. - calmAt(at));
  }
  // density 0..1 at p; inside: how deep within (units), for the ambient's shade
  uniform float uCalmDrop; uniform vec4 uDrop1, uDrop2;
  float boxFade(vec2 xz, vec4 b, float f){ vec2 c = vec2(clamp(xz.x, b.x, b.y), clamp(xz.y, b.z, b.w)); return 1. - smoothstep(0., f, length(xz - c)); }
  float field(vec3 p, bool fine, out float inside){
    vec3 w = p + uWind;
    float d = 0.; inside = 0.;
    if (uSea.y >= 0.) {
      // under what floats on it (two boxes) the sea lies lower and calmer, its billows never rising through the floor;
      // a few units out they heap up again round the edges
      float cz = uCalmDrop > 0. ? max(boxFade(p.xz, uDrop1, 18.), boxFade(p.xz, uDrop2, 18.)) : 0.;
      float h = seaTop(w.xz, p.xz) - p.y - uCalmDrop * cz;
      if (h > -26.) {
        vec3 q = w * (1. / 95.);
        float s = h + ((texture(uNoise, q).r - .42) * 17. + (texture(uNoise, q * .41 + .5).g - .5) * 20.) * (1. - .55 * cz);
        if (fine && s > -8. && s < 10.) s += (texture(uNoise, w * (1. / 24.)).b - .62) * 5. * gDetail;
        d = clamp(s / gRamp, 0., 1.); inside = s;
      }
    }
    for (int i = 0; i < 6; i++) {
      if (i >= uBanks) break;
      vec3 r = (p - uBankC[i].xyz) / uBankR[i].xyz;
      float L = length(r);
      if (L < 1.8) {
        // its billows scale with it: a small bank is a puff, a large one heaps up in cauliflower towers
        float sc = uBankR[i].w; vec3 bq = w / (sc * 1.1) + float(i) * .193;
        float s = (1. - L) * sc + (texture(uNoise, bq * .5).g - .5) * sc * .9 + (texture(uNoise, bq).r - .42) * sc * .45;
        if (fine && s > -8. && s < 10.) s += (texture(uNoise, w * (1. / 22.)).b - .62) * 7. * gDetail;
        float b = clamp(s / max(gRamp, sc * .1), 0., 1.) * uBankC[i].w;
        if (b > d) {d = b; inside = s;}
      }
    }
    if (uSheet.z > 0.) {
      float dy = abs(p.y - uSheet.x);
      if (dy < uSheet.y + 22.) {
        // a second sea, high up: a layer whose top heaps up in billows as the low sea's does, ragged underneath, broken
        // into islands where its cover thins
        vec3 q = w * (1. / 88.) + vec3(.37, .11, .73);
        float cov = texture(uNoise, vec3(w.xz * uSheet.w, .57)).a;
        float top = uSheet.x + uSheet.y + (texture(uNoise, vec3(w.xz * uSheet.w * 2.3, .21)).a - .5) * 12.;
        float h = min(top - p.y, p.y - (uSheet.x - uSheet.y) + (texture(uNoise, q * .7).g - .5) * 8.);
        float s = h + (texture(uNoise, q).r - .42) * 15. + (texture(uNoise, q * .41 + .5).g - .5) * 18. + (cov - .55) * 40.;
        if (fine && s > -6. && s < 9.) s += (texture(uNoise, w * (1. / 22.)).b - .62) * 3.5 * gDetail;
        float b = clamp(s / max(gRamp, 4.), 0., 1.) * uSheet.z;
        if (b > d) {d = b; inside = s;}
      }
    }
    return d;
  }
`,Ea=(e,t)=>`
  precision highp float;
  uniform sampler2D uDepth; uniform vec3 uCamPos;
  uniform float uSigma, uDensity, uFogK, uFar, uStepK, uStepMin, uLightStep, uLightGrow, uRampK, uAmbGain, uSunGainC;
  uniform vec2 uSlabA, uSlabB; uniform vec4 uCasterC, uCasterR;
  ${ee}${Ge}${st}${Ua}
  varying vec2 vUv;
  float hg(float c, float g){ float g2 = g * g; return (1. - g2) / pow(max(1. + g2 - 2. * g * c, 1e-4), 1.5); }
  // the shadow a great bank casts across the clouds when the sun is behind it (its core, as an ellipsoid)
  float casterLight(vec3 p){
    if (uCasterC.w <= 0.) return 1.;
    vec3 o = (p - uCasterC.xyz) / uCasterR.xyz, d = uSunDir / uCasterR.xyz;
    if (dot(o, o) < 1.3) return 1.;   // (the bank itself is shaded by its own march)
    float tc = max(-dot(o, d) / dot(d, d), 0.);
    return mix(1., smoothstep(.62, 1.02, length(o + d * tc)), uCasterC.w);
  }
  uniform float uInside;
  float lightOD(vec3 p){
    float od = 0., t = 0., st = uLightStep, k;
    for (int i = 0; i < ${t}; i++) { t += st * .5; od += field(p + uSunDir * t, false, k) * st; t += st * .5; st *= uLightGrow; }
    return od * uDensity;
  }
  vec2 slab(vec3 ro, vec3 rd, vec2 Y, float tMax){
    if (Y.y <= Y.x) return vec2(1., 0.);
    if (abs(rd.y) < 1e-5) return (ro.y > Y.x && ro.y < Y.y) ? vec2(0., tMax) : vec2(1., 0.);
    float a = (Y.x - ro.y) / rd.y, b = (Y.y - ro.y) / rd.y;
    return vec2(max(min(a, b), 0.), min(max(a, b), tMax));
  }
  // a bank's bounds: the ellipsoid its noise can reach (radii scaled by k)
  vec2 ellip(vec3 ro, vec3 rd, vec3 c, vec3 r, float tMax){
    vec3 o = (ro - c) / r, d = rd / r;
    float a = dot(d, d), b = dot(o, d), q = b * b - a * (dot(o, o) - 1.);
    if (q < 0.) return vec2(1., 0.);
    q = sqrt(q);
    return vec2(max((-b - q) / a, 0.), min((-b + q) / a, tMax));
  }
  // where there can be cloud along this ray: the sea's slab, the sheet's, each bank's bounds; the march skips the rest
  vec2 iv[8];
  float nextT(float t){
    float best = 1e9;
    for (int i = 0; i < 8; i++) { vec2 I = iv[i]; if (I.y <= I.x || I.y < t) continue; if (I.x <= t) return t; best = min(best, I.x); }
    return best;
  }
  void main(){
    vec3 rd = dirAt(vUv), ro = uCamPos;
    float dep = texture(uDepth, vUv).r;
    float tMax = min(dep, uFar);
    iv[0] = slab(ro, rd, uSlabA, tMax); iv[1] = slab(ro, rd, uSlabB, tMax);
    for (int i = 0; i < 6; i++) iv[i + 2] = i < uBanks ? ellip(ro, rd, uBankC[i].xyz, uBankR[i].xyz * (1.8 + 5. / uBankR[i].w), tMax) : vec2(1., 0.);
    vec3 sky = skyColor(rd);
    vec3 gold = 1. + vec3(.9, .45, .08) * waveAt(rd) * 1.3;   // the flood gilds the clouds as it passes
    float cosT = dot(rd, uSunDir);
    float ph[3];
    float e = 1.;
    for (int o = 0; o < 3; o++) { ph[o] = mix(hg(cosT, -.2 * e), hg(cosT, .64 * e), .58); e *= .5; }
    vec3 col = vec3(0.); float T = 1.;
    float jit = ign(gl_FragCoord.xy) * .55 + .2;   // (half the spread: the ramp already keeps steps from banding)
    float t = uStepMin * jit;
    {
      for (int i = 0; i < ${e}; i++) {
        // jump the air to where cloud can be, landing a jittered fraction of a step in (or every ray enters at the same
        // depth, and the steps show as contour lines)
        float tn = nextT(t);
        if (tn > t) t = tn + clamp(tn * uStepK, uStepMin, 40.) * jit;
        if (t > tMax || T < .01) break;
        float dt = clamp(t * uStepK, uStepMin, 40.);
        vec3 p = ro + rd * t;
        gDetail = 1. - smoothstep(140., 420., t); gRamp = max(3.5, dt * uRampK);
        float inside;
        float d = field(p, true, inside) * uDensity;
        if (d > .003) {
          float od = lightOD(p);
          float ms = 0., a = 1., b = 1.;
          for (int o = 0; o < 3; o++) { ms += b * ph[o] * exp(-od * uSigma * a); a *= .42; b *= .58; }
          float hf = clamp((p.y - uSea.x + 34.) / 64., 0., 1.);
          vec3 amb = mix(uAmbBot, uAmbTop, hf) * uAmbGain * (.62 + .38 * exp(-max(inside, 0.) * .03)) * (1. + uInside * .9) + uSunCol * uInside * .22;   // (inside a cloud: white all round)
          // and the light that has wandered deep into the cloud (inside one, it is bright all round, not grey)
          vec3 L = uSunCol * uSunGainC * (ms + .26 * smoothstep(5., 22., inside) * exp(-od * uSigma * .05)) * casterLight(p) + amb;
          L = mix(L, sky, 1. - exp(-t * uFogK));
          float Tr = exp(-d * uSigma * dt);
          col += T * (1. - Tr) * L * gold;
          T *= Tr;
        }
        t += dt;
      }
    }
    gl_FragColor = vec4(col, 1. - T);
  }`,Fa=`
  #include <common>
  varying vec3 vW;
  void main(){
    #include <begin_vertex>
    vec4 w = vec4(transformed, 1.);
    #ifdef USE_INSTANCING
      w = instanceMatrix * w;
    #endif
    w = modelMatrix * w; vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,Pa=`
  uniform sampler2D uDepth, uCloud; ${ee}${st}
  varying vec2 vUv;
  void main(){
    float sky = step(${Ne/2}., texture(uDepth, vUv).r);
    float mu = max(dot(dirAt(vUv), uSunDir), 0.);
    float w = pow(mu, 6.) * .3 + pow(mu, 40.) * .7;
    // R: the light that gets through; G: all of it, as if nothing were in the way (the shafts are the difference)
    gl_FragColor = vec4((1. - texture(uCloud, vUv).a) * sky * w, w, 0., 1.);
  }`,_a=e=>`
  uniform sampler2D uMask; uniform vec2 uSunUv; uniform float uDecay, uSpan;
  varying vec2 vUv;
  float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
  void main(){
    vec2 delta = (vUv - uSunUv) * uSpan / ${e}.;
    vec2 uv = vUv - delta * ign(gl_FragCoord.xy);
    vec2 acc = vec2(0.); float ill = 1., ws = 0.;
    for (int i = 0; i < ${e}; i++) { acc += texture(uMask, uv).rg * ill; ws += ill; ill *= uDecay; uv -= delta; }
    gl_FragColor = vec4(acc / ws, 0., 1.);
  }`,Na=`
  uniform sampler2D uCloud, uDepth, uRays, uMask; uniform vec2 uLowRes, uSunUv; uniform vec3 uRayCol; uniform float uHaze, uUndo, uAsp, uRaysOn, uGlare, uTapK;
  ${ee}${Ge}${st}
  varying vec2 vUv;
  void main(){
    float d0 = texture(uDepth, vUv).r;
    // depth-aware upsample: of the four low-res texels round this pixel, trust those that saw the same depth
    // (nine taps, a little wider than bilinear: it also smooths the march's per-pixel jitter)
    vec2 lp = vUv * uLowRes - .5, i0 = floor(lp + .5);
    vec4 acc = vec4(0.); float ws = 0.;
    for (int k = 0; k < 9; k++) {
      vec2 o = vec2(float(k - (k / 3) * 3) - 1., float(k / 3) - 1.);
      vec2 tc = (i0 + o + .5) / uLowRes;
      vec2 dd = (i0 + o) - lp;
      float dl = texture(uDepth, tc).r;
      float w = exp(-dot(dd, dd) * uTapK) / (.004 + abs(d0 - dl) / max(min(d0, dl), 1.)) + 1e-6;
      acc += texture(uCloud, tc) * w; ws += w;
    }
    vec4 c = acc / ws;
    vec3 rd = dirAt(vUv);
    float T = 1. - c.a;
    float haze = d0 < ${Ne/2}. ? 1. - exp(-d0 * uHaze) : 0.;
    vec3 rgb = c.rgb + T * haze * skyColor(rd);
    float a = 1. - T * (1. - haze);
    // the shafts: light where the way to the sun is clear, shadow streaming from every edge that blocks it (carved out
    // of the glow the sky already has, so the air never washes over)
    vec2 sh = texture(uRays, vUv).rg;
    // (a shadow in the air only over the sky: over a thing it would only dirty it)
    rgb += uRayCol * uRaysOn * max(sh.x * 1.15 - sh.y * 1.05, d0 < 30000. ? 0. : -.1) * (1. - c.a * .6);
    // the sun's glare, as much as the sun shows: it spills over the edges of the clouds round it
    vec2 sm = texture(uMask, uSunUv).rg; float vis = sm.y > 1e-3 ? sm.x / sm.y : 0.;
    vec2 gd = (vUv - uSunUv) * vec2(uAsp, 1.); float g2 = dot(gd, gd);
    rgb += uRayCol * uGlare * uRaysOn * vis * (exp(-g2 * 160.) * .9 + exp(-g2 * 16.) * .22);
    float undo = .45 + .55 * smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
    gl_FragColor = vec4(rgb / mix(1., undo, uUndo), a);
  }`,Wa=`
  uniform float uUndo, uAsp, uDisc, uMirror, uPoolY; uniform vec4 uPool;
  ${ee}${Ge}${st}
  varying vec2 vUv;
  void main(){
    vec3 rd = dirAt(vUv);
    // where you look down into a still pool (x0, x1, z0, z1 at height uPoolY), the sky as its water mirrors it
    if (uMirror > .5 && rd.y < 0.) {
      vec3 ro = uCamWorld[3].xyz; vec2 h = ro.xz + rd.xz * (uPoolY - ro.y) / rd.y;
      if (h.x > uPool.x && h.x < uPool.y && h.y > uPool.z && h.y < uPool.w) rd.y = -rd.y * .96 - .004;
    }
    vec3 c = skyColor(rd) + sunDisc(rd) * uDisc;
    float undo = .45 + .55 * smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
    gl_FragColor = vec4(c / mix(1., undo, uUndo), 1.);
  }`,ta=typeof location<"u"?new URLSearchParams(location.search):new URLSearchParams,vt=ta.get("hxdbg")??"",pe=Object.fromEntries((ta.get("hxq")??"").split("~").filter(Boolean).map(e=>{const[t,a]=e.split(":");return[t,Number(a)]})),Ut=new WeakMap;function Ia(e){let t=Ut.get(e);if(t)return t;const a={type:Rt,depthBuffer:!1},o=new Ke(1,1,{type:Rt,format:ga,depthBuffer:!0});o.texture.minFilter=o.texture.magFilter=Dt;const s=new Ke(1,1,a);s.texture.minFilter=s.texture.magFilter=Dt;const n=new Ke(1,1,a),r=new Ke(1,1,a);for(const i of[n,r])i.texture.minFilter=i.texture.magFilter=jt;return t={depthRT:o,cloudRT:s,maskRT:n,raysRT:r,W:0,H:0,low:new F(1,1),budget:1,ema:16,checked:0,lastNow:0},Ut.set(e,t),t}function Eo(e){const t=e.quality,a=Ga(e),o=pe.steps??[30,48,52][t],s=pe.lsteps??[2,3,4][t],n=pe.frac??[.3,.38,.45][t],r=pe.cap??[9e4,2e5,24e4][t],i=[14,20,28][t],l=Qt(),p={uProjInv:{value:new We},uCamWorld:{value:new We}},c=Ia(e.renderer),{depthRT:u,cloudRT:f,maskRT:g,raysRT:h}=c,x={uNoise:{value:a},uSea:{value:new ne(0,18,26,1/700)},uCalm:{value:new ne(0,-1,0,-1)},uSheet:{value:new ne(70,5,0,1/500)},uBankC:{value:Array.from({length:6},()=>new ne)},uBankR:{value:Array.from({length:6},()=>new ne(1,1,1,1))},uBanks:{value:0},uWind:{value:new P},uCalmDrop:{value:0},uDrop1:{value:new ne(1,0,1,0)},uDrop2:{value:new ne(1,0,1,0)}},v={...l,...p,...x,uDepth:{value:u.texture},uCamPos:{value:new P},uSigma:{value:.3},uDensity:{value:1},uFogK:{value:1/2600},uFar:{value:3200},uStepK:{value:[.05,.036,.028][t]},uStepMin:{value:[1.3,1,.8][t]},uCasterC:{value:new ne},uCasterR:{value:new ne(1,1,1,1)},uLightStep:{value:pe.lstep??[2.4,1.5,1.1][t]},uLightGrow:{value:pe.grow??[3.2,2.7,2.45][t]},uRampK:{value:pe.ramp??.9},uAmbGain:{value:1},uInside:{value:0},uSunGainC:{value:1},uSlabA:{value:new F(-60,60)},uSlabB:{value:new F(1,0)}},d=new V({uniforms:v,vertexShader:pt,fragmentShader:Ea(o,s),depthTest:!1,depthWrite:!1}),y=new V({uniforms:{uCam:v.uCamPos},vertexShader:Fa,side:_e,fragmentShader:"uniform vec3 uCam; varying vec3 vW; void main(){ gl_FragColor = vec4(length(vW - uCam), 0., 0., 1.); }"}),A=new V({uniforms:{...l,...p,uDepth:v.uDepth,uCloud:{value:f.texture}},vertexShader:pt,fragmentShader:Pa,depthTest:!1,depthWrite:!1}),D=new V({uniforms:{uMask:{value:g.texture},uSunUv:{value:new F(.5,.5)},uDecay:{value:.965},uSpan:{value:.85}},vertexShader:pt,fragmentShader:_a(i),depthTest:!1,depthWrite:!1}),b={...l,...p,uCloud:{value:f.texture},uDepth:v.uDepth,uRays:{value:h.texture},uLowRes:{value:new F(1,1)},uRayCol:{value:new L(1,.8,.6)},uHaze:{value:1/900},uUndo:{value:.8},uAsp:{value:1},uRaysOn:{value:1},uMask:{value:g.texture},uSunUv:{value:new F(.5,.5)},uGlare:{value:1},uTapK:{value:pe.taps??1.1}},T=new V({uniforms:b,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:Na,transparent:!0,depthTest:!1,depthWrite:!1,blending:De,blendSrc:ae,blendDst:Re,blendSrcAlpha:ae,blendDstAlpha:Re}),G=new V({uniforms:{...l,...p,uUndo:b.uUndo,uAsp:b.uAsp,uDisc:{value:1},uMirror:{value:0},uPool:{value:new ne},uPoolY:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .9999, 1.); }",fragmentShader:Wa,depthTest:!1,depthWrite:!1}),$=(w,M)=>{const S=new E(new he(2,2),w);return S.frustumCulled=!1,S.renderOrder=M,S},Q=$(G,-1e3),Y=$(T,900),ge=new V({uniforms:{uVeil:{value:0},uCol:{value:new L("#f5efe6")},uAsp:b.uAsp},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`uniform float uVeil, uAsp; uniform vec3 uCol; varying vec2 vUv;
      void main(){ vec2 q = (vUv - .5) * vec2(uAsp, 1.); float undo = .45 + .55 * smoothstep(1.25, .35, length(q));
        gl_FragColor = vec4(uCol * (1.04 + .1 * exp(-dot(q, q) * 2.)) / undo, 1.) * uVeil; }`,transparent:!0,depthTest:!1,depthWrite:!1,blending:De,blendSrc:ae,blendDst:Re,blendSrcAlpha:ae,blendDstAlpha:Re}),qe=$(ge,5e3),Me=new Mt,Ye=new Yt,Ce=$(d,0);Me.add(Ce);const Be=new ie;Be.add(Q,Y,qe);let Ae=!0,ue=1;const ze=new F(1,1),ce=new P,Ue=new P,ke=(w,M,S)=>{Ce.material=M,w.setRenderTarget(S),w.render(Me,Ye)};function Ze(w){if(c.lastNow&&w-c.lastNow<250&&(c.ema=c.ema*.94+(w-c.lastNow)*.06),c.lastNow=w,w-c.checked<1500)return;c.checked=w;const M=c.budget;c.ema>19?c.budget=Math.max(.4,c.budget*.82):c.ema<13.5&&(c.budget=Math.min(1,c.budget*1.12)),c.budget!==M&&(c.W=0)}function ct(w,M){if(w!==c.W||M!==c.H){c.W=w,c.H=M,u.setSize(w,M);const S=Math.min(n,Math.sqrt(r*c.budget/Math.max(1,w*M))),R=Math.max(2,Math.round(w*S)),N=Math.max(2,Math.round(M*S));f.setSize(R,N),c.low.set(R,N),g.setSize(Math.max(2,R>>1),Math.max(2,N>>1)),h.setSize(Math.max(2,R>>1),Math.max(2,N>>1))}b.uLowRes.value.copy(c.low)}const _=new L(Ne,Ne,Ne),j=new L;return Q.onBeforeRender=(w,M,S)=>{const R=w.getRenderTarget(),N=R?R.width:w.domElement.width,q=R?R.height:w.domElement.height;R&&Ze(performance.now()),ct(N,q),b.uAsp.value=N/q,ze.set(N,q),S.updateMatrixWorld(),p.uProjInv.value.copy(S.projectionMatrixInverse),p.uCamWorld.value.copy(S.matrixWorld),v.uCamPos.value.setFromMatrixPosition(S.matrixWorld);const K=w.getClearColor(j),re=w.getClearAlpha(),Te=S.layers.mask,X=M.background;S.layers.set(ea),M.overrideMaterial=y,M.background=null,w.setRenderTarget(u),w.setClearColor(_,1),w.clear(!0,!0,!1),w.render(M,S),M.overrideMaterial=null,S.layers.mask=Te,M.background=X,w.setClearColor(0,0),Ae?ke(w,d,f):(w.setRenderTarget(f),w.clear(!0,!1,!1)),S.getWorldDirection(Ue);const we=At.smoothstep(Ue.dot(l.uSunDir.value),-.1,.35);b.uRaysOn.value=we*ue,b.uRaysOn.value>.001&&(ce.copy(v.uCamPos.value).addScaledVector(l.uSunDir.value,1e3).project(S),D.uniforms.uSunUv.value.set(ce.x*.5+.5,ce.y*.5+.5),b.uSunUv.value.copy(D.uniforms.uSunUv.value),ke(w,A,g),ke(w,D,h)),w.setClearColor(K,re),w.setRenderTarget(R)},{group:Be,sky:l,march:v,comp:b,skyMat:G,cloud:f.texture,screen:ze,light(w,M=0,S=0,R=0){Jt(l,w,M,S,R),b.uRayCol.value.copy(l.uSunCol.value).multiplyScalar(.3+M*.3);const N=b.uRayCol.value,q=Math.max(N.r,N.g,N.b);q>2&&N.multiplyScalar(2/q)},field(w,M){const S=w.sea,R=w.sheet,N=w.banks??[];x.uSea.value.set(S?.top??0,S?S.roll:-1,S?.towers??0,S?.scale??1/700),w.calm?x.uCalm.value.set(w.calm[0],w.calm[1],w.calm[2],w.calm[3]):x.uCalm.value.set(1e6,1e6,1e6,1e6),x.uCalmDrop.value=w.drop?.amount??0;const[q,K]=w.drop?.boxes??[];q&&x.uDrop1.value.set(q[0],q[1],q[2],q[3]),K?x.uDrop2.value.set(K[0],K[1],K[2],K[3]):x.uDrop2.value.set(1,0,1,0),x.uSheet.value.set(R?.y??0,R?.half??1,R?.amt??0,R?.scale??1/500),x.uBanks.value=Math.min(6,N.length);let re=1e9,Te=-1e9;S&&(re=S.top-S.roll*.5-40,Te=S.top+S.roll*.5+S.towers+16),N.slice(0,6).forEach((X,we)=>{x.uBankC.value[we].set(X.at[0],X.at[1],X.at[2],X.amt??1),x.uBankR.value[we].set(X.r[0],X.r[1],X.r[2],Math.min(X.r[0],X.r[1],X.r[2])*.9)}),v.uSlabA.value.set(re,Te),R&&R.amt>0?v.uSlabB.value.set(R.y-R.half-24,R.y+R.half+26):v.uSlabB.value.set(1,0),x.uWind.value.set(M*1.1,0,M*.35)},set({density:w=1,rays:M=1,haze:S=1/900,fog:R=1/2600,disc:N=1,sigma:q=.32,amb:K=.8,sun:re=1,on:Te=!0,inside:X=0,veil:we=0,mirror:xe=null}={}){v.uInside.value=X,ge.uniforms.uVeil.value=we,qe.visible=we>.001,G.uniforms.uMirror.value=xe?1:0,xe&&(G.uniforms.uPool.value.set(xe[0],xe[1],xe[2],xe[3]),G.uniforms.uPoolY.value=xe[4]),v.uDensity.value=w,ue=M,b.uHaze.value=S,v.uFogK.value=R,G.uniforms.uDisc.value=N,v.uSigma.value=q,v.uAmbGain.value=K,v.uSunGainC.value=re,Ae=Te&&w>.001,vt.includes("norays")&&(ue=0),vt.includes("noclouds")&&(Ae=!1),Y.visible=!vt.includes("nocomp")},caster(w,M=1){if(!w){v.uCasterC.value.w=0;return}v.uCasterC.value.set(w.at[0],w.at[1],w.at[2],M),v.uCasterR.value.set(w.r[0],w.r[1],w.r[2],1)},warm(w,M){const S=w.getRenderTarget();w.setRenderTarget(f);for(const R of[d,A,D])Ce.material=R,w.compileAsync(Me,Ye).catch(()=>{});w.setRenderTarget(S)},dispose(){for(const w of[d,y,A,D,T,G,ge])w.dispose();for(const w of[Q,Y,qe,Ce])w.geometry.dispose()}}}function kt(e,{color:t="#f2cf86",rough:a=.13,leaf:o=.3,lite:s=!1,leafAmt:n=1}={}){const r=new xa({color:t,metalness:1,roughness:a,envMap:e,envMapIntensity:1.2,emissive:new L(t).multiplyScalar(.05)}),i={uLeaf:{value:o},uLeafAmt:{value:n}};return r.onBeforeCompile=l=>{Object.assign(l.uniforms,i),l.vertexShader=l.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLeafP; varying vec3 vLeafN; varying vec3 vNm0; varying vec3 vNm1; varying vec3 vNm2;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vLeafP = position; vLeafN = normal;
        mat3 nmx = normalMatrix;
        #ifdef USE_INSTANCING
          nmx = nmx * mat3(instanceMatrix);
        #endif
        vNm0 = nmx[0]; vNm1 = nmx[1]; vNm2 = nmx[2];`),l.fragmentShader=l.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vLeafP; varying vec3 vLeafN; varying vec3 vNm0; varying vec3 vNm1; varying vec3 vNm2; uniform float uLeaf, uLeafAmt;
      float lh(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
      float lnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(lh(i), lh(i + vec2(1, 0)), f.x), mix(lh(i + vec2(0, 1)), lh(i + vec2(1, 1)), f.x), f.y); }
      // the leaf under this point: its id, how near its edge (0 at a seam), its local coordinates
      vec4 leafAt(out vec2 cid){
        vec3 n = abs(vLeafN); vec2 p = n.z > max(n.x, n.y) ? vLeafP.xy : n.x > n.y ? vLeafP.zy : vLeafP.xz;
        p /= uLeaf;
        float row = floor(p.y); p.x += lh(vec2(row, 7.1)) * .9;      // each row laid a little off the last
        cid = floor(p); vec2 f = fract(p);
        float edge = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y));
        return vec4(f, edge, lh(cid));
      }
      vec2 gLeafCid; vec4 gLeaf;`).replace("#include <color_fragment>",`#include <color_fragment>
        gLeaf = leafAt(gLeafCid);
        float lt = lh(gLeafCid + 3.3);
        diffuseColor.rgb *= mix(vec3(1.), mix(vec3(1.03, .99, .94), vec3(.96, .95, .97), lt), .3 * uLeafAmt);   // a shade apart, leaf by leaf
        diffuseColor.rgb *= 1. - .1 * (1. - smoothstep(.0, .025, gLeaf.z)) * uLeafAmt;                       // the seams, a touch darker`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor * (.8 + .4 * lh(gLeafCid + 9.7) * uLeafAmt) + .12 * (1. - smoothstep(0., .025, gLeaf.z)) * uLeafAmt, .05, 1.);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          mat3 nm = mat3(vNm0, vNm1, vNm2);
          // each leaf a little off flat, crinkled where it was pressed
          vec3 tilt = (vec3(lh(gLeafCid + 1.3), lh(gLeafCid + 5.9), lh(gLeafCid + 2.2)) - .5) * .065;
          vec2 cq = gLeaf.xy * 7.;
          float c0 = lnoise(cq), cx = lnoise(cq + vec2(.05, 0.)), cy = lnoise(cq + vec2(0., .05));
          vec3 crinkle = vec3(cx - c0, cy - c0, 0.) * 2.6;
          vec3 off = nm * (tilt + crinkle * .5);
          normal = normalize(normal + off * uLeafAmt);
        }`)},r.customProgramCacheKey=()=>`hx-gold-${s?1:0}`,Object.assign(r,{leafU:i})}function Va(){const e=new V({transparent:!0,depthWrite:!1,depthTest:!0,blending:De,blendSrc:ae,blendDst:ae,uniforms:{uDraw:{value:1},uAmt:{value:1},uCol:{value:new L(1,.82,.52)},uTime:{value:0},uR:{value:.78},uCloud:{value:null},uScreen:{value:new F(1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uDraw, uAmt, uTime, uR; uniform vec3 uCol; uniform sampler2D uCloud; uniform vec2 uScreen; varying vec2 vUv;
      const float TAU = 6.2831853;
      float stroke(float d, float w){ return exp(-d * d / (w * w * .00006)) * 1.15 + exp(-d * d / (w * w * .0016)) * .36 + exp(-d * d / .02) * .05; }
      void main(){
        vec2 p = (vUv - .5) * 2.; float r = length(p);
        float ang = fract(atan(p.x, p.y) / TAU + 1.);                   // 0 at the top, clockwise
        // the circle, drawn round by the compass
        float cd = smoothstep(0., .3, uDraw), dr = r - uR;
        float circ = stroke(dr, 1.) * (smoothstep(cd + .004, cd - .03, ang) + exp(-pow((ang - cd) * 26., 2.)) * 1.6 * step(cd, .999)) * step(.0005, cd);
        // the chords k → k + 5 of twelve points on it: a twelve-point star, each drawn from its first point
        float ch = 0., tips = 0.;
        for (int k = 0; k < 12; k++) {
          float c = clamp((uDraw - .26 - float(k) * .04) / .15, 0., 1.);
          if (c <= 0.) continue;
          float a0 = float(k) / 12. * TAU, a1 = float(k + 5) / 12. * TAU;
          vec2 A = uR * vec2(sin(a0), cos(a0)), B = mix(A, uR * vec2(sin(a1), cos(a1)), c);
          vec2 pa = p - A, ba = B - A; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.);
          float d = length(pa - ba * h);
          ch = max(ch, stroke(d, .8));
          tips += exp(-dot(p - B, p - B) / .0009) * step(c, .999);
        }
        // the circle the chords touch, and the light filling the star
        float inner = .2588 * uR, fill = smoothstep(.8, 1., uDraw);
        float ic = stroke(r - inner, .7) * fill;
        float shimmer = .9 + .1 * sin(ang * TAU * 3. + uTime * .7);
        float disc = exp(-r * r * 2.6) * .14 * fill;
        vec3 c = uCol * ((circ + ch * .85 + ic * .6) * shimmer + tips * 1.4 + disc);
        c *= smoothstep(1., .9, r) * uAmt;
        c *= 1. - texture2D(uCloud, gl_FragCoord.xy / uScreen).a * .92;
        gl_FragColor = vec4(c, 0.);
      }`}),t=new E(new he(1,1),e);return t.renderOrder=1100,{mesh:t,U:e.uniforms,dispose(){t.geometry.dispose(),e.dispose()}}}function Fo(e,t=!1,a,o=1){const s=wa(.5),n=kt(e,{lite:t,leaf:.3/Math.sqrt(o)}),r=new E(s,n),i=Va();a&&(i.U.uCloud.value=a.cloud,i.U.uScreen.value=a.screen);const l=new ie;l.add(r),l.scale.setScalar(o);const p=new P;return{group:l,mark:r,gold:n,halo:i,placeHalo(c,u=1.42,f=1.1){l.getWorldPosition(p),i.mesh.position.copy(p).sub(c.position).setLength(f).add(p),i.mesh.quaternion.copy(c.quaternion),i.mesh.scale.setScalar(3.9*u*l.scale.x)},dispose(){s.dispose(),n.dispose(),i.dispose()}}}const O=(e,t)=>new F(e,t);function Oa(e,t,a){const o=Math.min(.28*e,.9*t),s=-e/2+o,n=v=>{const d=O(s-o*Math.cos(v),o*Math.sin(v)),y=O(Math.cos(v),-Math.sin(v)),A=O(-d.x,t-d.y),D=A.lengthSq()/(2*A.dot(y));return{Q:d,R2:D,C2:d.clone().addScaledVector(y,D)}};let r=.5,i=1.5;for(let v=0;v<30;v++){const d=(r+i)/2;n(d).C2.x<.045*e?r=d:i=d}const l=i,{Q:p,R2:c,C2:u}=n(l),f=Math.atan2(p.y-u.y,p.x-u.x),g=Math.atan2(t-u.y,-u.x),h=Math.max(3,Math.round(a*.35)),x=[];for(let v=0;v<h;v++){const d=Math.PI-l*v/h;x.push(O(s+Math.cos(d)*o,Math.sin(d)*o))}for(let v=0;v<=a-h;v++){const d=f+(g-f)*v/(a-h);x.push(O(u.x+Math.cos(d)*c,u.y+Math.sin(d)*c))}return x}function Je(e,t,a,o=28,s=7){const n=t;let r;if(e==="persian"&&a<n*.48)r=Oa(n,a,o);else{a=Math.max(a,n*.52);const h=(a*a+n*n/4)/n,x=h-n/2,v=Math.atan2(a,-x),d=e==="horseshoe"?.36:0;r=[];for(let y=0;y<=o;y++){const A=Math.PI+d-(Math.PI+d-v)*y/o;r.push(O(-n/2+h+Math.cos(A)*h,Math.sin(A)*h))}}const i=[...r,...r.slice(0,-1).reverse().map(h=>O(-h.x,h.y))];if(e!=="lobed")return i;const l=[0];for(let h=1;h<i.length;h++)l.push(l[h-1]+i[h].distanceTo(i[h-1]));const p=l[l.length-1],c=p/s*.42,u=[],f=6,g=s*f;for(let h=0;h<=g;h++){const x=p*h/g,v=h%f/f;let d=1;for(;d<l.length-1&&l[d]<x;)d++;const y=(x-l[d-1])/Math.max(1e-6,l[d]-l[d-1]),A=i[d-1].clone().lerp(i[d],y),D=i[d].clone().sub(i[d-1]).normalize(),b=O(D.y,-D.x),T=c*(1-Math.sqrt(Math.max(0,1-(2*v-1)*(2*v-1))));u.push(A.addScaledVector(b,h===0||h===g?0:T))}return u}function Ha(e,t=28){const a=Je(e.kind??"pointed",e.w,e.rise,t,e.lobes).map(o=>O(o.x+e.x,o.y+e.spring));return[O(a[0].x,0),...a,O(a[a.length-1].x,0)]}function rt(e,t,a,o,{foot:s=1,bevel:n=.05}={}){const r=new Se([O(-e/2,-s),O(e/2,-s),O(e/2,t),O(-e/2,t)]);for(const l of o)r.holes.push(new nt(Ha(l)));const i=new He(r,{depth:a-n*2,bevelEnabled:n>0,bevelThickness:n,bevelSize:n,bevelSegments:1,curveSegments:1});return i.translate(0,0,-a+n),i}function it(e,t,a,o,s,{n=7,proud:r=.06,joint:i=.025}={}){const l=e.kind==="lobed"?"pointed":e.kind??"pointed",p=Je(l,e.w,e.rise,n),c=Je(l,e.w+a*2,e.rise+a*1.15,n);for(let u=0;u<p.length-1;u++){const f=[p[u],p[u+1],c[u+1],c[u]].map(v=>O(v.x+e.x,v.y+e.spring)),g=f.reduce((v,d)=>v.add(d),O(0,0)).multiplyScalar(.25),h=f.map(v=>v.clone().lerp(g,i/Math.max(.2,v.distanceTo(g)))),x=new He(new Se(h),{depth:t+r*2,bevelEnabled:!1});x.translate(0,0,-t-r),(u%2?s:o).push(x)}}function Ie(e,t,a,o,s,n=0){const r=o*.62,i=Math.max(1,Math.floor((t-e)/(r*1.5))),l=(t-e)/i,p=[],c=[[-.5,0],[.5,0],[.5,.42],[.32,.42],[.32,.72],[.15,.72],[.15,1],[-.15,1],[-.15,.72],[-.32,.72],[-.32,.42],[-.5,.42]],u=new Se(c.map(([g,h])=>O(g*r,h*o))),f=new He(u,{depth:s,bevelEnabled:!1});for(let g=0;g<i;g++){const h=f.clone();h.translate(e+l*(g+.5),a,n-s/2),p.push(h)}return f.dispose(),de(p)}function z(e,t,a,o,s,n){const r=new ya(o-e,s-t,n-a);return r.translate((e+o)/2,(t+s)/2,(a+n)/2),r}function W(e,t=48){return new ba(e.map(([a,o])=>O(Math.max(0,a),o)),t)}function se(e,t,a=1.06,o=28){const s=[];for(let n=0;n<=o;n++){const r=n/o,i=r<.22?1+(a-1)*Math.sin(r/.22*Math.PI/2):a*Math.cos(Math.pow((r-.22)/.78,1.25)*Math.PI/2);s.push([e*i,r*t])}return s[o][0]=0,s}function ve(e){const t=e/10;return[[0,0],[.55*t,.15*t],[.3*t,.7*t],[.9*t,1.6*t],[1.1*t,2.4*t],[.9*t,3.2*t],[.25*t,3.8*t],[.6*t,4.6*t],[.7*t,5.2*t],[.55*t,5.8*t],[.16*t,6.3*t],[.4*t,6.9*t],[.4*t,7.4*t],[.12*t,7.8*t],[.06*t,9.2*t],[0,10*t]]}function de(e){const t=[],a=[],o=[],s=[];for(const r of e){const i=r.getAttribute("position"),l=r.getAttribute("normal"),p=r.getAttribute("uv"),c=t.length/3;for(let f=0;f<i.count;f++)t.push(i.getX(f),i.getY(f),i.getZ(f)),l?a.push(l.getX(f),l.getY(f),l.getZ(f)):a.push(0,1,0),p?o.push(p.getX(f),p.getY(f)):o.push(0,0);const u=r.getIndex();if(u)for(let f=0;f<u.count;f++)s.push(c+u.getX(f));else for(let f=0;f<i.count;f++)s.push(c+f)}const n=new yt;n.setAttribute("position",new ft(t,3)),n.setAttribute("normal",new ft(a,3)),n.setAttribute("uv",new ft(o,2)),n.setIndex(s);for(const r of e)r.dispose();return n}function I(e,t,a,o,s=0){return s&&e.rotateY(s),e.translate(t,a,o),e}const $e=`
  float ph3(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float pvn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(mix(ph3(i), ph3(i + vec3(1, 0, 0)), f.x), mix(ph3(i + vec3(0, 1, 0)), ph3(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(ph3(i + vec3(0, 0, 1)), ph3(i + vec3(1, 0, 1)), f.x), mix(ph3(i + vec3(0, 1, 1)), ph3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
  float psdBox(vec2 p, float b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
  // the star and cross: eight-point stars (two squares) touching point to point, crosses between them; < 0 in a star
  float starCross(vec2 p){
    vec2 q = fract(p) - .5;
    vec2 r = vec2(q.x + q.y, q.x - q.y) * .70710678;
    return min(psdBox(q, .3536), psdBox(r, .3536));
  }
`;function je(e,t){const a=new Ma(e);return a.onBeforeCompile=o=>{Object.assign(o.uniforms,t.uniforms??{}),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWp; varying vec3 vWn;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
        {
          vec4 wq = vec4(transformed, 1.); mat3 im = mat3(1.);
          #ifdef USE_INSTANCING
            wq = instanceMatrix * wq; im = mat3(instanceMatrix);
          #endif
          wq = modelMatrix * wq; vWp = wq.xyz; vWn = normalize(mat3(modelMatrix) * im * objectNormal);
        }`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWp; varying vec3 vWn;
${$e}
${t.pars??""}`).replace("#include <color_fragment>",`#include <color_fragment>
${t.color??""}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
${t.rough??""}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${t.emissive??""}`)},a.customProgramCacheKey=()=>t.key,a}function lt(e,{color:t="#f1ebe1",rough:a=.34,env:o=.85,veins:s=1,key:n="hx-marble"}={}){return je({color:t,roughness:a,metalness:0,envMap:e,envMapIntensity:o},{key:n,uniforms:{uVeins:{value:s}},pars:"uniform float uVeins;",color:`{
      vec3 w = vWp * .085;
      float n = pvn3(w + pvn3(w * 2.1) * .7) * .62 + pvn3(w * 3.3) * .26 + pvn3(w * 9.) * .12;
      float vein = 1. - smoothstep(0., .03, abs(n - .5));
      diffuseColor.rgb *= 1. - uVeins * (vein * .09 + (pvn3(vWp * .6) - .5) * .05);
      diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(.93, .96, 1.02), vein * uVeins * .5);
    }`})}function aa(e,{cell:t=.9,star:a="#2c4f9a",cross:o="#3ea79f",ground:s="#f4efe5",key:n="hx-tile"}={}){return je({color:"#ffffff",roughness:.2,metalness:0,envMap:e,envMapIntensity:1.15},{key:n,uniforms:{uCell:{value:t},uStar:{value:new L(a)},uCross:{value:new L(o)},uGround:{value:new L(s)}},pars:"uniform float uCell; uniform vec3 uStar, uCross, uGround;",color:`{
      vec3 n = abs(vWn);
      vec2 p = (n.y > max(n.x, n.z) ? vWp.xz : n.x > n.z ? vWp.zy : vWp.xy) / uCell;
      float d = starCross(p), aa = fwidth(d) * 1.2;
      float band = 1. - smoothstep(.035, .035 + aa, abs(d));
      float edge = 1. - smoothstep(.004, .004 + aa, abs(abs(d) - .036));
      vec3 c = mix(uCross, uStar, smoothstep(aa, -aa, d));
      vec2 q = fract(p) - .5;
      c = mix(c, uGround, (1. - smoothstep(.1, .1 + aa, length(q))) * .9);   // a white rosette at each star's heart
      c = mix(c, uGround, band);
      c = mix(c, vec3(.86, .66, .33), edge * .7);   // a hair of gold between band and glaze
      diffuseColor.rgb = c;
    }`})}function oa(e){return lt(e,{color:"#e6cf9f",rough:.4,env:.75,veins:.5,key:"hx-honey"})}function na(e){return lt(e,{color:"#fbf8f1",rough:.26,env:.9,veins:.35,key:"hx-pearl"})}function bt(e,{mode:t="sky",tint:a="#2a8a8e",depth:o=.9,cell:s=.7,ripple:n=1}={}){const r={...e,uCam:{value:new P},uTime:{value:0},uTint:{value:new L(a)},uDepth:{value:o},uCell:{value:s},uRipple:{value:n},uAmt:{value:1}};return{mat:new V({uniforms:r,transparent:t==="mirror",depthWrite:!0,blending:t==="mirror"?De:Sa,blendSrc:ae,blendDst:Re,blendSrcAlpha:ae,blendDstAlpha:Re,vertexShader:"varying vec3 vWp; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vWp = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${ee}${Ge}${$e}
      uniform vec3 uCam, uTint; uniform float uTime, uDepth, uCell, uRipple, uAmt; varying vec3 vWp;
      void main(){
        vec3 V = normalize(vWp - uCam);
        vec2 p = vWp.xz, g = vec2(0.);
        float t = uTime;
        g += vec2(cos(p.x * 1.9 + t * 1.2 + sin(p.y * .7)), cos(p.y * 1.4 - t * .9)) * .010;
        g += vec2(cos(dot(p, vec2(3.1, 1.7)) + t * 1.8), cos(dot(p, vec2(-2.3, 3.4)) - t * 1.5)) * .007;
        g += (vec2(pvn3(vec3(p * 2.2, t * .8)), pvn3(vec3(p * 2.2 + 7.3, t * .8))) - .5) * .022;
        g *= uRipple;
        vec3 N = normalize(vec3(-g.x, 1., -g.y));
        vec3 R = reflect(V, N); R.y = abs(R.y);
        float c = clamp(dot(-V, N), 0., 1.), F = .02 + .98 * pow(1. - c, 5.);
        vec3 glit = uSunCol * (pow(max(dot(R, uSunDir), 0.), 900.) * 5. + pow(max(dot(R, uSunDir), 0.), 70.) * .22);
        ${t==="sky"?`
        // the bed, seen through the water a little bent: tile in the star and cross, turquoise and white, deeper bluer
        vec2 bp = (p + V.xz / max(-V.y, .12) * uDepth * .75 + g * 3.) / uCell;
        float d = starCross(bp), aa = fwidth(d) * 1.5;
        vec3 bed = mix(vec3(.62, .86, .84), vec3(.96, .95, .9), 1. - smoothstep(.03, .03 + aa, abs(d)));
        bed = mix(bed, vec3(.28, .58, .7), smoothstep(aa, -aa, d) * .55);
        vec3 sub = bed * uTint * 2.2 * (uAmbTop * .5 + uSunCol * .15) * uSkyGain;
        vec3 col = mix(sub, skyColor(R), F) + glit;
        gl_FragColor = vec4(col * uAmt, 1.);`:`
        // still: what is beneath (the reflection) shows by the Fresnel; looking in, the water's own deep tint
        float a = (1. - F) * .82;
        vec3 col = uTint * (uAmbTop * .32 + uSunCol * .06) * uSkyGain * a + glit * (.6 + .4 * F);
        gl_FragColor = vec4(col, a) * uAmt;`}
      }`}),U:r,update(l,p){r.uCam.value.copy(l.position),r.uTime.value=p}}}const $a={top:0,roll:16,towers:26,scale:1/650},ja=[-215,215,-460,-150],Ya={amount:14,boxes:[[-50,50,-380,-162],[-206,206,-428,-368]]},Po=(e={})=>({sea:$a,calm:ja,drop:Ya,...e}),_o=[{at:[-430,24,-780],r:[90,48,64]},{at:[460,30,-820],r:[96,52,66]},{at:[-92,2,-296],r:[30,15,48],amt:.85},{at:[94,4,-268],r:[32,16,48],amt:.85}],et={dawn:16,garden:24,star:22},No={wide:38,tall:58},m=6,te=5.62,Za={z:-168,w:24,h:30,depth:5,open:11,spring:m+9,rise:9},C={x:44,z0:-168,z1:-374,chan:1.5,chanZ:[-176,-326],cross:-246,crossX:32,basin:6.5,cypX:8.4},Ve={z:-350,half:15,wall:2.2,open:13,spring:m+12.5,rise:9.5,top:m+27,drum:[m+27,m+33],r:12.4,dome:22},B={z0:-374,z1:-404,x:200},oe={z:-406,depth:2.6,x:196},Wo=[-200,B.x,B.z1,B.z0,te],Io={motes:.85,focus:14},Et={wide:{pitch:11,open:8.4,film:[7.2,4.05],foot:m+1.8,rise:2.3},tall:{pitch:7.4,open:5.1,film:[4.3,7.64],foot:m+1.6,rise:1.8}},Tt=e=>e?Et.tall:Et.wide,sa=e=>{const t=Tt(e);return t.foot+t.film[1]+.22},ra=(e,t,a)=>a*(e+1)*Tt(t).pitch,Ka=[{x:-820,z:-1650,s:1.05,yaw:.3,kind:0},{x:-300,z:-1430,s:.85,yaw:-.2,kind:1},{x:300,z:-1480,s:1.05,yaw:.1,kind:2},{x:860,z:-1700,s:.95,yaw:-.4,kind:0}],Vo={u:[0,.14],mark:[4.5,14,0],bank:{at:[0,15,60],r:[44,19,26]}},Oo=[.14,.3],Ho={u:[.3,.4],up:.24,light:[.28,.72],down:.8},dt={u:[.4,.8],first:.07,last:.93},$o=(e,t)=>(e-dt.first)/(dt.last-dt.first)*(t-1),jo={u:[.8,.93]},Yo={u:[.93,1],settle:.35,write:.38},ut=(e,t,a)=>ra(a-1,e,t),Xa=(e,t,a)=>[ut(e,t,a)+t*20,70,-472],tt=()=>({marble:[],paving:[],tile:[],honey:[],pearl:[],gold:[]}),Fe=(e,t,a,o,s=0)=>I(e,t,a,o,s);function Qa(e){const{x:t,z0:a,z1:o,chan:s,chanZ:n,cross:r,crossX:i}=C,l=m-3.4,p=(v,d,y,A)=>e.paving.push(z(v,l,Math.min(y,A),d,m,Math.max(y,A))),c=(v,d,y,A)=>{e.honey.push(z(v,m-1.25,y,d,m-.25,A)),e.gold.push(z(v-.02,m-.3,y-.02,d+.02,m-.2,A+.02))};c(-t-.3,t+.3,a-.3,a+.3),c(-t-.3,-t+.3,o,a),c(t-.3,t+.3,o,a),e.marble.push(z(-t+1.2,l-1.6,o+1.2,t-1.2,l+.01,a-1.2)),p(-t,t,a,n[0]),p(-t,t,n[1],o),p(i,t,n[0],n[1]),p(-t,-i,n[0],n[1]);for(const v of[-1,1])p(v>0?s:-i,v>0?i:-s,n[0],r+s),p(v>0?s:-i,v>0?i:-s,r-s,n[1]);const u=(v,d,y)=>{e.marble.push(z(v-.3,m,y,v+.3,m+.24,d)),e.gold.push(z(v-.045,m+.24,y,v+.045,m+.27,d))},f=(v,d,y)=>{e.marble.push(z(d,m,v-.3,y,m+.24,v+.3)),e.gold.push(z(d,m+.24,v-.045,y,m+.27,v+.045))};for(const v of[-1,1])u(v*(s+.3),n[0],r+C.basin+.4),u(v*(s+.3),r-C.basin-.4,n[1]),f(r+v*(s+.3),C.basin+.4,i),f(r+v*(s+.3),-i,-6.5-.4);f(n[0]-.3,-s-.6,s+.6);const g=v=>Array.from({length:8},(d,y)=>new F(Math.cos((y+.5)/8*6.2832)*v,Math.sin((y+.5)/8*6.2832)*v)),h=new Se(g(C.basin+.6));h.holes.push(new nt(g(C.basin)));const x=new He(h,{depth:.7,bevelEnabled:!0,bevelSize:.05,bevelThickness:.05,bevelSegments:1});x.rotateX(-Math.PI/2),x.translate(0,m+.05,r),e.marble.push(x),e.marble.push(W([[0,0],[.9,0],[.5,.3],[.42,1.1],[.7,1.5],[1.7,1.75],[1.85,1.95],[1.6,2.05],[.3,1.75],[0,1.8]],24).translate(0,m,r))}function Ja(){const e=St(31),t=[];for(const a of[-1,1])for(let o=C.chanZ[0]-8;o>C.chanZ[1]+6;o-=9){if(Math.abs(o-C.cross)<13)continue;const s=.92+e()*.16,n=new We().compose(new P(a*C.cypX,m,o),new Zt().setFromAxisAngle(new P(0,1,0),e()*6.28),new P(s,s*(.95+e()*.12),s));t.push(n)}return t}const eo=()=>{const e=[];for(let t=0;t<=24;t++){const a=t/24;e.push([.98*(.42+.58*Math.sin(Math.PI/2*Math.min(1,a/.28)))*(1-Math.pow(a,2.3)),a*10.5])}return W(e,18)};function to(e){const t=C.chanZ[0]-6,a=C.chanZ[1]+4,o=t-a,s=9,n=Math.floor(o/s),r=Array.from({length:n},(i,l)=>({x:(l-(n-1)/2)*s,w:5.6,spring:5.2,rise:3.6,kind:"pointed"}));for(const i of[-1,1]){const l=i>0?-Math.PI/2:Math.PI/2,p=i*(C.x-3);e.marble.push(Fe(rt(o,10.4,2,r),p,m,(t+a)/2,l)),e.tile.push(Fe(z(-o/2,9.2,-.1,o/2,10.4,.08),p,m,(t+a)/2,l)),e.marble.push(Fe(Ie(-o/2,o/2,10.4,1.3,.7,-1),p,m,(t+a)/2,l));const c=[],u=[];for(const f of r)it(f,2,.5,c,u,{n:5});for(const f of c)e.pearl.push(Fe(f,p,m,(t+a)/2,l));for(const f of u)e.honey.push(Fe(f,p,m,(t+a)/2,l))}}function ia(e,t,a,o,s,n,r=.1){e.tile.push(z(t,o,-.05,t+n,s,r),z(a-n,o,-.05,a,s,r),z(t+n,s-n,-.05,a-n,s,r)),e.gold.push(z(t+n,s-n-.06,-.05,a-n,s-n,r+.02),z(t+n,o,-.05,t+n+.06,s-n,r+.02),z(a-n-.06,o,-.05,a-n,s-n,r+.02))}function la(e,t,a,o,s,n){const r=new U(a*.9,a,t,8,1,!1);r.translate(o,s+t/2,n),e.marble.push(r);for(const l of[.45,.78]){const p=new U(a*1.25,a*1.25,.3,8);p.translate(o,s+t*l,n),e.gold.push(p)}const i=new U(a*1.35,a*1.2,.45,8);i.translate(o,s+t+.22,n),e.marble.push(i),e.marble.push(W(se(a*1.15,a*1.9,1.05,14),16).translate(o,s+t+.45,n)),e.gold.push(W(ve(a*1.6),12).translate(o,s+t+.45+a*1.9-.05,n))}function ao(e){const{z:t,w:a,h:o,depth:s,open:n,spring:r,rise:i}=Za,l={x:0,w:n,spring:r-m,rise:i,kind:"lobed",lobes:9};e.marble.push(I(rt(a,o,s,[l]),0,m,t));const p=[],c=[];it(l,s,.9,p,c,{n:9}),p.forEach(f=>e.pearl.push(f.translate(0,m,t))),c.forEach(f=>e.honey.push(f.translate(0,m,t)));const u=tt();ia(u,-n/2-2.6,n/2+2.6,0,r-m+i+3.2,1.05);for(const f of["tile","gold"])for(const g of u[f])e[f].push(g.translate(0,m,t));for(const f of[-1,1]){const g=new zt(.72,.08,6,28);g.translate(f*(n/2+.9),m+r-m+i*.72,t+.14),e.gold.push(g)}e.tile.push(z(-a/2,m+o-2.6,t-.05,a/2,m+o-1.2,t+.1)),e.marble.push(Ie(-a/2,a/2,m+o,1.8,1.2,t-s/2));for(const f of[-1,1]){la(e,o+5,.95,f*(a/2+.4),m,t-.6);const g=f>0?a/2:-44,h=f>0?C.x:-a/2;e.marble.push(z(g,m-1,t-2.6,h,m+6.5,t-.6)),e.marble.push(Ie(g,h,m+6.5,1.2,.7,t-1.6)),e.tile.push(z(g,m+5.2,t-.6,h,m+6.2,t-.5))}}function oo(e){const{z:t,half:a,wall:o,open:s,spring:n,rise:r,top:i,drum:l,r:p,dome:c}=Ve,u=i-m,f={x:0,w:s,spring:n-m,rise:r,kind:"pointed"},g=[{len:a*2,x:0,z:t+a,yaw:0},{len:a*2,x:0,z:t-a,yaw:Math.PI},{len:a*2-o*2,x:a,z:t,yaw:Math.PI/2},{len:a*2-o*2,x:-a,z:t,yaw:-Math.PI/2}];for(const d of g){e.marble.push(I(rt(d.len,u,o,[f]),d.x,m,d.z,d.yaw));const y=[],A=[];it(f,o,.85,y,A,{n:8}),y.forEach(b=>e.pearl.push(I(b,d.x,m,d.z,d.yaw))),A.forEach(b=>e.honey.push(I(b,d.x,m,d.z,d.yaw)));const D=tt();ia(D,-s/2-2.2,s/2+2.2,0,n-m+r+2.6,.95),D.tile.push(z(-d.len/2,u-2.3,-.05,d.len/2,u-1,.1));for(const b of["tile","gold"])for(const T of D[b])e[b].push(I(T,d.x,m,d.z,d.yaw));e.marble.push(I(Ie(-d.len/2,d.len/2,u,1.5,.9,-o/2),d.x,m,d.z,d.yaw));for(const b of[-1,1]){const T=new zt(.6,.07,6,28);T.translate(b*(s/2+.8),n-m+r*.7,.14),e.gold.push(I(T,d.x,m,d.z,d.yaw))}}const h=new Se([new F(-a,-a),new F(a,-a),new F(a,a),new F(-a,a)]);h.holes.push(new nt(Array.from({length:48},(d,y)=>new F(Math.cos(y/48*6.283)*(p-.3),Math.sin(y/48*6.283)*(p-.3)))));const x=new He(h,{depth:.6,bevelEnabled:!1});x.rotateX(-Math.PI/2),x.translate(0,i-.6,t),e.marble.push(x);const v=new U(p,p+.15,l[1]-l[0],16,1,!0);v.translate(0,(l[0]+l[1])/2,t),e.marble.push(v),e.gold.push(I(new U(p+.35,p+.35,.35,32,1,!0),0,l[1]-.1,t)),e.tile.push(I(new U(p+.18,p+.18,1.2,32,1,!0),0,l[1]-1.1,t)),e.marble.push(W(se(p+.2,c,1.08,30),48).translate(0,l[1],t)),e.gold.push(W(ve(7.5),16).translate(0,l[1]+c-.25,t));for(const d of[-1,1])for(const y of[-1,1]){const A=d*(a-2.2),D=t+y*(a-2.2),b=i;e.marble.push(I(new U(1.9,2.1,.5,8),A,b+.25,D));for(let T=0;T<8;T++){const G=T/8*6.283+.39;e.marble.push(I(new U(.13,.13,2.6,6),A+Math.cos(G)*1.6,b+1.8,D+Math.sin(G)*1.6))}e.marble.push(I(new U(2.05,1.9,.35,8),A,b+3.25,D)),e.marble.push(W(se(1.75,2.5,1.06,12),16).translate(A,b+3.4,D)),e.gold.push(W(ve(1.8),10).translate(A,b+5.85,D))}}function no(e,t,a,o,s,n){const r=[],i=[],l=[],p=(c,u,f,g,h,x)=>{r.push(I(new U(g*.85,g,f,10),c,-30+f/2,u));for(const v of h)r.push(I(new U(g*1.65,g*1.35,3,10),c,-30+f*v,u));x==="cone"?r.push(I(new Aa(g*1.05,f*.17,10),c,-30+f+f*.085,u)):r.push(W(se(g*1.2,g*2.2,1.06,8),10).translate(c,-30+f,u)),i.push(W(ve(g*1.7),6).translate(c,-30+f+(x==="cone"?f*.17:g*2.2)-.5,u))};if(n===0){r.push(z(-60,-30,-60,60,46,60),I(new U(40,42,22,20),0,57,0),W(se(41,46,1.03,14),28).translate(0,68,0)),i.push(W(ve(16),8).translate(0,113,0));for(const[c,u]of[[0,52],[0,-52],[52,0],[-52,0]])r.push(W([[22,0],[21,8],[16,16],[8,21],[0,22]],16).translate(c,46,u));for(const[c,u]of[[-84,64],[84,64],[-84,-64],[84,-64]])p(c,u,230,4.6,[.56,.8],"cone")}else if(n===1){r.push(z(-56,-30,-40,56,40,50),z(-30,-30,50,30,74,66)),r.push(I(new U(30,32,34,20),0,57,6)),l.push(W(se(31,58,1.14,14),24).translate(0,74,6)),i.push(W(ve(14),8).translate(0,131,6));for(const c of[-1,1])p(c*26,60,150,5.2,[.9],"dome")}else{r.push(z(-90,-30,-90,90,14,90),z(-46,14,-46,46,70,46),I(new U(26,27,16,20),0,78,0)),r.push(W(se(28,52,1.16,14),24).translate(0,86,0)),i.push(W(ve(16),8).translate(0,137,0));for(const[c,u]of[[-34,34],[34,34],[-34,-34],[34,-34]])r.push(I(new U(7,7,10,8),c,75,u),W(se(7.5,10,1.05,8),10).translate(c,80,u));for(const[c,u]of[[-84,84],[84,84],[-84,-84],[84,-84]])p(c,u,150,5,[.45,.78],"dome")}for(const c of[...r,...i,...l])c.rotateY(s),c.scale(o,o,o),c.translate(t,-16*o,a);e.marble.push(...r),e.gold.push(...i),e.tile.push(...l)}let Qe=null;function so(){if(Qe)return Qe;const e=tt(),t=tt();Qa(e),to(e),ao(e),oo(e);for(const[o,s]of[[-44,C.z0-1.6],[C.x,C.z0-1.6],[-44,C.z1+1.2],[C.x,C.z1+1.2]])la(e,8.5,1.45,o,m,s);Ka.forEach((o,s)=>no(t,o.x,o.z,o.s,o.yaw,o.kind??s%3));const a={};for(const o of Object.keys(e))e[o].length&&(a[o]=de(e[o]));return a.farMarble=de(t.marble),a.farGold=de(t.gold),a.farTurq=de(t.tile),Qe={garden:e,far:t,cyp:eo(),cypM:Ja(),merged:a},Qe}function ro(e,t,a){const o=e.length*t,s=new Float32Array(o*3),n=new Float32Array(o*3),r=new Float32Array(o*2),i=St(17);e.forEach((f,g)=>{for(let h=0;h<t;h++){const x=g*t+h;s.set([f.a.x,f.a.y,f.a.z],x*3),n.set([f.b.x,f.b.y,f.b.z],x*3),r.set([f.h,h/t+i()*.02],x*2)}});const l=new yt;l.setAttribute("position",new Pe(s,3)),l.setAttribute("aB",new Pe(n,3)),l.setAttribute("aH",new Pe(r,2));const p={uTime:{value:0},uPx:{value:1},uAmt:{value:1},uSunDir:a.uSunDir,uSunCol:a.uSunCol,uCam:{value:new P}},c=new V({uniforms:p,transparent:!0,depthWrite:!1,blending:De,blendSrc:ae,blendDst:ae,vertexShader:`
      attribute vec3 aB; attribute vec2 aH; uniform float uTime, uPx; uniform vec3 uSunDir, uCam; varying float vA;
      float hh(float x){ return fract(sin(x * 91.7) * 43758.5); }
      void main(){
        float s = fract(uTime * .55 + aH.y);
        vec3 p = mix(position, aB, s); p.y += 4. * aH.x * s * (1. - s);
        float id = aH.y * 997.;
        p += (vec3(hh(id), hh(id + 3.), hh(id + 7.)) - .5) * (.03 + .16 * s * s);   // the stream frays as it falls
        vec4 mv = viewMatrix * vec4(p, 1.);
        float z = -mv.z;
        gl_PointSize = clamp(uPx * (1.1 + hh(id + 1.) * 1.4) * (30. / max(z, .5)), 1., 18.);
        vec3 v = normalize(p - uCam);
        vA = (.5 + 1.6 * pow(max(dot(v, uSunDir), 0.), 6.)) * smoothstep(1., .9, s) * smoothstep(0., .04, s) * smoothstep(.6, 2.5, z);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uAmt; uniform vec3 uSunCol; varying float vA;
      void main(){ vec2 q = gl_PointCoord - .5; float d = dot(q, q) * 4.; float a = exp(-d * 3.) * smoothstep(1., .7, d) * vA * uAmt;
        gl_FragColor = vec4((vec3(.86, .93, 1.) + uSunCol * .16) * a * .9, 0.); }`}),u=new $t(l,c);return u.frustumCulled=!1,u.renderOrder=1240,{object:u,U:p,update(f,g,h){p.uTime.value=g,p.uPx.value=h,p.uCam.value.copy(f.position)},dispose(){l.dispose(),c.dispose()}}}function io(e,t){const a=[],o=C.chan,s=(n,r,i)=>new P(n,r,i);for(let n=C.chanZ[0]-4;n>C.chanZ[1]+3;n-=6)if(!(Math.abs(n-C.cross)<C.basin+2))for(const r of[-1,1])a.push({a:s(r*(o+.3),m+.3,n+r*1.5),b:s(-r*.25,te,n+r*1.5-r*.4),h:1.7});for(let n=0;n<12;n++){const r=n/12*6.283;a.push({a:s(Math.cos(r)*.4,m+2.05,C.cross+Math.sin(r)*.4),b:s(Math.cos(r)*3.6,m+.45,C.cross+Math.sin(r)*3.6),h:1.1})}return a.push({a:s(0,m+2,C.cross),b:s(0,m+2,C.cross),h:1.2}),ro(a,[22,34,44][e],t)}function lo(e,t){return je({color:"#557a58",roughness:.86,metalness:0,envMap:e,envMapIntensity:.8},{key:"hx-cypress",uniforms:{uSunDir:t.uSunDir,uSunCol:t.uSunCol,uAmbTop:t.uAmbTop,uAmbBot:t.uAmbBot},pars:"uniform vec3 uSunDir, uSunCol, uAmbTop, uAmbBot;",color:"{ float n = pvn3(vWp * 1.7) * .6 + pvn3(vWp * 4.1) * .4; diffuseColor.rgb *= .7 + .55 * n; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.5, .58, .36), smoothstep(.6, .9, n) * .4); }",emissive:`{ vec3 vd = normalize(vWp - cameraPosition); float rim = pow(1. - abs(dot(normalize(vWn), -vd)), 2.5);
      totalEmissiveRadiance += diffuseColor.rgb * (uAmbTop * .34 + uAmbBot * .3);
      totalEmissiveRadiance += uSunCol * rim * pow(max(dot(vd, uSunDir), 0.), 3.) * .26 * (.6 + .4 * pvn3(vWp * 3.)); }`})}function Ft(e,t,{color:a="#e8e2d8",rough:o=.42,ei:s=.6,key:n="hx-far"}={}){return je({color:a,roughness:o,metalness:0,envMap:e,envMapIntensity:s},{key:n,uniforms:{...t},pars:ee+Ge,emissive:"{ vec3 vd = normalize(vWp - cameraPosition); totalEmissiveRadiance += vec3(1., .68, .3) * waveAt(vd) * 2.8 * (.45 + .55 * smoothstep(-.2, .6, vWn.y)); }"})}function uo(e){return je({color:"#efe8dc",roughness:.22,metalness:0,envMap:e,envMapIntensity:.95},{key:"hx-paving",color:`if (vWn.y > .6) {
      vec2 p = vWp.xz / 3.2; float d = starCross(p), aa = fwidth(d) * 1.4;
      float line = 1. - smoothstep(.02, .02 + aa, abs(d)), inside = smoothstep(aa, -aa, d);
      diffuseColor.rgb *= mix(vec3(1.), vec3(.93, .93, .95), inside * .6);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.84, .66, .38), line * .85);
    } else { float n = pvn3(vWp * .3); diffuseColor.rgb *= .94 + .1 * n; }`,rough:"if (vWn.y > .6) roughnessFactor = .16; else roughnessFactor = .4;"})}function co(e,t,a,{near:o=!0,far:s=!0,jetsOn:n=!0}={}){const r=so(),i=e.quality,l={marble:lt(a),paving:uo(a),tile:aa(a),honey:oa(a),pearl:na(a),gold:kt(a,{leaf:.09,rough:.17,lite:i===0,leafAmt:.35}),far:Ft(a,t),farTurq:Ft(a,t,{color:"#3a9e9c",rough:.28,ei:1,key:"hx-far-turq"})},p=new ie,c=[];if(o)for(const h of["marble","paving","tile","honey","pearl","gold"])r.merged[h]&&p.add(J(new E(r.merged[h],l[h])));s&&p.add(J(new E(r.merged.farMarble,l.far)),J(new E(r.merged.farGold,l.gold)),J(new E(r.merged.farTurq,l.farTurq)));let u=null,f=null;if(o){const h=lo(a,t),x=new wt(r.cyp,h,r.cypM.length);r.cypM.forEach((A,D)=>x.setMatrixAt(D,A)),p.add(J(x)),c.push(h,x),u=bt(t,{mode:"sky",depth:.9}),f=bt(t,{mode:"sky",depth:.5,tint:"#2b8f98"});const v=new E(new he(C.chan*2,C.chanZ[0]-C.chanZ[1]).rotateX(-Math.PI/2),u.mat);v.position.set(0,te,(C.chanZ[0]+C.chanZ[1])/2);const d=new E(new he(C.crossX*2,C.chan*2).rotateX(-Math.PI/2),u.mat);d.position.set(0,te,C.cross);const y=new E(new Ca(C.basin+.02,8).rotateX(-Math.PI/2).rotateY(Math.PI/8),f.mat);y.position.set(0,m+.5,C.cross),p.add(J(v),J(d),J(y)),c.push(u.mat,f.mat,v.geometry,d.geometry,y.geometry)}const g=o&&n?io(i,t):null;return g&&p.add(g.object),{group:p,mats:l,update(h,x,v){u?.update(h,x),f?.update(h,x),g?.update(h,x,v)},dispose(){Object.values(l).forEach(h=>h.dispose()),c.forEach(h=>h.dispose()),g?.dispose()}}}const me={n:15,rho0:.36,beta:.52,line:.0075},fo=`
  #define N ${me.n}
  const float TAU = 6.2831853, SEG = TAU / float(N), RHO0 = ${me.rho0}, BETA = ${me.beta};
  float segD(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.); return length(pa - ba * h); }
  vec2 rot(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
  // the inner vertex (between two star points) and the kite's outer tip, as radii
  float rhoV(){ float t = RHO0 * tan(SEG * .5) / (sin(BETA) + cos(BETA) * tan(SEG * .5)); return length(vec2(sin(BETA) * t, RHO0 - cos(BETA) * t)); }
  float rhoC(){ float t = RHO0 * tan(SEG * .5) / (sin(BETA) - cos(BETA) * tan(SEG * .5)); return length(vec2(sin(BETA) * t, RHO0 + cos(BETA) * t)); }
  // distance to the nearest band: the two through each of the five nearest star points, from the inner vertex to the rim
  float bands(vec2 p, float a){
    float k0 = floor(a / SEG), d = 1e3, rv = rhoV();
    for (int j = -2; j <= 2; j++) {
      float th = (k0 + float(j) + .5) * SEG;
      vec2 R = vec2(sin(th), cos(th)), Pp = vec2(cos(th), -sin(th)), T = R * RHO0;
      for (int m = 0; m < 2; m++) {
        float sg = m == 0 ? 1. : -1.;
        vec2 dir = cos(BETA) * R + sg * sin(BETA) * Pp;
        float tv = RHO0 * tan(SEG * .5) / (sin(BETA) + cos(BETA) * tan(SEG * .5));
        float b = dot(T, dir), tE = -b + sqrt(max(b * b - dot(T, T) + 1., 0.));
        d = min(d, segD(p, T - dir * tv, T + dir * tE));
      }
    }
    return d;
  }
  // > 0 inside the kite whose axis is +y (q in that frame, x folded)
  float kite(vec2 q){
    q.x = abs(q.x);
    vec2 S = RHO0 * vec2(sin(SEG * .5), cos(SEG * .5)), V = vec2(0., rhoV()), C = vec2(0., rhoC());
    vec2 e1 = S - V, e2 = C - S;
    float s1 = (e1.x * (q.y - V.y) - e1.y * (q.x - V.x)) / length(e1);   // left of V→S: toward the axis
    float s2 = (e2.x * (q.y - S.y) - e2.y * (q.x - S.x)) / length(e2);
    return min(s1, s2);
  }
  // > 0 inside the central star (q in a point's frame, the point along +y)
  float star(vec2 q){
    q.x = abs(q.x);
    vec2 T = vec2(0., RHO0), V = rhoV() * vec2(sin(SEG * .5), cos(SEG * .5)), e = V - T;
    return -(e.x * (q.y - T.y) - e.y * (q.x - T.x)) / length(e);
  }
`;function po(e,t){const{n:a,rho0:o,beta:s}=me,n=Math.PI*2/a,r=Math.hypot(e,t);let i=Math.atan2(e,t);i<0&&(i+=Math.PI*2);const l=Math.floor(i/n+.5)%a,p=i-l*n,c=Math.abs(r*Math.sin(p)),u=r*Math.cos(p),f=o*Math.tan(n/2)/(Math.sin(s)+Math.cos(s)*Math.tan(n/2)),g=o*Math.tan(n/2)/(Math.sin(s)-Math.cos(s)*Math.tan(n/2)),h=[0,Math.hypot(Math.sin(s)*f,o-Math.cos(s)*f)],x=[0,Math.hypot(Math.sin(s)*g,o+Math.cos(s)*g)],v=[o*Math.sin(n/2),o*Math.cos(n/2)],d=(y,A)=>(A[0]-y[0])*(u-y[1])-(A[1]-y[1])*(c-y[0]);return d(h,v)>0&&d(v,x)>0?l:-1}function vo(e,t,a){const o={...e,uHues:{value:t},uLit:{value:new Array(me.n).fill(0)},uAll:{value:0},uHover:{value:-1},uTime:{value:0},uR:{value:a},uLapis:{value:new L("#284a8f")},uTurq:{value:new L("#3fa6a1")},uIvory:{value:new L("#f3ece0")},uGold:{value:new L("#d9b064")},uCellGlow:{value:1}};return{mat:new V({uniforms:o,side:Ct,vertexShader:"varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      ${ee}${$e}${fo}
      uniform vec3 uHues[N]; uniform float uLit[N]; uniform float uAll, uHover, uTime, uR, uCellGlow; uniform vec3 uLapis, uTurq, uIvory, uGold;
      varying vec3 vL;
      void main(){
        vec2 p = vec2(vL.x, -vL.z) / uR;            // the plan, +y forward
        float r = length(p), a = atan(p.x, p.y); if (a < 0.) a += TAU;
        float aa = fwidth(r) * 1.3 + 1e-4;
        int ci = int(floor(a / SEG + .5)) % N;
        vec2 qc = rot(p, float(ci) * SEG), qt = rot(p, (floor(a / SEG) + .5) * SEG);
        float kc = kite(qc), st = star(qt), bd = bands(p, a);
        float rc = rhoC(), ring = rc + .055;
        // the light in here: the drum's windows below the rosette, a little dimmer toward the crown
        vec3 amb = (uAmbBot * .55 + uAmbTop * .25 + uSunCol * .08) * uSkyGain * mix(.72, 1.08, smoothstep(.2, .95, r));
        vec3 col;
        float lit = 0.; vec3 hue = vec3(1.);
        for (int i = 0; i < N; i++) if (i == ci) { lit = max(uLit[i], uAll * .85); hue = uHues[i]; }
        float hov = float(ci) == uHover ? 1. : 0.;
        if (st > 0.) {
          // the central star: gold, engraved with fine rays, a small rosette at its heart
          float rays = .82 + .18 * step(.5, fract(a / SEG * 2.));
          col = uGold * amb * 1.35 * rays * (.85 + .3 * smoothstep(.0, .05, st));
          col = mix(col, uIvory * amb * 1.1, (1. - smoothstep(.045, .045 + aa, r)) * .8);
        } else if (kc > 0.) {
          // a cell: ivory enamel with a hint of its app's colour; lit, a jewel of that colour glowing from within
          float rim = smoothstep(0., .035, kc), core = smoothstep(0., .07, kc);
          vec3 jewel = max(mix(vec3(dot(hue, vec3(.3, .55, .15))), hue, 1.9), 0.);
          vec3 base = mix(uIvory * .9, hue, .22) * amb;
          vec3 glow = jewel * (1.4 + .9 * core + .3 * sin(uTime * 1.3 + float(ci))) * uCellGlow;
          col = mix(base, glow, lit) + jewel * hov * .5;
          col *= .84 + .22 * rim;
        } else if (r < ring) {
          // between the cells: lapis, the points of the star turquoise
          float dart = step(rhoV() * 1.02, r) * step(r, RHO0 * 1.25);
          col = mix(uLapis, uTurq, dart * .0) * amb * .9;
          float sc = starCross(p * 22.);
          col = mix(col, uGold * amb, (1. - smoothstep(.03, .08, abs(sc))) * .35);
        } else {
          // the outer field: ivory, a fine star and cross in turquoise lines, gilded where the bands cross it
          float sc = starCross(vec2(a / SEG * 2., r * 14.));
          col = uIvory * amb * .98;
          col = mix(col, uTurq * amb, (1. - smoothstep(.02, .06, abs(sc))) * .55);
          col = mix(col, uLapis * amb, smoothstep(.0, -.06, sc) * .5);
          // the rim: little pointed niches, lit from below
          float nr = smoothstep(.86, .9, r);
          float u = fract(a / SEG * 2.) - .5, v = (r - .9) / .1;
          float niche = step(abs(u) * 2.2 + max(v - .45, 0.) * 1.6, .9) * nr;
          col = mix(col, mix(uGold, uIvory, .5) * amb * (.7 + .5 * (1. - v)), niche * .9);
        }
        // the bands: gold, a dark hair either side
        float band = 1. - smoothstep(${me.line}, ${me.line} + aa, bd);
        float edge = 1. - smoothstep(.0035, .0035 + aa, abs(bd - ${me.line} - .002));
        float ringBand = 1. - smoothstep(.008, .008 + aa, abs(r - ring));
        col = mix(col, uLapis * amb * .45, max(edge, (1. - smoothstep(.003, .003 + aa, abs(abs(r - ring) - .009)))) * .7);
        col = mix(col, uGold * amb * 1.5, max(band, ringBand) * (r < .995 ? 1. : 0.));
        // the bands catch the glow of a lit cell beside them
        col += hue * lit * band * .25;
        gl_FragColor = vec4(col, 1.);
      }`}),U:o}}function mo(e){const t={...e,uH:{value:Ve.drum[1]-Ve.drum[0]}};return{mat:new V({uniforms:t,side:Ct,vertexShader:"varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      ${ee}${$e}
      uniform float uH; varying vec3 vL;
      void main(){
        float a = atan(vL.x, -vL.z) / 6.2831853 * 16., u = fract(a) - .5, v = vL.y / uH + .5;   // v: 0 foot → 1 top
        vec3 amb = (uAmbBot * .55 + uAmbTop * .25 + uSunCol * .08) * uSkyGain;
        vec3 col = vec3(.95, .92, .87) * amb;
        // a window: a pointed arch from .18 to .86 of the height, half a bay wide
        float w = .27, top = .86, spring = .62;
        float hw = v < spring ? w : w * sqrt(max(0., 1. - pow((v - spring) / (top - spring), 2.)));
        float win = step(abs(u), hw) * step(.18, v) * step(v, top);
        vec3 sky = mix(uHorizon, uZenith, .25) * uSkyGain * 1.6 + uSunCol * .25;
        float g = starCross(vec2(u * 7., v * 7. * uH / 3.));
        vec3 grille = mix(sky, vec3(.95, .85, .62) * amb * 1.2, 1. - smoothstep(.03, .07, abs(g)));
        col = mix(col, grille, win);
        col = mix(col, vec3(.82, .64, .34) * amb * 1.3, (1. - smoothstep(.0, .02, abs(abs(u) - hw - .015))) * step(.18, v) * step(v, top) * (1. - win));
        float bandsY = step(v, .1) + step(.94, v);
        col = mix(col, vec3(.16, .3, .58) * amb, bandsY * .85);
        gl_FragColor = vec4(col, 1.);
      }`}),U:t}}function ho(e){const t={...e,uR:{value:Ve.r}};return{mat:new V({uniforms:t,side:_e,vertexShader:"varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      ${ee}
      uniform float uR; varying vec3 vL;
      void main(){
        vec2 p = vec2(vL.x, vL.z); float r = length(p), a = atan(p.x, p.y);
        vec3 amb = (uAmbBot * .6 + uAmbTop * .2 + uSunCol * .06) * uSkyGain;
        float row = (r - uR) / 1.6, ri = floor(row), v = fract(row);
        float cells = 64. - ri * 8., u = fract(a / 6.2831853 * cells + ri * .5) - .5;
        // a niche: a pointed hood over a hollow, darker in its depth, a gold lip
        float hood = smoothstep(.0, .1, v) * (1. - smoothstep(.55 - abs(u) * .9, .62 - abs(u) * .9, v));
        vec3 col = vec3(.96, .93, .88) * amb * (.62 + .45 * v + .25 * hood);
        col = mix(col, vec3(.86, .67, .36) * amb * 1.4, (1. - smoothstep(.0, .05, abs(v - (.6 - abs(u) * .9)))) * .8);
        col = mix(col, vec3(.86, .67, .36) * amb * 1.2, (1. - smoothstep(.0, .03, v)) * .7);
        gl_FragColor = vec4(col, 1.);
      }`}),U:t}}function go(e,t){const{z:a,r:o,drum:s,dome:n,top:r,half:i}=Ve,l=vo(e,t,o),p=mo(e),c=ho(e),u=W(se(o-.15,n-.4,1.06,30),64),f=new E(u,l.mat);f.position.set(0,s[1],a);const g=new U(o-.1,o-.1,s[1]-s[0],64,1,!0),h=new E(g,p.mat);h.position.set(0,(s[0]+s[1])/2,a);const x=new Se([new F(-i+2.2,-i+2.2),new F(i-2.2,-i+2.2),new F(i-2.2,i-2.2),new F(-i+2.2,i-2.2)]);x.holes.push(new nt(Array.from({length:64},(A,D)=>new F(Math.cos(D/64*6.2832)*(o-.1),Math.sin(D/64*6.2832)*(o-.1)))));const v=new Kt(x,1);v.rotateX(Math.PI/2);const d=new E(v,c.mat);d.position.set(0,r-.65,a);const y=new ie;return y.add(f,h,d),{group:y,dome:f,U:l.U,pick(A){const D=A.intersectObject(f,!1)[0];if(!D)return-1;const b=f.worldToLocal(D.point.clone());return po(b.x/o,-b.z/o)},dispose(){l.mat.dispose(),p.mat.dispose(),c.mat.dispose(),u.dispose(),g.dispose(),v.dispose()}}}const wo=`
  ${ee}
  uniform sampler2D uStill, uVideo; uniform float uHasStill, uHasVideo, uAsp, uStillAsp, uVidAsp, uDim, uTime, uHover, uOpen;
  varying vec2 vUv;
  vec2 cover(vec2 uv, float src){ vec2 s = src > uAsp ? vec2(uAsp / src, 1.) : vec2(1., src / uAsp); return (uv - .5) * s + .5; }
  float box(vec2 uv){ vec2 q = abs((uv - .5) * vec2(uAsp, 1.)) - vec2(uAsp, 1.) * .5 + .012; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - .012; }
  vec3 film(vec2 uv){
    if (uHasVideo > .5) return sRGBTransferEOTF(texture2D(uVideo, cover(uv, uVidAsp))).rgb;
    if (uHasStill > .5) return texture2D(uStill, cover(uv, uStillAsp)).rgb;
    return vec3(.8, .76, .7);
  }
  void main(){
    float d = box(vUv), aa = fwidth(d), inside = smoothstep(aa, -aa, d);
    // a rim of liquid glass: within a bevel of the edge the picture is pulled in from further inside and parted
    float bevel = .03, k = clamp(1. + d / bevel, 0., 1.);
    vec2 e = vec2(.002, 0.), g = vec2(box(vUv + e.xy) - box(vUv - e.xy), box(vUv + e.yx) - box(vUv - e.yx));
    g /= max(length(g), 1e-5);
    float along = dot((vUv - .5) * vec2(uAsp, 1.), vec2(-g.y, g.x));
    vec2 pull = g / vec2(uAsp, 1.) * bevel * k * (.9 + .04 * sin(along * 9. + uTime * 1.3)), off = g / vec2(uAsp, 1.) * bevel * .2 * k;
    vec3 col = vec3(film(vUv - pull + off).r, film(vUv - pull).g, film(vUv - pull - off).b);
    float lit = .35 + .65 * max(dot(g, normalize(vec2(-.3, 1.))), 0.);
    col *= 1. + .35 * k * k;
    col += vec3(1., .95, .85) * smoothstep(.62, .82, k) * smoothstep(.98, .82, k) * lit * .5;
    col *= 1. + uHover * .12;
    // shut, it is a glow behind the lattice; opening, it comes up to itself
    vec3 shut = mix(col, vec3(1., .95, .87), .55) * .85;
    col = mix(shut, col, uOpen);
    col = mix(col, col * .4, uDim);
    gl_FragColor = vec4(col * inside, inside);
  }`,xo=`
  ${ee}${$e}
  uniform vec2 uSize; uniform float uCell; varying vec2 vUv; varying vec3 vWn, vWp;
  void main(){
    vec2 m = min(vUv, 1. - vUv) * uSize;
    float frame = step(min(m.x, m.y), .16);
    vec2 p = (vUv - .5) * uSize / uCell;
    float d = starCross(p), heart = 1. - step(.12, length(fract(p) - .5));
    float band = 1. - step(.055, abs(d));
    if (max(frame, max(band, heart)) < .5) discard;
    vec3 N = normalize(vWn), V = normalize(vWp - cameraPosition);
    if (dot(N, V) > 0.) N = -N;
    vec3 amb = (mix(uAmbBot, uAmbTop, N.y * .5 + .5) * .9) * uSkyGain;
    float sun = max(dot(N, uSunDir), 0.), spec = pow(max(dot(reflect(V, N), uSunDir), 0.), 40.);
    vec3 base = mix(vec3(.93, .9, .84), vec3(.9, .72, .42), frame * .7 + heart * .5);
    vec3 col = base * (amb + uSunCol * sun * .35) + uSunCol * spec * .5 * (frame + heart);
    gl_FragColor = vec4(col, 1.);
  }`,bo="varying vec2 vUv; varying vec3 vWn, vWp; void main(){ vUv = uv; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.); vWp = w.xyz; vWn = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",yo=`
  ${ee}
  uniform float uPitch, uSpring, uOpen; varying vec3 vP;
  void main(){
    float x = vP.x - floor(vP.x / uPitch + .5) * uPitch, y = vP.y - uSpring;   // (its own place: the same mirrored)
    float a = atan(x, y), r = length(vec2(x, y));
    float ray = abs(fract(a / .19) - .5) * .19 * r, ring = abs(fract(r / .7) - .5) * .7;
    float solid = max(step(ray, .05), step(ring, .05)) + step(r, .55) + step(y, .14);
    if (solid < .5) discard;
    vec3 amb = (uAmbBot * .6 + uAmbTop * .3) * uSkyGain;
    gl_FragColor = vec4(mix(vec3(.94, .9, .84), vec3(.88, .7, .42), step(r, .55)) * amb * 1.05, 1.);
  }`,So=(e,t,a)=>{const o=t.card.replace(/card\.webp$/,"");return a?{still:t.poster,stillAsp:2/3,clip:`${o}hero-tall.mp4`,clipAsp:9/16}:{still:t.card,stillAsp:16/9,clip:e.quality>0?`${o}hero.mp4`:t.loop,clipAsp:16/9}};function ua(e,t,a){const o=Tt(e),s=Math.floor(oe.x/o.pitch)-1,n=[];for(let i=-s;i<=s;i++)n.push(i*o.pitch);const r=Array.from({length:a},(i,l)=>ra(l,e,t));return{xs:n,films:r,B:o}}const Pt=new Map;function Mo(e){const t=Pt.get(e);if(t)return t;const{xs:a,B:o}=ua(e,1,0),s=sa(e),n=s-m+o.rise+2.7,r=oe.z,i=oe.depth,[l,p]=o.film,c=a.map(b=>({x:b,w:o.open,spring:s-m,rise:o.rise,kind:"persian"})),u={marble:[],honey:[],pearl:[],tile:[],gold:[]};u.marble.push(rt(oe.x*2,n,i,c).translate(0,m,r));for(const b of c){const T=[],G=[];it(b,i,.62,T,G,{n:6}),T.forEach(Q=>u.pearl.push(Q.translate(0,m,r))),G.forEach(Q=>u.honey.push(Q.translate(0,m,r)));for(const Q of[-1,1]){const Y=b.x+Q*(o.open/2+.12);u.marble.push(new U(.2,.2,s-m-.7,10).translate(Y,m+(s-m-.7)/2+.35,r+.2)),u.gold.push(new U(.33,.22,.42,10).translate(Y,s-.2,r+.2),new U(.3,.34,.35,10).translate(Y,m+.17,r+.2))}u.marble.push(z(b.x-o.open/2,m,r-i*.7,b.x+o.open/2,o.foot-.12,r-i*.3)),u.gold.push(z(b.x-o.open/2,o.foot-.16,r-i*.32,b.x+o.open/2,o.foot-.1,r-i*.28));const $=new zt(.27,.05,6,24);$.translate(b.x+o.pitch/2,s+o.rise*.62,r+.06),u.gold.push($)}u.tile.push(z(-196,m+n-2.1,r-.05,oe.x,m+n-.9,r+.1)),u.marble.push(z(-196,m+n-.9,r-i-.2,oe.x,m+n-.5,r+.32)),u.marble.push(Ie(-196,oe.x,m+n-.5,1.6,.9,r-i/2));for(const b of[-1,1]){const T=b*(oe.x+3.2),G=r-i/2;u.marble.push(new U(3,3.3,n+4,8).translate(T,m+(n+4)/2,G)),u.gold.push(new U(3.06,3.06,.4,8,1,!0).translate(T,m+n+3.2,G)),u.marble.push(new U(2.1,2.5,44,16).translate(T,m+n+4+22,G));for(const $ of[n+20,n+42])u.marble.push(new U(3.4,2.4,1.4,16).translate(T,m+$,G)),u.gold.push(new U(3.45,3.45,.5,16,1,!0).translate(T,m+$+1.1,G));u.marble.push(new U(1.7,1.9,5,12).translate(T,m+n+50.5,G)),u.marble.push(W(se(2,4.5,1.06,12),16).translate(T,m+n+53,G)),u.gold.push(W(ve(4),10).translate(T,m+n+57.3,G))}u.marble.push(z(-200,te-.35,B.z1-16,B.x,m,B.z1));for(const b of[B.z0,B.z1])u.marble.push(z(-200,m,b-.35,B.x,m+.22,b+.35)),u.gold.push(z(-200,m+.22,b-.04,B.x,m+.25,b+.04));for(const b of[-1,1])u.marble.push(z(b>0?B.x:-202,m-18,B.z1,b>0?B.x+2:-200,m+.22,B.z0));const f=Object.fromEntries(Object.entries(u).map(([b,T])=>[b,de(T)])),g=[];for(const b of c){const T=Je("persian",b.w,b.rise,20).map($=>new F($.x+b.x,$.y)),G=new Kt(new Se(T),1);G.translate(0,s,r-i*.5),g.push(G)}const h=l/2+.12,x=p+.24,v=new he(h,x);v.translate(h/2,x/2,0);const d=te-80,y=B.x+6,A=de([z(-y,d,B.z0-.4,y,te-.02,B.z0),z(-y,d,r-i-9,y,te-.02,r-i-8.6),z(-y-.4,d,r-i-9,-y,te-.02,B.z0),z(y,d,r-i-9,y+.4,te-.02,B.z0),z(-y,d-.4,r-i-9,y,d,B.z0)]),D={geos:f,headG:de(g),leafG:v,occG:A};return Pt.set(e,D),D}function Co(e,t,a,o,s,n){const{xs:r,films:i,B:l}=ua(s,n,o.length),p=sa(s),c=p-m+l.rise+2.7,u=oe.z,f=oe.depth,[g,h]=l.film,{geos:x,headG:v,leafG:d,occG:y}=Mo(s),A=g/2+.12,D=h+.24,b={marble:lt(a),honey:oa(a),pearl:na(a),tile:aa(a),gold:kt(a,{leaf:.09,rough:.17,lite:e.quality===0,leafAmt:.35})},T=new ie,G=new ie;for(const _ of Object.keys(x))T.add(J(new E(x[_],b[_]))),G.add(new E(x[_],b[_]));const $=new V({uniforms:{...t,uPitch:{value:l.pitch},uSpring:{value:p},uOpen:{value:0}},side:_e,vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:yo});T.add(J(new E(v,$))),G.add(new E(v,$));const Q=new V({uniforms:{...t,uSize:{value:new F(A,D)},uCell:{value:s?.62:.58}},vertexShader:bo,fragmentShader:xo,side:_e}),Y=new wt(d,Q,r.length*2),ge=new wt(d,Q,r.length*2);ge.instanceMatrix=Y.instanceMatrix;const qe=new We,Me=new Zt,Ye=new P(0,1,0),Ce=new P(1,1,1),Be=new P,Ae=(_,j,Z)=>{for(const w of[-1,1]){const M=Z*1.55*(w<0?1:-1);Be.set(j+w*(g/2+.12),l.foot-.12,u+.05),Me.setFromAxisAngle(Ye,M+(w>0?Math.PI:0)),Y.setMatrixAt(_*2+(w>0?1:0),qe.compose(Be,Me,Ce))}};r.forEach((_,j)=>Ae(j,_,0)),Y.instanceMatrix.needsUpdate=!0,T.add(J(Y)),G.add(ge);const ue=o.map((_,j)=>{const Z=So(e,_,s),w={...t,uStill:{value:null},uVideo:{value:null},uHasStill:{value:0},uHasVideo:{value:0},uAsp:{value:g/h},uStillAsp:{value:Z.stillAsp},uVidAsp:{value:Z.clipAsp},uDim:{value:0},uTime:{value:0},uHover:{value:0},uOpen:{value:0}},M=new V({uniforms:w,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:wo,transparent:!0}),S=new he(g,h),R=new E(S,M),N=new E(S,M);R.position.set(i[j],l.foot+h/2,u-f-1.3),N.position.copy(R.position),R.userData.index=j,R.renderOrder=10,T.add(J(R)),G.add(N);let q=null;return e.textures.image(Z.still).then(K=>{w.uStill.value=K,w.uHasStill.value=1}).catch(()=>{}),{mesh:R,mirror:N,U:w,x:i[j],play(K){K?(q??=e.textures.video(Z.clip),q.video.paused&&q.video.play().catch(()=>{})):q&&!q.video.paused&&q.video.pause();const re=!!q&&q.video.readyState>=2&&K;w.uVideo.value=re?q.texture:null,w.uHasVideo.value=re?1:0},dispose(){S.dispose(),M.dispose(),q?.video.pause()}}}),ze=bt(t,{mode:"mirror",tint:"#1d5f73",ripple:.35}),ce=new E(new he(B.x*2,B.z0-B.z1).rotateX(-Math.PI/2),ze.mat);ce.position.set(0,te,(B.z0+B.z1)/2),ce.renderOrder=20,G.scale.y=-1,G.position.y=te*2;const Ue=new za({colorWrite:!1,side:_e}),ke=new E(y,Ue);ke.renderOrder=-100;const Ze=new ie;Ze.add(T,G,J(ce),ke);const ct=new Map(i.map((_,j)=>[r.findIndex(Z=>Math.abs(Z-_)<.001),j]));return{group:Ze,screens:ue,B:l,spring:p,H:c,mats:b,mirror:G,update(_,j,Z){ze.update(_,j),ct.forEach((w,M)=>Ae(M,r[M],Z[w]??0)),Y.instanceMatrix.needsUpdate=!0,ue.forEach((w,M)=>{w.U.uTime.value=j,w.U.uOpen.value=Math.min(1,(Z[M]??0)*1.4)})},pick(_){const j=_.intersectObjects(ue.map(Z=>Z.mesh),!1)[0];return j?j.object.userData.index:-1},dispose(){Object.values(b).forEach(_=>_.dispose()),$.dispose(),Q.dispose(),Ue.dispose(),Y.dispose(),ge.dispose(),ue.forEach(_=>_.dispose()),ze.mat.dispose(),ce.geometry.dispose()}}}const ca=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,Ao=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,be={x:0,y:0,t:-1};function Zo(e,t,a){if(be.t!==t){be.t=t;const o=e.pointer.inside&&!Ao&&!ca;be.x=Gt(be.x,o?e.pointer.x:0,2.6,a),be.y=Gt(be.y,o?e.pointer.y:0,2.6,a)}return be}const _t=new P,zo=new P(0,1,0),mt=new We,Nt=new P,Wt=new P;function Ko(e,t,a,o,s,n=0,r=1){_t.copy(a).sub(t).setLength(Math.min(6,t.distanceTo(a))).add(t),e.position.set(t.x,t.y,t.z),mt.lookAt(t,a,zo),Nt.setFromMatrixColumn(mt,0),Wt.setFromMatrixColumn(mt,1),e.position.addScaledVector(Nt,o*.32*r).addScaledVector(Wt,s*.2*r),e.up.set(0,1,0),e.lookAt(_t),e.rotateZ(-o*.016+n)}function Xo(e,t,a,o,s){const n=Math.tan(At.degToRad(e.fov/2));return Math.max(a/(2*n*s),t/(2*n*e.aspect*o))}function Qo(e,t,a,o,s){if(Math.abs(t)<1e-4&&Math.abs(a)<1e-4){e.clearViewOffset();return}e.setViewOffset(o,s,-t*o/2,a*s/2,o,s)}const Jo=e=>{const t=typeof location<"u"?new URLSearchParams(location.search).get(e):null;return t===null?null:Number(t)},en=()=>Promise.allSettled(['300 100px "Fraunces Variable"','400 100px "Fraunces Variable"','500 100px "Inter Variable"','600 100px "Inter Variable"','400 100px "Amiri"','700 100px "Amiri"','600 100px "Cairo Variable"'].map(e=>document.fonts.load(e))),ko=.3;function To(e){const t=new L(e),a={h:0,s:0,l:0};return t.getHSL(a),new L().setHSL(a.h,Math.min(.55,a.s*.62+.1),.66)}const Ro=[],ht=typeof location<"u"?new URLSearchParams(location.search).get("hxdbg")??"":"";function tn(e,t,{near:a=!0,far:o=!0,jets:s=!0,inside:n=!1,arcade:r=!0}={}){const i=t.sky,l=Ba(e,ko),p=new ie,c=a||o?co(e,i,l,{near:a,far:o,jetsOn:s&&a}):null;c&&p.add(c.group);const u=n?go(i,e.films.map(v=>To(v.accent))):null;u&&p.add(u.group);const f=e.lang==="ar"?-1:1;let g=null,h=e.viewport.portrait;const x=()=>{g&&(p.remove(g.group),g.dispose()),h=e.viewport.portrait,g=Co(e,i,l,e.films,h,f),ht.includes("nomirror")&&(g.mirror.visible=!1),p.add(g.group)};return r&&x(),ht.includes("noplace")&&(p.visible=!1),ht.includes("nonear")&&c&&(c.group.visible=!1),{group:p,garden:c,dome:u,dir:f,env:l,get arcade(){return g},get tall(){return h},resize(){r&&e.viewport.portrait!==h&&x()},update(v,d,y=Ro){ca&&(d=0),c?.update(v,d,e.viewport.dpr),g?.update(v,d,y),u&&(u.U.uTime.value=d)},dispose(){c?.dispose(),u?.dispose(),g?.dispose()}}}const k=(e,t,a)=>new P(e,t,a),H=(e,t)=>({from:e,to:t}),le={dawnRest:H(k(1.2,14.9,9.8),k(4.5,13.8,0)),dawnTurn:H(k(13,16.4,8),k(4.5,14.4,0)),gardenIn:H(k(0,15.5,-132),k(0,13,-240)),starIn:H(k(0,10.2,-314),k(0,13.5,-350)),starUp:H(k(0,8.2,-350),k(0,60,-350.7))},Do=e=>H(k(e*2,11,-385),k(e*3.5,10.6,oe.z)),Go=(e,t,a)=>{const o=ut(e,t,a);return H(k(o+t*1.5,13.5,-391),k(o+t*4,16,-430))},Lo=(e,t,a)=>{const o=ut(e,t,a),s=Xa(e,t,a);return H(k(o+t*4,52,-434),k(s[0],s[1]-2,s[2]))},at={dawnGarden:3.4,gardenStar:2.4},It=e=>new ka(e,!1,"centripetal",.5),Oe=(e,t,a)=>{e=ye(e);const o=e*e,s=o*e;return(s-2*o+e)*t+(-2*s+3*o)+(s-o)*a};function Le(e){const t=It(e.map(o=>o.from)),a=It(e.map(o=>o.to));return{len:t.getLength(),at(o,s,n){return t.getPointAt(ye(o),s),a.getPointAt(ye(o),n),s},split(o,s,n,r){return t.getPointAt(ye(o),n),a.getPointAt(ye(s),r),n}}}const ot=(e,t,a)=>e*t/Math.max(.001,a),qo=Le([le.dawnRest,le.dawnTurn]),Vt=Le([le.dawnTurn,H(k(12,20,-30),k(0,13,-200)),H(k(5,18,-92),k(0,13,-230)),le.gardenIn]);function an(e,t,a){if(e<.42)return qo.at(Oe((e-.06)/(.42-.06),0,0),t,a);const s=(e-.42)/(1-.42);return Vt.split(Oe(s,0,ot(at.dawnGarden,et.dawn*(1-.42),Vt.len)),Xt.out(xt(0,.78,s)),t,a)}const gt=Le([le.gardenIn,H(k(0,13,-172),k(0,11,-270)),H(k(-.9,9.6,-214),k(0,10.5,-320)),H(k(.8,9.5,-272),k(0,11.5,-346)),le.starIn]);function on(e,t,a){return gt.at(Oe(e,ot(at.dawnGarden,et.garden,gt.len),ot(at.gardenStar,et.garden,gt.len)),t,a)}const Ot=Le([le.starIn,H(k(0,9.2,-337),k(0,22,-354)),le.starUp]),Ht=new Map;function nn(e,t,a,o,s,n){if(e<o)return Ot.at(Oe(e/a,ot(at.gardenStar,et.star*a,Ot.len),0),s,n);let r=Ht.get(t);r||Ht.set(t,r=Le([le.starUp,H(k(0,8.4,-353),k(0,15,-392)),H(k(t*.6,9.8,-366),k(t*2,11.4,-404)),Do(t)]));const i=(e-o)/(1-o);return r.split(Oe(xt(.2,1,i),0,0),Xt.inOut(xt(0,.55,i)),s,n)}function sn(e,t,a){const o=ut(e,t,a),s=Go(e,t,a);return Le([s,H(k(o+t*2.5,22,-398),k(o+t*6,26,-700)),H(k(o+t*3.5,38,-414),k(o+t*8,44,-900)),Lo(e,t,a)])}export{Io as A,_o as B,jo as C,Vo as D,en as E,No as F,Oo as G,Lo as H,Yo as I,Wo as M,Ho as S,Eo as a,Uo as b,Zo as c,an as d,ca as e,Po as f,Fo as g,on as h,nn as i,Do as j,Go as k,Ko as l,J as m,Qo as n,Xo as o,tn as p,Jo as q,oe as r,Ba as s,ra as t,$o as u,dt as v,Tt as w,sn as x,Xa as y,Oe as z};
