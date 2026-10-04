const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/GLTFLoader.ut-U2dNv.js","_astro/three.module.BV0dDOYn.js","_astro/DRACOLoader.BNB08wbf.js","_astro/KTX2Loader.DsdTamEE.js"])))=>i.map(i=>d[i]);
import{_ as bt}from"./preload-helper.DArFJGja.js";import{b as D,r as _o,f as Fe,$ as bo,h as ze,a5 as Nt,n as ye,p as qe,H as Xe,q as Ko,a6 as Qo,i as H,x as N,A as jt,t as Et,a7 as Ot,S as xt,l as Ue,a8 as Gt,g as X,j as Ee,a4 as ke,a9 as _e,G as at,a as $o,a1 as Yo,aa as Xo,ab as St,ac as nt,ad as yo,a2 as Jo,_ as Zo,B as Te,X as rt,ae as ea,J as xo,af as st,ag as Fo,u as Wt,w as Do,W as ta,ah as oa,s as aa,a0 as sa,v as ia,ai as na,D as ra,R as la}from"./three.module.BV0dDOYn.js";import{a as ca,T as ua,f as Ye}from"./flight-state.DAdC5uoT.js";const lt=`
/* Value noise from a 256×256 random texture (world.ts builds it): the G
   channel holds R shifted by (37, 17) texels, so one bilinear fetch returns
   the two z-planes a 3D sample needs. Two texture reads per octave instead
   of eight hashes: it compiles in milliseconds and runs well on a phone. */
uniform sampler2D tNoise;
float noise3(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
  vec2 rg = texture2D(tNoise, (uv + 0.5) / 256.0).xy;
  return mix(rg.x, rg.y, f.z);
}
float fbm3(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * noise3(p);
    p = p * 2.03 + vec3(1.7, -2.3, 0.9);
    a *= 0.5;
  }
  return v;
}
float fbm3lo(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise3(p);
    p = p * 2.03 + vec3(1.7, -2.3, 0.9);
    a *= 0.5;
  }
  return v;
}
float ridged3(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  float w = 1.0;
  for (int i = 0; i < OCTAVES; i++) {
    float n = 1.0 - abs(noise3(p) * 2.0 - 1.0);
    n = n * n * w;
    w = clamp(n * 2.0, 0.0, 1.0);
    v += n * a;
    p = p * 2.07 + vec3(3.1, 1.7, -2.3);
    a *= 0.5;
  }
  return v;
}
`,ct=`
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixel;
uniform float uScale;
varying vec3 vColor;
varying float vAlpha;
varying float vBokeh;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float twinkle = 0.72 + 0.28 * sin(uTime * (0.4 + aSeed * 1.9) + aSeed * 61.0);
  float ps = aSize * uPixel * uScale / max(-mv.z, 0.001);
  // A particle passing close to the lens goes out of focus: a soft, wide,
  // faint disc (the lens's own bokeh) instead of a hard bright dot.
  float bokeh = 1.0 - smoothstep(0.8, 9.0, -mv.z);
  vBokeh = bokeh;
  float shown = step(0.35, -mv.z);
  vAlpha = shown * twinkle * clamp(ps, 0.0, 1.0) * mix(1.0, 0.16, bokeh);
  gl_PointSize = clamp(ps * (1.0 + bokeh * 5.0), 1.0, 96.0 * uPixel);
  vColor = aColor;
  gl_Position = projectionMatrix * mv;
}
`,ut=`
uniform float uLight;
varying vec3 vColor;
varying float vAlpha;
varying float vBokeh;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float soft = smoothstep(0.5, 0.0, d);
  soft *= soft;
  float disc = smoothstep(0.5, 0.4, d) * 0.55 + smoothstep(0.34, 0.44, d) * smoothstep(0.5, 0.45, d) * 0.45;
  float a = mix(soft, disc, vBokeh);
  vec3 col = mix(vColor, vColor * 0.32 + vec3(0.02, 0.03, 0.09), uLight);
  gl_FragColor = vec4(col, a * vAlpha * mix(1.0, 0.7, uLight));
}
`,It=`
varying vec2 vUv;
varying float vFacing;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec3 n = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0));
  vec3 v = normalize(cameraPosition - wp.xyz);
  // Flat cloud sheets vanish edge-on instead of showing as lines.
  vFacing = smoothstep(0.05, 0.55, abs(dot(n, v)));
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,qt=t=>`
#define OCTAVES ${t}
uniform float uTime;
uniform float uSeed;
uniform float uOpacity;
uniform float uLight;
uniform vec3 uColA;
uniform vec3 uColB;
varying vec2 vUv;
varying float vFacing;
${lt}
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float edge = smoothstep(1.0, 0.15, length(p));
  float n = fbm3(vec3(vUv * 2.6, uSeed) + vec3(uTime * 0.006, -uTime * 0.004, 0.0));
  float m = fbm3(vec3(vUv * 5.2 - n * 1.4, uSeed * 1.7));
  float dens = smoothstep(0.42, 0.95, n * 0.62 + m * 0.58) * edge;
  vec3 col = mix(uColA, uColB, smoothstep(0.3, 0.8, m));
  col = mix(col, col * 0.4 + vec3(0.05, 0.06, 0.14), uLight);
  gl_FragColor = vec4(col, dens * uOpacity * vFacing);
}
`,Rt=`
varying vec3 vObj;
varying vec3 vWorldN;
varying vec3 vWorldPos;
varying mat3 vRot;
void main() {
  vObj = position;
  mat3 m = mat3(modelMatrix);
  vRot = mat3(normalize(m[0]), normalize(m[1]), normalize(m[2]));
  vWorldN = normalize(m * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,da=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,fa=(t,e)=>`
#define OCTAVES ${t}
#define KIND ${e}
uniform vec3 uA;
uniform vec3 uB;
uniform float uSeed;
uniform float uPass;
varying vec2 vUv;
${lt}
vec3 warp(vec3 p) {
  return p + 0.32 * vec3(fbm3lo(p * 1.6 + uSeed), fbm3lo(p * 1.6 + uSeed + 5.2), fbm3lo(p * 1.6 - uSeed));
}
float height(vec3 p) {
  vec3 q = warp(p);
#if KIND == 0
  return fbm3(q * 2.5 + uSeed) * 0.6 + ridged3(q * 4.6 - uSeed) * 0.4;
#elif KIND == 1
  return fbm3(vec3(q.x, q.y * 4.5, q.z) * 2.2 + uSeed);
#elif KIND == 2
  return ridged3(q * 5.2 + uSeed);
#else
  return fbm3(q * 4.4 + uSeed);
#endif
}
void main() {
  float lon = (vUv.x - 0.5) * 6.2831853;
  float lat = (vUv.y - 0.5) * 3.1415926;
  vec3 p = vec3(cos(lat) * cos(lon), sin(lat), cos(lat) * sin(lon));
  float h0 = height(p);
  float latA = abs(p.y);
  vec3 base;
  float emit = 0.0;
  float mask = 0.0;
#if KIND == 0
  {
    float sea = 0.5;
    float land = smoothstep(sea - 0.012, sea + 0.012, h0);
    float depth = smoothstep(0.2, sea, h0);
    vec3 ocean = mix(uA * 0.12, uA * 0.55, depth);
    float alt = smoothstep(sea, 0.86, h0);
    vec3 low = mix(uB * 0.45, uB * 0.85, fbm3lo(p * 9.0 + uSeed));
    vec3 high = mix(vec3(0.42, 0.36, 0.3), vec3(0.62, 0.58, 0.55), fbm3lo(p * 14.0 - uSeed));
    vec3 ground = mix(low, high, smoothstep(0.35, 0.8, alt));
    float snow = clamp(smoothstep(0.72, 0.9, alt) + smoothstep(0.78, 0.9, latA + fbm3lo(p * 6.0) * 0.12), 0.0, 1.0);
    ground = mix(ground, vec3(0.95, 0.96, 1.0), snow);
    float foam = smoothstep(0.03, 0.0, abs(h0 - sea)) * 0.5;
    base = mix(ocean, ground, land) + vec3(foam) * (1.0 - land) * 0.6;
    float city = smoothstep(0.86, 0.98, noise3(p * 140.0 + uSeed)) * smoothstep(0.35, 0.75, fbm3lo(p * 11.0 + uSeed * 2.0));
    emit = city * land * (1.0 - snow) * (1.0 - smoothstep(0.55, 0.8, alt));
    mask = land;
  }
#elif KIND == 1
  {
    float turb = fbm3(vec3(p.x, p.y * 6.0, p.z) * 2.0 + uSeed);
    float bands = sin(p.y * 15.0 + turb * 5.0 + h0 * 3.0) * 0.5 + 0.5;
    float fine = sin(p.y * 62.0 + turb * 9.0) * 0.5 + 0.5;
    base = mix(uA * 0.55, uB, bands);
    base = mix(base, vec3(0.97, 0.93, 0.85), smoothstep(0.7, 0.95, turb) * 0.4 + fine * 0.08);
    float storm = smoothstep(0.16, 0.0, length((vUv - vec2(0.62, 0.41)) * vec2(2.6, 1.0)));
    base = mix(base, mix(uB, vec3(1.0, 0.9, 0.8), 0.5), storm * 0.85);
    mask = 0.0;
  }
#elif KIND == 2
  {
    float facet = smoothstep(0.22, 0.85, h0);
    vec3 ice = mix(uB * 0.5, mix(uA, vec3(0.93, 0.97, 1.0), 0.62), facet);
    vec3 veins = mix(uA, vec3(1.0), 0.55);
    base = mix(ice, veins, pow(h0, 6.0));
    emit = pow(h0, 4.0) * 0.5 + facet * 0.05;
    mask = 0.5;
  }
#else
  {
    float crack = 1.0 - smoothstep(0.0, 0.042, abs(h0 - 0.5) + fbm3lo(p * 12.0 - uSeed) * 0.014);
    float hot = smoothstep(0.58, 0.9, fbm3lo(p * 3.0 + uSeed));
    vec3 rock = mix(vec3(0.34, 0.2, 0.13), vec3(0.66, 0.46, 0.32), fbm3lo(p * 9.0 + uSeed));
    vec3 crust = mix(rock, uA, 0.28);
    base = mix(crust * 0.75, crust * 1.3, smoothstep(0.45, 0.85, h0));
    base = mix(base, vec3(0.12, 0.1, 0.11), smoothstep(0.35, 0.0, h0) * 0.7);
    emit = crack * (0.9 + hot * 0.6) + hot * 0.22;
    mask = hot;
  }
#endif
  if (uPass < 0.5) gl_FragColor = vec4(base, emit);
  else gl_FragColor = vec4(h0, mask, 0.0, 1.0);
}
`,So=t=>`
#define OCTAVES 4
#define KIND ${t}
uniform sampler2D tAlbedo;
uniform sampler2D tData;
uniform vec2 uTexel;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uLightPos;
uniform float uSeed;
uniform float uTime;
varying vec3 vObj;
varying vec3 vWorldN;
varying vec3 vWorldPos;
varying mat3 vRot;
${lt}
void main() {
  vec3 p = normalize(vObj);
  vec2 uv = vec2(atan(p.z, p.x) / 6.2831853 + 0.5, asin(clamp(p.y, -1.0, 1.0)) / 3.1415926 + 0.5);
  vec4 alb = texture2D(tAlbedo, uv);
  vec4 dat = texture2D(tData, uv);
  float hx = texture2D(tData, uv + vec2(uTexel.x, 0.0)).r - texture2D(tData, uv - vec2(uTexel.x, 0.0)).r;
  float hy = texture2D(tData, uv + vec2(0.0, uTexel.y)).r - texture2D(tData, uv - vec2(0.0, uTexel.y)).r;
  vec3 N = normalize(vWorldN);
  vec3 L = normalize(uLightPos - vWorldPos);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 T = normalize(cross(vec3(0.0, 1.0, 0.0), p) + vec3(0.001, 0.0, 0.0));
  vec3 Bt = cross(p, T);
  vec3 wT = normalize(vRot * T);
  vec3 wB = normalize(vRot * Bt);
#if KIND == 0
  const float bump = 2.4;
#elif KIND == 1
  const float bump = 0.3;
#elif KIND == 2
  const float bump = 3.2;
#else
  const float bump = 2.6;
#endif
  float cosl = max(0.2, sqrt(1.0 - p.y * p.y));
  vec3 Nb = normalize(N - (wT * (hx / cosl) + wB * hy) * bump * 26.0);
  float spec = 0.0;
  float emit = alb.a;
  float lights = 0.0;
  vec3 base = alb.rgb;
#if KIND == 0
  Nb = normalize(mix(N, Nb, dat.g));
  spec = pow(max(dot(reflect(-L, Nb), V), 0.0), 90.0) * (1.0 - dat.g) * 0.9;
  lights = alb.a;
  emit = 0.0;
#elif KIND == 2
  spec = pow(max(dot(reflect(-L, Nb), V), 0.0), 30.0) * 0.5;
#elif KIND == 3
  emit = alb.a * (0.85 + 0.15 * sin(uTime * 1.7 + dat.g * 9.0));
#endif
  float diff = clamp((dot(Nb, L) + 0.16) / 1.16, 0.0, 1.0);
  float day = clamp(dot(N, L) * 1.6 + 0.2, 0.0, 1.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  float shade = 1.0;
#if KIND == 0
  {
    float cloud = smoothstep(0.5, 0.82, fbm3(p * 3.1 + vec3(uTime * 0.018 + 0.05, uTime * 0.004, uSeed + 9.1)) * 0.7 + fbm3(p * 7.5 - vec3(0.0, uTime * 0.01, uSeed + 9.1)) * 0.3);
    shade = 1.0 - cloud * 0.4;
  }
#endif
  vec3 col = base * (0.035 + diff * 1.12 * shade) + uB * 0.05;
  col += vec3(1.0, 0.97, 0.9) * spec * day;
  col += uB * fres * (0.22 + diff * 0.9);
  col += mix(uB, vec3(1.0, 0.7, 0.35), 0.45) * emit * (1.0 - diff * 0.5);
  col += vec3(1.0, 0.82, 0.55) * lights * (1.0 - day) * 1.8;
  // gentle shoulder so accent colours never clip to flat white
  col = col / (col + vec3(0.9)) * 1.9;
  gl_FragColor = vec4(col, 1.0);
}
`,ha=`
varying vec3 vN;
varying vec3 vWorldPos;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,ma=`
uniform vec3 uColor;
uniform vec3 uLightPos;
varying vec3 vN;
varying vec3 vWorldPos;
void main() {
  vec3 V = normalize(cameraPosition - vWorldPos);
  float rim = pow(clamp(1.0 + dot(normalize(vN), V), 0.0, 1.0), 2.4);
  float lit = clamp(dot(normalize(vN), normalize(uLightPos - vWorldPos)) + 0.55, 0.15, 1.0);
  gl_FragColor = vec4(uColor, rim * 0.85 * lit);
}
`,ko=`
attribute float aT;
uniform float uPixel;
uniform float uTime;
uniform float uDraw;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float pulse = pow(0.5 + 0.5 * sin((aT * 90.0) - uTime * 2.2), 6.0);
  float drawn = 1.0 - smoothstep(uDraw - 0.02, uDraw, aT);
  vA = drawn * (0.42 + pulse * 0.58) * smoothstep(0.8, 5.0, -mv.z);
  gl_PointSize = clamp((1.6 + pulse * 2.4) * uPixel * 150.0 / max(-mv.z, 0.001), 1.2 * uPixel, 8.0 * uPixel);
  gl_Position = projectionMatrix * mv;
}
`,Mo=`
uniform vec3 uColor;
uniform float uLight;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColor, uColor * 0.45, uLight);
  gl_FragColor = vec4(col, a * vA);
}
`,pa=`
varying vec2 vUv;
void main() {
  vUv = uv;
  // camera-facing billboard: keep only the translation of the model-view
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec3 scale = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), 1.0);
  mv.xy += position.xy * scale.xy;
  gl_Position = projectionMatrix * mv;
}
`,va=`
uniform vec3 uColor;
uniform float uOpacity;
uniform float uLight;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.6);
  float core = pow(clamp(1.0 - d * 3.2, 0.0, 1.0), 2.0);
  vec3 col = mix(uColor, vec3(1.0), core * 0.8);
  col = mix(col, uColor * 0.5, uLight);
  gl_FragColor = vec4(col, (a * 0.7 + core) * uOpacity);
}
`,ga=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.999999, 1.0);
}
`,wa=`
uniform vec3 uTop;
uniform vec3 uBottom;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(uBottom, uTop, vUv.y), 1.0);
}
`,ba=t=>`
#define OCTAVES ${t}
uniform vec3 uColor;
uniform vec3 uLightPos;
uniform float uRadius;
uniform float uSeed;
uniform float uTime;
varying vec3 vObj;
varying vec3 vWorldN;
varying vec3 vWorldPos;
${lt}
void main() {
  vec3 p = vObj / uRadius;
  vec3 N = normalize(vWorldN);
  vec3 L = normalize(uLightPos - vWorldPos);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float n = fbm3(p * 3.1 + vec3(uTime * 0.018, uTime * 0.004, uSeed));
  float m = fbm3(p * 7.5 - vec3(0.0, uTime * 0.01, uSeed));
  float a = smoothstep(0.5, 0.82, n * 0.7 + m * 0.3);
  float diff = clamp((dot(N, L) + 0.3) / 1.3, 0.04, 1.0);
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);
  vec3 col = mix(uColor, vec3(1.0), 0.8) * (0.12 + diff);
  gl_FragColor = vec4(col, a * 0.85 * (1.0 - rim * 0.7));
}
`,Kt=`
varying vec2 vUv;
varying vec3 vN;
varying vec3 vWorldPos;
varying vec3 vObj;
void main() {
  vUv = uv;
  vObj = position;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,ya=`
