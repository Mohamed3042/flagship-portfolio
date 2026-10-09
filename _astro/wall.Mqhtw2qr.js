import{a as ye,i as ge,a4 as Ke,M as ue,G as Te,C as I,a5 as We,o as Me,r as xe,t as Ae,a0 as Qe,a1 as Je,y as Xe,P as Ze,S as et,af as tt,B as ot,s as at,a2 as we,a6 as k,p as Ye}from"./EditionWorld.astro_astro_type_script_index_0_lang.P9odppCQ.js";import{C as st,l as Ge,p as Be,d as it,s as rt,b as nt,c as ut,e as lt}from"./lines.kJ_Rl7MA.js";import{a as ct}from"./glyphs.hDtjvmQh.js";import{r as vt}from"./films.DJmVDh_F.js";import{W as R,S as pt}from"./plan.Bzh-bcoD.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const ft=`
uniform float uBend; varying vec2 vUv; varying float vY;
void main(){
  vUv = uv; vec3 p = position; p.z += uBend * p.x * p.x;
  vec4 w = modelMatrix * vec4(p, 1.); vY = w.y;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,dt=`
${st}
uniform sampler2D uMap; uniform float uHas, uRaw, uAsp, uMapAsp, uDim, uAlpha, uTime, uGlow, uRefl, uLit;
uniform vec3 uAccent; varying vec2 vUv; varying float vY;
void main(){
  vec2 q = (vUv - .5) * vec2(uAsp, 1.);
  float bz = .026, aa = fwidth(q.y) * 1.3;
  float dOut = sdRBox(q, vec2(uAsp, 1.) * .5, .03), dIn = sdRBox(q, vec2(uAsp, 1.) * .5 - bz, .016);
  float body = smoothstep(aa, -aa, dOut), inside = smoothstep(aa, -aa, dIn);
  // the picture, cover-fitted into the inner area
  vec2 inner = vec2(uAsp - 2. * bz, 1. - 2. * bz);
  vec2 iq = q / inner;                                           // -.5 .. .5 across the picture
  float ia = inner.x / inner.y;
  vec2 s = ia > uMapAsp ? vec2(1., uMapAsp / ia) : vec2(ia / uMapAsp, 1.);
  vec3 c = uHas > .5 ? texture2D(uMap, iq * s + .5).rgb : S(uAccent) * .06;
  c = mix(c, S(c), uRaw);
  c *= 1. - uDim * .74;
  // a sheen: the room's soft light sliding over the glass
  float sh = smoothstep(.55, .0, abs(dot(q, vec2(.64, .77)) + .15 * sin(uTime * .15)) * 2.2);
  c += vec3(.5, .55, .62) * sh * .035 * (1. - uDim * .6);
  // the bezel: dark metal, lit along its top, a line of the film's colour on its inside edge
  vec3 bez = S(vec3(.045, .05, .06)) + S(vec3(.5, .55, .62)) * .35 * smoothstep(.0, -.04, q.y - .5 + .02 + bz) * smoothstep(-.1, 0., dOut + .01);
  float line = smoothstep(aa * 2.2, 0., abs(dIn + .004));
  bez += S(uAccent) * line * (.15 + uGlow * 1.2);
  vec3 col = mix(bez, c, inside);
  col *= 1. + uLit * .1;
  float a = body * uAlpha;
  if (uRefl > .5) a *= .28 * exp(-abs(vY) * .38) * (.5 + .5 * smoothstep(0., .8, abs(vY)));
  if (a < .003) discard;
  gl_FragColor = vec4(col, a);
}`;function ht(o,y,a,l){const d=new ye(1,1,24,1),i={uMap:{value:null},uHas:{value:0},uRaw:{value:0},uAsp:{value:y/a},uMapAsp:{value:16/9},uDim:{value:0},uAlpha:{value:1},uTime:{value:0},uGlow:{value:0},uRefl:{value:0},uLit:{value:0},uAccent:{value:o},uBend:{value:l}},e=new ge({uniforms:i,vertexShader:ft,fragmentShader:dt,transparent:!0,depthWrite:!0,side:Ke}),t=e.clone();t.uniforms.uRefl.value=1,t.depthWrite=!1;const c=new ue(d,e),m=new ue(d,t);c.scale.set(y,a,1),m.scale.set(y,-a,1);const h=new Te;return h.add(c,m),{group:h,mesh:c,refl:m,mat:e,matR:t,w:y,h:a,set(z,x,p){for(const v of[e,t]){const g=v.uniforms;g.uMap.value=z,g.uHas.value=z?1:0,g.uMapAsp.value=x,g.uRaw.value=p?1:0}},look(z,x,p,v,g){for(const H of[e,t]){const b=H.uniforms;b.uDim.value=z,b.uGlow.value=x,b.uLit.value=p,b.uAlpha.value=v,b.uTime.value=g}},dispose(){d.dispose(),e.dispose(),t.dispose()}}}const Ne=o=>o*Math.PI/180;function mt(o){const y=o.viewport.aspect,a=y<.85,l=a?54:40,d=Math.tan(Ne(l/2)),i=d*y,e=.026,t=a?7.3:4.62,c=t*(1-2*e),m=c*(a?9/16:16/9)+2*e*t,h=a?.92:.46,z=m/(2*i*h),x=m-2*e*t,p=Math.min(x/(2*i),c/(2*d)),v=Ne(a?22:24),g=Math.max(z+6,1.18*m/(2*Math.sin(v/2))),H=t/2+(a?.35:.55),b=H+t/2+3.2;return{tall:a,fov:l,aspect:y,tanV:d,tanH:i,SW:m,SH:t,dA:z,d0:p,spacing:v,Rr:g,yA:H,RY:b,camY:H,shift:a?0:Math.atan(.32*i)}}function wt(o,y){const a=i=>R.first+i*R.step;if(o<a(0)-R.hold)return 1+-1*Me.inOut(xe(R.pull-1.3,a(0)-R.hold,o));let d=0;for(let i=0;i<y-1;i++){const e=a(i)+R.hold,t=a(i+1)-R.hold;if(o>=e&&o<t)return i+Me.inOut(xe(e,t,o));o>=t&&(d=i+1)}return d}function yt(o,y,a,l){const d=new Te,i=Ge({count:1100,shared:y.G,fog:.012}),e={uCol:{value:new I("#ffffff")},uA:{value:0}},t=new ue(new ye(1,1),new ge({uniforms:e,transparent:!0,depthWrite:!1,blending:We,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uCol; uniform float uA; varying vec2 vUv; void main(){ vec2 p = (vUv - .5) * 2.; float r = length(p * vec2(1., 1.25)); gl_FragColor = vec4(uCol * exp(-r * r * 2.6) * uA, 1.); }"}));t.rotation.x=-Math.PI/2,t.position.y=.02,t.scale.set(a.SW*2.3,a.SW*1.7,1);const c={uCol:{value:new I("#ffffff")},uA:{value:0}},m=new ue(new ye(1,1),new ge({uniforms:c,transparent:!0,depthWrite:!1,blending:We,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uCol; uniform float uA; varying vec2 vUv; void main(){ vec2 p = (vUv - .5) * 2.; float r = length(p); gl_FragColor = vec4(uCol * pow(max(1. - r, 0.), 2.2) * uA, 1.); }"}));m.scale.set(a.SW*1.9,a.SH*1.9,1),d.add(t,m,i.mesh);const h=new I;return{group:d,lines:i,pool:t,halo:m,poolU:e,haloU:c,dispose(){i.dispose(),t.geometry.dispose(),t.material.dispose(),m.geometry.dispose(),m.material.dispose()},col:h}}const Le=15;async function gt(o,y){const a=document.createElement("canvas");a.width=1024,a.height=576;const l=a.getContext("2d");l.fillStyle="#10081e",l.fillRect(0,0,a.width,a.height),(await Promise.all(y.map(e=>o.textures.image(e.card).catch(()=>null)))).forEach((e,t)=>{e&&l.drawImage(e.image,t%4*256,Math.floor(t/4)*144,256,144)});const i=new Qe(a);return i.colorSpace=Je,i.generateMipmaps=!1,i.minFilter=Xe,i}function Mt(o,y,a,l,d){const i=(p,v)=>Math.ceil(v*p)+2,t=i(15,2.7)*15+i(36,2.7)*36,c=o.quality===0?2200:o.quality===1?4800:7600,m=t+c,h={uScr:{value:Array.from({length:Le},()=>new Ae)},uCards:{value:a},uOut:{value:0},uAsp0:{value:1},uN1:{value:0},uNT:{value:0},uCols1:{value:1},uCols0:{value:1},uSW:{value:l},uSH:{value:d},uVisN:{value:1},uPick:{value:new Array(8).fill(0)},uView:{value:new Ae(1,1,-10,1.6)},uPt:{value:1},uVis:{value:1}},z=Be({count:m,shared:y.G,uniforms:h,core:.6,depthTest:!1,order:9,pt:`
      uniform vec4 uScr[${Le}]; uniform sampler2D uCards; uniform float uOut, uAsp0, uN1, uNT, uCols1, uCols0, uSW, uSH, uVisN, uPt, uVis, uPick[8]; uniform vec4 uView;
      float oh(float n){ return fract(sin(n * 127.1) * 43758.5453); }
      float oh12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      vec2 oh22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        bool extra = id >= uNT, top = id < uN1;
        float L = top ? 1. : 0., rows = top ? 15. : 36., cols = top ? uCols1 : uCols0, local = top ? id : id - uN1;
        float iy = floor(local / cols), ix = local - iy * cols;
        if (!extra && iy >= rows) { pos = vec3(0.); size = 0.; col = vec4(0.); return; }
        vec2 cid = vec2(ix, iy);
        // pivot D's point
        vec2 j = (oh22(cid + L * 19.) - .5) * mix(.62, .46, L);
        vec2 pD = (cid + .5 + j) / rows, uvD = vec2(pD.x / uAsp0, pD.y);
        if (!extra && uvD.x > 1.04) { pos = vec3(0.); size = 0.; col = vec4(0.); return; }
        vec3 target = vec3((uvD.x * 2. - 1.) * uView.x, uView.w + (uvD.y * 2. - 1.) * uView.y, uView.z);
        // where it starts: a point on one of the screens in view
        float r1 = oh(id * 1.7 + 3.), r2 = oh(id * 2.3 + 7.), r3 = oh(id + 11.), r4 = oh(id * 3.1 + 5.);
        float s = uPick[int(min(floor(r1 * uVisN), 7.))];
        vec4 sc = uScr[int(s)];
        vec2 lp = (vec2(r2, r3) - .5) * vec2(uSW, uSH) * .97;
        float cy = cos(sc.w), sy = sin(sc.w);
        vec3 start = sc.xyz + vec3(lp.x * cy, lp.y, -lp.x * sy);
        vec2 cell = vec2(mod(s, 4.), floor(s / 4.));
        vec3 pic = textureLod(uCards, vec2((cell.x + r2) / 4., 1. - (cell.y + 1. - r3) / 4.), 0.).rgb;
        // lifts off, drifts up, settles
        // the picture rises as one, peeling from its top edge, then lets go of its shape
        float d1 = (1. - r3) * .2 + r4 * .04, d2 = r3 * .16;
        float e1 = smoothstep(0., 1., clamp((uOut - d1) / .34, 0., 1.)), e2 = extra ? 0. : smoothstep(0., 1., clamp((uOut - .42 - d2) / .5, 0., 1.));
        vec3 lift = start + vec3(sin(id) * .3, 2.2 + r2 * .8, cos(id * 1.7) * .3) * e1;
        lift += vec3(sin(uTime * .6 + id) * .12, sin(uTime * .8 + id * 1.3) * .16, 0.) * e1;
        lift.y += (extra ? (smoothstep(.45, 1., uOut) * (1.5 + r4 * 3.)) : 0.);
        pos = extra ? lift : mix(lift, target, e2);
        float tw = .72 + .28 * sin(uTime * (.5 + oh12(cid) * 1.7) + oh12(cid + 9.) * 6.28318);
        vec3 violet = top ? vec3(.62, .46, 1.) * 1.0 + vec3(.9, .85, 1.) * .22 : vec3(.62, .46, 1.) * .5;
        vec3 c = mix(pic * 1.5 + vec3(.03), violet, e2);
        float a = smoothstep(0., .05, uOut) * mix(.9, mix(.42, 1., L), e2) * mix(1., tw, e2);
        if (extra) a = smoothstep(0., .05, uOut) * .9 * (1. - smoothstep(.42, .78, uOut));
        size = mix(5.5, top ? 11. : 5., e2) * uPt;
        col = vec4(c, a * uVis);
      }`}),x=p=>{const v=i(15,p),g=i(36,p);h.uAsp0.value=p,h.uCols1.value=v,h.uCols0.value=g,h.uN1.value=v*15,h.uNT.value=v*15+g*36,z.setCount(v*15+g*36+c)};return x(o.viewport.aspect),{layer:z,U:h,layout:x,dispose(){z.dispose(),a.dispose()}}}const G=o=>o*Math.PI/180;async function zt(o){const y=await ct(o),a=o.films,l=a.length,d=it(o),i=Math.max(0,a.findIndex(r=>r.id==="mk-voice")),e=mt(o),t=rt(o,{atlas:y,pin:"C",pout:"D",inW:.014,outW:.045,msaa:!1,frag:"vec3 look(vec2 uv){ return samp(uv) + bloom(uv) * .42; }"}),c=new Ze(e.fov,o.viewport.aspect,.1,160),m=a.map(r=>new I(r.accent)),h=a.map((r,M)=>ht(m[M],e.SW,e.SH,1.5)),z=r=>{for(const M of h)M.mat.uniforms.uBend.value=r,M.matR.uniforms.uBend.value=r},x=a.map(r=>vt(o,r,e.tall)),p=yt(o,t,e),v=Mt(o,t,await gt(o,a),e.SW,e.SH);for(const r of h)t.world.add(r.group);t.world.add(p.group,v.layer.mesh);const g=Be({count:nt(o,120,260,420),shared:t.G,atten:90,fog:.01,core:.3,uniforms:{uHall:{value:new Ae(e.Rr,e.RY,0,0)},uDustCol:{value:new I("#ffffff")},uDustVis:{value:1}},pt:`
      uniform vec4 uHall; uniform vec3 uDustCol; uniform float uDustVis;
      float dh(float n){ return fract(sin(n * 127.1) * 43758.5453); }
      void pt(float id, out vec3 pos, out float size, out vec4 col){
        float a = dh(id) * 6.28318, r = sqrt(dh(id + 7.)) * uHall.x * .9, h = dh(id + 13.);
        pos = vec3(sin(a) * r, h * (uHall.y + 2.), -cos(a) * r);
        pos.x += sin(uTime * (.12 + h * .2) + id) * .5; pos.y += sin(uTime * (.2 + h * .15) + id * 2.) * .35;
        size = 1. + 2. * dh(id + 3.); col = vec4(uDustCol, (.1 + .35 * h * h) * uDustVis);
      }`});t.world.add(g.mesh);const H=new et,b=new tt(-1,1,1,-1,-10,10),j=Ge({count:l+2,shared:t.G,depthTest:!1});H.add(j.mesh);let J=0,X=0;const Fe=()=>{const r=o.viewport;r.width===J&&r.height===X||(J=r.width,X=r.height,b.left=-J/2,b.right=J/2,b.top=X/2,b.bottom=-X/2,b.updateProjectionMatrix())},le=(r,M,ve)=>{const oe=r-M,S=d*oe*e.spacing,B=1-k(0,.85,Math.abs(oe));let A=Ye.lerp(e.Rr,e.dA,B);return r===i&&(A=Ye.lerp(A,e.d0,ve*B)),{phi:S,act:B,rad:A,x:A*Math.sin(S),z:-A*Math.cos(S),y:e.yA+(1-B)*1,yaw:-S}},L=new I,Z=new ot,ee=new at;let te=0,be=-1,ce=!1;return x[i].prime(),x[0].prime(),await t.warm(c),{scene:t.scene,camera:c,update({p:r,t:M,dt:ve,v:oe}){const S=r*pt.wall,B=lt(M);t.tick(M,oe),t.setP(r),Fe();const A=wt(S,l),U=we(Math.round(A),0,l-1),pe=we(Math.floor(A),0,l-1),ae=1-k(1,R.pull,S),W=xe(.915,.985,r),V=1-k(0,.3,W);L.copy(m[pe]).lerp(m[Math.min(l-1,pe+1)],Me.inOut(A-pe));const Se=ut(o,M,ve),Ce=e.shift*k(1.2,5.4,S)*(1-k(.91,.945,r))*-d,Ie=-.32*(.5-.5*Math.cos(S*Math.PI*2/(R.step*2)))*k(R.pull,R.first,S)*(1-k(.9,.93,r));c.position.set(Se.x*.25*(1-W),e.camY+Se.y*.15*(1-W),Ie),c.lookAt(Math.sin(Ce)*20,e.camY,-Math.cos(Ce)*20),c.updateMatrixWorld();const fe=p.lines;let Re=0;const Y=(s,n,f,u,w,q,D,O,P=1.2)=>fe.set(Re++,s,n,f,u,w,q,D[0],D[1],D[2],O,P,0,1,0),E=[L.r,L.g,L.b],se=[.55,.5,.46],de=[.2,.19,.18],_=[],je=v.U.uScr.value;a.forEach((s,n)=>{const f=h[n],u=le(n,A,ae),w=le(n,l-1,0);je[n].set(w.x,w.y,w.z,w.yaw),Math.abs(w.x)<Math.abs(w.z)*e.tanH+e.SW*.5&&Math.abs(w.phi)<1.2&&_.length<8&&(_.push(n),n===l-1&&_.push(n));const q=Math.abs(u.phi)<1.45&&V>.001;if(n===i&&z(1.5*(1-ae)),f.group.visible=q,!q){x[n].pause();return}const D=x[n].frame(n===U&&Math.abs(A-n)<.3&&W<.02&&S>.15);f.set(D.tex,D.asp,D.live),n===i&&(t.U.tVid.value=D.tex??t.U.tVid.value,t.U.uVidAsp.value=D.asp,t.U.uVidRaw.value=D.live?1:0),f.group.position.set(u.x,u.y,u.z),f.group.rotation.y=u.yaw,f.refl.position.y=-2*u.y,f.look(we(.5*(1-u.act)+.3*k(.9,2.6,Math.abs(n-A)),0,.86),u.act,u.act,V,B);const O=Math.sin(u.phi),P=Math.cos(u.phi),ke=e.Rr*O,Oe=-e.Rr*P,$=u.rad*O,K=-u.rad*P,he=.25+.75*u.act,re=[E[0]*he+se[0]*(1-u.act)*.5,E[1]*he+se[1]*(1-u.act)*.5,E[2]*he+se[2]*(1-u.act)*.5],F=e.RY,_e=u.y+e.SH/2,N=e.SW/2-.45,Pe=.34,$e=.16;u.rad<e.Rr-.05&&Y(ke,F,Oe,$,F,K,re,.9*V,2.2),Y($-P*N,F-.12,K-O*N,$+P*N,F-.12,K+O*N,re,.8*V,1.6);for(const C of[-1,1])Y($+C*P*N,F-.12,K+C*O*N,$+C*P*N,_e,K+C*O*N,re,.75*V,1.1);const He=(C,Q)=>[ke+P*C*Pe,F-.1+Q*$e,Oe+O*C*Pe],ne=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let C=0;C<4;C++){const Q=He(ne[C][0],ne[C][1]),me=He(ne[(C+1)%4][0],ne[(C+1)%4][1]);Y(Q[0],Q[1],Q[2],me[0],me[1],me[2],re,.9*V,1.6)}}),v.U.uVisN.value=Math.max(1,_.length),_.forEach((s,n)=>{v.U.uPick.value[n]=s});for(let s=-38;s<38;s++){const n=G(s*3),f=G((s+1)*3),u=1-k(70,112,Math.abs(s*3));for(const w of[0,-.16])Y(e.Rr*Math.sin(n),e.RY+w,-e.Rr*Math.cos(n),e.Rr*Math.sin(f),e.RY+w,-e.Rr*Math.cos(f),se,.6*u*V,w?1:2)}const ie=e.Rr+7;for(let s=-8;s<=8;s++){const n=G(s*12),f=ie*Math.sin(n),u=-ie*Math.cos(n),w=(1-Math.abs(s)/9)*V;if(Y(f,0,u,f,e.RY+5,u,de,.55*w,1.2),s<8)for(const q of[e.RY+1,e.RY+5])Y(f,q,u,ie*Math.sin(G((s+1)*12)),q,-ie*Math.cos(G((s+1)*12)),de,.5*w,1)}for(const s of[5,10,16])for(let n=-22;n<22;n++){const f=G(n*4),u=G((n+1)*4);Y(s*Math.sin(f),.01,-s*Math.cos(f),s*Math.sin(u),.01,-s*Math.cos(u),de,.5*(1-Math.abs(n)/24)*V,1)}fe.setCount(Math.min(1100,Re)),fe.dirty();const T=le(U,A,ae),ze=V*(1-ae*.9);p.pool.position.set(T.x*.9,.02,T.z*.9+1.2),p.pool.rotation.z=-T.phi,p.poolU.uCol.value.copy(L),p.poolU.uA.value=.2*ze,p.halo.position.set(T.x*1.04,T.y,T.z*1.04),p.halo.rotation.y=T.yaw,p.haloU.uCol.value.copy(L),p.haloU.uA.value=.22*ze,g.U.uDustCol.value.copy(L),g.U.uDustVis.value=V,v.U.uOut.value=W,v.U.uVis.value=k(0,.03,W),v.layer.mesh.visible=W>.001;const Ue=14*e.tanV;v.U.uView.value.set(Ue*o.viewport.aspect,Ue,-14,c.position.y),v.U.uPt.value=Math.max(.7,o.viewport.height/760);const Ve=e.tall?19:17,qe=(l-1)*Ve,De=(e.tall?74:62)-o.viewport.height/2,Ee=e.tall?(o.viewport.width-qe)/2:d>0?o.viewport.width-96-qe:96;for(let s=0;s<l;s++){const n=Ee+(d>0?s:l-1-s)*Ve-o.viewport.width/2,f=s===U,u=s<U,w=f?E.map(q=>q*1.5):u?E.map(q=>q*.5):[.4,.4,.4];j.set(s,n,De,0,n,De+(f?15:7),0,w[0],w[1],w[2],(f?1:.8)*V,f?2.4:1.4,0,1,0)}j.setCount(l),j.dirty();for(let s=1;s<=(o.quality?2:1);s++)U+s<l&&S>R.first-2&&x[U+s].prime();te=U,S>R.first-1&&be!==U&&Math.abs(A-U)<.2&&(be=U,o.emit("film",{index:U,film:a[U]})),ce=W<.02&&S>R.first-1&&Math.abs(A-U)<.12,t.draw(c,t.world,0,[[H,b]])},resize(){t.resize(),c.aspect=o.viewport.aspect,c.updateProjectionMatrix(),v.layout(c.aspect)},pick(r,M){return ce?(ee.set(r,M),Z.setFromCamera(ee,c),Z.intersectObject(h[te].mesh,!1).length?a[te].url:null):null},hover(r,M){return ce?(ee.set(r,M),Z.setFromCamera(ee,c),Z.intersectObject(h[te].mesh,!1).length>0):!1},focus(r){if(!r)for(const M of x)M.pause()},dispose(){t.dispose();for(const r of h)r.dispose();p.dispose(),v.dispose(),g.dispose(),j.dispose()}}}export{zt as default};
