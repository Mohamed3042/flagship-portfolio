import{X,an as ie,_ as J,aF as ne,V,C as Z,Q as re,aH as F,M,i as te,ak as ee,am as ce,H as ue,G as oe,aR as ve,a as pe,aq as de,ar as me,ap as fe,au as he}from"./EditionWorld.astro_astro_type_script_index_0_lang.D3E1zgZp.js";import{o as se,m as b,r as ge}from"./common.w5eBWcYm.js";import{V as we,A as xe}from"./path.DnFa-zM4.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const S={axis:new V(0,0,-400),r:9.3,win:12.4,y0:46,rise:7.5,turn:.92,a0:Math.PI/2,steps:7,from:-6,past:2.5},B=(a,o)=>S.a0+o*a*S.turn,I=a=>S.y0+a*S.rise;function j(a,o,c,l=new V){const e=B(a,c);return l.set(S.axis.x+Math.cos(e)*o,I(a),S.axis.z+Math.sin(e)*o)}class $ extends ve{constructor(o,c,l,e,s){super(),this.r=o,this.s0=c,this.s1=l,this.dir=e,this.lift=s}getPoint(o,c=new V){const l=this.s0+(this.s1-this.s0)*o;return j(l,this.r,this.dir,c),c.y+=this.lift,c}}function Ce(a,o,c,l,e){const{r:s,steps:G,from:H,past:u}=S,f=H,i=l-1+u,x=[];for(let t=Math.ceil(f);t<=Math.floor(i);t++){t>=0&&t<l&&x.push({s:t,landing:!0});for(let w=1;w<=G;w++){const U=t+w/(G+1);U<=i&&x.push({s:U,landing:!1})}}const v=new X(3.6,.26,1.1),h=new X(6.6,.36,4.2),n=new ie({color:"#fff7ea",roughness:.12,metalness:0,clearcoat:1,clearcoatRoughness:.08,envMap:o,envMapIntensity:1.1,emissive:"#ffe9c4",emissiveIntensity:.55});n.onBeforeCompile=t=>{t.fragmentShader=t.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
#ifdef USE_INSTANCING_COLOR
 totalEmissiveRadiance *= vColor;
