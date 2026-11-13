import{b as c,C as d,B as v,A as f}from"./EditionWorld.astro_astro_type_script_index_0_lang.Df0eMC-i.js";import{Q as p,b as h}from"./veil.DSZiheAV.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const m=`
  uniform vec2 uSun; uniform float uVis, uInt, uAspect, uTime, uGhosts; uniform vec3 uTint;
  varying vec2 vNdc;
  void main(){
    vec2 d = (vNdc - uSun) * vec2(uAspect, 1.);
    float r = length(d);
    float core = exp(-r * r * 2600.) * 7.;
    float glow = exp(-r * 12.) * .45 + exp(-r * 4.) * .05;
    float streak = exp(-abs(d.y) * 260.) * exp(-abs(d.x) * 2.3) * .9 + exp(-abs(d.y) * 55.) * exp(-abs(d.x) * 4.5) * .16;
    float a = atan(d.y, d.x);
    float rays = (pow(abs(cos(a * 3. + .4)), 80.) + pow(abs(cos(a * 2. - .9)), 110.) * .6) * exp(-r * 11.) * .22;
    vec3 col = uTint * (core + glow + rays) + mix(vec3(1., .93, .84), uTint, .35) * streak;
    // one ghost, far down the line from the sun through the centre: a faint warm haze, no rings (they read as a dirty lens)
    vec2 q = (vNdc + uSun * .8) * vec2(uAspect, 1.);
    col += uTint * exp(-dot(q, q) * 90.) * .012 * uGhosts;
    gl_FragColor = vec4(col * uVis * uInt, 1.);
  }`;function b(n="#ffd2a0"){const t=new c({vertexShader:p,fragmentShader:m,transparent:!0,depthTest:!1,depthWrite:!1,blending:f,uniforms:{uSun:{value:new v},uVis:{value:0},uInt:{value:1},uAspect:{value:1},uTime:{value:0},uGhosts:{value:1},uTint:{value:new d(n)}}}),s=h(t,2e3),e=t.uniforms;return{mesh:s,uniforms:e,set(a,o,r,l=1){const i=Math.max(0,Math.max(Math.abs(a.x),Math.abs(a.y))-1.15),u=o*l*Math.max(0,1-i/.5);e.uSun.value.set(a.x,a.y),e.uVis.value=o,e.uAspect.value=r,e.uInt.value=u/Math.max(o,1e-4),s.visible=u>.001},dispose(){t.dispose(),s.geometry.dispose()}}}export{b as l};
