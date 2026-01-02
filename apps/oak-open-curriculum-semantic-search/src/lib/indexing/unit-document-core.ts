/**
 * Core document builder for the oak_units Elasticsearch index.
 *
 * This module is the **single source of truth** for unit document creation,
 * used by both API and bulk ingestion paths (DRY compliance).
 *
 * The input-agnostic `CreateUnitDocParams` interface allows both paths to
 * provide extracted values without coupling to specific input types.
 *
 * @see SearchUnitsIndexDoc - The Zod-validated type this produces
 * @see transformBulkUnitToESDoc - Bulk path adapter that delegates here
 * @see createUnitDocument - API path function in document-transforms.ts
 *
 * @module lib/indexing/unit-document-core
 */

import type { KeyStage, SearchSubjectSlug, SearchUnitsIndexDoc } from '../../types/oak';
import type { Ks4DocumentFields } from './document-transform-helpers';

/**
 * Thread information for unit documents.
 */
export interface UnitThreadInfo {
  readonly slugs: readonly string[];
  readonly titles: readonly string[];
  readonly orders: readonly number[];
}

/**
 * Unit enrichment fields.
 */
export interface UnitEnrichmentFields {
  readonly unit_topics?: readonly string[];
  readonly description?: string;
  readonly why_this_why_now?: string;
  readonly prior_knowledge_requirements?: readonly string[];
  readonly national_curriculum_content?: readonly string[];
}

/**
 * Input-agnostic parameters for creating a unit document.
 *
 * This interface contains **extracted values** rather than raw input types,
 * allowing both API and bulk paths to provide data without coupling.
 */
export interface CreateUnitDocParams {
  // === Identity ===
  readonly unitSlug: string;
  readonly unitTitle: string;

  // === Subject/KeyStage ===
  readonly subjectSlug: SearchSubjectSlug;
  readonly subjectTitle: string | undefined;
  readonly keyStage: KeyStage;
  readonly keyStageTitle: string | undefined;

  // === Years ===
  readonly years: readonly string[] | undefined;

  // === Lessons ===
  readonly lessonIds: readonly string[];

  // === URLs ===
  readonly unitUrl: string;
  readonly subjectProgrammesUrl: string;

  // === Thread/Sequence info ===
  readonly threadInfo: UnitThreadInfo | undefined;

  // === Enrichment ===
  readonly enrichment: UnitEnrichmentFields | undefined;

  // === KS4 (optional) ===
  readonly ks4?: Ks4DocumentFields;
}

/** Copy array if defined and non-empty */
function copyArrayOrUndefined<T>(arr: readonly T[] | undefined): T[] | undefined {
  return arr && arr.length > 0 ? [...arr] : undefined;
}

/** Build thread-related fields */
function buildThreadFields(threadInfo: UnitThreadInfo | undefined) {
  const sequenceIds = copyArrayOrUndefined(threadInfo?.slugs);
  return {
    docFields: {
      sequence_ids: sequenceIds,
      thread_slugs: copyArrayOrUndefined(threadInfo?.slugs),
      thread_titles: copyArrayOrUndefined(threadInfo?.titles),
      thread_orders: copyArrayOrUndefined(threadInfo?.orders),
    },
    sequenceIdsForSuggest: sequenceIds ?? [],
  };
}

/** Build enrichment fields */
function buildEnrichmentDocFields(enrichment: UnitEnrichmentFields | undefined) {
  return {
    unit_topics: copyArrayOrUndefined(enrichment?.unit_topics),
    description: enrichment?.description,
    why_this_why_now: enrichment?.why_this_why_now,
    prior_knowledge_requirements: copyArrayOrUndefined(enrichment?.prior_knowledge_requirements),
    national_curriculum_content: copyArrayOrUndefined(enrichment?.national_curriculum_content),
  };
}

/**
 * Creates an Elasticsearch document for the oak_units index.
 *
 * This is the **shared builder** for unit documents, providing a single source
 * of truth for document creation logic. Both API and bulk ingestion paths
 * delegate to this function.
 *
 * @param params - Unit data extracted from any source (API or bulk)
 * @returns A valid SearchUnitsIndexDoc ready for Elasticsearch indexing
 */
export function buildUnitDocument(params: CreateUnitDocParams): SearchUnitsIndexDoc {
  const { unitSlug, unitTitle, subjectSlug, keyStage, lessonIds, threadInfo, enrichment, ks4 } =
    params;
  const { docFields: threadDocFields, sequenceIdsForSuggest } = buildThreadFields(threadInfo);
  const enrichmentFields = buildEnrichmentDocFields(enrichment);

  return {
    unit_id: unitSlug,
    unit_slug: unitSlug,
    unit_title: unitTitle,
    subject_slug: subjectSlug,
    subject_title: params.subjectTitle,
    key_stage: keyStage,
    key_stage_title: params.keyStageTitle,
    years: copyArrayOrUndefined(params.years),
    lesson_ids: [...lessonIds],
    lesson_count: lessonIds.length,
    unit_url: params.unitUrl,
    subject_programmes_url: params.subjectProgrammesUrl,
    ...threadDocFields,
    ...enrichmentFields,
    ...ks4,
    title_suggest: {
      input: [unitTitle],
      contexts: { subject: [subjectSlug], key_stage: [keyStage], sequence: sequenceIdsForSuggest },
    },
    doc_type: 'unit',
  };
}
