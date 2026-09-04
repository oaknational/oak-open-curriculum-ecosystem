/**
 * Unit→lesson run construction — Oak's authored teaching order for the lessons
 * of each unit, as an ordered section beside the corpus's sorted edge set.
 *
 * @remarks
 * The corpus `edges` array is sorted by (type, source, target) for a
 * deterministic artefact, so it is a SET: it records THAT a unit contains a
 * lesson, never in what order. The thread sequences already solved the same
 * problem at unit granularity (`GraphCorpusSequence`); this is the
 * lesson-granular sibling, built the same way and for the same reason.
 *
 * Membership comes from the `containsLesson` edges rather than from the bulk
 * `unitLessons` lists, so a run can never disagree with the edge set. The two
 * sources do not cover the same pairs: measured on the 2026-09-03 snapshot, 79
 * (unit, lesson) placements appear in the lesson records but in no
 * `unitLessons` list, and 40 appear only in `unitLessons` — the latter naming
 * lessons that have no lesson node at all, which would dangle. Taking
 * membership from the edges keeps both faults out.
 */

import type { ExtractedUnitLessons } from '../extractors/index.js';

import { compareRank } from './graph-corpus-ordered-sections.js';
import {
  lessonNodeId,
  unitNodeId,
  type GraphCorpusEdge,
  type GraphCorpusLessonNodeId,
  type GraphCorpusNodeId,
  type GraphCorpusUnitLessonRun,
  type GraphCorpusUnitNodeId,
} from './graph-corpus-types.js';

/** Narrows a corpus node id to a lesson id (the `containsLesson` target kind). */
function isLessonNodeId(id: GraphCorpusNodeId): id is GraphCorpusLessonNodeId {
  return id.startsWith('lesson:');
}

/** Narrows a corpus node id to a unit id (the `containsLesson` source kind). */
function isUnitNodeId(id: GraphCorpusNodeId): id is GraphCorpusUnitNodeId {
  return id.startsWith('unit:');
}

/**
 * The authored position of each (unit, lesson) placement: the MINIMUM
 * `lessonOrder` the pair holds across the programme variants sharing the unit
 * slug.
 *
 * @remarks
 * A unit node merges its programme variants (tiers, exam boards, pathways),
 * and a variant may place one lesson at a different position than another —
 * 172 of 13,964 pairs on the 2026-09-03 snapshot, spread a median of 1
 * position. A single scalar cannot satisfy every variant at once, so this is
 * a BIAS, not a guarantee: taking the minimum biases a contested lesson
 * towards its earliest authored position, because seeing a foundation early
 * is the safe failure where seeing it late is the harmful one. It does not
 * promise a lesson never sorts later than some programme places it —
 * conflicting minima and the lesson-id tie-break both leave residual
 * inversions, 75 of 56,238 comparable within-programme pairs on this
 * snapshot. `max`, `mean` and `first-seen` were measured on the same test and
 * land within 0.06 percentage points; `min` was chosen on explicability, and
 * `first-seen` rejected as dependent on file enumeration order.
 *
 * One dependency worth naming: `extractUnitLessons` backfills a missing
 * `lessonOrder` with the lesson's index in the bulk array, so a position that
 * reaches here is not always an authored one. That fallback is inert on the
 * 2026-09-03 snapshot (0 of 16,741 rows lack an order) but it is the same
 * file-order dependence this section's sort key deliberately avoids, so if it
 * ever fires the position it supplies is positional, not authored.
 */
function buildAuthoredPositions(
  unitLessons: readonly ExtractedUnitLessons[],
): ReadonlyMap<GraphCorpusUnitNodeId, ReadonlyMap<GraphCorpusLessonNodeId, number>> {
  const positions = new Map<GraphCorpusUnitNodeId, Map<GraphCorpusLessonNodeId, number>>();
  for (const unit of unitLessons) {
    const unitId = unitNodeId(unit.unitSlug);
    const forUnit = positions.get(unitId) ?? new Map<GraphCorpusLessonNodeId, number>();
    for (const lesson of unit.lessons) {
      if (lesson.lessonOrder === null) {
        continue;
      }
      const lessonId = lessonNodeId(lesson.lessonSlug);
      const existing = forUnit.get(lessonId);
      if (existing === undefined || lesson.lessonOrder < existing) {
        forUnit.set(lessonId, lesson.lessonOrder);
      }
    }
    positions.set(unitId, forUnit);
  }
  return positions;
}

/** Groups the `containsLesson` edge targets under their unit, membership only. */
function collectPlacements(
  edges: readonly GraphCorpusEdge[],
): ReadonlyMap<GraphCorpusUnitNodeId, readonly GraphCorpusLessonNodeId[]> {
  const byUnit = new Map<GraphCorpusUnitNodeId, GraphCorpusLessonNodeId[]>();
  for (const edge of edges) {
    if (
      edge.type !== 'containsLesson' ||
      !isUnitNodeId(edge.source) ||
      !isLessonNodeId(edge.target)
    ) {
      continue;
    }
    const existing = byUnit.get(edge.source);
    if (existing) {
      existing.push(edge.target);
    } else {
      byUnit.set(edge.source, [edge.target]);
    }
  }
  return byUnit;
}

/** The ordered runs plus the provenance of units the variants never ordered. */
export interface UnitLessonRunBuild {
  readonly runs: readonly GraphCorpusUnitLessonRun[];
  /**
   * Units whose lessons carry NO authored position at all, because the unit
   * appears in no `unitLessons` listing. Their run falls back to lesson-id
   * order — the very failure this section exists to remove — so the count is
   * emitted as a stat rather than left silent. Zero on the 2026-09-03
   * snapshot; a non-zero value means upstream dropped a unit from its
   * programme listings while its lessons survived.
   */
  readonly unitsWithoutAuthoredLessonOrder: number;
}

/**
 * Builds one ordered lesson run per unit that contains lessons.
 *
 * @remarks
 * A lesson the variants never order sorts after every ordered lesson
 * (`Number.POSITIVE_INFINITY`), because it has no authored claim to an earlier
 * position. Lesson id is the final tie-break, which decides both the 4.6% of
 * units where two lessons legitimately share a minimum position and the
 * unordered tail — so the run is a total order and the artefact is stable
 * under input reordering.
 *
 * @param edges - The full corpus edge set; only `containsLesson` is read.
 * @param unitLessons - Per-variant lesson listings supplying authored order.
 * @returns One run per unit with at least one lesson, unit-id sorted.
 */
export function buildUnitLessonRuns(
  edges: readonly GraphCorpusEdge[],
  unitLessons: readonly ExtractedUnitLessons[],
): UnitLessonRunBuild {
  const positions = buildAuthoredPositions(unitLessons);
  const runs: GraphCorpusUnitLessonRun[] = [];
  let unitsWithoutAuthoredLessonOrder = 0;
  for (const [unitId, lessonIds] of collectPlacements(edges)) {
    const forUnit = positions.get(unitId);
    if (forUnit === undefined || forUnit.size === 0) {
      unitsWithoutAuthoredLessonOrder += 1;
    }
    const rank = (lessonId: GraphCorpusLessonNodeId): number =>
      forUnit?.get(lessonId) ?? Number.POSITIVE_INFINITY;
    runs.push({
      unitId,
      lessonIds: [...lessonIds].sort((a, b) => compareRank(rank(a), rank(b)) || a.localeCompare(b)),
    });
  }
  runs.sort((a, b) => a.unitId.localeCompare(b.unitId));
  return { runs, unitsWithoutAuthoredLessonOrder };
}
