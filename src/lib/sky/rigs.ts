/* =====================================================================
   Story rigs — every system's mechanism, built along its rail.

   One part vocabulary (plates, towers, rings, lattice, stack, box, orbs,
   bars, dish, grid, wave, spiral, shield, arc, cubes, sheet) and one
   recipe per story visual. A recipe places parts at rail positions; the
   Build pin's progress assembles them ("parts rise") and lights the gates
   the camera passes ("gates light"). Every part is the same luminous
   accent-coloured light-and-glass material, never a grey model.
   ===================================================================== */
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DoubleSide,
  FrontSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  Object3D,
  PlaneGeometry,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { constructFrag, constructVert, spokeFrag, spokeVert } from './shaders';
import { clamp01, easeOut, rng, type WorldCtx } from './world';

/* ------------------------------------------------------------- recipes -- */

type PartKind =
  | 'plates'
  | 'towers'
  | 'rings'
  | 'lattice'
  | 'stack'
  | 'box'
  | 'orbs'
  | 'bars'
  | 'dish'
  | 'grid'
  | 'wave'
  | 'spiral'
  | 'shield'
  | 'arc'
  | 'cubes'
  | 'sheet';

type Tint = 'a' | 'b' | 'amber' | 'green' | 'red' | 'white';

interface PartSpec {
  kind: PartKind;
  /** where along the build span the part stands (0 → 1) and when it rises */
  at: number;
  n?: number;
  /** offsets from the rail, in rail units */
  side?: number;
  up?: number;
  size?: number;
  spread?: number;
  spin?: number;
  tint?: Tint;
  fan?: boolean;
  flat?: boolean;
}

type GateStyle = 'ring' | 'hex' | 'square' | 'valve' | 'diamond';

interface Recipe {
  gate: GateStyle;
  parts: PartSpec[];
}

