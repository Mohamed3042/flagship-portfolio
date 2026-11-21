import{h as re,i as j,j as oe,k as ie}from"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{W as L,j as T,H as I,U as q,k as C,d as U,M as V,c as G,S as O,l as se,V as z,B as Q,m as ue,Q as P,O as le,n as ce,o as Y,h as ve,p as me,q as fe}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Z=3.9,pe={open:{ret:2,hover:1,auto:0,scroll:0,lean:.5,friction:1,gain:Z}};function _e({depthK:f=.245,bevelK:m=.05,stroke:d=.07,bevelSeg:u=de,crease:l=J}={}){const a=re(j.M,j.K,2.15,d);let n=1e9,r=-1e9;for(const h of a)for(const[x]of h)n=Math.min(n,x),r=Math.max(r,x);const o=r-n,c=o*f,p=c*m,i=new ue(oe(a),{depth:c-2*p,curveSegments:4,bevelEnabled:!0,bevelThickness:p,bevelSize:p*.9,bevelSegments:u});return i.center(),i.userData.mkMark="mark",i.userData.width=o+2*p*.9,ge(i,i.userData.width,l),i}function ge(f,m,d=J){const u=f.getAttribute("position"),l=u.count,a=new Float32Array(l*3),n=new Float32Array(l*2),r=new Uint8Array(l/3);for(const e of f.groups)if(e.materialIndex===1)for(let t=e.start;t<e.start+e.count;t+=3)r[t/3]=1;const o=new Float32Array(l),c=new Float32Array(l/3),p=new z,i=new z,h=new z;for(let e=0;e<l/3;e++){p.fromBufferAttribute(u,e*3),i.fromBufferAttribute(u,e*3+1),h.fromBufferAttribute(u,e*3+2),i.sub(p),h.sub(p),i.cross(h);const t=i.length();c[e]=t/2,t>0&&i.divideScalar(t),o[e*3]=i.x,o[e*3+1]=i.y,o[e*3+2]=i.z}const x=e=>`${Math.round(u.getX(e)*1e4)},${Math.round(u.getY(e)*1e4)},${Math.round(u.getZ(e)*1e4)}`,w=new Map;for(let e=0;e<l;e++)if(r[e/3|0]){const t=x(e),v=w.get(t);v?v.push(e/3|0):w.set(t,[e/3|0])}const A=Math.cos(d*Math.PI/180),b=.83/m,M=.74/m;for(let e=0;e<l;e++){const t=e/3|0,v=o[t*3],s=o[t*3+1],g=o[t*3+2];let E=v,S=s,_=g;if(r[t]){E=S=_=0;for(const R of w.get(x(e))){const K=o[R*3],H=o[R*3+1],W=o[R*3+2];K*v+H*s+W*g>=A&&(E+=K*c[R],S+=H*c[R],_+=W*c[R])}}const y=Math.hypot(E,S,_)||1;a[e*3]=E/y,a[e*3+1]=S/y,a[e*3+2]=_/y;const F=u.getX(e),D=u.getY(e),k=u.getZ(e),ne=Math.abs(v),ae=Math.abs(s);r[t]?ne>=ae?(n[e*2]=k*M+.5,n[e*2+1]=D*M+.5):(n[e*2]=F*M+.5,n[e*2+1]=k*M+.5):(n[e*2]=F*b+.5,n[e*2+1]=D*b+.5)}return f.setAttribute("normal",new Q(a,3)),f.setAttribute("uv",new Q(n,2)),f}const J=89,de=1;function ee(f,m){const d=f.__sceneSize;return d?m.set(d[0],d[1]):f.getDrawingBufferSize(m)}const N={G:1.2*.9*(1+.9*.91),ES:1.2*.9*.1*.9*.279,T:1/1.3,MIN:.25},xe=`
  varying vec2 vUv; varying vec3 vNrm, vVP;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vec4 p = projectionMatrix * mv; p.xyz /= p.w; p.w = 1.;
    gl_Position = p;
    vUv = uv; vNrm = normalMatrix * normal; vVP = -mv.xyz;
  }`,he=`
  precision highp float;
  uniform sampler2D uTrns, uNoise; uniform samplerCube uEnv; uniform vec2 uTrnsRes;
  uniform float uRough, uNoiseScale, uOn, uLinOut, uBoost, uRoomLift, uGlint, uGrainPx, uMarkA, uEnvK, uSrgb, uExpo;
  uniform sampler2D uAvg;
  varying vec2 vUv; varying vec3 vNrm, vVP;
  float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float ggx(float dNH, float r){
    float a2 = r * r; a2 = a2 * a2;
    float d2 = dNH * dNH; if (d2 <= 0.) return 0.;
    float k = d2 * (a2 - 1.) + 1.;
    return a2 / (3.14159265359 * k * k);
  }
  vec3 eotf(vec3 y){ y = max(y, 0.); return mix(y / 12.92, pow((y + .055) / 1.055, vec3(2.4)), step(.04045, y)); }
  vec3 neutralInv(vec3 y){
    y = clamp(y, 0., .995); float np = max(y.r, max(y.g, y.b)); vec3 c = y;
    if (np >= .76) {float pk = .0576 / (1. - np) + .52, g = 1. - 1. / (.15 * (pk - np) + 1.); c = (y - np * g) / max(1. - g, 1e-4) * pk / np;}
    float m = min(c.r, min(c.g, c.b));
    return c + (m < .04 ? .4 * sqrt(max(m, 0.)) - m : .04);
  }
  void main(){
    vec3 c = vec3(0.);
    vec2 tuv = gl_FragCoord.xy / uTrnsRes;
    vec2 gv = (floor(gl_FragCoord.xy / uGrainPx) + .5) * uGrainPx / uTrnsRes;
    vec4 nz = texture2D(uNoise, vUv * uNoiseScale);
    vec4 nz2 = texture2D(uNoise, vUv + (nz.xy - .5) * 2.);
    float rough = smoothstep(.3, .8, nz2.y) * uRough;
    vec3 n = normalize(vNrm);
    vec3 V = normalize(vVP);
    float vn = dot(V, n);
    if (vn < 0.) { vec3 nb = n - vn * V; float nl = length(nb); n = nl > 1e-5 ? nb / nl : V; }
    vec2 rn = n.xy * (1. - n.z * .7);
    vec3 rc = vec3(0.);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      float slide = .005 + rnd(gv + fi * .2) * .007;
      vec2 jd = vec2(rnd(gv + fi * .1) - .5, rnd(gv + fi * .2) - .5) * rough * .3;
      rc += vec3(texture2D(uTrns, jd + tuv - rn * (.1 + slide)).x,
                 texture2D(uTrns, jd + tuv - rn * (.1 + slide * 2.)).y,
                 texture2D(uTrns, jd + tuv - rn * (.1 + slide * 4.)).z) * .9;
    }
    c += rc / 8.;
    vec3 H = normalize(V + normalize(vec3(-1., .8, -1.)));
    c += min(ggx(dot(n, H), .003 + rough * .4), 6e4) * uGlint;
    float F = .1 + .9 * pow(max(1. - dot(V, n), 0.), 5.);
    c += mix(c, textureCube(uEnv, reflect(V, n)).rgb * uEnvK, F * .9) * (1. - F);
    c *= 1.2;
    vec2 tc = tuv - rn * .1;
    vec3 av = texture2D(uAvg, tc).rgb * 2. + texture2D(uAvg, tc + vec2(.03, 0.)).rgb + texture2D(uAvg, tc - vec2(.03, 0.)).rgb + texture2D(uAvg, tc + vec2(0., .03)).rgb + texture2D(uAvg, tc - vec2(0., .03)).rgb;
    float ex = clamp(${N.T.toFixed(4)} / (${N.G.toFixed(4)} * max(av.r, max(av.g, av.b)) / 6. + ${N.ES.toFixed(4)}), ${N.MIN.toFixed(4)}, 1.);
    c *= mix(1., ex, uExpo);
    c *= uBoost * uRoomLift;
    vec3 o = mix(c, mix(pow(min(c, vec3(32.)), vec3(2.2)), eotf(min(c, vec3(32.))), uSrgb), uLinOut);
    if (uMarkA > .5 && uLinOut > .5) o = neutralInv(o);
    gl_FragColor = vec4(o * uOn, uMarkA);
  }`,ye=`uniform sampler2D tIn; uniform float uEye, uSrgb, uFin; varying vec2 vUv;
  vec3 oetf(vec3 x){ x = max(x, 0.); return mix(x * 12.92, 1.055 * pow(x, vec3(1. / 2.4)) - .055, step(.0031308, x)); }
  vec3 neutralTone(vec3 c){
    float x = min(c.r, min(c.g, c.b)); c -= x < .08 ? x - 6.25 * x * x : .04;
    float pk = max(c.r, max(c.g, c.b)); if (pk < .76) return c;
    float np = 1. - .0576 / (pk - .52); c *= np / pk;
    return mix(c, vec3(np), 1. - 1. / (.15 * (pk - np) + 1.));
  }
  void main(){
    vec3 l = max(texture2D(tIn, vUv).rgb, 0.);
    float k = mix(1., smoothstep(1.2, 0., length(vUv - .5)) * 1.3, uFin);
    vec3 t = neutralTone(l * pow(k, 2.2)); vec3 e = mix(pow(t, vec3(1. / 2.2)), oetf(t), uSrgb) / max(k, .05);
    gl_FragColor = vec4(min(mix(pow(l, vec3(1. / 2.2)), e, uEye), 1.), 1.);
  }`,$="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",we=`uniform sampler2D tIn; varying vec2 vUv;
  void main(){
    vec3 s = vec3(0.); float n = 0.;
    for (int y = 0; y < 8; y++) for (int x = 0; x < 8; x++) {
      vec3 c = texture2D(tIn, vUv + (vec2(float(x), float(y)) - 3.5) / 128.).rgb;
      float w = 1. - smoothstep(.6, .8, min(c.r, min(c.g, c.b)));
      s += c * w; n += w;
    }
    gl_FragColor = vec4(s / max(n, .001), 1.);
  }`,be=[192,193,195,198,200,199,108,22,193,188,188,193,197,161,62,104,202,194,191,196,203,169,169,181,209,201,198,203,214,207,201,197,211,205,203,204,210,204,199,190,212,208,205,205,206,203,195,191,212,209,207,206,205,203,196,189,211,210,209,207,205,203,199,189,10,10,10,11,10,9,73,205,7,6,6,6,7,27,211,220,5,5,6,5,5,104,219,200,10,19,20,23,26,40,136,108,21,37,32,31,16,6,10,12,6,8,11,11,7,9,21,11,3,4,4,6,6,5,12,10,4,5,24,56,86,108,91,54,11,13,14,14,14,19,20,20,11,12,13,14,15,20,20,24,12,12,14,15,17,20,25,60,12,13,15,15,22,22,25,128,12,14,15,16,19,22,31,185,10,13,14,17,19,22,82,195,13,13,14,18,22,26,148,196,25,13,14,18,22,45,193,196,151,177,189,197,209,210,212,212,157,180,193,199,206,208,211,211,153,177,191,196,202,205,209,209,144,170,186,193,199,202,205,207,137,163,181,191,195,200,202,205,129,156,175,190,193,196,200,201,106,143,163,179,187,189,194,197,65,126,147,163,171,173,176,179,164,31,18,24,25,125,193,193,199,91,19,20,51,163,185,195,148,76,36,133,125,105,204,209,70,24,41,157,153,132,219,216,21,19,44,174,134,137,214,214,19,14,45,178,159,189,212,214,11,33,111,175,189,205,213,213,77,151,176,191,201,210,212,212,18,17,19,18,27,31,19,11,119,88,65,52,180,229,78,13,145,127,123,134,243,247,113,11,154,138,136,140,123,117,70,10,162,147,142,143,53,38,30,9,169,156,146,139,46,9,7,9,172,159,137,132,91,47,11,4,160,161,156,152,141,121,79,12];let B=null;function Me(f=128){if(B)return B;const m=[];for(let d=0;d<6;d++){const u=document.createElement("canvas");u.width=u.height=8;const l=u.getContext("2d"),a=l.createImageData(8,8);for(let o=0;o<64;o++){const c=be[d*64+o];a.data[o*4]=c,a.data[o*4+1]=c,a.data[o*4+2]=Math.min(255,c+1),a.data[o*4+3]=255}l.putImageData(a,0,0);const n=document.createElement("canvas");n.width=n.height=f;const r=n.getContext("2d");r.imageSmoothingEnabled=!0,r.imageSmoothingQuality="high",r.drawImage(u,0,0,f,f),m.push(n)}return B=new me(m),B.colorSpace=fe,B.generateMipmaps=!0,B.minFilter=Y,B.needsUpdate=!0,B}const Fe={rough:.1,noiseScale:9},Ee=.5;function te(){return window.__glSrgb===0?0:1}function Te(){const f=window.__glFine;return 1-(typeof f=="number"?Math.max(0,Math.min(1,f)):Ee)}function De({rough:f=.1,noiseScale:m=9,glint:d=1,boost:u=1,qa:l=""}={}){const a=new L(512,512,{type:I,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),n=new L(512,512,{type:q,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),r={uTrns:{value:n.texture},uNoise:{value:null},uEnv:{value:null},uTrnsRes:{value:new C(1,1)},uRough:{value:f},uNoiseScale:{value:m},uOn:{value:1},uLinOut:{value:1},uBoost:{value:u},uRoomLift:{value:1},uGlint:{value:d},uTime:{value:0},uGrainPx:{value:1},uMarkA:{value:0},uEnvK:{value:1},uSrgb:{value:1},uAvg:{value:null},uExpo:{value:1}},o=new U({uniforms:r,vertexShader:xe,fragmentShader:he,toneMapped:!1}),c=new U({uniforms:{tIn:{value:a.texture},uEye:{value:1},uSrgb:{value:1},uFin:{value:1}},vertexShader:$,fragmentShader:ye,depthTest:!1,depthWrite:!1}),p=new V(new G(2,2),c);p.frustumCulled=!1;const i=new O;i.add(p);const h=new se,x=new L(16,16,{type:q,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),w=new U({uniforms:{tIn:{value:n.texture}},vertexShader:$,fragmentShader:we,depthTest:!1,depthWrite:!1}),A=new V(p.geometry,w);A.frustumCulled=!1;const b=new O;b.add(A),r.uAvg.value=x.texture;const M=new Uint8Array(1024),e=new C;function t(s){c.uniforms.uEye.value=window.__glEye===0?0:1,c.uniforms.uSrgb.value=r.uSrgb.value=te(),c.uniforms.uFin.value=r.uMarkA.value>.5?0:1,ee(s,e),r.uTrnsRes.value.copy(e),r.uNoise.value=ie(r.uTime.value),r.uEnv.value||(r.uEnv.value=Me());{const g=window.__glBoost;r.uBoost.value=typeof g=="number"?g:u}{const g=window.__glEnvK;r.uEnvK.value=typeof g=="number"?g:1}{const g=window.__glRough0;r.uRough.value=g===!0?0:f}r.uExpo.value=window.__glExpo===0?0:1}function v(s,g,E,S){t(s);const _=s.getRenderTarget(),y=S.map(D=>D.visible),F=s.getClearAlpha();try{S.forEach(D=>{D.visible=!1}),s.setRenderTarget(a),s.setClearAlpha(1),s.clear(),s.render(g,E),s.setRenderTarget(n),s.render(i,h),s.setRenderTarget(x),s.render(b,h),window.__glExpoQA&&(s.readRenderTargetPixels(x,0,0,16,16,M),(window.__glAvg??={})[l]=Array.from({length:256},(D,k)=>Math.max(M[k*4],M[k*4+1],M[k*4+2])/255))}finally{s.setRenderTarget(_),s.setClearAlpha(F),S.forEach((D,k)=>{D.visible=y[k]}),o.visible=!window.__glHide}}return{material:o,uniforms:r,capture:v,inputs:t,target:n,dispose(){n.dispose(),a.dispose(),x.dispose(),o.dispose(),c.dispose(),w.dispose(),p.geometry.dispose()}}}function ke(f=pe.open){const m=new P,d=new P,u=new P,l=new ve,a=new C;let n={...f},r=0,o=0,c=0,p=!1,i=!1,h=0,x=0;const w=new C,A=t=>{const v=t.clientX/innerWidth*2-1,s=-(t.clientY/innerHeight*2-1);(!i||!p&&t.pointerType!=="mouse")&&(h=v,x=s),o=v,c=s,p=!0,i=!0},b=()=>{p=!1};addEventListener("pointermove",A,{passive:!0}),addEventListener("pointerdown",b,{passive:!0}),addEventListener("pointerup",b,{passive:!0}),addEventListener("pointercancel",b,{passive:!0});const M=Z;function e(t,v={}){t=Math.min(t,.05);{const g=window.__markPose;if(Array.isArray(g)&&g.length===2)return m.setFromEuler(l.set(g[1]*Math.PI/180,g[0]*Math.PI/180,0)),m}if(v.room&&(n=v.room),r=v.blendW??r,v.still)a.set(0,0),m.identity(),h=o,x=c;else{const g=Math.min(1,t*10),E=(o-h)*g,S=(c-x)*g;h+=E,x+=S;const _=Math.max(0,1-Math.hypot(o,c)*1.5)*n.hover;if(!v.still){const F=n.gain??M;a.x-=S*F*_*(1-.7*r),a.y+=E*F*_}a.multiplyScalar(Math.max(0,1-t*(n.friction??1)));const y=a.y*t-(n.auto*t+Math.max(-30,Math.min(30,v.scrollV??0))*n.scroll)*(v.still?0:1);u.setFromEuler(l.set(a.x*t,y,0)),m.premultiply(u),m.slerp(d,Math.min(1,t*n.ret*(1-.8*r))),m.normalize()}const s=1-Math.exp(-t*3);return w.x+=((v.desk?(v.pointerX??0)*n.lean:0)-w.x)*s,w.y+=((v.desk?(v.pointerY??0)*n.lean:0)-w.y)*s,m}return{update:e,quaternion:m,spin:a,lean:w,kick(t,v){a.x+=t,a.y+=v},reset(){m.identity(),a.set(0,0)},dispose(){removeEventListener("pointermove",A),removeEventListener("pointerdown",b),removeEventListener("pointerup",b),removeEventListener("pointercancel",b)}}}const X="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function Be({engineVig:f=.55}={}){let m=1;const d=()=>new L(4,4,{type:I,depthBuffer:!1,generateMipmaps:!1,minFilter:T,magFilter:T}),u=new L(4,4,{type:I,depthBuffer:!0,generateMipmaps:!1,minFilter:T,magFilter:T}),l=[d(),d(),d()],a=[d(),d(),d()],n=new le(-1,1,1,-1,0,1),r=new V(new G(2,2));r.frustumCulled=!1;const o=new O;o.add(r);const c=new U({uniforms:{tIn:{value:null},uDir:{value:new C},uBright:{value:0}},vertexShader:X,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tIn; uniform vec2 uDir; uniform float uBright; varying vec2 vUv;
      vec3 bp(vec2 u){ vec4 s = texture2D(tIn, u); vec3 c = s.rgb;
        if (uBright > .5) { c = pow(max(c, 0.), vec3(1. / 2.2)); vec3 g = c * smoothstep(1.2, 0., length(u - .5)); g = min(g * max(g - .9, 0.), 1.); c = mix(c * max(c - .9, 0.), g, clamp(1. - s.a, 0., 1.)); }
        return c; }
      void main(){ vec3 c = bp(vUv) * .213 + (bp(vUv + uDir * 2.) + bp(vUv - uDir * 2.)) * .205 + (bp(vUv + uDir * 4.) + bp(vUv - uDir * 4.)) * .189;
        gl_FragColor = vec4(c, 1.); }`}),p=new U({uniforms:{tMain:{value:u.texture},t1:{value:l[0].texture},t2:{value:l[1].texture},t3:{value:l[2].texture},uAsp:{value:1},uEV:{value:f},uOn:{value:1},uBloomK:{value:1},uSrgb:{value:1}},vertexShader:X,depthTest:!1,depthWrite:!1,toneMapped:!1,fragmentShader:`uniform sampler2D tMain, t1, t2, t3; uniform float uAsp, uEV, uOn, uBloomK, uSrgb; varying vec2 vUv;
      vec3 oetf(vec3 x){ x = max(x, 0.); return mix(x * 12.92, 1.055 * pow(x, vec3(1. / 2.4)) - .055, step(.0031308, x)); }
      vec3 eotf(vec3 y){ y = max(y, 0.); return mix(y / 12.92, pow((y + .055) / 1.055, vec3(2.4)), step(.04045, y)); }
      void main(){
        vec4 cm = texture2D(tMain, vUv); vec3 c = cm.rgb; float gl = clamp(1. - cm.a, 0., 1.);
        float gs = gl * uSrgb;
        vec3 d = mix(pow(max(c, 0.), vec3(1. / 2.2)), oetf(c), gs);
        float vig = smoothstep(1.2, 0., length(vUv - .5));
        d = (d * vig + (texture2D(t1, vUv).rgb * .075 + texture2D(t2, vUv).rgb * .15 + texture2D(t3, vUv).rgb * .225) * uBloomK) * 1.3;
        vec3 o = mix(pow(d, vec3(2.2)), eotf(d), gs);
        float ev = mix(1., smoothstep(1.25, .35, length((vUv - .5) * vec2(uAsp, 1.))), uEV);
        gl_FragColor = vec4(mix(c, o / max(ev, .2), uOn), 1. + gl * uOn);
      }`}),i=new V(new G(2,2),p);i.frustumCulled=!1,i.renderOrder=1e6,i.visible=!1;let h=[];const x=new C,w=(e,t,v,s,g,E)=>{c.uniforms.tIn.value=t,c.uniforms.uDir.value.set(s,g),c.uniforms.uBright.value=E,r.material=c,e.setRenderTarget(v),e.render(o,n)};function A(e,t,v){ee(e,x);const s=Math.max(4,x.x),g=Math.max(4,x.y);(u.width!==s||u.height!==g||l[0].width!==Math.max(2,Math.round(s/4/m)))&&(u.setSize(s,g),[4,8,16].forEach((y,F)=>{l[F].setSize(Math.max(2,Math.round(s/y/m)),Math.max(2,Math.round(g/y/m))),a[F].setSize(l[F].width,l[F].height)})),p.uniforms.uAsp.value=s/g,p.uniforms.uBloomK.value=window.__fxBloom0?0:1,p.uniforms.uSrgb.value=te();const E=e.getRenderTarget(),S=e.getClearAlpha();i.visible=!1,e.setRenderTarget(u),e.setClearAlpha(1),e.clear(),e.render(t,v);let _=u.texture;for(let y=0;y<3;y++)w(e,_,a[y],1/a[y].width,0,y===0?1:0),w(e,a[y].texture,l[y],0,1/l[y].height,0),_=l[y].texture;e.setRenderTarget(E),e.setClearAlpha(S)}function b(e){h=e.children.filter(t=>t!==i).map(t=>[t,t.visible]);for(const[t]of h)t.visible=!1;i.visible=!0}function M(){for(const[e,t]of h)e.visible=t;h=[],i.visible=!1}return{quad:i,render:A,only:b,show:M,uniforms:p.uniforms,setPx(e){m=Math.max(1,e)},dispose(){u.dispose(),l.forEach(e=>e.dispose()),a.forEach(e=>e.dispose()),c.dispose(),p.dispose(),r.geometry.dispose(),i.geometry.dispose()}}}function Re(f,{font:m='700 300px "Space Grotesk Variable", sans-serif',rtl:d=!1,level:u=1.5,spacing:l="0px"}={}){const a=document.createElement("canvas"),n=a.getContext("2d");n.font=m,n.direction=d?"rtl":"ltr",n.letterSpacing=l,n.textAlign="left",n.textBaseline="alphabetic";const r=n.measureText(f),o=8,c=Math.ceil(r.actualBoundingBoxLeft),p=Math.ceil(r.actualBoundingBoxRight),i=Math.ceil(r.actualBoundingBoxAscent),h=Math.ceil(r.actualBoundingBoxDescent);a.width=c+p+o*2,a.height=i+h+o*2,n.font=m,n.direction=d?"rtl":"ltr",n.letterSpacing=l,n.textAlign="left",n.textBaseline="alphabetic",n.fillStyle="#fff",n.fillText(f,o+c,o+i);const x=new ce(a);x.anisotropy=8,x.generateMipmaps=!0,x.minFilter=Y;const w=a.width/a.height,A=(c+p)/a.width,b={uTex:{value:x},uLevel:{value:u},uOn:{value:1}},M=new U({uniforms:b,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uTex; uniform float uLevel, uOn; varying vec2 vUv; void main(){ float a = texture2D(uTex, vUv).a * uOn; if (a < .004) discard; gl_FragColor = vec4(vec3(pow(uLevel, 2.2)), a); }"}),e=new V(new G(1,1/w),M);return{mesh:e,uniforms:b,fit:v=>{e.scale.setScalar(v/A)},aspect:w,glyphShare:A,dispose(){x.dispose(),M.dispose(),e.geometry.dispose()}}}export{pe as M,Fe as O,_e as a,De as b,Be as c,Re as d,ge as e,Te as g,ke as m};
