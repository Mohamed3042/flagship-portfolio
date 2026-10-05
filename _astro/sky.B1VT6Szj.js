import{b5 as j,aG as A,b6 as B,a4 as I,aa as U,i as x,M as d,a as k,S as b,b7 as E,u as z,V as l,aF as q,b8 as O,aB as V,a6 as Z,aj as L,ai as M,b9 as H,aO as Q,b as $,O as K,C as J}from"./EditionWorld.astro_astro_type_script_index_0_lang.D3E1zgZp.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const f=64,X=`
  uniform float uZ; varying vec2 vUv;
  vec3 hash3(vec3 p){
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123);
  }
  // gradient noise on a lattice that wraps every P cells, so the tile repeats seamlessly
  float grad(vec3 x, float P){
    vec3 i = floor(x), f = fract(x), u = f * f * f * (f * (f * 6. - 15.) + 10.);
    #define G(o) dot(hash3(mod(i + o, P)) * 2. - 1., f - o)
    return mix(mix(mix(G(vec3(0, 0, 0)), G(vec3(1, 0, 0)), u.x), mix(G(vec3(0, 1, 0)), G(vec3(1, 1, 0)), u.x), u.y),
               mix(mix(G(vec3(0, 0, 1)), G(vec3(1, 0, 1)), u.x), mix(G(vec3(0, 1, 1)), G(vec3(1, 1, 1)), u.x), u.y), u.z);
  }
  float cell(vec3 x, float P){
    vec3 i = floor(x), f = fract(x); float d = 9.;
    for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) for (int c = -1; c <= 1; c++) {
      vec3 o = vec3(a, b, c), r = o + hash3(mod(i + o, P)) - f; d = min(d, dot(r, r));
    }
    return sqrt(d);
  }
  void main(){
    vec3 p = vec3(vUv, uZ);
    float n = 0., m = 0., a = .5, f = 4.;
    for (int k = 0; k < 5; k++){ n += a * grad(p * f, f); m += a * grad(p * f + 17.3, f); f *= 2.; a *= .5; }
    float w = 0.; a = .55; f = 4.;
    for (int k = 0; k < 3; k++){ w += a * (1. - cell(p * f, f)); f *= 2.; a *= .5; }
    gl_FragColor = vec4(clamp(n * .9 + .5, 0., 1.), clamp(w / .96, 0., 1.), clamp(m * .9 + .5, 0., 1.), 1.);
  }`,R=new WeakMap;function Y(e){const o=R.get(e);if(o)return o;const a=new j(f,f,f,{depthBuffer:!1,type:B,format:A}),t=a.texture;t.wrapS=t.wrapT=t.wrapR=I,t.minFilter=t.magFilter=U,t.generateMipmaps=!1;const r=new x({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:X,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),n=new d(new k(2,2),r);n.frustumCulled=!1;const s=new b,i=new E;s.add(n);const u=e.getRenderTarget();for(let p=0;p<f;p++)r.uniforms.uZ.value=(p+.5)/f,e.setRenderTarget(a,p),e.render(s,i);return e.setRenderTarget(u),r.dispose(),n.geometry.dispose(),R.set(e,t),t}const ee=`
  float nR(vec3 p){ return texture(uNoise, p).r; }
  float nG(vec3 p){ return texture(uNoise, p).g; }
  float fbm4(vec3 p){ return (nR(p) * .5 + nR(p * 2.03 + .31) * .25 + nR(p * 4.07 + .67) * .125 + nR(p * 8.11 + .19) * .0625) / .9375; }
