import {
  computeReviewerLegs,
  hasLanded,
  isSignedSelfReply,
  QUIET_WINDOW_MS,
} from './reviewer-legs.js';
import type { ReviewerLeg } from './reviewer-legs.js';
import { mostBlockingLeg } from './most-blocking-leg.js';
import type { BlockingLegVerdict } from './most-blocking-leg.js';
import { declaredEmptyEvidence, readingEvidence, settledLead } from './settlement-evidence.js';
import {
  allReviews,
  completionRefusals,
  noticeEvidence,
  transportEvidence,
  refusalDecides,
} from './completion-evidence.js';
import type { CompletionRefusal } from './completion-evidence.js';
import { bindingNote, reviewBinds } from './content-binding.js';
import { liveRunReviewers, runsEvidence, unmappedLiveRunEvidence } from './run-evidence.js';
import type { PrStateReading, PrVerdict } from './state-types.js';
import { isVendorErrorReview } from './vendor-error-reviews.js';

/**
 * The reviewer-leg and settlement half of the `pr state` verdict (SKILL items
 * 3–4): per-expected-reviewer legs over BOTH transports of a reviewer's
 * result (the review object and the completion comment), the most-blocking
 * OWED leg, and the settled path with its quiet window (more than 10 minutes
 * since the latest tip-bound review — declaring SETTLE-READY inside the
 * window recreates the bot-round-still-composing hole).
 */

function legLine(leg: ReviewerLeg): string {
  return `${leg.reviewer}: ${leg.state} — ${leg.detail}`;
}

// SKILL item 4: the quiet window anchors on the latest LANDED review binding
// the tip — excluding PENDING drafts, signed self-authored replies, and EMPTY
// bodies. The window is a proxy for "a reviewer may still be composing", so it
// must measure REVIEWER activity; an empty-bodied review is the thread-reply
// artefact (the API creates one per reply under the replier's identity), and
// anchoring on it measures the seat's own dispositioning instead (worked
// instance 2026-09-15, #147: the anchor sat on the seat's own empty-bodied
// reply seven minutes after the round's last real review, which no signature
// could catch); nor is a vendor error review activity. With no
// tip-bound review (every leg SKIPPED, or none expected), it anchors on checks-green.
// A set DECLARED empty awaits no reviewer: its window is the settle period after
// checks green alone, and a review that lands neither opens nor extends it.
function quietWindowAnchor(reading: PrStateReading): string | null {
  if (reading.expectedDeclared && reading.expectedReviewers.length === 0) {
    return reading.checksGreenAt;
  }
  const tipBound = allReviews(reading)
    .filter((review) => reviewBinds(review, reading))
    .filter((review) => review.state !== 'PENDING' && !isSignedSelfReply(review.body))
    .filter((review) => review.body.trim() !== '' && !isVendorErrorReview(review.body));
  // An eligible review whose submittedAt gh omitted could be NEWER than
  // every timestamped one — anchoring past it would settle inside its
  // window, so the anchor is unknowable (null routes to the held-open path).
  if (tipBound.some((review) => review.submittedAt === '')) {
    return null;
  }
  const tipBoundTimes = tipBound
    .map((review) => review.submittedAt)
    .sort((left, right) => left.localeCompare(right));
  return tipBoundTimes.at(-1) ?? reading.checksGreenAt;
}

// SKILL item 2: findings count from BOTH harvest surfaces — review threads
// AND review bodies bound to the tip; a summary-only review carrying findings
// in its body otherwise never enters the round count. The instrument cannot
// classify prose as findings (a CLEAN Copilot round also posts a non-empty
// summary body — refusing settlement on body PRESENCE would deadlock every
// landing), so settlement stays leg-driven and the evidence hands the reader
// the exact body-tally inputs instead.
// Findings arrive on the review object; a completion comment carries none to
// tally (a summary's completed row says a review ran, and any findings it
// filed are review objects).
function bodyTallyEvidence(reading: PrStateReading): string[] {
  return reading.reviews
    .filter((review) => reviewBinds(review, reading))
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .filter((review) => review.body.trim() !== '' && !isVendorErrorReview(review.body))
    .map(
      (review) =>
        `tip-bound review body present: ${review.author} (${review.state})${bindingNote([review], reading)} — tally body findings (SKILL item 2) before reading this round as zero-finding`,
    );
}

function settledVerdict(input: {
  readonly reading: PrStateReading;
  readonly legs: readonly ReviewerLeg[];
  readonly now: string;
}): PrVerdict {
  const { reading, legs, now } = input;
  const shared = [
    ...legs.map((leg) => legLine(leg)),
    ...declaredEmptyEvidence(reading),
    ...transportEvidence(reading),
    ...noticeEvidence(reading),
    ...bodyTallyEvidence(reading),
    ...readingEvidence(reading),
  ];
  const anchor = quietWindowAnchor(reading);
  const anchorMs = anchor === null ? Number.NaN : Date.parse(anchor);
  // A missing or unparseable anchor holds the window OPEN (conservative
  // direction): settlement without a provable quiet window is the
  // bot-round-still-composing hole again.
  if (Number.isNaN(anchorMs)) {
    return {
      state: 'SETTLING-QUIET-WINDOW',
      evidence: ['no parseable quiet-window anchor — window held open conservatively', ...shared],
    };
  }
  if (Date.parse(now) - anchorMs <= QUIET_WINDOW_MS) {
    return {
      state: 'SETTLING-QUIET-WINDOW',
      evidence: [`quiet window open until more than 10 min after ${anchor}`, ...shared],
    };
  }
  const skipped = skippedRoundVerdict(legs, shared);
  if (skipped !== undefined) {
    return skipped;
  }
  return { state: 'SETTLE-READY', evidence: [settledLead(reading), ...shared] };
}

