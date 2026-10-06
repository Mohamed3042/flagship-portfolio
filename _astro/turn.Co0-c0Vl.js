import{G as O,V as U,S as F,P as _,q,H as A,s as k,C as V,M as C,a as y,i as x,a4 as z,ap as G,aK as E,aq as H,o as K}from"./EditionWorld.astro_astro_type_script_index_0_lang.Zw8AZbVN.js";import{n as L,g as D,o as W,h as j,P as S,F as B,q as I,N,p as $,r as X,v as Z}from"./plan.CzQy7yfI.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const J=`
  uniform vec2 uDir; uniform float uC, uR;
  varying vec2 vUv; varying float vTh; varying vec2 vP;
  void main(){
    vUv = uv; vP = position.xy;
    vec2 p = position.xy; vec3 q = vec3(p, .002);
    float s = uC - dot(p, uDir), th = 0.;
    if (s > 0.) {   // past the fold: round a cylinder of radius uR, then flat on its back beyond the half turn
      th = s / uR;
      if (th < 3.14159) { q.xy = p + uDir * (s - uR * sin(th)); q.z += uR * (1. - cos(th)); }
      else { q.xy = p + uDir * (2. * s - 3.14159 * uR); q.z += 2. * uR; }
    }
    vTh = th;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.);
  }`,Q=`
  ${N}
  uniform sampler2D uMap; uniform vec3 uPaper;
  varying vec2 vUv; varying float vTh; varying vec2 vP;
  void main(){
    float th = min(vTh, 3.14159), shade = 1. - .3 * sin(th) * sin(th);   // darker where the sheet stands up
    if (gl_FrontFacing) gl_FragColor = vec4(texture2D(uMap, vUv).rgb * shade, 1.);
    else {   // the back of the sheet: paper, the drawing faintly through it, shaded by the curl
      vec3 col = uPaper * (1. + .03 * (n21(vP * 150.) - .5)) * mix(vec3(1.), texture2D(uMap, vUv).rgb, .06);
      gl_FragColor = vec4(col * mix(.86, 1., shade), 1.);
    }
  }`,Y="varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",ee=`
  uniform vec2 uDir; uniform float uC, uR, uK;
  varying vec2 vP;
  void main(){
    float under = uC - dot(vP, uDir) - uR * .85;   // how far into the bare page beneath the lifted sheet
    float sh = under > 0. ? exp(-under / (uR * .8)) * .3 : 0.;
    sh *= smoothstep(0., .04, uK) * (1. - smoothstep(.9, 1., uK));
    gl_FragColor = vec4(vec3(1. - sh), 1.);
  }`;function re(n,v,{paperOff:g=[0,0]}={}){const w=n.lang==="ar",d=new F,l=new _(B,n.viewport.aspect,.05,100);l.position.set(0,0,S),l.lookAt(0,0,0);const h=new q(2,2,{type:A,samples:n.quality?4:0,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),i={uMap:{value:h.texture},uPaper:{value:new V(I)},uDir:{value:new k(w?1:-1,.38).normalize()},uC:{value:-10},uR:{value:.18},uK:{value:0}},u=new C(new y(1,1),new x({uniforms:i,vertexShader:J,fragmentShader:Q,side:z}));u.renderOrder=10,u.frustumCulled=!1;const p=new C(new y(1,1),new x({uniforms:i,vertexShader:Y,fragmentShader:ee,transparent:!0,depthTest:!1,depthWrite:!1,blending:H,blendSrc:E,blendDst:G}));p.renderOrder=5;const M=$(60,30,{off:g});d.add(M.mesh,p,u);let m=0;function a(){const e=n.viewport.aspect;l.aspect=e,l.updateProjectionMatrix();const r=Math.max(2,Math.round(n.viewport.width*n.viewport.dpr)),s=Math.max(2,Math.round(n.viewport.height*n.viewport.dpr));(h.width!==r||h.height!==s)&&h.setSize(r,s),e!==m&&(m=e,u.geometry.dispose(),u.geometry=new y(2*e,2,Math.round(70*Math.max(1,e)),70),p.geometry.dispose(),p.geometry=new y(2*e+.4,2.4),i.uR.value=Math.min(2*e,2)*.11)}return a(),{render(e,r,s){if(e<=0)return!1;a(),v.draw(h,r,s);const f=(m+.38)/Math.hypot(1,.38);return i.uC.value=-f-.02+(2*f+Math.PI*i.uR.value+.5)*K.inOut(Math.min(1,e)),i.uK.value=e,v.draw(v.rt,d,l),!0},warm(){a();const e=n.renderer,r=e.getRenderTarget();e.setRenderTarget(v.rt);const s=e.compileAsync(d,l).catch(()=>{});return e.setRenderTarget(r),s},dispose(){h.dispose(),M.dispose();for(const e of[u,p])e.geometry.dispose(),e.material.dispose()}}}function se(n,{color:v="#9ccbea",color2:g="#86bce6",seed:w=7,dist:d=S-.6}={}){const{h:l,w:h}=Z(d,n),i=h*1.1,u=l*1.1,p=Math.min(h,l)*.085,m={pts:X(0,0,i,u,p,{ang:-.42,seed:w,loose:.35}),w:p*1.8,color:v,wob:.4,boil:.5,seed:w},a=L(m),e=D([m],{boil:.5,paint:!0}),r=D([{...m,color:W(g,.55)}],{boil:.5});e.U.uLinear.value=1,r.U.uLinear.value=1;const s=j([{kind:"box",at:[0,0],size:[i*1.05,u*1.05],color:v,color2:g,passes:Math.round(Math.hypot(i,u)/p),ang:-.42,round:0,wob:0,t0:.86,t1:.97,scribble:!1}],{paint:!0});s.mesh.renderOrder=899,e.mesh.renderOrder=900,r.mesh.renderOrder=901;for(const t of[e,s,r])t.mesh.material.depthTest=!1,t.mesh.frustumCulled=!1;const f=new O;f.add(s.mesh,e.mesh,r.mesh),f.position.z=-d;const c=[0];for(let t=1;t<a.length;t++)c.push(c[t-1]+Math.hypot(a[t][0]-a[t-1][0],a[t][1]-a[t-1][1]));const T=c[c.length-1];let b=0;return{group:f,ink:e,flat:s,streak:r,size:[i,u],dist:d,set(t){b=t,e.set(Math.min(1,t*1.05)),r.set(Math.min(1,t*1.05)),s.set(t),f.visible=t>0},opacity(t){e.U.uOpacity.value=r.U.uOpacity.value=s.U.uOpacity.value=t},head(t=new U){const R=Math.min(1,b*1.05)*T;let o=1;for(;o<c.length-1&&c[o]<R;)o++;const P=(R-c[o-1])/Math.max(1e-6,c[o]-c[o-1]);return t.set(a[o-1][0]+(a[o][0]-a[o-1][0])*P,a[o-1][1]+(a[o][1]-a[o-1][1])*P,-d)},dispose(){e.dispose(),r.dispose(),s.dispose()}}}export{re as p,se as s};
