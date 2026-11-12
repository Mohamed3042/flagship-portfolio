import{s as S,b8 as _,b9 as C,aA as q,aO as H,W as L,y as B,H as F,b as D,Q as E,O as U,M as O,a as z,S as V,z as Z,B as G,k as j}from"./EditionWorld.astro_astro_type_script_index_0_lang.FYnowjil.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const J=`
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
    if (uWdWordAmt > 0.) {   // (world-42) the giant word, ON the tiles: read through the same shifted uv, so shifted tiles carry pieces of it
      vec2 Sp = ((p - uWdMid) / max(uWdPicZ, .01) + uWdMid - uWdScrM.xy) * uWdScrM.zw; Sp.x *= uWdAspS;   // (p before the picture's zoom)
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
  }`;function I(v){let a=v>>>0;return()=>{a=a+1831565813>>>0;let e=a;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function $(v){const a=I(v.seed??38),e={uWdT:{value:0},uWdLay:{value:0},uWdPicA:{value:0},uWdPicB:{value:0},uWdWay:{value:0},uWdE:{value:9},uWdDir:{value:0},uWdBlack:{value:0},uWdBSeed:{value:1},uWdShOn:{value:0},uWdShS0:{value:1},uWdShS1:{value:2},uWdShE:{value:9},uWdMark:{value:2},uWdLevel:{value:1},uWdOn:{value:1},uWdSh:{value:new S},uWdMid:{value:new S(.5,.5)},uWdSpan:{value:new S(.5,.5)},uWdPicZ:{value:1},uWdScr:{value:.47},uWdSideF:{value:0},uWdMarkOn:{value:1},uWdName:{value:v.name},uWdNameZ:{value:v.nameZ},uWdMk:{value:v.mk},uWdMkAsp:{value:v.mkAsp}};Object.assign(e,{uWdRows:{value:v.name},uWdRowsOn:{value:0},uWdRowsZ:{value:.2}});let o=0,l=0,i=1+a(),n=-99,d=1,w=-99,s=1,c=1,u=1.5,m=new S,h=new S,x=-99;e.uWdLay.value=typeof globalThis.__wdLay=="number"?globalThis.__wdLay:Math.floor(Math.random()*4);function f(M,b={}){if(o+=b.still?0:M,e.uWdT.value=o,globalThis.__wdEv&&(globalThis.__wdT=o),o>=i){const W=Math.floor(a()*3);e.uWdPicA.value=e.uWdPicB.value=W,e.uWdWay.value=0,l=W,n=o,i=o+1+a(),globalThis.__wdEv?.push({t:+o.toFixed(3),pic:W,way:0})}e.uWdE.value=o-n,o>=d&&(d+=1,d<o&&(d=o+1),w=o,s=1+Math.floor(a()*5),c+=7,e.uWdBlack.value=l===0?0:a()*.5,e.uWdMark.value=Math.floor(a()*3));const t=o-w;e.uWdBSeed.value=c+Math.min(Math.floor(t/(.3/s)),s-1),e.uWdShOn.value=l===0?0:1,o>=u&&(m.copy(e.uWdSh.value),h.set(a(),0),x=o,e.uWdShS0.value=e.uWdShS1.value,e.uWdShS1.value+=1+Math.floor(a()*9),u=o+(l===0?.2+a()*.5:.1+a()*5));const r=Math.min(1,(o-x)/.8),p=1-(1-r)*(1-r)*(1-r);e.uWdSh.value.copy(m).lerp(h,p),e.uWdShE.value=o-x}return{uniforms:e,update:f,get picture(){return l},get time(){return o}}}const K={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function ee({depthK:v=.245,bevelK:a=.05,stroke:e=.07}={}){const o=_(C.M,C.K,2.15,e);let l=1e9,i=-1e9;for(const c of o)for(const[u]of c)l=Math.min(l,u),i=Math.max(i,u);const n=i-l,d=n*v,w=d*a,s=new q(H(o),{depth:d-2*w,curveSegments:4,bevelEnabled:!0,bevelThickness:w,bevelSize:w*.9,bevelSegments:3});return s.center(),s.computeVertexNormals(),s.userData.mkMark="alche",s.userData.width=n+2*w*.9,s}const Q=`
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
  }`;function P(v,a){const e=v.__sceneSize;return e?a.set(e[0],e[1]):v.getDrawingBufferSize(a)}function te({scale:v=.5,copy:a=0,span:e=4,bend:o=.1,rough:l=.1,boost:i=1.2,env:n=1,glint:d=1,warp:w=4,spot:s=[.5,.64]}={}){const c=new L(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:B,magFilter:B}),u={uCopy:{value:c.texture},uTime:{value:0},uBend:{value:o},uRough:{value:l},uBoost:{value:i},uEnv:{value:n},uGlint:{value:d},uOn:{value:1},uSpan:{value:e},uWarp:{value:w},uSpot:{value:new S(s[0],s[1])},uGrainPx:{value:1}},m=new D({uniforms:u,vertexShader:Q,fragmentShader:X,toneMapped:!1}),h=new S;function x(f,M,b,t){P(f,h);const r=a?Math.round(Math.min(h.x*.87,a*1.5)):Math.max(4,Math.round(h.x*v)),p=a?Math.round(Math.min(h.y*.6,a*1.25)):Math.max(4,Math.round(h.y*v));(c.width!==r||c.height!==p)&&c.setSize(r,p);const W=f.getRenderTarget(),y=t.map(R=>R.visible),k=f.getClearAlpha();t.forEach(R=>{R.visible=!1}),f.setRenderTarget(c),f.setClearAlpha(1),f.clear(),f.render(M,b),f.setRenderTarget(W),f.setClearAlpha(k),t.forEach((R,T)=>{R.visible=y[T]})}return{material:m,uniforms:u,capture:x,target:c,dispose(){c.dispose(),m.dispose()}}}function ae(v=K.open){const a=new E,e=new E,o=new E,l=new j,i=new S;let n={...v},d=0,w=0,s=0,c=!1,u=0,m=0;const h=new S,x=t=>{const r=t.clientX/innerWidth*2-1,p=-(t.clientY/innerHeight*2-1);c&&(u+=r-w,m+=p-s),w=r,s=p,c=!0},f=()=>{c=!1};addEventListener("pointermove",x,{passive:!0}),addEventListener("pointerdown",f,{passive:!0}),addEventListener("pointerup",f,{passive:!0}),addEventListener("pointercancel",f,{passive:!0});const M=14;function b(t,r={}){t=Math.min(t,.05),r.room&&(n=r.room),d=r.blendW??d;const p=Math.max(0,1-Math.hypot(w,s)*1.5)*n.hover;if(!r.still){const k=n.gain??M;i.x-=m*k*p*(1-.7*d),i.y+=u*k*p}u=m=0,i.multiplyScalar(Math.max(0,1-t*(n.friction??1)));const W=i.y*t-(n.auto*t+Math.max(-30,Math.min(30,r.scrollV??0))*n.scroll)*(r.still?0:1);o.setFromEuler(l.set(i.x*t,W,0)),a.premultiply(o),a.slerp(e,Math.min(1,t*n.ret*(1-.8*d))),a.normalize();const y=1-Math.exp(-t*3);return h.x+=((r.desk?(r.pointerX??0)*n.lean:0)-h.x)*y,h.y+=((r.desk?(r.pointerY??0)*n.lean:0)-h.y)*y,a}return{update:b,quaternion:a,spin:i,lean:h,kick(t,r){i.x+=t,i.y+=r},reset(){a.identity(),i.set(0,0)},dispose(){removeEventListener("pointermove",x),removeEventListener("pointerdown",f),removeEventListener("pointerup",f),removeEventListener("pointercancel",f)}}}const N="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function oe({engineVig:v=.55}={}){let a=1;const e=()=>new L(4,4,{type:F,depthBuffer:!1,generateMipmaps:!1,minFilter:B,magFilter:B}),o=new L(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:B,magFilter:B}),l=[e(),e(),e()],i=[e(),e(),e()],n=new U(-1,1,1,-1,0,1),d=new O(new z(2,2));d.frustumCulled=!1;const w=new V;w.add(d);const s=new D({uniforms:{tIn:{value:null},uDir:{value:new S},uBright:{value:0}},vertexShader:N,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),c=new D({uniforms:{tMain:{value:o.texture},t1:{value:l[0].texture},t2:{value:l[1].texture},t3:{value:l[2].texture},uAsp:{value:1},uEV:{value:v},uOn:{value:1}},vertexShader:N,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),u=new O(new z(2,2),c);u.frustumCulled=!1,u.renderOrder=1e6,u.visible=!1;let m=[];const h=new S,x=(t,r,p,W,y,k)=>{s.uniforms.tIn.value=r,s.uniforms.uDir.value.set(W,y),s.uniforms.uBright.value=k,d.material=s,t.setRenderTarget(p),t.render(w,n)};function f(t,r,p){P(t,h);const W=Math.max(4,h.x),y=Math.max(4,h.y);(o.width!==W||o.height!==y||l[0].width!==Math.max(2,Math.round(W/4/a)))&&(o.setSize(W,y),[4,8,16].forEach((g,A)=>{l[A].setSize(Math.max(2,Math.round(W/g/a)),Math.max(2,Math.round(y/g/a))),i[A].setSize(l[A].width,l[A].height)})),c.uniforms.uAsp.value=W/y;const k=t.getRenderTarget(),R=t.getClearAlpha();u.visible=!1,t.setRenderTarget(o),t.setClearAlpha(1),t.clear(),t.render(r,p);let T=o.texture;for(let g=0;g<3;g++)x(t,T,i[g],1/i[g].width,0,g===0?1:0),x(t,i[g].texture,l[g],0,1/l[g].height,0),T=l[g].texture;t.setRenderTarget(k),t.setClearAlpha(R)}function M(t){m=t.children.filter(r=>r!==u).map(r=>[r,r.visible]);for(const[r]of m)r.visible=!1;u.visible=!0}function b(){for(const[t,r]of m)t.visible=r;m=[],u.visible=!1}return{quad:u,render:f,only:M,show:b,uniforms:c.uniforms,setPx(t){a=Math.max(1,t)},dispose(){o.dispose(),l.forEach(t=>t.dispose()),i.forEach(t=>t.dispose()),s.dispose(),c.dispose(),d.geometry.dispose(),u.geometry.dispose()}}}function re(v,{font:a='700 300px "Space Grotesk Variable", sans-serif',rtl:e=!1,level:o=1.5,spacing:l="0px"}={}){const i=document.createElement("canvas"),n=i.getContext("2d");n.font=a,n.direction=e?"rtl":"ltr",n.letterSpacing=l,n.textAlign="left",n.textBaseline="alphabetic";const d=n.measureText(v),w=8,s=Math.ceil(d.actualBoundingBoxLeft),c=Math.ceil(d.actualBoundingBoxRight),u=Math.ceil(d.actualBoundingBoxAscent),m=Math.ceil(d.actualBoundingBoxDescent);i.width=s+c+w*2,i.height=u+m+w*2,n.font=a,n.direction=e?"rtl":"ltr",n.letterSpacing=l,n.textAlign="left",n.textBaseline="alphabetic",n.fillStyle="#fff",n.fillText(v,w+s,w+u);const h=new Z(i);h.anisotropy=8,h.generateMipmaps=!0,h.minFilter=G;const x=i.width/i.height,f=(s+c)/i.width,M={uTex:{value:h},uLevel:{value:o},uOn:{value:1}},b=new D({uniforms:M,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),t=new O(new z(1,1/x),b);return{mesh:t,uniforms:M,fit:p=>{t.scale.setScalar(p/f)},aspect:x,glyphShare:f,dispose(){h.dispose(),b.dispose(),t.geometry.dispose()}}}export{K as M,J as W,ee as a,te as b,oe as c,re as d,ae as m,$ as w};
