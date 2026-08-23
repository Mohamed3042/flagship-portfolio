from __future__ import annotations

import hashlib
import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CLIPS_PATH = ROOT / "clips.json"
NEGATIVE_PATH = ROOT / "negative-prompt.txt"
PROMPTS_DIR = ROOT / "wan-prompts"
MAIN_BOARD_PATH = ROOT / "WAN-GENERATION-BOARD.html"
R3_BOARD_PATH = ROOT / "WAN-R3-GENERATION-BOARD.html"

R3_IDS = (
    "CTS-A-009",
    "CTS-A-012",
    "CTS-A-012B",
    "CTS-A-016",
    "CTS-A-016B",
    "CTS-A-020",
    "CTS-A-022",
    "CTS-A-022B",
    "CTS-A-039",
    "CTS-A-039B",
)

R3_OVERRIDES = {
    "CTS-A-009": {
        "number": "009",
        "act": 2,
        "title": "First Cut -> The Photograph",
        "storyboard": "KF09 -> KF10",
        "generationFirst": "../keyframes/CTS-KF09-first-cut.png",
        "generationLast": "../keyframes/CTS-KF10-the-photograph.png",
        "targetId": "KF10",
        "sortKey": 9,
        "camera": "85 mm macro -> 50 mm pull-back and tilt-up",
        "action": "The curl drops; the camera reveals the photograph; the caliper tips land and stop.",
    },
    "CTS-A-012": {
        "number": "012",
        "act": 2,
        "title": "Two Swatches -> Swatches Fill Lens",
        "storyboard": "KF12 -> KF12M",
        "generationFirst": "../keyframes/CTS-KF12-two-swatches.png",
        "generationLast": "../keyframes/CTS-KF12M-swatches-fill-lens.png",
        "targetId": "KF12M",
        "sortKey": 12,
        "camera": "Locked 90 mm top-down macro",
        "action": "Hands raise the two joined swatches until paper fills the lens.",
    },
    "CTS-A-012B": {
        "number": "012B",
        "act": 2,
        "title": "Swatches Fill Lens -> Neck Seam",
        "storyboard": "KF12M -> KF13",
        "generationFirst": "../keyframes/CTS-KF12M-swatches-fill-lens.png",
        "generationLast": "../keyframes/CTS-KF13-neck-seam.png",
        "targetId": "KF13",
        "sortKey": 12.5,
        "camera": "Occlusion reveal -> 60 mm front view",
        "action": "Hands lower the swatches; the hero is revealed and the seam brightens once.",
    },
    "CTS-A-016": {
        "number": "016",
        "act": 2,
        "title": "Cloth From Photo -> Linen Fills Lens",
        "storyboard": "KF16 -> KF16M",
        "generationFirst": "../keyframes/CTS-KF16-cloth-from-photo.png",
        "generationLast": "../keyframes/CTS-KF16M-linen-fills-lens.png",
        "targetId": "KF16M",
        "sortKey": 16,
        "camera": "Locked 50 mm bench view",
        "action": "Hands raise one cream linen panel until the weave fills the lens.",
    },
    "CTS-A-016B": {
        "number": "016B",
        "act": 2,
        "title": "Linen Fills Lens -> The Fitting",
        "storyboard": "KF16M -> KF17",
        "generationFirst": "../keyframes/CTS-KF16M-linen-fills-lens.png",
        "generationLast": "../keyframes/CTS-KF17-the-fitting.png",
        "targetId": "KF17",
        "sortKey": 16.5,
        "camera": "Occlusion reveal -> 55 mm fitting view",
        "action": "Hands lower the linen; one hand pins one brass fastening and stops.",
    },
    "CTS-A-020": {
        "number": "020",
        "act": 3,
        "title": "First Motion -> The Breath",
        "storyboard": "KF20 -> KF21",
        "generationFirst": "../keyframes/CTS-KF20-first-motion.png",
        "generationLast": "../keyframes/CTS-KF21-the-breath.png",
        "targetId": "KF21",
        "sortKey": 20,
        "camera": "50 mm two-shot -> 85 mm chest macro",
        "action": "The camera passes the hands and control bar; the chest breathes once and stops.",
    },
    "CTS-A-022": {
        "number": "022",
        "act": 3,
        "title": "The Cut -> Unstrung Bench Level",
        "storyboard": "KF22 -> KF22M",
        "generationFirst": "../keyframes/CTS-KF22-the-cut.png",
        "generationLast": "../keyframes/CTS-KF22M-unstrung-bench-level.png",
        "targetId": "KF22M",
        "sortKey": 22,
        "camera": "40 mm high -> 35 mm bench level",
        "action": "The strings are cut; the ends fall; the camera lowers to the centred unstrung hero.",
    },
    "CTS-A-022B": {
        "number": "022B",
        "act": 3,
        "title": "Unstrung Bench Level -> First Step",
        "storyboard": "KF22M -> KF23",
        "generationFirst": "../keyframes/CTS-KF22M-unstrung-bench-level.png",
        "generationLast": "../keyframes/CTS-KF23-first-step.png",
        "targetId": "KF23",
        "sortKey": 22.5,
        "camera": "Bench-level 35 mm; ease forward one hand width",
        "action": "The unstrung hero takes exactly one grounded step and settles.",
    },
    "CTS-A-039": {
        "number": "039",
        "act": 5,
        "title": "Crate Outbound -> Seated Before Open Crate",
        "storyboard": "KF39 -> KF39M",
        "generationFirst": "../keyframes/CTS-KF39-crate-outbound.png",
        "generationLast": "../keyframes/CTS-KF39M-seated-before-open-crate.png",
        "targetId": "KF39M",
        "sortKey": 39,
        "camera": "Locked 40 mm workshop view",
        "action": "The hero enters from frame-left, pauses by the crate, sits, and rests her hands.",
    },
    "CTS-A-039B": {
        "number": "039B",
        "act": 5,
        "title": "Seated Before Open Crate -> Last Light",
        "storyboard": "KF39M -> KF40",
        "generationFirst": "../keyframes/CTS-KF39M-seated-before-open-crate.png",
        "generationLast": "../keyframes/CTS-KF40-last-light.png",
        "targetId": "KF40",
        "sortKey": 39.5,
        "camera": "40 mm -> 50 mm slow dolly backward",
        "action": "The hero closes the crate; the camera reveals the whole workshop and settles.",
    },
}


