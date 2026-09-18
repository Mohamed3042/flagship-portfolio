/**
 * DEEP FIELD — the star field, which is also the material the page is made of.
 *
 * There is ONE population. It is the sky, and it is the thing that assembles
 * into the content: a subset of the same stars flies into a constellation,
 * holds while the chapter is being read, and is released back into the field.
 * Nothing is spawned, nothing is destroyed, and nothing is re-paired — star i
 * plays role i in every constellation for the life of the page. That is what
 * lets the whole illusion be scrubbed backwards.
 *
 * The field is endless without any per-frame state. A star's home is
 * (unit x, unit y, base depth); its depth at progress d is
 * `mod(base - d, TUNNEL.depth)`, and its x/y scale with that depth, so each
 * star travels along a ray through the eye — exactly the parallax a straight
 * dolly produces — and re-enters at the far plane the instant it passes the
 * near one. Both are pure functions of the dolly distance.
 */
import * as THREE from 'three';
import { TUNNEL } from './types';
import type { TierBudget } from './types';

/** Fraction of the morph a point may lag by. Anchors land first, detail last. */
const STAGGER = 0.34;

/** The colour mix, by population share: 90% cool white, 8% warm, 2% blue. */
const COOL = '#dfe8ff';
const WARM = '#ffe3c0';
const BLUE = '#9cc4ff';

const common = /* glsl */ `
  attribute vec3 aHome;     // unit x, unit y, base depth
  attribute vec4 aSeed;     // twinkle phase, size, colour draw, stagger
  attribute vec3 aTarget;   // camera-relative constellation seat
  attribute float aRole;    // 1 if this star can be recruited

  uniform float uDolly;
  uniform float uDrift;
  uniform float uMorph;
  uniform float uTime;
  uniform float uTwinkle;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uOpacity;
  uniform float uReveal;
  uniform float uCamZ;
  uniform vec3 uCool;
  uniform vec3 uWarm;
  uniform vec3 uBlue;

  varying float vAlpha;
  varying vec3 vTint;

  const float DEPTH = ${TUNNEL.depth.toFixed(1)};
  const float NEAR = ${TUNNEL.near.toFixed(2)};
  const float SPREAD = ${TUNNEL.spread.toFixed(3)};
  const float STAGGER = ${STAGGER.toFixed(2)};

  void deepField(out vec3 pos, out float depth, out float formed) {
    // The wrap. mod() is non-negative for a positive modulus, so a star that
    // passes the eye re-enters at the far plane with no branch and no state.
    depth = mod(aHome.z - uDolly - uDrift, DEPTH) + NEAR;
    vec3 field = vec3(aHome.xy * depth * SPREAD, uCamZ - depth);

    // Per-point stagger: the formation sweeps rather than switching on.
    float span = 1.0 - STAGGER;
    float t = clamp((uMorph - aSeed.w * STAGGER) / span, 0.0, 1.0);
    // A seat always sits in FRONT of the eye, so z <= 0 means this recruit has
    // no seat in the current figure and simply stays in the field. That is how
    // a figure can use fewer stars than the budget without a second attribute:
    // a name wants a scatter of points, not a filled letterform.
    float seated = step(0.0001, aTarget.z);
    formed = t * t * (3.0 - 2.0 * t) * aRole * seated;

    // The flight is polar, and its two halves run at different rates.
    //
    // A straight line from a star's place in the field to its seat is invisible
    // for most of its length: a star 150 units out that is 40% of the way home
    // is still 90 units out, still tiny, still just another star. So the star
    // takes its screen DIRECTION first and its DEPTH second. The figure appears
    // early, drawn in faint far stars on exactly the right rays, and then comes
    // forward out of the deep and brightens as it arrives.
    //
    // Both rates are monotone in the formation, so the whole flight scrubs
    // backwards exactly, and at zero this is the field itself, to the last bit.
    // (No backticks in here: this GLSL lives inside a template literal, and a
    // pair of them in a comment ends the string 40 lines early.)
    // max() on the divisor, and it is not cosmetic: an unseated star carries a
    // target of exactly (0,0,0), and 0/0 is NaN. mix(a, NaN, 0.0) is NaN too,
    // because NaN * 0 is NaN — so dividing by the raw seat depth silently
    // discarded EVERY star that was not in the current figure. The sky went out.
    vec2 seatRay = aTarget.xy / max(aTarget.z, 0.001);
    float lateral = smoothstep(0.0, 0.45, formed);
    float approach = smoothstep(0.22, 1.0, formed);
    vec2 ray = mix(field.xy / depth, seatRay, lateral);
    float z = mix(depth, max(aTarget.z, 0.001), approach);
    pos = vec3(ray * z, uCamZ - z);
    depth = z;
  }

  float twinkleOf() {
    return 1.0 + uTwinkle * 0.15 * sin(uTime * (0.34 + aSeed.y * 0.46) + aSeed.x * 6.2831853);
  }

  vec3 tintOf() {
    vec3 tint = uCool;
    if (aSeed.z > 0.90) tint = uWarm;
    if (aSeed.z > 0.98) tint = uBlue;
    return tint;
  }

  // The opening: a few stars, then the field. Each star has its own place in
  // the queue (an uncorrelated seed), so the sky fills in scattered rather than
  // sweeping, and uReveal is a plain 0..1 the orchestrator can pin for a capture.
  float revealOf() {
    return smoothstep(aSeed.x - 0.10, aSeed.x, uReveal);
  }
`;

