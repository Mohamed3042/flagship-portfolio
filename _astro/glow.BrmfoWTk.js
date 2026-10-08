import{a0 as x,a1 as M,aM as F,C as d,i as g,aT as m,M as y,a as A,a5 as h,an as S}from"./EditionWorld.astro_astro_type_script_index_0_lang.Bwhdv6R4.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function C(t,e){const l=Array.isArray(t)?t:[t],i=e.px??96,n=e.lead??1.28,o=e.pad??i*.3,a=document.createElement("canvas"),r=a.getContext("2d"),s=`${e.weight??600} ${i}px ${e.font}`;r.font=s;const v=Math.max(...l.map(c=>r.measureText(c).width));a.width=Math.min(e.maxW??4096,Math.ceil(v+o*2)),a.height=Math.ceil(i*n*l.length+o*2),r.font=s,r.fillStyle=e.color??"#fff",r.textBaseline="alphabetic",r.direction=e.rtl?"rtl":"ltr";const f=e.align??(e.rtl?"right":"left");r.textAlign=f;const p=f==="left"?o:f==="right"?a.width-o:a.width/2;l.forEach((c,w)=>r.fillText(c,p,o+i*n*w+i*.86));const u=new x(a);return u.colorSpace=M,u.anisotropy=8,u.minFilter=F,u.generateMipmaps=!0,{tex:u,aspect:a.width/a.height,w:a.width,h:a.height,dispose(){u.dispose()}}}function N(t,e){const l=[];let i="";for(const n of t.split(" "))(i+" "+n).trim().length>e&&i?(l.push(i),i=n):i=(i+" "+n).trim();return i&&l.push(i),l}function T(t={}){const e={uColor:{value:new d(t.color??"#ffffff")},uFill:{value:t.fill??.06},uRim:{value:t.rim??1.2},uPow:{value:t.pow??2.4},uFog:{value:t.fog??0},uAlpha:{value:t.alpha??1},uGrad:{value:t.grad??0},uSweep:{value:t.sweep??0},uSweepAt:{value:0}};return{mat:new g({uniforms:e,transparent:!0,depthWrite:t.depthWrite??!1,depthTest:t.depthTest??!0,side:t.side??S,blending:t.normal?m:h,vertexShader:`
      varying vec3 vN, vV, vL; varying float vFog;
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.), mv = viewMatrix * w;
        vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); vL = position;
        gl_Position = projectionMatrix * mv; vFog = length(mv.xyz);
      }`,fragmentShader:`
      uniform vec3 uColor; uniform float uFill, uRim, uPow, uFog, uAlpha, uGrad, uSweep, uSweepAt;
      varying vec3 vN, vV, vL; varying float vFog;
      void main(){
        vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
        float f = pow(1. - clamp(abs(dot(n, normalize(vV))), 0., 1.), uPow);
        float g = 1. + uGrad * (clamp(vL.y * .5 + .5, 0., 1.) - .3);
        float sw = uSweep > 0. ? uSweep * exp(-pow((vL.y - uSweepAt) * 3., 2.)) : 0.;
        vec3 c = uColor * (uFill * g + f * uRim + sw) * exp(-uFog * vFog) * uAlpha;
        #ifdef NORMAL
          gl_FragColor = vec4(c, clamp(uFill + f, 0., 1.) * uAlpha);
        #else
          gl_FragColor = vec4(c, 1.);
        #endif
      }`,defines:t.normal?{NORMAL:1}:{}}),U:e}}function R(t,e,l,i=0,n=0,o=0){const a=t/2,r=e/2,s=l/2,v=[[-a,-r,-s],[a,-r,-s],[a,r,-s],[-a,r,-s],[-a,-r,s],[a,-r,s],[a,r,s],[-a,r,s]];return[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([p,u])=>[v[p][0]+i,v[p][1]+n,v[p][2]+o,v[u][0]+i,v[u][1]+n,v[u][2]+o])}function z(t,e){const l=C(t,{font:e.font,px:e.px??128,weight:e.weight,rtl:e.rtl,align:e.align??"center",lead:e.lead}),i={uColor:{value:new d(e.color??"#ffffff")},uAlpha:{value:1},uMap:{value:l.tex},uFog:{value:e.fog??0}},n=new g({uniforms:i,transparent:!0,depthWrite:!1,depthTest:e.depthTest??!0,blending:e.normal?m:h,defines:e.normal?{NORMAL:1}:{},vertexShader:"varying vec2 vUv; varying float vD; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`
      uniform sampler2D uMap; uniform vec3 uColor; uniform float uAlpha, uFog; varying vec2 vUv; varying float vD;
      void main(){
        float a = texture2D(uMap, vUv).a * uAlpha * exp(-uFog * vD);
        if (a < .003) discard;
        #ifdef NORMAL
          gl_FragColor = vec4(uColor, a);
        #else
          gl_FragColor = vec4(uColor * a, 1.);
        #endif
      }`}),o=new y(new A(1,1),n);return{mesh:o,tex:l,aspect:l.aspect,U:i,set(a){o.scale.set(a*l.aspect,a,1)},dispose(){l.dispose(),n.dispose(),o.geometry.dispose()}}}export{R as b,T as f,z as l,C as t,N as w};
