/* =====================================================================
   ONE SKY — GLSL.
   Kept as plain strings so the engine chunk carries no shader loader.
   Noise is a small hash-based value noise: cheap, tileable enough for a
   planet surface seen for a few seconds, and identical on every GPU.
   ===================================================================== */

const NOISE3 = /* glsl */ `
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
`;

/* ---------------------------------------------------------------- stars -- */

export const starVert = /* glsl */ `
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
`;

export const starFrag = /* glsl */ `
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
`;

/* --------------------------------------------------------------- nebula -- */

export const nebulaVert = /* glsl */ `
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
`;

export const nebulaFrag = (octaves: number) => /* glsl */ `
#define OCTAVES ${octaves}
uniform float uTime;
uniform float uSeed;
uniform float uOpacity;
uniform float uLight;
uniform vec3 uColA;
uniform vec3 uColB;
varying vec2 vUv;
varying float vFacing;
${NOISE3}
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
`;

/* --------------------------------------------------------------- planet -- */

export const planetVert = /* glsl */ `
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
`;

/**
 * Four surface characters, cycled across the featured systems so no two
 * neighbours look alike: 0 oceanic, 1 banded giant, 2 crystalline, 3 ember.
 *
 * The surface is BAKED once into two equirectangular textures (albedo +
 * emission, height + mask) by bakeFrag, at up to 4096×2048 for a hero
 * planet. The per-frame planet shader then only samples them, derives
 * relief from the height texture and lights the result, so it is tiny to
 * compile and cheap to draw at native phone resolution.
 */
export const bakeVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const bakeFrag = (octaves: number, kind: number) => /* glsl */ `
#define OCTAVES ${octaves}
#define KIND ${kind}
uniform vec3 uA;
uniform vec3 uB;
uniform float uSeed;
uniform float uPass;
varying vec2 vUv;
${NOISE3}
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
`;

export const planetFrag = (kind: number) => /* glsl */ `
#define OCTAVES 4
#define KIND ${kind}
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
${NOISE3}
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
`;

export const atmoVert = /* glsl */ `
varying vec3 vN;
varying vec3 vWorldPos;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const atmoFrag = /* glsl */ `
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
`;

/* ---------------------------------------------------------------- route -- */

export const routeVert = /* glsl */ `
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
`;

export const routeFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uLight;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColor, uColor * 0.45, uLight);
  gl_FragColor = vec4(col, a * vA);
}
`;

/* ------------------------------------------------------------ map stars -- */

export const mapVert = /* glsl */ `
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
`;

export const mapFrag = /* glsl */ `
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
`;

/* ----------------------------------------------------------------- glow -- */

export const glowVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  // camera-facing billboard: keep only the translation of the model-view
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec3 scale = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), 1.0);
  mv.xy += position.xy * scale.xy;
  gl_Position = projectionMatrix * mv;
}
`;

export const glowFrag = /* glsl */ `
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
`;

/* ------------------------------------------------------------- backdrop -- */

/** Fullscreen deep-space gradient drawn first, so the composer target is
 *  opaque and every additive layer composites exactly like the old
 *  transparent canvas did over the body background. */
export const bgVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.999999, 1.0);
}
`;

export const bgFrag = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uBottom;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(uBottom, uTop, vUv.y), 1.0);
}
`;

/* ------------------------------------------------------- planet extras -- */

/** Drifting cloud shell over an oceanic planet (kind 0). Shares planetVert. */
export const cloudFrag = (octaves: number) => /* glsl */ `
#define OCTAVES ${octaves}
uniform vec3 uColor;
uniform vec3 uLightPos;
uniform float uRadius;
uniform float uSeed;
uniform float uTime;
varying vec3 vObj;
varying vec3 vWorldN;
varying vec3 vWorldPos;
${NOISE3}
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
`;

/** Shared vertex for constructs, rails and aurorae: uv, normal, world and
 *  object positions all available to the fragment. */
export const constructVert = /* glsl */ `
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
`;

/** Polar aurora on a crystalline planet (kind 2): a torus band that shimmers. */
export const auroraFrag = /* glsl */ `
#define OCTAVES 3
uniform vec3 uColor;
uniform float uTime;
uniform float uSeed;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vWorldPos;
${NOISE3}
void main() {
  float n = fbm3(vec3(vUv.x * 9.0, vUv.y * 2.0, uSeed) + vec3(uTime * 0.25, 0.0, 0.0));
  float band = smoothstep(0.12, 0.45, vUv.y) * (1.0 - smoothstep(0.55, 0.95, vUv.y));
  float a = band * smoothstep(0.32, 0.8, n) * 0.8;
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - abs(dot(normalize(vN), V)), 1.5);
  gl_FragColor = vec4(mix(uColor, vec3(0.7, 1.0, 0.85), 0.35) * (0.6 + n), a * (0.5 + fres * 0.5));
}
`;

/* ------------------------------------------------------ story constructs -- */

/** The lit rail a story flight follows: a tube whose u runs along its length. */
export const railFrag = /* glsl */ `
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
`;

/** Gates, plates, towers, lattices: luminous accent-coloured light-and-glass,
 *  never a grey model. uRise assembles a part (0 → 1); uHot lights it. */
export const constructFrag = /* glsl */ `
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
`;

/* ----------------------------------------------------------------- lens -- */

/** Final pass: chromatic edges and radial streaks that answer scroll
 *  velocity, a soft vignette and animated grain. No tone mapping: the scene
 *  is authored display-referred, exactly as the old direct canvas was. */
export const lensVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const lensFrag = /* glsl */ `
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
`;

/* -------------------------------------------------------- particle text -- */

/** Headlines as points: aScatter is where a point rests before the words
 *  assemble; the target is the glyph pixel, laid on a plane in front of the
 *  camera (uOrigin + uRight·x + uUp·y) so the DOM's own layout is kept. */
export const ptextVert = /* glsl */ `
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
`;

export const ptextFrag = /* glsl */ `
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
`;

/** A soft dark (or pale, in light themes) lens the scene draws behind each
 *  particle headline, so a galaxy core or a bright plate never washes it out. */
export const lensQuadVert = /* glsl */ `
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
`;

export const lensQuadFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 c = (vUv - 0.5) * 2.0;
  float d = length(c * vec2(1.0, 1.15));
  float a = pow(clamp(1.0 - d, 0.0, 1.0), 1.5);
  gl_FragColor = vec4(uColor, a * uOpacity);
}
`;

/* ------------------------------------------------------------ gate iris -- */

/** A spoked ring on a RingGeometry (planar UVs). Two of them, counter-rotating
 *  with the scroll, interfere into a moiré iris the camera flies through. */
export const spokeVert = /* glsl */ `
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
`;

export const spokeFrag = /* glsl */ `
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
`;
