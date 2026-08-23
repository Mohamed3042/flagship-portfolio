#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const stringsDir = path.resolve(process.argv[2] || path.join(toolDir, '..'));
const packDir = path.join(stringsDir, 'wan-production');
const plan = JSON.parse(fs.readFileSync(path.join(stringsDir, 'prompts', 'keyframe-plan.json'), 'utf8'));
const frameById = new Map(plan.frames.map((frame) => [frame.id, frame]));

const globalNegative = [
  'blur',
  'soft focus',
  'watermark',
  'captions',
  'subtitles',
  'readable text',
  'letters',
  'numbers',
  'UI',
  'labels',
  'logos',
  'extra fingers',
  'deformed hands',
  'extra limbs',
  'duplicate puppet',
  'morphing anatomy',
  'melted objects',
  'flicker',
  'unintended cut',
  'jump cut',
  'camera shake',
  'surprise camera move',
  'generated letterbox bars',
  'cropped central action',
  'horror',
  'gore',
  'violence',
  'children'
].join(', ');

const seedByFamily = {
  workshop: 271101,
  'threshold-road': 271102,
  'marble-hall': 271103,
  'sky-islands': 271104,
  'low-poly-jungle': 271105,
  'artillery-hill': 271106
};

const motionOverrides = {
  KF01: 'Grey strings lift one darker borrowed marionette from the opening plain crate and settle it on the central test frame, with its mismatched joints and defiant wall shadow readable. Camera rises slowly by forty centimetres with the pull.',
  KF02: "The aged-brass control bar rotates once, crossing the grey strings into one compact impossible knot while the puppet's arm moves against the pull. Camera drifts slowly thirty centimetres left across the weave.",
  KF03: 'The borrowed puppet snaps into one rigid arms-out T-pose as every grey string drops fully slack and adult hands keep the bar steady. Camera pushes forward slowly twenty centimetres.',
  KF04: 'A matte grey tide climbs steadily from the borrowed puppet’s feet to just below its head, draining the warm wood colour while the lamp stabilizes. Camera stays locked in the centred craft close-up.',
  KF05: 'The puppet is lowered face-down as its flat painted iris remains without any reflection while surrounding varnish highlights slide once. Camera pushes forward slowly sixty centimetres to the single eye.',
  KF06: 'One adult hand slides the shallow repair drawer fully open, revealing separated broken limbs, grey spools and mismatched hands in impossible forced-perspective depth. Camera tilts down slowly thirty-five degrees into the drawer.',
  KF07: 'Two adult hands sweep the bench clear in one broad pass, close the shallow drawer within the same motion and leave one clean pale-limewood block centred under the lamp. Camera pulls back slowly seventy centimetres to a symmetrical view.',
  KF08: "One fine carving knife makes a single controlled cut through the pale-limewood block, releasing one long curl as the hero's rough face begins to emerge. Camera pushes forward slowly fifty centimetres to the blade.",
  KF09: 'Brass calipers pivot from the anonymous portrait silhouette to the newly carved profile until their shadow tips align with both cheeks. Camera tracks slowly forty centimetres right between photograph and carving.',
  KF10: 'An adult thumb smooths one warm translucent skin leaf outward across the carved face until it dissolves into the wood and leaves the neck bare. Camera pushes forward slowly twenty centimetres along the thumb stroke.',
  KF11: 'Two physically lit skin swatches slide together beneath the lamp until their dividing line disappears into one continuous measured tone. Camera stays locked directly above the centred swatches.',
  KF12: 'One narrow brush of warm light travels completely around the articulated neck ring, erasing the material seam while its thin shadow lifts one beat later. Camera orbits slowly eight degrees clockwise around the neck.',
  KF13: "Two warm hazel glass eyes seat into the hero's face in one precise motion and receive the same tungsten highlight. Camera pushes forward slowly thirty centimetres to eye level.",
  KF14: 'Adult hands draw one fine comb once across the straight dark-chestnut hair, laying deliberate strand groups whose thin shadows settle behind it. Camera arcs slowly ten degrees over the crown.',
  KF15: 'Adult scissors open once beneath the wordless garment photograph, releasing one practical linen panel that pours down onto the bench while the image empties. Camera tilts down slowly forty degrees from the wall to the fabric.',
  KF16: 'Adult hands fit and pin the linen-and-brass outfit onto the articulated hero in one continuous dressing motion, ending with her upright on the stand. Camera tracks slowly fifty centimetres right so the correct mirror back remains visible.',
  KF17: 'One wardrobe rail carrying exactly eight fully separated empty outfits glides behind the dressed hero and stops, each shadow showing her wearing it. Camera tracks slowly one metre left along the rail.',
  KF18: "Exactly five warm light strings descend together and attach cleanly at both wrists, both knees and the hero's head, then settle like real thread. Camera cranes down slowly sixty centimetres with them.",
  KF19: "Adult hands tilt the aged-brass control bar once, raising the hero's right arm precisely while her wall shadow mirrors it at the same instant. Camera pushes forward slowly thirty centimetres while holding both hero and shadow.",
  KF20: "The hero's pale-limewood chest completes one subtle slow breath, flexing the grain and sending dust motes into one brief ring before they disperse. Camera pushes forward slowly forty centimetres to the chest.",
  KF21: 'Adult hands close one pair of aged-brass scissors through all five luminous strings in one clean stroke, sending every severed strand upward into warm sparks. Camera pushes forward slowly forty centimetres through the rising sparks.',
  KF22: 'The fully unstrung hero takes one confident step off the stand onto the scarred bench and settles balanced on both feet. Camera tracks slowly sixty centimetres beside her at bench level.',
  KF23: 'The scarred bench grain stretches continuously into a long road beneath the walking hero while the workshop recedes and four distant glows remain ahead. Camera pulls back slowly two metres into a centred follow view.',
  KF24: 'Exactly four distinct doorframes resolve from the four distant glows along the bench-road, their four light pools joining into one continuous gradient. Camera tracks slowly three metres left past all four doors.',
  KF25: 'The hero walks through the first door into the pale-marble hall and settles under harsh daylight as her polished-floor reflection briefly takes the portrait silhouette. Camera orbits slowly twelve degrees around her.',
  KF26: 'One hard daylight sweep travels almost 180 degrees across the hero, leaving skin finish, hair strands, linen weave and brass joints unchanged. Camera pushes forward slowly eighty centimetres into the honest macro view.',
  KF27: 'The same hero crosses the second doorframe into the emerald-teal sky-island arena, restyling slightly toward refined toon shading exactly at the threshold and landing on one platform. Camera follows forward slowly two metres through the doorway.',
  KF28: 'The toon-restyled hero makes one clean leap between two emerald-teal islands as her obedient shadow reaches the landing half a beat early. Camera tracks smoothly two metres alongside her at matching speed.',
  KF29: 'The same hero crosses the third doorway into the warm low-poly jungle and becomes cleanly faceted at the threshold, then settles between parted polygon palms. Camera pushes forward slowly one and a half metres along the dirt path.',
  KF30: "A single style seam moves across the hero's face until one aligned face is split exactly down the nose between painterly realism and warm facets. Camera pushes forward slowly seventy centimetres into the symmetrical close-up.",
  KF31: 'The hero crosses the fourth amber threshold in one steady step as the facial style seam completes, then settles on the dusk hill looking upward. Camera rises slowly one metre from her face to the tracer-lit sky.',
  KF32: 'The hero turns once and walks back toward the workshop as exactly four distinct styled shadows stretch ahead of her under all four door colours. Camera retreats smoothly two metres in front of her.',
  KF33: 'Adult hands place the newest hero among the finished workshop figures, ending with every figure and its distinct shadow stable on the deep shelf. Camera tracks slowly one and a half metres right along the shelf.',
  KF34: "Adult hands lower the borrowed puppet's old grey strings into one tidy coil beside the open empty crate, its cast shadow straightening into one line. Camera tilts down slowly thirty degrees to an overhead close view.",
  KF35: 'The thick wordless ledger opens itself and one blank parchment page turns into view as abstract impressions appear just before their unseen press. Camera tracks slowly forty centimetres down the page.',
  KF36: 'One ruled page turns itself to a completely blank entry beside the fresh pale-limewood block whose grain suggests a different adult profile. Camera pulls back slowly thirty centimetres to frame both subjects.',
  KF37: 'Exactly four small lanterns brighten above the bench in cold white, emerald-teal, warm gold and dusk amber, each isolating its associated shelf figures. Camera cranes upward slowly three metres into the full workshop view.',
  KF38: 'Adult hands pack the finished handcrafted figures upright into the plain open crate in one careful loading motion, leaving their standing silhouettes in its shadow. Camera descends slowly two metres toward the crate.',
  KF39: 'The plain crate lid lowers toward closed in the deep background while focus settles on the newest unstrung hero seated calmly beside the lamp. Camera pushes forward slowly one metre to the seated hero.',
  KF40: 'The seated hero turns her head once toward the viewer as the tungsten lamp dims; her warm eye-gleam holds while she recedes into darkness and the plain crate becomes the centred silhouette. Camera pulls back slowly one and a half metres to the KF01 composition.'
};

