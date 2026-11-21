import{D as Ie,e as V,r as G,B as ze,I as Xe,x as K}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{G as Ve,f as $e,V as Ne,A as fe,o as Ke,e as Ye,a as Je,p as Qe,s as ue,h as te}from"./plan.DLLSAf42.js";import{d as Y,W as de,j as Le,H as Ze,O as et,M as F,c as j,S as _e,P as tt,f as at,k as ke,G as He,b as ot,N as We,n as st,q as it,o as rt,e as ut,V as _,J as nt,C as lt,i as ct}from"./three.module.pheUvn1h.js";import{l as vt,b as pt}from"./led.CNo9kWwJ.js";import{l as mt}from"./floor.DkzlpWdg.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ft=`
  uniform sampler2D uA, uB; uniform float uHasA, uHasB, uAspA, uAspB, uAspect, uMix, uGlitch, uRadius, uBevel, uDim, uTime, uOpacity, uPower, uPowerX, uReflect, uFlash, uScrim;
  varying vec2 vUv;
  ${Ve}
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

    float k = clamp(1. + d / uBevel, 0., 1.);
    vec2 e = vec2(.002, 0.), g = vec2(box(uv + e.xy) - box(uv - e.xy), box(uv + e.yx) - box(uv - e.yx)); g /= max(length(g), 1e-5);
    vec2 pull = g / vec2(uAspect, 1.) * uBevel * k * .9, split = g / vec2(uAspect, 1.) * uBevel * .25 * k;

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
    col *= 1. - uScrim * smoothstep(.47, .03, uv.y) * .9;
    if (uBevel > 0.) {
      float lit = .35 + .65 * max(dot(g, normalize(vec2(-.35, 1.))), 0.);
      col *= 1. + .45 * k * k;
      col += vec3(.95, .97, 1.) * smoothstep(.62, .82, k) * smoothstep(.98, .82, k) * lit * .55;
    }

    float ph = uPower, px = uPowerX;
    float open = (1. - smoothstep(ph * .5 - .004, ph * .5 + .004, abs(uv.y - .5))) * (1. - smoothstep(px * .5 - .004, px * .5 + .004, abs(uv.x - .5)));
    float beam = exp(-pow((uv.y - .5) / max(.003, ph * .5), 2.)) * (1. - ph) * step(abs(uv.x - .5), px * .5);
    col = col * open + vec3(1.) * beam * 2.2 * step(.001, px);
    col += vec3(1.) * uFlash;
    float fade = 1. - smoothstep(0., .55, uv.y) * uReflect;
    gl_FragColor = vec4(col * mix(1., (1. - uv.y) * .32, uReflect), inside * uOpacity * fade);
  }`;function dt({radius:a=.02,bevel:d=.03,bend:f=0,aspect:n=16/9}={}){return new Y({transparent:!0,uniforms:{uA:{value:null},uB:{value:null},uHasA:{value:0},uHasB:{value:0},uAspA:{value:16/9},uAspB:{value:16/9},uAspect:{value:n},uMix:{value:0},uGlitch:{value:0},uRadius:{value:a},uBevel:{value:d},uBend:{value:f},uDim:{value:0},uTime:{value:0},uOpacity:{value:1},uPower:{value:1},uPowerX:{value:1},uReflect:{value:0},uFlash:{value:0},uScrim:{value:0}},vertexShader:"uniform float uBend; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; p.z += uBend * p.x * p.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }",fragmentShader:ft})}function ht(a){const d={type:Ze,depthBuffer:!1,minFilter:Le,magFilter:Le},f=new de(8,8,d),n=[new de(8,8,d),new de(8,8,d)],b=new et(-1,1,1,-1,0,1),J="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",p=new Y({uniforms:{uMap:{value:null},uAsp:{value:16/9},uTarget:{value:16/9}},vertexShader:J,depthTest:!1,depthWrite:!1,fragmentShader:`
      uniform sampler2D uMap; uniform float uAsp, uTarget; varying vec2 vUv;
      void main(){
        vec2 s = uAsp > uTarget ? vec2(uTarget / uAsp, 1.) : vec2(1., uAsp / uTarget);
        vec3 c = vec3(0.);
        for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) {
          vec2 uv = vUv + (vec2(float(i), float(j)) - 1.5) / 32.;
          c += texture2D(uMap, (uv - .5) * s + .5).rgb;
        }
        gl_FragColor = vec4(c / 16., 1.);
      }`}),x=new Y({uniforms:{uNow:{value:f.texture},uPrev:{value:n[0].texture},uK:{value:.1}},vertexShader:J,depthTest:!1,depthWrite:!1,fragmentShader:"uniform sampler2D uNow, uPrev; uniform float uK; varying vec2 vUv; void main(){ gl_FragColor = vec4(mix(texture2D(uPrev, vUv).rgb, texture2D(uNow, vUv).rgb, uK), 1.); }"}),M=new F(new j(2,2),p),P=new _e;P.add(M);{const l=a.getRenderTarget();a.setRenderTarget(f),a.compileAsync(P,b).catch(()=>{}),M.material=x,a.compileAsync(P,b).catch(()=>{}),M.material=p,a.setRenderTarget(l)}let D=0;return{get texture(){return n[D].texture},step(l,i,O,k){if(!l)return;const H=a.getRenderTarget();M.material=p,p.uniforms.uMap.value=l,p.uniforms.uAsp.value=i,p.uniforms.uTarget.value=O,a.setRenderTarget(f),a.render(P,b),M.material=x,x.uniforms.uPrev.value=n[D].texture,x.uniforms.uK.value=1-Math.exp(-k*5),D^=1,a.setRenderTarget(n[D]),a.render(P,b),a.setRenderTarget(H)},dispose(){f.dispose(),n.forEach(l=>l.dispose()),p.dispose(),x.dispose(),M.geometry.dispose()}}}const gt=`
  uniform float uTime, uAspect, uOn, uFlash; varying vec2 vUv;
  ${Ve}
  float box(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
  void main(){
    vec2 p = (vUv - .5) * vec2(uAspect, 1.);
    float d = box(p, vec2(uAspect, 1.) * .5 - .07, .05);
    float aa = fwidth(d);
    float line = 1. - smoothstep(.0, aa * 1.5 + .004, abs(d));
    float glow = exp(-max(d, 0.) / .035) * .55 * step(0., d) + exp(-abs(d) / .012) * .4;
    vec3 c = spectrum(atan(p.y, p.x) / 6.28318 - uTime * .35);
    float corner = step(.5 * uAspect - .2, abs(p.x)) * step(.3, abs(p.y));
    gl_FragColor = vec4(c * (line * (1.6 + corner) + glow) * uOn + vec3(1.) * line * uFlash, 1.);
  }`,Pt=async a=>{await $e();const d=new _e;d.background=Ne;const f=new tt(30,a.viewport.aspect,.05,300),n=a.films,b=n.length,J=a.lang==="ar",p=J?-1:1,x=mt();x.U.uDraw.value=0,x.U.uGlow.value=0,x.U.uLevel.value=.7;const M=x.mesh;d.add(M);const P=new Y({...fe,uniforms:{uAmb:{value:null},uScreen:{value:new at},uLevel:{value:1}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform sampler2D uAmb; uniform vec4 uScreen; uniform float uLevel; varying vec3 vW;
      void main(){
        float u = clamp((vW.x - uScreen.x) / uScreen.z + .5, 0., 1.), off = abs(vW.x - uScreen.x) - uScreen.z * .5;
        vec3 amb = texture2D(uAmb, vec2(u, .06)).rgb;
        float pool = exp(-max(vW.z - uScreen.y, 0.) * .6) * exp(-max(off, 0.) * 1.4) * smoothstep(uScreen.y - .4, uScreen.y + .2, vW.z);
        gl_FragColor = vec4(amb * pool * .32 * uLevel, 1.);
      }`}),D=new F(new j(60,40),P);D.rotation.x=-Math.PI/2,D.renderOrder=1,d.add(D);const l=dt({bevel:.026,radius:.018}),i=new F(new j(1,1,48,1),l);i.renderOrder=2,d.add(i);const O=l.clone();O.uniforms={...l.uniforms,uReflect:{value:1},uOpacity:{value:.55}};const k=new F(i.geometry,O);k.renderOrder=-1,d.add(k);const H=ht(a.renderer),Q=new Y({...fe,uniforms:{uAmb:{value:H.texture},uSize:{value:new ke(1,1)},uLevel:{value:1}},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uAmb; uniform vec2 uSize; uniform float uLevel; varying vec2 vP;
      void main(){
        vec2 h = uSize * .5, q = clamp(vP, -h, h);
        float d = length(vP - q);
        vec3 c = texture2D(uAmb, q / uSize + .5).rgb;
        c *= .75 / max(.75, max(c.r, max(c.g, c.b)));

        vec2 w = .5 - abs(vP);
        float win = smoothstep(0., .07, min(w.x, w.y));
        float a = (exp(-d / .045) * .42 + exp(-d / .16) * .14 + exp(-d / .5) * .035) * win;
        gl_FragColor = vec4(c * a * uLevel, 1.);
      }`}),E=new F(new j(1,1),Q);E.renderOrder=1,d.add(E);const q=new He;d.add(q);let h=.8,U=1.2;const he=new ot(1,1,.06),ge=new We({color:"#0a0a0d",metalness:.7,roughness:.35,envMap:a.env,envMapIntensity:.5}),we=new j(1,1),I=n.map((t,e)=>{const o=Ie({radius:.045,bevel:.022});o.uniforms.uAspect.value=2/3;const r=new He,R=new F(we,o);R.position.z=.032,R.userData.index=e;const A=new F(he,ge);A.userData.index=e,r.add(A,R),q.add(r);const u={g:r,mat:o,slab:A,sel:0,hover:0,tex:null};return a.textures.image(t.poster).then(m=>{u.tex=m,o.uniforms.uMap.value=m,o.uniforms.uHas.value=1}).catch(()=>{}),u}),W=new Y({...fe,uniforms:{uTime:{value:0},uAspect:{value:1},uOn:{value:0},uFlash:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:gt}),z=new F(new j(1,1),W);z.renderOrder=4,q.add(z);const ne=(()=>{const t=document.createElement("canvas");t.width=256,t.height=128;const e=t.getContext("2d"),o=52;e.beginPath(),e.roundRect(10,10,236,108,o),e.fillStyle="rgba(4, 4, 6, .92)",e.fill(),e.lineWidth=7,e.strokeStyle="#fff",e.stroke(),e.fillStyle="#fff",e.font='800 72px "JetBrains Mono Variable", monospace',e.textAlign="center",e.textBaseline="middle",e.fillText("P1",128,68);const r=new st(t);return r.colorSpace=it,r.minFilter=rt,r.anisotropy=8,{texture:r,aspect:2}})(),ae=new ut({map:ne.texture,transparent:!0,depthWrite:!1,depthTest:!1,color:"#ffffff"}),Z=new F(new j(ne.aspect,1),ae);Z.renderOrder=6,q.add(Z);const C=vt({cols:132,rows:15,width:1});C.U.uRainbow.value=.85;const X=new F(pt(1,15/132,.06,.03),new We({color:"#08080a",metalness:.7,roughness:.35,envMap:a.env,envMapIntensity:.5}));q.add(C.mesh,X);let xe="";const ye=t=>{if(t!==xe){xe=t;const e=/[\u0600-\u06ff]/.test(t);C.text([t],{family:e?'"Cairo Variable", sans-serif':'"Space Grotesk Variable", sans-serif',weight:700,fill:.78,rtl:e})}};ye(J?"اختر لاعبك":"PLAYER SELECT");let y=a.viewport.portrait,g=6.4,w=3.6;const Ae=new _,be=new _,le=n.map(()=>new _);function Me(){y=a.viewport.portrait,f.fov=y?46:30,f.aspect=a.viewport.aspect,f.updateProjectionMatrix();const t=Math.tan(ct.degToRad(f.fov/2)),e=11,o=2.6,r=e*t,R=r*a.viewport.aspect,A=c=>c*R,u=c=>o+c*r;if(y){const c=u(.8),T=u(-.5);w=c-T,g=w*9/16,g>A(.88)*2&&(g=A(.88)*2,w=g*16/9),i.position.set(0,c-w/2,0),i.rotation.set(0,0,0),h=Math.min(.95,A(.15)*2*.78),U=h*1.5,q.position.set(0,u(-.68),.2),q.rotation.set(0,0,0),M.position.y=u(-1.2),l.uniforms.uAspect.value=9/16,O.uniforms.uAspect.value=9/16}else{g=A(.88),w=g*9/16,w>u(.74)-u(-.28)&&(w=u(.74)-u(-.28),g=w*16/9),i.position.set(A(-.82)*p+g/2*p,u(.74)-w/2,0),i.rotation.set(0,.1*p,0);const c=A(.56),T=u(.62)-u(-.56);h=Math.min((c-.5)/5,(T-.26)/3/1.5),U=h*1.5,q.position.set(A(.52)*p,(u(.62)+u(-.56))/2,.3),q.rotation.set(0,-.28*p,0),M.position.y=u(-.28)-.4,l.uniforms.uAspect.value=16/9,O.uniforms.uAspect.value=16/9}Ae.set(0,o,e),be.set(0,o,0),l.uniforms.uScrim.value=y?1:0,i.scale.set(g,w,1),l.uniforms.uBend.value=O.uniforms.uBend.value=y?0:-.04,k.position.set(i.position.x,2*M.position.y-i.position.y,i.position.z),k.rotation.copy(i.rotation),k.scale.set(g,-w,1),E.position.copy(i.position).add(new _(0,0,-.06)),E.rotation.copy(i.rotation),E.scale.set(g+5,w+5,1),Q.uniforms.uSize.value.set(g/(g+5),w/(w+5)),P.uniforms.uScreen.value.set(i.position.x,i.position.z,g,0),D.position.set(i.position.x,M.position.y+.01,i.position.z+10),n.forEach((c,T)=>{if(y)le[T].set(0,0,0);else{const v=T%5,$=Math.floor(T/5);le[T].set((v-2)*(h+.12)*p,(1-$)*(U+.13),0)}}),I.forEach(c=>{c.slab.scale.set(h+.06,U+.06,1),c.g.children[1].scale.set(h,U,1)}),z.scale.set(h+.3,U+.3,1),W.uniforms.uAspect.value=(h+.3)/(U+.3),Z.scale.setScalar(h*.2);const m=5*h+4*.12;C.mesh.scale.set(m,m,1),X.scale.set(m,m,1),C.mesh.position.set(0,1.5*U+.13+.38+m*15/132/2,0),X.position.copy(C.mesh.position),C.mesh.visible=X.visible=!y}Me();const ce=t=>{const e=n[t].card.replace(/card\.webp$/,"");return y?{still:n[t].poster,stillAsp:2/3,clip:`${e}hero-tall.mp4`,clipAsp:9/16}:{still:n[t].card,stillAsp:16/9,clip:a.quality>0?`${e}hero.mp4`:n[t].loop,clipAsp:16/9}},oe=new Map,Se=(t,e)=>{const o=ce(t);oe.has(o.still)||(oe.set(o.still,null),a.textures.image(o.still).then(R=>oe.set(o.still,R)).catch(()=>{}));const r=a.textures.video(o.clip);return r&&r.video.readyState>=2?[r.texture,o.clipAsp]:[oe.get(o.still)??null,o.stillAsp]},Te=new nt,Pe=new ke,Be=(t,e)=>{Pe.set(t,e),Te.setFromCamera(Pe,f);const o=Te.intersectObjects([i,...I.map(r=>r.slab)],!1)[0];return o?o.object===i?-1:o.object.userData.index:-2};let S=-1,B=-1,se=-1,De=-9,Oe=!1,ve=-2,ie=0;const re=new _,pe=new _,Re=new _,Fe=new lt;return{scene:d,camera:f,resize(){const t=y;Me(),t!==y&&(B=-1)},focus(t){Oe=t,t||a.textures.pauseAllVideos()},update({p:t,t:e,dt:o}){const r=G(te.first,te.last,t)*(b-1),R=Math.floor(r),A=r-R,u=t<te.first*.6?-1.2:Math.min(b-1,R+V.inOut(G(.35,.65,A)));S=ue?Math.round(u):ze(S,u,6,o);const m=K(Math.round(S),0,b-1),c=V.inOut(G(te.first*.35,te.first*.95,t))*(1-V.inOut(G(.965,.995,t)));l.uniforms.uPower.value=O.uniforms.uPower.value=V.inOut(G(.35,1,c)),l.uniforms.uPowerX.value=O.uniforms.uPowerX.value=V.out(G(0,.35,c)),m!==B&&S>-.5&&(B>=0?(se=B,De=e):se=-1,B=m,a.emit("film",{index:m,film:n[m]}),ie=1,ye(`P1  ·  ${n[m].name.toUpperCase()}`));const T=ue?1:G(0,.55,e-De),v=l.uniforms,[$,qe]=B>=0?Se(B):[null,16/9];if(T<1&&se>=0){const[s,L]=Se(se);v.uA.value=s,v.uHasA.value=s?1:0,v.uAspA.value=L,v.uB.value=$,v.uHasB.value=$?1:0,v.uAspB.value=qe,v.uMix.value=T,v.uGlitch.value=T}else v.uA.value=$,v.uHasA.value=$?1:0,v.uAspA.value=qe,v.uMix.value=0,v.uGlitch.value=0;if(v.uTime.value=e,B>=0){const s=a.textures.video(ce(B).clip);Oe&&!ue&&c>.3?(s.video.paused&&s.video.play().catch(()=>{}),a.textures.pauseAllVideos(s.video)):s.video.paused||s.video.pause(),Math.abs(S-m)>.2&&a.textures.video(ce(K(m+Math.sign(S-m),0,b-1)).clip)}H.step(v.uA.value,v.uAspA.value,y?9/16:16/9,o),Q.uniforms.uAmb.value=H.texture,P.uniforms.uAmb.value=H.texture,Q.uniforms.uLevel.value=c,P.uniforms.uLevel.value=c,x.U.uTime.value=e,x.follow(f);const je=s=>V.out(G(s*.0022,.025+s*.0022,t));I.forEach((s,L)=>{const N=1-V.inOut(K(Math.abs(L-S)));s.sel=N,s.hover=ze(s.hover,ve===L?1:0,8,o);const Ge=le[L],ee=je(L);y?s.g.position.set((L-S)*(h+.16)*p,0,N*.35):s.g.position.set(Ge.x+(1-ee)*6*p,Ge.y+(1-ee)*.4,N*.38+s.hover*.08-(1-ee)*2),s.g.scale.setScalar(1+N*.08+s.hover*.03),s.g.visible=ee>.001&&(!y||Math.abs(L-S)<4.5),s.mat.uniforms.uDim.value=(1-N)*.62*(1-s.hover*.5),s.mat.uniforms.uGlow.value=N*.5+s.hover*.4,s.mat.uniforms.uTime.value=e,s.mat.uniforms.uOpacity.value=ee});const me=K(Math.floor(S),0,b-1),Ee=K(me+1,0,b-1),Ue=K(S-me);re.copy(I[me].g.position).lerp(I[Ee].g.position,Ue),z.position.set(re.x,re.y,re.z+.05+Math.sin(Math.PI*Ue)*.25),W.uniforms.uOn.value=G(-.6,0,S),W.uniforms.uTime.value=e,C.U.uTime.value=e,ie=Math.max(0,ie-o*3),W.uniforms.uFlash.value=ie*.6,Z.position.set(z.position.x-(h*.5-h*.16)*p,z.position.y+U*.5+.1,z.position.z+.06),Je(-e*.35,Fe),ae.color.copy(Fe).multiplyScalar(1.4),ae.opacity=W.uniforms.uOn.value;const Ce=Qe(a,e,o);pe.copy(Ae),Re.copy(be),pe.x+=ue?0:Math.sin(e*.11)*.12,Xe(f,pe,Re,Ce.x,Ce.y)},pick(t,e){const o=Be(t,e);return o===-1&&B>=0?n[B].url:(o>=0&&window.world?.seek?.("select",Ye(o,b)+.001),null)},hover(t,e){return ve=Ke(t,e)?-2:Be(t,e),ve>=-1},dispose(){x.dispose(),D.geometry.dispose(),P.dispose(),i.geometry.dispose(),l.dispose(),O.dispose(),H.dispose(),E.geometry.dispose(),Q.dispose(),C.dispose(),X.geometry.dispose(),X.material.dispose(),he.dispose(),ge.dispose(),we.dispose(),I.forEach(t=>t.mat.dispose()),z.geometry.dispose(),W.dispose(),ne.texture.dispose(),ae.dispose(),Z.geometry.dispose()}}};export{Pt as default};
