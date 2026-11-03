import { readCompletionComments } from './completion-comments.js';
import { allReviews } from './completion-evidence.js';
import type { ContentLeg } from './content-binding.js';
import {
  NO_DECLARATIONS,
  readDeclaredStandIns,
  type UnavailableDeclaration,
} from './declared-unavailable.js';
import { defaultExpectedReviewers } from './expected-reviewers.js';
import { hasLanded } from './reviewer-legs.js';
import { commentRequests } from './round-requests.js';
import type { ReviewConfiguration } from './review-configuration.js';
import type { HarvestedComment } from './state-conversation.js';
import type { ParsedStateView } from './state-fields.js';
import type { PrStateReading } from './state-types.js';
import { isVendorErrorReview } from './vendor-error-reviews.js';

/**
 * The composition of `pr state`'s compound reading from its gh legs, apart
 * from the IO that fetches them (`state-gh.ts`).
 *
 * @packageDocumentation
 */

/** The declarations a reading judges, the bot that may post them, and the reading's clock. */
export interface UnavailableInput {
  readonly declarations: readonly UnavailableDeclaration[];
  readonly poster: string;
  readonly now: string;
}

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
  /**
   * The declared expected reviewer set: `null` when `--expect` was not given
   * (the set defaults to the observed surface and the reading says so), an
   * empty array when it was declared `none` (expect-flag.ts).
   */
  readonly declared: readonly string[] | null;
  /** Vendors declared unavailable (`--unavailable`); none when absent. */
  readonly unavailable?: UnavailableInput | undefined;
  readonly readContent: (reviewedOids: readonly string[]) => ContentLeg;
}

/**
 * Compose the reading. The expected set resolves first (declared, else the
 * observed surface: outstanding requests and the authors of landed non-empty
 * reviews), and the completion comments are read against it: a comment widens
 * no defaulted set, so a comment by an author outside it reads as no review.
 * The declarations are read against both transports' results and every round
 * asked; a stand-in's named head joins the content read like any result's.
 */
export function composeReading(input: ComposeReadingInput): PrStateReading {
  const expectedReviewers =
    input.declared ?? defaultExpectedReviewers(input.view.reviewRequests, input.reviews);
  const completionComments = readCompletionComments({
    comments: input.comments,
    commits: input.commits,
    reviewers: expectedReviewers,
  });
  const roundRequests = [...input.requests, ...commentRequests(input.comments)];
  const declaredUnavailable =
    input.unavailable === undefined
      ? NO_DECLARATIONS
      : readDeclaredStandIns({
          ...input.unavailable,
          comments: input.comments,
          expectedReviewers,
          reviews: [...input.reviews, ...completionComments.reviews],
          requests: roundRequests,
          isErrorReview: isVendorErrorReview,
        });
  const landed = allReviews({
    reviews: input.reviews,
    completionComments,
    declaredUnavailable,
  }).filter(hasLanded);
  return {
    ...input.view,
    reviewThreads: input.reviewThreads,
    reviews: input.reviews,
    roundRequests,
    completionComments,
    declaredUnavailable,
    reviewRuns: input.reviewRuns,
    reviewConfiguration: input.reviewConfiguration,
    expectedReviewers,
    expectedDeclared: input.declared !== null,
    content: input.readContent(landed.map((review) => review.commitOid)),
  };
}
