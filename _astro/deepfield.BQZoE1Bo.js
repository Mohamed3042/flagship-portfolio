import{V as a,p as P,q as _,H as q,y as R,C as T,aB as D,i as b,S as z,bh as W,aF as C,ao as A,aq as E,s as H}from"./EditionWorld.astro_astro_type_script_index_0_lang.BRlO4Qlr.js";import{b as O,a as N,c as j}from"./sky.qn0oorge.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const m=P.degToRad;function k(o,l,h=new a){return h.set(Math.sin(l)*Math.cos(o),Math.sin(o),-Math.cos(l)*Math.cos(o))}const J={pitch:m(34),yaw:m(14)},V={pitch:m(8),yaw:m(-22)},B=o=>`
  uniform sampler3D uNoise; uniform mat4 uProjInv, uCamWorld;
  uniform vec3 uCamPos, uAxisO, uAxisD, uSide, uUp, uStar, uStar2, uStarCol, uStar2Col;
  uniform float uDensity, uTime, uFar, uGlow, uLen;
  varying vec2 vNdc;
  ${j}
  // a cliff of gas along one side of the flight (the far side from the star), a floor of it below, wisps in the open:
  // never a tunnel round the view, so it never reads as an eye
  // lite: the look toward the star needs only the shape, not its finest grain or its colour (two fetches fewer)
  float field(vec3 p, out float em, bool lite){
    vec3 rel = p - uAxisO; float along = dot(rel, uAxisD);
    float x = dot(rel, uSide), y = dot(rel, uUp);
    vec3 q = p * .019 + vec3(uTime * .0012, 0., uTime * .0008);
    vec3 w = texture(uNoise, q * .5).rgb - .5;
    float n = texture(uNoise, q + w * .95).r * .5 + texture(uNoise, q * 2.1 + w * 1.2).g * .34 + (lite ? .08 : texture(uNoise, q * 4.6 + w * 1.8).r * .16);
    // the cliff's face bulges in and out at the largest scale and leans back as it rises, ragged at every scale
    float big = texture(uNoise, vec3(along * .0055, y * .011, .37)).r - .5;
    float wall = x - 11. - big * 50. - y * .3 - (n - .5) * 30.;
    // the floor of cloud below, pillars rising out of it
    float tower = pow(texture(uNoise, vec3(along * .009, x * .013, .71)).g, 4.) * 74.;
    float floor_ = -y - 17. + tower - (n - .5) * 24.;
    float body = max(wall, floor_);
    float th = mix(.86, .47, smoothstep(-10., 12., body));
    th += smoothstep(38., 70., max(x, -y)) * .5;                                          // deep in, it thins to nothing
    th += (texture(uNoise, q * .23 + 3.3).g - .55) * .3;                                  // banks and voids at the largest scale
    th += (1. - smoothstep(-20., 30., along)) * .6 + smoothstep(uLen - 70., uLen, along) * .55;   // it begins ahead and ends
    em = lite ? .5 : texture(uNoise, q * 1.3 + 9.1).b;
    float d = clamp((n - th) * 6., 0., 1.);
    return d * d;
  }
  vec3 dirAt(vec2 ndc){ vec4 v = uProjInv * vec4(ndc, 1., 1.); return normalize(mat3(uCamWorld) * (v.xyz / v.w)); }
  void main(){
    vec3 rd = dirAt(vNdc), ro = uCamPos;
    float T = 1.; vec3 col = vec3(0.);
    float dt = uFar / ${o}.;
    float t = dt * (.25 + .5 * h21(gl_FragCoord.xy));
    for (int i = 0; i < ${o}; i++) {
      vec3 p = ro + rd * t;
      float em; float d = field(p, em, false) * uDensity;
      if (d > .002) {
        vec3 toS = uStar - p; float ls = length(toS); vec3 L = toS / ls;
        float e2; float dl = field(p + L * 3.5, e2, true);
        float lit = clamp(.6 - (dl - d / max(uDensity, 1e-3)) * 2.8, 0., 1.2);            // faces turned to the star are lit
        lit = lit * lit * lit;
        float fall = 1. / (1. + ls * ls * .00028), fall2 = 1. / (1. + dot(uStar2 - p, uStar2 - p) * .0012);
        vec3 glow = mix(vec3(.13, .06, .26), vec3(.7, .19, .34), smoothstep(.36, .64, em));   // violet into dusty rose
        glow = mix(glow, vec3(1., .62, .32), smoothstep(.4, .95, fall) * .75);                 // gold near the star
        float dust = smoothstep(.56, .7, texture(uNoise, p * .041 + 5.).g) * smoothstep(.6, .38, em);
        float lining = clamp((d / max(uDensity, 1e-3) - dl) * 3., 0., 1.) * fall;           // the silver lining: where the light comes in
        vec3 emit = (glow * (.0045 + .5 * fall * lit) + uStarCol * pow(fall, 6.) * lit * .45 + uStar2Col * fall2 * lit * .22
                   + vec3(1., .82, .62) * lining * lining * .45) * (1. - dust * .96) * uGlow;
        float a = 1. - exp(-d * dt * .17);
        col += T * a * emit;
        T *= 1. - a;
        if (T < .02) break;
      }
      t += dt * (.8 + .4 * float(i) / ${o}.);
    }
    gl_FragColor = vec4(col, 1. - T);
  }`;function G(o,{length:l=320}={}){const{noise:h}=O(o),u=o.quality,U=u===0?1/3:1/2,F=u===0?30:u===1?40:50,L=[25e4,42e4,56e4][u],s=new _(1,1,{type:q,depthBuffer:!1});s.texture.minFilter=s.texture.magFilter=R;const t={uNoise:{value:h},uProjInv:{value:new D},uCamWorld:{value:new D},uCamPos:{value:new a},uAxisO:{value:new a},uAxisD:{value:new a(0,0,-1)},uSide:{value:new a(1,0,0)},uUp:{value:new a(0,1,0)},uStar:{value:new a(0,0,-200)},uStar2:{value:new a(60,20,-120)},uStarCol:{value:new T("#fff1dc").multiplyScalar(1.6)},uStar2Col:{value:new T("#aebfff")},uDensity:{value:0},uTime:{value:0},uFar:{value:240},uGlow:{value:1},uLen:{value:l}},y=new b({uniforms:t,fragmentShader:B(F),depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vNdc; void main(){ vNdc = position.xy; gl_Position = vec4(position.xy, 0., 1.); }"}),p=new z,S=new W;p.add(N(y,0));{const e=o.renderer,r=e.getRenderTarget();e.setRenderTarget(s),e.compileAsync(p,S).catch(()=>{}),e.setRenderTarget(r)}const g=new b({uniforms:{tVol:{value:s.texture},uTexel:{value:new H(1,1)}},depthTest:!1,depthWrite:!1,transparent:!1,blending:E,blendSrc:A,blendDst:C,blendSrcAlpha:A,blendDstAlpha:C,vertexShader:"varying vec2 vUv; void main(){ vUv = position.xy * .5 + .5; gl_Position = vec4(position.xy, .9999, 1.); }",fragmentShader:`uniform sampler2D tVol; uniform vec2 uTexel; varying vec2 vUv;
      void main(){ vec2 o = uTexel * .6;
        gl_FragColor = (texture2D(tVol, vUv + vec2(o.x, o.y)) + texture2D(tVol, vUv + vec2(-o.x, o.y)) + texture2D(tVol, vUv + vec2(o.x, -o.y)) + texture2D(tVol, vUv - o)) * .25; }`}),c=N(g,-900);return c.onBeforeRender=(e,r,n)=>{if(t.uDensity.value<=.001)return;t.uProjInv.value.copy(n.projectionMatrixInverse),t.uCamWorld.value.copy(n.matrixWorld),t.uCamPos.value.setFromMatrixPosition(n.matrixWorld);const d=e.getRenderTarget();e.setRenderTarget(s),e.render(p,S),e.setRenderTarget(d)},{mesh:c,uniforms:t,axis(e,r){t.uAxisO.value.copy(e),t.uAxisD.value.copy(r).normalize(),t.uSide.value.crossVectors(t.uAxisD.value,new a(0,1,0)).normalize(),t.uUp.value.crossVectors(t.uSide.value,t.uAxisD.value).normalize()},resize(e){const r=Math.min(U,Math.sqrt(L/Math.max(1,e.width*e.height*e.dpr*e.dpr))),n=Math.max(1,Math.round(e.width*e.dpr*r)),d=Math.max(1,Math.round(e.height*e.dpr*r));s.setSize(n,d),g.uniforms.uTexel.value.set(1/n,1/d)},set(e,r){t.uDensity.value=e,t.uTime.value=r,c.visible=e>.001},dispose(){s.dispose(),y.dispose(),g.dispose(),c.geometry.dispose()}}}const I=new a(0,1,0),i=k(V.pitch,V.yaw,new a),v=new a().crossVectors(i,I).normalize(),x=new a().crossVectors(v,i).normalize(),f=new a(0,.45,-1.6),w=330,M={LEN:w,head:i,side:v,up:x,start:f,star:f.clone().addScaledVector(i,w*.66).addScaledVector(v,-12).addScaledVector(x,21),star2:f.clone().addScaledVector(i,150).addScaledVector(v,58).addScaledVector(x,-22)},K=.4;function X(o){const l=G(o,{length:w});return l.axis(f.clone().addScaledVector(i,-10),i),l.uniforms.uStar.value.copy(M.star),l.uniforms.uStar2.value.copy(M.star2),l}export{K as D,J as L,V as N,M as a,X as d,k as l};
