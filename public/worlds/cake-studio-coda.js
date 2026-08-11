import * as THREE from './cake-studio/three.module.js';
import { GLTFLoader } from './cake-studio/GLTFLoader.js';
import { DRACOLoader } from './cake-studio/DRACOLoader.js';
import { KTX2Loader } from './cake-studio/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from './cake-studio/addons/libs/meshopt_decoder.module.js';

const READY_FORM_COUNT = 9;
const CONTROLLED_PART_COUNT = 4;
const OUTPUT_COUNT = 3;
const MODEL_ASSETS = [
  ['cake-01', 'cake-01-ivory-spiral.glb'],
  ['cake-02', 'cake-02-square-cocoa.glb'],
  ['cake-03', 'cake-03-oval-blush.glb'],
  ['cake-04', 'cake-04-heart-art-deco.glb'],
  ['cake-05', 'cake-05-hex-caramel.glb'],
  ['cake-06', 'cake-06-two-tier-cocoa.glb'],
  ['cake-07', 'cake-07-rect-sheet-cocoa.glb'],
  ['cake-08', 'cake-08-scalloped-ivory.glb'],
  ['cake-09', 'cake-09-tall-oval-teal.glb'],
  ['assembly-10', 'assembly-10-blank-two-tier-core.glb'],
  ['assembly-11', 'assembly-11-teal-fondant-collar.glb'],
  ['assembly-12', 'assembly-12-edible-image-panel.glb'],
  ['assembly-13', 'assembly-13-blank-bilingual-plaque.glb'],
  ['assembly-14', 'assembly-14-connected-topper.glb'],
  ['wafer-a', 'data-wafer-a-teal-order.glb'],
  ['wafer-b', 'data-wafer-b-rose-layout.glb'],
  ['wafer-c', 'data-wafer-c-ivory-measure.glb'],
  ['wafer-d', 'data-wafer-d-smoked-approval.glb'],
  ['wordmark-choose', 'wordmark-01-choose.glb'],
  ['wordmark-assemble', 'wordmark-02-assemble.glb'],
  ['wordmark-handoff', 'wordmark-03-handoff.glb'],
  ['handoff-frame', 'handoff-01-customer-mockup-frame.glb'],
  ['handoff-sheet', 'handoff-02-baker-sheet.glb'],
  ['handoff-plaque', 'handoff-03-true-size-plaque.glb'],
];
const MODEL_FILES = new Map(MODEL_ASSETS);
const MODEL_GROUPS = Object.freeze({
  forms: [
    'cake-01', 'cake-02', 'cake-03', 'cake-04', 'cake-05',
    'cake-06', 'cake-07', 'cake-08', 'cake-09', 'wordmark-choose',
  ],
  assembly: [
    'assembly-10', 'assembly-11', 'assembly-12', 'assembly-13', 'assembly-14',
    'wafer-a', 'wafer-b', 'wafer-c', 'wafer-d', 'wordmark-assemble',
  ],
  handoff: ['cake-06', 'handoff-frame', 'handoff-sheet', 'handoff-plaque', 'wordmark-handoff'],
});
const ZONE_X = Object.freeze({ forms: -9.2, assembly: 0, handoff: 9.2 });
const SET_ASSET = './cake-studio/set/cake-studio-proof-room.glb';
const CAMERA_TAU_MS = 80;
const CAMERA_IDLE_EPSILON = 0.00008;
const CAMERA_SNAP_DISTANCE = 0.36;
const ZERO_VECTOR = new THREE.Vector3();
const ZERO_EULER = new THREE.Euler();
const CAMERA_WORLD_SCALE = new THREE.Vector3();
const CAMERA_WORLD_DIRECTION = new THREE.Vector3();
const SHEET_WORLD_POSITION = new THREE.Vector3();
const authoredFovCurves = new WeakMap();
const textureCache = new Map();

const sceneElement = document.querySelector('[data-object-coda]');
const canvas = sceneElement?.querySelector('[data-cake-canvas]');
const fallback = sceneElement?.querySelector('[data-coda-fallback]');
const proofPortal = sceneElement?.querySelector('[data-proof-portal]');
const cakeStudioLiveUi = sceneElement?.querySelector('[data-cake-studio-live-ui]');
const actElements = sceneElement ? [...sceneElement.querySelectorAll('[data-object-act]')] : [];

const runtime = {
  version: '1.5.0',
  engine: `three-r${THREE.REVISION}`,
  webglAvailable: false,
  ready: false,
  progress: 0,
  rawProgress: 0,
  cameraState: 'idle',
  cameraPosition: { x: 0, y: 0, z: 0 },
  cameraTarget: { x: 0, y: 0, z: 0 },
  cameraFov: 35,
  act: 'forms',
  readyForms: READY_FORM_COUNT,
  controlledParts: CONTROLLED_PART_COUNT,
  outputs: OUTPUT_COUNT,
  modelStatus: 'idle',
  modelSource: 'procedural',
  activeModelGroup: 'none',
  residentModelGroups: [],
  modelsResident: 0,
  waferSource: 'procedural',
  waferModels: 0,
  wordmarkModels: 0,
  wordmarkAct: 'none',
  handoffArtifactSource: 'procedural',
  handoffArtifactModels: 0,
  modelsExpected: MODEL_ASSETS.length,
  modelsLoaded: 0,
  setStatus: 'idle',
  setSource: 'procedural',
  cameraSource: 'waypoint-fallback',
  sheetSource: 'procedural-fallback',
  sheetBones: 0,
  sheetAnimation: 'none',
  sheetPosition: { x: 0, y: 0, z: 0 },
  sheetBoneQuaternion: { x: 0, y: 0, z: 0, w: 1 },
  portalState: 'hidden',
  portalCrossed: false,
  uiReveal: 0,
  renders: 0,
  drawCalls: 0,
  triangles: 0,
  gpuTextures: 0,
  gpuGeometries: 0,
  pixelRatio: 0,
  fullMotion: true,
};
window.__cakeStudioCoda = runtime;
if (cakeStudioLiveUi) wireCakeStudioLiveUi(cakeStudioLiveUi);

if (!sceneElement || !canvas) {
  runtime.reason = 'markup-missing';
} else {
  try {
    initialise();
  } catch (error) {
    console.error('Cake Studio dimensional coda failed to initialise.', error);
    showFallback(error);
  }
}

