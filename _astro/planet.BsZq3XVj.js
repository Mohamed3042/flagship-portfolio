import{G as O,V as u,b as h,M as g,Z as b,A,J as M,I as W,Q as T,C as D}from"./EditionWorld.astro_astro_type_script_index_0_lang.DYMyNWhV.js";import{s as z,G as B,a as L}from"./veil.DnQn_KqK.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const C=`
  float ringDensity(float x, float fw){
    if (x < 0. || x > 1.) return 0.;
    float a = clamp(1. - fw * 60., 0., 1.), b = clamp(1. - fw * 160., 0., 1.), c = clamp(1. - fw * 420., 0., 1.);
    float d = .5 + .26 * sin(x * 31. + 1.) + .18 * a * sin(x * 97. + 2.3) + .12 * b * sin(x * 211. + .7) + .09 * c * sin(x * 523. + 4.1);
    d *= mix(.35, 1., smoothstep(.05, .32, x)) * smoothstep(0., .04, x) * smoothstep(1., .84, x);   // a faint inner ring
    d *= 1. - .96 * exp(-pow((x - .64) / .022, 2.));    // the gap
    d *= 1. - .5 * exp(-pow((x - .9) / .012, 2.));
    return clamp(d, 0., 1.);
  }`,w=`
  varying vec3 vObj, vWorld, vNrm;
  void main(){
    vObj = position; vec4 w = modelMatrix * vec4(position, 1.); vWorld = w.xyz;
    vNrm = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,V=`
  uniform sampler3D uNoise;
  uniform vec3 uSun, uCenter, uSeed, uOcean, uLow, uHigh, uAtmo, uCity, uRingN;
  uniform float uRadius, uSea, uCloud, uCityAmt, uIce, uBands, uCraters, uLava, uTime, uAir, uRingIn, uRingOut, uLight, uSpec, uBandF, uStorm;
  varying vec3 vObj, vWorld, vNrm;
  ${B}
  ${L}
  ${C}
  void main(){
    vec3 n = normalize(vObj), N = normalize(vNrm), V = normalize(cameraPosition - vWorld);
    float NL = dot(N, uSun);
    vec3 p = n * .42 + uSeed;
    vec3 w = vec3(nR(p * 1.3), nR(p * 1.3 + .37), nR(p * 1.3 + .71)) - .5;
    float h = fbm4(p + w * .55);
    float ridge = 1. - abs(nR(p * 5.1 + w) * 2. - 1.);
    float land = uSea < 0. ? 1. : smoothstep(uSea - .004, uSea + .012, h);
    float up = uSea < 0. ? h : clamp((h - uSea) / (1. - uSea), 0., 1.);
    vec3 ground = mix(uLow, uHigh, smoothstep(.0, .6, up + ridge * .14 - .05));
    ground *= .78 + .44 * nR(p * 11. + 3.);
    vec3 sea = uOcean * (.5 + .7 * smoothstep(uSea - .12, uSea, h));
    vec3 surf = mix(sea, ground, land);
    if (uBands > 0.) {   // a gas world: bands that curl into each other
      float lat = n.y * 3.2 * uBandF + (fbm4(p * 2.2 + w) - .5) * 1.1 + (fbm4(p * 7.5 + w * 2.) - .5) * uStorm;
      float b = .5 + .5 * sin(lat * 6.2 + nR(vec3(lat * .4, .1, .2)) * 3.);
      vec3 bc = mix(uLow, uHigh, b);
      bc = mix(bc, uOcean, smoothstep(.6, .78, nR(vec3(lat * .9, .5, .5))) * .7);
      surf = mix(surf, bc * (.85 + .3 * nR(p * 6. + w)), uBands);
    }
    if (uCraters > 0.) {
      float c = nG(p * 2.6 + 4.), c2 = nG(p * 7.3 + 1.);
      float bowl = smoothstep(.8, .93, c) + smoothstep(.84, .95, c2) * .6, rim = smoothstep(.73, .8, c) * (1. - smoothstep(.8, .86, c));
      surf *= 1. - bowl * .32 * uCraters; surf += rim * .07 * uCraters;
    }
    surf = mix(surf, vec3(.86, .89, .93), smoothstep(.74, .82, abs(n.y) + (h - .5) * .35) * uIce);
    vec3 cq = n * .55 + uSeed.zxy + vec3(uTime * .003, 0., uTime * .0015);
    float cl = smoothstep(.5, .74, fbm4(cq * 2.2 + w * .4)) * uCloud;
    float day = smoothstep(-.1, .25, NL);
    vec3 col = surf * (max(NL, 0.) * 1.15 + .003) * uLight;
    col += surf * vec3(1., .42, .16) * exp(-pow((NL - .05) * 14., 2.)) * smoothstep(-.01, .04, NL) * .2 * uLight;   // the terminator glows warm, on the lit side only
    vec3 H = normalize(uSun + V);
    float glint = pow(max(dot(N, H), 0.), 160.) * 3.5 + pow(max(dot(N, H), 0.), 18.) * .1;
    col += vec3(1., .9, .76) * glint * (1. - land) * (1. - cl) * smoothstep(0., .2, NL) * uSpec * uLight;
    col = mix(col, vec3(.95, .96, 1.) * (max(NL, 0.) * 1.25 + .004) * uLight, cl * .92);
    float night = smoothstep(.06, -.16, NL);
    if (uCityAmt > 0.) {   // the cities: regions of them on the land, towns inside, each a few sharp points of light
      float region = smoothstep(.44, .6, nR(n * 2.7 + uSeed * 2.));
      float town = smoothstep(.54, .74, nR(n * 11. + 1.3));
      float spark = smoothstep(.6, .85, nR(n * 31. + 7.));
      float lights = region * town * (.25 + 2.2 * spark) * land * (1. - cl * .9) * (1. - smoothstep(.7, .8, abs(n.y)));
      col += uCity * lights * night * uCityAmt;
    }
    if (uLava > 0.) {
      float cr = 1. - abs(nR(p * 4. + w * 1.5) * 2. - 1.), zone = smoothstep(.5, .66, nR(p * 1.4 + 2.));
      col += vec3(1., .36, .08) * smoothstep(.972, .996, cr) * zone * uLava * (.3 + .7 * night) * 2.2;
      col += vec3(1., .3, .06) * smoothstep(.9, .99, cr) * zone * uLava * night * .12;   // a glow round the cracks
    }
    float mu = max(dot(N, V), 0.);
    col += uAtmo * pow(1. - mu, 3.) * uAir * smoothstep(-.04, .4, NL) * uLight * .9;
    if (uRingOut > 0.) {
      float s = -dot(vWorld - uCenter, uRingN) / dot(uSun, uRingN);
      if (s > 0.) { float r = length(vWorld + uSun * s - uCenter) / uRadius; col *= 1. - .8 * ringDensity((r - uRingIn) / (uRingOut - uRingIn), 0.); }
    }
    gl_FragColor = vec4(col, 1.);
  }`,G=`
  uniform vec3 uSun, uCenter, uBeta, uMieCol; uniform float uRadius, uThick, uInt, uMie, uExt;
  varying vec3 vObj, vWorld, vNrm;
  void main(){
    vec3 ro = (cameraPosition - uCenter) / uRadius, rd = normalize(vWorld - cameraPosition);
    float Rg = 1. + uThick * 4.;
    float b = dot(ro, rd), c = dot(ro, ro) - Rg * Rg, D = b * b - c;
    if (D <= 0.) discard;
    float s0 = max(-b - sqrt(D), 0.), s1 = -b + sqrt(D);
    float Dp = b * b - (dot(ro, ro) - 1.);
    if (Dp > 0. && -b - sqrt(Dp) > 0.) s1 = min(s1, -b - sqrt(Dp));
    if (s1 <= s0) discard;
    float ds = (s1 - s0) / 12.;
    vec3 sum = vec3(0.); float odV = 0.;
    for (int i = 0; i < 12; i++) {
      vec3 p = ro + rd * (s0 + ds * (float(i) + .5));
      float r = length(p), h = max(r - 1., 0.) / uThick;
      float dens = exp(-h * 2.8);
      odV += dens * ds;
      float mu = dot(p / r, uSun);
      float sh = smoothstep(-.14, .04, mu + h * uThick * 1.5);   // the planet's shadow, softened as the light bends
      float odL = dens * uThick * 2.5 / (max(mu, 0.) + .06);
      sum += exp(-uBeta * (odV + odL) * uExt) * dens * ds * sh;
    }
    float ct = dot(rd, uSun), g = .76;
    float pr = .75 * (1. + ct * ct), pm = (1. - g * g) / pow(1. + g * g - 2. * g * ct, 1.5);
    gl_FragColor = vec4(sum * (uBeta * pr + uMieCol * pm * uMie) * uInt, 1.);
  }`,q=`
  uniform vec3 uSun, uCenter, uN, uTint; uniform float uRadius, uIn, uOut, uLight, uAlpha;
  varying vec3 vObj, vWorld, vNrm;
  ${L}
  ${C}
  void main(){
    float r = length(vWorld - uCenter) / uRadius, x = (r - uIn) / (uOut - uIn);
    float d = ringDensity(x, fwidth(x));
    if (d < .004) discard;
    vec3 V = normalize(cameraPosition - vWorld);
    float sl = dot(uSun, uN), sv = dot(V, uN);
    float lit = sl * sv > 0. ? abs(sl) * .9 + .06 : abs(sl) * .22 + .02;   // the sunlit face, or light seen through the rings
    float fwd = pow(max(dot(-V, uSun), 0.), 8.) * 2.4 * (1. - d * .4);
    vec3 oc = vWorld - uCenter; float bL = dot(oc, uSun);
    float shade = bL < 0. ? smoothstep(uRadius * uRadius * .94, uRadius * uRadius * 1.03, dot(oc, oc) - bL * bL) : 1.;
    float grain = h21(vec2(floor(x * 140.), 3.));
    vec3 col = uTint * mix(vec3(.8, .74, .68), vec3(1.1, 1.06, 1.), grain) * (.55 + .7 * d) * (lit + fwd) * shade * uLight;
    gl_FragColor = vec4(col, d * .8 * uAlpha);
  }`,i=c=>new D(c);function j(c,e,{radius:r=1,rings:a,thick:S=.028,air:v={int:14,mie:.5,ext:4}}={}){const{noise:N}=z(c),m=c.quality===0?72:128,o=new O,t={uNoise:{value:N},uSun:{value:new u(0,0,1)},uCenter:{value:new u},uSeed:{value:new u(...e.seed)},uOcean:{value:i(e.ocean)},uLow:{value:i(e.low)},uHigh:{value:i(e.high)},uAtmo:{value:i(e.atmo)},uCity:{value:i("#ffb766")},uRingN:{value:new u(0,1,0)},uRadius:{value:r},uSea:{value:e.sea},uCloud:{value:e.cloud},uCityAmt:{value:e.city},uIce:{value:e.ice},uBands:{value:e.bands},uCraters:{value:e.craters},uLava:{value:e.lava},uTime:{value:0},uAir:{value:e.air},uRingIn:{value:a?.inner??0},uRingOut:{value:a?.outer??0},uLight:{value:1},uSpec:{value:e.spec??1},uBandF:{value:e.bandFreq??1},uStorm:{value:e.storm??0}},y=new h({uniforms:t,vertexShader:w,fragmentShader:V}),f=new g(new b(r,m,m/2),y);o.add(f);let p=null;if(e.air>0){p=new h({vertexShader:w,fragmentShader:G,transparent:!0,depthWrite:!1,blending:A,uniforms:{uSun:t.uSun,uCenter:t.uCenter,uRadius:t.uRadius,uThick:{value:S},uInt:{value:v.int*e.air},uMie:{value:v.mie},uExt:{value:v.ext},uBeta:{value:new u(.42,.4,.36).multiply(new u(...i(e.atmo).toArray()).multiplyScalar(1.2).addScalar(.4))},uMieCol:{value:new u(1,.82,.62)}}});const s=new g(new b(r*(1+S*4),m,m/2),p);s.renderOrder=2,o.add(s)}let n=null,l=null;a&&(l=new h({vertexShader:w,fragmentShader:q,transparent:!0,depthWrite:!1,side:M,uniforms:{uSun:t.uSun,uCenter:t.uCenter,uRadius:t.uRadius,uN:{value:new u(0,0,1)},uTint:{value:i(a.tint)},uIn:{value:a.inner},uOut:{value:a.outer},uLight:t.uLight,uAlpha:{value:1}}}),n=new g(new W(r*a.inner,r*a.outer,256,6),l),n.rotation.set(...a.tilt),n.renderOrder=3,o.add(n));const x=new T;return{group:o,surface:f,uniforms:t,air:p?.uniforms,ring:n,ringUniforms:l?.uniforms,update(s,d,I=0){if(o.updateMatrixWorld(),f.rotation.y=I,t.uSun.value.copy(s),t.uTime.value=d,o.getWorldPosition(t.uCenter.value),t.uRadius.value=r*o.getWorldScale(new u).x,n&&l){n.getWorldQuaternion(x);const R=new u(0,0,1).applyQuaternion(x);l.uniforms.uN.value.copy(R),t.uRingN.value.copy(R)}},dispose(){o.traverse(s=>{const d=s;d.isMesh&&(d.geometry.dispose(),d.material.dispose())})}}}export{j as p};
