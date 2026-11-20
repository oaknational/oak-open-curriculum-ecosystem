import { readCompletionComments } from './completion-comments.js';
import { allReviews } from './completion-evidence.js';
import type { ContentLeg } from './content-binding.js';
import { expectedReviewersOf } from './expected-reviewers.js';
import { CODEX_CONNECTOR_LOGIN, normaliseLogin } from './logins.js';
import { hasLanded } from './reviewer-legs.js';
import { commentRequests } from './round-requests.js';
import type { ReviewConfiguration } from './review-configuration.js';
import type { HarvestedComment } from './state-conversation.js';
import type { ParsedStateView } from './state-fields.js';
import type { PrStateReading } from './state-types.js';

/**
 * The composition of `pr state`'s compound reading from its gh legs, apart
 * from the IO that fetches them (`state-gh.ts`).
 *
 * @packageDocumentation
 */

export interface ComposeReadingInput {
  readonly view: ParsedStateView;
  readonly comments: readonly HarvestedComment[];
  readonly commits: readonly string[];
  readonly requests: PrStateReading['roundRequests'];
  readonly reviewThreads: PrStateReading['reviewThreads'];
  readonly reviews: PrStateReading['reviews'];
  readonly reviewRuns: PrStateReading['reviewRuns'];
  /** The base branch's automatic-review configuration, read with the reading. */
  readonly reviewConfiguration: ReviewConfiguration;
  readonly readContent: (reviewedOids: readonly string[]) => ContentLeg;
}

/**
 * Compose the reading. The rounds asked resolve first, then the reviewers the
 * pull request shows (`expected-reviewers.ts`), the review connector among
 * them once it has commented, and the completion comments are read against
 * that set: a comment by any other author reads as no review.
 */
export function composeReading(input: ComposeReadingInput): PrStateReading {
  const roundRequests = [...input.requests, ...commentRequests(input.comments)];
  const connectorCommented = input.comments.some(
    (comment) => normaliseLogin(comment.author) === CODEX_CONNECTOR_LOGIN,
  );
  const expectedReviewers = expectedReviewersOf({
    pending: input.view.reviewRequests,
    rounds: roundRequests,
    connectors: connectorCommented ? [CODEX_CONNECTOR_LOGIN] : [],
    reviews: input.reviews,
  });
  const completionComments = readCompletionComments({
    comments: input.comments,
    commits: input.commits,
    reviewers: expectedReviewers,
  });
  const landed = allReviews({ reviews: input.reviews, completionComments }).filter(hasLanded);
  return {
    ...input.view,
    reviewThreads: input.reviewThreads,
    reviews: input.reviews,
    roundRequests,
    completionComments,
    reviewRuns: input.reviewRuns,
    reviewConfiguration: input.reviewConfiguration,
    expectedReviewers,
    content: input.readContent(landed.map((review) => review.commitOid)),
  };
}
