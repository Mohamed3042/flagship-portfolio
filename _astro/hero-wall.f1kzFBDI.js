import{J as A,K as j,N as F,s as H,j as U,V as Y,M as _,a as q,b as I}from"./EditionWorld.astro_astro_type_script_index_0_lang.JhFZ_HeY.js";import{W as K}from"./wall-display.Chqe4Hyz.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const X=`
  varying vec2 vN;
  void main(){ vN = position.xy; gl_Position = vec4(position.xy, .99999, 1.); }`,Z=`
  uniform sampler2D uType;
  uniform float uAsp, uBend, uHor, uTime, uLevel, uMix, uShift, uParX, uIntro, uNameGo, uSmallGo, uRoleGo, uNameOn, uLit, uCellN, uBare;
  uniform vec3 uTint, uTintB, uTint2, uTint2B;
  uniform sampler2D uStrip; uniform vec4 uNR; uniform float uNMode; uniform vec3 uMkC; uniform float uNameL; uniform float uWash;   // (world-37) the idle colour swap made visible: the state's colour washed over the panels (Open b)   // (world-26f: uMkC the mark's middle (ndc) and how much the panels round it dim) (?open=b) the name as one giant line the wall carries sideways
  uniform float uWdSide;   // (world-38b) the display's wall side, in cylinder units
  uniform float uWdMkDim;   // (world-38e)
  uniform float uTagL;   // (world-38f) the tagline's light (the Open with alche's word: it reads at 4.5:1 on all three pictures)
  uniform vec2 uWdEdge;    // (world-38c) the screen's half size in alche's wall units (his round dark edge)
  ${K}
  varying vec2 vN;
  float nameAt(vec2 tuv, float r){ if (uNMode < .5) return r; float y = (tuv.y - uNR.x) / uNR.y; if (y <= 0. || y >= 1.) return 0.; return texture2D(uStrip, vec2(tuv.x * uNR.z + uNR.w, y)).r; }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  // an anti-aliased line on the integer values of x, w px wide
  float aline(float x, float w){ float d = abs(fract(x - .5) - .5) / max(fwidth(x), 1e-5); return 1. - smoothstep(w * .5, w * .5 + 1., d); }
  void main(){
    vec2 n = vN;
    // the ray through this pixel, on a cylinder of radius 1 round the eye: u = the angle, v = the height
    float tx = uBend, ty = uBend / uAsp;
    float rx = n.x * tx + uParX, ry = (n.y - uHor) * ty;
    float u = atan(rx), v = ry / sqrt(1. + rx * rx);
    float U = u / atan(tx);                  // flat-screen x at rest (the centre column and the horizon row are true)
    float V = v / ty + uHor - uShift;        // flat-screen y, moved with the scroll (the words and the grid ride on the wall)
    // the wall's cells: square on the wall, uCellN of them across the screen's width
    float cell = 2. * atan(tx) / uCellN;
    vec2 wc = vec2(u, v - uShift * ty) / cell;              // in cells
    vec2 pc = wc / 6., pid = floor(pc);                      // panels of 6 x 6 cells
    // the colour state: each panel switches from A to B on its own threshold as the swap runs (cell by cell)
    float th = hash(pid + 11.) * .8;
    // (world-37) with the wash on, the swap crosses the wall from one side, panel by panel (a ragged front, a few panels at a time)
    if (uWash > 0.) th = clamp(.62 * (U * .5 + .5) + .38 * hash(pid + 11.), 0., 1.) * .8;
    float w = step(th, uMix * 1.25 - .05 * hash(floor(wc) + 3.));
    vec3 tint = mix(uTint, uTintB, w), tint2 = mix(uTint2, uTint2B, w);
    // a few panels lit, on a slow beat (a fade of .6 s, a hold of .9-2.4 s, cells flickering ~1/s), brighter toward their top, some cells off
    float beat = uTime / (.35 + .55 * hash(pid + 5.))   /* (world-26d: holds .9-2.4 -> .6-1.6 s: the wall's life kept as its light went down) */ + hash(pid + 1.) * 9.;
    float k0 = hash(pid + floor(beat) * 1.7), k1 = hash(pid + (floor(beat) - 1.) * 1.7), e = smoothstep(0., .12, fract(beat));
    float lit = mix(step(.9, k1) * (.35 + .65 * fract(k1 * 13.1)), step(.9, k0) * (.35 + .65 * fract(k0 * 13.1)), e) * uLit;   // (world-26g: .85 -> .9, fewer panels lit: his frame is black)
    // (world-26g) life without light: a single panel flashes for a moment and fades (~.3 s), the grid's crosses glint
    float pb = uTime * 3.2 + hash(pid + 31.) * 7., pk = hash(pid + floor(pb) * 2.9);
    float pulse = step(.92, pk) * pow(1. - fract(pb), 3.) * uLit;
    float glint = step(.9, hash(pid + floor(uTime * 5. + hash(pid + 17.) * 5.) * 3.7)) * uLit;
    vec2 ci = floor(wc);
    float cellOn = (.12 + .88 * hash(pid * 1.3 + floor(uTime * 2.3 + hash(pid + 7.) * 4.))) * (.7 + .3 * hash(ci + floor(uTime * 2.3 + hash(ci) * 4.)));   // (world-26e) the whole panel flickers (a cell's alone is lost in the eye's blur), its cells a little   // (world-26e: 1.1 -> 2.3/s, a little more life in the wall)
    vec2 pf = fract(pc);
    vec3 panel = mix(tint, tint2, pf.x * .6 + hash(pid + 2.) * .4) * (lit * cellOn * .2 + pulse * step(.45, hash(ci + floor(pb) + 9.)) * .6) * (.55 + .45 * pf.y);   // (world-26g: the steady panels .45, the brief pulses carry the life)
    // the base: near-black, a breath of the state's colour
    panel *= 1. - uMkC.z * (1. - smoothstep(.35, 1., length((n - uMkC.xy) * vec2(uAsp, 1.)))) * (1. - .4 * step(.92, pk) * step(lit, .01));   // (a pulse shows round the glass too, dimmer)   // (world-26f) the panels round the glass stay dark, so the glass is the light (alche's 42)
    vec3 col = vec3(.004, .0045, .0055) + tint * .01 + panel * .22 * (1. - uWash);   /* (world-38b) the display replaces the lit panels */   /* (world-26e: .19 -> .22, cells flicker 0-1 at 2.3/s, a faster beat: the light the glass gave up goes to the wall's life) */   // (world-26d: .5 -> .19 and fewer lit (.84 -> .87), the EN phone frame was 3-6 % over alche's light)
    // the grid: fine cell lines dim, the panel lines brighter, a small cross at each panel corner
    float fine = aline(wc.x, 1.) + aline(wc.y, 1.);
    float major = max(aline(pc.x, 1.3), aline(pc.y, 1.3));
    vec2 dpc = abs(fract(pc - .5) - .5) / max(fwidth(pc), 1e-5);   // px from the nearest panel corner
    float cross = (1. - smoothstep(1., 2., min(dpc.x, dpc.y))) * (1. - smoothstep(5., 6.5, max(dpc.x, dpc.y)));
    vec3 lineC = mix(mix(vec3(.55, .58, .62), tint2, .25), vec3(.58), uWash);   // (world-38c) neutral lines over the display: its black and white stays grey
    col += lineC * (min(fine, 1.) * .012 + major * .018 + cross * (.15 + .9 * glint));   // (world-26g: the grid barely there, as his; its crosses glint now and then)
    // the words, on the wall, in its light (R: the name; G: the role, the tagline and the hint)
    vec2 tuv = vec2(U * .5 + .5, V * .5 + .5);
    // (world-33, judge r8 request 1) ?open=b: the small type HOLDS its place on the wall as you scroll (the role line rose
    // under the nav pill at 2-3 s of the walk); only the giant line rides up with the wall
    vec2 tuvT = uNMode > .5 ? tuv + vec2(0., uShift * .5) : tuv;
    vec4 ty4 = (tuvT.x > 0. && tuvT.x < 1. && tuvT.y > 0. && tuvT.y < 1.) ? texture2D(uType, tuvT) : vec4(0.);
    float g = hash(floor(gl_FragCoord.xy / 2.) + floor(uTime * 24.) * 1.3);     // the words leave by grain, never by alpha
    float led = 1. - .45 * min(fine, 1.);                                        // the LED cells show through the letters
    float nm = nameAt(tuv, ty4.r) * step(uNameGo * 1.02, g) * uNameOn * uIntro * (1. - uBare);
    float sm = ty4.g * step(mix(uSmallGo, uRoleGo, smoothstep(.8, .95, ty4.g)) * 1.02, g) * uIntro * (1. - uBare);   // (world-33) the role line (G 1) leaves on its own, late: it stays the "who" until Mission   // (uBare: QA reads the grid alone)
    float shim = .72 + .56 * hash(floor(wc * 2.) + floor(uTime * 8. + hash(floor(wc * 2.) + 4.) * 3.) * 1.9);   // (world-26g) the word's own LED shimmer: its columns flicker
    if (uNMode < .5) col = mix(col, vec3(.066, .072, .08) * uNameL * led * shim, nm);   // (?open=b: the name is laid on last, below)   // (world-26f: uNameL, the Open's fresh glass x2: his WORKS is a clear grey on the wall)   /* (world-26e: .09 -> .066) */   // (world-26d: .14 -> .09, the name lies dim on the wall, as WORKS; the glass lights it)
    col = mix(col, mix(mix(vec3(.17, .185, .2), vec3(.36, .385, .42) * uTagL, smoothstep(.58, .62, ty4.g)), vec3(.64, .68, .72) * mix(1., 1.6, uNameL > 1. ? 1. : 0.), smoothstep(.8, .95, ty4.g))   /* (world-26h) the role x1.6 on the darker wall: the top line stays the readable "who" */   /* (world-26g) the tagline and the hint as dim wall type (.38 -> .25 / .17), the role keeps its light */ * (.8 + .2 * led) * (.82 + .36 * hash(floor(wc * 2.) + floor(uTime * 8. + hash(floor(wc * 2.) + 6.) * 3.) * 2.3)), sm);   // (world-26g) the small type's LEDs shimmer too (mean kept)   // (world-26d: the role (G 1) keeps job 26c's .64 (6.5:1); the tagline and hint .64 -> .38, the frame's light goes to the glass)
    // (world-26h) the whole wall moves as one, as his: a soft band of brightness travels slowly over the cells, the words
    // and the grid (its mean is 1: no light added)
    float wv = .5 + .5 * sin(U * 2.6 - V * 1.2 - uTime * 1.6);
    col *= mix(1., .35 + (uNMode > .5 ? 1.3 : 1.73) * wv * wv, uLit * max(0., 1. - sm * smoothstep(.8, .95, ty4.g) - (uNMode > .5 ? .6 * sm * smoothstep(.5, .54, ty4.g) : 0.)));   // (the role line keeps its light)   // (world-33, judge r8 1c: ?open=b the band swings 1.3 not 1.73 (mean .84, peak 1.65) and the tagline and the hint take 40 % of it: at its peak the rest frame rose to 15)
    // the curve falls into darkness toward its edges and corners
    float side = smoothstep(1.1, .25, abs(n.x)), vert = smoothstep(1.15, .35, abs(n.y - uHor * .6));
    col *= mix(.16, 1., side * vert) * uLevel;
    // (world-37, the owner 12 Nov: "it just keeps swapping between colors") alche's wall carries its state's colour over most
    // of its panels (wall mean 9-25 of 255, its lit tenth 26-50, silver ~75): a dim wash in the state's colour on every panel,
    // stronger on some, a block of lit ones in the lower wall as his 22-27; the type keeps its place over it
    // (world-38b, the owner 12 Nov: "it swap in some patterns ... some leds swap and some mixed swap") the wall is an LED
    // display run by alche's rule (wall-display.ts): tiles of two sizes showing one of three pictures, exchanged, blacked
    // out and shifted by chance; it lies under the type; the band behind the giant word darker so the name reads
    if (uWash > 0.) {
      vec2 ww = vec2(u, v - uShift * ty) / uWdSide + vec2(.5, .62);
      vec3 wd = wdColor(ww, uTime);
      float nb = smoothstep(-.02, .03, tuv.y - uNR.x) * smoothstep(-.02, .03, uNR.x + uNR.y - tuv.y);
      float mk0 = wdMk;   // (world-38f) alche's mark layer (+.2 flat, hard edge) is not dimmed by our own darkenings below: its 1 s tick shows as his (picture 1 has no other clock)
      wd -= mk0;
      wd *= 1. - .6 * nb * uNMode * uNameOn;   // (world-38f) the band behind the giant name only while that name is drawn (it is off under alche's word; the band cut the glow short)
      wd *= 1. - uWdMkDim * (1. - smoothstep(.25, .6, length((n - uMkC.xy) * vec2(uAsp, 1.))));   // (world-38e) the wall behind the glass letter a little darker, as alche's: the glass (~2x) then shows it at alche's level, not twice it
      wd += mk0;   // (under the type's halo: the tagline keeps its ground)
      // the wall type keeps a dark halo (its soft mip), so the role line and the tagline read on any picture
      wd *= 1. - mix(.8, .97, uTagL > 1. ? 1. : 0.) * smoothstep(uTagL > 1. ? .006 : .015, uTagL > 1. ? .07 : .1, (tuvT.x > 0. && tuvT.x < 1. && tuvT.y > 0. && tuvT.y < 1.) ? texture2D(uType, tuvT, 3.5).g : 0.) * (1. - (tuvT.y > .6 ? uRoleGo : uSmallGo)) * uIntro * (1. - uBare);   // (the halo leaves with its line)
      // alche's wall is lit in its middle and falls dark toward the top, the bottom and the sides
      // (world-38c, rule book 02 G) alche's round edge: full only within .05 of the wall's middle, black at .55
      float fo = smoothstep(.55, .05, length(n * uWdEdge));
      // (world-38c) alche's numbers are display values (his page writes them raw); ours are encoded to sRGB after: decode
      col += pow(max(wd * fo, 0.), vec3(2.2)) * uWash * (1. - .85 * sm);
    }
    // (world-33, judge r8 request 1c) ?open=b: the giant line's visible letters read as letters at a glance, a dim even grey
    // as alche's WORKS: solid strokes (the LED cells and the shimmer only a breath), the travelling band and the wall's
    // falloff only a little on them (at the screen's edges, where the line is cropped, they were dimmed to a fifth)
    if (uNMode > .5) col = mix(col, vec3(.066, .072, .08) * uNameL * (1. + .7 * uWash) * (1. - .14 * min(fine, 1.)) * (1. + (shim - 1.) * .35) * mix(1., .78 + .44 * wv * wv, uLit) * mix(.55, 1., side * vert) * uLevel, nm);
    gl_FragColor = vec4(col, 1.);
  }`;function ee(b){const p=document.createElement("canvas");p.width=p.height=4;const T=new A(p);T.generateMipmaps=!0,T.minFilter=j;const u=document.createElement("canvas");u.width=u.height=4;const g=new A(u);g.wrapS=F,g.generateMipmaps=!0,g.minFilter=j;const t={uType:{value:T},uStrip:{value:g},uNR:{value:new Y(0,1,1,0)},uNMode:{value:0},uMkC:{value:new U(0,0,0)},uNameL:{value:1},uAsp:{value:.46},uBend:{value:.55},uHor:{value:-.12},uTime:{value:0},uLevel:{value:1},uShift:{value:0},uParX:{value:0},uIntro:{value:1},uBare:{value:0},uNameGo:{value:0},uSmallGo:{value:0},uRoleGo:{value:0},uNameOn:{value:1},uLit:{value:1},uCellN:{value:32},uWash:{value:0},uWdSide:{value:1},uWdEdge:{value:new H(.25,.33)},uWdMkDim:{value:0},uTagL:{value:1},uMix:b.uMix,uTint:b.uTint,uTintB:b.uTintB,uTint2:b.uTint2,uTint2B:b.uTint2B},k=new _(new q(2,2),new I({uniforms:t,vertexShader:X,fragmentShader:Z,depthWrite:!1,depthTest:!1,toneMapped:!1}));k.frustumCulled=!1,k.renderOrder=-100;function L(a){t.uAsp.value=a;const e=a>1?1+.078*2*a/.725:1+.077*2*a/.72;t.uBend.value=Math.min(1.8,Math.sqrt(e*e-1)/.88),t.uHor.value=-.12,t.uCellN.value=a<1?30:46,t.uWdSide.value=2*Math.atan(t.uBend.value)*(a<1?2.13:1),t.uWdEdge.value.set((a<1?.25:.3)*1.65,(a<1?.33:.19)*1.65);{const n=t;n.uWdPicZ&&(n.uWdPicZ.value=a<1?1/.6:1,n.uWdScr.value=2*Math.atan(t.uBend.value)/t.uWdSide.value,n.uWdSideF.value=a<1?0:.3)}{const n=t.uWdMid,d=t.uWdSpan;if(n&&d){const B=Math.atan(t.uBend.value)/t.uWdSide.value,l=t.uBend.value/a;n.value.set(.5,.62+.12*l/t.uWdSide.value),d.value.set(B,l*.85/t.uWdSide.value)}}}function z(a,e,n,d,B){const l=a.lang==="ar",o=Math.min(B,3)*(e.portrait?1:1.25);p.width=Math.round(n*o),p.height=Math.round(d*o);const h=p.getContext("2d");h.clearRect(0,0,p.width,p.height),h.textBaseline="alphabetic",h.direction=l?"rtl":"ltr";const w=l?'"Cairo Variable", sans-serif':'"Space Grotesk Variable", sans-serif',x={name:[],role:[],tag:[],hint:[]},N=(r,i,s,f,m)=>{h.font=s,h.fillStyle=f,h.direction=l?"rtl":"ltr",h.textAlign=l?"right":"left";const c=h.measureText(r),v=c.width,y=c.actualBoundingBoxAscent,D=c.actualBoundingBoxDescent,$=e.align==="center"?e.x*n-v/o/2:l?n*(1-e.x)-v/o:e.x*n,E=i*d+(y-D)/2/o;h.fillText(r,l?$*o+v:$*o,E*o),m.push([Math.round($),Math.round(E-y/o),Math.round(v/o),Math.round((y+D)/o)])},C=(r,i,s,f)=>{h.font=`${i} 100px ${w}`;const m=Math.max(...r.map(c=>h.measureText(c).width))/100;return Math.min(f,s*n/m)*o};if(t.uNMode.value=e.strip?1:0,e.strip){const r=a.name.join(" "),i=e.strip*d*o,s=u.getContext("2d");s.font=`${l?900:700} ${i}px ${w}`;const f=s.measureText(r).width,m=i*.5,c=Math.round(i*(l?1.45:1.02));u.width=Math.round(f+m),u.height=c,s.font=`${l?900:700} ${i}px ${w}`,s.fillStyle="#ff0000",s.textBaseline="middle",s.direction=l?"rtl":"ltr",s.textAlign="center",s.clearRect(0,0,u.width,c),s.fillText(r,u.width/2,c*(l?.56:.53)),g.needsUpdate=!0;const v=c/o,y=n*o/u.width;m/2/u.width,W=.5+.27*f/u.width-(e.stripAt??.575)*y,G=o/u.width,O=l?-1:1,t.uNR.value.set(1-(e.nameY[0]*d+v/2)/d,v/d,y,W),x.name.push([0,Math.round(e.nameY[0]*d-i/o*.36),Math.round(n),Math.round(i/o*.72)])}else{const r=C(a.name,l?"800":"700",e.nameW,e.portrait?200:260);a.name.forEach((i,s)=>N(i,e.nameY[s],`${l?800:700} ${r}px ${w}`,"#ff0000",x.name))}const V=C([a.role],l?"600":"500",e.portrait?.9:.42,e.portrait?17:19);h.globalCompositeOperation="lighter",N(a.role,e.roleY,`${l?600:500} ${V}px ${w}`,"#00ff00",x.role);const M=a.tagline.split(" ");let S=[a.tagline];if(e.portrait){let r=1e9,i=1;for(let s=1;s<M.length;s++){const f=M.slice(0,s).join(" ").length,m=M.slice(s).join(" ").length;Math.abs(f-m)<r&&(r=Math.abs(f-m),i=s)}S=[M.slice(0,i).join(" "),M.slice(i).join(" ")]}const R=C(S,l?"700":"600",e.portrait?.66:.4,e.portrait?23:36);return S.forEach((r,i)=>N(r,e.tagY+i*R/o*1.12/d,`${l?700:600} ${R}px ${w}`,"#00a000",x.tag)),N(a.hint,e.hintY+(S.length-1)*R/o*1.12/d,`${l?500:400} ${(e.portrait?13:14)*o}px ${w}`,"#008c00",x.hint),h.globalCompositeOperation="source-over",T.needsUpdate=!0,x}let W=0,G=0,O=1;function P(a){t.uNMode.value>.5&&(t.uNR.value.w=W+O*a*G)}return{mesh:k,uniforms:t,fit:L,setType:z,slide:P,dispose(){k.geometry.dispose(),k.material.dispose(),T.dispose(),g.dispose()}}}const te=[["#0f8f9c","#1fb3b8"],["#5a34d0","#7f52e8"],["#3d73a8","#6094c4"],["#8a93a2","#e6ecf4"],["#1c3fbf","#3360e0"]],ae=[2.1,1.6,1.9,1.4,2.4];export{te as O,ae as a,ee as h};
