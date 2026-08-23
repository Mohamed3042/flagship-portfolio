import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shellGate = path.join(root, 'scripts', 'verify-cake-studio-v17-shell.mjs');
const sabotage = process.argv.includes('--sabotage');

const result = spawnSync(process.execPath, [shellGate], {
  cwd: root,
  encoding: 'utf8',
  env: sabotage ? { ...process.env, CAKE_STUDIO_V18_SABOTAGE: '1' } : process.env,
});

process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');

if (result.status !== 0) process.exit(result.status ?? 1);
if (sabotage) {
  console.error('CAKE_STUDIO_BOOKENDS_FAIL sabotage unexpectedly passed');
  process.exit(1);
}

console.log('CAKE_STUDIO_BOOKENDS_PASS contract=v1.8 direct_video_slots=6 anchor_slots=2 reel_shots=50');
