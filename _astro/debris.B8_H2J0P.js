import{al as x,a as y,a9 as l,C as z,V as m,i as w,aH as b,ao as g,aq as R,M as A,a4 as C,Z as h}from"./EditionWorld.astro_astro_type_script_index_0_lang.DwgUqTlS.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function M(o,u=4){const c=h(u),a=new x,t=new y(1,1),v=new Float32Array(o*4);for(let r=0;r<o*4;r++)v[r]=c();a.index=t.index,a.setAttribute("position",t.getAttribute("position")),a.instanceCount=o,a.setAttribute("aR",new l(v,4));const e={uAge:{value:-1},uO:{value:new m},uDir:{value:new m(1,.3,0)},uSpeed:{value:2.4},uSpread:{value:.8},uG:{value:6},uSize:{value:.02},uCol:{value:new z("#fff0d0")},uPx:{value:1}},n=new w({transparent:!0,depthWrite:!1,blending:R,blendSrc:g,blendDst:g,blendEquation:b,uniforms:e,vertexShader:`
      attribute vec4 aR; uniform float uAge, uSpeed, uSpread, uG, uSize; uniform vec3 uO, uDir; varying float vK; varying vec2 vQ;
      void main(){
        float age = uAge - aR.x * .12, life = .9 + aR.y * 1.3; vK = clamp(age / life, 0., 1.); vQ = position.xy;
        vec3 d = normalize(uDir + (vec3(aR.z, aR.w, aR.x * aR.y) * 2. - 1.) * uSpread) * uSpeed * (.35 + aR.y * 1.1);
        vec3 p = uO + d * age - vec3(0., .5 * uG * age * age, 0.);
        float s = uSize * (.5 + aR.w) * step(0., age) * (1. - vK * .6);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vec3 v = d - vec3(0., uG * age, 0.); float stretch = 1. + clamp(length(v) * .25, 0., 2.5);
        vec3 axis = normalize(v + 1e-4); vec3 ax = normalize(axis - dot(axis, normalize(cross(right, up))) * normalize(cross(right, up)));
        p += (ax * position.y * stretch + normalize(cross(ax, normalize(cross(right, up)))) * position.x) * s;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:"uniform vec3 uCol; varying float vK; varying vec2 vQ; void main(){ float a = smoothstep(.5, .1, length(vQ * vec2(1.6, .7))) * (1. - vK) * (1. - vK); gl_FragColor = vec4(uCol * a * 1.6, 0.); }"}),i=new A(a,n);return i.frustumCulled=!1,i.renderOrder=44,{mesh:i,U:e,dispose(){a.dispose(),n.dispose()}}}function F(o,u,c,a=9){const t=o.length/3,v=h(a),e=new x,n=new y(1,1),i=new Float32Array(t*4),r=new Float32Array(t*4);for(let s=0;s<t*4;s++)i[s]=v(),r[s]=v();e.index=n.index,e.setAttribute("position",n.getAttribute("position")),e.instanceCount=t,e.setAttribute("aHome",new l(o,3)),e.setAttribute("aR",new l(i,4)),e.setAttribute("aA",new l(r,4));const p={uAge:{value:-1},uC:{value:u.clone()},uFloor:{value:c},uG:{value:7.5},uSpeed:{value:3},uFade:{value:1}},f=new w({side:C,uniforms:p,vertexShader:`
      attribute vec3 aHome; attribute vec4 aR, aA; uniform float uAge, uFloor, uG, uSpeed; uniform vec3 uC; varying vec3 vCol; varying vec2 vQ; varying float vHand;
      vec3 rotv(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
      void main(){
        float age = uAge - aR.x * .08;
        bool hand = aR.w > .55; vHand = hand ? 1. : 0.; vQ = position.xy;
        vec3 out_ = normalize(aHome - uC + (vec3(aA.x, aA.y, aA.z) - .5) * .9 + vec3(0., .5, 0.));
        vec3 v0 = out_ * uSpeed * (.5 + aR.y * 1.1) + vec3(0., 1.2 + aR.z * 2., 0.);
        float y0 = aHome.y, disc = v0.y * v0.y + 2. * uG * (y0 - uFloor), tl = (v0.y + sqrt(max(disc, 0.))) / uG;
        float t = clamp(age, 0., tl);
        vec3 p = aHome + vec3(v0.x * t, v0.y * t - .5 * uG * t * t, v0.z * t);
        float rest = smoothstep(tl - .25, tl, age);                         // a moment after it lands it lies flat
        vec2 sz = hand ? vec2(.02 + aA.w * .012, .14 + aR.y * .22) : vec2(.018, .05 + aA.w * .05);
        vec3 axis = normalize(aA.xyz * 2. - 1. + 1e-3); float ang = t * (3. + aR.z * 9.) + aA.w * 20.;
        vec3 lp = vec3(position.xy * sz, 0.);
        vec3 tumbled = rotv(lp, axis, ang);
        float yaw = aA.z * 6.283; vec3 flat_ = vec3(cos(yaw) * lp.x - sin(yaw) * lp.y, .004, sin(yaw) * lp.x + cos(yaw) * lp.y);
        vec3 nT = rotv(vec3(0., 0., 1.), axis, ang), n = mix(nT, vec3(0., 1., 0.), rest);
        vec3 pos = p + mix(tumbled, flat_, rest) * step(0., age);
        float sh = .35 + .65 * abs(dot(normalize(n), normalize(vec3(-.3, 1., .5))));
        vec3 gold = pow(vec3(1., .78, .42), vec3(2.2)), verm = pow(vec3(.91, .25, .17), vec3(2.2));
        vCol = (hand && aA.y > .82 ? verm : gold) * sh * 2.2 * (.6 + .4 * rest);
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.);
      }`,fragmentShader:"uniform float uFade; varying vec3 vCol; varying vec2 vQ; varying float vHand; void main(){ float a = vHand > .5 ? smoothstep(.55, .0, abs(vQ.x) * (1. + (vQ.y + .5) * 1.6)) : 1.; if (a < .05) discard; gl_FragColor = vec4(vCol * uFade, 1.); }"}),d=new A(e,f);return d.frustumCulled=!1,d.renderOrder=43,{mesh:d,U:p,dispose(){e.dispose(),f.dispose()}}}export{M as a,F as s};
