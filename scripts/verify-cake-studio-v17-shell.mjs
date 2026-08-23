import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const page = read('public', 'worlds', 'cake-studio.html');
const css = read('public', 'worlds', 'cake-studio.css');
const reel = read('public', 'worlds', 'cake-studio.js');
const runtime = read('public', 'worlds', 'cake-studio-bookends.js');
const manifestPath = process.env.CAKE_STUDIO_V17_MANIFEST
  ? path.resolve(process.env.CAKE_STUDIO_V17_MANIFEST)
  : path.join(root, 'public', 'worlds', 'cake-studio', 'v17', 'manifest.json');
const clipsRoot = process.env.CAKE_STUDIO_V17_CLIPS_ROOT
  ? path.resolve(process.env.CAKE_STUDIO_V17_CLIPS_ROOT)
  : path.join(root, 'public', 'worlds', 'cake-studio', 'v17', 'clips');
const failures = [];
const sabotage = process.env.CAKE_STUDIO_V18_SABOTAGE === '1';

const expectedIds = {
  intro: Array.from({ length: 10 }, (_, index) => `I${String(index + 1).padStart(2, '0')}`),
  outro: Array.from({ length: 5 }, (_, index) => `O${String(index + 1).padStart(2, '0')}`),
};
const retiredAssets = {
  phoneMaster: [
    ['CST17-INTRO-PHONE-v172.mp4', '6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670'],
    ['CST17-OUTRO-PHONE-v172.mp4', '65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15'],
  ],
  phoneScrubAtlas: [
    ['CST17-INTRO-PHONE-SCRUB-v172.webp', '1e94474cee9abdd7e0af7ea7679d4b004cf5d3313287c06c358f4368e3c1f1c5'],
    ['CST17-OUTRO-PHONE-SCRUB-v172.webp', '5717337b6e0674f08f99a945fc4aa2dee69f2ab09380bdd04c2da6218a0b9c2c'],
  ],
  phoneTerminalStill: [
    ['CST17-INTRO-PHONE-TERMINAL-v172.webp', '513bcc97d522d84cb0ead674be5aa59b8b04d8cbb62527c1e63a4d9afe1fc4ee'],
    ['CST17-OUTRO-PHONE-TERMINAL-v172.webp', 'df40c40bbaf66b867bcdb4ffc95d095f1b7d5a97f7815498f2f122ee380037eb'],
  ],
};

function check(name, condition, evidence = '') {
  if (!condition) failures.push(`${name}${evidence ? `: ${evidence}` : ''}`);
}

