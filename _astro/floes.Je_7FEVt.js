import{S as Te,P as Re,C as F,V as N,i as Y,M as ye,a as Ve,t as Se,B as qe,s as We,o as P,r as J,I as ee,a2 as q,as as Oe,at as He}from"./EditionWorld.astro_astro_type_script_index_0_lang.DFJfHFf_.js";import{q as Pe,s as $e,N as ze,c as Ee,p as _e,l as Fe,a as te,d as Ie,e as Me,F as je,g as Ge}from"./common.DyvRp3dk.js";import"./preload-helper.4QTdcD_W.js";import"./profile.DiSIqQyR.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const Ue=(r,d)=>d?{still:r.poster,stillAsp:2/3,clip:r.loop.replace(/loop\.mp4$/,"hero-tall.mp4"),clipAsp:9/16}:{still:r.card,stillAsp:16/9,clip:r.loop,clipAsp:16/9};function Ke(r,d,n){const w=Ue(d,n);let v=null,i=null,l=null;return r.textures.image(w.still).then(h=>{v=h}).catch(()=>{}),{tall:n,frame(h){if(h&&!i){const z=r.textures.video(w.clip);i=z.video,l=z.texture}i&&(h&&i.paused&&i.play().catch(()=>{}),!h&&!i.paused&&i.pause());const $=!!(h&&i&&i.readyState>=2);return $?{tex:l,asp:w.clipAsp,live:$}:{tex:v,asp:w.stillAsp,live:!1}},pause(){i&&!i.paused&&i.pause()}}}const oe=`
  uniform vec3 uSunDir, uSunCol, uZen, uHor;
  vec3 sky(vec3 d){
    float y = max(d.y, 0.);
    float mu = max(dot(d, uSunDir), 0.);
    vec3 c = mix(uHor, uZen, pow(y, .38));
    c += uSunCol * (pow(mu, 4.) * .18 + pow(mu, 40.) * .5 + pow(mu, 600.) * 2.) * exp(-y * 4.);
    return c + uSunCol * smoothstep(.99975, .9999, mu) * 14.;
  }
