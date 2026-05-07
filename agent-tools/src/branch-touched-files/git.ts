import { execFileSync } from 'node:child_process';
import type { ExecFileSyncOptionsWithStringEncoding } from 'node:child_process';
import path from 'node:path';

import { createBranchTouchedFileReport, type BranchTouchedFileReport } from './index.js';

export type GitCommandExecutor = (
  file: string,
  args: readonly string[],
  options: ExecFileSyncOptionsWithStringEncoding,
) => string;

export interface ReadBranchTouchedFileReportOptions {
  readonly repoRoot: string;
  readonly baseRef: string;
  readonly headRef: string;
  readonly execFileSync?: GitCommandExecutor;
  readonly gitPath?: string;
}

export interface ReadGitStdoutOptions {
  readonly repoRoot: string;
  readonly args: readonly string[];
  readonly execFileSync?: GitCommandExecutor;
  readonly gitPath?: string;
}

export function readBranchTouchedFileReport(
  options: ReadBranchTouchedFileReportOptions,
): BranchTouchedFileReport {
  const mergeBase = readGitStdout({
    repoRoot: options.repoRoot,
    args: ['merge-base', options.baseRef, options.headRef],
    execFileSync: options.execFileSync,
    gitPath: options.gitPath,
  });
  const files = readGitStdout({
    repoRoot: options.repoRoot,
    args: ['diff', '--name-only', `${mergeBase}..${options.headRef}`],
    execFileSync: options.execFileSync,
    gitPath: options.gitPath,
  })
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

const TRUSTED_GIT_PATH = '/usr/bin:/bin';

export function readGitStdout(options: ReadGitStdoutOptions): string {
  const run = options.execFileSync ?? execFileSync;
  const trustedPath = trustedGitPath(options.gitPath);

  return run('git', options.args, {
    cwd: options.repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: trustedPath,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function trustedGitPath(gitPath: string | undefined): string {
  if (gitPath === undefined) {
    return TRUSTED_GIT_PATH;
  }
  if (!path.isAbsolute(gitPath)) {
    throw new Error('--git requires an absolute path to a git executable');
  }
  if (path.basename(gitPath) !== 'git') {
    throw new Error('--git must point to an executable named git');
  }
  return path.dirname(gitPath);
}
