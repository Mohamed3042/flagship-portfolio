import{S as yt,F as bt,b as we,T as ve,B as ke,M as te,a as Mt,Z as fe,G as ht,m as Bt,e as Tt,E as Ct,_ as dt,$ as me,a0 as pt,a1 as vt,P as Vt,k as w,a2 as ft,V as Re,W as kt,z as mt,Q as gt,s as Rt,n as Ut,p as ge,r as ee}from"./EditionWorld.astro_astro_type_script_index_0_lang.BeXFjqJb.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ue=[215,219,220].map(i=>Math.pow(Math.min(1,i*1.027/255),2.2)),c=4,Ot=.8,Oe=3,xt=[.7,.9],H=1.8,wt=i=>.5-.5*Math.cos(Math.PI*i),xe=2e3;function Lt(){const i=new kt(64,64,{minFilter:mt,magFilter:mt,depthBuffer:!1}),A=new we({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
      }`}),g=new yt,ae=new bt(-1,1,1,-1,0,1),q=new te(new Mt(2,2),A);return q.frustumCulled=!1,g.add(q),{texture:i.texture,draw(d,N){A.uniforms.uT.value=N;const Y=d.getRenderTarget();d.setRenderTarget(i),d.render(g,ae),d.setRenderTarget(Y)},dispose(){i.dispose(),A.dispose(),q.geometry.dispose()}}}const Ht=i=>{const A=new yt,g=new bt(-c,c,c,-c,.1,100);g.position.set(0,0,20),g.lookAt(0,0,0);const ae=i.lang==="ar",q=ae?-1:1,d=new we({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new ke(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new ve},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {   // (world-52) the dive: the grid and its crosses lie on a plane behind the mark (z ${-Oe}); the moving camera's ray meets it (equal to the flat picture at the dive's start)
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${Oe.toFixed(1)} - a.z) / (b.z - a.z);
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
        vec3 col = vec3(${Ue.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * (1. - smoothstep(.3, 1.5, r * 1.25)), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),N=new te(new Mt(2,2),d);N.frustumCulled=!1,N.renderOrder=-10,A.add(N);let Y=1e9,ye=-1e9,be=1e9,Me=-1e9;for(const e of fe)for(const[a,t]of e)Y=Math.min(Y,a),ye=Math.max(ye,a),be=Math.min(be,t),Me=Math.max(Me,t);const Le=(Y+ye)/2,je=(be+Me)/2;let F=null;const Ft=ae?[fe[fe.length-1]]:[fe[0]];for(const e of Ft){let a=0;e.forEach(([t,o],s)=>{const[h,l]=e[(s+1)%e.length];a+=t*l-h*o}),e.forEach((t,o)=>{const s=e[(o+1)%e.length],h=s[0]-t[0],l=s[1]-t[1],r=Math.hypot(h,l),f=a>0?[l/r,-h/r]:[-l/r,h/r],u=r*f[0]*q*-1;(!F||u>F.score)&&(F={a:t,b:s,n:f,score:u})})}function St(){const e=F.a[0]-Le,a=F.a[1]-je,t=F.b[0]-F.a[0],o=F.b[1]-F.a[1],s=t*t+o*o;return(h,l)=>{const r=Math.min(1,Math.max(0,((h-e)*t+(l-a)*o)/s));return Math.hypot(h-e-r*t,l-a-r*o)<.001}}const S=new ht;A.add(S);const k=new ht;S.add(k);const R=Bt(Ot,!1,0,"now"),Fe=new te(R,new Tt({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));Fe.renderOrder=0,k.add(Fe);const y=new Ct(R,20).getAttribute("position").array,X=y.length/6,Ie=new Float32Array(X*12),Ee=new Float32Array(X*12),Ge=new Float32Array(X*8),He=new Float32Array(X*4),Ne=[],Ye=St();for(let e=0;e<X;e++){const a=Ye(y[e*6],y[e*6+1])&&Ye(y[e*6+3],y[e*6+4])?1:0;for(let o=0;o<4;o++)Ie.set(y.subarray(e*6,e*6+3),(e*4+o)*3),Ee.set(y.subarray(e*6+3,e*6+6),(e*4+o)*3),Ge.set([o<2?0:1,o%2?1:-1],(e*4+o)*2),He[e*4+o]=a;const t=e*4;Ne.push(t,t+1,t+3,t,t+3,t+2)}const _=new dt;_.setAttribute("position",new me(Ie,3)),_.setAttribute("aB",new me(Ee,3)),_.setAttribute("aS",new me(Ge,2)),_.setAttribute("aF",new me(He,1)),_.setIndex(Ne);const U=new we({side:pt,transparent:!0,uniforms:{uRes:{value:new ke(1,1)},uW:{value:1.5},uA:{value:1},uF:{value:0}},vertexShader:`
      attribute vec3 aB; attribute vec2 aS; attribute float aF; uniform vec2 uRes; uniform float uW, uF; varying float vE, vF;
      void main(){
        vF = 1. - aF * uF;
        vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.), b = projectionMatrix * modelViewMatrix * vec4(aB, 1.);
        vec2 d = (b.xy - a.xy) * uRes; float L = max(length(d), 1e-4); d /= L;
        vec4 p = aS.x < .5 ? a : b;
        vec2 n = vec2(-d.y, d.x) * aS.y * (uW * 3. + 1.) * .5 / uRes;  // the core, a soft glow out to three times it (his bloom on white)
        p.xy += (n + (aS.x < .5 ? -d : d) * uW * .5 / uRes) * p.w;
        vE = aS.y;
        gl_Position = p;
      }`,fragmentShader:"uniform float uW, uA; varying float vE, vF; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA * vF); }"}),$=new te(_,U);$.frustumCulled=!1,$.renderOrder=2,k.add($),R.computeBoundingBox();const n=F,oe=R.boundingBox.max.z,re=R.boundingBox.min.z,Xe=.004,O=e=>e[0]-Le+n.n[0]*Xe,L=e=>e[1]-je+n.n[1]*Xe,z=new dt;z.setAttribute("position",new vt([O(n.a),L(n.a),oe,O(n.b),L(n.b),oe,O(n.b),L(n.b),re,O(n.a),L(n.a),re],3)),z.setAttribute("uv",new vt([0,0,0,1,1,1,1,0],2)),z.setIndex([0,1,2,0,2,3]);const Se=Lt(),b=new we({transparent:!0,depthWrite:!1,side:pt,uniforms:{tN:{value:Se.texture},uDpr:{value:1},uFlip:{value:q>0?1:0},uFlipY:{value:n.a[1]>n.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0},uMix:{value:1},uScr:{value:new ke(1,1)},uCa:{value:.0025},uMb:{value:.4}},vertexShader:`
      uniform float uSwing, uAsp, uFlip, uFlipY; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        // the swing out (alche's vision → service): the face's corners go to the screen's corners
        gl_Position = p;   // (world-52) the band stays where it stands; the camera dives into it (no flat plate flying at the viewer)
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uA, uT, uDpr, uSwing, uMix, uCa, uMb; uniform vec2 uScr; varying vec2 vUv;
      float hs(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      void main(){
        vec2 uv = vec2(vUv.x, vUv.y);
        vec4 n1 = texture2D(tN, uv);
        float j = hs(floor(gl_FragCoord.xy / uDpr) + floor(uT * 24.));   // grain in CSS px
        vec4 n = texture2D(tN, uv + (n1.rg - .5) * (.06 + 1.1 * j));                  // the grain: a jittered second read
        float t = clamp((n.r * .65 + n.b * .35 - .5) * 3.4 + .66, 0., 1.);   // fbm sits near .5: stretched to use the whole ramp
        // (world-74, the owner: "can we make them black and red? i love these colors") black and red only, where the green,
        // cyan and blue were: a deep black, a dark red, the LED wall's crimson (a little less blue: hue 352, not 349) and a true red (hue 352-358, never orange or
        // pink); the same flow, grain and soft edges. uMix (QA dial window.__greyMix): 0 A mostly black with a red flow,
        // 1 B half and half (red where the green was, black where the blue), 2 C mostly red with black shadows
        vec3 blk = vec3(.012, .006, .008), deep = vec3(.34, .0, .03), crim = vec3(.86, .05, .15), red = vec3(1., .06, .1);
        float lo = uMix < .5 ? .52 : uMix < 1.5 ? .3 : .02, hi = uMix < .5 ? 1.08 : uMix < 1.5 ? .86 : .56;
        // (world-78, the owner: alche's melt is alive, ours a soft cloud) shapes: the field's steps narrowed, and where two
        // shapes meet a coarse dither (the field jittered per 2 css px cell), so the forms read with grainy edges
        float hc = hs(floor(gl_FragCoord.xy / (2. * uDpr)) + 5.);
        float tj = t + (hc - .5) * .12;
        float q = smoothstep(lo, hi, tj); q = mix(q, smoothstep(.3, .7, q), .75);
        vec3 col = q < .4 ? mix(blk, deep, q / .4) : q < .75 ? mix(deep, crim, (q - .4) / .35) : mix(crim, red, (q - .75) / .25);
        col = mix(col, red, smoothstep(.57, .76, n.g + (.35 - vUv.y) * .3) * (uMix < .5 ? .45 : .85));   // redder toward the foot (where it was greener, as his f00500)
        col *= (.72 + .5 * n.g) * (.86 + .28 * hs(floor(gl_FragCoord.xy / uDpr) + 17.));   // + a per-pixel grain                                                          // × (.5 + noise) in alche's read; lighter here
        // hot light: white-hot blobs where a second combination of the field peaks (with a thin blue-violet rim, never warm),
        // and dark cores where the third sinks
        float hf = n.g * .55 + n.r * .45 + (hc - .5) * .05;
        col = mix(col, vec3(1.), smoothstep(.575, .595, hf) * .96);
        col += vec3(.3, .26, .95) * (smoothstep(.545, .565, hf) - smoothstep(.568, .578, hf)) * .55;
        col *= 1. - .9 * smoothstep(.62, .66, n.b * .7 + (1. - n.g) * .3 + (hc - .5) * .05);
        col = min(col, vec3(1.));
        // world-47c: from the moment it swings out the band is alche's glass before the picture eats it: its OWN noise in
        // grey, bright, with bright grain (no forms and no colour of ours); white and grey by the time it covers a quarter of
        // the screen, at any scroll speed. The next scene comes into it through the lens in the sand seam (passage-sand.ts)
        // (world-52) the band keeps its colour while we dive into it, as alche's (f00520-f00580): the picture of the next
        // scene eats it in the sand seam (passage-sand.ts), grain by grain, once we are inside
        col = pow(max(col, vec3(0.)), vec3(2.2));   // (world-80: never a negative base)
        // (world-76, the owner bans yellow and orange) the engine's lens colour split (engine.ts grab(): at rest .0025 of the
        // way to the screen's middle) shows each pixel the blue of a pixel nearer the middle. Just outside the face's outer
        // edges the grey room so took the face's blue (~0) under its own red and green: a yellow line along the red and black.
        // Where this pixel's blue is shown outside the face (here + the split: uCa, the engine's own amount, resting + scroll
        // speed), it carries the room's blue (the ground's value and vignette), so the room there stays grey.
        vec2 su = gl_FragCoord.xy / uScr, sd = (su - .5) * uScr;
        // The same for red on the edges that face the middle (the red is read from a pixel farther out: there the room took
        // the black's red, a cyan line). By coverage: the share of the pixel where it is shown that lies outside the face
        // (the face's signed distance in px there, over one pixel), so the part-covered edge pixels get the room's share.
        vec2 uX = dFdx(vUv), uY = dFdy(vUv), pu = vec2(length(vec2(uX.x, uY.x)), length(vec2(uX.y, uY.y))) + 1e-6;   // uv per px
        vec2 sB = sd * uCa, oB = vUv + uX * sB.x + uY * sB.y, oR = vUv - uX * sB.x - uY * sB.y;
        vec2 dB = min(oB, 1. - oB) / pu, dR = min(oR, 1. - oR) / pu;   // px inside the face (negative: outside)
        float vg = .82 + .18 * (1. - smoothstep(.3, 1.5, length(su - .5) * 1.25));
        col.b = mix(col.b, ${Ue[2].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dB.x, dB.y))));
        col.r = mix(col.r, ${Ue[0].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dR.x, dR.y))));
        gl_FragColor = vec4(col, uA);
      }`}),D=new te(z,b);D.renderOrder=1,D.frustumCulled=!1,k.add(D);let se=!1,ne=c,Q=1,ie=0,We=1,Ae=0,qe=0;function $e(){const e=i.viewport;se=e.portrait,ne=c*e.aspect,g.left=-ne,g.right=ne,g.top=c,g.bottom=-c,g.updateProjectionMatrix(),d.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),d.uniforms.uDpr.value=e.dpr,U.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),U.uniforms.uW.value=2.3*e.dpr,b.uniforms.uAsp.value=e.aspect,b.uniforms.uDpr.value=e.dpr,b.uniforms.uScr.value.set(e.width*e.dpr,e.height*e.dpr);const a=2*c/e.height;se?(Q=.8*e.width*a/3.87,ie=.35,We=.62*2*c/2,Ae=.05,qe=q*.26):(Q=.6*2*c/2*.82,ie=-.1,We=Q,Ae=-.1,qe=0)}$e();const m=new Vt(10,1,.005,600),Qe=new w,Ze=new w,De=new w,j=new w,le=new w,Je=new w;new ve;const Ke=new w,et=new ft,tt=new ve,Wt=new w((O(n.a)+O(n.b))/2,(L(n.a)+L(n.b))/2,(oe+re)/2),Pe=new w(n.b[0]-n.a[0],n.b[1]-n.a[1],0),at=Pe.length()/2;Pe.normalize();const ot=(oe-re)/2;function At(e){if(e<=0){J.camera=g,d.uniforms.uDive.value=0;return}S.updateMatrixWorld(!0);const a=k.matrixWorld,t=S.scale.x;Ze.copy(Wt).applyMatrix4(a),et.getNormalMatrix(a),De.set(n.n[0],n.n[1],0).applyMatrix3(et).normalize(),j.copy(Pe).transformDirection(a),j.y<0&&j.negate();const o=i.viewport.aspect,s=e,h=Math.tan(25*Math.PI/180),l=Math.min(.7*ot*t/o,.7*at*t),r=Math.exp(Math.log(c)+(Math.log(l)-Math.log(c))*Math.pow(s,1.45)),f=Math.tan(Math.atan(c/xe))+(h-c/xe)*Math.pow(s,.6),u=r/f,v=ge.inOut(Math.min(1,s/.6)),x=.45*v+.55*wt(ee(.7,1,s));le.set(0,0,0).lerp(Ze,v),Qe.crossVectors(j,De).normalize(),le.addScaledVector(Qe,-q*.29*ot*t*v).addScaledVector(j,-.22*at*t*v),Je.set(0,0,1).lerp(De,x).normalize(),m.fov=2*Math.atan(f)*180/Math.PI,m.aspect=o,m.position.copy(le).addScaledVector(Je,u),Ke.set(0,1,0).lerp(j,v).normalize(),m.up.copy(Ke),m.lookAt(le),m.near=Math.max(.002,u*.02),m.far=u+60,m.updateProjectionMatrix(),m.updateMatrixWorld(!0),J.camera=m,tt.multiplyMatrices(m.projectionMatrix,m.matrixWorldInverse),d.uniforms.uInvVP.value.copy(tt).invert();const V=i.viewport.height*i.viewport.dpr;d.uniforms.uWpx.value=xe/(xe+Oe)*V/(2*c),d.uniforms.uDive.value=1}const Z=new w,rt=[];for(let e=0;e<5;e++)for(let a=0;a<9;a++)rt.push([e/4,a/8]);function qt(){A.updateMatrixWorld(!0);const e=J.camera;e.updateMatrixWorld();const a=i.viewport.width,t=i.viewport.height,o=(r,f,u,v)=>(Z.set(r,f,u).applyMatrix4(v).project(e),Z.z<1&&Z.z>-1?[+((Z.x+1)/2*a).toFixed(2),+((1-Z.y)/2*t).toFixed(2)]:null),s=z.getAttribute("position").array,h=[];for(const[r,f]of rt){const u=(x,V)=>s[x*3+V],v=x=>(u(0,x)*(1-f)+u(1,x)*f)*(1-r)+(u(3,x)*(1-f)+u(2,x)*f)*r;h.push(o(v(0),v(1),v(2),D.matrixWorld))}const l=[];for(let r=0;r<y.length;r+=12)l.push(o(y[r],y[r+1],y[r+2],$.matrixWorld));globalThis.__greyProbe.face=h,globalThis.__greyProbe.lines=l}const ue=new ft,ce=new ve,B=new Re,T=new Re,C=new Re,W=new w,I={H:ue,on:0,at:-1};i.gateFace=I;function Dt(e){if(I.on=D.visible?1:0,I.at=e,!I.on)return;const a=J.camera;A.updateMatrixWorld(!0),a.updateMatrixWorld(),ce.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse).multiply(D.matrixWorld);const t=z.getAttribute("position").array,o=l=>W.set(t[l*3],t[l*3+1],t[l*3+2]);o(0),B.set(W.x,W.y,W.z,1).applyMatrix4(ce),o(3),C.set(W.x-t[0],W.y-t[1],W.z-t[2],0).applyMatrix4(ce),o(1),T.set(W.x-t[0],W.y-t[1],W.z-t[2],0).applyMatrix4(ce),ue.set(C.x,T.x,B.x,C.y,T.y,B.y,C.w,T.w,B.w);const s=ue.determinant(),h=Math.hypot(C.x,C.y,C.w)*Math.hypot(T.x,T.y,T.w)*Math.hypot(B.x,B.y,B.w);if(!(Math.abs(s)>1e-6*h)){I.on=0;return}ue.invert(),i.gateFace=I}const _e=new w,st=new gt,nt=new Ut;let P=null,he=0,p=0,M=0,E=0,G=0,ze=-1;const it=new gt,Pt=matchMedia("(prefers-reduced-motion: reduce)");let lt=!1;const J={scene:A,camera:g,light:!0,resize:$e,hud:()=>({grey:p.toFixed(3)}),update({p:e,t:a,dt:t,v:o}){b.uniforms.uCa.value=.0025+Math.min(Math.abs(o??0),4)*.006;const s=i.wallMark;s&&e<.05&&(P=s.p>.9?{x:s.x,y:s.y,ppu:s.ppu,q:it.copy(s.q)}:{...s.exit,q:it.identity()}),e>=.3&&(P=null);const h=1-Math.exp(-40*Math.min(t,.1));he+=(e*16/6-he)*h,d.uniforms.uLine.value=he*1.5,d.uniforms.uCross.value=he*.1%1;const l=i.greyVision??globalThis.__greyLines?.vision,r=typeof l=="number"?Math.min(1,Math.max(0,l)):ge.inOut(ee(.6,.8,e)),f=ze<0||Math.abs(e-ze)>.15;ze=e;const u=wt(ee(xt[0],xt[1],e));if(f)p=r,E=0,M=u,G=0;else for(let de=Math.min(t,.1),ut=Math.ceil(de/.02),ct=0;ct<ut;ct++){const pe=de/ut;E+=(H*H*(r-p)-2*H*E)*pe,p+=E*pe,G+=(H*H*(u-M)-2*H*G)*pe,M+=G*pe}M=Math.max(M,u-Math.min(1,Math.max(0,(1-e)/.08))),p=Math.min(1,Math.max(0,p)),M=Math.min(1,Math.max(0,M)),Math.abs(r-p)<1e-4&&Math.abs(E)<1e-4&&(p=r,E=0),Math.abs(u-M)<1e-4&&Math.abs(G)<1e-4&&(M=u,G=0),globalThis.__greyProbe={vis:p,p:e,swing:M};const v=Pt.matches;p>0&&(!v||!lt)&&(Se.draw(i.renderer,v?0:a),lt=!0),b.uniforms.uT.value=v?0:a;const x=globalThis.__greyMix;b.uniforms.uMix.value=x===0||x===2?x:1;const V=M;b.uniforms.uA.value=Math.max(Rt.smoothstep(p,0,.1),V),D.visible=p>0,U.uniforms.uF.value=D.visible?b.uniforms.uA.value:0,b.uniforms.uSwing.value=V;const _t=(se?78:30)*Math.PI/180,zt=-(se?8:5.7)*Math.PI/180;nt.set(zt*p,q*_t*p,0),st.setFromEuler(nt),k.quaternion.copy(st),U.uniforms.uA.value=1,$.visible=!0,d.uniforms.uVig.value=1;const Be=ge.inOut(ee(.3,1,p)),Te=Q+(We-Q)*Be,Ce=ie+(Ae-ie)*Be,Ve=qe*Be,K=P?1-ge.inOut(ee(0,.3,e)):0;if(P&&K>0){_e.set(P.x*ne,P.y*c,0);const de=P.ppu*2*c/i.viewport.height;S.position.set(Ve+(_e.x-Ve)*K,Ce+(_e.y-Ce)*K,0),S.scale.setScalar(Te+(de-Te)*K),S.quaternion.identity().slerp(P.q,K)}else S.position.set(Ve,Ce,0),S.scale.setScalar(Te),S.quaternion.identity();At(V),Dt(a),globalThis.__greyProbeOn&&qt()},dispose(){R.dispose(),_.dispose(),U.dispose(),z.dispose(),b.dispose(),d.dispose(),Se.dispose(),Fe.material.dispose(),m.clear()}};return J};export{Ht as default};
