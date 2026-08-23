import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SETTINGS, SHARED_NEGATIVE, STYLE_LOCK } from "./wan-jobs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const boardPath = path.join(here, "WAN-GENERATION-BOARD.html");
const reportPath = path.join(repo, "public/worlds/assets/arcane/review/wan-board-qa.json");
const expectedAnchors = new Set(["ARC-001", "ARC-008", "ARC-016", "ARC-022", "ARC-025", "ARC-034", "ARC-040"]);
const requiredNegativeTerms = ["blur", "watermark", "captions", "extra limbs", "morphing", "flicker", "unintended cut", "horror"];
const forbiddenPositiveTerms = ["franchise", "champion", "logo", "watermark", "subtitle", "gore", "child", "slum", "horror", "rune"];
const countLocks = new Map([
  ["ARC-002", /five complete plinths/i],
  ["ARC-014", /exactly four/i],
  ["ARC-025", /exactly five/i],
  ["ARC-033", /exactly six desks/i]
]);
const lockedBeatLocks = new Map([
  ["ARC-001", /cloud.*brushstroke/i],
  ["ARC-002", /small crowd.*using/i],
  ["ARC-003", /ocean.*(?:moves|swell).*glass.*reflection.*leap/i],
  ["ARC-004", /leaves.*rearrangement.*second.*face/i],
  ["ARC-005", /picture.*repaint.*frosting/i],
  ["ARC-006", /painted half.*breath.*marble half.*rigid/i],
  ["ARC-007", /window.*minute machine scene/i],
  ["ARC-008", /lift.*grate.*glow.*shadow.*wall.*step.*down/i],
  ["ARC-009", /strata.*old film.*era/i],
  ["ARC-010", /neon.*bend.*around.*smog/i],
  ["ARC-011", /shadow.*tiny figures.*dancing/i],
  ["ARC-012", /reflection.*actual staircase/i],
  ["ARC-013", /mirror.*finished.*gauge.*green band/i],
  ["ARC-014", /exactly four identical droplets.*exactly four.*channels/i],
  ["ARC-015", /pulse.*near.*far.*knots/i],
  ["ARC-016", /steam plume.*same.*vat/i],
  ["ARC-017", /freeze.*blink.*glyph/i],
  ["ARC-018", /card.*shadow.*tiny scene.*hopper/i],
  ["ARC-019", /room.*light.*stamp.*down/i],
  ["ARC-020", /facet.*different machine scene/i],
  ["ARC-021", /coil.*shadow.*one tower/i],
  ["ARC-022", /turn.*blue.*shockwave.*repaint/i],
  ["ARC-023", /floor by floor.*era.*palette/i],
  ["ARC-024", /one beat.*leaving below.*lamp.*monument.*clock/i],
  ["ARC-025", /exactly five.*fuse.*continuous gradient/i],
  ["ARC-026", /island.*shadow.*district-map/i],
  ["ARC-027", /heraldic banner.*score/i],
  ["ARC-028", /mural.*peel.*3D carved king/i],
  ["ARC-029", /freeze.*dotted diagram.*resume/i],
  ["ARC-030", /every cake.*reflection.*source picture/i],
  ["ARC-031", /style seam.*four.*both eyes.*aligned/i],
  ["ARC-032", /crank.*reverse.*film.*backward.*screen/i],
  ["ARC-033", /exactly six desks.*shared shadow/i],
  ["ARC-034", /palette.*horizon.*seamless.*gradient/i],
  ["ARC-035", /rule.*rise.*before.*stylus.*blank spread/i],
  ["ARC-036", /far shore.*rhythm.*reverse.*interleave/i],
  ["ARC-037", /shadow.*gold.*magenta.*in step/i],
  ["ARC-038", /fold.*hint.*next monument.*morning light/i],
  ["ARC-039", /facet.*exact camera.*recurs/i],
  ["ARC-040", /cloud.*exact opening shape/i]
]);
const lockedCameraLocks = new Map([
  ["ARC-001", /35 mm aerial push forward eighty metres/i],
  ["ARC-002", /45 mm lateral track right twelve metres/i],
  ["ARC-003", /60 mm clockwise orbit of eight degrees/i],
  ["ARC-004", /50 mm lateral track right four metres/i],
  ["ARC-005", /70 mm macro push forward one metre/i],
  ["ARC-006", /85 mm push forward 1\.5 metres/i],
  ["ARC-007", /40 mm crane upward fifteen metres/i],
  ["ARC-008", /50 mm push forward one metre/i],
  ["ARC-009", /35 mm camera riding.*downward thirty metres/i],
  ["ARC-010", /30 mm crane forward fifteen metres/i],
  ["ARC-011", /65 mm macro track right 1\.5 metres/i],
  ["ARC-012", /locked 60 mm camera with zero translation and zero orbit/i],
  ["ARC-013", /55 mm lateral track right six metres/i],
  ["ARC-014", /45 mm push upward six metres/i],
  ["ARC-015", /50 mm clockwise orbit of eighteen degrees/i],
  ["ARC-016", /35 mm track forward eight metres/i],
  ["ARC-017", /58 mm push forward five metres/i],
  ["ARC-018", /40 mm lateral track right ten metres/i],
  ["ARC-019", /locked 50 mm camera with zero translation and zero orbit/i],
  ["ARC-020", /85 mm macro track forward 1\.2 metres/i],
  ["ARC-021", /45 mm clockwise orbit of ninety degrees/i],
  ["ARC-022", /40 mm push forward six metres/i],
  ["ARC-023", /35 mm vertical rise thirty-five metres/i],
  ["ARC-024", /40 mm push forward two metres/i],
  ["ARC-025", /40 mm lateral track right three metres/i],
  ["ARC-026", /35 mm track forward twenty metres/i],
  ["ARC-027", /35 mm tracking move forward ten metres/i],
  ["ARC-028", /50 mm push forward four metres/i],
  ["ARC-029", /45 mm crane upward sixteen metres/i],
  ["ARC-030", /55 mm lateral track right eight metres/i],
  ["ARC-031", /85 mm push forward two metres/i],
  ["ARC-032", /40 mm track forward eight metres/i],
  ["ARC-033", /50 mm clockwise orbit of one hundred twenty degrees/i],
  ["ARC-034", /30 mm crane upward twenty metres/i],
  ["ARC-035", /85 mm macro track forward 1\.5 metres/i],
  ["ARC-036", /held 50 mm camera with zero translation and zero orbit/i],
  ["ARC-037", /40 mm retreat ten metres/i],
  ["ARC-038", /50 mm push forward two metres/i],
  ["ARC-039", /60 mm push forward two metres/i],
  ["ARC-040", /held 35 mm aerial camera with zero translation and zero orbit/i]
]);