function initialise() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    showFallback(error);
    return;
  }

  runtime.webglAvailable = true;
  runtime.ready = true;
  sceneElement.dataset.webgl = 'ready';
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020705, 0.046);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
  const cameraTarget = new THREE.Vector3(0, 0.8, 0);
  const productionLoader = createProductionLoader(renderer);

  const set = createPhysicalSet(scene);
  const sheet = createOpticalSheet(scene);
  const readyForms = createReadyForms(scene);
  const assembly = createControlledAssembly(scene);
  const handoff = createProductionOutputs(scene);
  const chapterWords = createChapterWords(scene);
  const states = { readyForms, assembly, handoff, chapterWords };
  runtime.probeFrame = () => probeRenderedFrame(renderer, scene, camera);
  const groupStates = new Map(Object.keys(MODEL_GROUPS).map((name) => [name, {
    name,
    status: 'idle',
    models: null,
    promise: null,
  }]));
  const loadedModelIds = new Set();

  let frame = 0;
  let lastFrameTime = 0;
  let smoothProgress = 0;
  let modelLoadStarted = false;
  let modelObserver = null;
  let width = 0;
  let height = 0;

  const resize = () => {
    const nextWidth = Math.max(1, Math.round(canvas.clientWidth));
    const nextHeight = Math.max(1, Math.round(canvas.clientHeight));
    if (nextWidth === width && nextHeight === height) return false;
    width = nextWidth;
    height = nextHeight;
    const compact = width / height < 0.72;
    const pixelRatio = Math.min(devicePixelRatio || 1, compact ? 1.2 : 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = compact ? 43 : 35;
    camera.updateProjectionMatrix();
    runtime.pixelRatio = pixelRatio;
    sceneElement.dataset.layout = compact ? 'portrait' : 'landscape';
    return true;
  };

  const readProgress = () => clamp(Number.parseFloat(sceneElement.style.getPropertyValue('--p') || '0'));
  smoothProgress = readProgress();

  function renderCoda(progress) {
    const compact = camera.aspect < 0.72;
    const p1 = range(progress, 0.025, 0.39);
    const p2 = range(progress, 0.31, 0.72);
    const p3 = range(progress, 0.64, 1);
    sceneElement.style.setProperty('--object-p', progress.toFixed(6));

    renderSheet(sheet, progress, p1, compact);
    renderReadyForms(readyForms, p1, progress, compact);
    renderAssembly(assembly, p2, progress, compact);
    renderHandoff(handoff, p3, progress, compact);
    renderChapterWords(chapterWords, progress, compact);
    renderSet(set, progress, compact);
    if (set.authored) renderAuthoredCamera(set, camera, progress, compact);
    else renderCamera(camera, cameraTarget, progress, compact);
    const activeRoot = actForProgress(progress) === 'forms'
      ? readyForms.root
      : actForProgress(progress) === 'assembly'
        ? assembly.root
        : handoff.root;
    runtime.subjectBounds = measureProjectedBounds(activeRoot, camera, width, height);
    renderProofPortal(progress);
    renderCaptions(progress);
    if (modelLoadStarted) manageModelResidency(progress);

    renderer.render(scene, camera);
    runtime.progress = Number(progress.toFixed(5));
    runtime.renders += 1;
    runtime.drawCalls = renderer.info.render.calls;
    runtime.triangles = renderer.info.render.triangles;
    runtime.gpuTextures = renderer.info.memory.textures;
    runtime.gpuGeometries = renderer.info.memory.geometries;
    sceneElement.dataset.renderCount = String(runtime.renders);
  }

  const draw = (now) => {
    frame = 0;
    resize();
    const rawProgress = readProgress();
    const distance = Math.abs(rawProgress - smoothProgress);
    const deltaMs = lastFrameTime ? Math.min(64, Math.max(1, now - lastFrameTime)) : 1000 / 60;
    lastFrameTime = now;

    if (distance > CAMERA_SNAP_DISTANCE) {
      smoothProgress = rawProgress;
    } else if (distance > CAMERA_IDLE_EPSILON) {
      const blend = 1 - Math.exp(-deltaMs / CAMERA_TAU_MS);
      smoothProgress = lerp(smoothProgress, rawProgress, blend);
    } else {
      smoothProgress = rawProgress;
    }

    runtime.rawProgress = Number(rawProgress.toFixed(6));
    runtime.cameraState = Math.abs(rawProgress - smoothProgress) > CAMERA_IDLE_EPSILON ? 'moving' : 'idle';
    sceneElement.dataset.cameraState = runtime.cameraState;
    renderCoda(smoothProgress);
    if (runtime.cameraState === 'moving') {
      frame = requestAnimationFrame(draw);
    } else {
      lastFrameTime = 0;
    }
  };
  const scheduleRender = () => {
    const bounds = sceneElement.getBoundingClientRect();
    if (bounds.top > innerHeight * 1.5 || bounds.bottom < -innerHeight * 0.5) return;
    runtime.rawProgress = Number(readProgress().toFixed(6));
    runtime.cameraState = Math.abs(runtime.rawProgress - smoothProgress) > CAMERA_IDLE_EPSILON ? 'moving' : 'idle';
    sceneElement.dataset.cameraState = runtime.cameraState;
    if (!frame) frame = requestAnimationFrame(draw);
  };
  let progressRefreshFrame = 0;
  const scheduleProgressRender = () => {
    scheduleRender();
    // cinema.js writes --p in its own animation frame. A second queued pass
    // guarantees WebGL samples that new knot even after a one-shot scroll.
    if (!progressRefreshFrame) {
      progressRefreshFrame = requestAnimationFrame(() => {
        progressRefreshFrame = 0;
        scheduleRender();
      });
    }
  };

  const startModelLoad = () => {
    if (modelLoadStarted) return;
    modelLoadStarted = true;
    runtime.modelStatus = 'loading';
    runtime.setStatus = 'loading';
    sceneElement.dataset.models = 'loading';
    loadProofRoom(set, sheet, scene, productionLoader.loader)
      .then(() => scheduleRender())
      .catch((error) => {
        runtime.setStatus = 'fallback';
        runtime.setSource = 'procedural';
        runtime.setError = error?.message || 'set-load-failed';
        console.warn('Cake Studio authored proof room unavailable; procedural set retained.', error);
        scheduleRender();
      });
    manageModelResidency(readProgress());
  };

  function manageModelResidency(progress) {
    const active = actForProgress(progress);
    runtime.activeModelGroup = active;
    ensureModelGroup(active, groupStates, states, productionLoader.loader, loadedModelIds, scheduleRender);
    if (progress > 0.24 && progress < 0.69) ensureModelGroup('assembly', groupStates, states, productionLoader.loader, loadedModelIds, scheduleRender);
    if (progress > 0.57) ensureModelGroup('handoff', groupStates, states, productionLoader.loader, loadedModelIds, scheduleRender);
    if (progress < 0.42) ensureModelGroup('forms', groupStates, states, productionLoader.loader, loadedModelIds, scheduleRender);

    if (progress > 0.47) disposeModelGroup('forms', groupStates, states);
    if (progress < 0.24 || progress > 0.80) disposeModelGroup('assembly', groupStates, states);
    if (progress < 0.55) disposeModelGroup('handoff', groupStates, states);
    updateResidencyRuntime(groupStates);
  }

  if ('IntersectionObserver' in window) {
    modelObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      modelObserver.disconnect();
      startModelLoad();
    }, { rootMargin: '180% 0px' });
    modelObserver.observe(sceneElement);
  } else {
    startModelLoad();
  }

  addEventListener('scroll', scheduleProgressRender, { passive: true });
  addEventListener('resize', scheduleRender, { passive: true });
  addEventListener('pageshow', scheduleRender, { passive: true });
  sceneElement.addEventListener('scene:live', scheduleRender);
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    runtime.webglAvailable = false;
    runtime.ready = false;
    showFallback(new Error('WebGL context lost'));
  });
  addEventListener('pagehide', () => {
    if (frame) cancelAnimationFrame(frame);
    if (progressRefreshFrame) cancelAnimationFrame(progressRefreshFrame);
    modelObserver?.disconnect();
    for (const group of groupStates.keys()) disposeModelGroup(group, groupStates, states);
    productionLoader.ktx2.dispose();
    productionLoader.draco.dispose();
    renderer.dispose();
  }, { once: true });

  resize();
  runtime.rawProgress = Number(smoothProgress.toFixed(6));
  renderCoda(smoothProgress);
}

function createPhysicalSet(scene) {
  const root = new THREE.Group();
  root.name = 'physical-atelier';
  scene.add(root);

  const floorTexture = makeMarbleTexture();
  const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x07100e,
    map: floorTexture,
    roughness: 0.27,
    metalness: 0.08,
    clearcoat: 0.72,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.25,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(34, 24), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.16;
  root.add(floor);

  const rearMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x08221c,
    roughness: 0.58,
    metalness: 0.04,
    transparent: true,
    opacity: 0.52,
  });
  [-1, 1].forEach((side) => {
    const monolith = new THREE.Mesh(new THREE.BoxGeometry(5.4, 8.5, 0.3), rearMaterial);
    monolith.position.set(side * 8.1, 2.8, -5.4);
    monolith.rotation.y = side * -0.22;
    root.add(monolith);
  });

  scene.add(new THREE.HemisphereLight(0xcfe9df, 0x06100d, 1.55));
  const key = new THREE.SpotLight(0xffe2c2, 54, 35, Math.PI * 0.19, 0.54, 1.25);
  key.position.set(-7.5, 10, 9);
  key.target.position.set(0, 0.6, 0);
  scene.add(key, key.target);
  const edge = new THREE.SpotLight(0x52bda2, 38, 32, Math.PI * 0.22, 0.65, 1.15);
  edge.position.set(8, 6, -2);
  edge.target.position.set(0, 0.5, 0);
  scene.add(edge, edge.target);
  const rose = new THREE.PointLight(0xe39b7f, 18, 18, 1.65);
  rose.position.set(0, 2.4, 4.5);
  scene.add(rose);
  const archiveFill = new THREE.SpotLight(0xffddb8, 34, 30, Math.PI * 0.24, 0.72, 1.3);
  archiveFill.position.set(-11.8, 8.4, 7.2);
  archiveFill.target.position.set(-9.2, 1.5, -0.8);
  scene.add(archiveFill, archiveFill.target);

  return { root, floor, monoliths: root.children.filter((child) => child !== floor) };
}

function createOpticalSheet(scene) {
  const geometry = new THREE.PlaneGeometry(5.75, 3.45, 30, 18);
  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const edgeCurl = Math.pow(Math.abs(x) / 2.875, 2.4) * 0.23;
    const fibreLift = Math.sin((y / 3.45 + 0.5) * Math.PI) * 0.055;
    position.setZ(index, edgeCurl + fibreLift);
  }
  geometry.computeVertexNormals();
  const paper = new THREE.MeshPhysicalMaterial({
    color: 0xf1dfc5,
    map: makePaperTexture(),
    roughness: 0.58,
    metalness: 0.01,
    clearcoat: 0.18,
    clearcoatRoughness: 0.42,
    sheen: 0.48,
    sheenColor: new THREE.Color(0xf0b294),
    side: THREE.DoubleSide,
    transparent: true,
  });
  const group = new THREE.Group();
  const plane = new THREE.Mesh(geometry, paper);
  group.add(plane);
  const edgeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc9876f,
    roughness: 0.2,
    metalness: 0.72,
    clearcoat: 0.66,
    emissive: 0x35130d,
    emissiveIntensity: 0.45,
  });
  const topEdge = new THREE.Mesh(new THREE.BoxGeometry(5.76, 0.035, 0.06), edgeMaterial);
  const bottomEdge = topEdge.clone();
  topEdge.position.y = 1.725;
  bottomEdge.position.y = -1.725;
  group.add(topEdge, bottomEdge);
  group.position.set(0, 1.15, 0.25);
  group.rotation.set(-0.18, 0, 0);
  group.name = 'film-endpoint-sheet';
  scene.add(group);
  return { group, plane, paper, edges: [topEdge, bottomEdge] };
}

function createReadyForms(scene) {
  const root = new THREE.Group();
  root.name = 'nine-ready-forms';
  const forms = Array.from({ length: READY_FORM_COUNT }, (_, index) => createCakeForm(index));
  forms.forEach((form) => root.add(form));
  scene.add(root);
  return { root, forms, fallbackForms: forms, selectedIndex: 5, usingModels: false };
}

