/**
 * Adapters for converting between ground truth formats.
 *
 * Converts from the per-scope ground truth types (Lesson, Unit,
 * Thread, Sequence) to the benchmark's GroundTruthEntry format
 * used by the benchmark entry runner.
 *
 * Uses a generic grouping function to eliminate per-scope duplication.
 */

import type { AllSubjectSlug, KeyStage } from '@oaknational/oak-curriculum-sdk';
import {
  LESSON_GROUND_TRUTHS,
  type LessonGroundTruth,
} from '../../src/lib/search-quality/ground-truth/index.js';
import {
  UNIT_GROUND_TRUTHS,
  type UnitGroundTruth,
} from '../../src/lib/search-quality/ground-truth/units/index.js';
import {
  THREAD_GROUND_TRUTHS,
  type ThreadGroundTruth,
} from '../../src/lib/search-quality/ground-truth/threads/index.js';
import {
  SEQUENCE_GROUND_TRUTHS,
  type SequenceGroundTruth,
} from '../../src/lib/search-quality/ground-truth/sequences/index.js';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type { GroundTruthEntry } from './benchmark-entry-runner.js';

/**
 * Common fields shared by all ground truth types.
 *
 * Every scope-specific ground truth (Lesson, Unit, Thread, Sequence)
 * has these fields. The generic adapter functions operate on this shape.
 */
interface GroundTruthBase {
  readonly subject: AllSubjectSlug;
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly description: string;
  readonly keyStage?: KeyStage;
}

/**
 * Convert any ground truth entry to a GroundTruthQuery.
 *
 * Maps the common fields and defaults category to 'basic'.
 * The `keyStage` field is passed through when present.
 *
 * @param gt - Any ground truth entry with the base fields
 * @returns Ground truth query for the benchmark entry runner
 */
function toGroundTruthQuery(gt: GroundTruthBase): GroundTruthQuery {
  return {
    query: gt.query,
    expectedRelevance: gt.expectedRelevance,
    category: 'basic',
    description: gt.description,
    keyStage: gt.keyStage,
  };
}

/**
 * Group ground truth entries by subject and phase.
 *
 * Collects ground truth entries into GroundTruthEntry groups,
 * where each group shares a subject and phase. The grouping key
 * and phase extraction are provided as callbacks to handle
 * scope-specific differences (e.g. threads default to 'secondary').
 *
 * @param groundTruths - Array of ground truth entries to group
 * @param groupKey - Derives the grouping key from an entry
 * @param groupPhase - Derives the phase from an entry
 * @returns Ground truth entries grouped by subject and phase
 */
function groupEntries<T extends GroundTruthBase>(
  groundTruths: readonly T[],
  groupKey: (gt: T) => string,
  groupPhase: (gt: T) => Phase,
): readonly GroundTruthEntry[] {
  const entriesMap = new Map<string, GroundTruthEntry>();

  for (const gt of groundTruths) {
    const key = groupKey(gt);
    const existing = entriesMap.get(key);

    if (existing) {
      entriesMap.set(key, {
        ...existing,
        queries: [...existing.queries, toGroundTruthQuery(gt)],
      });
    } else {
      entriesMap.set(key, {
        subject: gt.subject,
        phase: groupPhase(gt),
        queries: [toGroundTruthQuery(gt)],
      });
    }
  }

  return Array.from(entriesMap.values());
}

/**
 * Get all lesson ground truth entries for benchmarking.
 *
 * @returns Ground truth entries for lesson benchmarks, grouped by subject/phase
 */
export function getLessonGroundTruthEntries(): readonly GroundTruthEntry[] {
  return groupEntries(
    LESSON_GROUND_TRUTHS,
    (gt: LessonGroundTruth) => `${gt.subject}-${gt.phase}`,
    (gt: LessonGroundTruth) => gt.phase,
  );
}

/**
 * Get all unit ground truth entries for benchmarking.
 *
 * @returns Ground truth entries for unit benchmarks, grouped by subject/phase
 */
export function getUnitGroundTruthEntries(): readonly GroundTruthEntry[] {
  return groupEntries(
    UNIT_GROUND_TRUTHS,
    (gt: UnitGroundTruth) => `${gt.subject}-${gt.phase}`,
    (gt: UnitGroundTruth) => gt.phase,
  );
}

/**
 * Get all thread ground truth entries for benchmarking.
 *
 * Threads are conceptual progression strands that span multiple key stages
 * and programmes, so they are grouped by subject only. Phase defaults to
 * 'secondary' because thread content is richest in secondary Maths.
 *
 * @returns Ground truth entries for thread benchmarks, grouped by subject
 */
export function getThreadGroundTruthEntries(): readonly GroundTruthEntry[] {
  return groupEntries(
    THREAD_GROUND_TRUTHS,
    (gt: ThreadGroundTruth) => `${gt.subject}-threads`,
    () => 'secondary',
  );
}

/**
 * Get all sequence ground truth entries for benchmarking.
 *
 * @returns Ground truth entries for sequence benchmarks, grouped by subject/phase
 */
export function getSequenceGroundTruthEntries(): readonly GroundTruthEntry[] {
  return groupEntries(
    SEQUENCE_GROUND_TRUTHS,
    (gt: SequenceGroundTruth) => `${gt.subject}-${gt.phase}`,
    (gt: SequenceGroundTruth) => gt.phase,
  );
}
