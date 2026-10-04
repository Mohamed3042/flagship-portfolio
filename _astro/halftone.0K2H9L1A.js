import{e as U,r as b}from"./WorldChrome.astro_astro_type_script_index_0_lang.6u7Q3Ek2.js";import{S as B,r as L,b as P,l as _,h as I,n as T,i as O,u as D,f as j,w as F,z as V,Z as A}from"./three.module.BBopIvPF.js";import"./preload-helper.DArFJGja.js";const G=["cake-studio","mk-voice","montage-pro","talent-atlas","mk-tones"],Z=async n=>{const S=new B,k=new L(-1,1,1,-1,-10,10),c=G.map(r=>n.films.find(t=>t.id===r)).filter(Boolean);for(;c.length<5&&n.films[c.length];)c.push(n.films[c.length]);const C=await Promise.all(c.map(r=>n.textures.image(r.card).catch(()=>null))),M=new P(new _(1,1),new I({uniforms:{uRes:{value:new T(1,1)},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform float uTime; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(41.7, 289.3))) * 43758.5); }
      void main(){
        vec2 px = vUv * uRes;
        float fib = h(floor(px / 2.)) * .05 + h(floor(px * vec2(.05, 1.2))) * .02;
        vec3 col = vec3(.937, .906, .84) * (1. - fib) * (1. - .08 * length(vUv - .5));
        gl_FragColor = vec4(col, 1.);
      }`}));M.position.z=-5,S.add(M);const g=new P(new _(1,1),new I({transparent:!0,uniforms:{uMap:{value:C[0]},uSize:{value:new T(800,450)},uCell:{value:18},uScatter:{value:1},uReveal:{value:0},uInk:{value:new O("#1d3bb8")},uTime:{value:0},uSeed:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform sampler2D uMap; uniform vec2 uSize; uniform float uCell, uScatter, uReveal, uTime, uSeed; uniform vec3 uInk;
      varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453); }
      void main(){
        vec2 g = vUv * uSize / uCell;
        vec2 id = floor(g), f = fract(g) - .5;
        float n = h(id);
        // cells drift away (scatter) and vanish in a noisy order
        vec2 drift = (vec2(h(id + 3.1), h(id + 7.7)) - .5) * uScatter * 6.;
        vec2 cellUv = (id + .5 + drift) * uCell / uSize;
        vec3 c = texture2D(uMap, clamp(cellUv, 0., 1.)).rgb;
        float L = dot(c, vec3(.299, .587, .114));
        float r = pow(L, .55) * .72;                    // light prints as ink: airy, Pear-like on dark UI
        float aa = 1.5 / uCell;
        float dot_ = smoothstep(r + aa, r - aa, length(f)) * step(uScatter * 1.05, n + .02 * (1. - uScatter));
        vec3 ink = mix(uInk, c, .3);
        vec3 full = texture2D(uMap, vUv).rgb;
        float a = mix(dot_, 1., uReveal);
        vec3 col = mix(ink, full, uReveal);
        if (a < .01) discard;
        gl_FragColor = vec4(col, a);
      }`}));S.add(g);const y=new D(new j,new F({color:"#1d2a5c",transparent:!0,opacity:.55}));S.add(y);const m=g.material.uniforms;let o=1,s=1,u=800,v=450,x=0,f=0;function R(){o=n.viewport.width,s=n.viewport.height,Object.assign(k,{left:-o/2,right:o/2,top:s/2,bottom:-s/2}),k.updateProjectionMatrix(),M.scale.set(o,s,1),M.material.uniforms.uRes.value.set(o,s);const r=n.viewport.portrait;u=r?o*.9:Math.min(o*.52,s*.62*16/9),v=u*9/16,x=r?0:(o*.5-u/2-Math.max(48,o*.06))*(n.lang==="ar"?-1:1),f=r?-s*.12:-s*.02,g.scale.set(u,v,1),g.position.set(x,f,0),m.uSize.value.set(u,v);const t=14,a=x-u/2-t,l=x+u/2+t,e=f-v/2-t,i=f+v/2+t,d=10,p=[a,e,0,l,e,0,l,e,0,l,i,0,l,i,0,a,i,0,a,i,0,a,e,0];for(const[h,w]of[[a,e],[l,e],[l,i],[a,i]])p.push(h-d,w,0,h+d,w,0,h,w-d,0,h,w+d,0);p.push(a-o,f+v/2+t,0,a,f+v/2+t,0),y.geometry.dispose(),y.geometry=new j().setAttribute("position",new A(p,3))}R();let z=-1;return{scene:S,camera:k,light:!0,resize:R,update({p:r,t}){const a=c.length,l=Math.min(a-1e-4,r*a),e=Math.floor(l),i=l-e;e!==z&&(z=e,m.uMap.value=C[e]??C[0],m.uSeed.value=e*13.1,n.emit("halftone",{film:c[e],index:e,count:a}));const d=U.out(b(0,.28,i)),p=U.inOut(b(.3,.5,i)),h=U.in(b(.74,1,i)),w=e===0?Math.max(0,1-r*a*4):0;m.uScatter.value=Math.max(1-d,h)*(1-w),m.uReveal.value=p*(1-U.inOut(b(.62,.8,i))),m.uCell.value=V.lerp(22,7,d)+h*16,m.uTime.value=t,g.position.y=f+Math.sin(t*.4)*2,g.scale.set(u*(1+p*.015),v*(1+p*.015),1)},dispose(){y.geometry.dispose()}}};export{Z as default};
