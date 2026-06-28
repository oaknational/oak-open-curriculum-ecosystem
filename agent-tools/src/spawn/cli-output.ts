import { type SpawnedWorktree } from './create.js';

/**
 * Render the human-facing summary of a spawn result for stdout.
 *
 * @remarks
 * A resume re-runs build against an existing worktree, so it does not assert a
 * fresh creation from `base` (the branch was cut from its original base earlier,
 * not from the requested `base` on this invocation) and does not re-open a PR —
 * so the resume header omits the `(from <base>)` clause and the PR line.
 */
export function formatSpawnResult(result: SpawnedWorktree, prUrl: string | undefined): string {
  const header = result.resumed
    ? [`Resumed existing worktree ${result.worktreePath}`, `  branch:   ${result.branch}`]
    : [
        `Created worktree ${result.worktreePath}`,
        `  branch:   ${result.branch} (from ${result.base})`,
      ];
  const prLine = prUrl === undefined ? [] : [`  draft PR: ${prUrl}`];
  return [
    ...header,
    `  identity: ${result.session.agentName} (${result.session.sessionIdPrefix})`,
    ...prLine,
    '',
  ].join('\n');
}
