import{a3 as Z,a8 as q,aF as X,a4 as K,i as A,M as b,a as E,S as Q,G as P,C as x,an as V,aA as oe,B as W,ao as ae,b as ne,X as re,H as se,V as d,a9 as ie,ac as O,u as j,F as B,s as L,aQ as $,ab as ue,Z as le,aR as ce,ae as he,ak as pe,af as fe,ag as ve,D as me,J as de,o as we,p as ge}from"./EditionWorld.astro_astro_type_script_index_0_lang.BAoaIKwG.js";const xe=e=>Math.min(1,Math.max(0,e)),be=(e,t,o)=>xe((o-e)/(t-e)),ye=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,Ve=e=>String(e).padStart(2,"0"),R=Math.PI*2,We={first:.07,last:.93},Oe=.56,C=(()=>{let e=31;const t=()=>(e=e*1664525+1013904223>>>0)/4294967296;return Array.from({length:15},(o,r)=>{const a=.35+r*(R*1.22/15)+(t()-.5)*.18,n=19+r*2.35+(t()-.5)*2.4;return{x:Math.cos(a)*n,z:Math.sin(a)*n,r:n}})})(),Se=Math.atan2(C[0].z,C[0].x)-.5,je=e=>R*1.04*ye(be(.05,.5,e)),$e=e=>((Math.atan2(C[e].z,C[e].x)-Se)%R+R)%R,ze="#ffb347",J="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",Te=`
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
    // the tube powering on: a green bloom from the middle out, overexposed while it comes up
    float pw = uPower, on = smoothstep(pw * 1.5 + .02, pw * 1.5 - .3, r) * step(.001, pw);
    float gain = uGain * (1. + 3. * exp(-pw * 4.5) * step(.001, pw) * step(pw, .999));
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
    col += (n - .5) * uNoise * (.35 + .65 * mask) * (.45 + .9 * dark) * vec3(mix(.9, .55, mask), 1., mix(.9, .6, mask));
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
  }`,ke=()=>({tScene:{value:null},uRes:{value:new L(1,1)},uTime:{value:0},uDpr:{value:1},uGrade:{value:1},uThermal:{value:0},uGain:{value:1},uRawGain:{value:1},uRawTint:{value:new x(1,1,1)},uNoise:{value:.09},uScan:{value:.06},uBloom:{value:.9},uVig:{value:.75},uHex:{value:.05},uPower:{value:1},uFlash:{value:0},uWarm:{value:0},uBand:{value:new B(0,0,.02,0)},uTilt:{value:0},uTiltAt:{value:0},uLock:{value:new B(.4,.4,.6,.6)},uLockAmt:{value:new d(0,0,0)},uLockCol:{value:new x(ze)}});function Ne(e,t,o){const r=new Z(1,1,{type:K,samples:e.quality?4:0,depthBuffer:!0,generateMipmaps:!0,minFilter:X,magFilter:q}),a=ke();a.tScene.value=r.texture;const n=new A({vertexShader:J,fragmentShader:Te,uniforms:a,depthTest:!1,depthWrite:!1}),s=new b(new E(2,2),n);s.frustumCulled=!1,s.renderOrder=-10;const i=new Q,l=new P;i.add(s,l);function c(){const v=Math.max(2,Math.round(e.viewport.width*e.viewport.dpr)),h=Math.max(2,Math.round(e.viewport.height*e.viewport.dpr));(r.width!==v||r.height!==h)&&r.setSize(v,h),a.uRes.value.set(v,h),a.uDpr.value=e.viewport.dpr}c();const p=new x;function f(v){const h=e.renderer,w=h.getRenderTarget(),g=h.getClearAlpha();h.getClearColor(p),h.setRenderTarget(r),h.setClearColor(0,1),h.clear(!0,!0,!0),h.render(t,o),h.setRenderTarget(w),h.setClearColor(p,g),a.uTime.value=v}function u(){const v=e.renderer,h=v.getRenderTarget();v.setRenderTarget(r);const w=v.compileAsync(t,o).catch(()=>{}).then(()=>f(0));return v.setRenderTarget(h),w}return{scene:i,overlay:l,U:a,rt:r,resize:c,render:f,warm:u,dispose(){r.dispose(),n.dispose(),s.geometry.dispose()}}}const F=e=>e-Math.floor(e);function H(e,t){let o=F(e*.1031),r=F(t*.1031),a=F(e*.1031);const n=o*(r+33.33)+r*(a+33.33)+a*(o+33.33);return o+=n,r+=n,a+=n,F((o+r)*a)}function Y(e,t){const o=Math.floor(e),r=Math.floor(t),a=e-o,n=t-r,s=a*a*a*(a*(a*6-15)+10),i=n*n*n*(n*(n*6-15)+10),l=H(o,r),c=H(o+1,r),p=H(o,r+1),f=H(o+1,r+1);return(l+(c-l)*s)*(1-i)+(p+(f-p)*s)*i}function _(e,t,o){let r=0,a=.5;for(let n=0;n<o;n++){r+=a*Y(e,t);const s=1.6*e-1.2*t+5.3,i=1.2*e+1.6*t+1.9;e=s,t=i,a*=.5}return r}function Me(e,t,o){let r=0,a=.5,n=0;for(let s=0;s<o;s++){const i=1-Math.abs(2*Y(e,t)-1);r+=a*i*i,n+=a;const l=1.6*e-1.2*t+5.3,c=1.2*e+1.6*t+1.9;e=l,t=c,a*=.5}return r/n}const I=`
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }
  float fbm(vec2 p, int oct){ float v = 0., a = .5; for (int i = 0; i < 6; i++){ if (i >= oct) break; v += a * vnoise(p); p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v; }
  float ridge(vec2 p, int oct){ float v = 0., a = .5, n = 0.; for (int i = 0; i < 6; i++){ if (i >= oct) break; float k = 1. - abs(2. * vnoise(p) - 1.); v += a * k * k; n += a; p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v / n; }`,m={size:180,res:1024,hq:1.4,minor:.5,major:2.5};function ee(e,t){const o=e*.03,r=t*.03,a=_(o*.8+3.1,r*.8+1.7,3)-.5,n=_(o*.8+8.3,r*.8+2.9,3)-.5,s=o+a*1.4,i=r+n*1.4,l=_(s,i,5),c=Me(s*1.7+4.2,i*1.7+4.2,4);let p=(l-.5)*10+c*c*6.5-1;const f=Math.hypot(e,t),u=Math.min(1,Math.max(0,(11-f)/6)),v=u*u*(3-2*u);return p+=(m.hq-p)*v,p}const Re=`
  float rawHeight(vec2 xz){
    vec2 p = xz * .03;
    vec2 w = vec2(fbm(p * .8 + vec2(3.1, 1.7), 3), fbm(p * .8 + vec2(8.3, 2.9), 3)) - .5;
    vec2 q = p + w * 1.4;
    float b = fbm(q, 5), r = ridge(q * 1.7 + 4.2, 4);
    float h = (b - .5) * 10. + r * r * 6.5 - 1.;
    return mix(h, ${m.hq.toFixed(3)}, smoothstep(11., 5., length(xz)));
  }`,k=C.map(({x:e,z:t})=>({x:e,z:t,y:ee(e,t),a:Math.atan2(t,e)})),T={inner:1.7,outer:3.4};function Ce(e,t){let o=ee(e,t);for(const r of k){const a=Math.hypot(e-r.x,t-r.z);if(a<T.outer){const n=Math.min(1,(T.outer-a)/(T.outer-T.inner)),s=n*n*(3-2*n);o+=(r.y-o)*s}}return o}const Ae=`
  ${I}
  ${Re}
  varying vec2 vUv;
  void main(){
    vec2 xz = (vUv - .5) * ${m.size.toFixed(1)};
    float h = rawHeight(xz);
    ${k.map(e=>`{ float d = length(xz - vec2(${e.x.toFixed(4)}, ${e.z.toFixed(4)})); h = mix(h, ${e.y.toFixed(4)}, smoothstep(${T.outer.toFixed(2)}, ${T.inner.toFixed(2)}, d)); }`).join(`
    `)}
    gl_FragColor = vec4(h, 0., 0., 1.);
  }`;let M=null;function Ge(e){if(M)return M.texture;const t=m.res;M=new Z(t,t,{type:K,depthBuffer:!1,generateMipmaps:!1,minFilter:q,magFilter:q,wrapS:$,wrapT:$});const o=new A({vertexShader:J,fragmentShader:Ae,depthTest:!1,depthWrite:!1}),r=new b(new E(2,2),o),a=new Q,n=new ue(-1,1,1,-1,0,1);r.frustumCulled=!1,a.add(r);const s=e.getRenderTarget();return e.setRenderTarget(M),e.render(a,n),e.setRenderTarget(s),o.dispose(),r.geometry.dispose(),M.texture}const Fe=()=>({uHeight:{value:null},uSize:{value:m.size},uTexel:{value:m.size/m.res},uTime:{value:0},uMinor:{value:m.minor},uMajor:{value:m.major},uSun:{value:new d(-.5,.62,-.35).normalize()},uAmbient:{value:.07},uShade:{value:.2},uContour:{value:.55},uGrid:{value:.25},uRings:{value:0},uReveal:{value:999},uRevealAt:{value:new L(0,0)},uSweep:{value:new L(0,0)},uSpot:{value:new B(0,0,6,0)},uGround:{value:new x("#ffffff")},uLine:{value:new x("#ffffff")},uSky:{value:new x("#000000")},uFog:{value:.012},uWarmSide:{value:new x("#000000")},uDetail:{value:.5},uBlob:{value:new B(0,0,2.6,.8)}}),He=`
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
  ${I}
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
    col += uGround * smoothstep(-3., 9., h) * .05 * far;   // and a faint glow of the high ground, seen from the air
    // the grid: ten-unit squares, small crosses where they meet
    vec2 g = xz / 10.;
    float grid = max(lines(g.x, .9), lines(g.y, .9)) * uGrid;
    vec2 cq = abs(fract(g + .5) - .5) * 10., aw = fwidth(xz) * 1.2;
    float plus = step(min(cq.x / aw.x, cq.y / aw.y), 1.) * step(max(cq.x, cq.y), .3) * uGrid * 1.6;
    // radar: range rings and a sweep with its afterglow, from HQ
    float rr = length(xz), ring = lines(rr / 12., 1.2) * uRings * step(rr, 61.);
    float a = atan(xz.y, xz.x), ago = mod(uSweep.x - a, 6.28318);
    float sweep = (exp(-ago * 1.3) * .55 + exp(-ago * 28.) * 1.4) * uSweep.y * step(rr, 61.) * smoothstep(61., 50., rr);
    vec3 ink = uLine * (con * (1. + sweep * .9) + grid * .5 + plus * .6 + ring * .6) * shown;
    col = col * mix(.35, 1., shown) + ink + uLine * (edge * .9 + sweep * .16);
    // distance: into the night (or the morning haze)
    float fog = 1. - exp(-dist * uFog);
    col = mix(col, uSky, fog);
    gl_FragColor = vec4(col, 1.);
  }`;function Ue(e,{span:t=m.size,seg:o=e.quality?320:200}={}){const r=Fe();r.uHeight.value=Ge(e.renderer);const a=new E(t,t,o,o);a.rotateX(-Math.PI/2);const n=new b(a,new A({vertexShader:He,fragmentShader:De,uniforms:r}));return n.frustumCulled=!1,{mesh:n,U:r,dispose(){a.dispose(),n.material.dispose()}}}function te(){const e=[new d(0,m.hq,4),...k.map(t=>new d(t.x,t.y,t.z))];return new ce(e,!1,"centripetal",.5)}function Ze(e=te(),{width:t=.14,lift:o=.07,samples:r=1400}={}){const a=[],n=[],s=[],i=new d,l=new d,c=new d,p=new d(0,1,0),f=e.getLength();for(let h=0;h<=r;h++){const w=h/r;e.getPointAt(w,i),e.getTangentAt(w,l),c.crossVectors(l,p).normalize().multiplyScalar(t/2);for(const g of[-1,1]){const S=i.x+c.x*g,G=i.z+c.z*g;a.push(S,Ce(S,G)+o,G),n.push(w*f,g*.5+.5)}if(h<r){const g=h*2;s.push(g,g+1,g+2,g+1,g+3,g+2)}}const u=new ie;u.setAttribute("position",new O(a,3)),u.setAttribute("uv",new O(n,2)),u.setIndex(s);const v=new A({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uShow:{value:1},uHead:{value:1e5},uColor:{value:new x("#ffffff")},uLevel:{value:1.2}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime, uShow, uHead, uLevel; uniform vec3 uColor; varying vec2 vUv;
      void main(){
        float dash = step(.42, fract(vUv.x * .9 - uTime * .35));
        float edge = smoothstep(0., .25, vUv.y) * smoothstep(1., .75, vUv.y);
        float a = dash * edge * uShow * step(vUv.x, uHead);
        if (a < .01) discard;
        gl_FragColor = vec4(uColor * uLevel, a);
      }`});return{mesh:new b(u,v),length:f}}function Xe(){const e=new P,t=new V(oe(),{depth:.5,curveSegments:2,bevelEnabled:!0,bevelThickness:.07,bevelSize:.06,bevelSegments:1});t.translate(-3.87/2,0,-.25),t.computeVertexNormals();const o=new W({color:"#4d544e",roughness:.36,metalness:.7});o.onBeforeCompile=w=>{w.vertexShader=w.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`),w.fragmentShader=w.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vObj; float spk(vec3 p){ return fract(sin(dot(floor(p * 90.), vec3(12.9898, 78.233, 37.719))) * 43758.5453); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
float sp = spk(vObj); roughnessFactor = clamp(roughnessFactor + (sp - .5) * .12, .3, 1.);`).replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= .95 + .1 * spk(vObj + 3.1);`)};const r=new b(t,o);r.position.y=.32;const a=le.width+.9,n=1.2,s=.12,i=new ae;i.moveTo(-a/2+s,-n/2),i.lineTo(a/2-s,-n/2),i.lineTo(a/2,-n/2+s),i.lineTo(a/2,n/2-s),i.lineTo(a/2-s,n/2),i.lineTo(-a/2+s,n/2),i.lineTo(-a/2,n/2-s),i.lineTo(-a/2,-n/2+s),i.closePath();const l=new V(i,{depth:.26,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:1});l.rotateX(Math.PI/2),l.translate(0,.3,0);const c=new b(l,new W({color:"#3c403c",roughness:.8,metalness:.3})),p=new ne({color:"#ffffff",toneMapped:!1}),f=new P,u=new b(new re(.2,.12,.16),c.material),v=new b(new se(.045,.045,.05,16),p);return v.position.y=.08,f.add(u,v),f.position.set(a/2-.3,.36,.3),e.add(r,c,f),{group:e,body:r,blink:(w,g=1)=>{const S=w%1.45/1.45,G=(S<.045?1:S>.1&&S<.13?.55:0)*g;p.color.setScalar(.15+G*26)},dispose(){t.dispose(),l.dispose(),o.dispose(),c.material.dispose(),p.dispose(),u.geometry.dispose(),v.geometry.dispose()}}}const Be={en:'"Inter Variable", "Space Grotesk Variable", system-ui, sans-serif',display:'"Space Grotesk Variable", "Inter Variable", system-ui, sans-serif'},Ke=()=>Promise.allSettled([document.fonts.load('300 40px "Inter Variable"'),document.fonts.load('600 40px "Inter Variable"'),document.fonts.load('500 40px "Space Grotesk Variable"'),document.fonts.load('600 40px "Cairo Variable"')]);function Qe(e,{pad:t=12,rtl:o=!1,align:r="start",scale:a=2}={}){const n=document.createElement("canvas"),s=n.getContext("2d"),i=u=>`${u.weight??500} ${u.size*a}px ${u.font??Be.en}`;let l=0,c=t*a;for(const u of e)s.font=i(u),s.letterSpacing=`${(u.track??0)*u.size*a}px`,l=Math.max(l,s.measureText(u.text).width),c+=u.size*a*1.3;n.width=Math.ceil(l+t*2*a),n.height=Math.ceil(c+t*a),s.textBaseline="alphabetic",s.direction=o?"rtl":"ltr";let p=t*a;for(const u of e){s.font=i(u),s.letterSpacing=`${(u.track??0)*u.size*a}px`,s.fillStyle=`rgba(255,255,255,${u.alpha??1})`,p+=u.size*a*1.3;const v=r==="center"?n.width/2:r==="end"!==o?n.width-t*a:t*a;s.textAlign=r==="center"?"center":r==="end"!==o?"right":"left",s.fillText(u.text,v,p-u.size*a*.28)}const f=new he(n);return f.colorSpace=pe,f.anisotropy=4,f.minFilter=X,{texture:f,aspect:n.width/n.height,width:n.width,height:n.height}}function Je(e){const t=e.opsLean??={x:0,y:0,t:-1},o=matchMedia("(pointer: coarse)").matches;return{step(r,a){if(t.t!==a){t.t=a;const n=e.pointer.inside&&!o;t.x=j(t.x,n?e.pointer.x:0,2.6,r),t.y=j(t.y,n?e.pointer.y:0,2.6,r)}return t}}}const N=new d;function Ye(e,t,o,r,a,n=1){N.copy(o).sub(t).setLength(5).add(t),e.position.copy(t),e.lookAt(o),e.updateMatrixWorld();const s=new d().setFromMatrixColumn(e.matrixWorld,0),i=new d().setFromMatrixColumn(e.matrixWorld,1);e.position.addScaledVector(s,r*.32*n).addScaledVector(i,a*.2*n),e.lookAt(N),e.rotateZ(-r*.016*n)}function et(e){let t=-1;const o=new d;return(r,a,n,s={})=>{!a||Math.abs(r-t)<.08||(t=r,n.getWorldDirection(o),e.emit("ops",{head:(Math.atan2(o.x,-o.z)*180/Math.PI+360)%360,...s}))}}const D=new d;function tt(e,t){return D.copy(e).project(t),[D.x*.5+.5,D.y*.5+.5,D.z]}const ot=()=>matchMedia("(prefers-reduced-motion: reduce)").matches,y=(e,t,o)=>new d(e,t,o),Le=(e,t,o)=>({pos:e.pos.clone().lerp(t.pos,o),look:e.look.clone().lerp(t.look,o),fov:e.fov+(t.fov-e.fov)*o}),at={pos:y(0,m.hq+1.35,8.6),look:y(0,m.hq+.95,0),fov:30},nt=(e,t=0)=>{const o=62-t*6,r=64-t*4;return{pos:y(Math.sin(e)*o,m.hq+r,Math.cos(e)*o),look:y(Math.sin(e)*-4,m.hq,Math.cos(e)*-4),fov:34}},_e=te(),qe=k.map((e,t)=>{const o=_e.getTangent((t+1)/k.length);return new L(o.x,o.z).normalize()}),Pe=e=>e?1.21:.9,U={wide:26.6,tall:31.6};function rt(e,t,o,r,a=1){const n=2*Math.tan(ge.degToRad((t?U.tall:U.wide)/2)),s=Math.max(r/(n*(t?.6:.58)),o/(n*e*(t?.8:.46)));return{back:s,shift:t?0:a*.11*e*n*s}}function Ee(e,t,o=!1,r={back:o?4.9:3.4,shift:0}){const a=k[e],n=qe[e],s=y(a.x,a.y+Pe(o),a.z),i=r.back+(16.3-r.back)*t,l=(o?.5:.55)+t*13.5,c=o?.42*(1-t):0,p=-n.y*r.shift*(1-t),f=n.x*r.shift*(1-t);return{pos:y(s.x-n.x*i-p,s.y+l,s.z-n.y*i-f),look:y(s.x+n.x*t*9-p,s.y-t*2.2-c,s.z+n.y*t*9-f),fov:(o?34:29)+t*9}}const st=(e=!1)=>Ee(0,1,e);function it(e,t,o,r=0){const a=we.inOut(o),n=Le(e,t,a);return n.pos.y+=Math.sin(Math.PI*a)*r,n}function ut(e){e.uGround.value.set("#a9b0a8"),e.uLine.value.set("#d6ffd0"),e.uSky.value.set("#000000"),e.uAmbient.value=.035,e.uShade.value=.4,e.uFog.value=.016,e.uContour.value=.6,e.uGrid.value=.22,e.uRings.value=0,e.uDetail.value=0,e.uSpot.value.w=0,e.uSweep.value.set(0,0),e.uWarmSide.value.set("#000000")}const z={gain:1.15,noise:.1,scan:.06,bloom:.9,vig:.75,hex:.05};function lt(e){e.uGain.value=z.gain,e.uNoise.value=z.noise,e.uScan.value=z.scan,e.uBloom.value=z.bloom,e.uVig.value=z.vig,e.uHex.value=z.hex,e.uGrade.value=1,e.uThermal.value=0}function ct(e){e.uGlow.value.set("#e2f0e8"),e.uLevel.value=.16,e.uCloud.value=.75,e.uDawn.value=0}function ht(e){const t=new me("#ffffff",.35);return t.position.set(-6,9,-5),e.add(t,new de("#ffffff","#202020",.07)),t}function pt({radius:e=260}={}){const t={uTime:{value:0},uGlow:{value:new x("#ffffff")},uZenith:{value:new x("#000000")},uLevel:{value:.22},uCloud:{value:.5},uDawn:{value:0},uSunDir:{value:new d(.7,.05,-.7).normalize()}},o=new b(new fe(e,48,24),new A({side:ve,depthWrite:!1,uniforms:t,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }",fragmentShader:`
      uniform float uTime, uLevel, uCloud, uDawn; uniform vec3 uGlow, uZenith, uSunDir; varying vec3 vD;
      ${I}
      void main(){
        vec3 d = normalize(vD);
        float hz = 1. - smoothstep(-.02, .45, d.y);                 // airglow banked at the horizon
        vec3 c = mix(uZenith, uGlow * uLevel, hz * hz);
        // low cloud: a ceiling of soft fbm, lit from below by the glow
        vec2 q = d.xz / max(d.y + .12, .05) * .9 + vec2(uTime * .006, uTime * .002);
        float n = fbm(q, 4), cl = smoothstep(.45, .8, n) * smoothstep(-.05, .2, d.y) * (1. - smoothstep(.5, .95, d.y));
        c += uGlow * uLevel * cl * uCloud * (.4 + .6 * hz);
        // dawn: warm at the horizon toward the sun, the sun itself low and soft
        float sunA = max(dot(d, normalize(uSunDir)), 0.);
        vec3 warm = mix(vec3(1., .42, .16), vec3(1., .78, .5), smoothstep(.0, .25, d.y));
        c = mix(c, mix(vec3(.05, .06, .12), warm, pow(hz, 1.4) * (.35 + .65 * pow(sunA, 3.))) + vec3(1., .85, .6) * pow(sunA, 120.) * 2., uDawn);
        gl_FragColor = vec4(c, 1.);
      }`}));return o.frustumCulled=!1,o.renderOrder=-5,{mesh:o,U:t,dispose(){o.geometry.dispose(),o.material.dispose()}}}export{ze as A,Ee as B,Qe as C,Be as F,We as M,z as N,at as O,k as S,m as T,ut as a,pt as b,ct as c,ht as d,Xe as e,it as f,nt as g,et as h,Ye as i,Ke as j,$e as k,Je as l,Le as m,lt as n,Ne as o,st as p,Se as q,Ze as r,ot as s,Ue as t,Ve as u,qe as v,je as w,Oe as x,tt as y,rt as z};