const RECIPES: Record<string, Recipe> = {
  'approval-gate': {
    gate: 'valve',
    parts: [
      { kind: 'cubes', at: 0.08, n: 3, side: -3.4, up: 0.6, size: 1 },
      { kind: 'shield', at: 0.5, side: 0, up: 2.6, size: 2.2 },
      { kind: 'orbs', at: 0.86, n: 1, side: 3.2, up: 1, size: 1.6, tint: 'green' },
    ],
  },
  'encrypted-vault': {
    gate: 'ring',
    parts: [
      { kind: 'rings', at: 0.45, n: 3, side: 0, up: 3.4, size: 5.5, spin: 0.35 },
      { kind: 'cubes', at: 0.45, n: 1, side: 0, up: 3.4, size: 1.2, tint: 'white' },
      { kind: 'plates', at: 0.82, n: 2, side: -4, up: 1.2, size: 3 },
    ],
  },
  'document-stack': {
    gate: 'square',
    parts: [
      { kind: 'plates', at: 0.25, n: 3, side: -3.6, up: 1.4, size: 4, fan: true },
      { kind: 'sheet', at: 0.7, side: 3.4, up: 1.2, size: 5.5, tint: 'white' },
    ],
  },
  'packaging-dieline': {
    gate: 'square',
    parts: [
      { kind: 'plates', at: 0.18, n: 4, side: -4.2, up: 0.6, size: 2.6, flat: true },
      { kind: 'box', at: 0.62, side: 3.2, up: 0.4, size: 3.6 },
    ],
  },
  'cake-production': {
    gate: 'ring',
    parts: [
      { kind: 'stack', at: 0.3, n: 3, side: -5.6, up: -1.6, size: 2.4 },
      { kind: 'orbs', at: 0.7, n: 8, side: 3.6, up: 1.8, size: 0.7, spread: 6, spin: 0.5 },
    ],
  },
  'audit-locker': {
    gate: 'hex',
    parts: [
      { kind: 'shield', at: 0.18, side: -3.4, up: 2.2, size: 2.4, tint: 'green' },
      { kind: 'bars', at: 0.55, n: 3, side: 3.4, up: 0.3, size: 5, flat: true },
      { kind: 'rings', at: 0.55, n: 2, side: 1.2, up: 1.6, size: 1.2, spin: 0.8 },
    ],
  },
  'mft-radar': {
    gate: 'ring',
    parts: [
      { kind: 'dish', at: 0.45, side: 0, up: 0.2, size: 6.5, spin: 0.9 },
      { kind: 'orbs', at: 0.7, n: 9, side: 0, up: 0.6, size: 0.4, spread: 8.5, spin: 0.15 },
    ],
  },
  'ration-matrix': {
    gate: 'square',
    parts: [
      { kind: 'grid', at: 0.25, side: -3.8, up: 1.8, size: 6 },
      { kind: 'orbs', at: 0.5, n: 1, side: 0, up: 2.4, size: 1.5, tint: 'white' },
      { kind: 'bars', at: 0.72, n: 3, side: 3.8, up: 0, size: 4 },
    ],
  },
  'page-fitter': {
    gate: 'square',
    parts: [
      { kind: 'sheet', at: 0.3, side: -4, up: 1, size: 4.6, tint: 'white' },
      { kind: 'orbs', at: 0.55, n: 1, side: 0, up: 2.6, size: 1.2 },
      { kind: 'sheet', at: 0.8, side: 4, up: 1, size: 3.4, tint: 'white' },
    ],
  },
  'sim-tick': {
    gate: 'ring',
    parts: [
      { kind: 'grid', at: 0.22, side: 0, up: -1.6, size: 12, flat: true },
      { kind: 'rings', at: 0.55, n: 1, side: 0, up: 2.4, size: 2.4, spin: 1.4 },
      { kind: 'orbs', at: 0.55, n: 6, side: 0, up: 2.4, size: 0.35, spread: 4.6, spin: 1.2 },
    ],
  },
  'texture-transfer': {
    gate: 'ring',
    parts: [
      { kind: 'orbs', at: 0.3, n: 1, side: -4.2, up: 2.2, size: 2.4 },
      { kind: 'arc', at: 0.5, side: 0, up: 2.4, size: 8.5 },
      { kind: 'orbs', at: 0.75, n: 1, side: 4.2, up: 2.2, size: 2.4, tint: 'white' },
    ],
  },
  'artillery-graph': {
    gate: 'ring',
    parts: [
      { kind: 'arc', at: 0.35, side: 0, up: 1, size: 11 },
      { kind: 'orbs', at: 0.55, n: 1, side: 0, up: 5.8, size: 0.8, tint: 'amber' },
      { kind: 'cubes', at: 0.8, n: 3, side: 3, up: 0.4, size: 1 },
    ],
  },
  'module-blueprint': {
    gate: 'hex',
    parts: [
      { kind: 'cubes', at: 0.3, n: 5, side: -3.6, up: 1.6, size: 1.3, spread: 9 },
      { kind: 'lattice', at: 0.55, side: 3.4, up: 2, size: 7 },
    ],
  },
  'restoration-layers': {
    gate: 'square',
    parts: [
      { kind: 'plates', at: 0.25, n: 1, side: -4.6, up: 1.5, size: 3.2 },
      { kind: 'plates', at: 0.5, n: 1, side: 0, up: 1.5, size: 3.2, tint: 'white' },
      { kind: 'plates', at: 0.75, n: 1, side: 4.6, up: 1.5, size: 3.2 },
    ],
  },
  'world-audit': {
    gate: 'ring',
    parts: [
      { kind: 'orbs', at: 0.3, n: 3, side: 0, up: 1.4, size: 2, spread: 11, spin: 0.08 },
      { kind: 'arc', at: 0.6, side: 0, up: 1.4, size: 11 },
    ],
  },
  'evidence-ledger': {
    gate: 'square',
    parts: [
      { kind: 'plates', at: 0.22, n: 3, side: -4, up: 1.2, size: 3, fan: true },
      { kind: 'rings', at: 0.55, n: 2, side: 0, up: 2.6, size: 2.6, spin: 0.6 },
      { kind: 'cubes', at: 0.85, n: 1, side: 3.8, up: 1.4, size: 1.3, tint: 'green' },
    ],
  },
  'theme-engine': {
    gate: 'ring',
    parts: [
      { kind: 'plates', at: 0.4, n: 7, side: 0, up: 2, size: 3, spread: 9, fan: true, spin: 0.25 },
      { kind: 'orbs', at: 0.7, n: 1, side: 0, up: 2, size: 1.3, tint: 'white' },
    ],
  },
  'citation-chain': {
    gate: 'square',
    parts: [
      { kind: 'plates', at: 0.2, n: 3, side: -4.2, up: 1.2, size: 3.4 },
      { kind: 'lattice', at: 0.5, side: 0, up: 2, size: 6 },
      { kind: 'sheet', at: 0.8, side: 4.2, up: 1.2, size: 4, tint: 'white' },
    ],
  },
  'signed-gate': {
    gate: 'hex',
    parts: [
      { kind: 'cubes', at: 0.15, n: 3, side: -3.6, up: 0.8, size: 1.2 },
      { kind: 'shield', at: 0.5, side: 0, up: 2.4, size: 2.2, tint: 'white' },
      { kind: 'cubes', at: 0.8, n: 5, side: 3.6, up: 0.6, size: 0.9, spread: 7 },
    ],
  },
  'webhook-relay': {
    gate: 'ring',
    parts: [
      { kind: 'towers', at: 0.3, n: 3, side: -3.2, up: 0, size: 6, spread: 9 },
      { kind: 'cubes', at: 0.5, n: 4, side: 0, up: 1, size: 0.7, spread: 8, spin: 0.7 },
      { kind: 'plates', at: 0.85, n: 1, side: 3.8, up: 1.4, size: 3.4, tint: 'white' },
    ],
  },
  'forecast-duel': {
    gate: 'ring',
    parts: [
      { kind: 'wave', at: 0.35, side: 0, up: 0, size: 12 },
      { kind: 'wave', at: 0.5, side: 0, up: 2.4, size: 12, tint: 'amber' },
      { kind: 'bars', at: 0.85, n: 1, side: 4, up: 0, size: 2.4, tint: 'red' },
    ],
  },
  'spaceframe-lattice': {
    gate: 'square',
    parts: [
      { kind: 'lattice', at: 0.3, side: -3.4, up: 2, size: 8 },
      { kind: 'lattice', at: 0.55, side: 3.4, up: 2, size: 8 },
      { kind: 'bars', at: 0.85, n: 2, side: 0, up: 0, size: 3, tint: 'amber' },
    ],
  },
  'macro-timeline': {
    gate: 'square',
    parts: [
      { kind: 'orbs', at: 0.1, n: 1, side: -4, up: 3, size: 0.9, tint: 'red' },
      { kind: 'towers', at: 0.4, n: 5, side: 0, up: 0, size: 3.5, spread: 12 },
      { kind: 'cubes', at: 0.85, n: 1, side: 4, up: 1.2, size: 1.2, tint: 'green' },
    ],
  },
  'quote-sheet': {
    gate: 'square',
    parts: [
      { kind: 'cubes', at: 0.2, n: 2, side: -4.2, up: 1.2, size: 1.4 },
      { kind: 'sheet', at: 0.55, side: 0, up: 1.2, size: 6, tint: 'white' },
      { kind: 'orbs', at: 0.85, n: 1, side: 4, up: 1.4, size: 1.1, tint: 'amber' },
    ],
  },
  'ocr-grid': {
    gate: 'square',
    parts: [
      { kind: 'grid', at: 0.25, side: -3.8, up: 2, size: 6 },
      { kind: 'arc', at: 0.5, side: 0, up: 1.6, size: 5 },
      { kind: 'sheet', at: 0.75, side: 3.8, up: 1.2, size: 5, tint: 'green' },
    ],
  },
  'prompt-storyboard': {
    gate: 'ring',
    parts: [
      { kind: 'plates', at: 0.35, n: 4, side: 0, up: 1.8, size: 3, spread: 12, fan: true },
      { kind: 'arc', at: 0.8, side: 0, up: 0.6, size: 9 },
    ],
  },
  'voice-wave': {
    gate: 'ring',
    parts: [
      { kind: 'wave', at: 0.4, side: 0, up: 0, size: 14, spin: 1.6 },
      { kind: 'cubes', at: 0.82, n: 2, side: 3.8, up: 1, size: 1.1, tint: 'green' },
    ],
  },
  'multicam-sync': {
    gate: 'square',
    parts: [
      { kind: 'bars', at: 0.35, n: 3, side: 0, up: 0.4, size: 9, flat: true },
      { kind: 'towers', at: 0.6, n: 1, side: 0, up: 0, size: 6, tint: 'amber' },
    ],
  },
  'paper-intake': {
    gate: 'square',
    parts: [
      { kind: 'sheet', at: 0.22, side: -4, up: 1.2, size: 5, tint: 'white' },
      { kind: 'cubes', at: 0.55, n: 3, side: 0, up: 1.2, size: 1.2, spread: 6 },
      { kind: 'shield', at: 0.85, side: 4, up: 2.2, size: 2, tint: 'green' },
    ],
  },
  /* the nine foundation stories */
  'legacy-meta-ads': {
    gate: 'ring',
    parts: [
      { kind: 'bars', at: 0.3, n: 5, side: -3.6, up: 0, size: 5 },
      { kind: 'sheet', at: 0.75, side: 3.8, up: 1.2, size: 4.4, tint: 'white' },
    ],
  },
  'legacy-al-maali': {
    gate: 'ring',
    parts: [
      { kind: 'spiral', at: 0.35, side: 0, up: 0, size: 9 },
      { kind: 'orbs', at: 0.75, n: 6, side: 0, up: 2, size: 0.5, spread: 7, spin: 0.4 },
    ],
  },
  'legacy-crm': {
    gate: 'square',
    parts: [
      { kind: 'plates', at: 0.3, n: 4, side: -3.6, up: 1.6, size: 3.2, fan: true },
      { kind: 'grid', at: 0.7, side: 3.6, up: 2, size: 6 },
    ],
  },
  'legacy-brand-system': {
    gate: 'ring',
    parts: [{ kind: 'plates', at: 0.4, n: 8, side: 0, up: 2, size: 2.6, spread: 14, fan: true, spin: 0.12 }],
  },
  'legacy-sheep-app': {
    gate: 'square',
    parts: [
      { kind: 'box', at: 0.35, side: -3.4, up: 0.4, size: 3.4 },
      { kind: 'cubes', at: 0.8, n: 3, side: 3.6, up: 0.6, size: 1, tint: 'green' },
    ],
  },
  'legacy-hr-system': {
    gate: 'hex',
    parts: [
      { kind: 'towers', at: 0.25, n: 3, side: -3.4, up: 0, size: 5, spread: 8 },
      { kind: 'lattice', at: 0.55, side: 2, up: 2, size: 6 },
      { kind: 'cubes', at: 0.85, n: 1, side: 4, up: 1.2, size: 1.3, tint: 'white' },
    ],
  },
  'legacy-medmac-website': {
    gate: 'ring',
    parts: [
      { kind: 'dish', at: 0.4, side: -2, up: 0.2, size: 6, spin: 0.6 },
      { kind: 'sheet', at: 0.8, side: 4, up: 1.4, size: 5.5, tint: 'white' },
    ],
  },
  'legacy-ai-workflow': {
    gate: 'ring',
    parts: [
      { kind: 'orbs', at: 0.4, n: 3, side: 0, up: 2.2, size: 1.6, spread: 7.5, spin: 0.35 },
      { kind: 'rings', at: 0.4, n: 1, side: 0, up: 2.2, size: 3.8, spin: 0.2 },
    ],
  },
  'legacy-my-resume': {
    gate: 'square',
    parts: [
      { kind: 'lattice', at: 0.35, side: -3.4, up: 2, size: 7 },
      { kind: 'plates', at: 0.75, n: 3, side: 3.6, up: 1.4, size: 3, fan: true },
    ],
  },
};

