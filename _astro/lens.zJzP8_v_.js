import{q as G,H as D,i as P,s as S,C as _,t as z,M as L,a as W,u as V,v as k,w as M,x as j,R as H,y as O,o as E,r as q}from"./EditionWorld.astro_astro_type_script_index_0_lang.9DI9aADJ.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const n=[-3.1,-2.15,3.1,2.15];function X(t){const r=t>=.65,m=t-.65;return{passed:r,grow:(Math.exp(4.2*q(0,.65,t))-1)/(Math.exp(4.2)-1),screen:(r?Math.exp(-m*3.4)*Math.cos(m*8.5):E.in(q(.4,.65,t)))*(1-q(1.45,1.7,t))}}function I(t=448){const r=Math.round(t*(n[3]-n[1])/(n[2]-n[0])),m=V.map(e=>e.map(([s,u])=>[s-k.width/2,u-k.height/2])),f=new Float32Array(t*r);for(let e=0;e<r;e++)for(let s=0;s<t;s++){const u=n[0]+(s+.5)/t*(n[2]-n[0]),i=n[1]+(e+.5)/r*(n[3]-n[1]);let h=1/0,v=!1;for(const p of m){let d=!1;for(let l=0,A=p.length-1;l<p.length;A=l++){const[B,x]=p[A],[U,F]=p[l],R=U-B,C=F-x,T=Math.max(0,Math.min(1,((u-B)*R+(i-x)*C)/(R*R+C*C)));h=Math.min(h,(u-B-R*T)**2+(i-x-C*T)**2),x>i!=F>i&&u<B+(i-x)/(F-x)*R&&(d=!d)}v||=d}f[e*t+s]=(v?-1:1)*Math.sqrt(h)}const c=f.slice(),w=new Float32Array(t*r),g=10,o=2*g+1,b=(e,s,u,i,h)=>{for(let v=0;v<i;v++){const p=l=>e[h(v,Math.min(u-1,Math.max(0,l)))];let d=0;for(let l=-g;l<=g;l++)d+=p(l);for(let l=0;l<u;l++)s[h(v,l)]=d/o,d+=p(l+g+1)-p(l-g)}};for(let e=0;e<3;e++)b(c,w,t,r,(s,u)=>s*t+u),b(w,c,r,t,(s,u)=>u*t+s);const y=new Uint16Array(t*r*2);for(let e=0;e<t*r;e++)y[e*2]=M.toHalfFloat(f[e]),y[e*2+1]=M.toHalfFloat(c[e]);const a=new j(y,t,r,H,D);return a.minFilter=a.magFilter=O,a.needsUpdate=!0,a}const K=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp, uRipple, uBeat, uScreen, uFar;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
  float mk(vec2 p){ vec2 q = clamp(p, uBox.xy, uBox.zw), f = texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).rg; return mix(f.r, f.g, clamp(uPuff * 2.2, 0., 1.)) + length(p - q); }
  float shape(vec2 p){ return mix(mk(p) - uPuff, length(p - uBall) - uRadius, uSphere); }
  // the loader's construction drawing (world-loader.js), in mark units: guides one CSS px wide (uLine), the outline 1.2
  float seg(float d, float w){ return 1. - smoothstep(w * .5 - .4 / uUnit, w * .5 + .4 / uUnit, abs(d)); }
  float far(vec2 m, vec2 a, vec2 b){ vec2 t = normalize(b - a); return dot(m - a, vec2(-t.y, t.x)); }
  // (Alche's construction A, live at 30 fps: each stroke a bundle of three lines run across the screen, stems and guides,
  // two circles; generated from the same list as world-loader.js draws)
  vec3 drawing(vec2 m){
    float w = uLine, g = 0.;
    g = max(g, seg(m.x - (-1.935), w));
    g = max(g, seg(m.x - (-1.515), w));
    g = max(g, seg(m.x - (-.455), w));
    g = max(g, seg(m.x - (-.035), w));
    g = max(g, seg(m.x - (.215), w));
    g = max(g, seg(m.x - (.635), w));
    g = max(g, seg(m.y - (1.), w));
    g = max(g, seg(m.y - (-1.), w));
    g = max(g, seg(m.y - (0.), w));
    g = max(g, seg(m.y - (.15), w));
    g = max(g, seg(m.y - (-.65), w));
    g = max(g, seg(m.y - (.05), w));
    g = max(g, seg(m.y - (1.55), w));
    g = max(g, seg(m.y - (-1.5), w));
    g = max(g, seg(far(m, vec2(.635, .18), vec2(1.365, 1.)), w));
    g = max(g, seg(far(m, vec2(.855, .115), vec2(1.63, 1.)), w));
    g = max(g, seg(far(m, vec2(1.075, .05), vec2(1.895, 1.)), w));
    g = max(g, seg(far(m, vec2(-1.435, 1.), vec2(-.985, .15)), w));
    g = max(g, seg(far(m, vec2(-1.475, .625), vec2(-.985, -.25)), w));
    g = max(g, seg(far(m, vec2(-1.515, .25), vec2(-.985, -.65)), w));
    g = max(g, seg(far(m, vec2(-.535, 1.), vec2(-.985, .15)), w));
    g = max(g, seg(far(m, vec2(-.495, .625), vec2(-.985, -.25)), w));
    g = max(g, seg(far(m, vec2(-.455, .25), vec2(-.985, -.65)), w));
    g = max(g, seg(far(m, vec2(1.075, .05), vec2(1.935, -1.)), w));
    g = max(g, seg(far(m, vec2(.925, -.085), vec2(1.665, -1.)), w));
    g = max(g, seg(far(m, vec2(.775, -.22), vec2(1.395, -1.)), w));
    g = max(g, seg(length(m - vec2(0., 0.)) - 2.3, w));
    g = max(g, seg(length(m - vec2(0., 0.)) - 1.35, w));
    g = max(g, seg(length(m - vec2(-.985, .15)) - .36, w));
    vec2 q = clamp(m, uBox.xy, uBox.zw);
    float o = seg(texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).r + length(m - q), w * 1.2);
    // in linear light, so that once encoded for the screen they match the loader's SVG lines (a hand-over must not brighten)
    return vec3(.85, .85, .87) * g * .11 * uGuides + vec3(.92, .92, .94) * o * .64 * uDraw;
  }
  // the pulse: the ball beats (uBeat: seconds since the first beat, about 1.4 a second) and every beat sends rings of waves
  // out from it through the glass and the lines, like a drop in liquid; a ring reaches r a little after its beat
  float beat(float t){ return t < 0. ? 0. : pow(max(sin(t * 8.8), 0.), 2.); }
  vec2 ripple(vec2 p){
    vec2 v = p - uBall; float r = length(v);
    return v / max(r, 1e-3) * uRipple * beat(uBeat - r / 1.6) * sin(r * 9. - uBeat * 12.) * exp(-r * .22);
  }
  void main(){
    // the whole screen pulses (uScreen > 0 bulges it like a fisheye toward you, < 0 pinches it): every pixel, glass or
    // not, looks at a point pulled toward the middle, each colour a little differently at the edges
    vec2 sc = (gl_FragCoord.xy - uRes * .5) / uRes.y, bulge = sc * uScreen * .45 * exp(-dot(sc, sc) * 1.5);
    vec2 p = (gl_FragCoord.xy - bulge * uRes.y - uCenter) / uUnit;   // mark units, y up
    if (uRipple > 0.) p += ripple(p);
    // liquid: the glass ripples as it fills and pulses, its edges and everything seen through it wavering
    p += uWobble * vec2(sin(p.y * 4.3 + uTime * 5.1) + .5 * sin(p.y * 9.1 - uTime * 7.3), cos(p.x * 3.7 - uTime * 4.4) + .5 * cos(p.x * 8.3 + uTime * 6.1)) * .045;
    float d = shape(p), px = 1. / uUnit;
    if (d > px * 1.5) {
      // round the glass: the black with the construction on it, the ball glowing. It shoves the lines out of its way like
      // a bubble in a sheet (Alche's, frame by frame: out/qa1005/study5/pop-alche.jpg): a point r out shows the drawing
      // from sqrt(r² - .75 R²), so the strokes near it wrap round its rim and are driven ahead of it as it swells
      vec2 v = p - uBall; float r2 = dot(v, v), R2 = uRadius * uRadius;
      float rr = sqrt(r2);
      vec3 C = (uDraw + uGuides > 0. ? drawing(uBall + v * sqrt(max(r2 - uWarp * .75 * R2, 0.) / max(r2, 1e-8))) : vec3(0.))
        + vec3(.95, .96, 1.) * uSphere * step(.001, uRadius) * exp(-d / (.03 + uRadius * .05)) * .85
        + vec3(.92, .93, .97) * (uRipple > 0. ? beat(uBeat - rr / 1.6) * smoothstep(.55, 1., sin(rr * 9. - uBeat * 12.)) * exp(-rr * .7) * 1.6 * uRipple : 0.);
      if (abs(uScreen) > .002 && uRadius < 1e-4) {   // the room, bent by the pulse, once the ball has passed (round it: what was there)
        vec3 w;
        for (int i = 0; i < 3; i++) w[i] = texture2D(uBg, clamp((gl_FragCoord.xy - bulge * uRes.y * (1. + (float(i) - 1.) * .07)) / uRes, .001, .999))[i];
        gl_FragColor = vec4(w * (1. - uVeil) + C, 1.); return;
      }
      float A = max(uVeil, max(C.r, max(C.g, C.b)));
      if (A <= .002) discard;
      gl_FragColor = vec4(min(C / A, 1.), A); return;
    }
    float e = max(.012, px);
    vec2 g = vec2(shape(p + vec2(e, 0.)) - shape(p - vec2(e, 0.)), shape(p + vec2(0., e)) - shape(p - vec2(0., e))) / (2. * e);
    g *= min(1., 1. / max(length(g), 1e-5));                      // outward; the blurred field fades it to nothing along a ridge
    // a pillow: round over a rim of width R, flat beyond; a puffed or ball-shaped glass is round all over
    float s = max(-d, 0.), R = max(mix(.07 + uPuff * 1.15, uRadius, uSphere), .035);
    float x = clamp(s / R, 0., 1.), c = sqrt(max(1. - (1. - x) * (1. - x), 0.)), h = R * c;
    float slope = min((1. - x) / max(c, .06), 9.);
    // streaks drawn down the glass (Alche's are vertical), strongest where it is thick
    float st = (noise(vec2(p.x * 9., p.y * .8 + uTime * .04)) - .5) + (noise(vec2(p.x * 23., p.y * 1.6)) - .5) * .45;
    vec3 n = normalize(vec3(g * slope + vec2(st * .1, st * .02) * smoothstep(0., .3, h) / (1. + uPuff * 2.), 1.));
    // through both faces and on to the name and the wall behind; each colour bent a little differently
    vec3 col; vec3 v = vec3(0., 0., -1.);
    vec2 grain = (vec2(hash(gl_FragCoord.xy + fract(uTime) * 61.), hash(gl_FragCoord.yx + 7.3)) - .5) * 1.2;
    // the ball is a crystal ball: what is behind it turned over, rushing out at its rim; the pillow bends it gently. As the
    // ball becomes the fat MK the one view dissolves into the other (mixing where they look made a colour-split splash)
    vec2 b = (p - uBall) / max(uRadius, 1e-3); float bb = min(dot(b, b), .992), rush = .55 + min(.8 / sqrt(1. - bb), 3.5);
    float sB = clamp(uRadius / max(uFar, 1e-3), 0., 1.), up = smoothstep(.1, .28, sB), mg = mix(.5, 1., smoothstep(.5, 1., sB));
    bool draws = uDraw + uGuides > 0.;
    for (int i = 0; i < 3; i++) {
      vec3 r = refract(v, n, 1. / (1.5 + (float(i) - 1.) * .018));
      float cp = 0., cb = 0.;
      if (uSphere < .999) { vec2 q = p + r.xy * (h * 2.8 + .3) / (1. + uPuff); cp = texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.); }
      if (uSphere > .001) {
        vec2 q = uBall - b * uRadius * rush * (1. + (float(i) - 1.) * .03);                                  // turned over
        vec2 qm = uBall + b * uRadius * mg * (1. + (float(i) - 1.) * .025 * (1. - sB)) * (1. + pow(bb, 3.) * .35 * (1. - sB));   // upright, magnified, stretched at the rim
        cb = mix(texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.),
                 texture2D(uBg, clamp((uCenter + qm * uUnit + grain * (1. - sB)) / uRes, .001, .999))[i], up);
      }
      col[i] = mix(cp, cb, uSphere);
    }
    float glassy = 1. - smoothstep(.6, 1., sB) * uSphere;        // a ball past the screen is nothing but the bend
    col *= mix(vec3(1.), uTint, clamp(h * 1.6, 0., .8) * glassy);   // tinted where the glass is deep
    float fres = .04 + .96 * pow(1. - n.z, 5.);
    vec3 refl = mix(vec3(.03, .03, .035), vec3(.95, .95, .97), smoothstep(-.4, .9, n.y));
    col = mix(col, refl, fres * .55 * glassy);
    col += vec3(1.) * pow(max(dot(reflect(v, n), normalize(vec3(-.35, .55, .75))), 0.), 70.) * .9 * glassy;
    // the white rim, out to the very edge, where the glow takes over (it stopped short: a dark hairline ringed the ball)
    col += vec3(.97, .98, 1.) * smoothstep(.8, .955, sqrt(bb)) * uSphere * .85 * glassy;
    float a = smoothstep(px * 1.2, -px * .8, d) * uAlpha;
    // the glass over what is round it, the glow on the black veil (straight alpha): its edge melts into the glow
    vec3 Co = vec3(.95, .96, 1.) * uSphere * step(.001, uRadius) * exp(-max(d, 0.) / (.03 + uRadius * .05)) * .85;
    float A = a + (1. - a) * max(uVeil, max(Co.r, max(Co.g, Co.b)));
    gl_FragColor = vec4((col * a + Co * (1. - a)) / max(A, 1e-4), A);
  }`;function Y(t,r,m,f){const c=new G(1,1,{type:D}),w=I(),g=new P({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:c.texture},uField:{value:w},uBox:{value:new z(...n)},uRes:{value:new S(1,1)},uCenter:{value:new S},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new _("#d9dce3")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new S},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0},uScreen:{value:0},uFar:{value:10}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:K}),o=new L(new W(2,2),g);o.frustumCulled=!1,o.renderOrder=1e3,o.visible=!1;let b=!0;function y(e){if(!o.visible)return;const s=e.getRenderTarget(),u=m.map(i=>i.visible);o.visible=!1,b&&m.forEach(i=>{i.visible=!1}),f?.(!0),e.setRenderTarget(c),e.clear(),e.render(t,r),f?.(!1),e.setRenderTarget(s),m.forEach((i,h)=>{i.visible=u[h]}),o.visible=!0}t.add(o);const a=g.uniforms;return{mesh:o,capture:y,resize(e,s){c.setSize(e,s),a.uRes.value.set(e,s)},hideGlass(e){b=e},warm(e){const s=e.getRenderTarget();e.setRenderTarget(c),e.compileAsync(o,r,t).catch(()=>{}),e.setRenderTarget(s)},set(e){a.uCenter.value.set(e.center[0],e.center[1]),a.uUnit.value=e.unit,a.uSphere.value=e.sphere,a.uRadius.value=e.radius,a.uPuff.value=e.puff,a.uAlpha.value=e.alpha,a.uTime.value=e.time,a.uVeil.value=e.veil??0,a.uWobble.value=e.wobble??0,a.uBall.value.set(...e.ball??[0,0]),a.uDraw.value=e.draw??0,a.uGuides.value=e.guides??0,a.uLine.value=e.line??.005,a.uWarp.value=e.warp??0,a.uRipple.value=e.ripple??0,a.uBeat.value=e.beat??0,a.uScreen.value=e.screen??0,a.uFar.value=e.far??10},dispose(){c.dispose(),w.dispose(),g.dispose(),o.geometry.dispose()}}}export{Y as g,X as s};
