import{aM as f,s as d,aL as p,r as v,o as h}from"./EditionWorld.astro_astro_type_script_index_0_lang.2KBVOvcs.js";import{f as x,s as R,c as w,G as q,w as W,a as y,n as k,m as D,t as S,C as g,o as u}from"./plan.D9_ScDHK.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const I=async o=>{await x();const n=o.lang==="ar";let s=new f;const e=R(`
    uniform sampler2D tWord; uniform vec2 uWord, uAt; uniform float uScale, uRings; uniform vec3 cInk, cPlum;
    varying vec2 vUv;
    ${q}
    void main(){
      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;
      float r = length(q - vec2(0., -uRes.y / uDpr * .08)) / (min(uRes.x, uRes.y) / uDpr);
      vec3 c = mix(cInk, cPlum, step(.5, fract(r * 9. - uTime * .02)) * smoothstep(1.2, .2, r) * .55 * uRings);
      vec2 wq = (q - uAt) / (uWord * uScale) + .5;
      vec4 w = texture2D(tWord, clamp(wq, 0., 1.)) * step(0., wq.x) * step(wq.x, 1.) * step(0., wq.y) * step(wq.y, 1.);
      c = mix(c, w.rgb, w.a);
      gl_FragColor = vec4(c, 1.);
    }`,{tWord:{value:s},uWord:{value:new d(800,260)},uAt:{value:new d},uScale:{value:1},uRings:{value:0},cInk:{value:w(g.ink)},cPlum:{value:w("#241338")}});let l=0,i=.4;function m(a){const{w:r,h:t}=W(a);e.u.uWord.value.set(r,t);const c=y(800,Math.round(800*t/r));k(c.g,D[n?"ar":"en"][1],0,0,800,c.c.height,g.pumpkin,n,.9),s.dispose(),s=S(c.c,{mips:!0}),e.u.tWord.value=s,i=Math.min(.42,(a.portrait?64:92)/t),l=a.height/2-(a.portrait?92:104)-t*i/2}return m(o.viewport),e.fit(o.viewport),{scene:e.scene,camera:e.camera,resize(a){e.fit(a),m(a)},update({p:a,t:r}){const t=h.inOut(v(u.word[0]+.02,u.word[1],a));e.u.uAt.value.set(0,p(0,l,t)),e.u.uScale.value=p(1,i,t),e.u.uRings.value=v(u.word[0]+.05,u.word[1]+.1,a),e.u.uTime.value=r},dispose(){s.dispose(),e.material.dispose(),e.mesh.geometry.dispose()}}};export{I as default};
