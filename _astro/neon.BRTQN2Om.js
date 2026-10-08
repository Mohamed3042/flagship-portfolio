import{c as sa,aP as ia,aM as Vt,i as V,C as F,aH as Ae,ao as K,aq as pe,M as q,a as re,ac as jt,ad as Ge,s as lt,a4 as vt,V as g,aE as ra,G as $e,bn as la,bc as va,ai as ca,bo as ua,ag as Ie,P as da,j as nt,b as Tt,Y as fa,_ as Wt,x as pa,aF as qt,al as Bt,a9 as _t,q as ma,y as ha,H as ga,t as wa,Z as xa,a6 as P,r as Me,o as Et}from"./EditionWorld.astro_astro_type_script_index_0_lang.5PJRRDCZ.js";import{F as Xe,C as fe,f as ba,i as ya,s as Sa,a as Ne,r as Ma,S as Ca,l as za,c as Aa,p as Fa,b as Gt,d as De}from"./plan.Dn2DIRKg.js";import{p as Ua}from"./puffs.CEqKiHHI.js";import{r as Ra,f as st,P as l,m as He,b as ka,s as Ve,p as Pa}from"./figure-styles.CA9cmiIh.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */function It(n,s={}){const r=!!s.rtl,t=s.px??260,p=s.family??(r?Xe.ar:Xe.sans),U=(()=>{const h=document.createElement("canvas").getContext("2d");return h.font=`${s.weight??300} ${t}px ${p}`,Math.min(1,(s.width??2048)*.88/Math.max(1,...n.map(d=>h.measureText(d).width)))})(),C=sa(n,{font:`${s.weight??300} ${Math.round(t*U)}px ${p}`,color:"#fff",width:s.width??2048,lineHeight:1.18,rtl:r});C.texture.colorSpace=ia,C.texture.minFilter=Vt,C.texture.generateMipmaps=!0;const v=new V({transparent:!0,depthWrite:!1,blending:pe,blendSrc:K,blendDst:K,blendEquation:Ae,uniforms:{uMap:{value:C.texture},uOn:{value:1},uGain:{value:s.gain??1},uCol:{value:new F(s.color??"#ff3d9a")}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform sampler2D uMap; uniform float uOn, uGain; uniform vec3 uCol; varying vec2 vUv;
      void main(){
        float cov = texture2D(uMap, vUv).a, g1 = textureLod(uMap, vUv, 2.2).a, g2 = textureLod(uMap, vUv, 4.).a, g3 = textureLod(uMap, vUv, 5.6).a;
        vec3 lin = pow(uCol, vec3(2.2));
        float tube = smoothstep(.3, .72, cov);
        vec3 core = mix(lin, vec3(1., .96, .94), tube * .8);
        vec3 col = core * tube * 2.4 + lin * (g1 * 1.7 + g2 * 2.3 + g3 * 3.2);
        float dead = (1. - uOn) * tube * .06;   // an unlit tube: a faint grey glass
        gl_FragColor = vec4(col * uOn * uGain + vec3(dead), 0.);
      }`}),w=new q(new re(1,1/C.aspect),v);return w.frustumCulled=!1,w.renderOrder=40,{mesh:w,mat:v,aspect:C.aspect,dispose(){C.texture.dispose(),v.dispose(),w.geometry.dispose()}}}function it(n,s=0){if(n<0)return 0;if(n>1.1)return 1;const r=U=>{const C=Math.sin(U*91.7+s*13.1)*43758.5453;return C-Math.floor(C)},t=Math.floor(n*18),p=r(t)>.45-n*.4?1:.08;return n>.9?1:p*(.6+.4*r(t+3))}function Oa(n,s,r={}){const t=n*s*2,p=new Float32Array(t*3),U=new Float32Array(t*3),C=new Float32Array(t*3),v=new Float32Array(t),w=new Float32Array(t),h=new Float32Array(t),d=[];for(let y=0;y<n;y++)for(let i=0;i<s;i++)for(let x=0;x<2;x++){const z=(y*s+i)*2+x;if(v[z]=x?1:-1,w[z]=i/(s-1),h[z]=y,i<s-1){const _=z,L=z+2;x===0&&d.push(_,_+1,L,_+1,L+1,L)}}const S=new jt,O=(y,i,x)=>{const z=new Ge(i,x);return z.setUsage(ra),S.setAttribute(y,z),z},B=O("position",p,3),D=O("aPrev",U,3),J=O("aNext",C,3);S.setAttribute("aSide",new Ge(v,1)),S.setAttribute("aU",new Ge(w,1)),S.setAttribute("aId",new Ge(h,1)),S.setIndex(d);const c={uRes:{value:new lt(1,1)},uWidth:{value:r.width??5},uHead:{value:new Array(n).fill(0)},uAmt:{value:new Array(n).fill(1)},uCol:{value:Array.from({length:n},()=>new F("#ff2d95"))},uGain:{value:1},uPx:{value:1}},u=new V({transparent:!0,side:vt,depthWrite:!1,depthTest:!1,blending:pe,blendSrc:K,blendDst:K,blendEquation:Ae,uniforms:c,vertexShader:`
      attribute vec3 aPrev, aNext; attribute float aSide, aU, aId; uniform vec2 uRes; uniform float uWidth, uPx; uniform float uHead[${n}], uAmt[${n}];
      varying float vU, vS, vHead, vAmt, vId;
      void main(){
        int i = int(aId + .5);
        vec4 c0 = projectionMatrix * viewMatrix * vec4(position, 1.), cp = projectionMatrix * viewMatrix * vec4(aPrev, 1.), cn = projectionMatrix * viewMatrix * vec4(aNext, 1.);
        vec2 s0 = c0.xy / c0.w * uRes * .5, sp = cp.xy / cp.w * uRes * .5, sn = cn.xy / cn.w * uRes * .5;
        vec2 d = normalize((sn - sp) + vec2(1e-4, 0.)), nrm = vec2(-d.y, d.x);
        float w = uWidth * uPx * (.35 + .65 * sin(aU * 3.14159) * 0. + .65);
        vec2 off = nrm * aSide * w;
        vU = aU; vS = aSide; vHead = uHead[i]; vAmt = uAmt[i]; vId = aId;
        gl_Position = vec4((s0 + off) / (uRes * .5) * c0.w, c0.z, c0.w);
      }`,fragmentShader:`
      uniform vec3 uCol[${n}]; uniform float uGain; varying float vU, vS, vHead, vAmt, vId;
      void main(){
        int i = int(vId + .5);
        float behind = vHead - vU;
        if (behind < 0.) discard;
        float tail = exp(-behind * 2.2) * .85 + .15, headGlow = exp(-behind * 28.) * 1.6;
        float prof = exp(-vS * vS * 4.5), core = exp(-vS * vS * 22.);
        vec3 lin = pow(uCol[i], vec3(2.2)); vec3 hot = mix(lin, vec3(1., .95, .9), .55);
        vec3 c = hot * core * (tail * 2. + headGlow) + lin * prof * (tail * .8 + headGlow * .6);
        gl_FragColor = vec4(c * vAmt * uGain, 0.);
      }`}),R=new q(S,u);R.frustumCulled=!1,R.renderOrder=45;const I=new g;return{mesh:R,U:c,set(y,i){for(let x=0;x<s;x++){const z=x*3,_=Math.max(0,x-1)*3,L=Math.min(s-1,x+1)*3;for(let $=0;$<2;$++){const X=(y*s+x)*2+$;p.set([i[z],i[z+1],i[z+2]],X*3),U.set([i[_],i[_+1],i[_+2]],X*3),C.set([i[L],i[L+1],i[L+2]],X*3)}}},commit(){B.needsUpdate=D.needsUpdate=J.needsUpdate=!0},dispose(){S.dispose(),u.dispose()},P:I}}const ze=[[0,-.34],[.037,-.34],[.037,-.14],[.034,-.03],[.04,.02],[.052,.07],[.06,.12],[.062,.16],[.056,.195],[.04,.22],[.016,.235],[0,.24]],La=n=>{for(let s=1;s<ze.length;s++)if(n<=ze[s][1]){const r=ze[s-1],t=ze[s],p=(n-r[1])/Math.max(1e-6,t[1]-r[1]);return r[0]+(t[0]-r[0])*p}return 0};function Ta(n={}){const s=new $e,r=n.turns??15,t=n.low?360:720,p=new la(ze.map(([c,u])=>new lt(c,u))),U=new va(p.getPoints(80).map(c=>new lt(Math.max(c.x,0),c.y)),64);{const c=U.attributes.position;for(let u=0;u<c.count;u++){const R=c.getX(u),I=c.getY(u),y=c.getZ(u),i=Math.atan2(y,R),x=Math.max(0,Math.cos(i*4))**3*Math.min(1,Math.max(0,(I-.12)/.06));c.setX(u,R*(1-.1*x)),c.setZ(u,y*(1-.1*x))}}U.computeVertexNormals();const C=new V({uniforms:{uRimA:{value:new F("#ff2d95").convertSRGBToLinear()},uRimB:{value:new F("#ffa229").convertSRGBToLinear()}},vertexShader:"varying vec3 vN, vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vV = -mv.xyz; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }",fragmentShader:"varying vec3 vN, vV; uniform vec3 uRimA, uRimB; void main(){ vec3 n = normalize(vN), v = normalize(vV); float f = pow(1. - max(dot(n, v), 0.), 2.6); vec3 rim = mix(uRimA, uRimB, smoothstep(-.5, .5, n.x)) * f; gl_FragColor = vec4(vec3(.004, .003, .005) + rim * .85, 1.); }"}),v=new q(U,C);s.add(v);{const c=new ca(.0172,16,12),u=new ua(.0175,.07,6,14);for(let I=0;I<4;I++){const y=new q(c,v.material),i=(I-1.5)*.46;y.position.set(Math.sin(i)*.052,.196-Math.abs(I-1.5)*.007,Math.cos(i)*.052),s.add(y)}const R=new q(u,v.material);R.position.set(.062,.11,.02),R.rotation.z=-.32,s.add(R)}const w=[],h=[],d=[],S=[],O=.0125;for(let c=0;c<=t;c++){const u=c/t,R=u*Math.PI*2*r,I=-.075+u*.235+Math.sin(u*40)*.002,y=Math.floor(u*r);for(let i=0;i<2;i++){const x=I+(i?O:-O),z=La(x)+.0021+y*28e-5,_=Math.cos(R),L=Math.sin(R);w.push(_*z,x,L*z),d.push(_,0,L),h.push(u*r*6.2,i)}if(c<t){const i=c*2;S.push(i,i+2,i+1,i+1,i+2,i+3)}}const B=new jt;B.setAttribute("position",new Ie(w,3)),B.setAttribute("normal",new Ie(d,3)),B.setAttribute("uv",new Ie(h,2)),B.setAttribute("aU",new Ie(Array.from({length:(t+1)*2},(c,u)=>Math.floor(u/2)/t),1)),B.setIndex(S);const D={uWind:{value:0},uLP:{value:[new g(-.5,.2,.4),new g(.5,.1,.3),new g(0,.5,-.3)]},uLC:{value:[new F("#ff2d95"),new F("#ffa229"),new F("#ffffff")]},uT:{value:0},uLoose:{value:0}},J=new q(B,new V({uniforms:D,side:vt,vertexShader:"attribute float aU; uniform float uWind; varying vec2 vUv; varying vec3 vW, vN; varying float vU; void main(){ vUv = uv; vU = aU; float lift = smoothstep(uWind - .03, uWind, aU) * .012; vec3 p = position + normal * lift * step(aU, uWind + .02); vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:fe+`
      uniform float uWind, uT; uniform vec3 uLP[3]; uniform vec3 uLC[3]; varying vec2 vUv; varying vec3 vW, vN; varying float vU;
      float weave(vec2 p){ vec2 c = floor(p), f = fract(p) - .5; float over = mod(c.x + c.y, 2.); float a = over > .5 ? 1. - 4. * f.y * f.y : 1. - 4. * f.x * f.x; return a * (.6 + .4 * vn(p * 3.)); }
      void main(){
        if (vU > uWind) discard;
        vec2 p = vec2(vUv.x * 60., vUv.y * 11.);
        float h = weave(p);
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        float fr = pow(1. - max(dot(N, V), 0.), 2.2);
        float edge = smoothstep(.0, .12, vUv.y) * smoothstep(1., .88, vUv.y), seam = smoothstep(.07, .0, min(vUv.y, 1. - vUv.y));
        // the tape is the light: vermilion at the wrist running to amber at the knuckles, the weave read as brightness
        vec3 base = mix(S(vec3(.91, .255, .17)) * 1.05, S(vec3(1., .66, .2)) * 1.35, smoothstep(.0, 1., vU * 1.15));
        vec3 col = base * (.3 + .85 * h) * (.8 + .4 * vn(p * 22.)) * (.55 + .45 * edge) * (1. - .55 * seam);
        col += S(vec3(1., .18, .58)) * fr * (.35 + .4 * h) + S(vec3(1., .9, .8)) * fr * fr * .3;
        float fresh = smoothstep(uWind - .02, uWind, vU);   // the end being laid down burns white
        col += S(vec3(1., .86, .7)) * fresh * 1.1;
        gl_FragColor = vec4(col, 1.);
      }`}));return s.add(J),{group:s,fist:v,tape:J,U:D,set(c,u){D.uWind.value=c,D.uT.value=u},dispose(){U.dispose(),B.dispose()}}}const A=Ca.neon,Ce=[-26,-42,-58,-74],oe=[.6,-.6,.6,-.6],rt=["#ff2d95","#ffa229","#ff2d95","#ffa229"],ce=new g(0,7.2,-9),b=new g(0,1.2,46),m=new g(0,0,-110),ue=new g(-1.15,0,-110),ne=new g(1.05,0,-110),de=1.65,Nt=Math.PI/2,Dt=-Math.PI/2,N=.765,Ht=.768,je=.625,Ke=.0135,Wa=["lfist","rfist","relbow","lelbow","rknee","lknee","rshin","lshin"],qa=`
