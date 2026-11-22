import { ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import type { PrVerdict } from '../pr-watch/state-types.js';
import type { MergeDecision } from './merge-decision.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { postIssueComment } from './pull-request-github.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * The record a merge with no review leaves on the pull request.
 *
 * A review is owed where a change's complexity justifies one. When the
 * caller judges that it does not, `merge-bot merge` takes the reason from a
 * file and posts it here, as the bot, BEFORE the merge call: the pull
 * request then says in its own conversation that nobody reviewed it and
 * why. A reason that cannot be posted stops the merge, so no pull request
 * is merged unreviewed without the record.
 *
 * The comment states what is true whether or not the merge call that
 * follows succeeds: that no review was requested, and the reason.
 */

/** The flag that names the reason file. */
const REASON_FILE_FLAG = '--no-review-reason-file';

/** The reason as read, or what stops the run before a token is minted. */
export type NoReviewReasonRead =
  | { readonly kind: 'read'; readonly reason: string | undefined }
  | { readonly kind: 'stop'; readonly exit: 1 | 3; readonly message: string };

/**
 * Read the reason file, when the caller named one. An unreadable file is an
 * operational failure (exit 1); an empty one is a refusal (exit 3), because
 * the reason is the record and an empty record says nothing.
 *
 * @param path - The file the caller named, or undefined when it named none.
 * @param read - The file reader.
 */
export async function readNoReviewReason(
  path: string | undefined,
  read: (path: string) => Promise<string>,
): Promise<NoReviewReasonRead> {
  if (path === undefined) {
    return { kind: 'read', reason: undefined };
  }
  let text: string;
  try {
    text = await read(path);
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    return {
      kind: 'stop',
      exit: 1,
      message: `cannot read ${printable(path)}: ${printable(cause)}`,
    };
  }
  return text.trim() === ''
    ? {
        kind: 'stop',
        exit: 3,
        message: `refused: ${REASON_FILE_FLAG} ${printable(path)} is empty; the reason is posted on the pull request, so it must say something`,
      }
    : { kind: 'read', reason: text };
}

/** The comment's text for a reason. */
function noReviewComment(reason: string): string {
  return [
    '**No review was requested for this pull request (agent comment).** The agent judged the change simple enough to merge on green checks alone. Its reason:',
    '',
    reason.trim(),
    '',
  ].join('\n');
}

/**
 * The grounds a merge goes ahead on. A reviewed pull request merges on the
 * verdict's own evidence. A merge with no review first posts its reason on
 * the pull request, and that record leads the grounds; when the post fails
 * there are no grounds and the caller does not merge.
 *
 * @param context - The decision to merge, the verdict it was made on, and
 *   what the post needs: GitHub, the token, the repository and the number.
 */
export async function mergeGrounds(context: {
  readonly decision: Extract<MergeDecision, { kind: 'merge' }>;
  readonly verdict: PrVerdict;
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly identity: BotIdentity;
  readonly prNumber: number;
}): Promise<Result<readonly string[], Error>> {
  const { decision, verdict, ...post } = context;
  if (!decision.withoutReview) {
    return ok(verdict.evidence);
  }
  const recorded = await recordNoReview({ ...post, reason: decision.reason });
  return recorded.ok ? ok([recorded.value, ...verdict.evidence]) : recorded;
}

/**
 * Post the reason on the pull request; the evidence line the merged outcome
 * carries.
 *
 * @param context - GitHub, the token minted for this merge, the repository,
 *   the pull request's number and the reason as the caller wrote it.
 */
async function recordNoReview(context: {
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly identity: BotIdentity;
  readonly prNumber: number;
  readonly reason: string;
}): Promise<Result<string, Error>> {
  const posted = await postIssueComment(
    context.fetchImpl,
    context.token,
    context.identity,
    context.prNumber,
    noReviewComment(context.reason),
  );
  return posted.ok
    ? ok(
        `merged with no review, on the caller's stated reason (comment ${String(posted.value.id)})`,
      )
    : posted;
}
