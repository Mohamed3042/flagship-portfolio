import{al as k,a as I,a9 as D,aE as z,V as Q,i as N,aF as U,ao as R,aq as V,M as H,Z as C}from"./EditionWorld.astro_astro_type_script_index_0_lang.C5-V8Ssb.js";import{P as x,b as q,T as P}from"./path.DPAzhjE8.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const B=`
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
  }`,E=`
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
    // a dense core and a crisp, cauliflower outline eroded by the noise: a cumulus, not a ball and not a smudge
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
  }`,L=new I(2,2);function j(s,o,{scale:g=1/22,seed:w=4}={}){const i=o.length,c=C(w),a=new k;a.index=L.index,a.setAttribute("position",L.getAttribute("position"));const n=new Float32Array(i*4),m=new Float32Array(i*2),t=o.map(r=>({...r,s:c()*10})),v=new D(n,4).setUsage(z),u=new D(m,2).setUsage(z);a.setAttribute("aPuff",v),a.setAttribute("aAmt",u),a.instanceCount=i;const l={uNoise:{value:q(s)},uScale:{value:g},uTime:{value:0},uAmt:{value:1},uFogD:{value:1/5e3},uSun:{value:new Q(0,.05,-1)},uSunCol:{value:x.sunCol.clone()},uLit:{value:x.cloudLit.clone()},uShade:{value:x.cloudShade.clone()},uDeep:{value:x.cloudDeep.clone()},uSky:{value:x.skyAmb.clone()},uHaze:{value:x.haze.clone()}},f=new N({uniforms:l,vertexShader:B,fragmentShader:E,transparent:!0,depthWrite:!1,blending:V,blendSrc:R,blendDst:U,blendSrcAlpha:R,blendDstAlpha:U}),b=new H(a,f);b.frustumCulled=!1,b.renderOrder=500;const A=t.map(r=>r.amt??1),M=t.map((r,h)=>h),p=new Float32Array(i);return{mesh:b,U:l,puffs:t,setAmt(r,h){A[r]=h},update(r,h,y){l.uTime.value=h,l.uSun.value.copy(y);const F=r.position;for(let e=0;e<i;e++){const d=t[e].at;p[e]=(d[0]-F.x)**2+(d[1]-F.y)**2+(d[2]-F.z)**2}M.sort((e,d)=>p[d]-p[e]);for(let e=0;e<i;e++){const d=M[e],S=t[d],T=Math.sqrt(p[d])/S.r;n[e*4]=S.at[0],n[e*4+1]=S.at[1],n[e*4+2]=S.at[2],n[e*4+3]=S.r,m[e*2]=A[d]*Math.min(1,Math.max(0,(T-.9)/.9)),m[e*2+1]=S.s}v.needsUpdate=!0,u.needsUpdate=!0},dispose(){a.dispose(),f.dispose()}}}function W(s,o,g,w,i=1){const c=C(i),a=[];for(let n=0;n<g;n++){const m=c()*Math.PI*2,t=Math.acos(2*c()-1),v=Math.cbrt(c()),u=Math.sin(t)*Math.cos(m)*v,l=Math.cos(t)*v*.7,f=Math.sin(t)*Math.sin(m)*v;a.push({at:[s[0]+u*o[0],s[1]+l*o[1],s[2]+f*o[2]],r:w*(.6+.7*(1-v))*(.8+c()*.4)})}return a}const Z=(s,o)=>G(P.x*o,P.z,P.wall,18,P.top-30,s===0?12:16,s===0?14:18,15,8,P.gap,o);function G(s,o,g,w,i,c,a,n,m=2,t,v=1){const u=C(m),l=[];for(let f=0;f<a;f++){const b=w+(i-w)*(f+u()*.5)/a;for(let A=0;A<c;A++){const M=(A+u()*.7)/c*Math.PI*2,p=g*(1+(u()-.3)*.35),r=b+(u()-.5)*n*.5,h=n*(.75+u()*.55);if(t&&r<t.below){let y=Math.abs(M-t.at)%(Math.PI*2);if(y>Math.PI&&(y=Math.PI*2-y),y<t.half)continue}l.push({at:[s+Math.cos(M)*p*v,r,o+Math.sin(M)*p],r:h})}}return l}export{W as b,j as c,Z as t};
