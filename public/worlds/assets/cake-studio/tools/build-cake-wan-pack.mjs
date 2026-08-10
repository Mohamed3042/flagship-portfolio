#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const packDir = process.argv[2];
if (!packDir) {
  throw new Error('Usage: node build-cake-wan-pack.mjs /absolute/path/to/CAKE-STUDIO-WAN-2.7');
}

const planPath = path.join(packDir, 'prompts', 'keyframe-plan.json');
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const frameById = new Map(plan.frames.map((frame) => [frame.id, frame]));

const globalNegative = [
  'blur',
  'soft focus',
  'watermark',
  'captions',
  'readable text',
  'letters',
  'numbers',
  'UI',
  'labels',
  'logos',
  'faces in printed photographs',
  'extra fingers',
  'deformed hands',
  'extra limbs',
  'morphing anatomy',
  'flicker',
  'unintended cut',
  'surprise camera move',
  'melted tools',
  'dirty kitchen',
  'cellar',
  'clinic',
  'gore',
  'body horror',
  'unintended horror',
  'generated letterbox bars',
  'cropped central action'
].join(', ');

const seedByChapter = {
  overture: 270711,
  'nine-real-cakes': 270712,
  'choose-and-place': 270713,
  'surface-and-type': 270714,
  calibrate: 270715,
  'measured-print': 270716,
  approve: 270717,
  inspect: 270718,
  finale: 270719
};