varying vec3 vW, vN; uniform vec3 uSign[4]; uniform vec3 uSignCol[4]; uniform float uSignOn[4]; uniform vec3 uFog; uniform float uT;
void main(){
  vec3 n = normalize(vN);
  vec2 q = abs(n.x) > .5 ? vW.zy : vW.xy; vec2 cs = vec2(1.05, 1.35), cell = floor(q / cs), f = fract(q / cs);
  float id = h12(floor(vW.xz / 9.));
  float win = step(.16, f.x) * step(f.x, .84) * step(.2, f.y) * step(f.y, .8);
  float lit = step(.88, h12(cell + id * 31.));
  vec3 col = S(vec3(.012, .01, .012)) * (.6 + .8 * fbm3(q * vec2(.8, .5))) * (.75 + .5 * vn(q * 6.));
  vec3 warm = mix(S(vec3(1., .6, .24)), S(vec3(1., .22, .52)), step(.78, h12(cell + 9.)));
  float flick = .85 + .15 * sin(uT * (3. + h12(cell) * 5.) + h12(cell) * 50.);
  col += warm * win * lit * (.05 + .22 * h12(cell + 3.)) * flick;
  vec3 spill = vec3(0.);
  for (int i = 0; i < 4; i++){ float d = length(vW - uSign[i]); spill += uSignCol[i] * uSignOn[i] * (1.1 / (1. + d * d * .05)); }
  col += spill * S(vec3(.1, .09, .09)) * (.5 + .7 * vn(q * 2.)) * .22;
  float dist = length(vW - cameraPosition);
  gl_FragColor = vec4(mix(col, uFog, 1. - exp(-dist * .018)), 1.);
}`,Ba=(n,s,r,t)=>[{t:n-1.1,pos:s,look:r,fov:t,hold:!0},{t:n+1.1,pos:s,look:r,fov:t,hold:!0}];async function Ha(n){await ba([`300 80px ${Xe.sans}`,`300 80px ${Xe.ar}`]);const s=n.lang==="ar",r=n.quality,t=ya(n),p=xa(77),U=new URLSearchParams(location.search),C=new F("#07040a"),v=Sa(n,{pin:2,pout:3,bloom:.26,expo:.96,tone:.5,uniforms:{uFlash:{value:0},uFade:{value:0}},look:"uniform float uFlash, uFade; vec3 look(vec3 c, vec2 uv){ float l = luma(c); c = mix(vec3(l), c, 1.1); c *= 1. - uFade; return c + vec3(1., .78, .9) * uFlash; }"}),w=v.world,h=new da(36,n.viewport.aspect,.1,500);w.add(h);const d=new $e;w.add(d);const S=new $e;S.position.copy(b),w.add(S);const O=Ta({low:r===0});O.group.rotation.order="ZYX",O.group.rotation.set(0,0,-1.1),O.group.scale.set(1.28,1,.78),S.add(O.group);const B=new nt("#ff2d95",1.6,0,2),D=new nt("#ffa229",1.1,0,2),J=new nt("#ffffff",.5,0,2);B.position.set(-.5,.25,.35),D.position.set(.55,.1,.3),J.position.set(0,.5,-.3),S.add(B,D,J);const c=new Tt({color:new F("#ff3d9a").multiplyScalar(5)}),u=new q(new fa(.012,.012,4,12),c);u.rotation.z=Math.PI/2+.5236,u.position.set(0,.05,-.55),S.add(u);const R=new $e;S.add(R);const I=new V({transparent:!0,depthWrite:!1,blending:pe,blendSrc:K,blendDst:K,blendEquation:Ae,uniforms:{uC:{value:new F},uA:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uC; uniform float uA; varying vec2 vUv; void main(){ float d = length(vUv - .5) * 2.; float a = smoothstep(1., .9, d) * (.35 + .65 * smoothstep(.6, .95, d)); gl_FragColor = vec4(pow(uC, vec3(2.2)) * a * uA * .5, 0.); }"});for(let e=0;e<26;e++){const a=new q(new re(1,1),I.clone());a.material.uniforms.uC.value=new F(p()>.5?"#ff2d95":"#ffa229"),a.material.uniforms.uA.value=.4+p()*.8,a.scale.setScalar(.12+p()*.3),a.position.set((p()-.5)*2.6,(p()-.35)*1.5,-1.2-p()*1.8),R.add(a)}const y={uSign:{value:Ce.map((e,a)=>new g(oe[a],4,e))},uSignCol:{value:rt.map(e=>new F(e).convertSRGBToLinear())},uSignOn:{value:[0,0,0,0]},uFog:{value:C.clone().convertSRGBToLinear()},uT:{value:0}},i=new V({uniforms:y,vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:fe+qa}),x=new Wt(1,1,1);for(const e of[-1,1])for(let a=30;a>-150;a-=8){if(a<-110&&Math.abs(a+130)<14)continue;const f=6+p()*3,k=9+p()*17,W=7.2+p()*2,E=new q(x,i);E.scale.set(f,k,W),E.position.set(e*(7.4+f/2+p()*.8),k/2,a),d.add(E)}const z=new q(new re(46,26),new V({uniforms:{uT:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:fe+`uniform float uT; varying vec2 vUv; void main(){
      vec2 p = (vUv - .5) * vec2(1.77, 1.); float arch = smoothstep(.0, .02, .3 - abs(p.x)) * smoothstep(.0, .03, .42 - p.y);
      float d = length(p * vec2(1., 1.1) - vec2(0., -.05));
      vec3 glow = mix(S(vec3(1., .78, .45)), S(vec3(1., .35, .5)), smoothstep(.0, .5, d));
      vec3 col = S(vec3(.01, .008, .012)) + glow * exp(-d * 4.5) * .08 * (.8 + .2 * fbm(p * 5. + uT * .1));
      col += S(vec3(1., .9, .75)) * arch * smoothstep(.34, .0, d) * .1;
      gl_FragColor = vec4(col, 1.);
    }`}));z.position.set(0,12,-140),d.add(z);const _=n.films.slice(Ne.neon[0],Ne.neon[0]+Ne.neon[1]).map(e=>Ra(n,e,t)),L=new pa(new Uint8Array([8,8,8,255]),1,1);L.needsUpdate=!0;const $=t?3.6:6.1,X=t?5.3:3.7,Ye=.3,ct=Ce.map((e,a)=>{const f=new V({transparent:!0,depthWrite:!1,blending:pe,blendSrc:K,blendDst:qt,uniforms:{uTex:{value:L},uHas:{value:0},uLive:{value:0},uAsp:{value:$/X},uCAsp:{value:1.7777777777777777},uOn:{value:0},uT:{value:0},uSeed:{value:a*3.7},uCol:{value:new F(rt[a])}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:fe+`
        uniform sampler2D uTex; uniform float uHas, uLive, uAsp, uCAsp, uOn, uT, uSeed; uniform vec3 uCol; varying vec2 vUv;
        float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
        void main(){
          float k = ${(1+2*Ye).toFixed(2)};
          vec2 p = (vUv - .5) * vec2(uAsp, 1.) * k, half_ = vec2(uAsp, 1.) * .5;
          vec3 lin = pow(uCol, vec3(2.2));
          float dO = sdRB(p, half_ - .03, .1), dI = sdRB(p, half_ - .1, .06), aa = fwidth(dO) * 1.3;
          float tube1 = smoothstep(.0105 + aa, .0035, abs(dO)), tube2 = smoothstep(.007 + aa, .0025, abs(dI));
          float glow = exp(-abs(dO) * 24.) * .45 + exp(-abs(dO) * 6.) * .14 + exp(-abs(dI) * 20.) * .22;
          float flick = .94 + .06 * sin(uT * 53. + uSeed) * sin(uT * 7.1);
          float inside = smoothstep(aa, -aa, dI - .012), back = smoothstep(aa, -aa, dO - .02);
          vec2 hi = half_ - .1; vec2 fp = p / hi * .5 + .5; float ai = hi.x / hi.y;
          vec2 s = ai > uCAsp ? vec2(1., uCAsp / ai) : vec2(ai / uCAsp, 1.); vec2 fuv = (fp - .5) * s + .5;
          vec3 f = uHas > .5 ? texture2D(uTex, fuv).rgb : S(vec3(.04, .02, .03));
          if (uLive > .5) f = pow(f, vec3(2.2));
          f *= .975 + .025 * sin(vUv.y * 600. + uT * 5.);      // the film as it is, a hair of scanline
          f = f * 1.45; f = f / (1. + .3 * f);   // full brightness: a straight gain (blacks stay black), the whites eased so a card never blooms
          vec3 col = vec3(0.); float a = back;
          col += S(vec3(.006, .005, .007)) * back;
          col = mix(col, f, inside * smoothstep(.0, 1., uOn + .1));
          vec3 hot = mix(lin, vec3(1., .96, .93), .55);
          col += hot * (tube1 + tube2 * .85) * 2.4 * uOn * flick + lin * glow * 1.6 * uOn * flick * (1. - inside);   // no glow over the film itself
          col += S(vec3(.4, .38, .4)) * (tube1 + tube2) * (1. - uOn) * .04;
          a = max(a, tube1);
          gl_FragColor = vec4(col, a);
        }`}),k=new q(new re(1,1),f);k.renderOrder=31,d.add(k);const W=new q(new Wt(.06,8,.06),new Tt({color:"#030203"}));d.add(W);const E=W.clone();return d.add(E),{mesh:k,m:f,rod:W,rod2:E,z:e,i:a}}),le=It(s?[De.round[1].ar]:[De.round[1].en],{rtl:s,color:"#ff2d95",weight:300,px:s?300:280,gain:1.1}),me=It(s?[De.art[1].ar]:[De.art[1].en.toUpperCase()],{rtl:s,color:"#ffa229",weight:300,px:s?260:190,gain:.95});le.mesh.position.copy(ce),le.mesh.scale.setScalar(t?7.5:12.5),me.mesh.position.set(0,ce.y-(t?2.1:3.3),ce.z),me.mesh.scale.setScalar(t?4.6:7.2),d.add(le.mesh,me.mesh);const ut=[320,448,640][r],Kt=[224,288,384][r],$t=[3,5,6][r],he=st(n,["neon"],{tint:"#ffc777",seed:2,px:ut});he.set({neon:1}),d.add(he.mesh);const ge=st(n,["neon"],{tint:"#ff2d95",seed:5,px:ut});ge.set({neon:1}),d.add(ge.mesh);const Qe=Array.from({length:$t},(e,a)=>{const f=st(n,["neon"],{tint:a%2?"#ffa229":"#ff2d95",seed:9+a,px:Kt});return f.set({neon:1}),d.add(f.mesh),f}),Fe=[{t:.56,pose:l.stand},{t:.605,pose:l.stance}];[l.jab,l.cross,l.elbow,He(l.elbow),l.knee,He(l.knee),l.roundhouse,He(l.roundhouse)].forEach((e,a)=>{const f=je+Ke*a;Fe.push({t:f-.0045,pose:a%2?He(l.stance):l.stance,ease:"io"},{t:f,pose:e,ease:"back"},{t:f+.0045,pose:l.stance,ease:"io"})}),Fe.push({t:.752,pose:l.stance},{t:N-.008,pose:l.stance,ease:"io"},{t:N,pose:l.roundhouse,ease:"snap"},{t:N+.06,pose:l.roundhouse,ease:"lin"},{t:.9,pose:l.roundhouse});const Ue=[{t:.58,pose:l.stance}];for(let e=0;e<9;e++){const a=.6+e*.0145;Ue.push({t:a,pose:e%3===2?l.roundhouse:l.guard,ease:e%3===2?"back":"io"},{t:a+.007,pose:l.stance,ease:"io"})}Ue.push({t:N-.002,pose:l.guard},{t:N+.012,pose:l.hit,ease:"snap"},{t:.9,pose:l.hit});const dt=new Float32Array(l.stand.length),ft=new Float32Array(l.stand.length),pt=new Float32Array(l.stand.length),Y=28,H=Oa(8,Y,{width:[8,10,13][r]});d.add(H.mesh);const Ze=ka(),mt=[],ht=[],Re=new g;Ze.root.rotation.y=Nt,Wa.forEach((e,a)=>{const f=je+Ke*a,k=new Float32Array(Y*3);for(let W=0;W<Y;W++){const E=f-.0062+.0112*(W/(Y-1)),j=Ve(Fe,E,new Float32Array(l.stand.length));Ze.apply(j),Ze.tip(e,Re),k.set([ue.x+Re.x*de,Re.y*de,ue.z+Re.z*de],W*3)}mt.push(k)});{const e=t?.8:1.55,a=t?2.45:2.65;[[[.21,.05],[.21,1.95]],[[.27,1.92],[.95,.52]],[[.95,.52],[1.63,1.92]],[[1.69,.05],[1.69,1.95]],[[2.36,.05],[2.36,1.95]],[[2.6,1.12],[3.57,1.98]],[[2.86,.98],[3.6,.02]],[[.1,-.16],[3.77,-.16]]].forEach(([k,W])=>{const E=new Float32Array(Y*3);for(let j=0;j<Y;j++){const Te=j/(Y-1);E.set([m.x+(k[0]+(W[0]-k[0])*Te-1.935)*e,a+(k[1]+(W[1]-k[1])*Te-1)*e,m.z-2.6],j*3)}ht.push(E)})}H.U.uCol.value.forEach((e,a)=>e.set(a%2?"#ffa229":"#ff3d9a")),H.U.uGain.value=1.7;const Je=[90,160,260][r],we=new Bt,gt=new re(1,1),wt=new Float32Array(Je*4);for(let e=0;e<Je*4;e++)wt[e]=p();we.index=gt.index,we.setAttribute("position",gt.getAttribute("position")),we.instanceCount=Je,we.setAttribute("aR",new _t(wt,4));const xt=new V({transparent:!0,depthWrite:!1,side:vt,blending:pe,blendSrc:K,blendDst:K,blendEquation:Ae,uniforms:{uAge:{value:-1},uO:{value:new g(ne.x-.2,1.6,ne.z)}},vertexShader:`attribute vec4 aR; uniform float uAge; uniform vec3 uO; varying float vK, vH; varying vec2 vUv;
      void main(){
        vUv = position.xy; float age = uAge - aR.x * .06; vK = clamp(age / 2.6, 0., 1.); vH = aR.y;
        vec3 d = normalize(vec3(aR.z * 2. - 1., aR.w * 1.6 - .4, (aR.x - .5) * 1.2)) * (1.2 + aR.y * 3.6);
        vec3 p = uO + vec3(0., (aR.w - .5) * 1.5, 0.) + d * age * .55 - vec3(0., .5 * 1.5 * age * age * .35, 0.);
        float s = (.06 + aR.y * .18) * step(0., age) * (1. - vK * .7);
        float ang = age * (2. + aR.z * 5.) + aR.w * 6., ca = cos(ang), sa = sin(ang);
        vec2 qd = position.xy * vec2(1., .45); qd = vec2(ca * qd.x - sa * qd.y, sa * qd.x + ca * qd.y);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        gl_Position = projectionMatrix * viewMatrix * vec4(p + (right * qd.x + up * qd.y) * s, 1.);
      }`,fragmentShader:"varying float vK, vH; varying vec2 vUv; void main(){ vec3 c = vH < .5 ? vec3(1., .12, .38) : vec3(1., .55, .14); float a = (1. - vK) * (1. - vK) * smoothstep(.55, .2, length(vUv)); gl_FragColor = vec4(mix(c, vec3(1.), .5) * a * 2.2, 0.); }"}),ke=new q(we,xt);ke.frustumCulled=!1,ke.renderOrder=46,d.add(ke);const ee=r>0?new ma(2,2,{type:ga,depthBuffer:!0,resolveDepthBuffer:!1,resolveStencilBuffer:!1,generateMipmaps:!0,minFilter:Vt,magFilter:ha}):null,bt=new V({uniforms:{...y,uRefl:{value:ee?ee.texture:L},uView:{value:v.U.uWorldRes.value},uUse:{value:ee?1:0},uDark:{value:0}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:fe+`
      uniform sampler2D uRefl; uniform vec2 uView; uniform vec3 uSign[4]; uniform vec3 uSignCol[4]; uniform float uSignOn[4]; uniform vec3 uFog; uniform float uT, uUse, uDark; varying vec3 vW;
      float ripple(vec2 p, float sc, float seed){
        vec2 q = p * sc, id = floor(q), f = fract(q) - .5; vec2 c = (h22(id + seed) - .5) * .5;
        float age = fract(uT * (.35 + h12(id + seed) * .3) + h12(id * 1.7 + seed)), r = length(f - c);
        return sin((r - age * .55) * 38.) * exp(-abs(r - age * .55) * 14.) * (1. - age) * step(.35, h12(id + seed + 5.));
      }
      void main(){
        vec2 xz = vW.xz; float dist = length(vW - cameraPosition);
        float pud = smoothstep(.34, .58, fbm(xz * vec2(.2, .12) + vec2(3., 7.)));
        float road = smoothstep(6.2, 5.2, abs(xz.x)), wet = mix(.5, 1., pud);
        float rp = ripple(xz, 2.2, 1.) + ripple(xz, 3.7, 7.);
        float ndv = clamp(normalize(cameraPosition - vW).y, 0., 1.), fres = .12 + .88 * pow(1. - ndv, 2.2);
        vec3 refl = vec3(0.);
        if (uUse > .5) {
          vec2 suv = gl_FragCoord.xy / uView, dsp = vec2(rp * .0045, rp * .0075) * (.4 + pud);
          float lod = mix(3.6, .8, pud) + clamp(dist * .018, 0., 2.);
          refl = textureLod(uRefl, suv + dsp, lod).rgb + textureLod(uRefl, suv + dsp * 2. + vec2(0., .004), lod + 1.2).rgb * .5;
        } else {   // phones: the light of each sign, smeared down the wet road
          for (int i = 0; i < 4; i++){ float dx = vW.x - uSign[i].x, dz = vW.z - uSign[i].z; refl += uSignCol[i] * uSignOn[i] * exp(-dx * dx * .06) * exp(-abs(dz) * .09) * (.5 + .5 * vn(vec2(xz.x * 3., xz.y * .4 + rp))) * .9; }
        }
        vec3 base = S(vec3(.008, .007, .009)) * (.75 + .5 * vn(xz * 3.1)) * (.8 + .4 * vn(xz * .9));
        vec3 spill = vec3(0.);
        for (int i = 0; i < 4; i++){ float d = length(vW - uSign[i] * vec3(1., .2, 1.)); spill += uSignCol[i] * uSignOn[i] * exp(-d * .11) * .06; }
        float dash = step(.55, fract(xz.y / 4.5)) * smoothstep(.22, .12, abs(xz.x)) * road;
        base += S(vec3(.6, .5, .3)) * dash * .05 * wet;
        vec3 col = base + spill * (.5 + .5 * wet) * base * 6. + refl * fres * mix(.3, 1., pud) * mix(.35, 1., road);
        gl_FragColor = vec4(mix(col, uFog, 1. - exp(-dist * .014)), 1.);
      }`}),xe=new q(new re(500,500).rotateX(-Math.PI/2),bt);xe.position.set(0,0,-100),w.add(xe);const et=Math.round([900,2600,5200][r]*(t?.65:1)),be=new Bt,yt=new re(1,1),St=new Float32Array(et*4);for(let e=0;e<et*4;e++)St[e]=p();be.index=yt.index,be.setAttribute("position",yt.getAttribute("position")),be.instanceCount=et,be.setAttribute("aR",new _t(St,4));const Xt=[...Ce.map((e,a)=>new g(oe[a],4.2,e)),new g(ue.x,1.6,ue.z),new g(ne.x,1.6,ne.z),new g(ce.x,ce.y,ce.z)],Yt=[...rt.map(e=>new F(e).convertSRGBToLinear()),new F("#ffc777").convertSRGBToLinear(),new F("#ff2d95").convertSRGBToLinear(),new F("#ff2d95").convertSRGBToLinear()],T={uClock:{value:0},uCam:{value:new g},uAnc:{value:new g},uCen:{value:new g},uFig:{value:9},uSc:{value:t?2:1},uFreeze:{value:0},uShock:{value:new wa(0,0,0,-1)},uLP:{value:Xt},uLC:{value:Yt},uLOn:{value:[0,0,0,0,0,0,0]},uBase:{value:0}},Qt=new V({transparent:!0,depthWrite:!1,blending:pe,blendSrc:K,blendDst:qt,blendEquation:Ae,uniforms:T,vertexShader:`
      attribute vec4 aR; uniform float uClock, uFreeze, uBase, uFig, uSc; uniform vec3 uCam, uAnc, uCen; uniform vec4 uShock; uniform vec3 uLP[7]; uniform vec3 uLC[7]; uniform float uLOn[7];
      varying float vA, vFz, vBr, vDk, vSel; varying vec2 vQ; varying vec3 vC;
      void main(){
        vFz = uFreeze;
        vec3 anc = mix(uCam, uAnc, smoothstep(.0, .05, uFreeze));        // the field follows the camera until time stops, then it is the street's
        vec3 bx = vec3(30., 15., 46.);
        vec3 p = vec3(anc.x + (aR.x - .5) * bx.x, 0., anc.z + 6. - aR.y * bx.z);
        float sp = 15. + aR.w * 5.; p.y = bx.y - mod(aR.z * bx.y + uClock * sp, bx.y);
        float bright = 0.;
        if (uShock.w > 0.) {   // the wave: the air inside it is swept clear, the drops ride its front
          vec3 c0 = uShock.xyz, dv = p - c0; float dd = length(dv), Rr = uShock.w;
          if (dd < Rr) {p = c0 + dv / max(dd, 1e-3) * (Rr - .02 - .9 * aR.z * aR.w); bright += 2.4 * exp(-(Rr - dd) * .32);}
          else bright += 1.5 * exp(-pow((dd - Rr) / .5, 2.));
        }
        vec3 L = vec3(0.);
        for (int i = 0; i < 7; i++){ vec3 dv2 = p - uLP[i]; L += uLC[i] * uLOn[i] / (1. + dot(dv2, dv2) * .16); }
        L = L * 1.5 + vec3(1., .5, .8) * bright + vec3(.05, .03, .05) * uBase;
        float len = mix(.5 + aR.w * .45, (.2 + .22 * aR.w) * uSc, uFreeze), w = mix(.014, (.1 + .04 * aR.y) * uSc, uFreeze);
        vec3 toCam = cameraPosition - p; toCam.y = 0.; vec3 right = normalize(vec3(toCam.z, 0., -toCam.x) + 1e-5);
        vec3 q = p + vec3(0., position.y * len, 0.) + right * position.x * w;
        float dist = length(cameraPosition - p);
        vA = mix((1. - smoothstep(6., 40., dist)) * (.35 + .65 * aR.w), (1. - smoothstep(16., 56., dist)) * smoothstep(.5, 2.4, dist), uFreeze);
        vBr = bright; vSel = fract(aR.x * 7.31 + aR.z * 3.7); vQ = position.xy; vC = L * vA;
        vec3 ray = p - cameraPosition, toFig = uCen - cameraPosition;   // is this drop behind the bodies, and do they cover it?
        float perp = length(cross(ray, toFig)) / max(length(ray), 1e-3);
        vDk = (dist < uFig + .4 || perp > 2.6) ? 1. : 0.;
        gl_Position = projectionMatrix * viewMatrix * vec4(q, 1.);
      }`,fragmentShader:fe+`
      varying float vA, vFz, vBr, vDk, vSel; varying vec2 vQ; varying vec3 vC;
      void main(){
        float streak = smoothstep(.5, .0, abs(vQ.x)) * smoothstep(.5, .35, abs(vQ.y));
        vec3 sc = vC * streak * (1. - vFz);
        if (vFz < .001) {gl_FragColor = vec4(sc, 0.); return;}
        // a frozen drop: teardrop, round at the foot, pinched at the top
        vec2 q = vQ * 2.;
        float w = .6 * sqrt(max(0., 1. - q.y * q.y)) * mix(1., .78, smoothstep(-.2, 1., q.y)), edge = w - abs(q.x), fw = fwidth(edge) * 1.3;
        float body = smoothstep(-fw, fw * 2., edge);
        if (body < .004 && vFz > .99) discard;
        vec2 n2 = vec2(q.x / max(w, .05), q.y * .9);
        float rr = dot(n2, n2), nz = sqrt(max(0., 1. - rr * .92));
        vec3 tA = vSel < .5 ? S(vec3(1., .15, .55)) : (vSel < .82 ? S(vec3(1., .6, .16)) : S(vec3(.78, .88, 1.)));
        vec3 tB = vSel < .5 ? S(vec3(1., .6, .16)) : (vSel < .82 ? S(vec3(1., .2, .52)) : S(vec3(1., .82, .92)));
        float refr = smoothstep(-.9, .9, -n2.y * .85 + n2.x * .45);                      // the far neon seen through the bead: upside down and squeezed
        vec3 inner = mix(tA, tB, refr) * (.035 + .3 * smoothstep(.45, 1., sqrt(rr)));
        float band = smoothstep(.16, .0, abs(n2.y * .9 - .12 - n2.x * .55)) * smoothstep(1., .55, sqrt(rr));   // a line of the far neon, bent across the bead
        float cau = smoothstep(.62, .0, length(vec2(n2.x * .85, n2.y + .56))) * smoothstep(.1, .7, -n2.y);   // the light bent to a crescent at the foot
        float rim = pow(1. - nz, 2.3);
        float h1 = smoothstep(.2, .0, length((n2 - vec2(-.3, .42)) * vec2(1., 1.5))), h2 = smoothstep(.13, .0, length(n2 - vec2(.34, -.52)));
        vec3 col = inner + tA * rim * 1.7 + mix(tB, vec3(1.), .35) * (cau * 2.4 + band * 1.1) + vec3(1., .97, .92) * h1 * 3.4 + tB * h2 * 1.8;
        col *= (.55 + vBr * .9) * vA * body;
        float a = body * vA * (.5 + .25 * rim) * vDk;                                     // the bead itself is darker than the air round it
        gl_FragColor = vec4(sc + col, a);
      }`}),ve=new q(be,Qt);ve.frustumCulled=!1,ve.renderOrder=30,w.add(ve);const te=Ua({count:[10,20,32][r],low:"#ff2a8a",high:"#ff9a40",size:[5,10],rise:.15,spread:[20,0,110],life:14,loop:!0,seed:2,gain:.03});te.U.uOrigin.value.set(0,2.6,-60),w.add(te.mesh);const Mt=t?11.5:9.2,Zt=t?50:36,Ct=(t?0:2.5)*(s?-1:1),Pe=e=>Ba(Gt.neon[e]*A,[oe[e]-Ct*.4,1.6,Ce[e]+Mt],[oe[e]-Ct,t?3.6:3.3,Ce[e]],Zt),se=t?40:36,ae=t?7.2:8.4;ue.x=t?-.72:-1.15,ne.x=t?.55:1.05;const Oe=(e,a=1.7,f=ae)=>[m.x+Math.sin(e*zt)*f,a,m.z+Math.cos(e*zt)*f],zt=Math.PI/180,Jt=Ma([{t:0,pos:[b.x+.34,b.y+.04,b.z+.92],look:[b.x+.05,b.y+.06,b.z],fov:t?56:30,hold:!0},{t:3.8,pos:[b.x-.05,b.y+.1,b.z+.64],look:[b.x+.06,b.y+.07,b.z],fov:t?50:28},{t:.092*A,pos:[b.x-.12,b.y+.14,b.z+.5],look:[b.x+.08,b.y+.08,b.z],fov:t?44:26,hold:!0},{t:.097*A,pos:[0,1.7,17],look:[0,4.4,-20],fov:38,hold:!0},{t:.115*A,pos:[0,1.65,8],look:[0,5,-26],fov:38},...Pe(0),...Pe(1),...Pe(2),...Pe(3),{t:.6*A,pos:[0,1.7,-94],look:[0,2.2,-118],fov:se},{t:.64*A,pos:[0,t?1.45:1.65,m.z+ae],look:[m.x-(t?.08:0),t?1.05:1.4,m.z],fov:se,hold:!0},{t:.762*A,pos:[0,t?1.45:1.65,m.z+ae],look:[m.x-(t?.08:0),t?1.05:1.4,m.z],fov:se,hold:!0},{t:.8*A,pos:Oe(48,1.6,ae*.8),look:[m.x,1.5,m.z],fov:se},{t:.86*A,pos:Oe(105,1.3,ae*.6),look:[m.x,1.5,m.z],fov:se},{t:.92*A,pos:Oe(160,1.8,ae*.68),look:[m.x,1.5,m.z],fov:se},{t:A,pos:Oe(205,2.3,ae*.88),look:[m.x,1.6,m.z],fov:se,hold:!0}]),ye=U.get("dbg")==="poses"?Pa(n,U.get("style")??"ink",Number(U.get("page")??0)):null;ye&&(w.children.forEach(e=>{e.visible=!1}),ye.scene.children.slice().forEach(e=>w.add(e)));const At=new F,Ft=new Float32Array(Y*3),Le=new g(.3,1.5,m.z);let tt=-1,Ut=0;const Rt={scene:v.scene,camera:h,light:!1,focus(e){e||_.forEach(a=>a.pause())},update({p:e,t:a,dt:f,v:k,active:W}){const E=za(n,a,f);if(v.tick(a,k),ye){ye.update(a,n.viewport.aspect),v.U.uPin.value=0,v.U.uPout.value=0,v.draw(ye.camera,w,U.get("style")==="ink"?15327435:1447707);return}const j=e*A,Te=n.viewport.aspect,Q=Jt(j),ea=Math.hypot(Q[0]-Q[3],Q[1]-Q[4],Q[2]-Q[5]);t&&j>.097*A&&(Q[6]=Math.max(Q[6],Aa(e>.6?3.1:3.3,ea,Te))),Fa(h,Q,E.x,E.y,j>5?1:.2);const We=e<.1,kt=e>.085;if(S.visible=We,d.visible=xe.visible=ve.visible=te.mesh.visible=kt,We){const o=Et.inOut(Me(.004,.088,e));O.set(o,a);const M=O.U.uLP.value;M[0].copy(B.position).add(b),M[1].copy(D.position).add(b),M[2].copy(J.position).add(b),O.group.rotation.y=a*.06+e*4,c.color.setScalar(1).multiply(new F("#ff3d9a")).multiplyScalar(5*(.85+.15*Math.sin(a*40))),B.intensity=1.5*P(0,.03,e)+.1,D.intensity=1*P(.01,.05,e)}v.U.uFlash.value=(1-Math.abs(Me(.078,.1,e)*2-1))*.9*(e>.078&&e<.1?1:0);let qe=-1,at=1e9;ct.forEach(o=>{const M=h.position.distanceTo(new g(oe[o.i],4.2,o.z));M<at&&(at=M,qe=o.i)});const Pt=W&&e<.6&&at<Mt+3?qe:-1;ct.forEach(o=>{const M=it((e-(Gt.neon[o.i]-.105))*A,o.i),ie=_[o.i],G=ie.frame(o.i===Pt),Z=o.m.uniforms;o.mesh.scale.set($*(1+2*Ye),X*(1+2*Ye),1);const ot=t?4.3:4.5;o.mesh.position.set(oe[o.i],ot,o.z),o.rod.position.set(oe[o.i]-$*.3,ot+X/2+4,o.z-.05),o.rod2.position.set(oe[o.i]+$*.3,ot+X/2+4,o.z-.05),Z.uOn.value=M,Z.uAsp.value=$/X,Z.uCAsp.value=G.asp,Z.uTex.value=G.tex??L,Z.uHas.value=G.tex?1:0,Z.uLive.value=G.live?1:0,Z.uT.value=a,y.uSignOn.value[o.i]=M*(o.i===qe?1:.55),T.uLOn.value[o.i]=M*(o.i===qe?1:.6)}),tt=Pt,y.uT.value=a,le.mat.uniforms.uOn.value=it((e-.1)*A,9)*(1-P(.62,.66,e)),me.mat.uniforms.uOn.value=it((e-.115)*A,5)*(1-P(.62,.66,e)),T.uLOn.value[6]=le.mat.uniforms.uOn.value*.8;const Be=e>N-.001&&e<N+.05,Ot=Le.clone().project(h);v.bell(e>.1&&e<.22?(e-.1)*A:Be?(e-N+.001)*A:-1,Be?Ot.x*.5+.5:.5,Be?Ot.y*.5+.5:.5,Be?1.7:1);const Se=e>.55;he.mesh.visible=ge.mesh.visible=Se;const Lt=1-P(.772,.8,e),_e=e>.808,ta=1-P(.8,.81,e);Se?(Ve(Fe,e,dt),Ve(Ue,e,ft),h.position,he.update(h,ue,Nt,dt,{t:a,amt:P(.56,.6,e),scale:de,uniforms:{}}),ge.update(h,ne,Dt,ft,{t:a,amt:P(.575,.62,e)*(_e?0:1),scale:de}),Qe.forEach((o,M)=>{const ie=(M+1)*.0042;Ve(Ue,e-ie,pt);const G=(M+1)*(t?.17:.5)*Lt,Z=new g(ne.x+G,0,ne.z-(M+1)*(t?.55:.1)*Lt);o.mesh.visible=!_e&&e>.6,o.mesh.visible&&o.update(h,Z,Dt,pt,{t:a,amt:P(.595,.64,e)*(.55/(1+.35*M))*ta,scale:de})})):Qe.forEach(o=>{o.mesh.visible=!1});const Ee=Et.inOut(Me(.724,.752,e)),aa=1-P(.766,.778,e);for(let o=0;o<8;o++){const M=mt[o],ie=ht[o];for(let G=0;G<Y*3;G++)Ft[G]=M[G]+(ie[G]-M[G])*Ee;H.set(o,Ft),H.U.uHead.value[o]=Me(je+Ke*o-.0062,je+Ke*o+.005,e)*(1+.5*Ee),H.U.uAmt.value[o]=aa*(.45+.55*(1-Ee)*0+.55*Math.min(1,Ee*2+(e<.73?.4:0)))*(e>.625?1:0)}H.commit(),H.U.uRes.value.set(n.viewport.width*n.viewport.dpr,n.viewport.height*n.viewport.dpr),H.U.uPx.value=1,H.mesh.visible=Se;const oa=1-P(N-.004,Ht,e);Ut+=f*oa,T.uClock.value=Ut,T.uFreeze.value=P(N-.002,Ht+.004,e),T.uAnc.value.set(0,1.4,m.z+ae),T.uCen.value.set(m.x,1.4,m.z),T.uFig.value=h.position.distanceTo(new g(m.x,1.4,m.z));const na=10.5*(1-Math.pow(1-Me(N,.88,e),4));if(T.uShock.value.set(Le.x,Le.y,Le.z,e>N?Math.max(.01,na):-1),T.uBase.value=P(.88,.97,e),T.uLOn.value[4]=Se?1:0,T.uLOn.value[5]=Se?1:0,T.uLOn.value[6]=Math.max(T.uLOn.value[6],0),T.uCam.value.copy(h.position),xt.uniforms.uAge.value=_e?Math.max(0,(e-.808)*A*.42):-1,ke.visible=_e&&e<.93,te.U.uT.value=a,te.U.uFade.value=1,v.U.uFade.value=P(.88,.955,e)*.94,bt.uniforms.uDark.value=0,ee&&kt){const o=n.renderer,M=o.getRenderTarget(),ie=o.getClearAlpha();o.getClearColor(At),xe.visible=ve.visible=te.mesh.visible=S.visible=!1,d.scale.y=-1,d.updateMatrixWorld(!0),o.setRenderTarget(ee),o.setClearColor(C,1),o.clear(!0,!0,!0),o.render(w,h),d.scale.y=1,d.updateMatrixWorld(!0),xe.visible=ve.visible=te.mesh.visible=!0,S.visible=We,o.setRenderTarget(M),o.setClearColor(At,ie)}v.U.uPin.value=1-P(0,.03,e),v.U.uPout.value=P(.96,1,e),v.draw(h,w,We?328198:C)},resize(){if(v.resize(),ee){const{width:e,height:a,dpr:f}=n.viewport;ee.setSize(Math.max(2,Math.round(e*f*.5)),Math.max(2,Math.round(a*f*.5)))}},pick(){return tt>=0?n.films[Ne.neon[0]+tt].url:null},dispose(){v.dispose(),ee?.dispose(),le.dispose(),me.dispose(),te.dispose(),H.dispose(),O.dispose(),he.dispose(),ge.dispose(),Qe.forEach(e=>e.dispose()),_.forEach(e=>e.pause())}};return Rt.resize(n.viewport),await v.warm(h),Rt}export{Ha as default};