def read_utf8(path: Path) -> str:
    return path.read_bytes().decode("utf-8")


def write_utf8(path: Path, content: str) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write(content)


def prompt_path(clip_id: str) -> Path:
    return PROMPTS_DIR / f"{clip_id}.txt"


def load_prompts() -> dict[str, str]:
    prompts = {clip_id: read_utf8(prompt_path(clip_id)) for clip_id in R3_IDS}
    for clip_id, prompt in prompts.items():
        if not prompt.endswith("\n"):
            raise RuntimeError(f"Canonical prompt lost terminal LF: {clip_id}")
    return prompts


def integrate_manifest(prompts: dict[str, str]) -> dict:
    manifest = json.loads(read_utf8(CLIPS_PATH))
    original = {clip["clip"]: clip for clip in manifest["clips"] if not clip["clip"].endswith("B")}
    if len(original) != 40:
        raise RuntimeError(f"Expected 40 base clips, found {len(original)}")

    integrated: list[dict] = []
    for index in range(1, 41):
        clip_id = f"CTS-A-{index:03d}"
        clip = original[clip_id]
        clip["sortKey"] = index
        clip["outputFilename"] = f"{clip_id}.mp4"
        if clip_id in R3_OVERRIDES:
            clip.update(R3_OVERRIDES[clip_id])
            clip["prompt"] = prompts[clip_id]
            clip["promptSource"] = f"wan-prompts/{clip_id}.txt"
            clip["r3"] = True
        integrated.append(clip)

        split_id = f"{clip_id}B"
        if split_id in R3_OVERRIDES:
            split = {
                "clip": split_id,
                **R3_OVERRIDES[split_id],
                "acceptedFilename": f"accepted/{split_id}.mp4",
                "rejectedPattern": f"rejected/{split_id}-attempt-##.mp4",
                "outputFilename": f"{split_id}.mp4",
                "sceneFamily": "workshop",
                "seed": 271101,
                "flf": True,
                "prompt": prompts[split_id],
                "promptSource": f"wan-prompts/{split_id}.txt",
                "r3": True,
            }
            integrated.append(split)

    if [clip["clip"] for clip in integrated if clip["clip"] in R3_IDS] != list(R3_IDS):
        raise RuntimeError("R3 ordering invariant failed")

    negative_prompt = read_utf8(NEGATIVE_PATH)
    manifest.update(
        {
            "status": "owner-generation-approved",
            "r3ApprovedByOwner": {"phrase": "APPROVE STILLS", "date": "2026-08-23"},
            "filmClipCount": 44,
            "r3ClipCount": 10,
            "ownerGenerationOnly": True,
            "jobsSubmitted": None,
            "creditsSpent": None,
            "exactSpend": "[LOST] unless the owner supplies a WAN manifest",
            "negativePrompt": negative_prompt,
            "approvedMidStills": [
                "../keyframes/CTS-KF12M-swatches-fill-lens.png",
                "../keyframes/CTS-KF16M-linen-fills-lens.png",
                "../keyframes/CTS-KF22M-unstrung-bench-level.png",
                "../keyframes/CTS-KF39M-seated-before-open-crate.png",
            ],
            "credits": {
                "r3Minimum": 100,
                "r3MinimumStatus": "[INFERRED]",
                "r3Planned": 150,
                "r3PlannedStatus": "[INFERRED]",
                "cumulativeMinimum": 580,
                "cumulativeMinimumStatus": "[INFERRED]",
                "cumulativePlanned": 600,
                "cumulativePlannedStatus": "[INFERRED]",
                "stopAndReportAbove": 660,
                "exactSpend": None,
                "exactSpendStatus": "[LOST]",
            },
            "clips": integrated,
        }
    )
    return manifest


