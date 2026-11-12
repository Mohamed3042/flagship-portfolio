import{s as S,b8 as P,b9 as C,aA as H,aO as q,W as E,y as T,H as F,b as L,Q as A,O as U,M as O,a as z,S as V,z as G,B as Z,k as j}from"./EditionWorld.astro_astro_type_script_index_0_lang.BVdr9XtD.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const J=`
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
  }`;function I(v){let o=v>>>0;return()=>{o=o+1831565813>>>0;let e=o;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function $(v){const o=I(v.seed??38),e={uWdT:{value:0},uWdLay:{value:0},uWdPicA:{value:0},uWdPicB:{value:0},uWdWay:{value:0},uWdE:{value:9},uWdDir:{value:0},uWdBlack:{value:0},uWdBSeed:{value:1},uWdShOn:{value:0},uWdShS0:{value:1},uWdShS1:{value:2},uWdShE:{value:9},uWdMark:{value:2},uWdLevel:{value:1},uWdOn:{value:1},uWdSh:{value:new S},uWdMid:{value:new S(.5,.5)},uWdSpan:{value:new S(.5,.5)},uWdPicZ:{value:1},uWdScr:{value:.47},uWdSideF:{value:0},uWdMarkOn:{value:1},uWdName:{value:v.name},uWdNameZ:{value:v.nameZ},uWdMk:{value:v.mk},uWdMkAsp:{value:v.mkAsp}};Object.assign(e,{uWdRows:{value:v.name},uWdRowsOn:{value:0},uWdRowsZ:{value:.2}});const l=typeof globalThis.__wdHold=="number"?globalThis.__wdHold:1.5;let a=0,r=0,i=l*(1+o()),w=-99,f=l,s=-99,u=1,d=1,p=1.5*l,h=new S,g=new S,c=-99;e.uWdLay.value=typeof globalThis.__wdLay=="number"?globalThis.__wdLay:Math.floor(Math.random()*4);function M(b,t={}){if(a+=t.still?0:b,e.uWdT.value=a,globalThis.__wdEv&&(globalThis.__wdT=a),a>=i){const W=Math.floor(o()*3);e.uWdPicA.value=e.uWdPicB.value=W,e.uWdWay.value=0,r=W,w=a,i=a+l*(1+o()),globalThis.__wdEv?.push({t:+a.toFixed(3),pic:W,way:0})}e.uWdE.value=a-w,a>=f&&(f+=l,f<a&&(f=a+l),s=a,u=1+Math.floor(o()*5),d+=7,e.uWdBlack.value=r===0?0:o()*.5,e.uWdMark.value=Math.floor(o()*3));const n=a-s;e.uWdBSeed.value=d+Math.min(Math.floor(n/(.3*l/u)),u-1),e.uWdShOn.value=r===0?0:1,a>=p&&(h.copy(e.uWdSh.value),g.set(o(),0),c=a,e.uWdShS0.value=e.uWdShS1.value,e.uWdShS1.value+=1+Math.floor(o()*9),p=a+l*(r===0?.2+o()*.5:.1+o()*5));const m=Math.min(1,(a-c)/.8),x=1-(1-m)*(1-m)*(1-m);e.uWdSh.value.copy(h).lerp(g,x),e.uWdShE.value=a-c}return{uniforms:e,update:M,get picture(){return r},get time(){return a}}}const K={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function ee({depthK:v=.245,bevelK:o=.05,stroke:e=.07}={}){const l=P(C.M,C.K,2.15,e);let a=1e9,r=-1e9;for(const u of l)for(const[d]of u)a=Math.min(a,d),r=Math.max(r,d);const i=r-a,w=i*v,f=w*o,s=new H(q(l),{depth:w-2*f,curveSegments:4,bevelEnabled:!0,bevelThickness:f,bevelSize:f*.9,bevelSegments:3});return s.center(),s.computeVertexNormals(),s.userData.mkMark="alche",s.userData.width=i+2*f*.9,s}const Q=`
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
  }`;function N(v,o){const e=v.__sceneSize;return e?o.set(e[0],e[1]):v.getDrawingBufferSize(o)}function te({scale:v=.5,copy:o=0,span:e=4,bend:l=.1,rough:a=.1,boost:r=1.2,env:i=1,glint:w=1,warp:f=4,spot:s=[.5,.64]}={}){const u=new E(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),d={uCopy:{value:u.texture},uTime:{value:0},uBend:{value:l},uRough:{value:a},uBoost:{value:r},uEnv:{value:i},uGlint:{value:w},uOn:{value:1},uSpan:{value:e},uWarp:{value:f},uSpot:{value:new S(s[0],s[1])},uGrainPx:{value:1}},p=new L({uniforms:d,vertexShader:Q,fragmentShader:X,toneMapped:!1}),h=new S;function g(c,M,b,t){N(c,h);const n=o?Math.round(Math.min(h.x*.87,o*1.5)):Math.max(4,Math.round(h.x*v)),m=o?Math.round(Math.min(h.y*.6,o*1.25)):Math.max(4,Math.round(h.y*v));(u.width!==n||u.height!==m)&&u.setSize(n,m);const x=c.getRenderTarget(),W=t.map(R=>R.visible),k=c.getClearAlpha();t.forEach(R=>{R.visible=!1}),c.setRenderTarget(u),c.setClearAlpha(1),c.clear(),c.render(M,b),c.setRenderTarget(x),c.setClearAlpha(k),t.forEach((R,B)=>{R.visible=W[B]})}return{material:p,uniforms:d,capture:g,target:u,dispose(){u.dispose(),p.dispose()}}}function ae(v=K.open){const o=new A,e=new A,l=new A,a=new j,r=new S;let i={...v},w=0,f=0,s=0,u=!1,d=0,p=0;const h=new S,g=t=>{const n=t.clientX/innerWidth*2-1,m=-(t.clientY/innerHeight*2-1);u&&(d+=n-f,p+=m-s),f=n,s=m,u=!0},c=()=>{u=!1};addEventListener("pointermove",g,{passive:!0}),addEventListener("pointerdown",c,{passive:!0}),addEventListener("pointerup",c,{passive:!0}),addEventListener("pointercancel",c,{passive:!0});const M=14;function b(t,n={}){t=Math.min(t,.05),n.room&&(i=n.room),w=n.blendW??w;const m=Math.max(0,1-Math.hypot(f,s)*1.5)*i.hover;if(!n.still){const k=i.gain??M;r.x-=p*k*m*(1-.7*w),r.y+=d*k*m}d=p=0,r.multiplyScalar(Math.max(0,1-t*(i.friction??1)));const x=r.y*t-(i.auto*t+Math.max(-30,Math.min(30,n.scrollV??0))*i.scroll)*(n.still?0:1);l.setFromEuler(a.set(r.x*t,x,0)),o.premultiply(l),o.slerp(e,Math.min(1,t*i.ret*(1-.8*w))),o.normalize();const W=1-Math.exp(-t*3);return h.x+=((n.desk?(n.pointerX??0)*i.lean:0)-h.x)*W,h.y+=((n.desk?(n.pointerY??0)*i.lean:0)-h.y)*W,o}return{update:b,quaternion:o,spin:r,lean:h,kick(t,n){r.x+=t,r.y+=n},reset(){o.identity(),r.set(0,0)},dispose(){removeEventListener("pointermove",g),removeEventListener("pointerdown",c),removeEventListener("pointerup",c),removeEventListener("pointercancel",c)}}}const _="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function oe({engineVig:v=.55}={}){let o=1;const e=()=>new E(4,4,{type:F,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),l=new E(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),a=[e(),e(),e()],r=[e(),e(),e()],i=new U(-1,1,1,-1,0,1),w=new O(new z(2,2));w.frustumCulled=!1;const f=new V;f.add(w);const s=new L({uniforms:{tIn:{value:null},uDir:{value:new S},uBright:{value:0}},vertexShader:_,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),u=new L({uniforms:{tMain:{value:l.texture},t1:{value:a[0].texture},t2:{value:a[1].texture},t3:{value:a[2].texture},uAsp:{value:1},uEV:{value:v},uOn:{value:1}},vertexShader:_,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),d=new O(new z(2,2),u);d.frustumCulled=!1,d.renderOrder=1e6,d.visible=!1;let p=[];const h=new S,g=(t,n,m,x,W,k)=>{s.uniforms.tIn.value=n,s.uniforms.uDir.value.set(x,W),s.uniforms.uBright.value=k,w.material=s,t.setRenderTarget(m),t.render(f,i)};function c(t,n,m){N(t,h);const x=Math.max(4,h.x),W=Math.max(4,h.y);(l.width!==x||l.height!==W||a[0].width!==Math.max(2,Math.round(x/4/o)))&&(l.setSize(x,W),[4,8,16].forEach((y,D)=>{a[D].setSize(Math.max(2,Math.round(x/y/o)),Math.max(2,Math.round(W/y/o))),r[D].setSize(a[D].width,a[D].height)})),u.uniforms.uAsp.value=x/W;const k=t.getRenderTarget(),R=t.getClearAlpha();d.visible=!1,t.setRenderTarget(l),t.setClearAlpha(1),t.clear(),t.render(n,m);let B=l.texture;for(let y=0;y<3;y++)g(t,B,r[y],1/r[y].width,0,y===0?1:0),g(t,r[y].texture,a[y],0,1/a[y].height,0),B=a[y].texture;t.setRenderTarget(k),t.setClearAlpha(R)}function M(t){p=t.children.filter(n=>n!==d).map(n=>[n,n.visible]);for(const[n]of p)n.visible=!1;d.visible=!0}function b(){for(const[t,n]of p)t.visible=n;p=[],d.visible=!1}return{quad:d,render:c,only:M,show:b,uniforms:u.uniforms,setPx(t){o=Math.max(1,t)},dispose(){l.dispose(),a.forEach(t=>t.dispose()),r.forEach(t=>t.dispose()),s.dispose(),u.dispose(),w.geometry.dispose(),d.geometry.dispose()}}}function re(v,{font:o='700 300px "Space Grotesk Variable", sans-serif',rtl:e=!1,level:l=1.5,spacing:a="0px"}={}){const r=document.createElement("canvas"),i=r.getContext("2d");i.font=o,i.direction=e?"rtl":"ltr",i.letterSpacing=a,i.textAlign="left",i.textBaseline="alphabetic";const w=i.measureText(v),f=8,s=Math.ceil(w.actualBoundingBoxLeft),u=Math.ceil(w.actualBoundingBoxRight),d=Math.ceil(w.actualBoundingBoxAscent),p=Math.ceil(w.actualBoundingBoxDescent);r.width=s+u+f*2,r.height=d+p+f*2,i.font=o,i.direction=e?"rtl":"ltr",i.letterSpacing=a,i.textAlign="left",i.textBaseline="alphabetic",i.fillStyle="#fff",i.fillText(v,f+s,f+d);const h=new G(r);h.anisotropy=8,h.generateMipmaps=!0,h.minFilter=Z;const g=r.width/r.height,c=(s+u)/r.width,M={uTex:{value:h},uLevel:{value:l},uOn:{value:1}},b=new L({uniforms:M,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),t=new O(new z(1,1/g),b);return{mesh:t,uniforms:M,fit:m=>{t.scale.setScalar(m/c)},aspect:g,glyphShare:c,dispose(){h.dispose(),b.dispose(),t.geometry.dispose()}}}export{K as M,J as W,ee as a,te as b,oe as c,re as d,ae as m,$ as w};
