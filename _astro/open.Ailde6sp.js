import{z as D,r as C}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{f as O,s as T,c as f,G as w,a as I,b as G,D as k,t as P,d as b,C as d,O as s}from"./plan.DVPCglD3.js";import{an as A}from"./three.module.pheUvn1h.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const B=o=>Math.max(4,Math.round(Math.min(o.width,o.height)/110)),_=async o=>{await O();const i=o.lang==="ar";let u=new A;const a=T(`
    uniform sampler2D tMask; uniform float uCell, uOff, uDrain, uDot, uDotR; uniform vec3 cInk, cPumpkin, cBone, cGrey;
    varying vec2 vUv;
    ${w}
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
    }`,{tMask:{value:u},uCell:{value:6},uOff:{value:0},uDrain:{value:0},uDot:{value:0},uDotR:{value:b},cInk:{value:f(d.ink)},cPumpkin:{value:f(d.pumpkin)},cBone:{value:f(d.bone)},cGrey:{value:f(d.grey)}});function h(e){const r=Math.min(1600,Math.round(e.width*Math.min(e.dpr,1.5))),l=Math.round(r/e.aspect),{c:M,g:t}=I(r,l),c=e.portrait?i?["خدعة","أم","حلوى؟"]:["TRICK","OR","TREAT?"]:i?["خدعة أم","حلوى؟"]:["TRICK OR","TREAT?"],g=i?k.ar:k.en,v=i?900:700,m=i?1.12:.9;let n=G(t,c,r*(e.portrait?.86:.8),g,v,9999);n=Math.min(n,l*(e.portrait?.62:.66)/(c.length*m)),t.fillStyle="#000",t.fillRect(0,0,r,l),t.fillStyle="#fff",t.textAlign="center",t.textBaseline="middle",t.direction=i?"rtl":"ltr",t.font=`${v} ${n}px ${g}`;const y=l/2-(c.length-1)*n*m/2-n*(i?.06:.02);c.forEach((R,x)=>t.fillText(R,r/2,y+x*n*m)),u.dispose(),u=P(M,{srgb:!1}),a.u.tMask.value=u,a.u.uCell.value=B(e)}h(o.viewport),a.fit(o.viewport);let p=0;return{scene:a.scene,camera:a.camera,get light(){return a.u.uDrain.value>.5},resize(e){a.fit(e),h(e)},update({p:e,v:r,dt:l}){p+=l*(16+Math.min(Math.abs(r),3)*36)*(1-D(s.drain[0],s.drain[0]+.12,e)*.8),a.u.uOff.value=p,a.u.uDrain.value=D(s.drain[0],s.drain[1],e),a.u.uDot.value=C(s.drain[1]-.08,s.drain[1],e)},dispose(){u.dispose(),a.material.dispose(),a.mesh.geometry.dispose()}}};export{_ as default};
