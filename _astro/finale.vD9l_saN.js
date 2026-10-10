import{u as lt,at as nt,s as q,as as st,aB as it,t as le,V as _,i as Fe,aj as ut,an as vt,Q as qe,a2 as ye,a6 as x,P as ft,M as me,a as _e,G as ht,C as dt,n as mt,aL as W}from"./EditionWorld.astro_astro_type_script_index_0_lang.C5-V8Ssb.js";import{s as pt}from"./lens.DIvK4afm.js";import{C as Je,M as xt,d as gt,s as yt,l as wt,p as St,c as bt,F as Be}from"./lines.pkSlstdu.js";import{a as Rt,M as Mt}from"./glyphs.BIPUmoYA.js";import{l as kt}from"./glow.CKLjB1nP.js";import{C as Pt,a as zt}from"./plan.Bzh-bcoD.js";import{M as ce}from"./mk.CUK1hclA.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const At=.5,pe=e=>{let o=0;for(let t=0,a=e.length-1;t<e.length;a=t++)o+=(e[a][0]-e[t][0])*(e[a][1]+e[t][1]);return Math.abs(o/2)},Ct=e=>{let o=0,t=0,a=0;for(let c=0,n=e.length-1;c<e.length;n=c++){const i=e[n][0]*e[c][1]-e[c][0]*e[n][1];o+=i,t+=(e[n][0]+e[c][0])*i,a+=(e[n][1]+e[c][1])*i}return[t/(3*o),a/(3*o)]},We=(e,o,t)=>{const a=[t[0]-o[0],t[1]-o[1]],c=[e[0]-o[0],e[1]-o[1]],n=Math.hypot(a[0],a[1]),i=Math.abs(a[0]*c[1]-a[1]*c[0])/n,y=(c[0]*a[0]+c[1]*a[1])/(n*n);return i<1e-6&&y>-1e-6&&y<1+1e-6};function Lt(e=At){const[o,t]=lt,a=[t[2][0],t[6][1]],c=["shell","code","studio","mind","vault","blue"],n=[[o[0],o[1],o[2],o[10],o[11]],[o[2],o[3],o[4],o[8],o[9],o[10]],[o[4],o[5],o[6],o[7],o[8]],[t[0],t[1],t[2],t[3],a,t[10],t[11]],[a,t[3],t[4],t[5],t[6]],[a,t[6],t[7],t[8],t[9],t[10]]],i=pe(o)+pe(t),y=n.reduce((l,k)=>l+pe(k),0);Math.abs(i-y)>1e-6&&console.warn("[finale] the pieces do not tile the mark",i,y);const f=[o,t].flatMap(l=>l.map((k,h)=>[k,l[(h+1)%l.length]])),v=(l,k)=>f.some(([h,w])=>We(l,h,w)&&We(k,h,w)),m=n.map((l,k)=>{const[h,w]=Ct(l),V=new nt(l.map(([b,C])=>new q(b-h,C-w))),D=new st(V,{depth:e,bevelEnabled:!1,curveSegments:1});D.translate(0,0,-e/2);let X=new q(0,1),Y=0;l.forEach((b,C)=>{const F=l[(C+1)%l.length],z=Math.hypot(F[0]-b[0],F[1]-b[1]);z>Y&&(Y=z,X=new q(F[0]-b[0],F[1]-b[1]).normalize())});const S=new q(h-ce.cx,w-ce.cy),L=[];return l.forEach((b,C)=>{const F=l[(C+1)%l.length];if(v(b,F))return;const z=new q(b[0]-ce.cx,b[1]-ce.cy),R=new q(F[0]-ce.cx,F[1]-ce.cy);let p=new q(-(R.y-z.y),R.x-z.x).normalize();p.dot(S.clone().sub(z))>0&&p.negate(),L.push({a:z,b:R,out:p,with:-1})}),{room:c[k],poly:l,centre:S,geometry:D,cuts:L,axis:X,area:pe(l)}});return m.forEach((l,k)=>l.cuts.forEach(h=>{m.forEach((w,V)=>{V!==k&&w.cuts.some(D=>D.a.distanceTo(h.a)<1e-6&&D.b.distanceTo(h.b)<1e-6||D.a.distanceTo(h.b)<1e-6&&D.b.distanceTo(h.a)<1e-6)&&(h.with=V)})})),m}function Ft(e){return{uTime:e,uAsp:{value:1},uFloorY:{value:-1.55},uKdir:{value:1},uReveal:{value:0},uDirX:{value:1},uShock:{value:-1},uGlowC:{value:new q},uMarkP:{value:new q},uShad:{value:Array.from({length:6},()=>new le(0,0,1,0))},uShadC:{value:Array.from({length:6},()=>new _)},uRip:{value:new Array(6).fill(-1)},uFlag:{value:new le(2.9,2.3,-3.6,.38)},uFlag2:{value:new le(-6,1.1,-7.5,.5)},uInvProj:{value:new it},uBokeh:{value:1},uRays:{value:1},uFlagVis:{value:0},uPar:{value:new q}}}const Qe=`
float sq(float x){ return x * x; }
uniform float uFloorY, uKdir, uReveal, uDirX, uShock;
uniform vec2 uGlowC;
uniform vec4 uShad[6]; uniform vec3 uShadC[6]; uniform float uRip[6];
uniform vec4 uFlag, uFlag2;

// a soft rectangular light seen from the inside of a sphere of directions
vec3 panelL(vec3 d, vec3 c, float hw, float hh, float soft, vec3 col){
  float dc = dot(d, c);
  if (dc < .08) return vec3(0.);
  vec3 up = abs(c.y) > .95 ? vec3(0., 0., -1.) : vec3(0., 1., 0.);
  vec3 r = normalize(cross(up, c)), u = cross(c, r);
  vec2 q = vec2(dot(d, r), dot(d, u)) / dc;
  vec2 m = 1. - smoothstep(vec2(hw, hh) * (1. - soft), vec2(hw, hh), abs(q));
  return col * m.x * m.y;
}

// the room behind the camera: dark, warm, with a few soft panels (what polished metal and glass have to reflect)
vec3 roomFront(vec3 d){
  vec3 c = mix(S(vec3(.06, .052, .044)), S(vec3(.30, .26, .20)), smoothstep(-.8, .9, d.y));
  c += S(vec3(.5, .42, .30)) * exp(-sq(length(d - normalize(vec3(.05, .25, 1.))) * 1.5)) * .55;   // a broad soft glow straight behind us: bare metal facing us is silver, not black
  c += panelL(d, normalize(vec3(-.58, .60, .55)), .78, .52, .65, S(vec3(1., .93, .80)) * 7.);          // the key, a big warm softbox, upper left
  c += panelL(d, normalize(vec3(.90, .12, .42)), .10, .90, .55, S(vec3(.86, .93, 1.)) * 4.);            // a strip light, right
  c += panelL(d, normalize(vec3(.05, .96, .26)), .95, .55, .75, S(vec3(1., .90, .74)) * 1.6);          // a wide fill overhead
  c += panelL(d, normalize(vec3(-.85, -.05, .50)), .09, .8, .6, S(vec3(1., .85, .6)) * 2.2);           // a warm kicker, left
  return c;
}

