import{b1 as C,ac as D,r as O}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";import{f as T,s as w,c as f,G as I,a as b,b as G,D as k,t as P,d as A,C as d,O as s}from"./plan.DQ_XMFPW.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const B=l=>Math.max(4,Math.round(Math.min(l.width,l.height)/110)),_=async l=>{await T();const i=l.lang==="ar";let u=new C;const a=w(`
    uniform sampler2D tMask; uniform float uCell, uOff, uDrain, uDot, uDotR; uniform vec3 cInk, cPumpkin, cBone, cGrey;
    varying vec2 vUv;
    ${I}
    void main(){
      float cell = uCell * uDpr;
      vec2 cid = floor(gl_FragCoord.xy / cell);

      float inside = step(.5, texture2D(tMask, (cid + .5) * cell / uRes).r);
      float h = hash21(cid + vec2(0., inside * floor(uOff)) + inside * 811.);
      vec3 c = h < .5 ? cInk : h < .83 ? cPumpkin : cBone;

      c = mix(c, cGrey, step(hash21(cid * 1.37 + 3.1) * .999, uDrain));

      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;
      c = mix(c, cInk, aa(length(q) - uDotR) * uDot);
      gl_FragColor = vec4(c, 1.);
    }`,{tMask:{value:u},uCell:{value:6},uOff:{value:0},uDrain:{value:0},uDot:{value:0},uDotR:{value:A},cInk:{value:f(d.ink)},cPumpkin:{value:f(d.pumpkin)},cBone:{value:f(d.bone)},cGrey:{value:f(d.grey)}});function h(e){const r=Math.min(1600,Math.round(e.width*Math.min(e.dpr,1.5))),n=Math.round(r/e.aspect),{c:M,g:t}=b(r,n),c=e.portrait?i?["خدعة","أم","حلوى؟"]:["TRICK","OR","TREAT?"]:i?["خدعة أم","حلوى؟"]:["TRICK OR","TREAT?"],g=i?k.ar:k.en,v=i?900:700,m=i?1.12:.9;let o=G(t,c,r*(e.portrait?.86:.8),g,v,9999);o=Math.min(o,n*(e.portrait?.62:.66)/(c.length*m)),t.fillStyle="#000",t.fillRect(0,0,r,n),t.fillStyle="#fff",t.textAlign="center",t.textBaseline="middle",t.direction=i?"rtl":"ltr",t.font=`${v} ${o}px ${g}`;const y=n/2-(c.length-1)*o*m/2-o*(i?.06:.02);c.forEach((R,x)=>t.fillText(R,r/2,y+x*o*m)),u.dispose(),u=P(M,{srgb:!1}),a.u.tMask.value=u,a.u.uCell.value=B(e)}h(l.viewport),a.fit(l.viewport);let p=0;return{scene:a.scene,camera:a.camera,get light(){return a.u.uDrain.value>.5},resize(e){a.fit(e),h(e)},update({p:e,v:r,dt:n}){p+=n*(16+Math.min(Math.abs(r),3)*36)*(1-D(s.drain[0],s.drain[0]+.12,e)*.8),a.u.uOff.value=p,a.u.uDrain.value=D(s.drain[0],s.drain[1],e),a.u.uDot.value=O(s.drain[1]-.08,s.drain[1],e)},dispose(){u.dispose(),a.material.dispose(),a.mesh.geometry.dispose()}}};export{_ as default};
