/**
 * Runtime response-shape guards for SDK endpoints used by the search app.
 *
 * Centralised here so downstream apps do not define their own guards.
 */

import type { z } from 'zod';
import { curriculumSchemas } from './generated/zod/curriculumZodSchemas.js';

/** Schema for lesson summaries derived from the OpenAPI specification. */
export const lessonSummarySchema = curriculumSchemas.LessonSummaryResponseSchema;

/** Schema for unit summaries derived from the OpenAPI specification. */
export const unitSummarySchema = curriculumSchemas.UnitSummaryResponseSchema;

/** Schema for subject sequences derived from the OpenAPI specification. */
export const subjectSequencesSchema = curriculumSchemas.SubjectSequenceResponseSchema;

/** Type alias for the lesson summary schema derived from the OpenAPI specification. */
export type LessonSummaryResponseSchema = typeof lessonSummarySchema;

/** Type alias for the unit summary schema derived from the OpenAPI specification. */
export type UnitSummaryResponseSchema = typeof unitSummarySchema;

/** Type alias for the subject sequence schema derived from the OpenAPI specification. */
export type SubjectSequenceResponseSchema = typeof subjectSequencesSchema;

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
