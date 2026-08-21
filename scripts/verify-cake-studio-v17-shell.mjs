import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const page = read('public', 'worlds', 'cake-studio.html');
const css = read('public', 'worlds', 'cake-studio.css');
const js = read('public', 'worlds', 'cake-studio.js');
const manifestPath = process.env.CAKE_STUDIO_V17_MANIFEST
  ? path.resolve(process.env.CAKE_STUDIO_V17_MANIFEST)
  : path.join(root, 'public', 'worlds', 'cake-studio', 'v17', 'manifest.json');
const runtimeRoot = path.dirname(manifestPath);
const clipsRoot = process.env.CAKE_STUDIO_V17_CLIPS_ROOT
  ? path.resolve(process.env.CAKE_STUDIO_V17_CLIPS_ROOT)
  : path.join(runtimeRoot, 'clips');
const stillsRoot = path.join(runtimeRoot, 'stills');
const publicOwnerPack = path.join(root, 'public', 'worlds', 'assets', 'cake-studio-v17', 'wan-production');
const releaseVersion = '1.7.2';
const phoneContract = {
  intro: {
    file: 'CST17-INTRO-PHONE-v172.mp4',
    beats: 10,
    bytes: 5091536,
    sha256: '6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670',
    scrubAtlas: {
      file: 'CST17-INTRO-PHONE-SCRUB-v172.webp', bytes: 326692,
      sha256: '1e94474cee9abdd7e0af7ea7679d4b004cf5d3313287c06c358f4368e3c1f1c5',
      columns: 8, rows: 4,
      frames: [0, 22, 44, 66, 88, 110, 133, 155, 177, 199, 221, 243, 265, 287, 309, 331, 354, 376, 398, 420, 442, 464, 486, 508, 530, 552, 575, 597, 619, 641, 663, 685],
    },
    terminalStill: {
      file: 'CST17-INTRO-PHONE-TERMINAL-v172.webp', bytes: 106416,
      sha256: '513bcc97d522d84cb0ead674be5aa59b8b04d8cbb62527c1e63a4d9afe1fc4ee', frame: 685,
    },
  },
  outro: {
    file: 'CST17-OUTRO-PHONE-v172.mp4',
    beats: 5,
    bytes: 2479879,
    sha256: '65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15',
    scrubAtlas: {
      file: 'CST17-OUTRO-PHONE-SCRUB-v172.webp', bytes: 179822,
      sha256: '5717337b6e0674f08f99a945fc4aa2dee69f2ab09380bdd04c2da6218a0b9c2c',
      columns: 8, rows: 2,
      frames: [0, 23, 46, 69, 92, 115, 138, 161, 184, 207, 230, 253, 276, 299, 322, 345],
    },
    terminalStill: {
      file: 'CST17-OUTRO-PHONE-TERMINAL-v172.webp', bytes: 91242,
      sha256: 'df40c40bbaf66b867bcdb4ffc95d095f1b7d5a97f7815498f2f122ee380037eb', frame: 345,
    },
  },
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
check('v1.7.2 body version', /<body[^>]+data-version="1\.7\.2"/.test(page));
check('v1.7.2 visible version', />v1\.7\.2\s*·\s*WORLD 09</.test(page));
check('two active v1.7 sequences', count(/data-cake-bookend="(?:intro|outro)"/g, active) === 2);
check('two canonical v1.7.2 phone manifests', count(/data-bookend-manifest="cake-studio\/v17\/manifest\.json\?v=1\.7\.2-phone-final"/g, active) === 2);
check('two inert phone video transports', count(/<video[^>]+data-bookend-phone-video[^>]+preload="none"[^>]*>/g, active) === 2);
check('one phone-only intro atlas preload', count(/<link[^>]+rel="preload"[^>]+CST17-INTRO-PHONE-SCRUB-v172\.webp[^>]*>/g, active) === 1
  && /CST17-INTRO-PHONE-SCRUB-v172\.webp[^>]+prefers-reduced-motion:\s*no-preference/.test(active));
check('one phone-only intro terminal preload', count(/<link[^>]+rel="preload"[^>]+CST17-INTRO-PHONE-TERMINAL-v172\.webp[^>]*>/g, active) === 1
  && /CST17-INTRO-PHONE-TERMINAL-v172\.webp[^>]+prefers-reduced-motion:\s*no-preference/.test(active));
check('two scrub surfaces and terminal landings', count(/data-phone-scrub-atlas/g, active) === 2
  && count(/data-phone-terminal-landing/g, active) === 2);
const cssCache = page.match(/href="cake-studio\.css\?v=([^"]+)"/);
const jsCache = page.match(/src="cake-studio\.js\?v=([^"]+)"/);
check('page CSS and JS cache refs match v12', Boolean(cssCache && jsCache && cssCache[1] === '12' && jsCache[1] === '12'), `${cssCache?.[1] || 'missing'}/${jsCache?.[1] || 'missing'}`);
check('old v1.7.1 release refs removed', !/1\.7\.1/.test(active));
check('old single-plate bookends removed', !/data-bookend="(?:intro|outro)"[^>]+data-plate=/.test(active));
check('old always-motion override removed', !/data-plate-motion="always"/.test(active));
check('intro remains before reel', active.indexOf('data-cake-bookend="intro"') < active.indexOf('id="cake-reel"'));
check('outro remains after reel', active.indexOf('data-cake-bookend="outro"') > active.indexOf('id="cake-reel"'));
check('minimal bilingual copy remains', count(/class="bookend-copy/g, active) === 2 && count(/class="L en"/g, active) > 2 && count(/class="L ar"/g, active) > 2);
check('retired appendix stays inert', count(/<template data-retired-(?:coda|credits)>/g, page) === 2);

check('v1.7 contained stage CSS', /\.bookend-aperture[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/.test(css));
check('bookend media uses contain', /\.bookend-(?:poster|canvas)[^{]*\{[^}]*object-fit:\s*contain/s.test(css));
check('phone full-bleed cover is coarse-pointer scoped', /@media\s*\(max-width:\s*700px\),\s*\(pointer:\s*coarse\)[\s\S]*?\.bookend-aperture\s*\{[^}]*width:\s*100dvw[^}]*height:\s*100dvh[^}]*aspect-ratio:\s*auto[\s\S]*?\.bookend-poster,[\s\S]*?object-fit:\s*cover/s.test(css));
check('opening earns ten-shot scroll span', /\.bookend-intro\s*\{[^}]*height:\s*8[0-9]{2}vh/s.test(css));
check('ending earns five-shot scroll span', /\.bookend-outro\s*\{[^}]*height:\s*4[0-9]{2}vh/s.test(css));
check('coarse landscape receives phone aperture', /@media\s*\(max-width:\s*700px\),\s*\(pointer:\s*coarse\)/.test(css));
check('reduced-motion CSS path', /prefers-reduced-motion:\s*reduce[\s\S]*?\.bookend-copy/s.test(css));
check('phone scrub and terminal surfaces are layered without transitions', /\.bookend-phone-scrub-atlas\s*\{[^}]*z-index:\s*3[^}]*opacity:\s*0/s.test(css)
  && /\.bookend-phone-terminal-landing\s*\{[^}]*z-index:\s*4[^}]*opacity:\s*0/s.test(css)
  && /sequence-scrub-preview[^}]*bookend-phone-scrub-atlas[^}]*opacity:\s*1/s.test(css)
  && /sequence-terminal-landing[^}]*bookend-phone-terminal-landing[^}]*opacity:\s*1/s.test(css));

