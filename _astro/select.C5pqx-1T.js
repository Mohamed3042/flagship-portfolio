import{i as Y,q as fe,y as Ge,H as Xe,af as Ie,M as O,a as j,S as Ve,P as $e,t as Ke,s as Le,G as ke,_ as Ne,X as He,z as Ye,a0 as Je,a1 as Qe,aM as Ze,b as et,V,B as tt,C as at,o as W,r as z,I as _e,J as ot,p as st,a2 as N}from"./EditionWorld.astro_astro_type_script_index_0_lang.P9odppCQ.js";import{G as We,f as it,V as rt,A as de,o as ut,e as nt,a as lt,p as ct,s as ue,h as te}from"./plan.CSuBjitI.js";import{l as vt,b as pt}from"./led.BsF6A9sO.js";import{l as mt}from"./floor.BFUAQWux.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ft=`
  uniform sampler2D uA, uB; uniform float uHasA, uHasB, uAspA, uAspB, uAspect, uMix, uGlitch, uRadius, uBevel, uDim, uTime, uOpacity, uPower, uPowerX, uReflect, uFlash, uScrim;
  varying vec2 vUv;
  ${We}
  float box(vec2 uv){ vec2 q = abs((uv - .5) * vec2(uAspect, 1.)) - vec2(uAspect, 1.) * .5 + uRadius; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRadius; }
  vec2 cover(vec2 uv, float src){ vec2 s = src > uAspect ? vec2(uAspect / src, 1.) : vec2(1., src / uAspect); return (uv - .5) * s + .5; }
  vec3 pick(sampler2D t, float has, float asp, vec2 uv, vec2 off){
    if (has < .5) return vec3(.02, .02, .025);
    vec2 q = cover(uv, asp);
    return vec3(texture2D(t, q + off).r, texture2D(t, q).g, texture2D(t, q - off).b);
  }
  void main(){
    vec2 uv = vUv;
    float d = box(uv), aa = fwidth(d), inside = smoothstep(aa, -aa, d);
    // the glass rim: the picture pulled through it, split
    float k = clamp(1. + d / uBevel, 0., 1.);
    vec2 e = vec2(.002, 0.), g = vec2(box(uv + e.xy) - box(uv - e.xy), box(uv + e.yx) - box(uv - e.yx)); g /= max(length(g), 1e-5);
    vec2 pull = g / vec2(uAspect, 1.) * uBevel * k * .9, split = g / vec2(uAspect, 1.) * uBevel * .25 * k;
    // the glitch between two films: rows tear and slide, colours part, a line runs
    float gl = uGlitch * (1. - uGlitch) * 4.;
    float row = floor(uv.y * 26.), slip = (h21(vec2(row, floor(uTime * 30.))) - .5) * .16 * gl * step(.55, h21(vec2(row, floor(uTime * 18.) + 3.)));
    vec2 q = uv - pull + vec2(slip, 0.);
    vec2 ca = split + vec2(.012 * gl, 0.);
    float sw = step(h21(vec2(row, 7.3)), uMix);
    vec3 a = pick(uA, uHasA, uAspA, q, ca), b = pick(uB, uHasB, uAspB, q, ca);
    vec3 col = mix(a, b, gl > .001 ? sw : uMix);
    col += vec3(.9, .95, 1.) * exp(-pow((uv.y - fract(uTime * 2.3)) * 60., 2.)) * gl * .5;
    col *= 1. - .18 * gl * step(.5, fract(gl_FragCoord.y * .5));
    col = mix(col, col * .26, uDim);
    col *= 1. - uScrim * smoothstep(.47, .03, uv.y) * .9;   // a phone: the words stand over the foot of the picture
    if (uBevel > 0.) {
      float lit = .35 + .65 * max(dot(g, normalize(vec2(-.35, 1.))), 0.);
      col *= 1. + .45 * k * k;
      col += vec3(.95, .97, 1.) * smoothstep(.62, .82, k) * smoothstep(.98, .82, k) * lit * .55;
    }
    // CRT power: a line that opens into the picture (and closes back to a line, then a point)
    float ph = uPower, px = uPowerX;
    float open = (1. - smoothstep(ph * .5 - .004, ph * .5 + .004, abs(uv.y - .5))) * (1. - smoothstep(px * .5 - .004, px * .5 + .004, abs(uv.x - .5)));
    float beam = exp(-pow((uv.y - .5) / max(.003, ph * .5), 2.)) * (1. - ph) * step(abs(uv.x - .5), px * .5);
    col = col * open + vec3(1.) * beam * 2.2 * step(.001, px);
    col += vec3(1.) * uFlash;
    float fade = 1. - smoothstep(0., .55, uv.y) * uReflect;   // the floor's mirror image fades away from the screen
    gl_FragColor = vec4(col * mix(1., (1. - uv.y) * .32, uReflect), inside * uOpacity * fade);
  }`;function dt({radius:a=.02,bevel:d=.03,bend:f=0,aspect:n=16/9}={}){return new Y({transparent:!0,uniforms:{uA:{value:null},uB:{value:null},uHasA:{value:0},uHasB:{value:0},uAspA:{value:16/9},uAspB:{value:16/9},uAspect:{value:n},uMix:{value:0},uGlitch:{value:0},uRadius:{value:a},uBevel:{value:d},uBend:{value:f},uDim:{value:0},uTime:{value:0},uOpacity:{value:1},uPower:{value:1},uPowerX:{value:1},uReflect:{value:0},uFlash:{value:0},uScrim:{value:0}},vertexShader:"uniform float uBend; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; p.z += uBend * p.x * p.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }",fragmentShader:ft})}function ht(a){const d={type:Xe,depthBuffer:!1,minFilter:Ge,magFilter:Ge},f=new fe(8,8,d),n=[new fe(8,8,d),new fe(8,8,d)],A=new Ie(-1,1,1,-1,0,1),J="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",p=new Y({uniforms:{uMap:{value:null},uAsp:{value:16/9},uTarget:{value:16/9}},vertexShader:J,depthTest:!1,depthWrite:!1,fragmentShader:`
      uniform sampler2D uMap; uniform float uAsp, uTarget; varying vec2 vUv;
      void main(){
        vec2 s = uAsp > uTarget ? vec2(uTarget / uAsp, 1.) : vec2(1., uAsp / uTarget);
        vec3 c = vec3(0.);
        for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) {
          vec2 uv = vUv + (vec2(float(i), float(j)) - 1.5) / 32.;
          c += texture2D(uMap, (uv - .5) * s + .5).rgb;
        }
        gl_FragColor = vec4(c / 16., 1.);
      }`}),x=new Y({uniforms:{uNow:{value:f.texture},uPrev:{value:n[0].texture},uK:{value:.1}},vertexShader:J,depthTest:!1,depthWrite:!1,fragmentShader:"uniform sampler2D uNow, uPrev; uniform float uK; varying vec2 vUv; void main(){ gl_FragColor = vec4(mix(texture2D(uPrev, vUv).rgb, texture2D(uNow, vUv).rgb, uK), 1.); }"}),M=new O(new j(2,2),p),P=new Ve;P.add(M);{const l=a.getRenderTarget();a.setRenderTarget(f),a.compileAsync(P,A).catch(()=>{}),M.material=x,a.compileAsync(P,A).catch(()=>{}),M.material=p,a.setRenderTarget(l)}let D=0;return{get texture(){return n[D].texture},step(l,i,R,k){if(!l)return;const H=a.getRenderTarget();M.material=p,p.uniforms.uMap.value=l,p.uniforms.uAsp.value=i,p.uniforms.uTarget.value=R,a.setRenderTarget(f),a.render(P,A),M.material=x,x.uniforms.uPrev.value=n[D].texture,x.uniforms.uK.value=1-Math.exp(-k*5),D^=1,a.setRenderTarget(n[D]),a.render(P,A),a.setRenderTarget(H)},dispose(){f.dispose(),n.forEach(l=>l.dispose()),p.dispose(),x.dispose(),M.geometry.dispose()}}}const gt=`
  uniform float uTime, uAspect, uOn, uFlash; varying vec2 vUv;
  ${We}
  float box(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
  void main(){
    vec2 p = (vUv - .5) * vec2(uAspect, 1.);
    float d = box(p, vec2(uAspect, 1.) * .5 - .07, .05);
    float aa = fwidth(d);
    float line = 1. - smoothstep(.0, aa * 1.5 + .004, abs(d));
    float glow = exp(-max(d, 0.) / .035) * .55 * step(0., d) + exp(-abs(d) / .012) * .4;
    vec3 c = spectrum(atan(p.y, p.x) / 6.28318 - uTime * .35);
    float corner = step(.5 * uAspect - .2, abs(p.x)) * step(.3, abs(p.y));   // brighter at the corners, as select frames are
    gl_FragColor = vec4(c * (line * (1.6 + corner) + glow) * uOn + vec3(1.) * line * uFlash, 1.);
  }`,Mt=async a=>{await it();const d=new Ve;d.background=rt;const f=new $e(30,a.viewport.aspect,.05,300),n=a.films,A=n.length,J=a.lang==="ar",p=J?-1:1,x=mt();x.U.uDraw.value=0,x.U.uGlow.value=0,x.U.uLevel.value=.7;const M=x.mesh;d.add(M);const P=new Y({...de,uniforms:{uAmb:{value:null},uScreen:{value:new Ke},uLevel:{value:1}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform sampler2D uAmb; uniform vec4 uScreen; uniform float uLevel; varying vec3 vW;
      void main(){
        float u = clamp((vW.x - uScreen.x) / uScreen.z + .5, 0., 1.), off = abs(vW.x - uScreen.x) - uScreen.z * .5;
        vec3 amb = texture2D(uAmb, vec2(u, .06)).rgb;
        float pool = exp(-max(vW.z - uScreen.y, 0.) * .6) * exp(-max(off, 0.) * 1.4) * smoothstep(uScreen.y - .4, uScreen.y + .2, vW.z);
        gl_FragColor = vec4(amb * pool * .32 * uLevel, 1.);
      }`}),D=new O(new j(60,40),P);D.rotation.x=-Math.PI/2,D.renderOrder=1,d.add(D);const l=dt({bevel:.026,radius:.018}),i=new O(new j(1,1,48,1),l);i.renderOrder=2,d.add(i);const R=l.clone();R.uniforms={...l.uniforms,uReflect:{value:1},uOpacity:{value:.55}};const k=new O(i.geometry,R);k.renderOrder=-1,d.add(k);const H=ht(a.renderer),Q=new Y({...de,uniforms:{uAmb:{value:H.texture},uSize:{value:new Le(1,1)},uLevel:{value:1}},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uAmb; uniform vec2 uSize; uniform float uLevel; varying vec2 vP;
      void main(){
        vec2 h = uSize * .5, q = clamp(vP, -h, h);
        float d = length(vP - q);
        vec3 c = texture2D(uAmb, q / uSize + .5).rgb;
        c *= .75 / max(.75, max(c.r, max(c.g, c.b)));   // a white film glows, it does not flood
        // (linear light: windowed to nothing before the plane's edge, or the plane shows as a box)
        vec2 w = .5 - abs(vP);
        float win = smoothstep(0., .07, min(w.x, w.y));
        float a = (exp(-d / .045) * .42 + exp(-d / .16) * .14 + exp(-d / .5) * .035) * win;
        gl_FragColor = vec4(c * a * uLevel, 1.);
      }`}),E=new O(new j(1,1),Q);E.renderOrder=1,d.add(E);const q=new ke;d.add(q);let h=.8,C=1.2;const he=new Ne(1,1,.06),ge=new He({color:"#0a0a0d",metalness:.7,roughness:.35,envMap:a.env,envMapIntensity:.5}),we=new j(1,1),X=n.map((t,e)=>{const o=Ye({radius:.045,bevel:.022});o.uniforms.uAspect.value=2/3;const r=new ke,F=new O(we,o);F.position.z=.032,F.userData.index=e;const b=new O(he,ge);b.userData.index=e,r.add(b,F),q.add(r);const u={g:r,mat:o,slab:b,sel:0,hover:0,tex:null};return a.textures.image(t.poster).then(m=>{u.tex=m,o.uniforms.uMap.value=m,o.uniforms.uHas.value=1}).catch(()=>{}),u}),_=new Y({...de,uniforms:{uTime:{value:0},uAspect:{value:1},uOn:{value:0},uFlash:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:gt}),G=new O(new j(1,1),_);G.renderOrder=4,q.add(G);const ne=(()=>{const t=document.createElement("canvas");t.width=256,t.height=128;const e=t.getContext("2d"),o=52;e.beginPath(),e.roundRect(10,10,236,108,o),e.fillStyle="rgba(4, 4, 6, .92)",e.fill(),e.lineWidth=7,e.strokeStyle="#fff",e.stroke(),e.fillStyle="#fff",e.font='800 72px "JetBrains Mono Variable", monospace',e.textAlign="center",e.textBaseline="middle",e.fillText("P1",128,68);const r=new Je(t);return r.colorSpace=Qe,r.minFilter=Ze,r.anisotropy=8,{texture:r,aspect:2}})(),ae=new et({map:ne.texture,transparent:!0,depthWrite:!1,depthTest:!1,color:"#ffffff"}),Z=new O(new j(ne.aspect,1),ae);Z.renderOrder=6,q.add(Z);const U=vt({cols:132,rows:15,width:1});U.U.uRainbow.value=.85;const I=new O(pt(1,15/132,.06,.03),new He({color:"#08080a",metalness:.7,roughness:.35,envMap:a.env,envMapIntensity:.5}));q.add(U.mesh,I);let xe="";const ye=t=>{if(t!==xe){xe=t;const e=/[\u0600-\u06ff]/.test(t);U.text([t],{family:e?'"Cairo Variable", sans-serif':'"Space Grotesk Variable", sans-serif',weight:700,fill:.78,rtl:e})}};ye(J?"اختر لاعبك":"PLAYER SELECT");let y=a.viewport.portrait,g=6.4,w=3.6;const be=new V,Ae=new V,le=n.map(()=>new V);function Me(){y=a.viewport.portrait,f.fov=y?46:30,f.aspect=a.viewport.aspect,f.updateProjectionMatrix();const t=Math.tan(st.degToRad(f.fov/2)),e=11,o=2.6,r=e*t,F=r*a.viewport.aspect,b=c=>c*F,u=c=>o+c*r;if(y){const c=u(.8),T=u(-.5);w=c-T,g=w*9/16,g>b(.88)*2&&(g=b(.88)*2,w=g*16/9),i.position.set(0,c-w/2,0),i.rotation.set(0,0,0),h=Math.min(.95,b(.15)*2*.78),C=h*1.5,q.position.set(0,u(-.68),.2),q.rotation.set(0,0,0),M.position.y=u(-1.2),l.uniforms.uAspect.value=9/16,R.uniforms.uAspect.value=9/16}else{g=b(.88),w=g*9/16,w>u(.74)-u(-.28)&&(w=u(.74)-u(-.28),g=w*16/9),i.position.set(b(-.82)*p+g/2*p,u(.74)-w/2,0),i.rotation.set(0,.1*p,0);const c=b(.56),T=u(.62)-u(-.56);h=Math.min((c-.5)/5,(T-.26)/3/1.5),C=h*1.5,q.position.set(b(.52)*p,(u(.62)+u(-.56))/2,.3),q.rotation.set(0,-.28*p,0),M.position.y=u(-.28)-.4,l.uniforms.uAspect.value=16/9,R.uniforms.uAspect.value=16/9}be.set(0,o,e),Ae.set(0,o,0),l.uniforms.uScrim.value=y?1:0,i.scale.set(g,w,1),l.uniforms.uBend.value=R.uniforms.uBend.value=y?0:-.04,k.position.set(i.position.x,2*M.position.y-i.position.y,i.position.z),k.rotation.copy(i.rotation),k.scale.set(g,-w,1),E.position.copy(i.position).add(new V(0,0,-.06)),E.rotation.copy(i.rotation),E.scale.set(g+5,w+5,1),Q.uniforms.uSize.value.set(g/(g+5),w/(w+5)),P.uniforms.uScreen.value.set(i.position.x,i.position.z,g,0),D.position.set(i.position.x,M.position.y+.01,i.position.z+10),n.forEach((c,T)=>{if(y)le[T].set(0,0,0);else{const v=T%5,$=Math.floor(T/5);le[T].set((v-2)*(h+.12)*p,(1-$)*(C+.13),0)}}),X.forEach(c=>{c.slab.scale.set(h+.06,C+.06,1),c.g.children[1].scale.set(h,C,1)}),G.scale.set(h+.3,C+.3,1),_.uniforms.uAspect.value=(h+.3)/(C+.3),Z.scale.setScalar(h*.2);const m=5*h+4*.12;U.mesh.scale.set(m,m,1),I.scale.set(m,m,1),U.mesh.position.set(0,1.5*C+.13+.38+m*15/132/2,0),I.position.copy(U.mesh.position),U.mesh.visible=I.visible=!y}Me();const ce=t=>{const e=n[t].card.replace(/card\.webp$/,"");return y?{still:n[t].poster,stillAsp:2/3,clip:`${e}hero-tall.mp4`,clipAsp:9/16}:{still:n[t].card,stillAsp:16/9,clip:a.quality>0?`${e}hero.mp4`:n[t].loop,clipAsp:16/9}},oe=new Map,Se=(t,e)=>{const o=ce(t);oe.has(o.still)||(oe.set(o.still,null),a.textures.image(o.still).then(F=>oe.set(o.still,F)).catch(()=>{}));const r=a.textures.video(o.clip);return r&&r.video.readyState>=2?[r.texture,o.clipAsp]:[oe.get(o.still)??null,o.stillAsp]},Te=new tt,Pe=new Le,Be=(t,e)=>{Pe.set(t,e),Te.setFromCamera(Pe,f);const o=Te.intersectObjects([i,...X.map(r=>r.slab)],!1)[0];return o?o.object===i?-1:o.object.userData.index:-2};let S=-1,B=-1,se=-1,De=-9,Re=!1,ve=-2,ie=0;const re=new V,pe=new V,Fe=new V,Oe=new at;return{scene:d,camera:f,resize(){const t=y;Me(),t!==y&&(B=-1)},focus(t){Re=t,t||a.textures.pauseAllVideos()},update({p:t,t:e,dt:o}){const r=z(te.first,te.last,t)*(A-1),F=Math.floor(r),b=r-F,u=t<te.first*.6?-1.2:Math.min(A-1,F+W.inOut(z(.35,.65,b)));S=ue?Math.round(u):_e(S,u,6,o);const m=N(Math.round(S),0,A-1),c=W.inOut(z(te.first*.35,te.first*.95,t))*(1-W.inOut(z(.965,.995,t)));l.uniforms.uPower.value=R.uniforms.uPower.value=W.inOut(z(.35,1,c)),l.uniforms.uPowerX.value=R.uniforms.uPowerX.value=W.out(z(0,.35,c)),m!==B&&S>-.5&&(B>=0?(se=B,De=e):se=-1,B=m,a.emit("film",{index:m,film:n[m]}),ie=1,ye(`P1  ·  ${n[m].name.toUpperCase()}`));const T=ue?1:z(0,.55,e-De),v=l.uniforms,[$,qe]=B>=0?Se(B):[null,16/9];if(T<1&&se>=0){const[s,L]=Se(se);v.uA.value=s,v.uHasA.value=s?1:0,v.uAspA.value=L,v.uB.value=$,v.uHasB.value=$?1:0,v.uAspB.value=qe,v.uMix.value=T,v.uGlitch.value=T}else v.uA.value=$,v.uHasA.value=$?1:0,v.uAspA.value=qe,v.uMix.value=0,v.uGlitch.value=0;if(v.uTime.value=e,B>=0){const s=a.textures.video(ce(B).clip);Re&&!ue&&c>.3?(s.video.paused&&s.video.play().catch(()=>{}),a.textures.pauseAllVideos(s.video)):s.video.paused||s.video.pause(),Math.abs(S-m)>.2&&a.textures.video(ce(N(m+Math.sign(S-m),0,A-1)).clip)}H.step(v.uA.value,v.uAspA.value,y?9/16:16/9,o),Q.uniforms.uAmb.value=H.texture,P.uniforms.uAmb.value=H.texture,Q.uniforms.uLevel.value=c,P.uniforms.uLevel.value=c,x.U.uTime.value=e,x.follow(f);const je=s=>W.out(z(s*.0022,.025+s*.0022,t));X.forEach((s,L)=>{const K=1-W.inOut(N(Math.abs(L-S)));s.sel=K,s.hover=_e(s.hover,ve===L?1:0,8,o);const ze=le[L],ee=je(L);y?s.g.position.set((L-S)*(h+.16)*p,0,K*.35):s.g.position.set(ze.x+(1-ee)*6*p,ze.y+(1-ee)*.4,K*.38+s.hover*.08-(1-ee)*2),s.g.scale.setScalar(1+K*.08+s.hover*.03),s.g.visible=ee>.001&&(!y||Math.abs(L-S)<4.5),s.mat.uniforms.uDim.value=(1-K)*.62*(1-s.hover*.5),s.mat.uniforms.uGlow.value=K*.5+s.hover*.4,s.mat.uniforms.uTime.value=e,s.mat.uniforms.uOpacity.value=ee});const me=N(Math.floor(S),0,A-1),Ee=N(me+1,0,A-1),Ce=N(S-me);re.copy(X[me].g.position).lerp(X[Ee].g.position,Ce),G.position.set(re.x,re.y,re.z+.05+Math.sin(Math.PI*Ce)*.25),_.uniforms.uOn.value=z(-.6,0,S),_.uniforms.uTime.value=e,U.U.uTime.value=e,ie=Math.max(0,ie-o*3),_.uniforms.uFlash.value=ie*.6,Z.position.set(G.position.x-(h*.5-h*.16)*p,G.position.y+C*.5+.1,G.position.z+.06),lt(-e*.35,Oe),ae.color.copy(Oe).multiplyScalar(1.4),ae.opacity=_.uniforms.uOn.value;const Ue=ct(a,e,o);pe.copy(be),Fe.copy(Ae),pe.x+=ue?0:Math.sin(e*.11)*.12,ot(f,pe,Fe,Ue.x,Ue.y)},pick(t,e){const o=Be(t,e);return o===-1&&B>=0?n[B].url:(o>=0&&window.world?.seek?.("select",nt(o,A)+.001),null)},hover(t,e){return ve=ut(t,e)?-2:Be(t,e),ve>=-1},dispose(){x.dispose(),D.geometry.dispose(),P.dispose(),i.geometry.dispose(),l.dispose(),R.dispose(),H.dispose(),E.geometry.dispose(),Q.dispose(),U.dispose(),I.geometry.dispose(),I.material.dispose(),he.dispose(),ge.dispose(),we.dispose(),X.forEach(t=>t.mat.dispose()),G.geometry.dispose(),_.dispose(),ne.texture.dispose(),ae.dispose(),Z.geometry.dispose()}}};export{Mt as default};
