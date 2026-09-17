/* =====================================================================
   ONE SKY — GLSL.
   Kept as plain strings so the engine chunk carries no shader loader.
   Noise is a small hash-based value noise: cheap, tileable enough for a
   planet surface seen for a few seconds, and identical on every GPU.
   ===================================================================== */

const NOISE3 = /* glsl */ `
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x),
        mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x),
        mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
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
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float twinkle = 0.72 + 0.28 * sin(uTime * (0.4 + aSeed * 1.9) + aSeed * 61.0);
  float ps = aSize * uPixel * uScale / max(-mv.z, 0.001);
  // A star closer than a few units would bloom into a disc; fade it instead.
  float near = smoothstep(0.6, 7.0, -mv.z);
  vAlpha = near * twinkle * clamp(ps, 0.0, 1.0);
  gl_PointSize = clamp(ps, 1.0, 42.0 * uPixel);
  vColor = aColor;
  gl_Position = projectionMatrix * mv;
}
`;

export const starFrag = /* glsl */ `
uniform float uLight;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
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
void main() {
  vObj = position;
  vWorldN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

/**
 * Four surface characters, cycled across the featured systems so no two
 * neighbours look alike: 0 oceanic, 1 banded giant, 2 crystalline, 3 ember.
 */
export const planetFrag = (octaves: number) => /* glsl */ `
#define OCTAVES ${octaves}
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uLightPos;
uniform float uRadius;
uniform float uSeed;
uniform float uTime;
uniform float uKind;
varying vec3 vObj;
varying vec3 vWorldN;
varying vec3 vWorldPos;
${NOISE3}
void main() {
  vec3 p = vObj / uRadius;
  vec3 N = normalize(vWorldN);
  vec3 L = normalize(uLightPos - vWorldPos);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float kind = uKind;
  vec3 base;
  float emit = 0.0;

  if (kind < 0.5) {
    float n = fbm3(p * 2.4 + uSeed);
    float land = smoothstep(0.47, 0.53, n);
    vec3 ocean = mix(uA * 0.22, uA * 0.55, fbm3(p * 6.0 + uSeed));
    vec3 ground = mix(uB * 0.55, mix(uB, vec3(0.92), 0.25), fbm3(p * 9.0 - uSeed));
    base = mix(ocean, ground, land);
    float cloud = smoothstep(0.55, 0.78, fbm3(p * 3.4 + vec3(uTime * 0.012, 0.0, uSeed)));
    base = mix(base, vec3(0.93, 0.95, 1.0), cloud * 0.75);
  } else if (kind < 1.5) {
    float turb = fbm3(p * vec3(2.0, 7.0, 2.0) + uSeed + vec3(uTime * 0.01, 0.0, 0.0));
    float bands = sin(p.y * 13.0 + turb * 4.2) * 0.5 + 0.5;
    base = mix(uA * 0.6, uB, bands);
    base = mix(base, vec3(1.0, 0.96, 0.9), smoothstep(0.72, 0.95, turb) * 0.35);
  } else if (kind < 2.5) {
    float cells = fbm3(p * 7.5 + uSeed);
    float ridge = 1.0 - abs(cells * 2.0 - 1.0);
    base = mix(mix(uA, vec3(0.9, 0.95, 1.0), 0.55), uB * 0.5, pow(ridge, 3.0));
  } else {
    // basalt crust with thin molten fissures: ridged noise, not blobs
    float n = fbm3(p * 5.2 + uSeed);
    float m = fbm3(p * 11.0 - uSeed);
    float crack = 1.0 - smoothstep(0.006, 0.028, abs(n - 0.5) + m * 0.012);
    base = mix(vec3(0.045, 0.04, 0.05), mix(uA, vec3(0.2), 0.7) * 0.35, m);
    emit = crack * 0.85;
  }

  float diff = clamp((dot(N, L) + 0.18) / 1.18, 0.0, 1.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 col = base * (0.05 + diff * 1.08);
  col += uB * fres * (0.25 + diff * 0.9);
  col += mix(uB, vec3(1.0, 0.7, 0.35), 0.45) * emit * (1.0 - diff * 0.5);
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
