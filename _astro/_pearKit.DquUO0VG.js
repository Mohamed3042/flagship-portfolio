import{S as I,M as y,Z as _,e as A,a2 as N,a3 as R,C as m,a4 as k,a5 as D,a6 as h,b as L,s as C,J as W,a7 as T,V as M,a8 as B,a as q}from"./EditionWorld.astro_astro_type_script_index_0_lang.DMdfUXqr.js";/* empty css                      *//*! © 2026 Mohamed Mahmoud. All rights reserved. */const f={black:"#0c0b0a",cream:"#efe6d2",ink:"#1c2a6b",gold:"#d9aa52",goldHi:"#f3d48c",goldDeep:"#8c6424",vermilion:"#c4452c"},v=r=>Array.isArray(r)?r:[r.x,r.y,r.z],V=`
  attribute vec3 aA, aB; attribute vec2 aT; attribute float aW; attribute vec4 aC;
  uniform float uP, uPx, uNear, uFogNear, uFogFar; uniform vec2 uRes;
  varying vec4 vC; varying float vD, vHW;
  void main(){
    float g = clamp((uP - aT.x) / max(aT.y - aT.x, 1e-5), 0., 1.);
    vec4 a = modelViewMatrix * vec4(aA, 1.), b = modelViewMatrix * vec4(mix(aA, aB, g), 1.);
    float zn = -uNear * 1.002;
    if ((a.z > zn && b.z > zn) || g <= 0.) { gl_Position = vec4(2., 2., 2., 1.); vC = vec4(0.); return; }
    if (a.z > zn) a.xyz = mix(a.xyz, b.xyz, (a.z - zn) / (a.z - b.z));
    if (b.z > zn) b.xyz = mix(b.xyz, a.xyz, (b.z - zn) / (b.z - a.z));
    vec4 ca = projectionMatrix * a, cb = projectionMatrix * b;
    vec2 sa = ca.xy / ca.w * uRes * .5, sb = cb.xy / cb.w * uRes * .5, d = sb - sa;
    float L = length(d);
    vec2 dir = L > 1e-3 ? d / L : vec2(1., 0.), nrm = vec2(-dir.y, dir.x);
    float w = aW * uPx, hw = max(w, 1.) * .5, ext = hw + 1.;
    bool end = position.x > .5;
    vec4 c = end ? cb : ca;
    vec2 s = (end ? sb : sa) + nrm * position.y * ext + dir * (end ? 1. : -1.) * min(hw, 1.);
    c.xy = s / (uRes * .5) * c.w;
    gl_Position = c;
    vD = position.y * ext; vHW = hw;
    float fog = smoothstep(uFogNear, uFogFar, -(end ? b.z : a.z));
    vC = vec4(aC.rgb, aC.a * min(w, 1.) * (1. - fog));
  }`,G=`
  uniform float uOpacity; uniform vec3 uTint; varying vec4 vC; varying float vD, vHW;
  void main(){
    float a = clamp(vHW + .5 - abs(vD), 0., 1.) * vC.a * uOpacity;
    if (a < .004) discard;
    gl_FragColor = vec4(vC.rgb * uTint, a);
  }`;class H{A=[];B=[];T=[];W=[];C=[];col=new m;seg(o,a,e={}){const[i,t,n]=v(o),[s,c,l]=v(a);return this.col.set(e.c??f.cream),this.A.push(i,t,n),this.B.push(s,c,l),this.T.push(e.t0??0,e.t1??1e-4),this.W.push(e.w??1),this.C.push(this.col.r,this.col.g,this.col.b,e.a??1),this}poly(o,a={}){const e=o.map(v);a.closed&&e.push(e[0]);const i=e.slice(1).map((l,u)=>Math.hypot(l[0]-e[u][0],l[1]-e[u][1],l[2]-e[u][2])),t=i.reduce((l,u)=>l+u,0)||1,n=a.t0??0,s=a.t1??1e-4;let c=0;return i.forEach((l,u)=>{this.seg(e[u],e[u+1],{...a,t0:n+(s-n)*c/t,t1:n+(s-n)*(c+l)/t}),c+=l}),this}arc(o,a,e={}){const[i,t,n]=v(o),[s,c,l]=v(e.u??[1,0,0]),[u,d,S]=v(e.v??[0,0,-1]),p=e.a0??0,w=e.a1??Math.PI*2,F=e.n??Math.max(12,Math.ceil(Math.abs(w-p)/(Math.PI*2)*128)),P=[];for(let g=0;g<=F;g++){const z=p+(w-p)*g/F,x=Math.cos(z)*a,b=Math.sin(z)*a;P.push([i+s*x+u*b,t+c*x+d*b,n+l*x+S*b])}return this.poly(P,e)}get count(){return this.W.length}build({opacity:o=1,fog:a=[1e6,2e6]}={}){const e=new k;e.setAttribute("position",new D([0,-1,0,1,-1,0,0,1,0,1,1,0],3)),e.setIndex([0,1,2,2,1,3]),e.setAttribute("aA",new h(new Float32Array(this.A),3)),e.setAttribute("aB",new h(new Float32Array(this.B),3)),e.setAttribute("aT",new h(new Float32Array(this.T),2)),e.setAttribute("aW",new h(new Float32Array(this.W),1)),e.setAttribute("aC",new h(new Float32Array(this.C),4)),e.instanceCount=this.W.length;const i=new L({vertexShader:V,fragmentShader:G,transparent:!0,depthWrite:!1,side:W,uniforms:{uP:{value:1},uPx:{value:1},uNear:{value:.1},uRes:{value:new C(1,1)},uOpacity:{value:o},uTint:{value:new m(1,1,1)},uFogNear:{value:a[0]},uFogFar:{value:a[1]}}}),t=new y(e,i);return t.frustumCulled=!1,t}}function $(r,o,a){const e=r.material.uniforms;e.uRes.value.set(a.width*a.dpr,a.height*a.dpr),e.uPx.value=a.dpr,e.uNear.value=o.near}function j({paper:r=f.cream,ink:o=f.ink,warm:a=f.gold,cell:e=5.5,amb:i=.32,gain:t=1,side:n=B,fog:s=f.black,fogNear:c=1e6,fogFar:l=2e6,emissive:u=0,invert:d=0}={}){return new L({side:n,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:2,uniforms:{uPaper:{value:new m(r)},uInk:{value:new m(o)},uWarm:{value:new m(a)},uInv:{value:d},uLight:{value:new M(-.45,.75,.5).normalize()},uAmb:{value:i},uGain:{value:t},uCell:{value:e},uPx:{value:1},uLamp:{value:new M(0,100,0)},uLampAmt:{value:0},uLampR:{value:1},uLampDots:{value:0},uShift:{value:new C},uFog:{value:new m(s)},uFogNear:{value:c},uFogFar:{value:l},uEmit:{value:u},uOpacity:{value:1}},vertexShader:`
      varying vec3 vN, vW; varying float vDepth;
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * w; vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uPaper, uInk, uWarm, uLight, uLamp, uFog; uniform vec2 uShift;
      uniform float uAmb, uGain, uCell, uPx, uLampAmt, uLampR, uLampDots, uFogNear, uFogFar, uEmit, uOpacity, uInv;
      varying vec3 vN, vW; varying float vDepth;
      float screen(float amt, float ang, float cell){   // a dot of radius sqrt(amt) in each cell, its edge half a pixel soft
        vec2 px = (gl_FragCoord.xy / uPx + uShift);
        float c = cos(ang), s = sin(ang);
        vec2 q = mat2(c, -s, s, c) * px / cell, f = fract(q) - .5;
        float r = sqrt(clamp(amt, 0., 1.)) * .7, d = length(f) - r, aa = .6 / (cell * uPx);
        return (1. - smoothstep(-aa, aa, d)) * step(.002, amt);
      }
      void main(){
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
        float lam = max(dot(n, uLight), 0.);
        float shade = clamp((1. - (uAmb + (1. - uAmb) * lam)) * uGain, 0., 1.);
        if (uInv > .5) shade = clamp((uAmb + (1. - uAmb) * lam) * uGain, 0., 1.);   // light ink on dark paper: the dots print the light
        vec3 col = mix(uPaper, uInk, screen(shade, .7854, uCell));
        if (uLampAmt > 0.) {
          vec3 l = uLamp - vW; float dl = length(l);
          float lit = max(dot(n, l / dl), 0.) * exp(-dl * dl / (uLampR * uLampR)) * uLampAmt;
          col = mix(col, uWarm, mix(lit * .4, screen(lit, .2618, uCell * .85), uLampDots));   // a warm pool, or printed in gold dots
        }
        col += uWarm * uEmit;
        col = mix(col, uFog, smoothstep(uFogNear, uFogFar, vDepth));
        gl_FragColor = vec4(col, uOpacity);
      }`})}function K(r,o){for(const a of r)a.uniforms.uPx.value=o}function J(r){const o=new I;o.add(new y(new _(20,32,16),new A({color:"#070605",side:N})));const a=(t,n,s,c,l)=>{const u=new y(new q(t,n),new A({color:new m(s).multiplyScalar(c),side:W}));u.position.set(...l),u.lookAt(0,0,0),o.add(u)};a(12,8,"#fff3dc",4.2,[-8,10,7]),a(18,5,"#ffe6bf",2.2,[0,13,0]),a(2,12,"#ffffff",3,[11,2,-3]),a(16,3,"#b9792e",1.1,[0,-9,5]);for(let t=0;t<8;t++){const n=t/8*Math.PI*2;a(8,4.2,t%2?"#ffe2b8":"#fff4e2",1.45,[Math.sin(n)*14,4.5,Math.cos(n)*14])}const e=new R(r),i=e.fromScene(o,.03).texture;return e.dispose(),o.traverse(t=>{t.isMesh&&(t.geometry.dispose(),t.material.dispose())}),i}function U(r,{color:o=f.gold,rough:a=.3,leaf:e=1,squares:i=!0}={}){const t=new T({color:new m(o),metalness:1,roughness:a,envMap:r,envMapIntensity:1.35,clearcoat:.15,clearcoatRoughness:.4});return t.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLeafP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLeafP = position;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vLeafP;
      float lh(vec3 p){ return fract(sin(dot(p, vec3(41.3, 289.1, 77.7))) * 43758.5453); }
      float ln(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(lh(i), lh(i + vec3(1,0,0)), f.x), mix(lh(i + vec3(0,1,0)), lh(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(lh(i + vec3(0,0,1)), lh(i + vec3(1,0,1)), f.x), mix(lh(i + vec3(0,1,1)), lh(i + vec3(1,1,1)), f.x), f.y), f.z); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        vec3 lq = vLeafP * ${(3.2*e).toFixed(2)};
        float sq = ${i?"lh(floor(lq))":".5"};             // each laid square a little different
        roughnessFactor = clamp(roughnessFactor * (.8 + .4 * sq) + ln(vLeafP * 26.) * .06, .08, 1.);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        vec3 cr = vec3(ln(vLeafP * 31.), ln(vLeafP * 31. + 7.3), ln(vLeafP * 31. + 13.1)) - .5;
        normal = normalize(normal + cr * .07 + (vec3(lh(floor(lq) + 1.7), lh(floor(lq) + 5.1), lh(floor(lq) + 9.3)) - .5) * ${i?".05":"0."});`)},t.customProgramCacheKey=()=>`pear-gold-${e}-${i}`,t}async function Z(r){const o=['300 40px "Fraunces Variable"','italic 300 40px "Fraunces Variable"','500 20px "Inter Variable"',...r==="ar"?['400 40px "Amiri"','600 20px "Cairo Variable"']:[]];await Promise.race([Promise.all(o.map(a=>document.fonts.load(a).catch(()=>null))),new Promise(a=>setTimeout(a,2500))])}export{H as I,f as P,K as a,Z as f,U as g,j as h,$ as i,J as s};