function createControlledAssembly(scene) {
  const root = new THREE.Group();
  root.name = 'controlled-cake-assembly';

  const body = new THREE.Group();
  const bodyMaterial = buttercreamMaterial(0xead7bb, 0.48);
  const lower = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.78, 1.35, 72, 5), bodyMaterial);
  lower.position.y = -0.13;
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.22, 1.22, 72, 5), buttercreamMaterial(0xf0dfc7, 0.52));
  upper.position.y = 1.14;
  const board = new THREE.Mesh(new THREE.CylinderGeometry(2.04, 2.04, 0.11, 72), roseGoldMaterial(0.46));
  board.position.y = -0.87;
  body.add(lower, upper, board);
  root.add(body);

  const surface = new THREE.Group();
  const surfaceShell = new THREE.Mesh(
    new THREE.CylinderGeometry(1.83, 1.83, 1.43, 72, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0x2e8e7c,
      roughness: 0.12,
      metalness: 0.06,
      transmission: 0.42,
      thickness: 0.18,
      transparent: true,
      opacity: 0.48,
      side: THREE.DoubleSide,
    }),
  );
  surfaceShell.position.y = -0.12;
  surface.add(surfaceShell);

  const edibleImage = new THREE.Group();
  const imageMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 0.83, 72, 1, true, -0.72, 1.44),
    new THREE.MeshPhysicalMaterial({
      map: makeEdibleImageTexture(),
      roughness: 0.55,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.04,
    }),
  );
  imageMesh.rotation.y = -Math.PI / 2;
  imageMesh.position.y = -0.12;
  edibleImage.add(imageMesh);

  const plaque = new THREE.Group();
  const plaqueMesh = new THREE.Mesh(makeEllipseGeometry(1.15, 0.37, 0.08), roseGoldMaterial(0.25));
  plaqueMesh.position.set(0, -0.12, 1.77);
  plaque.add(plaqueMesh);

  const decoration = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.19, 0.085, 12, 72), buttercreamMaterial(0xe7a990, 0.38));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.78;
  decoration.add(ring);
  const topper = new THREE.Mesh(new THREE.TorusKnotGeometry(0.29, 0.07, 72, 10, 2, 3), roseGoldMaterial(0.16));
  topper.position.y = 2.55;
  topper.rotation.x = Math.PI / 2;
  decoration.add(topper);
  [-0.38, 0, 0.42].forEach((x, index) => {
    const berry = new THREE.Mesh(
      new THREE.SphereGeometry(0.19 + index * 0.02, 18, 12),
      fruitMaterial(index === 1 ? 0x4f1821 : 0x8d263c),
    );
    berry.position.set(x, 1.98 + Math.abs(index - 1) * 0.05, 0.08 - index * 0.06);
    decoration.add(berry);
  });

  const parts = [surface, edibleImage, plaque, decoration];
  parts.forEach((part, index) => {
    part.name = ['measured-surface', 'edible-image', 'bilingual-plaque', 'decoration'][index];
    root.add(part);
  });

  const waferRoot = new THREE.Group();
  const waferGeometry = new THREE.BoxGeometry(0.72, 0.055, 0.34);
  const waferMaterials = [
    glassMaterial(0x4bb9a0, 0.42),
    glassMaterial(0xd99f88, 0.45),
    glassMaterial(0xe9dcc7, 0.33),
    glassMaterial(0x2d6e62, 0.5),
  ];
  const wafers = Array.from({ length: 17 }, (_, index) => {
    const wafer = new THREE.Mesh(waferGeometry, waferMaterials[index % waferMaterials.length]);
    wafer.userData.phase = index / 17;
    waferRoot.add(wafer);
    return wafer;
  });
  root.add(waferRoot);
  root.visible = false;
  scene.add(root);
  return {
    root,
    body,
    parts,
    wafers,
    waferRoot,
    fallbackBody: body,
    fallbackParts: parts,
    fallbackWafers: wafers,
    usingModels: false,
  };
}

function createProductionOutputs(scene) {
  const root = new THREE.Group();
  root.name = 'three-production-outputs';
  const source = createCakeForm(5, true);
  source.name = 'approved-source-cake';
  root.add(source);

  const mockup = new THREE.Group();
  const mockupPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.32, 2.55), darkStoneMaterial());
  mockupPlinth.position.y = -0.9;
  const miniature = createCakeForm(5, true);
  miniature.scale.setScalar(0.62);
  miniature.position.y = -0.72;
  const vitrine = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 2.95, 2.1),
    new THREE.MeshPhysicalMaterial({
      color: 0x7ac7b8,
      roughness: 0.07,
      metalness: 0,
      transmission: 0.72,
      thickness: 0.12,
      transparent: true,
      opacity: 0.26,
      side: THREE.DoubleSide,
    }),
  );
  vitrine.position.y = 0.46;
  mockup.add(mockupPlinth, miniature, vitrine);

  const bakerSheet = new THREE.Group();
  const sheetGeometry = new THREE.PlaneGeometry(2.85, 2.08, 20, 12);
  const sheetPosition = sheetGeometry.attributes.position;
  for (let index = 0; index < sheetPosition.count; index += 1) {
    const x = sheetPosition.getX(index);
    sheetPosition.setZ(index, Math.pow((x + 1.425) / 2.85, 3) * 0.54);
  }
  sheetGeometry.computeVertexNormals();
  const sheetMesh = new THREE.Mesh(sheetGeometry, new THREE.MeshPhysicalMaterial({
    color: 0xead8bb,
    map: makePaperTexture(),
    roughness: 0.66,
    side: THREE.DoubleSide,
  }));
  sheetMesh.rotation.x = -0.9;
  sheetMesh.position.y = 0.28;
  const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.1, 20), roseGoldMaterial(0.24));
  roller.rotation.z = Math.PI / 2;
  roller.position.set(1.35, -0.3, 0.34);
  const sheetPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.32, 2.55), darkStoneMaterial());
  sheetPlinth.position.y = -0.9;
  bakerSheet.add(sheetPlinth, sheetMesh, roller);

  const plaque = new THREE.Group();
  const plaquePlinth = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.32, 2.55), darkStoneMaterial());
  plaquePlinth.position.y = -0.9;
  const plaqueBody = new THREE.Mesh(makeEllipseGeometry(1.22, 0.78, 0.12), new THREE.MeshPhysicalMaterial({
    color: 0xe9dcc7,
    roughness: 0.48,
    clearcoat: 0.18,
  }));
  plaqueBody.position.y = 0.35;
  plaqueBody.rotation.z = -0.08;
  const plaqueEdge = new THREE.Mesh(new THREE.TorusGeometry(1.23, 0.045, 8, 64), roseGoldMaterial(0.18));
  plaqueEdge.position.y = 0.35;
  plaqueEdge.scale.y = 0.64;
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 0.18), roseGoldMaterial(0.22));
  stand.position.y = -0.32;
  plaque.add(plaquePlinth, plaqueBody, plaqueEdge, stand);

  const artifacts = [mockup, bakerSheet, plaque];
  artifacts.forEach((artifact, index) => {
    artifact.name = ['customer-mockup', 'baker-sheet', 'true-size-plaque'][index];
    root.add(artifact);
  });
  root.visible = false;
  scene.add(root);
  return {
    root,
    source,
    artifacts,
    mockup,
    miniature,
    bakerSheet,
    plaque,
    fallbackSource: source,
    fallbackMiniature: miniature,
    fallbackMockupChildren: [...mockup.children],
    fallbackBakerChildren: [...bakerSheet.children],
    fallbackPlaqueChildren: [...plaque.children],
    usingModels: false,
  };
}

function createChapterWords(scene) {
  const root = new THREE.Group();
  root.name = 'physical-chapter-wordmarks';
  scene.add(root);
  return { root, wordsByAct: new Map(), usingModels: false };
}

function createProductionLoader(renderer) {
  THREE.Cache.enabled = false;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./cake-studio/draco/gltf/');
  dracoLoader.setDecoderConfig({ type: 'wasm' });
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('./cake-studio/addons/libs/basis/');
  ktx2Loader.detectSupport(renderer);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setKTX2Loader(ktx2Loader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  return { loader, draco: dracoLoader, ktx2: ktx2Loader };
}

async function loadProofRoom(set, sheet, scene, loader) {
  const gltf = await loader.loadAsync(SET_ASSET);
  const clip = gltf.animations.find((animation) => animation.name === 'ProofRoom_Cameras');
  const sheetClip = gltf.animations.find((animation) => animation.name === 'HeroSheet_Journey');
  const desktop = gltf.scene.getObjectByName('Camera_Desktop');
  const phone = gltf.scene.getObjectByName('Camera_Phone');
  const heroRig = gltf.scene.getObjectByName('HeroSheet_Rig');
  const heroMeshRoot = gltf.scene.getObjectByName('HeroSheet_Mesh');
  const heroMeshes = [];
  heroMeshRoot?.traverse((child) => { if (child.isSkinnedMesh) heroMeshes.push(child); });
  const heroMesh = heroMeshes[0];
  const aperture = gltf.scene.getObjectByName('CustomerFrame_Aperture');
  const semanticPlane = gltf.scene.getObjectByName('Portal_SemanticPlane');
  if (!clip || !desktop?.isCamera || !phone?.isCamera || !sheetClip
      || !heroRig || !heroMesh || !aperture || !semanticPlane) {
    throw new Error('proof-room camera, hero-sheet or aperture contract missing');
  }
  gltf.scene.name = 'cake-studio-authored-proof-room';
  gltf.scene.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = !child.isSkinnedMesh;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      if (material.map) material.map.anisotropy = 4;
      if (material.emissiveIntensity > 3.6) material.emissiveIntensity = 3.6;
    });
  });
  scene.add(gltf.scene);
  set.root.visible = false;
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(clip);
  action.enabled = true;
  action.paused = false;
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true;
  action.play();
  const sheetAction = mixer.clipAction(sheetClip);
  sheetAction.enabled = true;
  sheetAction.paused = false;
  sheetAction.setLoop(THREE.LoopOnce, 1);
  sheetAction.clampWhenFinished = true;
  sheetAction.play();
  mixer.setTime(0);
  set.authored = {
    root: gltf.scene,
    clip,
    mixer,
    action,
    desktop,
    phone,
    sheetClip,
    sheetAction,
    heroRig,
    heroMeshRoot,
    heroMeshes,
    heroMesh,
    aperture,
    semanticPlane,
  };
  sheet.group.visible = false;
  sheet.authored = { rig: heroRig, root: heroMeshRoot, meshes: heroMeshes, clip: sheetClip, action: sheetAction };
  runtime.setStatus = 'ready';
  runtime.setSource = 'cake-studio-proof-room.glb';
  runtime.cameraSource = 'authored-clip';
  runtime.sheetSource = 'blender-skinned-glb';
  runtime.sheetBones = Math.max(...heroMeshes.map((mesh) => mesh.skeleton?.bones?.length || 0));
  runtime.sheetAnimation = sheetClip.name;
  sceneElement.dataset.set = 'authored';
  sceneElement.dataset.camera = 'authored-clip';
}

