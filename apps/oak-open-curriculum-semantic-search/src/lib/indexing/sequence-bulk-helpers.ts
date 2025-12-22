/**
 * Builds bulk operations for the oak_sequences index.
 *
 * Sequences represent curriculum programmes that span key stages.
 * This module creates Elasticsearch bulk index operations from sequence data
 * already fetched during ingestion.
 *
 * @see createSequenceDocument - Document creation function
 * @see buildPairDocuments - Integration point in ingestion pipeline
 */

import type { SearchSubjectSlug } from '../../types/oak';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter-sdk';
import type { SequenceFacetSource } from './sequence-facets';
import { createSequenceDocument } from './sequence-document-builder';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { getSubjectTitle } from './subject-title-utils';
import type { BulkOperations } from './bulk-operation-types';

/**
 * Parameters for building sequence bulk operations.
 */
export interface BuildSequenceOpsParams {
  /** The subject slug */
  readonly subject: SearchSubjectSlug;
  /** Sequences for this subject */
  readonly sequences: readonly SubjectSequenceEntry[];
  /** Sequence sources with unit data */
  readonly sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
}

/**
 * Builds Elasticsearch bulk index operations for sequence documents.
 *
 * Extracts sequence data from already-fetched API responses.
 * No additional API calls are required.
 *
 * @example
 * ```typescript
 * const sequenceOps = buildSequenceOps({
 *  subject: 'maths',
 *  sequences: subjectSequences,
 *  sequenceSources: sequenceSourcesMap,
 * });
 * ```
 *
 * @param params - The sequence data from ingestion context
 * @returns Array of bulk operations (alternating metadata and document)
 */
export function buildSequenceOps(params: BuildSequenceOpsParams): BulkOperations {
  const { subject, sequences, sequenceSources } = params;
  const subjectTitle = getSubjectTitle(subject);
  const ops: BulkOperations = [];

  for (const seq of sequences) {
    const source = sequenceSources.get(seq.sequenceSlug);

    // Extract key stages from sequence
    const keyStages = seq.keyStages.map((ks) => ks.keyStageSlug);

    // Extract years
    const years = seq.years.map(String);

    // Extract unit slugs from source if available
    const unitSlugs = source?.unitSlugs ?? [];

    // Category titles would need to come from unit summaries
    // For now, leave empty - can be enriched later if needed
    const categoryTitles: string[] = [];

    const doc = createSequenceDocument({
      sequenceSlug: seq.sequenceSlug,
      subjectSlug: subject,
      subjectTitle,
      phaseSlug: seq.phaseSlug,
      phaseTitle: seq.phaseTitle,
      keyStages,
      years,
      unitSlugs,
      categoryTitles,
    });

    ops.push(
      {
        index: {
          _index: resolvePrimarySearchIndexName('sequences'),
          _id: seq.sequenceSlug,
        },
      },
      doc,
    );
  }

  return ops;
}
