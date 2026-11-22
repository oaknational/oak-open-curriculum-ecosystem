import { normaliseLogin } from './logins.js';
import { hasLanded, isSignedSelfReply } from './reviewer-legs.js';
import type { HarvestedReview } from './reviewer-legs.js';
import type { RoundRequest } from './round-requests.js';
import { isSkipMarker } from './skip-markers.js';
import { isVendorErrorReview } from './vendor-error-reviews.js';

/**
 * The reviewers a pull request shows, read from the pull request itself: the
 * bots a round is asked of, and the authors of its real reviews. Nothing
 * declares the set: a review in progress is waited for, every review is
 * dealt with, there is always at least one, and all three are read from the
 * pull request's own state.
 *
 * @packageDocumentation
 */

/**
 * One account under the spellings its surfaces use: `gh pr view` spells an
 * App author `app/<slug>`, and a review by the same App carries the slug,
 * with or without a `[bot]` suffix.
 */
function accountOf(login: string): string {
  return normaliseLogin(login)
    .replace(/^app\//u, '')
    .replace(/\[bot\]$/u, '');
}

export interface ExpectedReviewersInput {
  /** The pull request's author, as `gh pr view` spells it. */
  readonly author: string;
  /** The bots GitHub lists a pending review request of. */
  readonly pending: readonly string[];
  /** Every round asked of a bot, from the pull request's history. */
  readonly rounds: readonly RoundRequest[];
  /**
   * The review connectors that have commented on the pull request. A
   * connector that reports by comment posts no review object, so its comment
   * is how the pull request shows it is reviewing.
   */
  readonly connectors: readonly string[];
  /** The full review harvest. */
  readonly reviews: readonly HarvestedReview[];
}

/**
 * The set, in order and once each: bots with a pending request, bots asked
 * for a round, connectors that have commented, then the authors of landed
 * reviews that say a review occurred. A round a ready-for-review event
 * implies for the Codex connector makes nobody a reviewer by itself: on an
 * estate without the connector it is never answered. Where the connector
 * has commented, it is a reviewer and that round holds its leg like any
 * other. The pull request's own author is never among the review authors.
 * An empty set is a pull request nobody has reviewed and no bot is
 * reviewing.
 */
export function expectedReviewersOf(input: ExpectedReviewersInput): string[] {
  const asked = input.rounds
    .filter((round) => round.implied !== true)
    .map((round) => round.reviewer);
  // The agent's own signed disposition replies (shared-credential reviews),
  // the EMPTY-bodied review a thread reply creates under the replier's
  // identity, unsubmitted drafts and deleted-account 'unknown' authors are
  // not reviews; nor is a skip notice or a vendor's failed-run body, which
  // says that no review occurred.
  const authors = input.reviews
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .filter((review) => review.body.trim() !== '')
    .filter((review) => !isSkipMarker(review.body) && !isVendorErrorReview(review.body))
    .map((review) => review.author)
    .filter((author) => author !== 'unknown')
    // A review is by someone other than the author: what the author writes
    // on their own pull request reviews nothing.
    .filter((author) => accountOf(author) !== accountOf(input.author));
  const seen = new Set<string>();
  return [...input.pending, ...asked, ...input.connectors, ...authors].filter((login) => {
    const key = normaliseLogin(login);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Every review that is someone else's word on the pull request. Wider than
 * the reviewer set on purpose. The set names who holds a round, so it leaves
 * out an approval or a change request with an empty body, a comment on a
 * line (whose review has an empty body) and a review by a deleted account.
 * A caller that must know that nobody has reviewed counts those.
 *
 * Left out: the author's own reviews, and a COMMENTED review whose body is a
 * skip notice, a vendor's failed-run notice or the agent's own signed reply.
 * Those three are read from the body's text, so they are trusted on a
 * comment alone: an approval, a change request, a dismissed review or a
 * draft counts whatever its body says. A deleted account is never the
 * author's own, since two deleted accounts share one name. An App and a
 * person whose login is the App's slug cannot be told apart in the harvest
 * and read as one account. A draft by any account but the reader's own is
 * not in the harvest at all: GitHub shows a draft to its author alone.
 *
 * @param author - The pull request's author, as `gh pr view` spells it.
 * @param reviews - The full review harvest.
 */
export function reviewsByOthers(
  author: string,
  reviews: readonly HarvestedReview[],
): HarvestedReview[] {
  return reviews.filter((review) => !isAuthorsOwn(author, review) && !isNoticeComment(review));
}

function isAuthorsOwn(author: string, review: HarvestedReview): boolean {
  return review.author !== 'unknown' && accountOf(review.author) === accountOf(author);
}

/** A COMMENTED review whose body says that no review occurred, or is the agent's own reply. */
function isNoticeComment(review: HarvestedReview): boolean {
  return (
    review.state === 'COMMENTED' &&
    (isSignedSelfReply(review.body) ||
      isSkipMarker(review.body) ||
      isVendorErrorReview(review.body))
  );
}
