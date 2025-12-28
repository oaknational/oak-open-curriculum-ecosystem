/**
 * Key stage-level bulk operations for Oak curriculum indexing.
 *
 * This module handles the iteration over key stages within a subject,
 * building Elasticsearch bulk operations for each (subject, keystage) pair.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter-sdk';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import { ingestLogger } from './logger';
import { fetchPairData, buildPairDocuments, type PairBuildContext } from './index-oak-helpers';
import type { DataIntegrityReport } from './indexing/data-integrity-report';
import type { UnitContextMap } from './indexing/ks4-context-builder';
import type { BulkOperations } from './indexing/bulk-operation-types';

/**
 * Build operations for all key stages of a subject.
 *
 * Iterates through each key stage and builds bulk operations for the
 * (subject, keystage) pair, including unit, lesson, and rollup documents.
 *
 * @param client - Oak SDK client for fetching curriculum data
 * @param subject - Subject slug being processed
 * @param keyStages - Key stages to iterate through
 * @param subjectSequences - All sequences for this subject
 * @param sequenceSources - Prebuilt sequence facet sources
 * @param unitContextMap - KS4 context for units in this subject
 * @param dataIntegrityReport - Collector for data integrity issues
 * @returns Combined bulk operations for all key stages
 */
export async function buildKeyStageOps(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStages: readonly KeyStage[],
  subjectSequences: readonly SubjectSequenceEntry[],
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<BulkOperations> {
  const ops: BulkOperations = [];
  let ksIndex = 0;

  for (const ks of keyStages) {
    ksIndex++;
    ingestLogger.debug('Processing key stage', {
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

    ingestLogger.debug('Generated bulk operations', {
      subject,
      keyStage: ks,
      count: pairOps.length,
    });
  }

  return ops;
}

/**
 * Build operations for a single subject/keystage pair.
 *
 * Fetches unit data for the pair and builds all document types:
 * unit documents, lesson documents, and rollup documents.
 */
async function buildOpsForPair(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<BulkOperations> {
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
