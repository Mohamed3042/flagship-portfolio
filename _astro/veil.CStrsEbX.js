import{B as j}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{b0 as ne,az as le,U as ce,R as ie,j as ue,d as M,M as z,c as F,S as N,l as de,V as p,r as R,b1 as ve,o as fe,H as pe,v as V,T as U,b2 as me,aE as he,e as xe,s as we,C as y,N as H,G as E,k as O,A as K,i as ge,y as ye,aa as be}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const L=64,Se=`
  uniform float uZ; varying vec2 vUv;
  vec3 hash3(vec3 p){
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123);
  }

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
  }`,$=new WeakMap;function Ce(e){const a=$.get(e);if(a)return a;const t=new ne(L,L,L,{depthBuffer:!1,type:ce,format:le}),o=t.texture;o.wrapS=o.wrapT=o.wrapR=ie,o.minFilter=o.magFilter=ue,o.generateMipmaps=!1;const r=new M({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:Se,uniforms:{uZ:{value:0}},depthTest:!1,depthWrite:!1}),s=new z(new F(2,2),r);s.frustumCulled=!1;const c=new N,d=new de;c.add(s);const x=e.getRenderTarget();for(let n=0;n<L;n++)r.uniforms.uZ.value=(n+.5)/L,e.setRenderTarget(t,n),e.render(c,d);return e.setRenderTarget(x),r.dispose(),s.geometry.dispose(),$.set(e,o),o}const X=`
  float nR(vec3 p){ return texture(uNoise, p).r; }
  float nG(vec3 p){ return texture(uNoise, p).g; }
  float fbm4(vec3 p){ return (nR(p) * .5 + nR(p * 2.03 + .31) * .25 + nR(p * 4.07 + .67) * .125 + nR(p * 8.11 + .19) * .0625) / .9375; }
`,ke=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,k={x:0,y:0,t:-1};function Te(e,a,t){if(k.t!==a){k.t=a;const o=e.pointer.inside&&!ke;k.x=j(k.x,o?e.pointer.x:0,2.5,t),k.y=j(k.y,o?e.pointer.y:0,2.5,t)}return k}function G(e,a){const t=new z(new F(2,2),e);return t.frustumCulled=!1,t.renderOrder=a,t}const _="varying vec2 vNdc; void main(){ vNdc = position.xy; gl_Position = vec4(position.xy, .9999, 1.); }",J=`
  float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
  float h31(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
`,T=new p,Z=new p;function Ne(e,a,t){return e.updateMatrixWorld(),e.getWorldDirection(Z),T.copy(e.position).add(a).project(e),t.set(T.x,T.y,Z.dot(a)>0?1:-1)}const qe=`
  uniform sampler3D uNoise; varying vec3 vDir;
  ${X}
  void main(){
    vec3 d = normalize(vDir);


    vec3 pole = normalize(vec3(.7245, -.6367, -.2619)), core = normalize(vec3(-.45, -.15, -.88));
    float lat = dot(d, pole), toCore = max(dot(d, core), 0.);
    vec3 q = d * .46;
    vec3 w = vec3(fbm4(q * 1.6 + .3), fbm4(q * 1.6 + .71), fbm4(q * 1.6 + .13)) - .5;
    float band = exp(-lat * lat / (2. * .12 * .12)), halo = exp(-lat * lat / (2. * .3 * .3));
    float cloud = fbm4(q * 2.4 + w * .7);
    float lanes = smoothstep(.5, .64, fbm4(q * 4.3 + w * 1.2 + 2.)) * smoothstep(.42, .6, fbm4(q * 9. + w + 5.));
    vec3 col = vec3(.0011, .0011, .0022);

    float cir = fbm4(q * 1.9 + w * 1.2 + 11.);
    col += mix(vec3(.22, .11, .05), vec3(.26, .1, .08), fbm4(q * 1.1 + 3.)) * pow(cir, 3.) * .022;

    vec3 bandCol = mix(vec3(.8, .5, .28), vec3(1., .86, .64), pow(toCore, 4.)) * 1.25;
    col += bandCol * band * (.3 + .7 * smoothstep(.38, .72, cloud)) * (.028 + .05 * pow(toCore, 8.));
    col += bandCol * halo * smoothstep(.3, .8, cloud) * (.006 + .016 * pow(toCore, 6.));
    col *= 1. - lanes * band * .85;

    float neb = smoothstep(.56, .82, fbm4(q * 1.25 + w * 1.7 + 7.3));
    vec3 nebCol = mix(vec3(.7, .3, .16), vec3(.62, .36, .3), smoothstep(.35, .65, fbm4(q * 3. + 1.)));
    float hot = pow(fbm4(q * 6. + w * 2.), 2.);
    nebCol = mix(nebCol, vec3(1., .46, .3), smoothstep(.66, .86, fbm4(q * 2.3 + 4.)) * smoothstep(.3, .5, hot) * .6);
    col += nebCol * neb * (.012 + .05 * hot);

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
  ${J}

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

      float dens = (L == 0 ? .16 : L == 1 ? .07 : .05) * (L == 2 ? mix(.1, 2.4, band) : mix(.6, 1.5, band));
      if (h21(k) > dens) continue;
      vec2 o = .22 + .56 * h22(k + 3.7);
      float b = L == 0 ? .12 + 1.6 * pow(h21(k + 9.1), 9.) : L == 1 ? .05 + .22 * pow(h21(k + 9.1), 4.) : .02 + .035 * h21(k + 9.1);
      float cellPx = N * px;
      vec2 dp = (f - o) / max(cellPx, 1e-5);
      float s = .55 + min(b, 1.5) * .9;
      acc += starCol(h21(k + 5.3)) * b * exp(-dot(dp, dp) / (s * s));
    }
    return acc;
  }
  vec3 dirAt(vec2 ndc){ vec4 v = uProjInv * vec4(ndc, 1., 1.); return normalize(mat3(uCamWorld) * (v.xyz / v.w)); }
  void main(){
    vec3 dir = dirAt(vNdc);
    float px = length(fwidth(dir)) * .5;
    vec3 col;
    if (uWarp < .002) col = texture(uSky, dir).rgb + stars(dir, px) * uStars;
    else {



      col = vec3(0.); vec3 peak = vec3(0.);
      float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))));
      for (int i = 0; i < WARP_N; i++) {
        float k = (float(i) + j) / float(WARP_N);
        vec3 ds = normalize(mix(dir, uWarpDir, k * uWarp * .45));
        vec3 c = (texture(uSky, ds).rgb + stars(ds, px * (1. + uWarp * 2.)) * uStars) * mix(vec3(1., .95, .88), vec3(1.3, .88, .62), mix(.5, k, uSplit));
        col += c; peak = max(peak, c);
      }
      col = mix(col / float(WARP_N), peak, .4) * (1. + uWarp * .9);
    }
    gl_FragColor = vec4(col * uLevel, 1.);
  }`,Q=new WeakMap;function Me(e,a){const t=Q.get(e);if(t)return t;const o=Ce(e),r=[512,768,1024][a],s=new ve(r,{type:pe,generateMipmaps:!0,minFilter:fe}),c=new M({side:V,depthWrite:!1,uniforms:{uNoise:{value:o}},fragmentShader:qe,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }"}),d=new z(new U(40,96,48),c),x=new N;x.add(d);const n=e.getRenderTarget();new me(.1,100,s).update(e,x);const b=new N,m=new M({side:V,depthWrite:!1,uniforms:{uSky:{value:s.texture}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform samplerCube uSky; varying vec3 vDir; void main(){ gl_FragColor = vec4(texture(uSky, normalize(vDir)).rgb * 2.5, 1.); }"}),w=new z(new U(40,48,24),m);b.add(w);const S=(h,i,l,q,v)=>{const f=new z(new F(q,v),new xe({color:new y(h).multiplyScalar(i),side:we}));f.position.copy(l),f.lookAt(0,0,0),b.add(f)};S("#ffd2a0",60,new p(-14,8,-30),3.2,3.2),S("#ffb070",3.5,new p(0,-9,-30),60,2.4),S("#c99a72",1.2,new p(0,-24,10),60,18),S("#f2c890",1.6,new p(26,14,18),10,18);const W=new he(e),A=W.fromScene(b,0,.1,100).texture;W.dispose(),e.setRenderTarget(n),c.dispose(),d.geometry.dispose(),w.geometry.dispose(),m.dispose(),b.traverse(h=>{h.isMesh&&h!==w&&(h.geometry.dispose(),h.material.dispose())});const g={cube:s,env:A,noise:o};return Q.set(e,g),g}const D=e=>Me(e.renderer,e.quality);function Fe(e){const{cube:a}=D(e),t=new M({vertexShader:_,fragmentShader:ze,depthTest:!1,depthWrite:!1,defines:{WARP_N:[10,14,20][e.quality]},uniforms:{uSky:{value:a.texture},uProjInv:{value:new R},uCamWorld:{value:new R},uWarp:{value:0},uWarpDir:{value:new p(0,0,-1)},uStars:{value:1},uLevel:{value:1},uSplit:{value:1}}}),o=G(t,-1e3),r=t.uniforms;return o.onBeforeRender=(s,c,d)=>{r.uProjInv.value.copy(d.projectionMatrixInverse),r.uCamWorld.value.copy(d.matrixWorld)},{mesh:o,uniforms:r,warp(s,c){r.uWarp.value=s,c&&r.uWarpDir.value.copy(c)},dispose(){t.dispose(),o.geometry.dispose()}}}const We=`
  uniform vec2 uStar; uniform float uStarVis, uAspect, uTime, uSlide, uFrost, uFlash, uShake, uHaze, uRoll, uPortrait;
  uniform vec2 uBend;
  varying vec2 vNdc;
  ${J}
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

    rim = body * smoothstep(.45, 1., k) * max(dot(normalize(d + 1e-4), toStar), 0.);
    return body;
  }
  void main(){
    vec2 q = vNdc * vec2(uAspect, 1.);
    vec2 sq = uStar * vec2(uAspect, 1.);
    vec2 toStar = normalize(sq - q + 1e-4);
    float edge = clamp(max(abs(vNdc.x), abs(vNdc.y) * mix(1., .8, uPortrait)), 0., 1.);
    float low = smoothstep(.2, -1., vNdc.y);
    float wet = smoothstep(.45, 1., edge) * .8 + low * .55;
    vec3 col = vec3(0.);
    float rim1, rim2;
    vec2 shakeOff = vec2(0., -uShake * .04);
    float d1 = drops(q + shakeOff * .5, 26., .16 * wet, toStar, rim1);
    float d2 = drops(q + shakeOff + 7.7, 61., .26 * wet, toStar, rim2);
    vec3 warm = vec3(1., .82, .58);
    float starLight = .25 + .75 * uStarVis;
    col += warm * (rim1 * .22 + rim2 * .12) * starLight;
    col += vec3(.9, .78, .62) * (d1 * .018 + d2 * .012);

    float sd = length(q - sq);
    col += vec3(.85, .55, .32) * (exp(-sd * 2.4) * .12 + exp(-sd * .7) * .02) * uStarVis * uHaze;
    col += vec3(.42, .3, .22) * (low * .018 + wet * .01) * uHaze;

    float s = uSlide;
    float b1 = exp(-pow((q.x * .78 + q.y * .62 - .35 + s) * 3.2, 2.)), b2 = exp(-pow((q.x * .6 - q.y * .8 + .9 - s * .7) * 5.5, 2.));
    col += vec3(.95, .86, .72) * (b1 * .032 + b2 * .022) * (.6 + .4 * uStarVis);

    if (uFrost > .001) {
      vec2 dir = normalize(vec2(1., .25) + uBend);
      vec2 r = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x)));
      r.y += r.x * r.x * uBend.y * .4;
      float line = h21(vec2(floor(r.y * 140.), 3.));
      float len = smoothstep(.0, .3, fract(r.x * .7 + line * 3. - uTime * .05));
      float streak = smoothstep(.985, 1., line) * len * smoothstep(.2, 1., edge + low * .6);
      col += vec3(1., .9, .78) * streak * .22 * uFrost;
    }

    if (uShake > .001) {
      vec2 g = q * 90. + vec2(0., uTime * 2.), c = floor(g);
      float spark = step(.992, h21(c)) * smoothstep(.5, .05, length(fract(g) - .5));
      col += vec3(1., .88, .66) * spark * uShake * 1.6;
    }
    col += vec3(.95, .72, .45) * uFlash * (.06 + .14 * edge);
    gl_FragColor = vec4(col, 1.);
  }`,Ae=new y("#c9ccd1"),Be=new y("#c8783a"),Y=new y("#2e2a26");function Ge(e,{copper:a=!0}={}){const{env:t}=D(e),o=new H({color:"#c9ccd1",metalness:1,roughness:.2,envMap:t,envMapIntensity:1.5}),r=new H({color:"#c8783a",metalness:1,roughness:.28,envMap:t,envMapIntensity:1.4}),s=new E,c=new E;s.add(c);const d=new M({vertexShader:_,fragmentShader:We,transparent:!0,depthTest:!1,depthWrite:!1,blending:K,uniforms:{uStar:{value:new O(0,2)},uStarVis:{value:0},uAspect:{value:1},uTime:{value:0},uSlide:{value:0},uFrost:{value:0},uFlash:{value:0},uShake:{value:0},uHaze:{value:1},uBend:{value:new O},uRoll:{value:0},uPortrait:{value:0}}}),x=G(d,1900),n=d.uniforms;let b="",m=null;const w=[];function S(i){const l=`${i.fov}:${i.aspect.toFixed(3)}`;if(l===b)return;b=l;for(const u of w)u.dispose();w.length=0,c.clear();const q=-1,v=Math.tan(ge.degToRad(i.fov/2)),f=v*i.aspect,C=i.aspect<1,B=v*(C?.006:.0085),P=(u,ee,oe)=>{const ae=new ye(u.map(([te,re,se])=>new p(te*f,re*v,q*se))),I=new be(ae,64,ee,10,!1);w.push(I),c.add(new z(I,oe))};for(const u of[-1,1])P([[u*1.25,-1.35,.7],[u*(C?.99:.93),-.55,.96],[u*(C?.95:.86),.35,1],[u*(C?.82:.7),.92,.96],[u*.35,1.25,.85]],B*1.6,o),P([[u*1.2,-1.3,.74],[u*(C?.955:.885),-.5,.98],[u*(C?.91:.81),.32,1],[u*(C?.78:.655),.86,.98]],B*.7,a&&u>0?r:o);P([[-1.3,1.02,.8],[-.5,.9,.98],[0,.885,1],[.5,.9,.98],[1.3,1.02,.8]],B*1.2,o),P([[-1.3,-.88,.8],[-.4,-.97,.97],[0,-.985,1],[.4,-.97,.97],[1.3,-.88,.8]],B*1.4,o);for(const u of[-1,1])P([[u*.62,.9,.99],[u*.7,.99,.95],[u*.8,1.1,.9]],B*.9,o)}let W=0,A=null;const g=new p,h=new p;return{group:s,glass:x,uniforms:n,attach(i,l){m=i,i.parent||l.add(i),i.add(s),l.add(x),S(i)},update(i,l={}){if(!m)return;S(m),m.updateMatrixWorld(),m.getWorldDirection(g);const q=Math.atan2(g.x,-g.z)+g.y*.6;if(A!==null){let f=q-A;f>Math.PI&&(f-=Math.PI*2),f<-Math.PI&&(f+=Math.PI*2),W+=f*.9}if(A=q,n.uSlide.value=W+Math.sin(i*.11)*.04,n.uTime.value=i,n.uAspect.value=m.aspect,n.uPortrait.value=m.aspect<1?1:0,l.star){h.copy(m.position).add(l.star).project(m);const f=g.dot(l.star)>0;n.uStar.value.set(h.x,h.y),n.uStarVis.value=f?(l.starVis??1)*Math.max(0,1-Math.max(0,Math.max(Math.abs(h.x),Math.abs(h.y))-1.1)/.8):0}else n.uStarVis.value=0;n.uFrost.value=l.frost??0,n.uBend.value.set(l.bendX??0,l.bendY??0),n.uFlash.value=l.flash??0,n.uShake.value=l.shake??0,n.uHaze.value=l.haze??1;const v=l.ribs??1;c.visible=v>.55,c.scale.set(1+(1-v)*.6,1+(1-v)*.6,1),o.color.copy(Ae).lerp(Y,1-v),r.color.copy(Be).lerp(Y,1-v),o.roughness=.2+(1-v)*.35,r.roughness=.28+(1-v)*.3},dispose(){for(const i of w)i.dispose();o.dispose(),r.dispose(),d.dispose(),x.geometry.dispose()}}}const Pe=`
  uniform sampler3D uNoise; uniform mat4 uProjInv, uCamWorld;
  uniform vec3 uPole, uStar, uCloud, uBandA, uBandB, uCloudA, uCloudB;
  uniform float uBand, uBandW, uCloudAmt, uCloudSize, uTime, uLevel;
  varying vec2 vNdc;
  ${X}
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
        col *= 1. - smoothstep(.62, .8, fbm4(q * 5. + 2.)) * shape * .5;
      }
    }
    gl_FragColor = vec4(col * uLevel, 1.);
  }`;function _e(e,a={}){const{noise:t}=D(e),o=new M({vertexShader:_,fragmentShader:Pe,depthTest:!1,depthWrite:!1,transparent:!0,blending:K,uniforms:{uNoise:{value:t},uProjInv:{value:new R},uCamWorld:{value:new R},uPole:{value:(a.bandPole??new p(.2,1,.15)).clone().normalize()},uStar:{value:(a.star??new p(-.5,.2,-1)).clone().normalize()},uCloud:{value:(a.cloudAt??new p(0,0,-1)).clone().normalize()},uBandA:{value:new y(a.bandA??"#5a2c14")},uBandB:{value:new y(a.bandB??"#f2d9b0")},uCloudA:{value:new y(a.cloudA??"#e0a05a")},uCloudB:{value:new y(a.cloudB??"#3a1a0c")},uBand:{value:a.band??.12},uBandW:{value:a.bandWidth??.16},uCloudAmt:{value:a.cloud??0},uCloudSize:{value:a.cloudSize??.6},uTime:{value:0},uLevel:{value:1}}}),r=G(o,-999),s=o.uniforms;return r.onBeforeRender=(c,d,x)=>{s.uProjInv.value.copy(x.projectionMatrixInverse),s.uCamWorld.value.copy(x.matrixWorld)},{mesh:r,uniforms:s,set(c,d=1){s.uTime.value=c,s.uLevel.value=d},dispose(){o.dispose(),r.geometry.dispose()}}}export{X as G,_ as Q,J as a,G as b,Fe as c,Ge as d,Ne as e,Te as p,D as s,_e as v};
