/**
 * Async generator for yielding ingestion batches sequentially.
 *
 * This module provides a streaming approach to bulk operation generation,
 * where each (subject, keyStage) pair is yielded as an independent batch
 * that can be dispatched to Elasticsearch immediately.
 *
 * **Benefits:**
 * - Batch-atomic commits (each batch is committed independently)
 * - Low memory footprint (O(batch) instead of O(all documents))
 * - Observable progress (per-batch logging)
 * - Resilient (partial progress is preserved on failure)

 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type { SearchIndexKind } from './search-index-target';
import { ingestLogger } from './logger';
import { filterKeyStages, filterSubjects } from './index-batch-helpers';
import { yieldCurriculumBatches, yieldThreadsBatch } from './index-batch-granularity';

export type { BatchGranularity, IngestionBatch, BatchGeneratorOptions } from './index-batch-types';

import type { IngestionBatch, BatchGeneratorOptions } from './index-batch-types';

/** Curriculum index kinds that require subject/keystage traversal. */
const CURRICULUM_INDEX_KINDS: readonly SearchIndexKind[] = [
  'lessons',
  'units',
  'unit_rollup',
  'sequences',
  'sequence_facets',
];

/**
 * Async generator that yields ingestion batches sequentially.
 *
 * Each yielded batch can be independently dispatched to Elasticsearch,
 * enabling batch-atomic commits and observable progress.
 *
 * When `indexes` is provided, only the relevant phases run — e.g.
 * requesting only `threads` skips the entire curriculum traversal.
 *
 * @param options - Configuration for batch generation
 * @returns Batches containing operations for Elasticsearch dispatch
 *
 * @example
 * ```typescript
 * const options: BatchGeneratorOptions = {
 *   client,
 *   subjects: ['maths', 'english'],
 *   keyStages: ['ks1', 'ks2'],
 *   granularity: { kind: 'subject-keystage' },
 * };
 *
 * for await (const batch of generateIndexBatches(options)) {
 *   await dispatchBulk(es, batch.operations);
 *   console.log(`Committed: ${batch.subject}/${batch.keyStage}`);
 * }
 * ```
 */
export async function* generateIndexBatches(
  options: BatchGeneratorOptions,
): AsyncGenerator<IngestionBatch> {
  const {
    client,
    subjects,
    keyStages,
    indexes = [],
    granularity = { kind: 'subject-keystage' },
    onSequenceFacetProcessed,
  } = options;

  const filteredSubjects = filterSubjects(subjects);
  const filteredKeyStages = filterKeyStages(keyStages);

  const doCurriculum =
    indexes.length === 0 || indexes.some((idx) => CURRICULUM_INDEX_KINDS.includes(idx));
  const doThreads = indexes.length === 0 || indexes.includes('threads');

  ingestLogger.debug('Starting batch generation', {
    subjectCount: filteredSubjects.length,
    keyStageCount: filteredKeyStages.length,
    granularity: granularity.kind,
    curriculum: doCurriculum,
    threads: doThreads,
  });

  if (doCurriculum) {
    yield* yieldCurriculumBatches(
      client,
      filteredSubjects,
      filteredKeyStages,
      granularity,
      onSequenceFacetProcessed,
    );
  }

  if (doThreads) {
    yield* yieldThreadsBatch(client, filteredSubjects);
  }
}
