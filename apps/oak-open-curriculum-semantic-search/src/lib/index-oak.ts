/**
 * @module index-oak
 * @description Builds Elasticsearch bulk operations for Oak curriculum data.
 * Orchestrates the creation of unit, lesson, rollup, and sequence facet documents.
 */

import type { Client } from '@elastic/elasticsearch';
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
import {
  createDataIntegrityCollector,
  type DataIntegrityReport,
} from './indexing/data-integrity-report';

/** Options for building bulk operations. */
export interface BuildIndexBulkOpsOptions {
  readonly onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void;
}

export interface BuildIndexBulkOpsResult {
  operations: unknown[];
  dataIntegrityReport: DataIntegrityReport;
}

/** Build bulk operations for all subject/keystage combinations. */
export async function buildIndexBulkOps(
  client: OakClient,
  esClient: Client,
  keyStages: readonly string[],
  subjects: readonly string[],
  options?: BuildIndexBulkOpsOptions,
): Promise<BuildIndexBulkOpsResult> {
  const bulkOps: unknown[] = [];
  const dataIntegrityReport = createDataIntegrityCollector();
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
    const subjectOps = await buildOpsForSubject(
      client,
      esClient,
      subject,
      filteredKeyStages,
      dataIntegrityReport,
      options,
    );
    bulkOps.push(...subjectOps);
  }

  sandboxLogger.debug('Bulk ops build complete', { totalOps: bulkOps.length });
  sandboxLogger.info('buildIndexBulkOps.complete', { totalOps: bulkOps.length });
  return { operations: bulkOps, dataIntegrityReport };
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
  esClient: Client,
  subject: SearchSubjectSlug,
  keyStages: readonly KeyStage[],
  dataIntegrityReport: DataIntegrityReport,
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
    const pairOps = await buildOpsForPair(
      client,
      esClient,
      ks,
      subject,
      subjectSequences,
      sequenceSources,
      dataIntegrityReport,
    );
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
  esClient: Client,
  ks: KeyStage,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>,
  dataIntegrityReport: DataIntegrityReport,
): Promise<unknown[]> {
  const { units, groups } = await fetchPairData(client, ks, subject);

  const context: PairBuildContext = {
    client,
    esClient,
    ks,
    subject,
    subjectSequences,
    sequenceSources,
    dataIntegrityReport,
  };

  return buildPairDocuments(context, units, groups);
}
