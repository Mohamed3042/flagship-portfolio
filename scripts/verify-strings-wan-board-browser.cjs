#!/usr/bin/env node

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const repo = path.resolve(__dirname, '..');
const publicDir = path.join(repo, 'public');
const boardRelative = '/worlds/assets/strings/wan-production/WAN-GENERATION-BOARD.html';
const stringsDir = path.join(publicDir, 'worlds', 'assets', 'strings');
const sabotage = process.argv.includes('--sabotage');

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? path.resolve(process.argv[index + 1]) : fallback;
}

const reportPath = argument(
  '--report',
  path.join(stringsDir, 'review', sabotage ? 'wan-board-browser-sabotage.json' : 'wan-board-browser-qa.json')
);
const screenshotDir = argument('--screenshots', path.join(repo, '.tmp', 'wan-board-proof'));

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function contentType(file) {
  const extension = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.png': 'image/png',
    '.json': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
  }[extension] || 'application/octet-stream';
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  if (requestPath === '/favicon.ico') {
    response.writeHead(204);
    response.end();
    return;
  }
  const target = path.resolve(publicDir, `.${requestPath}`);
  if (!target.startsWith(`${publicDir}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'content-type': contentType(target),
    'content-length': fs.statSync(target).size,
    'cache-control': 'no-store'
  });
  fs.createReadStream(target).pipe(response);
});

async function listen() {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return server.address().port;
}

async function run() {
  const port = await listen();
  const origin = `http://127.0.0.1:${port}`;
  const boardUrl = `${origin}${boardRelative}`;
  const browserExecutable = [
    chromium.executablePath(),
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ].find((candidate) => fs.existsSync(candidate));
  if (!browserExecutable) throw new Error('No installed Chromium browser executable was found');
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('requestfailed', (request) => requestFailures.push(`${request.url()} :: ${request.failure()?.errorText || 'failed'}`));

  try {
    await page.goto(boardUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => {
      for (const image of document.images) image.loading = 'eager';
    });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 30000 });

    if (sabotage) {
      await page.evaluate(() => document.querySelector('.clip-card:last-child')?.remove());
      console.log('SABOTAGE_APPLIED: removed the final clip card from the rendered DOM');
    }

    check((await page.title()).includes('CUT THE STRINGS'), 'Rendered page title is wrong');
    check(await page.locator('.clip-card').count() === 40, `Expected 40 rendered cards, found ${await page.locator('.clip-card').count()}`);

    const dataContract = await page.evaluate(() => ({
      clips: window.CTS_WAN_DATA?.clips?.length,
      jobs: window.CTS_WAN_DATA?.jobsSubmitted,
      credits: window.CTS_WAN_DATA?.creditsSpent,
      model: window.CTS_WAN_DATA?.model
    }));
    check(dataContract.clips === 40, `Embedded data exposes ${dataContract.clips} clips`);
    check(dataContract.jobs === 0, `Embedded data exposes ${dataContract.jobs} submitted jobs`);
    check(dataContract.credits === 0, `Embedded data exposes ${dataContract.credits} spent credits`);
    check(dataContract.model === 'WAN 2.7 image-to-video', 'Embedded model lock is wrong');

    const imageResults = await page.evaluate(() => [...document.images].map((image) => ({
      src: image.getAttribute('src'),
      width: image.naturalWidth,
      height: image.naturalHeight,
      complete: image.complete
    })));
    check(imageResults.length === 80, `Expected 80 rendered endpoint images, found ${imageResults.length}`);
    check(imageResults.every((image) => image.complete && image.width === 1920 && image.height === 1088), 'One or more rendered endpoint images did not decode at 1920x1088');
    check(await page.locator('.clip-card:not(.hidden)').count() === 40, 'All 40 cards must be visible initially');
    check(await page.locator('#CTS-A-001 img').count() === 2, 'First card does not render both endpoint images');
    check((await page.locator('#prompt-001').inputValue()).startsWith('Generate single shot.'), 'First rendered prompt lost its literal prefix');
    check((await page.locator('#prompt-001').inputValue()).endsWith('No dialogue. No background music.'), 'First rendered prompt lost its literal suffix');

    const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(desktopOverflow <= 1, `Desktop page overflows horizontally by ${desktopOverflow}px`);

    await page.locator('[data-copy="prompt-001"]').click();
    const clipboardPrompt = await page.evaluate(() => navigator.clipboard.readText());
    check(clipboardPrompt === await page.locator('#prompt-001').inputValue(), 'Copy prompt did not place the exact prompt on the clipboard');
    check(await page.locator('[data-copy="prompt-001"]').textContent() === 'Copied', 'Copy prompt confirmation did not render');

    const firstDone = page.locator('#CTS-A-001 [data-state="done"]');
    await firstDone.check();
    check((await page.locator('#progress').textContent()).trim() === '1 / 40 done', 'Done progress did not advance to 1 / 40');
    await page.reload({ waitUntil: 'networkidle' });
    check(await page.locator('#CTS-A-001 [data-state="done"]').isChecked(), 'Done state did not persist after reload');

    await page.locator('#show-pending').click();
    check(await page.locator('.clip-card:not(.hidden)').count() === 39, 'Pending filter did not hide exactly one completed card');
    check(await page.locator('#CTS-A-001').evaluate((element) => element.classList.contains('hidden')), 'Completed first card stayed visible under Pending only');

    await page.locator('#act-filter').selectOption('2');
    check(await page.locator('.clip-card:not(.hidden)').count() === 10, 'Act II plus Pending filter should show 10 cards');
    await page.locator('#show-pending').click();
    await page.locator('#act-filter').selectOption('4');
    check(await page.locator('.clip-card:not(.hidden)').count() === 10, 'Act IV filter should show exactly 10 cards');
    await page.locator('#act-filter').selectOption('all');

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#reset').click();
    check(!await page.locator('#CTS-A-001 [data-state="done"]').isChecked(), 'Reset did not clear the first Done tick');
    check((await page.locator('#progress').textContent()).trim() === '0 / 40 done', 'Reset did not restore 0 / 40 progress');
    check(await page.evaluate(() => localStorage.getItem('cut-the-strings-wan-owner-board-v1')) === null, 'Reset did not clear persistent local state');

    if (!sabotage) {
      fs.mkdirSync(screenshotDir, { recursive: true });
      await page.locator('#CTS-A-001').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(screenshotDir, 'CTS-WAN-board-desktop.png'), fullPage: false });
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${boardUrl}?phone=1`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
    });
    const phoneOverflowTop = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(phoneOverflowTop <= 1, `Phone top view overflows horizontally by ${phoneOverflowTop}px`);
    if (!sabotage) await page.screenshot({ path: path.join(screenshotDir, 'CTS-WAN-board-phone-top.png'), fullPage: false });

    await page.evaluate(() => {
      const card = document.querySelector('#CTS-A-001');
      const lockbar = document.querySelector('.lockbar');
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, card.offsetTop - lockbar.offsetHeight - 8);
    });
    const phoneLayout = await page.locator('#CTS-A-001 .frames').evaluate((frames) => {
      const figures = frames.querySelectorAll('figure');
      const first = figures[0].getBoundingClientRect();
      const second = figures[1].getBoundingClientRect();
      return {
        firstLeft: first.left,
        firstRight: first.right,
        secondLeft: second.left,
        secondRight: second.right,
        firstTop: first.top,
        secondTop: second.top,
        viewport: document.documentElement.clientWidth,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
    check(phoneLayout.secondTop > phoneLayout.firstTop, 'Phone endpoint frames are not stacked vertically');
    check(phoneLayout.firstLeft >= 0 && phoneLayout.secondLeft >= 0, 'Phone endpoint frame starts outside the viewport');
    check(phoneLayout.firstRight <= phoneLayout.viewport && phoneLayout.secondRight <= phoneLayout.viewport, 'Phone endpoint frame exceeds the viewport');
    check(phoneLayout.overflow <= 1, `Phone card view overflows horizontally by ${phoneLayout.overflow}px`);
    if (!sabotage) await page.screenshot({ path: path.join(screenshotDir, 'CTS-WAN-board-phone-card.png'), fullPage: false });

    const boardFileUrl = pathToFileURL(path.join(stringsDir, 'wan-production', 'WAN-GENERATION-BOARD.html')).href;
    await page.goto(boardFileUrl, { waitUntil: 'load' });
    await page.evaluate(() => {
      for (const image of document.images) image.loading = 'eager';
    });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 30000 });
    check(await page.evaluate(() => location.protocol) === 'file:', 'Offline board did not open with the file protocol');
    check(await page.locator('.clip-card').count() === 40, 'Offline file-protocol board does not render 40 cards');
    const offlineImages = await page.evaluate(() => [...document.images].map((image) => [image.naturalWidth, image.naturalHeight]));
    check(offlineImages.length === 80, `Offline board rendered ${offlineImages.length} endpoint images instead of 80`);
    check(offlineImages.every(([width, height]) => width === 1920 && height === 1088), 'Offline board failed to decode an approved endpoint at 1920x1088');

    check(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);
    check(pageErrors.length === 0, `Page errors: ${pageErrors.join(' | ')}`);
    check(requestFailures.length === 0, `Failed requests: ${requestFailures.join(' | ')}`);
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const report = {
    schema: 'cut-the-strings-wan-board-browser-qa/v1',
    result: failures.length ? 'RED' : 'GREEN',
    checks,
    passed: checks - failures.length,
    failures,
    sabotage,
    viewportDesktop: '1440x1100',
    viewportPhone: '390x844',
    offlineFileProtocol: true,
    renderedCardsExpected: 40,
    renderedEndpointImagesExpected: 80,
    consoleErrors,
    pageErrors,
    requestFailures,
    screenshots: sabotage ? [] : [
      path.join(screenshotDir, 'CTS-WAN-board-desktop.png'),
      path.join(screenshotDir, 'CTS-WAN-board-phone-top.png'),
      path.join(screenshotDir, 'CTS-WAN-board-phone-card.png')
    ]
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (failures.length) {
    console.error(`BROWSER_RED ${checks - failures.length}/${checks}`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(`BROWSER_GREEN ${checks}/${checks}`);
  console.log('RENDERED_CONTRACT 40 cards | 80 decoded endpoint images | persistent Done state | desktop + 390x844 | 0 browser errors');
}

run().catch(async (error) => {
  try {
    if (server.listening) await new Promise((resolve) => server.close(resolve));
  } catch {}
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