`,Qe=async r=>{const d=new Te,n=new Re(34,r.viewport.aspect,.05,900),w=r.films,v=w.length,i=r.lang==="ar",l=i?-1:1,h={uSunDir:{value:new N(.93*l,.06,.36).normalize()},uSunCol:{value:new F("#ffc58a").multiplyScalar(1.8)},uZen:{value:new F("#0b1e3a")},uHor:{value:new F("#8a90a8")},uAmb:{value:new F("#b6cbe6")}},$=new Y({uniforms:h,depthWrite:!1,vertexShader:Pe(1),fragmentShader:`${oe}
varying vec4 vDir; void main(){ vec3 d = normalize(vDir.xyz / vDir.w); gl_FragColor = vec4(d.y < 0. ? uHor * .55 + uSunCol * pow(max(dot(normalize(vec3(d.x, 0., d.z)), uSunDir), 0.), 8.) * .3 : sky(d), 1.); }`});d.add($e($,-10));const z=4,E=new ye(new Ve(600,600).rotateX(-Math.PI/2),new Y({uniforms:{...h,uTime:{value:0},uDrift:{value:0},uFront:{value:0},uS:{value:3},uDir:{value:l},uFloes:{value:Array.from({length:z},()=>new Se(0,0,0,0))}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${ze}
      ${oe}
      uniform float uTime, uDrift, uFront, uS, uDir; uniform vec3 uAmb; uniform vec4 uFloes[${z}];
      varying vec3 vW;
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 wp = vec2((vW.x + uDrift) * uDir, vW.z);   // the water's own coordinates: it flows with the floes
        // ripples
        vec2 rq = wp * 1.6 + vec2(uTime * .04, uTime * .02);
        float e = .03, r0 = fbm3(rq), rx = fbm3(rq + vec2(e, 0.)), rz = fbm3(rq + vec2(0., e));
        vec3 n = normalize(vec3(-(rx - r0) / e * .04, 1., -(rz - r0) / e * .04));
        float fres = .02 + .98 * pow(1. - max(dot(-V, n), 0.), 5.);
        vec3 water = vec3(.002, .005, .011) + sky(reflect(V, n)) * fres;
        float far = length(vW.xz - cameraPosition.xz);
        water = mix(water, uHor * .55 + uSunCol * pow(max(dot(normalize(vec3(V.x, 0., V.z)), uSunDir), 0.), 8.) * .3, smoothstep(60., 400., far));   // haze toward the horizon
        // the floes' ice under the water: an aqua glow round each, fading with depth
        float sub = 0.;
        for (int i = 0; i < ${z}; i++){
          vec4 f = uFloes[i];
          if (f.z <= 0.) continue;
          vec2 q = (vW.xz - f.xy) / f.zw;
          float d = (length(q) - 1.) * min(f.z, f.w);
          sub = max(sub, smoothstep(.34, .0, d) * smoothstep(-.3, .02, d));
        }
        water += vec3(.03, .2, .22) * sub * (.55 + .45 * vnoise(vW.xz * 7.));
        // the young ice: grey plates, unbroken ahead of the crack front; behind it the cracks open into lanes
        vec4 vo = voronoi(wp * 2.2);
        float behind = (uFront - wp.x) / uS;                      // how far behind the front, in floe spacings
        float open = clamp(behind / .7, 0., 1.);
        float gap = mix(.01, .2, open * open) * (.6 + .8 * h11(vo.y * 91.));
        float hasCrack = step(0., behind) * smoothstep(-.02, .06, behind * 4. - (1. - vo.y) * .3);
        // the young ice lies in a ragged band along the chain; beyond it, open water
        float band = smoothstep(3.4, 2.6, abs(wp.y + (fbm3(wp * .35) - .5) * 2.4)) * step(.06, h11(vo.y * 5.3) + smoothstep(2.8, 2., abs(wp.y)));
        float isGap = max(hasCrack * smoothstep(gap + .008, gap, vo.x), 1. - band);
        vec3 nilasN = normalize(vec3((vnoise(wp * 4.) - .5) * .05, 1., (vnoise(wp * 4. + 3.) - .5) * .05));
        float nf = .02 + .98 * pow(1. - max(dot(-V, nilasN), 0.), 5.);
        float grey = .75 + .9 * h11(vo.y * 13.);                // plates of different thickness, darker and greyer
        vec3 nilas = vec3(.03, .038, .048) * grey * (.8 + .4 * vnoise(wp * 2.3)) + uAmb * .03 + sky(reflect(V, nilasN)) * nf * .5;
        // brash: here and there a thicker plate, snow-covered, in the open lanes
        float thick = step(.88, h11(vo.y * 37.)) * open;
        nilas = mix(nilas, vec3(.8, .86, .93) * (uAmb * .55 + uSunCol * .12) * (.85 + .3 * vnoise(wp * 14.)), thick);
        // a broken edge catches the light
        float rim = hasCrack * smoothstep(gap + .02, gap + .004, vo.x) * (1. - isGap);
        nilas += vec3(.35, .42, .5) * rim * (.4 + .6 * (1. - open));
        // hairline cracks ahead, faint, where the next ones will run
        nilas += vec3(.05, .06, .07) * (1. - hasCrack) * smoothstep(.012, .0, vo.x) * .5;
        vec3 col = mix(nilas, water, isGap);
        gl_FragColor = vec4(col, 1.);
      }`}));d.add(E);const W=E.material.uniforms,Ae=e=>new Y({uniforms:{...h,uMap:{value:null},uHas:{value:0},uTexAsp:{value:16/9},uFilmAsp:{value:16/9},uRect:{value:new Se},uClear:{value:0},uDim:{value:0},uTime:{value:0},uHover:{value:0},uSeed:{value:e}},vertexShader:`
      varying vec3 vO, vW, vN;
      // vO: the floe's own frame, as its outline was drawn (x, y: the picture's across and up; z: height above the water)
      void main(){ vO = vec3(position.x, -position.z, position.y); vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      ${ze}
      ${oe}
      ${je}
      uniform sampler2D uMap; uniform float uHas, uTexAsp, uFilmAsp, uClear, uDim, uTime, uHover, uSeed; uniform vec4 uRect; uniform vec3 uAmb;
      varying vec3 vO, vW, vN;
      vec2 cover(vec2 uv){ vec2 s = uTexAsp > uFilmAsp ? vec2(uFilmAsp / uTexAsp, 1.) : vec2(1., uTexAsp / uFilmAsp); return (uv - .5) * s + .5; }
      float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
      void main(){
        vec3 N = normalize(vN), V = normalize(vW - cameraPosition);
        float lit = max(dot(N, uSunDir), 0.);
        if (N.y < .6) {   // the floe's walls: thick ice, lit through, darker at the waterline
          float f = pow(1. - abs(dot(-V, N)), 2.);
          vec3 c = mix(vec3(.04, .2, .36), vec3(.5, .82, .95), .3 + .35 * vnoise(vec2(vO.x * 9. + vO.y * 7., vO.z * 40.)));
          c = c * (.35 + .65 * lit) + uSunCol * lit * .12 + f * .15;
          c *= mix(.45, 1., smoothstep(-.01, .07, vW.y));
          gl_FragColor = vec4(c * (1. - uDim * .45), 1.);
          return;
        }
        vec2 s = vO.xy, ctr = (uRect.xy + uRect.zw) * .5, half_ = (uRect.zw - uRect.xy) * .5;
        vec2 fuv = (s - uRect.xy) / (uRect.zw - uRect.xy);
        float sdR = rbox(s - ctr, half_, .025), aa = fwidth(sdR);
        float inR = smoothstep(aa, -aa, sdR);
        // the snow on its margin: wind ripples, a crust that glitters, blue in its hollows, its rim catching the sun
        vec2 sq = s * vec2(2.2, 5.5) + uSeed;
        float dr = fbm3(sq), gr = vnoise(s * 46. + uSeed);
        vec3 snN = normalize(vec3((fbm3(sq + vec2(.06, 0.)) - dr) * -1.6, 1., (fbm3(sq + vec2(0., .06)) - dr) * 3.6));
        snN = normalize(vec3(snN.x, snN.y, snN.z));
        float sl = max(dot(snN, uSunDir), 0.);
        vec3 snow = vec3(.94, .97, 1.) * (uAmb * (.72 + .2 * snN.y) + uSunCol * sl * .5) * (.93 + .07 * gr);
        snow = mix(snow * vec3(.78, .88, 1.), snow, smoothstep(.25, .6, dr));                 // blue in the hollows
        float gl = step(.985, h21(floor(s * 70.) + uSeed)) * pow(max(dot(reflect(V, normalize(vec3(h22(floor(s * 70.)) - .5, 1.4).xzy)), uSunDir), 0.), 40.);
        snow += uSunCol * gl * .9;
        float bev = smoothstep(.995, .86, N.y);                                                // the rounded rim
        snow = mix(snow, vec3(.75, .9, 1.) * (uAmb * .8 + uSunCol * lit * .9), bev * .7);
        float edgeIce = smoothstep(.0, .05, sdR) * smoothstep(.16, .06, sdR);   // a clear-ice rim round the window
        snow = mix(snow, snow * vec3(.7, .85, .98), edgeIce * .45);
        // the window over the film: frost that melts back from its middle when the floe is reached
        vec2 c2 = (fuv - .5) * vec2(uFilmAsp, 1.);
        float dist = length(c2) / length(vec2(uFilmAsp, 1.) * .5);
        float frontC = uClear * 1.4 - .12;
        float n1 = vnoise(fuv * vec2(uFilmAsp, 1.) * 7. + uSeed) - .5, n2 = vnoise(fuv * vec2(uFilmAsp, 1.) * 23. + uSeed) - .5;
        float frosted = smoothstep(frontC - .05, frontC + .12, dist + n1 * .22 + n2 * .06);
        vec2 wob = (vec2(vnoise(s * 5. + uTime * .07), vnoise(s * 5. + 9.1 - uTime * .05)) - .5) * .02 * (1. - uClear * .9);
        vec3 film = uHas > .5 ? texture(uMap, cover(clamp(fuv + wob, .001, .999)), frosted * 3.5).rgb : vec3(.04, .05, .06);
        film *= mix(vec3(1.), vec3(.86, .95, 1.04), .35 * (1. - uClear) + .1);
        // frost: a rime haze with feathers of hoarfrost growing in from the window's edge; the picture's colours glow
        // through it, softened
        float cr = 0.;
        if (frosted > .01) {
          float g = clamp(frosted * 1.25, 0., 1.);
          cr = max(frostFeathers(c2, .3, g, uSeed), frostFeathers(c2 + .07, .16, g * .95, uSeed + 7.) * .8);
          ${r.quality?"cr = max(cr, frostFeathers(c2 + .19, .08, g * .9, uSeed + 13.) * .55);":""}
        }
        float fine = smoothstep(.014, .005, fwidth(c2.x));   // (feathers finer than a pixel turn into haze, not grain)
        cr *= fine;
        float haze = frosted * (.42 + .22 * fbm3(c2 * 3. + uSeed) + (1. - fine) * .18);
        vec3 rime = vec3(.9, .94, 1.) * (uAmb * .78 + uSunCol * .12 + .06);
        vec3 win = mix(film, film * .55 + rime * .5, haze);
        win += rime * cr * frosted * .75;
        win = mix(win, film * .4 + rime * .5, smoothstep(.0, .5, frosted) * smoothstep(1., .5, frosted) * .45);   // the melting edge, wet and bright
        // the ice over the picture: a little of the sky in it, a glint, a hairline crack or two
        float fres = .03 + .25 * pow(1. - max(dot(-V, N), 0.), 4.);
        win += sky(reflect(V, normalize(N + vec3(n1, 0., n2) * .08))) * fres * (1. - frosted * .5);
        float hair = smoothstep(.004, .0, abs(dot(c2 - vec2(.3, -.1), normalize(vec2(.8, -.6))) + n1 * .04)) * step(.0, c2.x) * .35;
        win += vec3(.8, .9, 1.) * hair * (1. - frosted);
        vec3 col = mix(snow, win, inR);
        col += uSunCol * pow(max(dot(reflect(V, N), uSunDir), 0.), 120.) * .3;
        col *= 1. - uDim * .45;
        col += vec3(.6, .8, 1.) * uHover * .06;
        gl_FragColor = vec4(col, 1.);
      }`});let M=[],A=r.viewport.portrait,f=3.2,I="";const C=(e,t)=>{const s=Math.sin(e*127.1+t*311.7)*43758.5453;return s-Math.floor(s)};function Ce(e,t,s,o){const m=o*(1+.5*C(e,1)),k=10+Math.floor(C(e,2)*4),g=new He;for(let c=0;c<k;c++){const b=(c+(C(e,c+3)-.5)*.7)/k*Math.PI*2,T=t+m*(1+(C(e,c+40)-.5)*1.1),u=s+m*(1+(C(e,c+80)-.5)*1.1),S=Math.cos(b),R=Math.sin(b),p=1/Math.pow(Math.pow(Math.abs(S)/T,5)+Math.pow(Math.abs(R)/u,5),.2);c?g.lineTo(S*p,R*p):g.moveTo(S*p,R*p)}return g.closePath(),{shape:g,rx:t+m*1.1,ry:s+m*1.1}}async function ae(){const e=`${r.viewport.portrait}`;if(e===I)return;I=e;for(const o of M)d.remove(o.mesh),o.mesh.geometry.dispose(),o.mat.dispose(),o.reel.pause();A=r.viewport.portrait;const[t,s]=A?[.9,1.6]:[1.6,.9];f=A?2.35:3.3,M=[];for(let o=0;o<v;o++){const{shape:m,rx:k,ry:g}=Ce(o,t/2,s/2,A?.1:.15),c=new Oe(m,{depth:.07,bevelEnabled:!0,bevelThickness:.025,bevelSize:.03,bevelSegments:2,curveSegments:2});c.rotateX(-Math.PI/2);const b=Ae(o*3.7+1.3),T=b.uniforms;T.uRect.value.set(-t/2,-s/2,t/2,s/2),T.uFilmAsp.value=t/s;const u=new ye(c,b);u.userData.index=o,d.add(u),M.push({mesh:u,mat:b,reel:Ke(r,w[o],A),rx:k,rz:g,yaw:(C(o,7)-.5)*.22,zOff:(C(o,9)-.5)*(A?.25:.5),clear:0,arrived:-1,hover:0}),o%5===4&&await Ie()}W.uS.value=f}await ae();let j=3,se=0,re=0,O=1.1;function ie(){const e=r.viewport;n.aspect=e.aspect,n.fov=e.portrait?52:34,n.updateProjectionMatrix(),O=e.portrait?1.22:1.12;const[t,s]=e.portrait?[.9,1.6]:[1.6,.9],o=e.aspect<1.85;j=e.portrait?Me(n,t+.26,s*Math.sin(O),.92,.62):Me(n,t+.4,s*Math.sin(O),o?.45:.52,.56),se=e.portrait?0:(e.aspect>1.3?o?.25:.2:.08)*l,re=e.portrait?.2:0}ie();const G=new N,H=new N,U=new N(0,0,-1),ke=new N(0,1,0),K=new N,X=new N,ne=new qe,le=new We,ce=(e,t)=>{le.set(e,t),ne.setFromCamera(le,n);const s=ne.intersectObjects(M.filter(o=>o.mesh.visible).map(o=>o.mesh),!1)[0];return s?s.object.userData.index:-1};let x=-1,ue=-1,ve=!1,Z=-1,B=!0,fe=0;return{scene:d,camera:n,resize(){ie(),`${r.viewport.portrait}`!==I&&ae().then(()=>{B=!0})},focus(e){ve=e,e||M.forEach(t=>t.reel.pause())},update({p:e,t,dt:s}){const o=r.viewport,m=Ge(e,v),k=q(m,0,v-1),g=Math.floor(k),c=k-g,b=m<0||m>v-1?m:g+P.inOut(J(.2,.85,c));x=B||te?b:ee(x,b,5,s),B=!1;const T=q(x,0,v-1),u=1-P.inOut(q(x+1)),S=P.inOut(q(x-(v-1))),R=1+S*2.4,p=1-Math.max(u,S);H.set(-S*1.5*f*l,0,0),G.set(H.x,Math.sin(O)*j*R,H.z+Math.cos(O)*j*R),U.set(0,0,-1),u>0&&(A?(K.set(-1.1*f*l,.9,-1.2),X.set(4.4*f*l,-.9,2.1)):(K.set(-1.3*f*l,.62,-1.5),X.set(5*f*l,.12,.7)),G.lerp(K,u),H.lerp(X,u),U.lerp(ke,u).normalize()),Ee(n,se*p,re*p,o.width,o.height),n.updateProjectionMatrix();const me=_e(r,t,s);Fe(n,G,H,me.x*.6,me.y*.6,{upHint:U});const De=x*f,he=q(x,0,v-1),pe=Math.floor(he);fe=(pe+P.out(J(0,.35,he-pe)))*f,W.uDrift.value=De*l,W.uFront.value=x<-.05?-1e3:fe+f*.32,W.uTime.value=t;const _=Math.max(0,Math.min(v-1,Math.round(T)));_!==ue&&p>.6&&(ue=_,r.emit("film",{index:_,film:w[_]}));const de=W.uFloes.value;let we=0;for(const a of de)a.set(0,0,0,0);M.forEach((a,V)=>{const xe=V-x,y=Math.abs(xe),ge=(xe*f+Math.sin(t*.11+V)*.03)*l,be=a.zOff*Math.min(1,y)+Math.cos(t*.09+V*2.1)*.02;if(a.mesh.visible=y<2.2||u>.01||S>.01,!a.mesh.visible){a.reel.pause();return}a.mesh.position.set(ge,-.03+Math.sin(t*.7+V)*.006,be),a.mesh.rotation.y=a.yaw*Math.min(1,y*1.6)+Math.sin(t*.13+V)*.008,we<z&&y<2.2&&de[we++].set(ge,be,a.rx,a.rz),y<.1&&a.arrived<0&&(a.arrived=t),y>.45&&(a.arrived=-1);const L=a.arrived<0?0:P.inOut(J(.1,1.5,t-a.arrived));a.clear=te?y<.3?1:0:L>a.clear?L:ee(a.clear,L,2.4,s),a.hover=ee(a.hover,V===Z?1:0,8,s);const Ne=ve&&y<.35&&a.clear>.25&&p>.5&&!te,Q=a.reel.frame(Ne),D=a.mat.uniforms;D.uMap.value=Q.tex,D.uHas.value=Q.tex?1:0,D.uTexAsp.value=Q.asp,D.uClear.value=a.clear,D.uDim.value=q(y-.3)*.5*p,D.uTime.value=t,D.uHover.value=a.hover})},pick(e,t){const s=ce(e,t);return s>=0?w[s].url:null},hover(e,t){return Z=ce(e,t),Z>=0},dispose(){E.geometry.dispose(),E.material.dispose(),M.forEach(e=>{e.mesh.geometry.dispose(),e.mat.dispose(),e.reel.pause()})}}};export{Qe as default};
