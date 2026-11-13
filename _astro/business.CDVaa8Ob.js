import{b as be,B as ye,I as it,J as ut,aa as lt,S as ct,P as ft,G as ht,M as le,a as we,bg as vt,k as ze,am as S,a8 as D,W as pt,aB as mt,bh as dt,s as wt,a7 as $e,r as gt}from"./EditionWorld.astro_astro_type_script_index_0_lang.CNgnDUaL.js";import{f as xt}from"./tv.BV_BkhwV.js";import{m as qe}from"./media-base.DZ9PvFge.js";import{c as yt}from"./_chapters.DYSwwyiF.js";import{a as bt}from"./_cinema.IpitRvjG.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Mt=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),Ve=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,He=(t,f,g,u,i)=>-Math.sin(i*t/u*Math.PI+g)*f,kt=(t,f,g,u,i)=>-Math.cos(i*t/u*Math.PI+g)*f*i*Math.PI/u,ce=()=>{const t=new lt(new Uint8Array([0,0,0,255]),1,1);return t.needsUpdate=!0,t};function Be(t){return new be({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...t,uMap:{value:ce()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new ye(1,1)},uScreen:{value:new ye(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1},uFit:{value:0}},vertexShader:`${Ve}
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
  }`;function At(t){return new be({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...t,uA:{value:ce()},uB:{value:ce()},uMix:{value:0},uFilm:{value:.4},uL:{value:ce()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new ye(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${Ve}
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
      }`})}function Ft(t,f){const u=document.createElement("canvas"),i=u.getContext("2d"),C=f?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;i.font=C;const v=Math.ceil(i.measureText(t).width+256*.1);u.width=Math.min(4096,v),u.height=256,i.font=C,i.fillStyle="#fff",i.textBaseline="alphabetic",i.direction=f?"rtl":"ltr",i.textAlign="center",i.fillText(t,u.width/2,256*.82);const I=new it(u);return I.anisotropy=8,I.minFilter=ut,{tex:I,aspect:u.width/u.height}}function Gt(){return new be({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
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
      }`})}const ge="business",Pt={en:"FILMS",ar:"أفلام"},Lt=.3,Ne=10,xe=50,T={amp:4,phoneWeak:.2,step:.95,panelH:.3,panelW:.453,phoneRight:.09*.95,left:.05,phoneUp:.6,phase:8},ee={w:1.4,h:1.7},P={pre:.244,entry:2,panel:1.6912,grow:1.5};function Et(){try{const t=JSON.parse(document.querySelector("script[data-biz-reel]")?.textContent||"[]");return Array.isArray(t)?t.filter(f=>f&&f.loop&&f.poster):[]}catch{return[]}}function Wt(){try{const t=JSON.parse(document.querySelector("script[data-door-ribbon]")?.textContent||"{}");return{films:Array.isArray(t.films)?t.films.filter(f=>f&&f.poster):[],hall:typeof t.hall=="string"?t.hall:""}}catch{return{films:[],hall:""}}}const It=async t=>{const f=t.lang==="ar",g=f?"ar":"en",u=f?-1:1,i=matchMedia("(prefers-reduced-motion: reduce)").matches,C=vt,v=C.length,I=Wt(),te=I.films[0],Ke=I.hall||`${t.base}/${g}/cinema`,Xe=P.pre+P.entry+v*P.panel+P.grow;await xt();const ae=new ct,A=new ft(xe,t.viewport.aspect,.1,100);A.position.set(0,0,Ne),A.lookAt(0,0,0);const U=new ht;ae.add(U);const x=Mt();x.uDir.value=u;const B=At(x),N=new le(new we(1,1,96,1),B);N.renderOrder=0,N.frustumCulled=!1,U.add(N);const Me=Ft(Pt[g],f);B.uniforms.uL.value=Me.tex;const se=B,je=!!t.quality||t.viewport.portrait,fe=new we(1,1,24,8),m=C.map((e,s)=>{const r=Be(x),o=new le(fe,r);o.renderOrder=2+s,o.frustumCulled=!1,U.add(o),r.uniforms.uFit.value=1;const l=t.media.screen(qe(`motion/world/films/${e.file[g]}.mp4`),qe(`motion/world/films/${e.file[g]}.webp`));return{a:e,mesh:o,mat:r,screen:l,x:0,y:0,luma:Lt,clock:0,el:null,ran:!1}}),L=Et(),V=new Map,he=e=>{let s=V.get(e);return s||(s=t.media.screen(L[e].loop,L[e].poster),V.set(e,s)),s};let W=0,ve=!1,ke=!1;const Je=()=>{const e=(W+1)%L.length;for(const[s,r]of V)s!==W&&s!==e&&(r.forget?r.forget():r.release(),V.delete(s))};if(te){const e=Be(x),s=new le(fe,e);s.frustumCulled=!1,U.add(s),e.uniforms.uLevel.value=1.08;const r=bt(te),l=L[0]?he(0):r?t.media.screen(r,te.poster):yt([te.poster],{big:je,rtl:f,period:5,sweep:0});e.uniforms.uFit.value=1,m.push({a:{id:"cinema"},mesh:s,mat:e,screen:l,x:0,y:0,luma:.3,clock:0,el:null,ran:!1})}const h=m.length;m[h-1].mesh.renderOrder=20;const F=Gt(),R=new le(new we(1,1),F);R.frustumCulled=!1,R.renderOrder=100,R.visible=!1,ae.add(R);let O=null,re=1,K=1,d=1,X=1,Se=1,j=1,J=1;function Ae(){A.fov=xe,A.aspect=t.viewport.aspect,A.updateProjectionMatrix(),K=2*Ne*Math.tan(wt.degToRad(xe/2)),re=K*A.aspect,d=Math.max(K,re),X=S((16/9-A.aspect)/(16/9-9/16)),Se=T.amp*(1-T.phoneWeak*X),J=T.panelH*d,j=T.panelW*d,x.uWs.value=d,N.scale.set(ee.w*d,ee.h*d,1),se.uniforms.uWall.value.set(ee.w*d,ee.h*d),m.forEach(e=>{e.mesh.scale.set(j,J,1),e.mat.uniforms.uSize.value.set(j,J),e.mat.uniforms.uScreen.value.set(re,K),e.mat.uniforms.uK.value=.2+.1*(1-X)}),F.uniforms.uAsp.value=t.viewport.aspect,F.uniforms.uDir.value=u,O?.setSize(Math.round(t.viewport.width*t.viewport.dpr),Math.round(t.viewport.height*t.viewport.dpr))}Ae();const Ze=e=>e>=v?Ke:`${t.base}/${C[e].href[g]}`,Qe=!!globalThis.__roomProbeOn,Z=new ze,Ye=new ze,oe=e=>{const s=m[e],r=s.mat.uniforms.uGrow.value,o=s.mat.uniforms.uK.value;let l=1e9,p=1e9,b=-1e9,c=-1e9;for(let k=0;k<=12;k++)for(const _ of[-.5,.5]){const $=(k/12-.5)*j,E=s.x+$,G=u>0?k/12:1-k/12,q=D(0,1,-G*o+r*(1+o));Z.set(E,s.y+_*J,He(E,x.uAmp.value,x.uPhase.value,d,u)),Z.lerp(Ye.set((k/12-.5)*re*1.02,_*K*1.02,0),q).project(A);const Q=(Z.x+1)/2*t.viewport.width,ne=(1-Z.y)/2*t.viewport.height;l=Math.min(l,Q),b=Math.max(b,Q),p=Math.min(p,ne),c=Math.max(c,ne)}return{x:l,y:p,w:b-l,h:c-p}},et=e=>{const s=m[e],r=t.viewport.height,o=[-.5,.5].map(p=>{const b=s.x+p*j,c=He(b,x.uAmp.value,x.uPhase.value,d,u),k=_=>(1-Z.set(b,s.y+_*J,c).project(A).y)/2*r;return(k(-.5)-k(.5))/r*100}),l=Math.atan(Math.abs(kt(s.x,x.uAmp.value,x.uPhase.value,d,u)))*180/Math.PI;return{hL:+o[0].toFixed(1),hR:+o[1].toFixed(1),turn:+l.toFixed(1)}},Fe=(e,s,r)=>{const o=oe(r),l=(e+1)/2*t.viewport.width,p=(1-s)/2*t.viewport.height;return l>=o.x&&l<=o.x+o.w&&p>=o.y&&p<=o.y+o.h},Ge=()=>document.querySelector(`[data-app-card="${ge}"]`),tt=()=>{const e=Ge();if(!e)return;e.classList.remove("is-moving");const s=e.querySelector('[data-app-field="line"]'),r=s?.textContent?.match(/^.+?[.!?؟](?=\s|$)/);s&&r&&r[0].length<s.textContent.length&&(s.textContent=r[0]);const o=e.querySelector('[data-app-field="name"]');if(o){const l=o.querySelector(".wo-sr-text")?.textContent??o.textContent??"";e.classList.add("is-service"),dt(o,l,{stagger:.04});const p=e.querySelector('[data-app-field="link"]'),b=p?.querySelector('[data-app-field="watch"]')?.textContent?.trim();p&&b&&p.setAttribute("aria-label",`${b}: ${l}`)}},Pe=e=>m.find(s=>s.screen===e)?.luma??e.luma??.3,Le=e=>S(.3/Math.max(Pe(e),.3),.45,1),at=.4;let y=.5,Ee=-1,We=!1,z=0,Te=0;return{scene:ae,camera:A,resize:Ae,focus(e){We=e,e||(ve=!1),e||m.forEach((s,r)=>{r===v&&Te>.97||(s.screen.pause(),s.screen.release())})},update({p:e,t:s,dt:r,active:o}){Te=e;const l=e*Xe,p=1+(l-P.pre-P.entry-P.panel/2)/P.panel;let b=S(p,.5,h);const c=i?1:S((l-P.pre)/(P.entry*at));b-=.4*(1-c);const k=S(Math.round(b),1,h),_=k+.4*(b-k);y=i?_:$e(y,_,5,r);const $=h>v?gt(h-.55,h+.3,p):0;z=i||e>=.985||$<=0?e>=.985&&h>v?1:$:Math.max($e(z,$,7,r),$-.12);const E=h>v?Math.min(1,S(y-(h-.5),0,.5)+.5*z):0;x.uAmp.value=Se*c*(1-z),x.uPhase.value=T.phase*(1-c)-2*z;const G=S(Math.round(y)-1,0,h-1),q=Math.min(G,v-1);if(q!==Ee){Ee=q;const a=C[q];t.emit("app",{room:ge,id:a.id,index:q,count:v,film:{name:a.name[g],line:a.line[g]??"",href:`${t.base}/${a.href[g]}`}}),tt()}const Q=Ge();if(Q&&Q.style.setProperty("--bz-on",(1-Math.pow(1-c,2))*D(.14,.24,c)*(1-D(0,.25,E))+""),h>v&&L.length){const a=o&&e>0&&e<1&&Math.abs(v-G)<=1;if(a&&!ve&&ke){W=(W+1)%L.length;const n=m[v],H=n.screen;n.screen=he(W),n.el=null,n.ran=!1,n.clock=0,H!==n.screen&&(H.pause(),H.release())}a&&(ke=!0),ve=a,he((W+1)%L.length),Je(),t.bizReelNow=L[W],globalThis.__bizReel={at:W,slug:L[W].slug,inRange:a,n:L.length,held:V.size}}const ne=(T.phoneRight*X-T.left*(1-E))*d,st=T.phoneUp*X,De=D(.5,1,c);m.forEach((a,n)=>{const H=n===h-1?E:0,ot=(n-(y-1))*T.step*d-(n<h-1?.5*E*d:0);a.x=u*(ot+ne),a.y=st,a.mesh.position.set(a.x,a.y,0),a.mat.uniforms.uGrow.value=H,a.mat.uniforms.uOpacity.value=De;const me=oe(n),nt=De>0&&me.x<t.viewport.width&&me.x+me.w>0;a.mesh.visible=nt;const Ue=o&&e>0&&e<1&&Math.abs(n-G)<=1,Re=We&&o&&e>0&&e<1;Re&&!i&&(a.clock+=r),a.screen.want(Ue);const de=n===G;"frame"in a.screen&&a.screen.frame(s,de);const Oe=a.screen.texture.image,w=Oe instanceof HTMLVideoElement?Oe:null,ue=(n<v?de:Ue)&&Re;if(n<v&&!de&&(a.clock=0),w&&w.duration>0)if(w!==a.el||ue&&!a.ran){a.el=w;const Ie=a.clock%w.duration;Math.abs(w.currentTime-Ie)>.25&&(w.currentTime=Ie)}else ue&&!w.paused&&(a.clock=w.currentTime+Math.floor(a.clock/w.duration)*w.duration);a.ran=ue,ue?a.screen.play():n===v&&e>.97||a.screen.pause(),a.mat.uniforms.uMap.value=a.screen.texture,w&&w.videoWidth>0&&(a.mat.uniforms.uFilmAsp.value=w.videoWidth/w.videoHeight),n===v&&(a.mat.uniforms.uFit.value=1-D(.6,1,H));const _e=Pe(a.screen);a.mat.uniforms.uGain.value=_e>.62?S(.62/_e,.75,1):1});const M=B.uniforms,ie=S(Math.floor(y-1),0,h-1),Y=Math.min(h-1,ie+1),rt=S(y-1-ie);M.uMix.value=Y>ie?D(.3,.7,rt):0;const pe=M.uMix.value>.999?Y:ie;M.uA.value=m[pe].screen.texture,M.uB.value=M.uMix.value>.001&&M.uMix.value<.999?m[Y].screen.texture:M.uA.value,pe===Y&&(M.uMix.value=0),M.uGainA.value=Le(m[pe].screen),M.uGainB.value=Le(m[Y].screen),M.uFilm.value=.4*(1-E),M.uLetters.value=i?0:.8*(1-c),M.uDrift.value=(i?0:s*.015)+y*.2;const Ce=i?0:s;if(se.uniforms.uGridX.value=Ce+y*.056*45/ee.w,se.uniforms.uPlusX.value=(Ce*.01+y*.42+.2*c)*d,se.uniforms.uAmt.value=1-E,R.visible=!1,c<.9999&&o){const a=t.renderer;O||(O=new pt(Math.round(t.viewport.width*t.viewport.dpr),Math.round(t.viewport.height*t.viewport.dpr),{depthBuffer:!1}),O.texture.colorSpace=mt);const n=a.getRenderTarget();U.visible=!0,a.setRenderTarget(O),a.setClearColor(0,1),a.clear(),a.render(ae,A),a.setRenderTarget(n),a.setClearColor(0,0),F.uniforms.uMap.value=O.texture,F.uniforms.uE.value=c,F.uniforms.uTime.value=30+8*c,F.uniforms.uClock.value=s,F.uniforms.uWig.value=1-D(0,.4,c),F.uniforms.uG.value=D(.02,P.pre+.1,l),F.uniforms.uPx.value=Math.max(1,t.viewport.height*t.viewport.dpr/850),U.visible=!1,R.visible=!0}else U.visible=!0;if(Qe){const a=oe(G),n=t.viewport;globalThis.__roomProbe={room:ge,idx:G,count:+y.toFixed(3),e:+c.toFixed(3),grow:+E.toFixed(3),x0:+(a.x/n.width*100).toFixed(1),x1:+((a.x+a.w)/n.width*100).toFixed(1),wPct:+(a.w/n.width*100).toFixed(1),...et(G),sIn:+z.toFixed(3),nb:G+1<h?+(oe(G+1).x/n.width*100).toFixed(1):null}}},pick(e,s){const r=S(Math.round(y)-1,0,h-1);return Fe(e,s,r)?Ze(r):null},hover(e,s){return t.pointer.inside&&Fe(e,s,S(Math.round(y)-1,0,h-1))},dispose(){fe.dispose(),N.geometry.dispose(),R.geometry.dispose(),B.dispose(),F.dispose(),O?.dispose(),Me.tex.dispose(),m.forEach(e=>{e.mat.dispose(),e.screen.pause(),"dispose"in e.screen&&e.screen.dispose()})}}};export{P as BIZ_SCREENS,It as default};
