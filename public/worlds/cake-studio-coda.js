import * as THREE from './cake-studio/three.module.js';

const READY_FORM_COUNT = 9;
const CONTROLLED_PART_COUNT = 4;
const OUTPUT_COUNT = 3;
const textureCache = new Map();

const sceneElement = document.querySelector('[data-object-coda]');
const canvas = sceneElement?.querySelector('[data-cake-canvas]');
const fallback = sceneElement?.querySelector('[data-coda-fallback]');
const actElements = sceneElement ? [...sceneElement.querySelectorAll('[data-object-act]')] : [];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const runtime = {
  version: '1.2.0',
  engine: `three-r${THREE.REVISION}`,
  webglAvailable: false,
  ready: false,
  progress: 0,
  act: 'forms',
  readyForms: READY_FORM_COUNT,
  controlledParts: CONTROLLED_PART_COUNT,
  outputs: OUTPUT_COUNT,
  renders: 0,
  drawCalls: 0,
  triangles: 0,
  pixelRatio: 0,
  reducedMotion,
};
window.__cakeStudioCoda = runtime;

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
      preserveDrawingBuffer: true,
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

  const set = createPhysicalSet(scene);
  const sheet = createOpticalSheet(scene);
  const readyForms = createReadyForms(scene);
  const assembly = createControlledAssembly(scene);
  const handoff = createProductionOutputs(scene);

  let frame = 0;
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

  function renderCoda(progress) {
    const compact = camera.aspect < 0.72;
    const p1 = range(progress, 0.025, 0.39);
    const p2 = range(progress, 0.31, 0.72);
    const p3 = range(progress, 0.64, 1);

    renderSheet(sheet, progress, p1, compact);
    renderReadyForms(readyForms, p1, progress, compact);
    renderAssembly(assembly, p2, progress, compact);
    renderHandoff(handoff, p3, progress, compact);
    renderSet(set, progress, compact);
    renderCamera(camera, cameraTarget, p1, p2, p3, progress, compact);
    renderCaptions(progress);

    renderer.render(scene, camera);
    runtime.progress = Number(progress.toFixed(5));
    runtime.renders += 1;
    runtime.drawCalls = renderer.info.render.calls;
    runtime.triangles = renderer.info.render.triangles;
    sceneElement.dataset.renderCount = String(runtime.renders);
  }

  const draw = () => {
    frame = 0;
    resize();
    renderCoda(readProgress());
  };
  const scheduleRender = () => {
    const bounds = sceneElement.getBoundingClientRect();
    if (bounds.top > innerHeight * 1.5 || bounds.bottom < -innerHeight * 0.5) return;
    if (!frame) frame = requestAnimationFrame(draw);
  };

  addEventListener('scroll', scheduleRender, { passive: true });
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
    renderer.dispose();
  }, { once: true });

  resize();
  renderCoda(readProgress());
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
  return { root, forms, selectedIndex: 5 };
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
  return { root, body, parts, wafers, waferRoot };
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
  return { root, source, artifacts };
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
  const vanish = smooth(0.23, 0.56, p1);
  sheet.group.visible = progress < 0.25;
  sheet.paper.opacity = 1 - vanish;
  sheet.edges.forEach((edge) => {
    edge.material.opacity = 1 - vanish;
    edge.material.transparent = true;
  });
  const scale = (compact ? 0.67 : 0.86) * lerp(1, 0.72, vanish);
  sheet.group.scale.setScalar(scale);
  sheet.group.position.set(0, compact ? 2.15 : 1.28, lerp(0.45, -0.6, p1));
  sheet.group.rotation.x = lerp(-0.18, -1.2, smooth(0.08, 0.58, p1));
  sheet.group.rotation.y = lerp(0, 0.34, smooth(0.2, 0.65, p1));
}

