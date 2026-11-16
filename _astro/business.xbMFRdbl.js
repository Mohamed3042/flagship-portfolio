import{b as be,v as Me,K as lt,N as ct,ae as vt,S as ft,P as pt,G as mt,M as ne,a as we,bj as dt,bk as $e,k as Ie,aq as S,bl as He,ac as T,u as ht,bm as wt,s as xt,ab as Ke,r as gt}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";import{f as yt}from"./tv.CBd-UzF7.js";import{m as xe}from"./media-base.DZ9PvFge.js";import{c as Mt}from"./_chapters.V4OZpKmM.js";import{a as bt}from"./_cinema.DCCQX6g3.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const At=()=>({uAmp:{value:0},uPhase:{value:0},uWs:{value:1},uDir:{value:1}}),Xe=`
  uniform float uAmp, uPhase, uWs, uDir;
  float wave(float x){ return -sin(uDir * x / uWs * 3.14159265 + uPhase) * uAmp; }`,Be=(o,p,d,c,u)=>-Math.sin(u*o/c*Math.PI+d)*p,St=(o,p,d,c,u)=>-Math.cos(u*o/c*Math.PI+d)*p*u*Math.PI/c,ie=()=>{const o=new vt(new Uint8Array([0,0,0,255]),1,1);return o.needsUpdate=!0,o};function Ne(o){return new be({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...o,uMap:{value:ie()},uLevel:{value:1},uGrow:{value:0},uK:{value:.2},uSize:{value:new Me(1,1)},uScreen:{value:new Me(1,1)},uFilmAsp:{value:16/9},uOpacity:{value:1},uGain:{value:1},uSolid:{value:0},uFit:{value:0}},vertexShader:`${Xe}
      uniform float uGrow, uK; uniform vec2 uSize, uScreen; varying vec2 vUv; varying float vAsp;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        float u = uDir > 0. ? uv.x : 1. - uv.x;
        float g = smoothstep(0., 1., -u * uK + uGrow * (1. + uK));
        vec3 full = vec3(position.x * uScreen.x * 1.02, position.y * uScreen.y * 1.02, 0.);
        wp.xyz = mix(wp.xyz, full, g);
        vAsp = mix(uSize.x / uSize.y, uScreen.x / uScreen.y, uGrow);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uMap; uniform float uLevel, uGrow, uFilmAsp, uOpacity, uGain, uFit, uSolid; varying vec2 vUv; varying float vAsp;
      void main(){
        vec2 uv = vUv - .5;

        float r = vAsp / uFilmAsp;
        uv *= mix(r < 1. ? vec2(r, 1.) : vec2(1., 1. / r), r < 1. ? vec2(1., 1. / r) : vec2(r, 1.), uFit);
        uv *= mix(1., 1. / .92, uFit);
        vec2 q = abs(uv), px = fwidth(uv) * 1.5;
        float inside = (1. - smoothstep(.5 - px.x, .5, q.x)) * (1. - smoothstep(.5 - px.y, .5, q.y));
        vec3 col = texture2D(uMap, clamp(uv + .5, 0., 1.)).rgb * uLevel * uGain;
        float a = mix(smoothstep(1., .3, length(vUv - .5)), 1., max(uGrow, uSolid));
        float glass = .82;
        col = mix(vec3(.018, .02, .026), col, mix(1., inside, uFit));
        a = mix(a, mix(a * glass, 1., inside), uFit);
        gl_FragColor = vec4(col, a * uOpacity);
      }`})}const Ft=`
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
  }`;function Lt(o){return new be({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{...o,uA:{value:ie()},uB:{value:ie()},uMix:{value:0},uFilm:{value:.4},uL:{value:ie()},uDrift:{value:0},uLetters:{value:0},uGainA:{value:1},uGainB:{value:1},uWall:{value:new Me(1,1)},uGridX:{value:0},uPlusX:{value:0},uLine:{value:.03},uPlus:{value:.4},uAmt:{value:1}},vertexShader:`${Xe}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.);
        wp.z += wave(wp.x);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform sampler2D uA, uB, uL; uniform float uMix, uFilm, uDrift, uLetters, uDir, uGainA, uGainB; varying vec2 vUv;
      ${Ft}
      vec3 film(sampler2D m, vec2 uv){ return texture2D(m, vec2(.5 + (uv.x - .5) * .7, uv.y)).rgb; }
      void main(){
        float s = uDir > 0. ? vUv.x : 1. - vUv.x;
        vec3 col = vec3(0.);
        if (uFilm > .001) {
          vec3 fa = film(uA, vUv + vec2(uDir * .05 * uMix, 0.)) * uGainA;
          if (uMix > .001) fa = mix(fa, film(uB, vUv - vec2(uDir * .05 * (1. - uMix), 0.)) * uGainB, uMix);
          col = fa * uFilm * (1. - s);
        }
        if (uLetters > .001) {
          float R = 4.5, r = floor(vUv.y * R), v = fract(vUv.y * R);
          float u = fract(s * 1.1 + uDrift + r * .37) * 1.1;
          float L = u < 1. ? texture2D(uL, vec2(uDir > 0. ? u : 1. - u, v)).a : 0.;
          col += vec3(.86, .9, .96) * L * uLetters;
        }
        col += vec3(gridAt(vUv));
        gl_FragColor = vec4(col, 1.);
      }`})}function Pt(o,p){const c=document.createElement("canvas"),u=c.getContext("2d"),W=p?`800 ${256*.74}px "Cairo Variable", sans-serif`:`700 ${256*.9}px "Space Grotesk Variable", sans-serif`;u.font=W;const l=Math.ceil(u.measureText(o).width+256*.1);c.width=Math.min(4096,l),c.height=256,u.font=W,u.fillStyle="#fff",u.textBaseline="alphabetic",u.direction=p?"rtl":"ltr",u.textAlign="center",u.fillText(o,c.width/2,256*.82);const O=new lt(c);return O.anisotropy=8,O.minFilter=ct,{tex:O,aspect:c.width/c.height}}function kt(){return new be({transparent:!1,depthWrite:!1,depthTest:!1,uniforms:{uMap:{value:null},uE:{value:0},uTime:{value:0},uAsp:{value:.46},uDir:{value:1},uClock:{value:0},uWig:{value:0},uG:{value:1},uPx:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform float uE, uTime, uAsp, uDir, uClock, uWig, uG, uPx; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.), f.x), f.y); }
      float fbm(vec2 p){ return n2(p) * .55 + n2(p * 2.1 + 3.7) * .3 + n2(p * 4.3 + 9.1) * .15; }
      void main(){
        float k = 1. - uE;
        vec2 uv = vUv, c = uv - .5, p = vec2(c.x * uAsp, c.y);

        vec2 facet = vec2(fbm(p * 2.4 + vec2(uTime * .04, 0.)), fbm(p * 2.4 + 11.3 - uTime * .03)) - .5;
        vec2 bend = (c * (.55 - dot(p, p) * .8) + facet * .35) * k * .5 * (1. - smoothstep(.6, .9, uE));



        vec2 wig = vec2(0.);
        if (uWig > .001) {
          float r2 = dot(p, p);
          vec2 lensW = c * (r2 * 3.6 + .12) * .6;
          vec2 q = p * 1.5 + vec2(uClock * .1, uE * 1.6 - uClock * .06);
          vec2 d1 = vec2(fbm(q), fbm(q + 5.2)) - .5;
          vec2 d2 = vec2(fbm(q * 1.35 + d1 * 2.3 + 1.7), fbm(q * 1.35 + d1 * 2.3 + 9.2)) - .5;
          wig = (lensW + d2 * vec2(.055, .07)) * uWig;
        }



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




        float y0 = dot(c0, vec3(.2126, .7152, .0722));
        vec3 fr = sp - y0; fr -= dot(fr, vec3(.2126, .7152, .0722));
        float bw = smoothstep(.16, .6, y0 * (1. + 1.2 * k * k));
        float hh = h(floor(gl_FragCoord.xy / uPx) + 31.7);
        float spk = step(hh, pow(bw, .75) * mix(.08, 1.04, uG));
        if (uG < .999) spk = bw;
        float clean = smoothstep(.35, .8, uE);
        float lum = mix(spk, bw, clean) * mix(.9, .4, smoothstep(.0, .04, uE));
        lum *= 1. - .94 * smoothstep(.1, .42, uE);
        float rim = clamp(4. * bw * (1. - bw) + .12 * (1. - bw), 0., 1.);


        vec3 frE = clamp(fr, -.13, .13) * smoothstep(.03, .09, length(fr));
        frE *= max(1. - smoothstep(.2, .42, uE), ${typeof window<"u"&&window.__fringeOld?"1.":"0."});
        vec3 mono = vec3(lum) + frE * (.8 + .5 * k) * rim * max(spk, clean);
        col = mix(clamp(mono, 0., 1.), col, smoothstep(.75, 1., uE));
        gl_FragColor = vec4(col, 1.);
      }`})}const ge="business",Gt={en:"FILMS",ar:"أفلام"},Dt=.3,Ve=10,ye=50,G={amp:4,phoneWeak:.2,step:.95,panelH:.3,panelW:.453,phoneRight:.09*.95,left:.05,deskLeft:.04,phoneUp:.6,phase:8},Z={w:1.4,h:1.7},D={pre:.244,entry:2,panel:1.6912,grow:1.5};function Et(){try{const o=JSON.parse(document.querySelector("script[data-biz-reel]")?.textContent||"[]");return Array.isArray(o)?o.filter(p=>p&&p.loop&&p.poster):[]}catch{return[]}}function Ut(){try{const o=JSON.parse(document.querySelector("script[data-door-ribbon]")?.textContent||"{}");return{films:Array.isArray(o.films)?o.films.filter(p=>p&&p.poster):[],hall:typeof o.hall=="string"?o.hall:""}}catch{return{films:[],hall:""}}}const Rt=async o=>{const p=o.lang==="ar",d=p?"ar":"en",c=p&&!matchMedia("(min-width: 900px) and (min-aspect-ratio: 4/5)").matches?-1:1,u=matchMedia("(prefers-reduced-motion: reduce)").matches,W=dt,l=W.length,O=Ut(),Y=O.films[0],je=O.hall||`${o.base}/${d}/cinema`,Je=D.pre+D.entry+l*D.panel+D.grow;await yt();const ue=new ft,L=new pt(ye,o.viewport.aspect,.1,100);L.position.set(0,0,Ve),L.lookAt(0,0,0);const H=new mt;ue.add(H);const M=At();M.uDir.value=c;const K=Lt(M),B=new ne(new we(1,1,96,1),K);B.renderOrder=0,B.frustumCulled=!1,H.add(B);const Ae=Pt(Gt[d],p);K.uniforms.uL.value=Ae.tex;const Q=K,Ze=!!o.quality||o.viewport.portrait,le=new we(1,1,24,8),h=W.map((e,t)=>{const s=Ne(M),r=new ne(le,s);r.renderOrder=2+t,r.frustumCulled=!1,H.add(r),s.uniforms.uFit.value=0,s.uniforms.uSolid.value=1,s.uniforms.uFilmAsp.value=e.asp;const i=e.hd&&o.viewport.width*o.viewport.dpr*(o.viewport.portrait?.9:.56)>=1e3,f=$e(e.file[d],i),x=o.media.screen(xe(`motion/world/films/${f}.mp4`),xe(`motion/world/films/${$e(e.file[d],!1)}.webp`));return{a:e,mesh:r,mat:s,screen:x,x:0,y:0,pw:1,ph:1,luma:Dt,clock:0,el:null,ran:!1}}),P=Et(),N=new Map,ce=e=>{let t=N.get(e);return t||(t=o.media.screen(P[e].loop,P[e].poster),N.set(e,t)),t};let E=0,ve=!1,Se=!1;const Ye=()=>{const e=(E+1)%P.length;for(const[t,s]of N)t!==E&&t!==e&&(s.forget?s.forget():s.release(),N.delete(t))};if(Y){const e=Ne(M),t=new ne(le,e);t.frustumCulled=!1,H.add(t),e.uniforms.uLevel.value=1.08;const s=bt(Y),i=P[0]?ce(0):s?o.media.screen(s,Y.poster):Mt([Y.poster],{big:Ze,rtl:p,period:5,sweep:0});e.uniforms.uFit.value=1,h.push({a:{id:"cinema"},mesh:t,mat:e,screen:i,x:0,y:0,pw:1,ph:1,luma:.3,clock:0,el:null,ran:!1})}const m=h.length,Fe=o.renderer.capabilities.getMaxAnisotropy();h[m-1].mesh.renderOrder=20;const ee=kt(),_=new ne(new we(1,1),ee);_.frustumCulled=!1,_.renderOrder=100,_.visible=!1,ue.add(_);let te=1,V=1,w=1,z=1,Le=1,fe=1,Pe=1;function ke(){L.fov=ye,L.aspect=o.viewport.aspect,L.updateProjectionMatrix(),V=2*Ve*Math.tan(xt.degToRad(ye/2)),te=V*L.aspect,w=Math.max(V,te),z=S((16/9-L.aspect)/(16/9-9/16)),Le=G.amp*(1-G.phoneWeak*z),Pe=G.panelH*w,fe=G.panelW*w,M.uWs.value=w,B.scale.set(Z.w*w,Z.h*w,1),Q.uniforms.uWall.value.set(Z.w*w,Z.h*w);const e=.93;h.forEach((t,s)=>{const r=s<l?fe*e:fe,i=s<l?r/t.a.asp:Pe;t.pw=r,t.ph=i,t.mesh.scale.set(r,i,1),t.mat.uniforms.uSize.value.set(r,i),t.mat.uniforms.uScreen.value.set(te,V),t.mat.uniforms.uK.value=.2+.1*(1-z)}),ee.uniforms.uAsp.value=o.viewport.aspect,ee.uniforms.uDir.value=c}ke();const Qe=e=>e>=l?je:`${o.base}/${W[e].href[d]}`,et=!!globalThis.__roomProbeOn,X=new Ie,tt=new Ie,ae=e=>{const t=h[e],s=t.mat.uniforms.uGrow.value,r=t.mat.uniforms.uK.value;let i=1e9,f=1e9,x=-1e9,v=-1e9;for(let g=0;g<=12;g++)for(const C of[-.5,.5]){const R=(g/12-.5)*t.pw,k=t.x+R,F=c>0?g/12:1-g/12,$=T(0,1,-F*r+s*(1+r));X.set(k,t.y+C*t.ph,Be(k,M.uAmp.value,M.uPhase.value,w,c)),X.lerp(tt.set((g/12-.5)*te*1.02,C*V*1.02,0),$).project(L);const j=(X.x+1)/2*o.viewport.width,oe=(1-X.y)/2*o.viewport.height;i=Math.min(i,j),x=Math.max(x,j),f=Math.min(f,oe),v=Math.max(v,oe)}return{x:i,y:f,w:x-i,h:v-f}},at=e=>{const t=h[e],s=o.viewport.height,r=[-.5,.5].map(f=>{const x=t.x+f*t.pw,v=Be(x,M.uAmp.value,M.uPhase.value,w,c),g=C=>(1-X.set(x,t.y+C*t.ph,v).project(L).y)/2*s;return(g(-.5)-g(.5))/s*100}),i=Math.atan(Math.abs(St(t.x,M.uAmp.value,M.uPhase.value,w,c)))*180/Math.PI;return{hL:+r[0].toFixed(1),hR:+r[1].toFixed(1),turn:+i.toFixed(1)}},Ge=(e,t,s)=>{const r=ae(s),i=(e+1)/2*o.viewport.width,f=(1-t)/2*o.viewport.height;return i>=r.x&&i<=r.x+r.w&&f>=r.y&&f<=r.y+r.h},De=()=>document.querySelector(`[data-app-card="${ge}"]`),ot=()=>{const e=De();if(!e)return;e.classList.remove("is-moving");const t=W[Math.max(0,pe)],s=He[t.id],r=e.querySelector('[data-app-field="logo"]'),i=e.querySelector('[data-app-field="note"]');s&&r&&(r.src=xe(`motion/world/logos/${s.logo}.svg`),r.alt=s.logo==="mk-cloud"?"MK Cloud":s.logo==="mk-clone"?"MK Clone":"MK Studio",r.hidden=!1),s&&i&&(i.textContent=s.note[d]);const f=e.querySelector('[data-app-field="name"]');if(f){const x=f.querySelector(".wo-sr-text")?.textContent??f.textContent??"";e.classList.add("is-service"),wt(f,x,{stagger:.04});const v=e.querySelector('[data-app-field="link"]'),g=v?.querySelector('[data-app-field="watch"]')?.textContent?.trim();v&&g&&v.setAttribute("aria-label",`${g}: ${x}`)}},Ee=e=>h.find(t=>t.screen===e)?.luma??e.luma??.3,Ue=e=>S(.3/Math.max(Ee(e),.3),.45,1),st=.4;let b=.5,pe=-1,We=!1,q=0,Ce=0;return{scene:ue,camera:L,resize:ke,clean:1,focus(e){We=e,e||(ve=!1),e||h.forEach((t,s)=>{s===l&&Ce>.97||(t.screen.pause(),t.screen.release())})},update({p:e,t,dt:s,active:r}){Ce=e;const i=e*Je,f=1+(i-D.pre-D.entry-D.panel/2)/D.panel;let x=S(f,.5,m);const v=u?1:S((i-D.pre)/(D.entry*st));x-=.4*(1-v);const g=S(Math.round(x),1,m),C=g+.4*(x-g);b=u?C:Ke(b,C,5,s);const R=m>l?gt(m-.55,m+.3,f):0;q=u||e>=.985||R<=0?e>=.985&&m>l?1:R:Math.max(Ke(q,R,7,s),R-.12);const k=m>l?Math.min(1,S(b-(m-.5),0,.5)+.5*q):0;M.uAmp.value=(globalThis.__bizFlat?0:Le)*v*(1-q),M.uPhase.value=G.phase*(1-v)-2*q;const F=S(Math.round(b)-1,0,m-1),$=Math.min(F,l-1);if($!==pe){pe=$;const a=W[$];o.emit("app",{room:ge,id:a.id,index:$,count:l,film:{name:a.name[d],line:He[a.id]?.para[d]??a.line[d]??"",href:`${o.base}/${a.href[d]}`}}),ot()}const j=De();if(j&&j.style.setProperty("--bz-on",(1-Math.pow(1-v,2))*T(.14,.24,v)*(1-T(0,.25,k))+""),m>l&&P.length){const a=r&&e>0&&e<1&&Math.abs(l-F)<=1;if(a&&!ve&&Se){E=(E+1)%P.length;const n=h[l],I=n.screen;n.screen=ce(E),n.el=null,n.ran=!1,n.clock=0,I!==n.screen&&(I.pause(),I.release())}a&&(Se=!0),ve=a,ce((E+1)%P.length),Ye(),o.bizReelNow=P[E],globalThis.__bizReel={at:E,slug:P[E].slug,inRange:a,n:P.length,held:N.size}}const oe=(G.phoneRight*z-(G.left+G.deskLeft*(1-z))*(1-k))*w,rt=G.phoneUp*z,Te=T(.5,1,v);h.forEach((a,n)=>{const I=n===m-1?k:0,it=(n-(b-1))*G.step*w-(n<m-1?.5*k*w:0);a.x=c*(it+oe),a.y=rt,a.mesh.position.set(a.x,a.y,0),a.mat.uniforms.uGrow.value=I,a.mat.uniforms.uOpacity.value=Te;const de=ae(n),ut=Te>0&&de.x<o.viewport.width&&de.x+de.w>0;a.mesh.visible=ut;const _e=r&&e>0&&e<1&&Math.abs(n-F)<=1,ze=We&&r&&e>0&&e<1;ze&&!u&&(a.clock+=s),a.screen.want(_e);const he=n===F;"frame"in a.screen&&a.screen.frame(t,he);const qe=a.screen.texture.image,y=qe instanceof HTMLVideoElement?qe:null,re=(n<l?he:_e)&&ze;if(n<l&&!he&&(a.clock=0),y&&y.duration>0)if(y!==a.el||re&&!a.ran){a.el=y;const U=a.clock%y.duration;Math.abs(y.currentTime-U)>.25&&(y.currentTime=U)}else re&&!y.paused&&(a.clock=y.currentTime+Math.floor(a.clock/y.duration)*y.duration);a.ran=re,re?a.screen.play():n===l&&e>.97||a.screen.pause(),a.mat.uniforms.uMap.value=a.screen.texture;{const U=a.screen.texture;n<l&&U&&U.anisotropy!==Fe&&(U.anisotropy=Fe,U.minFilter=ht,U.generateMipmaps=!1,U.needsUpdate=!0)}n===l&&y&&y.videoWidth>0&&(a.mat.uniforms.uFilmAsp.value=y.videoWidth/y.videoHeight),n===l&&(a.mat.uniforms.uFit.value=1-T(.6,1,I));const Re=Ee(a.screen);a.mat.uniforms.uGain.value=Re>.62?S(.62/Re,.75,1):1});const A=K.uniforms,se=S(Math.floor(b-1),0,m-1),J=Math.min(m-1,se+1),nt=S(b-1-se);A.uMix.value=J>se?T(.3,.7,nt):0;const me=A.uMix.value>.999?J:se;A.uA.value=h[me].screen.texture,A.uB.value=A.uMix.value>.001&&A.uMix.value<.999?h[J].screen.texture:A.uA.value,me===J&&(A.uMix.value=0),A.uGainA.value=Ue(h[me].screen),A.uGainB.value=Ue(h[J].screen),A.uFilm.value=.4*(1-k)*(u?1:T(.25,.75,v)),A.uLetters.value=u?0:.8*(1-v),A.uDrift.value=(u?0:t*.015)+b*.2;const Oe=u?0:t;if(Q.uniforms.uGridX.value=Oe+b*.056*45/Z.w,Q.uniforms.uPlusX.value=(Oe*.01+b*.42+.2*v)*w,Q.uniforms.uAmt.value=1-k,_.visible=!1,H.visible=!0,et){const a=ae(F),n=o.viewport;globalThis.__roomProbe={room:ge,idx:F,count:+b.toFixed(3),e:+v.toFixed(3),grow:+k.toFixed(3),x0:+(a.x/n.width*100).toFixed(1),x1:+((a.x+a.w)/n.width*100).toFixed(1),wPct:+(a.w/n.width*100).toFixed(1),y0:+(a.y/n.height*100).toFixed(1),y1:+((a.y+a.h)/n.height*100).toFixed(1),...at(F),sIn:+q.toFixed(3),nb:F+1<m?+(ae(F+1).x/n.width*100).toFixed(1):null}}},pick(e,t){const s=S(Math.round(b)-1,0,m-1);return Ge(e,t,s)?Qe(s):null},hover(e,t){return o.pointer.inside&&Ge(e,t,S(Math.round(b)-1,0,m-1))},dispose(){le.dispose(),B.geometry.dispose(),_.geometry.dispose(),K.dispose(),ee.dispose(),Ae.tex.dispose(),h.forEach(e=>{e.mat.dispose(),e.screen.pause(),"dispose"in e.screen&&e.screen.dispose()})}}};export{D as BIZ_SCREENS,Rt as default};
