import { execFileSync } from 'node:child_process';

import { type StagedBundle } from './types.js';

/**
 * Read the staged git bundle used by commit-queue verification.
 */
export function getStagedBundle(repoRoot: string): StagedBundle {
  return {
    stagedNameOnly: runGit(repoRoot, ['diff', '--cached', '--name-only']),
    stagedNameStatus: runGit(repoRoot, ['diff', '--cached', '--name-status']),
    stagedPatch: runGit(repoRoot, ['diff', '--cached', '--full-index', '--binary']),
  };
}

function runGit(repoRoot: string, args: readonly string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
