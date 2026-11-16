import{S as Pt,J as Ut,b as _e,$ as Se,v as Ie,M as me,a as Rt,a3 as We,G as xt,m as Vt,e as Et,E as zt,a4 as gt,B as Pe,a5 as yt,a6 as wt,P as Ot,k as M,a7 as bt,V as I,W as Yt,u as Mt,Q as Ft,s as At,n as Gt,p as Ue,r as ve}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ee=[215,219,220].map(c=>Math.pow(Math.min(1,c*1.027/255),2.2)),m=4,Ht=.8,Bt=3,St=[.7,.9],te=1.8,Wt=c=>.5-.5*Math.cos(Math.PI*c),Re=2e3;function It(){const c=new Yt(64,64,{minFilter:Mt,magFilter:Mt,depthBuffer:!1}),R=new _e({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
      uniform float uT; varying vec2 vUv;
      float h(vec3 p){ p = fract(p * vec3(.1031, .1103, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
      float vn(vec3 p){
        vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(h(i), h(i + vec3(1, 0, 0)), f.x), mix(h(i + vec3(0, 1, 0)), h(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(h(i + vec3(0, 0, 1)), h(i + vec3(1, 0, 1)), f.x), mix(h(i + vec3(0, 1, 1)), h(i + vec3(1, 1, 1)), f.x), f.y), f.z);
      }
      float fb(vec3 p){ return vn(p) * .6 + vn(p * 2.03 + 7.1) * .3 + vn(p * 4.1 + 3.7) * .1; }
      void main(){
        vec3 p = vec3(vUv * vec2(.9, 1.7), uT * .1);
        vec3 w = vec3(fb(p * .5), fb(p * .5 + 11.3), fb(p * .5 + 23.9)) - .5;
        p += w * .7 * 2.;
        gl_FragColor = vec4(fb(p), fb(p + vec3(5.2, 1.3, 2.8)), fb(p + vec3(9.7, 4.4, 6.1)), 1.);
      }`}),w=new Pt,fe=new Ut(-1,1,1,-1,0,1),_=new me(new Rt(2,2),R);return _.frustumCulled=!1,w.add(_),{texture:c.texture,draw(d,oe){R.uniforms.uT.value=oe;const ae=d.getRenderTarget();d.setRenderTarget(c),d.render(w,fe),d.setRenderTarget(ae)},dispose(){c.dispose(),R.dispose(),_.geometry.dispose()}}}const Xt=c=>{const R=new Pt,w=new Ut(-m,m,m,-m,.1,100);w.position.set(0,0,20),w.lookAt(0,0,0);const fe=c.lang==="ar",_=fe?-1:1,d=new _e({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new Ie(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new Se},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${Bt.toFixed(1)} - a.z) / (b.z - a.z);
          gone = step(tz, 0.);
          px = mix(a.xy, b.xy, tz) * uWpx;
        }
        vec2 g = px / cell + vec2(0., uLine);
        vec2 d = abs(fract(g + .5) - .5) * cell;
        float line = 1. - smoothstep(.35 * uDpr, .85 * uDpr, min(d.x, d.y));
        vec2 c = px + vec2(0., uCross * L);
        vec2 q = mod(c + cell * 4., cell * 8.) - cell * 4.;
        float arm = 5.5 * uDpr, wd = .55 * uDpr;
        float plus = max(step(abs(q.x), wd) * step(abs(q.y), arm), step(abs(q.y), wd) * step(abs(q.x), arm));
        vec3 col = vec3(${ee.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * (1. - smoothstep(.3, 1.5, r * 1.25)), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),oe=new me(new Rt(2,2),d);oe.frustumCulled=!1,oe.renderOrder=-10,R.add(oe);let ae=1e9,Te=-1e9,Ce=1e9,De=-1e9;for(const e of We)for(const[s,t]of e)ae=Math.min(ae,s),Te=Math.max(Te,s),Ce=Math.min(Ce,t),De=Math.max(De,t);const je=(ae+Te)/2,ke=(Ce+De)/2;let S=null;const _t=fe?[We[We.length-1]]:[We[0]];for(const e of _t){let s=0;e.forEach(([t,r],i)=>{const[n,f]=e[(i+1)%e.length];s+=t*f-n*r}),e.forEach((t,r)=>{const i=e[(r+1)%e.length],n=i[0]-t[0],f=i[1]-t[1],l=Math.hypot(n,f),a=s>0?[f/l,-n/l]:[-f/l,n/l],o=l*a[0]*_*-1;(!S||o>S.score)&&(S={a:t,b:i,n:a,score:o})})}function Tt(){const e=S.a[0]-je,s=S.a[1]-ke,t=S.b[0]-S.a[0],r=S.b[1]-S.a[1],i=t*t+r*r;return(n,f)=>{const l=Math.min(1,Math.max(0,((n-e)*t+(f-s)*r)/i));return Math.hypot(n-e-l*t,f-s-l*r)<.001}}const W=new xt;R.add(W);const j=new xt;W.add(j);const k=Vt(Ht,!1,0,"now"),qe=new me(k,new Et({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));qe.renderOrder=0,j.add(qe);const F=new zt(k,20).getAttribute("position").array,ne=F.length/6,Ne=new Float32Array(ne*12),$e=new Float32Array(ne*12),Xe=new Float32Array(ne*8),Qe=new Float32Array(ne*4),Je=[],Ke=Tt();for(let e=0;e<ne;e++){const s=Ke(F[e*6],F[e*6+1])&&Ke(F[e*6+3],F[e*6+4])?1:0;for(let r=0;r<4;r++)Ne.set(F.subarray(e*6,e*6+3),(e*4+r)*3),$e.set(F.subarray(e*6+3,e*6+6),(e*4+r)*3),Xe.set([r<2?0:1,r%2?1:-1],(e*4+r)*2),Qe[e*4+r]=s;const t=e*4;Je.push(t,t+1,t+3,t,t+3,t+2)}const Y=new gt;Y.setAttribute("position",new Pe(Ne,3)),Y.setAttribute("aB",new Pe($e,3)),Y.setAttribute("aS",new Pe(Xe,2)),Y.setAttribute("aF",new Pe(Qe,1)),Y.setIndex(Je);const N=new _e({side:yt,transparent:!0,uniforms:{uRes:{value:new Ie(1,1)},uW:{value:1.5},uA:{value:1},uF:{value:0}},vertexShader:`
      attribute vec3 aB; attribute vec2 aS; attribute float aF; uniform vec2 uRes; uniform float uW, uF; varying float vE, vF;
      void main(){
        vF = 1. - aF * uF;
        vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.), b = projectionMatrix * modelViewMatrix * vec4(aB, 1.);
        vec2 d = (b.xy - a.xy) * uRes; float L = max(length(d), 1e-4); d /= L;
        vec4 p = aS.x < .5 ? a : b;
        vec2 n = vec2(-d.y, d.x) * aS.y * (uW * 3. + 1.) * .5 / uRes;
        p.xy += (n + (aS.x < .5 ? -d : d) * uW * .5 / uRes) * p.w;
        vE = aS.y;
        gl_Position = p;
      }`,fragmentShader:"uniform float uW, uA; varying float vE, vF; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA * vF); }"}),se=new me(Y,N);se.frustumCulled=!1,se.renderOrder=2,j.add(se),k.computeBoundingBox();const p=S,de=k.boundingBox.max.z,he=k.boundingBox.min.z,Ze=.004,$=e=>e[0]-je+p.n[0]*Ze,X=e=>e[1]-ke+p.n[1]*Ze,G=new gt;G.setAttribute("position",new wt([$(p.a),X(p.a),de,$(p.b),X(p.b),de,$(p.b),X(p.b),he,$(p.a),X(p.a),he],3)),G.setAttribute("uv",new wt([0,0,0,1,1,1,1,0],2)),G.setIndex([0,1,2,0,2,3]);const Le=It(),g=new _e({transparent:!0,depthWrite:!1,side:yt,uniforms:{tN:{value:Le.texture},uDpr:{value:1},uFlip:{value:_>0?1:0},uFlipY:{value:p.a[1]>p.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0},uMix:{value:1},uScr:{value:new Ie(1,1)},uCa:{value:.0025},uCool:{value:1},uMb:{value:.4},uLine:{value:0}},vertexShader:`
      uniform float uSwing, uAsp, uFlip, uFlipY; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);

        gl_Position = p;
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uA, uT, uDpr, uSwing, uMix, uCa, uMb, uLine, uCool; uniform vec2 uScr; varying vec2 vUv;
      float hs(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }


      float lineT(float d, float m, float p, float a, float e, float w, float h){
        float v = mix(p, p * .8, smoothstep(a - .5, a + .5, d));
        v = mix(v, h, smoothstep(a + e - .5, a + e + .5, d));
        return mix(v, m, smoothstep(a + e + w - .5, a + e + w + .5, d));
      }
      void main(){
        vec2 uv = vec2(vUv.x, vUv.y);
        vec4 n1 = texture2D(tN, uv);
        float j = hs(floor(gl_FragCoord.xy / uDpr) + floor(uT * 24.));
        vec4 n = texture2D(tN, uv + (n1.rg - .5) * (.06 + 1.1 * j));
        float t = clamp((n.r * .65 + n.b * .35 - .5) * 3.4 + .66, 0., 1.);




        vec3 blk = vec3(.012, .006, .008), deep = vec3(.34, .0, .03), crim = vec3(.86, .05, .15), red = vec3(1., .06, .1);
        float lo = uMix < .5 ? .52 : uMix < 1.5 ? .3 : .02, hi = uMix < .5 ? 1.08 : uMix < 1.5 ? .86 : .56;


        float hc = hs(floor(gl_FragCoord.xy / (2. * uDpr)) + 5.);
        float tj = t + (hc - .5) * .12;
        float q = smoothstep(lo, hi, tj); q = mix(q, smoothstep(.3, .7, q), .75);
        vec3 col = q < .4 ? mix(blk, deep, q / .4) : q < .75 ? mix(deep, crim, (q - .4) / .35) : mix(crim, red, (q - .75) / .25);
        col = mix(col, red, smoothstep(.57, .76, n.g + (.35 - vUv.y) * .3) * (uMix < .5 ? .45 : .85));
        col *= (.72 + .5 * n.g) * (.86 + .28 * hs(floor(gl_FragCoord.xy / uDpr) + 17.));

        vec2 su = gl_FragCoord.xy / uScr, sd = (su - .5) * uScr;



        vec2 uX = dFdx(vUv), uY = dFdy(vUv), pu = vec2(length(vec2(uX.x, uY.x)), length(vec2(uX.y, uY.y))) + 1e-6;
        vec2 sB = sd * uCa, oB = vUv + uX * sB.x + uY * sB.y, oR = vUv - uX * sB.x - uY * sB.y;
        vec2 dB = min(oB, 1. - oB) / pu, dR = min(oR, 1. - oR) / pu;
        float kE = smoothstep(uMb + .5, uMb + 2., min(min(dB.x, dB.y), min(dR.x, dR.y)));


        float hf = n.g * .55 + n.r * .45 + (hc - .5) * .05;





        float hot = smoothstep(.53, .615, hf) * kE, hg = hs(floor(gl_FragCoord.xy / (1.5 * uDpr)) + 29.);
        col = mix(col, vec3(1.), max(step(hg, hot), smoothstep(.6, .64, hf) * kE) * .96);
        col += vec3(.3, .26, .95) * (smoothstep(.52, .535, hf) - smoothstep(.538, .548, hf)) * .5 * step(hg, .7) * kE;
        col *= 1. - .9 * smoothstep(.62, .66, n.b * .7 + (1. - n.g) * .3 + (hc - .5) * .05);
        col = min(col, vec3(1.));





        col = pow(max(col, vec3(0.)), vec3(2.2));





        float vg = .82 + .18 * (1. - smoothstep(.3, 1.5, length(su - .5) * 1.25));
        col.b = mix(col.b, ${ee[2].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dB.x, dB.y))));
        col.r = mix(col.r, ${ee[0].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dR.x, dR.y))));








        float lW = max(2., 5.5 * uScr.x / 2000.), lE = max(1., uScr.x / 2000.);
        float dU = min(vUv.x, 1. - vUv.x) / pu.x;
        float dUB = min(oB.x, 1. - oB.x) / pu.x, dUR = min(oR.x, 1. - oR.x) / pu.x;
        float lA = abs(dUB - dU);
        vec3 lP = vec3(${ee[0].toFixed(5)}, ${ee[1].toFixed(5)}, ${ee[2].toFixed(5)}) * vg;


        float eV = mix(1., 1. - smoothstep(.35, 1.25, length((su - .5) * vec2(uScr.x / uScr.y, 1.))), .55);
        float pY = dot(lP, vec3(.2126, .7152, .0722)) * eV;
        pY = pY > .76 ? 1. - .0576 / (pY - .52) : pY;
        float wS = min(1.055 * pow(max(pY, 1e-4), 1. / 2.4) - .055 + 22. / 255., .985);
        float wY = pow((wS + .055) / 1.055, 2.4);
        float lH = (wY > .76 ? .52 + .0576 / (1. - wY) : wY) / eV;



        float sL = length(sB), eA = 2. * sL + 1., eB = 2. * sL + 3.;
        float wG = smoothstep(eA, eB, min(vUv.y, 1. - vUv.y) / pu.y) * uLine;
        float wR = smoothstep(eA, eB, min(oR.y, 1. - oR.y) / pu.y) * uLine, wB = smoothstep(eA, eB, min(oB.y, 1. - oB.y) / pu.y) * uLine;
        vec3 tO = mix(col, vec3(lineT(dU, col.r, lP.r, lA, lE, lW, lH), lineT(dU, col.g, lP.g, lA, lE, lW, lH), lineT(dU, col.b, lP.b, lA, lE, lW + .8, lH)), wG);
        float cR = mix(col.r, lineT(dUR, col.r, lP.r, lA, lE, lW, lH), wR), cB = mix(col.b, lineT(dUB, col.b, lP.b, lA, lE, lW + .8, lH), wB);






        float kC = (1. - smoothstep(lA + lE + lW - 1.5, lA + lE + lW - .5, dU)) * step(.999, min(wG, min(wR, wB)));
        float cG = tO.g - min(0., min(tO.r - cR, tO.b - cB)) * uCool * kC;
        col = vec3(cR, cG, cB);
        gl_FragColor = vec4(col, uA);
      }`}),L=new me(G,g);L.renderOrder=1,L.frustumCulled=!1,j.add(L);let xe=!1,ge=m,re=1,ye=0,Ve=1,Ee=0,ze=0;function et(){const e=c.viewport;xe=e.portrait,ge=m*e.aspect,w.left=-ge,w.right=ge,w.top=m,w.bottom=-m,w.updateProjectionMatrix(),d.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),d.uniforms.uDpr.value=e.dpr,N.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),N.uniforms.uW.value=2.3*e.dpr,g.uniforms.uAsp.value=e.aspect,g.uniforms.uDpr.value=e.dpr,g.uniforms.uScr.value.set(e.width*e.dpr,e.height*e.dpr);const s=2*m/e.height;xe?(re=.8*e.width*s/3.87,ye=.35,Ve=.62*2*m/2,Ee=.05,ze=_*.26):(re=.6*2*m/2*.82,ye=-.1,Ve=re,Ee=-.1,ze=0)}et();const y=new Ot(10,1,.005,600),tt=new M,ot=new M,Oe=new M,Q=new M,we=new M,at=new M;new Se;const nt=new M,st=new bt,rt=new Se,Ct=new M(($(p.a)+$(p.b))/2,(X(p.a)+X(p.b))/2,(de+he)/2),Ye=new M(p.b[0]-p.a[0],p.b[1]-p.a[1],0),it=Ye.length()/2;Ye.normalize();const lt=(de-he)/2;function Dt(e){if(e<=0){ce.camera=w,d.uniforms.uDive.value=0;return}W.updateMatrixWorld(!0);const s=j.matrixWorld,t=W.scale.x;ot.copy(Ct).applyMatrix4(s),st.getNormalMatrix(s),Oe.set(p.n[0],p.n[1],0).applyMatrix3(st).normalize(),Q.copy(Ye).transformDirection(s),Q.y<0&&Q.negate();const r=c.viewport.aspect,i=e,n=Math.tan(25*Math.PI/180),f=Math.min(.7*lt*t/r,.7*it*t),l=Math.exp(Math.log(m)+(Math.log(f)-Math.log(m))*Math.pow(i,1.45)),a=Math.tan(Math.atan(m/Re))+(n-m/Re)*Math.pow(i,.6),o=l/a,u=Ue.inOut(Math.min(1,i/.6)),v=.45*u+.55*Wt(ve(.7,1,i));we.set(0,0,0).lerp(ot,u),tt.crossVectors(Q,Oe).normalize(),we.addScaledVector(tt,-_*.29*lt*t*u).addScaledVector(Q,-.22*it*t*u),at.set(0,0,1).lerp(Oe,v).normalize(),y.fov=2*Math.atan(a)*180/Math.PI,y.aspect=r,y.position.copy(we).addScaledVector(at,o),nt.set(0,1,0).lerp(Q,u).normalize(),y.up.copy(nt),y.lookAt(we),y.near=Math.max(.002,o*.02),y.far=o+60,y.updateProjectionMatrix(),y.updateMatrixWorld(!0),ce.camera=y,rt.multiplyMatrices(y.projectionMatrix,y.matrixWorldInverse),d.uniforms.uInvVP.value.copy(rt).invert();const b=c.viewport.height*c.viewport.dpr;d.uniforms.uWpx.value=Re/(Re+Bt)*b/(2*m),d.uniforms.uDive.value=1}const ie=new M,ut=[];for(let e=0;e<5;e++)for(let s=0;s<9;s++)ut.push([e/4,s/8]);function qt(){R.updateMatrixWorld(!0);const e=ce.camera;e.updateMatrixWorld();const s=c.viewport.width,t=c.viewport.height,r=(l,a,o,u)=>(ie.set(l,a,o).applyMatrix4(u).project(e),ie.z<1&&ie.z>-1?[+((ie.x+1)/2*s).toFixed(2),+((1-ie.y)/2*t).toFixed(2)]:null),i=G.getAttribute("position").array,n=[];for(const[l,a]of ut){const o=(v,b)=>i[v*3+b],u=v=>(o(0,v)*(1-a)+o(1,v)*a)*(1-l)+(o(3,v)*(1-a)+o(2,v)*a)*l;n.push(r(u(0),u(1),u(2),L.matrixWorld))}const f=[];for(let l=0;l<F.length;l+=12)f.push(r(F[l],F[l+1],F[l+2],se.matrixWorld));globalThis.__greyProbe.face=n,globalThis.__greyProbe.lines=f}const be=new bt,Me=new Se,A=new I,T=new I,C=new I,P=new M,h={H:be,on:0,at:-1,box:[0,0,1,1],share:0},H=[new I,new I,new I,new I],le=new Float64Array(8),ue=new Float64Array(8);c.gateFace=h;function Lt(e){if(h.on=L.visible?1:0,h.at=e,!h.on)return;const s=ce.camera;R.updateMatrixWorld(!0),s.updateMatrixWorld(),Me.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse).multiply(L.matrixWorld);const t=G.getAttribute("position").array,r=a=>P.set(t[a*3],t[a*3+1],t[a*3+2]);r(0),A.set(P.x,P.y,P.z,1).applyMatrix4(Me),r(3),C.set(P.x-t[0],P.y-t[1],P.z-t[2],0).applyMatrix4(Me),r(1),T.set(P.x-t[0],P.y-t[1],P.z-t[2],0).applyMatrix4(Me),be.set(C.x,T.x,A.x,C.y,T.y,A.y,C.w,T.w,A.w),H[0].copy(A),H[1].copy(A).add(C),H[2].copy(A).add(C).add(T),H[3].copy(A).add(T);const i=1e-5;let n=0;for(let a=0;a<4;a++){const o=H[a],u=H[(a+1)%4];if(o.w>i&&(le[n]=o.x/o.w,ue[n++]=o.y/o.w),o.w>i!=u.w>i){const v=(i-o.w)/(u.w-o.w);le[n]=(o.x+(u.x-o.x)*v)/i,ue[n++]=(o.y+(u.y-o.y)*v)/i}}if(n>=3){let a=1e9,o=1e9,u=-1e9,v=-1e9,b=1e9,D=-1e9;for(let U=0;U<n;U++){const z=le[U],q=ue[U],pe=le[(U+1)%n],Z=ue[(U+1)%n];if(a=Math.min(a,z),u=Math.max(u,z),o=Math.min(o,q),v=Math.max(v,q),q<=0!=Z<=0){const O=z+(pe-z)*(0-q)/(Z-q);b=Math.min(b,O),D=Math.max(D,O)}}const E=U=>Math.min(1,Math.max(0,(U+1)/2));h.box[0]=E(a),h.box[1]=E(o),h.box[2]=E(u),h.box[3]=E(v),h.share=D>b?E(D)-E(b):h.box[2]-h.box[0]}const f=be.determinant(),l=Math.hypot(C.x,C.y,C.w)*Math.hypot(T.x,T.y,T.w)*Math.hypot(A.x,A.y,A.w);if(!(Math.abs(f)>1e-6*l)){h.on=0;return}be.invert(),globalThis.__gateProbe&&(globalThis.__gateFaceQA={share:h.share,box:[...h.box],minW:Math.min(...H.map(a=>a.w)),poly:Array.from({length:n},(a,o)=>[le[o],ue[o]])}),c.gateFace=h}const Ge=new M,ct=new Ft,pt=new Gt;let V=null,Fe=0,x=0,B=0,J=0,K=0,He=-1;const vt=new Ft,mt=matchMedia("(prefers-reduced-motion: reduce)");let ft=!1;const ce={scene:R,camera:w,light:!0,resize:et,coolSplit:1,hud:()=>({grey:x.toFixed(3)}),update({p:e,t:s,dt:t,v:r}){const i=c.split;g.uniforms.uCa.value=(i?i.ca0:.0025)+Math.min(Math.abs(r??0),4)*.006,g.uniforms.uCool.value=i?i.cool:1;const n=c.wallMark;n&&e<.05&&(V=n.p>.9?{x:n.x,y:n.y,ppu:n.ppu,q:vt.copy(n.q)}:{...n.exit,q:vt.identity()}),e>=.3&&(V=null);const f=1-Math.exp(-40*Math.min(t,.1));Fe+=(e*16/6-Fe)*f,d.uniforms.uLine.value=Fe*1.5,d.uniforms.uCross.value=Fe*.1%1;const l=c.greyVision??globalThis.__greyLines?.vision,a=typeof l=="number"?Math.min(1,Math.max(0,l)):Ue.inOut(ve(.6,.8,e)),o=He<0||Math.abs(e-He)>.15;He=e;const u=Wt(ve(St[0],St[1],e));if(o||mt.matches)x=a,J=0,B=u,K=0;else for(let Ae=Math.min(t,.1),dt=Math.ceil(Ae/.02),ht=0;ht<dt;ht++){const Be=Ae/dt;J+=(te*te*(a-x)-2*te*J)*Be,x+=J*Be,K+=(te*te*(u-B)-2*te*K)*Be,B+=K*Be}B=Math.max(B,u-Math.min(1,Math.max(0,(1-e)/.08))),x=Math.min(1,Math.max(0,x)),B=Math.min(1,Math.max(0,B)),Math.abs(a-x)<1e-4&&Math.abs(J)<1e-4&&(x=a,J=0),Math.abs(u-B)<1e-4&&Math.abs(K)<1e-4&&(B=u,K=0),globalThis.__greyProbe={vis:x,p:e,swing:B};const v=mt.matches;x>0&&(!v||!ft)&&(Le.draw(c.renderer,v?0:s),ft=!0),g.uniforms.uT.value=v?0:s;const b=globalThis.__greyMix;g.uniforms.uMix.value=b===0||b===2?b:1;const D=B;g.uniforms.uA.value=Math.max(At.smoothstep(x,0,.1),D),L.visible=x>0,N.uniforms.uF.value=L.visible?g.uniforms.uA.value:0,g.uniforms.uSwing.value=D,g.uniforms.uLine.value=At.smoothstep(D,0,.05);const E=(xe?78:30)*Math.PI/180,U=-(xe?8:5.7)*Math.PI/180;pt.set(U*x,_*E*x,0),ct.setFromEuler(pt),j.quaternion.copy(ct),N.uniforms.uA.value=1,se.visible=!0,d.uniforms.uVig.value=1;const z=Ue.inOut(ve(.3,1,x)),q=re+(Ve-re)*z,pe=ye+(Ee-ye)*z,Z=ze*z,O=V?1-Ue.inOut(ve(0,.3,e)):0;if(V&&O>0){Ge.set(V.x*ge,V.y*m,0);const Ae=V.ppu*2*m/c.viewport.height;W.position.set(Z+(Ge.x-Z)*O,pe+(Ge.y-pe)*O,0),W.scale.setScalar(q+(Ae-q)*O),W.quaternion.identity().slerp(V.q,O)}else W.position.set(Z,pe,0),W.scale.setScalar(q),W.quaternion.identity();Dt(D),Lt(s),globalThis.__greyProbeOn&&qt()},dispose(){k.dispose(),Y.dispose(),N.dispose(),G.dispose(),g.dispose(),d.dispose(),Le.dispose(),qe.material.dispose(),y.clear()}};return ce};export{Xt as default};
