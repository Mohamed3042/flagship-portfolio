/* =====================================================================
   ONE FLIGHT, NO CUTS — a story page's WebGL scene.

   The story page is the next leg of the home's flight. One fixed canvas
   sits behind the whole spine; scroll flies a camera that never cuts:
   approach the story's own planet (hook) → dive its atmosphere (brief) →
   fly a lit rail through the system's mechanism, gate by gate (build) →
   sweep the proof array (proof) → leave through the honest boundary
   (honesty) with the next story's planet already ahead (next).

   The DOM owns every word. This file reads where the stops are
   ([data-flight-stop]) and the pin progress the scroll engine publishes
   (flight-state.ts), and draws. The universe comes from world.ts, which
   the home shares, so the planet a reader met there is the one they land
   on here. Dynamic-imported by flight-boot.ts after the first paint.
   ===================================================================== */
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  BoxGeometry,
  type Texture,
} from 'three';
import { constructVert, nebulaFrag, nebulaVert, railFrag, routeFrag, routeVert } from './shaders';
import { skyPalette, type SkyPalette } from './palette';
import { createPost } from './post';
import { flightState } from './flight-state';
import { AMBER, buildRig, makeConstruct } from './rigs';
import { createTextField } from './text';
import {
  buildBackdrop,
  buildComets,
  buildCore,
  buildDustField,
  buildFarShell,
  buildGalaxy,
  buildNebulae,
  buildSystem,
  clamp01,
  createWorld,
  prepareBake,
  damp,
  docTop,
  easeInOut,
  easeOut,
  sharedGeometry,
  type SystemSpec,
} from './world';

export interface FlightShot {
  src: string;
  w: number;
  h: number;
}

export interface FlightData {
  spec: SystemSpec;
  visual: string;
  legacy: boolean;
  /** number of proof metrics (0 on a foundation story: the array becomes satellites) */
  proof: number;
  shots: FlightShot[];
  next: SystemSpec & { href: string };
  models: string[];
  draco: string;
  basis: string;
}

export interface FlightOptions {
  rtl: boolean;
}

export interface FlightEngine {
  dispose(): void;
  relayout(): void;
  retheme(): void;
}

type StopKind = 'hook' | 'brief' | 'build' | 'proof' | 'honesty' | 'next';
const ORDER: StopKind[] = ['hook', 'brief', 'build', 'proof', 'honesty', 'next'];
interface Stop {
  kind: StopKind;
  y0: number;
  y1: number;
  pinned: boolean;
}
interface Key {
  u: number;
  pos: Vector3;
  look: Vector3;
}

/* --------------------------------------------------------------- engine -- */

