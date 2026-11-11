/**
 * Per-(reviewer, tip) leg computation for `pr state`, executing the
 * pr-lifecycle SKILL review-round state machine item 3 (the SKILL stays
 * canonical): each EXPECTED reviewer's leg reads SATISFIED, SKIPPED, or OWED,
 * evaluated against the FULL review harvest — never the per-author
 * `latestReviews` pointer, which moves BACKWARDS when an older-tip review job
 * completes after a newer push (the false-silent-wait class).
 *
 * The expected reviewer set is a DECLARED input (SKILL: read from the
 * repository's automatic-review configuration, declared by the shepherd) —
 * the caller supplies it; this module never infers it from who happened to
 * review.
 */

import { bindingNote, reviewBinds, standingReviews, unboundNote } from './content-binding.js';
import type { BindingHead } from './content-binding.js';
import { normaliseLogin } from './logins.js';
import { COPILOT_REVIEWER_LOGIN, type ReviewConfiguration } from './review-configuration.js';
import { roundAwaiter, type RoundRequest } from './round-requests.js';
import { isScopeDeclaredSkip, isSkipMarker } from './skip-markers.js';
import { isVendorErrorReview, vendorErrorNote } from './vendor-error-reviews.js';

/** One review from the full paginated harvest (`reviews` connection). */
export interface HarvestedReview {
  readonly author: string;
  /** `APPROVED` | `CHANGES_REQUESTED` | `COMMENTED` | `DISMISSED` | … */
  readonly state: string;
  readonly body: string;
  /** Empty when gh omits the reviewed commit. */
  readonly commitOid: string;
  readonly submittedAt: string;
}

/**
 * One expected reviewer's leg for the current tip. A SKIPPED leg carries its
 * reason STRUCTURALLY — settlement classifies on `skipReason`, never on the
 * prose `detail` (security D1, 2026-08-06): a quota skip is an owner-ruled
 * settled state, while a timeout skip means THAT expected reviewer never
 * reviewed this tip and must never read merge-eligible — other legs in the
 * same round may well be SATISFIED.
 */
export type ReviewerLeg =
  | {
      readonly reviewer: string;
      /** UNOWED: the configuration reviews no later push and nothing is requested on this tip. */
      readonly state: 'SATISFIED' | 'OWED' | 'UNOWED';
      readonly detail: string;
    }
  | {
      readonly reviewer: string;
      readonly state: 'SKIPPED';
      readonly skipReason: 'quota' | 'timeout';
      readonly detail: string;
    };

export interface ComputeReviewerLegsInput extends BindingHead {
  readonly expectedReviewers: readonly string[];
  readonly reviews: readonly HarvestedReview[];
  readonly reviewRequests: readonly string[];
  /** Every round asked of a reviewer, from the pull request's history (`round-requests.ts`). */
  readonly roundRequests: readonly RoundRequest[];
  /** Max completedAt across green checks; null while checks are not yet green. */
  readonly checksGreenAt: string | null;
  /** Injected clock (ISO) — the quiet-window and timeout legs are time-bound. */
  readonly now: string;
  /** The base branch's automatic-review configuration; `unread` keeps every leg owed. */
  readonly reviewConfiguration: ReviewConfiguration;
}

/** SKILL item 3/4: the checks-green timeout and settled quiet window (more than 10 min). */
export const QUIET_WINDOW_MS = 10 * 60 * 1000;

// A PENDING (draft, unsubmitted) review has not landed: it must neither
// satisfy a leg nor act as a skip marker.
export function hasLanded(review: HarvestedReview): boolean {
  return review.state !== 'PENDING';
}

