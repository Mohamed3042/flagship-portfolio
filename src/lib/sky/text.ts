/* =====================================================================
   PARTICLE TEXT — every headline as a cloud of points in the scene.

   The DOM keeps the words (semantics, search, screen readers, the gates);
   the scene draws them. Each marked element ([data-ptext]) is measured
   word by word in the DOM (so line breaks, balance, RTL and bidi are the
   browser's own), rasterised with its computed font into a small canvas,
   and the lit pixels become points that fly together where the layout put
   the headline as it enters the viewport, then scatter as it leaves.
   Gradient runs keep their gradient. Drawn in the overlay scene, after the
   post stack, behind a dark lens.
   ===================================================================== */
import { BufferAttribute, BufferGeometry, Color, Mesh, NormalBlending, Points, ShaderMaterial, Vector3, type PerspectiveCamera } from 'three';
import { lensQuadFrag, lensQuadVert, ptextFrag, ptextVert } from './shaders';
import { clamp01, damp, rng, type WorldCtx } from './world';

export interface TextField {
  update(dt: number, elapsed: number, W: number, H: number): void;
  refresh(): void;
  dispose(): void;
}

interface WordBox {
  text: string;
  gradient: boolean;
  /** CSS px, relative to the element's own rect */
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Layout {
  words: WordBox[];
  /** the block (union of the words), relative to the element's rect */
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Glyphs {
  positions: Float32Array;
  colors: Float32Array;
  count: number;
  /** block size in CSS px */
  w: number;
  h: number;
  /** block offset from the element's rect, CSS px */
  offX: number;
  offY: number;
  stride: number;
  cssSize: number;
}

interface Item {
  el: HTMLElement;
  points: Points | null;
  mat: ShaderMaterial | null;
  lens: Mesh | null;
  lensMat: ShaderMaterial | null;
  assemble: number;
  width: number;
  blockW: number;
  blockH: number;
  offX: number;
  offY: number;
  stride: number;
  cssSize: number;
  /** +1: the next assembly arrives from the depth; -1: the next scatter streams past the viewer */
  travel: number;
}

const MAX_POINTS = 160000;
/** the glyph canvas is rasterised at this multiple of CSS pixels */
const SS = 2;
/** distance in front of the camera the text plane sits at */
const DEPTH = 7;

function isGradient(el: Element): boolean {
  const cs = getComputedStyle(el);
  return (
    el.classList.contains('gradient-text') ||
    cs.backgroundClip === 'text' ||
    (cs as CSSStyleDeclaration & { webkitBackgroundClip?: string }).webkitBackgroundClip === 'text'
  );
}

/** Wrap every word in a span for one layout read, then put the DOM back. */
function measureWords(el: HTMLElement): Layout | null {
  const restores: { parent: Node; original: Text; inserted: Node[] }[] = [];
  const spans: { span: HTMLSpanElement; text: string; gradient: boolean }[] = [];
  const gradientCache = new Map<Element, boolean>();
  const gradientOf = (node: Element): boolean => {
    let e: Element | null = node;
    while (e && e !== el.parentElement) {
      let g = gradientCache.get(e);
      if (g === undefined) {
        g = isGradient(e);
        gradientCache.set(e, g);
      }
      if (g) return true;
      e = e.parentElement;
    }
    return false;
  };
  const texts: Text[] = [];
  const walk = (node: Node): void => {
    node.childNodes.forEach((k) => {
      if (k.nodeType === Node.TEXT_NODE) {
        if ((k.textContent || '').trim()) texts.push(k as Text);
      } else if (k.nodeType === Node.ELEMENT_NODE) walk(k);
    });
  };
  walk(el);
  for (const t of texts) {
    const parent = t.parentNode;
    if (!parent) continue;
    const gradient = gradientOf(parent as Element);
    const frag = document.createDocumentFragment();
    const inserted: Node[] = [];
    for (const part of (t.textContent || '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        const ws = document.createTextNode(part);
        frag.appendChild(ws);
        inserted.push(ws);
      } else {
        const span = document.createElement('span');
        span.textContent = part;
        frag.appendChild(span);
        inserted.push(span);
        spans.push({ span, text: part, gradient });
      }
    }
    parent.replaceChild(frag, t);
    restores.push({ parent, original: t, inserted });
  }
  const base = el.getBoundingClientRect();
  const words: WordBox[] = [];
  for (const s of spans) {
    const rects = Array.from(s.span.getClientRects());
    if (!rects.length) continue;
    let r = rects[0];
    for (const c of rects) if (c.width * c.height > r.width * r.height) r = c;
    if (r.width < 0.5 || r.height < 0.5) continue;
    words.push({ text: s.text, gradient: s.gradient, x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height });
  }
  for (const { parent, original, inserted } of restores) {
    parent.insertBefore(original, inserted[0]);
    inserted.forEach((n) => (n as ChildNode).remove());
  }
  if (!words.length) return null;
  const left = Math.min(...words.map((w) => w.x));
  const top = Math.min(...words.map((w) => w.y));
  const right = Math.max(...words.map((w) => w.x + w.w));
  const bottom = Math.max(...words.map((w) => w.y + w.h));
  return { words, left, top, width: right - left, height: bottom - top };
}

function rasterise(el: HTMLElement, accents: string[]): Glyphs | null {
  const layout = measureWords(el);
  if (!layout) return null;
  const cs = getComputedStyle(el);
  const cssSize = parseFloat(cs.fontSize) || 48;
  const size = cssSize * SS;
  const weight = cs.fontWeight || '700';
  const family = cs.fontFamily || 'sans-serif';
  const spacing = (parseFloat(cs.letterSpacing) || 0) * SS;
  const color = cs.color && cs.color !== 'rgba(0, 0, 0, 0)' ? cs.color : '#ffffff';
  const PAD = 4;
  const blockW = Math.ceil(layout.width * SS) + PAD * 2;
  const blockH = Math.ceil(layout.height * SS) + PAD * 2;
  if (blockW > 4096 || blockH > 4096 || blockW < 2 || blockH < 2) return null;

  const canvas = document.createElement('canvas');
  canvas.width = blockW;
  canvas.height = blockH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = `${weight} ${size}px ${family}`;
  const c2 = ctx as CanvasRenderingContext2D & { letterSpacing?: string; direction?: string };
  if ('letterSpacing' in c2) c2.letterSpacing = `${spacing}px`;
  c2.direction = cs.direction === 'rtl' ? 'rtl' : 'ltr';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  // the inline box's top is the font's ascent above the baseline
  const probe = ctx.measureText('Hg');
  const ascent = probe.fontBoundingBoxAscent || size * 0.78;
  const descent = probe.fontBoundingBoxDescent || size * 0.22;
  for (const w of layout.words) {
    const x0 = (w.x - layout.left) * SS + PAD;
    // centre the font's own box inside the DOM inline box, whatever line-height did
    const boxTop = (w.y - layout.top) * SS + PAD;
    const y = boxTop + (w.h * SS - (ascent + descent)) / 2 + ascent;
    if (w.gradient) {
      const g = ctx.createLinearGradient(x0, 0, x0 + w.w * SS, 0);
      accents.forEach((c, i) => g.addColorStop(accents.length > 1 ? i / (accents.length - 1) : 0, c));
      ctx.fillStyle = g;
    } else ctx.fillStyle = color;
    ctx.fillText(w.text, x0, y);
  }

  const img = ctx.getImageData(0, 0, blockW, blockH).data;
  // sampling follows the type size: a 40px heading gets a point every CSS
  // pixel, a display headline every three, so strokes always carry several
  // points across; the cap only widens it for a wall of text
  let stride = Math.max(1, Math.round(Math.min(3, Math.max(1, cssSize / 40)) * SS));
  let count = 0;
  for (;;) {
    count = 0;
    for (let y = 0; y < blockH; y += stride) for (let x = 0; x < blockW; x += stride) if (img[(y * blockW + x) * 4 + 3] > 96) count++;
    if (count <= MAX_POINTS || stride >= 12) break;
    stride++;
  }
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const r = rng(count + blockW);
  let k = 0;
  for (let y = 0; y < blockH; y += stride) {
    for (let x = 0; x < blockW; x += stride) {
      const i = (y * blockW + x) * 4;
      if (img[i + 3] <= 96) continue;
      // positions in CSS px, a quarter-stride jitter so letters stay letters
      positions[k * 3] = (x - blockW / 2 + (r() - 0.5) * 0.5 * stride) / SS;
      positions[k * 3 + 1] = (blockH / 2 - y + (r() - 0.5) * 0.5 * stride) / SS;
      positions[k * 3 + 2] = (r() - 0.5) * 1.2;
      colors[k * 3] = img[i] / 255;
      colors[k * 3 + 1] = img[i + 1] / 255;
      colors[k * 3 + 2] = img[i + 2] / 255;
      k++;
    }
  }
  return {
    positions,
    colors,
    count,
    w: blockW / SS,
    h: blockH / SS,
    offX: layout.left - PAD / SS,
    offY: layout.top - PAD / SS,
    stride: stride / SS,
    cssSize,
  };
}

export function createTextField(world: WorldCtx, camera: PerspectiveCamera, els: HTMLElement[], accents: string[]): TextField {
  const items: Item[] = els.map((el) => ({
    el,
    points: null,
    mat: null,
    lens: null,
    lensMat: null,
    assemble: 0,
    width: 0,
    blockW: 0,
    blockH: 0,
    offX: 0,
    offY: 0,
    stride: 1,
    cssSize: 48,
    travel: 1,
  }));
  const tmp = new Vector3();
  const dir = new Vector3();
  const right = new Vector3();
  const up = new Vector3();
  const fwd = new Vector3();

  const build = (it: Item) => {
    if (it.points) {
      world.overlay.remove(it.points);
      it.points.geometry.dispose();
      it.mat?.dispose();
      it.points = null;
      it.mat = null;
    }
    const g = rasterise(it.el, accents);
    if (!g || !g.count) return;
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(g.positions, 3));
    geo.setAttribute('aColor', new BufferAttribute(g.colors, 3));
    const seeds = new Float32Array(g.count);
    const scatter = new Float32Array(g.count * 3);
    const r = rng(g.count * 7 + 3);
    const reach = Math.max(g.w, g.h) * 1.6;
    for (let i = 0; i < g.count; i++) {
      seeds[i] = r();
      // scatter cloud: a shell around the headline, biased outward
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const d = reach * (0.5 + r() * 0.8);
      scatter[i * 3] = s * Math.cos(th) * d;
      scatter[i * 3 + 1] = u * d * 0.6;
      scatter[i * 3 + 2] = s * Math.sin(th) * d * 0.35;
    }
    geo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    geo.setAttribute('aScatter', new BufferAttribute(scatter, 3));
    const mat = world.shader({
      vertexShader: ptextVert,
      fragmentShader: ptextFrag,
      depthTest: false,
      uniforms: {
        ...world.common,
        uAssemble: { value: 0 },
        uScale: { value: 1 },
        uOrigin: { value: new Vector3() },
        uRight: { value: new Vector3(1, 0, 0) },
        uUp: { value: new Vector3(0, 1, 0) },
        uFwd: { value: new Vector3(0, 0, -1) },
        uSize: { value: 2.4 },
        uAlpha: { value: 1 },
        uTravel: { value: 26 },
      },
    });
    const pts = new Points(geo, mat);
    pts.frustumCulled = false;
    pts.renderOrder = 20;
    pts.visible = false;
    world.overlay.add(pts);
    it.points = pts;
    it.mat = mat;
    if (!it.lens) {
      const lensMat = world.shader(
        {
          vertexShader: lensQuadVert,
          fragmentShader: lensQuadFrag,
          depthTest: false,
          blending: NormalBlending,
          uniforms: {
            uOrigin: { value: new Vector3() },
            uRight: { value: new Vector3(1, 0, 0) },
            uUp: { value: new Vector3(0, 1, 0) },
            uW: { value: 1 },
            uH: { value: 1 },
            uColor: { value: new Color(world.pal.top) },
            uOpacity: { value: 0 },
          },
        },
        false,
      );
      const lens = new Mesh(world.quad, lensMat);
      lens.frustumCulled = false;
      lens.renderOrder = 19;
      lens.visible = false;
      world.overlay.add(lens);
      it.lens = lens;
      it.lensMat = lensMat;
    }
    it.width = it.el.clientWidth;
    it.blockW = g.w;
    it.blockH = g.h;
    it.offX = g.offX;
    it.offY = g.offY;
    it.stride = g.stride;
    it.cssSize = g.cssSize;
  };

  const ready = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ?? Promise.resolve();
  let built = false;
  ready.then(() => {
    items.forEach(build);
    built = true;
  });

  return {
    refresh() {
      if (built) items.forEach(build);
    },
    update(dt, elapsed, W, H) {
      if (!built) return;
      camera.updateMatrixWorld();
      right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
      up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
      fwd.setFromMatrixColumn(camera.matrixWorld, 2).normalize().multiplyScalar(-1);
      // world units per CSS pixel on a plane DEPTH in front of the camera
      const wpp = (2 * DEPTH * Math.tan((camera.fov * Math.PI) / 360)) / H;
      for (const it of items) {
        if (!it.points || !it.mat) continue;
        if (Math.abs(it.el.clientWidth - it.width) > it.width * 0.08) build(it);
        if (!it.points || !it.mat) continue;
        const rect = it.el.getBoundingClientRect();
        const onScreen = rect.bottom > -H * 0.6 && rect.top < H * 1.6;
        const cy = rect.top + rect.height / 2;
        // a gate line assembles only while its gate is the one being passed
        const gate = it.el.closest<HTMLElement>('[data-build-item]');
        const gated = gate ? gate.dataset.state === 'active' : true;
        const inView = gated ? 1 - clamp01((Math.abs(cy - H / 2) - H * 0.34) / (H * 0.22)) : 0;
        const want = onScreen ? inView : 0;
        // latch the travel direction at the ends of the move, never mid-flight
        if (it.assemble < 0.02) it.travel = 1;
        else if (it.assemble > 0.98) it.travel = -1;
        it.assemble = damp(it.assemble, want, gated ? 3.2 : 4.5, dt);
        const visible = onScreen && it.assemble > 0.004;
        it.points.visible = visible;
        if (it.lens) it.lens.visible = visible;
        if (!visible) continue;
        // the block sits exactly where the DOM laid the words
        const bx = rect.left + it.offX;
        const by = rect.top + it.offY;
        const ndcX = ((bx + it.blockW / 2) / W) * 2 - 1;
        const ndcY = -(((by + it.blockH / 2) / H) * 2 - 1);
        tmp.set(ndcX, ndcY, 0.5).unproject(camera);
        dir.copy(tmp).sub(camera.position).normalize();
        // the plane is DEPTH along the view axis, not along the ray
        const along = DEPTH / Math.max(0.2, dir.dot(fwd));
        const u = it.mat.uniforms;
        (u.uOrigin.value as Vector3).copy(camera.position).addScaledVector(dir, along);
        (u.uRight.value as Vector3).copy(right);
        (u.uUp.value as Vector3).copy(up);
        (u.uFwd.value as Vector3).copy(fwd);
        u.uScale.value = wpp;
        u.uAssemble.value = it.assemble;
        u.uTravel.value = it.travel > 0 ? 26 : -9;
        if (it.lensMat) {
          const l = it.lensMat.uniforms;
          (l.uOrigin.value as Vector3).copy(u.uOrigin.value as Vector3).addScaledVector(fwd, 0.4);
          (l.uRight.value as Vector3).copy(right);
          (l.uUp.value as Vector3).copy(up);
          l.uW.value = it.blockW * wpp * 1.9;
          l.uH.value = it.blockH * wpp * 2.6;
          (l.uColor.value as Color).set(world.pal.top);
          l.uOpacity.value = 0.86 * clamp01(it.assemble * 1.4);
        }
        // points just overlap their stride: solid strokes, no smear under bloom
        u.uSize.value = Math.max(1.6, it.stride * 1.8);
        u.uAlpha.value = clamp01(it.assemble * 1.6);
      }
    },
    dispose() {
      for (const it of items) {
        if (it.points) {
          world.overlay.remove(it.points);
          it.points.geometry.dispose();
          it.mat?.dispose();
        }
        if (it.lens) world.overlay.remove(it.lens);
      }
      items.length = 0;
    },
  };
}
