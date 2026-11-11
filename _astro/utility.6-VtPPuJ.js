import{ac as Nt,_ as Yt,S as jt,C as O,aq as Kt,P as Zt,d as Xt,ao as Jt,D as ot,l as Qt,X as eo,ar as to,al as oo,b as Ue,a2 as ao,M as U,Y as no,as as Wt,G as ro,A as so,ap as St,Z as io,e as lo,s as Ct,t as co,a as uo,$ as vo,ad as fo,K as at,p as mo,o as H,r as E,N as po}from"./EditionWorld.astro_astro_type_script_index_0_lang.DMdfUXqr.js";import{m as At}from"./media-base.CkYm9YKi.js";import{m as nt,d as Lt,b as ho,a as wo}from"./monitor.DnCifVut.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const me="utility",pe="#e8d2a6",go="#c27a44",Mo="#f2b766",q=3.2,R=1.8,ae=42,he=.04,Ee=.1,we=.1,Rt=.9,yo=.1,bo=.42,xo=50,kt=36,Wo=.24,So=.1,ge=16,Co=-3.4,Fe=1.35,Me=8.6,Ao=4,Lo=120,Gt=.56,rt=.9;function Ro(n,P,Oe){const r=po(n),W=[],T=P/512,g=[1,.93,.82],Pe=[.86,.9,.94],s=(S,V,M,i,D)=>{const N=Math.max(M,i);if(N<30*T&&r()>.3||N<14*T||D>12){const ne=r()<.1,re=ne?.74+r()*.12:.2+.46*Math.pow(r(),1.2),A=r()<.33?Pe:g,Y=.96+r()*.06;W.push({x:S,y:V,w:M,h:i,r:A[0]*Y,g:A[1]*Y,b:A[2],lv:re,free:!1,u:(S+M/2)/P,order:0,dist:0});return}const C=.3+r()*.4;M>=i*1.15?(s(S,V,M*C,i,D+1),s(S+M*C,V,M*(1-C),i,D+1)):(s(S,V,M,i*C,D+1),s(S,V+i*C,M,i*(1-C),D+1))};s(0,0,P,Oe,0);for(const S of W)S.free=r()<.42;return W}const ko=`
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
  }`,Go=`
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
  }`,Oo=n=>{const P=n.lang==="ar",Oe=P?"ar":"en",r=P?-1:1,W=matchMedia("(prefers-reduced-motion: reduce)").matches,T=Nt(me),g=fo[me],{wash:Pe}=Yt[me],s=new jt,S=new O("#080706"),V=new O(Pe),M=S.clone();s.background=M,s.fog=new Kt("#080706",14,34),s.environment=n.env;const i=new Zt(kt,n.viewport.aspect,.1,120),D=Xt(n.quality?200:90,[20,10,12],"#f2ece0",1.1,41);s.add(D),s.add(new Jt("#f4ece0","#080706",.18));const N=new ot("#fff4e6",.55);N.position.set(-6*r,7,6),s.add(N);const C=new ot(pe,1.1);C.position.set(2*r,4,-8),s.add(C);const ne=new ot(pe,.5);ne.position.set(-7*r,1,-3),s.add(ne);const re=-R/2-rt+.35-.02,A=Qt({radius:ge,arc:Fe,height:Me,rows:Ao,color:1,cells:Lo}),Y=re-.7;A.position.set(0,Y+Me/2,Co+ge),s.add(A);const k=A.material.uniforms,De=k.uWall.value,y=768,L=Math.round(y/De),ye=document.createElement("canvas");ye.width=y,ye.height=L;const a=ye.getContext("2d"),B=new eo(ye);B.minFilter=to,B.generateMipmaps=!0,B.colorSpace=oo,k.uA.value=B,k.uB.value=B,k.uAspA.value=De,k.uAspB.value=De,k.uLevel.value=Gt,k.uCellSat.value=1,k.uTintAmt.value=0,k.uMix.value=0;const Be=new Ue({side:ao,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime; varying vec2 vUv;
      void main(){
        vec2 p = vec2(1. - vUv.x, vUv.y);
        float s = (p.x - .5) * 2.6 + p.y * .9 - .55 + .03 * sin(uTime * .05);
        float sheen = exp(-s * s * 9.) * .5 + exp(-pow((p.x - .5) * 2.6 + p.y * .9 - .95, 2.) * 60.) * .35;
        float low = smoothstep(.5, .15, p.y);
        gl_FragColor = vec4(vec3(.5, .48, .45) * sheen * .5, .22 + .16 * low + .04 * sheen);
      }`}),be=new U(new no(ge-.2,ge-.2,Me,64,1,!0,Math.PI-Fe/2,Fe),Be);be.position.copy(A.position),be.renderOrder=1,s.add(be);const se=Ro(1515,y,L);P&&se.forEach(e=>{e.x=y-e.x-e.w,e.u=1-e.u});const ze=(R/2-Y)/Me,_t=Math.max(...se.map(e=>Math.hypot(e.u-.5,((e.y+e.h/2)/L-(1-ze))*L/y)));se.forEach(e=>{e.dist=Math.hypot(e.u-.5,((e.y+e.h/2)/L-(1-ze))*L/y)/_t});const Ut=se.filter(e=>e.free);let j=.36,K=.64;const Et=()=>Ut.forEach(e=>{e.order=Math.min(1,Math.max(0,(r>0?e.u-j:K-e.u)/(K-j)))}),G=new O(go),F=new O(Mo),st=new O(pe),xe=new O,b=new O,$=(e,o,d)=>`rgb(${Math.round(Math.min(1,e)*255)},${Math.round(Math.min(1,o)*255)},${Math.round(Math.min(1,d)*255)})`,We=4;let Se=-1,He=-1;const Ft=new Map,Ot=new Map,it=(e,o,d,f,_,u)=>{const v=_+u,h=e.get(o);if(h&&h.k===v)return h.gr;const l=a.createLinearGradient(0,d,0,d+f);return l.addColorStop(0,_),l.addColorStop(1,u),e.set(o,{k:v,gr:l}),l};let Te=null;function Pt(e){const o=E(Xe,Je,e),d=r>0?j+(K-j)*H.inOut(o):K-(K-j)*H.inOut(o),f=W?0:Math.min(E(Xe,Xe+.03,e),1-E(Je-.03,Je,e)),_=H.out(E($t,It,e));let u=0,v=0,h=0,l=0;a.globalCompositeOperation="source-over",a.fillStyle="#000",a.fillRect(0,0,y,L);for(const t of se){const c=(d-t.u)*r,m=W?e>g[0]?1:0:o<=0?0:o>=1?1:H.out(Math.min(1,Math.max(0,c/.03))),Q=W||o<=0||o>=1?0:Math.exp(-Math.max(0,c)/.05)*(c>-.004?1:0),w=t.free?W?e>g[1]?1:0:E(ve+t.order*(Qe-ve)*.7,ve+t.order*(Qe-ve)*.7+(Qe-ve)*.3,e):0,ee=t.free?m:0;let p=t.lv*(1-.88*ee);b.setRGB(t.r,t.g,t.b),b.lerp(G,(t.free?.85:.25)*Q),p+=(t.free?.45:.1)*Q;const _e=E(t.dist*.5,t.dist*.5+.5,_);b.lerp(st,_e*.7),p=p+(.62-p)*_e*.8;const fe=t.x+We/2,I=t.y+We/2,te=t.w-We,z=t.h-We;if(!(te<1||z<1)){if(a.fillStyle=it(Ft,t,I,z,$(b.r*p*1.22,b.g*p*1.22,b.b*p*1.22),$(b.r*p*.62,b.g*p*.62,b.b*p*.62)),a.fillRect(fe,I,te,z),ee>.5&&w<1){const x=.42*(ee-.5)*2*(1-w)*(1-_e);a.fillStyle=$(G.r*x*.22,G.g*x*.2,G.b*x*.18),a.fillRect(fe,I,te,z),a.strokeStyle=$(G.r*x*1.6,G.g*x*1.4,G.b*x*1.2),a.lineWidth=3,a.strokeRect(fe+1.5,I+1.5,te-3,z-3)}if(t.free&&w>0){const x=1-_e,oe=(w>=1?.7:.95)*x,et=Math.max(1,te*H.inOut(w)),tt=r>0?fe:fe+te-et;a.fillStyle=it(Ot,t,I,z,$(F.r*oe*1.15,F.g*oe*1.15,F.b*oe*1.15),$(F.r*oe*.6,F.g*oe*.6,F.b*oe*.6)),a.fillRect(tt,I,et,z),w<1&&(a.fillStyle=$(1,.9,.72),a.fillRect(r>0?tt+et-2:tt,I,2,z)),u+=F.r*w*x,v+=F.g*w*x,h+=F.b*w*x,l+=w*x}u+=b.r*p*.3,v+=b.g*p*.3,h+=b.b*p*.3,l+=p*.3}}if(a.globalCompositeOperation="multiply",!Te){const t=y*.5,c=L*(1-ze-.14),m=a.createRadialGradient(t,c,y*.03,t,c,y*.42);m.addColorStop(0,"#ffffff"),m.addColorStop(.55,"#bcbcbc"),m.addColorStop(1,"#6a6a6a"),Te=m}if(a.fillStyle=Te,a.fillRect(0,0,y,L),f>0){a.globalCompositeOperation="lighter";const t=d*y,c=24,m=a.createLinearGradient(t-c,0,t+c,0);m.addColorStop(0,"rgba(194,122,68,0)"),m.addColorStop(.5,`rgba(194,122,68,${.42*f})`),m.addColorStop(1,"rgba(194,122,68,0)"),a.fillStyle=m,a.fillRect(t-c,0,c*2,L),a.fillStyle=`rgba(255,214,170,${.95*f})`,a.fillRect(t-1.5,0,3,L),u+=G.r*f*2,v+=G.g*f*2,h+=G.b*f*2,l+=f*2}return a.globalCompositeOperation="source-over",B.needsUpdate=!0,xe.setRGB(u/Math.max(l,.001),v/Math.max(l,.001),h/Math.max(l,.001)),_}const Ce=wo(q,R,ae),lt=nt(q,R,ae),ct=Lt(q,R+Ee,ae,we,{rim:he,inset:.004}).translate(0,-Ee/2,0),ut=Lt(q*.62,R*.62,ae*.62,.16,{inset:we+.004}),Ve=new Wt({color:"#141311",roughness:.34,metalness:.5,envMapIntensity:.65}),vt=new ro,Dt=new U(ct,Ve),Bt=new U(ut,Ve),Z=new Ue({uniforms:{uA:{value:null},uB:{value:null},uWipe:{value:0},uDir:{value:r},uGlow:{value:0},uHot:{value:0},uEdge:{value:new O(pe)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Go}),$e=new U(lt,Z),Ae=q+2*he,dt=nt(Ae,.012,ae*Ae/q,64).translate(0,R/2+he-.007,.003),ft=nt(Ae,.008,ae*Ae/q,64).translate(0,-R/2-he-Ee+.005,.003),X=new Ue({transparent:!0,depthWrite:!1,blending:so,uniforms:{uCol:{value:new O(pe)},uAmt:{value:.8},uLean:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec3 uCol; uniform float uAmt, uLean; varying vec2 vUv;
      void main(){
        float e = abs(vUv.x - .5) * 2., k = .22 + .78 * pow(e, 2.2);
        k *= 1. + uLean * (vUv.x - .5) * 1.6;   // the end turned toward the light catches more
        k *= smoothstep(1., .97, e) * (1. - abs(vUv.y - .5) * 1.2);
        gl_FragColor = vec4(uCol * k * uAmt, 1.);
      }`}),mt=new U(dt,X),Ie=new U(ft,X);Ie.scale.set(1,1,1),mt.renderOrder=Ie.renderOrder=2;const qe=new Wt({color:"#1c1a17",roughness:.28,metalness:.75,envMapIntensity:.8}),Ne=new U(new St(.16,rt,.07),qe);Ne.position.set(0,-R/2-rt/2+.35,-we-.2);const pt=new St(.11,.04,1.1),zt=[-1,1].map(e=>{const o=new U(pt,qe);return o.position.set(e*.32,re+.02,-we-.02),o.rotation.y=e*.55,o}),Le=new U(new io(.012,8,6),new lo({color:"#f4ece0",toneMapped:!1}));Le.position.set(0,-R/2-(he+Ee)*.5,.004),vt.add(Dt,Bt,$e,mt,Ie,Ne,...zt,Le),s.add(vt);const ie=new Ue({uniforms:{uMap:{value:B},uA:{value:null},uB:{value:null},uWipe:{value:0},uDir:{value:r},uLevel:{value:Gt},uFlood:{value:0},uWallR:{value:ge},uWallArc:{value:Fe},uWallY0:{value:Y},uWallH:{value:Me},uWallC:{value:A.position.clone()},uScr:{value:new co(Ce.chord/2,R/2,Ce.sag*.45,0)},uFoot:{value:new Ct(0,-we-.1)}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:ko}),Re=new U(new uo(40,18),ie);Re.rotation.x=-Math.PI/2,Re.position.set(0,re,2),s.add(Re);const le=T.map(e=>n.media.screen(At(`motion/${e.id}/media/${e.clip}`),At(`motion/${e.id}/media/${e.clip==="room.mp4"?"room.webp":"card.webp"}`)));let J=n.viewport.portrait,ht=Rt,wt=1;function gt(){J=n.viewport.portrait,i.fov=J?xo:kt,i.aspect=n.viewport.aspect,i.updateProjectionMatrix(),wt=Math.tan(mo.degToRad(i.fov/2)),ht=J?Rt:bo,[j,K]=J?[.37,.63]:[.2,.8],Et(),Se=-1}gt();const Ht=e=>{const o=ht*wt*n.viewport.aspect,d=Math.cos(e),f=Math.sin(e);let _=0;for(const u of[-1,1]){const v=u*Ce.chord/2,h=Ce.sag,l=v*d-h*f,t=v*f+h*d;_=Math.max(_,t+Math.abs(l)/o)}return _},Mt=new vo,yt=new Ct,bt=(e,o)=>(yt.set(e,o),Mt.setFromCamera(yt,i),Mt.intersectObject($e,!1).length>0),Tt=e=>`${n.base}/motion/${T[e].id}/?lang=${Oe}`;let Ye=!1,je=0,Ke=0,xt=!1,ke=-1,ce=0,Ze=0;const Vt=!!globalThis.__roomProbeOn,ue=(g[0]+g[1])/2-.04,Ge=ue+.08,Xe=.03,Je=ue-.02,ve=Ge,Qe=.84,$t=.86,It=.99,qt=e=>W?0:e<=g[0]?Wo*(1-H.inOut(E(0,g[0],e))):e<=g[1]?-.22*Math.sin(Math.PI*E(g[0],g[1],e)):So*H.in(E(g[1],1,e));let de=0;return{scene:s,camera:i,resize(){gt()},focus(e){xt=e,e||le.forEach(o=>{o.pause(),o.release()})},update({p:e,t:o,dt:d,active:f}){ce=W?e<(ue+Ge)/2?0:1:H.inOut(E(ue,Ge,e));const u=ce<.5?0:1;u!==ke&&(ke=u,n.emit("app",{room:me,id:T[u].id,index:u,count:T.length})),je=at(je,n.pointer.inside?n.pointer.x:0,2.2,d),Ke=at(Ke,n.pointer.inside?n.pointer.y:0,2.2,d);const v=qt(e)*r+je*.025,h=Ke*.02,l=Ht(v);i.position.set(Math.sin(v)*l,Math.sin(h)*l,Math.cos(v)*l),i.lookAt(0,0,0);const t=n.viewport.width,c=n.viewport.height;i.setViewOffset(t,c,J?0:(P?1:-1)*.22*t,J?yo*c:.02*c,t,c);const m=ce>0&&ce<1;le.forEach((Q,w)=>{const ee=f&&e<1&&(w===u||m||Math.abs(e-(ue+Ge)/2)<.1);Q.want(ee),ee&&xt&&(w===u||m)?Q.play():Q.pause()}),Z.uniforms.uA.value=ie.uniforms.uA.value=le[0].texture,Z.uniforms.uB.value=ie.uniforms.uB.value=le[1].texture,Z.uniforms.uWipe.value=ie.uniforms.uWipe.value=ce,Ze=at(Ze,Ye?1:0,10,d),Z.uniforms.uHot.value=Ze,Vt&&(globalThis.__roomProbe={room:me,...ho($e,i,t,c)}),Math.abs(e-Se)>1e-5&&(Se<0||W||o-He>=1/30||o<He)&&(de=Pt(e),Se=e,He=o),k.uTime.value=o,Be.uniforms.uTime.value=o,C.color.copy(xe),ne.color.copy(xe),C.intensity=1.1+de*.8,X.uniforms.uCol.value.copy(xe).lerp(st,.35),X.uniforms.uAmt.value=.55+.35*Math.min(1,Math.abs(v)*4)+de*.3,X.uniforms.uLean.value=-Math.sin(v)*2.2,N.intensity=.55+de*.5,M.copy(S).lerp(V,de*.12),D.material.uniforms.uTime.value=o},hover(e,o){return Ye=n.pointer.inside&&bt(e,o),Ye},pick(e,o){return bt(e,o)?Tt(ke<0?0:ke):null},dispose(){[lt,ct,ut,pt,dt,ft,Ne.geometry,Re.geometry,A.geometry,be.geometry,Le.geometry].forEach(e=>e.dispose()),[Z,Ve,qe,ie,X,Be,A.material,Le.material].forEach(e=>e.dispose()),B.dispose(),le.forEach(e=>e.pause())}}};export{Oo as default};
