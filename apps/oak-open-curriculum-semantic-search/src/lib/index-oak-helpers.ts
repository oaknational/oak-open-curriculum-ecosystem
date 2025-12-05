/**
 * @module index-oak-helpers
 * @description Helper functions for building Oak curriculum bulk operations.
 * Extracted from index-oak.ts to reduce function complexity.
 */

import { generateCanonicalUrl } from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
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
} from './indexing/index-bulk-helpers';
import { sandboxLogger } from './logger';

/** Context for building a subject/keystage pair. */
export interface PairBuildContext {
  readonly client: OakClient;
  readonly ks: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly subjectSequences: readonly SubjectSequenceEntry[];
  readonly sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
}

/** Unit and lesson group types for pair data. */
export type PairUnits = readonly { unitSlug: string; unitTitle: string }[];
export type PairGroups = readonly {
  unitSlug: string;
  unitTitle: string;
  lessons: { lessonSlug: string; lessonTitle: string }[];
}[];

/** Fetch units and lessons for a subject/keystage pair. */
export async function fetchPairData(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
): Promise<{ units: PairUnits; groups: PairGroups }> {
  sandboxLogger.debug('Fetching units and lessons', { subject, keyStage: ks });
  const [units, groups] = await Promise.all([
    client.getUnitsByKeyStageAndSubject(ks, subject),
    client.getLessonsByKeyStageAndSubject(ks, subject),
  ]);
  sandboxLogger.debug('Found units and lessons', {
    subject,
    keyStage: ks,
    units: units.length,
    lessonGroups: groups.length,
  });
  return { units, groups };
}

/** Generate subject programmes URL, throws if unavailable. */
function getSubjectProgrammesUrl(subject: SearchSubjectSlug, ks: KeyStage): string {
  const url = generateCanonicalUrl('subject', subject, { subject: { keyStageSlugs: [ks] } });
  if (!url) {
    throw new Error(`Missing subject programmes canonical URL for ${subject}/${ks}`);
  }
  return url;
}

/** Build unit, lesson, and rollup operations with progress logging. */
async function buildCoreDocumentOps(
  context: PairBuildContext,
  units: PairUnits,
  groups: PairGroups,
  subjectProgrammesUrl: string,
): Promise<{
  unitOps: unknown[];
  lessonOps: unknown[];
  rollupOps: unknown[];
  unitSummaries: Map<string, unknown>;
}> {
  const { client, ks, subject } = context;

  sandboxLogger.debug('Building unit documents', { subject, keyStage: ks });
  const { unitSummaries, unitOps } = await buildUnitDocuments(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  sandboxLogger.debug('Built unit docs', { subject, keyStage: ks, count: unitOps.length / 2 });

  sandboxLogger.debug('Building lesson documents', { subject, keyStage: ks });
  const { lessonOps, rollupSnippets } = await buildLessonDocuments(
    client,
    groups,
    unitSummaries,
    subject,
    ks,
  );
  sandboxLogger.debug('Built lesson docs', { subject, keyStage: ks, count: lessonOps.length / 2 });

  sandboxLogger.debug('Building rollup documents', { subject, keyStage: ks });
  const rollupOps = buildRollupDocuments(
    unitSummaries,
    rollupSnippets,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  sandboxLogger.debug('Built rollup docs', { subject, keyStage: ks, count: rollupOps.length / 2 });

  return { unitOps, lessonOps, rollupOps, unitSummaries };
}

/** Build all document operations for a subject/keystage pair. */
export async function buildPairDocuments(
  context: PairBuildContext,
  units: PairUnits,
  groups: PairGroups,
): Promise<unknown[]> {
  const { ks, subject, subjectSequences, sequenceSources } = context;
  const subjectProgrammesUrl = getSubjectProgrammesUrl(subject, ks);

  const { unitOps, lessonOps, rollupOps, unitSummaries } = await buildCoreDocumentOps(
    context,
    units,
    groups,
    subjectProgrammesUrl,
  );

  const sequenceFacetOps = buildSequenceFacetOps({
    subject,
    keyStage: ks,
    sequences: subjectSequences,
    sequenceSources,
    unitSummaries,
  });

  return [...unitOps, ...lessonOps, ...rollupOps, ...sequenceFacetOps];
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
