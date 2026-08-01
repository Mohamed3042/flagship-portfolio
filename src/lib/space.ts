/* =====================================================================
   COSMIC KEYNOTE — global space layer (fixed #space canvas behind the site).
   dark/light: the original layered-parallax starfield (behavior frozen).
   Theme packs re-skin the layer with their own particle identity:
     · neon      — grid lines + scanlines (pre-rendered pattern) + blinking
                   green/magenta signal dots
     · cinema    — warm dust motes rising through the projector dark
     · storybook — gold/cream/lilac sparkles (10% four-point stars)
     · wave      — a bottom waveform field that amplifies with scroll velocity
   Theme-aware via lib/theme + the --star token; reduced-motion paints one
   static frame and never loops; pauses on tab-hidden; safe to re-init after
   an Astro View Transition (cancels the prior loop + listeners). Rebuilds its
   particle set on mm:themechange. Single rAF, DPR<=2.
   The nebula bloom lives in the CSS body background; this canvas draws only
   the particle layer.
   ===================================================================== */
import { activeWorld, type WorldName } from './theme';

type Star = { x: number; y: number; r: number; tw: number };
type LayerSpec = { n: number; sp: number; r: [number, number]; a: number };
type Layer = LayerSpec & { stars: Star[] };
type Dot = { x: number; y: number; ph: number; f: number; m: boolean };
type Mote = { x: number; y: number; r: number; T: number; ph: number; a: number };
type Spark = { x: number; y: number; r: number; col: string; ph: number; f: number; star: boolean };

type Mode = 'stars' | 'neon' | 'cinema' | 'storybook' | 'wave' | 'tactical' | 'titanium' | 'galaxy';

let raf: number | null = null;
let cleanup: (() => void) | null = null;

