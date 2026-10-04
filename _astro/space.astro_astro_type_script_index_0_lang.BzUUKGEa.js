const E=`#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0., 1.); }`,F=`#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime, uLift, uBack, uDrift; uniform vec3 uTint;
out vec4 o;
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; } return v; }
vec3 stars(vec2 uv){
  vec3 c = vec3(0.);
  for (int l = 0; l < 3; l++) {
    float fl = float(l), s = 70. + fl * 55.;
    vec2 p = uv * s + vec2(fl * 13.7, uDrift * (4. + fl * 5.));
    vec2 id = floor(p), f = fract(p) - .5;
    float h = hash(id + fl * 17.);
    if (h > .975) {
      vec2 off = (vec2(hash(id + 3.), hash(id + 7.)) - .5) * .6;
      float r = length(f - off), tw = .55 + .45 * sin(uTime * (.8 + h * 2.6) + h * 50.);
      c += mix(vec3(.75, .82, 1.), vec3(1., .92, .82), hash(id + 11.)) * smoothstep(.1, 0., r) * tw * (1.25 - fl * .3);
    }
  }
  return c;
}
void main(){
  vec2 frag = gl_FragCoord.xy, uv = frag / uRes.y;
  float aspect = uRes.x / uRes.y;
  vec3 col = stars(uv) * (1. - .5 * uBack);
  float lift = clamp(uLift, 0., 1.) * (1. - clamp(uBack, 0., 1.));
  float R = mix(2.4, 1.05, lift) * max(1., aspect * .55);
  vec2 C = vec2(aspect * .5, mix(.2, .1, lift) - R);
  vec2 q = uv - C; float d = length(q), edge = d - R;
  vec3 rim = mix(vec3(.32, .5, 1.), uTint, .6);
  if (edge < 0.) {
    vec2 n2 = q / R; float z = sqrt(max(0., 1. - dot(n2, n2)));
    vec3 n = vec3(n2, z), L = normalize(vec3(0., .62, .38));
    float diff = max(0., dot(n, L)), cl = fbm(n2 * 3.4 + vec2(uTime * .006, 0.));
    vec3 ground = mix(vec3(.006, .008, .016), vec3(.04, .055, .085), cl);
    col = ground * (.18 + diff * 1.4) + rim * pow(1. - z, 4.) * .55;
  }
  float halo = edge > 0. ? exp(-edge * 16.) : exp(edge * 40.);
  float top = clamp((uv.y - C.y) / R, 0., 1.);
  col += rim * halo * (.25 + pow(top, 3.) * 1.3);
  vec2 S = C + vec2(0., R);
  col += vec3(1., .96, .9) * exp(-length((uv - S) * vec2(.32, 1.)) * 30.) * 1.1;
  col += rim * exp(-abs(uv.y - S.y) * 70.) * exp(-abs(uv.x - S.x) * 1.3) * .45;
  col *= 1. - .4 * pow(length(frag / uRes - .5), 2.2);
  col += (hash(frag + fract(uTime * 3.7)) - .5) * .014;
  o = vec4(col, 1.);
}`,g=(o,e,s)=>Math.max(e,Math.min(s,o)),M=o=>{const e=/#?([0-9a-f]{6})/i.exec(o);return e?[0,2,4].map(s=>parseInt(e[1].slice(s,s+2),16)/255):[.55,.7,1]};function k(o){const e=o.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,powerPreference:"high-performance"});if(!e)return null;const s=(t,p)=>{const l=e.createShader(t);if(e.shaderSource(l,p),e.compileShader(l),!e.getShaderParameter(l,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(l)||"shader");return l},i=e.createProgram();if(e.attachShader(i,s(e.VERTEX_SHADER,E)),e.attachShader(i,s(e.FRAGMENT_SHADER,F)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(i)||"link");e.useProgram(i);const x=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,x),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const d=e.getAttribLocation(i,"aPos");e.enableVertexAttribArray(d),e.vertexAttribPointer(d,2,e.FLOAT,!1,0,0);const n=Object.fromEntries(["uRes","uTime","uLift","uBack","uDrift","uTint"].map(t=>[t,e.getUniformLocation(i,t)])),u=()=>{const t=Math.min(devicePixelRatio||1,innerWidth<760?1:1.25);o.width=Math.round(innerWidth*t),o.height=Math.round(innerHeight*t),e.viewport(0,0,o.width,o.height)};return u(),addEventListener("resize",u,{passive:!0}),t=>{e.uniform2f(n.uRes,o.width,o.height),e.uniform1f(n.uTime,t.t),e.uniform1f(n.uLift,t.lift),e.uniform1f(n.uBack,t.back),e.uniform1f(n.uDrift,t.drift),e.uniform3f(n.uTint,t.tint[0],t.tint[1],t.tint[2]),e.drawArrays(e.TRIANGLES,0,3)}}function q(){const o=matchMedia("(prefers-reduced-motion: reduce)").matches,e=document.querySelector("[data-head]"),s=[...document.querySelectorAll("[data-scene]")],i=document.querySelector("[data-strip]"),x=document.documentElement.dir==="rtl";for(const r of document.querySelectorAll("[data-words]")){const c=(r.textContent||"").trim().split(/\s+/);r.setAttribute("aria-label",r.textContent?.trim()||""),r.innerHTML=c.map((a,h)=>`<span class="w" aria-hidden="true" style="--i:${h}">${a.replace(/</g,"&lt;")}</span>`).join(" ")}const d=new IntersectionObserver(r=>{for(const c of r)c.isIntersecting&&(c.target.classList.add("is-in"),d.unobserve(c.target))},{threshold:.35,rootMargin:"0px 0px -8% 0px"});for(const r of document.querySelectorAll("[data-words], [data-rise]"))d.observe(r);let n=null;try{n=k(document.querySelector("[data-sky]"))}catch(r){console.warn("Space sky:",r)}const u=[.55,.7,1],t=[.55,.7,1];let p=0,l=0,y=!0,A=performance.now();function R(){const r=innerHeight,c=r/2;let a=null;for(const f of s){const m=f.getBoundingClientRect(),b=Math.max(1,m.height-r),v=g(-m.top/b,0,1),T=g(1-m.top/r,0,1),L=g((v-.8)/.2,0,1);f.style.setProperty("--p",v.toFixed(4)),f.style.setProperty("--in",T.toFixed(4)),f.style.setProperty("--out",L.toFixed(4));const S=f.dataset.scene;if(S==="hero"&&(p=v),S==="contact"&&(l=T),f.dataset.accent&&m.top<c&&m.bottom>c&&(a=f.dataset.accent),S==="fleet"&&i){const P=Math.max(0,i.scrollWidth-innerWidth);i.style.setProperty("--x",`${(x?1:-1)*P*g((v-.05)/.9,0,1)}px`)}}const h=a?M(a):[.55,.7,1];t[0]=h[0],t[1]=h[1],t[2]=h[2],e?.classList.toggle("is-solid",scrollY>innerHeight*.6),y=!0}addEventListener("scroll",R,{passive:!0}),addEventListener("resize",R,{passive:!0}),R();function w(r){if(requestAnimationFrame(w),document.hidden||!n)return;const c=Math.min(.05,(r-A)/1e3);A=r;for(let a=0;a<3;a++)u[a]+=(t[a]-u[a])*(1-Math.exp(-c*3));o&&!y||(y=!1,n({t:o?0:r/1e3,lift:p,back:l,drift:scrollY/innerHeight*.02,tint:u}))}requestAnimationFrame(w)}q();
