/**
 * Builds Elasticsearch bulk operations for Oak curriculum data.
 *
 * This module orchestrates the creation of unit, lesson, rollup, and sequence
 * facet documents for indexing. KS4 metadata denormalisation (tiers, exam boards,
 * exam subjects) is handled by building a UnitContextMap during sequence traversal,
 * which is then used to decorate documents during indexing.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import { formatSdkError, isKeyStage, isSubject } from '@oaknational/curriculum-sdk';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import {
  buildSequenceFacetSources,
  type SequenceFacetProcessingMetrics,
} from './indexing/sequence-facet-index';
import { ingestLogger } from './logger';
import { emitSequenceFacetEvents, resolveSequenceSlugFromEntry } from './index-oak-helpers';
import { buildKeyStageOps } from './index-oak-keystage-ops';
import {
  createDataIntegrityCollector,
  type DataIntegrityReport,
} from './indexing/data-integrity-report';
import { fetchAndBuildThreadOps } from './indexing/thread-bulk-helpers';
import { buildKs4ContextMap, type UnitContextMap } from './indexing/ks4-context-builder';
import type { BulkOperations } from './indexing/bulk-operation-types';

/** Options for building bulk operations. */
export interface BuildIndexBulkOpsOptions {
  readonly onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void;
}

export interface BuildIndexBulkOpsResult {
  operations: BulkOperations;
  dataIntegrityReport: DataIntegrityReport;
}

/** Build bulk operations for all subject/keystage combinations. */
export async function buildIndexBulkOps(
  client: OakClient,
  keyStages: readonly string[],
  subjects: readonly string[],
  options?: BuildIndexBulkOpsOptions,
): Promise<BuildIndexBulkOpsResult> {
  const bulkOps: BulkOperations = [];
  const dataIntegrityReport = createDataIntegrityCollector();
  const filteredSubjects = filterSubjects(subjects);
  const filteredKeyStages = filterKeyStages(keyStages);

  ingestLogger.debug('Starting bulk ops build', {
    subjectCount: filteredSubjects.length,
    keyStageCount: filteredKeyStages.length,
  });

  let subjectIndex = 0;
  for (const subject of filteredSubjects) {
    subjectIndex++;
    ingestLogger.debug('Processing subject', {
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

  ingestLogger.debug('Building thread operations');
  const threadOps = await fetchAndBuildThreadOps(client, { subjectSlugs: filteredSubjects });
  bulkOps.push(...threadOps);
  ingestLogger.debug('Built thread operations', { count: threadOps.length / 2 });

  ingestLogger.debug('Bulk ops build complete', { totalOps: bulkOps.length });
  ingestLogger.info('buildIndexBulkOps.complete', { totalOps: bulkOps.length });
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

/**
 * Build KS4 context map for a subject from its sequences.
 *
 * Traverses all sequences for a subject and extracts KS4 metadata
 * (tiers, exam boards, exam subjects) from sequence units.
 *
 * @param client - Oak SDK client for fetching sequence units
 * @param subject - Subject slug for logging context
 * @param subjectSequences - Sequences to traverse
 * @returns Map of unit slugs to their aggregated KS4 context
 */
async function buildSubjectKs4ContextMap(
  client: OakClient,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
): Promise<UnitContextMap> {
  ingestLogger.debug('Building KS4 context map', { subject });

  const unitContextMap = await buildKs4ContextMap(
    async (slug) => {
      const result = await client.getSequenceUnits(slug);
      return result.ok ? result.value : [];
    },
    subjectSequences.map((seq) => ({
      sequenceSlug: resolveSequenceSlugFromEntry(seq),
      ks4Options: seq.ks4Options ?? null,
    })),
    ingestLogger,
  );

  ingestLogger.debug('KS4 context map built', {
    subject,
    unitsWithKs4Context: unitContextMap.size,
  });

  return unitContextMap;
}

/** Build operations for a single subject across all key stages. */
async function buildOpsForSubject(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStages: readonly KeyStage[],
  dataIntegrityReport: DataIntegrityReport,
  options?: BuildIndexBulkOpsOptions,
): Promise<BulkOperations> {
  ingestLogger.debug('Fetching sequences', { subject });
  const sequencesResult = await client.getSubjectSequences(subject);
  if (!sequencesResult.ok) {
    // Sequence fetching failure is non-recoverable for this subject
    ingestLogger.error('Failed to fetch sequences', {
      subject,
      error: formatSdkError(sequencesResult.error),
    });
    return [];
  }
  const subjectSequences = sequencesResult.value;
  ingestLogger.debug('Found sequences', { subject, count: subjectSequences.length });

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

/**
 * Build sequence facet sources with optional instrumentation.
 *
 * Fetches units for each sequence to build facet metadata.
 * Collects processing events if instrumentation is enabled.
 */
async function buildSequenceSourcesWithEvents(
  client: OakClient,
  subjectSequences: readonly SubjectSequenceEntry[],
  options?: BuildIndexBulkOpsOptions,
): Promise<{
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  events: readonly SequenceFacetProcessingMetrics[];
}> {
  const events: SequenceFacetProcessingMetrics[] = [];
  const sequenceSources = await buildSequenceFacetSources(
    async (slug) => {
      const result = await client.getSequenceUnits(slug);
      return result.ok ? result.value : [];
    },
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
  return { sequenceSources, events };
}
