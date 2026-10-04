import{a as _e,T as Fe}from"./theme.2-Nlk0mO.js";import{b as V,r as Te,f as H,Z as pe,h as R,a8 as ue,n as U,p as I,H as Q,q as ke,a9 as De,i as S,x as P,A as me,t as Ue,aa as ce,S as fe,l as X,ab as ve,g as z,j as q,a0 as Be,a4 as oe,G as Ne,a as Re,ac as Le,ad as Ve,ae as ie,af as Y,ag as ge,ah as Ee}from"./three.module.BBopIvPF.js";const Z=`
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
`,J=`
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
`,ee=`
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
`,be=`
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
`,we=t=>`
#define OCTAVES ${t}
uniform float uTime;
uniform float uSeed;
uniform float uOpacity;
uniform float uLight;
uniform vec3 uColA;
uniform vec3 uColB;
varying vec2 vUv;
varying float vFacing;
${Z}
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
`,ne=`
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
`,Oe=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,We=(t,e)=>`
#define OCTAVES ${t}
#define KIND ${e}
uniform vec3 uA;
uniform vec3 uB;
uniform float uSeed;
uniform float uPass;
varying vec2 vUv;
${Z}
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
`,xe=t=>`
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
${Z}
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
`,Ie=`
varying vec3 vN;
varying vec3 vWorldPos;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,He=`
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
`,St=`
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
`,Ct=`
uniform vec3 uColor;
uniform float uLight;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColor, uColor * 0.45, uLight);
  gl_FragColor = vec4(col, a * vA);
}
`,Tt=`
attribute vec3 aColor;
attribute float aHi;
attribute float aOn;
uniform float uPixel;
uniform float uMap;
uniform float uTime;
varying vec3 vColor;
varying float vHi;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vColor = aColor;
  vHi = aHi;
  vA = uMap * mix(0.22, 1.0, aOn);
  float breathe = 1.0 + 0.08 * sin(uTime * 1.3 + position.x);
  float size = (26.0 + aHi * 30.0) * breathe;
  gl_PointSize = clamp(size * uPixel * 140.0 / max(-mv.z, 0.001), 3.0 * uPixel, 90.0 * uPixel);
  gl_Position = projectionMatrix * mv;
}
`,Mt=`
uniform float uLight;
varying vec3 vColor;
varying float vHi;
varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = smoothstep(0.09, 0.0, d);
  float halo = smoothstep(0.5, 0.0, d) * 0.4;
  float spike = (smoothstep(0.018, 0.0, abs(c.x)) + smoothstep(0.018, 0.0, abs(c.y)))
              * smoothstep(0.5, 0.0, d) * (0.25 + vHi * 0.75);
  float a = clamp(core + halo + spike, 0.0, 1.0) * vA;
  vec3 col = mix(vColor, vec3(1.0), core * 0.7);
  col = mix(col, vColor * 0.4, uLight);
  gl_FragColor = vec4(col, a);
}
`,je=`
varying vec2 vUv;
void main() {
  vUv = uv;
  // camera-facing billboard: keep only the translation of the model-view
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec3 scale = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), 1.0);
  mv.xy += position.xy * scale.xy;
  gl_Position = projectionMatrix * mv;
}
`,Qe=`
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
`,Ke=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.999999, 1.0);
}
`,qe=`
uniform vec3 uTop;
uniform vec3 uBottom;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(uBottom, uTop, vUv.y), 1.0);
}
`,Ge=t=>`
#define OCTAVES ${t}
uniform vec3 uColor;
uniform vec3 uLightPos;
uniform float uRadius;
uniform float uSeed;
uniform float uTime;
varying vec3 vObj;
varying vec3 vWorldN;
varying vec3 vWorldPos;
${Z}
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
`,$e=`
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
`,Ye=`
#define OCTAVES 3
uniform vec3 uColor;
uniform float uTime;
uniform float uSeed;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vWorldPos;
${Z}
void main() {
  float n = fbm3(vec3(vUv.x * 9.0, vUv.y * 2.0, uSeed) + vec3(uTime * 0.25, 0.0, 0.0));
  float band = smoothstep(0.12, 0.45, vUv.y) * (1.0 - smoothstep(0.55, 0.95, vUv.y));
  float a = band * smoothstep(0.32, 0.8, n) * 0.8;
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - abs(dot(normalize(vN), V)), 1.5);
  gl_FragColor = vec4(mix(uColor, vec3(0.7, 1.0, 0.85), 0.35) * (0.6 + n), a * (0.5 + fres * 0.5));
}
`,At=`
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
`,Pt=`
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
`,Xe=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ze=`
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
`,Je=`
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
`,et=`
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
`,tt=`
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
`,ot=`
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 c = (vUv - 0.5) * 2.0;
  float d = length(c * vec2(1.0, 1.15));
  float a = pow(clamp(1.0 - d, 0.0, 1.0), 1.5);
  gl_FragColor = vec4(uColor, a * uOpacity);
}
`,zt=`
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
`,_t=`
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
`,at=([t,e,o])=>"#"+[t,e,o].map(a=>a.toString(16).padStart(2,"0")).join(""),st={dark:"#ffe6d2",light:"#7a4cff",neon:"#eafff2",cinema:"#ffdcb0",storybook:"#fff0c4",wave:"#e6fff1"},it={dark:"#9fd8ff",light:"#2b6fe0",neon:"#7dffb8",cinema:"#ffb454",storybook:"#f2c14e",wave:"#8a5cff"},rt={dark:["#03030a","#070713"],light:["#eaf0ff","#f6f4ff"],neon:["#050705","#0a0f0a"],cinema:["#000000","#0a0a0a"],storybook:["#0b1029","#131c45"],wave:["#0e0e0e","#161616"]};function ye(t,e){try{const o=getComputedStyle(document.documentElement).getPropertyValue(t).trim();return/^#[0-9a-f]{6}$/i.test(o)?o:e}catch{return e}}function Ft(){const t=_e(),e=Fe[t].blobs.map(at),o=t==="dark"||t==="light"?["#2997ff","#a259ff","#ff5e8a","#64d2ff"]:e,a=rt[t];return{light:t==="light",core:st[t],route:it[t],arms:o,top:ye("--space-1",a[0]),bottom:ye("--space-2",a[1])}}const ae={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class te{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const nt=new Te(-1,1,1,-1,0,1);class lt extends H{constructor(){super(),this.setAttribute("position",new pe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new pe([0,2,0,0,2,0],2))}}const ut=new lt;class Me{constructor(e){this._mesh=new V(ut,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,nt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ae extends te{constructor(e,o="tDiffuse"){super(),this.textureID=o,this.uniforms=null,this.material=null,e instanceof R?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ue.clone(e.uniforms),this.material=new R({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Me(this.material)}render(e,o,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Se extends te{constructor(e,o){super(),this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,a){const i=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let n,v;this.inverse?(n=0,v=1):(n=1,v=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,n,4294967295),s.buffers.stencil.setClear(v),s.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}}class ct extends te{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ft{constructor(e,o){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),o===void 0){const a=e.getSize(new U);this._width=a.width,this._height=a.height,o=new I(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Q}),o.texture.name="EffectComposer.rt1"}else this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ae(ae),this.copyPass.material.blending=ke,this.clock=new De}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const o=this.renderer.getRenderTarget();let a=!1;for(let i=0,s=this.passes.length;i<s;i++){const n=this.passes[i];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),n.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),n.needsSwap){if(a){const v=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(v.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(v.EQUAL,1,4294967295)}this.swapBuffers()}Se!==void 0&&(n instanceof Se?a=!0:n instanceof ct&&(a=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new U);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const a=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(a,i),this.renderTarget2.setSize(a,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(a,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class mt extends te{constructor(e,o,a=null,i=null,s=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=a,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new S}render(e,o,a){const i=e.autoClear;e.autoClear=!1;let s,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),e.autoClear=i}}const vt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new S(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class K extends te{constructor(e,o=1,a,i){super(),this.strength=o,this.radius=a,this.threshold=i,this.resolution=e!==void 0?new U(e.x,e.y):new U(256,256),this.clearColor=new S(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);this.renderTargetBright=new I(s,n,{type:Q}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let l=0;l<this.nMips;l++){const f=new I(s,n,{type:Q});f.texture.name="UnrealBloomPass.h"+l,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const m=new I(s,n,{type:Q});m.texture.name="UnrealBloomPass.v"+l,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),s=Math.round(s/2),n=Math.round(n/2)}const v=vt;this.highPassUniforms=ue.clone(v.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new R({uniforms:this.highPassUniforms,vertexShader:v.vertexShader,fragmentShader:v.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];s=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);for(let l=0;l<this.nMips;l++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(u[l])),this.separableBlurMaterials[l].uniforms.invSize.value=new U(1/s,1/n),s=Math.round(s/2),n=Math.round(n/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1;const g=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=g,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ue.clone(ae.uniforms),this.blendMaterial=new R({uniforms:this.copyUniforms,vertexShader:ae.vertexShader,fragmentShader:ae.fragmentShader,blending:me,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new S,this._oldClearAlpha=1,this._basic=new Ue,this._fsQuad=new Me(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,o){let a=Math.round(e/2),i=Math.round(o/2);this.renderTargetBright.setSize(a,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(a,i),this.renderTargetsVertical[s].setSize(a,i),this.separableBlurMaterials[s].uniforms.invSize.value=new U(1/a,1/i),a=Math.round(a/2),i=Math.round(i/2)}render(e,o,a,i,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const n=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=a.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let v=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this._fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=v.texture,this.separableBlurMaterials[u].uniforms.direction.value=K.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=K.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this._fsQuad.render(e),v=this.renderTargetsVertical[u];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=n}_getSeparableBlurMaterial(e){const o=[];for(let a=0;a<e;a++)o.push(.39894*Math.exp(-.5*a*a/(e*e))/e);return new R({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new U(.5,.5)},direction:{value:new U(.5,.5)},gaussianCoefficients:{value:o}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new R({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}K.BlurDirectionX=new U(1,0);K.BlurDirectionY=new U(0,1);function kt(t,e,o,a={}){const i=t.capabilities.isWebGL2,s=t.getPixelRatio(),n=t.getSize(new U),v=new I(Math.max(1,Math.round(n.x*s)),Math.max(1,Math.round(n.y*s)),{type:i?Q:ce,samples:i?4:0,depthBuffer:!0,stencilBuffer:!1}),u=new ft(t,v);u.setPixelRatio(s),u.setSize(n.x,n.y);const g=new mt(e,o),l=new K(new U(n.x,n.y),a.strength??.85,a.radius??.55,a.threshold??.72),f=new Ae({uniforms:{tDiffuse:{value:null},uTime:{value:0},uVelocity:{value:0},uLight:{value:0},uGrain:{value:a.grain??.045},uVignette:{value:a.vignette??.55},uAberration:{value:a.aberration??.0012},uWarp:{value:0},uFlash:{value:0},uFlashColor:{value:new S("#ffffff")},uAnamorphic:{value:0},uAnamorphicTint:{value:new S("#9fd8ff")}},vertexShader:Xe,fragmentShader:Ze});return f.renderToScreen=!0,u.addPass(g),u.addPass(l),u.addPass(f),{render(m,r,c){f.uniforms.uTime.value=m,f.uniforms.uVelocity.value=r,u.render(),c&&(t.autoClear=!1,t.clearDepth(),t.render(c,o),t.autoClear=!0)},setFx(m){f.uniforms.uWarp.value=m.warp,f.uniforms.uFlash.value=m.flash,f.uniforms.uFlashColor.value.set(m.flashColor)},setAnamorphic(m,r){f.uniforms.uAnamorphic.value=m,f.uniforms.uAnamorphicTint.value.set(r)},resize(m,r,c){u.setPixelRatio(c),u.setSize(m,r)},setLight(m){l.enabled=!m,f.uniforms.uLight.value=m?1:0},dispose(){l.dispose(),f.dispose(),u.dispose(),v.dispose()}}}function O(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let o=e;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296}}function $(t){const e=Math.max(t(),1e-6);return Math.sqrt(-2*Math.log(e))*Math.cos(6.2831853*t())}const Dt=t=>.5-.5*Math.cos(Math.PI*Math.min(1,Math.max(0,t))),Ut=t=>1-Math.pow(1-Math.min(1,Math.max(0,t)),3),se=t=>t<0?0:t>1?1:t,Bt=t=>t.getBoundingClientRect().top+window.scrollY,ht=(t,e,o,a)=>t+(e-t)*(1-Math.exp(-a*o)),N={galaxyStars:22e4,farStars:12e3,nebulae:12,dustLanes:5,octaves:5,ringDust:12e3,comets:7,planetSegments:[128,96],atmoSegments:[72,48],moonSegments:[48,32]};function dt(){const e=O(1234567),o=new Uint8Array(256*256);for(let s=0;s<256*256;s++)o[s]=Math.floor(e()*256);const a=new Uint8Array(256*256*4);for(let s=0;s<256;s++)for(let n=0;n<256;n++){const v=s*256+n;a[v*4]=o[v],a[v*4+1]=o[(s+17&255)*256+(n+37&255)],a[v*4+2]=o[(s+91&255)*256+(n+113&255)],a[v*4+3]=255}const i=new Le(a,256,256,Ve);return i.wrapS=ie,i.wrapT=ie,i.magFilter=Y,i.minFilter=Y,i.generateMipmaps=!1,i.needsUpdate=!0,i}function Nt(t,e,o,a){const i=[],s=[],n=dt();i.push(n);const v={uTime:{value:0},uPixel:{value:o},uLight:{value:e.light?1:0},tNoise:{value:n}},u=new fe,g=new V(new X(2,2));g.frustumCulled=!1,u.add(g);const l={scene:t,overlay:new fe,renderer:a,pal:e,bake:{scene:u,camera:new Te(-1,1,1,-1,0,1),quad:g,materials:new Map},common:v,track:f=>(i.push(f),f),blend:()=>l.pal.light?ve:me,shader(f,m=!0){const r=l.track(new R({transparent:!0,depthWrite:!1,...f}));return m&&(r.blending=l.blend(),s.push(r)),r},quad:null,glow(f,m,r){const c=l.shader({vertexShader:je,fragmentShader:Qe,uniforms:{...v,uColor:{value:new S(f)},uOpacity:{value:m}}}),d=new V(l.quad,c);return d.scale.set(r,r,1),d.frustumCulled=!1,d},retheme(f){l.pal=f,v.uLight.value=f.light?1:0,s.forEach(m=>{m.blending=l.blend(),m.needsUpdate=!0})},dispose(){i.forEach(f=>f.dispose()),i.length=0,l.bake.materials.forEach(f=>f.dispose()),l.bake.materials.clear(),g.geometry.dispose()}};return l.quad=l.track(new X(1,1)),l}function Pe(t,e){let o=t.bake.materials.get(e);return o||(o=new R({vertexShader:Oe,fragmentShader:We(5,e),depthTest:!1,depthWrite:!1,uniforms:{tNoise:t.common.tNoise,uA:{value:new S},uB:{value:new S},uSeed:{value:0},uPass:{value:0}}}),t.bake.materials.set(e,o)),o}async function Rt(t,e){const o=new fe,a=new X(2,2);for(const i of new Set(e.map(s=>s&3))){const s=new V(a,Pe(t,i));s.frustumCulled=!1,o.add(s)}await t.renderer.compileAsync(o,t.bake.camera).catch(()=>{}),a.dispose()}function le(t,e,o){const a=e.kind&3,i=Pe(t,a);i.uniforms.uA.value.set(e.a),i.uniforms.uB.value.set(e.b),i.uniforms.uSeed.value=e.seed,t.bake.quad.material=i;const s=o,n=o/2,v=new I(s,n,{depthBuffer:!1,stencilBuffer:!1,type:ce,generateMipmaps:!0,minFilter:Ee,magFilter:Y,wrapS:ie,wrapT:ge}),u=new I(s,n,{depthBuffer:!1,stencilBuffer:!1,type:t.renderer.capabilities.isWebGL2?Q:ce,generateMipmaps:!1,minFilter:Y,magFilter:Y,wrapS:ie,wrapT:ge});v.texture.anisotropy=t.renderer.capabilities.getMaxAnisotropy();const g=t.renderer,l=g.getRenderTarget();return i.uniforms.uPass.value=0,g.setRenderTarget(v),g.render(t.bake.scene,t.bake.camera),i.uniforms.uPass.value=1,g.setRenderTarget(u),g.render(t.bake.scene,t.bake.camera),g.setRenderTarget(l),{albedo:v,data:u,size:o,dispose(){v.dispose(),u.dispose()}}}function Lt(t){const e={value:new S(t.pal.top)},o={value:new S(t.pal.bottom)},a=t.track(new R({vertexShader:Ke,fragmentShader:qe,depthTest:!1,depthWrite:!1,uniforms:{uTop:e,uBottom:o}})),i=new V(t.track(new X(2,2)),a);return i.frustumCulled=!1,i.renderOrder=-100,t.scene.add(i),{repaint(s){e.value.set(s.top),o.value.set(s.bottom)}}}function Vt(t,e=N.galaxyStars,o=120){const a=O(7),i=new Float32Array(e*3),s=new Float32Array(e),n=new Float32Array(e),v=new Uint8Array(e),u=new Float32Array(e),g=4;for(let d=0;d<e;d++){const p=Math.min(o,-Math.log(1-a()*.985)*o/3.1),w=Math.floor(a()*g),h=w/g*Math.PI*2+p*.042+$(a)*(.2+p/o*.22),b=4.2*Math.exp(-p/22)+.9,C=1.4+p/o*2.6;i[d*3]=Math.cos(h)*p+$(a)*C,i[d*3+1]=$(a)*b,i[d*3+2]=Math.sin(h)*p+$(a)*C;const T=a();s[d]=.5+Math.pow(T,7)*4.2,n[d]=a(),v[d]=w,u[d]=se(p/48)*(.75+a()*.25)}const l=t.track(new H);l.setAttribute("position",new z(i,3)),l.setAttribute("aSize",new z(s,1)),l.setAttribute("aSeed",new z(n,1));const f=new z(new Float32Array(e*3),3);l.setAttribute("aColor",f);const m=d=>{const p=new S,w=new S(d.core),h=d.arms.map(T=>new S(T)),b=new S("#cfe3ff"),C=O(11);for(let T=0;T<e;T++){p.copy(w).lerp(h[v[T]%h.length],u[T]),C()<.035&&p.lerp(b,.7);const _=.55+C()*.45;f.setXYZ(T,p.r*_,p.g*_,p.b*_)}f.needsUpdate=!0};m(t.pal);const r=t.shader({vertexShader:J,fragmentShader:ee,uniforms:{...t.common,uScale:{value:260}}}),c=new q(l,r);return c.frustumCulled=!1,t.scene.add(c),{points:c,material:r,repaint:m}}function Et(t,e=N.farStars){const o=O(23),a=new Float32Array(e*3),i=new Float32Array(e),s=new Float32Array(e),n=new Float32Array(e*3);for(let g=0;g<e;g++){const l=o()*2-1,f=o()*Math.PI*2,m=Math.sqrt(1-l*l),r=1300+o()*500;a[g*3]=m*Math.cos(f)*r,a[g*3+1]=l*r,a[g*3+2]=m*Math.sin(f)*r,i[g]=3+Math.pow(o(),8)*10,s[g]=o();const c=.6+o()*.4;n[g*3]=c,n[g*3+1]=c*(.9+o()*.1),n[g*3+2]=c}const v=t.track(new H);v.setAttribute("position",new z(a,3)),v.setAttribute("aSize",new z(i,1)),v.setAttribute("aSeed",new z(s,1)),v.setAttribute("aColor",new z(n,3));const u=new q(v,t.shader({vertexShader:J,fragmentShader:ee,uniforms:{...t.common,uScale:{value:420}}}));return u.frustumCulled=!1,t.scene.add(u),u}function Ot(t,e=N.nebulae,o=N.dustLanes,a=N.octaves){const i=O(31),s=t.track(new X(1,1)),n=[],v=[],u=(l,f,m,r)=>{const c=new V(s,l),d=f/m*Math.PI*2+(r?1.9:.5),p=(r?18:26)+f%3*24;c.position.set(Math.cos(d)*p,(r?-1:-3)+f%2*4,Math.sin(d)*p),c.rotation.set(-Math.PI/2+(i()-.5)*.45,0,i()*Math.PI);const w=(r?60:80)+i()*50;c.scale.set(w,w*(.55+i()*.4),1),c.renderOrder=r?-2:-1,t.scene.add(c)};for(let l=0;l<e;l++){const f=t.shader({vertexShader:be,fragmentShader:we(a),side:2,uniforms:{...t.common,uSeed:{value:l*7.13},uOpacity:{value:.28+i()*.18},uColA:{value:new S},uColB:{value:new S}}});n.push(f),u(f,l,e,!1)}for(let l=0;l<o;l++){const f=t.shader({vertexShader:be,fragmentShader:we(Math.max(3,a-1)),side:2,blending:ve,uniforms:{...t.common,uSeed:{value:50+l*3.7},uOpacity:{value:.55+i()*.25},uColA:{value:new S},uColB:{value:new S}}},!1);v.push(f),u(f,l,o,!0)}const g=l=>{n.forEach((m,r)=>{m.uniforms.uColA.value.set(l.arms[r%l.arms.length]),m.uniforms.uColB.value.set(l.arms[(r+1)%l.arms.length])});const f=new S(l.bottom).lerp(new S(l.light?"#8c94c8":"#000000"),l.light?.35:.65);v.forEach(m=>{m.uniforms.uColA.value.copy(f),m.uniforms.uColB.value.copy(f).multiplyScalar(l.light?1.1:.7)})};return g(t.pal),{repaint:g}}function Wt(t){const e=t.glow(t.pal.core,.38,150),o=t.glow(t.pal.arms[1],.22,70),a=t.glow("#ffffff",.5,26);t.scene.add(e,o,a);const i=s=>s.material.uniforms.uOpacity;return{setClose(s,n=1){i(e).value=.38*(1-s*.6)*n,i(o).value=.22*(1-s*.5)*n,i(a).value=.5*(1-s*.7)*n},repaint(s){e.material.uniforms.uColor.value.set(s.core),o.material.uniforms.uColor.value.set(s.arms[1])}}}function It(t){return{planet:t.track(new oe(1,N.planetSegments[0],N.planetSegments[1])),atmo:t.track(new oe(1,N.atmoSegments[0],N.atmoSegments[1])),cloud:t.track(new oe(1,96,64)),moon:t.track(new oe(1,N.moonSegments[0],N.moonSegments[1])),aurora:t.track(new Be(1,.16,12,96))}}function Ht(t,e,o,a=0,i={size:2048,start:512}){const s=new P(e.x,e.y,e.z),{radius:n}=e,v=e.kind&3,u=new Ne;u.position.copy(s);const g=new P(s.x,0,s.z).normalize();g.lengthSq()||g.set(1,0,0);const l=new P(-g.z,0,g.x).multiplyScalar(a%2?1:-1),f=s.clone().add(g.clone().multiplyScalar(.55).add(l.multiplyScalar(1.1)).add(new P(0,.7,0)).normalize().multiplyScalar(600));let m=le(t,e,i.start??i.size);const r=t.track(new R({vertexShader:ne,fragmentShader:xe(v),uniforms:{tNoise:t.common.tNoise,uTime:t.common.uTime,uA:{value:new S(e.a)},uB:{value:new S(e.b)},uLightPos:{value:f},uSeed:{value:e.seed},tAlbedo:{value:m.albedo.texture},tData:{value:m.data.texture},uTexel:{value:new U(1/m.size,2/m.size)}}})),c=x=>{r.uniforms.tAlbedo.value=x.albedo.texture,r.uniforms.tData.value=x.data.texture,r.uniforms.uTexel.value.set(1/x.size,2/x.size)},d=new V(o.planet,r);d.scale.setScalar(n),d.rotation.z=.25+v%3*.12,u.add(d);const p=new V(o.atmo,t.track(new R({vertexShader:Ie,fragmentShader:He,side:Re,transparent:!0,depthWrite:!1,blending:me,uniforms:{uColor:{value:new S(e.b)},uLightPos:{value:f}}})));p.scale.setScalar(n*1.16),u.add(p),u.add(t.glow(e.b,v===3?.3:.22,n*(v===3?8:6.5)));let w=null;v===0&&(w=new V(o.cloud,t.track(new R({vertexShader:ne,fragmentShader:Ge(4),transparent:!0,depthWrite:!1,uniforms:{tNoise:t.common.tNoise,uTime:t.common.uTime,uColor:{value:new S(e.b)},uLightPos:{value:f},uRadius:{value:n*1.025},uSeed:{value:e.seed+9.1}}}))),w.scale.setScalar(n*1.025),u.add(w));let h=null;if(v===1||v===2){const x=N.ringDust,A=O(100+a+Math.floor(e.seed*10)),y=new Float32Array(x*3),M=new Float32Array(x),L=new Float32Array(x),W=new Float32Array(x*3),j=new S(e.a),G=new S(e.b),k=new S;for(let E=0;E<x;E++){const he=A()*Math.PI*2,re=A(),ze=Math.abs(re-.55)<.04?.3:1,de=n*(1.55+re*.95);y[E*3]=Math.cos(he)*de,y[E*3+1]=$(A)*.05*n,y[E*3+2]=Math.sin(he)*de,M[E]=(.5+A()*.9)*ze,L[E]=A(),k.copy(j).lerp(G,re),W[E*3]=k.r,W[E*3+1]=k.g,W[E*3+2]=k.b}const B=t.track(new H);B.setAttribute("position",new z(y,3)),B.setAttribute("aSize",new z(M,1)),B.setAttribute("aSeed",new z(L,1)),B.setAttribute("aColor",new z(W,3)),h=new q(B,t.shader({vertexShader:J,fragmentShader:ee,uniforms:{...t.common,uScale:{value:140}}})),h.rotation.set(.42-a%2*.2,0,.3),h.frustumCulled=!1,u.add(h)}let b=null;v===2&&(b=new V(o.aurora,t.shader({vertexShader:$e,fragmentShader:Ye,side:2,uniforms:{...t.common,uColor:{value:new S(e.b)},uSeed:{value:e.seed*1.3}}})),b.scale.setScalar(n*.62),b.position.y=n*.86,b.rotation.x=Math.PI/2,u.add(b));const C=[],T=[],_=v===0?2:v===3?1:0;for(let x=0;x<_;x++){const A=le(t,{a:"#9aa3b8",b:e.a,seed:40+a+x,kind:2},512);T.push(A);const y=t.track(new R({vertexShader:ne,fragmentShader:xe(2),uniforms:{tNoise:t.common.tNoise,uTime:t.common.uTime,uA:{value:new S("#9aa3b8")},uB:{value:new S(e.a)},uLightPos:{value:f},uSeed:{value:40+a+x},tAlbedo:{value:A.albedo.texture},tData:{value:A.data.texture},uTexel:{value:new U(1/512,2/512)}}})),M=new V(o.moon,y),L=n*(.16+x*.07);M.scale.setScalar(L),u.add(M),C.push({mesh:M,r:n*(2.1+x*.9),speed:.22-x*.07,phase:a+x*2.1,tilt:.3+x*.25})}t.scene.add(u);const F=.045+v%3*.02;return t.track({dispose(){m.dispose(),T.forEach(x=>x.dispose())}}),{group:u,planet:d,pos:s,radius:n,spin:F,keyLight:f,upgrade(){if(m.size>=i.size)return;const x=le(t,e,i.size);c(x),m.dispose(),m=x},update(x,A){d.rotation.y+=x*F,w&&(w.rotation.y+=x*F*1.35),h&&(h.rotation.y+=x*.02),b&&(b.rotation.z+=x*.15);for(const y of C){const M=y.phase+A*y.speed;y.mesh.position.set(Math.cos(M)*y.r,Math.sin(M)*y.r*Math.sin(y.tilt),Math.sin(M)*y.r*Math.cos(y.tilt))}}}}function jt(t,e,o,a,i=77){const s=O(i),n=new Float32Array(a*3),v=new Float32Array(a),u=new Float32Array(a),g=new Float32Array(a*3);for(let m=0;m<a;m++){n[m*3]=e.x+(s()-.5)*2*o.x,n[m*3+1]=e.y+(s()-.5)*2*o.y,n[m*3+2]=e.z+(s()-.5)*2*o.z,v[m]=.25+Math.pow(s(),4)*1.4,u[m]=s();const r=.5+s()*.5;g[m*3]=r,g[m*3+1]=r,g[m*3+2]=r*(.9+s()*.1)}const l=t.track(new H);l.setAttribute("position",new z(n,3)),l.setAttribute("aSize",new z(v,1)),l.setAttribute("aSeed",new z(u,1)),l.setAttribute("aColor",new z(g,3));const f=new q(l,t.shader({vertexShader:J,fragmentShader:ee,uniforms:{...t.common,uScale:{value:60}}}));return f.frustumCulled=!1,t.scene.add(f),f}function Qt(t,e=N.comets){const a=e*30,i=new Float32Array(a*3),s=new Float32Array(a),n=new Float32Array(a),v=new Float32Array(a*3),u=O(91),g=[],l=d=>{const p=u()*2-1,w=u()*Math.PI*2,h=Math.sqrt(1-p*p),b=170+u()*170;d.a.set(h*Math.cos(w)*b,p*b*.45+12,h*Math.sin(w)*b),d.d.set(u()-.5,(u()-.5)*.35,u()-.5).normalize(),d.speed=45+u()*55,d.life=4+u()*5,d.t=-u()*7};for(let d=0;d<e;d++){const p={a:new P,d:new P,t:0,speed:0,life:1};l(p),g.push(p);for(let w=0;w<30;w++){const h=d*30+w;s[h]=2.4-w*.07,n[h]=u(),v[h*3]=.85,v[h*3+1]=.93,v[h*3+2]=1}}const f=t.track(new H),m=new z(i,3);m.setUsage(35048),f.setAttribute("position",m),f.setAttribute("aSize",new z(s,1)),f.setAttribute("aSeed",new z(n,1)),f.setAttribute("aColor",new z(v,3));const r=new q(f,t.shader({vertexShader:J,fragmentShader:ee,uniforms:{...t.common,uScale:{value:260}}}));r.frustumCulled=!1,t.scene.add(r);const c=new P;return{update(d){g.forEach((p,w)=>{p.t+=d,p.t>p.life&&l(p);const h=p.t>0;c.copy(p.a).addScaledVector(p.d,p.speed*Math.max(0,p.t));for(let b=0;b<30;b++){const C=w*30+b;h?(i[C*3]=c.x-p.d.x*b*1.1,i[C*3+1]=c.y-p.d.y*b*1.1,i[C*3+2]=c.z-p.d.z*b*1.1):(i[C*3]=1e5,i[C*3+1]=1e5,i[C*3+2]=1e5)}}),m.needsUpdate=!0}}}const pt=16e4,D=2,Ce=7;function gt(t){const e=getComputedStyle(t);return t.classList.contains("gradient-text")||e.backgroundClip==="text"||e.webkitBackgroundClip==="text"}function bt(t){const e=[],o=[],a=new Map,i=r=>{let c=r;for(;c&&c!==t.parentElement;){let d=a.get(c);if(d===void 0&&(d=gt(c),a.set(c,d)),d)return!0;c=c.parentElement}return!1},s=[],n=r=>{r.childNodes.forEach(c=>{c.nodeType===Node.TEXT_NODE?(c.textContent||"").trim()&&s.push(c):c.nodeType===Node.ELEMENT_NODE&&n(c)})};n(t);for(const r of s){const c=r.parentNode;if(!c)continue;const d=i(c),p=document.createDocumentFragment(),w=[];for(const h of(r.textContent||"").split(/(\s+)/))if(h)if(/^\s+$/.test(h)){const b=document.createTextNode(h);p.appendChild(b),w.push(b)}else{const b=document.createElement("span");b.textContent=h,p.appendChild(b),w.push(b),o.push({span:b,text:h,gradient:d})}c.replaceChild(p,r),e.push({parent:c,original:r,inserted:w})}const v=t.getBoundingClientRect(),u=[];for(const r of o){const c=Array.from(r.span.getClientRects());if(!c.length)continue;let d=c[0];for(const p of c)p.width*p.height>d.width*d.height&&(d=p);d.width<.5||d.height<.5||u.push({text:r.text,gradient:r.gradient,x:d.left-v.left,y:d.top-v.top,w:d.width,h:d.height})}for(const{parent:r,original:c,inserted:d}of e)r.insertBefore(c,d[0]),d.forEach(p=>p.remove());if(!u.length)return null;const g=Math.min(...u.map(r=>r.x)),l=Math.min(...u.map(r=>r.y)),f=Math.max(...u.map(r=>r.x+r.w)),m=Math.max(...u.map(r=>r.y+r.h));return{words:u,left:g,top:l,width:f-g,height:m-l}}function wt(t,e){const o=bt(t);if(!o)return null;const a=getComputedStyle(t),i=parseFloat(a.fontSize)||48,s=i*D,n=a.fontWeight||"700",v=a.fontFamily||"sans-serif",u=(parseFloat(a.letterSpacing)||0)*D,g=a.color&&a.color!=="rgba(0, 0, 0, 0)"?a.color:"#ffffff",l=4,f=Math.ceil(o.width*D)+l*2,m=Math.ceil(o.height*D)+l*2;if(f>4096||m>4096||f<2||m<2)return null;const r=document.createElement("canvas");r.width=f,r.height=m;const c=r.getContext("2d",{willReadFrequently:!0});if(!c)return null;c.font=`${n} ${s}px ${v}`;const d=c;"letterSpacing"in d&&(d.letterSpacing=`${u}px`),d.direction=a.direction==="rtl"?"rtl":"ltr",c.textBaseline="alphabetic",c.textAlign="left";const p=c.measureText("Hg"),w=p.fontBoundingBoxAscent||s*.78,h=p.fontBoundingBoxDescent||s*.22;for(const y of o.words){const M=(y.x-o.left)*D+l,W=(y.y-o.top)*D+l+(y.h*D-(w+h))/2+w;if(y.gradient){const j=c.createLinearGradient(M,0,M+y.w*D,0);e.forEach((G,k)=>j.addColorStop(e.length>1?k/(e.length-1):0,G)),c.fillStyle=j}else c.fillStyle=g;c.fillText(y.text,M,W)}const b=c.getImageData(0,0,f,m).data;let C=Math.max(1,Math.round(Math.min(3,Math.max(1,i/40))*D)),T=0;for(;;){T=0;for(let y=0;y<m;y+=C)for(let M=0;M<f;M+=C)b[(y*f+M)*4+3]>96&&T++;if(T<=pt||C>=12)break;C++}const _=new Float32Array(T*3),F=new Float32Array(T*3),x=O(T+f);let A=0;for(let y=0;y<m;y+=C)for(let M=0;M<f;M+=C){const L=(y*f+M)*4;b[L+3]<=96||(_[A*3]=(M-f/2+(x()-.5)*.5*C)/D,_[A*3+1]=(m/2-y+(x()-.5)*.5*C)/D,_[A*3+2]=(x()-.5)*1.2,F[A*3]=b[L]/255,F[A*3+1]=b[L+1]/255,F[A*3+2]=b[L+2]/255,A++)}return{positions:_,colors:F,count:T,w:f/D,h:m/D,offX:o.left-l/D,offY:o.top-l/D,stride:C/D,cssSize:i}}function Kt(t,e,o,a){const i=o.map(r=>({el:r,points:null,mat:null,lens:null,lensMat:null,assemble:0,width:0,blockW:0,blockH:0,offX:0,offY:0,stride:1,cssSize:48,travel:1})),s=new P,n=new P,v=new P,u=new P,g=new P,l=r=>{r.points&&(t.overlay.remove(r.points),r.points.geometry.dispose(),r.mat?.dispose(),r.points=null,r.mat=null);const c=wt(r.el,a);if(!c||!c.count)return;const d=new H;d.setAttribute("position",new z(c.positions,3)),d.setAttribute("aColor",new z(c.colors,3));const p=new Float32Array(c.count),w=new Float32Array(c.count*3),h=O(c.count*7+3),b=Math.max(c.w,c.h)*1.6;for(let _=0;_<c.count;_++){p[_]=h();const F=h()*2-1,x=h()*Math.PI*2,A=Math.sqrt(1-F*F),y=b*(.5+h()*.8);w[_*3]=A*Math.cos(x)*y,w[_*3+1]=F*y*.6,w[_*3+2]=A*Math.sin(x)*y*.35}d.setAttribute("aSeed",new z(p,1)),d.setAttribute("aScatter",new z(w,3));const C=t.shader({vertexShader:Je,fragmentShader:et,depthTest:!1,uniforms:{...t.common,uAssemble:{value:0},uScale:{value:1},uOrigin:{value:new P},uRight:{value:new P(1,0,0)},uUp:{value:new P(0,1,0)},uFwd:{value:new P(0,0,-1)},uSize:{value:2.4},uAlpha:{value:1},uTravel:{value:26}}}),T=new q(d,C);if(T.frustumCulled=!1,T.renderOrder=20,T.visible=!1,t.overlay.add(T),r.points=T,r.mat=C,!r.lens){const _=t.shader({vertexShader:tt,fragmentShader:ot,depthTest:!1,blending:ve,uniforms:{uOrigin:{value:new P},uRight:{value:new P(1,0,0)},uUp:{value:new P(0,1,0)},uW:{value:1},uH:{value:1},uColor:{value:new S(t.pal.top)},uOpacity:{value:0}}},!1),F=new V(t.quad,_);F.frustumCulled=!1,F.renderOrder=19,F.visible=!1,t.overlay.add(F),r.lens=F,r.lensMat=_}r.width=r.el.clientWidth,r.blockW=c.w,r.blockH=c.h,r.offX=c.offX,r.offY=c.offY,r.stride=c.stride,r.cssSize=c.cssSize},f=document.fonts?.ready??Promise.resolve();let m=!1;return f.then(()=>{i.forEach(l),m=!0}),{refresh(){m&&i.forEach(l)},update(r,c,d,p){if(!m)return;e.updateMatrixWorld(),v.setFromMatrixColumn(e.matrixWorld,0).normalize(),u.setFromMatrixColumn(e.matrixWorld,1).normalize(),g.setFromMatrixColumn(e.matrixWorld,2).normalize().multiplyScalar(-1);const w=2*Ce*Math.tan(e.fov*Math.PI/360)/p;for(const h of i){if(!h.points||!h.mat||(Math.abs(h.el.clientWidth-h.width)>h.width*.08&&l(h),!h.points||!h.mat))continue;const b=h.el.getBoundingClientRect(),C=b.bottom>-p*.6&&b.top<p*1.6,T=b.top+b.height/2,_=h.el.closest("[data-build-item]"),F=_?_.dataset.state==="active":!0,x=F?1-se((Math.abs(T-p/2)-p*.34)/(p*.22)):0,A=C?x:0;h.assemble<.02?h.travel=1:h.assemble>.98&&(h.travel=-1),h.assemble=ht(h.assemble,A,F?3.2:4.5,r);const y=C&&h.assemble>.004;if(h.points.visible=y,h.lens&&(h.lens.visible=y),!y)continue;const M=b.left+h.offX,L=b.top+h.offY,W=(M+h.blockW/2)/d*2-1,j=-((L+h.blockH/2)/p*2-1);s.set(W,j,.5).unproject(e),n.copy(s).sub(e.position).normalize();const G=Ce/Math.max(.2,n.dot(g)),k=h.mat.uniforms;if(k.uOrigin.value.copy(e.position).addScaledVector(n,G),k.uRight.value.copy(v),k.uUp.value.copy(u),k.uFwd.value.copy(g),k.uScale.value=w,k.uAssemble.value=h.assemble,k.uTravel.value=h.travel>0?26:-9,h.lensMat){const B=h.lensMat.uniforms;B.uOrigin.value.copy(k.uOrigin.value).addScaledVector(g,.4),B.uRight.value.copy(v),B.uUp.value.copy(u),B.uW.value=h.blockW*w*1.9,B.uH.value=h.blockH*w*2.6,B.uColor.value.set(t.pal.top),B.uOpacity.value=.86*se(h.assemble*1.4)}k.uSize.value=Math.max(1.6,h.stride*1.8),k.uAlpha.value=se(h.assemble*1.6)}},dispose(){for(const r of i)r.points&&(t.overlay.remove(r.points),r.points.geometry.dispose(),r.mat?.dispose()),r.lens&&t.overlay.remove(r.lens);i.length=0}}}export{$e as A,O as B,At as C,be as D,we as E,Vt as a,Lt as b,Nt as c,Et as d,Ot as e,Wt as f,Qt as g,It as h,Ht as i,St as j,jt as k,Tt as l,Mt as m,kt as n,Kt as o,Rt as p,Bt as q,Ct as r,Ft as s,Dt as t,se as u,ht as v,_t as w,zt as x,Ut as y,Pt as z};
