import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getStagedBundle } from '../src/commit-queue/git';

/**
 * Rename-representability smoke — `getStagedBundle` must report a staged rename as its
 * deletion AND its addition (`--no-renames`), never a collapsed `R` pair: the
 * verify-staged comparison is exact against the intent file list, and the pathspec
 * commit needs the deletion side or its temporary index still tracks a file the
 * worktree no longer has (worked instance: every tracked-file validator crashed
 * mid-hook on the phantom). Real git process IO makes this a smoke rather than an
 * in-process Vitest suite (testing-strategy: no process spawning in in-process tests);
 * the package's test:e2e script keeps it in the full gate. That boundary is pre-push +
 * CI, not per-commit (the relocation trades the old every-commit vitest run for
 * doctrine compliance — a regression still cannot leave the machine), and the test:e2e
 * wiring is review-enforced in package.json, matching the sibling smokes.
 */

function git(cwd: string, ...args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' });
}

const repo = await mkdtemp(path.join(tmpdir(), 'commit-queue-git-'));
try {
  git(repo, 'init');
  git(repo, 'config', 'user.email', 'test@example.com');
  git(repo, 'config', 'user.name', 'Test');
  git(repo, 'config', 'commit.gpgsign', 'false');
  await writeFile(path.join(repo, 'old-name.ts'), 'export const value = 1;\n', 'utf8');
  git(repo, 'add', 'old-name.ts');
  git(repo, 'commit', '-m', 'seed');
  git(repo, 'mv', 'old-name.ts', 'new-name.ts');

  const bundle = getStagedBundle({ gitRoot: repo, pathspec: ['old-name.ts', 'new-name.ts'] });

  const names = new Set(bundle.stagedNameOnly.split('\n').filter(Boolean));
  assert.ok(names.has('old-name.ts'), 'deletion side must be visible in staged names');
  assert.ok(names.has('new-name.ts'), 'addition side must be visible in staged names');
  assert.ok(!/^R/mu.test(bundle.stagedNameStatus), 'no collapsed rename rows');
  assert.match(bundle.stagedNameStatus, /^D\told-name\.ts$/mu);
  assert.match(bundle.stagedNameStatus, /^A\tnew-name\.ts$/mu);
  process.stdout.write('commit-queue-git-rename smoke green\n');
} finally {
  await rm(repo, { recursive: true, force: true });
}
