/**
 * DEEP FIELD — the star field, which is also the material the page is made of.
 *
 * There is ONE population, in three classes. It is the sky, and it is the thing
 * that assembles into the content: a subset of the same stars flies into a
 * constellation, holds while the chapter is being read, and is released back
 * into the field. Nothing is spawned, nothing is destroyed, and nothing is
 * re-paired — star i plays role i in every constellation for the life of the
 * page. That is what lets the whole illusion be scrubbed backwards.
 *
 * TWO THINGS CHANGED AFTER ROUND 1, and they are the whole difference between a
 * starfield and a deep field.
 *
 * 1. A star's world position is now FIXED. Round 1 scaled a star's x and y by
 *    its own depth, which puts it on a ray through the eye — an elegant wrap,
 *    and the reason the field read flat: a point that rides its own ray does
 *    not move on screen at all as the eye advances. It grew and brightened in
 *    place. Now x and y are metres, decided once, and the screen position is
 *    x/depth: a near star sweeps outward and accelerates as it passes, a far
 *    one barely moves. Depth is felt because it is actually there.
 *
 * 2. Density is modulated. The field is drawn from a 3D density: one diagonal
 *    band with clumps and rifts inside it, and voids away from it. A uniform
 *    scatter of equal pinpricks is a texture; this has somewhere for the eye
 *    to go.
 *
 * The field is still endless without any per-frame state. A star's depth at
 * dolly d is `mod(base - d, shell) + near`, which is a pure function, and each
 * class lives in its own shell — a scaled copy of the others, so all three have
 * the same screen statistics and none of them shows a boundary, while the
 * shallow shell sweeps past many times faster than the deep one.
 */
import * as THREE from 'three';
import { BAND, CLASS_ORDER, SHELLS, TUNNEL } from './types';
import type { Tier, TierBudget } from './types';

/** Fraction of the morph a point may lag by. Anchors land first, detail last. */
const STAGGER = 0.34;

/** The colour mix, by population share: 90% cool white, 8% warm, 2% blue. */
const COOL = '#dfe8ff';
const WARM = '#ffe3c0';
const BLUE = '#9cc4ff';

/** Hairline segments a figure may carry. */
const MAX_LINKS = 64;

const f = (n: number) => n.toFixed(4);
const vec3 = (a: number, b: number, c: number) => `vec3(${f(a)}, ${f(b)}, ${f(c)})`;
const byClass = (pick: (c: (typeof CLASS_ORDER)[number]) => number) =>
  vec3(pick(CLASS_ORDER[0]), pick(CLASS_ORDER[1]), pick(CLASS_ORDER[2]));

