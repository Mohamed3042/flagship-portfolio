/**
 * The recurring material: one point cloud that becomes every form in the story.
 *
 * Point identity is the vertex index and never changes. A morph swaps which two
 * target sets the shader interpolates between and moves one uniform; it never
 * re-pairs points, resamples, or reseeds. That is what lets reverse scroll
 * reconstruct an earlier state exactly instead of replaying an animation.
 */
import * as THREE from 'three';
import type { ShapeId, ShapeTarget, Tier, TierBudget } from './types';

/**
 * Fraction of the morph each point is allowed to lag by, spread across the
 * index partition. Anchors carry 0 and land first; interior detail carries the
 * full value and lands last. This is the plan's formation grammar -- anchors,
 * principal edges, then detail -- expressed as a per-index offset rather than a
 * sequence of timed events, so it survives a jump to arbitrary progress.
 */
const STAGGER = 0.35;

const vertex = /* glsl */ `
  attribute vec3 aSource;
  attribute vec3 aTarget;
  attribute vec3 aFlow;
  attribute float aWeight;
  attribute float aStagger;

  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBreath;

  varying float vWeight;
  varying float vDepth;

  // smoothstep-eased local progress, offset per point so anchors arrive first.
  float staged(float u, float lag) {
    float span = 1.0 - ${STAGGER.toFixed(2)};
    float local = clamp((u - lag) / span, 0.0, 1.0);
    return local * local * (3.0 - 2.0 * local);
  }

  void main() {
    float e = staged(uMorph, aStagger);

    // position_i(u) = (1-e)*source + e*target + sin(pi*u)*flow
    // The displacement vanishes at both ends, so a settled shape is exact.
    vec3 pos = mix(aSource, aTarget, e) + aFlow * sin(3.14159265 * e);

    // Ambient life, scaled to nothing as the morph settles: a resting shape is
    // genuinely still, which is what makes the reading stops readable.
    float alive = sin(e * 3.14159265);
    pos += aFlow * uBreath * alive * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    vWeight = aWeight;
    gl_Position = projectionMatrix * mv;
    float size = uSize * uPixelRatio * (0.35 + aWeight) * (9.0 / max(vDepth, 2.0));
    gl_PointSize = clamp(size, 1.0, 5.5 * uPixelRatio);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uOpacity;
  uniform float uAccentMix;

  varying float vWeight;
  varying float vDepth;

  void main() {
    // A crisp core with a restrained halo. Deliberately short of the point
    // where overlapping sprites merge into a solid white patch.
    vec2 d = gl_PointCoord - 0.5;
    float r = dot(d, d) * 4.0;
    if (r > 1.0) discard;

    float core = smoothstep(1.0, 0.0, r);
    float halo = pow(core, 3.0);

    vec3 tint = mix(uInk, uAccent, uAccentMix * vWeight);
    float fade = clamp(1.0 - (vDepth - 6.0) / 26.0, 0.12, 1.0);

    float alpha = (halo * 0.78 + core * 0.22) * uOpacity * fade * (0.34 + vWeight * 0.62);
    gl_FragColor = vec4(tint, min(alpha, 0.92));
  }
`;

export interface Cloud {
  points: THREE.Points;
  /**
   * Point the shader at a pair of shapes. Cheap and idempotent: calling it with
   * the pair already loaded does nothing, so it is safe to call every frame from
   * a pure evaluation of scroll progress.
   */
  setPair(from: ShapeId, to: ShapeId): void;
  /** @param morph 0 at the source shape, 1 at the target shape. */
  setMorph(morph: number): void;
  /** Ambient amplitude, driven to 0 at reading stops and under reduced motion. */
  setBreath(amount: number): void;
  setAccent(mix: number): void;
  setOpacity(value: number): void;
  dispose(): void;
}

