import{u as X,v as P,x as Y,y as J,W as O,z as E,H as z,B as D,b as _,k as Z,Q as F,F as $,M as U,a as G,S as ee,I as te,J as ae,n as ne}from"./EditionWorld.astro_astro_type_script_index_0_lang.CGr-gj7z.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const re={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function le({depthK:g=.245,bevelK:a=.05,stroke:l=.07}={}){const p=X(P.M,P.K,2.15,l);let o=1e9,r=-1e9;for(const m of p)for(const[s]of m)o=Math.min(o,s),r=Math.max(r,s);const t=r-o,u=t*g,c=u*a,i=new Y(J(p),{depth:u-2*c,curveSegments:4,bevelEnabled:!0,bevelThickness:c,bevelSize:c*.9,bevelSegments:3});return i.center(),i.computeVertexNormals(),i.userData.mkMark="alche",i.userData.width=t+2*c*.9,i}const oe=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC; varying vec2 vMid;
  void main(){
    vec4 mc = projectionMatrix * modelViewMatrix * vec4(0., 0., 0., 1.); vMid = mc.xy / max(mc.w, 1e-3) * .5 + .5;   // (world-82) the mark's middle on the screen (uv): the lens magnifies about it
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,se=`
  uniform float uTurnGain, uReflSpan, uRoomLift;   // (world-94) the turned face's lift and its reflected read of the wall; (world-92) a room's own factor
  uniform sampler2D uCopy; uniform float uSpectrum, uRefl, uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx, uLens, uSoft, uAspB, uTurn; uniform vec2 uSpot;
  varying vec3 vN, vV, vL, vON; varying vec4 vC; varying vec2 vMid;
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
      col.r += texture2D(uCopy, uvL + o * (uBend + slide) + j).r;
      col.g += texture2D(uCopy, uvL + o * (uBend + slide * 2.) + j).g;
      col.b += texture2D(uCopy, uvL + o * (uBend + slide * 4.) + j).b;
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
    vec3 es = texture2D(uCopy, uv + ro + (vec2(h1(rp0 + 41.3), h1(rp0 + 47.9)) - .5) * (rough * .3 + soft * vec2(1., uAspB))).rgb
            + texture2D(uCopy, uv + ro + (vec2(h1(rp0 + 53.1), h1(rp0 + 59.7)) - .5) * (rough * .3 + soft * vec2(1., uAspB))).rgb
            + texture2D(uCopy, uv + ro + (vec2(h1(rp0 + 61.9), h1(rp0 + 67.3)) - .5) * (rough * .3 + soft * vec2(1., uAspB))).rgb
            + texture2D(uCopy, uv + ro + (vec2(h1(rp0 + 71.7), h1(rp0 + 79.1)) - .5) * (rough * .3 + soft * vec2(1., uAspB))).rgb;
    vec3 envS = pow(max(es * .25, 0.), vec3(1. / 2.2));
    vec3 envT = mix(env, envS, tk);
    col = col + mix(col, envT, .9 * F) * (1. - F);
    col *= mix(1., uTurnGain, tk);
    col += envT * F * uRefl;   // (world-89) the reflection by Fresnel: faint face-on (F .1); (world-94) in the turn the wall's own photo
    col *= uBoost * uRoomLift;
    // (world-89) no floor of light, no sheen of colour: a turned face stays lit by alche's means only, the boost and the
    // environment's reflection by Fresnel (above); colour lives only in the refracted image's parting (uSpectrum)
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function j(g,a){const l=g.__sceneSize;return l?a.set(l[0],l[1]):g.getDrawingBufferSize(a)}const ue={copy:512,square:!0,soft:1,spectrum:0,refl:.8,boost:.945,env:1.4,warp:4,spot:[.5,.64],lens:1};function ve({scale:g=.5,copy:a=0,square:l=!1,soft:p=0,span:o=4,bend:r=.1,rough:t=.1,boost:u=1.2,env:c=1,glint:i=1,warp:m=4,spot:s=[.5,.64],lens:S=0,spectrum:d=1,refl:L=0,turnGain:x=1.27,reflSpan:B=.12}={}){const w=new O(4,4,{type:z,depthBuffer:!0,generateMipmaps:!1,minFilter:E,magFilter:E}),e={uCopy:{value:w.texture},uTime:{value:0},uBend:{value:r},uRough:{value:t},uBoost:{value:u},uEnv:{value:c},uGlint:{value:i},uOn:{value:1},uSpan:{value:o},uWarp:{value:m},uSpot:{value:new D(s[0],s[1])},uGrainPx:{value:1},uLens:{value:S},uSoft:{value:S*.01},uAspB:{value:1},uTurn:{value:0},uSpectrum:{value:d},uRefl:{value:L}},f=Object.assign(e,{uTurnGain:{value:x},uReflSpan:{value:B},uRoomLift:{value:1}}),T=new _({uniforms:f,vertexShader:oe,fragmentShader:se,toneMapped:!1}),h=new D,y=new F,k=new F,R=new Z;function b(M,H,V,A){j(M,h);const W=a&&l?a:a?Math.round(Math.min(h.x*.87,a*1.5)):Math.max(4,Math.round(h.x*g)),N=a&&l?a:a?Math.round(Math.min(h.y*.6,a*1.25)):Math.max(4,Math.round(h.y*g));(w.width!==W||w.height!==N)&&w.setSize(W,N);{const v=window.__markSpectrum;(v===0||v===1)&&(e.uSpectrum.value=v)}{const v=window.__glBoost;e.uBoost.value=typeof v=="number"?v:u}{const v=window.__glTurn2,C=Array.isArray(v)&&v.length===2;f.uTurnGain.value=C?v[0]:x,f.uReflSpan.value=C?v[1]:B}{const v=window.__glRough0;e.uRough.value=v===!0?0:t}A[0]&&(A[0].getWorldQuaternion(y),k.copy(V.quaternion).invert(),R.set(0,0,1).applyQuaternion(y).applyQuaternion(k),e.uTurn.value=1-R.z),e.uAspB.value=h.x/Math.max(1,h.y),e.uSoft.value=p*Math.min(.01,Math.max(.004,7/Math.max(1,h.x)));const I=M.getRenderTarget(),Q=A.map(v=>v.visible),K=M.getClearAlpha();try{A.forEach(v=>{v.visible=!1}),M.setRenderTarget(w),M.setClearAlpha(1),M.clear(),M.render(H,V)}finally{M.setRenderTarget(I),M.setClearAlpha(K),A.forEach((v,C)=>{v.visible=Q[C]}),T.visible=!window.__glHide}}return{material:T,uniforms:f,capture:b,target:w,dispose(){w.dispose(),T.dispose()}}}function ce(g=re.open){const a=new F,l=new F,p=new F,o=new ne,r=new D;let t={...g},u=0,c=0,i=0,m=!1,s=0,S=0;const d=new D,L=e=>{const n=e.clientX/innerWidth*2-1,f=-(e.clientY/innerHeight*2-1);m&&(s+=n-c,S+=f-i),c=n,i=f,m=!0},x=()=>{m=!1};addEventListener("pointermove",L,{passive:!0}),addEventListener("pointerdown",x,{passive:!0}),addEventListener("pointerup",x,{passive:!0}),addEventListener("pointercancel",x,{passive:!0});const B=14;function w(e,n={}){e=Math.min(e,.05);{const y=window.__markPose;if(Array.isArray(y)&&y.length===2)return a.setFromEuler(o.set(y[1]*Math.PI/180,y[0]*Math.PI/180,0)),a}n.room&&(t=n.room),u=n.blendW??u;const f=Math.max(0,1-Math.hypot(c,i)*1.5)*t.hover;if(!n.still){const y=t.gain??B;r.x-=S*y*f*(1-.7*u),r.y+=s*y*f}s=S=0,r.multiplyScalar(Math.max(0,1-e*(t.friction??1)));const T=r.y*e-(t.auto*e+Math.max(-30,Math.min(30,n.scrollV??0))*t.scroll)*(n.still?0:1);p.setFromEuler(o.set(r.x*e,T,0)),a.premultiply(p),a.slerp(l,Math.min(1,e*t.ret*(1-.8*u))),a.normalize();const h=1-Math.exp(-e*3);return d.x+=((n.desk?(n.pointerX??0)*t.lean:0)-d.x)*h,d.y+=((n.desk?(n.pointerY??0)*t.lean:0)-d.y)*h,a}return{update:w,quaternion:a,spin:r,lean:d,kick(e,n){r.x+=e,r.y+=n},reset(){a.identity(),r.set(0,0)},dispose(){removeEventListener("pointermove",L),removeEventListener("pointerdown",x),removeEventListener("pointerup",x),removeEventListener("pointercancel",x)}}}const q="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function he({engineVig:g=.55}={}){let a=1;const l=()=>new O(4,4,{type:z,depthBuffer:!1,generateMipmaps:!1,minFilter:E,magFilter:E}),p=new O(4,4,{type:z,depthBuffer:!0,generateMipmaps:!1,minFilter:E,magFilter:E}),o=[l(),l(),l()],r=[l(),l(),l()],t=new $(-1,1,1,-1,0,1),u=new U(new G(2,2));u.frustumCulled=!1;const c=new ee;c.add(u);const i=new _({uniforms:{tIn:{value:null},uDir:{value:new D},uBright:{value:0}},vertexShader:q,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),m=new _({uniforms:{tMain:{value:p.texture},t1:{value:o[0].texture},t2:{value:o[1].texture},t3:{value:o[2].texture},uAsp:{value:1},uEV:{value:g},uOn:{value:1}},vertexShader:q,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),s=new U(new G(2,2),m);s.frustumCulled=!1,s.renderOrder=1e6,s.visible=!1;let S=[];const d=new D,L=(e,n,f,T,h,y)=>{i.uniforms.tIn.value=n,i.uniforms.uDir.value.set(T,h),i.uniforms.uBright.value=y,u.material=i,e.setRenderTarget(f),e.render(c,t)};function x(e,n,f){j(e,d);const T=Math.max(4,d.x),h=Math.max(4,d.y);(p.width!==T||p.height!==h||o[0].width!==Math.max(2,Math.round(T/4/a)))&&(p.setSize(T,h),[4,8,16].forEach((b,M)=>{o[M].setSize(Math.max(2,Math.round(T/b/a)),Math.max(2,Math.round(h/b/a))),r[M].setSize(o[M].width,o[M].height)})),m.uniforms.uAsp.value=T/h;const y=e.getRenderTarget(),k=e.getClearAlpha();s.visible=!1,e.setRenderTarget(p),e.setClearAlpha(1),e.clear(),e.render(n,f);let R=p.texture;for(let b=0;b<3;b++)L(e,R,r[b],1/r[b].width,0,b===0?1:0),L(e,r[b].texture,o[b],0,1/o[b].height,0),R=o[b].texture;e.setRenderTarget(y),e.setClearAlpha(k)}function B(e){S=e.children.filter(n=>n!==s).map(n=>[n,n.visible]);for(const[n]of S)n.visible=!1;s.visible=!0}function w(){for(const[e,n]of S)e.visible=n;S=[],s.visible=!1}return{quad:s,render:x,only:B,show:w,uniforms:m.uniforms,setPx(e){a=Math.max(1,e)},dispose(){p.dispose(),o.forEach(e=>e.dispose()),r.forEach(e=>e.dispose()),i.dispose(),m.dispose(),u.geometry.dispose(),s.geometry.dispose()}}}function pe(g,{font:a='700 300px "Space Grotesk Variable", sans-serif',rtl:l=!1,level:p=1.5,spacing:o="0px"}={}){const r=document.createElement("canvas"),t=r.getContext("2d");t.font=a,t.direction=l?"rtl":"ltr",t.letterSpacing=o,t.textAlign="left",t.textBaseline="alphabetic";const u=t.measureText(g),c=8,i=Math.ceil(u.actualBoundingBoxLeft),m=Math.ceil(u.actualBoundingBoxRight),s=Math.ceil(u.actualBoundingBoxAscent),S=Math.ceil(u.actualBoundingBoxDescent);r.width=i+m+c*2,r.height=s+S+c*2,t.font=a,t.direction=l?"rtl":"ltr",t.letterSpacing=o,t.textAlign="left",t.textBaseline="alphabetic",t.fillStyle="#fff",t.fillText(g,c+i,c+s);const d=new te(r);d.anisotropy=8,d.generateMipmaps=!0,d.minFilter=ae;const L=r.width/r.height,x=(i+m)/r.width,B={uTex:{value:d},uLevel:{value:p},uOn:{value:1}},w=new _({uniforms:B,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new U(new G(1,1/L),w);return{mesh:e,uniforms:B,fit:f=>{e.scale.setScalar(f/x)},aspect:L,glyphShare:x,dispose(){d.dispose(),w.dispose(),e.geometry.dispose()}}}export{re as M,ue as O,le as a,ve as b,he as c,pe as d,ce as m};
