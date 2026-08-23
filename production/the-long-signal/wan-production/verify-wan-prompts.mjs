import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildJobs, SHARED_NEGATIVE, STYLE_LOCK } from "./wan-jobs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const planPath = path.join(repo, "public/worlds/assets/signal/prompts/keyframe-plan.json");
const reviewPath = path.join(repo, "public/worlds/assets/signal/review");
const captureFailFirst = process.argv.includes("--capture-fail-first");
const reportPath = path.join(reviewPath, captureFailFirst ? "fail-first-wan-prompt-qa.json" : "wan-prompt-qa.json");

const REQUIRED_BRIDGES = new Map([
  ["SIG-001", "dust curtain"],
  ["SIG-005", "tarp wipe"],
  ["SIG-006", "visor reflection"],
  ["SIG-010", "iris wipe"],
  ["SIG-012", "viewport-rim wipe"],
  ["SIG-016", "cloud-deck wipe"],
  ["SIG-017", "hatch wipe"],
  ["SIG-018", "hatch wipe"],
  ["SIG-019", "foliage wipe"],
  ["SIG-022", "cloud wipe"],
  ["SIG-024", "vapor wipe"],
  ["SIG-025", "dome-glass wipe"],
  ["SIG-026", "hull wipe"],
  ["SIG-027", "viewport-rim wipe"],
  ["SIG-028", "hull wipe"],
  ["SIG-033", "slate wipe"],
  ["SIG-036", "dust curtain"]
]);

const FORBIDDEN_POSITIVE = /\b(no|never|without|avoid|exclude|nothing|zero|unintended|extra|morph(?:ing)?|warp(?:ing)?|flicker|jitter|dissolve|crossfade|cut|text|captions?|subtitles?|watermark|logos?)\b/i;
const AUDIO_LOCK = "No dialogue. No background music.";
const ENDPOINT_LOCK = "Begin on Image 1.";
const LANDING_LOCK = "End on Image 2 by 4.5 seconds and hold.";
const CAMERA_VERBS = /\b(pushes|tracks|trucks|dollies|cranes|orbits|drifts|pulls|pans|pitches|holds|remains fixed)\b/gi;
const REQUIRED_NEGATIVE = ["blur", "watermark", "captions", "text", "extra limbs", "morphing", "flicker", "unintended cut", "dissolve", "crossfade", "camera teleportation"];

const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;

export function validatePromptJobs(jobs) {
  const errors = [];
  const counts = [];
  let cleanPositiveCount = 0;
  let bridgeCount = 0;

  if (jobs.length !== 40) errors.push(`expected 40 jobs, got ${jobs.length}`);
  if (SHARED_NEGATIVE.length > 500) errors.push(`shared negative is ${SHARED_NEGATIVE.length}/500 characters`);
  for (const term of REQUIRED_NEGATIVE) {
    if (!SHARED_NEGATIVE.toLowerCase().includes(term)) errors.push(`shared negative lacks ${term}`);
  }

  for (const job of jobs) {
    const count = wordCount(job.prompt);
    counts.push(count);
    if (count < 45 || count > 90) errors.push(`${job.id} prompt is ${count} words; expected 45-90`);
    if (!job.prompt.startsWith(`Generate single shot. ${ENDPOINT_LOCK}`)) errors.push(`${job.id} lacks the exact single-shot and Image 1 opening lock`);
    if (!job.prompt.includes(LANDING_LOCK)) errors.push(`${job.id} lacks the exact Image 2 landing lock`);
    if (!job.prompt.endsWith(`${STYLE_LOCK}. ${AUDIO_LOCK}`)) errors.push(`${job.id} style/audio lock drifted`);
    if ((job.prompt.match(/\bCamera\b/g) || []).length !== 1) errors.push(`${job.id} must contain exactly one Camera sentence`);
    if ((job.camera?.match(CAMERA_VERBS) || []).length !== 1) errors.push(`${job.id} camera field must contain exactly one move`);
    if (!job.motion || !job.camera) errors.push(`${job.id} must expose separate motion and camera fields`);

    const positiveWithoutAudio = job.prompt.replace(AUDIO_LOCK, "");
    const forbidden = positiveWithoutAudio.match(FORBIDDEN_POSITIVE);
    if (forbidden) errors.push(`${job.id} positive prompt contains negative-control term ${forbidden[0]}`);
    else cleanPositiveCount += 1;

    const requiredBridge = REQUIRED_BRIDGES.get(job.id);
    if (requiredBridge) {
      if (!job.bridgeRequired) errors.push(`${job.id} must be marked bridgeRequired`);
      if (job.bridge !== requiredBridge) errors.push(`${job.id} bridge is ${job.bridge || "missing"}; expected ${requiredBridge}`);
      if (!job.prompt.toLowerCase().includes(requiredBridge)) errors.push(`${job.id} prompt does not name its physical bridge ${requiredBridge}`);
      else bridgeCount += 1;
    } else if (job.bridgeRequired || job.bridge) {
      errors.push(`${job.id} carries an unapproved bridge`);
    }
  }

  return {
    errors,
    counts,
    cleanPositiveCount,
    bridgeCount
  };
}

