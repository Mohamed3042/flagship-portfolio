import{u as _,v as A,x as W,y as N,W as F,z as T,H as O,B as D,b as z,Q as C,F as q,M as R,a as V,S as P,I as j,J as H,n as I}from"./EditionWorld.astro_astro_type_script_index_0_lang.B1LhbRKH.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const K={open:{ret:3.5,hover:1,auto:0,scroll:0,lean:.5,friction:6,gain:24}};function J({depthK:f=.245,bevelK:s=.05,stroke:l=.07}={}){const h=_(A.M,A.K,2.15,l);let o=1e9,n=-1e9;for(const d of h)for(const[i]of d)o=Math.min(o,i),n=Math.max(n,i);const a=n-o,v=a*f,u=v*s,r=new W(N(h),{depth:v-2*u,curveSegments:4,bevelEnabled:!0,bevelThickness:u,bevelSize:u*.9,bevelSegments:3});return r.center(),r.computeVertexNormals(),r.userData.mkMark="alche",r.userData.width=a+2*u*.9,r}const Q=`
  varying vec3 vN, vV, vL, vON; varying vec4 vC; varying vec2 vMid;
  void main(){
    vec4 mc = projectionMatrix * modelViewMatrix * vec4(0., 0., 0., 1.); vMid = mc.xy / max(mc.w, 1e-3) * .5 + .5;   // (world-82) the mark's middle on the screen (uv): the lens magnifies about it
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vN = normalize(normalMatrix * normal); vV = mv.xyz; vL = position; vON = normal;   // (world-38e) the letter's own place and facing: the rain lives ON the glass
    gl_Position = projectionMatrix * mv; vC = gl_Position;
  }`,X=`
  uniform sampler2D uCopy; uniform float uTime, uBend, uRough, uBoost, uEnv, uGlint, uOn, uSpan, uWarp, uGrainPx, uLens, uSoft; uniform vec2 uSpot;
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
    float soft = uSoft;   // (world-82) ~7 buffer px (capture() sets it: .01 of a phone's width, .004 of a 2000 px desk: his desk keeps the big shapes, loses the thin lines)
    vec3 col = vec3(0.);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 rp = floor(gl_FragCoord.xy / uGrainPx) + fi * vec2(17.3, 31.7);   // (world-38e) the sand in grains of alche's pixel (his picture is drawn at 1.5 x CSS)
      float slide = .005 + h1(rp) * .007;
      vec2 j = (vec2(h1(rp + 3.1), h1(rp + 7.7)) - .5) * (rough * .3 + soft * vec2(1., .55));
      vec2 o = -bendDir;
      col.r += texture2D(uCopy, uvL + o * (uBend + slide) + j).r;
      col.g += texture2D(uCopy, uvL + o * (uBend + slide * 2.) + j).g;
      col.b += texture2D(uCopy, uvL + o * (uBend + slide * 4.) + j).b;
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
    // one fixed light: a mirror-sharp glint on the edges facing up-left
    vec3 L = normalize(vec3(-1., .8, -1.)), H = normalize(L + V);
    float a = .003 + rough * .4, a2 = a * a, nh = max(dot(n, H), 0.), d = nh * nh * (a2 - 1.) + 1.;
    col += min(a2 / (3.14159 * d * d) * .002, 6.) * uGlint;
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)) * uOn, 1.);
  }`;function G(f,s){const l=f.__sceneSize;return l?s.set(l[0],l[1]):f.getDrawingBufferSize(s)}function Z({scale:f=.5,copy:s=0,span:l=4,bend:h=.1,rough:o=.1,boost:n=1.2,env:a=1,glint:v=1,warp:u=4,spot:r=[.5,.64],lens:d=0}={}){const i=new F(4,4,{type:O,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),g={uCopy:{value:i.texture},uTime:{value:0},uBend:{value:h},uRough:{value:o},uBoost:{value:n},uEnv:{value:a},uGlint:{value:v},uOn:{value:1},uSpan:{value:l},uWarp:{value:u},uSpot:{value:new D(r[0],r[1])},uGrainPx:{value:1},uLens:{value:d},uSoft:{value:d*.01}},c=new z({uniforms:g,vertexShader:Q,fragmentShader:X,toneMapped:!1}),m=new D;function y(p,S,e,t){G(p,m);const x=s?Math.round(Math.min(m.x*.87,s*1.5)):Math.max(4,Math.round(m.x*f)),M=s?Math.round(Math.min(m.y*.6,s*1.25)):Math.max(4,Math.round(m.y*f));(i.width!==x||i.height!==M)&&i.setSize(x,M),g.uSoft.value=d*Math.min(.01,Math.max(.004,7/Math.max(1,m.x)));const b=p.getRenderTarget(),L=t.map(E=>E.visible),B=p.getClearAlpha();t.forEach(E=>{E.visible=!1}),p.setRenderTarget(i),p.setClearAlpha(1),p.clear(),p.render(S,e),p.setRenderTarget(b),p.setClearAlpha(B),t.forEach((E,w)=>{E.visible=L[w]})}return{material:c,uniforms:g,capture:y,target:i,dispose(){i.dispose(),c.dispose()}}}function $(f=K.open){const s=new C,l=new C,h=new C,o=new I,n=new D;let a={...f},v=0,u=0,r=0,d=!1,i=0,g=0;const c=new D,m=e=>{const t=e.clientX/innerWidth*2-1,x=-(e.clientY/innerHeight*2-1);d&&(i+=t-u,g+=x-r),u=t,r=x,d=!0},y=()=>{d=!1};addEventListener("pointermove",m,{passive:!0}),addEventListener("pointerdown",y,{passive:!0}),addEventListener("pointerup",y,{passive:!0}),addEventListener("pointercancel",y,{passive:!0});const p=14;function S(e,t={}){e=Math.min(e,.05),t.room&&(a=t.room),v=t.blendW??v;const x=Math.max(0,1-Math.hypot(u,r)*1.5)*a.hover;if(!t.still){const L=a.gain??p;n.x-=g*L*x*(1-.7*v),n.y+=i*L*x}i=g=0,n.multiplyScalar(Math.max(0,1-e*(a.friction??1)));const M=n.y*e-(a.auto*e+Math.max(-30,Math.min(30,t.scrollV??0))*a.scroll)*(t.still?0:1);h.setFromEuler(o.set(n.x*e,M,0)),s.premultiply(h),s.slerp(l,Math.min(1,e*a.ret*(1-.8*v))),s.normalize();const b=1-Math.exp(-e*3);return c.x+=((t.desk?(t.pointerX??0)*a.lean:0)-c.x)*b,c.y+=((t.desk?(t.pointerY??0)*a.lean:0)-c.y)*b,s}return{update:S,quaternion:s,spin:n,lean:c,kick(e,t){n.x+=e,n.y+=t},reset(){s.identity(),n.set(0,0)},dispose(){removeEventListener("pointermove",m),removeEventListener("pointerdown",y),removeEventListener("pointerup",y),removeEventListener("pointercancel",y)}}}const U="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function ee({engineVig:f=.55}={}){let s=1;const l=()=>new F(4,4,{type:O,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),h=new F(4,4,{type:O,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),o=[l(),l(),l()],n=[l(),l(),l()],a=new q(-1,1,1,-1,0,1),v=new R(new V(2,2));v.frustumCulled=!1;const u=new P;u.add(v);const r=new z({uniforms:{tIn:{value:null},uDir:{value:new D},uBright:{value:0}},vertexShader:U,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec3 c = texture2D(tIn, u).rgb; if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); c = c * max(c - .9, 0.); } return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),d=new z({uniforms:{tMain:{value:h.texture},t1:{value:o[0].texture},t2:{value:o[1].texture},t3:{value:o[2].texture},uAsp:{value:1},uEV:{value:f},uOn:{value:1}},vertexShader:U,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMain, vUv).rgb;
        vec3 d = pow(max(c, 0.), vec3(1. / 2.2));
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * 1.3;
        vec3 o = pow(d, vec3(2.2));
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);   // the engine's own vignette, divided out
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1.);
      }`}),i=new R(new V(2,2),d);i.frustumCulled=!1,i.renderOrder=1e6,i.visible=!1;let g=[];const c=new D,m=(e,t,x,M,b,L)=>{r.uniforms.tIn.value=t,r.uniforms.uDir.value.set(M,b),r.uniforms.uBright.value=L,v.material=r,e.setRenderTarget(x),e.render(u,a)};function y(e,t,x){G(e,c);const M=Math.max(4,c.x),b=Math.max(4,c.y);(h.width!==M||h.height!==b||o[0].width!==Math.max(2,Math.round(M/4/s)))&&(h.setSize(M,b),[4,8,16].forEach((w,k)=>{o[k].setSize(Math.max(2,Math.round(M/w/s)),Math.max(2,Math.round(b/w/s))),n[k].setSize(o[k].width,o[k].height)})),d.uniforms.uAsp.value=M/b;const L=e.getRenderTarget(),B=e.getClearAlpha();i.visible=!1,e.setRenderTarget(h),e.setClearAlpha(1),e.clear(),e.render(t,x);let E=h.texture;for(let w=0;w<3;w++)m(e,E,n[w],1/n[w].width,0,w===0?1:0),m(e,n[w].texture,o[w],0,1/o[w].height,0),E=o[w].texture;e.setRenderTarget(L),e.setClearAlpha(B)}function p(e){g=e.children.filter(t=>t!==i).map(t=>[t,t.visible]);for(const[t]of g)t.visible=!1;i.visible=!0}function S(){for(const[e,t]of g)e.visible=t;g=[],i.visible=!1}return{quad:i,render:y,only:p,show:S,uniforms:d.uniforms,setPx(e){s=Math.max(1,e)},dispose(){h.dispose(),o.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),r.dispose(),d.dispose(),v.geometry.dispose(),i.geometry.dispose()}}}function te(f,{font:s='700 300px "Space Grotesk Variable", sans-serif',rtl:l=!1,level:h=1.5,spacing:o="0px"}={}){const n=document.createElement("canvas"),a=n.getContext("2d");a.font=s,a.direction=l?"rtl":"ltr",a.letterSpacing=o,a.textAlign="left",a.textBaseline="alphabetic";const v=a.measureText(f),u=8,r=Math.ceil(v.actualBoundingBoxLeft),d=Math.ceil(v.actualBoundingBoxRight),i=Math.ceil(v.actualBoundingBoxAscent),g=Math.ceil(v.actualBoundingBoxDescent);n.width=r+d+u*2,n.height=i+g+u*2,a.font=s,a.direction=l?"rtl":"ltr",a.letterSpacing=o,a.textAlign="left",a.textBaseline="alphabetic",a.fillStyle="#fff",a.fillText(f,u+r,u+i);const c=new j(n);c.anisotropy=8,c.generateMipmaps=!0,c.minFilter=H;const m=n.width/n.height,y=(r+d)/n.width,p={uTex:{value:c},uLevel:{value:h},uOn:{value:1}},S=new z({uniforms:p,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new R(new V(1,1/m),S);return{mesh:e,uniforms:p,fit:x=>{e.scale.setScalar(x/y)},aspect:m,glyphShare:y,dispose(){c.dispose(),S.dispose(),e.geometry.dispose()}}}export{K as M,J as a,Z as b,ee as c,te as d,$ as m};