// Rebuilt 2026-08-09 after the owner's first real WAN 2.7 trials rejected the
// boilerplate-heavy prompts: motion was one vague clause buried under ~120 words
// of repeated preservation text, so WAN improvised (flapping sheet, wandering
// hands, no clean landing). New contract: motion first and causal (the baker's
// hands DO the transformation), one camera move with amplitude, counts inline,
// one short landing + guard + style tail. Every clip is now a first+last-frame
// pair of approved stills, so each card is one paste with no negative field.
const motionOverrides = {
  KF01: "The baker's brown hands in deep-teal cuffs slowly raise the edible sheet and stand it on the marble in one smooth upright wave, fingertips steadying the top edge. Camera pushes in gently, about ten percent closer.",
  KF02: 'The hands ease the standing sheet open into a self-supporting arch, and a warm miniature bakery interior fades into view inside it. Camera continues the same slow push in.',
  KF03: 'The hands fold the arch forward and down over a hidden round form, its lower half wrapping into a smooth cake top. Camera orbits five degrees to the right, slow and level.',
  KF04: 'The hands smooth the last edge flat onto the ivory cake, then withdraw completely from frame, leaving the blank cylinder alone on the marble. Camera lowers fifteen centimetres, slow and steady.',
  KF05: 'The tall stainless piping tip glides down over the cake with machine-straight precision and pipes one continuous ivory cream line onto the top. Camera holds centered and eases slightly closer.',
  KF06: 'The piped cream climbs stair by stair into an impossible tiered ivory atrium, each step extruded clean and sharp as if printed. Camera tilts up slowly, following the rising cream.',
  KF07: 'The tiered atrium rotates slowly like a display carousel and condenses into one berry-topped ivory cake at center. Camera settles into a symmetrical frontal frame.',
  KF08: "The ivory cake's fluted walls turn glossy chocolate brown in one smooth wave while the berry crest becomes a chocolate crest. Camera tracks left slowly, keeping the cake centered.",
  KF09: 'The round chocolate cake stretches and squares cleanly into the long rectangular chocolate sheet cake, edges snapping straight with digital precision. Camera continues the same slow left track.',
  KF10: 'The rectangle softens, its top edge dips into a center cleft, and the form rounds into the white heart cake with red berry trim. Camera keeps the same measured left track.',
  KF11: "The heart's cleft closes and its sides lengthen smoothly into the fluted ivory oval cake. Camera orbits six degrees clockwise, slow.",
  KF12: 'The oval rises into a taller smooth cylinder while a deep-teal printed wrap flows around its side like a photograph applying itself. Camera lowers slightly toward a side-on angle in the window light.',
  KF13: 'The printed wrap fades to ivory as the cylinder spreads and squares into the long rectangular sheet cake. Camera settles at a shallow fourteen-degree elevation.',
  KF14: "A second smaller round tier rises smoothly from the sheet's center and seats itself perfectly, forming the two-tier cake. Camera rises toward a high forty-two-degree view of the top.",
  KF15: 'The lower tier narrows while ornate piping curls grow around both tiers, resolving into the vintage round cake with its small topper. Camera orbits eight degrees right, slow.',
  KF16: 'Eight more finished cakes rise smoothly from the dark stands around the vintage cake, arranging themselves into one elegant spiral display like a catalog coming alive, exactly nine cakes total, none extra. Camera pulls back slowly to reveal the whole display.',
  KF17: "The baker's brown hand in a deep-teal cuff enters from the lower left and reaches once toward the front berry cake; everything else stays perfectly still. Camera continues a gentle pull back and settles.",
  KF18: 'The chosen berry cake glides forward off the display in one clean straight line, as if selected, while the other eight sink into deep-teal shadow. Camera pushes forward with it, slow.',
  KF19: "Fine rose-gold contour lines fade in across the cake's top like a precise surface map, and a small cluster of berries and cream appears hovering above the marked rim. Camera drifts to the exact angle where the map lines align.",
  KF20: 'The hovering decoration glides along above the rim to the front right and sinks lower, aligning itself precisely over its marked landing spot. Camera orbits six degrees right, matching the drift.',
  KF21: "The baker's hand steadies the decoration as it settles the last few centimetres and seats itself perfectly onto the cake surface. Camera pushes in fifteen centimetres, close and slow.",
  KF22: "The baker's fingers lift the edge of the cake's ivory side wrap and peel it outward into one smooth curling strip. Camera eases back and lowers toward the side.",
  KF23: 'The peeled strip curls upward and its cream edge flows into one elegant abstract flourish standing above the cake, flowing curves only, never letters. Camera orbits left slowly, following the strip.',
  KF24: 'The flourish thickens and grows into a balanced pair of monumental piped cream scrolls flanking the tall silver piping tip. Camera tilts up slowly with the rising forms.',
  KF25: "Camera glides straight toward the giant piping tip until its polished opening fills the frame like a doorway, the baker's hands steadying its rim from above. One slow centered push, nothing else moves.",
  KF26: 'Camera passes through the piping-tip opening into a long mirrored calibration hall where a flat sheet carries a grid of twenty colour patches, four across and five deep. One straight slow forward glide of about one metre, all twenty patches staying in place.',
  KF27: "A fine off-colour mist drifts once across the patch grid from left to right, dulling every colour as it passes, while the baker's hand enters with a slim brush at the corner. Camera rises gently overhead, keeping all twenty patches in frame.",
  KF28: "The baker's hand draws a thin rose-gold measuring beam across the grid row by row, and every colour snaps back to true behind it. Camera tracks right at the beam's exact speed, all twenty patches staying in place.",
  KF29: 'The beam crosses the final row and all twenty patches settle into clean calibrated colour, none split, merged, added or lost. Camera continues the same slow right track, then rests.',
  KF30: 'The twenty patches lift off the sheet as twenty glossy glaze droplets, one per patch, and arc down the hall into one calibrated colour arch. Camera lowers from overhead to a frontal hero angle.',
  KF31: 'The droplet arch settles into one controlled colour ribbon while the blank sheet glides along the runway toward the teal-and-brass press. Camera settles frontal and symmetrical.',
  KF32: "The press rollers draw the sheet through and it emerges on the far side perfectly clean and unchanged in size, the baker's hands receiving its edge. Camera tracks alongside, level and slow.",
  KF33: "The baker's hands lay a polished steel rule beside the sheet and slide it flush against the long edge in one precise motion. Camera lowers slowly toward the sheet plane.",
  KF34: 'The steel rule extends forward into a long narrow rose-gold-edged bridge running down the hall, and the hands withdraw. Camera tracks forward low along the bridge.',
  KF35: 'Exactly six small rose-gold facets rise from the bridge surface and hover in two neat rows of three. Camera continues the low forward track toward them.',
  KF36: "The six facets glide together and click into one six-faceted rose-gold proof ring, and the baker's two hands catch it around a small layered stack. Camera orbits a few degrees clockwise with the motion, then rests.",
  KF37: 'The hands set the ringed stack down on the runway, and one altered top layer slides sideways out of the open ring, resting apart from the approved stack. Camera settles into a centered close view.',
  KF38: 'The altered layer drifts back into deep-teal shadow and dims while the ring seals around the approved stack in warm light. Focus eases from the fading layer to the sealed stack.',
  KF39: 'Exactly twelve thin rose-gold inspection beams rise and stand around the approved cake, in three separated groups of four, like rules taking their positions. Camera pulls back slowly to give them room.',
  KF40: 'The twelve beams fan outward and their light reveals nine cake silhouettes on nine separate landings of a dark spiral stair, all twelve beams staying. Camera rises vertically, slow, through the open cage.',
  KF41: 'From each of the nine cakes one faulty piece lifts straight up along its own beam and hangs in the air, nine pieces, one per cake. Camera cranes down a slow diagonal toward the center.',
  KF42: 'The nine lifted faults dissolve into flour sparkle and the nine corrected cakes glide into one warm staircase display, exactly nine, nothing extra. Camera pulls back and levels into a frontal poster frame.',
  KF43: "The top cake's face opens like a circular aperture, revealing a living miniature bakery world glowing inside. Camera settles symmetrical with all nine forms visible.",
  KF44: 'Camera glides straight through the cake aperture into the miniature bakery and arrives on one ivory heart-marked cake as three ruby glaze droplets fall beside it. One slow forward push, about one metre.',
  KF45: 'The three droplets land and spread into one neat glossy glaze edge while, around the room, nine cakes each begin peeling a thin photo sheet from their tops, one sheet per cake. Camera makes a slow half orbit to the left.',
  KF46: 'The nine peeling sheets rise, curve inward and weave into one continuous cream-and-paper arch, nine sheets becoming one, none left over. Camera cranes up slowly through their center.',
  KF47: 'The cream arch straightens and glazes into a tall glass print-room vitrine framed in rose gold, a miniature bakery glowing inside. Camera tilts down slowly as it forms.',
  KF48: 'The vitrine compresses into a single thin edible sheet standing curled on the black marble, the miniature world folding flat into its translucent glow. Camera dollies back forty centimetres, slow.',
  KF49: "The backlit sheet's glow softens to plain ivory as it settles into a gentle open curl and the baker's brown hands return to take its edges; the six-faceted reflection fades, three facets per side. Camera eases back to the opening distance.",
  KF50: "The baker's brown hands lower the sheet the last few centimetres toward the marble and hold it exactly as at the very start, closing the loop. Camera locked off, no movement."
};

