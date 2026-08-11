import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const htmlPath = join(root, 'public', 'worlds', 'cake-studio.html');
const html = readFileSync(htmlPath, 'utf8');
const activeHtml = html
  .replace(/<template data-retired-coda>[\s\S]*?<\/template>/g, '')
  .replace(/<template data-retired-credits>[\s\S]*?<\/template>/g, '');
const cinema = readFileSync(join(root, 'public', 'worlds', 'cinema.js'), 'utf8');
const director = readFileSync(join(root, 'public', 'worlds', 'cake-studio.js'), 'utf8');
const css = readFileSync(join(root, 'public', 'worlds', 'cake-studio.css'), 'utf8');
const results = [];

const check = (name, pass, detail = '') => {
  results.push({ name, pass: Boolean(pass), detail });
};

const count = (pattern, source = html) => [...source.matchAll(pattern)].length;
const indexOf = (needle) => html.indexOf(needle);

check('release is v1.6.0', /<body[^>]+data-version="1\.6\.0"/.test(html));
check('visible release badge is v1.6', />v1\.6 · WORLD 09</.test(html));
check('fifty accepted film clips remain', count(/data-clip="cake-studio\/clips\/CST-\d{3}\.mp4"/g) === 50);
check('film sequence still starts at CST-001', indexOf('cake-studio/clips/CST-001.mp4') >= 0);
check('film sequence still ends at CST-050', indexOf('cake-studio/clips/CST-050.mp4') > indexOf('cake-studio/clips/CST-001.mp4'));

const introIndex = indexOf('data-bookend="intro"');
const reelIndex = indexOf('id="cake-reel"');
const outroIndex = indexOf('data-bookend="outro"');
const activeIntroIndex = activeHtml.indexOf('data-bookend="intro"');
const activeOutroIndex = activeHtml.indexOf('data-bookend="outro"');
const introSection = activeHtml.slice(activeHtml.lastIndexOf('<section', activeIntroIndex), activeHtml.indexOf('</section>', activeIntroIndex));
const outroSection = activeHtml.slice(activeHtml.lastIndexOf('<section', activeOutroIndex), activeHtml.indexOf('</section>', activeOutroIndex));
const bookendCopy = `${introSection}\n${outroSection}`.replace(/<[^>]+>/g, ' ');
check('cinematic intro exists before frame 1', introIndex >= 0 && introIndex < reelIndex);
check('cinematic outro exists after frame 50', outroIndex > reelIndex);
check('exactly two active bookends exist', count(/data-bookend="(?:intro|outro)"/g, activeHtml) === 2);
check('intro plate is scroll-scrubbed', /data-bookend="intro"[^>]+data-plate="cake-studio\/bookends\/cake-studio-intro\.mp4"/.test(html));
check('outro plate is scroll-scrubbed', /data-bookend="outro"[^>]+data-plate="cake-studio\/bookends\/cake-studio-outro\.mp4"/.test(html));
check('bookends keep authored motion active', count(/data-plate-motion="always"/g) === 2);
check('intro uses only short cinematic copy', !/class="ident-brief"|class="sub"|Your hand is the operator/.test(html.slice(0, reelIndex)));
check('intro title is five words', /<span class="L en">The Cake Is<br>Made Twice<\/span>/.test(html));
check('bookend copy rejects technical jargon', !/\b(?:WAN|H\.264|endpoint|weighted|pipeline|WebGL|GLB|immutable|fulfilment)\b/i.test(bookendCopy));
check('bookend CSS is present', /\.bookend\s*\{[^}]*height:/s.test(css) && /\.bookend-copy-outro/s.test(css));
check('director release is v1.6.0', /version:\s*'1\.6\.0'/.test(director) && /directorVersion\s*=\s*'1\.6\.0'/.test(director));
check('always-motion override is implemented', /always:\s*scene\.dataset\.plateMotion\s*===\s*'always'/.test(cinema) && /!reduced\s*\|\|\s*u\.always/.test(cinema));

