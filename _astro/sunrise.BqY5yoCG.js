import"./EditionWorld.astro_astro_type_script_index_0_lang.DFJfHFf_.js";import{i as C,p as E,C as S,s as l,m as j}from"./scene.D9VK86O4.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const z=[[.1,.17,.5],[.14,.22,.58],[.08,.13,.4],[.19,.31,.68],[.11,.19,.46]];function F(x,f,v,o=.3){const e=v/2,s=x-1.935*e,t=f-e;let a=11;const c=()=>(a=a*1664525+1013904223>>>0)/4294967296,i=[[.23,1.98,.23,.02,.48],[.47,1.82,.95,.7,.36],[1.43,1.82,.95,.7,.36],[1.69,.02,1.69,1.98,.44],[2.36,1.98,2.36,.02,.44],[2.65,1.1,3.57,1.95,.46],[2.9,.95,3.65,.04,.5]],p=[];return i.forEach(([b,q,M,L,d],R)=>{const g=M-b,w=L-q,y=Math.hypot(g,w),h=g/y,n=w/y,T=-n,A=h,m=Math.max(1,Math.round(d/.2));for(let r=0;r<m;r++){const k=(r+.5-m/2)*(d/m)+(c()-.5)*.03,u=y*(1.01+c()*.03),P=b+T*k-h*.02,B=q+A*k-n*.02;p.push({x:s+(P+h*u*.5)*e,y:t+(B+n*u*.5)*e,len:u*e,wid:d/m*1.22*e,ang:Math.atan2(n,h),t0:o+R*.34+r*.08,dur:.55,load:.95,col:z[Math.floor(c()*z.length)],h:1.1+c()*.25})}}),p.push({x:s+1.93*e,y:t-.3*e,len:4.1*e,wid:.13*e,ang:-.012,t0:o+7*.34+.1,dur:.5,load:.9,col:[.86,.24,.13],h:1.3}),p}const U=`
uniform float uRise, uMist;
vec3 skyPal(float t, float rise){
  vec3 hor = mix(vec3(1., .70, .40), vec3(1., .85, .60), rise);
  vec3 mid = mix(vec3(.97, .56, .55), vec3(.98, .72, .64), rise);
  vec3 top = mix(vec3(.42, .40, .72), vec3(.52, .62, .88), rise);
  vec3 c = mix(hor, mid, smoothstep(0., .34, t));
  return mix(c, top, smoothstep(.28, 1., t));
}
float ridge(float x, float s, float amp, float f){ return amp * (fbm(vec2(x * f + s * 7.3, s)) - .38); }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
float sdTri(vec2 p, vec2 a, vec2 b, vec2 c){
  vec2 e0 = b - a, e1 = c - b, e2 = a - c, v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 q0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0., 1.), q1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0., 1.), q2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0., 1.);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(q0, q0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(q1, q1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(q2, q2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}
// a sailing boat: rgb and coverage (p is in the boat's own units, the waterline at y = 0)
vec4 boat(vec2 q, vec2 c, float s, vec3 hull, vec3 sail, float lit){
  vec2 p = (q - c) / s;
  vec2 p2 = p - vec2(0., .085);
  float hd = max(length(p2 / vec2(.40, .085)) - 1., p2.y) * .06;           // a hull: flat deck, curved belly
  float mast = sdBox(p - vec2(-.01, .42), vec2(.009, .38));
  float s1 = sdTri(p, vec2(.03, .10), vec2(.03, .78), vec2(.27, .12));       // a tall main sail and a jib, a mast's width between
  float s2 = sdTri(p, vec2(-.05, .10), vec2(-.05, .52), vec2(-.27, .11));
  float ch = 1. - smoothstep(0., .02, hd), cs = 1. - smoothstep(0., .02, min(s1, s2)), cm = 1. - smoothstep(0., .012, mast);
  float side = clamp(.5 - p.x * 1.6, 0., 1.) * lit;                       // the side turned to the sun glows
  vec3 sc = mix(sail * .62, sail * vec3(1.18, 1.06, .9) + vec3(.1, .03, 0.), side) * (.88 + .12 * smoothstep(.0, .6, p.y));
  vec3 col = mix(mix(hull * (1. + side * .5), sc, cs), hull * 1.1, cm * (1. - cs));
  return vec4(col, max(max(ch, cs), cm));
}
vec4 paint(vec2 uv, vec2 q){
  float asp = uAsp, port = step(asp, .95), ax = min(asp, 1.6);
  float yh = mix(-.03, -.10, port), rise = uRise, t = uTime;
  vec2 sun = vec2(-.16 * ax, yh + .035 + rise * .2);
  q.x += uLean.x * .014; q.y += uLean.y * .008;
  vec3 col; float dep;
  float dz = yh - q.y;
  if (dz < 0.) {                                               // ── the sky
    float ty = clamp(-dz / (.5 - yh), 0., 1.);
    col = skyPal(ty + (fbm(vec2(q.x * 1.3 + t * .006, q.y * 5.)) - .5) * .06, rise);
    float cl = smoothstep(.50, .80, fbm(vec2(q.x * 1.25 + t * .007, q.y * 9. + 2.1))) * (1. - ty * .55);
    float sg = exp(-length((q - sun) * vec2(.8, 1.4)) * 3.2);
    col = mix(col, mix(vec3(.66, .44, .66), vec3(1., .78, .56), clamp(sg * 1.6, 0., 1.)), cl * .6);
    float sd = length(q - sun);
    col += vec3(1., .66, .30) * exp(-sd * 6.5) * .55 + vec3(1., .82, .52) * exp(-sd * 20.) * .55;
    col = mix(col, vec3(1., .97, .82) * 1.22, smoothstep(.036, .029, sd));
    dep = 1.;
    for (int i = 0; i < 3; i++) {                              // distant hills, one in front of the other, melting into haze at their feet
      float fi = float(i), k2 = fi / 2.;
      float top = yh + mix(.075, .018, k2) + ridge(q.x + fi * 1.7 + uLean.x * .01 * fi, fi + 1., mix(.12, .05, k2), mix(1.6, 2.6, k2));
      if (q.y < top) {
        float k = clamp((q.y - yh) / max(top - yh, .001), 0., 1.);
        vec3 hc = mix(vec3(.62, .52, .78), mix(vec3(.46, .40, .68), vec3(.30, .30, .52), fi * .5), k2 + .2);
        hc = mix(hc, skyPal(.05, rise), (1. - k2) * .3);
        hc = mix(vec3(1., .82, .66), hc, mix(1., smoothstep(0., .8, k), uMist * .7));
        hc += vec3(1., .6, .3) * smoothstep(.014, 0., top - q.y) * exp(-abs(q.x - sun.x) * 1.4) * .4;
        col = hc; dep = .86 - fi * .08;
      }
    }
    // a village along the far shore: little walls and terracotta roofs
    float hx = floor((q.x + 4.) * 58.), fx = fract((q.x + 4.) * 58.), hr = h21(vec2(hx, 4.2));
    float hgt = (.006 + .011 * h21(vec2(hx, 8.1))) * step(.42, hr) * smoothstep(-.12 * ax, .02 * ax, q.x);
    float yb = yh + .004 * (1. + hr);
    if (hgt > 0. && fx > .14 && fx < .86 && q.y > yb && q.y < yb + hgt + .007 * (.5 - abs(fx - .5)) * 2.) {
      col = q.y > yb + hgt * .8 ? vec3(.86, .38, .22) : mix(vec3(1., .91, .80), vec3(.95, .74, .68), h21(vec2(hx, 2.2)));
      dep = .78;
    }
  } else {                                                     // ── the water
    float zf = 1. / (dz + .03);
    vec2 g = vec2(q.x * zf * .35, zf);
    float n1 = vnoise(g * vec2(5.5, 1.1) + vec2(t * .22, t * .5)), n2 = vnoise(g * vec2(14., 2.6) + vec2(-t * .31, t * .8) + 7.);
    float hw = n1 * .6 + n2 * .4;
    float ty = clamp(dz / (.5 - yh) + (hw - .5) * .10 * (.3 + dz * 2.5), 0., 1.);
    vec3 refl = skyPal(ty, rise), deep = vec3(.22, .27, .50);
    col = mix(refl * .96, deep, smoothstep(.02, .52, dz) * .62);
    col = mix(col, vec3(.40, .35, .66), smoothstep(.55, .85, hw) * .22 * smoothstep(0., .1, dz));
    float sx = q.x - sun.x, cw = .03 + dz * .26, path = exp(-(sx * sx) / (cw * cw)), spark = smoothstep(.5, .86, hw);
    col += vec3(1., .86, .52) * path * (.18 + 1.05 * spark) + vec3(1., .72, .4) * exp(-(sx * sx) / (cw * cw * 14.)) * .22;
    dep = mix(.78, .12, smoothstep(0., .55, dz));
    // boats mirrored in the water: dark smears
    for (int i = 0; i < 2; i++) {
      float fi = float(i);
      vec2 bc = vec2(sun.x + mix(.22, -.30, fi) * ax, yh - mix(.034, .05, fi)), qr = vec2(q.x + (hw - .5) * .012, 2. * bc.y - q.y);
      vec4 br = boat(qr, bc, mix(.07, .09, fi), vec3(.16, .14, .30), vec3(1., .86, .74), .3);
      col = mix(col, br.rgb * .62, br.a * .55);
    }
  }
  float m = uMist * (exp(-abs(q.y - yh) * 9.) * .55 + .12 * fbm(vec2(q.x * 3. + t * .03, q.y * 10.)) * exp(-abs(q.y - yh) * 3.));
  col = mix(col, vec3(1., .86, .72) * 1.04, clamp(m, 0., .8));
  // the boats, with the light behind them
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    vec2 bc = vec2(sun.x + mix(.22, -.30, fi) * ax, yh - mix(.034, .05, fi) + sin(t * .7 + fi * 2.) * .0015);
    vec4 b = boat(q, bc, mix(.07, .09, fi), vec3(.16, .14, .30), vec3(1., .86, .74), .3 + .5 * fi);
    col = mix(col, mix(b.rgb, vec3(1., .8, .62), uMist * .25), b.a); if (b.a > .5) dep = .58;
  }
  vec2 fc = vec2(-.27 * ax, -.115 + sin(t * .5) * .003);                      // a nearer boat, in the sun's path
  vec4 fb = boat(q, fc, .17, vec3(.15, .12, .30), vec3(1., .86, .70), .55);
  col = mix(col, fb.rgb, fb.a); if (fb.a > .5) dep = .4;
  return vec4(col, dep);
}`,O=async x=>{const f=C(),v=document.documentElement;let o=0,e=!1;const s={uRise:{value:0},uMist:{value:1}};return E(x,{id:"sunrise",frag:U,uniforms:s,light:!0,onResize(t,a){const c=Math.min(t.width*.78,t.height*.6);a.setHero(F(t.width/2,t.height*(t.portrait?.6:.57),c/1.935))},onFocus(t){t||(v.classList.remove("im-name"),e=!1)},tick({f:t,painter:a}){o=S?9:f(t.t,t.dt);const c=t.p;s.uRise.value=l(0,.95,c)*.9,s.uMist.value=j(1,.45,l(0,1,c));const i=o>1.9&&c<.12;return i!==e&&(e=i,v.classList.toggle("im-name",i)),a.heroTime(o,1-l(.1,.34,c)),{hero:!0,reveal:Math.max(l(4.2,7.8,o),l(.012,.1,c)),revealAt:[.5,.5],size:1.12,len:1.2,jit:.75,sat:1.12,cool:.3,warm:.5,dry:.3,relief:.8,spec:.5,depth:.55,swirl:.35,angle:0,shim:.8,ground:[.93,.88,.76],rake:[-.7,.55],weave:.55}}})};export{O as default};
