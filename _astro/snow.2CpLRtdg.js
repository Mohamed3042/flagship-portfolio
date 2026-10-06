import{i as m,C as t,s as v}from"./EditionWorld.astro_astro_type_script_index_0_lang.DjiVaGuA.js";import{N as d,s as p}from"./common.Den9xvki.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function x(o,r=o===0?3:o===1?4:5){const s=r,f=Math.max(1,s-1),a=new m({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uPhase:{value:0},uGust:{value:1},uAmt:{value:.6},uFog:{value:0},uAsp:{value:1},uWind:{value:new v(-1,-.18)},uSpeed:{value:1},uLen:{value:1},uFlake:{value:new t(1,1,1)},uFogCol:{value:new t(1,1,1)},uLevel:{value:1},uShift:{value:new v},uGlint:{value:0},uSunCol:{value:new t(1,.9,.7)},uLow:{value:0},uNear:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
      uniform float uTime, uPhase, uGust, uAmt, uFog, uAsp, uSpeed, uLen, uLevel, uGlint, uLow, uNear; uniform vec2 uWind, uShift; uniform vec3 uFlake, uFogCol, uSunCol;
      varying vec2 vUv;
      ${d}
      void main(){
        vec2 p = vec2((vUv.x - .5) * uAsp, vUv.y - .5);
        vec2 w = normalize(uWind); mat2 R = mat2(w.x, -w.y, w.y, w.x);   // into the wind's frame: the wind runs along +x
        float a = 0.; vec3 c = vec3(0.);
        for (int i = 0; i < ${s}; i++){
          float fi = float(i), k = fi / ${f}., z = 1. + fi * 1.3;   // depth: 1 nearest
          float sc = 2.4 * z * z;                                         // cells per unit of the screen's height
          // cells drawn out along the wind (A times longer than tall), so a fast flake can smear a long way
          float A = 1. + 5. * clamp(uSpeed * uLen - .3, 0., 1.);
          vec2 q = R * (p + uShift / z) * vec2(sc / A, sc);
          q.x -= uPhase / z * sc / A;                                     // the near ones cross the screen fastest
          q.y += sin(q.x * .21 * A / sc * 2.4 + fi * 1.7 + uTime * .5) * .22;   // the wind is never straight
          vec2 id = floor(q), f = fract(q) - .5, h = h22(id + fi * 37.1);
          float on = step(h.x, uAmt * (.6 + .4 * uGust) * min(1., 2.2 / (z * z)) * A) * (i == 0 ? uNear : 1.);
          vec2 d = f - (h22(id + 9.7 + fi) - .5) * vec2(.2, .55);
          float len = clamp(uLen * uSpeed * uGust * .05 / z * sc / A, .0, .44);   // the smear: speed × shutter
          float wid = .024 * z * (.6 + .8 * h.y);
          float soft = mix(2.4, 1., k);                                   // the near ones out of focus
          float s = smoothstep(len + wid * soft / A, len * .25, abs(d.x)) * smoothstep(wid * soft, wid * .2, abs(d.y));
          float lev = mix(.5, 1., k) * (.55 + .45 * h.y);
          float gl = uGlint * pow(h.y, 5.) * (.4 + .6 * sin(uTime * 6. + h.x * 40.));   // a flake catching the sun
          float o = s * on * lev;
          a = max(a, o);
          c += (uFlake + uSunCol * gl * 3.) * o;
        }
        c /= max(a, 1e-3); c = min(c, vec3(4.));
        // the blown snow: a veil drifting with the wind, thicker in the gusts and (uLow) near the ground
        vec2 fp = R * p * 2.2 + vec2(-uPhase * 1.6, 0.);
        float veil = uFog * (.74 + .3 * fbm3(fp * 1.3) * uGust + .2 * vnoise(fp * .45 + 4.) - .12);
        veil *= mix(1., smoothstep(.8, -.25, vUv.y), uLow);
        veil = clamp(veil, 0., 1.);
        a = clamp(a * uLevel, 0., 1.);
        float A = a + veil * (1. - a);
        vec3 col = (c * a + uFogCol * veil * (1. - a)) / max(A, 1e-4);
        gl_FragColor = vec4(col, A);
      }`}),l=p(a,900),e=a.uniforms;let i=0;return{mesh:l,uniforms:e,step(u,c,h){const n=.72+.18*Math.sin(u*.9)+.14*Math.sin(u*.37+1.3);i+=c*e.uSpeed.value*n,e.uTime.value=u,e.uPhase.value=i,e.uGust.value=n,e.uAsp.value=h},dispose(){l.geometry.dispose(),a.dispose()}}}export{x as s};