// what polished metal and crystal reflect: a dark studio all round with a few soft boxes (under the cream cyclorama they would read flat)
vec3 metalEnvL(vec3 d, float lift){
  vec3 c = mix(S(vec3(.035, .030, .026)), S(vec3(.20, .17, .13)), smoothstep(-.9, .9, d.y));
  c += S(vec3(.60, .63, .68)) * lift * (.25 + .75 * smoothstep(-.7, .8, d.y));
  c += S(vec3(.80, .82, .86)) * exp(-sq(length(d - normalize(vec3(.05, .25, 1.))) * 1.4)) * (.25 + lift * 1.3);   // a big soft light behind us: a surface that faces us holds a silver sheen, one turned away falls dark
  c += S(vec3(1., .80, .48)) * .22 * exp(-sq(d.y * 3.2)) * smoothstep(.3, -.5, d.z);
  c += panelL(d, normalize(vec3(-.58, .60, .55)), .78, .52, .65, S(vec3(1., .93, .80)) * 7.);
  c += panelL(d, normalize(vec3(.90, .12, .42)), .10, .90, .55, S(vec3(.86, .93, 1.)) * 4.);
  c += panelL(d, normalize(vec3(.05, .96, .26)), .95, .55, .75, S(vec3(1., .90, .74)) * 1.6);
  c += panelL(d, normalize(vec3(.78, .30, -.55)), .55, .45, .6, S(vec3(1., .90, .70)) * 4.5);
  c += panelL(d, normalize(vec3(-.82, .22, -.52)), .09, .85, .6, S(vec3(.90, .95, 1.)) * 3.5);
  c += panelL(d, normalize(vec3(.0, .35, -.94)), .9, .35, .7, S(vec3(1., .88, .62)) * 1.4);
  return c;
}
vec3 metalEnv(vec3 d){ return metalEnvL(d, 0.); }

// the light behind the mark: pivot G (cream at the middle, gold at the edges) as a function of where we look
vec3 skyBack(vec3 rd){
  vec2 w = rd.xy / max(-rd.z, .08) * uKdir - uGlowC;
  float r = length(w) * mix(1., .78, uReveal);
  vec3 c = mix(S(vec3(1., .965, .86)), S(mix(vec3(1., .80, .42), vec3(1., .86, .56), uReveal * .7)), smoothstep(.08, .9, r));
  c += S(vec3(1., .97, .9)) * exp(-r * r * 3.2) * .3;
  // strip lights far behind, barely there: something bright and narrow for the glass and the floor to hold
  float bars = exp(-sq((w.x + .95) / .09)) + .8 * exp(-sq((w.x - 1.35) / .12)) + .6 * exp(-sq((w.x + 1.9) / .07));
  c += S(vec3(1., .97, .9)) * bars * .24 * uReveal * smoothstep(-.9, -.15, w.y) * (1. - smoothstep(.45, 1.05, w.y));
  return c;
}
vec3 envSky(vec3 rd){ return mix(roomFront(rd), skyBack(rd), smoothstep(.15, -.15, rd.z)); }

// a flag: a dark soft panel standing on the floor, facing us
vec4 flagAt(vec3 ro, vec3 rd, vec4 F, out float t){
  t = 1e9;
  if (abs(rd.z) < 1e-4) return vec4(0.);
  t = (F.z - ro.z) / rd.z;
  if (t <= 0.) {t = 1e9; return vec4(0.);}
  vec3 p = ro + rd * t;
  float hh = 3.8;
  float cov = 1. - smoothstep(-F.w, F.w, sdBox(vec2(p.x - F.x * uDirX, p.y - (uFloorY + hh)), vec2(F.y, hh)));
  cov *= smoothstep(0., 1.6, p.y - uFloorY) * (1. - smoothstep(3.6, 6.8, p.y - uFloorY));
  float h = clamp((p.y - uFloorY) / (2. * hh), 0., 1.);
  vec3 c = mix(S(vec3(.040, .026, .016)), S(vec3(.20, .145, .085)), h * h);
  c += S(vec3(1., .82, .55)) * .16 * exp(-sq((abs(p.x - F.x * uDirX) - F.y) / .14));   // a lit rim along its edges
  return vec4(c, cov);
}

vec3 withFlags(vec3 ro, vec3 rd, vec3 c, float tMax, float amt){
  if (amt < .002) return c;
  float t1, t2; vec4 f1 = flagAt(ro, rd, uFlag, t1), f2 = flagAt(ro, rd, uFlag2, t2);
  f1.a *= step(t1, tMax) * amt; f2.a *= step(t2, tMax) * amt;
  if (t1 < t2) {c = mix(c, f2.rgb, f2.a); c = mix(c, f1.rgb, f1.a);} else {c = mix(c, f1.rgb, f1.a); c = mix(c, f2.rgb, f2.a);}
  return c;
}

vec3 floorAt(vec3 ro, vec3 rd, float t, float fa){
  vec3 hp = ro + rd * t;
  float cs = clamp(-rd.y, 0., 1.);
  vec3 rr = vec3(rd.x, -rd.y, rd.z);
  vec3 refl = withFlags(hp, rr, envSky(rr), 1e8, fa);
  float fr = .06 + .94 * pow(1. - cs, 4.);
  vec3 diff = S(vec3(.97, .875, .66));
  vec3 c = mix(diff, refl, fr);
  // the pieces' soft shadows
  float sh = 0.; vec3 pool = vec3(0.);
  for (int i = 0; i < 6; i++){ vec2 d = (hp.xz - uShad[i].xy - vec2(.35, -.25)) / uShad[i].z; float g = uShad[i].w * exp(-dot(d, d)); sh += g; pool += uShadC[i] * g; }
  c *= 1. - clamp(sh, 0., .85) * .55;
  c += pool * .62;   // the light that comes through the glass lands coloured on the floor
  // every piece that locks sends a soft ring of light across the floor
  for (int i = 0; i < 6; i++){ float tr = uRip[i]; if (tr > 0. && tr < 2.4){ float r = length(hp.xz - uShad[i].xy); c += S(vec3(1., .90, .70)) * exp(-sq((r - tr * 3.2) / .2)) * exp(-tr * 2.1) * .5; } }
  // the shock's ripple: a ring of light running out across the floor from under the mark
  if (uShock >= 0.){
    float r = length(hp.xz);
    float ring = exp(-sq((r - uShock * 7.5) / .35)) * exp(-uShock * 1.3);
    c += S(vec3(1., .86, .58)) * ring * .75;
  }
  float h = 1. - exp(-t * .05);
  c = mix(c, envSky(normalize(vec3(rd.x, 0., rd.z - 1e-3))), h * h);
  return c;
}

