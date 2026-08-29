import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../public/cv-intake/', import.meta.url);
const sourceRoot = new URL('../', import.meta.url);
const failures = [];

const mustRead = async (name) => {
  try {
    return await readFile(new URL(name, root), 'utf8');
  } catch {
    failures.push(`missing public/cv-intake/${name}`);
    return '';
  }
};

const [html, css, js] = await Promise.all([
  mustRead('index.html'),
  mustRead('styles.css'),
  mustRead('app.js'),
]);

const requireText = (haystack, needle, label = needle) => {
  if (!haystack.includes(needle)) failures.push(`missing ${label}`);
};

requireText(html, '<meta name="robots" content="noindex,nofollow,noarchive">', 'noindex policy');
requireText(html, "connect-src 'none'", 'CSP connect-src none');
requireText(html, "form-action 'none'", 'CSP form-action none');
requireText(html, 'referrer" content="no-referrer', 'no-referrer policy');
requireText(html, 'id="facts-form"', 'facts form');
requireText(html, 'id="privacy-note"', 'privacy notice');
requireText(html, 'styles.css', 'external stylesheet');
requireText(html, 'app.js', 'external script');

requireText(js, 'TEMPLATE_REVISION', 'template revision');
requireText(js, 'medo433447@gmail.com', 'approved application email');
requireText(js, 'Mohamed Mahmoud', 'personal brand');
requireText(js, 'Information Systems Developer', 'confirmed Medmac title');
requireText(js, 'Sheep Business Management System', 'Sheep BMS');
requireText(js, 'Medmac Quotation Builder', 'Medmac Quotation Builder');
requireText(js, 'Products Editor', 'Products Editor');
requireText(js, 'Human Bridge', 'Human Bridge');
requireText(js, 'Worlds home', 'Worlds home');
requireText(js, 'Project book', 'Project book');
requireText(js, 'Other', 'Other answer control');
requireText(js, '[NEEDS INPUT]', 'fail-closed open marker');
requireText(js, 'download', 'local download export');
requireText(js, 'textContent', 'safe text rendering');
requireText(js, 'dir', 'RTL direction support');
requireText(css, ':focus-visible', 'visible keyboard focus');
requireText(css, '@media (prefers-reduced-motion: reduce)', 'reduced-motion support');

if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) failures.push('inline script is forbidden');
if (/<style(?:\s|>)/i.test(html)) failures.push('inline style is forbidden');
if (/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(js)) failures.push('network API present');
if (/\.innerHTML\s*=|insertAdjacentHTML|\beval\s*\(/.test(js)) failures.push('unsafe HTML/code injection present');
if (/https?:\/\/(?!mohamed3042\.github\.io|github\.com\/Mohamed3042|www\.linkedin\.com\/in\/)/i.test(`${html}\n${css}\n${js}`)) {
  failures.push('unexpected external URL in intake artifact');
}

const forbiddenEmployerAddress = new RegExp(`contact${'@'}medmack\\.com`, 'i');
const forbiddenSensitiveSeed = /2002-01-22|22\s+Jan(?:uary)?\s+2002|\bKWD\s*600\b/i;
if (forbiddenEmployerAddress.test(`${html}\n${css}\n${js}`)) failures.push('employer email leaked into public intake');
if (forbiddenSensitiveSeed.test(`${html}\n${css}\n${js}`)) failures.push('sensitive candidate default leaked into public intake');

const profile = await readFile(new URL('src/data/profile.ts', sourceRoot), 'utf8');
const layout = await readFile(new URL('src/layouts/BaseLayout.astro', sourceRoot), 'utf8');
if (/nickname:\s*['"]Medmac['"]/.test(profile)) failures.push('personal nickname still uses employer brand');
if (/profile\.nickname/.test(layout)) failures.push('person schema still publishes employer brand as nickname');

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
};

try {
  const files = await walk(new URL('.', root));
  const allowed = new Set(['index.html', 'styles.css', 'app.js']);
  for (const file of files) {
    const rel = relative(new URL('.', root).pathname.slice(1), file).replaceAll('\\', '/');
    if (!allowed.has(rel)) failures.push(`unexpected public intake file: ${rel}`);
  }
} catch {
  // The missing-path error above is the useful fail-first message.
}

if (failures.length) {
  console.error(`CV_INTAKE_RED (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('CV_INTAKE_GREEN files=3 network=0 inline=0 public-sensitive-seeds=0 identity-brand=clean');
