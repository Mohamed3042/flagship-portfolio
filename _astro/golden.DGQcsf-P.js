import{a0 as b,aP as w,y as z,t as T}from"./EditionWorld.astro_astro_type_script_index_0_lang.59ypKK2N.js";import{f as $,p as F,F as f,s as B}from"./scene.Dsr1gQka.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const D=`
uniform sampler2D tText; uniform vec4 uBox; uniform float uText;
float ridgeG(float x, float s, float amp, float f){ return amp * (fbm(vec2(x * f + s * 5.1, s)) - .4); }
vec3 skyG(float t, float k){
  vec3 hor = vec3(1., .54, .18), mid = vec3(.98, .40, .42), high = vec3(.56, .40, .72), top = vec3(.26, .28, .62);
  vec3 c = mix(hor, mid, smoothstep(0., .3, t));
  c = mix(c, high, smoothstep(.22, .62, t));
  return mix(c, top, smoothstep(.55, 1., t));
}
vec4 paint(vec2 uv, vec2 q){
  float asp = uAsp, port = step(asp, .95), ax = min(asp, 1.6), t = uTime;
  float yh = mix(.02, -.04, port);
  q.x += uLean.x * .016; q.y += uLean.y * .01;
  vec2 sun = vec2(-.42 * ax, yh + .05);
  vec3 col; float dep;
  float dz = yh - q.y;
  if (dz < 0.) {                                                // ── the sky, brushed in bands
    float ty = clamp(-dz / (.5 - yh), 0., 1.);
    float bandN = fbm(vec2(q.x * 1.3 + t * .005, q.y * 5.5));
    col = skyG(ty + (bandN - .5) * .12, 0.);
    float cl = smoothstep(.46, .74, fbm(vec2(q.x * 1.4 + t * .009, q.y * 8. + 3.))) * (1. - ty * .4);
    float sg = clamp(exp(-length((q - sun) * vec2(.7, 1.3)) * 2.6) * 1.5, 0., 1.);
    col = mix(col, mix(vec3(.72, .38, .60), vec3(1., .66, .40), sg), cl * .7);
    col += vec3(1., .6, .26) * exp(-length(q - sun) * 3.4) * .5;
    dep = 1.;
    for (int i = 0; i < 3; i++) {                               // violet mountains, sloping down toward the left, lit from the left
      float fi = float(i), k2 = fi / 2.;
      float slope = mix(.16, .09, k2) * (q.x / ax);
      float top = yh + mix(.20, .045, k2) + slope + ridgeG(q.x, fi + 2., mix(.16, .06, k2), mix(1.5, 2.8, k2));
      if (q.y < top) {
        float k = clamp((q.y - yh) / max(top - yh, .001), 0., 1.);
        vec3 mc = mix(vec3(.58, .48, .80), mix(vec3(.38, .34, .70), vec3(.22, .24, .52), fi * .5), k2 + .15);
        mc = mix(mc, vec3(.95, .55, .45), smoothstep(.6, 1., fbm(vec2(q.x * 6. - fi, q.y * 14. + fi))) * .35 * (1. - k2));
        mc += vec3(.95, .5, .22) * smoothstep(.02, 0., top - q.y) * smoothstep(.2 * ax, -.5 * ax, q.x) * .55;
        mc = mix(vec3(.95, .62, .52), mc, smoothstep(0., .55, k));
        col = mc; dep = .86 - fi * .07;
      }
    }
    // the village at the foot of the mountains, on the right shore
    float vx = (q.x / ax) * 34., hx = floor(vx), fx = fract(vx), hr = h21(vec2(hx, 3.7));
    float hg = (.013 + .02 * h21(vec2(hx, 8.3))) * step(.35, hr) * smoothstep(-.1, .18, q.x / ax);
    float yb = yh - .004 + .006 * sin(hx * 1.7);
    if (hg > 0. && fx > .12 && fx < .88 && q.y > yb && q.y < yb + hg + .012 * (1. - abs(fx - .5) * 2.)) {
      col = q.y > yb + hg ? vec3(.88, .36, .20) : mix(vec3(1., .88, .74), vec3(.96, .72, .62), h21(vec2(hx, 2.9)));
      if (q.y < yb + hg * .45 && fx > .4 && fx < .55) col = vec3(.35, .22, .38);
      dep = .6;
    }
    float cy = step(.7, h21(vec2(hx, 6.1))) * step(.1, q.x / ax);                 // cypress trees
    vec2 cd = vec2(fx - .5, (q.y - yb) / .05 - .55);
    if (cy > 0. && dot(cd * vec2(2.6, 1.), cd * vec2(2.6, 1.)) < .3) { col = vec3(.10, .22, .20); dep = .55; }
  } else {                                                      // ── the lake: the sky and mountains again, in dabs of colour
    float zf = 1. / (dz + .04);
    vec2 g = vec2(q.x * zf * .5, zf);
    float n1 = vnoise(g * vec2(5., 1.4) + vec2(t * .2, t * .55)), n2 = vnoise(g * vec2(13., 3.4) + vec2(-t * .3, t * .8) + 3.);
    float hw = n1 * .6 + n2 * .4;
    float ty = clamp(dz / (.5 - yh) * 1.15 + (hw - .5) * .22 * (.4 + dz * 2.), 0., 1.);
    vec3 refl = skyG(ty, 0.);
    float mt = smoothstep(.0, .05, .17 - dz) * .5;                              // mountains mirrored near the shore
    refl = mix(refl, vec3(.32, .30, .66), mt * smoothstep(.45, .7, vnoise(vec2(q.x * 4., dz * 30.))));
    float cell = h21(floor(vec2(q.x * 46. * (1. + dz * 2.), dz * 70. * zf * .3 + t * .1)));
    vec3 dab = cell < .25 ? vec3(.30, .50, .86) : cell < .5 ? vec3(.62, .40, .78) : cell < .75 ? vec3(1., .62, .30) : vec3(.98, .50, .56);
    col = mix(refl, dab, .3 + .2 * smoothstep(.0, .35, dz));
    col = mix(col, vec3(.20, .30, .62), smoothstep(.1, .5, dz) * .45);
    float sx = q.x - sun.x, cw = .06 + dz * .5;
    col += vec3(1., .78, .42) * exp(-(sx * sx) / (cw * cw)) * (.2 + .9 * smoothstep(.5, .85, hw));
    dep = mix(.75, .12, smoothstep(0., .5, dz));
    // a stone parapet along the foot of the view, its cap in terracotta, lit from the side
    float py = -.5 + .12 + (q.x / ax) * .04;
    if (q.y < py) { float cap = smoothstep(py - .028, py - .02, q.y); col = mix(mix(vec3(.62, .60, .84), vec3(.84, .72, .84), smoothstep(-.5, py, q.y) * .6) * (.9 + .15 * vnoise(q * 30.)), vec3(.92, .40, .24) * (.9 + .15 * vnoise(q * 40.)), cap); dep = .1; }
  }
  // "Let's make something.": written in the light
  vec2 tuv = (q - uBox.xy) / uBox.zw + .5;
  if (uText > 0. && tuv.x > 0. && tuv.x < 1. && tuv.y > 0. && tuv.y < 1.) {
    vec4 tx = texture2D(tText, tuv);
    float a = tx.a;
    float halo = (texture2D(tText, tuv + vec2(.012, .03)).a + texture2D(tText, tuv - vec2(.012, .03)).a + texture2D(tText, tuv + vec2(-.012, .03)).a + texture2D(tText, tuv + vec2(.012, -.03)).a) * .25;
    col *= 1. - halo * (1. - a) * .5 * uText;
    col = mix(col, mix(vec3(.17, .08, .36), vec3(1., .95, .80) * 1.15, smoothstep(.35, .75, tx.r)), a * uText);
    col += vec3(1., .7, .3) * a * .0;
    if (a * uText > .5) dep = .8;
  }
  return vec4(col, dep);
}`,C=async r=>{const c=r.lang==="ar";await $(c?['700 80px "Cairo Variable"']:['italic 500 80px "Fraunces Variable"']);const l=document.createElement("canvas"),s=new b(l);s.colorSpace=w,s.minFilter=z,s.generateMipmaps=!1;const n={tText:{value:s},uBox:{value:new T(0,-.1,1,.3)},uText:{value:0}};let d="";function u(t){const y=`${t.portrait}${t.aspect.toFixed(2)}`;if(y===d)return;d=y;const m=t.portrait?c?["لنصنع","شيئاً معاً."]:["Let’s make","something."]:[c?"لنصنع شيئاً معاً.":"Let’s make something."],o=260,a=t.portrait?900:2e3,i=o*m.length+40;l.width=a,l.height=i;const e=l.getContext("2d");e.clearRect(0,0,a,i),e.font=c?`700 ${o*.78}px ${f.ar}`:`italic 500 ${o*.86}px ${f.serif}`,e.fillStyle="#fff",e.strokeStyle="#000",e.lineJoin="round",e.lineWidth=o*.1,e.textAlign="center",e.textBaseline="middle",e.direction=c?"rtl":"ltr",m.forEach((v,g)=>{const q=c?o*.78:o*.86,k=e.measureText(v).width,p=q*Math.min(1,a*.94/Math.max(1,k));e.font=c?`700 ${p}px ${f.ar}`:`italic 500 ${p}px ${f.serif}`,e.lineWidth=p*.11,e.strokeText(v,a/2,20+o*(g+.5)),e.fillText(v,a/2,20+o*(g+.5))}),s.needsUpdate=!0;let h=t.portrait?Math.min(.34,.5*t.aspect*i/a*1.9):.27*m.length,x=h*a/i;x>t.aspect*.86&&(x=t.aspect*.86,h=x*i/a),n.uBox.value.set(0,t.portrait?-.05:-.12,x,h)}return u(r.viewport),F(r,{id:"golden",frag:D,uniforms:n,light:!1,onResize(t){u(t)},tick({f:t}){return n.uText.value=B(.2,.55,t.p),{size:1,len:1.1,jit:.9,sat:1.28,cool:.5,warm:.9,dry:.25,relief:1.15,spec:.75,depth:.5,swirl:.55,angle:0,shim:1,ground:[.82,.55,.42],rake:[-.75,.45]}}})};export{C as default};
