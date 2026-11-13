import{S as ht,F as dt,b as he,T as _e,B as Pe,M as $,a as vt,Z as ie,G as ot,m as Mt,e as Ft,E as St,_ as rt,$ as le,a0 as st,a1 as nt,P as Wt,k as M,a2 as At,W as Dt,z as it,Q as lt,s as _t,n as Pt,p as ue,r as X}from"./EditionWorld.astro_astro_type_script_index_0_lang.B4ZozurJ.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const qe=[215,219,220].map(i=>Math.pow(Math.min(1,i*1.027/255),2.2)),u=4,qt=.8,Be=3,ut=[.7,.9],L=1.8,ct=i=>.5-.5*Math.cos(Math.PI*i),ce=2e3;function Bt(){const i=new Dt(64,64,{minFilter:it,magFilter:it,depthBuffer:!1}),A=new he({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
      }`}),g=new ht,Q=new dt(-1,1,1,-1,0,1),W=new $(new vt(2,2),A);return W.frustumCulled=!1,g.add(W),{texture:i.texture,draw(c,E){A.uniforms.uT.value=E;const I=c.getRenderTarget();c.setRenderTarget(i),c.render(g,Q),c.setRenderTarget(I)},dispose(){i.dispose(),A.dispose(),W.geometry.dispose()}}}const Ut=i=>{const A=new ht,g=new dt(-u,u,u,-u,.1,100);g.position.set(0,0,20),g.lookAt(0,0,0);const Q=i.lang==="ar",W=Q?-1:1,c=new he({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new Pe(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new _e},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {   // (world-52) the dive: the grid and its crosses lie on a plane behind the mark (z ${-Be}); the moving camera's ray meets it (equal to the flat picture at the dive's start)
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${Be.toFixed(1)} - a.z) / (b.z - a.z);
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
        vec3 col = vec3(${qe.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * smoothstep(1.5, .3, r * 1.25), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),E=new $(new vt(2,2),c);E.frustumCulled=!1,E.renderOrder=-10,A.add(E);let I=1e9,de=-1e9,ve=1e9,pe=-1e9;for(const e of ie)for(const[o,t]of e)I=Math.min(I,o),de=Math.max(de,o),ve=Math.min(ve,t),pe=Math.max(pe,t);const Te=(I+de)/2,Ce=(ve+pe)/2;let F=null;const pt=Q?[ie[ie.length-1]]:[ie[0]];for(const e of pt){let o=0;e.forEach(([t,r],n)=>{const[v,h]=e[(n+1)%e.length];o+=t*h-v*r}),e.forEach((t,r)=>{const n=e[(r+1)%e.length],v=n[0]-t[0],h=n[1]-t[1],a=Math.hypot(v,h),f=o>0?[h/a,-v/a]:[-h/a,v/a],l=a*f[0]*W*-1;(!F||l>F.score)&&(F={a:t,b:n,n:f,score:l})})}function ft(){const e=F.a[0]-Te,o=F.a[1]-Ce,t=F.b[0]-F.a[0],r=F.b[1]-F.a[1],n=t*t+r*r;return(v,h)=>{const a=Math.min(1,Math.max(0,((v-e)*t+(h-o)*r)/n));return Math.hypot(v-e-a*t,h-o-a*r)<.001}}const S=new ot;A.add(S);const q=new ot;S.add(q);const B=Mt(qt,!1,0,"now"),fe=new $(B,new Ft({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));fe.renderOrder=0,q.add(fe);const w=new St(B,20).getAttribute("position").array,j=w.length/6,ze=new Float32Array(j*12),Re=new Float32Array(j*12),Ue=new Float32Array(j*8),ke=new Float32Array(j*4),Ve=[],Oe=ft();for(let e=0;e<j;e++){const o=Oe(w[e*6],w[e*6+1])&&Oe(w[e*6+3],w[e*6+4])?1:0;for(let r=0;r<4;r++)ze.set(w.subarray(e*6,e*6+3),(e*4+r)*3),Re.set(w.subarray(e*6+3,e*6+6),(e*4+r)*3),Ue.set([r<2?0:1,r%2?1:-1],(e*4+r)*2),ke[e*4+r]=o;const t=e*4;Ve.push(t,t+1,t+3,t,t+3,t+2)}const _=new rt;_.setAttribute("position",new le(ze,3)),_.setAttribute("aB",new le(Re,3)),_.setAttribute("aS",new le(Ue,2)),_.setAttribute("aF",new le(ke,1)),_.setIndex(Ve);const T=new he({side:st,transparent:!0,uniforms:{uRes:{value:new Pe(1,1)},uW:{value:1.5},uA:{value:1},uF:{value:0}},vertexShader:`
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
      }`,fragmentShader:"uniform float uW, uA; varying float vE, vF; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA * vF); }"}),G=new $(_,T);G.frustumCulled=!1,G.renderOrder=2,q.add(G),B.computeBoundingBox();const s=F,Z=B.boundingBox.max.z,J=B.boundingBox.min.z,Le=.004,C=e=>e[0]-Te+s.n[0]*Le,z=e=>e[1]-Ce+s.n[1]*Le,R=new rt;R.setAttribute("position",new nt([C(s.a),z(s.a),Z,C(s.b),z(s.b),Z,C(s.b),z(s.b),J,C(s.a),z(s.a),J],3)),R.setAttribute("uv",new nt([0,0,0,1,1,1,1,0],2)),R.setIndex([0,1,2,0,2,3]);const me=Bt(),b=new he({transparent:!0,depthWrite:!1,side:st,uniforms:{tN:{value:me.texture},uDpr:{value:1},uFlip:{value:W>0?1:0},uFlipY:{value:s.a[1]>s.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0},uMix:{value:1},uScr:{value:new Pe(1,1)},uCa:{value:.0025},uMb:{value:.4}},vertexShader:`
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
        float q = smoothstep(lo, hi, t);
        vec3 col = q < .4 ? mix(blk, deep, q / .4) : q < .75 ? mix(deep, crim, (q - .4) / .35) : mix(crim, red, (q - .75) / .25);
        col = mix(col, red, smoothstep(.57, .76, n.g + (.35 - vUv.y) * .3) * (uMix < .5 ? .45 : .85));   // redder toward the foot (where it was greener, as his f00500)
        col *= (.72 + .5 * n.g) * (.86 + .28 * hs(floor(gl_FragCoord.xy / uDpr) + 17.));   // + a per-pixel grain                                                          // × (.5 + noise) in alche's read; lighter here
        col = min(col, vec3(1.));
        // world-47c: from the moment it swings out the band is alche's glass before the picture eats it: its OWN noise in
        // grey, bright, with bright grain (no forms and no colour of ours); white and grey by the time it covers a quarter of
        // the screen, at any scroll speed. The next scene comes into it through the lens in the sand seam (passage-sand.ts)
        // (world-52) the band keeps its colour while we dive into it, as alche's (f00520-f00580): the picture of the next
        // scene eats it in the sand seam (passage-sand.ts), grain by grain, once we are inside
        col = pow(col, vec3(2.2));
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
        float vg = .82 + .18 * smoothstep(1.5, .3, length(su - .5) * 1.25);
        col.b = mix(col.b, ${qe[2].toFixed(5)} * vg, smoothstep(uMb + .5, uMb - .5, min(dB.x, dB.y)));
        col.r = mix(col.r, ${qe[0].toFixed(5)} * vg, smoothstep(uMb + .5, uMb - .5, min(dR.x, dR.y)));
        gl_FragColor = vec4(col, uA);
      }`}),U=new $(R,b);U.renderOrder=1,U.frustumCulled=!1,q.add(U);let K=!1,ee=u,N=1,te=0,ge=1,xe=0,we=0;function Ee(){const e=i.viewport;K=e.portrait,ee=u*e.aspect,g.left=-ee,g.right=ee,g.top=u,g.bottom=-u,g.updateProjectionMatrix(),c.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),c.uniforms.uDpr.value=e.dpr,T.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),T.uniforms.uW.value=2.3*e.dpr,b.uniforms.uAsp.value=e.aspect,b.uniforms.uDpr.value=e.dpr,b.uniforms.uScr.value.set(e.width*e.dpr,e.height*e.dpr);const o=2*u/e.height;K?(N=.8*e.width*o/3.87,te=.35,ge=.62*2*u/2,xe=.05,we=W*.26):(N=.6*2*u/2*.82,te=-.1,ge=N,xe=-.1,we=0)}Ee();const m=new Wt(10,1,.005,600),Ie=new M,je=new M,be=new M,k=new M,ae=new M,Ge=new M;new _e;const Ne=new M,Ye=new At,He=new _e,mt=new M((C(s.a)+C(s.b))/2,(z(s.a)+z(s.b))/2,(Z+J)/2),ye=new M(s.b[0]-s.a[0],s.b[1]-s.a[1],0),Xe=ye.length()/2;ye.normalize();const $e=(Z-J)/2;function gt(e){if(e<=0){re.camera=g,c.uniforms.uDive.value=0;return}S.updateMatrixWorld(!0);const o=q.matrixWorld,t=S.scale.x;je.copy(mt).applyMatrix4(o),Ye.getNormalMatrix(o),be.set(s.n[0],s.n[1],0).applyMatrix3(Ye).normalize(),k.copy(ye).transformDirection(o),k.y<0&&k.negate();const r=i.viewport.aspect,n=e,v=Math.tan(25*Math.PI/180),h=Math.min(.7*$e*t/r,.7*Xe*t),a=Math.exp(Math.log(u)+(Math.log(h)-Math.log(u))*Math.pow(n,1.45)),f=Math.tan(Math.atan(u/ce))+(v-u/ce)*Math.pow(n,.6),l=a/f,p=ue.inOut(Math.min(1,n/.6)),x=.45*p+.55*ct(X(.7,1,n));ae.set(0,0,0).lerp(je,p),Ie.crossVectors(k,be).normalize(),ae.addScaledVector(Ie,-W*.29*$e*t*p).addScaledVector(k,-.22*Xe*t*p),Ge.set(0,0,1).lerp(be,x).normalize(),m.fov=2*Math.atan(f)*180/Math.PI,m.aspect=r,m.position.copy(ae).addScaledVector(Ge,l),Ne.set(0,1,0).lerp(k,p).normalize(),m.up.copy(Ne),m.lookAt(ae),m.near=Math.max(.002,l*.02),m.far=l+60,m.updateProjectionMatrix(),m.updateMatrixWorld(!0),re.camera=m,He.multiplyMatrices(m.projectionMatrix,m.matrixWorldInverse),c.uniforms.uInvVP.value.copy(He).invert();const P=i.viewport.height*i.viewport.dpr;c.uniforms.uWpx.value=ce/(ce+Be)*P/(2*u),c.uniforms.uDive.value=1}const Y=new M,Qe=[];for(let e=0;e<5;e++)for(let o=0;o<9;o++)Qe.push([e/4,o/8]);function xt(){A.updateMatrixWorld(!0);const e=re.camera;e.updateMatrixWorld();const o=i.viewport.width,t=i.viewport.height,r=(a,f,l,p)=>(Y.set(a,f,l).applyMatrix4(p).project(e),Y.z<1&&Y.z>-1?[+((Y.x+1)/2*o).toFixed(2),+((1-Y.y)/2*t).toFixed(2)]:null),n=R.getAttribute("position").array,v=[];for(const[a,f]of Qe){const l=(x,P)=>n[x*3+P],p=x=>(l(0,x)*(1-f)+l(1,x)*f)*(1-a)+(l(3,x)*(1-f)+l(2,x)*f)*a;v.push(r(p(0),p(1),p(2),U.matrixWorld))}const h=[];for(let a=0;a<w.length;a+=12)h.push(r(w[a],w[a+1],w[a+2],G.matrixWorld));globalThis.__greyProbe.face=v,globalThis.__greyProbe.lines=h}const Me=new M,Ze=new lt,Je=new Pt;let D=null,oe=0,d=0,y=0,V=0,O=0,Fe=-1;const Ke=new lt,wt=matchMedia("(prefers-reduced-motion: reduce)");let et=!1;const re={scene:A,camera:g,light:!0,resize:Ee,hud:()=>({grey:d.toFixed(3)}),update({p:e,t:o,dt:t,v:r}){b.uniforms.uCa.value=.0025+Math.min(Math.abs(r??0),4)*.006;const n=i.wallMark;n&&e<.05&&(D=n.p>.9?{x:n.x,y:n.y,ppu:n.ppu,q:Ke.copy(n.q)}:{...n.exit,q:Ke.identity()}),e>=.3&&(D=null);const v=1-Math.exp(-40*Math.min(t,.1));oe+=(e*16/6-oe)*v,c.uniforms.uLine.value=oe*1.5,c.uniforms.uCross.value=oe*.1%1;const h=i.greyVision??globalThis.__greyLines?.vision,a=typeof h=="number"?Math.min(1,Math.max(0,h)):ue.inOut(X(.6,.8,e)),f=Fe<0||Math.abs(e-Fe)>.15;Fe=e;const l=ct(X(ut[0],ut[1],e));if(f)d=a,V=0,y=l,O=0;else for(let se=Math.min(t,.1),tt=Math.ceil(se/.02),at=0;at<tt;at++){const ne=se/tt;V+=(L*L*(a-d)-2*L*V)*ne,d+=V*ne,O+=(L*L*(l-y)-2*L*O)*ne,y+=O*ne}y=Math.max(y,l-Math.min(1,Math.max(0,(1-e)/.08))),d=Math.min(1,Math.max(0,d)),y=Math.min(1,Math.max(0,y)),Math.abs(a-d)<1e-4&&Math.abs(V)<1e-4&&(d=a,V=0),Math.abs(l-y)<1e-4&&Math.abs(O)<1e-4&&(y=l,O=0),globalThis.__greyProbe={vis:d,p:e,swing:y};const p=wt.matches;d>0&&(!p||!et)&&(me.draw(i.renderer,p?0:o),et=!0),b.uniforms.uT.value=p?0:o;const x=globalThis.__greyMix;b.uniforms.uMix.value=x===0||x===2?x:1;const P=y;b.uniforms.uA.value=Math.max(_t.smoothstep(d,0,.1),P),U.visible=d>0,T.uniforms.uF.value=U.visible?b.uniforms.uA.value:0,b.uniforms.uSwing.value=P;const bt=(K?78:30)*Math.PI/180,yt=-(K?8:5.7)*Math.PI/180;Je.set(yt*d,W*bt*d,0),Ze.setFromEuler(Je),q.quaternion.copy(Ze),T.uniforms.uA.value=1,G.visible=!0,c.uniforms.uVig.value=1;const Se=ue.inOut(X(.3,1,d)),We=N+(ge-N)*Se,Ae=te+(xe-te)*Se,De=we*Se,H=D?1-ue.inOut(X(0,.3,e)):0;if(D&&H>0){Me.set(D.x*ee,D.y*u,0);const se=D.ppu*2*u/i.viewport.height;S.position.set(De+(Me.x-De)*H,Ae+(Me.y-Ae)*H,0),S.scale.setScalar(We+(se-We)*H),S.quaternion.identity().slerp(D.q,H)}else S.position.set(De,Ae,0),S.scale.setScalar(We),S.quaternion.identity();gt(P),globalThis.__greyProbeOn&&xt()},dispose(){B.dispose(),_.dispose(),T.dispose(),R.dispose(),b.dispose(),c.dispose(),me.dispose(),fe.material.dispose(),m.clear()}};return re};export{Ut as default};
