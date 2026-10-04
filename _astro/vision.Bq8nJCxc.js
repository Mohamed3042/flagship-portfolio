import{S as D,P as K,G as X,a0 as Y,a1 as R,h as Z,u as g,s as H,M as J,V as n,r as d,v as W,n as Q,k as U}from"./WorldChrome.astro_astro_type_script_index_0_lang.D8XAui1Y.js";import{p as $,a as ee,g as te}from"./_lineart.CdacinO0.js";import"./preload-helper.DArFJGja.js";const h=new g(1.075,.05),m=new g(1.935,-1),w=m.clone().sub(h).normalize(),v=new g(-w.y,w.x).multiplyScalar(-1),oe=.418,I=.29,se=e=>{const y=new D,x=new K(30,e.viewport.aspect,.05,200),b=$({base:"#d3d8dd",mark:"#f7f9fa",cell:104});y.add(b);const o=new X;y.add(o);const S=ee(.55),l=te(S,S.map(()=>0).slice(0,S.length/6),{color:"#ffffff",opacity:.95});l.material.uniforms.uP.value=1,o.add(l);const V=l.clone();V.position.set(.006,-.006,0),o.add(V);const a=new Y;a.setAttribute("position",new R(new Float32Array(12),3)),a.setAttribute("uv",new R(new Float32Array([0,0,0,1,1,1,1,0]),2)),a.setIndex([0,1,2,0,2,3]);const k=new Z({side:H,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uPhase:{value:0},uSize:{value:new g(1,1)},uOpacity:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime, uPhase, uOpacity; uniform vec2 uSize; varying vec2 vUv;
      float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
      // three palettes the panel turns through: (deep, mid, light)
      vec3 pal(int k, float x){
        vec3 a, b, c;
        if (k == 0) { a = vec3(.36, .55, .25); b = vec3(.45, .62, .35); c = vec3(.42, .36, .86); }       // green into violet
        else if (k == 1) { a = vec3(.25, .45, 1.); b = vec3(.45, .9, 1.); c = vec3(.6, 1., 1.); }       // cyan and blue
        else { a = vec3(.45, .3, .95); b = vec3(.93, .62, 1.); c = vec3(1., .97, 1.); }                   // pink, violet, white
        return x < .5 ? mix(a, b, x * 2.) : mix(b, c, x * 2. - 1.);
      }
      vec3 tone(float x){ float ph = uPhase * 2.; int k = int(floor(ph)); float f = smoothstep(.75, 1., fract(ph));
        return k >= 2 ? pal(2, x) : mix(pal(k, x), pal(k + 1, x), f); }
      void main(){
        vec2 q = vUv * uSize;                                   // panel units, so the blobs keep their size as it widens
        float f1 = fbm(q * .55 + vec2(uTime * .05, -uTime * .035));
        float f2 = fbm(q * .9 - vec2(uTime * .03, uTime * .06) + 9.);
        float along = vUv.y;
        float x = clamp(f1 * 1.15 + (along - .5) * .35 * (1. - uPhase), 0., 1.);
        // the airbrush grain: every pixel picks one of two neighbouring tones at random, weighted by the field
        float h = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.));
        float lo = floor(x * 4.) / 4., hi = lo + .25, w = (x - lo) * 4.;
        vec3 col = tone(h < w ? hi : lo);
        col = mix(col, tone(f2), step(hash(floor(gl_FragCoord.xy * .5) + 3.7 + floor(uTime * 14.)), .18));   // a second, sparser spray
        // a white hairline round the edge, like the outline it grew from
        vec2 e = min(vUv, 1. - vUv) * uSize;
        float edge = 1. - smoothstep(0., .012, min(e.x, e.y));
        gl_FragColor = vec4(mix(col, vec3(1.), edge * .9), uOpacity);
      }`}),z=new J(a,k);z.frustumCulled=!1,o.add(z);const A=a.attributes.position,c=(t,u)=>A.setXYZ(t,u.x,u.y,I),C=h.clone().add(m).multiplyScalar(.5),p=new n,F=new n,G=new n;let r=!1,T=0,M=0;const _={scene:y,camera:x,light:!0,resize:E,update({p:t,t:u,dt:L}){const q=U.out(d(.1,.2,t)),O=U.inOut(d(.24,.86,t)),i=U.inOut(d(.2,.9,t)),s=oe*(.12+.88*q)*(1+O*O*9),P=O*5,B=h.clone().addScaledVector(w,-P*.55),N=m.clone().addScaledVector(w,P*.45);c(0,B),c(1,N),c(2,N.clone().addScaledVector(v,s)),c(3,B.clone().addScaledVector(v,s)),A.needsUpdate=!0;const f=k.uniforms;f.uTime.value=u,f.uPhase.value=d(.3,.92,t),f.uOpacity.value=q,f.uSize.value.set(s,h.distanceTo(m)+P),T=W(T,e.pointer.inside?e.pointer.x:0,2.5,L),M=W(M,e.pointer.inside?e.pointer.y:0,2.5,L),o.rotation.set(-.08*i+M*.05,-.18*i+T*.08,0);const j=new n(C.x+v.x*s*.5,C.y+v.y*s*.5,I).applyMatrix4(o.matrixWorld);p.lerpVectors(o.position,j,i*.8),F.set(p.x*.4,p.y*.4,0),G.copy(F).add(new n(.5*i,.25*i,Q.lerp(r?19:11.5,r?4.2:3.4,i))),x.position.copy(G),x.lookAt(p),b.material.uniforms.uShift.value.set(t*120,t*40),_.light=!0},dispose(){l.geometry.dispose(),a.dispose(),k.dispose()}};function E(){r=e.viewport.portrait;const t=b.material.uniforms;t.uRes.value.set(e.viewport.width*e.viewport.dpr,e.viewport.height*e.viewport.dpr),t.uCell.value=104*e.viewport.dpr,o.position.set(r?0:-.6*(e.lang==="ar"?-1:1),r?1.2:-.1,0),o.updateMatrixWorld()}return E(),_};export{se as default};