// Signed self-authored disposition replies posted through the shared owner
// credential carry the PDR-027 identity-tuple signature ("— <name> (<hex6>)")
// on their FINAL line; the canonical contract excludes them from quiet-window
// anchoring and they must not pollute a defaulted expected-reviewer set. The
// check is two linear probes, not one ambiguous regex (S8786 backtracking).
// The canonical parenthesised field is the BARE session_id_prefix (the join
// key — pr-lifecycle SKILL); the optional `-hex3` arm additionally tolerates
// the MCP-145 display token a seat may paste from a rendered surface (the id
// tail can be uppercase: stored ids are lowercase but externally-parsed
// blocks are rendered verbatim). The prefix arm deliberately stays exactly
// six lowercase hex and is NEVER widened toward the schema-unbounded prefix
// domain: a false POSITIVE here is silently destructive at all three
// consumers — it removes the reply from quiet-window anchoring and from
// body-tally evidence (settlement.ts) and, most dangerously, drops its
// author from the DEFAULTED expected-reviewer set (state-gh.ts), which can
// settle a round without a real reviewer — while a false NEGATIVE costs a
// bounded wait at two consumers (timeout arm; re-anchored quiet window)
// plus one wrong body-tally evidence line at the third — so the ratified
// non-hex,
// uppercase-prefix, and hyphen-bearing-prefix rows (the 2a token table in
// tests/collaboration-state/visual-disambiguator.unit.test.ts) are
// deliberate non-matches, and this stays a predicate, never an extractor
// (the token is non-injective; no decode of it can be correct). Reviewer-leg
// SATISFACTION is deliberately unfiltered: a signed self-reply by a DECLARED
// expected reviewer still satisfies that leg — the exclusion binds only the
// anchor, the body tally, and the defaulted set.
const SIGNATURE_SUFFIX = /\([0-9a-f]{6}(?:-[0-9a-fA-F]{3})?\)$/u;

export function isSignedSelfReply(body: string): boolean {
  const lastLine = (body.trimEnd().split('\n').at(-1) ?? '').trim();
  return lastLine.startsWith('—') && SIGNATURE_SUFFIX.test(lastLine);
}

/**
 * A tip the configuration does not review: the base branch's Copilot rule
 * reviews no later push (`review_on_push` false), the vendor has already
 * reviewed an earlier tip of this pull request (its one configured review
 * happened; before it, the leg stays owed so the first review is awaited
 * rather than raced), and no round is asked of it since that review: not a
 * pending request GitHub lists, and not a round asked at or after the
 * standing review landed, read from the pull request's history
 * (`round-requests.ts`), since this estate's pending-request surface never
 * lists a bot. The leg then settles as UNOWED, and a round whose threads are
 * all resolved settles; a review wanted on such a tip is requested by hand,
 * and the request makes the leg owed again. Binds Copilot's leg only: the
 * rule is Copilot's. Applies only to a tip the vendor has said nothing
 * about: any body bound to this tip (a substantive review, a quota marker,
 * an unevaluable marker after a failed request) is classified by the arms
 * built for it, never by the configuration's silence.
 */
function unowedByConfiguration(
  input: ComputeReviewerLegsInput,
  reviewer: string,
  tipBound: readonly HarvestedReview[],
  awaits: (review: { readonly submittedAt: string }) => boolean,
): ReviewerLeg | undefined {
  const configuration = input.reviewConfiguration;
  if (tipBound.length > 0 || configuration.kind !== 'configured' || configuration.reviewOnPush) {
    return undefined;
  }
  if (normaliseLogin(reviewer) !== COPILOT_REVIEWER_LOGIN) {
    return undefined;
  }
  const standing = input.reviews
    .filter(
      (review) =>
        normaliseLogin(review.author) === normaliseLogin(reviewer) &&
        hasLanded(review) &&
        !isSkipMarker(review.body) &&
        review.commitOid !== '',
    )
    .sort((left, right) => left.submittedAt.localeCompare(right.submittedAt))
    .at(-1);
  if (standing === undefined || awaits(standing)) {
    return undefined;
  }
  return {
    reviewer,
    state: 'UNOWED',
    detail:
      'not owed on this tip: the base branch reviews no later push (copilot_code_review review_on_push=false), the vendor reviewed an earlier tip of this pull request, and no round is asked of it since; request a review by hand when one is wanted',
  };
}

function elapsedMs(fromIso: string, nowIso: string): number {
  return Date.parse(nowIso) - Date.parse(fromIso);
}