check('page-local sequence runtime exists', /window\.__cakeStudioBookends/.test(js));
check('sequence runtime never calls play', !/\.play\s*\(/.test(js));
check('sequence runtime reads manifest', /bookendManifest/.test(js) && /fetch\s*\(/.test(js));
check('sequence runtime paints decoded frames', /requestVideoFrameCallback/.test(js) && /drawImage\s*\(/.test(js));
check('sequence runtime exposes still mode', /prefers-reduced-motion/.test(js) && /sequenceMode/.test(js));
check('desktop sequence runtime retains two slots', /unit\.phoneMode\s*\?\s*\[\]\s*:\s*Array\.from\(\{\s*length:\s*2\s*\}/.test(js));
check('phone runtime is v1.7.2 manifest-driven', /version:\s*'1\.7\.2'/.test(js) && /manifest\.version\s*!==\s*'1\.7\.2'/.test(js));
check('phone runtime selects coarse or narrow screens', /max-width:\s*700px/.test(js) && /pointer:\s*coarse/.test(js));
check('phone runtime clamps EOF to the second-to-last keyed hold', /phoneDelivery\?\.terminalFrameOffset\s*!==\s*2/.test(js)
  && /const terminalTime\s*=\s*duration\s*-\s*unit\.phoneMaster\.terminalFrameOffset\s*\/\s*unit\.phoneMaster\.fps/.test(js)
  && /unit\.phoneMaster\.duration\s*-\s*unit\.phoneMaster\.terminalFrameOffset\s*\/\s*unit\.phoneMaster\.fps/.test(js));
check('phone runtime keeps one persistent staged transport', /armPhoneMaster/.test(js)
  && /slot\.video\.preload\s*=\s*unit\.trackName\s*===\s*'intro'\s*\?\s*'auto'\s*:\s*'metadata'/.test(js)
  && /unit\.phoneMaster\.src/.test(js));
check('phone runtime uses decoded atlas only for high velocity', /const phoneVelocityThreshold\s*=\s*10/.test(js)
  && /const phoneVelocityHoldMs\s*=\s*180/.test(js)
  && /const phoneSettleMs\s*=\s*180/.test(js)
  && /if\s*\(highVelocity\)\s*\{[\s\S]*?phoneSlot\.wanted\s*=\s*-1[\s\S]*?drawPhoneAtlas\(unit,\s*unit\.phoneTarget\)/.test(js)
  && /if\s*\(!unit\.scene\.classList\.contains\('sequence-painted'\)[\s\S]*?drawPhoneAtlas\(unit,\s*unit\.phoneTarget\)/.test(js));
check('phone runtime keeps preview until one exact settle', /if\s*\(\(unit\.phoneAtlasVisible\s*\|\|\s*unit\.phoneLandingVisible\)\s*&&\s*!mayReplacePreview\)\s*return/.test(js)
  && /queuePhoneSeek\(unit,\s*unit\.phoneTarget,\s*true\)/.test(js));
check('phone runtime terminal landing avoids terminal seek', /if\s*\(progress\s*>=\s*\.999\s*\|\|\s*terminalHold\)\s*\{[\s\S]*?terminal-landing[\s\S]*?return;/.test(js)
  && /showPhoneLanding\(unit,\s*terminalTarget\)/.test(js));
check('phone atlases stay disabled for reduced motion', /loadPhoneAtlas\s*=\s*\(unit\)\s*=>\s*\{[\s\S]*?reducedMotion\.matches/.test(js)
  && /loadPhoneLanding\s*=\s*\(unit\)\s*=>\s*\{[\s\S]*?reducedMotion\.matches/.test(js));
check('phone runtime warms distant outro into a blob transport', /const warmPhoneMaster\s*=\s*\(unit\)\s*=>/.test(js)
  && /!unit\?\.phoneMode\s*\|\|\s*reducedMotion\.matches/.test(js)
  && /fetch\(unit\.phoneMaster\.src,\s*\{[\s\S]*?cache:\s*'force-cache'/.test(js)
  && /response\.blob\(\)/.test(js)
  && /unit\.phoneBlobUrl\s*=\s*URL\.createObjectURL\(blob\)/.test(js)
  && /activatePhoneBlob\(unit,\s*unit\.phoneBlobUrl\)/.test(js)
  && /const warmOutro\s*=\s*\(\)\s*=>\s*\{[\s\S]*?setTimeout\([\s\S]*?if\s*\(outro\s*&&\s*!outro\.live\)\s*warmPhoneMaster\(outro\);[\s\S]*?phoneSettleMs\)/.test(js)
  && (/intro\?\.scene\.addEventListener\('scene:idle',\s*warmOutro,\s*\{\s*once:\s*true\s*\}\)/.test(js)
    || /intro\?\.scene\.addEventListener\('scene:idle',\s*\(\)\s*=>\s*\{[\s\S]*?warmOutro\(\);[\s\S]*?\},\s*\{\s*once:\s*true\s*\}\)/.test(js))
  && /intro\?\.scene\.addEventListener\('scene:idle',\s*\(\)\s*=>\s*(?:\{[\s\S]*?)?loadPhoneAtlas\(outro\)/.test(js)
  && /outro\?\.scene\.addEventListener\('scene:live',\s*cancelLiveOutroWarm\)/.test(js)
  && /outro\?\.warmState\s*===\s*'loading'[\s\S]*?outro\.warmAbort\?\.abort\(\)/.test(js)
  && /error\?\.name\s*===\s*'AbortError'[\s\S]*?unit\.warmState\s*=\s*'idle'/.test(js)
  && !/outro\?\.scene\.addEventListener\('scene:live',\s*warmOutro/.test(js));
check('phone runtime primes only the opening bookend', /const openingUnit\s*=\s*runtime\.units\.find\(\(unit\)\s*=>\s*unit\.live\)\s*\|\|\s*intro/.test(js)
  && /armPhoneMaster\(openingUnit\)/.test(js)
  && /queuePhoneSeek\(openingUnit,\s*openingUnit\.phoneTarget,\s*true\)/.test(js)
  && !/for\s*\(const unit of runtime\.units\)\s*\{\s*armPhoneMaster\(unit\);\s*queuePhoneSeek\(unit,\s*unit\.phoneTarget,\s*true\);\s*\}/.test(js));

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
    && manifest.delivery?.phoneMaster?.width === 640
    && manifest.delivery?.phoneMaster?.height === 360
    && manifest.delivery?.phoneMaster?.fps === 15
    && manifest.delivery?.phoneMaster?.beatFrames === 68
    && manifest.delivery?.phoneMaster?.finalTailExtraFrames === 7
    && manifest.delivery?.phoneMaster?.keyframeInterval === 8
    && manifest.delivery?.phoneMaster?.terminalFrameOffset === 2
    && manifest.delivery?.phoneMaster?.silent === true
    && manifest.delivery?.phoneMaster?.faststart === true);
  check('manifest phone scrub atlas delivery contract', manifest.delivery?.phoneScrubAtlas?.mimeType === 'image/webp'
    && manifest.delivery?.phoneScrubAtlas?.tileWidth === 384
    && manifest.delivery?.phoneScrubAtlas?.tileHeight === 216
    && manifest.delivery?.phoneScrubAtlas?.quality === 85);
  check('manifest phone terminal still delivery contract', manifest.delivery?.phoneTerminalStill?.mimeType === 'image/webp'
    && manifest.delivery?.phoneTerminalStill?.width === 640
    && manifest.delivery?.phoneTerminalStill?.height === 360
    && manifest.delivery?.phoneTerminalStill?.quality === 100);
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
    const expectedFrames = contract.beats * 68 + 7;
    check(`${name} phone master contract`, phone?.src === expectedSource
      && phone?.width === 640
      && phone?.height === 360
      && phone?.fps === 15
      && phone?.beatFrames === 68
      && phone?.finalTailExtraFrames === 7
      && phone?.keyframeInterval === 8
      && phone?.terminalFrameOffset === 2
      && phone?.frames === expectedFrames
      && Math.abs(phone?.duration - expectedFrames / 15) <= 0.001);
    const atlas = phone?.scrubAtlas;
    const expectedAtlasSource = `cake-studio/v17/clips/${contract.scrubAtlas.file}`;
    check(`${name} phone scrub atlas contract`, atlas?.src === expectedAtlasSource
      && atlas?.bytes === contract.scrubAtlas.bytes
      && atlas?.sha256 === contract.scrubAtlas.sha256
      && atlas?.width === contract.scrubAtlas.columns * 384
      && atlas?.height === contract.scrubAtlas.rows * 216
      && atlas?.tileWidth === 384
      && atlas?.tileHeight === 216
      && atlas?.quality === 85
      && atlas?.columns === contract.scrubAtlas.columns
      && atlas?.rows === contract.scrubAtlas.rows
      && atlas?.samples === contract.scrubAtlas.frames.length
      && JSON.stringify(atlas?.frames) === JSON.stringify(contract.scrubAtlas.frames));
    const terminal = phone?.terminalStill;
    const expectedTerminalSource = `cake-studio/v17/clips/${contract.terminalStill.file}`;
    check(`${name} phone terminal still contract`, terminal?.src === expectedTerminalSource
      && terminal?.bytes === contract.terminalStill.bytes
      && terminal?.sha256 === contract.terminalStill.sha256
      && terminal?.width === 640
      && terminal?.height === 360
      && terminal?.quality === 100
      && terminal?.frame === contract.terminalStill.frame
      && Math.abs(terminal?.time - contract.terminalStill.frame / 15) <= 0.001);
    const phonePath = path.join(clipsRoot, contract.file);
    check(`${name} phone master exists`, fs.existsSync(phonePath));
    if (fs.existsSync(phonePath)) {
      check(`${name} phone master byte size`, fs.statSync(phonePath).size === contract.bytes, `${fs.statSync(phonePath).size}/${contract.bytes}`);
      check(`${name} phone master SHA-256`, hash(phonePath) === contract.sha256);
    }
    for (const [kind, asset, source] of [
      ['scrub atlas', contract.scrubAtlas, atlas?.src],
      ['terminal still', contract.terminalStill, terminal?.src],
    ]) {
      const assetPath = path.join(clipsRoot, asset.file);
      check(`${name} phone ${kind} exists`, fs.existsSync(assetPath));
      if (fs.existsSync(assetPath)) {
        check(`${name} phone ${kind} byte size`, fs.statSync(assetPath).size === asset.bytes, `${fs.statSync(assetPath).size}/${asset.bytes}`);
        check(`${name} phone ${kind} SHA-256`, hash(assetPath) === asset.sha256);
      }
      if (source) phoneSources.push(source);
    }
    if (phone?.src) phoneSources.push(phone.src);
  }
  check('manifest exposes six unique phone delivery assets', phoneSources.length === 6 && new Set(phoneSources).size === 6);
  const desktopMediaReady = runtimeClips.length === 15 && runtimeClips.every((clip) => fs.existsSync(path.join(root, 'public', 'worlds', ...clip.src.split('/'))));
  const phoneMediaReady = phoneSources.length === 6 && phoneSources.every((source) => fs.existsSync(path.join(clipsRoot, path.basename(source))));
  check('manifest readiness matches all twenty-one runtime media assets', manifest.ready === (desktopMediaReady && phoneMediaReady));
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
