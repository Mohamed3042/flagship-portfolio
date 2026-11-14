import{u as _,v as V,x as W,y as N,W as A,z as T,H as F,B,b as D,Q as z,F as q,M as O,a as R,S as P,I as j,J as H,n as I}from"./EditionWorld.astro_astro_type_script_index_0_lang.BAMIxKDB.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const K={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function J({depthK:g=.245,bevelK:s=.05,stroke:l=.07}={}){const h=_(V.M,V.K,2.15,l);let r=1e9,n=-1e9;for(const d of h)for(const[o]of d)r=Math.min(r,o),n=Math.max(n,o);const a=n-r,u=a*g,v=u*s,i=new W(N(h),{depth:u-2*v,curveSegments:4,bevelEnabled:!0,bevelThickness:v,bevelSize:v*.9,bevelSegments:3});return i.center(),i.computeVertexNormals(),i.userData.mkMark="alche",i.userData.width=a+2*v*.9,i}const Q=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC; varying vec2 vMid;
  void main(){
    vec4 mc = projectionMatrix * modelViewMatrix * vec4(0., 0., 0., 1.); vMid = mc.xy / max(mc.w, 1e-3) * .5 + .5;   // (world-82) the mark's middle on the screen (uv): the lens magnifies about it
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,X=`
  uniform sampler2D uCopy; uniform float uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx, uLens, uSoft, uAspB, uTurn; uniform vec2 uSpot;
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
    float nzL = vn(luv * 1.6 + (wv - .5) * 2.) * .7 + vn(luv * 3.4 + (wv.yx - .5) * 2.) * .3;   // (world-82) his second read: the letter's uv x1, pushed by the fine first read: a few big soft areas, not many small spots
    float rough = mix(smoothstep(uSpot.x, uSpot.y, nz), smoothstep(.3, .8, nzL), uLens) * uRough;
    // (world-82, the owner 14 Nov: "those white lines against my mark glass alche has something") uLens > 0 (the Open): the
    // glass as a thick frosted body. alche's frost ramp (.3-.8, his running page: nearly the whole face is jittered, ours
    // .5-.64 left ~70 % of it clear and the wall's white grid ran through crisp), a floor of soft read everywhere (no line,
    // plus mark or label survives sharp), the wall seen ~4 % larger (his frames: face-on his seams stay put) about the mark's middle and nudged by the glass's own
    // slow warp (a grid line entering the glass breaks and shifts at the edge). 0 = the glass as before (Studio, wall-alone).
    vec2 uvL = mix(uv, vMid + (uv - vMid) / 1.04 + (wv - .5) * vec2(.008, .005), uLens);
    float bev = smoothstep(.12, .45, min(an.z, length(an.xy))) * uLens;   // (world-84) 1 on the round bevel (its normal leans both ways), 0 on the front face and the side walls
    float disp = mix(1., .04, uLens * (1. - bev));   // (world-84) the Open's body splits red from blue by under ~3 px at 2000 px (a fringe, never a second copy); the bevels keep the full split
    float tw = smoothstep(.003, .12, uTurn) * uLens;   // (world-86) 0 at rest (the glass exactly as world-84), 1 once the mark has turned ~30 deg
    float soft = uSoft * (1. + 2. * bev) * (1. + 3. * tw);   // (world-86) turned faces read a wider, softer area of the wall   // (world-84) the bevels read broader: a sheen, not a pattern   // (world-82) ~7 buffer px (capture() sets it: .01 of a phone's width, .004 of a 2000 px desk: his desk keeps the big shapes, loses the thin lines)
    vec3 col = vec3(0.);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 rp = floor(gl_FragCoord.xy / uGrainPx) + fi * vec2(17.3, 31.7);   // (world-38e) the sand in grains of alche's pixel (his picture is drawn at 1.5 x CSS)
      float slide = .005 + h1(rp) * .007;
      vec2 j = (vec2(h1(rp + 3.1), h1(rp + 7.7)) - .5) * (rough * .3 + soft * vec2(1., mix(.55, uAspB, uLens)));   // (world-84, review) even in buffer px: y in uv = x x width / height
      vec2 o = -bendDir;
      col.r += texture2D(uCopy, uvL + o * (uBend + slide) + j).r;
      col.g += texture2D(uCopy, uvL + o * (uBend + slide * (1. + disp)) + j).g;
      col.b += texture2D(uCopy, uvL + o * (uBend + slide * (1. + 3. * disp)) + j).b;
    }
    col *= .9 / 8.;
    col.g = mix(col.g, min(col.g, col.b), uLens);   // (world-82) the Open's fringes stay red / white / blue / violet: no yellow or orange (green never above blue)
    col = pow(max(col, 0.), vec3(1. / 2.2));   // alche's maths works on display values (his page writes them raw); ours are linear: encode, work, decode
    // the boost and the faint environment, by the angle (face-on ~2x the copy, the rim ~1.1x)
    float cs = clamp(dot(n, V), 0., 1.), F = .1 + .9 * pow(1. - cs, 5.);
    vec3 r = reflect(-V, n);
    vec3 env = vec3(.44) * (.35 + .65 * smoothstep(-.3, .9, r.y)) * uEnv;
    col = col + mix(col, env, .9 * F) * (1. - F);
    col *= uBoost;
    // (world-86) the turned faces stay a luminous body (alche's turned A): a floor of the wall's own light around the mark (a wide
    // ring read about the mark's middle, its colour kept: red on red, blue on blue), lifted ~1.6x; the face's own read rides on top as soft bands
    if (tw > 0.) {
      vec3 wm = vec3(0.);
      for (int k = 0; k < 8; k++) { float a = float(k) * .785398; vec2 d = vec2(cos(a), sin(a) * uAspB) * .1;
        wm += min(pow(max(texture2D(uCopy, vMid + d * 1.5).rgb, 0.), vec3(1. / 2.2)), vec3(.4)) + min(pow(max(texture2D(uCopy, vMid + d * 2.5).rgb, 0.), vec3(1. / 2.2)), vec3(.4)); }   // capped: the white name passing behind never paints the body
      wm /= 16.; wm.g = min(wm.g, wm.b);
      col = mix(col, max(col, wm * 1.75 * uBoost), tw);   // (the floor scales with the boost too)
    }
    // (world-84) the turned bevel faces: a broad soft iridescent sheen by their angle to the eye (crimson -> white -> blue -> violet; no green, yellow or orange)
    float ph = fract(cs * 1.6 + (n.x - n.y) * .35);
    vec3 sh = mix(mix(vec3(.85, .12, .3), vec3(1.), smoothstep(0., .35, ph)), mix(vec3(.25, .4, 1.), vec3(.55, .3, 1.), smoothstep(.65, 1., ph)), smoothstep(.3, .7, ph));
    col += sh * bev * (1. - cs * .6) * .35 * (1. + .6 * tw) * (.4 + .6 * dot(col, vec3(.33)));
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function G(g,s){const l=g.__sceneSize;return l?s.set(l[0],l[1]):g.getDrawingBufferSize(s)}function Z({scale:g=.5,copy:s=0,span:l=4,bend:h=.1,rough:r=.1,boost:n=1.2,env:a=1,glint:u=1,warp:v=4,spot:i=[.5,.64],lens:d=0}={}){const o=new A(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),f={uCopy:{value:o.texture},uTime:{value:0},uBend:{value:h},uRough:{value:r},uBoost:{value:n},uEnv:{value:a},uGlint:{value:u},uOn:{value:1},uSpan:{value:l},uWarp:{value:v},uSpot:{value:new B(i[0],i[1])},uGrainPx:{value:1},uLens:{value:d},uSoft:{value:d*.01},uAspB:{value:1},uTurn:{value:0}},c=new D({uniforms:f,vertexShader:Q,fragmentShader:X,toneMapped:!1}),p=new B;function y(m,S,e,t){G(m,p);const x=s?Math.round(Math.min(p.x*.87,s*1.5)):Math.max(4,Math.round(p.x*g)),b=s?Math.round(Math.min(p.y*.6,s*1.25)):Math.max(4,Math.round(p.y*g));(o.width!==x||o.height!==b)&&o.setSize(x,b),f.uAspB.value=p.x/Math.max(1,p.y),f.uSoft.value=d*Math.min(.01,Math.max(.004,7/Math.max(1,p.x)));const M=m.getRenderTarget(),L=t.map(k=>k.visible),C=m.getClearAlpha();t.forEach(k=>{k.visible=!1}),m.setRenderTarget(o),m.setClearAlpha(1),m.clear(),m.render(S,e),m.setRenderTarget(M),m.setClearAlpha(C),t.forEach((k,w)=>{k.visible=L[w]})}return{material:c,uniforms:f,capture:y,target:o,dispose(){o.dispose(),c.dispose()}}}function $(g=K.open){const s=new z,l=new z,h=new z,r=new I,n=new B;let a={...g},u=0,v=0,i=0,d=!1,o=0,f=0;const c=new B,p=e=>{const t=e.clientX/innerWidth*2-1,x=-(e.clientY/innerHeight*2-1);d&&(o+=t-v,f+=x-i),v=t,i=x,d=!0},y=()=>{d=!1};addEventListener("pointermove",p,{passive:!0}),addEventListener("pointerdown",y,{passive:!0}),addEventListener("pointerup",y,{passive:!0}),addEventListener("pointercancel",y,{passive:!0});const m=14;function S(e,t={}){e=Math.min(e,.05),t.room&&(a=t.room),u=t.blendW??u;const x=Math.max(0,1-Math.hypot(v,i)*1.5)*a.hover;if(!t.still){const L=a.gain??m;n.x-=f*L*x*(1-.7*u),n.y+=o*L*x}o=f=0,n.multiplyScalar(Math.max(0,1-e*(a.friction??1)));const b=n.y*e-(a.auto*e+Math.max(-30,Math.min(30,t.scrollV??0))*a.scroll)*(t.still?0:1);h.setFromEuler(r.set(n.x*e,b,0)),s.premultiply(h),s.slerp(l,Math.min(1,e*a.ret*(1-.8*u))),s.normalize();const M=1-Math.exp(-e*3);return c.x+=((t.desk?(t.pointerX??0)*a.lean:0)-c.x)*M,c.y+=((t.desk?(t.pointerY??0)*a.lean:0)-c.y)*M,s}return{update:S,quaternion:s,spin:n,lean:c,kick(e,t){n.x+=e,n.y+=t},reset(){s.identity(),n.set(0,0)},dispose(){removeEventListener("pointermove",p),removeEventListener("pointerdown",y),removeEventListener("pointerup",y),removeEventListener("pointercancel",y)}}}const U="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function ee({engineVig:g=.55}={}){let s=1;const l=()=>new A(4,4,{type:F,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),h=new A(4,4,{type:F,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),r=[l(),l(),l()],n=[l(),l(),l()],a=new q(-1,1,1,-1,0,1),u=new O(new R(2,2));u.frustumCulled=!1;const v=new P;v.add(u);const i=new D({uniforms:{tIn:{value:null},uDir:{value:new B},uBright:{value:0}},vertexShader:U,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),d=new D({uniforms:{tMain:{value:h.texture},t1:{value:r[0].texture},t2:{value:r[1].texture},t3:{value:r[2].texture},uAsp:{value:1},uEV:{value:g},uOn:{value:1}},vertexShader:U,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),o=new O(new R(2,2),d);o.frustumCulled=!1,o.renderOrder=1e6,o.visible=!1;let f=[];const c=new B,p=(e,t,x,b,M,L)=>{i.uniforms.tIn.value=t,i.uniforms.uDir.value.set(b,M),i.uniforms.uBright.value=L,u.material=i,e.setRenderTarget(x),e.render(v,a)};function y(e,t,x){G(e,c);const b=Math.max(4,c.x),M=Math.max(4,c.y);(h.width!==b||h.height!==M||r[0].width!==Math.max(2,Math.round(b/4/s)))&&(h.setSize(b,M),[4,8,16].forEach((w,E)=>{r[E].setSize(Math.max(2,Math.round(b/w/s)),Math.max(2,Math.round(M/w/s))),n[E].setSize(r[E].width,r[E].height)})),d.uniforms.uAsp.value=b/M;const L=e.getRenderTarget(),C=e.getClearAlpha();o.visible=!1,e.setRenderTarget(h),e.setClearAlpha(1),e.clear(),e.render(t,x);let k=h.texture;for(let w=0;w<3;w++)p(e,k,n[w],1/n[w].width,0,w===0?1:0),p(e,n[w].texture,r[w],0,1/r[w].height,0),k=r[w].texture;e.setRenderTarget(L),e.setClearAlpha(C)}function m(e){f=e.children.filter(t=>t!==o).map(t=>[t,t.visible]);for(const[t]of f)t.visible=!1;o.visible=!0}function S(){for(const[e,t]of f)e.visible=t;f=[],o.visible=!1}return{quad:o,render:y,only:m,show:S,uniforms:d.uniforms,setPx(e){s=Math.max(1,e)},dispose(){h.dispose(),r.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),i.dispose(),d.dispose(),u.geometry.dispose(),o.geometry.dispose()}}}function te(g,{font:s='700 300px "Space Grotesk Variable", sans-serif',rtl:l=!1,level:h=1.5,spacing:r="0px"}={}){const n=document.createElement("canvas"),a=n.getContext("2d");a.font=s,a.direction=l?"rtl":"ltr",a.letterSpacing=r,a.textAlign="left",a.textBaseline="alphabetic";const u=a.measureText(g),v=8,i=Math.ceil(u.actualBoundingBoxLeft),d=Math.ceil(u.actualBoundingBoxRight),o=Math.ceil(u.actualBoundingBoxAscent),f=Math.ceil(u.actualBoundingBoxDescent);n.width=i+d+v*2,n.height=o+f+v*2,a.font=s,a.direction=l?"rtl":"ltr",a.letterSpacing=r,a.textAlign="left",a.textBaseline="alphabetic",a.fillStyle="#fff",a.fillText(g,v+i,v+o);const c=new j(n);c.anisotropy=8,c.generateMipmaps=!0,c.minFilter=H;const p=n.width/n.height,y=(i+d)/n.width,m={uTex:{value:c},uLevel:{value:h},uOn:{value:1}},S=new D({uniforms:m,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new O(new R(1,1/p),S);return{mesh:e,uniforms:m,fit:x=>{e.scale.setScalar(x/y)},aspect:p,glyphShare:y,dispose(){c.dispose(),S.dispose(),e.geometry.dispose()}}}export{K as M,J as a,Z as b,ee as c,te as d,$ as m};
