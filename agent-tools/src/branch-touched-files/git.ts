import { execFileSync } from 'node:child_process';

import { createBranchTouchedFileReport, type BranchTouchedFileReport } from './index.js';

export interface ReadBranchTouchedFileReportOptions {
  readonly repoRoot: string;
  readonly baseRef: string;
  readonly headRef: string;
}

export function readBranchTouchedFileReport(
  options: ReadBranchTouchedFileReportOptions,
): BranchTouchedFileReport {
  const mergeBase = git(options.repoRoot, ['merge-base', options.baseRef, options.headRef]);
  const files = git(options.repoRoot, ['diff', '--name-only', `${mergeBase}..${options.headRef}`])
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return createBranchTouchedFileReport({
    baseRef: options.baseRef,
    headRef: options.headRef,
    mergeBase,
    files,
  });
}

function git(repoRoot: string, args: readonly string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
