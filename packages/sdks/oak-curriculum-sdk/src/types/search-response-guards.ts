/**
 * Runtime response-shape guards for SDK endpoints used by the search app.
 *
 * Centralised here so downstream apps do not define their own guards.
 */

import type { z } from 'zod';
import {
  rawCurriculumSchemas,
  curriculumSchemas,
} from '@oaknational/curriculum-sdk-generation/zod';

/** Schema for lesson summaries derived from the OpenAPI specification. */
export const lessonSummarySchema = rawCurriculumSchemas.LessonSummaryResponseSchema;

/** Schema for unit summaries derived from the OpenAPI specification. */
export const unitSummarySchema = rawCurriculumSchemas.UnitSummaryResponseSchema;

/** Schema for subject sequences derived from the OpenAPI specification. */
export const subjectSequencesSchema = rawCurriculumSchemas.SubjectSequenceResponseSchema;

/** Schema for sequence units response derived from the OpenAPI specification. */
export const sequenceUnitsSchema = rawCurriculumSchemas.SequenceUnitsResponseSchema;

/** Type alias for the lesson summary schema derived from the OpenAPI specification. */
export type LessonSummaryResponseSchema = typeof lessonSummarySchema;

/** Type alias for the unit summary schema derived from the OpenAPI specification. */
export type UnitSummaryResponseSchema = typeof unitSummarySchema;

/** Type alias for the subject sequence schema derived from the OpenAPI specification. */
export type SubjectSequenceResponseSchema = typeof subjectSequencesSchema;

/** Type alias for the sequence units response schema derived from the OpenAPI specification. */
export type SequenceUnitsResponseSchema = typeof sequenceUnitsSchema;

export function isUnitsGrouped(
  v: unknown,
): v is { units: { unitSlug: string; unitTitle: string }[] }[] {
  return curriculumSchemas.AllKeyStageAndSubjectUnitsResponseSchema.safeParse(v).success;
}

export function isLessonGroups(v: unknown): v is {
  unitSlug: string;
  unitTitle: string;
  lessons: { lessonSlug: string; lessonTitle: string }[];
}[] {
  return curriculumSchemas.KeyStageSubjectLessonsResponseSchema.safeParse(v).success;
}

export function isTranscriptResponse(v: unknown): v is { transcript: string; vtt: string } {
  return curriculumSchemas.TranscriptResponseSchema.safeParse(v).success;
}

export type SearchLessonSummary = z.infer<LessonSummaryResponseSchema>;

export function isLessonSummary(v: unknown): v is SearchLessonSummary {
  return lessonSummarySchema.safeParse(v).success;
}

export type SearchUnitSummary = z.infer<UnitSummaryResponseSchema>;

export function isUnitSummary(v: unknown): v is SearchUnitSummary {
  return unitSummarySchema.safeParse(v).success;
}

export type SearchSubjectSequences = z.infer<SubjectSequenceResponseSchema>;

export function isSubjectSequences(v: unknown): v is SearchSubjectSequences {
  return subjectSequencesSchema.safeParse(v).success;
}

/** Type for sequence units response (API response for /sequences/:sequence/units). */
export type SequenceUnitsResponse = z.infer<SequenceUnitsResponseSchema>;

export function isSequenceUnitsResponse(v: unknown): v is SequenceUnitsResponse {
  return sequenceUnitsSchema.safeParse(v).success;
}

/** Schema for subject assets derived from the OpenAPI specification. */
export const subjectAssetsSchema = rawCurriculumSchemas.SubjectAssetsResponseSchema;

/** Type alias for the subject assets schema derived from the OpenAPI specification. */
export type SubjectAssetsResponseSchema = typeof subjectAssetsSchema;

/** Type for subject assets response (API response for /key-stages/:ks/subject/:subject/assets). */
export type SubjectAssets = z.infer<SubjectAssetsResponseSchema>;

/**
 * Type guard for subject assets response.
 * @param v - Value to check
 * @returns true if v is a valid SubjectAssets array
 */
export function isSubjectAssets(v: unknown): v is SubjectAssets {
  return subjectAssetsSchema.safeParse(v).success;
}