#define OCTAVES 3
uniform vec3 uColor;
uniform float uTime;
uniform float uSeed;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vWorldPos;
${lt}
void main() {
  float n = fbm3(vec3(vUv.x * 9.0, vUv.y * 2.0, uSeed) + vec3(uTime * 0.25, 0.0, 0.0));
  float band = smoothstep(0.12, 0.45, vUv.y) * (1.0 - smoothstep(0.55, 0.95, vUv.y));
  float a = band * smoothstep(0.32, 0.8, n) * 0.8;
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - abs(dot(normalize(vN), V)), 1.5);
  gl_FragColor = vec4(mix(uColor, vec3(0.7, 1.0, 0.85), 0.35) * (0.6 + n), a * (0.5 + fres * 0.5));
}
`,xa=`
uniform vec3 uColor;
uniform float uTime;
uniform float uDraw;
uniform float uLight;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vWorldPos;
void main() {
  float dash = pow(0.5 + 0.5 * sin(vUv.x * 260.0 - uTime * 3.4), 10.0);
  float slow = pow(0.5 + 0.5 * sin(vUv.x * 40.0 - uTime * 0.9), 2.0);
  float drawn = 1.0 - smoothstep(uDraw - 0.015, uDraw + 0.015, vUv.x);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - abs(dot(normalize(vN), V)), 1.2);
  vec3 col = uColor * (0.3 + slow * 0.4 + dash * 1.6) + vec3(1.0) * dash * 0.35;
  col = mix(col, uColor * 0.5, uLight);
  gl_FragColor = vec4(col, (0.25 + dash * 0.75) * drawn * (0.55 + fres * 0.45));
}
`,Sa=`
uniform vec3 uColor;
uniform float uTime;
uniform float uRise;
uniform float uHot;
uniform float uLight;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vWorldPos;
varying vec3 vObj;
void main() {
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - abs(dot(normalize(vN), V)), 2.0);
  float bands = 0.5 + 0.5 * sin(vObj.y * 7.0 + vUv.y * 18.0 - uTime * 2.6);
  float scan = smoothstep(0.96, 1.0, fract(vObj.y * 0.9 - uTime * 0.6)) * 0.6;
  vec3 col = uColor * (0.16 + fres * 0.78 + uHot * 0.5 + bands * 0.1 + scan * 0.5)
           + vec3(1.0) * (pow(fres, 5.0) * 0.32 + uHot * 0.12);
  col = mix(col, uColor * 0.55, uLight);
  gl_FragColor = vec4(col, (0.3 + fres * 0.5) * uRise);
}
`,ka=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ma=`
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uVelocity;
uniform float uLight;
uniform float uGrain;
uniform float uVignette;
uniform float uAberration;
uniform float uWarp;
uniform float uFlash;
uniform vec3 uFlashColor;
uniform float uAnamorphic;
uniform vec3 uAnamorphicTint;
varying vec2 vUv;
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec2 uv = vUv;
  vec2 c = uv - 0.5;
  float r2 = dot(c, c);
  vec2 dir = c / max(length(c), 1e-4);
  float ca = (uAberration + uVelocity * 0.0045 + uWarp * 0.02) * r2 * 3.0;
  float streak = uVelocity * (0.012 + r2 * 0.06) + uWarp * (0.05 + r2 * 0.22);
  vec3 col = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float t = float(i) / 5.0;
    vec2 o = dir * streak * t;
    col.r += texture2D(tDiffuse, uv - o - dir * ca).r;
    col.g += texture2D(tDiffuse, uv - o).g;
    col.b += texture2D(tDiffuse, uv - o + dir * ca).b;
  }
  col /= 6.0;
  // anamorphic flare: the brightest points smear sideways in the accent tint
  if (uAnamorphic > 0.001) {
    vec3 flare = vec3(0.0);
    for (int i = -6; i <= 6; i++) {
      float t = float(i) / 6.0;
      vec3 s = texture2D(tDiffuse, uv + vec2(t * 0.055, 0.0)).rgb;
      float l = max(0.0, dot(s, vec3(0.3, 0.59, 0.11)) - 0.78);
      flare += l * (1.0 - abs(t)) * (1.0 - abs(t));
    }
    col += flare * uAnamorphicTint * uAnamorphic * 0.55;
  }
  col = mix(col, uFlashColor, clamp(uFlash, 0.0, 1.0));
  float vig = 1.0 - smoothstep(0.3, 1.3, r2 * 2.6) * uVignette;
  col *= mix(vig, 1.0, uLight * 0.7);
  float g = hash21(uv * vec2(1920.0, 1080.0) + fract(uTime * 7.31) * 100.0) - 0.5;
  col += g * uGrain * mix(1.0, 0.45, uLight);
  gl_FragColor = vec4(col, 1.0);
}
`,za=`
attribute vec3 aColor;
attribute vec3 aScatter;
attribute float aSeed;
uniform float uTime;
uniform float uPixel;
uniform float uAssemble;
uniform float uScale;
uniform vec3 uOrigin;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uSize;
uniform float uTravel;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float delay = aSeed * 0.55;
  float e = smoothstep(delay, delay + 0.45, uAssemble);
  e = 1.0 - pow(1.0 - e, 3.0);
  // a breath of drift once assembled, a slow tumble while scattered
  vec3 drift = vec3(sin(uTime * 1.3 + aSeed * 40.0), cos(uTime * 1.1 + aSeed * 23.0), sin(uTime * 0.9 + aSeed * 61.0)) * 0.55;
  vec3 tumble = vec3(sin(uTime * 0.4 + aSeed * 9.0), cos(uTime * 0.35 + aSeed * 5.0), 0.0) * 30.0;
  vec3 target = position + drift * (1.0 - 0.6 * e);
  vec3 rest = aScatter + tumble;
  vec3 local = mix(rest, target, e);
  // the line travels: it arrives from deep in the scene and, when it leaves,
  // streams past the viewer (uTravel is signed, in world units)
  float travel = (1.0 - e) * uTravel * (0.6 + aSeed * 0.8);
  vec3 world = uOrigin + uRight * (local.x * uScale) + uUp * (local.y * uScale) + uFwd * (local.z * uScale * 6.0 + travel);
  vec4 mv = viewMatrix * vec4(world, 1.0);
  float twinkle = 0.8 + 0.2 * sin(uTime * 3.0 + aSeed * 90.0);
  gl_PointSize = uSize * uPixel * mix(0.6, 1.0, e) * twinkle * (7.0 / max(-mv.z, 0.5));
  vColor = aColor;
  vAlpha = mix(0.22, 1.0, e);
  gl_Position = projectionMatrix * mv;
}
`,Ca=`
uniform float uLight;
uniform float uAlpha;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.22, d);
  vec3 col = mix(vColor, vColor * 0.6, uLight);
  gl_FragColor = vec4(col, a * vAlpha * uAlpha);
}
`,Ta=`
uniform vec3 uOrigin;
uniform vec3 uRight;
uniform vec3 uUp;
uniform float uW;
uniform float uH;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 world = uOrigin + uRight * (position.x * uW) + uUp * (position.y * uH);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`,Aa=`
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 c = (vUv - 0.5) * 2.0;
  float d = length(c * vec2(1.0, 1.15));
  float a = pow(clamp(1.0 - d, 0.0, 1.0), 1.5);
  gl_FragColor = vec4(uColor, a * uOpacity);
}
`,Pa=`
varying vec2 vUv;
varying float vNear;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // the iris dissolves as the camera arrives, so flying through it reads as
  // the iris opening rather than a wall of light
  vNear = smoothstep(2.5, 11.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`,Va=`
uniform vec3 uColor;
uniform float uPhase;
uniform float uSpokes;
uniform float uHot;
uniform float uLight;
varying vec2 vUv;
varying float vNear;
void main() {
  vec2 c = vUv - 0.5;
  float r = length(c) * 2.0;
  float ang = atan(c.y, c.x) / 6.2831853;
  float spoke = smoothstep(0.3, 0.5, abs(fract(ang * uSpokes + uPhase) - 0.5) * 2.0);
  float band = smoothstep(0.0, 0.06, r) * (1.0 - smoothstep(0.94, 1.0, r));
  vec3 col = uColor * (0.45 + uHot * 0.6) + vec3(1.0) * uHot * 0.06;
  col = mix(col, uColor * 0.5, uLight);
  gl_FragColor = vec4(col, spoke * band * (0.05 + uHot * 0.24) * vNear);
}
`,_a=([t,e,o])=>"#"+[t,e,o].map(i=>i.toString(16).padStart(2,"0")).join(""),Fa={dark:"#ffe6d2",light:"#7a4cff",neon:"#eafff2",cinema:"#ffdcb0",storybook:"#fff0c4",wave:"#e6fff1"},Da={dark:"#9fd8ff",light:"#2b6fe0",neon:"#7dffb8",cinema:"#ffb454",storybook:"#f2c14e",wave:"#8a5cff"},Ba={dark:["#03030a","#070713"],light:["#eaf0ff","#f6f4ff"],neon:["#050705","#0a0f0a"],cinema:["#000000","#0a0a0a"],storybook:["#0b1029","#131c45"],wave:["#0e0e0e","#161616"]};function zo(t,e){try{const o=getComputedStyle(document.documentElement).getPropertyValue(t).trim();return/^#[0-9a-f]{6}$/i.test(o)?o:e}catch{return e}}function Co(){const t=ca(),e=ua[t].blobs.map(_a),o=t==="dark"||t==="light"?["#2997ff","#a259ff","#ff5e8a","#64d2ff"]:e,i=Ba[t];return{light:t==="light",core:Fa[t],route:Da[t],arms:o,top:zo("--space-1",i[0]),bottom:zo("--space-2",i[1])}}const yt={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class dt{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ra=new _o(-1,1,1,-1,0,1);class Ua extends Fe{constructor(){super(),this.setAttribute("position",new bo([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new bo([0,2,0,0,2,0],2))}}const La=new Ua;class Bo{constructor(e){this._mesh=new D(La,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ra)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ro extends dt{constructor(e,o="tDiffuse"){super(),this.textureID=o,this.uniforms=null,this.material=null,e instanceof ze?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Nt.clone(e.uniforms),this.material=new ze({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Bo(this.material)}render(e,o,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class To extends dt{constructor(e,o){super(),this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,i){const n=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let r,p;this.inverse?(r=0,p=1):(r=1,p=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),s.buffers.stencil.setFunc(n.ALWAYS,r,4294967295),s.buffers.stencil.setClear(p),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(n.EQUAL,1,4294967295),s.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),s.buffers.stencil.setLocked(!0)}}class Na extends dt{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ea{constructor(e,o){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),o===void 0){const i=e.getSize(new ye);this._width=i.width,this._height=i.height,o=new qe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Xe}),o.texture.name="EffectComposer.rt1"}else this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ro(yt),this.copyPass.material.blending=Ko,this.clock=new Qo}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const o=this.renderer.getRenderTarget();let i=!1;for(let n=0,s=this.passes.length;n<s;n++){const r=this.passes[n];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const p=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(p.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(p.EQUAL,1,4294967295)}this.swapBuffers()}To!==void 0&&(r instanceof To?i=!0:r instanceof Na&&(i=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new ye);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Oa extends dt{constructor(e,o,i=null,n=null,s=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new H}render(e,o,i){const n=e.autoClear;e.autoClear=!1;let s,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=n}}const Wa={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new H(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ze extends dt{constructor(e,o=1,i,n){super(),this.strength=o,this.radius=i,this.threshold=n,this.resolution=e!==void 0?new ye(e.x,e.y):new ye(256,256),this.clearColor=new H(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new qe(s,r,{type:Xe}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let a=0;a<this.nMips;a++){const u=new qe(s,r,{type:Xe});u.texture.name="UnrealBloomPass.h"+a,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const v=new qe(s,r,{type:Xe});v.texture.name="UnrealBloomPass.v"+a,v.texture.generateMipmaps=!1,this.renderTargetsVertical.push(v),s=Math.round(s/2),r=Math.round(r/2)}const p=Wa;this.highPassUniforms=Nt.clone(p.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ze({uniforms:this.highPassUniforms,vertexShader:p.vertexShader,fragmentShader:p.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let a=0;a<this.nMips;a++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[a])),this.separableBlurMaterials[a].uniforms.invSize.value=new ye(1/s,1/r),s=Math.round(s/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Nt.clone(yt.uniforms),this.blendMaterial=new ze({uniforms:this.copyUniforms,vertexShader:yt.vertexShader,fragmentShader:yt.fragmentShader,blending:jt,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new H,this._oldClearAlpha=1,this._basic=new Et,this._fsQuad=new Bo(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,o){let i=Math.round(e/2),n=Math.round(o/2);this.renderTargetBright.setSize(i,n);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,n),this.renderTargetsVertical[s].setSize(i,n),this.separableBlurMaterials[s].uniforms.invSize.value=new ye(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(e,o,i,n,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let p=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=p.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ze.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ze.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),p=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const o=[];for(let i=0;i<e;i++)o.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new ze({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ye(.5,.5)},direction:{value:new ye(.5,.5)},gaussianCoefficients:{value:o}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new ze({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Ze.BlurDirectionX=new ye(1,0);Ze.BlurDirectionY=new ye(0,1);function Ia(t,e,o,i={}){const n=t.capabilities.isWebGL2,s=t.getPixelRatio(),r=t.getSize(new ye),p=new qe(Math.max(1,Math.round(r.x*s)),Math.max(1,Math.round(r.y*s)),{type:n?Xe:Ot,samples:n?4:0,depthBuffer:!0,stencilBuffer:!1}),c=new Ea(t,p);c.setPixelRatio(s),c.setSize(r.x,r.y);const h=new Oa(e,o),a=new Ze(new ye(r.x,r.y),i.strength??.85,i.radius??.55,i.threshold??.72),u=new Ro({uniforms:{tDiffuse:{value:null},uTime:{value:0},uVelocity:{value:0},uLight:{value:0},uGrain:{value:i.grain??.045},uVignette:{value:i.vignette??.55},uAberration:{value:i.aberration??.0012},uWarp:{value:0},uFlash:{value:0},uFlashColor:{value:new H("#ffffff")},uAnamorphic:{value:0},uAnamorphicTint:{value:new H("#9fd8ff")}},vertexShader:ka,fragmentShader:Ma});return u.renderToScreen=!0,c.addPass(h),c.addPass(a),c.addPass(u),{render(v,l,f){u.uniforms.uTime.value=v,u.uniforms.uVelocity.value=l,c.render(),f&&(t.autoClear=!1,t.clearDepth(),t.render(f,o),t.autoClear=!0)},setFx(v){u.uniforms.uWarp.value=v.warp,u.uniforms.uFlash.value=v.flash,u.uniforms.uFlashColor.value.set(v.flashColor)},setAnamorphic(v,l){u.uniforms.uAnamorphic.value=v,u.uniforms.uAnamorphicTint.value.set(l)},resize(v,l,f){c.setPixelRatio(f),c.setSize(v,l)},setLight(v){a.enabled=!v,u.uniforms.uLight.value=v?1:0},dispose(){a.dispose(),u.dispose(),c.dispose(),p.dispose()}}}function De(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let o=e;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296}}function it(t){const e=Math.max(t(),1e-6);return Math.sqrt(-2*Math.log(e))*Math.cos(6.2831853*t())}const Ao=t=>.5-.5*Math.cos(Math.PI*Math.min(1,Math.max(0,t))),Ne=t=>1-Math.pow(1-Math.min(1,Math.max(0,t)),3),G=t=>t<0?0:t>1?1:t,qa=t=>t.getBoundingClientRect().top+window.scrollY,Ie=(t,e,o,i)=>t+(e-t)*(1-Math.exp(-i*o)),Me={galaxyStars:22e4,farStars:12e3,nebulae:12,dustLanes:5,octaves:5,ringDust:12e3,comets:7,planetSegments:[128,96],atmoSegments:[72,48],moonSegments:[48,32]};function Ha(){const e=De(1234567),o=new Uint8Array(256*256);for(let s=0;s<256*256;s++)o[s]=Math.floor(e()*256);const i=new Uint8Array(256*256*4);for(let s=0;s<256;s++)for(let r=0;r<256;r++){const p=s*256+r;i[p*4]=o[p],i[p*4+1]=o[(s+17&255)*256+(r+37&255)],i[p*4+2]=o[(s+91&255)*256+(r+113&255)],i[p*4+3]=255}const n=new Yo(i,256,256,Xo);return n.wrapS=St,n.wrapT=St,n.magFilter=nt,n.minFilter=nt,n.generateMipmaps=!1,n.needsUpdate=!0,n}function ja(t,e,o,i){const n=[],s=[],r=Ha();n.push(r);const p={uTime:{value:0},uPixel:{value:o},uLight:{value:e.light?1:0},tNoise:{value:r}},c=new xt,h=new D(new Ue(2,2));h.frustumCulled=!1,c.add(h);const a={scene:t,overlay:new xt,renderer:i,pal:e,bake:{scene:c,camera:new _o(-1,1,1,-1,0,1),quad:h,materials:new Map},common:p,track:u=>(n.push(u),u),blend:()=>a.pal.light?Gt:jt,shader(u,v=!0){const l=a.track(new ze({transparent:!0,depthWrite:!1,...u}));return v&&(l.blending=a.blend(),s.push(l)),l},quad:null,glow(u,v,l){const f=a.shader({vertexShader:pa,fragmentShader:va,uniforms:{...p,uColor:{value:new H(u)},uOpacity:{value:v}}}),b=new D(a.quad,f);return b.scale.set(l,l,1),b.frustumCulled=!1,b},retheme(u){a.pal=u,p.uLight.value=u.light?1:0,s.forEach(v=>{v.blending=a.blend(),v.needsUpdate=!0})},dispose(){n.forEach(u=>u.dispose()),n.length=0,a.bake.materials.forEach(u=>u.dispose()),a.bake.materials.clear(),h.geometry.dispose()}};return a.quad=a.track(new Ue(1,1)),a}function Uo(t,e){let o=t.bake.materials.get(e);return o||(o=new ze({vertexShader:da,fragmentShader:fa(5,e),depthTest:!1,depthWrite:!1,uniforms:{tNoise:t.common.tNoise,uA:{value:new H},uB:{value:new H},uSeed:{value:0},uPass:{value:0}}}),t.bake.materials.set(e,o)),o}async function Ga(t,e){const o=new xt,i=new Ue(2,2);for(const n of new Set(e.map(s=>s&3))){const s=new D(i,Uo(t,n));s.frustumCulled=!1,o.add(s)}await t.renderer.compileAsync(o,t.bake.camera).catch(()=>{}),i.dispose()}function Ut(t,e,o){const i=e.kind&3,n=Uo(t,i);n.uniforms.uA.value.set(e.a),n.uniforms.uB.value.set(e.b),n.uniforms.uSeed.value=e.seed,t.bake.quad.material=n;const s=o,r=o/2,p=new qe(s,r,{depthBuffer:!1,stencilBuffer:!1,type:Ot,generateMipmaps:!0,minFilter:Jo,magFilter:nt,wrapS:St,wrapT:yo}),c=new qe(s,r,{depthBuffer:!1,stencilBuffer:!1,type:t.renderer.capabilities.isWebGL2?Xe:Ot,generateMipmaps:!1,minFilter:nt,magFilter:nt,wrapS:St,wrapT:yo});p.texture.anisotropy=t.renderer.capabilities.getMaxAnisotropy();const h=t.renderer,a=h.getRenderTarget();return n.uniforms.uPass.value=0,h.setRenderTarget(p),h.render(t.bake.scene,t.bake.camera),n.uniforms.uPass.value=1,h.setRenderTarget(c),h.render(t.bake.scene,t.bake.camera),h.setRenderTarget(a),{albedo:p,data:c,size:o,dispose(){p.dispose(),c.dispose()}}}function Ka(t){const e={value:new H(t.pal.top)},o={value:new H(t.pal.bottom)},i=t.track(new ze({vertexShader:ga,fragmentShader:wa,depthTest:!1,depthWrite:!1,uniforms:{uTop:e,uBottom:o}})),n=new D(t.track(new Ue(2,2)),i);return n.frustumCulled=!1,n.renderOrder=-100,t.scene.add(n),{repaint(s){e.value.set(s.top),o.value.set(s.bottom)}}}function Qa(t,e=Me.galaxyStars,o=120){const i=De(7),n=new Float32Array(e*3),s=new Float32Array(e),r=new Float32Array(e),p=new Uint8Array(e),c=new Float32Array(e),h=4;for(let b=0;b<e;b++){const x=Math.min(o,-Math.log(1-i()*.985)*o/3.1),L=Math.floor(i()*h),d=L/h*Math.PI*2+x*.042+it(i)*(.2+x/o*.22),V=4.2*Math.exp(-x/22)+.9,B=1.4+x/o*2.6;n[b*3]=Math.cos(d)*x+it(i)*B,n[b*3+1]=it(i)*V,n[b*3+2]=Math.sin(d)*x+it(i)*B;const _=i();s[b]=.5+Math.pow(_,7)*4.2,r[b]=i(),p[b]=L,c[b]=G(x/48)*(.75+i()*.25)}const a=t.track(new Fe);a.setAttribute("position",new X(n,3)),a.setAttribute("aSize",new X(s,1)),a.setAttribute("aSeed",new X(r,1));const u=new X(new Float32Array(e*3),3);a.setAttribute("aColor",u);const v=b=>{const x=new H,L=new H(b.core),d=b.arms.map(_=>new H(_)),V=new H("#cfe3ff"),B=De(11);for(let _=0;_<e;_++){x.copy(L).lerp(d[p[_]%d.length],c[_]),B()<.035&&x.lerp(V,.7);const C=.55+B()*.45;u.setXYZ(_,x.r*C,x.g*C,x.b*C)}u.needsUpdate=!0};v(t.pal);const l=t.shader({vertexShader:ct,fragmentShader:ut,uniforms:{...t.common,uScale:{value:260}}}),f=new Ee(a,l);return f.frustumCulled=!1,t.scene.add(f),{points:f,material:l,repaint:v}}function $a(t,e=Me.farStars){const o=De(23),i=new Float32Array(e*3),n=new Float32Array(e),s=new Float32Array(e),r=new Float32Array(e*3);for(let h=0;h<e;h++){const a=o()*2-1,u=o()*Math.PI*2,v=Math.sqrt(1-a*a),l=1300+o()*500;i[h*3]=v*Math.cos(u)*l,i[h*3+1]=a*l,i[h*3+2]=v*Math.sin(u)*l,n[h]=3+Math.pow(o(),8)*10,s[h]=o();const f=.6+o()*.4;r[h*3]=f,r[h*3+1]=f*(.9+o()*.1),r[h*3+2]=f}const p=t.track(new Fe);p.setAttribute("position",new X(i,3)),p.setAttribute("aSize",new X(n,1)),p.setAttribute("aSeed",new X(s,1)),p.setAttribute("aColor",new X(r,3));const c=new Ee(p,t.shader({vertexShader:ct,fragmentShader:ut,uniforms:{...t.common,uScale:{value:420}}}));return c.frustumCulled=!1,t.scene.add(c),c}function Ya(t,e=Me.nebulae,o=Me.dustLanes,i=Me.octaves){const n=De(31),s=t.track(new Ue(1,1)),r=[],p=[],c=(a,u,v,l)=>{const f=new D(s,a),b=u/v*Math.PI*2+(l?1.9:.5),x=(l?18:26)+u%3*24;f.position.set(Math.cos(b)*x,(l?-1:-3)+u%2*4,Math.sin(b)*x),f.rotation.set(-Math.PI/2+(n()-.5)*.45,0,n()*Math.PI);const L=(l?60:80)+n()*50;f.scale.set(L,L*(.55+n()*.4),1),f.renderOrder=l?-2:-1,t.scene.add(f)};for(let a=0;a<e;a++){const u=t.shader({vertexShader:It,fragmentShader:qt(i),side:2,uniforms:{...t.common,uSeed:{value:a*7.13},uOpacity:{value:.28+n()*.18},uColA:{value:new H},uColB:{value:new H}}});r.push(u),c(u,a,e,!1)}for(let a=0;a<o;a++){const u=t.shader({vertexShader:It,fragmentShader:qt(Math.max(3,i-1)),side:2,blending:Gt,uniforms:{...t.common,uSeed:{value:50+a*3.7},uOpacity:{value:.55+n()*.25},uColA:{value:new H},uColB:{value:new H}}},!1);p.push(u),c(u,a,o,!0)}const h=a=>{r.forEach((v,l)=>{v.uniforms.uColA.value.set(a.arms[l%a.arms.length]),v.uniforms.uColB.value.set(a.arms[(l+1)%a.arms.length])});const u=new H(a.bottom).lerp(new H(a.light?"#8c94c8":"#000000"),a.light?.35:.65);p.forEach(v=>{v.uniforms.uColA.value.copy(u),v.uniforms.uColB.value.copy(u).multiplyScalar(a.light?1.1:.7)})};return h(t.pal),{repaint:h}}function Xa(t){const e=t.glow(t.pal.core,.38,150),o=t.glow(t.pal.arms[1],.22,70),i=t.glow("#ffffff",.5,26);t.scene.add(e,o,i);const n=s=>s.material.uniforms.uOpacity;return{setClose(s,r=1){n(e).value=.38*(1-s*.6)*r,n(o).value=.22*(1-s*.5)*r,n(i).value=.5*(1-s*.7)*r},repaint(s){e.material.uniforms.uColor.value.set(s.core),o.material.uniforms.uColor.value.set(s.arms[1])}}}function Ja(t){return{planet:t.track(new _e(1,Me.planetSegments[0],Me.planetSegments[1])),atmo:t.track(new _e(1,Me.atmoSegments[0],Me.atmoSegments[1])),cloud:t.track(new _e(1,96,64)),moon:t.track(new _e(1,Me.moonSegments[0],Me.moonSegments[1])),aurora:t.track(new ke(1,.16,12,96))}}function Po(t,e,o,i=0,n={size:2048,start:512}){const s=new N(e.x,e.y,e.z),{radius:r}=e,p=e.kind&3,c=new at;c.position.copy(s);const h=new N(s.x,0,s.z).normalize();h.lengthSq()||h.set(1,0,0);const a=new N(-h.z,0,h.x).multiplyScalar(i%2?1:-1),u=s.clone().add(h.clone().multiplyScalar(.55).add(a.multiplyScalar(1.1)).add(new N(0,.7,0)).normalize().multiplyScalar(600));let v=Ut(t,e,n.start??n.size);const l=t.track(new ze({vertexShader:Rt,fragmentShader:So(p),uniforms:{tNoise:t.common.tNoise,uTime:t.common.uTime,uA:{value:new H(e.a)},uB:{value:new H(e.b)},uLightPos:{value:u},uSeed:{value:e.seed},tAlbedo:{value:v.albedo.texture},tData:{value:v.data.texture},uTexel:{value:new ye(1/v.size,2/v.size)}}})),f=M=>{l.uniforms.tAlbedo.value=M.albedo.texture,l.uniforms.tData.value=M.data.texture,l.uniforms.uTexel.value.set(1/M.size,2/M.size)},b=new D(o.planet,l);b.scale.setScalar(r),b.rotation.z=.25+p%3*.12,c.add(b);const x=new D(o.atmo,t.track(new ze({vertexShader:ha,fragmentShader:ma,side:$o,transparent:!0,depthWrite:!1,blending:jt,uniforms:{uColor:{value:new H(e.b)},uLightPos:{value:u}}})));x.scale.setScalar(r*1.16),c.add(x),c.add(t.glow(e.b,p===3?.3:.22,r*(p===3?8:6.5)));let L=null;p===0&&(L=new D(o.cloud,t.track(new ze({vertexShader:Rt,fragmentShader:ba(4),transparent:!0,depthWrite:!1,uniforms:{tNoise:t.common.tNoise,uTime:t.common.uTime,uColor:{value:new H(e.b)},uLightPos:{value:u},uRadius:{value:r*1.025},uSeed:{value:e.seed+9.1}}}))),L.scale.setScalar(r*1.025),c.add(L));let d=null;if(p===1||p===2){const M=Me.ringDust,T=De(100+i+Math.floor(e.seed*10)),E=new Float32Array(M*3),K=new Float32Array(M),ue=new Float32Array(M),we=new Float32Array(M*3),ve=new H(e.a),be=new H(e.b),te=new H;for(let z=0;z<M;z++){const O=T()*Math.PI*2,S=T(),se=Math.abs(S-.55)<.04?.3:1,F=r*(1.55+S*.95);E[z*3]=Math.cos(O)*F,E[z*3+1]=it(T)*.05*r,E[z*3+2]=Math.sin(O)*F,K[z]=(.5+T()*.9)*se,ue[z]=T(),te.copy(ve).lerp(be,S),we[z*3]=te.r,we[z*3+1]=te.g,we[z*3+2]=te.b}const y=t.track(new Fe);y.setAttribute("position",new X(E,3)),y.setAttribute("aSize",new X(K,1)),y.setAttribute("aSeed",new X(ue,1)),y.setAttribute("aColor",new X(we,3)),d=new Ee(y,t.shader({vertexShader:ct,fragmentShader:ut,uniforms:{...t.common,uScale:{value:140}}})),d.rotation.set(.42-i%2*.2,0,.3),d.frustumCulled=!1,c.add(d)}let V=null;p===2&&(V=new D(o.aurora,t.shader({vertexShader:Kt,fragmentShader:ya,side:2,uniforms:{...t.common,uColor:{value:new H(e.b)},uSeed:{value:e.seed*1.3}}})),V.scale.setScalar(r*.62),V.position.y=r*.86,V.rotation.x=Math.PI/2,c.add(V));const B=[],_=[],C=p===0?2:p===3?1:0;for(let M=0;M<C;M++){const T=Ut(t,{a:"#9aa3b8",b:e.a,seed:40+i+M,kind:2},512);_.push(T);const E=t.track(new ze({vertexShader:Rt,fragmentShader:So(2),uniforms:{tNoise:t.common.tNoise,uTime:t.common.uTime,uA:{value:new H("#9aa3b8")},uB:{value:new H(e.a)},uLightPos:{value:u},uSeed:{value:40+i+M},tAlbedo:{value:T.albedo.texture},tData:{value:T.data.texture},uTexel:{value:new ye(1/512,2/512)}}})),K=new D(o.moon,E),ue=r*(.16+M*.07);K.scale.setScalar(ue),c.add(K),B.push({mesh:K,r:r*(2.1+M*.9),speed:.22-M*.07,phase:i+M*2.1,tilt:.3+M*.25})}t.scene.add(c);const J=.045+p%3*.02;return t.track({dispose(){v.dispose(),_.forEach(M=>M.dispose())}}),{group:c,planet:b,pos:s,radius:r,spin:J,keyLight:u,upgrade(){if(v.size>=n.size)return;const M=Ut(t,e,n.size);f(M),v.dispose(),v=M},update(M,T){b.rotation.y+=M*J,L&&(L.rotation.y+=M*J*1.35),d&&(d.rotation.y+=M*.02),V&&(V.rotation.z+=M*.15);for(const E of B){const K=E.phase+T*E.speed;E.mesh.position.set(Math.cos(K)*E.r,Math.sin(K)*E.r*Math.sin(E.tilt),Math.sin(K)*E.r*Math.cos(E.tilt))}}}}function Lt(t,e,o,i,n=77){const s=De(n),r=new Float32Array(i*3),p=new Float32Array(i),c=new Float32Array(i),h=new Float32Array(i*3);for(let v=0;v<i;v++){r[v*3]=e.x+(s()-.5)*2*o.x,r[v*3+1]=e.y+(s()-.5)*2*o.y,r[v*3+2]=e.z+(s()-.5)*2*o.z,p[v]=.25+Math.pow(s(),4)*1.4,c[v]=s();const l=.5+s()*.5;h[v*3]=l,h[v*3+1]=l,h[v*3+2]=l*(.9+s()*.1)}const a=t.track(new Fe);a.setAttribute("position",new X(r,3)),a.setAttribute("aSize",new X(p,1)),a.setAttribute("aSeed",new X(c,1)),a.setAttribute("aColor",new X(h,3));const u=new Ee(a,t.shader({vertexShader:ct,fragmentShader:ut,uniforms:{...t.common,uScale:{value:60}}}));return u.frustumCulled=!1,t.scene.add(u),u}function Za(t,e=Me.comets){const i=e*30,n=new Float32Array(i*3),s=new Float32Array(i),r=new Float32Array(i),p=new Float32Array(i*3),c=De(91),h=[],a=b=>{const x=c()*2-1,L=c()*Math.PI*2,d=Math.sqrt(1-x*x),V=170+c()*170;b.a.set(d*Math.cos(L)*V,x*V*.45+12,d*Math.sin(L)*V),b.d.set(c()-.5,(c()-.5)*.35,c()-.5).normalize(),b.speed=45+c()*55,b.life=4+c()*5,b.t=-c()*7};for(let b=0;b<e;b++){const x={a:new N,d:new N,t:0,speed:0,life:1};a(x),h.push(x);for(let L=0;L<30;L++){const d=b*30+L;s[d]=2.4-L*.07,r[d]=c(),p[d*3]=.85,p[d*3+1]=.93,p[d*3+2]=1}}const u=t.track(new Fe),v=new X(n,3);v.setUsage(35048),u.setAttribute("position",v),u.setAttribute("aSize",new X(s,1)),u.setAttribute("aSeed",new X(r,1)),u.setAttribute("aColor",new X(p,3));const l=new Ee(u,t.shader({vertexShader:ct,fragmentShader:ut,uniforms:{...t.common,uScale:{value:260}}}));l.frustumCulled=!1,t.scene.add(l);const f=new N;return{update(b){h.forEach((x,L)=>{x.t+=b,x.t>x.life&&a(x);const d=x.t>0;f.copy(x.a).addScaledVector(x.d,x.speed*Math.max(0,x.t));for(let V=0;V<30;V++){const B=L*30+V;d?(n[B*3]=f.x-x.d.x*V*1.1,n[B*3+1]=f.y-x.d.y*V*1.1,n[B*3+2]=f.z-x.d.z*V*1.1):(n[B*3]=1e5,n[B*3+1]=1e5,n[B*3+2]=1e5)}}),v.needsUpdate=!0}}}const es=16e4,pe=2,Vo=7;function ts(t){const e=getComputedStyle(t);return t.classList.contains("gradient-text")||e.backgroundClip==="text"||e.webkitBackgroundClip==="text"}function os(t){const e=[],o=[],i=new Map,n=l=>{let f=l;for(;f&&f!==t.parentElement;){let b=i.get(f);if(b===void 0&&(b=ts(f),i.set(f,b)),b)return!0;f=f.parentElement}return!1},s=[],r=l=>{l.childNodes.forEach(f=>{f.nodeType===Node.TEXT_NODE?(f.textContent||"").trim()&&s.push(f):f.nodeType===Node.ELEMENT_NODE&&r(f)})};r(t);for(const l of s){const f=l.parentNode;if(!f)continue;const b=n(f),x=document.createDocumentFragment(),L=[];for(const d of(l.textContent||"").split(/(\s+)/))if(d)if(/^\s+$/.test(d)){const V=document.createTextNode(d);x.appendChild(V),L.push(V)}else{const V=document.createElement("span");V.textContent=d,x.appendChild(V),L.push(V),o.push({span:V,text:d,gradient:b})}f.replaceChild(x,l),e.push({parent:f,original:l,inserted:L})}const p=t.getBoundingClientRect(),c=[];for(const l of o){const f=Array.from(l.span.getClientRects());if(!f.length)continue;let b=f[0];for(const x of f)x.width*x.height>b.width*b.height&&(b=x);b.width<.5||b.height<.5||c.push({text:l.text,gradient:l.gradient,x:b.left-p.left,y:b.top-p.top,w:b.width,h:b.height})}for(const{parent:l,original:f,inserted:b}of e)l.insertBefore(f,b[0]),b.forEach(x=>x.remove());if(!c.length)return null;const h=Math.min(...c.map(l=>l.x)),a=Math.min(...c.map(l=>l.y)),u=Math.max(...c.map(l=>l.x+l.w)),v=Math.max(...c.map(l=>l.y+l.h));return{words:c,left:h,top:a,width:u-h,height:v-a}}function as(t,e){const o=os(t);if(!o)return null;const i=getComputedStyle(t),n=parseFloat(i.fontSize)||48,s=n*pe,r=i.fontWeight||"700",p=i.fontFamily||"sans-serif",c=(parseFloat(i.letterSpacing)||0)*pe,h=i.color&&i.color!=="rgba(0, 0, 0, 0)"?i.color:"#ffffff",a=4,u=Math.ceil(o.width*pe)+a*2,v=Math.ceil(o.height*pe)+a*2;if(u>4096||v>4096||u<2||v<2)return null;const l=document.createElement("canvas");l.width=u,l.height=v;const f=l.getContext("2d",{willReadFrequently:!0});if(!f)return null;f.font=`${r} ${s}px ${p}`;const b=f;"letterSpacing"in b&&(b.letterSpacing=`${c}px`),b.direction=i.direction==="rtl"?"rtl":"ltr",f.textBaseline="alphabetic",f.textAlign="left";const x=f.measureText("Hg"),L=x.fontBoundingBoxAscent||s*.78,d=x.fontBoundingBoxDescent||s*.22;for(const E of o.words){const K=(E.x-o.left)*pe+a,we=(E.y-o.top)*pe+a+(E.h*pe-(L+d))/2+L;if(E.gradient){const ve=f.createLinearGradient(K,0,K+E.w*pe,0);e.forEach((be,te)=>ve.addColorStop(e.length>1?te/(e.length-1):0,be)),f.fillStyle=ve}else f.fillStyle=h;f.fillText(E.text,K,we)}const V=f.getImageData(0,0,u,v).data;let B=Math.max(1,Math.round(Math.min(3,Math.max(1,n/40))*pe)),_=0;for(;;){_=0;for(let E=0;E<v;E+=B)for(let K=0;K<u;K+=B)V[(E*u+K)*4+3]>96&&_++;if(_<=es||B>=12)break;B++}const C=new Float32Array(_*3),J=new Float32Array(_*3),M=De(_+u);let T=0;for(let E=0;E<v;E+=B)for(let K=0;K<u;K+=B){const ue=(E*u+K)*4;V[ue+3]<=96||(C[T*3]=(K-u/2+(M()-.5)*.5*B)/pe,C[T*3+1]=(v/2-E+(M()-.5)*.5*B)/pe,C[T*3+2]=(M()-.5)*1.2,J[T*3]=V[ue]/255,J[T*3+1]=V[ue+1]/255,J[T*3+2]=V[ue+2]/255,T++)}return{positions:C,colors:J,count:_,w:u/pe,h:v/pe,offX:o.left-a/pe,offY:o.top-a/pe,stride:B/pe,cssSize:n}}function ss(t,e,o,i){const n=o.map(l=>({el:l,points:null,mat:null,lens:null,lensMat:null,assemble:0,width:0,blockW:0,blockH:0,offX:0,offY:0,stride:1,cssSize:48,travel:1})),s=new N,r=new N,p=new N,c=new N,h=new N,a=l=>{l.points&&(t.overlay.remove(l.points),l.points.geometry.dispose(),l.mat?.dispose(),l.points=null,l.mat=null);const f=as(l.el,i);if(!f||!f.count)return;const b=new Fe;b.setAttribute("position",new X(f.positions,3)),b.setAttribute("aColor",new X(f.colors,3));const x=new Float32Array(f.count),L=new Float32Array(f.count*3),d=De(f.count*7+3),V=Math.max(f.w,f.h)*1.6;for(let C=0;C<f.count;C++){x[C]=d();const J=d()*2-1,M=d()*Math.PI*2,T=Math.sqrt(1-J*J),E=V*(.5+d()*.8);L[C*3]=T*Math.cos(M)*E,L[C*3+1]=J*E*.6,L[C*3+2]=T*Math.sin(M)*E*.35}b.setAttribute("aSeed",new X(x,1)),b.setAttribute("aScatter",new X(L,3));const B=t.shader({vertexShader:za,fragmentShader:Ca,depthTest:!1,uniforms:{...t.common,uAssemble:{value:0},uScale:{value:1},uOrigin:{value:new N},uRight:{value:new N(1,0,0)},uUp:{value:new N(0,1,0)},uFwd:{value:new N(0,0,-1)},uSize:{value:2.4},uAlpha:{value:1},uTravel:{value:26}}}),_=new Ee(b,B);if(_.frustumCulled=!1,_.renderOrder=20,_.visible=!1,t.overlay.add(_),l.points=_,l.mat=B,!l.lens){const C=t.shader({vertexShader:Ta,fragmentShader:Aa,depthTest:!1,blending:Gt,uniforms:{uOrigin:{value:new N},uRight:{value:new N(1,0,0)},uUp:{value:new N(0,1,0)},uW:{value:1},uH:{value:1},uColor:{value:new H(t.pal.top)},uOpacity:{value:0}}},!1),J=new D(t.quad,C);J.frustumCulled=!1,J.renderOrder=19,J.visible=!1,t.overlay.add(J),l.lens=J,l.lensMat=C}l.width=l.el.clientWidth,l.blockW=f.w,l.blockH=f.h,l.offX=f.offX,l.offY=f.offY,l.stride=f.stride,l.cssSize=f.cssSize},u=document.fonts?.ready??Promise.resolve();let v=!1;return u.then(()=>{n.forEach(a),v=!0}),{refresh(){v&&n.forEach(a)},update(l,f,b,x){if(!v)return;e.updateMatrixWorld(),p.setFromMatrixColumn(e.matrixWorld,0).normalize(),c.setFromMatrixColumn(e.matrixWorld,1).normalize(),h.setFromMatrixColumn(e.matrixWorld,2).normalize().multiplyScalar(-1);const L=2*Vo*Math.tan(e.fov*Math.PI/360)/x;for(const d of n){if(!d.points||!d.mat||(Math.abs(d.el.clientWidth-d.width)>d.width*.08&&a(d),!d.points||!d.mat))continue;const V=d.el.getBoundingClientRect(),B=V.bottom>-x*.6&&V.top<x*1.6,_=V.top+V.height/2,C=d.el.closest("[data-build-item]"),J=C?C.dataset.state==="active":!0,M=J?1-G((Math.abs(_-x/2)-x*.34)/(x*.22)):0,T=B?M:0;d.assemble<.02?d.travel=1:d.assemble>.98&&(d.travel=-1),d.assemble=Ie(d.assemble,T,J?3.2:4.5,l);const E=B&&d.assemble>.004;if(d.points.visible=E,d.lens&&(d.lens.visible=E),!E)continue;const K=V.left+d.offX,ue=V.top+d.offY,we=(K+d.blockW/2)/b*2-1,ve=-((ue+d.blockH/2)/x*2-1);s.set(we,ve,.5).unproject(e),r.copy(s).sub(e.position).normalize();const be=Vo/Math.max(.2,r.dot(h)),te=d.mat.uniforms;if(te.uOrigin.value.copy(e.position).addScaledVector(r,be),te.uRight.value.copy(p),te.uUp.value.copy(c),te.uFwd.value.copy(h),te.uScale.value=L,te.uAssemble.value=d.assemble,te.uTravel.value=d.travel>0?26:-9,d.lensMat){const y=d.lensMat.uniforms;y.uOrigin.value.copy(te.uOrigin.value).addScaledVector(h,.4),y.uRight.value.copy(p),y.uUp.value.copy(c),y.uW.value=d.blockW*L*1.9,y.uH.value=d.blockH*L*2.6,y.uColor.value.set(t.pal.top),y.uOpacity.value=.86*G(d.assemble*1.4)}te.uSize.value=Math.max(1.6,d.stride*1.8),te.uAlpha.value=G(d.assemble*1.6)}},dispose(){for(const l of n)l.points&&(t.overlay.remove(l.points),l.points.geometry.dispose(),l.mat?.dispose()),l.lens&&t.overlay.remove(l.lens);n.length=0}}}const is={"approval-gate":{gate:"valve",parts:[{kind:"cubes",at:.08,n:3,side:-3.4,up:.6,size:1},{kind:"shield",at:.5,side:0,up:2.6,size:2.2},{kind:"orbs",at:.86,n:1,side:3.2,up:1,size:1.6,tint:"green"}]},"encrypted-vault":{gate:"ring",parts:[{kind:"rings",at:.45,n:3,side:0,up:3.4,size:5.5,spin:.35},{kind:"cubes",at:.45,n:1,side:0,up:3.4,size:1.2,tint:"white"},{kind:"plates",at:.82,n:2,side:-4,up:1.2,size:3}]},"document-stack":{gate:"square",parts:[{kind:"plates",at:.25,n:3,side:-3.6,up:1.4,size:4,fan:!0},{kind:"sheet",at:.7,side:3.4,up:1.2,size:5.5,tint:"white"}]},"packaging-dieline":{gate:"square",parts:[{kind:"plates",at:.18,n:4,side:-4.2,up:.6,size:2.6,flat:!0},{kind:"box",at:.62,side:3.2,up:.4,size:3.6}]},"cake-production":{gate:"ring",parts:[{kind:"stack",at:.3,n:3,side:-5.6,up:-1.6,size:2.4},{kind:"orbs",at:.7,n:8,side:3.6,up:1.8,size:.7,spread:6,spin:.5}]},"audit-locker":{gate:"hex",parts:[{kind:"shield",at:.18,side:-3.4,up:2.2,size:2.4,tint:"green"},{kind:"bars",at:.55,n:3,side:3.4,up:.3,size:5,flat:!0},{kind:"rings",at:.55,n:2,side:1.2,up:1.6,size:1.2,spin:.8}]},"mft-radar":{gate:"ring",parts:[{kind:"dish",at:.45,side:0,up:.2,size:6.5,spin:.9},{kind:"orbs",at:.7,n:9,side:0,up:.6,size:.4,spread:8.5,spin:.15}]},"ration-matrix":{gate:"square",parts:[{kind:"grid",at:.25,side:-3.8,up:1.8,size:6},{kind:"orbs",at:.5,n:1,side:0,up:2.4,size:1.5,tint:"white"},{kind:"bars",at:.72,n:3,side:3.8,up:0,size:4}]},"page-fitter":{gate:"square",parts:[{kind:"sheet",at:.3,side:-4,up:1,size:4.6,tint:"white"},{kind:"orbs",at:.55,n:1,side:0,up:2.6,size:1.2},{kind:"sheet",at:.8,side:4,up:1,size:3.4,tint:"white"}]},"sim-tick":{gate:"ring",parts:[{kind:"grid",at:.22,side:0,up:-1.6,size:12,flat:!0},{kind:"rings",at:.55,n:1,side:0,up:2.4,size:2.4,spin:1.4},{kind:"orbs",at:.55,n:6,side:0,up:2.4,size:.35,spread:4.6,spin:1.2}]},"texture-transfer":{gate:"ring",parts:[{kind:"orbs",at:.3,n:1,side:-4.2,up:2.2,size:2.4},{kind:"arc",at:.5,side:0,up:2.4,size:8.5},{kind:"orbs",at:.75,n:1,side:4.2,up:2.2,size:2.4,tint:"white"}]},"artillery-graph":{gate:"ring",parts:[{kind:"arc",at:.35,side:0,up:1,size:11},{kind:"orbs",at:.55,n:1,side:0,up:5.8,size:.8,tint:"amber"},{kind:"cubes",at:.8,n:3,side:3,up:.4,size:1}]},"module-blueprint":{gate:"hex",parts:[{kind:"cubes",at:.3,n:5,side:-3.6,up:1.6,size:1.3,spread:9},{kind:"lattice",at:.55,side:3.4,up:2,size:7}]},"restoration-layers":{gate:"square",parts:[{kind:"plates",at:.25,n:1,side:-4.6,up:1.5,size:3.2},{kind:"plates",at:.5,n:1,side:0,up:1.5,size:3.2,tint:"white"},{kind:"plates",at:.75,n:1,side:4.6,up:1.5,size:3.2}]},"world-audit":{gate:"ring",parts:[{kind:"orbs",at:.3,n:3,side:0,up:1.4,size:2,spread:11,spin:.08},{kind:"arc",at:.6,side:0,up:1.4,size:11}]},"evidence-ledger":{gate:"square",parts:[{kind:"plates",at:.22,n:3,side:-4,up:1.2,size:3,fan:!0},{kind:"rings",at:.55,n:2,side:0,up:2.6,size:2.6,spin:.6},{kind:"cubes",at:.85,n:1,side:3.8,up:1.4,size:1.3,tint:"green"}]},"theme-engine":{gate:"ring",parts:[{kind:"plates",at:.4,n:7,side:0,up:2,size:3,spread:9,fan:!0,spin:.25},{kind:"orbs",at:.7,n:1,side:0,up:2,size:1.3,tint:"white"}]},"citation-chain":{gate:"square",parts:[{kind:"plates",at:.2,n:3,side:-4.2,up:1.2,size:3.4},{kind:"lattice",at:.5,side:0,up:2,size:6},{kind:"sheet",at:.8,side:4.2,up:1.2,size:4,tint:"white"}]},"signed-gate":{gate:"hex",parts:[{kind:"cubes",at:.15,n:3,side:-3.6,up:.8,size:1.2},{kind:"shield",at:.5,side:0,up:2.4,size:2.2,tint:"white"},{kind:"cubes",at:.8,n:5,side:3.6,up:.6,size:.9,spread:7}]},"webhook-relay":{gate:"ring",parts:[{kind:"towers",at:.3,n:3,side:-3.2,up:0,size:6,spread:9},{kind:"cubes",at:.5,n:4,side:0,up:1,size:.7,spread:8,spin:.7},{kind:"plates",at:.85,n:1,side:3.8,up:1.4,size:3.4,tint:"white"}]},"forecast-duel":{gate:"ring",parts:[{kind:"wave",at:.35,side:0,up:0,size:12},{kind:"wave",at:.5,side:0,up:2.4,size:12,tint:"amber"},{kind:"bars",at:.85,n:1,side:4,up:0,size:2.4,tint:"red"}]},"spaceframe-lattice":{gate:"square",parts:[{kind:"lattice",at:.3,side:-3.4,up:2,size:8},{kind:"lattice",at:.55,side:3.4,up:2,size:8},{kind:"bars",at:.85,n:2,side:0,up:0,size:3,tint:"amber"}]},"macro-timeline":{gate:"square",parts:[{kind:"orbs",at:.1,n:1,side:-4,up:3,size:.9,tint:"red"},{kind:"towers",at:.4,n:5,side:0,up:0,size:3.5,spread:12},{kind:"cubes",at:.85,n:1,side:4,up:1.2,size:1.2,tint:"green"}]},"quote-sheet":{gate:"square",parts:[{kind:"cubes",at:.2,n:2,side:-4.2,up:1.2,size:1.4},{kind:"sheet",at:.55,side:0,up:1.2,size:6,tint:"white"},{kind:"orbs",at:.85,n:1,side:4,up:1.4,size:1.1,tint:"amber"}]},"ocr-grid":{gate:"square",parts:[{kind:"grid",at:.25,side:-3.8,up:2,size:6},{kind:"arc",at:.5,side:0,up:1.6,size:5},{kind:"sheet",at:.75,side:3.8,up:1.2,size:5,tint:"green"}]},"prompt-storyboard":{gate:"ring",parts:[{kind:"plates",at:.35,n:4,side:0,up:1.8,size:3,spread:12,fan:!0},{kind:"arc",at:.8,side:0,up:.6,size:9}]},"voice-wave":{gate:"ring",parts:[{kind:"wave",at:.4,side:0,up:0,size:14,spin:1.6},{kind:"cubes",at:.82,n:2,side:3.8,up:1,size:1.1,tint:"green"}]},"multicam-sync":{gate:"square",parts:[{kind:"bars",at:.35,n:3,side:0,up:.4,size:9,flat:!0},{kind:"towers",at:.6,n:1,side:0,up:0,size:6,tint:"amber"}]},"paper-intake":{gate:"square",parts:[{kind:"sheet",at:.22,side:-4,up:1.2,size:5,tint:"white"},{kind:"cubes",at:.55,n:3,side:0,up:1.2,size:1.2,spread:6},{kind:"shield",at:.85,side:4,up:2.2,size:2,tint:"green"}]},"legacy-meta-ads":{gate:"ring",parts:[{kind:"bars",at:.3,n:5,side:-3.6,up:0,size:5},{kind:"sheet",at:.75,side:3.8,up:1.2,size:4.4,tint:"white"}]},"legacy-al-maali":{gate:"ring",parts:[{kind:"spiral",at:.35,side:0,up:0,size:9},{kind:"orbs",at:.75,n:6,side:0,up:2,size:.5,spread:7,spin:.4}]},"legacy-crm":{gate:"square",parts:[{kind:"plates",at:.3,n:4,side:-3.6,up:1.6,size:3.2,fan:!0},{kind:"grid",at:.7,side:3.6,up:2,size:6}]},"legacy-brand-system":{gate:"ring",parts:[{kind:"plates",at:.4,n:8,side:0,up:2,size:2.6,spread:14,fan:!0,spin:.12}]},"legacy-sheep-app":{gate:"square",parts:[{kind:"box",at:.35,side:-3.4,up:.4,size:3.4},{kind:"cubes",at:.8,n:3,side:3.6,up:.6,size:1,tint:"green"}]},"legacy-hr-system":{gate:"hex",parts:[{kind:"towers",at:.25,n:3,side:-3.4,up:0,size:5,spread:8},{kind:"lattice",at:.55,side:2,up:2,size:6},{kind:"cubes",at:.85,n:1,side:4,up:1.2,size:1.3,tint:"white"}]},"legacy-medmac-website":{gate:"ring",parts:[{kind:"dish",at:.4,side:-2,up:.2,size:6,spin:.6},{kind:"sheet",at:.8,side:4,up:1.4,size:5.5,tint:"white"}]},"legacy-ai-workflow":{gate:"ring",parts:[{kind:"orbs",at:.4,n:3,side:0,up:2.2,size:1.6,spread:7.5,spin:.35},{kind:"rings",at:.4,n:1,side:0,up:2.2,size:3.8,spin:.2}]},"legacy-my-resume":{gate:"square",parts:[{kind:"lattice",at:.35,side:-3.4,up:2,size:7},{kind:"plates",at:.75,n:3,side:3.6,up:1.4,size:3,fan:!0}]}},ns={gate:"ring",parts:[{kind:"plates",at:.3,n:3,side:-3.6,up:1.4,size:3.2,fan:!0},{kind:"orbs",at:.7,n:5,side:3.4,up:1.6,size:.6,spread:6,spin:.4}]},Ht="#ffc36b";function Je(t,e,o=!1){return t.shader({vertexShader:Kt,fragmentShader:Sa,side:o?rt:ea,uniforms:{uTime:t.common.uTime,uLight:t.common.uLight,uColor:{value:e.clone()},uRise:{value:0},uHot:{value:0}}})}function rs(t){const{world:e,curve:o,side:i,up:n,a:s,b:r,seed:p}=t,c=is[t.visual]??ns,h=De(Math.floor(p*1e3)+13),a=new at;e.scene.add(a);const u=y=>{switch(y){case"a":return s;case"amber":return new H(Ht);case"green":return new H("#8ff0ae");case"red":return new H("#ff7a6b");case"white":return new H("#e8ecff");default:return r}},v=new N,l=y=>o.getTangentAt(G(y),v).clone().normalize(),f=y=>t.span[0]+(t.span[1]-t.span[0])*y,b=(y,z=0,O=0)=>o.getPointAt(G(f(y))).addScaledVector(i,z).addScaledVector(n,O),x=(y,z)=>{const O=l(z);y.lookAt(y.position.clone().add(O))},L=[],d=[],V=[],B=[],_=[],C=[],J=e.track(new Zo(2.3,5.6,96,1)),M=e.track(new ke(6.4,.1,8,96)),T=(()=>{switch(c.gate){case"hex":return e.track(new ke(6.6,.26,10,6));case"square":case"diamond":return e.track(new ke(7.2,.26,10,4));default:return e.track(new ke(6.4,.24,12,96))}})(),E=e.track(new ke(5.1,.08,8,96)),K=e.track(new Te(9.6,.26,.26));t.gateT.forEach((y,z)=>{const O=new at;O.position.copy(o.getPointAt(G(y))),x(O,y);const S=Je(e,r);S.uniforms.uRise.value=1;const se=new D(T,S);c.gate==="square"&&(se.rotation.z=Math.PI/4),O.add(se);const F=new D(E,S);if(F.rotation.z=z*.7,O.add(F),c.gate==="valve"){const Y=new D(K,S);O.add(Y),B.push(Y)}const ee=e.glow(r.getStyle(),0,20);O.add(ee),V.push(ee);const xe=[];[17,19].forEach((Y,Se)=>{const w=e.shader({vertexShader:Pa,fragmentShader:Va,side:rt,uniforms:{uLight:e.common.uLight,uColor:{value:(Se?s:r).clone()},uPhase:{value:0},uSpokes:{value:Y},uHot:{value:0}}}),k=new D(J,w);k.position.z=(Se-.5)*.25,O.add(k),xe.push(w)}),_.push(xe);const $=Je(e,r);$.uniforms.uRise.value=0;const fe=new D(M,$);O.add(fe),C.push({mesh:fe,mat:$}),d.push(S),L.push(O),a.add(O)});const ue=[];let we=null;const ve=(y,z)=>e.track(new Te(y,z,.08)),be=y=>{const z=new at,O=y.n??1,S=y.size??3,se=y.spread??4,F=u(y.tint),ee=[],xe=[],$=[],fe=["plates","sheet","box"],Y=()=>{const w=Je(e,F,fe.includes(y.kind));return ee.push(w),w},Se=()=>{const w=e.track(new Do({color:F,transparent:!0,opacity:0,depthWrite:!1,blending:e.blend()}));return xe.push(w),w};switch(z.position.copy(b(y.at,y.side??0,y.up??0)),x(z,f(y.at)),y.kind){case"plates":{const w=ve(S*1.5,S);for(let k=0;k<O;k++){const P=new D(w,Y());if(y.fan&&O>2){const R=(k-(O-1)/2)/Math.max(1,O-1)*1.6;P.position.set(Math.sin(R)*se*.5,Math.cos(R)*se*.18,-Math.abs(Math.sin(R))*.6),P.rotation.z=-R*.5,P.rotation.y=R*.35}else y.flat?(P.position.set((k-(O-1)/2)*S*1.6,0,0),P.rotation.x=-Math.PI/2):(P.position.set((k-(O-1)/2)*S*.55,k*.28,-k*.5),P.rotation.y=.18*(k-(O-1)/2));z.add(P)}break}case"sheet":{const w=new D(ve(S*.72,S),Y());z.add(w);const k=new D(e.track(new Te(S*.16,S*.16,.12)),Y());k.position.set(S*.24,S*.36,.06),z.add(k);for(let P=0;P<4;P++){const R=new D(e.track(new Te(S*(.5-P*.06),.05,.1)),Y());R.position.set(-S*.08,S*(.12-P*.16),.06),z.add(R)}break}case"towers":{for(let w=0;w<O;w++){const k=S*(.7+w*7%4*.15),P=e.track(new Te(.5,k,.5));P.translate(0,k/2,0);const R=new D(P,Y());R.position.set(0,0,(w-(O-1)/2)*(se/Math.max(1,O-1)||0)),z.add(R);const ie=new D(e.track(new _e(.28,16,12)),Y());ie.position.set(0,k+.4,R.position.z),z.add(ie)}break}case"rings":{for(let w=0;w<O;w++){const k=new D(e.track(new ke(S*(.5+w*.38),.07+w*.02,10,96)),Y());k.rotation.x=.5+w*.6,k.rotation.y=w*.4,z.add(k),$.push(k)}break}case"lattice":{const w=[];for(let ne=0;ne<14;ne++)w.push(new N((h()-.5)*S,(h()-.5)*S*.8,(h()-.5)*S*.6));const P=[];for(let ne=0;ne<14;ne++){const Ce=w.map((re,le)=>({j:le,d:re.distanceTo(w[ne])})).filter(re=>re.j!==ne).sort((re,le)=>re.d-le.d).slice(0,3);for(const{j:re}of Ce)P.push(w[ne].x,w[ne].y,w[ne].z,w[re].x,w[re].y,w[re].z)}const R=e.track(new Fe);R.setAttribute("position",new X(new Float32Array(P),3)),z.add(new Wt(R,Se()));const ie=e.track(new _e(.16,10,8)),oe=Y();for(const ne of w){const Ce=new D(ie,oe);Ce.position.copy(ne),z.add(Ce)}break}case"stack":{we=z;let w=0;for(let k=0;k<O;k++){const P=S*(.55-k*.14),R=S*.34,ie=e.track(new xo(P,P,R,48,1));ie.translate(0,R/2,0);const oe=new D(ie,Y());oe.position.y=w,w+=R*1.02,z.add(oe)}break}case"box":{const w=S,k=e.track(new Ue(w,w)),P=Y(),R=new D(k,P);R.rotation.x=-Math.PI/2,z.add(R),[[0,0,w/2],[0,0,-w/2],[w/2,0,0],[-w/2,0,0]].forEach(([oe,,ne],Ce)=>{const re=new at;re.position.set(oe,0,ne),re.rotation.y=Ce<2?0:Math.PI/2;const le=new D(k,P);le.position.set(0,0,(Ce%2?-1:1)*(w/2)),le.rotation.x=-Math.PI/2,re.add(le),re.userData.dir=Ce%2?-1:1,z.add(re),$.push(re)});break}case"orbs":{const w=e.track(new _e(S*.45,32,24));for(let k=0;k<O;k++){const P=new D(w,Y());if(O>1){const R=k/O*Math.PI*2;P.position.set(Math.cos(R)*se*.5,Math.sin(R*2)*.4,Math.sin(R)*se*.5)}z.add(P)}break}case"bars":{for(let w=0;w<O;w++){const k=S*(.35+(w*5%3+1)*.22),P=y.flat?e.track(new Te(S*1.2,.38,.38)):e.track(new Te(.7,k,.7));y.flat||P.translate(0,k/2,0);const R=new D(P,Y());y.flat?R.position.set(0,w*.9,0):R.position.set((w-(O-1)/2)*1.1,0,0),z.add(R)}break}case"dish":{for(let P=0;P<3;P++){const R=new D(e.track(new ke(S*(.22+P*.22),.06,8,96)),Y());R.rotation.x=Math.PI/2,z.add(R)}const w=e.track(new Te(S*.66,.06,.12));w.translate(S*.33,0,0);const k=new D(w,Y());z.add(k),$.push(k);break}case"grid":{const w=[];for(let ie=0;ie<=8;ie++){const oe=(ie/8-.5)*S;w.push(-S/2,oe,0,S/2,oe,0,oe,-S/2,0,oe,S/2,0)}const P=e.track(new Fe);P.setAttribute("position",new X(new Float32Array(w),3));const R=new Wt(P,Se());y.flat&&(R.rotation.x=-Math.PI/2),z.add(R);break}case"wave":{for(let k=0;k<24;k++){const P=e.track(new Te(S/24*.55,1,S/24*.55));P.translate(0,.5,0);const R=new D(P,Y());R.position.set((k/23-.5)*S,0,0),R.userData.i=k,z.add(R),$.push(R)}break}case"spiral":{const w=[];for(let ie=0;ie<=60;ie++){const oe=ie/60,ne=oe*Math.PI*5;w.push(new N(Math.cos(ne)*S*.35*(1-oe*.4),oe*S*.9,Math.sin(ne)*S*.35*(1-oe*.4)))}const k=new st(w),P=new D(e.track(new Fo(k,180,.12,8,!1)),Y());z.add(P);const R=new D(e.track(new _e(.5,20,16)),Y());R.position.copy(w[w.length-1]),z.add(R);break}case"shield":{const w=e.track(new xo(S*.6,S*.6,.32,6,1)),k=new D(w,Y());k.rotation.x=Math.PI/2,z.add(k);const P=new D(e.track(new _e(S*.2,20,16)),Y());z.add(P);const R=new D(e.track(new ke(S*.8,.05,8,64)),Y());z.add(R),$.push(R);break}case"arc":{const w=new D(e.track(new ke(S*.5,.08,10,80,Math.PI)),Y());z.add(w);const k=new D(e.track(new _e(.34,16,12)),Y());k.position.set(-S*.5,0,0),z.add(k);break}case"cubes":{const w=e.track(new Te(S,S,S));for(let k=0;k<O;k++){const P=new D(w,Y());P.position.set(0,k%2*S*.4,(k-(O-1)/2)*(O>1?se/(O-1):0)),P.rotation.y=k*.5,z.add(P),$.push(P)}break}}z.scale.setScalar(.001),a.add(z),ue.push({obj:z,at:y.at,spin:y.spin??0,mats:ee,lines:xe,kind:y.kind,extra:$})};c.parts.forEach(be);const te=t.gateT.length;return{group:a,gates:L,stackAnchor:we,update(y,z,O=1){let S=0,se=0;for(let F=0;F<te;F++){const ee=y*Math.max(1,te-1)-F,xe=G((ee+.3)/.35)*O,$=Ne(xe);d[F].uniforms.uHot.value=$*(.6+.4*(.5+.5*Math.sin(z*2.4+F))),V[F].material.uniforms.uOpacity.value=$*.22,L[F].children[1].rotation.z+=.004+$*.02,B[F]&&(B[F].rotation.z=$*(Math.PI/2)),_[F][0].uniforms.uPhase.value=y*6+z*.02,_[F][1].uniforms.uPhase.value=-y*6-z*.017,_[F][0].uniforms.uHot.value=$,_[F][1].uniforms.uHot.value=$;const fe=G(ee/.5),Y=1+Ne(fe)*2.6;C[F].mesh.scale.set(Y,Y,1),C[F].mat.uniforms.uRise.value=fe>0&&fe<1?(1-fe)*.9:0,C[F].mat.uniforms.uHot.value=1;const Se=Math.exp(-Math.abs(ee)*7);Se>S&&(S=Se),Se>se&&(se=Se)}for(const F of ue){const ee=Ne(G((y-(F.at*.92-.24))/.16)),xe=.001+ee*.999;F.obj.scale.setScalar(xe);for(const $ of F.mats)$.uniforms.uRise.value=ee;for(const $ of F.lines)$.opacity=ee*.8;if(F.kind==="rings"&&F.extra.forEach(($,fe)=>$.rotation.z+=.004+F.spin*.01*(fe+1)),(F.kind==="orbs"||F.kind==="plates"||F.kind==="cubes")&&(F.obj.rotation.y=z*F.spin*.6),F.kind==="dish"&&(F.extra[0].rotation.z=z*F.spin*1.8),F.kind==="shield"&&(F.extra[0].rotation.z=z*.8),F.kind==="wave")for(const $ of F.extra){const fe=$.userData.i;$.scale.y=.35+(.5+.5*Math.sin(z*(1.2+F.spin)+fe*.55))*2.6}if(F.kind==="box")for(const $ of F.extra)$.rotation.x=$.userData.dir*(-Math.PI/2)*ee}return{kick:S,flash:se}}}}const ls=["hook","brief","build","proof","honesty","next"];async function fs(t,e,o){const i=performance.now();let n=Co();const s=o.rtl?-1:1,r=new ta({canvas:t,alpha:!1,antialias:!1,powerPreference:"high-performance"});r.toneMapping=oa,r.setClearColor(0,1);let p=window.devicePixelRatio||1;r.setPixelRatio(p);const c=new xt,h=new aa(46,1,.1,4e3),a=ja(c,n,p,r),{common:u}=a,v=Ka(a),l=Qa(a);$a(a);const f=Ya(a),b=Xa(a),x=Za(a),L=Ja(a),d=e.spec;await Ga(a,[d.kind,e.next.kind,2]);const V=Po(a,d,L,d.kind,{size:4096,start:1024}),B=V.pos.clone(),_=V.radius,C=new N(0,1,0),J=new N(B.x,0,B.z).normalize();J.lengthSq()||J.set(1,0,0);const M=new N(-J.z,0,J.x).multiplyScalar(d.kind%2?-1:1),T=new N().crossVectors(C,M).normalize().multiplyScalar(s),E=new H(d.a),K=new H(d.b),ue=new N().addScaledVector(T,1).addScaledVector(M,-.55).addScaledVector(C,.6).normalize(),we=m=>{const g=ue.clone().applyAxisAngle(C,m);V.keyLight.copy(B).addScaledVector(g,600)};we(0);const ve=122,be=B.clone().addScaledVector(M,_*3.2).addScaledVector(C,_*.1),te=[be,be.clone().addScaledVector(M,ve*.28).addScaledVector(T,13),be.clone().addScaledVector(M,ve*.6).addScaledVector(T,26).addScaledVector(C,3),be.clone().addScaledVector(M,ve).addScaledVector(T,38)],y=new st(te,!1,"centripetal"),z=a.shader({vertexShader:Kt,fragmentShader:xa,uniforms:{...u,uColor:{value:K.clone()},uDraw:{value:.12}}}),O=new D(a.track(new Fo(y,420,.13,10,!1)),z);O.frustumCulled=!1,c.add(O);const S=6e3,se=new Float32Array(S*3),F=new Float32Array(S),ee=new N;for(let m=0;m<S;m++){const g=m/(S-1);y.getPointAt(g,ee),se[m*3]=ee.x+(Math.random()-.5)*.5,se[m*3+1]=ee.y+(Math.random()-.5)*.5,se[m*3+2]=ee.z+(Math.random()-.5)*.5,F[m]=g}const xe=a.track(new Fe);xe.setAttribute("position",new X(se,3)),xe.setAttribute("aT",new X(F,1));const $=a.shader({vertexShader:ko,fragmentShader:Mo,uniforms:{...u,uDraw:{value:.12},uColor:{value:K.clone()}}}),fe=new Ee(xe,$);fe.frustumCulled=!1,c.add(fe);const Y=y.getPointAt(.5);Lt(a,Y,new N(ve*.7,28,ve*.7),6e4,Math.floor(d.seed*100)),Lt(a,y.getPointAt(.35),new N(34,11,34),5e4,Math.floor(d.seed*100)+1),Lt(a,y.getPointAt(.72).addScaledVector(T,6),new N(26,10,26),36e3,Math.floor(d.seed*100)+2);{const m=a.track(new Ue(1,1));[.22,.48,.74].forEach((g,j)=>{const A=a.shader({vertexShader:It,fragmentShader:qt(4),side:rt,uniforms:{...u,uSeed:{value:90+j*3.1+d.seed},uOpacity:{value:.2},uColA:{value:K.clone()},uColB:{value:E.clone()}}}),Q=new D(m,A);Q.position.copy(y.getPointAt(g)).addScaledVector(T,(j%2?-1:1)*9).addScaledVector(C,2+j),Q.rotation.set(-Math.PI/2+.5,.3*j,.7*j),Q.scale.set(38,24,1),Q.renderOrder=-1,c.add(Q)})}const Se=Math.max(2,document.querySelectorAll("[data-build-item]").length||4),w=[];for(let m=0;m<Se;m++)w.push(.1+m/(Se-1)*.44);const k=rs({world:a,curve:y,gateT:w,span:[.08,.57],side:T,up:C,a:E,b:K,seed:d.seed,visual:e.visual}),P=y.getPointAt(.7).addScaledVector(T,9).addScaledVector(C,-1.5),R=[],ie=[],oe=e.proof;if(oe>0)for(let m=0;m<oe;m++){const g=a.track(new Te(.9,1,.9));g.translate(0,.5,0);const j=Je(a,K);j.uniforms.uRise.value=1;const A=new D(g,j),Q=(m-(oe-1)/2)/Math.max(1,oe-1);A.position.copy(P).addScaledVector(M,Q*12).addScaledVector(T,Math.abs(Q)*-3),A.scale.y=1.5,c.add(A);const U=a.glow(K.getStyle(),0,5);U.position.copy(A.position),c.add(U);const I=new D(a.track(new ke(1.4,.05,8,48)),j);I.position.copy(A.position),I.rotation.x=Math.PI/2,c.add(I),R.push({mesh:A,cap:U,base:1.5})}else{const m=a.track(new _e(.42,24,18));for(let g=0;g<6;g++){const j=Je(a,g%2?E:K);j.uniforms.uRise.value=1;const A=new D(m,j);c.add(A),ie.push({mesh:A,r:5+g*1.4,phase:g*1.1,speed:.35-g*.03})}}const ne=new sa,Ce=[],re=[];e.shots.forEach((m,g)=>{const A=9*m.h/m.w,Q=a.track(new Et({color:9146786,transparent:!0,opacity:0,side:rt,depthWrite:!1})),U=new D(a.track(new Ue(9,A)),Q),I=new D(a.track(new Ue(9+.5,A+.5)),a.track(new Et({color:329228,transparent:!0,opacity:0,side:rt,depthWrite:!1})));U.position.copy(P).addScaledVector(M,-5-g*3.2).addScaledVector(T,-2+g*1.4).addScaledVector(C,6.5+g*.8),U.lookAt(U.position.clone().addScaledVector(T,10).addScaledVector(C,3).addScaledVector(M,-4)),c.add(U),I.position.copy(U.position).addScaledVector(T,-.08),I.quaternion.copy(U.quaternion),c.add(I);const q=new Wt(a.track(new ia(U.geometry)),a.track(new Do({color:K,transparent:!0,opacity:0,depthWrite:!1,blending:a.blend()})));q.position.copy(U.position),q.quaternion.copy(U.quaternion),c.add(q);const ae=a.glow(K.getStyle(),0,9*1.6);ae.position.copy(U.position).addScaledVector(T,-.6),c.add(ae),Ce.push({mesh:U,frame:q,back:ae,backing:I,k:g,base:U.position.clone()}),ne.load(m.src,he=>{he.anisotropy=r.capabilities.getMaxAnisotropy(),re.push(a.track(he)),Q.map=he,Q.needsUpdate=!0})});const le=y.getPointAt(.965),He=y.getTangentAt(.965).normalize(),Qt=(()=>{const m=new H(Ht),g=Je(a,m);g.uniforms.uRise.value=1;const j=new D(a.track(new ke(5.6,.22,16,96)),g),A=new D(a.track(new ke(6.5,.07,8,8)),g),Q=a.track(new Te(.5,2.4,.5)),U=[];for(let ae=0;ae<8;ae++){const he=new D(Q,g),me=ae/8*Math.PI*2;he.position.set(Math.cos(me)*5.6,Math.sin(me)*5.6,0),he.rotation.z=me+Math.PI/2,U.push(he)}const I=a.glow(Ht,.1,16),q=j;return q.add(A,I,...U),q.position.copy(le),q.lookAt(le.clone().add(He)),c.add(q),{group:q,ring2:A,mat:g}})(),je=le.clone().addScaledVector(He,58).addScaledVector(T,14).addScaledVector(C,-3),$t=Po(a,{...e.next,x:je.x,y:je.y,z:je.z},L,e.next.kind+1,{size:1024,start:512}),ft=900,ht=new Float32Array(ft*3),Yt=new Float32Array(ft),Lo=new st([le.clone(),le.clone().addScaledVector(He,60).addScaledVector(T,8),je.clone().addScaledVector(C,e.next.radius*1.8)],!1,"centripetal");for(let m=0;m<ft;m++){const g=m/(ft-1);Lo.getPointAt(g,ee),ht[m*3]=ee.x,ht[m*3+1]=ee.y,ht[m*3+2]=ee.z,Yt[m]=g}const kt=a.track(new Fe);kt.setAttribute("position",new X(ht,3)),kt.setAttribute("aT",new X(Yt,1));const Xt=a.shader({vertexShader:ko,fragmentShader:Mo,uniforms:{...u,uDraw:{value:0},uColor:{value:new H(e.next.b)}}}),Jt=new Ee(kt,Xt);Jt.frustumCulled=!1,c.add(Jt);const Mt=k.stackAnchor;e.models.length&&Mt&&Promise.all([bt(()=>import("./GLTFLoader.ut-U2dNv.js"),__vite__mapDeps([0,1])),bt(()=>import("./DRACOLoader.BNB08wbf.js"),__vite__mapDeps([2,1])),bt(()=>import("./KTX2Loader.DsdTamEE.js"),__vite__mapDeps([3,1])),bt(()=>import("./meshopt_decoder.module.BkEQAzru.js"),[])]).then(([{GLTFLoader:m},{DRACOLoader:g},{KTX2Loader:j},{MeshoptDecoder:A}])=>{const Q=new g;Q.setDecoderPath(e.draco);const U=new j().setTranscoderPath(e.basis).detectSupport(r),I=new m;I.setDRACOLoader(Q),I.setKTX2Loader(U),I.setMeshoptDecoder(A),c.add(new na(16777215,1712452,1.6));const q=new ra(16773600,2.2);return q.position.copy(V.keyLight),c.add(q),console.info("[flight] loading %d models",e.models.length),Promise.all(e.models.map(ae=>I.loadAsync(ae)))}).then(m=>{console.info("[flight] models loaded: %d",m.length),!so&&(Mt.children.forEach(g=>g.visible=!1),m.forEach((g,j)=>{const A=g.scene;A.updateMatrixWorld(!0);const Q=new la().setFromObject(A),U=new N,I=new N;Q.getSize(U),Q.getCenter(I);const q=2/Math.max(U.y,.001);A.scale.setScalar(q),A.position.set(-I.x*q,-Q.min.y*q,-I.z*q+(j-(m.length-1)/2)*3.6),Mt.add(A)}))}).catch(m=>console.warn("[flight] cakes stay procedural:",m));const Oe=Ia(r,c,h,{strength:.62,radius:.5,threshold:.8});Oe.setLight(n.light),Oe.setAnamorphic(.8,d.b);const Zt=document.querySelector(".letterbox");let eo=-1;const zt=ss(a,h,Array.from(document.querySelectorAll("[data-ptext]")),[d.a,d.b]);let Ae=1,Pe=1,Ge=!1,mt=[],Le=[],Ct=null,Tt=null,to=0,oo=-1;function No(){const m=[],g=(U,I,q)=>m.push({u:U,pos:I,look:q}),j=Ge?1.35:1;g(0,B.clone().addScaledVector(M,-_*7.2*j).addScaledVector(T,_*5.4).addScaledVector(C,_*2.4),B.clone()),g(.55,B.clone().addScaledVector(M,-_*4.2*j).addScaledVector(T,_*3.9).addScaledVector(C,_*1.3),B.clone()),g(1,B.clone().addScaledVector(M,-_*2.2*j).addScaledVector(T,_*3.1).addScaledVector(C,_*.8),B.clone().addScaledVector(M,_*.5)),g(1.5,B.clone().addScaledVector(T,_*2.5).addScaledVector(C,_*.9).addScaledVector(M,-_*.2),B.clone().addScaledVector(M,_*2.6).addScaledVector(T,_*.4)),g(2,be.clone().addScaledVector(M,-5).addScaledVector(T,1.4).addScaledVector(C,4.6),be.clone().addScaledVector(M,9).addScaledVector(T,1.5).addScaledVector(C,.8));const A=w[0]-.05,Q=w[w.length-1]+.05;for(let U=1;U<=4;U++){const I=U/4,q=A+(Q-A)*I,ae=y.getPointAt(G(q)).addScaledVector(T,1.2).addScaledVector(C,4.2),he=y.getPointAt(G(q+.08)).addScaledVector(C,.9);g(2+I,ae,he)}g(3.35,P.clone().addScaledVector(T,16).addScaledVector(C,5).addScaledVector(M,-9),P.clone().addScaledVector(C,3)),g(3.7,P.clone().addScaledVector(T,12).addScaledVector(C,7.5).addScaledVector(M,5),P.clone().addScaledVector(C,3)),g(4,y.getPointAt(.74).addScaledVector(T,12).addScaledVector(C,6),le.clone()),g(4.5,le.clone().addScaledVector(He,-17).addScaledVector(T,3).addScaledVector(C,2.6),le.clone()),g(5,le.clone().addScaledVector(He,-1.5).addScaledVector(C,1),je.clone()),g(5.5,le.clone().addScaledVector(He,20).addScaledVector(T,2).addScaledVector(C,3),je.clone()),Le=m,io=m[0].pos.distanceTo(B),Ct=new st(m.map(U=>U.pos),!1,"centripetal"),Tt=new st(m.map(U=>U.look),!1,"centripetal")}function Eo(){const m=window.innerWidth||1,g=window.innerHeight||1,j=window.devicePixelRatio||1;m===Ae&&g===Pe&&j===p||(Ae=m,Pe=g,p=j,Ge=Ae<760,r.setPixelRatio(p),u.uPixel.value=p,r.setSize(Ae,Pe,!1),Oe.resize(Ae,Pe,p),h.aspect=Ae/Pe,h.fov=Ge?60:46,No(),zt.refresh(),Ce.forEach(({mesh:A,frame:Q,back:U,backing:I,base:q})=>{A.position.copy(q).addScaledVector(C,Ge?-5.5:0),Q.position.copy(A.position),I.position.copy(A.position).addScaledVector(T,-.08),U.position.copy(A.position).addScaledVector(T,-.6)}))}function et(){Eo();const m=Pe,g=Math.max(1,document.documentElement.scrollHeight-m);to=document.documentElement.scrollHeight,oo=Ye.layoutVersion;const j=de=>document.querySelector(`[data-flight-stop="${de}"]`),A=de=>{const ce=j(de);return ce?{top:qa(ce),h:ce.offsetHeight}:null},Q=A("hook"),U=A("brief"),I=A("build"),q=A("proof"),ae=A("honesty"),he=A("next"),me=[],Re=(de,ce,Ve,$e=!1)=>{const Be=me[me.length-1];Be&&ce<Be.y1&&(ce=Be.y1),Ve<ce+1&&(Ve=ce+1),me.push({kind:de,y0:ce,y1:Ve,pinned:$e})},Qe=U?U.top:Q?Q.top+Q.h:m;Re("hook",0,Math.max(m*.5,Qe-m*.85));const tt=I?I.top:Qe+(U?.h??m);Re("brief",me[0].y1,Math.max(me[0].y1+1,tt-m*.02)),I&&Re("build",I.top,I.top+Math.max(m,I.h-m),!0),q&&Re("proof",q.top,q.top+Math.max(m,q.h-m),!0);const We=ae?ae.top:q?q.top+q.h:tt+m;Re("honesty",We-m*.9,We+(ae?.h??m)*.35);const Z=he?he.top:We+(ae?.h??m);Re("next",Math.min(g-1,Z-m*.9),g),mt=me}function ao(m){let g=0;for(let j=0;j<mt.length;j++){const A=mt[j],U=ls.indexOf(A.kind);if(m<=A.y0)return U;if(m<=A.y1){let I=(m-A.y0)/(A.y1-A.y0);return A.pinned&&(A.kind==="build"&&Ye.buildActive&&(I=Ye.build),A.kind==="proof"&&Ye.proofActive&&(I=Ye.proof)),U+G(I)*(A.kind==="next"?.5:1)}g=U+(A.kind==="next"?.5:1)}return g}function Oo(m){const g=Ge?[[0,0,.26],[1,0,.18],[2,0,-.12],[3,0,-.24],[4,0,.04],[5,0,.1],[5.5,0,.1]]:[[0,-.24*s,0],[1,-.2*s,0],[2,0,.04],[3,-.2*s,.02],[4,0,.06],[5,0,.1],[5.5,0,.12]];for(let A=0;A<g.length-1;A++){const[Q,U,I]=g[A],[q,ae,he]=g[A+1];if(m<=q){const me=G((m-Q)/Math.max(1e-6,q-Q));return{ox:U+(ae-U)*me,oy:I+(he-I)*me}}}const j=g[g.length-1];return{ox:j[1],oy:j[2]}}let W=0,At=0,Ke=performance.now(),ge=0,pt=0,so=!1,vt=0,Pt=0,Vt=0,io=1;const Wo=()=>Ge?60:46,no=new N,Io=new N,ro=new N,lo=new N;let co=0,uo=0,_t=0,Ft=0;const qo=window.matchMedia("(pointer: fine)").matches,fo=m=>{co=m.clientX/Ae*2-1,uo=m.clientY/Pe*2-1};qo&&window.addEventListener("pointermove",fo,{passive:!0});const ho=new N,gt=new N,Dt=new N,Bt=new N;et(),W=ao(window.scrollY);const mo=performance.now();await r.compileAsync(c,h).catch(()=>{}),Ke=performance.now(),console.info(`[flight] scene built in ${(mo-i).toFixed(0)} ms, programs compiled in ${(Ke-mo).toFixed(0)} ms`);const po=m=>{if(At=requestAnimationFrame(po),document.hidden){Ke=m;return}const g=Math.min(.05,Math.max(.001,(m-Ke)/1e3));Pt=Ie(Pt,m-Ke,2,g),Ke=m,ge+=g,u.uTime.value=ge,vt++,(document.documentElement.scrollHeight!==to||Ye.layoutVersion!==oo)&&et();const j=ao(window.scrollY),A=W,Q=W<1?4.5:W<2?5.5:W<3?8.5:W<4?6:W<5?5.5:7.5;if(W=Ie(W,j,Q,g),Math.abs(j-W)<1e-4&&(W=j),pt=Ie(pt,Math.min(1,Math.abs(W-A)/g/2.4),7,g),we((1-Ne(G(W/.85)))*1.15),Ct&&Tt&&Le.length>1){let Z=0;for(;Z<Le.length-2&&W>Le[Z+1].u;)Z++;const de=G((W-Le[Z].u)/Math.max(1e-6,Le[Z+1].u-Le[Z].u)),ce=(Z+de)/(Le.length-1);Ct.getPoint(ce,ho),Tt.getPoint(ce,gt),h.position.copy(ho);let Ve=0;if(W>1&&W<1.9)Ve=-.09*G((W-1)/.4)*G((1.9-W)/.4);else if(W>=2&&W<3){const wo=G(.08+(W-2)*.46);y.getTangentAt(wo,ro),y.getTangentAt(Math.min(1,wo+.03),lo),Ve=G(1)*-6.5*T.dot(lo.sub(ro))}else W>=3&&W<4&&(Ve=.07*G((W-3)/.5)*G((4-W)/.5));Vt=Ie(Vt,Math.max(-.16,Math.min(.16,Ve)),3,g),no.copy(gt).sub(h.position).normalize(),h.up.copy(Io.set(0,1,0).applyAxisAngle(no,Vt)),h.lookAt(gt),h.updateMatrixWorld(),Dt.setFromMatrixColumn(h.matrixWorld,0),Bt.setFromMatrixColumn(h.matrixWorld,1),_t=Ie(_t,co,2.5,g),Ft=Ie(Ft,uo,2.5,g);const $e=Math.sin(ge*.24)*.35;h.position.addScaledVector(Dt,_t*1.2+$e).addScaledVector(Bt,-Ft*.8+Math.cos(ge*.31)*.2),h.lookAt(gt);const{ox:Be,oy:ot}=Oo(W);h.setViewOffset(Ae,Pe,Be*Ae,ot*Pe,Ae,Pe);const Ho=Ao(G(W/.95))*(1-Ao(G((W-1.05)/.55))),jo=h.position.distanceTo(B),wt=Wo(),Go=2*Math.atan(Math.tan(wt*Math.PI/360)*(io/Math.max(jo,.1)))*180/Math.PI;h.fov=wt+(Math.min(Go,wt+34)-wt)*Ho*.7}h.updateProjectionMatrix();const U=G(.1+(W-1.4)*.32);z.uniforms.uDraw.value=U,$.uniforms.uDraw.value=U,Xt.uniforms.uDraw.value=G((W-4.4)*.9);const I=G(W-2),q=k.update(I,ge,G((W-1.8)/.2)),ae=G(W-3);R.forEach((Z,de)=>{const ce=Ne(G((ae*(oe+.6)-de*.85)/1.2));Z.mesh.scale.y=Z.base+ce*9,Z.mesh.material.uniforms.uHot.value=ce*(.7+.3*Math.sin(ge*3+de)),Z.cap.position.y=Z.mesh.position.y+Z.mesh.scale.y+.6,Z.cap.material.uniforms.uOpacity.value=ce*.5}),ie.forEach(Z=>{const de=Z.phase+ge*Z.speed;Z.mesh.position.copy(P).addScaledVector(M,Math.cos(de)*Z.r).addScaledVector(T,Math.sin(de)*Z.r*.6).addScaledVector(C,Math.sin(de*1.7)*1.5+2),Z.mesh.material.uniforms.uHot.value=ae*.8});const he=Ne(G((W-2.9)*1.6))*(1-Ne(G((W-4.3)*1.4)));Ce.forEach(({mesh:Z,frame:de,back:ce,backing:Ve,k:$e})=>{const Be=Ne(G(he*1.4-$e*.25));Z.material.opacity=Be,Ve.material.opacity=Be*.8,de.material.opacity=Be*.9,ce.material.uniforms.uOpacity.value=Be*.07;const ot=Math.sin(ge*.7+$e)*.004;Z.position.y+=ot,Ve.position.y+=ot,de.position.y+=ot}),Qt.mat.uniforms.uHot.value=.35+.65*G((W-4)*1.2)*(.6+.4*Math.sin(ge*1.8)),Qt.ring2.rotation.z+=g*.25,b.setClose(.8+.2*G((W-4.6)*1.5),.35);const me=G((W-4.75)/.5)*(1-G((W-5.26)/.14)),Re=Math.exp(-Math.pow((W-5.2)/.075,2)),Qe=Math.min(1,pt*5),tt=q.kick*Qe;h.position.addScaledVector(Dt,tt*.18*Math.sin(ge*57)).addScaledVector(Bt,tt*.12*Math.cos(ge*43)),h.updateMatrixWorld(),Oe.setFx({warp:me,flash:Math.max(Re*.8,q.flash*Qe*.28),flashColor:Re>q.flash*Qe?"#ffffff":d.b}),l.material.uniforms.uScale.value=260*(1+me*.9);const We=G((W-1.6)/.5)*(1-G((W-4.15)/.45));Zt&&Math.abs(We-eo)>.004&&(eo=We,Zt.style.setProperty("--lb",We.toFixed(3))),V.update(g,ge),$t.update(g,ge),vt===3&&V.upgrade(),vt===5&&$t.upgrade(),l.points.rotation.y+=g*.0022,x.update(g),zt.update(g,ge,Ae,Pe),Oe.render(ge,pt,a.overlay)};At=requestAnimationFrame(po);const vo=()=>et();window.addEventListener("resize",vo,{passive:!0});const go=new ResizeObserver(()=>et());return go.observe(document.body),window.__flight={get u(){return W},get frames(){return vt},get ms(){return Pt},get calls(){return r.info.render.calls},get stops(){return mt.length},get camera(){return[h.position.x,h.position.y,h.position.z]}},{relayout:et,retheme(){n=Co(),a.retheme(n),v.repaint(n),l.repaint(n),f.repaint(n),b.repaint(n),Oe.setLight(n.light)},dispose(){so=!0,cancelAnimationFrame(At),window.removeEventListener("resize",vo),window.removeEventListener("pointermove",fo),go.disconnect(),delete window.__flight,zt.dispose(),Oe.dispose(),a.dispose(),r.dispose()}}}export{fs as mountFlight};
