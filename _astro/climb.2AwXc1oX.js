import{V as f,ac as Te,ad as Ke,K as Ye,N as Qe,aR as Xe,H as Je,T as et,S as tt,P as ot,C as b,i as O,s as at,aS as Y,aC as z,M as I,aI as Ae,b as nt,ak as q,al as De,am as Fe,av as st,a7 as it,_ as rt,ay as lt,k as ct,Q as ut,a4 as vt,a as mt,o as j,r as Z,F as ft,Z as dt,u as pt}from"./EditionWorld.astro_astro_type_script_index_0_lang.DjiVaGuA.js";import{d as _e,q as ht,s as wt,N as re,h as S,p as yt,l as gt,i as He,j as xt,a as St,k as Mt}from"./common.Den9xvki.js";import{s as bt}from"./snow.2CpLRtdg.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const U=(a,n,e)=>a+(n-a)*e,ve=a=>Math.min(1,Math.max(0,a)),Q=(a,n,e)=>{const s=ve((e-a)/(n-a));return s*s*(3-2*s)};function X(a,n){let e=Math.imul(a,374761393)+Math.imul(n,668265263)|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function Le(a,n){const e=Math.floor(a),s=Math.floor(n),o=a-e,c=n-s,i=o*o*(3-2*o),r=c*c*(3-2*c);return U(U(X(e,s),X(e+1,s),i),U(X(e,s+1),X(e+1,s+1),i),r)}function We(a,n,e){let s=.5,o=1,c=0,i=1;for(let r=0;r<e;r++){let m=1-Math.abs(Le(a*o+r*17.3,n*o-r*9.1)*2-1);m*=m*i,i=ve(m*1.6),c+=s*m,o*=2.07,s*=.5}return c}const R=new f(0,88.49,0),le={x:5,z:31,h:85.16},E=(a,n)=>{const e=Math.hypot(a,n);return[a/e,n/e]},zt=[E(-.72,.7),E(1,.18),E(-.12,-1)],Ct=[E(-.86,-.5),E(.25,1),E(1,-.25)],ce=[[-96,64,48.5],[-62,38,53.64],[-50,34,57.2],[-38,30,60.65],[-18,27,65],[-5,25,68.5],[2,21,72]],A=[[-62,53.64,38],[-38,60.65,30],[-18,65,27],[-1,74.7,24.5],[6.2,79.2,13.5],[.54,87.5,1.78],[0,88.49,0]];function ue(a,n,e,s,o,c){const i=o-e,r=c-s,m=ve(((a-e)*i+(n-s)*r)/(i*i+r*r));return{d:Math.hypot(a-e-i*m,n-s-r*m),t:m}}function Nt(a,n){let e=1e9,s=0;for(let o=0;o<ce.length-1;o++){const c=ce[o],i=ce[o+1],r=ue(a,n,c[0],c[1],i[0],i[1]);r.d<e&&(e=r.d,s=U(c[2],i[2],r.t))}return{d:e,h:s}}function W(a,n){let e=-1e9;for(const[G,T]of zt)e=Math.max(e,G*(a-R.x)+T*(n-R.z));e=Math.sqrt(e*e+.03)-.173;const s=R.y-1.18*e-Math.max(0,e-9)*.35;e=-1e9;for(const[G,T]of Ct)e=Math.max(e,G*(a-le.x)+T*(n-le.z));const o=le.h-1.15*e-Math.max(0,e-8)*.3,c=ue(a,n,-34,42,-1,37),i=78.6-1.3*c.d-Math.abs(c.t-.62)*9,r=ue(a,n,0,0,-30,5),m=U(84,70,r.t)-1.25*r.d,C=Math.hypot(a+20,n-18),d=50+30*We(a*.03+3,n*.03-2,4)*Q(25,60,C)+10*Q(60,110,C);let u=Math.max(s,o,i,m,d);const v=Nt(a,n),N=v.h+(.09*Math.pow(Math.max(v.d-2.2,0),1.75)+.02*v.d*v.d)*(1+Math.max(0,v.h-62)*.2);u=Math.min(u,N);const y=Math.hypot(a-R.x,n-R.z),P=(Q(1.5,5,v.d)*.85+.15)*Q(.15,1.6,y);return u+=(We(a*.19,n*.19,5)-.32)*3.2*P+(Le(a*.9,n*.9)-.5)*.5*P,u}async function Ue(a,n,e,s,o,c){const i=new Float32Array(o*o*3),r=new Float32Array(o*o);for(let d=0;d<o;d++){const u=U(n,s,d/(o-1));for(let v=0;v<o;v++){const N=U(a,e,v/(o-1)),y=d*o+v,P=W(N,u)-(c?c(N,u):0);r[y]=P,i[y*3]=N,i[y*3+1]=P,i[y*3+2]=u}d%24===23&&await _e()}const m=[];for(let d=0;d<o-1;d++)for(let u=0;u<o-1;u++){const v=d*o+u,N=v+1,y=v+o,P=y+1;m.push(v,y,N,N,y,P)}const C=new Te;return C.setAttribute("position",new Ke(i,3)),C.setIndex(m),C.computeVertexNormals(),{geometry:C,heights:r}}function Pt(a,n){const e=new Uint16Array(n*n);for(let o=0;o<n*n;o++)e[o]=Ye.toHalfFloat(a[o]);const s=new Qe(e,n,n,Xe,Je);return s.minFilter=s.magFilter=et,s.needsUpdate=!0,s}const Wt=async a=>{const n=a.quality,e=new tt,s=new ot(40,a.viewport.aspect,.05,3e3),o={uSun:{value:new f(.36,.42,.83).normalize()},uSunCol:{value:new b("#fff1dc").multiplyScalar(2.3)},uSky:{value:new b("#8fb3e6")},uHaze:{value:new b("#b8cde6")},uZen:{value:new b("#2e5fae")},uDeep:{value:0},uTime:{value:0},uGold:{value:0}},c=`
    uniform vec3 uSun, uSunCol, uSky, uHaze, uZen; uniform float uDeep, uTime, uGold;
    vec3 sky(vec3 d){
      float y = max(d.y, 0.), mu = max(dot(d, uSun), 0.);
      vec3 zen = mix(uZen, vec3(.02, .07, .22), uDeep);              // thinner air, deeper blue
      vec3 c = mix(uHaze, zen, pow(y, mix(.5, .3, uDeep)));
      c += uSunCol * (pow(mu, 8.) * .12 + pow(mu, 200.) * .8) + uSunCol * smoothstep(.9997, .9999, mu) * 8.;
      return c;
    }
  `,i=new O({uniforms:o,depthWrite:!1,vertexShader:ht(1),fragmentShader:`${c}
