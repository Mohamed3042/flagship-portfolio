import{L as D}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{P as y,b as k,T as b}from"./path.D0kPvRpM.js";import{af as I,c as Q,ag as F,ai as z,V as N,d as V,aj as U,a7 as L,a9 as H,M as j}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const B=`
  attribute vec4 aPuff; attribute vec2 aAmt;
  varying vec2 vQ; varying vec3 vC, vR, vU, vF; varying float vRad, vAmt, vSeed;
  void main(){
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vec3 c = aPuff.xyz; float r = aPuff.w;
    vec3 toCam = normalize(cameraPosition - c);
    vec3 w = c + (right * position.x + up * position.y) * r * 1.15;
    vQ = position.xy * 1.15; vC = c; vR = right; vU = up; vF = toCam; vRad = r; vAmt = aAmt.x; vSeed = aAmt.y;
    gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  }`,G=`
  precision highp sampler3D;
  uniform sampler3D uNoise; uniform vec3 uSun, uSunCol, uLit, uShade, uDeep, uSky, uHaze; uniform float uScale, uTime, uAmt, uFogD;
  varying vec2 vQ; varying vec3 vC, vR, vU, vF; varying float vRad, vAmt, vSeed;
  void main(){
    float r2 = dot(vQ, vQ);
    if (r2 > 1.) discard;
    vec3 nv = vec3(vQ, sqrt(1. - r2));
    vec3 n = normalize(vR * nv.x + vU * nv.y + vF * nv.z);
    vec3 P = vC + n * vRad;
    vec4 t = texture(uNoise, P * uScale + vec3(vSeed, uTime * .004, vSeed * .7));
    vec4 t2 = texture(uNoise, P * uScale * 2.7 + vec3(.3, vSeed, uTime * .006));
    float body = t.r * .65 + t.g * .35 - t2.b * .3;
    float edge = 1. - sqrt(r2);

    float a = smoothstep(.34, .5, body + edge * .85 - .28) * vAmt * uAmt;
    if (a < .004) discard;
    vec3 L = normalize(uSun), V = normalize(cameraPosition - P);
    float wrap = clamp(dot(n, L) * .5 + .5, 0., 1.);
    vec3 col = mix(uShade, uLit, .38 + .62 * pow(wrap, 1.2));
    col = mix(uDeep, col, .72 + .28 * smoothstep(.2, .7, body));
    col += uSky * .14 * max(n.y, 0.);
    float fwd = pow(max(dot(-V, L), 0.), 5.);
    col += uSunCol * fwd * (1. - nv.z) * (1.2 - a) * .9;
    col = mix(col, uHaze, 1. - exp(-length(P - cameraPosition) * uFogD));
    gl_FragColor = vec4(col * a, a);
  }`,R=new Q(2,2);function W(i,o,{scale:g=1/22,seed:A=4}={}){const s=o.length,c=D(A),a=new I;a.index=R.index,a.setAttribute("position",R.getAttribute("position"));const n=new Float32Array(s*4),m=new Float32Array(s*2),t=o.map(r=>({...r,s:c()*10})),v=new F(n,4).setUsage(z),u=new F(m,2).setUsage(z);a.setAttribute("aPuff",v),a.setAttribute("aAmt",u),a.instanceCount=s;const l={uNoise:{value:k(i)},uScale:{value:g},uTime:{value:0},uAmt:{value:1},uFogD:{value:1/5e3},uSun:{value:new N(0,.05,-1)},uSunCol:{value:y.sunCol.clone()},uLit:{value:y.cloudLit.clone()},uShade:{value:y.cloudShade.clone()},uDeep:{value:y.cloudDeep.clone()},uSky:{value:y.skyAmb.clone()},uHaze:{value:y.haze.clone()}},f=new V({uniforms:l,vertexShader:B,fragmentShader:G,transparent:!0,depthWrite:!1,blending:H,blendSrc:L,blendDst:U,blendSrcAlpha:L,blendDstAlpha:U}),P=new j(a,f);P.frustumCulled=!1,P.renderOrder=500;const M=t.map(r=>r.amt??1),w=t.map((r,h)=>h),p=new Float32Array(s);return{mesh:P,U:l,puffs:t,setAmt(r,h){M[r]=h},update(r,h,S){l.uTime.value=h,l.uSun.value.copy(S);const C=r.position;for(let e=0;e<s;e++){const d=t[e].at;p[e]=(d[0]-C.x)**2+(d[1]-C.y)**2+(d[2]-C.z)**2}w.sort((e,d)=>p[d]-p[e]);for(let e=0;e<s;e++){const d=w[e],x=t[d],T=Math.sqrt(p[d])/x.r;n[e*4]=x.at[0],n[e*4+1]=x.at[1],n[e*4+2]=x.at[2],n[e*4+3]=x.r,m[e*2]=M[d]*Math.min(1,Math.max(0,(T-.9)/.9)),m[e*2+1]=x.s}v.needsUpdate=!0,u.needsUpdate=!0},dispose(){a.dispose(),f.dispose()}}}function J(i,o,g,A,s=1){const c=D(s),a=[];for(let n=0;n<g;n++){const m=c()*Math.PI*2,t=Math.acos(2*c()-1),v=Math.cbrt(c()),u=Math.sin(t)*Math.cos(m)*v,l=Math.cos(t)*v*.7,f=Math.sin(t)*Math.sin(m)*v;a.push({at:[i[0]+u*o[0],i[1]+l*o[1],i[2]+f*o[2]],r:A*(.6+.7*(1-v))*(.8+c()*.4)})}return a}const K=(i,o)=>O(b.x*o,b.z,b.wall,18,b.top-30,i===0?12:16,i===0?14:18,15,8,b.gap,o);function O(i,o,g,A,s,c,a,n,m=2,t,v=1){const u=D(m),l=[];for(let f=0;f<a;f++){const P=A+(s-A)*(f+u()*.5)/a;for(let M=0;M<c;M++){const w=(M+u()*.7)/c*Math.PI*2,p=g*(1+(u()-.3)*.35),r=P+(u()-.5)*n*.5,h=n*(.75+u()*.55);if(t&&r<t.below){let S=Math.abs(w-t.at)%(Math.PI*2);if(S>Math.PI&&(S=Math.PI*2-S),S<t.half)continue}l.push({at:[i+Math.cos(w)*p*v,r,o+Math.sin(w)*p],r:h})}}return l}export{J as b,W as c,K as t};