function sentence(value) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function humanize(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function frameFilename(frame) {
  return `CTS-${frame.id}-${frame.slug}.png`;
}

function sceneFamily(frame) {
  const number = Number(frame.id.slice(2));
  if (number <= 23 || number >= 34) return 'workshop';
  if (number === 24 || number === 25 || number === 33) return 'threshold-road';
  if (number <= 27) return 'marble-hall';
  if (number <= 29) return 'sky-islands';
  if (number <= 31) return 'low-poly-jungle';
  return 'artillery-hill';
}

function buildPrompt(frame) {
  const motion = motionOverrides[frame.id];
  if (!motion) throw new Error(`Missing motion contract for ${frame.id}`);
  return [
    'Generate single shot.',
    sentence(motion),
    'The action settles by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly.',
    '@Image1 is the immutable scene geometry and art-direction.',
    'One continuous take, no cuts, no camera shake, no subjects beyond the two supplied endpoint images, and no readable text or logos.',
    sentence(plan.styleLock),
    'No dialogue. No background music.'
  ].join(' ').replace(/\.\./g, '.');
}

const clips = plan.frames.map((current, index) => {
  const next = index === plan.frames.length - 1 ? frameById.get('KF01') : plan.frames[index + 1];
  const number = String(index + 1).padStart(3, '0');
  const family = sceneFamily(current);
  return {
    clip: `CTS-A-${number}`,
    number,
    act: current.act,
    title: `${humanize(current.slug)} -> ${humanize(next.slug)}`,
    storyboard: `${current.id} -> ${next.id}`,
    generationFirst: `../keyframes/${frameFilename(current)}`,
    generationLast: `../keyframes/${frameFilename(next)}`,
    acceptedFilename: `accepted/CTS-A-${number}.mp4`,
    rejectedPattern: `rejected/CTS-A-${number}-attempt-##.mp4`,
    sceneFamily: family,
    seed: seedByFamily[family],
    flf: true,
    targetId: next.id,
    action: motionOverrides[current.id],
    camera: current.camera,
    prompt: buildPrompt(current)
  };
});

const data = {
  schema: 'cut-the-strings-wan-owner-pack/v1',
  status: 'owner-generation-pending',
  approvedByOwner: {
    phrase: 'APPROVE STILLS',
    date: '2026-08-21'
  },
  approvedStillsCommit: '1de7001c73e9cebf4416a0cde1e0099b724dd83b',
  ownerGenerationOnly: true,
  jobsSubmitted: 0,
  creditsSpent: 0,
  model: 'WAN 2.7 image-to-video',
  settings: {
    resolution: '720P / 1280x720 / 16:9',
    durationSeconds: 5,
    audio: false,
    promptExtension: false,
    outputsPerAttempt: 1,
    baseCreditsPerClip: 10,
    baseCreditsTotal: 400,
    plannedRetakeMultiplier: 1.5,
    plannedCreditsTotal: 600,
    stopAndReportAboveCredits: 660
  },
  styleLock: plan.styleLock,
  negativePrompt: globalNegative,
  clips
};

for (const dir of ['accepted', 'raw', 'rejected', 'wan-prompts']) {
  fs.mkdirSync(path.join(packDir, dir), { recursive: true });
}

for (const dir of ['accepted', 'raw', 'rejected']) {
  const keep = path.join(packDir, dir, '.gitkeep');
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
}

for (const clip of clips) {
  fs.writeFileSync(path.join(packDir, 'wan-prompts', `${clip.clip}.txt`), `${clip.prompt}\n`, 'utf8');
}

fs.writeFileSync(path.join(packDir, 'clips.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(packDir, 'negative-prompt.txt'), `${globalNegative}\n`, 'utf8');

const csvRows = [
  ['clip', 'attempt', 'provider_task_id', 'scene_family', 'seed', 'status', 'credits', 'saved_file', 'notes'],
  ...clips.map((clip) => [clip.clip, '01', '', clip.sceneFamily, String(clip.seed), 'pending', '0', '', ''])
];
fs.writeFileSync(
  path.join(packDir, 'run-log.csv'),
  `${csvRows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')}\n`,
  'utf8'
);

function mappingTable() {
  return [
    '| Clip | Pair | First frame | Last frame | Output | Seed |',
    '|---|---|---|---|---|---:|',
    ...clips.map((clip) => `| ${clip.clip} | ${clip.storyboard} | \`${clip.generationFirst}\` | \`${clip.generationLast}\` | \`${clip.acceptedFilename}\` | ${clip.seed} |`)
  ].join('\n');
}

const readme = `# CUT THE STRINGS — owner WAN generation pack

Status: **OWNER GENERATION PENDING**

Open \`WAN-GENERATION-BOARD.html\` in a browser. It is an offline reference board and contains no WAN API client, submit action, network request, or payment action.

- Approved owner phrase: \`APPROVE STILLS\` on 2026-08-21
- Approved stills: 41 exact 1920x1088 PNGs
- Clip cards: 40 first+last-frame pairs
- Model: WAN 2.7 image-to-video
- Locked settings: 720P, 5 seconds, 16:9, audio off, prompt extension off, one output
- Base bill: 40 x 10 = 400 credits
- Planned bill at 1.5x: 600 credits
- Board checkpoint: 0 submitted jobs, 0 spent credits, 0 returned videos

Mohamed generates every clip himself in the WAN UI. Returned videos are not accepted by ticking the board alone; they must later pass decoded endpoint and mid-clip contact-sheet review.
`;

const runbook = `# CUT THE STRINGS — WAN 2.7 owner runbook

## Locked procedure

1. Open \`WAN-GENERATION-BOARD.html\`.
2. In WAN 2.7 First & Last Frame mode, upload the card's FIRST still and LAST still.
3. Lock 720P / 1280x720 / 16:9, 5 seconds, audio off, prompt extension off, one output, and the listed seed.
4. Copy the shared negative prompt and the card's exact prompt without rewriting either.
5. Generate one output. Download an accepted candidate immediately using the exact card filename.
6. Record the provider task ID, real credits and status in \`run-log.csv\`; tick Done only after the file is saved.
7. Change only one variable per retake. Stop and report before projected spend exceeds 660 credits.

The board never submits jobs. Done means owner-generated and locally saved, not editorially accepted.

## Mapping

${mappingTable()}
`;

const source = `# Source lock

- Approved keyframe commit: \`1de7001c73e9cebf4416a0cde1e0099b724dd83b\`
- Keyframe plan: \`../prompts/keyframe-plan.json\`
- Keyframe QA: \`../review/keyframe-qa.json\`
- Owner approval phrase: \`APPROVE STILLS\`
- Approval date: 2026-08-21
- WAN jobs submitted at board creation: 0
- WAN credits spent at board creation: 0
`;

fs.writeFileSync(path.join(packDir, 'README-FIRST.md'), readme, 'utf8');
fs.writeFileSync(path.join(packDir, 'RUNBOOK.md'), runbook, 'utf8');
fs.writeFileSync(path.join(packDir, 'SOURCE.md'), source, 'utf8');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function card(clip, index) {
  return `<article class="clip-card" id="${clip.clip}" data-clip="${clip.clip}" data-act="${clip.act}">
    <div class="card-head">
      <div>
        <div class="eyebrow">Clip ${clip.number} · Act ${clip.act} · ${escapeHtml(clip.storyboard)}</div>
        <h2>${escapeHtml(clip.title)}</h2>
      </div>
      <label class="done"><input type="checkbox" data-state="done"> Done</label>
    </div>
    <div class="frames">
      <figure>
        <div class="frame-label">FIRST FRAME</div>
        <img src="${escapeHtml(clip.generationFirst)}" alt="${clip.clip} approved first frame" ${index === 0 ? 'loading="eager"' : 'loading="lazy"'} decoding="async">
        <figcaption>${escapeHtml(clip.generationFirst)}</figcaption>
      </figure>
      <div class="arrow" aria-hidden="true">→</div>
      <figure>
        <div class="frame-label">LAST FRAME</div>
        <img src="${escapeHtml(clip.generationLast)}" alt="${clip.clip} approved last frame" ${index === 0 ? 'loading="eager"' : 'loading="lazy"'} decoding="async">
        <figcaption>${escapeHtml(clip.generationLast)}</figcaption>
      </figure>
    </div>
    <div class="facts">
      <div><span>OUTPUT FILENAME</span><code>${escapeHtml(clip.acceptedFilename)}</code></div>
      <div><span>SCENE FAMILY</span><code>${escapeHtml(clip.sceneFamily)}</code></div>
      <div><span>FIXED SEED</span><code>${clip.seed}</code></div>
      <div><span>MODE</span><code>First + Last</code></div>
    </div>
    <div class="prompt-head">
      <label for="prompt-${clip.number}">EXACT WAN PROMPT</label>
      <button type="button" data-copy="prompt-${clip.number}">Copy prompt</button>
    </div>
    <textarea class="prompt" id="prompt-${clip.number}" readonly>${escapeHtml(clip.prompt)}</textarea>
    <a class="top-link" href="#top">Back to top ↑</a>
  </article>`;
}

const inlineData = JSON.stringify(data).replaceAll('<', '\\u003c');
const board = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>CUT THE STRINGS · Owner WAN 2.7 Board</title>
  <style>
    :root{color-scheme:dark;--ink:#110c08;--panel:#1b120d;--panel2:#25170f;--line:#5d412c;--paper:#f0d7ad;--muted:#b89d79;--amber:#f2ad49;--brass:#d6a45d;--green:#73c6a0;--red:#e57f6d}
    *{box-sizing:border-box}
    html{scroll-behavior:smooth;background:var(--ink)}
    body{margin:0;color:var(--paper);font:15px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:radial-gradient(circle at 50% 0,#3a2415 0,transparent 34rem),linear-gradient(180deg,#160e09,#0b0806 60%);min-height:100vh}
    button,select,textarea,input{font:inherit}
    button,select{border:1px solid var(--line);border-radius:10px;background:#21150e;color:var(--paper);padding:10px 13px}
    button{cursor:pointer}
    button:hover,button:focus-visible,select:focus-visible{border-color:var(--amber);outline:none}
    button.active,button.copied{border-color:var(--green);color:var(--green)}
    .shell{width:min(1460px,calc(100% - 40px));margin-inline:auto}
    .hero{padding:64px 0 32px}
    .kicker,.eyebrow,.frame-label,.facts span,.prompt-head label{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
    .kicker,.frame-label{color:var(--amber)}
    h1{max-width:900px;margin:10px 0 12px;font:700 clamp(44px,8vw,104px)/.88 Georgia,serif;letter-spacing:-.055em}
    .lede{max-width:820px;margin:0;color:var(--muted);font-size:18px}
    .safety{margin-top:24px;padding:14px 18px;border:1px solid var(--red);border-radius:14px;background:rgba(89,30,21,.42);color:#ffd5ca;font-weight:800;letter-spacing:.045em}
    .lockbar{position:sticky;z-index:10;top:0;border-block:1px solid var(--line);background:rgba(17,12,8,.94);backdrop-filter:blur(14px)}
    .controls{display:flex;align-items:center;gap:8px;min-height:66px;padding-block:9px;flex-wrap:wrap}
    .progress{margin-left:auto;min-width:170px;text-align:right;color:var(--brass);font-weight:800}
    .settings{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:9px;margin:28px 0 18px}
    .setting{min-width:0;padding:13px;border:1px solid var(--line);border-radius:14px;background:rgba(34,21,14,.8)}
    .setting span{display:block;color:var(--muted);font-size:10px;letter-spacing:.1em;text-transform:uppercase}
    .setting strong{display:block;margin-top:3px;overflow-wrap:anywhere}
    .instructions,.negative{margin:0 0 18px;padding:18px;border:1px solid var(--line);border-radius:18px;background:rgba(28,18,13,.88)}
    .instructions h2{margin:0 0 8px;font-size:20px}
    .instructions ol{margin:0;padding-left:20px;color:var(--muted)}
    .negative-head,.prompt-head,.card-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
    textarea{display:block;width:100%;resize:vertical;border:1px solid var(--line);border-radius:12px;background:#0d0907;color:#f6e6ca;padding:13px}
    .negative textarea{min-height:92px;margin-top:10px}
    .clip-card{margin:0 0 28px;padding:22px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,rgba(39,24,15,.98),rgba(20,13,9,.98));box-shadow:0 26px 80px rgba(0,0,0,.35)}
    .clip-card.is-done{border-color:var(--green);box-shadow:0 0 0 1px rgba(115,198,160,.18),0 26px 80px rgba(0,0,0,.35)}
    .clip-card.hidden{display:none}
    .eyebrow{color:var(--brass)}
    .card-head h2{margin:3px 0 0;font:700 clamp(23px,3vw,36px)/1.05 Georgia,serif}
    .done{flex:0 0 auto;padding:10px 13px;border:1px solid var(--line);border-radius:999px;background:#100b08;color:var(--muted);font-weight:800}
    .done input{accent-color:var(--green)}
    .frames{display:grid;grid-template-columns:minmax(0,1fr) 40px minmax(0,1fr);align-items:center;gap:10px;margin:20px 0}
    figure{min-width:0;margin:0}
    img{display:block;width:100%;aspect-ratio:30/17;object-fit:cover;border:1px solid #6b4a31;border-radius:13px;background:#050403}
    figcaption{margin-top:6px;color:var(--muted);font-size:11px;overflow-wrap:anywhere}
    .arrow{text-align:center;color:var(--amber);font-size:28px}
    .facts{display:grid;grid-template-columns:2fr 1fr .65fr .75fr;gap:8px;margin-bottom:18px}
    .facts div{min-width:0;padding:11px;border:1px solid var(--line);border-radius:11px;background:#120c08}
    .facts span{display:block;color:var(--muted)}
    code{display:block;margin-top:3px;color:var(--paper);overflow-wrap:anywhere}
    .prompt-head{margin-bottom:7px}
    .prompt{min-height:168px}
    .top-link{display:inline-block;margin-top:12px;color:var(--muted);font-size:12px}
    footer{padding:10px 0 70px;color:var(--muted)}
    @media(max-width:980px){.settings{grid-template-columns:repeat(3,minmax(0,1fr))}.facts{grid-template-columns:1fr 1fr}}
    @media(max-width:620px){
      .shell{width:min(100% - 18px,1460px)}
      .hero{padding:34px 0 22px}
      h1{font-size:48px}
      .lede{font-size:15px}
      .safety{font-size:12px}
      .controls{align-items:stretch}
      .controls>*{flex:1 1 calc(50% - 8px)}
      .progress{flex-basis:100%;margin-left:0;text-align:left}
      .settings{grid-template-columns:1fr 1fr}
      .frames{grid-template-columns:1fr}
      .arrow{transform:rotate(90deg)}
      .facts{grid-template-columns:1fr}
      .clip-card{padding:14px;border-radius:16px}
      .card-head{align-items:flex-start}
      .done{padding:8px 10px}
      .prompt{min-height:270px}
      .negative-head,.prompt-head{align-items:flex-start}
    }
  </style>
</head>
<body>
  <header class="hero shell" id="top">
    <div class="kicker">Approved stills · owner generation only</div>
    <h1>CUT THE<br>STRINGS</h1>
    <p class="lede">Forty linked five-second shots. Every card is one approved first-frame + last-frame pair, one exact WAN prompt, one fixed seed, and one exact output filename.</p>
    <div class="safety">THIS PAGE NEVER SUBMITS JOBS OR SPENDS CREDITS · MOHAMED GENERATES EACH CLIP HIMSELF</div>
  </header>
  <div class="lockbar">
    <div class="shell controls">
      <select id="act-filter" aria-label="Filter by act">
        <option value="all">All acts</option>
        <option value="1">Act I</option>
        <option value="2">Act II</option>
        <option value="3">Act III</option>
        <option value="4">Act IV</option>
        <option value="5">Act V</option>
      </select>
      <button id="show-pending" type="button">Pending only</button>
      <button id="first-pending" type="button">First pending</button>
      <button id="reset" type="button">Reset Done</button>
      <span class="progress" id="progress">0 / 40 done</span>
    </div>
  </div>
  <main class="shell">
    <section class="settings" aria-label="Locked WAN settings">
      <div class="setting"><span>Model</span><strong>WAN 2.7 I2V</strong></div>
      <div class="setting"><span>Resolution</span><strong>720P · 1280x720</strong></div>
      <div class="setting"><span>Duration</span><strong>5 seconds</strong></div>
      <div class="setting"><span>Audio</span><strong>Off</strong></div>
      <div class="setting"><span>Prompt extension</span><strong>Off</strong></div>
      <div class="setting"><span>Bill</span><strong>400 base · 600 planned</strong></div>
    </section>
    <section class="instructions">
      <h2>Owner run sequence</h2>
      <ol>
        <li>Upload the card's FIRST and LAST approved stills in WAN First & Last Frame mode.</li>
        <li>Apply the locked settings and listed fixed seed. Paste the shared negative and exact card prompt.</li>
        <li>Generate one output, download it immediately with the exact filename, record the task ID, then tick Done.</li>
      </ol>
    </section>
    <section class="negative">
      <div class="negative-head">
        <label for="negative-prompt">SHARED NEGATIVE PROMPT</label>
        <button type="button" data-copy="negative-prompt">Copy negative</button>
      </div>
      <textarea id="negative-prompt" readonly>${escapeHtml(globalNegative)}</textarea>
    </section>
    <div id="cards">${clips.map(card).join('')}</div>
  </main>
  <footer class="shell">Approved stills commit 1de7001 · 40/40 FLF cards · 0 jobs submitted · 0 credits spent · 0 returned videos.</footer>
  <script>window.CTS_WAN_DATA=${inlineData};</script>
  <script>
    const cards = [...document.querySelectorAll('.clip-card')];
    const storageKey = 'cut-the-strings-wan-owner-board-v1';
    let saved = {};
    let pendingOnly = false;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      localStorage.removeItem(storageKey);
    }

    function persist() {
      const state = {};
      for (const card of cards) state[card.dataset.clip] = { done: card.querySelector('[data-state="done"]').checked };
      localStorage.setItem(storageKey, JSON.stringify(state));
      refresh();
    }

    function refresh() {
      const act = document.querySelector('#act-filter').value;
      let done = 0;
      for (const card of cards) {
        const box = card.querySelector('[data-state="done"]');
        if (box.checked) done += 1;
        card.classList.toggle('is-done', box.checked);
        const visible = (act === 'all' || card.dataset.act === act) && (!pendingOnly || !box.checked);
        card.classList.toggle('hidden', !visible);
      }
      document.querySelector('#progress').textContent = done + ' / ' + cards.length + ' done';
      document.querySelector('#show-pending').classList.toggle('active', pendingOnly);
    }

    for (const card of cards) {
      const box = card.querySelector('[data-state="done"]');
      box.checked = Boolean(saved[card.dataset.clip]?.done);
      box.addEventListener('change', persist);
    }

    async function copyText(target, button) {
      const element = document.getElementById(target);
      const value = element.value || element.textContent;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        element.focus();
        element.select();
        document.execCommand('copy');
      }
      const original = button.textContent;
      button.textContent = 'Copied';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove('copied');
      }, 1000);
    }

    for (const button of document.querySelectorAll('[data-copy]')) {
      button.addEventListener('click', () => copyText(button.dataset.copy, button));
    }
    document.querySelector('#act-filter').addEventListener('change', refresh);
    document.querySelector('#show-pending').addEventListener('click', () => {
      pendingOnly = !pendingOnly;
      refresh();
    });
    document.querySelector('#first-pending').addEventListener('click', () => {
      const pending = cards.find((card) => !card.querySelector('[data-state="done"]').checked && !card.classList.contains('hidden'));
      if (pending) pending.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.querySelector('#reset').addEventListener('click', () => {
      if (!confirm('Clear all Done ticks?')) return;
      localStorage.removeItem(storageKey);
      for (const box of document.querySelectorAll('[data-state="done"]')) box.checked = false;
      refresh();
    });
    refresh();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(packDir, 'WAN-GENERATION-BOARD.html'), board, 'utf8');

console.log(JSON.stringify({
  board: path.join(packDir, 'WAN-GENERATION-BOARD.html'),
  clips: clips.length,
  promptFiles: fs.readdirSync(path.join(packDir, 'wan-prompts')).filter((name) => name.endsWith('.txt')).length,
  jobsSubmitted: data.jobsSubmitted,
  creditsSpent: data.creditsSpent
}, null, 2));
