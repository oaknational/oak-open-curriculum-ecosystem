/**
 * Granularity-specific batch generators.
 *
 * Each generator yields curriculum batches according to its granularity level:
 * - subject-keystage: One batch per (subject, keyStage) pair
 * - subject: One batch per subject (all key stages combined)
 * - all: Single batch containing everything
 *
 * @packageDocumentation
 */

import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient } from '../adapters/oak-adapter';
import type { BulkOperations } from './indexing/bulk-operation-types';
import { createDataIntegrityCollector } from './indexing/data-integrity-report';
import { ingestLogger } from './logger';
import type { SequenceFacetProcessingMetrics } from './indexing/sequence-facet-index';
import { buildSubjectContext, buildOpsForPair, buildThreadOps } from './index-batch-helpers';
import type { CurriculumBatch, ThreadsBatch, BatchGranularity } from './index-batch-types';

// ============================================================================
// Curriculum Batch Generators
// ============================================================================

/** Dispatches to the appropriate generator based on granularity. */
export async function* yieldCurriculumBatches(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
  keyStages: readonly KeyStage[],
  granularity: BatchGranularity,
  onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void,
): AsyncGenerator<CurriculumBatch> {
  switch (granularity.kind) {
    case 'subject-keystage':
      yield* yieldSubjectKeyStageGranularity(client, subjects, keyStages, onSequenceFacetProcessed);
      break;
    case 'subject':
      yield* yieldSubjectGranularity(client, subjects, keyStages, onSequenceFacetProcessed);
      break;
    case 'all':
      yield* yieldAllGranularity(client, subjects, keyStages, onSequenceFacetProcessed);
      break;
  }
}

/** Yields one batch per (subject, keyStage) pair. */
// eslint-disable-next-line max-lines-per-function -- Generator requires sequential flow
async function* yieldSubjectKeyStageGranularity(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
  keyStages: readonly KeyStage[],
  onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void,
): AsyncGenerator<CurriculumBatch> {
  let subjectIndex = 0;
  for (const subject of subjects) {
    subjectIndex++;
    ingestLogger.debug('Processing subject', {
      subject,
      progress: `${subjectIndex}/${subjects.length}`,
    });

    const subjectContext = await buildSubjectContext(client, subject, onSequenceFacetProcessed);

    let ksIndex = 0;
    for (const keyStage of keyStages) {
      ksIndex++;
      ingestLogger.debug('Processing key stage', {
        subject,
        keyStage,
        progress: `${ksIndex}/${keyStages.length}`,
      });

      const dataIntegrityReport = createDataIntegrityCollector();
      const result = await buildOpsForPair(
        client,
        keyStage,
        subject,
        subjectContext,
        dataIntegrityReport,
      );

      // Skip combinations with no data (pattern-aware)
      if (result.skipped) {
        ingestLogger.debug('Skipping batch (no data)', {
          subject,
          keyStage,
          reason: result.skipReason,
        });
        continue;
      }

      yield {
        kind: 'curriculum',
        subject,
        keyStage,
        operations: result.operations,
        dataIntegrityReport,
      };
    }
  }
}

/** Yields one batch per subject (all key stages combined). */
async function* yieldSubjectGranularity(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
  keyStages: readonly KeyStage[],
  onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void,
): AsyncGenerator<CurriculumBatch> {
  let subjectIndex = 0;
  for (const subject of subjects) {
    subjectIndex++;
    ingestLogger.debug('Processing subject (all keystages)', {
      subject,
      progress: `${subjectIndex}/${subjects.length}`,
    });

    const subjectContext = await buildSubjectContext(client, subject, onSequenceFacetProcessed);
    const dataIntegrityReport = createDataIntegrityCollector();
    const allOps: BulkOperations = [];

    for (const keyStage of keyStages) {
      const result = await buildOpsForPair(
        client,
        keyStage,
        subject,
        subjectContext,
        dataIntegrityReport,
      );
      // Skip combinations with no data (pattern-aware)
      if (!result.skipped) {
        allOps.push(...result.operations);
      }
    }

    yield { kind: 'curriculum', subject, keyStage: null, operations: allOps, dataIntegrityReport };
  }
}

/** Yields a single batch containing all subjects and key stages. */
async function* yieldAllGranularity(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
  keyStages: readonly KeyStage[],
  onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void,
): AsyncGenerator<CurriculumBatch> {
  const allOps: BulkOperations = [];
  const dataIntegrityReport = createDataIntegrityCollector();

  for (const subject of subjects) {
    const subjectContext = await buildSubjectContext(client, subject, onSequenceFacetProcessed);

    for (const keyStage of keyStages) {
      const result = await buildOpsForPair(
        client,
        keyStage,
        subject,
        subjectContext,
        dataIntegrityReport,
      );
      // Skip combinations with no data (pattern-aware)
      if (!result.skipped) {
        allOps.push(...result.operations);
      }
    }
  }

  yield {
    kind: 'curriculum',
    subject: null,
    keyStage: null,
    operations: allOps,
    dataIntegrityReport,
  };
}

// ============================================================================
// Threads Batch Generator
// ============================================================================

/** Yields the threads batch (always yielded last). */
export async function* yieldThreadsBatch(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
): AsyncGenerator<ThreadsBatch> {
  const threadOps = await buildThreadOps(client, subjects);
  yield { kind: 'threads', operations: threadOps, subjects };
}
