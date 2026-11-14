import{T as I,k as S,az as T,_ as V,a1 as L,ai as C,s as P}from"./EditionWorld.astro_astro_type_script_index_0_lang.CGr-gj7z.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const M={sx:1.17,sy:1.3,k0:.1,kStep:.0075,kR:.1,kG:.12,kB:.14,r2:.25,fold:.5,lean:0,vig0:.49,vig1:.9,vigAmt:.45,refl:.05,depth:0,knee:.087,Z0:1,sight:.5},F=e=>e.toFixed(4),O=`
varying vec2 vMonUv; varying vec3 vMonCam; varying vec3 vMonFwd; varying vec3 vMonRt; varying vec3 vMonUp; uniform float uMonFlipX;
`,W=`
  { mat4 mi = inverse(modelMatrix);
    vMonUv = vec2(mix(uv.x, 1. - uv.x, uMonFlipX), uv.y);   // (world-39b: a host that mirrors its picture, Business's leaves)
    vMonCam = (mi * vec4(cameraPosition, 1.)).xyz;
    vMonFwd = (mi * vec4(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2], 0.)).xyz;
    vMonRt = (mi * vec4(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0], 0.)).xyz;   // the camera's right and up, in the face's own space
    vMonUp = (mi * vec4(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1], 0.)).xyz; }