varying vec4 vDir; void main(){ vec3 d = normalize(vDir.xyz / vDir.w); gl_FragColor = vec4(d.y < 0. ? uHaze : sky(d), 1.); }`});e.add(wt(i,-10));const r=-120,m=70,C=-80,d=100,u=[-7,-7,11,11],v=n===0?180:256,N=n===0?112:168,y=(t,l)=>t>u[0]+1.2&&t<u[2]-1.2&&l>u[1]+1.2&&l<u[3]-1.2,P=await Ue(r,C,m,d,v,(t,l)=>y(t,l)?1.5:0),G=await Ue(u[0],u[1],u[2],u[3],N),T=Pt(P.heights,v);await _e();const J=[A[4],A[5],A[6]].map(t=>new at(t[0],t[2])),Oe=new Y(Array.from({length:48},(t,l)=>{const h=l/47,x=h<.7?0:1,p=x?(h-.7)/.3:h/.7,w=J[x],M=J[x+1],$=z(w.x,M.x,p),V=z(w.y,M.y,p);return new f($,W($,V)+.02,V)})),me=t=>new O({uniforms:{...o,uH:{value:T},uHRect:{value:new ft(r,C,m,d)},uRope:{value:J}},polygonOffset:t,polygonOffsetFactor:t?3:0,polygonOffsetUnits:t?3:0,vertexShader:"varying vec3 vW, vN; void main(){ vW = position; vN = normal; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); }",fragmentShader:`
      ${re}
      ${c}
      uniform sampler2D uH; uniform vec4 uHRect; uniform vec2 uRope[3];
      varying vec3 vW, vN;
      void main(){
        vec2 p = vW.xz;
        float dist = length(vW - cameraPosition);
        vec3 N = normalize(vN);
        // fine relief the grid is too coarse for: wind-carved flutes and crags, fading with distance
        float fade = smoothstep(60., 8., dist);
        vec2 g = vec2(vnoise(p * 6.) - .5, vnoise(p * 6. + 7.) - .5) + vec2(vnoise(p * 19.) - .5, vnoise(p * 19. + 3.) - .5) * .5;
        N = normalize(N + vec3(g.x, 0., g.y) * .35 * fade);
        // snow where it can lie, rock where it cannot; the Yellow Band high on the pyramid; glacier ice low down
        float alt = vW.y;
        float snow = smoothstep(.6, .8, N.y + (vnoise(p * 1.7) - .5) * .3 + (alt - 62.) * .004) + smoothstep(86.3, 87.6, alt);
        snow = clamp(snow, 0., 1.);
        vec3 rock = mix(vec3(.11, .1, .1), vec3(.27, .24, .22), vnoise(p * 3.1 + alt * .4));
        rock *= .8 + .4 * smoothstep(.4, .6, vnoise(vec2(p.x * .3, alt * 2.2)));       // strata
        float yb = smoothstep(80.6, 81.6, alt) * smoothstep(85.4, 84.2, alt) * smoothstep(30., 12., length(p));
        rock = mix(rock, vec3(.5, .42, .3), yb * .75);
        vec3 snowC = vec3(.93, .95, 1.);
        float glac = smoothstep(70., 66., alt) * smoothstep(.86, .95, N.y);
        snowC = mix(snowC, vec3(.76, .88, 1.), glac * .5);
        vec3 alb = mix(rock, snowC, snow);
        float near = smoothstep(9., .6, dist) * snow;
        // spindrift flutes: runnels the falling snow carves down every steep face, lit and shaded in turn
        vec2 fall = normalize(N.xz + 1e-4), acr = vec2(-fall.y, fall.x);
        float steep = smoothstep(.95, .75, N.y) * snow * smoothstep(80., 15., dist);
        float fl = sin(dot(p, acr) * 26. + vnoise(p * vec2(4., 4.)) * 5. + vnoise(p * 11.) * 2.);
        N = normalize(N + vec3(acr.x, 0., acr.y) * fl * .28 * steep);
        float rip = sin(dot(p, vec2(1., .25)) * 170. + vnoise(p * 28.) * 7.) + .5 * sin(dot(p, vec2(.8, -.5)) * 310. + vnoise(p * 60.) * 5.);
        N = normalize(N + vec3(rip * .09, 0., rip * .03) * near);
        // the climbers' track along the ridge beside the rope: a trench of crampon prints, a fine dark line from afar
        float rd = 9.;
        for (int i = 0; i < 2; i++){ vec2 a = uRope[i], ab = uRope[i + 1] - a; float t = clamp(dot(p - a, ab) / dot(ab, ab), 0., 1.); rd = min(rd, length(p - a - ab * t)); }
        float track = smoothstep(.016, .006, abs(rd - .02)) * (.55 + .45 * step(.5, fract(dot(p, vec2(.3, .95)) * 90.)));
        alb *= 1. - track * .4 * snow;
        // the sun's shadows: march the field toward the sun
        float sh = 1.;
        vec3 sp = vW + N * .4;
        for (int i = 1; i <= ${n===0?10:18}; i++){
          float s = float(i) * float(i) * .28;
          vec3 qq = sp + uSun * s;
          vec2 uv = (qq.xz - uHRect.xy) / (uHRect.zw - uHRect.xy);
          if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) break;
          float h = texture2D(uH, uv).r;
          sh = min(sh, clamp((qq.y - h) / (s * .1 + .3), 0., 1.));
        }
        float dif = max(dot(N, uSun), 0.) * sh;
        vec3 col = alb * (uSunCol * dif * mix(1., 1.25, uGold) + uSky * (.28 + .5 * N.y) * .6);
        col = mix(col, col * vec3(.66, .8, 1.1), (1. - dif) * snow * .45);                 // snow in shade goes blue
        vec2 gc = floor(p * 400.);
        col += uSunCol * step(.992, h21(gc)) * pow(max(dot(reflect(normalize(vW - cameraPosition), normalize(N + vec3(h22(gc) - .5, 0.).xzy * .6)), uSun), 0.), 20.) * near * 1.5;
        col = mix(col, col * vec3(1.2, .95, .8), uGold * dif);                          // the first gold light
        float hz = 1. - exp(-dist / mix(150., 600., smoothstep(55., 88., cameraPosition.y)));
        col = mix(col, uHaze, hz);                                                       // (the same haze as the sky's horizon: no seam)
        gl_FragColor = vec4(col, 1.);
      }`}),ee=new I(P.geometry,me(!0)),te=new I(G.geometry,me(!1));ee.frustumCulled=te.frustumCulled=!1,e.add(ee,te);const fe=new I(new Ae(Oe,200,.011,4,!1),new nt({color:new b("#c63a2e")}));e.add(fe);const qe=new Y(A.flatMap((t,l)=>{const h=[new f(t[0],t[1],t[2])];if(l<A.length-1){const x=A[l+1];for(const p of[.33,.66]){const w=z(t[0],x[0],p),M=z(t[2],x[2],p);h.push(new f(w,W(w,M),M))}}return h}).map(t=>new f(t.x,Math.max(t.y,W(t.x,t.z))+.1,t.z)),!1,"centripetal"),oe=new O({transparent:!0,depthWrite:!1,blending:Fe,blendSrc:q,blendDst:q,blendSrcAlpha:De,blendDstAlpha:q,uniforms:{uDone:{value:0},uTime:o.uTime,uShow:{value:1}},vertexShader:"varying float vU, vNear; void main(){ vU = uv.x; vec4 mv = modelViewMatrix * vec4(position, 1.); vNear = smoothstep(1.5, 5., -mv.z); gl_Position = projectionMatrix * mv; }",fragmentShader:`
      uniform float uDone, uTime, uShow; varying float vU, vNear;
      void main(){
        float done = smoothstep(uDone + .004, uDone - .004, vU);
        float head = exp(-pow((vU - uDone) * 90., 2.));
        float dash = step(.45, fract(vU * 160. - uTime * .3));
        vec3 c = vec3(1., .78, .52) * (done * .9 + head * 2.) + vec3(.7, .85, 1.) * (1. - done) * dash * .22;
        gl_FragColor = vec4(c * vNear * uShow, 0.);
      }`}),de=new I(new Ae(qe,400,.07,5,!1),oe);e.add(de);const _=new st(new Te().setFromPoints(A.slice(0,5).map(t=>new f(t[0],W(t[0],t[2])+.25,t[2]))),new O({transparent:!0,depthWrite:!1,blending:Fe,blendSrc:q,blendDst:q,blendSrcAlpha:De,blendDstAlpha:q,uniforms:{uPx:{value:1},uPassed:{value:0}},vertexShader:"uniform float uPx; varying float vI; void main(){ vI = float(gl_VertexID); vec4 mv = modelViewMatrix * vec4(position, 1.); gl_PointSize = uPx * 22.; gl_Position = projectionMatrix * mv; }",fragmentShader:"uniform float uPassed; varying float vI; void main(){ vec2 q = gl_PointCoord - .5; float r = length(q); float ring = smoothstep(.05, .0, abs(r - .32)) + smoothstep(.16, .0, r) * .8; float on = step(vI, uPassed + .5); gl_FragColor = vec4(mix(vec3(.6, .8, 1.) * .5, vec3(1., .8, .55) * 1.4, on) * ring, 0.); }"}));_.frustumCulled=!1,e.add(_);const k=dt(31),pe=n===0?46:90,F=new it(new rt(1,1,1,2,3,2),new O({uniforms:o,vertexShader:`
      varying vec3 vW, vN, vL;
      float hs(vec3 p){ return fract(sin(dot(p, vec3(12.9, 78.2, 37.7))) * 43758.5); }
      void main(){
        vec3 p = position;
        p += (vec3(hs(p + instanceMatrix[3].xyz), hs(p * 1.7 + instanceMatrix[3].xyz), hs(p * 2.3 + instanceMatrix[3].xyz)) - .5) * .22;
        vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.);
        vW = w.xyz; vL = p; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${re}
      uniform vec3 uSun, uSunCol, uSky, uHaze; uniform float uDeep;
      varying vec3 vW, vN, vL;
      void main(){
        vec3 N = normalize(vN), V = normalize(vW - cameraPosition);
        float snow = smoothstep(.6, .85, N.y);
        float f = pow(1. - abs(dot(-V, N)), 2.);
        vec3 ice = mix(vec3(.12, .38, .62), vec3(.6, .85, 1.), .35 + .4 * vnoise(vL.xy * 4. + vL.z * 3.)) + f * .2;
        vec3 alb = mix(ice, vec3(.93, .95, 1.), snow);
        float dif = max(dot(N, uSun), 0.);
        vec3 col = alb * (uSunCol * dif * .9 + uSky * (.4 + .4 * N.y) * .55);
        col = mix(col, uHaze, 1. - exp(-length(vW - cameraPosition) / 160.));
        gl_FragColor = vec4(col, 1.);
      }`}),pe),he=new lt,we=new ut,ye=new ct,ge=new f,xe=new f;for(let t=0;t<pe;t++){const l=k(),h=A[0],x=A[1],p=z(h[0]+4,x[0],l)+(k()-.5)*6,w=z(h[2]-1.5,x[2],l)+(k()-.5)*5,M=.14+k()*k()*.34;ge.set(.12+k()*.3,M,.1+k()*.26),ye.set((k()-.5)*.5,k()*Math.PI,(k()-.5)*.5),we.setFromEuler(ye),xe.set(p,W(p,w)+M*.38,w),he.compose(xe,we,ge),F.setMatrixAt(t,he)}F.instanceMatrix.needsUpdate=!0,F.frustumCulled=!1,e.add(F);const Se=new O({transparent:!0,depthWrite:!1,side:vt,uniforms:{...o,uO:{value:R.clone().add(new f(0,-.15,0))},uA:{value:new f(.85,-.05,-.52).normalize()},uL:{value:26},uW:{value:3.2}},vertexShader:`
      uniform vec3 uO, uA; uniform float uL, uW; varying vec2 vUv;
      void main(){
        float s = position.x + .5, t = position.y * 2.;
        vec3 c = uO + uA * s * uL + vec3(0., -s * s * uL * .05, 0.);
        vec3 side = normalize(cross(uA, normalize(cameraPosition - c)));
        vUv = vec2(s, position.y + .5);
        gl_Position = projectionMatrix * viewMatrix * vec4(c + side * t * uW * (.06 + s * .9), 1.);
      }`,fragmentShader:`
      ${re}
      uniform vec3 uSunCol, uSky; uniform float uTime, uGold; varying vec2 vUv;
      void main(){
        float x = vUv.x, y = vUv.y - .5;
        float body = exp(-y * y * 9.) * smoothstep(.5, .28, abs(y)) * smoothstep(0., .1, x) * smoothstep(1., .3, x);
        float streak = fbm3(vec2(x * 7. - uTime * .45, y * 6.)) * .8 + fbm3(vec2(x * 18. - uTime * 1.1, y * 15.)) * .4;
        float a = clamp(body * (streak * 1.5 - .3), 0., 1.) * .55;
        vec3 c = mix(uSky * .75, uSunCol * .55 * mix(vec3(1.), vec3(1.15, .9, .78), uGold), .55 + .45 * smoothstep(-.3, .3, -y));
        gl_FragColor = vec4(c, a);
      }`}),ae=new I(new mt(1,1,32,4),Se);ae.frustumCulled=!1,e.add(ae);const B=bt(n,n?3:2);e.add(B.mesh);const D=B.uniforms;D.uFlake.value.set("#ffffff"),D.uFogCol.value.set("#dfe9f5"),D.uWind.value.set(1,-.08);let Me=!1;function be(){Me=a.viewport.portrait,s.aspect=a.viewport.aspect,s.fov=Me?64:40,s.updateProjectionMatrix(),_.material.uniforms.uPx.value=a.viewport.dpr}be();const ze=[[-84,60.5,58,-6,76,10],[-60,66,45,-2,80,8],[-35,70.5,39,0,83,5],[-15,78,33,1,86.5,3],[-3,83,22,.5,88,1.5],[4.6,88.95,7.6,-.2,87.4,-.3]],Re=new Y(ze.map(t=>new f(t[0],t[1],t[2])),!1,"centripetal"),Ee=new Y(ze.map(t=>new f(t[3],t[4],t[5])),!1,"centripetal"),Ge=t=>{for(let l=0;l<S.length-1;l++)if(t<=S[l+1])return(l+(t-S[l])/(S[l+1]-S[l]))/(S.length-1);return 1},L=new f,Ce=new f,Ve=new b("#8fb3e6"),Ie=new b("#5d7fc2"),je=new b("#b8cde6"),Ze=new b("#8fa4cc"),Be=new b("#fff1dc"),$e=new b("#ffd2a0");let g=0,Ne=!0,ne=-1;return{scene:e,camera:s,resize:be,update({p:t,t:l,dt:h}){const x=Mt(t);let p=0;for(;p<S.length-2&&x>S[p+1];)p++;const w=S[p],M=S[p+1],$=(x-w)/(M-w),V=w+(M-w)*j.inOut(Z(.15,.85,$));g=Ne||St?V:pt(g,V,3.2,h),Ne=!1;const Pe=Ge(g);Re.getPoint(Pe,L),Ee.getPoint(Pe,Ce),L.y=Math.max(L.y,W(L.x,L.z)+.6);const ke=yt(a,l,h);gt(s,L,Ce,ke.x*.6,ke.y*.6);const H=j.inOut(Z(.55,1,g));o.uDeep.value=H,o.uTime.value=l,o.uGold.value=j.inOut(Z(.8,1,g)),o.uSky.value.copy(Ve).lerp(Ie,H),o.uHaze.value.copy(je).lerp(Ze,H),o.uSun.value.set(.36,z(.42,.2,H),.83).normalize(),o.uSunCol.value.copy(Be).lerp($e,o.uGold.value).multiplyScalar(2.3),oe.uniforms.uDone.value=g,oe.uniforms.uShow.value=1-j.inOut(Z(.84,.95,g));let se=0;for(let K=0;K<S.length;K++)g>=S[K]-.004&&(se=K);_.material.uniforms.uPassed.value=se,D.uAmt.value=z(.03,.22,H),D.uSpeed.value=z(.6,1.8,H),D.uLen.value=1.2,D.uFog.value=z(0,.14,j.in(Z(.85,1,g))),D.uNear.value=z(.2,1,H),B.step(l,h,a.viewport.aspect);const ie=g>.999?He[He.length-1].alt:Math.round(xt(g));ie!==ne&&(ne=ie,a.emit("ice-alt",{m:ie,camp:se,u:g}))},focus(t){t&&(ne=-1)},dispose(){i.dispose(),[ee,te,fe,de].forEach(t=>{t.geometry.dispose(),t.material.dispose()}),T.dispose(),_.geometry.dispose(),_.material.dispose(),F.geometry.dispose(),F.material.dispose(),F.dispose(),ae.geometry.dispose(),Se.dispose(),B.dispose()}}};export{Wt as default};
