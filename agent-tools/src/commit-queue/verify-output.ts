/**
 * CLI-side verification output for the commit-queue `verify-staged` command.
 *
 * Wraps `verifyStagedBundle` so the CLI handler can emit a fingerprint on
 * stdout, surface a warning on stderr without altering exit code, and
 * surface a reason on stderr with a non-zero exit code. Lives outside
 * `cli.ts` so the dispatcher stays under the workspace's `max-lines`
 * limit and so the verification-output concern has its own boundary.
 */

import { verifyStagedBundle } from './core.js';
import { type CommitIntent, type StagedBundle } from './types.js';

/**
 * Run `verifyStagedBundle` and emit the canonical CLI representation of
 * the result. Returns the process exit code.
 */
export function writeVerificationResult(input: {
  readonly intent: CommitIntent;
  readonly staged: StagedBundle;
  readonly commitSubject: string;
}): number {
  const result = verifyStagedBundle({
    intent: input.intent,
    stagedNameOnly: input.staged.stagedNameOnly,
    stagedNameStatus: input.staged.stagedNameStatus,
    stagedPatch: input.staged.stagedPatch,
    worktreeShortStatus: input.staged.worktreeShortStatus,
    commitSubject: input.commitSubject,
  });

  if (!result.ok) {
    process.stderr.write(`${result.reason}\n`);
    return 1;
  }

  if (result.warning !== undefined) {
    process.stderr.write(`${result.warning}\n`);
  }
  process.stdout.write(`${result.fingerprint}\n`);
  return 0;
}
