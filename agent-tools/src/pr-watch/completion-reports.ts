/**
 * Which commit a completion comment reports on, and how. The connector's
 * zero-findings comment names the commit it read under the label "Reviewed
 * commit"; its summary names, in its Code Review row, the commit a run read
 * (Completed) or tried (Failed) (`completion-summary.ts`). Each shape names
 * its report one way: a summary only in that row, any other comment only
 * under the label, so a bare inline-code sha elsewhere in a comment's prose
 * is not the report: the conversation carries the connector's other
 * messages too, and a comment that merely mentions the tip must not read as
 * a review of it. The one named prefix resolves to exactly one of the pull
 * request's commits, or the body is refused in the ruling's words
 * (`.agent/reports/merge-door-comment-evidence-decision-2026-09-16.md`).
 * Pure.
 *
 * @packageDocumentation
 */

import {
  isSummary,
  isSummaryRunning,
  summaryReports,
  type CodeReviewReport,
} from './completion-summary.js';

/** Why a body names no one commit of the pull request, in the ruling's words. */
export type CommitRefusal =
  | 'names no reviewed commit'
  | 'names a code review still running'
  | 'names several reviewed commits'
  | 'names a commit that is not in the pull request'
  | 'names a prefix matching several commits of the pull request';

/** The one commit a body reports on, with its report; or why it names none. */
export type CommitResolution =
  | { readonly commitId: string; readonly report: CodeReviewReport }
  | { readonly refused: CommitRefusal };

// The result names the commit it read under this label, as an inline-code
// prefix of at least seven hex characters (ten on every recorded instance).
const REVIEWED_COMMIT = /\*\*Reviewed commit:\*\* `([0-9a-f]{7,40})`/gu;

function reportsOf(body: string): readonly CodeReviewReport[] {
  if (isSummary(body)) {
    return summaryReports(body);
  }
  return [...body.matchAll(REVIEWED_COMMIT)].flatMap((match) =>
    match[1] === undefined ? [] : [{ status: 'completed' as const, prefix: match[1] }],
  );
}

/**
 * Resolve the commit a body reports on against the pull request's commits.
 *
 * @param body - The comment's body.
 * @param commits - Full SHAs of the commits a named prefix may resolve to.
 */
export function resolveNamedCommit(body: string, commits: readonly string[]): CommitResolution {
  const [report, ...more] = reportsOf(body);
  if (report === undefined) {
    return {
      refused:
        isSummary(body) && isSummaryRunning(body)
          ? 'names a code review still running'
          : 'names no reviewed commit',
    };
  }
  if (more.length > 0) {
    return { refused: 'names several reviewed commits' };
  }
  const [commitId, ...others] = commits.filter((sha) => sha.startsWith(report.prefix));
  if (commitId === undefined) {
    return { refused: 'names a commit that is not in the pull request' };
  }
  if (others.length > 0) {
    return { refused: 'names a prefix matching several commits of the pull request' };
  }
  return { commitId, report };
}
