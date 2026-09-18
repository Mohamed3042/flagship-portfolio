/* =====================================================================
   ONE SKY — the shared universe.

   Every builder here serves BOTH flights: the home (engine.ts) and every
   story page (story.ts). A planet a reader meets on the home is therefore
   the same object, from the same shaders, on its story page.

   Density is one setting for every device: the owner's rule is that a phone
   renders the identical scene at its native resolution. Capability (no
   WebGL, a software rasteriser) is the only gate, and it lives in boot.
   ===================================================================== */
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  ClampToEdgeWrapping,
  Color,
  DataTexture,
  Group,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  NormalBlending,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  RGBAFormat,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Blending,
  type ShaderMaterialParameters,
  type WebGLRenderer,
} from 'three';
import {
  atmoFrag,
  atmoVert,
  auroraFrag,
  bakeFrag,
  bakeVert,
  bgFrag,
  bgVert,
  cloudFrag,
  constructVert,
  glowFrag,
  glowVert,
  nebulaFrag,
  nebulaVert,
  planetFrag,
  planetVert,
  starFrag,
  starVert,
} from './shaders';
import type { SkyPalette } from './palette';

/* ------------------------------------------------------------ utilities -- */

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gauss(r: () => number) {
  const u = Math.max(r(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * r());
}

export const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
export const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
/** Exponential damping towards a target: frame-rate independent. */
export const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-dt * rate));

/** One density for every device. */
export const DENSITY = {
  galaxyStars: 220000,
  farStars: 12000,
  nebulae: 12,
  dustLanes: 5,
  octaves: 5,
  ringDust: 12000,
  comets: 7,
  planetSegments: [128, 96] as const,
  atmoSegments: [72, 48] as const,
  moonSegments: [48, 32] as const,
};

/* ------------------------------------------------------------- context -- */

export interface WorldCommon {
  uTime: { value: number };
  uPixel: { value: number };
  uLight: { value: number };
  tNoise: { value: DataTexture };
}

/** The 256×256 value-noise texture every shader samples (see NOISE3). */
export function noiseTexture(): DataTexture {
  const N = 256;
  const r = rng(1234567);
  const red = new Uint8Array(N * N);
  for (let i = 0; i < N * N; i++) red[i] = Math.floor(r() * 256);
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      data[i * 4] = red[i];
      data[i * 4 + 1] = red[((y + 17) & 255) * N + ((x + 37) & 255)];
      data[i * 4 + 2] = red[((y + 91) & 255) * N + ((x + 113) & 255)];
      data[i * 4 + 3] = 255;
    }
  }
  const tex = new DataTexture(data, N, N, RGBAFormat);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export interface WorldCtx {
  scene: Scene;
  /** drawn after the post stack: particle headlines and their lenses, never bloomed or fringed */
  overlay: Scene;
  renderer: WebGLRenderer;
  pal: SkyPalette;
  common: WorldCommon;
  track<T extends { dispose(): void }>(x: T): T;
  /** A ShaderMaterial that follows the palette's blending (additive in the
   *  dark themes, normal in light). Pass additive=false for opaque or dark
   *  layers that must never follow that switch. */
  shader(m: ShaderMaterialParameters, additive?: boolean): ShaderMaterial;
  blend(): Blending;
  quad: PlaneGeometry;
  glow(color: string, opacity: number, size: number): Mesh;
  retheme(pal: SkyPalette): void;
  /** the surface baker: one program per surface kind, one fullscreen quad */
  bake: {
    scene: Scene;
    camera: OrthographicCamera;
    quad: Mesh;
    materials: Map<number, ShaderMaterial>;
  };
  dispose(): void;
}