check('old dimensional appendix is inactive', !/data-object-coda|class="[^"]*dimensional-coda/.test(activeHtml));
check('old proof dashboard is inactive', !/data-proof-portal|proof-portal|Order fulfilment workflow/.test(activeHtml));
check('retired appendix is preserved inertly', count(/<template data-retired-(?:coda|credits)>/g) === 2);
check('old WebGL coda bootstrap removed', !/cake-studio-coda-loader|type="importmap"/.test(activeHtml));

const media = [
  ['intro', 'cake-studio-intro.mp4', 6],
  ['outro', 'cake-studio-outro.mp4', 6],
];

for (const [label, filename, expectedDuration] of media) {
  const path = join(root, 'public', 'worlds', 'cake-studio', 'bookends', filename);
  check(`${label} media exists`, existsSync(path));
  if (!existsSync(path)) continue;
  try {
    const probe = JSON.parse(execFileSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames',
      '-of', 'json',
      path,
    ], { encoding: 'utf8' }));
    const video = probe.streams.find((stream) => stream.codec_name === 'h264');
    const audio = probe.streams.find((stream) => stream.codec_type === 'audio');
    const duration = Number(probe.format.duration);
    check(`${label} is H.264 1280x720`, video?.width === 1280 && video?.height === 720, JSON.stringify(video ?? {}));
    check(`${label} is 30 fps`, video?.r_frame_rate === '30/1', video?.r_frame_rate ?? 'missing');
    check(`${label} has exact frame count`, Number(video?.nb_frames) === expectedDuration * 30, video?.nb_frames ?? 'missing');
    check(`${label} duration is ${expectedDuration}s`, Math.abs(duration - expectedDuration) < 0.05, String(duration));
    check(`${label} is silent`, !audio);
    check(`${label} stays below 5 MiB`, statSync(path).size < 5 * 1024 * 1024, `${statSync(path).size} bytes`);
    const bytes = readFileSync(path);
    const moov = bytes.indexOf(Buffer.from('moov'));
    const mdat = bytes.indexOf(Buffer.from('mdat'));
    check(`${label} is fast-started`, moov > 0 && mdat > 0 && moov < mdat, `moov=${moov}, mdat=${mdat}`);
  } catch (error) {
    check(`${label} metadata is readable`, false, error.message);
  }
}

const seamSsim = (first, second, firstFrame, secondFrame) => {
  const run = spawnSync('ffmpeg', [
    '-hide_banner', '-v', 'info',
    '-i', first, '-i', second,
    '-filter_complex', `[0:v]select='eq(n,${firstFrame})',setpts=PTS-STARTPTS[a];[1:v]select='eq(n,${secondFrame})',setpts=PTS-STARTPTS[b];[a][b]ssim`,
    '-frames:v', '1', '-f', 'null', '-',
  ], { encoding: 'utf8' });
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`;
  const match = output.match(/All:([0-9.]+)/);
  return { value: Number(match?.[1]), output, status: run.status };
};

const clipsRoot = join(root, 'public', 'worlds', 'cake-studio', 'clips');
const bookendsRoot = join(root, 'public', 'worlds', 'cake-studio', 'bookends');
const seams = [
  ['intro to frame 1', join(bookendsRoot, 'cake-studio-intro.mp4'), join(clipsRoot, 'CST-001.mp4'), 179, 0],
  ['frame 50 to outro', join(clipsRoot, 'CST-050.mp4'), join(bookendsRoot, 'cake-studio-outro.mp4'), 149, 0],
];

for (const [label, first, second, firstFrame, secondFrame] of seams) {
  const metric = seamSsim(first, second, firstFrame, secondFrame);
  check(`${label} seam SSIM is at least 0.98`, metric.status === 0 && metric.value >= 0.98, String(metric.value));
}

for (const result of results) {
  console.log(`${result.pass ? 'PASS' : 'FAIL'} ${result.name}${result.detail ? ` · ${result.detail}` : ''}`);
}

const failed = results.filter((result) => !result.pass);
console.log(`\nCake Studio bookends: ${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length) process.exit(1);