export async function mountFlight(canvas: HTMLCanvasElement, data: FlightData, opts: FlightOptions): Promise<FlightEngine> {
  const t0 = performance.now();
  let pal: SkyPalette = skyPalette();
  const rtlSign = opts.rtl ? -1 : 1;

  const renderer = new WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: 'high-performance' });
  renderer.toneMapping = NoToneMapping;
  renderer.setClearColor(0x000000, 1);
  let dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 1, 0.1, 4000);
  const world = createWorld(scene, pal, dpr, renderer);
  const { common } = world;

  /* ---- the same universe as the home ---- */
  const backdrop = buildBackdrop(world);
  const galaxy = buildGalaxy(world);
  buildFarShell(world);
  const nebulae = buildNebulae(world);
  const core = buildCore(world);
  const comets = buildComets(world);
  const geo = sharedGeometry(world);

  /* ---- this story's planet and the local frame around it ---- */
  const spec = data.spec;
  await prepareBake(world, [spec.kind, data.next.kind, 2]);
  // the hero planet: a 4K surface, baked after the first frame
  const sys = buildSystem(world, spec, geo, spec.kind, { size: 4096, start: 1024 });
  const P0 = sys.pos.clone();
  const R = sys.radius;
  const up = new Vector3(0, 1, 0);
  const out = new Vector3(P0.x, 0, P0.z).normalize();
  if (!out.lengthSq()) out.set(1, 0, 0);
  // fly along the disc, never straight out of it
  const fwd = new Vector3(-out.z, 0, out.x).multiplyScalar(spec.kind % 2 ? -1 : 1);
  const side = new Vector3().crossVectors(up, fwd).normalize().multiplyScalar(rtlSign);
  const a = new Color(spec.a);
  const b = new Color(spec.b);
  // the key light comes from the approach side, so the face the hook camera
  // meets is the lit one on every story, whatever the seat's galaxy geometry.
  // During the hook it swings from a wide crescent into full day (the reveal).
  const lightDir = new Vector3().addScaledVector(side, 1.0).addScaledVector(fwd, -0.55).addScaledVector(up, 0.6).normalize();
  const setLight = (turn: number) => {
    const dir = lightDir.clone().applyAxisAngle(up, turn);
    sys.keyLight.copy(P0).addScaledVector(dir, 600);
  };
  setLight(0);

  /* ---- the rail ---- */
  const L = 122;
  const S = P0.clone().addScaledVector(fwd, R * 3.2).addScaledVector(up, R * 0.1);
  // the rail sweeps away from the planet so the mechanism never stacks behind it
  const railPts = [
    S,
    S.clone().addScaledVector(fwd, L * 0.28).addScaledVector(side, 13),
    S.clone().addScaledVector(fwd, L * 0.6).addScaledVector(side, 26).addScaledVector(up, 3),
    S.clone().addScaledVector(fwd, L).addScaledVector(side, 38),
  ];
  const rail = new CatmullRomCurve3(railPts, false, 'centripetal');
  const railMat = world.shader({
    vertexShader: constructVert,
    fragmentShader: railFrag,
    uniforms: { ...common, uColor: { value: b.clone() }, uDraw: { value: 0.12 } },
  });
  const railMesh = new Mesh(world.track(new TubeGeometry(rail, 420, 0.13, 10, false)), railMat);
  railMesh.frustumCulled = false;
  scene.add(railMesh);

  // sparks that ride the rail (the home's route shader)
  const sparkCount = 6000;
  const sPos = new Float32Array(sparkCount * 3);
  const sT = new Float32Array(sparkCount);
  const tmp = new Vector3();
  for (let i = 0; i < sparkCount; i++) {
    const t = i / (sparkCount - 1);
    rail.getPointAt(t, tmp);
    sPos[i * 3] = tmp.x + (Math.random() - 0.5) * 0.5;
    sPos[i * 3 + 1] = tmp.y + (Math.random() - 0.5) * 0.5;
    sPos[i * 3 + 2] = tmp.z + (Math.random() - 0.5) * 0.5;
    sT[i] = t;
  }
  const sparkGeo = world.track(new BufferGeometry());
  sparkGeo.setAttribute('position', new BufferAttribute(sPos, 3));
  sparkGeo.setAttribute('aT', new BufferAttribute(sT, 1));
  const sparkMat = world.shader({ vertexShader: routeVert, fragmentShader: routeFrag, uniforms: { ...common, uDraw: { value: 0.12 }, uColor: { value: b.clone() } } });
  const sparks = new Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  scene.add(sparks);

  // near dust so the moving camera always has parallax against something close
  const mid = rail.getPointAt(0.5);
  buildDustField(world, mid, new Vector3(L * 0.7, 28, L * 0.7), 60000, Math.floor(spec.seed * 100));
  buildDustField(world, rail.getPointAt(0.35), new Vector3(34, 11, 34), 50000, Math.floor(spec.seed * 100) + 1);
  buildDustField(world, rail.getPointAt(0.72).addScaledVector(side, 6), new Vector3(26, 10, 26), 36000, Math.floor(spec.seed * 100) + 2);
  // wisps of the story's own colour drift along the rail
  {
    const wispGeo = world.track(new PlaneGeometry(1, 1));
    [0.22, 0.48, 0.74].forEach((t, k) => {
      const mat = world.shader({
        vertexShader: nebulaVert,
        fragmentShader: nebulaFrag(4),
        side: DoubleSide,
        uniforms: { ...common, uSeed: { value: 90 + k * 3.1 + spec.seed }, uOpacity: { value: 0.2 }, uColA: { value: b.clone() }, uColB: { value: a.clone() } },
      });
      const m = new Mesh(wispGeo, mat);
      m.position.copy(rail.getPointAt(t)).addScaledVector(side, (k % 2 ? -1 : 1) * 9).addScaledVector(up, 2 + k);
      m.rotation.set(-Math.PI / 2 + 0.5, 0.3 * k, 0.7 * k);
      m.scale.set(38, 24, 1);
      m.renderOrder = -1;
      scene.add(m);
    });
  }

  /* ---- the mechanism: gates and parts along the rail ---- */
  const stepCount = Math.max(2, document.querySelectorAll('[data-build-item]').length || 4);
  const gateT: number[] = [];
  for (let i = 0; i < stepCount; i++) gateT.push(0.1 + (i / (stepCount - 1)) * 0.44);
  const rig = buildRig({ world, curve: rail, gateT, span: [0.08, 0.57], side, up, a, b, seed: spec.seed, visual: data.visual });

  /* ---- the proof array ---- */
  const C = rail.getPointAt(0.7).addScaledVector(side, 9).addScaledVector(up, -1.5);
  const arrayGroup = rig.group;
  const columns: { mesh: Mesh; cap: Mesh; base: number }[] = [];
  const satellites: { mesh: Mesh; r: number; phase: number; speed: number }[] = [];
  const proofN = data.proof;
  if (proofN > 0) {
    for (let i = 0; i < proofN; i++) {
      const g = world.track(new BoxGeometry(0.9, 1, 0.9));
      g.translate(0, 0.5, 0);
      const mat = makeConstruct(world, b);
      mat.uniforms.uRise.value = 1;
      const mesh = new Mesh(g, mat);
      const spreadT = (i - (proofN - 1) / 2) / Math.max(1, proofN - 1);
      mesh.position.copy(C).addScaledVector(fwd, spreadT * 12).addScaledVector(side, Math.abs(spreadT) * -3);
      mesh.scale.y = 1.5;
      scene.add(mesh);
      const cap = world.glow(b.getStyle(), 0, 5);
      cap.position.copy(mesh.position);
      scene.add(cap);
      const baseRing = new Mesh(world.track(new TorusGeometry(1.4, 0.05, 8, 48)), mat);
      baseRing.position.copy(mesh.position);
      baseRing.rotation.x = Math.PI / 2;
      scene.add(baseRing);
      columns.push({ mesh, cap, base: 1.5 });
    }
  } else {
    // foundation stories keep their DOM centerpiece: the array becomes satellites
    const sat = world.track(new SphereGeometry(0.42, 24, 18));
    for (let i = 0; i < 6; i++) {
      const mat = makeConstruct(world, i % 2 ? a : b);
      mat.uniforms.uRise.value = 1;
      const mesh = new Mesh(sat, mat);
      scene.add(mesh);
      satellites.push({ mesh, r: 5 + i * 1.4, phase: i * 1.1, speed: 0.35 - i * 0.03 });
    }
  }

  /* ---- the screens: sanitized product images as glass plates ---- */
  const loader = new TextureLoader();
  const plates: { mesh: Mesh; frame: LineSegments; back: Mesh; backing: Mesh; k: number; base: Vector3 }[] = [];
  const textures: Texture[] = [];
  data.shots.forEach((shot, k) => {
    const w = 9;
    const h = (w * shot.h) / shot.w;
    // light product UIs sit under the bloom threshold, on a dark glass backing
    const mat = world.track(new MeshBasicMaterial({ color: 0x8b91a2, transparent: true, opacity: 0, side: DoubleSide, depthWrite: false }));
    const mesh = new Mesh(world.track(new PlaneGeometry(w, h)), mat);
    const backing = new Mesh(
      world.track(new PlaneGeometry(w + 0.5, h + 0.5)),
      world.track(new MeshBasicMaterial({ color: 0x05060c, transparent: true, opacity: 0, side: DoubleSide, depthWrite: false })),
    );
    // ahead of the array on its own side of the frame (screen-right on the
    // proof sweep), never over the reading column
    mesh.position
      .copy(C)
      .addScaledVector(fwd, -5 - k * 3.2)
      .addScaledVector(side, -2 + k * 1.4)
      .addScaledVector(up, 6.5 + k * 0.8);
    mesh.lookAt(mesh.position.clone().addScaledVector(side, 10).addScaledVector(up, 3).addScaledVector(fwd, -4));
    scene.add(mesh);
    backing.position.copy(mesh.position).addScaledVector(side, -0.08);
    backing.quaternion.copy(mesh.quaternion);
    scene.add(backing);
    const frame = new LineSegments(
      world.track(new EdgesGeometry(mesh.geometry as PlaneGeometry)),
      world.track(new LineBasicMaterial({ color: b, transparent: true, opacity: 0, depthWrite: false, blending: world.blend() })),
    );
    frame.position.copy(mesh.position);
    frame.quaternion.copy(mesh.quaternion);
    scene.add(frame);
    const back = world.glow(b.getStyle(), 0, w * 1.6);
    back.position.copy(mesh.position).addScaledVector(side, -0.6);
    scene.add(back);
    plates.push({ mesh, frame, back, backing, k, base: mesh.position.clone() });
    loader.load(shot.src, (tex) => {
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(world.track(tex));
      mat.map = tex;
      mat.needsUpdate = true;
    });
  });

  /* ---- the boundary gate ---- */
  const G = rail.getPointAt(0.965);
  const gateTan = rail.getTangentAt(0.965).normalize();
  const boundary = (() => {
    const amber = new Color(AMBER);
    const mat = makeConstruct(world, amber);
    mat.uniforms.uRise.value = 1;
    const ring = new Mesh(world.track(new TorusGeometry(5.6, 0.22, 16, 96)), mat);
    const ring2 = new Mesh(world.track(new TorusGeometry(6.5, 0.07, 8, 8)), mat);
    const pylonGeo = world.track(new BoxGeometry(0.5, 2.4, 0.5));
    const pylons: Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const p = new Mesh(pylonGeo, mat);
      const ang = (i / 8) * Math.PI * 2;
      p.position.set(Math.cos(ang) * 5.6, Math.sin(ang) * 5.6, 0);
      p.rotation.z = ang + Math.PI / 2;
      pylons.push(p);
    }
    const glow = world.glow(AMBER, 0.1, 16);
    const group = ring;
    group.add(ring2, glow, ...pylons);
    group.position.copy(G);
    group.lookAt(G.clone().add(gateTan));
    scene.add(group);
    return { group, ring2, mat };
  })();

  /* ---- the next story's planet, already ahead ---- */
  const nextPos = G.clone().addScaledVector(gateTan, 58).addScaledVector(side, 14).addScaledVector(up, -3);
  const nextSys = buildSystem(world, { ...data.next, x: nextPos.x, y: nextPos.y, z: nextPos.z }, geo, data.next.kind + 1, { size: 1024, start: 512 });
  // the rail continues, faint, toward it
  const contCount = 900;
  const cPos = new Float32Array(contCount * 3);
  const cT = new Float32Array(contCount);
  const contCurve = new CatmullRomCurve3([G.clone(), G.clone().addScaledVector(gateTan, 60).addScaledVector(side, 8), nextPos.clone().addScaledVector(up, data.next.radius * 1.8)], false, 'centripetal');
  for (let i = 0; i < contCount; i++) {
    const t = i / (contCount - 1);
    contCurve.getPointAt(t, tmp);
    cPos[i * 3] = tmp.x;
    cPos[i * 3 + 1] = tmp.y;
    cPos[i * 3 + 2] = tmp.z;
    cT[i] = t;
  }
  const contGeo = world.track(new BufferGeometry());
  contGeo.setAttribute('position', new BufferAttribute(cPos, 3));
  contGeo.setAttribute('aT', new BufferAttribute(cT, 1));
  const contMat = world.shader({ vertexShader: routeVert, fragmentShader: routeFrag, uniforms: { ...common, uDraw: { value: 0 }, uColor: { value: new Color(data.next.b) } } });
  const cont = new Points(contGeo, contMat);
  cont.frustumCulled = false;
  scene.add(cont);

  /* ---- optional real models (Cake Studio's cakes) ---- */
  const modelGroup = rig.stackAnchor;
  if (data.models.length && modelGroup) {
    Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
      import('three/examples/jsm/loaders/KTX2Loader.js'),
      import('three/examples/jsm/libs/meshopt_decoder.module.js'),
    ])
      .then(([{ GLTFLoader }, { DRACOLoader }, { KTX2Loader }, { MeshoptDecoder }]) => {
        const draco = new DRACOLoader();
        draco.setDecoderPath(data.draco);
        const ktx2 = new KTX2Loader().setTranscoderPath(data.basis).detectSupport(renderer);
        const gltf = new GLTFLoader();
        gltf.setDRACOLoader(draco);
        gltf.setKTX2Loader(ktx2);
        gltf.setMeshoptDecoder(MeshoptDecoder);
        scene.add(new HemisphereLight(0xffffff, 0x1a2144, 1.6));
        const key = new DirectionalLight(0xfff1e0, 2.2);
        key.position.copy(sys.keyLight);
        scene.add(key);
        console.info('[flight] loading %d models', data.models.length);
        return Promise.all(data.models.map((url) => gltf.loadAsync(url)));
      })
      .then((models) => {
        console.info('[flight] models loaded: %d', models.length);
        if (disposed) return;
        // the primitive tiers step aside for the real cakes
        modelGroup.children.forEach((c) => (c.visible = false));
        models.forEach((m, i) => {
          const obj = m.scene;
          obj.updateMatrixWorld(true);
          // normalise to ~2.4 units tall, in a row along the rail where the tiers stood
          const bounds = new Box3().setFromObject(obj);
          const size = new Vector3();
          const centre = new Vector3();
          bounds.getSize(size);
          bounds.getCenter(centre);
          const s = 2.0 / Math.max(size.y, 1e-3);
          obj.scale.setScalar(s);
          obj.position.set(-centre.x * s, -bounds.min.y * s, -centre.z * s + (i - (models.length - 1) / 2) * 3.6);
          modelGroup.add(obj);
        });
      })
      .catch((err) => console.warn('[flight] cakes stay procedural:', err));
  }

  /* ---- post ---- */
  const post = createPost(renderer, scene, camera, { strength: 0.62, radius: 0.5, threshold: 0.8 });
  post.setLight(pal.light);
  post.setAnamorphic(0.8, spec.b);
  const letterbox = document.querySelector<HTMLElement>('.letterbox');
  let lbShown = -1;

  /* ---- every headline as particles ---- */
  const text = createTextField(world, camera, Array.from(document.querySelectorAll<HTMLElement>('[data-ptext]')), [spec.a, spec.b]);

  /* ---------------------------------------------------------- layout -- */
  let W = 1;
  let H = 1;
  let phone = false;
  let stops: Stop[] = [];
  let keys: Key[] = [];
  let posCurve: CatmullRomCurve3 | null = null;
  let lookCurve: CatmullRomCurve3 | null = null;
  let lastHeight = 0;
  let layoutVersion = -1;

  function buildKeys() {
    const K: Key[] = [];
    const push = (u: number, pos: Vector3, look: Vector3) => K.push({ u, pos, look });
    const far = phone ? 1.35 : 1;
    // hook: the approach
    push(0, P0.clone().addScaledVector(fwd, -R * 7.2 * far).addScaledVector(side, R * 5.4).addScaledVector(up, R * 2.4), P0.clone());
    push(0.55, P0.clone().addScaledVector(fwd, -R * 4.2 * far).addScaledVector(side, R * 3.9).addScaledVector(up, R * 1.3), P0.clone());
    push(1, P0.clone().addScaledVector(fwd, -R * 2.2 * far).addScaledVector(side, R * 3.1).addScaledVector(up, R * 0.8), P0.clone().addScaledVector(fwd, R * 0.5));
    // brief: skim the limb, the rail appears ahead
    push(1.5, P0.clone().addScaledVector(side, R * 2.5).addScaledVector(up, R * 0.9).addScaledVector(fwd, -R * 0.2), P0.clone().addScaledVector(fwd, R * 2.6).addScaledVector(side, R * 0.4));
    push(2, S.clone().addScaledVector(fwd, -5).addScaledVector(side, 1.4).addScaledVector(up, 4.6), S.clone().addScaledVector(fwd, 9).addScaledVector(side, 1.5).addScaledVector(up, 0.8));
    // build: along the rail, gate to gate
    const t0 = gateT[0] - 0.05;
    const t1 = gateT[gateT.length - 1] + 0.05;
    for (let i = 1; i <= 4; i++) {
      const s = i / 4;
      const t = t0 + (t1 - t0) * s;
      // above the rail, inside the gates, clear of the parts on either side
      const p = rail.getPointAt(clamp01(t)).addScaledVector(side, 1.2).addScaledVector(up, 4.2);
      const l = rail.getPointAt(clamp01(t + 0.08)).addScaledVector(up, 0.9);
      push(2 + s, p, l);
    }
    // proof: sweep around the array
    push(3.35, C.clone().addScaledVector(side, 16).addScaledVector(up, 5).addScaledVector(fwd, -9), C.clone().addScaledVector(up, 3));
    push(3.7, C.clone().addScaledVector(side, 12).addScaledVector(up, 7.5).addScaledVector(fwd, 5), C.clone().addScaledVector(up, 3));
    push(4, rail.getPointAt(0.74).addScaledVector(side, 12).addScaledVector(up, 6), G.clone());
    // honesty: the boundary seen whole, then flown through
    push(4.5, G.clone().addScaledVector(gateTan, -17).addScaledVector(side, 3).addScaledVector(up, 2.6), G.clone());
    push(5, G.clone().addScaledVector(gateTan, -1.5).addScaledVector(up, 1), nextPos.clone());
    // next: through the gate, the next planet ahead
    push(5.5, G.clone().addScaledVector(gateTan, 20).addScaledVector(side, 2).addScaledVector(up, 3), nextPos.clone());
    keys = K;
    hookDist = K[0].pos.distanceTo(P0);
    posCurve = new CatmullRomCurve3(K.map((k) => k.pos), false, 'centripetal');
    lookCurve = new CatmullRomCurve3(K.map((k) => k.look), false, 'centripetal');
  }

  function resize() {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const d = window.devicePixelRatio || 1;
    if (w === W && h === H && d === dpr) return;
    W = w;
    H = h;
    dpr = d;
    phone = W < 760;
    renderer.setPixelRatio(dpr);
    common.uPixel.value = dpr;
    renderer.setSize(W, H, false);
    post.resize(W, H, dpr);
    camera.aspect = W / H;
    camera.fov = phone ? 60 : 46;
    buildKeys();
    text.refresh();
    // on a phone the copy stacks above the array: the screens hang lower, clear of it
    plates.forEach(({ mesh, frame: fr, back, backing, base }) => {
      mesh.position.copy(base).addScaledVector(up, phone ? -5.5 : 0);
      fr.position.copy(mesh.position);
      backing.position.copy(mesh.position).addScaledVector(side, -0.08);
      back.position.copy(mesh.position).addScaledVector(side, -0.6);
    });
  }

  function relayout() {
    resize();

    const vh = H;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    lastHeight = document.documentElement.scrollHeight;
    layoutVersion = flightState.layoutVersion;
    const el = (k: StopKind) => document.querySelector<HTMLElement>(`[data-flight-stop="${k}"]`);
    const box = (k: StopKind) => {
      const e = el(k);
      return e ? { top: docTop(e), h: e.offsetHeight } : null;
    };
    const hook = box('hook');
    const brief = box('brief');
    const build = box('build');
    const proof = box('proof');
    const honesty = box('honesty');
    const next = box('next');
    const next_: Stop[] = [];
    const add = (kind: StopKind, y0: number, y1: number, pinned = false) => {
      const prev = next_[next_.length - 1];
      if (prev && y0 < prev.y1) y0 = prev.y1;
      if (y1 < y0 + 1) y1 = y0 + 1;
      next_.push({ kind, y0, y1, pinned });
    };
    const briefTop = brief ? brief.top : hook ? hook.top + hook.h : vh;
    add('hook', 0, Math.max(vh * 0.5, briefTop - vh * 0.85));
    const buildTop = build ? build.top : briefTop + (brief?.h ?? vh);
    add('brief', next_[0].y1, Math.max(next_[0].y1 + 1, buildTop - vh * 0.02));
    if (build) add('build', build.top, build.top + Math.max(vh, build.h - vh), true);
    if (proof) add('proof', proof.top, proof.top + Math.max(vh, proof.h - vh), true);
    const honTop = honesty ? honesty.top : (proof ? proof.top + proof.h : buildTop + vh);
    add('honesty', honTop - vh * 0.9, honTop + (honesty?.h ?? vh) * 0.35);
    const nextTop = next ? next.top : honTop + (honesty?.h ?? vh);
    add('next', Math.min(maxScroll - 1, nextTop - vh * 0.9), maxScroll);
    stops = next_;
  }

  /** scroll y → flight parameter u (0 … 5.5), continuous across stops */
  function progressAt(y: number): number {
    let u = 0;
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      const k = ORDER.indexOf(s.kind);
      const base = k;
      if (y <= s.y0) return base;
      if (y <= s.y1) {
        let local = (y - s.y0) / (s.y1 - s.y0);
        if (s.pinned) {
          if (s.kind === 'build' && flightState.buildActive) local = flightState.build;
          if (s.kind === 'proof' && flightState.proofActive) local = flightState.proof;
        }
        return base + clamp01(local) * (s.kind === 'next' ? 0.5 : 1);
      }
      u = base + (s.kind === 'next' ? 0.5 : 1);
    }
    return u;
  }

  function offsetsAt(u: number): { ox: number; oy: number } {
    // subject placement per leg: keep the scene beside the copy, never under it
    const table: [number, number, number][] = phone
      ? [
          [0, 0, 0.26],
          [1, 0, 0.18],
          [2, 0, -0.12],
          [3, 0, -0.24],
          [4, 0, 0.04],
          [5, 0, 0.1],
          [5.5, 0, 0.1],
        ]
      : [
          [0, -0.24 * rtlSign, 0],
          [1, -0.2 * rtlSign, 0],
          [2, 0, 0.04],
          [3, -0.2 * rtlSign, 0.02],
          [4, 0, 0.06],
          [5, 0, 0.1],
          [5.5, 0, 0.12],
        ];
    for (let i = 0; i < table.length - 1; i++) {
      const [ua, xa, ya] = table[i];
      const [ub, xb, yb] = table[i + 1];
      if (u <= ub) {
        const f = clamp01((u - ua) / Math.max(1e-6, ub - ua));
        return { ox: xa + (xb - xa) * f, oy: ya + (yb - ya) * f };
      }
    }
    const last = table[table.length - 1];
    return { ox: last[1], oy: last[2] };
  }

  /* ------------------------------------------------------------- loop -- */
  let u = 0;
  let raf = 0;
  let last = performance.now();
  let elapsed = 0;
  let velocity = 0;
  let disposed = false;
  let frames = 0;
  let frameMs = 0;
  let roll = 0;
  let hookDist = 1;
  const baseFov = () => (phone ? 60 : 46);
  const viewDir = new Vector3();
  const upTilt = new Vector3();
  const tan0 = new Vector3();
  const tan1 = new Vector3();
  let pointerX = 0;
  let pointerY = 0;
  let px = 0;
  let py = 0;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const onPointer = (e: PointerEvent) => {
    pointerX = (e.clientX / W) * 2 - 1;
    pointerY = (e.clientY / H) * 2 - 1;
  };
  if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });
  const tmpPos = new Vector3();
  const tmpLook = new Vector3();
  const right = new Vector3();
  const camUp = new Vector3();

  relayout();
  u = progressAt(window.scrollY);
  const tBuilt = performance.now();
  await renderer.compileAsync(scene, camera).catch(() => undefined);
  last = performance.now();
  console.info(`[flight] scene built in ${(tBuilt - t0).toFixed(0)} ms, programs compiled in ${(last - tBuilt).toFixed(0)} ms`);

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    frameMs = damp(frameMs, now - last, 2, dt);
    last = now;
    elapsed += dt;
    common.uTime.value = elapsed;
    frames++;

    // pins move the layout after we mounted: follow them
    if (document.documentElement.scrollHeight !== lastHeight || flightState.layoutVersion !== layoutVersion) relayout();

    const target = progressAt(window.scrollY);
    const before = u;
    // speed ramps: the camera floats at the hook, snaps through the gate run
    const rate = u < 1 ? 4.5 : u < 2 ? 5.5 : u < 3 ? 8.5 : u < 4 ? 6 : u < 5 ? 5.5 : 7.5;
    u = damp(u, target, rate, dt);
    if (Math.abs(target - u) < 1e-4) u = target;
    velocity = damp(velocity, Math.min(1, Math.abs(u - before) / dt / 2.4), 7, dt);

    // the reveal: the terminator sweeps across the planet during the hook
    setLight((1 - easeOut(clamp01(u / 0.85))) * 1.15);

    if (posCurve && lookCurve && keys.length > 1) {
      // keyframe index → curve parameter (three maps t uniformly per segment)
      let i = 0;
      while (i < keys.length - 2 && u > keys[i + 1].u) i++;
      const f = clamp01((u - keys[i].u) / Math.max(1e-6, keys[i + 1].u - keys[i].u));
      const t = (i + f) / (keys.length - 1);
      posCurve.getPoint(t, tmpPos);
      lookCurve.getPoint(t, tmpLook);
      camera.position.copy(tmpPos);
      // banking: the camera rolls into the rail's curves like a ship, and
      // holds a dutch angle on the flyby
      let rollTarget = 0;
      if (u > 1 && u < 1.9) rollTarget = -0.09 * clamp01((u - 1) / 0.4) * clamp01((1.9 - u) / 0.4);
      else if (u >= 2 && u < 3) {
        const tt = clamp01(0.08 + (u - 2) * 0.46);
        rail.getTangentAt(tt, tan0);
        rail.getTangentAt(Math.min(1, tt + 0.03), tan1);
        rollTarget = clamp01(1) * -6.5 * side.dot(tan1.sub(tan0));
      } else if (u >= 3 && u < 4) rollTarget = 0.07 * clamp01((u - 3) / 0.5) * clamp01((4 - u) / 0.5);
      roll = damp(roll, Math.max(-0.16, Math.min(0.16, rollTarget)), 3, dt);
      viewDir.copy(tmpLook).sub(camera.position).normalize();
      camera.up.copy(upTilt.set(0, 1, 0).applyAxisAngle(viewDir, roll));
      camera.lookAt(tmpLook);
      camera.updateMatrixWorld();
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      camUp.setFromMatrixColumn(camera.matrixWorld, 1);
      px = damp(px, pointerX, 2.5, dt);
      py = damp(py, pointerY, 2.5, dt);
      const sway = Math.sin(elapsed * 0.24) * 0.35;
      camera.position.addScaledVector(right, px * 1.2 + sway).addScaledVector(camUp, -py * 0.8 + Math.cos(elapsed * 0.31) * 0.2);
      camera.lookAt(tmpLook);
      const { ox, oy } = offsetsAt(u);
      camera.setViewOffset(W, H, ox * W, oy * H, W, H);
      // the Vertigo shot: dollying in while the lens widens holds the planet's
      // size and makes the whole sky rush past it
      const hold = easeInOut(clamp01(u / 0.95)) * (1 - easeInOut(clamp01((u - 1.05) / 0.55)));
      const d = camera.position.distanceTo(P0);
      const base = baseFov();
      const fovHold = (2 * Math.atan(Math.tan((base * Math.PI) / 360) * (hookDist / Math.max(d, 0.1))) * 180) / Math.PI;
      camera.fov = base + (Math.min(fovHold, base + 34) - base) * hold * 0.7;
    }
    camera.updateProjectionMatrix();

    // the rail draws itself ahead of the camera; the continuation lights at the gate
    const draw = clamp01(0.1 + (u - 1.4) * 0.32);
    railMat.uniforms.uDraw.value = draw;
    sparkMat.uniforms.uDraw.value = draw;
    contMat.uniforms.uDraw.value = clamp01((u - 4.4) * 0.9);

    // build progress: from the pin when it is live, else from the flight itself
    const p = clamp01(u - 2);
    const pulse = rig.update(p, elapsed, clamp01((u - 1.8) / 0.2));

    // proof: columns charge as the pin scrubs
    const q = clamp01(u - 3);
    columns.forEach((c, i) => {
      const k = easeOut(clamp01((q * (proofN + 0.6) - i * 0.85) / 1.2));
      c.mesh.scale.y = c.base + k * 9;
      (c.mesh.material as { uniforms: { uHot: { value: number } } }).uniforms.uHot.value = k * (0.7 + 0.3 * Math.sin(elapsed * 3 + i));
      c.cap.position.y = c.mesh.position.y + c.mesh.scale.y + 0.6;
      (c.cap.material as { uniforms: { uOpacity: { value: number } } }).uniforms.uOpacity.value = k * 0.5;
    });
    satellites.forEach((s) => {
      const ang = s.phase + elapsed * s.speed;
      s.mesh.position.copy(C).addScaledVector(fwd, Math.cos(ang) * s.r).addScaledVector(side, Math.sin(ang) * s.r * 0.6).addScaledVector(up, Math.sin(ang * 1.7) * 1.5 + 2);
      (s.mesh.material as { uniforms: { uHot: { value: number } } }).uniforms.uHot.value = q * 0.8;
    });
    const plateIn = easeOut(clamp01((u - 2.9) * 1.6)) * (1 - easeOut(clamp01((u - 4.3) * 1.4)));
    plates.forEach(({ mesh, frame: fr, back, backing, k }) => {
      const kk = easeOut(clamp01(plateIn * 1.4 - k * 0.25));
      (mesh.material as MeshBasicMaterial).opacity = kk;
      (backing.material as MeshBasicMaterial).opacity = kk * 0.8;
      (fr.material as LineBasicMaterial).opacity = kk * 0.9;
      (back.material as { uniforms: { uOpacity: { value: number } } }).uniforms.uOpacity.value = kk * 0.07;
      const bob = Math.sin(elapsed * 0.7 + k) * 0.004;
      mesh.position.y += bob;
      backing.position.y += bob;
      fr.position.y += bob;
    });

    // the boundary pulses as you reach it; the core steps back at the close
    boundary.mat.uniforms.uHot.value = 0.35 + 0.65 * clamp01((u - 4) * 1.2) * (0.6 + 0.4 * Math.sin(elapsed * 1.8));
    boundary.ring2.rotation.z += dt * 0.25;
    // the galaxy core is scenery here, never the subject: keep it below bloom
    core.setClose(0.8 + 0.2 * clamp01((u - 4.6) * 1.5), 0.35);

    // the hyperspace jump through the boundary: the sky streaks, a flash, and
    // the next planet resolves on the far side (all of it scrubbed)
    const warp = clamp01((u - 4.75) / 0.5) * (1 - clamp01((u - 5.26) / 0.14));
    const jump = Math.exp(-Math.pow((u - 5.2) / 0.075, 2));
    // the gate run: a kick and a flash at each crossing, only while moving
    const moving = Math.min(1, velocity * 5);
    const kick = pulse.kick * moving;
    camera.position.addScaledVector(right, kick * 0.18 * Math.sin(elapsed * 57)).addScaledVector(camUp, kick * 0.12 * Math.cos(elapsed * 43));
    camera.updateMatrixWorld();
    post.setFx({ warp, flash: Math.max(jump * 0.8, pulse.flash * moving * 0.28), flashColor: jump > pulse.flash * moving ? '#ffffff' : spec.b });
    galaxy.material.uniforms.uScale.value = 260 * (1 + warp * 0.9);
    // letterbox: the bars close for the action legs and open for the reading ones
    const lb = clamp01((u - 1.6) / 0.5) * (1 - clamp01((u - 4.15) / 0.45));
    if (letterbox && Math.abs(lb - lbShown) > 0.004) {
      lbShown = lb;
      letterbox.style.setProperty('--lb', lb.toFixed(3));
    }

    sys.update(dt, elapsed);
    nextSys.update(dt, elapsed);
    if (frames === 3) sys.upgrade();
    if (frames === 5) nextSys.upgrade();
    galaxy.points.rotation.y += dt * 0.0022;
    comets.update(dt);
    text.update(dt, elapsed, W, H);
    post.render(elapsed, velocity, world.overlay);
  };
  raf = requestAnimationFrame(frame);

  const onResize = () => relayout();
  window.addEventListener('resize', onResize, { passive: true });
  const ro = new ResizeObserver(() => relayout());
  ro.observe(document.body);

  (window as Window & { __flight?: unknown }).__flight = {
    get u() {
      return u;
    },
    get frames() {
      return frames;
    },
    get ms() {
      return frameMs;
    },
    get calls() {
      return renderer.info.render.calls;
    },
    get stops() {
      return stops.length;
    },
    get camera() {
      return [camera.position.x, camera.position.y, camera.position.z];
    },
  };

  return {
    relayout,
    retheme() {
      pal = skyPalette();
      world.retheme(pal);
      backdrop.repaint(pal);
      galaxy.repaint(pal);
      nebulae.repaint(pal);
      core.repaint(pal);
      post.setLight(pal.light);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      ro.disconnect();
      delete (window as Window & { __flight?: unknown }).__flight;
      text.dispose();
      post.dispose();
      world.dispose();
      renderer.dispose();
    },
  };
}
