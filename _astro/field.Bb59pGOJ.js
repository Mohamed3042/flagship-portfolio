import"./EditionWorld.astro_astro_type_script_index_0_lang.B6El-kZd.js";import{p as o,m as t,s as p}from"./scene.BwLBP7qH.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const l=`
vec4 paint(vec2 uv, vec2 q){
  float asp = uAsp, port = step(asp, .95), ax = min(asp, 1.6), t = uTime;
  float yh = mix(.07, .0, port), F = 1.1, eye = 1.5;
  q.x += uLean.x * .02; q.y += uLean.y * .01;
  float dz = yh - q.y;
  vec3 col; float dep;
  if (dz < 0.) {                                                 // ── sky and the far country
    float tt = clamp(-dz / (.5 - yh), 0., 1.);
    col = mix(vec3(.84, .90, .96), vec3(.30, .52, .90), pow(tt, .7));
    dep = .5;
    float cu = fbm(vec2(q.x * 1.7 + t * .008, q.y * 3.4 + 7.));
    float cm = smoothstep(.52, .70, cu - (tt - .15) * .35);
    float lit = smoothstep(.0, .5, fbm(vec2(q.x * 3. + 4., q.y * 7. + 1.)) + (q.y * 1.4));
    col = mix(col, mix(vec3(.66, .62, .80), vec3(1., .98, .93), lit), cm);
    col += vec3(1., .93, .75) * exp(-length(q - vec2(-.3 * ax, .5)) * 2.4) * .2;
    float h1 = yh + .014 + .05 * (fbm(vec2(q.x * 2.1 + 1., 2.)) - .4);       // blue hills
    if (q.y < h1) { col = mix(vec3(.70, .80, .86), vec3(.45, .60, .68), clamp((h1 - q.y) * 14., 0., 1.)); dep = .9; }
    float h2 = yh + .006 + .022 * fbm(vec2(q.x * 7. + 9., 3.));                // the tree line
    if (q.y < h2) { col = mix(vec3(.30, .46, .26), vec3(.52, .62, .30), fbm(vec2(q.x * 25., q.y * 40.))); dep = .86; }
    // a farmhouse with a terracotta roof and two poplars
    vec2 fh = vec2(.22 * ax, yh + .004);
    vec2 fp = (q - fh) / .045;
    if (fp.x > -1. && fp.x < 1. && fp.y > 0. && fp.y < .75) { col = vec3(.96, .90, .80); dep = .8; }
    if (fp.x > -1.15 && fp.x < 1.15 && fp.y > .75 && fp.y < 1.25 - abs(fp.x) * .4) { col = vec3(.80, .34, .20); dep = .8; }
    for (int i = 0; i < 2; i++) {
      vec2 pc = vec2((.31 + float(i) * .06) * ax, yh + .03);
      vec2 pd = (q - pc) / vec2(.007, .035);
      if (dot(pd, pd) < 1.) { col = mix(vec3(.12, .30, .18), vec3(.30, .46, .22), fbm(q * 90.)); dep = .84; }
    }
  } else {                                                        // ── the field
    float Z = eye * F / max(dz, .002), X = q.x * Z / F;
    vec2 W = vec2(X, Z + uP * 55.);
    float g1 = fbm(W * .38), g2 = fbm(W * vec2(1.4, .6) + 5.);
    float wave = sin(W.y * .42 - t * 1.5 + W.x * .22 + g1 * 2.4) * .5 + .5;
    col = mix(vec3(.28, .46, .14), vec3(.66, .68, .24), g1 * 1.1);
    col = mix(col, vec3(.84, .78, .30), smoothstep(.6, .85, g2) * .5);
    col *= .7 + .6 * wave;
    float sw = (wave - .5) * .09 * smoothstep(1., 12., Z);
    vec2 cp = (W + vec2(sw * 4., 0.)) / .5;                        // poppies: one per cell, red dabs with a dark heart
    vec2 ci = floor(cp), cf = fract(cp);
    float ph = h21(ci);
    vec2 pc = .25 + .5 * h22(ci + 4.7);
    float pr = .17 + .13 * h21(ci + 1.9);
    float pd = length(cf - pc) / pr;
    float pop = step(.3, ph) * (1. - smoothstep(.8, 1., pd));
    vec3 pcol = mix(vec3(.90, .12, .07), vec3(.98, .30, .12), h21(ci + 8.)) * (.85 + .3 * wave);
    pcol = mix(pcol, vec3(.22, .03, .06), smoothstep(.45, .1, pd) * .8);
    col = mix(col, pcol, pop);
    vec2 cq = (W * 1.35 + 9.) / .5, cj = floor(cq), cg = fract(cq);    // small wild flowers
    float fl = step(.86, h21(cj + 2.)) * (1. - smoothstep(.55, .85, length(cg - (.3 + .4 * h22(cj))) / .2));
    col = mix(col, mix(vec3(1., .94, .6), vec3(.92, .90, 1.), step(.5, h21(cj + 6.))), fl * .9);
    col = mix(col, vec3(.74, .82, .70), clamp(1. - exp(-Z * .028), 0., .85));
    dep = clamp(Z / 70., 0., 1.) * .85 + .03;
  }
  return vec4(col, dep);
}`,s=async e=>o(e,{id:"field",frag:l,light:!0,tick({f:c}){return{size:1.05,len:1.1,jit:1,sat:1.25,cool:.15,warm:.4,dry:.15,relief:1.05,spec:.45,depth:.5,swirl:.5,angle:0,wind:.55*t(.7,1,p(0,.5,c.p)),shim:1.1,ground:[.6,.62,.3],rake:[-.7,.5],coh:.85}}});export{s as default};
