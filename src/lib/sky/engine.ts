/* =====================================================================
   ONE SKY — the home page's single WebGL scene.

   One fixed canvas sits behind the whole home. Scroll moves a camera along a
   route that threads every featured system: outside the galaxy (hero), a dive
   through the arms (beats), one arrival per featured project (stations), a
   pull-back over the whole disc where every project is a star (sky map), and
   a final approach into the core (contact).

   The DOM owns every word. This file only reads where the stops are
   ([data-sky-stop]) and draws. It is dynamic-imported by boot.ts after the
   first paint and only on a device that passed the capability gate.
   ===================================================================== */
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  type Blending,
} from 'three';
import {
  atmoFrag,
  atmoVert,
  glowFrag,
  glowVert,
  mapFrag,
  mapVert,
  nebulaFrag,
  nebulaVert,
  planetFrag,
  planetVert,
  routeFrag,
  routeVert,
  starFrag,
  starVert,
} from './shaders';
import { skyPalette, type SkyPalette } from './palette';

export type StarGroup = 'public' | 'automation' | 'lab' | 'foundation';

export interface SkyData {
  stations: { id: string; a: string; b: string }[];
  stars: { slug: string; group: StarGroup; a: string; title: string; href: string }[];
}

export interface SkyOptions {
  tier: 'high' | 'low';
  rtl: boolean;
  tag: HTMLElement | null;
}

export interface SkyEngine {
  dispose(): void;
  relayout(): void;
  highlight(slug: string | null): void;
  filter(group: StarGroup | 'all'): void;
  pick(clientX: number, clientY: number): { slug: string; href: string } | null;
  retheme(): void;
}

type StopKind = 'hero' | 'beats' | 'station' | 'map' | 'contact';
interface Stop {
  kind: StopKind;
  id: string;
  y0: number;
  y1: number;
  pos: Vector3;
  look: Vector3;
  ox: number;
  oy: number;
}

/* ------------------------------------------------------------ utilities -- */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(r(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * r());
}

const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/* --------------------------------------------------------------- engine -- */

