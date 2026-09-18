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

// Which project site this build is for. The default is the original, so
// `npm run build:ghpages` with no argument still produces exactly the site that
// has been shipping; a second Pages project passes its own root:
//
//   node scripts/build-ghpages.mjs --base /flagship-portfolio-v2
const flag = process.argv.indexOf('--base');
const base = flag > -1 ? process.argv[flag + 1] : process.env.GH_PAGES_BASE;
// Everything that is not --base goes straight to astro, so a second site can
// be built into its own directory without disturbing the first one's:
//   node scripts/build-ghpages.mjs --base /flagship-portfolio-v2 --outDir dist-v2
const passthrough = process.argv.slice(2)
  .filter((_, i, all) => flag === -1 || (i + 2 !== flag && i + 2 !== flag + 1));

const proc = spawn('npx', ['astro', 'build', ...passthrough], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DEPLOY_TARGET: 'ghpages',
    ...(base ? { GH_PAGES_BASE: base } : {}),
  },
});
proc.on('exit', (code) => process.exit(code ?? 1));
