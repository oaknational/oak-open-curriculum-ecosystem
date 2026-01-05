/**
 * Document transformation functions for Elasticsearch indexing.
 * Creates unit, lesson, and rollup documents from Oak API data.
 *
 * Lesson documents use the shared `buildLessonDocument()` builder
 * for DRY compliance with bulk ingestion paths.
 *
 * @see ADR-075 Two-way Hybrid Search
 * @see ADR-080 KS4 Metadata Denormalisation
 * @see buildLessonDocument - Shared lesson document builder
 */
/* eslint-disable max-lines -- Document transforms require comprehensive field mappings */

import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
  SearchUnitSummary,
} from '../../types/oak';
import {
  extractLessonDocumentFields,
  extractRollupDocumentFields,
  extractPedagogicalData,
  createEnrichedRollupText,
  extractKs4DocumentFields,
  extractUnitEnrichmentFields,
} from './document-transform-helpers';
import { getKs4ContextForUnit, type UnitContextMap } from './ks4-context-builder';
import {
  generateLessonSemanticSummary,
  generateUnitSemanticSummary,
} from './semantic-summary-generator';
import { normaliseYears } from './document-transform-utils';
import { extractThreadInfo } from './thread-and-pedagogical-extractors';
import {
  buildLessonDocument,
  type CreateLessonDocParams,
  type LessonUnitInfo,
} from './lesson-document-core';
import { buildUnitDocument, type CreateUnitDocParams } from './unit-document-core';

export { extractLessonPlanningFields } from './document-transform-helpers';
export { normaliseYears, extractPassage } from './document-transform-utils';

// Re-export LessonUnitInfo from shared module for backwards compatibility
export type { LessonUnitInfo } from './lesson-document-core';

/**
 * Parameters for creating a unit document via API path.
 *
 * This interface is specific to the API path, accepting API types
 * (SearchUnitSummary, UnitContextMap). The function extracts
 * relevant fields and delegates to the shared builder.
 */
export interface CreateUnitDocumentParams {
  summary: SearchUnitSummary;
  subject: SearchSubjectSlug;
  /** Display title for the subject (e.g., "Mathematics" instead of "maths") */
  subjectTitle?: string;
  keyStage: KeyStage;
  /** Display title for the key stage (e.g., "Key Stage 2" instead of "ks2") */
  keyStageTitle?: string;
  subjectProgrammesUrl: string;
  /** KS4 metadata context map per ADR-080 */
  unitContextMap: UnitContextMap;
  /** Aggregated lesson data per unit - if provided, overrides summary.unitLessons */
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>;
}

/** Convert ThreadInfo to UnitThreadInfo format */
/**
 * Derives phase slug from key stage.
 *
 * Phases are the fundamental curriculum division:
 * - `primary`: Years 1-6 (KS1 + KS2)
 * - `secondary`: Years 7-11 (KS3 + KS4)
 *
 * @param keyStage - The key stage slug
 * @returns The corresponding phase slug
 */
function derivePhaseFromKeyStage(keyStage: KeyStage): 'primary' | 'secondary' {
  return keyStage === 'ks1' || keyStage === 'ks2' ? 'primary' : 'secondary';
}

function convertThreadInfo(info: ReturnType<typeof extractThreadInfo>) {
  if (!info.slugs || info.slugs.length === 0) {
    return undefined;
  }
  return { slugs: info.slugs, titles: info.titles ?? [], orders: info.orders ?? [] };
}

/** Get lesson IDs from params */
function getLessonIds(
  summary: SearchUnitSummary,
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>,
) {
  const ids = lessonsByUnit?.get(summary.unitSlug) ?? summary.unitLessons.map((l) => l.lessonSlug);
  return [...ids];
}

/**
 * Extracts unit document params from API types.
 *
 * This function transforms API-specific types into the input-agnostic
 * `CreateUnitDocParams` interface used by the shared builder.
 */
