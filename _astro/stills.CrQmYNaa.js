import{z as k,e as y,r as q}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{f as R,s as E,c as n,G as L,l,a as I,C as a,j as $,g as z,p as G,t as B,w as K,m as _,n as j}from"./plan.DVPCglD3.js";import{an as C,k as O}from"./three.module.pheUvn1h.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const b=6,Q=async w=>{await R();const P=w.lang==="ar";let d=new C,h=new C;const r=E(`
    uniform sampler2D tFrames, tWords;
    uniform vec2 uPage, uWord;
    uniform float uSlit, uSheet, uMode, uWordMix, uWordSheet, uWordShow, uSheetOn, uCellPx;
    uniform vec3 cInk, cBone, cRind, cEmber, cPumpkin, cPlum, cStem, cSheet;
    varying vec2 vUv;
    ${L}
    void main(){
      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;
      float slit = uSlit;
      vec3 c = cPlum;
      if (uMode < .5) {

        vec2 pq = q / uPage + .5;
        float inPage = step(0., pq.x) * step(pq.x, 1.) * step(0., pq.y) * step(pq.y, 1.);
        float colx = floor((q.x + uPage.x * .5) / slit);
        float f = mod(colx, ${b}.);
        vec2 tile = vec2(mod(f, 3.), 1. - floor(f / 3.));
        vec3 page = texture2D(tFrames, (tile + clamp(pq, .001, .999)) / vec2(3., 2.)).rgb;
        c = mix(cPlum, page, inPage);

        float x = q.x + uPage.x * .5 - uSheet;
        float clear = step(mod(x, slit * ${b}.), slit);
        float onSheet = step(uSheetOn, q.x);
        c = mix(c, cSheet, onSheet * (1. - clear) * .97);

        c = mix(c, cBone, onSheet * (1. - step(2., q.x - uSheetOn)) * .6);
      } else if (uMode < 1.5) {

        vec2 g = q / uCellPx, id = floor(g + .5), f = g - id;
        float r = length(f) * 2.;
        float dir = mod(id.x + id.y, 2.) * 2. - 1.;
        float a = atan(f.y, f.x) / 6.2831853;
        float ring = floor(r * 5.);
        float t = fract(a * (10. + ring * 4.) * dir + ring * .37 + id.x * .13);
        vec3 c4 = t < .25 ? cInk : t < .5 ? cRind : t < .75 ? cBone : cEmber;
        float disc = aa(r - .86);
        c = mix(cPlum, c4, disc);
        c = mix(c, cInk, aa(abs(r - .88) - .025));
        vec2 sq = f - vec2(.03 * dir, .48);
        c = mix(c, cStem, aa(max(abs(sq.x) - .045, abs(sq.y) - .06)));
      } else {

        vec2 wq = q / uWord + .5;
        float inBox = step(0., wq.x) * step(wq.x, 1.) * step(0., wq.y) * step(wq.y, 1.);
        float colx = floor((q.x + uWord.x * .5) / slit);
        float f = mod(colx, 2.);
        vec4 w = texture2D(tWords, vec2((f + wq.x) / 2., wq.y));
        vec4 wB = texture2D(tWords, vec2((1. + wq.x) / 2., wq.y));
        c = cInk;
        c = mix(c, w.rgb, w.a * inBox);
        float x = q.x + uWord.x * .5 - uWordSheet;
        float clear = step(mod(x, slit * 2.), slit);
        c = mix(c, cInk, (1. - clear) * .9 * uWordShow);

        c = mix(c, mix(cInk, wB.rgb, wB.a * inBox), uWordMix);
      }
      gl_FragColor = vec4(c, 1.);
    }`,{tFrames:{value:d},tWords:{value:h},uPage:{value:new O(800,600)},uWord:{value:new O(800,260)},uSlit:{value:3},uSheet:{value:0},uMode:{value:0},uWordMix:{value:0},uWordSheet:{value:0},uWordShow:{value:1},uSheetOn:{value:1e4},uCellPx:{value:220},cInk:{value:n(a.ink)},cBone:{value:n(a.bone)},cRind:{value:n(a.rind)},cEmber:{value:n(a.ember)},cPumpkin:{value:n(a.pumpkin)},cPlum:{value:n("#1c1029")},cStem:{value:n(a.stem)},cSheet:{value:n("#07050a")}});function W(t){const s=t.portrait,x=s?Math.min(t.width*.9,t.height*.6*.75):Math.min(t.width*.78,t.height*.7*4/3),S=s?x/.75:x*.75;r.u.uPage.value.set(x,S);const i=s?600:800,o=s?800:600,M=I(i*3,o*2);for(let c=0;c<b;c++){const e=M.g,u=c%3*i,T=Math.floor(c/3)*o,g=c/b*Math.PI*2;e.save(),e.translate(0,T),e.beginPath(),e.rect(u,0,i,o),e.clip(),e.fillStyle=a.bone,e.fillRect(u,0,i,o),e.fillStyle=a.pumpkin,e.beginPath(),e.arc(u+i*.74,o*.26,Math.min(i,o)*.15,0,Math.PI*2),e.fill(),e.fillStyle=a.ink,e.beginPath(),e.moveTo(u,o),e.lineTo(u,o*.84),e.quadraticCurveTo(u+i*.5,o*.7,u+i,o*.86),e.lineTo(u+i,o),e.fill();for(let m=0;m<3;m++){const F=u+i*(.2+m*.27),D=o*(.3+.1*Math.sin(m*2.1)+.025*Math.sin(g+m));$(e,F,D,Math.min(i,o)*(.11-m*.015),a.ink,(1-Math.cos(g+m*2))/2,a.ember)}z(e,u+i*.26,o*(.66+.03*Math.sin(g)),Math.min(i,o)*.12,a.ink,a.bone,Math.sin(g),.7+.3*Math.sin(g*2)),G(e,u+i*.7,o*.8,Math.min(i,o)*.09,{body:a.pumpkin,rind:a.rind,stem:a.stem,face:c%2?a.ember:a.ink}),e.restore()}d.dispose(),d=B(M.c,{mips:!0}),r.u.tFrames.value=d;const{w:p,h:f}=K(t);r.u.uWord.value.set(p,f);const v=I(1600,Math.round(800*f/p));_[P?"ar":"en"].forEach((c,e)=>j(v.g,c,e*800,0,800,v.c.height,e?a.pumpkin:a.bone,P,.9)),h.dispose(),h=B(v.c,{mips:!0}),r.u.tWords.value=h,r.u.uSlit.value=Math.max(3,Math.round(Math.min(t.width,t.height)/150)),r.u.uCellPx.value=Math.max(150,Math.min(t.width,t.height)*.3)}return W(w.viewport),r.fit(w.viewport),{scene:r.scene,camera:r.camera,get light(){return!1},resize(t){r.fit(t),W(t)},update({p:t}){const s=r.u,x=w.viewport,S=s.uSlit.value,i=s.uPage.value.x;s.uMode.value=t<l.drift[0]?0:t<l.flip[0]-.01?1:2;const o=y.out(q(l.barsIn[0],l.barsIn[1],t)),M=y.in(q(l.barsOut[0],l.barsOut[1],t)),p=-i/2-40,f=x.width/2+20;s.uSheetOn.value=f+(p-f)*o+(f-p)*M;const v=q(l.fly[0],l.fly[1],t)*112;s.uSheet.value=Math.floor(v)*S;const c=q(l.flip[0],l.flip[1]-.04,t),e=Math.min(7,Math.floor(c*8));s.uWordSheet.value=e%2?S:0,s.uWordShow.value=1-k(l.flip[1]-.04,l.flip[1],t),s.uWordMix.value=k(l.flip[1]-.04,l.flip[1],t)},dispose(){d.dispose(),h.dispose(),r.material.dispose(),r.mesh.geometry.dispose()}}};export{Q as default};
