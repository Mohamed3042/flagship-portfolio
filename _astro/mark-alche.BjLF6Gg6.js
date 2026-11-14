import{u as H,v as U,x as I,y as Q,W as O,z as B,H as A,B as F,b as k,k as K,Q as C,F as X,M as R,a as _,S as Y,I as J,J as Z,n as $}from"./EditionWorld.astro_astro_type_script_index_0_lang.uQWma2dF.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ee={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function oe({depthK:x=.245,bevelK:o=.05,stroke:l=.07}={}){const d=H(U.M,U.K,2.15,l);let r=1e9,n=-1e9;for(const m of d)for(const[i]of m)r=Math.min(r,i),n=Math.max(n,i);const a=n-r,u=a*x,c=u*o,s=new I(Q(d),{depth:u-2*c,curveSegments:4,bevelEnabled:!0,bevelThickness:c,bevelSize:c*.9,bevelSegments:3});return s.center(),s.computeVertexNormals(),s.userData.mkMark="alche",s.userData.width=a+2*c*.9,s}const te=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC; varying vec2 vMid;
  void main(){
    vec4 mc = projectionMatrix * modelViewMatrix * vec4(0., 0., 0., 1.); vMid = mc.xy / max(mc.w, 1e-3) * .5 + .5;   // (world-82) the mark's middle on the screen (uv): the lens magnifies about it
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,ae=`
  uniform sampler2D uCopy; uniform float uSpectrum, uRefl, uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx, uLens, uSoft, uAspB, uTurn, uFloor; uniform vec2 uSpot;
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
    col = col + mix(col, env, .9 * F) * (1. - F);
    col += env * (F + .35 * smoothstep(.15, .3, uTurn)) * uRefl;   // (world-89) the environment's reflection by Fresnel (alche's means against a dark turned face): faint face-on (F .1), a neutral lit rim on the turned faces and side walls; no floor, no tint
    col *= uBoost;
    // (world-89) no floor of light, no sheen of colour: a turned face stays lit by alche's means only, the boost and the
    // environment's reflection by Fresnel (above); colour lives only in the refracted image's parting (uSpectrum)
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function q(x,o){const l=x.__sceneSize;return l?o.set(l[0],l[1]):x.getDrawingBufferSize(o)}const re={copy:512,square:!0,soft:1,spectrum:0,refl:.8,boost:.945,env:1.4,warp:4,spot:[.5,.64],lens:1};function ie({scale:x=.5,copy:o=0,square:l=!1,soft:d=0,span:r=4,bend:n=.1,rough:a=.1,boost:u=1.2,env:c=1,glint:s=1,warp:m=4,spot:i=[.5,.64],lens:y=0,spectrum:p=1,refl:L=0}={}){const v=new O(4,4,{type:A,depthBuffer:!0,generateMipmaps:!1,minFilter:B,magFilter:B}),g={uCopy:{value:v.texture},uTime:{value:0},uBend:{value:n},uRough:{value:a},uBoost:{value:u},uEnv:{value:c},uGlint:{value:s},uOn:{value:1},uSpan:{value:r},uWarp:{value:m},uSpot:{value:new F(i[0],i[1])},uGrainPx:{value:1},uLens:{value:y},uSoft:{value:y*.01},uAspB:{value:1},uTurn:{value:0},uFloor:{value:1},uSpectrum:{value:p},uRefl:{value:L}},T=new k({uniforms:g,vertexShader:te,fragmentShader:ae,toneMapped:!1}),e=new F,t=new C,w=new C,b=new K;function S(f,z,D,h){q(f,e);const E=o&&l?o:o?Math.round(Math.min(e.x*.87,o*1.5)):Math.max(4,Math.round(e.x*x)),V=o&&l?o:o?Math.round(Math.min(e.y*.6,o*1.25)):Math.max(4,Math.round(e.y*x));(v.width!==E||v.height!==V)&&v.setSize(E,V);{const M=window.__markSpectrum;(M===0||M===1)&&(g.uSpectrum.value=M)}{const M=window.__glBoost;g.uBoost.value=typeof M=="number"?M:u}h[0]&&(h[0].getWorldQuaternion(t),w.copy(D.quaternion).invert(),b.set(0,0,1).applyQuaternion(t).applyQuaternion(w),g.uTurn.value=1-b.z),g.uAspB.value=e.x/Math.max(1,e.y),g.uSoft.value=d*Math.min(.01,Math.max(.004,7/Math.max(1,e.x))),g.uFloor.value=0;const W=f.getRenderTarget(),N=h.map(M=>M.visible),P=f.getClearAlpha();try{h.forEach(M=>{M.visible=!1}),f.setRenderTarget(v),f.setClearAlpha(1),f.clear(),f.render(z,D)}finally{f.setRenderTarget(W),f.setClearAlpha(P),h.forEach((M,j)=>{M.visible=N[j]}),T.visible=!window.__glHide}}return{material:T,uniforms:g,capture:S,target:v,dispose(){v.dispose(),T.dispose()}}}function se(x=ee.open){const o=new C,l=new C,d=new C,r=new $,n=new F;let a={...x},u=0,c=0,s=0,m=!1,i=0,y=0;const p=new F,L=e=>{const t=e.clientX/innerWidth*2-1,w=-(e.clientY/innerHeight*2-1);m&&(i+=t-c,y+=w-s),c=t,s=w,m=!0},v=()=>{m=!1};addEventListener("pointermove",L,{passive:!0}),addEventListener("pointerdown",v,{passive:!0}),addEventListener("pointerup",v,{passive:!0}),addEventListener("pointercancel",v,{passive:!0});const g=14;function T(e,t={}){e=Math.min(e,.05),t.room&&(a=t.room),u=t.blendW??u;const w=Math.max(0,1-Math.hypot(c,s)*1.5)*a.hover;if(!t.still){const f=a.gain??g;n.x-=y*f*w*(1-.7*u),n.y+=i*f*w}i=y=0,n.multiplyScalar(Math.max(0,1-e*(a.friction??1)));const b=n.y*e-(a.auto*e+Math.max(-30,Math.min(30,t.scrollV??0))*a.scroll)*(t.still?0:1);d.setFromEuler(r.set(n.x*e,b,0)),o.premultiply(d),o.slerp(l,Math.min(1,e*a.ret*(1-.8*u))),o.normalize();const S=1-Math.exp(-e*3);return p.x+=((t.desk?(t.pointerX??0)*a.lean:0)-p.x)*S,p.y+=((t.desk?(t.pointerY??0)*a.lean:0)-p.y)*S,o}return{update:T,quaternion:o,spin:n,lean:p,kick(e,t){n.x+=e,n.y+=t},reset(){o.identity(),n.set(0,0)},dispose(){removeEventListener("pointermove",L),removeEventListener("pointerdown",v),removeEventListener("pointerup",v),removeEventListener("pointercancel",v)}}}const G="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function le({engineVig:x=.55}={}){let o=1;const l=()=>new O(4,4,{type:A,depthBuffer:!1,generateMipmaps:!1,minFilter:B,magFilter:B}),d=new O(4,4,{type:A,depthBuffer:!0,generateMipmaps:!1,minFilter:B,magFilter:B}),r=[l(),l(),l()],n=[l(),l(),l()],a=new X(-1,1,1,-1,0,1),u=new R(new _(2,2));u.frustumCulled=!1;const c=new Y;c.add(u);const s=new k({uniforms:{tIn:{value:null},uDir:{value:new F},uBright:{value:0}},vertexShader:G,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),m=new k({uniforms:{tMain:{value:d.texture},t1:{value:r[0].texture},t2:{value:r[1].texture},t3:{value:r[2].texture},uAsp:{value:1},uEV:{value:x},uOn:{value:1}},vertexShader:G,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),i=new R(new _(2,2),m);i.frustumCulled=!1,i.renderOrder=1e6,i.visible=!1;let y=[];const p=new F,L=(e,t,w,b,S,f)=>{s.uniforms.tIn.value=t,s.uniforms.uDir.value.set(b,S),s.uniforms.uBright.value=f,u.material=s,e.setRenderTarget(w),e.render(c,a)};function v(e,t,w){q(e,p);const b=Math.max(4,p.x),S=Math.max(4,p.y);(d.width!==b||d.height!==S||r[0].width!==Math.max(2,Math.round(b/4/o)))&&(d.setSize(b,S),[4,8,16].forEach((h,E)=>{r[E].setSize(Math.max(2,Math.round(b/h/o)),Math.max(2,Math.round(S/h/o))),n[E].setSize(r[E].width,r[E].height)})),m.uniforms.uAsp.value=b/S;const f=e.getRenderTarget(),z=e.getClearAlpha();i.visible=!1,e.setRenderTarget(d),e.setClearAlpha(1),e.clear(),e.render(t,w);let D=d.texture;for(let h=0;h<3;h++)L(e,D,n[h],1/n[h].width,0,h===0?1:0),L(e,n[h].texture,r[h],0,1/r[h].height,0),D=r[h].texture;e.setRenderTarget(f),e.setClearAlpha(z)}function g(e){y=e.children.filter(t=>t!==i).map(t=>[t,t.visible]);for(const[t]of y)t.visible=!1;i.visible=!0}function T(){for(const[e,t]of y)e.visible=t;y=[],i.visible=!1}return{quad:i,render:v,only:g,show:T,uniforms:m.uniforms,setPx(e){o=Math.max(1,e)},dispose(){d.dispose(),r.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),s.dispose(),m.dispose(),u.geometry.dispose(),i.geometry.dispose()}}}function ue(x,{font:o='700 300px "Space Grotesk Variable", sans-serif',rtl:l=!1,level:d=1.5,spacing:r="0px"}={}){const n=document.createElement("canvas"),a=n.getContext("2d");a.font=o,a.direction=l?"rtl":"ltr",a.letterSpacing=r,a.textAlign="left",a.textBaseline="alphabetic";const u=a.measureText(x),c=8,s=Math.ceil(u.actualBoundingBoxLeft),m=Math.ceil(u.actualBoundingBoxRight),i=Math.ceil(u.actualBoundingBoxAscent),y=Math.ceil(u.actualBoundingBoxDescent);n.width=s+m+c*2,n.height=i+y+c*2,a.font=o,a.direction=l?"rtl":"ltr",a.letterSpacing=r,a.textAlign="left",a.textBaseline="alphabetic",a.fillStyle="#fff",a.fillText(x,c+s,c+i);const p=new J(n);p.anisotropy=8,p.generateMipmaps=!0,p.minFilter=Z;const L=n.width/n.height,v=(s+m)/n.width,g={uTex:{value:p},uLevel:{value:d},uOn:{value:1}},T=new k({uniforms:g,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new R(new _(1,1/L),T);return{mesh:e,uniforms:g,fit:w=>{e.scale.setScalar(w/v)},aspect:L,glyphShare:v,dispose(){p.dispose(),T.dispose(),e.geometry.dispose()}}}export{ee as M,re as O,oe as a,ie as b,le as c,ue as d,se as m};