export function createWorld(scene: Scene, pal: SkyPalette, dpr: number, renderer: WebGLRenderer): WorldCtx {
  const disposables: { dispose(): void }[] = [];
  const blended: ShaderMaterial[] = [];
  const noise = noiseTexture();
  disposables.push(noise);
  const common: WorldCommon = { uTime: { value: 0 }, uPixel: { value: dpr }, uLight: { value: pal.light ? 1 : 0 }, tNoise: { value: noise } };
  const bakeScene = new Scene();
  const bakeQuad = new Mesh(new PlaneGeometry(2, 2));
  bakeQuad.frustumCulled = false;
  bakeScene.add(bakeQuad);
  const ctx: WorldCtx = {
    scene,
    overlay: new Scene(),
    renderer,
    pal,
    bake: { scene: bakeScene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1), quad: bakeQuad, materials: new Map() },
    common,
    track: (x) => (disposables.push(x), x),
    blend: () => (ctx.pal.light ? NormalBlending : AdditiveBlending),
    shader(m, additive = true) {
      const mat = ctx.track(new ShaderMaterial({ transparent: true, depthWrite: false, ...m }));
      if (additive) {
        mat.blending = ctx.blend();
        blended.push(mat);
      }
      return mat;
    },
    quad: null as unknown as PlaneGeometry,
    glow(color, opacity, size) {
      const mat = ctx.shader({
        vertexShader: glowVert,
        fragmentShader: glowFrag,
        uniforms: { ...common, uColor: { value: new Color(color) }, uOpacity: { value: opacity } },
      });
      const m = new Mesh(ctx.quad, mat);
      m.scale.set(size, size, 1);
      m.frustumCulled = false;
      return m;
    },
    retheme(next) {
      ctx.pal = next;
      common.uLight.value = next.light ? 1 : 0;
      blended.forEach((m) => {
        m.blending = ctx.blend();
        m.needsUpdate = true;
      });
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      disposables.length = 0;
      ctx.bake.materials.forEach((m) => m.dispose());
      ctx.bake.materials.clear();
      bakeQuad.geometry.dispose();
    },
  };
  ctx.quad = ctx.track(new PlaneGeometry(1, 1));
  return ctx;
}

/* -------------------------------------------------------------- baking -- */

export interface Surface {
  albedo: WebGLRenderTarget;
  data: WebGLRenderTarget;
  size: number;
  dispose(): void;
}

function bakeMaterial(ctx: WorldCtx, kind: number): ShaderMaterial {
  let mat = ctx.bake.materials.get(kind);
  if (!mat) {
    mat = new ShaderMaterial({
      vertexShader: bakeVert,
      fragmentShader: bakeFrag(5, kind),
      depthTest: false,
      depthWrite: false,
      uniforms: { tNoise: ctx.common.tNoise, uA: { value: new Color() }, uB: { value: new Color() }, uSeed: { value: 0 }, uPass: { value: 0 } },
    });
    ctx.bake.materials.set(kind, mat);
  }
  return mat;
}

/** Compile the bake programs the page will need, in parallel and off the
 *  main thread where the driver allows, before the first bake blocks on them. */
export async function prepareBake(ctx: WorldCtx, kinds: number[]): Promise<void> {
  const temp = new Scene();
  const geo = new PlaneGeometry(2, 2);
  for (const k of new Set(kinds.map((k) => k & 3))) {
    const m = new Mesh(geo, bakeMaterial(ctx, k));
    m.frustumCulled = false;
    temp.add(m);
  }
  await ctx.renderer.compileAsync(temp, ctx.bake.camera).catch(() => undefined);
  geo.dispose();
}

/** Render a planet's surface into two equirectangular textures: albedo +
 *  emission, and height + mask. Once per planet, at any size up to 4K. */
