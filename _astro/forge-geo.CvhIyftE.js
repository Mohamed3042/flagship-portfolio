import{S as y,M as p,ai as M,b as d,aj as R,a as S,aa as O,p as j,ak as T,a4 as z,C as h,V as C,m as E,at as b,as as x}from"./EditionWorld.astro_astro_type_script_index_0_lang.D1SWOm1D.js";import{t as H}from"./BufferGeometryUtils.Bj7VxOBH.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function B(i,o={}){const l=new y,t=[],n=new p(new M(50,32,16),new d({color:o.base??"#050405",side:R}));l.add(n),t.push(n.geometry,n.material);const a=(e,c,m,g,w)=>{const v=new d({color:new h(c).multiplyScalar(m),side:z,toneMapped:!1}),u=new p(e,v);u.position.set(...g).normalize().multiplyScalar(w),u.lookAt(0,0,0),l.add(u),t.push(e,v)};for(const e of o.panels??[])a(new S(e.w,e.h),e.color,e.power,e.dir,30);o.moon&&a(new O(Math.tan(j.degToRad(o.moon.radius))*30,48),o.moon.color??"#fff8ea",o.moon.power??6,o.moon.dir,30);const s=new T(i.renderer),r=s.fromScene(l,0,.1,100).texture;s.dispose();for(const e of t)e.dispose();return r}const k=`
varying vec3 vObj;
uniform float uHeat, uRevealY, uPolish, uHamon, uMoonR, uLights, uHair, uMirror, uT, uEmit;
uniform vec3 uSteel, uMoon;
float fh(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(fh(i), fh(i + vec2(1., 0.)), f.x), mix(fh(i + vec2(0., 1.)), fh(i + vec2(1., 1.)), f.x), f.y); }
float fb(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * fn(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
// steel at temperature t (1 = white): white, yellow, orange, cherry, dull red, and black below about .1
vec3 heatRamp(float t){
  vec3 c = vec3(0.);
  c = mix(c, vec3(.36, .018, .005), smoothstep(.1, .22, t));
  c = mix(c, vec3(.82, .08, .014), smoothstep(.24, .38, t));
  c = mix(c, vec3(1., .38, .06), smoothstep(.38, .54, t));
  c = mix(c, vec3(1., .72, .24), smoothstep(.54, .72, t));
  c = mix(c, vec3(1., .94, .78), smoothstep(.72, .88, t));
  c = mix(c, vec3(1., .99, .97), smoothstep(.88, 1.02, t));
  return c * smoothstep(.08, .2, t) * (.18 + 1.05 * t * t);
}
// the hamon: a wavy line along the lower edge (the mark is 2 units tall, centred). Gentle, long waves and a fine ripple.
float hamonY(vec2 p){ return -.46 + .07 * sin(p.x * 3.1 + .6) + .03 * sin(p.x * 7.3 + 1.9) + .012 * sin(p.x * 15. + fb(p * 1.6) * 3.); }
// what a mirror held up to the camera shows: a dark studio, a soft box up-left, a hairline of furnace, the floor's glow and a moon
vec3 studio(vec3 r){
  vec3 c = vec3(.008, .008, .01);
  float az = atan(r.x, r.z), el = asin(clamp(r.y, -1., 1.));
  c += uLights * (vec3(1., .95, .88) * .7 * smoothstep(.1, .02, abs(az + .2)) * smoothstep(.34, .12, abs(el - .12)));
  c += uHair * (vec3(1., .6, .3) * 2.2 * smoothstep(.016, .0, abs(az - .03)) * smoothstep(.5, .1, abs(el)));
  c += uLights * (vec3(.7, .7, .68) * .2 * smoothstep(.2, -.2, el) * smoothstep(.0, .3, az + .25));
  c += uLights * (vec3(1., .42, .12) * .45 * smoothstep(-.05, -.45, el));
  float a = acos(clamp(dot(r, normalize(uMoon)), -1., 1.));
  float disc = smoothstep(uMoonR, uMoonR * .93, a);
  vec3 moon = mix(vec3(.82, .8, .74), vec3(1., .985, .94), smoothstep(uMoonR, 0., a)) * 5.2;
  return mix(c, moon, disc) + vec3(.95, .92, .85) * exp(-max(a - uMoonR, 0.) * 16.) * .2;
}
`,q=`#include <color_fragment>
  float yb = hamonY(vObj.xy), dh = vObj.y - yb;
  float drawnX = smoothstep(uHamon * 4.3 - 2.1, uHamon * 4.3 - 2.3, vObj.x);      // the line draws itself left to right
  float below = smoothstep(.06, -.06, dh) * drawnX;                             // soft boundary: 1 under the line
  float mist = exp(-dh * dh / .011) * drawnX * (.55 + .45 * fb(vObj.xy * 9.));   // the misty band straddling the line
  float sweep = smoothstep(0., .3, uPolish * 1.3 - (vObj.x + 2.) / 4. * .9);      // the polish sweep
  float mir = sweep * (1. - below), mat = sweep * below;
  float folds = fb(vec2(vObj.x * 12., vObj.y * 2.2) + vec2(0., fb(vObj.xy * 4.) * 3.)), fine = fb(vObj.xy * 80.);
  vec3 gun = vec3(.12, .12, .13) * (.7 + .6 * folds) * (.85 + .3 * fine);
  float glint = step(.984, fh(floor(vObj.xy * 150.)));
  vec3 crys = uSteel * (.3 + .14 * fine) + vec3(.72, .74, .78) * glint * .7 + vec3(.85, .88, .92) * mist * .12;
  diffuseColor.rgb = mix(gun, uSteel * (.9 + .15 * folds), mir);
  diffuseColor.rgb = mix(diffuseColor.rgb, crys, mat);
  diffuseColor.rgb += vec3(.95, .97, 1.) * mist * .2 * sweep;
`,_=`#include <roughnessmap_fragment>
  roughnessFactor = mix(.62 - .16 * folds, .04 + .05 * fine, mir);
  roughnessFactor = mix(roughnessFactor, .5 + .22 * fine, mat);
`,G=`#include <metalnessmap_fragment>
  metalnessFactor = mix(.82, 1., sweep) * (1. - .12 * mat);
`,P=`#include <emissivemap_fragment>
  float front = smoothstep(.55, 0., uRevealY - vObj.y) * step(vObj.y, uRevealY) * step(uRevealY, 90.);
  float temp = uHeat * (.84 + .24 * fb(vObj.xy * 3.2 + uT * .08)) + front * .45;
  totalEmissiveRadiance += heatRamp(clamp(temp, 0., 1.25)) * uEmit;
  if (uMirror > 0.) {
    vec3 Rv = reflect(-normalize(vViewPosition), normal), Rw = normalize((vec4(Rv, 0.) * viewMatrix).xyz);
    float ripple = mist * sin(vObj.x * 19. + uT * .6) * .07;                       // the hamon bends the reflection a little
    Rw = normalize(Rw + vec3(ripple, ripple * .5, 0.) + (vec3(fine, fb(vObj.yx * 60.), fb(vObj.xy * 45. + 3.)) - .5) * .012);
    totalEmissiveRadiance += studio(Rw) * uSteel * mir * (.55 + .45 * folds) * .7 * uMirror;
    totalEmissiveRadiance += vec3(.95, .97, 1.) * mist * sweep * .18;
  }
`;function F(i,o={}){const l={uHeat:{value:0},uRevealY:{value:99},uPolish:{value:0},uHamon:{value:0},uMoonR:{value:.12},uMoon:{value:new C(...o.moon??[.15,.09,1])},uLights:{value:1},uHair:{value:1},uMirror:{value:o.mirror??0},uSteel:{value:new h(o.steel??"#c9ccd2")},uT:{value:0},uEmit:{value:o.emit??1}};return i.onBeforeCompile=t=>{Object.assign(t.uniforms,l),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+k).replace("void main() {",`void main() {
  if (vObj.y > uRevealY) discard;`).replace("#include <color_fragment>",q).replace("#include <roughnessmap_fragment>",_).replace("#include <metalnessmap_fragment>",G).replace("#include <emissivemap_fragment>",P)},i.customProgramCacheKey=()=>"rounds-forge-steel",l}const f=(i,o=40)=>H(i,o*Math.PI/180);function A(i,o=.05){const l=new b;i.forEach(([n,a],s)=>s?l.lineTo(n,a+(a>0?-o:0)):l.moveTo(n,a+(a>0?-o:0)));const t=new x(l,{depth:1-o*2,bevelEnabled:!0,bevelThickness:o,bevelSize:o,bevelSegments:6,curveSegments:16});return t.translate(0,0,-.5),f(t,42)}function V(i,o,l,t=.06){const n=i-t*2,a=o-t*2,s=Math.min(n,a)*.3,r=-n/2,e=-a/2,c=new b;c.moveTo(r+s,e),c.lineTo(r+n-s,e),c.quadraticCurveTo(r+n,e,r+n,e+s),c.lineTo(r+n,e+a-s),c.quadraticCurveTo(r+n,e+a,r+n-s,e+a),c.lineTo(r+s,e+a),c.quadraticCurveTo(r,e+a,r,e+a-s),c.lineTo(r,e+s),c.quadraticCurveTo(r,e,r+s,e);const m=new x(c,{depth:l-t*2,bevelEnabled:!0,bevelThickness:t,bevelSize:t,bevelSegments:5,curveSegments:10});return m.center(),f(m,50)}const X=(i=.34)=>f(E(i,!0),36);export{A as a,f as c,B as d,F as f,X as m,V as r};