const FALLBACK: Recipe = {
  gate: 'ring',
  parts: [
    { kind: 'plates', at: 0.3, n: 3, side: -3.6, up: 1.4, size: 3.2, fan: true },
    { kind: 'orbs', at: 0.7, n: 5, side: 3.4, up: 1.6, size: 0.6, spread: 6, spin: 0.4 },
  ],
};

/* ------------------------------------------------------------ material -- */

export const AMBER = '#ffc36b';

export function makeConstruct(world: WorldCtx, color: Color, double = false): ShaderMaterial {
  return world.shader({
    vertexShader: constructVert,
    fragmentShader: constructFrag,
    side: double ? DoubleSide : FrontSide,
    uniforms: { uTime: world.common.uTime, uLight: world.common.uLight, uColor: { value: color.clone() }, uRise: { value: 0 }, uHot: { value: 0 } },
  });
}

/* ------------------------------------------------------------- the rig -- */

export interface RigInput {
  world: WorldCtx;
  curve: CatmullRomCurve3;
  /** rail t of each gate, in order */
  gateT: number[];
  /** rail t range the build parts occupy */
  span: [number, number];
  side: Vector3;
  up: Vector3;
  a: Color;
  b: Color;
  seed: number;
  visual: string;
}

export interface RigPulse {
  /** 0 → 1 how close the camera is to crossing a gate (for the camera kick) */
  kick: number;
  /** 0 → 1 the crossing flash */
  flash: number;
}

