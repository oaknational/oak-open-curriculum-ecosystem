/**
 * The shapes of a declared-unavailable reading: what `--unavailable` names,
 * the comments, reviews and round requests the door reads, and the stand-in
 * or refusal it answers with. Split from `declared-unavailable.ts`, which
 * holds the reading itself, at the file limit; the pair imports nothing
 * else, so both estates carry the same two files byte for byte.
 *
 * @packageDocumentation
 */

/** One `--unavailable <login>=<comment-url>` declaration. */
export interface UnavailableDeclaration {
  readonly login: string;
  readonly url: string;
}

/** A conversation comment as the comments harvest carries it. */
export interface DeclarationComment {
  readonly id: string;
  readonly url: string;
  readonly author: string;
  readonly body: string;
  readonly createdAt: string;
  /** The last edit, or null for a comment never edited. */
  readonly lastEdit: { readonly at: string; readonly by: string } | null;
}

/** A reviewer's reported result, from either transport. */
export interface DeclarationReview {
  readonly author: string;
  readonly state: string;
  readonly body: string;
  readonly commitOid: string;
  readonly submittedAt: string;
}

/** A round asked of a reviewer, and when. */
interface DeclarationRequest {
  readonly reviewer: string;
  readonly at: string;
}

export interface ReadDeclaredStandInsInput {
  readonly declarations: readonly UnavailableDeclaration[];
  readonly comments: readonly DeclarationComment[];
  /** The bot's login: only its comments declare. */
  readonly poster: string;
  readonly expectedReviewers: readonly string[];
  /** Every reported result, stand-ins excluded. */
  readonly reviews: readonly DeclarationReview[];
  readonly requests: readonly DeclarationRequest[];
  /** Whether a body is a recorded vendor error review. */
  readonly isErrorReview: (body: string) => boolean;
  /** The reading's clock (ISO). */
  readonly now: string;
}

/** What on the timeline shows the vendor could not review. */
export interface UnavailabilityProof {
  readonly kind: 'error-review' | 'unanswered-request';
  readonly at: string;
}

/** A declaration read as the vendor's result for the named head. */
export interface DeclaredStandIn extends DeclarationReview {
  readonly id: string;
  readonly url: string;
  readonly transport: 'declared-stand-in';
  readonly proof: UnavailabilityProof;
}

export type DeclarationRefusal =
  | 'names a reviewer that is not expected'
  | 'names no comment on this pull request'
  | 'was posted by an account other than the bot'
  | 'was edited by an account other than its author'
  | 'does not open with the unavailability marker for this reviewer'
  | 'meets a review from that reviewer since the declaration'
  | 'shows no unavailability on the timeline: no error review on the named head, and no request unanswered for over sixty minutes';

export interface RefusedDeclaration {
  readonly login: string;
  readonly url: string;
  readonly refusal: DeclarationRefusal;
}

export interface DeclaredUnavailableReading {
  readonly standIns: readonly DeclaredStandIn[];
  readonly refused: readonly RefusedDeclaration[];
}
