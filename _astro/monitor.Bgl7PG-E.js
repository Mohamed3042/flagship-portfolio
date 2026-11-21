import"./EditionWorld.astro_astro_type_script_index_0_lang.0RMRITYf.js";import{r as V,V as A,a1 as C,a as I,F as L,b as T,i as P}from"./three.module.pheUvn1h.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const f={sx:1.17,sy:1.3,k0:.1,kStep:.0075,kR:.1,kG:.12,kB:.14,r2:.25,fold:.5,lean:0,vig0:.49,vig1:.9,vigAmt:.45,refl:.05,depth:0,knee:.087,Z0:1,sight:.5},R=e=>e.toFixed(4),W=`
varying vec2 vMonUv; varying vec3 vMonCam; varying vec3 vMonFwd; varying vec3 vMonRt; varying vec3 vMonUp; uniform float uMonFlipX;
`,Y=`
  { mat4 mi = inverse(modelMatrix);
    vMonUv = vec2(mix(uv.x, 1. - uv.x, uMonFlipX), uv.y);
    vMonCam = (mi * vec4(cameraPosition, 1.)).xyz;
    vMonFwd = (mi * vec4(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2], 0.)).xyz;
    vMonRt = (mi * vec4(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0], 0.)).xyz;
    vMonUp = (mi * vec4(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1], 0.)).xyz; }
