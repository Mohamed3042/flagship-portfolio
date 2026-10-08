import{C as U,s as K,t as Q,i as Z,a4 as Be,M as Y,a as de,ac as Le,ad as N,br as He,bs as Ke,ao as Ee,ap as oe,aK as ze,aq as De,x as Qe,aR as $e,aS as Ze,y as ye,aT as Ye,aH as Je,V as ne,S as xe,P as et,q as tt,H as at,I as H,B as ot,b0 as nt,p as st,G as rt,a2 as ee,aL as be}from"./EditionWorld.astro_astro_type_script_index_0_lang.Bwhdv6R4.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const it=e=>e-Math.floor(e),$=e=>it(Math.sin(e*127.1+311.7)*43758.5453123);function he(e){const n=Math.floor(e),o=e-n,t=o*o*(3-2*o);return $(n)*(1-t)+$(n+1)*t}function me(e=1){let n=e*2654435761>>>0||1;return()=>(n=n*1664525+1013904223>>>0)/4294967296}function ct(e,n=!1,o=12){const t=e.length;if(t<3)return e.slice();const c=r=>n?e[(r+t)%t]:e[Math.max(0,Math.min(t-1,r))],s=[],a=n?t:t-1;for(let r=0;r<a;r++){const h=c(r-1),f=c(r),u=c(r+1),i=c(r+2),l=(p,k)=>Math.pow(Math.hypot(k[0]-p[0],k[1]-p[1])||1e-6,.5),v=0,d=v+l(h,f),x=d+l(f,u),m=x+l(u,i);for(let p=0;p<o;p++){const k=d+(x-d)*p/o,b=(A,y,P,R)=>{const B=(k-P)/(R-P||1e-6);return[A[0]+(y[0]-A[0])*B,A[1]+(y[1]-A[1])*B]},q=b(h,f,v,d),C=b(f,u,d,x),g=b(u,i,x,m),w=b(q,C,v,x),F=b(C,g,d,m);s.push(b(w,F,d,x))}}return s.push(n?[...e[0]]:[...e[t-1]]),s}function St(e,n=.12,o=2){let t=e;for(let c=0;c<o;c++){const s=[t[0]];for(let a=0;a<t.length-1;a++){const r=t[a],h=t[a+1];s.push([r[0]+(h[0]-r[0])*n,r[1]+(h[1]-r[1])*n],[r[0]+(h[0]-r[0])*(1-n),r[1]+(h[1]-r[1])*(1-n)])}s.push(t[t.length-1]),t=s}return t}const Ge=e=>{let n=0;for(let o=1;o<e.length;o++)n+=Math.hypot(e[o][0]-e[o-1][0],e[o][1]-e[o-1][1]);return n};function Me(e,n){const o=Ge(e);if(o<1e-6)return[e[0],e[0]];const t=Math.max(2,Math.ceil(o/n)+1),c=o/(t-1),s=[[...e[0]]];let a=0,r=0,h=Math.hypot(e[1][0]-e[0][0],e[1][1]-e[0][1]);for(let f=1;f<t-1;f++){const u=f*c;for(;u>r+h&&a<e.length-2;)r+=h,a++,h=Math.hypot(e[a+1][0]-e[a][0],e[a+1][1]-e[a][1]);const i=h>0?(u-r)/h:0;s.push([e[a][0]+(e[a+1][0]-e[a][0])*i,e[a][1]+(e[a+1][1]-e[a][1])*i])}return s.push([...e[e.length-1]]),s}function lt(e,n){const o=Ge(e),t=[];for(let c=0;c<n;c++)t.push(Oe(e,o*c/(n-1)).p);return t}function Tt(e,n,o,{turns:t=9,seed:c=1}={}){const s=me(c),a=[];let r=s()*6.28,h=o*.5;for(let f=0;f<t*10;f++)r+=.55+s()*.5,h+=(s()-.5)*o*.35,h=Math.max(o*.15,Math.min(o,h)),a.push([e+Math.cos(r)*h*(1+(s()-.5)*.2),n+Math.sin(r)*h*.85]);return a}function qt(e,n,o,t,c=.22){const s=[];for(let a=0;a<t;a++){const r=a/t*Math.PI*2,h=Math.PI*2/t;for(const[f,u]of[[0,1],[.12,1+c],[.42,1+c],[.54,1]])s.push([e+Math.cos(r+f*h)*o*u,n+Math.sin(r+f*h)*o*u])}return s}function Oe(e,n){let o=0;for(let t=1;t<e.length;t++){const c=e[t-1],s=e[t],a=Math.hypot(s[0]-c[0],s[1]-c[1]);if(o+a>=n||t===e.length-1){const r=a>0?Math.max(0,Math.min(1,(n-o)/a)):0;return{p:[c[0]+(s[0]-c[0])*r,c[1]+(s[1]-c[1])*r],t:a>0?[(s[0]-c[0])/a,(s[1]-c[1])/a]:[1,0]}}o+=a}return{p:e[0],t:[1,0]}}function Ae(e,n,o,t,{start:c=2.4,dir:s=-1,n:a=14,rot:r=0,lop:h=.06,seed:f=1}={}){const u=[],i=Math.cos(r),l=Math.sin(r);for(let v=0;v<a;v++){const d=c+s*v/a*Math.PI*2,x=1+(he(v*.9+f*7.3)-.5)*2*h,m=Math.cos(d)*o*x,p=Math.sin(d)*t*x;u.push([e+m*i-p*l,n+m*l+p*i])}return u}function Rt(e,n,o,t,c,{tip:s=.62,round:a=1,seed:r=1}={}){const h=Math.cos(o),f=Math.sin(o),u=c/2,i=v=>1+($(r*13.1+v)-.5)*.12;return[[0,0],[t*.22,-u*.55*i(1)],[t*s,-u*i(2)],[t*(.9+.02*a),-u*.55*i(3)],[t,0],[t*(.9+.02*a),u*.55*i(4)],[t*s,u*i(5)],[t*.22,u*.55*i(6)]].map(([v,d])=>[e+v*h-d*f,n+v*f+d*h])}function Bt(e,n,o,t,c,{bend:s=.12,seed:a=1}={}){const r=Math.cos(o),h=Math.sin(o),f=c/2,u=l=>1+($(a*7.7+l)-.5)*.14;return[[0,0],[t*.25,-f*.8*u(1)+s*t*.3],[t*.55,-f*u(2)+s*t*.45],[t*.85,-f*.5*u(3)+s*t*.3],[t,s*t*.1],[t*.82,f*.55*u(4)+s*t*.32],[t*.5,f*u(5)+s*t*.42],[t*.2,f*.7*u(6)+s*t*.2]].map(([l,v])=>[e+l*r-v*h,n+l*h+v*r])}function ke(e,n,o,t,c,{turns:s=1.1,dir:a=1}={}){const r=[];for(let m=0;m<=18;m++){const p=m/18;r.push([e+Math.cos(o+a*p*.35)*t*p,n+Math.sin(o+a*p*.35)*t*p])}const[f,u]=r[r.length-1],i=o+a*.35,l=f+Math.cos(i+a*Math.PI/2)*c,v=u+Math.sin(i+a*Math.PI/2)*c,d=Math.atan2(u-v,f-l),x=24;for(let m=1;m<=x;m++){const p=m/x,k=c*(1-p*.55),b=d+a*p*s*Math.PI*2;r.push([l+Math.cos(b)*k,v+Math.sin(b)*k])}return r}function Lt(e,n,o,t,{over:c=.03,skew:s=.006,seed:a=1}={}){const r=me(a),h=()=>(r()-.5)*2*s,f=e-o/2,u=e+o/2,i=n-t/2,l=n+t/2,v=()=>c*(.6+r()*.8);return[[[f-v(),l+h()],[u+v(),l+h()]],[[u+h(),l+v()],[u+h(),i-v()]],[[u+v(),i+h()],[f-v(),i+h()]],[[f+h(),i-v()],[f+h(),l+v()]]]}function Et(e,n,o,t,c,{ang:s=.5,seed:a=1,loose:r=.25}={}){const h=me(a),f=Math.cos(s),u=Math.sin(s),i=Math.abs(o*f)+Math.abs(t*u),l=Math.abs(o*u)+Math.abs(t*f),v=Math.ceil(l/c)+1,d=[];for(let x=0;x<=v;x++){const m=-l/2+x*c+(h()-.5)*c*r,k=(x%2?1:-1)*(i/2+c*(.2+h()*.4));d.push([e+k*f-m*u,n+k*u+m*f])}return d}const re="#f4f1ea",Ue="#1c1b1a",se={ink:Ue,orange:"#f3a43a",dot:"#d9531f",stem:"#3c9d58",leaf:"#2e8f8a",leaf2:"#2b6aa0",leafLine:"#24694a",bee:"#f7b733",sky:"#9ccbea",pink:"#f4a3b8",yellow:"#f7d84f",red:"#e4553b",lilac:"#b9a4ea",mint:"#8fd9b6",grey:"#9a968f",white:"#fffdf8"},te=new U(re);function ae(e,n=new U){const o=typeof e=="string"?new U(e):e;return n.setRGB(Math.min(1,o.r/te.r),Math.min(1,o.g/te.g),Math.min(1,o.b/te.b))}const zt=(e,n)=>"#"+new U(e).lerp(new U(re),n).getHexString(),we={uBoil:{value:0},uWidth:{value:1},uPaperLin:{value:te}};function ut(e){we.uBoil.value=Math.floor(e*12)%251}const ge=.022,J=`
  float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float n11(float x){ float i = floor(x), f = fract(x); return mix(h11(i), h11(i + 1.), f * f * (3. - 2. * f)); }
  float n21(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }`,Ie=24,_e=()=>({value:Array.from({length:Ie},()=>new Q(0,0,0,1))}),Ne=`
  vec3 bend(vec3 p, vec4 b){
    if (abs(b.w) < .5) return p;
    float u = (p.x - b.x) * b.w, a = b.y, k = b.z, th = a + k * u, X, Z;
    if (abs(k) < 1e-3) { X = u * cos(a); Z = u * sin(a); }
    else { X = (sin(th) - sin(a)) / k; Z = (cos(a) - cos(th)) / k; }
    return vec3(b.x + (X - sin(th) * p.z) * b.w, p.y, Z + cos(th) * p.z);
  }`,Ve=`
  uniform vec4 uXf[${Ie}];
  vec2 xfPos(vec2 p, float g){ vec4 X = uXf[int(g + .5)]; float c = cos(X.z), s = sin(X.z); return mat2(c, s, -s, c) * (p * X.w) + X.xy; }
  vec2 xfDir(vec2 d, float g){ vec4 X = uXf[int(g + .5)]; float c = cos(X.z), s = sin(X.z); return mat2(c, s, -s, c) * d; }
  ${Ne}
  uniform vec4 uBend;
  vec3 bendP(vec3 p){ return bend(p, uBend); }`;function Xe(e,n){return e.transparent=!0,e.depthWrite=!1,e.side=Be,n?(e.blending=Ye,e):(Object.assign(e,{blending:De,blendEquation:Je,blendSrc:ze,blendDst:oe,blendSrcAlpha:oe,blendDstAlpha:Ee}),e)}let ht=1;function fe(e){const n=e.w??ge,o=e.seed??ht++*.618,t=!!e.closed;let c=e.smooth===!1?e.pts.map(f=>[f[0],f[1]]):ct(e.pts,t,12);e.smooth===!1&&t&&c.push([c[0][0],c[0][1]]);const s=e.ds??Math.max(.0012,Math.min(n*.38,.018));let a=Me(c,s);const r=(e.over??(t?1.6:0))*n;if(r>0&&a.length>2)if(t){const f=Math.hypot(a[1][0]-a[0][0],a[1][1]-a[0][1])||1e-4,u=Math.min(a.length-2,Math.ceil(r/f));for(let i=1;i<=u;i++){const l=a[i],v=a[i+1]??a[i],d=v[0]-a[i-1][0],x=v[1]-a[i-1][1],m=Math.hypot(d,x)||1,p=i/u;a.push([l[0]-x/m*n*.45*p*($(o)>.5?1:-1),l[1]+d/m*n*.45*p*($(o)>.5?1:-1)])}}else{const f=a[0],u=a[1],i=a[a.length-1],l=a[a.length-2],v=Math.hypot(f[0]-u[0],f[1]-u[1])||1,d=Math.hypot(i[0]-l[0],i[1]-l[1])||1;a=Me([[f[0]+(f[0]-u[0])/v*r,f[1]+(f[1]-u[1])/v*r],...a,[i[0]+(i[0]-l[0])/d*r,i[1]+(i[1]-l[1])/d*r]],s)}const h=(e.wob??.5)*n;if(h>0){let f=0;const u=Math.max(n*11,.07),i=[];for(let l=0;l<a.length;l++){l&&(f+=Math.hypot(a[l][0]-a[l-1][0],a[l][1]-a[l-1][1]));const v=a[Math.max(0,l-1)],d=a[Math.min(a.length-1,l+1)],x=d[0]-v[0],m=d[1]-v[1],p=Math.hypot(x,m)||1,k=(he(f/u+o*9.1)-.5)*2+(he(f/(u*.28)+o*3.3)-.5)*.5;i.push([a[l][0]-m/p*h*k,a[l][1]+x/p*h*k])}a=i}return a}const ft=`
  ${J}
  ${Ve}
  attribute vec4 aA;   // s, L, half weight, seed
  attribute vec4 aB;   // normal, side, cap
  attribute vec4 aC;   // t0, t1, dash, boil
  attribute vec3 aCol; attribute float aGrp; attribute vec4 aAlt;
  uniform float uBoil, uWidth, uDraw, uBoilAmp, uLinear, uMorph;
  varying vec3 vCol; varying vec4 vS; varying vec3 vE;
  void main(){
    float q = clamp((uDraw - aC.x) / max(aC.y - aC.x, 1e-5), 0., 1.);
    if (q <= 0.) { gl_Position = vec4(0., 0., 2., 1.); return; }   // not begun: nothing to draw
    float s = aA.x, L = aA.y, hw = aA.z * uWidth, seed = aA.w;
    // a hand: quick off the mark, easing in at the end (a trail: exactly where its bee is)
    float end = uLinear > .5 ? L * q : q >= 1. ? L + 1. : L * mix(q, q * q * (3. - 2. * q), .55);
    vec2 n = xfDir(normalize(mix(aB.xy, aAlt.zw, uMorph) + 1e-5), aGrp), t = vec2(n.y, -n.x);
    float pad = hw * 1.5 + .0015;
    // the boil: on twos the line is drawn again, a hair off, smoothly along its length
    float f = uBoil * 3.71 + seed * 17.3, amp = hw * uBoilAmp * aC.w;
    vec2 c = xfPos(mix(position.xy, aAlt.xy, uMorph), aGrp);
    c += n * (n11(s * 5.5 + f) - .5) * 2. * amp + (vec2(h11(f), h11(f + 5.3)) - .5) * amp * .8;
    c += t * aB.w * pad;
    vCol = aCol; vS = vec4(s + aB.w * pad, aB.z * pad, hw, min(end, L)); vE = vec3(aC.z, seed, end);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bendP(vec3(c + n * aB.z * pad, position.z)), 1.);
  }`,vt=`
  ${J}
  uniform float uBoil, uOpacity; uniform vec2 uTail; uniform vec3 uPaperLin;
  varying vec3 vCol; varying vec4 vS; varying vec3 vE;
  void main(){
    float s = vS.x, a = vS.y, hw = vS.z, e = vS.w, seed = vE.y;
    // a felt tip: the weight wanders a little along the line (again on twos) and pools where the marker landed
    float w = hw * (1. + .2 * (n11(s / (hw * 7.) + seed * 5. + uBoil * .73) - .5) + .18 * exp(-max(s, 0.) / (hw * 2.4)));
    float lo = uTail.x > 0. ? max(e - uTail.y, 0.) : -1e5;   // a trail: only its last stretch
    float ds = s < lo ? lo - s : (s > e ? s - e : 0.);
    if (vE.x > 0.) { float P = vE.x, u = mod(s, P), on = P * .5; ds = max(ds, u > on ? min(u - on, P - u) : 0.); }
    float d = length(vec2(ds, a));
    float aa = max(fwidth(d), 1e-6) * .75;
    float cov = smoothstep(w + aa, w - aa, d) * uOpacity;
    if (uTail.x > 0.) cov *= smoothstep(lo, lo + uTail.y * .45, s);
    if (cov < .002) discard;
    float grain = n21(vec2(s / (hw * 1.3), a / (hw * .55)) + seed * 3.1) - .5;   // the felt's drag, faint
    vec3 ink = clamp(vCol * (1. + grain * .12), 0., 1.);
    #ifdef PAINT
      gl_FragColor = vec4(uPaperLin * ink, cov);   // a cel: the marker on its own paper, over what is behind
    #else
      gl_FragColor = vec4(mix(vec3(1.), ink, cov), 1.);
    #endif
  }`;function ve(e,{paint:n=!1,boil:o=1,moving:t=!1}={}){const c=e.map(w=>fe(w)),s=e.map((w,F)=>w.alt?lt(fe({...w,pts:w.alt}),c[F].length):c[F]);let a=0;for(const w of c)a+=w.length+2;const r=a*2,h=new Float32Array(r*3),f=new Float32Array(r*4),u=new Float32Array(r*4),i=new Float32Array(r*4),l=new Float32Array(r*3),v=new Float32Array(r),d=new Float32Array(r*4),x=[],m=new U;let p=0;const k=(w,F)=>{const A=w[Math.max(0,F-1)],y=w[Math.min(w.length-1,F+1)],P=y[0]-A[0],R=y[1]-A[1],B=Math.hypot(P,R)||1;return[-R/B,P/B]};e.forEach((w,F)=>{const A=c[F],y=s[F],P=A.length,R=(w.w??ge)/2,B=w.seed??F*.618+1.3,I=w.z??0;ae(w.color??Ue,m);const L=[0];for(let M=1;M<P;M++)L.push(L[M-1]+Math.hypot(A[M][0]-A[M-1][0],A[M][1]-A[M-1][1]));const X=L[P-1],j=p,G=(M,E,W)=>{const[z,_]=k(A,M),[S,T]=k(y,M);h.set([A[M][0],A[M][1],I],p*3),f.set([L[M],X,R,B],p*4),u.set([z,_,E,W],p*4),d.set([y[M][0],y[M][1],S,T],p*4),i.set([w.t0??0,w.t1??1,w.dash??0,w.boil??1],p*4),l.set([m.r,m.g,m.b],p*3),v[p]=w.grp??0,p++};G(0,-1,-1),G(0,1,-1);for(let M=0;M<P;M++)G(M,-1,0),G(M,1,0);G(P-1,-1,1),G(P-1,1,1);for(let M=0;M<P+1;M++){const E=j+M*2;x.push(E,E+1,E+2,E+1,E+3,E+2)}});const b=new Le;b.setAttribute("position",new N(h,3)),b.setAttribute("aA",new N(f,4)),b.setAttribute("aB",new N(u,4)),b.setAttribute("aC",new N(i,4)),b.setAttribute("aCol",new N(l,3)),b.setAttribute("aGrp",new N(v,1)),b.setAttribute("aAlt",new N(d,4)),b.setIndex(r>65535?new He(x,1):new Ke(x,1)),b.computeBoundingSphere(),b.boundingSphere&&(b.boundingSphere.radius+=.08);const q={...we,uDraw:{value:1},uBoilAmp:{value:.5*o},uOpacity:{value:1},uTail:{value:new K(0,0)},uLinear:{value:0},uXf:_e(),uBend:{value:new Q},uMorph:{value:0}},C=Xe(new Z({uniforms:q,vertexShader:ft,fragmentShader:vt,defines:n?{PAINT:1}:{}}),n),g=new Y(b,C);return g.frustumCulled=!t,{mesh:g,U:q,set(w){q.uDraw.value=w},dispose(){b.dispose(),C.dispose()}}}const pt={oval:0,leaf:1,petal:2,box:3,tex:4},dt=`
  ${J}
  ${Ve}
  attribute vec2 aQ; attribute vec2 aCtr; attribute vec4 aShape; attribute vec4 aF; attribute vec4 aG;
  attribute vec3 aCol; attribute vec3 aCol2; attribute vec3 aCol3; attribute vec4 aUV; attribute float aGrp;
  uniform float uDraw, uBoil;
  varying vec2 vQ; varying vec4 vShape; varying vec4 vF; varying vec4 vG; varying vec3 vCol; varying vec3 vCol2; varying vec3 vCol3; varying vec4 vUV;
  float backOut(float x){ float y = x - 1.; return 1. + 2.70158 * y * y * y + 1.70158 * y * y; }
  void main(){
    float q = clamp((uDraw - aF.x) / max(aF.y - aF.x, 1e-5), 0., 1.);
    if (q <= 0.) { gl_Position = vec4(0., 0., 2., 1.); return; }
    float sc = aF.w < .5 ? backOut(q) : 1.;   // pop: in with a spring
    float f = uBoil * 2.31 + aF.z * 11.7;
    vec2 jb = (vec2(h11(f), h11(f + 3.1)) - .5) * aG.w * .8;   // on twos it shifts a hair: laid down by hand
    vec2 p = xfPos(aCtr + (position.xy - aCtr) * sc + jb, aGrp);
    vQ = aQ; vShape = aShape; vF = vec4(q, aF.z, aG.x, aF.w); vG = aG; vCol = aCol; vCol2 = aCol2; vCol3 = aCol3; vUV = aUV;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bendP(vec3(p, position.z)), 1.);
  }`,mt=`
  ${J}
  uniform float uBoil, uOpacity, uTexRange; uniform sampler2D uTex; uniform vec3 uPaperLin; uniform vec4 uTint; uniform vec3 uTint2;
  varying vec2 vQ; varying vec4 vShape; varying vec4 vF; varying vec4 vG; varying vec3 vCol; varying vec3 vCol2; varying vec3 vCol3; varying vec4 vUV;
  float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
  float shapeD(vec2 q){
    float k = vShape.x; vec2 hs = vShape.yz * .5;
    if (k < .5) return (length(q / hs) - 1.) * min(hs.x, hs.y);                                   // oval
    if (k < 1.5) { float x = clamp(q.x / hs.x, -1., 1.);                                            // leaf, pointed at both ends
      return max(abs(q.y) - hs.y * pow(max(1. - x * x, 0.), .72), abs(q.x) - hs.x); }
    if (k < 2.5) return (length(vec2(q.x / hs.x, q.y / (hs.y * (.6 + .4 * clamp(q.x / hs.x, -1., 1.))))) - 1.) * min(hs.x, hs.y);   // petal: narrow at its base (-x)
    if (k < 3.5) return sdBox(q, hs, vShape.w);                                                    // box
    return (.5 - texture2D(uTex, mix(vUV.xy, vUV.zw, q / vShape.yz + .5)).r) * uTexRange;      // any shape, from its distance texture
  }
  void main(){
    vec2 q = vQ, hs = vShape.yz * .5;
    float R = max(hs.x, hs.y), seed = vF.y, prog = vF.x;
    float d = shapeD(q) + (n21(q / R * 2.1 + seed * 7.1 + uBoil * 1.31) - .5) * vG.w;   // the edge wanders, again on twos
    float aa = max(fwidth(d), 1e-6) * .8;
    float inside = smoothstep(aa, -aa, d);
    if (inside < .002) discard;
    // the marker passes: parallel strokes across the shape, overlapping a little (multiplied twice there: the streaks)
    float ang = vF.z, cs = cos(ang), sn = sin(ang);
    vec2 r = vec2(cs * q.x + sn * q.y, -sn * q.x + cs * q.y);
    float P = max(vG.x, 1.), Rr = length(hs), gap = 2. * Rr / P;
    float u = r.y / gap + P * .5, v = r.x / Rr * .5 + .5, au = fwidth(u) * .8;
    float cnt = 0., alt = 0.;
    for (int o = -1; o <= 1; o++) {
      float k = floor(u) + float(o);
      float c = k + .5 + (h11(k * 3.7 + seed) - .5) * .18 + (n11(v * 3.2 + k * 1.7 + seed) - .5) * .16;   // each pass wanders
      float hw = .66 + (h11(k * 5.3 + seed) - .5) * .12;
      float on = smoothstep(hw + au, hw - au, abs(u - c));
      if (vF.w > .5) {   // scribbled in: pass after pass, each end to end, back and forth
        float pk = clamp(prog * (P + 2.) - k, 0., 1.), vv = mod(k, 2.) < 1. ? v : 1. - v;
        on *= smoothstep(pk + .015, pk - .015, vv) * step(.001, pk);
      }
      cnt += on;
      alt += on * step(.5, fract(k * .5 + .25));
    }
    vec3 pass = mix(uTint.w > .5 ? uTint.rgb : vCol, uTint.w > .5 ? uTint2 : vCol2, clamp(alt / max(cnt, 1e-3), 0., 1.));   // (a shared batch takes its colour from uTint)
    vec3 filt = mix(vec3(1.), pass, min(cnt, 1.)) * mix(vec3(1.), pass, clamp(cnt - 1., 0., 1.) * .6);   // a second pass darkens, not doubles
    float fib = n21(vec2(v * 26., u * 7.) + seed) - .5;   // the felt's streaks along each pass
    filt = clamp(filt * (1. + fib * .07 * cnt), 0., 1.);
    // stipple: dots scattered over it, popping in one by one
    if (vG.z > 0.) {
      vec2 cell = floor(q / vG.z);
      vec2 ctr = (cell + .5 + (vec2(h21(cell + seed), h21(cell + seed + 7.1)) - .5) * .5) * vG.z;
      float rr = vG.z * (.12 + .08 * h21(cell + 3.3)), dd = length(q - ctr), ad = fwidth(dd) * .8;
      float has = step(h21(cell + 11.3 + seed), .45) * step(.35 + .6 * h21(cell + 5.7), prog) * step(-.6 * vG.z, -d);
      filt *= mix(vec3(1.), vCol3, smoothstep(rr + ad, rr - ad, dd) * has);
    }
    #ifdef PAINT
      gl_FragColor = vec4(uPaperLin * filt, inside * uOpacity);   // a cel: opaque over what is behind
    #else
      gl_FragColor = vec4(mix(vec3(1.), filt, inside * uOpacity), 1.);
    #endif
  }`;function Fe(e,{tex:n=null,range:o=.1,paint:t=!1,moving:c=!1,grid:s=1}={}){const a=s+1,r=a*a,h=e.length*r,f=new Float32Array(h*3),u=new Float32Array(h*2),i=new Float32Array(h*2),l=new Float32Array(h*4),v=new Float32Array(h*4),d=new Float32Array(h*4),x=new Float32Array(h*3),m=new Float32Array(h*3),p=new Float32Array(h*3),k=new Float32Array(h*4),b=new Float32Array(h),q=[],C=new U;e.forEach((y,P)=>{const[R,B]=y.at,[I,L]=y.size,X=y.rot??0,j=Math.cos(X),G=Math.sin(X),M=1.18,E=y.seed??P*.731+.37,W=y.wob??Math.min(I,L)*.05;for(let z=0;z<r;z++){const _=z%a/s,S=Math.floor(z/a)/s,T=P*r+z,ie=(_-.5)*(I*M+2*W),ce=(S-.5)*(L*M+2*W);f.set([R+ie*j-ce*G,B+ie*G+ce*j,y.z??0],T*3),u.set([ie,ce],T*2),i.set([R,B],T*2),l.set([pt[y.kind],I,L,y.round??Math.min(I,L)*.12],T*4),v.set([y.t0??0,y.t1??1,E,y.scribble?1:0],T*4),d.set([y.ang??.6,y.passes??5,y.dots?y.dot??Math.min(I,L)*.13:0,W],T*4),ae(y.color,C),x.set([C.r,C.g,C.b],T*3),ae(y.color2??y.color,C),m.set([C.r,C.g,C.b],T*3),ae(y.dots??se.dot,C),p.set([C.r,C.g,C.b],T*3),k.set(y.uv??[0,0,1,1],T*4),b[T]=y.grp??0}for(let z=0;z<s;z++)for(let _=0;_<s;_++){const S=P*r+z*a+_;q.push(S,S+1,S+a,S+1,S+a+1,S+a)}});const g=new Le;g.setAttribute("position",new N(f,3));for(const[y,P,R]of[["aQ",u,2],["aCtr",i,2],["aShape",l,4],["aF",v,4],["aG",d,4],["aCol",x,3],["aCol2",m,3],["aCol3",p,3],["aUV",k,4],["aGrp",b,1]])g.setAttribute(y,new N(P,R));g.setIndex(q),g.computeBoundingSphere(),g.boundingSphere&&(g.boundingSphere.radius*=1.25);const w={...we,uDraw:{value:1},uOpacity:{value:1},uTex:{value:n},uTexRange:{value:o},uXf:_e(),uBend:{value:new Q},uTint:{value:new Q(1,1,1,0)},uTint2:{value:new U(1,1,1)}},F=Xe(new Z({uniforms:w,vertexShader:dt,fragmentShader:mt,defines:t?{PAINT:1}:{}}),t),A=new Y(g,F);return A.frustumCulled=!c,{mesh:A,U:w,set(y){w.uDraw.value=y},dispose(){g.dispose(),F.dispose()}}}const wt=`
  ${Ne}
  uniform vec4 uBend; varying vec3 vW; varying float vTurn; varying vec2 vLoc;
  void main(){
    vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vLoc = position.xy;   // (the texture stays on the sheet however it bends)
    vTurn = uBend.y + uBend.z * (position.x - uBend.x) * uBend.w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bend(position, uBend), 1.);
  }`,gt=`
  ${J}
  uniform vec3 uPaper; uniform vec2 uOff, uHalf; uniform vec4 uSmudge[4]; uniform float uTone, uLit, uEdge;
  varying vec3 vW; varying float vTurn; varying vec2 vLoc;
  void main(){
    vec2 p = vW.xy + uOff;
    float px = max(fwidth(p.x), fwidth(p.y));   // page units a pixel: fine grain fades before it would shimmer
    float tooth = (n21(p * 190.) - .5) * (1. - smoothstep(.0035, .008, px)) + (n21(p * 61. + 4.) - .5) * .6;
    vec2 fp = mat2(.82, .57, -.57, .82) * p;
    float fib = (n21(fp * vec2(22., 240.)) - .5) * (1. - smoothstep(.002, .006, px)) + (n21(fp * vec2(7., 70.) + 2.) - .5) * .7;
    float mott = n21(p * 2.1 + 9.) * .6 + n21(p * 5.3 + 1.) * .4 - .5;
    vec3 col = uPaper * (1. + tooth * .045 + fib * .022 + mott * .035);
    for (int i = 0; i < 4; i++) {   // a few smudges (graphite, a thumb): soft, a little streaky
      vec4 s = uSmudge[i]; if (s.w <= 0.) continue;
      vec2 d = (p - s.xy) / s.z;
      float g = exp(-dot(d, d) * 2.2) * (.75 + .5 * n21(p / s.z * vec2(9., 2.)));
      col *= 1. - g * s.w;
    }
    // a sheet standing up off the page catches the light less (the flipbook's pages); its back a touch greyer
    float lit = mix(1., .78 + .22 * abs(cos(vTurn)), uLit) * (gl_FrontFacing ? 1. : .95);
    if (uEdge > 0.) {   // a sheet's edges: a fine grey line and a little shade, so a page reads on the page under it
      vec2 e = uHalf - abs(vLoc); float d = min(e.x, e.y), px = fwidth(d);
      lit *= 1. - .3 * smoothstep(px * 1.5, 0., d - px) - .06 * exp(-d / .03);
    }
    gl_FragColor = vec4(col * uTone * lit, 1.);
  }`;function Dt(e,n,{off:o=[0,0],smudges:t=[],color:c=re,segs:s=1}={}){const a={uPaper:{value:new U(c)},uOff:{value:new K(o[0],o[1])},uTone:{value:1},uSmudge:{value:Array.from({length:4},(f,u)=>new Q(...t[u]??[0,0,1,0]))},uBend:{value:new Q},uLit:{value:0},uEdge:{value:0},uHalf:{value:new K(e/2,n/2)}},r=new Z({uniforms:a,vertexShader:wt,fragmentShader:gt,side:Be}),h=new Y(new de(e,n,s,1),r);return h.renderOrder=-100,{mesh:h,U:a,dispose(){h.geometry.dispose(),r.dispose()}}}function Pe(e,n,o,t,c){let s=0;t[0]=0,c[0]=-1/0,c[1]=1/0;for(let a=1;a<n;a++){let r=(e[a]+a*a-(e[t[s]]+t[s]*t[s]))/(2*a-2*t[s]);for(;r<=c[s];)s--,r=(e[a]+a*a-(e[t[s]]+t[s]*t[s]))/(2*a-2*t[s]);s++,t[s]=a,c[s]=r,c[s+1]=1/0}s=0;for(let a=0;a<n;a++){for(;c[s+1]<a;)s++;o[a]=(a-t[s])*(a-t[s])+e[t[s]]}}function Ce(e,n,o,t){const s=new Float64Array(n*o),a=Math.max(n,o),r=new Float64Array(a),h=new Float64Array(a),f=new Int32Array(a),u=new Float64Array(a+1);for(let i=0;i<n*o;i++)s[i]=e[i]===t?0:1e20;for(let i=0;i<n;i++){for(let l=0;l<o;l++)r[l]=s[l*n+i];Pe(r,o,h,f,u);for(let l=0;l<o;l++)s[l*n+i]=h[l]}for(let i=0;i<o;i++){for(let l=0;l<n;l++)r[l]=s[i*n+l];Pe(r,n,h,f,u);for(let l=0;l<n;l++)s[i*n+l]=Math.sqrt(h[l])}return s}function Gt(e,n=24){const o=e.width,t=e.height,c=e.getContext("2d").getImageData(0,0,o,t).data,s=new Uint8Array(o*t);for(let i=0;i<o*t;i++)s[i]=c[i*4]>127?1:0;const a=Ce(s,o,t,1),r=Ce(s,o,t,0),h=new Uint8Array(o*t),f=new Float32Array(o*t);for(let i=0;i<t;i++)for(let l=0;l<o;l++){const v=i*o+l,d=s[v]?r[v]-.5:-(a[v]-.5);f[v]=d,h[(t-1-i)*o+l]=Math.max(0,Math.min(255,Math.round((.5+d/(2*n))*255)))}const u=new Qe(h,o,t,$e,Ze);return u.flipY=!1,u.minFilter=ye,u.magFilter=ye,u.generateMipmaps=!1,u.needsUpdate=!0,{tex:u,spread:n,inside:s,sd:f,W:o,H:t}}const yt="varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",xt=`
  uniform vec2 uHalf; uniform float uSoft, uAmt, uRound; varying vec2 vP;
  void main(){
    vec2 q = abs(vP) - uHalf + uRound; float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRound;
    gl_FragColor = vec4(vec3(1. - uAmt * (1. - smoothstep(-uSoft, uSoft, d))), 1.);
  }`;function Ot(e,n,{soft:o=.06,amt:t=.2,round:c=.02}={}){const s={uHalf:{value:new K(e/2,n/2)},uSoft:{value:o},uAmt:{value:t},uRound:{value:c}},a=new Z({uniforms:s,vertexShader:yt,fragmentShader:xt,transparent:!0,depthWrite:!1,blending:De,blendSrc:ze,blendDst:oe,blendSrcAlpha:oe,blendDstAlpha:Ee}),r=new Y(new de(e+o*5,n+o*5),a);return r.renderOrder=2,{mesh:r,U:s,dispose(){r.geometry.dispose(),a.dispose()}}}const je=30,pe=Math.tan(st.degToRad(je/2)),bt=e=>e/(2*pe),Mt=bt(2),Ut=(e,n)=>({h:2*pe*e,w:2*pe*e*n}),It=e=>e<.9,At="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",kt=`
  uniform sampler2D tWorld; uniform vec2 uRes; uniform float uKeep, uCa;
  varying vec2 vUv;
  // the inverse of three's Neutral tone map (exposure 1), which the engine applies after this
  vec3 invNeutral(vec3 o){
    const float S = .76, D = .24;
    float P = max(o.r, max(o.g, o.b));
    vec3 c = o;
    if (P >= S) {
      P = min(P, .996);
      float peak = D * D / (1. - P) - D + S, g = 1. - 1. / (.15 * (peak - P) + 1.);
      c = (o - P * g) / max(1. - g, 1e-4) * peak / P;
    }
    float m = min(c.r, min(c.g, c.b)), x = m < .04 ? sqrt(max(m, 0.) / 6.25) : m + .04;
    return c + (x - m);
  }
  void main(){
    // the engine parts the colours toward the edges (red out, blue in, more as you scroll fast): sample them the other
    // way here, so black ink on white paper stays black, with no coloured fringes
    vec2 d = (vUv - .5) * uCa;
    vec3 c = vec3(texture2D(tWorld, vUv - d).r, texture2D(tWorld, vUv).g, texture2D(tWorld, vUv + d).b);
    float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uRes.x / uRes.y, 1.)));
    float post = .45 + .55 * vig;   // what the engine multiplies by next
    gl_FragColor = vec4(invNeutral(max(c * mix(1., post, uKeep), 0.)) / post, 1.);
  }`;function _t(e){const n=new xe,o=new et(je,e.viewport.aspect,.05,200);o.position.set(0,0,Mt);const t=new tt(2,2,{type:at,samples:e.quality?4:0,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),c={tWorld:{value:t.texture},uRes:{value:new K(2,2)},uKeep:{value:.3},uCa:{value:.0025}},s=new Z({vertexShader:At,fragmentShader:kt,uniforms:c,depthTest:!1,depthWrite:!1}),a=new Y(new de(2,2),s);a.frustumCulled=!1;const r=new xe;r.add(a);const h=new U(re),f=new U;function u(){const v=Math.max(2,Math.round(e.viewport.width*e.viewport.dpr)),d=Math.max(2,Math.round(e.viewport.height*e.viewport.dpr));(t.width!==v||t.height!==d)&&t.setSize(v,d),c.uRes.value.set(v,d),o.aspect=e.viewport.aspect,o.updateProjectionMatrix()}function i(v,d=n,x=o){const m=e.renderer,p=m.getRenderTarget(),k=m.getClearAlpha();m.getClearColor(f),m.setRenderTarget(v),m.setClearColor(h,1),m.clear(!0,!0,!0),m.render(d,x),m.setRenderTarget(p),m.setClearColor(f,k)}async function l(...v){const d=e.renderer,x=d.getRenderTarget();d.setRenderTarget(t),await Promise.all([[n,o],...v].map(([m,p])=>d.compileAsync(m,p).catch(()=>{}))),d.setRenderTarget(x);for(const m of[n,...v.map(p=>p[0])])m.traverse(p=>{const k=p.material;for(const b of Object.values(k?.uniforms??{})){const q=b?.value;q?.isTexture&&!q.isRenderTargetTexture&&q.image&&!q.isVideoTexture&&d.initTexture(q)}});for(const[m,p]of v)i(t,m,p);i(t)}return u(),{scene:r,world:n,camera:o,rt:t,U:c,resize:u,draw:i,warm:l,render:(v,d)=>i(t,v,d),speed(v){c.uCa.value=.0025+Math.min(Math.abs(v),4)*.006*.65},dispose(){t.dispose(),s.dispose(),a.geometry.dispose()}}}const We=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,D={x:0,y:0,t:-1};function Nt(e,n,o){if(D.t!==n){D.t=n;const t=e.pointer.inside&&!We;D.x=H(D.x,t?e.pointer.x:0,2.6,o),D.y=H(D.y,t?e.pointer.y:0,2.6,o),ut(n)}return D}function Vt(e,n,o,t,c=1,s=0){const a=t*.022*c;e.position.set(n+D.x*a,o+D.y*a*.7,t),e.up.set(0,1,0),e.lookAt(n+D.x*a*.45,o+D.y*a*.7*.45,0),e.rotateZ(-D.x*.01*c+s)}const le=new ne;function Xt(e,n,o){const t=e.pointer.inside&&!We;return t&&Ft(n,e.pointer.x,e.pointer.y,o,le),{x:le.x,y:le.y,on:t}}const Se=new ot,Te=new K,qe=new nt,Re=new ne;function Ft(e,n,o,t=0,c=new ne){return e.updateMatrixWorld(),Te.set(n,o),Se.setFromCamera(Te,e),qe.set(new ne(0,0,1),-t),Se.ray.intersectPlane(qe,Re)?c.copy(Re):c.set(0,0,t)}function jt(e,n=11,o=.32){if(e<=0)return 0;const t=n*Math.sqrt(1-o*o);return 1-Math.exp(-o*n*e)*(Math.cos(t*e)+o*n/t*Math.sin(t*e))}function Wt(){const e=new URLSearchParams(location.search).get("intro");let n=-1,o=-1,t=0;return(c,s)=>e!==null?Number(e):(o<0&&(o=c),n<0&&(t=s<.04?t+1:0,(t>=8||c-o>2.5)&&(n=c)),n<0?0:c-n)}const Ht=()=>new Promise(e=>requestAnimationFrame(()=>e(0)));async function Kt(e){try{await Promise.race([Promise.all(e.map(n=>document.fonts.load(n))),new Promise(n=>setTimeout(n,2500))])}catch{}}const O={cx:-.04,cy:0,rx:.42,ry:.3},Pt=e=>O.ry*Math.sqrt(Math.max(0,1-((e-O.cx)/O.rx)**2)),ue=[{at:[-.13,.25],tilt:.5,rx:.12,ry:.2},{at:[.03,.27],tilt:.12,rx:.1,ry:.17}];function Qt({size:e=.17,z:n=.3}={}){const t=new rt,c=Fe([{kind:"oval",at:[O.cx+.02,O.cy-.015],size:[O.rx*2,O.ry*2],color:se.bee,color2:"#f2a23a",passes:3,ang:1.25,wob:.02},{kind:"oval",at:[.27,.08],size:[.075,.09],color:se.ink,passes:1,wob:.004}],{paint:!0,moving:!0}),s=g=>{const w=Pt(g)-.035;return{pts:[[g-.012,w],[g+.03,0],[g-.01,-w]],w:.12,wob:.1,boil:.6}},a=ve([s(-.17),s(.06),{pts:Ae(O.cx,O.cy,O.rx,O.ry,{start:2.2,n:16,lop:.03}),closed:!0,w:.085,over:1.1,wob:.25},{pts:[[-.45,.05],[-.6,-.02],[-.45,-.08]],smooth:!1,w:.055,wob:.1},{pts:ke(.27,.22,1.2,.17,.045,{turns:1.05,dir:-1}),w:.045,wob:.15},{pts:ke(.34,.19,.82,.15,.04,{turns:1,dir:-1}),w:.045,wob:.15},{pts:[[.22,-.07],[.28,-.11],[.35,-.08]],w:.035,wob:.05}],{paint:!0,moving:!0,boil:.7}),r=Fe(ue.map((g,w)=>({kind:"oval",at:[0,g.ry*.95],size:[g.rx*2,g.ry*2],color:"#d7ecf8",color2:"#c2e0f3",passes:2,ang:.3,grp:w+1,wob:.012})),{paint:!0,moving:!0}),h=ve(ue.map((g,w)=>({pts:Ae(0,g.ry*.95,g.rx,g.ry,{start:-1.4,n:12,lop:.04,seed:w+3}),closed:!0,w:.06,over:.9,wob:.2,grp:w+1})),{paint:!0,moving:!0,boil:.7}),f=[c,a,r,h];f.forEach((g,w)=>{g.mesh.renderOrder=1e3+w,g.mesh.material.depthTest=!1,t.add(g.mesh)}),t.scale.setScalar(e),t.position.z=n;let u=1,i=0,l=-1,v=0,d=0,x=0,m=!1,p=0,k=0,b=0,q=!1;const C=(g,w)=>{const F=ue[g],A=F.tilt+w;for(const y of[r,h])y.U.uXf.value[g+1].set(F.at[0],F.at[1],A,1)};return C(0,.4),C(1,.4),{group:t,size:e,set(g,w,F,A,{fly:y=1,facing:P=0,scale:R=1}={}){const B=Math.hypot(k-g,b-w),I=q&&(p>.5?B<1.1:B<.45)?1:0;if(p=H(p,I,I?2.6:1.5,A),p>.002){const S=p*p*(3-2*p),T=F*4.4;g=be(g,k+Math.cos(T)*.15,S),w=be(w,b+Math.sin(T*1.31)*.09+.03,S),y=Math.max(y,Math.min(1,p*3)),p>.3&&(P=0)}const L=m?(g-v)/Math.max(A,.001):0,X=m?(w-d)/Math.max(A,.001):0;m||(i=y,P&&(u=P)),v=g,d=w,m=!0,i=H(i,y,8,A);const j=P||(Math.abs(L)>.02?Math.sign(L):u>0?1:-1);u=H(u,j,14,A),x=H(x,ee(X*.35,-.45,.45)*Math.sign(u||1)*i,6,A);const G=Math.sin(F*8.3)*.012*i+Math.sin(F*3.1)*.006*i;let M=1,E=1;if(l>=0){const S=F-l,T=Math.exp(-S*7)*Math.cos(S*22)*.28;M=1+T,E=1-T,S>1&&(l=-1)}t.position.set(g,w+G,t.position.z),t.scale.set(this.size*R*u*M,this.size*R*E,1),t.rotation.z=x;const z=Math.floor(F*12)%2?-.55:.5,_=.75+(Math.floor(F*12)%23===0?-.4:0);for(const S of[0,1])C(S,i>.5?z*(S?.85:1):_)},land(g){l=g},near(g,w,F){k=g,b=w,q=F},dispose(){f.forEach(g=>g.dispose())}}}function $t(e,{w:n=ge*.42,dash:o=.045,z:t=.28,color:c=se.grey,tail:s=.9}={}){const a={pts:e,w:n,dash:o,z:t,color:c,wob:0,boil:.4,seed:4.2,ds:o/6},r=fe(a),h=r.reduce((u,i,l)=>l?u+Math.hypot(i[0]-r[l-1][0],i[1]-r[l-1][1]):0,0),f=ve([a],{boil:.4});return f.U.uLinear.value=1,f.U.uTail.value.set(1,s),f.mesh.renderOrder=400,{ink:f,path:r,L:h,at(u){return Oe(r,ee(u)*h)},show(u,i=.07,l=s){f.U.uTail.value.set(1,l),f.set(ee((ee(u)*h-i)/h))},dispose(){f.dispose()}}}const Zt={mark:[.25,2.3],fill:[1.95,2.85],bee:[2.45,4.05],name:[2.75,4.35],nameFill:[4.05,4.8],quiet:4.9,glide:[.46,1]},V={first:.075,last:.93,scribble:[.954,.995]},Yt={color:"#9ccbea",color2:"#86bce6"},Jt={shrink:[0,.1],settle:.16,open:[.15,.24],riffle:[.27,.84],turn:.9};function ea(e,n){const o=t=>Math.min(1,Math.max(0,t));return e<V.first?-1+o(e/V.first):e>V.last?n-1+o((e-V.last)/(1-V.last)):(e-V.first)/(V.last-V.first)*(n-1)}const ta={stops:[.3,.56,.82],turn:.9},aa={stops:[.3,.52,.74],turn:.9},oa={stops:[.16,.38,.6,.8],scribble:[.9,.992]},na={color:"#f7d84f",color2:"#f2cb3c"},sa={shrink:[0,.14],letter:[.12,.34],stick:[.3,.52]},ra={wide:{big:{x:.31,y:.47,w:.4,h:.58},sticky:{vw:.165,vh:.28},stickies:[{x:.63,y:.33},{x:.83,y:.33},{x:.63,y:.67},{x:.83,y:.67}]},tall:{big:{x:.5,y:.3,w:.86,h:.25},sticky:{vw:.4,vh:.19},stickies:[{x:.28,y:.58},{x:.72,y:.58},{x:.28,y:.79},{x:.72,y:.79}]}};export{Tt as A,Ot as B,Yt as C,Zt as D,aa as E,je as F,na as G,ta as H,Ue as I,oa as J,ra as K,sa as L,se as M,J as N,Rt as O,Mt as P,jt as Q,ae as R,we as S,Bt as T,he as U,ea as V,ge as W,V as X,me as Y,Qt as a,Ht as b,Wt as c,Nt as d,Xt as e,Kt as f,ve as g,Fe as h,It as i,$t as j,St as k,Vt as l,Gt as m,fe as n,zt as o,Dt as p,re as q,Et as r,_t as s,Ft as t,Lt as u,Ut as v,Jt as w,ke as x,qt as y,Ae as z};
