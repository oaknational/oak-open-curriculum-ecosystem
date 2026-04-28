/**
 * Helper functions for building Oak curriculum bulk operations.
 * @see ADR-080 KS4 Metadata Denormalisation, @see ADR-083 Lesson Enumeration
 */

import { generateSubjectProgrammesUrl } from '@oaknational/curriculum-sdk';
import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../types/oak';
import type { OakClient } from '../adapters/oak-adapter';
import { buildSequenceFacetOps } from './indexing/sequence-facet-index';
import { buildRollupDocuments, buildUnitDocuments } from './indexing/index-bulk-helpers';
import { buildSequenceOps } from './indexing/sequence-bulk-helpers';
import { ingestLogger } from './logger';
import type { UnitContextMap } from './indexing/ks4-context-builder';
import type { BulkOperations } from './indexing/bulk-operation-types';
import { buildLessonsByUnit } from './indexing/lesson-aggregation';
import { fetchUnitsPatternAware } from './indexing/pattern-aware-fetcher';
import { buildLessonOpsForPair, fetchAggregatedLessonsForPair } from './index-oak-build-helpers';

// Re-export PairBuildContext for API continuity (consumed by index-batch-helpers)
export type { PairBuildContext } from './index-oak-pair-types';
import type { PairBuildContext, PairUnit } from './index-oak-pair-types';

/**
 * Result of fetching pair data with pattern awareness.
 */
interface PairDataResult {
  readonly units: readonly PairUnit[];
  readonly skipped: boolean;
  readonly skipReason?: string;
}

/**
 * Fetch units for a subject/keystage pair using pattern-aware traversal.
 *
 * This function uses the static pattern configuration to determine the
 * correct API traversal strategy. Some combinations (e.g., French KS1)
 * have no data and will be skipped.
 *
 * @param client - Oak API client
 * @param ks - Key stage slug
 * @param subject - Subject slug
 * @returns Units and skip status
 */
export async function fetchPairData(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
): Promise<PairDataResult> {
  ingestLogger.debug('Fetching units (pattern-aware)', { subject, keyStage: ks });

  const result = await fetchUnitsPatternAware(client, subject, ks, ingestLogger);

  if (result.skipped) {
    ingestLogger.info('Skipping combination', {
      subject,
      keyStage: ks,
      pattern: result.pattern.pattern,
      reason: result.skipReason,
    });
    return { units: [], skipped: true, skipReason: result.skipReason };
  }

  ingestLogger.debug('Found units', {
    subject,
    keyStage: ks,
    units: result.units.length,
    pattern: result.pattern.pattern,
    traversal: result.pattern.traversal,
  });

  return { units: result.units, skipped: false };
}

/** Generate subject programmes URL. */
function getSubjectProgrammesUrl(subject: SearchSubjectSlug, ks: KeyStage): string {
  return generateSubjectProgrammesUrl(subject, ks);
}

/** Build unit documents and return summaries for lesson derivation. */
async function buildUnitsWithSummaries(
  context: PairBuildContext,
  units: readonly PairUnit[],
  subjectProgrammesUrl: string,
  lessonsByUnit: ReadonlyMap<string, readonly string[]>,
): Promise<{ unitSummaries: Map<string, SearchUnitSummary>; unitOps: BulkOperations }> {
  const { client, ks, subject, unitContextMap, dataIntegrityReport } = context;
  ingestLogger.debug('Building unit documents', { subject, keyStage: ks });
  const result = await buildUnitDocuments(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
    unitContextMap,
    dataIntegrityReport,
    lessonsByUnit,
  );
  ingestLogger.debug('Built unit docs', {
    subject,
    keyStage: ks,
    count: result.unitOps.length / 2,
  });
  return result;
}

function buildRollupOpsForPair(params: {
  unitSummaries: Map<string, SearchUnitSummary>;
  rollupSnippets: Map<string, string[]>;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  subjectProgrammesUrl: string;
  unitContextMap: UnitContextMap;
  lessonsByUnit: ReadonlyMap<string, readonly string[]>;
}): BulkOperations {
  ingestLogger.debug('Building rollup documents', {
    subject: params.subject,
    keyStage: params.keyStage,
  });

  const rollupOps = buildRollupDocuments(
    params.unitSummaries,
    params.rollupSnippets,
    params.subject,
    params.keyStage,
    params.subjectProgrammesUrl,
    params.unitContextMap,
    params.lessonsByUnit,
  );

  ingestLogger.debug('Built rollup docs', {
    subject: params.subject,
    keyStage: params.keyStage,
    count: rollupOps.length / 2,
  });

  return rollupOps;
}

/** Build unit, lesson, and rollup operations with progress logging. */
async function buildCoreDocumentOps(
  context: PairBuildContext,
  units: readonly PairUnit[],
  subjectProgrammesUrl: string,
): Promise<{
  unitOps: BulkOperations;
  lessonOps: BulkOperations;
  rollupOps: BulkOperations;
  unitSummaries: Map<string, SearchUnitSummary>;
}> {
  const { ks, subject, unitContextMap } = context;
  const aggregatedLessons = await fetchAggregatedLessonsForPair(context, units);
  const lessonsByUnit = buildLessonsByUnit(aggregatedLessons);
  ingestLogger.debug('Built lessonsByUnit map', {
    subject,
    keyStage: ks,
    unitCount: lessonsByUnit.size,
  });
  const { unitSummaries, unitOps } = await buildUnitsWithSummaries(
    context,
    units,
    subjectProgrammesUrl,
    lessonsByUnit,
  );
  const { lessonOps, rollupSnippets, processed, skipped } = await buildLessonOpsForPair(
    aggregatedLessons,
    context,
    unitSummaries,
  );
  ingestLogger.info('Built lesson docs', {
    subject,
    keyStage: ks,
    count: processed,
    skipped,
  });
  const rollupOps = buildRollupOpsForPair({
    unitSummaries,
    rollupSnippets,
    subject,
    keyStage: ks,
    subjectProgrammesUrl,
    unitContextMap,
    lessonsByUnit,
  });
  return { unitOps, lessonOps, rollupOps, unitSummaries };
}

/** Build all document operations for a subject/keystage pair. */
export async function buildPairDocuments(
  context: PairBuildContext,
  units: readonly PairUnit[],
): Promise<BulkOperations> {
  const { ks, subject, subjectSequences, sequenceSources } = context;
  ingestLogger.debug('Building pair documents', {
    subject,
    keyStage: ks,
    unitCount: units.length,
  });
  const subjectProgrammesUrl = getSubjectProgrammesUrl(subject, ks);

  const { unitOps, lessonOps, rollupOps, unitSummaries } = await buildCoreDocumentOps(
    context,
    units,
    subjectProgrammesUrl,
  );

  const sequenceFacetOps = buildSequenceFacetOps({
    subject,
    keyStage: ks,
    sequences: subjectSequences,
    sequenceSources,
    unitSummaries,
  });

  const sequenceOps = buildSequenceOps({
    subject,
    sequences: subjectSequences,
    sequenceSources,
  });

  return [...unitOps, ...lessonOps, ...rollupOps, ...sequenceFacetOps, ...sequenceOps];
}
