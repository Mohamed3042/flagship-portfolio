import{S as le,P as ne,G as ue,i as ce,s as te,V as x,O as ve,M as he,a as pe,p as oe,aa as me,ae as de,o as v,r as u,u as W}from"./EditionWorld.astro_astro_type_script_index_0_lang.CZFCBfSl.js";import{a as ge}from"./world.C3xU70q8.js";import{L as fe,a as we,b as xe}from"./LineSegments2.nuKSm-WM.js";import{p as ye,a as be}from"./_lineart.XWlTy63S.js";import{g as ke,s as Me}from"./lens.79eL6oPJ.js";import"./preload-helper.4QTdcD_W.js";import"./profile.a0_4NzwI.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const P=.5,G=new x(-1.938,1,0),N=new x(-1.938,-1,0),qe=new x(0,0,1),Te=`
  uniform vec3 uTop, uBot, uAcross; uniform float uDepth;
  varying vec2 vUv; varying vec3 vN, vV;
  void main(){
    float u = position.x + .5, v = .5 - position.y;               // u: front edge 0 → back 1; v: top 0 → bottom 1
    vec3 along = normalize(uBot - uTop);
    vec3 p = mix(uTop, uBot, v) + uAcross * (.5 - u) * uDepth;
    vUv = vec2(u, v);
    vN = normalize(normalMatrix * cross(along, uAcross));
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vV = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`,Le=`
  uniform float uTime, uFill, uLiquid, uZoom, uImgAsp, uLookA, uLookB, uLookMix, uDive, uPulse, uEnd; uniform vec2 uSize, uRes; uniform sampler2D uImg;
  varying vec2 vUv; varying vec3 vN, vV;
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
  float fbm2(vec2 p){ return .65 * noise(p) + .35 * noise(p * 2.03 + 17.1); }
  // holographic foil: magenta, gold, lime, cyan, round again
  vec3 foil(float h){
    h = fract(h) * 4.;
    vec3 m = vec3(1., .36, .86), y = vec3(1., .93, .38), l = vec3(.55, 1., .42), c = vec3(.4, .86, 1.);
    return h < 1. ? mix(m, y, smoothstep(0., 1., h)) : h < 2. ? mix(y, l, smoothstep(1., 2., h)) : h < 3. ? mix(l, c, smoothstep(2., 3., h)) : mix(c, m, smoothstep(3., 4., h));
  }
  // the liquid: a slowly flowing surface (domain-warped noise), the same glass as the World's opening
  float surf(vec2 p, float t){ vec2 w = vec2(fbm(p + vec2(t, -t * .7)), fbm(p + vec2(5.2 - t * .8, 1.3 + t))); return fbm(p * 1.2 + w * 1.7 - t * .25); }
  // the glass the words are seen through: the same flow, smoother and broader, so they bend in big strokes and stay legible
  float glass(vec2 p, float t){ vec2 w = vec2(fbm2(p * .6 + vec2(t, -t * .7)), fbm2(p * .6 + vec2(5.2 - t * .8, 1.3 + t))); return fbm2(p * .75 + w * 1.5 - t * .2); }
  // our words seen through the glass (the picture is laid out to the screen's shape, a little bigger than it): bent by the
  // glass, each colour a little differently, soft edges sprayed as grain
  vec3 words(vec2 sp, vec2 q, float g, vec3 ground, vec3 ink){
    float t = uTime * .07, h = glass(q, t), e = .03;
    vec2 slope = vec2(glass(q + vec2(e, 0.), t) - h, glass(q + vec2(0., e), t) - h) / e;
    vec2 tq = sp * vec2(1. / uImgAsp, 1.) * .8 + .5 + vec2(sin(uTime * .05) * .03, uTime * .006);
    vec3 lum;
    for (int i = 0; i < 3; i++) lum[i] = texture2D(uImg, tq - slope * (.07 + .016 * (float(i) - 1.))).r;
    vec3 c = mix(ground, ink, step(vec3(g), lum * 1.15 - .06));
    vec3 nrm = normalize(vec3(-slope * .5, 1.));
    return c + pow(max(dot(nrm, normalize(vec3(-.35, .55, .75))), 0.), 30.) * .4;    // a glint along the glass
  }
  vec3 look(float i, vec2 sp, vec2 q, float g){
    float t = uTime * .07, h = surf(q, t), e = .025;
    vec2 slope = vec2(surf(q + vec2(e, 0.), t) - h, surf(q + vec2(0., e), t) - h) / e;
    vec3 nrm = normalize(vec3(-slope * .45, 1.));
    float glint = pow(max(dot(nrm, normalize(vec3(-.35, .55, .75))), 0.), 28.), steep = smoothstep(1.2, 3.5, length(slope));
    if (i < .5) {                                                    // holographic liquid: soft bands, pale where it crests
      vec3 c = mix(foil(h * 1.9 + uTime * .015 + (g - .5) * .05), vec3(1.), .18);
      return mix(c, vec3(1.), smoothstep(.62, .8, h) * .4) + glint * .2;
    }
    if (i < 1.5) return words(sp, q, g, vec3(.018, .02, .02), mix(vec3(.95, .96, .94), foil(h * 2. + uTime * .02), steep * .25));
    if (i < 2.5) {                                                   // acid: yellow into lime into cyan, grey swirls
      float k = fract(h * 1.5 + uTime * .012 + (g - .5) * .04);
      vec3 c = k < .5 ? mix(vec3(1., .94, .32), vec3(.62, 1., .46), smoothstep(0., .5, k)) : mix(vec3(.62, 1., .46), vec3(.46, .9, 1.), smoothstep(.5, 1., k));
      c = mix(c, vec3(.07, .08, .09), step(.58 + (g - .5) * .09, surf(q * .7 + 3., t)));   // dark liquid shapes, their edges in grain
      return c + glint * .5;
    }
    if (i < 3.5) return words(sp * .85 + vec2(.05, .1), q + 4., g, vec3(.2, .27, .21), mix(vec3(.96, .95, .88), foil(h * 2.4), steep * .2));
    if (i < 4.5) {                                                   // dark gloss: black liquid, white glints, pastel fringes
      float broad = pow(max(dot(nrm, normalize(vec3(.3, .6, .74))), 0.), 9.);
      vec3 c = vec3(.015) + mix(vec3(.9, .85, 1.), foil(h * 3. + .3), .5) * steep * .55 + vec3(1.) * (broad * .8 + glint);
      return c * step(g * .25, c + .02);
    }
    if (i < 5.5) return words(sp * 1.1 - vec2(.04, .08), q + 8., g, mix(vec3(.03, .05, .2), vec3(.2, .45, 1.), smoothstep(.35, .8, h) * .6), vec3(.94, .97, 1.));   // the words in blue
    if (i < 6.5) {                                                   // blue chrome: deep blue liquid, black troughs, white light on the crests
      float broad = pow(max(dot(nrm, normalize(vec3(-.2, .7, .68))), 0.), 6.);
      vec3 c = mix(vec3(.004, .01, .05), vec3(.08, .26, 1.), smoothstep(.32, .72, h));
      return c * step(g * .2, smoothstep(.2, .45, h) + .05) + vec3(.85, .92, 1.) * (broad * .7 + glint * 1.2);
    }
    if (i < 7.5) {                                                   // zebra: black and white liquid bands, grain at every edge, a rainbow fringe
      vec3 z = h * 7. + uTime * .05 + vec3(-.012, 0., .012) * (1. + steep * 2.);
      return step(vec3((g - .5) * .5), sin(z * 6.2832));
    }
    if (i < 8.5) {                                                   // teal swirl: teal into lime into yellow, black liquid with grainy edges
      float k = fract(h * 1.3 - uTime * .01);
      vec3 c = k < .5 ? mix(vec3(.1, .78, .72), vec3(.6, 1., .4), smoothstep(0., .5, k)) : mix(vec3(.6, 1., .4), vec3(1., .95, .45), smoothstep(.5, 1., k));
      return mix(c, vec3(.02), step(.6 + (g - .5) * .12, surf(q * .8 - 2., t * 1.3))) + glint * .6;
    }
    if (i < 9.5) return words(sp * .95, q + 12., g, vec3(.86, .87, .88), vec3(.025)) + glint * .1;   // the words dark on pale grey, fringed red and blue
    // chrome: the words in grey metal on black, banded as they bend
    vec3 metal = mix(vec3(.3, .31, .33), vec3(.97), smoothstep(.25, .75, fract(h * 2.2 + .3)));
    return words(sp * 1.05 + vec2(.06, 0.), q - 6., g, vec3(.012), metal) + glint * .3;
  }
  void main(){
    if (vUv.y > uFill + (hash(floor(gl_FragCoord.xy * .5)) - .5) * .02) discard;   // it is drawn from the top
    vec3 n = normalize(vN), e = normalize(-vV);
    float facing = abs(dot(n, e));
    // the side: foil whose colour runs with the angle you see it at; one face leans pink, the other green
    vec3 holo = foil(facing * 1.2 + vUv.y * .7 + vUv.x * .2 + uTime * .03 + (gl_FrontFacing ? 0. : .5));
    holo *= .62 + .38 * smoothstep(.05, .6, facing);                                  // darker as it turns edge-on
    holo += pow(max(dot(reflect(-e, n), normalize(vec3(-.3, .6, .75))), 0.), 24.) * .55;   // a sheen sliding along it
    vec3 col = holo;
    if (uLiquid > 0.) {
      // the looks, in screen space, growing as the camera goes deeper; one dissolves into the next grain by grain
      vec2 sp = (gl_FragCoord.xy / uRes - .5) * vec2(uRes.x / uRes.y, 1.) / (.75 + .25 * uZoom);
      // the dive: scrolling in pushes you into the colour in a pulse, the picture coming closer and the flowing glass
      // bending it the harder you go (at rest it only breathes); toward the end it carries you through
      float push = uDive * (.8 + .2 * sin(uPulse * 2.2)) + uEnd * 2.2 + .04 * (.5 + .5 * sin(uTime * 1.5));
      sp /= 1. + push * .22;
      float gt = uTime * .05, gh = glass(sp * 1.1 + 4., gt), ge = .04;
      vec2 gs = vec2(glass(sp * 1.1 + 4. + vec2(ge, 0.), gt) - gh, glass(sp * 1.1 + 4. + vec2(0., ge), gt) - gh) / ge;
      sp += gs * push * .05;
      vec2 q = sp * 1.6 + 2.;
      float g = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.));
      vec3 L = look(uLookA, sp, q, g);
      if (uLookMix > 0.) L = mix(L, look(uLookB, sp, q, g), step(glass(q * .5 - 1., uTime * .05) * .8 + hash(floor(gl_FragCoord.xy * .5) + 7.3) * .2, uLookMix * 1.05));
      // the glass of the dive: its steep folds catch the light in foil
      L += foil(gh * 2. + uPulse * .1) * smoothstep(.8, 2.4, length(gs)) * min(push, 1.5) * .25;
      col = mix(holo, L, uLiquid);
    }
    gl_FragColor = vec4(col, 1.);
  }`,Ie=i=>{const L=matchMedia("(prefers-reduced-motion: reduce)").matches,z=new le,y=new ne(30,i.viewport.aspect,.05,200),B=ye({base:"#d3d8dd",mark:"#f7f9fa",cell:104});z.add(B);const n=new ue;z.add(n);const Z=new fe().setPositions(be(P)),C=new we({color:16777215,linewidth:1.7,transparent:!0,opacity:.96}),ie=new xe(Z,C);n.add(ie);const I=new ce({side:ve,uniforms:{uTop:{value:G},uBot:{value:N},uAcross:{value:qe},uDepth:{value:P},uTime:{value:0},uFill:{value:0},uLiquid:{value:0},uZoom:{value:1},uSize:{value:new te(1,1)},uImg:{value:null},uImgAsp:{value:2},uRes:{value:new te(1,1)},uLookA:{value:0},uLookB:{value:1},uLookMix:{value:0},uDive:{value:0},uPulse:{value:0},uEnd:{value:0}},vertexShader:Te,fragmentShader:Le}),b=new he(new pe(1,1,1,96),I);b.frustumCulled=!1,b.visible=!1,n.add(b);const t=I.uniforms,se=.46;let k=0,D=0,h=-1,H=!1;const m=ke(z,y,[],e=>{t.uLiquid.value=e?D:k});m.warm(i.renderer);let E=0;function $(){const e=i.viewport.aspect;if(Math.abs(e-E)<.05)return;E=e;const s=i.lang==="ar",l=ge(i.lang).vision.lines.map(r=>s?r:r.toUpperCase()),c=e<.9?l.flatMap(r=>r.split(" ")).filter(Boolean):l,o=document.createElement("canvas"),a=o.getContext("2d");o.height=1400,o.width=Math.round(1400*e),a.fillStyle="#000",a.fillRect(0,0,o.width,o.height),a.filter="blur(5px)",a.fillStyle="#fff",a.textAlign="center",a.textBaseline="middle",a.direction=s?"rtl":"ltr";const R=r=>s?`800 ${r}px "Cairo Variable", sans-serif`:`700 ${r}px "Space Grotesk Variable", sans-serif`;c.forEach((r,f)=>{let w=o.height/c.length*1.05;a.font=R(w),w*=Math.min(1,o.width*1.1/a.measureText(r).width),a.font=R(w),a.fillText(r,o.width/2,o.height*(f+.5)/c.length)});const g=t.uImg.value,T=new me(o);T.wrapS=T.wrapT=de,t.uImg.value=T,t.uImgAsp.value=e,g?.dispose()}const F=2.6,j=1,A=[0,1,6,2,7,3,8,9,4,10,5];let p=-1,d=0;const M=new x,J=new x,K=new x,ae=G.clone().add(N).multiplyScalar(.5);let S=!1,O=19,Q=1.4,V=0,_=0,U=-1,q=0,X=0;const re={scene:z,camera:y,light:!0,resize:Y,update({p:e,t:s,dt:l}){t.uFill.value=v.inOut(u(.1,.22,e))*1.03;const c=e>=se?1:0;L||!H?(k=c,H=!0):h<0&&c!==k&&(h=0,D=c,c&&(p=s,d=1));const o=h<0?null:Me(h);o?.passed&&(k=D),o&&(h=h>1.7?-1:h+l),t.uLiquid.value=k,t.uZoom.value=1+5*v.in(u(.55,.97,e)),t.uSize.value.set(P,G.distanceTo(N));const a=U<0?0:Math.abs(e-U)/Math.max(l,.001);U=e,q=L?0:W(q,Math.min(1,a*8),a*8>q?6:1.6,l),X+=l*(1+q*5),t.uDive.value=q,t.uPulse.value=X,t.uEnd.value=L?0:v.in(u(.88,.985,e)),t.uTime.value=s,b.visible=e>.1,e>.3&&e<.985&&!L?(p<0&&(p=s,d=0),s-p>F+j&&(d=(d+1)%A.length,p=s),t.uLookA.value=A[d],t.uLookB.value=A[(d+1)%A.length],t.uLookMix.value=u(F,F+j,s-p)):e<=.3&&(p=-1,t.uLookA.value=0,t.uLookMix.value=0),V=W(V,i.pointer.inside?i.pointer.x:0,2.5,l),_=W(_,i.pointer.inside?i.pointer.y:0,2.5,l);const R=.38*v.inOut(u(.04,.2,e))+(Math.PI/2-.38)*v.inOut(u(.24,.6,e)),g=v.inOut(u(.2,.6,e));n.rotation.set((_*.05-.06)*(1-g),V*.08*(1-g)+R,0),n.updateMatrixWorld(),J.set(0,0,0).applyMatrix4(n.matrixWorld),K.copy(ae).applyMatrix4(n.matrixWorld),M.lerpVectors(J,K,v.inOut(u(.1,.6,e)));const T=O*Math.pow(Q/O,g)*oe.lerp(1,.72,v.inOut(u(.6,.96,e)));if(y.position.set(M.x,M.y+.1*Math.sin(Math.PI*g),M.z+T),y.lookAt(M),B.material.uniforms.uShift.value.set(e*120,e*40),m.mesh.visible=!!o,!o)m.resize(1,1);else{const r=Math.round(i.viewport.width*i.viewport.dpr),f=Math.round(i.viewport.height*i.viewport.dpr),w=f/6,ee=Math.hypot(r,f)/w*.6+1;m.resize(r,f),m.set({center:[r/2,f/2],unit:w,sphere:1,radius:o.passed?0:ee*o.grow,far:ee,puff:0,alpha:1,screen:o.screen,time:s})}},dispose(){Z.dispose(),C.dispose(),b.geometry.dispose(),I.dispose(),t.uImg.value?.dispose(),m.dispose()}};function Y(){S=i.viewport.portrait;const e=i.viewport,s=Math.tan(oe.degToRad(y.fov/2));O=3.87/(S?.82:.4)/(2*s*e.aspect),Q=P/(2*s*e.aspect)*.8;const l=B.material.uniforms;l.uRes.value.set(e.width*e.dpr,e.height*e.dpr),l.uCell.value=104*e.dpr,C.resolution.set(e.width,e.height),t.uRes.value.set(e.width*e.dpr,e.height*e.dpr),$(),n.position.set(S?.15:-.15*(i.lang==="ar"?-1:1),S?.35:0,0),n.updateMatrixWorld()}return Y(),document.fonts?.ready.then(()=>{E=0,$()}),re};export{Ie as default};
