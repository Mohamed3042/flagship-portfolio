import{p as D,r as T,W as P,H as M,b as U,v as S,C as G,V as _,M as z,a as V,a3 as H,aE as k,aG as A,ae as E,aH as O,u as I}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const c=[-3.1,-2.15,3.1,2.15];function X(u){const t=u>=.65,n=u-.65;return{passed:t,grow:(Math.exp(4.2*T(0,.65,u))-1)/(Math.exp(4.2)-1),screen:(t?Math.exp(-n*3.4)*Math.cos(n*8.5):D.in(T(.4,.65,u)))*(1-T(1.45,1.7,u))}}function K(u=448){const t=Math.round(u*(c[3]-c[1])/(c[2]-c[0])),n=H.map(e=>e.map(([s,r])=>[s-k.width/2,r-k.height/2])),d=new Float32Array(u*t);for(let e=0;e<t;e++)for(let s=0;s<u;s++){const r=c[0]+(s+.5)/u*(c[2]-c[0]),i=c[1]+(e+.5)/t*(c[3]-c[1]);let g=1/0,x=!1;for(const p of n){let f=!1;for(let l=0,L=p.length-1;l<p.length;L=l++){const[B,h]=p[L],[W,F]=p[l],b=W-B,C=F-h,q=Math.max(0,Math.min(1,((r-B)*b+(i-h)*C)/(b*b+C*C)));g=Math.min(g,(r-B-b*q)**2+(i-h-C*q)**2),h>i!=F>i&&r<B+(i-h)/(F-h)*b&&(f=!f)}x||=f}d[e*u+s]=(x?-1:1)*Math.sqrt(g)}const m=d.slice(),w=new Float32Array(u*t),v=10,o=2*v+1,y=(e,s,r,i,g)=>{for(let x=0;x<i;x++){const p=l=>e[g(x,Math.min(r-1,Math.max(0,l)))];let f=0;for(let l=-v;l<=v;l++)f+=p(l);for(let l=0;l<r;l++)s[g(x,l)]=f/o,f+=p(l+v+1)-p(l-v)}};for(let e=0;e<3;e++)y(m,w,u,t,(s,r)=>s*u+r),y(w,m,t,u,(s,r)=>r*u+s);const R=new Uint16Array(u*t*2);for(let e=0;e<u*t;e++)R[e*2]=A.toHalfFloat(d[e]),R[e*2+1]=A.toHalfFloat(m[e]);const a=new E(R,u,t,O,M);return a.minFilter=a.magFilter=I,a.needsUpdate=!0,a}const j=`
  uniform sampler2D uBg, uField; uniform vec2 uRes, uCenter, uBall; uniform vec4 uBox; uniform vec3 uTint;
  uniform float uUnit, uSphere, uRadius, uPuff, uAlpha, uTime, uVeil, uWobble, uDraw, uGuides, uLine, uWarp, uRipple, uBeat, uScreen, uFar, uWave, uLook;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
  float mk(vec2 p){ vec2 q = clamp(p, uBox.xy, uBox.zw), f = texture2D(uField, (q - uBox.xy) / (uBox.zw - uBox.xy)).rg; return mix(f.r, f.g, clamp(uPuff * 2.2, 0., 1.)) + length(p - q); }
  float shape(vec2 p){ return mix(mk(p) - uPuff, length(p - uBall) - uRadius, uSphere); }

  vec3 fringe(float x){ return vec3(exp(-pow((x - 1.2) / 1.1, 2.)), exp(-pow(x / 1.1, 2.)), exp(-pow((x + 1.2) / 1.1, 2.))) * .95; }

  float seg(float d, float w){ return 1. - smoothstep(w * .5 - .4 / uUnit, w * .5 + .4 / uUnit, abs(d)); }
  float far(vec2 m, vec2 a, vec2 b){ vec2 t = normalize(b - a); return dot(m - a, vec2(-t.y, t.x)); }


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

    return vec3(.85, .85, .87) * g * .11 * uGuides + vec3(.92, .92, .94) * o * .64 * uDraw;
  }


  float beat(float t){ return t < 0. ? 0. : pow(max(sin(t * 8.8), 0.), 2.); }
  vec2 ripple(vec2 p){
    vec2 v = p - uBall; float r = length(v);
    return v / max(r, 1e-3) * uRipple * beat(uBeat - r / 1.6) * sin(r * 9. - uBeat * 12.) * exp(-r * .22);
  }
  void main(){


    vec2 sc = (gl_FragCoord.xy - uRes * .5) / uRes.y, bulge = sc * uScreen * .45 * exp(-dot(sc, sc) * 1.5);
    vec2 p = (gl_FragCoord.xy - bulge * uRes.y - uCenter) / uUnit;
    if (uRipple > 0.) p += ripple(p);

    p += uWobble * vec2(sin(p.y * 4.3 + uTime * 5.1) + .5 * sin(p.y * 9.1 - uTime * 7.3), cos(p.x * 3.7 - uTime * 4.4) + .5 * cos(p.x * 8.3 + uTime * 6.1)) * .045;
    float d = shape(p), px = 1. / uUnit;
    if (d > px * 1.5) {



      vec2 v = p - uBall; float r2 = dot(v, v), R2 = uRadius * uRadius;
      float rr = sqrt(r2);
      vec3 C = (uDraw + uGuides > 0. ? drawing(uBall + v * sqrt(max(r2 - uWarp * .75 * R2, 0.) / max(r2, 1e-8))) : vec3(0.))
        + vec3(.95, .96, 1.) * uSphere * step(.001, uRadius) * exp(-d / mix(.03 + uRadius * .05, .008 + uRadius * .012, uLook)) * mix(.85, .4, uLook)
        + uLook * uSphere * step(.001, uRadius) * fringe(d / max(uLine, 1e-5)) * exp(-d / max(uLine, 1e-5) / 6.)
        + vec3(.92, .93, .97) * (uRipple > 0. ? beat(uBeat - rr / 1.6) * smoothstep(.55, 1., sin(rr * 9. - uBeat * 12.)) * exp(-rr * .7) * 1.6 * uRipple : 0.);
      if ((abs(uScreen) > .002 || uWave > .002) && uRadius < 1e-4) {


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
    g *= min(1., 1. / max(length(g), 1e-5));

    float s = max(-d, 0.), R = max(mix(.07 + uPuff * 1.15, uRadius, uSphere), .035);
    float x = clamp(s / R, 0., 1.), c = sqrt(max(1. - (1. - x) * (1. - x), 0.)), h = R * c;
    float slope = min((1. - x) / max(c, .06), 9.);

    float st = (noise(vec2(p.x * 9., p.y * .8 + uTime * .04)) - .5) + (noise(vec2(p.x * 23., p.y * 1.6)) - .5) * .45;
    vec3 n = normalize(vec3(g * slope + vec2(st * .1, st * .02) * smoothstep(0., .3, h) / (1. + uPuff * 2.), 1.));

    vec3 col; vec3 v = vec3(0., 0., -1.);
    vec2 grain = (vec2(hash(gl_FragCoord.xy + fract(uTime) * 61.), hash(gl_FragCoord.yx + 7.3)) - .5) * 1.2;


    vec2 b = (p - uBall) / max(uRadius, 1e-3); float bb = min(dot(b, b), .992), rush = .55 + min(.8 / sqrt(1. - bb), 3.5);
    float sB = clamp(uRadius / max(uFar, 1e-3), 0., 1.), up = smoothstep(.1, .28, sB), mg = mix(.5, 1., smoothstep(.5, 1., sB));
    bool draws = uDraw + uGuides > 0.;
    for (int i = 0; i < 3; i++) {
      vec3 r = refract(v, n, 1. / (1.5 + (float(i) - 1.) * .018));
      float cp = 0., cb = 0.;
      if (uSphere < .999) { vec2 q = p + r.xy * (h * 2.8 + .3) / (1. + uPuff); cp = texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.); }
      if (uSphere > .001) {
        vec2 q = uBall - b * uRadius * rush * (1. + (float(i) - 1.) * .03);
        vec2 qm = uBall + b * uRadius * mg * (1. + (float(i) - 1.) * .025 * (1. - sB)) * (1. + pow(bb, 3.) * .35 * (1. - sB));
        cb = mix(texture2D(uBg, clamp((uCenter + q * uUnit + grain) / uRes, .001, .999))[i] + (draws ? drawing(q)[i] : 0.),
                 texture2D(uBg, clamp((uCenter + qm * uUnit + grain * (1. - sB)) / uRes, .001, .999))[i], up);
      }
      col[i] = mix(cp, cb, uSphere);
    }
    float glassy = 1. - smoothstep(.6, 1., sB) * uSphere;
    col *= mix(vec3(1.), uTint, clamp(h * 1.6, 0., .8) * glassy);
    float fres = .04 + .96 * pow(1. - n.z, 5.);
    vec3 refl = mix(vec3(.03, .03, .035), vec3(.95, .95, .97), smoothstep(-.4, .9, n.y));
    col = mix(col, refl, fres * .55 * glassy);
    col += vec3(1.) * pow(max(dot(reflect(v, n), normalize(vec3(-.35, .55, .75))), 0.), 70.) * .9 * glassy;

    col += vec3(.97, .98, 1.) * smoothstep(.8, .955, sqrt(bb)) * uSphere * .85 * glassy * (1. - uLook);

    if (uLook > 0.) {
      col = mix(col, smoothstep(vec3(.1), vec3(.48), col), uLook * uSphere * glassy * .9);
      float rimPx = max(-d, 0.) / max(uLine, 1e-5);
      col += fringe(-rimPx) * uLook * uSphere * glassy * step(.001, uRadius);
    }
    float a = smoothstep(px * 1.2, -px * .8, d) * uAlpha;

    vec3 Co = vec3(.95, .96, 1.) * uSphere * step(.001, uRadius) * exp(-max(d, 0.) / mix(.03 + uRadius * .05, .008 + uRadius * .012, uLook)) * mix(.85, .4, uLook);
    float A = a + (1. - a) * max(uVeil, max(Co.r, max(Co.g, Co.b)));
    gl_FragColor = vec4((col * a + Co * (1. - a)) / max(A, 1e-4), A);
  }`;function Y(u,t,n,d){const m=new P(1,1,{type:M}),w=K(),v=new U({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uBg:{value:m.texture},uField:{value:w},uBox:{value:new _(...c)},uRes:{value:new S(1,1)},uCenter:{value:new S},uUnit:{value:100},uSphere:{value:1},uRadius:{value:1},uPuff:{value:0},uAlpha:{value:1},uTime:{value:0},uTint:{value:new G("#d9dce3")},uVeil:{value:0},uWobble:{value:0},uBall:{value:new S},uDraw:{value:0},uGuides:{value:0},uLine:{value:.005},uWarp:{value:0},uRipple:{value:0},uBeat:{value:0},uScreen:{value:0},uFar:{value:10},uWave:{value:0},uLook:{value:0}},vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:j}),o=new z(new V(2,2),v);o.frustumCulled=!1,o.renderOrder=1e3,o.visible=!1;let y=!0;function R(e){if(!o.visible)return;const s=e.getRenderTarget(),r=n.map(i=>i.visible);o.visible=!1,y&&n.forEach(i=>{i.visible=!1}),d?.(!0),e.setRenderTarget(m),e.clear(),e.render(u,t),d?.(!1),e.setRenderTarget(s),n.forEach((i,g)=>{i.visible=r[g]}),o.visible=!0}u.add(o);const a=v.uniforms;return{mesh:o,capture:R,resize(e,s){m.setSize(e,s),a.uRes.value.set(e,s)},hideGlass(e){y=e},warm(e){const s=e.getRenderTarget();e.setRenderTarget(m),e.compileAsync(o,t,u).catch(()=>{}),e.setRenderTarget(s)},set(e){a.uCenter.value.set(e.center[0],e.center[1]),a.uUnit.value=e.unit,a.uSphere.value=e.sphere,a.uRadius.value=e.radius,a.uPuff.value=e.puff,a.uAlpha.value=e.alpha,a.uTime.value=e.time,a.uVeil.value=e.veil??0,a.uWobble.value=e.wobble??0,a.uBall.value.set(...e.ball??[0,0]),a.uDraw.value=e.draw??0,a.uGuides.value=e.guides??0,a.uLine.value=e.line??.005,a.uWarp.value=e.warp??0,a.uRipple.value=e.ripple??0,a.uBeat.value=e.beat??0,a.uScreen.value=e.screen??0,a.uFar.value=e.far??10,a.uWave.value=e.wave??0,a.uLook.value=e.look??0},dispose(){m.dispose(),w.dispose(),v.dispose(),o.geometry.dispose()}}}export{Y as g,X as s};
