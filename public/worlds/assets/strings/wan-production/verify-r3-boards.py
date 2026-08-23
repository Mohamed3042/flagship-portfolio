from __future__ import annotations

import hashlib
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent
INTAKE = Path(
    r"C:\Users\GAMING\.codex\visualizations\2026\08\21\01a024df-35f2-7a90-af90-81b5a20a300e"
    r"\cut-the-strings\intake\r3"
)
SCREENSHOTS = INTAKE / "review" / "board-screenshots"
RECEIPTS = INTAKE / "receipts"
R3_IDS = [
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
]
EXPECTED_MAIN_ORDER = [
    item
    for number in range(1, 41)
    for item in (
        [f"CTS-A-{number:03d}", f"CTS-A-{number:03d}B"]
        if f"CTS-A-{number:03d}B" in R3_IDS
        else [f"CTS-A-{number:03d}"]
    )
]
BOARDS = {
    "master-44": (ROOT / "WAN-GENERATION-BOARD.html", EXPECTED_MAIN_ORDER),
    "r3-10": (ROOT / "WAN-R3-GENERATION-BOARD.html", R3_IDS),
}
VIEWPORTS = {"desktop-1440x1100": (1440, 1100), "phone-390x844": (390, 844)}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_manifest(prompts: dict[str, str], negative: str) -> dict:
    manifest = json.loads((ROOT / "clips.json").read_text(encoding="utf-8"))
    clips = manifest["clips"]
    require(len(clips) == 44, f"clips.json count: {len(clips)}")
    require([clip["clip"] for clip in clips] == EXPECTED_MAIN_ORDER, "clips.json ordering mismatch")
    require(len({clip["clip"] for clip in clips}) == 44, "duplicate clip id")
    require(len({clip["outputFilename"] for clip in clips}) == 44, "duplicate output filename")
    require(manifest["jobsSubmitted"] is None, "jobsSubmitted must be unknown, not zero")
    require(manifest["creditsSpent"] is None, "creditsSpent must be unknown, not zero")
    require(manifest["credits"]["exactSpend"] is None, "exact spend must be unknown")
    require(manifest["negativePrompt"] == negative, "manifest negative prompt differs from locked file")
    by_id = {clip["clip"]: clip for clip in clips}
    for clip_id, prompt in prompts.items():
        require(by_id[clip_id]["prompt"] == prompt, f"manifest prompt mismatch: {clip_id}")
        require(by_id[clip_id]["outputFilename"] == f"{clip_id}.mp4", f"output mismatch: {clip_id}")
        require(by_id[clip_id]["seed"] == 271101, f"seed mismatch: {clip_id}")
    return {
        "clipCount": 44,
        "r3ClipCount": 10,
        "ordering": "GREEN",
        "uniqueIds": "GREEN",
        "uniqueOutputs": "GREEN",
        "unknownSpendNotZero": "GREEN",
        "canonicalPromptBytes": "10/10 GREEN",
        "negativePromptBytes": "GREEN",
    }


