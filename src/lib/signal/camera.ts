/** Camera for the signal segment: arc-length evaluated so spacing never authors a speed spike, roll pinned to zero, pure at every t. */
import * as THREE from 'three';
import type { CameraPath, CameraPose } from './types';

/** Arc-length table resolution. Sampled once at build time, immutable afterwards. */
const SAMPLES = 256;
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const forward = new THREE.Vector3(), right = new THREE.Vector3(), screenUp = new THREE.Vector3();

const unit = (v: number) => (Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const copy = (p: CameraPose): CameraPose => ({
  position: [p.position[0], p.position[1], p.position[2]],
  look: [p.look[0], p.look[1], p.look[2]],
  fov: p.fov,
});

/** Duplicate both endpoints so a Catmull-Rom has real neighbours at the ends — and so two poses are a valid path. */
function pad<T>(values: T[]): T[] {
  return [values[0], ...values, values[values.length - 1]];
}

function curveOf(points: [number, number, number][]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(pad(points).map(p => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal');
}

/** Uniform Catmull-Rom over padded scalars, in the same index space three uses for the vector curves. */
function scalarAt(values: number[], s: number): number {
  const segments = values.length - 1;
  const p = segments * s;
  const i = Math.min(Math.max(Math.floor(p), 0), segments - 1);
  const w = p - i, w2 = w * w, w3 = w2 * w;
  const a = values[Math.max(i - 1, 0)], b = values[i], c = values[i + 1], d = values[Math.min(i + 2, segments)];
  return .5 * (2 * b + (c - a) * w + (2 * a - 5 * b + 4 * c - d) * w2 + (3 * b - 3 * c + d - a) * w3);
}

/**
 * Position, look and fov share one curve parameter, so they stay in step, and that
 * parameter is driven by cumulative arc length, so constant dt is constant world speed.
 * Any ramp has to be authored into the poses; none arrives from the spline.
 */
export function buildPath(poses: CameraPose[]): CameraPath {
  if (poses.length === 0) throw new Error('buildPath: at least one pose');
  if (poses.length === 1) {
    const only = copy(poses[0]);
    return { anchors: [0], at: () => copy(only) };
  }

  const n = poses.length, segments = n + 1;
  // Padding added two degenerate end segments; map [0,1] onto the authored interior only.
  const sAt = (v: number) => (1 + v * (n - 1)) / segments;
  const position = curveOf(poses.map(p => p.position));
  const look = curveOf(poses.map(p => p.look));
  const fovs = pad(poses.map(p => p.fov));
  const fovMin = Math.min(...fovs), fovMax = Math.max(...fovs);

  const lengths = new Float64Array(SAMPLES + 1);
  const probe = new THREE.Vector3(), previous = position.getPoint(sAt(0));
  for (let i = 1; i <= SAMPLES; i++) {
    position.getPoint(sAt(i / SAMPLES), probe);
    lengths[i] = lengths[i - 1] + probe.distanceTo(previous);
    previous.copy(probe);
  }
  const total = lengths[SAMPLES];

  /** Cumulative-length table inverted by binary search plus one linear step inside the cell. */
  function arcInverse(t: number): number {
    if (total <= 1e-9) return t;
    const target = t * total;
    let lo = 0, hi = SAMPLES;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lengths[mid] <= target) lo = mid; else hi = mid - 1;
    }
    if (lo >= SAMPLES) return 1;
    const cell = lengths[lo + 1] - lengths[lo];
    return (lo + (cell > 1e-12 ? (target - lengths[lo]) / cell : 0)) / SAMPLES;
  }

  // Where each authored pose falls along the arc, as the t that reaches it: a
  // chapter that must creep through one exact keyframe reads it from here rather
  // than guessing the spline's arc lengths.
  // The length table is sampled at sAt(i / SAMPLES), so authored pose j sits at
  // sample j / (n - 1) * SAMPLES; its arc fraction is the t that reaches it.
  const anchors: number[] = [];
  for (let j = 0; j < n; j++) {
    const k = Math.min(SAMPLES, Math.max(0, Math.round((j / (n - 1)) * SAMPLES)));
    anchors.push(total > 1e-9 ? lengths[k] / total : j / (n - 1));
  }

  const atP = new THREE.Vector3(), atL = new THREE.Vector3();
  return {
    anchors,
    at(t: number): CameraPose {
      const s = sAt(arcInverse(unit(t)));
      position.getPoint(s, atP);
      look.getPoint(s, atL);
      return {
        position: [atP.x, atP.y, atP.z],
        look: [atL.x, atL.y, atL.z],
        // Clamped to the authored range: a spline overshoot in fov would be an unauthored zoom.
        fov: Math.min(Math.max(scalarAt(fovs, s), fovMin), fovMax),
      };
    },
  };
}

export function blendPose(a: CameraPose, b: CameraPose, t: number): CameraPose {
  const k = unit(t);
  return {
    position: [lerp(a.position[0], b.position[0], k), lerp(a.position[1], b.position[1], k), lerp(a.position[2], b.position[2], k)],
    look: [lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k)],
    fov: lerp(a.fov, b.fov, k),
  };
}

