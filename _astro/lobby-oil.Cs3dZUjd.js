import{O as W,o as Y}from"./oil-glsl.D28H-3mL.js";/*! © 2026 Mohamed Mahmoud. All rights reserved. */const z="attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }",V=`
precision highp float;
uniform sampler2D uPic; uniform vec2 uRes, uCover, uStep; uniform float uIn, uHave;
varying vec2 vUv;
${W}
vec3 pic(vec2 uv){ return texture2D(uPic, clamp((uv - .5) * uCover + .5, 0., 1.)).rgb; }
float lum(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }

float drips(vec2 q, float t){
  float y = q.y, x = q.x;
  float T = 1. - y / (.014 + .012 * oN(vec2(x * 2.6, t * .07)));
  float k = 3.2, c = floor(x * k), f = (fract(x * k) - .5) / k;
  float r = oN(vec2(c * 17.3 + .5, 11.5)), r2 = oN(vec2(c * 7.1 + 3.5, 29.5));
  float L = max(0., r - .3) * .42 * (.78 + .22 * sin(t * .14 + r2 * 30.));
  if (L > .006) {
    float ax = f - (r2 - .5) * .2 / k;
    float a = clamp(y / L, 0., 1.), w = mix(.016, .006, smoothstep(0., 1., a));
    float stem = y < L ? 1. - abs(ax) / w : -1.;
    float bead = 1. - length(vec2(ax, (y - L) * 1.05)) / (.013 + .003 * sin(t * .4 + r2 * 9.));
    T = oSmax(T, oSmax(stem, bead, .5), .6);
  }
  return T;
}
void main(){
  vec2 uv = vUv; float asp = uRes.x / uRes.y, t = uOilT;
  vec2 q = vec2(uv.x * asp, uv.y);

  vec2 p = q * vec2(3.4, 1.7), e = vec2(.03, 0.);
  float h = oH(p, t), hs = oS(h), hx = oS(oH(p + e.xy, t)), hy = oS(oH(p + e.yx, t));
  vec2 g = vec2(hx - hs, hy - hs) / e.x * vec2(1., .5);

  vec3 c = pic(uv) * uHave;
  vec2 st = uStep / uRes;
  vec2 gp = vec2(lum(pic(uv + vec2(st.x, 0.))) - lum(pic(uv - vec2(st.x, 0.))), lum(pic(uv + vec2(0., st.y))) - lum(pic(uv - vec2(0., st.y)))) * uHave;

  vec2 qd = vec2(q.x, 1. - uv.y), de = vec2(.002, 0.);
  float D = drips(qd, t), Dx = drips(qd + de.xy, t), Dy = drips(qd + de.yx, t);
  float dm = smoothstep(-.05, .05, D);
  vec2 dg = vec2(Dx - D, -(Dy - D)) / de.x * .016 * dm / max(.2, sqrt(clamp(D, .04, 1.)));
  vec3 n = normalize(vec3(-g * .34 - gp * .5 - dg, 1.));
  float l = lum(c), thin = smoothstep(.62, .3, h);
  vec3 tone = mix(vec3(l), c, .5);
  vec3 back = tone * (.12 + .95 * thin * thin) + c * smoothstep(.5, .95, l) * .7;
  back *= 1. - .94 * dm;
  vec3 col = vec3(.003) + back + oLight(n);
  col = mix(c, col, uIn);
  gl_FragColor = vec4(col, 1.);
}`;function $({still:d=!1}={}){const l=document.querySelector("[data-lobby-wall]"),T=l?.querySelector(".lb-wall"),r=l?.querySelector("[data-lobby-loop]")??null,i=l?.querySelector(".lb-still img")??null;if(!l||!T)return{stop(){}};const c=document.createElement("canvas");c.className="hl-oil-skin",c.setAttribute("aria-hidden","true");const e=c.getContext("webgl",{alpha:!1,antialias:!1,premultipliedAlpha:!1,powerPreference:"high-performance"});if(!e)return{stop(){}};const _=(t,a)=>{const o=e.createShader(t);if(e.shaderSource(o,a),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(o)||"shader");return o},s=e.createProgram();try{e.attachShader(s,_(e.VERTEX_SHADER,z)),e.attachShader(s,_(e.FRAGMENT_SHADER,V)),e.linkProgram(s)}catch(t){return console.warn("Black Oil:",t),{stop(){}}}if(!e.getProgramParameter(s,e.LINK_STATUS))return{stop(){}};e.useProgram(s);const G=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,G),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const y=e.getAttribLocation(s,"p");e.enableVertexAttribArray(y),e.vertexAttribPointer(y,2,e.FLOAT,!1,0,0);const n=t=>e.getUniformLocation(s,t),A=t=>{const a=e.createTexture();return e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),a},R=256,O=Y(R);A(1),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,R,R,0,e.RGBA,e.UNSIGNED_BYTE,O),A(0),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.uniform1i(n("uPic"),0),e.uniform1i(n("uOilN"),1);const k=n("uRes"),S=n("uCover"),F=n("uStep"),H=n("uOilT"),C=n("uIn"),D=n("uHave");if(e.uniform1f(D,0),r&&r.crossOrigin!=="anonymous"){r.crossOrigin="anonymous";const t=r.getAttribute("src");if(t){const a=r.currentTime,o=!r.paused;r.src=t;try{r.currentTime=a}catch{}o&&r.play().catch(()=>{})}}T.append(c);let v=0,m=0,f=1;const b=()=>{const t=T.getBoundingClientRect();f=Math.min(devicePixelRatio||1,1.5);const a=Math.max(1,Math.round(t.width*f)),o=Math.max(1,Math.round(t.height*f));(a!==v||o!==m)&&(v=c.width=a,m=c.height=o,e.viewport(0,0,v,m)),e.uniform2f(k,v,m),e.uniform2f(F,4*f,4*f)};b();const U=new ResizeObserver(()=>{b(),d&&h(performance.now())});U.observe(T);let E=0,p=0,P=!0,u=!1,L=!1;const x=()=>!!r&&!L&&document.documentElement.classList.contains("lb-wall-live")&&r.readyState>=2&&r.videoWidth>0;function M(){e.activeTexture(e.TEXTURE0);try{if(x())return e.texImage2D(e.TEXTURE_2D,0,e.RGB,e.RGB,e.UNSIGNED_BYTE,r),E=r.videoWidth,p=r.videoHeight,u=!1,!0;if(!u&&i?.complete&&i.naturalWidth)return e.texImage2D(e.TEXTURE_2D,0,e.RGB,e.RGB,e.UNSIGNED_BYTE,i),E=i.naturalWidth,p=i.naturalHeight,u=!0,!0}catch(t){x()?L=!0:u=!0,console.warn("Black Oil: the wall picture is not readable here",t)}return u&&!x()}const w=performance.now();let g=0,I=0,N=!0,X=0;function h(t){if(M()&&(X=1),e.uniform1f(D,X),E&&p){const o=v/m/(E/p);e.uniform2f(S,o<1?o:1,o<1?1:1/o)}else e.uniform2f(S,1,1);const a=d?1:Math.min(1,(t-w)/900);e.uniform1f(C,a*a*(3-2*a)),e.uniform1f(H,d?7:(t-w)/1e3+7),e.drawArrays(e.TRIANGLES,0,3),P&&(P=!1,c.classList.add("is-on"))}const B=t=>{g=requestAnimationFrame(B),!(!N||document.hidden||t-I<31)&&(I=t,h(t))},q=new IntersectionObserver(([t])=>{N=t.isIntersecting});if(q.observe(l),d){const t=()=>{h(performance.now()),!u&&!i?.complete&&setTimeout(t,200)};i?.addEventListener("load",()=>{u=!1,h(performance.now())}),t()}else g=requestAnimationFrame(B);return{stop(){cancelAnimationFrame(g),U.disconnect(),q.disconnect(),c.remove(),e.getExtension("WEBGL_lose_context")?.loseContext()}}}export{$ as start};
