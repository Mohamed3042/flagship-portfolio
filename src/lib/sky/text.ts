/* =====================================================================
   PARTICLE TEXT — every headline as a cloud of points in the scene.

   The DOM keeps the words (semantics, search, screen readers, the gates);
   the scene draws them. Each marked element ([data-ptext]) is rasterised
   with its own computed font into a small canvas, the lit pixels become
   points, and those points fly together where the layout put the headline
   as it enters the viewport, then scatter as it leaves. Gradient runs keep
   their gradient; Arabic shapes through the browser's own text engine.
   ===================================================================== */
import { BufferAttribute, BufferGeometry, Color, Mesh, NormalBlending, Points, ShaderMaterial, Vector3, type PerspectiveCamera } from 'three';
import { lensQuadFrag, lensQuadVert, ptextFrag, ptextVert } from './shaders';
import { clamp01, damp, rng, type WorldCtx } from './world';

export interface TextField {
  update(dt: number, elapsed: number, W: number, H: number): void;
  refresh(): void;
  dispose(): void;
}

interface Run {
  text: string;
  gradient: boolean;
}

interface Glyphs {
  positions: Float32Array;
  colors: Float32Array;
  count: number;
  /** canvas block size in CSS px */
  w: number;
  h: number;
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
  align: 'start' | 'end' | 'center';
  rtl: boolean;
  blockW: number;
  blockH: number;
  stride: number;
  cssSize: number;
}

const MAX_POINTS = 160000;
/** the glyph canvas is rasterised at this multiple of CSS pixels */
const SS = 2;
/** distance in front of the camera the text plane sits at */
const DEPTH = 7;

function isBlock(el: Element): boolean {
  const d = getComputedStyle(el).display;
  return d === 'block' || d === 'flex' || d === 'grid' || d === 'list-item';
}

function isGradient(el: Element): boolean {
  const cs = getComputedStyle(el);
  return el.classList.contains('gradient-text') || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || cs.backgroundClip === 'text' || (cs as CSSStyleDeclaration & { webkitBackgroundClip?: string }).webkitBackgroundClip === 'text';
}

/** Runs of text with explicit breaks, in reading order. */
function collect(el: HTMLElement): (Run | 'br')[] {
  const out: (Run | 'br')[] = [];
  const walk = (node: Node, gradient: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent || '').replace(/\s+/g, ' ');
      if (t.trim()) out.push({ text: t, gradient });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const e = node as HTMLElement;
    if (e.tagName === 'BR') {
      out.push('br');
      return;
    }
    const block = isBlock(e) && e !== el;
    if (block && out.length && out[out.length - 1] !== 'br') out.push('br');
    const g = gradient || isGradient(e);
    e.childNodes.forEach((c) => walk(c, g));
    if (block) out.push('br');
  };
  el.childNodes.forEach((c) => walk(c, isGradient(el)));
  while (out.length && out[out.length - 1] === 'br') out.pop();
  return out;
}

