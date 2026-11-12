import{f as nt,C as Z,g as ct,M as W,P as ce,S as ee,V as le,G as lt,w as rt,A as De,x as re,m as vt,t as pt,y as mt,z as ht,F as ft,I as dt,J as xt,n as T,Q as wt,o as $,r,K as gt,N as yt,O as Se,p as At,e as z,T as Ft}from"./EditionWorld.astro_astro_type_script_index_0_lang.CQUQqKzf.js";import{m as We}from"./media-base.CkYm9YKi.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const M=Ft.constellation.sec,te=["studio","business","people","utility"],ve=5,pe=6.2,G=6.6,O=2.5,Oe=16.9,me={f0:.225,f1:.875,stratum:.66},g=1.7,Ve=.44,ae=`
  varying vec3 vN, vW; varying vec2 vUv;
  void main(){ vN = normal; vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,_e=`
  float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float lum(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }`,bt=`
  uniform sampler2D uName, uFam, uFilm; uniform float uNameAsp, uFamAsp, uFilmAsp, uTextH;
  uniform vec3 uSize, uRight, uUp, uFwd, uTint; uniform vec2 uStack;   // uStack: this stratum's slice of the compact block's front (0 bottom, 1 top)
  uniform float uShift, uFade, uSweep, uStackAsp, uResolve, uHatch, uFilmAmt, uCutFace, uGhost, uFocus, uTime, uLive, uDim, uExit, uCells, uPx;
  varying vec3 vN, vW; varying vec2 vUv;
  ${_e}
  float nameA(vec2 uv){   // the family's name, fitted to the face (height uTextH of it, at most .88 of its width)
    float fa = uSize.x / uSize.y, th = min(uTextH, .78 * fa / uNameAsp);
    vec2 t = vec2((uv.x - .5 + uShift) * fa / (th * uNameAsp) + .5, (uv.y - .5) / th + .5);
    return (t.x < 0. || t.x > 1. || t.y < 0. || t.y > 1.) ? 0. : texture2D(uName, t).a;
  }
  float famA(vec2 uv){    // FAMILIES across the whole compact block (the passage's word: .92 of its width)
    float sv = mix(uStack.x, uStack.y, uv.y);
    float tw = .92, thv = tw / uFamAsp * uStackAsp;
    vec2 t = vec2((uv.x - .5) / tw + .5, (sv - .5) / thv + .5);
    return (t.x < 0. || t.x > 1. || t.y < 0. || t.y > 1.) ? 0. : texture2D(uFam, t).a;
  }
  vec3 film(vec2 uv){     // the film, covering the face
    float fa = uSize.x / uSize.y; vec2 s = fa > uFilmAsp ? vec2(1., uFilmAsp / fa) : vec2(fa / uFilmAsp, 1.);
    return texture2D(uFilm, (uv - .5) * s + .5).rgb;
  }
  void main(){
    vec3 V = normalize(cameraPosition - vW);
    vec3 n = normalize(vN);
    float front = step(.5, n.z), top = step(.5, n.y), side = step(.5, abs(n.x));
    float fres = pow(1. - abs(dot(V, normalize(uRight * n.x + uUp * n.y + uFwd * n.z))), 3.);
    vec2 px = floor(gl_FragCoord.xy / uPx);
    float tw = uTime * 7.;
    // the glass body: dark, glowing the colour of its room, a little lighter toward the top (light from behind and above)
    vec3 tint = uTint;
    vec3 col = tint * (.010 + .014 * vUv.y) + vec3(.004, .0035, .003);
    col += mix(tint, vec3(1., .92, .82), .55) * fres * .07;
    float grain = h21(px + floor(tw) * 17.31);
    col *= .85 + .3 * grain;
    if (front > .5) {
      // which word: FAMILIES (the passage's) resolving grain by grain into this stratum's name
      float g = h21(px * .5 + 3.7);
      float sel = step(g, uResolve * 1.04 - .02);
      float a = mix(famA(vUv), nameA(vUv), sel);
      // light through the letters: inner copies deeper in the glass (parallax), the face's own letter on top
      vec3 vv = vec3(dot(V, uRight), dot(V, uUp), dot(V, uFwd));
      vec2 par = -vv.xy / max(vv.z, .25) / uSize.xy * .5;
      float a1 = mix(famA(vUv + par * .35), nameA(vUv + par * .35), sel), a2 = mix(famA(vUv + par * .8), nameA(vUv + par * .8), sel);
      vec3 champ = vec3(1., .86, .66);
      float spark = step(.9, h21(px * .37 + floor(tw * .5) * 7.7)) * (.6 + .4 * sin(uTime * 3. + px.x));
      vec3 lit = champ * (1.1 + .5 * uFocus) * a + mix(champ, tint * 2., .5) * max(a1 - a, 0.) * .22 + tint * max(a2 - a, 0.) * .12 + champ * spark * a * .9;
      // the glass catches the light: a soft band across the face, moved by the scroll (uExit's stand-in: the band's place)
      float band = exp(-pow((vUv.x - vUv.y * .35 - uSweep) * 3.2, 2.));
      col += vec3(1., .9, .78) * band * .035 + tint * band * .03;
      vec3 face = col + lit * (1. - uCutFace) * mix(.55, 1., max(uFocus, 1. - uDim));
      // the cut face: copper hatch with the name cut through it as windows onto the film, then the film over the whole face
      if (uCutFace > 0.) {
        float an = nameA(vUv), edge = smoothstep(.15, .5, an) * (1. - smoothstep(.5, .85, an));
        float d = fract((gl_FragCoord.x + gl_FragCoord.y) / (6. * uPx));
        float hatch = smoothstep(.62, .5, abs(d - .5) * 2.);
        float sweep = step(vUv.x + .12 * vn(vUv * vec2(6., 3.) + 2.), uHatch * 1.25);
        vec3 sec = vec3(.03, .02, .014) + vec3(.82, .5, .26) * hatch * .55 * sweep;
        vec3 f = film(vUv);
        float fin = step(h21(px * .5 + 9.1) * .7 + vn(vUv * 9.) * .3, uFilmAmt * 1.03);
        vec3 through = f * (1.3 + .3 * uFocus) * sweep;                      // the film, through the letters
        float win = smoothstep(.35, .65, an);
        vec3 c = mix(sec, through, win * sweep);
        c = mix(c, mix(f * .26 + sec * .08, through + champ * .05, win), fin);   // the film over the whole face, the name a brighter window in it
        c += champ * edge * (.8 - .3 * fin) * sweep;                        // the letters' cut edge catches the light
        c *= mix(.5, 1., max(uFocus, uLive));
        // the exit: the cut face turns to the Studio wall's copper LED cells, the name to its grey word
        if (uExit > 0.) {
          vec2 cell = vUv * vec2(uSize.x / uSize.y * uCells, uCells);
          vec2 ci = floor(cell), cf = fract(cell) - .5;
          float on = step(.42, h21(ci + 5.)) * (.5 + .5 * h21(ci + 11.));
          vec3 led = vec3(.5, .3, .16) * on * smoothstep(.5, .38, max(abs(cf.x), abs(cf.y)));
          vec3 ex = mix(led + f * .18, vec3(.4), step(.5, an));
          c = mix(c, ex, uExit);
        }
        face = mix(face, c, uCutFace);
      }
      col = face + vec3(1., .9, .8) * smoothstep(.985, 1., vUv.y) * .12;   // a faint lit top edge, not an outline
    } else if (top > .5) {
      col = col * .7 + tint * .012 + vec3(1., .92, .8) * .02 * fres;
    } else if (side > .5) {
      col *= .6; col += tint * .02 * (1. - abs(vUv.y - .5) * 2.);
    }
    // the cut-away piece goes to grain as it lifts off
    if (uGhost > 0. && h21(px + 1.3) < uGhost) discard;
    if (uFade > 0. && h21(px + 7.9) < uFade) discard;   // (the exit: the other strata go to grain)
    gl_FragColor = vec4(col * (1. - uFade * .6), 1.);
  }`,Ut=`
  uniform float uAmt, uAsp; varying vec3 vN, vW; varying vec2 vUv;
  float hair(float d, float w){ float px = fwidth(d); return 1. - smoothstep(w, w + px * 1.2, abs(d)); }
  void main(){
    vec2 q = vUv - .5, e = .5 - abs(q);
    float b = max(hair(e.x * uAsp, .004), hair(e.y, .004 * 1.));
    vec2 c = abs(q) - vec2(.5 - .06 / uAsp, .5 - .06);
    float cross = (step(c.x, 0.) * step(-.035 / uAsp, c.x) * hair(c.y, .003) + step(c.y, 0.) * step(-.035, c.y) * hair(c.x * uAsp, .003)) * step(.0, 1.);
    float fill = .05 + .05 * (1. - abs(q.y) * 2.);
    vec3 copper = vec3(.95, .62, .34);
    vec3 col = vec3(1., .9, .76) * fill + copper * (b * .9 + cross * .8);
    gl_FragColor = vec4(col * uAmt, 1.);
  }`,Tt=`
  uniform float uAmt, uAsp; varying vec3 vN, vW; varying vec2 vUv;
  float hair(float d, float w){ float px = fwidth(d); return 1. - smoothstep(w, w + px * 1.2, abs(d)); }
  void main(){
    float x = vUv.x * uAsp, y = vUv.y - .5;
    float line = hair(y, .012);
    float ticks = (hair(x - .004, .004) + hair(x - (uAsp - .004), .004)) * step(-.45, y);
    float ax = min(x, uAsp - x), arrow = step(ax, .12) * step(abs(y), ax * .28);
    float a = clamp(line + ticks + arrow, 0., 1.);
    gl_FragColor = vec4(vec3(.85, .55, .3) * a * uAmt, 1.);
  }`,Mt=`
  uniform vec3 uTint; uniform vec2 uGlow; uniform float uTime, uGlowAmt, uPx, uLed; varying vec3 vN, vW; varying vec2 vUv;
  ${_e}
  float hair(float d, float w){ float px = fwidth(d); return 1. - smoothstep(w, w + px * 1.2, abs(d)); }
  void main(){
    vec2 p = vW.xy;
    vec3 col = vec3(.010, .0075, .006);
    vec2 g = fract(p / 1.6 + .5) - .5;
    float cross = (hair(g.x, .006) * step(abs(g.y), .07) + hair(g.y, .006) * step(abs(g.x), .07));
    col += vec3(.5, .32, .18) * cross * .1;
    float d = length((p - uGlow) * vec2(.55, 1.));
    col += uTint * exp(-d * d * .06) * .05 * uGlowAmt + vec3(.5, .4, .3) * exp(-d * d * .02) * .012;
    if (uLed > 0.) {   // the exit: the Studio's copper LED wall comes up behind, cell by cell
      vec2 cell = gl_FragCoord.xy / (40. * uPx), ci = floor(cell), cf = fract(cell) - .5;
      float on = step(.45, h21(ci + 5.)) * (.35 + .65 * h21(ci + 11.)), show = step(h21(ci + 23.), uLed);
      col = mix(col, vec3(.24, .14, .075) * on * smoothstep(.5, .4, max(abs(cf.x), abs(cf.y))) + vec3(.012, .009, .007), show);
    }
    col *= .85 + .3 * h21(floor(gl_FragCoord.xy / uPx) + floor(uTime * 12.) * 13.1);
    gl_FragColor = vec4(col, 1.);
  }`,zt=async n=>{const F=n.lang==="ar",b=F?-1:1,V=matchMedia("(prefers-reduced-motion: reduce)").matches,oe=F?'800 300px "Cairo Variable", sans-serif':'700 340px "Space Grotesk Variable", sans-serif';await Promise.race([document.fonts.load(oe,F?"العائلات الاستوديو الأعمال الأشخاص الأدوات":"FAMILIES STUDIO BUSINESS PEOPLE UTILITY").catch(()=>null),new Promise(t=>setTimeout(t,2500))]);const I=new nt;I.background=new Z("#0b0907");const y=new ct(30,n.viewport.aspect,.1,200),he=t=>{const o=document.createElement("canvas"),s=o.getContext("2d"),c=F?300:340;s.font=oe;const i=Math.ceil(s.measureText(t).width)+c*.2;o.width=Math.min(4096,i),o.height=Math.round(c*(F?1.5:1.12)),s.font=oe,s.fillStyle="#fff",s.textAlign="center",s.textBaseline="middle",s.direction=F?"rtl":"ltr",s.fillText(t,o.width/2,o.height*(F?.56:.53));const v=new gt(o);return v.anisotropy=8,v.generateMipmaps=!0,v.minFilter=yt,{tex:v,asp:o.width/o.height}},He=t=>F?Se[t].ar:Se[t].en.toUpperCase(),se=he(F?"العائلات":"FAMILIES"),_=new W(new ce(120,80),new ee({uniforms:{uTint:{value:new Z("#b8733a")},uGlow:{value:new le},uTime:{value:0},uGlowAmt:{value:0},uPx:{value:1},uLed:{value:0}},vertexShader:ae,fragmentShader:Mt}));_.position.z=-14,I.add(_);const P=_.material.uniforms,k=new lt;I.add(k);const ie=new rt(1,1,1),fe=new Z("#b8733a"),de=t=>new ee({uniforms:{uName:{value:t.tex},uFam:{value:se.tex},uFilm:{value:null},uNameAsp:{value:t.asp},uFamAsp:{value:se.asp},uFilmAsp:{value:16/9},uTextH:{value:.64},uSize:{value:new T(1,1,1)},uRight:{value:new T(1,0,0)},uUp:{value:new T(0,1,0)},uFwd:{value:new T(0,0,1)},uTint:{value:fe.clone()},uStack:{value:new le(0,1)},uStackAsp:{value:1},uShift:{value:0},uFade:{value:0},uSweep:{value:0},uResolve:{value:0},uHatch:{value:0},uFilmAmt:{value:0},uCutFace:{value:0},uGhost:{value:0},uFocus:{value:0},uTime:{value:0},uLive:{value:0},uDim:{value:0},uExit:{value:0},uCells:{value:9},uPx:{value:1}},vertexShader:ae,fragmentShader:bt}),d=te.map((t,o)=>{const s=he(He(t)),c=de(s),i=de(s),v=new W(ie,c),E=new W(ie,i),U=new W(new ce(1,1),new ee({uniforms:{uAmt:{value:0},uAsp:{value:10}},vertexShader:ae,fragmentShader:Tt,transparent:!0,blending:De,depthWrite:!1}));k.add(v,E,U);const h=re[t].apps[0],p=We(`motion/${h.id}/media/${h.clip}`),l=We(`motion/${h.id}/media/${h.clip.startsWith("room")?h.clip.replace(".mp4",".webp"):"card.webp"}`);return{id:t,i:o,name:s,mesh:v,piece:E,mu:c.uniforms,pu:i.uniforms,dim:U,screen:n.media.screen(p,l),tint:new Z(re[t].wash),y:0,hover:0}}),C=new W(new ce(1,1),new ee({uniforms:{uAmt:{value:0},uAsp:{value:2}},vertexShader:ae,fragmentShader:Ut,transparent:!0,blending:De,depthWrite:!1,side:vt}));k.add(C);const xe=pt(.34,!0,0,"now"),j=mt(n,"#f1dcc0",{thickness:1.6,dispersion:9});j.userData.mkLook="now";const Be=ht(j,.8),A=new W(xe,j);k.add(A);const we=new ft("#fff1dc",1.6);we.position.set(-3,5,6),I.add(we);const ge=new dt("#e0955a",30,14,1.5);ge.position.set(3,1,3),I.add(ge);const x=4,a={portrait:!1,dist:10,hs:1,gap:.4,ys:[0,0,0,0],yc:[0,0,0,0],ox:0,hh:1};function ye(){const t=a.portrait=n.viewport.portrait,o=n.viewport.aspect;y.fov=t?30:26,y.aspect=o,y.updateProjectionMatrix();const s=Math.tan(At.degToRad(y.fov/2)),c=t?.9:Math.min(.42,.62/o*1.1),i=x/(c*2*o);a.hh=i,a.dist=i/s;const v=t?me.f0:.13,E=t?me.f1:.93,U=(E-v)/4,h=t?me.stratum:.74,p=u=>i*(1-2*u);a.hs=p(0)-p(U*h),a.gap=p(0)-p(U*(1-h));for(let u=0;u<4;u++)a.ys[u]=p(v+U*u+U*h/2);const l=(a.ys[0]+a.ys[3])/2;for(let u=0;u<4;u++)a.yc[u]=l+(1.5-u)*a.hs;a.ox=t?0:-b*.2;const R=Math.max(1,n.viewport.dpr*n.viewport.height/852);for(const u of d)u.mu.uPx.value=R,u.pu.uPx.value=R;P.uPx.value=R}ye();const Ae=new xt,Fe=new le,be=(t,o)=>{Fe.set(t,o),Ae.setFromCamera(Fe,y);const s=Ae.intersectObjects(d.map(c=>c.mesh),!1)[0];return s?d.findIndex(c=>c.mesh===s.object):-1};let H=-1,Ue=-1,Te="";addEventListener("world:index-hover",t=>{const o=t.detail;Ue=o?te.indexOf(o):-1});let B=0;const N=new T,q=new T,Me=new T,ke=new T,Ce=new T,Y=new wt,qe=t=>{const o=t.image,s=o?.videoWidth||o?.width||16,c=o?.videoHeight||o?.height||9;return s/c};return{scene:I,camera:y,resize:ye,focus(t){t||(H=-1,d.forEach(o=>o.screen.pause()))},update({p:t,t:o,dt:s,active:c}){B=V?t:$(B,t,9,s);const i=B*M,v=a.portrait,E=V?0:o,U=z.inOut(r(ve,pe,i)),h=z.inOut(r(ve+.1,pe,i)),p=r(Oe,M,i),l=z.inOut(r(Oe,M-.6,i)),R=(i-G)/O,u=Math.max(0,Math.min(3,Math.floor(R))),K=i<G?0:i>=G+4*O?1:R-u,Qe=e=>i<G+e*O?0:i>=G+(e+1)*O?1:(i-G-e*O)/O,L=i<G-.2?-1:p>0?0:u,Ee=b*(.03+.11*h)*(1-l),$e=(.03+.06*h)*(1-l);k.rotation.set($e,Ee,0),k.position.set(-Math.sin(Ee)*g/2,0,0),k.updateMatrixWorld(),Y.setFromRotationMatrix(k.matrixWorld),Me.set(1,0,0).applyQuaternion(Y),ke.set(0,1,0).applyQuaternion(Y),Ce.set(0,0,1).applyQuaternion(Y);const je=d[0].y,Ye=a.dist*(v?.3:.42),Ke=b*(v?.26:.4)*x*z.inOut(r(M-2.6,M+.4,i)),Xe=a.dist+(Ye-a.dist)*l;q.set(Ke,je*l,g/2),y.position.set(q.x,q.y,g/2+Xe),y.lookAt(q);const Je=1-l;y.setViewOffset(n.viewport.width,n.viewport.height,a.ox*n.viewport.width*Je,0,n.viewport.width,n.viewport.height),y.updateMatrixWorld();const Ze=H>=0?H:Ue;let Le=fe;d.forEach(e=>{const f=e.i,X=a.yc[f]+(a.ys[f]-a.yc[f])*h,w=Qe(f);e.y=X;const J=g*Ve*z.out(r(0,.3,w)),ne=g-J,S=L===f,st=S?1:Ze===f?.8:0;e.hover=$(e.hover,st,5,s);const Ie=e.hover*.18*(1-l);e.mesh.scale.set(x,a.hs*(1-.004),ne),e.mesh.position.set(0,X,-g/2+ne/2+Ie);const Q=z.inOut(r(.12,.6,w));e.piece.visible=w>0&&w<.62&&J>.001,e.piece.scale.set(x,a.hs*(1-.004),Math.max(.001,J)),e.piece.position.set(b*Q*.3,X+Q*a.hs*.9,g/2-J/2+Ie+Q*2.2),e.piece.rotation.set(-Q*.35,b*Q*.15,0);const Ne=[(a.yc[f]-a.hs/2-(a.yc[3]-a.hs/2))/(4*a.hs),(a.yc[f]+a.hs/2-(a.yc[3]-a.hs/2))/(4*a.hs)],it=c&&w>0&&(p<=0||f===0);e.screen.want(it),c&&(S||p>0&&f===0)&&w>.3?e.screen.play():e.screen.pause();const Re=e.screen.texture;for(const m of[e.mu,e.pu])m.uSize.value.set(x,a.hs,ne),m.uRight.value.copy(Me),m.uUp.value.copy(ke),m.uFwd.value.copy(Ce),m.uStack.value.set(Ne[0],Ne[1]),m.uStackAsp.value=x/(4*a.hs),m.uResolve.value=U,m.uSweep.value=-.4+B*2.2+f*.07,m.uTime.value=E,m.uFilm.value=Re,m.uFilmAsp.value=qe(Re),m.uFocus.value=e.hover,m.uDim.value=L>=0&&!S?1:0,m.uFade.value=f?Math.min(1,l*1.15):0,m.uShift.value=b*.07*(1-l);const ut=r(.42,.7,w);e.mu.uCutFace.value=w>0?1:0,e.mu.uHatch.value=r(.16,.4,w),e.mu.uFilmAmt.value=ut,e.mu.uLive.value=S?1:0,e.mu.uExit.value=f===0?r(M-2.2,M-.5,i):0,e.mu.uCells.value=v?7:6,e.pu.uCutFace.value=0,e.pu.uGhost.value=r(.25,.62,w),e.pu.uFocus.value=1,e.tint.set(re[e.id].wash),S&&w>.3&&(Le=e.tint),e.dim.visible=!v,e.dim.scale.set(x,a.gap*.5,1),e.dim.position.set(0,X-a.hs/2-a.gap*.5,g/2+.02),e.dim.material.uniforms.uAsp.value=x/(a.gap*.5),e.dim.material.uniforms.uAmt.value=h*(1-p)*(S?.9:.4)}),d.forEach(e=>{e.mu.uTint.value.lerp(Le,1-Math.exp(-3*s)),e.pu.uTint.value.copy(e.mu.uTint.value)}),P.uTint.value.copy(d[0].mu.uTint.value),P.uTime.value=E,P.uLed.value=r(M-2.4,M-.6,i);const D=L>=0&&p<=0?d[L]:null,Pe=D?r(0,.06,K)*(1-r(.32,.46,K)):0;if(C.visible=Pe>.001,D){const e=g/2+.9-(.9+g*Ve)*z.out(r(0,.3,K));C.position.set(0,D.y,e),C.scale.set(x*1.3,a.hs*1.9,1),C.material.uniforms.uAmt.value=Pe,C.material.uniforms.uAsp.value=x*1.3/(a.hs*1.9)}const et=D?D.y:d[0].y;P.uGlow.value.set(0,et),P.uGlowAmt.value=$(P.uGlowAmt.value,D||p>0?1:.35,3,s);const tt=L>=0?L:0,ze=a.hs*.8,at=b*(x/2-ze*.9),ot=d[tt].y;N.set(at*(1-l)+q.x*l,ot,g/2+.35+.1*l),A.position.x=$(A.position.x,N.x,4,s),A.position.y=V?N.y:$(A.position.y,N.y,4,s),A.position.z=N.z,V&&A.position.copy(N);const Ge=ze/2*r(ve+.2,pe,i)*(1-.3*l);A.scale.setScalar(Math.max(.001,Ge)),A.visible=Ge>.002,A.rotation.set(.05,-b*.5+(V?0:Math.sin(o*.35)*.22)+B*1.4*b,0),Be.value=E;const ue=L>=0&&p<=0&&K>.1?te[L]:"";ue!==Te&&(Te=ue,n.emit("index-active",ue||null))},hover(t,o){return H=n.pointer.inside?be(t,o):-1,H>=0},pick(t,o){const s=be(t,o);return s>=0&&n.emit("jump",{id:te[s]}),null},dispose(){ie.dispose(),xe.dispose(),j.dispose(),se.tex.dispose(),_.geometry.dispose(),_.material.dispose(),C.geometry.dispose(),C.material.dispose(),d.forEach(t=>{t.name.tex.dispose(),t.mesh.material.dispose(),t.piece.material.dispose(),t.dim.geometry.dispose(),t.dim.material.dispose(),t.screen.pause()})}}};export{me as FAM_PHONE,zt as default};
