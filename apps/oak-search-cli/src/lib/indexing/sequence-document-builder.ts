/**
 * Creates Elasticsearch documents for the oak_sequences index.
 *
 * Sequences represent curriculum programmes (e.g., 'maths-secondary') that span
 * multiple key stages and contain ordered units.
 *
 * Uses shared canonical URL generator for DRY compliance.
 *
 * @see SearchSequenceIndexDoc - The Zod-validated type this produces
 * @see SEQUENCES_INDEX_FIELDS - Field definitions in SDK
 * @see generateSequenceCanonicalUrl - URL generation (single source of truth)
 */

import type { SearchSequenceIndexDoc, SearchSubjectSlug } from '../../types/oak';
import { generateSequenceCanonicalUrl } from './canonical-url-generator';

/**
 * Parameters for creating a sequence document.
 *
 * All data is extracted from already-fetched API responses during ingestion.
 * No additional API calls are required.
 */
export interface CreateSequenceDocumentParams {
  /** The sequence slug (e.g., 'maths-secondary') */
  readonly sequenceSlug: string;
  /** The subject slug (e.g., 'maths') */
  readonly subjectSlug: SearchSubjectSlug;
  /** The subject title (e.g., 'Mathematics') */
  readonly subjectTitle: string;
  /** The phase slug (e.g., 'secondary', 'primary') */
  readonly phaseSlug: string;
  /** The phase title (e.g., 'Secondary', 'Primary') */
  readonly phaseTitle: string;
  /** Key stages covered by this sequence */
  readonly keyStages: readonly string[];
  /** Years covered by this sequence */
  readonly years: readonly string[];
  /** Slugs of units in this sequence */
  readonly unitSlugs: readonly string[];
  /** Category/topic titles aggregated from units */
  readonly categoryTitles: readonly string[];
  /** Deterministic semantic summary for ELSER embeddings. Must be non-empty. */
  readonly sequenceSemantic: string;
}

/**
 * Creates an Elasticsearch document for the oak_sequences index.
 *
 * Sequences are programmes that contain ordered units across key stages.
 * The sequence title is constructed from subject + phase titles.
 *
 * @example
 * ```typescript
 * const doc = createSequenceDocument({
 *  sequenceSlug: 'maths-secondary',
 *  subjectSlug: 'maths',
 *  subjectTitle: 'Mathematics',
 *  phaseSlug: 'secondary',
 *  phaseTitle: 'Secondary',
 *  keyStages: ['ks3', 'ks4'],
 *  years: ['7', '8', '9', '10', '11'],
 *  unitSlugs: ['unit-1', 'unit-2'],
 *  categoryTitles: ['Algebra', 'Geometry'],
 *  sequenceSemantic: 'Mathematics Secondary is a Mathematics Secondary curriculum sequence...',
 * });
 * ```
 *
 * @param params - The sequence data extracted from API responses
 * @returns A valid SearchSequenceIndexDoc ready for Elasticsearch indexing
 */
export function createSequenceDocument(
  params: CreateSequenceDocumentParams,
): SearchSequenceIndexDoc {
  const {
    sequenceSlug,
    subjectSlug,
    subjectTitle,
    phaseSlug,
    phaseTitle,
    keyStages,
    years,
    unitSlugs,
    categoryTitles,
    sequenceSemantic,
  } = params;

  if (sequenceSemantic.trim().length === 0) {
    throw new Error(
      `createSequenceDocument: sequenceSemantic must not be empty or whitespace — ` +
        `sequence "${sequenceSlug}".`,
    );
  }

  const sequenceTitle = `${subjectTitle} ${phaseTitle}`;
  const sequenceUrl = generateSequenceCanonicalUrl(sequenceSlug);

  return {
    sequence_id: sequenceSlug,
    sequence_slug: sequenceSlug,
    sequence_title: sequenceTitle,
    subject_slug: subjectSlug,
    subject_title: subjectTitle,
    phase_slug: phaseSlug,
    phase_title: phaseTitle,
    key_stages: [...keyStages],
    years: [...years],
    unit_slugs: [...unitSlugs],
    category_titles: [...categoryTitles],
    sequence_semantic: sequenceSemantic,
    sequence_url: sequenceUrl,
    title_suggest: {
      input: [sequenceTitle],
      contexts: {
        subject: [subjectSlug],
        phase: [phaseSlug],
      },
    },
    doc_type: 'sequence',
  };
}
