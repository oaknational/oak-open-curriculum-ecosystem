import { execFileSync } from 'node:child_process';
import type { ExecFileSyncOptionsWithStringEncoding } from 'node:child_process';
import path from 'node:path';

import { resolveTrustedGit } from '../core/trusted-git.js';

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

export function readGitStdout(options: ReadGitStdoutOptions): string {
  const run = options.execFileSync ?? execFileSync;
  const gitBinary = resolveGitBinary(options.gitPath);

  return run(gitBinary, options.args, {
    cwd: options.repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

/**
 * Resolve the absolute path to the `git` binary to execute.
 *
 * @remarks
 * Executing git by its absolute path — not by name via `PATH` — defeats
 * PATH-hijacking (SonarCloud S4036, the compliant fix). With no `--git` override
 * the path comes from {@link resolveTrustedGit} (a fixed allowlist of system
 * directories); an explicit override must itself be an absolute path to an
 * executable named `git`, and is then used verbatim.
 */
function resolveGitBinary(gitPath: string | undefined): string {
  if (gitPath === undefined) {
    return resolveTrustedGit();
  }
  if (!path.isAbsolute(gitPath)) {
    throw new Error('--git requires an absolute path to a git executable');
  }
  if (path.basename(gitPath) !== 'git') {
    throw new Error('--git must point to an executable named git');
  }
  return gitPath;
}
