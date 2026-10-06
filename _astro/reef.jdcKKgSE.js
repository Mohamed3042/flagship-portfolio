import{P as Oe,aI as ye,V as C,C as E,M as U,a as ae,i as k,s as Ne,al as Se,ag as oe,a9 as I,a4 as Fe,a5 as Ae,ai as Ve,z as je,ay as Me,Z as ie,a2 as B,ac as Ee,ad as Pe,a6 as y,p as se}from"./EditionWorld.astro_astro_type_script_index_0_lang.Zw8AZbVN.js";import{f as Ie,s as qe,C as q,F as $,a as Te,l as ze,S as ne}from"./plan.pIORHmZq.js";import{a as $e}from"./mk.Bn3Tre0q.js";import{t as Le}from"./text.DyyZfh_7.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const L=new C(0,4.3,-38),Ce=[[[0,3.6,0],[0,3.2,-30]],[[0,3,-12],[0,3.4,-40]],[[0,3.1,-24],[0,4.1,-40]],[[0,3.3,-26],[0,4.2,-38]],[[0,3.3,-26],[0,4.2,-38]],[[0,3.4,-26],[0,6.5,-34]],[[0,8,-26],[0,16,-30]],[[0,3,-32],[0,2.6,-60]],[[0,14,-34],[0,24,-38]]],Ke=23.6;async function et(g){await Ie([`800 40px ${$.sans}`,`800 40px ${$.ar}`]);const G=g.lang==="ar",K=g.quality,re=g.films,S=qe(g,{uniforms:{uPin:{value:1},uPout:{value:0},uPh:{value:0},uFx:{value:1}},frag:`
      uniform float uPin, uPout, uPh, uFx;
      void main(){
        vec3 c = samp(vUv);
        c *= mix(1., smoothstep(1.5, .4, length((vUv - .5) * vec2(uAsp, 1.))), .5 * uFx);
        c = mix(c, pivot4(vUv, uAsp, uPh), uPin);
        c = mix(c, pivot5(vUv, uAsp, 0.), uPout);
        gl_FragColor = vec4(finish(c), 1.);
      }`}),n=new Oe(52,g.viewport.aspect,.3,400),b=S.world,ue=new ye(Ce.map(t=>new C(...t[0]))),ve=new ye(Ce.map(t=>new C(...t[1]))),F={uDepth:{value:0},uGold:{value:0},uT:{value:0},uFog:{value:new E},uCam:{value:new C}},be=(t,a)=>new E("#0d6f96").lerp(new E("#071a49"),t).lerp(new E("#ffc57a"),a*.8),W=new U(new ae(2,2),new k({depthTest:!1,depthWrite:!1,uniforms:{...F,uPitch:{value:0},uFov:{value:1},uAsp:{value:1},uSun:{value:new Ne(.5,1.25)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1., 1.); }",fragmentShader:q+`
      uniform float uPitch, uFov, uAsp, uDepth, uGold, uT; uniform vec2 uSun; varying vec2 vUv;
      void main(){
        float e = (uPitch + (vUv.y - .5) * uFov) / 1.5708;
        vec3 deepA = mix(S(vec3(.02, .17, .32)), S(vec3(.01, .02, .1)), uDepth), midA = mix(S(vec3(.05, .46, .62)), S(vec3(.03, .07, .26)), uDepth), topA = mix(S(vec3(.55, .95, .85)), S(vec3(.1, .22, .5)), uDepth);
        vec3 c = mix(deepA, midA, smoothstep(-.7, .15, e)); c = mix(c, topA, smoothstep(.1, .95, e));
        vec2 d = (vUv - uSun) * vec2(uAsp, 1.); float ang = atan(d.x, -d.y), r = length(d);
        float rays = pow(max(sin(ang * 11. + sin(ang * 5. + uT * .3) * 1.5 + uT * .12), 0.), 3.) * (.6 + .4 * sin(ang * 23. - uT * .2)) * exp(-r * .55);
        c += S(vec3(.7, 1., .9)) * rays * .24 * (1. - uDepth) * smoothstep(-.4, .5, e);
        c = mix(c, S(vec3(1., .78, .45)), uGold * (.35 + .5 * smoothstep(-.3, .8, e)));
        gl_FragColor = vec4(c, 1.);
      }`}));W.frustumCulled=!1,W.renderOrder=-10,b.add(W);const Y=new U(new ae(500,500).rotateX(-Math.PI/2),new k({uniforms:F,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:q+`
      uniform float uT, uDepth, uGold; uniform vec3 uFog, uCam; varying vec3 vW;
      float caus(vec2 p, float t){
        float a = fbm(p * .35 + vec2(t * .07, t * .05)), b = fbm(p * .48 - vec2(t * .06, -t * .04) + 7.);
        return pow(clamp((1. - abs(a * 2. - 1.)) * (1. - abs(b * 2. - 1.)), 0., 1.), 5.) * 2.;
      }
      void main(){
        vec2 p = vW.xz; float d = length(vW - uCam);
        float rip = sin(p.x * .7 + fbm(p * .12) * 6.) * .5 + .5;
        vec3 sand = mix(S(vec3(.74, .62, .42)), S(vec3(.92, .82, .6)), rip * .6 + vn(p * 1.3) * .4);
        float light = 1. - uDepth * .92;
        vec3 col = sand * (.3 + .8 * light) + S(vec3(.8, 1., .9)) * caus(p, uT) * .9 * light * exp(-d * .012);
        col = mix(col, uFog, 1. - exp(-d * .03));
        gl_FragColor = vec4(col, 1.);
      }`}));Y.renderOrder=0,b.add(Y);const O=[320,520,760][K],v=ie(31),P=new Se,N=7;{const t=[],a=[];for(let e=0;e<=N;e++)t.push(-1,e/N,0,1,e/N,0),e<N&&a.push(e*2,e*2+1,e*2+2,e*2+1,e*2+3,e*2+2);P.setAttribute("position",new oe(t,3)),P.setIndex(a);const r=new Float32Array(O*4),i=new Float32Array(O*4);for(let e=0;e<O;e++){const o=e%2?1:-1,s=v()<.42,u=o*(s?2.6+v()*14:5+Math.pow(v(),1.6)*20),w=18-v()*170;r.set([u,w,s?1.3+v()*2.4:7+v()*12,v()*6.283],e*4),i.set([v()*3.14,s?.1+v()*.1:.13+v()*.2,v(),0],e*4)}P.setAttribute("aD",new I(r,4)),P.setAttribute("aR",new I(i,4)),P.instanceCount=O}const J=new U(P,new k({uniforms:F,side:Fe,vertexShader:`
      attribute vec4 aD, aR; uniform float uT; uniform vec3 uCam; varying float vH, vR, vFog;
      void main(){
        float h = position.y, sw = sin(uT * .8 + aD.w + h * 2.6) * .35 * h * h + sin(uT * .5 + aD.w * 1.7) * .22 * h;
        vec3 p = vec3(aD.x + sw * aD.z * .07, h * aD.z, aD.y + sw * aD.z * .03);
        float w = aR.y * (1. - h * .75) * (1. + .25 * sin(h * 9. + aD.w));
        p.x += position.x * w * cos(aR.x); p.z += position.x * w * sin(aR.x);
        vH = h; vR = aR.z; vFog = 1. - exp(-length(p - uCam) * .03);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:q+`
      uniform float uDepth, uGold; uniform vec3 uFog; varying float vH, vR, vFog;
      void main(){
        vec3 c = mix(S(vec3(.04, .17, .09)), mix(S(vec3(.4, .62, .2)), S(vec3(.75, .8, .25)), vR), smoothstep(0., 1., vH));
        c *= (.35 + .9 * (1. - uDepth * .9)) * (.7 + .5 * vH);
        c += S(vec3(.5, .9, .5)) * pow(vH, 3.) * .12 * (1. - uDepth);
        gl_FragColor = vec4(mix(c, uFog, vFog), 1.);
      }`}));J.frustumCulled=!1,J.renderOrder=1,b.add(J);const T=[700,1100,1500][K],m=new Se;{const t=[[.5,0],[.15,.11],[-.15,.08],[-.28,.03],[-.5,.14],[-.4,0],[-.5,-.14],[-.28,-.03],[-.15,-.08],[.15,-.11]],a=[0,0,0],r=[.5,.5],i=[];t.forEach(([o,s])=>{a.push(o,s,0),r.push(o+.5,s*3+.5)});for(let o=0;o<t.length;o++)i.push(0,1+o,1+(o+1)%t.length);m.setAttribute("position",new oe(a,3)),m.setAttribute("uv",new oe(r,2)),m.setIndex(i);const e=new Float32Array(T*4);for(let o=0;o<T;o++)e.set([v(),v(),v(),v()],o*4);m.setAttribute("aR",new I(e,4)),m.instanceCount=T;for(const o of["aA","aB"])m.setAttribute(o,new I(new Float32Array(T*3),3))}const V={uMix:{value:0},uForm:{value:0},uSize:{value:1},uFS:{value:1},uF:{value:L},uDir:{value:G?-1:1}},Q=new U(m,new k({uniforms:{...F,...V},side:Fe,vertexShader:`
      attribute vec4 aR; attribute vec3 aA, aB; uniform float uT, uMix, uForm, uSize, uFS, uDir; uniform vec3 uF, uCam;
      varying vec2 vUv; varying float vPh, vTop, vFog;
      vec3 swim(vec4 r, float t){
        vec3 C = uF + vec3(cos(t * .21) * 12., sin(t * .33) * 1.6, sin(t * .21) * 7.);
        float a = r.y * 6.2832 + t * (.55 + r.x * .5) * (r.z > .5 ? 1. : -1.), rad = (.3 + r.x) * 4.2;
        vec3 off = vec3(cos(a) * rad * 1.5, sin(a * 1.3 + r.z * 6.) * rad * .35, sin(a) * rad);
        return C + off + vec3(sin(t * 1.3 + r.x * 40.), cos(t * 1.1 + r.y * 30.), sin(t * .9 + r.z * 50.)) * .5;
      }
      void main(){
        float e = smoothstep(r_d(aR), r_d(aR) + .35, uForm * 1.5);
        vec3 tg = mix(aA, aB, uMix) + vec3(sin(uT * 2. + aR.x * 30.), cos(uT * 2.3 + aR.y * 30.), 0.) * .04;
        vec3 s0 = swim(aR, uT), s1 = swim(aR, uT + .08), arc = vec3(0., sin(e * 3.14159) * (aR.w - .5) * 5., sin(e * 3.14159) * (aR.z - .5) * 4.);
        vec3 p = mix(s0, tg, e) + arc, v = (s1 - s0) * (1. - e) + vec3(uDir, 0., 0.) * .02 + (arc - arc) ;
        vec3 f = normalize(mix(normalize(v + 1e-5), vec3(uDir, 0., 0.), e * .9)), up = vec3(0., 1., 0.), u = normalize(up - f * dot(up, f) + 1e-5);
        float size = uSize * mix(1., .5, e) * uFS, w = sin(uT * (10. + aR.w * 4.) + aR.x * 20. - position.x * 6.) * .22 * smoothstep(.1, -.5, position.x);
        vec3 wp = p + f * position.x * size * uDir + u * (position.y + w) * size;
        vUv = uv; vPh = aR.x; vTop = u.y; vFog = 1. - exp(-length(wp - uCam) * .03);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`.replace(/r_d\(aR\)/g,"aR.w * .6"),fragmentShader:q+`
      uniform float uDepth, uGold; uniform vec3 uFog; varying vec2 vUv; varying float vPh, vTop, vFog;
      void main(){
        float y = vUv.y;
        vec3 stripe = fract(vPh * 7.) > .7 ? S(vec3(1., .78, .2)) : S(vec3(.1, .95, .85));
        vec3 c = mix(S(vec3(.88, .94, 1.)), S(vec3(.08, .18, .5)), smoothstep(.4, .68, y));
        c = mix(c, stripe, smoothstep(.07, 0., abs(y - .52)) * .95);
        if (vUv.x < .22) c = mix(c, S(vec3(1., .5, .32)), .9);
        c = mix(c, vec3(0.), smoothstep(.035, .02, length((vUv - vec2(.86, .56)) * vec2(1., .5))));
        c *= (.45 + .75 * (1. - uDepth * .85)) * (.8 + .4 * vTop);
        c = mix(c, S(vec3(1., .85, .6)) * 1.2, uGold * .35);
        gl_FragColor = vec4(mix(c, uFog, vFog), 1.);
      }`}));Q.frustumCulled=!1,Q.renderOrder=2,b.add(Q);let z=[],le="";function ce(){const t=g.viewport.aspect,a=t.toFixed(2);if(a===le)return;le=a;const r=2*Math.tan(se.degToRad(t<.9?31:26))*12*t,i=Math.min(16,r*.86),e=ie(77);V.uFS.value=B(Math.pow(i/16,.55),.3,1);const o=(u,w,A)=>{const x=u.length/2,f=new Float32Array(T*3);for(let d=0;d<T;d++){const l=d*2654435761%x|0,c=d<x?d*7919%x:l;f[d*3]=L.x+u[c*2]*w*1,f[d*3+1]=L.y+u[c*2+1]*w*A,f[d*3+2]=L.z+(e()-.5)*1.2}return f};z=[o($e(T,5),i/3.87,1)];const s=G?Te.words.ar:Te.words.en;for(const u of s){const w=Le(u,{family:G?$.ar:$.sans,weight:800,w:1024,h:256,step:5,rtl:G}),A=w.pts.filter((p,H)=>H%2===0),x=Math.min(...A),f=Math.max(...A),d=(x+f)/2,l=w.pts.slice();for(let p=0;p<l.length;p+=2)l[p]-=d;const c=w.pts.filter((p,H)=>H%2),R=Math.max(...c)-Math.min(...c),h=2*Math.tan(se.degToRad(t<.9?31:26))*12;z.push(o(l,Math.min(i*B(.92/Math.max(.2,f-x),.8,2.6),h*.55/(Math.max(.12,R)*.25)),.25))}j=[-1,-1]}let j=[-1,-1];const pe=(t,a)=>{j[0]===t&&j[1]===a||(j=[t,a],m.getAttribute("aA").array.set(z[t]??z[0]),m.getAttribute("aB").array.set(z[a]??z[t]??z[0]),m.getAttribute("aA").needsUpdate=m.getAttribute("aB").needsUpdate=!0)},me=await Promise.all(re.map(t=>g.textures.image(t.card).catch(()=>null))),X=new k({transparent:!0,depthWrite:!1,blending:Ae,uniforms:{uT:{value:0}},vertexShader:"varying vec3 vN, vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`
      uniform float uT; varying vec3 vN, vV;
      void main(){
        float fr = pow(1. - abs(dot(normalize(vN), normalize(vV))), 2.4);
        vec3 film = .5 + .5 * cos(6.28318 * (vec3(0., .33, .67) + fr * 1.3 + uT * .04));
        float hi = pow(max(dot(normalize(vN), normalize(vec3(-.5, .7, .6))), 0.), 40.);
        vec3 c = film * fr * .8 + vec3(1.) * hi * .9 + vec3(.3, .6, .7) * .03;
        gl_FragColor = vec4(c, 1.);
      }`}),fe=new Ve(1,30,22),De=re.map((t,a)=>{const r=new U(fe,X);r.renderOrder=7,r.visible=!1;const i=je({radius:.07,bevel:.05});i.uniforms.uMap.value=me[a],i.uniforms.uHas.value=me[a]?1:0,i.uniforms.uAspect.value=16/9,i.depthWrite=!1;const e=new U(new ae(1.55,1.55*9/16),i);return e.renderOrder=6,e.visible=!1,b.add(r,e),{s:r,scr:e,m:i}}),Re=16,_e=[160,260,380][K],de=(t,a,r)=>{const i=ie(r),e=new Float32Array(t*3),o=new Float32Array(t);for(let u=0;u<t;u++)e.set([(i()-.5)*a[0],1+i()*a[1],-22-i()*a[2]],u*3),o[u]=i();const s=new Ee;return s.setAttribute("position",new Pe(e,3)),s.setAttribute("aS",new Pe(o,1)),s},he={uAmt:{value:0}},ge=t=>new k({transparent:!0,depthWrite:!1,blending:Ae,uniforms:{...he,uT:{value:0},uH:{value:800}},vertexShader:`
      attribute float aS; uniform float uT, uH, uAmt; varying float vS, vA;
      void main(){
        vec3 p = position; p.y += mod(uT * (.25 + aS * .3) + aS * 20., 14.) - 4.; p.x += sin(uT * .5 + aS * 30.) * ${t?"1.2":".5"};
        vec4 mv = viewMatrix * vec4(p, 1.); vS = aS; vA = uAmt * smoothstep(.0, 1., aS + .2);
        gl_PointSize = ${t?"(130. + aS * 150.)":"(2.6 + aS * 3.4)"} * uH / 800. * 14. / max(-mv.z, 1.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`uniform float uT; varying float vS, vA;
      void main(){
        vec2 p = gl_PointCoord * 2. - 1.; vec3 col = mix(vec3(.2, .9, 1.), vec3(1., .3, .8), fract(vS * 5.));
        ${t?`p.y = -p.y; float bell = smoothstep(.62, .5, length(p * vec2(1., 1.25) + vec2(0., .22))) * step(-.05, p.y + .1);
        float pulse = .8 + .2 * sin(uT * 3. + vS * 20.), ten = 0.;
        for (int i = 0; i < 5; i++){ float x = -.4 + float(i) * .2, w = sin(p.y * 6. - uT * 2. + float(i)); ten += smoothstep(.04, .0, abs(p.x - x - w * .05)) * step(p.y, -.05) * step(-.9, p.y) * (1. + p.y); }
        float g = exp(-length(p) * 3.5) * .35 + bell * .6 + ten * .5; gl_FragColor = vec4(col * g * pulse * vA * 1.7, 1.);`:"float g = exp(-length(p) * 4.); gl_FragColor = vec4(col * g * vA * (.5 + .5 * sin(uT * 3. + vS * 50.)), 1.);"}
      }`}),Z=ge(!0),ee=ge(!1),Ue=new Me(de(Re,[22,10,26],5),Z),ke=new Me(de(_e,[34,18,34],6),ee);for(const t of[Ue,ke])t.frustumCulled=!1,t.renderOrder=8,b.add(t);const M=new C,D=new C,te=new C,Be={scene:S.scene,camera:n,update({p:t,t:a,dt:r,v:i}){ze(g,a,r),S.tick(a,i),ce();const e=t*ne.reef,o=S.U,s=g.viewport.aspect,u=y(29.5,33.2,e)*(1-y(35.6,38.6,e)),w=y(36.5,39.8,e);F.uDepth.value=u,F.uGold.value=w,F.uT.value=a,F.uFog.value.copy(be(u,w));const A=B(e/ne.reef);ue.getPoint(A,M),ve.getPoint(A,D),M.y+=Math.sin(e*.7)*.1,M.x+=Math.sin(e*.3)*.25;const x=ze(g,a,r);n.position.copy(M).add(D.set(x.x*.3,x.y*.15,0).multiplyScalar(0)),n.aspect=s,n.fov=s<.9?62:52,n.updateProjectionMatrix(),ue.getPoint(A,M),ve.getPoint(A,D),M.y+=Math.sin(e*.7)*.1,M.x+=Math.sin(e*.3)*.25,n.position.copy(M),n.lookAt(D.x+x.x*1.2,D.y+x.y*.6,D.z),n.updateMatrixWorld(!0),te.set(0,0,-1).applyQuaternion(n.quaternion),F.uCam.value.copy(n.position);const f=W.material;f.uniforms.uPitch.value=Math.asin(B(te.y,-1,1)),f.uniforms.uFov.value=se.degToRad(n.fov),f.uniforms.uAsp.value=s,f.uniforms.uSun.value.set(.5+te.x*.3,1.25-.45*y(36,39.5,e)),Y.position.set(n.position.x,0,n.position.z);const d=y(10,12.2,e)*(1-y(24.4,26.6,e));V.uForm.value=d;let l=0,c=0,R=0;e<14.5?l=c=0:e<15.7?(l=0,c=1,R=y(14.5,15.7,e)):e<17.7?l=c=1:e<18.9?(l=1,c=2,R=y(17.7,18.9,e)):e<21?l=c=2:e<22.2?(l=2,c=3,R=y(21,22.2,e)):l=c=3,pe(l,c),V.uMix.value=R,De.forEach((h,p)=>{const H=Ke+p*.42,_=e-H,we=_>0&&_<13&&e<33;if(h.s.visible=h.scr.visible=we,!we)return;const xe=1.1+p%3*.12,Ge=n.position.y-3.2+_*1.6,He=Math.sin(p*2.4+_*.6)*1.7*(s<.9?.6:1.4)+(p%2?.9:-.9)*(s<.9?.25:1),We=n.position.z-5.6-p%3*1.3-Math.sin(p)*.6;h.s.position.set(He,Ge,We),h.s.scale.setScalar(xe*(1+.03*Math.sin(e*4+p))),h.scr.position.copy(h.s.position),h.scr.quaternion.copy(n.quaternion),h.scr.scale.setScalar(xe*(s<.9?1.25:1)*.95),h.m.uniforms.uTime.value=a,h.m.uniforms.uOpacity.value=B(_*2)*B((13-_)*1.2)}),X.uniforms.uT.value=a,he.uAmt.value=u,Z.uniforms.uT.value=a,ee.uniforms.uT.value=a,Z.uniforms.uH.value=ee.uniforms.uH.value=g.viewport.height,o.uPin.value=1-y(.3,3.4,e),o.uPh.value=e*.35,o.uPout.value=y(37.8,ne.reef-.05,e),o.uFx.value=1-o.uPout.value,S.draw(n)},resize(){S.resize()},dispose(){S.dispose(),m.dispose(),P.dispose(),fe.dispose(),X.dispose()}};return S.resize(),ce(),pe(0,0),await S.warm(n),Be}export{et as default};
