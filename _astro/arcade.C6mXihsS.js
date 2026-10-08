import{a0 as Xa,a1 as _a,aM as Na,x as Ga,s as ae,t as Za,af as Qa,C as za,b as ja,M as ka,a as Ca,P as Ja,i as et,a6 as v,a2 as $}from"./EditionWorld.astro_astro_type_script_index_0_lang.5PJRRDCZ.js";import{f as at,s as tt,a as R,F as ct,C as ot,l as lt,A as it,M as Ha,S as Ta}from"./plan.DbORFT5Q.js";import{p as ut}from"./text.BoQNVlub.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const qa=(i,r)=>r?{still:i.poster,stillAsp:2/3,clip:i.loop.replace(/loop\.mp4$/,"hero-tall.mp4"),clipAsp:9/16}:{still:i.card,stillAsp:16/9,clip:i.loop,clipAsp:16/9};function st(i,r,n){const f=qa(r,n);let M=null,s=null,U=null;return i.textures.image(f.still).then(y=>{M=y}).catch(()=>{}),{tall:n,frame(y){if(y&&!s){const q=i.textures.video(f.clip);s=q.video,U=q.texture}s&&(y&&s.paused&&s.play().catch(()=>{}),!y&&!s.paused&&s.pause());const A=!!(y&&s&&s.readyState>=2);return A?{tex:U,asp:f.clipAsp,live:A}:{tex:M,asp:f.stillAsp,live:!1}},pause(){s&&!s.paused&&s.pause()}}}async function rt(i,r){const n=document.createElement("canvas");n.width=1024,n.height=576;const f=n.getContext("2d");f.fillStyle="#10081e",f.fillRect(0,0,n.width,n.height),(await Promise.all(r.map(U=>i.textures.image(U.card).catch(()=>null)))).forEach((U,y)=>{U&&f.drawImage(U.image,y%4*256,Math.floor(y/4)*144,256,144)});const s=new Xa(n);return s.colorSpace=_a,s.generateMipmaps=!0,s.minFilter=Na,s.anisotropy=4,s}function oa(i,r){const n=i/r<.9,f=n?2.4:Math.max(2.4,r/240),M=Math.round(i/f),s=Math.round(r/f);if(n){const V=Math.floor((M-12-9)/4),W=Math.round(V*9/16);return{S:f,VW:M,VH:s,portrait:n,vid:[0,0,M,s],gx:6,gy:26+3*(W+3)+W,cw:V,ch:W,gap:3,titleY:s-42,barX:8,barW:M-16,barY:[132,123],groundY:70,fk:.62,titleScale:1}}const U=Math.min(Math.round(M*.53),Math.round(s*.56*16/9)),y=Math.round(U*9/16),A=s-40,q=4,e=Math.min(190,Math.round(M*.37)),b=Math.floor((e-q*3)/4),L=Math.round(b*9/16);return{S:f,VW:M,VH:s,portrait:n,vid:[12,A-y,12+U,A],gx:M-12-e,gy:A,cw:b,ch:L,gap:q,titleY:s-28,barX:M-12-e,barW:e,barY:[A-4*(L+q)-16,A-4*(L+q)-30],groundY:40,fk:1,titleScale:2}}const Wa=32,vt="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",H="S(vec3(.04, .015, .09))",nt=`
uniform vec2 uRes; uniform float uT, uMode, uDim, uShift, uA; varying vec2 vUv;
vec3 roster(vec2 p){
  float t = p.y / uRes.y;
  vec3 c = mix(S(vec3(.2, .06, .38)), S(vec3(.04, .015, .14)), smoothstep(0., 1., t));
  c *= 1. + .12 * step(.5, fract((p.x + p.y) / 30. - uT * .06));
  float d = abs((p.x + p.y * .6) / (uRes.x + uRes.y * .6) - fract(uT * .11) * 1.5 + .25);
  c += S(vec3(.5, .2, .9)) * .14 * smoothstep(.06, .0, d);
  float h = h12(floor(p / 6.)); c += vec3(step(.986, h) * (.5 + .5 * sin(uT * 3. + h * 90.)) * .5);
  return c;
}
vec3 vsCol(vec2 p){
  vec2 u = p / uRes; float edge = u.x - .5 + (u.y - .5) * .28, side = step(0., edge);
  vec3 a = mix(S(vec3(.06, .4, .62)), S(vec3(.0, .08, .3)), u.y), b = mix(S(vec3(.8, .1, .32)), S(vec3(.25, .0, .12)), u.y);
  vec3 c = mix(a, b, side);
  c *= 1. + .2 * step(.72, fract((p.x * .22 + p.y) / 16. + uT * (side > .5 ? -.7 : .7)));
  return c + vec3(1., .9, .6) * smoothstep(.014, .0, abs(edge)) * 1.4;
}
vec3 stageCol(vec2 p){
  float H = uRes.y, W = uRes.x, yh = H * .40, px = p.x + uShift;
  vec3 c;
  if (p.y >= yh) {
    float t = (p.y - yh) / (H - yh), tq = floor(t * 9.) / 9.;
    c = tq < .3 ? mix(S(vec3(1., .55, .12)), S(vec3(.95, .15, .45)), tq / .3) : mix(S(vec3(.95, .15, .45)), S(vec3(.1, .03, .3)), clamp((tq - .3) / .5, 0., 1.));
    vec2 sc = vec2(W * .5, yh + H * .17); float r = H * .15, k = clamp((sc.y + r - p.y) / (2. * r), 0., 1.);
    if (length(p - sc) < r && !(k > .2 && fract(p.y / 7.) < k * .6)) c = mix(S(vec3(1., .9, .3)), S(vec3(1., .2, .5)), k);
    for (int l = 0; l < 2; l++) {
      float fl = float(l), cwid = l == 0 ? 11. : 16., sx = px * (l == 0 ? .6 : 1.), bx = floor(sx / cwid);
      float hh = (l == 0 ? 14. : 22.) + h12(vec2(bx, 17. * fl + 3.)) * (l == 0 ? 34. : 46.);
      if (p.y - yh < hh) {
        c = l == 0 ? S(vec3(.2, .06, .38)) : S(vec3(.07, .025, .17));
        vec2 w = floor(vec2(sx / cwid * 3., (p.y - yh) / 5.));
        float on = step(.72, h12(w + fl * 9. + floor(uT * .6 * step(.93, h12(w))))), inWin = step(.28, fract(sx / cwid * 3.)) * step(.3, fract((p.y - yh) / 5.));
        c = mix(c, h12(w + 4.) < .5 ? S(vec3(.2, .9, .95)) : S(vec3(1., .82, .3)), on * inWin * (l == 0 ? .5 : 1.));
      }
    }
  } else {
    float dy = yh - p.y;
    c = mix(S(vec3(.16, .04, .36)), S(vec3(.05, .01, .15)), clamp(dy / yh, 0., 1.));
    float lx = step(fract((px - W * .5) / (dy + 5.) * 7.), .07), lz = step(fract(log(dy + 2.) * 5.2), .1);
    c = mix(c, S(vec3(.95, .2, .6)), lx * .7); c = mix(c, S(vec3(.2, .85, .95)), lz * .55);
    if (dy < 2.) c = S(vec3(1., .6, .85));
  }
  return c;
}
void main(){
  vec2 p = floor(vUv * uRes);
  vec3 c = uMode < .5 ? roster(p) : uMode < 1.5 ? vsCol(p) : stageCol(p);
  gl_FragColor = vec4(c * uDim, uA);
}`,Aa=`
uniform sampler2D tAtlas; uniform vec2 uCell, uSize; uniform float uSel, uMk, uT; uniform vec3 uAccent; varying vec2 vUv;
${Ha}
void main(){
  vec2 pc = floor(vUv * uSize), uv = (pc + .5) / uSize; vec3 col;
  if (uMk > .5) {
    col = mix(S(vec3(.14, .05, .32)), S(vec3(.34, .08, .46)), uv.y);
    float k = uSize.y * .33, d = sdMK((pc + .5 - uSize * .5) / k) * k;
    if (d < 1.2) col = ${H};
    if (d < 0.) col = mix(S(vec3(1., .84, .28)), S(vec3(1., .5, .12)), smoothstep(1., 0., uv.y + .15));
  } else {
    col = texture2D(tAtlas, vec2((uCell.x + uv.x) / 4., 1. - (uCell.y + 1. - uv.y) / 4.)).rgb;
    float l = luma(col);   // the card, pulled toward its film's colour: a portrait that reads at a glance
    col = mix(col, mix(S(vec3(.1, .05, .22)), uAccent, clamp(l * 1.8, 0., 1.)) + col * .3, .55);
    col = min(col * 1.55, vec3(1.));
    col = floor(col * 6. + bayer(pc) * .85) / 6.;
  }
  col *= mix(.6, 1.15, uSel);
  float b = min(min(pc.x, uSize.x - 1. - pc.x), min(pc.y, uSize.y - 1. - pc.y));
  if (b < .5) col = mix(${H}, S(vec3(1., .85, .25)), uSel);
  gl_FragColor = vec4(col, 1.);
}`,ft=`
uniform vec2 uSize; uniform float uT; varying vec2 vUv;
void main(){
  vec2 pc = floor(vUv * uSize); float b = min(min(pc.x, uSize.x - 1. - pc.x), min(pc.y, uSize.y - 1. - pc.y));
  if (b > 1.5) discard;
  gl_FragColor = vec4(mix(S(vec3(1., .85, .25)), S(vec3(1.)), step(.5, fract(uT * 4.))), 1.);
}`,pt=`
uniform vec2 uSize; varying vec2 vUv;
void main(){
  vec2 pc = floor(vUv * uSize); float b = min(min(pc.x, uSize.x - 1. - pc.x), min(pc.y, uSize.y - 1. - pc.y));
  if (b >= 6.) discard;
  vec3 c = ${H};
  if (b >= 1. && b < 3.) c = S(vec3(1., .82, .3)); else if (b >= 3. && b < 4.) c = S(vec3(.9, .2, .55));
  gl_FragColor = vec4(c, 1.);
}`,Pa=`
uniform vec2 uSize; uniform float uFill, uN; varying vec2 vUv;
void main(){
  float seg = floor(vUv.x * uN);
  if (fract(vUv.x * uN) > .78) discard;
  float on = step((seg + .5) / uN, uFill);
  vec3 c = mix(S(vec3(.16, .08, .3)), mix(S(vec3(.2, .9, .95)), S(vec3(1., .3, .65)), seg / uN), on);
  if (floor(vUv.y * uSize.y) < 1.) c *= .6;
  gl_FragColor = vec4(c, 1.);
}`,Ra=`
uniform vec2 uSize; uniform float uFill, uLag, uDir, uFlash; varying vec2 vUv;
void main(){
  vec2 pc = floor(vUv * uSize); float x = uDir > 0. ? vUv.x : 1. - vUv.x;
  float b = min(min(pc.x, uSize.x - 1. - pc.x), min(pc.y, uSize.y - 1. - pc.y));
  vec3 c = S(vec3(.12, .03, .1));
  if (x < uLag) c = S(vec3(1., .95, .8));
  if (x < uFill) c = mix(S(vec3(1., .2, .2)), S(vec3(1., .85, .25)), smoothstep(0., .55, x)) * (pc.y > uSize.y * .55 ? 1.15 : .9);
  if (b < 1.) c = ${H};
  gl_FragColor = vec4(mix(c, S(vec3(1.)), uFlash * step(1., b)), 1.);
}`,ht=`
uniform vec2 uSize; uniform float uK, uFace, uCrouch, uPunch, uHit, uCharge, uT, uFlash, uStep; varying vec2 vUv;
${Ha}
void main(){
  vec2 p0 = (floor(vUv * uSize) + .5 - vec2(uSize.x * .5, 0.)) / uK, p = p0; p.x *= uFace;
  float bob = sin(uT * 7.) * (1. - uCrouch), lean = .1 * uPunch - .22 * uHit - .1 * uCharge, legs = 15. - uCrouch * 6.;
  vec2 bc = vec2(0., legs + 13. + bob);
  float k = 12.5;
  vec2 q = rot(-lean * uFace) * (vec2(p0.x, p.y) - bc); q.y /= (1. - .22 * uCrouch);   // (the letters are not mirrored when he faces left)
  float d = sdMK(q / k) * k;
  vec2 fF = bc + mix(vec2(29. + 31. * uPunch, -3. + 4. * uPunch), vec2(24., 5.), uCharge), fB = bc + mix(vec2(-27., -7. + 3. * sin(uT * 7. + 1.)), vec2(18., 3.), uCharge);
  float dA = min(sdSeg(p, bc + vec2(21., -1.), fF) - 2.4, sdSeg(p, bc + vec2(-21., -1.), fB) - 2.4), dG = min(length(p - fF) - 4.6, length(p - fB) - 4.6);
  float st = sin(uT * 7.) * uStep, hipY = bc.y - 12.5 * (1. - .22 * uCrouch);
  vec2 f1 = vec2(-11. + st * 7., 0.), f2 = vec2(11. - st * 7., 0.);
  float dL = min(sdSeg(p, vec2(-10., hipY), f1) - 2.7, sdSeg(p, vec2(10., hipY), f2) - 2.7);
  float dS = min(sdBox(p - f1 - vec2(2., 2.), vec2(5., 2.5)), sdBox(p - f2 - vec2(2., 2.), vec2(5., 2.5)));
  vec2 e1 = q - vec2(-1.19, .74) * k, e2 = q - vec2(-.77, .74) * k;
  float dE = min(sdBox(e1, vec2(1.3, 1.8)), sdBox(e2, vec2(1.3, 1.8))), dP = min(sdBox(e1 - vec2(.7, -.3), vec2(.6, 1.1)), sdBox(e2 - vec2(.7, -.3), vec2(.6, 1.1)));
  float dd = min(min(d, dA), min(min(dG, dL), dS));
  vec3 col = vec3(0.); float a = 0.;
  if (dd < 1.3) {col = ${H}; a = 1.;}
  if (dL < 0.) {col = S(vec3(.18, .2, .55)); a = 1.;}
  if (dS < 0.) {col = S(vec3(.95, .2, .35)); a = 1.;}
  if (dA < 0.) {col = S(vec3(.9, .45, .1)); a = 1.;}
  if (d < 0.) {
    col = mix(S(vec3(1., .84, .28)), S(vec3(1., .46, .1)), smoothstep(1., -1., q.y / k * .6));
    if (d > -1.4 && q.x + q.y * .7 < 0.) col = S(vec3(1., .97, .7));
    a = 1.;
  }
  if (dG < 0.) {col = S(vec3(.25, .9, .95)); a = 1.;}
  if (dE < 0.) {col = dP < 0. ? ${H} : S(vec3(1.)); a = 1.;}
  col = mix(col, S(vec3(1.)), uFlash);
  if (a < .5) discard;
  gl_FragColor = vec4(col, 1.);
}`,mt=`
uniform vec2 uSize; uniform float uK, uFace, uLunge, uHit, uT, uFlash, uSpin, uStep; varying vec2 vUv;
void main(){
  vec2 p = (floor(vUv * uSize) + .5 - vec2(uSize.x * .5, 0.)) / uK; p.x *= uFace;
  float bob = sin(uT * 6. + 1.) * 1.2;
  vec2 bc = vec2(-8. * uHit + 6. * uLunge, 13. + 22. + bob);
  p = bc + rot(uSpin) * (p - bc);
  vec2 r = p - bc;
  float dB = length(r) - 21., dF = length(r) - 16.;
  float dBell = min(length(r - vec2(-15., 19.)) - 7.5, length(r - vec2(15., 19.)) - 7.5), dHam = min(sdSeg(r, vec2(0., 20.), vec2(0., 29.)) - 1.5, length(r - vec2(0., 30.)) - 2.6);
  vec2 gF = bc + vec2(30. + 26. * uLunge, -4. + 2. * uLunge), gB = bc + vec2(-28., -8.);
  float dArm = min(sdSeg(p, bc + vec2(19., -4.), gF) - 2.4, sdSeg(p, bc + vec2(-19., -4.), gB) - 2.4), dGl = min(length(p - gF) - 6.4, length(p - gB) - 6.4);
  float st = sin(uT * 6.) * uStep; vec2 f1 = vec2(bc.x - 8. + st * 6. + 5. * uLunge, 0.), f2 = vec2(bc.x + 8. - st * 6. + 9. * uLunge, 0.);
  float hip = bc.y - 19.;
  float dL = min(sdSeg(p, vec2(bc.x - 8., hip), f1) - 2.5, sdSeg(p, vec2(bc.x + 8., hip), f2) - 2.5), dBt = min(sdBox(p - f1 - vec2(3., 2.5), vec2(6., 2.8)), sdBox(p - f2 - vec2(3., 2.5), vec2(6., 2.8)));
  vec2 e1 = r - vec2(-6.5, 4.), e2 = r - vec2(6.5, 4.);
  float dEy = min(sdBox(e1, vec2(3.2, 3.4)), sdBox(e2, vec2(3.2, 3.4)));
  float brow = min(sdSeg(r, vec2(-10.5, 11.), vec2(-2.5, 7.2)), sdSeg(r, vec2(10.5, 11.), vec2(2.5, 7.2))) - 1.3;
  float mo = min(min(sdSeg(r, vec2(-8., -7.), vec2(-4., -11.)), sdSeg(r, vec2(-4., -11.), vec2(0., -7.))), min(sdSeg(r, vec2(0., -7.), vec2(4., -11.)), sdSeg(r, vec2(4., -11.), vec2(8., -7.)))) - 1.1;
  float ang = atan(r.y, r.x), tk = abs(fract(ang * 12. / 6.28318 + .5) - .5) * length(r), tick = step(tk, 1.1) * step(abs(length(r) - 13.6), 1.3);
  float dd = min(min(dB, min(dBell, dHam)), min(min(dArm, dGl), min(dL, dBt)));
  vec3 col = vec3(0.); float a = 0.;
  if (dd < 1.3) {col = ${H}; a = 1.;}
  if (dL < 0.) {col = S(vec3(.22, .1, .4)); a = 1.;}
  if (dBt < 0.) {col = S(vec3(.12, .06, .22)); a = 1.;}
  if (dArm < 0.) {col = S(vec3(.8, .15, .2)); a = 1.;}
  if (dBell < 0. || dHam < 0.) {col = S(vec3(1., .8, .2)); a = 1.;}
  if (dB < 0.) {col = mix(S(vec3(.95, .2, .24)), S(vec3(.6, .06, .16)), smoothstep(-6., 20., -r.y + r.x * .3)); if (dB > -1.5 && r.x - r.y * .5 < 0.) col = S(vec3(1., .5, .45)); a = 1.;}
  if (dF < 0.) {col = S(vec3(1., .94, .78)); a = 1.; if (tick > .5) col = ${H};}
  if (dEy < 0.) {col = S(vec3(1.)); if (abs(e1.x - 1.2) < 1.4 || abs(e2.x - 1.2) < 1.4) col = ${H};}
  if (brow < 0. || mo < 0.) col = ${H};
  if (dGl < 0.) {col = S(vec3(.95, .2, .25)); a = 1.; if (length(p - gF) < 2.4 && dGl < -2.) col = S(vec3(1., .6, .55));}
  col = mix(col, S(vec3(1.)), uFlash);
  if (a < .5) discard;
  gl_FragColor = vec4(col, 1.);
}`,dt=`
uniform float uR, uT, uTrail, uDir; varying vec2 vUv;
void main(){
  vec2 p = floor(vUv * 96.) + .5 - 48.; p.x *= uDir;
  float d = length(p) - uR, ck = mod(floor(p.x) + floor(p.y), 2.), tl = -p.x / max(uTrail, 1.);
  vec3 col = vec3(0.); float a = 0.;
  if (p.x < 0. && tl < 1. && abs(p.y) < uR * (1. - tl) * .9 && h12(floor(p * .5) + floor(uT * 20.)) > tl * .9) {col = mix(S(vec3(.2, .9, .95)), S(vec3(1., .25, .6)), tl); a = 1.;}
  if (d < 0.) {
    col = S(vec3(1., .22, .6)); a = 1.;
    if (d < -uR * .25 || (d < -uR * .12 && ck < .5)) col = S(vec3(.2, .9, .95));
    if (d < -uR * .55) col = S(vec3(1.));
  }
  if (a < .5) discard;
  gl_FragColor = vec4(col, 1.);
}`,xt=`
uniform float uS; varying vec2 vUv;
void main(){
  vec2 p = floor(vUv * 128.) + .5 - 64.;
  float r = length(p), a = atan(p.y, p.x), sp = pow(abs(cos(a * 4.)), 3.), sp2 = pow(abs(cos(a * 2. + .4)), 6.);
  vec3 col = vec3(0.); float al = 0.;
  if (r < uS * (.5 + .7 * sp2)) {col = S(vec3(1., .2, .5)); al = 1.;}
  if (r < uS * (.36 + .55 * sp)) {col = S(vec3(1., .85, .25)); al = 1.;}
  if (r < uS * (.2 + .3 * sp)) {col = S(vec3(1.)); al = 1.;}
  if (al < .5) discard;
  gl_FragColor = vec4(col, 1.);
}`,gt=`
uniform sampler2D uVidTex; uniform vec4 uVidRect; uniform float uVid, uVidAsp, uVidPix, uVidFlash, uVidOver, uQ, uM, uScrim, uZoom, uZc, uInv, uPout, uFx; uniform vec2 uZoomC, uShake;
void main(){
  vec2 uv = vUv, zuv = mix(vec2(.5), uZoomC, uZc) + (uv - .5) / uZoom + uShake;
  vec2 dca = (zuv - .5) * uCa; vec4 w0 = texture2D(tWorld, zuv); vec4 w = vec4(texture2D(tWorld, zuv - dca).r, w0.g, texture2D(tWorld, zuv + dca).b, w0.a);   // (the engine's colour parting, undone)
  vec3 c = uQ > .001 ? mosaic(tWorld, zuv, uAsp, uWorldRes.y, uQ, uM) : w.rgb;
  if (uVid > .001) {
    vec2 rs = uVidRect.zw - uVidRect.xy, q = (uv - uVidRect.xy) / rs;
    if (q.x >= 0. && q.x <= 1. && q.y >= 0. && q.y <= 1.) {
      float wa = rs.x * uRes.x / (rs.y * uRes.y);
      vec2 sc = wa > uVidAsp ? vec2(1., uVidAsp / wa) : vec2(wa / uVidAsp, 1.), vq = (q - .5) * sc + .5;
      vec3 v;
      if (uVidPix > .002) {
        vec2 n = vec2(wa, 1.) * mix(140., 6., uVidPix), cq = (floor(vq * n) + .5) / n, o = .25 / n;
        v = (texture2D(uVidTex, cq).rgb + texture2D(uVidTex, cq + o).rgb + texture2D(uVidTex, cq - o).rgb + texture2D(uVidTex, cq + vec2(o.x, -o.y)).rgb + texture2D(uVidTex, cq + vec2(-o.x, o.y)).rgb) / 5.;
        float lv = mix(24., 4., uVidPix); v = floor(v * lv + bayer(gl_FragCoord.xy) * .8) / lv;
      } else v = texture2D(uVidTex, vq).rgb;
      v = mix(v, vec3(1.), uVidFlash);
      v *= .955 + .045 * cos(gl_FragCoord.y / uRes.y * uCss.y * 2.094);
      v *= 1. - uScrim * (smoothstep(.64, 0., q.y) * .9 + smoothstep(.82, 1., q.y) * .55);
      vec2 pxq = min(q, 1. - q) * rs * uRes; float e = min(pxq.x, pxq.y);
      v = mix(v, S(vec3(1., .85, .3)), smoothstep(2.5, .5, e) * .9 * (1. - uVidOver));
      c = mix(c, mix(v, c, w.a * uVidOver), uVid);
    }
  }
  float fx = 1. - clamp(uM, 0., 1.);   // (the pixel layer's own scanlines and vignette are not part of the pivot it opens in)
  c *= mix(1., .93 + .07 * cos(zuv.y * uWorldRes.y * 6.28318), fx);
  c = mix(c, vec3(1. - step(.22, luma(c))), uInv);
  c *= mix(1., smoothstep(1.45, .4, length((vUv - .5) * vec2(uAsp, 1.))), .5 * uFx * fx);
  c = mix(c, pivot2(uv, uAsp, 0.), uPout);
  gl_FragColor = vec4(finish(c), 1.);
}`;async function Vt(i){await at([`800 12px ${ct.ar}`]);const r=i.lang==="ar",n=i.films,f=n.length,M=i.viewport.portrait,s=new Ga(new Uint8Array([0,0,0,255]),1,1);s.needsUpdate=!0;const U=await rt(i,n),y=n.map(t=>st(i,t,M)),A=Math.max(...n.map(t=>t.chapters)),q=Math.max(...n.map(t=>t.duration));let e=oa(i.viewport.width,i.viewport.height);const b=tt(i,{nearest:!0,mips:!0,msaa:!1,size:(t,o)=>{const l=oa(t,o);return[l.VW,l.VH]},uniforms:{uVidTex:{value:s},uVidRect:{value:new Za(0,0,1,1)},uVid:{value:0},uVidAsp:{value:16/9},uVidPix:{value:0},uVidFlash:{value:0},uVidOver:{value:0},uQ:{value:1},uM:{value:1},uScrim:{value:0},uZoom:{value:1},uZc:{value:0},uInv:{value:0},uPout:{value:0},uFx:{value:1},uZoomC:{value:new ae(.5,.5)},uShake:{value:new ae}},frag:gt}),L=new Qa(0,e.VW,e.VH,0,-100,100),te=b.world;function V(t,o,l,m,c,g=!1){const a=new et({vertexShader:vt,fragmentShader:ot+t,uniforms:{uSize:{value:new ae(o,l)},uT:{value:0},...m},depthTest:!1,depthWrite:!1,transparent:g}),p=new ka(new Ca(1,1),a);p.scale.set(o,l,1),p.position.z=c,p.renderOrder=c,te.add(p);const S={mesh:p,mat:a,U:a.uniforms,w:o,h:l,size(h,x){h=Math.round(h),x=Math.round(x),S.w=h,S.h=x,p.scale.set(h,x,1),a.uniforms.uSize.value.set(h,x)},put(h,x){p.position.x=Math.round(h-S.w/2)+S.w/2,p.position.y=Math.round(x-S.h/2)+S.h/2}};return S}const W=V(nt,1,1,{uRes:{value:new ae},uMode:{value:0},uDim:{value:1},uShift:{value:0},uA:{value:1}},0),La=n.map((t,o)=>V(Aa,40,22,{tAtlas:{value:U},uCell:{value:new ae(o%4,Math.floor(o/4))},uSel:{value:0},uMk:{value:0},uAccent:{value:new za(n[o].accent)}},2)),Da=V(Aa,40,22,{tAtlas:{value:U},uCell:{value:new ae},uSel:{value:0},uMk:{value:1},uAccent:{value:new za("#ffd23f")}},2),la=[...La,Da],ge=V(ft,40,22,{},3,!0),Ce=V(pt,100,60,{},1,!0),Te=V(Pa,80,5,{uFill:{value:0},uN:{value:12}},3),We=V(Pa,80,5,{uFill:{value:0},uN:{value:12}},3),G=V(Ra,100,9,{uFill:{value:1},uLag:{value:1},uDir:{value:1},uFlash:{value:0}},3),Z=V(Ra,100,9,{uFill:{value:1},uLag:{value:1},uDir:{value:-1},uFlash:{value:0}},3),w=V(ht,150,110,{uK:{value:1},uFace:{value:1},uCrouch:{value:0},uPunch:{value:0},uHit:{value:0},uCharge:{value:0},uFlash:{value:0},uStep:{value:0}},4,!0),F=V(mt,170,130,{uK:{value:1},uFace:{value:-1},uLunge:{value:0},uHit:{value:0},uFlash:{value:0},uSpin:{value:0},uStep:{value:0}},4,!0),Q=V(dt,96,96,{uR:{value:8},uTrail:{value:40},uDir:{value:1}},5,!0),ce=V(xt,128,128,{uS:{value:0}},6,!0),ia=new ja({color:16777215,transparent:!0,opacity:0,depthTest:!1,depthWrite:!1,toneMapped:!1}),oe=new ka(new Ca(1,1),ia);oe.renderOrder=9,oe.position.z=9,te.add(oe);const k=(t,o,l=7)=>{const m=ut(t,o);return m.mesh.renderOrder=l,m.mesh.position.z=l,te.add(m.mesh),m},Se=(t,o,l)=>(t&&(te.remove(t.mesh),t.dispose()),k(o,l)),le=k(R.select[i.lang],{scale:e.titleScale,color:"#ffd23f",outline:"#12062a",shadow:"#ff2d95"}),ua=k(R.chapters[i.lang],{color:"#c7b4ff",outline:"#12062a"}),sa=k(R.runtime[i.lang],{color:"#c7b4ff",outline:"#12062a"}),Ae=k(R.vs[i.lang],{scale:6,color:"#ffffff",outline:"#12062a",shadow:"#ff2d95"}),ra=k("MK",{scale:3,color:"#ffd23f",outline:"#12062a"}),va=k(R.deadline[i.lang],{scale:2,color:"#ff6b6b",outline:"#12062a"}),Pe=k(R.round[i.lang],{scale:3,color:"#ffd23f",outline:"#12062a",shadow:"#ff2d95"}),Re=k(R.fight[i.lang],{scale:5,color:"#ff4a3a",outline:"#12062a",shadow:"#ffd23f"}),He=k(R.ko[i.lang],{scale:r?3:6,color:"#ffe14a",outline:"#7a0010",shadow:"#12062a"}),E=k(R.special[i.lang],{scale:3,color:"#2de2e6",outline:"#12062a",shadow:"#ff2d95"}),qe=k("MK",{color:"#ffd23f",outline:"#12062a"}),Le=k(e.portrait&&!r?"DEADLINE":R.deadline[i.lang],{color:"#ff8a8a",outline:"#12062a"});let K=null,ie=null,ue=null,O=null,na=-1;const Ba=t=>`${String(Math.floor(t/60)).padStart(2,"0")}:${String(Math.floor(t%60)).padStart(2,"0")}`,z=t=>r?e.VW-t:t;let fa="";const pa=t=>({x:e.gx+t%4*(e.cw+e.gap)+e.cw/2,y:e.gy-Math.floor(t/4)*(e.ch+e.gap)-e.ch/2});function De(){const t=i.viewport,o=`${t.width}x${t.height}`;if(o===fa)return;fa=o,e=oa(t.width,t.height),L.right=e.VW,L.top=e.VH,L.updateProjectionMatrix(),W.size(e.VW,e.VH),W.put(e.VW/2,e.VH/2),W.U.uRes.value.set(e.VW,e.VH),oe.scale.set(e.VW,e.VH,1),oe.position.set(e.VW/2,e.VH/2,9),la.forEach((D,J)=>{D.size(e.cw,e.ch);const ee=pa(J);D.put(z(ee.x),ee.y)}),ge.size(e.cw+6,e.ch+6);const[l,m,c,g]=e.vid;Ce.size(c-l+12,g-m+12),Ce.put(z((l+c)/2),(m+g)/2);const a=b.U;a.uVidRect.value.set(r?1-c/e.VW:l/e.VW,m/e.VH,r?1-l/e.VW:c/e.VW,g/e.VH),a.uScrim.value=e.portrait?1:0,a.uVidOver.value=e.portrait?1:0;const p=document.documentElement.style;e.portrait?(p.removeProperty("--cx-left"),p.removeProperty("--cx-w"),p.setProperty("--cx-bot","336px")):(p.setProperty("--cx-left",`${Math.round(12*e.S)}px`),p.setProperty("--cx-w",`${Math.round(Math.max(420,Math.min((c-l)*e.S,t.width/2-12*e.S-105)))}px`),p.setProperty("--cx-bot","78px"));const S=50,h=Math.max(36,e.barW-S-Wa-8);for(const[D,J]of[[Te,e.barY[0]],[We,e.barY[1]]])D.size(h,5),D.put(z(e.barX+S+4+h/2),J);ua.set(z(e.barX+S/2),e.barY[0]+1),sa.set(z(e.barX+S/2),e.barY[1]+1),le.set(e.portrait?e.VW/2:z(12+le.w/2),e.titleY);const x=Math.round(e.VW/2-28),I=e.VH-(e.portrait?46:44);G.size(x,9),Z.size(x,9),G.put(z(14+x/2),I),Z.put(z(e.VW-14-x/2),I),G.U.uDir.value=r?-1:1,Z.U.uDir.value=r?1:-1,qe.set(z(14+qe.w/2),I-9),Le.set(z(e.VW-14-Le.w/2),I-9)}let C=0,Me=0,se=0,re=0,ve=0,ha=!1,Be=0,ma=-1,Ye=0,$e=0,Ee=1,Ke=1,ye=1,be=1,Oe=!1;function Ya(t){if(t===ma)return;ma=t;const o=n[t];if(o){K=Se(K,`${String(t+1).padStart(2,"0")} ${o.name}`.toUpperCase(),{color:"#ffffff",outline:"#12062a"}),ie=Se(ie,`${o.chapters}`,{color:"#ffd23f",outline:"#12062a"}),ue=Se(ue,Ba(o.duration),{color:"#ffd23f",outline:"#12062a"});for(const l of[t+1,t+2])n[l]&&i.textures.prime(qa(n[l],M).clip)}}const $a=(t,o,l,m)=>v(t,o,m)*(1-v(o,o+l,m)),j=t=>{if(t<=0)return 0;const o=12,l=.45,m=o*Math.sqrt(1-l*l);return 1-Math.exp(-l*o*t)*(Math.cos(m*t)+l*o/m*Math.sin(m*t))},Ie={scene:b.scene,camera:new Ja,update({p:t,t:o,dt:l,v:m}){De(),lt(i,o,l),b.tick(o,m);const c=t*Ta.arcade,g=b.U,a=it,p=a.lock+.5,S=a.round+.3,h=c<p?0:c<S?1:2,x=h===0,I=Math.max(1-v(.08,2.4,c),$a(a.lock,p,.6,c)*0+v(a.lock,p,c)*(1-v(p,p+.6,c)),v(a.round-.3,S,c)*(1-v(S,S+.6,c)));g.uQ.value=I>0?Math.max(I,.0011):0,g.uM.value=1-v(0,1.5,c),W.U.uMode.value=h,W.U.uT.value=o,W.U.uA.value=e.portrait&&x&&c>3?0:1;const D=c>=a.mk?f:$(Math.floor((c-a.first)/a.step+.5),0,f-1);C=D,Ya(Math.min(D,f-1)),la.forEach((d,u)=>{d.mesh.visible=x,d.U.uSel.value=u===C?1:0});const J=pa(C),ee=z(J.x),Xe=J.y;ha||(re=ee,ve=Xe,ha=!0);const Ea=Math.hypot(ee-re,Xe-ve);Be=Math.max(Be-l*3.2,Math.min(1,Ea/40)),re+=(ee-re)*(1-Math.exp(-l*16)),ve+=(Xe-ve)*(1-Math.exp(-l*16)),ge.mesh.visible=x&&c>a.title+.6,ge.put(re,ve+Math.sin(Math.min(1,Be)*Math.PI)*5),ge.U.uT.value=o;const Ve=x&&c>2.4;le.mesh.visible=x&&c>a.title-.6,le.set(e.portrait?e.VW/2:z(12+le.w/2),e.titleY+(c<a.title+.8?(1-j(c-a.title+.6))*40:0));for(const d of[ua,sa,Te,We])d.mesh.visible=Ve;Ce.mesh.visible=!e.portrait&&x&&c>2.6;const da=n[Math.min(C,f-1)];Ye+=((C>=f?0:da.chapters/A)-Ye)*(1-Math.exp(-l*5)),$e+=((C>=f?0:da.duration/q)-$e)*(1-Math.exp(-l*4)),Te.U.uFill.value=Ye,We.U.uFill.value=$e;const xa=z(e.barX+e.barW-Wa/2);K&&(K.mesh.visible=Ve&&C<f&&!e.portrait,K.set(r?z(e.barX)-K.w/2:e.barX+K.w/2,e.barY[0]+12)),ie&&(ie.mesh.visible=Ve&&C<f,ie.set(xa,e.barY[0]+1)),ue&&(ue.mesh.visible=Ve&&C<f,ue.set(xa,e.barY[1]+1));const ga=x&&c>3&&C<f,Sa=Math.min(C,f-1);Me!==Sa?(se+=l/.22,se>=1&&(y[Me].pause(),Me=Sa)):se=Math.max(0,se-l/.38);const Ma=y[Me].frame(ga&&Oe);g.uVidTex.value=Ma.tex??s,g.uVidAsp.value=Ma.asp,g.uVidPix.value=$(se),g.uVid.value=ga?v(3,3.5,c)*(1-v(p-.4,p,c)):0,g.uVidFlash.value=c>3?Math.max(0,1-(c-3.1)*3)*v(2.9,3.05,c):0;for(const d of[w,F])d.mesh.visible=h>=1;for(const d of[Ae,ra,va])d.mesh.visible=h===1;for(const d of[G,Z,qe,Le])d.mesh.visible=h===2;const P=r?-1:1,ne=e.groundY,_e=e.VW*(r?.72:.28),fe=e.VW*(r?.28:.72),T=e.fk;let B=_e,X=fe,pe=ne,we=0,Ue=0,Fe=0,ze=0,Ne=0,Ge=0,he=0,ya=0,ke=0;const _=c<a.hit?c:a.hit+(Math.min(c,a.freeze)-a.hit)*.25;let Ze=0,Qe=!1,je=0,Je=0,me=0,ea=1,de=1;if(h===1){const d=v(p,p+1.1,c),u=e.portrait?.95:1.7,N=(1-d)*e.VW*.5;w.size(150*u,110*u),F.size(170*u,130*u),w.U.uK.value=u,F.U.uK.value=u,B=e.VW*(e.portrait?.3:.26)*(r?0:1)+(r?e.VW*(e.portrait?.7:.74)+N:-N),X=e.VW*(e.portrait?.7:.74)*(r?0:1)+(r?e.VW*(e.portrait?.3:.26)-N:N),pe=we=e.VH*(e.portrait?.36:.27),Ae.mesh.scale.setScalar(Math.max(.01,j(c-(p+1.3)))),Ae.set(e.VW/2,e.VH*(e.portrait?.58:.56)),ra.set(B,pe-16),va.set(X,pe-16),ke=1-d,we=0}else w.size(150,110),F.size(170,130),w.U.uK.value=T,F.U.uK.value=T;if(h===2){const d=v(S,S+.9,c);B=_e+(1-d)*(r?70:-70),X=fe+(1-d)*(r?-70:70),ke=1-d;const u=_,N=Math.sin(Math.PI*$((u-92.8)/.7)),Fa=Math.sin(Math.PI*$((u-94.6)/.7)),Ka=Math.sin(Math.PI*$((u-93.7)/.4)),Oa=Math.sin(Math.PI*$((u-95.5)/.4));Ue=Math.sin(Math.PI*$((u-92.7)/.9))*.9,Ge=Math.max(N,Fa),Fe=Math.max(Ka,Oa),ze=Math.max(0,1-Math.abs(u-94.95)/.18),he=Math.max(0,1-Math.abs(u-93.95)/.18,1-Math.abs(u-95.72)/.18),X-=P*(N+Fa)*36*T,B-=P*ze*7,X+=P*he*8,de=1-.1*v(93.9,94,u)-.12*v(95.7,95.8,u),ea=1-.14*v(94.9,95,u),Ne=v(a.charge,a.fire-.2,u)*(1-v(a.fire-.05,a.fire+.12,u)),Ue=Math.max(Ue,Ne*.6),u>a.charge&&(Fe=Math.max(Fe,v(a.fire-.1,a.fire+.1,u)*(1-v(a.fire+.1,a.fire+.45,u))*.8),Ge*=1-v(a.charge,a.charge+.4,u));const Ia=Math.abs(fe-_e);if(u>a.charge&&u<a.fire&&(Qe=!0,Je=3+11*v(a.charge,a.fire,u),je=B+P*(30+2*Math.sin(o*30))*T),u>=a.fire&&u<a.hit){const ca=(u-a.fire)/(a.hit-a.fire);Qe=!0,Je=14,je=B+P*(30+(ca*ca*.6+ca*.4)*(Ia-46*T))*1}const Y=u-a.hit;Y>=0&&(Ze=52*Math.min(1,Y/.09)*(1-v(.7,1.1,Y)*.3),X=fe+P*(120*(1-Math.exp(-Y*2.6))+6)*T,we=Math.sin(Math.PI*Math.min(1,Y/1.8))*56*T,ya=P*Y*3.2,he=1,me=Math.max(0,1-Y/.55)*6,de=Math.max(0,de*(1-v(0,.9,Y))))}w.put(B,pe+w.h/2),F.put(X,(h===1?pe:ne+we)+F.h/2),w.U.uFace.value=r?-1:1,F.U.uFace.value=r?1:-1,w.U.uCrouch.value=Ue,w.U.uPunch.value=Fe,w.U.uHit.value=ze,w.U.uCharge.value=Ne,w.U.uT.value=o,w.U.uStep.value=ke,F.U.uLunge.value=Ge,F.U.uHit.value=he,F.U.uT.value=o,F.U.uSpin.value=ya,F.U.uStep.value=ke;const ba=Math.floor(o*24)%2;if(w.U.uFlash.value=ze>.5?ba:0,F.U.uFlash.value=he>.5&&c<a.hit+2?ba:0,Ee+=(ea-Ee)*(1-Math.exp(-l*2.5)),Ke+=(de-Ke)*(1-Math.exp(-l*2.5)),ye+=(ea-ye)*(1-Math.exp(-l*14)),be+=(de-be)*(1-Math.exp(-l*14)),G.U.uFill.value=ye,G.U.uLag.value=Math.max(Ee,ye),Z.U.uFill.value=be,Z.U.uLag.value=Math.max(Ke,be),h===2){const d=Math.max(0,99-Math.floor(Math.max(0,_-a.fight)*.55));d!==na&&(na=d,O=Se(O,String(d).padStart(2,"0"),{scale:2,color:"#ffffff",outline:"#12062a"})),O&&(O.mesh.visible=!0,O.set(e.VW/2,e.VH-(e.portrait?46:44)+1))}else O&&(O.mesh.visible=!1);const Va=c-a.round,xe=c-a.fight,aa=c-a.ko,wa=_-a.charge,Ua=e.portrait?.6:1;Pe.mesh.visible=h===2&&Va>.2&&xe<.4,Pe.mesh.scale.setScalar(Math.max(.01,j(Va-.2)*(e.portrait?.75:1))),Pe.set(e.VW/2,e.VH*.56),Re.mesh.visible=h===2&&xe>0&&xe<1.5,Re.mesh.scale.setScalar(Math.max(.01,j(xe)*Ua*(1+.15*v(1.1,1.5,xe)))),Re.set(e.VW/2,e.VH*.56),He.mesh.visible=h===2&&aa>0,He.mesh.scale.setScalar(Math.max(.01,j(aa*1.6)*Ua*(2.2-1.2*Math.min(1,aa*4)))),He.set(e.VW/2,e.VH*.62),E.mesh.visible=h===2&&wa>.2&&_<a.hit+.2,E.mesh.scale.setScalar(Math.max(.01,j(wa-.2)*(e.portrait?.7:1))),E.set($(B+P*10,E.w*E.mesh.scale.x/2+4,e.VW-E.w*E.mesh.scale.x/2-4),ne+112*T),Q.mesh.visible=Qe,Q.put(je,ne+30*T),Q.U.uR.value=Je*T,Q.U.uDir.value=P,Q.U.uTrail.value=(_>=a.fire?46:8)*T,Q.U.uT.value=o,ce.mesh.visible=Ze>0,ce.put(fe-P*8,ne+34*T),ce.U.uS.value=Ze*T,ia.opacity=Math.min(1,(h===2&&_>=a.hit&&_<a.hit+.12?.85:0)+Math.max(0,1-Math.abs(c-a.lock-.1)/.2)*.6),g.uShake.value.set((me>0?Math.round(Math.sin(o*90)*me):0)/e.VW,(me>0?Math.round(Math.cos(o*77)*me*.6):0)/e.VH),W.U.uDim.value=1-.65*v(a.freeze-.3,a.freeze+.5,c);const ta=v(a.freeze,a.pout+1.4,c);g.uZoom.value=1+1.7*ta*ta,g.uZc.value=ta,g.uZoomC.value.set(ce.mesh.position.x/e.VW,ce.mesh.position.y/e.VH),g.uInv.value=v(a.inv,a.inv+1.2,c),g.uPout.value=v(a.pout,Ta.arcade-.15,c),b.draw(L)},resize(){b.resize(),De()},pick(t,o){if(!Oe||C>=f||!b.U.uVid.value)return null;const l=b.U.uVidRect.value,m=t*.5+.5,c=o*.5+.5;return m>=l.x&&m<=l.z&&c>=l.y&&c<=l.w?n[C].url:null},hover(t,o){return!!Ie.pick?.(t,o)},focus(t){Oe=t,t||y.forEach(o=>o.pause())},dispose(){b.dispose(),y.forEach(t=>t.pause()),U.dispose()}};return Object.defineProperty(Ie,"light",{get:()=>b.U.uInv.value>.5}),De(),b.resize(),await b.warm(L),Ie}export{Vt as default};
