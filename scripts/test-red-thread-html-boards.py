#!/usr/bin/env python3
"""Rendered Chrome interaction test for both Red Thread generation boards."""

from __future__ import annotations

import argparse
import asyncio
import json
import socket
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

import websockets


CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
BOARDS = {
    "wan": "http://127.0.0.1:4617/worlds/assets/netflix/red-thread/wan/WAN-GENERATION-BOARD.html",
    "grok": "http://127.0.0.1:4617/worlds/assets/netflix/red-thread/grok/GROK-IMAGINE-2-GENERATION-BOARD.html",
}


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


class CDP:
    def __init__(self, websocket) -> None:
        self.websocket = websocket
        self.next_id = 0

    async def call(self, method: str, params: dict | None = None) -> dict:
        self.next_id += 1
        request_id = self.next_id
        await self.websocket.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(await self.websocket.recv())
            if message.get("id") != request_id:
                continue
            if "error" in message:
                raise RuntimeError(f"{method}: {message['error']}")
            return message.get("result", {})

    async def evaluate(self, expression: str):
        result = await self.call(
            "Runtime.evaluate",
            {"expression": expression, "awaitPromise": True, "returnByValue": True},
        )
        return result["result"].get("value")


async def wait_until(cdp: CDP, expression: str, timeout: float = 10) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if await cdp.evaluate(expression):
            return
        await asyncio.sleep(0.1)
    raise TimeoutError(f"condition did not become true: {expression}")


def wait_for_target(port: int, expected_url: str, timeout: float = 10) -> dict:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=1) as response:
                targets = json.load(response)
            for target in targets:
                if target.get("type") == "page" and target.get("url") == expected_url:
                    return target
        except Exception:
            pass
        time.sleep(0.1)
    raise TimeoutError(f"Chrome target did not start: {expected_url}")


async def inspect_board(provider: str, url: str) -> dict:
    port = free_port()
    with tempfile.TemporaryDirectory(prefix=f"red-thread-{provider}-chrome-") as profile:
        process = subprocess.Popen(
            [
                str(CHROME),
                "--headless=new",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-gpu",
                "--remote-allow-origins=*",
                f"--remote-debugging-port={port}",
                f"--user-data-dir={profile}",
                "--window-size=1440,1200",
                url,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        try:
            target = await asyncio.to_thread(wait_for_target, port, url)
            async with websockets.connect(target["webSocketDebuggerUrl"], max_size=4 * 1024 * 1024) as websocket:
                cdp = CDP(websocket)
                await cdp.call("Runtime.enable")
                await wait_until(cdp, "document.querySelectorAll('.card').length === 8")
                image_assets_ok = await cdp.evaluate(
                    """(async () => {
                      const results = await Promise.all([...document.images].map(source => new Promise(resolve => {
                        const image = new Image();
                        image.onload = () => resolve(true);
                        image.onerror = () => resolve(false);
                        image.src = source.src;
                      })));
                      return results.every(Boolean);
                    })()"""
                )
                initial = await cdp.evaluate(
                    """(() => ({
                      title: document.title,
                      provider: document.body.dataset.provider,
                      cards: document.querySelectorAll('.card').length,
                      prompts: document.querySelectorAll('.prompt').length,
                      images: document.images.length,
                      visible: document.querySelectorAll('.card:not([hidden])').length,
                      boardErrorHidden: document.querySelector('#board-error').hidden,
                      firstPromptStartsCorrectly: document.querySelector('.prompt').textContent.startsWith(
                        document.body.dataset.provider === 'wan' ? 'Generate single shot.' : 'Animate the supplied still as the exact first frame'
                      ),
                      crossProviderLink: Boolean(document.querySelector('.provider-switch a:not([aria-current="page"])'))
                    }))()"""
                )
                await cdp.evaluate(
                    """(() => {
                      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
                        writeText: async text => { window.__copiedPrompt = text; }
                      }});
                      document.querySelector('.copy').click();
                      return true;
                    })()"""
                )
                await wait_until(cdp, "document.querySelector('.copy').textContent === 'Copied exact prompt'")
                copy_ok = await cdp.evaluate("window.__copiedPrompt === document.querySelector('.prompt').textContent")
                await cdp.evaluate("document.querySelector('.done').click()")
                await wait_until(cdp, "document.querySelector('#done-count').textContent === '1'")
                done_persisted = await cdp.evaluate(
                    "JSON.parse(localStorage.getItem(document.body.dataset.stateKey) || '[]').includes('N01')"
                )
                await cdp.evaluate("document.querySelector('[data-state-filter=\"done\"]').click()")
                done_filter_count = await cdp.evaluate("document.querySelectorAll('.card:not([hidden])').length")
                await cdp.evaluate("document.querySelector('.done').click(); document.querySelector('[data-state-filter=\"all\"]').click()")
                await wait_until(cdp, "document.querySelector('#done-count').textContent === '0'")
                await cdp.evaluate("document.querySelector('[data-act-filter=\"IV\"]').click()")
                act_filter_count = await cdp.evaluate("document.querySelectorAll('.card:not([hidden])').length")
                result = {
                    **initial,
                    "allImageAssetsLoad": image_assets_ok,
                    "copyButtonWorks": copy_ok,
                    "doneTrackingPersists": done_persisted,
                    "doneFilterVisibleCards": done_filter_count,
                    "actIVVisibleCards": act_filter_count,
                }
                expected_title = "WAN 2.7" if provider == "wan" else "Grok Imagine 2.0"
                checks = [
                    result["provider"] == provider,
                    expected_title in result["title"],
                    result["cards"] == 8,
                    result["prompts"] == 8,
                    result["allImageAssetsLoad"] is True,
                    result["visible"] == 8,
                    result["boardErrorHidden"] is True,
                    result["firstPromptStartsCorrectly"] is True,
                    result["crossProviderLink"] is True,
                    result["copyButtonWorks"] is True,
                    result["doneTrackingPersists"] is True,
                    result["doneFilterVisibleCards"] == 1,
                    result["actIVVisibleCards"] == 1,
                ]
                if not all(checks):
                    raise AssertionError(json.dumps(result, indent=2))
                await cdp.call("Browser.close")
                return result
        finally:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.terminate()
                process.wait(timeout=5)


async def main(report_path: Path | None) -> int:
    if not CHROME.is_file():
        raise SystemExit(f"Chrome missing: {CHROME}")
    results = {}
    for provider, url in BOARDS.items():
        results[provider] = await inspect_board(provider, url)
    report = {"schema": "netflix-red-thread-html-boards-browser-qa/v1", "status": "GREEN", "boards": results}
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", type=Path)
    arguments = parser.parse_args()
    raise SystemExit(asyncio.run(main(arguments.report)))
