import{S as Mt,F as Ft,b as be,T as fe,B as ze,M as oe,a as Bt,Z as we,G as dt,m as Dt,e as _t,E as qt,_ as pt,$ as ge,a0 as vt,a1 as mt,P as Lt,k as y,a2 as ft,V as Ve,W as zt,z as wt,Q as gt,s as xt,n as Vt,p as xe,r as te}from"./EditionWorld.astro_astro_type_script_index_0_lang.CiWFhTcm.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const j=[215,219,220].map(r=>Math.pow(Math.min(1,r*1.027/255),2.2)),c=4,Et=.8,Ee=3,yt=[.7,.9],I=1.8,bt=r=>.5-.5*Math.cos(Math.PI*r),ye=2e3;function Ot(){const r=new zt(64,64,{minFilter:wt,magFilter:wt,depthBuffer:!1}),W=new be({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
      }`}),g=new Mt,ae=new Ft(-1,1,1,-1,0,1),k=new oe(new Bt(2,2),W);return k.frustumCulled=!1,g.add(k),{texture:r.texture,draw(p,N){W.uniforms.uT.value=N;const $=p.getRenderTarget();p.setRenderTarget(r),p.render(g,ae),p.setRenderTarget($)},dispose(){r.dispose(),W.dispose(),k.geometry.dispose()}}}const It=r=>{const W=new Mt,g=new Ft(-c,c,c,-c,.1,100);g.position.set(0,0,20),g.lookAt(0,0,0);const ae=r.lang==="ar",k=ae?-1:1,p=new be({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new ze(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new fe},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {   // (world-52) the dive: the grid and its crosses lie on a plane behind the mark (z ${-Ee}); the moving camera's ray meets it (equal to the flat picture at the dive's start)
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${Ee.toFixed(1)} - a.z) / (b.z - a.z);
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
        vec3 col = vec3(${j.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * (1. - smoothstep(.3, 1.5, r * 1.25)), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),N=new oe(new Bt(2,2),p);N.frustumCulled=!1,N.renderOrder=-10,W.add(N);let $=1e9,Me=-1e9,Fe=1e9,Be=-1e9;for(const e of we)for(const[o,t]of e)$=Math.min($,o),Me=Math.max(Me,o),Fe=Math.min(Fe,t),Be=Math.max(Be,t);const Oe=($+Me)/2,Ye=(Fe+Be)/2;let F=null;const St=ae?[we[we.length-1]]:[we[0]];for(const e of St){let o=0;e.forEach(([t,a],l)=>{const[n,h]=e[(l+1)%e.length];o+=t*h-n*a}),e.forEach((t,a)=>{const l=e[(a+1)%e.length],n=l[0]-t[0],h=l[1]-t[1],s=Math.hypot(n,h),u=o>0?[h/s,-n/s]:[-h/s,n/s],m=s*u[0]*k*-1;(!F||m>F.score)&&(F={a:t,b:l,n:u,score:m})})}function Wt(){const e=F.a[0]-Oe,o=F.a[1]-Ye,t=F.b[0]-F.a[0],a=F.b[1]-F.a[1],l=t*t+a*a;return(n,h)=>{const s=Math.min(1,Math.max(0,((n-e)*t+(h-o)*a)/l));return Math.hypot(n-e-s*t,h-o-s*a)<.001}}const B=new dt;W.add(B);const q=new dt;B.add(q);const L=Dt(Et,!1,0,"now"),Se=new oe(L,new _t({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));Se.renderOrder=0,q.add(Se);const b=new qt(L,20).getAttribute("position").array,X=b.length/6,He=new Float32Array(X*12),Ge=new Float32Array(X*12),je=new Float32Array(X*8),Ie=new Float32Array(X*4),Ne=[],$e=Wt();for(let e=0;e<X;e++){const o=$e(b[e*6],b[e*6+1])&&$e(b[e*6+3],b[e*6+4])?1:0;for(let a=0;a<4;a++)He.set(b.subarray(e*6,e*6+3),(e*4+a)*3),Ge.set(b.subarray(e*6+3,e*6+6),(e*4+a)*3),je.set([a<2?0:1,a%2?1:-1],(e*4+a)*2),Ie[e*4+a]=o;const t=e*4;Ne.push(t,t+1,t+3,t,t+3,t+2)}const U=new pt;U.setAttribute("position",new ge(He,3)),U.setAttribute("aB",new ge(Ge,3)),U.setAttribute("aS",new ge(je,2)),U.setAttribute("aF",new ge(Ie,1)),U.setIndex(Ne);const z=new be({side:vt,transparent:!0,uniforms:{uRes:{value:new ze(1,1)},uW:{value:1.5},uA:{value:1},uF:{value:0}},vertexShader:`
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
      }`,fragmentShader:"uniform float uW, uA; varying float vE, vF; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA * vF); }"}),Q=new oe(U,z);Q.frustumCulled=!1,Q.renderOrder=2,q.add(Q),L.computeBoundingBox();const i=F,se=L.boundingBox.max.z,ne=L.boundingBox.min.z,Xe=.004,V=e=>e[0]-Oe+i.n[0]*Xe,E=e=>e[1]-Ye+i.n[1]*Xe,P=new pt;P.setAttribute("position",new mt([V(i.a),E(i.a),se,V(i.b),E(i.b),se,V(i.b),E(i.b),ne,V(i.a),E(i.a),ne],3)),P.setAttribute("uv",new mt([0,0,0,1,1,1,1,0],2)),P.setIndex([0,1,2,0,2,3]);const We=Ot(),f=new be({transparent:!0,depthWrite:!1,side:vt,uniforms:{tN:{value:We.texture},uDpr:{value:1},uFlip:{value:k>0?1:0},uFlipY:{value:i.a[1]>i.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0},uMix:{value:1},uScr:{value:new ze(1,1)},uCa:{value:.0025},uCool:{value:1},uMb:{value:.4},uLine:{value:0}},vertexShader:`
      uniform float uSwing, uAsp, uFlip, uFlipY; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        // the swing out (alche's vision → service): the face's corners go to the screen's corners
        gl_Position = p;   // (world-52) the band stays where it stands; the camera dives into it (no flat plate flying at the viewer)
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uA, uT, uDpr, uSwing, uMix, uCa, uMb, uLine, uCool; uniform vec2 uScr; varying vec2 vUv;
      float hs(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      // (world-87) the window's edge line across one channel, d px in from the long edge: the panel's value for the outer a px,
      // a dark edge of e px (the panel's, 20 % down: neutral, never warm), white of w px, then the melt's value m
      float lineT(float d, float m, float p, float a, float e, float w, float h){
        float v = mix(p, p * .8, smoothstep(a - .5, a + .5, d));
        v = mix(v, h, smoothstep(a + e - .5, a + e + .5, d));
        return mix(v, m, smoothstep(a + e + w - .5, a + e + w + .5, d));
      }
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
        col.b = mix(col.b, ${j[2].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dB.x, dB.y))));
        col.r = mix(col.r, ${j[0].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dR.x, dR.y))));
        // (world-87, alche's window: measured on his frames at 2000 px wide: a solid pure-white band of 5 px on each long edge,
        // ~21 levels over his panel, a ~1 px darker edge between them; gate-edge-measure-r5.txt) The engine's split (grab) shows
        // each pixel's red and blue at other places (sB: here + / - the split); job 85 drew the line before it, so its white
        // core moved in and its rims took colour, and the gate's own line sat elsewhere. Now the line is built per channel for
        // where that channel is SHOWN: each channel takes the line's value at its shown place (panel outside, then dark edge,
        // white, melt), so after the split all three agree pixel for pixel: one neutral line at any scroll speed. The outermost
        // lA px (where one channel is read from the real panel) are panel in all three. The gate shows these pixels as they
        // are (passage-gate.ts), so there is one line, never a hand-over. White is set from the panel (lH)
        float lW = max(2., 5.5 * uScr.x / 2000.), lE = max(1., uScr.x / 2000.);   // the white's and the dark edge's px
        float dU = min(vUv.x, 1. - vUv.x) / pu.x;   // px from the nearer long edge
        float dUB = min(oB.x, 1. - oB.x) / pu.x, dUR = min(oR.x, 1. - oR.x) / pu.x;   // the same where this pixel's blue / red is shown
        float lA = abs(dUB - dU);   // the split's reach across the edge here
        vec3 lP = vec3(${j[0].toFixed(5)}, ${j[1].toFixed(5)}, ${j[2].toFixed(5)}) * vg;   // the room's values (the panel)
        // the white: his line stands ~21 levels over his panel (ours is darker: 217 to his 233), so ours is set ~27 levels over
        // the panel as it reaches the screen (the engine's vignette, then its tone map, which leaves 1.0 at ~240: inverted here)
        float eV = mix(1., 1. - smoothstep(.35, 1.25, length((su - .5) * vec2(uScr.x / uScr.y, 1.))), .55);   // engine.ts's vignette
        float pY = dot(lP, vec3(.2126, .7152, .0722)) * eV;
        pY = pY > .76 ? 1. - .0576 / (pY - .52) : pY;   // (Neutral tone map, a grey: above its knee .76)
        float wS = min(1.055 * pow(max(pY, 1e-4), 1. / 2.4) - .055 + 22. / 255., .985);   // the panel in sRGB + 22 levels (measured: lands ~27 over the real panel)
        float wY = pow((wS + .055) / 1.055, 2.4);
        float lH = (wY > .76 ? .52 + .0576 / (1. - wY) : wY) / eV;   // back through the tone map and the vignette (1 - wY >= .03)
        // (not into the face's short ends: at those corners the split crosses two edges) the line fades out near each short end,
        // and each channel takes that fade where it is SHOWN too (else it keeps the face's own value, whose swap above already
        // gives the room's value past an end): a channel carried across an end is never the line's white on the panel
        float sL = length(sB), eA = 2. * sL + 1., eB = 2. * sL + 3.;
        float wG = smoothstep(eA, eB, min(vUv.y, 1. - vUv.y) / pu.y) * uLine;
        float wR = smoothstep(eA, eB, min(oR.y, 1. - oR.y) / pu.y) * uLine, wB = smoothstep(eA, eB, min(oB.y, 1. - oB.y) / pu.y) * uLine;
        vec3 tO = mix(col, vec3(lineT(dU, col.r, lP.r, lA, lE, lW, lH), lineT(dU, col.g, lP.g, lA, lE, lW, lH), lineT(dU, col.b, lP.b, lA, lE, lW + .8, lH)), wG);   // the line as it should look here
        float cR = mix(col.r, lineT(dUR, col.r, lP.r, lA, lE, lW, lH), wR), cB = mix(col.b, lineT(dUB, col.b, lP.b, lA, lE, lW + .8, lH), wB);
        // (blue's white reaches .8 px further into the melt: the split's linear read left the white's inner rim pixel short of
        // blue on the edge facing the middle, a pale yellow (hue 59); now that rim can only lean cool)
        // the engine's cool cut (grab: green falls with red or blue where the split lowers them) is paid in advance on green
        // (only up to the white's inner rim: past it the melt's per-pixel grain makes the prediction wrong, and the engine's own
        // cut keeps that rim red or blue-violet, never yellow)
        // (and only where the line is whole in all three channels: at its ends and while it fades in the same holds)
        float kC = (1. - smoothstep(lA + lE + lW - 1.5, lA + lE + lW - .5, dU)) * step(.999, min(wG, min(wR, wB)));
        float cG = tO.g - min(0., min(tO.r - cR, tO.b - cB)) * uCool * kC;
        col = vec3(cR, cG, cB);
        gl_FragColor = vec4(col, uA);
      }`}),A=new oe(P,f);A.renderOrder=1,A.frustumCulled=!1,q.add(A);let re=!1,ie=c,Z=1,le=0,ke=1,Ae=0,Re=0;function Qe(){const e=r.viewport;re=e.portrait,ie=c*e.aspect,g.left=-ie,g.right=ie,g.top=c,g.bottom=-c,g.updateProjectionMatrix(),p.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),p.uniforms.uDpr.value=e.dpr,z.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),z.uniforms.uW.value=2.3*e.dpr,f.uniforms.uAsp.value=e.aspect,f.uniforms.uDpr.value=e.dpr,f.uniforms.uScr.value.set(e.width*e.dpr,e.height*e.dpr);const o=2*c/e.height;re?(Z=.8*e.width*o/3.87,le=.35,ke=.62*2*c/2,Ae=.05,Re=k*.26):(Z=.6*2*c/2*.82,le=-.1,ke=Z,Ae=-.1,Re=0)}Qe();const w=new Lt(10,1,.005,600),Ze=new y,Je=new y,Ue=new y,O=new y,he=new y,Ke=new y;new fe;const et=new y,tt=new ft,ot=new fe,kt=new y((V(i.a)+V(i.b))/2,(E(i.a)+E(i.b))/2,(se+ne)/2),Pe=new y(i.b[0]-i.a[0],i.b[1]-i.a[1],0),at=Pe.length()/2;Pe.normalize();const st=(se-ne)/2;function At(e){if(e<=0){K.camera=g,p.uniforms.uDive.value=0;return}B.updateMatrixWorld(!0);const o=q.matrixWorld,t=B.scale.x;Je.copy(kt).applyMatrix4(o),tt.getNormalMatrix(o),Ue.set(i.n[0],i.n[1],0).applyMatrix3(tt).normalize(),O.copy(Pe).transformDirection(o),O.y<0&&O.negate();const a=r.viewport.aspect,l=e,n=Math.tan(25*Math.PI/180),h=Math.min(.7*st*t/a,.7*at*t),s=Math.exp(Math.log(c)+(Math.log(h)-Math.log(c))*Math.pow(l,1.45)),u=Math.tan(Math.atan(c/ye))+(n-c/ye)*Math.pow(l,.6),m=s/u,d=xe.inOut(Math.min(1,l/.6)),x=.45*d+.55*bt(te(.7,1,l));he.set(0,0,0).lerp(Je,d),Ze.crossVectors(O,Ue).normalize(),he.addScaledVector(Ze,-k*.29*st*t*d).addScaledVector(O,-.22*at*t*d),Ke.set(0,0,1).lerp(Ue,x).normalize(),w.fov=2*Math.atan(u)*180/Math.PI,w.aspect=a,w.position.copy(he).addScaledVector(Ke,m),et.set(0,1,0).lerp(O,d).normalize(),w.up.copy(et),w.lookAt(he),w.near=Math.max(.002,m*.02),w.far=m+60,w.updateProjectionMatrix(),w.updateMatrixWorld(!0),K.camera=w,ot.multiplyMatrices(w.projectionMatrix,w.matrixWorldInverse),p.uniforms.uInvVP.value.copy(ot).invert();const _=r.viewport.height*r.viewport.dpr;p.uniforms.uWpx.value=ye/(ye+Ee)*_/(2*c),p.uniforms.uDive.value=1}const J=new y,nt=[];for(let e=0;e<5;e++)for(let o=0;o<9;o++)nt.push([e/4,o/8]);function Rt(){W.updateMatrixWorld(!0);const e=K.camera;e.updateMatrixWorld();const o=r.viewport.width,t=r.viewport.height,a=(s,u,m,d)=>(J.set(s,u,m).applyMatrix4(d).project(e),J.z<1&&J.z>-1?[+((J.x+1)/2*o).toFixed(2),+((1-J.y)/2*t).toFixed(2)]:null),l=P.getAttribute("position").array,n=[];for(const[s,u]of nt){const m=(x,_)=>l[x*3+_],d=x=>(m(0,x)*(1-u)+m(1,x)*u)*(1-s)+(m(3,x)*(1-u)+m(2,x)*u)*s;n.push(a(d(0),d(1),d(2),A.matrixWorld))}const h=[];for(let s=0;s<b.length;s+=12)h.push(a(b[s],b[s+1],b[s+2],Q.matrixWorld));globalThis.__greyProbe.face=n,globalThis.__greyProbe.lines=h}const ce=new ft,ue=new fe,T=new Ve,C=new Ve,D=new Ve,S=new y,Y={H:ce,on:0,at:-1};r.gateFace=Y;function Ut(e){if(Y.on=A.visible?1:0,Y.at=e,!Y.on)return;const o=K.camera;W.updateMatrixWorld(!0),o.updateMatrixWorld(),ue.multiplyMatrices(o.projectionMatrix,o.matrixWorldInverse).multiply(A.matrixWorld);const t=P.getAttribute("position").array,a=h=>S.set(t[h*3],t[h*3+1],t[h*3+2]);a(0),T.set(S.x,S.y,S.z,1).applyMatrix4(ue),a(3),D.set(S.x-t[0],S.y-t[1],S.z-t[2],0).applyMatrix4(ue),a(1),C.set(S.x-t[0],S.y-t[1],S.z-t[2],0).applyMatrix4(ue),ce.set(D.x,C.x,T.x,D.y,C.y,T.y,D.w,C.w,T.w);const l=ce.determinant(),n=Math.hypot(D.x,D.y,D.w)*Math.hypot(C.x,C.y,C.w)*Math.hypot(T.x,T.y,T.w);if(!(Math.abs(l)>1e-6*n)){Y.on=0;return}ce.invert(),r.gateFace=Y}const Te=new y,rt=new gt,it=new Vt;let R=null,de=0,v=0,M=0,H=0,G=0,Ce=-1;const lt=new gt,Pt=matchMedia("(prefers-reduced-motion: reduce)");let ht=!1;const K={scene:W,camera:g,light:!0,resize:Qe,coolSplit:1,hud:()=>({grey:v.toFixed(3)}),update({p:e,t:o,dt:t,v:a}){const l=r.split;f.uniforms.uCa.value=(l?l.ca0:.0025)+Math.min(Math.abs(a??0),4)*.006,f.uniforms.uCool.value=l?l.cool:1;const n=r.wallMark;n&&e<.05&&(R=n.p>.9?{x:n.x,y:n.y,ppu:n.ppu,q:lt.copy(n.q)}:{...n.exit,q:lt.identity()}),e>=.3&&(R=null);const h=1-Math.exp(-40*Math.min(t,.1));de+=(e*16/6-de)*h,p.uniforms.uLine.value=de*1.5,p.uniforms.uCross.value=de*.1%1;const s=r.greyVision??globalThis.__greyLines?.vision,u=typeof s=="number"?Math.min(1,Math.max(0,s)):xe.inOut(te(.6,.8,e)),m=Ce<0||Math.abs(e-Ce)>.15;Ce=e;const d=bt(te(yt[0],yt[1],e));if(m)v=u,H=0,M=d,G=0;else for(let ve=Math.min(t,.1),ct=Math.ceil(ve/.02),ut=0;ut<ct;ut++){const me=ve/ct;H+=(I*I*(u-v)-2*I*H)*me,v+=H*me,G+=(I*I*(d-M)-2*I*G)*me,M+=G*me}M=Math.max(M,d-Math.min(1,Math.max(0,(1-e)/.08))),v=Math.min(1,Math.max(0,v)),M=Math.min(1,Math.max(0,M)),Math.abs(u-v)<1e-4&&Math.abs(H)<1e-4&&(v=u,H=0),Math.abs(d-M)<1e-4&&Math.abs(G)<1e-4&&(M=d,G=0),globalThis.__greyProbe={vis:v,p:e,swing:M};const x=Pt.matches;v>0&&(!x||!ht)&&(We.draw(r.renderer,x?0:o),ht=!0),f.uniforms.uT.value=x?0:o;const _=globalThis.__greyMix;f.uniforms.uMix.value=_===0||_===2?_:1;const pe=M;f.uniforms.uA.value=Math.max(xt.smoothstep(v,0,.1),pe),A.visible=v>0,z.uniforms.uF.value=A.visible?f.uniforms.uA.value:0,f.uniforms.uSwing.value=pe,f.uniforms.uLine.value=xt.smoothstep(pe,0,.05);const Tt=(re?78:30)*Math.PI/180,Ct=-(re?8:5.7)*Math.PI/180;it.set(Ct*v,k*Tt*v,0),rt.setFromEuler(it),q.quaternion.copy(rt),z.uniforms.uA.value=1,Q.visible=!0,p.uniforms.uVig.value=1;const De=xe.inOut(te(.3,1,v)),_e=Z+(ke-Z)*De,qe=le+(Ae-le)*De,Le=Re*De,ee=R?1-xe.inOut(te(0,.3,e)):0;if(R&&ee>0){Te.set(R.x*ie,R.y*c,0);const ve=R.ppu*2*c/r.viewport.height;B.position.set(Le+(Te.x-Le)*ee,qe+(Te.y-qe)*ee,0),B.scale.setScalar(_e+(ve-_e)*ee),B.quaternion.identity().slerp(R.q,ee)}else B.position.set(Le,qe,0),B.scale.setScalar(_e),B.quaternion.identity();At(pe),Ut(o),globalThis.__greyProbeOn&&Rt()},dispose(){L.dispose(),U.dispose(),z.dispose(),P.dispose(),f.dispose(),p.dispose(),We.dispose(),Se.material.dispose(),w.clear()}};return K};export{It as default};
