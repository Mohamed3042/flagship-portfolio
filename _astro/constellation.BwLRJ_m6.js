import{b as x,r as J,h as $,e as ee}from"./WorldChrome.astro_astro_type_script_index_0_lang.Ijo534nM.js";import{g as te}from"./_lineart.BwW1cwQw.js";import{S as oe,s as se,b as ae,l as ne,h as K,n as re,x as N,f as ie,i as Q,g as S,A as le,j as ce}from"./three.module.BBopIvPF.js";import"./preload-helper.DArFJGja.js";const Z=["studio","business","people","utility"],me=n=>{const z=new oe,g=new se(36,n.viewport.aspect,.1,200),d=new ae(new ne(2,2),new K({depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uPan:{value:0},uRes:{value:new re(1,1)},uDpr:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .999, 1.); }",fragmentShader:`
      uniform float uTime, uPan, uDpr; uniform vec2 uRes; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), u.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), u.x), u.y); }
      float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.03 + 3.1; a *= .5; } return v; }
      void main(){
        vec2 uv = vUv;
        vec3 top = vec3(.035, .11, .42), bottom = vec3(.16, .38, .88);
        vec3 col = mix(bottom, top, smoothstep(0., 1., uv.y));
        col *= .92 + .16 * fbm(uv * vec2(3., 2.) + uPan * .2);           // painterly unevenness
        // halftone clouds: density field rendered as a white dot screen
        vec2 px = gl_FragCoord.xy / uDpr;
        float cell = 7.;
        vec2 g = px / cell, id = floor(g), f = fract(g) - .5;
        vec2 cuv = (id + .5) * cell / uRes.y;
        float dens = fbm(cuv * vec2(1.6, 3.2) + vec2(uPan * .35 + uTime * .01, 0.)) ;
        dens = smoothstep(.52, .78, dens) * smoothstep(.05, .45, uv.y) * (1. - smoothstep(.85, 1., uv.y));
        float r = sqrt(dens) * .5;
        float dotA = smoothstep(r + .08, r - .08, length(f)) * step(.02, dens);
        col = mix(col, vec3(.97, .98, 1.), dotA * .9);
        gl_FragColor = vec4(col, 1.);
      }`}));d.frustumCulled=!1,d.renderOrder=-10,z.add(d);const y=$(91),f=Z.map(t=>n.films.filter(s=>s.category===t)).filter(t=>t.length),r=[],k=9;f.forEach((t,s)=>{const i=s*k,v=t.length;t.forEach((a,p)=>{const c=p/Math.max(1,v)*Math.PI*2+y()*.9+s,u=1.4+y()*1.8;r.push({film:a,family:s,pos:new N(i+Math.cos(c)*u*1.3,Math.sin(c)*u*.9+(y()-.5)*.6,(y()-.5)*1.5),size:.6+Math.min(1,a.duration/210)*.7})})});const w=r.length,m=new ie,B=new Float32Array(w*3),I=new Float32Array(w*3),O=new Float32Array(w),V=new Float32Array(w),_=new Float32Array(w);r.forEach((t,s)=>{B.set([t.pos.x,t.pos.y,t.pos.z],s*3);const i=new Q(t.film.accent).lerp(new Q("#ffffff"),.45);I.set([i.r,i.g,i.b],s*3),O[s]=t.size,V[s]=y()}),m.setAttribute("position",new S(B,3)),m.setAttribute("color",new S(I,3)),m.setAttribute("aSize",new S(O,1)),m.setAttribute("aSeed",new S(V,1));const W=new S(_,1);m.setAttribute("aLit",W);const E=new K({transparent:!0,depthWrite:!1,blending:le,vertexColors:!0,uniforms:{uTime:{value:0},uScale:{value:1}},vertexShader:`
      attribute float aSize, aSeed, aLit; uniform float uTime, uScale; varying vec3 vC; varying float vT, vLit;
      void main(){
        vC = color; vLit = aLit;
        vT = .75 + .25 * sin(uTime * (1.3 + aSeed * 2.) + aSeed * 30.);
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        gl_PointSize = aSize * uScale * (90. + aLit * 70.) * (12. / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      varying vec3 vC; varying float vT, vLit;
      void main(){
        vec2 d = gl_PointCoord - .5; float r = length(d);
        float core = smoothstep(.06, 0., r);
        float glow = smoothstep(.5, 0., r) * .35;
        float flare = (smoothstep(.022, 0., abs(d.x)) * smoothstep(.5, 0., abs(d.y)) + smoothstep(.022, 0., abs(d.y)) * smoothstep(.5, 0., abs(d.x))) * .9;
        float a = (core + glow + flare) * vT * (.8 + vLit * .5);
        gl_FragColor = vec4(mix(vC, vec3(1.), core) * a, a);
      }`}),G=new ce(m,E);G.frustumCulled=!1,z.add(G);const A=[],P=[];let j=0;f.forEach((t,s)=>{const v=t.map((o,e)=>j+e).slice().sort((o,e)=>r[o].pos.x-r[e].pos.x),a=[v[0]],p=new Set(v.slice(1));for(;p.size;){const o=r[a[a.length-1]].pos;let e=-1,l=1/0;for(const X of p){const Y=r[X].pos.distanceTo(o);Y<l&&(l=Y,e=X)}a.push(e),p.delete(e)}const c=s/f.length;for(let o=0;o<a.length-1;o++){const e=r[a[o]].pos,l=r[a[o+1]].pos;A.push(e.x,e.y,e.z,l.x,l.y,l.z),P.push(c+.02+o/a.length*(.6/f.length))}if(a.length>3){const o=r[a[a.length-1]].pos,e=r[a[1]].pos;A.push(o.x,o.y,o.z,e.x,e.y,e.z),P.push(c+.7/f.length)}if(f[s+1]){const o=r[a[a.length-1]].pos,e=r[j+t.length].pos;A.push(o.x,o.y,o.z,e.x,e.y,e.z),P.push(c+.85/f.length)}j+=t.length});const R=te(A,P,{color:"#e8f0ff",opacity:.55,dur:.05});z.add(R);const h=new N;let q=-1,b=0,T=0,C=0,D=0,M=-1;const L=()=>n.viewport.width,F=()=>n.viewport.height;function U(t,s){const i=(t+1)/2*L(),v=(1-s)/2*F();let a=-1,p=34;return r.forEach((c,u)=>{h.copy(c.pos).project(g);const o=(h.x+1)/2*L(),e=(1-h.y)/2*F(),l=Math.hypot(o-i,e-v);l<p&&(p=l,a=u)}),a}function H(){d.material.uniforms.uRes.value.set(L(),F()),d.material.uniforms.uDpr.value=n.viewport.dpr,E.uniforms.uScale.value=n.viewport.dpr*(n.viewport.portrait?.8:1)}return H(),{scene:z,camera:g,resize:H,focus(t){t||(n.emit("star",null),M=-1)},update({p:t,t:s,dt:i,active:v}){const a=f.length,p=ee.inOut(J(.04,.92,t))*(a-1),c=Math.min(a-1,Math.round(p));c!==q&&(q=c,n.emit("family",{id:Z.filter(e=>n.films.some(l=>l.category===e))[c]})),C=x(C,n.pointer.inside?n.pointer.x:0,2,i),D=x(D,n.pointer.inside?n.pointer.y:0,2,i);const u=n.viewport.portrait;b=x(b,p*k-(u?0:2.6*(n.lang==="ar"?-1:1)),4,i),T=x(T,u?.4:1.05,4,i),g.position.set(b+C*.8,T+D*.5,u?17:12.5),g.lookAt(b+C*.3,T,0),R.material.uniforms.uP.value=J(0,.97,t);const o=d.material.uniforms;if(o.uTime.value=s,o.uPan.value=b*.1,E.uniforms.uTime.value=s,r.forEach((e,l)=>{_[l]=x(_[l],e.family===c||l===M?1:.15,4,i)}),W.needsUpdate=!0,v&&n.pointer.inside){const e=U(n.pointer.x,n.pointer.y);e!==M&&(M=e),e>=0?(h.copy(r[e].pos).project(g),n.emit("star",{x:(h.x+1)/2*L(),y:(1-h.y)/2*F(),film:r[e].film})):n.emit("star",null)}},hover:(t,s)=>U(t,s)>=0,pick:(t,s)=>{const i=U(t,s);return i>=0?r[i].film.url:null},dispose(){m.dispose(),R.geometry.dispose()}}};export{me as default};
