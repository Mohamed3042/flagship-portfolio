/**
 * "From Signal to Systems" — the four artifact stages.
 *
 * Every pose is a pure function of (local, time): no accumulation, no easing
 * toward a target, no one-way latch. Reverse scroll, an anchor jump and a
 * restored history all reconstruct the identical transform. `time` drives only
 * ambient life, whose amplitude vanishes at both ends of an interval, so a
 * paused or finished stage is completely still and completely readable.
 */
import * as THREE from 'three';
import type { ArtifactId, ArtifactStage, HandoffRect } from './types';
import { CARTON } from './shapes';

/* Palette. Near-monochrome by contract: colour arrives from real screenshots, not from here. */
const BACKDROP = 0x05070a, DEPTH = 0x0b1017, INK = 0xf0f3f6, INK_DIM = 0x98a5b1, ACCENT = 0x70b8ff;

const clamp = THREE.MathUtils.clamp;
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Eased sub-interval of `local`. The only way a stage reads progress. */
const ramp = (v: number, a: number, b: number) => smooth(clamp((v - a) / (b - a), 0, 1));
/** Ambient envelope: zero at both ends, so residual motion decays to nothing at rest. */
const life = (local: number) => { const s = Math.sin(Math.PI * clamp(local, 0, 1)); return s * s; };
/** Seeded PRNG for authored jitter. Never Math.random, never reseeded per frame. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Every stage finishes before its chapter's reading stop opens.
 *
 * A reading stop is the interval where the camera rests and the copy is meant to
 * be read; the stage keeps receiving local progress through it, so an artifact
 * whose own ramps run to 1 is still rearranging itself underneath a paragraph
 * the visitor is trying to read. These are the local-progress values each
 * chapter's stop opens at, taken from CHAPTERS, and no ramp in this file may end
 * after the one that belongs to it.
 *
 *   workflow  0.50   carton  0.5625   tracks  0.542   portal  0.536
 */
/* ---------------------------------------------------------------- resources */

/** Three frees no GPU memory on removal, so each stage owns and returns its own. */
function bin() {
  const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  return {
    geo<T extends THREE.BufferGeometry>(g: T): T { geometries.push(g); return g; },
    mat<T extends THREE.Material>(m: T): T { materials.push(m); return m; },
    map<T extends THREE.Texture>(t: T): T { textures.push(t); return t; },
    dispose() {
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
      geometries.length = 0; materials.length = 0; textures.length = 0;
    },
  };
}
type Bin = ReturnType<typeof bin>;

/** Soft round falloff, generated rather than loaded: one restrained contact shadow. */
function falloffTexture(size = 64, power = 2.4): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, dx = ((x + .5) / size) * 2 - 1, dy = ((y + .5) / size) * 2 - 1;
    data[i + 3] = Math.round(Math.pow(Math.max(0, 1 - Math.hypot(dx, dy)), power) * 255);
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
}

/** Fibre noise for paperboard roughness, deterministic from a fixed seed. */
function grainTexture(seed: number, size = 64): THREE.DataTexture {
  const random = mulberry32(seed), data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = 176 + Math.round(random() * 58);
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v; data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(3, 3); texture.needsUpdate = true;
  return texture;
}

function outline(res: Bin, mesh: THREE.Mesh, material: THREE.LineBasicMaterial): THREE.Mesh {
  mesh.add(new THREE.LineSegments(res.geo(new THREE.EdgesGeometry(mesh.geometry)), material));
  return mesh;
}

/* ------------------------------------------------------------------ handoff */

const UNIT = new THREE.Box3(new THREE.Vector3(-.5, -.5, 0), new THREE.Vector3(.5, .5, 0));
const CORNER = new THREE.Vector3(), VIEW = new THREE.Vector3();

/**
 * Screen-space rectangle of a 3D surface, in CSS pixels relative to the canvas, so
 * the HTML screenshot can be aligned before the representation switches. `blend`
 * is left at 0 here; each stage decides the crossfade from its own progress.
 */
