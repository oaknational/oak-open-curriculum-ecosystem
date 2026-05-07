#!/usr/bin/env node
import { runBranchTouchedFilesCli } from '../branch-touched-files/cli.js';
import { readGitStdout } from '../branch-touched-files/git.js';

process.exitCode = runBranchTouchedFilesCli({
  args: process.argv.slice(2),
  repoRoot: resolveRepoRoot(),
});

function resolveRepoRoot(): string {
  return readGitStdout({
    repoRoot: process.cwd(),
    args: ['rev-parse', '--show-toplevel'],
  }).trim();
}
