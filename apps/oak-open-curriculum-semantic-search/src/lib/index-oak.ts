/**
 * @module index-oak
 * @description Builds Elasticsearch bulk operations for Oak curriculum data.
 * Orchestrates the creation of unit, lesson, rollup, and sequence facet documents.
 */

import { isKeyStage, isSubject } from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter-sdk';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import {
  buildSequenceFacetSources,
  type SequenceFacetProcessingMetrics,
} from './indexing/sequence-facet-index';
import { sandboxLogger } from './logger';
import {
  fetchPairData,
  buildPairDocuments,
  emitSequenceFacetEvents,
  type PairBuildContext,
} from './index-oak-helpers';

/** Options for building bulk operations. */
export interface BuildIndexBulkOpsOptions {
  readonly onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void;
}

/** Build bulk operations for all subject/keystage combinations. */
export async function buildIndexBulkOps(
  client: OakClient,
  keyStages: readonly string[],
  subjects: readonly string[],
  options?: BuildIndexBulkOpsOptions,
): Promise<unknown[]> {
  const bulkOps: unknown[] = [];
  const filteredSubjects = filterSubjects(subjects);
  const filteredKeyStages = filterKeyStages(keyStages);

  sandboxLogger.debug('Starting bulk ops build', {
    subjectCount: filteredSubjects.length,
    keyStageCount: filteredKeyStages.length,
  });

  let subjectIndex = 0;
  for (const subject of filteredSubjects) {
    subjectIndex++;
    sandboxLogger.debug('Processing subject', {
      subject,
      progress: `${subjectIndex}/${filteredSubjects.length}`,
    });
    const subjectOps = await buildOpsForSubject(client, subject, filteredKeyStages, options);
    bulkOps.push(...subjectOps);
  }

  sandboxLogger.debug('Bulk ops build complete', { totalOps: bulkOps.length });
  sandboxLogger.info('buildIndexBulkOps.complete', { totalOps: bulkOps.length });
  return bulkOps;
}

/** Filter key stages to valid values. */
function filterKeyStages(list: readonly string[]): KeyStage[] {
  return list.filter((ks): ks is KeyStage => isKeyStage(ks));
}

/** Filter subjects to valid values. */
function filterSubjects(list: readonly string[]): SearchSubjectSlug[] {
  return list.filter((s): s is SearchSubjectSlug => isSubject(s));
}

/** Build operations for a single subject across all key stages. */
async function buildOpsForSubject(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStages: readonly KeyStage[],
  options?: BuildIndexBulkOpsOptions,
): Promise<unknown[]> {
  sandboxLogger.debug('Fetching sequences', { subject });
  const subjectSequences = await client.getSubjectSequences(subject);
  sandboxLogger.debug('Found sequences', { subject, count: subjectSequences.length });

  const { sequenceSources, events } = await buildSequenceSourcesWithEvents(
    client,
    subjectSequences,
    options,
  );
  emitSequenceFacetEvents(events, subject, options?.onSequenceFacetProcessed);

  const ops: unknown[] = [];
  let ksIndex = 0;
  for (const ks of keyStages) {
    ksIndex++;
    sandboxLogger.debug('Processing key stage', {
      subject,
      keyStage: ks,
      progress: `${ksIndex}/${keyStages.length}`,
    });
    const pairOps = await buildOpsForPair(client, ks, subject, subjectSequences, sequenceSources);
    ops.push(...pairOps);
    sandboxLogger.debug('Generated bulk operations', {
      subject,
      keyStage: ks,
      count: pairOps.length,
    });
  }
  return ops;
}

/** Build sequence facet sources with event collection. */
async function buildSequenceSourcesWithEvents(
  client: OakClient,
  subjectSequences: readonly SubjectSequenceEntry[],
  options?: BuildIndexBulkOpsOptions,
): Promise<{
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  events: readonly SequenceFacetProcessingMetrics[];
}> {
  const events: SequenceFacetProcessingMetrics[] = [];
  sandboxLogger.debug('Building sequence facet sources');

  const sequenceSources = await buildSequenceFacetSources(
    (slug) => client.getSequenceUnits(slug),
    subjectSequences,
    options?.onSequenceFacetProcessed
      ? {
          instrumentation: {
            record(details) {
              events.push(details);
            },
          },
        }
      : undefined,
  );

  sandboxLogger.debug('Sequence facet sources built');
  return { sequenceSources, events };
}

/** Build operations for a single subject/keystage pair. */
async function buildOpsForPair(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>,
): Promise<unknown[]> {
  const { units, groups } = await fetchPairData(client, ks, subject);

  const context: PairBuildContext = {
    client,
    ks,
    subject,
    subjectSequences,
    sequenceSources,
  };

  return buildPairDocuments(context, units, groups);
}
