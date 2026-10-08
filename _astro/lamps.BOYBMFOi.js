import"./EditionWorld.astro_astro_type_script_index_0_lang.Bwhdv6R4.js";import{p as o}from"./scene.FgexYLke.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const t=`
vec4 paint(vec2 uv, vec2 q){
  float asp = uAsp, port = step(asp, .95), ax = min(asp, 1.6), t = uTime;
  float yh = mix(.07, .03, port), F = 1.1, eye = 1.6;
  q.x += uLean.x * .016; q.y += uLean.y * .01;
  float lat = 3.4 * clamp(asp / 1.3, .38, 1.);                 // how far the lamps stand from the middle: closer on a narrow screen
  float walk = uP * 46.;                                      // metres walked along the promenade
  float dz = yh - q.y;
  vec3 skyHor = vec3(.86, .46, .38), skyMid = vec3(.36, .22, .52), skyTop = vec3(.05, .07, .22);
  vec3 col; float dep;
  if (dz < 0.) {                                              // ── the sky, the far buildings
    float ty = clamp(-dz / (.5 - yh), 0., 1.);
    col = mix(skyHor, skyMid, smoothstep(0., .22, ty)); col = mix(col, skyTop, smoothstep(.15, .85, ty));
    float cl = smoothstep(.45, .75, fbm(vec2(q.x * 1.6 + t * .008, q.y * 7. + 2.)));
    col = mix(col, col * vec3(.7, .66, .9) + vec3(.1, .04, .06) * (1. - ty), cl * .5);
    dep = .9;
    float bx = floor((q.x / ax) * 15. + 40.), bh = .018 + .07 * h21(vec2(bx, 3.)) * (.6 + .6 * smoothstep(.9, .0, abs(q.x / ax)));
    if (q.y < yh + bh) {
      col = vec3(.05, .06, .16) + vec3(.08, .03, .05) * smoothstep(.0, .06, yh + bh - q.y) * .0;
      vec2 wc = floor(vec2(q.x * 90., (q.y - yh) * 170.) + bx * 3.);
      float win = step(.72, h21(wc)) * step(.12, fract(q.x * 90.)) * step(fract((q.y - yh) * 170.), .62) * step(.15, fract((q.y - yh) * 170.));
      col = mix(col, vec3(1., .74, .38) * (.7 + .5 * h21(wc + 5.)), win * .85);
      dep = .8;
    }
  } else {                                                    // ── the wet promenade
    float Z = eye * F / max(dz, .002), X = q.x * Z / F;
    vec2 W = vec2(X, Z + walk);
    float cob = vnoise(W * vec2(2.4, 1.6)) * .5 + vnoise(W * vec2(7., 4.5)) * .3;
    col = vec3(.09, .10, .22) * (.75 + .6 * cob);
    float ax2 = abs(X);
    col = mix(col, vec3(.34, .30, .52), smoothstep(.2, .0, abs(ax2 - (lat - .3))) * .55);       // the kerbs run to the vanishing point
    col = mix(col, vec3(.03, .07, .13), smoothstep(lat - .1, lat + .5, ax2) * .85);               // grass and water beyond them
    float pud = smoothstep(.5, .68, fbm(W * .35 + 3.));       // puddles, mirroring the glow of the sky
    vec3 sky = mix(skyHor, skyMid, .3) * .85;
    col = mix(col, sky * (.5 + .5 * vnoise(vec2(q.x * 30., dz * 40. + t * .3))), pud * .55 * exp(-Z * .02));
    // rain rings
    vec2 rc = W * .55, ri = floor(rc), rf = fract(rc) - (.2 + .6 * h22(ri));
    float ph = fract(t * .45 + h21(ri) * 3.), ring = smoothstep(.035, .0, abs(length(rf) - ph * .38)) * (1. - ph) * step(.45, h21(ri + 9.));
    col += vec3(.7, .6, .8) * ring * (.25 + .6 * pud) * exp(-Z * .03);
    col = mix(col, skyHor * .7, 1. - exp(-Z * .018));
    dep = clamp(Z / 70., 0., 1.) * .8 + .06;
  }
  // ── the lamps: pole, head, pool of light on the ground, and the long broken reflection
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float Zl = 4. + fi * 7. - mod(walk, 7.);                   // lamps seven metres apart, the row sliding toward you as you walk
    for (int sd = 0; sd < 2; sd++) {
      float side = sd == 0 ? -1. : 1.;
      float Zm = Zl + (sd == 1 ? 3.5 : 0.);
      if (Zm < 3.) continue;
      float k = F / Zm, xs = side * lat * k, yb = yh - eye * k, yt = yh + (3.9 - eye) * k;
      float flick = .94 + .06 * sin(t * 7. + fi * 3. + side);
      // pole
      float pw = .03 * k;
      if (abs(q.x - xs) < pw && q.y > yb && q.y < yt) { col = vec3(.04, .04, .1); dep = .5; }
      // head and halo
      vec2 d = q - vec2(xs, yt);
      float dl = length(d);
      col += vec3(1., .66, .28) * (exp(-dl / (.16 * k)) * .55 + exp(-dl / (.55 * k)) * .16) * flick;
      col = mix(col, vec3(1., .96, .82) * 1.25, smoothstep(.1 * k, .06 * k, dl));
      // pool of light on the paving at the foot of the pole, and its reflection streak
      vec2 pg = (q - vec2(xs - side * .3 * k, yb - .2 * k)) / vec2(1.6 * k, .45 * k);
      col += vec3(1., .6, .25) * exp(-dot(pg, pg)) * .5 * flick * step(q.y, yh);
      float yr = yh - (eye + 3.9) * k, below = step(q.y, yb) * step(yr - .08, q.y);
      float wob = (vnoise(vec2(q.y * 55., t * .6 + fi * 4. + side)) - .5) * .35 * k + (vnoise(vec2(q.y * 9., fi)) - .5) * .06 * k;
      float wdt = (.06 + (yb - q.y) * .12) * k * 2.6 + .01 * k;
      float ex = (q.x - xs - wob) / wdt;
      float streak = exp(-ex * ex) * below * exp(-(yb - q.y) / (.28 + k * .5));
      float broken = smoothstep(.28, .72, vnoise(vec2(q.x * 70. / (k + .1) * .12, q.y * 38. + t * .35 + fi)));
      col += vec3(1., .66, .3) * streak * (.18 + .9 * broken) * flick * .85;
      if (streak > .25 && dz > 0.) dep = min(dep, .35);
    }
  }
  // the rain itself, a few slanted threads
  float rn = smoothstep(.93, 1., vnoise(vec2(q.x * 120. + q.y * 22., q.y * 8. + t * 7.)));
  col += vec3(.55, .6, .8) * rn * .14 * (1. - smoothstep(.0, .9, abs(q.x / ax) * .0));
  return vec4(col, dep);
}`,i=async e=>o(e,{id:"lamps",frag:t,light:!1,tick({f:l}){return{size:1.05,len:1.15,jit:.85,sat:1.3,cool:.6,warm:.95,dry:.2,relief:1.05,spec:1.1,depth:.5,swirl:.4,angle:0,shim:1.05,ground:[.1,.11,.26],rake:[-.6,.6],coh:1}}});export{i as default};