`,O=`
varying vec2 vMonUv; varying vec3 vMonCam; varying vec3 vMonFwd; varying vec3 vMonRt; varying vec3 vMonUp; uniform float uMonFlipX;
uniform float uMonGlass, uMonInside, uMonAspect, uMonTime;
vec2 mUv; vec2 mC; float mR2; vec2 mFold; float mVig; float mRefl; vec2 mLastX; vec4 mLast; float mHave;
const float M_SX = ${R(f.sx)}, M_SY = ${R(f.sy)}, M_K0 = ${R(f.k0)}, M_KS = ${R(f.kStep)};
const float M_KR = ${R(f.kR)}, M_KG = ${R(f.kG)}, M_KB = ${R(f.kB)}, M_FOLD = ${R(f.fold)}, M_LEAN = ${R(f.lean)};
const float M_A = ${R(f.r2)};
const float M_V0 = ${R(f.vig0)}, M_V1 = ${R(f.vig1)}, M_VA = ${R(f.vigAmt)}, M_REFL = ${R(f.refl)};
const float M_KNEE = ${R(f.knee)}, M_DEPTH = ${R(f.depth)}, M_Z0 = ${R(f.Z0)}, M_SIGHT = ${R(f.sight)};
void monPrep(){
  vec2 uv = vMonUv; float A = uMonAspect, G = uMonGlass;

  vec3 f = normalize(vMonFwd), c = normalize(vMonCam);
  vec2 turn = vec2(-f.x, -f.y) / max(-f.z, .2);
  vec2 sight = c.xy / max(c.z, .2);
  vec2 t = mix(turn, sight, M_SIGHT);
  t = t - M_KNEE * tanh(t / M_KNEE);
  vec2 slide = clamp(-M_DEPTH * uMonInside * t * vec2(1., A), -.2, .2);
  mUv = uv + slide;

  mC = (uv - .5) * 2. * mix(vec2(1.), vec2(M_SX, M_SY), G);
  mR2 = dot(mC, mC) * M_A;


  float ex = uv.x * 2. - 1.;
  vec3 n = normalize(vec3(M_LEAN * sin(1.5708 * ex) * (1. - 2. * uMonFlipX), 0., 1.));
  vec3 rt = normalize(vMonRt), up = normalize(vMonUp);
  float facing = dot(n, -f);
  mFold = M_FOLD * vec2(dot(n, rt), dot(n, up)) * smoothstep(.8, 1., facing) * G;
  mFold.x *= (1. - 2. * uMonFlipX);

  float r = length(uv - .5) / .7071;
  mVig = 1. - M_VA * smoothstep(M_V0, M_V1, r) * G;
  vec3 rf = reflect(f, n);
  mRefl = M_REFL * G * (.55 + .45 * rf.y) * (.6 + .4 * smoothstep(.3, 1., uv.y));
  mHave = 0.;
}
vec2 monMirror(vec2 p){ return 1. - abs(1. - mod(p, 2.)); }
vec2 monLens(float k, float ch){
  vec2 s = mC * (1. - k * uMonGlass * mR2);
  return s * .4237 + .5 + mFold * ch;
}
vec4 monTex(sampler2D s, vec2 x){
  if (mHave > .5 && all(equal(x, mLastX))) return mLast;
  vec2 d = x - vMonUv + (mUv - vMonUv);
  vec4 acc;
  if (mR2 < .045) {


    acc = texture2D(s, monMirror(monLens(M_K0 + M_KS * 1.5 + M_KG, 1.01) + d));
  } else {


    float km = M_K0 + M_KS * 1.5;
    vec4 g = texture2D(s, monMirror(monLens(km + M_KG, 1.01) + d));
    acc = vec4(texture2D(s, monMirror(monLens(km + M_KR, 1.) + d)).r, g.g, texture2D(s, monMirror(monLens(km + M_KB, 1.02) + d)).b, g.a);
  }
  mLastX = x; mLast = acc; mHave = 1.;
  return mLast;
}
vec3 monFinish(vec3 col){ return col * mVig + vec3(mRefl); }
`;function Z(e,o){let t=0;for(const n of o){const i=new RegExp(`\\btexture2D\\s*\\(\\s*${n}\\s*,`,"g");e=e.replace(i,()=>(t++,`monTex(${n},`))}return{src:e,n:t}}function N(e){const o=[];for(const t of e.matchAll(/uniform\s+sampler2D\s+([^;]+);/g))for(const n of t[1].split(","))o.push(n.trim());return o.filter(Boolean)}const j=typeof location<"u"&&/[?&]monglass=0(&|$)/.test(location.search),$=/void\s+main\s*\(\s*(void)?\s*\)\s*\{/;function U(e,o){const t=e;if(t.__monGlass!==void 0)return t.__monGlass;if(t.__monGlass=!1,j||!t.isShaderMaterial||t.userData?.monitorGlassOff)return!1;const n=N(t.fragmentShader||"");if(!n.length||!$.test(t.vertexShader||"")||!$.test(t.fragmentShader||""))return!1;const i=o?.userData.monitor,g=o?.userData.monitorOpts??{},D=t.userData.monitorGlass??g.glass??1,l=t.userData.monitorInside??g.inside??1;t.uniforms.uMonGlass={value:D},t.uniforms.uMonInside={value:l},t.uniforms.uMonAspect={value:i?i.w/i.h:16/9},t.uniforms.uMonTime={value:0},t.uniforms.uMonFlipX={value:t.userData.monitorFlipX??0},t.uniforms.uBevel&&typeof t.uniforms.uBevel.value=="number"&&(t.userData.monHostBevel=t.uniforms.uBevel.value,t.uniforms.uBevel.value=0),t.uniforms.uRim?.value?.isColor&&t.uniforms.uRim.value.setRGB(0,0,0);const h=t.onBeforeCompile?.bind(t),_=t.customProgramCacheKey?.bind(t);return t.onBeforeCompile=(s,u)=>{h?.(s,u),s.vertexShader=W+s.vertexShader.replace($,p=>p+Y);const b=Z(s.fragmentShader,n);let v=O+b.src.replace($,p=>p+`
  monPrep();
`);const x=v.lastIndexOf("}");v=v.slice(0,x)+`  gl_FragColor.rgb = monFinish(gl_FragColor.rgb);
`+v.slice(x),s.fragmentShader=v},t.customProgramCacheKey=()=>(_?_():"")+"|monGlass3",t.needsUpdate=!0,t.__monGlass=!0,!0}function q(e){e.traverse(o=>{const t=o,n=t.geometry;if(!(!t.isMesh||!n?.userData?.monitorFace))for(const i of Array.isArray(t.material)?t.material:[t.material])U(i,n)})}const K=C.prototype;if(!K.__monHook){K.__monHook=!0;const e=K.onBeforeRender,o=new WeakSet;K.onBeforeRender=function(t,...n){if(!o.has(t)){o.add(t);const g=t.compile.bind(t);t.compile=((D,l,h)=>(q(D),g(D,l,h??null)))}const i=this.geometry;if(i?.userData?.monitorFace){const g=this.material;g.__monGlass===void 0&&U(g,i)}return e.apply(this,arguments)}}const E=new V,X=new A,z=new A;function J(e,o){const t=e.material,n=t.uniforms??{},i=t.__monGlass?n.uMonInside?.value:0,g=n.uMonAspect?.value??16/9;e.updateMatrixWorld(),o.updateMatrixWorld(),E.copy(e.matrixWorld).invert(),X.setFromMatrixPosition(o.matrixWorld).applyMatrix4(E).normalize(),o.getWorldDirection(z).transformDirection(E);const D=-z.x/Math.max(-z.z,.2),l=-z.y/Math.max(-z.z,.2),h=X.x/Math.max(X.z,.2),_=X.y/Math.max(X.z,.2),s=r=>r-f.knee*Math.tanh(r/f.knee),u=s(D+(h-D)*f.sight),b=s(l+(_-l)*f.sight),v=r=>Math.max(-.2,Math.min(.2,r)),x=v(-0*i*u),p=v(-0*i*b*g);let G=1+(f.Z0-1)*i;G=Math.max(G,.5/Math.max(.5-Math.abs(x),.3),.5/Math.max(.5-Math.abs(p),.3));const S=r=>+(Math.atan(r)*180/Math.PI).toFixed(2);return{on:!!t.__monGlass,turnX:S(D),turnY:S(l),sightX:S(h),sightY:S(_),slideX:+x.toFixed(4),slideY:+p.toFixed(4),Z:+G.toFixed(4),inView:+(1/(G*G)).toFixed(4)}}function H(e,o,t){const n=P.degToRad(Math.max(0,t));if(n<1e-4)return{w:e,h:o,arc:0,R:1/0,chord:e,sag:0};const i=e/n;return{w:e,h:o,arc:t,R:i,chord:2*i*Math.sin(n/2),sag:i*(1-Math.cos(n/2))}}function Q(e,o,t,n=new A){if(!isFinite(e.R))return n.set(o,t,0);const i=o/e.R;return n.set(e.R*Math.sin(i),t,e.R*(1-Math.cos(i)))}function ot(e,o,t,n=64,{glass:i=1,inside:g=1,thick:D=.05}={}){const l=H(e,o,t),h=o/e>.2,_=h?D*o:0,s=[],u=[],b=[],v=[],x=new A,p=(c,a,m,y,k)=>{Q(l,c,a,x);const M=isFinite(l.R)?c/l.R:0,d=-Math.sin(M),F=Math.cos(M);return s.push(x.x-d*m,x.y,x.z-F*m),u.push(d,0,F),b.push(y,k),s.length/3-1},G=s.length/3;for(const c of[1,0])for(let a=0;a<=n;a++)p(-e/2+e*a/n,-o/2+o*c,0,a/n,c);for(let c=0;c<n;c++){const a=G+c,m=G+c+1,y=G+n+1+c,k=y+1;v.push(a,y,m,m,y,k)}const S=(c,a,m,y,k)=>{const M=F=>new A(s[3*F],s[3*F+1],s[3*F+2]);M(a).sub(M(c)).cross(M(m).sub(M(c))).dot(k)>=0?v.push(c,a,m,m,a,y):v.push(c,m,a,m,y,a)};if(_>0){for(const a of[1,-1]){const m=a*o/2,y=a>0?1:0,k=a>0?1-.01:.01,M=s.length/3;for(let d=0;d<=n;d++){const F=-e/2+e*d/n;p(F,m,0,d/n,y),p(F,m,_,d/n,k)}for(let d=0;d<n;d++){const F=M+2*d;S(F,F+1,F+2,F+3,new A(0,a,0))}for(let d=M;d<s.length/3;d++)u[3*d]=0,u[3*d+1]=a,u[3*d+2]=0}for(const a of[1,-1]){const m=a*e/2,y=a>0?1:0,k=a>0?1-.01:.01,M=s.length/3;p(m,o/2,0,y,1),p(m,o/2,_,k,1),p(m,-o/2,0,y,0),p(m,-o/2,_,k,0);const d=isFinite(l.R)?m/l.R:0,F=new A(a*Math.cos(d),0,a*Math.sin(d));S(M,M+1,M+2,M+3,F);for(let w=M;w<M+4;w++)u[3*w]=F.x,u[3*w+1]=0,u[3*w+2]=F.z}}const r=new I;return r.setAttribute("position",new L(s,3)),r.setAttribute("normal",new L(u,3)),r.setAttribute("uv",new L(b,2)),r.setIndex(v),r.computeBoundingBox(),r.computeBoundingSphere(),r.userData.monitor=l,r.userData.monitorFace=h,r.userData.monitorOpts={glass:i,inside:g},r}function nt(e,o,t,n,{rim:i=0,inset:g=.01,cols:D=48}={}){const l=H(e,o,t),h=e+2*i,_=o+2*i,s=new T(h,_,n,D,1,1),u=s.attributes.position,b=new A,v=l.R;for(let x=0;x<u.count;x++){const p=u.getX(x),G=u.getY(x),S=u.getZ(x)-n/2-g;if(!isFinite(v)){u.setXYZ(x,p,G,S);continue}const r=v-S,c=p/v;b.set(r*Math.sin(c),G,v-r*Math.cos(c)),u.setXYZ(x,b.x,b.y,b.z)}return u.needsUpdate=!0,s.computeVertexNormals(),s.computeBoundingBox(),s.computeBoundingSphere(),s.userData.monitor=l,s}const B=new A;function st(e,o,t,n){const i=e.geometry,g=i.attributes.position,D=e.material.uniforms?.uBend?.value||0;e.updateMatrixWorld(),o.updateMatrixWorld();const l=new Map;let h=1e9,_=1e9,s=-1e9,u=-1e9,b=1e9,v=-1e9;for(let r=0;r<g.count;r++){const c=g.getX(r),a=g.getY(r);B.set(c,a,g.getZ(r)+D*c*c),e.localToWorld(B),B.project(o);const m=(B.x+1)/2*t,y=(1-B.y)/2*n;h=Math.min(h,m),s=Math.max(s,m),_=Math.min(_,y),u=Math.max(u,y);const k=Math.round(i.attributes.uv.getX(r)*1e4),M=l.get(k)??{top:1e9,bot:-1e9,x:m};M.top=Math.min(M.top,y),M.bot=Math.max(M.bot,y),l.set(k,M),b=Math.min(b,k),v=Math.max(v,k)}const x=r=>{let c=[...l.keys()][0];for(const m of l.keys())Math.abs(m-r)<Math.abs(c-r)&&(c=m);const a=l.get(c);return+(a.bot-a.top).toFixed(1)},p=x(b),G=x((b+v)/2),S=x(v);return{x:+h.toFixed(1),y:+_.toFixed(1),w:+(s-h).toFixed(1),h:+(u-_).toFixed(1),fracW:+((s-h)/t).toFixed(3),fracH:+(G/n).toFixed(3),hL:p,hC:G,hR:S,inside:h>=-.5&&s<=t+.5&&_>=-.5&&u<=n+.5,glass:J(e,o)}}export{ot as a,st as b,Q as c,H as d,nt as m};