export function bakeSurface(ctx: WorldCtx, spec: { a: string; b: string; seed: number; kind: number }, size: number): Surface {
  const kind = spec.kind & 3;
  const mat = bakeMaterial(ctx, kind);
  (mat.uniforms.uA.value as Color).set(spec.a);
  (mat.uniforms.uB.value as Color).set(spec.b);
  mat.uniforms.uSeed.value = spec.seed;
  ctx.bake.quad.material = mat;
  const w = size;
  const h = size / 2;
  const albedo = new WebGLRenderTarget(w, h, {
    depthBuffer: false,
    stencilBuffer: false,
    type: UnsignedByteType,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    magFilter: LinearFilter,
    wrapS: RepeatWrapping,
    wrapT: ClampToEdgeWrapping,
  });
  const data = new WebGLRenderTarget(w, h, {
    depthBuffer: false,
    stencilBuffer: false,
    type: ctx.renderer.capabilities.isWebGL2 ? HalfFloatType : UnsignedByteType,
    generateMipmaps: false,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    wrapS: RepeatWrapping,
    wrapT: ClampToEdgeWrapping,
  });
  albedo.texture.anisotropy = ctx.renderer.capabilities.getMaxAnisotropy();
  const r = ctx.renderer;
  const prev = r.getRenderTarget();
  mat.uniforms.uPass.value = 0;
  r.setRenderTarget(albedo);
  r.render(ctx.bake.scene, ctx.bake.camera);
  mat.uniforms.uPass.value = 1;
  r.setRenderTarget(data);
  r.render(ctx.bake.scene, ctx.bake.camera);
  r.setRenderTarget(prev);
  return {
    albedo,
    data,
    size,
    dispose() {
      albedo.dispose();
      data.dispose();
    },
  };
}

/* ------------------------------------------------------------ backdrop -- */

export function buildBackdrop(ctx: WorldCtx) {
  const uTop = { value: new Color(ctx.pal.top) };
  const uBottom = { value: new Color(ctx.pal.bottom) };
  const mat = ctx.track(
    new ShaderMaterial({ vertexShader: bgVert, fragmentShader: bgFrag, depthTest: false, depthWrite: false, uniforms: { uTop, uBottom } }),
  );
  const mesh = new Mesh(ctx.track(new PlaneGeometry(2, 2)), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  ctx.scene.add(mesh);
  return {
    repaint(pal: SkyPalette) {
      uTop.value.set(pal.top);
      uBottom.value.set(pal.bottom);
    },
  };
}

/* -------------------------------------------------------------- galaxy -- */

export interface Galaxy {
  points: Points;
  material: ShaderMaterial;
  repaint(pal: SkyPalette): void;
}

/** The disc: four arms, exponential radial falloff, a thick bright core. */
export function buildGalaxy(ctx: WorldCtx, count = DENSITY.galaxyStars, R = 120): Galaxy {
  const gRand = rng(7);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const arm = new Uint8Array(count);
  const mix = new Float32Array(count);
  const ARMS = 4;
  for (let i = 0; i < count; i++) {
    const rr = Math.min(R, (-Math.log(1 - gRand() * 0.985) * R) / 3.1);
    const a = Math.floor(gRand() * ARMS);
    const ang = (a / ARMS) * Math.PI * 2 + rr * 0.042 + gauss(gRand) * (0.2 + (rr / R) * 0.22);
    const thick = 4.2 * Math.exp(-rr / 22) + 0.9;
    const scatter = 1.4 + (rr / R) * 2.6;
    pos[i * 3] = Math.cos(ang) * rr + gauss(gRand) * scatter;
    pos[i * 3 + 1] = gauss(gRand) * thick;
    pos[i * 3 + 2] = Math.sin(ang) * rr + gauss(gRand) * scatter;
    const bright = gRand();
    size[i] = 0.5 + Math.pow(bright, 7) * 4.2;
    seed[i] = gRand();
    arm[i] = a;
    mix[i] = clamp01(rr / 48) * (0.75 + gRand() * 0.25);
  }
  const geo = ctx.track(new BufferGeometry());
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  const color = new BufferAttribute(new Float32Array(count * 3), 3);
  geo.setAttribute('aColor', color);
  const repaint = (pal: SkyPalette) => {
    const c = new Color();
    const core = new Color(pal.core);
    const arms = pal.arms.map((h) => new Color(h));
    const hot = new Color('#cfe3ff');
    const r = rng(11);
    for (let i = 0; i < count; i++) {
      c.copy(core).lerp(arms[arm[i] % arms.length], mix[i]);
      if (r() < 0.035) c.lerp(hot, 0.7);
      const k = 0.55 + r() * 0.45;
      color.setXYZ(i, c.r * k, c.g * k, c.b * k);
    }
    color.needsUpdate = true;
  };
  repaint(ctx.pal);
  const material = ctx.shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...ctx.common, uScale: { value: 260 } } });
  const points = new Points(geo, material);
  points.frustumCulled = false;
  ctx.scene.add(points);
  return { points, material, repaint };
}

