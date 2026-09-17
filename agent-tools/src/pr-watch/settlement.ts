import {
  computeReviewerLegs,
  hasLanded,
  isSignedSelfReply,
  mostBlockingLeg,
  QUIET_WINDOW_MS,
} from './reviewer-legs.js';
import type { ReviewerLeg } from './reviewer-legs.js';
import type { PrStateReading, PrVerdict } from './state-types.js';

/**
 * The reviewer-leg and settlement half of the `pr state` verdict (SKILL items
 * 3–4): per-expected-reviewer legs over the full harvest, the most-blocking
 * OWED leg, and the settled path with its quiet window (more than 10 minutes
 * since the latest tip-bound review — declaring SETTLE-READY inside the
 * window recreates the bot-round-still-composing hole).
 */

function runsEvidence(reading: PrStateReading): string[] {
  if (reading.reviewRuns.kind === 'unavailable') {
    return [`review-run liveness unavailable: ${reading.reviewRuns.reason}`];
  }
  return reading.reviewRuns.note === undefined ? [] : [reading.reviewRuns.note];
}

function expectedSetEvidence(reading: PrStateReading): string[] {
  return reading.expectedDeclared
    ? []
    : [
        'expected reviewer set DEFAULTED from the observed surface — declare --expect for the first-round guarantee',
      ];
}

// Bounded vendor mapping: `gh agent-task` runs carry no reviewer identity, so
// a live PR-scoped run backs the legs of reviewers with an OUTSTANDING
// request (the run IS the requested round in flight); it cannot distinguish
// which of several requested reviewers it serves.
function liveRunReviewers(reading: PrStateReading): readonly string[] {
  const hasLiveRun =
    reading.reviewRuns.kind === 'read' &&
    reading.reviewRuns.runs.some((run) => run.completedAt === null);
  return hasLiveRun ? reading.reviewRequests : [];
}

function legLine(leg: ReviewerLeg): string {
  return `${leg.reviewer}: ${leg.state} — ${leg.detail}`;
}

// SKILL item 4: the quiet window anchors on the latest LANDED review binding
// the tip — excluding PENDING drafts and signed self-authored replies; on a
// tip where every leg settled via SKIPPED (no tip-bound review), it anchors
// on checks-green.
function quietWindowAnchor(reading: PrStateReading): string | null {
  const tipBound = reading.reviews
    .filter((review) => review.commitOid === reading.headRefOid)
    .filter((review) => review.state !== 'PENDING' && !isSignedSelfReply(review.body));
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
function bodyTallyEvidence(reading: PrStateReading): string[] {
  return reading.reviews
    .filter((review) => review.commitOid === reading.headRefOid)
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .filter((review) => review.body.trim() !== '')
    .map(
      (review) =>
        `tip-bound review body present: ${review.author} (${review.state}) — tally body findings (SKILL item 2) before reading this round as zero-finding`,
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
    ...bodyTallyEvidence(reading),
    ...expectedSetEvidence(reading),
    ...runsEvidence(reading),
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
  return {
    state: 'SETTLE-READY',
    evidence: ['every expected reviewer leg settled; quiet window elapsed', ...shared],
  };
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
        'round settled by TIMEOUT — an expected reviewer never reviewed this tip; not merge-eligible',
        ...shared,
      ],
    };
  }
  return undefined;
}

// An EMPTY expected set can never settle (SKILL CRITICAL first-round rule: an
// initial tip must not read merge-ready before the first bot round). Fires
// when --expect is undeclared and nothing is observable yet.
function emptyExpectedSetVerdict(reading: PrStateReading): PrVerdict {
  return {
    state: 'SILENT-WAIT-NO-REVIEWER',
    evidence: [
      'expected reviewer set is EMPTY (undeclared and nothing observed on an initial tip) — declare --expect; the first-round guarantee cannot hold vacuously',
      ...runsEvidence(reading),
    ],
  };
}

// A live run that maps to no outstanding request (app-style reviews) cannot
// back a leg; name it so SILENT-WAIT never reads as "nothing is happening".
function unmappedLiveRunEvidence(reading: PrStateReading, blockingKind: string): string[] {
  const hasUnmappedLiveRun =
    blockingKind === 'SILENT-WAIT-NO-REVIEWER' &&
    liveRunReviewers(reading).length === 0 &&
    reading.reviewRuns.kind === 'read' &&
    reading.reviewRuns.runs.some((run) => run.completedAt === null);
  return hasUnmappedLiveRun
    ? ['note: a review run IS live for this PR, unmapped to any request']
    : [];
}

/** Resolve the reviewer-leg half of the verdict for an otherwise-green PR. */
export function reviewerLegVerdict(reading: PrStateReading, now: string): PrVerdict {
  if (reading.expectedReviewers.length === 0) {
    return emptyExpectedSetVerdict(reading);
  }
  const legs = computeReviewerLegs({
    headRefOid: reading.headRefOid,
    expectedReviewers: reading.expectedReviewers,
    reviews: reading.reviews,
    reviewRequests: reading.reviewRequests,
    checksGreenAt: reading.checksGreenAt,
    now,
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
  if (blocking.kind === 'settled') {
    return settledVerdict({ reading, legs, now });
  }
  const legDetail = legs.filter((leg) => leg.state === 'OWED').map((leg) => legLine(leg));
  return {
    state: blocking.kind,
    evidence: [
      `most blocking reviewer leg: ${blocking.reviewer}`,
      ...legDetail,
      ...unmappedLiveRunEvidence(reading, blocking.kind),
      ...expectedSetEvidence(reading),
      ...runsEvidence(reading),
    ],
  };
}
