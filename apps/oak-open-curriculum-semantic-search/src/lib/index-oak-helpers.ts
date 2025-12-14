/**
 * @module index-oak-helpers
 * @description Helper functions for building Oak curriculum bulk operations.
 * Extracted from index-oak.ts to reduce function complexity.
 */

import type { Client } from '@elastic/elasticsearch';
import { generateCanonicalUrl } from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter-sdk';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import {
  buildSequenceFacetOps,
  type SequenceFacetProcessingMetrics,
} from './indexing/sequence-facet-index';
import {
  buildLessonDocuments,
  buildRollupDocuments,
  buildUnitDocuments,
  deriveLessonGroupsFromUnitSummaries,
} from './indexing/index-bulk-helpers';
import { buildSequenceOps } from './indexing/sequence-bulk-helpers';
import { sandboxLogger } from './logger';
import type { DataIntegrityReport } from './indexing/data-integrity-report';

/** Context for building a subject/keystage pair. */
export interface PairBuildContext {
  readonly client: OakClient;
  readonly esClient: Client;
  readonly ks: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly subjectSequences: readonly SubjectSequenceEntry[];
  readonly sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  readonly dataIntegrityReport: DataIntegrityReport;
}

/** Unit type for pair data. */
export type PairUnits = readonly { unitSlug: string; unitTitle: string }[];

/**
 * Fetch units for a subject/keystage pair.
 *
 * **Note**: Lesson groups are no longer fetched here because the Oak API
 * `/key-stages/{ks}/subject/{subject}/lessons` endpoint has pagination
 * (limit 100) and returns incomplete data. Instead, lesson groups are
 * derived from unit summaries after they are fetched, which provides
 * complete lesson coverage.
 *
 * @see deriveLessonGroupsFromUnitSummaries
 */
export async function fetchPairData(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
): Promise<{ units: PairUnits }> {
  sandboxLogger.debug('Fetching units', { subject, keyStage: ks });
  const units = await client.getUnitsByKeyStageAndSubject(ks, subject);
  sandboxLogger.debug('Found units', {
    subject,
    keyStage: ks,
    units: units.length,
  });
  return { units };
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
): Promise<{ unitSummaries: Map<string, SearchUnitSummary>; unitOps: unknown[] }> {
  const { client, ks, subject, dataIntegrityReport } = context;
  sandboxLogger.debug('Building unit documents', { subject, keyStage: ks });
  const result = await buildUnitDocuments(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
    dataIntegrityReport,
  );
  sandboxLogger.debug('Built unit docs', {
    subject,
    keyStage: ks,
    count: result.unitOps.length / 2,
  });
  return result;
}

/** Build lesson documents from derived groups. */
async function buildLessonsFromSummaries(
  context: PairBuildContext,
  unitSummaries: Map<string, SearchUnitSummary>,
): Promise<{ lessonOps: unknown[]; rollupSnippets: Map<string, string[]> }> {
  const { client, esClient, ks, subject, dataIntegrityReport } = context;
  const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);
  sandboxLogger.debug('Derived lesson groups from unit summaries', {
    subject,
    keyStage: ks,
    lessonGroups: groups.length,
    totalLessons: groups.reduce((sum, g) => sum + g.lessons.length, 0),
  });
  sandboxLogger.debug('Building lesson documents', { subject, keyStage: ks });
  const result = await buildLessonDocuments(
    client,
    esClient,
    groups,
    unitSummaries,
    subject,
    ks,
    dataIntegrityReport,
  );
  sandboxLogger.debug('Built lesson docs', {
    subject,
    keyStage: ks,
    count: result.lessonOps.length / 2,
  });
  return result;
}

/** Build unit, lesson, and rollup operations with progress logging. */
async function buildCoreDocumentOps(
  context: PairBuildContext,
  units: PairUnits,
  subjectProgrammesUrl: string,
): Promise<{
  unitOps: unknown[];
  lessonOps: unknown[];
  rollupOps: unknown[];
  unitSummaries: Map<string, SearchUnitSummary>;
}> {
  const { esClient, ks, subject } = context;
  const { unitSummaries, unitOps } = await buildUnitsWithSummaries(
    context,
    units,
    subjectProgrammesUrl,
  );
  const { lessonOps, rollupSnippets } = await buildLessonsFromSummaries(context, unitSummaries);

  sandboxLogger.debug('Building rollup documents', { subject, keyStage: ks });
  const rollupOps = await buildRollupDocuments(
    esClient,
    unitSummaries,
    rollupSnippets,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  sandboxLogger.debug('Built rollup docs', { subject, keyStage: ks, count: rollupOps.length / 2 });

  return { unitOps, lessonOps, rollupOps, unitSummaries };
}

/**
 * Build all document operations for a subject/keystage pair.
 *
 * Lesson groups are derived internally from unit summaries, ensuring
 * complete lesson coverage regardless of Oak API pagination limits.
 */
export async function buildPairDocuments(
  context: PairBuildContext,
  units: PairUnits,
): Promise<unknown[]> {
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