export function projectSurface(
  object: THREE.Object3D, camera: THREE.PerspectiveCamera, width: number, height: number,
): HandoffRect {
  object.updateWorldMatrix(true, false);
  camera.updateMatrixWorld();
  VIEW.setFromMatrixPosition(object.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
  // Behind the near plane the projection mirrors; report a degenerate rect, never a wrong one.
  if (VIEW.z > -camera.near) return { x: width / 2, y: height / 2, width: 0, height: 0, blend: 0 };
  const geometry = (object as Partial<THREE.Mesh>).geometry;
  if (geometry && !geometry.boundingBox) geometry.computeBoundingBox();
  const box = geometry?.boundingBox ?? UNIT;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    CORNER.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z)
      .applyMatrix4(object.matrixWorld).project(camera);
    const x = (CORNER.x * .5 + .5) * width, y = (.5 - CORNER.y * .5) * height;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY, blend: 0 };
}

export interface SurfaceSize { width: number; height: number }

/**
 * A stage that hands a 3D surface to a real HTML screenshot. The stage does not own
 * the camera, so the orchestrator supplies one; until it does, `handoff()` is null.
 */
export interface SurfaceStage extends ArtifactStage {
  /** The plane a screenshot takes over from. */
  surface: THREE.Object3D | null;
  /**
   * The housing around that plane -- bezel, stand, frame. It leaves with the
   * surface: once the HTML image owns the pixels it is positioned in the frame's
   * free band, which is not always where the 3D housing is, and an orphaned
   * bezel beside the screenshot reads as the same screen drawn twice.
   */
  chrome?: THREE.Object3D | null;
  setCamera(camera: THREE.PerspectiveCamera | null, size: SurfaceSize): void;
  handoff(): HandoffRect | null;
}

function surfaceHandoff() {
  let camera: THREE.PerspectiveCamera | null = null, size: SurfaceSize = { width: 0, height: 0 };
  return {
    setCamera(next: THREE.PerspectiveCamera | null, nextSize: SurfaceSize) { camera = next; size = nextSize; },
    rect(surface: THREE.Object3D | null, blend: number): HandoffRect | null {
      if (!camera || !surface || size.width <= 0 || size.height <= 0) return null;
      const projected = projectSurface(surface, camera, size.width, size.height);
      projected.blend = blend;
      return projected;
    },
  };
}

/* ----------------------------------------------------------------- workflow */

const PATH_SEGMENTS = 96;
/** Curve parameter of the human-review gate. The record never travels past it. */
const REVIEW = .455;

