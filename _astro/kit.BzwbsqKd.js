import{q as Y,y as _,aM as J,H as ee,i as A,M as y,a as I,S as te,G as P,C as k,as as $,aJ as ie,X as O,at as le,b as ue,_ as ce,Y as he,V as g,ac as ae,ag as B,I as N,t as H,s as E,b2 as K,af as pe,v as de,u as X,a4 as me,aI as fe,a0 as ve,a1 as ge}from"./EditionWorld.astro_astro_type_script_index_0_lang.DKyZ0HWE.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const we=e=>Math.min(1,Math.max(0,e)),xe=(e,t,r)=>we((r-e)/(t-e)),be=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,_e=e=>String(e).padStart(2,"0"),M=Math.PI*2,Pe={first:.07,last:.93},Ee=["mk-voice","mk-suite","talent-atlas","mk-downloader"],Ie=e=>.19+e*.22,Ve=4,Ue=e=>.16+e*.23,We=.56,R=(()=>{let e=31;const t=()=>(e=e*1664525+1013904223>>>0)/4294967296;return Array.from({length:15},(r,o)=>{const a=.35+o*(M*1.22/15)+(t()-.5)*.18,n=19+o*2.35+(t()-.5)*2.4;return{x:Math.cos(a)*n,z:Math.sin(a)*n,r:n}})})(),ye=Math.atan2(R[0].z,R[0].x)-.5,je=e=>M*1.04*be(xe(.05,.5,e)),$e=e=>((Math.atan2(R[e].z,R[e].x)-ye)%M+M)%M,Se="#ffb347",oe="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",ke=`
  uniform sampler2D tScene; uniform vec2 uRes; uniform float uTime, uDpr;
  uniform float uGrade, uThermal, uGain, uRawGain, uNoise, uScan, uBloom, uVig, uHex, uPower, uFlash, uWarm, uTilt, uTiltAt;
  uniform vec4 uBand; uniform vec4 uLock; uniform vec3 uLockAmt; uniform vec3 uLockCol; uniform vec3 uRawTint;
  varying vec2 vUv;
  float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
  // green phosphor (P43), in linear light: black, a deep bottle green, the bright lime the eye reads as night vision, and
  // highlights burning toward white the way a tube saturates
  vec3 phosphor(float l){
    l = max(l, 0.);
    l = l * l / (l + .14) * 1.14;                       // a toe: the shadows stay black, the mids come up
    vec3 c = vec3(.07, .6, .05) * l;
    c += vec3(.5, .4, .46) * pow(max(l - .5, 0.), 1.4);   // highlights burn toward white
    return c;
  }
  // ironbow thermal: cold violet-black, magenta, red, amber, white-hot
  vec3 iron(float t){
    t = clamp(t, 0., 1.2);
    vec3 c = mix(vec3(.004, .002, .02), vec3(.09, .01, .22), smoothstep(0., .22, t));
    c = mix(c, vec3(.55, .02, .25), smoothstep(.18, .42, t));
    c = mix(c, vec3(1., .16, .02), smoothstep(.38, .62, t));
    c = mix(c, vec3(1., .62, .04), smoothstep(.58, .82, t));
    return mix(c, vec3(1.25, 1.2, .95), smoothstep(.8, 1.1, t));
  }
  // the tube's fibre-optic honeycomb, faint: distance to the nearest hex cell edge
  float hexEdge(vec2 p){
    p.x *= 1.1547; p.y += mod(floor(p.x), 2.) * .5;
    vec2 f = abs(fract(p) - .5);
    return smoothstep(.05, .0, abs(max(f.x * 1.5 + f.y, f.y * 2.) - 1.) * .5);
  }
  void main(){
    vec2 uv = vUv, asp = vec2(uRes.x / uRes.y, 1.);
    vec4 s = texture2D(tScene, uv);
    // a shallow focus for the views from the air: the top and the bottom of the picture go soft (a miniature's depth)
    float soft = uTilt * smoothstep(.2, .5, abs(uv.y - .5 - uTiltAt));
    if (soft > .001) s = mix(s, textureLod(tScene, uv, 1. + soft * 2.2), min(1., soft * 1.4));
    // halation: the target's mips, a wide soft halo round whatever is bright
    vec4 b1 = textureLod(tScene, uv, 2.5), b2 = textureLod(tScene, uv, 4.), b3 = textureLod(tScene, uv, 5.5);
    vec3 bl = b1.rgb * .42 + b2.rgb * .34 + b3.rgb * .3;
    float bMask = clamp(b1.a * .5 + b2.a * .5, 0., 1.) * uGrade;
    float r = length((uv - .5) * asp);
    // the tube powering on: the whole image surges up at once, overexposed, and settles (never an iris)
    float pw = uPower, on = smoothstep(0., .16, pw);
    float gain = uGain * (1. + 2.6 * exp(-pw * 5.) * step(.001, pw) * step(pw, .999));
    float mask = clamp(s.a, 0., 1.) * uGrade;
    // a band of thermal sweeping across (x, half width, softness, amount), a hairline at each edge
    float bd = abs(uv.x - uBand.x), band = uBand.w * smoothstep(uBand.y + uBand.z, uBand.y, bd);
    float bandEdge = uBand.w * (1. - smoothstep(.0, 1.5 / uRes.x, abs(bd - uBand.y - uBand.z * .5)));
    float th = clamp(uThermal + band, 0., 1.);
    float l = luma(s.rgb) * gain;
    // thermal ranges itself to the scene (as a thermal camera's auto gain does): the dark land runs violet to red, the
    // lines and anything lit run amber to white
    vec3 graded = mix(phosphor(l), iron(pow(l * 2.6, .75)), th);
    vec3 raw = s.rgb * uRawGain * uRawTint;
    vec3 col = mix(raw, graded, mask);
    // halation in the grade where the picture is graded, in its own colour where it is not
    float bl_l = max(luma(bl) * gain - .22, 0.);
    vec3 bloomC = mix(max(bl * uRawGain - .18, 0.) * uRawTint, mix(phosphor(bl_l * 1.4), iron(pow(bl_l * 2.6, .75)) * .5, th), bMask);
    col += bloomC * uBloom;
    col += vec3(1., .85, .6) * bandEdge * .6;
    // the tube's texture: honeycomb in the light, scintillation in the dark, a sparkle now and then
    vec2 fc = gl_FragCoord.xy;
    col *= 1. - uHex * hexEdge(fc / (5.5 * uDpr)) * mask * smoothstep(.02, .3, l);
    float frame = floor(uTime * 30.);
    float n = hash(fc + frame * vec2(17.13, 29.71)), n2 = hash(fc.yx * 1.37 + frame * vec2(5.3, 7.9));
    float dark = 1. - smoothstep(0., .45, l);
    // grain in proportion to the light (perceptually even: added in linear light at a flat level it lifts the blacks into a
    // grey haze once encoded), a little more of it in the shadows the way a tube's is
    float lum0 = max(luma(col), 0.);
    col += (n - .5) * uNoise * (.35 + .65 * mask) * (sqrt(lum0) * (1.1 + .6 * dark) + .012) * 1.6 * vec3(mix(.9, .55, mask), 1., mix(.9, .6, mask));
    col += phosphor(1.6) * step(1. - .0016 * uNoise * 6., n2) * mask * (.4 + dark);
    // fine scanlines (three CSS px) with a slow brighter roll
    float y = fc.y / uDpr;
    col *= 1. - uScan * (.5 + .5 * sin(y * 2.0944)) * (.6 + .4 * mask);
    col *= 1. + uScan * .35 * exp(-pow(fract(uv.y * .5 - uTime * .045) * 8. - 4., 2.));
    // the vignette breathes with the tube's gain
    float br = .035 * sin(uTime * .63) + .02 * sin(uTime * 1.71 + 1.3);
    col *= mix(1., smoothstep(1.28 + br, .22 + br * .5, r), uVig);
    // a flare washing the tube (a bright source in view), and the warm-up
    col = mix(col, mix(vec3(1.1, 1.05, 1.), phosphor(1.7), mask), uFlash);
    col *= mix(1., on, step(.001, pw) * step(pw, .999));
    if (pw <= .001) col *= 0.;
    // the lock: corner brackets that close in on the target's rect (uv), with mid ticks; a thin cross outside it
    if (uLockAmt.y > .001) {
      vec2 P = uv * uRes, A = uLock.xy * uRes, B = uLock.zw * uRes;
      float grow = (1. - uLockAmt.x) * min(uRes.x, uRes.y) * .07;
      A -= grow; B += grow;
      vec2 C = (A + B) * .5, H = (B - A) * .5, ap = abs(P - C), q = ap - H;
      float w = 1.25 * uDpr, arm = min(H.x, H.y) * .2;
      float hx = step(H.x - arm, ap.x) * step(ap.x, H.x + w * .5) * (1. - smoothstep(w * .5 - .6, w * .5 + .6, abs(q.y)));
      float vy = step(H.y - arm, ap.y) * step(ap.y, H.y + w * .5) * (1. - smoothstep(w * .5 - .6, w * .5 + .6, abs(q.x)));
      float tick = step(ap.x, w * .5 + .5) * step(abs(q.y + 7. * uDpr), 6. * uDpr) + step(ap.y, w * .5 + .5) * step(abs(q.x + 7. * uDpr), 6. * uDpr);
      // the cross: thin lines from the brackets out to the edges of the screen, gapped round the target
      float cx = step(abs(P.y - C.y), w * .45) * step(H.x + 18. * uDpr, ap.x) * uLockAmt.z;
      float cy = step(abs(P.x - C.x), w * .45) * step(H.y + 18. * uDpr, ap.y) * uLockAmt.z;
      float m = clamp(max(max(hx, vy), tick) + (cx + cy) * .35, 0., 1.) * uLockAmt.y;
      col = mix(col, uLockCol, m);
    }
    gl_FragColor = vec4(max(col, 0.), 1.);
  }`,ze=()=>({tScene:{value:null},uRes:{value:new E(1,1)},uTime:{value:0},uDpr:{value:1},uGrade:{value:1},uThermal:{value:0},uGain:{value:1},uRawGain:{value:1},uRawTint:{value:new k(1,1,1)},uNoise:{value:.09},uScan:{value:.06},uBloom:{value:.9},uVig:{value:.75},uHex:{value:.05},uPower:{value:1},uFlash:{value:0},uWarm:{value:0},uBand:{value:new H(0,0,.02,0)},uTilt:{value:0},uTiltAt:{value:0},uLock:{value:new H(.4,.4,.6,.6)},uLockAmt:{value:new g(0,0,0)},uLockCol:{value:new k(Se)}});function Oe(e,t,r){const o=new Y(1,1,{type:ee,samples:e.quality?4:0,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,generateMipmaps:!0,minFilter:J,magFilter:_}),a=ze();a.tScene.value=o.texture;const n=new A({vertexShader:oe,fragmentShader:ke,uniforms:a,depthTest:!1,depthWrite:!1}),s=new y(new I(2,2),n);s.frustumCulled=!1,s.renderOrder=-10;const l=new te,h=new P;l.add(s,h);function p(){const c=Math.max(2,Math.round(e.viewport.width*e.viewport.dpr)),u=Math.max(2,Math.round(e.viewport.height*e.viewport.dpr));(o.width!==c||o.height!==u)&&o.setSize(c,u),a.uRes.value.set(c,u),a.uDpr.value=e.viewport.dpr}p();const d=new k;function m(c){const u=e.renderer,v=u.getRenderTarget(),f=u.getClearAlpha();u.getClearColor(d),u.setRenderTarget(o),u.setClearColor(0,1),u.clear(!0,!0,!0),u.render(t,r),u.setRenderTarget(v),u.setClearColor(d,f),a.uTime.value=c}function i(){const c=e.renderer,u=c.getRenderTarget();c.setRenderTarget(o);const v=c.compileAsync(t,r).catch(()=>{}).then(()=>m(0));return c.setRenderTarget(u),v}return{scene:l,overlay:h,U:a,rt:o,resize:p,render:m,warm:i,dispose(){o.dispose(),n.dispose(),s.geometry.dispose()}}}const D=e=>e-Math.floor(e);function F(e,t){let r=D(e*.1031),o=D(t*.1031),a=D(e*.1031);const n=r*(o+33.33)+o*(a+33.33)+a*(r+33.33);return r+=n,o+=n,a+=n,D((r+o)*a)}function ne(e,t){const r=Math.floor(e),o=Math.floor(t),a=e-r,n=t-o,s=a*a*a*(a*(a*6-15)+10),l=n*n*n*(n*(n*6-15)+10),h=F(r,o),p=F(r+1,o),d=F(r,o+1),m=F(r+1,o+1);return(h+(p-h)*s)*(1-l)+(d+(m-d)*s)*l}function q(e,t,r){let o=0,a=.5;for(let n=0;n<r;n++){o+=a*ne(e,t);const s=1.6*e-1.2*t+5.3,l=1.2*e+1.6*t+1.9;e=s,t=l,a*=.5}return o}function Te(e,t,r){let o=0,a=.5,n=0;for(let s=0;s<r;s++){const l=1-Math.abs(2*ne(e,t)-1);o+=a*l*l,n+=a;const h=1.6*e-1.2*t+5.3,p=1.2*e+1.6*t+1.9;e=h,t=p,a*=.5}return o/n}const re=`
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }
  float fbm(vec2 p, int oct){ float v = 0., a = .5; for (int i = 0; i < 6; i++){ if (i >= oct) break; v += a * vnoise(p); p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v; }
  float ridge(vec2 p, int oct){ float v = 0., a = .5, n = 0.; for (int i = 0; i < 6; i++){ if (i >= oct) break; float k = 1. - abs(2. * vnoise(p) - 1.); v += a * k * k; n += a; p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v / n; }`,x={size:180,res:1024,hq:1.4,minor:.5,major:2.5};function se(e,t){const r=e*.03,o=t*.03,a=q(r*.8+3.1,o*.8+1.7,3)-.5,n=q(r*.8+8.3,o*.8+2.9,3)-.5,s=r+a*1.4,l=o+n*1.4,h=q(s,l,5),p=Te(s*1.7+4.2,l*1.7+4.2,4);let d=(h-.5)*10+p*p*6.5-1;const m=Math.hypot(e,t),i=Math.min(1,Math.max(0,(11-m)/6)),c=i*i*(3-2*i);return d+=(x.hq-d)*c,d}const Me=`
  float rawHeight(vec2 xz){
    vec2 p = xz * .03;
    vec2 w = vec2(fbm(p * .8 + vec2(3.1, 1.7), 3), fbm(p * .8 + vec2(8.3, 2.9), 3)) - .5;
    vec2 q = p + w * 1.4;
    float b = fbm(q, 5), r = ridge(q * 1.7 + 4.2, 4);
    float h = (b - .5) * 10. + r * r * 6.5 - 1.;
    return mix(h, ${x.hq.toFixed(3)}, smoothstep(11., 5., length(xz)));
  }`,V=R.map(({x:e,z:t})=>({x:e,z:t,y:se(e,t),a:Math.atan2(t,e)})),z={inner:1.7,outer:3.4};function Re(e,t){let r=se(e,t);for(const o of V){const a=Math.hypot(e-o.x,t-o.z);if(a<z.outer){const n=Math.min(1,(z.outer-a)/(z.outer-z.inner)),s=n*n*(3-2*n);r+=(o.y-r)*s}}return r}const Ae=`
  ${re}
  ${Me}
  varying vec2 vUv;
  void main(){
    vec2 xz = (vUv - .5) * ${x.size.toFixed(1)};
    float h = rawHeight(xz);
    ${V.map(e=>`{ float d = length(xz - vec2(${e.x.toFixed(4)}, ${e.z.toFixed(4)})); h = mix(h, ${e.y.toFixed(4)}, smoothstep(${z.outer.toFixed(2)}, ${z.inner.toFixed(2)}, d)); }`).join(`
    `)}
    gl_FragColor = vec4(h, 0., 0., 1.);
  }`;let T=null;function Ce(e){if(T)return T.texture;const t=x.res;T=new Y(t,t,{type:ee,depthBuffer:!1,generateMipmaps:!1,minFilter:_,magFilter:_,wrapS:K,wrapT:K});const r=new A({vertexShader:oe,fragmentShader:Ae,depthTest:!1,depthWrite:!1}),o=new y(new I(2,2),r),a=new te,n=new pe(-1,1,1,-1,0,1);o.frustumCulled=!1,a.add(o);const s=e.getRenderTarget();return e.setRenderTarget(T),e.render(a,n),e.setRenderTarget(s),r.dispose(),o.geometry.dispose(),T.texture}const Le=()=>({uHeight:{value:null},uSize:{value:x.size},uTexel:{value:x.size/x.res},uTime:{value:0},uMinor:{value:x.minor},uMajor:{value:x.major},uSun:{value:new g(-.6,.36,-.5).normalize()},uAmbient:{value:.07},uShade:{value:.2},uContour:{value:.55},uGrid:{value:.25},uRings:{value:0},uReveal:{value:999},uRevealAt:{value:new E(0,0)},uSweep:{value:new E(0,0)},uSpot:{value:new H(0,0,6,0)},uGround:{value:new k("#ffffff")},uLine:{value:new k("#ffffff")},uSky:{value:new k("#000000")},uFog:{value:.012},uWarmSide:{value:new k("#000000")},uDetail:{value:.5},uBlob:{value:new H(0,0,2.6,.8)}}),De=`
  uniform sampler2D uHeight; uniform float uSize;
  varying vec3 vW;
  void main(){
    vec4 w = modelMatrix * vec4(position, 1.);
    w.y = texture2D(uHeight, w.xz / uSize + .5).r;
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,Fe=`
  uniform sampler2D uHeight; uniform float uSize, uTexel, uTime, uMinor, uMajor, uAmbient, uShade, uContour, uGrid, uRings, uReveal, uFog, uDetail;
  uniform vec3 uSun, uGround, uLine, uSky, uWarmSide; uniform vec2 uRevealAt, uSweep; uniform vec4 uSpot, uBlob;
  varying vec3 vW;
  ${re}
  float H(vec2 xz){ return texture2D(uHeight, xz / uSize + .5).r; }
  float lines(float v, float w){ float fw = max(fwidth(v), 1e-4); float d = abs(fract(v - .5) - .5) / fw; return (1. - smoothstep(w * .5, w * .5 + 1., d)) * min(1., .32 / fw); }
  float far = 0.;   // set in main: lines thicken a little with distance, so the map reads from the air
  void main(){
    vec2 xz = vW.xz;
    float h = H(xz), e = uTexel;
    vec3 n = normalize(vec3(H(xz - vec2(e, 0.)) - H(xz + vec2(e, 0.)), 2. * e, H(xz - vec2(0., e)) - H(xz + vec2(0., e))));
    float lit = max(dot(n, uSun), 0.), slope = 1. - n.y;
    float dist = length(vW - cameraPosition);
    // the land: hillshade, a little ambient, the illuminator's pool
    vec2 sd = (xz - uSpot.xy) / uSpot.z;
    float spot = exp(-dot(sd, sd) * 1.6) * uSpot.w;
    // the ground's grain (gravel, scrub) shows where there is light enough to see it
    float grit = uDetail > 0. ? (vnoise(xz * 9.) * .55 + vnoise(xz * 27. + 3.) * .45 - .5) * uDetail * smoothstep(30., 4., dist) : 0.;
    vec3 col = uGround * (uAmbient + lit * uShade + spot * (.35 + .65 * lit)) * (1. - slope * .35) * (1. + grit);
    col += uWarmSide * pow(max(dot(n, normalize(vec3(.8, .25, .5))), 0.), 2.);
    vec2 bq = (xz - uBlob.xy) / vec2(uBlob.z, uBlob.z * .45);
    col *= 1. - uBlob.w * exp(-dot(bq, bq) * 1.5);
    // revealed from a point outward (the map drawing itself), with a bright drawing edge
    float rd = length(xz - uRevealAt);
    float shown = smoothstep(uReveal, uReveal - 4., rd), fr = max(fwidth(rd), 1e-4);
    float edge = ((1. - smoothstep(.4, 1.6, abs(rd - uReveal) / fr)) * .8 + exp(-max(uReveal - rd, 0.) * .9) * step(rd, uReveal) * .1) * step(1., uReveal) * step(uReveal, 400.);
    // contours: minor and major (heavier), fading out where they crowd at a distance
    far = smoothstep(25., 90., dist);
    float cmin = lines(h / uMinor, 1. + far * .4), cmaj = lines(h / uMajor, 1.8 + far * 1.4);
    float con = max(cmin * .5, cmaj * (1.25 + far * .5)) * uContour * (.8 + .4 * smoothstep(-2., 7., h));   // higher ground a little brighter
    col += uGround * (smoothstep(-3., 9., h) * .09 + lit * .34) * far;   // from the air the relief takes more of the moon, and the high ground glows
    // the grid: ten-unit squares, small crosses where they meet
    vec2 g = xz / 10.;
    float grid = max(lines(g.x, .9), lines(g.y, .9)) * uGrid;
    vec2 cq = abs(fract(g + .5) - .5) * 10., aw = fwidth(xz) * 1.2;
    float plus = step(min(cq.x / aw.x, cq.y / aw.y), 1.) * step(max(cq.x, cq.y), .3) * uGrid * 1.6;
    // radar: range rings and a sweep with its afterglow, from HQ
    float rr = length(xz), ring = lines(rr / 12., 1.2) * uRings * step(rr, 61.);
    float a = atan(xz.y, xz.x), ago = mod(uSweep.x - a, 6.28318);
    float sweep = (exp(-ago * 1.6) * .6 + exp(-ago * 28.) * 1.2) * uSweep.y * step(rr, 61.) * smoothstep(61., 50., rr);
    float bw = length(fwidth(xz)) * 2. / max(rr, .1);   // the beam's leading edge, a pixel or so wide at any range (atan's seam has no width)
    float beam = (1. - smoothstep(0., bw, min(ago, 6.28318 - ago))) * uSweep.y * step(rr, 60.) * smoothstep(0., 3., rr);
    vec3 ink = uLine * (con * (1. + sweep * .9) + grid * .5 + plus * .6 + ring * .6) * shown;
    col = col * mix(.35, 1., shown) + ink + uLine * (edge * .9 + sweep * .42 + beam * 1.5);
    // distance: into the night (or the morning haze)
    float fog = 1. - exp(-dist * uFog);
    col = mix(col, uSky, fog);
    gl_FragColor = vec4(col, 1.);
  }`;function Ne(e,{span:t=x.size,seg:r=e.quality?320:200}={}){const o=Le();o.uHeight.value=Ce(e.renderer);const a=`${t}:${r}`,n=Z.get(a)??Z.set(a,new I(t,t,r,r).rotateX(-Math.PI/2)).get(a),s=new y(n,new A({vertexShader:De,fragmentShader:Fe,uniforms:o}));return s.frustumCulled=!1,{mesh:s,U:o,dispose(){s.material.dispose()}}}const Z=new Map;function Ge(){const e=[new g(0,x.hq,4),...V.map(t=>new g(t.x,t.y,t.z))];return new fe(e,!1,"centripetal",.5)}function Ke(e=Ge(),{width:t=.14,lift:r=.07,samples:o=1400}={}){const a=[],n=[],s=[],l=new g,h=new g,p=new g,d=new g(0,1,0),m=e.getLength();for(let u=0;u<=o;u++){const v=u/o;e.getPointAt(v,l),e.getTangentAt(v,h),p.crossVectors(h,d).normalize().multiplyScalar(t/2);for(const f of[-1,1]){const b=l.x+p.x*f,w=l.z+p.z*f;a.push(b,Re(b,w)+r,w),n.push(v*m,f*.5+.5)}if(u<o){const f=u*2;s.push(f,f+1,f+2,f+1,f+3,f+2)}}const i=new ae;i.setAttribute("position",new B(a,3)),i.setAttribute("uv",new B(n,2)),i.setIndex(s);const c=new A({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uShow:{value:1},uHead:{value:1e5},uColor:{value:new k("#ffffff")},uLevel:{value:1.2}},vertexShader:"varying vec2 vUv; varying float vD; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vD = distance(w.xyz, cameraPosition); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform float uTime, uShow, uHead, uLevel; uniform vec3 uColor; varying vec2 vUv; varying float vD;
      void main(){
        float dash = step(.42, fract(vUv.x * .9 - uTime * .35));
        float edge = smoothstep(0., .25, vUv.y) * smoothstep(1., .75, vUv.y);
        float a = dash * edge * uShow * step(vUv.x, uHead) * smoothstep(4.5, 12., vD);   // not under the camera's nose
        if (a < .01) discard;
        gl_FragColor = vec4(uColor * uLevel, a);
      }`});return{mesh:new y(i,c),length:m}}function Xe(){const e=new P,t=new $(ie(),{depth:.5,curveSegments:2,bevelEnabled:!0,bevelThickness:.07,bevelSize:.06,bevelSegments:1});t.translate(-3.87/2,0,-.25),t.computeVertexNormals();const r=new O({color:"#4d544e",roughness:.36,metalness:.7});r.onBeforeCompile=f=>{f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vObj; float spk(vec3 p){ return fract(sin(dot(floor(p * 90.), vec3(12.9898, 78.233, 37.719))) * 43758.5453); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
float sp = spk(vObj); roughnessFactor = clamp(roughnessFactor + (sp - .5) * .12, .3, 1.);`).replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= .95 + .1 * spk(vObj + 3.1);`)};const o=new y(t,r);o.position.y=.32;const a=de.width+.9,n=1.2,s=.12,l=new le;l.moveTo(-a/2+s,-n/2),l.lineTo(a/2-s,-n/2),l.lineTo(a/2,-n/2+s),l.lineTo(a/2,n/2-s),l.lineTo(a/2-s,n/2),l.lineTo(-a/2+s,n/2),l.lineTo(-a/2,n/2-s),l.lineTo(-a/2,-n/2+s),l.closePath();const h=new $(l,{depth:.26,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:1});h.rotateX(Math.PI/2),h.translate(0,.3,0);const p=new y(h,new O({color:"#3c403c",roughness:.8,metalness:.3})),d=new ue({color:"#ffffff",toneMapped:!1}),m=new P,i=new y(new ce(.2,.12,.16),p.material),c=new y(new he(.045,.045,.05,16),d);c.position.y=.08,m.add(i,c),m.position.set(a/2-.3,.36,.3);const u=Be();return u.mesh.position.set(-3.87/2,0,.326),o.add(u.mesh),e.add(o,p,m),{group:e,body:o,blink:(f,b=1)=>{const w=f%1.45/1.45,S=(w<.045?1:w>.1&&w<.13?.55:0)*b;d.color.setScalar(.15+S*26)},tape:u.U,dispose(){t.dispose(),h.dispose(),r.dispose(),p.material.dispose(),d.dispose(),i.geometry.dispose(),c.geometry.dispose(),u.dispose()}}}function Be(e=.028){const t=[],r=[],o=[];X.forEach((l,h)=>{let p=0;const d=l.map((i,c)=>{const u=l[(c+1)%l.length],v=Math.hypot(u[0]-i[0],u[1]-i[1]);return p+=v,v});let m=0;l.forEach((i,c)=>{const u=l[(c+1)%l.length],v=(u[0]-i[0])/d[c],f=(u[1]-i[1])/d[c],b=-f*e/2,w=v*e/2,S=t.length/3,C=v*e/2,L=f*e/2;t.push(i[0]-C+b,i[1]-L+w,0,i[0]-C-b,i[1]-L-w,0,u[0]+C+b,u[1]+L+w,0,u[0]+C-b,u[1]+L-w,0);const U=X.length,W=(h+m/p)/U,j=(h+(m+d[c])/p)/U;r.push(W,W,j,j),o.push(S,S+1,S+2,S+1,S+3,S+2),m+=d[c]})});const a=new ae;a.setAttribute("position",new B(t,3)),a.setAttribute("aS",new B(r,1)),a.setIndex(o);const n={uDraw:{value:1},uLevel:{value:1.4}},s=new A({uniforms:n,side:me,toneMapped:!1,vertexShader:"attribute float aS; varying float vS; void main(){ vS = aS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uDraw, uLevel; varying float vS;
      void main(){
        if (vS > uDraw + .001) discard;
        float head = exp(-(uDraw - vS) * 26.) * step(uDraw, .999);
        gl_FragColor = vec4(vec3(uLevel * (1. + head * 3.)), 1.);
      }`});return{mesh:new y(a,s),U:n,dispose(){a.dispose(),s.dispose()}}}const He={en:'"Inter Variable", "Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif',display:'"Space Grotesk Variable", "Inter Variable", system-ui, sans-serif'},Ze=()=>Promise.allSettled([document.fonts.load('300 40px "Inter Variable"'),document.fonts.load('600 40px "Inter Variable"'),document.fonts.load('500 40px "Space Grotesk Variable"'),document.fonts.load('600 40px "Cairo Variable"')]);function Qe(e,{pad:t=12,rtl:r=!1,align:o="start",scale:a=2}={}){const n=document.createElement("canvas"),s=n.getContext("2d"),l=i=>`${i.weight??500} ${i.size*a}px ${i.font??He.en}`;let h=0,p=t*a;for(const i of e)s.font=l(i),s.letterSpacing=`${(i.track??0)*i.size*a}px`,h=Math.max(h,s.measureText(i.text).width),p+=i.size*a*1.3;n.width=Math.ceil(h+t*2*a),n.height=Math.ceil(p+t*a),s.textBaseline="alphabetic",s.direction=r?"rtl":"ltr";let d=t*a;for(const i of e){s.font=l(i),s.letterSpacing=`${(i.track??0)*i.size*a}px`,s.fillStyle=`rgba(255,255,255,${i.alpha??1})`,d+=i.size*a*1.3;const c=o==="center"?n.width/2:o==="end"!==r?n.width-t*a:t*a;s.textAlign=o==="center"?"center":o==="end"!==r?"right":"left",s.fillText(i.text,c,d-i.size*a*.28)}const m=new ve(n);return m.colorSpace=ge,m.anisotropy=4,m.minFilter=J,{texture:m,aspect:n.width/n.height,width:n.width,height:n.height}}function Ye(e){const t=e.opsLean??={x:0,y:0,t:-1},r=matchMedia("(pointer: coarse)").matches;return{step(o,a){if(t.t!==a){t.t=a;const n=e.pointer.inside&&!r;t.x=N(t.x,n?e.pointer.x:0,2.6,o),t.y=N(t.y,n?e.pointer.y:0,2.6,o)}return t}}}const Q=new g;function Je(e,t,r,o,a,n=1){Q.copy(r).sub(t).setLength(5).add(t),e.position.copy(t),e.lookAt(r),e.updateMatrixWorld();const s=new g().setFromMatrixColumn(e.matrixWorld,0),l=new g().setFromMatrixColumn(e.matrixWorld,1);e.position.addScaledVector(s,o*.32*n).addScaledVector(l,a*.2*n),e.lookAt(Q),e.rotateZ(-o*.016*n)}function et(e){let t=-1;const r=new g;return(o,a,n,s={})=>{!a||Math.abs(o-t)<.08||(t=o,n.getWorldDirection(r),e.emit("ops",{head:(Math.atan2(r.x,-r.z)*180/Math.PI+360)%360,...s}))}}const G=new g;function tt(e,t){return G.copy(e).project(t),[G.x*.5+.5,G.y*.5+.5,G.z]}const at=()=>new Promise(e=>requestAnimationFrame(()=>e())),ot=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;export{Se as A,Ve as D,He as F,Ee as K,Pe as M,re as N,V as S,x as T,Je as a,Ke as b,$e as c,ye as d,Xe as e,Ze as f,_e as g,et as h,at as i,We as j,je as k,Ye as l,tt as m,Ie as n,Oe as o,Ue as p,Qe as q,Ge as r,ot as s,Ne as t};
