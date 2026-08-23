#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const verifier = path.join(__dirname, 'verify-strings-wan-board-browser.py');
const result = spawnSync('python', [verifier, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exitCode = result.status === null ? 1 : result.status;
