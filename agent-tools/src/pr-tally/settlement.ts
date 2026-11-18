import { hasLanded, isSignedSelfReply, QUIET_WINDOW_MS } from '../pr-watch/reviewer-legs.js';
import { isSkipMarker } from '../pr-watch/skip-markers.js';
import { extractBodyFindings } from './findings.js';
import type { RecordedHarvest } from './harvest.js';

/**
 * The settlement reads the tally builder makes of a recorded head: which
 * reviews landed and are substantive, whether the quiet window after them
 * has elapsed, and which review records the seat's own replies created.
 */

type Review = RecordedHarvest['reviews'][number];

// The recorded review carries a nullable commit; the pr-watch predicate wants the string form.
export const landed = (review: Review): boolean =>
  hasLanded({ ...review, commitOid: review.commitOid ?? '' });

// A skip marker declares that no review occurred: it satisfies no leg and
// carries no finding prose. A structured review whose FINDING quotes the
// phrase is not a skip marker — its items prove a review occurred.
export const skipOnly = (review: Review): boolean =>
  isSkipMarker(review.body) && extractBodyFindings(review).items.length === 0;

// GitHub logins are case-insensitive (the reviewer-leg comparison does the same).
export const sameLogin = (left: string, right: string): boolean =>
  left.toLowerCase() === right.toLowerCase();

// A thread's disposition is its last signed reply; failing one, the latest
// signed `thread <id>` line that collapsed a body item onto it.
// The quiet window (state machine item 4): more than QUIET_WINDOW_MS since the
// latest landed review binding the head. No anchoring review, or one whose
// submission time is missing (it could be the newest), makes the anchor
// unknowable: the head stays open, as `pr-watch`'s quietWindowAnchor holds it.
export function quietWindowElapsed(reviews: readonly Review[], now: string | undefined): boolean {
  const times = reviews.map((review) => Date.parse(review.submittedAt));
  if (times.length === 0 || !times.every(Number.isFinite)) {
    return false;
  }
  if (now === undefined) {
    return true;
  }
  return Date.parse(now) - Math.max(...times) > QUIET_WINDOW_MS;
}

// GitHub creates an empty review record for every inline reply; the seat's
// signed replies' records must anchor nothing. Only replies: a signed OPENING
// comment is a reviewer's finding, and its review anchors as any other.
export function selfReplyReviewIds(harvest: RecordedHarvest): ReadonlySet<string> {
  return new Set(
    harvest.reviewThreads
      .flatMap((thread) => thread.comments.slice(1))
      .filter((comment) => comment.reviewId !== null && isSignedSelfReply(comment.body))
      .map((comment) => comment.reviewId ?? ''),
  );
}
