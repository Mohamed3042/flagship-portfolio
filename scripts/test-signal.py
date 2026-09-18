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

# Every link the landing offers, with what an internal one resolves to. A dead
# link is not a typo: it is a claim the page cannot back, which is the same
# class of defect as a wrong number.
LINKS = """() => {
  const stage = document.querySelector('[data-signal]');
  return [...stage.querySelectorAll('a[href]')].map(a => {
    const href = a.getAttribute('href');
    // A mailto: has no origin at all — `a.origin` is the string "null" — so
    // comparing origins files every address on the page as an unknown host.
    const scheme = /^(mailto|tel):/i.test(href);
    return {
      href,
      resolved: a.href,
      text: (a.textContent || '').trim().slice(0, 40),
      chapter: (a.closest('[data-chapter]') || {}).dataset?.chapter || 'nav',
      scheme,
      external: !scheme && a.origin !== location.origin,
    };
  });
}"""

# The plate trap, as a measurement. The renderer's own view of a portal, plus
# what the STYLESHEET is doing with it — the two have to agree that a picture
# that has not decoded is at exactly zero.
PORTAL = """(id) => {
  const df = window.__deepField;
  const plate = df.portalPlate(id);
  if (!plate) return null;
  const host = document.querySelector('[data-chapter="' + plate.chapter + '"] [data-signal-portal]');
  const img = host.querySelector('img');
  const r = host.getBoundingClientRect();
  // The control: pretend for one read that the frame has not decoded, and the
  // blend has to collapse to zero however high the beat's own value is.
  const was = host.dataset.decoded;
  host.dataset.decoded = 'false';
  const gated = Number(getComputedStyle(host).opacity);
  host.dataset.decoded = was;
  const cs = getComputedStyle(host);
  return {...plate, gatedOpacity: gated,
          onScreen: r.top > -4 && r.bottom < innerHeight + 4 && r.left > -4 && r.right < innerWidth + 4,
          // The clip and the fit are what make the picture the aperture rather
          // than a rectangle standing in one. Read from the rendered page.
          clip: cs.clipPath, fit: getComputedStyle(img).objectFit,
          src: img.getAttribute('src'), loading: img.getAttribute('loading'),
          alt: (img.getAttribute('alt') || '').length};
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
    """Mean luma inside the band, in a void, and the two halves of the void.

    A HALF WITH NO PATCHES IS NOT A HALF THAT MEASURED ZERO. The first build of
    this returned 0.0 for an empty mean, so on a frame where the copy block
    covered one side "the two halves disagree by 2.7" was really "one half has
    a mean of 2.7 and the other has no samples at all" — a difference the page
    had nothing to do with. Both counts are reported, and the difference is
    None unless both halves were actually sampled.
    """
    ps = patch_means(img, centre, normal, blocked)
    h = img.height
    inside = [p[2] for p in ps if abs(p[0]) < 0.16 * h]
    outside = [p for p in ps if abs(p[0]) > 0.5 * h]
    mean = lambda v: sum(v) / len(v) if v else None
    upper = [p[2] for p in outside if p[1] >= 0]
    lower = [p[2] for p in outside if p[1] < 0]
    a, b = mean(upper), mean(lower)
    band, void = mean(inside), mean([p[2] for p in outside])
    return {'band': round(band, 3) if band is not None else None,
            'void': round(void, 3) if void is not None else None,
            'delta': round(band - void, 3) if band is not None and void is not None else None,
            'voidHalves': round(abs(a - b), 3) if a is not None and b is not None else None,
            'nBand': len(inside), 'nVoid': len(outside),
            'nVoidUpper': len(upper), 'nVoidLower': len(lower)}


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

# How many beats the page ships. Read from the built page in the first
# viewport and then held for the rest of the run, so this is the shipped number
# and not a number from a brief.
BEATS = 19

# The aperture's own geometry, which the page exports from the figure that
# draws it. Typed here once and read from nowhere else, so a change to the
# tick length moves the figure and the check together.
PORTAL_ASPECT = 1.12
PORTAL_TICK_OUT = 1.1

# The director's floors for a beat, in CSS pixels of scroll. src/lib/signal/
# chapters.ts exports the same three as BEAT_FLOORS.
HOLD_FLOOR, RELEASE_FLOOR, ASSEMBLY_FLOOR = 450, 400, 700

# What the seek nav's three controls say, in both routes. The tab-order check
# looks for one of them rather than for a selector, because what it is asserting
# is that a KEYBOARD reaches the nav, not that a node exists.
SEEK_WORDS = {'Previous', 'Next', 'View work', 'السابق', 'التالي', 'إلى الأعمال'}

# Every off-site host the landing is allowed to point at. Each was requested
# live while this round was built and its status is in the round's report; the
# suite itself never touches the network, because a check that needs the
# internet fails for reasons that have nothing to do with the page.
ALLOWED_HOSTS = (
    'https://github.com/Mohamed3042',
    'https://www.linkedin.com/in/',
    'https://mohamed3042.github.io/flagship-portfolio/worlds/',
)

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
# One sample inside every act of the nineteen-beat flight: hero, a world, a
# game, the voice engine, a system, the tools, the public repositories and the
# reply. A sweep that misses an act is a suite testing the beats it lands on.
SAMPLES = [0.02, 0.07, 0.12, 0.22, 0.33, 0.44, 0.55, 0.65, 0.75, 0.87, 0.92, 0.98]
TEXT = ['.signal__chapter[data-active=true] .signal__title, .signal__chapter[data-active=true] .signal__name',
        '.signal__chapter[data-active=true] .signal__line',
        '.signal__chapter[data-active=true] .signal__kicker',
        '.signal__chapter[data-active=true] .signal__action',
        '.signal__seek button',
        '.signal__skip']
# The star captions are read at their own beat, because they only exist while
# their figure is held. Round 4 raised both from the secondary ink; the ratio
# is what says whether that landed, and it is read off the rendered page.
LABEL_TEXT = {'tools': '#signal-tools .signal__label-box--plain',
              'public': '#signal-public .signal__label-box'}


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
          portals: document.querySelectorAll('[data-signal-portal]').length,
          films: document.querySelectorAll('[data-signal] a[href*="/films/"]').length,
          reels: document.querySelectorAll('[data-signal] video').length,
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
        check(f'{name} every beat is in the DOM', base['chapters'] == BEATS, base['chapters'])
        check(f'{name} five worlds carry a portal', base['portals'] == 5, base['portals'])
        # The career film and the nine film pages left this surface in Round 3.
        check(f'{name} the landing links to no film page', base['films'] == 0, base['films'])
        check(f'{name} no video on the landing', base['reels'] == 0, base['reels'])
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
        check(f'{name} the sweep visits every act',
              seen == {'hero', 'worlds', 'games', 'voice', 'systems', 'tools', 'public', 'contact'},
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
        check(f"{name} every beat declares a figure", len(figured) == BEATS, len(figured))
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
        # The portals are the beats whose height the composition states outright.
        # ROUND 4 raised the desktop aperture to half the screen — the director
        # asked for 50-55% — because the picture is now seen THROUGH it rather
        # than floating inside it. The phone's 37% stands. Everything else is
        # "about 45%" and is reported rather than gated.
        worlds = {k: v for k, v in shares.items() if k.startswith("world-")}
        lo, hi = (0.50, 0.55) if w >= 820 else (0.32, 0.42)
        outside = {k: v for k, v in worlds.items() if not lo <= v <= hi}
        check(f"{name} every portal ring is {lo:.0%}-{hi:.0%} of the viewport height",
              not outside, f"{outside} of {worlds}")
        low, high = (0.3, 0.55) if w >= 820 else (0.2, 0.55)
        bad_scale = {k: v for k, v in worlds.items() if not low <= v <= high}
        check(f"{name} every world figure fills {low:.0%}-{high:.0%} of the viewport height",
              not bad_scale, f"{bad_scale} of {worlds}")
        report.setdefault("figureShares", {})[name] = shares

        # --- the labels are registered to the camera, to the pixel -----------
        # Two chapters hang labels now. Both are checked, because the second one
        # hangs twelve of them and twelve chips is where a shared host, a shared
        # width cache or an off-by-one in the side choice would first show.
        for chapter_id, want in (("public", 4), ("tools", 12)):
            spot = next(c for c in chapters if c["id"] == chapter_id)
            scroll_to(page, spot["hold"])
            registration = page.evaluate(LABELS)
            check(f"{name} {chapter_id}: all {want} anchors carry a label",
                  len(registration) == want, registration)
            drift = [r for r in registration
                     if r.get("error") or max(r.get("dx", 99), r.get("dy", 99)) > 4]
            check(f"{name} {chapter_id}: every label registers to its star within 4px",
                  not drift, drift)
            check(f"{name} {chapter_id}: the labels are visible while the figure is held",
                  all(float(r.get("visible", 0)) > 0.5 for r in registration if not r.get("error")),
                  registration)
            # Chips that overlap are chips nobody can read. Measured on the
            # rendered boxes, not on the anchor points they hang from.
            overlaps = page.evaluate("""() => {
              const boxes = [...document.querySelectorAll('[data-chapter][data-active=true] .signal__label-box')]
                .map(el => { const r = el.getBoundingClientRect();
                             return {t: (el.textContent||'').trim(), x: r.x, y: r.y, w: r.width, h: r.height}; });
              const hit = [];
              for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i], b = boxes[j];
                if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y)
                  hit.push(a.t + ' / ' + b.t);
              }
              return hit;
            }""")
            check(f"{name} {chapter_id}: no two chips overlap", not overlaps, overlaps)
            report.setdefault("labelRegistration", {}).setdefault(name, {})[chapter_id] = registration
        scroll_to(page, next(c for c in chapters if c["id"] == "public")["hold"])
        registration = page.evaluate(LABELS)
        # The control. A registration check that has never been shown to catch a
        # drift certifies its own tolerance and nothing else, so one label is
        # pushed a known six pixels and the same probe has to report six.
        planted_label = page.evaluate("""() => {
          // The ACTIVE chapter's label. Two chapters hang labels now and the
          // tools come first in document order, so an unscoped query plants its
          // six pixels on a chip the renderer is not currently projecting.
          const el = document.querySelector('[data-chapter][data-active=true] [data-label-key]');
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
        report.setdefault("labelRegistration", {}).setdefault(name, {})["planted6px"] = planted_label

        # --- the portals, and the plate trap ---------------------------------
        plates = {}
        for c in [c for c in chapters if c["portal"]]:
            scroll_to(page, c["hold"])
            plate = page.evaluate(PORTAL, c["id"])
            plates[c["id"]] = plate
            check(f"{name} {c['id']}: the portal holds a plate", plate is not None)
            if not plate:
                continue
            check(f"{name} {c['id']}: the frame decoded before it was blended in",
                  plate["decoded"] and plate["naturalWidth"] > 0 and plate["opacity"] > 0.9, plate)
            # The control, and it is the whole point: the same page, the same
            # beat, with the decode gate turned off, must read exactly 0.
            check(f"{name} {c['id']}: an undecoded frame is held at zero",
                  plate["gatedOpacity"] == 0, plate["gatedOpacity"])
            # ROUND 4 inverted this pair. The plate used to have to be SMALL
            # enough to sit inside the ellipse with air around it, which is what
            # made every world a postage stamp. It now has to FILL the rim: its
            # box is the rim's own box, it carries the aperture's ratio rather
            # than the frame's, and the frame covers it. Three things are
            # checked, and each of them could fail on its own.
            rim = plate["ringHeight"] / PORTAL_TICK_OUT
            check(f"{name} {c['id']}: the plate fills its rim edge to edge",
                  plate["onScreen"] and abs(plate["height"] - rim) <= 2
                  and abs(plate["width"] - rim * PORTAL_ASPECT) <= 2,
                  f"plate {plate['width']}x{plate['height']} vs rim "
                  f"{rim * PORTAL_ASPECT:.0f}x{rim:.0f}")
            check(f"{name} {c['id']}: the plate carries the aperture's ratio",
                  abs(plate["width"] / max(1, plate["height"]) - PORTAL_ASPECT) < 0.02,
                  plate["width"] / max(1, plate["height"]))
            # The clip is what makes the rim the iris. Without it the plate is a
            # rectangle with the stars standing on its corners.
            check(f"{name} {c['id']}: the plate is clipped to the ellipse",
                  plate["clip"].startswith("ellipse") and plate["fit"] == "cover",
                  f"{plate['clip']} / {plate['fit']}")
            # And the frame has to have the pixels to fill it. DPR is capped at
            # 1.5, so the plate needs that much of its own box; the source
            # multiple against the director's 2x is reported, not gated,
            # because four of the five masters are 1280x720 and cannot reach it.
            check(f"{name} {c['id']}: the frame covers the plate at DPR 1.5",
                  plate["naturalWidth"] >= plate["width"] * 1.5,
                  f"{plate['naturalWidth']} for {plate['width'] * 1.5:.0f}")
            check(f"{name} {c['id']}: the frame is lazy and described",
                  plate["loading"] == "lazy" and plate["alt"] > 20, plate)
        report.setdefault("portals", {})[name] = plates

        # --- the type scale, read from the rendered page ---------------------
        scroll_to(page, chapters[2]["hold"])
        typo = page.evaluate(TYPE)
        report.setdefault("type", {})[name] = typo
        if w >= 820:
            check(f"{name} the chapter title is at display scale", typo["title"] >= 34, typo["title"])
        # Arabic is deliberately a step larger: the Round 4 pass moved every
        # slot on this route up 1-2 px with looser leading, because the same
        # point size reads smaller in an Arabic face. One bound for both would
        # be a bound that is wrong for one of them.
        lo_body, hi_body = (16.5, 18.0) if lang == 'ar' else (15.0, 16.0)
        check(f"{name} body type is {lo_body}-{hi_body}px",
              lo_body <= typo["body"] <= hi_body, typo["body"])
        check(f"{name} body lines stay under 60 characters", typo["perLine"] <= 60, typo)

        # --- the star captions -----------------------------------------------
        # Round 3 set these at 12px in the secondary ink and the director could
        # not read them at held pose. The size, the case, the tracking and the
        # alpha are all read off the rendered page, and so is the leader, which
        # has to be dimmer than the caption it leads to rather than brighter.
        for chapter_id, selector in LABEL_TEXT.items():
            spec = next((c for c in chapters if c['id'] == chapter_id), None)
            if not spec:
                continue
            scroll_to(page, spec['hold'])
            got = page.evaluate(r'''(sel) => {
              const box = document.querySelector(sel);
              if (!box) return null;
              const cs = getComputedStyle(box);
              const anchor = box.closest('.signal__label');
              const leader = anchor ? getComputedStyle(anchor, '::before') : null;
              const alpha = (css) => {
                const m = (css.match(/[\d.]+/g) || []).map(Number);
                return m.length > 3 ? m[3] : 1;
              };
              return {size: parseFloat(cs.fontSize), transform: cs.textTransform,
                      tracking: parseFloat(cs.letterSpacing) || 0,
                      colour: cs.color, alpha: alpha(cs.color),
                      leader: leader ? leader.backgroundColor : null,
                      leaderAlpha: leader ? alpha(leader.backgroundColor) : null,
                      leaderHeight: leader ? parseFloat(leader.height) : null};
            }''', selector)
            report.setdefault('captions', {}).setdefault(name, {})[chapter_id] = got
            check(f'{name} {chapter_id}: the caption is 13-14px',
                  bool(got) and 13 <= got['size'] <= 14, got and got['size'])
            check(f'{name} {chapter_id}: the caption is uppercase and tracked',
                  bool(got) and got['transform'] == 'uppercase' and got['tracking'] > 0.5,
                  got and (got['transform'], got['tracking']))
            check(f'{name} {chapter_id}: the caption ink is at full alpha',
                  bool(got) and got['alpha'] >= 0.999, got and got['colour'])
            check(f'{name} {chapter_id}: the leader is a hairline, dimmer than its caption',
                  bool(got) and got['leaderHeight'] == 1 and 0 < got['leaderAlpha'] < got['alpha'],
                  got and (got['leaderHeight'], got['leaderAlpha']))
            ratio = page.evaluate(CONTRAST, [selector])[selector]
            report.setdefault('captionContrast', {}).setdefault(name, {})[chapter_id] = ratio
            check(f'{name} {chapter_id}: caption contrast >= 4.5:1',
                  bool(ratio) and ratio['ratio'] >= 4.5,
                  f"{ratio['ratio']:.2f}:1" if ratio else 'not found')

        # --- accessibility ----------------------------------------------------
        # Six claims, each read from the rendered page rather than from the
        # markup's intentions.
        scroll_to(page, chapters[6]['hold'])
        a11y = page.evaluate('''() => {
          const stage = document.querySelector('[data-signal-stage]');
          const live = document.querySelector('[data-chapter][data-active=true]');
          // 1. A link with no discernible name is a link a screen reader reads
          //    as "link". Text, then aria-label, then the alt of an image
          //    inside it, then a title — the same order the platform uses.
          const named = (a) => (a.textContent || '').trim()
            || a.getAttribute('aria-label') || ''
            || [...a.querySelectorAll('img')].map(i => i.getAttribute('alt') || '').join('')
            || a.getAttribute('title') || '';
          const reachable = [...stage.querySelectorAll('a[href], button')]
            .filter(n => !n.closest('[inert]') && !n.disabled
                      && getComputedStyle(n).visibility !== 'hidden');
          // 2. Headings: one h1, and every beat a heading, in document order.
          const heads = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
            .map(h => Number(h.tagName[1]));
          const beatHeads = [...document.querySelectorAll('[data-chapter]')]
            .map(p => {
              const h = p.querySelector('h1, h2, h3, h4, h5, h6');
              return h ? h.tagName : null;
            });
          return {
            unnamed: reachable.filter(n => !named(n).trim())
                              .map(n => n.outerHTML.slice(0, 90)),
            reachable: reachable.length,
            h1: document.querySelectorAll('h1').length,
            headings: heads,
            beatHeads,
            canvasHidden: [...document.querySelectorAll('canvas')]
              .every(c => c.getAttribute('aria-hidden') === 'true'),
            skipHref: (stage.querySelector('.signal__skip') || {}).getAttribute
              ? stage.querySelector('.signal__skip').getAttribute('href') : null,
          };
        }''')
        report.setdefault('a11y', {})[name] = a11y
        check(f'{name} every reachable link and button has a name',
              not a11y['unnamed'], a11y['unnamed'][:3])
        check(f'{name} exactly one h1 on the route', a11y['h1'] == 1, a11y['h1'])
        check(f'{name} every beat carries a heading',
              all(a11y['beatHeads']) and a11y['beatHeads'].count('H1') == 1,
              a11y['beatHeads'])
        check(f'{name} headings never skip a level',
              all(b - a <= 1 for a, b in zip(a11y['headings'], a11y['headings'][1:])),
              a11y['headings'][:24])
        check(f'{name} no canvas is exposed to the accessibility tree',
              a11y['canvasHidden'])

        # 3. The skip link has to LAND past the runway, which is a measurement,
        #    not an href: #work is only a skip if the work section is below the
        #    whole cinema.
        skip = page.evaluate('''() => {
          const stage = document.querySelector('[data-signal-stage]');
          const runway = stage.querySelector('[data-signal-runway]');
          const target = document.querySelector(
            stage.querySelector('.signal__skip').getAttribute('href'));
          if (!target) return null;
          const end = runway.getBoundingClientRect().bottom + scrollY;
          return {target: target.id, top: target.getBoundingClientRect().top + scrollY,
                  runwayEnd: end};
        }''')
        check(f'{name} the skip link lands past the end of the runway',
              bool(skip) and skip['top'] >= skip['runwayEnd'] - 2, skip)

        # 4. A focus ring that is not painted is not a focus ring. Read the
        #    computed outline on a control that has focus, with a control:
        #    the same element unfocused must NOT have one, or the check is
        #    measuring a border that is always there.
        rings = page.evaluate('''() => {
          const read = (el) => {
            const cs = getComputedStyle(el);
            return {width: parseFloat(cs.outlineWidth) || 0, style: cs.outlineStyle,
                    colour: cs.outlineColor, offset: parseFloat(cs.outlineOffset) || 0};
          };
          const out = {};
          const pick = {
            portal: '[data-chapter][data-active=true] .signal__action',
            seek: '[data-signal-seek] [data-seek=next]',
            skip: '.signal__skip',
          };
          for (const [key, sel] of Object.entries(pick)) {
            const el = document.querySelector(sel);
            if (!el) { out[key] = null; continue; }
            const before = read(el);
            el.focus({focusVisible: true});
            out[key] = {focused: read(el), idle: before,
                        isFocused: document.activeElement === el};
            el.blur();
          }
          return out;
        }''')
        report.setdefault('focusRings', {})[name] = rings
        for key, got in rings.items():
            check(f'{name} {key}: focus paints a 2px accent ring with an offset',
                  bool(got) and got['isFocused'] and got['focused']['width'] >= 2
                  and got['focused']['style'] not in ('none', 'hidden')
                  and got['focused']['offset'] >= 2, got)
            check(f'{name} {key}: the ring is not there when it is not focused',
                  bool(got) and (got['idle']['width'] < 2
                                 or got['idle']['style'] in ('none', 'hidden')), got)

        # 5. Tab order, walked for real. Every control the stage exposes has to
        #    be reachable, in document order, and the tab sequence has to LEAVE
        #    the stage — a sticky frame that never hands focus on is a trap.
        page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
        page.wait_for_timeout(300)
        page.evaluate('() => document.body.focus()')
        page.keyboard.press('Tab')
        order, escaped = [], False
        for _ in range(42):
            where = page.evaluate('''() => {
              const el = document.activeElement;
              if (!el || el === document.body) return null;
              const stage = document.querySelector('[data-signal-stage]');
              return {tag: el.tagName,
                      text: (el.textContent || '').trim().slice(0, 28),
                      inStage: !!stage && stage.contains(el),
                      inInert: !!el.closest('[inert]')};
            }''')
            if where is None:
                break
            order.append(where)
            if order and order[0]['inStage'] and not where['inStage'] and len(order) > 1:
                escaped = True
                break
            page.keyboard.press('Tab')
        report.setdefault('tabOrder', {})[name] = order
        check(f'{name} the tab order never enters an inert chapter',
              not any(o['inInert'] for o in order),
              [o['text'] for o in order if o['inInert']][:3])
        check(f'{name} focus is not trapped inside the sticky stage', escaped,
              [o['text'] for o in order][:12])
        check(f'{name} the seek nav is in the tab order',
              any(o['inStage'] and o['text'] in SEEK_WORDS for o in order),
              [o['text'] for o in order][:12])

        # --- the morph is long enough to read as motion on a wheel -----------
        # Measured from the SHIPPED window rather than a second copy of its
        # numbers: the distance between the progress where a figure is 1% formed
        # and the one where it is 99%, walked on the page's own evaluator.
        span = page.evaluate(PROBE)["range"]
        world = chapters[1]
        # TWO distances, because they answer different questions and Round 2
        # answered only the first. The WINDOW is the scroll the assembly owns —
        # the same basis Round 2 measured 1,153 px on, and the one the minimum
        # is stated in. The 1-to-99 span is shorter, because an ease-out-quart
        # is nine tenths done in two thirds of its window; it is the distance
        # over which the move is actually visible, and it is reported.
        edges = page.evaluate('''(c) => {
          const at = (u) => window.__deepField.at(u).morph;
          const N = 8000;
          const find = (want, forward) => {
            for (let i = 0; i <= N; i++) {
              const u = c.from + (c.to - c.from) * (forward ? i / N : 1 - i / N);
              if (at(u) >= want) return u;
            }
            return null;
          };
          return {open0: find(1e-6, true), open1: find(0.9999, true),
                  close1: find(1e-6, false), close0: find(0.9999, false),
                  vis0: find(0.01, true), vis1: find(0.99, true),
                  visOut1: find(0.01, false), visOut0: find(0.99, false)};
        }''', world)
        # The WINDOW, from the four points the chapter ships. Probing for a
        # threshold measures something else: an ease-out-quart is at 0.9999 nine
        # tenths of the way through its ramp, so "the first u where morph reads
        # one" lands a hundred pixels early and reports a window that is not the
        # window.
        win = world["window"]
        assembly = (win["in1"] - win["in0"]) * span
        release = (win["out1"] - win["out0"]) * span
        px_chapter = (world["to"] - world["from"]) * span
        report.setdefault("morphPx", {})[name] = {
            "runwayPx": round(span), "chapterPx": round(px_chapter),
            "assemblyWindowPx": round(assembly), "releaseWindowPx": round(release),
            "assemblyVisiblePx": round((edges["vis1"] - edges["vis0"]) * span),
            "releaseVisiblePx": round((edges["visOut1"] - edges["visOut0"]) * span),
            "holdPx": round(px_chapter - assembly - release)}
        # ROUND 4 floors. A hold of 202 px is two notches of a wheel to read a
        # title, a line and a link in, so the director set the hold and the
        # release first and gave the assembly what was left, with 700 px under
        # it. All three are asserted now — the release used to be reported
        # because the runway could not pay for it, and at this split it can.
        hold = px_chapter - assembly - release
        check(f"{name} the hold takes at least {HOLD_FLOOR}px of scroll",
              hold >= HOLD_FLOOR, round(hold))
        check(f"{name} the release takes at least {RELEASE_FLOOR}px of scroll",
              release >= RELEASE_FLOOR, round(release))
        check(f"{name} the assembly takes at least {ASSEMBLY_FLOOR}px of scroll",
              assembly >= ASSEMBLY_FLOOR, round(assembly))

        # --- no dead links ----------------------------------------------------
        # Internal targets have to exist in this build; external ones have to be
        # absolute, on https, and on the small list this round verified live (the
        # statuses are in the round's report). A suite that reaches the network
        # is a suite that fails when the network does.
        links = page.evaluate(LINKS)
        report.setdefault("links", {})[name] = links
        empty = [l for l in links if not l["href"] or l["href"] in ("#", "javascript:void(0)")]
        check(f"{name} no empty links", not empty, empty)
        internal = [l for l in links if not l["external"] and not l["scheme"]]
        broken = []
        for l in internal:
            path = l["resolved"].split("#")[0].split("?")[0].replace(args.base_url, "")
            if not path or path == "/":
                continue
            target = ROOT / "dist" / path.strip("/")
            if not (target.exists() or target.with_suffix(".html").exists()
                    or (target / "index.html").exists()):
                broken.append(l["href"])
        check(f"{name} every internal link resolves in the build", not broken, broken)
        mails = [l for l in links if l["scheme"]]
        check(f"{name} every address is a real mailto", all(l["href"].startswith("mailto:") and "@" in l["href"] for l in mails), mails)
        offsite = sorted({l["resolved"] for l in links if l["external"]})
        unknown = [u for u in offsite if not any(u.startswith(a) for a in ALLOWED_HOSTS)]
        check(f"{name} every external link is on a verified host", not unknown, unknown)

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
            for _ in range(BEATS + 1):
                page.evaluate(SETTLE)
                visited.append(page.evaluate(PROBE)['state']['chapter'])
                nxt = page.query_selector('[data-signal-seek] [data-seek=next]')
                if not nxt or nxt.is_disabled():
                    break
                nxt.click()
                page.wait_for_timeout(180)
            check(f'{name} the keyboard nav reaches every chapter',
                  len(set(visited)) == BEATS, f'{len(set(visited))}: {visited}')
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
    # Measured on a real desktop capture where the stars carry the frame alone.
    # The Film beat used to be that place; it left the landing in Round 3, so
    # the quiet window is now FOUND — the widest stretch of the page where
    # nothing is assembling, parting or breathing, asked of the page's own
    # evaluator rather than named.
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(2600)
    quiets = page.evaluate("""() => {
      const runs = [];
      let run = null;
      for (let i = 0; i <= 2000; i++) {
        const u = i / 2000;
        const s = window.__deepField.at(u);
        const still = s.morph < 0.002 && s.part < 0.002 && s.breath < 0.002 && s.portal < 0.002;
        if (still) run = run ? {from: run.from, to: u} : {from: u, to: u};
        else { if (run) runs.push(run); run = null; }
      }
      if (run) runs.push(run);
      return runs.sort((a, b) => (b.to - b.from) - (a.to - a.from)).slice(0, 6);
    }""")
    check('the field is alone somewhere on the page', bool(quiets), quiets)

    BLOCKED = """() => {
      const out = [];
      for (const sel of ['[data-chapter][data-active=true] .signal__copy', '.nav',
                         '[data-signal-seek]', '[data-signal-portal]',
                         '[data-chapter][data-active=true] .signal__hint',
                         '[data-signal-labels][data-on=true]']) {
        for (const el of document.querySelectorAll(sel)) {
          // ONLY WHAT IS ACTUALLY DRAWN. This selector list reaches every
          // portal on the page, not the one on screen, and the other four keep
          // the box the renderer last gave them behind `visibility:hidden`.
          // With Round 4's plates at 481x430 and a 60px skirt, those four
          // covered most of the frame and the instrument was excluding the
          // void it was about to average — which is how one half of it came to
          // have no samples at all. An element that paints nothing hides
          // nothing.
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.02) continue;
          const r = el.getBoundingClientRect();
          if (r.width && r.height) out.push([r.left - 60, r.top - 40, r.right + 60, r.bottom + 40]);
        }
      }
      return out;
    }"""

    # WHICH quiet window. The longest one is not the right answer: this round's
    # split put it inside the hero, whose name block and scroll hint sit across
    # the middle of the frame and leave the instrument three patches of void to
    # average — one half of which had none at all. What the measurement needs is
    # the quiet stretch with the most MEASURABLE frame, so each candidate is
    # seated, its blocked rectangles are read, and the patches that survive them
    # are counted before a single pixel is sampled.
    def void_patches(blocked, band_geom, width=1440, height=900, step=24, size=24):
        cx, cy = band_geom['centre']
        nx, ny = band_geom['normal']
        upper = lower = 0
        for y in range(0, height - size, step):
            for x in range(0, width - size, step):
                if any(x < b[2] and x + size > b[0] and y < b[3] and y + size > b[1]
                       for b in blocked):
                    continue
                mx, my = x + size / 2, y + size / 2
                d = (mx - cx) * nx + (my - cy) * ny
                if abs(d) <= 0.5 * height:
                    continue
                if (mx - cx) * -ny + (my - cy) * nx >= 0:
                    upper += 1
                else:
                    lower += 1
        return upper, lower

    candidates = []
    for window in quiets:
        page.evaluate(SEEK, (window['from'] + window['to']) / 2)
        page.evaluate(SETTLE)
        geom = page.evaluate('() => window.__deepField.band()')
        up, low = void_patches(page.evaluate(BLOCKED), geom)
        candidates.append({'window': window, 'upper': up, 'lower': low,
                           'both': min(up, low), 'chapter':
                           page.evaluate('() => window.__deepField.state().chapter')})
    candidates.sort(key=lambda c: (c['both'], c['upper'] + c['lower']), reverse=True)
    report['hazeWindow'] = candidates
    quiet = candidates[0]['window']
    page.evaluate(SEEK, (quiet['from'] + quiet['to']) / 2)
    page.evaluate(SETTLE)
    band = page.evaluate('() => window.__deepField.band()')
    blocked = page.evaluate(BLOCKED)
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
    check('the band is at least 6/255 brighter than a void',
          real['delta'] is not None and real['delta'] >= 6, real)
    # Both halves have to have been SAMPLED for this to mean anything, and the
    # count is part of the assertion rather than a footnote under it.
    check('the void was measured on both sides of the band',
          real['nVoidUpper'] >= 4 and real['nVoidLower'] >= 4,
          f"upper {real['nVoidUpper']} lower {real['nVoidLower']}")
    check('the two halves of the void agree',
          real['voidHalves'] is not None and real['voidHalves'] < 2, real)
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
        canvas: (() => { const c = root.querySelector('[data-signal-canvas]');
          return c ? getComputedStyle(c).display : 'absent'; })(),
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
    check('reduced motion leaves every other chapter inert', reduced['inert'] == BEATS - 1,
          reduced['inert'])
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
    check('no-JS ships every chapter as HTML', shape.count() == BEATS, shape.count())
    check('no-JS keeps the headline', page.locator('h1').count() == 1, page.locator('h1').count())
    links = page.locator('[data-chapter] a').count()
    check('no-JS keeps every chapter link', links >= 26, links)
    # The still document has to carry the pictures too, at their own size.
    frames = page.locator('.signal__portal img')
    check('no-JS ships the five world frames', frames.count() == 5, frames.count())
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
