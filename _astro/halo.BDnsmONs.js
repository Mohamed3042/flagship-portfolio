import{S as A,P as F,C as f,V as w,i as W,M as L,a as N,o as z,r as M,p as T,aL as Z}from"./EditionWorld.astro_astro_type_script_index_0_lang.-Qj7fMj9.js";import{N as O,q as $,s as j,p as _,l as E}from"./common.DFcJZHc_.js";import{s as I}from"./snow.BnUO3xqE.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const e=T.degToRad,Q=t=>{const D=t.quality,u=new A,s=new F(52,t.viewport.aspect,.1,6e3),l={uSunDir:{value:new w},uSunCol:{value:new f(30,26,20)},uGlow:{value:new f("#ffe0b6")},uZen:{value:new f("#2f62a6")},uHor:{value:new f("#c9d9e8")},uHalo:{value:1},uTime:{value:0}};let a=e(7);const k=o=>l.uSunDir.value.set(0,Math.sin(o),-Math.cos(o));k(a);const H=`
    uniform vec3 uSunDir, uSunCol, uGlow, uZen, uHor; uniform float uHalo, uTime;
    // the crystals' optics, from the angles: d the view direction
    vec3 halos(vec3 d){
      float th = acos(clamp(dot(d, uSunDir), -1., 1.));             // the angle from the sun
      float el = asin(clamp(d.y, -1., 1.)), sel = asin(uSunDir.y);
      float az = atan(d.x, -d.z);
      vec3 col = vec3(0.);
      // the 22° halo: a sharp red inner edge fading out through white
      float r = degrees(th);
      float ring = smoothstep(21.4, 22., r) * exp(-max(r - 22., 0.) / 1.6);
      vec3 rc = mix(vec3(1., .42, .28), vec3(.95, .97, 1.), smoothstep(22., 23.6, r));
      col += rc * ring * .4;
      // the sun dogs: level with the sun, 22° out (a little more as it climbs), red toward the sun, a tail outward
      float dogAz = radians(22.) / max(cos(sel), .5);
      for (int s = -1; s <= 1; s += 2){
        float da = (az - float(s) * dogAz) * float(s);              // positive: outward
        float de = el - sel;
        float spot = exp(-da * da / .00012 - de * de / .00045);
        float tail = exp(-de * de / .0002) * exp(-max(da, 0.) / .07) * step(-.004, da) * .25;
        vec3 dc = mix(vec3(1., .38, .22), vec3(1., .98, .92), smoothstep(-.006, .008, da));
        col += dc * (spot * 1.6 + tail);
      }
      // the parhelic circle: level through the sun, all the way round, faint
      col += vec3(.9, .94, 1.) * exp(-abs(el - sel) / .0025) * .05 * smoothstep(.2, .45, abs(az));
      // the upper tangent arc: wings sweeping up from the top of the ring
      float top = sel + radians(22.);
      float wing = el - (top + 1.8 * az * az);
      col += mix(vec3(1., .5, .35), vec3(.95, .97, 1.), smoothstep(0., .02, wing)) * exp(-abs(wing) / .008) * exp(-abs(az) / .11) * .26 * step(-.03, wing + .01) * step(abs(az), .32);
      // the pillar: a column of light standing on the sun
      col += uGlow * exp(-abs(az) / .007) * exp(-max(el - sel, 0.) / .1) * step(sel, el) * .35;
      return col * uHalo;
    }
    vec3 sky(vec3 d){
      float y = max(d.y, 0.), mu = dot(d, uSunDir);
      vec3 c = mix(uHor, uZen, pow(y, .45));
      float r = degrees(acos(clamp(mu, -1., 1.)));
      c *= mix(1., .9, smoothstep(22., 18., r) * uHalo);              // inside the ring the sky is darker
      c += uGlow * (pow(max(mu, 0.), 8.) * .4 + pow(max(mu, 0.), 120.) * 1.4) * (.5 + .5 * exp(-y * 6.));
      c += uSunCol * smoothstep(.99984, .99993, mu);
      return c + halos(d);
    }
  `,b=new W({uniforms:l,depthWrite:!1,vertexShader:$(1),fragmentShader:`${O}
