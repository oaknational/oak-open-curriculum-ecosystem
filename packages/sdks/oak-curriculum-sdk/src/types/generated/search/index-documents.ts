/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search index document schemas, types, and guards derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS, type Subject } from '../api-schema/path-parameters.js';

/** Alias used by search index documents for subject slugs. */
export type SearchSubjectSlug = Subject;

/** Zod schema describing search completion suggest payloads embedded in documents. */
export const SearchCompletionSuggestPayloadSchema = z
  .object({
    input: z.array(z.string().min(1)).min(1),
    weight: z.number().int().nonnegative().optional(),
    contexts: z
      .object({
        subject: z.array(z.string().min(1)).optional(),
        key_stage: z.array(z.string().min(1)).optional(),
        sequence: z.array(z.string().min(1)).optional(),
        phase: z.array(z.string().min(1)).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

/** Completion suggestion payload embedded in search index documents. */
export type SearchCompletionSuggestPayload = z.infer<typeof SearchCompletionSuggestPayloadSchema>;

/** Guard validating search completion suggest payloads. */
export function isSearchCompletionSuggestPayload(
  value: unknown,
): value is SearchCompletionSuggestPayload {
  return SearchCompletionSuggestPayloadSchema.safeParse(value).success;
}

/** Zod schema capturing the thread search document shape. */
export const SearchThreadIndexDocSchema = z
  .object({
    thread_slug: z.string().min(1),
    thread_title: z.string().min(1),
    unit_count: z.number(),
    subject_slugs: z.array(z.string().min(1)).optional(),
    thread_semantic: z.string().min(1).optional(),
    thread_url: z.string().min(1),
    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),
  })
  .strict();

/** Elasticsearch thread document (hybrid search index shape). */
export type SearchThreadIndexDoc = z.infer<typeof SearchThreadIndexDocSchema>;

/** Guard validating thread search index documents. */
export function isSearchThreadIndexDoc(value: unknown): value is SearchThreadIndexDoc {
  return SearchThreadIndexDocSchema.safeParse(value).success;
}

/** Zod schema capturing the lesson search document shape. */
export const SearchLessonsIndexDocSchema = z
  .object({
    lesson_id: z.string().min(1),
    lesson_slug: z.string().min(1),
    lesson_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    key_stage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]),
    years: z.array(z.string().min(1)).optional(),
    unit_ids: z.array(z.string().min(1)),
    unit_titles: z.array(z.string().min(1)),
    unit_count: z.number().int().nonnegative().optional(),
    lesson_keywords: z.array(z.string().min(1)).optional(),
    key_learning_points: z.array(z.string().min(1)).optional(),
    misconceptions_and_common_mistakes: z.array(z.string().min(1)).optional(),
    teacher_tips: z.array(z.string().min(1)).optional(),
    content_guidance: z.array(z.string().min(1)).optional(),
    transcript_text: z.string().min(1),
    lesson_semantic: z.string().min(1).optional(),
    lesson_url: z.string().min(1),
    unit_urls: z.array(z.string().min(1)),
    thread_slugs: z.array(z.string().min(1)).optional(),
    thread_titles: z.array(z.string().min(1)).optional(),
    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),
  })
  .strict();

/** Elasticsearch lesson document (hybrid search index shape). */
export type SearchLessonsIndexDoc = z.infer<typeof SearchLessonsIndexDocSchema>;

/** Guard validating lesson search index documents. */
export function isSearchLessonsIndexDoc(value: unknown): value is SearchLessonsIndexDoc {
  return SearchLessonsIndexDocSchema.safeParse(value).success;
}

/** Zod schema capturing the unit search document shape. */
export const SearchUnitsIndexDocSchema = z
  .object({
    unit_id: z.string().min(1),
    unit_slug: z.string().min(1),
    unit_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    key_stage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]),
    years: z.array(z.string().min(1)).optional(),
    lesson_ids: z.array(z.string().min(1)),
    lesson_count: z.number().int().nonnegative(),
    unit_topics: z.array(z.string().min(1)).optional(),
    unit_url: z.string().min(1),
    subject_programmes_url: z.string().min(1),
    sequence_ids: z.array(z.string().min(1)).optional(),
    thread_slugs: z.array(z.string().min(1)).optional(),
    thread_titles: z.array(z.string().min(1)).optional(),
    thread_orders: z.array(z.number()).optional(),
    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),
  })
  .strict();

/** Elasticsearch unit document (hybrid search index shape). */
export type SearchUnitsIndexDoc = z.infer<typeof SearchUnitsIndexDocSchema>;

/** Guard validating unit search index documents. */
export function isSearchUnitsIndexDoc(value: unknown): value is SearchUnitsIndexDoc {
  return SearchUnitsIndexDocSchema.safeParse(value).success;
}

/** Zod schema capturing the unit roll-up document shape. */
export const SearchUnitRollupDocSchema = z
  .object({
    unit_id: z.string().min(1),
    unit_slug: z.string().min(1),
    unit_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    key_stage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]),
    years: z.array(z.string().min(1)).optional(),
    lesson_ids: z.array(z.string().min(1)),
    lesson_count: z.number().int().nonnegative(),
    unit_topics: z.array(z.string().min(1)).optional(),
    rollup_text: z.string().min(1),
    unit_semantic: z.string().min(1).optional(),
    unit_url: z.string().min(1),
    subject_programmes_url: z.string().min(1),
    sequence_ids: z.array(z.string().min(1)).optional(),
    thread_slugs: z.array(z.string().min(1)).optional(),
    thread_titles: z.array(z.string().min(1)).optional(),
    thread_orders: z.array(z.number()).optional(),
    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),
  })
  .strict();

/** Elasticsearch unit roll-up document (hybrid search index shape). */
export type SearchUnitRollupDoc = z.infer<typeof SearchUnitRollupDocSchema>;

/** Guard validating unit roll-up documents. */
export function isSearchUnitRollupDoc(value: unknown): value is SearchUnitRollupDoc {
  return SearchUnitRollupDocSchema.safeParse(value).success;
}

/** Zod schema capturing the sequence search document shape. */
export const SearchSequenceIndexDocSchema = z
  .object({
    sequence_id: z.string().min(1),
    sequence_slug: z.string().min(1),
    sequence_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    subject_title: z.string().min(1).optional(),
    phase_slug: z.string().min(1).optional(),
    phase_title: z.string().min(1).optional(),
    category_titles: z.array(z.string().min(1)).optional(),
    key_stages: z.array(z.string().min(1)).optional(),
    years: z.array(z.string().min(1)).optional(),
    unit_slugs: z.array(z.string().min(1)).optional(),
    sequence_semantic: z.string().min(1).optional(),
    sequence_url: z.string().min(1),
    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),
  })
  .strict();

/** Elasticsearch sequence document (hybrid search index shape). */
export type SearchSequenceIndexDoc = z.infer<typeof SearchSequenceIndexDocSchema>;

/** Guard validating sequence search index documents. */
export function isSearchSequenceIndexDoc(value: unknown): value is SearchSequenceIndexDoc {
  return SearchSequenceIndexDocSchema.safeParse(value).success;
}
