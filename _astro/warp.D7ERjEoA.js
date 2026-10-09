import{S as k,P as x,i as D,s as E,a5 as L,V as u,J as P,aL as H,o as s,r as t}from"./EditionWorld.astro_astro_type_script_index_0_lang.P9odppCQ.js";import{s as _,Q as M,a as U,p as V,d as b}from"./sky.BvPulkZv.js";import{s as B}from"./streaks.DmW6gjW2.js";import{l as Q,N}from"./deepfield.Bvcl5OsQ.js";import{NEBULA_WARP_END as T}from"./nebula.DaWa77pl.js";import"./preload-helper.4QTdcD_W.js";import"./flare.BAZdTuYg.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const W=`
  uniform vec2 uC; uniform float uHeat, uFlash, uAspect; varying vec2 vNdc;
  void main(){
    vec2 d = (vNdc - uC) * vec2(uAspect, 1.); float r = length(d);
    // the point ahead: a white-hot core in a blue-white bloom, a faint ring of the stretch's colours round it
    vec3 col = vec3(1.) * exp(-r * r * 900.) * 5. * uHeat + vec3(.75, .85, 1.) * (exp(-r * 9.) * .5 + exp(-r * 3.) * .08) * uHeat
             + vec3(1., .45, .3) * exp(-pow((r - .16 * uHeat) * 14., 2.)) * .08 * uHeat;
    // the flood: out from the point ahead, fast, to white
    float k = smoothstep(uFlash * 2.9, uFlash * 2.9 - .35, r);
    col += vec3(2.4, 2.35, 2.3) * k * uFlash;
    gl_FragColor = vec4(col, 1.);
  }`,G=o=>{const r=new k,a=new x(34,o.viewport.aspect,.1,600),n=_(o);r.add(n.mesh);const l=B(o);r.add(l.mesh);const c=new D({vertexShader:M,fragmentShader:W,transparent:!0,depthTest:!1,depthWrite:!1,blending:L,uniforms:{uC:{value:new E},uHeat:{value:0},uFlash:{value:0},uAspect:{value:1}}}),m=U(c,1500);r.add(m);const d=Q(N.pitch,N.yaw,new u),v=new u,h=new u,p=new u;function f(){a.fov=o.viewport.portrait?50:34,a.updateProjectionMatrix()}f();let w=0,g=0;return{scene:r,camera:a,resize:f,update({p:e,t:C,dt:A}){const y=V(o,C,A),S=s.inOut(t(.15,1,e))*.35;v.set(0,0,0),h.copy(d),P(a,v,h,y.x,y.y),a.rotateZ(S),a.updateMatrixWorld();const F=H(T,1,s.inOut(t(0,.62,e)));n.warp(F,d),n.uniforms.uSplit.value=1,w+=(e-g)*900+A*30*F,g=e,l.set(a,w,H(2,34,s.in(t(.05,.75,e))),s.out(t(.02,.3,e))*(1-t(.92,1,e)*.5)),b(a,d,p);const i=c.uniforms;i.uC.value.set(p.x,p.y),i.uAspect.value=o.viewport.aspect,i.uHeat.value=s.in(t(.3,.95,e)),i.uFlash.value=s.out(t(.9,1,e))},dispose(){n.dispose(),l.dispose(),c.dispose(),m.geometry.dispose()}}};export{G as default};