export function workflowStage(): SurfaceStage {
  const res = bin(), object = new THREE.Group(), temp = new THREE.Object3D(), point = new THREE.Vector3();
  const graphite = res.mat(new THREE.MeshStandardMaterial({ color: 0x2b3640, roughness: .55, metalness: .35 }));
  const satin = res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .36, metalness: .5 }));
  const steel = res.mat(new THREE.MeshStandardMaterial({ color: INK_DIM, roughness: .44, metalness: .55 }));
  const card = res.mat(new THREE.MeshStandardMaterial({ color: 0xc6ccd3, roughness: .78, metalness: 0 }));
  const inkEdge = res.mat(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .26 }));
  const accentEdge = res.mat(new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: .8 }));
  const accentRing = res.mat(new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: .25 }));
  const box = (w: number, h: number, d: number, material: THREE.Material) =>
    new THREE.Mesh(res.geo(new THREE.BoxGeometry(w, h, d)), material);

  // The mechanism is subordinate at the reading stop, but subordinate is not
  // unreadable: a key of its own keeps the gate, the held record and the trays
  // legible while the screen owns the frame.
  const key = new THREE.DirectionalLight(0xe8f0f8, 1.5);
  key.position.set(-2.5, 5, 6); object.add(key);

  const deck = box(6, .12, 2.1, satin); deck.position.y = -.44; object.add(outline(res, deck, inkEdge));

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.6, .06, .18), new THREE.Vector3(-1.3, .1, -.06),
    new THREE.Vector3(0, .1, 0), new THREE.Vector3(1.3, .1, -.06), new THREE.Vector3(2.6, .06, .18),
  ]);
  object.add(new THREE.Mesh(res.geo(new THREE.TubeGeometry(curve, 72, .022, 6, false)), graphite));

  // The accent marks only the path the record has actually travelled, so it stops at the gate.
  const active = new THREE.Line(
    res.geo(new THREE.BufferGeometry().setFromPoints(curve.getPoints(PATH_SEGMENTS))), accentEdge,
  );
  active.position.y = .03; active.frustumCulled = false; object.add(active);

  const nodes = new THREE.InstancedMesh(res.geo(new THREE.CylinderGeometry(.17, .17, .12, 6)), steel, 5);
  [.08, .26, .5, .74, .92].forEach((t, i) => {
    temp.position.copy(curve.getPoint(t, point)); temp.position.y -= .07;
    temp.rotation.set(0, Math.PI / 6, 0); temp.scale.setScalar(1); temp.updateMatrix();
    nodes.setMatrixAt(i, temp.matrix);
  });
  object.add(nodes);

  const holdX = curve.getPoint(REVIEW, point).x, gateX = curve.getPoint(.5, point).x;

  // The review gate. Its barrier is built closed and is never animated: scrolling is not consent.
  const gate = new THREE.Group(); gate.position.x = gateX; object.add(gate);
  [-.46, .46].forEach(z => {
    const post = box(.08, .78, .08, steel); post.position.set(0, -.05, z); gate.add(outline(res, post, inkEdge));
  });
  const header = box(.09, .09, 1, steel); header.position.y = .34; gate.add(header);
  const barrier = box(.05, .1, .86, graphite); barrier.position.y = .1; gate.add(outline(res, barrier, inkEdge));
  const plate = box(.02, .17, .52, satin); plate.position.y = .47; gate.add(outline(res, plate, inkEdge));

  // Jaws that close on the record and keep holding it. Held is a state you can see, not a transition.
  const jaws = [-1, 1].map(sign => {
    const jaw = box(.1, .16, .16, steel); jaw.position.set(holdX, .1, sign * .3); object.add(jaw);
    return { jaw, sign };
  });

  const record = box(.34, .012, .24, card); object.add(outline(res, record, inkEdge));
  const focus = new THREE.Mesh(res.geo(new THREE.TorusGeometry(.26, .012, 6, 28)), accentRing);
  focus.rotation.x = Math.PI / 2; object.add(focus);

  const inTray = box(.5, .06, .44, satin); inTray.position.set(-2.95, -.35, .18); object.add(outline(res, inTray, inkEdge));
  const queue = new THREE.InstancedMesh(res.geo(new THREE.BoxGeometry(.34, .012, .24)), card, 3);
  for (let i = 0; i < 3; i++) {
    temp.position.set(-2.95, -.3 + i * .018, .18); temp.rotation.set(0, .04 * i, 0);
    temp.scale.setScalar(1); temp.updateMatrix(); queue.setMatrixAt(i, temp.matrix);
  }
  object.add(queue);
  // The output tray stays empty for the whole stage. Nothing was approved downstream.
  const outTray = box(.5, .06, .44, satin); outTray.position.set(2.95, -.35, .18); object.add(outline(res, outTray, inkEdge));

  const ROLLERS = 9;
  const rollers = new THREE.InstancedMesh(res.geo(new THREE.CylinderGeometry(.075, .075, 1.5, 8)), graphite, ROLLERS);
  rollers.frustumCulled = false; object.add(rollers);

  // The screen plane: a real rectangle, so its four projected corners are reportable.
  const screen = new THREE.Group(); object.add(screen);
  const surface = new THREE.Mesh(
    res.geo(new THREE.PlaneGeometry(1.6, 1)),
    res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .3, metalness: .4 })),
  );
  screen.add(outline(res, surface, inkEdge));
  ([[0, .53, 1.72, .06], [0, -.53, 1.72, .06], [-.83, 0, .06, 1.12], [.83, 0, .06, 1.12]] as const).forEach(([x, y, w, h]) => {
    const bar = box(w, h, .05, steel); bar.position.set(x, y, -.02); screen.add(bar);
  });
  const stand = box(.09, .5, .09, steel); stand.position.set(0, -.78, -.02); screen.add(stand);

  const handoff = surfaceHandoff();
  let progress = 0;

  return {
    object,
    surface,
    chrome: screen,
    setCamera: handoff.setCamera,
    update(local, time) {
      progress = clamp(local, 0, 1);
      const travel = REVIEW * ramp(progress, .03, .26);
      const held = ramp(progress, .24, .36);
      const breath = life(progress);

      curve.getPoint(travel, point);
      record.position.set(point.x, point.y + .05 + held * .03 + breath * Math.sin(time * .9) * .011, point.z);
      record.rotation.set(0, 0, held * -.1);
      focus.position.set(record.position.x, record.position.y - .012, record.position.z);
      accentRing.opacity = .22 + held * .34;

      active.geometry.setDrawRange(0, Math.round(travel * PATH_SEGMENTS) + 1);
      jaws.forEach(({ jaw, sign }) => { jaw.position.set(holdX, .1 + held * .02, sign * (.3 - held * .13)); });

      // Past the gate the mechanism keeps turning; the record does not move.
      const spin = progress * 5.6 + Math.sin(time * .4) * .07 * breath;
      for (let i = 0; i < ROLLERS; i++) {
        temp.position.set(-2.4 + i * .6, -.2, 0); temp.rotation.set(Math.PI / 2, spin + i * .21, 0);
        temp.scale.setScalar(1); temp.updateMatrix(); rollers.setMatrixAt(i, temp.matrix);
      }
      rollers.instanceMatrix.needsUpdate = true;

      const present = ramp(progress, .28, .47);
      screen.position.set(2.42, .58 + present * .06, present * .14);
      screen.rotation.set(0, (1 - present) * -.55, 0);
    },
    handoff: () => handoff.rect(surface, ramp(progress, .33, .49)),
    dispose() { object.clear(); res.dispose(); },
  };
}

