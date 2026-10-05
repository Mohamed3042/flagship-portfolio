import{S as k,P as x,i as D,s as E,T as P,V as u,v as _,av as H,o as s,r as t}from"./EditionWorld.astro_astro_type_script_index_0_lang.BklF1JMJ.js";import{s as L,Q as M,a as T,p as U,d as V}from"./sky.Br2qEIsc.js";import{s as b}from"./streaks.DTOTx4nj.js";import{l as B,N}from"./deepfield.DZrhCWyB.js";import{NEBULA_WARP_END as Q}from"./nebula.DRuUppdo.js";import"./preload-helper.DArFJGja.js";import"./flare.D1Udt1B7.js";const W=`
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
  }`,I=o=>{const r=new k,a=new x(34,o.viewport.aspect,.1,600),n=L(o);r.add(n.mesh);const l=b(o);r.add(l.mesh);const c=new D({vertexShader:M,fragmentShader:W,transparent:!0,depthTest:!1,depthWrite:!1,blending:P,uniforms:{uC:{value:new E},uHeat:{value:0},uFlash:{value:0},uAspect:{value:1}}}),v=T(c,1500);r.add(v);const d=B(N.pitch,N.yaw,new u),m=new u,h=new u,p=new u;function f(){a.fov=o.viewport.portrait?50:34,a.updateProjectionMatrix()}f();let w=0,g=0;return{scene:r,camera:a,resize:f,update({p:e,t:C,dt:A}){const y=U(o,C,A),S=s.inOut(t(.15,1,e))*.35;m.set(0,0,0),h.copy(d),_(a,m,h,y.x,y.y),a.rotateZ(S),a.updateMatrixWorld();const F=H(Q,1,s.inOut(t(0,.62,e)));n.warp(F,d),n.uniforms.uSplit.value=1,w+=(e-g)*900+A*30*F,g=e,l.set(a,w,H(2,34,s.in(t(.05,.75,e))),s.out(t(.02,.3,e))*(1-t(.92,1,e)*.5)),V(a,d,p);const i=c.uniforms;i.uC.value.set(p.x,p.y),i.uAspect.value=o.viewport.aspect,i.uHeat.value=s.in(t(.3,.95,e)),i.uFlash.value=s.out(t(.9,1,e))},dispose(){n.dispose(),l.dispose(),c.dispose(),v.geometry.dispose()}}};export{I as default};