/** The far shell: distant white stars on a sphere well outside the disc. */
export function buildFarShell(ctx: WorldCtx, count = DENSITY.farStars): Points {
  const fRand = rng(23);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = fRand() * 2 - 1;
    const th = fRand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const d = 1300 + fRand() * 500;
    pos[i * 3] = s * Math.cos(th) * d;
    pos[i * 3 + 1] = u * d;
    pos[i * 3 + 2] = s * Math.sin(th) * d;
    size[i] = 3 + Math.pow(fRand(), 8) * 10;
    seed[i] = fRand();
    const w = 0.6 + fRand() * 0.4;
    col[i * 3] = w;
    col[i * 3 + 1] = w * (0.9 + fRand() * 0.1);
    col[i * 3 + 2] = w;
  }
  const geo = ctx.track(new BufferGeometry());
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geo.setAttribute('aColor', new BufferAttribute(col, 3));
  const far = new Points(geo, ctx.shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...ctx.common, uScale: { value: 420 } } }));
  far.frustumCulled = false;
  ctx.scene.add(far);
  return far;
}

/* -------------------------------------------------------------- nebulae -- */

/** Bright nebula sheets threaded through the arms, plus dark dust lanes that
 *  subtract light instead of adding it. */
export function buildNebulae(ctx: WorldCtx, count = DENSITY.nebulae, dust = DENSITY.dustLanes, octaves = DENSITY.octaves) {
  const nRand = rng(31);
  const geo = ctx.track(new PlaneGeometry(1, 1));
  const bright: ShaderMaterial[] = [];
  const dark: ShaderMaterial[] = [];
  const place = (mat: ShaderMaterial, k: number, n: number, low: boolean) => {
    const m = new Mesh(geo, mat);
    const ang = (k / n) * Math.PI * 2 + (low ? 1.9 : 0.5);
    const r = (low ? 18 : 26) + (k % 3) * 24;
    m.position.set(Math.cos(ang) * r, (low ? -1 : -3) + (k % 2) * 4, Math.sin(ang) * r);
    m.rotation.set(-Math.PI / 2 + (nRand() - 0.5) * 0.45, 0, nRand() * Math.PI);
    const s = (low ? 60 : 80) + nRand() * 50;
    m.scale.set(s, s * (0.55 + nRand() * 0.4), 1);
    m.renderOrder = low ? -2 : -1;
    ctx.scene.add(m);
  };
  for (let k = 0; k < count; k++) {
    const mat = ctx.shader({
      vertexShader: nebulaVert,
      fragmentShader: nebulaFrag(octaves),
      side: 2,
      uniforms: { ...ctx.common, uSeed: { value: k * 7.13 }, uOpacity: { value: 0.28 + nRand() * 0.18 }, uColA: { value: new Color() }, uColB: { value: new Color() } },
    });
    bright.push(mat);
    place(mat, k, count, false);
  }
  for (let k = 0; k < dust; k++) {
    const mat = ctx.shader(
      {
        vertexShader: nebulaVert,
        fragmentShader: nebulaFrag(Math.max(3, octaves - 1)),
        side: 2,
        blending: NormalBlending,
        uniforms: { ...ctx.common, uSeed: { value: 50 + k * 3.7 }, uOpacity: { value: 0.55 + nRand() * 0.25 }, uColA: { value: new Color() }, uColB: { value: new Color() } },
      },
      false,
    );
    dark.push(mat);
    place(mat, k, dust, true);
  }
  const repaint = (pal: SkyPalette) => {
    bright.forEach((mat, k) => {
      (mat.uniforms.uColA.value as Color).set(pal.arms[k % pal.arms.length]);
      (mat.uniforms.uColB.value as Color).set(pal.arms[(k + 1) % pal.arms.length]);
    });
    const shade = new Color(pal.bottom).lerp(new Color(pal.light ? '#8c94c8' : '#000000'), pal.light ? 0.35 : 0.65);
    dark.forEach((mat) => {
      (mat.uniforms.uColA.value as Color).copy(shade);
      (mat.uniforms.uColB.value as Color).copy(shade).multiplyScalar(pal.light ? 1.1 : 0.7);
    });
  };
  repaint(ctx.pal);
  return { repaint };
}

