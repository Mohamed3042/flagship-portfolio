import{S as _,M as P,af as T,b as L,ag as I,aD as O,C as d,az as D,ac as N,a0 as M,i as S,s as z,O as R,al as k,V as C,aE as B,ae as q,ak as E,a8 as G,a as W}from"./EditionWorld.astro_astro_type_script_index_0_lang.DCRGG6Ug.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const x={black:"#0c0b0a",cream:"#efe6d2",ink:"#1c2a6b",gold:"#d9aa52",goldHi:"#f3d48c",goldDeep:"#8c6424",vermilion:"#c4452c"},b=n=>Array.isArray(n)?n:[n.x,n.y,n.z],V=`
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
  }`,$=`
  uniform float uOpacity; uniform vec3 uTint; varying vec4 vC; varying float vD, vHW;
  void main(){
    float a = clamp(vHW + .5 - abs(vD), 0., 1.) * vC.a * uOpacity;
    if (a < .004) discard;
    gl_FragColor = vec4(vC.rgb * uTint, a);
  }`;class H{A=[];B=[];T=[];W=[];C=[];col=new d;seg(t,a,e={}){const[r,o,l]=b(t),[i,c,s]=b(a);return this.col.set(e.c??x.cream),this.A.push(r,o,l),this.B.push(i,c,s),this.T.push(e.t0??0,e.t1??1e-4),this.W.push(e.w??1),this.C.push(this.col.r,this.col.g,this.col.b,e.a??1),this}poly(t,a={}){const e=t.map(b);a.closed&&e.push(e[0]);const r=e.slice(1).map((s,u)=>Math.hypot(s[0]-e[u][0],s[1]-e[u][1],s[2]-e[u][2])),o=r.reduce((s,u)=>s+u,0)||1,l=a.t0??0,i=a.t1??1e-4;let c=0;return r.forEach((s,u)=>{this.seg(e[u],e[u+1],{...a,t0:l+(i-l)*c/o,t1:l+(i-l)*(c+s)/o}),c+=s}),this}arc(t,a,e={}){const[r,o,l]=b(t),[i,c,s]=b(e.u??[1,0,0]),[u,p,F]=b(e.v??[0,0,-1]),m=e.a0??0,g=e.a1??Math.PI*2,w=e.n??Math.max(12,Math.ceil(Math.abs(g-m)/(Math.PI*2)*128)),y=[];for(let f=0;f<=w;f++){const v=m+(g-m)*f/w,h=Math.cos(v)*a,A=Math.sin(v)*a;y.push([r+i*h+u*A,o+c*h+p*A,l+s*h+F*A])}return this.poly(y,e)}get count(){return this.W.length}build({opacity:t=1,fog:a=[1e6,2e6]}={}){const e=new D;e.setAttribute("position",new N([0,-1,0,1,-1,0,0,1,0,1,1,0],3)),e.setIndex([0,1,2,2,1,3]),e.setAttribute("aA",new M(new Float32Array(this.A),3)),e.setAttribute("aB",new M(new Float32Array(this.B),3)),e.setAttribute("aT",new M(new Float32Array(this.T),2)),e.setAttribute("aW",new M(new Float32Array(this.W),1)),e.setAttribute("aC",new M(new Float32Array(this.C),4)),e.instanceCount=this.W.length;const r=new S({vertexShader:V,fragmentShader:$,transparent:!0,depthWrite:!1,side:R,uniforms:{uP:{value:1},uPx:{value:1},uNear:{value:.1},uRes:{value:new z(1,1)},uOpacity:{value:t},uTint:{value:new d(1,1,1)},uFogNear:{value:a[0]},uFogFar:{value:a[1]}}}),o=new P(e,r);return o.frustumCulled=!1,o}}function j(n,t,a){const e=n.material.uniforms;e.uRes.value.set(a.width*a.dpr,a.height*a.dpr),e.uPx.value=a.dpr,e.uNear.value=t.near}function K({paper:n=x.cream,ink:t=x.ink,warm:a=x.gold,cell:e=5.5,amb:r=.32,gain:o=1,side:l=B,fog:i=x.black,fogNear:c=1e6,fogFar:s=2e6,emissive:u=0,invert:p=0}={}){return new S({side:l,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:2,uniforms:{uPaper:{value:new d(n)},uInk:{value:new d(t)},uWarm:{value:new d(a)},uInv:{value:p},uLight:{value:new C(-.45,.75,.5).normalize()},uAmb:{value:r},uGain:{value:o},uCell:{value:e},uPx:{value:1},uLamp:{value:new C(0,100,0)},uLampAmt:{value:0},uLampR:{value:1},uLampDots:{value:0},uShift:{value:new z},uFog:{value:new d(i)},uFogNear:{value:c},uFogFar:{value:s},uEmit:{value:u},uOpacity:{value:1}},vertexShader:`
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
      }`})}function J(n,t){for(const a of n)a.uniforms.uPx.value=t}function Q(n){const t=new _;t.add(new P(new T(20,32,16),new L({color:"#070605",side:I})));const a=(o,l,i,c,s)=>{const u=new P(new W(o,l),new L({color:new d(i).multiplyScalar(c),side:R}));u.position.set(...s),u.lookAt(0,0,0),t.add(u)};a(12,8,"#fff3dc",4.2,[-8,10,7]),a(18,5,"#ffe6bf",2.2,[0,13,0]),a(2,12,"#ffffff",3,[11,2,-3]),a(16,3,"#b9792e",1.1,[0,-9,5]);for(let o=0;o<8;o++){const l=o/8*Math.PI*2;a(8,4.2,o%2?"#ffe2b8":"#fff4e2",1.45,[Math.sin(l)*14,4.5,Math.cos(l)*14])}const e=new O(n),r=e.fromScene(t,.03).texture;return e.dispose(),t.traverse(o=>{o.isMesh&&(o.geometry.dispose(),o.material.dispose())}),r}function X(n,{color:t=x.gold,rough:a=.3,leaf:e=1,squares:r=!0}={}){const o=new k({color:new d(t),metalness:1,roughness:a,envMap:n,envMapIntensity:1.35,clearcoat:.15,clearcoatRoughness:.4});return o.onBeforeCompile=l=>{l.vertexShader=l.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLeafP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLeafP = position;`),l.fragmentShader=l.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vLeafP;
      float lh(vec3 p){ return fract(sin(dot(p, vec3(41.3, 289.1, 77.7))) * 43758.5453); }
      float ln(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(lh(i), lh(i + vec3(1,0,0)), f.x), mix(lh(i + vec3(0,1,0)), lh(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(lh(i + vec3(0,0,1)), lh(i + vec3(1,0,1)), f.x), mix(lh(i + vec3(0,1,1)), lh(i + vec3(1,1,1)), f.x), f.y), f.z); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        vec3 lq = vLeafP * ${(3.2*e).toFixed(2)};
        float sq = ${r?"lh(floor(lq))":".5"};             // each laid square a little different
        roughnessFactor = clamp(roughnessFactor * (.8 + .4 * sq) + ln(vLeafP * 26.) * .06, .08, 1.);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        vec3 cr = vec3(ln(vLeafP * 31.), ln(vLeafP * 31. + 7.3), ln(vLeafP * 31. + 13.1)) - .5;
        normal = normalize(normal + cr * .07 + (vec3(lh(floor(lq) + 1.7), lh(floor(lq) + 5.1), lh(floor(lq) + 9.3)) - .5) * ${r?".05":"0."});`)},o.customProgramCacheKey=()=>`pear-gold-${e}-${r}`,o}async function Y(n){const t=['300 40px "Fraunces Variable"','italic 300 40px "Fraunces Variable"','500 20px "Inter Variable"',...n==="ar"?['400 40px "Amiri"','600 20px "Cairo Variable"']:[]];await Promise.race([Promise.all(t.map(a=>document.fonts.load(a).catch(()=>null))),new Promise(a=>setTimeout(a,2500))])}function Z(n,{dpr:t=1,align:a=0,rtl:e=!1,pad:r=9,halo:o="rgba(10, 8, 6, .82)"}={}){const l=document.createElement("canvas"),i=l.getContext("2d"),c=Math.max(1,Math.min(3,t)),s=n.map(f=>(i.font=`${f.font.replace(/(\d+(\.\d+)?)px/,(v,h)=>`${+h*c}px`)}`,i.measureText(f.text).width/c)),u=Math.ceil(Math.max(...s)+r*2),p=Math.ceil(n.reduce((f,v)=>f+(v.dy??v.size*1.25),0)+r*2);l.width=Math.ceil(u*c),l.height=Math.ceil(p*c),i.scale(c,c),i.direction=e?"rtl":"ltr",i.textBaseline="alphabetic";let F=r;for(const f of n){F+=f.dy??f.size*1.25,i.font=f.font,i.fillStyle=f.color??x.cream,i.textAlign=a>=1?"right":a>0?"center":"left";const v=a>=1?u-r:a>0?u/2:r,h=F-f.size*.24;o&&(i.save(),i.shadowColor=o,i.shadowBlur=7*c,i.fillText(f.text,v,h),i.fillText(f.text,v,h),i.restore()),i.fillText(f.text,v,h)}const m=new q(l);m.colorSpace=E,m.minFilter=G,m.generateMipmaps=!1;const g=new S({transparent:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{uMap:{value:m},uAnchor:{value:new C},uSize:{value:new z(u,p)},uOffset:{value:new z},uAlign:{value:a},uRes:{value:new z(1,1)},uPx:{value:1},uOpacity:{value:0},uReveal:{value:1}},vertexShader:`
      uniform vec3 uAnchor; uniform vec2 uSize, uOffset, uRes; uniform float uAlign, uPx; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 c = projectionMatrix * viewMatrix * vec4(uAnchor, 1.);
        vec2 s = c.xy / c.w * uRes * .5;                                    // device px from the centre
        vec2 o = (uOffset + vec2(-uAlign * uSize.x, -uSize.y * .5)) * uPx;  // the box's bottom-left corner
        vec2 p = floor(s + o + .5) + position.xy * uSize * uPx;            // pixel-snapped: texels on pixels
        gl_Position = vec4(p / (uRes * .5) * c.w, 0., c.w);
        if (c.w <= 0.) gl_Position = vec4(2., 2., 2., 1.);
      }`,fragmentShader:`
      uniform sampler2D uMap; uniform float uOpacity, uReveal; varying vec2 vUv;
      void main(){ vec4 t = texture2D(uMap, vUv); float r = step(vUv.x, uReveal); gl_FragColor = vec4(t.rgb, t.a * uOpacity * r); }`}),w=new W(1,1);w.translate(.5,.5,0);const y=new P(w,g);return y.frustumCulled=!1,y.renderOrder=20,{mesh:y,mat:g,w:u,h:p,dispose(){m.dispose(),w.dispose(),g.dispose()}}}function ee(n,t){for(const a of n)a.uniforms.uRes.value.set(t.width*t.dpr,t.height*t.dpr),a.uniforms.uPx.value=t.dpr}function ae(n=1){const t=a=>{const e=Math.sin(a*127.1+n*311.7)*43758.5453;return e-Math.floor(e)};return a=>{const e=Math.floor(a),r=a-e,o=r*r*(3-2*r);return t(e)*(1-o)+t(e+1)*o}}export{H as I,x as P,ee as a,J as b,Y as f,X as g,K as h,j as i,Z as l,ae as n,Q as s};
