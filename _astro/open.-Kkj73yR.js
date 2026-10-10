import{aM as x,a6 as D,r as C}from"./EditionWorld.astro_astro_type_script_index_0_lang.BRlO4Qlr.js";import{f as O,s as T,c as d,G as I,a as G,b as P,D as k,t as b,d as A,C as f,O as s}from"./plan.BiNIbF_D.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const B=r=>Math.max(4,Math.round(Math.min(r.width,r.height)/110)),F=async r=>{await O();const i=r.lang==="ar";let u=new x;const t=T(`
    uniform sampler2D tMask; uniform float uCell, uOff, uDrain, uDot, uDotR; uniform vec3 cInk, cPumpkin, cBone, cGrey;
    varying vec2 vUv;
    ${I}
    void main(){
      float cell = uCell * uDpr;
      vec2 cid = floor(gl_FragCoord.xy / cell);
      // inside or outside the words, decided once per cell (a split cell would draw the letters' edge in a still)
      float inside = step(.5, texture2D(tMask, (cid + .5) * cell / uRes).r);
      float h = hash21(cid + vec2(0., inside * floor(uOff)) + inside * 811.);
      vec3 c = h < .5 ? cInk : h < .83 ? cPumpkin : cBone;
      // the drain: each cell turns grey at its own moment
      c = mix(c, cGrey, step(hash21(cid * 1.37 + 3.1) * .999, uDrain));
      // the dot the first trick keeps
      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;
      c = mix(c, cInk, aa(length(q) - uDotR) * uDot);
      gl_FragColor = vec4(c, 1.);
    }`,{tMask:{value:u},uCell:{value:6},uOff:{value:0},uDrain:{value:0},uDot:{value:0},uDotR:{value:A},cInk:{value:d(f.ink)},cPumpkin:{value:d(f.pumpkin)},cBone:{value:d(f.bone)},cGrey:{value:d(f.grey)}});function m(e){const l=Math.min(1600,Math.round(e.width*Math.min(e.dpr,1.5))),n=Math.round(l/e.aspect),{c:M,g:a}=G(l,n),c=e.portrait?i?["خدعة","أم","حلوى؟"]:["TRICK","OR","TREAT?"]:i?["خدعة أم","حلوى؟"]:["TRICK OR","TREAT?"],p=i?k.ar:k.en,v=i?900:700,h=i?1.12:.9;let o=P(a,c,l*(e.portrait?.86:.8),p,v,9999);o=Math.min(o,n*(e.portrait?.62:.66)/(c.length*h)),a.fillStyle="#000",a.fillRect(0,0,l,n),a.fillStyle="#fff",a.textAlign="center",a.textBaseline="middle",a.direction=i?"rtl":"ltr",a.font=`${v} ${o}px ${p}`;const y=n/2-(c.length-1)*o*h/2-o*(i?.06:.02);c.forEach((w,R)=>a.fillText(w,l/2,y+R*o*h)),u.dispose(),u=b(M,{srgb:!1}),t.u.tMask.value=u,t.u.uCell.value=B(e)}m(r.viewport),t.fit(r.viewport);let g=0;return{scene:t.scene,camera:t.camera,get light(){return t.u.uDrain.value>.5},resize(e){t.fit(e),m(e)},update({p:e,v:l,dt:n}){g+=n*(16+Math.min(Math.abs(l),3)*36)*(1-D(s.drain[0],s.drain[0]+.12,e)*.8),t.u.uOff.value=g,t.u.uDrain.value=D(s.drain[0],s.drain[1],e),t.u.uDot.value=C(s.drain[1]-.08,s.drain[1],e)},dispose(){u.dispose(),t.material.dispose(),t.mesh.geometry.dispose()}}};export{F as default};
