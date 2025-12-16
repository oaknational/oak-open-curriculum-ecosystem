/**
 * Builds Elasticsearch bulk operations for Oak curriculum data.
 * Orchestrates the creation of unit, lesson, rollup, and sequence facet documents.
 *
 * KS4 metadata denormalisation (tiers, exam boards, exam subjects) is handled
 * by building a UnitContextMap during sequence traversal, which is then used
 * to decorate documents during indexing.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
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
  resolveSequenceSlugFromEntry,
  type PairBuildContext,
} from './index-oak-helpers';
import {
  createDataIntegrityCollector,
  type DataIntegrityReport,
} from './indexing/data-integrity-report';
import { fetchAndBuildThreadOps } from './indexing/thread-bulk-helpers';
import { buildKs4ContextMap, type UnitContextMap } from './indexing/ks4-context-builder';

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
      subject,
      filteredKeyStages,
      dataIntegrityReport,
      options,
    );
    bulkOps.push(...subjectOps);
  }

  // Build thread operations (once, not per subject/key-stage)
  // Pass ingested subjects for thread association
  sandboxLogger.debug('Building thread operations');
  const threadOps = await fetchAndBuildThreadOps(client, { subjectSlugs: filteredSubjects });
  bulkOps.push(...threadOps);
  sandboxLogger.debug('Built thread operations', { count: threadOps.length / 2 });

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

/** Build KS4 context map for a subject from its sequences. */
async function buildSubjectKs4ContextMap(
  client: OakClient,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
): Promise<UnitContextMap> {
  sandboxLogger.debug('Building KS4 context map', { subject });
  const unitContextMap = await buildKs4ContextMap(
    (slug) => client.getSequenceUnits(slug),
    subjectSequences.map((seq) => ({
      sequenceSlug: resolveSequenceSlugFromEntry(seq),
      ks4Options: seq.ks4Options ?? null,
    })),
    sandboxLogger,
  );
  sandboxLogger.debug('KS4 context map built', {
    subject,
    unitsWithKs4Context: unitContextMap.size,
  });
  return unitContextMap;
}

/** Build operations for all key stages of a subject. */
async function buildKeyStageOps(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStages: readonly KeyStage[],
  subjectSequences: readonly SubjectSequenceEntry[],
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<unknown[]> {
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
      ks,
      subject,
      subjectSequences,
      sequenceSources,
      unitContextMap,
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

/** Build operations for a single subject across all key stages. */
async function buildOpsForSubject(
  client: OakClient,
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

  const unitContextMap = await buildSubjectKs4ContextMap(client, subject, subjectSequences);
  return buildKeyStageOps(
    client,
    subject,
    keyStages,
    subjectSequences,
    sequenceSources,
    unitContextMap,
    dataIntegrityReport,
  );
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
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<unknown[]> {
  const { units } = await fetchPairData(client, ks, subject);

  const context: PairBuildContext = {
    client,
    ks,
    subject,
    subjectSequences,
    sequenceSources,
    unitContextMap,
    dataIntegrityReport,
  };

  return buildPairDocuments(context, units);
}
