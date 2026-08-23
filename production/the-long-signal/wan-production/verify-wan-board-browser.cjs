const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const here = __dirname;
const repo = path.resolve(here, "../../..");
const review = path.join(repo, "public/worlds/assets/signal/review");
const boardRoute = "/production/the-long-signal/wan-production/WAN-GENERATION-BOARD.html";
const chrome = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const edge = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const runtimeModules = String.raw`C:\Users\GAMING\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules`;
const { chromium } = require(path.join(runtimeModules, "playwright"));

const mime = new Map([
  [".html", "text/html; charset=utf-8"], [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".png", "image/png"], [".csv", "text/csv; charset=utf-8"]
]);

function startServer() {
  const server = http.createServer((request, response) => {
    const urlPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const absolute = path.resolve(repo, `.${urlPath}`);
    if (!absolute.startsWith(repo + path.sep) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      response.writeHead(404).end("not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mime.get(path.extname(absolute).toLowerCase()) || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(absolute).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

function check(condition, message, failures) {
  if (!condition) failures.push(message);
}

(async () => {
  fs.mkdirSync(review, { recursive: true });
  const failures = [];
  const consoleErrors = [];
  const externalRequests = [];
  const executablePath = fs.existsSync(chrome) ? chrome : edge;
  if (!fs.existsSync(executablePath)) throw new Error("no installed Chrome or Edge executable");
  const server = await startServer();
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const url = origin + boardRoute;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath, args: ["--disable-gpu"] });
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await desktop.newPage();
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(String(error)));
    page.on("request", (request) => { if (!request.url().startsWith(origin)) externalRequests.push(request.url()); });
    const response = await page.goto(url, { waitUntil: "networkidle" });
    check(response && response.status() === 200, "board HTTP status is not 200", failures);
    check(await page.locator(".card").count() === 40, "rendered card count is not 40", failures);
    check(await page.locator(".frame-link img").count() === 80, "rendered endpoint image count is not 80", failures);
    check(await page.locator(".bridge").count() === 17, "rendered physical-bridge badge count is not 17", failures);
    check((await page.locator(".qa-pass").innerText()).includes("PROMPT QA GREEN"), "rendered prompt-QA banner is not GREEN", failures);
    const promptGate = await page.locator(".prompt").evaluateAll((nodes) => nodes.every((node) => {
      const prompt = node.textContent || "";
      const words = prompt.trim().split(/\s+/).filter(Boolean).length;
      const positive = prompt.replace("No dialogue. No background music.", "");
      return words >= 45 && words <= 90
        && prompt.startsWith("Generate single shot. Begin on Image 1.")
        && prompt.includes("End on Image 2 by 4.5 seconds and hold.")
        && !/\b(no|never|without|avoid|exclude|nothing|zero|unintended|extra|morph(?:ing)?|warp(?:ing)?|flicker|jitter|dissolve|crossfade|cut|text|captions?|subtitles?|watermark|logos?)\b/i.test(positive);
    }));
    check(promptGate, "one or more rendered prompts failed content QA", failures);
    for (let index = 1; index <= 40; index += 1) {
      const id = `SIG-${String(index).padStart(3, "0")}`;
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForFunction((cardId) => [...document.querySelectorAll(`#${cardId} img`)].every((image) => image.complete && image.naturalWidth === 1920 && image.naturalHeight === 1088), id);
    }
    const imageGate = await page.locator(".frame-link img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth === 1920 && image.naturalHeight === 1088));
    check(imageGate, "one or more rendered endpoints failed decoded 1920x1088 gate", failures);
    check(await page.locator("#done-count").innerText() === "0", "fresh desktop state is not 0/40", failures);
    await page.locator("#SIG-001").screenshot({ path: path.join(review, "SIG-WAN-board-card-001.png") });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.scrollingElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    await page.waitForFunction(() => scrollY === 0);
    await page.screenshot({ path: path.join(review, "SIG-WAN-board-desktop.png"), fullPage: false });

    const firstPrompt = await page.locator("#SIG-001 .prompt").innerText();
    await page.locator("#SIG-001 .copy-prompt").click();
    check(await page.evaluate(() => navigator.clipboard.readText()) === firstPrompt, "copy-prompt clipboard content drifted", failures);
    await page.locator("#SIG-001 .status").selectOption("done");
    await page.locator("#SIG-001 .task-id").fill("browser-proof-task");
    await page.locator("#SIG-001 .seed-used").fill("101101");
    await page.locator("#SIG-001 .attempts").fill("1");
    await page.locator("#SIG-001 .notes").fill("browser persistence proof");
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator("#SIG-001 .status").inputValue() === "done", "status did not persist", failures);
    check(await page.locator("#SIG-001 .task-id").inputValue() === "browser-proof-task", "task ID did not persist", failures);
    check(await page.locator("#done-count").innerText() === "1", "done counter did not persist", failures);
    await page.locator('[data-filter="done"]').click();
    check(await page.locator(".card:visible").count() === 1, "done filter did not isolate one card", failures);
    await page.locator('[data-filter="pending"]').click();
    check(await page.locator(".card:visible").count() === 39, "pending filter did not show 39 cards", failures);
    await page.locator("#copy-manifest").click();
    const csvText = await page.evaluate(() => navigator.clipboard.readText());
    check((csvText.match(/\n/g) || []).length === 41, "copied manifest does not contain header plus 40 rows", failures);
    check(csvText.includes("browser-proof-task"), "copied manifest omitted persisted task ID", failures);
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    const mobilePage = await mobile.newPage();
    mobilePage.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    mobilePage.on("pageerror", (error) => consoleErrors.push(String(error)));
    mobilePage.on("request", (request) => { if (!request.url().startsWith(origin)) externalRequests.push(request.url()); });
    await mobilePage.goto(url, { waitUntil: "networkidle" });
    check(await mobilePage.locator(".card").count() === 40, "mobile card count is not 40", failures);
    const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(overflow <= 0, `mobile horizontal overflow is ${overflow}px`, failures);
    await mobilePage.screenshot({ path: path.join(review, "SIG-WAN-board-mobile.png"), fullPage: false });
    await mobile.close();
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const report = {
    schema: "the-long-signal-wan-board-browser-qa/v1",
    status: failures.length || consoleErrors.length || externalRequests.length ? "RED" : "GREEN",
    desktopViewport: "1440x1100@1",
    mobileViewport: "390x844@3",
    renderedCards: 40,
    decodedEndpointImages: 80,
    renderedPromptQa: true,
    physicalBridgeBadges: 17,
    persistenceTest: true,
    copyTest: true,
    externalRequests,
    consoleErrors,
    failures,
    wanCreditsSpent: 0
  };
  fs.writeFileSync(path.join(review, "wan-board-browser-qa.json"), `${JSON.stringify(report, null, 2)}\n`);
  if (report.status === "RED") {
    [...failures, ...consoleErrors, ...externalRequests].forEach((failure) => console.error(`RED ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("GREEN_BROWSER 40/40 cards, 80/80 decoded endpoints, 40/40 rendered prompts, 17/17 bridge badges, copy + persistence + filters, 390x844 DPR3 no overflow, 0 external requests");
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