function ensureModelGroup(name, groupStates, states, loader, loadedModelIds, scheduleRender) {
  const group = groupStates.get(name);
  if (!group) return Promise.resolve(null);
  group.wanted = true;
  if (group.status === 'ready' || group.status === 'loading') return group.promise;
  // A broken delivery is terminal for this page view. Re-entering this function
  // from the render loop must not turn one failed GLB into a request/render storm.
  if (group.status === 'fallback') return Promise.resolve(null);
  group.status = 'loading';
  const generation = (group.generation || 0) + 1;
  group.generation = generation;
  updateResidencyRuntime(groupStates);

  group.promise = loadModelEntries(name, MODEL_GROUPS[name], loader, loadedModelIds).then((entries) => {
    const models = new Map(entries);
    if (!group.wanted || group.generation !== generation) {
      disposeModelResources(models);
      group.status = 'idle';
      group.promise = null;
      updateResidencyRuntime(groupStates);
      return null;
    }
    group.models = models;
    adoptModelGroup(name, states, models);
    group.status = 'ready';
    runtime.modelStatus = 'ready';
    runtime.modelSource = 'staged-glb';
    sceneElement.dataset.models = 'ready';
    updateResidencyRuntime(groupStates);
    scheduleRender();
    return models;
  }).catch((error) => {
    group.status = 'fallback';
    group.promise = null;
    runtime.modelStatus = 'fallback';
    runtime.modelError = `${name}: ${error?.message || 'model-load-failed'}`;
    sceneElement.dataset.models = 'fallback';
    console.warn(`Cake Studio ${name} models unavailable; procedural group retained.`, error);
    updateResidencyRuntime(groupStates);
    scheduleRender();
    return null;
  });
  return group.promise;
}

async function loadModelEntries(groupName, ids, loader, loadedModelIds) {
  const entries = new Array(ids.length);
  const limit = matchMedia('(max-width: 700px)').matches ? 2 : 4;
  let cursor = 0;
  let loadError = null;
  const worker = async () => {
    while (cursor < ids.length && !loadError) {
      const index = cursor;
      cursor += 1;
      const id = ids[index];
      const file = MODEL_FILES.get(id);
      if (!file) {
        loadError = new Error(`${groupName}: unknown model ${id}`);
        return;
      }
      try {
        const gltf = await loader.loadAsync(`./cake-studio/models/${file}`);
        loadedModelIds.add(id);
        runtime.modelsLoaded = loadedModelIds.size;
        entries[index] = [id, prepareProductionModel(gltf.scene, id)];
      } catch (error) {
        loadError ||= error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, ids.length) }, () => worker()));
  if (loadError) {
    disposeModelResources(new Map(entries.filter(Boolean)));
    throw loadError;
  }
  return entries;
}

function updateResidencyRuntime(groupStates) {
  const resident = [...groupStates.values()].filter((group) => group.status === 'ready');
  runtime.residentModelGroups = resident.map((group) => group.name);
  runtime.modelsResident = resident.reduce((count, group) => count + (group.models?.size || 0), 0);
  sceneElement.dataset.residentGroups = runtime.residentModelGroups.join(',') || 'none';
}

function disposeModelGroup(name, groupStates, states) {
  const group = groupStates.get(name);
  if (!group) return;
  group.wanted = false;
  if (group.status === 'loading') return;
  if (group.status !== 'ready' || !group.models) return;
  restoreModelGroup(name, states);
  disposeModelResources(group.models);
  group.models = null;
  group.promise = null;
  group.status = 'idle';
  updateResidencyRuntime(groupStates);
}

function disposeModelResources(models) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  for (const model of models.values()) {
    model.removeFromParent();
    model.traverse((child) => {
      if (!child.isMesh) return;
      if (child.geometry) geometries.add(child.geometry);
      const list = Array.isArray(child.material) ? child.material : [child.material];
      list.filter(Boolean).forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value?.isTexture) textures.add(value);
        });
      });
    });
  }
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

function prepareProductionModel(model, id) {
  const wrapper = new THREE.Group();
  wrapper.name = `${id}-web-model`;
  model.name = `${id}-geometry`;
  wrapper.add(model);

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  wrapper.userData.modelId = id;
  wrapper.userData.modelDimensions = box.getSize(new THREE.Vector3());
  const isWordmark = id.startsWith('wordmark-');
  const isWafer = id.startsWith('wafer-');
  const isHandoffArtifact = id.startsWith('handoff-');
  const minimumRoughness = isWordmark ? 0.4 : isWafer ? 0.44 : isHandoffArtifact ? 0.48 : 0.58;
  const maximumMetalness = isWordmark ? 0.22 : isWafer ? 0.16 : isHandoffArtifact ? 0.12 : 0.06;

  model.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = true;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      if ('roughness' in material) material.roughness = Math.max(minimumRoughness, material.roughness);
      if ('metalness' in material) material.metalness = Math.min(maximumMetalness, material.metalness);
      if (material.map) material.map.anisotropy = 4;
      if (material.metalnessMap) material.metalnessMap.anisotropy = 2;
    });
  });
  return wrapper;
}

function adoptModelGroup(name, { readyForms, assembly, handoff, chapterWords }, models) {
  if (name === 'forms') {
    readyForms.root.remove(...readyForms.forms);
    readyForms.forms = Array.from({ length: READY_FORM_COUNT }, (_, index) => {
      const form = models.get(`cake-${String(index + 1).padStart(2, '0')}`);
      form.name = `ready-form-${String(index + 1).padStart(2, '0')}-glb`;
      form.userData.formIndex = index;
      readyForms.root.add(form);
      return form;
    });
    readyForms.usingModels = true;
    adoptChapterWord(chapterWords, 'forms', models.get('wordmark-choose'));
    return;
  }

  if (name === 'assembly') {
    assembly.root.remove(assembly.body, ...assembly.parts);
    assembly.waferRoot.remove(...assembly.wafers);
    const body = models.get('assembly-10');
    body.name = 'measured-body-glb';
    body.scale.setScalar(1.55);
    body.position.y = 0.18;
    assembly.root.add(body);
    const partSpecs = [
      ['assembly-11', new THREE.Vector3(0, -0.08, 0), new THREE.Euler(0, 0, 0), 1.48],
      ['assembly-12', new THREE.Vector3(0, 0.2, 1.28), new THREE.Euler(0, 0, 0), 0.92],
      ['assembly-13', new THREE.Vector3(0, 0.14, 1.52), new THREE.Euler(0, 0, 0), 0.54],
      ['assembly-14', new THREE.Vector3(0, 1.52, 0.05), new THREE.Euler(0, 0, 0), 0.58],
    ];
    const parts = partSpecs.map(([id, position, rotation, scale], index) => {
      const part = models.get(id);
      part.name = ['measured-surface-glb', 'edible-image-glb', 'bilingual-plaque-glb', 'decoration-glb'][index];
      part.userData.attachPosition = position;
      part.userData.attachRotation = rotation;
      part.userData.attachScale = scale;
      assembly.root.add(part);
      return part;
    });
    const waferIds = ['wafer-a', 'wafer-b', 'wafer-c', 'wafer-d'];
    const waferScales = [0.43, 0.47, 0.45, 0.41];
    const wafers = Array.from({ length: 17 }, (_, index) => {
      const modelId = waferIds[index % waferIds.length];
      const wafer = models.get(modelId).clone(true);
      wafer.name = `data-wafer-${String(index + 1).padStart(2, '0')}-${modelId}`;
      wafer.userData.phase = index / 17;
      wafer.userData.baseScale = waferScales[index % waferScales.length];
      wafer.userData.modelId = modelId;
      assembly.waferRoot.add(wafer);
      return wafer;
    });
    assembly.body = body;
    assembly.parts = parts;
    assembly.wafers = wafers;
    assembly.usingModels = true;
    runtime.waferSource = 'glb';
    runtime.waferModels = wafers.length;
    sceneElement.dataset.waferSource = 'glb';
    adoptChapterWord(chapterWords, 'assembly', models.get('wordmark-assemble'));
    return;
  }

  handoff.root.remove(handoff.source);
  const source = models.get('cake-06').clone(true);
  source.name = 'approved-source-cake-glb';
  handoff.root.add(source);
  handoff.source = source;
  handoff.mockup.clear();
  const frame = models.get('handoff-frame');
  frame.name = 'customer-mockup-frame-glb';
  frame.scale.setScalar(1.46);
  frame.position.set(0, 0.04, -0.12);
  handoff.mockup.add(frame);
  const miniature = models.get('cake-06').clone(true);
  miniature.name = 'customer-mockup-cake-glb';
  miniature.scale.setScalar(0.48);
  miniature.position.set(0, -0.08, 0.16);
  handoff.mockup.add(miniature);
  handoff.miniature = miniature;
  handoff.bakerSheet.clear();
  const bakerSheet = models.get('handoff-sheet');
  bakerSheet.name = 'baker-sheet-glb';
  bakerSheet.scale.setScalar(1.5);
  bakerSheet.position.y = 0.22;
  bakerSheet.rotation.x = -0.86;
  handoff.bakerSheet.add(bakerSheet);
  handoff.plaque.clear();
  const trueSizePlaque = models.get('handoff-plaque');
  trueSizePlaque.name = 'true-size-plaque-glb';
  trueSizePlaque.scale.setScalar(1.48);
  trueSizePlaque.position.y = 0.12;
  handoff.plaque.add(trueSizePlaque);
  handoff.usingModels = true;
  runtime.handoffArtifactSource = 'glb';
  runtime.handoffArtifactModels = 3;
  sceneElement.dataset.handoffArtifacts = 'glb';
  adoptChapterWord(chapterWords, 'handoff', models.get('wordmark-handoff'));
}

