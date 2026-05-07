#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

import { runBranchTouchedFilesCli } from '../branch-touched-files/cli.js';

process.exitCode = runBranchTouchedFilesCli({
  args: process.argv.slice(2),
  repoRoot: resolveRepoRoot(),
});

function resolveRepoRoot(): string {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
