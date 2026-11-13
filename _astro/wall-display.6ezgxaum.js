import{s as d}from"./EditionWorld.astro_astro_type_script_index_0_lang.BWtOGfLb.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const F=`
  uniform float uWdT, uWdLay, uWdPicA, uWdPicB, uWdWay, uWdE, uWdDir, uWdBlack, uWdBSeed, uWdShOn, uWdShS0, uWdShS1, uWdShE, uWdMark, uWdLevel, uWdOn, uWdGap;
  uniform vec2 uWdSh, uWdMid, uWdSpan;   // (uWdMid: the screen's middle on the wall; uWdSh.x: the shift's power, 0..1)
  uniform float uWdPicZ, uWdScr, uWdSideF, uWdMarkOn, uWdPicS;   /* (lead-10) the stand-in wall's scale: alche .5; wall-alone.ts takes less on a phone so its picture is as big on the screen as the Open's */   // (world-38c) the picture's zoom (a phone .5: a flat stand-in wall at half size), the screen's width on the wall, the side faces' glow (0 on a phone), the mark layer on
  uniform sampler2D uWdName, uWdMk; uniform float uWdNameZ, uWdMkAsp;
  // (world-42, the Studio only: these live in the Studio's own material, never in the shared uniforms; the Open never sets
  // them, so they stay 0 there and its picture is unchanged) the giant word on the tiles and the works on the tiles
  uniform float uWdWorkOn, uWdCover, uWdF, uWdSideW, uWdAspS, uWdWordAmt;
  uniform vec4 uWdScrM, uWdWordM;   // screen from wall: U = (w.x - x) z, V = (w.y - y) w; the word: centre (x in half-heights), width, its texture's aspect
  uniform sampler2D uWdWorkA, uWdWorkB, uWdWordT;
  vec3 wdFilm(sampler2D s, vec2 S){   // a work cover-fit to the screen (16:9 film), seen through the stand-in uv (a phone: twice as big)
    vec2 uv = vec2(.5 + S.x * uWdAspS / (16. / 9.) * .5 * uWdPicZ, .5 + S.y * .5 * uWdPicZ);
    float one = step(0., uv.y) * step(uv.y, 1.);   // (lead-10, the owner 13 Nov 08:09: "one version but not too zoomed ... fill most of it") ONE copy: on a phone the film is 60 % of the screen's height (uWdPicZ, hero-wall.ts), the LEDs dark above and below it; a desk (cover) fills the screen
    vec3 c = pow(max(texture2D(s, clamp(uv, .001, .999)).rgb, 0.), vec3(1. / 2.2));   // its own display values (the film is decoded on read)
    float lu = dot(c, vec3(.299, .587, .114));
    // (world-43c, the owner 12 Nov: no orange, yellow, sand, gold or brown) warm hues (red-orange through yellow, 10 to 70 degrees,
    // shoulders 15 degrees wide) lose their colour to their own brightness; cool hues are untouched. Before the saturation x2.
    float mx = max(c.r, max(c.g, c.b)), dl = mx - min(c.r, min(c.g, c.b));
    float hue = dl < .0001 ? 120. : 60. * (mx == c.r ? (c.g - c.b) / dl : mx == c.g ? (c.b - c.r) / dl + 2. : (c.r - c.g) / dl + 4.);   // red is -60..60 (magenta below 0)
    float warm = smoothstep(-5., 10., hue) * (1. - smoothstep(70., 85., hue));
    c = mix(c, vec3(lu), warm);
    return clamp(mix(vec3(lu), c, 2.), 0., 1.) * one;   // saturation x2, brightness kept
  }
  float wdH(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float wdN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(wdH(i), wdH(i + vec2(1., 0.)), f.x), mix(wdH(i + vec2(0., 1.)), wdH(i + vec2(1., 1.)), f.x), f.y); }
  float wdF(vec2 p){ return .66 * wdN(p) + .34 * wdN(p * 2.03 + 5.2); }   // two octaves (the frame time on a phone)
  float wdS(float n){ return clamp((n - .5) * 1.7 + .5, 0., 1.); }        // value noise spread to the full 0..1
  // B: the three pictures, from one drifting field at picture position p; the colour channels drift at .1 a second, the
  // channel of the black-and-white bands twenty times slower (world-38c, rule book 02)
  // (world-57) the band channel spread 1.3, not 1.7: measured, alche's bands are ~2.5 small tiles on a phone (ours were ~2, and 1.7
  // clipped 3.5 % of the field flat, where fract(9v) is 0 = solid black blobs); 1.3 gives ~2.6 and never clips
  float wdSlow(vec2 q, float t){ return clamp((wdF(q * .8 + vec2(5.1, 1.3) + t * .005 * vec2(.8, .6)) - .5) * 1.3 + .5, 0., 1.); }
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
  // (lead-10, 13 Nov, the owner's desk screenshots of alche beside ours: "dismantled puzzle") the black-and-white picture lives
  // on the SCREEN, not on the wall: contour bands (9 steps) of a gradient noise warped by a second one at half the frequency,
  // in screen heights, so the desk shows alche's many thin curved stripes (a shifted tile shows a stripe with a jog, "alive")
  // where ours showed 2-3 giant straight wedges (value noise sampled on the wall: the desk sees only .4 of the wall's height)
  vec2 wdGr(vec2 i){ float a = wdH(i) * 6.2832; return vec2(cos(a), sin(a)); }
  float wdGN(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6. - 15.) + 10.);
    return mix(mix(dot(wdGr(i), f), dot(wdGr(i + vec2(1., 0.)), f - vec2(1., 0.)), u.x),
               mix(dot(wdGr(i + vec2(0., 1.)), f - vec2(0., 1.)), dot(wdGr(i + vec2(1., 1.)), f - vec2(1., 1.)), u.x), u.y) * 1.4; }
  float wdBands(vec2 A, float t){   // A: the place on the screen in screen heights (0 = the middle), aspect kept
    // (lead-10, 13 Nov 10:20; the owner 10:00: "full stripes ... not broken ... a real shape of strips like alche") alche's
    // frames show LONG PARALLEL stripes running up and to the right (~55 deg), about ten to a screen height, gently bent,
    // edge to edge, never a loop or an island. Contours of a noise (ours before) close into loops and blobs. So: a straight
    // ramp across the stripes, bent by one slow noise whose slope always stays under the ramp's, so every stripe runs whole
    // across the screen; the stripes drift slowly sideways and the bend breathes.
    // (10:40, measured on alche's desk stills: tight on one side, 0.06-0.1 of a screen height a stripe pair, broad on the
    // other, 0.25-0.3, yet the stripes stay STRAIGHT, a mild fan) the bend changes fast ACROSS the stripes (their spacing)
    // and slowly ALONG them (their direction, at most ~10 deg); its slope across (<= 2.8 x .9 x ~2.8) stays under the
    // ramp's 9.5, so no loops
    // (11:00, alche measured with angle guides on its desk stills and by the Sonnet session: 46-52 deg, the angle varying
    // ~6 deg over the screen; ours drew ~60) 49 deg, the bend along the stripes halved
    vec2 q = vec2(dot(A, vec2(.755, -.656)), dot(A, vec2(.656, .755)));   // x across the stripes, y along them (up-right, 49 deg)
    float bend = wdGN(vec2(q.x * .9, q.y * .12) + vec2(5.3, 1.1) + t * vec2(.006, .01));
    return step(.5, fract(q.x * 9.5 + bend * 2.8 - t * .04));
  }
  // F: the word on its strip (R; repeats sideways) and the MK (alpha), each with a hard edge
  float wdWord(vec2 r){ return (r.y > 0. && r.y < 1.) ? step(.5, texture2D(uWdName, vec2(r.x, r.y)).r) : 0.; }
  float wdMk;   // (world-38f) the mark layer's own light in the colour wdColor returns (a room keeps it out of its own dimming)
  // (world-44, added) word rows: a room may give the mark layer's ways 0 and 1 its own words (uWdRows: up to four words
  // stacked, one a quarter of the texture's height, the word in R; uWdRowsZ = a slot's height / width); 0 keeps his name
  uniform sampler2D uWdRows; uniform float uWdRowsOn, uWdRowsZ;
  float wdRow(vec2 r, float id){ return (r.x > 0. && r.x < 1. && r.y > 0. && r.y < 1.) ? step(.5, texture2D(uWdRows, vec2(r.x, (3. - id + clamp(r.y, .02, .98)) / 4.)).r) : 0.; }
  float wdMkS(vec2 r){ return (r.x > 0. && r.x < 1. && r.y > 0. && r.y < 1.) ? step(.5, texture2D(uWdMk, r).a) : 0.; }
  float wdGl;   // (lead-10) the fine grid's line at this pixel (0..1), set by wdColor; the room lays it on last
  vec2 wdSP;   // (lead-10) the pixel's place on the SCREEN in screen heights (0 = the middle, aspect kept): the room sets it before wdColor
  /** The wall's colour at wall position w (the wall is 1 x 1; a big tile = 1/8), t seconds. */
  vec3 wdColor(vec2 w, float t){
    // A: the tile under w (one layout a visit, uWdLay): a cell of the third cut, cut once more on an even chance
    vec2 c3 = floor(w * 8.);
    float n = mix(8., 16., step(.5, wdH(c3 + uWdLay * 17.31 + .5)));
    vec2 c = floor(w * n), luv = fract(w * n);
    float r = wdH(c * 1.37 + n * 3.1 + uWdLay * 5.1), r2 = wdH(c * .91 + n + 13.7), r3 = wdH(c * 2.03 - n + 4.4);
    float pk = uWdPicA;   // C: a hard cut, the only way the picture changes
    // E: shifted tiles: half of them show the picture from elsewhere, by the power. (lead-10, 13 Nov, read from alche's page:
    // the set is one of FIVE fixed sets, uWdShS1 = 0..4, and ONE chance both picks a tile and sets its move across, so every
    // shifted tile moves the same way across (only up/down is its own): the black shapes glide together, "as if the black
    // thing moves". It was fresh sets and a free direction per tile = a jumble.)
    float sr = wdH(c * 1.71 + uWdShS1 * 9.13 + n);
    float shifted = step(sr, .5) * uWdShOn;
    vec2 p = (c + luv) / n + shifted * vec2(sr - .5, wdH(c * 1.9 + uWdShS1 * 3.3 + 10.) - .5) * uWdSh.x * uWdScr;
    vec2 A = wdSP;   // (sonnet, 13 Nov, the owner 09:50 "almost", boxes on the last small steps) the stripes take NO shift at all: any nudge left small steps (up to ~19 px) where a stripe crosses a tile's edge; a slid tile now shows the same stripe as its neighbours, so the stripes run unbroken (the colour pictures keep their slide)   // (the owner 13 Nov 09:40; 09:50 'almost': .03, no steps), boxes on every slid tile: alche's stripes stay lined up and only nudge) a tenth of the slide   // (lead-10) the sample's place on the screen (alche: the tile's screen place + its shift, in screens)
    p = (p - uWdMid) * uWdPicS + uWdMid;   // (lead-10, rule book 02 B) alche samples a stand-in wall at half size on EVERY screen: the middle half, twice as large (desk too; the works films keep uWdPicZ)
    vec3 col = pk > .5 && pk < 1.5 ? vec3(wdBands(A, t)) : wdPic(pk, p, t);
    // D: the black-out
    col *= 1. - step(wdH(c * .73 + n * 1.9 + uWdBSeed * 3.71), uWdBlack);   // (lead-10) alche: one of FIVE fixed sets (uWdBSeed 0..4), the share as the tick drew it (0 when it fell on the clouds), so a bigger share darkens the same tiles first
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
    float inside = step(uWdGap, min(e.x, e.y));   // (sonnet, 13 Nov, read from alche's page: a tile is shrunk by .003 x 2^depth in TOTAL, so the gap between two tiles is .3 % of the wall = .024 of a small tile on each side in e's units. The default stays the old .048 (twice that) so the Ending is untouched; the Open, the Studio and the Families wall set .024)
    float sideF = (1. - inside) * uWdSideF;                        // the thin side faces (dark on a phone: alche's fluid does not run there)
    float corner = smoothstep(.35, .72, length(luv - .5));
    vec2 dg = fract(w * 414.) - .5;
    float dots = mix(.54, .9, smoothstep(.5, .15, length(dg)));
    float fin = dots * inside * mix(1., .74, corner);
    wdMk = clamp(m, 0., 1.) * .2 * uWdMarkOn * fin * .5 * uWdLevel;
    col = col * fin + col * sideF * .5;
    // (lead-10, 13 Nov, read from alche's page: its Grid "light"/"round") a fine grid of thin light lines, 64 cells across the
    // wall (8 a big tile), laid over EVERYTHING by the room after its dark edge (white at .1): black parts still read as a lit
    // surface, so cut-off stripe pieces never float in a void ("dismantled puzzle")
    wdGl = max(smoothstep(.46, .5, abs(fract(w.x * 64.) - .5)), smoothstep(.46, .5, abs(fract(w.y * 64.) - .5)));
    return col * .5 * uWdLevel;
  }`;function O(a){let o=a>>>0;return()=>{o=o+1831565813>>>0;let e=o;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function T(a){const o=O(a.seed??38),e={uWdT:{value:0},uWdLay:{value:0},uWdPicA:{value:0},uWdPicB:{value:0},uWdWay:{value:0},uWdE:{value:9},uWdDir:{value:0},uWdBlack:{value:0},uWdBSeed:{value:1},uWdShOn:{value:0},uWdShS0:{value:1},uWdShS1:{value:2},uWdShE:{value:9},uWdMark:{value:2},uWdLevel:{value:1},uWdOn:{value:1},uWdSh:{value:new d},uWdMid:{value:new d(.5,.5)},uWdSpan:{value:new d(.5,.5)},uWdPicZ:{value:1},uWdPicS:{value:.5},uWdScr:{value:.47},uWdSideF:{value:0},uWdMarkOn:{value:1},uWdGap:{value:.048},uWdName:{value:a.name},uWdNameZ:{value:a.nameZ},uWdMk:{value:a.mk},uWdMkAsp:{value:a.mkAsp}};Object.assign(e,{uWdRows:{value:a.name},uWdRowsOn:{value:0},uWdRowsZ:{value:.2}});const f=1.2;let t=0,s=0,m=(1+o())*f,p=-99,r=1,v=-99,i=0,W=0,n=0,g=1.5,y=new d,k=new d,l=-99,h=0,x=0,u=0;e.uWdLay.value=typeof globalThis.__wdLay=="number"?globalThis.__wdLay:Math.floor(Math.random()*4);function S(M,A={}){if(t+=A.still?0:M,e.uWdT.value=t,globalThis.__wdEv&&(globalThis.__wdT=t),t>=m){const b=globalThis.__wdPicQA,R=Math.floor(o()*3),w=typeof b=="number"?b:R;e.uWdPicA.value=e.uWdPicB.value=w,e.uWdWay.value=0,s=w,p=t,m=t+(1+o())*f,globalThis.__wdEv?.push({t:+t.toFixed(3),pic:w,way:0})}e.uWdE.value=t-p,t>=r&&(r+=1,r<t&&(r=t+1),e.uWdBlack.value=s===0?0:o()*(s===1?0:.5),i=n,W=o(),v=t,e.uWdMark.value=Math.floor(o()*3)),n=i+(W-i)*Math.min(1,(t-v)/.3),e.uWdBSeed.value=Math.min(4,Math.floor(n*5)),t>=g&&(y.copy(e.uWdSh.value),k.set(o(),0),l=t,h=u,x=o(),e.uWdShOn.value=s===0?0:1,g=t+(s===0?.2+o()*.5:.1+o()*5));const c=Math.min(1,(t-l)/.8),N=1-(1-c)*(1-c)*(1-c);e.uWdSh.value.copy(y).lerp(k,N),u=h+(x-h)*Math.min(1,(t-l)/.3),e.uWdShS1.value=Math.min(4,Math.floor(u*5)),e.uWdShE.value=t-l,globalThis.__wdTk?.push([+t.toFixed(2),e.uWdBSeed.value,+e.uWdBlack.value.toFixed(2),e.uWdShS1.value])}return{uniforms:e,update:S,get picture(){return s},get time(){return t}}}export{F as W,T as w};
