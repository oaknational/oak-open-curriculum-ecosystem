#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

import { parseCommitQueueArgs, runCommitQueueCli } from '../commit-queue/index.js';

runCommitQueueCli({
  ...parseCommitQueueArgs(process.argv.slice(2)),
  repoRoot: resolveRepoRoot(),
})
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  });

function resolveRepoRoot(): string {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
