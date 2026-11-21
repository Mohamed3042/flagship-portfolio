import{L as f}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{C as c}from"./plan.JErftjW5.js";import{c as d,af as g,ag as p,C as u,V as x,d as m,aj as w,a7 as h,a9 as y,M as F}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function R(e){const l=f(e.seed??5),i=e.count,r=new d(1,1),a=new g;a.index=r.index,a.setAttribute("position",r.getAttribute("position")),a.setAttribute("uv",r.getAttribute("uv")),a.instanceCount=i;const v=new Float32Array(i*4);for(let t=0;t<i*4;t++)v[t]=l();a.setAttribute("aR",new p(v,4));const o={uT:{value:0},uStart:{value:0},uOrigin:{value:new x},uGain:{value:e.gain??1},uFade:{value:1},uCover:{value:1},uLow:{value:new u(e.low)},uHigh:{value:new u(e.high)},uLift:{value:0}},s=new m({transparent:!0,depthWrite:!1,blending:y,blendSrc:h,blendDst:w,uniforms:o,vertexShader:`
      attribute vec4 aR; uniform float uT, uStart, uCover; uniform vec3 uOrigin; varying vec2 vUv; varying float vK, vY, vS; varying float vOn;
      void main(){
        float life = ${e.life.toFixed(2)}, span = ${(e.span??e.life*.6).toFixed(2)};
        float age = ${e.loop?"mod(uT - aR.x * life, life)":"uT - uStart - aR.x * span"};
        vK = age / life; vOn = step(aR.w, uCover);
        if (age < 0. || age > life) {gl_Position = vec4(2., 2., 2., 1.); return;}
        float k = vK;
        vec3 spread = vec3(${e.spread.map(t=>t.toFixed(2)).join(",")});
        vec3 p = uOrigin + (aR.xyz - .5) * spread * vec3(1., 0., 1.) * (.6 + k);
        p.x += sin(age * 1.4 + aR.y * 6.28) * ${(e.swirl??.35).toFixed(2)} * (.3 + k);
        p.y += age * ${e.rise.toFixed(2)} * (.55 + .9 * aR.z) - .5 * k * k * 0.;
        float s = mix(${e.size[0].toFixed(2)}, ${e.size[1].toFixed(2)}, aR.w) * (.35 + 1.3 * sqrt(k));
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float ang = aR.z * 6.28 + age * (aR.w - .5) * .6, ca = cos(ang), sa = sin(ang);
        vec2 q = position.xy; q = vec2(ca * q.x - sa * q.y, sa * q.x + ca * q.y);
        p += (right * q.x + up * q.y) * s;
        vUv = uv; vY = clamp((p.y - uOrigin.y) / ${Math.max(1,e.rise*e.life).toFixed(2)}, 0., 1.); vS = aR.x * 17. + aR.y * 31.;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:c+`
      uniform vec3 uLow, uHigh; uniform float uGain, uFade, uLift; varying vec2 vUv; varying float vK, vY, vS, vOn;
      void main(){
        vec2 q = vUv * 2. - 1.; float r = length(q);
        float n = fbm(q * 1.7 + vS + vK * .6);
        float a = smoothstep(1., .08, r) * (.25 + 1.05 * n) * smoothstep(0., .14, vK) * smoothstep(1., .42, vK) * uGain * uFade * vOn;
        vec3 col = mix(uLow, uHigh, vY) * (.6 + .6 * n) + uLift;
        gl_FragColor = vec4(col * a, a);
      }`}),n=new F(a,s);return n.frustumCulled=!1,n.renderOrder=30,{mesh:n,U:o,dispose(){a.dispose(),s.dispose()}}}export{R as p};
