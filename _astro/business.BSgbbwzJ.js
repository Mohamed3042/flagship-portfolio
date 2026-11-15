import{b as Me,B as be,I as ut,J as ct,aa as ft,S as ht,P as pt,G as vt,M as ne,a as we,bg as mt,bh as qe,k as He,am as S,bi as $e,a8 as C,z as dt,bj as wt,s as gt,a7 as Be,r as xt}from"./EditionWorld.astro_astro_type_script_index_0_lang.ClpBNxPv.js";import{f as yt}from"./tv.ivqy3NaF.js";import{m as ge}from"./media-base.DZ9PvFge.js";import{c as bt}from"./_chapters.C8JETuDO.js";import{a as Mt}from"./_cinema.Dwd-iGqC.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const kt=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),Xe=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,Ke=(s,p,m,c,l)=>-Math.sin(l*s/c*Math.PI+m)*p,St=(s,p,m,c,l)=>-Math.cos(l*s/c*Math.PI+m)*p*l*Math.PI/c,ie=()=>{const s=new ft(new Uint8Array([0,0,0,255]),1,1);return s.needsUpdate=!0,s};function Ne(s){return new Me({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...s,uMap:{value:ie()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new be(1,1)},uScreen:{value:new be(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1},uSolid:{value:0},uFit:{value:0}},vertexShader:`${Xe}
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
      uniform sampler2D uMap; uniform float uLevel, uGrow, uFilmAsp, uOpacity, uGain, uFit, uSolid; varying vec2 vUv; varying float vAsp;
      void main(){
        vec2 uv = vUv - .5;
        // cover (uFit 0): the film fills the rectangle, its edges cut; contain (uFit 1, world-56): its whole frame inside
        float r = vAsp / uFilmAsp;
        uv *= mix(r < 1. ? vec2(r, 1.) : vec2(1., 1. / r), r < 1. ? vec2(1., 1. / r) : vec2(r, 1.), uFit);
        uv *= mix(1., 1. / .92, uFit);   // a 4 % rim of dark glass on every side: the phone's panel reaches .7 % past the screen's edge
        vec2 q = abs(uv), px = fwidth(uv) * 1.5;
        float inside = (1. - smoothstep(.5 - px.x, .5, q.x)) * (1. - smoothstep(.5 - px.y, .5, q.y));
        vec3 col = texture2D(uMap, clamp(uv + .5, 0., 1.)).rgb * uLevel * uGain;
        float a = mix(smoothstep(1., .3, length(vUv - .5)), 1., max(uGrow, uSolid));
        float glass = .82;   // the panel's own dark glass round a whole film (contain): dark, never a colour
        col = mix(vec3(.018, .02, .026), col, mix(1., inside, uFit));
        a = mix(a, mix(a * glass, 1., inside), uFit);
        gl_FragColor = vec4(col, a * uOpacity);
      }`})}const At=`
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
  }`;function Ft(s){return new Me({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...s,uA:{value:ie()},uB:{value:ie()},uMix:{value:0},uFilm:{value:.4},uL:{value:ie()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new be(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${Xe}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uA, uB, uL; uniform float uMix, uFilm, uDrift, uLetters, uDir, uGainA, uGainB; varying vec2 vUv;
      ${At}
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
      }`})}function Gt(s,p){const c=document.createElement("canvas"),l=c.getContext("2d"),U=p?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;l.font=U;const u=Math.ceil(l.measureText(s).width+256*.1);c.width=Math.min(4096,u),c.height=256,l.font=U,l.fillStyle="#fff",l.textBaseline="alphabetic",l.direction=p?"rtl":"ltr",l.textAlign="center",l.fillText(s,c.width/2,256*.82);const O=new ut(c);return O.anisotropy=8,O.minFilter=ct,{tex:O,aspect:c.width/c.height}}function Lt(){return new Me({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
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
        frE *= max(1. - smoothstep(.2, .42, uE), ${typeof window<"u"&&window.__fringeOld?"1.":"0."});   // (world-52, outcome 6) the fringe goes as the word sinks: no orange and blue outline round the dim letters once the bend is straight (QA: __fringeOld keeps it)
        vec3 mono = vec3(lum) + frE * (.8 + .5 * k) * rim * max(spk, clean);   // a thin fringe, never a tinted letter
        col = mix(clamp(mono, 0., 1.), col, smoothstep(.75, 1., uE));            // the room's own picture back by the hard switch
        gl_FragColor = vec4(col, 1.);
      }`})}const xe="business",Pt={en:"FILMS",ar:"أفلام"},Et=.3,Ve=10,ye=50,P={amp:4,phoneWeak:.2,step:.95,panelH:.3,panelW:.453,phoneRight:.09*.95,left:.05,deskLeft:.04,phoneUp:.6,phase:8},Z={w:1.4,h:1.7},E={pre:.244,entry:2,panel:1.6912,grow:1.5};function Wt(){try{const s=JSON.parse(document.querySelector("script[data-biz-reel]")?.textContent||"[]");return Array.isArray(s)?s.filter(p=>p&&p.loop&&p.poster):[]}catch{return[]}}function Dt(){try{const s=JSON.parse(document.querySelector("script[data-door-ribbon]")?.textContent||"{}");return{films:Array.isArray(s.films)?s.films.filter(p=>p&&p.poster):[],hall:typeof s.hall=="string"?s.hall:""}}catch{return{films:[],hall:""}}}const It=async s=>{const p=s.lang==="ar",m=p?"ar":"en",c=p&&!matchMedia("(min-width: 900px) and (min-aspect-ratio: 4/5)").matches?-1:1,l=matchMedia("(prefers-reduced-motion: reduce)").matches,U=mt,u=U.length,O=Dt(),Q=O.films[0],je=O.hall||`${s.base}/${m}/cinema`,Je=E.pre+E.entry+u*E.panel+E.grow;await yt();const le=new ht,F=new pt(ye,s.viewport.aspect,.1,100);F.position.set(0,0,Ve),F.lookAt(0,0,0);const $=new vt;le.add($);const b=kt();b.uDir.value=c;const B=Ft(b),K=new ne(new we(1,1,96,1),B);K.renderOrder=0,K.frustumCulled=!1,$.add(K);const ke=Gt(Pt[m],p);B.uniforms.uL.value=ke.tex;const Y=B,Ze=!!s.quality||s.viewport.portrait,ue=new we(1,1,24,8),d=U.map((e,t)=>{const o=Ne(b),r=new ne(ue,o);r.renderOrder=2+t,r.frustumCulled=!1,$.add(r),o.uniforms.uFit.value=0,o.uniforms.uSolid.value=1,o.uniforms.uFilmAsp.value=e.asp;const i=e.hd&&s.viewport.width*s.viewport.dpr*(s.viewport.portrait?.9:.56)>=1e3,h=qe(e.file[m],i),g=s.media.screen(ge(`motion/world/films/${h}.mp4`),ge(`motion/world/films/${qe(e.file[m],!1)}.webp`));return{a:e,mesh:r,mat:o,screen:g,x:0,y:0,pw:1,ph:1,luma:Et,clock:0,el:null,ran:!1}}),G=Wt(),N=new Map,ce=e=>{let t=N.get(e);return t||(t=s.media.screen(G[e].loop,G[e].poster),N.set(e,t)),t};let W=0,fe=!1,Se=!1;const Qe=()=>{const e=(W+1)%G.length;for(const[t,o]of N)t!==W&&t!==e&&(o.forget?o.forget():o.release(),N.delete(t))};if(Q){const e=Ne(b),t=new ne(ue,e);t.frustumCulled=!1,$.add(t),e.uniforms.uLevel.value=1.08;const o=Mt(Q),i=G[0]?ce(0):o?s.media.screen(o,Q.poster):bt([Q.poster],{big:Ze,rtl:p,period:5,sweep:0});e.uniforms.uFit.value=1,d.push({a:{id:"cinema"},mesh:t,mat:e,screen:i,x:0,y:0,pw:1,ph:1,luma:.3,clock:0,el:null,ran:!1})}const v=d.length,Ae=s.renderer.capabilities.getMaxAnisotropy();d[v-1].mesh.renderOrder=20;const ee=Lt(),_=new ne(new we(1,1),ee);_.frustumCulled=!1,_.renderOrder=100,_.visible=!1,le.add(_);let te=1,V=1,w=1,R=1,Fe=1,he=1,Ge=1;function Le(){F.fov=ye,F.aspect=s.viewport.aspect,F.updateProjectionMatrix(),V=2*Ve*Math.tan(gt.degToRad(ye/2)),te=V*F.aspect,w=Math.max(V,te),R=S((16/9-F.aspect)/(16/9-9/16)),Fe=P.amp*(1-P.phoneWeak*R),Ge=P.panelH*w,he=P.panelW*w,b.uWs.value=w,K.scale.set(Z.w*w,Z.h*w,1),Y.uniforms.uWall.value.set(Z.w*w,Z.h*w);const e=.93;d.forEach((t,o)=>{const r=o<u?he*e:he,i=o<u?r/t.a.asp:Ge;t.pw=r,t.ph=i,t.mesh.scale.set(r,i,1),t.mat.uniforms.uSize.value.set(r,i),t.mat.uniforms.uScreen.value.set(te,V),t.mat.uniforms.uK.value=.2+.1*(1-R)}),ee.uniforms.uAsp.value=s.viewport.aspect,ee.uniforms.uDir.value=c}Le();const Ye=e=>e>=u?je:`${s.base}/${U[e].href[m]}`,et=!!globalThis.__roomProbeOn,X=new He,tt=new He,ae=e=>{const t=d[e],o=t.mat.uniforms.uGrow.value,r=t.mat.uniforms.uK.value;let i=1e9,h=1e9,g=-1e9,f=-1e9;for(let x=0;x<=12;x++)for(const T of[-.5,.5]){const I=(x/12-.5)*t.pw,L=t.x+I,A=c>0?x/12:1-x/12,q=C(0,1,-A*r+o*(1+r));X.set(L,t.y+T*t.ph,Ke(L,b.uAmp.value,b.uPhase.value,w,c)),X.lerp(tt.set((x/12-.5)*te*1.02,T*V*1.02,0),q).project(F);const j=(X.x+1)/2*s.viewport.width,se=(1-X.y)/2*s.viewport.height;i=Math.min(i,j),g=Math.max(g,j),h=Math.min(h,se),f=Math.max(f,se)}return{x:i,y:h,w:g-i,h:f-h}},at=e=>{const t=d[e],o=s.viewport.height,r=[-.5,.5].map(h=>{const g=t.x+h*t.pw,f=Ke(g,b.uAmp.value,b.uPhase.value,w,c),x=T=>(1-X.set(g,t.y+T*t.ph,f).project(F).y)/2*o;return(x(-.5)-x(.5))/o*100}),i=Math.atan(Math.abs(St(t.x,b.uAmp.value,b.uPhase.value,w,c)))*180/Math.PI;return{hL:+r[0].toFixed(1),hR:+r[1].toFixed(1),turn:+i.toFixed(1)}},Pe=(e,t,o)=>{const r=ae(o),i=(e+1)/2*s.viewport.width,h=(1-t)/2*s.viewport.height;return i>=r.x&&i<=r.x+r.w&&h>=r.y&&h<=r.y+r.h},Ee=()=>document.querySelector(`[data-app-card="${xe}"]`),st=()=>{const e=Ee();if(!e)return;e.classList.remove("is-moving");const t=U[Math.max(0,pe)],o=$e[t.id],r=e.querySelector('[data-app-field="logo"]'),i=e.querySelector('[data-app-field="note"]');o&&r&&(r.src=ge(`motion/world/logos/${o.logo}.svg`),r.alt=o.logo==="mk-cloud"?"MK Cloud":o.logo==="mk-clone"?"MK Clone":"MK Studio",r.hidden=!1),o&&i&&(i.textContent=o.note[m]);const h=e.querySelector('[data-app-field="name"]');if(h){const g=h.querySelector(".wo-sr-text")?.textContent??h.textContent??"";e.classList.add("is-service"),wt(h,g,{stagger:.04});const f=e.querySelector('[data-app-field="link"]'),x=f?.querySelector('[data-app-field="watch"]')?.textContent?.trim();f&&x&&f.setAttribute("aria-label",`${x}: ${g}`)}},We=e=>d.find(t=>t.screen===e)?.luma??e.luma??.3,De=e=>S(.3/Math.max(We(e),.3),.45,1),ot=.4;let M=.5,pe=-1,Ue=!1,z=0,Te=0;return{scene:le,camera:F,resize:Le,clean:1,focus(e){Ue=e,e||(fe=!1),e||d.forEach((t,o)=>{o===u&&Te>.97||(t.screen.pause(),t.screen.release())})},update({p:e,t,dt:o,active:r}){Te=e;const i=e*Je,h=1+(i-E.pre-E.entry-E.panel/2)/E.panel;let g=S(h,.5,v);const f=l?1:S((i-E.pre)/(E.entry*ot));g-=.4*(1-f);const x=S(Math.round(g),1,v),T=x+.4*(g-x);M=l?T:Be(M,T,5,o);const I=v>u?xt(v-.55,v+.3,h):0;z=l||e>=.985||I<=0?e>=.985&&v>u?1:I:Math.max(Be(z,I,7,o),I-.12);const L=v>u?Math.min(1,S(M-(v-.5),0,.5)+.5*z):0;b.uAmp.value=(globalThis.__bizFlat?0:Fe)*f*(1-z),b.uPhase.value=P.phase*(1-f)-2*z;const A=S(Math.round(M)-1,0,v-1),q=Math.min(A,u-1);if(q!==pe){pe=q;const a=U[q];s.emit("app",{room:xe,id:a.id,index:q,count:u,film:{name:a.name[m],line:$e[a.id]?.para[m]??a.line[m]??"",href:`${s.base}/${a.href[m]}`}}),st()}const j=Ee();if(j&&j.style.setProperty("--bz-on",(1-Math.pow(1-f,2))*C(.14,.24,f)*(1-C(0,.25,L))+""),v>u&&G.length){const a=r&&e>0&&e<1&&Math.abs(u-A)<=1;if(a&&!fe&&Se){W=(W+1)%G.length;const n=d[u],H=n.screen;n.screen=ce(W),n.el=null,n.ran=!1,n.clock=0,H!==n.screen&&(H.pause(),H.release())}a&&(Se=!0),fe=a,ce((W+1)%G.length),Qe(),s.bizReelNow=G[W],globalThis.__bizReel={at:W,slug:G[W].slug,inRange:a,n:G.length,held:N.size}}const se=(P.phoneRight*R-(P.left+P.deskLeft*(1-R))*(1-L))*w,rt=P.phoneUp*R,Ce=C(.5,1,f);d.forEach((a,n)=>{const H=n===v-1?L:0,it=(n-(M-1))*P.step*w-(n<v-1?.5*L*w:0);a.x=c*(it+se),a.y=rt,a.mesh.position.set(a.x,a.y,0),a.mat.uniforms.uGrow.value=H,a.mat.uniforms.uOpacity.value=Ce;const me=ae(n),lt=Ce>0&&me.x<s.viewport.width&&me.x+me.w>0;a.mesh.visible=lt;const _e=r&&e>0&&e<1&&Math.abs(n-A)<=1,Re=Ue&&r&&e>0&&e<1;Re&&!l&&(a.clock+=o),a.screen.want(_e);const de=n===A;"frame"in a.screen&&a.screen.frame(t,de);const ze=a.screen.texture.image,y=ze instanceof HTMLVideoElement?ze:null,re=(n<u?de:_e)&&Re;if(n<u&&!de&&(a.clock=0),y&&y.duration>0)if(y!==a.el||re&&!a.ran){a.el=y;const D=a.clock%y.duration;Math.abs(y.currentTime-D)>.25&&(y.currentTime=D)}else re&&!y.paused&&(a.clock=y.currentTime+Math.floor(a.clock/y.duration)*y.duration);a.ran=re,re?a.screen.play():n===u&&e>.97||a.screen.pause(),a.mat.uniforms.uMap.value=a.screen.texture;{const D=a.screen.texture;n<u&&D&&D.anisotropy!==Ae&&(D.anisotropy=Ae,D.minFilter=dt,D.generateMipmaps=!1,D.needsUpdate=!0)}n===u&&y&&y.videoWidth>0&&(a.mat.uniforms.uFilmAsp.value=y.videoWidth/y.videoHeight),n===u&&(a.mat.uniforms.uFit.value=1-C(.6,1,H));const Ie=We(a.screen);a.mat.uniforms.uGain.value=Ie>.62?S(.62/Ie,.75,1):1});const k=B.uniforms,oe=S(Math.floor(M-1),0,v-1),J=Math.min(v-1,oe+1),nt=S(M-1-oe);k.uMix.value=J>oe?C(.3,.7,nt):0;const ve=k.uMix.value>.999?J:oe;k.uA.value=d[ve].screen.texture,k.uB.value=k.uMix.value>.001&&k.uMix.value<.999?d[J].screen.texture:k.uA.value,ve===J&&(k.uMix.value=0),k.uGainA.value=De(d[ve].screen),k.uGainB.value=De(d[J].screen),k.uFilm.value=.4*(1-L)*(l?1:C(.25,.75,f)),k.uLetters.value=l?0:.8*(1-f),k.uDrift.value=(l?0:t*.015)+M*.2;const Oe=l?0:t;if(Y.uniforms.uGridX.value=Oe+M*.056*45/Z.w,Y.uniforms.uPlusX.value=(Oe*.01+M*.42+.2*f)*w,Y.uniforms.uAmt.value=1-L,_.visible=!1,$.visible=!0,et){const a=ae(A),n=s.viewport;globalThis.__roomProbe={room:xe,idx:A,count:+M.toFixed(3),e:+f.toFixed(3),grow:+L.toFixed(3),x0:+(a.x/n.width*100).toFixed(1),x1:+((a.x+a.w)/n.width*100).toFixed(1),wPct:+(a.w/n.width*100).toFixed(1),y0:+(a.y/n.height*100).toFixed(1),y1:+((a.y+a.h)/n.height*100).toFixed(1),...at(A),sIn:+z.toFixed(3),nb:A+1<v?+(ae(A+1).x/n.width*100).toFixed(1):null}}},pick(e,t){const o=S(Math.round(M)-1,0,v-1);return Pe(e,t,o)?Ye(o):null},hover(e,t){return s.pointer.inside&&Pe(e,t,S(Math.round(M)-1,0,v-1))},dispose(){ue.dispose(),K.geometry.dispose(),_.geometry.dispose(),B.dispose(),ee.dispose(),ke.tex.dispose(),d.forEach(e=>{e.mat.dispose(),e.screen.pause(),"dispose"in e.screen&&e.screen.dispose()})}}};export{E as BIZ_SCREENS,It as default};
