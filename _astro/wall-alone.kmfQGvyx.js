import{S as Ke,C as Ee,P as $e,s as re,$ as we,a0 as me,K as De,u as je,c as Ze,a1 as he,w as Be,v as Ie,M as ye,a as Qe,b as Ue,Z as Ye,k as U,p as Y,Q as xe,a2 as Ae,r as N}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";import{m as We}from"./media-base.DZ9PvFge.js";import{a as Ne,b as Xe,m as ze,c as Je,g as eo,O as oo}from"./mark-solid.BFfNz2xq.js";import"./preload-helper.4QTdcD_W.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const X={ret:.1,hover:.2,auto:.5,scroll:.001,lean:.5},z=Ae.constellation.sec,to=9,ao=Math.max(0,z-to),w=4,h=14,ke=6,Se=1,so=["studio","business","people","utility"],io=.135,ro=.55,Fe=[1.1,.9],ge=4,Ce=Ae.constellation.seam/2/z,be=Ce+.2,Me=2*re.radToDeg(Math.atan(w/h)),Pe=(o,n)=>{o.quaternion.copy(n.quaternion),o.spin.copy(n.spin),o.lean.copy(n.lean)},lo=(o,n,p,i)=>{for(const y of["ret","hover","auto","scroll","lean"])i[y]=o[y]+(n[y]-o[y])*p;return i.friction=(o.friction??1)+((n.friction??1)-(o.friction??1))*p,i.gain=(o.gain??14)+((n.gain??14)-(o.gain??14))*p,i},no=`
  uniform float uR, uZc; varying vec2 vA; varying vec4 vS;
  void main(){
    vA = position.xy;
    float th = position.x / uR;
    vec3 p = vec3(uR * sin(th), position.y, uZc - uR * cos(th));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); vS = gl_Position;
  }`,uo=`
  uniform float uS, uWork, uWorkAsp, uScrAsp, uFineOff, uHlK, uFloor, uFloorC, uFloorCP; uniform vec2 uOff; uniform sampler2D uWorkTex;
  ${Ye}
  varying vec2 vA; varying vec4 vS;
  void main(){
    vec2 w = vA / uS + uOff;
    wdFine = 1. - uFineOff;
    wdSP = vec2(vS.x / vS.w * uScrAsp, vS.y / vS.w) * .5;
    vec3 wd = wdColor(w, uWdT);


    vec3 col = wd;
    if (uWork > 0.) {
      vec2 sc = vS.xy / vS.w * .5 + .5;
      vec2 cv = uScrAsp > uWorkAsp ? vec2(1., uWorkAsp / uScrAsp) : vec2(uScrAsp / uWorkAsp, 1.) / (uScrAsp < 1. ? .6 : 1.);
      vec2 wu = (sc - .5) * cv + .5;
      vec3 wk = texture2D(uWorkTex, clamp(wu, .001, .999)).rgb * step(0., wu.y) * step(wu.y, 1.);
      wk = pow(clamp(mix(vec3(dot(wk, vec3(.299, .587, .114))), wk, 2.), 0., 1.), vec3(1. / 2.2));
      vec2 c3 = floor(w * 8.); float n = mix(8., 16., step(.5, wdH(c3 + uWdLay * 17.31 + .5)));
      vec2 luv = fract(w * n), e = min(luv, 1. - luv) * (16. / n);
      vec2 dg = fract(w * 414.) - .5;
      float fin = mix(.666, mix(.54, .9, 1. - smoothstep(.15, .5, length(dg))), wdFine) * step(uWdGap, min(e.x, e.y)) * mix(1., .74, smoothstep(.35, .72, length(luv - .5)));
      col = mix(wd, wk * fin * .5 * uWdLevel, uWork);
    }




    float fo = wdHlEdge((vS.xy / vS.w - uWdHlC) * uHlK, uScrAsp), bwP = step(.5, uWdPicA) * step(uWdPicA, 1.5) * (1. - uWork);
    col *= mix(fo, .35 + .65 * fo, bwP) * (1. - .25 * bwP);






    if (uFloor > 0.) {
      vec2 wf = uWdMid + (w - uWdMid) / wdTk, c8 = floor(wf * 8.);
      float nf = mix(8., 16., step(.5, wdH(c8 + uWdLay * 17.31 + .5)));
      vec2 lf = fract(wf * nf), ef = min(lf, 1. - lf) * (16. / nf);
      float lit = .5 * uWdLevel * .684 * step(uWdGap, min(ef.x, ef.y)) * smoothstep(1.9, .1, length(lf - .5)) * (1. - .25 * bwP);
      float fl = uFloor * lit * (fo * fo * bwP + uFloorC * pow(fo, uFloorCP) * step(uWdPicA, .5) * (1. - uWork)), lu = dot(col, vec3(.299, .587, .114));
      col += vec3(max(0., fl - lu));
    }
    col = mix(col, vec3(1.), wdGl * .16);
    gl_FragColor = vec4(pow(max(col, 0.), vec3(2.2)), 1.);
  }`,mo=async o=>{const n=o.lang==="ar",p=new Ke;p.background=new Ee(0,0,0);const i=new $e(2*re.radToDeg(Math.atan(w/h)),o.viewport.aspect,.1,80);i.position.set(0,0,h);const y=new we,le=new we;await Promise.allSettled(['700 20px "Space Grotesk Variable"','800 20px "Cairo Variable"'].map(a=>document.fonts.load(a)));const T=document.createElement("canvas"),M=1024,R=192;T.width=M,T.height=R*4;{const a=T.getContext("2d");a.fillStyle="#ff0000",a.textAlign="center",a.textBaseline="middle",a.direction=n?"rtl":"ltr",so.forEach((l,r)=>{const d=n?me[l].ar:me[l].en.toUpperCase();let j=R*(n?.62:.7);a.font=`${n?800:700} ${j}px ${n?'"Cairo Variable"':'"Space Grotesk Variable"'}, sans-serif`;const Z=a.measureText(d).width;Z>M*.94&&(j*=M*.94/Z,a.font=`${n?800:700} ${j}px ${n?'"Cairo Variable"':'"Space Grotesk Variable"'}, sans-serif`),a.fillText(d,M/2,R*(r+(n?.56:.53)))})}const P=new De(T);P.generateMipmaps=!1,P.minFilter=je;const J=Ze(["MK"],{font:'700 900px "Space Grotesk Variable", sans-serif',width:2048}),q=o.worksEnd;typeof q?.lay=="number"&&(globalThis.__wdLay??=q.lay);const A=he.studio.apps.find(a=>a.id==="mk-tones")??he.studio.apps[0],ne=q?.screen??{url:We(`motion/${A.id}/media/${A.clip}`),poster:We(`motion/${A.id}/media/${A.clip.startsWith("room")?A.clip.replace(".mp4",".webp"):"card.webp"}`)},H=o.media.screen(ne.url,ne.poster),c=Be({name:P,nameZ:.2,mk:J.texture,mkAsp:J.aspect,seed:44});c.uniforms.uWdGap.value=.024;const t={uR:{value:h+ke},uZc:{value:h},uS:{value:8},uOff:{value:new Ie(.5,.5)},uWork:{value:1},uFineOff:{value:0},uWorkTex:{value:H.texture},uWorkAsp:{value:16/9},uScrAsp:{value:1},uHlK:{value:Se},uFloor:{value:0},uFloorC:{value:Fe[0]},uFloorCP:{value:ge}};Object.assign(t,c.uniforms),t.uWdRows.value=P,t.uWdRowsOn.value=1,t.uWdRowsZ.value=R/M,t.uWdLevel.value=1.5;const C=new ye(new Qe(2*Math.PI*.5*(h+ke),22,96,1),new Ue({uniforms:t,vertexShader:no,fragmentShader:uo,depthWrite:!1,depthTest:!1,toneMapped:!1}));C.frustumCulled=!1,C.renderOrder=-100,p.add(C);const L=Ne(),_=Xe({...oo,span:L.userData.width,qa:"families"}),x=ze(X),W=Je(),u=new ye(L,_.material);p.add(u,W.quad);let V=!1,G=-1,g=!1,b=-1,K=!1,O=-1,ue;const _e={...X},Oe=new xe,ee=new xe,ce=new U,E=new U;let $=1;const k=new U,oe=new U,pe=()=>{const a=o.viewport,l=a.aspect,r=l<1;t.uScrAsp.value=l,t.uS.value=r?2*w*l/.7:2*w*l;const d=t.uS.value;t.uWdPicS.value=r?.5*(1/2.13)/.7:.5,t.uWdPicZ.value=r?.5:1,t.uWdScr.value=2*w*l/d,t.uWdSideF.value=r?0:.3,t.uWdSpan.value.set(w*l/d,w/d),$=(r?.75:.36)*2*w*l/L.userData.width,E.set(0,.12*w,0),u.scale.setScalar($),u.position.copy(E),_.uniforms.uGrainPx.value=Math.max(1,a.dpr/1.5),W.setPx(a.dpr/1.5)};pe();let D=0;return{scene:p,camera:i,clean:1,glass:1,resize(){pe()},focus(a){G=-1;const l=o.worksEnd??q;a&&typeof l?.lay=="number"&&(t.uWdLay.value=l.lay),a&&!V&&l?.q&&(x.quaternion.copy(l.q),V=!0)},update({p:a,v:l,t:r,dt:d,active:j}){if(W.show(),!V){const e=o.worksEnd;e?.q&&(typeof e.lay=="number"&&(t.uWdLay.value=e.lay),x.quaternion.copy(e.q),V=!0)}const Z=a*z,B=N(ao,z,Z),te=matchMedia("(prefers-reduced-motion: reduce)").matches,ae=0;t.uWork.value=ae,H.pause(),t.uWorkTex.value=H.texture;const S=H.texture.image;S&&(S.videoWidth||S.width)&&(t.uWorkAsp.value=(S.videoWidth||S.width)/(S.videoHeight||S.height)),t.uWdMarkOn.value=(1-ae)*2.4;{const e=o.worksEnd,v=!!e&&typeof e.wdT=="number"&&typeof e.wdAt=="number";b<0||r-b>.25?K=v&&r-e.wdAt<=.25:K&&(K=v&&e.wdAt>=b),K&&c.setClock(e.wdAt===r?e.wdT-(te?0:d):e.wdT,e)}c.update(d,{layoutJumps:!1,still:te});const Te=t.uWdBlack.value,se=Y.inOut(N(0,io,a));t.uWdBlack.value=t.uWdBlack.value*se;{const e=globalThis.__wdFloorK;t.uFloor.value=(typeof e=="number"?e:ro)*se;const v=globalThis;t.uFloorC.value=typeof v.__wdFloorCK=="number"?v.__wdFloorCK:Fe[t.uScrAsp.value<1?0:1],t.uFloorCP.value=typeof v.__wdFloorCP=="number"?v.__wdFloorCP:ge}D=Y.inOut(B);const I=o.viewport.aspect,Q=o.worksEnd?.mark;b<0||r-b>.25||a>=be?(g=!!Q,O=-1):!g&&Q&&(g=!0,O=r),b=r,g&&Q&&(ue=Q);const s=g?ue:void 0,f=s?Math.max(Y.inOut(N(Ce,be,a)),O<0?0:1-Y.inOut(N(O,O+.3,r))):1,de=s?s.fov+(Me-s.fov)*f:Me,m=h*Math.tan(re.degToRad(de/2));i.aspect=I,i.fov=de,i.updateProjectionMatrix(),y.copy(i.projectionMatrix),le.makeOrthographic(-m*I,m*I,m,-m,.1,80);const fe=y.elements,Re=le.elements,qe=i.projectionMatrix.elements;for(let e=0;e<16;e++)qe[e]=fe[e]+(Re[e]-fe[e])*D;i.projectionMatrixInverse.copy(i.projectionMatrix).invert();const He=!matchMedia("(pointer: coarse)").matches,ie=!s||f>=1,F=ie?x:s.PH,ve=F,Le=G<0?0:scrollY-G;if(G=scrollY,ve.__t!==r&&(ve.__t=r,F.update(d,{room:s?lo(s.room,X,f,_e):X,blendW:s?1-f:void 0,still:te,scrollV:s?Le*(1-f)+l*f:l,pointerX:o.pointer.x,pointerY:o.pointer.y,desk:He})),s&&ie?(s.PH.update(0,{still:!0}),Pe(s.PH,x)):s&&(x.update(0,{still:!0}),Pe(x,s.PH)),i.position.set(F.lean.x*(1-B),F.lean.y*(1-B),h),i.updateMatrixWorld(),s){const e=s.ppu*2/o.viewport.height;ce.set(i.position.x+s.x*m*I,i.position.y+s.y*m,0),u.position.lerpVectors(ce,E,f),u.scale.setScalar(e*m+($-e*m)*f),ee.copy(Oe.copy(s.camQ).invert()).multiply(F.quaternion),u.quaternion.slerpQuaternions(ee,F.quaternion,f)}else u.position.copy(E),u.scale.setScalar($),u.quaternion.copy(F.quaternion);k.copy(u.position).project(i),oe.setFromMatrixColumn(i.matrixWorld,0).add(u.position).project(i),o.wallMark={p:1,x:k.x,y:k.y,ppu:Math.hypot((oe.x-k.x)*o.viewport.width/2,(oe.y-k.y)*o.viewport.height/2)*u.scale.x,q:u.quaternion,wdT:c.time,wdAt:r,wdPic:c.picture,wdPal:c.pal,wdRed:c.uniforms.uWdRed.value,...c.pending},t.uWdHlC.value.set(k.x,k.y);{const e=globalThis.__hlK;t.uHlK.value=typeof e=="number"?e:Se}if(globalThis.__seamProbe){const e=o.wallMark,v=o.viewport.width,Ve=o.viewport.height;globalThis.__waP={p:+a.toFixed(4),u:+B.toFixed(3),k:+D.toFixed(3),work:+ae.toFixed(2),hb:+f.toFixed(4),...s?{dx:+((e.x-s.x)*v/2).toFixed(2),dy:+((e.y-s.y)*Ve/2).toFixed(2),dppu:+(e.ppu-s.ppu).toFixed(2),dq:+(2*Math.acos(Math.min(1,Math.abs(u.quaternion.dot(ee))))*180/Math.PI).toFixed(2)}:{},own:ie?1:0,useM:g?1:0,bk:+se.toFixed(4),fl:+t.uFloor.value.toFixed(4),wdT:+c.time.toFixed(4),pic:c.picture,pal:c.pal,blk:Te,mk:c.uniforms.uWdMark.value,q:u.quaternion.toArray().map(Ge=>+Ge.toFixed(5))}}_.uniforms.uTime.value=r,t.uFineOff.value=eo();try{_.capture(o.renderer,p,i,[u,W.quad])}finally{t.uFineOff.value=0}W.render(o.renderer,p,i),W.only(p)},hud(){return{flat:D.toFixed(2)}},dispose(){C.geometry.dispose(),C.material.dispose(),P.dispose(),J.texture.dispose(),L.dispose(),_.dispose(),x.dispose(),W.dispose()}}};export{ao as WA_A0,to as WA_PART,mo as default};
