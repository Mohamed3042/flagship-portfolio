import{m as g,am as p,M as x,G as y,V as b,ac as w,ad as M,ay as P,i as d,a5 as f,C as T,s as A}from"./EditionWorld.astro_astro_type_script_index_0_lang.KM0kS1M1.js";import{b as S,Q as V,a as G}from"./sky.BLAXPL2u.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function I(r,{depth:s=.62}={}){const{env:o}=S(r),e=g(s),a=new p({color:"#15161b",metalness:.92,roughness:.22,clearcoat:1,clearcoatRoughness:.05,envMap:o,envMapIntensity:1.6}),t=new p({color:"#e8b56c",metalness:1,roughness:.19,envMap:o,envMapIntensity:1.5,clearcoat:.4,clearcoatRoughness:.1}),l=new x(e,[a,t]),u=new y;u.add(l);const v=[[-1.93,.98],[-.04,.98],[1.85,.98],[1.88,-.98]].map(([i,h])=>new b(i,h,s/2+.1)),n=new w().setFromPoints(v);n.setAttribute("aPhase",new M(new Float32Array([0,.37,.61,.83]),1));const c=new P(n,new d({transparent:!0,depthWrite:!1,blending:f,uniforms:{uTime:{value:0},uPx:{value:1},uOn:{value:1}},vertexShader:`
      attribute float aPhase; uniform float uTime, uPx; varying float vK; varying float vWarm;
      void main(){
        float c = fract(uTime * .42 + aPhase);
        vK = exp(-c * 26.) + exp(-max(c - .12, 0.) * 30.) * step(.12, c) * .7;   // a double strobe
        vWarm = step(.5, fract(aPhase * 3.1));
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        gl_PointSize = uPx * 22. * (1. + vK);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uOn; varying float vK; varying float vWarm;
      void main(){
        vec2 q = gl_PointCoord - .5; float r = length(q);
        float a = (exp(-r * r * 90.) * 2.5 + exp(-r * 9.) * .25 + exp(-abs(q.y) * 70.) * exp(-abs(q.x) * 5.) * .6 * vK) * smoothstep(.5, .32, r);
        vec3 col = mix(vec3(.85, .92, 1.), vec3(1., .72, .38), vWarm);
        gl_FragColor = vec4(col * a * (.12 + vK * 2.2) * uOn, 1.);
      }`}));c.frustumCulled=!1,u.add(c);const m=c.material.uniforms;return{group:u,body:l,black:a,gold:t,update(i){m.uTime.value=i,m.uPx.value=r.viewport.dpr*Math.min(1.6,r.viewport.height/760)},lightsOn(i){m.uOn.value=i},dispose(){e.dispose(),a.dispose(),t.dispose(),n.dispose(),c.material.dispose()}}}const q=`
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
    vec3 col = uTint * (core + glow + rays) + mix(vec3(.85, .9, 1.), uTint, .35) * streak;
    // one ghost, far down the line from the sun through the centre: a faint warm haze, no rings (they read as a dirty lens)
    vec2 q = (vNdc + uSun * .8) * vec2(uAspect, 1.);
    col += uTint * exp(-dot(q, q) * 90.) * .012 * uGhosts;
    gl_FragColor = vec4(col * uVis * uInt, 1.);
  }`;function K(r="#ffd2a0"){const s=new d({vertexShader:V,fragmentShader:q,transparent:!0,depthTest:!1,depthWrite:!1,blending:f,uniforms:{uSun:{value:new A},uVis:{value:0},uInt:{value:1},uAspect:{value:1},uTime:{value:0},uGhosts:{value:1},uTint:{value:new T(r)}}}),o=G(s,2e3),e=s.uniforms;return{mesh:o,uniforms:e,set(a,t,l,u=1){const v=Math.max(0,Math.max(Math.abs(a.x),Math.abs(a.y))-1.15),n=t*u*Math.max(0,1-v/.5);e.uSun.value.set(a.x,a.y),e.uVis.value=t,e.uAspect.value=l,e.uInt.value=n/Math.max(t,1e-4),o.visible=n>.001},dispose(){s.dispose(),o.geometry.dispose()}}}export{K as l,I as m};
