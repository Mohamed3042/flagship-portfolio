import{ac as Nt,_ as Yt,S as jt,C as P,aq as Kt,P as Zt,d as Xt,ao as Jt,D as nt,l as Qt,X as eo,ar as to,al as oo,b as Ue,a2 as ao,M as G,Y as no,as as Ct,G as ro,A as so,ap as At,Z as io,e as lo,s as Lt,t as co,a as uo,$ as vo,ad as fo,K as rt,p as mo,o as V,r as _,N as po}from"./EditionWorld.astro_astro_type_script_index_0_lang.DYMyNWhV.js";import{m as Rt}from"./media-base.CkYm9YKi.js";import{m as st,d as Gt,b as ho,a as wo}from"./monitor.BIjH52D5.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const pe="utility",he="#e8d2a6",go="#c27a44",Mo="#f2b766",j=3.2,S=1.8,ne=42,we=.04,Ee=.1,ge=.1,_t=.9,yo=.1,bo=.5,xo=50,kt=36,Wo=.24,So=.1,Me=16,Co=-3.4,Fe=1.35,ye=8.6,Ao=4,Lo=120,Ut=.56,it=.9;function Ro(n,D,Oe){const r=po(n),C=[],$=D/512,v=[1,.93,.82],Pe=[.86,.9,.94],s=(g,I,d,i,B)=>{const K=Math.max(d,i);if(K<30*$&&r()>.3||K<14*$||B>12){const re=r()<.1,se=re?.74+r()*.12:.2+.46*Math.pow(r(),1.2),y=r()<.33?Pe:v,Z=.96+r()*.06;C.push({x:g,y:I,w:d,h:i,r:y[0]*Z,g:y[1]*Z,b:y[2],lv:se,free:!1,u:(g+d/2)/D,order:0,dist:0});return}const M=.3+r()*.4;d>=i*1.15?(s(g,I,d*M,i,B+1),s(g+d*M,I,d*(1-M),i,B+1)):(s(g,I,d,i*M,B+1),s(g,I+i*M,d,i*(1-M),B+1))};s(0,0,D,Oe,0);for(const g of C)g.free=r()<.42;return C}const Go=`
  uniform sampler2D uMap, uA, uB; uniform float uWipe, uDir, uLevel, uWallR, uWallArc, uWallY0, uWallH, uFlood;
  uniform vec3 uWallC; uniform vec4 uScr; uniform vec2 uFoot;
  varying vec3 vW;
  float h21(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  vec3 film(vec2 uv){
    float x = uDir > 0. ? uv.x : 1. - uv.x, w = uWipe * 1.06 - .03;
    return mix(texture2D(uA, uv).rgb, texture2D(uB, uv).rgb, smoothstep(w + .004, w - .004, x));
  }
  void main(){
    vec3 V = normalize(vW - cameraPosition);
    // a polished surface, not a mirror: a faint ripple in the lacquer bends the reflection a little
    vec2 q = vW.xz * vec2(1.3, 2.2);
    vec3 N = normalize(vec3((n2(q) - .5) * .018, 1., (n2(q + 7.3) - .5) * .018));
    vec3 R = reflect(V, N);
    float fres = .045 + .955 * pow(1. - max(-V.y, 0.), 5.);
    vec3 col = vec3(.0042, .0036, .003) * (.8 + .4 * n2(vW.xz * .7));   // warm graphite lacquer
    // the wall: the reflected ray to the wall's cylinder, its map read soft (the canvas's mipmaps)
    vec2 o = vW.xz - uWallC.xz, d = R.xz; float a = dot(d, d), b = dot(o, d), c = dot(o, o) - uWallR * uWallR;
    float tw = (-b + sqrt(max(b * b - a * c, 0.))) / max(a, 1e-5);
    vec3 H = vW + R * tw; vec2 r = H.xz - uWallC.xz;
    float th = atan(-r.x, -r.y), u = 1. - (th + uWallArc * .5) / uWallArc, v = (H.y - uWallY0) / uWallH;
    vec3 refl = vec3(0.);
    if (u > 0. && u < 1. && v > 0. && v < 1.) refl = textureLod(uMap, vec2(u, v), 2.6).rgb * uLevel * .62 * smoothstep(1., .85, v);
    // the screen: the reflected ray to the screen's plane, in front of the wall; a vertical streak, softer further away
    float ts = (uScr.z - vW.z) / R.z;
    if (R.z < 0. && ts > 0. && ts < tw) {
      vec3 S = vW + R * ts; vec2 s = vec2(S.x / uScr.x, S.y / uScr.y);
      if (abs(s.x) < 1.03 && s.y > -1.15 && s.y < 1.03) {
        refl = vec3(0.);   // the monitor's body hides the wall
        if (abs(s.x) < 1. && abs(s.y) < 1.) {
          vec2 uv = s * .5 + .5; float bl = .006 + .012 * ts;
          refl = (film(uv) + film(uv + vec2(0., bl)) + film(uv - vec2(0., bl))) / 3. * .9;
        }
      }
    }
    col += refl * min(1., fres * 2.4 + .06);
    // the screen's own light on the desk in front of it, and the wall's glow along the foot of the wall
    vec2 pd = vW.xz - vec2(0., .7);
    vec3 pool = (film(vec2(.3, .45)) + film(vec2(.7, .45)) + film(vec2(.5, .75))) / 3.;
    col += pool * exp(-dot(pd * vec2(.4, .75), pd * vec2(.4, .75))) * .2;
    // contact darkening under the stand
    vec2 fd = (vW.xz - uFoot) * vec2(1.6, 2.2);
    col *= 1. - .75 * exp(-dot(fd, fd) * 3.);
    gl_FragColor = vec4(col, 1.);
  }`,_o=`
  uniform sampler2D uA, uB; uniform float uWipe, uDir, uGlow, uHot; uniform vec3 uEdge;
  varying vec2 vUv;
  void main(){
    float x = uDir > 0. ? vUv.x : 1. - vUv.x;   // the download runs with the reading direction
    vec3 a = texture2D(uA, vUv).rgb, b = texture2D(uB, vUv).rgb;
    float w = uWipe * 1.06 - .03, k = smoothstep(w + .004, w - .004, x);
    vec3 col = mix(a, b, k);
    float edge = (1. - smoothstep(0., .03, abs(x - w))) * step(.001, uWipe) * step(uWipe, .999);
    col += uEdge * edge * 1.2;
    vec2 c = vUv - .5;
    col *= .94 + .06 * smoothstep(.75, .1, length(c * vec2(1., 1.6)));
    col += uHot * .06 + uGlow;
    gl_FragColor = vec4(col, 1.);
  }`,Oo=n=>{const D=n.lang==="ar",Oe=D?"ar":"en",r=D?-1:1,C=matchMedia("(prefers-reduced-motion: reduce)").matches,$=Nt(pe),v=fo[pe],{wash:Pe}=Yt[pe],s=new jt,g=new P("#080706"),I=new P(Pe),d=g.clone();s.background=d,s.fog=new Kt("#080706",14,34),s.environment=n.env;const i=new Zt(kt,n.viewport.aspect,.1,120),B=Xt(n.quality?200:90,[20,10,12],"#f2ece0",1.1,41);s.add(B),s.add(new Jt("#f4ece0","#080706",.18));const K=new nt("#fff4e6",.55);K.position.set(-6*r,7,6),s.add(K);const M=new nt(he,1.1);M.position.set(2*r,4,-8),s.add(M);const re=new nt(he,.5);re.position.set(-7*r,1,-3),s.add(re);const se=-S/2-it+.35-.02,y=Qt({radius:Me,arc:Fe,height:ye,rows:Ao,color:1,cells:Lo}),Z=se-.7;y.position.set(0,Z+ye/2,Co+Me),s.add(y);const A=y.material.uniforms,De=A.uWall.value,f=768,b=Math.round(f/De),be=document.createElement("canvas");be.width=f,be.height=b;const t=be.getContext("2d"),z=new eo(be);z.minFilter=to,z.generateMipmaps=!0,z.colorSpace=oo,A.uA.value=z,A.uB.value=z,A.uAspA.value=De,A.uAspB.value=De,A.uLevel.value=Ut,A.uCellSat.value=1,A.uTintAmt.value=0,A.uMix.value=0;const Be=new Ue({side:ao,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime; varying vec2 vUv;
      void main(){
        vec2 p = vec2(1. - vUv.x, vUv.y);
        float s = (p.x - .5) * 2.6 + p.y * .9 - .55 + .03 * sin(uTime * .05);
        float sheen = exp(-s * s * 9.) * .5 + exp(-pow((p.x - .5) * 2.6 + p.y * .9 - .95, 2.) * 60.) * .35;
        float low = smoothstep(.5, .15, p.y);
        gl_FragColor = vec4(vec3(.5, .48, .45) * sheen * .5, .22 + .16 * low + .04 * sheen);
      }`}),xe=new G(new no(Me-.2,Me-.2,ye,64,1,!0,Math.PI-Fe/2,Fe),Be);xe.position.copy(y.position),xe.renderOrder=1,s.add(xe);const ie=Ro(1515,f,b);D&&ie.forEach(e=>{e.x=f-e.x-e.w,e.u=1-e.u});const ze=(S/2-Z)/ye,Et=Math.max(...ie.map(e=>Math.hypot(e.u-.5,((e.y+e.h/2)/b-(1-ze))*b/f)));ie.forEach(e=>{e.dist=Math.hypot(e.u-.5,((e.y+e.h/2)/b-(1-ze))*b/f)/Et});const Ft=ie.filter(e=>e.free);let X=.36,J=.64;const Ot=()=>Ft.forEach(e=>{e.order=Math.min(1,Math.max(0,(r>0?e.u-X:J-e.u)/(J-X)))}),L=new P(go),k=new P(Mo),lt=new P(he),We=new P,m=new P,q=(e,o,x)=>`rgb(${Math.round(Math.min(1,e)*255)},${Math.round(Math.min(1,o)*255)},${Math.round(Math.min(1,x)*255)})`,Se=4;let He=-1;function Pt(e){const o=_(Ze,Xe,e),x=r>0?X+(J-X)*V.inOut(o):J-(J-X)*V.inOut(o),p=C?0:Math.min(_(Ze,Ze+.03,e),1-_(Xe-.03,Xe,e)),N=V.out(_($t,It,e));let c=0,u=0,U=0,h=0;t.globalCompositeOperation="source-over",t.fillStyle="#000",t.fillRect(0,0,f,b);for(const a of ie){const W=(x-a.u)*r,F=C?e>v[0]?1:0:o<=0?0:o>=1?1:V.out(Math.min(1,Math.max(0,W/.03))),St=C||o<=0||o>=1?0:Math.exp(-Math.max(0,W)/.05)*(W>-.004?1:0),R=a.free?C?e>v[1]?1:0:_(de+a.order*(Je-de)*.7,de+a.order*(Je-de)*.7+(Je-de)*.3,e):0,Qe=a.free?F:0;let l=a.lv*(1-.88*Qe);m.setRGB(a.r,a.g,a.b),m.lerp(L,(a.free?.85:.25)*St),l+=(a.free?.45:.1)*St;const ke=_(a.dist*.5,a.dist*.5+.5,N);m.lerp(lt,ke*.7),l=l+(.62-l)*ke*.8;const me=a.x+Se/2,O=a.y+Se/2,oe=a.w-Se,T=a.h-Se;if(oe<1||T<1)continue;const et=t.createLinearGradient(0,O,0,O+T);if(et.addColorStop(0,q(m.r*l*1.22,m.g*l*1.22,m.b*l*1.22)),et.addColorStop(1,q(m.r*l*.62,m.g*l*.62,m.b*l*.62)),t.fillStyle=et,t.fillRect(me,O,oe,T),Qe>.5&&R<1){const w=.42*(Qe-.5)*2*(1-R)*(1-ke);t.fillStyle=q(L.r*w*.22,L.g*w*.2,L.b*w*.18),t.fillRect(me,O,oe,T),t.strokeStyle=q(L.r*w*1.6,L.g*w*1.4,L.b*w*1.2),t.lineWidth=3,t.strokeRect(me+1.5,O+1.5,oe-3,T-3)}if(a.free&&R>0){const w=1-ke,ae=(R>=1?.7:.95)*w,tt=Math.max(1,oe*V.inOut(R)),ot=r>0?me:me+oe-tt,at=t.createLinearGradient(0,O,0,O+T);at.addColorStop(0,q(k.r*ae*1.15,k.g*ae*1.15,k.b*ae*1.15)),at.addColorStop(1,q(k.r*ae*.6,k.g*ae*.6,k.b*ae*.6)),t.fillStyle=at,t.fillRect(ot,O,tt,T),R<1&&(t.fillStyle=q(1,.9,.72),t.fillRect(r>0?ot+tt-2:ot,O,2,T)),c+=k.r*R*w,u+=k.g*R*w,U+=k.b*R*w,h+=R*w}c+=m.r*l*.3,u+=m.g*l*.3,U+=m.b*l*.3,h+=l*.3}t.globalCompositeOperation="multiply";const E=f*.5,H=b*(1-ze-.14),Y=t.createRadialGradient(E,H,f*.03,E,H,f*.42);if(Y.addColorStop(0,"#ffffff"),Y.addColorStop(.55,"#bcbcbc"),Y.addColorStop(1,"#6a6a6a"),t.fillStyle=Y,t.fillRect(0,0,f,b),p>0){t.globalCompositeOperation="lighter";const a=x*f,W=24,F=t.createLinearGradient(a-W,0,a+W,0);F.addColorStop(0,"rgba(194,122,68,0)"),F.addColorStop(.5,`rgba(194,122,68,${.42*p})`),F.addColorStop(1,"rgba(194,122,68,0)"),t.fillStyle=F,t.fillRect(a-W,0,W*2,b),t.fillStyle=`rgba(255,214,170,${.95*p})`,t.fillRect(a-1.5,0,3,b),c+=L.r*p*2,u+=L.g*p*2,U+=L.b*p*2,h+=p*2}return t.globalCompositeOperation="source-over",z.needsUpdate=!0,We.setRGB(c/Math.max(h,.001),u/Math.max(h,.001),U/Math.max(h,.001)),N}const Ce=wo(j,S,ne),ct=st(j,S,ne),ut=Gt(j,S+Ee,ne,ge,{rim:we,inset:.004}).translate(0,-Ee/2,0),vt=Gt(j*.62,S*.62,ne*.62,.16,{inset:ge+.004}),Te=new Ct({color:"#141311",roughness:.34,metalness:.5,envMapIntensity:.65}),dt=new ro,Dt=new G(ut,Te),Bt=new G(vt,Te),Q=new Ue({uniforms:{uA:{value:null},uB:{value:null},uWipe:{value:0},uDir:{value:r},uGlow:{value:0},uHot:{value:0},uEdge:{value:new P(he)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:_o}),Ve=new G(ct,Q),Ae=j+2*we,ft=st(Ae,.012,ne*Ae/j,64).translate(0,S/2+we-.007,.003),mt=st(Ae,.008,ne*Ae/j,64).translate(0,-S/2-we-Ee+.005,.003),ee=new Ue({transparent:!0,depthWrite:!1,blending:so,uniforms:{uCol:{value:new P(he)},uAmt:{value:.8},uLean:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec3 uCol; uniform float uAmt, uLean; varying vec2 vUv;
      void main(){
        float e = abs(vUv.x - .5) * 2., k = .22 + .78 * pow(e, 2.2);
        k *= 1. + uLean * (vUv.x - .5) * 1.6;   // the end turned toward the light catches more
        k *= smoothstep(1., .97, e) * (1. - abs(vUv.y - .5) * 1.2);
        gl_FragColor = vec4(uCol * k * uAmt, 1.);
      }`}),pt=new G(ft,ee),$e=new G(mt,ee);$e.scale.set(1,1,1),pt.renderOrder=$e.renderOrder=2;const Ie=new Ct({color:"#1c1a17",roughness:.28,metalness:.75,envMapIntensity:.8}),qe=new G(new At(.16,it,.07),Ie);qe.position.set(0,-S/2-it/2+.35,-ge-.2);const ht=new At(.11,.04,1.1),zt=[-1,1].map(e=>{const o=new G(ht,Ie);return o.position.set(e*.32,se+.02,-ge-.02),o.rotation.y=e*.55,o}),Le=new G(new io(.012,8,6),new lo({color:"#f4ece0",toneMapped:!1}));Le.position.set(0,-S/2-(we+Ee)*.5,.004),dt.add(Dt,Bt,Ve,pt,$e,qe,...zt,Le),s.add(dt);const le=new Ue({uniforms:{uMap:{value:z},uA:{value:null},uB:{value:null},uWipe:{value:0},uDir:{value:r},uLevel:{value:Ut},uFlood:{value:0},uWallR:{value:Me},uWallArc:{value:Fe},uWallY0:{value:Z},uWallH:{value:ye},uWallC:{value:y.position.clone()},uScr:{value:new co(Ce.chord/2,S/2,Ce.sag*.45,0)},uFoot:{value:new Lt(0,-ge-.1)}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Go}),Re=new G(new uo(40,18),le);Re.rotation.x=-Math.PI/2,Re.position.set(0,se,2),s.add(Re);const ce=$.map(e=>n.media.screen(Rt(`motion/${e.id}/media/${e.clip}`),Rt(`motion/${e.id}/media/${e.clip==="room.mp4"?"room.webp":"card.webp"}`)));let te=n.viewport.portrait,wt=_t,gt=1;function Mt(){te=n.viewport.portrait,i.fov=te?xo:kt,i.aspect=n.viewport.aspect,i.updateProjectionMatrix(),gt=Math.tan(mo.degToRad(i.fov/2)),wt=te?_t:bo,[X,J]=te?[.37,.63]:[.2,.8],Ot(),He=-1}Mt();const Ht=e=>{const o=wt*gt*n.viewport.aspect,x=Math.cos(e),p=Math.sin(e);let N=0;for(const c of[-1,1]){const u=c*Ce.chord/2,U=Ce.sag,h=u*x-U*p,E=u*p+U*x;N=Math.max(N,E+Math.abs(h)/o)}return N},yt=new vo,bt=new Lt,xt=(e,o)=>(bt.set(e,o),yt.setFromCamera(bt,i),yt.intersectObject(Ve,!1).length>0),Tt=e=>`${n.base}/motion/${$[e].id}/?lang=${Oe}`;let Ne=!1,Ye=0,je=0,Wt=!1,Ge=-1,ue=0,Ke=0;const Vt=!!globalThis.__roomProbeOn,ve=(v[0]+v[1])/2-.04,_e=ve+.08,Ze=.03,Xe=ve-.02,de=_e,Je=.84,$t=.86,It=.99,qt=e=>C?0:e<=v[0]?Wo*(1-V.inOut(_(0,v[0],e))):e<=v[1]?-.22*Math.sin(Math.PI*_(v[0],v[1],e)):So*V.in(_(v[1],1,e));let fe=0;return{scene:s,camera:i,resize(){Mt()},focus(e){Wt=e,e||ce.forEach(o=>{o.pause(),o.release()})},update({p:e,t:o,dt:x,active:p}){ue=C?e<(ve+_e)/2?0:1:V.inOut(_(ve,_e,e));const c=ue<.5?0:1;c!==Ge&&(Ge=c,n.emit("app",{room:pe,id:$[c].id,index:c,count:$.length})),Ye=rt(Ye,n.pointer.inside?n.pointer.x:0,2.2,x),je=rt(je,n.pointer.inside?n.pointer.y:0,2.2,x);const u=qt(e)*r+Ye*.025,U=je*.02,h=Ht(u);i.position.set(Math.sin(u)*h,Math.sin(U)*h,Math.cos(u)*h),i.lookAt(0,0,0);const E=n.viewport.width,H=n.viewport.height;i.setViewOffset(E,H,te?0:(D?1:-1)*.2*E,te?yo*H:.02*H,E,H);const Y=ue>0&&ue<1;ce.forEach((a,W)=>{const F=p&&e<1&&(W===c||Y||Math.abs(e-(ve+_e)/2)<.1);a.want(F),F&&Wt&&(W===c||Y)?a.play():a.pause()}),Q.uniforms.uA.value=le.uniforms.uA.value=ce[0].texture,Q.uniforms.uB.value=le.uniforms.uB.value=ce[1].texture,Q.uniforms.uWipe.value=le.uniforms.uWipe.value=ue,Ke=rt(Ke,Ne?1:0,10,x),Q.uniforms.uHot.value=Ke,Vt&&(globalThis.__roomProbe={room:pe,...ho(Ve,i,E,H)}),Math.abs(e-He)>1e-5&&(fe=Pt(e),He=e),A.uTime.value=o,Be.uniforms.uTime.value=o,M.color.copy(We),re.color.copy(We),M.intensity=1.1+fe*.8,ee.uniforms.uCol.value.copy(We).lerp(lt,.35),ee.uniforms.uAmt.value=.55+.35*Math.min(1,Math.abs(u)*4)+fe*.3,ee.uniforms.uLean.value=-Math.sin(u)*2.2,K.intensity=.55+fe*.5,d.copy(g).lerp(I,fe*.12),B.material.uniforms.uTime.value=o},hover(e,o){return Ne=n.pointer.inside&&xt(e,o),Ne},pick(e,o){return xt(e,o)?Tt(Ge<0?0:Ge):null},dispose(){[ct,ut,vt,ht,ft,mt,qe.geometry,Re.geometry,y.geometry,xe.geometry,Le.geometry].forEach(e=>e.dispose()),[Q,Te,Ie,le,ee,Be,y.material,Le.material].forEach(e=>e.dispose()),z.dispose(),ce.forEach(e=>e.pause())}}};export{Oo as default};
