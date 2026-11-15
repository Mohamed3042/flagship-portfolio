import{S as kt,F as Pt,b as Te,T as Se,B as Ge,M as pe,a as Rt,Z as We,G as gt,m as Lt,e as zt,E as Vt,_ as xt,$ as ke,a0 as yt,a1 as bt,P as Et,k as M,a2 as Mt,V as G,W as Ot,z as Ft,Q as At,s as Bt,n as Yt,p as Pe,r as de}from"./EditionWorld.astro_astro_type_script_index_0_lang.BpOmpLhi.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ee=[215,219,220].map(c=>Math.pow(Math.min(1,c*1.027/255),2.2)),p=4,Ht=.8,je=3,St=[.7,.9],te=1.8,Wt=c=>.5-.5*Math.cos(Math.PI*c),Re=2e3;function Gt(){const c=new Ot(64,64,{minFilter:Ft,magFilter:Ft,depthBuffer:!1}),R=new Te({depthTest:!1,depthWrite:!1,uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
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
      }`}),y=new kt,me=new Pt(-1,1,1,-1,0,1),T=new pe(new Rt(2,2),R);return T.frustumCulled=!1,y.add(T),{texture:c.texture,draw(v,ae){R.uniforms.uT.value=ae;const oe=v.getRenderTarget();v.setRenderTarget(c),v.render(y,me),v.setRenderTarget(oe)},dispose(){c.dispose(),R.dispose(),T.geometry.dispose()}}}const Qt=c=>{const R=new kt,y=new Pt(-p,p,p,-p,.1,100);y.position.set(0,0,20),y.lookAt(0,0,0);const me=c.lang==="ar",T=me?-1:1,v=new Te({depthTest:!1,depthWrite:!1,uniforms:{uRes:{value:new Ge(1,1)},uDpr:{value:1},uLine:{value:0},uCross:{value:0},uVig:{value:1},uDive:{value:0},uInvVP:{value:new Se},uWpx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uDpr, uLine, uCross, uVig, uDive, uWpx; uniform mat4 uInvVP; varying vec2 vUv;
      void main(){
        float L = max(uRes.x, uRes.y), cell = L / 64.;
        vec2 px = (vUv - .5) * uRes;
        float gone = 0.;
        if (uDive > 0.) {   // (world-52) the dive: the grid and its crosses lie on a plane behind the mark (z ${-je}); the moving camera's ray meets it (equal to the flat picture at the dive's start)
          vec4 a = uInvVP * vec4(vUv * 2. - 1., -1., 1.), b = uInvVP * vec4(vUv * 2. - 1., 1., 1.); a /= a.w; b /= b.w;
          float tz = (-${je.toFixed(1)} - a.z) / (b.z - a.z);
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
        vec3 col = vec3(${ee.map(e=>e.toFixed(5)).join(", ")});
        col = mix(col, vec3(0.), line * .02 * (1. - gone));
        col = mix(col, vec3(0.), plus * .2 * (1. - gone));
        float r = length(vUv - .5);
        col *= mix(1., .82 + .18 * (1. - smoothstep(.3, 1.5, r * 1.25)), uVig);
        gl_FragColor = vec4(col, 1.);
      }`}),ae=new pe(new Rt(2,2),v);ae.frustumCulled=!1,ae.renderOrder=-10,R.add(ae);let oe=1e9,Ue=-1e9,_e=1e9,Ce=-1e9;for(const e of We)for(const[n,t]of e)oe=Math.min(oe,n),Ue=Math.max(Ue,n),_e=Math.min(_e,t),Ce=Math.max(Ce,t);const Ie=(oe+Ue)/2,Ne=(_e+Ce)/2;let S=null;const Tt=me?[We[We.length-1]]:[We[0]];for(const e of Tt){let n=0;e.forEach(([t,r],i)=>{const[s,m]=e[(i+1)%e.length];n+=t*m-s*r}),e.forEach((t,r)=>{const i=e[(r+1)%e.length],s=i[0]-t[0],m=i[1]-t[1],l=Math.hypot(s,m),o=n>0?[m/l,-s/l]:[-m/l,s/l],a=l*o[0]*T*-1;(!S||a>S.score)&&(S={a:t,b:i,n:o,score:a})})}function Ut(){const e=S.a[0]-Ie,n=S.a[1]-Ne,t=S.b[0]-S.a[0],r=S.b[1]-S.a[1],i=t*t+r*r;return(s,m)=>{const l=Math.min(1,Math.max(0,((s-e)*t+(m-n)*r)/i));return Math.hypot(s-e-l*t,m-n-l*r)<.001}}const W=new gt;R.add(W);const j=new gt;W.add(j);const I=Lt(Ht,!1,0,"now"),De=new pe(I,new zt({colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2}));De.renderOrder=0,j.add(De);const F=new Vt(I,20).getAttribute("position").array,se=F.length/6,$e=new Float32Array(se*12),Qe=new Float32Array(se*12),Xe=new Float32Array(se*8),Ze=new Float32Array(se*4),Je=[],Ke=Ut();for(let e=0;e<se;e++){const n=Ke(F[e*6],F[e*6+1])&&Ke(F[e*6+3],F[e*6+4])?1:0;for(let r=0;r<4;r++)$e.set(F.subarray(e*6,e*6+3),(e*4+r)*3),Qe.set(F.subarray(e*6+3,e*6+6),(e*4+r)*3),Xe.set([r<2?0:1,r%2?1:-1],(e*4+r)*2),Ze[e*4+r]=n;const t=e*4;Je.push(t,t+1,t+3,t,t+3,t+2)}const O=new xt;O.setAttribute("position",new ke($e,3)),O.setAttribute("aB",new ke(Qe,3)),O.setAttribute("aS",new ke(Xe,2)),O.setAttribute("aF",new ke(Ze,1)),O.setIndex(Je);const N=new Te({side:yt,transparent:!0,uniforms:{uRes:{value:new Ge(1,1)},uW:{value:1.5},uA:{value:1},uF:{value:0}},vertexShader:`
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
      }`,fragmentShader:"uniform float uW, uA; varying float vE, vF; void main(){ float h = (uW * 3. + 1.) * .5, x = abs(vE) * h; float a = smoothstep(uW * .5 + .6, uW * .5 - .6, x) + .32 * (1. - smoothstep(0., h, x)); gl_FragColor = vec4(1., 1., 1., min(a, 1.) * uA * vF); }"}),ne=new pe(O,N);ne.frustumCulled=!1,ne.renderOrder=2,j.add(ne),I.computeBoundingBox();const u=S,ve=I.boundingBox.max.z,fe=I.boundingBox.min.z,et=.004,$=e=>e[0]-Ie+u.n[0]*et,Q=e=>e[1]-Ne+u.n[1]*et,Y=new xt;Y.setAttribute("position",new bt([$(u.a),Q(u.a),ve,$(u.b),Q(u.b),ve,$(u.b),Q(u.b),fe,$(u.a),Q(u.a),fe],3)),Y.setAttribute("uv",new bt([0,0,0,1,1,1,1,0],2)),Y.setIndex([0,1,2,0,2,3]);const qe=Gt(),g=new Te({transparent:!0,depthWrite:!1,side:yt,uniforms:{tN:{value:qe.texture},uDpr:{value:1},uFlip:{value:T>0?1:0},uFlipY:{value:u.a[1]>u.b[1]?1:0},uA:{value:0},uSwing:{value:0},uAsp:{value:1},uT:{value:0},uMix:{value:1},uScr:{value:new Ge(1,1)},uCa:{value:.0025},uCool:{value:1},uMb:{value:.4},uLine:{value:0}},vertexShader:`
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
        col.b = mix(col.b, ${ee[2].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dB.x, dB.y))));
        col.r = mix(col.r, ${ee[0].toFixed(5)} * vg, (1. - smoothstep(uMb - .5, uMb + .5, min(dR.x, dR.y))));
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
        vec3 lP = vec3(${ee[0].toFixed(5)}, ${ee[1].toFixed(5)}, ${ee[2].toFixed(5)}) * vg;   // the room's values (the panel)
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
      }`}),q=new pe(Y,g);q.renderOrder=1,q.frustumCulled=!1,j.add(q);let we=!1,ge=p,re=1,xe=0,Le=1,ze=0,Ve=0;function tt(){const e=c.viewport;we=e.portrait,ge=p*e.aspect,y.left=-ge,y.right=ge,y.top=p,y.bottom=-p,y.updateProjectionMatrix(),v.uniforms.uRes.value.set(e.width*e.dpr,e.height*e.dpr),v.uniforms.uDpr.value=e.dpr,N.uniforms.uRes.value.set(e.width*e.dpr/2,e.height*e.dpr/2),N.uniforms.uW.value=2.3*e.dpr,g.uniforms.uAsp.value=e.aspect,g.uniforms.uDpr.value=e.dpr,g.uniforms.uScr.value.set(e.width*e.dpr,e.height*e.dpr);const n=2*p/e.height;we?(re=.8*e.width*n/3.87,xe=.35,Le=.62*2*p/2,ze=.05,Ve=T*.26):(re=.6*2*p/2*.82,xe=-.1,Le=re,ze=-.1,Ve=0)}tt();const x=new Et(10,1,.005,600),at=new M,ot=new M,Ee=new M,X=new M,ye=new M,st=new M;new Se;const nt=new M,rt=new Mt,it=new Se,_t=new M(($(u.a)+$(u.b))/2,(Q(u.a)+Q(u.b))/2,(ve+fe)/2),Oe=new M(u.b[0]-u.a[0],u.b[1]-u.a[1],0),lt=Oe.length()/2;Oe.normalize();const ht=(ve-fe)/2;function Ct(e){if(e<=0){ce.camera=y,v.uniforms.uDive.value=0;return}W.updateMatrixWorld(!0);const n=j.matrixWorld,t=W.scale.x;ot.copy(_t).applyMatrix4(n),rt.getNormalMatrix(n),Ee.set(u.n[0],u.n[1],0).applyMatrix3(rt).normalize(),X.copy(Oe).transformDirection(n),X.y<0&&X.negate();const r=c.viewport.aspect,i=e,s=Math.tan(25*Math.PI/180),m=Math.min(.7*ht*t/r,.7*lt*t),l=Math.exp(Math.log(p)+(Math.log(m)-Math.log(p))*Math.pow(i,1.45)),o=Math.tan(Math.atan(p/Re))+(s-p/Re)*Math.pow(i,.6),a=l/o,h=Pe.inOut(Math.min(1,i/.6)),d=.45*h+.55*Wt(de(.7,1,i));ye.set(0,0,0).lerp(ot,h),at.crossVectors(X,Ee).normalize(),ye.addScaledVector(at,-T*.29*ht*t*h).addScaledVector(X,-.22*lt*t*h),st.set(0,0,1).lerp(Ee,d).normalize(),x.fov=2*Math.atan(o)*180/Math.PI,x.aspect=r,x.position.copy(ye).addScaledVector(st,a),nt.set(0,1,0).lerp(X,h).normalize(),x.up.copy(nt),x.lookAt(ye),x.near=Math.max(.002,a*.02),x.far=a+60,x.updateProjectionMatrix(),x.updateMatrixWorld(!0),ce.camera=x,it.multiplyMatrices(x.projectionMatrix,x.matrixWorldInverse),v.uniforms.uInvVP.value.copy(it).invert();const b=c.viewport.height*c.viewport.dpr;v.uniforms.uWpx.value=Re/(Re+je)*b/(2*p),v.uniforms.uDive.value=1}const ie=new M,ct=[];for(let e=0;e<5;e++)for(let n=0;n<9;n++)ct.push([e/4,n/8]);function Dt(){R.updateMatrixWorld(!0);const e=ce.camera;e.updateMatrixWorld();const n=c.viewport.width,t=c.viewport.height,r=(l,o,a,h)=>(ie.set(l,o,a).applyMatrix4(h).project(e),ie.z<1&&ie.z>-1?[+((ie.x+1)/2*n).toFixed(2),+((1-ie.y)/2*t).toFixed(2)]:null),i=Y.getAttribute("position").array,s=[];for(const[l,o]of ct){const a=(d,b)=>i[d*3+b],h=d=>(a(0,d)*(1-o)+a(1,d)*o)*(1-l)+(a(3,d)*(1-o)+a(2,d)*o)*l;s.push(r(h(0),h(1),h(2),q.matrixWorld))}const m=[];for(let l=0;l<F.length;l+=12)m.push(r(F[l],F[l+1],F[l+2],ne.matrixWorld));globalThis.__greyProbe.face=s,globalThis.__greyProbe.lines=m}const be=new Mt,Me=new Se,A=new G,U=new G,_=new G,k=new M,f={H:be,on:0,at:-1,box:[0,0,1,1],share:0},H=[new G,new G,new G,new G],le=new Float64Array(8),he=new Float64Array(8);c.gateFace=f;function qt(e){if(f.on=q.visible?1:0,f.at=e,!f.on)return;const n=ce.camera;R.updateMatrixWorld(!0),n.updateMatrixWorld(),Me.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(q.matrixWorld);const t=Y.getAttribute("position").array,r=o=>k.set(t[o*3],t[o*3+1],t[o*3+2]);r(0),A.set(k.x,k.y,k.z,1).applyMatrix4(Me),r(3),_.set(k.x-t[0],k.y-t[1],k.z-t[2],0).applyMatrix4(Me),r(1),U.set(k.x-t[0],k.y-t[1],k.z-t[2],0).applyMatrix4(Me),be.set(_.x,U.x,A.x,_.y,U.y,A.y,_.w,U.w,A.w),H[0].copy(A),H[1].copy(A).add(_),H[2].copy(A).add(_).add(U),H[3].copy(A).add(U);const i=1e-5;let s=0;for(let o=0;o<4;o++){const a=H[o],h=H[(o+1)%4];if(a.w>i&&(le[s]=a.x/a.w,he[s++]=a.y/a.w),a.w>i!=h.w>i){const d=(i-a.w)/(h.w-a.w);le[s]=(a.x+(h.x-a.x)*d)/i,he[s++]=(a.y+(h.y-a.y)*d)/i}}if(s>=3){let o=1e9,a=1e9,h=-1e9,d=-1e9,b=1e9,C=-1e9;for(let P=0;P<s;P++){const V=le[P],D=he[P],ue=le[(P+1)%s],K=he[(P+1)%s];if(o=Math.min(o,V),h=Math.max(h,V),a=Math.min(a,D),d=Math.max(d,D),D<=0!=K<=0){const E=V+(ue-V)*(0-D)/(K-D);b=Math.min(b,E),C=Math.max(C,E)}}const z=P=>Math.min(1,Math.max(0,(P+1)/2));f.box[0]=z(o),f.box[1]=z(a),f.box[2]=z(h),f.box[3]=z(d),f.share=C>b?z(C)-z(b):f.box[2]-f.box[0]}const m=be.determinant(),l=Math.hypot(_.x,_.y,_.w)*Math.hypot(U.x,U.y,U.w)*Math.hypot(A.x,A.y,A.w);if(!(Math.abs(m)>1e-6*l)){f.on=0;return}be.invert(),globalThis.__gateProbe&&(globalThis.__gateFaceQA={share:f.share,box:[...f.box],minW:Math.min(...H.map(o=>o.w)),poly:Array.from({length:s},(o,a)=>[le[a],he[a]])}),c.gateFace=f}const Ye=new M,ut=new At,dt=new Yt;let L=null,Fe=0,w=0,B=0,Z=0,J=0,He=-1;const pt=new At,mt=matchMedia("(prefers-reduced-motion: reduce)");let vt=!1;const ce={scene:R,camera:y,light:!0,resize:tt,coolSplit:1,hud:()=>({grey:w.toFixed(3)}),update({p:e,t:n,dt:t,v:r}){const i=c.split;g.uniforms.uCa.value=(i?i.ca0:.0025)+Math.min(Math.abs(r??0),4)*.006,g.uniforms.uCool.value=i?i.cool:1;const s=c.wallMark;s&&e<.05&&(L=s.p>.9?{x:s.x,y:s.y,ppu:s.ppu,q:pt.copy(s.q)}:{...s.exit,q:pt.identity()}),e>=.3&&(L=null);const m=1-Math.exp(-40*Math.min(t,.1));Fe+=(e*16/6-Fe)*m,v.uniforms.uLine.value=Fe*1.5,v.uniforms.uCross.value=Fe*.1%1;const l=c.greyVision??globalThis.__greyLines?.vision,o=typeof l=="number"?Math.min(1,Math.max(0,l)):Pe.inOut(de(.6,.8,e)),a=He<0||Math.abs(e-He)>.15;He=e;const h=Wt(de(St[0],St[1],e));if(a||mt.matches)w=o,Z=0,B=h,J=0;else for(let Ae=Math.min(t,.1),ft=Math.ceil(Ae/.02),wt=0;wt<ft;wt++){const Be=Ae/ft;Z+=(te*te*(o-w)-2*te*Z)*Be,w+=Z*Be,J+=(te*te*(h-B)-2*te*J)*Be,B+=J*Be}B=Math.max(B,h-Math.min(1,Math.max(0,(1-e)/.08))),w=Math.min(1,Math.max(0,w)),B=Math.min(1,Math.max(0,B)),Math.abs(o-w)<1e-4&&Math.abs(Z)<1e-4&&(w=o,Z=0),Math.abs(h-B)<1e-4&&Math.abs(J)<1e-4&&(B=h,J=0),globalThis.__greyProbe={vis:w,p:e,swing:B};const d=mt.matches;w>0&&(!d||!vt)&&(qe.draw(c.renderer,d?0:n),vt=!0),g.uniforms.uT.value=d?0:n;const b=globalThis.__greyMix;g.uniforms.uMix.value=b===0||b===2?b:1;const C=B;g.uniforms.uA.value=Math.max(Bt.smoothstep(w,0,.1),C),q.visible=w>0,N.uniforms.uF.value=q.visible?g.uniforms.uA.value:0,g.uniforms.uSwing.value=C,g.uniforms.uLine.value=Bt.smoothstep(C,0,.05);const z=(we?78:30)*Math.PI/180,P=-(we?8:5.7)*Math.PI/180;dt.set(P*w,T*z*w,0),ut.setFromEuler(dt),j.quaternion.copy(ut),N.uniforms.uA.value=1,ne.visible=!0,v.uniforms.uVig.value=1;const V=Pe.inOut(de(.3,1,w)),D=re+(Le-re)*V,ue=xe+(ze-xe)*V,K=Ve*V,E=L?1-Pe.inOut(de(0,.3,e)):0;if(L&&E>0){Ye.set(L.x*ge,L.y*p,0);const Ae=L.ppu*2*p/c.viewport.height;W.position.set(K+(Ye.x-K)*E,ue+(Ye.y-ue)*E,0),W.scale.setScalar(D+(Ae-D)*E),W.quaternion.identity().slerp(L.q,E)}else W.position.set(K,ue,0),W.scale.setScalar(D),W.quaternion.identity();Ct(C),qt(n),globalThis.__greyProbeOn&&Dt()},dispose(){I.dispose(),O.dispose(),N.dispose(),Y.dispose(),g.dispose(),v.dispose(),qe.dispose(),De.material.dispose(),x.clear()}};return ce};export{Qt as default};
