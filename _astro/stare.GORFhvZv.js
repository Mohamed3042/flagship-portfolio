import{r as s}from"./EditionWorld.astro_astro_type_script_index_0_lang.C5-V8Ssb.js";import{a as g,p as L,h as G,t as x,s as C,c as o,G as T,T as f,P as u,S as r,d as F,C as n,e as $,W as B}from"./plan.B1DGxLcp.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const E={body:"#008be8",rind:"#2badf5",stem:"#a570d1",face:"#003cb2"},_=p=>{const R=g(1024,1024),v=g(1024,1024),b=g(1024,1024),h=400;L(R.g,512,512,h,E),v.g.fillStyle="#000",v.g.fillRect(0,0,1024,1024),L(v.g,512,512,h,{body:"#000",rind:"#000",stem:"#000",face:"#000",line:"#fff",lw:3.5}),G(b.g,512,512,470,"#fff",4);const y=x(R.c,{mips:!0}),S=x(v.c,{srgb:!1,mips:!0}),w=x(b.c,{srgb:!1,mips:!0}),t=C(`
    uniform sampler2D tPumpkin, tOutline, tHouse;
    uniform float uMode, uShow, uReveal, uOutline, uAfter, uRing, uSpin, uStep, uWisp, uHalf, uHouseHalf, uDotR;
    uniform vec3 cGrey, cPaper, cInk, cLilac, cBone, cPumpkin, cLine;
    varying vec2 vUv;
    ${T}
    float inBox(vec2 uv){ return step(abs(uv.x - .5), .5) * step(abs(uv.y - .5), .5); }
    // the op-art wipe every picture comes in by: vertical bars that widen
    float bars(vec2 q, float k){ return step(fract(q.x / 16.), k); }
    void main(){
      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;   // px of the view from the middle, y up
      float minD = min(uRes.x, uRes.y) / uDpr;
      vec3 c = cGrey;
      float mark = 0.;   // 1: the dot, 2: the +
      if (uMode < .5) {
        vec2 uv = q / uHalf * .5 + .5;
        vec4 pk = texture2D(tPumpkin, uv) * inBox(uv);
        c = mix(c, pk.rgb, pk.a * bars(q, uShow));
        c = mix(c, mix(cPaper, cGrey, uAfter), uReveal);
        c = mix(c, cLine, texture2D(tOutline, uv).r * inBox(uv) * uOutline * uReveal);
        mark = 1.;
      } else if (uMode < 1.5) {
        float R = minD * .24, r = minD * .042, sum = 0.;
        float gone = mod(floor(uStep), 12.);
        for (int i = 0; i < 12; i++) {
          float a = float(i) / 12. * 6.2831853;
          vec2 d = q - vec2(sin(a), cos(a)) * R;
          sum += exp(-dot(d, d) / (r * r)) * (1. - step(abs(float(i) - gone), .5));
        }
        c = mix(c, cLilac, clamp(sum, 0., 1.) * uWisp);
        mark = 2.;
      } else {
        float rr = max(length(q), 1.), a = atan(q.y, q.x);
        float s = a / 6.2831853 * 4. - log(rr) * 1.7 + uSpin;
        vec3 sp = mix(cPumpkin, cInk, aa(abs(fract(s) - .5) - .25));   // half ink, half pumpkin
        c = mix(c, sp, bars(q, uShow) * (1. - uReveal));
        vec2 uv = q / uHouseHalf * .5 + .5;
        float ink = texture2D(tHouse, uv).a * inBox(uv);
        c = mix(c, mix(cBone, cInk, ink), uReveal);
        mark = 1.;
      }
      // the mark to hold your eyes on: the dot, or a + for the wisps
      float lr = length(q);
      if (mark < 1.5) c = mix(c, cInk, aa(lr - uDotR));
      else c = mix(c, cInk, aa(min(max(abs(q.x) - 9., abs(q.y) - 1.2), max(abs(q.y) - 9., abs(q.x) - 1.2))));
      // the ring that counts the stare (clockwise from the top), on its faint track
      if (uRing >= 0.) {
        float ring = aa(abs(lr - 19.) - 1.3);
        float ang = fract(atan(q.x, q.y) / 6.2831853 + 1.);
        c = mix(c, cInk, ring * (.14 + .5 * step(ang, uRing)));
      }
      gl_FragColor = vec4(c, 1.);
    }`,{tPumpkin:{value:y},tOutline:{value:S},tHouse:{value:w},uMode:{value:0},uShow:{value:0},uReveal:{value:0},uOutline:{value:0},uAfter:{value:0},uRing:{value:-1},uSpin:{value:0},uStep:{value:0},uWisp:{value:0},uHalf:{value:300},uHouseHalf:{value:300},uDotR:{value:F},cGrey:{value:o(n.grey)},cPaper:{value:o(n.paper)},cInk:{value:o(n.ink)},cLilac:{value:o(n.lilac)},cBone:{value:o(n.bone)},cPumpkin:{value:o(n.pumpkin)},cLine:{value:o("#706b63")}});function q(l){t.fit(l);const c=Math.min(l.width,l.height);t.u.uHalf.value=c*(l.portrait?.44:.33)*512/h,t.u.uHouseHalf.value=c*(l.portrait?.47:.37)*512/470}q(p.viewport);const M=f.map(()=>$());let H=0,d="",D=0,k=-1;return{scene:t.scene,camera:t.camera,get light(){return!(H===2&&t.u.uReveal.value<.5&&t.u.uShow.value>.5)},resize:q,update({p:l,t:c,dt:P}){let i=f.findIndex(m=>l<m.to);i<0&&(i=f.length-1);const W=k<0||c-k>.5;k=c;let a=0;M.forEach((m,O)=>{W&&m(!1,0);const A=m(O===i,P);O===i&&(a=A)}),H=i;const e=t.u;e.uMode.value=i,e.uRing.value=-1,e.uReveal.value=0,e.uOutline.value=0,e.uAfter.value=0,e.uWisp.value=0,i===0?(e.uShow.value=s(u.show[0],u.show[1],a),a>=u.stare[0]&&a<u.reveal&&(e.uRing.value=s(u.stare[0],u.stare[1],a)),a>=u.reveal&&(e.uReveal.value=1,e.uOutline.value=1-s(u.after-1.2,u.after,a),e.uAfter.value=s(u.after,u.after+1.6,a))):i===1?(e.uWisp.value=s(B.show[0],B.show[1],a),e.uStep.value=a*9):(e.uShow.value=s(r.show[0],r.show[1],a),a<r.reveal?(D+=P*.55,a>=r.stare[0]&&(e.uRing.value=s(r.stare[0],r.stare[1],a))):e.uReveal.value=1,e.uSpin.value=D);const I=`${f[i].id}:${a.toFixed(1)}`;I!==d&&(d=I,p.emit("tt-trick",{id:f[i].id,t:a}))},focus(l){l||(d="",p.emit("tt-trick",null))},dispose(){y.dispose(),S.dispose(),w.dispose(),t.material.dispose(),t.mesh.geometry.dispose()}}};export{_ as default};
