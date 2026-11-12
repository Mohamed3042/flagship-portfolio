import{S as Te,O as De,b as N,s as ye,M as R,a as Oe,G as we,m as Be,e as Le,E as ze,T as be,U as re,X as Me,t as k,Y as Se,j as Ee,Q as Ae,o as O,r as U,q as Fe,k as Ge,W as Ve,y as qe}from"./EditionWorld.astro_astro_type_script_index_0_lang.DH-YgFNA.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const je=[215,219,220].map(n=>Math.pow(Math.min(1,n*1.027/255),2.2)),a=4,ke=.8;function Ne(){const n=new Ve(64,64,{minFilter:qe,magFilter:qe,depthBuffer:!1}),x=new N({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
      }`}),u=new Te,C=new De(-1,1,1,-1,0,1),d=new R(new Oe(2,2),x);return d.frustumCulled=!1,u.add(d),{texture:n.texture,draw(r,M){x.uniforms.uT.value=M;const c=r.getRenderTarget();r.setRenderTarget(n),r.render(u,C),r.setRenderTarget(c)},dispose(){n.dispose(),x.dispose(),d.geometry.dispose()}}}const Xe=n=>{const x=new Te,u=new De(-a,a,a,-a,.1,100);u.position.set(0,0,20),u.lookAt(0,0,0);const C=n.lang==="ar",d=C?-1:1,r=new N({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new ye(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        vec2 g = px / cell + vec2(0., uLine);                   // the lines: 1.5 cells per screen
        vec2 d = abs(fract(g + .5) - .5) * cell;                 // px to the nearest line
        float line = 1. - smoothstep(.35 * uDpr, .85 * uDpr, min(d.x, d.y));
        vec2 c = px + vec2(0., uCross * L);                       // the crosses: .1 of the grid per screen, wrapping
        vec2 q = mod(c + cell * 4., cell * 8.) - cell * 4.;
        float arm = 5.5 * uDpr, wd = .55 * uDpr;
        float plus = max(step(abs(q.x), wd) * step(abs(q.y), arm), step(abs(q.y), wd) * step(abs(q.x), arm));
        vec3 col = vec3(${je.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02);
        col = mix(col, vec3(0.), plus * .2);
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * smoothstep(1.5, .3, r * 1.25), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),M=new R(new Oe(2,2),r);M.frustumCulled=!1,M.renderOrder=-10,x.add(M);const c=new we;x.add(c);const S=new we;c.add(S);const w=Be(ke,!1,0,"now"),Y=new R(w,new Le({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));Y.renderOrder=0,S.add(Y);const I=new ze(w,20).getAttribute("position").array,W=I.length/6,ie=new Float32Array(W*12),ue=new Float32Array(W*12),le=new Float32Array(W*8),ce=[];for(let e=0;e<W;e++){for(let t=0;t<4;t++)ie.set(I.subarray(e*6,e*6+3),(e*4+t)*3),ue.set(I.subarray(e*6+3,e*6+6),(e*4+t)*3),le.set([t<2?0:1,t%2?1:-1],(e*4+t)*2);const o=e*4;ce.push(o,o+1,o+3,o,o+3,o+2)}const b=new be;b.setAttribute("position",new re(ie,3)),b.setAttribute("aB",new re(ue,3)),b.setAttribute("aS",new re(le,2)),b.setIndex(ce);const A=new N({side:Me,transparent:!0,uniforms:{uRes:{value:new ye(1,1)},uW:{value:1.5},uA:{value:1}},vertexShader:`
      attribute vec3 aB; attribute vec2 aS; uniform vec2 uRes; uniform float uW; varying float vE;
      void main(){
        vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.), b = projectionMatrix * modelViewMatrix * vec4(aB, 1.);
        vec2 d = (b.xy - a.xy) * uRes; float L = max(length(d), 1e-4); d /= L;
        vec4 p = aS.x < .5 ? a : b;
        vec2 n = vec2(-d.y, d.x) * aS.y * (uW * 3. + 1.) * .5 / uRes;  // the core, a soft glow out to three times it (his bloom on white)
        p.xy += (n + (aS.x < .5 ? -d : d) * uW * .5 / uRes) * p.w;
        vE = aS.y;
        gl_Position = p;
      }`,fragmentShader:"uniform float uW, uA; varying float vE; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA); }"}),_=new R(b,A);_.frustumCulled=!1,_.renderOrder=2,S.add(_);let Q=1e9,H=-1e9,X=1e9,K=-1e9;for(const e of k)for(const[o,t]of e)Q=Math.min(Q,o),H=Math.max(H,o),X=Math.min(X,t),K=Math.max(K,t);const Ue=(Q+H)/2,Re=(X+K)/2;let P=null;const Ce=C?[k[k.length-1]]:[k[0]];for(const e of Ce){let o=0;e.forEach(([t,l],h)=>{const[g,v]=e[(h+1)%e.length];o+=t*v-g*l}),e.forEach((t,l)=>{const h=e[(l+1)%e.length],g=h[0]-t[0],v=h[1]-t[1],p=Math.hypot(g,v),f=o>0?[v/p,-g/p]:[-v/p,g/p],T=p*f[0]*d*-1;(!P||T>P.score)&&(P={a:t,b:h,n:f,score:T})})}w.computeBoundingBox();const i=P,ve=w.boundingBox.max.z,pe=w.boundingBox.min.z,fe=.004,B=e=>e[0]-Ue+i.n[0]*fe,L=e=>e[1]-Re+i.n[1]*fe,F=new be;F.setAttribute("position",new Se([B(i.a),L(i.a),ve,B(i.b),L(i.b),ve,B(i.b),L(i.b),pe,B(i.a),L(i.a),pe],3)),F.setAttribute("uv",new Se([0,0,0,1,1,1,1,0],2)),F.setIndex([0,1,2,0,2,3]);const $=Ne(),y=new N({transparent:!0,depthWrite:!1,side:Me,uniforms:{tN:{value:$.texture},uDpr:{value:1},uFlip:{value:d>0?1:0},uFlipY:{value:i.a[1]>i.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0}},vertexShader:`
      uniform float uSwing, uAsp, uFlip, uFlipY; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        // the swing out (alche's vision → service): the face's corners go to the screen's corners
        vec2 full = vec2(mix(uv.x, 1. - uv.x, uFlip) * 2. - 1., mix(uv.y, 1. - uv.y, uFlipY) * 2. - 1.) * 1.08;   // (the back edge and the top stays on its side: no crossing)
        full *= mix(1.45, 1., smoothstep(.8, 1., uSwing));   // (world-50b) overscanned while it swings, so it is full-bleed from swing .7 (no inset frame), back to 1.08 at the boundary
        gl_Position = vec4(mix(p.xy / p.w, full, uSwing), mix(p.z / p.w, -.99, uSwing), 1.);
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
        float gs = smoothstep(.0, .1, uSwing);
        if (gs > 0.) {
          float g2 = hs(floor(gl_FragCoord.xy / uDpr) + 41. + floor(uT * 24.));
          float lit = mix(.3 + .7 * t, step(g2, smoothstep(.1, .95, t)) * .97 + .03, .4);
          col = mix(pow(col, vec3(2.2)), vec3(lit), gs);   // (the glass is written as seen: no 2.2 curve on it)
        } else col = pow(col, vec3(2.2));
        gl_FragColor = vec4(col, uA);
      }`}),z=new R(F,y);z.renderOrder=1,z.frustumCulled=!1,S.add(z);let E=!1,G=a,q=1,V=0,J=1,Z=0,ee=0;function de(){const e=n.viewport;E=e.portrait,G=a*e.aspect,u.left=-G,u.right=G,u.top=a,u.bottom=-a,u.updateProjectionMatrix(),r.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),r.uniforms.uDpr.value=e.dpr,A.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),A.uniforms.uW.value=2.3*e.dpr,y.uniforms.uAsp.value=e.aspect,y.uniforms.uDpr.value=e.dpr;const o=2*a/e.height;E?(q=.8*e.width*o/3.87,V=.35,J=.62*2*a/2,Z=.05,ee=d*.26):(q=.6*2*a/2*.82,V=-.1,J=q,Z=-.1,ee=0)}de();const te=new Ee,me=new Ae,he=new Ge;let m=null,j=0,s=0;const ge=new Ae,We=matchMedia("(prefers-reduced-motion: reduce)");let xe=!1;return{scene:x,camera:u,light:!0,resize:de,hud:()=>({grey:s.toFixed(3)}),update({p:e,t:o,dt:t}){const l=n.wallMark;l&&e<.05&&(m=l.p>.9?{x:l.x,y:l.y,ppu:l.ppu,q:ge.copy(l.q)}:{...l.exit,q:ge.identity()}),e>=.3&&(m=null);const h=1-Math.exp(-40*Math.min(t,.1));j+=(e*16/6-j)*h,r.uniforms.uLine.value=j*1.5,r.uniforms.uCross.value=j*.1%1;const g=n.greyVision??globalThis.__greyLines?.vision,v=typeof g=="number"?Math.min(1,Math.max(0,g)):O.inOut(U(.6,.8,e));s+=(v-s)*h,Math.abs(v-s)<1e-4&&(s=v),globalThis.__greyProbe={vis:s,p:e,swing:O.inOut(U(.9,.997,e))};const p=We.matches;s>0&&(!p||!xe)&&($.draw(n.renderer,p?0:o),xe=!0),y.uniforms.uT.value=p?0:o;const f=O.inOut(U(.9,.997,e));y.uniforms.uA.value=Math.max(Fe.smoothstep(s,0,.1),f),z.visible=s>0,y.uniforms.uSwing.value=f;const T=(E?78:30)*Math.PI/180,_e=-(E?8:5.7)*Math.PI/180;he.set(_e*s-.2*f,d*(T*s+Math.min(Math.PI/4,Math.PI/2-T*s)*f),0),me.setFromEuler(he),S.quaternion.copy(me),A.uniforms.uA.value=1-Fe.smoothstep(f,0,.35),_.visible=f<.35,r.uniforms.uVig.value=1;const oe=O.inOut(U(.3,1,s)),se=q+(J-q)*oe,ae=V+(Z-V)*oe,ne=ee*oe,D=m?1-O.inOut(U(0,.3,e)):0;if(m&&D>0){te.set(m.x*G,m.y*a,0);const Pe=m.ppu*2*a/n.viewport.height;c.position.set(ne+(te.x-ne)*D,ae+(te.y-ae)*D,0),c.scale.setScalar(se+(Pe-se)*D),c.quaternion.identity().slerp(m.q,D)}else c.position.set(ne,ae,0),c.scale.setScalar(se),c.quaternion.identity()},dispose(){w.dispose(),b.dispose(),A.dispose(),F.dispose(),y.dispose(),r.dispose(),$.dispose(),Y.material.dispose()}}};export{Xe as default};
