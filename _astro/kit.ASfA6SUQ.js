import{j as ie,B as O,N as ue,t as $}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{W as Y,j as _,o as J,H as ee,d as A,M as y,c as V,S as te,G as E,C as z,m as N,N as K,ab as le,e as ce,b as pe,u as ve,V as x,a as oe,F as B,f as H,k as P,aH as X,O as fe,s as me,y as de,n as he,q as xe}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const we=e=>Math.min(1,Math.max(0,e)),ge=(e,t,r)=>we((r-e)/(t-e)),be=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,Ee=e=>String(e).padStart(2,"0"),k=Math.PI*2,Pe={first:.07,last:.93},Ve=["mk-voice","mk-suite","talent-atlas","mk-downloader"],Ie=e=>.19+e*.22,Ue=4,We=e=>.16+e*.23,je=.56,R=(()=>{let e=31;const t=()=>(e=e*1664525+1013904223>>>0)/4294967296;return Array.from({length:15},(r,a)=>{const o=.35+a*(k*1.22/15)+(t()-.5)*.18,n=19+a*2.35+(t()-.5)*2.4;return{x:Math.cos(o)*n,z:Math.sin(o)*n,r:n}})})(),ye=Math.atan2(R[0].z,R[0].x)-.5,Oe=e=>k*1.04*be(ge(.05,.5,e)),$e=e=>((Math.atan2(R[e].z,R[e].x)-ye)%k+k)%k,Se="#ffb347",ae="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",ze=`
  uniform sampler2D tScene; uniform vec2 uRes; uniform float uTime, uDpr;
  uniform float uGrade, uThermal, uGain, uRawGain, uNoise, uScan, uBloom, uVig, uHex, uPower, uFlash, uWarm, uTilt, uTiltAt;
  uniform vec4 uBand; uniform vec4 uLock; uniform vec3 uLockAmt; uniform vec3 uLockCol; uniform vec3 uRawTint;
  varying vec2 vUv;
  float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }


  vec3 phosphor(float l){
    l = max(l, 0.);
    l = l * l / (l + .14) * 1.14;
    vec3 c = vec3(.07, .6, .05) * l;
    c += vec3(.5, .4, .46) * pow(max(l - .5, 0.), 1.4);
    return c;
  }

  vec3 iron(float t){
    t = clamp(t, 0., 1.2);
    vec3 c = mix(vec3(.004, .002, .02), vec3(.09, .01, .22), smoothstep(0., .22, t));
    c = mix(c, vec3(.55, .02, .25), smoothstep(.18, .42, t));
    c = mix(c, vec3(1., .16, .02), smoothstep(.38, .62, t));
    c = mix(c, vec3(1., .62, .04), smoothstep(.58, .82, t));
    return mix(c, vec3(1.25, 1.2, .95), smoothstep(.8, 1.1, t));
  }

  float hexEdge(vec2 p){
    p.x *= 1.1547; p.y += mod(floor(p.x), 2.) * .5;
    vec2 f = abs(fract(p) - .5);
    return smoothstep(.05, .0, abs(max(f.x * 1.5 + f.y, f.y * 2.) - 1.) * .5);
  }
  void main(){
    vec2 uv = vUv, asp = vec2(uRes.x / uRes.y, 1.);
    vec4 s = texture2D(tScene, uv);

    float soft = uTilt * smoothstep(.2, .5, abs(uv.y - .5 - uTiltAt));
    if (soft > .001) s = mix(s, textureLod(tScene, uv, 1. + soft * 2.2), min(1., soft * 1.4));

    vec4 b1 = textureLod(tScene, uv, 2.5), b2 = textureLod(tScene, uv, 4.), b3 = textureLod(tScene, uv, 5.5);
    vec3 bl = b1.rgb * .42 + b2.rgb * .34 + b3.rgb * .3;
    float bMask = clamp(b1.a * .5 + b2.a * .5, 0., 1.) * uGrade;
    float r = length((uv - .5) * asp);

    float pw = uPower, on = smoothstep(0., .16, pw);
    float gain = uGain * (1. + 2.6 * exp(-pw * 5.) * step(.001, pw) * step(pw, .999));
    float mask = clamp(s.a, 0., 1.) * uGrade;

    float bd = abs(uv.x - uBand.x), band = uBand.w * smoothstep(uBand.y + uBand.z, uBand.y, bd);
    float bandEdge = uBand.w * (1. - smoothstep(.0, 1.5 / uRes.x, abs(bd - uBand.y - uBand.z * .5)));
    float th = clamp(uThermal + band, 0., 1.);
    float l = luma(s.rgb) * gain;


    vec3 graded = mix(phosphor(l), iron(pow(l * 2.6, .75)), th);
    vec3 raw = s.rgb * uRawGain * uRawTint;
    vec3 col = mix(raw, graded, mask);

    float bl_l = max(luma(bl) * gain - .22, 0.);
    vec3 bloomC = mix(max(bl * uRawGain - .18, 0.) * uRawTint, mix(phosphor(bl_l * 1.4), iron(pow(bl_l * 2.6, .75)) * .5, th), bMask);
    col += bloomC * uBloom;
    col += vec3(1., .85, .6) * bandEdge * .6;

    vec2 fc = gl_FragCoord.xy;
    col *= 1. - uHex * hexEdge(fc / (5.5 * uDpr)) * mask * smoothstep(.02, .3, l);
    float frame = floor(uTime * 30.);
    float n = hash(fc + frame * vec2(17.13, 29.71)), n2 = hash(fc.yx * 1.37 + frame * vec2(5.3, 7.9));
    float dark = 1. - smoothstep(0., .45, l);


    float lum0 = max(luma(col), 0.);
    col += (n - .5) * uNoise * (.35 + .65 * mask) * (sqrt(lum0) * (1.1 + .6 * dark) + .012) * 1.6 * vec3(mix(.9, .55, mask), 1., mix(.9, .6, mask));
    col += phosphor(1.6) * step(1. - .0016 * uNoise * 6., n2) * mask * (.4 + dark);

    float y = fc.y / uDpr;
    col *= 1. - uScan * (.5 + .5 * sin(y * 2.0944)) * (.6 + .4 * mask);
    col *= 1. + uScan * .35 * exp(-pow(fract(uv.y * .5 - uTime * .045) * 8. - 4., 2.));

    float br = .035 * sin(uTime * .63) + .02 * sin(uTime * 1.71 + 1.3);
    col *= mix(1., smoothstep(1.28 + br, .22 + br * .5, r), uVig);

    col = mix(col, mix(vec3(1.1, 1.05, 1.), phosphor(1.7), mask), uFlash);
    col *= mix(1., on, step(.001, pw) * step(pw, .999));
    if (pw <= .001) col *= 0.;

    if (uLockAmt.y > .001) {
      vec2 P = uv * uRes, A = uLock.xy * uRes, B = uLock.zw * uRes;
      float grow = (1. - uLockAmt.x) * min(uRes.x, uRes.y) * .07;
      A -= grow; B += grow;
      vec2 C = (A + B) * .5, H = (B - A) * .5, ap = abs(P - C), q = ap - H;
      float w = 1.25 * uDpr, arm = min(H.x, H.y) * .2;
      float hx = step(H.x - arm, ap.x) * step(ap.x, H.x + w * .5) * (1. - smoothstep(w * .5 - .6, w * .5 + .6, abs(q.y)));
      float vy = step(H.y - arm, ap.y) * step(ap.y, H.y + w * .5) * (1. - smoothstep(w * .5 - .6, w * .5 + .6, abs(q.x)));
      float tick = step(ap.x, w * .5 + .5) * step(abs(q.y + 7. * uDpr), 6. * uDpr) + step(ap.y, w * .5 + .5) * step(abs(q.x + 7. * uDpr), 6. * uDpr);

      float cx = step(abs(P.y - C.y), w * .45) * step(H.x + 18. * uDpr, ap.x) * uLockAmt.z;
      float cy = step(abs(P.x - C.x), w * .45) * step(H.y + 18. * uDpr, ap.y) * uLockAmt.z;
      float m = clamp(max(max(hx, vy), tick) + (cx + cy) * .35, 0., 1.) * uLockAmt.y;
      col = mix(col, uLockCol, m);
    }
    gl_FragColor = vec4(max(col, 0.), 1.);
  }`,Te=()=>({tScene:{value:null},uRes:{value:new P(1,1)},uTime:{value:0},uDpr:{value:1},uGrade:{value:1},uThermal:{value:0},uGain:{value:1},uRawGain:{value:1},uRawTint:{value:new z(1,1,1)},uNoise:{value:.09},uScan:{value:.06},uBloom:{value:.9},uVig:{value:.75},uHex:{value:.05},uPower:{value:1},uFlash:{value:0},uWarm:{value:0},uBand:{value:new H(0,0,.02,0)},uTilt:{value:0},uTiltAt:{value:0},uLock:{value:new H(.4,.4,.6,.6)},uLockAmt:{value:new x(0,0,0)},uLockCol:{value:new z(Se)}});function Ne(e,t,r){const a=new Y(1,1,{type:ee,samples:e.quality?4:0,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,generateMipmaps:!0,minFilter:J,magFilter:_}),o=Te();o.tScene.value=a.texture;const n=new A({vertexShader:ae,fragmentShader:ze,uniforms:o,depthTest:!1,depthWrite:!1}),s=new y(new V(2,2),n);s.frustumCulled=!1,s.renderOrder=-10;const u=new te,p=new E;u.add(s,p);function v(){const c=Math.max(2,Math.round(e.viewport.width*e.viewport.dpr)),l=Math.max(2,Math.round(e.viewport.height*e.viewport.dpr));(a.width!==c||a.height!==l)&&a.setSize(c,l),o.uRes.value.set(c,l),o.uDpr.value=e.viewport.dpr}v();const f=new z;function m(c){const l=e.renderer,h=l.getRenderTarget(),d=l.getClearAlpha();l.getClearColor(f),l.setRenderTarget(a),l.setClearColor(0,1),l.clear(!0,!0,!0),l.render(t,r),l.setRenderTarget(h),l.setClearColor(f,d),o.uTime.value=c}function i(){const c=e.renderer,l=c.getRenderTarget();c.setRenderTarget(a);const h=c.compileAsync(t,r).catch(()=>{}).then(()=>m(0));return c.setRenderTarget(l),h}return{scene:u,overlay:p,U:o,rt:a,resize:v,render:m,warm:i,dispose(){a.dispose(),n.dispose(),s.geometry.dispose()}}}const F=e=>e-Math.floor(e);function D(e,t){let r=F(e*.1031),a=F(t*.1031),o=F(e*.1031);const n=r*(a+33.33)+a*(o+33.33)+o*(r+33.33);return r+=n,a+=n,o+=n,F((r+a)*o)}function ne(e,t){const r=Math.floor(e),a=Math.floor(t),o=e-r,n=t-a,s=o*o*o*(o*(o*6-15)+10),u=n*n*n*(n*(n*6-15)+10),p=D(r,a),v=D(r+1,a),f=D(r,a+1),m=D(r+1,a+1);return(p+(v-p)*s)*(1-u)+(f+(m-f)*s)*u}function q(e,t,r){let a=0,o=.5;for(let n=0;n<r;n++){a+=o*ne(e,t);const s=1.6*e-1.2*t+5.3,u=1.2*e+1.6*t+1.9;e=s,t=u,o*=.5}return a}function Me(e,t,r){let a=0,o=.5,n=0;for(let s=0;s<r;s++){const u=1-Math.abs(2*ne(e,t)-1);a+=o*u*u,n+=o;const p=1.6*e-1.2*t+5.3,v=1.2*e+1.6*t+1.9;e=p,t=v,o*=.5}return a/n}const re=`
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }
  float fbm(vec2 p, int oct){ float v = 0., a = .5; for (int i = 0; i < 6; i++){ if (i >= oct) break; v += a * vnoise(p); p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v; }
  float ridge(vec2 p, int oct){ float v = 0., a = .5, n = 0.; for (int i = 0; i < 6; i++){ if (i >= oct) break; float k = 1. - abs(2. * vnoise(p) - 1.); v += a * k * k; n += a; p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v / n; }`,g={size:180,res:1024,hq:1.4,minor:.5,major:2.5};function se(e,t){const r=e*.03,a=t*.03,o=q(r*.8+3.1,a*.8+1.7,3)-.5,n=q(r*.8+8.3,a*.8+2.9,3)-.5,s=r+o*1.4,u=a+n*1.4,p=q(s,u,5),v=Me(s*1.7+4.2,u*1.7+4.2,4);let f=(p-.5)*10+v*v*6.5-1;const m=Math.hypot(e,t),i=Math.min(1,Math.max(0,(11-m)/6)),c=i*i*(3-2*i);return f+=(g.hq-f)*c,f}const ke=`
  float rawHeight(vec2 xz){
    vec2 p = xz * .03;
    vec2 w = vec2(fbm(p * .8 + vec2(3.1, 1.7), 3), fbm(p * .8 + vec2(8.3, 2.9), 3)) - .5;
    vec2 q = p + w * 1.4;
    float b = fbm(q, 5), r = ridge(q * 1.7 + 4.2, 4);
    float h = (b - .5) * 10. + r * r * 6.5 - 1.;
    return mix(h, ${g.hq.toFixed(3)}, smoothstep(11., 5., length(xz)));
  }`,I=R.map(({x:e,z:t})=>({x:e,z:t,y:se(e,t),a:Math.atan2(t,e)})),T={inner:1.7,outer:3.4};function Re(e,t){let r=se(e,t);for(const a of I){const o=Math.hypot(e-a.x,t-a.z);if(o<T.outer){const n=Math.min(1,(T.outer-o)/(T.outer-T.inner)),s=n*n*(3-2*n);r+=(a.y-r)*s}}return r}const Ae=`
  ${re}
  ${ke}
  varying vec2 vUv;
  void main(){
    vec2 xz = (vUv - .5) * ${g.size.toFixed(1)};
    float h = rawHeight(xz);
    ${I.map(e=>`{ float d = length(xz - vec2(${e.x.toFixed(4)}, ${e.z.toFixed(4)})); h = mix(h, ${e.y.toFixed(4)}, smoothstep(${T.outer.toFixed(2)}, ${T.inner.toFixed(2)}, d)); }`).join(`
    `)}
    gl_FragColor = vec4(h, 0., 0., 1.);
  }`;let M=null;function Ce(e){if(M)return M.texture;const t=g.res;M=new Y(t,t,{type:ee,depthBuffer:!1,generateMipmaps:!1,minFilter:_,magFilter:_,wrapS:X,wrapT:X});const r=new A({vertexShader:ae,fragmentShader:Ae,depthTest:!1,depthWrite:!1}),a=new y(new V(2,2),r),o=new te,n=new fe(-1,1,1,-1,0,1);a.frustumCulled=!1,o.add(a);const s=e.getRenderTarget();return e.setRenderTarget(M),e.render(o,n),e.setRenderTarget(s),r.dispose(),a.geometry.dispose(),M.texture}const Le=()=>({uHeight:{value:null},uSize:{value:g.size},uTexel:{value:g.size/g.res},uTime:{value:0},uMinor:{value:g.minor},uMajor:{value:g.major},uSun:{value:new x(-.6,.36,-.5).normalize()},uAmbient:{value:.07},uShade:{value:.2},uContour:{value:.55},uGrid:{value:.25},uRings:{value:0},uReveal:{value:999},uRevealAt:{value:new P(0,0)},uSweep:{value:new P(0,0)},uSpot:{value:new H(0,0,6,0)},uGround:{value:new z("#ffffff")},uLine:{value:new z("#ffffff")},uSky:{value:new z("#000000")},uFog:{value:.012},uWarmSide:{value:new z("#000000")},uDetail:{value:.5},uBlob:{value:new H(0,0,2.6,.8)}}),Fe=`
  uniform sampler2D uHeight; uniform float uSize;
  varying vec3 vW;
  void main(){
    vec4 w = modelMatrix * vec4(position, 1.);
    w.y = texture2D(uHeight, w.xz / uSize + .5).r;
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,De=`
  uniform sampler2D uHeight; uniform float uSize, uTexel, uTime, uMinor, uMajor, uAmbient, uShade, uContour, uGrid, uRings, uReveal, uFog, uDetail;
  uniform vec3 uSun, uGround, uLine, uSky, uWarmSide; uniform vec2 uRevealAt, uSweep; uniform vec4 uSpot, uBlob;
  varying vec3 vW;
  ${re}
  float H(vec2 xz){ return texture2D(uHeight, xz / uSize + .5).r; }
  float lines(float v, float w){ float fw = max(fwidth(v), 1e-4); float d = abs(fract(v - .5) - .5) / fw; return (1. - smoothstep(w * .5, w * .5 + 1., d)) * min(1., .32 / fw); }
  float far = 0.;
  void main(){
    vec2 xz = vW.xz;
    float h = H(xz), e = uTexel;
    vec3 n = normalize(vec3(H(xz - vec2(e, 0.)) - H(xz + vec2(e, 0.)), 2. * e, H(xz - vec2(0., e)) - H(xz + vec2(0., e))));
    float lit = max(dot(n, uSun), 0.), slope = 1. - n.y;
    float dist = length(vW - cameraPosition);

    vec2 sd = (xz - uSpot.xy) / uSpot.z;
    float spot = exp(-dot(sd, sd) * 1.6) * uSpot.w;

    float grit = uDetail > 0. ? (vnoise(xz * 9.) * .55 + vnoise(xz * 27. + 3.) * .45 - .5) * uDetail * smoothstep(30., 4., dist) : 0.;
    vec3 col = uGround * (uAmbient + lit * uShade + spot * (.35 + .65 * lit)) * (1. - slope * .35) * (1. + grit);
    col += uWarmSide * pow(max(dot(n, normalize(vec3(.8, .25, .5))), 0.), 2.);
    vec2 bq = (xz - uBlob.xy) / vec2(uBlob.z, uBlob.z * .45);
    col *= 1. - uBlob.w * exp(-dot(bq, bq) * 1.5);

    float rd = length(xz - uRevealAt);
    float shown = smoothstep(uReveal, uReveal - 4., rd), fr = max(fwidth(rd), 1e-4);
    float edge = ((1. - smoothstep(.4, 1.6, abs(rd - uReveal) / fr)) * .8 + exp(-max(uReveal - rd, 0.) * .9) * step(rd, uReveal) * .1) * step(1., uReveal) * step(uReveal, 400.);

    far = smoothstep(25., 90., dist);
    float cmin = lines(h / uMinor, 1. + far * .4), cmaj = lines(h / uMajor, 1.8 + far * 1.4);
    float con = max(cmin * .5, cmaj * (1.25 + far * .5)) * uContour * (.8 + .4 * smoothstep(-2., 7., h));
    col += uGround * (smoothstep(-3., 9., h) * .09 + lit * .34) * far;

    vec2 g = xz / 10.;
    float grid = max(lines(g.x, .9), lines(g.y, .9)) * uGrid;
    vec2 cq = abs(fract(g + .5) - .5) * 10., aw = fwidth(xz) * 1.2;
    float plus = step(min(cq.x / aw.x, cq.y / aw.y), 1.) * step(max(cq.x, cq.y), .3) * uGrid * 1.6;

    float rr = length(xz), ring = lines(rr / 12., 1.2) * uRings * step(rr, 61.);
    float a = atan(xz.y, xz.x), ago = mod(uSweep.x - a, 6.28318);
    float sweep = (exp(-ago * 1.6) * .6 + exp(-ago * 28.) * 1.2) * uSweep.y * step(rr, 61.) * smoothstep(61., 50., rr);
    float bw = length(fwidth(xz)) * 2. / max(rr, .1);
    float beam = (1. - smoothstep(0., bw, min(ago, 6.28318 - ago))) * uSweep.y * step(rr, 60.) * smoothstep(0., 3., rr);
    vec3 ink = uLine * (con * (1. + sweep * .9) + grid * .5 + plus * .6 + ring * .6) * shown;
    col = col * mix(.35, 1., shown) + ink + uLine * (edge * .9 + sweep * .42 + beam * 1.5);

    float fog = 1. - exp(-dist * uFog);
    col = mix(col, uSky, fog);
    gl_FragColor = vec4(col, 1.);
  }`;function Ke(e,{span:t=g.size,seg:r=e.quality?320:200}={}){const a=Le();a.uHeight.value=Ce(e.renderer);const o=`${t}:${r}`,n=Z.get(o)??Z.set(o,new V(t,t,r,r).rotateX(-Math.PI/2)).get(o),s=new y(n,new A({vertexShader:Fe,fragmentShader:De,uniforms:a}));return s.frustumCulled=!1,{mesh:s,U:a,dispose(){s.material.dispose()}}}const Z=new Map;function Ge(){const e=[new x(0,g.hq,4),...I.map(t=>new x(t.x,t.y,t.z))];return new de(e,!1,"centripetal",.5)}function Xe(e=Ge(),{width:t=.14,lift:r=.07,samples:a=1400}={}){const o=[],n=[],s=[],u=new x,p=new x,v=new x,f=new x(0,1,0),m=e.getLength();for(let l=0;l<=a;l++){const h=l/a;e.getPointAt(h,u),e.getTangentAt(h,p),v.crossVectors(p,f).normalize().multiplyScalar(t/2);for(const d of[-1,1]){const b=u.x+v.x*d,w=u.z+v.z*d;o.push(b,Re(b,w)+r,w),n.push(h*m,d*.5+.5)}if(l<a){const d=l*2;s.push(d,d+1,d+2,d+1,d+3,d+2)}}const i=new oe;i.setAttribute("position",new B(o,3)),i.setAttribute("uv",new B(n,2)),i.setIndex(s);const c=new A({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uShow:{value:1},uHead:{value:1e5},uColor:{value:new z("#ffffff")},uLevel:{value:1.2}},vertexShader:"varying vec2 vUv; varying float vD; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vD = distance(w.xyz, cameraPosition); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform float uTime, uShow, uHead, uLevel; uniform vec3 uColor; varying vec2 vUv; varying float vD;
      void main(){
        float dash = step(.42, fract(vUv.x * .9 - uTime * .35));
        float edge = smoothstep(0., .25, vUv.y) * smoothstep(1., .75, vUv.y);
        float a = dash * edge * uShow * step(vUv.x, uHead) * smoothstep(4.5, 12., vD);
        if (a < .01) discard;
        gl_FragColor = vec4(uColor * uLevel, a);
      }`});return{mesh:new y(i,c),length:m}}function Ze(){const e=new E,t=new N(ie(),{depth:.5,curveSegments:2,bevelEnabled:!0,bevelThickness:.07,bevelSize:.06,bevelSegments:1});t.translate(-3.87/2,0,-.25),t.computeVertexNormals();const r=new K({color:"#4d544e",roughness:.36,metalness:.7});r.onBeforeCompile=d=>{d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vObj; float spk(vec3 p){ return fract(sin(dot(floor(p * 90.), vec3(12.9898, 78.233, 37.719))) * 43758.5453); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
float sp = spk(vObj); roughnessFactor = clamp(roughnessFactor + (sp - .5) * .12, .3, 1.);`).replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= .95 + .1 * spk(vObj + 3.1);`)};const a=new y(t,r);a.position.y=.32;const o=ue.width+.9,n=1.2,s=.12,u=new le;u.moveTo(-o/2+s,-n/2),u.lineTo(o/2-s,-n/2),u.lineTo(o/2,-n/2+s),u.lineTo(o/2,n/2-s),u.lineTo(o/2-s,n/2),u.lineTo(-o/2+s,n/2),u.lineTo(-o/2,n/2-s),u.lineTo(-o/2,-n/2+s),u.closePath();const p=new N(u,{depth:.26,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:1});p.rotateX(Math.PI/2),p.translate(0,.3,0);const v=new y(p,new K({color:"#3c403c",roughness:.8,metalness:.3})),f=new ce({color:"#ffffff",toneMapped:!1}),m=new E,i=new y(new pe(.2,.12,.16),v.material),c=new y(new ve(.045,.045,.05,16),f);c.position.y=.08,m.add(i,c),m.position.set(o/2-.3,.36,.3);const l=Be();return l.mesh.position.set(-3.87/2,0,.326),a.add(l.mesh),e.add(a,v,m),{group:e,body:a,blink:(d,b=1)=>{const w=d%1.45/1.45,S=(w<.045?1:w>.1&&w<.13?.55:0)*b;f.color.setScalar(.15+S*26)},tape:l.U,dispose(){t.dispose(),p.dispose(),r.dispose(),v.material.dispose(),f.dispose(),i.geometry.dispose(),c.geometry.dispose(),l.dispose()}}}function Be(e=.028){const t=[],r=[],a=[];$.forEach((u,p)=>{let v=0;const f=u.map((i,c)=>{const l=u[(c+1)%u.length],h=Math.hypot(l[0]-i[0],l[1]-i[1]);return v+=h,h});let m=0;u.forEach((i,c)=>{const l=u[(c+1)%u.length],h=(l[0]-i[0])/f[c],d=(l[1]-i[1])/f[c],b=-d*e/2,w=h*e/2,S=t.length/3,C=h*e/2,L=d*e/2;t.push(i[0]-C+b,i[1]-L+w,0,i[0]-C-b,i[1]-L-w,0,l[0]+C+b,l[1]+L+w,0,l[0]+C-b,l[1]+L-w,0);const U=$.length,W=(p+m/v)/U,j=(p+(m+f[c])/v)/U;r.push(W,W,j,j),a.push(S,S+1,S+2,S+1,S+3,S+2),m+=f[c]})});const o=new oe;o.setAttribute("position",new B(t,3)),o.setAttribute("aS",new B(r,1)),o.setIndex(a);const n={uDraw:{value:1},uLevel:{value:1.4}},s=new A({uniforms:n,side:me,toneMapped:!1,vertexShader:"attribute float aS; varying float vS; void main(){ vS = aS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uDraw, uLevel; varying float vS;
      void main(){
        if (vS > uDraw + .001) discard;
        float head = exp(-(uDraw - vS) * 26.) * step(uDraw, .999);
        gl_FragColor = vec4(vec3(uLevel * (1. + head * 3.)), 1.);
      }`});return{mesh:new y(o,s),U:n,dispose(){o.dispose(),s.dispose()}}}const He={en:'"Inter Variable", "Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif',display:'"Space Grotesk Variable", "Inter Variable", system-ui, sans-serif'},Qe=()=>Promise.allSettled([document.fonts.load('300 40px "Inter Variable"'),document.fonts.load('600 40px "Inter Variable"'),document.fonts.load('500 40px "Space Grotesk Variable"'),document.fonts.load('600 40px "Cairo Variable"')]);function Ye(e,{pad:t=12,rtl:r=!1,align:a="start",scale:o=2}={}){const n=document.createElement("canvas"),s=n.getContext("2d"),u=i=>`${i.weight??500} ${i.size*o}px ${i.font??He.en}`;let p=0,v=t*o;for(const i of e)s.font=u(i),s.letterSpacing=`${(i.track??0)*i.size*o}px`,p=Math.max(p,s.measureText(i.text).width),v+=i.size*o*1.3;n.width=Math.ceil(p+t*2*o),n.height=Math.ceil(v+t*o),s.textBaseline="alphabetic",s.direction=r?"rtl":"ltr";let f=t*o;for(const i of e){s.font=u(i),s.letterSpacing=`${(i.track??0)*i.size*o}px`,s.fillStyle=`rgba(255,255,255,${i.alpha??1})`,f+=i.size*o*1.3;const c=a==="center"?n.width/2:a==="end"!==r?n.width-t*o:t*o;s.textAlign=a==="center"?"center":a==="end"!==r?"right":"left",s.fillText(i.text,c,f-i.size*o*.28)}const m=new he(n);return m.colorSpace=xe,m.anisotropy=4,m.minFilter=J,{texture:m,aspect:n.width/n.height,width:n.width,height:n.height}}function Je(e){const t=e.opsLean??={x:0,y:0,t:-1},r=matchMedia("(pointer: coarse)").matches;return{step(a,o){if(t.t!==o){t.t=o;const n=e.pointer.inside&&!r;t.x=O(t.x,n?e.pointer.x:0,2.6,a),t.y=O(t.y,n?e.pointer.y:0,2.6,a)}return t}}}const Q=new x;function et(e,t,r,a,o,n=1){Q.copy(r).sub(t).setLength(5).add(t),e.position.copy(t),e.lookAt(r),e.updateMatrixWorld();const s=new x().setFromMatrixColumn(e.matrixWorld,0),u=new x().setFromMatrixColumn(e.matrixWorld,1);e.position.addScaledVector(s,a*.32*n).addScaledVector(u,o*.2*n),e.lookAt(Q),e.rotateZ(-a*.016*n)}function tt(e){let t=-1;const r=new x;return(a,o,n,s={})=>{!o||Math.abs(a-t)<.08||(t=a,n.getWorldDirection(r),e.emit("ops",{head:(Math.atan2(r.x,-r.z)*180/Math.PI+360)%360,...s}))}}const G=new x;function ot(e,t){return G.copy(e).project(t),[G.x*.5+.5,G.y*.5+.5,G.z]}const at=()=>new Promise(e=>requestAnimationFrame(()=>e())),nt=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;export{Se as A,Ue as D,He as F,Ve as K,Pe as M,re as N,I as S,g as T,et as a,Xe as b,$e as c,ye as d,Ze as e,Qe as f,Ee as g,tt as h,at as i,je as j,Oe as k,Je as l,ot as m,Ie as n,Ne as o,We as p,Ye as q,Ge as r,nt as s,Ke as t};