export function createCloud(
  shapes: Record<ShapeId, ShapeTarget>,
  budget: TierBudget,
  tier: Tier,
): Cloud {
  const count = budget.morph;
  const geometry = new THREE.BufferGeometry();

  const source = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const target = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const flow = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const weight = new THREE.BufferAttribute(new Float32Array(count), 1);
  const stagger = new THREE.BufferAttribute(new Float32Array(count), 1);

  source.setUsage(THREE.DynamicDrawUsage);
  target.setUsage(THREE.DynamicDrawUsage);
  flow.setUsage(THREE.DynamicDrawUsage);
  weight.setUsage(THREE.DynamicDrawUsage);
  stagger.setUsage(THREE.DynamicDrawUsage);

  // Seeded from the index partition. setPair then folds in the destination's
  // geometry, so the formation also sweeps across the shape in space.
  for (let i = 0; i < count; i++) {
    stagger.array[i] = (i / count) * STAGGER;
  }

  geometry.setAttribute('position', source); // required by three; the shader uses aSource
  geometry.setAttribute('aSource', source);
  geometry.setAttribute('aTarget', target);
  geometry.setAttribute('aFlow', flow);
  geometry.setAttribute('aWeight', weight);
  geometry.setAttribute('aStagger', stagger);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 24);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    // Normal, not additive: overlapping points approach the ink colour and
    // stop there, instead of accumulating into a solid white patch.
    blending: THREE.NormalBlending,
    uniforms: {
      uMorph: { value: 0 },
      uSize: { value: tier === 'desktop' ? 2.6 : 3.1 },
      uPixelRatio: { value: budget.pixelRatio },
      uBreath: { value: 0 },
      uInk: { value: new THREE.Color('#f0f3f6') },
      uAccent: { value: new THREE.Color('#70b8ff') },
      uOpacity: { value: 1 },
      uAccentMix: { value: 0 },
    },
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  let loadedFrom: ShapeId | null = null;
  let loadedTo: ShapeId | null = null;

  const copy = (attribute: THREE.BufferAttribute, from: Float32Array, stride: number) => {
    const n = Math.min(from.length, count * stride);
    attribute.array.set(from.subarray(0, n));
    attribute.needsUpdate = true;
  };

  /**
   * The formation sweeps across the destination shape rather than fading in by
   * index: the visitor watches the form build in a direction. Half the lag comes
   * from the point's role (anchors lead, interior detail trails) and half from
   * where it lands along the sweep axis, so the silhouette still arrives first.
   * Derived from the target geometry, so it stays a pure function of the pair.
   */
  function restagger(positions: Float32Array) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      if (x < min) min = x;
      if (x > max) max = x;
    }
    const span = max - min || 1;
    for (let i = 0; i < count; i++) {
      const role = i / count;
      const sweep = (positions[i * 3] - min) / span;
      stagger.array[i] = (role * 0.45 + sweep * 0.55) * STAGGER;
    }
    stagger.needsUpdate = true;
  }

  function setPair(from: ShapeId, to: ShapeId) {
    if (from === loadedFrom && to === loadedTo) return;
    const a = shapes[from];
    const b = shapes[to];
    copy(source, a.positions, 3);
    copy(target, b.positions, 3);
    copy(weight, b.weights, 1);
    // The arc belongs to the transition, so it comes from the destination.
    copy(flow, b.flow, 3);
    restagger(b.positions);
    loadedFrom = from;
    loadedTo = to;
  }

  return {
    points,
    setPair,
    setMorph(morph) {
      material.uniforms.uMorph.value = THREE.MathUtils.clamp(morph, 0, 1);
    },
    setBreath(amount) {
      material.uniforms.uBreath.value = amount;
    },
    setAccent(mix) {
      material.uniforms.uAccentMix.value = THREE.MathUtils.clamp(mix, 0, 1);
    },
    setOpacity(value) {
      material.uniforms.uOpacity.value = THREE.MathUtils.clamp(value, 0, 1);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

/**
 * The distant population. It establishes scale and nothing else: small, dim,
 * and slow relative to the camera, so it never reads as noise over body text.
 */
export function createStarfield(budget: TierBudget): {
  points: THREE.Points;
  setOpacity(value: number): void;
  dispose(): void;
} {
  const count = budget.stars;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  // Deterministic: the star field is identical on every load and every reload.
  let seed = 0x9e3779b9;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const r = 26 + random() * 46;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.cos(phi) * r * 0.55;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    sizes[i] = 0.35 + random() * 0.65;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aWeight', new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color('#c8d3de'),
    size: 0.12,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  return {
    points,
    setOpacity(value) {
      material.opacity = THREE.MathUtils.clamp(value, 0, 1) * 0.5;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
