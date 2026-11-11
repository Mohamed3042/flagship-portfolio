import{o as T,r as f,q as P,H as W,b as _,s as S,C as z,t as L,M as V,a as G,u as j,v as M,w as D,x as H,R as O,y as E}from"./EditionWorld.astro_astro_type_script_index_0_lang.DJSO9PCe.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const m=[-3.1,-2.15,3.1,2.15];function X(a){const t=a>=.65,i=a-.65;return{passed:t,grow:(Math.exp(4.2*f(0,.65,a))-1)/(Math.exp(4.2)-1),screen:(t?Math.exp(-i*3.4)*Math.cos(i*8.5):T.in(f(.4,.65,a)))*(1-f(1.45,1.7,a))}}function Y(a,t=.43){const i=t/.43,g=a>=t,o=a-t,v=1-f(.5*i,.72*i,o);return{passed:g,grow:a<0?0:.06+.94*(Math.exp(2.6*f(0,t,a))-1)/(Math.exp(2.6)-1),screen:g?Math.exp(-o*5/i)*v:T.in(f(.5*t,t,a)),wave:g?Math.exp(-o*3.3/i)*v:.5*T.in(f(.28*t,t,a)),wobble:g||a<0?0:1.6*f(0,t,a)}}function I(a=448){const t=Math.round(a*(m[3]-m[1])/(m[2]-m[0])),i=j.map(e=>e.map(([r,l])=>[r-M.width/2,l-M.height/2])),g=new Float32Array(a*t);for(let e=0;e<t;e++)for(let r=0;r<a;r++){const l=m[0]+(r+.5)/a*(m[2]-m[0]),n=m[1]+(e+.5)/t*(m[3]-m[1]);let p=1/0,x=!1;for(const d of i){let w=!1;for(let u=0,k=d.length-1;u<d.length;k=u++){const[C,b]=d[k],[U,F]=d[u],B=U-C,q=F-b,A=Math.max(0,Math.min(1,((l-C)*B+(n-b)*q)/(B*B+q*q)));p=Math.min(p,(l-C-B*A)**2+(n-b-q*A)**2),b>n!=F>n&&l<C+(n-b)/(F-b)*B&&(w=!w)}x||=w}g[e*a+r]=(x?-1:1)*Math.sqrt(p)}const o=g.slice(),v=new Float32Array(a*t),h=10,c=2*h+1,y=(e,r,l,n,p)=>{for(let x=0;x<n;x++){const d=u=>e[p(x,Math.min(l-1,Math.max(0,u)))];let w=0;for(let u=-h;u<=h;u++)w+=d(u);for(let u=0;u<l;u++)r[p(x,u)]=w/c,w+=d(u+h+1)-d(u-h)}};for(let e=0;e<3;e++)y(o,v,a,t,(r,l)=>r*a+l),y(v,o,t,a,(r,l)=>l*a+r);const R=new Uint16Array(a*t*2);for(let e=0;e<a*t;e++)R[e*2]=D.toHalfFloat(g[e]),R[e*2+1]=D.toHalfFloat(o[e]);const s=new H(R,a,t,O,W);return s.minFilter=s.magFilter=E,s.needsUpdate=!0,s}const K=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp, uRipple, uBeat, uScreen, uFar, uWave;
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
      if ((abs(uScreen) > .002 || uWave > .002) && uRadius < 1e-4) {   // the room, bent by the pulse, once the ball has passed (round it: what was there)
        // (blast(): every row ripples sideways, two travelling waves and a torn streak, and rings run out from the middle;
        // in screen heights, each colour a little apart)
        float sr = length(sc);
        vec2 wv = uWave * (vec2(.05 * sin(sc.y * 12. - uTime * 11.) + .03 * sin(sc.y * 27. + uTime * 16.) + .035 * (noise(vec2(sc.y * 150., uTime * 9.)) - .5),
          .012 * sin(sc.x * 9. - uTime * 8.)) + sc / max(sr, 1e-3) * .02 * sin(sr * 26. - uTime * 22.)) * uRes.y;
        vec3 w;
        for (int i = 0; i < 3; i++) w[i] = texture2D(uBg, clamp((gl_FragCoord.xy - (bulge * uRes.y + wv) * (1. + (float(i) - 1.) * .07)) / uRes, .001, .999))[i];
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
  }`;function Z(a,t,i,g){const o=new P(1,1,{type:W}),v=I(),h=new _({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:o.texture},uField:{value:v},uBox:{value:new L(...m)},uRes:{value:new S(1,1)},uCenter:{value:new S},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new z("#d9dce3")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new S},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0},uScreen:{value:0},uFar:{value:10},uWave:{value:0}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:K}),c=new V(new G(2,2),h);c.frustumCulled=!1,c.renderOrder=1e3,c.visible=!1;let y=!0;function R(e){if(!c.visible)return;const r=e.getRenderTarget(),l=i.map(n=>n.visible);c.visible=!1,y&&i.forEach(n=>{n.visible=!1}),g?.(!0),e.setRenderTarget(o),e.clear(),e.render(a,t),g?.(!1),e.setRenderTarget(r),i.forEach((n,p)=>{n.visible=l[p]}),c.visible=!0}a.add(c);const s=h.uniforms;return{mesh:c,capture:R,resize(e,r){o.setSize(e,r),s.uRes.value.set(e,r)},hideGlass(e){y=e},warm(e){const r=e.getRenderTarget();e.setRenderTarget(o),e.compileAsync(c,t,a).catch(()=>{}),e.setRenderTarget(r)},set(e){s.uCenter.value.set(e.center[0],e.center[1]),s.uUnit.value=e.unit,s.uSphere.value=e.sphere,s.uRadius.value=e.radius,s.uPuff.value=e.puff,s.uAlpha.value=e.alpha,s.uTime.value=e.time,s.uVeil.value=e.veil??0,s.uWobble.value=e.wobble??0,s.uBall.value.set(...e.ball??[0,0]),s.uDraw.value=e.draw??0,s.uGuides.value=e.guides??0,s.uLine.value=e.line??.005,s.uWarp.value=e.warp??0,s.uRipple.value=e.ripple??0,s.uBeat.value=e.beat??0,s.uScreen.value=e.screen??0,s.uFar.value=e.far??10,s.uWave.value=e.wave??0},dispose(){o.dispose(),v.dispose(),h.dispose(),c.geometry.dispose()}}}export{Y as b,Z as g,X as s};
