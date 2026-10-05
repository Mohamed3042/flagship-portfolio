import{i as Y,a5 as fe,aa as ze,a6 as Xe,af as $e,M as O,a as j,S as We,P as Ie,F as Ke,s as Le,G as ke,X as Ne,B as He,q as Ye,a3 as Je,ae as Qe,aB as Ze,b as et,V as W,R as tt,C as at,o as _,r as G,u as Ve,v as ot,p as st,K as N}from"./EditionWorld.astro_astro_type_script_index_0_lang.D3E1zgZp.js";import{G as _e,f as rt,V as it,A as de,o as ut,e as nt,a as lt,p as ct,s as ue,h as te}from"./plan.vhGxi9Os.js";import{l as vt,b as pt}from"./led.BsQu8zGn.js";import{l as mt}from"./floor.D5DKdesV.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ft=`
  uniform sampler2D uA, uB; uniform float uHasA, uHasB, uAspA, uAspB, uAspect, uMix, uGlitch, uRadius, uBevel, uDim, uTime, uOpacity, uPower, uPowerX, uReflect, uFlash, uScrim;
  varying vec2 vUv;
  ${_e}
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
  }`;function dt({radius:o=.02,bevel:f=.03,bend:d=0,aspect:n=16/9}={}){return new Y({transparent:!0,uniforms:{uA:{value:null},uB:{value:null},uHasA:{value:0},uHasB:{value:0},uAspA:{value:16/9},uAspB:{value:16/9},uAspect:{value:n},uMix:{value:0},uGlitch:{value:0},uRadius:{value:o},uBevel:{value:f},uBend:{value:d},uDim:{value:0},uTime:{value:0},uOpacity:{value:1},uPower:{value:1},uPowerX:{value:1},uReflect:{value:0},uFlash:{value:0},uScrim:{value:0}},vertexShader:"uniform float uBend; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; p.z += uBend * p.x * p.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }",fragmentShader:ft})}function ht(o){const f={type:Xe,depthBuffer:!1,minFilter:ze,magFilter:ze},d=new fe(8,8,f),n=[new fe(8,8,f),new fe(8,8,f)],T=new $e(-1,1,1,-1,0,1),J="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",p=new Y({uniforms:{uMap:{value:null},uAsp:{value:16/9},uTarget:{value:16/9}},vertexShader:J,depthTest:!1,depthWrite:!1,fragmentShader:`
      uniform sampler2D uMap; uniform float uAsp, uTarget; varying vec2 vUv;
      void main(){
        vec2 s = uAsp > uTarget ? vec2(uTarget / uAsp, 1.) : vec2(1., uAsp / uTarget);
        vec3 c = vec3(0.);
        for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) {
          vec2 uv = vUv + (vec2(float(i), float(j)) - 1.5) / 32.;
          c += texture2D(uMap, (uv - .5) * s + .5).rgb;
        }
        gl_FragColor = vec4(c / 16., 1.);
      }`}),b=new Y({uniforms:{uNow:{value:d.texture},uPrev:{value:n[0].texture},uK:{value:.1}},vertexShader:J,depthTest:!1,depthWrite:!1,fragmentShader:"uniform sampler2D uNow, uPrev; uniform float uK; varying vec2 vUv; void main(){ gl_FragColor = vec4(mix(texture2D(uPrev, vUv).rgb, texture2D(uNow, vUv).rgb, uK), 1.); }"}),P=new O(new j(2,2),p),R=new We;R.add(P);let B=0;return{get texture(){return n[B].texture},step(m,r,D,k){if(!m)return;const H=o.getRenderTarget();P.material=p,p.uniforms.uMap.value=m,p.uniforms.uAsp.value=r,p.uniforms.uTarget.value=D,o.setRenderTarget(d),o.render(R,T),P.material=b,b.uniforms.uPrev.value=n[B].texture,b.uniforms.uK.value=1-Math.exp(-k*5),B^=1,o.setRenderTarget(n[B]),o.render(R,T),o.setRenderTarget(H)},dispose(){d.dispose(),n.forEach(m=>m.dispose()),p.dispose(),b.dispose(),P.geometry.dispose()}}}const wt=`
  uniform float uTime, uAspect, uOn, uFlash; varying vec2 vUv;
  ${_e}
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
  }`,Mt=async o=>{await rt();const f=new We;f.background=it;const d=new Ie(30,o.viewport.aspect,.05,300),n=o.films,T=n.length,J=o.lang==="ar",p=J?-1:1,b=mt();b.U.uDraw.value=0,b.U.uGlow.value=0,b.U.uLevel.value=.7;const P=b.mesh;f.add(P);const R=new Y({...de,uniforms:{uAmb:{value:null},uScreen:{value:new Ke},uLevel:{value:1}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform sampler2D uAmb; uniform vec4 uScreen; uniform float uLevel; varying vec3 vW;
      void main(){
        float u = clamp((vW.x - uScreen.x) / uScreen.z + .5, 0., 1.), off = abs(vW.x - uScreen.x) - uScreen.z * .5;
        vec3 amb = texture2D(uAmb, vec2(u, .06)).rgb;
        float pool = exp(-max(vW.z - uScreen.y, 0.) * .6) * exp(-max(off, 0.) * 1.4) * smoothstep(uScreen.y - .4, uScreen.y + .2, vW.z);
        gl_FragColor = vec4(amb * pool * .32 * uLevel, 1.);
      }`}),B=new O(new j(60,40),R);B.rotation.x=-Math.PI/2,B.renderOrder=1,f.add(B);const m=dt({bevel:.026,radius:.018}),r=new O(new j(1,1,48,1),m);r.renderOrder=2,f.add(r);const D=m.clone();D.uniforms={...m.uniforms,uReflect:{value:1},uOpacity:{value:.55}};const k=new O(r.geometry,D);k.renderOrder=-1,f.add(k);const H=ht(o.renderer),Q=new Y({...de,uniforms:{uAmb:{value:H.texture},uSize:{value:new Le(1,1)},uLevel:{value:1}},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
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
      }`}),E=new O(new j(1,1),Q);E.renderOrder=1,f.add(E);const q=new ke;f.add(q);let h=.8,C=1.2;const he=new Ne(1,1,.06),we=new He({color:"#0a0a0d",metalness:.7,roughness:.35,envMap:o.env,envMapIntensity:.5}),ge=new j(1,1),X=n.map((t,e)=>{const a=Ye({radius:.045,bevel:.022});a.uniforms.uAspect.value=2/3;const i=new ke,F=new O(ge,a);F.position.z=.032,F.userData.index=e;const y=new O(he,we);y.userData.index=e,i.add(y,F),q.add(i);const u={g:i,mat:a,slab:y,sel:0,hover:0,tex:null};return o.textures.image(t.poster).then(v=>{u.tex=v,a.uniforms.uMap.value=v,a.uniforms.uHas.value=1}).catch(()=>{}),u}),V=new Y({...de,uniforms:{uTime:{value:0},uAspect:{value:1},uOn:{value:0},uFlash:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:wt}),z=new O(new j(1,1),V);z.renderOrder=4,q.add(z);const ne=(()=>{const t=document.createElement("canvas");t.width=256,t.height=128;const e=t.getContext("2d"),a=52;e.beginPath(),e.roundRect(10,10,236,108,a),e.fillStyle="rgba(4, 4, 6, .92)",e.fill(),e.lineWidth=7,e.strokeStyle="#fff",e.stroke(),e.fillStyle="#fff",e.font='800 72px "JetBrains Mono Variable", monospace',e.textAlign="center",e.textBaseline="middle",e.fillText("P1",128,68);const i=new Je(t);return i.colorSpace=Qe,i.minFilter=Ze,i.anisotropy=8,{texture:i,aspect:2}})(),ae=new et({map:ne.texture,transparent:!0,depthWrite:!1,depthTest:!1,color:"#ffffff"}),Z=new O(new j(ne.aspect,1),ae);Z.renderOrder=6,q.add(Z);const U=vt({cols:132,rows:15,width:1});U.U.uRainbow.value=.85;const $=new O(pt(1,15/132,.06,.03),new He({color:"#08080a",metalness:.7,roughness:.35,envMap:o.env,envMapIntensity:.5}));q.add(U.mesh,$);let xe="";const ye=t=>{if(t!==xe){xe=t;const e=/[\u0600-\u06ff]/.test(t);U.text([t],{family:e?'"Cairo Variable", sans-serif':'"Space Grotesk Variable", sans-serif',weight:700,fill:.78,rtl:e})}};ye(J?"اختر لاعبك":"PLAYER SELECT");let x=o.viewport.portrait,w=6.4,g=3.6;const be=new W,Ae=new W,le=n.map(()=>new W);function Me(){x=o.viewport.portrait,d.fov=x?46:30,d.aspect=o.viewport.aspect,d.updateProjectionMatrix();const t=Math.tan(st.degToRad(d.fov/2)),e=11,a=2.6,i=e*t,F=i*o.viewport.aspect,y=l=>l*F,u=l=>a+l*i;if(x){const l=u(.8),M=u(-.5);g=l-M,w=g*9/16,w>y(.88)*2&&(w=y(.88)*2,g=w*16/9),r.position.set(0,l-g/2,0),r.rotation.set(0,0,0),h=Math.min(.95,y(.15)*2*.78),C=h*1.5,q.position.set(0,u(-.68),.2),q.rotation.set(0,0,0),P.position.y=u(-1.2),m.uniforms.uAspect.value=9/16,D.uniforms.uAspect.value=9/16}else{w=y(.88),g=w*9/16,g>u(.74)-u(-.28)&&(g=u(.74)-u(-.28),w=g*16/9),r.position.set(y(-.82)*p+w/2*p,u(.74)-g/2,0),r.rotation.set(0,.1*p,0);const l=y(.56),M=u(.62)-u(-.56);h=Math.min((l-.5)/5,(M-.26)/3/1.5),C=h*1.5,q.position.set(y(.52)*p,(u(.62)+u(-.56))/2,.3),q.rotation.set(0,-.28*p,0),P.position.y=u(-.28)-.4,m.uniforms.uAspect.value=16/9,D.uniforms.uAspect.value=16/9}be.set(0,a,e),Ae.set(0,a,0),m.uniforms.uScrim.value=x?1:0,r.scale.set(w,g,1),m.uniforms.uBend.value=D.uniforms.uBend.value=x?0:-.04,k.position.set(r.position.x,2*P.position.y-r.position.y,r.position.z),k.rotation.copy(r.rotation),k.scale.set(w,-g,1),E.position.copy(r.position).add(new W(0,0,-.06)),E.rotation.copy(r.rotation),E.scale.set(w+5,g+5,1),Q.uniforms.uSize.value.set(w/(w+5),g/(g+5)),R.uniforms.uScreen.value.set(r.position.x,r.position.z,w,0),B.position.set(r.position.x,P.position.y+.01,r.position.z+10),n.forEach((l,M)=>{if(x)le[M].set(0,0,0);else{const c=M%5,I=Math.floor(M/5);le[M].set((c-2)*(h+.12)*p,(1-I)*(C+.13),0)}}),X.forEach(l=>{l.slab.scale.set(h+.06,C+.06,1),l.g.children[1].scale.set(h,C,1)}),z.scale.set(h+.3,C+.3,1),V.uniforms.uAspect.value=(h+.3)/(C+.3),Z.scale.setScalar(h*.2);const v=5*h+4*.12;U.mesh.scale.set(v,v,1),$.scale.set(v,v,1),U.mesh.position.set(0,1.5*C+.13+.38+v*15/132/2,0),$.position.copy(U.mesh.position),U.mesh.visible=$.visible=!x}Me();const ce=t=>{const e=n[t].card.replace(/card\.webp$/,"");return x?{still:n[t].poster,stillAsp:2/3,clip:`${e}hero-tall.mp4`,clipAsp:9/16}:{still:n[t].card,stillAsp:16/9,clip:o.quality>0?`${e}hero.mp4`:n[t].loop,clipAsp:16/9}},oe=new Map,Se=(t,e)=>{const a=ce(t);oe.has(a.still)||(oe.set(a.still,null),o.textures.image(a.still).then(F=>oe.set(a.still,F)).catch(()=>{}));const i=o.textures.video(a.clip);return i&&i.video.readyState>=2?[i.texture,a.clipAsp]:[oe.get(a.still)??null,a.stillAsp]},Te=new tt,Pe=new Le,Be=(t,e)=>{Pe.set(t,e),Te.setFromCamera(Pe,d);const a=Te.intersectObjects([r,...X.map(i=>i.slab)],!1)[0];return a?a.object===r?-1:a.object.userData.index:-2};let A=-1,S=-1,se=-1,De=-9,Fe=!1,ve=-2,re=0;const ie=new W,pe=new W,Oe=new W,Re=new at;return{scene:f,camera:d,resize(){const t=x;Me(),t!==x&&(S=-1)},focus(t){Fe=t,t||o.textures.pauseAllVideos()},update({p:t,t:e,dt:a}){const i=G(te.first,te.last,t)*(T-1),F=Math.floor(i),y=i-F,u=t<te.first*.6?-1.2:Math.min(T-1,F+_.inOut(G(.35,.65,y)));A=ue?Math.round(u):Ve(A,u,6,a);const v=N(Math.round(A),0,T-1),l=_.inOut(G(te.first*.35,te.first*.95,t))*(1-_.inOut(G(.965,.995,t)));m.uniforms.uPower.value=D.uniforms.uPower.value=_.inOut(G(.35,1,l)),m.uniforms.uPowerX.value=D.uniforms.uPowerX.value=_.out(G(0,.35,l)),v!==S&&A>-.5&&(S>=0?(se=S,De=e):se=-1,S=v,o.emit("film",{index:v,film:n[v]}),re=1,ye(`P1  ·  ${n[v].name.toUpperCase()}`));const M=ue?1:G(0,.55,e-De),c=m.uniforms,[I,qe]=S>=0?Se(S):[null,16/9];if(M<1&&se>=0){const[s,L]=Se(se);c.uA.value=s,c.uHasA.value=s?1:0,c.uAspA.value=L,c.uB.value=I,c.uHasB.value=I?1:0,c.uAspB.value=qe,c.uMix.value=M,c.uGlitch.value=M}else c.uA.value=I,c.uHasA.value=I?1:0,c.uAspA.value=qe,c.uMix.value=0,c.uGlitch.value=0;if(c.uTime.value=e,S>=0){const s=o.textures.video(ce(S).clip);Fe&&!ue&&l>.3?(s.video.paused&&s.video.play().catch(()=>{}),o.textures.pauseAllVideos(s.video)):s.video.paused||s.video.pause(),Math.abs(A-v)>.2&&o.textures.video(ce(N(v+Math.sign(A-v),0,T-1)).clip)}H.step(c.uA.value,c.uAspA.value,x?9/16:16/9,a),Q.uniforms.uAmb.value=H.texture,R.uniforms.uAmb.value=H.texture,Q.uniforms.uLevel.value=l,R.uniforms.uLevel.value=l,b.U.uTime.value=e,b.follow(d);const je=s=>_.out(G(s*.0022,.025+s*.0022,t));X.forEach((s,L)=>{const K=1-_.inOut(N(Math.abs(L-A)));s.sel=K,s.hover=Ve(s.hover,ve===L?1:0,8,a);const Ge=le[L],ee=je(L);x?s.g.position.set((L-A)*(h+.16)*p,0,K*.35):s.g.position.set(Ge.x+(1-ee)*6*p,Ge.y+(1-ee)*.4,K*.38+s.hover*.08-(1-ee)*2),s.g.scale.setScalar(1+K*.08+s.hover*.03),s.g.visible=ee>.001&&(!x||Math.abs(L-A)<4.5),s.mat.uniforms.uDim.value=(1-K)*.62*(1-s.hover*.5),s.mat.uniforms.uGlow.value=K*.5+s.hover*.4,s.mat.uniforms.uTime.value=e,s.mat.uniforms.uOpacity.value=ee});const me=N(Math.floor(A),0,T-1),Ee=N(me+1,0,T-1),Ce=N(A-me);ie.copy(X[me].g.position).lerp(X[Ee].g.position,Ce),z.position.set(ie.x,ie.y,ie.z+.05+Math.sin(Math.PI*Ce)*.25),V.uniforms.uOn.value=G(-.6,0,A),V.uniforms.uTime.value=e,U.U.uTime.value=e,re=Math.max(0,re-a*3),V.uniforms.uFlash.value=re*.6,Z.position.set(z.position.x-(h*.5-h*.16)*p,z.position.y+C*.5+.1,z.position.z+.06),lt(-e*.35,Re),ae.color.copy(Re).multiplyScalar(1.4),ae.opacity=V.uniforms.uOn.value;const Ue=ct(o,e,a);pe.copy(be),Oe.copy(Ae),pe.x+=ue?0:Math.sin(e*.11)*.12,ot(d,pe,Oe,Ue.x,Ue.y)},pick(t,e){const a=Be(t,e);return a===-1&&S>=0?n[S].url:(a>=0&&window.world?.seek?.("select",nt(a,T)+.001),null)},hover(t,e){return ve=ut(t,e)?-2:Be(t,e),ve>=-1},dispose(){b.dispose(),B.geometry.dispose(),R.dispose(),r.geometry.dispose(),m.dispose(),D.dispose(),H.dispose(),E.geometry.dispose(),Q.dispose(),U.dispose(),$.geometry.dispose(),$.material.dispose(),he.dispose(),we.dispose(),ge.dispose(),X.forEach(t=>t.mat.dispose()),z.geometry.dispose(),V.dispose(),ne.texture.dispose(),ae.dispose(),Z.geometry.dispose()}}};export{Mt as default};
