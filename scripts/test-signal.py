"""Browser regression checks for the DEEP FIELD landing sequence.

The one that matters most is determinism: the same scroll progress must
reconstruct the same scene whether it was reached going forward, going backward,
by a direct jump, or by a restored scroll position. Everything the stage draws is
a pure evaluation of one number, so that is a testable claim and not a hope.

Two standing rules from this project's history are enforced here rather than
remembered:

  * A browser probe that does not await a frame measures the PREVIOUS state.
    Every read is preceded by requestAnimationFrame twice plus a short timeout.
  * A contrast number taken from a design document certifies the intent, not the
    page. Every colour here is read with getComputedStyle from the rendered
    element, and the ratios are computed from those bytes.

Run against a served production build:
    node scripts/serve-static.mjs dist 4618
    python scripts/test-signal.py --base-url http://127.0.0.1:4618
"""
from pathlib import Path
import argparse, io, json, sys

# A failing check must be able to print itself. Arabic copy in a failure detail
# was crashing the reporter on a cp1252 console, which turns a red suite into a
# traceback and hides what actually failed.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--round', default='deep-field')
args = parser.parse_args()

OUT = ROOT / '.impeccable' / 'review' / args.round
OUT.mkdir(parents=True, exist_ok=True)

report = {'round': args.round, 'viewports': {}, 'checks': [], 'failures': []}


def check(name, passed, detail=''):
    report['checks'].append({'name': name, 'passed': bool(passed), 'detail': str(detail)[:600]})
    if not passed:
        report['failures'].append(f'{name}: {str(detail)[:600]}')


def attempt(name, action):
    try:
        action()
    except Exception as exc:  # a thrown check is a failed check, not a crashed run
        check(name, False, str(exc)[:700])


# The scene state the page exposes for testing. Reading it is a pure observation:
# it reports what the renderer already computed; it drives nothing.
PROBE = '''() => {
  const root = document.querySelector('[data-signal]');
  if (!root) return null;
  const df = window.__deepField;
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  const canvas = root.querySelector('[data-signal-canvas]');
  return {
    u: Math.min(1, Math.max(0, (scrollY - top) / range)),
    range,
    graphics: root.dataset.graphics || '',
    tier: root.dataset.tier || '',
    heroFigure: root.dataset.heroFigure || '',
    canvasOpacity: Number(getComputedStyle(canvas).opacity),
    active: [...root.querySelectorAll('[data-chapter]')]
      .filter(p => p.dataset.active === 'true').map(p => p.dataset.chapter),
    state: df ? df.state() : null,
  };
}'''

SEEK = '''(u) => {
  const root = document.querySelector('[data-signal]');
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  window.scrollTo({top: top + range * u, behavior: 'instant'});
}'''

SETTLE = '''async () => {
  window.__deepField && window.__deepField.settle(6);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise(r => setTimeout(r, 240));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}'''

