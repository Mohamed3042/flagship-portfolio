import{S as ke,F as He,b as ee,T as ge,B as Le,M as B,a as Ye,G as Be,m as tt,e as at,E as ot,Z as Ee,_ as xe,$ as Ie,a0 as X,a1 as Ge,P as nt,k as m,a2 as rt,W as st,z as je,Q as Ne,p as D,r as O,s as it,n as ut}from"./EditionWorld.astro_astro_type_script_index_0_lang.C4nb-NPV.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ct=[215,219,220].map(s=>Math.pow(Math.min(1,s*1.027/255),2.2)),n=4,lt=.8,we=3,J=200;function vt(){const s=new st(64,64,{minFilter:je,magFilter:je,depthBuffer:!1}),b=new ee({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
        vec3 w = vec3(fb(p * .5), fb(p * .5 + 11.3), fb(p * .5 + 23.9)) - .5;   // the warp: scale .5, strength .7
        p += w * .7 * 2.;
        gl_FragColor = vec4(fb(p), fb(p + vec3(5.2, 1.3, 2.8)), fb(p + vec3(9.7, 4.4, 6.1)), 1.);
      }`}),l=new ke,E=new He(-1,1,1,-1,0,1),g=new B(new Ye(2,2),b);return g.frustumCulled=!1,l.add(g),{texture:s.texture,draw(r,T){b.uniforms.uT.value=T;const v=r.getRenderTarget();r.setRenderTarget(s),r.render(l,E),r.setRenderTarget(v)},dispose(){s.dispose(),b.dispose(),g.geometry.dispose()}}}const mt=s=>{const b=new ke,l=new He(-n,n,n,-n,.1,100);l.position.set(0,0,20),l.lookAt(0,0,0);const E=s.lang==="ar",g=E?-1:1,r=new ee({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new Le(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new ge},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {   // (world-52) the dive: the grid and its crosses lie on a plane behind the mark (z ${-we}); the moving camera's ray meets it (equal to the flat picture at the dive's start)
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${we.toFixed(1)} - a.z) / (b.z - a.z);
          gone = step(tz, 0.);
          px = mix(a.xy, b.xy, tz) * uWpx;
        }
        vec2 g = px / cell + vec2(0., uLine);                   // the lines: 1.5 cells per screen
        vec2 d = abs(fract(g + .5) - .5) * cell;                 // px to the nearest line
        float line = 1. - smoothstep(.35 * uDpr, .85 * uDpr, min(d.x, d.y));
        vec2 c = px + vec2(0., uCross * L);                       // the crosses: .1 of the grid per screen, wrapping
        vec2 q = mod(c + cell * 4., cell * 8.) - cell * 4.;
        float arm = 5.5 * uDpr, wd = .55 * uDpr;
        float plus = max(step(abs(q.x), wd) * step(abs(q.y), arm), step(abs(q.y), wd) * step(abs(q.x), arm));
        vec3 col = vec3(${ct.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * smoothstep(1.5, .3, r * 1.25), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),T=new B(new Ye(2,2),r);T.frustumCulled=!1,T.renderOrder=-10,b.add(T);const v=new Be;b.add(v);const A=new Be;v.add(A);const W=tt(lt,!1,0,"now"),te=new B(W,new at({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));te.renderOrder=0,A.add(te);const ae=new ot(W,20).getAttribute("position").array,I=ae.length/6,ye=new Float32Array(I*12),be=new Float32Array(I*12),Me=new Float32Array(I*8),Se=[];for(let e=0;e<I;e++){for(let t=0;t<4;t++)ye.set(ae.subarray(e*6,e*6+3),(e*4+t)*3),be.set(ae.subarray(e*6+3,e*6+6),(e*4+t)*3),Me.set([t<2?0:1,t%2?1:-1],(e*4+t)*2);const o=e*4;Se.push(o,o+1,o+3,o,o+3,o+2)}const F=new Ee;F.setAttribute("position",new xe(ye,3)),F.setAttribute("aB",new xe(be,3)),F.setAttribute("aS",new xe(Me,2)),F.setIndex(Se);const U=new ee({side:Ie,transparent:!0,uniforms:{uRes:{value:new Le(1,1)},uW:{value:1.5},uA:{value:1}},vertexShader:`
      attribute vec3 aB; attribute vec2 aS; uniform vec2 uRes; uniform float uW; varying float vE;
      void main(){
        vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.), b = projectionMatrix * modelViewMatrix * vec4(aB, 1.);
        vec2 d = (b.xy - a.xy) * uRes; float L = max(length(d), 1e-4); d /= L;
        vec4 p = aS.x < .5 ? a : b;
        vec2 n = vec2(-d.y, d.x) * aS.y * (uW * 3. + 1.) * .5 / uRes;  // the core, a soft glow out to three times it (his bloom on white)
        p.xy += (n + (aS.x < .5 ? -d : d) * uW * .5 / uRes) * p.w;
        vE = aS.y;
        gl_Position = p;
      }`,fragmentShader:"uniform float uW, uA; varying float vE; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA); }"}),G=new B(F,U);G.frustumCulled=!1,G.renderOrder=2,A.add(G);let oe=1e9,ne=-1e9,re=1e9,se=-1e9;for(const e of X)for(const[o,t]of e)oe=Math.min(oe,o),ne=Math.max(ne,o),re=Math.min(re,t),se=Math.max(se,t);const Qe=(oe+ne)/2,$e=(re+se)/2;let j=null;const Ze=E?[X[X.length-1]]:[X[0]];for(const e of Ze){let o=0;e.forEach(([t,i],c)=>{const[h,d]=e[(c+1)%e.length];o+=t*d-h*i}),e.forEach((t,i)=>{const c=e[(i+1)%e.length],h=c[0]-t[0],d=c[1]-t[1],f=Math.hypot(h,d),x=o>0?[d/f,-h/f]:[-d/f,h/f],y=f*x[0]*g*-1;(!j||y>j.score)&&(j={a:t,b:c,n:x,score:y})})}W.computeBoundingBox();const a=j,N=W.boundingBox.max.z,k=W.boundingBox.min.z,De=.004,z=e=>e[0]-Qe+a.n[0]*De,P=e=>e[1]-$e+a.n[1]*De,V=new Ee;V.setAttribute("position",new Ge([z(a.a),P(a.a),N,z(a.b),P(a.b),N,z(a.b),P(a.b),k,z(a.a),P(a.a),k],3)),V.setAttribute("uv",new Ge([0,0,0,1,1,1,1,0],2)),V.setIndex([0,1,2,0,2,3]);const ie=vt(),M=new ee({transparent:!0,depthWrite:!1,side:Ie,uniforms:{tN:{value:ie.texture},uDpr:{value:1},uFlip:{value:g>0?1:0},uFlipY:{value:a.a[1]>a.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0}},vertexShader:`
      uniform float uSwing, uAsp, uFlip, uFlipY; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        // the swing out (alche's vision → service): the face's corners go to the screen's corners
        gl_Position = p;   // (world-52) the band stays where it stands; the camera dives into it (no flat plate flying at the viewer)
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uA, uT, uDpr, uSwing; varying vec2 vUv;
      float hs(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      void main(){
        vec2 uv = vec2(vUv.x, vUv.y);
        vec4 n1 = texture2D(tN, uv);
        float j = hs(floor(gl_FragCoord.xy / uDpr) + floor(uT * 24.));   // grain in CSS px
        vec4 n = texture2D(tN, uv + (n1.rg - .5) * (.06 + 1.1 * j));                  // the grain: a jittered second read
        float t = clamp((n.r * .65 + n.b * .35 - .5) * 3.4 + .66, 0., 1.);   // fbm sits near .5: stretched to use the whole ramp
        vec3 navy = vec3(.06, .09, .32), blue = vec3(.2, .3, .9), cyan = vec3(.22, .78, 1.), acid = vec3(.42, .95, .18);
        vec3 col = t < .35 ? mix(navy, blue, t / .35) : t < .7 ? mix(blue, cyan, (t - .35) / .35) : mix(cyan, acid, (t - .7) / .3);
        col = mix(col, acid, smoothstep(.57, .76, n.g + (.35 - vUv.y) * .3) * .85);   // greener toward the foot, as his f00500                           // green fronts of their own
        col *= (.72 + .5 * n.g) * (.86 + .28 * hs(floor(gl_FragCoord.xy / uDpr) + 17.));   // + a per-pixel grain                                                          // × (.5 + noise) in alche's read; lighter here
        // world-47c: from the moment it swings out the band is alche's glass before the picture eats it: its OWN noise in
        // grey, bright, with bright grain (no forms and no colour of ours); white and grey by the time it covers a quarter of
        // the screen, at any scroll speed. The next scene comes into it through the lens in the sand seam (passage-sand.ts)
        // (world-52) the band keeps its colour while we dive into it, as alche's (f00520-f00580): the picture of the next
        // scene eats it in the sand seam (passage-sand.ts), grain by grain, once we are inside
        col = pow(col, vec3(2.2));
        gl_FragColor = vec4(col, uA);
      }`}),H=new B(V,M);H.renderOrder=1,H.frustumCulled=!1,A.add(H);let Y=!1,Q=n,C=1,$=0,ue=1,ce=0,le=0;function Ae(){const e=s.viewport;Y=e.portrait,Q=n*e.aspect,l.left=-Q,l.right=Q,l.top=n,l.bottom=-n,l.updateProjectionMatrix(),r.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),r.uniforms.uDpr.value=e.dpr,U.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),U.uniforms.uW.value=2.3*e.dpr,M.uniforms.uAsp.value=e.aspect,M.uniforms.uDpr.value=e.dpr;const o=2*n/e.height;Y?(C=.8*e.width*o/3.87,$=.35,ue=.62*2*n/2,ce=.05,le=g*.26):(C=.6*2*n/2*.82,$=-.1,ue=C,ce=-.1,le=0)}Ae();const u=new nt(10,1,.005,600),We=new m,Fe=new m,ve=new m,q=new m,Z=new m,ze=new m;new ge;const Pe=new m,qe=new rt,Oe=new ge,Ke=new m((z(a.a)+z(a.b))/2,(P(a.a)+P(a.b))/2,(N+k)/2),pe=new m(a.b[0]-a.a[0],a.b[1]-a.a[1],0),Te=pe.length()/2;pe.normalize();const Ue=(N-k)/2;function Xe(e){if(e<=0){fe.camera=l,r.uniforms.uDive.value=0;return}v.updateMatrixWorld(!0);const o=A.matrixWorld,t=v.scale.x;Fe.copy(Ke).applyMatrix4(o),qe.getNormalMatrix(o),ve.set(a.n[0],a.n[1],0).applyMatrix3(qe).normalize(),q.copy(pe).transformDirection(o),q.y<0&&q.negate();const i=s.viewport.aspect,c=e,h=Math.tan(25*Math.PI/180),d=Math.min(.7*Ue*t/i,.7*Te*t),f=Math.exp(Math.log(n)+(Math.log(d)-Math.log(n))*Math.pow(c,1.45)),x=Math.tan(Math.atan(n/J))+(h-n/J)*Math.pow(c,.6),y=f/x,S=D.inOut(Math.min(1,c/.6)),R=.45*S+.55*D.inOut(O(.84,1,c));Z.set(0,0,0).lerp(Fe,S),We.crossVectors(q,ve).normalize(),Z.addScaledVector(We,-g*.29*Ue*t*S).addScaledVector(q,-.22*Te*t*S),ze.set(0,0,1).lerp(ve,R).normalize(),u.fov=2*Math.atan(x)*180/Math.PI,u.aspect=i,u.position.copy(Z).addScaledVector(ze,y),Pe.set(0,1,0).lerp(q,S).normalize(),u.up.copy(Pe),u.lookAt(Z),u.near=Math.max(.002,y*.02),u.far=y+60,u.updateProjectionMatrix(),u.updateMatrixWorld(!0),fe.camera=u,Oe.multiplyMatrices(u.projectionMatrix,u.matrixWorldInverse),r.uniforms.uInvVP.value.copy(Oe).invert();const _=s.viewport.height*s.viewport.dpr;r.uniforms.uWpx.value=J/(J+we)*_/(2*n),r.uniforms.uDive.value=1}const de=new m,Ve=new Ne,Ce=new ut;let w=null,K=0,p=0;const Re=new Ne,Je=matchMedia("(prefers-reduced-motion: reduce)");let _e=!1;const fe={scene:b,camera:l,light:!0,resize:Ae,hud:()=>({grey:p.toFixed(3)}),update({p:e,t:o,dt:t}){const i=s.wallMark;i&&e<.05&&(w=i.p>.9?{x:i.x,y:i.y,ppu:i.ppu,q:Re.copy(i.q)}:{...i.exit,q:Re.identity()}),e>=.3&&(w=null);const c=1-Math.exp(-40*Math.min(t,.1));K+=(e*16/6-K)*c,r.uniforms.uLine.value=K*1.5,r.uniforms.uCross.value=K*.1%1;const h=s.greyVision??globalThis.__greyLines?.vision,d=typeof h=="number"?Math.min(1,Math.max(0,h)):D.inOut(O(.6,.8,e));p+=(d-p)*c,Math.abs(d-p)<1e-4&&(p=d),globalThis.__greyProbe={vis:p,p:e,swing:D.inOut(O(.86,.997,e))};const f=Je.matches;p>0&&(!f||!_e)&&(ie.draw(s.renderer,f?0:o),_e=!0),M.uniforms.uT.value=f?0:o;const x=D.inOut(O(.86,.997,e));M.uniforms.uA.value=Math.max(it.smoothstep(p,0,.1),x),H.visible=p>0,M.uniforms.uSwing.value=x;const y=(Y?78:30)*Math.PI/180,S=-(Y?8:5.7)*Math.PI/180;Ce.set(S*p,g*y*p,0),Ve.setFromEuler(Ce),A.quaternion.copy(Ve),U.uniforms.uA.value=1,G.visible=!0,r.uniforms.uVig.value=1;const R=D.inOut(O(.3,1,p)),_=C+(ue-C)*R,he=$+(ce-$)*R,me=le*R,L=w?1-D.inOut(O(0,.3,e)):0;if(w&&L>0){de.set(w.x*Q,w.y*n,0);const et=w.ppu*2*n/s.viewport.height;v.position.set(me+(de.x-me)*L,he+(de.y-he)*L,0),v.scale.setScalar(_+(et-_)*L),v.quaternion.identity().slerp(w.q,L)}else v.position.set(me,he,0),v.scale.setScalar(_),v.quaternion.identity();Xe(x)},dispose(){W.dispose(),F.dispose(),U.dispose(),V.dispose(),M.dispose(),r.dispose(),ie.dispose(),te.material.dispose(),u.clear()}};return fe};export{mt as default};
