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

/** CLI-friendly log helper for progress reporting. */
function progressLog(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${message}`);
}

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

  progressLog(
    `Starting bulk ops build: ${filteredSubjects.length} subjects × ${filteredKeyStages.length} key stages`,
  );
  sandboxLogger.info('buildIndexBulkOps.start', {
    subjectCount: filteredSubjects.length,
    keyStageCount: filteredKeyStages.length,
  });

  let subjectIndex = 0;
  for (const subject of filteredSubjects) {
    subjectIndex++;
    progressLog(`[${subjectIndex}/${filteredSubjects.length}] Processing subject: ${subject}`);
    const subjectOps = await buildOpsForSubject(client, subject, filteredKeyStages, options);
    bulkOps.push(...subjectOps);
  }

  progressLog(`Bulk ops build complete: ${bulkOps.length} total operations`);
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
  progressLog(`  Fetching sequences for ${subject}...`);
  const subjectSequences = await client.getSubjectSequences(subject);
  progressLog(`  Found ${subjectSequences.length} sequences`);

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
    progressLog(`  [${ksIndex}/${keyStages.length}] Processing ${subject}/${ks}...`);
    const pairOps = await buildOpsForPair(client, ks, subject, subjectSequences, sequenceSources);
    ops.push(...pairOps);
    progressLog(`    Generated ${pairOps.length} bulk operations`);
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
  progressLog(`  Building sequence facet sources...`);

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

  progressLog(`  Sequence facet sources built`);
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
