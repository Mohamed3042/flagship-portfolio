import{S as I,Y as O,a1 as V,D as _,h as E,q as D,w as U,M as H,a as W,s as A,A as p,u as Y,a2 as j}from"./WorldChrome.astro_astro_type_script_index_0_lang.p2srI1Ag.js";import"./preload-helper.DArFJGja.js";const i=[{f:[.492,.357],z:8.2},{f:[.56,.47],z:5.5},{f:[.512,.65],z:2.7},{f:[.37,.614],z:1.9},{f:[.417,.486],z:1.15},{f:[.5,.52],z:1.35}],J=`
  uniform sampler2D tA, tB; uniform vec4 uA, uB; uniform float uMix, uBlurA, uBlurB, uTime, uFlare, uPush; uniform vec2 uRes, uSun;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  vec3 look(sampler2D t, vec4 v, vec2 uv, float blur){
    // view centre in picture units (y down) → texture coordinates (y up)
    vec2 p = vec2(v.x + (uv.x - .5) * v.z, 1. - v.y + (uv.y - .5) * v.w);
    vec3 c = texture2D(t, p).rgb;
    if (blur > .0005) {
      for (int i = 1; i < 9; i++) { float a = float(i) * 2.39996, r = blur * sqrt(float(i) / 8.); c += texture2D(t, p + vec2(cos(a), sin(a) * uRes.x / uRes.y) * r).rgb; }
      c /= 9.;
    }
    return c;
  }
  void main(){
    vec2 uv = vUv;
    vec3 a = look(tA, uA, uv, uBlurA);
    // the next picture: a soft-edged inset that grows to fill the frame
    vec2 q = vec2(uB.x + (uv.x - .5) * uB.z, uB.y - (uv.y - .5) * uB.w);
    float inside = smoothstep(0., .09, min(q.x, 1. - q.x)) * smoothstep(0., .09, min(q.y, 1. - q.y));
    vec3 b = look(tB, uB, uv, uBlurB);
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
  }`,Q=async r=>{const M=new I,C=new O(-1,1,1,-1,0,1),G=r.base.replace(/\/$/,""),L=new V,n=i.map(()=>null),s=new _(new Uint8Array([8,12,14,255]),1,1);s.needsUpdate=!0;const m=e=>{e<0||e>=i.length||n[e]||(n[e]=s,L.load(`${G}/motion/world/atelier/kf-${e}.webp`,u=>{u.colorSpace=Y,u.anisotropy=4,u.minFilter=j,n[e]=u}))};m(0),m(1);const a=new E({depthTest:!1,depthWrite:!1,uniforms:{tA:{value:s},tB:{value:s},uA:{value:new U(.5,.5,1,1)},uB:{value:new U(.5,.5,1,1)},uMix:{value:0},uBlurA:{value:0},uBlurB:{value:0},uTime:{value:0},uFlare:{value:0},uPush:{value:0},uRes:{value:new D(16,9)},uSun:{value:new D(.5,.5)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:J}),S=new H(new W(2,2),a);S.frustumCulled=!1,M.add(S);const d=1.5;let w=[1,1];function b(){const e=r.viewport.aspect;w=e>d?[1,d/e]:[e/d,1],a.uniforms.uRes.value.set(r.viewport.width,r.viewport.height)}b();const F=e=>(e=p(e),e*e*(3-2*e)),R=(e,u)=>Math.min(1-u,Math.max(u,e));let c=0,f=0,l=0;return{scene:M,camera:C,resize:b,update({p:e,t:u,dt:y}){const $=p(e/.8)*(i.length-1);l=A(l,$,6,y);const t=Math.min(i.length-1,Math.floor(l)),v=t===i.length-1?p((e-.8)/.2)*.4:l-t;for(let z=t-1;z<=t+2;z++)m(z);const o=i[t],B=i[t+1],q=Math.pow(o.z,v),k=F(v);c=A(c,r.pointer.inside?r.pointer.x:0,2,y),f=A(f,r.pointer.inside?r.pointer.y:0,2,y);const g=w[0]/q,x=w[1]/q,P=R(.5+(o.f[0]-.5)*k+c*.012,g/2),T=R(.5+(o.f[1]-.5)*k-f*.01,x/2);a.uniforms.tA.value=n[t]??s,a.uniforms.uA.value.set(P,T,g,x);const h=B?F((v-.42)/.5):0;B&&(a.uniforms.tB.value=n[t+1]??s,a.uniforms.uB.value.set((P-o.f[0])*o.z+.5,(T-o.f[1])*o.z+.5,g*o.z,x*o.z)),a.uniforms.uMix.value=n[t+1]&&n[t+1]!==s?h:0,a.uniforms.uBlurA.value=.0045*h,a.uniforms.uBlurB.value=.004*(1-h)*(h>0?1:0),a.uniforms.uFlare.value=Math.sin(Math.PI*p((v-.45)/.5))*(B?1:0)+(t===i.length-1?v*1.2:0),a.uniforms.uSun.value.set(.5+c*.04,.42-f*.03),a.uniforms.uPush.value=l*.5+u*.02,a.uniforms.uTime.value=u},dispose(){n.forEach(e=>e!==s&&e?.dispose()),s.dispose()}}};export{Q as default};