/* ----------------------------------------------------------------- core -- */

export function buildCore(ctx: WorldCtx) {
  const outer = ctx.glow(ctx.pal.core, 0.38, 150);
  const mid = ctx.glow(ctx.pal.arms[1], 0.22, 70);
  const inner = ctx.glow('#ffffff', 0.5, 26);
  ctx.scene.add(outer, mid, inner);
  const opacity = (m: Mesh) => (m.material as ShaderMaterial).uniforms.uOpacity;
  return {
    /** The core steps back while text sits over it (0 → 1); gain scales
     *  the whole core for pages where it is scenery, never the subject. */
    setClose(level: number, gain = 1) {
      opacity(outer).value = 0.38 * (1 - level * 0.6) * gain;
      opacity(mid).value = 0.22 * (1 - level * 0.5) * gain;
      opacity(inner).value = 0.5 * (1 - level * 0.7) * gain;
    },
    repaint(pal: SkyPalette) {
      (outer.material as ShaderMaterial).uniforms.uColor.value.set(pal.core);
      (mid.material as ShaderMaterial).uniforms.uColor.value.set(pal.arms[1]);
    },
  };
}

/* -------------------------------------------------------------- systems -- */

export interface SystemSpec {
  id: string;
  a: string;
  b: string;
  /** 0 oceanic · 1 banded giant · 2 crystalline · 3 ember */
  kind: number;
  seed: number;
  radius: number;
  x: number;
  y: number;
  z: number;
}

export interface SharedGeo {
  planet: SphereGeometry;
  atmo: SphereGeometry;
  cloud: SphereGeometry;
  moon: SphereGeometry;
  aurora: TorusGeometry;
}

export function sharedGeometry(ctx: WorldCtx): SharedGeo {
  return {
    planet: ctx.track(new SphereGeometry(1, DENSITY.planetSegments[0], DENSITY.planetSegments[1])),
    atmo: ctx.track(new SphereGeometry(1, DENSITY.atmoSegments[0], DENSITY.atmoSegments[1])),
    cloud: ctx.track(new SphereGeometry(1, 96, 64)),
    moon: ctx.track(new SphereGeometry(1, DENSITY.moonSegments[0], DENSITY.moonSegments[1])),
    aurora: ctx.track(new TorusGeometry(1, 0.16, 12, 96)),
  };
}

export interface Sys {
  group: Group;
  planet: Mesh;
  pos: Vector3;
  radius: number;
  spin: number;
  keyLight: Vector3;
  update(dt: number, elapsed: number): void;
  /** re-bake the surface at its full size (call once, off the first frame) */
  upgrade(): void;
}

export interface SystemQuality {
  /** the surface texture width the planet ends up with (4096 = 4K) */
  size: number;
  /** the width baked at mount, before the upgrade */
  start?: number;
}

/** One star system: planet, atmosphere, halo, and by kind a cloud shell,
 *  a particle ring, an aurora and moons. Lit from the arrival side. Its
 *  surface is baked once (progressively: a quick small bake at mount, the
 *  full one on a later frame) so drawing it costs a few texture reads. */
