import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildJobs, SETTINGS, SHARED_NEGATIVE, STYLE_LOCK } from "./wan-jobs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const planPath = path.join(repo, "public/worlds/assets/signal/prompts/keyframe-plan.json");
const templatePath = path.join(here, "board-template.html");
const boardPath = path.join(here, "WAN-GENERATION-BOARD.html");
const manifestPath = path.join(here, "RUN-MANIFEST.csv");

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const jobs = buildJobs(plan.frames);
if (jobs.length !== 40) throw new Error(`expected 40 jobs, got ${jobs.length}`);

const payload = JSON.stringify({
  schema: "the-long-signal-wan-board/v1",
  version: "1.0.0",
  project: "THE LONG SIGNAL",
  settings: SETTINGS,
  styleLock: STYLE_LOCK,
  sharedNegative: SHARED_NEGATIVE,
  jobs
}, null, 2).replaceAll("<", "\\u003c");

const template = fs.readFileSync(templatePath, "utf8");
if (!template.includes("__JOB_DATA__")) throw new Error("board template is missing __JOB_DATA__");
fs.writeFileSync(boardPath, template.replace("__JOB_DATA__", payload));

const quoteCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const header = [
  "clip", "act", "first", "last", "seed_family", "recommended_seed", "seed_used",
  "task_id", "status", "attempts", "credits", "file", "prompt", "notes"
];
const rows = jobs.map((job) => [
  job.id, `ACT ${job.act} - ${job.actTitle}`, job.firstId, job.lastId, job.seedFamily,
  job.seed, "", "", "pending", 0, 0, job.output, job.prompt, ""
].map(quoteCsv).join(","));
fs.writeFileSync(manifestPath, `${header.map(quoteCsv).join(",")}\n${rows.join("\n")}\n`);

console.log(`GREEN_BUILD WAN board ${jobs.length}/40 cards; manifest ${rows.length}/40 rows`);