function adoptChapterWord(state, act, word) {
  const existing = state.wordsByAct.get(act);
  existing?.removeFromParent();
  word.name = `${act}-chapter-wordmark-glb`;
  word.userData.act = act;
  word.visible = false;
  state.root.add(word);
  state.wordsByAct.set(act, word);
  state.usingModels = state.wordsByAct.size > 0;
  runtime.wordmarkModels = state.wordsByAct.size;
  sceneElement.dataset.wordmarks = 'ready';
}

function restoreModelGroup(name, { readyForms, assembly, handoff, chapterWords }) {
  if (name === 'forms') {
    readyForms.root.remove(...readyForms.forms);
    readyForms.fallbackForms.forEach((form) => readyForms.root.add(form));
    readyForms.forms = readyForms.fallbackForms;
    readyForms.usingModels = false;
  } else if (name === 'assembly') {
    assembly.root.remove(assembly.body, ...assembly.parts);
    assembly.waferRoot.remove(...assembly.wafers);
    assembly.root.add(assembly.fallbackBody, ...assembly.fallbackParts);
    assembly.fallbackWafers.forEach((wafer) => assembly.waferRoot.add(wafer));
    assembly.body = assembly.fallbackBody;
    assembly.parts = assembly.fallbackParts;
    assembly.wafers = assembly.fallbackWafers;
    assembly.usingModels = false;
    runtime.waferSource = 'procedural';
    runtime.waferModels = 0;
    sceneElement.dataset.waferSource = 'procedural';
  } else {
    handoff.root.remove(handoff.source);
    handoff.root.add(handoff.fallbackSource);
    handoff.source = handoff.fallbackSource;
    handoff.mockup.clear();
    handoff.mockup.add(...handoff.fallbackMockupChildren);
    handoff.bakerSheet.clear();
    handoff.bakerSheet.add(...handoff.fallbackBakerChildren);
    handoff.plaque.clear();
    handoff.plaque.add(...handoff.fallbackPlaqueChildren);
    handoff.miniature = handoff.fallbackMiniature;
    handoff.usingModels = false;
    runtime.handoffArtifactSource = 'procedural';
    runtime.handoffArtifactModels = 0;
    sceneElement.dataset.handoffArtifacts = 'procedural';
  }
  const word = chapterWords.wordsByAct.get(name);
  word?.removeFromParent();
  chapterWords.wordsByAct.delete(name);
  chapterWords.usingModels = chapterWords.wordsByAct.size > 0;
  runtime.wordmarkModels = chapterWords.wordsByAct.size;
  if (!chapterWords.usingModels) sceneElement.dataset.wordmarks = 'idle';
}

function createCakeForm(index, simplified = false) {
  const group = new THREE.Group();
  group.name = `ready-form-${String(index + 1).padStart(2, '0')}`;
  const palette = [0xead9bd, 0x4b281e, 0xd7aa94, 0xf0d9c7, 0xc39c72, 0xead9bd, 0x5c3125, 0xf0dfc7, 0xc9a78b];
  const cakeMaterial = buttercreamMaterial(palette[index % palette.length], 0.48 + (index % 2) * 0.08);
  const boardMaterial = roseGoldMaterial(0.4);
  const specs = [
    { kind: 'round', radius: 0.76, height: 0.78 },
    { kind: 'square', radius: 0.76, height: 0.72 },
    { kind: 'oval', radius: 0.74, height: 0.8 },
    { kind: 'heart', radius: 0.72, height: 0.74 },
    { kind: 'hex', radius: 0.78, height: 0.72 },
    { kind: 'round', radius: 0.82, height: 0.76, tier: true },
    { kind: 'rect', radius: 0.74, height: 0.7 },
    { kind: 'scallop', radius: 0.78, height: 0.75 },
    { kind: 'oval', radius: 0.7, height: 0.98, tier: true },
  ];
  const spec = specs[index % specs.length];
  const bodyGeometry = cakeGeometry(spec.kind, spec.radius, spec.height);
  const body = new THREE.Mesh(bodyGeometry, cakeMaterial);
  body.position.y = spec.height / 2;
  group.add(body);

  if (spec.tier) {
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(spec.radius * 0.62, spec.radius * 0.65, 0.62, 48, 3), buttercreamMaterial(0xf0dfc7, 0.5));
    tier.position.y = spec.height + 0.31;
    group.add(tier);
  }

  const boardGeometry = spec.kind === 'rect'
    ? new THREE.BoxGeometry(1.98, 0.08, 1.5)
    : new THREE.CylinderGeometry(spec.radius + 0.18, spec.radius + 0.18, 0.08, spec.kind === 'square' ? 4 : 56);
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.y = -0.05;
  if (spec.kind === 'square') board.rotation.y = Math.PI / 4;
  group.add(board);

  if (!simplified) {
    const topY = spec.height + (spec.tier ? 0.64 : 0.04);
    const accent = new THREE.Mesh(new THREE.TorusGeometry(spec.radius * (spec.tier ? 0.62 : 0.82), 0.055, 9, 44), buttercreamMaterial(0xd9a38f, 0.34));
    accent.rotation.x = Math.PI / 2;
    accent.position.y = topY;
    group.add(accent);
    const berryMaterial = fruitMaterial(0x7c2035);
    [-0.18, 0.13].forEach((x, berryIndex) => {
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.11 + berryIndex * 0.025, 14, 10), berryMaterial);
      berry.position.set(x, topY + 0.12, berryIndex ? -0.08 : 0.07);
      group.add(berry);
    });
  }

  group.userData.formIndex = index;
  return group;
}

function renderSheet(sheet, progress, p1, compact) {
  if (sheet.authored) {
    sheet.group.visible = false;
    return;
  }
  const release = smooth(0.025, 0.155, progress);
  const toAssembly = smooth(0.25, 0.37, progress);
  const toHandoff = smooth(0.58, 0.71, progress);
  const finish = smooth(0.84, 0.95, progress);
  const crossing = Math.max(
    Math.sin(toAssembly * Math.PI) * (toAssembly > 0 && toAssembly < 1 ? 1 : 0),
    Math.sin(toHandoff * Math.PI) * (toHandoff > 0 && toHandoff < 1 ? 1 : 0),
  );
  sheet.group.visible = progress < 0.96;
  sheet.paper.opacity = 1 - finish;
  sheet.edges.forEach((edge) => {
    edge.material.opacity = 1 - finish;
    edge.material.transparent = true;
  });
  const scale = (compact ? 0.74 : 0.9)
    * lerp(1, 0.34, release)
    * lerp(1, 1.72, crossing)
    * lerp(1, 0.72, finish);
  const x = lerp(lerp(ZONE_X.forms, ZONE_X.assembly, toAssembly), ZONE_X.handoff, toHandoff);
  sheet.group.scale.setScalar(scale);
  sheet.group.position.set(
    x,
    lerp(compact ? 2.2 : 1.32, compact ? 0.55 : -0.28, release) + crossing * 1.15,
    lerp(0.45, toHandoff > 0.99 ? 0.6 : 1.25, release) + crossing * 3.1 - finish * 1.2,
  );
  sheet.group.rotation.x = lerp(lerp(-0.18, -1.28, release), -0.38, crossing);
  sheet.group.rotation.y = crossing * (toHandoff > 0 ? -0.5 : 0.5) + finish * 0.18;
  sheet.group.rotation.z = Math.sin(progress * Math.PI * 2) * 0.025 * (1 - finish);
}

function renderReadyForms(state, p1, progress, compact) {
  state.root.visible = progress > 0.035 && progress < 0.47;
  if (!state.root.visible) return;
  const responsive = compact ? 0.59 : 0.82;
  state.root.scale.setScalar(responsive);
  state.root.position.set(ZONE_X.forms, compact ? 2.05 : 1.22, 0);
  const libraryPositions = [
    [-2.55, 1.75, -2.15], [0, 1.75, -2.15], [2.55, 1.75, -2.15],
    [-2.55, -0.15, -2.15], [0, -0.15, -2.15], [2.55, -0.15, -2.15],
    [-2.55, -2.05, -2.15], [0, -2.05, -2.15], [2.55, -2.05, -2.15],
  ];
  const focus = smooth(0.64, 0.96, p1);
  state.forms.forEach((form, index) => {
    const delay = index * 0.032;
    const appear = smooth(0.05 + delay, 0.34 + delay * 0.5, p1);
    const layout = smooth(0.14, 0.53, p1);
    const [x, y, z] = libraryPositions[index];
    const startAngle = (index / READY_FORM_COUNT) * Math.PI * 2 + p1 * 0.7;
    const start = new THREE.Vector3(Math.cos(startAngle) * 0.38, Math.sin(startAngle) * 0.28, 0.25);
    const library = new THREE.Vector3(x, y, z);
    form.position.lerpVectors(start, library, layout);
    if (index === state.selectedIndex) {
      form.position.lerp(new THREE.Vector3(0, 0.1, 1.2), focus);
    } else {
      const outward = new THREE.Vector3(x * 1.24, y * 1.1, z - 2.3);
      form.position.lerp(outward, focus);
    }
    const scale = appear * (index === state.selectedIndex ? lerp(0.76, 1.72, focus) : lerp(0.72, 0.34, focus));
    form.scale.setScalar(Math.max(0.001, scale));
    form.rotation.y = (index - 4) * 0.15 + p1 * (index % 2 ? -0.44 : 0.52);
    form.rotation.z = (1 - appear) * (index % 2 ? -0.22 : 0.22);
    form.visible = appear > 0.001;
  });
}