vec3 scene(vec3 ro, vec3 rd, float fa){
  vec3 c = envSky(rd);
  float tF = 1e9;
  if (rd.y < -1e-3 && ro.y > uFloorY){
    tF = (uFloorY - ro.y) / rd.y;
    c = mix(c, floorAt(ro, rd, tF, fa), uReveal);
  }
  return withFlags(ro, rd, c, tF, uReveal * fa);
}
`;function qt(e){return new Fe({uniforms:{...e},depthTest:!1,depthWrite:!1,transparent:!1,vertexShader:`
      uniform mat4 uInvProj; varying vec3 vRay; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 v = uInvProj * vec4(position.xy, 1., 1.);
        vRay = transpose(mat3(viewMatrix)) * (v.xyz / v.w);
        gl_Position = vec4(position.xy, 1., 1.);
      }`,fragmentShader:`
      precision highp float;
      uniform float uTime, uAsp, uBokeh, uRays, uFlagVis; uniform vec2 uMarkP, uPar;
      varying vec3 vRay; varying vec2 vUv;
      ${Je}
      ${Qe}
      // soft discs of warm light, far out of focus: two depths, each drifting, parting with the camera
      vec3 bokeh(vec2 p, float r){
        vec3 acc = vec3(0.);
        for (int L = 0; L < 2; L++){
          float fl = float(L), cells = mix(4.2, 2.6, fl);
          vec2 q = p * cells + vec2(uTime * (.020 + fl * .014), uTime * (.035 + fl * .02)) + uPar * (1. + fl * 1.6);
          vec2 id = floor(q), f = fract(q) - .5;
          vec2 hs = h22(id + fl * 17.3);
          float rad = mix(.10, .21, hs.x), d = length(f - (hs.yx - .5) * .44);
          float on = step(.6, h12(id + 3.7 + fl * 9.)) * (.55 + .45 * sin(uTime * (.25 + hs.y * .5) + hs.x * 6.283));
          float disc = smoothstep(rad, rad * .35, d) * .45;
          vec3 tone = mix(S(vec3(1., .97, .90)), S(vec3(1., .80, .46)), smoothstep(.2, .7, r));
          acc += tone * disc * on * mix(1., .6, fl);
        }
        return acc;
      }
      void main(){
        vec3 rd = normalize(vRay);
        vec3 col = scene(cameraPosition, rd, uFlagVis);
        vec2 p = (vUv - .5) * vec2(uAsp, 1.);
        float r = length(p);
        // pivot G's own texture
        col += S(vec3(1., .86, .5)) * (fbm(p * 2.2 + vec2(uTime * .03, 0.)) - .5) * .09;
        // soft rays: wide sectors a little deeper gold than the cream between them, turning very slowly
        vec2 gp = p - uMarkP * .55;
        float a = atan(gp.y, gp.x), gr = length(gp);
        float ray = (.5 + .5 * sin(a * 9. + uTime * .05 + fbm(vec2(a * 1.7, uTime * .02)) * 5.)) * (.55 + .45 * sin(a * 21. - uTime * .035 + 1.7));
        col *= 1. - uRays * uReveal * .13 * ray * smoothstep(.04, .5, gr) * (1. - smoothstep(1., 1.8, gr));
        // bokeh
        col = mix(col, col + bokeh(p, r) * .55, uBokeh * uReveal);
        // pivot G's vignette
        col *= mix(1., mix(.6, .74, uReveal), smoothstep(.5, 1.2, r));
        gl_FragColor = vec4(col, 1.);
      }`})}const Tt=[`
