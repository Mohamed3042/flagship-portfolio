import{S as bt,F as Mt,b as ye,T as me,B as ze,M as oe,a as Ft,Z as fe,G as ht,m as _t,e as qt,E as Pt,_ as dt,$ as ge,a0 as pt,a1 as vt,P as Tt,k as y,a2 as mt,V as Ce,W as zt,z as ft,Q as gt,s as wt,n as Ct,p as we,r as ee}from"./EditionWorld.astro_astro_type_script_index_0_lang.BAMIxKDB.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const te=[215,219,220].map(n=>Math.pow(Math.min(1,n*1.027/255),2.2)),c=4,Vt=.8,Ve=3,xt=[.7,.9],Y=1.8,yt=n=>.5-.5*Math.cos(Math.PI*n),xe=2e3;function Ot(){const n=new zt(64,64,{minFilter:ft,magFilter:ft,depthBuffer:!1}),W=new ye({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
      }`}),g=new bt,ae=new Mt(-1,1,1,-1,0,1),A=new oe(new Ft(2,2),W);return A.frustumCulled=!1,g.add(A),{texture:n.texture,draw(d,H){W.uniforms.uT.value=H;const N=d.getRenderTarget();d.setRenderTarget(n),d.render(g,ae),d.setRenderTarget(N)},dispose(){n.dispose(),W.dispose(),A.geometry.dispose()}}}const Yt=n=>{const W=new bt,g=new Mt(-c,c,c,-c,.1,100);g.position.set(0,0,20),g.lookAt(0,0,0);const ae=n.lang==="ar",A=ae?-1:1,d=new ye({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new ze(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new me},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {   // (world-52) the dive: the grid and its crosses lie on a plane behind the mark (z ${-Ve}); the moving camera's ray meets it (equal to the flat picture at the dive's start)
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${Ve.toFixed(1)} - a.z) / (b.z - a.z);
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
        vec3 col = vec3(${te.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * (1. - smoothstep(.3, 1.5, r * 1.25)), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),H=new oe(new Ft(2,2),d);H.frustumCulled=!1,H.renderOrder=-10,W.add(H);let N=1e9,be=-1e9,Me=1e9,Fe=-1e9;for(const e of fe)for(const[o,t]of e)N=Math.min(N,o),be=Math.max(be,o),Me=Math.min(Me,t),Fe=Math.max(Fe,t);const Oe=(N+be)/2,Ee=(Me+Fe)/2;let F=null;const St=ae?[fe[fe.length-1]]:[fe[0]];for(const e of St){let o=0;e.forEach(([t,a],r)=>{const[h,l]=e[(r+1)%e.length];o+=t*l-h*a}),e.forEach((t,a)=>{const r=e[(a+1)%e.length],h=r[0]-t[0],l=r[1]-t[1],s=Math.hypot(h,l),m=o>0?[l/s,-h/s]:[-l/s,h/s],u=s*m[0]*A*-1;(!F||u>F.score)&&(F={a:t,b:r,n:m,score:u})})}function Bt(){const e=F.a[0]-Oe,o=F.a[1]-Ee,t=F.b[0]-F.a[0],a=F.b[1]-F.a[1],r=t*t+a*a;return(h,l)=>{const s=Math.min(1,Math.max(0,((h-e)*t+(l-o)*a)/r));return Math.hypot(h-e-s*t,l-o-s*a)<.001}}const S=new ht;W.add(S);const T=new ht;S.add(T);const z=_t(Vt,!1,0,"now"),Se=new oe(z,new qt({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));Se.renderOrder=0,T.add(Se);const b=new Pt(z,20).getAttribute("position").array,X=b.length/6,je=new Float32Array(X*12),Ie=new Float32Array(X*12),Ge=new Float32Array(X*8),Ye=new Float32Array(X*4),He=[],Ne=Bt();for(let e=0;e<X;e++){const o=Ne(b[e*6],b[e*6+1])&&Ne(b[e*6+3],b[e*6+4])?1:0;for(let a=0;a<4;a++)je.set(b.subarray(e*6,e*6+3),(e*4+a)*3),Ie.set(b.subarray(e*6+3,e*6+6),(e*4+a)*3),Ge.set([a<2?0:1,a%2?1:-1],(e*4+a)*2),Ye[e*4+a]=o;const t=e*4;He.push(t,t+1,t+3,t,t+3,t+2)}const D=new dt;D.setAttribute("position",new ge(je,3)),D.setAttribute("aB",new ge(Ie,3)),D.setAttribute("aS",new ge(Ge,2)),D.setAttribute("aF",new ge(Ye,1)),D.setIndex(He);const C=new ye({side:pt,transparent:!0,uniforms:{uRes:{value:new ze(1,1)},uW:{value:1.5},uA:{value:1},uF:{value:0}},vertexShader:`
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
      }`,fragmentShader:"uniform float uW, uA; varying float vE, vF; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA * vF); }"}),$=new oe(D,C);$.frustumCulled=!1,$.renderOrder=2,T.add($),z.computeBoundingBox();const i=F,se=z.boundingBox.max.z,re=z.boundingBox.min.z,Xe=.004,V=e=>e[0]-Oe+i.n[0]*Xe,O=e=>e[1]-Ee+i.n[1]*Xe,L=new dt;L.setAttribute("position",new vt([V(i.a),O(i.a),se,V(i.b),O(i.b),se,V(i.b),O(i.b),re,V(i.a),O(i.a),re],3)),L.setAttribute("uv",new vt([0,0,0,1,1,1,1,0],2)),L.setIndex([0,1,2,0,2,3]);const Be=Ot(),w=new ye({transparent:!0,depthWrite:!1,side:pt,uniforms:{tN:{value:Be.texture},uDpr:{value:1},uFlip:{value:A>0?1:0},uFlipY:{value:i.a[1]>i.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0},uMix:{value:1},uScr:{value:new ze(1,1)},uCa:{value:.0025},uMb:{value:.4},uLine:{value:0}},vertexShader:`
      uniform float uSwing, uAsp, uFlip, uFlipY; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        // the swing out (alche's vision → service): the face's corners go to the screen's corners
        gl_Position = p;   // (world-52) the band stays where it stands; the camera dives into it (no flat plate flying at the viewer)
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uA, uT, uDpr, uSwing, uMix, uCa, uMb, uLine; uniform vec2 uScr; varying vec2 vUv;
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
        // (world-76; computed here since world-85) the edge strip's geometry, used by the hot light below and the swap at the end
        vec2 su = gl_FragCoord.xy / uScr, sd = (su - .5) * uScr;
        // The same for red on the edges that face the middle (the red is read from a pixel farther out: there the room took
        // the black's red, a cyan line). By coverage: the share of the pixel where it is shown that lies outside the face
        // (the face's signed distance in px there, over one pixel), so the part-covered edge pixels get the room's share.
        vec2 uX = dFdx(vUv), uY = dFdy(vUv), pu = vec2(length(vec2(uX.x, uY.x)), length(vec2(uX.y, uY.y))) + 1e-6;   // uv per px
        vec2 sB = sd * uCa, oB = vUv + uX * sB.x + uY * sB.y, oR = vUv - uX * sB.x - uY * sB.y;
        vec2 dB = min(oB, 1. - oB) / pu, dR = min(oR, 1. - oR) / pu;   // px inside the face (negative: outside)
        float kE = smoothstep(uMb + .5, uMb + 2., min(min(dB.x, dB.y), min(dR.x, dR.y)));   // 0 in the strip, 1 past it
        // hot light: white-hot blobs where a second combination of the field peaks (with a thin blue-violet rim, never warm),
        // and dark cores where the third sinks
        float hf = n.g * .55 + n.r * .45 + (hc - .5) * .05;
        // (world-81, alche: white-hot cores fall off through grey into the dark as grain, not a razor edge) the hot tone
        // is a wide ramp, shown as stipple whose density follows it; solid only in the small centre
        // (world-85, the reviewer: the last warm pixels) the edge strip below swaps this pixel's blue (or red) for the room's;
        // a white-hot grain there left as (1, 1, room blue), and the engine's split made it yellow. The hot light and its rim
        // stay out of that strip (and 1.5 px more, the split's bilinear read): there the face is black and red only
        float hot = smoothstep(.53, .615, hf) * kE, hg = hs(floor(gl_FragCoord.xy / (1.5 * uDpr)) + 29.);
        col = mix(col, vec3(1.), max(step(hg, hot), smoothstep(.6, .64, hf) * kE) * .96);
        col += vec3(.3, .26, .95) * (smoothstep(.52, .535, hf) - smoothstep(.538, .548, hf)) * .5 * step(hg, .7) * kE;
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
        float vg = .82 + .18 * (1. - smoothstep(.3, 1.5, length(su - .5) * 1.25));
        col.b = mix(col.b, ${te[2].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dB.x, dB.y))));
        col.r = mix(col.r, ${te[0].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dR.x, dR.y))));
        // (world-85, alche's window: a crisp pure-white line of 3-4 px at 2000 px wide on each long edge, from the moment the
        // face widens until it covers the screen) measured: the visible edge IS this face's u = 0 / 1 edge (and the gate's
        // homography, to .1 px); job 81's line here was painted over by the gate (passage-gate.ts leaves this strip to us now).
        // The engine's split moves red out and blue in by s px, so the line is drawn s px wider on each side: pure white over
        // its whole width, a faint violet hairline on the panel side and a red one on the melt side (the lens's own fringe;
        // the white's blue is never swapped, so no channel mix here can turn warm)
        float sL = length(sB), Lw = max(2., 3.5 * uScr.x / 2000.) + 2. * sL;
        float dU = min(vUv.x, 1. - vUv.x) / pu.x;   // px from the nearer long edge
        // the line's own red / blue where the pixel that shows them takes its other channel from the panel (2 x the split
        // out): the room's values there, so that pixel is a grey hairline of shade, not pink or violet
        vec2 o2B = vUv + 2. * (uX * sB.x + uY * sB.y), o2R = vUv - 2. * (uX * sB.x + uY * sB.y);
        vec2 d2B = min(o2B, 1. - o2B) / pu, d2R = min(o2R, 1. - o2R) / pu;
        vec3 lc = vec3(mix(1., ${te[0].toFixed(5)} * vg, 1. - smoothstep(uMb - .5, uMb + .5, min(d2R.x, d2R.y))), 1.,
          mix(1., ${te[2].toFixed(5)} * vg, 1. - smoothstep(uMb - .5, uMb + .5, min(d2B.x, d2B.y))));
        // (not into the face's short ends: at those corners the split crosses two edges and the swap above would be wrong)
        float dV = min(vUv.y, 1. - vUv.y) / pu.y;
        col = mix(col, lc, (1. - smoothstep(Lw - .5, Lw + .5, dU)) * smoothstep(2. * sL + 1., 2. * sL + 3., dV) * uLine);
        gl_FragColor = vec4(col, uA);
      }`}),k=new oe(L,w);k.renderOrder=1,k.frustumCulled=!1,T.add(k);let ne=!1,ie=c,Q=1,le=0,We=1,Ae=0,ke=0;function $e(){const e=n.viewport;ne=e.portrait,ie=c*e.aspect,g.left=-ie,g.right=ie,g.top=c,g.bottom=-c,g.updateProjectionMatrix(),d.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),d.uniforms.uDpr.value=e.dpr,C.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),C.uniforms.uW.value=2.3*e.dpr,w.uniforms.uAsp.value=e.aspect,w.uniforms.uDpr.value=e.dpr,w.uniforms.uScr.value.set(e.width*e.dpr,e.height*e.dpr);const o=2*c/e.height;ne?(Q=.8*e.width*o/3.87,le=.35,We=.62*2*c/2,Ae=.05,ke=A*.26):(Q=.6*2*c/2*.82,le=-.1,We=Q,Ae=-.1,ke=0)}$e();const f=new Tt(10,1,.005,600),Qe=new y,Ze=new y,Re=new y,E=new y,ue=new y,Je=new y;new me;const Ke=new y,et=new mt,tt=new me,Wt=new y((V(i.a)+V(i.b))/2,(O(i.a)+O(i.b))/2,(se+re)/2),Ue=new y(i.b[0]-i.a[0],i.b[1]-i.a[1],0),ot=Ue.length()/2;Ue.normalize();const at=(se-re)/2;function At(e){if(e<=0){J.camera=g,d.uniforms.uDive.value=0;return}S.updateMatrixWorld(!0);const o=T.matrixWorld,t=S.scale.x;Ze.copy(Wt).applyMatrix4(o),et.getNormalMatrix(o),Re.set(i.n[0],i.n[1],0).applyMatrix3(et).normalize(),E.copy(Ue).transformDirection(o),E.y<0&&E.negate();const a=n.viewport.aspect,r=e,h=Math.tan(25*Math.PI/180),l=Math.min(.7*at*t/a,.7*ot*t),s=Math.exp(Math.log(c)+(Math.log(l)-Math.log(c))*Math.pow(r,1.45)),m=Math.tan(Math.atan(c/xe))+(h-c/xe)*Math.pow(r,.6),u=s/m,v=we.inOut(Math.min(1,r/.6)),x=.45*v+.55*yt(ee(.7,1,r));ue.set(0,0,0).lerp(Ze,v),Qe.crossVectors(E,Re).normalize(),ue.addScaledVector(Qe,-A*.29*at*t*v).addScaledVector(E,-.22*ot*t*v),Je.set(0,0,1).lerp(Re,x).normalize(),f.fov=2*Math.atan(m)*180/Math.PI,f.aspect=a,f.position.copy(ue).addScaledVector(Je,u),Ke.set(0,1,0).lerp(E,v).normalize(),f.up.copy(Ke),f.lookAt(ue),f.near=Math.max(.002,u*.02),f.far=u+60,f.updateProjectionMatrix(),f.updateMatrixWorld(!0),J.camera=f,tt.multiplyMatrices(f.projectionMatrix,f.matrixWorldInverse),d.uniforms.uInvVP.value.copy(tt).invert();const U=n.viewport.height*n.viewport.dpr;d.uniforms.uWpx.value=xe/(xe+Ve)*U/(2*c),d.uniforms.uDive.value=1}const Z=new y,st=[];for(let e=0;e<5;e++)for(let o=0;o<9;o++)st.push([e/4,o/8]);function kt(){W.updateMatrixWorld(!0);const e=J.camera;e.updateMatrixWorld();const o=n.viewport.width,t=n.viewport.height,a=(s,m,u,v)=>(Z.set(s,m,u).applyMatrix4(v).project(e),Z.z<1&&Z.z>-1?[+((Z.x+1)/2*o).toFixed(2),+((1-Z.y)/2*t).toFixed(2)]:null),r=L.getAttribute("position").array,h=[];for(const[s,m]of st){const u=(x,U)=>r[x*3+U],v=x=>(u(0,x)*(1-m)+u(1,x)*m)*(1-s)+(u(3,x)*(1-m)+u(2,x)*m)*s;h.push(a(v(0),v(1),v(2),k.matrixWorld))}const l=[];for(let s=0;s<b.length;s+=12)l.push(a(b[s],b[s+1],b[s+2],$.matrixWorld));globalThis.__greyProbe.face=h,globalThis.__greyProbe.lines=l}const ce=new mt,he=new me,_=new Ce,q=new Ce,P=new Ce,B=new y,j={H:ce,on:0,at:-1};n.gateFace=j;function Rt(e){if(j.on=k.visible?1:0,j.at=e,!j.on)return;const o=J.camera;W.updateMatrixWorld(!0),o.updateMatrixWorld(),he.multiplyMatrices(o.projectionMatrix,o.matrixWorldInverse).multiply(k.matrixWorld);const t=L.getAttribute("position").array,a=l=>B.set(t[l*3],t[l*3+1],t[l*3+2]);a(0),_.set(B.x,B.y,B.z,1).applyMatrix4(he),a(3),P.set(B.x-t[0],B.y-t[1],B.z-t[2],0).applyMatrix4(he),a(1),q.set(B.x-t[0],B.y-t[1],B.z-t[2],0).applyMatrix4(he),ce.set(P.x,q.x,_.x,P.y,q.y,_.y,P.w,q.w,_.w);const r=ce.determinant(),h=Math.hypot(P.x,P.y,P.w)*Math.hypot(q.x,q.y,q.w)*Math.hypot(_.x,_.y,_.w);if(!(Math.abs(r)>1e-6*h)){j.on=0;return}ce.invert(),n.gateFace=j}const De=new y,rt=new gt,nt=new Ct;let R=null,de=0,p=0,M=0,I=0,G=0,Le=-1;const it=new gt,Ut=matchMedia("(prefers-reduced-motion: reduce)");let lt=!1;const J={scene:W,camera:g,light:!0,resize:$e,coolSplit:1,hud:()=>({grey:p.toFixed(3)}),update({p:e,t:o,dt:t,v:a}){w.uniforms.uCa.value=.0025+Math.min(Math.abs(a??0),4)*.006;const r=n.wallMark;r&&e<.05&&(R=r.p>.9?{x:r.x,y:r.y,ppu:r.ppu,q:it.copy(r.q)}:{...r.exit,q:it.identity()}),e>=.3&&(R=null);const h=1-Math.exp(-40*Math.min(t,.1));de+=(e*16/6-de)*h,d.uniforms.uLine.value=de*1.5,d.uniforms.uCross.value=de*.1%1;const l=n.greyVision??globalThis.__greyLines?.vision,s=typeof l=="number"?Math.min(1,Math.max(0,l)):we.inOut(ee(.6,.8,e)),m=Le<0||Math.abs(e-Le)>.15;Le=e;const u=yt(ee(xt[0],xt[1],e));if(m)p=s,I=0,M=u,G=0;else for(let pe=Math.min(t,.1),ut=Math.ceil(pe/.02),ct=0;ct<ut;ct++){const ve=pe/ut;I+=(Y*Y*(s-p)-2*Y*I)*ve,p+=I*ve,G+=(Y*Y*(u-M)-2*Y*G)*ve,M+=G*ve}M=Math.max(M,u-Math.min(1,Math.max(0,(1-e)/.08))),p=Math.min(1,Math.max(0,p)),M=Math.min(1,Math.max(0,M)),Math.abs(s-p)<1e-4&&Math.abs(I)<1e-4&&(p=s,I=0),Math.abs(u-M)<1e-4&&Math.abs(G)<1e-4&&(M=u,G=0),globalThis.__greyProbe={vis:p,p:e,swing:M};const v=Ut.matches;p>0&&(!v||!lt)&&(Be.draw(n.renderer,v?0:o),lt=!0),w.uniforms.uT.value=v?0:o;const x=globalThis.__greyMix;w.uniforms.uMix.value=x===0||x===2?x:1;const U=M;w.uniforms.uA.value=Math.max(wt.smoothstep(p,0,.1),U),k.visible=p>0,C.uniforms.uF.value=k.visible?w.uniforms.uA.value:0,w.uniforms.uSwing.value=U,w.uniforms.uLine.value=n.gateBusy?0:wt.smoothstep(U,0,.05);const Dt=(ne?78:30)*Math.PI/180,Lt=-(ne?8:5.7)*Math.PI/180;nt.set(Lt*p,A*Dt*p,0),rt.setFromEuler(nt),T.quaternion.copy(rt),C.uniforms.uA.value=1,$.visible=!0,d.uniforms.uVig.value=1;const _e=we.inOut(ee(.3,1,p)),qe=Q+(We-Q)*_e,Pe=le+(Ae-le)*_e,Te=ke*_e,K=R?1-we.inOut(ee(0,.3,e)):0;if(R&&K>0){De.set(R.x*ie,R.y*c,0);const pe=R.ppu*2*c/n.viewport.height;S.position.set(Te+(De.x-Te)*K,Pe+(De.y-Pe)*K,0),S.scale.setScalar(qe+(pe-qe)*K),S.quaternion.identity().slerp(R.q,K)}else S.position.set(Te,Pe,0),S.scale.setScalar(qe),S.quaternion.identity();At(U),Rt(o),globalThis.__greyProbeOn&&kt()},dispose(){z.dispose(),D.dispose(),C.dispose(),L.dispose(),w.dispose(),d.dispose(),Be.dispose(),Se.material.dispose(),f.clear()}};return J};export{Yt as default};
