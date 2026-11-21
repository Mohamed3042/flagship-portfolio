import{m as y}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{S as M,M as p,T as R,e as d,v as S,c as O,ay as j,i as T,aE as E,s as z,C as h,V as C,ab as x,m as b}from"./three.module.pheUvn1h.js";import{t as H}from"./BufferGeometryUtils.DpUE7TQU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function F(i,o={}){const c=new M,t=[],s=new p(new R(50,32,16),new d({color:o.base??"#050405",side:S}));c.add(s),t.push(s.geometry,s.material);const a=(e,m,l,g,w)=>{const f=new d({color:new h(m).multiplyScalar(l),side:z,toneMapped:!1}),u=new p(e,f);u.position.set(...g).normalize().multiplyScalar(w),u.lookAt(0,0,0),c.add(u),t.push(e,f)};for(const e of o.panels??[])a(new O(e.w,e.h),e.color,e.power,e.dir,30);o.moon&&a(new j(Math.tan(T.degToRad(o.moon.radius))*30,48),o.moon.color??"#fff8ea",o.moon.power??6,o.moon.dir,30);const n=new E(i.renderer),r=n.fromScene(c,0,.1,100).texture;n.dispose();for(const e of t)e.dispose();return r}const q=`
varying vec3 vObj;
uniform float uHeat, uRevealY, uPolish, uHamon, uMoonR, uLights, uHair, uMirror, uT, uEmit;
uniform vec3 uSteel, uMoon;
float fh(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(fh(i), fh(i + vec2(1., 0.)), f.x), mix(fh(i + vec2(0., 1.)), fh(i + vec2(1., 1.)), f.x), f.y); }
float fb(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * fn(p); p = p * 2.03 + 7.1; a *= .5; } return v; }

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

float hamonY(vec2 p){ return -.46 + .07 * sin(p.x * 3.1 + .6) + .03 * sin(p.x * 7.3 + 1.9) + .012 * sin(p.x * 15. + fb(p * 1.6) * 3.); }

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
`,_=`#include <color_fragment>
  float yb = hamonY(vObj.xy), dh = vObj.y - yb;
  float drawnX = smoothstep(uHamon * 4.3 - 2.1, uHamon * 4.3 - 2.3, vObj.x);
  float below = smoothstep(.06, -.06, dh) * drawnX;
  float mist = exp(-dh * dh / .011) * drawnX * (.55 + .45 * fb(vObj.xy * 9.));
  float sweep = smoothstep(0., .3, uPolish * 1.3 - (vObj.x + 2.) / 4. * .9);
  float mir = sweep * (1. - below), mat = sweep * below;
  float folds = fb(vec2(vObj.x * 12., vObj.y * 2.2) + vec2(0., fb(vObj.xy * 4.) * 3.)), fine = fb(vObj.xy * 80.);
  vec3 gun = vec3(.12, .12, .13) * (.7 + .6 * folds) * (.85 + .3 * fine);
  float glint = step(.984, fh(floor(vObj.xy * 150.)));
  vec3 crys = uSteel * (.3 + .14 * fine) + vec3(.72, .74, .78) * glint * .7 + vec3(.85, .88, .92) * mist * .12;
  diffuseColor.rgb = mix(gun, uSteel * (.9 + .15 * folds), mir);
  diffuseColor.rgb = mix(diffuseColor.rgb, crys, mat);
  diffuseColor.rgb += vec3(.95, .97, 1.) * mist * .2 * sweep;
`,k=`#include <roughnessmap_fragment>
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
    float ripple = mist * sin(vObj.x * 19. + uT * .6) * .07;
    Rw = normalize(Rw + vec3(ripple, ripple * .5, 0.) + (vec3(fine, fb(vObj.yx * 60.), fb(vObj.xy * 45. + 3.)) - .5) * .012);
    totalEmissiveRadiance += studio(Rw) * uSteel * mir * (.55 + .45 * folds) * .7 * uMirror;
    totalEmissiveRadiance += vec3(.95, .97, 1.) * mist * sweep * .18;
  }
`;function A(i,o={}){const c={uHeat:{value:0},uRevealY:{value:99},uPolish:{value:0},uHamon:{value:0},uMoonR:{value:.12},uMoon:{value:new C(...o.moon??[.15,.09,1])},uLights:{value:1},uHair:{value:1},uMirror:{value:o.mirror??0},uSteel:{value:new h(o.steel??"#c9ccd2")},uT:{value:0},uEmit:{value:o.emit??1}};return i.onBeforeCompile=t=>{Object.assign(t.uniforms,c),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+q).replace("void main() {",`void main() {
  if (vObj.y > uRevealY) discard;`).replace("#include <color_fragment>",_).replace("#include <roughnessmap_fragment>",k).replace("#include <metalnessmap_fragment>",G).replace("#include <emissivemap_fragment>",P)},i.customProgramCacheKey=()=>"rounds-forge-steel",c}const v=(i,o=40)=>H(i,o*Math.PI/180);function V(i,o=.05){const c=new x;i.forEach(([s,a],n)=>n?c.lineTo(s,a+(a>0?-o:0)):c.moveTo(s,a+(a>0?-o:0)));const t=new b(c,{depth:1-o*2,bevelEnabled:!0,bevelThickness:o,bevelSize:o,bevelSegments:6,curveSegments:16});return t.translate(0,0,-.5),v(t,42)}function X(i,o,c,t=.06){const s=i-t*2,a=o-t*2,n=Math.min(s,a)*.3,r=-s/2,e=-a/2,m=new x;m.moveTo(r+n,e),m.lineTo(r+s-n,e),m.quadraticCurveTo(r+s,e,r+s,e+n),m.lineTo(r+s,e+a-n),m.quadraticCurveTo(r+s,e+a,r+s-n,e+a),m.lineTo(r+n,e+a),m.quadraticCurveTo(r,e+a,r,e+a-n),m.lineTo(r,e+n),m.quadraticCurveTo(r,e,r+n,e);const l=new b(m,{depth:c-t*2,bevelEnabled:!0,bevelThickness:t,bevelSize:t,bevelSegments:5,curveSegments:10});return l.center(),v(l,50)}const D=(i=.34)=>v(y(i,!0),36);export{V as a,v as c,F as d,A as f,D as m,X as r};