export async function mountSky(canvas: HTMLCanvasElement, data: SkyData, opts: SkyOptions): Promise<SkyEngine> {
  const high = opts.tier === 'high';
  const OCT = high ? 5 : 4;
  let pal: SkyPalette = skyPalette();

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: window.devicePixelRatio < 1.5,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  const dprCap = high ? 1.75 : 1.3;
  let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(high ? 42 : 52, 1, 0.1, 4000);
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const common = { uTime: { value: 0 }, uPixel: { value: dpr }, uLight: { value: pal.light ? 1 : 0 } };
  const blend = (): Blending => (pal.light ? NormalBlending : AdditiveBlending);
  const blended: ShaderMaterial[] = [];
  const shader = (m: ConstructorParameters<typeof ShaderMaterial>[0], additive = true) => {
    const mat = track(new ShaderMaterial({ transparent: true, depthWrite: false, ...m }));
    if (additive) {
      mat.blending = blend();
      blended.push(mat);
    }
    return mat;
  };

  /* ---- galaxy disc ---- */
  const R = 120;
  const starCount = high ? 64000 : 22000;
  const gRand = rng(7);
  const gPos = new Float32Array(starCount * 3);
  const gSize = new Float32Array(starCount);
  const gSeed = new Float32Array(starCount);
  const gArm = new Uint8Array(starCount);
  const gMix = new Float32Array(starCount);
  const ARMS = 4;
  for (let i = 0; i < starCount; i++) {
    const rr = Math.min(R, (-Math.log(1 - gRand() * 0.985) * R) / 3.1);
    const arm = Math.floor(gRand() * ARMS);
    const ang = (arm / ARMS) * Math.PI * 2 + rr * 0.042 + gauss(gRand) * (0.2 + (rr / R) * 0.22);
    const thick = 4.2 * Math.exp(-rr / 22) + 0.9;
    const scatter = 1.4 + (rr / R) * 2.6;
    gPos[i * 3] = Math.cos(ang) * rr + gauss(gRand) * scatter;
    gPos[i * 3 + 1] = gauss(gRand) * thick;
    gPos[i * 3 + 2] = Math.sin(ang) * rr + gauss(gRand) * scatter;
    const bright = gRand();
    gSize[i] = 0.55 + Math.pow(bright, 7) * 4.2;
    gSeed[i] = gRand();
    gArm[i] = arm;
    gMix[i] = clamp01(rr / 48) * (0.75 + gRand() * 0.25);
  }
  const galaxyGeo = track(new BufferGeometry());
  galaxyGeo.setAttribute('position', new BufferAttribute(gPos, 3));
  galaxyGeo.setAttribute('aSize', new BufferAttribute(gSize, 1));
  galaxyGeo.setAttribute('aSeed', new BufferAttribute(gSeed, 1));
  const gColor = new BufferAttribute(new Float32Array(starCount * 3), 3);
  galaxyGeo.setAttribute('aColor', gColor);
  const paintGalaxy = () => {
    const c = new Color();
    const core = new Color(pal.core);
    const arms = pal.arms.map((h) => new Color(h));
    const hot = new Color('#cfe3ff');
    const r = rng(11);
    for (let i = 0; i < starCount; i++) {
      c.copy(core).lerp(arms[gArm[i] % arms.length], gMix[i]);
      if (r() < 0.035) c.lerp(hot, 0.7);
      const k = 0.55 + r() * 0.45;
      gColor.setXYZ(i, c.r * k, c.g * k, c.b * k);
    }
    gColor.needsUpdate = true;
  };
  paintGalaxy();
  const galaxyMat = shader({
    vertexShader: starVert,
    fragmentShader: starFrag,
    uniforms: { ...common, uScale: { value: high ? 260 : 300 } },
  });
  const galaxy = new Points(galaxyGeo, galaxyMat);
  galaxy.frustumCulled = false;
  scene.add(galaxy);

  /* ---- far sky shell ---- */
  const farCount = high ? 5000 : 2400;
  const fRand = rng(23);
  const fPos = new Float32Array(farCount * 3);
  const fSize = new Float32Array(farCount);
  const fSeed = new Float32Array(farCount);
  const fCol = new Float32Array(farCount * 3);
  for (let i = 0; i < farCount; i++) {
    const u = fRand() * 2 - 1;
    const th = fRand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const d = 1300 + fRand() * 500;
    fPos[i * 3] = s * Math.cos(th) * d;
    fPos[i * 3 + 1] = u * d;
    fPos[i * 3 + 2] = s * Math.sin(th) * d;
    fSize[i] = 3 + Math.pow(fRand(), 8) * 10;
    fSeed[i] = fRand();
    const w = 0.6 + fRand() * 0.4;
    fCol[i * 3] = w;
    fCol[i * 3 + 1] = w * (0.9 + fRand() * 0.1);
    fCol[i * 3 + 2] = w;
  }
  const farGeo = track(new BufferGeometry());
  farGeo.setAttribute('position', new BufferAttribute(fPos, 3));
  farGeo.setAttribute('aSize', new BufferAttribute(fSize, 1));
  farGeo.setAttribute('aSeed', new BufferAttribute(fSeed, 1));
  farGeo.setAttribute('aColor', new BufferAttribute(fCol, 3));
  const far = new Points(
    farGeo,
    shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...common, uScale: { value: 420 } } }),
  );
  far.frustumCulled = false;
  scene.add(far);

  /* ---- nebula sheets ---- */
  const nebulaCount = high ? 7 : 3;
  const nRand = rng(31);
  const nebulaGeo = track(new PlaneGeometry(1, 1));
  const nebulae: ShaderMaterial[] = [];
  for (let k = 0; k < nebulaCount; k++) {
    const mat = shader({
      vertexShader: nebulaVert,
      fragmentShader: nebulaFrag(high ? 4 : 3),
      side: 2,
      uniforms: {
        ...common,
        uSeed: { value: k * 7.13 },
        uOpacity: { value: 0.3 + nRand() * 0.18 },
        uColA: { value: new Color() },
        uColB: { value: new Color() },
      },
    });
    nebulae.push(mat);
    const m = new Mesh(nebulaGeo, mat);
    const ang = (k / nebulaCount) * Math.PI * 2 + 0.5;
    const r = 26 + (k % 3) * 24;
    m.position.set(Math.cos(ang) * r, -3 + (k % 2) * 4, Math.sin(ang) * r);
    m.rotation.set(-Math.PI / 2 + (nRand() - 0.5) * 0.45, 0, nRand() * Math.PI);
    const s = 80 + nRand() * 50;
    m.scale.set(s, s * (0.55 + nRand() * 0.4), 1);
    m.renderOrder = -1;
    scene.add(m);
  }
  const paintNebulae = () => {
    nebulae.forEach((mat, k) => {
      (mat.uniforms.uColA.value as Color).set(pal.arms[k % pal.arms.length]);
      (mat.uniforms.uColB.value as Color).set(pal.arms[(k + 1) % pal.arms.length]);
    });
  };
  paintNebulae();

  /* ---- core glow ---- */
  const quad = track(new PlaneGeometry(1, 1));
  const glow = (color: string, opacity: number, size: number) => {
    const mat = shader({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: { ...common, uColor: { value: new Color(color) }, uOpacity: { value: opacity } },
    });
    const m = new Mesh(quad, mat);
    m.scale.set(size, size, 1);
    m.frustumCulled = false;
    return m;
  };
  const coreOuter = glow(pal.core, 0.38, 150);
  const coreInner = glow('#ffffff', 0.5, 26);
  scene.add(coreOuter, coreInner);

  /* ---- featured systems ---- */
  const N = data.stations.length;
  const planetGeo = track(new SphereGeometry(1, high ? 96 : 48, high ? 64 : 32));
  const atmoGeo = track(new SphereGeometry(1, high ? 64 : 32, high ? 40 : 20));
  const moonGeo = track(new SphereGeometry(1, 32, 20));
  interface Sys {
    group: Group;
    planet: Mesh;
    moons: { mesh: Mesh; r: number; speed: number; phase: number; tilt: number }[];
    ring: Points | null;
    pos: Vector3;
    radius: number;
    spin: number;
  }
  const systems: Sys[] = data.stations.map((st, i) => {
    const t = N > 1 ? i / (N - 1) : 0;
    const ang = 0.55 + i * 0.84;
    const orbit = 100 - t * 56;
    const pos = new Vector3(Math.cos(ang) * orbit, Math.sin(i * 1.7) * 6, Math.sin(ang) * orbit);
    const radius = [4.6, 5.6, 4.0, 5.0][i % 4];
    const kind = i % 4;
    const group = new Group();
    group.position.copy(pos);
    // Key light from the arrival side (three-quarter), so the face the camera
    // sees is lit rather than a black disc against the galaxy.
    const outDir = new Vector3(pos.x, 0, pos.z).normalize();
    const side = new Vector3(-outDir.z, 0, outDir.x).multiplyScalar(i % 2 ? 1 : -1);
    const keyLight = pos.clone().add(outDir.clone().multiplyScalar(0.55).add(side.multiplyScalar(1.1)).add(new Vector3(0, 0.7, 0)).normalize().multiplyScalar(600));
    const planetMat = track(
      new ShaderMaterial({
        vertexShader: planetVert,
        fragmentShader: planetFrag(OCT),
        uniforms: {
          uTime: common.uTime,
          uA: { value: new Color(st.a) },
          uB: { value: new Color(st.b) },
          uLightPos: { value: keyLight },
          uRadius: { value: radius },
          uSeed: { value: i * 3.7 + 1.3 },
          uKind: { value: kind },
        },
      }),
    );
    const planet = new Mesh(planetGeo, planetMat);
    planet.scale.setScalar(radius);
    planet.rotation.z = 0.25 + (i % 3) * 0.12;
    group.add(planet);

    const atmo = new Mesh(
      atmoGeo,
      track(
        new ShaderMaterial({
          vertexShader: atmoVert,
          fragmentShader: atmoFrag,
          side: BackSide,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
          uniforms: { uColor: { value: new Color(st.b) }, uLightPos: { value: keyLight } },
        }),
      ),
    );
    atmo.scale.setScalar(radius * 1.16);
    group.add(atmo);

    const halo = glow(st.b, 0.3, radius * 10);
    group.add(halo);

    let ring: Points | null = null;
    if (kind === 1 || kind === 2) {
      const rc = high ? 2600 : 1100;
      const rr = rng(100 + i);
      const rp = new Float32Array(rc * 3);
      const rs = new Float32Array(rc);
      const rsd = new Float32Array(rc);
      const rcol = new Float32Array(rc * 3);
      const ca = new Color(st.a);
      const cb = new Color(st.b);
      const c = new Color();
      for (let k = 0; k < rc; k++) {
        const a = rr() * Math.PI * 2;
        const band = rr();
        const d = radius * (1.55 + band * 0.95);
        rp[k * 3] = Math.cos(a) * d;
        rp[k * 3 + 1] = gauss(rr) * 0.05 * radius;
        rp[k * 3 + 2] = Math.sin(a) * d;
        rs[k] = 0.5 + rr() * 0.9;
        rsd[k] = rr();
        c.copy(ca).lerp(cb, band);
        rcol[k * 3] = c.r;
        rcol[k * 3 + 1] = c.g;
        rcol[k * 3 + 2] = c.b;
      }
      const rg = track(new BufferGeometry());
      rg.setAttribute('position', new BufferAttribute(rp, 3));
      rg.setAttribute('aSize', new BufferAttribute(rs, 1));
      rg.setAttribute('aSeed', new BufferAttribute(rsd, 1));
      rg.setAttribute('aColor', new BufferAttribute(rcol, 3));
      ring = new Points(
        rg,
        shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...common, uScale: { value: 140 } } }),
      );
      ring.rotation.set(0.42 - (i % 2) * 0.2, 0, 0.3);
      ring.frustumCulled = false;
      group.add(ring);
    }

    const moons: Sys['moons'] = [];
    const moonCount = kind === 0 ? 2 : kind === 3 ? 1 : 0;
    for (let k = 0; k < moonCount; k++) {
      const moonMat = track(
        new ShaderMaterial({
          vertexShader: planetVert,
          fragmentShader: planetFrag(3),
          uniforms: {
            uTime: common.uTime,
            uA: { value: new Color('#9aa3b8') },
            uB: { value: new Color(st.a) },
            uLightPos: { value: keyLight },
            uRadius: { value: 1 },
            uSeed: { value: 40 + i + k },
            uKind: { value: 2 },
          },
        }),
      );
      const mesh = new Mesh(moonGeo, moonMat);
      const mr = radius * (0.16 + k * 0.07);
      mesh.scale.setScalar(mr);
      group.add(mesh);
      moons.push({ mesh, r: radius * (2.1 + k * 0.9), speed: 0.22 - k * 0.07, phase: i + k * 2.1, tilt: 0.3 + k * 0.25 });
    }

    scene.add(group);
    return { group, planet, moons, ring, pos, radius, spin: 0.045 + (i % 3) * 0.02 };
  });

  /* ---- the route that threads every system ---- */
  const routePts = [new Vector3(-30, 16, 175), ...systems.map((s) => s.pos.clone().add(new Vector3(0, s.radius * 1.9, 0))), new Vector3(0, 3, 0)];
  const routeCurve = new CatmullRomCurve3(routePts, false, 'centripetal');
  const routeCount = high ? 2200 : 900;
  const rPos = new Float32Array(routeCount * 3);
  const rT = new Float32Array(routeCount);
  const tmp = new Vector3();
  for (let i = 0; i < routeCount; i++) {
    const t = i / (routeCount - 1);
    routeCurve.getPointAt(t, tmp);
    rPos[i * 3] = tmp.x;
    rPos[i * 3 + 1] = tmp.y;
    rPos[i * 3 + 2] = tmp.z;
    rT[i] = t;
  }
  const routeGeo = track(new BufferGeometry());
  routeGeo.setAttribute('position', new BufferAttribute(rPos, 3));
  routeGeo.setAttribute('aT', new BufferAttribute(rT, 1));
  const routeMat = shader({
    vertexShader: routeVert,
    fragmentShader: routeFrag,
    uniforms: { ...common, uDraw: { value: 0.2 }, uColor: { value: new Color(pal.route) } },
  });
  const route = new Points(routeGeo, routeMat);
  route.frustumCulled = false;
  scene.add(route);

  /* ---- the sky map: every project as a star ---- */
  const GROUPS: Record<StarGroup, { ang: number; r: number; spread: number }> = {
    public: { ang: 0.75, r: 44, spread: 10 },
    automation: { ang: 2.45, r: 70, spread: 22 },
    lab: { ang: 4.05, r: 68, spread: 14 },
    foundation: { ang: 5.35, r: 64, spread: 15 },
  };
  const S = data.stars.length;
  const mPos = new Float32Array(S * 3);
  const mCol = new Float32Array(S * 3);
  const mHi = new Float32Array(S);
  const mOn = new Float32Array(S).fill(1);
  const hiTarget = new Float32Array(S);
  const onTarget = new Float32Array(S).fill(1);
  const starWorld: Vector3[] = [];
  const lineVerts: number[] = [];
  const counters: Record<string, number> = {};
  const totals: Record<string, number> = {};
  data.stars.forEach((s) => (totals[s.group] = (totals[s.group] || 0) + 1));
  const prevInGroup: Record<string, Vector3 | undefined> = {};
  data.stars.forEach((s, i) => {
    const g = GROUPS[s.group];
    const k = (counters[s.group] = (counters[s.group] ?? -1) + 1);
    const n = totals[s.group];
    const a = k * 2.39996 + g.ang;
    const rr = g.spread * Math.sqrt((k + 0.6) / n);
    const p = new Vector3(Math.cos(g.ang) * g.r + Math.cos(a) * rr, 7 + Math.sin(k * 1.9) * 2.5, Math.sin(g.ang) * g.r + Math.sin(a) * rr);
    starWorld.push(p);
    mPos.set([p.x, p.y, p.z], i * 3);
    const c = new Color(s.a);
    mCol.set([c.r, c.g, c.b], i * 3);
    const prev = prevInGroup[s.group];
    if (prev) lineVerts.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
    prevInGroup[s.group] = p;
  });
  const mapGeo = track(new BufferGeometry());
  mapGeo.setAttribute('position', new BufferAttribute(mPos, 3));
  mapGeo.setAttribute('aColor', new BufferAttribute(mCol, 3));
  const hiAttr = new BufferAttribute(mHi, 1);
  const onAttr = new BufferAttribute(mOn, 1);
  mapGeo.setAttribute('aHi', hiAttr);
  mapGeo.setAttribute('aOn', onAttr);
  const mapMat = shader({
    vertexShader: mapVert,
    fragmentShader: mapFrag,
    uniforms: { ...common, uMap: { value: 0 } },
  });
  const mapStars = new Points(mapGeo, mapMat);
  mapStars.frustumCulled = false;
  mapStars.renderOrder = 5;
  scene.add(mapStars);
  const linesGeo = track(new BufferGeometry());
  linesGeo.setAttribute('position', new BufferAttribute(new Float32Array(lineVerts), 3));
  const linesMat = track(
    new LineBasicMaterial({ color: new Color(pal.route), transparent: true, opacity: 0, depthWrite: false, blending: blend() }),
  );
  const lines = new LineSegments(linesGeo, linesMat);
  lines.frustumCulled = false;
  scene.add(lines);

  /* ---------------------------------------------------------- layout -- */
  let W = 1;
  let H = 1;
  let phone = false;
  let stops: Stop[] = [];
  let posCurve: CatmullRomCurve3 | null = null;
  let lookCurve: CatmullRomCurve3 | null = null;
  const HERO_POS = new Vector3(0, 118, 250);
  const ORIGIN = new Vector3(0, -6, 0);

  function stationCam(i: number) {
    const s = systems[i];
    const out = new Vector3(s.pos.x, 0, s.pos.z).normalize();
    const tan = new Vector3(-out.z, 0, out.x).multiplyScalar(i % 2 ? 0.74 : -0.74);
    const dir = out.multiplyScalar(0.6).add(tan).add(new Vector3(0, 0.34, 0)).normalize();
    const dist = s.radius * (phone ? 8.2 : 5.9);
    return { pos: s.pos.clone().addScaledVector(dir, dist), look: s.pos.clone() };
  }

  function relayout() {
    W = window.innerWidth || 1;
    H = window.innerHeight || 1;
    phone = W < 760;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = phone ? 56 : 42;
    const vh = H;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-sky-stop]'));
    const next: Stop[] = [];
    let stationIndex = 0;
    for (const el of els) {
      const [kind, id = ''] = (el.dataset.skyStop || '').split(':') as [StopKind, string?];
      const top = docTop(el);
      const h = el.offsetHeight;
      const rect = el.getBoundingClientRect();
      if (kind === 'hero') {
        const pos = HERO_POS.clone().multiplyScalar(phone ? 1.5 : 1);
        next.push({ kind, id, y0: 0, y1: 0, pos, look: ORIGIN.clone(), ox: 0, oy: phone ? 0.2 : 0.16 });
      } else if (kind === 'beats') {
        const y = top + h * 0.5 - vh * 0.5;
        next.push({ kind, id, y0: y, y1: y, pos: new Vector3(), look: new Vector3(), ox: 0, oy: 0 });
      } else if (kind === 'station') {
        const i = Math.min(stationIndex++, systems.length - 1);
        const cam = stationCam(i);
        const panel = el.querySelector<HTMLElement>('[data-sky-panel]');
        const pr = (panel ?? el).getBoundingClientRect();
        const panelLeft = pr.left + pr.width / 2 < rect.left + rect.width / 2;
        next.push({
          kind,
          id,
          y0: top - vh * 0.12,
          y1: Math.max(top - vh * 0.12, top + h - vh * 0.92),
          pos: cam.pos,
          look: cam.look,
          ox: phone ? 0 : panelLeft ? -0.25 : 0.25,
          oy: phone ? 0.2 : 0,
        });
      } else if (kind === 'map') {
        const list = el.querySelector<HTMLElement>('[data-sky-list]');
        const lr = (list ?? el).getBoundingClientRect();
        const listRight = lr.left + lr.width / 2 > W / 2;
        next.push({
          kind,
          id,
          y0: top - vh * 0.2,
          y1: Math.max(top - vh * 0.2, top + h - vh * 1.05),
          pos: phone ? new Vector3(0, 380, 90) : new Vector3(0, 320, 150),
          look: new Vector3(0, 0, 4),
          ox: phone ? 0 : listRight ? 0.24 : -0.24,
          oy: phone ? -0.06 : -0.12,
        });
      } else if (kind === 'contact') {
        const y = Math.min(maxScroll, top + h * 0.5 - vh * 0.5);
        next.push({ kind, id, y0: y, y1: Math.max(y, maxScroll), pos: new Vector3(18, 58, 150), look: new Vector3(0, 0, 0), ox: phone ? 0 : -0.36, oy: phone ? 0.34 : -0.04 });
      }
    }
    if (!next.length) return;

    // Beats sit between the hero and the first arrival: fill their pose now
    // that both neighbours are known.
    next.forEach((s, k) => {
      if (s.kind !== 'beats') return;
      const a = next[k - 1] ?? next[0];
      const b = next.slice(k + 1).find((x) => x.kind !== 'beats') ?? a;
      s.pos.copy(a.pos).lerp(b.pos, 0.5).add(new Vector3(0, 26, 0));
      s.look.copy(a.look).lerp(b.look, 0.62);
    });

    // Scroll ranges must never run backwards.
    for (let k = 1; k < next.length; k++) {
      if (next[k].y0 < next[k - 1].y1) next[k].y0 = next[k - 1].y1;
      if (next[k].y1 < next[k].y0) next[k].y1 = next[k].y0;
    }
    stops = next;
    posCurve = stops.length > 1 ? new CatmullRomCurve3(stops.map((s) => s.pos), false, 'centripetal') : null;
    lookCurve = stops.length > 1 ? new CatmullRomCurve3(stops.map((s) => s.look), false, 'centripetal') : null;
  }

  function progressAt(y: number) {
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      if (y <= s.y1) {
        if (i === 0 || y >= s.y0) return i;
        const prev = stops[i - 1];
        const span = s.y0 - prev.y1;
        return i - 1 + (span > 0 ? easeInOut((y - prev.y1) / span) : 1);
      }
    }
    return Math.max(0, stops.length - 1);
  }

  /* ------------------------------------------------------ interaction -- */
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

  let highlighted = -1;
  let mapLevel = 0;
  const projected = new Vector3();
  function screenOf(i: number) {
    projected.copy(starWorld[i]).project(camera);
    return { x: (projected.x * 0.5 + 0.5) * W, y: (-projected.y * 0.5 + 0.5) * H, z: projected.z };
  }

  /* ------------------------------------------------------------- loop -- */
  let u = 0;
  let raf = 0;
  let last = performance.now();
  let elapsed = 0;
  let frames = 0;
  let slowFrames = 0;
  const tmpPos = new Vector3();
  const tmpLook = new Vector3();
  const right = new Vector3();
  const up = new Vector3();

  relayout();
  u = progressAt(window.scrollY);

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    elapsed += dt;
    common.uTime.value = elapsed;

    // Adaptive resolution: a phone that cannot hold the frame gets fewer pixels,
    // never fewer systems.
    if (frames < 240) {
      frames++;
      if (dt > 0.026) slowFrames++;
      if (frames === 120 && slowFrames > 50 && dpr > 0.9) {
        dpr = Math.max(0.85, dpr - 0.35);
        renderer.setPixelRatio(dpr);
        common.uPixel.value = dpr;
        renderer.setSize(W, H, false);
      }
    }

    const target = progressAt(window.scrollY);
    u += (target - u) * (1 - Math.exp(-dt * 5.5));
    if (Math.abs(target - u) < 1e-4) u = target;

    if (posCurve && lookCurve && stops.length > 1) {
      const n = stops.length - 1;
      const f = Math.min(n, Math.max(0, u)) / n;
      posCurve.getPoint(f, tmpPos);
      lookCurve.getPoint(f, tmpLook);
      const i0 = Math.min(n, Math.floor(u));
      const i1 = Math.min(n, i0 + 1);
      const fr = u - i0;
      const ox = stops[i0].ox + (stops[i1].ox - stops[i0].ox) * fr;
      const oy = stops[i0].oy + (stops[i1].oy - stops[i0].oy) * fr;
      camera.position.copy(tmpPos);
      camera.lookAt(tmpLook);
      camera.updateMatrixWorld();
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      px += (pointerX - px) * (1 - Math.exp(-dt * 2.5));
      py += (pointerY - py) * (1 - Math.exp(-dt * 2.5));
      const sway = Math.sin(elapsed * 0.21) * 0.6;
      camera.position.addScaledVector(right, px * 1.8 + sway).addScaledVector(up, -py * 1.1);
      camera.lookAt(tmpLook);
      camera.setViewOffset(W, H, ox * W, oy * H, W, H);

      // Route and map visibility follow where the camera is on the page.
      const mapIdx = stops.findIndex((s) => s.kind === 'map');
      mapLevel = mapIdx >= 0 ? clamp01(1 - Math.abs(u - mapIdx) * 1.5) : 0;
      const firstStation = stops.findIndex((s) => s.kind === 'station');
      const draw = firstStation > 0 ? 0.22 + clamp01(u / firstStation) * 0.2 + clamp01((u - firstStation) / Math.max(1, mapIdx - firstStation)) * 0.58 : 1;
      routeMat.uniforms.uDraw.value = Math.min(1, draw);
    } else {
      camera.position.copy(HERO_POS);
      camera.lookAt(ORIGIN);
    }
    camera.updateProjectionMatrix();

    mapMat.uniforms.uMap.value = mapLevel;
    // Text sits on top of the scene at the close: the core steps back there.
    const contactIdx = stops.findIndex((s) => s.kind === 'contact');
    const closeLevel = contactIdx >= 0 ? clamp01(1 - Math.abs(u - contactIdx) * 1.2) : 0;
    (coreOuter.material as ShaderMaterial).uniforms.uOpacity.value = 0.38 * (1 - closeLevel * 0.6);
    (coreInner.material as ShaderMaterial).uniforms.uOpacity.value = 0.5 * (1 - closeLevel * 0.7);
    linesMat.opacity = mapLevel * (pal.light ? 0.35 : 0.22);
    galaxyMat.uniforms.uScale.value = (high ? 260 : 300) * (1 - mapLevel * 0.25);

    let dirty = false;
    for (let i = 0; i < S; i++) {
      const h = mHi[i] + (hiTarget[i] - mHi[i]) * (1 - Math.exp(-dt * 9));
      const o = mOn[i] + (onTarget[i] - mOn[i]) * (1 - Math.exp(-dt * 7));
      if (Math.abs(h - mHi[i]) > 1e-4 || Math.abs(o - mOn[i]) > 1e-4) dirty = true;
      mHi[i] = h;
      mOn[i] = o;
    }
    if (dirty) {
      hiAttr.needsUpdate = true;
      onAttr.needsUpdate = true;
    }

    for (const s of systems) {
      s.planet.rotation.y += dt * s.spin;
      if (s.ring) s.ring.rotation.y += dt * 0.02;
      for (const m of s.moons) {
        const a = m.phase + elapsed * m.speed;
        m.mesh.position.set(Math.cos(a) * m.r, Math.sin(a) * m.r * Math.sin(m.tilt), Math.sin(a) * m.r * Math.cos(m.tilt));
      }
    }

    renderer.render(scene, camera);

    if (opts.tag) {
      if (highlighted >= 0 && mapLevel > 0.55) {
        const p = screenOf(highlighted);
        opts.tag.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
        opts.tag.dataset.on = p.z < 1 ? 'true' : 'false';
      } else {
        opts.tag.dataset.on = 'false';
      }
    }
  };
  raf = requestAnimationFrame(frame);

  const onResize = () => relayout();
  window.addEventListener('resize', onResize, { passive: true });
  const ro = new ResizeObserver(() => relayout());
  ro.observe(document.body);

  return {
    relayout,
    highlight(slug) {
      highlighted = slug ? data.stars.findIndex((s) => s.slug === slug) : -1;
      hiTarget.fill(0);
      if (highlighted >= 0) {
        hiTarget[highlighted] = 1;
        if (opts.tag) opts.tag.textContent = data.stars[highlighted].title;
      }
    },
    filter(group) {
      data.stars.forEach((s, i) => (onTarget[i] = group === 'all' || s.group === group ? 1 : 0));
    },
    pick(x, y) {
      if (mapLevel < 0.6) return null;
      let best = -1;
      let bestD = 26 * 26;
      for (let i = 0; i < S; i++) {
        if (onTarget[i] < 0.5) continue;
        const p = screenOf(i);
        if (p.z > 1) continue;
        const d = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best >= 0 ? { slug: data.stars[best].slug, href: data.stars[best].href } : null;
    },
    retheme() {
      pal = skyPalette();
      common.uLight.value = pal.light ? 1 : 0;
      blended.forEach((m) => {
        m.blending = blend();
        m.needsUpdate = true;
      });
      linesMat.blending = blend();
      linesMat.color.set(pal.route);
      linesMat.needsUpdate = true;
      (routeMat.uniforms.uColor.value as Color).set(pal.route);
      (coreOuter.material as ShaderMaterial).uniforms.uColor.value.set(pal.core);
      paintGalaxy();
      paintNebulae();
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