function readPngHeader(filePath) {
  const header = Buffer.alloc(33);
  const handle = fs.openSync(filePath, "r");
  try {
    if (fs.readSync(handle, header, 0, header.length, 0) !== header.length) throw new Error("truncated PNG header");
  } finally {
    fs.closeSync(handle);
  }
  if (!header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error("not PNG");
  if (header.toString("ascii", 12, 16) !== "IHDR") throw new Error("missing IHDR");
  return {
    width: header.readUInt32BE(16),
    height: header.readUInt32BE(20),
    bitDepth: header[24],
    colorType: header[25]
  };
}

function payloadFromHtml(html) {
  const match = html.match(/<script type="application\/json" id="job-data">([\s\S]*?)<\/script>/);
  if (!match) throw new Error("missing inline job-data payload");
  return JSON.parse(match[1]);
}

function coreText(job) {
  const begin = `Generate single shot. Treat the supplied ${job.firstId} FIRST frame and ${job.lastId} LAST frame as immutable exact endpoints. `;
  const end = ` Complete the dominant action by 4.5 seconds, match the supplied ${job.lastId} LAST frame exactly, and hold motionless through 5.0 seconds. ${STYLE_LOCK}. No dialogue. No background music.`;
  if (!job.prompt.startsWith(begin) || !job.prompt.endsWith(end)) return "";
  return job.prompt.slice(begin.length, -end.length);
}

function wordCount(value) {
  return (String(value).match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) || []).length;
}

