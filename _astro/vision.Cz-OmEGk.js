import{b as F,r as c,e as y}from"./WorldChrome.astro_astro_type_script_index_0_lang.Ijo534nM.js";import{p as S,a as V,g as M,c as W}from"./_lineart.BwW1cwQw.js";import{S as z,s as _,G as I,h as q,b as A,B as D,l as G,n as N,x as O}from"./three.module.BBopIvPF.js";import"./preload-helper.DArFJGja.js";const P=`
  vec3 film(float t){ return .5 + .5 * cos(6.28318 * (vec3(0., .33, .67) + t)); }
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y); }
  float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.02 + 7.3; a *= .5; } return v; }
  float liquid(vec2 p, float t){
    vec2 q = vec2(fbm(p + t * .05), fbm(p + 5.2 - t * .04));
    vec2 r = vec2(fbm(p + 3. * q + vec2(1.7, 9.2) + t * .07), fbm(p + 3. * q + vec2(8.3, 2.8) - t * .06));
    return fbm(p + 3.5 * r);
  }`,E=a=>{const r=new z,v=new _(30,a.viewport.aspect,.1,200),u=S({base:"#e9ecee"});r.add(u);const i=new I;r.add(i);const m=V(.55),d=M(m,m.map(()=>0).slice(0,m.length/6),{color:"#2a3034",opacity:.55});d.material.uniforms.uP.value=1,i.add(d);const f=M(W(2.6,-.2,140),Array(140).fill(0),{color:"#59636a",opacity:.35});f.material.uniforms.uP.value=1,i.add(f);const p=new q({uniforms:{uTime:{value:0},uFade:{value:1}},transparent:!0,vertexShader:`
      varying vec3 vN; varying vec3 vView; varying vec2 vUv;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.); vView = -mv.xyz; vN = normalMatrix * normal; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
      uniform float uTime, uFade; varying vec3 vN; varying vec3 vView; varying vec2 vUv;
      ${P}
      void main(){
        float f = 1. - abs(dot(normalize(vN), normalize(vView)));
        float bands = fbm(vec2(vUv.y * 6., uTime * .15)) * 1.6;
        vec3 col = film(f * 1.3 + bands + vUv.y * .8 + uTime * .05);
        col = mix(col, vec3(1.), pow(f, 6.) * .6);
        float grain = h21(gl_FragCoord.xy + fract(uTime) * 61.);
        col *= .85 + .3 * grain;
        gl_FragColor = vec4(col * 1.15, uFade);
      }`}),t=new A(new D(.2,5.4,.2),p);i.add(t);const n=new A(new G(2,2),new q({depthTest:!1,depthWrite:!1,transparent:!0,uniforms:{uTime:{value:0},uWidth:{value:0},uAngle:{value:0},uCenter:{value:new N(.5,.5)},uDark:{value:0},uAspect:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
      uniform float uTime, uWidth, uAngle, uDark, uAspect; uniform vec2 uCenter; varying vec2 vUv;
      ${P}
      void main(){
        vec2 p = (vUv - uCenter) * vec2(uAspect, 1.);
        vec2 nrm = vec2(cos(uAngle), sin(uAngle));
        float d = abs(dot(p, nrm));
        float band = 1. - smoothstep(uWidth - .015, uWidth, d);
        if (band <= 0.) discard;
        vec2 q = vUv * vec2(uAspect, 1.) * 2.2;
        float v = liquid(q, uTime);
        float vx = liquid(q + vec2(.004, 0.), uTime), vy = liquid(q + vec2(0., .004), uTime);
        vec3 n = normalize(vec3((v - vx) * 90., (v - vy) * 90., 1.));
        float spec = pow(max(dot(n, normalize(vec3(.4, .6, .9))), 0.), 24.);
        vec3 hue = film(v * 2.2 + uTime * .03 + n.x * .25);
        vec3 col = mix(vec3(.8, .82, .86), hue, .5) * (.62 + .55 * v);   // pearl, not acid
        col = mix(col, vec3(1.), spec * .8);
        // grain/dither speckle, the noisy foil look
        float g = h21(floor(gl_FragCoord.xy / 1.5) + floor(uTime * 24.));
        col = mix(col, col * step(.42, g) + .04, .38);
        col.r = mix(col.r, film(liquid(q + .012, uTime) * 2.6).r, .35);
        col *= 1. - uDark;
        gl_FragColor = vec4(col, band);
      }`}));n.frustumCulled=!1,n.renderOrder=10,r.add(n);const x={scene:r,camera:v,light:!0,resize:b,update({p:e,t:h,dt:C}){const U=y.inOut(c(0,.55,e)),w=y.in(c(.5,.86,e)),k=y.inOut(c(.86,1,e));g=F(g,a.pointer.inside?a.pointer.x:0,2.5,C),i.rotation.y=-.2+g*.15+e*.25;const s=-Math.PI*.15+U*Math.PI*1.35;t.rotation.set(Math.sin(h*.5)*.25,0,s),t.position.set(Math.cos(s+Math.PI/2)*.4,Math.sin(s+Math.PI/2)*.4,.6),t.scale.set(1+w*40,1+w*3,1),p.uniforms.uTime.value=h,p.uniforms.uFade.value=1-c(.62,.8,e);const o=n.material.uniforms,T=new O().copy(t.position).applyMatrix4(i.matrixWorld).project(v);o.uCenter.value.set(T.x*.5+.5,T.y*.5+.5),o.uAngle.value=s,o.uWidth.value=w*1.9,o.uTime.value=h,o.uDark.value=k*.94,o.uAspect.value=a.viewport.aspect,u.material.uniforms.uShift.value.set(e*120,e*40),v.position.set(0,0,(l?15.5:11.5)-e*1.2),v.lookAt(0,0,0),x.light=e<.64},dispose(){d.geometry.dispose(),f.geometry.dispose()}};let l=!1,g=0;function b(){l=a.viewport.portrait;const e=u.material.uniforms;e.uRes.value.set(a.viewport.width*a.viewport.dpr,a.viewport.height*a.viewport.dpr),e.uCell.value=104*a.viewport.dpr,i.position.set(l?0:-.6*(a.lang==="ar"?-1:1),l?1.2:-.1,0)}return b(),x};export{E as default};
