/* eslint-disable max-lines -- Cohesive module for Oak curriculum bulk operations */
/**
 * Helper functions for building Oak curriculum bulk operations.
 * @see ADR-080 KS4 Metadata Denormalisation, @see ADR-083 Lesson Enumeration
 */

import { generateCanonicalUrl } from '@oaknational/curriculum-sdk';
import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import {
  buildSequenceFacetOps,
  type SequenceFacetProcessingMetrics,
} from './indexing/sequence-facet-index';
import { buildRollupDocuments, buildUnitDocuments } from './indexing/index-bulk-helpers';
import { buildSequenceOps } from './indexing/sequence-bulk-helpers';
import { ingestLogger } from './logger';
import type { DataIntegrityReport } from './indexing/data-integrity-report';
import type { UnitContextMap } from './indexing/ks4-context-builder';
import { fetchAllLessonsByUnit } from './indexing/fetch-all-lessons';
import type { BulkOperations } from './indexing/bulk-operation-types';
import { processLessonForIndexing } from './indexing/lesson-processing';
import { buildLessonsByUnit } from './indexing/lesson-aggregation';
import { fetchUnitsPatternAware } from './indexing/pattern-aware-fetcher';

/** Context for building a subject/keystage pair. */
export interface PairBuildContext {
  readonly client: OakClient;
  readonly ks: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly subjectSequences: readonly SubjectSequenceEntry[];
  readonly sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  /** KS4 metadata context for units (tiers, exam boards, etc.) per ADR-080 */
  readonly unitContextMap: UnitContextMap;
  readonly dataIntegrityReport: DataIntegrityReport;
}

/** Unit type for pair data. */
export type PairUnits = readonly { unitSlug: string; unitTitle: string }[];

/**
 * Result of fetching pair data with pattern awareness.
 */
export interface PairDataResult {
  readonly units: PairUnits;
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

/** Generate subject programmes URL, throws if unavailable. */
function getSubjectProgrammesUrl(subject: SearchSubjectSlug, ks: KeyStage): string {
  const url = generateCanonicalUrl('subject', subject, { subject: { keyStageSlugs: [ks] } });
  if (!url) {
    throw new Error(`Missing subject programmes canonical URL for ${subject}/${ks}`);
  }
  return url;
}

/** Build unit documents and return summaries for lesson derivation. */
async function buildUnitsWithSummaries(
  context: PairBuildContext,
  units: PairUnits,
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

/** Build unit, lesson, and rollup operations with progress logging. */
// eslint-disable-next-line max-lines-per-function, max-statements -- Core orchestration requires sequential steps
async function buildCoreDocumentOps(
  context: PairBuildContext,
  units: PairUnits,
  subjectProgrammesUrl: string,
): Promise<{
  unitOps: BulkOperations;
  lessonOps: BulkOperations;
  rollupOps: BulkOperations;
  unitSummaries: Map<string, SearchUnitSummary>;
}> {
  const { ks, subject, unitContextMap, client } = context;

  // Fetch lessons FIRST to get accurate lesson counts (per ADR-083)
  // WORKAROUND: Fetch by unit due to upstream API bug (see ADR-083)
  // NOTE: With bulk-first approach (ADR-093), this will be replaced by bulk download parsing
  const unitSlugs = units.map((u) => u.unitSlug);
  ingestLogger.info('Fetching all lessons by unit', {
    subject,
    keyStage: ks,
    unitCount: unitSlugs.length,
  });
  const aggregatedLessons = await fetchAllLessonsByUnit(
    client.getLessonsByKeyStageAndSubject,
    ks,
    subject,
    unitSlugs,
  );
  ingestLogger.info('Fetched lessons', { subject, keyStage: ks, count: aggregatedLessons.size });

  // Build lessonsByUnit map for accurate unit/rollup lesson counts
  const lessonsByUnit = buildLessonsByUnit(aggregatedLessons);
  ingestLogger.debug('Built lessonsByUnit map', {
    subject,
    keyStage: ks,
    unitCount: lessonsByUnit.size,
  });

  // Build units with accurate lesson counts
  const { unitSummaries, unitOps } = await buildUnitsWithSummaries(
    context,
    units,
    subjectProgrammesUrl,
    lessonsByUnit,
  );

  // Build lesson documents (reuses aggregatedLessons, doesn't re-fetch)
  // NOTE: hasVideo parameter preserved for future bulk-first integration
  const lessonOps: BulkOperations = [],
    rollupSnippets = new Map<string, string[]>();
  let processed = 0,
    skipped = 0;

  for (const lesson of aggregatedLessons.values()) {
    const skipCount = await processLessonForIndexing(
      lesson,
      context,
      unitSummaries,
      lessonOps,
      rollupSnippets,
    );
    if (skipCount > 0) {
      skipped++;
      continue;
    }
    processed++;
  }

  ingestLogger.info('Built lesson docs', {
    subject,
    keyStage: ks,
    count: processed,
    skipped,
  });

  // Build rollups with accurate lesson counts
  ingestLogger.debug('Building rollup documents', { subject, keyStage: ks });
  const rollupOps = buildRollupDocuments(
    unitSummaries,
    rollupSnippets,
    subject,
    ks,
    subjectProgrammesUrl,
    unitContextMap,
    lessonsByUnit,
  );
  ingestLogger.debug('Built rollup docs', { subject, keyStage: ks, count: rollupOps.length / 2 });

  return { unitOps, lessonOps, rollupOps, unitSummaries };
}

/** Build all document operations for a subject/keystage pair. */
export async function buildPairDocuments(
  context: PairBuildContext,
  units: PairUnits,
): Promise<BulkOperations> {
  const { ks, subject, subjectSequences, sequenceSources } = context;
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

/** Emit sequence facet events to callback if provided. */
export function emitSequenceFacetEvents(
  events: readonly SequenceFacetProcessingMetrics[],
  subject: SearchSubjectSlug,
  onEvent:
    | ((details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug }) => void)
    | undefined,
): void {
  if (!onEvent) {
    return;
  }
  for (const event of events) {
    onEvent({ ...event, subject });
  }
}

/** Resolve sequence slug from a subject sequence entry. */
export function resolveSequenceSlugFromEntry(entry: SubjectSequenceEntry): string {
  if (typeof entry === 'string') {
    return entry;
  }
  if (typeof entry === 'object' && entry !== null && 'sequenceSlug' in entry) {
    const slug = entry.sequenceSlug;
    if (typeof slug === 'string') {
      return slug;
    }
  }
  throw new Error(`Cannot resolve sequence slug from entry: ${JSON.stringify(entry)}`);
}
