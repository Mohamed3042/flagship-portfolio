import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const canonicalOrigin = 'https://mohamed-mahmoud-kuwait.netlify.app';

const publicAi = [
  'ask-repos',
  'enterprise-ai-automation-templates',
  'relayops',
  'petpoint-ops-hub',
];

const automation = [
  'career-autopilot',
  'lifeos',
  'medmac-document-studio',
  'medmac-box-studio',
  'cake-studio',
  'quotations-locker',
  'reclaim',
  'sheep-cycle',
  'resume-builder-skill',
  'polyblast-arena',
  'sheep-business-management',
  'spaceframe-world',
  'macroforge',
  'quotation-builder',
  'statement-styler',
  'prompt-king',
  'mk-voice',
  'montage-pro',
];

const foundation = [
  'meta-ads',
  'al-maali',
  'crm',
  'brand-system',
  'sheep-app',
  'hr-system',
  'medmac-website',
  'ai-workflow',
  'my-resume',
];

const lab = [
  'b2mh',
  'artillery3d',
  'war-strikes',
  'uberstrike-restoration',
  'cocolani-3d',
  'job-apply-engine',
  'portfolio-design-system',
];

const all = [...publicAi, ...automation, ...foundation, ...lab];
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

async function walkText(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walkText(path)));
    else if (/\.(?:astro|ts|js|mjs|json|md|html|xml|txt)$/i.test(entry.name)) files.push(path);
  }
  return files;
}

for (const lang of ['en', 'ar']) {
  const homePath = join(dist, lang, 'index.html');
  const home = await readFile(homePath, 'utf8');
  const direction = lang === 'ar' ? 'rtl' : 'ltr';
  assert(home.includes(`<html lang="${lang}" dir="${direction}">`), `${lang} homepage has the wrong language direction`);
  assert(home.includes(`${canonicalOrigin}/${lang}`), `${lang} homepage canonical is not on the production origin`);
  assert(home.includes(lang === 'en' ? 'Automation Engineer' : 'مهندس أتمتة'), `${lang} homepage is missing the Automation Engineer position`);

  for (const slug of all) {
    const href = `/${lang}/work/${slug}`;
    assert(home.includes(`href="${href}"`), `${lang} homepage does not link to ${slug}`);

    const storyPath = join(dist, lang, 'work', slug, 'index.html');
    const story = await readFile(storyPath, 'utf8');
    assert(story.includes(`<html lang="${lang}" dir="${direction}">`), `${href} has the wrong language direction`);
    assert(story.includes(`<link rel="canonical" href="${canonicalOrigin}${href}">`), `${href} has the wrong canonical URL`);
    assert((story.match(/<h1[\s>]/g) ?? []).length === 1, `${href} must contain exactly one h1`);
    assert(story.length > 8_000, `${href} appears unexpectedly thin`);
  }

  // One Sky home: the featured flight comes first, then the sky map lists
  // every story exactly once under the group a reader can check it by.
  assert(home.indexOf('id="work"') < home.indexOf('id="sky"'), `${lang} featured flight is not ahead of the sky map`);
  const map = home.slice(home.indexOf('id="sky"'));
  const groupOf = (slug) => map.match(new RegExp(`data-slug="${slug}" data-group="([a-z]+)"`))?.[1];
  for (const [group, slugs] of [['public', publicAi], ['automation', automation], ['lab', lab], ['foundation', foundation]]) {
    for (const slug of slugs) assert(groupOf(slug) === group, `${lang} sky map lists ${slug} under ${groupOf(slug)}, expected ${group}`);
  }
  assert(home.includes('id="lab"') && home.includes('id="foundation"'), `${lang} nav anchors #lab / #foundation are missing`);
}

const sourceFiles = await walkText(join(root, 'src'));
const publicTextFiles = await walkText(join(root, 'public'));
const distTextFiles = await walkText(dist);
const searchableFiles = [...sourceFiles, ...publicTextFiles, ...distTextFiles, join(root, 'README.md'), join(root, 'PRODUCT.md')];
const searchable = (await Promise.all(searchableFiles.map((file) => readFile(file, 'utf8')))).join('\n');

for (const stale of ['mohamed-khalil-kw.netlify.app', 'engineeringprofiles.github.io']) {
  assert(!searchable.includes(stale), `stale production origin found: ${stale}`);
}
for (const stale of ['A whole marketing team.', 'فريق تسويقٍ كامل.']) {
  assert(!searchable.includes(stale), `stale marketing positioning found: ${stale}`);
}

const systemSource =
  (await readFile(join(root, 'src', 'data', 'system-projects.ts'), 'utf8')) +
  (await readFile(join(root, 'src', 'data', 'new-projects.ts'), 'utf8'));
assert((systemSource.match(/section: 'automation'/g) ?? []).length === publicAi.length + automation.length, `automation story count must be ${publicAi.length + automation.length}`);
assert((systemSource.match(/section: 'lab'/g) ?? []).length === 7, 'Engineering Lab story count must be 7');

const allowedRepositoryLinks = new Set([
  'https://github.com/Mohamed3042/polyblast-arena',
  // verified PUBLIC with `gh repo view --json visibility` on 2026-09-17
  'https://github.com/Mohamed3042/ask-repos',
  'https://github.com/Mohamed3042/enterprise-ai-automation-templates',
  'https://github.com/Mohamed3042/ai-automation-command-center',
  'https://github.com/Mohamed3042/petpoint-ops-hub',
  'https://github.com/Mohamed3042/prompt-king',
]);
const featuredSource = await readFile(join(root, 'src', 'data', 'featured.ts'), 'utf8');
const repositoryLinks = [...(systemSource + featuredSource).matchAll(/https:\/\/github\.com\/Mohamed3042\/[A-Za-z0-9_.-]+/g)].map((match) => match[0]);
for (const link of repositoryLinks) {
  assert(allowedRepositoryLinks.has(link), `private or unreviewed repository URL leaked: ${link}`);
}

for (const slug of ['cocolani-3d', 'job-apply-engine']) {
  for (const lang of ['en', 'ar']) {
    const story = await readFile(join(dist, lang, 'work', slug, 'index.html'), 'utf8');
    assert(!story.includes('github.com/'), `${lang}/${slug} leaks a repository link`);
    assert(!story.includes('.git'), `${lang}/${slug} leaks a Git remote`);
  }
}

if (failures.length) {
  console.error(`Portfolio verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Static verification passed: ${all.length} stories × 2 languages, correct canonicals, sky-map grouping, and private-safe case studies.`);