export function buildSystem(ctx: WorldCtx, spec: SystemSpec, geo: SharedGeo, index = 0, quality: SystemQuality = { size: 2048, start: 512 }): Sys {
  const pos = new Vector3(spec.x, spec.y, spec.z);
  const { radius } = spec;
  const kind = spec.kind & 3;
  const group = new Group();
  group.position.copy(pos);
  const outDir = new Vector3(pos.x, 0, pos.z).normalize();
  if (!outDir.lengthSq()) outDir.set(1, 0, 0);
  const side = new Vector3(-outDir.z, 0, outDir.x).multiplyScalar(index % 2 ? 1 : -1);
  const keyLight = pos
    .clone()
    .add(outDir.clone().multiplyScalar(0.55).add(side.multiplyScalar(1.1)).add(new Vector3(0, 0.7, 0)).normalize().multiplyScalar(600));

  let surface = bakeSurface(ctx, spec, quality.start ?? quality.size);
  const planetMat = ctx.track(
    new ShaderMaterial({
      vertexShader: planetVert,
      fragmentShader: planetFrag(kind),
      uniforms: {
        tNoise: ctx.common.tNoise,
        uTime: ctx.common.uTime,
        uA: { value: new Color(spec.a) },
        uB: { value: new Color(spec.b) },
        uLightPos: { value: keyLight },
        uSeed: { value: spec.seed },
        tAlbedo: { value: surface.albedo.texture },
        tData: { value: surface.data.texture },
        uTexel: { value: new Vector2(1 / surface.size, 2 / surface.size) },
      },
    }),
  );
  const applySurface = (next: Surface) => {
    planetMat.uniforms.tAlbedo.value = next.albedo.texture;
    planetMat.uniforms.tData.value = next.data.texture;
    (planetMat.uniforms.uTexel.value as Vector2).set(1 / next.size, 2 / next.size);
  };
  const planet = new Mesh(geo.planet, planetMat);
  planet.scale.setScalar(radius);
  planet.rotation.z = 0.25 + (kind % 3) * 0.12;
  group.add(planet);

  const atmo = new Mesh(
    geo.atmo,
    ctx.track(
      new ShaderMaterial({
        vertexShader: atmoVert,
        fragmentShader: atmoFrag,
        side: BackSide,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uColor: { value: new Color(spec.b) }, uLightPos: { value: keyLight } },
      }),
    ),
  );
  atmo.scale.setScalar(radius * 1.16);
  group.add(atmo);
  group.add(ctx.glow(spec.b, kind === 3 ? 0.3 : 0.22, radius * (kind === 3 ? 8 : 6.5)));

  let cloud: Mesh | null = null;
  if (kind === 0) {
    cloud = new Mesh(
      geo.cloud,
      ctx.track(
        new ShaderMaterial({
          vertexShader: planetVert,
          fragmentShader: cloudFrag(4),
          transparent: true,
          depthWrite: false,
          uniforms: { tNoise: ctx.common.tNoise, uTime: ctx.common.uTime, uColor: { value: new Color(spec.b) }, uLightPos: { value: keyLight }, uRadius: { value: radius * 1.025 }, uSeed: { value: spec.seed + 9.1 } },
        }),
      ),
    );
    cloud.scale.setScalar(radius * 1.025);
    group.add(cloud);
  }

  let ring: Points | null = null;
  if (kind === 1 || kind === 2) {
    const rc = DENSITY.ringDust;
    const rr = rng(100 + index + Math.floor(spec.seed * 10));
    const rp = new Float32Array(rc * 3);
    const rs = new Float32Array(rc);
    const rsd = new Float32Array(rc);
    const rcol = new Float32Array(rc * 3);
    const ca = new Color(spec.a);
    const cb = new Color(spec.b);
    const c = new Color();
    for (let k = 0; k < rc; k++) {
      const a = rr() * Math.PI * 2;
      const band = rr();
      const gap = Math.abs(band - 0.55) < 0.04 ? 0.3 : 1; // a Cassini-like division
      const d = radius * (1.55 + band * 0.95);
      rp[k * 3] = Math.cos(a) * d;
      rp[k * 3 + 1] = gauss(rr) * 0.05 * radius;
      rp[k * 3 + 2] = Math.sin(a) * d;
      rs[k] = (0.5 + rr() * 0.9) * gap;
      rsd[k] = rr();
      c.copy(ca).lerp(cb, band);
      rcol[k * 3] = c.r;
      rcol[k * 3 + 1] = c.g;
      rcol[k * 3 + 2] = c.b;
    }
    const rg = ctx.track(new BufferGeometry());
    rg.setAttribute('position', new BufferAttribute(rp, 3));
    rg.setAttribute('aSize', new BufferAttribute(rs, 1));
    rg.setAttribute('aSeed', new BufferAttribute(rsd, 1));
    rg.setAttribute('aColor', new BufferAttribute(rcol, 3));
    ring = new Points(rg, ctx.shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...ctx.common, uScale: { value: 140 } } }));
    ring.rotation.set(0.42 - (index % 2) * 0.2, 0, 0.3);
    ring.frustumCulled = false;
    group.add(ring);
  }

  let aurora: Mesh | null = null;
  if (kind === 2) {
    aurora = new Mesh(
      geo.aurora,
      ctx.shader({
        vertexShader: constructVert,
        fragmentShader: auroraFrag,
        side: 2,
        uniforms: { ...ctx.common, uColor: { value: new Color(spec.b) }, uSeed: { value: spec.seed * 1.3 } },
      }),
    );
    aurora.scale.setScalar(radius * 0.62);
    aurora.position.y = radius * 0.86;
    aurora.rotation.x = Math.PI / 2;
    group.add(aurora);
  }

  const moons: { mesh: Mesh; r: number; speed: number; phase: number; tilt: number }[] = [];
  const moonSurfaces: Surface[] = [];
  const moonCount = kind === 0 ? 2 : kind === 3 ? 1 : 0;
  for (let k = 0; k < moonCount; k++) {
    const moonSurface = bakeSurface(ctx, { a: '#9aa3b8', b: spec.a, seed: 40 + index + k, kind: 2 }, 512);
    moonSurfaces.push(moonSurface);
    const moonMat = ctx.track(
      new ShaderMaterial({
        vertexShader: planetVert,
        fragmentShader: planetFrag(2),
        uniforms: {
          tNoise: ctx.common.tNoise,
          uTime: ctx.common.uTime,
          uA: { value: new Color('#9aa3b8') },
          uB: { value: new Color(spec.a) },
          uLightPos: { value: keyLight },
          uSeed: { value: 40 + index + k },
          tAlbedo: { value: moonSurface.albedo.texture },
          tData: { value: moonSurface.data.texture },
          uTexel: { value: new Vector2(1 / 512, 2 / 512) },
        },
      }),
    );
    const mesh = new Mesh(geo.moon, moonMat);
    const mr = radius * (0.16 + k * 0.07);
    mesh.scale.setScalar(mr);
    group.add(mesh);
    moons.push({ mesh, r: radius * (2.1 + k * 0.9), speed: 0.22 - k * 0.07, phase: index + k * 2.1, tilt: 0.3 + k * 0.25 });
  }

  ctx.scene.add(group);
  const spin = 0.045 + (kind % 3) * 0.02;
  ctx.track({
    dispose() {
      surface.dispose();
      moonSurfaces.forEach((m) => m.dispose());
    },
  });
  return {
    group,
    planet,
    pos,
    radius,
    spin,
    keyLight,
    upgrade() {
      if (surface.size >= quality.size) return;
      const next = bakeSurface(ctx, spec, quality.size);
      applySurface(next);
      surface.dispose();
      surface = next;
    },
    update(dt, elapsed) {
      planet.rotation.y += dt * spin;
      if (cloud) cloud.rotation.y += dt * spin * 1.35;
      if (ring) ring.rotation.y += dt * 0.02;
      if (aurora) aurora.rotation.z += dt * 0.15;
      for (const m of moons) {
        const a = m.phase + elapsed * m.speed;
        m.mesh.position.set(Math.cos(a) * m.r, Math.sin(a) * m.r * Math.sin(m.tilt), Math.sin(a) * m.r * Math.cos(m.tilt));
      }
    },
  };
}