function renderAssembly(state, p2, progress, compact) {
  state.root.visible = progress > 0.305 && progress < 0.78;
  if (!state.root.visible) return;
  const entry = smooth(0, 0.18, p2);
  const exit = 1 - smooth(0.88, 1, p2);
  state.root.scale.setScalar((compact ? 0.74 : 1.08) * entry * Math.max(0.001, exit));
  state.root.position.set(ZONE_X.assembly, compact ? 1.42 : 0.72, 0.2);
  state.root.rotation.y = lerp(-0.35, 0.45, p2);
  state.body.rotation.y = p2 * 0.36;

  const exploded = [
    new THREE.Vector3(-4.1, 0.9, -0.2),
    new THREE.Vector3(4.2, 0.4, 0.2),
    new THREE.Vector3(-2.5, 3.35, 0.6),
    new THREE.Vector3(2.55, 3.2, -0.4),
  ];
  state.parts.forEach((part, index) => {
    const attach = smooth(0.18 + index * 0.135, 0.43 + index * 0.135, p2);
    const attachPosition = part.userData.attachPosition || ZERO_VECTOR;
    const attachRotation = part.userData.attachRotation || ZERO_EULER;
    part.position.lerpVectors(exploded[index], attachPosition, attach);
    part.rotation.set(
      lerp((index - 1.5) * 0.28, attachRotation.x, attach),
      lerp((index % 2 ? -1 : 1) * 0.7, attachRotation.y, attach),
      lerp((index % 2 ? 1 : -1) * 0.24, attachRotation.z, attach),
    );
    const partScale = lerp(0.72, part.userData.attachScale || 1, attach);
    part.scale.setScalar(partScale);
  });

  const waferFade = 1 - smooth(0.6, 0.86, p2);
  state.waferRoot.visible = waferFade > 0.01;
  state.wafers.forEach((wafer, index) => {
    const phase = wafer.userData.phase;
    const angle = phase * Math.PI * 4 + p2 * Math.PI * 1.7;
    const radius = lerp(4.5, 2.25, smooth(0.06, 0.62, p2));
    const collapse = smooth(0.57 + phase * 0.12, 0.83 + phase * 0.08, p2);
    wafer.position.set(
      Math.cos(angle) * radius * (1 - collapse),
      -0.2 + phase * 4.1 * (1 - collapse) + collapse * (phase % 0.25),
      Math.sin(angle) * radius * 0.62 * (1 - collapse),
    );
    wafer.rotation.set(angle * 0.14, angle, phase * Math.PI);
    const baseScale = wafer.userData.baseScale || 1;
    wafer.scale.setScalar(Math.max(0.001, baseScale * waferFade * lerp(1, 0.08, collapse)));
  });
}

function renderHandoff(state, p3, progress, compact) {
  state.root.visible = progress > 0.625;
  if (!state.root.visible) return;
  state.root.position.set(ZONE_X.handoff, compact ? 1.72 : 0.92, 0);
  state.root.scale.setScalar(compact ? 0.58 : 0.88);
  const sourceExit = smooth(0.18, 0.48, p3);
  state.source.visible = sourceExit < 0.995;
  state.source.position.set(0, 0, lerp(0.8, -1, sourceExit));
  state.source.rotation.y = p3 * 0.85;
  state.source.scale.setScalar(Math.max(0.001, lerp(1.58, 0.04, sourceExit)));

  const targets = [
    new THREE.Vector3(-2.67, 0, 0.15),
    new THREE.Vector3(0, 0, 0.9),
    new THREE.Vector3(2.67, 0, 0.15),
  ];
  state.artifacts.forEach((artifact, index) => {
    const reveal = smooth(0.12 + index * 0.09, 0.36 + index * 0.09, p3);
    artifact.position.lerpVectors(new THREE.Vector3(0, 0.1, 0.7), targets[index], reveal);
    artifact.rotation.y = lerp((index - 1) * 0.62, (index - 1) * -0.08, reveal);
    artifact.rotation.z = lerp((index - 1) * -0.18, 0, reveal);
    artifact.scale.setScalar(Math.max(0.001, reveal));
    artifact.visible = reveal > 0.001;
  });
}

function renderChapterWords(state, progress, compact) {
  const spans = [
    { act: 'forms', start: 0.04, end: 0.405 },
    { act: 'assembly', start: 0.3, end: 0.75 },
    { act: 'handoff', start: 0.63, end: 0.93 },
  ];
  let active = 'none';
  let strongestPresence = 0;

  spans.forEach((span, index) => {
    const word = state.wordsByAct.get(span.act);
    if (!word) return;
    const local = range(progress, span.start, span.end);
    const presence = smooth(span.start, span.start + 0.075, progress)
      * (1 - smooth(span.end - 0.07, span.end, progress));
    word.visible = presence > 0.002;
    if (!word.visible) return;
    if (presence > strongestPresence) {
      strongestPresence = presence;
      active = span.act;
    }

    const enter = smooth(0.02, 0.24, local);
    if (index === 0) {
      const depart = smooth(0.64, 1, local);
      const scale = (compact ? 2.55 : 4.15) * lerp(0.76, 1, enter) * Math.max(0.001, presence);
      word.position.set(
        ZONE_X.forms + lerp(-2.8, 0, enter) + depart * 2.6,
        compact ? 4.45 : 2.92,
        lerp(-7.2, -4.15, enter) + depart * 5.4,
      );
      word.rotation.set(-0.035, lerp(-0.38, 0.08, enter) + depart * 0.24, 0.015);
      word.scale.setScalar(scale);
      return;
    }

    if (index === 1) {
      const depart = smooth(0.68, 1, local);
      const scale = (compact ? 2.05 : 3.5) * lerp(0.72, 1, enter) * Math.max(0.001, presence);
      word.position.set(
        ZONE_X.assembly + lerp(4.8, 0, enter) - depart * 4.2,
        compact ? 4.05 : 2.82,
        -4.35 + depart * 4.1,
      );
      word.rotation.set(0.02, lerp(0.62, -0.06, enter) - depart * 0.26, -0.018);
      word.scale.setScalar(scale);
      return;
    }

    const passage = smooth(0.38, 0.78, local);
    const scale = (compact ? 2.45 : 3.9)
      * lerp(0.78, 1.12, passage)
      * Math.max(0.001, presence);
    word.position.set(
      ZONE_X.handoff + lerp(-1.4, 0, enter),
      lerp(compact ? 1.25 : 0.42, compact ? 3.45 : 2.5, passage),
      lerp(-5.2, compact ? 17.6 : 15.5, passage),
    );
    word.rotation.set(lerp(-0.04, 0, passage), lerp(0.24, 0, enter), 0);
    word.scale.setScalar(scale);
  });

  runtime.wordmarkAct = active;
  sceneElement.dataset.wordmarkAct = active;
}

function renderSet(set, progress, compact) {
  if (set.authored) return;
  set.floor.material.map.offset.x = progress * 0.018;
  set.floor.material.map.offset.y = progress * -0.011;
  set.monoliths.forEach((monolith, index) => {
    monolith.position.x = (index ? 1 : -1) * (compact ? 6.2 : 8.1);
    monolith.rotation.y += ((progress * 0.22 * (index ? 1 : -1)) - monolith.rotation.y) * 0.34;
  });
}

function renderCamera(camera, target, progress, compact) {
  const positions = compact
    ? [
      new THREE.Vector3(-0.3, 4.0, 15.7),
      new THREE.Vector3(0.6, 3.4, 14.25),
      new THREE.Vector3(-0.45, 3.55, 14.5),
      new THREE.Vector3(0, 3.55, 16.8),
    ]
    : [
      new THREE.Vector3(-0.55, 3.25, 13.2),
      new THREE.Vector3(0.8, 2.75, 11.4),
      new THREE.Vector3(-0.65, 2.45, 11.2),
      new THREE.Vector3(0, 2.62, 14.9),
    ];
  const targets = compact
    ? [1.55, 1.45, 1.35, 1.2]
    : [0.95, 0.72, 0.68, 0.35];
  const boundaries = [0, 0.36, 0.69, 1];
  const segment = progress < boundaries[1] ? 0 : progress < boundaries[2] ? 1 : 2;
  const local = range(progress, boundaries[segment], boundaries[segment + 1]);
  const travel = smootherstep(local);
  const arc = Math.pow(Math.sin(local * Math.PI), 2);
  const position = new THREE.Vector3().lerpVectors(positions[segment], positions[segment + 1], travel);
  const arcDirections = compact
    ? [new THREE.Vector3(-0.18, 0.16, -0.32), new THREE.Vector3(0.28, -0.18, -0.52), new THREE.Vector3(0.12, 0.12, -0.25)]
    : [new THREE.Vector3(-0.42, 0.2, -0.46), new THREE.Vector3(0.68, -0.22, -0.78), new THREE.Vector3(0.34, 0.16, -0.38)];
  position.addScaledVector(arcDirections[segment], arc);
  camera.position.copy(position);
  target.set(0, lerp(targets[segment], targets[segment + 1], travel), 0);
  camera.lookAt(target);
  runtime.cameraPosition = {
    x: Number(position.x.toFixed(5)),
    y: Number(position.y.toFixed(5)),
    z: Number(position.z.toFixed(5)),
  };
  runtime.cameraTarget = {
    x: 0,
    y: Number(target.y.toFixed(5)),
    z: 0,
  };
}

