import{e as J,an as K,ar as Q,d as X,S as Y,V,a as j,r as _,M as Z,P as ee,F as L,_ as w,as as E,at as ae,au as te,L as O}from"./WorldChrome.astro_astro_type_script_index_0_lang.BJ9pWh04.js";import"./preload-helper.DArFJGja.js";const l=[{f:[.492,.357],z:8.2},{f:[.56,.47],z:5.5},{f:[.512,.65],z:2.7},{f:[.37,.614],z:1.9},{f:[.417,.486],z:1.15},{f:[.5,.52],z:1.35}],oe=`
  uniform sampler2D tA, tB, dA, dB, gA, gB; uniform vec4 uA, uB; uniform vec3 cA, cB; uniform float hA, hB;
  uniform float uMix, uBlurA, uBlurB, uTime, uFlare, uPush; uniform vec2 uRes, uSun;
  varying vec2 vUv;
  const float IMG = 1.5;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  vec2 tc(vec2 c){ vec2 p = clamp(c / vec2(IMG, 1.) + .5, .001, .999); return vec2(p.x, 1. - p.y); }
  vec2 rayAt(vec2 C, vec3 cam, float w){ return C * (1. - cam.z * w) + cam.xy * w; }
  void march(sampler2D dep, vec2 C, vec3 cam, out vec2 hc, out bool behind){
    const int N = 40; float dw = 1. / float(N);
    hc = C; behind = false;
    float wPrev = 1., dPrev = textureLod(dep, tc(rayAt(C, cam, 1.)), 0.).r - 1.;
    if (dPrev >= 0.) { hc = rayAt(C, cam, 1.); return; }
    for (int i = 1; i <= N; i++) {
      float w = 1. - dw * float(i);
      vec4 s = textureLod(dep, tc(rayAt(C, cam, w)), 0.);
      float d = (behind ? s.g : s.r) - w;
      if (d > 4. * dw && !behind) { behind = true; d = s.g - w; }
      if (d >= 0.) {
        float wh = mix(wPrev, w, dPrev / (dPrev - d + 1e-6));
        for (int j = 0; j < 2; j++) {
          vec4 q = textureLod(dep, tc(rayAt(C, cam, wh)), 0.);
          float dh = (behind ? q.g : q.r) - wh;
          if (dh >= 0.) { w = wh; d = dh; } else { wPrev = wh; dPrev = dh; }
          wh = mix(wPrev, w, dPrev / (dPrev - d + 1e-6));
        }
        hc = rayAt(C, cam, wh); return;
      }
      wPrev = w; dPrev = d;
    }
  }
  vec3 see(sampler2D t, sampler2D dep, sampler2D bg, float has, vec4 v, vec3 cam, vec2 uv, float blur){
    // view centre in picture units (y down) → the picture centred, one unit tall → texture coordinates (y up)
    vec2 C = (vec2(v.x + (uv.x - .5) * v.z, v.y - (uv.y - .5) * v.w) - .5) * vec2(IMG, 1.), hc = C; bool behind = false;
    if (has > .5) march(dep, C, cam, hc, behind);
    vec2 p = tc(hc);
    vec3 c = behind ? textureLod(bg, p, 0.).rgb : textureLod(t, p, 0.).rgb;
    float st = min(length(dFdx(hc)), length(dFdy(hc))) / max(min(length(dFdx(C)), length(dFdy(C))), 1e-7);
    if (has > .5 && !behind) c = mix(textureLod(bg, p, 0.).rgb, c, smoothstep(.25, .6, st));
    if (blur > .0005) {
      for (int i = 1; i < 9; i++) { float a = float(i) * 2.39996, r = blur * sqrt(float(i) / 8.); c += textureLod(t, p + vec2(cos(a), sin(a) * uRes.x / uRes.y) * r, 0.).rgb; }
      c /= 9.;
    }
    return c;
  }
  void main(){
    vec2 uv = vUv;
    vec3 a = see(tA, dA, gA, hA, uA, cA, uv, uBlurA);
    // the next picture: a soft-edged inset that grows to fill the frame
    vec2 q = vec2(uB.x + (uv.x - .5) * uB.z, uB.y - (uv.y - .5) * uB.w);
    float inside = smoothstep(0., .09, min(q.x, 1. - q.x)) * smoothstep(0., .09, min(q.y, 1. - q.y));
    vec3 b = uMix > .001 ? see(tB, dB, gB, hB, uB, cB, uv, uBlurB) : a;
    vec3 col = mix(a, b, clamp(uMix * inside, 0., 1.));
    // bokeh drifting past the lens, pushed outward by the zoom
    float asp = uRes.x / uRes.y;
    for (int i = 0; i < 14; i++) {
      float fi = float(i), ph = fract(hash(vec2(fi, 3.1)) + uPush * (.35 + hash(vec2(fi, 7.)) * .5));
      vec2 dir = normalize(vec2(hash(vec2(fi, 1.)) - .5, hash(vec2(fi, 2.)) - .5) + 1e-3);
      vec2 c = .5 + dir * (.05 + ph * .9) * vec2(1., asp);
      float r = (.012 + ph * .06) * (.6 + hash(vec2(fi, 5.)));
      float d = length((uv - c) * vec2(asp, 1.));
      float disc = smoothstep(r, r * .82, d) * (1. - ph) * ph * 4.;
      col += vec3(1., .82, .52) * disc * .09;
    }
    // the sun flares at every hand-off
    vec2 s = uSun; float ds = length((uv - s) * vec2(asp, 1.));
    col += vec3(1., .78, .45) * (exp(-ds * 6.) * .55 + exp(-ds * 26.) * .8) * uFlare;
    col += vec3(1., .86, .6) * smoothstep(.0, 1., uFlare) * .08 * (1. - abs(uv.y - s.y) * 3.);
    gl_FragColor = vec4(col, 1.);
  }`,ue=async n=>{const k=new J,H=new K(-1,1,1,-1,0,1),g=n.base.replace(/\/$/,""),B=new Q,i=l.map(()=>null),h=[],a=new X(new Uint8Array([8,12,14,255]),1,1);a.needsUpdate=!0;const A=e=>{if(e<0||e>=l.length||i[e])return;i[e]=a,B.load(`${g}/motion/world/atelier/kf-${e}.webp`,o=>{o.colorSpace=E,o.anisotropy=4,o.minFilter=ae,i[e]=o});const r={d:a,g:a,ok:0};h[e]=r,B.load(`${g}/motion/world/atelier/kf-${e}.d.webp`,o=>{o.colorSpace=te,o.generateMipmaps=!1,o.minFilter=O,r.d=o,r.ok++},void 0,()=>{}),B.load(`${g}/motion/world/atelier/kf-${e}.bg.webp`,o=>{o.colorSpace=E,o.generateMipmaps=!1,o.minFilter=O,r.g=o,r.ok++},void 0,()=>{})};A(0),A(1);const t=new Y({depthTest:!1,depthWrite:!1,uniforms:{tA:{value:a},tB:{value:a},dA:{value:a},dB:{value:a},gA:{value:a},gB:{value:a},hA:{value:0},hB:{value:0},cA:{value:new _},cB:{value:new _},uA:{value:new j(.5,.5,1,1)},uB:{value:new j(.5,.5,1,1)},uMix:{value:0},uBlurA:{value:0},uBlurB:{value:0},uTime:{value:0},uFlare:{value:0},uPush:{value:0},uRes:{value:new V(16,9)},uSun:{value:new V(.5,.5)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:oe}),q=new Z(new ee(2,2),t);q.frustumCulled=!1,k.add(q);const m=1.5;let y=[1,1];function R(){const e=n.viewport.aspect;y=e>m?[1,m/e]:[e/m,1],t.uniforms.uRes.value.set(n.viewport.width,n.viewport.height)}R();const G=e=>(e=w(e),e*e*(3-2*e)),T=(e,r)=>Math.min(1-r,Math.max(r,e));let c=0,v=0,d=0;return{scene:k,camera:H,resize:R,update({p:e,t:r,dt:o}){const W=w(e/.8)*(l.length-1);d=L(d,W,6,o);const s=Math.min(l.length-1,Math.floor(d)),f=s===l.length-1?w((e-.8)/.2)*.4:d-s;for(let F=s-1;F<=s+2;F++)A(F);const u=l[s],b=l[s+1],$=Math.pow(u.z,f),x=G(f);c=L(c,n.pointer.inside?n.pointer.x:0,2,o),v=L(v,n.pointer.inside?n.pointer.y:0,2,o);const M=y[0]/$,P=y[1]/$,D=T(.5+(u.f[0]-.5)*x+c*.012,M/2),U=T(.5+(u.f[1]-.5)*x-v*.01,P/2);t.uniforms.tA.value=i[s]??a,t.uniforms.uA.value.set(D,U,M,P);const C=.16*x,I=c*.02+Math.sin(r*.21)*.005,N=-v*.015+Math.sin(r*.17+1)*.004,S=h[s],z=h[s+1];t.uniforms.dA.value=S?.d??a,t.uniforms.gA.value=S?.g??a,t.uniforms.hA.value=S?.ok===2?1:0,t.uniforms.cA.value.set(C*(u.f[0]-.5)*m+I,C*(u.f[1]-.5)+N,C),t.uniforms.dB.value=z?.d??a,t.uniforms.gB.value=z?.g??a,t.uniforms.hB.value=z?.ok===2?1:0,t.uniforms.cB.value.set(I,N,0);const p=b?G((f-.42)/.5):0;b&&(t.uniforms.tB.value=i[s+1]??a,t.uniforms.uB.value.set((D-u.f[0])*u.z+.5,(U-u.f[1])*u.z+.5,M*u.z,P*u.z)),t.uniforms.uMix.value=i[s+1]&&i[s+1]!==a?p:0,t.uniforms.uBlurA.value=.0045*p,t.uniforms.uBlurB.value=.004*(1-p)*(p>0?1:0),t.uniforms.uFlare.value=Math.sin(Math.PI*w((f-.45)/.5))*(b?1:0)+(s===l.length-1?f*1.2:0),t.uniforms.uSun.value.set(.5+c*.04,.42-v*.03),t.uniforms.uPush.value=d*.5+r*.02,t.uniforms.uTime.value=r},dispose(){i.forEach(e=>e!==a&&e?.dispose()),h.forEach(e=>{e.d!==a&&e.d.dispose(),e.g!==a&&e.g.dispose()}),a.dispose()}}};export{ue as default};
