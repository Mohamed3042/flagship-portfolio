import{K as E,N as L,Y as j,v as R,k as z,V as U,M as Y,a as X,b as q,Z as I,_ as K}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Z=`
  varying vec2 vN;
  void main(){ vN = position.xy; gl_Position = vec4(position.xy, .99999, 1.); }`,J=`
  uniform sampler2D uType;
  uniform float uAsp, uBend, uHor, uTime, uLevel, uMix, uShift, uParX, uIntro, uNameGo, uSmallGo, uRoleGo, uNameOn, uLit, uCellN, uBare;
  uniform vec3 uTint, uTintB, uTint2, uTint2B;
  uniform sampler2D uStrip; uniform vec4 uNR; uniform float uNMode; uniform vec3 uMkC; uniform float uNameL; uniform float uWash;
  uniform float uWdSide;
  uniform float uWdMkDim;
  uniform float uTagL;
  uniform vec2 uWdEdge;
  uniform float uFineOff;
  uniform float uWdTk;
  uniform float uWdAO, uWdFx;
  ${I}
  varying vec2 vN;
  float nameAt(vec2 tuv, float r){ if (uNMode < .5) return r; float y = (tuv.y - uNR.x) / uNR.y; if (y <= 0. || y >= 1.) return 0.; return texture2D(uStrip, vec2(tuv.x * uNR.z + uNR.w, y)).r; }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  float aline(float x, float w){ float d = abs(fract(x - .5) - .5) / max(fwidth(x), 1e-5); return 1. - smoothstep(w * .5, w * .5 + 1., d); }
  void main(){
    vec2 n = vN;

    float tx = uBend, ty = uBend / uAsp;
    float rx = n.x * tx + uParX, ry = (n.y - uHor) * ty;
    float u = atan(rx), v = ry / sqrt(1. + rx * rx);
    float U = u / atan(tx);
    float V = v / ty + uHor - uShift;

    float cell = 2. * atan(tx) / uCellN;
    vec2 wc = vec2(u, v - uShift * ty) / cell;
    vec2 pc = wc / 6., pid = floor(pc);

    float th = hash(pid + 11.) * .8;

    if (uWash > 0.) th = clamp(.62 * (U * .5 + .5) + .38 * hash(pid + 11.), 0., 1.) * .8;
    float w = step(th, uMix * 1.25 - .05 * hash(floor(wc) + 3.));
    vec3 tint = mix(uTint, uTintB, w), tint2 = mix(uTint2, uTint2B, w);

    float beat = uTime / (.35 + .55 * hash(pid + 5.))     + hash(pid + 1.) * 9.;
    float k0 = hash(pid + floor(beat) * 1.7), k1 = hash(pid + (floor(beat) - 1.) * 1.7), e = smoothstep(0., .12, fract(beat));
    float lit = mix(step(.9, k1) * (.35 + .65 * fract(k1 * 13.1)), step(.9, k0) * (.35 + .65 * fract(k0 * 13.1)), e) * uLit;

    float pb = uTime * 3.2 + hash(pid + 31.) * 7., pk = hash(pid + floor(pb) * 2.9);
    float pulse = step(.92, pk) * pow(1. - fract(pb), 3.) * uLit;
    float glint = step(.9, hash(pid + floor(uTime * 5. + hash(pid + 17.) * 5.) * 3.7)) * uLit;
    vec2 ci = floor(wc);
    float cellOn = (.12 + .88 * hash(pid * 1.3 + floor(uTime * 2.3 + hash(pid + 7.) * 4.))) * (.7 + .3 * hash(ci + floor(uTime * 2.3 + hash(ci) * 4.)));
    vec2 pf = fract(pc);
    vec3 panel = mix(tint, tint2, pf.x * .6 + hash(pid + 2.) * .4) * (lit * cellOn * .2 + pulse * step(.45, hash(ci + floor(pb) + 9.)) * .6) * (.55 + .45 * pf.y);

    panel *= 1. - uMkC.z * (1. - smoothstep(.35, 1., length((n - uMkC.xy) * vec2(uAsp, 1.)))) * (1. - .4 * step(.92, pk) * step(lit, .01));
    vec3 col = mix(vec3(.004, .0045, .0055) + tint * .01, vec3(.0055, .0042, .0042), uWdRed * uWash) + panel * .22 * (1. - uWash);

    float fine = (aline(wc.x, 1.) + aline(wc.y, 1.)) * (1. - uFineOff);
    float major = max(aline(pc.x, 1.3), aline(pc.y, 1.3)) * (1. - uFineOff);
    vec2 dpc = abs(fract(pc - .5) - .5) / max(fwidth(pc), 1e-5);
    float cross = (1. - smoothstep(1., 2., min(dpc.x, dpc.y))) * (1. - smoothstep(5., 6.5, max(dpc.x, dpc.y))) * (1. - uFineOff);
    vec3 lineC = mix(mix(vec3(.55, .58, .62), tint2, .25), vec3(.58), uWash);
    col += lineC * (min(fine, 1.) * .012 + major * .018 + cross * (.15 + .9 * glint));

    vec2 tuv = vec2(U * .5 + .5, V * .5 + .5);


    vec2 tuvT = uNMode > .5 ? tuv + vec2(0., uShift * .5) : tuv;
    vec4 ty4 = (tuvT.x > 0. && tuvT.x < 1. && tuvT.y > 0. && tuvT.y < 1.) ? texture2D(uType, tuvT) : vec4(0.);
    float g = hash(floor(gl_FragCoord.xy / 2.) + floor(uTime * 24.) * 1.3);
    float led = 1. - .45 * min(fine, 1.);
    float nm = nameAt(tuv, ty4.r) * step(uNameGo * 1.02, g) * uNameOn * uIntro * (1. - uBare);
    float sm = ty4.g * step(mix(uSmallGo, uRoleGo, smoothstep(.8, .95, ty4.g)) * 1.02, g) * uIntro * (1. - uBare);
    float shim = .72 + .56 * hash(floor(wc * 2.) + floor(uTime * 8. + hash(floor(wc * 2.) + 4.) * 3.) * 1.9);
    if (uNMode < .5) col = mix(col, vec3(.066, .072, .08) * uNameL * led * shim, nm);
    col = mix(col, mix(mix(vec3(.17, .185, .2), vec3(.36, .385, .42) * uTagL, smoothstep(.58, .62, ty4.g)), vec3(.64, .68, .72) * mix(1., 1.6, uNameL > 1. ? 1. : 0.), smoothstep(.8, .95, ty4.g))         * (.8 + .2 * led) * (.82 + .36 * hash(floor(wc * 2.) + floor(uTime * 8. + hash(floor(wc * 2.) + 6.) * 3.) * 2.3)), sm);


    float wv = .5 + .5 * sin(U * 2.6 - V * 1.2 - uTime * 1.6);
    col *= mix(1., .35 + (uNMode > .5 ? 1.3 : 1.73) * wv * wv, uLit * max(0., 1. - sm * smoothstep(.8, .95, ty4.g) - (uNMode > .5 ? .6 * sm * smoothstep(.5, .54, ty4.g) : 0.)));

    float side = smoothstep(1.1, .25, abs(n.x)), vert = smoothstep(1.15, .35, abs(n.y - uHor * .6));
    col *= mix(.16, 1., side * vert) * uLevel;






    if (uWash > 0.) {
      vec2 ww = vec2(u, v - uShift * ty) / uWdSide + vec2(.5, .62);
      wdSP = vec2(n.x * uAsp, n.y) * .5;
      wdTk = uWdTk; wdFine = 1. - uFineOff;
      vec3 wd = wdColor(ww, uTime);
      float nb = smoothstep(-.02, .03, tuv.y - uNR.x) * smoothstep(-.02, .03, uNR.x + uNR.y - tuv.y);
      float mk0 = wdMk;
      wd -= mk0;
      wd *= 1. - .6 * nb * uNMode * uNameOn;
      wd *= 1. - uWdMkDim * (1. - smoothstep(.25, .6, length((n - uMkC.xy) * vec2(uAsp, 1.))));
      wd += mk0;

      wd *= 1. - mix(.8, .97, uTagL > 1. ? 1. : 0.) * smoothstep(uTagL > 1. ? .006 : .015, uTagL > 1. ? .07 : .1, (tuvT.x > 0. && tuvT.x < 1. && tuvT.y > 0. && tuvT.y < 1.) ? texture2D(uType, tuvT, 3.5).g : 0.) * (1. - (tuvT.y > .6 ? uRoleGo : uSmallGo)) * uIntro * (1. - uBare);








      vec2 wdWid = uWdEdge / (vec2(uAsp < 1. ? .25 : .3, uAsp < 1. ? .33 : .19) * 1.65);
      float fo = wdHlEdge((n - uWdHlC) * wdWid, uAsp);



      vec3 wdD = max(mix(wd * fo, vec3(1.), wdGl * .16), 0.);
      vec3 wdOut = mix(wdD / 12.92, pow((wdD + .055) / 1.055, vec3(2.4)), step(.04045, wdD));
      if (uWdAO > 0.) {











      vec3 wdA = max(mix(wd * fo / max(uWdLevel, 1e-3), vec3(1.), wdGl * .16), 0.);
      vec2 suv = n * .5 + .5;
      float wdK = 1.3 * smoothstep(1.2, 0., length(suv - .5));
      vec3 T = wdA * wdK;
      vec3 Lt = mix(T / 12.92, pow((T + .055) / 1.055, vec3(2.4)), step(.04045, T));
      float pk = max(Lt.r, max(Lt.g, Lt.b));
      if (pk >= .76) { float nP = min(pk, .95)  , d0 = .24, p0 = d0 * d0 / (1. - nP) - d0 + .76; Lt *= p0 / pk; }
      float ym = min(Lt.r, min(Lt.g, Lt.b));
      float xm = ym < .04 ? sqrt(max(ym, 0.) / 6.25) : ym + .04;
      vec3 pre = Lt + (xm - ym);





      pre *= mix(1. / mix(1., smoothstep(1.25, .35, length((suv - .5) * vec2(uAsp, 1.))), .55), 1. / max(pow(wdK, 2.2), 1e-3), uWdFx);
      wdOut = mix(wdOut, pre, uWdAO);
      }
      col += wdOut * uWash * (1. - .85 * sm);
    }



    if (uNMode > .5) col = mix(col, vec3(.066, .072, .08) * uNameL * (1. + .7 * uWash) * (1. - .14 * min(fine, 1.)) * (1. + (shim - 1.) * .35) * mix(1., .78 + .44 * wv * wv, uLit) * mix(.55, 1., side * vert) * uLevel, nm);
    gl_FragColor = vec4(col, 1.);
  }`;function ee(y){const h=document.createElement("canvas");h.width=h.height=4;const M=new E(h);M.generateMipmaps=!0,M.minFilter=L;const m=document.createElement("canvas");m.width=m.height=4;const g=new E(m);g.wrapS=j,g.generateMipmaps=!0,g.minFilter=L;const e={uType:{value:M},uStrip:{value:g},uNR:{value:new U(0,1,1,0)},uNMode:{value:0},uMkC:{value:new z(0,0,0)},uNameL:{value:1},uAsp:{value:.46},uBend:{value:.55},uHor:{value:-.12},uTime:{value:0},uLevel:{value:1},uShift:{value:0},uParX:{value:0},uIntro:{value:1},uBare:{value:0},uFineOff:{value:0},uNameGo:{value:0},uSmallGo:{value:0},uRoleGo:{value:0},uNameOn:{value:1},uLit:{value:1},uCellN:{value:32},uWash:{value:0},uWdSide:{value:1},uWdEdge:{value:new R(.25,.33)},uWdHlC:{value:new R},uWdMkDim:{value:0},uTagL:{value:1},uWdTk:{value:1},uWdAO:{value:0},uWdFx:{value:0},uMix:y.uMix,uTint:y.uTint,uTintB:y.uTintB,uTint2:y.uTint2,uTint2B:y.uTint2B},p=new Y(new X(2,2),new q({uniforms:e,vertexShader:Z,fragmentShader:J,depthWrite:!1,depthTest:!1,toneMapped:!1}));p.frustumCulled=!1,p.renderOrder=-100;{const u=new R;let t=null;p.onBeforeRender=()=>{const a=globalThis.__hlProbe,o=e;a&&(u.copy(o.uWdEdge.value),typeof a.edge=="number"&&o.uWdEdge.value.multiplyScalar(a.edge),typeof a.word=="number"&&o.uWdWordAmt&&(t=o.uWdWordAmt.value,o.uWdWordAmt.value*=a.word))},p.onAfterRender=()=>{const a=globalThis.__hlProbe,o=e;a&&(o.uWdEdge.value.copy(u),t!==null&&o.uWdWordAmt&&(o.uWdWordAmt.value=t,t=null))}}function P(u){e.uAsp.value=u;const t=u>1?1+.078*2*u/.725:1+.077*2*u/.72;e.uBend.value=Math.min(1.8,Math.sqrt(t*t-1)/.88),e.uHor.value=-.12,e.uCellN.value=u<1?30:46,e.uWdSide.value=2*Math.atan(e.uBend.value)*(u<1?2.13:1),e.uWdTk.value=K(u)/(Math.tan(e.uWdSide.value/8)/e.uBend.value/2),e.uWdEdge.value.set((u<1?.25:.3)*1.65,(u<1?.33:.19)*1.65);{const a=e;a.uWdPicZ&&(a.uWdPicZ.value=u<1?1/.6:1,a.uWdScr.value=2*Math.atan(e.uBend.value)/e.uWdSide.value,a.uWdScrH&&(a.uWdScrH.value=2*(e.uBend.value/u)/e.uWdSide.value),a.uWdSideF.value=u<1?0:.3)}{const a=e.uWdMid,o=e.uWdSpan;if(a&&o){const A=Math.atan(e.uBend.value)/e.uWdSide.value,i=e.uBend.value/u;a.value.set(.5,.62+.12*i/e.uWdSide.value),o.value.set(A,i*.85/e.uWdSide.value)}}}function H(u,t,a,o,A){const i=u.lang==="ar",l=Math.min(A,3)*(t.portrait?1:1.25);e.uWdAO.value=1,h.width=Math.round(a*l),h.height=Math.round(o*l);const d=h.getContext("2d");d.clearRect(0,0,h.width,h.height),d.textBaseline="alphabetic",d.direction=i?"rtl":"ltr";const x=i?'"Cairo Variable", sans-serif':'"Space Grotesk Variable", sans-serif',T={name:[],role:[],tag:[],hint:[]},N=(s,r,n,c,v)=>{d.font=n,d.fillStyle=c,d.direction=i?"rtl":"ltr",d.textAlign=i?"right":"left";const f=d.measureText(s),w=f.width,W=f.actualBoundingBoxAscent,G=f.actualBoundingBoxDescent,C=t.align==="center"?t.x*a-w/l/2:i?a*(1-t.x)-w/l:t.x*a,D=r*o+(W-G)/2/l;d.fillText(s,i?C*l+w:C*l,D*l),v.push([Math.round(C),Math.round(D-W/l),Math.round(w/l),Math.round((W+G)/l)])},B=(s,r,n,c)=>{d.font=`${r} 100px ${x}`;const v=Math.max(...s.map(f=>d.measureText(f).width))/100;return Math.min(c,n*a/v)*l};if(e.uNMode.value=t.strip?1:0,t.strip){const s=u.name.join(" "),r=t.strip*o*l,n=m.getContext("2d");n.font=`${i?900:700} ${r}px ${x}`;const c=n.measureText(s).width,v=r*.5,f=Math.round(r*(i?1.45:1.02));m.width=Math.round(c+v),m.height=f,n.font=`${i?900:700} ${r}px ${x}`,n.fillStyle="#ff0000",n.textBaseline="middle",n.direction=i?"rtl":"ltr",n.textAlign="center",n.clearRect(0,0,m.width,f),n.fillText(s,m.width/2,f*(i?.56:.53)),g.needsUpdate=!0;const w=f/l,W=a*l/m.width;v/2/m.width,k=.5+.27*c/m.width-(t.stripAt??.575)*W,$=l/m.width,F=i?-1:1,e.uNR.value.set(1-(t.nameY[0]*o+w/2)/o,w/o,W,k),T.name.push([0,Math.round(t.nameY[0]*o-r/l*.36),Math.round(a),Math.round(r/l*.72)])}else{const s=B(u.name,i?"800":"700",t.nameW,t.portrait?200:260);u.name.forEach((r,n)=>N(r,t.nameY[n],`${i?800:700} ${s}px ${x}`,"#ff0000",T.name))}const V=B([u.role],i?"600":"500",t.portrait?.9:.42,t.portrait?17:19);d.globalCompositeOperation="lighter",N(u.role,t.roleY,`${i?600:500} ${V}px ${x}`,"#00ff00",T.role);const S=u.tagline.split(" ");let b=[u.tagline];if(t.portrait){let s=1e9,r=1;for(let n=1;n<S.length;n++){const c=S.slice(0,n).join(" ").length,v=S.slice(n).join(" ").length;Math.abs(c-v)<s&&(s=Math.abs(c-v),r=n)}b=[S.slice(0,r).join(" "),S.slice(r).join(" ")]}const O=B(b,i?"700":"600",t.portrait?.66:.4,t.portrait?23:36);return b.forEach((s,r)=>N(s,t.tagY+r*O/l*1.12/o,`${i?700:600} ${O}px ${x}`,"#00a000",T.tag)),N(u.hint,t.hintY+(b.length-1)*O/l*1.12/o,`${i?500:400} ${(t.portrait?13:14)*l}px ${x}`,"#008c00",T.hint),d.globalCompositeOperation="source-over",M.needsUpdate=!0,T}let k=0,$=0,F=1;function _(u){e.uNMode.value>.5&&(e.uNR.value.w=k+F*u*$)}return{mesh:p,uniforms:e,fit:P,setType:H,slide:_,dispose(){p.geometry.dispose(),p.material.dispose(),M.dispose(),g.dispose()}}}const te=[["#0f8f9c","#1fb3b8"],["#5a34d0","#7f52e8"],["#3d73a8","#6094c4"],["#8a93a2","#e6ecf4"],["#1c3fbf","#3360e0"]],ue=[2.1,1.6,1.9,1.4,2.4];export{te as O,ue as a,ee as h};