# Contrast, read from the rendered element. The ground is the nearest ancestor
# with a non-transparent background-color, which on this route is .signal itself
# — black. The field of stars sits between, and the copy carries its own scrim;
# both only ever darken or lighten a fraction of the area, so the flat ground is
# the conservative reading, not a flattering one.
CONTRAST = '''(selectors) => {
  const lum = (css) => {
    const m = css.match(/[\\d.]+/g).map(Number);
    const ch = m.slice(0, 3).map(v => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const ground = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/[\\d.]+/g);
      if (m && (m.length < 4 || Number(m[3]) > 0.5)) return bg;
    }
    return 'rgb(0, 0, 0)';
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


# Where the renderer says each labelled star is, against where the DOM actually
# put its label. The anchor element has no size of its own — its rect IS the
# point — so these are two independent numbers about the same thing.
LABELS = """() => {
  const said = window.__deepField.labels();
  return said.map(l => {
    const el = document.querySelector('[data-label-key="' + l.key + '"]');
    if (!el) return {key: l.key, error: 'no element'};
    const r = el.getBoundingClientRect();
    return {key: l.key, dx: Math.abs(r.x - l.x), dy: Math.abs(r.y - l.y),
            visible: getComputedStyle(el.parentElement).opacity};
  });
}"""

REEL = """() => {
  const v = document.querySelector('[data-signal-reel] video');
  const t = document.querySelector('[data-reel-toggle]');
  if (!v) return null;
  const r = v.getBoundingClientRect();
  return {
    muted: v.muted, autoplay: v.hasAttribute('autoplay'), loop: v.loop,
    preload: v.preload, poster: !!v.poster, paused: v.paused,
    ratio: +(r.width / Math.max(1, r.height)).toFixed(2),
    onScreen: r.top > -4 && r.bottom < innerHeight + 4 && r.left > -4 && r.right < innerWidth + 4,
    revealed: +getComputedStyle(document.querySelector('[data-signal-reel]')).opacity,
    toggle: !!t, label: t && t.getAttribute('aria-label'),
    toggleBox: t ? Math.round(t.getBoundingClientRect().height) : 0,
  };
}"""

# Type, measured on the rendered page: the size in pixels, and how many
# characters actually land on a line — counted from the line BOXES the browser
# made, not from a column width and an assumed average glyph.
TYPE = """() => {
  const live = document.querySelector('[data-chapter][data-active=true]');
  const title = live.querySelector('.signal__title, .signal__name');
  const line = live.querySelector('.signal__line');
  const lines = (el) => {
    if (!el) return 0;
    const r = document.createRange();
    r.selectNodeContents(el);
    return r.getClientRects().length;
  };
  const px = (el) => el ? parseFloat(getComputedStyle(el).fontSize) : 0;
  const text = line ? (line.textContent || '').trim() : '';
  const rows = Math.max(1, lines(line));
  return {title: px(title), body: px(line), titleLines: lines(title),
          chars: text.length, bodyLines: rows,
          perLine: Math.round(text.length / rows)};
}"""


# ---------------------------------------------------------------- the haze
# The one check in this file that reads PIXELS. Everything else can be asked of
# the DOM; "the sky has a band in it" cannot.
#
# The band's geometry comes from the renderer, so the instrument and the page
# cannot disagree about where to look, and the copy block's own rectangle is
# excluded — a black scrim behind the words would otherwise be read as a void.

def patch_means(img, centre, normal, blocked, step=24, size=24):
    """Mean luma per patch, with each patch's distance from the band line."""
    px = img.convert('RGB').load()
    cx, cy = centre
    nx, ny = normal
    out = []
    for y in range(0, img.height - size, step):
        for x in range(0, img.width - size, step):
            if any(x < b[2] and x + size > b[0] and y < b[3] and y + size > b[1] for b in blocked):
                continue
            total = 0
            for yy in range(y, y + size, 3):
                for xx in range(x, x + size, 3):
                    r, g, b = px[xx, yy]
                    total += 0.2126 * r + 0.7152 * g + 0.0722 * b
            n = ((size + 2) // 3) ** 2
            mx, my = x + size / 2, y + size / 2
            out.append(((mx - cx) * nx + (my - cy) * ny,
                        (mx - cx) * -ny + (my - cy) * nx,
                        total / n))
    return out


def band_delta(img, centre, normal, blocked):
    """Mean luma inside the band, in a void, and the two halves of the void."""
    ps = patch_means(img, centre, normal, blocked)
    h = img.height
    inside = [p[2] for p in ps if abs(p[0]) < 0.16 * h]
    outside = [p for p in ps if abs(p[0]) > 0.5 * h]
    mean = lambda v: sum(v) / len(v) if v else 0.0
    a = mean([p[2] for p in outside if p[1] >= 0])
    b = mean([p[2] for p in outside if p[1] < 0])
    return {'band': round(mean(inside), 3), 'void': round(mean([p[2] for p in outside]), 3),
            'delta': round(mean(inside) - mean([p[2] for p in outside]), 3),
            'voidHalves': round(abs(a - b), 3), 'nBand': len(inside), 'nVoid': len(outside)}


def planted(width, height, centre, normal, amount):
    """A flat image with a band of a KNOWN excess painted along the same line.

    This is the control that can fail: with `amount` at 0 the probe has to
    report nothing, and with a planted 10 it has to report about 10. An
    instrument that cannot be shown to catch a known offset is not evidence.
    """
    img = Image.new('RGB', (width, height), (6, 6, 6))
    px = img.load()
    cx, cy = centre
    nx, ny = normal
    for y in range(height):
        for x in range(width):
            d = (x - cx) * nx + (y - cy) * ny
            if abs(d) < 0.16 * height:
                v = 6 + amount
                px[x, y] = (int(v), int(v), int(v))
    return img

VIEWS = [
    ('desktop', 'en', 1440, 900),
    ('mobile', 'en', 390, 844),
    ('arabic-desktop', 'ar', 1440, 900),
    ('arabic-mobile', 'ar', 390, 844),
]

# Every act has to appear at least once in this sweep, or the suite is only
# testing the beats it happens to land on.
# The runway grew in Round 2 and the chapter boundaries moved with it; these
# land inside hero, five worlds, film, public and contact.
SAMPLES = [0.02, 0.05, 0.13, 0.26, 0.42, 0.58, 0.68, 0.79, 0.87, 0.96]
TEXT = ['.signal__chapter[data-active=true] .signal__title, .signal__chapter[data-active=true] .signal__name',
        '.signal__chapter[data-active=true] .signal__line',
        '.signal__chapter[data-active=true] .signal__kicker',
        '.signal__chapter[data-active=true] .signal__action',
        '.signal__seek button']


def scroll_to(page, u):
    """Put the document at cinematic progress u and let the frame settle."""
    page.evaluate(SEEK, u)
    page.evaluate(SETTLE)
    return page.evaluate(PROBE)


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)

    for name, lang, w, h in VIEWS:
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1,
                                  is_mobile=w < 700, has_touch=w < 700)
        page = ctx.new_page()
        page.set_default_timeout(9000)
        errors, bad = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: bad.append(f'{r.status} {r.url}') if r.status >= 400 else None)

        page.goto(f'{args.base_url}/{lang}', wait_until='networkidle')
        page.wait_for_timeout(2600)

        base = page.evaluate('''() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          h1: document.querySelectorAll('h1').length,
          h1Text: (document.querySelector('h1') || {}).textContent || '',
          canvases: document.querySelectorAll('[data-signal] canvas').length,
          ambient: (() => { const c = document.querySelector('#space');
            return c ? getComputedStyle(c).display : 'absent'; })(),
          direction: document.documentElement.dir,
          audio: document.querySelectorAll('audio, video[autoplay]').length,
          chapters: document.querySelectorAll('[data-chapter]').length,
          workLink: !!document.querySelector('a[href*="#work"], a[href$="/#work"]'),
          contact: !!document.querySelector('#contact'),
          progressBars: document.querySelectorAll('.progress, [data-signal-progress]').length,
        })''')
        report['viewports'][name] = base

        check(f'{name} no horizontal overflow', base['overflow'] <= 1, base['overflow'])
        check(f'{name} one h1', base['h1'] == 1, base['h1'])
        check(f'{name} the h1 is the name', base['h1Text'].strip() != '', base['h1Text'][:60])
        check(f'{name} one renderer canvas', base['canvases'] == 1, base['canvases'])
        check(f'{name} no second ambient star field', base['ambient'] in ('none', 'absent'), base['ambient'])
        check(f'{name} direction', base['direction'] == ('rtl' if lang == 'ar' else 'ltr'))
        check(f'{name} no audio element', base['audio'] == 0, base['audio'])
        check(f'{name} twelve chapters in the DOM', base['chapters'] == 12, base['chapters'])
        check(f'{name} work reachable from the first viewport', base['workLink'])
        check(f'{name} contact section present', base['contact'])
        # Two bars reporting the same number is a defect, not redundancy.
        check(f'{name} exactly one progress bar on the route', base['progressBars'] == 1, base['progressBars'])

        state0 = page.evaluate(PROBE)
        check(f'{name} scene probe available', state0 is not None)
        if state0:
            check(f'{name} WebGL initialised', state0['graphics'] == 'webgl', state0['graphics'])
            check(f'{name} the field is live', (state0['state'] or {}).get('stars', 0) > 4000,
                  (state0['state'] or {}).get('stars'))
            check(f'{name} the hero constellation was built', state0['heroFigure'] == 'true',
                  state0['heroFigure'])
            # The tier's count is a CAP, not a constant: the governor is allowed
            # to come down off it on a slow machine, and asserting equality here
            # would turn "the adaptive path worked" into a red suite.
            # The cap and the floor are read from the page, so the tier table
            # lives in exactly one place.
            budget = (state0['state'] or {}).get('starBudget', 0)
            floor = (state0['state'] or {}).get('starFloor', 0)
            got = (state0['state'] or {}).get('stars', 0)
            check(f'{name} star count within its tier', floor <= got <= budget,
                  f'{got} outside [{floor}, {budget}]')

        # --- determinism: forward, then reverse, then a direct jump ----------
        forward = [scroll_to(page, u) for u in SAMPLES]
        reverse = [scroll_to(page, u) for u in reversed(SAMPLES)][::-1]

        for u, f, r in zip(SAMPLES, forward, reverse):
            fs, rs = f['state'], r['state']
            check(f'{name} u={u} same chapter forward and reverse', fs['chapter'] == rs['chapter'],
                  f"{fs['chapter']} vs {rs['chapter']}")
            # The illusion is scrub-reversible or it is an animation with a
            # play head. These are floats out of one pure function; they match
            # exactly or the function is not pure.
            for key in ('morph', 'local', 'dolly', 'narration'):
                check(f'{name} u={u} {key} reconstructs in reverse',
                      abs(fs[key] - rs[key]) < 1e-4, f"{fs[key]} vs {rs[key]}")
            check(f'{name} u={u} the dolly settles on its scroll value',
                  abs(fs['dolly'] - fs['appliedDolly']) < 1e-3,
                  f"{fs['dolly']} vs {fs['appliedDolly']}")

        seen = {f['state']['act'] for f in forward}
        check(f'{name} the sweep visits every act', seen == {'hero', 'worlds', 'film', 'public', 'contact'},
              sorted(seen))

        # A direct jump must agree with the swept value at the same progress.
        page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
        page.wait_for_timeout(300)
        jumped = scroll_to(page, SAMPLES[4])
        check(f'{name} direct jump matches swept state',
              jumped['state']['chapter'] == forward[4]['state']['chapter']
              and abs(jumped['state']['morph'] - forward[4]['state']['morph']) < 1e-4,
              f"{jumped['state']} vs {forward[4]['state']}")

        # The evaluator the capture scripts read must be the one the page renders.
        for u in (0.13, 0.5):
            live = scroll_to(page, u)['state']
            pure = page.evaluate('(u) => window.__deepField.at(u)', live['u'])
            # 1e-4, not 1e-6: the probe rounds what it reports to five decimals,
            # so a tighter bound tests the rounding and not the evaluator.
            check(f'{name} u={u} the exposed evaluator matches the rendered state',
                  pure['chapter'] == live['chapter'] and abs(pure['morph'] - live['morph']) < 1e-4,
                  f"{pure} vs {live}")

        # --- exactly one chapter is live, and hidden ones are not focusable --
        live = [s for s in forward if len(s['active']) != 1]
        check(f'{name} exactly one active chapter at every sample', not live,
              [s['state']['chapter'] for s in live])

        hidden_targets = page.evaluate('''() => {
          const hidden = [...document.querySelectorAll('[data-chapter]')]
            .filter(p => p.dataset.active !== 'true');
          return hidden.reduce((n, p) => n + [...p.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]')]
            .filter(el => el.tabIndex >= 0 && !el.closest('[inert]')).length, 0);
        }''')
        check(f'{name} hidden chapters leave no keyboard targets', hidden_targets == 0, hidden_targets)

        # --- the morph is a held pose, not a flicker -------------------------
        hero = scroll_to(page, 0.0)['state']
        check(f'{name} the name is assembled when the page opens', hero['morph'] > 0.99, hero['morph'])
        # Read from the chapter table, not from a constant: the runway changed
        # length in Round 2 and a hard-coded 0.09 quietly started measuring the
        # NEXT chapter's morph instead of the hero's release.
        hero_to = page.evaluate('() => window.__deepField.chapters[0].to')
        released = scroll_to(page, hero_to * 0.995)['state']
        check(f'{name} the name is back in the field by the end of the hero',
              released['morph'] < 0.05, f"{released['morph']} at u={hero_to * 0.995:.4f}")

        # --- stopping the scroll stops narrative progression -----------------
        held = scroll_to(page, 0.44)
        page.wait_for_timeout(900)
        still = page.evaluate(PROBE)
        check(f'{name} stopping scroll stops progression',
              abs(still['u'] - held['u']) < 0.002 and still['state']['chapter'] == held['state']['chapter'],
              f"{held['u']:.4f} -> {still['u']:.4f}")

        # --- the canvas is gone before the archive ---------------------------
        page.evaluate('''() => document.querySelector('#work').scrollIntoView({behavior: 'instant'})''')
        page.evaluate(SETTLE)
        at_work = page.evaluate(PROBE)
        check(f'{name} the field has faded out before the work section',
              at_work['canvasOpacity'] < 0.02, at_work['canvasOpacity'])

        # --- contrast, from the rendered page --------------------------------
        scroll_to(page, 0.13)
        ratios = page.evaluate(CONTRAST, TEXT)
        for sel, got in ratios.items():
            label = sel.split('.')[-1].split(',')[0].split('[')[0]
            check(f'{name} {label} contrast >= 4.5:1', bool(got) and got['ratio'] >= 4.5,
                  f"{got['ratio']:.2f}:1 {got['color']} on {got['ground']}" if got else 'element not found')

        # --- every figure is really there, and where the composition says ----
        # One seek per chapter that declares a figure, to the middle of its hold.
        # "The chapter has a figure" is not a property of the chapter table: it
        # is a property of the frame, so it is read from the seated points the
        # shader is using and from their projection through the live camera.
        chapters = page.evaluate("() => window.__deepField.chapters")
        figured = [c for c in chapters if c["figure"]]
        check(f"{name} eleven chapters declare a figure", len(figured) == 11, len(figured))
        missing, offscreen, shares = [], [], {}
        for c in figured:
            # The middle of the chapter's own reading stop. The hero holds its
            # figure at the START of its chapter and releases through the rest,
            # so a fixed fraction measures the wrong frame for one chapter in
            # twelve — which is exactly the kind of thing a fixed fraction does.
            hold = c["hold"]
            st = scroll_to(page, hold)["state"]
            box = page.evaluate("() => window.__deepField.figureBox()")
            if not box or box["points"] < 120 or st["morph"] < 0.9:
                missing.append(f"{c['id']}: points={box and box['points']} morph={st['morph']}")
                continue
            shares[c["id"]] = box["heightShare"]
            if (box["x"] < -6 or box["y"] < -6
                    or box["x"] + box["width"] > w + 6 or box["y"] + box["height"] > h + 6):
                offscreen.append(f"{c['id']}: {box['x']},{box['y']} {box['width']}x{box['height']}")
        check(f"{name} every declared figure is seated at its hold", not missing, missing)
        check(f"{name} no figure hangs off the frame", not offscreen, offscreen)
        # The composition asks for a figure at about 45% of the viewport height.
        # Contact is deliberately a point in a large frame and is excluded by
        # name, not by a bound that would quietly excuse anything small.
        # In portrait the figure takes the block ABOVE the copy on a screen a
        # third as wide, so the same figure is smaller by construction; the
        # bound is stated for each composition rather than averaged into one
        # number that is true of neither.
        worlds = {k: v for k, v in shares.items() if k.startswith("world-")}
        low, high = (0.3, 0.55) if w >= 820 else (0.2, 0.55)
        bad_scale = {k: v for k, v in worlds.items() if not low <= v <= high}
        check(f"{name} every world figure fills {low:.0%}-{high:.0%} of the viewport height",
              not bad_scale, f"{bad_scale} of {worlds}")
        report.setdefault("figureShares", {})[name] = shares

        # --- the labels are registered to the camera, to the pixel -----------
        public = next(c for c in chapters if c["id"] == "public")
        scroll_to(page, public["hold"])
        registration = page.evaluate(LABELS)
        check(f"{name} all four repositories carry a label", len(registration) == 4, registration)
        drift = [r for r in registration if r.get("error") or max(r.get("dx", 99), r.get("dy", 99)) > 4]
        check(f"{name} every label registers to its star within 4px", not drift, drift)
        check(f"{name} the labels are visible while the figure is held",
              all(float(r.get("visible", 0)) > 0.5 for r in registration if not r.get("error")),
              registration)
        # The control. A registration check that has never been shown to catch a
        # drift certifies its own tolerance and nothing else, so one label is
        # pushed a known six pixels and the same probe has to report six.
        planted_label = page.evaluate("""() => {
          const el = document.querySelector('[data-label-key]');
          const before = el.style.transform;
          const m = /translate\\(([-\\d.]+)px, ([-\\d.]+)px\\)/.exec(before) || [0, 0, 0];
          el.style.transform = `translate(${Number(m[1]) + 6}px, ${Number(m[2])}px)`;
          const said = window.__deepField.labels().find(l => l.key === el.dataset.labelKey);
          const r = el.getBoundingClientRect();
          el.style.transform = before;
          return {dx: Math.abs(r.x - said.x), dy: Math.abs(r.y - said.y)};
        }""")
        check(f"{name} a planted 6px drift is caught", abs(planted_label["dx"] - 6) < 1.5,
              planted_label)
        report.setdefault("labelRegistration", {})[name] = {"measured": registration,
                                                            "planted6px": planted_label}

        # --- the reel -------------------------------------------------------
        film = next(c for c in chapters if c["id"] == "film")
        scroll_to(page, film["hold"])
        reel = page.evaluate(REEL)
        check(f"{name} the film chapter carries a reel", reel is not None)
        if reel:
            check(f"{name} the reel is muted and not an autoplay element",
                  reel["muted"] and not reel["autoplay"], reel)
            check(f"{name} the reel does not download until it is revealed",
                  reel["preload"] == "none" and reel["poster"], reel)
            check(f"{name} the reel plane is 16:9 and inside the frame",
                  abs(reel["ratio"] - 16 / 9) < 0.06 and reel["onScreen"], reel)
            check(f"{name} the reel is at least half revealed at its hold",
                  reel["revealed"] >= 0.5, reel["revealed"])
            check(f"{name} the reel is playing while it is revealed", not reel["paused"], reel)
            check(f"{name} the reel toggle is keyboard-sized and labelled",
                  reel["toggle"] and reel["toggleBox"] >= 44 and bool(reel["label"]), reel)
            # Leaving the chapter has to stop it: a reel playing behind the next
            # beat is a video nobody asked to keep running.
            scroll_to(page, 0.3)
            page.wait_for_timeout(260)
            check(f"{name} the reel stops when the chapter is left",
                  page.evaluate("() => document.querySelector('[data-signal-reel] video').paused"),
                  "still playing")

        # --- the type scale, read from the rendered page ---------------------
        scroll_to(page, chapters[2]["hold"])
        typo = page.evaluate(TYPE)
        report.setdefault("type", {})[name] = typo
        if w >= 820:
            check(f"{name} the chapter title is at display scale", typo["title"] >= 34, typo["title"])
        check(f"{name} body type is 15-16px", 15 <= typo["body"] <= 16, typo["body"])
        check(f"{name} body lines stay under 60 characters", typo["perLine"] <= 60, typo)

        # --- the morph is long enough to read as motion on a wheel -----------
        span = page.evaluate(PROBE)["range"]
        world = chapters[1]
        px_chapter = (world["to"] - world["from"]) * span
        assembly = px_chapter * 0.49
        release = px_chapter * 0.30
        report.setdefault("morphPx", {})[name] = {
            "runwayPx": round(span), "chapterPx": round(px_chapter),
            "assemblyPx": round(assembly), "releasePx": round(release)}
        check(f"{name} the assembly takes at least 1000px of scroll", assembly >= 1000, round(assembly))
        check(f"{name} the release takes at least 600px of scroll", release >= 600, round(release))

        # --- hit targets ------------------------------------------------------
        small = page.evaluate('''() => {
          const live = document.querySelector('[data-chapter][data-active="true"]');
          const nodes = [...(live ? live.querySelectorAll('a[href], button') : []),
                         ...document.querySelectorAll('[data-signal-seek] a, [data-signal-seek] button')];
          return nodes.map(n => ({t: (n.textContent||'').trim().slice(0,24),
                                  h: Math.round(n.getBoundingClientRect().height),
                                  w: Math.round(n.getBoundingClientRect().width)}))
                      .filter(r => r.h < 44 || r.w < 24);
        }''')
        check(f'{name} every control in the stage is at least 44px tall', not small, small)

        # --- keyboard and history -------------------------------------------
        attempt(f'{name} End then Home returns a valid state', lambda: (
            page.keyboard.press('End'), page.wait_for_timeout(420),
            page.keyboard.press('Home'), page.wait_for_timeout(420),
            check(f'{name} Home returns to the opening chapter',
                  page.evaluate(PROBE)['u'] < 0.02, page.evaluate(PROBE)['u'])))

        # Every chapter has to be reachable without a wheel.
        def walk():
            page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
            page.wait_for_timeout(260)
            visited = []
            for _ in range(13):
                page.evaluate(SETTLE)
                visited.append(page.evaluate(PROBE)['state']['chapter'])
                nxt = page.query_selector('[data-signal-seek] [data-seek=next]')
                if not nxt or nxt.is_disabled():
                    break
                nxt.click()
                page.wait_for_timeout(180)
            check(f'{name} the keyboard nav reaches all twelve chapters',
                  len(set(visited)) == 12, f'{len(set(visited))}: {visited}')
        attempt(f'{name} chapter nav walk', walk)

        # --- deep links -------------------------------------------------------
        page.goto(f'{args.base_url}/{lang}#signal-contact', wait_until='networkidle')
        page.wait_for_timeout(2200)
        page.evaluate(SETTLE)
        addressed = page.evaluate(PROBE)
        check(f'{name} a chapter address resolves to that chapter',
              addressed['state']['chapter'] == 'contact', addressed['state']['chapter'])

        check(f'{name} no page errors', not errors, errors[:3])
        check(f'{name} no failed requests', not bad, bad[:3])
        page.screenshot(path=str(OUT / f'{name}-{lang}.png'))
        ctx.close()

    # ------------------------------------------------------------- the band
    # Is the field actually deep, or is it a uniform scatter of equal pinpricks?
    # Measured on a real desktop capture at a beat where the stars carry the
    # frame alone: the film chapter's opening, before the parting begins.
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(2600)
    film = page.evaluate("() => window.__deepField.chapters.find(c => c.id === 'film')")
    page.evaluate(SEEK, film['from'] + 0.004)
    page.evaluate(SETTLE)
    band = page.evaluate('() => window.__deepField.band()')
    blocked = page.evaluate("""() => {
      const out = [];
      for (const sel of ['[data-chapter][data-active=true] .signal__copy', '.nav',
                         '[data-signal-seek]', '[data-signal-reel] .signal__reel-plane']) {
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width && r.height) out.push([r.left - 60, r.top - 40, r.right + 60, r.bottom + 40]);
        }
      }
      return out;
    }""")
    state = page.evaluate('() => window.__deepField.state()')
    shot = Image.open(io.BytesIO(page.screenshot()))
    ctx.close()

    centre, normal = band['centre'], band['normal']
    rotated = (normal[1], -normal[0])
    real = band_delta(shot, centre, normal, blocked)
    control_rot = band_delta(shot, centre, rotated, blocked)
    control_flat = band_delta(planted(480, 300, (240, 150), normal, 0), (240, 150), normal, [])
    control_plant = band_delta(planted(480, 300, (240, 150), normal, 10), (240, 150), normal, [])
    report['haze'] = {'at': {'u': state['u'], 'chapter': state['chapter'], 'part': state['part']},
                      'band': band, 'measured': real, 'rotated90': control_rot,
                      'plantedZero': control_flat, 'plantedTen': control_plant}

    check('the instrument reports nothing on a flat frame', abs(control_flat['delta']) < 0.6,
          control_flat)
    check('the instrument catches a planted band of 10', abs(control_plant['delta'] - 10) < 0.6,
          control_plant)
    check('the band is at least 6/255 brighter than a void', real['delta'] >= 6, real)
    check('the two halves of the void agree', real['voidHalves'] < 2, real)
    check('the same excess is not found across the band', control_rot['delta'] < 3, control_rot)

    # --------------------------------------------------------------- shift
    # CLS has to be zero at both sizes and in both languages. Round 1 measured
    # 0.00031 at 1440 and traced it to the header's webfont swap; tokens.css now
    # carries metric-matched fallbacks and the layout preloads the three faces
    # the header is set in, which is a site-wide change and therefore a
    # site-wide claim. This is where it is checked.
    for cw, ch in ((1440, 900), (390, 844)):
        for lang in ('en', 'ar'):
            ctx = browser.new_context(viewport={'width': cw, 'height': ch}, device_scale_factor=1,
                                      is_mobile=cw < 700, has_touch=cw < 700)
            page = ctx.new_page()
            page.goto(f'{args.base_url}/{lang}', wait_until='load')
            page.wait_for_timeout(3000)
            shifts = page.evaluate("""async () => {
              const out = [];
              new PerformanceObserver(list => {
                for (const e of list.getEntries()) {
                  if (e.hadRecentInput) continue;
                  out.push({value: Number(e.value.toFixed(6)), at: Math.round(e.startTime),
                    sources: (e.sources || []).map(s => s.node
                      ? s.node.nodeName + '.' + (typeof s.node.className === 'string' ? s.node.className : '')
                      : 'anonymous')});
                }
              }).observe({type: 'layout-shift', buffered: true});
              await new Promise(r => setTimeout(r, 900));
              return out;
            }""")
            total = round(sum(x['value'] for x in shifts), 6)
            report.setdefault('cls', {})[f'{cw}x{ch}-{lang}'] = {'cls': total, 'shifts': shifts[:4]}
            check(f'CLS is zero at {cw}x{ch} {lang}', total == 0, f'{total} {shifts[:2]}')
            ctx.close()

    # ---------------------------------------------------------------- reduced
    # Reduced motion is a different composition, not a switched-off one: the
    # field is still drawn, held still, with every morph at its held pose.
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1,
                              reduced_motion='reduce')
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(2600)
    reduced = page.evaluate('''() => {
      const root = document.querySelector('[data-signal]');
      const panels = [...document.querySelectorAll('[data-chapter]')];
      return {
        graphics: root.dataset.graphics,
        visible: panels.filter(p => getComputedStyle(p).visibility !== 'hidden').length,
        inert: panels.filter(p => p.hasAttribute('inert')).length,
        canvas: getComputedStyle(root.querySelector('[data-signal-canvas]')).display,
        morph: window.__deepField ? window.__deepField.state().morph : null,
        nativePatched: typeof window.__mmNativeMatchMedia === 'function',
      };
    }''')
    # Reduced motion keeps the composition and removes the movement, so the
    # DOM contract is the same as the cinema's: one chapter live, the rest inert
    # AND invisible. The failure this replaced was the two halves disagreeing —
    # twelve chapters visible with eleven of them inert, so a keyboard could
    # reach one of the twelve things on screen.
    check('reduced motion keeps one chapter live', reduced['visible'] == 1, reduced['visible'])
    check('reduced motion leaves the other eleven inert', reduced['inert'] == 11, reduced['inert'])
    check('reduced motion still draws the field', reduced['canvas'] == 'block', reduced['canvas'])
    check('reduced motion holds the constellation at its pose',
          reduced['morph'] is not None and reduced['morph'] > 0.99, reduced['morph'])
    check('reduced motion reads the native query, not the patched one', reduced['nativePatched'],
          reduced['nativePatched'])
    before = page.screenshot()
    page.wait_for_timeout(1400)
    after = page.screenshot()
    check('reduced motion holds the scene still', before == after,
          'the page kept moving with reduced motion on')
    page.screenshot(path=str(OUT / 'reduced.png'))
    ctx.close()

    # ------------------------------------------------------------------ no JS
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, java_script_enabled=False)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='domcontentloaded')
    page.wait_for_timeout(700)
    nojs = page.evaluate if False else None
    shape = page.locator('[data-chapter]')
    check('no-JS ships every chapter as HTML', shape.count() == 12, shape.count())
    check('no-JS keeps the headline', page.locator('h1').count() == 1, page.locator('h1').count())
    links = page.locator('[data-chapter] a').count()
    check('no-JS keeps every chapter link', links >= 20, links)
    check('no-JS shows the archive', page.locator('#work').is_visible())
    page.screenshot(path=str(OUT / 'nojs.png'))
    ctx.close()

    browser.close()

# ---------------------------------------------------------------------------
# Retired with the object stage, and why.
#
# The "From Signal to Systems" object stage (planet rim -> fragments -> rails ->
# paper fold -> carton -> Cake Studio hall) was replaced as a DESIGN, so the
# checks that only described it were retired rather than ported:
#
#   * plate registration: `data-fit="exact"`, the plate rectangle, the pixel
#     comparison of a render with the HTML image suppressed, and the crop
#     agreement. There is no handoff surface in Deep Field: nothing hands a 3D
#     plane over to an <img>, so the claim is undefined, not unverified.
#   * the evidence-label phase switch (`data-phase=object|proof`). Deep Field
#     shows no product screenshot inside the cinema, so there is no claim on
#     screen for a label to be true or false about.
#   * the World portal being an explicit action and never a scroll side effect.
#     No portal: the Worlds chapters link out, and those links are covered by
#     the hit-target and keyboard checks.
#   * the shard ring, the rim, the flare, the carton fold and the paper macro.
#
# Carried over unchanged in intent: determinism forward/reverse/jump, one active
# chapter, hidden chapters out of the tab order, stopping scroll stops
# progression, End/Home, the reduced-motion composition, and the no-JS document.
# Added this round: the exposed evaluator must agree with the rendered state, the
# dolly must settle on its pure value, the contrast is read from the rendered
# element, there must be exactly one progress bar, and the field has to be gone
# before the archive.
# ---------------------------------------------------------------------------

(OUT / 'deep-field-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
passed = sum(1 for c in report['checks'] if c['passed'])
print(f'{passed}/{len(report["checks"])} checks passed')
for f in report['failures']:
    print('FAIL', f)
sys.exit(1 if report['failures'] else 0)
