import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const page = read('public', 'worlds', 'cake-studio.html');
const css = read('public', 'worlds', 'cake-studio.css');
const js = read('public', 'worlds', 'cake-studio.js');
const manifestPath = path.join(root, 'public', 'worlds', 'cake-studio', 'v17', 'manifest.json');
const runtimeRoot = path.dirname(manifestPath);
const clipsRoot = path.join(runtimeRoot, 'clips');
const stillsRoot = path.join(runtimeRoot, 'stills');
const publicOwnerPack = path.join(root, 'public', 'worlds', 'assets', 'cake-studio-v17', 'wan-production');
const releaseVersion = '1.7.1';
const phoneContract = {
  intro: { file: 'CST17-INTRO-PHONE-v171.mp4', beats: 10 },
  outro: { file: 'CST17-OUTRO-PHONE-v171.mp4', beats: 5 },
};
const failures = [];

function check(name, condition, evidence = '') {
  if (!condition) failures.push(`${name}${evidence ? `: ${evidence}` : ''}`);
}

function count(pattern, value) {
  return (value.match(pattern) || []).length;
}

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const active = page.replace(/<template[\s\S]*?<\/template>/g, '');
check('v1.7.1 body version', /<body[^>]+data-version="1\.7\.1"/.test(page));
check('v1.7.1 visible version', />v1\.7\.1\s*·\s*WORLD 09</.test(page));
check('two active v1.7 sequences', count(/data-cake-bookend="(?:intro|outro)"/g, active) === 2);
check('two canonical v1.7.1 phone manifests', count(/data-bookend-manifest="cake-studio\/v17\/manifest\.json\?v=1\.7\.1-phone-final"/g, active) === 2);
check('two inert phone video transports', count(/<video[^>]+data-bookend-phone-video[^>]+preload="none"[^>]*>/g, active) === 2);
const cssCache = page.match(/href="cake-studio\.css\?v=([^"]+)"/);
const jsCache = page.match(/src="cake-studio\.js\?v=([^"]+)"/);
check('page CSS and JS cache refs match v11', Boolean(cssCache && jsCache && cssCache[1] === '11' && jsCache[1] === '11'), `${cssCache?.[1] || 'missing'}/${jsCache?.[1] || 'missing'}`);
check('old v1.7.0 release refs removed', !/1\.7\.0/.test(active));
check('old single-plate bookends removed', !/data-bookend="(?:intro|outro)"[^>]+data-plate=/.test(active));
check('old always-motion override removed', !/data-plate-motion="always"/.test(active));
check('intro remains before reel', active.indexOf('data-cake-bookend="intro"') < active.indexOf('id="cake-reel"'));
check('outro remains after reel', active.indexOf('data-cake-bookend="outro"') > active.indexOf('id="cake-reel"'));
check('minimal bilingual copy remains', count(/class="bookend-copy/g, active) === 2 && count(/class="L en"/g, active) > 2 && count(/class="L ar"/g, active) > 2);
check('retired appendix stays inert', count(/<template data-retired-(?:coda|credits)>/g, page) === 2);

check('v1.7 contained stage CSS', /\.bookend-aperture[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/.test(css));
check('bookend media uses contain', /\.bookend-(?:poster|canvas)[^{]*\{[^}]*object-fit:\s*contain/s.test(css));
check('bookend cover crop removed', !/\.bookend-(?:poster|canvas|frame)[^{]*\{[^}]*object-fit:\s*cover/s.test(css));
check('opening earns ten-shot scroll span', /\.bookend-intro\s*\{[^}]*height:\s*8[0-9]{2}vh/s.test(css));
check('ending earns five-shot scroll span', /\.bookend-outro\s*\{[^}]*height:\s*4[0-9]{2}vh/s.test(css));
check('phone aperture stays uncropped', /@media\s*\(max-width:\s*700px\)[\s\S]*?\.bookend-aperture[\s\S]*?width:\s*100vw/s.test(css));
check('reduced-motion CSS path', /prefers-reduced-motion:\s*reduce[\s\S]*?\.bookend-copy/s.test(css));

check('page-local sequence runtime exists', /window\.__cakeStudioBookends/.test(js));
check('sequence runtime never calls play', !/\.play\s*\(/.test(js));
check('sequence runtime reads manifest', /bookendManifest/.test(js) && /fetch\s*\(/.test(js));
check('sequence runtime paints decoded frames', /requestVideoFrameCallback/.test(js) && /drawImage\s*\(/.test(js));
check('sequence runtime exposes still mode', /prefers-reduced-motion/.test(js) && /sequenceMode/.test(js));
check('desktop sequence runtime retains two slots', /unit\.phoneMode\s*\?\s*\[\]\s*:\s*Array\.from\(\{\s*length:\s*2\s*\}/.test(js));
check('phone runtime is v1.7.1 manifest-driven', /version:\s*'1\.7\.1'/.test(js) && /manifest\.version\s*!==\s*'1\.7\.1'/.test(js));
check('phone runtime selects coarse or narrow screens', /max-width:\s*700px/.test(js) && /pointer:\s*coarse/.test(js));
check('phone runtime keeps one persistent staged transport', /armPhoneMaster/.test(js)
  && /slot\.video\.preload\s*=\s*unit\.trackName\s*===\s*'intro'\s*\?\s*'auto'\s*:\s*'metadata'/.test(js)
  && /unit\.phoneMaster\.src/.test(js));
check('phone runtime warms distant outro into a blob transport', /const warmPhoneMaster\s*=\s*\(unit\)\s*=>/.test(js)
  && /!unit\?\.phoneMode\s*\|\|\s*reducedMotion\.matches/.test(js)
  && /fetch\(unit\.phoneMaster\.src,\s*\{[\s\S]*?cache:\s*'force-cache'/.test(js)
  && /response\.blob\(\)/.test(js)
  && /unit\.phoneBlobUrl\s*=\s*URL\.createObjectURL\(blob\)/.test(js)
  && /activatePhoneBlob\(unit,\s*unit\.phoneBlobUrl\)/.test(js)
  && /const warmOutro\s*=\s*\(\)\s*=>\s*warmPhoneMaster\(outro\)/.test(js)
  && /intro\?\.scene\.addEventListener\('scene:idle',\s*warmOutro,\s*\{\s*once:\s*true\s*\}\)/.test(js)
  && /outro\?\.scene\.addEventListener\('scene:live',\s*warmOutro,\s*\{\s*once:\s*true\s*\}\)/.test(js));

check('bookend manifest exists', fs.existsSync(manifestPath));
check('owner WAN pack stays outside public', !fs.existsSync(publicOwnerPack));
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  check('manifest schema', manifest.schema === 'cake-studio-bookends/v1');
  check('manifest version', manifest.version === releaseVersion);
  check('manifest settings', manifest.width === 1280 && manifest.height === 720 && manifest.fps === 30 && manifest.duration === 5);
  check('manifest delivery contract', manifest.delivery?.codec === 'H.264'
    && manifest.delivery?.pixelFormat === 'yuv420p'
    && manifest.delivery?.silent === true
    && manifest.delivery?.keyframeInterval === 15
    && manifest.delivery?.faststart === true
    && manifest.delivery?.endpointConditioning?.openingConvergenceFrames === 9
    && manifest.delivery?.endpointConditioning?.closingConvergenceStartFrame === 126
    && manifest.delivery?.endpointConditioning?.closingConvergenceEndFrame === 135
    && manifest.delivery?.endpointConditioning?.exactFinalHoldFrames === 15);
  check('manifest phone delivery contract', manifest.delivery?.phoneMaster?.codec === 'H.264'
    && manifest.delivery?.phoneMaster?.pixelFormat === 'yuv420p'
    && manifest.delivery?.phoneMaster?.width === 854
    && manifest.delivery?.phoneMaster?.height === 480
    && manifest.delivery?.phoneMaster?.fps === 30
    && manifest.delivery?.phoneMaster?.beatFrames === 136
    && manifest.delivery?.phoneMaster?.finalTailExtraFrames === 14
    && manifest.delivery?.phoneMaster?.keyframeInterval === 15
    && manifest.delivery?.phoneMaster?.silent === true
    && manifest.delivery?.phoneMaster?.faststart === true);
  check('manifest has ten intro clips', manifest.tracks?.intro?.clips?.length === 10);
  check('manifest has five outro clips', manifest.tracks?.outro?.clips?.length === 5);
  const runtimeClips = Object.values(manifest.tracks || {}).flatMap((track) => track.clips || []);
  check('runtime media uses canonical clips path', runtimeClips.every((clip) => /^cake-studio\/v17\/clips\/CST17-[IO][0-9]{2}\.mp4$/.test(clip.src)));
  check('runtime endpoints use canonical WebP path', runtimeClips.every((clip) => /^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/.test(clip.first) && /^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/.test(clip.last)));
  const endpointFiles = new Set(runtimeClips.flatMap((clip) => [clip.first, clip.last]));
  check('runtime has seventeen endpoint stills', endpointFiles.size === 17 && [...endpointFiles].every((source) => fs.existsSync(path.join(root, 'public', 'worlds', ...source.split('/')))));
  const phoneSources = [];
  for (const [name, contract] of Object.entries(phoneContract)) {
    const phone = manifest.tracks?.[name]?.phoneMaster;
    const expectedSource = `cake-studio/v17/clips/${contract.file}`;
    const expectedFrames = contract.beats * 136 + 14;
    check(`${name} phone master contract`, phone?.src === expectedSource
      && phone?.width === 854
      && phone?.height === 480
      && phone?.fps === 30
      && phone?.beatFrames === 136
      && phone?.frames === expectedFrames
      && Math.abs(phone?.duration - expectedFrames / 30) <= 0.001);
    if (phone?.src) phoneSources.push(phone.src);
  }
  check('manifest exposes two unique phone masters', phoneSources.length === 2 && new Set(phoneSources).size === 2);
  const desktopMediaReady = runtimeClips.length === 15 && runtimeClips.every((clip) => fs.existsSync(path.join(root, 'public', 'worlds', ...clip.src.split('/'))));
  const phoneMediaReady = phoneSources.length === 2 && phoneSources.every((source) => fs.existsSync(path.join(root, 'public', 'worlds', ...source.split('/'))));
  check('manifest readiness matches all seventeen runtime videos', manifest.ready === (desktopMediaReady && phoneMediaReady));
  for (const [name, track] of Object.entries(manifest.tracks || {})) {
    for (let index = 1; index < (track.clips || []).length; index += 1) {
      check(`${name} boundary ${index} shared`, track.clips[index - 1].last === track.clips[index].first);
    }
  }
}

const keyRoot = path.join(root, 'production', 'cake-studio-v17', 'wan-production', 'keyframes');
const introSeam = path.join(keyRoot, 'CST17-I10-exact-cst001-frame000.png');
const introTruth = path.join(root, 'public', 'worlds', 'cake-studio', 'bookends', 'cake-studio-intro-endpoint.png');
const outroSeam = path.join(keyRoot, 'CST17-O00-exact-cst050-frame149.png');
const outroTruth = path.join(root, 'public', 'worlds', 'cake-studio', 'bookends', 'cake-studio-outro-endpoint.png');
check('intro seam remains exact', hash(introSeam) === hash(introTruth));
check('outro seam remains exact', hash(outroSeam) === hash(outroTruth));

if (failures.length) {
  console.error(`CAKE_STUDIO_V17_SHELL_FAIL ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('CAKE_STUDIO_V17_SHELL_OK');
