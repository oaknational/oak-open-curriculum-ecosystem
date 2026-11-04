import { closeSync, existsSync, openSync, readFileSync, readSync } from 'node:fs';

import { err, ok, type Result } from '@oaknational/result';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import type { TrackedTreeReading } from './repo-check-files.js';
import { defaultRuntime } from './repo-check-runtime.js';
import { REPO_SHELLCHECK, SHELLCHECK_INSTALLER } from './repo-check-shellcheck-version.js';
import { SKILLS_LOCK } from './repo-check-skills-lock.js';
import type { RepoCheckCommandResult } from './repo-check-types.js';
import { readTrackedTreeResult } from './repo-check-universe.js';

/**
 * The shellcheck gate's edges (`repo-check-shellcheck.ts`): the working tree,
 * git, the process, stdout and stderr. The gate composes them through
 * `ShellcheckGateRuntime`, so the composition is testable without a
 * repository; `defaultShellcheckGateRuntime` is the real edges.
 *
 * @packageDocumentation
 */

/** The edges the gate composes, injected so the composition is testable without a repository. */
export interface ShellcheckGateRuntime {
  /** The installer script's text, which holds the pin. */
  readonly readInstaller: () => string;
  /** Whether the installer has put the pinned binary at `.tools/bin/shellcheck`. */
  readonly hasRepoShellcheck: () => boolean;
  /** Run the given shellcheck with `--version`. */
  readonly probeVersion: (command: string) => RepoCheckCommandResult;
  /** What git says about the tracked tree, or why git could not say. */
  readonly trackedTree: () => Result<TrackedTreeReading, string>;
  /** The skills lock's text, or undefined when the repository has none. */
  readonly readSkillsLock: () => string | undefined;
  /** A file's first `bytes` bytes (fewer when the file is shorter), decoded as UTF-8. */
  readonly readHead: (file: string, bytes: number) => string;
  /** The opening of a file's content in git's index, or why git could not read it. */
  readonly readIndexHead: (file: string, bytes: number) => Result<string, string>;
  /** A file's whole text. */
  readonly readText: (file: string) => string;
  /** Run `/usr/bin/env` with the given argv, output inherited, resolving to its exit status. */
  readonly runEnv: (args: readonly string[]) => Promise<number>;
  /** Write one progress line. */
  readonly writeLine: (line: string) => void;
  /** Write one failure line. */
  readonly writeFailure: (line: string) => void;
}

/** A file's first `bytes` bytes, decoded as UTF-8. */
function readHead(file: string, bytes: number): string {
  const buffer = Buffer.alloc(bytes);
  const descriptor = openSync(file, 'r');
  try {
    const bytesRead = readSync(descriptor, buffer, 0, bytes, 0);
    return buffer.toString('utf8', 0, bytesRead);
  } finally {
    closeSync(descriptor);
  }
}

/** The opening of a file's content in git's index (stage 0), or git's reason it could not read it. */
function readIndexHead(file: string, bytes: number): Result<string, string> {
  const blob = defaultRuntime.runCaptured('git', ['cat-file', 'blob', `:0:${file}`]);
  return blob.status === 0
    ? ok(blob.stdout.slice(0, bytes))
    : err(blob.stderr.trim() || `git cat-file ended ${String(blob.status ?? blob.signal)}`);
}

/** The real edges: the working tree, git, the process, stdout and stderr. */
export const defaultShellcheckGateRuntime: ShellcheckGateRuntime = {
  readInstaller: () => readFileSync(SHELLCHECK_INSTALLER, 'utf8'),
  hasRepoShellcheck: () => existsSync(REPO_SHELLCHECK),
  probeVersion: (command) => defaultRuntime.runCaptured(command, ['--version']),
  trackedTree: () => readTrackedTreeResult(defaultRuntime),
  readSkillsLock: () => (existsSync(SKILLS_LOCK) ? readFileSync(SKILLS_LOCK, 'utf8') : undefined),
  readHead,
  readIndexHead,
  readText: (file) => readFileSync(file, 'utf8'),
  runEnv: (args) => defaultRuntime.runInherited('/usr/bin/env', args),
  writeLine,
  writeFailure: writeErrorLine,
};
