import { isSignedSelfReply } from '../pr-watch/reviewer-legs.js';
import {
  batchApplies,
  declaredRestatement,
  keyNames,
  keysNamingThread,
  readBodyDispositions,
} from './dispositions.js';
import type { BodyDispositions } from './dispositions.js';
import { extractBodyFindings } from './findings.js';
import type { BodyFinding } from './findings.js';
import type { RecordedHarvest } from './harvest.js';
import { readBarMarker } from './markers.js';
import type { BarMarker } from './markers.js';
import {
  landed,
  quietWindowElapsed,
  sameLogin,
  selfReplyReviewIds,
  skipOnly,
} from './settlement.js';

/**
 * The tally rows the pr-lifecycle state machine's item 2 specifies: one row
 * per SETTLED head in branch order, its raised count every finding bound to
 * that head (threads plus body items of every landed review, one logical
 * finding once), its cure-worthy count read from the bar markers of the
 * seat's signed dispositions — never from prose. A head is settled when every
 * expected reviewer (at least one is declared; an empty set settles nothing)
 * has a LANDED, SUBSTANTIVE review bound to it — a skip marker ("unable to
 * review") satisfies no leg — and the quiet window after the latest such
 * review has elapsed: the seat's own reply-created review records never
 * anchor that window, and a landed review with no submission time makes the
 * anchor unknowable, holding the head open as `pr-watch` does. A head bound
 * by none is superseded, a head an expected reviewer still owes is unsettled.
 * Timeout and skip settlement need the check-run history a recording does not
 * yet carry, so this builder reads SATISFIED-or-OWED only.
 *
 * THE INVARIANT every case here samples: nothing the recording does not prove
 * settles or counts. An unproven settlement input (no declared reviewer, a
 * skip marker, a missing submission time) reads unsettled; an unreadable
 * disposition (no marker, a marked line with no reference, a batched comment)
 * reads manual; a citation is never a head. A case these rounds did not name
 * is a fixture at pickup, never a mechanism edit.
 */

type Thread = RecordedHarvest['reviewThreads'][number];
type Review = RecordedHarvest['reviews'][number];

/** One head's row. `undispositioned` findings have no signed disposition; `manual` ones have one the machine cannot read. */
export interface TallyRow {
  readonly head: string;
  readonly settled: boolean;
  /** Expected reviewers with a landed review bound to this head. */
  readonly reviewers: readonly string[];
  /** Expected reviewers with no landed review bound to this head. */
  readonly owed: readonly string[];
  readonly raised: number;
  readonly cureWorthy: number;
  readonly undispositioned: number;
  readonly manual: number;
}

export interface BuildRowsInput {
  readonly harvest: RecordedHarvest;
  /** The declared expected reviewer set — never inferred from who reviewed. */
  readonly expectedReviewers: readonly string[];
  /** The evaluation clock (ISO). Absent for a recording of a closed pull request; present on a live read. */
  readonly now?: string;
}

export interface Tally {
  /** Every head in branch order — the epoch boundaries are found over all of them. */
  readonly heads: readonly string[];
  /** Settled heads, in branch order. */
  readonly rows: readonly TallyRow[];
  /** Heads with no settled round (superseded, owed, or inside the quiet window), in branch order, with their counts so far. */
  readonly unsettled: readonly TallyRow[];
}

type Disposition = BarMarker | 'manual' | 'undispositioned';

function threadDisposition(
  thread: Thread,
  review: Review | undefined,
  dispositions: BodyDispositions,
): Disposition {
  const signed = thread.comments.slice(1).filter((comment) => isSignedSelfReply(comment.body));
  const last = signed.at(-1);
  if (last !== undefined) {
    return readBarMarker(last.body) ?? 'manual';
  }
  const line =
    review === undefined ? undefined : keysNamingThread(thread, review, dispositions).at(-1);
  if (line !== undefined) {
    return line.marker ?? 'manual';
  }
  return 'undispositioned';
}

function bodyItemDisposition(
  item: BodyFinding,
  review: Review,
  dispositions: BodyDispositions,
): Disposition {
  // The latest signed line wins, as the last signed thread reply does.
  const named = dispositions.keys.findLast((key) => keyNames(key, item, review));
  if (named !== undefined) {
    return named.marker ?? 'manual';
  }
  return dispositions.batches.some((batch) => batchApplies(batch, review))
    ? 'manual'
    : 'undispositioned';
}

