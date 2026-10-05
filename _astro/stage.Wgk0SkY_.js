import{a3 as O,a8 as L,aF as N,a4 as U,i as M,M as b,a as _,S as Z,G as q,C as x,an as V,aA as Y,B as E,ao as ee,b as te,X as oe,H as ae,V as g,a9 as ne,ac as I,u as W,F,s as D,aG as j,ab as re,Z as se,aH as ie,ae as ue,ak as le,I as ce,af as he,ag as pe,D as ve,J as fe,o as me}from"./EditionWorld.astro_astro_type_script_index_0_lang.N5eFyXPr.js";const de="#ffb347",X="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",we=`
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
  }`,ge=()=>({tScene:{value:null},uRes:{value:new D(1,1)},uTime:{value:0},uDpr:{value:1},uGrade:{value:1},uThermal:{value:0},uGain:{value:1},uRawGain:{value:1},uRawTint:{value:new x(1,1,1)},uNoise:{value:.09},uScan:{value:.06},uBloom:{value:.9},uVig:{value:.75},uHex:{value:.05},uPower:{value:1},uFlash:{value:0},uWarm:{value:0},uBand:{value:new F(0,0,.02,0)},uTilt:{value:0},uTiltAt:{value:0},uLock:{value:new F(.4,.4,.6,.6)},uLockAmt:{value:new g(0,0,0)},uLockCol:{value:new x(de)}});function Be(e,t,a){const r=new O(1,1,{type:U,samples:e.quality?4:0,depthBuffer:!0,generateMipmaps:!0,minFilter:N,magFilter:L}),o=ge();o.tScene.value=r.texture;const n=new M({vertexShader:X,fragmentShader:we,uniforms:o,depthTest:!1,depthWrite:!1}),s=new b(new _(2,2),n);s.frustumCulled=!1,s.renderOrder=-10;const i=new Z,l=new q;i.add(s,l);function h(){const p=Math.max(2,Math.round(e.viewport.width*e.viewport.dpr)),c=Math.max(2,Math.round(e.viewport.height*e.viewport.dpr));(r.width!==p||r.height!==c)&&r.setSize(p,c),o.uRes.value.set(p,c),o.uDpr.value=e.viewport.dpr}h();const v=new x;function f(p){const c=e.renderer,d=c.getRenderTarget(),w=c.getClearAlpha();c.getClearColor(v),c.setRenderTarget(r),c.setClearColor(0,1),c.clear(!0,!0,!0),c.render(t,a),c.setRenderTarget(d),c.setClearColor(v,w),o.uTime.value=p}function u(){const p=e.renderer,c=p.getRenderTarget();p.setRenderTarget(r);const d=p.compileAsync(t,a).catch(()=>{}).then(()=>f(0));return p.setRenderTarget(c),d}return{scene:i,overlay:l,U:o,rt:r,resize:h,render:f,warm:u,dispose(){r.dispose(),n.dispose(),s.geometry.dispose()}}}const A=e=>e-Math.floor(e);function G(e,t){let a=A(e*.1031),r=A(t*.1031),o=A(e*.1031);const n=a*(r+33.33)+r*(o+33.33)+o*(a+33.33);return a+=n,r+=n,o+=n,A((a+r)*o)}function K(e,t){const a=Math.floor(e),r=Math.floor(t),o=e-a,n=t-r,s=o*o*o*(o*(o*6-15)+10),i=n*n*n*(n*(n*6-15)+10),l=G(a,r),h=G(a+1,r),v=G(a,r+1),f=G(a+1,r+1);return(l+(h-l)*s)*(1-i)+(v+(f-v)*s)*i}function B(e,t,a){let r=0,o=.5;for(let n=0;n<a;n++){r+=o*K(e,t);const s=1.6*e-1.2*t+5.3,i=1.2*e+1.6*t+1.9;e=s,t=i,o*=.5}return r}function xe(e,t,a){let r=0,o=.5,n=0;for(let s=0;s<a;s++){const i=1-Math.abs(2*K(e,t)-1);r+=o*i*i,n+=o;const l=1.6*e-1.2*t+5.3,h=1.2*e+1.6*t+1.9;e=l,t=h,o*=.5}return r/n}const P=`
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }
  float fbm(vec2 p, int oct){ float v = 0., a = .5; for (int i = 0; i < 6; i++){ if (i >= oct) break; v += a * vnoise(p); p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v; }
  float ridge(vec2 p, int oct){ float v = 0., a = .5, n = 0.; for (int i = 0; i < 6; i++){ if (i >= oct) break; float k = 1. - abs(2. * vnoise(p) - 1.); v += a * k * k; n += a; p = vec2(1.6 * p.x - 1.2 * p.y + 5.3, 1.2 * p.x + 1.6 * p.y + 1.9); a *= .5; } return v / n; }`,m={size:180,res:1024,hq:1.4,minor:.5,major:2.5};function Q(e,t){const a=e*.03,r=t*.03,o=B(a*.8+3.1,r*.8+1.7,3)-.5,n=B(a*.8+8.3,r*.8+2.9,3)-.5,s=a+o*1.4,i=r+n*1.4,l=B(s,i,5),h=xe(s*1.7+4.2,i*1.7+4.2,4);let v=(l-.5)*10+h*h*6.5-1;const f=Math.hypot(e,t),u=Math.min(1,Math.max(0,(11-f)/6)),p=u*u*(3-2*u);return v+=(m.hq-v)*p,v}const be=`
  float rawHeight(vec2 xz){
    vec2 p = xz * .03;
    vec2 w = vec2(fbm(p * .8 + vec2(3.1, 1.7), 3), fbm(p * .8 + vec2(8.3, 2.9), 3)) - .5;
    vec2 q = p + w * 1.4;
    float b = fbm(q, 5), r = ridge(q * 1.7 + 4.2, 4);
    float h = (b - .5) * 10. + r * r * 6.5 - 1.;
    return mix(h, ${m.hq.toFixed(3)}, smoothstep(11., 5., length(xz)));
  }`,k=(()=>{const e=ce(31),t=[];for(let a=0;a<15;a++){const r=.35+a*(Math.PI*2*1.22/15)+(e()-.5)*.18,o=19+a*2.35+(e()-.5)*2.4,n=Math.cos(r)*o,s=Math.sin(r)*o;t.push({x:n,z:s,y:Q(n,s),a:r})}return t})(),T={inner:1.7,outer:3.4};function ye(e,t){let a=Q(e,t);for(const r of k){const o=Math.hypot(e-r.x,t-r.z);if(o<T.outer){const n=Math.min(1,(T.outer-o)/(T.outer-T.inner)),s=n*n*(3-2*n);a+=(r.y-a)*s}}return a}const Se=`
  ${P}
  ${be}
  varying vec2 vUv;
  void main(){
    vec2 xz = (vUv - .5) * ${m.size.toFixed(1)};
    float h = rawHeight(xz);
    ${k.map(e=>`{ float d = length(xz - vec2(${e.x.toFixed(4)}, ${e.z.toFixed(4)})); h = mix(h, ${e.y.toFixed(4)}, smoothstep(${T.outer.toFixed(2)}, ${T.inner.toFixed(2)}, d)); }`).join(`
    `)}
    gl_FragColor = vec4(h, 0., 0., 1.);
  }`;let R=null;function ze(e){if(R)return R.texture;const t=m.res;R=new O(t,t,{type:U,depthBuffer:!1,generateMipmaps:!1,minFilter:L,magFilter:L,wrapS:j,wrapT:j});const a=new M({vertexShader:X,fragmentShader:Se,depthTest:!1,depthWrite:!1}),r=new b(new _(2,2),a),o=new Z,n=new re(-1,1,1,-1,0,1);r.frustumCulled=!1,o.add(r);const s=e.getRenderTarget();return e.setRenderTarget(R),e.render(o,n),e.setRenderTarget(s),a.dispose(),r.geometry.dispose(),R.texture}const Te=()=>({uHeight:{value:null},uSize:{value:m.size},uTexel:{value:m.size/m.res},uTime:{value:0},uMinor:{value:m.minor},uMajor:{value:m.major},uSun:{value:new g(-.5,.62,-.35).normalize()},uAmbient:{value:.07},uShade:{value:.2},uContour:{value:.55},uGrid:{value:.25},uRings:{value:0},uReveal:{value:999},uRevealAt:{value:new D(0,0)},uSweep:{value:new D(0,0)},uSpot:{value:new F(0,0,6,0)},uGround:{value:new x("#ffffff")},uLine:{value:new x("#ffffff")},uSky:{value:new x("#000000")},uFog:{value:.012},uWarmSide:{value:new x("#000000")},uDetail:{value:.5},uBlob:{value:new F(0,0,2.6,.8)}}),ke=`
  uniform sampler2D uHeight; uniform float uSize;
  varying vec3 vW;
  void main(){
    vec4 w = modelMatrix * vec4(position, 1.);
    w.y = texture2D(uHeight, w.xz / uSize + .5).r;
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,Re=`
  uniform sampler2D uHeight; uniform float uSize, uTexel, uTime, uMinor, uMajor, uAmbient, uShade, uContour, uGrid, uRings, uReveal, uFog, uDetail;
  uniform vec3 uSun, uGround, uLine, uSky, uWarmSide; uniform vec2 uRevealAt, uSweep; uniform vec4 uSpot, uBlob;
  varying vec3 vW;
  ${P}
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
  }`;function Le(e,{span:t=m.size,seg:a=e.quality?320:200}={}){const r=Te();r.uHeight.value=ze(e.renderer);const o=new _(t,t,a,a);o.rotateX(-Math.PI/2);const n=new b(o,new M({vertexShader:ke,fragmentShader:Re,uniforms:r}));return n.frustumCulled=!1,{mesh:n,U:r,dispose(){o.dispose(),n.material.dispose()}}}function J(){const e=[new g(0,m.hq,4),...k.map(t=>new g(t.x,t.y,t.z))];return new ie(e,!1,"centripetal",.5)}function qe(e=J(),{width:t=.14,lift:a=.07,samples:r=1400}={}){const o=[],n=[],s=[],i=new g,l=new g,h=new g,v=new g(0,1,0),f=e.getLength();for(let c=0;c<=r;c++){const d=c/r;e.getPointAt(d,i),e.getTangentAt(d,l),h.crossVectors(l,v).normalize().multiplyScalar(t/2);for(const w of[-1,1]){const S=i.x+h.x*w,C=i.z+h.z*w;o.push(S,ye(S,C)+a,C),n.push(d*f,w*.5+.5)}if(c<r){const w=c*2;s.push(w,w+1,w+2,w+1,w+3,w+2)}}const u=new ne;u.setAttribute("position",new I(o,3)),u.setAttribute("uv",new I(n,2)),u.setIndex(s);const p=new M({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uShow:{value:1},uHead:{value:1e5},uColor:{value:new x("#ffffff")},uLevel:{value:1.2}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime, uShow, uHead, uLevel; uniform vec3 uColor; varying vec2 vUv;
      void main(){
        float dash = step(.42, fract(vUv.x * .9 - uTime * .35));
        float edge = smoothstep(0., .25, vUv.y) * smoothstep(1., .75, vUv.y);
        float a = dash * edge * uShow * step(vUv.x, uHead);
        if (a < .01) discard;
        gl_FragColor = vec4(uColor * uLevel, a);
      }`});return{mesh:new b(u,p),length:f}}function _e(){const e=new q,t=new V(Y(),{depth:.5,curveSegments:2,bevelEnabled:!0,bevelThickness:.07,bevelSize:.06,bevelSegments:1});t.translate(-3.87/2,0,-.25),t.computeVertexNormals();const a=new E({color:"#4d544e",roughness:.36,metalness:.7});a.onBeforeCompile=d=>{d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vObj; float spk(vec3 p){ return fract(sin(dot(floor(p * 90.), vec3(12.9898, 78.233, 37.719))) * 43758.5453); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
float sp = spk(vObj); roughnessFactor = clamp(roughnessFactor + (sp - .5) * .12, .3, 1.);`).replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= .95 + .1 * spk(vObj + 3.1);`)};const r=new b(t,a);r.position.y=.32;const o=se.width+.9,n=1.2,s=.12,i=new ee;i.moveTo(-o/2+s,-n/2),i.lineTo(o/2-s,-n/2),i.lineTo(o/2,-n/2+s),i.lineTo(o/2,n/2-s),i.lineTo(o/2-s,n/2),i.lineTo(-o/2+s,n/2),i.lineTo(-o/2,n/2-s),i.lineTo(-o/2,-n/2+s),i.closePath();const l=new V(i,{depth:.26,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:1});l.rotateX(Math.PI/2),l.translate(0,.3,0);const h=new b(l,new E({color:"#3c403c",roughness:.8,metalness:.3})),v=new te({color:"#ffffff",toneMapped:!1}),f=new q,u=new b(new oe(.2,.12,.16),h.material),p=new b(new ae(.045,.045,.05,16),v);return p.position.y=.08,f.add(u,p),f.position.set(o/2-.3,.36,.3),e.add(r,h,f),{group:e,body:r,blink:(d,w=1)=>{const S=d%1.45/1.45,C=(S<.045?1:S>.1&&S<.13?.55:0)*w;v.color.setScalar(.15+C*26)},dispose(){t.dispose(),l.dispose(),a.dispose(),h.material.dispose(),v.dispose(),u.geometry.dispose(),p.geometry.dispose()}}}const Me={en:'"Inter Variable", "Space Grotesk Variable", system-ui, sans-serif',display:'"Space Grotesk Variable", "Inter Variable", system-ui, sans-serif'},Pe=()=>Promise.allSettled([document.fonts.load('300 40px "Inter Variable"'),document.fonts.load('600 40px "Inter Variable"'),document.fonts.load('500 40px "Space Grotesk Variable"'),document.fonts.load('600 40px "Cairo Variable"')]);function Ve(e,{pad:t=12,rtl:a=!1,align:r="start",scale:o=2}={}){const n=document.createElement("canvas"),s=n.getContext("2d"),i=u=>`${u.weight??500} ${u.size*o}px ${u.font??Me.en}`;let l=0,h=t*o;for(const u of e)s.font=i(u),s.letterSpacing=`${(u.track??0)*u.size*o}px`,l=Math.max(l,s.measureText(u.text).width),h+=u.size*o*1.3;n.width=Math.ceil(l+t*2*o),n.height=Math.ceil(h+t*o),s.textBaseline="alphabetic",s.direction=a?"rtl":"ltr";let v=t*o;for(const u of e){s.font=i(u),s.letterSpacing=`${(u.track??0)*u.size*o}px`,s.fillStyle=`rgba(255,255,255,${u.alpha??1})`,v+=u.size*o*1.3;const p=r==="center"?n.width/2:r==="end"!==a?n.width-t*o:t*o;s.textAlign=r==="center"?"center":r==="end"!==a?"right":"left",s.fillText(u.text,p,v-u.size*o*.28)}const f=new ue(n);return f.colorSpace=le,f.anisotropy=4,f.minFilter=N,{texture:f,aspect:n.width/n.height,width:n.width,height:n.height}}function Ee(e){const t=e.opsLean??={x:0,y:0,t:-1},a=matchMedia("(pointer: coarse)").matches;return{step(r,o){if(t.t!==o){t.t=o;const n=e.pointer.inside&&!a;t.x=W(t.x,n?e.pointer.x:0,2.6,r),t.y=W(t.y,n?e.pointer.y:0,2.6,r)}return t}}}const $=new g;function Ie(e,t,a,r,o,n=1){$.copy(a).sub(t).setLength(5).add(t),e.position.copy(t),e.lookAt(a),e.updateMatrixWorld();const s=new g().setFromMatrixColumn(e.matrixWorld,0),i=new g().setFromMatrixColumn(e.matrixWorld,1);e.position.addScaledVector(s,r*.32*n).addScaledVector(i,o*.2*n),e.lookAt($),e.rotateZ(-r*.016*n)}const H=new g;function We(e,t){return H.copy(e).project(t),[H.x*.5+.5,H.y*.5+.5,H.z]}const je=()=>matchMedia("(prefers-reduced-motion: reduce)").matches,y=(e,t,a)=>new g(e,t,a),Ce=(e,t,a)=>({pos:e.pos.clone().lerp(t.pos,a),look:e.look.clone().lerp(t.look,a),fov:e.fov+(t.fov-e.fov)*a}),$e={pos:y(0,m.hq+1.35,8.6),look:y(0,m.hq+.95,0),fov:30},Oe=(e,t=0)=>{const a=62-t*6,r=64-t*4;return{pos:y(Math.sin(e)*a,m.hq+r,Math.cos(e)*a),look:y(Math.sin(e)*-4,m.hq,Math.cos(e)*-4),fov:34}},Ae=J(),Ge=k.map((e,t)=>{const a=Ae.getTangent((t+1)/k.length);return new D(a.x,a.z).normalize()}),He=e=>e?1.21:.9;function Fe(e,t,a=!1){const r=k[e],o=Ge[e],n=y(r.x,r.y+He(a),r.z),s=(a?4.75:3.3)+t*13,i=(a?.5:.55)+t*13.5,l=a?.42*(1-t):0;return{pos:y(n.x-o.x*s,n.y+i,n.z-o.y*s),look:y(n.x+o.x*t*9,n.y-t*2.2-l,n.z+o.y*t*9),fov:(a?34:29)+t*9}}const Ne=(e=!1)=>Fe(0,1,e);function Ue(e,t,a,r=0){const o=me.inOut(a),n=Ce(e,t,o);return n.pos.y+=Math.sin(Math.PI*o)*r,n}function Ze(e){e.uGround.value.set("#a9b0a8"),e.uLine.value.set("#d6ffd0"),e.uSky.value.set("#000000"),e.uAmbient.value=.035,e.uShade.value=.4,e.uFog.value=.016,e.uContour.value=.6,e.uGrid.value=.22,e.uRings.value=0,e.uDetail.value=0,e.uSpot.value.w=0,e.uSweep.value.set(0,0),e.uWarmSide.value.set("#000000")}const z={gain:1.15,noise:.1,scan:.06,bloom:.9,vig:.75,hex:.05};function Xe(e){e.uGain.value=z.gain,e.uNoise.value=z.noise,e.uScan.value=z.scan,e.uBloom.value=z.bloom,e.uVig.value=z.vig,e.uHex.value=z.hex,e.uGrade.value=1,e.uThermal.value=0}function Ke(e){e.uGlow.value.set("#e2f0e8"),e.uLevel.value=.16,e.uCloud.value=.75,e.uDawn.value=0}function Qe(e){const t=new ve("#ffffff",.35);return t.position.set(-6,9,-5),e.add(t,new fe("#ffffff","#202020",.07)),t}function Je({radius:e=260}={}){const t={uTime:{value:0},uGlow:{value:new x("#ffffff")},uZenith:{value:new x("#000000")},uLevel:{value:.22},uCloud:{value:.5},uDawn:{value:0},uSunDir:{value:new g(.7,.05,-.7).normalize()}},a=new b(new he(e,48,24),new M({side:pe,depthWrite:!1,uniforms:t,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }",fragmentShader:`
      uniform float uTime, uLevel, uCloud, uDawn; uniform vec3 uGlow, uZenith, uSunDir; varying vec3 vD;
      ${P}
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
      }`}));return a.frustumCulled=!1,a.renderOrder=-5,{mesh:a,U:t,dispose(){a.geometry.dispose(),a.material.dispose()}}}export{de as A,Me as F,z as N,$e as O,k as S,m as T,Ze as a,Je as b,Ke as c,Qe as d,_e as e,Ue as f,Oe as g,Ie as h,Pe as i,Ce as j,Ne as k,Ee as l,Ge as m,Xe as n,Be as o,We as p,Fe as q,qe as r,je as s,Le as t,Ve as u};
