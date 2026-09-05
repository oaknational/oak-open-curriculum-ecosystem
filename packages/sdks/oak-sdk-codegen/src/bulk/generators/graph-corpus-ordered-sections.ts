/**
 * The corpus's ORDERED sections — the shapes that carry curriculum order.
 *
 * @remarks
 * Separated from the node/edge vocabulary because they exist for one reason:
 * the corpus `edges` array is sorted by (type, source, target) for a
 * deterministic artefact, so it is a set and cannot express order. Anything
 * Oak authors as a sequence therefore lives here instead — thread→unit
 * progressions (`GraphCorpusSequence`) and unit→lesson teaching order
 * (`GraphCorpusUnitLessonRun`).
 */
import type {
  GraphCorpusLessonNodeId,
  GraphCorpusThreadNodeId,
  GraphCorpusUnitNodeId,
} from './graph-corpus-node-ids.js';

/**
 * One unit's placement in a thread's subject sequence (G3): `year` is the
 * teaching year (`undefined` for an "All years" unit). A unit may recur in
 * one sequence at distinct years (a revisited concept). Ordering cannot ride
 * the attribute-less corpus edges, so the sequence section is the ordered
 * projection's source.
 */
export interface GraphCorpusSequencePlacement {
  readonly unitId: GraphCorpusUnitNodeId;
  readonly year: number | undefined;
}

/**
 * One thread's units within ONE subject, in that subject's curriculum order:
 * years ascending, Oak's authored unit order within a year (the bulk
 * `sequence` array's order, the API's `unitOrder`), "All years" units last.
 * A thread is a tag; a thread spanning several subjects emits one sequence
 * per subject, never an interleaved chain — Oak authors no order across
 * subjects.
 */
export interface GraphCorpusSequence {
  readonly threadId: GraphCorpusThreadNodeId;
  readonly subject: string;
  readonly placements: readonly GraphCorpusSequencePlacement[];
}

/**
 * One unit's lessons in Oak's authored teaching order — the lesson-level
 * sibling of {@link GraphCorpusSequence}, and for the same reason: the corpus
 * `edges` array is sorted by (type, source, target) for a deterministic
 * artefact, so it is a SET and cannot carry order. A run's membership is
 * exactly the unit's `containsLesson` edges, so the two can never disagree.
 *
 * The order is the bulk `unitLessons[].lessonOrder` (the API's per-unit lesson
 * order). A unit node merges the programme variants that share its slug, and
 * variants may place one lesson at different positions, so the key is the
 * MINIMUM order the lesson holds in any variant, tie-broken by lesson id. A
 * lesson the variants never order (a placement present in the lesson records
 * but absent from every `unitLessons` list) follows the ordered ones.
 */
export interface GraphCorpusUnitLessonRun {
  readonly unitId: GraphCorpusUnitNodeId;
  readonly lessonIds: readonly GraphCorpusLessonNodeId[];
}

/**
 * Orders two positional ranks, where an absent position is represented by
 * `Number.POSITIVE_INFINITY` so it sorts last.
 *
 * @remarks
 * Subtracting the ranks directly would be correct for finite values but
 * returns `NaN` when BOTH are infinite — two "All years" units, or two lessons
 * the programme variants never ordered. Today that happens to work, because
 * `NaN` is falsy and the caller's `||` chain falls through to its tie-break;
 * it would break silently the moment a caller returned the difference from an
 * explicit non-zero check instead, since `NaN !== 0` is true. Comparing rather
 * than subtracting removes the trap: equal ranks (infinite or not) return 0,
 * and the tie-break decides.
 *
 * @param a - The first rank; `Number.POSITIVE_INFINITY` for "no position".
 * @param b - The second rank.
 * @returns -1, 0 or 1 — never `NaN`.
 */
export function compareRank(a: number, b: number): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}
