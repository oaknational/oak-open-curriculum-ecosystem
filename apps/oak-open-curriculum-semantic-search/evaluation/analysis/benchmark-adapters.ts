/* eslint max-lines: [error, 275] -- Multi-index ground truth adapters for units, threads, sequences */
/**
 * Adapters for converting between ground truth formats.
 *
 * Converts from the LessonGroundTruth format to the benchmark's
 * GroundTruthEntry format used by the benchmark entry runner.
 *
 * Supports multiple index types:
 * - Lessons (LessonGroundTruth)
 * - Units (UnitGroundTruth)
 * - Threads (ThreadGroundTruth)
 * - Sequences (SequenceGroundTruth)
 *
 * @packageDocumentation
 */

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
import type { GroundTruthEntry } from './benchmark-entry-runner.js';

// =============================================================================
// Lesson Adapters (existing)
// =============================================================================

/**
 * Convert LessonGroundTruth to GroundTruthQuery format.
 */
function lessonToGroundTruthQuery(gt: LessonGroundTruth): GroundTruthQuery {
  return {
    query: gt.query,
    expectedRelevance: gt.expectedRelevance,
    category: 'basic',
    description: gt.description,
    keyStage: gt.keyStage,
  };
}

/**
 * Convert LessonGroundTruth entries to GroundTruthEntry format.
 *
 * Groups by subject/phase and converts each to a query.
 */
function convertLessonsToEntries(
  groundTruths: readonly LessonGroundTruth[],
): readonly GroundTruthEntry[] {
  const entriesMap = new Map<string, GroundTruthEntry>();

  for (const gt of groundTruths) {
    const key = `${gt.subject}-${gt.phase}`;
    const existing = entriesMap.get(key);

    if (existing) {
      // Add query to existing entry
      entriesMap.set(key, {
        ...existing,
        queries: [...existing.queries, lessonToGroundTruthQuery(gt)],
      });
    } else {
      // Create new entry
      entriesMap.set(key, {
        subject: gt.subject,
        phase: gt.phase,
        queries: [lessonToGroundTruthQuery(gt)],
      });
    }
  }

  return Array.from(entriesMap.values());
}

/**
 * Get all lesson ground truth entries for benchmarking.
 */
export function getLessonGroundTruthEntries(): readonly GroundTruthEntry[] {
  return convertLessonsToEntries(LESSON_GROUND_TRUTHS);
}

// =============================================================================
// Unit Adapters
// =============================================================================

/**
 * Convert UnitGroundTruth to GroundTruthQuery format.
 */
function unitToGroundTruthQuery(gt: UnitGroundTruth): GroundTruthQuery {
  return {
    query: gt.query,
    expectedRelevance: gt.expectedRelevance,
    category: 'basic',
    description: gt.description,
    keyStage: gt.keyStage,
  };
}

/**
 * Convert UnitGroundTruth entries to GroundTruthEntry format.
 *
 * Groups by subject/phase and converts each to a query.
 */
function convertUnitsToEntries(
  groundTruths: readonly UnitGroundTruth[],
): readonly GroundTruthEntry[] {
  const entriesMap = new Map<string, GroundTruthEntry>();

  for (const gt of groundTruths) {
    const key = `${gt.subject}-${gt.phase}`;
    const existing = entriesMap.get(key);

    if (existing) {
      entriesMap.set(key, {
        ...existing,
        queries: [...existing.queries, unitToGroundTruthQuery(gt)],
      });
    } else {
      entriesMap.set(key, {
        subject: gt.subject,
        phase: gt.phase,
        queries: [unitToGroundTruthQuery(gt)],
      });
    }
  }

  return Array.from(entriesMap.values());
}

/**
 * Get all ground truth entries from the unit ground truths.
 */
export function getUnitGroundTruthEntries(): readonly GroundTruthEntry[] {
  return convertUnitsToEntries(UNIT_GROUND_TRUTHS);
}

// =============================================================================
// Thread Adapters
// =============================================================================

/**
 * Convert ThreadGroundTruth to GroundTruthQuery format.
 *
 * Note: Threads don't have keyStage as they span multiple key stages.
 */
function threadToGroundTruthQuery(gt: ThreadGroundTruth): GroundTruthQuery {
  return {
    query: gt.query,
    expectedRelevance: gt.expectedRelevance,
    category: 'basic',
    description: gt.description,
    // Threads don't have keyStage - they span multiple key stages
  };
}

/**
 * Convert ThreadGroundTruth entries to GroundTruthEntry format.
 *
 * Groups by subject (threads don't have phase, so we use 'secondary' as default).
 */
function convertThreadsToEntries(
  groundTruths: readonly ThreadGroundTruth[],
): readonly GroundTruthEntry[] {
  const entriesMap = new Map<string, GroundTruthEntry>();

  for (const gt of groundTruths) {
    // Threads primarily serve secondary curriculum progressions
    const key = `${gt.subject}-threads`;
    const existing = entriesMap.get(key);

    if (existing) {
      entriesMap.set(key, {
        ...existing,
        queries: [...existing.queries, threadToGroundTruthQuery(gt)],
      });
    } else {
      entriesMap.set(key, {
        subject: gt.subject,
        phase: 'secondary', // Default phase for threads
        queries: [threadToGroundTruthQuery(gt)],
      });
    }
  }

  return Array.from(entriesMap.values());
}

/**
 * Get all ground truth entries from the thread ground truths.
 */
export function getThreadGroundTruthEntries(): readonly GroundTruthEntry[] {
  return convertThreadsToEntries(THREAD_GROUND_TRUTHS);
}

// =============================================================================
// Sequence Adapters
// =============================================================================

/**
 * Convert SequenceGroundTruth to GroundTruthQuery format.
 *
 * Note: Sequences don't have keyStage in the traditional sense.
 */
function sequenceToGroundTruthQuery(gt: SequenceGroundTruth): GroundTruthQuery {
  return {
    query: gt.query,
    expectedRelevance: gt.expectedRelevance,
    category: 'basic',
    description: gt.description,
    // Sequences don't use keyStage filtering
  };
}

/**
 * Convert SequenceGroundTruth entries to GroundTruthEntry format.
 *
 * Groups by subject/phase and converts each to a query.
 */
function convertSequencesToEntries(
  groundTruths: readonly SequenceGroundTruth[],
): readonly GroundTruthEntry[] {
  const entriesMap = new Map<string, GroundTruthEntry>();

  for (const gt of groundTruths) {
    const key = `${gt.subject}-${gt.phase}`;
    const existing = entriesMap.get(key);

    if (existing) {
      entriesMap.set(key, {
        ...existing,
        queries: [...existing.queries, sequenceToGroundTruthQuery(gt)],
      });
    } else {
      entriesMap.set(key, {
        subject: gt.subject,
        phase: gt.phase,
        queries: [sequenceToGroundTruthQuery(gt)],
      });
    }
  }

  return Array.from(entriesMap.values());
}

/**
 * Get all ground truth entries from the sequence ground truths.
 */
export function getSequenceGroundTruthEntries(): readonly GroundTruthEntry[] {
  return convertSequencesToEntries(SEQUENCE_GROUND_TRUTHS);
}