def main() -> None:
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    RECEIPTS.mkdir(parents=True, exist_ok=True)
    prompts = {
        clip_id: (ROOT / "wan-prompts" / f"{clip_id}.txt").read_bytes().decode("utf-8")
        for clip_id in R3_IDS
    }
    negative_path = ROOT / "negative-prompt.txt"
    negative = negative_path.read_bytes().decode("utf-8")
    negative_dom = negative.replace("\r\n", "\n").replace("\r", "\n")
    manifest_audit = verify_manifest(prompts, negative)
    board_audits = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            args=["--allow-file-access-from-files"],
        )
        try:
            for board_code, (board_path, expected_ids) in BOARDS.items():
                for viewport_name, (width, height) in VIEWPORTS.items():
                    context = browser.new_context(viewport={"width": width, "height": height})
                    page = context.new_page()
                    console_errors: list[str] = []
                    page_errors: list[str] = []
                    failed_requests: list[str] = []
                    page.on(
                        "console",
                        lambda message: console_errors.append(message.text)
                        if message.type == "error"
                        else None,
                    )
                    page.on("pageerror", lambda error: page_errors.append(str(error)))
                    page.on("requestfailed", lambda request: failed_requests.append(request.url))
                    page.goto(board_path.as_uri(), wait_until="networkidle")
                    page.wait_for_function(
                        """() => [...document.images].every(img => img.complete && img.naturalWidth > 0)"""
                    )

                    card_ids = page.locator(".clip-card").evaluate_all(
                        "cards => cards.map(card => card.dataset.clip)"
                    )
                    require(card_ids == expected_ids, f"{board_code}/{viewport_name}: card order")
                    require(
                        page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
                        f"{board_code}/{viewport_name}: horizontal overflow",
                    )
                    require(not console_errors, f"{board_code}/{viewport_name}: console {console_errors}")
                    require(not page_errors, f"{board_code}/{viewport_name}: page {page_errors}")
                    require(not failed_requests, f"{board_code}/{viewport_name}: requests {failed_requests}")
                    require(
                        page.locator("img").evaluate_all(
                            "images => images.every(img => img.complete && img.naturalWidth > 0)"
                        ),
                        f"{board_code}/{viewport_name}: image decode",
                    )

                    data = page.evaluate("window.CTS_WAN_DATA")
                    require(data["filmClipCount"] == 44, f"{board_code}: film count")
                    require(data["boardClipCount"] == len(expected_ids), f"{board_code}: board count")
                    require(data["exactSpendStatus"] == "[LOST]", f"{board_code}: spend status")
                    require(data["negativePrompt"] == negative, f"{board_code}: embedded negative")
                    require(
                        page.locator("#negative-prompt").input_value() == negative_dom,
                        f"{board_code}: normalized textarea negative",
                    )
                    data_by_id = {clip["clip"]: clip for clip in data["clips"]}
                    for clip_id in [clip for clip in expected_ids if clip in R3_IDS]:
                        number = clip_id.removeprefix("CTS-A-")
                        value = page.locator(f"#prompt-{number}").input_value()
                        require(value == prompts[clip_id], f"{board_code}/{viewport_name}: textarea {clip_id}")
                        require(data_by_id[clip_id]["prompt"] == prompts[clip_id], f"{board_code}: data {clip_id}")
                        require(
                            f"{clip_id}.mp4" in page.locator(f'[data-clip="{clip_id}"]').inner_text(),
                            f"{board_code}: output {clip_id}",
                        )

                    if board_code == "master-44":
                        page.locator('[data-filter="r3"]').click()
                        require(page.locator(".clip-card:not(.hidden)").count() == 10, "R3 filter count")
                        page.locator('[data-filter="all"]').click()

                    first_number = expected_ids[0].removeprefix("CTS-A-")
                    copy_button = page.locator(f'[data-copy="prompt-{first_number}"]')
                    copy_button.click()
                    require(copy_button.inner_text() == "COPIED", f"{board_code}: copy handler")

                    screenshot = SCREENSHOTS / f"{board_code}-{viewport_name}.png"
                    page.evaluate("window.scrollTo(0, 0)")
                    page.screenshot(path=str(screenshot), full_page=False)
                    board_audits.append(
                        {
                            "board": str(board_path),
                            "viewport": f"{width}x{height}",
                            "cards": len(card_ids),
                            "decodedImages": page.locator("img").count(),
                            "horizontalOverflow": False,
                            "consoleErrors": 0,
                            "pageErrors": 0,
                            "failedRequests": 0,
                            "canonicalPromptTextareas": len([clip for clip in expected_ids if clip in R3_IDS]),
                            "negativePromptPayloadByteEqual": True,
                            "negativePromptTextareaLineEndingNormalized": True,
                            "copyHandler": "GREEN",
                            "screenshot": str(screenshot),
                            "status": "GREEN",
                        }
                    )
                    context.close()
        finally:
            browser.close()

    audit = {
        "status": "GREEN",
        "label": "VERIFIED",
        "manifest": manifest_audit,
        "promptHashes": {
            clip_id: sha256(ROOT / "wan-prompts" / f"{clip_id}.txt") for clip_id in R3_IDS
        },
        "negativePrompt": {"sha256": sha256(negative_path), "unchanged": True},
        "boards": board_audits,
    }
    receipt_path = RECEIPTS / "R3-board-browser-audit.json"
    receipt_path.write_text(json.dumps(audit, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": audit["status"], "boards": len(board_audits), "receipt": str(receipt_path)}))


if __name__ == "__main__":
    main()
