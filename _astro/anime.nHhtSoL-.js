import{a0 as _e,a1 as qe,s as ae,P as Ue,M as X,a as fe,i as H,al as be,a9 as oe,aE as Ne,C as Oe,aF as We,aG as je,aH as Le,aq as Ve,V as se,m as Ee,ac as Xe,aj as He,G as Ye,a5 as Ze,Z as Be,a6 as i,p as Je,n as Ke,a2 as Re,o as Qe}from"./EditionWorld.astro_astro_type_script_index_0_lang.DKyZ0HWE.js";import{m as et}from"./BufferGeometryUtils.7-H983-K.js";import{f as tt,s as at,C as me,F as ie,l as ot,S as st,a as de}from"./plan.D6vxtqRN.js";import"./preload-helper.4QTdcD_W.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const a={flick:1,rev0:1.5,rev1:2.4,mkIn0:8,mkIn1:12.5,charge0:13.4,push:16.2,title0:19.2,title1:21.6,zip:27.6,paper0:28.4,paper1:33.2,lines0:27.9,lines1:33},it=new se(-.55,.42,-.72).normalize(),nt=(S,c,M,k)=>i(S,c,k)*(1-i(c,c+M,k));function rt(S,c,M){const k=M<.9,w=Math.round(Math.min(2048,1400*Math.max(1,M))),P=Math.round(w/M);S.width=w,S.height=P;const t=S.getContext("2d"),n=Be(9);t.clearRect(0,0,w,P);const _=k?w*.5:w*.66,C=k?P*.6:P*.5,o=k?w*.9:w*.6,f=(T,g,J,ue,R,K)=>{const F=J-T,x=ue-g,L=Math.hypot(F,x),A=-x/L,B=F/L,D=[],W=[];for(let p=0;p<=80;p++){const l=p/80,v=R*i(0,.07,l)*(1-.55*i(.72,1,l)),I=(n()-.5)*R*.1;D.push([T+F*l+A*(v/2+I),g+x*l+B*(v/2+I)]),W.push([T+F*l-A*(v/2+I),g+x*l-B*(v/2+I)])}t.fillStyle=K,t.beginPath(),D.forEach(([p,l],v)=>v?t.lineTo(p,l):t.moveTo(p,l)),W.reverse().forEach(([p,l])=>t.lineTo(p,l)),t.closePath(),t.fill(),t.globalCompositeOperation="destination-out";for(let p=0;p<26;p++){const l=.55+n()*.4,v=(n()-.5)*R*.8;t.lineWidth=1+n()*R*.035,t.strokeStyle=`rgba(0,0,0,${.5+n()*.5})`,t.beginPath(),t.moveTo(T+F*l+A*v,g+x*l+B*v),t.lineTo(T+F*(l+.1+n()*.35)+A*v,g+x*(l+.1+n()*.35)+B*v),t.stroke()}t.globalCompositeOperation="source-over"},Y=-.1,ne=Math.cos(Y),re=Math.sin(Y),m=o*1.08,r=k?P*.17:P*.26,y=(T,g)=>[_+ne*T-re*g,C+re*T+ne*g],[q,N]=[y(-m/2,0),y(m/2,0)],U=c?-1:1;f(...U>0?[...y(-m/2-30,r*.52),...y(m/2+60,r*.52)]:[...y(m/2+30,r*.52),...y(-m/2-60,r*.52)],r*.5,"#14081e"),f(...U>0?[...q,...N]:[...N,...q],r*1.05,"#e8223c"),f(...U>0?[...y(-m/2+80,-r*.62),...y(m/2-40,-r*.62)]:[...y(m/2-80,-r*.62),...y(-m/2+40,-r*.62)],r*.22,"#fff7e0");const j=c?de.title.ar:de.title.en,O=c?ie.ar:ie.sans;t.save(),t.translate(_,C),t.rotate(Y),t.textAlign="center",t.textBaseline="middle",t.lineJoin="round",t.direction=c?"rtl":"ltr";let h=P*.3;t.font=`${c?900:700} ${c?"":"italic "}${h}px ${O}`,h*=Math.min(c?1.4:1,o/t.measureText(j).width),t.font=`${c?900:700} ${c?"":"italic "}${h}px ${O}`,t.fillStyle="#14081e",t.fillText(j,h*.05,h*.06),t.lineWidth=h*.09,t.strokeStyle="#14081e",t.strokeText(j,0,0),t.fillStyle="#ffffff",t.fillText(j,0,0),t.font=`${c?700:600} ${h*.2}px ${O}`,t.lineWidth=h*.03,t.strokeStyle="#14081e";const Z=c?de.titleSub.ar:de.titleSub.en.toUpperCase();t.strokeText(Z,0,h*.72),t.fillStyle="#fff7e0",t.fillText(Z,0,h*.72),t.restore()}async function pt(S){await tt([`700 40px ${ie.sans}`,`900 40px ${ie.ar}`,`600 20px ${ie.ar}`]);const c=S.lang==="ar",M=S.quality,k=document.createElement("canvas"),w=new _e(k);w.colorSpace=qe,w.anisotropy=4;let P=0;const t=at(S,{uniforms:{tTitle:{value:w},uSun:{value:new ae(.2,.8)},uFlare:{value:0},uSpeed:{value:1},uPh:{value:0},uReveal:{value:0},uInvf:{value:0},uPaper:{value:0},uInk:{value:0},uB:{value:0},uTitleP:{value:0},uTitleA:{value:1},uRtl:{value:c?1:0},uFlash:{value:0},uMk:{value:new ae(.5,.5)},uAura:{value:0},uRing:{value:new ae(0,0)},uFx:{value:1}},frag:`
      uniform sampler2D tTitle; uniform vec2 uSun, uMk, uRing; uniform float uFlare, uSpeed, uPh, uReveal, uInvf, uPaper, uInk, uB, uTitleP, uTitleA, uRtl, uFlash, uAura, uFx;
      float hexd(vec2 p, float r){ p = abs(p); return max(dot(p, vec2(.866, .5)), p.y) - r; }
      vec3 flare(vec2 p, vec2 s){
        vec2 d = p - s; float r = length(d);
        vec3 c = vec3(1., .9, .7) * exp(-r * 4.5) * .5 + vec3(1., .96, .86) * exp(-r * 30.) * 1.3;
        c += vec3(1., .85, .6) * exp(-abs(d.y) * 55.) * exp(-abs(d.x) * 1.8) * .45;
        for (int i = 0; i < 5; i++){
          float fi = float(i), k = .35 + fi * .32, rad = .045 + .03 * fi, h = hexd(p - s * (1. - 2. * k), rad);
          vec3 tint = .5 + .5 * cos(6.28318 * (vec3(0., .33, .67) + fi * .21 + .1));
          c += tint * (smoothstep(.005, 0., abs(h)) * .35 + smoothstep(0., -.02, h) * .07);
        }
        return c;
      }
      void main(){
        vec2 uv = vUv, p = (uv - .5) * vec2(uAsp, 1.);
        vec3 sc = samp(uv);
        float aa = fwidth(uv.y);
        // aura glow round the mark, the ring of its push
        vec2 mp = (uv - uMk) * vec2(uAsp, 1.);
        sc += S(vec3(1., .8, .35)) * exp(-length(mp) * 3.2) * uAura * .55;
        sc += S(vec3(1., .95, .8)) * smoothstep(.03, 0., abs(length(mp) - uRing.x)) * uRing.y;
        // speed lines (white, from the centre)
        float a = atan(p.y, p.x) / 6.28318 + .5, r = length(p), N = 90.;
        float cell = floor(a * N), fa = fract(a * N), hh = h12(vec2(cell, uPh));
        float hw = (.05 + .22 * hh * hh) * smoothstep(.25, .8, r), sp = smoothstep(hw + .08, hw, abs(fa - .5)) * step(.22 + .2 * h12(vec2(cell, 3.)), r);
        sc = mix(sc, vec3(1.), sp * uSpeed * .9);
        sc += flare(p, (uSun - .5) * vec2(uAsp, 1.)) * uFlare;
        // title
        float rv = uTitleP * 1.25 - .08, ux = mix(uv.x, 1. - uv.x, uRtl);
        float mask = smoothstep(rv, rv - .07, ux + (vn(vec2(uv.y * 16., 3.)) - .5) * .09);
        vec4 t = texture2D(tTitle, uv);
        sc = mix(sc, t.rgb, t.a * mask * uTitleA);
        sc = mix(sc, vec3(1.), uFlash);
        sc *= mix(1., smoothstep(1.5, .5, length(p)), .35 * uFx);
        // the impact frame it tears out of
        vec3 P = pivot2(uv, uAsp, uPh); P = mix(P, 1. - P, uInvf);
        float jag = (h12(vec2(floor(atan(p.y, p.x) * 24.), uPh)) - .5) * .12, rr = length(p) + jag;
        vec3 c = mix(P, sc, 1. - smoothstep(uReveal - .05, uReveal, rr));
        c += vec3(1.) * smoothstep(.06, 0., abs(rr - uReveal)) * step(.01, uReveal) * step(uReveal, 1.6) * .9;
        // the speed lines bend into ink on cream paper
        c = mix(c, paper3(uv, uAsp, 0.), uPaper);
        c = mix(c, S(vec3(.13, .08, .07)), lines3(uv, uAsp, uB, 0.) * uInk);
        gl_FragColor = vec4(finish(c), 1.);
      }`}),n=new Ue(55,S.viewport.aspect,.5,2e3),_=t.world;_.add(n);const C=new X(new fe(2,2),new H({depthTest:!1,depthWrite:!1,uniforms:{uSun:{value:new ae},uAsp:{value:1},uShift:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1., 1.); }",fragmentShader:me+`
      uniform vec2 uSun; uniform float uAsp, uShift; varying vec2 vUv;
      void main(){
        float y = vUv.y + .1;
        vec3 zen = S(vec3(.09, .25, .76)), mid = S(vec3(.26, .62, .97)), hor = S(vec3(.8, .92, 1.));
        vec3 c = mix(hor, mid, smoothstep(.16, .55, y)); c = mix(c, zen, smoothstep(.5, 1.1, y));
        c = mix(c, S(vec3(.9, .95, 1.)), smoothstep(.2, -.12, y));
        c = mix(c, hor, smoothstep(.55, .85, fbm(vec2(vUv.x * 2.5 + uShift, y * 16.))) * .25 * smoothstep(.75, .1, y));
        c += S(vec3(1., .85, .55)) * exp(-length((vUv - uSun) * vec2(uAsp, 1.)) * 2.4) * .5;
        gl_FragColor = vec4(c, 1.);
      }`}));C.frustumCulled=!1,C.renderOrder=-10,_.add(C);const o=Be(23),f=[],Y=[110,160,220][M],ne=[9,13,17][M],re=[4,6,8][M];for(let s=0;s<Y;s++)f.push([(o()-.5)*620,-37+o()*5,-o()*650-24,8+o()*15,o()]);for(let s=0;s<ne;s++){const b=s%2?1:-1,$=11+o()*10,ee=b*(30+$+o()*110),e=-50-o()*560,z=34+o()*62,V=[13,18,24][M]+Math.floor(o()*6);for(let u=0;u<V;u++){const E=Math.pow(u/V,.85),Se=$*(1-.62*E)*(.5+o()*.75),we=$*(1-.75*E)*1.35,le=o()*6.283,G=Math.sqrt(o())*we;f.push([ee+Math.cos(le)*G,-32+E*z+o()*3,e+Math.sin(le)*G*.6,Se,o()])}}for(let s=0;s<re;s++){const b=(s%2?1:-1)*(38+o()*70),$=-8+o()*26,ee=-90-o()*500,e=6+o()*6;for(let z=0;z<9;z++)f.push([b+(o()-.5)*e*2.4,$+(o()-.3)*e,ee+(o()-.5)*e,e*(.45+o()*.6),o()])}const m=f.length,r=new be,y=new fe(1,1);r.index=y.index,r.setAttribute("position",y.getAttribute("position"));const q=new oe(new Float32Array(m*3),3),N=new oe(new Float32Array(m),1),U=new oe(new Float32Array(m),1);for(const s of[q,N,U])s.setUsage(Ne);r.setAttribute("aC",q),r.setAttribute("aR",N),r.setAttribute("aS",U),r.instanceCount=0;const j=new H({transparent:!1,blending:Ve,blendEquation:Le,blendSrc:je,blendDst:We,depthTest:!1,depthWrite:!1,uniforms:{uL:{value:new se(-.5,.72,.45).normalize()},uFog:{value:new Oe("#cfe6ff")}},vertexShader:`
      attribute vec3 aC; attribute float aR, aS; varying vec2 vP; varying float vS, vD;
      void main(){ vec4 mv = viewMatrix * vec4(aC, 1.); vD = -mv.z; vP = position.xy * 2.; vS = aS; mv.xy += position.xy * 2. * aR; gl_Position = projectionMatrix * mv; }`,fragmentShader:me+`
      uniform vec3 uL, uFog; varying vec2 vP; varying float vS, vD;
      void main(){
        float r = length(vP); if (r > 1.) discard;
        float e = fwidth(r), z = sqrt(max(1. - r * r, 0.)); vec3 n = vec3(vP, z);
        float b = dot(n, uL) + (vn(vP * 3. + vS * 17.) - .5) * .24 + (vS - .5) * .12;
        vec3 col = b > .5 ? S(vec3(1., .985, .94)) : b > .12 ? S(vec3(.8, .87, 1.)) : b > -.3 ? S(vec3(.55, .65, .93)) : S(vec3(.37, .43, .78));
        col = mix(col, S(vec3(1., .86, .6)), pow(1. - z, 2.5) * max(dot(normalize(uL.xy), normalize(vP + 1e-4)), 0.) * .6);
        col = mix(col, S(vec3(.2, .27, .56)), smoothstep(1. - 3.4 * e - .02, 1. - 1.5 * e, r) * .92);
        col = mix(col, uFog, 1. - exp(-vD * .0042));
        gl_FragColor = vec4(col, 1. - smoothstep(1. - e * 1.4, 1., r));
      }`}),O=new X(r,j);O.frustumCulled=!1,O.renderOrder=0,_.add(O);const h=new Float32Array(m),Z=Array.from({length:m},(s,b)=>b),T=new se,g=new se,J=Ee(.55),ue=new Xe;ue.setAttribute("position",J.getAttribute("position").clone());const R=et(ue,1e-4);R.computeVertexNormals();const K={uGlow:{value:0},uT:{value:0},uL:{value:new se(-.5,.65,.6).normalize()}},he=new X(J,new H({uniforms:K,vertexShader:"varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:me+`
      uniform vec3 uL; uniform float uGlow, uT; varying vec3 vN;
      void main(){
        vec3 n = normalize(vN); float d = dot(n, uL);
        vec3 col = d > .45 ? S(vec3(1., .84, .22)) : d > 0. ? S(vec3(1., .62, .08)) : d > -.45 ? S(vec3(.88, .36, .06)) : S(vec3(.5, .17, .1));
        col = mix(col, S(vec3(1., .98, .85)), step(.93, dot(n, normalize(uL + vec3(0., 0., 1.)))) * .8);
        float rim = pow(1. - abs(n.z), 3.);
        col += S(vec3(1., .75, .3)) * rim * .4;
        col = mix(col, S(vec3(1., .93, .6)) * 1.5, uGlow * (.1 + .6 * rim));
        gl_FragColor = vec4(col, 1.);
      }`})),F=new X(R,new H({side:He,uniforms:{uW:{value:.06}},vertexShader:"uniform float uW; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uW, 1.); }",fragmentShader:me+"void main(){ gl_FragColor = vec4(S(vec3(.16, .07, .1)), 1.); }"}));he.renderOrder=2,F.renderOrder=1;const x=new Ye;x.add(F,he),x.visible=!1,n.add(x);const L=64,A=new be,B=new fe(1,1);A.index=B.index,A.setAttribute("position",B.getAttribute("position")),A.setAttribute("uv",B.getAttribute("uv"));const D=new Float32Array(L*4);for(let s=0;s<L;s++)D[s*4]=o()*6.283,D[s*4+1]=.6+o()*1.1,D[s*4+2]=o(),D[s*4+3]=.5+o()*1.1;A.setAttribute("aD",new oe(D,4)),A.instanceCount=L;const W={uT:{value:0},uAmt:{value:0},uS:{value:2}},p=new X(A,new H({uniforms:W,transparent:!0,depthWrite:!1,depthTest:!1,blending:Ze,vertexShader:`
      attribute vec4 aD; uniform float uT, uAmt, uS; varying vec2 vUv; varying float vA;
      void main(){
        float f = fract(aD.z + uT * (.35 + aD.w * .5)), vis = step(aD.z, uAmt);
        vec3 c = vec3(cos(aD.x) * aD.y * uS, (f - .45) * uS * 2.6, sin(aD.x) * aD.y * uS * .4);
        vec4 mv = modelViewMatrix * vec4(c, 1.);
        mv.xy += position.xy * vec2(.045, 1.2 * aD.w) * uS;
        vUv = uv; vA = sin(3.14159 * f) * vis;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:"varying vec2 vUv; varying float vA; void main(){ float x = abs(vUv.x * 2. - 1.); float a = (1. - x * x) * sin(3.14159 * vUv.y) * vA; gl_FragColor = vec4(mix(vec3(1., .78, .3), vec3(1., 1., .9), 1. - x) * a * 1.6, a); }"}));p.frustumCulled=!1,p.renderOrder=3,p.visible=!1,n.add(p);const l=[50,80,120][M],v=new be,I=new fe(1,1);v.index=I.index,v.setAttribute("position",I.getAttribute("position")),v.setAttribute("uv",I.getAttribute("uv"));const Q=new Float32Array(l*4);for(let s=0;s<l;s++)Q[s*4]=o(),Q[s*4+1]=o(),Q[s*4+2]=o(),Q[s*4+3]=o();v.setAttribute("aB",new oe(Q,4)),v.instanceCount=l;const xe={uT:{value:0},uAmt:{value:0}},ge=new X(v,new H({uniforms:xe,transparent:!0,depthWrite:!1,depthTest:!1,vertexShader:`
      attribute vec4 aB; uniform float uT, uAmt; varying vec2 vUv; varying float vS;
      void main(){
        float tt = uT * (.04 + aB.w * .05);
        vec3 p = vec3((fract(aB.x - tt * 1.2) - .5) * 20., (fract(aB.y - tt * .5) - .5) * 12., -(3. + aB.z * 20.));
        p.x += sin(uT * 1.3 + aB.w * 30.) * .5; p.y += sin(uT * 1.7 + aB.z * 20.) * .3;
        float a = uT * (1. + aB.w * 2.) + aB.z * 6., c = cos(a), s = sin(a);
        vec2 q = vec2(position.x * c - position.y * s, position.x * s + position.y * c) * (.22 + aB.w * .2);
        vUv = uv; vS = aB.w;
        gl_Position = projectionMatrix * vec4(p + vec3(q, 0.), 1.) * (1. - 2. * step(uAmt, aB.w));
      }`,fragmentShader:"varying vec2 vUv; varying float vS; void main(){ vec2 p = vUv * 2. - 1.; float d = length(p * vec2(1., 1.55)) - .8 + .18 * max(p.y, 0.) * max(p.y, 0.) * 0.; if (d > 0.) discard; vec3 c = mix(vec3(1., .55, .68), vec3(1., .85, .9), .5 + .5 * p.y + vS * .2); gl_FragColor = vec4(pow(c, vec3(2.2)), 1.); }"}));ge.frustumCulled=!1,ge.renderOrder=4,_.add(ge);function Me(){const s=S.viewport.aspect;Math.abs(s-P)<.01||(P=s,rt(k,c,s),w.needsUpdate=!0)}const De={scene:t.scene,camera:new Ue,light:!0,update({p:s,t:b,dt:$,v:ee}){Me(),ot(S,b,$),t.tick(b,ee);const e=s*st.anime,z=S.viewport.aspect,V=z<.9,u=t.U,E=Math.max(0,e-1.4),Se=10*E+144*(1-Math.exp(-E/1.6)),we=i(a.push,a.push+.3,e)*(1-i(27,28.6,e)),le=40*(1-i(a.rev0,3.8,e)),G=i(a.charge0,a.push,e)*.85+i(a.push,a.push+.6,e)*.15,ye=Math.max(0,1-(e-a.push)/1.1)*(e>=a.push?1:0),Te=(G*.035+ye*.4)*(1-i(27,28,e));n.fov=55+le-21*we,n.aspect=z,n.updateProjectionMatrix(),n.position.set(Math.sin(e*41)*Te+Math.sin(e*.09)*3,6+8*i(2,22,e)+Math.cos(e*53)*Te,-Se),n.lookAt(n.position.x+Math.sin(e*.06)*.8,n.position.y+1.2+.5*Math.sin(e*.1),n.position.z-10),n.updateMatrixWorld(!0),T.set(0,0,-1).applyQuaternion(n.quaternion);let te=0;for(let d=0;d<m;d++)g.set(f[d][0],f[d][1],f[d][2]).sub(n.position),h[d]=g.dot(T);Z.sort((d,Ge)=>h[Ge]-h[d]);for(const d of Z)h[d]<f[d][3]*.4+3||h[d]>900||(q.setXYZ(te,f[d][0],f[d][1],f[d][2]),N.setX(te,f[d][3]),U.setX(te,f[d][4]),te++);r.instanceCount=te,q.needsUpdate=N.needsUpdate=U.needsUpdate=!0,g.copy(it).multiplyScalar(800).add(n.position).project(n);const ke=new ae(g.x*.5+.5,g.y*.5+.5),Ie=g.z<1?1:0;C.material.uniforms.uSun.value.copy(ke),C.material.uniforms.uAsp.value=z,C.material.uniforms.uShift.value=n.position.x*.01,u.uSun.value.copy(ke),u.uFlare.value=i(1.8,3.5,e)*(1-i(27,28,e))*Ie;const Ae=Qe.out(i(a.mkIn0,a.mkIn1,e)),Pe=120+-106*Ae,ze=Math.tan(Je.degToRad(n.fov/2))*Pe,ve=i(17,18.8,e),ce=i(a.zip,a.zip+.55,e),Ce=(V?0:-.5*ve)+ce*2.8,Fe=(V?.4*ve:0)+.06*(1-ve)+Math.sin(e*1.1)*.015;x.visible=e>a.mkIn0-.2&&e<a.zip+1,x.position.set(Ce*ze*z,Fe*ze,-Pe);const pe=2.05*Re(z/1.2,.38,1)*(1-(V?.35:.3)*ve)*(1+.05*G*Math.sin(e*22)),$e=1+3.2*ce*(1-ce);x.scale.set(pe*$e,pe,pe),x.rotation.set(.12*Math.sin(e*.9)-.08*ce,(1-Ae)*-9.4+Ke(S,Ae,b,$)*.5,.05*Math.sin(e*1.3)),K.uGlow.value=G*.55+ye*.8,K.uT.value=b,p.visible=e>a.charge0-.5&&e<a.zip+.3,W.uT.value=b,W.uAmt.value=Re(G*1.1),W.uS.value=pe*1.15,xe.uT.value=b,xe.uAmt.value=i(18.5,20.2,e)*(1-i(26.5,28.5,e)),u.uMk.value.set(Ce*.5+.5,Fe*.5+.5),u.uAura.value=G*(1-i(27,28,e))+ye*.5,u.uRing.value.set((e-a.push)*1.5,e>=a.push?Math.max(0,1-(e-a.push)/1.3)*.9:0),u.uFlash.value=i(a.push-.05,a.push+.12,e)*(1-i(a.push+.12,a.push+.7,e))*.95,u.uSpeed.value=(1-i(1.8,6.5,e))*i(a.rev0,a.rev0+.4,e)+nt(a.zip-.3,a.zip+.2,.6,e)*.7,u.uPh.value=e<a.rev1+1?Math.floor(e*12):Math.floor(e*12)%97,u.uInvf.value=e>=a.flick&&e<a.flick+.45?Math.floor(e*12)%2:0,u.uReveal.value=i(a.rev0,a.rev1,e)*1.75,u.uTitleP.value=i(a.title0,a.title1,e),u.uTitleA.value=1-i(26.3,27.4,e),u.uPaper.value=i(a.paper0,a.paper1,e),u.uInk.value=i(a.lines0,a.lines0+1.2,e),u.uB.value=i(a.lines0,a.lines1,e),u.uFx.value=1-u.uPaper.value,t.draw(n)},resize(){t.resize()},dispose(){t.dispose(),w.dispose(),r.dispose(),A.dispose(),v.dispose(),J.dispose(),R.dispose()}};return t.resize(),Me(),x.visible=!0,p.visible=!0,await t.warm(n),x.visible=!1,De}export{pt as default};