/* ------------------------------------------------------------ particles -- */

/** A drifting local dust field: tiny points in a box around a centre, so a
 *  moving camera has near motion parallax even between the big objects. */
export function buildDustField(ctx: WorldCtx, centre: Vector3, extent: Vector3, count: number, seed = 77): Points {
  const r = rng(seed);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const sd = new Float32Array(count);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = centre.x + (r() - 0.5) * 2 * extent.x;
    pos[i * 3 + 1] = centre.y + (r() - 0.5) * 2 * extent.y;
    pos[i * 3 + 2] = centre.z + (r() - 0.5) * 2 * extent.z;
    size[i] = 0.25 + Math.pow(r(), 4) * 1.4;
    sd[i] = r();
    const w = 0.5 + r() * 0.5;
    col[i * 3] = w;
    col[i * 3 + 1] = w;
    col[i * 3 + 2] = w * (0.9 + r() * 0.1);
  }
  const geo = ctx.track(new BufferGeometry());
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(sd, 1));
  geo.setAttribute('aColor', new BufferAttribute(col, 3));
  const pts = new Points(geo, ctx.shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...ctx.common, uScale: { value: 60 } } }));
  pts.frustumCulled = false;
  ctx.scene.add(pts);
  return pts;
}

/* --------------------------------------------------------------- comets -- */

