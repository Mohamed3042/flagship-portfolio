import"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{Q as c,b as v}from"./veil.BPBXkkAK.js";import{d as p,C as d,k as f,A as m}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const x=`
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

    vec2 q = (vNdc + uSun * .8) * vec2(uAspect, 1.);
    col += uTint * exp(-dot(q, q) * 90.) * .012 * uGhosts;
    gl_FragColor = vec4(col * uVis * uInt, 1.);
  }`;function y(r="#ffd2a0"){const t=new p({vertexShader:c,fragmentShader:x,transparent:!0,depthTest:!1,depthWrite:!1,blending:m,uniforms:{uSun:{value:new f},uVis:{value:0},uInt:{value:1},uAspect:{value:1},uTime:{value:0},uGhosts:{value:1},uTint:{value:new d(r)}}}),s=v(t,2e3),e=t.uniforms;return{mesh:s,uniforms:e,set(a,u,n,l=1){const i=Math.max(0,Math.max(Math.abs(a.x),Math.abs(a.y))-1.15),o=u*l*Math.max(0,1-i/.5);e.uSun.value.set(a.x,a.y),e.uVis.value=u,e.uAspect.value=n,e.uInt.value=o/Math.max(u,1e-4),s.visible=o>.001},dispose(){t.dispose(),s.geometry.dispose()}}}export{y as l};