const common = /* glsl */ `
  attribute vec3 aHome;     // ray x, ray y, base depth inside the shell
  attribute vec4 aSeed;     // twinkle phase, size draw, colour draw, stagger
  attribute vec4 aTarget;   // camera-relative seat xyz, and the seat's weight
  attribute float aClass;   // 0 dust, 1 mid, 2 bright
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
  uniform float uSpin;      // the figure's slow breathing rotation, radians
  uniform vec3 uPivot;      // what that rotation turns about
  uniform float uPart;      // the radial parting, 0..1
  uniform float uBreath;    // the inward breath, 0..1
  uniform vec3 uCool;
  uniform vec3 uWarm;
  uniform vec3 uBlue;

  varying float vAlpha;
  varying vec3 vTint;
  varying float vHalo;
  varying float vCore;
  varying float vSpike;

  const float NEAR = ${TUNNEL.near.toFixed(2)};
  const float SPREAD_X = ${TUNNEL.spreadX.toFixed(3)};
  const float SPREAD_Y = ${TUNNEL.spreadY.toFixed(3)};
  const float STAGGER = ${STAGGER.toFixed(2)};
  const vec3 SHELL_D = ${byClass(c => SHELLS[c].depth)};
  const vec3 SIZE_FAR = ${byClass(c => SHELLS[c].size[0])};
  const vec3 SIZE_NEAR = ${byClass(c => SHELLS[c].size[1])};
  const vec3 ALPHA_FAR = ${byClass(c => SHELLS[c].alpha[0])};
  const vec3 ALPHA_NEAR = ${byClass(c => SHELLS[c].alpha[1])};
  const vec3 HALO = ${byClass(c => SHELLS[c].halo)};

  // A vector cannot be indexed by a run-time value in GLSL ES 1.0, and this
  // shader has to compile there. Two mixes cost less than the branch would.
  float pick3(vec3 v, float c) {
    return mix(mix(v.x, v.y, step(0.5, c)), v.z, step(1.5, c));
  }

  // The figure breathes: at most three degrees about its own vertical, from the
  // clock alone, and held at zero when the visitor asked for less motion.
  vec3 spun(vec3 seat) {
    vec3 rel = seat - uPivot;
    float cs = cos(uSpin);
    float sn = sin(uSpin);
    return uPivot + vec3(rel.x * cs + rel.z * sn, rel.y, -rel.x * sn + rel.z * cs);
  }

  void deepField(out vec3 pos, out float depth, out float lit, out float formed,
                 out float weight, out float wrapFade) {
    float D = pick3(SHELL_D, aClass);
    // The wrap. mod() is non-negative for a positive modulus, so a star that
    // passes the eye re-enters at the far plane with no branch and no state.
    float fieldDepth = mod(aHome.z - uDolly - uDrift, D) + NEAR;
    // Fixed metres, not a ray: THIS is what makes the near stars stream.
    vec2 home = vec2(aHome.x * SPREAD_X, aHome.y * SPREAD_Y) * D;
    vec2 fieldRay = home / fieldDepth;

    // Two field-wide moves, both pure functions of scroll: the stars part
    // radially to clear a plane, and the field draws inward for the last beat.
    float len = max(length(fieldRay), 1e-4);
    fieldRay += (fieldRay / len) * uPart * (0.34 + 0.5 * len);
    fieldRay *= 1.0 - uBreath * 0.085;

    weight = aTarget.w;
    // Per-point stagger: the formation sweeps rather than switching on, and an
    // anchor carries no lag at all, so the vertices land before the detail.
    float lag = aSeed.w * STAGGER * (1.0 - weight);
    float t = clamp((uMorph - lag) / (1.0 - STAGGER), 0.0, 1.0);
    // A seat always sits in FRONT of the eye, so z <= 0 means this recruit has
    // no seat in the current figure and simply stays in the field. That is how
    // a figure can use fewer stars than the budget without a second attribute.
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
    // (No backticks in here: this GLSL lives inside a template literal, and a
    // pair of them in a comment ends the string forty lines early.)
    // max() on the divisor, and it is not cosmetic: an unseated star carries a
    // target of exactly (0,0,0), and 0/0 is NaN. mix(a, NaN, 0.0) is NaN too,
    // because NaN * 0 is NaN — so dividing by the raw seat depth silently
    // discarded EVERY star that was not in the current figure. The sky went out.
    vec3 seat = spun(aTarget.xyz);
    vec2 seatRay = seat.xy / max(seat.z, 0.001);
    float lateral = smoothstep(0.0, 0.45, formed);
    float approach = smoothstep(0.22, 1.0, formed);
    vec2 ray = mix(fieldRay, seatRay, lateral);
    float z = mix(fieldDepth, max(seat.z, 0.001), approach);
    pos = vec3(ray * z, uCamZ - z);
    depth = z;
    // How near this star is inside ITS OWN shell, 0 at the far plane and 1 at
    // the eye. Size and brightness both read from this, which is why the three
    // classes keep their stated pixel ranges instead of drifting with depth.
    lit = 1.0 - clamp(fieldDepth / D, 0.0, 1.0);
    // Both ends of the wrap are faded, so the endless field has no seam: a star
    // arrives out of the deep and leaves past the shoulder.
    wrapFade = (1.0 - smoothstep(D * 0.88, D, fieldDepth)) * smoothstep(NEAR, NEAR + 2.5, fieldDepth);
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
    vec3 pos; float depth; float lit; float formed; float weight; float wrapFade;
    deepField(pos, depth, lit, formed, weight, wrapFade);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float ease = lit * lit * (3.0 - 2.0 * lit);
    float classSize = mix(pick3(SIZE_FAR, aClass), pick3(SIZE_NEAR, aClass), ease);
    float classAlpha = mix(pick3(ALPHA_FAR, aClass), pick3(ALPHA_NEAR, aClass), lit);

    // Seated, a star takes the figure's own hierarchy: a stroke star is a fine
    // point, an anchor grows and brightens, and the brightest anchors carry a
    // spike. A star never SHRINKS or DIMS on being recruited — the figure is
    // drawn out of the field and has to be legible against it, which the first
    // build of this shader got wrong: a seated dust star kept its 0.3 field
    // alpha and every constellation came out a ghost.
    // One seat on the page carries a weight of exactly 1: the star the last
    // chapter ends on, which has to read as the brightest thing the visitor has
    // seen. Everything below 0.97 stays inside the anchor range.
    float beacon = smoothstep(0.97, 1.0, weight);
    float seatSize = mix(2.2, 9.5, pow(weight, 2.2)) + 6.5 * beacon;
    float seatAlpha = mix(0.66, 1.0, weight);
    classAlpha = mix(classAlpha, max(classAlpha, seatAlpha), formed);
    float size = mix(classSize, max(classSize, seatSize), formed);
    float spike = formed * max(smoothstep(0.86, 1.0, weight), beacon);
    // The sprite has to be bigger than the core for the spike to have anywhere
    // to go; vCore says where the core ends inside it.
    float sprite = 1.0 + spike * 1.9;

    vTint = tintOf();
    vHalo = mix(pick3(HALO, aClass), mix(0.45, 1.0, weight), formed);
    vCore = 1.0 / sprite;
    vSpike = spike;
    vAlpha = uOpacity * wrapFade * classAlpha * twinkleOf() * revealOf();

    gl_PointSize = clamp(size * uSize * uPixelRatio * sprite, 0.8, 26.0 * uPixelRatio);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying vec3 vTint;
  varying float vHalo;
  varying float vCore;
  varying float vSpike;

  void main() {
    vec2 d = (gl_PointCoord - 0.5) * 2.0;
    float r = length(d);
    if (r > 1.0) discard;
    // A tight core with a faint halo. This IS the bloom: a real bloom pass only
    // buys back what the halo already gives, at a cost the phone cannot pay.
    float k = r / max(vCore, 0.02);
    float core = smoothstep(1.0, 0.0, k * k);
    float halo = pow(core, 4.0);
    float a = (core * (0.30 - 0.06 * vHalo) + halo * (0.70 + 0.06 * vHalo)) * vAlpha;
    if (vSpike > 0.001) {
      // Four points, not a starburst texture: two crossed slivers that fall off
      // along their own length. Wide enough to survive a pixel grid, faint
      // enough that it reads as a bright star and not as a lens flare.
      float bar = max(
        (1.0 - smoothstep(0.0, 0.05, abs(d.x))) * (1.0 - smoothstep(0.05, 1.0, abs(d.y))),
        (1.0 - smoothstep(0.0, 0.05, abs(d.y))) * (1.0 - smoothstep(0.05, 1.0, abs(d.x)))
      );
      a += bar * vSpike * vAlpha * 0.62;
    }
    if (a <= 0.002) discard;
    gl_FragColor = vec4(vTint, min(a, 0.95));
  }
`;