function sentence(text) {
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function humanize(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function frameFilename(frame) {
  return `CST-${frame.id}-${frame.slug}.png`;
}

function clipNumber(index) {
  return String(index + 1).padStart(3, '0');
}

function buildPrompt(current) {
  const motion = motionOverrides[current.id];
  if (!motion) throw new Error(`No motion override for ${current.id}`);
  const parts = [
    'Generate single shot.',
    sentence(motion),
    'The motion finishes by 4.5 seconds and the final half second holds perfectly still, matching the supplied last frame exactly.',
    'One continuous take, no cuts, no camera shake, no new objects, no readable text or logos.',
    sentence(plan.styleLock),
    'No dialogue. No background music.'
  ];

  return parts.filter(Boolean).join(' ').replace(/\.\./g, '.');
}

// Every clip is a first+last-frame pair of two APPROVED stills. The stills are
// the designed film; the joins are byte-exact by construction, and the owner
// never has to extract an end frame between clips (the extractor stays only as
// a retake fallback). This is the workflow the owner actually ran his first
// trials with, and the mode the Disney/Kingdom chain shipped on.
const clips = plan.frames.map((current, index) => {
  const next = index === plan.frames.length - 1 ? frameById.get('KF01') : plan.frames[index + 1];
  const number = clipNumber(index);
  const loopFamily = current.id === 'KF49' || current.id === 'KF50';
  const seed = loopFamily ? seedByChapter.overture : seedByChapter[current.chapter];

  return {
    clip: `CST-A-${number}`,
    number,
    chapter: current.chapter,
    title: `${humanize(current.slug)} → ${humanize(next.slug)}`,
    storyboard: `${current.id} → ${next.id}`,
    storyboardFirst: `keyframes/${frameFilename(current)}`,
    storyboardTarget: `keyframes/${frameFilename(next)}`,
    generationFirst: `keyframes/${frameFilename(current)}`,
    generationLast: `keyframes/${frameFilename(next)}`,
    acceptedFilename: `accepted/CST-A-${number}.mp4`,
    rejectedPattern: `rejected/CST-A-${number}-attempt-##.mp4`,
    seed,
    flf: true,
    targetId: next.id,
    action: motionOverrides[current.id],
    camera: current.camera,
    prompt: buildPrompt(current)
  };
});

for (const dir of ['accepted', 'raw', 'rejected', 'endframes', 'wan-prompts']) {
  fs.mkdirSync(path.join(packDir, dir), { recursive: true });
}

for (const dir of ['accepted', 'raw', 'rejected', 'endframes']) {
  const keep = path.join(packDir, dir, '.gitkeep');
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
}

for (const clip of clips) {
  fs.writeFileSync(path.join(packDir, 'wan-prompts', `${clip.clip}.txt`), `${clip.prompt}\n`, 'utf8');
}

fs.writeFileSync(path.join(packDir, 'negative-prompt.txt'), `${globalNegative}\n`, 'utf8');
fs.writeFileSync(path.join(packDir, 'clips.json'), `${JSON.stringify({
  schema: 'cake-studio-wan-owner-pack/v1',
  model: 'WAN 2.7 image-to-video',
  settings: {
    resolution: '720P / 1280×720 / 16:9',
    durationSeconds: 5,
    audio: false,
    promptExtension: false,
    outputsPerAttempt: 1,
    baseCreditsPerClip: 10,
    baseCreditsTotal: 500,
    retakeCap: 'not specified by owner'
  },
  styleLock: plan.styleLock,
  negativePrompt: globalNegative,
  clips
}, null, 2)}\n`, 'utf8');

const csvRows = [
  ['clip', 'attempt', 'provider_task_id', 'seed_applied', 'status', 'credits', 'saved_file', 'notes'],
  ...clips.map((clip) => [clip.clip, '01', '', String(clip.seed), 'pending', '0', '', ''])
];
fs.writeFileSync(
  path.join(packDir, 'run-log.csv'),
  `${csvRows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')}\n`,
  'utf8'
);

function mappingTable() {
  const rows = clips.map((clip) =>
    `| ${clip.clip} | ${clip.storyboard} | \`${clip.generationFirst}\` | ${clip.generationLast ? `\`${clip.generationLast}\`` : '—'} | \`${clip.acceptedFilename}\` | ${clip.seed} |`
  );
  return [
    '| Clip | Storyboard | First-frame upload | Last-frame upload | Accepted filename | Seed |',
    '|---|---|---|---|---|---:|',
    ...rows
  ].join('\n');
}

function promptSections() {
  return clips.map((clip) => [
    `### ${clip.clip} — ${clip.title}${clip.flf ? ` · FLF to ${clip.targetId}` : ''}`,
    '',
    '```text',
    clip.prompt,
    '```'
  ].join('\n')).join('\n\n');
}

const runbook = `# Cake Studio — owner-run WAN 2.7 production pack

Status: **READY FOR OWNER GENERATION**  
Owner direction: proceed with WAN 2.7 on **2026-08-09**  
Generation owner: **Mohamed, using his own WAN account**  
WAN credits spent by Codex: **0**

This folder is the complete offline source of truth for the 50 five-second clips. The approved
51-still sequence is in [\`keyframes/\`](keyframes/), and the embedded visual board is
[\`index.html\`](index.html). Open the board first; every positive prompt, input image, target image,
seed, output filename, and acceptance checkbox is on one card.

## Locked settings

- Model: **WAN 2.7 image-to-video**
- Resolution: **720P / 1280×720 / 16:9**
- Duration: **5 seconds**
- Audio: **off**
- Prompt extension / automatic rewrite: **off**
- Outputs per attempt: **1**
- Download every result immediately; hosted result URLs expire
- Initial-pass cost: **50 × 10 = 500 credits**
- Retake cap: **not specified** — complete or assess the first pass before authorizing extra spend

Use the supplied seed when the account exposes a seed field. If it does not, record
\`not exposed\` in the run log; never claim a hidden seed was applied.

Every prompt is self-contained: one paste per clip, nothing else to copy. A negative field is
NOT required (\`negative-prompt.txt\` still exists if you ever want one).

## Workflow — every clip is a first+last pair of approved stills

1. Open the clip's card. Upload the LEFT still as the first frame and the RIGHT still as the
   last frame (WAN First&LastFrame mode). Both are approved keyframes shipped in \`keyframes/\`.
2. Paste the card's single prompt. Keep 720P, 5 s, audio off, prompt extension off, one output.
3. Generate, then download the result immediately into \`accepted/\` under the exact filename.
4. Because both endpoints are approved stills, adjacent clips join byte-exactly — there is no
   end-frame extraction step between clips.
5. \`extract-endframe.command\` remains only as a retake fallback if you ever deliberately
   continue from a generated frame instead of an approved still.
6. Never overwrite an attempt. Put rejected downloads in \`rejected/\` using the exact attempt
   pattern, and record task ID, seed visibility, credits, and finding in \`run-log.csv\`.

## Exact input/output map

${mappingTable()}

## Copy-ready positive prompts

${promptSections()}

## Acceptance gate

Accept a take only when all of these are true:

- One continuous shot; no cut, flash edit, surprise camera move, or prompt-invented secondary action.
- The named subject performs only the named dominant action and the camera follows the specified move.
- Motion settles by about 4.5 seconds; the last half-second is clean and stable.
- Materials, rear-light direction, flour haze, marble veining, buttercream texture, lens character,
  center-safe composition, and restrained grain remain continuous.
- No readable text, label, logo, watermark, face in printed imagery, anatomy mutation, flicker,
  melted tool, dirty/clinical/horror drift, or generated letterbox bar.
- Every locked count survives: nine cakes, 20 patches/droplets, six proof facets, 12 beams, and the
  specific one-to-one mappings named by the prompt.
- FLF clips arrive cleanly at their supplied destination still.

Retake exactly one variable at a time:

1. Remove secondary wording.
2. Reduce motion amplitude.
3. Make direction or speed more explicit.
4. Simplify lighting behavior.
5. Supply the approved storyboard target as \`last_frame\`.
6. Rewind to the last clean accepted clip.
7. Only then try a nearby seed.

The initial pass costs 500 credits. No retake ceiling was supplied, so stop and decide a cap before
additional spending.
`;

fs.writeFileSync(path.join(packDir, 'RUNBOOK.md'), runbook, 'utf8');

const readme = `# Start here

1. Double-click **index.html**.
2. Keep WAN 2.7 at 720P, 5 seconds, audio off, prompt extension off, one output.
3. Start at **CST-A-001** and work in order.
4. Every card is one first+last pair: upload the LEFT image as first frame, the RIGHT image as
   last frame, paste the card's single prompt, generate. No negative field, nothing else to copy.
5. Download accepted clips into **accepted/** immediately with the card's exact filename.

The board works fully offline and stores your Generated/Accepted ticks in this browser. The Markdown
runbook and one-text-file-per-prompt copies are included in case the browser clipboard is unavailable.
`;
fs.writeFileSync(path.join(packDir, 'README-FIRST.md'), readme, 'utf8');

const sourceNote = `# Source provenance

- Repository: https://github.com/Mohamed3042/flagship-portfolio
- Branch: \`feature/cake-studio-world\`
- Source commit: \`068d096687356b3d833ead0c8f0ce856727082f7\`
- Source directory: \`public/worlds/assets/cake-studio\`
- Downloaded for this owner pack: 2026-08-09
- Approved still integrity: see \`review/keyframe-qa.json\` (51 SHA-256 records)

The WAN prompts in this pack are derived locally from the branch's locked \`toNext\`, camera,
continuity, center-safe, identity, count, and style contracts. No video was generated while making
the pack.

Prompt language rebuilt 2026-08-09 after the owner's first three real WAN trials rejected the
original boilerplate-heavy prompts: motion is now first and causal, every clip is a first+last
pair of approved stills, and each card is a single self-contained paste. The 51 approved stills
are unchanged.
`;
fs.writeFileSync(path.join(packDir, 'SOURCE.md'), sourceNote, 'utf8');

const extractor = `#!/bin/zsh
set -euo pipefail

PACK_DIR="\${0:A:h}"
CLIP_ID="\${1:-}"

if [[ -z "$CLIP_ID" ]]; then
  printf 'Accepted clip ID (example CST-A-001): '
  read -r CLIP_ID
fi

CLIP_ID="\${(U)CLIP_ID}"
if [[ ! "$CLIP_ID" =~ '^CST-A-[0-9]{3}$' ]]; then
  print -u2 "Invalid clip ID: $CLIP_ID"
  read -k 1 '?Press any key to close.'
  exit 2
fi

INPUT="$PACK_DIR/accepted/$CLIP_ID.mp4"
OUTPUT="$PACK_DIR/endframes/$CLIP_ID-end.png"

if [[ ! -f "$INPUT" ]]; then
  print -u2 "Accepted clip not found: $INPUT"
  read -k 1 '?Press any key to close.'
  exit 3
fi

ffmpeg -hide_banner -loglevel error -y -nostdin -sseof -0.04 -i "$INPUT" -frames:v 1 "$OUTPUT"
print "Saved: $OUTPUT"
open -R "$OUTPUT"
read -k 1 '?Press any key to close.'
`;
fs.writeFileSync(path.join(packDir, 'extract-endframe.command'), extractor, 'utf8');
fs.chmodSync(path.join(packDir, 'extract-endframe.command'), 0o755);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function card(clip) {
  return `
    <article class="clip-card" id="${clip.clip}" data-clip="${clip.clip}" data-chapter="${clip.chapter}" data-flf="${clip.flf}">
      <header class="card-head">
        <div>
          <div class="eyebrow">${clip.clip} · ${escapeHtml(clip.storyboard)}</div>
          <h2>${escapeHtml(clip.title)}</h2>
        </div>
        ${clip.flf ? `<span class="badge flf">FLF → ${clip.targetId}</span>` : '<span class="badge">CONTINUE</span>'}
      </header>
      <div class="frames">
        <figure>
          <a href="${clip.storyboardFirst}" target="_blank"><img src="${clip.storyboardFirst}" alt="${clip.storyboard} storyboard start"></a>
          <figcaption>Storyboard start · ${clip.storyboard.split(' → ')[0]}</figcaption>
        </figure>
        <div class="arrow" aria-hidden="true">→</div>
        <figure>
          <a href="${clip.storyboardTarget}" target="_blank"><img src="${clip.storyboardTarget}" alt="${clip.storyboard} storyboard target"></a>
          <figcaption>QA target${clip.flf ? ' · upload as last frame' : ' · do not upload yet'} · ${clip.targetId}</figcaption>
        </figure>
      </div>
      <div class="facts">
        <div><span>First-frame upload</span><code>${escapeHtml(clip.generationFirst)}</code></div>
        <div><span>Last-frame upload</span><code>${clip.generationLast ? escapeHtml(clip.generationLast) : 'none on attempt 01'}</code></div>
        <div><span>Accepted filename</span><code>${escapeHtml(clip.acceptedFilename)}</code></div>
        <div><span>Seed</span><code>${clip.seed}</code></div>
      </div>
      <div class="prompt-head">
        <strong>Positive prompt</strong>
        <button class="copy" type="button" data-copy="prompt-${clip.clip}">Copy prompt</button>
      </div>
      <textarea id="prompt-${clip.clip}" class="prompt" readonly>${escapeHtml(clip.prompt)}</textarea>
      <div class="checks">
        <label><input type="checkbox" data-state="generated"> Generated</label>
        <label><input type="checkbox" data-state="accepted"> Accepted + downloaded</label>
        <a href="#top">Back to top</a>
      </div>
    </article>`;
}

const chapterOptions = [...new Set(clips.map((clip) => clip.chapter))]
  .map((chapter) => `<option value="${chapter}">${humanize(chapter)}</option>`)
  .join('');

const inlineData = JSON.stringify({ negativePrompt: globalNegative, clips }).replaceAll('</script>', '<\\/script>');
const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cake Studio · WAN 2.7 Owner Board</title>
  <style>
    :root { color-scheme: dark; --ink:#f7f0df; --muted:#aebdb8; --teal:#0b3c40; --teal2:#17666a; --rose:#d7a28d; --gold:#f1c7a9; --black:#080b0c; --panel:#101719; --line:#284045; --ok:#67d4ad; }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; background:radial-gradient(circle at 15% 0%,#12383a 0,transparent 32rem),radial-gradient(circle at 90% 12%,#3a201d 0,transparent 30rem),var(--black); color:var(--ink); font:15px/1.5 Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    button,select,input,textarea { font:inherit; }
    .shell { width:min(1480px,calc(100% - 32px)); margin:auto; }
    .hero { padding:56px 0 28px; }
    .kicker { color:var(--rose); text-transform:uppercase; letter-spacing:.18em; font-size:12px; }
    h1 { max-width:920px; margin:8px 0 12px; font-size:clamp(34px,6vw,76px); line-height:.94; letter-spacing:-.055em; }
    .lede { max-width:820px; margin:0; color:var(--muted); font-size:18px; }
    .lockbar { position:sticky; z-index:10; top:0; padding:12px 0; background:rgba(8,11,12,.88); border-block:1px solid var(--line); backdrop-filter:blur(18px); }
    .controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    select,button { border:1px solid var(--line); border-radius:999px; color:var(--ink); background:#142024; padding:9px 14px; cursor:pointer; }
    button:hover { border-color:var(--rose); }
    .progress { margin-left:auto; color:var(--muted); }
    .settings { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:10px; margin:24px 0; }
    .setting { padding:14px; background:rgba(16,23,25,.86); border:1px solid var(--line); border-radius:14px; }
    .setting span,.facts span { display:block; color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.08em; }
    .negative { margin:0 0 32px; padding:20px; border:1px solid #69463e; border-radius:16px; background:rgba(62,33,29,.45); }
    .negative-head,.prompt-head,.card-head,.checks { display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .negative textarea { width:100%; min-height:90px; margin-top:12px; }
    .chapter-label { margin:44px 0 12px; color:var(--gold); font-size:13px; letter-spacing:.15em; text-transform:uppercase; }
    .clip-card { margin:0 0 28px; padding:22px; border:1px solid var(--line); border-radius:24px; background:linear-gradient(145deg,rgba(16,23,25,.96),rgba(9,15,16,.96)); box-shadow:0 22px 80px rgba(0,0,0,.28); }
    .clip-card.is-accepted { border-color:rgba(103,212,173,.8); box-shadow:0 0 0 1px rgba(103,212,173,.18),0 22px 80px rgba(0,0,0,.28); }
    .eyebrow { color:var(--rose); font-size:12px; letter-spacing:.12em; text-transform:uppercase; }
    h2 { margin:4px 0 0; font-size:clamp(22px,3vw,34px); letter-spacing:-.025em; }
    .badge { flex:0 0 auto; padding:6px 10px; border:1px solid var(--line); border-radius:999px; color:var(--muted); font-size:11px; letter-spacing:.08em; }
    .badge.flf { border-color:var(--rose); color:var(--gold); background:rgba(215,162,141,.1); }
    .frames { display:grid; grid-template-columns:minmax(0,1fr) 34px minmax(0,1fr); align-items:center; gap:10px; margin:18px 0; }
    figure { margin:0; }
    img { display:block; width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:14px; background:#050707; border:1px solid #27383b; }
    figcaption { color:var(--muted); font-size:12px; margin-top:6px; }
    .arrow { color:var(--rose); font-size:26px; text-align:center; }
    .facts { display:grid; grid-template-columns:2fr 2fr 1.4fr .55fr; gap:8px; margin-bottom:18px; }
    .facts div { min-width:0; padding:11px; border:1px solid var(--line); border-radius:12px; background:#0b1113; }
    code { display:block; margin-top:3px; color:#dce9e5; overflow-wrap:anywhere; }
    .prompt-head { margin-bottom:7px; }
    textarea { resize:vertical; border:1px solid var(--line); border-radius:12px; background:#070b0c; color:#eaf2ef; padding:14px; }
    .prompt { width:100%; min-height:172px; }
    .copy.copied { border-color:var(--ok); color:var(--ok); }
    .checks { margin-top:14px; justify-content:flex-start; color:var(--muted); }
    .checks label { padding:7px 10px; border-radius:10px; background:#0b1113; }
    .checks input { accent-color:var(--ok); }
    .checks a { margin-left:auto; color:var(--muted); }
    .hidden { display:none !important; }
    footer { padding:20px 0 60px; color:var(--muted); }
    @media(max-width:900px){ .settings{grid-template-columns:repeat(3,1fr)} .facts{grid-template-columns:1fr 1fr} }
    @media(max-width:620px){ .shell{width:min(100% - 18px,1480px)} .hero{padding-top:32px} .settings{grid-template-columns:1fr 1fr} .frames{grid-template-columns:1fr}.arrow{transform:rotate(90deg)} .facts{grid-template-columns:1fr} .clip-card{padding:14px;border-radius:18px}.card-head{align-items:flex-start}.progress{width:100%;margin-left:0}.prompt{min-height:260px} }
  </style>
</head>
<body>
  <header class="hero shell" id="top">
    <div class="kicker">Owner generation board · offline</div>
    <h1>Cake Studio<br>WAN 2.7 production</h1>
    <p class="lede">Fifty linked five-second shots. Every clip is a first+last pair of approved stills: upload both, paste the card's single prompt, generate. No negative field, nothing else to copy.</p>
  </header>
  <div class="lockbar">
    <div class="shell controls">
      <select id="chapter-filter" aria-label="Filter by chapter"><option value="all">All chapters</option>${chapterOptions}</select>
      <button id="show-flf" type="button">FLF only</button>
      <button id="show-pending" type="button">Pending only</button>
      <button id="reset" type="button">Reset ticks</button>
      <span class="progress" id="progress">0 / 50 accepted</span>
    </div>
  </div>
  <main class="shell">
    <section class="settings" aria-label="Locked settings">
      <div class="setting"><span>Model</span><strong>WAN 2.7 I2V</strong></div>
      <div class="setting"><span>Resolution</span><strong>720P · 16:9</strong></div>
      <div class="setting"><span>Duration</span><strong>5 seconds</strong></div>
      <div class="setting"><span>Audio</span><strong>Off</strong></div>
      <div class="setting"><span>Prompt rewrite</span><strong>Off</strong></div>
      <div class="setting"><span>First pass</span><strong>500 credits</strong></div>
    </section>
    <div id="cards">${clips.map(card).join('')}</div>
  </main>
  <footer class="shell">Source: approved branch commit 068d096 · prompts generated from the locked keyframe plan · WAN spend before owner generation: 0.</footer>
  <script>window.CAKE_WAN_DATA=${inlineData};</script>
  <script>
    const cards = [...document.querySelectorAll('.clip-card')];
    const storageKey = 'cake-studio-wan-27-owner-board-v1';
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    let flfOnly = false;
    let pendingOnly = false;

    function persist() {
      const state = {};
      for (const card of cards) {
        state[card.dataset.clip] = {};
        for (const input of card.querySelectorAll('input[data-state]')) state[card.dataset.clip][input.dataset.state] = input.checked;
      }
      localStorage.setItem(storageKey, JSON.stringify(state));
      refresh();
    }

    function refresh() {
      const chapter = document.querySelector('#chapter-filter').value;
      let accepted = 0;
      for (const card of cards) {
        const acceptedBox = card.querySelector('[data-state="accepted"]');
        if (acceptedBox.checked) accepted += 1;
        card.classList.toggle('is-accepted', acceptedBox.checked);
        const visible = (chapter === 'all' || card.dataset.chapter === chapter)
          && (!flfOnly || card.dataset.flf === 'true')
          && (!pendingOnly || !acceptedBox.checked);
        card.classList.toggle('hidden', !visible);
      }
      document.querySelector('#progress').textContent = accepted + ' / ' + cards.length + ' accepted';
      document.querySelector('#show-flf').classList.toggle('copied', flfOnly);
      document.querySelector('#show-pending').classList.toggle('copied', pendingOnly);
    }

    for (const card of cards) {
      const state = saved[card.dataset.clip] || {};
      for (const input of card.querySelectorAll('input[data-state]')) {
        input.checked = Boolean(state[input.dataset.state]);
        input.addEventListener('change', persist);
      }
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
      setTimeout(() => { button.textContent = original; button.classList.remove('copied'); }, 1200);
    }

    for (const button of document.querySelectorAll('[data-copy]')) button.addEventListener('click', () => copyText(button.dataset.copy, button));
    document.querySelector('#chapter-filter').addEventListener('change', refresh);
    document.querySelector('#show-flf').addEventListener('click', () => { flfOnly = !flfOnly; refresh(); });
    document.querySelector('#show-pending').addEventListener('click', () => { pendingOnly = !pendingOnly; refresh(); });
    document.querySelector('#reset').addEventListener('click', () => {
      if (!confirm('Clear all Generated and Accepted ticks?')) return;
      localStorage.removeItem(storageKey);
      for (const input of document.querySelectorAll('input[data-state]')) input.checked = false;
      refresh();
    });
    refresh();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(packDir, 'index.html'), indexHtml, 'utf8');

console.log(JSON.stringify({
  packDir,
  clips: clips.length,
  flfClips: clips.filter((clip) => clip.flf).map((clip) => clip.clip),
  promptFiles: fs.readdirSync(path.join(packDir, 'wan-prompts')).filter((name) => name.endsWith('.txt')).length
}, null, 2));
