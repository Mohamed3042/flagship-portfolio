import{e as G,r as me,B as Q,x as U,R as ve,z as X}from"./EditionWorld.astro_astro_type_script_index_0_lang.CoQ80-_6.js";import{P as z,F as Y,s as Te,c as de,T as y,a as Se,h as Me,u as qe,v as Be,x as He,y as Pe,p as _e,l as Re,d as Ue,g as Z,D as fe,S as he,A as ze,z as De,B as xe,U as we}from"./path.D0kPvRpM.js";import{c as Oe,t as Ce}from"./clouds.BDQl-MJm.js";import{k as ae,d as ye,c as be,M as ee,V as D,aj as Fe,a7 as Ne,a9 as We,T as ke,G as Ee,e as Ve,S as Ge,P as je,J as Le}from"./three.module.pheUvn1h.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const $e=`
  uniform sampler2D uTex; uniform float uHasTex, uBloom, uTexAsp, uDim, uHover, uTime;
  uniform vec2 uBox, uPane; uniform float uOrbR, uCorner; uniform vec3 uRim, uWarm, uShade;
  varying vec2 vUv;
  float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
  void main(){
    float b = smoothstep(0., 1., uBloom);
    vec2 p = (vUv - .5) * uBox;
    vec2 half_ = mix(vec2(uOrbR), uPane * .5, b);
    float rad = mix(uOrbR, uCorner, b);
    float d = sdBox(p, half_, min(rad, min(half_.x, half_.y)));
    float aa = fwidth(d) * 1.2;
    float inside = smoothstep(aa, -aa, d);


    vec2 q = p / half_;
    float lens = 1. - b;
    q *= 1. + lens * .35 * (dot(q, q) - 1.);
    float turn = 3.14159 * (1. - smoothstep(.3, .75, uBloom));
    q = mat2(cos(turn), sin(turn), -sin(turn), cos(turn)) * q;
    vec2 asp = half_.x / half_.y > uTexAsp ? vec2(1., uTexAsp * half_.y / half_.x) : vec2(half_.x / half_.y / uTexAsp, 1.);
    vec2 uv = q * asp * .5 + .5;
    vec3 pic = uHasTex > .5 ? texture2D(uTex, uv).rgb : mix(uShade, uWarm, vUv.y);
    pic = mix(pic, mix(pic, uWarm, .35), lens * .6);
    pic *= 1. - uDim * .45;

    float rim = exp(-pow(d / (.06 + .1 * lens), 2.));
    vec3 film = .5 + .5 * cos(6.2832 * (d * 4. + uTime * .05 + vec3(0., .33, .67)));
    vec3 col = pic * inside + (uRim + film * .25) * rim * (.45 + .4 * uHover);
    float glow = exp(-max(d, 0.) * 3.) * .18 * b;
    float a = max(inside, rim * .7) + glow * (1. - inside);
    col += uWarm * glow * (1. - inside);
    gl_FragColor = vec4(col, clamp(a, 0., 1.));
  }`,Ke=`
  uniform vec3 uSun, uSunCol, uSky, uHaze; uniform float uAmt, uTime;
  varying vec3 vN, vW;
  void main(){
    vec3 N = normalize(vN), V = normalize(cameraPosition - vW), L = normalize(uSun);
    float f = pow(1. - abs(dot(N, V)), 2.2);
    vec3 film = .5 + .5 * cos(6.2832 * (f * 1.6 + N.y * .3 + uTime * .03 + vec3(0., .33, .67)));
    vec3 refl = mix(uHaze, uSky, .5 + .5 * N.y);
    float spec = pow(max(dot(reflect(-V, N), L), 0.), 220.) * 3.;
    vec3 col = refl * f * .9 + film * f * .35 + uSunCol * spec;
    float a = clamp(f * .75 + spec, 0., 1.) * uAmt;
    gl_FragColor = vec4(col * uAmt, a);
  }`,Ie=(e,i,o)=>{const f=i.card.replace(/card\.webp$/,"");return o?{still:i.poster,stillAsp:2/3,clip:`${f}hero-tall.mp4`,clipAsp:9/16}:{still:i.card,stillAsp:16/9,clip:e.quality>0?`${f}hero.mp4`:i.loop,clipAsp:16/9}};function Je(e,i,o,{w:f=9,h:M=81/16,r:c=2.3}={}){const m=Ie(e,i,o),r=new ae(Math.max(f,2*c)+1.2,Math.max(M,2*c)+1.2),t={uTex:{value:null},uHasTex:{value:0},uBloom:{value:0},uTexAsp:{value:m.stillAsp},uDim:{value:0},uHover:{value:0},uTime:{value:0},uBox:{value:r},uPane:{value:new ae(f,M)},uOrbR:{value:c},uCorner:{value:Math.min(f,M)*.045},uRim:{value:z.pearl.clone()},uWarm:{value:z.champagne.clone()},uShade:{value:z.rose.clone()}},q=new ye({uniforms:t,transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:$e}),h=new be(r.x,r.y),b=new ee(h,q);b.renderOrder=700;const x={uSun:{value:new D(0,.05,-1)},uSunCol:{value:z.sunCol.clone()},uSky:{value:z.skyAmb.clone()},uHaze:{value:z.haze.clone()},uAmt:{value:1},uTime:{value:0}},A=new ye({uniforms:x,transparent:!0,depthWrite:!1,blending:We,blendSrc:Ne,blendDst:Fe,vertexShader:"varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Ke}),T=new ke(c,40,24),w=new ee(T,A);w.renderOrder=710;const B=new Ee;B.add(b,w);const g=new ee(new be(f,M),new Ve({visible:!1}));B.add(g);let l=null,H=null;return e.textures.image(m.still).then(p=>{H=p,(!t.uHasTex.value||t.uTex.value!==l?.texture)&&(t.uTex.value=p,t.uHasTex.value=1)}).catch(()=>{}),{group:B,pane:b,plate:g,U:t,film:i,update(p,P,S,N,W){b.quaternion.copy(p.quaternion),g.quaternion.copy(p.quaternion),t.uBloom.value=P,t.uTime.value=N,x.uTime.value=N,x.uSun.value.copy(W),x.uAmt.value=1-Math.min(1,P*1.6),w.visible=x.uAmt.value>.01,S?(l??=e.textures.video(m.clip),l.video.paused&&l.video.play().catch(()=>{})):l&&!l.video.paused&&l.video.pause(),!!l&&l.video.readyState>=2&&S?(t.uTex.value=l.texture,t.uTexAsp.value=m.clipAsp,t.uHasTex.value=1):H&&(t.uTex.value=H,t.uTexAsp.value=m.stillAsp,t.uHasTex.value=1)},dispose(){h.dispose(),q.dispose(),T.dispose(),A.dispose(),g.geometry.dispose(),g.material.dispose(),l?.video.pause()}}}const sa=e=>{const i=new Ge,o=new je(Y.wide,e.viewport.aspect,.1,6e3),f=e.quality>0,M=e.lang==="ar",c=M?-1:1,m=e.films,r=m.length,t=Te(),q=de(e,{y:he.y,amp:he.amp}),h=de(e,{y:fe.y,amp:fe.amp,scale:1/150});h.U.uHoleAt.value.set(y.x*c,y.z),h.U.uHoleR.value=y.wall*.8,h.U.uHoleF.value=26,i.add(t.mesh,q.mesh,h.mesh);const b=Se(e.quality,ze);i.add(b.group);const x=Oe(e,Ce(e.quality,c));i.add(x.mesh);const A=Me(e.quality===0?60:120,{box:[50,40,50],len:.9,msaa:f,fall:2.2,seed:13});A.U.uSwing.value=2.2,i.add(A.mesh);let T=e.viewport.portrait,w=[];const B=()=>{w.forEach(a=>{i.remove(a.group),a.dispose()}),w=m.map((a,s)=>{const u=Je(e,a,T,T?{w:4.05,h:7.2,r:2.1}:{w:9,h:5.0625,r:2.3}),d=De(s),E=y.y0+s*y.rise;return u.group.position.set((y.x+Math.cos(d)*y.orb)*c,E+.5,y.z+Math.sin(d)*y.orb),u.plate.userData.index=s,i.add(u.group),u})};B();let g=.28,l=0;const H=()=>{const a=e.viewport;o.aspect=a.aspect,o.fov=a.portrait?Y.tall:Y.wide,o.updateProjectionMatrix(),a.portrait!==T&&(T=a.portrait,B()),g=a.portrait?0:(a.aspect>1.3?.28:.1)*c,l=a.portrait?.34:0};H();const p=new D,P=new D,S=new D,N=new D,W=new D,j=new Le,oe=new ae,se=(a,s)=>{oe.set(a,s),j.setFromCamera(oe,o);const u=j.intersectObjects(w.map(d=>d.plate),!1)[0];return u?u.object.userData.index:-1};let v=0,te=!0,re=-1,ue=!1,k=-1;const O=new Array(r).fill(-1),_=new Array(r).fill(0),L=new Array(r).fill(0),ie=xe(1,r)-(r-1);return{scene:i,camera:o,light:!0,resize:H,focus(a){ue=a},update({p:a,t:s,dt:u}){const d=xe(a,r),E=U(d,0,r-1),le=Math.floor(E),C=d-(r-1),$=d<0?d:C>0?r-1+C*X(0,.5,C):le+G.inOut(me(.18,.82,E-le));v=te||Z?$:Q(v,$,d<0?40:5,u),C>0&&(v=ve(v,$,X(0,.4,C))),te=!1,qe(v,c,P,S);const ge=G.inOut(U(-v)),K=U((v-(r-1))/ie),Ae=G.inOut(K),I=1-Math.max(ge,Ae);K>0&&(Be(r,c,N,W),He(P,S,W,X(0,1,K),S));const ne=e.viewport;Pe(o,g*I,l*I,ne.width,ne.height),o.updateProjectionMatrix();const pe=_e(e,s,u);Re(o,P,S,pe.x,pe.y),Ue(ve(we.u[0],we.u[1],U((v+1)/(r+ie))),p,c),t.update(o,p),q.update(o,s,p),h.update(o,s,p),x.update(o,s,p),b.update(o,s,e.viewport.dpr),A.update(o,s,p);const V=Math.round(U(v,0,r-1)),ce=I>.7;V!==re&&ce&&(re=V,e.emit("film",{index:V,film:m[V]})),w.forEach((F,n)=>{const R=Math.abs(n-v);R<.08&&O[n]<0&&(O[n]=s),R>.5&&(O[n]=-1);const J=O[n]<0?0:G.inOut(me(.1,1.4,s-O[n]));_[n]=Z?R<.3?1:0:J>_[n]?J:Q(_[n],J,3,u),L[n]=Q(L[n],n===k?1:0,8,u),F.U.uDim.value=U(R*1.2)*.5,F.U.uHover.value=L[n],F.group.visible=R<4,F.group.visible&&F.update(o,_[n],ue&&R<.35&&ce&&!Z,s,p)})},pick(a,s){const u=se(a,s);return u>=0&&_[u]>.6?m[u].url:null},hover(a,s){return k=e.pointer.inside?se(a,s):-1,k>=0&&_[k]>.6},dispose(){t.dispose(),q.dispose(),h.dispose(),b.dispose(),x.dispose(),A.dispose(),w.forEach(a=>a.dispose())}}};export{sa as default};
