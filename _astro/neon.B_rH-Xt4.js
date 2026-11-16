import{V as $,m as K,M as j,a as I,b as H,G as W,e as Y,a3 as X,aE as q,ae as Z,be as J,H as Q,u as ee,C as te,aG as oe}from"./EditionWorld.astro_astro_type_script_index_0_lang.Cf_DeyGd.js";import{G as ae,A as R,g as ne}from"./plan.DzpLYLGV.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const F=[-2.8,-1.9,2.8,1.9];let h=null;function re(){if(h)return h;const[u,v,z,A]=F,t=352,r=Math.round(t*(A-v)/(z-u)),g=X.map(e=>e.map(([n,o])=>[n-q.width/2,o-q.height/2])),m=g.map(e=>{const n=e.map((s,d)=>{const c=e[(d+1)%e.length];return Math.hypot(c[0]-s[0],c[1]-s[1])}),o=[0];for(const s of n)o.push(o[o.length-1]+s);return{lens:n,cum:o,total:o[o.length-1]}}),p=new Float32Array(t*r),L=new Float32Array(t*r),l=new Float32Array(t*r);for(let e=0;e<r;e++)for(let n=0;n<t;n++){const o=u+(n+.5)/t*(z-u),s=v+(e+.5)/r*(A-v);let d=1/0,c=0,O=!1;g.forEach((a,E)=>{let P=!1;for(let M=0;M<a.length;M++){const[D,b]=a[M],[U,T]=a[(M+1)%a.length],S=U-D,_=T-b,k=Math.max(0,Math.min(1,((o-D)*S+(s-b)*_)/(S*S+_*_))),V=(o-D-S*k)**2+(s-b-_*k)**2;V<d&&(d=V,c=(m[E].cum[M]+k*m[E].lens[M])/m[E].total),b>s!=T>s&&o<D+(s-b)/(T-b)*S&&(P=!P)}O||=P});const x=e*t+n;p[x]=(O?-1:1)*Math.sqrt(d),L[x]=Math.cos(c*Math.PI*2),l[x]=Math.sin(c*Math.PI*2)}const y=p.slice(),B=new Float32Array(t*r),f=7,i=2*f+1,w=(e,n,o,s,d)=>{for(let c=0;c<s;c++){const O=a=>e[d(c,Math.min(o-1,Math.max(0,a)))];let x=0;for(let a=-f;a<=f;a++)x+=O(a);for(let a=0;a<o;a++)n[d(c,a)]=x/i,x+=O(a+f+1)-O(a-f)}};for(let e=0;e<2;e++)w(y,B,t,r,(n,o)=>n*t+o),w(B,y,r,t,(n,o)=>o*t+n);const N=new Uint16Array(t*r*4),G=oe.toHalfFloat;for(let e=0;e<t*r;e++)N[e*4]=G(p[e]),N[e*4+1]=G(y[e]),N[e*4+2]=G(L[e]),N[e*4+3]=G(l[e]);return h=new Z(N,t,r,J,Q),h.minFilter=h.magFilter=ee,h.needsUpdate=!0,h}const C=`
  uniform sampler2D uField; uniform vec4 uBox; uniform float uTime, uLevel, uOn, uHue, uFlow;
  ${ae}
  vec4 fieldAt(vec2 p){ return texture2D(uField, clamp((p - uBox.xy) / (uBox.zw - uBox.xy), 0., 1.)); }
  float sAt(vec4 f){ return fract(atan(f.a, f.b) / 6.28318); }

  vec3 neon(float s, float x){
    vec3 c = spectrum(s * .5 + x * .07 - uTime * .11 * uFlow + uHue);
    float pulse = .78 + .22 * sin((s - uTime * .23) * 12.566);
    return c * pulse;
  }

  float lit(float s){ return max(1. - smoothstep(uOn - .045, uOn - .015, s), step(.999, uOn)); }
  float head(float s){ float d = uOn - s; return uOn > 0. && uOn < 1. ? exp(-d * d * 1400.) : 0.; }
