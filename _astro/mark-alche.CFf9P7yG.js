import{u as Y,v as P,x as J,y as Z,W as C,z as A,H as G,V as $,B as R,b as O,k as ee,Q as z,F as te,M as U,a as V,S as ae,I as ne,J as oe,n as re}from"./EditionWorld.astro_astro_type_script_index_0_lang.ClpBNxPv.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const se={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function ce({depthK:w=.245,bevelK:a=.05,stroke:u=.07}={}){const d=Y(P.M,P.K,2.15,u);let r=1e9,o=-1e9;for(const f of d)for(const[s]of f)r=Math.min(r,s),o=Math.max(o,s);const n=o-r,c=n*w,h=c*a,l=new J(Z(d),{depth:c-2*h,curveSegments:4,bevelEnabled:!0,bevelThickness:h,bevelSize:h*.9,bevelSegments:3});return l.center(),l.computeVertexNormals(),l.userData.mkMark="alche",l.userData.width=n+2*h*.9,l}const ie=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,le=`
  uniform float uTurnGain, uReflSpan, uRoomLift;   // (world-94) the turned face's lift and its reflected read of the wall; (world-92) a room's own factor
  uniform sampler2D uCopy; uniform vec4 uTone; uniform float uSpectrum, uRefl, uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx, uLens, uSoft, uAspB, uTurn; uniform vec2 uSpot;
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  float h1(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h1(i), h1(i + vec2(1., 0.)), f.x), mix(h1(i + vec2(0., 1.)), h1(i + vec2(1., 1.)), f.x), f.y); }
  // (world-105, the owner 15 Nov: "my name look too bright to the point you can't read what is through it") the glass reads the
  // picture behind it no hotter than white (uTone.x, linear): the name drawn at 1.5 x white stayed 2.4 x in the half-float copy, so
  // every grain of the sand and the fog that touched it averaged to white and tore the letters; read at white, a letter's sand is
  // grey and its core stays a letter (as a picture kept in 8 bits would)
  vec3 cp(vec2 u){ return min(texture2D(uCopy, u).rgb, vec3(uTone.x)); }
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
    float rough = smoothstep(uSpot.x, uSpot.y, nz) * uRough;   // (world-89) the blotches in every scene (the owner: "those are part of the plan"): the Open's big soft areas (uLens) are gone
    // (world-89) the white lines are cured at the source: the copy carries no fine grid (uFineOff in both rooms) and is alche's soft 512 x 512 photo
    vec2 uvL = uv;   // (world-89) no lens of our own: alche reads the photo at the glass's own place
    // (world-89) the smear, alche's numbers on every face: slide by tilt uBend (.1), per sample .005-.012, red / green / blue at x1 / x2 / x4
    float soft = uSoft;   // (world-89) the fog: the Open's rest level of soft read (~7 buffer px) on every face, every scene; no wider read in the turn   // (world-88) the turn widens the read only a little: the wall's tiles stay broad soft bands, no fine line (job 86: 1 + 3 tw averaged them into one tone)   // (world-86) turned faces read a wider, softer area of the wall   // (world-84) the bevels read broader: a sheen, not a pattern   // (world-82) ~7 buffer px (capture() sets it: .01 of a phone's width, .004 of a 2000 px desk: his desk keeps the big shapes, loses the thin lines)
    vec3 col = vec3(0.);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 rp = floor(gl_FragCoord.xy / uGrainPx) + fi * vec2(17.3, 31.7);   // (world-38e) the sand in grains of alche's pixel (his picture is drawn at 1.5 x CSS)
      float slide = .005 + h1(rp) * .007;
      vec2 j = (vec2(h1(rp + 3.1), h1(rp + 7.7)) - .5) * (rough * .3 + soft * vec2(1., uAspB));   // (world-84, review) even in buffer px: y in uv = x x width / height
      vec2 o = -bendDir;
      col.r += cp(uvL + o * (uBend + slide) + j).r;
      col.g += cp(uvL + o * (uBend + slide * 2.) + j).g;
      col.b += cp(uvL + o * (uBend + slide * 4.) + j).b;
    }
    col *= .9 / 8.;
    col.g = mix(min(col.g, col.b), col.g, uSpectrum);   // (world-89) THE ONE colour rule: uSpectrum 1 = alche's full parting; 0 = green tied to blue (red / white / blue / violet fringes only). Debug: window.__markSpectrum
    col = pow(max(col, 0.), vec3(1. / 2.2));   // alche's maths works on display values (his page writes them raw); ours are linear: encode, work, decode
    // the boost and the faint environment, by the angle (face-on ~2x the copy, the rim ~1.1x)
    float cs = clamp(dot(n, V), 0., 1.), F = .1 + .9 * pow(1. - cs, 5.);
    vec3 r = reflect(-V, n);
    vec3 env = vec3(.44) * (.35 + .65 * smoothstep(-.3, .9, r.y)) * uEnv;
    // (world-94) a turned face is glass as alche's (the owner, 14 Nov: "one glass everywhere"; job 92's turned body was a dim
    // ghost): the slid, parted, blotched photo is read WHOLE on every face (no cut in the turn) and lifted by uTurnGain; the
    // reflection in the turn is our OWN wall's photo read along the reflected ray (uReflSpan) with the blotches' jitter, so it
    // carries the wall's tiles, seams and colour, never a flat mean. Both weighed by alche's Fresnel step and the rest term.
    // At rest (tk 0) all as before: every new term is mixed in by tk.
    float tk = smoothstep(.03, .2, uTurn);
    vec2 rp0 = floor(gl_FragCoord.xy / uGrainPx);
    vec2 ro = r.xy * uReflSpan;
    vec3 es = cp(uv + ro + (vec2(h1(rp0 + 41.3), h1(rp0 + 47.9)) - .5) * (rough * .3 + soft * vec2(1., uAspB)))
            + cp(uv + ro + (vec2(h1(rp0 + 53.1), h1(rp0 + 59.7)) - .5) * (rough * .3 + soft * vec2(1., uAspB)))
            + cp(uv + ro + (vec2(h1(rp0 + 61.9), h1(rp0 + 67.3)) - .5) * (rough * .3 + soft * vec2(1., uAspB)))
            + cp(uv + ro + (vec2(h1(rp0 + 71.7), h1(rp0 + 79.1)) - .5) * (rough * .3 + soft * vec2(1., uAspB)));
    vec3 envS = pow(max(es * .25, 0.), vec3(1. / 2.2));
    vec2 rq = uv + ro; float wb = smoothstep(0., .04, min(min(rq.x, 1. - rq.x), min(rq.y, 1. - rq.y)));   // (world-99, job 94's review) near the screen's edges the reflected read leaves the copy and repeats its border (ClampToEdge): the reflection fades back to env there (no extra read; all under tk, so at rest unchanged)
    vec3 envT = mix(env, envS, tk * wb);
    col = col + mix(col, envT, .9 * F) * (1. - F);
    col *= mix(1., uTurnGain, tk);
    col += envT * F * uRefl;   // (world-89) the reflection by Fresnel: faint face-on (F .1); (world-94) in the turn the wall's own photo
    col *= uBoost * uRoomLift;
    // (world-105) the exposure: the glass's light on a curve m (1 + b m) / (1 + a m) of its brightest channel m (a = uTone.y,
    // b = uTone.z; display values): the dark glass keeps its level, the middle comes down to alche's, white lands under the clip;
    // all three channels by the same factor, so the hue and the parting's saturation stay (nothing burns to a flat white slab)
    float mxc = max(col.r, max(col.g, col.b));
    col *= (1. + uTone.z * mxc) / (1. + uTone.y * mxc);
    col = max(mix(vec3(dot(col, vec3(.2126, .7152, .0722))), col, uTone.w), 0.);   // (world-105) and the colour as vivid as alche's (uTone.w: the saturation; the fog and the faint room grey it a little)
    // (world-89) no floor of light, no sheen of colour: a turned face stays lit by alche's means only, the boost and the
    // environment's reflection by Fresnel (above); colour lives only in the refracted image's parting (uSpectrum)
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function H(w,a){const u=w.__sceneSize;return u?a.set(u[0],u[1]):w.getDrawingBufferSize(a)}const ve={copy:512,square:!0,soft:1,spectrum:0,refl:.8,boost:.945,env:1.4,warp:4,spot:[.5,.64],lens:1,tone:[.6,.5,.08,1.4],turnGain:1.1};function he({scale:w=.5,copy:a=0,square:u=!1,soft:d=0,span:r=4,bend:o=.1,rough:n=.1,boost:c=1.2,env:h=1,glint:l=1,warp:f=4,spot:s=[.5,.64],lens:x=0,spectrum:p=1,refl:T=0,turnGain:y=1.27,reflSpan:L=.12,tone:b=[1e4,0,0,1]}={}){const e=new C(4,4,{type:G,depthBuffer:!0,generateMipmaps:!1,minFilter:A,magFilter:A}),t={uCopy:{value:e.texture},uTime:{value:0},uBend:{value:o},uRough:{value:n},uBoost:{value:c},uEnv:{value:h},uGlint:{value:l},uOn:{value:1},uSpan:{value:r},uWarp:{value:f},uSpot:{value:new R(s[0],s[1])},uGrainPx:{value:1},uLens:{value:x},uSoft:{value:x*.01},uAspB:{value:1},uTurn:{value:0},uSpectrum:{value:p},uRefl:{value:T},uTone:{value:new $(b[0],b[1],b[2],b[3])}},v=Object.assign(t,{uTurnGain:{value:y},uReflSpan:{value:L},uRoomLift:{value:1}}),S=new O({uniforms:v,vertexShader:ie,fragmentShader:le,toneMapped:!1}),m=new R,D=new z,F=new z,g=new ee;function k(B,I,q,_){H(B,m);const N=a&&u?a:a?Math.round(Math.min(m.x*.87,a*1.5)):Math.max(4,Math.round(m.x*w)),W=a&&u?a:a?Math.round(Math.min(m.y*.6,a*1.25)):Math.max(4,Math.round(m.y*w));(e.width!==N||e.height!==W)&&e.setSize(N,W);{const i=window.__markSpectrum;(i===0||i===1)&&(t.uSpectrum.value=i)}{const i=window.__glBoost;t.uBoost.value=typeof i=="number"?i:c}{const i=window.__glTurn2,E=Array.isArray(i)&&i.length===2;v.uTurnGain.value=E?i[0]:y,v.uReflSpan.value=E?i[1]:L}{const i=window.__glTone,E=Array.isArray(i)&&i.length===4;t.uTone.value.set(...E?i:b)}{const i=window.__glRough0;t.uRough.value=i===!0?0:n}_[0]&&(_[0].getWorldQuaternion(D),F.copy(q.quaternion).invert(),g.set(0,0,1).applyQuaternion(D).applyQuaternion(F),t.uTurn.value=1-g.z),t.uAspB.value=m.x/Math.max(1,m.y),t.uSoft.value=d*Math.min(.01,Math.max(.004,7/Math.max(1,m.x)));const Q=B.getRenderTarget(),K=_.map(i=>i.visible),X=B.getClearAlpha();try{_.forEach(i=>{i.visible=!1}),B.setRenderTarget(e),B.setClearAlpha(1),B.clear(),B.render(I,q)}finally{B.setRenderTarget(Q),B.setClearAlpha(X),_.forEach((i,E)=>{i.visible=K[E]}),S.visible=!window.__glHide}}return{material:S,uniforms:v,capture:k,target:e,dispose(){e.dispose(),S.dispose()}}}function de(w=se.open){const a=new z,u=new z,d=new z,r=new re,o=new R;let n={...w},c=0,h=0,l=0,f=!1,s=0,x=0;const p=new R,T=e=>{const t=e.clientX/innerWidth*2-1,M=-(e.clientY/innerHeight*2-1);f&&(s+=t-h,x+=M-l),h=t,l=M,f=!0},y=()=>{f=!1};addEventListener("pointermove",T,{passive:!0}),addEventListener("pointerdown",y,{passive:!0}),addEventListener("pointerup",y,{passive:!0}),addEventListener("pointercancel",y,{passive:!0});const L=14;function b(e,t={}){e=Math.min(e,.05);{const v=window.__markPose;if(Array.isArray(v)&&v.length===2)return a.setFromEuler(r.set(v[1]*Math.PI/180,v[0]*Math.PI/180,0)),a}if(t.room&&(n=t.room),c=t.blendW??c,t.still)o.set(0,0),a.identity(),s=x=0;else{const v=Math.max(0,1-Math.hypot(h,l)*1.5)*n.hover;if(!t.still){const m=n.gain??L;o.x-=x*m*v*(1-.7*c),o.y+=s*m*v}s=x=0,o.multiplyScalar(Math.max(0,1-e*(n.friction??1)));const S=o.y*e-(n.auto*e+Math.max(-30,Math.min(30,t.scrollV??0))*n.scroll)*(t.still?0:1);d.setFromEuler(r.set(o.x*e,S,0)),a.premultiply(d),a.slerp(u,Math.min(1,e*n.ret*(1-.8*c))),a.normalize()}const M=1-Math.exp(-e*3);return p.x+=((t.desk?(t.pointerX??0)*n.lean:0)-p.x)*M,p.y+=((t.desk?(t.pointerY??0)*n.lean:0)-p.y)*M,a}return{update:b,quaternion:a,spin:o,lean:p,kick(e,t){o.x+=e,o.y+=t},reset(){a.identity(),o.set(0,0)},dispose(){removeEventListener("pointermove",T),removeEventListener("pointerdown",y),removeEventListener("pointerup",y),removeEventListener("pointercancel",y)}}}const j="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function pe({engineVig:w=.55}={}){let a=1;const u=()=>new C(4,4,{type:G,depthBuffer:!1,generateMipmaps:!1,minFilter:A,magFilter:A}),d=new C(4,4,{type:G,depthBuffer:!0,generateMipmaps:!1,minFilter:A,magFilter:A}),r=[u(),u(),u()],o=[u(),u(),u()],n=new te(-1,1,1,-1,0,1),c=new U(new V(2,2));c.frustumCulled=!1;const h=new ae;h.add(c);const l=new O({uniforms:{tIn:{value:null},uDir:{value:new R},uBright:{value:0}},vertexShader:j,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),f=new O({uniforms:{tMain:{value:d.texture},t1:{value:r[0].texture},t2:{value:r[1].texture},t3:{value:r[2].texture},uAsp:{value:1},uEV:{value:w},uOn:{value:1}},vertexShader:j,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),s=new U(new V(2,2),f);s.frustumCulled=!1,s.renderOrder=1e6,s.visible=!1;let x=[];const p=new R,T=(e,t,M,v,S,m)=>{l.uniforms.tIn.value=t,l.uniforms.uDir.value.set(v,S),l.uniforms.uBright.value=m,c.material=l,e.setRenderTarget(M),e.render(h,n)};function y(e,t,M){H(e,p);const v=Math.max(4,p.x),S=Math.max(4,p.y);(d.width!==v||d.height!==S||r[0].width!==Math.max(2,Math.round(v/4/a)))&&(d.setSize(v,S),[4,8,16].forEach((g,k)=>{r[k].setSize(Math.max(2,Math.round(v/g/a)),Math.max(2,Math.round(S/g/a))),o[k].setSize(r[k].width,r[k].height)})),f.uniforms.uAsp.value=v/S;const m=e.getRenderTarget(),D=e.getClearAlpha();s.visible=!1,e.setRenderTarget(d),e.setClearAlpha(1),e.clear(),e.render(t,M);let F=d.texture;for(let g=0;g<3;g++)T(e,F,o[g],1/o[g].width,0,g===0?1:0),T(e,o[g].texture,r[g],0,1/r[g].height,0),F=r[g].texture;e.setRenderTarget(m),e.setClearAlpha(D)}function L(e){x=e.children.filter(t=>t!==s).map(t=>[t,t.visible]);for(const[t]of x)t.visible=!1;s.visible=!0}function b(){for(const[e,t]of x)e.visible=t;x=[],s.visible=!1}return{quad:s,render:y,only:L,show:b,uniforms:f.uniforms,setPx(e){a=Math.max(1,e)},dispose(){d.dispose(),r.forEach(e=>e.dispose()),o.forEach(e=>e.dispose()),l.dispose(),f.dispose(),c.geometry.dispose(),s.geometry.dispose()}}}function fe(w,{font:a='700 300px "Space Grotesk Variable", sans-serif',rtl:u=!1,level:d=1.5,spacing:r="0px"}={}){const o=document.createElement("canvas"),n=o.getContext("2d");n.font=a,n.direction=u?"rtl":"ltr",n.letterSpacing=r,n.textAlign="left",n.textBaseline="alphabetic";const c=n.measureText(w),h=8,l=Math.ceil(c.actualBoundingBoxLeft),f=Math.ceil(c.actualBoundingBoxRight),s=Math.ceil(c.actualBoundingBoxAscent),x=Math.ceil(c.actualBoundingBoxDescent);o.width=l+f+h*2,o.height=s+x+h*2,n.font=a,n.direction=u?"rtl":"ltr",n.letterSpacing=r,n.textAlign="left",n.textBaseline="alphabetic",n.fillStyle="#fff",n.fillText(w,h+l,h+s);const p=new ne(o);p.anisotropy=8,p.generateMipmaps=!0,p.minFilter=oe;const T=o.width/o.height,y=(l+f)/o.width,L={uTex:{value:p},uLevel:{value:d},uOn:{value:1}},b=new O({uniforms:L,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new U(new V(1,1/T),b);return{mesh:e,uniforms:L,fit:M=>{e.scale.setScalar(M/y)},aspect:T,glyphShare:y,dispose(){p.dispose(),b.dispose(),e.geometry.dispose()}}}export{se as M,ve as O,ce as a,he as b,pe as c,fe as d,de as m};
