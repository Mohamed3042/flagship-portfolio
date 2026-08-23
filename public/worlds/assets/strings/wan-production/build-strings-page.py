from __future__ import annotations

import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORLDS = ROOT.parents[2]
MANIFEST = ROOT / "clips.json"
OUTPUT = WORLDS / "strings.html"


def scene_markup(clip: dict) -> str:
    clip_id = clip["clip"]
    number = int(clip["number"])
    poster = clip["generationFirst"].replace("../keyframes/", "assets/strings/keyframes/")
    source = f"assets/strings/wan-production/accepted/{clip_id}.mp4"
    defect = clip.get("knownDefect")
    defect_markup = (
        f'<p class="defect"><span>BEST AVAILABLE</span>{html.escape(defect)}</p>' if defect else ""
    )
    return f"""<section class="scene" id="slot-{number:02d}" data-scene="pin" data-slot="{number}" data-slate="{html.escape(clip_id)}" data-src="{source}">
  <div class="stage">
    <img class="anchor" data-anchor="KF{number:02d}" src="{html.escape(poster, quote=True)}" loading="lazy" decoding="async" alt="" aria-hidden="true">
    <video data-scrub-film muted playsinline preload="none" disablepictureinpicture aria-label="{html.escape(clip['title'])}"></video>
    <div class="vignette" aria-hidden="true"></div>
    <div class="slate"><span>ACT {clip['act']} · {number:02d}/40</span><h2>{html.escape(clip['title'].replace(' -> ', ' → '))}</h2><p>{html.escape(clip_id)} · {html.escape(clip['shippedTake'])}</p>{defect_markup}</div>
    <div class="seek-state" aria-hidden="true"><i></i></div>
  </div>
</section>"""


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if len(manifest["clips"]) != 40:
        raise RuntimeError("Final film must contain exactly 40 clips")
    scenes = "\n".join(scene_markup(clip) for clip in manifest["clips"])
    html_page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0b0907"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23090806'/%3E%3Cpath d='M6 8h20M16 8v18' stroke='%23d7a64b' stroke-width='3'/%3E%3C/svg%3E"><title>CUT THE STRINGS — A Scroll Film</title>
