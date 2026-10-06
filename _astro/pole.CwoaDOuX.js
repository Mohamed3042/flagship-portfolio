import{S as j,P as D,C as r,i as z,M as I,a as O,a7 as E,_ as Q,aB as U,V as d,k as X,Q as Z,o as b,r as L,Z as B,aL as Y,p as _}from"./EditionWorld.astro_astro_type_script_index_0_lang.KM0kS1M1.js";import{N as S,q as H,s as J,p as K,l as ee,a as V}from"./common.CXW1EZ-n.js";import{s as te}from"./snow.CdWm_aUa.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const p=_.degToRad,ne=o=>{const c=o.quality,u=c===0?12:c===1?18:24,v=new j,f=new D(44,o.viewport.aspect,.1,4e3),m={uTime:{value:0},uGreen:{value:new r("#38ff9c").multiplyScalar(1.4)},uMag:{value:new r("#d24cff").multiplyScalar(1.1)},uRed:{value:new r("#ff3d6e")},uNight:{value:new r("#03070f")},uGlowLine:{value:new r("#0d2a2a")},uLevel:{value:1}},T=`
    uniform float uTime, uLevel; uniform vec3 uGreen, uMag, uRed, uNight, uGlowLine;
    float curtainZ(float x, float k){
      return k * 1.3 + sin(x * .45 + uTime * .05 + k) * 1.4 + sin(x * 1.3 - uTime * .07 + k * 2.) * .5 + (vnoise(vec2(x * .7, k * 9. + uTime * .03)) - .5) * 1.2;
    }
    vec3 aurora(vec3 d){
      if (d.y < .004) return vec3(0.);
      vec3 col = vec3(0.);
      float jit = h21(gl_FragCoord.xy) / ${u}.;
      for (int i = 0; i < ${u}; i++){
        float fi = (float(i) + jit) / ${u}.;
        float h = 1. + fi * fi * 2.6;                       // denser near the lower edge, where the light is
        vec2 p = d.xz * (h / d.y);
        if (length(p) > 22.) break;                         // (past the curtains nothing more to gather)
        for (int c = 0; c < 2; c++){
          float k = float(c);
          vec2 r = c == 0 ? p : vec2(p.x * .8 + p.y * .6, p.y * .8 - p.x * .6) * 1.2 + vec2(3., 1.5);
          float x = r.x, dz = -r.y - (5.4 + k * 3.4) - curtainZ(x, k);
          // the sheet's thickness, widened by how far the ray runs between two layers there (so the layers never
          // show as bands), its light kept the same
          float w = .1 + fi * .4, run = 2.6 * 2. * fi / ${u}. / max(d.y, .02) * .55;
          float we = sqrt(w * w + run * run);
          float sheet = exp(-dz * dz / (we * we)) * w / we;
          if (sheet < .002) continue;                       // (the rays' noise only where the curtain is)
          // rays: bright threads along the curtain, the same at every height, drifting slowly; waves of light run along
          float rays = .25 + .75 * pow(vnoise(vec2(x * 7.5 + k * 13., uTime * .12)), 2.) + .4 * pow(vnoise(vec2(x * 23. + k, uTime * .3)), 4.);
          float wave = .55 + .45 * sin(x * .8 - uTime * .9 + k * 2.);
          float prof = smoothstep(.0, .05, fi) * exp(-fi * 2.4) + .12 * smoothstep(.3, .9, fi) * exp(-(fi - .7) * (fi - .7) * 8.);
          vec3 tint = mix(uGreen, uMag, smoothstep(.22, .75, fi));
          tint = mix(tint, uRed, smoothstep(.75, 1., fi) * .5);
          col += tint * sheet * rays * wave * prof * (c == 0 ? 1. : .7);
        }
      }
      return col * 3.2 / ${u}. * uLevel;
    }
    vec3 nightSky(vec3 d){
      float y = max(d.y, 0.);
      vec3 c = uNight * (1.2 - y * .6);
      c += uGlowLine * exp(-y * 18.) * .6;                 // airglow low over the horizon
      return c + aurora(d);
    }
  `,A=new z({uniforms:m,depthWrite:!1,vertexShader:H(1),fragmentShader:`${S}
