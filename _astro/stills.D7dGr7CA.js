import{aM as W,s as k,a6 as I,o as T,r as b}from"./EditionWorld.astro_astro_type_script_index_0_lang.2KBVOvcs.js";import{f as D,s as E,c,G as L,l as s,a as B,C as a,j as K,g as $,p as z,t as C,w as A,m as G,n as _}from"./plan.D9_ScDHK.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const q=6,U=async w=>{await D();const y=w.lang==="ar";let m=new W,d=new W;const l=E(`
    uniform sampler2D tFrames, tWords;
    uniform vec2 uPage, uWord;         // the page's and the word's size, px of the view
    uniform float uSlit, uSheet, uMode, uWordMix, uWordSheet, uWordShow, uSheetOn, uCellPx;
    uniform vec3 cInk, cBone, cRind, cEmber, cPumpkin, cPlum, cStem, cSheet;
    varying vec2 vUv;
    ${L}
    void main(){
      vec2 q = (gl_FragCoord.xy - uRes * .5) / uDpr;    // px of the view from the middle, y up
      float slit = uSlit;
      vec3 c = cPlum;
      if (uMode < .5) {
        // the page: six frames interleaved column by column
        vec2 pq = q / uPage + .5;                       // 0..1 over the page
        float inPage = step(0., pq.x) * step(pq.x, 1.) * step(0., pq.y) * step(pq.y, 1.);
        float colx = floor((q.x + uPage.x * .5) / slit);
        float f = mod(colx, ${q}.);
        vec2 tile = vec2(mod(f, 3.), 1. - floor(f / 3.));   // the frames sit 3 × 2 in the atlas, the first row on top
        vec3 page = texture2D(tFrames, (tile + clamp(pq, .001, .999)) / vec2(3., 2.)).rgb;
        c = mix(cPlum, page, inPage);
        // the sheet: black, a clear slit every six columns, sliding with the scroll; it comes in from the right
        float x = q.x + uPage.x * .5 - uSheet;          // across the sheet
        float clear = step(mod(x, slit * ${q}.), slit);
        float onSheet = step(uSheetOn, q.x);            // the sheet's left edge
        c = mix(c, cSheet, onSheet * (1. - clear) * .97);
        // the sheet's edge: a hairline of light
        c = mix(c, cBone, onSheet * (1. - step(2., q.x - uSheetOn)) * .6);
      } else if (uMode < 1.5) {
        // a field of pumpkins: discs of rings in four steps of brightness; neighbours turn the other way
        vec2 g = q / uCellPx, id = floor(g + .5), f = g - id;
        float r = length(f) * 2.;
        float dir = mod(id.x + id.y, 2.) * 2. - 1.;
        float a = atan(f.y, f.x) / 6.2831853;
        float ring = floor(r * 5.);
        float t = fract(a * (10. + ring * 4.) * dir + ring * .37 + id.x * .13);
        vec3 c4 = t < .25 ? cInk : t < .5 ? cRind : t < .75 ? cBone : cEmber;
        float disc = aa(r - .86);
        c = mix(cPlum, c4, disc);
        c = mix(c, cInk, aa(abs(r - .88) - .025));                       // the rim
        vec2 sq = f - vec2(.03 * dir, .48);                               // the stem
        c = mix(c, cStem, aa(max(abs(sq.x) - .045, abs(sq.y) - .06)));
      } else {
        // the lenticular word: TRICK and TREAT interleaved, a sheet with a slit every two columns
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
        // when the sheet lifts, the word left is TREAT, whole
        c = mix(c, mix(cInk, wB.rgb, wB.a * inBox), uWordMix);
      }
      gl_FragColor = vec4(c, 1.);
    }`,{tFrames:{value:m},tWords:{value:d},uPage:{value:new k(800,600)},uWord:{value:new k(800,260)},uSlit:{value:3},uSheet:{value:0},uMode:{value:0},uWordMix:{value:0},uWordSheet:{value:0},uWordShow:{value:1},uSheetOn:{value:1e4},uCellPx:{value:220},cInk:{value:c(a.ink)},cBone:{value:c(a.bone)},cRind:{value:c(a.rind)},cEmber:{value:c(a.ember)},cPumpkin:{value:c(a.pumpkin)},cPlum:{value:c("#1c1029")},cStem:{value:c(a.stem)},cSheet:{value:c("#07050a")}});function P(t){const r=t.portrait,x=r?Math.min(t.width*.9,t.height*.6*.75):Math.min(t.width*.78,t.height*.7*4/3),S=r?x/.75:x*.75;l.u.uPage.value.set(x,S);const i=r?600:800,o=r?800:600,M=B(i*3,o*2);for(let u=0;u<q;u++){const e=M.g,n=u%3*i,R=Math.floor(u/3)*o,g=u/q*Math.PI*2;e.save(),e.translate(0,R),e.beginPath(),e.rect(n,0,i,o),e.clip(),e.fillStyle=a.bone,e.fillRect(n,0,i,o),e.fillStyle=a.pumpkin,e.beginPath(),e.arc(n+i*.74,o*.26,Math.min(i,o)*.15,0,Math.PI*2),e.fill(),e.fillStyle=a.ink,e.beginPath(),e.moveTo(n,o),e.lineTo(n,o*.84),e.quadraticCurveTo(n+i*.5,o*.7,n+i,o*.86),e.lineTo(n+i,o),e.fill();for(let h=0;h<3;h++){const O=n+i*(.2+h*.27),F=o*(.3+.1*Math.sin(h*2.1)+.025*Math.sin(g+h));K(e,O,F,Math.min(i,o)*(.11-h*.015),a.ink,(1-Math.cos(g+h*2))/2,a.ember)}$(e,n+i*.26,o*(.66+.03*Math.sin(g)),Math.min(i,o)*.12,a.ink,a.bone,Math.sin(g),.7+.3*Math.sin(g*2)),z(e,n+i*.7,o*.8,Math.min(i,o)*.09,{body:a.pumpkin,rind:a.rind,stem:a.stem,face:u%2?a.ember:a.ink}),e.restore()}m.dispose(),m=C(M.c,{mips:!0}),l.u.tFrames.value=m;const{w:p,h:f}=A(t);l.u.uWord.value.set(p,f);const v=B(1600,Math.round(800*f/p));G[y?"ar":"en"].forEach((u,e)=>_(v.g,u,e*800,0,800,v.c.height,e?a.pumpkin:a.bone,y,.9)),d.dispose(),d=C(v.c,{mips:!0}),l.u.tWords.value=d,l.u.uSlit.value=Math.max(3,Math.round(Math.min(t.width,t.height)/150)),l.u.uCellPx.value=Math.max(150,Math.min(t.width,t.height)*.3)}return P(w.viewport),l.fit(w.viewport),{scene:l.scene,camera:l.camera,get light(){return!1},resize(t){l.fit(t),P(t)},update({p:t}){const r=l.u,x=w.viewport,S=r.uSlit.value,i=r.uPage.value.x;r.uMode.value=t<s.drift[0]?0:t<s.flip[0]-.01?1:2;const o=T.out(b(s.barsIn[0],s.barsIn[1],t)),M=T.in(b(s.barsOut[0],s.barsOut[1],t)),p=-i/2-40,f=x.width/2+20;r.uSheetOn.value=f+(p-f)*o+(f-p)*M;const v=b(s.fly[0],s.fly[1],t)*112;r.uSheet.value=Math.floor(v)*S;const u=b(s.flip[0],s.flip[1]-.04,t),e=Math.min(7,Math.floor(u*8));r.uWordSheet.value=e%2?S:0,r.uWordShow.value=1-I(s.flip[1]-.04,s.flip[1],t),r.uWordMix.value=I(s.flip[1]-.04,s.flip[1],t)},dispose(){m.dispose(),d.dispose(),l.material.dispose(),l.mesh.geometry.dispose()}}};export{U as default};