<style>
:root{{--ink:#f4e8d2;--muted:#b9a78d;--brass:#d7a64b;--red:#e47761;--night:#090806;color-scheme:dark}}
*{{box-sizing:border-box}}html{{background:var(--night);color:var(--ink);font:15px/1.5 Inter,system-ui,sans-serif;scroll-behavior:auto}}body{{margin:0;background:var(--night);overflow-x:hidden}}a{{color:inherit}}
.chrome{{position:fixed;z-index:20;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:max(13px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) 10px max(16px,env(safe-area-inset-left));pointer-events:none;background:linear-gradient(#090806b8,transparent)}}
.brand{{font-size:11px;font-weight:850;letter-spacing:.17em}}.version{{font-size:10px;color:var(--muted);letter-spacing:.1em}}.rail{{position:fixed;z-index:21;left:0;right:0;top:0;height:2px;background:#ffffff16}}.rail i{{display:block;width:calc(var(--p,0)*100%);height:100%;background:var(--brass)}}
.prologue,.epilogue{{position:relative;min-height:100svh;display:grid;place-items:center;overflow:hidden;background:#0d0b08}}.prologue img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.58) saturate(.84)}}.prologue::after{{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,transparent 15%,#090806d6 92%)}}
.title-card{{position:relative;z-index:1;width:min(900px,90vw);text-align:center;text-shadow:0 3px 24px #000}}.title-card .eyebrow{{color:var(--brass);font-size:11px;font-weight:900;letter-spacing:.22em}}h1{{font:700 clamp(54px,11vw,150px)/.8 Georgia,serif;letter-spacing:-.07em;margin:18px 0}}.title-card p{{margin:0 auto;color:#dfd0ba;max-width:57ch;font-size:clamp(15px,2vw,21px)}}.cue{{display:block;margin-top:32px;color:var(--muted);font-size:11px;letter-spacing:.18em}}
.scene{{position:relative;height:220svh;background:#080705}}.stage{{position:sticky;top:0;height:100svh;overflow:hidden;background:#080705;isolation:isolate}}.anchor,.stage video{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}}.anchor{{z-index:0}}.stage video{{z-index:1;opacity:0;transition:opacity .12s linear}}.scene.is-ready .stage video{{opacity:1}}.vignette{{position:absolute;z-index:2;inset:0;pointer-events:none;background:linear-gradient(180deg,#0008 0,transparent 24%,transparent 67%,#000b 100%),radial-gradient(circle at 50% 50%,transparent 45%,#0006 110%)}}
.slate{{position:absolute;z-index:4;left:max(5vw,env(safe-area-inset-left));bottom:max(6vh,env(safe-area-inset-bottom));max-width:min(620px,85vw);text-shadow:0 2px 20px #000;opacity:calc(1 - min(1,var(--p,0)*4));transform:translateY(calc(var(--p,0)*-15px))}}.slate>span{{color:var(--brass);font-size:10px;font-weight:900;letter-spacing:.18em}}.slate h2{{font:700 clamp(31px,6vw,74px)/.95 Georgia,serif;letter-spacing:-.04em;margin:7px 0}}.slate>p{{margin:0;color:#e4d6c2;font-size:11px;letter-spacing:.13em}}.slate .defect{{margin-top:11px;padding:8px 10px;border-left:2px solid var(--red);background:#130a08b8;max-width:55ch;letter-spacing:0;font-size:11px}}.defect span{{display:block;color:var(--red);font-size:9px;font-weight:900;letter-spacing:.13em}}
.seek-state{{position:absolute;z-index:5;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));width:44px;height:2px;background:#ffffff25}}.seek-state i{{display:block;width:calc(var(--p,0)*100%);height:100%;background:var(--brass)}}
.epilogue{{padding:10vh 6vw;text-align:center;background:radial-gradient(circle at 50% 30%,#312315,#090806 60%)}}.end-card{{max-width:800px}}.end-card h2{{font:700 clamp(48px,10vw,120px)/.86 Georgia,serif;letter-spacing:-.06em;margin:12px 0}}.end-card p{{color:var(--muted)}}.links{{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:28px}}.links a{{border:1px solid #655039;padding:10px 14px;text-decoration:none;font-size:11px;letter-spacing:.1em}}
@media(max-width:600px){{.version{{display:none}}.slate{{left:18px;bottom:52px;max-width:calc(100vw - 54px)}}.slate h2{{font-size:39px}}.scene{{height:205svh}}.stage video,.anchor{{object-position:center center}}}}
@media(orientation:landscape) and (max-height:500px){{.chrome{{padding-top:8px}}.slate{{bottom:20px;left:22px;max-width:58vw}}.slate h2{{font-size:31px}}.slate .defect{{display:none}}.scene{{height:230svh}}}}
@media(prefers-reduced-motion:reduce){{.stage video{{transition:none}}}}
</style></head><body>
<div class="rail" data-rail aria-hidden="true"><i></i></div><header class="chrome"><div class="brand">CUT THE STRINGS</div><div class="version">FINAL 1.0.0 · 40 SLOTS · SCROLL TO SCRUB</div></header>
<section class="prologue" id="top"><img data-anchor="KF00" src="assets/strings/keyframes/CTS-KF00-style-anchor.png" alt="The approved CUT THE STRINGS style anchor"><div class="title-card"><div class="eyebrow">A 200-SECOND SCROLL FILM</div><h1>CUT THE<br>STRINGS</h1><p>Forty existing takes. No missing slot. Scroll forward or backward: your hand is the playhead.</p><span class="cue">SCROLL TO ENTER THE WORKSHOP ↓</span></div></section>
{scenes}
<section class="epilogue"><div class="end-card"><span class="eyebrow">40 / 40 · VERIFIED</span><h2>NO STRINGS.</h2><p>Four best-available defects are disclosed on their frames. The film remains whole.</p><div class="links"><a href="assets/strings/CUT-THE-STRINGS-FINAL.mp4">OPEN SILENT MASTER</a><a href="assets/strings/wan-production/WAN-GENERATION-BOARD.html">OPEN TAKE BOARD</a></div></div></section>
<script src="cinema.js?v=8"></script><script src="strings.js?v=1.0.0"></script></body></html>"""
    OUTPUT.write_text(html_page, encoding="utf-8", newline="\n")
    print("STRINGS_PAGE_GREEN slots=40 anchors=41")


if __name__ == "__main__":
    main()