function renderAuthoredCamera(set, camera, progress, compact) {
  const { action, sheetAction, mixer, clip, desktop, phone, heroRig, heroMesh } = set.authored;
  action.enabled = true;
  action.paused = false;
  sheetAction.enabled = true;
  sheetAction.paused = false;
  mixer.setTime(progress * clip.duration);
  heroRig.updateWorldMatrix(true, true);
  heroRig.getWorldPosition(SHEET_WORLD_POSITION);
  const proofBone = heroMesh.skeleton?.bones?.[Math.floor((heroMesh.skeleton?.bones?.length || 1) / 2)];
  runtime.sheetPosition = {
    x: Number(SHEET_WORLD_POSITION.x.toFixed(5)),
    y: Number(SHEET_WORLD_POSITION.y.toFixed(5)),
    z: Number(SHEET_WORLD_POSITION.z.toFixed(5)),
  };
  if (proofBone) {
    runtime.sheetBoneQuaternion = {
      x: Number(proofBone.quaternion.x.toFixed(5)),
      y: Number(proofBone.quaternion.y.toFixed(5)),
      z: Number(proofBone.quaternion.z.toFixed(5)),
      w: Number(proofBone.quaternion.w.toFixed(5)),
    };
  }
  const source = compact ? phone : desktop;
  source.updateWorldMatrix(true, false);
  source.matrixWorld.decompose(camera.position, camera.quaternion, CAMERA_WORLD_SCALE);
  camera.fov = sampleAuthoredFov(source, progress * clip.duration, compact ? 43 : 35);
  camera.updateProjectionMatrix();
  source.getWorldDirection(CAMERA_WORLD_DIRECTION);
  const target = camera.position.clone().addScaledVector(CAMERA_WORLD_DIRECTION, 10);
  runtime.cameraPosition = {
    x: Number(camera.position.x.toFixed(5)),
    y: Number(camera.position.y.toFixed(5)),
    z: Number(camera.position.z.toFixed(5)),
  };
  runtime.cameraTarget = {
    x: Number(target.x.toFixed(5)),
    y: Number(target.y.toFixed(5)),
    z: Number(target.z.toFixed(5)),
  };
  runtime.cameraFov = Number(camera.fov.toFixed(3));
}

function sampleAuthoredFov(source, time, fallbackFov) {
  let curve = authoredFovCurves.get(source);
  if (!curve) {
    try {
      const raw = source.userData?.fovCurve;
      curve = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      curve = null;
    }
    if (!Array.isArray(curve) || curve.length < 2) curve = [[0, fallbackFov], [1, fallbackFov]];
    authoredFovCurves.set(source, curve);
  }
  if (time <= curve[0][0]) return curve[0][1];
  for (let index = 1; index < curve.length; index += 1) {
    const right = curve[index];
    if (time > right[0]) continue;
    const left = curve[index - 1];
    return lerp(left[1], right[1], range(time, left[0], right[0]));
  }
  return curve.at(-1)[1];
}

function actForProgress(progress) {
  if (progress < 0.36) return 'forms';
  if (progress < 0.69) return 'assembly';
  return 'handoff';
}

function renderProofPortal(progress) {
  const portalProgress = smooth(0.82, 0.965, progress);
  const apertureProgress = smooth(0.885, 0.985, progress);
  const state = progress >= 0.94 ? 'crossed' : progress >= 0.82 ? 'open' : 'hidden';
  sceneElement.style.setProperty('--portal-p', portalProgress.toFixed(4));
  sceneElement.style.setProperty('--portal-aperture', apertureProgress.toFixed(4));
  sceneElement.dataset.portalState = state;
  runtime.portalState = state;
  runtime.portalCrossed = progress >= 0.94;
  runtime.uiReveal = Number(apertureProgress.toFixed(4));
  if (proofPortal) {
    proofPortal.setAttribute('aria-hidden', state === 'hidden' ? 'true' : 'false');
    proofPortal.inert = state !== 'crossed';
  }
}

function wireCakeStudioLiveUi(root) {
  const input = root.querySelector('[data-proof-input]');
  const copyButton = root.querySelector('[data-proof-copy]');
  const verifyButton = root.querySelector('[data-proof-verify]');
  const message = root.querySelector('[data-ui-message]');
  const progress = root.querySelector('[role="progressbar"]');
  const progressValue = root.querySelector('.proof-portal-progress-value');
  const stageLabel = root.querySelector('[data-workflow-stage-label]');
  const revisionStatusLabel = root.querySelector('[data-revision-status-label]');
  const actionButtons = [...root.querySelectorAll('.proof-workflow-actions button')];
  if (!input || !copyButton || !verifyButton || !message) return;

  const setMessage = (en, ar, state = 'ready') => {
    const english = message.querySelector('.en');
    const arabic = message.querySelector('.ar');
    if (english) english.textContent = en;
    if (arabic) arabic.textContent = ar;
    message.dataset.state = state;
  };

  const setLocalizedText = (element, en, ar) => {
    const english = element?.querySelector('.en');
    const arabic = element?.querySelector('.ar');
    if (english) english.textContent = en;
    if (arabic) arabic.textContent = ar;
  };

  const setWorkflowState = ({ stage, stageEn, stageAr, revision, revisionEn, revisionAr, percent, status }) => {
    root.dataset.workflowStage = stage;
    root.dataset.revisionStatus = revision;
    setLocalizedText(stageLabel, stageEn, stageAr);
    setLocalizedText(revisionStatusLabel, revisionEn, revisionAr);
    if (progress) {
      progress.setAttribute('aria-valuenow', String(percent));
      progress.setAttribute('aria-valuetext', `${percent}% · ${stageEn}`);
      const bar = progress.querySelector('i');
      if (bar) bar.style.width = `${percent}%`;
    }
    if (progressValue) progressValue.textContent = `${percent}%`;
    runtime.uiStatus = status;
  };

  input.addEventListener('input', () => {
    const letters = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
    input.value = letters.length > 3 ? `${letters.slice(0, 3)}-${letters.slice(3)}` : letters;
    input.setAttribute('aria-invalid', 'false');
  });

  copyButton.addEventListener('click', async () => {
    const english = 'Please review Cake Studio order CS-2048, revision 3. Return code FXD-GDE to approve this exact revision. Any edit invalidates the code.';
    const arabic = 'يرجى مراجعة طلب Cake Studio رقم CS-2048، المراجعة ٣. أرسل الرمز FXD-GDE لاعتماد هذه النسخة تحديدًا. أي تعديل يُبطل الرمز.';
    try {
      await navigator.clipboard.writeText(document.body.classList.contains('lang-ar') ? arabic : english);
      setMessage('Customer message copied.', 'تم نسخ رسالة العميل.', 'copied');
    } catch {
      setMessage('Copy is unavailable; the proof code remains visible.', 'النسخ غير متاح؛ يظل رمز المعاينة ظاهرًا.', 'error');
    }
  });

  verifyButton.addEventListener('click', () => {
    if (input.value !== 'FXD-GDE') {
      input.setAttribute('aria-invalid', 'true');
      setMessage('Code does not match revision 3.', 'الرمز لا يطابق المراجعة ٣.', 'error');
      return;
    }
    input.setAttribute('aria-invalid', 'false');
    actionButtons.forEach((button) => { button.disabled = false; });
    runtime.uiStatus = 'proof-verified';
    root.dataset.proofStatus = 'verified';
    setMessage('Revision 3 verified. Approval actions unlocked.', 'تم التحقق من المراجعة ٣. فُتحت إجراءات الاعتماد.', 'verified');
  });

  actionButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      if (index === 0) {
        setWorkflowState({
          stage: 'approved-locked',
          stageEn: 'Approved & locked',
          stageAr: 'معتمد ومقفول',
          revision: 'approved',
          revisionEn: 'APPROVED',
          revisionAr: 'معتمد',
          percent: 44,
          status: 'approval-recorded',
        });
        root.dataset.proofStatus = 'approved';
        setMessage('Customer approval recorded. Revision 3 is locked.', 'تم تسجيل اعتماد العميل. المراجعة ٣ مقفلة.', 'verified');
      } else {
        setWorkflowState({
          stage: 'changes-requested',
          stageEn: 'Changes requested',
          stageAr: 'تعديلات مطلوبة',
          revision: 'changes-requested',
          revisionEn: 'CHANGES REQUESTED',
          revisionAr: 'تعديلات مطلوبة',
          percent: 38,
          status: 'changes-requested',
        });
        root.dataset.proofStatus = 'changes-requested';
        setMessage('Changes requested against revision 3. A new mockup is required.', 'طُلبت تعديلات على المراجعة ٣. يلزم نموذج جديد.', 'copied');
      }
      actionButtons.forEach((actionButton) => { actionButton.disabled = true; });
      input.disabled = true;
      verifyButton.disabled = true;
    });
  });
}

function renderCaptions(progress) {
  const spans = [
    { element: actElements[0], start: 0.045, end: 0.37 },
    { element: actElements[1], start: 0.36, end: 0.70 },
    { element: actElements[2], start: 0.69, end: 1.02 },
  ];
  let active = 'forms';
  let best = -1;
  spans.forEach(({ element, start, end }) => {
    if (!element) return;
    const presence = smooth(start, start + 0.055, progress) * (1 - smooth(end - 0.055, end, progress));
    element.style.setProperty('--presence', presence.toFixed(4));
    element.dataset.visible = presence > 0.002 ? 'true' : 'false';
    if (presence > best) {
      best = presence;
      active = element.dataset.objectAct;
    }
  });
  active = actForProgress(progress);
  runtime.act = active;
  sceneElement.dataset.act = active;
}