${T}
varying vec4 vDir; void main(){ vec3 d = normalize(vDir.xyz / vDir.w); gl_FragColor = vec4(nightSky(d), 1.); }`});v.add(J(A,-10));const g=new I(new O(5e3,5e3).rotateX(-Math.PI/2),new z({uniforms:{...m,uAur:{value:new r("#1d4a4c")}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${S}
      ${T}
      uniform vec3 uAur;
      varying vec3 vW;
      float leadX(float z){ return -9. - z * .36 + (fbm3(vec2(z * .012, 1.3)) - .5) * 50.; }
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 p = vW.xz;
        float dist = length(vW - cameraPosition);
        // the lead: a ragged band of open water
        float lx = leadX(p.y), wdt = 7. + 9. * vnoise(vec2(p.y * .01, 4.));
        float edge = abs(p.x - lx) - wdt * .5 + (vnoise(p * .25) - .5) * 4. + (vnoise(p * 1.3) - .5) * .8;
        float water = smoothstep(.15, -.15, edge);
        // snow: ripples, lit by the aurora from above and a little by the airglow
        vec2 sq = p * vec2(.28, .7);
        float r0 = fbm3(sq), e = .04;
        vec3 n = normalize(vec3(-(fbm3(sq + vec2(e, 0.)) - r0) / e * .1, 1., -(fbm3(sq + vec2(0., e)) - r0) / e * .25));
        float pulse = .85 + .15 * sin(uTime * .9);
        vec3 snow = vec3(.78, .88, 1.) * (uAur * (.2 + .6 * n.y) * pulse + vec3(.012, .02, .04)) * (.9 + .1 * vnoise(p * 9.));
        float gl = step(.993, h21(floor(p * 18.))) * smoothstep(40., 4., dist);   // a crystal catching the light
        snow += uAur * gl * 1.4;
        snow += vec3(.5, .95, .8) * smoothstep(.6, .0, edge) * smoothstep(-.1, .1, edge) * .06;   // the lead's broken rim
        // the water: black, mirroring the sky in its slow swell
        vec2 wq = p * .15 + uTime * .02;
        vec3 wn = normalize(vec3((vnoise(wq) - .5) * .06, 1., (vnoise(wq + 7.) - .5) * .06));
        vec3 col = snow;
        if (water > .002) {   // (the sky is marched again only where the water mirrors it)
          vec3 R = reflect(V, wn);
          float fres = .03 + .97 * pow(1. - max(dot(-V, wn), 0.), 5.);
          col = mix(snow, vec3(.001, .002, .004) + nightSky(R) * fres * 1.15, water);
        }
        // far off the ice fades into the night, the aurora's glow low on the horizon
        col = mix(col, uNight * 1.2 + uGlowLine * .6 + uAur * .06, smoothstep(150., 1800., dist));
        gl_FragColor = vec4(col, 1.);
      }`}));v.add(g);const e=B(90),q=c===0?150:320,i=new E(new Q(1,1,1),new z({uniforms:{...m,uAur:{value:new r("#1d4a4c")}},vertexShader:`
      varying vec3 vN, vW, vL;
      void main(){
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
        vW = w.xyz; vL = position; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${S}
      uniform vec3 uAur, uNight; uniform float uTime;
      varying vec3 vN, vW, vL;
      void main(){
        vec3 n = normalize(vN), V = normalize(vW - cameraPosition);
        float up = n.y;
        float snowy = smoothstep(.55, .85, up);
        float pulse = .85 + .15 * sin(uTime * .9);
        // the broken faces: blue-green ice with light caught inside it; the tops: snow
        float f = pow(1. - abs(dot(-V, n)), 2.);
        vec3 iceC = mix(vec3(.01, .035, .06), vec3(.05, .2, .24), .3 + .45 * vnoise(vL.xy * 3. + vL.z * 2.)) * (.5 + .5 * max(up + .4, 0.)) + uAur * f * .3;
        vec3 snowC = vec3(.78, .88, 1.) * (uAur * (.25 + .6 * up) * pulse + vec3(.012, .02, .04));
        vec3 col = mix(iceC * pulse, snowC, snowy);
        float far = length(vW - cameraPosition);
        col = mix(col, uNight * 1.2, smoothstep(200., 900., far));
        gl_FragColor = vec4(col, 1.);
      }`}),q),C=new U,N=new Z,P=new X,y=new d,W=new d;for(let t=0;t<q;t++){const s=(e()-.5)*260,n=s,l=-58+Math.sin(n*.018)*14+Math.sin(n*.05)*4+(e()-.5)*5,h=.7+e()*e()*3.4;y.set(h*(1+e()*1.5),h*(.4+e()*.8),h*(.4+e())),P.set((e()-.5)*1.2,e()*Math.PI,(e()-.5)*1.4),N.setFromEuler(P),W.set(s,y.y*.25+(e()-.3)*.6+Math.max(0,1.6-Math.abs(l+58-Math.sin(n*.018)*14)*.3),l),C.compose(W,N,y),i.setMatrixAt(t,C)}i.instanceMatrix.needsUpdate=!0,i.frustumCulled=!1,v.add(i);const w=te(c,c?3:2);v.add(w.mesh);const a=w.uniforms;a.uAmt.value=0,a.uSpeed.value=.7,a.uLen.value=1.2,a.uFlake.value.set("#9fe8d0").multiplyScalar(.5),a.uFog.value=.12,a.uFogCol.value.set("#0e2a2a"),a.uLow.value=1,a.uNear.value=.3;let x=!1;function $(){x=o.viewport.portrait,f.aspect=o.viewport.aspect,f.fov=x?66:44,f.updateProjectionMatrix()}$();const F=new d,G=new d;let M=1e9;return{scene:v,camera:f,resize:$,focus(t){t&&(M=1e9)},update({p:t,t:s,dt:n}){const l=p(Y(-28,34,b.inOut(L(0,1,t))))+(V?0:Math.sin(s*.05)*p(1.2)),h=p(x?14:9)+b.inOut(L(.3,.9,t))*p(4);F.set(0,1.8,0),G.set(Math.sin(l)*10,1.8+Math.tan(h)*10,-Math.cos(l)*10);const R=K(o,s,n);ee(f,F,G,R.x*.5,R.y*.5),m.uTime.value=V?40:s,m.uLevel.value=.55+.45*b.out(L(0,.25,t)),w.step(s,n,o.viewport.aspect);const k=Math.round(_.radToDeg(l)*10)/10;k!==M&&(M=k,o.emit("ice-heading",k))},dispose(){A.dispose(),g.geometry.dispose(),g.material.dispose(),i.geometry.dispose(),i.material.dispose(),i.dispose(),w.dispose()}}};export{ne as default};
