import{S as Z,P as E,g as q,i as H,V as J,C as p,_ as Q,u as $,v as R,a7 as ee,a8 as te,a9 as L,I,p as ae,Z as oe,o as W,r as z}from"./EditionWorld.astro_astro_type_script_index_0_lang.DFJfHFf_.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const re=(e,n,a)=>{let d=!1;for(let l=0,s=a.length-1;l<a.length;s=l++){const[c,t]=a[l],[v,h]=a[s];t>n!=h>n&&e<(v-c)*(n-t)/(h-t)+c&&(d=!d)}return d},le=e=>{const n=new Z,a=new E(34,e.viewport.aspect,.1,240),d=q({base:"#040506",line:"#5c6f78",accent:"#6a5cff",fade:.05,floorY:-14}),l=d.material.uniforms;n.add(d);const s=new H({uniforms:{uTime:{value:0},uP:{value:0},uFlip:{value:0},uCam:{value:new J}},vertexShader:`
      attribute vec3 aColor; attribute float aLit; attribute float aSeed; attribute vec2 aCell;
      uniform float uTime, uP, uFlip;
      varying vec3 vColor; varying float vLit; varying vec3 vN; varying vec3 vWorld; varying float vBack;
      mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
      void main(){
        // flip wave: left to right, each tile turns 180° about X
        float start = (aCell.x * .7 + aSeed * .3) * .8;
        float a = smoothstep(start, start + .2, uFlip) * 3.14159;
        mat3 R = rotX(a);
        vec3 p = R * position; vec3 n = R * normal;
        // ripple: lit tiles breathe forward in rings
        float d = length(aCell - vec2(.5, .5)) * 6.;
        float wave = sin(d * 2.2 - uTime * 2.4) * .5 + .5;
        float push = aLit * (.35 + wave * .55) * smoothstep(.05, .35, uP) + aSeed * .08;
        vec4 world = modelMatrix * instanceMatrix * vec4(p + vec3(0., 0., push), 1.);
        vWorld = world.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * n);
        vColor = aColor; vLit = aLit * (.55 + wave * .45); vBack = step(1.5708, a);
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,fragmentShader:`
      uniform vec3 uCam; uniform float uP;
      varying vec3 vColor; varying float vLit; varying vec3 vN; varying vec3 vWorld; varying float vBack;
      void main(){
        vec3 n = normalize(vN); vec3 v = normalize(uCam - vWorld);
        float diff = max(dot(n, normalize(vec3(-.4, .7, .8))), 0.);
        float fres = pow(1. - max(dot(n, v), 0.), 3.);
        vec3 front = vColor * (.12 + diff * .5) + vColor * vLit * 1.35 + fres * .35;
        vec3 back = vec3(.93, .94, .95) * (.82 + diff * .2);
        gl_FragColor = vec4(mix(front, back, vBack), 1.);
      }`});let c=null,t=0,v=0;function h(){const o=e.viewport.portrait;t=o?18:40,v=o?32:22,c?.geometry.dispose(),c&&n.remove(c);const u=new Q(.92,.92,.32),f=t*v,y=new Float32Array(f*3),b=new Float32Array(f),C=new Float32Array(f),w=new Float32Array(f*2),r=oe(17),M=["#6a4cff","#3f7bff","#9b5cff","#2fd3c5","#b9dacc"].map(i=>new p(i)),O=e.films.map(i=>new p(i.accent)),T=t*(o?.86:.5)/R.width,U=o?-3:-2.2,V=$.map(i=>i.map(([g,S])=>[(g-R.width/2)*T+(o?0:e.lang==="ar"?-2:2),(S-R.height/2)*T+U])),A=new ee(u,s,f),F=new te;let m=0;for(let i=0;i<v;i++)for(let g=0;g<t;g++,m++){const S=g-(t-1)/2,_=i-(v-1)/2;F.position.set(S,_,0),F.updateMatrix(),A.setMatrixAt(m,F.matrix);const B=V.some(Y=>re(S,_,Y)),x=B?M[Math.floor(r()*M.length)].clone().lerp(O[m%O.length]??M[0],.25):new p("#0b0d12").multiplyScalar(.6+r()*.8);!B&&r()>.985&&x.copy(M[1]).multiplyScalar(.5),y.set([x.r,x.g,x.b],m*3),b[m]=B?.7+r()*.3:0,C[m]=r(),w.set([g/(t-1),i/(v-1)],m*2)}u.setAttribute("aColor",new L(y,3)),u.setAttribute("aLit",new L(b,1)),u.setAttribute("aSeed",new L(C,1)),u.setAttribute("aCell",new L(w,2)),A.frustumCulled=!1,n.add(A),c=A}h();let j=e.viewport.portrait;const G=new p("#040506"),K=new p("#e4e8ea"),X=new p("#5c6f78"),D=new p("#9aa3a8");let k=0,P=0;const N={scene:n,camera:a,light:!1,resize(){e.viewport.portrait!==j&&(j=e.viewport.portrait,h())},update({p:o,t:u,dt:f}){const y=W.inOut(z(.72,1,o));s.uniforms.uTime.value=u,s.uniforms.uP.value=o,s.uniforms.uFlip.value=y,k=I(k,e.pointer.inside?e.pointer.x:0,2.5,f),P=I(P,e.pointer.inside?e.pointer.y:0,2.5,f);const b=Math.tan(ae.degToRad(a.fov/2)),C=Math.max(t*.92/(2*b*e.viewport.aspect),v*.92/(2*b)),w=W.inOut(z(0,.7,o));a.position.set(k*1.6+(1-w)*-4,P*1+(1-w)*-2,C*(1.18-w*.22)),a.lookAt(0,0,0),s.uniforms.uCam.value.copy(a.position);const r=z(.8,1,o);l.uBase.value.copy(G).lerp(K,r),l.uLine.value.copy(X).lerp(D,r),l.uLight.value=r,l.uGlow.value=.9*(1-r),N.light=y>.55},dispose(){c?.geometry.dispose()}};return N};export{le as default};