export interface Rig {
  group: Group;
  gates: Group[];
  /** where the primary stack stands (a GLB set can replace it) */
  stackAnchor: Object3D | null;
  /** armed 0 → 1: the gates only light once the flight reaches the build leg */
  update(p: number, elapsed: number, armed?: number): RigPulse;
}

interface Part {
  obj: Object3D;
  at: number;
  spin: number;
  mats: ShaderMaterial[];
  lines: LineBasicMaterial[];
  kind: PartKind;
  extra: Object3D[];
}

export function buildRig(input: RigInput): Rig {
  const { world, curve, side, up, a, b, seed } = input;
  const recipe = RECIPES[input.visual] ?? FALLBACK;
  const r = rng(Math.floor(seed * 1000) + 13);
  const group = new Group();
  world.scene.add(group);
  const tint = (t: Tint | undefined): Color => {
    switch (t) {
      case 'a':
        return a;
      case 'amber':
        return new Color(AMBER);
      case 'green':
        return new Color('#8ff0ae');
      case 'red':
        return new Color('#ff7a6b');
      case 'white':
        return new Color('#e8ecff');
      default:
        return b;
    }
  };
  const tmp = new Vector3();
  const tangentAt = (t: number) => curve.getTangentAt(clamp01(t), tmp).clone().normalize();
  const spanT = (at: number) => input.span[0] + (input.span[1] - input.span[0]) * at;
  const anchor = (at: number, sideOff = 0, upOff = 0) => curve.getPointAt(clamp01(spanT(at))).addScaledVector(side, sideOff).addScaledVector(up, upOff);
  /** orient an object so its local +z faces down the rail */
  const face = (obj: Object3D, t: number) => {
    const tan = tangentAt(t);
    obj.lookAt(obj.position.clone().add(tan));
  };

  /* ---- gates ---- */
  const gates: Group[] = [];
  const gateMats: ShaderMaterial[] = [];
  const gateGlows: Mesh[] = [];
  const gateBars: Mesh[] = [];
  const irises: ShaderMaterial[][] = [];
  const shocks: { mesh: Mesh; mat: ShaderMaterial }[] = [];
  const irisGeo = world.track(new RingGeometry(2.3, 5.6, 96, 1));
  const shockGeo = world.track(new TorusGeometry(6.4, 0.1, 8, 96));
  const gateGeo = (() => {
    switch (recipe.gate) {
      case 'hex':
        return world.track(new TorusGeometry(6.6, 0.26, 10, 6));
      case 'square':
      case 'diamond':
        return world.track(new TorusGeometry(7.2, 0.26, 10, 4));
      default:
        return world.track(new TorusGeometry(6.4, 0.24, 12, 96));
    }
  })();
  const innerGeo = world.track(new TorusGeometry(5.1, 0.08, 8, 96));
  const barGeo = world.track(new BoxGeometry(9.6, 0.26, 0.26));
  input.gateT.forEach((t, i) => {
    const g = new Group();
    g.position.copy(curve.getPointAt(clamp01(t)));
    face(g, t);
    const mat = makeConstruct(world, b);
    mat.uniforms.uRise.value = 1;
    const ring = new Mesh(gateGeo, mat);
    if (recipe.gate === 'square') ring.rotation.z = Math.PI / 4;
    g.add(ring);
    const inner = new Mesh(innerGeo, mat);
    inner.rotation.z = i * 0.7;
    g.add(inner);
    if (recipe.gate === 'valve') {
      const bar = new Mesh(barGeo, mat);
      g.add(bar);
      gateBars.push(bar);
    }
    const glow = world.glow(b.getStyle(), 0, 20);
    g.add(glow);
    gateGlows.push(glow);
    // the iris: two spoked discs that counter-rotate with the scroll and
    // interfere into a moiré the camera flies through
    const pair: ShaderMaterial[] = [];
    [17, 19].forEach((spokes, k) => {
      const im = world.shader({
        vertexShader: spokeVert,
        fragmentShader: spokeFrag,
        side: DoubleSide,
        uniforms: { uLight: world.common.uLight, uColor: { value: (k ? a : b).clone() }, uPhase: { value: 0 }, uSpokes: { value: spokes }, uHot: { value: 0 } },
      });
      const im2 = new Mesh(irisGeo, im);
      im2.position.z = (k - 0.5) * 0.25;
      g.add(im2);
      pair.push(im);
    });
    irises.push(pair);
    // the shockwave: a ring that bursts outward as the camera crosses
    const sm = makeConstruct(world, b);
    sm.uniforms.uRise.value = 0;
    const shock = new Mesh(shockGeo, sm);
    g.add(shock);
    shocks.push({ mesh: shock, mat: sm });
    gateMats.push(mat);
    gates.push(g);
    group.add(g);
  });

  /* ---- parts ---- */
  const parts: Part[] = [];
  let stackAnchor: Object3D | null = null;

  const plate = (w: number, h: number) => world.track(new BoxGeometry(w, h, 0.08));
  const addPart = (spec: PartSpec) => {
    const obj = new Group();
    const n = spec.n ?? 1;
    const size = spec.size ?? 3;
    const spread = spec.spread ?? 4;
    const col = tint(spec.tint);
    const mats: ShaderMaterial[] = [];
    const lines: LineBasicMaterial[] = [];
    const extra: Object3D[] = [];
    const flatKinds: PartKind[] = ['plates', 'sheet', 'box'];
    const mat = () => {
      const m = makeConstruct(world, col, flatKinds.includes(spec.kind));
      mats.push(m);
      return m;
    };
    const lineMat = () => {
      const m = world.track(new LineBasicMaterial({ color: col, transparent: true, opacity: 0, depthWrite: false, blending: world.blend() }));
      lines.push(m);
      return m;
    };
    obj.position.copy(anchor(spec.at, spec.side ?? 0, spec.up ?? 0));
    face(obj, spanT(spec.at));

    switch (spec.kind) {
      case 'plates': {
        const geo = plate(size * 1.5, size);
        for (let i = 0; i < n; i++) {
          const m = new Mesh(geo, mat());
          if (spec.fan && n > 2) {
            const ang = ((i - (n - 1) / 2) / Math.max(1, n - 1)) * 1.6;
            m.position.set(Math.sin(ang) * spread * 0.5, Math.cos(ang) * spread * 0.18, -Math.abs(Math.sin(ang)) * 0.6);
            m.rotation.z = -ang * 0.5;
            m.rotation.y = ang * 0.35;
          } else if (spec.flat) {
            m.position.set((i - (n - 1) / 2) * size * 1.6, 0, 0);
            m.rotation.x = -Math.PI / 2;
          } else {
            m.position.set((i - (n - 1) / 2) * size * 0.55, i * 0.28, -i * 0.5);
            m.rotation.y = 0.18 * (i - (n - 1) / 2);
          }
          obj.add(m);
        }
        break;
      }
      case 'sheet': {
        const m = new Mesh(plate(size * 0.72, size), mat());
        obj.add(m);
        const qr = new Mesh(world.track(new BoxGeometry(size * 0.16, size * 0.16, 0.12)), mat());
        qr.position.set(size * 0.24, size * 0.36, 0.06);
        obj.add(qr);
        for (let i = 0; i < 4; i++) {
          const line = new Mesh(world.track(new BoxGeometry(size * (0.5 - i * 0.06), 0.05, 0.1)), mat());
          line.position.set(-size * 0.08, size * (0.12 - i * 0.16), 0.06);
          obj.add(line);
        }
        break;
      }
      case 'towers': {
        for (let i = 0; i < n; i++) {
          const h = size * (0.7 + ((i * 7) % 4) * 0.15);
          const g = world.track(new BoxGeometry(0.5, h, 0.5));
          g.translate(0, h / 2, 0);
          const m = new Mesh(g, mat());
          m.position.set(0, 0, (i - (n - 1) / 2) * (spread / Math.max(1, n - 1) || 0));
          obj.add(m);
          const beacon = new Mesh(world.track(new SphereGeometry(0.28, 16, 12)), mat());
          beacon.position.set(0, h + 0.4, m.position.z);
          obj.add(beacon);
        }
        break;
      }
      case 'rings': {
        for (let i = 0; i < n; i++) {
          const m = new Mesh(world.track(new TorusGeometry(size * (0.5 + i * 0.38), 0.07 + i * 0.02, 10, 96)), mat());
          m.rotation.x = 0.5 + i * 0.6;
          m.rotation.y = i * 0.4;
          obj.add(m);
          extra.push(m);
        }
        break;
      }
      case 'lattice': {
        const pts: Vector3[] = [];
        const k = 14;
        for (let i = 0; i < k; i++) pts.push(new Vector3((r() - 0.5) * size, (r() - 0.5) * size * 0.8, (r() - 0.5) * size * 0.6));
        const verts: number[] = [];
        for (let i = 0; i < k; i++) {
          const d = pts.map((p, j) => ({ j, d: p.distanceTo(pts[i]) })).filter((x) => x.j !== i).sort((x, y) => x.d - y.d).slice(0, 3);
          for (const { j } of d) verts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
        const geo = world.track(new BufferGeometry());
        geo.setAttribute('position', new BufferAttribute(new Float32Array(verts), 3));
        obj.add(new LineSegments(geo, lineMat()));
        const nodeGeo = world.track(new SphereGeometry(0.16, 10, 8));
        const nm = mat();
        for (const p of pts) {
          const m = new Mesh(nodeGeo, nm);
          m.position.copy(p);
          obj.add(m);
        }
        break;
      }
      case 'stack': {
        stackAnchor = obj;
        let y = 0;
        for (let i = 0; i < n; i++) {
          const rad = size * (0.55 - i * 0.14);
          const h = size * 0.34;
          const g = world.track(new CylinderGeometry(rad, rad, h, 48, 1));
          g.translate(0, h / 2, 0);
          const m = new Mesh(g, mat());
          m.position.y = y;
          y += h * 1.02;
          obj.add(m);
        }
        break;
      }
      case 'box': {
        // a dieline: a base and four flaps that fold up as the part rises
        const s = size;
        const faceGeo = world.track(new PlaneGeometry(s, s));
        const m = mat();
        const base = new Mesh(faceGeo, m);
        base.rotation.x = -Math.PI / 2;
        obj.add(base);
        const flaps: Mesh[] = [];
        const dirs: [number, number, number][] = [
          [0, 0, s / 2],
          [0, 0, -s / 2],
          [s / 2, 0, 0],
          [-s / 2, 0, 0],
        ];
        dirs.forEach(([x, , z], i) => {
          const hinge = new Group();
          hinge.position.set(x, 0, z);
          hinge.rotation.y = i < 2 ? 0 : Math.PI / 2;
          const flap = new Mesh(faceGeo, m);
          flap.position.set(0, 0, (i % 2 ? -1 : 1) * (s / 2));
          flap.rotation.x = -Math.PI / 2;
          hinge.add(flap);
          hinge.userData.dir = i % 2 ? -1 : 1;
          obj.add(hinge);
          flaps.push(flap);
          extra.push(hinge);
        });
        break;
      }
      case 'orbs': {
        const geo = world.track(new SphereGeometry(size * 0.45, 32, 24));
        for (let i = 0; i < n; i++) {
          const m = new Mesh(geo, mat());
          if (n > 1) {
            const ang = (i / n) * Math.PI * 2;
            m.position.set(Math.cos(ang) * spread * 0.5, Math.sin(ang * 2) * 0.4, Math.sin(ang) * spread * 0.5);
          }
          obj.add(m);
        }
        break;
      }
      case 'bars': {
        for (let i = 0; i < n; i++) {
          const h = size * (0.35 + (((i * 5) % 3) + 1) * 0.22);
          const g = spec.flat ? world.track(new BoxGeometry(size * 1.2, 0.38, 0.38)) : world.track(new BoxGeometry(0.7, h, 0.7));
          if (!spec.flat) g.translate(0, h / 2, 0);
          const m = new Mesh(g, mat());
          if (spec.flat) m.position.set(0, i * 0.9, 0);
          else m.position.set((i - (n - 1) / 2) * 1.1, 0, 0);
          obj.add(m);
        }
        break;
      }
      case 'dish': {
        for (let i = 0; i < 3; i++) {
          const m = new Mesh(world.track(new TorusGeometry(size * (0.22 + i * 0.22), 0.06, 8, 96)), mat());
          m.rotation.x = Math.PI / 2;
          obj.add(m);
        }
        const g = world.track(new BoxGeometry(size * 0.66, 0.06, 0.12));
        g.translate(size * 0.33, 0, 0);
        const sweep = new Mesh(g, mat());
        obj.add(sweep);
        extra.push(sweep);
        break;
      }
      case 'grid': {
        const verts: number[] = [];
        const d = 8;
        for (let i = 0; i <= d; i++) {
          const v = (i / d - 0.5) * size;
          verts.push(-size / 2, v, 0, size / 2, v, 0, v, -size / 2, 0, v, size / 2, 0);
        }
        const geo = world.track(new BufferGeometry());
        geo.setAttribute('position', new BufferAttribute(new Float32Array(verts), 3));
        const g = new LineSegments(geo, lineMat());
        if (spec.flat) g.rotation.x = -Math.PI / 2;
        obj.add(g);
        break;
      }
      case 'wave': {
        const count = 24;
        for (let i = 0; i < count; i++) {
          const g = world.track(new BoxGeometry(size / count * 0.55, 1, size / count * 0.55));
          g.translate(0, 0.5, 0);
          const m = new Mesh(g, mat());
          m.position.set((i / (count - 1) - 0.5) * size, 0, 0);
          m.userData.i = i;
          obj.add(m);
          extra.push(m);
        }
        break;
      }
      case 'spiral': {
        const pts: Vector3[] = [];
        for (let i = 0; i <= 60; i++) {
          const t = i / 60;
          const ang = t * Math.PI * 5;
          pts.push(new Vector3(Math.cos(ang) * size * 0.35 * (1 - t * 0.4), t * size * 0.9, Math.sin(ang) * size * 0.35 * (1 - t * 0.4)));
        }
        const c = new CatmullRomCurve3(pts);
        const m = new Mesh(world.track(new TubeGeometry(c, 180, 0.12, 8, false)), mat());
        obj.add(m);
        const top = new Mesh(world.track(new SphereGeometry(0.5, 20, 16)), mat());
        top.position.copy(pts[pts.length - 1]);
        obj.add(top);
        break;
      }
      case 'shield': {
        const g = world.track(new CylinderGeometry(size * 0.6, size * 0.6, 0.32, 6, 1));
        const m = new Mesh(g, mat());
        m.rotation.x = Math.PI / 2;
        obj.add(m);
        const core = new Mesh(world.track(new SphereGeometry(size * 0.2, 20, 16)), mat());
        obj.add(core);
        const halo = new Mesh(world.track(new TorusGeometry(size * 0.8, 0.05, 8, 64)), mat());
        obj.add(halo);
        extra.push(halo);
        break;
      }
      case 'arc': {
        const m = new Mesh(world.track(new TorusGeometry(size * 0.5, 0.08, 10, 80, Math.PI)), mat());
        obj.add(m);
        const tip = new Mesh(world.track(new SphereGeometry(0.34, 16, 12)), mat());
        tip.position.set(-size * 0.5, 0, 0);
        obj.add(tip);
        break;
      }
      case 'cubes': {
        const geo = world.track(new BoxGeometry(size, size, size));
        for (let i = 0; i < n; i++) {
          const m = new Mesh(geo, mat());
          m.position.set(0, (i % 2) * size * 0.4, (i - (n - 1) / 2) * (n > 1 ? spread / (n - 1) : 0));
          m.rotation.y = i * 0.5;
          obj.add(m);
          extra.push(m);
        }
        break;
      }
    }
    obj.scale.setScalar(0.001);
    group.add(obj);
    parts.push({ obj, at: spec.at, spin: spec.spin ?? 0, mats, lines, kind: spec.kind, extra });
  };
  recipe.parts.forEach(addPart);

  /* ---- per-frame ---- */
  const N = input.gateT.length;
  return {
    group,
    gates,
    stackAnchor,
    update(p, elapsed, armed = 1) {
      let kick = 0;
      let flash = 0;
      // gates light as the camera reaches each one
      for (let i = 0; i < N; i++) {
        const cross = p * Math.max(1, N - 1) - i;
        const passed = clamp01((cross + 0.3) / 0.35) * armed;
        const hot = easeOut(passed);
        gateMats[i].uniforms.uHot.value = hot * (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(elapsed * 2.4 + i)));
        (gateGlows[i].material as ShaderMaterial).uniforms.uOpacity.value = hot * 0.22;
        gates[i].children[1].rotation.z += 0.004 + hot * 0.02;
        if (gateBars[i]) gateBars[i].rotation.z = hot * (Math.PI / 2);
        // the iris turns with the scroll, each disc its own way: moiré
        irises[i][0].uniforms.uPhase.value = p * 6.0 + elapsed * 0.02;
        irises[i][1].uniforms.uPhase.value = -p * 6.0 - elapsed * 0.017;
        irises[i][0].uniforms.uHot.value = hot;
        irises[i][1].uniforms.uHot.value = hot;
        // the shockwave bursts just after the crossing and fades as it grows
        const burst = clamp01(cross / 0.5);
        const sc = 1 + easeOut(burst) * 2.6;
        shocks[i].mesh.scale.set(sc, sc, 1);
        shocks[i].mat.uniforms.uRise.value = burst > 0 && burst < 1 ? (1 - burst) * 0.9 : 0;
        shocks[i].mat.uniforms.uHot.value = 1;
        const near = Math.exp(-Math.abs(cross) * 7);
        if (near > kick) kick = near;
        if (near > flash) flash = near;
      }
      for (const part of parts) {
        // a part rises well before the camera reaches it, so it is seen approaching
        const rise = easeOut(clamp01((p - (part.at * 0.92 - 0.24)) / 0.16));
        const s = 0.001 + rise * 0.999;
        part.obj.scale.setScalar(s);
        for (const m of part.mats) m.uniforms.uRise.value = rise;
        for (const l of part.lines) l.opacity = rise * 0.8;
        if (part.kind === 'rings') part.extra.forEach((m, i) => (m.rotation.z += 0.004 + part.spin * 0.01 * (i + 1)));
        if (part.kind === 'orbs' || part.kind === 'plates' || part.kind === 'cubes') part.obj.rotation.y = elapsed * part.spin * 0.6;
        if (part.kind === 'dish') part.extra[0].rotation.z = elapsed * part.spin * 1.8;
        if (part.kind === 'shield') part.extra[0].rotation.z = elapsed * 0.8;
        if (part.kind === 'wave')
          for (const m of part.extra) {
            const i = m.userData.i as number;
            m.scale.y = 0.35 + (0.5 + 0.5 * Math.sin(elapsed * (1.2 + part.spin) + i * 0.55)) * 2.6;
          }
        if (part.kind === 'box') for (const hinge of part.extra) hinge.rotation.x = (hinge.userData.dir as number) * (-Math.PI / 2) * rise;
      }
      return { kick, flash };
    },
  };
}
