import{u as P,S as q,q as B,y as O,aM as F,H as N,C as R,t as I,s as y,i as E,M as K,a as D,a6 as T,I as C,V as A,U as z}from"./EditionWorld.astro_astro_type_script_index_0_lang.Bwhdv6R4.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const W=`
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
float fbm3(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 3; i++){ v += a * vn(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
vec3 S(vec3 c){ return pow(c, vec3(2.2)); }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
`,_=`
vec3 invNeutral(vec3 o){
  const float S0 = .76, D = .24;
  float P0 = max(o.r, max(o.g, o.b)), sat = (P0 - min(o.r, min(o.g, o.b))) / max(P0, 1e-4);
  o *= min(1., mix(.996, .82, smoothstep(.12, .55, sat)) / max(P0, 1e-4));
  float P = max(o.r, max(o.g, o.b));
  vec3 c = o;
  if (P >= S0) {
    P = min(P, .996);
    float peak = D * D / (1. - P) - D + S0, g = 1. - 1. / (.15 * (peak - P) + 1.);
    c = (o - P * g) / max(1. - g, 1e-4) * peak / P;
  }
  float m = min(c.r, min(c.g, c.b)), x = m < .04 ? sqrt(max(m, 0.) / 6.25) : m + .04;
  return c + (x - m);
}`,k=(e,t)=>{const o=t.length,s=t.map(([a,i])=>`vec2(${a.toFixed(3)},${i.toFixed(3)})`).join(",");return`const vec2 ${e}[${o}] = vec2[${o}](${s});
float sd_${e}(vec2 p){
  float d = dot(p - ${e}[0], p - ${e}[0]), s = 1.;
  for (int i = 0, j = ${o-1}; i < ${o}; j = i, i++){
    vec2 e = ${e}[j] - ${e}[i], w = p - ${e}[i], b = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= ${e}[i].y, p.y < ${e}[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.;
  }
  return s * sqrt(d);
}`},j=`${k("MKM",P[0])}
${k("MKK",P[1])}
float sdMK(vec2 p){ p += vec2(1.935, 1.); return min(sd_MKM(p), sd_MKK(p)); }`,V=`
// 1: the full moon over a charcoal wash. The forge ends in it (mirror steel reflecting it), the ink round begins in it.
vec3 pivot1(vec2 uv, float asp){
  vec2 p = (uv - .5) * vec2(asp, 1.), c = vec2(0., .035);
  float d = length(p - c), R = .285;
  float cl = fbm(p * 2.1 + 3.1), cl2 = fbm(p * 5.2 - 7.3);
  vec3 sky = mix(S(vec3(.03, .031, .036)), S(vec3(.17, .165, .16)), smoothstep(1., .0, d) * (.5 + .5 * cl));
  sky *= .86 + .28 * cl2 * smoothstep(1.2, .2, d);
  vec2 q = (p - c) / R;
  float maria = fbm3(q * 2.6 + 9.) * .8 + fbm3(q * 6.5 + 2.) * .2;
  float limb = pow(clamp(1. - dot(q, q), 0., 1.), .35);
  vec3 moon = mix(S(vec3(.99, .975, .93)), S(vec3(.70, .69, .66)), smoothstep(.46, .66, maria) * .55) * (.78 + .22 * limb);
  float disc = smoothstep(R + .0035, R - .0035, d);
  vec3 col = sky + S(vec3(.95, .93, .86)) * (exp(-max(d - R, 0.) * 9.) * .2 + exp(-max(d - R, 0.) * 2.6) * .06);
  return mix(col, moon, disc);
}
// 2: warm black, one diagonal neon tube: the cut line of the ink round, lit
vec3 pivot2(vec2 uv, float asp){
  vec2 p = (uv - .5) * vec2(asp, 1.);
  vec3 col = S(vec3(.032, .012, .02)) + S(vec3(.2, .045, .12)) * .22 * exp(-dot(p, p) * 1.5);
  float a = .5236; vec2 dir = vec2(cos(a), sin(a)), n = vec2(-dir.y, dir.x);
  float d = abs(dot(p, n)), along = dot(p, dir), ext = smoothstep(.95 * asp + .2, .55 * asp, abs(along));
  float tube = smoothstep(.0105, .0035, d), glow = exp(-d * 17.) * .5 + exp(-d * 55.) * .65;
  vec3 hot = mix(S(vec3(1., .22, .55)), S(vec3(1., .86, .9)), tube);
  col += hot * (tube * 2.2 + glow * .55) * ext;
  col += S(vec3(1., .25, .5)) * exp(-d * 6.) * .06 * ext;
  return col;
}
// 3: frozen drops catching light: flashbulbs of a crowd in the dark, magenta and amber and white, a few with a star
vec3 pivot3(vec2 uv, float asp){
  vec2 p = vec2(uv.x * asp, uv.y);
  vec3 col = S(vec3(.02, .012, .016)) + S(vec3(.16, .07, .03)) * .25 * smoothstep(.0, 1., 1. - uv.y) * (.5 + .5 * fbm3(p * 3.));
  for (int L = 0; L < 3; L++){
    float fl = float(L), sc = 9. + fl * 11.;
    vec2 q = p * sc, id = floor(q), f = fract(q) - .5, j = (h22(id + fl * 17.) - .5) * .7;
    float on = step(.55 - fl * .06, h12(id + 41. + fl)), r = .018 + .05 * h12(id + 7. + fl) * (1. - fl * .3);
    vec2 w = f - j; float dist = length(w);
    float core = smoothstep(r, 0., dist), halo = exp(-dist * (22. - fl * 4.)) * .35;
    float star = (smoothstep(.012, 0., abs(w.x)) * smoothstep(.2, 0., abs(w.y)) + smoothstep(.012, 0., abs(w.y)) * smoothstep(.2, 0., abs(w.x))) * step(.93, h12(id + 99.));
    float k = h12(id + 5.);
    vec3 tint = k < .38 ? S(vec3(1., .22, .6)) : k < .72 ? S(vec3(1., .66, .2)) : S(vec3(1., .94, .88));
    col += mix(tint, vec3(1.), core) * (core * 1.6 + halo + star * .3) * on * (.55 + .45 * h12(id + 3.));
  }
  return col;
}
// 4: chain-link: bent wires crossing on the diagonal, tungsten gold in the middle, falling away into the dark
float wires(vec2 p, float sc, float w){
  vec2 q = rot(.7854) * p * sc;
  float a = abs(fract(q.x + .13 * sin(q.y * 6.2832) + .5) - .5), b = abs(fract(q.y + .13 * sin(q.x * 6.2832) + .5) - .5);
  float fw = fwidth(q.x) * 1.2;
  return max(smoothstep(w + fw, w - fw, a), smoothstep(w + fw, w - fw, b));
}
float edgeFade(vec2 uv, float asp){ return smoothstep(.0, .05, min(min(uv.x, 1. - uv.x) * asp, min(uv.y, 1. - uv.y))); }
vec3 pivot4(vec2 uv, float asp){
  vec2 p = (uv - .5) * vec2(asp, 1.);
  float r = length(p), wv = wires(p, 9., .045 + .02 * r) * edgeFade(uv, asp);
  vec3 col = S(vec3(.02, .014, .012)) + S(vec3(.2, .13, .06)) * .35 * exp(-r * 2.4);
  vec3 wire = mix(S(vec3(1., .78, .4)), S(vec3(.5, .34, .2)), smoothstep(.1, 1., r));
  float spec = pow(.5 + .5 * sin((p.x - p.y) * 30.), 6.);
  col += wire * wv * (.35 + .75 * exp(-r * 1.8)) * (.7 + .5 * spec);
  return col;
}
// 5: the same wires, re-routed: inside the mark they burn gold-white, outside they are a faint steel
vec3 pivot5(vec2 uv, float asp){
  vec2 p = (uv - .5) * vec2(asp, 1.);
  float d = sdMK(p / .23) * .23, wv = wires(p, 12., .05) * edgeFade(uv, asp);
  vec3 col = S(vec3(.016, .014, .014)) + S(vec3(.35, .12, .06)) * .18 * exp(-length(p) * 2.2);
  float inside = smoothstep(.004, -.004, d);
  col += S(vec3(.62, .64, .68)) * wv * .1 * smoothstep(.0, .35, d + .08);
  col += mix(S(vec3(1., .72, .3)), S(vec3(1., .95, .85)), wv) * (wv * 1.4 + .18) * inside;
  col += S(vec3(1., .5, .22)) * exp(-abs(d) * 60.) * .5 + S(vec3(1., .45, .2)) * exp(-max(d, 0.) * 9.) * .1;
  return col;
}
// 5, on the way: the wires are drawn toward the mark and settle, the mark ignites from its heart (k = 1 is pivot5 exactly)
vec3 pivot5m(vec2 uv, float asp, float k){
  vec2 p = (uv - .5) * vec2(asp, 1.), q = p / .23; float e = .01;
  float d = sdMK(q) * .23;
  vec2 g = normalize(vec2(sdMK(q + vec2(e, 0.)) - sdMK(q - vec2(e, 0.)), sdMK(q + vec2(0., e)) - sdMK(q - vec2(0., e))) + 1e-5);
  float wv = wires(p - g * (1. - k) * clamp(d, -.3, .6) * .85, 12., .05) * edgeFade(uv, asp);
  float lit = smoothstep(.0, .6, k * 1.5 - smoothstep(.0, .5, length(p)) * .5);
  vec3 col = S(vec3(.016, .014, .014)) + S(vec3(.35, .12, .06)) * .18 * exp(-length(p) * 2.2);
  float inside = smoothstep(.004, -.004, d) * lit;
  col += S(vec3(.62, .64, .68)) * wv * .1 * smoothstep(.0, .35, d + .08);
  col += mix(S(vec3(1., .72, .3)), S(vec3(1., .95, .85)), wv) * (wv * 1.4 + .18) * inside;
  col += S(vec3(1., .5, .22)) * exp(-abs(d) * 60.) * .5 * lit + S(vec3(1., .45, .2)) * exp(-max(d, 0.) * 9.) * .1;
  return col;
}
vec3 pivotById(int id, vec2 uv, float asp){
  vec3 c = vec3(0.);
  if (id == 1) c = pivot1(uv, asp); else if (id == 2) c = pivot2(uv, asp); else if (id == 3) c = pivot3(uv, asp); else if (id == 4) c = pivot4(uv, asp); else if (id == 5) c = pivot5(uv, asp);
  return c;
}
`,G="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",H=`
uniform sampler2D tWorld; uniform vec2 uRes, uWorldRes, uCss; uniform float uTime, uKeep, uCa, uAsp, uBloom, uExpo, uTone, uPin, uPout; uniform int uPinId, uPoutId; uniform vec4 uBell; uniform vec3 uBellCol; uniform float uMorph; uniform int uMorphId;
varying vec2 vUv;
${W}
${_}
${j}
${V}
vec3 finish(vec3 c){
  float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.)));
  float post = .45 + .55 * vig;
  return invNeutral(max(c * mix(1., post, uKeep), 0.)) / post;
}
vec3 samp(vec2 uv){ vec2 d = (uv - .5) * uCa; return vec3(texture2D(tWorld, uv - d).r, texture2D(tWorld, uv).g, texture2D(tWorld, uv + d).b); }
vec3 bloomAt(vec2 uv){
  return textureLod(tWorld, uv, 3.).rgb * .30 + textureLod(tWorld, uv, 4.).rgb * .26 + textureLod(tWorld, uv, 5.).rgb * .22 + textureLod(tWorld, uv, 6.).rgb * .22;
}
`,Y="vec3 look(vec3 c, vec2 uv){ return c; }",J="vec3 sceneColor(vec2 uv){ return samp(uv); }",Q=`
void main(){
  vec2 uv = vUv, bd = (vUv - uBell.zw) * vec2(uAsp, 1.);
  float br = length(bd), bR = uBell.x * .95, bk = uBell.x >= 0. ? exp(-pow((br - bR) / .05, 2.)) * exp(-uBell.x * 1.1) * uBell.y : 0.;
  if (bk > 0.) uv += bd / max(br, 1e-4) / vec2(uAsp, 1.) * bk * .016;     // the bell: a ring of light going out, the picture bending as it passes
  vec3 c = sceneColor(uv);
  c += bloomAt(vUv) * uBloom;
  c += uBellCol * bk * .55;
  c = look(c, vUv);
  c = mix(min(c * uExpo, 1.), aces(c * uExpo), uTone);
  if (uMorph > .001) {   // a round's own end state grows over its picture as a wipe of noise
    vec2 mq = (vUv - .5) * vec2(uAsp, 1.); float nz = fbm(mq * 2.4 + 3.) * .62 + (1. - vUv.y) * .38, mk = 1. - smoothstep(uMorph * 1.4 - .4, uMorph * 1.4, nz);
    c = mix(c, uMorphId == 5 ? pivot5m(vUv, uAsp, uMorph) : pivotById(uMorphId, vUv, uAsp), mk);
  }
  if (uPin > .001) c = mix(c, pivotById(uPinId, vUv, uAsp), uPin);
  if (uPout > .001) c = mix(c, pivotById(uPoutId, vUv, uAsp), uPout);
  gl_FragColor = vec4(finish(c), 1.);
}`;function ce(e,t={}){const o=new q,s=new B(2,2,{type:N,samples:t.msaa===!1||!e.quality?0:4,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:F,magFilter:O,generateMipmaps:!0}),a={tWorld:{value:s.texture},uRes:{value:new y(2,2)},uWorldRes:{value:new y(2,2)},uCss:{value:new y(2,2)},uTime:{value:0},uKeep:{value:.3},uCa:{value:.0025},uAsp:{value:1},uBloom:{value:t.bloom??.5},uExpo:{value:t.expo??1},uTone:{value:t.tone??0},uMorph:{value:0},uMorphId:{value:4},uBell:{value:new I(-1,1,.5,.5)},uBellCol:{value:new R("#fff4e0")},uPin:{value:0},uPout:{value:0},uPinId:{value:t.pin??1},uPoutId:{value:t.pout??1},...t.uniforms},i=new E({vertexShader:G,fragmentShader:H+(t.color??J)+(t.look??Y)+Q,uniforms:a,depthTest:!1,depthWrite:!1}),c=new K(new D(2,2),i);c.frustumCulled=!1;const f=new q;f.add(c);const m=new R;function d(){const{width:r,height:n,dpr:u,aspect:l}=e.viewport,[p,v]=t.size?t.size(r,n,u):[Math.max(2,Math.round(r*u)),Math.max(2,Math.round(n*u))];(s.width!==p||s.height!==v)&&s.setSize(p,v),a.uWorldRes.value.set(p,v),a.uRes.value.set(Math.round(r*u),Math.round(n*u)),a.uCss.value.set(r,n),a.uAsp.value=l}function h(r,n=o,u=0){const l=e.renderer,p=l.getRenderTarget(),v=l.getClearAlpha();l.getClearColor(m),l.setRenderTarget(s),l.setClearColor(u,1),l.clear(!0,!0,!0),l.render(n,r),l.setRenderTarget(p),l.setClearColor(m,v)}async function x(r){const n=e.renderer,u=n.getRenderTarget();n.setRenderTarget(s),await n.compileAsync(o,r).catch(()=>{}),n.setRenderTarget(u),o.traverse(l=>{const p=l.material;for(const L of Object.values(p?.uniforms??{})){const w=L?.value;w?.isTexture&&!w.isRenderTargetTexture&&w.image&&!w.isVideoTexture&&n.initTexture(w)}const v=p?.map;v?.isTexture&&v.image&&n.initTexture(v)}),h(r)}return d(),{scene:f,world:o,rt:s,U:a,resize:d,draw:h,warm:x,tick(r,n){a.uTime.value=r,a.uCa.value=(.0025+Math.min(Math.abs(n),4)*.006)*.65},pivots(r,n=.03,u=.03){a.uPin.value=1-T(0,n,r),a.uPout.value=T(1-u,1,r)},bell(r,n=.5,u=.5,l=1){a.uBell.value.set(r,l,n,u)},dispose(){s.dispose(),i.dispose(),c.geometry.dispose()}}}const Z=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,g={x:0,y:0,t:-1};function ie(e,t,o){if(g.t!==t){g.t=t;const s=e.pointer.inside&&!Z;g.x=C(g.x,s?e.pointer.x:0,2.6,o),g.y=C(g.y,s?e.pointer.y:0,2.6,o)}return g}function le(){const e=new URLSearchParams(location.search).get("intro");let t=-1,o=-1,s=0;return(a,i)=>e!==null?Number(e):(o<0&&(o=a),t<0&&(s=i<.04?s+1:0,(s>=4||a-o>.9)&&(t=a)),t<0?0:a-t)}async function ve(e){try{await Promise.race([Promise.all(e.map(t=>document.fonts.load(t))),new Promise(t=>setTimeout(t,2500))])}catch{}}const ue={mono:'"JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace',sans:'"Space Grotesk Variable", system-ui, sans-serif',ar:'"Cairo Variable", system-ui, sans-serif',serif:'"Fraunces Variable", Georgia, serif'};function pe(e){const t=e.length,o=(i,c)=>c<3?i.pos[c]:c<6?i.look[c-3]:c===6?i.fov??36:i.roll??0,s=(i,c)=>{if(e[i].hold)return 0;const f=e[Math.max(0,i-1)],m=e[Math.min(t-1,i+1)],d=m.t-f.t;return d>1e-6?(o(m,c)-o(f,c))/d:0},a=new Array(8).fill(0);return i=>{let c=0;for(;c<t-2&&i>e[c+1].t;)c++;const f=e[c],m=e[Math.min(t-1,c+1)],d=Math.max(1e-6,m.t-f.t),h=Math.min(1,Math.max(0,(i-f.t)/d)),x=h*h,r=x*h,n=2*r-3*x+1,u=r-2*x+h,l=-2*r+3*x,p=r-x;for(let v=0;v<8;v++)a[v]=n*o(f,v)+u*d*s(c,v)+l*o(m,v)+p*d*s(Math.min(t-1,c+1),v);return a}}const b=new A,S=new A;function fe(e,t,o=0,s=0,a=1){b.set(t[0],t[1],t[2]),S.set(t[3],t[4],t[5]),b.distanceTo(S),e.position.set(b.x+o*.28*a,b.y+s*.16*a,b.z),e.lookAt(S),e.rotateZ(t[7]-o*.014*a),Math.abs(e.fov-t[6])>1e-4&&(e.fov=t[6],e.updateProjectionMatrix()),e.updateMatrixWorld(!0)}const de=(e,t,o,s=0)=>Math.max(s,2*Math.atan(e/o/2/t)*180/Math.PI),me=e=>e.viewport.aspect<.9,M=Object.values(z).filter(e=>!e.legacy).length,U=e=>e.replace(/[0-9]/g,t=>"٠١٢٣٤٥٦٧٨٩"[+t]),X=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"],ee=e=>X[e]??String(e),te=["صفر","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة","أحد عشر","اثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر","ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر","عشرون"],$=e=>e===1?"نزال":e===2?"نزالان":e>=3&&e<=10?"نزالات":"نزالاً",oe=e=>e===1?"نزال واحد":e===2?"نزالان":`${e<=20?te[e]:U(String(e))} ${$(e)}`,ae=e=>e.charAt(0).toUpperCase()+e.slice(1),se={forge:45,ink:65,neon:65,ring:65,cage:65,belt:40};Object.values(se).reduce((e,t)=>e+t,0);const he=9,xe={ink:[0,4],neon:[4,4],ring:[8,4],cage:[12,3]},re={ink:[.12,.245,.37,.495],neon:[.16,.28,.4,.52],ring:[.07,.17,.27,.37],cage:[.13,.27,.41]};[...re.cage];const ge={name:{en:"Four Rounds",ar:"أربع جولات"},line:{en:`Four arts. One fighter. ${ae(ee(M))} bouts, every round made in code.`,ar:`أربعة فنون. مقاتل واحد. ${oe(M)}، وكل جولة مصنوعة بالبرمجة.`},round:[{en:"ROUND 1",ar:"الجولة ١"},{en:"ROUND 2",ar:"الجولة ٢"},{en:"ROUND 3",ar:"الجولة ٣"},{en:"ROUND 4",ar:"الجولة ٤"}],art:[{en:"The Blade",ar:"النصل"},{en:"Eight Limbs",ar:"ثمانية أطراف"},{en:"The Ring",ar:"الحلبة"},{en:"All Arts",ar:"كل الفنون"}],bout:{en:"BOUT",ar:"النزال"},tape:{en:"TALE OF THE TAPE",ar:"بطاقة النزال"},runtime:{en:"RUNTIME",ar:"المدة"},chapters:{en:"CHAPTERS",ar:"الفصول"},seconds:{en:"SEC",ar:"ث"},bouts:{ar:`${U(String(M))} ${$(M)}`}};export{W as C,ue as F,j as M,he as O,se as S,xe as a,re as b,de as c,ge as d,oe as e,ve as f,M as g,ee as h,me as i,U as j,le as k,ie as l,fe as p,pe as r,ce as s};
