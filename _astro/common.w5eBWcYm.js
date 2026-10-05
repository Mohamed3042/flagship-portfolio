import{G as he,ab as Qe,ac as ke,C as y,V as S,i as M,ak as T,am as O,av as Xe,aL as Je,a as Q,a0 as et,aC as P,O as We,M as _,I as ge,a3 as tt,aB as at,b5 as ot,aG as nt,b6 as st,a4 as rt,aa as qe,S as we,b7 as Ie,ai as ut,aj as it,aO as lt,s as D,K as ze,az as q,p as xe,aF as pe,F,a5 as Y,a6 as Te,aN as De,m as ct,an as vt,u as Re}from"./EditionWorld.astro_astro_type_script_index_0_lang.D3E1zgZp.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Oe=`
  uniform vec3 uCam, uBox; uniform float uTime;
  // a particle's place: its seed in the box, drifting, wrapped round the camera; e: how near the box's edge (0 at it)
  vec3 wrapAt(vec3 seed, vec3 drift, out float e){
    vec3 f = fract((seed * uBox + drift - uCam) / uBox);
    vec3 m = .5 - abs(f - .5); e = min(min(m.x, m.y), m.z) * 2.;
    return uCam + (f - .5) * uBox;
  }
`;function dt(e,{box:t=[70,40,70],focus:s=14,size:c=1,color:v="#ffe2a8",seed:n=3}={}){const u=ge(n),i=new Float32Array(e*3),l=new Float32Array(e);for(let w=0;w<e;w++)i[w*3]=u(),i[w*3+1]=u(),i[w*3+2]=u(),l[w]=u();const r=new Qe;r.setAttribute("position",new ke(i,3)),r.setAttribute("aRand",new ke(l,1));const o={uCam:{value:new S},uBox:{value:new S(...t)},uTime:{value:0},uFocus:{value:s},uSize:{value:c},uAmt:{value:1},uCol:{value:new y(v)},uPx:{value:1}},f=new M({uniforms:o,transparent:!0,depthWrite:!1,blending:O,blendSrc:T,blendDst:T,vertexShader:`
      ${Oe}
      attribute float aRand; uniform float uFocus, uSize, uPx; varying float vA, vSoft;
      void main(){
        float r = aRand, e;
        vec3 drift = vec3(sin(uTime * (.12 + r * .1) + r * 40.) * 2., uTime * (.25 + r * .35), cos(uTime * (.1 + r * .08) + r * 17.) * 2.);
        vec3 w = wrapAt(position, drift, e);
        vec4 mv = viewMatrix * vec4(w, 1.);
        float z = -mv.z, blur = clamp(abs(z - uFocus) / uFocus, 0., 1.6);
        float px = uSize * uPx * (1.4 + r * 2.2) * (36. / max(z, .5)) * (1. + blur * 5.);
        gl_PointSize = clamp(px, 1., 90.);
        vSoft = blur;
        // energy spreads over a defocused disc; twinkle; fade at the box's edges and close to the lens
        vA = (.45 + .55 * pow(.5 + .5 * sin(uTime * (1.3 + r * 3.) + r * 60.), 3.)) * smoothstep(0., .25, e) * smoothstep(.8, 3., z) / (1. + blur * blur * 6.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uCol; uniform float uAmt; varying float vA, vSoft;
      void main(){
        vec2 q = gl_PointCoord - .5; float d = length(q) * 2.;
        float core = exp(-d * d * mix(9., 2.2, clamp(vSoft, 0., 1.)));
        float rim = smoothstep(1., .82, d) * smoothstep(.55, .9, d) * clamp(vSoft - .4, 0., 1.) * .5;   // a bokeh's brighter rim
        float a = (core + rim) * smoothstep(1., .9, d) * vA * uAmt;
        gl_FragColor = vec4(uCol * a * 1.6, 0.);
      }`}),m=new Xe(r,f);return m.frustumCulled=!1,m.renderOrder=1300,{object:m,U:o,update(w,z,b){o.uCam.value.copy(w.position),o.uTime.value=z,o.uPx.value=b},dispose(){r.dispose(),f.dispose()}}}let N=null;function ft(){if(N)return N;const e=document.createElement("canvas");e.width=256,e.height=512;const t=e.getContext("2d"),s=ge(11),c=128,v=24,n=486,u=n-v,i=r=>c+Math.sin(r*Math.PI)*10,l=r=>Math.sin(Math.min(1,r*1.15)*Math.PI)*96*(r<.12?r/.12:1)*(1-Math.pow(r,6)*.4);t.lineCap="round";for(const r of[-1,1])for(let o=0;o<230;o++){const f=.06+o/230*.92,m=n-f*u,w=i(f);if(s()<.035)continue;const z=l(f)*(r>0?1:.82)*(.9+s()*.14),b=(.62+f*.25)*r,g=f<.2;t.strokeStyle=`rgba(255,255,255,${g?.28:.55+s()*.2})`,t.lineWidth=g?2.2:1.1,t.beginPath(),t.moveTo(w,m),t.quadraticCurveTo(w+Math.sin(b)*z*.5,m-Math.cos(b)*z*.32,w+Math.sin(b)*z,m-Math.cos(b)*z*.62-(g?s()*18:0)),t.stroke()}t.strokeStyle="rgba(255,255,255,.95)";for(let r=0;r<40;r++){const o=r/40,f=(r+1)/40;t.lineWidth=4.2*(1-o*.85),t.beginPath(),t.moveTo(i(o),n-o*u),t.lineTo(i(f),n-f*u),t.stroke()}return N=new tt(e),N.minFilter=at,N.anisotropy=4,N}function mt(e,t,{box:s=[44,30,44],size:c=1.1,seed:v=5}={}){const n=new Je,u=new Q(.5,1,1,4);n.index=u.index,n.setAttribute("position",u.getAttribute("position")),n.setAttribute("uv",u.getAttribute("uv"));const i=ge(v),l=new Float32Array(e*4);for(let m=0;m<e;m++)l[m*4]=i(),l[m*4+1]=i(),l[m*4+2]=i(),l[m*4+3]=i();n.setAttribute("aSeed",new et(l,4)),n.instanceCount=e;const r={uCam:{value:new S},uBox:{value:new S(...s)},uTime:{value:0},uSize:{value:c},uAmt:{value:1},uMap:{value:ft()},uSun:{value:t},uSunCol:{value:new y(1,.9,.75)}},o=new M({uniforms:r,transparent:!0,depthWrite:!1,side:We,vertexShader:`
      ${Oe}
      attribute vec4 aSeed; uniform float uSize; varying vec2 vUv; varying float vA, vLit;
      mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
      mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
      mat3 rotZ(float a){ float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }
      uniform vec3 uSun;
      void main(){
        float r = aSeed.w, e;
        float sway = sin(uTime * (.9 + r * .5) + r * 30.);
        // a falling leaf: down slowly, swinging side to side as it goes, turning about its quill
        vec3 drift = vec3(sway * 1.6, -uTime * (.45 + r * .35), cos(uTime * (.4 + r * .3) + r * 9.) * 1.1);
        vec3 w = wrapAt(aSeed.xyz, drift, e);
        mat3 R = rotY(uTime * (.25 + r * .35) + r * 6.28) * rotZ(sway * .55 + (r - .5)) * rotX(.5 + sin(uTime * .6 + r * 11.) * .45);
        vec3 p = position * uSize * (.7 + .6 * r);
        p.z += (position.y * position.y) * -.18 * uSize;   // the vane curls a little
        vec3 n = R * vec3(0., 0., 1.);
        vLit = dot(n, uSun);
        vec4 mv = viewMatrix * vec4(w + R * p, 1.);
        vUv = uv;
        vA = smoothstep(0., .22, e) * smoothstep(1.2, 4., -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform sampler2D uMap; uniform float uAmt; uniform vec3 uSunCol; varying vec2 vUv; varying float vA, vLit;
      void main(){
        float a = texture2D(uMap, vUv).a * vA * uAmt;
        if (a < .01) discard;
        // white, a cool shade on the side away from the sun, glowing through when the sun is behind it
        vec3 shade = vec3(.78, .8, .9), lit = vec3(1.06, 1.02, .97);
        vec3 col = mix(shade, lit, smoothstep(-.3, .6, abs(vLit))) + uSunCol * .25 * smoothstep(.2, 1., -vLit);
        gl_FragColor = vec4(col * a, a);
      }`,blending:O,blendSrc:T,blendDst:P,blendSrcAlpha:T,blendDstAlpha:P}),f=new _(n,o);return f.frustumCulled=!1,f.renderOrder=1250,{object:f,U:r,update(m,w){r.uCam.value.copy(m.position),r.uTime.value=w},dispose(){n.dispose(),u.dispose(),o.dispose()}}}function Nt(e,t,{feathers:s=1,motes:c=1,focus:v=14}={}){const n=dt(Math.round([160,300,420][e]*c),{focus:v}),u=mt(Math.max(0,Math.round([9,16,22][e]*s)),t),i=new he;return i.add(n.object),s>0&&i.add(u.object),{group:i,motes:n,feathers:u,update(l,r,o,f=1){n.update(l,r,o),u.update(l,r),n.U.uAmt.value=f,u.U.uAmt.value=f},dispose(){n.dispose(),u.dispose()}}}const pt=`
  uniform float uZ; varying vec2 vUv;
  vec3 hash33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
  float grad(vec3 x, float P){
    vec3 i = floor(x), f = fract(x), u = f * f * f * (f * (f * 6. - 15.) + 10.);
    #define G(o) dot(hash33(mod(i + o, P)) * 2. - 1., f - o)
    return mix(mix(mix(G(vec3(0, 0, 0)), G(vec3(1, 0, 0)), u.x), mix(G(vec3(0, 1, 0)), G(vec3(1, 1, 0)), u.x), u.y),
               mix(mix(G(vec3(0, 0, 1)), G(vec3(1, 0, 1)), u.x), mix(G(vec3(0, 1, 1)), G(vec3(1, 1, 1)), u.x), u.y), u.z);
  }
  float cell(vec3 x, float P){
    vec3 i = floor(x), f = fract(x); float d = 9.;
    for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) for (int c = -1; c <= 1; c++) {
      vec3 o = vec3(a, b, c), r = o + hash33(mod(i + o, P)) - f; d = min(d, dot(r, r));
    }
    return clamp(sqrt(d), 0., 1.);
  }
  float worleyFbm(vec3 p, float f){ return (1. - cell(p * f, f)) * .625 + (1. - cell(p * f * 2., f * 2.)) * .25 + (1. - cell(p * f * 4., f * 4.)) * .125; }
  float remap(float v, float a, float b, float c, float d){ return c + (v - a) / (b - a) * (d - c); }
  void main(){
    vec3 p = vec3(vUv, uZ);
    float n = 0., amp = .5, f = 4.;
    for (int k = 0; k < 5; k++){ n += amp * grad(p * f, f); f *= 2.; amp *= .5; }
    n = clamp(n * .9 + .5, 0., 1.);
    float wLow = worleyFbm(p, 4.), wHigh = worleyFbm(p, 8.);
    float pw = clamp(remap(n, wLow - 1., 1., 0., 1.), 0., 1.);
    float m = 0.; amp = .5; f = 2.;
    for (int k = 0; k < 4; k++){ m += amp * grad(p * f + 7.3, f); f *= 2.; amp *= .5; }
    gl_FragColor = vec4(pw, wLow, wHigh, clamp(m * .95 + .5, 0., 1.));
  }`,Le=new WeakMap;function ht(e){const t=e.renderer,s=Le.get(t);if(s)return s;const c=e.quality===0?64:128,v=new ot(c,c,c,{depthBuffer:!1,type:st,format:nt}),n=v.texture;n.wrapS=n.wrapT=n.wrapR=rt,n.minFilter=n.magFilter=qe,n.generateMipmaps=!1;const u=new M({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:pt,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),i=new _(new Q(2,2),u);i.frustumCulled=!1;const l=new we,r=new Ie;l.add(i);const o=t.getRenderTarget();for(let f=0;f<c;f++)u.uniforms.uZ.value=(f+.5)/c,t.setRenderTarget(v,f),t.render(l,r);return t.setRenderTarget(o),u.dispose(),i.geometry.dispose(),Le.set(t,n),n}const gt=[{u:0,elev:5,zenith:"#5f93d0",horizon:"#f2ebe4",below:"#d9d8e0",dawn:"#f0ab98",dawnAmt:.34,glow:"#ffcf96",glowAmt:.85,sun:"#ffd5a4",sunGain:3.6,ambTop:"#7f9cc9",ambBot:"#cfc6cf",gain:1},{u:.32,elev:6.5,zenith:"#6699d3",horizon:"#f4efe9",below:"#dcdce3",dawn:"#f2b6a2",dawnAmt:.26,glow:"#ffd6a2",glowAmt:.85,sun:"#ffdbae",sunGain:3.8,ambTop:"#86a2cd",ambBot:"#d4ccd2",gain:1.02},{u:.62,elev:9.5,zenith:"#6ea2d9",horizon:"#f6f2ec",below:"#e0e0e6",dawn:"#f5c5ae",dawnAmt:.16,glow:"#ffdeb2",glowAmt:.9,sun:"#ffe0b8",sunGain:4,ambTop:"#8eaad2",ambBot:"#dad3d6",gain:1.05},{u:.86,elev:15,zenith:"#7eb0e1",horizon:"#faf7f1",below:"#e8e7ea",dawn:"#ffdcc0",dawnAmt:.1,glow:"#ffe6c2",glowAmt:1.2,sun:"#ffe6c6",sunGain:3.5,ambTop:"#a0bbdc",ambBot:"#e3ddda",gain:1.12},{u:1,elev:19,zenith:"#76abe0",horizon:"#f9f6f0",below:"#e5e4e8",dawn:"#ffe0c6",dawnAmt:.08,glow:"#ffe8c8",glowAmt:.95,sun:"#ffeacd",sunGain:3.2,ambTop:"#98b5da",ambBot:"#e0dad8",gain:1.06}],R=e=>new y(e),Z=gt.map(e=>({...e,c:{zenith:R(e.zenith),horizon:R(e.horizon),below:R(e.below),dawn:R(e.dawn),glow:R(e.glow),sun:R(e.sun),ambTop:R(e.ambTop),ambBot:R(e.ambBot)}})),Fe=0;function je(){return{uSunDir:{value:new S(0,.05,-1).normalize()},uSunCol:{value:new y(1,.8,.6)},uZenith:{value:new y},uHorizon:{value:new y},uBelow:{value:new y},uDawnCol:{value:new y},uGlowCol:{value:new y},uAmbTop:{value:new y},uAmbBot:{value:new y},uDawn:{value:0},uGlow:{value:1},uSkyGain:{value:1.2},uFlood:{value:0},uDeep:{value:0},uWave:{value:new D}}}const wt=(e,t=new S)=>{const s=xe.degToRad(e);return t.set(Math.sin(Fe)*Math.cos(s),Math.sin(s),-Math.cos(Fe)*Math.cos(s))};function Ee(e,t,s=0,c=0,v=0){t=ze(t);let n=0;for(;n<Z.length-2&&t>Z[n+1].u;)n++;const u=Z[n],i=Z[n+1],l=ze((t-u.u)/(i.u-u.u)),r=(o,f)=>f.copy(u.c[o]).lerp(i.c[o],l);return wt(q(u.elev,i.elev,l),e.uSunDir.value),r("sun",e.uSunCol.value).multiplyScalar(q(u.sunGain,i.sunGain,l)*(1+s*.35)),r("zenith",e.uZenith.value),r("horizon",e.uHorizon.value),r("below",e.uBelow.value),r("dawn",e.uDawnCol.value),r("glow",e.uGlowCol.value),r("ambTop",e.uAmbTop.value),r("ambBot",e.uAmbBot.value),e.uDawn.value=q(u.dawnAmt,i.dawnAmt,l),e.uGlow.value=q(u.glowAmt,i.glowAmt,l)*(1+s*2.2),e.uSkyGain.value=q(u.gain,i.gain,l)*(1+s*.55),e.uFlood.value=s,e.uDeep.value=c,e.uWave.value.set(v*3.4-.2,Math.sin(Math.min(1,Math.max(0,v))*Math.PI)*1.1),e}const j=`
  uniform vec3 uSunDir, uSunCol, uZenith, uHorizon, uBelow, uDawnCol, uGlowCol, uAmbTop, uAmbBot;
  uniform float uDawn, uGlow, uSkyGain, uFlood, uDeep; uniform vec2 uWave;
`,X=`
  // the flood: a wave of golden light running out from the sun across the whole sky (uWave: its front, radians from
  // the sun; its strength), clear behind it
  float waveAt(vec3 d){ float a = acos(clamp(dot(d, uSunDir), -1., 1.)), x = a - uWave.x; return uWave.y * (exp(-x * x / (x > 0. ? .012 : .05)) + .06 * smoothstep(.1, -.5, x)); }
  vec3 skyColor(vec3 d){
    float y = d.y, mu = dot(d, uSunDir);
    vec3 zen = uZenith * mix(vec3(1.), vec3(.5, .66, .92), uDeep);   // deep: the high clear blue above the clouds
    vec3 hor = mix(uHorizon, uZenith * vec3(.72, .86, 1.04), uDeep * .78);   // (and the low sky turns blue with it)
    vec3 c = mix(hor, zen, 1. - exp(-max(y, 0.) * 8.5));
    c = mix(c, uBelow, smoothstep(0., -.22, y));
    // the rose of dawn: low along the horizon, strongest toward the sun
    vec2 dh = normalize(d.xz + vec2(1e-5)), sh = normalize(uSunDir.xz + vec2(1e-5));
    float az = dot(dh, sh) * .5 + .5;
    c += uDawnCol * uDawn * exp(-abs(y + .01) * 7.) * (.18 + .82 * az * az * az);
    // the glow round the sun: broad, then tight (Mie)
    float g = max(mu, 0.);
    c += uGlowCol * uGlow * (pow(g, 8.) * .16 + pow(g, 48.) * .45 + pow(g, 420.) * 1.6);
    // the flood: light pours out from the sun across the whole sky
    c = mix(c, uGlowCol * 1.5 + vec3(.2), uFlood * (.05 + .42 * pow(g, 4.)));
    c += vec3(1., .66, .3) * waveAt(d) * .9;
    return c * uSkyGain;
  }
  vec3 sunDisc(vec3 d){ float mu = dot(d, uSunDir); return uSunCol * (smoothstep(.99982, .99993, mu) * 24. + pow(max(mu, 0.), 2400.) * 3.); }
`,Be=new WeakMap;function Pt(e,t){const s=e.renderer,c=Math.round(t*10)/10;let v=Be.get(s);v||Be.set(s,v=new Map);const n=v.get(c);if(n)return n;const u=Ee(je(),c),i=new we,l=[],r=new ut(50,48,24),o=new M({side:it,depthWrite:!1,uniforms:{...u},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`${j}${X}
      varying vec3 vD;
      float hh(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * vn(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
      void main(){
        vec3 d = normalize(vD);
        vec3 c = skyColor(d);
        float sl = dot(c, vec3(.3, .5, .2));
        c = mix(c, vec3(sl) * vec3(.92, .96, 1.05), .5) * mix(1., .62, smoothstep(.05, .5, d.y));   // overhead: quieter, darker
        c += uGlowCol * uSkyGain * (exp(-abs(d.y - .015) * 34.) * .9 + exp(-abs(d.y) * 9.) * .25);   // the band of dawn round the horizon
        c += sunDisc(d) * .05;
        // a skyline of cloud towers all round (gold reflects shapes, not a smooth gradient): lit gold on the side the sun
        // is, pearl and blue-grey in shade; below the horizon a lumpy floor of cloud, bright tops and shaded hollows
        float az = atan(d.x, -d.z);
        float top = -.02 + pow(fbm(vec2(az * 2.4 + 3., 1.7)), 2.) * .62;
        vec3 flat_ = normalize(vec3(d.x, 0., d.z) + vec3(1e-4)), sunH = normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-4));
        float facing = dot(flat_, sunH);
        vec3 lit = uSunCol * .3 + uAmbBot * .75, shade = uAmbTop * .5 + uAmbBot * .3;
        float lum = fbm(vec2(az * 10., d.y * 16.));
        vec3 cloud = mix(shade * 1.4, lit * 1.1, smoothstep(.25, .68, lum) * (.62 + .38 * max(-facing, 0.)));
        float fl = fbm(d.xz / max(-d.y, .06) * .9);
        vec3 ground = mix(shade * .9, lit, smoothstep(.36, .74, fl));
        c = mix(c, cloud, smoothstep(top + .012, top - .012, d.y));
        c = mix(c, mix(cloud, ground, smoothstep(-.02, -.22, d.y)), smoothstep(.0, -.05, d.y));
        gl_FragColor = vec4(c, 1.);
      }`});i.add(new _(r,o)),l.push(r,o);const f=new lt(s),m=f.fromScene(i,.02,.1,100).texture;return f.dispose(),l.forEach(w=>w.dispose()),v.set(c,m),m}const Ve=1,_t=e=>(e.traverse(t=>t.layers.enable(Ve)),e),I=6e4,ve="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",J=`
  uniform mat4 uProjInv, uCamWorld;
  vec3 dirAt(vec2 uv){ vec4 v = uProjInv * vec4(uv * 2. - 1., 1., 1.); return normalize(mat3(uCamWorld) * (v.xyz / v.w)); }
  float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
`,xt=`
  precision highp sampler3D;
  uniform sampler3D uNoise;
  uniform vec4 uSea, uSheet, uCalm; uniform vec4 uBankC[6], uBankR[6]; uniform int uBanks; uniform vec3 uWind;
  float gDetail = 1.;   // the fine erosion, faded with distance (far off it would only alias)
  float gRamp = 3.5;    // how soft a surface is: about a step wide, so a far cloud never aliases between steps
  // where the towers keep away (the cathedral, the stair): 1 inside the box, fading over 40 units
  float calmAt(vec2 xz){ vec2 c = vec2(clamp(xz.x, uCalm.x, uCalm.y), clamp(xz.y, uCalm.z, uCalm.w)); return 1. - smoothstep(0., 40., length(xz - c)); }
  float seaTop(vec2 xz, vec2 at){
    vec2 q = xz * uSea.w;
    float roll = texture(uNoise, vec3(q, .31)).a;
    float tw = texture(uNoise, vec3(q * 1.7 + .27, .73)).g;
    return uSea.x + (roll - .5) * uSea.y + pow(clamp((tw - .52) * 2.3, 0., 1.), 1.7) * uSea.z * (1. - calmAt(at));
  }
  // density 0..1 at p; inside: how deep within (units), for the ambient's shade
  float field(vec3 p, bool fine, out float inside){
    vec3 w = p + uWind;
    float d = 0.; inside = 0.;
    if (uSea.y >= 0.) {
      float h = seaTop(w.xz, p.xz) - p.y;
      if (h > -26.) {
        vec3 q = w * (1. / 95.);
        float s = h + (texture(uNoise, q).r - .42) * 17. + (texture(uNoise, q * .41 + .5).g - .5) * 20.;
        if (fine && s > -8. && s < 10.) s += (texture(uNoise, w * (1. / 24.)).b - .62) * 5. * gDetail;
        d = clamp(s / gRamp, 0., 1.); inside = s;
      }
    }
    for (int i = 0; i < 6; i++) {
      if (i >= uBanks) break;
      vec3 r = (p - uBankC[i].xyz) / uBankR[i].xyz;
      float L = length(r);
      if (L < 1.8) {
        // its billows scale with it: a small bank is a puff, a large one heaps up in cauliflower towers
        float sc = uBankR[i].w; vec3 bq = w / (sc * 1.1) + float(i) * .193;
        float s = (1. - L) * sc + (texture(uNoise, bq * .5).g - .5) * sc * .9 + (texture(uNoise, bq).r - .42) * sc * .45;
        if (fine && s > -8. && s < 10.) s += (texture(uNoise, w * (1. / 22.)).b - .62) * 7. * gDetail;
        float b = clamp(s / max(gRamp, sc * .1), 0., 1.) * uBankC[i].w;
        if (b > d) {d = b; inside = s;}
      }
    }
    if (uSheet.z > 0.) {
      float dy = abs(p.y - uSheet.x);
      if (dy < uSheet.y + 22.) {
        // a second sea, high up: a layer whose top heaps up in billows as the low sea's does, ragged underneath, broken
        // into islands where its cover thins
        vec3 q = w * (1. / 88.) + vec3(.37, .11, .73);
        float cov = texture(uNoise, vec3(w.xz * uSheet.w, .57)).a;
        float top = uSheet.x + uSheet.y + (texture(uNoise, vec3(w.xz * uSheet.w * 2.3, .21)).a - .5) * 12.;
        float h = min(top - p.y, p.y - (uSheet.x - uSheet.y) + (texture(uNoise, q * .7).g - .5) * 8.);
        float s = h + (texture(uNoise, q).r - .42) * 15. + (texture(uNoise, q * .41 + .5).g - .5) * 18. + (cov - .55) * 40.;
        if (fine && s > -6. && s < 9.) s += (texture(uNoise, w * (1. / 22.)).b - .62) * 3.5 * gDetail;
        float b = clamp(s / max(gRamp, 4.), 0., 1.) * uSheet.z;
        if (b > d) {d = b; inside = s;}
      }
    }
    return d;
  }
`,yt=(e,t)=>`
  precision highp float;
  uniform sampler2D uDepth; uniform vec3 uCamPos;
  uniform float uSigma, uDensity, uFogK, uFar, uStepK, uStepMin, uLightStep, uLightGrow, uRampK, uAmbGain, uSunGainC;
  uniform vec2 uSlabA, uSlabB; uniform vec4 uCasterC, uCasterR;
  ${j}${X}${J}${xt}
  varying vec2 vUv;
  float hg(float c, float g){ float g2 = g * g; return (1. - g2) / pow(max(1. + g2 - 2. * g * c, 1e-4), 1.5); }
  // the shadow a great bank casts across the clouds when the sun is behind it (its core, as an ellipsoid)
  float casterLight(vec3 p){
    if (uCasterC.w <= 0.) return 1.;
    vec3 o = (p - uCasterC.xyz) / uCasterR.xyz, d = uSunDir / uCasterR.xyz;
    if (dot(o, o) < 1.3) return 1.;   // (the bank itself is shaded by its own march)
    float tc = max(-dot(o, d) / dot(d, d), 0.);
    return mix(1., smoothstep(.62, 1.02, length(o + d * tc)), uCasterC.w);
  }
  uniform float uInside;
  float lightOD(vec3 p){
    float od = 0., t = 0., st = uLightStep, k;
    for (int i = 0; i < ${t}; i++) { t += st * .5; od += field(p + uSunDir * t, false, k) * st; t += st * .5; st *= uLightGrow; }
    return od * uDensity;
  }
  vec2 slab(vec3 ro, vec3 rd, vec2 Y, float tMax){
    if (Y.y <= Y.x) return vec2(1., 0.);
    if (abs(rd.y) < 1e-5) return (ro.y > Y.x && ro.y < Y.y) ? vec2(0., tMax) : vec2(1., 0.);
    float a = (Y.x - ro.y) / rd.y, b = (Y.y - ro.y) / rd.y;
    return vec2(max(min(a, b), 0.), min(max(a, b), tMax));
  }
  // a bank's bounds: the ellipsoid its noise can reach (radii scaled by k)
  vec2 ellip(vec3 ro, vec3 rd, vec3 c, vec3 r, float tMax){
    vec3 o = (ro - c) / r, d = rd / r;
    float a = dot(d, d), b = dot(o, d), q = b * b - a * (dot(o, o) - 1.);
    if (q < 0.) return vec2(1., 0.);
    q = sqrt(q);
    return vec2(max((-b - q) / a, 0.), min((-b + q) / a, tMax));
  }
  // where there can be cloud along this ray: the sea's slab, the sheet's, each bank's bounds; the march skips the rest
  vec2 iv[8];
  float nextT(float t){
    float best = 1e9;
    for (int i = 0; i < 8; i++) { vec2 I = iv[i]; if (I.y <= I.x || I.y < t) continue; if (I.x <= t) return t; best = min(best, I.x); }
    return best;
  }
  void main(){
    vec3 rd = dirAt(vUv), ro = uCamPos;
    float dep = texture(uDepth, vUv).r;
    float tMax = min(dep, uFar);
    iv[0] = slab(ro, rd, uSlabA, tMax); iv[1] = slab(ro, rd, uSlabB, tMax);
    for (int i = 0; i < 6; i++) iv[i + 2] = i < uBanks ? ellip(ro, rd, uBankC[i].xyz, uBankR[i].xyz * (1.8 + 5. / uBankR[i].w), tMax) : vec2(1., 0.);
    vec3 sky = skyColor(rd);
    vec3 gold = 1. + vec3(.9, .45, .08) * waveAt(rd) * 1.3;   // the flood gilds the clouds as it passes
    float cosT = dot(rd, uSunDir);
    float ph[3];
    float e = 1.;
    for (int o = 0; o < 3; o++) { ph[o] = mix(hg(cosT, -.2 * e), hg(cosT, .64 * e), .58); e *= .5; }
    vec3 col = vec3(0.); float T = 1.;
    float jit = ign(gl_FragCoord.xy) * .55 + .2;   // (half the spread: the ramp already keeps steps from banding)
    float t = uStepMin * jit;
    {
      for (int i = 0; i < ${e}; i++) {
        // jump the air to where cloud can be, landing a jittered fraction of a step in (or every ray enters at the same
        // depth, and the steps show as contour lines)
        float tn = nextT(t);
        if (tn > t) t = tn + clamp(tn * uStepK, uStepMin, 40.) * jit;
        if (t > tMax || T < .01) break;
        float dt = clamp(t * uStepK, uStepMin, 40.);
        vec3 p = ro + rd * t;
        gDetail = 1. - smoothstep(140., 420., t); gRamp = max(3.5, dt * uRampK);
        float inside;
        float d = field(p, true, inside) * uDensity;
        if (d > .003) {
          float od = lightOD(p);
          float ms = 0., a = 1., b = 1.;
          for (int o = 0; o < 3; o++) { ms += b * ph[o] * exp(-od * uSigma * a); a *= .42; b *= .58; }
          float hf = clamp((p.y - uSea.x + 34.) / 64., 0., 1.);
          vec3 amb = mix(uAmbBot, uAmbTop, hf) * uAmbGain * (.62 + .38 * exp(-max(inside, 0.) * .03)) * (1. + uInside * .9) + uSunCol * uInside * .22;   // (inside a cloud: white all round)
          // and the light that has wandered deep into the cloud (inside one, it is bright all round, not grey)
          vec3 L = uSunCol * uSunGainC * (ms + .26 * smoothstep(5., 22., inside) * exp(-od * uSigma * .05)) * casterLight(p) + amb;
          L = mix(L, sky, 1. - exp(-t * uFogK));
          float Tr = exp(-d * uSigma * dt);
          col += T * (1. - Tr) * L * gold;
          T *= Tr;
        }
        t += dt;
      }
    }
    gl_FragColor = vec4(col, 1. - T);
  }`,bt=`
  #include <common>
  varying vec3 vW;
  void main(){
    #include <begin_vertex>
    vec4 w = vec4(transformed, 1.);
    #ifdef USE_INSTANCING
      w = instanceMatrix * w;
    #endif
    w = modelMatrix * w; vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,St=`
  uniform sampler2D uDepth, uCloud; ${j}${J}
  varying vec2 vUv;
  void main(){
    float sky = step(${I/2}., texture(uDepth, vUv).r);
    float mu = max(dot(dirAt(vUv), uSunDir), 0.);
    float w = pow(mu, 6.) * .3 + pow(mu, 40.) * .7;
    // R: the light that gets through; G: all of it, as if nothing were in the way (the shafts are the difference)
    gl_FragColor = vec4((1. - texture(uCloud, vUv).a) * sky * w, w, 0., 1.);
  }`,Ct=e=>`
  uniform sampler2D uMask; uniform vec2 uSunUv; uniform float uDecay, uSpan;
  varying vec2 vUv;
  float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
  void main(){
    vec2 delta = (vUv - uSunUv) * uSpan / ${e}.;
    vec2 uv = vUv - delta * ign(gl_FragCoord.xy);
    vec2 acc = vec2(0.); float ill = 1., ws = 0.;
    for (int i = 0; i < ${e}; i++) { acc += texture(uMask, uv).rg * ill; ws += ill; ill *= uDecay; uv -= delta; }
    gl_FragColor = vec4(acc / ws, 0., 1.);
  }`,At=`
  uniform sampler2D uCloud, uDepth, uRays, uMask; uniform vec2 uLowRes, uSunUv; uniform vec3 uRayCol; uniform float uHaze, uUndo, uAsp, uRaysOn, uGlare, uTapK;
  ${j}${X}${J}
  varying vec2 vUv;
  void main(){
    float d0 = texture(uDepth, vUv).r;
    // depth-aware upsample: of the four low-res texels round this pixel, trust those that saw the same depth
    // (nine taps, a little wider than bilinear: it also smooths the march's per-pixel jitter)
    vec2 lp = vUv * uLowRes - .5, i0 = floor(lp + .5);
    vec4 acc = vec4(0.); float ws = 0.;
    for (int k = 0; k < 9; k++) {
      vec2 o = vec2(float(k - (k / 3) * 3) - 1., float(k / 3) - 1.);
      vec2 tc = (i0 + o + .5) / uLowRes;
      vec2 dd = (i0 + o) - lp;
      float dl = texture(uDepth, tc).r;
      float w = exp(-dot(dd, dd) * uTapK) / (.004 + abs(d0 - dl) / max(min(d0, dl), 1.)) + 1e-6;
      acc += texture(uCloud, tc) * w; ws += w;
    }
    vec4 c = acc / ws;
    vec3 rd = dirAt(vUv);
    float T = 1. - c.a;
    float haze = d0 < ${I/2}. ? 1. - exp(-d0 * uHaze) : 0.;
    vec3 rgb = c.rgb + T * haze * skyColor(rd);
    float a = 1. - T * (1. - haze);
    // the shafts: light where the way to the sun is clear, shadow streaming from every edge that blocks it (carved out
    // of the glow the sky already has, so the air never washes over)
    vec2 sh = texture(uRays, vUv).rg;
    // (a shadow in the air only over the sky: over a thing it would only dirty it)
    rgb += uRayCol * uRaysOn * max(sh.x * 1.15 - sh.y * 1.05, d0 < 30000. ? 0. : -.1) * (1. - c.a * .6);
    // the sun's glare, as much as the sun shows: it spills over the edges of the clouds round it
    vec2 sm = texture(uMask, uSunUv).rg; float vis = sm.y > 1e-3 ? sm.x / sm.y : 0.;
    vec2 gd = (vUv - uSunUv) * vec2(uAsp, 1.); float g2 = dot(gd, gd);
    rgb += uRayCol * uGlare * uRaysOn * vis * (exp(-g2 * 160.) * .9 + exp(-g2 * 16.) * .22);
    float undo = .45 + .55 * smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
    gl_FragColor = vec4(rgb / mix(1., undo, uUndo), a);
  }`,Mt=`
  uniform float uUndo, uAsp, uDisc;
  ${j}${X}${J}
  varying vec2 vUv;
  void main(){
    vec3 rd = dirAt(vUv);
    vec3 c = skyColor(rd) + sunDisc(rd) * uDisc;
    float undo = .45 + .55 * smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
    gl_FragColor = vec4(c / mix(1., undo, uUndo), 1.);
  }`,Ke=typeof location<"u"?new URLSearchParams(location.search):new URLSearchParams,de=Ke.get("hxdbg")??"",L=Object.fromEntries((Ke.get("hxq")??"").split("~").filter(Boolean).map(e=>{const[t,s]=e.split(":");return[t,Number(s)]})),Ge=new WeakMap;function kt(e){let t=Ge.get(e);if(t)return t;const s={type:Te,depthBuffer:!1},c=new Y(1,1,{type:Te,depthBuffer:!0});c.texture.minFilter=c.texture.magFilter=De;const v=new Y(1,1,s);v.texture.minFilter=v.texture.magFilter=De;const n=new Y(1,1,s),u=new Y(1,1,s);for(const i of[n,u])i.texture.minFilter=i.texture.magFilter=qe;return t={depthRT:c,cloudRT:v,maskRT:n,raysRT:u,W:0,H:0,low:new D(1,1),budget:1,ema:16,checked:0,lastNow:0},Ge.set(e,t),t}function Wt(e){const t=e.quality,s=ht(e),c=L.steps??[30,52,64][t],v=L.lsteps??[2,3,4][t],n=L.frac??[.3,.38,.45][t],u=L.cap??[9e4,22e4,3e5][t],i=[14,20,28][t],l=je(),r={uProjInv:{value:new pe},uCamWorld:{value:new pe}},o=kt(e.renderer),{depthRT:f,cloudRT:m,maskRT:w,raysRT:z}=o,b={uNoise:{value:s},uSea:{value:new F(0,18,26,1/700)},uCalm:{value:new F(0,-1,0,-1)},uSheet:{value:new F(70,5,0,1/500)},uBankC:{value:Array.from({length:6},()=>new F)},uBankR:{value:Array.from({length:6},()=>new F(1,1,1,1))},uBanks:{value:0},uWind:{value:new S}},g={...l,...r,...b,uDepth:{value:f.texture},uCamPos:{value:new S},uSigma:{value:.3},uDensity:{value:1},uFogK:{value:1/2600},uFar:{value:3200},uStepK:{value:[.05,.036,.028][t]},uStepMin:{value:[1.3,1,.8][t]},uCasterC:{value:new F},uCasterR:{value:new F(1,1,1,1)},uLightStep:{value:L.lstep??[2.4,1.5,1.1][t]},uLightGrow:{value:L.grow??[3.2,2.7,2.45][t]},uRampK:{value:L.ramp??.9},uAmbGain:{value:1},uInside:{value:0},uSunGainC:{value:1},uSlabA:{value:new D(-60,60)},uSlabB:{value:new D(1,0)}},E=new M({uniforms:g,vertexShader:ve,fragmentShader:yt(c,v),depthTest:!1,depthWrite:!1}),ye=new M({uniforms:{uCam:g.uCamPos},vertexShader:bt,side:We,fragmentShader:"uniform vec3 uCam; varying vec3 vW; void main(){ gl_FragColor = vec4(length(vW - uCam), 0., 0., 1.); }"}),ee=new M({uniforms:{...l,...r,uDepth:g.uDepth,uCloud:{value:m.texture}},vertexShader:ve,fragmentShader:St,depthTest:!1,depthWrite:!1}),W=new M({uniforms:{uMask:{value:w.texture},uSunUv:{value:new D(.5,.5)},uDecay:{value:.965},uSpan:{value:.85}},vertexShader:ve,fragmentShader:Ct(i),depthTest:!1,depthWrite:!1}),A={...l,...r,uCloud:{value:m.texture},uDepth:g.uDepth,uRays:{value:z.texture},uLowRes:{value:new D(1,1)},uRayCol:{value:new y(1,.8,.6)},uHaze:{value:1/900},uUndo:{value:.8},uAsp:{value:1},uRaysOn:{value:1},uMask:{value:w.texture},uSunUv:{value:new D(.5,.5)},uGlare:{value:1},uTapK:{value:L.taps??1.1}},be=new M({uniforms:A,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:At,transparent:!0,depthTest:!1,depthWrite:!1,blending:O,blendSrc:T,blendDst:P,blendSrcAlpha:T,blendDstAlpha:P}),V=new M({uniforms:{...l,...r,uUndo:A.uUndo,uAsp:A.uAsp,uDisc:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .9999, 1.); }",fragmentShader:Mt,depthTest:!1,depthWrite:!1}),K=(a,p)=>{const d=new _(new Q(2,2),a);return d.frustumCulled=!1,d.renderOrder=p,d},te=K(V,-1e3),ae=K(be,900),oe=new M({uniforms:{uVeil:{value:0},uCol:{value:new y("#f5efe6")},uAsp:A.uAsp},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`uniform float uVeil, uAsp; uniform vec3 uCol; varying vec2 vUv;
      void main(){ vec2 q = (vUv - .5) * vec2(uAsp, 1.); float undo = .45 + .55 * smoothstep(1.25, .35, length(q));
        gl_FragColor = vec4(uCol * (1.04 + .1 * exp(-dot(q, q) * 2.)) / undo, 1.) * uVeil; }`,transparent:!0,depthTest:!1,depthWrite:!1,blending:O,blendSrc:T,blendDst:P,blendSrcAlpha:T,blendDstAlpha:P}),ne=K(oe,5e3),se=new we,Se=new Ie,$=K(E,0);se.add($);const Ce=new he;Ce.add(te,ae,ne);let re=!0,ue=1;const Ae=new D(1,1),ie=new S,Me=new S,le=(a,p,d)=>{$.material=p,a.setRenderTarget(d),a.render(se,Se)};function $e(a){if(o.lastNow&&a-o.lastNow<250&&(o.ema=o.ema*.94+(a-o.lastNow)*.06),o.lastNow=a,a-o.checked<1500)return;o.checked=a;const p=o.budget;o.ema>19?o.budget=Math.max(.4,o.budget*.82):o.ema<13.5&&(o.budget=Math.min(1,o.budget*1.12)),o.budget!==p&&(o.W=0)}function He(a,p){if(a!==o.W||p!==o.H){o.W=a,o.H=p,f.setSize(a,p);const d=Math.min(n,Math.sqrt(u*o.budget/Math.max(1,a*p))),h=Math.max(2,Math.round(a*d)),x=Math.max(2,Math.round(p*d));m.setSize(h,x),o.low.set(h,x),w.setSize(Math.max(2,h>>1),Math.max(2,x>>1)),z.setSize(Math.max(2,h>>1),Math.max(2,x>>1))}A.uLowRes.value.copy(o.low)}const Ye=new y(I,I,I),Ze=new y;return te.onBeforeRender=(a,p,d)=>{const h=a.getRenderTarget(),x=h?h.width:a.domElement.width,k=h?h.height:a.domElement.height;h&&$e(performance.now()),He(x,k),A.uAsp.value=x/k,Ae.set(x,k),d.updateMatrixWorld(),r.uProjInv.value.copy(d.projectionMatrixInverse),r.uCamWorld.value.copy(d.matrixWorld),g.uCamPos.value.setFromMatrixPosition(d.matrixWorld);const G=a.getClearColor(Ze),C=a.getClearAlpha(),U=d.layers.mask,ce=p.background;d.layers.set(Ve),p.overrideMaterial=ye,p.background=null,a.setRenderTarget(f),a.setClearColor(Ye,1),a.clear(!0,!0,!1),a.render(p,d),p.overrideMaterial=null,d.layers.mask=U,p.background=ce,a.setClearColor(0,0),re?le(a,E,m):(a.setRenderTarget(m),a.clear(!0,!1,!1)),d.getWorldDirection(Me);const H=xe.smoothstep(Me.dot(l.uSunDir.value),-.1,.35);A.uRaysOn.value=H*ue,A.uRaysOn.value>.001&&(ie.copy(g.uCamPos.value).addScaledVector(l.uSunDir.value,1e3).project(d),W.uniforms.uSunUv.value.set(ie.x*.5+.5,ie.y*.5+.5),A.uSunUv.value.copy(W.uniforms.uSunUv.value),le(a,ee,w),le(a,W,z)),a.setClearColor(G,C),a.setRenderTarget(h)},{group:Ce,sky:l,march:g,comp:A,skyMat:V,cloud:m.texture,screen:Ae,light(a,p=0,d=0,h=0){Ee(l,a,p,d,h),A.uRayCol.value.copy(l.uSunCol.value).multiplyScalar(.3+p*.3);const x=A.uRayCol.value,k=Math.max(x.r,x.g,x.b);k>2&&x.multiplyScalar(2/k)},field(a,p){const d=a.sea,h=a.sheet,x=a.banks??[];b.uSea.value.set(d?.top??0,d?d.roll:-1,d?.towers??0,d?.scale??1/700),a.calm?b.uCalm.value.set(a.calm[0],a.calm[1],a.calm[2],a.calm[3]):b.uCalm.value.set(1e6,1e6,1e6,1e6),b.uSheet.value.set(h?.y??0,h?.half??1,h?.amt??0,h?.scale??1/500),b.uBanks.value=Math.min(6,x.length);let k=1e9,G=-1e9;d&&(k=d.top-d.roll*.5-40,G=d.top+d.roll*.5+d.towers+16),x.slice(0,6).forEach((C,U)=>{b.uBankC.value[U].set(C.at[0],C.at[1],C.at[2],C.amt??1),b.uBankR.value[U].set(C.r[0],C.r[1],C.r[2],Math.min(C.r[0],C.r[1],C.r[2])*.9)}),g.uSlabA.value.set(k,G),h&&h.amt>0?g.uSlabB.value.set(h.y-h.half-24,h.y+h.half+26):g.uSlabB.value.set(1,0),b.uWind.value.set(p*1.1,0,p*.35)},set({density:a=1,rays:p=1,haze:d=1/900,fog:h=1/2600,disc:x=1,sigma:k=.32,amb:G=.8,sun:C=1,on:U=!0,inside:ce=0,veil:H=0}={}){g.uInside.value=ce,oe.uniforms.uVeil.value=H,ne.visible=H>.001,g.uDensity.value=a,ue=p,A.uHaze.value=d,g.uFogK.value=h,V.uniforms.uDisc.value=x,g.uSigma.value=k,g.uAmbGain.value=G,g.uSunGainC.value=C,re=U&&a>.001,de.includes("norays")&&(ue=0),de.includes("noclouds")&&(re=!1),ae.visible=!de.includes("nocomp")},caster(a,p=1){if(!a){g.uCasterC.value.w=0;return}g.uCasterC.value.set(a.at[0],a.at[1],a.at[2],p),g.uCasterR.value.set(a.r[0],a.r[1],a.r[2],1)},warm(a,p){const d=a.getRenderTarget();a.setRenderTarget(m);for(const h of[E,ee,W])$.material=h,a.compileAsync(se,Se).catch(()=>{});a.setRenderTarget(d)},dispose(){for(const a of[E,ye,ee,W,be,V,oe])a.dispose();for(const a of[te,ae,ne,$])a.geometry.dispose()}}}function zt(e,{color:t="#f2cf86",rough:s=.13,leaf:c=.3,lite:v=!1,leafAmt:n=1}={}){const u=new vt({color:t,metalness:1,roughness:s,envMap:e,envMapIntensity:1.2,emissive:new y(t).multiplyScalar(.05)}),i={uLeaf:{value:c},uLeafAmt:{value:n}};return u.onBeforeCompile=l=>{Object.assign(l.uniforms,i),l.vertexShader=l.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLeafP; varying vec3 vLeafN; varying vec3 vNm0; varying vec3 vNm1; varying vec3 vNm2;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vLeafP = position; vLeafN = normal;
        mat3 nmx = normalMatrix;
        #ifdef USE_INSTANCING
          nmx = nmx * mat3(instanceMatrix);
        #endif
        vNm0 = nmx[0]; vNm1 = nmx[1]; vNm2 = nmx[2];`),l.fragmentShader=l.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vLeafP; varying vec3 vLeafN; varying vec3 vNm0; varying vec3 vNm1; varying vec3 vNm2; uniform float uLeaf, uLeafAmt;
      float lh(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
      float lnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(lh(i), lh(i + vec2(1, 0)), f.x), mix(lh(i + vec2(0, 1)), lh(i + vec2(1, 1)), f.x), f.y); }
      // the leaf under this point: its id, how near its edge (0 at a seam), its local coordinates
      vec4 leafAt(out vec2 cid){
        vec3 n = abs(vLeafN); vec2 p = n.z > max(n.x, n.y) ? vLeafP.xy : n.x > n.y ? vLeafP.zy : vLeafP.xz;
        p /= uLeaf;
        float row = floor(p.y); p.x += lh(vec2(row, 7.1)) * .9;      // each row laid a little off the last
        cid = floor(p); vec2 f = fract(p);
        float edge = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y));
        return vec4(f, edge, lh(cid));
      }
      vec2 gLeafCid; vec4 gLeaf;`).replace("#include <color_fragment>",`#include <color_fragment>
        gLeaf = leafAt(gLeafCid);
        float lt = lh(gLeafCid + 3.3);
        diffuseColor.rgb *= mix(vec3(1.), mix(vec3(1.03, .99, .94), vec3(.96, .95, .97), lt), .3 * uLeafAmt);   // a shade apart, leaf by leaf
        diffuseColor.rgb *= 1. - .1 * (1. - smoothstep(.0, .025, gLeaf.z)) * uLeafAmt;                       // the seams, a touch darker`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor * (.8 + .4 * lh(gLeafCid + 9.7) * uLeafAmt) + .12 * (1. - smoothstep(0., .025, gLeaf.z)) * uLeafAmt, .05, 1.);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          mat3 nm = mat3(vNm0, vNm1, vNm2);
          // each leaf a little off flat, crinkled where it was pressed
          vec3 tilt = (vec3(lh(gLeafCid + 1.3), lh(gLeafCid + 5.9), lh(gLeafCid + 2.2)) - .5) * .065;
          vec2 cq = gLeaf.xy * 7.;
          float c0 = lnoise(cq), cx = lnoise(cq + vec2(.05, 0.)), cy = lnoise(cq + vec2(0., .05));
          vec3 crinkle = vec3(cx - c0, cy - c0, 0.) * 2.6;
          vec3 off = nm * (tilt + crinkle * .5);
          normal = normalize(normal + off * uLeafAmt);
        }`)},u.customProgramCacheKey=()=>`hx-gold-${v?1:0}`,Object.assign(u,{leafU:i})}function Tt(){const e=new M({transparent:!0,depthWrite:!1,depthTest:!0,blending:O,blendSrc:T,blendDst:T,uniforms:{uDraw:{value:1},uAmt:{value:1},uCol:{value:new y(1,.82,.52)},uTime:{value:0},uR:{value:.78},uCloud:{value:null},uScreen:{value:new D(1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uDraw, uAmt, uTime, uR; uniform vec3 uCol; uniform sampler2D uCloud; uniform vec2 uScreen; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - .5) * 2.; float r = length(p);
        float ang = fract(atan(p.x, p.y) / 6.28318 + 1.);                 // 0 at the top, clockwise
        float drawn = smoothstep(uDraw + .004, uDraw - .03, ang) * step(.0005, uDraw);
        float head = exp(-pow((ang - uDraw) * 26., 2.)) * step(.001, uDraw) * step(uDraw, .999);
        float dr = r - uR;
        float line = exp(-dr * dr / .00006), glow = exp(-dr * dr / .0016), bloom = exp(-dr * dr / .02);
        float shimmer = .9 + .1 * sin(ang * 6.28318 * 3. + uTime * .7);
        float ring = (line * 1.15 + glow * .42 + bloom * .1) * shimmer;
        float disc = exp(-r * r * 2.6) * .16 * smoothstep(0., 1., uDraw);
        vec3 c = uCol * (ring * (drawn + head * 1.8) + disc);
        c *= smoothstep(1., .9, r) * uAmt;
        c *= 1. - texture2D(uCloud, gl_FragCoord.xy / uScreen).a * .92;
        gl_FragColor = vec4(c, 0.);
      }`}),t=new _(new Q(1,1),e);return t.renderOrder=1100,{mesh:t,U:e.uniforms,dispose(){t.geometry.dispose(),e.dispose()}}}function qt(e,t=!1,s,c=1){const v=ct(.5),n=zt(e,{lite:t,leaf:.3/Math.sqrt(c)}),u=new _(v,n),i=Tt();s&&(i.U.uCloud.value=s.cloud,i.U.uScreen.value=s.screen);const l=new he;l.add(u),l.scale.setScalar(c);const r=new S;return{group:l,mark:u,gold:n,halo:i,placeHalo(o,f=1.42,m=1.1){l.getWorldPosition(r),i.mesh.position.copy(r).sub(o.position).setLength(m).add(r),i.mesh.quaternion.copy(o.quaternion),i.mesh.scale.setScalar(3.9*f*l.scale.x)},dispose(){v.dispose(),n.dispose(),i.dispose()}}}const Dt={top:0,roll:16,towers:26,scale:1/650},Rt=[-48,48,-430,-200],It=(e={})=>({sea:Dt,calm:Rt,...e}),Ot=[{at:[-125,20,-600],r:[70,42,55]},{at:[135,26,-650],r:[80,48,60]},{at:[-76,2,-310],r:[28,15,42],amt:.85},{at:[86,4,-280],r:[30,16,44],amt:.85}],jt=[{at:[-58,74,-436],r:[30,9,24],amt:.8},{at:[62,112,-378],r:[34,10,26],amt:.75},{at:[-44,146,-356],r:[28,8,22],amt:.7}],Et={dawn:16,nave:24,rose:20},Vt={wide:38,tall:58},Kt={u:[0,.14],mark:[4.5,14,0],bank:{at:[0,15,60],r:[44,19,26]}},$t={u:[.14,.3]},Ht={u:[.3,.4],rest:.3,light:[.3,.74],rise:.8},fe={u:[.4,.8],first:.07,last:.93},Yt={y:180,half:8,amt:.95,scale:1/520},Zt={at:[0,185,-400],r:[66,9,66]},Qt={u:[.8,.93],from:[0,185,-378],mid:[2,213,-406],to:[8,217,-432],mark:[26,224.5,-464]},Xt={at:[-560,196,-1800],r:[520,280,260]},Jt={u:[.93,1],cam:[13.5,213,-440],settle:.35,write:.38},ea=(e,t)=>(e-fe.first)/(fe.last-fe.first)*(t-1),Ue={z0:-230,bay:15,bays:8,half:9,spring:20,foot:-18,apex:36,rose:{z:-360,y:24.5,r:8.4}},ta=e=>Ue.z0-e*Ue.bay,Lt=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,Ft=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,B={x:0,y:0,t:-1};function aa(e,t,s){if(B.t!==t){B.t=t;const c=e.pointer.inside&&!Ft&&!Lt;B.x=Re(B.x,c?e.pointer.x:0,2.6,s),B.y=Re(B.y,c?e.pointer.y:0,2.6,s)}return B}const Ne=new S,Bt=new S(0,1,0),me=new pe,Pe=new S,_e=new S;function oa(e,t,s,c,v,n=0,u=1){Ne.copy(s).sub(t).setLength(Math.min(6,t.distanceTo(s))).add(t),e.position.set(t.x,t.y,t.z),me.lookAt(t,s,Bt),Pe.setFromMatrixColumn(me,0),_e.setFromMatrixColumn(me,1),e.position.addScaledVector(Pe,c*.32*u).addScaledVector(_e,v*.2*u),e.up.set(0,1,0),e.lookAt(Ne),e.rotateZ(-c*.016+n)}function na(e,t,s,c,v){const n=Math.tan(xe.degToRad(e.fov/2));return Math.max(s/(2*n*v),t/(2*n*e.aspect*c))}function sa(e,t,s,c,v){if(Math.abs(t)<1e-4&&Math.abs(s)<1e-4){e.clearViewOffset();return}e.setViewOffset(c,v,-t*c/2,s*v/2,c,v)}const ra=e=>{const t=typeof location<"u"?new URLSearchParams(location.search).get(e):null;return t===null?null:Number(t)},ua=()=>Promise.allSettled(['300 100px "Fraunces Variable"','400 100px "Fraunces Variable"','500 100px "Inter Variable"','600 100px "Inter Variable"','400 100px "Amiri"','700 100px "Amiri"','600 100px "Cairo Variable"'].map(e=>document.fonts.load(e)));export{fe as A,Ot as B,Kt as D,Vt as F,Xt as M,$t as N,Ht as R,Yt as S,Zt as T,jt as W,Wt as a,Nt as b,Lt as c,Ue as d,sa as e,It as f,qt as g,na as h,ea as i,Qt as j,ua as k,oa as l,_t as m,Jt as n,zt as o,aa as p,ra as q,j as r,Pt as s,X as t,ta as u,Et as v};