/* ------------------------------------------------------------------- carton */

/**
 * A piece of packaging, and the software that made it, in one frame and not
 * confused with each other.
 *
 * The board is the subject: it folds from flat to closed with real thickness,
 * real creases and a contact shadow, and at the final pose it is square to the
 * camera and fully opaque. The product screenshot does not wrap a face of it —
 * it stands beside it on the same deck, under the same light, as its own object.
 * Printing an application's interface onto a carton panel would state something
 * about the work that is not true.
 */
export function cartonStage(): SurfaceStage {
  const res = bin(), object = new THREE.Group();
  const T = .026, W = CARTON.w, H = CARTON.h, D = CARTON.d;
  const board = res.mat(new THREE.MeshStandardMaterial({
    color: 0xc4bcae, roughness: .96, metalness: 0, roughnessMap: res.map(grainTexture(0x5eed)),
  }));
  // The cut edge of paperboard is lighter and rougher than its printed face.
  const cut = res.mat(new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 1, metalness: 0 }));
  const print = res.mat(new THREE.MeshStandardMaterial({ color: 0x8e8371, roughness: .92, metalness: 0 }));
  const satin = res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .36, metalness: .5 }));
  const table = res.mat(new THREE.MeshStandardMaterial({ color: 0x070a0f, roughness: .82, metalness: .08 }));
  const foldEdge = res.mat(new THREE.LineBasicMaterial({ color: 0x6b6355, transparent: true, opacity: .34 }));
  const inkEdge = res.mat(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .18 }));
  const wallCrease = res.mat(new THREE.MeshBasicMaterial({ color: 0x06080c, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  const lidCrease = res.mat(new THREE.MeshBasicMaterial({ color: 0x06080c, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  const contact = res.mat(new THREE.MeshBasicMaterial({
    color: 0x000000, map: res.map(falloffTexture()), transparent: true, opacity: 0, depthWrite: false,
  }));
  // Board is a sandwich: a printed face, a pale core at the cut edges. Giving the
  // box geometry six materials is what makes its thickness read at a seam.
  const panel = (w: number, h: number, d: number) =>
    outline(res, new THREE.Mesh(
      res.geo(new THREE.BoxGeometry(w, h, d)),
      [cut, cut, cut, cut, board, board],
    ), foldEdge);
  const quad = (w: number, h: number, material: THREE.Material) =>
    new THREE.Mesh(res.geo(new THREE.PlaneGeometry(w, h)), material);

  // Paperboard under the scene's blue rim light reads as painted metal. The
  // stage brings its own warm key, added to and removed with the stage, so the
  // one world light stays shared and the board still looks like board.
  const paperKey = new THREE.DirectionalLight(0xfff1de, 1.9);
  paperKey.position.set(-4.5, 4.2, 6); object.add(paperKey);
  const paperFill = new THREE.DirectionalLight(0xe8dcc8, .5);
  paperFill.position.set(3.4, 1.2, 3); object.add(paperFill);

  const deck = new THREE.Mesh(res.geo(new THREE.BoxGeometry(3.3, .05, 2.4)), table);
  deck.position.set(CARTON.centre[0] + .1, -.9, CARTON.centre[2]);
  object.add(outline(res, deck, foldEdge));
  const shadow = quad(W * 2.2, D * 2.4, contact);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(CARTON.centre[0], -.885, CARTON.centre[2]); object.add(shadow);

  // Flat dieline at local 0, closed carton square to the camera at local 1 — same
  // hinge poses both ways, so a reverse scroll unfolds it rather than replaying.
  const carton = new THREE.Group();
  carton.position.set(CARTON.centre[0], CARTON.centre[1] - H / 2, CARTON.centre[2]);
  object.add(carton);
  carton.add(panel(W, T, D));

  const hinges = ([[0, D / 2, 'x', 1, true], [0, -D / 2, 'x', -1, true],
    [W / 2, 0, 'z', -1, false], [-W / 2, 0, 'z', 1, false]] as const).map(([x, z, axis, sign, front]) => {
    const pivot = new THREE.Group(); pivot.position.set(x, 0, z); carton.add(pivot);
    const wall = panel(front ? W : T, H, front ? T : D); wall.position.y = H / 2; pivot.add(wall);
    const flap = new THREE.Group(); flap.position.y = H; pivot.add(flap);
    const depth = front ? D / 2 - .012 : .22; // main lids meet at the centre, dust flaps tuck under
    const lid = panel(front ? W : T, depth, front ? T : D); lid.position.y = depth / 2; flap.add(lid);
    const crease = quad(front ? W : D, .05, wallCrease);
    crease.rotation.set(-Math.PI / 2, 0, front ? 0 : Math.PI / 2);
    crease.position.set(x, T / 2 + .001, z); carton.add(crease);
    const shade = quad(front ? W : D, .05, lidCrease);
    shade.rotation.set(-Math.PI / 2, 0, front ? 0 : Math.PI / 2);
    shade.position.y = H / 2 - .001; wall.add(shade);
    return { pivot, axis, sign, flap, wall, front };
  });

  // What is actually printed on the box: a plain panel and a keyline, at the
  // scale a dieline puts artwork at. Not a user interface.
  const printed = quad(W * .46, H * .26, print);
  printed.position.set(-W * .03, H * .05, T / 2 + .004);
  hinges[0].wall.add(outline(res, printed, foldEdge));

  /**
   * The evidence: the tool that produced the dieline, on its own stand, beside
   * the object it produced. Distinct — a screen is not a carton — but on the
   * same deck, in the same light, at the same moment.
   */
  const screen = new THREE.Group();
  screen.position.set(CARTON.centre[0] + W * .5 + 2.02, .5, -1.5);
  object.add(screen);
  const surface = new THREE.Mesh(
    res.geo(new THREE.PlaneGeometry(1.92, 1.2)),
    res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .3, metalness: .4 })),
  );
  screen.add(outline(res, surface, inkEdge));
  ([[0, .64, 2.06, .05], [0, -.64, 2.06, .05], [-.99, 0, .05, 1.33], [.99, 0, .05, 1.33]] as const)
    .forEach(([x, y, w, h]) => {
      const bar = new THREE.Mesh(res.geo(new THREE.BoxGeometry(w, h, .05)), satin);
      bar.position.set(x, y, -.02); screen.add(bar);
    });
  const stand = new THREE.Mesh(res.geo(new THREE.BoxGeometry(.09, .52, .09)), satin);
  stand.position.set(0, -.9, -.02); screen.add(stand);

  const handoff = surfaceHandoff();
  let progress = 0;

  return {
    object,
    surface,
    chrome: screen,
    setCamera: handoff.setCamera,
    update(local) {
      progress = clamp(local, 0, 1);
      // The near lid stops just short of flush. A carton closed to a perfect
      // rectangle has no thickness on screen; one flap standing slightly proud
      // is what shows the board is board.
      const fold = ramp(progress, .04, .24), dust = ramp(progress, .2, .32), lid = ramp(progress, .28, .4) * .93;
      const present = ramp(progress, .28, .44);

      hinges.forEach(({ pivot, axis, sign, flap, front }) => {
        pivot.rotation[axis] = (1 - fold) * sign * Math.PI / 2;
        flap.rotation[axis] = -(front ? lid : dust) * sign * Math.PI / 2;
      });
      wallCrease.opacity = fold * .5;
      lidCrease.opacity = Math.max(lid, dust) * .45;

      // Into a three-quarter pose, then still. Square-on, a closed carton is a
      // rectangle: the angle is what puts a lid seam, a flap edge, a side wall
      // and the board's thickness in the same frame, which is what the visitor
      // has to see to recognise packaging without reading the title.
      carton.rotation.y = (1 - present) * -.55 + .62;

      // The shadow tightens as the sheet becomes a box.
      shadow.scale.setScalar(1.34 - fold * .38);
      contact.opacity = .2 + fold * .18;

      // The screen arrives after the box is recognisable, so the object reads
      // first and its evidence second.
      screen.rotation.set(0, (1 - present) * .46 - .2, 0);
      screen.position.y = .52 + (1 - present) * -.1;
    },
    handoff: () => handoff.rect(surface, ramp(progress, .4, .54)),
    dispose() { object.clear(); res.dispose(); },
  };
}

/* ------------------------------------------------------------------- tracks */

export function tracksStage(): ArtifactStage {
  // Silence is the default: this stage builds no audio context, no media element, no sound at all.
  const res = bin(), object = new THREE.Group(), temp = new THREE.Object3D(), tint = new THREE.Color();
  const TRACKS = 3, PER_TRACK = 7, MATCH = 3, SYNC = -.35;
  const trackY = [.34, 0, -.34], trackZ = [-.62, 0, .62];
  const offsets = [.58, -.42, .26]; // authored misalignment at local 0, in scene units
  const random = mulberry32(0x7acc);

  const clips: { track: number; x: number; width: number; phase: number }[] = [];
  const target: number[] = [];
  for (let t = 0; t < TRACKS; t++) {
    let cursor = -1.85, matchLeft = 0;
    for (let i = 0; i < PER_TRACK; i++) {
      const width = .3 + random() * .34;
      if (i === MATCH) matchLeft = cursor;
      clips.push({ track: t, x: cursor + width / 2, width, phase: random() * Math.PI * 2 });
      cursor += width + .07;
    }
    target.push(SYNC - matchLeft); // the corresponding regions land on the sync line together
  }

  // The stage is the whole argument at this chapter, and the point cloud fades
  // out from under it: the clips have to carry the image on their own, at a size
  // and a value that read from a reading distance.
  object.scale.setScalar(1.45);
  object.position.x = -0.55;

  const blocks = new THREE.InstancedMesh(
    res.geo(new THREE.BoxGeometry(1, .17, .3)),
    res.mat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .52, metalness: .28 })),
    clips.length,
  );
  blocks.frustumCulled = false;
  clips.forEach((_, i) => blocks.setColorAt(i, tint.setHex(i % PER_TRACK === MATCH ? ACCENT : 0x7d8794)));
  if (blocks.instanceColor) blocks.instanceColor.needsUpdate = true;
  object.add(blocks);

  const railMat = res.mat(new THREE.MeshBasicMaterial({ color: INK_DIM, transparent: true, opacity: .26 }));
  const rails = trackY.map((y, t) => {
    const rail = new THREE.Mesh(res.geo(new THREE.BoxGeometry(4.8, .004, .34)), railMat);
    rail.position.set(0, y - .09, trackZ[t]); object.add(rail); return rail;
  });

  const syncMat = res.mat(new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: .12 }));
  const sync = new THREE.Mesh(res.geo(new THREE.BoxGeometry(.014, 1.05, .014)), syncMat);
  sync.position.x = SYNC; object.add(sync);

  return {
    object,
    update(local, time) {
      const progress = clamp(local, 0, 1);
      // They converge; they do not merge. Three recordings finding each other is
      // the claim, and a single flattened bar is a different picture -- it says
      // the tracks became one thing, which is not what the tool does.
      const align = ramp(progress, .06, .36), flat = ramp(progress, .36, .52) * .42, breath = life(progress);
      clips.forEach((clip, i) => {
        const end = target[clip.track], start = end + offsets[clip.track];
        temp.position.set(
          clip.x + start + (end - start) * align,
          trackY[clip.track] * (1 - flat) + breath * Math.sin(time * .5 + clip.phase) * .006,
          trackZ[clip.track] * (1 - flat) + clip.track * .004, // epsilon keeps the flattened rows out of a z-fight
        );
        temp.rotation.set(0, 0, 0);
        temp.scale.set(clip.width, 1 - flat * .3, 1 - flat * .12);
        temp.updateMatrix(); blocks.setMatrixAt(i, temp.matrix);
      });
      blocks.instanceMatrix.needsUpdate = true;
      rails.forEach((rail, t) => {
        rail.position.set(0, trackY[t] * (1 - flat) - .09, trackZ[t] * (1 - flat) + t * .004);
      });
      railMat.opacity = .16 * (1 - flat * .6);
      sync.scale.set(1, 1 - flat * .55, 1);
      syncMat.opacity = .12 + align * .62;
    },
    dispose() { object.clear(); res.dispose(); },
  };
}