// An EMPTY body says nothing, so it satisfies no leg: the API creates a review
// with an empty body under the REPLIER's identity for every thread reply. The
// pr-lifecycle SKILL item 3 carries the rule and its recorded instances.
function isSubstantive(review: HarvestedReview): boolean {
  return hasBody(review) && !isSkipMarker(review.body);
}

function hasBody(review: HarvestedReview): boolean {
  return review.body.trim() !== '';
}

// Discarded evidence is COUNTED: a predicate over a filtered set says how many
// items it filtered, or an empty set reads the same as a satisfied one.
function emptyBodyNote(tipBound: readonly HarvestedReview[]): string {
  const empties = tipBound.filter((review) => review.body.trim() === '').length;
  if (empties === 0) {
    return '';
  }
  return `; ${String(empties)} tip-bound empty-bodied review${empties === 1 ? '' : 's'} ignored (a thread reply creates one)`;
}

function legFor(input: ComputeReviewerLegsInput, reviewer: string): ReviewerLeg {
  const own = input.reviews.filter(
    (review) => normaliseLogin(review.author) === normaliseLogin(reviewer) && hasLanded(review),
  );
  const awaits = roundAwaiter(reviewer, input.reviewRequests, input.roundRequests);
  const bound = own.filter((review) => reviewBinds(review, input));
  const tipBound = standingReviews(bound, input, awaits);
  const note = emptyBodyNote(tipBound) + vendorErrorNote(tipBound.map((review) => review.body));
  const reviewed = tipBound.filter((review) => !isVendorErrorReview(review.body));
  const substantive = reviewed.filter(isSubstantive);
  if (substantive.length > 0) {
    const detail = `substantive review binds current tip${bindingNote(substantive, input)}${note}`;
    return { reviewer, state: 'SATISFIED', detail };
  }
  const quota = reviewed.filter((review) => isScopeDeclaredSkip(review.body));
  if (quota.length > 0) {
    return {
      reviewer,
      state: 'SKIPPED',
      skipReason: 'quota',
      detail: `tip-bound quota/skip marker (scope-declared; owner ruling 2026-07-21)${bindingNote(quota, input)}${note}`,
    };
  }
  const unowed = unowedByConfiguration(input, reviewer, tipBound, awaits);
  if (unowed !== undefined) {
    return unowed;
  }
  return unservedLeg({ input, reviewer, reviewed, own, awaits, note });
}

/** A leg no substantive review serves: ended by the checks-green timeout arm, else OWED. */
function unservedLeg(leg: {
  readonly input: ComputeReviewerLegsInput;
  readonly reviewer: string;
  readonly reviewed: readonly HarvestedReview[];
  readonly own: readonly HarvestedReview[];
  readonly awaits: ReturnType<typeof roundAwaiter>;
  readonly note: string;
}): ReviewerLeg {
  const { input, reviewer, reviewed, own, awaits, note } = leg;
  const unevaluableMarker = reviewed.some((review) => isSkipMarker(review.body));
  const qualifier = unevaluableMarker || note !== '' ? 'substantive ' : '';
  if (input.checksGreenAt !== null && elapsedMs(input.checksGreenAt, input.now) > QUIET_WINDOW_MS) {
    return {
      reviewer,
      state: 'SKIPPED',
      skipReason: 'timeout',
      detail: `timeout: no ${qualifier}tip-bound review one quiet window after checks green (${input.checksGreenAt})${note}`,
    };
  }
  const owedDetail = unevaluableMarker
    ? 'tip-bound skip marker with unevaluable scope — no substantive review; awaiting the timeout arm'
    : `no substantive review binds the current tip${unboundNote(own.filter(hasBody), input, awaits)}`;
  return { reviewer, state: 'OWED', detail: `${owedDetail}${note}` };
}

/** Compute every expected reviewer's leg for the current tip, in declared order. */
export function computeReviewerLegs(input: ComputeReviewerLegsInput): ReviewerLeg[] {
  return input.expectedReviewers.map((reviewer) => legFor(input, reviewer));
}
