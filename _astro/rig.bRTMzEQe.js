import{S as We,P as Ne,X as te,C as R,V as b,M as w,a as L,i as M,ax as Oe,Y as ne,aU as qe,a4 as Ee,at as Ie,au as Ge,as as Re,j as se,a3 as je,aL as P,J as ke,_ as Ae,b as Be,aW as $e,aX as Ce,aY as De,o as re,r as ie,k as Ue,I as He}from"./EditionWorld.astro_astro_type_script_index_0_lang.B6nfWhaD.js";import{V as Xe,G as z,p as Ye,b as Je,a as ce,A as Qe,g as Ke,c as D,s as Fe}from"./plan.CN7tiTT4.js";import{n as Ze}from"./neon.CVbQQChv.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const _="varying vec2 vUv; varying vec3 vN, vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }";function eo(p,c=.14){const h=new $e;let W=p[0].clone();for(let i=1;i<p.length;i++){const d=p[i-1],l=p[i],t=p[i+1];if(!t){h.add(new Ce(W,l.clone()));break}const C=l.clone().sub(d),N=t.clone().sub(l),y=Math.min(c,C.length()/2,N.length()/2),v=l.clone().addScaledVector(C.normalize(),-y),x=l.clone().addScaledVector(N.normalize(),y);h.add(new Ce(W,v)),h.add(new De(v,l.clone(),x)),W=x}return h}const so=p=>{const c=new We;c.background=Xe;const h=new Ne(30,p.viewport.aspect,.05,300),W=p.quality,i={uTime:{value:0},uFlow:{value:0},uSpin:{value:0},uBlur:{value:0},uLevel:{value:1}},d=4.6,l=4.8,t=2.3,C=new te({color:"#0b0b0e",metalness:.65,roughness:.42,envMap:p.env,envMapIntensity:.22}),N=new te({color:"#0a0b0d",metalness:.3,roughness:.6,envMap:p.env,envMapIntensity:.12}),y=[],v=(e,o,a,r,f,m,g=C)=>{const s=new Ae(e,o,a);y.push(s);const T=new w(s,g);return T.position.set(r,f,m),c.add(T),T},x=.07;for(const[e,o]of[[-1,-1],[1,-1],[-1,1],[1,1]])v(x,l,x,e*d/2,l/2,o*t/2);for(const[e,o]of[[0,-1],[1,-1],[0,1],[1,1]])v(d,x,x,0,e*l,o*t/2);for(const[e,o]of[[-1,0],[1,0],[-1,1],[1,1]])v(x,x,t,e*d/2,o*l,0);v(d,l,.03,0,l/2,-t/2+.02),v(.03,l,t,-d/2+.02,l/2,0),v(d,.9,t-.1,0,.45,0);const H={uLampP:{value:[new b,new b,new b]},uLampC:{value:[new R,new R,new R]}},j=new w(new L(3.5,3.4),new M({uniforms:{...i,...H},vertexShader:_,fragmentShader:`
      uniform float uTime, uLevel; uniform vec3 uLampP[3], uLampC[3]; varying vec2 vUv; varying vec3 vW;
      ${z}
      vec3 lamps(){ vec3 s = vec3(0.); for (int i = 0; i < 3; i++) { vec3 d = uLampP[i] - vW; s += uLampC[i] / (1. + dot(d, d) * 1.6); } return s; }
      void main(){
        // traces: long runs along rows and columns (a bus every few cells), faint; now and then a pulse runs along one
        vec2 g = vUv * vec2(30., 29.), c = floor(g), f = fract(g);
        float row = step(.72, h21(vec2(c.y, 1.7))) * step(.25, h21(vec2(floor(c.x / 6.), c.y))), col_ = step(.8, h21(vec2(c.x, 5.3))) * step(.35, h21(vec2(c.x, floor(c.y / 5.))));
        float aa = fwidth(g.y) * 1.2;
        float tr = max(row * (1. - smoothstep(.04, .04 + aa, abs(f.y - .5))), col_ * (1. - smoothstep(.04, .04 + aa, abs(f.x - .5))));
        float pulse = pow(fract(h21(c.yy) * 3. + uTime * .25 - c.x * .03), 24.) * row + pow(fract(h21(c.xx) * 3. + uTime * .25 - c.y * .03), 24.) * col_;
        vec3 lit = lamps();
        vec3 col = vec3(.007, .008, .01) + vec3(.022, .024, .03) * tr + spectrum(c.x * .02 + c.y * .01 - uTime * .05) * tr * pulse * .7;
        col += lit * (.045 + tr * .12) * (.85 + .3 * h21(c));
        gl_FragColor = vec4(col * uLevel, 1.);
      }`}));j.position.set(-.4,2.75,-t/2+.05),c.add(j);const le=[],X=(e,o=.6,a=0)=>{const r=new M({uniforms:{...i,uHue:{value:a},uSpeed:{value:o},uAxis:{value:e}},vertexShader:"varying vec3 vP; void main(){ vP = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.); }",fragmentShader:`
      uniform float uTime, uHue, uSpeed, uAxis, uLevel, uFlow; varying vec3 vP;
      ${z}
      void main(){ float s = uAxis < .5 ? vP.x : uAxis < 1.5 ? vP.y : vP.z; gl_FragColor = vec4(spectrum(s * .35 - uTime * uSpeed - uFlow * .2 + uHue) * 1.5 * uLevel, 1.); }`});return le.push(r),r},Y=[],O=(e,o,a,r,f,m=.35,g=0)=>{const s=new w(new L(e,o),new Be({map:Ke(),...Qe,opacity:m,color:"#ffffff"}));return s.position.set(a,r,f),s.rotation.y=g,s.renderOrder=3,c.add(s),Y.push(s),s};v(2.9,.4,.75,-.45,2.1,-t/2+.52),v(2.86,.045,.03,-.45,1.93,-t/2+.9,X(0,.5)),O(3.6,.8,-.45,1.93,-t/2+.93,.3);const k=new w(new L(2.5,.12),new M({uniforms:i,vertexShader:_,fragmentShader:`
      uniform float uTime, uFlow, uLevel; varying vec2 vUv;
      ${z}
      void main(){
        float flow = uTime * .35 + uFlow, s = vUv.x * 5.;
        vec3 c = mix(spectrum(s * .12 - flow * .22 + .3), vec3(1.), .3) * (.35 + .25 * sin(s * 9. - flow * 9.));
        float edge = smoothstep(0., .25, vUv.y) * smoothstep(1., .75, vUv.y);
        gl_FragColor = vec4(c * (.25 + .75 * edge) * uLevel, 1.);
      }`}));k.position.set(-.45,2.17,-t/2+.9+.004),c.add(k);const ve=X(0,.3,.5);for(const[e,o,a,r]of[[.2,.72,-.9,3.42],[.74,.18,-.32,3.98],[.62,.22,-1.15,1.3],[.46,.42,.55,1.32]])v(e,o,.12,a,r,-t/2+.1),v(e*.86,.012,.01,a,r-o/2+.03,-t/2+.165,ve);for(let e=0;e<4;e++)v(.06,1.05,.25,.5+e*.13,3.42,-t/2+.2,N),v(.06,1.05,.035,.5+e*.13,3.42,-t/2+.34,X(1,.9,e*.08));O(1.1,1.6,.7,3.42,-t/2+.38,.28),v(.66,.66,.22,-.32,3.42,-t/2+.18);const ue=new M({uniforms:i,vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform float uTime, uLevel; varying vec3 vP; ${z}
      void main(){ float a = atan(vP.y, vP.x) / 6.28318; gl_FragColor = vec4(spectrum(a - uTime * .25) * 1.6 * uLevel, 1.); }`}),J=new w(new Oe(.25,.018,8,64),ue);J.position.set(-.32,3.42,-t/2+.3),c.add(J);const q=Ze({depth:.12});q.group.scale.setScalar(.085),q.group.position.set(-.32,3.42,-t/2+.31),c.add(q.group),O(1.1,1.1,-.32,3.42,-t/2+.33,.3);const u=(e,o,a)=>new b(e,o,a),n={x:1.55,z:.2,y0:1.15,y1:3.35,r:.26},Ve=[[u(n.x-.2,1.5,n.z),u(.3,1.5,n.z),u(.3,2.1,n.z),u(.3,2.1,-.3)],[u(-.95,2.1,-.3),u(-.95,2.1,.12),u(-.95,3.42,.12),u(-.95,3.42,-t/2+.2),u(-.68,3.42,-t/2+.2)],[u(.04,3.42,-t/2+.2),u(.22,3.42,-t/2+.2),u(.22,3.42,.02),u(.22,4.18,.02),u(-1.6,4.18,.02)],[u(1.25,4.22,.02),u(1.25,4.22,n.z),u(n.x,4.22,n.z),u(n.x,n.y1+.05,n.z)]],pe=new M({uniforms:i,vertexShader:_,fragmentShader:`
      uniform float uTime, uFlow, uLevel; varying vec2 vUv; varying vec3 vN, vW;
      ${z}
      void main(){
        // a clear acrylic rod of pale coolant: lit through, so it glows at its edges (a light pipe) and runs a fine
        // white highlight along its length; the colour drifts along the loop with the flow, bubbles ride in it
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        float facing = abs(dot(N, V)), edge = pow(1. - facing, 1.6);
        float s = vUv.x, flow = uTime * .35 + uFlow;
        vec3 liquid = mix(spectrum(s * .16 - flow * .22), vec3(1.), .3);
        float spec = pow(max(dot(reflect(-V, N), normalize(vec3(-.35, 1., .55))), 0.), 70.);
        vec2 bq = vec2(s * 22. - flow * 2.6, vUv.y * 6.), bc = floor(bq), bf = fract(bq) - .5;
        float bub = step(.7, h21(bc + 9.)) * (1. - smoothstep(.12, .2, length(bf * vec2(1., 1.6) - (vec2(h21(bc + 2.), h21(bc + 5.)) - .5) * .5))) * smoothstep(.3, .8, facing);
        vec3 col = liquid * (.16 + .95 * edge) + vec3(1.) * (spec * .75 + bub * .55);
        gl_FragColor = vec4(col * uLevel, 1.);
      }`}),fe=new te({color:"#c9ccd3",metalness:1,roughness:.22,envMap:p.env,envMapIntensity:1.2}),me=new ne(.068,.068,.13,20);y.push(me);const de=(e,o)=>{const a=new w(me,fe);a.position.copy(e).addScaledVector(o,-.045),a.quaternion.setFromUnitVectors(new b(0,1,0),o),c.add(a)};Ve.forEach((e,o)=>{const a=e.length;de(e[0],e[0].clone().sub(e[1]).normalize().negate()),de(e[a-1],e[a-1].clone().sub(e[a-2]).normalize());const r=eo(e),f=new qe(r,72,.046,14,!1),m=f.getAttribute("uv"),g=r.getLength();for(let s=0;s<m.count;s++)m.setX(s,m.getX(s)*g*.4+o*1.7);y.push(f),c.add(new w(f,pe))});const we=new M({uniforms:i,vertexShader:_,transparent:!0,fragmentShader:`
      uniform float uTime, uFlow, uLevel; varying vec2 vUv; varying vec3 vN, vW;
      ${z}
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        float fres = pow(1. - abs(dot(N, V)), 2.5), flow = uTime * .35 + uFlow;
        vec2 p = vec2(vUv.x * 6.28 * .6, vUv.y * 3.4);
        float sw = vnoise(p * 1.4 + vec2(flow * 1.3, -flow * 1.8)) * .6 + vnoise(p * 3.1 + vec2(-flow, -flow * 2.6)) * .4;
        vec3 c = mix(spectrum(vUv.y * .2 + sw * .18 - flow * .22), vec3(1.), .28) * (.3 + .75 * sw * sw);
        float bub = smoothstep(.985, 1., vnoise(vec2(vUv.x * 40., vUv.y * 22. - flow * 6.)));
        vec3 col = c * (.5 + fres * .8) + vec3(1.) * (fres * .35 + bub * .7);
        gl_FragColor = vec4(col * uLevel, .92);
      }`}),Q=new w(new ne(n.r,n.r,n.y1-n.y0,40,1,!0),we);Q.position.set(n.x,(n.y0+n.y1)/2,n.z),c.add(Q);for(const e of[n.y0,n.y1]){const o=v(n.r*2.2,.1,n.r*2.2,n.x,e,n.z);o.geometry=new ne(n.r*1.08,n.r*1.08,.12,40),y.push(o.geometry)}O(1.5,3.4,n.x,2.25,n.z+.3,.32);const he=new M({uniforms:{...i,uOff:{value:0}},transparent:!0,depthWrite:!1,side:Ee,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime, uSpin, uBlur, uLevel, uOff; varying vec2 vP;
      ${z}
      void main(){
        float r = length(vP) / .5, a = atan(vP.y, vP.x);
        if (r > 1.06) discard;
        vec3 ring = spectrum(a / 6.28318 - uTime * .2 + uOff);
        float band = exp(-pow((r - .97) / .025, 2.)), halo = exp(-pow((r - .97) / .12, 2.)) * .35;
        float ph = a + uSpin + r * 1.1, blade = smoothstep(.0, .12, sin(ph * 7.) * .5 + .5 - .42);
        float vane = mix(blade, .5, uBlur) * step(r, .9) * step(.2, r);
        float hub = smoothstep(.2, .18, r);
        vec3 col = ring * (band * 2.2 + halo) + ring * vane * .18 * (1. - r * .4) + vec3(.02) * hub;
        float alpha = clamp(band + halo + vane * .55 + hub, 0., 1.);
        gl_FragColor = vec4(col * uLevel, alpha);
      }`}),ge=[],_e=(()=>{const e=new Ie,o=.575,a=.08;e.moveTo(-o+a,-o),e.lineTo(o-a,-o),e.quadraticCurveTo(o,-o,o,-o+a),e.lineTo(o,o-a),e.quadraticCurveTo(o,o,o-a,o),e.lineTo(-o+a,o),e.quadraticCurveTo(-o,o,-o,o-a),e.lineTo(-o,-o+a),e.quadraticCurveTo(-o,-o,-o+a,-o);const r=new Ge;r.absarc(0,0,.53,0,Math.PI*2,!0),e.holes.push(r);const f=new Re(e,{depth:.2,bevelEnabled:!1,curveSegments:24});return f.translate(0,0,-.1),y.push(f),f})(),ye=(e,o,a,r,f)=>{const m=new w(_e,C);m.position.set(e,o,a),m.rotation.copy(r),c.add(m);const g=he.clone();g.uniforms={...i,uOff:{value:f*.13}};const s=new w(new L(1.1,1.1),g);s.position.set(e,o,a),s.rotation.copy(r),s.renderOrder=2,c.add(s),ge.push({m:s,mat:g})};for(let e=0;e<3;e++)ye(d/2-.2,1.62+e*1.18,0,new Ue(0,Math.PI/2,0),e);v(3.5,.14,1.25,-.2,4.45,0);for(let e=0;e<3;e++)ye(-1.38+e*1.18,4.62,0,new Ue(-Math.PI/2,0,0),e+3);O(2.6,4.2,d/2-.05,2.8,0,.4,Math.PI/2);const K=new M({transparent:!0,depthWrite:!1,uniforms:i,vertexShader:_,fragmentShader:`
      uniform float uTime; varying vec3 vN, vW; varying vec2 vUv;
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW), R = reflect(-V, N);
        float fres = .04 + .96 * pow(1. - abs(dot(N, V)), 5.);
        float strip = exp(-pow((R.y - .55) / .06, 2.)) * .5 + exp(-pow((R.x + R.y * .4 - .3) / .03, 2.)) * .35;
        float edge = smoothstep(.985, 1., max(abs(vUv.x - .5), abs(vUv.y - .5)) * 2.);
        vec3 col = vec3(.85, .88, 1.) * (strip * (.25 + fres) + fres * .12) + vec3(.6) * edge * .2;
        gl_FragColor = vec4(col, clamp(.03 + fres * .5 + strip * .25 + edge * .2, 0., 1.));
      }`}),A=new w(new L(d-.1,l-.1),K);A.position.set(0,l/2,t/2+.01),A.renderOrder=5;const E=new w(new L(t-.1,l-.1),K);E.position.set(d/2+.01,l/2,0),E.rotation.y=Math.PI/2,E.renderOrder=5,c.add(A,E);const U=[new se("#ffffff",6,4,1.5),new se("#ffffff",5,4,1.5),new se("#ffffff",4,4,1.5)];U[0].position.set(d/2-.5,2.8,.3),U[1].position.set(.2,3.4,-.3),U[2].position.set(-.6,1.4,.2),W===0&&U.pop(),c.add(...U),c.add(new je("#8890a8","#050506",.25));const Z=new M({uniforms:{...i,uTint:{value:new R}},vertexShader:_,fragmentShader:`
      uniform vec3 uTint; uniform float uLevel; varying vec3 vW;
      void main(){
        float d = length((vW.xz - vec2(.2, .2)) * vec2(.55, .8));
        vec3 col = vec3(.004) + uTint * (exp(-d * d * .9) * .5 + exp(-d * .7) * .1);
        gl_FragColor = vec4(col * uLevel, 1.);
      }`}),B=new w(new L(80,60),Z);B.rotation.x=-Math.PI/2,B.position.y=-.005,c.add(B);let I=p.viewport.portrait;function xe(){I=p.viewport.portrait,h.fov=I?44:30,h.aspect=p.viewport.aspect,h.updateProjectionMatrix()}xe();const ee=new b,oe=new b,be=new b,Me=new b,S=new R;let Pe=0,Se=0,F=0,ae=-1;return{scene:c,camera:h,resize:xe,update({p:e,t:o,dt:a}){const r=ae<0?0:Math.abs(e-ae)/Math.max(a,.001);ae=e,F=He(F,Math.min(1,r*6),r*6>F?5:1.4,a),Pe+=a*(Fe?0:5+F*40),Se+=a*(Fe?0:.2+F*1.6),i.uTime.value=o,i.uSpin.value=Pe,i.uFlow.value=Se,i.uBlur.value=Math.min(1,.35+F),q.update(o);const f=re.inOut(ie(D.turn[0],D.turn[1],e)),m=re.inOut(ie(D.macro[0],D.macro[1],e)),g=P(.95,.12,f),s=I?13.6:10.6,T=P(.2,.1,f),Te=I?1.45:2.45;oe.set(0,Te,0),ee.set(Math.sin(g)*Math.cos(T)*s,Te+Math.sin(T)*s,Math.cos(g)*Math.cos(T)*s);const V=re.inOut(ie(.62,.88,e));be.set(P(3.7,.5,V),P(2.9,3.7,V),P(5.4,4.3,V)),Me.set(P(1.2,-.3,V),P(2.55,3.4,V),P(.1,-.8,V)),ee.lerp(be,m),oe.lerp(Me,m);const Le=Ye(p,o,a);ke(h,ee,oe,Le.x,Le.y);const ze=p.viewport;Je(h,I?0:(p.lang==="ar"?-1:1)*.3*(1-m),0,ze.width,ze.height),h.updateProjectionMatrix(),U.forEach(($,G)=>{ce(G*.33-o*.2,S),$.color.copy(S),H.uLampP.value[G].copy($.position),H.uLampC.value[G].copy(S)}),ce(-o*.2+.1,S),Z.uniforms.uTint.value.copy(S),Y.forEach(($,G)=>{ce(G*.19-o*.22,S),$.material.color.copy(S)})},dispose(){y.forEach(e=>e.dispose()),le.forEach(e=>e.dispose()),C.dispose(),fe.dispose(),ve.dispose(),k.geometry.dispose(),k.material.dispose(),N.dispose(),q.dispose(),ue.dispose(),pe.dispose(),we.dispose(),K.dispose(),Z.dispose(),ge.forEach(e=>{e.m.geometry.dispose(),e.mat.dispose()}),Y.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),j.geometry.dispose(),j.material.dispose(),Q.geometry.dispose(),A.geometry.dispose(),E.geometry.dispose(),B.geometry.dispose(),J.geometry.dispose(),he.dispose()}}};export{so as default};
