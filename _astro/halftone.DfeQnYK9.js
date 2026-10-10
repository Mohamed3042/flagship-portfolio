import{S as A,af as D,M as I,a as L,i as T,s as j,C as H,L as K,ac as O,h as W,o as C,r as b,p as q,ag as E}from"./EditionWorld.astro_astro_type_script_index_0_lang.DKyZ0HWE.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const J=["cake-studio","mk-voice","montage-pro","talent-atlas","mk-tones"],X=async t=>{const y=new A,R=new D(-1,1,1,-1,-10,10),o=J.map(a=>t.films.find(i=>i.id===a)).filter(Boolean);for(;o.length<5&&t.films[o.length];)o.push(t.films[o.length]);const z=await Promise.all(o.map(a=>t.textures.image(a.card).catch(()=>null))),M=new I(new L(1,1),new T({uniforms:{uRes:{value:new j(1,1)},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uTime; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(41.7, 289.3))) * 43758.5); }
      void main(){
        vec2 px = vUv * uRes;
        float fib = h(floor(px / 2.)) * .05 + h(floor(px * vec2(.05, 1.2))) * .02;
        vec3 col = vec3(.937, .906, .84) * (1. - fib) * (1. - .08 * length(vUv - .5));
        gl_FragColor = vec4(col, 1.);
      }`}));M.position.z=-5,y.add(M);const w=new I(new L(1,1),new T({transparent:!0,uniforms:{uMap:{value:z[0]},uSize:{value:new j(800,450)},uCell:{value:18},uScatter:{value:1},uReveal:{value:0},uInk:{value:new H("#1d3bb8")},uTime:{value:0},uSeed:{value:0},uVid:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform vec2 uSize; uniform float uCell, uScatter, uReveal, uTime, uSeed, uVid; uniform vec3 uInk;
      varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453); }
      // an image arrives decoded (sRGB storage); a video does not, for a custom shader: decode it here
      vec3 lin(vec3 c){ return mix(c / 12.92, pow((c + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
      vec3 tap(vec2 uv){ vec3 c = texture2D(uMap, uv).rgb; return uVid > .5 ? lin(c) : c; }
      void main(){
        vec2 g = vUv * uSize / uCell;
        vec2 id = floor(g), f = fract(g) - .5;
        float n = h(id);
        // cells drift away (scatter) and vanish in a noisy order
        vec2 drift = (vec2(h(id + 3.1), h(id + 7.7)) - .5) * uScatter * 6.;
        vec2 cellUv = (id + .5 + drift) * uCell / uSize;
        vec3 c = tap(clamp(cellUv, 0., 1.));
        float L = dot(c, vec3(.299, .587, .114));
        float r = pow(L, .55) * .72;                    // light prints as ink: airy, Pear-like on dark UI
        float aa = 1.5 / uCell;
        float dot_ = smoothstep(r + aa, r - aa, length(f)) * step(uScatter * 1.05, n + .02 * (1. - uScatter));
        vec3 ink = mix(uInk, c, .3);
        vec3 full = tap(vUv);
        float a = mix(dot_, 1., uReveal);
        vec3 col = mix(ink, full, uReveal);
        if (a < .01) discard;
        gl_FragColor = vec4(col, a);
      }`}));y.add(w);const x=new K(new O,new W({color:"#1d2a5c",transparent:!0,opacity:.55}));y.add(x);const s=w.material.uniforms;let r=1,c=1,d=800,f=450,U=0,h=0;function V(){r=t.viewport.width,c=t.viewport.height,Object.assign(R,{left:-r/2,right:r/2,top:c/2,bottom:-c/2}),R.updateProjectionMatrix(),M.scale.set(r,c,1),M.material.uniforms.uRes.value.set(r,c);const a=t.viewport.portrait;d=a?r*.9:Math.min(r*.52,c*.62*16/9),f=d*9/16,U=a?0:(r*.5-d/2-Math.max(48,r*.06))*(t.lang==="ar"?-1:1),h=a?-c*.12:-c*.02,w.scale.set(d,f,1),w.position.set(U,h,0),s.uSize.value.set(d,f);const i=14,n=U-d/2-i,l=U+d/2+i,u=h-f/2-i,e=h+f/2+i,v=10,S=[n,u,0,l,u,0,l,u,0,l,e,0,l,e,0,n,e,0,n,e,0,n,u,0];for(const[p,g]of[[n,u],[l,u],[l,e],[n,e]])S.push(p-v,g,0,p+v,g,0,p,g-v,0,p,g+v,0);S.push(n-r,h+f/2+i,0,n,h+f/2+i,0),x.geometry.dispose(),x.geometry=new O().setAttribute("position",new E(S,3))}V();const F=a=>o[a]?.loop?t.textures.video(o[a].loop):null;let _=-1,P=null;const k=()=>{P?.pause(),P=null};return{scene:y,camera:R,light:!0,resize:V,update({p:a,t:i,active:n}){const l=o.length,u=Math.min(l-1e-4,a*l),e=Math.floor(u),v=u-e;e!==_&&(_=e,k(),s.uSeed.value=e*13.1,t.emit("halftone",{film:o[e],index:e,count:l}),o[e+1]?.loop&&t.textures.prime(o[e+1].loop));const S=C.out(b(0,.2,v)),p=C.inOut(b(.2,.32,v)),g=C.in(b(.86,1,v)),G=e===0?Math.max(0,1-a*l*4):0;s.uScatter.value=Math.max(1-S,g)*(1-G),s.uReveal.value=p*(1-C.inOut(b(.8,.9,v)));const m=n&&s.uReveal.value>.02?F(e):null;m?(m.video.paused&&m.video.play().catch(()=>{}),P=m.video):k();const B=!!m&&m.video.readyState>=2&&!m.video.paused;s.uMap.value=B?m.texture:z[e]??z[0],s.uVid.value=B?1:0,s.uCell.value=q.lerp(22,7,S)+g*16,s.uTime.value=i,w.position.y=h+Math.sin(i*.4)*2,w.scale.set(d*(1+p*.015),f*(1+p*.015),1)},focus(a){a||k()},dispose(){k(),x.geometry.dispose()}}};export{X as default};