export function extractUnitParamsFromAPI(params: CreateUnitDocumentParams): CreateUnitDocParams {
  const {
    summary,
    subject,
    subjectTitle,
    keyStage,
    keyStageTitle,
    subjectProgrammesUrl,
    unitContextMap,
    lessonsByUnit,
  } = params;

  if (!summary.canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  return {
    unitSlug: summary.unitSlug,
    unitTitle: summary.unitTitle,
    subjectSlug: subject,
    subjectTitle,
    keyStage,
    keyStageTitle,
    years: normaliseYears(summary.year, summary.yearSlug),
    lessonIds: getLessonIds(summary, lessonsByUnit),
    unitUrl: summary.canonicalUrl,
    subjectProgrammesUrl,
    threadInfo: convertThreadInfo(extractThreadInfo(summary.threads)),
    enrichment: {
      unit_topics: summary.categories?.map((cat) => cat.categoryTitle),
      ...extractUnitEnrichmentFields(summary),
    },
    ks4: extractKs4DocumentFields(getKs4ContextForUnit(unitContextMap, summary.unitSlug)),
  };
}

/**
 * Creates a unit document for Elasticsearch indexing.
 *
 * Uses the shared `buildUnitDocument()` builder to ensure DRY compliance
 * and a single source of truth for unit document creation logic.
 *
 * @param params - API path params including SearchUnitSummary and UnitContextMap
 * @returns SearchUnitsIndexDoc ready for ES indexing
 *
 * @see buildUnitDocument - Shared builder this delegates to
 */
export function createUnitDocument(params: CreateUnitDocumentParams): SearchUnitsIndexDoc {
  const docParams = extractUnitParamsFromAPI(params);
  return buildUnitDocument(docParams);
}

/**
 * Parameters for creating a lesson document via API path.
 *
 * This interface is specific to the API path, accepting API types
 * (SearchLessonSummary, UnitContextMap). The function extracts
 * relevant fields and delegates to the shared builder.
 */
export interface CreateLessonDocumentParams {
  lesson: { lessonSlug: string; lessonTitle: string };
  /**
   * Lesson transcript text. When undefined, null, or empty, content fields are
   * omitted from the document to avoid polluting BM25/ELSER indexes.
   *
   * @see ADR-095 for rationale on conditional field inclusion
   */
  transcript: string | undefined | null;
  summary: SearchLessonSummary;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  lessonCount: number;
  unitContextMap: UnitContextMap;
  /** ALL units this lesson belongs to - we never discard unit relationships. */
  units: readonly LessonUnitInfo[];
}

/**
 * Extracts lesson document params from API types.
 *
 * This function transforms API-specific types into the input-agnostic
 * `CreateLessonDocParams` interface used by the shared builder.
 *
 * @param params - API path params
 * @returns Params for `buildLessonDocument()`
 */
export function extractLessonParamsFromAPI(
  params: CreateLessonDocumentParams,
): CreateLessonDocParams {
  const {
    lesson,
    transcript,
    summary,
    subject,
    keyStage,
    years,
    lessonCount,
    unitContextMap,
    units,
  } = params;

  if (units.length === 0) {
    throw new Error(`Lesson ${lesson.lessonSlug} has no unit relationships`);
  }

  const primaryUnitSlug = units[0].unitSlug;
  const f = extractLessonDocumentFields(summary);
  const ks4 = extractKs4DocumentFields(getKs4ContextForUnit(unitContextMap, primaryUnitSlug));
  const lessonStructure = generateLessonSemanticSummary(summary);

  return {
    lessonSlug: lesson.lessonSlug,
    lessonTitle: lesson.lessonTitle,
    subjectSlug: subject,
    subjectTitle: f.subjectTitle,
    keyStage,
    keyStageTitle: f.keyStageTitle,
    years,
    units,
    unitCount: lessonCount,
    lessonKeywords: f.lessonKeywords,
    keyLearningPoints: f.keyLearningPoints,
    misconceptions: f.misconceptions,
    teacherTips: f.teacherTips,
    contentGuidance: f.contentGuidance,
    transcript,
    lessonStructure,
    lessonUrl: f.canonicalUrl,
    pupilLessonOutcome: f.pupilLessonOutcome,
    supervisionLevel: f.supervisionLevel,
    downloadsAvailable: f.downloadsAvailable,
    ks4,
  };
}

/**
 * Creates a lesson document for Elasticsearch indexing.
 *
 * Uses the shared `buildLessonDocument()` builder to ensure DRY compliance
 * and a single source of truth for lesson document creation logic.
 *
 * Content fields (`lesson_content`, `lesson_content_semantic`) are conditionally
 * included based on transcript availability. This prevents placeholder text from
 * polluting the BM25 index and wasting ELSER inference.
 *
 * Structure fields (`lesson_structure`, `lesson_structure_semantic`) are always
 * populated from pedagogical metadata.
 *
 * @param params - API path params including SearchLessonSummary and UnitContextMap
 * @returns SearchLessonsIndexDoc ready for ES indexing
 *
 * @see buildLessonDocument - Shared builder this delegates to
 * @see ADR-094 for `has_transcript` field rationale
 * @see ADR-095 for conditional field inclusion rationale
 */
export function createLessonDocument(params: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  const docParams = extractLessonParamsFromAPI(params);
  return buildLessonDocument(docParams);
}

export interface CreateRollupDocumentParams {
  summary: SearchUnitSummary;
  snippets: string[];
  subject: SearchSubjectSlug;
  subjectTitle?: string;
  keyStage: KeyStage;
  keyStageTitle?: string;
  subjectProgrammesUrl: string;
  unitContextMap: UnitContextMap;
  /** Aggregated lesson data per unit - if provided, overrides summary.unitLessons */
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>;
}

/** Creates a rollup document for Elasticsearch indexing. */
export function createRollupDocument(params: CreateRollupDocumentParams): SearchUnitRollupDoc {
  const {
    summary,
    snippets,
    subject,
    subjectTitle,
    keyStage,
    keyStageTitle,
    subjectProgrammesUrl,
    unitContextMap,
    lessonsByUnit,
  } = params;
  const fields = extractRollupDocumentFields(summary, normaliseYears, lessonsByUnit);
  const rollupText = createEnrichedRollupText(snippets, extractPedagogicalData(summary));
  const ks4 = extractKs4DocumentFields(getKs4ContextForUnit(unitContextMap, summary.unitSlug));
  const unitSemantic = generateUnitSemanticSummary(
    summary,
    keyStageTitle ?? keyStage,
    subjectTitle ?? subject,
  );
  return {
    unit_id: fields.unitSlug,
    unit_slug: fields.unitSlug,
    unit_title: fields.unitTitle,
    subject_slug: subject,
    subject_title: subjectTitle,
    key_stage: keyStage,
    key_stage_title: keyStageTitle,
    phase_slug: derivePhaseFromKeyStage(keyStage),
    years: fields.years,
    lesson_ids: fields.lessonIds,
    lesson_count: fields.lessonIds.length,
    unit_topics: fields.unitTopics,
    unit_content: rollupText,
    unit_structure: unitSemantic,
    unit_content_semantic: rollupText,
    unit_structure_semantic: unitSemantic,
    unit_url: fields.canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: fields.sequenceIds,
    thread_slugs: fields.threadSlugs,
    thread_titles: fields.threadTitles,
    thread_orders: fields.threadOrders,
    ...extractUnitEnrichmentFields(summary),
    ...ks4,
    doc_type: 'unit',
  };
}
