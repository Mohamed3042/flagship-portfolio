/* =====================================================================
   ONE SKY — page wiring.

   Three jobs, in order of importance:
   1. The depth driver (no WebGL needed): writes --p / --f on the beats and
      station layers so the typography and screenshot stacks parallax on
      every device, including ones the 3D never reaches.
   2. The sky map controls: filters, live count, #lab / #foundation deep links.
   3. The WebGL scene: capability-gated (never tiered), loaded after first
      paint, torn down before Astro swaps the page.
   ===================================================================== */
import type { SkyData, SkyEngine, StarGroup } from './engine';

const GROUPS = ['all', 'public', 'automation', 'lab', 'foundation'] as const;
type Filter = (typeof GROUPS)[number];

let teardown: (() => void) | null = null;

/** The only gate: a browser that cannot draw the scene at all keeps the CSS
 *  sky. There is no low tier: phones render the identical scene at native
 *  resolution (the owner's rule). `?sky=off` / `?sky=force` exist for tests. */
export function skyCapable(): boolean {
  const q = new URLSearchParams(location.search).get('sky');
  if (q === 'off') return false;
  const force = q === 'force';
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData && !force) return false;
  try {
    const probe = document.createElement('canvas');
    const gl = (probe.getContext('webgl2') || probe.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    // Software rasterisers cannot hold a frame here; the CSS sky is kinder.
    if (/swiftshader|llvmpipe|software/i.test(name) && !force) return false;
  } catch {
    return false;
  }
  return true;
}

export function bootSky(): void {
  teardown?.();
  teardown = null;

  const canvas = document.querySelector<HTMLCanvasElement>('[data-sky]');
  const dataNode = document.getElementById('sky-data');
  if (!canvas || !dataNode) return;
  const data = JSON.parse(dataNode.textContent || '{}') as SkyData;
  const root = document.documentElement;
  const rtl = root.getAttribute('dir') === 'rtl';

  /* ---- 1. depth driver ---- */
  const depthEls = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'));
  const beatEls = Array.from(document.querySelectorAll<HTMLElement>('[data-beat]'));
  let ticking = false;
  const drive = () => {
    ticking = false;
    const vh = window.innerHeight || 1;
    for (const el of depthEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--p', Math.max(-1.4, Math.min(1.4, p)).toFixed(3));
    }
    for (const el of beatEls) {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.62);
      el.style.setProperty('--f', Math.max(0, 1 - d).toFixed(3));
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(drive);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  drive();

  /* ---- 2. sky map controls ---- */
  let engine: SkyEngine | null = null;
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sky-filter]'));
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-sky-item]'));
  const count = document.querySelector<HTMLElement>('[data-sky-count]');
  const countTemplate = count?.dataset.template || '{n}';
  const applyFilter = (f: Filter) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.skyFilter === f)));
    let shown = 0;
    items.forEach((it) => {
      const on = f === 'all' || it.dataset.group === f;
      it.hidden = !on;
      if (on) shown++;
    });
    if (count) count.textContent = countTemplate.replace('{n}', String(shown));
    engine?.filter(f as StarGroup | 'all');
    onScroll();
  };
  const onFilterClick = (e: Event) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-sky-filter]');
    if (b) applyFilter((b.dataset.skyFilter as Filter) || 'all');
  };
  document.addEventListener('click', onFilterClick);
  const fromHash = () => {
    const h = location.hash.slice(1);
    if (h === 'lab' || h === 'foundation') applyFilter(h);
  };
  fromHash();
  window.addEventListener('hashchange', fromHash);

  const hover = (e: Event) => {
    const it = (e.target as HTMLElement).closest<HTMLElement>('[data-sky-item]');
    engine?.highlight(it?.dataset.slug ?? null);
  };
  const unhover = (e: Event) => {
    const it = (e.target as HTMLElement).closest<HTMLElement>('[data-sky-item]');
    if (it) engine?.highlight(null);
  };
  document.addEventListener('pointerover', hover);
  document.addEventListener('focusin', hover);
  document.addEventListener('pointerout', unhover);
  document.addEventListener('focusout', unhover);

  // Stars in the empty half of the map are clickable on a mouse.
  let picked: { slug: string; href: string } | null = null;
  const map = document.querySelector<HTMLElement>('[data-sky-stop="map"]');
  const onMove = (e: PointerEvent) => {
    if (!engine || e.pointerType !== 'mouse') return;
    const target = e.target as HTMLElement;
    const overUi = !!target.closest('a,button,input,[data-sky-item],[data-sky-intro]');
    const hit = overUi ? null : engine.pick(e.clientX, e.clientY);
    if (hit?.slug !== picked?.slug) {
      picked = hit;
      engine.highlight(hit?.slug ?? null);
      map?.toggleAttribute('data-picking', !!hit);
    }
  };
  const onClick = (e: MouseEvent) => {
    if (!picked || (e.target as HTMLElement).closest('a,button,input')) return;
    location.href = picked.href;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('click', onClick);

  /* ---- 3. WebGL ---- */
  let cancelled = false;
  const onTheme = () => engine?.retheme();
  document.addEventListener('mm:themechange', onTheme);
  if (skyCapable()) {
    const start = () => {
      if (cancelled) return;
      import('./engine')
        .then(({ mountSky }) => mountSky(canvas, data, { rtl, tag: document.querySelector('[data-sky-tag]') }))
        .then((e) => {
          if (cancelled) {
            e.dispose();
            return;
          }
          engine = e;
          const active = buttons.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.skyFilter as Filter | undefined;
          if (active) e.filter(active as StarGroup | 'all');
          root.classList.add('sky-live');
        })
        .catch((err) => console.warn('[sky] staying on the CSS sky:', err));
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
    if (idle) idle(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }

  teardown = () => {
    cancelled = true;
    engine?.dispose();
    engine = null;
    root.classList.remove('sky-live');
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    window.removeEventListener('hashchange', fromHash);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('click', onClick);
    document.removeEventListener('click', onFilterClick);
    document.removeEventListener('pointerover', hover);
    document.removeEventListener('focusin', hover);
    document.removeEventListener('pointerout', unhover);
    document.removeEventListener('focusout', unhover);
    document.removeEventListener('mm:themechange', onTheme);
  };
}

export function stopSky(): void {
  teardown?.();
  teardown = null;
}