export function applyPose(camera: THREE.PerspectiveCamera, pose: CameraPose): void {
  camera.position.set(pose.position[0], pose.position[1], pose.position[2]);
  camera.up.copy(WORLD_UP);
  camera.lookAt(pose.look[0], pose.look[1], pose.look[2]);
  if (Number.isFinite(pose.fov) && camera.fov !== pose.fov) {
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();
  }
}

/**
 * Pointer nudge in the view plane. The subject stays framed — look and fov are untouched —
 * and `amount` is the caller's kill switch: drive it to 0 at alignment-critical handoffs.
 */
export function microParallax(pose: CameraPose, x: number, y: number, amount: number): CameraPose {
  const out = copy(pose);
  if (!Number.isFinite(amount) || amount === 0 || !Number.isFinite(x) || !Number.isFinite(y)) return out;
  forward.set(pose.look[0] - pose.position[0], pose.look[1] - pose.position[1], pose.look[2] - pose.position[2]);
  if (forward.lengthSq() < 1e-12) return out;
  forward.normalize();
  right.crossVectors(forward, WORLD_UP);
  if (right.lengthSq() < 1e-8) right.set(1, 0, 0); else right.normalize();
  screenUp.crossVectors(right, forward).normalize();
  const dx = Math.min(Math.max(x, -1), 1) * amount, dy = Math.min(Math.max(y, -1), 1) * amount;
  out.position[0] += right.x * dx + screenUp.x * dy;
  out.position[1] += right.y * dx + screenUp.y * dy;
  out.position[2] += right.z * dx + screenUp.z * dy;
  return out;
}

/** World-space height of the view frustum `distance` in front of the camera — used to size a 3D surface to an HTML image. */
export function frameHeightAt(pose: CameraPose, distance: number): number {
  return 2 * Math.max(distance, 0) * Math.tan(THREE.MathUtils.degToRad(pose.fov) / 2);
}