vec3 surf(vec3 N, vec3 V, vec3 P, vec3 m, float eD){
  float nv = max(dot(N, V), 0.);
  vec2 lp = m.xy - uCentre;
  // smoked amber glass: the studio behind it, dimmed
  vec3 T = refract(-V, N, .70);
  vec3 behind = sc(P + T * .55, T);
  float L = .62 / max(abs(dot(T, normalize(vAz))), .3) * (1. + 1.6 * exp(-eD * 11.));
  vec3 col = behind * exp(-vec3(.95, 2.7, 5.6) * L * .62) * .26 * (.75 + .5 * smoothstep(-1., 1., lp.y));
  // the screen: a rounded window of phosphor lit in scanlines, a bar rolling down, brightest in the middle, dimmer toward its edges
  float ds = sdRBox(lp, vec2(.145, .90), .07), scr = smoothstep(.012, -.012, ds) * (1. - gWall);
  float ln = m.y * 240.;
  float sl = mix(.5 + .5 * sin(ln), .6, smoothstep(.8, 1.8, fwidth(ln)));
  float roll = exp(-sq((fract(m.y * .21 - uTime * .08) - .5) * 5.5));
  vec2 q = lp * vec2(3.2, .55);
  float mid = exp(-dot(q, q));
  float vig = .55 + .45 * (1. - smoothstep(.0, .55, length(lp / vec2(.145, .9))));
  float inten = (.30 + .80 * mid + .55 * roll) * (.32 + .85 * sl) * vig;
  vec3 phos = mix(S(vec3(1., .46, .06)), S(vec3(1., .90, .62)), clamp(inten * 1.15 - .5, 0., 1.));
  col += phos * inten * scr * 2.0;
  // rows of lit text, and the caret at the end of the last
  vec2 g = vec2((lp.x + .145) / .058, (lp.y + .9) / .105 + uPerfT * 6.);
  vec2 id = floor(g), f = fract(g);
  float row = step(.30, h11(id.y * 3.7 + 1.3)) * step(id.y, 14.), run = step(0., id.x) * step(id.x, 1. + floor(h11(id.y * 5.1) * 4.));
  float gi = uGlyphRange.x + floor(h12(id + 5.) * uGlyphRange.y);
  float gtx = smoothstep(.46, .56, glyphD(gi, vec2(.5 + (f.x - .5) * .5, .5 + (f.y - .5) * .62))) * row * run * scr;
  col += S(vec3(1., .80, .45)) * gtx * (.5 + .5 * sl) * (1.1 + 1.2 * uPerf);
  col += S(vec3(1., .92, .70)) * exp(-sq((lp.y - mix(1.05, -1.05, uPerfT)) * 8.)) * uPerf * scr * 1.5 * (.4 + .6 * sl);
  vec2 cq = lp - vec2(-.03, -.69);
  col += S(vec3(1., .90, .65)) * smoothstep(.012, -.012, sdRBox(cq, vec2(.045, .06), .008)) * step(.5, fract(uTime * .85)) * 1.7 * (1. - gWall);
  col *= .94 + .12 * h12(floor(m.xy * 380.) + floor(uTime * 16.));
  // the glow that bleeds past the screen onto the glass, and a hot inner edge
  col += S(vec3(1., .55, .12)) * exp(-max(ds, 0.) * 14.) * (1. - scr) * .55;
  col += S(vec3(1., .74, .32)) * exp(-eD * 24.) * .7;
  vec3 R = reflect(-V, N);
  col += mix(metalEnv(R), roomEnv(R, .06) * 1.1, .3) * (.05 + fres(nv) * .95);
  col += S(vec3(1., .95, .85)) * pow(max(dot(R, normalize(vec3(-.45, .65, .62))), 0.), 5.) * .24;
  return col;
}`,`
vec3 surf(vec3 N, vec3 V, vec3 P, vec3 m, float eD){
  float nv = max(dot(N, V), 0.);
  vec3 col = mix(S(vec3(.012, .030, .085)), S(vec3(.06, .12, .27)), clamp(m.y * .30 + .5, 0., 1.));
  // lines of code climbing the face: indents, runs of glyphs, gaps
  float cw = .078, ch = .096;
  vec2 g = vec2(m.x / cw + 24., m.y / ch + uTime * .32);
  vec2 id = floor(g), f = fract(g);
  float indent = floor(h11(id.y * 2.1 + 7.7) * 3.) * 2.;
  float len = 12. + floor(h11(id.y * 3.3 + 1.9) * 14.);
  float run = step(indent, id.x) * step(id.x, indent + len) * step(.16, h12(vec2(id.x * .91, id.y)));
  float word = floor((id.x - indent) / (3. + floor(h11(id.y * 5.1) * 4.)));
  float pick = h12(id + floor(uTime * .22 + uPerf * uTime * 1.6 + h12(id.yx) * 9.));
  float gi = pick < .3 ? uGlyphRange.x + floor(h12(id * 1.7 + 3.) * uGlyphRange.y) : uGlyphRange.z + floor(h12(id * 2.3 + 8.) * uGlyphRange.w);
  float d = glyphD(gi, vec2(.5 + (f.x - .5) * .5, .5 + (f.y - .5) * .62));
  float aa = fwidth(d) * .9 + .02;
  float a = smoothstep(.5 - aa, .5 + aa, d) * run * (1. - gWall);
  float c4 = h11(word * 7.3 + id.y * 1.7);
  vec3 gc = c4 < .42 ? S(vec3(.88, .94, 1.)) : c4 < .68 ? S(vec3(.46, .72, 1.)) : c4 < .88 ? S(vec3(.56, .90, .98)) : S(vec3(.78, .66, 1.));
  float band = exp(-sq((fract(m.y * .17 - uTime * .06) - .5) * 7.));
  float body = smoothstep(0., .05, eD);
  float rd = exp(-sq((m.y - mix(-1.1, 1.1, uPerfT)) * 7.)) * uPerf;
  col += gc * a * (.65 + .95 * band + 2.2 * rd) * body * 1.5;
  col += S(vec3(.45, .65, 1.)) * rd * .18 * body;
  col += S(vec3(.25, .45, 1.)) * a * .22 * body;
  col += S(vec3(.04, .09, .24)) * h12(floor(m.xy * 90.)) * .5;
  // a glossy coat over it
  vec3 R = reflect(-V, N);
  col += metalEnv(R) * (.08 + fres(nv) * .9);
  col += S(vec3(.6, .8, 1.)) * exp(-eD * 24.) * .4;
  return col;
}`,`
vec3 surf(vec3 N, vec3 V, vec3 P, vec3 m, float eD){
  float nv = max(dot(N, V), 0.);
  vec2 lp = m.xy - uCentre;
  float period = .66, fy = (lp.y + 1. - smoothstep(0., 1., uPerfT) * period * uPerf) / period;
  float fid = floor(fy);
  vec2 q = vec2(lp.x, (fract(fy) - .5) * period);
  float dg = sdRBox(q, vec2(.135, .235), .035), gate = smoothstep(.012, -.012, dg) * (1. - gWall);
  vec2 pq = vec2(abs(lp.x) - .172, (fract((lp.y + 1. - smoothstep(0., 1., uPerfT) * period * uPerf) / .165) - .5) * .165);
  float perf = smoothstep(.007, -.007, sdRBox(pq, vec2(.020, .030), .008)) * (1. - gWall);
  float hotg = 1. + .6 * uPerf;
  float flick = .94 + .06 * h11(floor(uTime * 22.) + fid * 3.7);
  vec3 col = S(vec3(.20, .105, .05)) * (.8 + .4 * vn(m.xy * 60.));
  vec2 gq = q / vec2(.135, .235);
  vec3 hot = mix(S(vec3(1., .66, .24)), S(vec3(1., .94, .80)), exp(-dot(gq, gq) * 1.1));
  col += hot * 1.6 * gate * flick * hotg;
  col += S(vec3(1., .62, .22)) * perf * 1.1 * flick;
  col += S(vec3(1., .55, .14)) * exp(-max(dg, 0.) * 16.) * .7 * (1. - gate) * flick * (1. - gWall);
  vec3 R = reflect(-V, N);
  col += metalEnv(R) * fres(nv) * .6;
  col += S(vec3(1., .86, .6)) * exp(-eD * 24.) * .5;
  return col;
}`,`
float vor(vec2 p, out vec2 cid, out float d2o){
  vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.; cid = i;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 g = vec2(float(x), float(y)), r = g + h22(i + g) - f; float d = dot(r, r);
    if (d < d1){ d2 = d1; d1 = d; cid = i + g; } else if (d < d2) d2 = d;
  }
  d2o = sqrt(d2); return sqrt(d1);
}
vec3 surf(vec3 N0, vec3 V, vec3 P, vec3 m, float eD){
  vec2 cid; float d2;
  float d1 = vor(m.xy * 4.4, cid, d2);
  vec2 th = (h22(cid + 7.3) - .5) * 1.4;
  vec3 N = normalize(N0 + normalize(vAx) * th.x + normalize(vAy) * th.y);
  float nv = max(dot(N, V), 0.);
  vec3 Ld = normalize(vec3(-.45, .65, .62));
  float dif = max(dot(N, Ld), 0.);
  vec3 col = S(vec3(.24, .09, .60)) * (.30 + 1.0 * dif);
  col += S(vec3(.55, .32, 1.)) * (.20 + .55 * h12(cid)) * (1. - nv) * .9;
  vec3 R = reflect(-V, N);
  col += metalEnv(R) * (.10 + fres(nv) * 1.05);
  col += S(vec3(1., .95, 1.)) * pow(max(dot(R, Ld), 0.), 50.) * 1.1;
  col += S(vec3(.80, .66, 1.)) * smoothstep(.075, .0, d2 - d1) * .6;
  float wv = exp(-sq((length(m.xy - uCentre) - uPerfT * 1.4) * 4.5)) * uPerf;
  col += S(vec3(.95, .88, 1.)) * smoothstep(.10, .03, d1) * (.6 + .4 * sin(uTime * 1.6 + h12(cid) * 6.28) + 2.2 * wv) * .85 * (1. - gWall);
  col += S(vec3(.75, .6, 1.)) * wv * (.5 + smoothstep(.075, .0, d2 - d1) * 1.2);
  col += S(vec3(.8, .7, 1.)) * exp(-eD * 24.) * .45;
  return col;
}`,`
vec3 surf(vec3 N, vec3 V, vec3 P, vec3 m, float eD){
  vec3 ax = normalize(vAx * uAxis.x + vAy * uAxis.y);
  vec2 ap = vec2(dot(m.xy, vec2(-uAxis.y, uAxis.x)), dot(m.xy, uAxis));
  float gr = vn(vec2(ap.x * 310., ap.y * 5.)) - .5 + (vn(vec2(ap.x * 90., ap.y * 3.)) - .5) * .8;
  vec3 cx = cross(N, ax);
  vec3 tx = dot(cx, cx) > 1e-8 ? normalize(cx) : normalize(vAx);
  vec3 Nb = normalize(N + tx * gr * .06 + normalize(vAx) * (m.x - uCentre.x) * .34 + normalize(vAy) * (m.y - uCentre.y) * .20);
  vec3 R = reflect(-V, Nb);
  vec3 e = (metalEnvL(R, .38) * 2. + metalEnvL(normalize(R + ax * .12), .38) + metalEnvL(normalize(R - ax * .12), .38)) * .25;
  e = mix(e, sc(P, R), .06);
  e = pow(max(e, 0.), vec3(1.32)); e /= 1. + .16 * e;   // more contrast (steel is not pastel), the brightest panels not blown out
  float nv = max(dot(Nb, V), 0.);
  vec3 F0 = S(vec3(.82, .85, .90));
  vec3 col = e * (F0 + (1. - F0) * pow(1. - clamp(nv, 0., 1.), 5.));
  // the lattice etched in it
  float s = .24, hh = s * .8660254;
  vec2 p = m.xy;
  float d0 = abs(fract(p.y / hh + .5) - .5) * hh, d1 = abs(fract(dot(p, vec2(-.8660254, .5)) / hh + .5) - .5) * hh, d2 = abs(fract(dot(p, vec2(.8660254, .5)) / hh + .5) - .5) * hh;
  float lw = max(.0045, fwidth(p.y) * .9);
  float ln = max(max(smoothstep(lw * 1.4, lw * .3, d0), smoothstep(lw * 1.4, lw * .3, d1)), smoothstep(lw * 1.4, lw * .3, d2));
  float node = smoothstep(lw * 3.4, lw * .8, max(max(d0, d1), d2));
  ln *= 1. - gWall;
  col *= 1. - ln * .6;
  col += S(vec3(1., .97, .92)) * exp(-sq((dot(m.xy - uCentre, uAxis) - mix(-1.15, 1.15, uPerfT)) * 5.)) * uPerf * (.8 + .5 * (1. - ln));
  col += S(vec3(1., .98, .95)) * node * .45 * (.6 + .4 * sin(uTime * 1.2 + h12(floor(p / s)) * 6.28)) * (1. - gWall);
  col += S(vec3(1., .98, .95)) * exp(-eD * 30.) * .4;
  return col;
}`,`
vec3 surf(vec3 N, vec3 V, vec3 P, vec3 m, float eD){
  float nv = max(dot(N, V), 0.);
  float L = .56 / max(nv * .6 + .4, .3);
  vec3 col = vec3(0.);
  for (int i = 0; i < 3; i++){
    float ior = 1.5 + (float(i) - 1.) * .035;
    vec3 T = refract(-V, N, 1. / ior);
    vec3 s = sc(P + T * L, mix(-V, T, .55));
    col[i] = s[i];
  }
  col *= exp(-vec3(5.2, 3.0, .55) * L * 1.05) * .85;
  col += S(vec3(.01, .10, .62)) * (.16 + .30 * (1. - nv));
  vec3 R = reflect(-V, N);
  col += mix(metalEnv(R), roomEnv(R, .05) * .9, .3) * fres(nv) * 1.1;
  col += S(vec3(1., .97, .92)) * pow(max(dot(R, normalize(vec3(-.45, .65, .62))), 0.), 90.) * 1.2;
  col += S(vec3(.45, .72, 1.)) * exp(-eD * 20.) * .6;
  col += S(vec3(.25, .55, 1.)) * exp(-sq((length(m.xy - uCentre) - uPerfT * 1.2) * 4.)) * uPerf * .9;
  return col;
}`],Nt=`
uniform vec2 uCentre; uniform float uFloorY;
varying vec3 vWP, vNL, vL, vCam, vAx, vAy, vAz;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vWP = w.xyz; vNL = normal;
  mat3 R = mat3(modelMatrix); vAx = R[0]; vAy = R[1]; vAz = R[2];
  vL = vec3(position.xy + uCentre, position.z);
  vec3 wc = w.xyz, cp = cameraPosition;
  #ifdef MIRROR
    wc.y = 2. * uFloorY - wc.y; cp.y = 2. * uFloorY - cp.y;
  #endif
  vCam = cp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wc, 1.);
}`,Dt=`
precision highp float;
uniform float uTime, uLock, uGlint, uSweep, uMirA, uPerf, uPerfT, uDimO;
uniform vec2 uCentre, uAxis;
uniform vec4 uCut[3]; uniform vec2 uCutN[3]; uniform vec3 uCutJoin; uniform float uNCut;
uniform sampler2D tGlyph; uniform vec2 uGrid; uniform vec4 uGlyphRange;
varying vec3 vWP, vNL, vL, vCam, vAx, vAy, vAz;
${Je}
${xt}
${Qe}
const float BW = .075, HZ = .25;
#ifdef ENVMAP_TYPE_CUBE_UV
  uniform sampler2D envMap;
  #include <cube_uv_reflection_fragment>
  vec3 roomEnv(vec3 d, float rough){ return textureCubeUV(envMap, normalize(d), rough).rgb; }
