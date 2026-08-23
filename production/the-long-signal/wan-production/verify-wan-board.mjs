import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { SETTINGS, SHARED_NEGATIVE, STYLE_LOCK } from "./wan-jobs.mjs";
import { validatePromptJobs } from "./verify-wan-prompts.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const boardPath = path.join(here, "WAN-GENERATION-BOARD.html");
const reportPath = path.join(repo, "public/worlds/assets/signal/review/wan-board-qa.json");
const approvalPath = path.join(repo, "public/worlds/assets/signal/review/phase1-approval-gate.json");
const expectedAnchors = new Set(["SIG-001", "SIG-008", "SIG-016", "SIG-022", "SIG-026", "SIG-034", "SIG-040"]);
const requiredNegativeTerms = ["blur", "watermark", "captions", "extra limbs", "morphing", "flicker", "unintended cut"];

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

async function validate(html, payload, checkFiles) {
  const errors = [];
  const jobs = payload.jobs || [];
  if (payload.schema !== "the-long-signal-wan-board/v1") errors.push("wrong board schema");
  if (payload.version !== "1.1.0") errors.push("wrong visible board version");
  if (jobs.length !== 40) errors.push(`expected 40 jobs, got ${jobs.length}`);
  if (JSON.stringify(payload.settings) !== JSON.stringify(SETTINGS)) errors.push("settings drifted from source contract");
  if (payload.styleLock !== STYLE_LOCK) errors.push("style lock drifted from source contract");
  if (payload.sharedNegative !== SHARED_NEGATIVE) errors.push("shared negative drifted from source contract");

  const ids = new Set();
  const outputs = new Set();
  const familySeeds = new Map();
  const dimensions = [];

  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const n = index + 1;
    const expectedId = `SIG-${String(n).padStart(3, "0")}`;
    const expectedFirst = `KF${String(n).padStart(2, "0")}`;
    const expectedLast = n === 40 ? "KF01" : `KF${String(n + 1).padStart(2, "0")}`;
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

  const expectedFamilies = new Set(["DUST", "CROSSING", "WORLDS", "LATTICE", "RETURN"]);
  if (familySeeds.size !== expectedFamilies.size || [...expectedFamilies].some((family) => !familySeeds.has(family))) errors.push("scene-family seed set is not exact");
  const promptQa = validatePromptJobs(jobs);
  for (const error of promptQa.errors) errors.push(`prompt QA: ${error}`);
  if (!html.includes("localStorage.setItem")) errors.push("persistent local state missing");
  if (!html.includes("navigator.clipboard.writeText")) errors.push("prompt copy action missing");
  if (!html.includes("This offline board stores progress only in this browser")) errors.push("owner-only board boundary missing");
  const forbidden = ["fetch(", "XMLHttpRequest", "WebSocket(", "sendBeacon(", "<form", "<script src="];
  for (const token of forbidden) if (html.includes(token)) errors.push(`forbidden submission/network primitive present: ${token}`);
  if (/https?:\/\//i.test(html)) errors.push("board contains an external URL");

  return { errors, jobs, dimensions, familySeeds: Object.fromEntries(familySeeds), promptQa };
}

const html = fs.readFileSync(boardPath, "utf8");
const payload = payloadFromHtml(html);
const sabotaged = structuredClone(payload);
sabotaged.jobs[0].prompt = sabotaged.jobs[0].prompt.replace("Generate single shot.", "Generate a shot.");
const sabotage = await validate(html, sabotaged, false);
if (!sabotage.errors.some((error) => error.includes("literal prefix"))) throw new Error("selftest did not reject the missing literal prefix");
console.log("RED_SELFTEST WAN board gate rejects a prompt missing the literal prefix");

const result = await validate(html, payload, true);
const approval = JSON.parse(fs.readFileSync(approvalPath, "utf8"));
const boardHash = createHash("sha256").update(fs.readFileSync(boardPath)).digest("hex");
if (approval.ownerGenerationBoard?.version !== payload.version) result.errors.push("approval gate board version drifted");
if (approval.ownerGenerationBoard?.sha256 !== boardHash) result.errors.push("approval gate board hash drifted");
if (approval.ownerGenerationBoard?.cleanPositivePrompts !== 40) result.errors.push("approval gate clean-positive count drifted");
if (approval.ownerGenerationBoard?.physicalBridgeJobs !== 17) result.errors.push("approval gate physical-bridge count drifted");
const report = {
  schema: "the-long-signal-wan-board-qa/v1",
  status: result.errors.length ? "RED" : "GREEN",
  jobCount: result.jobs.length,
  hardAnchorCount: result.jobs.filter((job) => job.hardAnchor).length,
  endpointImageChecks: result.dimensions.length,
  uniqueEndpointDimensions: [...new Set(result.dimensions)],
  seedFamilies: result.familySeeds,
  promptPrefix: "Generate single shot.",
  promptWordRange: [Math.min(...result.promptQa.counts), Math.max(...result.promptQa.counts)],
  cleanPositivePrompts: result.promptQa.cleanPositiveCount,
  physicalBridgeJobs: result.promptQa.bridgeCount,
  approvalGateBoardHash: boardHash,
  promptExtend: false,
  forbiddenNetworkPrimitives: 0,
  wanCreditsSpent: 0,
  errors: result.errors
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (result.errors.length) {
  for (const error of result.errors) console.error(`RED ${error}`);
  process.exitCode = 1;
} else {
  console.log(`GREEN_VERIFY WAN board ${result.jobs.length}/40 jobs, ${result.dimensions.length}/80 endpoint image checks, 40/40 prompt QA, 17/17 physical bridges, 7/7 hard anchors, 0 submission primitives, 0 WAN credits`);
}