#endif`)},n.customProgramCacheKey=()=>"hx-step";const p=x.filter(t=>!t.landing),C=x.filter(t=>t.landing),g=new J(v,n,p.length),P=new J(h,n,C.length),k=new ne,y=new re,d=new V,O=new V(1,1,1),q=new V(0,1,0),_=new Z;((t,w,U)=>w.forEach((K,Q)=>{j(K.s,s,e,d),d.y-=U,y.setFromAxisAngle(q,-B(K.s,e)),t.setMatrixAt(Q,k.compose(d,y,O)),t.setColorAt(Q,_.setScalar(1))}))(g,p,.13),C.forEach((t,w)=>{j(t.s,s+1.5,e,d),d.y-=.18,y.setFromAxisAngle(q,-B(t.s,e)),P.setMatrixAt(w,k.compose(d,y,O)),P.setColorAt(w,_.setScalar(1))});const T=se(o,{leaf:.07,rough:.16,lite:a.quality===0,leafAmt:.4}),D=se(o,{leaf:.05,rough:.15,lite:a.quality===0,leafAmt:.1}),R=Math.round((i-f)*26),r=new F(new $(s+1.85,f,i,e,1.05),R,.07,6,!1),m=new F(new $(s-1.85,f,i,e,.04),R,.09,6,!1),A=new F(new $(s+1.8,f,i,e,-.22),R,.12,6,!1),N=new M(r,T),L=new M(m,T),ae=new M(A,T),Y=new te({transparent:!0,depthWrite:!1,blending:ce,blendSrc:ee,blendDst:ee,uniforms:{uCol:{value:new Z(1,.9,.72)},uAmt:{value:1},uTime:{value:0}},vertexShader:"varying vec3 vN, vV; varying float vY; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); vY = position.y; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform vec3 uCol; uniform float uAmt, uTime; varying vec3 vN, vV; varying float vY;
      void main(){
        float c = abs(dot(normalize(vN), normalize(vV)));
        float core = pow(c, 3.) * .9 + pow(c, 12.) * 1.4;
        float flow = .85 + .15 * sin(vY * .35 - uTime * 1.6);
        gl_FragColor = vec4(uCol * core * flow * uAmt * .55, 0.);
      }`}),le=I(i)+40-(I(f)-20),E=new M(new ue(1.1,1.1,le,32,1,!0),Y);E.position.set(S.axis.x,(I(i)+40+I(f)-20)/2,S.axis.z),E.renderOrder=1050;const W=new oe;return W.add(b(g),b(P),b(N),b(L),b(ae),E),{group:W,gold:T,frameGold:D,glow:n,stepList:p,stepsM:g,column:Y,light(t){p.forEach((w,U)=>g.setColorAt(U,_.setScalar(t(w.s)))),g.instanceColor.needsUpdate=!0},dispose(){v.dispose(),h.dispose(),n.dispose(),T.dispose(),D.dispose(),r.dispose(),m.dispose(),A.dispose(),Y.dispose(),E.geometry.dispose(),g.dispose(),P.dispose()}}}const ye=`
  ${ge}${we}
  uniform sampler2D uStill, uVideo; uniform float uHasStill, uHasVideo, uAsp, uStillAsp, uVidAsp, uResolve, uDim, uTime, uCells, uHover, uOpacity;
  varying vec2 vUv;
  vec2 cover(vec2 uv, float src){ vec2 s = src > uAsp ? vec2(uAsp / src, 1.) : vec2(1., src / uAsp); return (uv - .5) * s + .5; }
  float box(vec2 uv){ vec2 q = abs((uv - .5) * vec2(uAsp, 1.)) - vec2(uAsp, 1.) * .5 + .012; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - .012; }
  vec3 film(vec2 uv){
    if (uHasVideo > .5) return sRGBTransferEOTF(texture2D(uVideo, cover(uv, uVidAsp))).rgb;
    if (uHasStill > .5) return texture2D(uStill, cover(uv, uStillAsp)).rgb;
    return vec3(.8, .75, .7);
  }
  void main(){
    float d = box(vUv), aa = fwidth(d), inside = smoothstep(aa, -aa, d);
    // the glass rim: within a bevel of the edge the picture is pulled in from further inside and parted into its colours
    float bevel = .035, k = clamp(1. + d / bevel, 0., 1.);
    vec2 e = vec2(.002, 0.), g = vec2(box(vUv + e.xy) - box(vUv - e.xy), box(vUv + e.yx) - box(vUv - e.yx));
    g /= max(length(g), 1e-5);
    float along = dot((vUv - .5) * vec2(uAsp, 1.), vec2(-g.y, g.x));
    vec2 pull = g / vec2(uAsp, 1.) * bevel * k * (.9 + .04 * sin(along * 9. + uTime * 1.3)), off = g / vec2(uAsp, 1.) * bevel * .22 * k;
    // the panes: a Voronoi of glass over the picture, each pane the colour of the picture at its middle
    vec2 P = vUv * vec2(uAsp, 1.) * uCells;
    vec2 id; vec3 vo = voronoi(P, id);
    vec2 seed = (id + .15 + .7 * vh2(id)) / uCells / vec2(uAsp, 1.);
    float lod = log2(max(1., 512. / uCells)) - .5;
    vec3 pc = uHasStill > .5 ? textureLod(uStill, cover(clamp(seed, 0., 1.), uStillAsp), lod).rgb : vec3(.9, .82, .7);
    // glass: lit from behind, a little richer than the picture, rippled, streaked
    // glass lit from behind is luminous: the picture's colours, richer, lifted toward pearl (a dark screen becomes pale
    // smoky glass, a bright colour stays a jewel)
    float lum = dot(pc, vec3(.299, .587, .114));
    vec3 sat = clamp(mix(vec3(lum), pc, 1.45) * 1.25, 0., 1.);
    vec3 glass = 1. - (1. - sat) * (1. - vec3(.44, .4, .35) * (.8 + .4 * vh2(id + 3.).x));
    glass *= .95 + .08 * sin(P.x * 7. + P.y * 3. + vh2(id).y * 6.);
    glass *= 1.02 + uHover * .2;
    float came = 1. - smoothstep(.018, .018 + fwidth(vo.x) * 1.6, vo.x);
    vec3 lead = mix(vec3(.78, .6, .3), vec3(1., .9, .62), .5 + .5 * sin(P.y * 2.1 + uTime * .3));
    // coming alive: pane by pane from the middle outward, a bright edge where the change passes
    float order = length((seed - .5) * vec2(uAsp, 1.)) / length(vec2(uAsp, 1.) * .5) * .78 + vh2(id + 11.).x * .22;
    float shown = smoothstep(order - .015, order + .015, uResolve * 1.08 - .04);
    float edge = exp(-pow((uResolve * 1.08 - .04 - order) * 14., 2.)) * step(.001, uResolve) * step(uResolve, .999);
    vec3 alive = vec3(film(vUv - pull + off).r, film(vUv - pull).g, film(vUv - pull - off).b);
    vec3 col = mix(glass * (1. - came) + lead * came, alive, shown);
    col += vec3(1., .9, .7) * edge * (1. - came) * .5;
    // the rim catches the light: brighter toward the edge, a lit line from above
    float lit = .35 + .65 * max(dot(g, normalize(vec2(-.3, 1.))), 0.);
    col *= 1. + .4 * k * k;
    col += vec3(1., .95, .85) * smoothstep(.62, .82, k) * smoothstep(.98, .82, k) * lit * .55;
    col = mix(col, col * .42, uDim);
    gl_FragColor = vec4(col * inside, inside) * uOpacity;
  }`,Ae=(a,o,c)=>{const l=o.card.replace(/card\.webp$/,"");return c?{still:o.poster,stillAsp:2/3,clip:`${l}hero-tall.mp4`,clipAsp:9/16}:{still:o.card,stillAsp:16/9,clip:a.quality>0?`${l}hero.mp4`:o.loop,clipAsp:16/9}};function Te(a,o,c,l,{w:e=6.4,h:s=3.6,tall:G=!1}={}){const H=Ae(a,o,G),u={...c,uStill:{value:null},uVideo:{value:null},uHasStill:{value:0},uHasVideo:{value:0},uAsp:{value:e/s},uStillAsp:{value:H.stillAsp},uVidAsp:{value:H.clipAsp},uResolve:{value:0},uDim:{value:0},uTime:{value:0},uCells:{value:G?9:8},uHover:{value:0},uOpacity:{value:1}},f=new te({uniforms:u,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:ye,transparent:!0}),i=new M(new pe(e,s),f),x=.5;i.position.y=x+s/2;const v=Math.min(e,s)*.055,h=new de,n=new me,p=e/2+v,C=s/2+v;h.moveTo(-p,-C),h.lineTo(p,-C),h.lineTo(p,C),h.lineTo(-p,C),h.closePath(),n.moveTo(-e/2,-s/2),n.lineTo(-e/2,s/2),n.lineTo(e/2,s/2),n.lineTo(e/2,-s/2),n.closePath(),h.holes.push(n);const g=new fe(h,{depth:v*.9,bevelEnabled:!0,bevelThickness:v*.35,bevelSize:v*.3,bevelSegments:3,curveSegments:4});g.translate(0,x+s/2,-v*.45);const P=new M(g,l),k=(m,A)=>new V(m,A,0),y=x+s+v,d=G?e*.5:e*.2,O=new F(new xe(k(-p,y),k(p,y),d),48,v*.42,8,!1),q=Math.min(d*.3,p*.22),_=y+d*.4,z=new he(q,v*.32,8,40);z.translate(0,_,0);const T=new M(O,l),D=new M(z,l),R=new oe;R.add(b(P),b(T),b(D),i),i.layers.enable(1),i.userData.film=o;let r=null;return a.textures.image(H.still).then(m=>{u.uStill.value=m,u.uHasStill.value=1}).catch(()=>{}),{group:R,pane:i,U:u,w:e,h:s,height:y+d,center:x+s/2,play(m){m?(r??=a.textures.video(H.clip),r.video.paused&&r.video.play().catch(()=>{})):r&&!r.video.paused&&r.video.pause();const A=!!r&&r.video.readyState>=2&&m;u.uVideo.value=A?r.texture:null,u.uHasVideo.value=A?1:0},set(m,A,N,L){u.uTime.value=m,u.uResolve.value=A,u.uDim.value=N,u.uHover.value=L},dispose(){i.geometry.dispose(),f.dispose(),g.dispose(),O.dispose(),z.dispose(),r?.video.pause()}}}export{S,j as a,B as b,Te as f,Ce as s};
