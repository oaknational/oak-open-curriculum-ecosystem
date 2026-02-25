/**
 * Creates Elasticsearch documents for reference data indexes.
 *
 * Reference indexes store metadata about curriculum entities (subjects, key stages,
 * glossary terms) with aggregated counts. They are used for navigation, autocomplete,
 * and enrichment of primary content indexes.
 *
 * @see REF_SUBJECTS_INDEX_FIELDS - Subject reference field definitions
 * @see REF_KEY_STAGES_INDEX_FIELDS - Key stage reference field definitions
 * @see CURRICULUM_GLOSSARY_INDEX_FIELDS - Glossary field definitions
 */

import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

/**
 * Document type for the oak_ref_subjects index.
 *
 * This type mirrors the generated schema but is defined here to avoid
 * circular dependencies before sdk-codegen runs.
 */
export interface RefSubjectIndexDoc {
  readonly subject_slug: SearchSubjectSlug;
  readonly subject_title: string;
  readonly key_stages: readonly string[];
  readonly sequence_count: number;
  readonly unit_count: number;
  readonly lesson_count: number;
  readonly has_tiers: boolean;
  readonly subject_url: string;
}

/**
 * Document type for the oak_ref_key_stages index.
 */
export interface RefKeyStageIndexDoc {
  readonly key_stage_slug: KeyStage;
  readonly key_stage_title: string;
  readonly phase: string;
  readonly years: readonly string[];
  readonly subject_count: number;
  readonly unit_count: number;
  readonly lesson_count: number;
}

/**
 * Document type for the oak_curriculum_glossary index.
 */
export interface CurriculumGlossaryIndexDoc {
  readonly term: string;
  readonly term_slug: string;
  readonly definition: string | undefined;
  readonly subject_slugs: readonly string[];
  readonly key_stages: readonly string[];
  readonly lesson_ids: readonly string[];
  readonly usage_count: number;
  readonly term_semantic?: string;
  readonly term_url?: string;
}

/**
 * Parameters for creating a subject reference document.
 */
export interface CreateRefSubjectDocumentParams {
  readonly subjectSlug: SearchSubjectSlug;
  readonly subjectTitle: string;
  readonly keyStages: readonly string[];
  readonly sequenceCount: number;
  readonly unitCount: number;
  readonly lessonCount: number;
  readonly hasTiers: boolean;
}

/**
 * Creates an Elasticsearch document for the oak_ref_subjects index.
 *
 * @example
 * ```typescript
 * const doc = createRefSubjectDocument({
 *  subjectSlug: 'maths',
 *  subjectTitle: 'Mathematics',
 *  keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
 *  sequenceCount: 8,
 *  unitCount: 120,
 *  lessonCount: 450,
 *  hasTiers: true,
 * });
 * ```
 */
export function createRefSubjectDocument(
  params: CreateRefSubjectDocumentParams,
): RefSubjectIndexDoc {
  const { subjectSlug, subjectTitle, keyStages, sequenceCount, unitCount, lessonCount, hasTiers } =
    params;

  const subjectUrl = `https://www.thenational.academy/teachers/subjects/${subjectSlug}`;

  return {
    subject_slug: subjectSlug,
    subject_title: subjectTitle,
    key_stages: [...keyStages],
    sequence_count: sequenceCount,
    unit_count: unitCount,
    lesson_count: lessonCount,
    has_tiers: hasTiers,
    subject_url: subjectUrl,
  };
}

/**
 * Parameters for creating a key stage reference document.
 */
export interface CreateRefKeyStageDocumentParams {
  readonly keyStageSlug: KeyStage;
  readonly keyStageTitle: string;
  readonly phase: string;
  readonly years: readonly string[];
  readonly subjectCount: number;
  readonly unitCount: number;
  readonly lessonCount: number;
}

/**
 * Creates an Elasticsearch document for the oak_ref_key_stages index.
 *
 * @example
 * ```typescript
 * const doc = createRefKeyStageDocument({
 *  keyStageSlug: 'ks4',
 *  keyStageTitle: 'Key Stage 4',
 *  phase: 'secondary',
 *  years: ['10', '11'],
 *  subjectCount: 12,
 *  unitCount: 200,
 *  lessonCount: 800,
 * });
 * ```
 */
export function createRefKeyStageDocument(
  params: CreateRefKeyStageDocumentParams,
): RefKeyStageIndexDoc {
  const { keyStageSlug, keyStageTitle, phase, years, subjectCount, unitCount, lessonCount } =
    params;

  return {
    key_stage_slug: keyStageSlug,
    key_stage_title: keyStageTitle,
    phase,
    years: [...years],
    subject_count: subjectCount,
    unit_count: unitCount,
    lesson_count: lessonCount,
  };
}

/**
 * Parameters for creating a glossary document.
 */
export interface CreateGlossaryDocumentParams {
  readonly term: string;
  readonly definition: string | undefined;
  readonly subjectSlugs: readonly string[];
  readonly keyStages: readonly string[];
  readonly lessonIds: readonly string[];
  readonly usageCount: number;
}

/**
 * Converts a term to a URL-safe slug.
 *
 * @param term - The term to convert
 * @returns A kebab-case slug
 */
function toTermSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/['''`]/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Creates an Elasticsearch document for the oak_curriculum_glossary index.
 *
 * @example
 * ```typescript
 * const doc = createGlossaryDocument({
 *  term: 'quadratic equations',
 *  definition: 'An equation where the highest power of the variable is 2...',
 *  subjectSlugs: ['maths'],
 *  keyStages: ['ks4'],
 *  lessonIds: ['lesson-1', 'lesson-2'],
 *  usageCount: 12,
 * });
 * ```
 */
export function createGlossaryDocument(
  params: CreateGlossaryDocumentParams,
): CurriculumGlossaryIndexDoc {
  const { term, definition, subjectSlugs, keyStages, lessonIds, usageCount } = params;

  return {
    term,
    term_slug: toTermSlug(term),
    definition,
    subject_slugs: [...subjectSlugs],
    key_stages: [...keyStages],
    lesson_ids: [...lessonIds],
    usage_count: usageCount,
  };
}
