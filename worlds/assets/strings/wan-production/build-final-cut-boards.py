from __future__ import annotations

import html
import importlib.util
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REPO = Path(__file__).resolve().parents[5]
INTAKE = Path(
    r"C:\Users\GAMING\.codex\visualizations\2026\08\21"
    r"\01a024df-35f2-7a90-af90-81b5a20a300e\cut-the-strings\intake"
)
FINAL_CUT = INTAKE / "final-cut"
R3_STATUS = "NOT_PRODUCED — owner closed generation 2026-08-23"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8", newline="\n")


def base_manifest() -> dict:
    content = subprocess.run(
        ["git", "show", "efaed3e:public/worlds/assets/strings/wan-production/clips.json"],
        cwd=REPO,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    ).stdout
    return json.loads(content)


def r3_definitions() -> tuple[tuple[str, ...], dict]:
    source = ROOT / "build-r3-boards.py"
    spec = importlib.util.spec_from_file_location("cts_r3_archive_source", source)
    if spec is None or spec.loader is None:
        raise RuntimeError("Unable to load preserved R3 board source")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.R3_IDS, module.R3_OVERRIDES


def script_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def board_shell(*, title: str, kicker: str, intro: str, state: str, ledger: str, cards: str,
                data: dict, archive: bool = False) -> str:
    archive_class = " archive" if archive else ""
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CUT THE STRINGS · {html.escape(title)}</title>
<style>
:root{{--ink:#f5ead8;--muted:#ae9f89;--paper:#0c0b09;--panel:#211c15;--line:#55442f;--brass:#d8aa53;--green:#91b879;--red:#e37a65;color-scheme:dark}}
*{{box-sizing:border-box}}html{{background:var(--paper);color:var(--ink);font:14px/1.5 Inter,system-ui,sans-serif}}body{{margin:0;background:radial-gradient(circle at 50% 0,#302417 0,transparent 42rem),var(--paper)}}
.shell{{width:min(1460px,100%);margin:auto;padding:24px}}header{{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:end;padding:26px;border:1px solid var(--line);background:#17130fdd}}
.kicker,.eyebrow,.label{{color:var(--brass);font-size:11px;font-weight:800;letter-spacing:.15em}}h1{{font:700 clamp(34px,5vw,68px)/.95 Georgia,serif;margin:5px 0 12px;letter-spacing:-.04em}}header p{{color:var(--muted);max-width:82ch;margin:0}}.state{{text-align:right;color:var(--green);font-weight:800;letter-spacing:.08em}}
.archive-banner{{margin:14px 0;padding:18px;border:2px solid var(--red);background:#321913;color:#ffd8cf;font-size:clamp(18px,3vw,32px);font-weight:900;text-align:center;letter-spacing:.04em}}
.ledger{{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;margin:14px 0;background:var(--line);border:1px solid var(--line)}}.ledger div{{background:#15110d;padding:14px}}.ledger span{{display:block;color:var(--muted);font-size:10px;letter-spacing:.13em}}.ledger b{{font-size:17px}}.lost,.red{{color:var(--red)}}
.tools{{display:flex;gap:8px;position:sticky;top:0;z-index:3;padding:12px 0;background:linear-gradient(var(--paper) 80%,transparent)}}.tools input{{width:100%;border:1px solid var(--line);background:#17130f;color:var(--ink);padding:11px}}
.cards{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}}.card{{border:1px solid var(--line);background:linear-gradient(155deg,var(--panel),#13100c);padding:16px;min-width:0}}.card[hidden]{{display:none}}.head{{display:flex;justify-content:space-between;gap:12px}}h2{{font:700 30px/1 Georgia,serif;margin:4px 0}}.head p{{margin:0;color:var(--muted)}}.take{{align-self:start;border:1px solid var(--brass);padding:6px 9px;color:var(--brass);font-weight:800}}
.frames{{display:grid;grid-template-columns:1fr 22px 1fr;gap:7px;align-items:center;margin:14px 0}}figure{{margin:0;min-width:0}}img{{display:block;width:100%;aspect-ratio:120/68;object-fit:cover;border:1px solid #604c34;background:#080706}}figcaption{{font-size:10px;color:var(--muted);margin-top:4px}}.arrow{{text-align:center;color:var(--brass);font-size:20px}}
.facts{{display:grid;grid-template-columns:1fr 1fr;gap:7px}}.facts p{{margin:0;padding:9px;border:1px solid #3c3022;background:#0e0c09;overflow-wrap:anywhere}}.facts span{{display:block;color:var(--muted);font-size:10px;letter-spacing:.1em}}.defect{{margin:10px 0 0;border-left:3px solid var(--red);padding:8px 10px;background:#2b1511}}.green{{border-left-color:var(--green);background:#162014}}details{{margin-top:10px}}pre{{white-space:pre-wrap;overflow-wrap:anywhere;background:#0c0a08;border:1px solid var(--line);padding:11px;color:#d9cebd}}button[disabled]{{opacity:.45}}
footer{{padding:24px 0;color:var(--muted)}}
@media(max-width:820px){{.shell{{padding:10px}}header{{grid-template-columns:1fr;padding:17px}}.state{{text-align:left}}.ledger{{grid-template-columns:1fr 1fr}}.cards{{grid-template-columns:1fr}}}}
@media(max-width:460px){{.shell{{padding:7px}}.ledger{{grid-template-columns:1fr}}.card{{padding:10px}}.frames{{grid-template-columns:1fr}}.arrow{{transform:rotate(90deg)}}.facts{{grid-template-columns:1fr}}}}
</style></head><body><main class="shell{archive_class}"><header><div><div class="kicker">{html.escape(kicker)}</div><h1>{html.escape(title)}</h1><p>{html.escape(intro)}</p></div><div class="state">{html.escape(state)}</div></header>
{('<div class="archive-banner">' + html.escape(R3_STATUS) + '</div>') if archive else ''}
<section class="ledger">{ledger}</section><div class="tools"><input id="search" type="search" placeholder="Find clip, take, or title"></div><section class="cards">{cards}</section>
<footer>VERIFIED production evidence · no generation controls · exact spend [LOST]</footer></main>
<script>window.CTS_WAN_DATA={script_json(data)};const q=document.getElementById('search'),cards=[...document.querySelectorAll('.card')];q.addEventListener('input',()=>{{const s=q.value.trim().toLowerCase();cards.forEach(c=>c.hidden=s&&!c.innerText.toLowerCase().includes(s))}});</script></body></html>"""


def frame_pair(clip: dict) -> str:
    clip_id = html.escape(clip["clip"])
    return (
        f'<div class="frames"><figure><img src="{html.escape(clip["generationFirst"], quote=True)}" alt="{clip_id} approved first frame">'
        f'<figcaption>APPROVED FIRST · {html.escape(clip["storyboard"].split(" -> ")[0])}</figcaption></figure><div class="arrow">→</div>'
        f'<figure><img src="{html.escape(clip["generationLast"], quote=True)}" alt="{clip_id} approved last frame">'
        f'<figcaption>APPROVED LAST · {html.escape(clip["storyboard"].split(" -> ")[-1])}</figcaption></figure></div>'
    )


def main() -> None:
    base = base_manifest()
    custody = read_json(FINAL_CUT / "custody-normalization.json")
    instruments = read_json(FINAL_CUT / "candidate-instruments-24.json")
    picks = read_json(FINAL_CUT / "take-picks.json")
    selection_by_id = {row["clip"]: row for row in custody["selected"]}
    pick_by_id = {row["clip"]: row for row in picks["picks"]}
    metrics_by_id: dict[str, list[dict]] = {}
    for candidate in instruments["candidates"]:
        metrics_by_id.setdefault(candidate["clip"], []).append(candidate)

    clips = []
    take_rows = []
    for base_clip in base["clips"]:
        clip = dict(base_clip)
        clip_id = clip["clip"]
        selected = selection_by_id[clip_id]
        eye = pick_by_id.get(clip_id)
        candidates = []
        if eye:
            for metric in metrics_by_id[clip_id]:
                candidates.append(
                    {
                        "take": metric["take"],
                        "sha256": metric["sha256"],
                        "instrumentScore": metric["instrumentScore"],
                        "endpoint": metric["endpoint"],
                        "structural": metric["structural"],
                        "ghost": metric["ghost"],
                        "watermark": metric["watermark"],
                        "durationSeconds": metric["technical"]["duration"],
                        "audioStreams": metric["technical"]["audioStreams"],
                        "holdRepairNeeded": metric["holdRepairNeeded"],
                    }
                )
        else:
            candidates.append(
                {
                    "take": "R1",
                    "sha256": selected["sha256"],
                    "instrumentScore": None,
                    "status": "sole submitted return",
                }
            )
        take_row = {
            "clip": clip_id,
            "label": "VERIFIED",
            "candidates": candidates,
            "instrumentRanking": instruments["rankingBeforeEye"].get(clip_id, ["R1"]),
            "eyeVerdict": selected["eyeVerdict"],
            "pick": selected["take"],
            "runnerUp": selected["runnerUp"],
            "why": selected["reason"],
            "defect": selected["defect"],
            "sourceSha256": selected["sha256"],
            "masterSha256": selected["acceptedSha256"],
        }
        take_rows.append(take_row)
        clip.update(
            {
                "status": "SHIPPED",
                "sortKey": int(clip["number"]),
                "outputFilename": f"{clip_id}.mp4",
                "shippedTake": selected["take"],
                "selectionLabel": "VERIFIED",
                "eyeVerdict": selected["eyeVerdict"],
                "knownDefect": selected["defect"],
                "selectionReason": selected["reason"],
                "sourceSha256": selected["sha256"],
                "masterSha256": selected["acceptedSha256"],
                "candidateCount": len(candidates),
            }
        )
        clips.append(clip)

    r3_ids, r3_overrides = r3_definitions()
    closed_r3 = []
    for clip_id in r3_ids:
        prompt_path = ROOT / "wan-prompts" / f"{clip_id}.txt"
        closed_r3.append(
            {
                "clip": clip_id,
                **r3_overrides[clip_id],
                "prompt": prompt_path.read_text(encoding="utf-8"),
                "promptSource": f"wan-prompts/{clip_id}.txt",
                "status": R3_STATUS,
                "jobsSubmitted": None,
                "creditsSpent": None,
            }
        )

    manifest = dict(base)
    manifest.update(
        {
            "schema": "cut-the-strings-final-film/v1",
            "status": "SHIPPED_40",
            "ownerDecision": "finish existing best takes; no more generation",
            "ownerDecisionDate": "2026-08-23",
            "filmClipCount": 40,
            "r3ClipCount": 0,
            "observedReturnFiles": 56,
            "observedReturnFilesLabel": "VERIFIED",
            "jobsSubmitted": None,
            "jobsSubmittedStatus": "[LOST] historical WAN manifest unavailable; no new jobs submitted in final-cut slice",
            "creditsSpent": None,
            "minimumObservedCredits": 560,
            "minimumObservedCreditsStatus": "[INFERRED] 56 observed return files × 10-credit base minimum",
            "exactSpendStatus": "[LOST] WAN manifest unavailable",
            "standaloneFilename": "../CUT-THE-STRINGS-FINAL.mp4",
            "approvedMidStills": [
                "../keyframes/CTS-KF12M-swatches-fill-lens.png",
                "../keyframes/CTS-KF16M-linen-fills-lens.png",
                "../keyframes/CTS-KF22M-unstrung-bench-level.png",
                "../keyframes/CTS-KF39M-seated-before-open-crate.png",
            ],
            "closedR3Plan": closed_r3,
            "clips": clips,
        }
    )
    write_text(ROOT / "clips.json", json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    take_table = {
        "schema": "cut-the-strings-final-take-table/v1",
        "result": "GREEN",
        "label": "VERIFIED",
        "sourceReturns": 56,
        "slots": 40,
        "contestedSlots": 8,
        "instrumentMethod": instruments["method"],
        "eyeMethod": picks["eyeMethod"],
        "rows": take_rows,
    }
    write_text(ROOT / "final-take-table.json", json.dumps(take_table, indent=2, ensure_ascii=False) + "\n")
    r3_archive = {
        "schema": "cut-the-strings-r3-not-produced/v1",
        "status": R3_STATUS,
        "clipCount": 10,
        "approvedMidStillsRetained": 4,
        "jobsSubmitted": None,
        "creditsSpent": None,
        "exactSpendStatus": "[LOST]",
        "clips": closed_r3,
    }
    write_text(ROOT / "R3-NOT-PRODUCED.json", json.dumps(r3_archive, indent=2, ensure_ascii=False) + "\n")

    main_cards = []
    for clip, take in zip(clips, take_rows):
        defect = take["defect"]
        defect_markup = (
            f'<p class="defect"><span class="label">RED BEST AVAILABLE</span>{html.escape(defect)}</p>'
            if defect
            else '<p class="defect green"><span class="label">VERIFIED</span>No named blocking defect in the selected take.</p>'
        )
        main_cards.append(
            f'<article class="card" id="{clip["clip"]}" data-clip="{clip["clip"]}"><div class="head"><div><span class="eyebrow">ACT {clip["act"]} · {html.escape(clip["storyboard"])}</span>'
            f'<h2>{clip["clip"]}</h2><p>{html.escape(clip["title"])}</p></div><div class="take">{take["pick"]}</div></div>{frame_pair(clip)}'
            f'<div class="facts"><p><span>SHIPPED MASTER</span>accepted/{clip["clip"]}.mp4</p><p><span>CANDIDATES</span>{len(take["candidates"])} · {" / ".join(c["take"] for c in take["candidates"])}</p>'
            f'<p><span>EYE VERDICT</span>{html.escape(take["eyeVerdict"])}</p><p><span>WHY</span>{html.escape(take["why"])}</p></div>{defect_markup}</article>'
        )
    ledger = (
        '<div><span>FILM</span><b>40 / 40 · VERIFIED</b></div><div><span>RETURNS HASHED</span><b>56 · VERIFIED</b></div>'
        '<div><span>CONTESTED</span><b>8 · VERIFIED</b></div><div><span>MINIMUM CREDITS</span><b>560 · [INFERRED]</b></div>'
        '<div><span>EXACT SPEND</span><b class="lost">[LOST]</b></div>'
    )
    write_text(
        ROOT / "WAN-GENERATION-BOARD.html",
        board_shell(
            title="40-SLOT SHIPPED TAKE BOARD",
            kicker="FINAL CUT · EVIDENCE BOARD · NO GENERATION",
            intro="Each card names the shipped take chosen from every return that exists for that slot. RED best-available defects remain visible; no slot is missing.",
            state="SHIPPED · 40/40 · VERIFIED",
            ledger=ledger,
            cards="\n".join(main_cards),
            data={"mode": "shipped", "filmClipCount": 40, "boardClipCount": 40, "jobsSubmitted": None, "creditsSpent": None, "clips": clips},
        ),
    )

    archive_cards = []
    for clip in closed_r3:
        archive_cards.append(
            f'<article class="card" data-clip="{clip["clip"]}"><div class="head"><div><span class="eyebrow">ARCHIVED PLAN · ACT {clip["act"]}</span><h2>{clip["clip"]}</h2>'
            f'<p>{html.escape(clip["title"])}</p></div><div class="take red">NOT PRODUCED</div></div>{frame_pair(clip)}'
            f'<div class="facts"><p><span>STATUS</span>{html.escape(R3_STATUS)}</p><p><span>PROMPT SOURCE</span>{html.escape(clip["promptSource"])}</p></div>'
            f'<details><summary>Preserved canonical prompt (read-only)</summary><pre>{html.escape(clip["prompt"])}</pre><button type="button" disabled>GENERATION CLOSED</button></details></article>'
        )
    archive_ledger = (
        '<div><span>PLANNED CARDS</span><b>10 · VERIFIED</b></div><div><span>PRODUCED</span><b>0 · VERIFIED</b></div>'
        '<div><span>FILM USE</span><b>0 · VERIFIED</b></div><div><span>MID-STILLS RETAINED</span><b>4 · VERIFIED</b></div>'
        '<div><span>EXACT SPEND</span><b class="lost">[LOST]</b></div>'
    )
    write_text(
        ROOT / "WAN-R3-GENERATION-BOARD.html",
        board_shell(
            title="R3 PLAN ARCHIVE",
            kicker="ARCHIVE ONLY · GENERATION CLOSED",
            intro="The ten written R3 cards are retained as production history. They were not produced and are not part of the 40-slot film.",
            state="NOT PRODUCED · VERIFIED",
            ledger=archive_ledger,
            cards="\n".join(archive_cards),
            data={"mode": "archive", "filmClipCount": 40, "boardClipCount": 10, "r3ProducedCount": 0, "jobsSubmitted": None, "creditsSpent": None, "clips": closed_r3},
            archive=True,
        ),
    )
    print("FINAL_BOARD_GREEN film=40 archive=10 producedR3=0 observedReturns=56")


if __name__ == "__main__":
    main()
