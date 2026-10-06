import{a2 as y,a3 as G,aD as k,ae as C,i as B,C as U,s as b,M as E,a as q,aq as F,ar as A,ap as D}from"./EditionWorld.astro_astro_type_script_index_0_lang.1Y2XAI3Q.js";import{G as H}from"./plan.CmkBA6Q4.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const O=`
  uniform sampler2D uMap; uniform vec2 uRes, uMapRes; uniform float uTime, uOffset, uLevel, uRainbow, uGlow, uLod, uHard, uScan, uBlink;
  uniform vec3 uTint;
  varying vec2 vUv;
  ${H}
  void main(){
    vec2 g = vUv * uRes, cell = floor(g), f = fract(g) - .5;
    vec2 at = vec2(cell.x + floor(uOffset), cell.y) + .5;
    vec3 v = textureLod(uMap, at / uMapRes, uLod).rgb;
    v = mix(v, smoothstep(.22, .55, v), uHard);
    vec3 glow = textureLod(uMap, (g + vec2(floor(uOffset), 0.)) / uMapRes, uLod + 2.6).rgb;
    float lum = max(v.r, max(v.g, v.b));
    vec3 hue = spectrum(cell.x * .011 + cell.y * .018 - uTime * .22);
    vec3 c = mix(v * uTint, lum * hue * 1.15, uRainbow) * uBlink;
    vec3 cg = mix(glow * uTint, max(glow.r, max(glow.g, glow.b)) * hue, uRainbow) * uBlink;
    float d = length(f), aa = max(fwidth(d), 1e-4) * 1.1;
    float dotm = 1. - smoothstep(.33 - aa, .33 + aa, d);
    float halo = exp(-d * d * 10.) * .45;
    float px = 1. / max(fwidth(g.x), 1e-4);                   // screen pixels per LED
    float avgK = 1. - smoothstep(2.4, 5., px);
    vec3 lens = vec3(.016, .016, .02) * (1. - .5 * f.y);       // an unlit LED: a dark lens, lit a little from above
    vec3 led = c * (dotm * 1.35 + halo) + lens * dotm;
    vec3 avg = c * .62 + vec3(.008);
    vec3 col = mix(led, avg, avgK) + cg * uGlow * .35;
    col *= 1. - uScan * .35 * step(.5, fract(gl_FragCoord.y * .5));   // a faint refresh, only if asked
    gl_FragColor = vec4(col * uLevel, 1.);
  }`;function P({cols:n=96,rows:o=16,width:r=8,over:l=4,mapCols:i}={}){i??=n;const t=document.createElement("canvas");t.width=i*l,t.height=o*l;const e=t.getContext("2d"),a=new y(t);a.colorSpace=G,a.minFilter=k,a.wrapS=C;const u=new B({uniforms:{uMap:{value:a},uRes:{value:new b(n,o)},uMapRes:{value:new b(i,o)},uTime:{value:0},uOffset:{value:0},uLevel:{value:1},uRainbow:{value:0},uGlow:{value:1},uLod:{value:Math.log2(l)},uHard:{value:.6},uScan:{value:0},uBlink:{value:1},uTint:{value:new U(1,1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:O}),f=r*o/n,x=new E(new q(r,f),u),T=s=>{t.width!==s*l&&(t.width=s*l,u.uniforms.uMapRes.value.set(s,o),a.dispose())};return{mesh:x,canvas:t,g:e,tex:a,U:u.uniforms,width:r,height:f,cols:n,rows:o,over:l,text(s,{family:v='"Space Grotesk Variable", sans-serif',weight:d=700,fill:h=.78,color:p="#ffffff",rtl:c=!1,align:m="center"}={}){T(n),e.setTransform(1,0,0,1,0,0),e.fillStyle="#000",e.fillRect(0,0,t.width,t.height);const w=t.height/s.length;e.fillStyle=p,e.textBaseline="middle",e.direction=c?"rtl":"ltr",s.forEach((S,L)=>{let g=w*h;e.font=`${d} ${g}px ${v}`;const M=e.measureText(S).width,R=t.width*.94;M>R&&(g*=R/M,e.font=`${d} ${g}px ${v}`),e.textAlign=m==="center"?"center":c?"right":"left";const $=m==="center"?t.width/2:c?t.width-l*2:l*2;e.fillText(S,$,w*(L+.5)+g*.04)}),a.needsUpdate=!0},ticker(s,{family:v='"Space Grotesk Variable", sans-serif',weight:d=700,fill:h=.74,color:p="#ffffff",rtl:c=!1}={}){e.font=`${d} ${t.height*h}px ${v}`;const m=Math.max(n,Math.ceil(e.measureText(s).width/l)+4);return T(m),e.setTransform(1,0,0,1,0,0),e.fillStyle="#000",e.fillRect(0,0,t.width,t.height),e.font=`${d} ${t.height*h}px ${v}`,e.fillStyle=p,e.textBaseline="middle",e.textAlign="left",e.direction=c?"rtl":"ltr",c?(e.textAlign="right",e.fillText(s,t.width-l*2,t.height*.54)):e.fillText(s,l*2,t.height*.54),a.needsUpdate=!0,m},dispose(){x.geometry.dispose(),u.dispose(),a.dispose()}}}function _(n,o,r=.12,l=.08){const i=new F,t=n/2+l,e=o/2+l,a=l*.8;i.moveTo(-t+a,-e),i.lineTo(t-a,-e),i.quadraticCurveTo(t,-e,t,-e+a),i.lineTo(t,e-a),i.quadraticCurveTo(t,e,t-a,e),i.lineTo(-t+a,e),i.quadraticCurveTo(-t,e,-t,e-a),i.lineTo(-t,-e+a),i.quadraticCurveTo(-t,-e,-t+a,-e);const u=new A;u.moveTo(-n/2,-o/2),u.lineTo(-n/2,o/2),u.lineTo(n/2,o/2),u.lineTo(n/2,-o/2),u.lineTo(-n/2,-o/2),i.holes.push(u);const f=new D(i,{depth:r,bevelEnabled:!0,bevelThickness:.015,bevelSize:.015,bevelSegments:2,curveSegments:6});return f.translate(0,0,-r),f}export{_ as b,P as l};
