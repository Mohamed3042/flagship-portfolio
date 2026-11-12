import{s as b,b8 as P,b9 as C,aA as U,aO as q,W as L,y as T,H as F,b as A,Q as D,O as H,M as O,a as z,S as V,z as G,B as Z,k as j}from"./EditionWorld.astro_astro_type_script_index_0_lang.DH-YgFNA.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const J=`
  uniform float uWdT, uWdLay, uWdPicA, uWdPicB, uWdWay, uWdE, uWdDir, uWdBlack, uWdBSeed, uWdShOn, uWdShS0, uWdShS1, uWdShE, uWdMark, uWdLevel, uWdOn;
  uniform vec2 uWdSh, uWdMid, uWdSpan;   // (uWdMid: the screen's middle on the wall; uWdSh.x: the shift's power, 0..1)
  uniform float uWdPicZ, uWdScr, uWdSideF, uWdMarkOn;   // (world-38c) the picture's zoom (a phone .5: a flat stand-in wall at half size), the screen's width on the wall, the side faces' glow (0 on a phone), the mark layer on
  uniform sampler2D uWdName, uWdMk; uniform float uWdNameZ, uWdMkAsp;
  // (world-42, the Studio only: these live in the Studio's own material, never in the shared uniforms; the Open never sets
  // them, so they stay 0 there and its picture is unchanged) the giant word on the tiles and the works on the tiles
  uniform float uWdWorkOn, uWdCover, uWdF, uWdSideW, uWdAspS, uWdWordAmt;
  uniform vec4 uWdScrM, uWdWordM;   // screen from wall: U = (w.x - x) z, V = (w.y - y) w; the word: centre (x in half-heights), width, its texture's aspect
  uniform sampler2D uWdWorkA, uWdWorkB, uWdWordT;
  vec3 wdFilm(sampler2D s, vec2 S){   // a work cover-fit to the screen (16:9 film), seen through the stand-in uv (a phone: twice as big)
    vec2 uv = vec2(.5 + S.x * uWdAspS / (16. / 9.) * .5 * uWdPicZ, .5 + S.y * .5 * uWdPicZ);
    vec3 c = pow(max(texture2D(s, clamp(uv, .001, .999)).rgb, 0.), vec3(1. / 2.2));   // its own display values (the film is decoded on read)
    float lu = dot(c, vec3(.299, .587, .114));
    // (world-43c, the owner 12 Nov: no orange, yellow, sand, gold or brown) warm hues (red-orange through yellow, 10 to 70 degrees,
    // shoulders 15 degrees wide) lose their colour to their own brightness; cool hues are untouched. Before the saturation x2.
    float mx = max(c.r, max(c.g, c.b)), dl = mx - min(c.r, min(c.g, c.b));
    float hue = dl < .0001 ? 120. : 60. * (mx == c.r ? (c.g - c.b) / dl : mx == c.g ? (c.b - c.r) / dl + 2. : (c.r - c.g) / dl + 4.);   // red is -60..60 (magenta below 0)
    float warm = smoothstep(-5., 10., hue) * (1. - smoothstep(70., 85., hue));
    c = mix(c, vec3(lu), warm);
    return clamp(mix(vec3(lu), c, 2.), 0., 1.);       // saturation x2, brightness kept
  }
  float wdH(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float wdN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(wdH(i), wdH(i + vec2(1., 0.)), f.x), mix(wdH(i + vec2(0., 1.)), wdH(i + vec2(1., 1.)), f.x), f.y); }
  float wdF(vec2 p){ return .66 * wdN(p) + .34 * wdN(p * 2.03 + 5.2); }   // two octaves (the frame time on a phone)
  float wdS(float n){ return clamp((n - .5) * 1.7 + .5, 0., 1.); }        // value noise spread to the full 0..1
  // B: the three pictures, from one drifting field at picture position p; the colour channels drift at .1 a second, the
  // channel of the black-and-white bands twenty times slower (world-38c, rule book 02)
  float wdSlow(vec2 q, float t){ return wdS(wdF(q * .8 + vec2(5.1, 1.3) + t * .005 * vec2(.8, .6))); }
  vec3 wdPic(float k, vec2 p, float t){
    vec2 q = p * 1.35;
    if (k > .5 && k < 1.5) return vec3(step(.5, fract(wdSlow(q, t) * 9.)));   // black and white: ~9 bands, half white
    float a = wdS(wdF(q + t * .1 * vec2(.8, .6))), b = wdS(wdN(q * 1.2 + vec2(7.3, 2.1) - t * .1 * vec2(.6, .8))), c = wdS(wdN(q * .8 + vec2(3.1, 9.7) + t * .1 * vec2(-.7, .7)));
    if (k < .5)    // soft colour clouds: mostly teal-blue, violet and pink only where red runs high
      { float B = smoothstep(0., 1., .3 + .7 * c) * 1.2;   // (world-38c) blue carries every cloud (alche's frames: never green)
        return vec3(smoothstep(.5, 1., a) * .6, min(smoothstep(.2, 1., b) * .8, B), B); }   // (world-38f) green at alche's .8 (his teal 25,55,63 at rest; ours read 28,29,45), only never above the blue
    // three colours: a blue-violet ground, toward ice as the slow channel runs high, toward crimson (the owner: never orange)
    vec3 col = mix(vec3(.21, .06, .99), vec3(.70, .93, 1.), smoothstep(.5, .9, wdSlow(q, t)));
    return mix(col, vec3(.86, .05, .2), smoothstep(.5, 1., b));
  }
  // F: the word on its strip (R; repeats sideways) and the MK (alpha), each with a hard edge
  float wdWord(vec2 r){ return (r.y > 0. && r.y < 1.) ? step(.5, texture2D(uWdName, vec2(r.x, r.y)).r) : 0.; }
  float wdMk;   // (world-38f) the mark layer's own light in the colour wdColor returns (a room keeps it out of its own dimming)
  // (world-44, added) word rows: a room may give the mark layer's ways 0 and 1 its own words (uWdRows: up to four words
  // stacked, one a quarter of the texture's height, the word in R; uWdRowsZ = a slot's height / width); 0 keeps his name
  uniform sampler2D uWdRows; uniform float uWdRowsOn, uWdRowsZ;
  float wdRow(vec2 r, float id){ return (r.x > 0. && r.x < 1. && r.y > 0. && r.y < 1.) ? step(.5, texture2D(uWdRows, vec2(r.x, (3. - id + clamp(r.y, .02, .98)) / 4.)).r) : 0.; }
  float wdMkS(vec2 r){ return (r.x > 0. && r.x < 1. && r.y > 0. && r.y < 1.) ? step(.5, texture2D(uWdMk, r).a) : 0.; }
  /** The wall's colour at wall position w (the wall is 1 x 1; a big tile = 1/8), t seconds. */
  vec3 wdColor(vec2 w, float t){
    // A: the tile under w (one layout a visit, uWdLay): a cell of the third cut, cut once more on an even chance
    vec2 c3 = floor(w * 8.);
    float n = mix(8., 16., step(.5, wdH(c3 + uWdLay * 17.31 + .5)));
    vec2 c = floor(w * n), luv = fract(w * n);
    float r = wdH(c * 1.37 + n * 3.1 + uWdLay * 5.1), r2 = wdH(c * .91 + n + 13.7), r3 = wdH(c * 2.03 - n + 4.4);
    float pk = uWdPicA;   // C: a hard cut, the only way the picture changes
    // E: shifted tiles (pictures 1 and 2): half of them show the picture from elsewhere, each its own way, by the power
    float sSeed = uWdShE < r2 * .3 ? uWdShS0 : uWdShS1;
    float shifted = step(wdH(c * 1.71 + sSeed * 9.13 + n), .5) * step(.5, pk) * uWdShOn;
    vec2 p = (c + luv) / n + shifted * (vec2(wdH(c + sSeed * 3.3), wdH(c * 1.9 + sSeed)) - .5) * uWdSh.x * uWdScr;
    p = (p - uWdMid) * uWdPicZ + uWdMid;   // a phone sees the middle half of the picture, twice as large
    vec3 col = wdPic(pk, p, t);
    // D: the black-out
    col *= 1. - step(wdH(c * .73 + n * 1.9 + uWdBSeed * 3.71), uWdBlack);
    // F: the mark layer, a flat fifth of light with a hard edge, AFTER the black-out (black tiles still carry it)
    float m = 0., my = w.y - uWdMid.y + .5;   // (my: the wall's height, its middle on the screen's middle)
    if (uWdMark < .5) {          // ~9.6 rows over the wall, two marks a row, each row swaying a tenth of a cell (6.3 s)
      float rh = 1. / 9.6, row = floor(my / rh), cw = .5;
      float x = w.x + .1 * cw * sin(t * 6.2832 / 6.3 + row * 3.);
      float Mh = max(cw / 1.3 * uWdNameZ, rh / 1.3), Mw = Mh / uWdNameZ;   // (world-38f) the word as tall in its row as alche's logo is in his (77 %): our name strip is longer than his logo, so at his width it came out a thin line and its tick did not show
      vec2 lc = vec2(fract(x / cw) * cw - cw * .5, (fract(my / rh) - .5) * rh);
      m = wdWord(vec2(lc.x / Mw + .5, lc.y / Mh + .5)) * step(abs(lc.x), Mw * .5);
      if (uWdRowsOn > .5) { float Rh = min(cw / 1.15 * uWdRowsZ, rh / 1.3), Rw = Rh / uWdRowsZ; m = wdRow(vec2(lc.x / Rw + .5, lc.y / Rh + .5), mod(row * 2. + floor(x / cw), 4.)); }   // (world-44, added) two words a row, the four in turn
    } else if (uWdMark < 1.5) {  // ~5.3 rows of one giant mark each, above the middle drifting one way, below the other; the middle band empty
      float rh = 1. / 5.3, row = floor(my / rh), Mh = rh / 1.3, Mw = Mh / uWdNameZ;
      float dir = my > .5 ? 1. : -1.;
      float ly = (fract(my / rh) - .5) * rh;
      m = wdWord(vec2(w.x / Mw + dir * t * .05 + row * .37, ly / Mh + .5)) * (1. - step(.41, my) * step(my, .59));
      if (uWdRowsOn > .5) { float Rw = Mh / uWdRowsZ, xx = w.x / (Rw * 1.15) + dir * t * .05 + row * .37; m = wdRow(vec2(fract(xx) * 1.15, ly / Mh + .5), mod(row, 4.)) * (1. - step(.41, my) * step(my, .59)); }   // (world-44, added) one word a giant row, each row its own
    } else {                     // a small MK in every tile, running upward, each its own speed and size
      float s = 1. / (1.3 + 5. * r3), y = fract(t * .5 * r);
      vec2 mp = vec2((luv.x - .5) / s + .5, ((luv.y - y) / s) * uWdMkAsp + .5);
      m = wdMkS(mp) + wdMkS(vec2(mp.x, mp.y + uWdMkAsp / s));
    }
    col *= 1. - .5 * uWdWordAmt;   // (world-42) while the word shows the picture dims to half, the mark layer is off
    col += clamp(m, 0., 1.) * .2 * uWdMarkOn * (1. - uWdWordAmt);
    if (uWdWordAmt > 0.) {   // (world-42) the giant word, ON the tiles
      // (world-51c, owner 12 Nov 17:18: "only first time you see studio cross properly") read at the tile's OWN place, never through
      // the shifted uv: the shift runs on the wall's free clock, so the word broke into displaced pieces whenever a pass met pictures 1/2
      vec2 Sp = (w - uWdScrM.xy) * uWdScrM.zw; Sp.x *= uWdAspS;
      vec2 wu = vec2((Sp.x - uWdWordM.x) / uWdWordM.z + .5, (Sp.y - uWdWordM.y) / (uWdWordM.z / uWdWordM.w) + .5);
      float wa = (wu.x > 0. && wu.x < 1. && wu.y > 0. && wu.y < 1.) ? texture2D(uWdWordT, wu).a : 0.;
      col += vec3(smoothstep(.35, .6, wa)) * 3.5 * uWdWordAmt;   // (bright: the finish below takes it to ~.9)
    }
    if (uWdWorkOn > 0.) {   // (world-42) the work takes the wall from the reading edge, tile by tile; it hides the black-out, the shift and the marks
      float sd = uWdSideW < 0. ? -1. : 1.;
      vec2 S = (w - uWdScrM.xy) * uWdScrM.zw;
      float tx = (((c.x + .5) / n - uWdScrM.x) * uWdScrM.z) * sd * .5 + .5;    // the tile's middle, 0 at the edge the work enters from
      float wk = smoothstep(0., .3, uWdCover - tx);
      // between two works: the new one wipes in from that edge with the scroll; old and new slide on by half a screen; the
      // tiles near the seam scatter up and down (the old into tiles, the new gathering)
      float f = uWdF, px = S.x * sd * .5 + .5, nw = 1. - smoothstep(f - .03, f + .03, px), rn = wdH(c * 2.31 + n * 1.7) - .5;
      vec3 a = wdFilm(uWdWorkA, vec2(S.x - sd * f, S.y + rn * f * f * 2.));
      vec3 b = wdFilm(uWdWorkB, vec2(S.x + sd * (1. - f), S.y + rn * (1. - f) * (1. - f) * 2.));
      vec3 wc = mix(a, b, f > 0. ? nw : 0.);
      wc += (wdH(floor(gl_FragCoord.xy) + fract(t * 7.) * 91.) - .5) * .1;     // 10 % grain
      col = mix(col, max(wc, 0.), wk * uWdWorkOn);
    }
    // G: the finish: the gap, the tile corners down to 74 %, the LED dots (414 across the wall, 54-90 %), half strength
    vec2 e = min(luv, 1. - luv) * (16. / n);                       // distance from the tile's border, in small-tile units
    float inside = step(.048, min(e.x, e.y));
    float sideF = (1. - inside) * uWdSideF;                        // the thin side faces (dark on a phone: alche's fluid does not run there)
    float corner = smoothstep(.35, .72, length(luv - .5));
    vec2 dg = fract(w * 414.) - .5;
    float dots = mix(.54, .9, smoothstep(.5, .15, length(dg)));
    float fin = dots * inside * mix(1., .74, corner);
    wdMk = clamp(m, 0., 1.) * .2 * uWdMarkOn * fin * .5 * uWdLevel;
    col = col * fin + col * sideF * .5;
    return col * .5 * uWdLevel;
  }`;function I(w){let a=w>>>0;return()=>{a=a+1831565813>>>0;let e=a;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function $(w){const a=I(w.seed??38),e={uWdT:{value:0},uWdLay:{value:0},uWdPicA:{value:0},uWdPicB:{value:0},uWdWay:{value:0},uWdE:{value:9},uWdDir:{value:0},uWdBlack:{value:0},uWdBSeed:{value:1},uWdShOn:{value:0},uWdShS0:{value:1},uWdShS1:{value:2},uWdShE:{value:9},uWdMark:{value:2},uWdLevel:{value:1},uWdOn:{value:1},uWdSh:{value:new b},uWdMid:{value:new b(.5,.5)},uWdSpan:{value:new b(.5,.5)},uWdPicZ:{value:1},uWdScr:{value:.47},uWdSideF:{value:0},uWdMarkOn:{value:1},uWdName:{value:w.name},uWdNameZ:{value:w.nameZ},uWdMk:{value:w.mk},uWdMkAsp:{value:w.mkAsp}};Object.assign(e,{uWdRows:{value:w.name},uWdRowsOn:{value:0},uWdRowsZ:{value:.2}});const f=.3,u=.06,n=1.2,i=.5;let o=0,d=0,l=-99,c=n,s=-99,p=1,h=0,g=new b,v=new b,S=-99;e.uWdLay.value=typeof globalThis.__wdLay=="number"?globalThis.__wdLay:Math.floor(Math.random()*4);function k(t,r={}){if(o+=r.still?0:t,e.uWdT.value=o,globalThis.__wdEv&&(globalThis.__wdT=o),o>=c){s=o,c=o+f+n+a()*i,p+=7;const y=Math.floor(a()*3);e.uWdPicA.value=e.uWdPicB.value=y,e.uWdWay.value=0,y!==d&&(l=o),d=y,globalThis.__wdEv?.push({t:+o.toFixed(3),pic:y,way:0}),h=d===0?0:.25+a()*.25,e.uWdMark.value=Math.floor(a()*3),g.copy(e.uWdSh.value),v.set(a(),0),S=o,e.uWdShS0.value=e.uWdShS1.value,e.uWdShS1.value+=1+Math.floor(a()*9)}e.uWdE.value=o-l;const m=o-s;e.uWdBSeed.value=p+Math.min(Math.floor(m/u),4),e.uWdBlack.value=m<f?h:0,e.uWdShOn.value=d===0?0:1;const W=Math.min(1,(o-S)/f),x=1-(1-W)*(1-W)*(1-W);e.uWdSh.value.copy(g).lerp(v,x),e.uWdShE.value=o-S}return{uniforms:e,update:k,get picture(){return d},get time(){return o}}}const K={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function ee({depthK:w=.245,bevelK:a=.05,stroke:e=.07}={}){const f=P(C.M,C.K,2.15,e);let u=1e9,n=-1e9;for(const c of f)for(const[s]of c)u=Math.min(u,s),n=Math.max(n,s);const i=n-u,o=i*w,d=o*a,l=new U(q(f),{depth:o-2*d,curveSegments:4,bevelEnabled:!0,bevelThickness:d,bevelSize:d*.9,bevelSegments:3});return l.center(),l.computeVertexNormals(),l.userData.mkMark="alche",l.userData.width=i+2*d*.9,l}const Q=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,X=`
  uniform sampler2D uCopy; uniform float uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx; uniform vec2 uSpot;
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  float h1(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h1(i), h1(i + vec2(1., 0.)), f.x), mix(h1(i + vec2(0., 1.)), h1(i + vec2(1., 1.)), f.x), f.y); }
  void main(){
    vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
    vec3 V = normalize(-vV);
    vec2 uv = vC.xy / vC.w * .5 + .5;
    // the bend: none on a face that looks at the visitor, strong where the surface turns away (against the normal)
    vec2 bendDir = n.xy * (1. - max(n.z, 0.) * .7);
    // (world-38e) the frost as alche's rainy glass: read in the LETTER'S OWN surface (its uv: the face's x/y, a side
    // wall's depth/height), so the spots sit on the glass and turn with it. A fine first read (nine cells across the
    // letter) pushes a second read about by up to a whole uv: many small, irregular spots and streaks with firm borders,
    // like dried rain on a window; between them the glass is clear (no nudge: the wall's tiles and LED dots sharp).
    vec3 an = abs(normalize(vON));
    vec2 luv = (an.z >= max(an.x, an.y) ? vL.xy : an.x > an.y ? vL.zy : vL.xz) / uSpan;
    vec2 q = luv * 9.;
    vec2 wv = vec2(vn(q + vec2(uTime * .1, 0.)) * .65 + vn(q * 2.1 + vec2(5.2, -uTime * .1)) * .35,
                   vn(q * 1.3 + vec2(17.1, -uTime * .1)) * .65 + vn(q * 2.3 + vec2(-3.7, uTime * .1)) * .35);
    float nz = vn(q * 2.6 + (wv - .5) * 2. * uWarp) * .7 + vn(q * 5.3 + (wv.yx - .5) * 2. * uWarp) * .3;
    float rough = smoothstep(uSpot.x, uSpot.y, nz) * uRough;
    vec3 col = vec3(0.);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 rp = floor(gl_FragCoord.xy / uGrainPx) + fi * vec2(17.3, 31.7);   // (world-38e) the sand in grains of alche's pixel (his picture is drawn at 1.5 x CSS)
      float slide = .005 + h1(rp) * .007;
      vec2 j = (vec2(h1(rp + 3.1), h1(rp + 7.7)) - .5) * rough * .3;
      vec2 o = -bendDir;
      col.r += texture2D(uCopy, uv + o * (uBend + slide) + j).r;
      col.g += texture2D(uCopy, uv + o * (uBend + slide * 2.) + j).g;
      col.b += texture2D(uCopy, uv + o * (uBend + slide * 4.) + j).b;
    }
    col *= .9 / 8.;
    col = pow(max(col, 0.), vec3(1. / 2.2));   // alche's maths works on display values (his page writes them raw); ours are linear: encode, work, decode
    // the boost and the faint environment, by the angle (face-on ~2x the copy, the rim ~1.1x)
    float cs = clamp(dot(n, V), 0., 1.), F = .1 + .9 * pow(1. - cs, 5.);
    vec3 r = reflect(-V, n);
    vec3 env = vec3(.44) * (.35 + .65 * smoothstep(-.3, .9, r.y)) * uEnv;
    col = col + mix(col, env, .9 * F) * (1. - F);
    col *= uBoost;
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function _(w,a){const e=w.__sceneSize;return e?a.set(e[0],e[1]):w.getDrawingBufferSize(a)}function te({scale:w=.5,copy:a=0,span:e=4,bend:f=.1,rough:u=.1,boost:n=1.2,env:i=1,glint:o=1,warp:d=4,spot:l=[.5,.64]}={}){const c=new L(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),s={uCopy:{value:c.texture},uTime:{value:0},uBend:{value:f},uRough:{value:u},uBoost:{value:n},uEnv:{value:i},uGlint:{value:o},uOn:{value:1},uSpan:{value:e},uWarp:{value:d},uSpot:{value:new b(l[0],l[1])},uGrainPx:{value:1}},p=new A({uniforms:s,vertexShader:Q,fragmentShader:X,toneMapped:!1}),h=new b;function g(v,S,k,t){_(v,h);const r=a?Math.round(Math.min(h.x*.87,a*1.5)):Math.max(4,Math.round(h.x*w)),m=a?Math.round(Math.min(h.y*.6,a*1.25)):Math.max(4,Math.round(h.y*w));(c.width!==r||c.height!==m)&&c.setSize(r,m);const W=v.getRenderTarget(),x=t.map(R=>R.visible),y=v.getClearAlpha();t.forEach(R=>{R.visible=!1}),v.setRenderTarget(c),v.setClearAlpha(1),v.clear(),v.render(S,k),v.setRenderTarget(W),v.setClearAlpha(y),t.forEach((R,B)=>{R.visible=x[B]})}return{material:p,uniforms:s,capture:g,target:c,dispose(){c.dispose(),p.dispose()}}}function ae(w=K.open){const a=new D,e=new D,f=new D,u=new j,n=new b;let i={...w},o=0,d=0,l=0,c=!1,s=0,p=0;const h=new b,g=t=>{const r=t.clientX/innerWidth*2-1,m=-(t.clientY/innerHeight*2-1);c&&(s+=r-d,p+=m-l),d=r,l=m,c=!0},v=()=>{c=!1};addEventListener("pointermove",g,{passive:!0}),addEventListener("pointerdown",v,{passive:!0}),addEventListener("pointerup",v,{passive:!0}),addEventListener("pointercancel",v,{passive:!0});const S=14;function k(t,r={}){t=Math.min(t,.05),r.room&&(i=r.room),o=r.blendW??o;const m=Math.max(0,1-Math.hypot(d,l)*1.5)*i.hover;if(!r.still){const y=i.gain??S;n.x-=p*y*m*(1-.7*o),n.y+=s*y*m}s=p=0,n.multiplyScalar(Math.max(0,1-t*(i.friction??1)));const W=n.y*t-(i.auto*t+Math.max(-30,Math.min(30,r.scrollV??0))*i.scroll)*(r.still?0:1);f.setFromEuler(u.set(n.x*t,W,0)),a.premultiply(f),a.slerp(e,Math.min(1,t*i.ret*(1-.8*o))),a.normalize();const x=1-Math.exp(-t*3);return h.x+=((r.desk?(r.pointerX??0)*i.lean:0)-h.x)*x,h.y+=((r.desk?(r.pointerY??0)*i.lean:0)-h.y)*x,a}return{update:k,quaternion:a,spin:n,lean:h,kick(t,r){n.x+=t,n.y+=r},reset(){a.identity(),n.set(0,0)},dispose(){removeEventListener("pointermove",g),removeEventListener("pointerdown",v),removeEventListener("pointerup",v),removeEventListener("pointercancel",v)}}}const N="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function oe({engineVig:w=.55}={}){let a=1;const e=()=>new L(4,4,{type:F,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),f=new L(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),u=[e(),e(),e()],n=[e(),e(),e()],i=new H(-1,1,1,-1,0,1),o=new O(new z(2,2));o.frustumCulled=!1;const d=new V;d.add(o);const l=new A({uniforms:{tIn:{value:null},uDir:{value:new b},uBright:{value:0}},vertexShader:N,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),c=new A({uniforms:{tMain:{value:f.texture},t1:{value:u[0].texture},t2:{value:u[1].texture},t3:{value:u[2].texture},uAsp:{value:1},uEV:{value:w},uOn:{value:1}},vertexShader:N,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),s=new O(new z(2,2),c);s.frustumCulled=!1,s.renderOrder=1e6,s.visible=!1;let p=[];const h=new b,g=(t,r,m,W,x,y)=>{l.uniforms.tIn.value=r,l.uniforms.uDir.value.set(W,x),l.uniforms.uBright.value=y,o.material=l,t.setRenderTarget(m),t.render(d,i)};function v(t,r,m){_(t,h);const W=Math.max(4,h.x),x=Math.max(4,h.y);(f.width!==W||f.height!==x||u[0].width!==Math.max(2,Math.round(W/4/a)))&&(f.setSize(W,x),[4,8,16].forEach((M,E)=>{u[E].setSize(Math.max(2,Math.round(W/M/a)),Math.max(2,Math.round(x/M/a))),n[E].setSize(u[E].width,u[E].height)})),c.uniforms.uAsp.value=W/x;const y=t.getRenderTarget(),R=t.getClearAlpha();s.visible=!1,t.setRenderTarget(f),t.setClearAlpha(1),t.clear(),t.render(r,m);let B=f.texture;for(let M=0;M<3;M++)g(t,B,n[M],1/n[M].width,0,M===0?1:0),g(t,n[M].texture,u[M],0,1/u[M].height,0),B=u[M].texture;t.setRenderTarget(y),t.setClearAlpha(R)}function S(t){p=t.children.filter(r=>r!==s).map(r=>[r,r.visible]);for(const[r]of p)r.visible=!1;s.visible=!0}function k(){for(const[t,r]of p)t.visible=r;p=[],s.visible=!1}return{quad:s,render:v,only:S,show:k,uniforms:c.uniforms,setPx(t){a=Math.max(1,t)},dispose(){f.dispose(),u.forEach(t=>t.dispose()),n.forEach(t=>t.dispose()),l.dispose(),c.dispose(),o.geometry.dispose(),s.geometry.dispose()}}}function re(w,{font:a='700 300px "Space Grotesk Variable", sans-serif',rtl:e=!1,level:f=1.5,spacing:u="0px"}={}){const n=document.createElement("canvas"),i=n.getContext("2d");i.font=a,i.direction=e?"rtl":"ltr",i.letterSpacing=u,i.textAlign="left",i.textBaseline="alphabetic";const o=i.measureText(w),d=8,l=Math.ceil(o.actualBoundingBoxLeft),c=Math.ceil(o.actualBoundingBoxRight),s=Math.ceil(o.actualBoundingBoxAscent),p=Math.ceil(o.actualBoundingBoxDescent);n.width=l+c+d*2,n.height=s+p+d*2,i.font=a,i.direction=e?"rtl":"ltr",i.letterSpacing=u,i.textAlign="left",i.textBaseline="alphabetic",i.fillStyle="#fff",i.fillText(w,d+l,d+s);const h=new G(n);h.anisotropy=8,h.generateMipmaps=!0,h.minFilter=Z;const g=n.width/n.height,v=(l+c)/n.width,S={uTex:{value:h},uLevel:{value:f},uOn:{value:1}},k=new A({uniforms:S,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),t=new O(new z(1,1/g),k);return{mesh:t,uniforms:S,fit:m=>{t.scale.setScalar(m/v)},aspect:g,glyphShare:v,dispose(){h.dispose(),k.dispose(),t.geometry.dispose()}}}export{K as M,J as W,ee as a,te as b,oe as c,re as d,ae as m,$ as w};
