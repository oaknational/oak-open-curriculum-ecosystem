import { isSignedSelfReply } from '../pr-watch/reviewer-legs.js';
import { parseDispositionLine } from './disposition-line.js';
import type { DispositionLine } from './disposition-line.js';
import type { BodyFinding } from './findings.js';
import type { RecordedHarvest } from './harvest.js';
import { readBarMarker } from './markers.js';
import type { BarMarker } from './markers.js';

/**
 * The seat's signed body-only dispositions, as the intake contract records
 * them: one line per finding — the marker, then
 * `head SHA:<sha> · review <id> · <path>:<line> · <item>` — in a signed issue
 * comment. A signed, marked line carrying no parseable reference is a batched
 * disposition: the heads it names read as manual for their body items.
 */

type Review = RecordedHarvest['reviews'][number];
type Thread = RecordedHarvest['reviewThreads'][number];

interface BodyDispositionKey extends DispositionLine {
  readonly marker: BarMarker | null;
}

/** A signed, marked line carrying NO parseable reference: the heads it names (none = every head) read as manual for the body items that predate it. */
interface Batch {
  readonly heads: readonly string[];
  readonly createdAt: string;
}

export interface BodyDispositions {
  readonly keys: readonly BodyDispositionKey[];
  readonly batches: readonly Batch[];
}

// A head reference is the format's `head SHA:<sha>`; a cure citation is its
// `Cured in SHA:<sha>` (bare or in a code span) and names no head. Any other
// mention is read as a head only when the comment carries no head reference
// at all (conservatively).
const HEAD_REFERENCE = /head SHA:([0-9a-f]{7,40})/gu;
const SHA_MENTION = /(?<!Cured in `?)SHA:([0-9a-f]{7,40})/gu;
const THREAD_KEY = /^thread (\S+)$/u;
const BULLET = /^-\s*/u;

function headsNamed(body: string): string[] {
  const references = [...body.matchAll(HEAD_REFERENCE)].map((match) => match[1] ?? '');
  if (references.length > 0) {
    return references;
  }
  return [...body.matchAll(SHA_MENTION)].map((match) => match[1] ?? '');
}

// The line's fields (`disposition-line.ts`) with the marker its label carries.
function parseKey(line: string): BodyDispositionKey | null {
  const fields = parseDispositionLine(line);
  return fields === null ? null : { ...fields, marker: readBarMarker(line.replace(BULLET, '')) };
}

const isMarked = (line: string): boolean => readBarMarker(line.replace(BULLET, '')) !== null;

/** Read every signed body-only disposition in the harvest's issue comments. */
export function readBodyDispositions(harvest: RecordedHarvest): BodyDispositions {
  const signed = harvest.comments.filter((comment) => isSignedSelfReply(comment.body));
  const keys = signed.flatMap((comment) =>
    comment.body
      .split('\n')
      .map(parseKey)
      .filter((key): key is BodyDispositionKey => key !== null),
  );
  // A marked line that does not parse is a batched disposition, whether or
  // not a sibling line parses: the heads it names read as manual — the
  // line's own head reference when it carries one, else its comment's.
  const batches = signed.flatMap((comment) =>
    comment.body
      .split('\n')
      .filter((line) => parseKey(line) === null && isMarked(line))
      .map((line) => {
        const own = headsNamed(line);
        return {
          heads: own.length > 0 ? own : headsNamed(comment.body),
          createdAt: comment.createdAt,
        };
      }),
  );
  return { keys, batches };
}

/**
 * Whether a batch dispositions this review's unnamed items: it names the
 * review's head (or no head at all) AND was posted after the review landed —
 * a batch never reaches findings that did not exist when it was written.
 * An unreadable time on either side keeps the conservative reading.
 */
export function batchApplies(batch: Batch, review: Review): boolean {
  const head = review.commitOid ?? '';
  const names = batch.heads.length === 0 || batch.heads.some((prefix) => head.startsWith(prefix));
  const landed = Date.parse(review.submittedAt);
  const posted = Date.parse(batch.createdAt);
  const predates = !Number.isFinite(landed) || !Number.isFinite(posted) || landed < posted;
  return names && predates;
}

function sameReview(key: BodyDispositionKey, review: Review): boolean {
  const head = review.commitOid ?? '';
  return (
    head.startsWith(key.headPrefix) &&
    (key.reviewId === review.id || key.reviewId === String(review.databaseId))
  );
}

function sameAnchor(key: BodyDispositionKey, item: BodyFinding): boolean {
  return item.path === null || (key.path === item.path && key.line === item.line);
}

/** Whether a key names this item of this review: same head and review; same anchor unless the item has none; same key. */
export function keyNames(key: BodyDispositionKey, item: BodyFinding, review: Review): boolean {
  return sameReview(key, review) && sameAnchor(key, item) && key.item === item.key;
}

/**
 * Whether a signed line declares this item a restatement of a named inline
 * thread OF THE SAME REVIEW at the same anchor (the state machine's dedup
 * rule) — then the item is that thread and counts once. The declaration binds
 * only when it is unambiguous: exactly one body item of the review sits at
 * that anchor. The thread is matched at the KEY's anchor — an anchorless item
 * (a Codex heading) carries none of its own; an anchored item's anchor has
 * already been proven equal to the key's.
 */
export function declaredRestatement(
  item: BodyFinding,
  review: Review,
  dispositions: BodyDispositions,
  threads: readonly Thread[],
  siblings: readonly BodyFinding[],
): boolean {
  const atAnchor = siblings.filter(
    (sibling) => sibling.path === item.path && sibling.line === item.line,
  );
  if (atAnchor.length !== 1) {
    return false;
  }
  return threads.some(
    (thread) =>
      thread.reviewId === review.id &&
      keysNamingThread(thread, review, dispositions).some((key) => sameAnchor(key, item)),
  );
}

// A `thread <id>` line of the same review, at the thread's own anchor.
function namesThread(key: BodyDispositionKey, thread: Thread, review: Review): boolean {
  const named = THREAD_KEY.exec(key.item);
  return (
    named !== null &&
    named[1] === thread.id &&
    sameReview(key, review) &&
    thread.path === key.path &&
    (thread.originalLine ?? thread.line) === key.line
  );
}

/**
 * The signed `thread <id>` lines naming this thread, in comment order. Such a
 * line collapses a body item onto the thread AND carries a marker: when the
 * thread has no signed reply of its own, the latest line is its disposition.
 */
export function keysNamingThread(
  thread: Thread,
  review: Review,
  dispositions: BodyDispositions,
): BodyDispositionKey[] {
  return dispositions.keys.filter((key) => namesThread(key, thread, review));
}