def json_for_script(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def card_markup(clip: dict) -> str:
    prompt = html.escape(clip["prompt"], quote=True)
    first = html.escape(clip["generationFirst"], quote=True)
    last = html.escape(clip["generationLast"], quote=True)
    accepted = html.escape(clip["acceptedFilename"], quote=True)
    output = html.escape(clip["outputFilename"], quote=True)
    clip_id = html.escape(clip["clip"], quote=True)
    title = html.escape(clip["title"], quote=True)
    storyboard = html.escape(clip["storyboard"], quote=True)
    camera = html.escape(clip.get("camera", "Endpoint framing controls."), quote=True)
    action = html.escape(clip.get("action", "Match both supplied endpoint frames."), quote=True)
    prompt_source = html.escape(clip.get("promptSource", "clips.json"), quote=True)
    r3 = " r3-card" if clip.get("r3") else ""
    return f"""<article class=\"clip-card{r3}\" data-clip=\"{clip_id}\" data-act=\"{clip['act']}\">
  <div class=\"card-head\"><div><span class=\"eyebrow\">ACT {clip['act']} · {storyboard}</span><h2>{clip_id}</h2><p>{title}</p></div><label class=\"done\"><input type=\"checkbox\" data-done=\"{clip_id}\"><span>DONE</span></label></div>
  <div class=\"frames\"><figure><img src=\"{first}\" alt=\"{clip_id} first frame\"><figcaption>FIRST · @Image1</figcaption></figure><div class=\"arrow\">→</div><figure><img src=\"{last}\" alt=\"{clip_id} last frame\"><figcaption>LAST · @Image2</figcaption></figure></div>
  <div class=\"spec\"><p><b>ACTION</b> {action}</p><p><b>CAMERA</b> {camera}</p></div>
  <div class=\"file-grid\"><p><span>EXACT OUTPUT</span><code>{output}</code></p><p><span>ACCEPTED PATH</span><code>{accepted}</code></p><p><span>SEED</span><code>{clip['seed']}</code></p></div>
  <div class=\"prompt-head\"><span>CANONICAL PROMPT · {prompt_source}</span><button type=\"button\" data-copy=\"prompt-{clip['number']}\">COPY</button></div>
  <textarea id=\"prompt-{clip['number']}\" class=\"prompt\" readonly>{prompt}</textarea></article>"""


def render_board(manifest: dict, clips: list[dict], board_name: str, board_code: str) -> str:
    cards = "\n".join(card_markup(clip) for clip in clips)
    negative = html.escape(manifest["negativePrompt"], quote=True)
    data = {
        "board": board_code,
        "filmClipCount": 44,
        "boardClipCount": len(clips),
        "ownerGenerationOnly": True,
        "exactSpendStatus": "[LOST]",
        "credits": manifest["credits"],
        "negativePrompt": manifest["negativePrompt"],
        "clips": clips,
    }
    return f"""<!doctype html>
<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>CUT THE STRINGS · {html.escape(board_name)}</title>
<style>
:root{{--ink:#f4ead9;--muted:#aa9b84;--paper:#15130f;--panel:#211d17;--panel2:#2a241c;--line:#4b3d2c;--brass:#d7a64b;--lime:#b6c276;--red:#d8745e;--green:#88a874;color-scheme:dark}}
*{{box-sizing:border-box}}html{{background:#0c0b09;color:var(--ink);font:14px/1.45 Inter,ui-sans-serif,system-ui,sans-serif}}body{{margin:0;background:radial-gradient(circle at 50% 0,#2b2318 0,transparent 38rem),#0c0b09;min-width:0}}button,input,textarea{{font:inherit}}code{{font-family:"Cascadia Mono",Consolas,monospace;overflow-wrap:anywhere}}
.shell{{width:min(1480px,100%);margin:auto;padding:26px}}.mast{{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:end;padding:26px;border:1px solid var(--line);background:linear-gradient(135deg,rgba(39,32,23,.96),rgba(18,16,12,.96));box-shadow:0 24px 80px #0008}}.kicker,.eyebrow,.prompt-head,.file-grid span{{font-size:11px;letter-spacing:.16em;font-weight:800;color:var(--brass)}}h1{{font:700 clamp(31px,5vw,66px)/.95 Georgia,serif;letter-spacing:-.04em;margin:5px 0 12px}}.mast p{{margin:0;color:var(--muted);max-width:78ch}}.state{{text-align:right}}.state strong{{display:block;color:var(--green);letter-spacing:.08em}}.state span{{color:var(--muted)}}
.ledger{{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;margin:16px 0;background:var(--line);border:1px solid var(--line)}}.ledger div{{background:#15130f;padding:16px}}.ledger span{{display:block;color:var(--muted);font-size:11px;letter-spacing:.12em}}.ledger b{{font-size:18px}}.lost{{color:var(--red)!important}}
.tools{{position:sticky;top:0;z-index:10;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 0;background:linear-gradient(#0c0b09 75%,transparent)}}.tools button,.prompt-head button{{border:1px solid var(--line);color:var(--ink);background:var(--panel);padding:8px 12px;cursor:pointer}}.tools button.active{{border-color:var(--brass);color:var(--brass)}}.tools input{{min-width:220px;flex:1;border:1px solid var(--line);color:var(--ink);background:var(--panel);padding:9px 12px}}
.cards{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}.clip-card{{min-width:0;border:1px solid var(--line);background:linear-gradient(160deg,var(--panel),#15130f);padding:18px;box-shadow:0 14px 40px #0005}}.clip-card.r3-card{{border-top:3px solid var(--brass)}}.card-head{{display:flex;justify-content:space-between;gap:12px}}.card-head h2{{font:700 30px/1 Georgia,serif;margin:4px 0}}.card-head p{{margin:0;color:var(--muted)}}.done{{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:11px;letter-spacing:.12em}}.done input{{accent-color:var(--lime)}}
.frames{{display:grid;grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr);align-items:center;margin:16px 0;gap:7px}}figure{{margin:0;min-width:0}}figure img{{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border:1px solid #5d4b36;background:#080706}}figcaption{{margin-top:5px;color:var(--muted);font-size:10px;letter-spacing:.11em}}.arrow{{color:var(--brass);font-size:23px;text-align:center}}
.spec{{border-left:2px solid var(--brass);padding-left:12px}}.spec p{{margin:7px 0;color:#d6c9b6}}.spec b{{color:var(--brass);font-size:10px;letter-spacing:.12em}}.file-grid{{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;margin:13px 0}}.file-grid p{{min-width:0;margin:0;padding:9px;background:#0e0c09;border:1px solid #352c21}}.file-grid span,.file-grid code{{display:block}}.file-grid code{{margin-top:3px;font-size:12px}}
.prompt-head{{display:flex;justify-content:space-between;align-items:center;gap:10px}}.prompt{{display:block;width:100%;height:186px;resize:vertical;margin-top:7px;padding:12px;border:1px solid var(--line);background:#0d0b08;color:#eee3d3;font:12px/1.55 "Cascadia Mono",Consolas,monospace}}
.negative{{margin-top:18px;padding:18px;border:1px solid var(--line);background:var(--panel)}}.negative textarea{{height:96px}}footer{{padding:25px 0;color:var(--muted);display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap}}.hidden{{display:none!important}}
@media(max-width:820px){{.shell{{padding:12px}}.mast{{grid-template-columns:1fr;padding:18px}}.state{{text-align:left}}.ledger{{grid-template-columns:1fr 1fr}}.cards{{grid-template-columns:1fr}}.tools{{position:relative}}}}
@media(max-width:460px){{.shell{{padding:8px}}.mast{{padding:14px}}h1{{font-size:37px}}.ledger{{grid-template-columns:1fr}}.clip-card{{padding:11px}}.frames{{grid-template-columns:1fr}}.arrow{{transform:rotate(90deg)}}.file-grid{{grid-template-columns:1fr}}.prompt{{height:235px}}.tools input{{min-width:100%;width:100%}}}}
</style></head><body><main class=\"shell\"><header class=\"mast\"><div><div class=\"kicker\">OWNER WAN 2.7 · R3 · GENERATION-ONLY</div><h1>{html.escape(board_name)}</h1><p>Approved still endpoints are locked. Upload @Image1 and @Image2 exactly as shown, paste the canonical prompt, keep the negative prompt unchanged, and save to the exact output filename. No job is submitted by this board.</p></div><div class=\"state\"><strong>APPROVE STILLS · VERIFIED</strong><span>Owner checkpoint · 2026-08-23</span></div></header>
<section class=\"ledger\" aria-label=\"production ledger\"><div><span>FILM</span><b>44 clips · VERIFIED</b></div><div><span>THIS BOARD</span><b>{len(clips)} cards · VERIFIED</b></div><div><span>R3 MINIMUM</span><b>100 · [INFERRED]</b></div><div><span>CUMULATIVE MINIMUM</span><b>580 · [INFERRED]</b></div><div><span>EXACT SPEND</span><b class=\"lost\">[LOST]</b></div></section>
<nav class=\"tools\" aria-label=\"board filters\"><button type=\"button\" class=\"active\" data-filter=\"all\">ALL</button><button type=\"button\" data-filter=\"r3\">R3 ONLY</button><button type=\"button\" data-filter=\"2\">ACT 2</button><button type=\"button\" data-filter=\"3\">ACT 3</button><button type=\"button\" data-filter=\"5\">ACT 5</button><input id=\"search\" type=\"search\" placeholder=\"Find clip or title\"></nav>
<section class=\"cards\">{cards}</section>
<section class=\"negative\"><div class=\"prompt-head\"><span>NEGATIVE PROMPT · BYTE-LOCKED</span><button type=\"button\" data-copy=\"negative-prompt\">COPY</button></div><textarea id=\"negative-prompt\" class=\"prompt\" readonly>{negative}</textarea></section>
<footer><span>Owner generation only · no WAN API calls · integration remains locked until returned clips pass acceptance.</span><span>Planned 600 · stop-and-report above 660 · exact spend [LOST]</span></footer></main>
<script>window.CTS_WAN_DATA={json_for_script(data)};
const storageKey='cts-wan-{board_code}-done';let done={{}};try{{done=JSON.parse(localStorage.getItem(storageKey)||'{{}}')}}catch{{}}
document.querySelectorAll('[data-done]').forEach(box=>{{box.checked=!!done[box.dataset.done];box.addEventListener('change',()=>{{done[box.dataset.done]=box.checked;localStorage.setItem(storageKey,JSON.stringify(done))}})}});
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{{const source=document.getElementById(button.dataset.copy);if(location.protocol!=='file:'&&navigator.clipboard){{try{{await navigator.clipboard.writeText(source.value)}}catch{{source.select();document.execCommand('copy')}}}}else{{source.select();document.execCommand('copy')}}button.textContent='COPIED';setTimeout(()=>button.textContent='COPY',3000)}}));
const cards=[...document.querySelectorAll('.clip-card')],search=document.getElementById('search');let filter='all';function apply(){{const q=search.value.trim().toLowerCase();cards.forEach(card=>{{const matchFilter=filter==='all'||(filter==='r3'&&card.classList.contains('r3-card'))||card.dataset.act===filter;card.classList.toggle('hidden',!(matchFilter&&card.textContent.toLowerCase().includes(q)))}})}}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(item=>item.classList.toggle('active',item===button));apply()}}));search.addEventListener('input',apply);</script></body></html>"""


def main() -> None:
    prompts = load_prompts()
    manifest = integrate_manifest(prompts)
    write_utf8(CLIPS_PATH, json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    write_utf8(MAIN_BOARD_PATH, render_board(manifest, manifest["clips"], "CUT THE STRINGS · 44-CLIP MASTER BOARD", "master-44"))
    r3_clips = [clip for clip in manifest["clips"] if clip["clip"] in R3_IDS]
    write_utf8(R3_BOARD_PATH, render_board(manifest, r3_clips, "CUT THE STRINGS · R3 TEN-CLIP BOARD", "r3-10"))

    receipt = {
        "clips": len(manifest["clips"]),
        "r3": len(r3_clips),
        "promptHashes": {
            clip_id: hashlib.sha256(prompt_path(clip_id).read_bytes()).hexdigest()
            for clip_id in R3_IDS
        },
        "negativePromptSha256": hashlib.sha256(NEGATIVE_PATH.read_bytes()).hexdigest(),
        "boards": [str(MAIN_BOARD_PATH), str(R3_BOARD_PATH)],
    }
    print(json.dumps(receipt, indent=2))


if __name__ == "__main__":
    main()
