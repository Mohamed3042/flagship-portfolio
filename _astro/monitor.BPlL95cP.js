import{ay as E,n as _,ak as P,P as H,w as U,p as W}from"./EditionWorld.astro_astro_type_script_index_0_lang.CQUQqKzf.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const M={band:.065,pull:.43,split:.0045,rim:.5,rimEnds:1.4,rimW:.0028,depth:.17,knee:.087,Z0:1.02,sight:.5},T=`
varying vec2 vMonUv; varying vec3 vMonCam; varying vec3 vMonFwd;
`,X=`
  { mat4 mi = inverse(modelMatrix);
    vMonUv = uv;
    vMonCam = (mi * vec4(cameraPosition, 1.)).xyz;
    vMonFwd = (mi * vec4(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2], 0.)).xyz; }
`,$=`
varying vec2 vMonUv; varying vec3 vMonCam; varying vec3 vMonFwd;
uniform float uMonGlass, uMonInside, uMonAspect, uMonTime;
vec2 mUv; vec2 mOff; float mK; float mRim;
const float M_BAND = ${M.band.toFixed(4)}, M_PULL = ${M.pull.toFixed(4)}, M_SPLIT = ${M.split.toFixed(4)};
const float M_RIM = ${M.rim.toFixed(4)}, M_RIMENDS = ${M.rimEnds.toFixed(4)}, M_RIMW = ${M.rimW.toFixed(4)};
const float M_KNEE = ${M.knee.toFixed(4)}, M_DEPTH = ${M.depth.toFixed(4)}, M_Z0 = ${M.Z0.toFixed(4)}, M_SIGHT = ${M.sight.toFixed(4)};
void monPrep(){
  vec2 uv = vMonUv; float A = uMonAspect;
  // ── the inside view: the face's turn against the camera (its forward axis) and, part way, the line of sight ──
  vec3 f = normalize(vMonFwd), c = normalize(vMonCam);
  vec2 turn = vec2(-f.x, -f.y) / max(-f.z, .2);             // tan of the face's turn: 0 when it stands square
  vec2 sight = c.xy / max(c.z, .2);                          // tan of the line of sight to its centre
  vec2 t = mix(turn, sight, M_SIGHT);
  t = t - M_KNEE * tanh(t / M_KNEE);                         // the knee: still within ~5°, then depth × tan
  vec2 slide = clamp(-M_DEPTH * uMonInside * t * vec2(1., A), -.2, .2);   // uv (x: share of the width)
  float Z = mix(1., M_Z0, uMonInside);
  vec2 need = .5 / max(vec2(.5) - abs(slide), vec2(.3));      // the size that keeps the slid window inside the picture
  Z = max(Z, max(need.x, need.y));
  vec2 q = (uv - .5) / Z + .5 + slide;
  // ── the glass edge (face units: height 1, width A): distance in, and the outward direction, round at the corners ──
  float bandH = M_BAND * A;
  vec2 p = (uv - .5) * vec2(A, 1.), hb = vec2(A, 1.) * .5;
  vec2 ap = abs(p), qq = ap - (hb - bandH);
  float e = min(hb.x - ap.x, hb.y - ap.y);                   // distance to the nearest edge
  vec2 g = normalize(max(qq, vec2(1e-4))) * sign(p + 1e-6);   // outward
  float k = clamp(1. - e / bandH, 0., 1.) * uMonGlass;       // 1 at the edge, 0 one band in
  float bend = k * k;                                        // the slant bends more toward the edge
  vec2 gu = g / vec2(A, 1.);                                 // a face-height length, in uv
  q -= gu * bandH * M_PULL * bend / Z;                       // the band reads from further in: a squeezed strip
  mOff = gu * M_SPLIT * A * bend;
  mK = k;
  // the rim: a thin bright line at the very edge, brighter toward the ends of the curve
  float ends = pow(abs(uv.x - .5) * 2., 3.);
  mRim = M_RIM * uMonGlass * (1. + M_RIMENDS * ends) * exp(-pow(e / (M_RIMW * A), 2.));
  mUv = q;
}
vec4 monTex(sampler2D s, vec2 x){
  vec2 p = clamp(mUv + (x - vMonUv), vec2(.0008), vec2(.9992));
  if (mK < .002) return texture2D(s, p);
  vec4 cg = texture2D(s, p);
  float r = texture2D(s, clamp(p + mOff, vec2(.0008), vec2(.9992))).r;
  float b = texture2D(s, clamp(p - mOff, vec2(.0008), vec2(.9992))).b;
  return vec4(r, cg.g, b, cg.a);
}
vec3 monFinish(vec3 col){ return col * (1. + .12 * mK * mK) + vec3(.96, .97, 1.) * mRim; }
`;function O(e,n){let t=0;for(const o of n){const a=new RegExp(`\\btexture2D\\s*\\(\\s*${o}\\s*,`,"g");e=e.replace(a,()=>(t++,`monTex(${o},`))}return{src:e,n:t}}function Y(e){const n=[];for(const t of e.matchAll(/uniform\s+sampler2D\s+([^;]+);/g))for(const o of t[1].split(","))n.push(o.trim());return n.filter(Boolean)}const C=typeof location<"u"&&/[?&]monglass=0(&|$)/.test(location.search),k=/void\s+main\s*\(\s*(void)?\s*\)\s*\{/;function Z(e,n){const t=e;if(t.__monGlass!==void 0)return t.__monGlass;if(t.__monGlass=!1,C||!t.isShaderMaterial||t.userData?.monitorGlassOff)return!1;const o=Y(t.fragmentShader||"");if(!o.length||!k.test(t.vertexShader||"")||!k.test(t.fragmentShader||""))return!1;const a=n?.userData.monitor,d=n?.userData.monitorOpts??{},f=t.userData.monitorGlass??d.glass??1,i=t.userData.monitorInside??d.inside??1;t.uniforms.uMonGlass={value:f},t.uniforms.uMonInside={value:i},t.uniforms.uMonAspect={value:a?a.w/a.h:16/9},t.uniforms.uMonTime={value:0},t.uniforms.uBevel&&typeof t.uniforms.uBevel.value=="number"&&(t.userData.monHostBevel=t.uniforms.uBevel.value,t.uniforms.uBevel.value=0);const c=t.onBeforeCompile?.bind(t),h=t.customProgramCacheKey?.bind(t);return t.onBeforeCompile=(s,r)=>{c?.(s,r),s.vertexShader=T+s.vertexShader.replace(k,p=>p+X);const v=O(s.fragmentShader,o);let m=$+v.src.replace(k,p=>p+`
  monPrep();
`);const u=m.lastIndexOf("}");m=m.slice(0,u)+`  gl_FragColor.rgb = monFinish(gl_FragColor.rgb);
`+m.slice(u),s.fragmentShader=m},t.customProgramCacheKey=()=>(h?h():"")+"|monGlass1",t.needsUpdate=!0,t.__monGlass=!0,!0}function K(e){e.traverse(n=>{const t=n,o=t.geometry;if(!(!t.isMesh||!o?.userData?.monitorFace))for(const a of Array.isArray(t.material)?t.material:[t.material])Z(a,o)})}const I=P.prototype;if(!I.__monHook){I.__monHook=!0;const e=I.onBeforeRender,n=new WeakSet;I.onBeforeRender=function(t,...o){if(!n.has(t)){n.add(t);const d=t.compile.bind(t);t.compile=((f,i,c)=>(K(f),d(f,i,c??null)))}const a=this.geometry;if(a?.userData?.monitorFace){const d=this.material;d.__monGlass===void 0&&Z(d,a)}return e.apply(this,arguments)}}const B=new E,w=new _,D=new _;function N(e,n){const t=e.material,o=t.uniforms??{},a=t.__monGlass?o.uMonInside?.value:0,d=o.uMonAspect?.value??16/9;e.updateMatrixWorld(),n.updateMatrixWorld(),B.copy(e.matrixWorld).invert(),w.setFromMatrixPosition(n.matrixWorld).applyMatrix4(B).normalize(),n.getWorldDirection(D).transformDirection(B);const f=-D.x/Math.max(-D.z,.2),i=-D.y/Math.max(-D.z,.2),c=w.x/Math.max(w.z,.2),h=w.y/Math.max(w.z,.2),s=l=>l-M.knee*Math.tanh(l/M.knee),r=s(f+(c-f)*M.sight),v=s(i+(h-i)*M.sight),m=l=>Math.max(-.2,Math.min(.2,l)),u=m(-.17*a*r),p=m(-.17*a*v*d);let x=1+(M.Z0-1)*a;x=Math.max(x,.5/Math.max(.5-Math.abs(u),.3),.5/Math.max(.5-Math.abs(p),.3));const b=l=>+(Math.atan(l)*180/Math.PI).toFixed(2);return{on:!!t.__monGlass,turnX:b(f),turnY:b(i),sightX:b(c),sightY:b(h),slideX:+u.toFixed(4),slideY:+p.toFixed(4),Z:+x.toFixed(4),inView:+(1/(x*x)).toFixed(4)}}function z(e,n,t){const o=W.degToRad(Math.max(0,t));if(o<1e-4)return{w:e,h:n,arc:0,R:1/0,chord:e,sag:0};const a=e/o;return{w:e,h:n,arc:t,R:a,chord:2*a*Math.sin(o/2),sag:a*(1-Math.cos(o/2))}}function q(e,n,t,o=new _){if(!isFinite(e.R))return o.set(n,t,0);const a=n/e.R;return o.set(e.R*Math.sin(a),t,e.R*(1-Math.cos(a)))}function V(e,n,t,o=64,{glass:a=1,inside:d=1}={}){const f=z(e,n,t),i=new H(e,n,o,1),c=i.attributes.position,h=i.attributes.normal,s=new _;for(let r=0;r<c.count;r++){const v=c.getX(r),m=c.getY(r);q(f,v,m,s),c.setXYZ(r,s.x,s.y,s.z);const u=isFinite(f.R)?v/f.R:0;h.setXYZ(r,-Math.sin(u),0,Math.cos(u))}return c.needsUpdate=!0,h.needsUpdate=!0,i.computeBoundingBox(),i.computeBoundingSphere(),i.userData.monitor=f,i.userData.monitorFace=n/e>.2,i.userData.monitorOpts={glass:a,inside:d},i}function j(e,n,t,o,{rim:a=0,inset:d=.01,cols:f=48}={}){const i=z(e,n,t),c=e+2*a,h=n+2*a,s=new U(c,h,o,f,1,1),r=s.attributes.position,v=new _,m=i.R;for(let u=0;u<r.count;u++){const p=r.getX(u),x=r.getY(u),b=r.getZ(u)-o/2-d;if(!isFinite(m)){r.setXYZ(u,p,x,b);continue}const l=m-b,g=p/m;v.set(l*Math.sin(g),x,m-l*Math.cos(g)),r.setXYZ(u,v.x,v.y,v.z)}return r.needsUpdate=!0,s.computeVertexNormals(),s.computeBoundingBox(),s.computeBoundingSphere(),s.userData.monitor=i,s}const R=new _;function J(e,n,t,o){const a=e.geometry,d=a.attributes.position,f=e.material.uniforms?.uBend?.value||0;e.updateMatrixWorld(),n.updateMatrixWorld();const i=new Map;let c=1e9,h=1e9,s=-1e9,r=-1e9,v=1e9,m=-1e9;for(let l=0;l<d.count;l++){const g=d.getX(l),A=d.getY(l);R.set(g,A,d.getZ(l)+f*g*g),e.localToWorld(R),R.project(n);const y=(R.x+1)/2*t,G=(1-R.y)/2*o;c=Math.min(c,y),s=Math.max(s,y),h=Math.min(h,G),r=Math.max(r,G);const S=Math.round(a.attributes.uv.getX(l)*1e4),F=i.get(S)??{top:1e9,bot:-1e9,x:y};F.top=Math.min(F.top,G),F.bot=Math.max(F.bot,G),i.set(S,F),v=Math.min(v,S),m=Math.max(m,S)}const u=l=>{let g=[...i.keys()][0];for(const y of i.keys())Math.abs(y-l)<Math.abs(g-l)&&(g=y);const A=i.get(g);return+(A.bot-A.top).toFixed(1)},p=u(v),x=u((v+m)/2),b=u(m);return{x:+c.toFixed(1),y:+h.toFixed(1),w:+(s-c).toFixed(1),h:+(r-h).toFixed(1),fracW:+((s-c)/t).toFixed(3),fracH:+(x/o).toFixed(3),hL:p,hC:x,hR:b,inside:c>=-.5&&s<=t+.5&&h>=-.5&&r<=o+.5,glass:N(e,n)}}export{V as a,J as b,q as c,z as d,j as m};
