import{bI as ne,b6 as le,b3 as ie,N as ce,y as ue,b as M,M as z,a as F,S as N,bg as de,a6 as j,j as p,T,bJ as ve,K as fe,H as pe,a8 as V,ap as U,bK as me,bc as he,e as we,$ as ge,C as b,ao as H,G as E,s as $,A as Y,q as xe,aa as be,aE as ye}from"./EditionWorld.astro_astro_type_script_index_0_lang.BWtOGfLb.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const L=64,Se=`
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
  }`,O=new WeakMap;function ke(e){const a=O.get(e);if(a)return a;const o=new ne(L,L,L,{depthBuffer:!1,type:ie,format:le}),t=o.texture;t.wrapS=t.wrapT=t.wrapR=ce,t.minFilter=t.magFilter=ue,t.generateMipmaps=!1;const s=new M({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:Se,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),r=new z(new F(2,2),s);r.frustumCulled=!1;const i=new N,d=new de;i.add(r);const w=e.getRenderTarget();for(let n=0;n<L;n++)s.uniforms.uZ.value=(n+.5)/L,e.setRenderTarget(o,n),e.render(i,d);return e.setRenderTarget(w),s.dispose(),r.geometry.dispose(),O.set(e,t),t}const J=`
  float nR(vec3 p){ return texture(uNoise, p).r; }
  float nG(vec3 p){ return texture(uNoise, p).g; }
  float fbm4(vec3 p){ return (nR(p) * .5 + nR(p * 2.03 + .31) * .25 + nR(p * 4.07 + .67) * .125 + nR(p * 8.11 + .19) * .0625) / .9375; }
