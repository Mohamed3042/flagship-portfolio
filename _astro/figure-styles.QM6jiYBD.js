import{G as se,ax as de,M as j,_ as ve,Y as $,aB as Q,V as M,a2 as me,S as ae,af as we,q as ne,y as J,H as le,s as W,i as oe,a as ce,bc as xe,ao as K,aH as ye,aF as ge,aq as be,C as he,ac as ke,ag as Me,aL as Ce,bd as Se,ai as Te,a4 as qe,Q as ie,k as fe,P as Ae}from"./EditionWorld.astro_astro_type_script_index_0_lang.D1SWOm1D.js";import{C as Ee}from"./plan.lFjDK2bd.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Pe=(e,t)=>t?{still:e.poster,stillAsp:2/3,clip:e.loop.replace(/loop\.mp4$/,"hero-tall.mp4"),clipAsp:9/16}:{still:e.card,stillAsp:16/9,clip:e.loop,clipAsp:16/9};function tt(e,t,s){const r=Pe(t,s);let o=null,l=null,p=null;return e.textures.image(r.still).then(c=>{o=c}).catch(()=>{}),{tall:s,film:t,frame(c){if(c&&!l){const u=e.textures.video(r.clip);l=u.video,p=u.texture}l&&(c&&l.paused&&l.play().catch(()=>{}),!c&&!l.paused&&l.pause());const i=!!(c&&l&&l.readyState>=2);return i?{tex:p,asp:r.clipAsp,live:i}:{tex:o,asp:r.stillAsp,live:!1}},pause(){l&&!l.paused&&l.pause()}}}const L=["px","py","pz","ry","rx","rz","sp","spt","spb","ch","cht","chb","nk","nkt","hd","lsf","lsa","lst","lef","rsf","rsa","rst","ref","lhf","lha","lht","lkf","laf","rhf","rha","rht","rkf","raf"],C={};L.forEach((e,t)=>{C[e]=t});const Re=Math.PI/180;Object.fromEntries(L.map(e=>[e,0]));function g(e,t){const s=new Float32Array(L.length);for(const r of L)s[C[r]]=t?t[C[r]]:r==="py"?.94:0;for(const[r,o]of Object.entries(e))s[C[r]]=r==="px"||r==="py"||r==="pz"?o:o*Re;return s}function We(e,t,s,r){for(let o=0;o<e.length;o++)r[o]=e[o]+(t[o]-e[o])*s;return r}const y=g({py:.86,ry:18,rx:4,sp:7,spt:-14,ch:4,cht:-14,nk:-8,lhf:24,lha:7,lkf:24,rhf:-12,rha:9,rht:-14,rkf:22,laf:-6,raf:8,lsf:58,lsa:6,lef:112,rsf:62,rsa:2,ref:124,lst:12,rst:-8}),Fe=g({lsf:66,lef:118,rsf:70,ref:128,sp:10,nk:-12,py:.85},y),ue={stance:y,guard:Fe,jab:g({lsf:92,lsa:2,lef:6,cht:10,spt:-4,rsf:66,ref:128,py:.85,ry:10,sp:10},y),cross:g({rsf:94,rsa:3,ref:6,spt:26,cht:24,lsf:70,lef:120,ry:28,rhf:-4,rkf:34,rht:-34,py:.85,sp:12},y),hook:g({rsf:82,rsa:66,ref:98,spt:30,cht:30,ry:30,lsf:70,lef:120,py:.84,sp:12,rkf:34},y),roundhouse:g({py:.93,ry:36,rx:-8,sp:-14,spt:28,cht:24,lhf:8,lkf:14,lht:40,lsf:62,lef:108,rsf:50,rsa:40,ref:100,rhf:84,rha:52,rht:-50,rkf:12,raf:-30,lsa:28},y),teep:g({py:.91,rx:-10,sp:-16,lhf:6,lkf:12,rhf:98,rha:6,rkf:8,raf:40,lsf:60,lef:100,rsf:56,ref:96,lsa:22,rsa:22,ry:6},y),elbow:g({py:.84,sp:16,spt:34,cht:34,ry:28,rsf:74,rsa:80,ref:150,lsf:68,lef:120,rkf:34,rhf:-4,rht:-28},y),knee:g({py:.93,sp:14,rx:6,lhf:8,lkf:14,rhf:108,rha:10,rkf:104,raf:-30,lsf:66,lef:112,lsa:24,rsf:70,ref:118,rsa:20,ry:6},y),iaido:g({py:.62,ry:-52,rx:7,sp:8,spt:16,cht:16,nk:-5,lhf:44,lha:20,lkf:84,lht:24,rhf:-12,rha:20,rkf:92,rht:-30,laf:-8,lsf:38,lsa:14,lef:86,lst:20,rsf:44,rsa:12,ref:74,rst:-30},y),draw:g({py:.76,ry:-64,rx:4,sp:2,spt:-26,cht:-34,lhf:42,lha:14,lkf:54,lht:24,rhf:-12,rha:14,rkf:62,rht:-30,lsf:30,lsa:22,lef:60,rsf:96,rsa:56,ref:22,rst:-10},y),follow:g({py:.78,ry:-78,rx:12,sp:14,spt:-40,cht:-44,lhf:40,lha:10,lkf:50,lht:24,rhf:-14,rha:16,rkf:52,rht:-28,nk:-4,lsf:26,lsa:18,lef:54,rsf:128,rsa:38,ref:14},y),sheath:g({py:.84,ry:-40,rx:2,sp:4,spt:6,cht:6,lhf:12,lha:8,lkf:12,lht:14,rhf:-4,rha:8,rkf:12,rht:-14,lsf:34,lsa:12,lef:70,rsf:40,rsa:10,ref:68,nk:-2},y),slip:g({py:.74,ry:22,rx:22,rz:-10,sp:26,spb:12,spt:-12,ch:10,chb:12,nk:-14,lhf:36,lha:12,lkf:54,rhf:-20,rha:12,rkf:44,rht:-14,lsf:68,lef:120,rsf:74,ref:132},y),counter:g({py:.8,ry:34,rx:10,sp:14,spt:36,cht:34,lhf:28,lkf:34,rhf:-4,rkf:36,rht:-40,rsf:94,rsa:4,ref:8,lsf:64,lef:122},y),raised:g({py:.94,ry:6,rx:0,sp:-2,spt:0,cht:0,nk:-10,lhf:6,lha:12,lkf:4,rhf:4,rha:12,rkf:4,lsf:12,lsa:18,lef:20,rsf:168,rsa:14,ref:12,laf:0,raf:0,lst:0,rst:0},y),stand:g({py:.94,ry:0,rx:0,lhf:3,lha:8,lkf:2,rhf:3,rha:8,rkf:2,lsf:8,lsa:12,lef:14,rsf:8,rsa:12,ref:14,laf:0,raf:0,lst:0,rst:0,sp:0,spt:0,cht:0,nk:0},y),hit:g({py:.9,ry:14,rx:-18,sp:-22,ch:-10,nk:14,lhf:10,lkf:14,rhf:-22,rkf:20,lsf:26,lef:70,rsf:34,ref:84,lsa:40,rsa:38},y)},ze=[["lsf","rsf"],["lsa","rsa"],["lst","rst"],["lef","ref"],["lhf","rhf"],["lha","rha"],["lht","rht"],["lkf","rkf"],["laf","raf"]],Oe=["px","ry","rz","spt","spb","cht","chb","nkt","lst","rst","lht","rht"];function rt(e){const t=new Float32Array(e);for(const[s,r]of ze)t[C[s]]=e[C[r]],t[C[r]]=e[C[s]];for(const s of Oe)t[C[s]]=-t[C[s]];return t}const Ve={io:e=>e*e*(3-2*e),lin:e=>e,out:e=>1-Math.pow(1-e,3),back:e=>1+2.9*Math.pow(e-1,3)+1.9*Math.pow(e-1,2),snap:e=>1-Math.pow(1-e,5)};new Float32Array(L.length);function st(e,t,s=new Float32Array(L.length)){if(t<=e[0].t)return s.set(e[0].pose),s;for(let r=1;r<e.length;r++)if(t<=e[r].t){const o=e[r-1],l=e[r],p=me((t-o.t)/Math.max(1e-6,l.t-o.t));return We(o.pose,l.pose,Ve[l.ease??"io"](p),s)}return s.set(e[e.length-1].pose),s}function R(e,t,s,r=24){const o=[];for(let c=0;c<=7;c++){const i=-Math.PI/2+c/7*Math.PI/2;o.push(new W(Math.cos(i)*s,-e+Math.sin(i)*s))}for(let c=1;c<4;c++){const i=c/4;o.push(new W(Ce(s,t,i)*(1+.06*Math.sin(i*Math.PI)),-e+e*i))}for(let c=0;c<=7;c++){const i=c/7*Math.PI/2;o.push(new W(Math.cos(i)*t,Math.sin(i)*t))}o[o.length-1].x=0,o[0].x=0;const p=new Se(o,r);return p.computeVertexNormals(),p}function ee(e,t=32){const s=[],r=[];e.forEach(([l,p,c,i=0])=>{for(let u=0;u<=t;u++){const b=u/t*Math.PI*2;s.push(Math.sin(b)*p,l,Math.cos(b)*c+i)}});for(let l=0;l<e.length-1;l++)for(let p=0;p<t;p++){const c=l*(t+1)+p,i=c+1,u=c+t+1,b=u+1;r.push(c,u,i,i,u,b)}const o=new ke;return o.setAttribute("position",new Me(s,3)),o.setIndex(r),o.computeVertexNormals(),o}const D=(e,t,s,r=24,o=16)=>new Te(1,r,o).scale(e,t,s),pe=new Map;function te(e){let t=pe.get(e);return t||(t=new oe({uniforms:{uId:{value:e}},side:qe,vertexShader:"varying vec3 vN; varying float vH; void main(){ vN = normalize(normalMatrix * normal); vec4 w = modelMatrix * vec4(position, 1.); vH = w.y; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"uniform float uId; varying vec3 vN; varying float vH; void main(){ vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n; gl_FragColor = vec4(n.xy * .5 + .5, vH * .5, uId / 8.); }"}),pe.set(e,t)),t}const d={body:1,wrap:2,cloth:3,steel:5};function Ie(){const e=new se,t={},s=(f,n,a=0,h=0,v=0)=>{const P=new se;return P.position.set(a,h,v),n.add(P),t[f]=P,P},r=(f,n,a,h=0,v=0,P=0)=>{const _=new j(n,te(a));return _.position.set(h,v,P),_.frustumCulled=!1,f.add(_),_},o=s("hips",e,0,.94,0);r(o,ee([[-.14,0,0],[-.12,.1,.07],[-.08,.165,.105],[0,.178,.112],[.06,.168,.108],[.11,.152,.1],[.12,0,0]]),d.body),r(o,ee([[-.09,0,0],[-.07,.17,.12],[-0,.19,.125],[.075,.168,.108],[.09,0,0]]),d.cloth);const l=s("spine",o,0,.1,0);r(l,ee([[-.02,0,0],[-.01,.15,.1],[.04,.146,.097],[.1,.14,.094],[.17,.154,.1],[.2,0,0]]),d.body);const p=new de(.156,.02,12,40).rotateX(Math.PI/2).scale(1,1,.66);r(l,p,d.wrap,0,.05,0);const c=s("knot",l,.13,.05,.1);r(c,R(.2,.03,.014,10).rotateZ(.2),d.wrap,0,0,0),r(c,R(.26,.028,.012,10).rotateZ(-.12).rotateX(-.2),d.wrap,-.04,0,0);const i=s("chest",l,0,.19,0);r(i,ee([[-.03,0,0],[-.02,.15,.1],[.04,.185,.108],[.11,.222,.12],[.18,.236,.122],[.235,.232,.112],[.27,.12,.08],[.285,0,0]]),d.body);const u=s("neck",i,0,.27,0);r(u,R(.09,.05,.046,16),d.body,0,.09,0);const b=s("head",u,0,.075,0);r(b,D(.088,.112,.1),d.body,0,.105,.008),r(b,D(.045,.03,.05,12,8),d.body,0,.04,.03);const m=(f,n)=>{const a=s(n+"sh",i,f*.212,.225,0);r(a,D(.062,.06,.062,18,12),d.body),r(a,R(.29,.053,.042),d.body);const h=s(n+"el",a,0,-.29,0);r(h,R(.26,.043,.031),d.body),r(h,new $(.039,.036,.12,18),d.wrap,0,-.2,0);const v=s(n+"wr",h,0,-.265,0);return r(v,D(.047,.052,.062,16,12),d.body,0,-.045,.012),r(v,new $(.05,.05,.045,18),d.wrap,0,-.04,.012),{sh:a,el:h,wr:v}},k=m(1,"l"),S=m(-1,"r"),F=(f,n)=>{const a=s(n+"hp",o,f*.095,-.045,0);r(a,R(.43,.082,.056),d.body),r(a,R(.24,.098,.076),d.cloth);const h=s(n+"kn",a,0,-.43,0);r(h,R(.41,.055,.036),d.body);const v=s(n+"an",h,0,-.41,0);return r(v,D(.04,.036,.115,14,10),d.body,0,-.03,.055),{hp:a,kn:h,an:v}},q=F(1,"l"),T=F(-1,"r"),w=new se;w.visible=!1,e.add(w);const G=new j(new ve(.012,.034,.78).translate(0,0,.5),te(d.steel)),U=new j(new $(.017,.017,.26,10).rotateX(Math.PI/2).translate(0,0,0),te(d.cloth)),A=new j(new $(.045,.045,.008,18).rotateX(Math.PI/2).translate(0,0,.13),te(d.steel));[G,U,A].forEach(f=>{f.frustumCulled=!1,w.add(f)});const O=new Q,X=new Q,z=new ie,N=new ie,Y=new M,Z=new M,E=new M(1,1,1),x=new M;function re(f,n=-1){const a=h=>f[C[h]];if(o.position.set(a("px"),a("py"),a("pz")),o.rotation.set(a("rx"),a("ry"),a("rz"),"YXZ"),t.spine.rotation.set(-a("sp"),a("spt"),a("spb"),"YXZ"),t.chest.rotation.set(-a("ch"),a("cht"),a("chb"),"YXZ"),t.neck.rotation.set(-a("nk"),a("nkt"),0,"YXZ"),t.head.rotation.set(-a("hd"),0,0),k.sh.rotation.set(-a("lsf"),a("lst"),a("lsa"),"ZXY"),S.sh.rotation.set(-a("rsf"),a("rst"),-a("rsa"),"ZXY"),k.el.rotation.set(-a("lef"),0,0),S.el.rotation.set(-a("ref"),0,0),q.hp.rotation.set(-a("lhf"),a("lht"),a("lha"),"ZXY"),T.hp.rotation.set(-a("rhf"),a("rht"),-a("rha"),"ZXY"),q.kn.rotation.set(a("lkf"),0,0),T.kn.rotation.set(a("rkf"),0,0),q.an.rotation.set(-a("laf"),0,0),T.an.rotation.set(-a("raf"),0,0),t.knot.rotation.set(0,0,0),n>=0){w.visible=!0,e.updateMatrixWorld(!0),X.copy(o.matrixWorld).multiply(new Q().compose(x.set(.2,.02,.08),N.setFromEuler(new fe(.05,.35,-.18)),E)),O.copy(S.wr.matrixWorld).multiply(new Q().compose(x.set(0,-.06,.02),z.setFromEuler(new fe(Math.PI/2-.1,0,0)),E)),X.decompose(Y,z,x);const h=z.clone();O.decompose(Z,N,x),w.position.lerpVectors(Y,Z,n),w.quaternion.slerpQuaternions(h,N,n)}else w.visible=!1;e.updateMatrixWorld(!0)}const V=(f,n=new M)=>{const a=t[f]??(f==="sword"?w:e);return n.setFromMatrixPosition(a.matrixWorld)};function I(f,n=new M){switch(e.updateMatrixWorld(!0),f){case"lfist":return n.set(0,-.05,.01).applyMatrix4(k.wr.matrixWorld);case"rfist":return n.set(0,-.05,.01).applyMatrix4(S.wr.matrixWorld);case"lelbow":return n.set(0,0,-.03).applyMatrix4(k.el.matrixWorld);case"relbow":return n.set(0,0,-.03).applyMatrix4(S.el.matrixWorld);case"lknee":return n.set(0,0,.05).applyMatrix4(q.kn.matrixWorld);case"rknee":return n.set(0,0,.05).applyMatrix4(T.kn.matrixWorld);case"lshin":return n.set(0,-.28,.03).applyMatrix4(q.kn.matrixWorld);case"rshin":return n.set(0,-.28,.03).applyMatrix4(T.kn.matrixWorld);case"head":return n.set(0,.105,0).applyMatrix4(t.head.matrixWorld);case"chest":return n.set(0,.12,.05).applyMatrix4(t.chest.matrixWorld);default:return n.set(0,0,.9).applyMatrix4(w.matrixWorld)}}function B(){e.updateMatrixWorld(!0);const f=new M,n=new M,a=[],h=(v,P,_)=>{V(v,f),V(P,n),a.push([f.x,f.y,f.z,n.x,n.y,n.z,_])};h("hips","chest",.17),h("chest","neck",.17),I("head",n),V("neck",f),a.push([f.x,f.y,f.z,n.x,n.y,n.z,.1]);for(const v of["l","r"])h(v+"sh",v+"el",.055),h(v+"el",v+"wr",.045),h(v+"hp",v+"kn",.08),h(v+"kn",v+"an",.05);return h("lhp","rhp",.1),a}return{root:e,J:t,apply:re,at:V,tip:I,sword:w,capsules:B}}const _e="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }";function je(e,t){const s=t.height??2.5,r=t.width??2.7,o=t.px??[384,512,768][e.quality],l=Math.round(o*r/s),p=o,c=Ie(),i=new ae;i.add(c.root);const u=new we(-r/2,r/2,s/2,-s/2,.1,60),b=new ne(l,p,{type:le,depthBuffer:!0,samples:0,minFilter:J,magFilter:J}),m=new ne(l,p,{type:le,depthBuffer:!1,samples:0,minFilter:J,magFilter:J}),k={tM:{value:b.texture},uTexel:{value:new W(1/l,1/p)},uT:{value:0},uAmt:{value:1},...t.uniforms},S=new oe({vertexShader:_e,fragmentShader:t.frag,uniforms:k,depthTest:!1,depthWrite:!1}),F=new ae,q=new j(new ce(2,2),S);q.frustumCulled=!1,F.add(q);const T=new oe({transparent:!0,depthWrite:!1,uniforms:{tS:{value:m.texture},uA:{value:1}},blending:be,blendSrc:K,blendDst:t.blend==="add"?K:ge,blendEquation:ye,...t.mask?{blendSrcAlpha:K,blendDstAlpha:K,blendEquationAlpha:xe}:{},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D tS; uniform float uA; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tS, vUv) * uA; }"}),w=new j(new ce(r,s),T);w.frustumCulled=!1,w.renderOrder=12;const G=new M,U=new he,A=new M,O={};function X(z,N,Y,Z,E={}){const x=e.renderer,re=x.getRenderTarget(),V=x.getClearAlpha();x.getClearColor(U),c.root.rotation.y=Y,c.apply(Z,E.sword??-1);const I=new M(0,s*.43,0),B=E.scale??1;z.updateMatrixWorld(!0),G.copy(N).addScaledVector(I,B),A.subVectors(G,z.position).normalize(),u.position.copy(I).addScaledVector(A,-20),u.up.set(0,1,0),u.lookAt(I),u.updateMatrixWorld(!0),x.setRenderTarget(b),x.setClearColor(0,0),x.clear(!0,!0,!0),x.render(i,u);for(const f of["head","chest","lfist","rfist","lknee","rknee","lshin","rshin"])c.tip(f,A),A.project(u),O[f]=[A.x*.5+.5,A.y*.5+.5];k.uT.value=E.t??0,k.uAmt.value=E.amt??1;for(const[f,n]of Object.entries(E.uniforms??{})){const a=k[f];a&&(a.value&&a.value.isVector2&&n&&n.isVector2?a.value.copy(n):a.value=n)}for(const f of["head","chest","lfist","rfist"]){const n=k["u_"+f];n&&n.value.set(...O[f])}x.setRenderTarget(m),x.setClearColor(0,0),x.clear(!0,!1,!1),x.render(F,u),x.setRenderTarget(re),x.setClearColor(U,V),w.position.copy(G),w.quaternion.copy(z.quaternion),w.scale.setScalar(B)}return{mesh:w,fighter:c,update:X,U:k,anchors:O,data:b,out:m,material:T,dispose(){b.dispose(),m.dispose(),S.dispose(),T.dispose(),w.geometry.dispose()}}}const H=["ink","neon","rim","cage","clutter","ticks","fused"],Le=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tM; uniform vec2 uTexel; uniform float uT, uAmt, uSeed, uGather, uScatter, uWrap, uPatch; uniform float uW[8]; uniform vec3 uTint;
uniform vec2 u_head, u_chest, u_lfist, u_rfist;
${Ee}
vec4 M(vec2 uv){ return texture2D(tM, uv); }
float C(vec2 uv){ return smoothstep(.015, .05, M(uv).a); }
float blurC(vec2 uv, float r){ float s = 0.; for (int i = 0; i < 12; i++){ float a = float(i) * 2.39996, d = sqrt((float(i) + .5) / 12.) * r; s += C(uv + vec2(cos(a), sin(a)) * d * uTexel); } return s / 12.; }
float idOf(vec4 m){ return floor(m.a * 8. + .5); }
vec3 nrm(vec4 m){ vec3 n = vec3(m.rg * 2. - 1., 0.); n.z = sqrt(max(1. - dot(n.xy, n.xy), 0.)); return n; }
const vec3 VERM = vec3(.8, .052, .024);
`,Ge=`
vec4 sInk(vec2 uv){
  vec4 m = M(uv); float c = C(uv), id = idOf(m);
  float b1 = blurC(uv, 3.8), b2 = blurC(uv, 9.);
  vec2 q = uv / uTexel;
  float bris = vn(vec2(q.x * .9 + q.y * .25, q.y * .38) + uSeed);
  float swell = .5 + .5 * sin(q.y * .05 + q.x * .021 + uSeed * 3.);
  float width = mix(.2, .52, swell) * (.6 + .6 * bris);
  float edge = smoothstep(width, width * .2, abs(b1 - .5));
  edge = max(edge, smoothstep(.14, .02, abs(blurC(uv, 1.8) - .5)) * .7);
  edge *= mix(.8, 1., smoothstep(.2, .8, vn(q * .42 + uSeed * 2.)));
  float shade = clamp(.55 - m.g * .45 + (m.r - .5) * .4, 0., 1.);
  float lit = clamp(dot(nrm(m), normalize(vec3(-.4, .7, .5))), 0., 1.);
  float dry = .62 + .5 * vn(vec2(q.x * .12 + uSeed, q.y * 1.4)), grain = smoothstep(.2, .55, vn(q * .9 + uSeed * 5.));
  float wash = smoothstep(.1, .6, b2) * mix(.97, .05, smoothstep(.3, .44, lit + (fbm(q * .045 + uSeed) - .5) * .34)) * dry * (.7 + .5 * grain);   // a sumi figure: deep ink in the shadow, paper showing in the light
  float wr = step(1.5, id) * step(id, 2.5), cloth = step(2.5, id) * step(id, 3.5), steel = step(4.5, id);
  float a = max(edge, wash * (1. - .0 * cloth)); a = max(a, cloth * c * (.55 + .3 * fbm(q * .05)));
  vec3 rgb = vec3(.012, .011, .01) * a;
  float redA = wr * c * (.82 + .15 * bris); rgb = mix(rgb, VERM * (.9 + .2 * bris), redA); a = max(a, redA);
  float st = steel * c; rgb = mix(rgb, vec3(.85, .86, .88) * st, st); a = max(a, st * .9);
  return vec4(rgb * min(1., a / max(a, 1e-3)), a);
}
`,Ne=`
vec4 sNeon(vec2 uv){
  vec4 m = M(uv); float c = C(uv), id = idOf(m);
  float b1 = blurC(uv, 2.4), g1 = blurC(uv, 10.), g2 = blurC(uv, 26.);
  float tube = smoothstep(.17, .0, abs(b1 - .5) - .035);
  vec2 d = uTexel * 2.2;
  float ne = length(M(uv + vec2(d.x, 0.)).rg - M(uv - vec2(d.x, 0.)).rg) + length(M(uv + vec2(0., d.y)).rg - M(uv - vec2(0., d.y)).rg);
  float inner = smoothstep(.09, .34, ne) * c * .34;
  vec3 tint = pow(uTint, vec3(2.2)), hot = mix(tint, vec3(1., .95, .9), .6);
  float w = step(1.5, id) * step(id, 2.5);
  vec3 line = mix(hot, mix(VERM * 3., vec3(1., .8, .7), .35), w);
  vec3 col = line * (tube * 2.8 + inner * .9) + tint * (g1 * .8 + g2 * .55) * (1. - c * .92) + tint * c * .02;
  return vec4(col, clamp(tube + inner + c * .12, 0., 1.) * .85);
}
`,De=`
vec4 sRim(vec2 uv){
  vec4 m = M(uv); float c = C(uv); if (c < .01) return vec4(0.);
  float id = idOf(m); vec3 n = nrm(m);
  vec3 L = normalize(vec3(-.18, .96, .22));                         // the cone, straight above
  float dif = max(dot(n, L), 0.), rim = pow(1. - n.z, 3.3), up = smoothstep(-.25, .7, n.y);
  vec3 warm = pow(vec3(1., .74, .38), vec3(2.2));
  vec2 q = uv / uTexel;
  float sw = step(.72, vn(q * .55 + uSeed)) * (.55 + .45 * sin(uT * 6. + q.x * .13));   // sweat glints
  vec3 H = normalize(L + vec3(0., 0., 1.)); float spec = pow(max(dot(n, H), 0.), 44.) * (.3 + sw * 3.);
  vec3 col = vec3(.0045, .004, .004) * (.4 + dif) + warm * (rim * up * 3.6 + rim * .25 + dif * dif * .1) + warm * spec * 2.1;
  if (id > 1.5 && id < 2.5) col = VERM * (.1 + dif * 1.5) + warm * rim * up * .8;
  if (id > 2.5 && id < 3.5) col = vec3(.004) + warm * rim * up * 1.3 + VERM * smoothstep(.02, .0, abs(m.b * 2. - .86)) * .8;
  if (id > 4.5) col = vec3(.9) * (.1 + dif * 2.) + warm * rim * 2.;
  return vec4(col, c);
}
`,He=`
vec4 sCage(vec2 uv){
  vec4 m = M(uv); float c = C(uv); if (c < .01) return vec4(0.);
  float id = idOf(m); vec3 n = nrm(m);
  vec3 L = normalize(vec3(.12, .97, .2));
  float key = max(dot(n, L), 0.), rim = pow(1. - n.z, 3.3), up = smoothstep(-.25, .7, n.y);
  vec3 cold = pow(vec3(.9, .94, 1.), vec3(2.2));
  vec2 q = uv / uTexel;
  float sw = step(.72, vn(q * .6 + uSeed + 3.)) * (.55 + .45 * sin(uT * 5. + q.y * .11));
  vec3 H = normalize(L + vec3(0., 0., 1.)); float spec = pow(max(dot(n, H), 0.), 44.) * (.3 + sw * 3.);
  vec3 col = vec3(.004, .0045, .005) * (.4 + key) + cold * (rim * up * 3.4 + rim * .25 + key * key * .1) + cold * spec * 1.9;
  if (id > 1.5 && id < 2.5) col = VERM * (.12 + key * 1.5) + cold * rim * up * .7;
  if (id > 2.5 && id < 3.5) col = vec3(.003) + cold * rim * up * 1.1;
  if (id > 4.5) col = cold * (.1 + key * 2.) + cold * rim * 2.;
  return vec4(col, c);
}
`,Ue=`
vec4 sClutter(vec2 uv){
  vec2 q = uv / uTexel; float cell = 6.5, tt = floor(uT * 6.);
  vec2 g = q / cell, id = floor(g), f = fract(g) - .5;
  float b = blurC(uv, 7.), c = C(uv);
  vec2 jit = (h22(id + tt * 1.7 + uSeed) - .5) * .9;
  float hr = h12(id + 3.7);
  float sz = (.16 + .5 * h12(id + tt * .3 + 9.)) * (.5 + b * 1.1);
  float blot = smoothstep(sz, sz * .55, length(f - jit)) * smoothstep(.12, .55, b + (hr - .5) * .35);
  float stray = smoothstep(.08, .02, length(f - jit * 1.4)) * step(.88, h12(id + tt * .1)) * smoothstep(.0, .35, blurC(uv, 22.)) * (1. - c);   // drops thrown off
  float shown = step(h12(id + 5.) , uGather * 1.1);
  float gone = step(uScatter, h12(id + 11.) * 1.2);
  float a = max(blot, stray) * shown * mix(1., gone, step(.001, uScatter));
  float wr = step(1.5, idOf(M(uv))) * step(idOf(M(uv)), 2.5) * c * shown * .0;
  vec3 rgb = mix(vec3(.012, .011, .01), VERM, wr) * a;
  return vec4(rgb, a * .95);
}
`,Xe=`
float lineSeg(vec2 p, vec2 a, vec2 b, float w){ vec2 pa = p - a, ba = b - a; return smoothstep(w, w * .4, length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.))); }
vec4 sTicks(vec2 uv){
  vec4 m = M(uv); float c = C(uv); if (c < .01) return vec4(0.); float id = idOf(m); vec3 n = nrm(m);
  float h = m.b * 2.;
  vec2 q = uv / uTexel, asp = vec2(uTexel.y / uTexel.x, 1.);
  float tickY = smoothstep(.34, .22, abs(fract(h * 46.) - .5)), tickMajor = smoothstep(.2, .1, abs(fract(h * 9.2) - .5));
  float curve = pow(n.z, .5) * (.4 + .6 * smoothstep(-.3, .6, n.y + n.x * .2));
  vec3 gold = pow(vec3(1., .82, .5), vec3(2.2));
  float rim = pow(1. - n.z, 2.4);
  vec3 col = vec3(.004, .0035, .004) + gold * (tickY * .34 + tickMajor * .5) * curve * c + gold * rim * .45;
  if (id > 1.5 && id < 2.5) col = VERM * (.4 + .5 * n.y) + gold * rim * .3;
  // the hands: sweeping the torso from the chest, a minute hand and a red second hand
  vec2 cu = u_chest, p = (uv - cu) * asp * uTexel.y * 1.0;
  vec2 P = (uv - cu) * vec2(1., uTexel.x / uTexel.y) ;
  float R = .2, a1 = uT * .55 + 1.1, a2 = -uT * 3.2 + 2.;
  float hand = lineSeg(P * vec2(1., 1.), vec2(0.), vec2(cos(a1), sin(a1)) * R, .0065) + lineSeg(P, vec2(0.), vec2(cos(a1 + 2.6), sin(a1 + 2.6)) * R * .55, .0075);
  float sec = lineSeg(P, vec2(0.), vec2(cos(a2), sin(a2)) * R * 1.12, .0035);
  float ring = smoothstep(.006, .0, abs(length(P) - R * 1.15)) * .6;
  col += gold * (hand * 2. + ring) * c + VERM * 3. * sec * c;
  return vec4(col, c);
}
`,Ye=`
vec4 sFused(vec2 uv){
  vec4 m = M(uv); float h = m.b * 2., c = C(uv);
  float pv = vn(vec2(h * 2.4 + m.r * 1.6, m.g * 2. + uSeed)) + .35 * vn(uv * 9.);
  float pch = floor(pv * 3.0), rank = pch < 1. ? 1. : (pch < 2. ? 3. : 2.), keep = step(vn(uv / uTexel * .05 + uSeed), clamp(1. - (uPatch - (rank - 1.)), 0., 1.));   // the clutter goes first, then the repetition's neon, then the clock
  vec4 a = sClutter(uv), b = sTicks(uv), n = sNeon(uv);
  vec4 o = pch < 1. ? a : (pch < 2. ? b : n);
  return o * keep;
}
`,Ze={ink:Ge,neon:Ne,rim:De,cage:He,clutter:Ue,ticks:Xe,fused:Ye},Be={ink:"sInk",neon:"sNeon",rim:"sRim",cage:"sCage",clutter:"sClutter",ticks:"sTicks",fused:"sFused"};function $e(e){const t=new Set(e);t.has("fused")&&(t.add("clutter"),t.add("ticks"),t.add("neon"));const r=H.filter(l=>t.has(l)).map(l=>Ze[l]).join(`
`),o=`void main(){ vec4 o = vec4(0.);
${e.map(l=>`  if (uW[${H.indexOf(l)}] > .001) o += ${Be[l]}(vUv) * uW[${H.indexOf(l)}];`).join(`
`)}
  gl_FragColor = o * uAmt; gl_FragColor.a = min(gl_FragColor.a, 1.); }`;return Le+r+o}const Qe=(e,t)=>Object.fromEntries(H.map((s,r)=>[s,t[s]??0]));function Je(e,t,s={}){const r={value:new Array(8).fill(0)},o=je(e,{frag:$e(t),blend:s.blend,mask:s.mask,height:s.height,width:s.width,px:s.px,uniforms:{uW:r,uTint:{value:new he(s.tint??"#ff2d95")},uSeed:{value:s.seed??3},uGather:{value:1},uScatter:{value:0},uWrap:{value:0},uPatch:{value:0},u_head:{value:new W},u_chest:{value:new W},u_lfist:{value:new W},u_rfist:{value:new W},...s.uniforms}});return Object.assign(o,{names:t,set(l){const p=Qe(t,l);H.forEach((c,i)=>{r.value[i]=p[c]})}})}function at(e,t,s=0){const r=Object.keys(ue),o=r.slice(s*8,s*8+8),l=new ae,p=[],c=u=>new M((u%4-1.5)*2.7,-Math.floor(u/4)*2.7,0);o.forEach((u,b)=>{const m=Je(e,[t],{seed:b+1,px:512});m.set({[t]:1}),p.push(m),m.mesh.position.copy(c(b)),l.add(m.mesh)});const i=new Ae(30,1,.1,100);return{scene:l,camera:i,names:o,update(u,b){i.aspect=b,i.position.set(0,-1.2,14.5),i.lookAt(0,-1.2,0),i.updateProjectionMatrix(),i.updateMatrixWorld(!0),o.forEach((m,k)=>{const S=c(k).add(new M(0,-1.075,0)),F=m==="iaido"||m==="sheath"?0:m==="draw"||m==="follow"?1:-1;p[k].update(i,S,.6,ue[m],{t:u,sword:F,amt:1}),p[k].mesh.position.copy(c(k))})},dispose(){p.forEach(u=>u.dispose())}}}export{ue as P,Ie as b,Je as f,We as l,rt as m,at as p,tt as r,st as s};
