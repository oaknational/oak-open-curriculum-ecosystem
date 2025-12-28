/**
 * Helpers for building Elasticsearch bulk operations.
 *
 * This module provides the public API for bulk indexing:
 * - Unit and rollup document creation
 * - Lesson material fetching
 * - Context validation
 *
 * Implementation is split across focused modules:
 * - unit-processing.ts: Unit summary fetching and document creation
 * - lesson-materials.ts: Lesson transcript and summary fetching
 *
 * All SDK methods return Result<T, SdkFetchError> per ADR-088.
 * KS4 metadata denormalisation is handled via UnitContextMap per ADR-080.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createRollupDocument } from './document-transforms';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import type { UnitContextMap } from './ks4-context-builder';
import type { BulkOperations } from './bulk-operation-types';
import type { DataIntegrityReport } from './data-integrity-report';
import { ingestLogger } from '../logger';
import {
  createPhaseStartEvent,
  createPhaseEndEvent,
  createUnitSkippedEvent,
  formatIngestionEvent,
} from './ingestion-events';
import { processUnitSummary } from './unit-processing';

// Re-export from split modules for backwards compatibility
export { processUnitSummary } from './unit-processing';
export { fetchLessonMaterials, type FetchContext } from './lesson-materials';

// ============================================================================
// Utility Functions
// ============================================================================

/** Extract sequence IDs from a unit summary. */
export function extractUnitSequenceIds(summary: SearchUnitSummary): string[] | undefined {
  if (!summary.threads) {
    return undefined;
  }
  return summary.threads.map((thread) => thread.slug);
}

/** Validate that a unit summary matches the expected subject and key stage. */
export function ensureUnitSummaryMatchesContext(
  summary: SearchUnitSummary,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): void {
  const { unitSlug, subjectSlug, keyStageSlug } = summary;
  if (subjectSlug !== subject) {
    throw new Error(
      `Unit summary subject mismatch for ${unitSlug}: expected ${subject}, received ${subjectSlug}`,
    );
  }
  if (keyStageSlug !== keyStage) {
    throw new Error(
      `Unit summary key stage mismatch for ${unitSlug}: expected ${keyStage}, received ${keyStageSlug}`,
    );
  }
}

// ============================================================================
// Document Building
// ============================================================================

/**
 * Builds unit documents and returns summaries for lesson derivation.
 */
// eslint-disable-next-line max-lines-per-function -- Core orchestration
export async function buildUnitDocuments(
  client: OakClient,
  units: readonly { unitSlug: string; unitTitle: string }[],
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>,
): Promise<{
  unitSummaries: Map<string, SearchUnitSummary>;
  unitOps: BulkOperations;
}> {
  const startTime = Date.now();
  ingestLogger.info(
    formatIngestionEvent(
      createPhaseStartEvent('units', { subject, keyStage: ks, count: units.length }),
    ),
  );

  const unitSummaries = new Map<string, SearchUnitSummary>();
  const unitOps: BulkOperations = [];
  let skippedCount = 0;

  let unitIndex = 0;
  for (const unit of units) {
    unitIndex++;
    if (unitIndex % 10 === 1 || unitIndex === units.length) {
      ingestLogger.debug('Fetching unit summaries', {
        progress: `${unitIndex}/${units.length}`,
        subject,
        keyStage: ks,
      });
    }
    const result = await processUnitSummary(
      client,
      unit,
      subject,
      ks,
      subjectProgrammesUrl,
      unitContextMap,
      lessonsByUnit,
    );
    if (result === null) {
      skippedCount++;
      ingestLogger.warn(
        formatIngestionEvent(
          createUnitSkippedEvent({
            unitSlug: unit.unitSlug,
            subject,
            keyStage: ks,
            reason: 'summary_unavailable',
          }),
        ),
      );
      dataIntegrityReport.skippedUnits.push({
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        subject,
        keyStage: ks,
      });
      continue;
    }
    unitSummaries.set(result.summary.unitSlug, result.summary);
    unitOps.push(...result.ops);
  }

  ingestLogger.info(
    formatIngestionEvent(
      createPhaseEndEvent('units', {
        subject,
        keyStage: ks,
        indexed: unitSummaries.size,
        skipped: skippedCount,
        durationMs: Date.now() - startTime,
      }),
    ),
  );

  return { unitSummaries, unitOps };
}

/**
 * Builds rollup documents for all unit summaries.
 */
export function buildRollupDocuments(
  unitSummaries: Map<string, SearchUnitSummary>,
  rollupSnippets: Map<string, string[]>,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>,
): BulkOperations {
  const startTime = Date.now();
  ingestLogger.info(
    formatIngestionEvent(
      createPhaseStartEvent('rollups', { subject, keyStage, count: unitSummaries.size }),
    ),
  );

  const ops: BulkOperations = [];
  for (const summary of unitSummaries.values()) {
    ensureUnitSummaryMatchesContext(summary, subject, keyStage);
    const snippets = rollupSnippets.get(summary.unitSlug) ?? [];
    const rollupDoc = createRollupDocument({
      summary,
      snippets,
      subject,
      keyStage,
      subjectProgrammesUrl,
      unitContextMap,
      lessonsByUnit,
    });
    ops.push(
      { index: { _index: resolvePrimarySearchIndexName('unit_rollup'), _id: summary.unitSlug } },
      rollupDoc,
    );
  }

  ingestLogger.info(
    formatIngestionEvent(
      createPhaseEndEvent('rollups', {
        subject,
        keyStage,
        indexed: ops.length / 2,
        skipped: 0,
        durationMs: Date.now() - startTime,
      }),
    ),
  );

  return ops;
}