`,Ce=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,C={x:0,y:0,t:-1};function Te(e,a,o){if(C.t!==a){C.t=a;const t=e.pointer.inside&&!Ce;C.x=j(C.x,t?e.pointer.x:0,2.5,o),C.y=j(C.y,t?e.pointer.y:0,2.5,o)}return C}function G(e,a){const o=new z(new F(2,2),e);return o.frustumCulled=!1,o.renderOrder=a,o}const _="varying vec2 vNdc; void main(){ vNdc = position.xy; gl_Position = vec4(position.xy, .9999, 1.); }",X=`
  float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
  float h31(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
`,R=new p,Z=new p;function Re(e,a,o){return e.updateMatrixWorld(),e.getWorldDirection(Z),R.copy(e.position).add(a).project(e),o.set(R.x,R.y,Z.dot(a)>0?1:-1)}const qe=`
  uniform sampler3D uNoise; varying vec3 vDir;
  ${J}
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
    col += mix(vec3(.22, .11, .05), vec3(.26, .1, .08), fbm4(q * 1.1 + 3.)) * pow(cir, 3.) * .022;
    // the band: a soft cool glow, pearl toward its far core (warm tints at this faintness read as brown: none)
    vec3 bandCol = mix(vec3(.8, .5, .28), vec3(1., .86, .64), pow(toCore, 4.)) * 1.25;
    col += bandCol * band * (.3 + .7 * smoothstep(.38, .72, cloud)) * (.028 + .05 * pow(toCore, 8.));
    col += bandCol * halo * smoothstep(.3, .8, cloud) * (.006 + .016 * pow(toCore, 6.));
    col *= 1. - lanes * band * .85;                              // dark dust lanes across it
    // far emission nebulae: rose and violet, here and there; ember only where they are bright
    float neb = smoothstep(.56, .82, fbm4(q * 1.25 + w * 1.7 + 7.3));
    vec3 nebCol = mix(vec3(.7, .3, .16), vec3(.62, .36, .3), smoothstep(.35, .65, fbm4(q * 3. + 1.)));
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
  }`,ze=`
  uniform samplerCube uSky; uniform mat4 uProjInv, uCamWorld; uniform vec3 uWarpDir; uniform float uWarp, uStars, uLevel, uSplit;
  varying vec2 vNdc;
  ${X}
  // the stars: cells on the cube's faces, one star at most in each; three populations (rare bright, some, many faint)
  vec3 starCol(float h){ return mix(vec3(1., .72, .5), mix(vec3(1., .96, .9), vec3(1., .93, .84), smoothstep(.5, 1., h)), smoothstep(0., .45, h)); }
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
        vec3 c = (texture(uSky, ds).rgb + stars(ds, px * (1. + uWarp * 2.)) * uStars) * mix(vec3(1., .95, .88), vec3(1.3, .88, .62), mix(.5, k, uSplit));
        col += c; peak = max(peak, c);
      }
      col = mix(col / float(WARP_N), peak, .4) * (1. + uWarp * .9);
    }
    gl_FragColor = vec4(col * uLevel, 1.);
  }`,K=new WeakMap;function Me(e,a){const o=K.get(e);if(o)return o;const t=ke(e),s=[512,768,1024][a],r=new ve(s,{type:pe,generateMipmaps:!0,minFilter:fe}),i=new M({side:V,depthWrite:!1,uniforms:{uNoise:{value:t}},fragmentShader:qe,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }"}),d=new z(new U(40,96,48),i),w=new N;w.add(d);const n=e.getRenderTarget();new me(.1,100,r).update(e,w);const y=new N,m=new M({side:V,depthWrite:!1,uniforms:{uSky:{value:r.texture}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform samplerCube uSky; varying vec3 vDir; void main(){ gl_FragColor = vec4(texture(uSky, normalize(vDir)).rgb * 2.5, 1.); }"}),g=new z(new U(40,48,24),m);y.add(g);const S=(h,c,l,q,v)=>{const f=new z(new F(q,v),new we({color:new b(h).multiplyScalar(c),side:ge}));f.position.copy(l),f.lookAt(0,0,0),y.add(f)};S("#ffd2a0",60,new p(-14,8,-30),3.2,3.2),S("#ffb070",3.5,new p(0,-9,-30),60,2.4),S("#c99a72",1.2,new p(0,-24,10),60,18),S("#f2c890",1.6,new p(26,14,18),10,18);const W=new he(e),A=W.fromScene(y,0,.1,100).texture;W.dispose(),e.setRenderTarget(n),i.dispose(),d.geometry.dispose(),g.geometry.dispose(),m.dispose(),y.traverse(h=>{h.isMesh&&h!==g&&(h.geometry.dispose(),h.material.dispose())});const x={cube:r,env:A,noise:t};return K.set(e,x),x}const D=e=>Me(e.renderer,e.quality);function Ne(e){const{cube:a}=D(e),o=new M({vertexShader:_,fragmentShader:ze,depthTest:!1,depthWrite:!1,defines:{WARP_N:[10,14,20][e.quality]},uniforms:{uSky:{value:a.texture},uProjInv:{value:new T},uCamWorld:{value:new T},uWarp:{value:0},uWarpDir:{value:new p(0,0,-1)},uStars:{value:1},uLevel:{value:1},uSplit:{value:1}}}),t=G(o,-1e3),s=o.uniforms;return t.onBeforeRender=(r,i,d)=>{s.uProjInv.value.copy(d.projectionMatrixInverse),s.uCamWorld.value.copy(d.matrixWorld)},{mesh:t,uniforms:s,warp(r,i){s.uWarp.value=r,i&&s.uWarpDir.value.copy(i)},dispose(){o.dispose(),t.geometry.dispose()}}}const We=`
  uniform vec2 uStar; uniform float uStarVis, uAspect, uTime, uSlide, uFrost, uFlash, uShake, uHaze, uRoll, uPortrait;
  uniform vec2 uBend;
  varying vec2 vNdc;
  ${X}
  float drops(vec2 p, float scale, float dens, vec2 toStar, out float rim){
    vec2 g = p * scale, c = floor(g), f = fract(g) - .5;
    float h = h21(c);
    rim = 0.;
    if (h > dens) return 0.;
    vec2 o = (h22(c + 4.1) - .5) * .5;
    float r = .1 + .22 * h21(c + 2.3);
    vec2 d = f - o;
    float k = length(d) / r;
    float body = smoothstep(1., .75, k);
    // the bright crescent on the side facing the star, a dark one opposite (a bead of water bends the light)
    rim = body * smoothstep(.45, 1., k) * max(dot(normalize(d + 1e-4), toStar), 0.);
    return body;
  }
  void main(){
    vec2 q = vNdc * vec2(uAspect, 1.);
    vec2 sq = uStar * vec2(uAspect, 1.);
    vec2 toStar = normalize(sq - q + 1e-4);
    float edge = clamp(max(abs(vNdc.x), abs(vNdc.y) * mix(1., .8, uPortrait)), 0., 1.);
    float low = smoothstep(.2, -1., vNdc.y);
    float wet = smoothstep(.45, 1., edge) * .8 + low * .55;                     // condensation gathers at the frame and low down
    vec3 col = vec3(0.);
    float rim1, rim2;
    vec2 shakeOff = vec2(0., -uShake * .04);
    float d1 = drops(q + shakeOff * .5, 26., .16 * wet, toStar, rim1);
    float d2 = drops(q + shakeOff + 7.7, 61., .26 * wet, toStar, rim2);
    vec3 warm = vec3(1., .82, .58);
    float starLight = .25 + .75 * uStarVis;
    col += warm * (rim1 * .22 + rim2 * .12) * starLight;
    col += vec3(.9, .78, .62) * (d1 * .018 + d2 * .012);                      // the beads' own faint body
    // a mist on the glass: warm, densest low and round the star
    float sd = length(q - sq);
    col += vec3(.85, .55, .32) * (exp(-sd * 2.4) * .12 + exp(-sd * .7) * .02) * uStarVis * uHaze;
    col += vec3(.42, .3, .22) * (low * .018 + wet * .01) * uHaze;
    // two broad reflections across the canopy, sliding as the ship turns
    float s = uSlide;
    float b1 = exp(-pow((q.x * .78 + q.y * .62 - .35 + s) * 3.2, 2.)), b2 = exp(-pow((q.x * .6 - q.y * .8 + .9 - s * .7) * 5.5, 2.));
    col += vec3(.95, .86, .72) * (b1 * .032 + b2 * .022) * (.6 + .4 * uStarVis);
    // frost streaks, bent by the acceleration (the slingshot)
    if (uFrost > .001) {
      vec2 dir = normalize(vec2(1., .25) + uBend);
      vec2 r = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x)));
      r.y += r.x * r.x * uBend.y * .4;
      float line = h21(vec2(floor(r.y * 140.), 3.));
      float len = smoothstep(.0, .3, fract(r.x * .7 + line * 3. - uTime * .05));
      float streak = smoothstep(.985, 1., line) * len * smoothstep(.2, 1., edge + low * .6);
      col += vec3(1., .9, .78) * streak * .22 * uFrost;
    }
    // the shaken dust: specks that flare and fall when the clamps lock
    if (uShake > .001) {
      vec2 g = q * 90. + vec2(0., uTime * 2.), c = floor(g);
      float spark = step(.992, h21(c)) * smoothstep(.5, .05, length(fract(g) - .5));
      col += vec3(1., .88, .66) * spark * uShake * 1.6;
    }
    col += vec3(.95, .72, .45) * uFlash * (.06 + .14 * edge);                 // the dull flash of the lock
    gl_FragColor = vec4(col, 1.);
  }`,Ae=new b("#c9ccd1"),Be=new b("#c8783a"),Q=new b("#2e2a26");function Fe(e,{copper:a=!0}={}){const{env:o}=D(e),t=new H({color:"#c9ccd1",metalness:1,roughness:.2,envMap:o,envMapIntensity:1.5}),s=new H({color:"#c8783a",metalness:1,roughness:.28,envMap:o,envMapIntensity:1.4}),r=new E,i=new E;r.add(i);const d=new M({vertexShader:_,fragmentShader:We,transparent:!0,depthTest:!1,depthWrite:!1,blending:Y,uniforms:{uStar:{value:new $(0,2)},uStarVis:{value:0},uAspect:{value:1},uTime:{value:0},uSlide:{value:0},uFrost:{value:0},uFlash:{value:0},uShake:{value:0},uHaze:{value:1},uBend:{value:new $},uRoll:{value:0},uPortrait:{value:0}}}),w=G(d,1900),n=d.uniforms;let y="",m=null;const g=[];function S(c){const l=`${c.fov}:${c.aspect.toFixed(3)}`;if(l===y)return;y=l;for(const u of g)u.dispose();g.length=0,i.clear();const q=-1,v=Math.tan(xe.degToRad(c.fov/2)),f=v*c.aspect,k=c.aspect<1,B=v*(k?.006:.0085),P=(u,ee,te)=>{const ae=new be(u.map(([oe,se,re])=>new p(oe*f,se*v,q*re))),I=new ye(ae,64,ee,10,!1);g.push(I),i.add(new z(I,te))};for(const u of[-1,1])P([[u*1.25,-1.35,.7],[u*(k?.99:.93),-.55,.96],[u*(k?.95:.86),.35,1],[u*(k?.82:.7),.92,.96],[u*.35,1.25,.85]],B*1.6,t),P([[u*1.2,-1.3,.74],[u*(k?.955:.885),-.5,.98],[u*(k?.91:.81),.32,1],[u*(k?.78:.655),.86,.98]],B*.7,a&&u>0?s:t);P([[-1.3,1.02,.8],[-.5,.9,.98],[0,.885,1],[.5,.9,.98],[1.3,1.02,.8]],B*1.2,t),P([[-1.3,-.88,.8],[-.4,-.97,.97],[0,-.985,1],[.4,-.97,.97],[1.3,-.88,.8]],B*1.4,t);for(const u of[-1,1])P([[u*.62,.9,.99],[u*.7,.99,.95],[u*.8,1.1,.9]],B*.9,t)}let W=0,A=null;const x=new p,h=new p;return{group:r,glass:w,uniforms:n,attach(c,l){m=c,c.parent||l.add(c),c.add(r),l.add(w),S(c)},update(c,l={}){if(!m)return;S(m),m.updateMatrixWorld(),m.getWorldDirection(x);const q=Math.atan2(x.x,-x.z)+x.y*.6;if(A!==null){let f=q-A;f>Math.PI&&(f-=Math.PI*2),f<-Math.PI&&(f+=Math.PI*2),W+=f*.9}if(A=q,n.uSlide.value=W+Math.sin(c*.11)*.04,n.uTime.value=c,n.uAspect.value=m.aspect,n.uPortrait.value=m.aspect<1?1:0,l.star){h.copy(m.position).add(l.star).project(m);const f=x.dot(l.star)>0;n.uStar.value.set(h.x,h.y),n.uStarVis.value=f?(l.starVis??1)*Math.max(0,1-Math.max(0,Math.max(Math.abs(h.x),Math.abs(h.y))-1.1)/.8):0}else n.uStarVis.value=0;n.uFrost.value=l.frost??0,n.uBend.value.set(l.bendX??0,l.bendY??0),n.uFlash.value=l.flash??0,n.uShake.value=l.shake??0,n.uHaze.value=l.haze??1;const v=l.ribs??1;i.visible=v>.55,i.scale.set(1+(1-v)*.6,1+(1-v)*.6,1),t.color.copy(Ae).lerp(Q,1-v),s.color.copy(Be).lerp(Q,1-v),t.roughness=.2+(1-v)*.35,s.roughness=.28+(1-v)*.3},dispose(){for(const c of g)c.dispose();t.dispose(),s.dispose(),d.dispose(),w.geometry.dispose()}}}const Pe=`
  uniform sampler3D uNoise; uniform mat4 uProjInv, uCamWorld;
  uniform vec3 uPole, uStar, uCloud, uBandA, uBandB, uCloudA, uCloudB;
  uniform float uBand, uBandW, uCloudAmt, uCloudSize, uTime, uLevel;
  varying vec2 vNdc;
  ${J}
  vec3 dirAt(vec2 ndc){ vec4 v = uProjInv * vec4(ndc, 1., 1.); return normalize(mat3(uCamWorld) * (v.xyz / v.w)); }
  void main(){
    vec3 d = dirAt(vNdc);
    vec3 col = vec3(0.);
    vec3 drift = vec3(uTime * .004, uTime * -.0025, uTime * .003);
    if (uBand > 0.) {
      float lat = dot(d, uPole);
      float toStar = max(dot(d, uStar), 0.);
      float n = fbm4(d * 1.6 + drift + 3.1), fine = fbm4(d * 6.5 - drift * 2. + 9.);
      float band = exp(-lat * lat / (2. * uBandW * uBandW)) * (.55 + .45 * n) * (.65 + .7 * fine);
      col += mix(uBandA, uBandB, pow(toStar, 3.)) * band * (.35 + 1.3 * pow(toStar, 2.)) * uBand;
    }
    if (uCloudAmt > 0.) {
      float a = acos(clamp(dot(d, uCloud), -1., 1.)) / uCloudSize;
      if (a < 1.6) {
        vec3 q = d * 2.2 + drift * 1.5;
        vec3 w = vec3(fbm4(q + .3), fbm4(q + .71), fbm4(q + .13)) - .5;
        float b = fbm4(q * 1.4 + w * 1.6);
        float shape = smoothstep(1.5, .2, a + (b - .5) * 1.1);
        float dens = smoothstep(.38, .75, b) * shape;
        float lit = .4 + .6 * smoothstep(-.2, .6, dot(normalize(d - uCloud + 1e-4), uStar) + (fbm4(q * 3. + 5.) - .5));
        float hot = pow(fbm4(q * 3.4 - w), 2.) * dens;
        col += mix(uCloudB, uCloudA, lit) * dens * (.25 + .75 * lit) * uCloudAmt + uCloudA * hot * .6 * uCloudAmt;
        col *= 1. - smoothstep(.62, .8, fbm4(q * 5. + 2.)) * shape * .5;     // dark dust threads across it
      }
    }
    gl_FragColor = vec4(col * uLevel, 1.);
  }`;function Ge(e,a={}){const{noise:o}=D(e),t=new M({vertexShader:_,fragmentShader:Pe,depthTest:!1,depthWrite:!1,transparent:!0,blending:Y,uniforms:{uNoise:{value:o},uProjInv:{value:new T},uCamWorld:{value:new T},uPole:{value:(a.bandPole??new p(.2,1,.15)).clone().normalize()},uStar:{value:(a.star??new p(-.5,.2,-1)).clone().normalize()},uCloud:{value:(a.cloudAt??new p(0,0,-1)).clone().normalize()},uBandA:{value:new b(a.bandA??"#5a2c14")},uBandB:{value:new b(a.bandB??"#f2d9b0")},uCloudA:{value:new b(a.cloudA??"#e0a05a")},uCloudB:{value:new b(a.cloudB??"#3a1a0c")},uBand:{value:a.band??.12},uBandW:{value:a.bandWidth??.16},uCloudAmt:{value:a.cloud??0},uCloudSize:{value:a.cloudSize??.6},uTime:{value:0},uLevel:{value:1}}}),s=G(t,-999),r=t.uniforms;return s.onBeforeRender=(i,d,w)=>{r.uProjInv.value.copy(w.projectionMatrixInverse),r.uCamWorld.value.copy(w.matrixWorld)},{mesh:s,uniforms:r,set(i,d=1){r.uTime.value=i,r.uLevel.value=d},dispose(){t.dispose(),s.geometry.dispose()}}}export{J as G,_ as Q,X as a,G as b,Ne as c,Fe as d,Re as e,Te as p,D as s,Ge as v};
