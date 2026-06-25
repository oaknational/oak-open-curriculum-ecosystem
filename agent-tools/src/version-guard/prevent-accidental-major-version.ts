#!/usr/bin/env node

/**
 * Pre-commit hook to prevent accidental major version bumps.
 * Checks commit messages for breaking change indicators.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { argv, env, exit } from 'node:process';
import { fileURLToPath } from 'node:url';

import { assertPathWithinBase } from '../core/safe-path.js';
import { writeErrorLine } from '../core/terminal-output.js';
import { TRUSTED_GIT_PATH } from '../core/trusted-git.js';

const BREAKING_CHANGE_INDICATORS = [
  'BREAKING CHANGE:',
  'BREAKING CHANGES:',
  'BREAKING-CHANGE:',
  'BREAKING CHANGE',
  'BREAKING CHANGES',
  'BREAKING-CHANGE',
];

// ANSI color codes
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

/** Injectable seams for {@link runPreventAccidentalMajorVersion} (testing + composition). */
export interface PreventAccidentalMajorVersionOptions {
  /**
   * Caller-supplied commit-message file path. The CLI entry passes
   * `process.argv[2]`; tests pass it explicitly (and omit it to exercise the
   * missing-path branch) so the function never depends on global `argv`.
   */
  readonly commitMsgFile?: string | undefined;
  /**
   * Containment base the commit-message path must resolve within; defaults to
   * the absolute git directory (`git rev-parse --absolute-git-dir`).
   */
  readonly gitDir?: string;
  /** Reads the (already-contained) file; defaults to `node:fs` `readFileSync` utf8. */
  readonly readFile?: (path: string) => string;
  /** Canonicalises paths for containment; defaults to `node:fs` `realpathSync`. */
  readonly realpath?: (path: string) => string;
  /** Error sink; defaults to {@link writeErrorLine}. */
  readonly writeError?: (line: string) => void;
}

interface ResolvedSeams {
  readonly commitMsgFile: string | undefined;
  readonly readFile: (path: string) => string;
  readonly realpath: (path: string) => string;
  readonly writeError: (line: string) => void;
}

function resolveSeams(options: PreventAccidentalMajorVersionOptions): ResolvedSeams {
  return {
    commitMsgFile: options.commitMsgFile,
    readFile: options.readFile ?? ((path: string) => readFileSync(path, 'utf8')),
    realpath: options.realpath ?? ((path: string) => realpathSync(path)),
    writeError: options.writeError ?? writeErrorLine,
  };
}

/**
 * Resolve the absolute git directory with a hardened `PATH`.
 *
 * @remarks
 * `PATH` is pinned to {@link TRUSTED_GIT_PATH} so a shadowing `git` on a
 * user-writable `PATH` entry cannot be executed (SonarCloud S4036).
 *
 * @returns The absolute git directory, used as the containment base.
 */
function resolveAbsoluteGitDir(): string {
  return execFileSync('git', ['rev-parse', '--absolute-git-dir'], {
    env: { ...env, PATH: TRUSTED_GIT_PATH },
    encoding: 'utf8',
  }).trim();
}

function checkForBreakingChanges(message: string): boolean {
  const upperMessage = message.toUpperCase();

  for (const indicator of BREAKING_CHANGE_INDICATORS) {
    if (upperMessage.includes(indicator)) {
      return true;
    }
  }

  return false;
}

function checkForBangCommit(message: string): boolean {
  // Check for feat!, fix!, refactor!, etc.
  return /^(feat|fix|refactor|perf|test|build|ci|chore|docs|style|revert)!:/m.test(message);
}

function printErrorHeader(line: string, writeError: (line: string) => void): void {
  writeError(line);
  writeError(`${RED}⚠️  MAJOR VERSION BUMP DETECTED!${RESET}`);
  writeError(line);
  writeError('');
}

function printErrorCause(
  hasBreakingChange: boolean,
  hasBangCommit: boolean,
  writeError: (line: string) => void,
): void {
  if (hasBreakingChange) {
    writeError(`Your commit message contains a BREAKING CHANGE indicator.`);
  }

  if (hasBangCommit) {
    writeError(`Your commit uses the '!' syntax (e.g., feat!, fix!).`);
  }

  writeError(`This would trigger a major version bump (to 1.0.0 or higher).`);
  writeError('');
}