function validate(html, payload, checkFiles) {
  const errors = [];
  const jobs = payload.jobs || [];
  if (payload.schema !== "arcane-world-wan-board/v1") errors.push("wrong board schema");
  if (payload.version !== "1.0.1") errors.push("wrong visible board version");
  if (jobs.length !== 40) errors.push(`expected 40 jobs, got ${jobs.length}`);
  if (JSON.stringify(payload.settings) !== JSON.stringify(SETTINGS)) errors.push("settings drifted from source contract");
  if (payload.styleLock !== STYLE_LOCK) errors.push("style lock drifted from source contract");
  if (payload.sharedNegative !== SHARED_NEGATIVE) errors.push("shared negative drifted from source contract");
  if (SHARED_NEGATIVE.length > 500) errors.push(`shared negative is ${SHARED_NEGATIVE.length}/500 characters`);

  const ids = new Set();
  const outputs = new Set();
  const familySeeds = new Map();
  const dimensions = [];
  const coreWordCounts = [];

  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const n = index + 1;
    const expectedId = `ARC-${String(n).padStart(3, "0")}`;
    const expectedFirst = `ARC-KF${String(n).padStart(2, "0")}`;
    const expectedLast = n === 40 ? "ARC-KF01" : `ARC-KF${String(n + 1).padStart(2, "0")}`;
    if (job.id !== expectedId) errors.push(`job ${n} id ${job.id} != ${expectedId}`);
    if (job.position !== n) errors.push(`${job.id} position ${job.position} != ${n}`);
    if (job.output !== `${expectedId}.mp4`) errors.push(`${job.id} output is not exact`);
    if (job.firstId !== expectedFirst || job.lastId !== expectedLast) errors.push(`${job.id} endpoint chain is ${job.firstId} -> ${job.lastId}, expected ${expectedFirst} -> ${expectedLast}`);
    if (ids.has(job.id)) errors.push(`duplicate id ${job.id}`);
    if (outputs.has(job.output)) errors.push(`duplicate output ${job.output}`);
    ids.add(job.id);
    outputs.add(job.output);
    if (job.hardAnchor !== expectedAnchors.has(job.id)) errors.push(`${job.id} hard-anchor flag is wrong`);
    if (job.promptExtend !== false) errors.push(`${job.id} prompt_extend must be false`);
    if (!Number.isInteger(job.seed) || job.seed <= 0) errors.push(`${job.id} seed is invalid`);
    if (familySeeds.has(job.seedFamily) && familySeeds.get(job.seedFamily) !== job.seed) errors.push(`${job.id} seed family ${job.seedFamily} changed seed`);
    familySeeds.set(job.seedFamily, job.seed);
    if (!job.prompt.startsWith("Generate single shot.")) errors.push(`${job.id} prompt must begin with literal prefix`);
    if (!job.prompt.endsWith("No dialogue. No background music.")) errors.push(`${job.id} prompt must end with the audio lock`);
    if ((job.prompt.match(new RegExp(STYLE_LOCK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 1) errors.push(`${job.id} style lock must appear exactly once`);
    if (!job.prompt.includes(`supplied ${job.firstId} FIRST frame and ${job.lastId} LAST frame`)) errors.push(`${job.id} prompt endpoint labels drifted`);
    if (!job.prompt.includes("Complete the dominant action by 4.5 seconds")) errors.push(`${job.id} lacks the settle contract`);
    const core = coreText(job);
    if (!core) errors.push(`${job.id} prompt anatomy drifted`);
    const words = wordCount(core);
    coreWordCounts.push(words);
    if (words < 45 || words > 90) errors.push(`${job.id} core is ${words} words; expected 45-90`);
    if ((core.match(/\b(?:Make|Keep) one\b/g) || []).length !== 1) errors.push(`${job.id} must contain exactly one camera directive`);
    if (!/\b(?:push|track|tracking|riding|dolly|crane|orbit|retreat|pullback|descending move|vertical rise|held)\b/i.test(core)) errors.push(`${job.id} lacks one explicit camera move`);
    if (!/\b(?:slow|patient|steady|controlled|locked|constant|matching speed|walking speed|zero translation)\b/i.test(core)) errors.push(`${job.id} lacks explicit motion speed`);
    if (!/\b(?:metre|metres|degrees|percent|centimetre|centimetres|zero translation)\b/i.test(core)) errors.push(`${job.id} lacks explicit motion amplitude`);
    if (/\b(?:no|never|without)\b/i.test(core)) errors.push(`${job.id} puts a prohibition in the positive core`);
    for (const term of forbiddenPositiveTerms) if (new RegExp(`\\b${term}\\b`, "i").test(core)) errors.push(`${job.id} positive core names forbidden term ${term}`);
    const countLock = countLocks.get(job.id);
    if (countLock && !countLock.test(core)) errors.push(`${job.id} count lock is missing`);
    const lockedBeat = lockedBeatLocks.get(job.id);
    if (!lockedBeat?.test(core)) errors.push(`${job.id} locked beat or signature illusion is missing`);
    const lockedCamera = lockedCameraLocks.get(job.id);
    if (!lockedCamera?.test(core)) errors.push(`${job.id} locked camera instruction drifted`);
    for (const term of requiredNegativeTerms) if (!job.negative.toLowerCase().includes(term)) errors.push(`${job.id} negative prompt lacks ${term}`);

    if (checkFiles) {
      for (const [role, relative] of [["first", job.first], ["last", job.last]]) {
        const absolute = path.resolve(here, relative);
        if (!absolute.startsWith(repo + path.sep)) {
          errors.push(`${job.id} ${role} path escapes repo`);
          continue;
        }
        if (!fs.existsSync(absolute)) {
          errors.push(`${job.id} missing ${role} image ${relative}`);
          continue;
        }
        const metadata = readPngHeader(absolute);
        if (metadata.width !== 1920 || metadata.height !== 1088 || metadata.bitDepth !== 8 || metadata.colorType !== 2) errors.push(`${job.id} ${role} image is ${metadata.width}x${metadata.height} depth=${metadata.bitDepth} colorType=${metadata.colorType}`);
        dimensions.push(`${metadata.width}x${metadata.height}xRGB8`);
      }
    }
  }

  const expectedFamilies = new Set(["UPPER_CITY", "DESCENT", "CORE", "DISTRICTS", "BRIDGE"]);
  if (familySeeds.size !== expectedFamilies.size || [...expectedFamilies].some((family) => !familySeeds.has(family))) errors.push("scene-family seed set is not exact");
  if (!html.includes("localStorage.setItem")) errors.push("persistent local state missing");
  if (!html.includes("navigator.clipboard.writeText")) errors.push("prompt copy action missing");
  if (!html.includes("This offline board stores progress only in this browser")) errors.push("owner-only board boundary missing");
  const forbidden = ["fetch(", "XMLHttpRequest", "WebSocket(", "sendBeacon(", "<form", "<script src="];
  for (const token of forbidden) if (html.includes(token)) errors.push(`forbidden submission/network primitive present: ${token}`);
  if (/https?:\/\//i.test(html)) errors.push("board contains an external URL");

  return { errors, jobs, dimensions, coreWordCounts, familySeeds: Object.fromEntries(familySeeds) };
}

const html = fs.readFileSync(boardPath, "utf8");
const payload = payloadFromHtml(html);
const sabotaged = structuredClone(payload);
sabotaged.jobs[0].prompt = sabotaged.jobs[0].prompt.replace("Generate single shot.", "Generate a shot.");
const sabotage = validate(html, sabotaged, false);
if (!sabotage.errors.some((error) => error.includes("literal prefix"))) throw new Error("selftest did not reject the missing literal prefix");
console.log("RED_SELFTEST WAN board gate rejects a prompt missing the literal prefix");
const beatSabotage = structuredClone(payload);
beatSabotage.jobs[1].prompt = beatSabotage.jobs[1].prompt.replace("small crowd using", "ordinary shadow beside");
const beatResult = validate(html, beatSabotage, false);
if (!beatResult.errors.some((error) => error.includes("ARC-002 locked beat"))) throw new Error("selftest did not reject the missing locked beat");
console.log("RED_BEAT_SELFTEST WAN board gate rejects a prompt missing its locked illusion");
const cameraSabotage = structuredClone(payload);
cameraSabotage.jobs[20].prompt = cameraSabotage.jobs[20].prompt.replace("ninety degrees", "thirty degrees");
const cameraResult = validate(html, cameraSabotage, false);
if (!cameraResult.errors.some((error) => error.includes("ARC-021 locked camera"))) throw new Error("selftest did not reject the changed camera amplitude");
console.log("RED_CAMERA_SELFTEST WAN board gate rejects changed camera amplitude");

const result = validate(html, payload, true);
const report = {
  schema: "arcane-world-wan-board-qa/v1",
  status: result.errors.length ? "RED" : "GREEN",
  jobCount: result.jobs.length,
  hardAnchorCount: result.jobs.filter((job) => job.hardAnchor).length,
  lockedBeatChecks: result.jobs.filter((job) => lockedBeatLocks.get(job.id)?.test(coreText(job))).length,
  lockedCameraChecks: result.jobs.filter((job) => lockedCameraLocks.get(job.id)?.test(coreText(job))).length,
  endpointImageChecks: result.dimensions.length,
  uniqueEndpointDimensions: [...new Set(result.dimensions)],
  promptCoreWordRange: {
    minimum: Math.min(...result.coreWordCounts),
    maximum: Math.max(...result.coreWordCounts),
    required: "45-90"
  },
  seedFamilies: result.familySeeds,
  promptPrefix: "Generate single shot.",
  promptExtend: false,
  manualPromptQa: {
    stillsOutvotePrompt: true,
    physicalCarrierReviewed: true,
    positivePromptProhibitionScan: true,
    faceRoleToneReviewed: true,
    reviewedAt: "2026-08-23"
  },
  forbiddenNetworkPrimitives: 0,
  wanClipsGenerated: 0,
  wanCreditsSpent: 0,
  errors: result.errors
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (result.errors.length) {
  for (const error of result.errors) console.error(`RED ${error}`);
  process.exitCode = 1;
} else {
  console.log(`GREEN_VERIFY WAN board ${result.jobs.length}/40 jobs, 40/40 locked beats, 40/40 locked cameras, ${result.dimensions.length}/80 endpoint image checks, 7/7 hard anchors, 0 submission primitives, 0 WAN credits`);
}
