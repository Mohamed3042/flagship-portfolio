/* =====================================================================
   ONE SKY — the home page's single WebGL scene.

   One fixed canvas sits behind the whole home. Scroll moves a camera along a
   route that threads every featured system: outside the galaxy (hero), a dive
   through the arms (beats), one arrival per featured project (stations), a
   pull-back over the whole disc where every project is a star (sky map), and
   a final approach into the core (contact).

   The DOM owns every word. This file only reads where the stops are
   ([data-sky-stop]) and draws. It is dynamic-imported by boot.ts after the
   first paint and only on a device that passed the capability gate. The
   universe itself (galaxy, nebulae, planets) comes from world.ts, which the
   story flights share, and the frame goes through the post stack in post.ts.
   ===================================================================== */
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  LineBasicMaterial,
  LineSegments,
  NoToneMapping,
  PerspectiveCamera,
  Points,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { mapFrag, mapVert, routeFrag, routeVert } from './shaders';
import { skyPalette, type SkyPalette } from './palette';
import { createPost } from './post';
import { createTextField } from './text';
import {
  buildBackdrop,
  buildComets,
  buildCore,
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
  sharedGeometry,
  type SystemSpec,
} from './world';

export type StarGroup = 'public' | 'automation' | 'lab' | 'foundation';

export interface SkyData {
  stations: SystemSpec[];
  stars: { slug: string; group: StarGroup; a: string; title: string; href: string }[];
}

export interface SkyOptions {
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

/* --------------------------------------------------------------- engine -- */

export async function mountSky(canvas: HTMLCanvasElement, data: SkyData, opts: SkyOptions): Promise<SkyEngine> {
  const t0 = performance.now();
  let pal: SkyPalette = skyPalette();

  const renderer = new WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: 'high-performance' });
  renderer.toneMapping = NoToneMapping;
  renderer.setClearColor(0x000000, 1);
  // Native resolution on every device: the owner's rule is no reduced
  // quality on a phone, so the pixel ratio is the device's own.
  let dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 4000);
  const world = createWorld(scene, pal, dpr, renderer);
  const { common } = world;

  const backdrop = buildBackdrop(world);
  const galaxy = buildGalaxy(world);
  buildFarShell(world);
  const nebulae = buildNebulae(world);
  const core = buildCore(world);
  const comets = buildComets(world);

  /* ---- featured systems ---- */
  const geo = sharedGeometry(world);
  await prepareBake(world, [...data.stations.map((s) => s.kind), 2]);
  const systems = data.stations.map((spec, i) => buildSystem(world, spec, geo, i, { size: 2048, start: 512 }));
  // the full-size surfaces bake one per frame once the first frame is up
  const upgrades = [...systems];

  /* ---- the route that threads every system ---- */
  const routePts = [new Vector3(-30, 16, 175), ...systems.map((s) => s.pos.clone().add(new Vector3(0, s.radius * 1.9, 0))), new Vector3(0, 3, 0)];
  const routeCurve = new CatmullRomCurve3(routePts, false, 'centripetal');
  const routeCount = 4000;
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
  const routeGeo = world.track(new BufferGeometry());
  routeGeo.setAttribute('position', new BufferAttribute(rPos, 3));
  routeGeo.setAttribute('aT', new BufferAttribute(rT, 1));
  const routeMat = world.shader({
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
  const mapGeo = world.track(new BufferGeometry());
  mapGeo.setAttribute('position', new BufferAttribute(mPos, 3));
  mapGeo.setAttribute('aColor', new BufferAttribute(mCol, 3));
  const hiAttr = new BufferAttribute(mHi, 1);
  const onAttr = new BufferAttribute(mOn, 1);
  mapGeo.setAttribute('aHi', hiAttr);
  mapGeo.setAttribute('aOn', onAttr);
  const mapMat = world.shader({ vertexShader: mapVert, fragmentShader: mapFrag, uniforms: { ...common, uMap: { value: 0 } } });
  const mapStars = new Points(mapGeo, mapMat);
  mapStars.frustumCulled = false;
  mapStars.renderOrder = 5;
  scene.add(mapStars);
  const linesGeo = world.track(new BufferGeometry());
  linesGeo.setAttribute('position', new BufferAttribute(new Float32Array(lineVerts), 3));
  const linesMat = world.track(
    new LineBasicMaterial({ color: new Color(pal.route), transparent: true, opacity: 0, depthWrite: false, blending: world.blend() }),
  );
  const lines = new LineSegments(linesGeo, linesMat);
  lines.frustumCulled = false;
  scene.add(lines);

  /* ---- post stack ---- */
  const post = createPost(renderer, scene, camera, { strength: 0.7, radius: 0.55, threshold: 0.76 });
  post.setLight(pal.light);

  /* ---- every headline as particles ---- */
  const text = createTextField(world, camera, Array.from(document.querySelectorAll<HTMLElement>('[data-ptext]')), ['#ff5e8a', '#a259ff', '#2997ff', '#64d2ff']);

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
    camera.fov = phone ? 56 : 42;
    text.refresh();
  }

  function relayout() {
    resize();
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
        // the core sits above the headline band, never behind it
        next.push({ kind, id, y0: 0, y1: 0, pos, look: ORIGIN.clone(), ox: 0, oy: phone ? 0.32 : 0.29 });
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
  let velocity = 0;
  let frames = 0;
  let lastY = window.scrollY;
  const tmpPos = new Vector3();
  const tmpLook = new Vector3();
  const right = new Vector3();
  const up = new Vector3();

  relayout();
  u = progressAt(window.scrollY);
  // Parallel shader compile (KHR_parallel_shader_compile where available), so
  // the page stays interactive while the planets' programs build.
  const tBuilt = performance.now();
  await renderer.compileAsync(scene, camera).catch(() => undefined);
  last = performance.now();
  console.info(`[sky] scene built in ${(tBuilt - t0).toFixed(0)} ms, programs compiled in ${(last - tBuilt).toFixed(0)} ms`);

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    elapsed += dt;
    common.uTime.value = elapsed;
    frames++;

    const y = window.scrollY;
    velocity = damp(velocity, Math.min(1, Math.abs(y - lastY) / (dt * 2600)), 7, dt);
    lastY = y;
    const target = progressAt(y);
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
    // the core steps back under the hero headline and again under the close
    const heroLevel = clamp01(1 - u * 1.3) * 0.94;
    core.setClose(Math.max(heroLevel, contactIdx >= 0 ? clamp01(1 - Math.abs(u - contactIdx) * 1.2) : 0), 1 - clamp01(1 - u) * 0.62);
    linesMat.opacity = mapLevel * (pal.light ? 0.35 : 0.22);
    galaxy.material.uniforms.uScale.value = 260 * (1 - mapLevel * 0.25);

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

    for (const s of systems) s.update(dt, elapsed);
    if (upgrades.length && frames > 2) upgrades.shift()?.upgrade();
    galaxy.points.rotation.y += dt * 0.0022;
    comets.update(dt);
    text.update(dt, elapsed, W, H);

    post.render(elapsed, velocity, world.overlay);

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
      world.retheme(pal);
      linesMat.blending = world.blend();
      linesMat.color.set(pal.route);
      linesMat.needsUpdate = true;
      (routeMat.uniforms.uColor.value as Color).set(pal.route);
      backdrop.repaint(pal);
      galaxy.repaint(pal);
      nebulae.repaint(pal);
      core.repaint(pal);
      post.setLight(pal.light);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      ro.disconnect();
      text.dispose();
      post.dispose();
      world.dispose();
      renderer.dispose();
    },
  };
}
