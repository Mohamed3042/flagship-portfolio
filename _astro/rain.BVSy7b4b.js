import{t as v,V as s,p as w}from"./EditionWorld.astro_astro_type_script_index_0_lang.D1p_8KHB.js";import{g as y}from"./glyphs.BRrZFV_C.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const u=[52,37,22],f=.58,x=`
uniform vec3 uRainRows, uRainStart, uRainCols; uniform float uRainAsp, uRainClock, uCollapse, uRainVis;
uniform vec4 uRainView;   // plane: half width, half height, z, camera y (the camera looks straight down -z)
uniform vec4 uHall;       // the hall: half width, height, z near, z far (where the glyphs were scattered)
float rh12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec3 rS(vec3 c){ return pow(c, vec3(2.2)); }
void inst(float id, out vec3 pos, out float glyph, out float size, out vec4 col, out vec4 fx){
  int L = id >= uRainStart.z ? 2 : (id >= uRainStart.y ? 1 : 0);
  float fl = float(L), k = fl / 2., rows = uRainRows[L], cols = uRainCols[L];
  float local = id - uRainStart[L], ry = floor(local / cols), colId = local - ry * cols;
  float h = 1. / rows, w = h * ${f}, s = h * 1.12;
  // the pivot's maths, cell by cell
  float alive = step(mix(.34, .5, k), rh12(vec2(colId, 31. + fl * 7.)));
  float speed = mix(.045, .16, rh12(vec2(colId, 5.1 + fl))) * mix(.6, 1.2, k);
  float len = mix(.3, .8, rh12(vec2(colId, 9.7 + fl)));
  float head = fract(rh12(vec2(colId, 2.2 + fl)) + uRainClock * speed) * (1. + len);
  float yc = (ry + .5) * h, d = head - yc;
  float tail = (d > 0. && d < len) ? pow(1. - d / len, 1.7) : 0.;
  float isHead = smoothstep(h * 1.1, h * .3, abs(d));
  float rate = mix(.5, 3., rh12(vec2(colId, ry)));
  glyph = floor(rh12(vec2(colId, ry) + floor(uRainClock * rate + rh12(vec2(ry, colId)) * 9.) * 7.13) * uRain);
  float lvl = mix(.34, 1., k) * alive, b = max(tail, isHead * 1.1);
  vec3 ink = mix(rS(vec3(.9, .38, .04)), rS(vec3(1., .72, .26)), tail);
  ink = mix(ink, rS(vec3(1., .95, .82)), isHead);
  vec2 uv = vec2((colId + .5) * w / uRainAsp, 1. - yc);
  vec3 target = vec3((uv.x * 2. - 1.) * uRainView.x, uRainView.w + (uv.y * 2. - 1.) * uRainView.y, uRainView.z);
  float r1 = rh12(vec2(id, 1.7)), r2 = rh12(vec2(id, 4.3)), r3 = rh12(vec2(id, 8.9)), u = rh12(vec2(id, 11.1));
  float z = mix(uHall.z, uHall.w, r1), side = floor(r2 * 4.);
  vec3 start = side < .5 ? vec3((u * 2. - 1.) * uHall.x, .02, z) : side < 1.5 ? vec3((u * 2. - 1.) * uHall.x, uHall.y, z) : side < 2.5 ? vec3(-uHall.x, u * uHall.y, z) : vec3(uHall.x, u * uHall.y, z);
  float delay = (1. - r1) * .42 + r3 * .18;                       // the far end lets go first, a wave toward us
  float tau = clamp((uCollapse - delay) / .4, 0., 1.), e = tau * tau * (3. - 2. * tau);
  pos = mix(start, target, e);
  pos.y -= sin(e * 3.14159) * (.8 + r3 * 1.6);                     // the sag of the fall
  size = mix(.16 + .16 * r3, s * 2. * uRainView.y, e);
  float resting = .14 + .28 * r3;                                  // on a surface: a glyph of the corridor's own text, dim
  col = vec4(ink * mix(resting, b * lvl * 1.15, e), uRainVis);
  fx = vec4(e, tau, 0., 0.);
  if (e > .999 && lvl * b < .004) col.a = 0.;                      // in its column and dark: nothing to draw
}`;function z(r){const h=r.layers??[1,2],e={uRainRows:{value:new s(...u)},uRainStart:{value:new s},uRainCols:{value:new s},uRainAsp:{value:r.aspect},uRainClock:{value:0},uCollapse:{value:1},uRainVis:{value:1},uRainView:{value:new v(1,1,-10,1.6)},uHall:{value:new v(...r.hall??[3.4,4.4,0,-60])}},c=y({atlas:r.atlas,count:1,shared:r.shared,inst:x,uniforms:e,glow:.39,depthTest:!1,order:8});function n(a){let o=0;const t=[0,0,0],i=[0,0,0];for(let l=0;l<3;l++){if(i[l]=o,!h.includes(l)){t[l]=1;continue}const R=1/u[l],p=R*f;t[l]=Math.ceil(a/p)+1,o+=t[l]*u[l]}return e.uRainCols.value.set(t[0],t[1],t[2]),e.uRainStart.value.set(i[0],i[1],i[2]),e.uRainAsp.value=a,c.setCount(Math.max(1,o)),o}function d(a,o){const t=a.position.z-o,i=t*Math.tan(w.degToRad(a.fov/2));e.uRainView.value.set(i*a.aspect,i,o,a.position.y)}return n(r.aspect),{layer:c,U:e,layout:n,view:d,set collapse(a){e.uCollapse.value=a},set clock(a){e.uRainClock.value=a},set vis(a){e.uRainVis.value=a}}}export{z as r};
