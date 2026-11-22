import { ok, type Result } from '@oaknational/result';

import { reviewsByOthers } from '../pr-watch/expected-reviewers.js';
import { printable } from '../pr-watch/printable.js';
import { QUIET_WINDOW_MS } from '../pr-watch/reviewer-legs.js';
import type { RoundRequest } from '../pr-watch/round-requests.js';
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
        message: `${REASON_FILE_FLAG} ${printable(path)} ${fault}`,
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
 * What stands in the way of merging this pull request with no review, in
 * words for the refusal; undefined when the reading shows no review and
 * none that can have started unseen. Four things stand in the way:
 *
 * - a reviewer in the expected set: a review exists or a round is asked;
 * - a review-run listing not read in full, which cannot show that no review
 *   is running;
 * - a review by another account that the set leaves out (`reviewsByOthers`):
 *   an approval or a change request with an empty body, a comment on a
 *   line, a review by a deleted account;
 * - one quiet window not yet passed since the pull request was last marked
 *   ready or its checks went green, whichever is later. An automatic
 *   reviewer starts on such an event and the pull request shows nothing of
 *   it until it reports. A pull request opened ready carries no ready
 *   event, so the checks' time is its only cue.
 *
 * What the reading cannot show, and so does not hold the merge: another
 * account's draft (GitHub shows a draft to its author alone), a comment in
 * the conversation that says a review is under way, and a reviewer slower
 * than the window. The reading is what the pull request showed when it was
 * read. A review or a request can still arrive between the reading and the
 * merge call, as on every merge by the command: the merge call is pinned to
 * the commit, not to the reviews, and no second reading makes GitHub's
 * separate calls one. A pending request of a person does not hold the pull
 * request back, which is the command's rule for every merge; the record
 * says "not reviewed" and never "nobody was asked".
 *
 * @param reading - The pull request as read.
 * @param nowIso - The clock the merge runs on.
 */
export function noReviewObstacle(reading: PrStateReading, nowIso: string): string | undefined {
  const { expectedReviewers, reviewRuns } = reading;
  if (expectedReviewers.length > 0) {
    return `a reviewer exists (${printable(expectedReviewers.join(', '))})`;
  }
  if (reviewRuns.kind !== 'read' || reviewRuns.truncated === true) {
    return `the review runs were not read in full, so a review in progress cannot be ruled out; ${REQUEST_INSTEAD}`;
  }
  const others = new Set(reviewsByOthers(reading.author, reading.reviews).map((r) => r.author));
  if (others.size > 0) {
    return `the pull request carries a review by another account (${printable([...others].join(', '))}); ${REQUEST_INSTEAD}`;
  }
  return tooSoonObstacle(reading, nowIso);
}

/** Whether one quiet window has not yet passed; an unreadable time (NaN) holds. */
function withinWindow(elapsedMs: number): boolean {
  return Number.isNaN(elapsedMs) || elapsedMs <= QUIET_WINDOW_MS;
}

/** The way forward when a reason cannot stand in and time will not change that. */
const REQUEST_INSTEAD = 'request a review, and the pull request merges as reviewed';

/**
 * The latest cue an automatic reviewer starts on (a ready-for-review event,
 * the checks going green), while one quiet window has not passed since it.
 * A time that cannot be read holds, as an unread time does everywhere in the
 * settlement.
 */
function tooSoonObstacle(reading: PrStateReading, nowIso: string): string | undefined {
  const ready = reading.roundRequests
    .filter((round: RoundRequest) => round.implied === true)
    .map((round) => ({ at: round.at, what: 'was marked ready' }));
  const green =
    reading.checksGreenAt === null ? [] : [{ at: reading.checksGreenAt, what: 'went green' }];
  const now = Date.parse(nowIso);
  const cue = [...ready, ...green]
    .filter(({ at }) => withinWindow(now - Date.parse(at)))
    .sort((left, right) => left.at.localeCompare(right.at))
    .at(-1);
  if (cue === undefined) {
    return undefined;
  }
  const passes = Date.parse(cue.at) + QUIET_WINDOW_MS;
  const after = Number.isNaN(passes)
    ? 'a time that could not be read'
    : new Date(passes).toISOString();
  return `the pull request ${cue.what} at ${printable(cue.at)}: an automatic review can have started and not show yet, so a reason stands in only after ${after}`;
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