/**
 * A settled round carrying SKIPPED legs is classified STRUCTURALLY on the
 * skip reason: quota skips take the owner-ruled QUOTA-SKIPPED state, and
 * timeout skips take SETTLED-NO-REVIEW — the timeout arm exists so a WATCH
 * can end rather than hang forever, and must never launder "nobody reviewed"
 * into merge-eligibility (security D1, 2026-08-06).
 */
function skippedRoundVerdict(
  legs: readonly ReviewerLeg[],
  shared: readonly string[],
): PrVerdict | undefined {
  if (legs.some((leg) => leg.state === 'SKIPPED' && leg.skipReason === 'quota')) {
    return {
      state: 'QUOTA-SKIPPED',
      evidence: [
        'round settled with a quota-skipped reviewer leg (owner ruling 2026-07-21)',
        ...shared,
      ],
    };
  }
  if (legs.some((leg) => leg.state === 'SKIPPED' && leg.skipReason === 'timeout')) {
    return {
      state: 'SETTLED-NO-REVIEW',
      evidence: [
        'round settled by TIMEOUT — an expected reviewer never reviewed this tip; not merge-eligible for a code-class pull request',
        ...shared,
      ],
    };
  }
  return undefined;
}

// An UNDECLARED empty expected set can never settle (SKILL CRITICAL first-round
// rule: an initial tip must not read merge-ready before the first bot round).
// Fires when --expect is undeclared and nothing is observable yet; a set
// DECLARED empty (`--expect none`, expect-flag.ts) is the seat's judgement that
// the work needs no review, and settles through the quiet window instead.
function emptyExpectedSetVerdict(reading: PrStateReading): PrVerdict {
  return {
    state: 'SILENT-WAIT-NO-REVIEWER',
    evidence: [
      'expected reviewer set is EMPTY (undeclared and nothing observed on an initial tip) — declare --expect, a login per configured reviewer or none when the work needs no review; the first-round guarantee cannot hold vacuously',
      ...runsEvidence(reading),
    ],
  };
}

/** Resolve the reviewer-leg half of the verdict for an otherwise-green PR. */
export function reviewerLegVerdict(reading: PrStateReading, now: string): PrVerdict {
  if (reading.expectedReviewers.length === 0 && !reading.expectedDeclared) {
    return emptyExpectedSetVerdict(reading);
  }
  const legs = computeReviewerLegs({
    headRefOid: reading.headRefOid,
    content: reading.content,
    expectedReviewers: reading.expectedReviewers,
    reviews: allReviews(reading),
    reviewRequests: reading.reviewRequests,
    roundRequests: reading.roundRequests,
    checksGreenAt: reading.checksGreenAt,
    now,
    reviewConfiguration: reading.reviewConfiguration,
  });
  const blocking = mostBlockingLeg({
    legs,
    reviewRequests: reading.reviewRequests,
    liveRunReviewers: liveRunReviewers(reading),
    // A truncated list cannot support deadness: the missing run may be the
    // very one that fell off the window (presence stays evidence via
    // liveRunReviewers above).
    runsReadable: reading.reviewRuns.kind === 'read' && reading.reviewRuns.truncated !== true,
  });
  // An expected reviewer's comment that fails a precondition, on a leg the
  // tip has not answered, is a near-miss the verdict quotes rather than
  // reading as silence. It decides the verdict when the round is otherwise
  // settled or when it is the blocking reviewer's; a live run outranks it.
  const refusals = completionRefusals(reading, legs);
  if (refusalDecides(blocking, refusals)) {
    return unclassifiedVerdict(reading, legs, refusals);
  }
  if (blocking.kind === 'settled') {
    return settledVerdict({ reading, legs, now });
  }
  return blockedVerdict({ reading, legs, blocking, refusals });
}

function unclassifiedVerdict(
  reading: PrStateReading,
  legs: readonly ReviewerLeg[],
  refusals: readonly CompletionRefusal[],
): PrVerdict {
  return {
    state: 'UNCLASSIFIED-EVIDENCE',
    evidence: [
      ...refusals.map((refusal) => refusal.line),
      ...legs.map((leg) => legLine(leg)),
      ...transportEvidence(reading),
      ...noticeEvidence(reading),
      ...readingEvidence(reading),
    ],
  };
}

function blockedVerdict(input: {
  readonly reading: PrStateReading;
  readonly legs: readonly ReviewerLeg[];
  readonly blocking: Exclude<BlockingLegVerdict, { kind: 'settled' }>;
  readonly refusals: readonly CompletionRefusal[];
}): PrVerdict {
  const { reading, legs, blocking, refusals } = input;
  return {
    state: blocking.kind,
    evidence: [
      `most blocking reviewer leg: ${blocking.reviewer}`,
      ...legs.filter((leg) => leg.state === 'OWED').map((leg) => legLine(leg)),
      ...transportEvidence(reading),
      ...noticeEvidence(reading),
      ...refusals.map((refusal) => refusal.line),
      ...unmappedLiveRunEvidence(reading, blocking.kind),
      ...readingEvidence(reading),
    ],
  };
}
