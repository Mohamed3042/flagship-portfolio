import{aL as k,a as I,aM as F,aO as z,j as Q,b as N,aP as U,aB as L,aD as B,M as H,aq as C}from"./EditionWorld.astro_astro_type_script_index_0_lang.k1BMDLQf.js";import{P as x,b as O,T as P}from"./path.CDS11gEg.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const V=`
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
  }`,j=`
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
  }`,R=new I(2,2);function E(s,o,{scale:b=1/22,seed:M=4}={}){const i=o.length,c=C(M),a=new k;a.index=R.index,a.setAttribute("position",R.getAttribute("position"));const n=new Float32Array(i*4),m=new Float32Array(i*2),t=o.map(r=>({...r,s:c()*10})),v=new F(n,4).setUsage(z),u=new F(m,2).setUsage(z);a.setAttribute("aPuff",v),a.setAttribute("aAmt",u),a.instanceCount=i;const l={uNoise:{value:O(s)},uScale:{value:b},uTime:{value:0},uAmt:{value:1},uFogD:{value:1/5e3},uSun:{value:new Q(0,.05,-1)},uSunCol:{value:x.sunCol.clone()},uLit:{value:x.cloudLit.clone()},uShade:{value:x.cloudShade.clone()},uDeep:{value:x.cloudDeep.clone()},uSky:{value:x.skyAmb.clone()},uHaze:{value:x.haze.clone()}},f=new N({uniforms:l,vertexShader:V,fragmentShader:j,transparent:!0,depthWrite:!1,blending:B,blendSrc:L,blendDst:U,blendSrcAlpha:L,blendDstAlpha:U}),g=new H(a,f);g.frustumCulled=!1,g.renderOrder=500;const w=t.map(r=>r.amt??1),A=t.map((r,h)=>h),p=new Float32Array(i);return{mesh:g,U:l,puffs:t,setAmt(r,h){w[r]=h},update(r,h,y){l.uTime.value=h,l.uSun.value.copy(y);const D=r.position;for(let e=0;e<i;e++){const d=t[e].at;p[e]=(d[0]-D.x)**2+(d[1]-D.y)**2+(d[2]-D.z)**2}A.sort((e,d)=>p[d]-p[e]);for(let e=0;e<i;e++){const d=A[e],S=t[d],T=Math.sqrt(p[d])/S.r;n[e*4]=S.at[0],n[e*4+1]=S.at[1],n[e*4+2]=S.at[2],n[e*4+3]=S.r,m[e*2]=w[d]*Math.min(1,Math.max(0,(T-.9)/.9)),m[e*2+1]=S.s}v.needsUpdate=!0,u.needsUpdate=!0},dispose(){a.dispose(),f.dispose()}}}function W(s,o,b,M,i=1){const c=C(i),a=[];for(let n=0;n<b;n++){const m=c()*Math.PI*2,t=Math.acos(2*c()-1),v=Math.cbrt(c()),u=Math.sin(t)*Math.cos(m)*v,l=Math.cos(t)*v*.7,f=Math.sin(t)*Math.sin(m)*v;a.push({at:[s[0]+u*o[0],s[1]+l*o[1],s[2]+f*o[2]],r:M*(.6+.7*(1-v))*(.8+c()*.4)})}return a}const J=(s,o)=>q(P.x*o,P.z,P.wall,18,P.top-30,s===0?12:16,s===0?14:18,15,8,P.gap,o);function q(s,o,b,M,i,c,a,n,m=2,t,v=1){const u=C(m),l=[];for(let f=0;f<a;f++){const g=M+(i-M)*(f+u()*.5)/a;for(let w=0;w<c;w++){const A=(w+u()*.7)/c*Math.PI*2,p=b*(1+(u()-.3)*.35),r=g+(u()-.5)*n*.5,h=n*(.75+u()*.55);if(t&&r<t.below){let y=Math.abs(A-t.at)%(Math.PI*2);if(y>Math.PI&&(y=Math.PI*2-y),y<t.half)continue}l.push({at:[s+Math.cos(A)*p*v,r,o+Math.sin(A)*p],r:h})}}return l}export{W as b,E as c,J as t};