function rasterise(el: HTMLElement, accents: string[]): Glyphs | null {
  const cs = getComputedStyle(el);
  const cssSize = parseFloat(cs.fontSize) || 48;
  const size = cssSize * SS;
  const lineHeight = (parseFloat(cs.lineHeight) || cssSize * 1.1) * SS;
  const weight = cs.fontWeight || '700';
  const family = cs.fontFamily || 'sans-serif';
  const spacing = (parseFloat(cs.letterSpacing) || 0) * SS;
  const rtl = cs.direction === 'rtl';
  const maxW = Math.max(40, el.clientWidth || el.getBoundingClientRect().width) * SS;
  const color = cs.color && cs.color !== 'rgba(0, 0, 0, 0)' ? cs.color : '#ffffff';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const font = `${weight} ${size}px ${family}`;
  ctx.font = font;
  const c2 = ctx as CanvasRenderingContext2D & { letterSpacing?: string; direction?: string };
  if ('letterSpacing' in c2) c2.letterSpacing = `${spacing}px`;
  c2.direction = rtl ? 'rtl' : 'ltr';

  // wrap words to the element's width, keeping each word's gradient flag
  type Word = { text: string; gradient: boolean; w: number };
  const lines: Word[][] = [[]];
  const space = ctx.measureText(' ').width;
  let lineW = 0;
  for (const run of collect(el)) {
    if (run === 'br') {
      lines.push([]);
      lineW = 0;
      continue;
    }
    for (const word of run.text.split(' ')) {
      if (!word) continue;
      const w = ctx.measureText(word).width;
      const cur = lines[lines.length - 1];
      const need = cur.length ? lineW + space + w : w;
      if (cur.length && need > maxW) {
        lines.push([{ text: word, gradient: run.gradient, w }]);
        lineW = w;
      } else {
        cur.push({ text: word, gradient: run.gradient, w });
        lineW = need;
      }
    }
  }
  const widths = lines.map((ws) => ws.reduce((a, w, i) => a + w.w + (i ? space : 0), 0));
  const blockW = Math.ceil(Math.max(1, ...widths)) + 8;
  const blockH = Math.ceil(lines.length * lineHeight) + 8;
  if (blockW > 4096 || blockH > 4096) return null;
  canvas.width = blockW;
  canvas.height = blockH;
  ctx.font = font;
  if ('letterSpacing' in c2) c2.letterSpacing = `${spacing}px`;
  c2.direction = rtl ? 'rtl' : 'ltr';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const ascent = size * 0.78;
  lines.forEach((ws, li) => {
    const y = 4 + li * lineHeight + (lineHeight - size) / 2 + ascent;
    let x = rtl ? blockW - 4 : 4;
    ws.forEach((w, i) => {
      if (i && rtl) x -= space;
      else if (i) x += space;
      const x0 = rtl ? x - w.w : x;
      if (w.gradient) {
        const g = ctx.createLinearGradient(x0, 0, x0 + w.w, 0);
        accents.forEach((c, i) => g.addColorStop(accents.length > 1 ? i / (accents.length - 1) : 0, c));
        ctx.fillStyle = g;
      } else ctx.fillStyle = color;
      ctx.fillText(w.text, x0, y);
      if (rtl) x -= w.w;
      else x += w.w;
    });
  });

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
  return { positions, colors, count, w: blockW / SS, h: blockH / SS, stride: stride / SS, cssSize };
}

export function createTextField(world: WorldCtx, camera: PerspectiveCamera, els: HTMLElement[], accents: string[]): TextField {
  const items: Item[] = els.map((el) => {
    const cs = getComputedStyle(el);
    const rtl = cs.direction === 'rtl';
    const ta = cs.textAlign;
    const align: Item['align'] = ta === 'center' ? 'center' : ta === 'right' ? (rtl ? 'start' : 'end') : ta === 'left' ? (rtl ? 'end' : 'start') : ta === 'end' ? 'end' : 'start';
    return { el, points: null, mat: null, lens: null, lensMat: null, assemble: 0, width: 0, align, rtl, blockW: 0, blockH: 0, stride: 1, cssSize: 48 };
  });
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
        const inView = 1 - clamp01((Math.abs(cy - H / 2) - H * 0.34) / (H * 0.22));
        it.assemble = damp(it.assemble, onScreen ? inView : 0, 3.2, dt);
        const visible = onScreen && it.assemble > 0.004;
        it.points.visible = visible;
        if (it.lens) it.lens.visible = visible;
        if (!visible) continue;
        // where the rasterised block sits inside the element's box
        let bx = rect.left + (rect.width - it.blockW) / 2;
        if (it.align === 'start') bx = it.rtl ? rect.right - it.blockW : rect.left;
        else if (it.align === 'end') bx = it.rtl ? rect.left : rect.right - it.blockW;
        const by = rect.top;
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
        // points just overlap their stride: solid strokes, no smear under bloom;
        // small headings run a little dimmer so the glow does not close their counters
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