`,ae=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,c={x:0,y:0,t:-1};function pe(e,o,a){if(c.t!==o){c.t=o;const t=e.pointer.inside&&!ae;c.x=z(c.x,t?e.pointer.x:0,2.5,a),c.y=z(c.y,t?e.pointer.y:0,2.5,a)}return c}function te(e,o){const a=new d(new k(2,2),e);return a.frustumCulled=!1,a.renderOrder=o,a}const oe="varying vec2 vNdc; void main(){ vNdc = position.xy; gl_Position = vec4(position.xy, .9999, 1.); }",re=`
  float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
  float h31(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
`,w=new l,G=new l;function ve(e,o,a){return e.updateMatrixWorld(),e.getWorldDirection(G),w.copy(e.position).add(o).project(e),a.set(w.x,w.y,G.dot(o)>0?1:-1)}const ne=`
  uniform sampler3D uNoise; varying vec3 vDir;
  ${ee}
  void main(){
    vec3 d = normalize(vDir);
    // the galaxy's band rises from behind the opening's planet (its core hidden there) up through the sky the opening
    // looks up into (path.ts): soft and cool, never a brown smoke
    vec3 pole = normalize(vec3(.7245, -.6367, -.2619)), core = normalize(vec3(-.45, -.15, -.88));
    float lat = dot(d, pole), toCore = max(dot(d, core), 0.);
    vec3 q = d * .46;
    vec3 w = vec3(fbm4(q * 1.6 + .3), fbm4(q * 1.6 + .71), fbm4(q * 1.6 + .13)) - .5;
    float band = exp(-lat * lat / (2. * .12 * .12)), halo = exp(-lat * lat / (2. * .3 * .3));
    float cloud = fbm4(q * 2.4 + w * .7);
    float lanes = smoothstep(.5, .64, fbm4(q * 4.3 + w * 1.2 + 2.)) * smoothstep(.42, .6, fbm4(q * 9. + w + 5.));
    vec3 col = vec3(.0011, .0011, .0022);
    // faint cirrus everywhere, violet and rose: the sky is never an empty black with dots on it
    float cir = fbm4(q * 1.9 + w * 1.2 + 11.);
    col += mix(vec3(.1, .07, .24), vec3(.24, .07, .15), fbm4(q * 1.1 + 3.)) * pow(cir, 3.) * .022;
    // the band: a soft cool glow, pearl toward its far core (warm tints at this faintness read as brown: none)
    vec3 bandCol = mix(vec3(.42, .43, .74), vec3(.8, .76, .9), pow(toCore, 4.));
    col += bandCol * band * (.3 + .7 * smoothstep(.38, .72, cloud)) * (.028 + .05 * pow(toCore, 8.));
    col += bandCol * halo * smoothstep(.3, .8, cloud) * (.006 + .016 * pow(toCore, 6.));
    col *= 1. - lanes * band * .85;                              // dark dust lanes across it
    // far emission nebulae: rose and violet, here and there; ember only where they are bright
    float neb = smoothstep(.56, .82, fbm4(q * 1.25 + w * 1.7 + 7.3));
    vec3 nebCol = mix(vec3(.62, .13, .34), vec3(.3, .14, .66), smoothstep(.35, .65, fbm4(q * 3. + 1.)));
    float hot = pow(fbm4(q * 6. + w * 2.), 2.);
    nebCol = mix(nebCol, vec3(1., .46, .3), smoothstep(.66, .86, fbm4(q * 2.3 + 4.)) * smoothstep(.3, .5, hot) * .6);
    col += nebCol * neb * (.012 + .05 * hot);
    // two far galaxies, small tilted spirals of light
    for (int i = 0; i < 2; i++) {
      vec3 at = i == 0 ? normalize(vec3(.55, .32, -.77)) : normalize(vec3(-.3, -.42, .86));
      vec3 ax = normalize(cross(at, vec3(.2, 1., .1))), ay = cross(at, ax);
      vec2 g = vec2(dot(d, ax), dot(d, ay)) / (i == 0 ? .028 : .018);
      g = mat2(.8, .6, -.6, .8) * g; g.y *= 2.6;
      float r = length(g), a = atan(g.y, g.x);
      float arms = .55 + .45 * sin(a * 2. - log(r + .05) * 4.5);
      col += vec3(1., .86, .7) * exp(-r * 2.6) * (.18 * exp(-r * 6.) + .05 * arms) * step(0., dot(d, at));
    }
    gl_FragColor = vec4(col, 1.);
  }`,se=`
  uniform samplerCube uSky; uniform mat4 uProjInv, uCamWorld; uniform vec3 uWarpDir; uniform float uWarp, uStars, uLevel, uSplit;
  varying vec2 vNdc;
  ${re}
  // the stars: cells on the cube's faces, one star at most in each; three populations (rare bright, some, many faint)
  vec3 starCol(float h){ return mix(vec3(1., .72, .5), mix(vec3(1., .96, .9), vec3(.72, .82, 1.), smoothstep(.5, 1., h)), smoothstep(0., .45, h)); }
  vec3 stars(vec3 d, float px){
    vec3 a = abs(d); vec2 uv; float face;
    if (a.x >= a.y && a.x >= a.z) { uv = d.yz / a.x; face = d.x > 0. ? 0. : 1.; }
    else if (a.y >= a.z) { uv = d.xz / a.y; face = d.y > 0. ? 2. : 3.; }
    else { uv = d.xy / a.z; face = d.z > 0. ? 4. : 5.; }
    float band = exp(-pow(dot(d, normalize(vec3(.7245, -.6367, -.2619))), 2.) / (2. * .14 * .14));
    vec3 acc = vec3(0.);
    for (int L = 0; L < 3; L++) {
      float N = L == 0 ? 60. : L == 1 ? 190. : 520.;
      vec2 g = (uv * .5 + .5) * N, c = floor(g), f = g - c;
      vec2 k = c + face * 977. + float(L) * 131.;
      // most of them faint, gathered along the band; only a few bright ones anywhere
      float dens = (L == 0 ? .16 : L == 1 ? .07 : .05) * (L == 2 ? mix(.1, 2.4, band) : mix(.6, 1.5, band));
      if (h21(k) > dens) continue;
      vec2 o = .22 + .56 * h22(k + 3.7);
      float b = L == 0 ? .12 + 1.6 * pow(h21(k + 9.1), 9.) : L == 1 ? .05 + .22 * pow(h21(k + 9.1), 4.) : .02 + .035 * h21(k + 9.1);
      float cellPx = N * px;                                  // how many cells a pixel spans (N cells across a face)
      vec2 dp = (f - o) / max(cellPx, 1e-5);                  // distance to the star in pixels
      float s = .55 + min(b, 1.5) * .9;
      acc += starCol(h21(k + 5.3)) * b * exp(-dot(dp, dp) / (s * s));
    }
    return acc;
  }
  vec3 dirAt(vec2 ndc){ vec4 v = uProjInv * vec4(ndc, 1., 1.); return normalize(mat3(uCamWorld) * (v.xyz / v.w)); }
  void main(){
    vec3 dir = dirAt(vNdc);
    float px = length(fwidth(dir)) * .5;                      // a pixel's size on the face (≈ radians / 2)
    vec3 col;
    if (uWarp < .002) col = texture(uSky, dir).rgb + stars(dir, px) * uStars;
    else {
      // the jump: every direction smeared toward the point ahead (a zoom blur of the whole sky); along each streak the
      // light parts into its colours, blue-white at the star, red at the far end (the chromatic shift)
      // (each pixel starts its samples at its own offset, so a streak reads as one line of light, never a row of beads)
      col = vec3(0.); vec3 peak = vec3(0.);
      float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))));   // interleaved gradient noise: even, never clumped
      for (int i = 0; i < WARP_N; i++) {
        float k = (float(i) + j) / float(WARP_N);
        vec3 ds = normalize(mix(dir, uWarpDir, k * uWarp * .45));
        vec3 c = (texture(uSky, ds).rgb + stars(ds, px * (1. + uWarp * 2.)) * uStars) * mix(vec3(.75, .95, 1.3), vec3(1.35, .9, .65), mix(.5, k, uSplit));
        col += c; peak = max(peak, c);
      }
      col = mix(col / float(WARP_N), peak, .4) * (1. + uWarp * .9);
    }
    gl_FragColor = vec4(col * uLevel, 1.);
  }`,P=new WeakMap;function ie(e,o){const a=P.get(e);if(a)return a;const t=Y(e),r=[512,768,1024][o],n=new O(r,{type:Z,generateMipmaps:!0,minFilter:V}),s=new x({side:L,depthWrite:!1,uniforms:{uNoise:{value:t}},fragmentShader:ne,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }"}),i=new d(new M(40,96,48),s),u=new b;u.add(i);const p=e.getRenderTarget();new H(.1,100,n).update(e,u);const m=new b,S=new x({side:L,depthWrite:!1,uniforms:{uSky:{value:n.texture}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform samplerCube uSky; varying vec3 vDir; void main(){ gl_FragColor = vec4(texture(uSky, normalize(vDir)).rgb * 2.5, 1.); }"}),g=new d(new M(40,48,24),S);m.add(g);const h=(v,N,_,T,F)=>{const y=new d(new k(T,F),new $({color:new J(v).multiplyScalar(N),side:K}));y.position.copy(_),y.lookAt(0,0,0),m.add(y)};h("#ffd2a0",60,new l(-14,8,-30),3.2,3.2),h("#ffb070",3.5,new l(0,-9,-30),60,2.4),h("#8fb6ff",1.2,new l(0,-24,10),60,18),h("#f2c890",1.6,new l(26,14,18),10,18);const C=new Q(e),D=C.fromScene(m,0,.1,100).texture;C.dispose(),e.setRenderTarget(p),s.dispose(),i.geometry.dispose(),g.geometry.dispose(),S.dispose(),m.traverse(v=>{v.isMesh&&v!==g&&(v.geometry.dispose(),v.material.dispose())});const W={cube:n,env:D,noise:t};return P.set(e,W),W}const ce=e=>ie(e.renderer,e.quality);function fe(e){const{cube:o}=ce(e),a=new x({vertexShader:oe,fragmentShader:se,depthTest:!1,depthWrite:!1,defines:{WARP_N:[10,14,20][e.quality]},uniforms:{uSky:{value:o.texture},uProjInv:{value:new q},uCamWorld:{value:new q},uWarp:{value:0},uWarpDir:{value:new l(0,0,-1)},uStars:{value:1},uLevel:{value:1},uSplit:{value:1}}}),t=te(a,-1e3),r=a.uniforms;return t.onBeforeRender=(n,s,i)=>{r.uProjInv.value.copy(i.projectionMatrixInverse),r.uCamWorld.value.copy(i.matrixWorld)},{mesh:t,uniforms:r,warp(n,s){r.uWarp.value=n,s&&r.uWarpDir.value.copy(s)},dispose(){a.dispose(),t.geometry.dispose()}}}export{ee as G,oe as Q,te as a,ce as b,re as c,ve as d,pe as p,fe as s};
