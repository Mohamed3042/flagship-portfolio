import{V as w,t as z,s as M}from"./EditionWorld.astro_astro_type_script_index_0_lang.Zw8AZbVN.js";import{p as F,M as b,s as C,m as l,r as k}from"./scene.DCJ5SKpw.js";import{H as e}from"./plan.BWdz0sPb.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const q=`
uniform vec3 uSkyTop, uSkyHor, uSunCol, uGroundC, uFogCol, uMonoF, uMonoS, uMonoRim, uShadowCol;
uniform vec4 uSun, uMisc, uShade;   // sun: x across (-1..1), y above the horizon, z size, w glow;  misc: fog, stars, moon, clouds;  shade: lx, lz, cot, opacity
uniform vec2 uRimSide;
${b}
vec4 paint(vec2 uv, vec2 q){
  float asp = uAsp, port = step(asp, .95), ax = min(asp, 1.6), t = uTime;
  float yh = mix(.0, -.04, port), F = 1.15, eye = 1.55;
  q.x += uLean.x * .018; q.y += uLean.y * .01;
  vec3 col; float dep;
  float dz = yh - q.y;
  // the monolith's place: its width fits the view
  float Z0 = 9. * max(1., .74 / (.9 * asp));
  float hS = 3. * F / Z0, yb = yh - eye * F / Z0;
  vec2 mp = (q - vec2(0., yb + hS * .5)) / hS * 2.;                // mark units: 3.87 wide, 2 tall
  if (dz < 0.) {                                                  // ── sky
    float tt = clamp(-dz / (.5 - yh), 0., 1.);
    col = mix(uSkyHor, uSkyTop, pow(tt, .65));
    vec2 sp = vec2(uSun.x * .42 * ax, yh + uSun.y);
    float sd = length(q - sp);
    float cl = smoothstep(.5, .78, fbm(vec2(q.x * 1.5 + t * .012, q.y * 6. + 4.)) * 1.15) * uMisc.w * (1. - tt * .4);
    vec3 cLit = mix(uSkyHor * 1.12, uSunCol, clamp(exp(-sd * 2.2) * 1.4, 0., 1.)), cShade = mix(uSkyTop, uSkyHor, .35) * .78;
    col = mix(col, mix(cShade, cLit, smoothstep(.3, .8, fbm(vec2(q.x * 3. + 9., q.y * 10.)) + .2)), cl * .8);
    col += uSunCol * (exp(-sd * 4.5) * .5 + exp(-sd * 14.) * .5) * uSun.w * (1. - uMisc.z * .4);
    float disc = smoothstep(uSun.z, uSun.z * .82, sd);
    col = mix(col, uSunCol * mix(1.2, .96 + .08 * vnoise(q * 40.), uMisc.z), disc * step(.001, uSun.z));
    // a few painted stars at night: soft, uneven dabs, never a field of dots
    vec2 sc = vec2(uv.x * asp, uv.y) * 7.5, ci = floor(sc), cf = fract(sc);
    vec3 hs = h31(ci.x * 13.1 + ci.y * 91.7);
    float st = step(.74, hs.z) * exp(-dot(cf - (.25 + hs.xy * .5), cf - (.25 + hs.xy * .5)) * mix(260., 80., step(.93, hs.z))) * uMisc.y * step(.04, -dz);
    col += vec3(.9, .94, 1.) * st * (1. - cl) * (.5 + .5 * hs.x);
    dep = 1.;
    // far hills
    float hr = yh + .028 + .05 * (fbm(vec2(q.x * 1.7 + 3., 1.)) - .35);
    if (q.y < hr) { col = mix(uFogCol, mix(uSkyHor, uGroundC, .5), .45) * mix(.78, 1., uMisc.x); dep = .88; }
  } else {                                                        // ── field
    float Z = eye * F / max(dz, .002), X = q.x * Z / F;
    vec2 W = vec2(X + t * .02, Z);
    float g1 = fbm(W * .45), g2 = fbm(W * vec2(1.6, .7) + 5.);
    float wind = sin(W.y * .55 - t * .7 + W.x * .2 + g1 * 3.) * .5 + .5;
    col = uGroundC * (.72 + .5 * g1) * (.92 + .14 * wind);
    col = mix(col, col * vec3(1.1, 1., .8) + vec3(.03, .02, 0.), smoothstep(.55, .8, g2) * .6);
    vec2 cF = floor(W * 1.7);
    float fh = h21(cF);
    float fl = step(.9, fh) * smoothstep(.2, .1, length(fract(W * 1.7) - (.3 + h22(cF) * .4)));
    col = mix(col, mix(vec3(1., .95, .7), vec3(.95, .6, .75), step(.5, h21(cF + 3.))), fl * .85 * smoothstep(.25, .7, lum(uSkyHor)) * (1. - uMisc.y));
    // the monolith's shadow on the grass
    float lz = uShade.y, py = (Z - Z0) / (uShade.z * lz + 1e-3 * sign(lz + 1e-4));
    float px = X - py * uShade.z * uShade.x;
    float shd = (py > 0. && py < 3.) ? 1. - smoothstep(-.05, .1, sdMK(vec2(px, py - 1.5) / 1.5)) : 0.;
    col = mix(col, uShadowCol * (.7 + .5 * g1), shd * uShade.w * exp(-max(py, 0.) * .06));
    float fog = 1. - exp(-Z * uMisc.x * .05);
    col = mix(col, uFogCol, clamp(fog, 0., .92));
    dep = clamp(Z / 60., 0., 1.) * .8 + .08;
  }
  // ── the monolith: a slab standing in the field, its edge lit on one side
  float sd0 = sdMK(mp);
  float sdSide = sdMK(mp - vec2(.075 * uRimSide.x, .03));
  float inFront = 1. - smoothstep(0., .02, sd0);
  float inSide = (1. - smoothstep(0., .02, sdSide)) * (1. - inFront);
  float rim = inFront * smoothstep(0., .035, sdMK(mp + vec2(.075 * uRimSide.y, 0.)));
  vec3 mf = uMonoF * (.9 + .12 * vnoise(mp * 3. + 2.) + .06 * (mp.y * .5 + .5)) + uMonoRim * rim * .9;
  col = mix(col, uMonoS * (.9 + .15 * vnoise(mp * 5.)), inSide);
  col = mix(col, mf, inFront);
  if (inFront + inSide > .5) dep = .5;
  return vec4(col, dep);
}`,S=[{top:"#a9bde0",hor:"#f8dcc4",sun:"#ffd9a0",ground:"#8fa583",fog:"#e8dcdc",mf:"#dcd8e0",ms:"#9a9cb8",rim:"#ffe0b8",shadow:"#7c80a8",sunV:[-.62,.06,.03,.9],misc:[.55,0,0,.45],shade:[.5,-.86,2.6,.4],side:[1,-1],ink:"",ground2:[.9,.82,.72],light:1,paint:{size:1.2,len:1.5,jit:.6,sat:.85,cool:.3,warm:.3,dry:.5,relief:.7,spec:.3,swirl:.4,shim:.5}},{top:"#2f6fe0",hor:"#8fc4f0",sun:"#fffdf0",ground:"#8fb83c",fog:"#b9dcf4",mf:"#fff6e0",ms:"#8d8aa4",rim:"#ffffff",shadow:"#4c5a88",sunV:[.1,.56,.06,1.3],misc:[.12,0,0,.6],shade:[.15,.98,.5,.5],side:[1,1],ink:"",ground2:[.93,.9,.78],light:1,paint:{size:.85,len:.75,jit:1.1,sat:1.3,cool:.1,warm:.1,dry:.1,relief:1.1,spec:.5,swirl:.6,shim:1}},{top:"#3c4da8",hor:"#ffb040",sun:"#ff9a2a",ground:"#c89a34",fog:"#ffc27a",mf:"#5c4f78",ms:"#3a3258",rim:"#ffb347",shadow:"#3c3060",sunV:[.55,.08,.05,1.2],misc:[.3,0,0,.55],shade:[-.6,-.8,4.5,.55],side:[-1,1],ink:"",ground2:[.88,.62,.38],light:0,paint:{size:1,len:1.25,jit:.9,sat:1.3,cool:.35,warm:1,dry:.25,relief:1.15,spec:.7,swirl:.5,shim:.8}},{top:"#1a2a6c",hor:"#b878b0",sun:"#ff8a70",ground:"#2e4558",fog:"#6a5c9a",mf:"#2f3f7a",ms:"#1a2250",rim:"#c07ab8",shadow:"#0e1640",sunV:[-.2,-.012,0,.8],misc:[.4,.12,0,.35],shade:[.3,-.9,1.5,.25],side:[1,-1],ink:"",ground2:[.3,.28,.45],light:0,paint:{size:1.15,len:1.1,jit:.7,sat:1,cool:.65,warm:.3,dry:.35,relief:.85,spec:.5,swirl:.6,shim:.6}},{top:"#060a28",hor:"#1f2f66",sun:"#e8f0ff",ground:"#17303a",fog:"#1a2650",mf:"#566a9c",ms:"#1a2248",rim:"#cfe0ff",shadow:"#040818",sunV:[-.5,.42,.045,.9],misc:[.2,1,1,.25],shade:[.5,-.86,2.2,.5],side:[1,-1],ink:"",ground2:[.1,.13,.24],light:0,paint:{size:1,len:1.3,jit:.8,sat:1.15,cool:.8,warm:.4,dry:.2,relief:.95,spec:1,swirl:1.1,shim:.9}}],g=u=>k(u),y=(u,s,d)=>[l(u[0],s[0],d),l(u[1],s[1],d),l(u[2],s[2],d)],j=async u=>{const s={};for(const r of["uSkyTop","uSkyHor","uSunCol","uGroundC","uFogCol","uMonoF","uMonoS","uMonoRim","uShadowCol"])s[r]={value:new w};for(const r of["uSun","uMisc","uShade"])s[r]={value:new z};s.uRimSide={value:new M(1,-1)};let d=!0;return F(u,{id:"series",frag:q,uniforms:s,light:()=>d,tick({f:r}){const m=r.p;let f=0;for(;f<e.length-2&&m>e[f+1];)f++;const i=m<=e[0]?0:m>=e[e.length-1]?1:C(e[f]+.05,e[f+1]-.05,m),c=S[m>=e[e.length-1]?e.length-2:f],a=S[(m>=e[e.length-1]?e.length-2:f)+1],n=(o,p)=>s[p].value.set(...y(g(c[o]),g(a[o]),i));n("top","uSkyTop"),n("hor","uSkyHor"),n("sun","uSunCol"),n("ground","uGroundC"),n("fog","uFogCol"),n("mf","uMonoF"),n("ms","uMonoS"),n("rim","uMonoRim"),n("shadow","uShadowCol");const h=(o,p)=>s[p].value.set(l(c[o][0],a[o][0],i),l(c[o][1],a[o][1],i),l(c[o][2],a[o][2],i),l(c[o][3],a[o][3],i));h("sunV","uSun"),h("misc","uMisc"),h("shade","uShade"),s.uRimSide.value.set(i<.5?c.side[0]:a.side[0],i<.5?c.side[1]:a.side[1]),d=l(c.light,a.light,i)>.5;const x=c.paint,v=a.paint,t=o=>l(x[o],v[o],i);return{size:t("size"),len:t("len"),jit:t("jit"),sat:t("sat"),cool:t("cool"),warm:t("warm"),dry:t("dry"),relief:t("relief"),spec:t("spec"),swirl:t("swirl"),shim:t("shim"),angle:0,depth:.55,ground:y(c.ground2,a.ground2,i),rake:[l(-.7,-.7,i),.55]}}})};export{j as default};