/* ------------------------------------------------------------------- portal */

/**
 * A threshold onto the World it actually names.
 *
 * The interior is not a generic landscape: it is a shallow room whose far wall
 * carries a frame of the published Cake Studio world, with a floor, two side
 * walls and a counter block built to that frame's own tones. They are real
 * surfaces at real depths, so the parallax on approach is the room moving, not
 * four silhouettes sliding; and at the reading stop the far wall hands its
 * pixels to the crisp HTML copy of the same frame, which is what makes
 * "Authorized media from an existing World" a true statement about what is on
 * screen rather than a caption beside an unrelated picture.
 *
 * It is a window, not a router: this stage never navigates. The HTML layer owns
 * every link, and entering the World stays an explicit action.
 */
export function portalStage(assets: StageAssets = {}): SurfaceStage {
  const res = bin(), object = new THREE.Group();
  const OPEN_W = .95, OPEN_H = 1.2;
  const aperture = new THREE.Group(); object.add(aperture);
  const interior = new THREE.Group(); interior.position.z = -.35; object.add(interior);

  // The near wall. Its edge is the whole illusion: it has to occlude the room as
  // the camera moves, which a painted border cannot do.
  const wallShape = new THREE.Shape();
  wallShape.moveTo(-9, -5.4); wallShape.lineTo(9, -5.4); wallShape.lineTo(9, 5.4); wallShape.lineTo(-9, 5.4); wallShape.closePath();
  const cut = new THREE.Path();
  cut.moveTo(-OPEN_W, -OPEN_H); cut.lineTo(OPEN_W, -OPEN_H); cut.lineTo(OPEN_W, OPEN_H); cut.lineTo(-OPEN_W, OPEN_H); cut.closePath();
  wallShape.holes.push(cut);
  const wall = res.mat(new THREE.MeshStandardMaterial({ color: 0x080c11, roughness: .9, metalness: .06, side: THREE.DoubleSide }));
  aperture.add(new THREE.Mesh(res.geo(new THREE.ShapeGeometry(wallShape)), wall));

  const satin = res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .32, metalness: .55 }));
  const inkEdge = res.mat(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .14 }));
  const rim = res.mat(new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: .26 }));
  ([[0, OPEN_H + .06, OPEN_W * 2 + .24, .12], [0, -OPEN_H - .06, OPEN_W * 2 + .24, .12],
    [-OPEN_W - .06, 0, .12, OPEN_H * 2], [OPEN_W + .06, 0, .12, OPEN_H * 2]] as const).forEach(([x, y, w, h]) => {
    const bar = new THREE.Mesh(res.geo(new THREE.BoxGeometry(w, h, .22)), satin);
    bar.position.set(x, y, .11); aperture.add(outline(res, bar, inkEdge));
  });
  const rimLine = new THREE.LineSegments(
    res.geo(new THREE.EdgesGeometry(res.geo(new THREE.PlaneGeometry(OPEN_W * 2, OPEN_H * 2)))), rim,
  );
  aperture.add(rimLine);

  /* ------------------------------------------------------------ the room */

  const BACK_Z = -5.2, ROOM_W = 8.4, ROOM_H = 4.72, FLOOR_Y = -2.36;

  // The far wall. It starts as the room's own tone and becomes the frame when the
  // texture resolves, so a slow network gets a dim room rather than a hole.
  const backMaterial = res.mat(new THREE.MeshBasicMaterial({ color: 0x101b1e }));
  const surface = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(ROOM_W, ROOM_H)), backMaterial);
  surface.position.set(0, -.18, BACK_Z);
  interior.add(surface);

  if (assets.worldInterior) {
    const loader = new THREE.TextureLoader();
    loader.load(assets.worldInterior, (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      // Registered in the stage's own bin, so leaving the chapter frees it.
      res.map(texture);
      backMaterial.map = texture;
      backMaterial.color.setHex(0xffffff);
      backMaterial.needsUpdate = true;
    });
  }

  const room = res.mat(new THREE.MeshStandardMaterial({ color: 0x0a1417, roughness: .78, metalness: .12 }));
  const floorMaterial = res.mat(new THREE.MeshStandardMaterial({ color: 0x0b1013, roughness: .34, metalness: .42 }));

  const floor = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(ROOM_W, 6.2)), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR_Y, BACK_Z + 3.1);
  interior.add(floor);

  const ceiling = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(ROOM_W, 6.2)), room);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, FLOOR_Y + ROOM_H, BACK_Z + 3.1);
  interior.add(ceiling);

  const sides = [-1, 1].map(sign => {
    const side = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(6.2, ROOM_H)), room);
    side.rotation.y = sign * Math.PI / 2;
    side.position.set(sign * ROOM_W / 2, FLOOR_Y + ROOM_H / 2, BACK_Z + 3.1);
    interior.add(side);
    return side;
  });

  // A counter running down each side at mid depth. Real geometry, tinted to the
  // frame's own marble, so the room has something between the threshold and its
  // back wall for the camera to move against.
  const counter = res.mat(new THREE.MeshStandardMaterial({ color: 0x121a1d, roughness: .3, metalness: .5 }));
  const benches = [-1, 1].map(sign => {
    const bench = new THREE.Mesh(res.geo(new THREE.BoxGeometry(1.5, .9, 5)), counter);
    bench.position.set(sign * (ROOM_W / 2 - .78), FLOOR_Y + .45, BACK_Z + 2.7);
    interior.add(outline(res, bench, inkEdge));
    return bench;
  });

  // The light that belongs beyond the opening, not in front of it.
  const glowMat = res.mat(new THREE.MeshBasicMaterial({ color: 0xd8c8a8, transparent: true, opacity: .06 }));
  const glow = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(ROOM_W * 1.2, ROOM_H * .7)), glowMat);
  glow.position.set(0, FLOOR_Y + ROOM_H * .62, BACK_Z + .12);
  interior.add(glow);

  const handoff = surfaceHandoff();
  let progress = 0;

  return {
    object,
    surface,
    setCamera: handoff.setCamera,
    update(local, time) {
      progress = clamp(local, 0, 1);
      // Approach, cross, arrive. The crossing has its own interval rather than
      // sharing one with the reading stop, so the frame is gone by the time the
      // visitor is meant to be reading inside.
      const open = ramp(progress, .28, .48), breath = life(progress);
      const approach = ramp(progress, 0, .28);

      // The room answers the camera before the crossing: the near counters slide
      // more than the far wall, which is parallax from real depth rather than
      // four cut-outs being translated.
      const sway = (approach - .5) * .5 + breath * Math.sin(time * .16) * .012;
      benches.forEach((bench, i) => { bench.position.x = (i === 0 ? -1 : 1) * (ROOM_W / 2 - .78) - sway * .5; });
      sides.forEach((side, i) => { side.position.x = (i === 0 ? -1 : 1) * ROOM_W / 2 - sway * .3; });
      surface.position.x = -sway * .12;
      glow.position.x = -sway * .12;
      glowMat.opacity = .06 + open * .05;

      rim.opacity = .26 * (1 - open);
      // The aperture grows past the frustum and keeps going; the room stays
      // exactly where it was authored, so what changes is the wall, not the world.
      aperture.scale.setScalar(1 + open * 5.2);
      aperture.position.z = open * 1.1;
      aperture.visible = open < .995;
    },
    handoff: () => handoff.rect(surface, ramp(progress, .4, .53)),
    dispose() { object.clear(); res.dispose(); },
  };
}

/**
 * Media a stage needs from the route. Paths are resolved by the page, because
 * only the page knows the deployment's base URL, and the stage must never guess
 * one: a guessed path is a silently empty portal.
 */
export interface StageAssets {
  /** A frame of the published World whose interior the portal opens onto. */
  worldInterior?: string | null;
}

export const STAGES: Record<ArtifactId, (assets: StageAssets) => ArtifactStage> = {
  workflow: workflowStage,
  carton: cartonStage,
  tracks: tracksStage,
  portal: portalStage,
};
