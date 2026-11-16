import{C as O,v as $,V as H,b as Z,a5 as Bt,M as Y,a as dt,a4 as Lt,B as V,bR as Kt,bS as $t,aK as Et,aL as ot,a$ as zt,aM as Dt,ae as Ht,bb as Qt,U as Zt,u as yt,bc as Yt,a_ as Jt,k as nt,S as gt,P as te,W as ee,H as ae,ab as K,an as oe,bp as ne,s as se,G as re,aq as tt,b0 as bt}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ie=t=>t-Math.floor(t),Q=t=>ie(Math.sin(t*127.1+311.7)*43758.5453123);function ft(t){const n=Math.floor(t),o=t-n,e=o*o*(3-2*o);return Q(n)*(1-e)+Q(n+1)*e}function mt(t=1){let n=t*2654435761>>>0||1;return()=>(n=n*1664525+1013904223>>>0)/4294967296}function ce(t,n=!1,o=12){const e=t.length;if(e<3)return t.slice();const c=r=>n?t[(r+e)%e]:t[Math.max(0,Math.min(e-1,r))],s=[],a=n?e:e-1;for(let r=0;r<a;r++){const f=c(r-1),v=c(r),u=c(r+1),i=c(r+2),l=(p,F)=>Math.pow(Math.hypot(F[0]-p[0],F[1]-p[1])||1e-6,.5),h=0,d=h+l(f,v),g=d+l(v,u),m=g+l(u,i);for(let p=0;p<o;p++){const F=d+(g-d)*p/o,b=(A,y,C,q)=>{const B=(F-C)/(q-C||1e-6);return[A[0]+(y[0]-A[0])*B,A[1]+(y[1]-A[1])*B]},R=b(f,v,h,d),S=b(v,u,d,g),w=b(u,i,g,m),x=b(R,S,h,g),P=b(S,w,d,m);s.push(b(x,P,d,g))}}return s.push(n?[...t[0]]:[...t[e-1]]),s}function Te(t,n=.12,o=2){let e=t;for(let c=0;c<o;c++){const s=[e[0]];for(let a=0;a<e.length-1;a++){const r=e[a],f=e[a+1];s.push([r[0]+(f[0]-r[0])*n,r[1]+(f[1]-r[1])*n],[r[0]+(f[0]-r[0])*(1-n),r[1]+(f[1]-r[1])*(1-n)])}s.push(e[e.length-1]),e=s}return e}const Gt=t=>{let n=0;for(let o=1;o<t.length;o++)n+=Math.hypot(t[o][0]-t[o-1][0],t[o][1]-t[o-1][1]);return n};function Mt(t,n){const o=Gt(t);if(o<1e-6)return[t[0],t[0]];const e=Math.max(2,Math.ceil(o/n)+1),c=o/(e-1),s=[[...t[0]]];let a=0,r=0,f=Math.hypot(t[1][0]-t[0][0],t[1][1]-t[0][1]);for(let v=1;v<e-1;v++){const u=v*c;for(;u>r+f&&a<t.length-2;)r+=f,a++,f=Math.hypot(t[a+1][0]-t[a][0],t[a+1][1]-t[a][1]);const i=f>0?(u-r)/f:0;s.push([t[a][0]+(t[a+1][0]-t[a][0])*i,t[a][1]+(t[a+1][1]-t[a][1])*i])}return s.push([...t[t.length-1]]),s}function le(t,n){const o=Gt(t),e=[];for(let c=0;c<n;c++)e.push(Ut(t,o*c/(n-1)).p);return e}function ke(t,n,o,{turns:e=9,seed:c=1}={}){const s=mt(c),a=[];let r=s()*6.28,f=o*.5;for(let v=0;v<e*10;v++)r+=.55+s()*.5,f+=(s()-.5)*o*.35,f=Math.max(o*.15,Math.min(o,f)),a.push([t+Math.cos(r)*f*(1+(s()-.5)*.2),n+Math.sin(r)*f*.85]);return a}function Re(t,n,o,e,c=.22){const s=[];for(let a=0;a<e;a++){const r=a/e*Math.PI*2,f=Math.PI*2/e;for(const[v,u]of[[0,1],[.12,1+c],[.42,1+c],[.54,1]])s.push([t+Math.cos(r+v*f)*o*u,n+Math.sin(r+v*f)*o*u])}return s}function Ut(t,n){let o=0;for(let e=1;e<t.length;e++){const c=t[e-1],s=t[e],a=Math.hypot(s[0]-c[0],s[1]-c[1]);if(o+a>=n||e===t.length-1){const r=a>0?Math.max(0,Math.min(1,(n-o)/a)):0;return{p:[c[0]+(s[0]-c[0])*r,c[1]+(s[1]-c[1])*r],t:a>0?[(s[0]-c[0])/a,(s[1]-c[1])/a]:[1,0]}}o+=a}return{p:t[0],t:[1,0]}}function At(t,n,o,e,{start:c=2.4,dir:s=-1,n:a=14,rot:r=0,lop:f=.06,seed:v=1}={}){const u=[],i=Math.cos(r),l=Math.sin(r);for(let h=0;h<a;h++){const d=c+s*h/a*Math.PI*2,g=1+(ft(h*.9+v*7.3)-.5)*2*f,m=Math.cos(d)*o*g,p=Math.sin(d)*e*g;u.push([t+m*i-p*l,n+m*l+p*i])}return u}function qe(t,n,o,e,c,{tip:s=.62,round:a=1,seed:r=1}={}){const f=Math.cos(o),v=Math.sin(o),u=c/2,i=h=>1+(Q(r*13.1+h)-.5)*.12;return[[0,0],[e*.22,-u*.55*i(1)],[e*s,-u*i(2)],[e*(.9+.02*a),-u*.55*i(3)],[e,0],[e*(.9+.02*a),u*.55*i(4)],[e*s,u*i(5)],[e*.22,u*.55*i(6)]].map(([h,d])=>[t+h*f-d*v,n+h*v+d*f])}function Be(t,n,o,e,c,{bend:s=.12,seed:a=1}={}){const r=Math.cos(o),f=Math.sin(o),v=c/2,u=l=>1+(Q(a*7.7+l)-.5)*.14;return[[0,0],[e*.25,-v*.8*u(1)+s*e*.3],[e*.55,-v*u(2)+s*e*.45],[e*.85,-v*.5*u(3)+s*e*.3],[e,s*e*.1],[e*.82,v*.55*u(4)+s*e*.32],[e*.5,v*u(5)+s*e*.42],[e*.2,v*.7*u(6)+s*e*.2]].map(([l,h])=>[t+l*r-h*f,n+l*f+h*r])}function Ft(t,n,o,e,c,{turns:s=1.1,dir:a=1}={}){const r=[];for(let m=0;m<=18;m++){const p=m/18;r.push([t+Math.cos(o+a*p*.35)*e*p,n+Math.sin(o+a*p*.35)*e*p])}const[v,u]=r[r.length-1],i=o+a*.35,l=v+Math.cos(i+a*Math.PI/2)*c,h=u+Math.sin(i+a*Math.PI/2)*c,d=Math.atan2(u-h,v-l),g=24;for(let m=1;m<=g;m++){const p=m/g,F=c*(1-p*.55),b=d+a*p*s*Math.PI*2;r.push([l+Math.cos(b)*F,h+Math.sin(b)*F])}return r}function Le(t,n,o,e,{over:c=.03,skew:s=.006,seed:a=1}={}){const r=mt(a),f=()=>(r()-.5)*2*s,v=t-o/2,u=t+o/2,i=n-e/2,l=n+e/2,h=()=>c*(.6+r()*.8);return[[[v-h(),l+f()],[u+h(),l+f()]],[[u+f(),l+h()],[u+f(),i-h()]],[[u+h(),i+f()],[v-h(),i+f()]],[[v+f(),i-h()],[v+f(),l+h()]]]}function Ee(t,n,o,e,c,{ang:s=.5,seed:a=1,loose:r=.25}={}){const f=mt(a),v=Math.cos(s),u=Math.sin(s),i=Math.abs(o*v)+Math.abs(e*u),l=Math.abs(o*u)+Math.abs(e*v),h=Math.ceil(l/c)+1,d=[];for(let g=0;g<=h;g++){const m=-l/2+g*c+(f()-.5)*c*r,F=(g%2?1:-1)*(i/2+c*(.2+f()*.4));d.push([t+F*v-m*u,n+F*u+m*v])}return d}const rt="#f4f1ea",Ot="#1c1b1a",st={ink:Ot,orange:"#f3a43a",dot:"#d9531f",stem:"#3c9d58",leaf:"#2e8f8a",leaf2:"#2b6aa0",leafLine:"#24694a",bee:"#f7b733",sky:"#9ccbea",pink:"#f4a3b8",yellow:"#f7d84f",red:"#e4553b",lilac:"#b9a4ea",mint:"#8fd9b6",grey:"#9a968f",white:"#fffdf8"},et=new O(rt);function at(t,n=new O){const o=typeof t=="string"?new O(t):t;return n.setRGB(Math.min(1,o.r/et.r),Math.min(1,o.g/et.g),Math.min(1,o.b/et.b))}const ze=(t,n)=>"#"+new O(t).lerp(new O(rt),n).getHexString(),xt={uBoil:{value:0},uWidth:{value:1},uPaperLin:{value:et}};function ue(t){xt.uBoil.value=Math.floor(t*12)%251}const wt=.022,J=`
  float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float n11(float x){ float i = floor(x), f = fract(x); return mix(h11(i), h11(i + 1.), f * f * (3. - 2. * f)); }
  float n21(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), u.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), u.x), u.y); }`,_t=24,It=()=>({value:Array.from({length:_t},()=>new H(0,0,0,1))}),Vt=`
  vec3 bend(vec3 p, vec4 b){
    if (abs(b.w) < .5) return p;
    float u = (p.x - b.x) * b.w, a = b.y, k = b.z, th = a + k * u, X, Z;
    if (abs(k) < 1e-3) { X = u * cos(a); Z = u * sin(a); }
    else { X = (sin(th) - sin(a)) / k; Z = (cos(a) - cos(th)) / k; }
    return vec3(b.x + (X - sin(th) * p.z) * b.w, p.y, Z + cos(th) * p.z);
  }`,Nt=`
  uniform vec4 uXf[${_t}];
  vec2 xfPos(vec2 p, float g){ vec4 X = uXf[int(g + .5)]; float c = cos(X.z), s = sin(X.z); return mat2(c, s, -s, c) * (p * X.w) + X.xy; }
  vec2 xfDir(vec2 d, float g){ vec4 X = uXf[int(g + .5)]; float c = cos(X.z), s = sin(X.z); return mat2(c, s, -s, c) * d; }
  ${Vt}
  uniform vec4 uBend;
  vec3 bendP(vec3 p){ return bend(p, uBend); }`;function Xt(t,n){return t.transparent=!0,t.depthWrite=!1,t.side=Bt,n?(t.blending=Yt,t):(Object.assign(t,{blending:Dt,blendEquation:Jt,blendSrc:zt,blendDst:ot,blendSrcAlpha:ot,blendDstAlpha:Et}),t)}let fe=1;function vt(t){const n=t.w??wt,o=t.seed??fe++*.618,e=!!t.closed;let c=t.smooth===!1?t.pts.map(v=>[v[0],v[1]]):ce(t.pts,e,12);t.smooth===!1&&e&&c.push([c[0][0],c[0][1]]);const s=t.ds??Math.max(.0012,Math.min(n*.38,.018));let a=Mt(c,s);const r=(t.over??(e?1.6:0))*n;if(r>0&&a.length>2)if(e){const v=Math.hypot(a[1][0]-a[0][0],a[1][1]-a[0][1])||1e-4,u=Math.min(a.length-2,Math.ceil(r/v));for(let i=1;i<=u;i++){const l=a[i],h=a[i+1]??a[i],d=h[0]-a[i-1][0],g=h[1]-a[i-1][1],m=Math.hypot(d,g)||1,p=i/u;a.push([l[0]-g/m*n*.45*p*(Q(o)>.5?1:-1),l[1]+d/m*n*.45*p*(Q(o)>.5?1:-1)])}}else{const v=a[0],u=a[1],i=a[a.length-1],l=a[a.length-2],h=Math.hypot(v[0]-u[0],v[1]-u[1])||1,d=Math.hypot(i[0]-l[0],i[1]-l[1])||1;a=Mt([[v[0]+(v[0]-u[0])/h*r,v[1]+(v[1]-u[1])/h*r],...a,[i[0]+(i[0]-l[0])/d*r,i[1]+(i[1]-l[1])/d*r]],s)}const f=(t.wob??.5)*n;if(f>0){let v=0;const u=Math.max(n*11,.07),i=[];for(let l=0;l<a.length;l++){l&&(v+=Math.hypot(a[l][0]-a[l-1][0],a[l][1]-a[l-1][1]));const h=a[Math.max(0,l-1)],d=a[Math.min(a.length-1,l+1)],g=d[0]-h[0],m=d[1]-h[1],p=Math.hypot(g,m)||1,F=(ft(v/u+o*9.1)-.5)*2+(ft(v/(u*.28)+o*3.3)-.5)*.5;i.push([a[l][0]-m/p*f*F,a[l][1]+g/p*f*F])}a=i}return a}const ve=`
  ${J}
  ${Nt}
  attribute vec4 aA;
  attribute vec4 aB;
  attribute vec4 aC;
  attribute vec3 aCol; attribute float aGrp; attribute vec4 aAlt;
  uniform float uBoil, uWidth, uDraw, uBoilAmp, uLinear, uMorph;
  varying vec3 vCol; varying vec4 vS; varying vec3 vE;
  void main(){
    float q = clamp((uDraw - aC.x) / max(aC.y - aC.x, 1e-5), 0., 1.);
    if (q <= 0.) { gl_Position = vec4(0., 0., 2., 1.); return; }
    float s = aA.x, L = aA.y, hw = aA.z * uWidth, seed = aA.w;

    float end = uLinear > .5 ? L * q : q >= 1. ? L + 1. : L * mix(q, q * q * (3. - 2. * q), .55);
    vec2 n = xfDir(normalize(mix(aB.xy, aAlt.zw, uMorph) + 1e-5), aGrp), t = vec2(n.y, -n.x);
    float pad = hw * 1.5 + .0015;

    float f = uBoil * 3.71 + seed * 17.3, amp = hw * uBoilAmp * aC.w;
    vec2 c = xfPos(mix(position.xy, aAlt.xy, uMorph), aGrp);
    c += n * (n11(s * 5.5 + f) - .5) * 2. * amp + (vec2(h11(f), h11(f + 5.3)) - .5) * amp * .8;
    c += t * aB.w * pad;
    vCol = aCol; vS = vec4(s + aB.w * pad, aB.z * pad, hw, min(end, L)); vE = vec3(aC.z, seed, end);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bendP(vec3(c + n * aB.z * pad, position.z)), 1.);
  }`,he=`
  ${J}
  uniform float uBoil, uOpacity; uniform vec2 uTail; uniform vec3 uPaperLin;
  varying vec3 vCol; varying vec4 vS; varying vec3 vE;
  void main(){
    float s = vS.x, a = vS.y, hw = vS.z, e = vS.w, seed = vE.y;

    float w = hw * (1. + .2 * (n11(s / (hw * 7.) + seed * 5. + uBoil * .73) - .5) + .18 * exp(-max(s, 0.) / (hw * 2.4)));
    float lo = uTail.x > 0. ? max(e - uTail.y, 0.) : -1e5;
    float ds = s < lo ? lo - s : (s > e ? s - e : 0.);
    if (vE.x > 0.) { float P = vE.x, u = mod(s, P), on = P * .5; ds = max(ds, u > on ? min(u - on, P - u) : 0.); }
    float d = length(vec2(ds, a));
    float aa = max(fwidth(d), 1e-6) * .75;
    float cov = smoothstep(w + aa, w - aa, d) * uOpacity;
    if (uTail.x > 0.) cov *= smoothstep(lo, lo + uTail.y * .45, s);
    if (cov < .002) discard;
    float grain = n21(vec2(s / (hw * 1.3), a / (hw * .55)) + seed * 3.1) - .5;
    vec3 ink = clamp(vCol * (1. + grain * .12), 0., 1.);
    #ifdef PAINT
      gl_FragColor = vec4(uPaperLin * ink, cov);
    #else
      gl_FragColor = vec4(mix(vec3(1.), ink, cov), 1.);
    #endif
  }`;function ht(t,{paint:n=!1,boil:o=1,moving:e=!1}={}){const c=t.map(x=>vt(x)),s=t.map((x,P)=>x.alt?le(vt({...x,pts:x.alt}),c[P].length):c[P]);let a=0;for(const x of c)a+=x.length+2;const r=a*2,f=new Float32Array(r*3),v=new Float32Array(r*4),u=new Float32Array(r*4),i=new Float32Array(r*4),l=new Float32Array(r*3),h=new Float32Array(r),d=new Float32Array(r*4),g=[],m=new O;let p=0;const F=(x,P)=>{const A=x[Math.max(0,P-1)],y=x[Math.min(x.length-1,P+1)],C=y[0]-A[0],q=y[1]-A[1],B=Math.hypot(C,q)||1;return[-q/B,C/B]};t.forEach((x,P)=>{const A=c[P],y=s[P],C=A.length,q=(x.w??wt)/2,B=x.seed??P*.618+1.3,_=x.z??0;at(x.color??Ot,m);const L=[0];for(let M=1;M<C;M++)L.push(L[M-1]+Math.hypot(A[M][0]-A[M-1][0],A[M][1]-A[M-1][1]));const X=L[C-1],W=p,G=(M,E,j)=>{const[z,I]=F(A,M),[T,k]=F(y,M);f.set([A[M][0],A[M][1],_],p*3),v.set([L[M],X,q,B],p*4),u.set([z,I,E,j],p*4),d.set([y[M][0],y[M][1],T,k],p*4),i.set([x.t0??0,x.t1??1,x.dash??0,x.boil??1],p*4),l.set([m.r,m.g,m.b],p*3),h[p]=x.grp??0,p++};G(0,-1,-1),G(0,1,-1);for(let M=0;M<C;M++)G(M,-1,0),G(M,1,0);G(C-1,-1,1),G(C-1,1,1);for(let M=0;M<C+1;M++){const E=W+M*2;g.push(E,E+1,E+2,E+1,E+3,E+2)}});const b=new Lt;b.setAttribute("position",new V(f,3)),b.setAttribute("aA",new V(v,4)),b.setAttribute("aB",new V(u,4)),b.setAttribute("aC",new V(i,4)),b.setAttribute("aCol",new V(l,3)),b.setAttribute("aGrp",new V(h,1)),b.setAttribute("aAlt",new V(d,4)),b.setIndex(r>65535?new Kt(g,1):new $t(g,1)),b.computeBoundingSphere(),b.boundingSphere&&(b.boundingSphere.radius+=.08);const R={...xt,uDraw:{value:1},uBoilAmp:{value:.5*o},uOpacity:{value:1},uTail:{value:new $(0,0)},uLinear:{value:0},uXf:It(),uBend:{value:new H},uMorph:{value:0}},S=Xt(new Z({uniforms:R,vertexShader:ve,fragmentShader:he,defines:n?{PAINT:1}:{}}),n),w=new Y(b,S);return w.frustumCulled=!e,{mesh:w,U:R,set(x){R.uDraw.value=x},dispose(){b.dispose(),S.dispose()}}}const pe={oval:0,leaf:1,petal:2,box:3,tex:4},de=`
  ${J}
  ${Nt}
  attribute vec2 aQ; attribute vec2 aCtr; attribute vec4 aShape; attribute vec4 aF; attribute vec4 aG;
  attribute vec3 aCol; attribute vec3 aCol2; attribute vec3 aCol3; attribute vec4 aUV; attribute float aGrp;
  uniform float uDraw, uBoil;
  varying vec2 vQ; varying vec4 vShape; varying vec4 vF; varying vec4 vG; varying vec3 vCol; varying vec3 vCol2; varying vec3 vCol3; varying vec4 vUV;
  float backOut(float x){ float y = x - 1.; return 1. + 2.70158 * y * y * y + 1.70158 * y * y; }
  void main(){
    float q = clamp((uDraw - aF.x) / max(aF.y - aF.x, 1e-5), 0., 1.);
    if (q <= 0.) { gl_Position = vec4(0., 0., 2., 1.); return; }
    float sc = aF.w < .5 ? backOut(q) : 1.;
    float f = uBoil * 2.31 + aF.z * 11.7;
    vec2 jb = (vec2(h11(f), h11(f + 3.1)) - .5) * aG.w * .8;
    vec2 p = xfPos(aCtr + (position.xy - aCtr) * sc + jb, aGrp);
    vQ = aQ; vShape = aShape; vF = vec4(q, aF.z, aG.x, aF.w); vG = aG; vCol = aCol; vCol2 = aCol2; vCol3 = aCol3; vUV = aUV;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bendP(vec3(p, position.z)), 1.);
  }`,me=`
  ${J}
  uniform float uBoil, uOpacity, uTexRange; uniform sampler2D uTex; uniform vec3 uPaperLin; uniform vec4 uTint; uniform vec3 uTint2;
  varying vec2 vQ; varying vec4 vShape; varying vec4 vF; varying vec4 vG; varying vec3 vCol; varying vec3 vCol2; varying vec3 vCol3; varying vec4 vUV;
  float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
  float shapeD(vec2 q){
    float k = vShape.x; vec2 hs = vShape.yz * .5;
    if (k < .5) return (length(q / hs) - 1.) * min(hs.x, hs.y);
    if (k < 1.5) { float x = clamp(q.x / hs.x, -1., 1.);
      return max(abs(q.y) - hs.y * pow(max(1. - x * x, 0.), .72), abs(q.x) - hs.x); }
    if (k < 2.5) return (length(vec2(q.x / hs.x, q.y / (hs.y * (.6 + .4 * clamp(q.x / hs.x, -1., 1.))))) - 1.) * min(hs.x, hs.y);
    if (k < 3.5) return sdBox(q, hs, vShape.w);
    return (.5 - texture2D(uTex, mix(vUV.xy, vUV.zw, q / vShape.yz + .5)).r) * uTexRange;
  }
  void main(){
    vec2 q = vQ, hs = vShape.yz * .5;
    float R = max(hs.x, hs.y), seed = vF.y, prog = vF.x;
    float d = shapeD(q) + (n21(q / R * 2.1 + seed * 7.1 + uBoil * 1.31) - .5) * vG.w;
    float aa = max(fwidth(d), 1e-6) * .8;
    float inside = smoothstep(aa, -aa, d);
    if (inside < .002) discard;

    float ang = vF.z, cs = cos(ang), sn = sin(ang);
    vec2 r = vec2(cs * q.x + sn * q.y, -sn * q.x + cs * q.y);
    float P = max(vG.x, 1.), Rr = length(hs), gap = 2. * Rr / P;
    float u = r.y / gap + P * .5, v = r.x / Rr * .5 + .5, au = fwidth(u) * .8;
    float cnt = 0., alt = 0.;
    for (int o = -1; o <= 1; o++) {
      float k = floor(u) + float(o);
      float c = k + .5 + (h11(k * 3.7 + seed) - .5) * .18 + (n11(v * 3.2 + k * 1.7 + seed) - .5) * .16;
      float hw = .66 + (h11(k * 5.3 + seed) - .5) * .12;
      float on = smoothstep(hw + au, hw - au, abs(u - c));
      if (vF.w > .5) {
        float pk = clamp(prog * (P + 2.) - k, 0., 1.), vv = mod(k, 2.) < 1. ? v : 1. - v;
        on *= smoothstep(pk + .015, pk - .015, vv) * step(.001, pk);
      }
      cnt += on;
      alt += on * step(.5, fract(k * .5 + .25));
    }
    vec3 pass = mix(uTint.w > .5 ? uTint.rgb : vCol, uTint.w > .5 ? uTint2 : vCol2, clamp(alt / max(cnt, 1e-3), 0., 1.));
    vec3 filt = mix(vec3(1.), pass, min(cnt, 1.)) * mix(vec3(1.), pass, clamp(cnt - 1., 0., 1.) * .6);
    float fib = n21(vec2(v * 26., u * 7.) + seed) - .5;
    filt = clamp(filt * (1. + fib * .07 * cnt), 0., 1.);

    if (vG.z > 0.) {
      vec2 cell = floor(q / vG.z);
      vec2 ctr = (cell + .5 + (vec2(h21(cell + seed), h21(cell + seed + 7.1)) - .5) * .5) * vG.z;
      float rr = vG.z * (.12 + .08 * h21(cell + 3.3)), dd = length(q - ctr), ad = fwidth(dd) * .8;
      float has = step(h21(cell + 11.3 + seed), .45) * step(.35 + .6 * h21(cell + 5.7), prog) * step(-.6 * vG.z, -d);
      filt *= mix(vec3(1.), vCol3, smoothstep(rr + ad, rr - ad, dd) * has);
    }
    #ifdef PAINT
      gl_FragColor = vec4(uPaperLin * filt, inside * uOpacity);
    #else
      gl_FragColor = vec4(mix(vec3(1.), filt, inside * uOpacity), 1.);
    #endif
  }`;function Pt(t,{tex:n=null,range:o=.1,paint:e=!1,moving:c=!1,grid:s=1}={}){const a=s+1,r=a*a,f=t.length*r,v=new Float32Array(f*3),u=new Float32Array(f*2),i=new Float32Array(f*2),l=new Float32Array(f*4),h=new Float32Array(f*4),d=new Float32Array(f*4),g=new Float32Array(f*3),m=new Float32Array(f*3),p=new Float32Array(f*3),F=new Float32Array(f*4),b=new Float32Array(f),R=[],S=new O;t.forEach((y,C)=>{const[q,B]=y.at,[_,L]=y.size,X=y.rot??0,W=Math.cos(X),G=Math.sin(X),M=1.18,E=y.seed??C*.731+.37,j=y.wob??Math.min(_,L)*.05;for(let z=0;z<r;z++){const I=z%a/s,T=Math.floor(z/a)/s,k=C*r+z,it=(I-.5)*(_*M+2*j),ct=(T-.5)*(L*M+2*j);v.set([q+it*W-ct*G,B+it*G+ct*W,y.z??0],k*3),u.set([it,ct],k*2),i.set([q,B],k*2),l.set([pe[y.kind],_,L,y.round??Math.min(_,L)*.12],k*4),h.set([y.t0??0,y.t1??1,E,y.scribble?1:0],k*4),d.set([y.ang??.6,y.passes??5,y.dots?y.dot??Math.min(_,L)*.13:0,j],k*4),at(y.color,S),g.set([S.r,S.g,S.b],k*3),at(y.color2??y.color,S),m.set([S.r,S.g,S.b],k*3),at(y.dots??st.dot,S),p.set([S.r,S.g,S.b],k*3),F.set(y.uv??[0,0,1,1],k*4),b[k]=y.grp??0}for(let z=0;z<s;z++)for(let I=0;I<s;I++){const T=C*r+z*a+I;R.push(T,T+1,T+a,T+1,T+a+1,T+a)}});const w=new Lt;w.setAttribute("position",new V(v,3));for(const[y,C,q]of[["aQ",u,2],["aCtr",i,2],["aShape",l,4],["aF",h,4],["aG",d,4],["aCol",g,3],["aCol2",m,3],["aCol3",p,3],["aUV",F,4],["aGrp",b,1]])w.setAttribute(y,new V(C,q));w.setIndex(R),w.computeBoundingSphere(),w.boundingSphere&&(w.boundingSphere.radius*=1.25);const x={...xt,uDraw:{value:1},uOpacity:{value:1},uTex:{value:n},uTexRange:{value:o},uXf:It(),uBend:{value:new H},uTint:{value:new H(1,1,1,0)},uTint2:{value:new O(1,1,1)}},P=Xt(new Z({uniforms:x,vertexShader:de,fragmentShader:me,defines:e?{PAINT:1}:{}}),e),A=new Y(w,P);return A.frustumCulled=!c,{mesh:A,U:x,set(y){x.uDraw.value=y},dispose(){w.dispose(),P.dispose()}}}const xe=`
  ${Vt}
  uniform vec4 uBend; varying vec3 vW; varying float vTurn; varying vec2 vLoc;
  void main(){
    vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vLoc = position.xy;
    vTurn = uBend.y + uBend.z * (position.x - uBend.x) * uBend.w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bend(position, uBend), 1.);
  }`,we=`
  ${J}
  uniform vec3 uPaper; uniform vec2 uOff, uHalf; uniform vec4 uSmudge[4]; uniform float uTone, uLit, uEdge;
  varying vec3 vW; varying float vTurn; varying vec2 vLoc;
  void main(){
    vec2 p = vW.xy + uOff;
    float px = max(fwidth(p.x), fwidth(p.y));
    float tooth = (n21(p * 190.) - .5) * (1. - smoothstep(.0035, .008, px)) + (n21(p * 61. + 4.) - .5) * .6;
    vec2 fp = mat2(.82, .57, -.57, .82) * p;
    float fib = (n21(fp * vec2(22., 240.)) - .5) * (1. - smoothstep(.002, .006, px)) + (n21(fp * vec2(7., 70.) + 2.) - .5) * .7;
    float mott = n21(p * 2.1 + 9.) * .6 + n21(p * 5.3 + 1.) * .4 - .5;
    vec3 col = uPaper * (1. + tooth * .045 + fib * .022 + mott * .035);
    for (int i = 0; i < 4; i++) {
      vec4 s = uSmudge[i]; if (s.w <= 0.) continue;
      vec2 d = (p - s.xy) / s.z;
      float g = exp(-dot(d, d) * 2.2) * (.75 + .5 * n21(p / s.z * vec2(9., 2.)));
      col *= 1. - g * s.w;
    }

    float lit = mix(1., .78 + .22 * abs(cos(vTurn)), uLit) * (gl_FrontFacing ? 1. : .95);
    if (uEdge > 0.) {
      vec2 e = uHalf - abs(vLoc); float d = min(e.x, e.y), px = fwidth(d);
      lit *= 1. - .3 * smoothstep(px * 1.5, 0., d - px) - .06 * exp(-d / .03);
    }
    gl_FragColor = vec4(col * uTone * lit, 1.);
  }`;function De(t,n,{off:o=[0,0],smudges:e=[],color:c=rt,segs:s=1}={}){const a={uPaper:{value:new O(c)},uOff:{value:new $(o[0],o[1])},uTone:{value:1},uSmudge:{value:Array.from({length:4},(v,u)=>new H(...e[u]??[0,0,1,0]))},uBend:{value:new H},uLit:{value:0},uEdge:{value:0},uHalf:{value:new $(t/2,n/2)}},r=new Z({uniforms:a,vertexShader:xe,fragmentShader:we,side:Bt}),f=new Y(new dt(t,n,s,1),r);return f.renderOrder=-100,{mesh:f,U:a,dispose(){f.geometry.dispose(),r.dispose()}}}function Ct(t,n,o,e,c){let s=0;e[0]=0,c[0]=-1/0,c[1]=1/0;for(let a=1;a<n;a++){let r=(t[a]+a*a-(t[e[s]]+e[s]*e[s]))/(2*a-2*e[s]);for(;r<=c[s];)s--,r=(t[a]+a*a-(t[e[s]]+e[s]*e[s]))/(2*a-2*e[s]);s++,e[s]=a,c[s]=r,c[s+1]=1/0}s=0;for(let a=0;a<n;a++){for(;c[s+1]<a;)s++;o[a]=(a-e[s])*(a-e[s])+t[e[s]]}}function St(t,n,o,e){const s=new Float64Array(n*o),a=Math.max(n,o),r=new Float64Array(a),f=new Float64Array(a),v=new Int32Array(a),u=new Float64Array(a+1);for(let i=0;i<n*o;i++)s[i]=t[i]===e?0:1e20;for(let i=0;i<n;i++){for(let l=0;l<o;l++)r[l]=s[l*n+i];Ct(r,o,f,v,u);for(let l=0;l<o;l++)s[l*n+i]=f[l]}for(let i=0;i<o;i++){for(let l=0;l<n;l++)r[l]=s[i*n+l];Ct(r,n,f,v,u);for(let l=0;l<n;l++)s[i*n+l]=Math.sqrt(f[l])}return s}function Ge(t,n=24){const o=t.width,e=t.height,c=t.getContext("2d").getImageData(0,0,o,e).data,s=new Uint8Array(o*e);for(let i=0;i<o*e;i++)s[i]=c[i*4]>127?1:0;const a=St(s,o,e,1),r=St(s,o,e,0),f=new Uint8Array(o*e),v=new Float32Array(o*e);for(let i=0;i<e;i++)for(let l=0;l<o;l++){const h=i*o+l,d=s[h]?r[h]-.5:-(a[h]-.5);v[h]=d,f[(e-1-i)*o+l]=Math.max(0,Math.min(255,Math.round((.5+d/(2*n))*255)))}const u=new Ht(f,o,e,Qt,Zt);return u.flipY=!1,u.minFilter=yt,u.magFilter=yt,u.generateMipmaps=!1,u.needsUpdate=!0,{tex:u,spread:n,inside:s,sd:v,W:o,H:e}}const ye="varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",ge=`
  uniform vec2 uHalf; uniform float uSoft, uAmt, uRound; varying vec2 vP;
  void main(){
    vec2 q = abs(vP) - uHalf + uRound; float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRound;
    gl_FragColor = vec4(vec3(1. - uAmt * (1. - smoothstep(-uSoft, uSoft, d))), 1.);
  }`;function Ue(t,n,{soft:o=.06,amt:e=.2,round:c=.02}={}){const s={uHalf:{value:new $(t/2,n/2)},uSoft:{value:o},uAmt:{value:e},uRound:{value:c}},a=new Z({uniforms:s,vertexShader:ye,fragmentShader:ge,transparent:!0,depthWrite:!1,blending:Dt,blendSrc:zt,blendDst:ot,blendSrcAlpha:ot,blendDstAlpha:Et}),r=new Y(new dt(t+o*5,n+o*5),a);return r.renderOrder=2,{mesh:r,U:s,dispose(){r.geometry.dispose(),a.dispose()}}}const Wt=30,pt=Math.tan(se.degToRad(Wt/2)),be=t=>t/(2*pt),Me=be(2),Oe=(t,n)=>({h:2*pt*t,w:2*pt*t*n}),_e=t=>t<.9,Ae="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",Fe=`
  uniform sampler2D tWorld; uniform vec2 uRes; uniform float uKeep, uCa;
  varying vec2 vUv;

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


    vec2 d = (vUv - .5) * uCa;
    vec3 c = vec3(texture2D(tWorld, vUv - d).r, texture2D(tWorld, vUv).g, texture2D(tWorld, vUv + d).b);
    float vig = smoothstep(1.25, .35, length((vUv - .5) * vec2(uRes.x / uRes.y, 1.)));
    float post = .45 + .55 * vig;
    gl_FragColor = vec4(invNeutral(max(c * mix(1., post, uKeep), 0.)) / post, 1.);
  }`;function Ie(t){const n=new gt,o=new te(Wt,t.viewport.aspect,.05,200);o.position.set(0,0,Me);const e=new ee(2,2,{type:ae,samples:t.quality?4:0,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),c={tWorld:{value:e.texture},uRes:{value:new $(2,2)},uKeep:{value:.3},uCa:{value:.0025}},s=new Z({vertexShader:Ae,fragmentShader:Fe,uniforms:c,depthTest:!1,depthWrite:!1}),a=new Y(new dt(2,2),s);a.frustumCulled=!1;const r=new gt;r.add(a);const f=new O(rt),v=new O;function u(){const h=Math.max(2,Math.round(t.viewport.width*t.viewport.dpr)),d=Math.max(2,Math.round(t.viewport.height*t.viewport.dpr));(e.width!==h||e.height!==d)&&e.setSize(h,d),c.uRes.value.set(h,d),o.aspect=t.viewport.aspect,o.updateProjectionMatrix()}function i(h,d=n,g=o){const m=t.renderer,p=m.getRenderTarget(),F=m.getClearAlpha();m.getClearColor(v),m.setRenderTarget(h),m.setClearColor(f,1),m.clear(!0,!0,!0),m.render(d,g),m.setRenderTarget(p),m.setClearColor(v,F)}async function l(...h){const d=t.renderer,g=d.getRenderTarget();d.setRenderTarget(e),await Promise.all([[n,o],...h].map(([m,p])=>d.compileAsync(m,p).catch(()=>{}))),d.setRenderTarget(g);for(const m of[n,...h.map(p=>p[0])])m.traverse(p=>{const F=p.material;for(const b of Object.values(F?.uniforms??{})){const R=b?.value;R?.isTexture&&!R.isRenderTargetTexture&&R.image&&!R.isVideoTexture&&d.initTexture(R)}});for(const[m,p]of h)i(e,m,p);i(e)}return u(),{scene:r,world:n,camera:o,rt:e,U:c,resize:u,draw:i,warm:l,render:(h,d)=>i(e,h,d),speed(h){c.uCa.value=.0025+Math.min(Math.abs(h),4)*.006*.65},dispose(){e.dispose(),s.dispose(),a.geometry.dispose()}}}const jt=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,D={x:0,y:0,t:-1};function Ve(t,n,o){if(D.t!==n){D.t=n;const e=t.pointer.inside&&!jt;D.x=K(D.x,e?t.pointer.x:0,2.6,o),D.y=K(D.y,e?t.pointer.y:0,2.6,o),ue(n)}return D}function Ne(t,n,o,e,c=1,s=0){const a=e*.022*c;t.position.set(n+D.x*a,o+D.y*a*.7,e),t.up.set(0,1,0),t.lookAt(n+D.x*a*.45,o+D.y*a*.7*.45,0),t.rotateZ(-D.x*.01*c+s)}const lt=new nt;function Xe(t,n,o){const e=t.pointer.inside&&!jt;return e&&Pe(n,t.pointer.x,t.pointer.y,o,lt),{x:lt.x,y:lt.y,on:e}}const Tt=new oe,kt=new $,Rt=new ne,qt=new nt;function Pe(t,n,o,e=0,c=new nt){return t.updateMatrixWorld(),kt.set(n,o),Tt.setFromCamera(kt,t),Rt.set(new nt(0,0,1),-e),Tt.ray.intersectPlane(Rt,qt)?c.copy(qt):c.set(0,0,e)}function We(t,n=11,o=.32){if(t<=0)return 0;const e=n*Math.sqrt(1-o*o);return 1-Math.exp(-o*n*t)*(Math.cos(e*t)+o*n/e*Math.sin(e*t))}function je(){const t=new URLSearchParams(location.search).get("intro");let n=-1,o=-1,e=0;return(c,s)=>t!==null?Number(t):(o<0&&(o=c),n<0&&(e=s<.04?e+1:0,(e>=8||c-o>2.5)&&(n=c)),n<0?0:c-n)}const Ke=()=>new Promise(t=>requestAnimationFrame(()=>t(0)));async function $e(t){try{await Promise.race([Promise.all(t.map(n=>document.fonts.load(n))),new Promise(n=>setTimeout(n,2500))])}catch{}}const U={cx:-.04,cy:0,rx:.42,ry:.3},Ce=t=>U.ry*Math.sqrt(Math.max(0,1-((t-U.cx)/U.rx)**2)),ut=[{at:[-.13,.25],tilt:.5,rx:.12,ry:.2},{at:[.03,.27],tilt:.12,rx:.1,ry:.17}];function He({size:t=.17,z:n=.3}={}){const e=new re,c=Pt([{kind:"oval",at:[U.cx+.02,U.cy-.015],size:[U.rx*2,U.ry*2],color:st.bee,color2:"#f2a23a",passes:3,ang:1.25,wob:.02},{kind:"oval",at:[.27,.08],size:[.075,.09],color:st.ink,passes:1,wob:.004}],{paint:!0,moving:!0}),s=w=>{const x=Ce(w)-.035;return{pts:[[w-.012,x],[w+.03,0],[w-.01,-x]],w:.12,wob:.1,boil:.6}},a=ht([s(-.17),s(.06),{pts:At(U.cx,U.cy,U.rx,U.ry,{start:2.2,n:16,lop:.03}),closed:!0,w:.085,over:1.1,wob:.25},{pts:[[-.45,.05],[-.6,-.02],[-.45,-.08]],smooth:!1,w:.055,wob:.1},{pts:Ft(.27,.22,1.2,.17,.045,{turns:1.05,dir:-1}),w:.045,wob:.15},{pts:Ft(.34,.19,.82,.15,.04,{turns:1,dir:-1}),w:.045,wob:.15},{pts:[[.22,-.07],[.28,-.11],[.35,-.08]],w:.035,wob:.05}],{paint:!0,moving:!0,boil:.7}),r=Pt(ut.map((w,x)=>({kind:"oval",at:[0,w.ry*.95],size:[w.rx*2,w.ry*2],color:"#d7ecf8",color2:"#c2e0f3",passes:2,ang:.3,grp:x+1,wob:.012})),{paint:!0,moving:!0}),f=ht(ut.map((w,x)=>({pts:At(0,w.ry*.95,w.rx,w.ry,{start:-1.4,n:12,lop:.04,seed:x+3}),closed:!0,w:.06,over:.9,wob:.2,grp:x+1})),{paint:!0,moving:!0,boil:.7}),v=[c,a,r,f];v.forEach((w,x)=>{w.mesh.renderOrder=1e3+x,w.mesh.material.depthTest=!1,e.add(w.mesh)}),e.scale.setScalar(t),e.position.z=n;let u=1,i=0,l=-1,h=0,d=0,g=0,m=!1,p=0,F=0,b=0,R=!1;const S=(w,x)=>{const P=ut[w],A=P.tilt+x;for(const y of[r,f])y.U.uXf.value[w+1].set(P.at[0],P.at[1],A,1)};return S(0,.4),S(1,.4),{group:e,size:t,set(w,x,P,A,{fly:y=1,facing:C=0,scale:q=1}={}){const B=Math.hypot(F-w,b-x),_=R&&(p>.5?B<1.1:B<.45)?1:0;if(p=K(p,_,_?2.6:1.5,A),p>.002){const T=p*p*(3-2*p),k=P*4.4;w=bt(w,F+Math.cos(k)*.15,T),x=bt(x,b+Math.sin(k*1.31)*.09+.03,T),y=Math.max(y,Math.min(1,p*3)),p>.3&&(C=0)}const L=m?(w-h)/Math.max(A,.001):0,X=m?(x-d)/Math.max(A,.001):0;m||(i=y,C&&(u=C)),h=w,d=x,m=!0,i=K(i,y,8,A);const W=C||(Math.abs(L)>.02?Math.sign(L):u>0?1:-1);u=K(u,W,14,A),g=K(g,tt(X*.35,-.45,.45)*Math.sign(u||1)*i,6,A);const G=Math.sin(P*8.3)*.012*i+Math.sin(P*3.1)*.006*i;let M=1,E=1;if(l>=0){const T=P-l,k=Math.exp(-T*7)*Math.cos(T*22)*.28;M=1+k,E=1-k,T>1&&(l=-1)}e.position.set(w,x+G,e.position.z),e.scale.set(this.size*q*u*M,this.size*q*E,1),e.rotation.z=g;const z=Math.floor(P*12)%2?-.55:.5,I=.75+(Math.floor(P*12)%23===0?-.4:0);for(const T of[0,1])S(T,i>.5?z*(T?.85:1):I)},land(w){l=w},near(w,x,P){F=w,b=x,R=P},dispose(){v.forEach(w=>w.dispose())}}}function Qe(t,{w:n=wt*.42,dash:o=.045,z:e=.28,color:c=st.grey,tail:s=.9}={}){const a={pts:t,w:n,dash:o,z:e,color:c,wob:0,boil:.4,seed:4.2,ds:o/6},r=vt(a),f=r.reduce((u,i,l)=>l?u+Math.hypot(i[0]-r[l-1][0],i[1]-r[l-1][1]):0,0),v=ht([a],{boil:.4});return v.U.uLinear.value=1,v.U.uTail.value.set(1,s),v.mesh.renderOrder=400,{ink:v,path:r,L:f,at(u){return Ut(r,tt(u)*f)},show(u,i=.07,l=s){v.U.uTail.value.set(1,l),v.set(tt((tt(u)*f-i)/f))},dispose(){v.dispose()}}}const Ze={mark:[.25,2.3],fill:[1.95,2.85],bee:[2.45,4.05],name:[2.75,4.35],nameFill:[4.05,4.8],quiet:4.9,glide:[.46,1]},N={first:.075,last:.93,scribble:[.954,.995]},Ye={color:"#9ccbea",color2:"#86bce6"},Je={shrink:[0,.1],settle:.16,open:[.15,.24],riffle:[.27,.84],turn:.9};function ta(t,n){const o=e=>Math.min(1,Math.max(0,e));return t<N.first?-1+o(t/N.first):t>N.last?n-1+o((t-N.last)/(1-N.last)):(t-N.first)/(N.last-N.first)*(n-1)}const ea={stops:[.3,.56,.82],turn:.9},aa={stops:[.3,.52,.74],turn:.9},oa={stops:[.16,.38,.6,.8],scribble:[.9,.992]},na={color:"#f7d84f",color2:"#f2cb3c"},sa={shrink:[0,.14],letter:[.12,.34],stick:[.3,.52]},ra={wide:{big:{x:.31,y:.47,w:.4,h:.58},sticky:{vw:.165,vh:.28},stickies:[{x:.63,y:.33},{x:.83,y:.33},{x:.63,y:.67},{x:.83,y:.67}]},tall:{big:{x:.5,y:.3,w:.86,h:.25},sticky:{vw:.4,vh:.19},stickies:[{x:.28,y:.58},{x:.72,y:.58},{x:.28,y:.79},{x:.72,y:.79}]}};export{ke as A,Ue as B,Ye as C,Ze as D,aa as E,Wt as F,na as G,ea as H,Ot as I,oa as J,ra as K,sa as L,st as M,J as N,qe as O,Me as P,We as Q,at as R,xt as S,Be as T,ft as U,ta as V,wt as W,N as X,mt as Y,He as a,Ke as b,je as c,Ve as d,Xe as e,$e as f,ht as g,Pt as h,_e as i,Qe as j,Te as k,Ne as l,Ge as m,vt as n,ze as o,De as p,rt as q,Ee as r,Ie as s,Pe as t,Le as u,Oe as v,Je as w,Ft as x,Re as y,At as z};