function printErrorAdvice(writeError: (line: string) => void): void {
  writeError(`${YELLOW}Since this package is still in pre-1.0 development:${RESET}`);
  writeError(`• Remove "BREAKING CHANGE" from your commit message`);
  writeError(`• Don't use ! in your commit type (feat!, fix!, etc.)`);
  writeError(`• Use regular feat: or fix: commits instead`);
  writeError(`• Breaking changes in 0.x.x should bump minor version, not major`);
  writeError('');
  writeError(`${YELLOW}If you really need to indicate breaking changes:${RESET}`);
  writeError(`1. Use a regular commit type without !`);
  writeError(
    `2. Document breaking changes in the commit body (without the BREAKING CHANGE footer)`,
  );
  writeError(`3. Update CHANGELOG.md manually if needed`);
  writeError('');
}

function printError(
  hasBreakingChange: boolean,
  hasBangCommit: boolean,
  writeError: (line: string) => void,
): void {
  const line = `${RED}${'━'.repeat(75)}${RESET}`;

  printErrorHeader(line, writeError);
  printErrorCause(hasBreakingChange, hasBangCommit, writeError);
  printErrorAdvice(writeError);
  writeError(`${RED}Commit blocked. Please modify your commit message and try again.${RESET}`);
  writeError(line);
}

/**
 * Classify an already-read commit message and return the process exit code.
 *
 * @param commitMessage - The commit message text (empty when not yet written).
 * @param writeError - Error sink for the block advice.
 * @returns `{ exitCode: 1 }` when a breaking-change or `!` indicator is present;
 *   `{ exitCode: 0 }` otherwise (including an empty, not-yet-written message).
 */
function evaluateCommitMessage(
  commitMessage: string,
  writeError: (line: string) => void,
): { exitCode: number } {
  if (commitMessage === '') {
    // No commit message yet, this is fine.
    return { exitCode: 0 };
  }

  const hasBreakingChange = checkForBreakingChanges(commitMessage);
  const hasBangCommit = checkForBangCommit(commitMessage);

  if (hasBreakingChange || hasBangCommit) {
    printError(hasBreakingChange, hasBangCommit, writeError);
    return { exitCode: 1 };
  }

  return { exitCode: 0 };
}

/**
 * Read and validate a commit message for accidental major-version-bump
 * indicators, returning the process exit code.
 *
 * @remarks
 * The commit-message file path is caller-influenced — `process.argv[2]`, set by
 * the husky `commit-msg` hook. It is contained within the git directory via
 * {@link assertPathWithinBase} before being read, defeating path-injection
 * (`..` traversal or a symlink escape). The git directory — not the repo root —
 * is the correct base: the hook's `COMMIT_EDITMSG` lives under the git dir,
 * which for a linked worktree sits OUTSIDE the working-tree root, so a repo-root
 * base would wrongly reject every legitimate worktree commit.
 *
 * @param options - Injectable seams (path, base, read, canonicalise, error sink).
 * @returns `{ exitCode: 0 }` when the commit may proceed; `{ exitCode: 1 }` when
 *   it is blocked, or the message file is missing, unreadable, or resolves
 *   outside the permitted base.
 */
export function runPreventAccidentalMajorVersion(
  options: PreventAccidentalMajorVersionOptions = {},
): { exitCode: number } {
  const { commitMsgFile, readFile, realpath, writeError } = resolveSeams(options);

  if (commitMsgFile === undefined || commitMsgFile === '') {
    writeError('Error: No commit message file provided');
    return { exitCode: 1 };
  }

  const gitDir = options.gitDir ?? resolveAbsoluteGitDir();

  let commitMessage: string;
  try {
    const safePath = assertPathWithinBase(commitMsgFile, gitDir, { realpath });
    commitMessage = readFile(safePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeError(`Error reading commit message file: ${message}`);
    return { exitCode: 1 };
  }

  return evaluateCommitMessage(commitMessage, writeError);
}

// Self-exec tail: run only when invoked directly (not when imported by tests).
// The caller-supplied path comes from argv here, so the function itself stays
// free of any global-argv dependency.
const currentFilePath = fileURLToPath(import.meta.url);
if (argv[1] === currentFilePath) {
  exit(runPreventAccidentalMajorVersion({ commitMsgFile: argv[2] }).exitCode);
}
