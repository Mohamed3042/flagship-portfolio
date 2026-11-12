import{b as he,s as fe,z as tt,B as at,x as st,a6 as ot,S as rt,P as nt,G as it,M as ne,a as ve,j as Ce,af as b,a2 as $,W as ut,at as lt,ba as ct,q as pt,a1 as Ue,r as vt}from"./EditionWorld.astro_astro_type_script_index_0_lang.FYnowjil.js";import{f as mt}from"./tv.BQwHR0Iu.js";import{m as Z}from"./media-base.CkYm9YKi.js";import{c as $e}from"./_chapters.CRo00Zii.js";import{a as ft}from"./_cinema.BFQh8D3b.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ht=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),He=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,Oe=(t,v,L,u,n)=>-Math.sin(n*t/u*Math.PI+L)*v,dt=(t,v,L,u,n)=>-Math.cos(n*t/u*Math.PI+L)*v*n*Math.PI/u,ue=()=>{const t=new st(new Uint8Array([0,0,0,255]),1,1);return t.needsUpdate=!0,t};function Re(t){return new he({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...t,uMap:{value:ue()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new fe(1,1)},uScreen:{value:new fe(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1}},vertexShader:`${He}
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
      }`})}const wt=`
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
  }`;function gt(t){return new he({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...t,uA:{value:ue()},uB:{value:ue()},uMix:{value:0},uFilm:{value:.4},uL:{value:ue()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new fe(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${He}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uA, uB, uL; uniform float uMix, uFilm, uDrift, uLetters, uDir, uGainA, uGainB; varying vec2 vUv;
      ${wt}
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
      }`})}function xt(t,v){const u=document.createElement("canvas"),n=u.getContext("2d"),D=v?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;n.font=D;const M=Math.ceil(n.measureText(t).width+256*.1);u.width=Math.min(4096,M),u.height=256,n.font=D,n.fillStyle="#fff",n.textBaseline="alphabetic",n.direction=v?"rtl":"ltr",n.textAlign="center",n.fillText(t,u.width/2,256*.82);const O=new tt(u);return O.anisotropy=8,O.minFilter=at,{tex:O,aspect:u.width/u.height}}function yt(){return new he({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
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
      }`})}const ie="business",bt={en:"BUSINESS",ar:"الأعمال"},Mt={"mk-suite":{clip:"desktop/clip-013.mp4",poster:"card.webp",luma:.87},"mk-business-os":{clip:"desktop/clip-005.mp4",poster:"desktop/poster-knowledge.jpg",luma:.2},ess:{clip:"desktop/clip-011.mp4",poster:"desktop/poster-evidence.jpg",luma:.68},"mk-sheep":{clip:"room-v2.mp4",poster:"room-v2.webp",luma:.82},"mk-marketplace":{clip:"desktop/clip-008.mp4",poster:"desktop/poster-listing.jpg",luma:.84}},Be=10,me=50,E={amp:4,phoneWeak:.2,step:.95,panelH:.3,panelW:.453,phoneRight:.09*.95,left:.05,phoneUp:.6,phase:8},J={w:1.4,h:1.7},G={pre:.244,entry:2,panel:1.6912,grow:1.5};function kt(){try{const t=JSON.parse(document.querySelector("script[data-door-ribbon]")?.textContent||"{}");return{films:Array.isArray(t.films)?t.films.filter(v=>v&&v.poster):[],hall:typeof t.hall=="string"?t.hall:""}}catch{return{films:[],hall:""}}}const Dt=async t=>{const v=t.lang==="ar",L=v?"ar":"en",u=v?-1:1,n=matchMedia("(prefers-reduced-motion: reduce)").matches,D=ot(ie),M=D.length,O=kt(),Y=O.films[0],Ie=O.hall||`${t.base}/${L}/cinema`,qe=G.pre+G.entry+M*G.panel+G.grow;await mt();const Q=new rt,k=new nt(me,t.viewport.aspect,.1,100);k.position.set(0,0,Be),k.lookAt(0,0,0);const T=new it;Q.add(T);const d=ht();d.uDir.value=u;const I=gt(d),q=new ne(new ve(1,1,96,1),I);q.renderOrder=0,q.frustumCulled=!1,T.add(q);const de=xt(bt[L],v);I.uniforms.uL.value=de.tex;const ee=I,we=!!t.quality||t.viewport.portrait,le=new ve(1,1,24,8),f=D.map((e,s)=>{const r=Re(d),o=new ne(le,r);o.renderOrder=2+s,o.frustumCulled=!1,T.add(o);const i=Mt[e.id],c=i?t.media.screen(Z(`motion/${e.id}/media/${i.clip}`),Z(`motion/${e.id}/media/${i.poster}`)):e.clip.endsWith(".webp")?$e([Z(`motion/${e.id}/media/${e.clip}`)],{big:we,rtl:v,period:5,sweep:.01}):t.media.screen(Z(`motion/${e.id}/media/${e.clip}`),Z(`motion/${e.id}/media/card.webp`));return{a:e,mesh:o,mat:r,screen:c,x:0,y:0,luma:i?.luma,clock:s*1.7%5,el:null,ran:!1}});if(Y){const e=Re(d),s=new ne(le,e);s.frustumCulled=!1,T.add(s),e.uniforms.uLevel.value=1.08;const r=ft(Y),o=r?t.media.screen(r,Y.poster):$e([Y.poster],{big:we,rtl:v,period:5,sweep:0});f.push({a:{id:"cinema",clip:""},mesh:s,mat:e,screen:o,x:0,y:0,luma:.3,clock:0,el:null,ran:!1})}const p=f.length;f[p-1].mesh.renderOrder=20;const A=yt(),F=new ne(new ve(1,1),A);F.frustumCulled=!1,F.renderOrder=100,F.visible=!1,Q.add(F);let C=null,te=1,z=1,m=1,_=1,ge=1,j=1,N=1;function xe(){k.fov=me,k.aspect=t.viewport.aspect,k.updateProjectionMatrix(),z=2*Be*Math.tan(pt.degToRad(me/2)),te=z*k.aspect,m=Math.max(z,te),_=b((16/9-k.aspect)/(16/9-9/16)),ge=E.amp*(1-E.phoneWeak*_),N=E.panelH*m,j=E.panelW*m,d.uWs.value=m,q.scale.set(J.w*m,J.h*m,1),ee.uniforms.uWall.value.set(J.w*m,J.h*m),f.forEach(e=>{e.mesh.scale.set(j,N,1),e.mat.uniforms.uSize.value.set(j,N),e.mat.uniforms.uScreen.value.set(te,z),e.mat.uniforms.uK.value=.2+.1*(1-_)}),A.uniforms.uAsp.value=t.viewport.aspect,A.uniforms.uDir.value=u,C?.setSize(Math.round(t.viewport.width*t.viewport.dpr),Math.round(t.viewport.height*t.viewport.dpr))}xe();const ze=e=>e>=M?Ie:`${t.base}/motion/${D[e].id}/?lang=${L}`,_e=!!globalThis.__roomProbeOn,V=new Ce,je=new Ce,ae=e=>{const s=f[e],r=s.mat.uniforms.uGrow.value,o=s.mat.uniforms.uK.value;let i=1e9,c=1e9,g=-1e9,l=-1e9;for(let y=0;y<=12;y++)for(const U of[-.5,.5]){const B=(y/12-.5)*j,P=s.x+B,W=u>0?y/12:1-y/12,H=$(0,1,-W*o+r*(1+o));V.set(P,s.y+U*N,Oe(P,d.uAmp.value,d.uPhase.value,m,u)),V.lerp(je.set((y/12-.5)*te*1.02,U*z*1.02,0),H).project(k);const X=(V.x+1)/2*t.viewport.width,se=(1-V.y)/2*t.viewport.height;i=Math.min(i,X),g=Math.max(g,X),c=Math.min(c,se),l=Math.max(l,se)}return{x:i,y:c,w:g-i,h:l-c}},Ne=e=>{const s=f[e],r=t.viewport.height,o=[-.5,.5].map(c=>{const g=s.x+c*j,l=Oe(g,d.uAmp.value,d.uPhase.value,m,u),y=U=>(1-V.set(g,s.y+U*N,l).project(k).y)/2*r;return(y(-.5)-y(.5))/r*100}),i=Math.atan(Math.abs(dt(s.x,d.uAmp.value,d.uPhase.value,m,u)))*180/Math.PI;return{hL:+o[0].toFixed(1),hR:+o[1].toFixed(1),turn:+i.toFixed(1)}},ye=(e,s,r)=>{const o=ae(r),i=(e+1)/2*t.viewport.width,c=(1-s)/2*t.viewport.height;return i>=o.x&&i<=o.x+o.w&&c>=o.y&&c<=o.y+o.h},be=()=>document.querySelector(`[data-app-card="${ie}"]`),Ve=()=>{const e=be();if(!e)return;e.classList.remove("is-moving");const s=e.querySelector('[data-app-field="line"]'),r=s?.textContent?.match(/^.+?[.!?؟](?=\s|$)/);s&&r&&r[0].length<s.textContent.length&&(s.textContent=r[0]);const o=e.querySelector('[data-app-field="name"]');if(o){const i=o.querySelector(".wo-sr-text")?.textContent??o.textContent??"";e.classList.add("is-service"),ct(o,i,{stagger:.04});const c=e.querySelector('[data-app-field="link"]'),g=c?.querySelector('[data-app-field="watch"]')?.textContent?.trim();c&&g&&c.setAttribute("aria-label",`${g}: ${i}`)}},Me=e=>f.find(s=>s.screen===e)?.luma??e.luma??.3,ke=e=>b(.3/Math.max(Me(e),.3),.45,1),Xe=.4;let w=.5,Ae=-1,Se=!1,R=0,Ge=0;return{scene:Q,camera:k,resize:xe,focus(e){Se=e,e||f.forEach((s,r)=>{r===M&&Ge>.97||(s.screen.pause(),s.screen.release())})},update({p:e,t:s,dt:r,active:o}){Ge=e;const i=e*qe,c=1+(i-G.pre-G.entry-G.panel/2)/G.panel;let g=b(c,.5,p);const l=n?1:b((i-G.pre)/(G.entry*Xe));g-=.4*(1-l);const y=b(Math.round(g),1,p),U=y+.4*(g-y);w=n?U:Ue(w,U,5,r);const B=p>M?vt(p-.55,p+.3,c):0;R=n||e>=.985||B<=0?e>=.985&&p>M?1:B:Math.max(Ue(R,B,7,r),B-.12);const P=p>M?Math.min(1,b(w-(p-.5),0,.5)+.5*R):0;d.uAmp.value=ge*l*(1-R),d.uPhase.value=E.phase*(1-l)-2*R;const W=b(Math.round(w)-1,0,p-1),H=Math.min(W,M-1);H!==Ae&&(Ae=H,t.emit("app",{room:ie,id:D[H].id,index:H,count:M}),Ve());const X=be();X&&X.style.setProperty("--bz-on",(1-Math.pow(1-l,2))*$(.14,.24,l)*(1-$(0,.25,P))+"");const se=(E.phoneRight*_-E.left*(1-P))*m,Ke=E.phoneUp*_,Pe=$(.5,1,l);f.forEach((a,h)=>{const Je=h===p-1?P:0,Ye=(h-(w-1))*E.step*m-(h<p-1?.5*P*m:0);a.x=u*(Ye+se),a.y=Ke,a.mesh.position.set(a.x,a.y,0),a.mat.uniforms.uGrow.value=Je,a.mat.uniforms.uOpacity.value=Pe;const pe=ae(h),Qe=Pe>0&&pe.x<t.viewport.width&&pe.x+pe.w>0;a.mesh.visible=Qe;const Ee=o&&e>0&&e<1&&Math.abs(h-W)<=1,Le=Se&&o&&e>0&&e<1;Le&&!n&&(a.clock+=r),a.screen.want(Ee);const et=h===W;"frame"in a.screen&&a.screen.frame(s,et);const De=a.screen.texture.image,S=De instanceof HTMLVideoElement?De:null,re=Ee&&Le;if(S&&S.duration>0)if(S!==a.el||re&&!a.ran){a.el=S;const Fe=a.clock%S.duration;Math.abs(S.currentTime-Fe)>.25&&(S.currentTime=Fe)}else re&&!S.paused&&(a.clock=S.currentTime+Math.floor(a.clock/S.duration)*S.duration);a.ran=re,re?a.screen.play():h===M&&e>.97||a.screen.pause(),a.mat.uniforms.uMap.value=a.screen.texture;const Te=Me(a.screen);a.mat.uniforms.uGain.value=Te>.62?b(.62/Te,.75,1):1});const x=I.uniforms,oe=b(Math.floor(w-1),0,p-1),K=Math.min(p-1,oe+1),Ze=b(w-1-oe);x.uMix.value=K>oe?$(.3,.7,Ze):0;const ce=x.uMix.value>.999?K:oe;x.uA.value=f[ce].screen.texture,x.uB.value=x.uMix.value>.001&&x.uMix.value<.999?f[K].screen.texture:x.uA.value,ce===K&&(x.uMix.value=0),x.uGainA.value=ke(f[ce].screen),x.uGainB.value=ke(f[K].screen),x.uFilm.value=.4*(1-P),x.uLetters.value=n?0:.8*(1-l),x.uDrift.value=(n?0:s*.015)+w*.2;const We=n?0:s;if(ee.uniforms.uGridX.value=We+w*.056*45/J.w,ee.uniforms.uPlusX.value=(We*.01+w*.42+.2*l)*m,ee.uniforms.uAmt.value=1-P,F.visible=!1,l<.9999&&o){const a=t.renderer;C||(C=new ut(Math.round(t.viewport.width*t.viewport.dpr),Math.round(t.viewport.height*t.viewport.dpr),{depthBuffer:!1}),C.texture.colorSpace=lt);const h=a.getRenderTarget();T.visible=!0,a.setRenderTarget(C),a.setClearColor(0,1),a.clear(),a.render(Q,k),a.setRenderTarget(h),a.setClearColor(0,0),A.uniforms.uMap.value=C.texture,A.uniforms.uE.value=l,A.uniforms.uTime.value=30+8*l,A.uniforms.uClock.value=s,A.uniforms.uWig.value=1-$(0,.4,l),A.uniforms.uG.value=$(.02,G.pre+.1,i),A.uniforms.uPx.value=Math.max(1,t.viewport.height*t.viewport.dpr/850),T.visible=!1,F.visible=!0}else T.visible=!0;if(_e){const a=ae(W),h=t.viewport;globalThis.__roomProbe={room:ie,idx:W,count:+w.toFixed(3),e:+l.toFixed(3),grow:+P.toFixed(3),x0:+(a.x/h.width*100).toFixed(1),x1:+((a.x+a.w)/h.width*100).toFixed(1),wPct:+(a.w/h.width*100).toFixed(1),...Ne(W),sIn:+R.toFixed(3),nb:W+1<p?+(ae(W+1).x/h.width*100).toFixed(1):null}}},pick(e,s){const r=b(Math.round(w)-1,0,p-1);return ye(e,s,r)?ze(r):null},hover(e,s){return t.pointer.inside&&ye(e,s,b(Math.round(w)-1,0,p-1))},dispose(){le.dispose(),q.geometry.dispose(),F.geometry.dispose(),I.dispose(),A.dispose(),C?.dispose(),de.tex.dispose(),f.forEach(e=>{e.mat.dispose(),e.screen.pause(),"dispose"in e.screen&&e.screen.dispose()})}}};export{G as BIZ_SCREENS,Dt as default};