/** The hero stars: the same tunnel, a four-point diffraction sprite on top. */
const heroVertex = /* glsl */ `
  ${common}

  void main() {
    vec3 pos; float depth; float lit; float formed; float weight; float wrapFade;
    deepField(pos, depth, lit, formed, weight, wrapFade);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mv.z, 0.05);
    gl_Position = projectionMatrix * mv;

    vTint = tintOf();
    vHalo = 1.0;
    vCore = 0.36;
    vSpike = 1.0;
    // The hero stars are the "few stars" of the opening: they are all in before
    // the field behind them is a third of the way up.
    vAlpha = uOpacity * wrapFade * twinkleOf() * smoothstep(0.0, 0.34, uReveal) * 0.8;
    // A 6 px sprite cannot carry a diffraction spike: the bars are a few percent
    // of the sprite's width, so at that size they are sub-pixel and the hero
    // star is indistinguishable from any other point. The floor makes the shape
    // exist at all.
    gl_PointSize = clamp(uSize * uPixelRatio * (34.0 / max(dist, 3.0)), 15.0, 54.0 * uPixelRatio);
  }
`;

/** The hairlines between anchors, drawn in by dash offset as the figure lands. */
const linkVertex = /* glsl */ `
  attribute vec3 aA;
  attribute vec3 aB;
  attribute float aT;
  attribute float aOrder;

  uniform float uMorph;
  uniform float uOpacity;
  uniform float uCamZ;
  uniform float uSpin;
  uniform vec3 uPivot;
  uniform float uAlpha;

  varying float vAlpha;

  vec3 spun(vec3 seat) {
    vec3 rel = seat - uPivot;
    float cs = cos(uSpin);
    float sn = sin(uSpin);
    return uPivot + vec3(rel.x * cs + rel.z * sn, rel.y, -rel.x * sn + rel.z * cs);
  }

  void main() {
    // Drawn in from A to B once the figure is most of the way home, one segment
    // a little after the last: a dash offset, expressed as a pure function of
    // the same morph everything else reads.
    float g = clamp((uMorph - 0.60 - aOrder * 0.10) / 0.26, 0.0, 1.0);
    g = g * g * (3.0 - 2.0 * g);
    vec3 seat = mix(spun(aA), spun(aB), aT * g);
    vAlpha = uAlpha * uOpacity * smoothstep(0.58, 0.72, uMorph);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(seat.xy, uCamZ - seat.z, 1.0);
  }
`;

const linkFragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  uniform vec3 uTint;
  void main() {
    if (vAlpha <= 0.002) discard;
    gl_FragColor = vec4(uTint, vAlpha);
  }
`;

export interface Field {
  /** Everything the field draws, as one node. */
  object: THREE.Group;
  /** How many stars are currently drawn (the adaptive governor moves this). */
  readonly drawn: number;
  /** How many stars are recruitable into a constellation. */
  readonly recruits: number;
  /** Seat the recruits: `positions` is (x, y, z, weight) per star. */
  setTarget(positions: Float32Array | null): void;
  /** The hairlines for the current figure, in camera-relative seat space. */
  setLinks(segments: Float32Array | null, count: number): void;
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
  /** The figure's slow rotation, in radians, and what it turns about. */
  setSpin(radians: number, pivot: [number, number, number]): void;
  /** The radial parting that clears the centre of the frame. */
  setPart(value: number): void;
  /** The inward breath of the last beat. */
  setBreath(value: number): void;
  /** Reduce or restore the drawn count. Never reallocates. */
  setCount(count: number): void;
  /** How many of the drawn stars are inside the frustum right now. */
  visible(camera: THREE.PerspectiveCamera, dolly: number, part: number, breath: number): number;
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

/* --------------------------------------------------------- the density field */

const hash3 = (x: number, y: number, z: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
};

/** Smooth value noise in 3D. Cheap, deterministic, and it runs once per load. */
function noise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}

const fbm = (x: number, y: number, z: number) =>
  noise3(x, y, z) * 0.62 + noise3(x * 2.3 + 11, y * 2.3 - 7, z * 2.3 + 3) * 0.38;

const TILT = (BAND.tilt * Math.PI) / 180;
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);

/**
 * How dense the sky is at one point, 0..1.
 *
 * `ax, ay` are DIRECTION coordinates — the pair that decides which ray a star
 * sits on — so the band is a slab through the eye and lands as the same
 * diagonal stripe at every depth. The clumping is 3D, so the structure inside
 * the band streams past on the flight instead of sitting there like wallpaper.
 */
export function densityAt(ax: number, ay: number, z: number): number {
  const across = -ax * SIN_T + ay * COS_T;
  const along = ax * COS_T + ay * SIN_T;
  const band = Math.exp(-((across / BAND.width) ** 2));
  const base = BAND.floor + (1 - BAND.floor) * band;
  const clump = fbm(along * BAND.grain, across * BAND.grain * 1.7, z * BAND.grainZ);
  return Math.max(0, Math.min(1, base * (0.3 + 1.3 * clump)));
}

export function createField(budget: TierBudget, tier: Tier): Field {
  const count = budget.stars;
  const recruits = Math.min(budget.morph, count);
  const random = seeded(0x0deef1e1);

  const home = new Float32Array(count * 3);
  const seed = new Float32Array(count * 4);
  const target = new Float32Array(count * 4);
  const klass = new Float32Array(count);
  const role = new Float32Array(count);

  // The class pattern is fixed and repeats every twenty stars, so the shares
  // are exact AND every prefix of the buffer holds the same mix. That matters:
  // the recruits are the first indices, and a constellation drawn only out of
  // dust would have no anchors to grow.
  const PATTERN: number[] = [];
  for (let i = 0; i < 20; i++) PATTERN.push(i === 7 ? 2 : i % 4 === 3 ? 1 : 0);

  for (let i = 0; i < count; i++) {
    const c = PATTERN[i % PATTERN.length];
    const shell = SHELLS[CLASS_ORDER[c]];
    // Rejection sampling against the density field. The depth stays UNIFORM in
    // the marginal, which is what keeps the sky from pulsing as the dolly runs:
    // Round 1 learned that lesson from a recruit band that thinned the whole
    // field every time it wrapped.
    let x = 0, y = 0, z = 0;
    for (let tries = 0; tries < 24; tries++) {
      x = random() * 2 - 1;
      y = random() * 2 - 1;
      z = random() * shell.depth;
      if (random() <= densityAt(x * TUNNEL.spreadX, y * TUNNEL.spreadY, z)) break;
    }
    home[i * 3] = x;
    home[i * 3 + 1] = y;
    home[i * 3 + 2] = z;

    seed[i * 4] = random();                    // twinkle phase
    seed[i * 4 + 1] = random();                // size / rate
    seed[i * 4 + 2] = random();                // colour draw: 90 / 8 / 2
    seed[i * 4 + 3] = random();                // stagger, by noise
    klass[i] = c;
    role[i] = i < recruits ? 1 : 0;
  }

  const geometry = new THREE.BufferGeometry();
  const homeAttr = new THREE.BufferAttribute(home, 3);
  const targetAttr = new THREE.BufferAttribute(target, 4);
  targetAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', homeAttr); // three requires it; the shader uses aHome
  geometry.setAttribute('aHome', homeAttr);
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  geometry.setAttribute('aTarget', targetAttr);
  geometry.setAttribute('aClass', new THREE.BufferAttribute(klass, 1));
  geometry.setAttribute('aRole', new THREE.BufferAttribute(role, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), TUNNEL.far);

  const uniforms = {
    uDolly: { value: 0 },
    uDrift: { value: 0 },
    uMorph: { value: 0 },
    uTime: { value: 0 },
    uTwinkle: { value: 1 },
    uPixelRatio: { value: budget.pixelRatio },
    uSize: { value: tier === 'desktop' ? 1 : 0.92 },
    uOpacity: { value: 1 },
    uReveal: { value: 0 },
    uCamZ: { value: 0 },
    uSpin: { value: 0 },
    uPivot: { value: new THREE.Vector3(0, 0, 9) },
    uPart: { value: 0 },
    uBreath: { value: 0 },
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
  const heroTarget = new Float32Array(heroCount * 4);
  const heroClass = new Float32Array(heroCount);
  const heroRole = new Float32Array(heroCount);
  const heroRandom = seeded(0x51a12ed);
  const heroShell = SHELLS.bright.depth;
  for (let i = 0; i < heroCount; i++) {
    // Spread deliberately, not at random: a dozen stars left to chance clump,
    // and two diffraction spikes touching each other read as one broken sprite.
    const a = ((i + 0.5) / heroCount) * Math.PI * 2;
    const r = 0.42 + heroRandom() * 0.5;
    heroHome[i * 3] = Math.cos(a) * r;
    heroHome[i * 3 + 1] = Math.sin(a) * r * 0.86;
    heroHome[i * 3 + 2] = ((i + heroRandom() * 0.6) / heroCount) * heroShell;
    heroSeed[i * 4] = heroRandom();
    heroSeed[i * 4 + 1] = 0.35 + heroRandom() * 0.4;
    heroSeed[i * 4 + 2] = heroRandom();
    heroSeed[i * 4 + 3] = heroRandom();
    heroClass[i] = 2;
  }
  const heroGeometry = new THREE.BufferGeometry();
  const heroHomeAttr = new THREE.BufferAttribute(heroHome, 3);
  heroGeometry.setAttribute('position', heroHomeAttr);
  heroGeometry.setAttribute('aHome', heroHomeAttr);
  heroGeometry.setAttribute('aSeed', new THREE.BufferAttribute(heroSeed, 4));
  heroGeometry.setAttribute('aTarget', new THREE.BufferAttribute(heroTarget, 4));
  heroGeometry.setAttribute('aClass', new THREE.BufferAttribute(heroClass, 1));
  heroGeometry.setAttribute('aRole', new THREE.BufferAttribute(heroRole, 1));
  heroGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), TUNNEL.far);

  const heroUniforms = { ...uniforms, uSize: { value: 1 }, uMorph: { value: 0 } };
  const heroMaterial = new THREE.ShaderMaterial({
    vertexShader: heroVertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
    uniforms: heroUniforms,
  });
  const heroPoints = new THREE.Points(heroGeometry, heroMaterial);
  heroPoints.frustumCulled = false;
  heroPoints.renderOrder = 2;

  /* ---------------------------------------------------------- the hairlines */

  const linkA = new Float32Array(MAX_LINKS * 2 * 3);
  const linkB = new Float32Array(MAX_LINKS * 2 * 3);
  const linkT = new Float32Array(MAX_LINKS * 2);
  const linkOrder = new Float32Array(MAX_LINKS * 2);
  for (let i = 0; i < MAX_LINKS; i++) {
    linkT[i * 2] = 0;
    linkT[i * 2 + 1] = 1;
    linkOrder[i * 2] = i / MAX_LINKS;
    linkOrder[i * 2 + 1] = i / MAX_LINKS;
  }
  const linkGeometry = new THREE.BufferGeometry();
  const linkAattr = new THREE.BufferAttribute(linkA, 3);
  const linkBattr = new THREE.BufferAttribute(linkB, 3);
  linkAattr.setUsage(THREE.DynamicDrawUsage);
  linkBattr.setUsage(THREE.DynamicDrawUsage);
  linkGeometry.setAttribute('position', linkAattr);
  linkGeometry.setAttribute('aA', linkAattr);
  linkGeometry.setAttribute('aB', linkBattr);
  linkGeometry.setAttribute('aT', new THREE.BufferAttribute(linkT, 1));
  linkGeometry.setAttribute('aOrder', new THREE.BufferAttribute(linkOrder, 1));
  linkGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), TUNNEL.far);
  linkGeometry.setDrawRange(0, 0);
  const linkMaterial = new THREE.ShaderMaterial({
    vertexShader: linkVertex,
    fragmentShader: linkFragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uMorph: uniforms.uMorph,
      uOpacity: uniforms.uOpacity,
      uCamZ: uniforms.uCamZ,
      uSpin: uniforms.uSpin,
      uPivot: uniforms.uPivot,
      // ROUND 4: a hairline is a LEADER. It was brighter than the captions it
      // was leading to, which is what made the tools asterism read as a
      // diagram with grey text on it instead of a set of named stars.
      uAlpha: { value: 0.22 },
      uTint: { value: new THREE.Color(COOL) },
    },
  });
  const links = new THREE.LineSegments(linkGeometry, linkMaterial);
  links.frustumCulled = false;
  links.renderOrder = 3;

  const object = new THREE.Group();
  object.add(points, heroPoints, links);

  let drawn = count;
  geometry.setDrawRange(0, drawn);

  /** Recruits are the first indices, so a reduced field keeps every figure whole. */
  function setCount(next: number) {
    const clamped = Math.max(recruits, Math.min(count, Math.round(next)));
    if (clamped === drawn) return;
    drawn = clamped;
    geometry.setDrawRange(0, drawn);
  }

  const idle = new Float32Array(recruits * 4);

  return {
    object,
    get drawn() { return drawn; },
    get recruits() { return recruits; },
    setTarget(positions) {
      const src = positions ?? idle;
      const n = Math.min(src.length, recruits * 4);
      target.set(src.subarray(0, n));
      if (n < recruits * 4) target.fill(0, n, recruits * 4);
      targetAttr.needsUpdate = true;
    },
    setLinks(segments, segmentCount) {
      const n = Math.min(segmentCount, MAX_LINKS);
      if (!segments || n <= 0) {
        linkGeometry.setDrawRange(0, 0);
        return;
      }
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < 3; k++) {
          const a = segments[i * 6 + k];
          const b = segments[i * 6 + 3 + k];
          linkA[i * 6 + k] = a;
          linkA[i * 6 + 3 + k] = a;
          linkB[i * 6 + k] = b;
          linkB[i * 6 + 3 + k] = b;
        }
      }
      linkAattr.needsUpdate = true;
      linkBattr.needsUpdate = true;
      linkGeometry.setDrawRange(0, n * 2);
    },
    setMorph(value) {
      uniforms.uMorph.value = value > 1 ? 1 : value > 0 ? value : 0;
    },
    setDolly(value) { uniforms.uDolly.value = value; },
    setDrift(value) { uniforms.uDrift.value = value; },
    setTime(seconds) { uniforms.uTime.value = seconds; },
    setTwinkle(on) { uniforms.uTwinkle.value = on ? 1 : 0; },
    setOpacity(value) { uniforms.uOpacity.value = value > 1 ? 1 : value > 0 ? value : 0; },
    setReveal(value) { uniforms.uReveal.value = value > 1 ? 1 : value > 0 ? value : 0; },
    setCameraZ(z) { uniforms.uCamZ.value = z; },
    setSpin(radians, pivot) {
      uniforms.uSpin.value = radians;
      uniforms.uPivot.value.set(pivot[0], pivot[1], pivot[2]);
    },
    setPart(value) { uniforms.uPart.value = value > 1 ? 1 : value > 0 ? value : 0; },
    setBreath(value) { uniforms.uBreath.value = value > 1 ? 1 : value > 0 ? value : 0; },
    setCount,
    /**
     * How many of the drawn stars are actually inside the frustum.
     *
     * The look depends on this number, not on the allocation: a shell's box has
     * to cover the frustum at its own far plane, so a large share of every
     * shell is off screen at any moment. Counted the same way the shader places
     * them, on the CPU, so it is a measurement and not an estimate.
     */
    visible(camera, dolly, part, breath) {
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const limitY = tanHalf;
      const limitX = tanHalf * camera.aspect;
      let seen = 0;
      const step = drawn > 24000 ? 8 : 1; // a sample, then scaled: this runs on demand
      for (let i = 0; i < drawn; i += step) {
        const shell = SHELLS[CLASS_ORDER[klass[i]]];
        const D = shell.depth;
        let depth = (home[i * 3 + 2] - dolly) % D;
        if (depth < 0) depth += D;
        depth += TUNNEL.near;
        let rx = (home[i * 3] * TUNNEL.spreadX * D) / depth;
        let ry = (home[i * 3 + 1] * TUNNEL.spreadY * D) / depth;
        const len = Math.max(Math.hypot(rx, ry), 1e-4);
        const push = 1 + (part * (0.34 + 0.5 * len)) / len;
        rx = rx * push * (1 - breath * 0.085);
        ry = ry * push * (1 - breath * 0.085);
        if (Math.abs(rx) <= limitX && Math.abs(ry) <= limitY && depth < D * 0.95) seen++;
      }
      return Math.round(seen * step);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      heroGeometry.dispose();
      heroMaterial.dispose();
      linkGeometry.dispose();
      linkMaterial.dispose();
    },
  };
}