export function initSpace(): void {
  // Tear down any loop/listeners from a previous page before re-binding.
  cleanup?.();

  const c = document.getElementById('space') as HTMLCanvasElement | null;
  if (!c) return;
  const x = c.getContext('2d');
  if (!x) return;

  const REDUCE =
    !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);
  let W = 0, H = 0, DPR = 1, t0: number | null = null;
  let mode: Mode = 'stars';
  let layers: Layer[] = [];
  let dots: Dot[] = [];
  let motes: Mote[] = [];
  let sparks: Spark[] = [];
  let pat: HTMLCanvasElement | null = null; // neon grid+scanline pattern
  let lastSc = 0, vel = 0; // wave scroll-velocity state

  const SPECS: LayerSpec[] = [
    { n: 90, sp: 0.15, r: [0.4, 1.0], a: 0.5 },
    { n: 60, sp: 0.35, r: [0.6, 1.4], a: 0.7 },
    { n: 26, sp: 0.6, r: [0.9, 2.0], a: 0.95 },
  ];

  function computeMode(): void {
    const modes: Record<WorldName, Mode> = {
      astronomy: 'stars',
      razer: 'neon',
      disney: 'storybook',
      cod: 'tactical',
      netflix: 'cinema',
      spotify: 'wave',
      apple: 'titanium',
      samsung: 'galaxy',
    };
    mode = modes[activeWorld()];
  }

  function build(): void {
    computeMode();
    layers = []; dots = []; motes = []; sparks = [];
    if (mode === 'stars' || mode === 'galaxy') {
      layers = SPECS.map((L) => {
        const stars: Star[] = [];
        for (let i = 0; i < L.n; i++) {
          stars.push({
            x: Math.random(),
            y: Math.random(),
            r: L.r[0] + Math.random() * (L.r[1] - L.r[0]),
            tw: Math.random() * 6.283,
          });
        }
        return { ...L, stars };
      });
    } else if (mode === 'neon') {
      for (let i = 0; i < 16; i++) {
        dots.push({ x: Math.random(), y: Math.random(), ph: Math.random() * 6.283, f: 0.4 + Math.random() * 1.1, m: i % 3 === 0 });
      }
    } else if (mode === 'cinema' || mode === 'titanium') {
      for (let i = 0; i < 54; i++) {
        motes.push({ x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 0.8, T: 12000 + Math.random() * 8000, ph: Math.random() * 6.283, a: 0.3 + Math.random() * 0.2 });
      }
    } else if (mode === 'storybook') {
      const cols = ['#ffd98e', '#f6f1e7', '#a99bf0'];
      for (let i = 0; i < 70; i++) {
        sparks.push({ x: Math.random(), y: Math.random(), r: 0.9 + Math.random() * 1.3, col: cols[i % 3], ph: Math.random() * 6.283, f: 0.5 + Math.random(), star: i % 10 === 0 });
      }
    }
    // wave has no particle state — bars are computed per frame
  }

  /** Neon: pre-render the 48px grid + 1-on-3 scanlines once per resize/theme. */
  function buildPattern(): void {
    if (mode !== 'neon') { pat = null; return; }
    pat = document.createElement('canvas');
    pat.width = Math.max(1, Math.round(W * DPR));
    pat.height = Math.max(1, Math.round((H + 48) * DPR));
    const p = pat.getContext('2d');
    if (!p) { pat = null; return; }
    const cell = 48 * DPR;
    p.strokeStyle = 'rgba(0,255,128,.07)';
    p.lineWidth = 1;
    for (let gx = 0; gx <= pat.width; gx += cell) { p.beginPath(); p.moveTo(gx + 0.5, 0); p.lineTo(gx + 0.5, pat.height); p.stroke(); }
    for (let gy = 0; gy <= pat.height; gy += cell) { p.beginPath(); p.moveTo(0, gy + 0.5); p.lineTo(pat.width, gy + 0.5); p.stroke(); }
    p.fillStyle = 'rgba(255,255,255,.028)';
    const step = 3 * DPR;
    for (let sy = 0; sy < pat.height; sy += step) p.fillRect(0, sy, pat.width, Math.max(1, Math.round(DPR)));
  }

  function resize(): void {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    c!.width = Math.round(W * DPR);
    c!.height = Math.round(H * DPR);
    buildPattern();
    if (REDUCE) draw(0);
  }

  function starColor(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--star').trim() || '#fff';
  }

  function drawStars(ms: number): void {
    const k = starColor();
    const sc = window.scrollY || 0;
    x!.fillStyle = k;
    for (const L of layers) {
      for (const s of L.stars) {
        const px = s.x * W;
        let py = (s.y * H - sc * L.sp) % H;
        if (py < 0) py += H;
        const tw = REDUCE ? 1 : 0.55 + 0.45 * Math.sin(ms / 600 + s.tw);
        x!.globalAlpha = L.a * tw;
        x!.beginPath();
        x!.arc(px * DPR, py * DPR, s.r * DPR, 0, 6.2832);
        x!.fill();
      }
    }
  }

  function drawNeon(ms: number): void {
    // grid + scanlines drift slowly downward (pattern is one cell taller)
    if (pat) {
      const off = REDUCE ? 0 : ((ms * 0.006) % 48) * DPR;
      x!.drawImage(pat, 0, off - 48 * DPR);
    }
    // blinking signal dots — green with magenta counter-signals
    for (const d of dots) {
      const s = REDUCE ? 0.7 : Math.max(0, Math.sin(ms / 1000 * d.f + d.ph));
      const a = 0.12 + 0.7 * s * s;
      const col = d.m ? '255,61,242' : '0,255,128';
      x!.shadowColor = 'rgb(' + col + ')';
      x!.shadowBlur = 14 * DPR;
      x!.globalAlpha = a;
      x!.fillStyle = 'rgb(' + col + ')';
      x!.beginPath();
      x!.arc(d.x * W * DPR, d.y * H * DPR, 3 * DPR, 0, 6.2832);
      x!.fill();
    }
    x!.shadowBlur = 0;
  }

  function drawCinema(ms: number): void {
    // warm dust motes rising through the dark, gentle flicker
    for (const m of motes) {
      let py = (m.y - (REDUCE ? 0 : ms / m.T)) % 1;
      if (py < 0) py += 1;
      const sway = REDUCE ? 0 : Math.sin(ms / 4000 + m.ph) * 0.012;
      const a = m.a * (0.75 + 0.25 * Math.sin(ms / 700 + m.ph));
      x!.globalAlpha = Math.max(0.05, a);
      x!.fillStyle = 'rgb(255,240,220)';
      x!.beginPath();
      x!.arc((m.x + sway) * W * DPR, py * H * DPR, m.r * DPR, 0, 6.2832);
      x!.fill();
    }
  }

  function drawStorybook(ms: number): void {
    const sc = window.scrollY || 0;
    for (const s of sparks) {
      const px = (s.x + (REDUCE ? 0 : Math.sin(ms / 1300 * s.f + s.ph) * 0.012)) * W;
      let py = (s.y * H - sc * 0.05) % H;
      if (py < 0) py += H;
      const tw = REDUCE ? 0.8 : 0.3 + 0.7 * Math.abs(Math.sin(ms / 1400 * s.f + s.ph));
      x!.globalAlpha = tw;
      x!.shadowColor = s.col;
      x!.shadowBlur = 10 * DPR;
      x!.fillStyle = s.col;
      x!.beginPath();
      x!.arc(px * DPR, py * DPR, s.r * DPR, 0, 6.2832);
      x!.fill();
      if (s.star) {
        // four-point twinkle: a slim cross that scales with the twinkle
        const L = s.r * 4 * tw * DPR;
        x!.globalAlpha = tw * 0.8;
        x!.fillRect(px * DPR - L, py * DPR - 0.5 * DPR, L * 2, DPR);
        x!.fillRect(px * DPR - 0.5 * DPR, py * DPR - L, DPR, L * 2);
      }
    }
    x!.shadowBlur = 0;
  }

  function drawWave(ms: number): void {
    // bottom waveform field — duotone green→violet, amplified by scroll velocity
    const sc = window.scrollY || 0;
    const dv = Math.abs(sc - lastSc);
    lastSc = sc;
    vel = REDUCE ? 0 : Math.max(vel * 0.93, Math.min(dv, 80));
    const N = 56;
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    const bw = (W * DPR) / N;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const k = rtl ? 1 - t : t;
      const r = Math.round(25 + (138 - 25) * k);
      const g = Math.round(212 + (92 - 212) * k);
      const b = Math.round(106 + (255 - 106) * k);
      const n = REDUCE
        ? 0.5
        : 0.5 + 0.5 * Math.sin(ms / 640 + i * 0.37) * (0.55 + 0.45 * Math.sin(ms / 1900 - i * 0.11));
      const h = H * DPR * (0.03 + 0.09 * n + (vel / 80) * 0.12);
      x!.globalAlpha = 0.34;
      x!.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      x!.fillRect(i * bw + bw * 0.25, H * DPR - h, bw * 0.5, h);
    }
  }

  function drawTactical(ms: number): void {
    const unit = 56 * DPR;
    const drift = REDUCE ? 0 : ((ms * 0.01) % 56) * DPR;
    x!.strokeStyle = 'rgba(154,174,91,.10)';
    x!.lineWidth = 1;
    for (let gx = -unit + drift; gx < W * DPR + unit; gx += unit) {
      x!.beginPath(); x!.moveTo(gx, 0); x!.lineTo(gx, H * DPR); x!.stroke();
    }
    for (let gy = -unit + drift; gy < H * DPR + unit; gy += unit) {
      x!.beginPath(); x!.moveTo(0, gy); x!.lineTo(W * DPR, gy); x!.stroke();
    }
    const cx = W * DPR * .78, cy = H * DPR * .58, radius = Math.min(W, H) * DPR * .25;
    x!.strokeStyle = 'rgba(255,122,0,.18)';
    [1, .66, .33].forEach((k) => { x!.beginPath(); x!.arc(cx, cy, radius * k, 0, Math.PI * 2); x!.stroke(); });
    const angle = REDUCE ? -.7 : ms / 1900;
    x!.beginPath(); x!.moveTo(cx, cy); x!.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius); x!.stroke();
    for (let i = 0; i < 9; i++) {
      const a = i * 2.39, rr = radius * (.18 + ((i * 37) % 70) / 100);
      x!.globalAlpha = .25 + .55 * Math.max(0, Math.sin(ms / 800 + i));
      x!.fillStyle = i % 3 ? '#9baa24' : '#ff7a00';
      x!.fillRect(cx + Math.cos(a) * rr - DPR, cy + Math.sin(a) * rr - DPR, 3 * DPR, 3 * DPR);
    }
  }

  function drawTitanium(ms: number): void {
    const cx = W * DPR * .52, cy = H * DPR * .46;
    const max = Math.min(W, H) * DPR;
    x!.lineWidth = DPR;
    for (let i = 0; i < 5; i++) {
      const r = max * (.16 + i * .075);
      const phase = REDUCE ? 0 : ms / (3600 + i * 540);
      const g = x!.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      g.addColorStop(0, 'rgba(255,255,255,.03)');
      g.addColorStop(.48, 'rgba(220,229,240,.22)');
      g.addColorStop(.55, 'rgba(127,185,255,.14)');
      g.addColorStop(1, 'rgba(255,255,255,.02)');
      x!.strokeStyle = g;
      x!.beginPath(); x!.ellipse(cx, cy, r, r * .42, -.16 + phase * .03, phase, phase + Math.PI * 1.52); x!.stroke();
    }
    for (const m of motes) {
      const py = ((m.y + (REDUCE ? 0 : ms / m.T * .12)) % 1) * H * DPR;
      x!.globalAlpha = .08 + m.a * .2;
      x!.fillStyle = '#e6edf7';
      x!.fillRect(m.x * W * DPR, py, Math.max(DPR, m.r * DPR * .65), Math.max(DPR, m.r * DPR * .65));
    }
  }

  function drawGalaxy(ms: number): void {
    drawStars(ms * .58);
    const cx = W * DPR * .55, cy = H * DPR * .48;
    const max = Math.min(W, H) * DPR;
    x!.lineWidth = DPR;
    for (let i = 0; i < 4; i++) {
      const phase = REDUCE ? i * .55 : ms / (4200 + i * 700) + i * .7;
      const rx = max * (.22 + i * .07), ry = rx * (.27 + i * .025);
      x!.strokeStyle = i % 2 ? 'rgba(18,182,255,.18)' : 'rgba(53,98,255,.2)';
      x!.beginPath(); x!.ellipse(cx, cy, rx, ry, -.24 + i * .08, 0, Math.PI * 2); x!.stroke();
      x!.globalAlpha = .75;
      x!.fillStyle = i % 2 ? '#67e4ff' : '#6184ff';
      x!.beginPath();
      x!.arc(cx + Math.cos(phase) * rx, cy + Math.sin(phase) * ry, (2.3 + i * .45) * DPR, 0, Math.PI * 2);
      x!.fill();
    }
  }

  function draw(ms: number): void {
    x!.setTransform(1, 0, 0, 1, 0, 0);
    x!.clearRect(0, 0, c!.width, c!.height);
    if (mode === 'stars') drawStars(ms);
    else if (mode === 'neon') drawNeon(ms);
    else if (mode === 'cinema') drawCinema(ms);
    else if (mode === 'storybook') drawStorybook(ms);
    else if (mode === 'wave') drawWave(ms);
    else if (mode === 'tactical') drawTactical(ms);
    else if (mode === 'titanium') drawTitanium(ms);
    else drawGalaxy(ms);
    x!.globalAlpha = 1;
  }

  function frame(now: number): void {
    if (t0 === null) t0 = now;
    draw(now - t0);
    raf = requestAnimationFrame(frame);
  }
  function play(): void { if (raf === null && !REDUCE) raf = requestAnimationFrame(frame); }
  function pause(): void { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } t0 = null; }

  let rt: ReturnType<typeof setTimeout>;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(); resize(); draw(0); }, 150); };
  const onVisibility = () => { if (document.hidden) pause(); else play(); };
  // Theme switch: rebuild the particle identity + repaint immediately (so the
  // reduced-motion static frame re-tints too — no stuck canvas colours).
  const onTheme = () => {
    build();
    buildPattern();
    draw(REDUCE ? 0 : performance.now());
  };

  build();
  resize();
  draw(0);
  play();
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('mm:themechange', onTheme);

  cleanup = () => {
    pause();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('mm:themechange', onTheme);
    cleanup = null;
  };
}