function renderReadyForms(state, p1, progress, compact) {
  state.root.visible = progress > 0.035 && progress < 0.47;
  if (!state.root.visible) return;
  const responsive = compact ? 0.59 : 0.82;
  state.root.scale.setScalar(responsive);
  state.root.position.y = compact ? 2.05 : 1.22;
  const libraryPositions = [
    [-3.8, 1.7, -1.7], [0, 2.0, -2.4], [3.8, 1.7, -1.7],
    [-4.2, 0.18, -0.6], [0, 0.35, -0.1], [4.2, 0.18, -0.6],
    [-3.5, -1.1, -1.4], [0, -1.05, -1.9], [3.5, -1.1, -1.4],
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
  state.root.position.set(0, compact ? 1.42 : 0.72, 0.2);
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
    part.position.lerpVectors(exploded[index], new THREE.Vector3(), attach);
    part.rotation.set(
      lerp((index - 1.5) * 0.28, 0, attach),
      lerp((index % 2 ? -1 : 1) * 0.7, 0, attach),
      lerp((index % 2 ? 1 : -1) * 0.24, 0, attach),
    );
    const partScale = lerp(0.72, 1, attach);
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
    wafer.scale.setScalar(Math.max(0.001, waferFade * lerp(1, 0.08, collapse)));
  });
}

function renderHandoff(state, p3, progress, compact) {
  state.root.visible = progress > 0.625;
  if (!state.root.visible) return;
  state.root.position.y = compact ? 1.72 : 0.92;
  state.root.scale.setScalar(compact ? 0.58 : 0.88);
  const sourceExit = smooth(0.18, 0.48, p3);
  state.source.visible = sourceExit < 0.995;
  state.source.position.set(0, 0, lerp(0.8, -1, sourceExit));
  state.source.rotation.y = p3 * 0.85;
  state.source.scale.setScalar(Math.max(0.001, lerp(1.58, 0.04, sourceExit)));

  const targets = [
    new THREE.Vector3(-4.2, 0, 0.15),
    new THREE.Vector3(0, 0, 0.9),
    new THREE.Vector3(4.2, 0, 0.15),
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

function renderSet(set, progress, compact) {
  set.floor.material.map.offset.x = progress * 0.018;
  set.floor.material.map.offset.y = progress * -0.011;
  set.monoliths.forEach((monolith, index) => {
    monolith.position.x = (index ? 1 : -1) * (compact ? 6.2 : 8.1);
    monolith.rotation.y += ((progress * 0.22 * (index ? 1 : -1)) - monolith.rotation.y) * 0.34;
  });
}

function renderCamera(camera, target, p1, p2, p3, progress, compact) {
  let position;
  let lookY;
  if (progress < 0.36) {
    position = new THREE.Vector3(
      lerp(0, 0.78, p1),
      compact ? lerp(3.6, 3.25, p1) : lerp(3.15, 2.75, p1),
      (compact ? 15.8 : 13.1) - p1 * (compact ? 1.3 : 1.7),
    );
    lookY = compact ? 1.55 : 0.9;
  } else if (progress < 0.69) {
    position = new THREE.Vector3(
      lerp(-1.1, 1.25, p2),
      compact ? 3.45 : 2.45,
      (compact ? 14.4 : 11.6) - Math.sin(p2 * Math.PI) * 1.05,
    );
    lookY = compact ? 1.5 : 0.72;
  } else {
    position = new THREE.Vector3(
      lerp(1.1, 0, p3),
      compact ? 3.55 : 2.62,
      lerp(compact ? 14.8 : 12.2, compact ? 16.8 : 14.9, p3),
    );
    lookY = compact ? 1.2 : 0.35;
  }
  if (reducedMotion) position.x *= 0.25;
  camera.position.copy(position);
  target.set(0, lookY, 0);
  camera.lookAt(target);
}

function renderCaptions(progress) {
  const spans = [
    { element: actElements[0], start: 0.045, end: 0.41 },
    { element: actElements[1], start: 0.33, end: 0.73 },
    { element: actElements[2], start: 0.65, end: 1.02 },
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
  runtime.act = active;
  sceneElement.dataset.act = active;
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

function lerp(from, to, value) {
  return from + (to - from) * value;
}
