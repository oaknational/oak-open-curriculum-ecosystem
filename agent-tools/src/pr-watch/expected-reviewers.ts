import { hasLanded, isSignedSelfReply } from './reviewer-legs.js';
import type { HarvestedReview } from './reviewer-legs.js';
import { isSkipMarker } from './skip-markers.js';
import { isVendorErrorReview } from './vendor-error-reviews.js';

/**
 * The expected reviewer set DEFAULTED from the observed surface when none is
 * declared (`--expect`): outstanding review requests plus the authors of
 * landed reviews, in that order, once each. The reading marks such a set
 * undeclared, and the merge door refuses it outright.
 */
export function defaultExpectedReviewers(
  reviewRequests: readonly string[],
  reviews: readonly HarvestedReview[],
): string[] {
  // A defaulted expected set must not be polluted by the agent's own signed
  // disposition replies (shared-credential reviews), the EMPTY-bodied review
  // a thread reply creates under the replier's identity, unsubmitted drafts,
  // or deleted-account 'unknown' authors — each would mint a phantom OWED leg.
  // A skip notice or a vendor's failed-run body says that no review occurred:
  // its author is awaited only through a round asked of them, which the
  // requests carry.
  const observedAuthors = reviews
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .filter((review) => review.body.trim() !== '')
    .filter((review) => !isSkipMarker(review.body) && !isVendorErrorReview(review.body))
    .map((review) => review.author)
    .filter((author) => author !== 'unknown');
  return [...new Set([...reviewRequests, ...observedAuthors])];
}
