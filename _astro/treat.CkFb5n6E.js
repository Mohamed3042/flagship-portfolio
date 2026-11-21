import{R as p,r as d,e as f}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{f as h,s as x,c as v,G as R,w as q,a as W,n as y,m as k,t as D,C as w,o as u}from"./plan.DVPCglD3.js";import{an as S,k as g}from"./three.module.pheUvn1h.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const G=async o=>{await h();const c=o.lang==="ar";let r=new S;const e=x(`
    uniform sampler2D tWord; uniform vec2 uWord, uAt; uniform float uScale, uRings; uniform vec3 cInk, cPlum;
    varying vec2 vUv;
    ${R}
    void main(){
      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;
      float r = length(q - vec2(0., -uRes.y / uDpr * .08)) / (min(uRes.x, uRes.y) / uDpr);
      vec3 c = mix(cInk, cPlum, step(.5, fract(r * 9. - uTime * .02)) * smoothstep(1.2, .2, r) * .55 * uRings);
      vec2 wq = (q - uAt) / (uWord * uScale) + .5;
      vec4 w = texture2D(tWord, clamp(wq, 0., 1.)) * step(0., wq.x) * step(wq.x, 1.) * step(0., wq.y) * step(wq.y, 1.);
      c = mix(c, w.rgb, w.a);
      gl_FragColor = vec4(c, 1.);
    }`,{tWord:{value:r},uWord:{value:new g(800,260)},uAt:{value:new g},uScale:{value:1},uRings:{value:0},cInk:{value:v(w.ink)},cPlum:{value:v("#241338")}});let l=0,i=.4;function m(a){const{w:s,h:t}=q(a);e.u.uWord.value.set(s,t);const n=W(800,Math.round(800*t/s));y(n.g,k[c?"ar":"en"][1],0,0,800,n.c.height,w.pumpkin,c,.9),r.dispose(),r=D(n.c,{mips:!0}),e.u.tWord.value=r,i=Math.min(.42,(a.portrait?64:92)/t),l=a.height/2-(a.portrait?92:104)-t*i/2}return m(o.viewport),e.fit(o.viewport),{scene:e.scene,camera:e.camera,resize(a){e.fit(a),m(a)},update({p:a,t:s}){const t=f.inOut(d(u.word[0]+.02,u.word[1],a));e.u.uAt.value.set(0,p(0,l,t)),e.u.uScale.value=p(1,i,t),e.u.uRings.value=d(u.word[0]+.05,u.word[1]+.1,a),e.u.uTime.value=s},dispose(){r.dispose(),e.material.dispose(),e.mesh.geometry.dispose()}}};export{G as default};
