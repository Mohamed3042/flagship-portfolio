"""Does the HTML plate land on the 3D surface it takes over from?

WHAT THE OLD CHECKS ESTABLISHED, AND WHAT THEY DID NOT

`data-fit="exact"` is the renderer reporting on its own arithmetic: it compares
the rectangle the fitter returned against the free box the same fitter used. It
cannot see a pixel. It is an internal consistency check and is named as one.

The pixel check that replaced it asserted `covers` -- that the region which
changes when the plate is toggled contains the plate's rectangle. Enclosure is
not correspondence: an image twice too large, or rotated 180 degrees, or showing
a different crop, covers its rectangle perfectly. And the region it measured was
computed with an unapplied threshold, so a single unit of encoder dither
anywhere in the frame widened it. Both of those are now fixed or renamed.

WHAT THIS MEASURES INSTEAD

The same marker image is served to the HTML <img> and to the WebGL texture, by
intercepting the one URL they both request -- no product code is touched. The
image carries four differently coloured corner markers, so a corner can be told
from the corner opposite it, a mirror can be told from a rotation, and a crop
can be told from a fit.

Each marker's centroid is then found in the rendered pixels twice: once with the
plate hidden, so the markers seen belong to the GEOMETRY, and once with the
plate shown, so they belong to the HTML. Nothing in this comparison comes from
`data-fit`, from the fitter's returned rectangle, or from any number the
renderer reports. It is where the two things actually landed.

THE HONEST LIMIT OF THE FINAL HOLD

fadeSurface sets `material.opacity = 1 - blend` and `mesh.visible = blend <
0.995`. At the end of the handoff the 3D surface is not drawn at all, so at the
final hold there is no second representation to register against and this
comparison has nothing to compare. That is recorded, not asserted around. The
interval where registration is observable -- and where a visitor would see it
fail -- is the crossfade, so that is where the budget is enforced.

CONTROLS

* Two captures of an unchanged state open every sample. Their marker centroids
  must agree to well within the budget, otherwise the scene is still moving and
  nothing measured afterwards means anything.
* A deliberate 5 CSS-pixel offset is injected into the HTML plate at the end of
  every sample and MUST be reported as a failure. A budget that cannot fail is
  not a budget.
* Device pixel ratio is set explicitly and every measurement is divided by it,
  so the budget is in CSS pixels at both DPR 1 and DPR 2.

Usage:  python scripts/diagnose-registration.py [origin]
"""
import io
import json
import sys

import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
ORIGIN = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4618'

# CSS pixels. The director's budget. Not widened to make anything pass.
BUDGET = 2.0
INJECT = 5.0          # the offset that must fail
CONTROL_BUDGET = 0.75  # two captures of a still scene

MARKERS = {
    'tl': (230, 30, 30),
    'tr': (30, 220, 60),
    'br': (50, 90, 245),
    'bl': (245, 210, 30),
}
CORNERS = ['tl', 'tr', 'br', 'bl']


