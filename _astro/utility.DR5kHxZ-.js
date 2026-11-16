import{ah as Yo,S as qo,C as O,a1 as Ko,at as Zo,P as Xo,d as Jo,aj as Qo,D as eo,l as et,K as ot,N as tt,X as at,b as _e,ad as nt,M as U,a8 as rt,au as yo,G as st,A as it,am as Wo,av as lt,e as ct,v as So,V as ut,a as vt,an as dt,ab as oo,s as ft,as as mt,r as E,aw as pt,p as H}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";import{m as Co}from"./media-base.DZ9PvFge.js";import{a as to,m as Ao,b as ht,d as wt}from"./monitor.CRFU6QK5.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const me="utility",pe="#e8d2a6",gt="#c27a44",Mt="#f2b766",j=3.2,R=1.8,ae=42,ke=.04,Lo=.1,he=.1,Ro=.9,bt=.1,xt=.42,yt=50,Go=36,Wt=.24,St=.1,we=16,Ct=-3.4,Ue=1.35,ge=8.6,At=4,Lt=120,_o=.56,ao=.9;function Rt(n,P,Ee){const r=pt(n),W=[],T=P/512,g=[1,.93,.82],Fe=[.86,.9,.94],s=(S,V,M,i,D)=>{const N=Math.max(M,i);if(N<30*T&&r()>.3||N<14*T||D>12){const ne=r()<.1,re=ne?.74+r()*.12:.2+.46*Math.pow(r(),1.2),A=r()<.33?Fe:g,Y=.96+r()*.06;W.push({x:S,y:V,w:M,h:i,r:A[0]*Y,g:A[1]*Y,b:A[2],lv:re,free:!1,u:(S+M/2)/P,order:0,dist:0});return}const C=.3+r()*.4;M>=i*1.15?(s(S,V,M*C,i,D+1),s(S+M*C,V,M*(1-C),i,D+1)):(s(S,V,M,i*C,D+1),s(S,V+i*C,M,i*(1-C),D+1))};s(0,0,P,Ee,0);for(const S of W)S.free=r()<.42;return W}const Gt=`
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

    vec2 q = vW.xz * vec2(1.3, 2.2);
    vec3 N = normalize(vec3((n2(q) - .5) * .018, 1., (n2(q + 7.3) - .5) * .018));
    vec3 R = reflect(V, N);
    float fres = .045 + .955 * pow(1. - max(-V.y, 0.), 5.);
    vec3 col = vec3(.0042, .0036, .003) * (.8 + .4 * n2(vW.xz * .7));

    vec2 o = vW.xz - uWallC.xz, d = R.xz; float a = dot(d, d), b = dot(o, d), c = dot(o, o) - uWallR * uWallR;
    float tw = (-b + sqrt(max(b * b - a * c, 0.))) / max(a, 1e-5);
    vec3 H = vW + R * tw; vec2 r = H.xz - uWallC.xz;
    float th = atan(-r.x, -r.y), u = 1. - (th + uWallArc * .5) / uWallArc, v = (H.y - uWallY0) / uWallH;
    vec3 refl = vec3(0.);
    if (u > 0. && u < 1. && v > 0. && v < 1.) refl = textureLod(uMap, vec2(u, v), 2.6).rgb * uLevel * .62 * smoothstep(1., .85, v);

    float ts = (uScr.z - vW.z) / R.z;
    if (R.z < 0. && ts > 0. && ts < tw) {
      vec3 S = vW + R * ts; vec2 s = vec2(S.x / uScr.x, S.y / uScr.y);
      if (abs(s.x) < 1.03 && s.y > -1.15 && s.y < 1.03) {
        refl = vec3(0.);
        if (abs(s.x) < 1. && abs(s.y) < 1.) {
          vec2 uv = s * .5 + .5; float bl = .006 + .012 * ts;
          refl = (film(uv) + film(uv + vec2(0., bl)) + film(uv - vec2(0., bl))) / 3. * .9;
        }
      }
    }
    col += refl * min(1., fres * 2.4 + .06);

    vec2 pd = vW.xz - vec2(0., .7);
    vec3 pool = (film(vec2(.3, .45)) + film(vec2(.7, .45)) + film(vec2(.5, .75))) / 3.;
    col += pool * exp(-dot(pd * vec2(.4, .75), pd * vec2(.4, .75))) * .2;

    vec2 fd = (vW.xz - uFoot) * vec2(1.6, 2.2);
    col *= 1. - .75 * exp(-dot(fd, fd) * 3.);
    gl_FragColor = vec4(col, 1.);
  }`,_t=`
  uniform sampler2D uA, uB; uniform float uWipe, uDir, uGlow, uHot; uniform vec3 uEdge;
  varying vec2 vUv;
  void main(){
    float x = uDir > 0. ? vUv.x : 1. - vUv.x;
    vec3 a = texture2D(uA, vUv).rgb, b = texture2D(uB, vUv).rgb;
    float w = uWipe * 1.06 - .03, k = smoothstep(w + .004, w - .004, x);
    vec3 col = mix(a, b, k);
    float edge = (1. - smoothstep(0., .03, abs(x - w))) * step(.001, uWipe) * step(uWipe, .999);
    edge *= smoothstep(0., .08, w) * smoothstep(1., .92, w);
    col += uEdge * edge * 1.2;
    vec2 c = vUv - .5;
    col *= .94 + .06 * smoothstep(.75, .1, length(c * vec2(1., 1.6)));
    col += uHot * .06 + uGlow;
    gl_FragColor = vec4(col, 1.);
  }`,Pt=n=>{const P=n.lang==="ar",Ee=P?"ar":"en",r=P?-1:1,W=matchMedia("(prefers-reduced-motion: reduce)").matches,T=Yo(me),g=mt[me],{wash:Fe}=Ko[me],s=new qo,S=new O("#080706"),V=new O(Fe),M=S.clone();s.background=M,s.fog=new Zo("#080706",14,34),s.environment=n.env;const i=new Xo(Go,n.viewport.aspect,.1,120),D=Jo(n.quality?200:90,[20,10,12],"#f2ece0",1.1,41);s.add(D),s.add(new Qo("#f4ece0","#080706",.18));const N=new eo("#fff4e6",.55);N.position.set(-6*r,7,6),s.add(N);const C=new eo(pe,1.1);C.position.set(2*r,4,-8),s.add(C);const ne=new eo(pe,.5);ne.position.set(-7*r,1,-3),s.add(ne);const re=-R/2-ao+.35-.02,A=et({radius:we,arc:Ue,height:ge,rows:At,color:1,cells:Lt}),Y=re-.7;A.position.set(0,Y+ge/2,Ct+we),s.add(A);const G=A.material.uniforms,Oe=G.uWall.value,b=768,L=Math.round(b/Oe),Me=document.createElement("canvas");Me.width=b,Me.height=L;const a=Me.getContext("2d"),B=new ot(Me);B.minFilter=tt,B.generateMipmaps=!0,B.colorSpace=at,G.uA.value=B,G.uB.value=B,G.uAspA.value=Oe,G.uAspB.value=Oe,G.uLevel.value=_o,G.uCellSat.value=1,G.uTintAmt.value=0,G.uMix.value=0;const Pe=new _e({side:nt,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime; varying vec2 vUv;
      void main(){
        vec2 p = vec2(1. - vUv.x, vUv.y);
        float s = (p.x - .5) * 2.6 + p.y * .9 - .55 + .03 * sin(uTime * .05);
        float sheen = exp(-s * s * 9.) * .5 + exp(-pow((p.x - .5) * 2.6 + p.y * .9 - .95, 2.) * 60.) * .35;
        float low = smoothstep(.5, .15, p.y);
        gl_FragColor = vec4(vec3(.5, .48, .45) * sheen * .5, .22 + .16 * low + .04 * sheen);
      }`}),be=new U(new rt(we-.2,we-.2,ge,64,1,!0,Math.PI-Ue/2,Ue),Pe);be.position.copy(A.position),be.renderOrder=1,s.add(be);const se=Rt(1515,b,L);P&&se.forEach(e=>{e.x=b-e.x-e.w,e.u=1-e.u});const De=(R/2-Y)/ge,ko=Math.max(...se.map(e=>Math.hypot(e.u-.5,((e.y+e.h/2)/L-(1-De))*L/b)));se.forEach(e=>{e.dist=Math.hypot(e.u-.5,((e.y+e.h/2)/L-(1-De))*L/b)/ko});const Uo=se.filter(e=>e.free);let q=.36,K=.64;const Eo=()=>Uo.forEach(e=>{e.order=Math.min(1,Math.max(0,(r>0?e.u-q:K-e.u)/(K-q)))}),_=new O(gt),F=new O(Mt),no=new O(pe),xe=new O,x=new O,$=(e,t,d)=>`rgb(${Math.round(Math.min(1,e)*255)},${Math.round(Math.min(1,t)*255)},${Math.round(Math.min(1,d)*255)})`,ye=4;let We=-1,Be=-1;const Fo=new Map,Oo=new Map,ro=(e,t,d,f,k,u)=>{const v=k+u,h=e.get(t);if(h&&h.k===v)return h.gr;const l=a.createLinearGradient(0,d,0,d+f);return l.addColorStop(0,k),l.addColorStop(1,u),e.set(t,{k:v,gr:l}),l};let ze=null;function Po(e){const t=E(Ke,Ze,e),d=r>0?q+(K-q)*H.inOut(t):K-(K-q)*H.inOut(t),f=W?0:Math.min(E(Ke,Ke+.03,e),1-E(Ze-.03,Ze,e)),k=H.out(E(Io,jo,e));let u=0,v=0,h=0,l=0;a.globalCompositeOperation="source-over",a.fillStyle="#000",a.fillRect(0,0,b,L);for(const o of se){const c=(d-o.u)*r,m=W?e>g[0]?1:0:t<=0?0:t>=1?1:H.out(Math.min(1,Math.max(0,c/.03))),Q=W||t<=0||t>=1?0:Math.exp(-Math.max(0,c)/.05)*(c>-.004?1:0),w=o.free?W?e>g[1]?1:0:E(ve+o.order*(Xe-ve)*.7,ve+o.order*(Xe-ve)*.7+(Xe-ve)*.3,e):0,ee=o.free?m:0;let p=o.lv*(1-.88*ee);x.setRGB(o.r,o.g,o.b),x.lerp(_,(o.free?.85:.25)*Q),p+=(o.free?.45:.1)*Q;const Ge=E(o.dist*.5,o.dist*.5+.5,k);x.lerp(no,Ge*.7),p=p+(.62-p)*Ge*.8;const fe=o.x+ye/2,I=o.y+ye/2,oe=o.w-ye,z=o.h-ye;if(!(oe<1||z<1)){if(a.fillStyle=ro(Fo,o,I,z,$(x.r*p*1.22,x.g*p*1.22,x.b*p*1.22),$(x.r*p*.62,x.g*p*.62,x.b*p*.62)),a.fillRect(fe,I,oe,z),ee>.5&&w<1){const y=.42*(ee-.5)*2*(1-w)*(1-Ge);a.fillStyle=$(_.r*y*.22,_.g*y*.2,_.b*y*.18),a.fillRect(fe,I,oe,z),a.strokeStyle=$(_.r*y*1.6,_.g*y*1.4,_.b*y*1.2),a.lineWidth=3,a.strokeRect(fe+1.5,I+1.5,oe-3,z-3)}if(o.free&&w>0){const y=1-Ge,te=(w>=1?.7:.95)*y,Je=Math.max(1,oe*H.inOut(w)),Qe=r>0?fe:fe+oe-Je;a.fillStyle=ro(Oo,o,I,z,$(F.r*te*1.15,F.g*te*1.15,F.b*te*1.15),$(F.r*te*.6,F.g*te*.6,F.b*te*.6)),a.fillRect(Qe,I,Je,z),w<1&&(a.fillStyle=$(1,.9,.72),a.fillRect(r>0?Qe+Je-2:Qe,I,2,z)),u+=F.r*w*y,v+=F.g*w*y,h+=F.b*w*y,l+=w*y}u+=x.r*p*.3,v+=x.g*p*.3,h+=x.b*p*.3,l+=p*.3}}if(a.globalCompositeOperation="multiply",!ze){const o=b*.5,c=L*(1-De-.14),m=a.createRadialGradient(o,c,b*.03,o,c,b*.42);m.addColorStop(0,"#ffffff"),m.addColorStop(.55,"#bcbcbc"),m.addColorStop(1,"#6a6a6a"),ze=m}if(a.fillStyle=ze,a.fillRect(0,0,b,L),f>0){a.globalCompositeOperation="lighter";const o=d*b,c=24,m=a.createLinearGradient(o-c,0,o+c,0);m.addColorStop(0,"rgba(194,122,68,0)"),m.addColorStop(.5,`rgba(194,122,68,${.42*f})`),m.addColorStop(1,"rgba(194,122,68,0)"),a.fillStyle=m,a.fillRect(o-c,0,c*2,L),a.fillStyle=`rgba(255,214,170,${.95*f})`,a.fillRect(o-1.5,0,3,L),u+=_.r*f*2,v+=_.g*f*2,h+=_.b*f*2,l+=f*2}return a.globalCompositeOperation="source-over",B.needsUpdate=!0,xe.setRGB(u/Math.max(l,.001),v/Math.max(l,.001),h/Math.max(l,.001)),k}const Se=wt(j,R,ae),so=to(j,R,ae),io=Ao(j,R,ae,he,{rim:0,inset:.004}),lo=Ao(j*.62,R*.62,ae*.62,.16,{inset:he+.004}),He=new yo({color:"#141311",roughness:.34,metalness:.5,envMapIntensity:.65}),co=new st,Do=new U(io,He),Bo=new U(lo,He),Z=new _e({uniforms:{uA:{value:null},uB:{value:null},uWipe:{value:0},uDir:{value:r},uGlow:{value:0},uHot:{value:0},uEdge:{value:new O(pe)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:_t}),Te=new U(so,Z),Ce=j+2*ke,uo=to(Ce,.012,ae*Ce/j,64).translate(0,R/2+ke-.007,.003),vo=to(Ce,.008,ae*Ce/j,64).translate(0,-R/2-ke-Lo+.005,.003),X=new _e({transparent:!0,depthWrite:!1,blending:it,uniforms:{uCol:{value:new O(pe)},uAmt:{value:.8},uLean:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec3 uCol; uniform float uAmt, uLean; varying vec2 vUv;
      void main(){
        float e = abs(vUv.x - .5) * 2., k = .22 + .78 * pow(e, 2.2);
        k *= 1. + uLean * (vUv.x - .5) * 1.6;
        k *= smoothstep(1., .97, e) * (1. - abs(vUv.y - .5) * 1.2);
        gl_FragColor = vec4(uCol * k * uAmt, 1.);
      }`}),zo=new U(uo,X),fo=new U(vo,X);fo.scale.set(1,1,1),zo.renderOrder=fo.renderOrder=2;const Ve=new yo({color:"#1c1a17",roughness:.28,metalness:.75,envMapIntensity:.8}),$e=new U(new Wo(.16,ao,.07),Ve);$e.position.set(0,-R/2-ao/2+.35,-he-.2);const mo=new Wo(.11,.04,1.1),Ho=[-1,1].map(e=>{const t=new U(mo,Ve);return t.position.set(e*.32,re+.02,-he-.02),t.rotation.y=e*.55,t}),Ie=new U(new lt(.012,8,6),new ct({color:"#f4ece0",toneMapped:!1}));Ie.position.set(0,-R/2-(ke+Lo)*.5,.004),co.add(Do,Bo,Te,$e,...Ho),s.add(co);const ie=new _e({uniforms:{uMap:{value:B},uA:{value:null},uB:{value:null},uWipe:{value:0},uDir:{value:r},uLevel:{value:_o},uFlood:{value:0},uWallR:{value:we},uWallArc:{value:Ue},uWallY0:{value:Y},uWallH:{value:ge},uWallC:{value:A.position.clone()},uScr:{value:new ut(Se.chord/2,R/2,Se.sag*.45,0)},uFoot:{value:new So(0,-he-.1)}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Gt}),Ae=new U(new vt(40,18),ie);Ae.rotation.x=-Math.PI/2,Ae.position.set(0,re,2),s.add(Ae);const le=T.map(e=>n.media.screen(Co(`motion/${e.id}/media/${e.clip}`),Co(`motion/${e.id}/media/${e.clip==="room.mp4"?"room.webp":"card.webp"}`)));let J=n.viewport.portrait,po=Ro,ho=1;function wo(){J=n.viewport.portrait,i.fov=J?yt:Go,i.aspect=n.viewport.aspect,i.updateProjectionMatrix(),ho=Math.tan(ft.degToRad(i.fov/2)),po=J?Ro:xt,[q,K]=J?[.37,.63]:[.2,.8],Eo(),We=-1}wo();const To=e=>{const t=po*ho*n.viewport.aspect,d=Math.cos(e),f=Math.sin(e);let k=0;for(const u of[-1,1]){const v=u*Se.chord/2,h=Se.sag,l=v*d-h*f,o=v*f+h*d;k=Math.max(k,o+Math.abs(l)/t)}return k},go=new dt,Mo=new So,bo=(e,t)=>(Mo.set(e,t),go.setFromCamera(Mo,i),go.intersectObject(Te,!1).length>0),Vo=e=>`${n.base}/motion/${T[e].id}/?lang=${Ee}`;let je=!1,Ne=0,Ye=0,xo=!1,Le=-1,ce=0,qe=0;const $o=!!globalThis.__roomProbeOn,ue=(g[0]+g[1])/2-.04,Re=ue+.08,Ke=.03,Ze=ue-.02,ve=Re,Xe=.84,Io=.86,jo=.99,No=e=>W?0:e<=g[0]?Wt*(1-H.inOut(E(0,g[0],e))):e<=g[1]?-.22*Math.sin(Math.PI*E(g[0],g[1],e)):St*H.in(E(g[1],1,e));let de=0;return{scene:s,camera:i,resize(){wo()},focus(e){xo=e,e||le.forEach(t=>{t.pause(),t.release()})},update({p:e,t,dt:d,active:f}){ce=W?e<(ue+Re)/2?0:1:H.inOut(E(ue,Re,e));const u=ce<.5?0:1;u!==Le&&(Le=u,n.emit("app",{room:me,id:T[u].id,index:u,count:T.length})),Ne=oo(Ne,n.pointer.inside?n.pointer.x:0,2.2,d),Ye=oo(Ye,n.pointer.inside?n.pointer.y:0,2.2,d);const v=No(e)*r+Ne*.025,h=Ye*.02,l=To(v);i.position.set(Math.sin(v)*l,Math.sin(h)*l,Math.cos(v)*l),i.lookAt(0,0,0);const o=n.viewport.width,c=n.viewport.height;i.setViewOffset(o,c,J?0:(P?1:-1)*.22*o,J?bt*c:.02*c,o,c);const m=ce>0&&ce<1;le.forEach((Q,w)=>{const ee=f&&e<1&&(w===u||m||Math.abs(e-(ue+Re)/2)<.1);Q.want(ee),ee&&xo&&(w===u||m)?Q.play():Q.pause()}),Z.uniforms.uA.value=ie.uniforms.uA.value=le[0].texture,Z.uniforms.uB.value=ie.uniforms.uB.value=le[1].texture,Z.uniforms.uWipe.value=ie.uniforms.uWipe.value=ce,qe=oo(qe,je?1:0,10,d),Z.uniforms.uHot.value=qe,$o&&(globalThis.__roomProbe={room:me,...ht(Te,i,o,c)}),Math.abs(e-We)>1e-5&&(We<0||W||t-Be>=1/30||t<Be)&&(de=Po(e),We=e,Be=t),G.uTime.value=t,Pe.uniforms.uTime.value=t,C.color.copy(xe),ne.color.copy(xe),C.intensity=1.1+de*.8,X.uniforms.uCol.value.copy(xe).lerp(no,.35),X.uniforms.uAmt.value=.55+.35*Math.min(1,Math.abs(v)*4)+de*.3,X.uniforms.uLean.value=-Math.sin(v)*2.2,N.intensity=.55+de*.5,M.copy(S).lerp(V,de*.12),D.material.uniforms.uTime.value=t},hover(e,t){return je=n.pointer.inside&&bo(e,t),je},pick(e,t){return bo(e,t)?Vo(Le<0?0:Le):null},dispose(){[so,io,lo,mo,uo,vo,$e.geometry,Ae.geometry,A.geometry,be.geometry,Ie.geometry].forEach(e=>e.dispose()),[Z,He,Ve,ie,X,Pe,A.material,Ie.material].forEach(e=>e.dispose()),B.dispose(),le.forEach(e=>e.pause())}}};export{Pt as default};
