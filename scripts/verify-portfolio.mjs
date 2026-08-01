import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const canonicalOrigin = 'https://mohamed-mahmoud-kuwait.netlify.app';

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

const all = [...automation, ...foundation, ...lab];
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

  assert(automation.every((slug) => home.indexOf(`/work/${slug}`) < home.indexOf('id="foundation"')), `${lang} flagship stories are not ahead of the foundation section`);
  assert(lab.every((slug) => home.indexOf(`/work/${slug}`) > home.indexOf('id="lab"')), `${lang} lab stories are not inside the Engineering Lab section`);
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

const systemSource = await readFile(join(root, 'src', 'data', 'system-projects.ts'), 'utf8');
assert((systemSource.match(/section: 'automation'/g) ?? []).length === 10, 'automation story count must be 10');
assert((systemSource.match(/section: 'lab'/g) ?? []).length === 7, 'Engineering Lab story count must be 7');

const allowedRepositoryLinks = new Set([
  'https://github.com/Mohamed3042/polyblast-arena',
]);
const repositoryLinks = [...systemSource.matchAll(/https:\/\/github\.com\/Mohamed3042\/[A-Za-z0-9_.-]+/g)].map((match) => match[0]);
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

console.log(`Static verification passed: ${all.length} stories × 2 languages, correct canonicals, 10/9/7 ordering, and private-safe case studies.`);
