import{C as z,V as M,i as H,aC as U,ak as N,am as D,O as ee,M as R,a1 as se,a as re,G as ie,au as B,X as le,H as _,aH as ce,aR as ue,ab as $,ag as C,aJ as de,K as E,aW as ve}from"./EditionWorld.astro_astro_type_script_index_0_lang.D3E1zgZp.js";import{r as te,t as me,o as he,d as oe,m as Z,u as K,v as T}from"./common.w5eBWcYm.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const pe=`
  vec3 envRefl(vec3 r){
    vec3 c = skyColor(r);
    vec3 fl = (uAmbBot * .95 + uSunCol * .2) * uSkyGain;   // below the horizon: the floor of lit cloud
    return mix(c, fl, smoothstep(.02, -.12, r.y));
  }
`,ae=`
  vec2 vh2(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
  // nearest seed (its cell id) and the distance to the nearest border
  vec3 voronoi(vec2 x, out vec2 id){
    vec2 n = floor(x), f = fract(x), mg, mr; float md = 8.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(i, j), o = .15 + .7 * vh2(n + g), r = g + o - f; float d = dot(r, r);
      if (d < md) { md = d; mr = r; mg = g; }
    }
    md = 8.;
    for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
      vec2 g = mg + vec2(i, j), o = .15 + .7 * vh2(n + g), r = g + o - f;
      if (dot(mr - r, mr - r) > 1e-5) md = min(md, dot(.5 * (mr + r), normalize(r - mr)));
    }
    id = n + mg;
    return vec3(md, mr);
  }
