import{I as z,J as L,R as j,B as V,k as K,V as U,M as q,a as I,b as _,K as Y,N as X}from"./EditionWorld.astro_astro_type_script_index_0_lang.CK9jPdA9.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Q=`
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
  uniform float uFineOff;   // (world-84) 1 only while the Open's glass copies the wall (hero.ts): the copy carries no fine line, plus mark, LED dot or small label
  uniform float uWdTk;     // (world-63) the Open's tile scale (fit)   // (world-66) read by every wall: the Open's own, the Studio eases it from the Open's to 1 over its opening (the cut keeps its tiles); the Ending keeps 1
  uniform float uWdAO, uWdFx;   // (world-66) uWdAO: how much of alche's post chain this wall writes (the Open 1, set by setType; the Studio eases it from the Open's to 0 with its camera; the Ending 0). uWdFx: 1 when alcheFinish() runs after the room (it already applies his screen vignette and x1.3 to everything, the wall included)
  ${Y}
  varying vec2 vN;
  float wdAlcheEdge(vec2 n, float asp){   // (world-60) see the call; alche: CameraController (kv), BGQuadTree.resize, the tiles' finish
    float bf = radians(35. + 18. / asp), H10 = 20. * tan(bf * .5), s = max(H10, H10 * asp), r = s * .5, z = 9.5;
    float th = tan((bf - radians(4.)) * .5);
    vec3 d = normalize(vec3(n.x * th * asp, n.y * th, -1.));
    float a = d.x * d.x + d.z * d.z, b = 2. * z * d.z, c = z * z - r * r, D = b * b - 4. * a * c;
    if (D < 0.) return 0.;
    vec3 p = vec3(0., 0., z) + d * ((-b + sqrt(D)) / (2. * a));
    if (p.z > 0.) return 0.;
    vec2 uv = vec2(atan(p.x, -p.z) / 3.14159265 + .5, p.y / (1.5 * s) + .5);
    return smoothstep(.55, .05, length(uv - .5));
  }
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
    vec3 col = mix(vec3(.004, .0045, .0055) + tint * .01, vec3(.0055, .0042, .0042), uWdRed * uWash) + panel * .22 * (1. - uWash);   /* (world-72) the near-black base carries the state's blue: under the black and red palette it is a neutral-warm black, or the dim reds read violet */   /* (world-38b) the display replaces the lit panels */   /* (world-26e: .19 -> .22, cells flicker 0-1 at 2.3/s, a faster beat: the light the glass gave up goes to the wall's life) */   // (world-26d: .5 -> .19 and fewer lit (.84 -> .87), the EN phone frame was 3-6 % over alche's light)
    // the grid: fine cell lines dim, the panel lines brighter, a small cross at each panel corner
    float fine = (aline(wc.x, 1.) + aline(wc.y, 1.)) * (1. - uFineOff);
    float major = max(aline(pc.x, 1.3), aline(pc.y, 1.3)) * (1. - uFineOff);
    vec2 dpc = abs(fract(pc - .5) - .5) / max(fwidth(pc), 1e-5);   // px from the nearest panel corner
    float cross = (1. - smoothstep(1., 2., min(dpc.x, dpc.y))) * (1. - smoothstep(5., 6.5, max(dpc.x, dpc.y))) * (1. - uFineOff);
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
      wdSP = vec2(n.x * uAsp, n.y) * .5;   // (lead-10) the black-and-white picture lives on the screen (wall-display.ts)
      wdTk = uWdTk; wdFine = 1. - uFineOff;   // (world-63) alche's tile size on this screen (fit)   // (world-66) on every wall (uniform, not the define): the Studio carries the Open's through the cut
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
      // (world-60, the lead: match alche's levels outside the glass, measured per picture on his 40 rest frames) alche's
      // round edge exactly where HIS screen puts it: this pixel's ray from his kv camera onto his half cylinder gives his
      // wall uv, and the edge is smoothstep(.55, .05, |uv - .5|) there (was length(n x uWdEdge), x1.65 darker, and a
      // stripes-only lift: stand-ins for his stills, 3-5x darker than his frames at the screen's sides)
      // (world-66) the Studio widens the lit middle as the works take the wall (studio.ts scales uWdEdge by 1 - .5 x cover): the
      // same widening carried into alche's edge (the ratio of uWdEdge to fit()'s value; 1 on the Open and the Ending)
      vec2 wdWid = uWdEdge / (vec2(uAsp < 1. ? .25 : .3, uAsp < 1. ? .33 : .19) * 1.65);
      float fo = wdAlcheEdge(n * wdWid, uAsp);
      // (world-38c) alche's numbers are display values (his page writes them raw); ours are encoded to sRGB after: decode
      // (world-60) the exact sRGB decode, so the renderer's sRGB encode gives his display value back: pow 2.2 crushed the
      // wall's darks (a display .05 came out .018: the dim outer wall ~2.7x too dark beside his frames)
      vec3 wdD = max(mix(wd * fo, vec3(1.), wdGl * .16), 0.);
      vec3 wdOut = mix(wdD / 12.92, pow((wdD + .055) / 1.055, vec3(2.4)), step(.04045, wdD));   // (lead-10) alche's fine grid over it all, after the dark edge
      if (uWdAO > 0.) {
      // (world-63, the Open only: set by setType, which only the Open calls; a define, so the Studio, which borrows the Open's
      // uniforms, keeps today's path) alche's post chain after his wall, factor for factor, and ours undone, so the screen
      // shows his display value:
      //   top-scene-mixer.frag: mainSceneCol *= smoothstep(1.2, 0., length(uv - .5))   (his SCREEN vignette, uv 0..1)
      //   scene-composite.frag: col.xyz *= 1.3                                           (on everything; no tone map, no sRGB encode)
      //   (bloom: threshold .9, the wall stays under it: not added)
      // ours after this shader: engine.ts POST_FRAG rgb *= mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(asp, 1.))), uVig .55)
      // then three's NeutralToneMapping (its toe x - 6.25x^2 offset crushed every dim wall value: a display .1 left the
      // screen at .008), then the sRGB encode. The value written here is the one those three steps turn into his.
      //   and one factor of ours that his chain does not have: hero.ts sets uWdLevel 1.34 on the Open (world-38f, a stand-in
      //   gain tuned to his stills before his post chain was known); wall-tiles.frag ends in o *= .5 alone: taken out here
      vec3 wdA = max(mix(wd * fo / max(uWdLevel, 1e-3), vec3(1.), wdGl * .16), 0.);
      vec2 suv = n * .5 + .5;
      float wdK = 1.3 * smoothstep(1.2, 0., length(suv - .5));   // his screen vignette and x1.3
      vec3 T = wdA * wdK;
      vec3 Lt = mix(T / 12.92, pow((T + .055) / 1.055, vec3(2.4)), step(.04045, T));   // the linear value the encode must get
      float pk = max(Lt.r, max(Lt.g, Lt.b));
      if (pk >= .76) { float nP = min(pk, .95) /* (world-66) was .999: a bright word on the wall (the Studio's crossing word while it eases out of this chain) came out x58 and bloomed to a blob; .95 caps the undo at x1.7 (the Open's wall stays far below the shoulder) */, d0 = .24, p0 = d0 * d0 / (1. - nP) - d0 + .76; Lt *= p0 / pk; }   // Neutral's shoulder, its peak undone (its small desaturation not)
      float ym = min(Lt.r, min(Lt.g, Lt.b));
      float xm = ym < .04 ? sqrt(max(ym, 0.) / 6.25) : ym + .04;                       // Neutral's toe undone on the smallest channel
      vec3 pre = Lt + (xm - ym);
      // (world-66) with alcheFinish() after the room (the Open's default) his vignette and x1.3 must not be applied twice: the
      // finish multiplies this pixel by wdK^2.2 / (our page vignette) (it works in pow 1/2.2, which is exact on a product) and the
      // engine's post multiplies the page vignette back: so the wall hands the finish T's linear value / wdK^2.2 and leaves the page
      // vignette to them (measured: a .1 grey left the screen at 1.3^2 and two vignettes). Without the finish (?mark=now,
      // ?open=a): our page vignette undone here, as job 63 wrote it
      pre *= mix(1. / mix(1., smoothstep(1.25, .35, length((suv - .5) * vec2(uAsp, 1.))), .55), 1. / max(pow(wdK, 2.2), 1e-3), uWdFx);
      wdOut = mix(wdOut, pre, uWdAO);
      }
      col += wdOut * uWash * (1. - .85 * sm);
    }
    // (world-33, judge r8 request 1c) ?open=b: the giant line's visible letters read as letters at a glance, a dim even grey
    // as alche's WORKS: solid strokes (the LED cells and the shimmer only a breath), the travelling band and the wall's
    // falloff only a little on them (at the screen's edges, where the line is cropped, they were dimmed to a fifth)
    if (uNMode > .5) col = mix(col, vec3(.066, .072, .08) * uNameL * (1. + .7 * uWash) * (1. - .14 * min(fine, 1.)) * (1. + (shim - 1.) * .35) * mix(1., .78 + .44 * wv * wv, uLit) * mix(.55, 1., side * vert) * uLevel, nm);
    gl_FragColor = vec4(col, 1.);
  }`;function ee(b){const m=document.createElement("canvas");m.width=m.height=4;const k=new z(m);k.generateMipmaps=!0,k.minFilter=L;const d=document.createElement("canvas");d.width=d.height=4;const g=new z(d);g.wrapS=j,g.generateMipmaps=!0,g.minFilter=L;const e={uType:{value:k},uStrip:{value:g},uNR:{value:new U(0,1,1,0)},uNMode:{value:0},uMkC:{value:new K(0,0,0)},uNameL:{value:1},uAsp:{value:.46},uBend:{value:.55},uHor:{value:-.12},uTime:{value:0},uLevel:{value:1},uShift:{value:0},uParX:{value:0},uIntro:{value:1},uBare:{value:0},uFineOff:{value:0},uNameGo:{value:0},uSmallGo:{value:0},uRoleGo:{value:0},uNameOn:{value:1},uLit:{value:1},uCellN:{value:32},uWash:{value:0},uWdSide:{value:1},uWdEdge:{value:new V(.25,.33)},uWdMkDim:{value:0},uTagL:{value:1},uWdTk:{value:1},uWdAO:{value:0},uWdFx:{value:0},uMix:b.uMix,uTint:b.uTint,uTintB:b.uTintB,uTint2:b.uTint2,uTint2B:b.uTint2B},T=new q(new I(2,2),new _({uniforms:e,vertexShader:Q,fragmentShader:Z,depthWrite:!1,depthTest:!1,toneMapped:!1}));T.frustumCulled=!1,T.renderOrder=-100;function F(a){e.uAsp.value=a;const t=a>1?1+.078*2*a/.725:1+.077*2*a/.72;e.uBend.value=Math.min(1.8,Math.sqrt(t*t-1)/.88),e.uHor.value=-.12,e.uCellN.value=a<1?30:46,e.uWdSide.value=2*Math.atan(e.uBend.value)*(a<1?2.13:1),e.uWdTk.value=X(a)/(Math.tan(e.uWdSide.value/8)/e.uBend.value/2),e.uWdEdge.value.set((a<1?.25:.3)*1.65,(a<1?.33:.19)*1.65);{const n=e;n.uWdPicZ&&(n.uWdPicZ.value=a<1?1/.6:1,n.uWdScr.value=2*Math.atan(e.uBend.value)/e.uWdSide.value,n.uWdScrH&&(n.uWdScrH.value=2*(e.uBend.value/a)/e.uWdSide.value),n.uWdSideF.value=a<1?0:.3)}{const n=e.uWdMid,u=e.uWdSpan;if(n&&u){const O=Math.atan(e.uBend.value)/e.uWdSide.value,l=e.uBend.value/a;n.value.set(.5,.62+.12*l/e.uWdSide.value),u.value.set(O,l*.85/e.uWdSide.value)}}}function $(a,t,n,u,O){const l=a.lang==="ar",s=Math.min(O,3)*(t.portrait?1:1.25);e.uWdAO.value=1,m.width=Math.round(n*s),m.height=Math.round(u*s);const h=m.getContext("2d");h.clearRect(0,0,m.width,m.height),h.textBaseline="alphabetic",h.direction=l?"rtl":"ltr";const w=l?'"Cairo Variable", sans-serif':'"Space Grotesk Variable", sans-serif',x={name:[],role:[],tag:[],hint:[]},S=(r,i,o,p,f)=>{h.font=o,h.fillStyle=p,h.direction=l?"rtl":"ltr",h.textAlign=l?"right":"left";const c=h.measureText(r),v=c.width,y=c.actualBoundingBoxAscent,G=c.actualBoundingBoxDescent,A=t.align==="center"?t.x*n-v/s/2:l?n*(1-t.x)-v/s:t.x*n,D=i*u+(y-G)/2/s;h.fillText(r,l?A*s+v:A*s,D*s),f.push([Math.round(A),Math.round(D-y/s),Math.round(v/s),Math.round((y+G)/s)])},B=(r,i,o,p)=>{h.font=`${i} 100px ${w}`;const f=Math.max(...r.map(c=>h.measureText(c).width))/100;return Math.min(p,o*n/f)*s};if(e.uNMode.value=t.strip?1:0,t.strip){const r=a.name.join(" "),i=t.strip*u*s,o=d.getContext("2d");o.font=`${l?900:700} ${i}px ${w}`;const p=o.measureText(r).width,f=i*.5,c=Math.round(i*(l?1.45:1.02));d.width=Math.round(p+f),d.height=c,o.font=`${l?900:700} ${i}px ${w}`,o.fillStyle="#ff0000",o.textBaseline="middle",o.direction=l?"rtl":"ltr",o.textAlign="center",o.clearRect(0,0,d.width,c),o.fillText(r,d.width/2,c*(l?.56:.53)),g.needsUpdate=!0;const v=c/s,y=n*s/d.width;f/2/d.width,N=.5+.27*p/d.width-(t.stripAt??.575)*y,C=s/d.width,E=l?-1:1,e.uNR.value.set(1-(t.nameY[0]*u+v/2)/u,v/u,y,N),x.name.push([0,Math.round(t.nameY[0]*u-i/s*.36),Math.round(n),Math.round(i/s*.72)])}else{const r=B(a.name,l?"800":"700",t.nameW,t.portrait?200:260);a.name.forEach((i,o)=>S(i,t.nameY[o],`${l?800:700} ${r}px ${w}`,"#ff0000",x.name))}const P=B([a.role],l?"600":"500",t.portrait?.9:.42,t.portrait?17:19);h.globalCompositeOperation="lighter",S(a.role,t.roleY,`${l?600:500} ${P}px ${w}`,"#00ff00",x.role);const W=a.tagline.split(" ");let M=[a.tagline];if(t.portrait){let r=1e9,i=1;for(let o=1;o<W.length;o++){const p=W.slice(0,o).join(" ").length,f=W.slice(o).join(" ").length;Math.abs(p-f)<r&&(r=Math.abs(p-f),i=o)}M=[W.slice(0,i).join(" "),W.slice(i).join(" ")]}const R=B(M,l?"700":"600",t.portrait?.66:.4,t.portrait?23:36);return M.forEach((r,i)=>S(r,t.tagY+i*R/s*1.12/u,`${l?700:600} ${R}px ${w}`,"#00a000",x.tag)),S(a.hint,t.hintY+(M.length-1)*R/s*1.12/u,`${l?500:400} ${(t.portrait?13:14)*s}px ${w}`,"#008c00",x.hint),h.globalCompositeOperation="source-over",k.needsUpdate=!0,x}let N=0,C=0,E=1;function H(a){e.uNMode.value>.5&&(e.uNR.value.w=N+E*a*C)}return{mesh:T,uniforms:e,fit:F,setType:$,slide:H,dispose(){T.geometry.dispose(),T.material.dispose(),k.dispose(),g.dispose()}}}const te=[["#0f8f9c","#1fb3b8"],["#5a34d0","#7f52e8"],["#3d73a8","#6094c4"],["#8a93a2","#e6ecf4"],["#1c3fbf","#3360e0"]],ae=[2.1,1.6,1.9,1.4,2.4];export{te as O,ae as a,ee as h};
