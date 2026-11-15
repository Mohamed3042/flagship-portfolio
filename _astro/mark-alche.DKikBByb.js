import{u as X,v as N,x as Y,y as J,W as O,z as E,H as z,B as D,b as _,k as Z,Q as A,F as $,M as U,a as G,S as ee,I as te,J as ae,n as ne}from"./EditionWorld.astro_astro_type_script_index_0_lang.DrUaC47_.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const re={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function le({depthK:w=.245,bevelK:t=.05,stroke:l=.07}={}){const p=X(N.M,N.K,2.15,l);let o=1e9,r=-1e9;for(const g of p)for(const[s]of g)o=Math.min(o,s),r=Math.max(r,s);const a=r-o,u=a*w,h=u*t,i=new Y(J(p),{depth:u-2*h,curveSegments:4,bevelEnabled:!0,bevelThickness:h,bevelSize:h*.9,bevelSegments:3});return i.center(),i.computeVertexNormals(),i.userData.mkMark="alche",i.userData.width=a+2*h*.9,i}const oe=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,se=`
  uniform float uTurnGain, uReflSpan, uRoomLift;   // (world-94) the turned face's lift and its reflected read of the wall; (world-92) a room's own factor
  uniform sampler2D uCopy; uniform float uSpectrum, uRefl, uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx, uLens, uSoft, uAspB, uTurn; uniform vec2 uSpot;
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
    vec2 rq = uv + ro; float wb = smoothstep(0., .04, min(min(rq.x, 1. - rq.x), min(rq.y, 1. - rq.y)));   // (world-99, job 94's review) near the screen's edges the reflected read leaves the copy and repeats its border (ClampToEdge): the reflection fades back to env there (no extra read; all under tk, so at rest unchanged)
    vec3 envT = mix(env, envS, tk * wb);
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
  }`;function j(w,t){const l=w.__sceneSize;return l?t.set(l[0],l[1]):w.getDrawingBufferSize(t)}const ue={copy:512,square:!0,soft:1,spectrum:0,refl:.8,boost:.945,env:1.4,warp:4,spot:[.5,.64],lens:1};function ce({scale:w=.5,copy:t=0,square:l=!1,soft:p=0,span:o=4,bend:r=.1,rough:a=.1,boost:u=1.2,env:h=1,glint:i=1,warp:g=4,spot:s=[.5,.64],lens:x=0,spectrum:d=1,refl:T=0,turnGain:y=1.27,reflSpan:L=.12}={}){const b=new O(4,4,{type:z,depthBuffer:!0,generateMipmaps:!1,minFilter:E,magFilter:E}),e={uCopy:{value:b.texture},uTime:{value:0},uBend:{value:r},uRough:{value:a},uBoost:{value:u},uEnv:{value:h},uGlint:{value:i},uOn:{value:1},uSpan:{value:o},uWarp:{value:g},uSpot:{value:new D(s[0],s[1])},uGrainPx:{value:1},uLens:{value:x},uSoft:{value:x*.01},uAspB:{value:1},uTurn:{value:0},uSpectrum:{value:d},uRefl:{value:T}},m=Object.assign(e,{uTurnGain:{value:y},uReflSpan:{value:L},uRoomLift:{value:1}}),c=new _({uniforms:m,vertexShader:oe,fragmentShader:se,toneMapped:!1}),f=new D,B=new A,C=new A,R=new Z;function M(S,H,q,k){j(S,f);const V=t&&l?t:t?Math.round(Math.min(f.x*.87,t*1.5)):Math.max(4,Math.round(f.x*w)),W=t&&l?t:t?Math.round(Math.min(f.y*.6,t*1.25)):Math.max(4,Math.round(f.y*w));(b.width!==V||b.height!==W)&&b.setSize(V,W);{const v=window.__markSpectrum;(v===0||v===1)&&(e.uSpectrum.value=v)}{const v=window.__glBoost;e.uBoost.value=typeof v=="number"?v:u}{const v=window.__glTurn2,F=Array.isArray(v)&&v.length===2;m.uTurnGain.value=F?v[0]:y,m.uReflSpan.value=F?v[1]:L}{const v=window.__glRough0;e.uRough.value=v===!0?0:a}k[0]&&(k[0].getWorldQuaternion(B),C.copy(q.quaternion).invert(),R.set(0,0,1).applyQuaternion(B).applyQuaternion(C),e.uTurn.value=1-R.z),e.uAspB.value=f.x/Math.max(1,f.y),e.uSoft.value=p*Math.min(.01,Math.max(.004,7/Math.max(1,f.x)));const I=S.getRenderTarget(),Q=k.map(v=>v.visible),K=S.getClearAlpha();try{k.forEach(v=>{v.visible=!1}),S.setRenderTarget(b),S.setClearAlpha(1),S.clear(),S.render(H,q)}finally{S.setRenderTarget(I),S.setClearAlpha(K),k.forEach((v,F)=>{v.visible=Q[F]}),c.visible=!window.__glHide}}return{material:c,uniforms:m,capture:M,target:b,dispose(){b.dispose(),c.dispose()}}}function ve(w=re.open){const t=new A,l=new A,p=new A,o=new ne,r=new D;let a={...w},u=0,h=0,i=0,g=!1,s=0,x=0;const d=new D,T=e=>{const n=e.clientX/innerWidth*2-1,m=-(e.clientY/innerHeight*2-1);g&&(s+=n-h,x+=m-i),h=n,i=m,g=!0},y=()=>{g=!1};addEventListener("pointermove",T,{passive:!0}),addEventListener("pointerdown",y,{passive:!0}),addEventListener("pointerup",y,{passive:!0}),addEventListener("pointercancel",y,{passive:!0});const L=14;function b(e,n={}){e=Math.min(e,.05);{const c=window.__markPose;if(Array.isArray(c)&&c.length===2)return t.setFromEuler(o.set(c[1]*Math.PI/180,c[0]*Math.PI/180,0)),t}if(n.room&&(a=n.room),u=n.blendW??u,n.still)r.set(0,0),t.identity(),s=x=0;else{const c=Math.max(0,1-Math.hypot(h,i)*1.5)*a.hover;if(!n.still){const B=a.gain??L;r.x-=x*B*c*(1-.7*u),r.y+=s*B*c}s=x=0,r.multiplyScalar(Math.max(0,1-e*(a.friction??1)));const f=r.y*e-(a.auto*e+Math.max(-30,Math.min(30,n.scrollV??0))*a.scroll)*(n.still?0:1);p.setFromEuler(o.set(r.x*e,f,0)),t.premultiply(p),t.slerp(l,Math.min(1,e*a.ret*(1-.8*u))),t.normalize()}const m=1-Math.exp(-e*3);return d.x+=((n.desk?(n.pointerX??0)*a.lean:0)-d.x)*m,d.y+=((n.desk?(n.pointerY??0)*a.lean:0)-d.y)*m,t}return{update:b,quaternion:t,spin:r,lean:d,kick(e,n){r.x+=e,r.y+=n},reset(){t.identity(),r.set(0,0)},dispose(){removeEventListener("pointermove",T),removeEventListener("pointerdown",y),removeEventListener("pointerup",y),removeEventListener("pointercancel",y)}}}const P="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function he({engineVig:w=.55}={}){let t=1;const l=()=>new O(4,4,{type:z,depthBuffer:!1,generateMipmaps:!1,minFilter:E,magFilter:E}),p=new O(4,4,{type:z,depthBuffer:!0,generateMipmaps:!1,minFilter:E,magFilter:E}),o=[l(),l(),l()],r=[l(),l(),l()],a=new $(-1,1,1,-1,0,1),u=new U(new G(2,2));u.frustumCulled=!1;const h=new ee;h.add(u);const i=new _({uniforms:{tIn:{value:null},uDir:{value:new D},uBright:{value:0}},vertexShader:P,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),g=new _({uniforms:{tMain:{value:p.texture},t1:{value:o[0].texture},t2:{value:o[1].texture},t3:{value:o[2].texture},uAsp:{value:1},uEV:{value:w},uOn:{value:1}},vertexShader:P,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),s=new U(new G(2,2),g);s.frustumCulled=!1,s.renderOrder=1e6,s.visible=!1;let x=[];const d=new D,T=(e,n,m,c,f,B)=>{i.uniforms.tIn.value=n,i.uniforms.uDir.value.set(c,f),i.uniforms.uBright.value=B,u.material=i,e.setRenderTarget(m),e.render(h,a)};function y(e,n,m){j(e,d);const c=Math.max(4,d.x),f=Math.max(4,d.y);(p.width!==c||p.height!==f||o[0].width!==Math.max(2,Math.round(c/4/t)))&&(p.setSize(c,f),[4,8,16].forEach((M,S)=>{o[S].setSize(Math.max(2,Math.round(c/M/t)),Math.max(2,Math.round(f/M/t))),r[S].setSize(o[S].width,o[S].height)})),g.uniforms.uAsp.value=c/f;const B=e.getRenderTarget(),C=e.getClearAlpha();s.visible=!1,e.setRenderTarget(p),e.setClearAlpha(1),e.clear(),e.render(n,m);let R=p.texture;for(let M=0;M<3;M++)T(e,R,r[M],1/r[M].width,0,M===0?1:0),T(e,r[M].texture,o[M],0,1/o[M].height,0),R=o[M].texture;e.setRenderTarget(B),e.setClearAlpha(C)}function L(e){x=e.children.filter(n=>n!==s).map(n=>[n,n.visible]);for(const[n]of x)n.visible=!1;s.visible=!0}function b(){for(const[e,n]of x)e.visible=n;x=[],s.visible=!1}return{quad:s,render:y,only:L,show:b,uniforms:g.uniforms,setPx(e){t=Math.max(1,e)},dispose(){p.dispose(),o.forEach(e=>e.dispose()),r.forEach(e=>e.dispose()),i.dispose(),g.dispose(),u.geometry.dispose(),s.geometry.dispose()}}}function pe(w,{font:t='700 300px "Space Grotesk Variable", sans-serif',rtl:l=!1,level:p=1.5,spacing:o="0px"}={}){const r=document.createElement("canvas"),a=r.getContext("2d");a.font=t,a.direction=l?"rtl":"ltr",a.letterSpacing=o,a.textAlign="left",a.textBaseline="alphabetic";const u=a.measureText(w),h=8,i=Math.ceil(u.actualBoundingBoxLeft),g=Math.ceil(u.actualBoundingBoxRight),s=Math.ceil(u.actualBoundingBoxAscent),x=Math.ceil(u.actualBoundingBoxDescent);r.width=i+g+h*2,r.height=s+x+h*2,a.font=t,a.direction=l?"rtl":"ltr",a.letterSpacing=o,a.textAlign="left",a.textBaseline="alphabetic",a.fillStyle="#fff",a.fillText(w,h+i,h+s);const d=new te(r);d.anisotropy=8,d.generateMipmaps=!0,d.minFilter=ae;const T=r.width/r.height,y=(i+g)/r.width,L={uTex:{value:d},uLevel:{value:p},uOn:{value:1}},b=new _({uniforms:L,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new U(new G(1,1/T),b);return{mesh:e,uniforms:L,fit:m=>{e.scale.setScalar(m/y)},aspect:T,glyphShare:y,dispose(){d.dispose(),b.dispose(),e.geometry.dispose()}}}export{re as M,ue as O,le as a,ce as b,he as c,pe as d,ve as m};