function measureProjectedBounds(object, camera, width, height) {
  if (!object?.visible || width < 1 || height < 1) return { visible: false, coverage: 0 };
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return { visible: false, coverage: 0 };
  const projected = [];
  let visibleCorners = 0;
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) {
        const point = new THREE.Vector3(x, y, z).project(camera);
        projected.push({ x: (point.x * 0.5 + 0.5) * width, y: (-point.y * 0.5 + 0.5) * height });
        if (point.z >= -1 && point.z <= 1 && Math.abs(point.x) <= 1.2 && Math.abs(point.y) <= 1.2) visibleCorners += 1;
      }
    }
  }
  const left = Math.min(...projected.map((point) => point.x));
  const right = Math.max(...projected.map((point) => point.x));
  const top = Math.min(...projected.map((point) => point.y));
  const bottom = Math.max(...projected.map((point) => point.y));
  const clippedWidth = Math.max(0, Math.min(width, right) - Math.max(0, left));
  const clippedHeight = Math.max(0, Math.min(height, bottom) - Math.max(0, top));
  return {
    visible: visibleCorners > 0 && clippedWidth > 1 && clippedHeight > 1,
    visibleCorners,
    left: Number(left.toFixed(2)),
    right: Number(right.toFixed(2)),
    top: Number(top.toFixed(2)),
    bottom: Number(bottom.toFixed(2)),
    coverage: Number(((clippedWidth * clippedHeight) / (width * height)).toFixed(5)),
  };
}

function probeRenderedFrame(renderer, scene, camera) {
  const size = 96;
  const target = new THREE.WebGLRenderTarget(size, size, { depthBuffer: true, stencilBuffer: false });
  const previousTarget = renderer.getRenderTarget();
  const pixels = new Uint8Array(size * size * 4);
  try {
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(target, 0, 0, size, size, pixels);
  } finally {
    renderer.setRenderTarget(previousTarget);
    target.dispose();
    if (!previousTarget) renderer.render(scene, camera);
  }
  let nonDark = 0;
  let minimum = 255;
  let maximum = 0;
  let total = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const light = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    if (pixels[index + 3] > 4 && light > 12) nonDark += 1;
    minimum = Math.min(minimum, light);
    maximum = Math.max(maximum, light);
    total += light;
  }
  return {
    samples: size * size,
    nonDark,
    luminanceRange: Number((maximum - minimum).toFixed(2)),
    meanLuminance: Number((total / (size * size)).toFixed(2)),
  };
}

function showFallback(error) {
  runtime.webglAvailable = false;
  runtime.ready = false;
  runtime.reason = error?.message || 'webgl-unavailable';
  sceneElement.dataset.webgl = 'fallback';
  sceneElement.classList.add('no-webgl');
  canvas.hidden = true;
  if (fallback) fallback.hidden = false;
  renderCaptions(clamp(Number.parseFloat(sceneElement.style.getPropertyValue('--p') || '0')));
}

function cakeGeometry(kind, radius, height) {
  if (kind === 'square') {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 4, 4);
    geometry.rotateY(Math.PI / 4);
    return geometry;
  }
  if (kind === 'hex') return new THREE.CylinderGeometry(radius, radius, height, 6, 4);
  if (kind === 'rect') return new THREE.BoxGeometry(radius * 2.25, height, radius * 1.45, 3, 3, 3);
  if (kind === 'heart') {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.88);
    shape.bezierCurveTo(-1.04, -0.2, -1.05, 0.75, -0.48, 0.83);
    shape.bezierCurveTo(-0.17, 0.88, 0, 0.63, 0, 0.45);
    shape.bezierCurveTo(0, 0.63, 0.17, 0.88, 0.48, 0.83);
    shape.bezierCurveTo(1.05, 0.75, 1.04, -0.2, 0, -0.88);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2, steps: 1 });
    geometry.center();
    geometry.rotateX(-Math.PI / 2);
    geometry.scale(radius, 1, radius);
    return geometry;
  }
  const segments = kind === 'scallop' ? 16 : 64;
  const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 5);
  if (kind === 'oval') geometry.scale(1.26, 1, 0.78);
  if (kind === 'scallop') {
    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = positions.getZ(index);
      const radial = Math.hypot(x, z);
      if (radial < radius * 0.72) continue;
      const angle = Math.atan2(z, x);
      const offset = 1 + Math.sin(angle * 8) * 0.055;
      positions.setX(index, x * offset);
      positions.setZ(index, z * offset);
    }
    geometry.computeVertexNormals();
  }
  return geometry;
}

function makeEllipseGeometry(rx, ry, depth) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.025,
    bevelSegments: 2,
    curveSegments: 48,
  });
  geometry.center();
  return geometry;
}

function buttercreamMaterial(color, roughness = 0.52) {
  return new THREE.MeshPhysicalMaterial({
    color,
    map: makeButtercreamTexture(color),
    roughness,
    metalness: 0,
    clearcoat: 0.14,
    clearcoatRoughness: 0.52,
    sheen: 0.42,
    sheenColor: new THREE.Color(0xffe8d0),
    envMapIntensity: 1.05,
  });
}

function roseGoldMaterial(roughness = 0.25) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xc98872,
    roughness,
    metalness: 0.76,
    clearcoat: 0.58,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.35,
  });
}

function fruitMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.25,
    clearcoat: 0.95,
    clearcoatRoughness: 0.06,
    transmission: 0.08,
    thickness: 0.3,
  });
}

function glassMaterial(color, opacity) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.1,
    metalness: 0.08,
    transmission: 0.45,
    thickness: 0.16,
    transparent: true,
    opacity,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
  });
}

function darkStoneMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x08120f,
    roughness: 0.32,
    metalness: 0.16,
    clearcoat: 0.5,
    clearcoatRoughness: 0.21,
  });
}

function makeButtercreamTexture(color) {
  const key = `butter-${color}`;
  if (textureCache.has(key)) return textureCache.get(key);
  const texture = canvasTexture(192, 192, (context, width, height) => {
    const base = new THREE.Color(color);
    context.fillStyle = `#${base.getHexString()}`;
    context.fillRect(0, 0, width, height);
    const random = seeded(color ^ 0x9e3779b9);
    for (let index = 0; index < 170; index += 1) {
      const alpha = 0.018 + random() * 0.026;
      context.strokeStyle = `rgba(255,248,230,${alpha})`;
      context.lineWidth = 0.5 + random() * 1.3;
      const y = random() * height;
      context.beginPath();
      context.moveTo(0, y);
      context.bezierCurveTo(width * 0.3, y + random() * 3, width * 0.7, y - random() * 3, width, y + random() * 2);
      context.stroke();
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 1.1);
  textureCache.set(key, texture);
  return texture;
}

function makePaperTexture() {
  const key = 'paper';
  if (textureCache.has(key)) return textureCache.get(key);
  const texture = canvasTexture(256, 256, (context, width, height) => {
    context.fillStyle = '#ead8bc';
    context.fillRect(0, 0, width, height);
    const random = seeded(0x5ee7f11e);
    for (let index = 0; index < 540; index += 1) {
      const y = random() * height;
      context.strokeStyle = `rgba(${random() > 0.5 ? '255,246,225' : '123,89,69'},${0.025 + random() * 0.045})`;
      context.lineWidth = 0.4 + random() * 0.9;
      context.beginPath();
      context.moveTo(random() * width * 0.18, y);
      context.lineTo(width * (0.76 + random() * 0.24), y + (random() - 0.5) * 2.2);
      context.stroke();
    }
  });
  textureCache.set(key, texture);
  return texture;
}

function makeEdibleImageTexture() {
  const key = 'edible-image';
  if (textureCache.has(key)) return textureCache.get(key);
  const texture = canvasTexture(384, 192, (context, width, height) => {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#143e36');
    gradient.addColorStop(0.47, '#d89f86');
    gradient.addColorStop(1, '#eadabd');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 0.22;
    for (let index = -height; index < width + height; index += 34) {
      context.fillStyle = index % 68 ? '#fff3dd' : '#0a2b25';
      context.fillRect(index, 0, 10, height * 2);
      context.setTransform(1, 0, -0.45, 1, 0, 0);
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
  });
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(key, texture);
  return texture;
}

function makeMarbleTexture() {
  const key = 'black-marble';
  if (textureCache.has(key)) return textureCache.get(key);
  const texture = canvasTexture(512, 512, (context, width, height) => {
    context.fillStyle = '#07100e';
    context.fillRect(0, 0, width, height);
    const random = seeded(0xc45e51ab);
    for (let vein = 0; vein < 12; vein += 1) {
      let y = random() * height;
      context.beginPath();
      context.moveTo(-20, y);
      for (let x = 0; x <= width + 20; x += 28) {
        y += (random() - 0.5) * 19;
        context.lineTo(x, y);
      }
      context.strokeStyle = vein % 3 ? 'rgba(54,92,80,.17)' : 'rgba(205,142,116,.16)';
      context.lineWidth = 0.6 + random() * 1.6;
      context.stroke();
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.8, 2.1);
  textureCache.set(key, texture);
  return texture;
}

function canvasTexture(width, height, paint) {
  const surface = document.createElement('canvas');
  surface.width = width;
  surface.height = height;
  paint(surface.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function seeded(seed) {
  let value = seed >>> 0 || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

function clamp(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function range(value, start, end) {
  return clamp((value - start) / (end - start));
}

function smooth(start, end, value) {
  const t = range(value, start, end);
  return t * t * (3 - 2 * t);
}

function smootherstep(value) {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(from, to, value) {
  return from + (to - from) * value;
}
