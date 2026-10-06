import{S as E,P as O,C as a,V as z,i as A,a0 as Z,aD as G,F as H,M as I,a as U,o as S,r as b,p as _,aC as j}from"./EditionWorld.astro_astro_type_script_index_0_lang.DjiVaGuA.js";import{N as R,q as N,s as $,f as Q,p as X,l as J,a as K,S as q}from"./common.Den9xvki.js";import{s as Y}from"./snow.2CpLRtdg.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const x=_.degToRad,se=async l=>{const c=l.lang==="ar",g=c?-1:1,v=l.quality,d=new E,n=new O(40,l.viewport.aspect,.05,400),s={uSunDir:{value:new z},uSunCol:{value:new a("#ffc59a").multiplyScalar(2.2)},uTime:{value:0},uZen:{value:new a("#14295a")},uBelt:{value:new a("#e6adb2")},uShadowSky:{value:new a("#3b4f80")},uCloudLit:{value:new a("#ffd2be")},uCloudShade:{value:new a("#5d6f9c")},uRise:{value:0}};let y=-14;const C=t=>s.uSunDir.value.set(Math.sin(x(y)*g)*Math.cos(t),Math.sin(t),Math.cos(x(y)*g)*Math.cos(t)).normalize();C(x(1));const k=new A({uniforms:s,depthWrite:!1,vertexShader:N(1),fragmentShader:`
      ${R}
      uniform vec3 uSunDir, uSunCol, uZen, uBelt, uShadowSky, uCloudLit, uCloudShade; uniform float uTime, uRise;
      varying vec4 vDir;
      const float H = 2.55, R = 6371.;                       // the cloud tops 2.55 km under you, on a curved Earth
      // the summit's shadow, in the view's own angles: a pyramid standing on the antisolar point
      float shadowAt(vec3 d){
        vec3 a = -uSunDir;                                          // the antisolar point (a little under the horizon)
        float az = atan(d.x, -d.z) - atan(a.x, -a.z), el = asin(clamp(d.y, -1., 1.)), ael = asin(a.y) + .028;
        float w = (ael + .006 - el) * .92;                          // its half width grows downward from its point
        float e = abs(az) - w;
        float soft = .0025 + max(w, 0.) * .05;
        return smoothstep(soft, -soft, e) * step(el, ael + .006);
      }
      vec3 skyAt(vec3 d){
        float el = d.y;
        vec3 c = mix(uBelt * .95, uZen, smoothstep(.05, .3, el));
        c = mix(uShadowSky, c, smoothstep(-.01, .045, el - .005 * sin(atan(d.x, -d.z) * 3.)));   // the Earth's shadow, a deep blue band
        c += uBelt * .25 * exp(-abs(el - .06) * 22.);
        return c * (1. + uRise * .25);
      }
      // far peaks out of the cloud: a few pyramids along the horizon, none in the middle (the shadow) or behind the words
      float peaks(float az){
        float r = -1.;
        r = max(r, .03 * pow(max(1. - abs(az + .62) / .1, 0.), 1.25));
        r = max(r, .019 * pow(max(1. - abs(az + .47) / .07, 0.), 1.15));
        r = max(r, .026 * pow(max(1. - abs(az - .5) / .09, 0.), 1.3));
        r = max(r, .014 * pow(max(1. - abs(az - .68) / .06, 0.), 1.1));
        return r;
      }
      void main(){
        vec3 d = normalize(vDir.xyz / vDir.w);
        // the cloud sea: where the view ray meets a sphere's cap H km under you (the nearer of its two crossings)
        vec3 C = vec3(0., -(R + H), 0.);
        float B = dot(d, C), cc = dot(C, C) - R * R, disc = B * B - cc;
        float t = disc > 0. ? B - sqrt(disc) : -1.;
        vec3 col;
        float sh = shadowAt(d), hor = -.0283;                       // (the cloud horizon, radians under level)
        if (t > 0.) {
          vec3 P = d * t;
          vec2 w = P.xz * .55;
          float lod = clamp(t / 50., 0., 1.);
          // billows: domain-warped fbm, their fine detail fading with distance
          vec2 wq = w + vec2(fbm3(w * .7 + 3.), fbm3(w * .7 + 7.)) * 1.6;
          float h = fbm(wq);
          float hx = fbm(wq + vec2(.08, 0.)), hz = fbm(wq + vec2(0., .08));
          float relief = 9. * (1. - lod * .85);
          vec3 n = normalize(vec3(-(hx - h) * relief, 1., -(hz - h) * relief));
          float lit = clamp(dot(n, normalize(uSunDir + vec3(0., .12, 0.))) * 1.4 + .25, 0., 1.);
          vec3 cl = mix(uCloudShade, uCloudLit, lit) * (.86 + .24 * h);
          cl = mix(cl, uCloudShade * .9, smoothstep(.45, .2, h) * .45 * (1. - lod));   // the hollows between the billows
          // haze toward the horizon, the Belt's colour in it
          float haze = 1. - exp(-t / 85.);
          cl = mix(cl, mix(uBelt * .9, uShadowSky * 1.15, .4), haze * .85);
          // the summit's shadow on the clouds: a cold, deep blue
          cl = mix(cl, cl * vec3(.34, .4, .66) * .78, sh * (1. - haze * .45));
          col = cl;
        } else {
          col = skyAt(d);
          col = mix(col, col * vec3(.66, .7, .88), sh * .5);                  // and it stands up into the haze
        }
        float az = atan(d.x, -d.z), top = hor + peaks(az);
        if (d.y < top && d.y > hor - .0015) {
          float face = vnoise(vec2(az * 260., d.y * 420.)) * .6 + vnoise(vec2(az * 60., d.y * 90.)) * .4;
          float lit = smoothstep(.42, .62, face + (az > 0. ? .08 : -.08));
          vec3 rock = mix(vec3(.2, .17, .26), vec3(1., .78, .72) * 1.15, lit) * mix(.6, 1., smoothstep(hor, top, d.y));
          rock = mix(rock, rock * vec3(.42, .48, .75), sh);
          rock = mix(rock, mix(uBelt * .9, uShadowSky * 1.15, .4), .35);      // far: hazed
          col = mix(col, rock, smoothstep(.0, .0012, top - d.y) * smoothstep(hor - .0015, hor + .001, d.y));
        }
        gl_FragColor = vec4(col, 1.);
      }`});d.add($(k,-10)),await Q();const M=c?["لنصنع","شيئاً معاً."]:["Let’s make","something."],o=document.createElement("canvas"),e=o.getContext("2d");o.width=2048,o.height=1024,e.fillStyle="#000",e.fillRect(0,0,o.width,o.height),e.fillStyle="#fff",e.textAlign="center",e.textBaseline="middle",e.font=c?'600 330px "Cairo Variable", sans-serif':'400 310px "Space Grotesk Variable", sans-serif',e.direction=c?"rtl":"ltr",e.filter="blur(10px)",e.globalAlpha=.7,M.forEach((t,r)=>e.fillText(t,o.width/2,300+r*420)),e.filter="blur(3px)",e.globalAlpha=1,e.globalCompositeOperation="lighter",M.forEach((t,r)=>e.fillText(t,o.width/2,300+r*420)),e.filter="none",e.globalCompositeOperation="source-over";const h=new Z(o);h.minFilter=G,h.anisotropy=8;const f=new A({uniforms:{...s,uText:{value:h},uWrite:{value:0},uDir:{value:g},uPatch:{value:new H}},vertexShader:`
      varying vec3 vW;
      float hs(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(hs(i), hs(i + vec2(1, 0)), f.x), mix(hs(i + vec2(0, 1)), hs(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.);
        // the top: a gentle dome round you, then the edge, where it falls away to the clouds
        float edge = -14.5 + (vn(vec2(w.x * .35, 2.)) - .5) * 3.;
        w.y += -.008 * w.x * w.x - .0045 * w.z * w.z - smoothstep(edge, edge - 5., w.z) * 5. + (vn(w.xz * .4) - .5) * .25;
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${R}
      uniform vec3 uSunDir, uSunCol, uZen, uBelt, uCloudLit; uniform float uTime, uWrite, uDir; uniform sampler2D uText; uniform vec4 uPatch;
      varying vec3 vW;
      float groove(vec2 uv){
        // the words, written as you scroll: in reading order, line by line
        float line = uv.y > .5 ? 0. : 1.;
        float x = uDir > 0. ? uv.x : 1. - uv.x;
        float along = (line + clamp((x - .1) / .8, 0., 1.)) * .5;
        float shown = smoothstep(uWrite + .01, uWrite - .01, along);
        return texture2D(uText, uv).r * shown;
      }
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 p = vW.xz;
        // wind-packed snow: soft ripples, a crust that glitters
        float r0 = fbm3(p * vec2(.9, 2.2)), e = .03;
        vec3 n = normalize(vec3(-(fbm3((p + vec2(e, 0.)) * vec2(.9, 2.2)) - r0) / e * .05, 1., -(fbm3((p + vec2(0., e)) * vec2(.9, 2.2)) - r0) / e * .05));
        n = normalize(n + vec3(vW.x * .016, 0., vW.z * .009));                  // the dome
        // the groove: a finger's width, its walls lit and shaded by the low sun
        vec2 uv = (p - uPatch.xy) / (uPatch.zw - uPatch.xy);
        uv.y = 1. - uv.y;
        if (uv.x > 0. && uv.x < 1. && uv.y > 0. && uv.y < 1.) {
          vec2 px = 1. / vec2(2048., 1024.) * 3.;
          float gx = groove(uv + vec2(px.x, 0.)) - groove(uv - vec2(px.x, 0.)), gy = groove(uv + vec2(0., px.y)) - groove(uv - vec2(0., px.y));
          n = normalize(n + vec3(gx, 0., -gy) * 6.5);
        }
        // the first light: snow facing the sun glows peach, the rest takes the sky's cool lavender
        float lit = clamp((dot(n, uSunDir) + .12) / 1.12, 0., 1.);
        vec3 shade = vec3(.6, .66, .86), glow = vec3(1., .86, .78);
        vec3 col = mix(shade, glow * 1.25, smoothstep(.04, .3, lit)) * (.9 + .1 * n.y);
        float gv = (uv.x > 0. && uv.x < 1. && uv.y > 0. && uv.y < 1.) ? groove(uv) : 0.;
        col *= 1. - gv * .38;                                                             // its floor in shade
        col += glow * smoothstep(.3, .7, lit) * gv * .4;                                 // its far wall catching the sun
        vec2 gc = floor(p * 60.);
        float gl = step(.985, h21(gc)) * pow(max(dot(reflect(V, normalize(vec3(h22(gc) - .5, 1.2).xzy)), uSunDir), 0.), 30.);
        col += uSunCol * gl * .8;
        gl_FragColor = vec4(col, 1.);
      }`}),m=new I(new U(46,32,v?184:92,v?128:64).rotateX(-Math.PI/2),f);m.position.set(0,0,-5),m.frustumCulled=!1,d.add(m);const p=Y(v,v?3:2);d.add(p.mesh);const i=p.uniforms;i.uAmt.value=.05,i.uSpeed.value=.5,i.uLen.value=1,i.uFlake.value.set("#fff1e6"),i.uFog.value=0,i.uGlint.value=1,i.uSunCol.value.set("#ffd2a8");let u=!1;const D=new z,P=new z,F=new a("#dbb6bd"),V=new a("#ffe3c4");function B(){u=l.viewport.portrait,n.aspect=l.viewport.aspect,n.fov=u?72:40,y=u?-3:-14,n.updateProjectionMatrix();const t=f.uniforms.uPatch.value;u?t.set(-1.3,-5.8,1.3,-2.2):t.set(-3.7,-9.4,3.7,-3.4)}return B(),{scene:d,camera:n,light:!0,resize:B,update({p:t,t:r,dt:W}){const w=S.inOut(b(0,1,t));C(x(j(.6,3.2,w))),s.uRise.value=w,s.uTime.value=r,s.uCloudLit.value.set("#ffd2be").lerp(V,w),s.uBelt.value.set("#e6adb2").lerp(F,w);const T=1-S.out(b(0,.16,t));D.set(0,1.62+T*.9,1.2+T*1.6),P.set(0,u?-2.3:-.25,-14);const L=X(l,r,W);J(n,D,P,L.x*.7,L.y*.7),f.uniforms.uWrite.value=K?1:S.inOut(b(q.write[0],q.write[1],t)),p.step(r,W,l.viewport.aspect)},dispose(){k.dispose(),f.dispose(),m.geometry.dispose(),h.dispose(),p.dispose()}}};export{se as default};
