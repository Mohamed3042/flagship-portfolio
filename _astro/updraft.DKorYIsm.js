import{B as ae,b as me,a as ve,M as J,k as O,aU as Te,aG as Se,aI as Me,ar as qe,G as Be,e as He,S as Pe,P as Ue,aj as _e,p as j,r as de,a7 as Q,am as R,aY as fe,a8 as X}from"./EditionWorld.astro_astro_type_script_index_0_lang.B1LhbRKH.js";import{P as D,F as Z,s as Re,c as he,T as b,a as De,h as Oe,u as ze,v as Ce,x as Fe,y as ke,p as Ne,l as We,d as Ee,g as ee,D as xe,S as we,A as Ge,z as je,B as be,U as ye}from"./path.DSLJsfer.js";import{c as Ve,t as Le}from"./clouds.1yzfgi7f.js";import"./preload-helper.4QTdcD_W.js";import"./media-base.DZ9PvFge.js";import"./profile.BzIFyfJU.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const $e=`
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
    // the picture: covering the current shape, bent like a lens while it is a sphere, turned half round until it rights
    // itself in the middle of the bloom
    vec2 q = p / half_;                                   // -1..1 over the shape
    float lens = 1. - b;
    q *= 1. + lens * .35 * (dot(q, q) - 1.);              // a fish-eye's bulge
    float turn = 3.14159 * (1. - smoothstep(.3, .75, uBloom));
    q = mat2(cos(turn), sin(turn), -sin(turn), cos(turn)) * q;
    vec2 asp = half_.x / half_.y > uTexAsp ? vec2(1., uTexAsp * half_.y / half_.x) : vec2(half_.x / half_.y / uTexAsp, 1.);
    vec2 uv = q * asp * .5 + .5;
    vec3 pic = uHasTex > .5 ? texture2D(uTex, uv).rgb : mix(uShade, uWarm, vUv.y);
    pic = mix(pic, mix(pic, uWarm, .35), lens * .6);       // inside the bubble: softer, warmer
    pic *= 1. - uDim * .45;
    // the opal rim and a soft warm glow just outside the edge
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
  }`,Ie=(e,l,o)=>{const f=l.card.replace(/card\.webp$/,"");return o?{still:l.poster,stillAsp:2/3,clip:`${f}hero-tall.mp4`,clipAsp:9/16}:{still:l.card,stillAsp:16/9,clip:e.quality>0?`${f}hero.mp4`:l.loop,clipAsp:16/9}};function Ye(e,l,o,{w:f=9,h:M=81/16,r:c=2.3}={}){const m=Ie(e,l,o),r=new ae(Math.max(f,2*c)+1.2,Math.max(M,2*c)+1.2),t={uTex:{value:null},uHasTex:{value:0},uBloom:{value:0},uTexAsp:{value:m.stillAsp},uDim:{value:0},uHover:{value:0},uTime:{value:0},uBox:{value:r},uPane:{value:new ae(f,M)},uOrbR:{value:c},uCorner:{value:Math.min(f,M)*.045},uRim:{value:D.pearl.clone()},uWarm:{value:D.champagne.clone()},uShade:{value:D.rose.clone()}},q=new me({uniforms:t,transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:$e}),h=new ve(r.x,r.y),y=new J(h,q);y.renderOrder=700;const x={uSun:{value:new O(0,.05,-1)},uSunCol:{value:D.sunCol.clone()},uSky:{value:D.skyAmb.clone()},uHaze:{value:D.haze.clone()},uAmt:{value:1},uTime:{value:0}},A=new me({uniforms:x,transparent:!0,depthWrite:!1,blending:Me,blendSrc:Se,blendDst:Te,vertexShader:"varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Ke}),T=new qe(c,40,24),w=new J(T,A);w.renderOrder=710;const B=new Be;B.add(y,w);const g=new J(new ve(f,M),new He({visible:!1}));B.add(g);let u=null,H=null;return e.textures.image(m.still).then(p=>{H=p,(!t.uHasTex.value||t.uTex.value!==u?.texture)&&(t.uTex.value=p,t.uHasTex.value=1)}).catch(()=>{}),{group:B,pane:y,plate:g,U:t,film:l,update(p,P,S,k,N){y.quaternion.copy(p.quaternion),g.quaternion.copy(p.quaternion),t.uBloom.value=P,t.uTime.value=k,x.uTime.value=k,x.uSun.value.copy(N),x.uAmt.value=1-Math.min(1,P*1.6),w.visible=x.uAmt.value>.01,S?(u??=e.textures.video(m.clip),u.video.paused&&u.video.play().catch(()=>{})):u&&!u.video.paused&&u.video.pause(),!!u&&u.video.readyState>=2&&S?(t.uTex.value=u.texture,t.uTexAsp.value=m.clipAsp,t.uHasTex.value=1):H&&(t.uTex.value=H,t.uTexAsp.value=m.stillAsp,t.uHasTex.value=1)},dispose(){h.dispose(),q.dispose(),T.dispose(),A.dispose(),g.geometry.dispose(),g.material.dispose(),u?.video.pause()}}}const oa=e=>{const l=new Pe,o=new Ue(Z.wide,e.viewport.aspect,.1,6e3),f=e.quality>0,M=e.lang==="ar",c=M?-1:1,m=e.films,r=m.length,t=Re(),q=he(e,{y:we.y,amp:we.amp}),h=he(e,{y:xe.y,amp:xe.amp,scale:1/150});h.U.uHoleAt.value.set(b.x*c,b.z),h.U.uHoleR.value=b.wall*.8,h.U.uHoleF.value=26,l.add(t.mesh,q.mesh,h.mesh);const y=De(e.quality,Ge);l.add(y.group);const x=Ve(e,Le(e.quality,c));l.add(x.mesh);const A=Oe(e.quality===0?60:120,{box:[50,40,50],len:.9,msaa:f,fall:2.2,seed:13});A.U.uSwing.value=2.2,l.add(A.mesh);let T=e.viewport.portrait,w=[];const B=()=>{w.forEach(a=>{l.remove(a.group),a.dispose()}),w=m.map((a,s)=>{const i=Ye(e,a,T,T?{w:4.05,h:7.2,r:2.1}:{w:9,h:5.0625,r:2.3}),d=je(s),E=b.y0+s*b.rise;return i.group.position.set((b.x+Math.cos(d)*b.orb)*c,E+.5,b.z+Math.sin(d)*b.orb),i.plate.userData.index=s,l.add(i.group),i})};B();let g=.28,u=0;const H=()=>{const a=e.viewport;o.aspect=a.aspect,o.fov=a.portrait?Z.tall:Z.wide,o.updateProjectionMatrix(),a.portrait!==T&&(T=a.portrait,B()),g=a.portrait?0:(a.aspect>1.3?.28:.1)*c,u=a.portrait?.34:0};H();const p=new O,P=new O,S=new O,k=new O,N=new O,V=new _e,oe=new ae,se=(a,s)=>{oe.set(a,s),V.setFromCamera(oe,o);const i=V.intersectObjects(w.map(d=>d.plate),!1)[0];return i?i.object.userData.index:-1};let v=0,te=!0,re=-1,ie=!1,W=-1;const z=new Array(r).fill(-1),U=new Array(r).fill(0),L=new Array(r).fill(0),le=be(1,r)-(r-1);return{scene:l,camera:o,light:!0,resize:H,focus(a){ie=a},update({p:a,t:s,dt:i}){const d=be(a,r),E=R(d,0,r-1),ue=Math.floor(E),C=d-(r-1),$=d<0?d:C>0?r-1+C*X(0,.5,C):ue+j.inOut(de(.18,.82,E-ue));v=te||ee?$:Q(v,$,d<0?40:5,i),C>0&&(v=fe(v,$,X(0,.4,C))),te=!1,ze(v,c,P,S);const ge=j.inOut(R(-v)),K=R((v-(r-1))/le),Ae=j.inOut(K),I=1-Math.max(ge,Ae);K>0&&(Ce(r,c,k,N),Fe(P,S,N,X(0,1,K),S));const ne=e.viewport;ke(o,g*I,u*I,ne.width,ne.height),o.updateProjectionMatrix();const pe=Ne(e,s,i);We(o,P,S,pe.x,pe.y),Ee(fe(ye.u[0],ye.u[1],R((v+1)/(r+le))),p,c),t.update(o,p),q.update(o,s,p),h.update(o,s,p),x.update(o,s,p),y.update(o,s,e.viewport.dpr),A.update(o,s,p);const G=Math.round(R(v,0,r-1)),ce=I>.7;G!==re&&ce&&(re=G,e.emit("film",{index:G,film:m[G]})),w.forEach((F,n)=>{const _=Math.abs(n-v);_<.08&&z[n]<0&&(z[n]=s),_>.5&&(z[n]=-1);const Y=z[n]<0?0:j.inOut(de(.1,1.4,s-z[n]));U[n]=ee?_<.3?1:0:Y>U[n]?Y:Q(U[n],Y,3,i),L[n]=Q(L[n],n===W?1:0,8,i),F.U.uDim.value=R(_*1.2)*.5,F.U.uHover.value=L[n],F.group.visible=_<4,F.group.visible&&F.update(o,U[n],ie&&_<.35&&ce&&!ee,s,p)})},pick(a,s){const i=se(a,s);return i>=0&&U[i]>.6?m[i].url:null},hover(a,s){return W=e.pointer.inside?se(a,s):-1,W>=0&&U[W]>.6},dispose(){t.dispose(),q.dispose(),h.dispose(),y.dispose(),x.dispose(),A.dispose(),w.forEach(a=>a.dispose())}}};export{oa as default};
