import { ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import type { PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
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
 * follows succeeds: that the pull request has not been reviewed, and the
 * reason.
 */

/** The flag that names the reason file. */
const REASON_FILE_FLAG = '--no-review-reason-file';

/** The reason as read, or what stops the run before a token is minted. */
export type NoReviewReasonRead =
  | { readonly kind: 'read'; readonly reason: string | undefined }
  | { readonly kind: 'stop'; readonly exit: 1 | 3; readonly message: string };

/**
 * Read the reason file, when the caller named one. An unreadable file is an
 * operational failure (exit 1). A reason that cannot be posted as it stands
 * is a refusal (exit 3): an empty one, because the reason is the record,
 * and one that names an account (`reasonFault`).
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
  const fault = reasonFault(text);
  return fault === undefined
    ? { kind: 'read', reason: text }
    : {
        kind: 'stop',
        exit: 3,
        message: `refused: ${REASON_FILE_FLAG} ${printable(path)} ${fault}`,
      };
}

/**
 * What is wrong with a reason's text, or undefined when it can be posted.
 * The text goes on the pull request verbatim, where an `@name` is live: it
 * notifies a person, and a review bot's trigger phrase asks that bot for a
 * round AFTER the command judged the pull request unreviewed. So a reason
 * names no account.
 */
function reasonFault(text: string): string | undefined {
  if (text.trim() === '') {
    return 'is empty; the reason is posted on the pull request, so it must say something';
  }
  return text.includes('@')
    ? 'contains an @: the reason is posted verbatim, where an @name notifies a person or asks a review bot for a round; name no account'
    : undefined;
}

/**
 * Report what stopped the run before the mint, and answer with its exit
 * code. Under `--json` a refusal also puts its object on stdout, as every
 * typed refusal of the command does.
 */
export function reportReasonStop(
  stop: Extract<NoReviewReasonRead, { kind: 'stop' }>,
  json: boolean,
  streams: {
    readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
    readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
  },
): number {
  if (json && stop.exit === 3) {
    streams.stdout.write(`${JSON.stringify({ kind: 'refused', reason: stop.message })}\n`);
  }
  streams.stderr.write(`merge-bot merge: ${stop.message}\n`);
  return stop.exit;
}

/**
 * Whether the reading shows, for certain, a pull request nobody has
 * reviewed and nobody is reviewing: the expected reviewer set is empty, and
 * the review runs were read in full. An unavailable or truncated run
 * listing cannot show that no review is running, so it never qualifies.
 * A pending request of a person does not hold the pull request back, which
 * is the command's rule for every merge; the record says "not reviewed"
 * and never "nobody was asked".
 */
export function unreviewedForCertain(reading: PrStateReading): boolean {
  const { expectedReviewers, reviewRuns } = reading;
  const runsReadInFull = reviewRuns.kind === 'read' && reviewRuns.truncated !== true;
  return expectedReviewers.length === 0 && runsReadInFull;
}

/** The comment's text for a reason. */
function noReviewComment(reason: string): string {
  return [
    '**This pull request has not been reviewed (agent comment).** The agent judged the change simple enough to merge on green checks alone. Its reason:',
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