const vertex = /* glsl */ `
  ${common}

  void main() {
    vec3 pos; float depth; float formed;
    deepField(pos, depth, formed);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mv.z, 0.05);
    gl_Position = projectionMatrix * mv;

    // Both ends of the wrap are faded, so the endless field has no seam: a star
    // arrives out of the deep and leaves past the shoulder.
    float far = 1.0 - smoothstep(DEPTH * 0.86, DEPTH, depth);
    float near = smoothstep(NEAR, NEAR + 3.0, depth);
    float fade = clamp(1.0 - (dist - 18.0) / 150.0, 0.16, 1.0);

    // A recruited star brightens as it takes its seat: the figure is legible
    // against the field it was drawn out of.
    float lift = 1.0 + formed * 1.1;

    vTint = tintOf();
    vAlpha = uOpacity * far * near * fade * twinkleOf() * lift * revealOf() * (0.42 + aSeed.y * 0.34);

    float size = uSize * uPixelRatio * (0.55 + aSeed.y * 0.75) * (13.0 / max(dist, 2.2));
    gl_PointSize = clamp(size * (1.0 + formed * 0.35), 0.9, 4.6 * uPixelRatio);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying vec3 vTint;

  void main() {
    // A tight core with a faint halo. This IS the bloom: a real bloom pass only
    // buys back what the halo already gives, at a cost the phone cannot pay.
    vec2 d = gl_PointCoord - 0.5;
    float r = dot(d, d) * 4.0;
    if (r > 1.0) discard;
    float core = smoothstep(1.0, 0.0, r);
    float halo = pow(core, 4.0);
    float a = (core * 0.26 + halo * 0.74) * vAlpha;
    if (a <= 0.002) discard;
    gl_FragColor = vec4(vTint, min(a, 0.95));
  }
`;

/** The hero stars: the same tunnel, a four-point diffraction sprite on top. */
const heroVertex = /* glsl */ `
  ${common}

  void main() {
    vec3 pos; float depth; float formed;
    deepField(pos, depth, formed);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mv.z, 0.05);
    gl_Position = projectionMatrix * mv;

    float far = 1.0 - smoothstep(DEPTH * 0.86, DEPTH, depth);
    float near = smoothstep(NEAR, NEAR + 6.0, depth);
    vTint = tintOf();
    // The hero stars are the "few stars" of the opening: they are all in before
    // the field behind them is a third of the way up.
    vAlpha = uOpacity * far * near * twinkleOf() * smoothstep(0.0, 0.34, uReveal) * 0.82;
    gl_PointSize = clamp(uSize * uPixelRatio * (34.0 / max(dist, 3.0)), 6.0, 46.0 * uPixelRatio);
  }
`;

const heroFragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying vec3 vTint;

  void main() {
    vec2 d = (gl_PointCoord - 0.5) * 2.0;
    float r = length(d);
    if (r > 1.0) discard;
    float core = pow(smoothstep(1.0, 0.0, r), 6.0);
    // Four points, not a starburst texture: two thin crossed slivers that fall
    // off along their own length.
    float bar = max(
      (1.0 - smoothstep(0.0, 0.055, abs(d.x))) * (1.0 - smoothstep(0.1, 1.0, abs(d.y))),
      (1.0 - smoothstep(0.0, 0.055, abs(d.y))) * (1.0 - smoothstep(0.1, 1.0, abs(d.x)))
    );
    float a = (core * 0.9 + bar * 0.32) * vAlpha;
    if (a <= 0.002) discard;
    gl_FragColor = vec4(vTint, min(a, 0.92));
  }
`;

export interface Field {
  /** Everything the field draws, as one node. */
  object: THREE.Group;
  /** How many stars are currently drawn (the adaptive governor moves this). */
  readonly drawn: number;
  /** How many stars are recruitable into a constellation. */
  readonly recruits: number;
  /** Seat the recruits: `positions` is camera-relative XYZ, length recruits*3. */
  setTarget(positions: Float32Array | null): void;
  /** 0 in the field, 1 fully seated. Already eased by the chapter evaluator. */
  setMorph(value: number): void;
  /** Distance the eye has travelled down the tunnel, scene units. */
  setDolly(value: number): void;
  /** Ambient creep that keeps the sky alive when the scroll stops. */
  setDrift(value: number): void;
  setTime(seconds: number): void;
  setTwinkle(on: boolean): void;
  setOpacity(value: number): void;
  /** The opening: 0 is an empty sky, 1 is the whole field. */
  setReveal(value: number): void;
  setCameraZ(z: number): void;
  /** Reduce or restore the drawn count. Never reallocates. */
  setCount(count: number): void;
  dispose(): void;
}

/** Deterministic PRNG. The field is identical on every load and every reload. */
function seeded(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createField(budget: TierBudget): Field {
  const count = budget.stars;
  const recruits = Math.min(budget.morph, count);
  const random = seeded(0x0deef1e1);

  const home = new Float32Array(count * 3);
  const seed = new Float32Array(count * 4);
  const target = new Float32Array(count * 3);
  const role = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // A square, deliberately: a disc has a rim, and a rim inside the frustum is
    // the one shape in a star field that reads as a manufactured edge.
    home[i * 3] = random() * 2 - 1;
    home[i * 3 + 1] = random() * 2 - 1;
    // Uniform in depth, recruits included. Giving the recruits their own nearer
    // band made the FIELD ITSELF pulse: a fifth of the stars sat in one moving
    // slab, and every time the dolly carried that slab past the far plane the
    // sky visibly thinned. Density has to be a constant of the tunnel, not a
    // function of how far the visitor has scrolled.
    home[i * 3 + 2] = random() * TUNNEL.depth;

    seed[i * 4] = random();                    // twinkle phase
    seed[i * 4 + 1] = random();                // size / rate
    seed[i * 4 + 2] = random();                // colour draw: 90 / 8 / 2
    seed[i * 4 + 3] = random();                // stagger, by noise
    role[i] = i < recruits ? 1 : 0;
  }

  const geometry = new THREE.BufferGeometry();
  const homeAttr = new THREE.BufferAttribute(home, 3);
  const targetAttr = new THREE.BufferAttribute(target, 3);
  targetAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', homeAttr); // three requires it; the shader uses aHome
  geometry.setAttribute('aHome', homeAttr);
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  geometry.setAttribute('aTarget', targetAttr);
  geometry.setAttribute('aRole', new THREE.BufferAttribute(role, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), TUNNEL.depth);

  const uniforms = {
    uDolly: { value: 0 },
    uDrift: { value: 0 },
    uMorph: { value: 0 },
    uTime: { value: 0 },
    uTwinkle: { value: 1 },
    uPixelRatio: { value: budget.pixelRatio },
    uSize: { value: 1.35 },
    uOpacity: { value: 1 },
    uReveal: { value: 0 },
    uCamZ: { value: 0 },
    uCool: { value: new THREE.Color(COOL) },
    uWarm: { value: new THREE.Color(WARM) },
    uBlue: { value: new THREE.Color(BLUE) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    // Normal, not additive. Additive clips in the blend stage no matter what
    // the fragment shader caps, and the captures run on a software rasteriser.
    blending: THREE.NormalBlending,
    uniforms,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 1;

  /* --------------------------------------------------------- the hero stars */

  const heroCount = budget.hero;
  const heroHome = new Float32Array(heroCount * 3);
  const heroSeed = new Float32Array(heroCount * 4);
  const heroTarget = new Float32Array(heroCount * 3);
  const heroRole = new Float32Array(heroCount);
  const heroRandom = seeded(0x51a12ed);
  for (let i = 0; i < heroCount; i++) {
    heroHome[i * 3] = (heroRandom() * 2 - 1) * 0.82;
    heroHome[i * 3 + 1] = (heroRandom() * 2 - 1) * 0.7;
    // Spread them along the tunnel so one is always somewhere in the frame.
    heroHome[i * 3 + 2] = (i / heroCount) * TUNNEL.depth + heroRandom() * 6;
    heroSeed[i * 4] = heroRandom();
    heroSeed[i * 4 + 1] = 0.35 + heroRandom() * 0.4;
    heroSeed[i * 4 + 2] = heroRandom();
    heroSeed[i * 4 + 3] = heroRandom();
  }
  const heroGeometry = new THREE.BufferGeometry();
  const heroHomeAttr = new THREE.BufferAttribute(heroHome, 3);
  heroGeometry.setAttribute('position', heroHomeAttr);
  heroGeometry.setAttribute('aHome', heroHomeAttr);
  heroGeometry.setAttribute('aSeed', new THREE.BufferAttribute(heroSeed, 4));
  heroGeometry.setAttribute('aTarget', new THREE.BufferAttribute(heroTarget, 3));
  heroGeometry.setAttribute('aRole', new THREE.BufferAttribute(heroRole, 1));
  heroGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), TUNNEL.depth);

  const heroUniforms = {
    ...uniforms,
    uSize: { value: 1 },
    uMorph: { value: 0 },
  };
  const heroMaterial = new THREE.ShaderMaterial({
    vertexShader: heroVertex,
    fragmentShader: heroFragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
    uniforms: heroUniforms,
  });
  const heroPoints = new THREE.Points(heroGeometry, heroMaterial);
  heroPoints.frustumCulled = false;
  heroPoints.renderOrder = 2;

  const object = new THREE.Group();
  object.add(points, heroPoints);

  let drawn = count;
  geometry.setDrawRange(0, drawn);

  /** Recruits are the first indices, so a reduced field keeps every figure whole. */
  function setCount(next: number) {
    const clamped = Math.max(recruits, Math.min(count, Math.round(next)));
    if (clamped === drawn) return;
    drawn = clamped;
    geometry.setDrawRange(0, drawn);
  }

  const idle = new Float32Array(recruits * 3);

  return {
    object,
    get drawn() { return drawn; },
    get recruits() { return recruits; },
    setTarget(positions) {
      const src = positions ?? idle;
      const n = Math.min(src.length, recruits * 3);
      target.set(src.subarray(0, n));
      if (n < recruits * 3) target.fill(0, n, recruits * 3);
      targetAttr.needsUpdate = true;
    },
    setMorph(value) {
      uniforms.uMorph.value = value > 1 ? 1 : value > 0 ? value : 0;
    },
    setDolly(value) {
      uniforms.uDolly.value = value;
    },
    setDrift(value) {
      uniforms.uDrift.value = value;
    },
    setTime(seconds) {
      uniforms.uTime.value = seconds;
    },
    setTwinkle(on) {
      uniforms.uTwinkle.value = on ? 1 : 0;
    },
    setOpacity(value) {
      uniforms.uOpacity.value = value > 1 ? 1 : value > 0 ? value : 0;
    },
    setReveal(value) {
      uniforms.uReveal.value = value > 1 ? 1 : value > 0 ? value : 0;
    },
    setCameraZ(z) {
      uniforms.uCamZ.value = z;
    },
    setCount,
    dispose() {
      geometry.dispose();
      material.dispose();
      heroGeometry.dispose();
      heroMaterial.dispose();
    },
  };
}
