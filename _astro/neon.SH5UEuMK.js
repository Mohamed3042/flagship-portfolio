import{F as Y,m as $,M as S,a as I,i as W,G as q,b as K,Y as Z,Z as H,a6 as X,aA as J,a4 as Q,a8 as ee,C as te,a5 as oe}from"./EditionWorld.astro_astro_type_script_index_0_lang.BoXC8VN5.js";import{G as ae,A as R,g as ne}from"./plan.Cc4ACR8d.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const F=[-2.8,-1.9,2.8,1.9];let x=null;function re(){if(x)return x;const[u,d,k,A]=F,t=352,r=Math.round(t*(A-d)/(k-u)),g=Z.map(e=>e.map(([n,o])=>[n-H.width/2,o-H.height/2])),h=g.map(e=>{const n=e.map((s,v)=>{const c=e[(v+1)%e.length];return Math.hypot(c[0]-s[0],c[1]-s[1])}),o=[0];for(const s of n)o.push(o[o.length-1]+s);return{lens:n,cum:o,total:o[o.length-1]}}),m=new Float32Array(t*r),L=new Float32Array(t*r),l=new Float32Array(t*r);for(let e=0;e<r;e++)for(let n=0;n<t;n++){const o=u+(n+.5)/t*(k-u),s=d+(e+.5)/r*(A-d);let v=1/0,c=0,b=!1;g.forEach((a,_)=>{let P=!1;for(let O=0;O<a.length;O++){const[D,M]=a[O],[U,E]=a[(O+1)%a.length],j=U-D,G=E-M,T=Math.max(0,Math.min(1,((o-D)*j+(s-M)*G)/(j*j+G*G))),V=(o-D-j*T)**2+(s-M-G*T)**2;V<v&&(v=V,c=(h[_].cum[O]+T*h[_].lens[O])/h[_].total),M>s!=E>s&&o<D+(s-M)/(E-M)*j&&(P=!P)}b||=P});const p=e*t+n;m[p]=(b?-1:1)*Math.sqrt(v),L[p]=Math.cos(c*Math.PI*2),l[p]=Math.sin(c*Math.PI*2)}const w=m.slice(),z=new Float32Array(t*r),f=7,i=2*f+1,y=(e,n,o,s,v)=>{for(let c=0;c<s;c++){const b=a=>e[v(c,Math.min(o-1,Math.max(0,a)))];let p=0;for(let a=-f;a<=f;a++)p+=b(a);for(let a=0;a<o;a++)n[v(c,a)]=p/i,p+=b(a+f+1)-b(a-f)}};for(let e=0;e<2;e++)y(w,z,t,r,(n,o)=>n*t+o),y(z,w,r,t,(n,o)=>o*t+n);const N=new Uint16Array(t*r*4),B=oe.toHalfFloat;for(let e=0;e<t*r;e++)N[e*4]=B(m[e]),N[e*4+1]=B(w[e]),N[e*4+2]=B(L[e]),N[e*4+3]=B(l[e]);return x=new X(N,t,r,J,Q),x.minFilter=x.magFilter=ee,x.needsUpdate=!0,x}const C=`
  uniform sampler2D uField; uniform vec4 uBox; uniform float uTime, uLevel, uOn, uHue, uFlow;
  ${ae}
  vec4 fieldAt(vec2 p){ return texture2D(uField, clamp((p - uBox.xy) / (uBox.zw - uBox.xy), 0., 1.)); }
  float sAt(vec4 f){ return fract(atan(f.a, f.b) / 6.28318); }
  // the colour of the light at outline position s, object x: the spectrum flows round each letter and across the mark
  vec3 neon(float s, float x){
    vec3 c = spectrum(s * .5 + x * .07 - uTime * .11 * uFlow + uHue);
    float pulse = .78 + .22 * sin((s - uTime * .23) * 12.566);
    return c * pulse;
  }
  // the power-on: the light runs round the outline from each letter's foot; a hot white head leads it
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
  // an analytic studio for the gloss: the horizon of light (a line and its bloom), a soft light overhead
  vec3 env(vec3 r){
    float el = r.y;
    vec3 c = vec3(.006);
    c += vec3(1.) * exp(-abs(el + .02) * 55.) * 1.1 + uSky * exp(-abs(el) * 7.) * .35;
    c += vec3(.55, .56, .6) * smoothstep(.5, .95, el) * .22;
    return c * uEnv;   // nothing to mirror until there is light
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
      // the walls: dark glass, with a strip of light set in the middle of their depth (white-hot at its core); the bevels
      // mirror the room and catch a little of the strip
      float side = 1. - abs(normalize(vObjN).z), z = vObj.z / uDepth;
      float strip = exp(-pow(z / .075, 2.)) * side, near = exp(-pow(z / .32, 2.)) * side;
      vec3 hot = mix(light, vec3(1.), .38 * strip);
      col = vec3(.003, .003, .005) + env(reflect(-V, N)) * fres * .9;
      col += hot * strip * 2.4 * L + light * near * .1 * L + light * (1. - side) * .06 * L + vec3(1.) * hd * strip * 3.;
    } else {
      // the face: dark smoked glass; the light escapes in a fine line at its edges, lighting a little grain inside
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
    // (values here are linear light: small numbers already read bright once encoded, so the falloff is kept tight and
    // windowed to nothing before the plane's edge, or the plane shows as a box)
    vec2 q = (vP - uBox.xy) / (uBox.zw - uBox.xy);
    float win = smoothstep(0., .22, min(min(q.x, 1. - q.x), min(q.y, 1. - q.y)));
    float a = exp(-dn / .022) * .3 + exp(-d / (.1 * uSpread)) * .09 + exp(-d / (.32 * uSpread)) * .022;
    vec3 c = neon(s, vP.x) * lit(s) + vec3(1.) * head(s) * exp(-dn / .04) * .6;
    gl_FragColor = vec4(c * a * win * uLevel, 1.);
  }`;function de({depth:u=.3,sky:d="#cfd3ff"}={}){const k=new Y(...F),A={value:1},t={uField:{value:re()},uBox:{value:k},uTime:{value:0},uLevel:{value:1},uOn:{value:1},uHue:{value:0},uFlow:{value:1}},r=i=>new W({uniforms:{...t,uWall:{value:i},uDepth:{value:u},uEnv:A,uSky:{value:new te(d)}},vertexShader:le,fragmentShader:se}),g=r(0),h=r(1),m=$(u),L=new S(m,[g,h]),l=new S(new I(F[2]-F[0],F[3]-F[1]),new W({uniforms:{...t,uSpread:{value:1}},...R,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:ie}));l.position.z=-(u/2+.1),l.renderOrder=2;const w=new q;w.add(L,l);const z=[g,h,l.material],f=t;return{group:w,mesh:L,halo:l,U:f,env:A,mirror(){const i=new q;i.add(new S(m,[g,h]));const y=new S(l.geometry,l.material);return y.position.copy(l.position),y.renderOrder=2,i.add(y),i},update(i){f.uTime.value=i},dispose(){m.dispose(),l.geometry.dispose(),z.forEach(i=>i.dispose())}}}function fe(u=6){const d=new S(new I(u,u*.55),new K({map:ne(),color:"#ffffff",...R,opacity:.5}));return d.rotation.x=-Math.PI/2,d.renderOrder=3,d}export{fe as l,de as n};
