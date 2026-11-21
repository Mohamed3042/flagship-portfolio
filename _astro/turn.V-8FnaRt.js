import{e as O}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{n as U,g as C,o as F,h as _,P as S,F as A,q,N as V,p as z,r as G,v as k}from"./plan.dasVxRnJ.js";import{G as E,V as H,S as L,P as W,W as K,H as j,k as B,C as I,M as x,c as y,d as D,s as N,a8 as $,am as X,a9 as Z}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const J=`
  uniform vec2 uDir; uniform float uC, uR;
  varying vec2 vUv; varying float vTh; varying vec2 vP;
  void main(){
    vUv = uv; vP = position.xy;
    vec2 p = position.xy; vec3 q = vec3(p, .002);
    float s = uC - dot(p, uDir), th = 0.;
    if (s > 0.) {
      th = s / uR;
      if (th < 3.14159) { q.xy = p + uDir * (s - uR * sin(th)); q.z += uR * (1. - cos(th)); }
      else { q.xy = p + uDir * (2. * s - 3.14159 * uR); q.z += 2. * uR; }
    }
    vTh = th;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.);
  }`,Q=`
  ${V}
  uniform sampler2D uMap; uniform vec3 uPaper;
  varying vec2 vUv; varying float vTh; varying vec2 vP;
  void main(){
    float th = min(vTh, 3.14159), shade = 1. - .3 * sin(th) * sin(th);
    if (gl_FrontFacing) gl_FragColor = vec4(texture2D(uMap, vUv).rgb * shade, 1.);
    else {
      vec3 col = uPaper * (1. + .03 * (n21(vP * 150.) - .5)) * mix(vec3(1.), texture2D(uMap, vUv).rgb, .06);
      gl_FragColor = vec4(col * mix(.86, 1., shade), 1.);
    }
  }`,Y="varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",ee=`
  uniform vec2 uDir; uniform float uC, uR, uK;
  varying vec2 vP;
  void main(){
    float under = uC - dot(vP, uDir) - uR * .85;
    float sh = under > 0. ? exp(-under / (uR * .8)) * .3 : 0.;
    sh *= smoothstep(0., .04, uK) * (1. - smoothstep(.9, 1., uK));
    gl_FragColor = vec4(vec3(1. - sh), 1.);
  }`;function se(n,d,{paperOff:g=[0,0]}={}){const w=n.lang==="ar",v=new L,l=new W(A,n.viewport.aspect,.05,100);l.position.set(0,0,S),l.lookAt(0,0,0);const p=new K(2,2,{type:j,samples:n.quality?4:0,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),i={uMap:{value:p.texture},uPaper:{value:new I(q)},uDir:{value:new B(w?1:-1,.38).normalize()},uC:{value:-10},uR:{value:.18},uK:{value:0}},u=new x(new y(1,1),new D({uniforms:i,vertexShader:J,fragmentShader:Q,side:N}));u.renderOrder=10,u.frustumCulled=!1;const c=new x(new y(1,1),new D({uniforms:i,vertexShader:Y,fragmentShader:ee,transparent:!0,depthTest:!1,depthWrite:!1,blending:Z,blendSrc:X,blendDst:$}));c.renderOrder=5;const M=z(60,30,{off:g});v.add(M.mesh,c,u);let m=0;function a(){const e=n.viewport.aspect;l.aspect=e,l.updateProjectionMatrix();const r=Math.max(2,Math.round(n.viewport.width*n.viewport.dpr)),s=Math.max(2,Math.round(n.viewport.height*n.viewport.dpr));(p.width!==r||p.height!==s)&&p.setSize(r,s),e!==m&&(m=e,u.geometry.dispose(),u.geometry=new y(2*e,2,Math.round(70*Math.max(1,e)),70),c.geometry.dispose(),c.geometry=new y(2*e+.4,2.4),i.uR.value=Math.min(2*e,2)*.11)}return a(),{render(e,r,s){if(e<=0)return!1;a(),d.draw(p,r,s);const f=(m+.38)/Math.hypot(1,.38);return i.uC.value=-f-.02+(2*f+Math.PI*i.uR.value+.5)*O.inOut(Math.min(1,e)),i.uK.value=e,d.draw(d.rt,v,l),!0},warm(){a();const e=n.renderer,r=e.getRenderTarget();e.setRenderTarget(d.rt);const s=e.compileAsync(v,l).catch(()=>{});return e.setRenderTarget(r),s},dispose(){p.dispose(),M.dispose();for(const e of[u,c])e.geometry.dispose(),e.material.dispose()}}}function oe(n,{color:d="#9ccbea",color2:g="#86bce6",seed:w=7,dist:v=S-.6}={}){const{h:l,w:p}=k(v,n),i=p*1.1,u=l*1.1,c=Math.min(p,l)*.085,m={pts:G(0,0,i,u,c,{ang:-.42,seed:w,loose:.35}),w:c*1.8,color:d,wob:.4,boil:.5,seed:w},a=U(m),e=C([m],{boil:.5,paint:!0}),r=C([{...m,color:F(g,.55)}],{boil:.5});e.U.uLinear.value=1,r.U.uLinear.value=1;const s=_([{kind:"box",at:[0,0],size:[i*1.05,u*1.05],color:d,color2:g,passes:Math.round(Math.hypot(i,u)/c),ang:-.42,round:0,wob:0,t0:.86,t1:.97,scribble:!1}],{paint:!0});s.mesh.renderOrder=899,e.mesh.renderOrder=900,r.mesh.renderOrder=901;for(const t of[e,s,r])t.mesh.material.depthTest=!1,t.mesh.frustumCulled=!1;const f=new E;f.add(s.mesh,e.mesh,r.mesh),f.position.z=-v;const h=[0];for(let t=1;t<a.length;t++)h.push(h[t-1]+Math.hypot(a[t][0]-a[t-1][0],a[t][1]-a[t-1][1]));const T=h[h.length-1];let b=0;return{group:f,ink:e,flat:s,streak:r,size:[i,u],dist:v,set(t){b=t,e.set(Math.min(1,t*1.05)),r.set(Math.min(1,t*1.05)),s.set(t),f.visible=t>0},opacity(t){e.U.uOpacity.value=r.U.uOpacity.value=s.U.uOpacity.value=t},head(t=new H){const P=Math.min(1,b*1.05)*T;let o=1;for(;o<h.length-1&&h[o]<P;)o++;const R=(P-h[o-1])/Math.max(1e-6,h[o]-h[o-1]);return t.set(a[o-1][0]+(a[o][0]-a[o-1][0])*R,a[o-1][1]+(a[o][1]-a[o-1][1])*R,-v)},dispose(){e.dispose(),r.dispose(),s.dispose()}}}export{se as p,oe as s};
