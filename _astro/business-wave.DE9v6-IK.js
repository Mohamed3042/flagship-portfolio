import"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{n as f,o as p,d as r,k as o,w as m}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const h=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),s=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,g=(e,t,i,a,u)=>-Math.sin(u*e/a*Math.PI+i)*t,y=(e,t,i,a,u)=>-Math.cos(u*e/a*Math.PI+i)*t*u*Math.PI/a,v=()=>{const e=new m(new Uint8Array([0,0,0,255]),1,1);return e.needsUpdate=!0,e};function M(e){return new r({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...e,uMap:{value:v()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new o(1,1)},uScreen:{value:new o(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1},uSolid:{value:0},uFit:{value:0}},vertexShader:`${s}
      uniform float uGrow, uK; uniform vec2 uSize, uScreen; varying vec2 vUv; varying float vAsp;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        float u = uDir > 0. ? uv.x : 1. - uv.x;
        float g = smoothstep(0., 1., -u * uK + uGrow * (1. + uK));
        vec3 full = vec3(position.x * uScreen.x * 1.02, position.y * uScreen.y * 1.02, 0.);
        wp.xyz = mix(wp.xyz, full, g);
        vAsp = mix(uSize.x / uSize.y, uScreen.x / uScreen.y, uGrow);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uMap; uniform float uLevel, uGrow, uFilmAsp, uOpacity, uGain, uFit, uSolid; varying vec2 vUv; varying float vAsp;
      void main(){
        vec2 uv = vUv - .5;

        float r = vAsp / uFilmAsp;
        uv *= mix(r < 1. ? vec2(r, 1.) : vec2(1., 1. / r), r < 1. ? vec2(1., 1. / r) : vec2(r, 1.), uFit);
        uv *= mix(1., 1. / .92, uFit);
        vec2 q = abs(uv), px = fwidth(uv) * 1.5;
        float inside = (1. - smoothstep(.5 - px.x, .5, q.x)) * (1. - smoothstep(.5 - px.y, .5, q.y));
        vec3 col = texture2D(uMap, clamp(uv + .5, 0., 1.)).rgb * uLevel * uGain;
        float a = mix(smoothstep(1., .3, length(vUv - .5)), 1., max(uGrow, uSolid));
        float glass = .82;
        col = mix(vec3(.018, .02, .026), col, mix(1., inside, uFit));
        a = mix(a, mix(a * glass, 1., inside), uFit);
        gl_FragColor = vec4(col, a * uOpacity);
      }`})}const x=`
  uniform vec2 uWall; uniform float uGridX, uPlusX, uLine, uPlus, uAmt;
  float gline(float v){ float d = abs(fract(v + .5) - .5), w = fwidth(v); return 1. - smoothstep(min(.02, w * .35), min(.02, w * .35) + w * .9, d); }
  float gridAt(vec2 uv){
    vec2 g = uv * vec2(45., 50.); g.x += uGridX * uDir;
    float L = max(gline(g.x), gline(g.y)) * uLine;
    vec2 P = uv * uWall; P.x += uPlusX * uDir;
    vec2 st = uWall / vec2(16., 11.);
    vec2 f = (fract(P / st) - .5) * st;
    vec2 w = fwidth(P) * .75;
    float arm = .1;
    float plus = max(step(abs(f.y), w.y) * step(abs(f.x), arm), step(abs(f.x), w.x) * step(abs(f.y), arm));
    return max(L, plus * uPlus) * uAmt;
  }`;function b(e){return new r({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...e,uA:{value:v()},uB:{value:v()},uMix:{value:0},uFilm:{value:.4},uL:{value:v()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new o(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${s}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uA, uB, uL; uniform float uMix, uFilm, uDrift, uLetters, uDir, uGainA, uGainB; varying vec2 vUv;
      ${x}
      vec3 film(sampler2D m, vec2 uv){ return texture2D(m, vec2(.5 + (uv.x - .5) * .7, uv.y)).rgb; }
      void main(){
        float s = uDir > 0. ? vUv.x : 1. - vUv.x;
        vec3 col = vec3(0.);
        if (uFilm > .001) {
          vec3 fa = film(uA, vUv + vec2(uDir * .05 * uMix, 0.)) * uGainA;
          if (uMix > .001) fa = mix(fa, film(uB, vUv - vec2(uDir * .05 * (1. - uMix), 0.)) * uGainB, uMix);
          col = fa * uFilm * (1. - s);
        }
        if (uLetters > .001) {
          float R = 4.5, r = floor(vUv.y * R), v = fract(vUv.y * R);
          float u = fract(s * 1.1 + uDrift + r * .37) * 1.1;
          float L = u < 1. ? texture2D(uL, vec2(uDir > 0. ? u : 1. - u, v)).a : 0.;
          col += vec3(.86, .9, .96) * L * uLetters;
        }
        col += vec3(gridAt(vUv));
        gl_FragColor = vec4(col, 1.);
      }`})}function A(e,t){const a=document.createElement("canvas"),u=a.getContext("2d"),c=t?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;u.font=c;const n=Math.ceil(u.measureText(e).width+256*.1);a.width=Math.min(4096,n),a.height=256,u.font=c,u.fillStyle="#fff",u.textBaseline="alphabetic",u.direction=t?"rtl":"ltr",u.textAlign="center",u.fillText(e,a.width/2,256*.82);const l=new f(a);return l.anisotropy=8,l.minFilter=p,{tex:l,aspect:a.width/a.height}}function D(){return new r({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uE, uTime, uAsp, uDir, uClock, uWig, uG, uPx; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.), f.x), f.y); }
      float fbm(vec2 p){ return n2(p) * .55 + n2(p * 2.1 + 3.7) * .3 + n2(p * 4.3 + 9.1) * .15; }
      void main(){
        float k = 1. - uE;
        vec2 uv = vUv, c = uv - .5, p = vec2(c.x * uAsp, c.y);

        vec2 facet = vec2(fbm(p * 2.4 + vec2(uTime * .04, 0.)), fbm(p * 2.4 + 11.3 - uTime * .03)) - .5;
        vec2 bend = (c * (.55 - dot(p, p) * .8) + facet * .35) * k * .5 * (1. - smoothstep(.6, .9, uE));



        vec2 wig = vec2(0.);
        if (uWig > .001) {
          float r2 = dot(p, p);
          vec2 lensW = c * (r2 * 3.6 + .12) * .6;
          vec2 q = p * 1.5 + vec2(uClock * .1, uE * 1.6 - uClock * .06);
          vec2 d1 = vec2(fbm(q), fbm(q + 5.2)) - .5;
          vec2 d2 = vec2(fbm(q * 1.35 + d1 * 2.3 + 1.7), fbm(q * 1.35 + d1 * 2.3 + 9.2)) - .5;
          wig = (lensW + d2 * vec2(.055, .07)) * uWig;
        }



        vec3 col = vec3(0.), c0 = vec3(0.), sp = vec3(0.), sw = vec3(0.);
        for (int i = 0; i < 5; i++) {
          float s = 1. - float(i) * .06;
          vec2 o = bend * s + wig;
          vec3 t0 = texture2D(uMap, uv - o).rgb; c0 += t0;
          vec3 hue = clamp(abs(fract(float(i) * .1875 + vec3(0., 2. / 3., 1. / 3.)) * 6. - 3.) - 1., 0., 1.);
          sp += hue * dot(t0, vec3(.2126, .7152, .0722)); sw += hue;
          if (uE > .75) col += vec3(t0.r, texture2D(uMap, uv - o * 1.05).g, texture2D(uMap, uv - o * 1.1).b);
        }
        col /= 5.; c0 /= 5.; sp /= sw;




        float y0 = dot(c0, vec3(.2126, .7152, .0722));
        vec3 fr = sp - y0; fr -= dot(fr, vec3(.2126, .7152, .0722));
        float bw = smoothstep(.16, .6, y0 * (1. + 1.2 * k * k));
        float hh = h(floor(gl_FragCoord.xy / uPx) + 31.7);
        float spk = step(hh, pow(bw, .75) * mix(.08, 1.04, uG));
        if (uG < .999) spk = bw;
        float clean = smoothstep(.35, .8, uE);
        float lum = mix(spk, bw, clean) * mix(.9, .4, smoothstep(.0, .04, uE));
        lum *= 1. - .94 * smoothstep(.1, .42, uE);
        float rim = clamp(4. * bw * (1. - bw) + .12 * (1. - bw), 0., 1.);


        vec3 frE = clamp(fr, -.13, .13) * smoothstep(.03, .09, length(fr));
        frE *= max(1. - smoothstep(.2, .42, uE), ${typeof window<"u"&&window.__fringeOld?"1.":"0."});
        vec3 mono = vec3(lum) + frE * (.8 + .5 * k) * rim * max(spk, clean);
        col = mix(clamp(mono, 0., 1.), col, smoothstep(.75, 1., uE));
        gl_FragColor = vec4(col, 1.);
      }`})}export{h as W,g as a,y as b,D as g,A as l,M as p,b as w};