`,fe=`
  varying vec3 vW, vN; varying vec2 vUv;
  void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`;function ge(o,{lead:a=1,cells:n=9,tint:e="#fff6e6"}={}){const t={...o,uCam:{value:new M},uLead:{value:a},uCells:{value:n},uTint:{value:new z(e)},uAmt:{value:1}};return{mat:new H({uniforms:t,vertexShader:fe,side:ee,transparent:!0,depthWrite:!1,blending:D,blendSrc:N,blendDst:U,blendSrcAlpha:N,blendDstAlpha:U,fragmentShader:`
      ${te}${me}${pe}${ae}
      uniform vec3 uCam, uTint; uniform float uLead, uCells, uAmt; varying vec3 vW, vN; varying vec2 vUv;
      void main(){
        vec3 V = normalize(vW - uCam), N = normalize(vN);
        if (dot(N, V) > 0.) N = -N;
        float c = clamp(dot(-V, N), 0., 1.), F = .04 + .96 * pow(1. - c, 5.);
        vec3 R = reflect(V, N);
        vec3 rgb = envRefl(R) * F * 1.15;
        rgb += (.5 + .5 * cos(6.2832 * (vec3(0., .33, .67) + c * 1.4 + vUv.y * .6))) * .045 * (1. - c * .6);   // thin film
        rgb += uSunCol * pow(max(dot(R, uSunDir), 0.), 900.) * 2.5;                                          // the sun's glint
        // diamond quarries, as leaded windows are glazed: two sets of diagonal cames, a pixel or two wide
        vec2 qd = vUv * vec2(uCells, uCells * 2.6);
        vec2 dq = vec2(qd.x + qd.y, qd.x - qd.y);
        vec2 gq = abs(fract(dq) - .5) / max(fwidth(dq), vec2(1e-4));
        float ld = (1. - clamp(min(gq.x, gq.y) - .4, 0., 1.)) * uLead * .55;
        vec3 leadCol = mix(vec3(.62, .5, .3), vec3(1., .9, .66), .5 + .5 * N.y) * (uAmbBot * .7 + uSunCol * .15) * uSkyGain;
        float a = clamp(F * 1.05 + .045, 0., 1.);
        rgb = rgb * (1. - ld) + leadCol * ld;
        a = mix(a, .92, ld);
        rgb += uTint * .02;
        gl_FragColor = vec4(rgb, a) * uAmt;
      }`}),U:t,update(v){t.uCam.value.copy(v.position)}}}function we(o,a){const n=a.length,e={...o,uHues:{value:a},uLit:{value:new Array(n).fill(0)},uBack:{value:1},uTurn:{value:0},uCam:{value:new M},uN:{value:n},uAll:{value:0},uTime:{value:0}};return{mat:new H({uniforms:e,transparent:!0,depthWrite:!0,side:ee,blending:D,blendSrc:N,blendDst:U,blendSrcAlpha:N,blendDstAlpha:U,vertexShader:"varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${te}${ae}
      #define N ${n}
      uniform vec3 uHues[N]; uniform float uLit[N]; uniform float uBack, uTurn, uAll, uTime; uniform int uN;
      varying vec2 vUv; varying vec3 vW;
      const float PI2 = 6.28318;
      float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
      // a petal: a pointed lancet along +y from r .26 to .74, its width growing outward (local coordinates)
      float petal(vec2 q){
        float w = mix(.045, .118, smoothstep(.26, .7, q.y));
        float body = max(abs(q.x) - w, max(.27 - q.y, q.y - .66));
        // the pointed head: two arcs meeting at .76
        vec2 h = vec2(abs(q.x), q.y - .6);
        float arc = length(h + vec2(.07, 0.)) - .19;
        float head = max(arc, max(-h.y, h.y - .17));
        return min(body, max(head, abs(q.x) - .12));
      }
      void main(){
        vec2 p = (vUv - .5) * 2.; float r = length(p);
        if (r > 1.) discard;
        float a = atan(p.x, p.y) - uTurn;                       // 0 at the top, clockwise
        float seg = PI2 / float(N), k = floor(fract(a / PI2 + .5 / float(N)) * float(N));
        float tc = k * seg + uTurn;                               // the petal's own frame: it points up
        vec2 q = vec2(p.x * cos(tc) - p.y * sin(tc), p.x * sin(tc) + p.y * cos(tc));
        int ki = int(k);
        float lit = 0.; vec3 hue = vec3(1.);
        for (int i = 0; i < N; i++) if (i == ki) { lit = uLit[i]; hue = uHues[i]; }
        lit = max(lit, uAll);
        // regions: the oculus, the petal, the roundel between petal tips, the rest is tracery (gold)
        float dOc = r - .22;
        float dPe = petal(q);
        float tr2 = (floor(fract(a / PI2) * float(N)) + .5) * seg + uTurn;   // the nearest roundel (between two petals)
        vec2 rr = vec2(p.x * cos(tr2) - p.y * sin(tr2), p.x * sin(tr2) + p.y * cos(tr2));
        float dRo = length(rr - vec2(0., .86)) - .1;
        float dRim = abs(r - .965) - .02;
        float inside = min(dOc, min(dPe, dRo));
        float aa = fwidth(inside) * 1.5;
        vec2 id; vec3 vo = voronoi(p * 9.5, id);
        float cw = fwidth(vo.x) * 1.5, came = 1. - smoothstep(.012, .012 + cw, vo.x);
        float pick = vh2(id + 7.).x;
        vec3 glass;
        if (dOc < 0.) glass = mix(vec3(1., .93, .74), vec3(1., .98, .9), pick);
        else if (dPe < 0.) glass = mix(hue, mix(vec3(1., .86, .58), vec3(1., .96, .9), step(.5, pick)), step(.45, pick) * .85);   // the app's colour, among gold and pearl
        else glass = mix(vec3(.72, .82, .98), vec3(1., .86, .66), step(.5, pick));
        glass *= .8 + .32 * vh2(id + 3.).y;
        glass *= .85 + .3 * smoothstep(.0, .5, dot(vo.yz, normalize(vec2(-.6, .8))) + .25);   // each pane brighter toward a corner
        float back = uBack * (dOc < 0. ? 1. : (dPe < 0. ? mix(.3, 1., lit) : mix(.4, .85, uAll)));
        vec3 light = glass * back * (uSunCol * .14 + vec3(.55));
        vec3 cameCol = vec3(1., .82, .5) * (.5 + .5 * back);
        light = mix(light, cameCol, came * .85);
        // the tracery: gold, lit from the front a little (the deeper bars are geometry)
        vec3 gold = vec3(.86, .66, .32) * (uAmbBot * .6 + uSunCol * .12) * uSkyGain;
        float tr = smoothstep(-aa, aa, inside);
        gold *= .72 + .5 * smoothstep(.0, .025, inside) * (1. - smoothstep(.025, .07, inside)) + .12 * smoothstep(.07, .2, inside);   // a bevel on every bar
        vec3 col = mix(light, gold, tr);
        float rim = 1. - smoothstep(0., fwidth(dRim) * 1.5, dRim);
        col = mix(col, gold * 1.2, rim);
        float edge = smoothstep(1., .985, r);
        gl_FragColor = vec4(col * edge, edge);
      }`}),U:e}}class b extends ue{constructor(a,n,e){super(),this.a=a,this.b=n,this.h=e,this.u.subVectors(n,a),this.s=this.u.length(),this.u.normalize(),this.seg=e<this.s/2-.001,this.rho=(e*e+this.s*this.s/4)/this.s,this.seg&&(this.R=(e*e+this.s*this.s/4)/(2*e),this.phi=Math.asin(Math.min(1,this.s/2/this.R)))}u=new M;s;rho;seg;R=0;phi=0;getPoint(a,n=new M){const{s:e,rho:t,u:p}=this;let v,h;if(this.seg){const u=-this.phi+a*2*this.phi;v=e/2+Math.sin(u)*this.R,h=Math.cos(u)*this.R-(this.R-this.h)}else{const u=Math.acos((e/2-t)/t),c=a<.5,m=c?Math.PI-a*2*(Math.PI-u):u+(a-.5)*2*(Math.PI-u);v=c?t+Math.cos(m)*t:e-t-Math.cos(m)*t,h=Math.sin(m)*t}return n.copy(this.a).addScaledVector(p,v),n.y+=h,n}}function j(o){const a=[],n=[],e=[],t=[];for(const v of o){const h=v.getAttribute("position"),u=v.getAttribute("normal"),c=v.getAttribute("uv"),m=a.length/3;for(let r=0;r<h.count;r++)a.push(h.getX(r),h.getY(r),h.getZ(r)),u?n.push(u.getX(r),u.getY(r),u.getZ(r)):n.push(0,0,1),c?e.push(c.getX(r),c.getY(r)):e.push(0,0);const s=v.getIndex();if(s)for(let r=0;r<s.count;r++)t.push(m+s.getX(r));else for(let r=0;r<h.count;r++)t.push(m+r)}const p=new $;return p.setAttribute("position",new C(a,3)),p.setAttribute("normal",new C(n,3)),p.setAttribute("uv",new C(e,2)),p.setIndex(t),p}const ne=(o,a)=>Array.from({length:a+1},(n,e)=>o.getPoint(e/a));let I=null;function xe(){if(I)return I;const o=[],a=[],n=[],{half:e,spring:t,foot:p,apex:v,bays:h,rose:u}=oe,c=(l,d,f=48)=>o.push(new ce(l,f,d,8,!1)),m=(l,d,f)=>c(new de(l,d),f,2),s=(l,d,f)=>new M(l,d,f),r=(l,d,f=t)=>{const y=f-p,q=new _(.42,.5,y,18,1,!0);q.translate(l,p+y/2,d),o.push(q);for(const[O,P]of[[.56,0],[-.56,0],[0,.56],[0,-.56]]){const Y=new _(.16,.16,y,10,1,!0);Y.translate(l+O,p+y/2,d+P),o.push(Y)}for(const O of[f-.35,f-1.1,6,-2]){const P=new B(.78,.11,8,28);P.rotateX(Math.PI/2),P.translate(l,O,d),o.push(P)}const X=new _(.95,.7,.5,18);X.translate(l,f+.1,d),o.push(X)};for(let l=0;l<=h;l++){const d=K(l);if(r(-e,d),r(e,d),c(new b(s(-e,t,d),s(e,t,d),v-t),.3),l===0&&c(new b(s(-e-.9,t-1,d+.9),s(e+.9,t-1,d+.9),v-t+2),.22),l===h)continue;const f=K(l+1);for(const y of[-e,e]){const q=new b(s(y,t,d),s(y,t,f),11.5);c(q,.24),a.push(ye(q,y,d,f))}c(new b(s(-e,t,d),s(e,t,f),v+1.2-t),.2,56),c(new b(s(e,t,d),s(-e,t,f),v+1.2-t),.2,56),m(s(0,v+1.2,d),s(0,v+1.2,f),.14)}const i=u.z;r(-e,i,t),r(e,i,t);const A=new b(s(-e,t,i),s(e,t,i),v+2-t);c(A,.42,64),c(new b(s(-e-1.1,t-1.5,i+.6),s(e+1.1,t-1.5,i+.6),v+4.5-t),.26,64),m(s(-e,t,i),s(e,t,i),.2);const w=new B(u.r+.25,.42,12,120);w.translate(0,u.y,i+.2),o.push(w);const k=new B(u.r*.22,.26,10,64);k.translate(0,u.y,i+.35),o.push(k);for(let l=0;l<15;l++){const d=(l+.5)/15*Math.PI*2,f=new le(.16,u.r*.72,.3);f.translate(0,u.r*(.24+.36),0),f.rotateZ(-d),f.translate(0,u.y,i+.3),n.push(f)}for(const l of[-4.2,4.2]){const d=new b(s(l-2.6,9,i),s(l+2.6,9,i),4.2);c(d,.16),m(s(l-2.6,-3,i),s(l-2.6,9,i),.16),m(s(l+2.6,-3,i),s(l+2.6,9,i),.16),a.push(be(d,l,i))}return I={gold:j(o),panes:j(a),bars:j(n)},o.forEach(l=>l.dispose()),a.forEach(l=>l.dispose()),n.forEach(l=>l.dispose()),I}function ye(o,a,n,e){const t=ne(o,36),p=-6,v=Math.max(...t.map(r=>r.y)),h=[],u=[],c=[],m=Math.abs(e-n);for(let r=0;r<t.length;r++){const i=t[r];h.push(a,p,i.z,a,i.y-.15,i.z);const A=Math.abs(i.z-n)/m;if(u.push(A,0,A,(i.y-.15-p)/(v-p)),r>0){const w=(r-1)*2;c.push(w,w+2,w+1,w+1,w+2,w+3)}}const s=new $;return s.setAttribute("position",new C(h,3)),s.setAttribute("uv",new C(u,2)),s.setIndex(c),s.computeVertexNormals(),s}function be(o,a,n){const e=ne(o,24),t=-3,p=Math.max(...e.map(m=>m.y)),v=[],h=[],u=[];for(let m=0;m<e.length;m++){const s=e[m];v.push(s.x,t,n-.05,s.x,s.y-.1,n-.05);const r=(s.x-(a-2.6))/5.2;if(h.push(r,0,r,(s.y-.1-t)/(p-t)),m>0){const i=(m-1)*2;u.push(i,i+1,i+2,i+1,i+3,i+2)}}const c=new $;return c.setAttribute("position",new C(v,3)),c.setAttribute("uv",new C(h,2)),c.setIndex(u),c.computeVertexNormals(),c}function Ae(o){const a=new z(o),n={h:0,s:0,l:0};return a.getHSL(n),new z().setHSL(n.h,Math.min(.5,n.s*.6+.08),.7)}function qe(o,a,n){const e=xe(),t=he(a,{leaf:.14,rough:.18,lite:o.quality===0,leafAmt:.45}),p=new R(e.gold,t),v=new R(e.bars,t),h=ge(n,{cells:10}),u=new R(e.panes,h.mat);u.renderOrder=1e3;const c=oe.rose,m=we(n,o.films.map(w=>Ae(w.accent))),s=new R(new se(c.r,128),m.mat);s.position.set(0,c.y,c.z),s.renderOrder=1001;const r=new H({transparent:!0,depthWrite:!1,blending:D,blendSrc:N,blendDst:N,uniforms:{uAmt:{value:1},uCol:{value:new z(1,.86,.62)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform float uAmt; uniform vec3 uCol; varying vec2 vUv; void main(){ float r = length(vUv - .5) * 2.; float g = exp(-pow(max(r - .5, 0.) * 5.5, 1.6)) * smoothstep(1., .8, r); gl_FragColor = vec4(uCol * g * .55 * uAmt, 0.); }"}),i=new R(new re(c.r*3.4,c.r*3.4),r);i.position.set(0,c.y,c.z-.4),i.renderOrder=999;const A=new ie;return A.add(Z(p),Z(v),u,s,i),{group:A,gold:t,glass:h,rose:m,disc:s,glow:r,update(w,k){h.update(w),m.U.uTime.value=k},dispose(){t.dispose(),h.mat.dispose(),m.mat.dispose(),s.geometry.dispose(),r.dispose(),i.geometry.dispose()}}}const g=(o,a,n)=>new M(o,a,n),x=(o,a)=>({from:o,to:a}),S={dawnRest:x(g(1.2,14.9,9.8),g(4.5,13.8,0)),dawnTurn:x(g(13,18.5,8),g(4.5,14.4,0)),naveIn:x(g(0,24,-200),g(0,22,-292)),roseIn:x(g(0,21.5,-310),g(0,24.5,-360)),roseUp:x(g(0,27,-354.5),g(0,31,-362)),roseOut:x(g(0,46.5,-355),g(0,49,-392))},V={dawnNave:3.2,naveRose:2.2},J=o=>new ve(o,!1,"centripetal",.5),F=(o,a,n)=>{o=E(o);const e=o*o,t=e*o;return(t-2*e+o)*a+(-2*t+3*e)+(t-e)*n};function L(o){const a=J(o.map(e=>e.from)),n=J(o.map(e=>e.to));return{len:a.getLength(),at(e,t,p){return a.getPointAt(E(e),t),n.getPointAt(E(e),p),t}}}const G=(o,a,n)=>o*a/Math.max(.001,n),Ce=L([S.dawnRest,S.dawnTurn]),Q=L([S.dawnTurn,x(g(11,21,-40),g(2,18,-200)),x(g(4,23,-130),g(0,21,-280)),S.naveIn]);function Pe(o,a,n){return o<.42?Ce.at(F((o-.06)/(.42-.06),0,0),a,n):Q.at(F((o-.42)/(1-.42),0,G(V.dawnNave,T.dawn*(1-.42),Q.len)),a,n)}const W=L([S.naveIn,x(g(-1.6,22.5,-256),g(0,23,-334)),S.roseIn]);function Re(o,a,n){return W.at(F(o,G(V.dawnNave,T.nave,W.len),G(V.naveRose,T.nave,W.len)),a,n)}const Se=L([S.roseIn,x(g(0,23.6,-331),g(0,24.5,-360))]),ke=()=>G(V.naveRose,T.rose*.4,Se.len);export{b as A,S as P,ae as V,ke as a,qe as c,Pe as d,F as h,Re as n,Se as r};
