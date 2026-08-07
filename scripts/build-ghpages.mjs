// `DEPLOY_TARGET=ghpages astro build` is POSIX shell syntax. npm runs scripts
// through cmd.exe on Windows regardless of which shell invoked npm, and cmd
// reads `DEPLOY_TARGET=ghpages` as a command name:
//
//   'DEPLOY_TARGET' is not recognized as an internal or external command
//
// So the GitHub Pages build could not be produced on the machine it ships
// from. Setting the variable in-process and spawning the build keeps it
// working on every platform without adding a cross-env dependency.
import { spawn } from 'node:child_process';

const proc = spawn('npx', ['astro', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DEPLOY_TARGET: 'ghpages' },
});
proc.on('exit', (code) => process.exit(code ?? 1));