/** Deterministic, DOM-free. Returns human-readable failures; empty means pass. */
export function selfCheck(): string[] {
  const fail: string[] = [];
  const gap = (a: CameraPose, b: CameraPose) =>
    Math.hypot(a.position[0] - b.position[0], a.position[1] - b.position[1], a.position[2] - b.position[2]);
  const identical = (a: CameraPose, b: CameraPose) =>
    a.fov === b.fov && a.position.every((v, i) => v === b.position[i]) && a.look.every((v, i) => v === b.look[i]);
  const round = (v: number) => Math.round(v * 1e4) / 1e4;

  // Deliberately uneven spacing: three near-identical poses, then two long hauls.
  const uneven: CameraPose[] = [
    { position: [0, 0, 0], look: [0, 0, -6], fov: 38 },
    { position: [0.4, 0.1, -0.3], look: [0, 0, -6], fov: 38 },
    { position: [0.9, 0.2, -0.7], look: [0, 0.2, -6], fov: 34 },
    { position: [9, 1.4, -5], look: [0, 0.4, -7], fov: 30 },
    { position: [14, 1.6, -9], look: [0, 0.4, -8], fov: 30 },
  ];
  const path = buildPath(uneven);

  // 1. Constant speed: equal dt must cover near-equal world distance despite the spacing.
  const steps = 64, hops: number[] = [];
  for (let i = 0; i < steps; i++) hops.push(gap(path.at(i / steps), path.at((i + 1) / steps)));
  const low = Math.min(...hops), high = Math.max(...hops);
  if (low <= 0) fail.push('buildPath: a sample step covered zero distance');
  else if (high / low > 1.05) fail.push(`buildPath: speed spike, step ratio ${round(high / low)} over uneven control points (want <= 1.05)`);

  // 2. Purity: same t, same pose, and never the same object back.
  const first = path.at(0.37), second = path.at(0.37);
  if (!identical(first, second)) fail.push('buildPath: at(0.37) twice returned different poses');
  if (first === second || first.position === second.position) fail.push('buildPath: at() handed back a shared object');

  // 3. Approach independence: the same u from above, below or cold must be bit-identical.
  const cold = path.at(0.62);
  path.at(0.05); path.at(0.2); path.at(0.5);
  const fromBelow = path.at(0.62);
  path.at(1); path.at(0.95); path.at(0.8);
  const fromAbove = path.at(0.62);
  if (!identical(cold, fromBelow)) fail.push('buildPath: at(0.62) differed when approached from below');
  if (!identical(cold, fromAbove)) fail.push('buildPath: at(0.62) differed when approached from above');

  // 4. Clamping and endpoints.
  if (!identical(path.at(-2), path.at(0))) fail.push('buildPath: at(-2) did not clamp to at(0)');
  if (!identical(path.at(3), path.at(1))) fail.push('buildPath: at(3) did not clamp to at(1)');
  if (!Number.isFinite(path.at(Number.NaN).position[0])) fail.push('buildPath: at(NaN) produced a non-finite pose');
  const head = path.at(0), tail = path.at(1);
  if (gap(head, uneven[0]) > 1e-6) fail.push(`buildPath: at(0) missed the first pose by ${round(gap(head, uneven[0]))}`);
  if (gap(tail, uneven[4]) > 1e-6) fail.push(`buildPath: at(1) missed the last pose by ${round(gap(tail, uneven[4]))}`);
  if (head.fov !== 38 || tail.fov !== 30) fail.push(`buildPath: endpoint fov drifted (${round(head.fov)}, ${round(tail.fov)})`);
  for (let i = 0; i <= 32; i++) {
    const f = path.at(i / 32).fov;
    if (f < 30 - 1e-9 || f > 38 + 1e-9) { fail.push(`buildPath: fov ${round(f)} overshot the authored 30..38 range`); break; }
  }

  // 5. One pose is a static camera; two poses must build.
  const still = buildPath([uneven[2]]);
  if (gap(still.at(0), uneven[2]) !== 0 || gap(still.at(0.73), uneven[2]) !== 0 || still.at(1).fov !== 34)
    fail.push('buildPath: the single-pose path was not static');
  if (still.at(0.5) === still.at(0.5)) fail.push('buildPath: the single-pose path leaked its stored pose');
  const pair = buildPath([uneven[0], uneven[4]]);
  const middle = pair.at(0.5);
  if (Math.abs(middle.position[0] - 7) > 1e-3 || Math.abs(middle.position[2] + 4.5) > 1e-3)
    fail.push(`buildPath: the two-pose midpoint was (${round(middle.position[0])}, ${round(middle.position[2])}), want (7, -4.5)`);

  // 6. blendPose.
  const a = uneven[0], b = uneven[4];
  if (!identical(blendPose(a, b, 0), a) || !identical(blendPose(a, b, 1), b)) fail.push('blendPose: endpoints are not the inputs');
  if (!identical(blendPose(a, b, -1), a) || !identical(blendPose(a, b, 4), b)) fail.push('blendPose: t was not clamped');
  const half = blendPose(a, b, 0.5);
  if (half.position[0] !== 7 || half.fov !== 34) fail.push('blendPose: midpoint is not the average');
  if (blendPose(a, b, 0).position === a.position) fail.push('blendPose: aliased an input array');

  // 7. microParallax: perpendicular, framing-preserving, and switchable off.
  const base = path.at(0.45);
  const nudged = microParallax(base, 1, -0.5, 0.08);
  const view = [base.look[0] - base.position[0], base.look[1] - base.position[1], base.look[2] - base.position[2]];
  const shift = [nudged.position[0] - base.position[0], nudged.position[1] - base.position[1], nudged.position[2] - base.position[2]];
  const along = (view[0] * shift[0] + view[1] * shift[1] + view[2] * shift[2]) / Math.hypot(view[0], view[1], view[2]);
  if (Math.abs(along) > 1e-9) fail.push(`microParallax: moved ${round(along)} along the view axis`);
  const size = Math.hypot(shift[0], shift[1], shift[2]);
  if (Math.abs(size - Math.hypot(0.08, 0.04)) > 1e-9) fail.push(`microParallax: displacement ${round(size)} did not follow amount`);
  if (nudged.fov !== base.fov) fail.push('microParallax: changed fov');
  if (nudged.look.some((v, i) => v !== base.look[i])) fail.push('microParallax: moved the look target');
  if (!identical(microParallax(base, 1, 1, 0), base)) fail.push('microParallax: amount 0 still displaced the camera');
  if (!identical(microParallax(base, 5, -9, 0.08), microParallax(base, 1, -1, 0.08))) fail.push('microParallax: pointer offsets were not clamped to [-1,1]');

  // 8. frameHeightAt against a hand-checked value: 90 degrees at 1 unit spans 2 units.
  if (Math.abs(frameHeightAt({ position: [0, 0, 0], look: [0, 0, -1], fov: 90 }, 1) - 2) > 1e-9)
    fail.push('frameHeightAt: 90 degrees at distance 1 was not 2');
  if (frameHeightAt(uneven[0], 0) !== 0) fail.push('frameHeightAt: distance 0 was not 0');

  // 9. applyPose: roll pinned, projection matrix rebuilt only on an fov change.
  const camera = new THREE.PerspectiveCamera(38, 1.6, 0.1, 100);
  let rebuilds = 0;
  const rebuild = camera.updateProjectionMatrix.bind(camera);
  camera.updateProjectionMatrix = () => { rebuilds++; rebuild(); };
  camera.up.set(0.3, 0.8, -0.5);
  camera.rotation.z = 0.7;
  applyPose(camera, uneven[0]);
  if (rebuilds !== 0) fail.push('applyPose: rebuilt the projection matrix although fov was unchanged');
  if (camera.up.x !== 0 || camera.up.y !== 1 || camera.up.z !== 0) fail.push('applyPose: left camera.up drifted');
  const localRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  if (Math.abs(localRight.y) > 1e-9) fail.push(`applyPose: roll leaked, right vector tilted by ${round(localRight.y)}`);
  applyPose(camera, uneven[4]);
  if (rebuilds !== 1) fail.push(`applyPose: ${rebuilds} projection rebuilds across one fov change, want 1`);
  if (camera.fov !== 30) fail.push('applyPose: fov was not applied');

  return fail;
}
