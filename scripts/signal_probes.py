"""Probes shared by the DEEP FIELD harness and its capture scripts.

One copy, because the last time there were two the contrast reader was
wrong in both and only one of them was being looked at. Anything a script
and the suite both have to agree about belongs here.
"""

ALIGNMENT_PX = 1.5
ALIGNMENT_SHARE = 0.97
REGISTRATION_PX = 3

# Samples actual rendered frames during real wheel input. The lag control feeds
# each frame the plate half-height from two frames earlier through the SAME bar.
REGISTRATION_RECORD = r'''() => {
  window.__darbRegistration = [];
  window.__darbRecording = true;
  const tick = () => {
    if (!window.__darbRecording) return;
    const s = window.__deepField.registration();
    if (s && s.visible && s.local > .30 && s.local < .90) window.__darbRegistration.push({...s, at:performance.now()});
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}'''

def registration_result(frames):
    good = [f['gap'] for f in frames]
    lag = [abs(f['rimHalf'] - frames[i-2]['plateHalf']) for i, f in enumerate(frames) if i >= 2]
    return {'frames':len(frames), 'worstPx':max(good, default=1e6), 'lagWorstPx':max(lag, default=0)}

def aligned_3d(held, before, after):
    return (held['fraction'] >= ALIGNMENT_SHARE and held['depthSpan'] >= 30
            and held['depthBins'] >= 5 and before['fraction'] < ALIGNMENT_SHARE
            and after['fraction'] < ALIGNMENT_SHARE)

CONTRAST = r'''(selectors) => {
  // A computed colour arrives in one of two shapes in this browser, and they
  // are on DIFFERENT SCALES: `rgb(240, 243, 246)` is 0..255, while anything
  // that went through color-mix() comes back as `color(srgb 0.94 0.95 0.96)`,
  // which is 0..1. Dividing both by 255 read every mixed colour as almost
  // black and reported a 9.8:1 slot as 1.00:1. The shape decides the scale.
  const channels = (css) => {
    const nums = (css.match(/[-\d.]+(?:e[-+]?\d+)?/gi) || []).map(Number);
    if (!nums.length) return null;
    const srgb = /^color\(/i.test(css.trim());
    const rgb = nums.slice(0, 3).map(v => (srgb ? v : v / 255));
    // The alpha is the fourth number in both shapes; `color()` writes it after
    // a slash, which this picks up the same way.
    const alpha = nums.length > 3 ? nums[3] : 1;
    return {rgb, alpha};
  };
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const lum = (css) => {
    const c = channels(css);
    if (!c) return 0;
    const ch = c.rgb.map(lin);
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  // The first ancestor that actually paints. `transparent` is not a ground, and
  // when nothing in the chain paints, the ground is the canvas: html's own
  // background, not an assumed black.
  const ground = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const c = channels(bg);
      if (c && c.alpha > 0.5) return bg;
    }
    const root = getComputedStyle(document.documentElement).backgroundColor;
    const c = channels(root);
    return c && c.alpha > 0.5 ? root : 'rgb(0, 0, 0)';
  };
  const out = {};
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (!el) { out[sel] = null; continue; }
    const fg = getComputedStyle(el).color;
    const bg = ground(el);
    const a = lum(fg), b = lum(bg);
    out[sel] = {color: fg, ground: bg,
                ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)};
  }
  return out;
}'''