/** A few comets crossing the far sky: a bright head and a fading tail of
 *  points, respawning on a new great-circle each time one burns out. */
export function buildComets(ctx: WorldCtx, count = DENSITY.comets) {
  const per = 30;
  const total = count * per;
  const pos = new Float32Array(total * 3);
  const size = new Float32Array(total);
  const seed = new Float32Array(total);
  const col = new Float32Array(total * 3);
  const r = rng(91);
  interface Comet {
    a: Vector3;
    d: Vector3;
    t: number;
    speed: number;
    life: number;
  }
  const comets: Comet[] = [];
  const spawn = (c: Comet) => {
    const u = r() * 2 - 1;
    const th = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const dist = 170 + r() * 170;
    c.a.set(s * Math.cos(th) * dist, u * dist * 0.45 + 12, s * Math.sin(th) * dist);
    c.d.set(r() - 0.5, (r() - 0.5) * 0.35, r() - 0.5).normalize();
    c.speed = 45 + r() * 55;
    c.life = 4 + r() * 5;
    c.t = -r() * 7;
  };
  for (let i = 0; i < count; i++) {
    const c: Comet = { a: new Vector3(), d: new Vector3(), t: 0, speed: 0, life: 1 };
    spawn(c);
    comets.push(c);
    for (let k = 0; k < per; k++) {
      const j = i * per + k;
      size[j] = 2.4 - k * 0.07;
      seed[j] = r();
      col[j * 3] = 0.85;
      col[j * 3 + 1] = 0.93;
      col[j * 3 + 2] = 1.0;
    }
  }
  const geo = ctx.track(new BufferGeometry());
  const posAttr = new BufferAttribute(pos, 3);
  posAttr.setUsage(35048); // DynamicDrawUsage
  geo.setAttribute('position', posAttr);
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geo.setAttribute('aColor', new BufferAttribute(col, 3));
  const pts = new Points(geo, ctx.shader({ vertexShader: starVert, fragmentShader: starFrag, uniforms: { ...ctx.common, uScale: { value: 260 } } }));
  pts.frustumCulled = false;
  ctx.scene.add(pts);
  const head = new Vector3();
  return {
    update(dt: number) {
      comets.forEach((c, i) => {
        c.t += dt;
        if (c.t > c.life) spawn(c);
        const alive = c.t > 0;
        head.copy(c.a).addScaledVector(c.d, c.speed * Math.max(0, c.t));
        for (let k = 0; k < per; k++) {
          const j = i * per + k;
          if (!alive) {
            pos[j * 3] = 1e5;
            pos[j * 3 + 1] = 1e5;
            pos[j * 3 + 2] = 1e5;
          } else {
            pos[j * 3] = head.x - c.d.x * k * 1.1;
            pos[j * 3 + 1] = head.y - c.d.y * k * 1.1;
            pos[j * 3 + 2] = head.z - c.d.z * k * 1.1;
          }
        }
      });
      posAttr.needsUpdate = true;
    },
  };
}