`,le=`
  varying vec3 vObj, vObjN, vN, vW;
  void main(){
    vObj = position; vObjN = normal;
    vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,se=`
  ${C}
  uniform float uWall, uDepth, uEnv; uniform vec3 uSky;
  varying vec3 vObj, vObjN, vN, vW;

  vec3 env(vec3 r){
    float el = r.y;
    vec3 c = vec3(.006);
    c += vec3(1.) * exp(-abs(el + .02) * 55.) * 1.1 + uSky * exp(-abs(el) * 7.) * .35;
    c += vec3(.55, .56, .6) * smoothstep(.5, .95, el) * .22;
    return c * uEnv;
  }
  void main(){
    vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(cameraPosition - vW);
    float ndv = max(dot(N, V), 0.), fres = .045 + .955 * pow(1. - ndv, 5.);
    vec4 f = fieldAt(vObj.xy);
    float d = f.r, s = sAt(f), L = lit(s) * uLevel, hd = head(s);
    vec3 light = neon(s, vObj.x);
    vec3 col;
    if (uWall > .5) {


      float side = 1. - abs(normalize(vObjN).z), z = vObj.z / uDepth;
      float strip = exp(-pow(z / .075, 2.)) * side, near = exp(-pow(z / .32, 2.)) * side;
      vec3 hot = mix(light, vec3(1.), .38 * strip);
      col = vec3(.003, .003, .005) + env(reflect(-V, N)) * fres * .9;
      col += hot * strip * 2.4 * L + light * near * .1 * L + light * (1. - side) * .06 * L + vec3(1.) * hd * strip * 3.;
    } else {

      float grain = vnoise(vObj.xy * 38.) * .6 + vnoise(vObj.xy * 90.) * .4;
      float edge = exp(min(d, 0.) / .012), deep = exp(min(d, 0.) / .09);
      col = vec3(.003, .003, .005) + env(reflect(-V, N)) * fres;
      col += light * (edge * .85 + deep * .05 * (.4 + 1.2 * grain)) * L + vec3(1.) * hd * edge * 1.5;
    }
    gl_FragColor = vec4(col, 1.);
  }`,ie=`
  ${C}
  uniform float uSpread;
  varying vec2 vP;
  void main(){
    vec4 f = fieldAt(vP);
    float d = max(f.g, 0.), dn = max(f.r, 0.), s = sAt(f);


    vec2 q = (vP - uBox.xy) / (uBox.zw - uBox.xy);
    float win = smoothstep(0., .22, min(min(q.x, 1. - q.x), min(q.y, 1. - q.y)));
    float a = exp(-dn / .022) * .3 + exp(-d / (.1 * uSpread)) * .09 + exp(-d / (.32 * uSpread)) * .022;
    vec3 c = neon(s, vP.x) * lit(s) + vec3(1.) * head(s) * exp(-dn / .04) * .6;
    gl_FragColor = vec4(c * a * win * uLevel, 1.);
  }`;function ve({depth:u=.3,sky:v="#cfd3ff"}={}){const z=new $(...F),A={value:1},t={uField:{value:re()},uBox:{value:z},uTime:{value:0},uLevel:{value:1},uOn:{value:1},uHue:{value:0},uFlow:{value:1}},r=i=>new H({uniforms:{...t,uWall:{value:i},uDepth:{value:u},uEnv:A,uSky:{value:new te(v)}},vertexShader:le,fragmentShader:se}),g=r(0),m=r(1),p=K(u),L=new j(p,[g,m]),l=new j(new I(F[2]-F[0],F[3]-F[1]),new H({uniforms:{...t,uSpread:{value:1}},...R,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:ie}));l.position.z=-(u/2+.1),l.renderOrder=2;const y=new W;y.add(L,l);const B=[g,m,l.material],f=t;return{group:y,mesh:L,halo:l,U:f,env:A,mirror(){const i=new W;i.add(new j(p,[g,m]));const w=new j(l.geometry,l.material);return w.position.copy(l.position),w.renderOrder=2,i.add(w),i},update(i){f.uTime.value=i},dispose(){p.dispose(),l.geometry.dispose(),B.forEach(i=>i.dispose())}}}function fe(u=6){const v=new j(new I(u,u*.55),new Y({map:ne(),color:"#ffffff",...R,opacity:.5}));return v.rotation.x=-Math.PI/2,v.renderOrder=3,v}export{fe as l,ve as n};