${H}
varying vec4 vDir; void main(){ vec3 d = normalize(vDir.xyz / vDir.w); vec3 c = d.y < 0. ? uHor * .95 : sky(d); gl_FragColor = vec4(c, 1.); }`});u.add(j(b,-10));const g=new L(new N(6e3,6e3).rotateX(-Math.PI/2),new W({uniforms:l,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${O}
      ${H}
      varying vec3 vW;
      float sas(vec2 p){ p = mat2(.82, .57, -.57, .82) * p; vec2 q = p * vec2(.11, .34); return fbm3(q + vec2(fbm3(q * .6) * 2., 0.)) + vnoise(p * vec2(.5, 1.4)) * .12; }
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 p = vW.xz;
        float dist = length(vW - cameraPosition);
        float e = .05, h0 = sas(p);
        vec3 n = normalize(vec3(-(sas(p + vec2(e, 0.)) - h0) / e * .3, 1., -(sas(p + vec2(0., e)) - h0) / e * .3));
        float lit = max(dot(n, uSunDir), 0.);
        vec3 skyl = mix(uHor, uZen, .55);
        vec3 col = vec3(.95, .97, 1.) * (skyl * (.36 + .2 * n.y) + uGlow * lit * 3.2);
        // the glitter: crystal facets turned to send the sun to you, thickest toward it
        vec2 gc = floor(p * 14.);
        vec3 fn = normalize(vec3(h22(gc) - .5, 1.3).xzy);
        float g = step(.95, h21(gc + 3.)) * pow(max(dot(reflect(V, fn), uSunDir), 0.), 160.);
        col += uSunCol * .06 * g * smoothstep(80., 3., dist);
        col += uGlow * pow(max(dot(reflect(V, vec3(0., 1., 0.)), uSunDir), 0.), 30.) * .25;   // the snow's sheen toward the sun
        col = mix(col, uHor * .97 + uGlow * pow(max(dot(normalize(vec3(V.x, 0., V.z)), uSunDir), 0.), 6.) * .3, smoothstep(60., 2500., dist));
        gl_FragColor = vec4(col, 1.);
      }`}));u.add(g);const d=I(D,D?4:3);u.add(d.mesh);const n=d.uniforms;n.uAmt.value=.05,n.uSpeed.value=.12,n.uLen.value=.3,n.uFlake.value.setRGB(1.25,1.22,1.15),n.uGlint.value=2.6,n.uSunCol.value.set("#fff2d8"),n.uNear.value=0;let x=!1;function C(){x=t.viewport.portrait,s.aspect=t.viewport.aspect,s.fov=x?92:54,s.updateProjectionMatrix()}C();const v=new w,G=new w,c=new w,y={},p=(o,r,i,S,m)=>{c.set(Math.sin(r)*Math.cos(i),Math.sin(i),-Math.cos(r)*Math.cos(i)).add(s.position),c.project(s),y[o]=[(c.x*.5+.5)*t.viewport.width,(.5-c.y*.5)*t.viewport.height,c.z<1?S:0,m]};let P="";return{scene:u,camera:s,light:!0,resize:C,update({p:o,t:r,dt:i}){a=e(Z(6.2,8.2,z.inOut(M(0,1,o)))),k(a),l.uTime.value=r,l.uHalo.value=z.inOut(M(0,.22,o))*.7+.3;const S=e(x?14:10.5);v.set(0,1.7+o*.4,-o*6),G.set(0,v.y+Math.tan(S)*10,v.z-10);const m=_(t,r,i);E(s,v,G,m.x*.6,m.y*.6),d.step(r,i,t.viewport.aspect);const V=e(22)/Math.cos(a),h=z.inOut(M(.16,.3,o));p("ring",e(-15.5),a+e(15.5),h,-1),p("dog0",-V-e(1.2),a+e(2.2),h,-1),p("dog1",V+e(1.2),a+e(2.2),h,1),p("arc",e(9),a+e(24.2),h,1);const q=JSON.stringify(y);q!==P&&(P=q,t.emit("ice-notes",y))},dispose(){b.dispose(),g.geometry.dispose(),g.material.dispose(),d.dispose()}}};export{Q as default};
