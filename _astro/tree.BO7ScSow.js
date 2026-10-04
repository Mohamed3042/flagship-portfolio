import{e as z,r as re,b as ae,h as ve}from"./WorldChrome.astro_astro_type_script_index_0_lang.163wmGsV.js";import{S as pe,s as me,b as B,l as de,h as C,x as m,f as ie,g as f,n as _,_ as he,A as fe,i as ne,Z as R,j as we,G as ge,X as ye,T as be,z as se}from"./three.module.BBopIvPF.js";import"./preload-helper.DArFJGja.js";const ue=["studio","business","people","utility"],De=async i=>{const P=new pe,g=new me(34,i.viewport.aspect,.1,200),n=ve(2026),A=new B(new de(2,2),new C({depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uGlow:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform float uTime, uGlow; varying vec2 vUv;
      void main(){
        vec3 top = vec3(.012, .05, .06), low = vec3(.03, .12, .13);
        vec3 col = mix(low, top, smoothstep(0., 1., vUv.y));
        float haze = exp(-pow(length((vUv - vec2(.62, .18)) * vec2(1.4, 2.4)), 2.) * 2.2);
        col += vec3(.55, .42, .18) * haze * (.18 + uGlow * .22);
        col *= 1. - .35 * length(vUv - .5);
        gl_FragColor = vec4(col, 1.);
      }`}));A.frustumCulled=!1,A.renderOrder=-10,P.add(A);const d=[],U=[],le=new m(0,1,0);function j(e,t,r,o,a,p,u){const c=e.clone().addScaledVector(t,r),v=r*.028;d.push({a:e,b:c,birth:p,width:o,depth:a,family:u});const s=p+v;if(a>=6||r<.28){U.push({pos:c,birth:s,family:u});return}const D=a<2?2:n()>.7?3:2;for(let w=0;w<D;w++){const ce=(w-(D-1)/2)*(.45+n()*.25)+(n()-.5)*.2,S=t.clone().applyAxisAngle(new m(0,0,1),ce).applyAxisAngle(le,(n()-.5)*1.2);S.y=Math.max(S.y,.15),S.normalize(),j(c,S,r*(.68+n()*.12),o*.66,a+1,s,u)}}const V=new m(0,-1.3,0);d.push({a:new m(0,-4.4,0),b:new m(.08,-2.8,0),birth:0,width:9,depth:0,family:-1}),d.push({a:new m(.08,-2.8,0),b:V,birth:.05,width:8,depth:0,family:-1}),ue.forEach((e,t)=>{const r=-.85+t*.5666666666666667,o=new m(Math.sin(r),Math.cos(r)*.9,(n()-.5)*.4).normalize();j(V.clone(),o,1.9+n()*.4,6,1,.1+t*.015,t)});const T=Math.max(...d.map(e=>e.birth+e.a.distanceTo(e.b)*.028)),h=d.length,k=new Float32Array(h*12),W=new Float32Array(h*12),H=new Float32Array(h*4),O=new Float32Array(h*4),q=new Float32Array(h*4),I=new Float32Array(h*4),L=new Float32Array(h*4),X=[];d.forEach((e,t)=>{for(let o=0;o<4;o++)k.set([e.a.x,e.a.y,e.a.z],(t*4+o)*3),W.set([e.b.x,e.b.y,e.b.z],(t*4+o)*3),H[t*4+o]=o%2?1:-1,O[t*4+o]=o<2?0:1,q[t*4+o]=e.birth/T,I[t*4+o]=e.width,L[t*4+o]=e.depth;const r=t*4;X.push(r,r+1,r+2,r+1,r+3,r+2)});const l=new ie;l.setAttribute("position",new f(k,3)),l.setAttribute("aEnd",new f(W,3)),l.setAttribute("aSide",new f(H,1)),l.setAttribute("aT",new f(O,1)),l.setAttribute("aBirth",new f(q,1)),l.setAttribute("aWidth",new f(I,1)),l.setAttribute("aDepth",new f(L,1)),l.setIndex(X);const x=new C({transparent:!0,depthWrite:!1,blending:fe,side:he,uniforms:{uP:{value:0},uRes:{value:new _(1,1)},uDpr:{value:1},uTime:{value:0}},vertexShader:`
      attribute vec3 aEnd; attribute float aSide, aT, aBirth, aWidth, aDepth;
      uniform float uP, uDpr; uniform vec2 uRes; varying float vA; varying float vEdge; varying float vDepth;
      void main(){
        float grow = clamp((uP - aBirth) / .045, 0., 1.);
        vec3 tip = mix(position, aEnd, grow);
        vec3 p = mix(position, tip, aT);
        vec4 c0 = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        vec4 c1 = projectionMatrix * modelViewMatrix * vec4(tip, 1.);
        vec4 cp = projectionMatrix * modelViewMatrix * vec4(p, 1.);
        vec2 dir = normalize((c1.xy / c1.w - c0.xy / c0.w) * uRes + 1e-5);
        vec2 nrm = vec2(-dir.y, dir.x);
        float w = max(1.2, aWidth * mix(1., .55, aT)) * uDpr;
        cp.xy += nrm * aSide * 2. * w / uRes * cp.w;
        gl_Position = cp;
        vA = step(.001, grow); vEdge = aSide; vDepth = aDepth;
      }`,fragmentShader:`
      varying float vA, vEdge, vDepth;
      void main(){
        float core = 1. - abs(vEdge);
        vec3 gold = mix(vec3(1., .82, .45), vec3(.55, .95, .85), smoothstep(3., 6., vDepth));
        float a = vA * (smoothstep(0., .8, core) * .85 + .15) * (1. - vDepth * .07);
        gl_FragColor = vec4(gold * a, a);
      }`}),Z=new B(l,x);Z.frustumCulled=!1;const J=[],K=[],N=[];d.filter(e=>e.depth>=3).forEach(e=>{for(let t=0;t<(i.quality?4:2);t++){const r=n(),o=e.a.clone().lerp(e.b,r).add(new m((n()-.5)*.7,(n()-.5)*.5,(n()-.5)*.7));J.push(o.x,o.y,o.z),K.push(e.birth/T+.04+n()*.06);const a=new ne().setHSL(.38+n()*.12,.55,.45+n()*.2);N.push(a.r,a.g,a.b)}});const y=new ie;y.setAttribute("position",new R(J,3)),y.setAttribute("aBirth",new R(K,1)),y.setAttribute("color",new R(N,3));const M=new C({transparent:!0,depthWrite:!1,vertexColors:!0,uniforms:{uP:{value:0},uDpr:{value:1},uTime:{value:0}},vertexShader:"attribute float aBirth; uniform float uP, uDpr, uTime; varying vec3 vC; varying float vA; void main(){ vC = color; float g = clamp((uP - aBirth) / .05, 0., 1.); vA = g; vec4 mv = modelViewMatrix * vec4(position + vec3(0., sin(uTime + position.x * 3.) * .03, 0.), 1.); gl_PointSize = g * 7. * uDpr * (10. / -mv.z); gl_Position = projectionMatrix * mv; }",fragmentShader:"varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(vC, vA * .9); }"}),Q=new we(y,M);Q.frustumCulled=!1;const b=new ge;b.add(Z,Q),P.add(b);const Y=new ye(.36,48),G=[];ue.forEach((e,t)=>{const r=i.films.filter(a=>a.category===e),o=U.filter(a=>a.family===t).sort((a,p)=>p.pos.y-a.pos.y);r.forEach((a,p)=>{const u=o[Math.floor((p+.5)*o.length/r.length)]??o[0];if(!u)return;const c=new C({transparent:!0,uniforms:{uMap:{value:null},uHas:{value:0},uRim:{value:new ne(a.accent)},uGrow:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
          uniform sampler2D uMap; uniform float uHas, uGrow; uniform vec3 uRim; varying vec2 vUv;
          void main(){
            vec2 c = vUv - .5; float r = length(c) * 2.;
            vec2 uv = vec2(.5 + c.x * .5625, .5 + c.y);           // cover-crop the 16:9 card into the circle
            vec3 img = uHas > .5 ? texture2D(uMap, uv).rgb : uRim * .3;
            float rim = smoothstep(.86, .92, r) * smoothstep(1., .94, r);
            vec3 col = img * smoothstep(.95, .86, r) + uRim * rim * 1.6;
            gl_FragColor = vec4(col, smoothstep(1., .96, r) * uGrow);
          }`}),v=new B(Y,c);v.position.copy(u.pos),v.userData.y=u.pos.y,v.userData.url=a.url,b.add(v),G.push({film:a,mesh:v,birth:u.birth/T,mat:c}),i.textures.image(a.card).then(s=>{c.uniforms.uMap.value=s,c.uniforms.uHas.value=1}).catch(()=>{})})});const $=new be,ee=new _,te=(e,t)=>(ee.set(e,t),$.setFromCamera(ee,g),$.intersectObjects(G.filter(r=>r.mat.uniforms.uGrow.value>.5).map(r=>r.mesh),!1)[0]?.object);function oe(){const e=new _(i.viewport.width*i.viewport.dpr,i.viewport.height*i.viewport.dpr);x.uniforms.uRes.value.copy(e),x.uniforms.uDpr.value=i.viewport.dpr,M.uniforms.uDpr.value=i.viewport.dpr,b.position.set(i.viewport.portrait?0:2.4*(i.lang==="ar"?-1:1),i.viewport.portrait?.6:-1.2,0)}oe();let E=0,F=0;return{scene:P,camera:g,resize:oe,update({p:e,t,dt:r}){const o=z.inOut(re(.02,.82,e))*1.04;x.uniforms.uP.value=o,M.uniforms.uP.value=o,M.uniforms.uTime.value=t,A.material.uniforms.uGlow.value=o,G.forEach((s,D)=>{const w=z.out(re(s.birth+.02,s.birth+.09,o));s.mat.uniforms.uGrow.value=w,s.mesh.scale.setScalar(.2+.8*w),s.mesh.quaternion.copy(g.quaternion),s.mesh.position.y=s.mesh.userData.y+Math.sin(t*1.2+D)*.04}),E=ae(E,i.pointer.inside?i.pointer.x:0,2,r),F=ae(F,i.pointer.inside?i.pointer.y:0,2,r);const a=-.5+e*.9+E*.25,p=i.viewport.portrait,u=p?24:17.5,c=se.lerp(-1.2,1.6,z.inOut(e))+F*.4,v=b.position.x;g.position.set(v+Math.sin(a)*u,c,Math.cos(a)*u),g.lookAt(v*(p?1:.55),se.lerp(-.4,.9,e),0)},hover:(e,t)=>!!te(e,t),pick:(e,t)=>te(e,t)?.userData.url??null,dispose(){l.dispose(),y.dispose(),Y.dispose()}}};export{De as default};
