import{b as be,s as ye,z as lt,B as ut,x as ct,a6 as pt,S as vt,P as ft,G as mt,M as ce,a as ge,j as Be,af as M,a2 as $,W as ht,at as dt,ba as wt,q as gt,a1 as He,r as xt}from"./EditionWorld.astro_astro_type_script_index_0_lang.BVdr9XtD.js";import{f as yt}from"./tv.DMyuNzJ1.js";import{m as ee}from"./media-base.CkYm9YKi.js";import{c as _e}from"./_chapters.BOk-ZS9F.js";import{a as bt}from"./_cinema.Co84sUuZ.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Mt=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),Ve=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,qe=(t,c,D,u,i)=>-Math.sin(i*t/u*Math.PI+D)*c,kt=(t,c,D,u,i)=>-Math.cos(i*t/u*Math.PI+D)*c*i*Math.PI/u,ve=()=>{const t=new ct(new Uint8Array([0,0,0,255]),1,1);return t.needsUpdate=!0,t};function Ne(t){return new be({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...t,uMap:{value:ve()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new ye(1,1)},uScreen:{value:new ye(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1}},vertexShader:`${Ve}
      uniform float uGrow, uK; uniform vec2 uSize, uScreen; varying vec2 vUv; varying float vAsp;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        float u = uDir > 0. ? uv.x : 1. - uv.x;                                     // 0 at the near side
        float g = smoothstep(0., 1., -u * uK + uGrow * (1. + uK));
        vec3 full = vec3(position.x * uScreen.x * 1.02, position.y * uScreen.y * 1.02, 0.);   // the screen's rectangle at the sheet
        wp.xyz = mix(wp.xyz, full, g);
        vAsp = mix(uSize.x / uSize.y, uScreen.x / uScreen.y, uGrow);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uMap; uniform float uLevel, uGrow, uFilmAsp, uOpacity, uGain; varying vec2 vUv; varying float vAsp;
      void main(){
        vec2 uv = vUv - .5;
        if (vAsp < uFilmAsp) uv.x *= vAsp / uFilmAsp; else uv.y *= uFilmAsp / vAsp;   // the film covers the rectangle
        vec3 col = texture2D(uMap, uv + .5).rgb * uLevel * uGain;
        float a = mix(smoothstep(1., .3, length(vUv - .5)), 1., uGrow);
        gl_FragColor = vec4(col, a * uOpacity);
      }`})}const St=`
  uniform vec2 uWall; uniform float uGridX, uPlusX, uLine, uPlus, uAmt;
  float gline(float v){ float d = abs(fract(v + .5) - .5), w = fwidth(v); return 1. - smoothstep(min(.02, w * .35), min(.02, w * .35) + w * .9, d); }
  float gridAt(vec2 uv){
    vec2 g = uv * vec2(45., 50.); g.x += uGridX * uDir;
    float L = max(gline(g.x), gline(g.y)) * uLine;
    vec2 P = uv * uWall; P.x += uPlusX * uDir;
    vec2 st = uWall / vec2(16., 11.);
    vec2 f = (fract(P / st) - .5) * st;
    vec2 w = fwidth(P) * .75;
    float arm = .1;
    float plus = max(step(abs(f.y), w.y) * step(abs(f.x), arm), step(abs(f.x), w.x) * step(abs(f.y), arm));
    return max(L, plus * uPlus) * uAmt;
  }`;function At(t){return new be({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...t,uA:{value:ve()},uB:{value:ve()},uMix:{value:0},uFilm:{value:.4},uL:{value:ve()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new ye(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${Ve}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uA, uB, uL; uniform float uMix, uFilm, uDrift, uLetters, uDir, uGainA, uGainB; varying vec2 vUv;
      ${St}
      vec3 film(sampler2D m, vec2 uv){ return texture2D(m, vec2(.5 + (uv.x - .5) * .7, uv.y)).rgb; }
      void main(){
        float s = uDir > 0. ? vUv.x : 1. - vUv.x;                // 0 at the near side
        vec3 col = vec3(0.);
        if (uFilm > .001) {
          vec3 fa = film(uA, vUv + vec2(uDir * .05 * uMix, 0.)) * uGainA;
          if (uMix > .001) fa = mix(fa, film(uB, vUv - vec2(uDir * .05 * (1. - uMix), 0.)) * uGainB, uMix);
          col = fa * uFilm * (1. - s);
        }
        if (uLetters > .001) {
          float R = 4.5, r = floor(vUv.y * R), v = fract(vUv.y * R);
          float u = fract(s * 1.1 + uDrift + r * .37) * 1.1;          // 1.1 copies across, a 10 % gap after each
          float L = u < 1. ? texture2D(uL, vec2(uDir > 0. ? u : 1. - u, v)).a : 0.;
          col += vec3(.86, .9, .96) * L * uLetters;
        }
        col += vec3(gridAt(vUv));   // the grid and the plus marks over the wall (one pass: the same sheet)
        gl_FragColor = vec4(col, 1.);
      }`})}function Gt(t,c){const u=document.createElement("canvas"),i=u.getContext("2d"),C=c?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;i.font=C;const d=Math.ceil(i.measureText(t).width+256*.1);u.width=Math.min(4096,d),u.height=256,i.font=C,i.fillStyle="#fff",i.textBaseline="alphabetic",i.direction=c?"rtl":"ltr",i.textAlign="center",i.fillText(t,u.width/2,256*.82);const z=new lt(u);return z.anisotropy=8,z.minFilter=ut,{tex:z,aspect:u.width/u.height}}function Pt(){return new be({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uE, uTime, uAsp, uDir, uClock, uWig, uG, uPx; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.), f.x), f.y); }
      float fbm(vec2 p){ return n2(p) * .55 + n2(p * 2.1 + 3.7) * .3 + n2(p * 4.3 + 9.1) * .15; }
      void main(){
        float k = 1. - uE;
        vec2 uv = vUv, c = uv - .5, p = vec2(c.x * uAsp, c.y);
        // the glass's body: a convex lens over the whole screen plus the letter's broad facets
        vec2 facet = vec2(fbm(p * 2.4 + vec2(uTime * .04, 0.)), fbm(p * 2.4 + 11.3 - uTime * .03)) - .5;
        vec2 bend = (c * (.55 - dot(p, p) * .8) + facet * .35) * k * .5 * (1. - smoothstep(.6, .9, uE));   // (world-50b: near straight before the room's colours come back)      // ≈ alche's 5 × (1 − entry) in screen terms
        // world-40e, THE WIGGLE (alche f640-f720): while the letters form out of the sand they come through a bulging lens
        // and a noise that is read twice (the second read pushed by the first) and drifts by itself (.1 a second, the clock),
        // so the rows bend, sway and stretch; uWig (the scroll: 1 at the entry's start, 0 by 40 % of it) calms it to nothing
        vec2 wig = vec2(0.);
        if (uWig > .001) {
          float r2 = dot(p, p);
          vec2 lensW = c * (r2 * 3.6 + .12) * .6;                              // a barrel: the middle swells, the rows bow out (world-40f: bowing as a sphere more than swaying)
          vec2 q = p * 1.5 + vec2(uClock * .1, uE * 1.6 - uClock * .06);        // the drift: a tenth of a unit a second
          vec2 d1 = vec2(fbm(q), fbm(q + 5.2)) - .5;
          vec2 d2 = vec2(fbm(q * 1.35 + d1 * 2.3 + 1.7), fbm(q * 1.35 + d1 * 2.3 + 9.2)) - .5;   // read twice: the second pushed by the first
          wig = (lensW + d2 * vec2(.055, .07)) * uWig;   // one shift for all five samples (no ghost rings); the R/G/B split still applies
        }
        // (world-50b, alche's whole spectrum) the five bend strengths are five hues, red at the strongest to violet at the
        // weakest, normalised so they sum to white inside a form: only the edges of the bent picture carry colour, and all of
        // it, not blue and orange alone. The R/G/B split of the room's own picture is read only once it comes back (uE > .75)
        vec3 col = vec3(0.), c0 = vec3(0.), sp = vec3(0.), sw = vec3(0.);
        for (int i = 0; i < 5; i++) {
          float s = 1. - float(i) * .06;
          vec2 o = bend * s + wig;
          vec3 t0 = texture2D(uMap, uv - o).rgb; c0 += t0;
          vec3 hue = clamp(abs(fract(float(i) * .1875 + vec3(0., 2. / 3., 1. / 3.)) * 6. - 3.) - 1., 0., 1.);
          sp += hue * dot(t0, vec3(.2126, .7152, .0722)); sw += hue;
          if (uE > .75) col += vec3(t0.r, texture2D(uMap, uv - o * 1.05).g, texture2D(uMap, uv - o * 1.1).b);
        }
        col /= 5.; c0 /= 5.; sp /= sw;
        // world-40f: alche's own colours (no palette of ours): black ground, the word white to light grey, the R/G/B split as its
        // only colour (a thin fringe), bright grain. The word GATHERS out of sparse fine specks (round 8's passage into Families:
        // engine.ts dive, word = step(hash, coverage^.75)): uG (the scroll, 0 → 1 while the sand passage brings the room in)
        // raises the specks' density; the sandy edges stay through the wiggle and go clean as the entry calms
        float y0 = dot(c0, vec3(.2126, .7152, .0722));
        vec3 fr = sp - y0; fr -= dot(fr, vec3(.2126, .7152, .0722));            // the split's colour alone, never the picture's own hue (world-50b: the spectrum's)
        float bw = smoothstep(.16, .6, y0 * (1. + 1.2 * k * k));                 // up to four times too bright at the start, then the letters' grey
        float hh = h(floor(gl_FragCoord.xy / uPx) + 31.7);
        float spk = step(hh, pow(bw, .75) * mix(.08, 1.04, uG));                 // the specks: sparse, then the whole letter with sandy edges
        if (uG < .999) spk = bw;   // world-47c: inside the sand seam the WHOLE word goes out, so the passage's lens sees the room's own picture; the passage gathers it out of the same specks (passage-sand.ts c.)
        float clean = smoothstep(.35, .8, uE);
        float lum = mix(spk, bw, clean) * mix(.9, .4, smoothstep(.0, .04, uE));   // white, settling to alche's light grey (his letters f680-f760: ~143 of 255)
        lum *= 1. - .94 * smoothstep(.1, .42, uE);                              // world-47: the word SINKS to near black (alche: 0.8 x (1 - entry), dark by f750), before the panels come
        float rim = clamp(4. * bw * (1. - bw) + .12 * (1. - bw), 0., 1.);       // the fringe on the letters' edges only, never across a letter
        // (world-50b) the split's colour only where it is a real edge: a broad soft gradient (the wall's film, a blurred letter)
        // splits weakly and was tinting whole fields (tan grain, rings of the wall's lines); below that the picture stays grey
        vec3 frE = clamp(fr, -.13, .13) * smoothstep(.03, .09, length(fr));
        vec3 mono = vec3(lum) + frE * (.8 + .5 * k) * rim * max(spk, clean);   // a thin fringe, never a tinted letter
        col = mix(clamp(mono, 0., 1.), col, smoothstep(.75, 1., uE));            // the room's own picture back by the hard switch
        gl_FragColor = vec4(col, 1.);
      }`})}const pe="business",Et={en:"BUSINESS",ar:"الأعمال"},Lt={"mk-suite":{clip:"desktop/clip-013.mp4",poster:"card.webp",luma:.87},"mk-business-os":{clip:"desktop/clip-005.mp4",poster:"desktop/poster-knowledge.jpg",luma:.2},ess:{clip:"desktop/clip-011.mp4",poster:"desktop/poster-evidence.jpg",luma:.68},"mk-sheep":{clip:"room-v2.mp4",poster:"room-v2.webp",luma:.82},"mk-marketplace":{clip:"desktop/clip-008.mp4",poster:"desktop/poster-listing.jpg",luma:.84}},je=10,xe=50,T={amp:4,phoneWeak:.2,step:.95,panelH:.3,panelW:.453,phoneRight:.09*.95,left:.05,phoneUp:.6,phase:8},te={w:1.4,h:1.7},P={pre:.244,entry:2,panel:1.6912,grow:1.5};function Wt(){try{const t=JSON.parse(document.querySelector("script[data-biz-reel]")?.textContent||"[]");return Array.isArray(t)?t.filter(c=>c&&c.loop&&c.poster):[]}catch{return[]}}function Tt(){try{const t=JSON.parse(document.querySelector("script[data-door-ribbon]")?.textContent||"{}");return{films:Array.isArray(t.films)?t.films.filter(c=>c&&c.poster):[],hall:typeof t.hall=="string"?t.hall:""}}catch{return{films:[],hall:""}}}const zt=async t=>{const c=t.lang==="ar",D=c?"ar":"en",u=c?-1:1,i=matchMedia("(prefers-reduced-motion: reduce)").matches,C=pt(pe),d=C.length,z=Tt(),ae=z.films[0],Ke=z.hall||`${t.base}/${D}/cinema`,Xe=P.pre+P.entry+d*P.panel+P.grow;await yt();const se=new vt,k=new ft(xe,t.viewport.aspect,.1,100);k.position.set(0,0,je),k.lookAt(0,0,0);const F=new mt;se.add(F);const w=Mt();w.uDir.value=u;const _=At(w),q=new ce(new ge(1,1,96,1),_);q.renderOrder=0,q.frustumCulled=!1,F.add(q);const Me=Gt(Et[D],c);_.uniforms.uL.value=Me.tex;const oe=_,ke=!!t.quality||t.viewport.portrait,fe=new ge(1,1,24,8),m=C.map((e,a)=>{const o=Ne(w),r=new ce(fe,o);r.renderOrder=2+a,r.frustumCulled=!1,F.add(r);const n=Lt[e.id],f=n?t.media.screen(ee(`motion/${e.id}/media/${n.clip}`),ee(`motion/${e.id}/media/${n.poster}`)):e.clip.endsWith(".webp")?_e([ee(`motion/${e.id}/media/${e.clip}`)],{big:ke,rtl:c,period:5,sweep:.01}):t.media.screen(ee(`motion/${e.id}/media/${e.clip}`),ee(`motion/${e.id}/media/card.webp`));return{a:e,mesh:r,mat:o,screen:f,x:0,y:0,luma:n?.luma,clock:a*1.7%5,el:null,ran:!1}}),E=Wt(),N=new Map,me=e=>{let a=N.get(e);return a||(a=t.media.screen(E[e].loop,E[e].poster),N.set(e,a)),a};let W=0,he=!1,Se=!1;const Je=()=>{const e=(W+1)%E.length;for(const[a,o]of N)a!==W&&a!==e&&(o.forget?o.forget():o.release(),N.delete(a))};if(ae){const e=Ne(w),a=new ce(fe,e);a.frustumCulled=!1,F.add(a),e.uniforms.uLevel.value=1.08;const o=bt(ae),n=E[0]?me(0):o?t.media.screen(o,ae.poster):_e([ae.poster],{big:ke,rtl:c,period:5,sweep:0});m.push({a:{id:"cinema",clip:""},mesh:a,mat:e,screen:n,x:0,y:0,luma:.3,clock:0,el:null,ran:!1})}const v=m.length;m[v-1].mesh.renderOrder=20;const S=Pt(),U=new ce(new ge(1,1),S);U.frustumCulled=!1,U.renderOrder=100,U.visible=!1,se.add(U);let R=null,re=1,j=1,h=1,V=1,Ae=1,K=1,X=1;function Ge(){k.fov=xe,k.aspect=t.viewport.aspect,k.updateProjectionMatrix(),j=2*je*Math.tan(gt.degToRad(xe/2)),re=j*k.aspect,h=Math.max(j,re),V=M((16/9-k.aspect)/(16/9-9/16)),Ae=T.amp*(1-T.phoneWeak*V),X=T.panelH*h,K=T.panelW*h,w.uWs.value=h,q.scale.set(te.w*h,te.h*h,1),oe.uniforms.uWall.value.set(te.w*h,te.h*h),m.forEach(e=>{e.mesh.scale.set(K,X,1),e.mat.uniforms.uSize.value.set(K,X),e.mat.uniforms.uScreen.value.set(re,j),e.mat.uniforms.uK.value=.2+.1*(1-V)}),S.uniforms.uAsp.value=t.viewport.aspect,S.uniforms.uDir.value=u,R?.setSize(Math.round(t.viewport.width*t.viewport.dpr),Math.round(t.viewport.height*t.viewport.dpr))}Ge();const Ze=e=>e>=d?Ke:`${t.base}/motion/${C[e].id}/?lang=${D}`,Ye=!!globalThis.__roomProbeOn,J=new Be,Qe=new Be,ne=e=>{const a=m[e],o=a.mat.uniforms.uGrow.value,r=a.mat.uniforms.uK.value;let n=1e9,f=1e9,x=-1e9,p=-1e9;for(let b=0;b<=12;b++)for(const O of[-.5,.5]){const B=(b/12-.5)*K,L=a.x+B,A=u>0?b/12:1-b/12,H=$(0,1,-A*r+o*(1+r));J.set(L,a.y+O*X,qe(L,w.uAmp.value,w.uPhase.value,h,u)),J.lerp(Qe.set((b/12-.5)*re*1.02,O*j*1.02,0),H).project(k);const Z=(J.x+1)/2*t.viewport.width,ie=(1-J.y)/2*t.viewport.height;n=Math.min(n,Z),x=Math.max(x,Z),f=Math.min(f,ie),p=Math.max(p,ie)}return{x:n,y:f,w:x-n,h:p-f}},et=e=>{const a=m[e],o=t.viewport.height,r=[-.5,.5].map(f=>{const x=a.x+f*K,p=qe(x,w.uAmp.value,w.uPhase.value,h,u),b=O=>(1-J.set(x,a.y+O*X,p).project(k).y)/2*o;return(b(-.5)-b(.5))/o*100}),n=Math.atan(Math.abs(kt(a.x,w.uAmp.value,w.uPhase.value,h,u)))*180/Math.PI;return{hL:+r[0].toFixed(1),hR:+r[1].toFixed(1),turn:+n.toFixed(1)}},Pe=(e,a,o)=>{const r=ne(o),n=(e+1)/2*t.viewport.width,f=(1-a)/2*t.viewport.height;return n>=r.x&&n<=r.x+r.w&&f>=r.y&&f<=r.y+r.h},Ee=()=>document.querySelector(`[data-app-card="${pe}"]`),tt=()=>{const e=Ee();if(!e)return;e.classList.remove("is-moving");const a=e.querySelector('[data-app-field="line"]'),o=a?.textContent?.match(/^.+?[.!?؟](?=\s|$)/);a&&o&&o[0].length<a.textContent.length&&(a.textContent=o[0]);const r=e.querySelector('[data-app-field="name"]');if(r){const n=r.querySelector(".wo-sr-text")?.textContent??r.textContent??"";e.classList.add("is-service"),wt(r,n,{stagger:.04});const f=e.querySelector('[data-app-field="link"]'),x=f?.querySelector('[data-app-field="watch"]')?.textContent?.trim();f&&x&&f.setAttribute("aria-label",`${x}: ${n}`)}},Le=e=>m.find(a=>a.screen===e)?.luma??e.luma??.3,We=e=>M(.3/Math.max(Le(e),.3),.45,1),at=.4;let g=.5,Te=-1,De=!1,I=0,Ce=0;return{scene:se,camera:k,resize:Ge,focus(e){De=e,e||(he=!1),e||m.forEach((a,o)=>{o===d&&Ce>.97||(a.screen.pause(),a.screen.release())})},update({p:e,t:a,dt:o,active:r}){Ce=e;const n=e*Xe,f=1+(n-P.pre-P.entry-P.panel/2)/P.panel;let x=M(f,.5,v);const p=i?1:M((n-P.pre)/(P.entry*at));x-=.4*(1-p);const b=M(Math.round(x),1,v),O=b+.4*(x-b);g=i?O:He(g,O,5,o);const B=v>d?xt(v-.55,v+.3,f):0;I=i||e>=.985||B<=0?e>=.985&&v>d?1:B:Math.max(He(I,B,7,o),B-.12);const L=v>d?Math.min(1,M(g-(v-.5),0,.5)+.5*I):0;w.uAmp.value=Ae*p*(1-I),w.uPhase.value=T.phase*(1-p)-2*I;const A=M(Math.round(g)-1,0,v-1),H=Math.min(A,d-1);H!==Te&&(Te=H,t.emit("app",{room:pe,id:C[H].id,index:H,count:d}),tt());const Z=Ee();if(Z&&Z.style.setProperty("--bz-on",(1-Math.pow(1-p,2))*$(.14,.24,p)*(1-$(0,.25,L))+""),v>d&&E.length){const s=r&&e>0&&e<1&&Math.abs(d-A)<=1;if(s&&!he&&Se){W=(W+1)%E.length;const l=m[d],Q=l.screen;l.screen=me(W),l.el=null,l.ran=!1,l.clock=0,Q!==l.screen&&(Q.pause(),Q.release())}s&&(Se=!0),he=s,me((W+1)%E.length),Je(),t.bizReelNow=E[W],globalThis.__bizReel={at:W,slug:E[W].slug,inRange:s,n:E.length,held:N.size}}const ie=(T.phoneRight*V-T.left*(1-L))*h,st=T.phoneUp*V,Fe=$(.5,1,p);m.forEach((s,l)=>{const Q=l===v-1?L:0,rt=(l-(g-1))*T.step*h-(l<v-1?.5*L*h:0);s.x=u*(rt+ie),s.y=st,s.mesh.position.set(s.x,s.y,0),s.mat.uniforms.uGrow.value=Q,s.mat.uniforms.uOpacity.value=Fe;const we=ne(l),nt=Fe>0&&we.x<t.viewport.width&&we.x+we.w>0;s.mesh.visible=nt;const Re=r&&e>0&&e<1&&Math.abs(l-A)<=1,Oe=De&&r&&e>0&&e<1;Oe&&!i&&(s.clock+=o),s.screen.want(Re);const it=l===A;"frame"in s.screen&&s.screen.frame(a,it);const $e=s.screen.texture.image,G=$e instanceof HTMLVideoElement?$e:null,ue=Re&&Oe;if(G&&G.duration>0)if(G!==s.el||ue&&!s.ran){s.el=G;const Ie=s.clock%G.duration;Math.abs(G.currentTime-Ie)>.25&&(G.currentTime=Ie)}else ue&&!G.paused&&(s.clock=G.currentTime+Math.floor(s.clock/G.duration)*G.duration);s.ran=ue,ue?s.screen.play():l===d&&e>.97||s.screen.pause(),s.mat.uniforms.uMap.value=s.screen.texture;const ze=Le(s.screen);s.mat.uniforms.uGain.value=ze>.62?M(.62/ze,.75,1):1});const y=_.uniforms,le=M(Math.floor(g-1),0,v-1),Y=Math.min(v-1,le+1),ot=M(g-1-le);y.uMix.value=Y>le?$(.3,.7,ot):0;const de=y.uMix.value>.999?Y:le;y.uA.value=m[de].screen.texture,y.uB.value=y.uMix.value>.001&&y.uMix.value<.999?m[Y].screen.texture:y.uA.value,de===Y&&(y.uMix.value=0),y.uGainA.value=We(m[de].screen),y.uGainB.value=We(m[Y].screen),y.uFilm.value=.4*(1-L),y.uLetters.value=i?0:.8*(1-p),y.uDrift.value=(i?0:a*.015)+g*.2;const Ue=i?0:a;if(oe.uniforms.uGridX.value=Ue+g*.056*45/te.w,oe.uniforms.uPlusX.value=(Ue*.01+g*.42+.2*p)*h,oe.uniforms.uAmt.value=1-L,U.visible=!1,p<.9999&&r){const s=t.renderer;R||(R=new ht(Math.round(t.viewport.width*t.viewport.dpr),Math.round(t.viewport.height*t.viewport.dpr),{depthBuffer:!1}),R.texture.colorSpace=dt);const l=s.getRenderTarget();F.visible=!0,s.setRenderTarget(R),s.setClearColor(0,1),s.clear(),s.render(se,k),s.setRenderTarget(l),s.setClearColor(0,0),S.uniforms.uMap.value=R.texture,S.uniforms.uE.value=p,S.uniforms.uTime.value=30+8*p,S.uniforms.uClock.value=a,S.uniforms.uWig.value=1-$(0,.4,p),S.uniforms.uG.value=$(.02,P.pre+.1,n),S.uniforms.uPx.value=Math.max(1,t.viewport.height*t.viewport.dpr/850),F.visible=!1,U.visible=!0}else F.visible=!0;if(Ye){const s=ne(A),l=t.viewport;globalThis.__roomProbe={room:pe,idx:A,count:+g.toFixed(3),e:+p.toFixed(3),grow:+L.toFixed(3),x0:+(s.x/l.width*100).toFixed(1),x1:+((s.x+s.w)/l.width*100).toFixed(1),wPct:+(s.w/l.width*100).toFixed(1),...et(A),sIn:+I.toFixed(3),nb:A+1<v?+(ne(A+1).x/l.width*100).toFixed(1):null}}},pick(e,a){const o=M(Math.round(g)-1,0,v-1);return Pe(e,a,o)?Ze(o):null},hover(e,a){return t.pointer.inside&&Pe(e,a,M(Math.round(g)-1,0,v-1))},dispose(){fe.dispose(),q.geometry.dispose(),U.geometry.dispose(),_.dispose(),S.dispose(),R?.dispose(),Me.tex.dispose(),m.forEach(e=>{e.mat.dispose(),e.screen.pause(),"dispose"in e.screen&&e.screen.dispose()})}}};export{P as BIZ_SCREENS,zt as default};