#else
  vec3 roomEnv(vec3 d, float rough){ return vec3(0.); }
#endif

// the mark's outline: x the signed distance (negative inside), yz the way out; mark-centred coordinates
vec3 sdMKg(vec2 p0){
  float s = sdMK(p0);
  vec2 p = p0 + vec2(1.935, 1.);
  float best = 1e9; vec2 bq = vec2(0.);
  for (int k = 0; k < 2; k++){
    for (int i = 0, j = 11; i < 12; j = i, i++){
      vec2 a = k == 0 ? MKM[j] : MKK[j], b = k == 0 ? MKM[i] : MKK[i];
      vec2 e = b - a, w = p - a;
      vec2 q = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.);
      float d = dot(q, q);
      if (d < best){ best = d; bq = q; }
    }
  }
  vec2 dir = bq / max(sqrt(best), 1e-5);
  return vec3(s, s < 0. ? -dir : dir);
}
float gWall = 0.;   // 1 on a side wall: the patterns live on the faces, a wall is the plain material
float glyphD(float g, vec2 c){ vec2 cell = vec2(mod(g, uGrid.x), floor(g / uGrid.x)); return texture2D(tGlyph, (cell + c) / uGrid).r; }
vec3 sc(vec3 p, vec3 d){ return scene(p, normalize(d), 1.); }
float fres(float c){ return .04 + .96 * pow(1. - clamp(c, 0., 1.), 5.); }
`,Ot=`
void main(){
  #ifdef MIRROR
    if (vWP.y < uFloorY) discard;   // only what is above the floor has a reflection
  #endif
  vec3 nObj = vNL; float eD = HZ - abs(vL.z);
  float face = step(.5, abs(vNL.z));
  gWall = 1. - face;
  if (face > .5){
    float s = sign(vNL.z);
    vec3 g = sdMKg(vL.xy);
    float u = clamp(1. - (-g.x) / BW, 0., 1.);
    vec2 od = g.yz; eD = -g.x;
    for (int i = 0; i < 3; i++){
      if (float(i) >= uNCut) break;
      float dc = sdSeg(vL.xy, uCut[i].xy, uCut[i].zw);
      float uc = (1. - uCutJoin[i]) * clamp(1. - dc / BW, 0., 1.);
      if (uc > u){ u = uc; od = uCutN[i]; }
      if (uCutJoin[i] < .5) eD = min(eD, dc);
    }
    vec3 nb = vec3(od * u, s * sqrt(max(1. - u * u, 0.)));   // (exactly on the outline both parts can be zero: then the face itself)
    float nl = length(nb);
    nObj = nl > 1e-4 ? nb / nl : vec3(0., 0., s);
  }
  vec3 N = normalize(vAx * nObj.x + vAy * nObj.y + vAz * nObj.z);
  vec3 V = normalize(vCam - vWP);
  float nv0 = dot(N, V);
  if (nv0 < .03) N = normalize(N + V * (.03 - nv0));
  vec3 col = surf(N, V, vWP, vL, max(eD, 0.));
  // where it meets its neighbour: a hairline
  float seam = 0.;
  for (int i = 0; i < 3; i++){
    if (float(i) >= uNCut) break;
    seam = max(seam, uCutJoin[i] * (1. - smoothstep(.0, .011, sdSeg(vL.xy, uCut[i].xy, uCut[i].zw))));
  }
  col *= 1. - .5 * seam * face;
  col *= (1. - .24 * uDimO) * (1. + .22 * uPerf);   // while one piece plays its room the others step back
  // a lock's flash along the edges, a glint sweeping over the whole mark
  col += S(vec3(1., .93, .78)) * uLock * (exp(-eD * 18.) * .9 + .14);
  float sw = exp(-sq((dot(vWP.xy, vec2(.82, .57)) - uSweep) * 1.6));
  col += S(vec3(1., .96, .86)) * sw * uGlint * (.25 + .75 * sq(1. - clamp(nv0, 0., 1.)));
  col = any(isnan(col)) || any(isinf(col)) ? vec3(0.) : min(col, vec3(16.));   // never a stray pixel
  #ifdef MIRROR
    vec3 wm = vec3(vWP.x, 2. * uFloorY - vWP.y, vWP.z);
    vec3 rdm = normalize(wm - cameraPosition);
    float fr = .06 + .94 * pow(1. - clamp(-rdm.y, 0., 1.), 4.);
    gl_FragColor = vec4(col, clamp(fr * 1.05, 0., 1.) * exp(-max(vWP.y - uFloorY, 0.) * .55) * uMirA);
  #else
    gl_FragColor = vec4(col, 1.);
  #endif
}`;function Gt(e,o,t){const a=Array.from({length:3},(y,f)=>e.cuts[f]?new le(e.cuts[f].a.x,e.cuts[f].a.y,e.cuts[f].b.x,e.cuts[f].b.y):new le),c=o.idx("0"),n=o.idx(t),i=o.idx("a");return{uCentre:{value:e.centre},uAxis:{value:e.axis},uCut:{value:a},uCutN:{value:Array.from({length:3},(y,f)=>e.cuts[f]?.out.clone()??new q)},uCutJoin:{value:new _},uNCut:{value:e.cuts.length},uLock:{value:0},uGlint:{value:0},uSweep:{value:-9},uMirA:{value:.85},uPerf:{value:0},uPerfT:{value:0},uDimO:{value:0},tGlyph:{value:o.tex},uGrid:{value:new q(o.cols,o.rows)},uGlyphRange:{value:new le(c,n-c,i,26)}}}function Ke(e,o,t,a,c){const n=new Fe({uniforms:{...e,...o,envMap:{value:c}},vertexShader:Nt,fragmentShader:Dt+Tt[t]+Ot,defines:a?{MIRROR:1}:{},side:a?ut:vt,transparent:a,depthWrite:!a});return n.envMap=c,n}const Vt=34,Q=[{room:"shell",t0:.1,dur:5.7,p:[[-.15,.12,-2],[-.8,.85,-.8],[-.7,.55,.32],[0,0,0]],axis:[.3,.9,.3],ang:3.7,swoop:.5,col:"#ff8a00"},{room:"code",t0:1.5,dur:5.4,p:[[-1.1,1.65,-.2],[-2,1.25,.3],[-1,.5,.2],[0,0,0]],axis:[.9,.2,.4],ang:3.2,swoop:.3,col:"#2f56e0"},{room:"studio",t0:3,dur:5.6,p:[[.4,.25,-2.5],[-1,-.7,-1.3],[-.5,.5,-.3],[0,0,0]],axis:[.2,1,.1],ang:4.4,swoop:.55,col:"#ffb81f"},{room:"mind",t0:4.6,dur:5.4,p:[[1.55,1.35,-.1],[.7,-1.25,.32],[-1.2,-.85,.26],[0,0,0]],axis:[.7,.6,.5],ang:3.9,swoop:.3,col:"#7b4dff"},{room:"vault",t0:6.2,dur:5.2,p:[[-1.9,-.75,-.1],[-1.7,-.95,.3],[-.9,-.25,.2],[0,0,0]],axis:[.1,.8,.6],ang:3.4,swoop:.3,col:"#8d97a8"},{room:"blue",t0:7.7,dur:5.2,p:[[1.6,-.55,-.4],[1.7,1.5,-.2],[-.7,1,.2],[0,0,0]],axis:[.5,.5,.8],ang:4.1,swoop:.3,col:"#1f66ff"}],re=Q.map(e=>e.t0+e.dur),K=Math.max(...re),Et=e=>.6*e*e*(3-2*e)+.4*(1-Math.pow(1-e,3)),Ae=(e,o,t,a,c)=>{const n=1-c;return n*n*n*e+3*n*n*c*o+3*n*c*c*t+c*c*c*a},jt=(e,o,t)=>{const a=e.p,c=Ae(a[0][2],a[1][2],a[2][2],a[3][2],o)+e.swoop*Math.pow(Math.sin(Math.PI*o),2);return c*t.D*(c>0?t.near:1)},_t=(e,o)=>{const t=e-o,a=.5;return t>=a?e:t<=-a?o:o+(t+a)*(t+a)/(4*a)};function Ce(e,o,t,a){const c=Q[e];if(o<c.t0)return null;const n=Et(ye((o-c.t0)/c.dur)),i=c.p;return a.set(Ae(i[0][0],i[1][0],i[2][0],i[3][0],n)*t.hw*t.dir*t.xk,_t(t.cy[e]+Ae(i[0][1],i[1][1],i[2][1],i[3][1],n)*t.hh,t.minY)-t.cy[e],jt(c,n,t)),a}const Pe=new _,Ye=new qe,Ie=new qe,Bt=new _,Wt=()=>({pos:new _,quat:new qe,scale:1,f:0,tau:-1,lock:0});function Kt(e,o,t,a){const c=Q[e],n=ye((o-c.t0)/c.dur),i=o-(c.t0+c.dur);a.f=n,a.tau=i,Ce(e,o,t,a.pos)??a.pos.set(0,0,0);const y=x(0,.96,n);Pe.set(c.axis[0],c.axis[1],c.axis[2]).normalize(),Ye.setFromAxisAngle(Pe,c.ang*Math.pow(1-y,1.5)),Ie.setFromAxisAngle(Pe.set(0,0,1),.14*Math.sin(o*2.3+e*1.7)*(1-y)),a.quat.copy(Ie).multiply(Ye);let f=x(0,.07,n);if(i>0){const v=c.p,m=Bt.set((v[3][0]-v[2][0])*t.hw*t.dir*t.xk,(v[3][1]-v[2][1])*t.hh,(v[3][2]-v[2][2])*t.D).normalize();a.pos.addScaledVector(m,.085*Math.exp(-i*7)*Math.sin(i*25)),f+=Math.sin(Math.min(i*10,Math.PI))*Math.exp(-i*3)*.05,a.lock=Math.exp(-i*5.5)}else a.lock=0;return a.scale=f,a}const Ue=e=>{const o=document.querySelector(e);if(!o)return null;const t=o.getBoundingClientRect();return t.width>4&&t.height>4?{l:t.left,t:t.top,r:t.right,b:t.bottom}:null},Yt=(e,o,t)=>e.l<o.r+t&&e.r>o.l-t&&e.t<o.b+t&&e.b>o.t-t;function It(e,o,t){const a=e/o<=.9,c=a?40:30,n=[".mc-spine",".mc-work",".mc-links"].map(S=>Ue(`[data-overlay="finale"] ${S}`)).filter(Boolean),i=a?{u:.5,v:.28,hFrac:.2,fov:c,phone:a}:{u:t?.24:.76,v:.43,hFrac:.4,fov:c,phone:a};if(!n.length)return i;const y=Ue(".world-rail"),f=Math.max(18,e*.03),v=t?f:Math.max(f,y&&y.r<e/3?y.r+18:0),m=t?Math.max(f,y&&y.l>e*2/3?e-y.l+18:0):f,l=a?96:100,k=56,h=1.2,w=3.87/2,V=n.reduce((S,L)=>S+(L.l+L.r)/2,0)/n.length,D=a?e/2:V<e/2?e*.78:e*.22,X=a?o*.3:o*.43,Y=Math.min(o*(a?.3:.52),(e-v-m)/(w*h));for(let S=Y;S>o*.12;S-=5){const L=w*S*h,b=S*h;let C=null;const F=a?(v+e-m)/2:v+L/2,z=a?F:e-m-L/2;for(let R=F;R<=z;R+=12){const p=S*.22;for(let E=l+b/2;E<=o-k-b/2-p;E+=12){const G={l:R-L/2,r:R+L/2,t:E-b/2,b:E+b/2+p};if(n.some(A=>Yt(G,A,a?16:52)))continue;const H=-Math.abs(R-D)*.35-Math.abs(E-X)*.5;(!C||H>C.s)&&(C={cx:R,cy:E,s:H})}}if(C)return{u:C.cx/e,v:C.cy/o,hFrac:S/o,fov:c,phone:a}}return i}const Ut=`
float sq(float x){ return x * x; }
uniform float uFlash, uBulge, uDim, uRingR, uRingW, uRingA; uniform vec2 uRingC;
vec3 look(vec2 uv){
  vec2 asp = vec2(uAsp, 1.), sc = (uv - .5) * asp;
  vec3 c;
  if (abs(uBulge) > .002){
    vec2 b = sc * uBulge * .45 * exp(-dot(sc, sc) * 1.5) / asp;
    c = vec3(samp(uv - b * 1.07).r, samp(uv - b).g, samp(uv - b * .93).b);
  } else c = samp(uv);
  c *= 1. - uDim * (.08 + .22 * smoothstep(.2, 1., length(sc)));
  float r = length((uv - uRingC) * asp);
  float band = exp(-sq((r - uRingR) / max(uRingW, 1e-3)));
  c = mix(c, S(vec3(1., .62, .18)), clamp(band * uRingA * .5, 0., 1.));
  c += S(vec3(1., .97, .9)) * exp(-sq((r - uRingR) / max(uRingW * .3, 1e-3))) * uRingA * .55;
  c += S(vec3(1., .90, .70)) * smoothstep(uRingR, uRingR * .35, r) * uRingA * .11;   // the light inside the ring
  c = 1. - (1. - c) * exp(-uFlash * 2.2);
  return c;
}`,Le=28,$t=`
uniform float uSparkT[6]; uniform vec3 uSparkP[6]; uniform vec3 uSparkC[6];
float hh(float n){ return fract(sin(n * 127.1 + 31.7) * 43758.5453); }
void pt(float id, out vec3 pos, out float size, out vec4 col){
  float k = floor(id / ${Le}.), j = id - k * ${Le}.;
  int ki = int(clamp(k, 0., 5.));
  float tau = uSparkT[ki];
  float a = j * 2.39996 + k * 1.3, r1 = hh(j + k * 41.), r2 = hh(j * 3.1 + k * 7.);
  vec3 dir = normalize(vec3(cos(a), sin(a), (r2 - .5) * 1.6));
  float life = tau < 0. ? 0. : 1. - smoothstep(.12, .85 + r2 * .3, tau);
  pos = uSparkP[ki] + dir * (.7 + 1.8 * r1) * (1. - exp(-max(tau, 0.) * 3.2)) * .9 + vec3(0., -tau * tau * .35, 0.);
  size = (5. + 13. * r1) * life;
  col = vec4(uSparkC[ki], life * .9);
}`,xe=30,$e=[.16,0,.14,.1,0,.07],Xe=K+2.7,ge=2.25,Xt=["shell","code","studio","mind","vault","blue"],Jt=["#8f4a00","#2038a8","#8a5a00","#5a32c8","#454f60","#1640c0"],Qt=[40,21,10,3.2],Ht=[.1,.17,.32,.95],ze=-1.55,$=new _,J=new _,Zt=[[.75,.38,.06],[0,0,0],[.5,.36,.15],[.22,.12,.45],[0,0,0],[.06,.18,.6]],eo="uniform float uSize; varying vec2 vP; void main(){ vP = position.xy * 2.; vec3 w = (modelMatrix * vec4(0., 0., 0., 1.)).xyz; vec4 mv = viewMatrix * vec4(w, 1.); mv.xy += position.xy * uSize; gl_Position = projectionMatrix * mv; }",to="float sq(float x){ return x * x; } uniform vec3 uColor; uniform float uAlpha, uRing; varying vec2 vP; void main(){ float r = sqrt(dot(vP, vP)); float a = exp(-r * r * 3.2) * uAlpha * (1. - smoothstep(.8, 1., r)); a += uRing > 0. ? exp(-sq((r - uRing * .86) / (.025 + .05 * uRing))) * (1. - uRing) * .75 : 0.; if (a < .003) discard; gl_FragColor = vec4(uColor, clamp(a, 0., 1.)); }";async function uo(e){const o=await Rt(e),t=gt(e),a=t<0,c=new URLSearchParams(location.search),n=c.has("fy")?Number(c.get("fy")):null,i=(c.get("hide")??"").split(","),y=!i.includes("mirror"),f={uFlash:{value:0},uBulge:{value:0},uDim:{value:0},uRingR:{value:0},uRingW:{value:.02},uRingA:{value:0},uRingC:{value:new q(.5,.5)}},v=yt(e,{atlas:o,pin:"G",inW:.08,uniforms:f,size:e.quality?void 0:(s,d,M)=>[Math.round(s*M*1.7),Math.round(d*M*1.7)],frag:Ut}),m=new ft(30,e.viewport.aspect,.1,120),l=Ft(v.G.uTime);l.uDirX.value=t,l.uFloorY.value=ze,l.uRays.value=1.5,l.uBokeh.value=1.25,l.uFlagVis.value=Number(c.get("fv")??0),e.quality||(l.uBokeh.value=.9);const k=new me(new _e(2,2),qt(l));k.frustumCulled=!1,k.renderOrder=-10,v.world.add(k);const h=Lt(),w=new ht;v.world.add(w);const V=h.map(s=>Gt(s,o,Mt.M)),D=h.map((s,d)=>{const M=new me(s.geometry,Ke(l,V[d],d,!1,e.env));return M.frustumCulled=!1,w.add(M),M}),X=y?h.map((s,d)=>{const M=new me(s.geometry,Ke(l,V[d],d,!0,e.env));return M.frustumCulled=!1,M.renderOrder=2,i.includes("mirror"+d)||w.add(M),M}):[],Y=Q.map(s=>new dt(s.col)),S=wt({count:6*xe*4,shared:v.G,normal:!0,depthTest:!0,order:6}),L=St({count:6*Le,shared:v.G,normal:!0,depthTest:!0,order:7,core:.6,pt:$t,uniforms:{uSparkT:{value:new Array(6).fill(-1)},uSparkP:{value:h.map(s=>new _(s.centre.x,s.centre.y,0))},uSparkC:{value:Y.map(s=>new _(s.r,s.g,s.b))}}});i.includes("trail")||v.world.add(S.mesh),i.includes("spark")||v.world.add(L.mesh),Zt.forEach((s,d)=>l.uShadC.value[d].set(s[0],s[1],s[2]));const b=new _e(1,1),C=Y.map(s=>{const d=new me(b,new Fe({uniforms:{uSize:{value:3.2},uColor:{value:new _(s.r,s.g,s.b)},uAlpha:{value:0},uRing:{value:0}},vertexShader:eo,fragmentShader:to,transparent:!0,depthWrite:!1}));return d.frustumCulled=!1,d.renderOrder=5,i.includes("halo")||w.add(d),d}),F=Xt.map((s,d)=>{const M=Pt.labels[s][e.lang],ue=(d+1).toString().padStart(2,"0"),u=a?`${zt(ue)} · ${M}`:`${ue} · ${[...M.toUpperCase()].join(" ")}`,j=kt(u,{font:a?Be.ar:Be.mono,px:110,weight:a?700:600,rtl:a,color:Jt[d],normal:!0,align:"center"});return j.mesh.renderOrder=9,j.mesh.visible=!1,v.world.add(j.mesh),j}),z=new Array(6).fill(0),R={u:.5,v:.5,hFrac:.4,fov:30,phone:!1},p={...R};let E=!1,G={hw:4,hh:2,D:8,dir:t,near:1,xk:1,cy:h.map(s=>s.centre.y),minY:ze+.3};const H=()=>{const s=It(e.viewport.width,e.viewport.height,a);Object.assign(R,s),E||Object.assign(p,s)};H(),document.fonts?.ready.then(H).catch(()=>{});const A=Wt(),ie=new q,He={grow:0,screen:0};let Te=-1;return await v.warm(m),{scene:v.scene,camera:m,get light(){return!0},update({p:s,t:d,dt:M,v:ue}){const u=ye(s,0,1)*Vt,j=e.viewport.aspect;v.tick(d,ue),v.setP(s);const ve=bt(e,d,M),we=!E||d-Te>.6?1:1-Math.exp(-M*3);Te=d,E=!0,p.u=W(p.u,R.u,we),p.v=W(p.v,R.v,we),p.hFrac=W(p.hFrac,R.hFrac,we),p.fov=R.fov,p.phone=R.phone;const Ne=x(.3,11,u),ne=W(.5,p.u,Ne),se=W(.5,p.v,Ne),fe=Math.tan(p.fov*Math.PI/360),Se=1/(p.hFrac*fe);G.hh=Se*fe,G.hw=G.hh*j,G.D=Se,G.near=p.phone?1.4:1,G.xk=p.phone?.75:1;const T=u-K,De=Math.max(0,T)*.72,be=T>=0?pt(De):He;let Oe=T>=0?Math.exp(-T*5)*Math.cos(T*16)*.02:0;for(let r=0;r<5;r++){const g=u-re[r];g>0&&(Oe+=Math.exp(-g*8)*Math.sin(g*26)*.0045)}const he=Se*(1+.1*(1-x(0,14,u)))*(1-.035*x(15,34,u))*(1-Oe),Re=W(.07,-.03,x(0,14,u))+.04*Math.sin(u*.11)*x(14,18,u)+ve.x*.035,de=W(.01,.075,x(0,10,u))+.012*Math.sin(u*.17)*x(14,18,u)+ve.y*.02;m.fov=p.fov,m.aspect=j,m.setViewOffset(e.viewport.width,e.viewport.height,-(ne-.5)*e.viewport.width,(.5-se)*e.viewport.height,e.viewport.width,e.viewport.height),m.position.set(Math.sin(Re)*Math.cos(de)*he,.12+Math.sin(de)*he,Math.cos(Re)*Math.cos(de)*he),m.lookAt(0,.12,0),m.updateMatrixWorld(),l.uInvProj.value.copy(m.projectionMatrixInverse),ie.set((ne-.5)*j,.5-se),l.uAsp.value=j,l.uKdir.value=1/(2*fe),l.uMarkP.value.copy(ie),l.uGlowC.value.set(-.4*ie.x,-.4*ie.y),l.uReveal.value=x(.8,5.5,u),l.uPar.value.set(Re*2.4,de*2.4),l.uShock.value=T>=0&&T<3?T:-1;const Z=x(K+1.2,K+4.2,u),Ze=n!==null?n*Z:mt(e,Z,d,M)*.85;w.rotation.set(-ve.y*.1*Z+.02*Math.sin(u*.31)*Z,Ze+ve.x*.16*Z,0),w.position.y=Math.sin(u*.9)*.04*Z,w.updateMatrixWorld(!0);let Me=0;for(let r=0;r<6;r++){const g=(u-Xe-r*ge)/ge;z[r]=g>0&&g<1?x(0,.16,g)*(1-x(.8,1,g)):0,Me=Math.max(Me,z[r])}const Ge=x(28.6,30.4,u),Ve=d%7.5/1.8,ke=Ge>.5?Ve:(u-(K+.35))%6.5/1.8,Ee=Ge>.5?Ve<=1:u>=K+.35&&ke<=1;for(let r=0;r<6;r++){const g=h[r];Kt(r,u,G,A);const N=D[r],ee=u>=Q[r].t0;N.visible=ee,N.position.set(g.centre.x+A.pos.x,g.centre.y+A.pos.y,A.pos.z),N.quaternion.copy(A.quat),N.scale.setScalar(Math.max(A.scale,1e-4));const O=V[r];O.uLock.value=A.lock,O.uPerf.value=z[r],O.uPerfT.value=ye((u-Xe-r*ge)/ge),O.uDimO.value=Me*(1-z[r]),O.uSweep.value=Ee?W(-3.8,3.8,ke):-9,O.uGlint.value=Ee?Math.sin(ke*Math.PI):0;const B=P=>x(0,.14,u-re[P]);for(let P=0;P<g.cuts.length;P++)O.uCutJoin.value.setComponent(P,B(r)*B(g.cuts[P].with));if(y){const P=X[r];P.visible=ee,P.position.copy(N.position),P.quaternion.copy(N.quaternion),P.scale.copy(N.scale)}N.getWorldPosition($);const I=Math.max($.y-ze,0);l.uShad.value[r].set($.x,$.z,.62+I*.12,ee?.55*Math.exp(-I*.45)*x(0,.3,A.f):0),L.U.uSparkT.value[r]=u-re[r],l.uRip.value[r]=u-re[r];const te=C[r],oe=te.material.uniforms;te.visible=ee,te.position.copy(N.position);const ae=(u-Q[r].t0)/.9;oe.uRing.value=A.tau>0&&A.tau<.8?A.tau/.8:ae>0&&ae<1?ae:0,oe.uAlpha.value=($e[r]+(.5-$e[r])*(1-x(.55,1,A.f)))*x(0,.15,A.f),oe.uSize.value=3.4*(.7+.3*A.scale)}for(let r=0;r<6;r++){const g=Q[r],N=Y[r],ee=1-x(0,.55,u-re[r]),O=h[r].centre;for(let B=0;B<xe;B++){const I=Ce(r,u-B*.034,G,$),te=I?$.x:0,oe=I?$.y:0,ae=I?$.z:0,P=Ce(r,u-(B+1)*.034,G,J),at=I&&P?Math.hypot(te-J.x,oe-J.y,ae-J.z):0,je=B/xe,ct=I&&P&&at>1e-4?Math.pow(1-je,1.4)*ee*x(0,.25,u-g.t0):0,rt=W(1,.18,je);for(let U=0;U<4;U++)S.set((r*xe+B)*4+U,O.x+te,O.y+oe,ae,O.x+(P?J.x:0),O.y+(P?J.y:0),P?J.z:0,N.r*(U===3?.85:1),N.g*(U===3?.85:1),N.b*(U===3?.85:1),ct*Ht[U],Qt[U]*rt,0,1,0)}}S.dirty(),f.uFlash.value=T<-.1?0:T<0?x(-.1,0,T):Math.exp(-T*5.2),f.uDim.value=u<K?x(K-1.7,K-.06,u):0,f.uBulge.value=be.screen*1.15;const et=Math.hypot(Math.max(ne,1-ne)*j,Math.max(se,1-se));f.uRingC.value.set(ne,1-se),f.uRingR.value=be.grow*et*1.05,f.uRingW.value=.014+.06*be.grow,f.uRingA.value=T>=0?1-x(.35,.68,De):0;const tt=e.viewport.width<600?36:40,ot=2*he*fe/e.viewport.height;for(let r=0;r<6;r++){const g=F[r];g.mesh.visible=z[r]>.01,g.mesh.visible&&(g.mesh.position.set(0,-1.34,.8),g.mesh.quaternion.copy(m.quaternion),g.set(tt*ot),g.U.uAlpha.value=z[r])}v.draw(m)},resize(){v.resize(),m.aspect=e.viewport.aspect,m.updateProjectionMatrix(),H()},dispose(){v.dispose(),S.dispose(),L.dispose(),k.geometry.dispose(),k.material.dispose();for(const s of[...D,...X,...C])s.material.dispose();b.dispose(),F.forEach(s=>s.dispose());for(const s of h)s.geometry.dispose()}}}export{uo as default};
