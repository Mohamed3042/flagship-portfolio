/* =====================================================================
   AURORA HERO BACKGROUND — ported from the Claude Design original.
   Canvas glow on integer harmonics of a 22s loop (seamless), low-res
   blurred glow buffer, drifting particles. Targets #auroraCanvas.
   Pauses when tab hidden; static single frame under reduced-motion.
   Safe to re-init after an Astro View Transition (cancels the old loop).
   Theme packs re-tint the four blobs + ground via THEME_AURORA (lib/theme)
   and repaint on mm:themechange. dark/light keep the original palette.
   ===================================================================== */
import { activeTheme, THEME_AURORA } from './theme';

type Blob = {
  bx: number; by: number; ax: number; ay: number; kx: number; ky: number;
  px: number; py: number; col: [number, number, number]; rad: number; a: number;
};
type Particle = {
  x: number; y: number; r: number; fx: number; fy: number;
  sx: number; sy: number; px: number; py: number; tk: number; tp: number;
};

let raf: number | null = null;
let cleanup: (() => void) | null = null;

export function initAurora(): void {
  // Tear down any loop/listeners from a previous page before re-binding.
  cleanup?.();

  const canvas = document.getElementById('auroraCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const TAU = Math.PI * 2;
  const LOOP = 22;
  const SEED = LOOP * 1000 * 0.12;
  const REDUCE =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SCALE = 0.5;
  const off = document.createElement('canvas');
  const offc = off.getContext('2d')!;
  let W = 0, H = 0, DPR = 1;

  const blobs: Blob[] = [
    { bx: .06, by: .10, ax: .05, ay: .05, kx: 1, ky: 1, px: 0.0, py: 1.7, col: [41, 151, 255], rad: .50, a: .55 },
    { bx: .95, by: .06, ax: .06, ay: .05, kx: 1, ky: 2, px: 2.1, py: 0.4, col: [162, 89, 255], rad: .46, a: .52 },
    { bx: .93, by: .95, ax: .05, ay: .06, kx: 2, ky: 1, px: 1.1, py: 3.0, col: [255, 94, 138], rad: .46, a: .50 },
    { bx: .07, by: .92, ax: .06, ay: .05, kx: 1, ky: 1, px: 3.4, py: 0.9, col: [124, 108, 255], rad: .44, a: .42 },
  ];

  // Theme-tint the four blobs + the ground fill (dark/light = original palette).
  let auroraBg = '#000';
  function applyPalette(): void {
    const pal = THEME_AURORA[activeTheme()];
    auroraBg = pal.bg;
    blobs.forEach((b, i) => { b.col = pal.blobs[i % pal.blobs.length]; });
  }
  applyPalette();

  let particles: Particle[] = [];
  function makeParticles() {
    const n = Math.round(Math.min(22, Math.max(10, (W * H) / 52000)));
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        r: 0.4 + Math.random() * 0.9,
        fx: 0.004 + Math.random() * 0.010,
        fy: 0.006 + Math.random() * 0.014,
        sx: 1 + (Math.random() * 2 | 0),
        sy: 1 + (Math.random() * 2 | 0),
        px: Math.random() * TAU, py: Math.random() * TAU,
        tk: 1 + (Math.random() * 2 | 0),
        tp: Math.random() * TAU,
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas!.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    canvas!.width = Math.round(W * DPR);
    canvas!.height = Math.round(H * DPR);
    off.width = Math.max(1, Math.round(W * SCALE));
    off.height = Math.max(1, Math.round(H * SCALE));
    if (!particles.length) makeParticles();
    if (REDUCE) draw(SEED);
  }

  function drawGlow(ph: number) {
    const w = off.width, h = off.height, maxd = Math.max(w, h);
    offc.setTransform(1, 0, 0, 1, 0, 0);
    offc.clearRect(0, 0, w, h);
    offc.globalCompositeOperation = 'lighter';
    offc.filter = 'blur(' + Math.max(8, w * 0.016) + 'px)';
    for (const b of blobs) {
      const x = (b.bx + b.ax * Math.sin(ph * b.kx + b.px)) * w;
      const y = (b.by + b.ay * Math.cos(ph * b.ky + b.py)) * h;
      const rad = b.rad * maxd;
      const g = offc.createRadialGradient(x, y, 0, x, y, rad);
      const c = b.col;
      g.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + b.a + ')');
      g.addColorStop(0.4, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (b.a * 0.20) + ')');
      g.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
      offc.fillStyle = g;
      offc.beginPath(); offc.arc(x, y, rad, 0, TAU); offc.fill();
    }
    offc.filter = 'none';
    offc.globalCompositeOperation = 'source-over';
  }

  function drawParticles(ph: number) {
    ctx!.save();
    ctx!.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      const x = (p.x + p.fx * Math.sin(ph * p.sx + p.px)) * canvas!.width;
      const y = (p.y + p.fy * Math.cos(ph * p.sy + p.py)) * canvas!.height;
      const tw = 0.5 + 0.5 * Math.sin(ph * p.tk + p.tp);
      const a = 0.04 + 0.18 * tw;
      const r = p.r * DPR;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, r * 5);
      g.addColorStop(0, 'rgba(222,232,255,' + a + ')');
      g.addColorStop(1, 'rgba(222,232,255,0)');
      ctx!.fillStyle = g;
      ctx!.beginPath(); ctx!.arc(x, y, r * 5, 0, TAU); ctx!.fill();
      ctx!.fillStyle = 'rgba(255,255,255,' + (a * 0.9) + ')';
      ctx!.beginPath(); ctx!.arc(x, y, r, 0, TAU); ctx!.fill();
    }
    ctx!.restore();
  }

  function draw(ms: number) {
    const ph = (ms / 1000 / LOOP) * TAU;
    drawGlow(ph);
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.globalCompositeOperation = 'source-over';
    ctx!.fillStyle = auroraBg;
    ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
    ctx!.imageSmoothingEnabled = true;
    ctx!.imageSmoothingQuality = 'high';
    ctx!.drawImage(off, 0, 0, canvas!.width, canvas!.height);
    drawParticles(ph);
  }

  let start: number | null = null;
  let lastMs = SEED;
  function frame(now: number) {
    if (start === null) start = now - lastMs;
    lastMs = now - start;
    draw(lastMs);
    raf = requestAnimationFrame(frame);
  }
  function play() { if (raf === null && !REDUCE) raf = requestAnimationFrame(frame); }
  function pause() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } start = null; }

  let rt: ReturnType<typeof setTimeout>;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { particles = []; resize(); }, 150); };
  const onVisibility = () => { if (document.hidden) pause(); else play(); };
  // Re-tint + repaint on theme switch (covers the reduced-motion static frame).
  const onTheme = () => { applyPalette(); draw(lastMs || SEED); };

  resize();
  draw(SEED);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('mm:themechange', onTheme);
  play();

  cleanup = () => {
    pause();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('mm:themechange', onTheme);
    cleanup = null;
  };
}