// ONE LOGICAL FINDING COUNTS ONCE: a body item restating an inline thread of
// the same review at the same anchor with the same substance is that thread.
function restatesThread(item: BodyFinding, review: Review, threads: readonly Thread[]): boolean {
  return threads.some(
    (thread) =>
      thread.reviewId === review.id &&
      thread.path === item.path &&
      (thread.originalLine ?? thread.line) === item.line &&
      item.substance !== '' &&
      (thread.comments[0]?.body ?? '').includes(item.substance),
  );
}

function tallyDispositions(dispositions: readonly Disposition[]): {
  cureWorthy: number;
  undispositioned: number;
  manual: number;
} {
  return {
    cureWorthy: dispositions.filter((disposition) => disposition === 'over-bar').length,
    undispositioned: dispositions.filter((disposition) => disposition === 'undispositioned').length,
    manual: dispositions.filter((disposition) => disposition === 'manual').length,
  };
}

function bodyItemDispositions(
  review: Review,
  threads: readonly Thread[],
  dispositions: BodyDispositions,
): Disposition[] {
  const items = extractBodyFindings(review).items;
  return items
    .filter((item) => !restatesThread(item, review, threads))
    .filter((item) => !declaredRestatement(item, review, dispositions, threads, items))
    .map((item) => bodyItemDisposition(item, review, dispositions));
}

function findingsFor(
  head: string,
  harvest: RecordedHarvest,
  landedReviews: readonly Review[],
  dispositions: BodyDispositions,
): { dispositions: Disposition[]; manualBodies: number } {
  const landedIds = new Set(landedReviews.map((review) => review.id));
  // A thread counts only when its originating review landed (a PENDING draft's threads do not).
  // An opening comment is a finding whoever signs it — a signed reviewer's
  // finding is never mistaken for a disposition (only replies disposition).
  const threads = harvest.reviewThreads.filter(
    (thread) =>
      thread.reviewCommitOid === head &&
      (thread.reviewId === null || landedIds.has(thread.reviewId)),
  );
  const reviews = landedReviews.filter((review) => !skipOnly(review));
  const bodyItems = reviews.flatMap((review) =>
    bodyItemDispositions(review, threads, dispositions),
  );
  const manualBodies = reviews.filter((review) => extractBodyFindings(review).manual).length;
  const threadDispositions = threads.map((thread) =>
    threadDisposition(
      thread,
      landedReviews.find((review) => review.id === thread.reviewId),
      dispositions,
    ),
  );
  return { dispositions: [...threadDispositions, ...bodyItems], manualBodies };
}

function rowFor(
  head: string,
  input: BuildRowsInput,
  dispositions: BodyDispositions,
  selfReviews: ReadonlySet<string>,
): TallyRow {
  const { harvest, expectedReviewers, now } = input;
  const bound = harvest.reviews.filter((review) => review.commitOid === head && landed(review));
  const reviewers = expectedReviewers.filter((login) =>
    bound.some((review) => sameLogin(review.author, login) && !skipOnly(review)),
  );
  const owed = expectedReviewers.filter((login) => !reviewers.includes(login));
  const anchoring = bound.filter((review) => !selfReviews.has(review.id));
  const found = findingsFor(head, harvest, bound, dispositions);
  const counts = tallyDispositions(found.dispositions);
  return {
    head,
    settled: reviewers.length > 0 && owed.length === 0 && quietWindowElapsed(anchoring, now),
    reviewers,
    owed,
    raised: found.dispositions.length,
    ...counts,
    manual: counts.manual + found.manualBodies,
  };
}

/** Build the tally from a recorded harvest: every head in branch order, split into settled rows and unsettled heads. */
export function buildRows(input: BuildRowsInput): Tally {
  const dispositions = readBodyDispositions(input.harvest);
  const selfReviews = selfReplyReviewIds(input.harvest);
  const rows = input.harvest.commits.map((commit) =>
    rowFor(commit.oid, input, dispositions, selfReviews),
  );
  return {
    heads: input.harvest.commits.map((commit) => commit.oid),
    rows: rows.filter((row) => row.settled),
    unsettled: rows.filter((row) => !row.settled),
  };
}