`,Y=`
varying vec2 vMonUv; varying vec3 vMonCam; varying vec3 vMonFwd; varying vec3 vMonRt; varying vec3 vMonUp; uniform float uMonFlipX;
uniform float uMonGlass, uMonInside, uMonAspect, uMonTime;
vec2 mUv; vec2 mC; float mR2; vec2 mFold; float mVig; float mRefl; vec2 mLastX; vec4 mLast; float mHave;
const float M_SX = ${F(M.sx)}, M_SY = ${F(M.sy)}, M_K0 = ${F(M.k0)}, M_KS = ${F(M.kStep)};
const float M_KR = ${F(M.kR)}, M_KG = ${F(M.kG)}, M_KB = ${F(M.kB)}, M_FOLD = ${F(M.fold)}, M_LEAN = ${F(M.lean)};
const float M_A = ${F(M.r2)};
const float M_V0 = ${F(M.vig0)}, M_V1 = ${F(M.vig1)}, M_VA = ${F(M.vigAmt)}, M_REFL = ${F(M.refl)};
const float M_KNEE = ${F(M.knee)}, M_DEPTH = ${F(M.depth)}, M_Z0 = ${F(M.Z0)}, M_SIGHT = ${F(M.sight)};
void monPrep(){
  vec2 uv = vMonUv; float A = uMonAspect, G = uMonGlass;
  // ── the inside view: the face's turn against the camera (its forward axis) and, part way, the line of sight ──
  vec3 f = normalize(vMonFwd), c = normalize(vMonCam);
  vec2 turn = vec2(-f.x, -f.y) / max(-f.z, .2);
  vec2 sight = c.xy / max(c.z, .2);
  vec2 t = mix(turn, sight, M_SIGHT);
  t = t - M_KNEE * tanh(t / M_KNEE);
  vec2 slide = clamp(-M_DEPTH * uMonInside * t * vec2(1., A), -.2, .2);
  mUv = uv + slide;
  // ── the lens: the card's point, centred (−1 … 1), in the sampling area (1.17 wide, 1.3 tall) ──
  mC = (uv - .5) * 2. * mix(vec2(1.), vec2(M_SX, M_SY), G);
  mR2 = dot(mC, mC) * M_A;
  // ── the bevel fold: the slab's surface normal (its own slight bend at the ends, plus the face's turn) leans sideways
  //    against the view; the picture shifts by half that lean, where the surface still faces the viewer (.8 … 1) ──
  float ex = uv.x * 2. - 1.;
  vec3 n = normalize(vec3(M_LEAN * sin(1.5708 * ex) * (1. - 2. * uMonFlipX), 0., 1.));
  vec3 rt = normalize(vMonRt), up = normalize(vMonUp);
  float facing = dot(n, -f);
  mFold = M_FOLD * vec2(dot(n, rt), dot(n, up)) * smoothstep(.8, 1., facing) * G;
  mFold.x *= (1. - 2. * uMonFlipX);
  // ── the corners darkened, a twentieth of a soft reflection ──
  float r = length(uv - .5) / .7071;
  mVig = 1. - M_VA * smoothstep(M_V0, M_V1, r) * G;
  vec3 rf = reflect(f, n);
  mRefl = M_REFL * G * (.55 + .45 * rf.y) * (.6 + .4 * smoothstep(.3, 1., uv.y));
  mHave = 0.;
}
vec2 monMirror(vec2 p){ return 1. - abs(1. - mod(p, 2.)); }   // the picture repeats MIRRORED past its edges
vec2 monLens(float k, float ch){
  vec2 s = mC * (1. - k * uMonGlass * mR2);                 // each point pulled toward the centre by its distance squared
  return s * .4237 + .5 + mFold * ch;   // (world-41: .5 / 1.18, each film shown 18 % larger so the films' own corner brackets leave the screen)
}
vec4 monTex(sampler2D s, vec2 x){
  if (mHave > .5 && all(equal(x, mLastX))) return mLast;    // (a host reading its picture once per channel: one lens)
  vec2 d = x - vMonUv + (mUv - vMonUv);
  vec4 acc;
  if (mR2 < .045) {
    // the middle: red and blue less than a third of a pixel apart, one look through the lens, folded with the green
    // channel's share (the frame-time budget; turned, the fold's own split here is under 2 px)
    acc = texture2D(s, monMirror(monLens(M_K0 + M_KS * 1.5 + M_KG, 1.01) + d));
  } else {
    // each channel through the mean of alche's four strengths (.20 / .22 / .24 + .011): the split, not the four-look blur
    // (the frame-time budget: 66 s / 78 s within +10 %; four looks per channel cost +33 % at 78 s)
    float km = M_K0 + M_KS * 1.5;
    vec4 g = texture2D(s, monMirror(monLens(km + M_KG, 1.01) + d));
    acc = vec4(texture2D(s, monMirror(monLens(km + M_KR, 1.) + d)).r, g.g, texture2D(s, monMirror(monLens(km + M_KB, 1.02) + d)).b, g.a);
  }
  mLastX = x; mLast = acc; mHave = 1.;
  return mLast;
}
vec3 monFinish(vec3 col){ return col * mVig + vec3(mRefl); }
`;function Z(e,o){let t=0;for(const n of o){const i=new RegExp(`\\btexture2D\\s*\\(\\s*${n}\\s*,`,"g");e=e.replace(i,()=>(t++,`monTex(${n},`))}return{src:e,n:t}}function N(e){const o=[];for(const t of e.matchAll(/uniform\s+sampler2D\s+([^;]+);/g))for(const n of t[1].split(","))o.push(n.trim());return o.filter(Boolean)}const q=typeof location<"u"&&/[?&]monglass=0(&|$)/.test(location.search),$=/void\s+main\s*\(\s*(void)?\s*\)\s*\{/;function U(e,o){const t=e;if(t.__monGlass!==void 0)return t.__monGlass;if(t.__monGlass=!1,q||!t.isShaderMaterial||t.userData?.monitorGlassOff)return!1;const n=N(t.fragmentShader||"");if(!n.length||!$.test(t.vertexShader||"")||!$.test(t.fragmentShader||""))return!1;const i=o?.userData.monitor,x=o?.userData.monitorOpts??{},G=t.userData.monitorGlass??x.glass??1,u=t.userData.monitorInside??x.inside??1;t.uniforms.uMonGlass={value:G},t.uniforms.uMonInside={value:u},t.uniforms.uMonAspect={value:i?i.w/i.h:16/9},t.uniforms.uMonTime={value:0},t.uniforms.uMonFlipX={value:t.userData.monitorFlipX??0},t.uniforms.uBevel&&typeof t.uniforms.uBevel.value=="number"&&(t.userData.monHostBevel=t.uniforms.uBevel.value,t.uniforms.uBevel.value=0),t.uniforms.uRim?.value?.isColor&&t.uniforms.uRim.value.setRGB(0,0,0);const g=t.onBeforeCompile?.bind(t),_=t.customProgramCacheKey?.bind(t);return t.onBeforeCompile=(s,m)=>{g?.(s,m),s.vertexShader=O+s.vertexShader.replace($,p=>p+W);const R=Z(s.fragmentShader,n);let f=Y+R.src.replace($,p=>p+`
  monPrep();
`);const h=f.lastIndexOf("}");f=f.slice(0,h)+`  gl_FragColor.rgb = monFinish(gl_FragColor.rgb);
`+f.slice(h),s.fragmentShader=f},t.customProgramCacheKey=()=>(_?_():"")+"|monGlass3",t.needsUpdate=!0,t.__monGlass=!0,!0}function j(e){e.traverse(o=>{const t=o,n=t.geometry;if(!(!t.isMesh||!n?.userData?.monitorFace))for(const i of Array.isArray(t.material)?t.material:[t.material])U(i,n)})}const K=T.prototype;if(!K.__monHook){K.__monHook=!0;const e=K.onBeforeRender,o=new WeakSet;K.onBeforeRender=function(t,...n){if(!o.has(t)){o.add(t);const x=t.compile.bind(t);t.compile=((G,u,g)=>(j(G),x(G,u,g??null)))}const i=this.geometry;if(i?.userData?.monitorFace){const x=this.material;x.__monGlass===void 0&&U(x,i)}return e.apply(this,arguments)}}const E=new I,z=new S,B=new S;function J(e,o){const t=e.material,n=t.uniforms??{},i=t.__monGlass?n.uMonInside?.value:0,x=n.uMonAspect?.value??16/9;e.updateMatrixWorld(),o.updateMatrixWorld(),E.copy(e.matrixWorld).invert(),z.setFromMatrixPosition(o.matrixWorld).applyMatrix4(E).normalize(),o.getWorldDirection(B).transformDirection(E);const G=-B.x/Math.max(-B.z,.2),u=-B.y/Math.max(-B.z,.2),g=z.x/Math.max(z.z,.2),_=z.y/Math.max(z.z,.2),s=r=>r-M.knee*Math.tanh(r/M.knee),m=s(G+(g-G)*M.sight),R=s(u+(_-u)*M.sight),f=r=>Math.max(-.2,Math.min(.2,r)),h=f(-0*i*m),p=f(-0*i*R*x);let w=1+(M.Z0-1)*i;w=Math.max(w,.5/Math.max(.5-Math.abs(h),.3),.5/Math.max(.5-Math.abs(p),.3));const D=r=>+(Math.atan(r)*180/Math.PI).toFixed(2);return{on:!!t.__monGlass,turnX:D(G),turnY:D(u),sightX:D(g),sightY:D(_),slideX:+h.toFixed(4),slideY:+p.toFixed(4),Z:+w.toFixed(4),inView:+(1/(w*w)).toFixed(4)}}function H(e,o,t){const n=P.degToRad(Math.max(0,t));if(n<1e-4)return{w:e,h:o,arc:0,R:1/0,chord:e,sag:0};const i=e/n;return{w:e,h:o,arc:t,R:i,chord:2*i*Math.sin(n/2),sag:i*(1-Math.cos(n/2))}}function Q(e,o,t,n=new S){if(!isFinite(e.R))return n.set(o,t,0);const i=o/e.R;return n.set(e.R*Math.sin(i),t,e.R*(1-Math.cos(i)))}function et(e,o,t,n=64,{glass:i=1,inside:x=1,thick:G=.05}={}){const u=H(e,o,t),g=o/e>.2,_=g?G*o:0,s=[],m=[],R=[],f=[],h=new S,p=(c,a,l,y,k)=>{Q(u,c,a,h);const v=isFinite(u.R)?c/u.R:0,d=-Math.sin(v),b=Math.cos(v);return s.push(h.x-d*l,h.y,h.z-b*l),m.push(d,0,b),R.push(y,k),s.length/3-1},w=s.length/3;for(const c of[1,0])for(let a=0;a<=n;a++)p(-e/2+e*a/n,-o/2+o*c,0,a/n,c);for(let c=0;c<n;c++){const a=w+c,l=w+c+1,y=w+n+1+c,k=y+1;f.push(a,y,l,l,y,k)}const D=(c,a,l,y,k)=>{const v=b=>new S(s[3*b],s[3*b+1],s[3*b+2]);v(a).sub(v(c)).cross(v(l).sub(v(c))).dot(k)>=0?f.push(c,a,l,l,a,y):f.push(c,l,a,l,y,a)};if(_>0){for(const a of[1,-1]){const l=a*o/2,y=a>0?1:0,k=a>0?1-.01:.01,v=s.length/3;for(let d=0;d<=n;d++){const b=-e/2+e*d/n;p(b,l,0,d/n,y),p(b,l,_,d/n,k)}for(let d=0;d<n;d++){const b=v+2*d;D(b,b+1,b+2,b+3,new S(0,a,0))}for(let d=v;d<s.length/3;d++)m[3*d]=0,m[3*d+1]=a,m[3*d+2]=0}for(const a of[1,-1]){const l=a*e/2,y=a>0?1:0,k=a>0?1-.01:.01,v=s.length/3;p(l,o/2,0,y,1),p(l,o/2,_,k,1),p(l,-o/2,0,y,0),p(l,-o/2,_,k,0);const d=isFinite(u.R)?l/u.R:0,b=new S(a*Math.cos(d),0,a*Math.sin(d));D(v,v+1,v+2,v+3,b);for(let A=v;A<v+4;A++)m[3*A]=b.x,m[3*A+1]=0,m[3*A+2]=b.z}}const r=new V;return r.setAttribute("position",new L(s,3)),r.setAttribute("normal",new L(m,3)),r.setAttribute("uv",new L(R,2)),r.setIndex(f),r.computeBoundingBox(),r.computeBoundingSphere(),r.userData.monitor=u,r.userData.monitorFace=g,r.userData.monitorOpts={glass:i,inside:x},r}function ot(e,o,t,n,{rim:i=0,inset:x=.01,cols:G=48}={}){const u=H(e,o,t),g=e+2*i,_=o+2*i,s=new C(g,_,n,G,1,1),m=s.attributes.position,R=new S,f=u.R;for(let h=0;h<m.count;h++){const p=m.getX(h),w=m.getY(h),D=m.getZ(h)-n/2-x;if(!isFinite(f)){m.setXYZ(h,p,w,D);continue}const r=f-D,c=p/f;R.set(r*Math.sin(c),w,f-r*Math.cos(c)),m.setXYZ(h,R.x,R.y,R.z)}return m.needsUpdate=!0,s.computeVertexNormals(),s.computeBoundingBox(),s.computeBoundingSphere(),s.userData.monitor=u,s}const X=new S;function nt(e,o,t,n){const i=e.geometry,x=i.attributes.position,G=e.material.uniforms?.uBend?.value||0;e.updateMatrixWorld(),o.updateMatrixWorld();const u=new Map;let g=1e9,_=1e9,s=-1e9,m=-1e9,R=1e9,f=-1e9;for(let r=0;r<x.count;r++){const c=x.getX(r),a=x.getY(r);X.set(c,a,x.getZ(r)+G*c*c),e.localToWorld(X),X.project(o);const l=(X.x+1)/2*t,y=(1-X.y)/2*n;g=Math.min(g,l),s=Math.max(s,l),_=Math.min(_,y),m=Math.max(m,y);const k=Math.round(i.attributes.uv.getX(r)*1e4),v=u.get(k)??{top:1e9,bot:-1e9,x:l};v.top=Math.min(v.top,y),v.bot=Math.max(v.bot,y),u.set(k,v),R=Math.min(R,k),f=Math.max(f,k)}const h=r=>{let c=[...u.keys()][0];for(const l of u.keys())Math.abs(l-r)<Math.abs(c-r)&&(c=l);const a=u.get(c);return+(a.bot-a.top).toFixed(1)},p=h(R),w=h((R+f)/2),D=h(f);return{x:+g.toFixed(1),y:+_.toFixed(1),w:+(s-g).toFixed(1),h:+(m-_).toFixed(1),fracW:+((s-g)/t).toFixed(3),fracH:+(w/n).toFixed(3),hL:p,hC:w,hR:D,inside:g>=-.5&&s<=t+.5&&_>=-.5&&m<=n+.5,glass:J(e,o)}}export{et as a,nt as b,Q as c,H as d,ot as m};
