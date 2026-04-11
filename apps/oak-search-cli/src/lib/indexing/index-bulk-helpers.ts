/**
 * Helpers for building Elasticsearch bulk operations.
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter';
import { createRollupDocument } from './document-transforms';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import type { UnitContextMap } from './ks4-context-builder';
import type { BulkOperations } from './bulk-operation-types';
import type { DataIntegrityReport } from './data-integrity-report';
import { ingestLogger } from '../logger';
import { createBulkAction } from './bulk-action-factory';
import {
  createPhaseStartEvent,
  createPhaseEndEvent,
  createUnitSkippedEvent,
  formatIngestionEvent,
} from './ingestion-events';
import { processUnitSummary } from './unit-processing';

export { fetchLessonMaterials } from './lesson-materials';

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

function shouldLogUnitSummaryProgress(unitIndex: number, totalUnits: number): boolean {
  return unitIndex % 10 === 1 || unitIndex === totalUnits;
}

function recordSkippedUnitSummary(params: {
  unit: { unitSlug: string; unitTitle: string };
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  dataIntegrityReport: DataIntegrityReport;
}): void {
  ingestLogger.warn(
    formatIngestionEvent(
      createUnitSkippedEvent({
        unitSlug: params.unit.unitSlug,
        subject: params.subject,
        keyStage: params.keyStage,
        reason: 'summary_unavailable',
      }),
    ),
  );

  params.dataIntegrityReport.skippedUnits.push({
    unitSlug: params.unit.unitSlug,
    unitTitle: params.unit.unitTitle,
    subject: params.subject,
    keyStage: params.keyStage,
  });
}

interface UnitSummaryBatch {
  unitSummaries: Map<string, SearchUnitSummary>;
  unitOps: BulkOperations;
  skippedCount: number;
}

async function processUnitSummaries(
  client: OakClient,
  units: readonly { unitSlug: string; unitTitle: string }[],
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
  lessonsByUnit: ReadonlyMap<string, readonly string[]> | undefined,
  dataIntegrityReport: DataIntegrityReport,
): Promise<UnitSummaryBatch> {
  const unitSummaries = new Map<string, SearchUnitSummary>();
  const unitOps: BulkOperations = [];
  let skippedCount = 0,
    unitIndex = 0;
  for (const unit of units) {
    unitIndex++;
    if (shouldLogUnitSummaryProgress(unitIndex, units.length)) {
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
      recordSkippedUnitSummary({
        unit,
        subject,
        keyStage: ks,
        dataIntegrityReport,
      });
      continue;
    }
    unitSummaries.set(result.summary.unitSlug, result.summary);
    unitOps.push(...result.ops);
  }
  return { unitSummaries, unitOps, skippedCount };
}

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

  const { unitSummaries, unitOps, skippedCount } = await processUnitSummaries(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
    unitContextMap,
    lessonsByUnit,
    dataIntegrityReport,
  );

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

function requireUnitOakUrl(summary: SearchUnitSummary, subject: string, keyStage: string): string {
  if (!summary.oakUrl) {
    throw new Error(
      `Missing oakUrl for unit "${summary.unitSlug}" in ${subject}/${keyStage} — ` +
        `API response augmentation should have set this.`,
    );
  }
  return summary.oakUrl;
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
    const unitUrl = requireUnitOakUrl(summary, subject, keyStage);
    const snippets = rollupSnippets.get(summary.unitSlug) ?? [];
    const rollupDoc = createRollupDocument({
      summary,
      snippets,
      subject,
      keyStage,
      subjectProgrammesUrl,
      unitUrl,
      unitContextMap,
      lessonsByUnit,
    });
    ops.push(
      createBulkAction(resolvePrimarySearchIndexName('unit_rollup'), summary.unitSlug),
      rollupDoc,
    );
  }

  const endEvent = createPhaseEndEvent('rollups', {
    subject,
    keyStage,
    indexed: ops.length / 2,
    skipped: 0,
    durationMs: Date.now() - startTime,
  });
  ingestLogger.info(formatIngestionEvent(endEvent));
  return ops;
}
