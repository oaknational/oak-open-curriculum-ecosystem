/**
 * Helpers for building Elasticsearch bulk operations.
 *
 * KS4 metadata denormalisation is handled by passing a UnitContextMap through
 * the document building functions, which decorates lessons and units with
 * tier, exam board, and exam subject arrays per ADR-080.
 */

import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createRollupDocument } from './document-transforms';
// No longer need extraction helpers - using typed property access
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ensureUnitSummaryMatchesContext } from './index-bulk-support';
import { sandboxLogger } from '../logger';
import { processUnitSummary } from './index-bulk-helpers-internal';
import type { DataIntegrityReport } from './data-integrity-report';
import type { UnitContextMap } from './ks4-context-builder';
import type { BulkOperations } from './bulk-operation-types';
import {
  createPhaseStartEvent,
  createPhaseEndEvent,
  createUnitSkippedEvent,
  formatIngestionEvent,
} from './ingestion-events';

// eslint-disable-next-line max-lines-per-function, max-statements -- Comprehensive logging requires inline event creation
export async function buildUnitDocuments(
  client: OakClient,
  units: readonly { unitSlug: string; unitTitle: string }[],
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<{
  unitSummaries: Map<string, SearchUnitSummary>;
  unitOps: BulkOperations;
}> {
  const startTime = Date.now();
  const phaseStartEvent = createPhaseStartEvent('units', {
    subject,
    keyStage: ks,
    count: units.length,
  });
  sandboxLogger.info(formatIngestionEvent(phaseStartEvent));

  const unitSummaries = new Map<string, SearchUnitSummary>();
  const unitOps: BulkOperations = [];
  let skippedCount = 0;

  let unitIndex = 0;
  for (const unit of units) {
    unitIndex++;
    if (unitIndex % 10 === 1 || unitIndex === units.length) {
      sandboxLogger.debug('Fetching unit summaries', {
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
    );
    if (result === null) {
      skippedCount++;
      const unitSkippedEvent = createUnitSkippedEvent({
        unitSlug: unit.unitSlug,
        subject,
        keyStage: ks,
        reason: 'summary_unavailable',
      });
      sandboxLogger.warn(formatIngestionEvent(unitSkippedEvent));
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

  const phaseEndEvent = createPhaseEndEvent('units', {
    subject,
    keyStage: ks,
    indexed: unitSummaries.size,
    skipped: skippedCount,
    durationMs: Date.now() - startTime,
  });
  sandboxLogger.info(formatIngestionEvent(phaseEndEvent));

  return { unitSummaries, unitOps };
}

// eslint-disable-next-line max-lines-per-function -- Comprehensive logging requires inline event creation
export function buildRollupDocuments(
  unitSummaries: Map<string, SearchUnitSummary>,
  rollupSnippets: Map<string, string[]>,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
): BulkOperations {
  const startTime = Date.now();
  const phaseStartEvent = createPhaseStartEvent('rollups', {
    subject,
    keyStage,
    count: unitSummaries.size,
  });
  sandboxLogger.info(formatIngestionEvent(phaseStartEvent));

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
    });
    ops.push(
      {
        index: {
          _index: resolvePrimarySearchIndexName('unit_rollup'),
          _id: summary.unitSlug,
        },
      },
      rollupDoc,
    );
  }

  const rollupCount = ops.length / 2;
  const phaseEndEvent = createPhaseEndEvent('rollups', {
    subject,
    keyStage,
    indexed: rollupCount,
    skipped: 0,
    durationMs: Date.now() - startTime,
  });
  sandboxLogger.info(formatIngestionEvent(phaseEndEvent));

  return ops;
}
