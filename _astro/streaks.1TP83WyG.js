import{L as c}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{c as f,af as h,ag as x,V as u,d as g,A as w,M as A}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function b(d,v=d.quality===0?260:620){const r=new f(1,1),a=new h;a.index=r.index,a.setAttribute("position",r.getAttribute("position")),a.setAttribute("uv",r.getAttribute("uv"));const s=c(41),o=new Float32Array(v*4);for(let e=0;e<v;e++)o[e*4]=s()*Math.PI*2,o[e*4+1]=2.2+Math.pow(s(),.8)*24,o[e*4+2]=s(),o[e*4+3]=s();a.setAttribute("aSeed",new x(o,4)),a.instanceCount=v;const t={uTravel:{value:0},uLen:{value:0},uAlpha:{value:0},uFwd:{value:new u(0,0,-1)},uRight:{value:new u(1,0,0)},uUp:{value:new u(0,1,0)},uCam:{value:new u}},n=new g({uniforms:t,transparent:!0,depthWrite:!1,depthTest:!1,blending:w,vertexShader:`
      attribute vec4 aSeed; uniform float uTravel, uLen; uniform vec3 uFwd, uRight, uUp, uCam;
      varying vec2 vUv; varying float vK, vA;
      void main(){
        float a = aSeed.x, r = aSeed.y, k = aSeed.w, L = 140.;
        float z = mod(aSeed.z * L - uTravel * (.7 + .6 * k), L);
        float len = uLen * (.5 + .7 * k) * (1. + z * .03);
        vec3 radial = uRight * cos(a) + uUp * sin(a), across = cross(uFwd, radial);
        vec3 pos = uCam + uFwd * (z + 1.5 + (position.y + .5) * len) + radial * r + across * position.x * (.035 + .05 * k) * (1. + z * .01);
        vUv = uv; vK = k; vA = smoothstep(L, L * .55, z) * smoothstep(0., 5., z);
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.);
      }`,fragmentShader:`
      uniform float uAlpha; varying vec2 vUv; varying float vK, vA;
      void main(){
        float x = abs(vUv.x - .5) * 2., head = 1. - vUv.y;
        float core = exp(-x * x * 5.) * smoothstep(0., .15, vUv.y) * smoothstep(1., .9, vUv.y);
        vec3 col = mix(vec3(.85, .4, .18), mix(vec3(1., .9, .76), vec3(1., .97, .92), head), smoothstep(.0, .55, head)) * (.25 + head * head * 1.2);
        gl_FragColor = vec4(col * core * vA * uAlpha * (.4 + .6 * vK), 1.);
      }`}),i=new A(a,n);return i.frustumCulled=!1,i.renderOrder=500,{mesh:i,set(e,m,p,l){e.updateMatrixWorld(),t.uCam.value.setFromMatrixPosition(e.matrixWorld),e.getWorldDirection(t.uFwd.value),t.uRight.value.setFromMatrixColumn(e.matrixWorld,0),t.uUp.value.setFromMatrixColumn(e.matrixWorld,1),t.uTravel.value=m,t.uLen.value=p,t.uAlpha.value=l,i.visible=l>.001},dispose(){a.dispose(),r.dispose(),n.dispose()}}}export{b as s};