def marker_image(width, height):
    """A field with four distinguishable corners.

    Distinct hues, not four identical crosses: identical markers cannot tell a
    180-degree rotation from a correct fit, and cannot tell a mirrored crop from
    a right-reading one. The block sits well inside the edge so a rounded corner
    or an antialiased border never eats it.
    """
    img = Image.new('RGB', (width, height), (26, 28, 32))
    draw = ImageDraw.Draw(img)
    r = max(10, int(min(width, height) * 0.11))
    inset = max(8, int(min(width, height) * 0.07))
    spots = {
        'tl': (inset, inset),
        'tr': (width - inset, inset),
        'br': (width - inset, height - inset),
        'bl': (inset, height - inset),
    }
    for key, (cx, cy) in spots.items():
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=MARKERS[key])
    # A bar along the top only: an extra, independent read on orientation.
    draw.rectangle([width * 0.35, 4, width * 0.65, 4 + max(4, r // 3)], fill=(255, 255, 255))
    return img


def png_bytes(img):
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return buf.getvalue()


def centroids(shot, dpr):
    """Marker centroids in CSS pixels, or None where a marker is not present.

    Classification is by channel ratio rather than absolute value, because the
    markers are composited at partial alpha over a near-black stage: alpha
    scales all three channels together and leaves the ratios intact.
    """
    arr = np.asarray(Image.open(io.BytesIO(shot)).convert('RGB')).astype(np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    lit = (r + g + b) > 55
    masks = {
        'bl': lit & (r > b * 1.9) & (g > b * 1.9) & (np.abs(r - g) < 0.45 * np.maximum(r, g)),
        'tl': lit & (r > g * 1.7) & (r > b * 1.7),
        'tr': lit & (g > r * 1.7) & (g > b * 1.7),
        'br': lit & (b > r * 1.6) & (b > g * 1.5),
    }
    # Yellow is red-and-green; claim it first so it cannot be read as either.
    taken = masks['bl']
    out = {}
    for key in CORNERS:
        m = masks[key] if key == 'bl' else (masks[key] & ~taken)
        n = int(m.sum())
        if n < 12:
            out[key] = None
            continue
        ys, xs = np.nonzero(m)
        # A marker that runs off the edge of the frame has had part of itself
        # cut away, and the centroid of what is left is pulled inward. That is
        # a property of the viewport, not of where the thing landed, so it is
        # flagged and excluded rather than reported as displacement. The portal
        # wall grows past the frame as the camera closes in, which is exactly
        # where the largest 'errors' appeared.
        clipped = bool(m[:2, :].any() or m[-2:, :].any()
                       or m[:, :2].any() or m[:, -2:].any())
        out[key] = (float(xs.mean()) / dpr, float(ys.mean()) / dpr, n, clipped)
    return out


def spread(a, b):
    """Worst per-corner displacement in CSS pixels, over usable corners.

    A corner is usable when both sides resolved it and neither side's marker
    touches the frame edge. Clipped corners are reported separately: they carry
    no information about registration.
    """
    worst, detail, shared, clipped = 0.0, {}, 0, []
    for key in CORNERS:
        p, q = a.get(key), b.get(key)
        if not p or not q:
            detail[key] = None
            continue
        if p[3] or q[3]:
            detail[key] = 'clipped'
            clipped.append(key)
            continue
        shared += 1
        d = ((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2) ** 0.5
        detail[key] = round(d, 2)
        worst = max(worst, d)
    return worst, detail, shared, clipped


# Readiness means "what this frame paints has arrived", not "every image on the
# document has arrived". The route carries 38 lazy captures far below the fold
# that are correctly never fetched; waiting on those waits forever.
READY = """() => {
  if (document.fonts.status !== 'loaded') return false;
  const plate = document.querySelector('[data-chapter][data-active="true"] [data-plate]');
  if (plate && !(plate.complete && plate.naturalWidth > 0)) return false;
  return [...document.images].every(i => {
    if (i.loading === 'lazy') return true;
    const r = i.getBoundingClientRect();
    const onscreen = r.bottom > 0 && r.top < innerHeight && r.width > 0;
    return !onscreen || (i.complete && i.naturalWidth > 0);
  });
}"""

PLATE = "document.querySelector('[data-chapter][data-active=\"true\"] [data-plate]')"

STATE = """() => {
  const p = %s;
  if (!p) return null;
  const r = p.getBoundingClientRect();
  return {blend: parseFloat(getComputedStyle(p).getPropertyValue('--plate-blend')) || 0,
          handoff: p.dataset.handoff, fit: p.dataset.fit, src: p.currentSrc,
          x: r.x, y: r.y, w: r.width, h: r.height};
}""" % PLATE

# Removed for the diagnostic only, and none of it changes the plate's rectangle:
# a shadow paints outside the border box, a filter resamples it, a decorative
# border tints its edge. Layout geometry -- width, height, transform, position --
# is left exactly as production computes it.
NEUTRALISE = """
[data-plate]{box-shadow:none!important;filter:none!important;
  border-color:transparent!important;border-radius:0!important}
"""

SCROLL = """(u) => {
  const root = document.querySelector('[data-signal]');
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  window.scrollTo({top: top + range * u, behavior: 'instant'});
}"""


def settle(page):
    page.wait_for_function(READY, timeout=15000)
    for _ in range(3):
        page.evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))')
    page.wait_for_timeout(260)


def approach(page, u, mode):
    """Reach progress u the way a visitor would, so hysteresis is exercised."""
    if mode == 'forward':
        for step in (u - 0.10, u - 0.05, u - 0.02):
            page.evaluate(SCROLL, max(0.0, step))
            page.wait_for_timeout(90)
    elif mode == 'reverse':
        for step in (u + 0.10, u + 0.05, u + 0.02):
            page.evaluate(SCROLL, min(1.0, step))
            page.wait_for_timeout(90)
    page.evaluate(SCROLL, u)
    settle(page)


def plate_opacity(page, value):
    page.evaluate(f"() => {PLATE}?.style.setProperty('opacity','{value}','important')")
    page.wait_for_timeout(180)


def plate_clear(page, prop):
    page.evaluate(f"() => {PLATE}?.style.removeProperty('{prop}')")
    page.wait_for_timeout(180)


def find_blend(page, lo, hi, want, mode):
    """The progress at which the crossfade sits near `want`. Bisection, no guess."""
    best, best_u = None, None
    for _ in range(14):
        mid = (lo + hi) / 2
        approach(page, mid, mode)
        st = page.evaluate(STATE)
        blend = st['blend'] if st else 0
        if best is None or abs(blend - want) < abs(best - want):
            best, best_u = blend, mid
        if blend < want:
            lo = mid
        else:
            hi = mid
        if abs(blend - want) < 0.02:
            break
    return best_u, best


# Each handoff, and the progress bracket its crossfade lives in.
CHAPTERS = [('system', 0.24, 0.42), ('matter', 0.46, 0.60), ('world', 0.66, 0.92)]

VIEWS = [
    ('desktop', 'en', 1440, 900, 1),
    ('desktop-hidpi', 'en', 1440, 900, 2),
    ('portrait', 'en', 390, 844, 2),
    ('desktop-ar', 'ar', 1440, 900, 1),
    ('portrait-ar', 'ar', 390, 844, 2),
]


def discover(browser, lang, w, h, dpr, lo, hi):
    """The plate's source and intrinsic size at this chapter's stop."""
    ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=dpr)
    page = ctx.new_page()
    page.goto(f'{ORIGIN}/{lang}', wait_until='networkidle')
    page.evaluate(SCROLL, (lo + hi) / 2)
    settle(page)
    info = page.evaluate(
        "() => {const i = " + PLATE + "; return i && i.currentSrc"
        " ? {src: i.currentSrc, w: i.naturalWidth, h: i.naturalHeight} : null;}")
    ctx.close()
    return info


def diagonal(c):
    if not (c.get('tl') and c.get('br')):
        return None
    return ((c['br'][0] - c['tl'][0]) ** 2 + (c['br'][1] - c['tl'][1]) ** 2) ** 0.5


def run():
    results, failures, notes = [], [], []
    with sync_playwright() as play:
        browser = play.chromium.launch(executable_path=CHROME, headless=True)
        for view, lang, w, h, dpr in VIEWS:
            for chapter, lo, hi in CHAPTERS:
                info = discover(browser, lang, w, h, dpr, lo, hi)
                if not info:
                    notes.append(f'{view}/{chapter}: no plate at this stop; skipped')
                    continue
                pattern = png_bytes(marker_image(max(2, info['w']), max(2, info['h'])))

                # A cold context, with the interception installed BEFORE the first
                # navigation, so the WebGL texture cannot be served from a warm
                # memory cache and quietly miss the route.
                ctx = browser.new_context(viewport={'width': w, 'height': h},
                                          device_scale_factor=dpr)
                page = ctx.new_page()
                hits = []

                def serve(route):
                    hits.append(route.request.url)
                    route.fulfill(status=200, content_type='image/png', body=pattern)

                page.route(info['src'], serve)
                page.goto(f'{ORIGIN}/{lang}', wait_until='networkidle')
                page.add_style_tag(content=NEUTRALISE)
                approach(page, (lo + hi) / 2, 'forward')

                # Whether this handoff is image-to-image at all is MEASURED, not
                # read off the source: if the geometry wanted the same picture, it
                # asked the network for it too. One request means only the <img>
                # did, so the 3D side carries no copy of the image and "the crop
                # agrees" is not a claim that can be true or false.
                short = info['src'].split('/')[-1]
                if len(hits) < 2:
                    notes.append(
                        f'{view}/{chapter}: the geometry never requests this image '
                        f'({len(hits)} request for {short}) - the 3D surface carries no '
                        f'copy of it, so image correspondence is UNDEFINED here, not '
                        f'merely unverified')
                    ctx.close()
                    continue

                for mode in ('forward', 'reverse', 'direct'):
                    if mode == 'direct':
                        page.goto(f'{ORIGIN}/{lang}', wait_until='networkidle')
                        page.add_style_tag(content=NEUTRALISE)
                        settle(page)
                    walk = 'forward' if mode == 'direct' else mode
                    for want in (0.35, 0.60, 0.85):
                        u, blend = find_blend(page, lo, hi, want, walk)
                        if u is None:
                            continue
                        approach(page, u, walk)
                        label = f'{view}/{chapter}/{mode}/blend~{blend:.2f}'

                        plate_opacity(page, '0')
                        c1 = centroids(page.screenshot(), dpr)
                        c2 = centroids(page.screenshot(), dpr)
                        drift, _, shared, _clip = spread(c1, c2)
                        if shared < 4:
                            notes.append(f'{label}: only {shared}/4 geometry markers resolve '
                                         f'at surface opacity {1 - blend:.2f}; skipped')
                            plate_clear(page, 'opacity')
                            continue
                        if drift > CONTROL_BUDGET:
                            failures.append(f'{label}: CONTROL unstable - {drift:.2f}px between '
                                            f'two captures of an unchanged state')
                            plate_clear(page, 'opacity')
                            continue

                        geom = c1
                        plate_opacity(page, '1')
                        html = centroids(page.screenshot(), dpr)
                        worst, detail, shared, clipped = spread(geom, html)
                        dg, dh = diagonal(geom), diagonal(html)
                        scale = round(dh / dg, 4) if dg and dh else None

                        # Two unclipped corners is the minimum that says anything
                        # about both position and scale; fewer is recorded, not judged.
                        ok = shared >= 2 and worst <= BUDGET
                        results.append({'case': label, 'usable_corners': shared,
                                        'clipped_corners': clipped,
                                        'worst_px': round(worst, 2), 'per_corner_px': detail,
                                        'diagonal_ratio': scale, 'blend': round(blend, 3),
                                        'dpr': dpr, 'control_drift_px': round(drift, 2),
                                        'injected_5px_read_as': None, 'pass': ok})
                        print(f'{"PASS" if ok else "FAIL" if shared >= 2 else "----"} {label:52} '
                              f'worst={worst:5.2f}px usable={shared}/4 clipped={clipped or "-"} '
                              f'diag={scale} ctrl={drift:.2f}')
                        if shared < 2:
                            notes.append(f'{label}: only {shared} unclipped corner(s) '
                                         f'(clipped: {clipped or "none"}); recorded, not judged')
                        elif not ok:
                            failures.append(f'{label}: worst corner {worst:.2f}px > {BUDGET}px '
                                            f'({detail})')

                        page.evaluate("() => " + PLATE
                                      + f"?.style.setProperty('left','{INJECT}px','important')")
                        page.wait_for_timeout(200)
                        moved = centroids(page.screenshot(), dpr)
                        caught, _, _, _ = spread(geom, moved)
                        page.evaluate("() => " + PLATE + "?.style.removeProperty('left')")
                        results[-1]['injected_5px_read_as'] = round(caught, 2)
                        if caught <= BUDGET:
                            failures.append(f'{label}: NEGATIVE CONTROL did not fail - a '
                                            f'{INJECT}px offset measured {caught:.2f}px')
                            print(f'     negative control BROKEN: {caught:.2f}px')
                        else:
                            print(f'     negative control ok: +{INJECT}px read as {caught:.2f}px')
                        plate_clear(page, 'opacity')

                page.unroute(info['src'])
                page.goto(f'{ORIGIN}/{lang}', wait_until='networkidle')
                approach(page, (lo + hi) / 2, 'forward')
                real = page.evaluate(STATE)
                if real and real['w'] > 40:
                    print(f'     production crossfade restored: {view}/{chapter} '
                          f'handoff={real["handoff"]} fit={real["fit"]} '
                          f'blend={real["blend"]:.2f} rect={real["w"]:.0f}x{real["h"]:.0f}')
                else:
                    failures.append(f'{view}/{chapter}: production plate did not compose '
                                    f'after styles were restored')
                ctx.close()
        browser.close()

    print()
    for note in notes:
        print(f'NOTE {note}')
    print(f'\n{len(results)} comparisons, {sum(1 for r in results if r["pass"])} within '
          f'{BUDGET}px, {len(failures)} failures')
    for item in failures:
        print(f'  FAIL {item}')
    with open('registration-diagnostic.json', 'w', encoding='utf-8') as fh:
        json.dump({'budget_css_px': BUDGET, 'control_budget_css_px': CONTROL_BUDGET,
                   'injected_offset_css_px': INJECT, 'results': results,
                   'failures': failures, 'notes': notes}, fh, indent=1)
    return failures


if __name__ == '__main__':
    raise SystemExit(1 if run() else 0)
