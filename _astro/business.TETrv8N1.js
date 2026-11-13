import{b as ye,B as xe,I as nt,J as it,aa as lt,S as ut,P as ct,G as ft,M as ie,a as de,bg as ht,k as Ie,am as A,a8 as $,bh as vt,s as mt,a7 as $e,r as pt}from"./EditionWorld.astro_astro_type_script_index_0_lang.BeXFjqJb.js";import{f as dt}from"./tv.BmIPxk2P.js";import{m as qe}from"./media-base.DZ9PvFge.js";import{c as wt}from"./_chapters.Bc6Uib5f.js";import{a as gt}from"./_cinema.D-xufYvP.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const xt=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),Ne=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,ze=(t,c,g,l,i)=>-Math.sin(i*t/l*Math.PI+g)*c,yt=(t,c,g,l,i)=>-Math.cos(i*t/l*Math.PI+g)*c*i*Math.PI/l,le=()=>{const t=new lt(new Uint8Array([0,0,0,255]),1,1);return t.needsUpdate=!0,t};function He(t){return new ye({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...t,uMap:{value:le()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new xe(1,1)},uScreen:{value:new xe(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1},uFit:{value:0}},vertexShader:`${Ne}
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
      uniform sampler2D uMap; uniform float uLevel, uGrow, uFilmAsp, uOpacity, uGain, uFit; varying vec2 vUv; varying float vAsp;
      void main(){
        vec2 uv = vUv - .5;
        // cover (uFit 0): the film fills the rectangle, its edges cut; contain (uFit 1, world-56): its whole frame inside
        float r = vAsp / uFilmAsp;
        uv *= mix(r < 1. ? vec2(r, 1.) : vec2(1., 1. / r), r < 1. ? vec2(1., 1. / r) : vec2(r, 1.), uFit);
        uv *= mix(1., 1. / .92, uFit);   // a 4 % rim of dark glass on every side: the phone's panel reaches .7 % past the screen's edge
        vec2 q = abs(uv), px = fwidth(uv) * 1.5;
        float inside = (1. - smoothstep(.5 - px.x, .5, q.x)) * (1. - smoothstep(.5 - px.y, .5, q.y));
        vec3 col = texture2D(uMap, clamp(uv + .5, 0., 1.)).rgb * uLevel * uGain;
        float a = mix(smoothstep(1., .3, length(vUv - .5)), 1., uGrow);
        float glass = .82;   // the panel's own dark glass round a whole film (contain): dark, never a colour
        col = mix(vec3(.018, .02, .026), col, mix(1., inside, uFit));
        a = mix(a, mix(a * glass, 1., inside), uFit);
        gl_FragColor = vec4(col, a * uOpacity);
      }`})}const bt=`
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
  }`;function Mt(t){return new ye({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...t,uA:{value:le()},uB:{value:le()},uMix:{value:0},uFilm:{value:.4},uL:{value:le()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new xe(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${Ne}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uA, uB, uL; uniform float uMix, uFilm, uDrift, uLetters, uDir, uGainA, uGainB; varying vec2 vUv;
      ${bt}
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
      }`})}function kt(t,c){const l=document.createElement("canvas"),i=l.getContext("2d"),D=c?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;i.font=D;const h=Math.ceil(i.measureText(t).width+256*.1);l.width=Math.min(4096,h),l.height=256,i.font=D,i.fillStyle="#fff",i.textBaseline="alphabetic",i.direction=c?"rtl":"ltr",i.textAlign="center",i.fillText(t,l.width/2,256*.82);const T=new nt(l);return T.anisotropy=8,T.minFilter=it,{tex:T,aspect:l.width/l.height}}function At(){return new ye({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
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
      }`})}const we="business",St={en:"FILMS",ar:"أفلام"},Ft=.3,Be=10,ge=50,W={amp:4,phoneWeak:.2,step:.95,panelH:.3,panelW:.453,phoneRight:.09*.95,left:.05,phoneUp:.6,phase:8},Q={w:1.4,h:1.7},L={pre:.244,entry:2,panel:1.6912,grow:1.5};function Gt(){try{const t=JSON.parse(document.querySelector("script[data-biz-reel]")?.textContent||"[]");return Array.isArray(t)?t.filter(c=>c&&c.loop&&c.poster):[]}catch{return[]}}function Pt(){try{const t=JSON.parse(document.querySelector("script[data-door-ribbon]")?.textContent||"{}");return{films:Array.isArray(t.films)?t.films.filter(c=>c&&c.poster):[],hall:typeof t.hall=="string"?t.hall:""}}catch{return{films:[],hall:""}}}const Ot=async t=>{const c=t.lang==="ar",g=c?"ar":"en",l=c?-1:1,i=matchMedia("(prefers-reduced-motion: reduce)").matches,D=ht,h=D.length,T=Pt(),Y=T.films[0],Ve=T.hall||`${t.base}/${g}/cinema`,Ke=L.pre+L.entry+h*L.panel+L.grow;await dt();const ue=new ut,F=new ct(ge,t.viewport.aspect,.1,100);F.position.set(0,0,Be),F.lookAt(0,0,0);const q=new ft;ue.add(q);const x=xt();x.uDir.value=l;const z=Mt(x),H=new ie(new de(1,1,96,1),z);H.renderOrder=0,H.frustumCulled=!1,q.add(H);const be=kt(St[g],c);z.uniforms.uL.value=be.tex;const ee=z,Xe=!!t.quality||t.viewport.portrait,ce=new de(1,1,24,8),m=D.map((e,s)=>{const o=He(x),r=new ie(ce,o);r.renderOrder=2+s,r.frustumCulled=!1,q.add(r),o.uniforms.uFit.value=1;const u=t.media.screen(qe(`motion/world/films/${e.file[g]}.mp4`),qe(`motion/world/films/${e.file[g]}.webp`));return{a:e,mesh:r,mat:o,screen:u,x:0,y:0,luma:Ft,clock:0,el:null,ran:!1}}),G=Gt(),B=new Map,fe=e=>{let s=B.get(e);return s||(s=t.media.screen(G[e].loop,G[e].poster),B.set(e,s)),s};let E=0,he=!1,Me=!1;const je=()=>{const e=(E+1)%G.length;for(const[s,o]of B)s!==E&&s!==e&&(o.forget?o.forget():o.release(),B.delete(s))};if(Y){const e=He(x),s=new ie(ce,e);s.frustumCulled=!1,q.add(s),e.uniforms.uLevel.value=1.08;const o=gt(Y),u=G[0]?fe(0):o?t.media.screen(o,Y.poster):wt([Y.poster],{big:Xe,rtl:c,period:5,sweep:0});e.uniforms.uFit.value=1,m.push({a:{id:"cinema"},mesh:s,mat:e,screen:u,x:0,y:0,luma:.3,clock:0,el:null,ran:!1})}const f=m.length;m[f-1].mesh.renderOrder=20;const te=At(),C=new ie(new de(1,1),te);C.frustumCulled=!1,C.renderOrder=100,C.visible=!1,ue.add(C);let ae=1,N=1,p=1,V=1,ke=1,K=1,X=1;function Ae(){F.fov=ge,F.aspect=t.viewport.aspect,F.updateProjectionMatrix(),N=2*Be*Math.tan(mt.degToRad(ge/2)),ae=N*F.aspect,p=Math.max(N,ae),V=A((16/9-F.aspect)/(16/9-9/16)),ke=W.amp*(1-W.phoneWeak*V),X=W.panelH*p,K=W.panelW*p,x.uWs.value=p,H.scale.set(Q.w*p,Q.h*p,1),ee.uniforms.uWall.value.set(Q.w*p,Q.h*p),m.forEach(e=>{e.mesh.scale.set(K,X,1),e.mat.uniforms.uSize.value.set(K,X),e.mat.uniforms.uScreen.value.set(ae,N),e.mat.uniforms.uK.value=.2+.1*(1-V)}),te.uniforms.uAsp.value=t.viewport.aspect,te.uniforms.uDir.value=l}Ae();const Je=e=>e>=h?Ve:`${t.base}/${D[e].href[g]}`,Ze=!!globalThis.__roomProbeOn,j=new Ie,Qe=new Ie,se=e=>{const s=m[e],o=s.mat.uniforms.uGrow.value,r=s.mat.uniforms.uK.value;let u=1e9,v=1e9,b=-1e9,d=-1e9;for(let k=0;k<=12;k++)for(const U of[-.5,.5]){const R=(k/12-.5)*K,P=s.x+R,S=l>0?k/12:1-k/12,_=$(0,1,-S*r+o*(1+r));j.set(P,s.y+U*X,ze(P,x.uAmp.value,x.uPhase.value,p,l)),j.lerp(Qe.set((k/12-.5)*ae*1.02,U*N*1.02,0),_).project(F);const J=(j.x+1)/2*t.viewport.width,oe=(1-j.y)/2*t.viewport.height;u=Math.min(u,J),b=Math.max(b,J),v=Math.min(v,oe),d=Math.max(d,oe)}return{x:u,y:v,w:b-u,h:d-v}},Ye=e=>{const s=m[e],o=t.viewport.height,r=[-.5,.5].map(v=>{const b=s.x+v*K,d=ze(b,x.uAmp.value,x.uPhase.value,p,l),k=U=>(1-j.set(b,s.y+U*X,d).project(F).y)/2*o;return(k(-.5)-k(.5))/o*100}),u=Math.atan(Math.abs(yt(s.x,x.uAmp.value,x.uPhase.value,p,l)))*180/Math.PI;return{hL:+r[0].toFixed(1),hR:+r[1].toFixed(1),turn:+u.toFixed(1)}},Se=(e,s,o)=>{const r=se(o),u=(e+1)/2*t.viewport.width,v=(1-s)/2*t.viewport.height;return u>=r.x&&u<=r.x+r.w&&v>=r.y&&v<=r.y+r.h},Fe=()=>document.querySelector(`[data-app-card="${we}"]`),et=()=>{const e=Fe();if(!e)return;e.classList.remove("is-moving");const s=e.querySelector('[data-app-field="line"]'),o=s?.textContent?.match(/^.+?[.!?؟](?=\s|$)/);s&&o&&o[0].length<s.textContent.length&&(s.textContent=o[0]);const r=e.querySelector('[data-app-field="name"]');if(r){const u=r.querySelector(".wo-sr-text")?.textContent??r.textContent??"";e.classList.add("is-service"),vt(r,u,{stagger:.04});const v=e.querySelector('[data-app-field="link"]'),b=v?.querySelector('[data-app-field="watch"]')?.textContent?.trim();v&&b&&v.setAttribute("aria-label",`${b}: ${u}`)}},Ge=e=>m.find(s=>s.screen===e)?.luma??e.luma??.3,Pe=e=>A(.3/Math.max(Ge(e),.3),.45,1),tt=.4;let y=.5,Le=-1,Ee=!1,O=0,We=0;return{scene:ue,camera:F,resize:Ae,focus(e){Ee=e,e||(he=!1),e||m.forEach((s,o)=>{o===h&&We>.97||(s.screen.pause(),s.screen.release())})},update({p:e,t:s,dt:o,active:r}){We=e;const u=e*Ke,v=1+(u-L.pre-L.entry-L.panel/2)/L.panel;let b=A(v,.5,f);const d=i?1:A((u-L.pre)/(L.entry*tt));b-=.4*(1-d);const k=A(Math.round(b),1,f),U=k+.4*(b-k);y=i?U:$e(y,U,5,o);const R=f>h?pt(f-.55,f+.3,v):0;O=i||e>=.985||R<=0?e>=.985&&f>h?1:R:Math.max($e(O,R,7,o),R-.12);const P=f>h?Math.min(1,A(y-(f-.5),0,.5)+.5*O):0;x.uAmp.value=ke*d*(1-O),x.uPhase.value=W.phase*(1-d)-2*O;const S=A(Math.round(y)-1,0,f-1),_=Math.min(S,h-1);if(_!==Le){Le=_;const a=D[_];t.emit("app",{room:we,id:a.id,index:_,count:h,film:{name:a.name[g],line:a.line[g]??"",href:`${t.base}/${a.href[g]}`}}),et()}const J=Fe();if(J&&J.style.setProperty("--bz-on",(1-Math.pow(1-d,2))*$(.14,.24,d)*(1-$(0,.25,P))+""),f>h&&G.length){const a=r&&e>0&&e<1&&Math.abs(h-S)<=1;if(a&&!he&&Me){E=(E+1)%G.length;const n=m[h],I=n.screen;n.screen=fe(E),n.el=null,n.ran=!1,n.clock=0,I!==n.screen&&(I.pause(),I.release())}a&&(Me=!0),he=a,fe((E+1)%G.length),je(),t.bizReelNow=G[E],globalThis.__bizReel={at:E,slug:G[E].slug,inRange:a,n:G.length,held:B.size}}const oe=(W.phoneRight*V-W.left*(1-P))*p,at=W.phoneUp*V,De=$(.5,1,d);m.forEach((a,n)=>{const I=n===f-1?P:0,ot=(n-(y-1))*W.step*p-(n<f-1?.5*P*p:0);a.x=l*(ot+oe),a.y=at,a.mesh.position.set(a.x,a.y,0),a.mat.uniforms.uGrow.value=I,a.mat.uniforms.uOpacity.value=De;const me=se(n),rt=De>0&&me.x<t.viewport.width&&me.x+me.w>0;a.mesh.visible=rt;const Te=r&&e>0&&e<1&&Math.abs(n-S)<=1,Ce=Ee&&r&&e>0&&e<1;Ce&&!i&&(a.clock+=o),a.screen.want(Te);const pe=n===S;"frame"in a.screen&&a.screen.frame(s,pe);const Oe=a.screen.texture.image,w=Oe instanceof HTMLVideoElement?Oe:null,ne=(n<h?pe:Te)&&Ce;if(n<h&&!pe&&(a.clock=0),w&&w.duration>0)if(w!==a.el||ne&&!a.ran){a.el=w;const _e=a.clock%w.duration;Math.abs(w.currentTime-_e)>.25&&(w.currentTime=_e)}else ne&&!w.paused&&(a.clock=w.currentTime+Math.floor(a.clock/w.duration)*w.duration);a.ran=ne,ne?a.screen.play():n===h&&e>.97||a.screen.pause(),a.mat.uniforms.uMap.value=a.screen.texture,w&&w.videoWidth>0&&(a.mat.uniforms.uFilmAsp.value=w.videoWidth/w.videoHeight),n===h&&(a.mat.uniforms.uFit.value=1-$(.6,1,I));const Re=Ge(a.screen);a.mat.uniforms.uGain.value=Re>.62?A(.62/Re,.75,1):1});const M=z.uniforms,re=A(Math.floor(y-1),0,f-1),Z=Math.min(f-1,re+1),st=A(y-1-re);M.uMix.value=Z>re?$(.3,.7,st):0;const ve=M.uMix.value>.999?Z:re;M.uA.value=m[ve].screen.texture,M.uB.value=M.uMix.value>.001&&M.uMix.value<.999?m[Z].screen.texture:M.uA.value,ve===Z&&(M.uMix.value=0),M.uGainA.value=Pe(m[ve].screen),M.uGainB.value=Pe(m[Z].screen),M.uFilm.value=.4*(1-P),M.uLetters.value=i?0:.8*(1-d),M.uDrift.value=(i?0:s*.015)+y*.2;const Ue=i?0:s;if(ee.uniforms.uGridX.value=Ue+y*.056*45/Q.w,ee.uniforms.uPlusX.value=(Ue*.01+y*.42+.2*d)*p,ee.uniforms.uAmt.value=1-P,C.visible=!1,q.visible=!0,Ze){const a=se(S),n=t.viewport;globalThis.__roomProbe={room:we,idx:S,count:+y.toFixed(3),e:+d.toFixed(3),grow:+P.toFixed(3),x0:+(a.x/n.width*100).toFixed(1),x1:+((a.x+a.w)/n.width*100).toFixed(1),wPct:+(a.w/n.width*100).toFixed(1),...Ye(S),sIn:+O.toFixed(3),nb:S+1<f?+(se(S+1).x/n.width*100).toFixed(1):null}}},pick(e,s){const o=A(Math.round(y)-1,0,f-1);return Se(e,s,o)?Je(o):null},hover(e,s){return t.pointer.inside&&Se(e,s,A(Math.round(y)-1,0,f-1))},dispose(){ce.dispose(),H.geometry.dispose(),C.geometry.dispose(),z.dispose(),te.dispose(),be.tex.dispose(),m.forEach(e=>{e.mat.dispose(),e.screen.pause(),"dispose"in e.screen&&e.screen.dispose()})}}};export{L as BIZ_SCREENS,Ot as default};
