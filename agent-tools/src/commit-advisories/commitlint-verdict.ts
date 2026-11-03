/**
 * How `check-commit-message` asks commitlint for a verdict and reads the answer.
 *
 * @remarks
 * Pure: no process is spawned here. The caller spawns commitlint with
 * {@link commitlintArgs} and maps its exit status with
 * {@link exitCodeForCommitlintStatus}. Kept apart from the CLI's IO so the
 * two decisions that make a warning fail (strict mode is asked for; a strict
 * warning status is read as a violation) are each held by a test.
 */

/** commitlint's strict-mode lint verdicts: 2 for warnings, 3 for errors. */
const COMMITLINT_VIOLATION_STATUSES: readonly number[] = [2, 3];

/**
 * This tool's exit code for a commitlint exit status.
 *
 * @remarks
 * Strict mode exits 2 for warnings and 3 for errors. This tool reserves 2 for
 * "no verdict", so a lint verdict maps to 1, and anything that is not a verdict
 * maps to 2: a commitlint that never ran (`null`), and any other status,
 * among them 1, which strict mode never gives a lint result and so marks an
 * operational failure (an unreadable message file, a broken runner). One case
 * this mapping cannot see: with no rules configured, commitlint reports an
 * `empty-rules` error, and strict mode exits 3 for it like any rule error.
 */
export function exitCodeForCommitlintStatus(status: number | null): 0 | 1 | 2 {
  if (status === 0) {
    return 0;
  }
  return status !== null && COMMITLINT_VIOLATION_STATUSES.includes(status) ? 1 : 2;
}

/**
 * The arguments that lint one message file: strict mode, so a warning is a
 * verdict against the message exactly as in `.husky/commit-msg`.
 */
export function commitlintArgs(messageFile: string): readonly string[] {
  return ['exec', 'commitlint', '--strict', '--edit', messageFile];
}
