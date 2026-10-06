import{S as ce,P as ve,a0 as pe,aD as ue,G as fe,i as y,aj as he,M as w,Y as P,a4 as de,b as me,C as we,a as K,ak as $,al as ge,am as xe,V as _,a2 as Q,o as ee,r as te,aC as be,u as ye}from"./EditionWorld.astro_astro_type_script_index_0_lang.D4T00N5d.js";import{f as Le,N as j,L as oe,p as Me,l as Se,b as ae,a as Fe,C as W}from"./common.Cj7bspG1.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ce=async g=>{const v=g.lang==="ar",p=oe.length,A=new ce,u=new ve(36,g.viewport.aspect,.05,200),T=2.3,a=p*T,L=.5,s={uTime:{value:0},uMouth:{value:0},uFocus:{value:0},uLen:{value:a},uFlip:{value:0},uTall:{value:0}},C="float flipX(float x){ return uFlip > .5 ? uLen - x : x; }",B=`
    float cellF1(vec2 p){ vec2 n = floor(p), f = fract(p); float d = 8.;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){ vec2 g = vec2(i, j), o = h22(n + g); d = min(d, length(g + o - f)); }
      return d; }
    vec3 wallAt(vec2 p, float x){
      float toward = smoothstep(-2., uLen + 6., x);
      float thick = fbm(p * .16 + 2.) + toward * .12, thin = fbm3(p * .55 + 9.);
      float d1 = cellF1(p * .85), d2 = cellF1(p * 2.1 + 4.);
      float dim = smoothstep(.15, .75, d1) * .65 + smoothstep(.1, .7, d2) * .35;   // 0 in a scallop's middle, 1 at its rim
      vec3 deep = vec3(.005, .03, .09), mid = vec3(.025, .2, .48), cyan = vec3(.22, .66, .92), white = vec3(.7, .9, 1.);
      vec3 col = mix(deep, mid, smoothstep(.2, .7, thick) * (.75 + .5 * toward));
      col = mix(col, cyan, smoothstep(.58, .86, thick) * .65 + smoothstep(.72, .95, thin) * .25);
      col *= .82 + .3 * (1. - dim);
      col += white * pow(dim, 6.) * .07 * (.4 + toward);
      float bub = step(.93, h21(floor(p * 38.))) * smoothstep(.62, .9, vnoise(p * 2.7));
      col += white * bub * .18;
      col *= 1. - .22 * smoothstep(.975, 1., sin((p.y * .9 + p.x * .12 + vnoise(p * .3) * 1.6) * 7.));
      float cs = vnoise(p * 1.8 + vec2(uTime * .15, -uTime * .1)) + vnoise(p * 3.1 - vec2(uTime * .12, 0.)) * .6;
      col += cyan * pow(1. - abs(sin(cs * 5.)), 9.) * .1 * (.4 + toward);
      return col;
    }
  `;await Le();const r=document.createElement("canvas"),e=r.getContext("2d"),f=new pe(r);f.minFilter=ue,f.anisotropy=8;function ie(t){r.width=t?1024:2048,r.height=2048;const n=r.height/p;e.setTransform(1,0,0,1,0,0),e.fillStyle="#000",e.fillRect(0,0,r.width,r.height),e.fillStyle="#fff",e.textAlign="center",e.textBaseline="middle",oe.forEach((o,E)=>{const h=o.year==="now"?v?"الآن":"NOW":v?ae(o.year):o.year,x=t?1:.465,c=(t?n*.52:n*.56)/x;e.setTransform(1,0,0,x,r.width/2,(E+.5)*n),e.font=v?`700 ${c*.9}px "Cairo Variable", sans-serif`:`300 ${c}px "Space Grotesk Variable", sans-serif`,e.fillText(h,0,-c*.14);const b=c*.2,z=o.etch?v?ae(o.etch.ar):o.etch.en.toUpperCase():"";e.font=v?`600 ${b*1.15}px "Cairo Variable", sans-serif`:`500 ${b}px "Space Grotesk Variable", sans-serif`,"letterSpacing"in e&&(e.letterSpacing=v?"0px":`${b*.18}px`),e.fillText(z,0,c*.5),"letterSpacing"in e&&(e.letterSpacing="0px")}),e.setTransform(1,0,0,1,0,0),f.dispose(),f.needsUpdate=!0}const l=new fe;A.add(l);const se=new y({side:he,uniforms:s,vertexShader:`
      varying vec3 vL;
      void main(){
        vec3 p = position;
        float a = atan(p.z, p.y);
        p.yz *= 1. + .12 * sin(a * 3. + p.x * .21) + .08 * sin(a * 7. - p.x * .43) + .05 * sin(p.x * 1.3 + a * 2.);
        vL = p;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }`,fragmentShader:`
      ${j}
      uniform float uTime, uMouth, uLen, uFlip, uTall; varying vec3 vL;
      ${C}
      ${B}
      void main(){
        float a = atan(vL.z, vL.y), x = flipX(vL.x);
        vec3 col = wallAt(vec2(vL.x, a * 2.3), x);
        col *= 1. + 1.6 * smoothstep(uLen + 2., uLen + 16., x) + uMouth * 2.5 * smoothstep(uLen - 4., uLen + 8., x);   // the mouth, far off, full of daylight
        gl_FragColor = vec4(col, 1.);
      }`}),V=new w(new P(4.6,4.6,a+40,64,80,!0).rotateZ(Math.PI/2),se);V.position.set(a/2,0,0),l.add(V);const ne=new y({uniforms:{...s,uEtch:{value:f},uN:{value:p},uB:{value:T}},vertexShader:`
      varying vec3 vL, vN, vW;
      void main(){ vL = position; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      ${j}
      uniform sampler2D uEtch; uniform float uTime, uN, uB, uFocus, uLen, uMouth, uFlip, uTall; varying vec3 vL, vN, vW;
      ${C}
      ${B}
      void main(){
        vec3 V = normalize(vW - cameraPosition), N = normalize(vN);
        float x = flipX(vL.x), band = floor(x / uB), f = fract(x / uB);
        float a = atan(vL.z, vL.y);                                     // round the core; 1.57 faces you
        // the year's layers: clear summer ice, white bubbly winter ice, a thin dark line of dust between years
        float winter = smoothstep(.56, .74, f) * smoothstep(1., .92, f) + smoothstep(.12, .0, f) * .55;
        float dust = smoothstep(.01, .0, abs(f - .02)) * .75 + smoothstep(.005, .0, abs(f - .5)) * .2;
        float fres = pow(1. - abs(dot(-V, N)), 3.);
        // clear ice: the cave behind, seen through a lens (flipped top to bottom, squeezed), brighter at the rims
        float k = (a - 1.57);                                           // -1 top … 1 bottom of the face (roughly)
        vec3 through = wallAt(vec2(vL.x * .97, (1.57 - k * 2.4) * 2.3 + 1.), x) * 1.15;
        vec3 clearIce = through * (.75 + .25 * (1. - fres)) + vec3(.55, .85, 1.) * fres * .55;
        clearIce += vec3(.6, .9, 1.) * exp(-pow((k - .62) / .05, 2.)) * .35;   // where it focuses the light, a bright line
        vec2 bq = vec2(x * 26., a * 11.);
        float bub = step(.84, h21(floor(bq))) * smoothstep(.45, .1, length(fract(bq) - .5));
        vec3 white = vec3(.66, .85, 1.) * (.5 + .3 * vnoise(vec2(x * 6., a * 3.))) + bub * .35;
        vec3 col = mix(clearIce, white, winter * .82);
        col = mix(col, vec3(.06, .08, .1), dust);
        // its skin catches the light from above: a long highlight along the top
        col += vec3(.75, .92, 1.) * pow(max(dot(reflect(V, N), normalize(vec3(.15, 1., .35))), 0.), 70.) * .9;
        // the year etched into its band, on the side that faces you, frosted white
        float u = (a - 1.57) / .62;                                    // across the face: -1 one edge, 1 the other
        float e = 0.;
        if (abs(u) < 1. && band >= 0. && band < uN) {
          float fx = uFlip > .5 ? 1. - f : f;                           // (the type always reads the right way)
          vec2 st = uTall > .5 ? vec2(.5 + u * .5, (.5 + .0337 - f) / .0674) : vec2(fx, .5 + u * .5);
          if (st.y > 0. && st.y < 1.) e = texture2D(uEtch, vec2(st.x, 1. - (band + st.y) / uN)).r * smoothstep(1., .85, abs(u));
        }
        float lit = exp(-pow((band + .5 - uFocus) * 1.6, 2.));          // the band in front is lit
        col += vec3(.92, .97, 1.) * e * (.45 + .9 * lit);
        col *= .75 + .55 * lit;
        col += vec3(.3, .55, .8) * fres * .3;
        col *= 1. + uMouth * 1.5 * smoothstep(uLen - 3., uLen + 4., x);
        gl_FragColor = vec4(col, 1.);
      }`}),G=new P(L,L,a,64,Math.round(a*8),!1).rotateZ(-Math.PI/2);G.translate(a/2,0,0);const q=new w(G,ne);l.add(q);const M=new w(new P(L+.08,L+.08,a+.5,40,1,!0,Math.PI/2,Math.PI).rotateZ(-Math.PI/2),new y({side:de,vertexShader:"varying vec3 vN, vW; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      varying vec3 vN, vW;
      void main(){ vec3 V = normalize(vW - cameraPosition), N = normalize(vN); float f = pow(1. - abs(dot(-V, N)), 2.);
        vec3 c = mix(vec3(.05, .08, .12), vec3(.35, .6, .85), f) + vec3(.6, .8, 1.) * pow(max(dot(reflect(V, N), normalize(vec3(.3, 1., .4))), 0.), 30.) * .4;
        gl_FragColor = vec4(c, 1.); }`}));M.position.set(a/2,-.06,0),l.add(M);const S=new w(new P(.012,.012,30,6).rotateZ(Math.PI/2),new me({color:new we("#9bb6c8")}));S.position.set(a+15,0,0),l.add(S);const F=new w(new K(a+40,12).rotateX(-Math.PI/2),new y({uniforms:s,vertexShader:"varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      ${j}
      uniform float uTime, uMouth, uLen, uFlip; varying vec3 vL;
      ${C}
      void main(){
        vec2 p = vL.xz;
        float x = flipX(vL.x + uLen * .5);
        // drips landing: rings spreading in the film of water
        float rings = 0.;
        for (int i = 0; i < 4; i++){
          float fi = float(i), per = 2.3 + fi * .7, ph = fract((uTime + fi * 1.3) / per);
          vec2 c = vec2(fi * 4.4 - 6., -1. - fi * .4);
          rings += smoothstep(.03, 0., abs(length(p - c) - ph * 1.2)) * (1. - ph);
        }
        float toward = smoothstep(-2., uLen + 6., x);
        vec3 col = vec3(.01, .05, .12) * (.6 + .8 * toward) + vec3(.2, .5, .9) * rings * .25;
        col += vec3(.1, .35, .7) * pow(vnoise(p * vec2(.6, 2.)), 4.) * .3 * toward;
        gl_FragColor = vec4(col * (1. + uMouth * 2. * smoothstep(uLen - 4., uLen + 8., x)), 1.);
      }`}));F.position.set(a/2,-1.55,0),l.add(F);const D=new K(.012,.18),U=new y({transparent:!0,depthWrite:!1,blending:xe,blendSrc:$,blendDst:$,blendSrcAlpha:ge,blendDstAlpha:$,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vUv; void main(){ float a = smoothstep(.5, 0., abs(vUv.x - .5)) * smoothstep(0., .8, vUv.y); gl_FragColor = vec4(vec3(.7, .9, 1.) * a * .8, 0.); }"}),re=Array.from({length:6},(t,n)=>{const o=new w(D,U);return o.position.set(n*3.4+.8,0,-1.4-n%3*.5),l.add(o),o});let i=!1,O="";function X(){i=g.viewport.portrait,u.aspect=g.viewport.aspect,u.fov=i?58:36,u.updateProjectionMatrix();const t=String(i);t!==O&&(O=t,l.rotation.z=i?Math.PI/2:0,s.uTall.value=i?1:0,s.uFlip.value=v&&!i?1:0,F.visible=M.visible=!i,S.visible=i,ie(i))}X();const k=new _,I=new _,le=new _(0,1,0);let N=-1,Z=!0;return{scene:A,camera:u,resize:X,update({p:t,t:n,dt:o}){const E=W.last-W.first,h=(t-W.first)/E*(p-1),x=Q(h,0,p-1),c=Math.floor(x),b=x-c,z=h<0||h>p-1?h:c+ee.inOut(te(.25,.8,b));N=Z||Fe?z:ye(N,z,4.5,o),Z=!1,s.uTime.value=n,s.uFocus.value=Q(N,-1,p),s.uMouth.value=ee.in(te(.88,1,t));let d=(N+.5)*T;if(s.uFlip.value>.5&&(d=a-d),i)k.set(0,d-.35,3.9),I.set(0,d+.3,0);else{const m=s.uFlip.value>.5?-1:1;k.set(d-1.5*m,.95,4.4),I.set(d+1.4*m,-.12,0)}const R=Me(g,n,o);Se(u,k,I,R.x*.5,R.y*.5,{upHint:le}),re.forEach((m,H)=>{const Y=1.9+H*.37,J=(n+H*.8)%Y/Y;m.position.y=be(2.8,-1.5,J*J),m.visible=!i,m.quaternion.copy(u.quaternion)})},dispose(){f.dispose(),[V,q,M,S,F].forEach(t=>{t.geometry.dispose(),t.material.dispose()}),D.dispose(),U.dispose()}}};export{Ce as default};
