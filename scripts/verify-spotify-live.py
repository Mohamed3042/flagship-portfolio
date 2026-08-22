"""Rendered browser gate for the 2026-08-22 Spotify room-wides cut.

Grades the actual source/build/staged/public page passed through ``--base-url``.
It proves the post-cut scene/solo map, byte ranges, retained Side A scrubs,
Side B's paused bidirectional scroll clock, desktop and both phone orientations,
Arabic parity, full down/up traversal, and painted decoded pixels.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WAN = [
    ("spotify/live/room01-silence-recut.mp4", 5.0),
    ("spotify/live/room02-contact-recut.mp4", 5.0),
    ("spotify/live/room03-runway-recut.mp4", 5.0),
    ("spotify/live/room04-build-recut.mp4", 5.0),
    ("spotify/live/room05-lounge-recut.mp4", 5.0),
    ("spotify/live/room06-chorus-recut.mp4", 5.0),
    ("spotify/live/room07-needle-up-recut.mp4", 5.0),
]
CYCLES = [
    ("spotify/shots/s04-arm.mp4", 6.0),
    ("spotify/shots/s02-pulse.mp4", 5.0),
    ("spotify/shots/s05-needle.mp4", 7.0),
    ("spotify/shots/s07-quantize.mp4", 8.0),
    ("spotify/shots/s09-canyon.mp4", 10.0),
    ("spotify/shots/s06-groove.mp4", 7.0),
    ("spotify/shots/s10-t01.mp4", 7.0),
    ("spotify/shots/s11-t02.mp4", 7.0),
    ("spotify/shots/s12-t03.mp4", 6.0),
    ("spotify/shots/s13-master.mp4", 9.0),
]
SIDE_A_ORDER = [
    WAN[0], CYCLES[0], CYCLES[1], WAN[1], CYCLES[2], WAN[2], CYCLES[3],
    CYCLES[4], CYCLES[5], WAN[3], CYCLES[6], CYCLES[7], CYCLES[8], WAN[4],
    CYCLES[9], WAN[5], WAN[6],
]
EXPECTED_SOLO = {
    "spotify/live/room01-silence-recut.mp4": 1,
    "spotify/shots/s04-arm.mp4": 2,
    "spotify/shots/s02-pulse.mp4": 4,
    "spotify/live/room02-contact-recut.mp4": 5,
    "spotify/shots/s05-needle.mp4": 7,
    "spotify/live/room03-runway-recut.mp4": 8,
    "spotify/shots/s07-quantize.mp4": 10,
    "spotify/shots/s09-canyon.mp4": 13,
    "spotify/shots/s06-groove.mp4": 14,
    "spotify/live/room04-build-recut.mp4": 15,
    "spotify/shots/s10-t01.mp4": 17,
    "spotify/shots/s11-t02.mp4": 19,
    "spotify/shots/s12-t03.mp4": 21,
    "spotify/live/room05-lounge-recut.mp4": 23,
    "spotify/shots/s13-master.mp4": 25,
    "spotify/live/room06-chorus-recut.mp4": 26,
    "spotify/live/room07-needle-up-recut.mp4": 28,
    "#flight": 30,
}
PROFILES = [
    ("desktop-1440x1000", 1440, 1000, 1, False, False),
    ("phone-portrait-390x844-dpr3", 390, 844, 3, True, True),
    ("phone-landscape-844x390-dpr3", 844, 390, 3, True, True),
]

PLATE_JS = """
(sel) => {
  const s=document.querySelector(sel), v=s?.querySelector('.plate video'); let hash=null;
  if(v && v.readyState>=2 && v.videoWidth){
    const c=document.createElement('canvas'); c.width=64; c.height=27;
    const x=c.getContext('2d',{alpha:false}); x.drawImage(v,0,0,64,27);
    const b=x.getImageData(0,0,64,27).data; let h=2166136261;
    for(const n of b){h^=n;h=Math.imul(h,16777619)} hash=(h>>>0).toString(16).padStart(8,'0');
  }
  return {p:s?.style.getPropertyValue('--p'),t:v?+v.currentTime.toFixed(3):null,
    duration:v?+v.duration.toFixed(3):null,readyState:v?.readyState??0,
    dims:v?`${v.videoWidth}x${v.videoHeight}`:null,paused:v?.paused??null,
    ready:s?.classList.contains('plate-ready')??false,
    missing:s?.classList.contains('plate-missing')??true,hash};
}
"""

FLIGHT_JS = """
() => {
  const f=document.getElementById('flight'), vids=[...f.querySelectorAll('.flightplate video')];
  const v=vids.find(x=>x.classList.contains('on')), cap=f.querySelector('.legcap.on'); let hash=null;
  if(v && v.readyState>=2 && v.videoWidth){
    const c=document.createElement('canvas'); c.width=64; c.height=27;
    const x=c.getContext('2d',{alpha:false}); x.drawImage(v,0,0,64,27);
    const b=x.getImageData(0,0,64,27).data; let h=2166136261;
    for(const n of b){h^=n;h=Math.imul(h,16777619)} hash=(h>>>0).toString(16).padStart(8,'0');
  }
  return {mode:f.className,legno:f.querySelector('.legno')?.textContent,
    clip:v?.currentSrc.split('/').pop(),t:v?+v.currentTime.toFixed(3):null,
    readyState:v?.readyState??0,dims:v?`${v.videoWidth}x${v.videoHeight}`:null,
    paused:v?.paused??null,hash,activeCapOpacity:cap?+getComputedStyle(cap).opacity:0,
    activeVidOpacity:v?+getComputedStyle(v).opacity:0,
    otherCapOpacity:Math.max(0,...[...f.querySelectorAll('.legcap')].filter(x=>x!==cap).map(x=>+getComputedStyle(x).opacity)),
    otherVidOpacity:Math.max(0,...vids.filter(x=>x!==v).map(x=>+getComputedStyle(x).opacity))};
}
"""


def media_url(base: str, path: str) -> str:
    return urljoin(base.rstrip("/") + "/", "worlds/" + path)


def range_probe(base: str, path: str) -> dict:
    try:
        request = Request(media_url(base, path), headers={
            "Range": "bytes=0-1", "User-Agent": "spotify-live-gate/2"})
        with urlopen(request, timeout=30) as response:
            body = response.read()
            return {"path": path, "status": response.status,
                    "acceptRanges": response.headers.get("Accept-Ranges"),
                    "contentRange": response.headers.get("Content-Range"), "bytes": len(body)}
    except HTTPError as error:
        return {"path": path, "status": error.code, "acceptRanges": None,
                "contentRange": None, "bytes": 0}


def scroll_scene(page, selector: str, progress: float) -> None:
    page.evaluate("""([sel,p])=>{const s=document.querySelector(sel);const y=s.getBoundingClientRect().top+scrollY;
      const travel=s.getBoundingClientRect().height-innerHeight;scrollTo({top:Math.round(y+p*travel),behavior:'instant'});}""",
                  [selector, progress])


def scroll_flight(page, leg: int, fraction: float) -> None:
    page.evaluate("""([leg,fraction])=>{const s=document.getElementById('flight');const y=s.getBoundingClientRect().top+scrollY;
      const travel=s.getBoundingClientRect().height-innerHeight;
      scrollTo({top:Math.round(y+((leg+fraction)/12)*travel),behavior:'instant'});}""",
                  [leg, fraction])


def settle_plate(page, selector: str, want: float, budget: int = 8000) -> dict:
    waited = 0
    while waited < budget:
        state = page.evaluate(PLATE_JS, selector)
        if (state["readyState"] >= 2 and state["hash"] and state["paused"]
                and abs(state["t"] - want) < .13):
            state["settleMs"] = waited; return state
        page.wait_for_timeout(100); waited += 100
    state = page.evaluate(PLATE_JS, selector); state["settleMs"] = waited; return state


def settle_flight(page, leg: int, want: float, budget: int = 8000) -> dict:
    waited = 0; expected = f"{leg + 1:02d}"
    while waited < budget:
        state = page.evaluate(FLIGHT_JS)
        settled = (state["activeCapOpacity"] > .98 and state["otherCapOpacity"] < .02
                   and state["activeVidOpacity"] > .98 and state["otherVidOpacity"] < .02)
        if (state["legno"] == expected and state["readyState"] >= 2 and state["hash"]
                and state["paused"] and settled and abs(state["t"] - want) < .13):
            state["settleMs"] = waited; return state
        page.wait_for_timeout(100); waited += 100
    state = page.evaluate(FLIGHT_JS); state["settleMs"] = waited; return state


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4602")
    parser.add_argument("--target", default="source")
    parser.add_argument("--out", default="proof/spotify-room-cut")
    parser.add_argument("--headed", action="store_true")
    args = parser.parse_args()
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    url = args.base_url.rstrip("/") + "/worlds/spotify.html"
    failures: list[str] = []
    report = {"target": args.target, "url": url, "ranges": [], "profiles": []}

    print("== range transport ==")
    for path, _duration in SIDE_A_ORDER:
        state = range_probe(args.base_url, path); report["ranges"].append(state)
        good = (state["status"] == 206 and state["acceptRanges"] == "bytes" and state["bytes"] == 2
                and (state["contentRange"] or "").startswith("bytes 0-1/"))
        print(f"  {'GREEN' if good else 'RED'} {path} HTTP {state['status']} {state['acceptRanges']}")
        if not good: failures.append(f"range:{path}:{state}")

    with sync_playwright() as pw:
        browser = None
        for channel in ("chrome", "msedge", None):
            try:
                browser = pw.chromium.launch(headless=not args.headed,
                                             **({"channel": channel} if channel else {}))
                print(f"browser={channel or 'bundled chromium'}"); break
            except Exception as error:  # noqa: BLE001
                print(f"  {channel or 'bundled'} unavailable: {str(error).splitlines()[0]}")
        if browser is None:
            print("RESULT: FAIL (no browser)"); return 1

        for name, width, height, dpr, mobile, touch in PROFILES:
            context = browser.new_context(viewport={"width": width, "height": height},
                                          device_scale_factor=dpr, is_mobile=mobile,
                                          has_touch=touch, reduced_motion="no-preference")
            context.add_init_script("""window.__playCalls=0;const original=HTMLMediaElement.prototype.play;
              HTMLMediaElement.prototype.play=function(){window.__playCalls++;return original.apply(this,arguments)}""")
            page = context.new_page(); browser_errors: list[str] = []
            page.on("console", lambda message: browser_errors.append(
                f"console.{message.type}:{message.location.get('url', '')}:{message.text}")
                    if message.type == "error" else None)
            page.on("pageerror", lambda error: browser_errors.append(f"pageerror:{error}"))
            page.on("requestfailed", lambda request: browser_errors.append(
                f"requestfailed:{request.url}:{request.failure}"))
            page.goto(url, wait_until="load"); page.wait_for_timeout(1000)

            static = page.evaluate("""() => {
              const scenes=[...document.querySelectorAll('[data-scene]')];
              const plates=[...document.querySelectorAll('[data-plate]')].filter(s=>!s.dataset.plate.includes('/live/j'));
              const map=Object.fromEntries(plates.map(s=>[s.dataset.plate,scenes.indexOf(s)]));
              map['#flight']=scenes.indexOf(document.getElementById('flight'));
              const room07=document.querySelector('[data-plate="spotify/live/room07-needle-up-recut.mp4"]');
              return {width:innerWidth,height:innerHeight,dpr:devicePixelRatio,sceneCount:scenes.length,
                plateOrder:plates.map(s=>s.dataset.plate),soloMap:map,
                overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
                scrollHeight:document.documentElement.scrollHeight,
                minPlateScrub:Math.min(...plates.map(s=>s.getBoundingClientRect().height-innerHeight)),
                en:document.querySelectorAll('.L.en').length,ar:document.querySelectorAll('.L.ar').length,
                theater:[...document.querySelector('[data-theater]').querySelectorAll('.L')].map(x=>x.textContent.trim()),
                credits:document.querySelector('.credits').innerText,
                room07:{slate:room07.dataset.slate,aria:room07.getAttribute('aria-label'),rtag:room07.querySelector('.rtag').innerText},
                protected:{finale:!!document.querySelector('.sc-fin'),flip:!!document.querySelector('.flip'),credits:!!document.querySelector('.credits')},
                pointerCoarse:matchMedia('(pointer: coarse)').matches,maxTouchPoints:navigator.maxTouchPoints};
            }""")
            expected_order = [path for path, _ in SIDE_A_ORDER]
            checks = {
                "viewport": static["width"] == width and static["height"] == height and static["dpr"] == dpr,
                "sceneCount": static["sceneCount"] == 32,
                "plateOrder": static["plateOrder"] == expected_order,
                "soloMap": static["soloMap"] == EXPECTED_SOLO,
                "overflow": static["overflow"] <= 1,
                "scrubBudget": static["minPlateScrub"] >= height * 2 - 2,
                "arabicParity": static["en"] == static["ar"],
                "theaterRuntime": static["theater"] == ["▸ Side A · 1:20", "▸ الوجه أ · ١:٢٠"],
                "creditsTruth": "7 photoreal room plates" in static["credits"] and "1,920 frames" in static["credits"],
                "room07Truth": (static["room07"]["slate"] == "Side A/7 · Needle-up runout"
                                 and static["room07"]["aria"].startswith("Live plate")
                                 and "150 FRAMES · 1280×660" in static["room07"]["rtag"]),
                "protected": all(static["protected"].values()),
                "inputMode": (not mobile or (static["pointerCoarse"] and static["maxTouchPoints"] > 0)),
            }
            for key, good in checks.items():
                if not good: failures.append(f"{name}:{key}")

            plate_rows = []
            for path, duration in SIDE_A_ORDER:
                selector = f"[data-plate='{path}']"
                wants = ((.005, 2.5, 4.9) if path.startswith("spotify/live/room")
                         else (.005, duration / 2, duration - .05))
                states = []
                for want in wants:
                    scroll_scene(page, selector, min(.999, want / duration))
                    state = settle_plate(page, selector, want); states.append(state)
                    expected_dims = "1280x660" if path.startswith("spotify/live/room") else "1280x536"
                    if (state["readyState"] < 2 or state["missing"] or not state["ready"]
                            or not state["paused"] or not state["hash"] or state["dims"] != expected_dims
                            or abs(state["t"] - want) >= .13):
                        failures.append(f"{name}:plate:{path}:{want}:{state}")
                plate_rows.append({"path": path, "wants": wants, "states": states})

            forward: dict[int, dict] = {}
            for leg in range(12):
                scroll_flight(page, leg, .5); state = settle_flight(page, leg, 2.5); forward[leg] = state
                if ("mode-scrub" not in state["mode"] or state["dims"] != "1600x670"
                        or not state["paused"] or not state["hash"] or state["legno"] != f"{leg+1:02d}"):
                    failures.append(f"{name}:flight-forward:{leg}:{state}")
            reverse = []
            for leg in reversed(range(12)):
                scroll_flight(page, leg, .5); state = settle_flight(page, leg, 2.5); reverse.append(state)
                if state["hash"] != forward[leg]["hash"] or state["clip"] != forward[leg]["clip"]:
                    failures.append(f"{name}:flight-reverse:{leg}:{state}:{forward[leg]}")

            scroll_flight(page, 0, .1); early = settle_flight(page, 0, .5)
            scroll_flight(page, 0, .85); late = settle_flight(page, 0, 4.25)
            if early["clip"] != late["clip"] or late["t"] - early["t"] < 3.5 or early["hash"] == late["hash"]:
                failures.append(f"{name}:flight-within-leg:{early}:{late}")
            before = page.evaluate(FLIGHT_JS)["t"]
            if mobile: page.touchscreen.tap(round(width * .83), round(height * .5))
            page.wait_for_timeout(650); after = page.evaluate(FLIGHT_JS)["t"]
            if abs(after - before) > .03: failures.append(f"{name}:stationary-drift:{before}->{after}")

            page.click("[data-lang-toggle]"); page.wait_for_timeout(250)
            lang = page.evaluate("() => [document.documentElement.lang,document.documentElement.dir]")
            if lang != ["ar", "rtl"]: failures.append(f"{name}:language:{lang}")
            page.click("[data-lang-toggle]")

            travel = page.evaluate("() => document.documentElement.scrollHeight-innerHeight")
            for step in range(61):
                page.evaluate("y=>scrollTo({top:y,behavior:'instant'})", round(travel * step / 60)); page.wait_for_timeout(15)
            bottom = page.evaluate("() => ({y:scrollY,max:document.documentElement.scrollHeight-innerHeight,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})")
            page.screenshot(path=str(out / f"{name}-ending.png"), full_page=False)
            for step in reversed(range(61)):
                page.evaluate("y=>scrollTo({top:y,behavior:'instant'})", round(travel * step / 60)); page.wait_for_timeout(15)
            top = page.evaluate("() => scrollY")
            if abs(bottom["max"] - bottom["y"]) > 2 or bottom["overflow"] > 1 or top > 2:
                failures.append(f"{name}:traversal:{bottom}:top={top}")

            play_calls = page.evaluate("() => window.__playCalls")
            if play_calls != 0: failures.append(f"{name}:playCalls:{play_calls}")
            expected_codes = ["ERR_ABORTED", "ERR_FAILED"]
            # Chrome labels deliberately cancelled seek requests from the local
            # connection-closing range harness as INVALID_HTTP_RESPONSE. The
            # same code remains fatal on Pages; every local asset is separately
            # required to pass a 206 byte probe and three painted-frame seeks.
            if url.startswith("http://127.0.0.1:"):
                expected_codes.append("ERR_INVALID_HTTP_RESPONSE")
            expected_aborts = [e for e in browser_errors
                if any(code in e for code in expected_codes)
                and any(s in e for s in (".mp4", ".jpg", ".png"))]
            fatal_errors = [e for e in browser_errors if e not in expected_aborts and "favicon" not in e.lower()]
            if fatal_errors: failures.extend(f"{name}:browser:{e}" for e in fatal_errors)

            report["profiles"].append({"name": name, "static": static, "checks": checks,
                "plates": plate_rows, "flightForward": forward, "flightReverse": reverse,
                "withinLeg": [early, late], "stationary": [before, after],
                "traversal": {"bottom": bottom, "top": top}, "playCalls": play_calls,
                "expectedAbortedMedia": expected_aborts, "fatalErrors": fatal_errors})
            print(f"{name}: scenes={static['sceneCount']} plates={len(static['plateOrder'])} "
                  f"height={static['scrollHeight']} overflow={static['overflow']} "
                  f"play={play_calls} fatalErrors={len(fatal_errors)}")
            context.close()
        browser.close()

    report["failures"] = failures
    (out / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"REPORT={str((out / 'report.json').resolve())}")
    print("RESULT: " + ("PASS" if not failures else f"FAIL ({len(failures)})"))
    for failure in failures[:30]: print("  " + failure)
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