function main() {
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const jobs = buildJobs(plan.frames);

const selftests = [];
const overlong = structuredClone(jobs);
overlong[0].prompt += ` ${"detail ".repeat(100)}`;
selftests.push(validatePromptJobs(overlong).errors.some((error) => error.includes("expected 45-90")));
const negativeLeak = structuredClone(jobs);
negativeLeak[1].prompt = negativeLeak[1].prompt.replace(AUDIO_LOCK, `Never cut. ${AUDIO_LOCK}`);
selftests.push(validatePromptJobs(negativeLeak).errors.some((error) => error.includes("negative-control term")));
const missingBridge = structuredClone(jobs);
missingBridge[0].bridge = null;
selftests.push(validatePromptJobs(missingBridge).errors.some((error) => error.includes("expected dust curtain")));
const doubleCamera = structuredClone(jobs);
doubleCamera[2].prompt = doubleCamera[2].prompt.replace(LANDING_LOCK, `Camera orbits slowly. ${LANDING_LOCK}`);
selftests.push(validatePromptJobs(doubleCamera).errors.some((error) => error.includes("exactly one Camera sentence")));
if (selftests.some((passed) => !passed)) throw new Error("prompt-QA selftest did not reject every sabotage");
console.log("RED_SELFTEST prompt QA rejects overlength, negative leakage, missing bridge, and double-camera sabotage");

const result = validatePromptJobs(jobs);
const report = {
  schema: "the-long-signal-wan-prompt-qa/v1",
  status: result.errors.length ? "RED" : "GREEN",
  jobCount: jobs.length,
  wordRange: result.counts.length ? [Math.min(...result.counts), Math.max(...result.counts)] : [],
  cleanPositivePrompts: result.cleanPositiveCount,
  physicalBridgeJobs: result.bridgeCount,
  negativePromptCharacters: SHARED_NEGATIVE.length,
  promptExtend: false,
  wanCreditsSpent: 0,
  errors: result.errors
};
fs.mkdirSync(reviewPath, { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (result.errors.length) {
  console.error(`RED_PROMPT_QA ${result.errors.length} failures; ${result.cleanPositiveCount}/40 clean positives; word range ${report.wordRange.join("-")}`);
  for (const error of result.errors.slice(0, 12)) console.error(`RED ${error}`);
  if (result.errors.length > 12) console.error(`RED ... ${result.errors.length - 12} more failures in ${path.basename(reportPath)}`);
  process.exitCode = 1;
} else {
  console.log(`GREEN_PROMPT_QA 40/40 prompts, ${report.wordRange.join("-")} words, 40/40 clean positives, 17/17 physical bridges, ${SHARED_NEGATIVE.length}/500 negative characters, 0 WAN credits`);
}
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
