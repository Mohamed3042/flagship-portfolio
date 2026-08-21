#!/usr/bin/env python3
"""Measure the Disney scroll camera from the rendered page and gate its joins."""

from __future__ import annotations

import argparse
import csv
import html
import json
import math
import statistics
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from playwright.sync_api import sync_playwright


SAMPLE_COUNT = 101
STORY_RETURN_AFTER = {4, 9, 16, 20, 30, 40, 50, 60, 70, 80, 90}
POSITION_TOLERANCE = 0.003
BOUNDARY_VELOCITY_TOLERANCE = 0.08
ACTIVE_VELOCITY_TOLERANCE = 0.16
VELOCITY_EPSILON = 0.002


def solo_url(raw_url: str) -> str:
    parts = urlsplit(raw_url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.update({"solo": "2", "p": "0"})
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def sign(value: float) -> int:
    if value > VELOCITY_EPSILON:
        return 1
    if value < -VELOCITY_EPSILON:
        return -1
    return 0


def median_or_zero(values: list[float]) -> float:
    nonzero = [value for value in values if abs(value) > VELOCITY_EPSILON]
    return statistics.median(nonzero) if nonzero else 0.0


def analyse_scene(raw: dict) -> dict:
    points = raw["points"]
    derivatives = []
    derivative_positions = []
    for left, right in zip(points, points[1:]):
        dx = right["local"] - left["local"]
        derivatives.append((right["pan"] - left["pan"]) / dx)
        derivative_positions.append((right["local"] + left["local"]) / 2)

    signs = [sign(value) for value in derivatives]
    nonzero_signs = [value for value in signs if value]
    sign_changes = sum(a != b for a, b in zip(nonzero_signs, nonzero_signs[1:]))
    start_pan = points[0]["pan"]
    end_pan = points[-1]["pan"]
    delta = end_pan - start_pan
    direction = sign(delta)
    entry = median_or_zero([
        value for value, position in zip(derivatives, derivative_positions)
        if 0.14 <= position <= 0.36
    ])
    exit_velocity = median_or_zero([
        value for value, position in zip(derivatives, derivative_positions)
        if 0.64 <= position <= 0.86
    ])
    start_velocity = statistics.mean(derivatives[:3])
    end_velocity = statistics.mean(derivatives[-3:])

    return {
        **raw,
        "startPan": start_pan,
        "endPan": end_pan,
        "amplitude": abs(delta),
        "direction": direction,
        "signChanges": sign_changes,
        "entryVelocity": entry,
        "exitVelocity": exit_velocity,
        "startVelocity": start_velocity,
        "endVelocity": end_velocity,
        "internalPass": sign_changes <= 1,
    }


def classify(scenes: list[dict]) -> tuple[list[dict], list[dict]]:
    joins: list[dict] = []
    for index, (left, right) in enumerate(zip(scenes, scenes[1:]), start=1):
        story_return = index in STORY_RETURN_AFTER
        position_jump = abs(left["endPan"] - right["startPan"])
        boundary_velocity_delta = abs(left["endVelocity"] - right["startVelocity"])
        active_velocity_delta = abs(left["exitVelocity"] - right["entryVelocity"])
        direction_flip = bool(left["direction"] and right["direction"] and left["direction"] != right["direction"])
        reasons: list[str] = []
        if position_jump > POSITION_TOLERANCE:
            reasons.append("position_jump")
        if boundary_velocity_delta > BOUNDARY_VELOCITY_TOLERANCE:
            reasons.append("boundary_velocity_jump")
        if not story_return:
            if direction_flip:
                reasons.append("unmotivated_direction_flip")
            if active_velocity_delta > ACTIVE_VELOCITY_TOLERANCE:
                reasons.append("active_velocity_jump")
        joins.append({
            "fromScene": index,
            "toScene": index + 1,
            "storyReturn": story_return,
            "positionJump": position_jump,
            "boundaryVelocityDelta": boundary_velocity_delta,
            "activeVelocityDelta": active_velocity_delta,
            "directionFlip": direction_flip,
            "pass": not reasons,
            "reasons": reasons,
        })

    incoming = {join["toScene"]: join for join in joins}
    for scene in scenes:
        scene_number = scene["scene"]
        reasons = [] if scene["internalPass"] else ["too_many_internal_reversals"]
        join = incoming.get(scene_number)
        if join and not join["pass"]:
            reasons.extend(join["reasons"])
        if reasons:
            classification = "PING_PONG_REMAP"
        elif join and join["storyReturn"] and join["directionFlip"]:
            classification = (
                "STORY_RETURN_EASED"
                if join["activeVelocityDelta"] <= ACTIVE_VELOCITY_TOLERANCE
                else "OK_NEEDS_EASING"
            )
        elif scene_number == 1:
            classification = "OK_NEEDS_EASING" if scene["amplitude"] > 0.2 else "GREEN"
        else:
            classification = "GREEN"
        scene["classification"] = classification
        scene["reasons"] = sorted(set(reasons))
        scene["incomingJoin"] = join
    return scenes, joins


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            flat = dict(row)
            for key, value in flat.items():
                if isinstance(value, (list, dict)):
                    flat[key] = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
            writer.writerow(flat)


def board_markup(scenes: list[dict], target: str, verdict: str) -> str:
    ping_pong = sum(scene["classification"] == "PING_PONG_REMAP" for scene in scenes)
    easing = sum(scene["classification"] == "OK_NEEDS_EASING" for scene in scenes)
    cards = []
    for scene in scenes:
        points = scene["points"]
        polyline = " ".join(
            f"{8 + point['local'] * 204:.1f},{66 - point['pan'] * 50:.1f}"
            for point in points
        )
        klass = scene["classification"].lower().replace("_", "-")
        direction = "RIGHT" if scene["direction"] > 0 else "LEFT" if scene["direction"] < 0 else "HOLD"
        cards.append(f"""
          <article class="{klass}">
            <div class="head"><b>{scene['scene']:03d}</b><span>{html.escape(scene['act'])}</span><em>{direction}</em></div>
            <div class="title">{html.escape(scene['title'])}</div>
            <svg viewBox="0 0 220 72" aria-hidden="true">
              <path class="grid" d="M8 16H212M8 41H212M8 66H212"/>
              <polyline points="{polyline}"/>
            </svg>
            <div class="status">{scene['classification'].replace('_', ' ')}</div>
          </article>
        """)
    return f"""<!doctype html>
<html><head><meta charset="utf-8"><style>
*{{box-sizing:border-box}} body{{margin:0;background:#080604;color:#eadfca;font-family:Segoe UI,Arial,sans-serif}}
header{{position:sticky;top:0;z-index:3;padding:22px 28px;background:rgba(8,6,4,.96);border-bottom:1px solid #5a4520}}
h1{{margin:0;font:700 28px Georgia,serif}} p{{margin:8px 0 0;color:#a99d88;font-size:13px}}
.summary{{display:flex;gap:14px;margin-top:12px;font-weight:700;font-size:12px}} .red{{color:#ff7d6e}} .amber{{color:#e4bd5d}} .green{{color:#80d19b}}
main{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:14px}}
article{{min-width:0;padding:10px;border:1px solid #294d37;border-radius:7px;background:#100d08}}
article.ping-pong-remap{{border-color:#8f372f;background:#190d0a}} article.ok-needs-easing{{border-color:#7d642a;background:#171208}}
.head{{display:flex;align-items:center;gap:7px;font-size:10px;letter-spacing:.08em;text-transform:uppercase}} .head b{{color:#e2b13c;font-size:13px}} .head span{{color:#a99d88}} .head em{{margin-left:auto;font-style:normal;color:#d7cab3}}
.title{{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:5px;font:700 13px Georgia,serif}}
svg{{display:block;width:100%;height:62px;margin-top:4px}} .grid{{stroke:#3b3021;stroke-width:.8;fill:none}} polyline{{stroke:#e2b13c;stroke-width:2.3;fill:none}}
.status{{font-size:9px;letter-spacing:.1em;color:#86d49d}} .ping-pong-remap .status{{color:#ff8c7d}} .ok-needs-easing .status{{color:#e4bd5d}}
</style></head><body>
<header><h1>Disney camera curve audit · {verdict}</h1><p>{html.escape(target)}</p>
<div class="summary"><span>SCENES {len(scenes)}</span><span class="red">PING-PONG {ping_pong}</span><span class="amber">SMALL EASING {easing}</span><span class="green">MONOTONIC {sum(scene['internalPass'] for scene in scenes)}/{len(scenes)}</span></div></header>
<main>{''.join(cards)}</main></body></html>"""


def write_markdown(path: Path, scenes: list[dict], joins: list[dict], target: str, verdict: str) -> None:
    lines = [
        f"# Disney camera curve audit — {verdict}",
        "",
        f"Target: `{target}`",
        "",
        "| Scene | Act | Title | Start → end | Direction | d(pan)/dp sign changes | Incoming join | Classification |",
        "|---:|---|---|---:|---|---:|---|---|",
    ]
    incoming = {join["toScene"]: join for join in joins}
    for scene in scenes:
        join = incoming.get(scene["scene"])
        if join is None:
            join_text = "opening"
        elif join["pass"] and join["storyReturn"]:
            join_text = "story return / eased"
        elif join["pass"]:
            join_text = "continuous"
        else:
            join_text = ", ".join(join["reasons"])
        direction = "right" if scene["direction"] > 0 else "left" if scene["direction"] < 0 else "hold"
        title = scene["title"].replace("|", "\\|")
        lines.append(
            f"| {scene['scene']:03d} | {scene['act']} | {title} | {scene['startPan']:.4f} → {scene['endPan']:.4f} | {direction} | {scene['signChanges']} | {join_text} | {scene['classification']} |"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--expect", choices=("red", "green", "either"), default="green")
    parser.add_argument("--expected-count", type=int, default=100)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    browser_errors: list[str] = []
    failed_requests: list[str] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page = context.new_page()
        page.on("pageerror", lambda error: browser_errors.append(str(error)))
        page.on("requestfailed", lambda request: (
            failed_requests.append(f"{request.url} :: {request.failure}")
            if not request.url.lower().split("?", 1)[0].endswith(".mp4") else None
        ))
        page.route("**/*", lambda route: route.abort() if route.request.url.lower().split("?", 1)[0].endswith(".mp4") else route.continue_())
        page.goto(solo_url(args.url), wait_until="domcontentloaded", timeout=60_000)
        page.wait_for_selector("#book", state="attached", timeout=20_000)
        page.wait_for_timeout(250)
        raw_scenes = page.evaluate(
            """({ sampleCount }) => {
              const scene = document.getElementById('book');
              const caps = [...scene.querySelectorAll('.legcap')];
              const floor = scene.querySelector('.floor');
              const allScenes = [...document.querySelectorAll('[data-scene]')];
              const sceneIndex = allScenes.indexOf(scene);
              const result = [];
              for (let i = 0; i < caps.length; i += 1) {
                const points = [];
                for (let k = 0; k < sampleCount; k += 1) {
                  const local = k / (sampleCount - 1);
                  const bounded = local === 1 ? 0.999999 : local;
                  const global = (i + bounded) / caps.length;
                  scene.style.setProperty('--p', global.toFixed(8));
                  window.dispatchEvent(new Event('scroll'));
                  points.push({
                    local,
                    global,
                    pan: Number.parseFloat(scene.style.getPropertyValue('--pan')),
                    journey: Number.parseFloat(scene.style.getPropertyValue('--journey')),
                    depth: Number.parseFloat(scene.style.getPropertyValue('--depth')),
                    objectPosition: getComputedStyle(floor).objectPosition,
                  });
                }
                result.push({
                  scene: i + 1,
                  act: caps[i].dataset.actEn,
                  title: caps[i].dataset.tEn,
                  clip: caps[i].dataset.clip,
                  sceneIndex,
                  points,
                });
              }
              return result;
            }""",
            {"sampleCount": SAMPLE_COUNT},
        )
        scenes = [analyse_scene(scene) for scene in raw_scenes]
        scenes, joins = classify(scenes)
        internal_failures = [scene for scene in scenes if not scene["internalPass"]]
        join_failures = [join for join in joins if not join["pass"]]
        ping_pong = [scene for scene in scenes if scene["classification"] == "PING_PONG_REMAP"]
        easing = [scene for scene in scenes if scene["classification"] == "OK_NEEDS_EASING"]
        green = len(scenes) == args.expected_count and not internal_failures and not join_failures and not browser_errors and not failed_requests
        verdict = "GREEN" if green else "RED"

        payload = {
            "target": args.url,
            "soloUrl": solo_url(args.url),
            "verdict": verdict,
            "thresholds": {
                "signChangesMax": 1,
                "positionTolerance": POSITION_TOLERANCE,
                "boundaryVelocityTolerance": BOUNDARY_VELOCITY_TOLERANCE,
                "activeVelocityTolerance": ACTIVE_VELOCITY_TOLERANCE,
                "storyReturnAfter": sorted(STORY_RETURN_AFTER),
            },
            "summary": {
                "sceneCount": len(scenes),
                "internalFailures": len(internal_failures),
                "joinFailures": len(join_failures),
                "pingPongScenes": len(ping_pong),
                "smallEasingScenes": len(easing),
                "browserErrors": browser_errors,
                "failedRequests": failed_requests,
            },
            "scenes": scenes,
            "joins": joins,
        }
        (args.out / "camera-curves.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        write_csv(
            args.out / "camera-scenes.csv",
            scenes,
            ["scene", "act", "title", "clip", "startPan", "endPan", "amplitude", "direction", "signChanges", "entryVelocity", "exitVelocity", "startVelocity", "endVelocity", "internalPass", "classification", "reasons"],
        )
        write_csv(
            args.out / "camera-joins.csv",
            joins,
            ["fromScene", "toScene", "storyReturn", "positionJump", "boundaryVelocityDelta", "activeVelocityDelta", "directionFlip", "pass", "reasons"],
        )
        write_markdown(args.out / "camera-curve-table.md", scenes, joins, args.url, verdict)

        board = context.new_page()
        board.set_viewport_size({"width": 1440, "height": 1000})
        board.set_content(board_markup(scenes, args.url, verdict), wait_until="load")
        board.screenshot(path=str(args.out / "camera-curve-board.png"), full_page=True)
        board.close()
        context.close()
        browser.close()

    print(
        f"CAMERA_GATE_{verdict} scenes={len(scenes)} ping_pong={len(ping_pong)} "
        f"small_easing={len(easing)} internal_failures={len(internal_failures)} "
        f"join_failures={len(join_failures)}"
    )
    if args.expect == "either":
        return 0
    if args.expect == verdict.lower():
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