function count(pattern, source) {
  return (source.match(pattern) || []).length;
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const active = page.replace(/<template[\s\S]*?<\/template>/g, '');
check('sabotage sentinel', !sabotage, sabotage ? 'forced verifier failure' : 'disabled');
check('v1.8 body version', /<body[^>]+data-version="1\.8\.0"/.test(page));
check('v1.8 visible version', />v1\.8\.0\s*·\s*WORLD 09</.test(page));
check('two active v1.8 bookends', count(/data-cake-bookend="(?:intro|outro)"/g, active) === 2);
check('one strict v1.8 manifest cache key per bookend',
  count(/data-bookend-manifest="cake-studio\/v17\/manifest\.json\?v=1\.8\.0-direct"/g, active) === 2);
check('three direct video slots per bookend',
  count(/<video[^>]+class="bookend-video"[^>]+data-bookend-video[^>]*>/g, active) === 6);
check('bookend videos are paused-seek transports',
  count(/<video[^>]+data-bookend-video[^>]+muted[^>]+playsinline[^>]+preload="auto"[^>]*>/g, active) === 6);
check('one poster per bookend', count(/data-bookend-poster/g, active) === 2);
check('direct runtime loaded after reel runtime',
  active.indexOf('cake-studio.js?v=13') >= 0
    && active.indexOf('cake-studio-bookends.js?v=1') > active.indexOf('cake-studio.js?v=13'));
check('old proxy DOM is physically absent',
  !/data-bookend-(?:canvas|phone-video)|data-phone-(?:scrub-atlas|terminal-landing)|bookend-phone-|bookend-canvas/.test(active));
check('old phone proxy preloads are physically absent',
  !/PHONE-(?:SCRUB|TERMINAL|v172\.mp4)/.test(active));
check('intro remains before reel and outro after reel',
  active.indexOf('data-cake-bookend="intro"') < active.indexOf('id="cake-reel"')
    && active.indexOf('data-cake-bookend="outro"') > active.indexOf('id="cake-reel"'));
check('fifty-shot reel remains exact',
  count(/data-clip="cake-studio\/clips\/CST-\d{3}\.mp4"/g, active) === 50);
check('retired appendix stays inert', count(/<template data-retired-(?:coda|credits)>/g, page) === 2);

check('bookend CSS cache is v13', /href="cake-studio\.css\?v=13"/.test(page));
check('reel JS cache remains v13', /src="cake-studio\.js\?v=13"/.test(page));
check('direct slots are the only painted motion surface',
  /\.bookend-video\s*\{[\s\S]*?object-fit:\s*contain/.test(css)
    && /\.bookend-video\s*\{[\s\S]*?visibility:\s*hidden/.test(css)
    && /sequence-painted\s+\.bookend-video\.on\s*\{[\s\S]*?opacity:\s*1[\s\S]*?visibility:\s*visible/.test(css)
    && /sequence-painted\s+\.bookend-poster\s*\{\s*opacity:\s*0/.test(css));
check('phone direct slots retain full-bleed cover',
  /@media\s*\(max-width:\s*700px\),\s*\(pointer:\s*coarse\)[\s\S]*?\.bookend-aperture\s*\{[^}]*width:\s*100dvw[^}]*height:\s*100dvh[\s\S]*?\.bookend-video\s*\{[^}]*object-fit:\s*cover/.test(css));
check('reduced motion hides direct videos and retains posters',
  /prefers-reduced-motion:\s*reduce[\s\S]*?\.bookend-video\s*\{\s*display:\s*none/.test(css));

check('page-local v1.8 runtime exists',
  /window\.__cakeStudioBookends\s*=\s*runtime/.test(runtime)
    && /version:\s*'1\.8\.0'/.test(runtime));
check('runtime requires schema v2 and exact version',
  /manifest\.schema\s*!==\s*'cake-studio-bookends\/v2'/.test(runtime)
    && /manifest\.version\s*!==\s*'1\.8\.0'/.test(runtime));
check('runtime is scroll-clocked and never calls play',
  /addEventListener\('scroll',\s*schedule/.test(runtime)
    && /slot\.video\.currentTime\s*=\s*target/.test(runtime)
    && !/\.play\s*\(/.test(runtime));
check('runtime owns two moving slots plus one pinned anchor',
  /videos\.length\s*!==\s*3/.test(runtime)
    && /unit\.anchorSlot\s*=\s*unit\.slots\[0\]/.test(runtime)
    && /candidate\s*!==\s*unit\.anchorSlot/.test(runtime)
    && /scene\.querySelectorAll\('\[data-bookend-video\]'\)/.test(runtime));
check('runtime uses reel-equivalent cached blob fetch',
  /fetch\(source,\s*\{\s*cache:\s*'force-cache'\s*\}\)/.test(runtime)
    && /blobCache\.set\(source,\s*request\)/.test(runtime)
    && /offset\s*<=\s*2/.test(runtime)
    && /URL\.createObjectURL\(blob\)/.test(runtime));
check('runtime has no active proxy machinery',
  !/phoneVelocity|phoneSettle|phoneAtlas|phoneLanding|drawPhone|requestVideoFrameCallback|drawImage\s*\(/.test(runtime));
check('runtime coalesces paused seeks to the newest hand position',
  /if \(slot\.seeking\)[\s\S]*?slot\.video\.currentTime\s*=\s*target/.test(runtime)
    && !/slot\.wanted\s*=\s*target/.test(runtime));
check('reel owner remains separate and orientation patch retained',
  /window\.__cakeStudioDirector/.test(reel) && /v1\.7\.2 orientation patch/.test(reel));

check('manifest exists', fs.existsSync(manifestPath), manifestPath);
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  check('manifest schema/version/ready',
    manifest.schema === 'cake-studio-bookends/v2'
      && manifest.version === '1.8.0' && manifest.ready === true);
  check('base media delivery is unchanged',
    manifest.width === 1280 && manifest.height === 720
      && manifest.fps === 30 && manifest.duration === 5
      && manifest.delivery?.codec === 'H.264'
      && manifest.delivery?.pixelFormat === 'yuv420p'
      && manifest.delivery?.silent === true
      && manifest.delivery?.keyframeInterval === 15
      && manifest.delivery?.faststart === true
      && JSON.stringify(manifest.delivery?.endpointConditioning) === JSON.stringify({
        openingConvergenceFrames: 9,
        closingConvergenceStartFrame: 126,
        closingConvergenceEndFrame: 135,
        exactFinalHoldFrames: 15,
      }));
  check('active scrub transport is exact',
    JSON.stringify(manifest.delivery?.scrubTransport) === JSON.stringify({
      engine: 'direct-video-anchor-three-slot',
      clock: 'scroll',
      slots: 3,
      preloadWindow: 1,
      blobWarmAhead: 2,
      seekCoalescing: 'last-write-wins',
      visibleProxy: 'none',
      profiles: ['desktop', 'phone-portrait', 'phone-landscape'],
    }));
  check('no retired transport remains active',
    !Object.hasOwn(manifest.delivery || {}, 'phoneMaster')
      && !Object.hasOwn(manifest.delivery || {}, 'phoneScrubAtlas')
      && !Object.hasOwn(manifest.delivery || {}, 'phoneTerminalStill')
      && Object.values(manifest.tracks || {}).every((track) => !Object.hasOwn(track, 'phoneMaster')));

  const allClips = [];
  const endpointFiles = new Set();
  for (const [trackName, ids] of Object.entries(expectedIds)) {
    const track = manifest.tracks?.[trackName];
    check(`${trackName} exact order`,
      track?.clips?.map((clip) => clip.id).join(',') === ids.join(','));
    for (const [index, clip] of (track?.clips || []).entries()) {
      check(`${clip.id} canonical clip path`,
        clip.src === `cake-studio/v17/clips/CST17-${clip.id}.mp4`);
      const file = path.join(clipsRoot, path.basename(clip.src));
      check(`${clip.id} media exists`, fs.existsSync(file), file);
      endpointFiles.add(clip.first);
      endpointFiles.add(clip.last);
      if (index) check(`${trackName} boundary ${index} is shared`,
        track.clips[index - 1].last === clip.first);
      allClips.push(clip);
    }
  }
  check('15 unique active sources and 17 endpoints',
    allClips.length === 15
      && new Set(allClips.map((clip) => clip.src)).size === 15
      && endpointFiles.size === 17);
  check('all 17 endpoint stills exist', [...endpointFiles].every((source) =>
    fs.existsSync(path.join(root, 'public', 'worlds', ...source.split('/')))));

  const ledger = manifest.retiredDelivery || {};
  check('retired ledger has exactly three inert families',
    Object.keys(ledger).sort().join(',')
      === Object.keys(retiredAssets).sort().join(','));
  for (const [family, assets] of Object.entries(retiredAssets)) {
    const record = ledger[family];
    check(`${family} is explicitly inert`,
      record?.status === 'inert' && record?.active === false
        && record?.since === '1.8.0' && typeof record?.reason === 'string'
        && record.reason.length > 20);
    check(`${family} ledger source/hash pairs are exact`,
      JSON.stringify(record?.assets || []) === JSON.stringify(assets.map(([file, digest]) => ({
        src: `cake-studio/v17/clips/${file}`,
        sha256: digest,
      }))));
    for (const [file, digest] of assets) {
      const assetPath = path.join(clipsRoot, file);
      check(`${file} retained byte-identical`,
        fs.existsSync(assetPath) && sha256(assetPath) === digest,
        fs.existsSync(assetPath) ? sha256(assetPath) : 'missing');
    }
  }
}

if (failures.length) {
  console.error(`CAKE_STUDIO_V18_SHELL_FAIL ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('CAKE_STUDIO_V18_SHELL_OK active_clips=15 direct_slots=6 anchor_slots=2 visible_proxies=0 retired_assets=6');
