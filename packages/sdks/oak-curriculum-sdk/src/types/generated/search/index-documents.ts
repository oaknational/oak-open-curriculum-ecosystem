/**
 * GENERATED FILE - DO NOT EDIT
 * Per-index completion context schemas enforce compile-time safety.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS, type Subject } from '../api-schema/path-parameters.js';
export type SearchSubjectSlug = Subject;

// Per-Index Completion Context Schemas
export const SearchLessonsCompletionContextsSchema = z
  .object({
    subject: z.array(z.string().min(1)).optional(),
    key_stage: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type SearchLessonsCompletionContexts = z.infer<typeof SearchLessonsCompletionContextsSchema>;
export const SearchUnitsCompletionContextsSchema = z
  .object({
    subject: z.array(z.string().min(1)).optional(),
    key_stage: z.array(z.string().min(1)).optional(),
    sequence: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type SearchUnitsCompletionContexts = z.infer<typeof SearchUnitsCompletionContextsSchema>;
export const SearchUnitRollupCompletionContextsSchema = z
  .object({
    subject: z.array(z.string().min(1)).optional(),
    key_stage: z.array(z.string().min(1)).optional(),
    sequence: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type SearchUnitRollupCompletionContexts = z.infer<typeof SearchUnitRollupCompletionContextsSchema>;
export const SearchSequenceCompletionContextsSchema = z
  .object({
    subject: z.array(z.string().min(1)).optional(),
    phase: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type SearchSequenceCompletionContexts = z.infer<typeof SearchSequenceCompletionContextsSchema>;
export const SearchThreadCompletionContextsSchema = z
  .object({
    subject: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type SearchThreadCompletionContexts = z.infer<typeof SearchThreadCompletionContextsSchema>;

// Per-Index Completion Payload Schemas
export const SearchLessonsCompletionPayloadSchema = z
  .object({
    input: z.array(z.string().min(1)).min(1),
    weight: z.number().int().nonnegative().optional(),
    contexts: SearchLessonsCompletionContextsSchema.optional(),
  })
  .strict();
export type SearchLessonsCompletionPayload = z.infer<typeof SearchLessonsCompletionPayloadSchema>;
export const SearchUnitsCompletionPayloadSchema = z
  .object({
    input: z.array(z.string().min(1)).min(1),
    weight: z.number().int().nonnegative().optional(),
    contexts: SearchUnitsCompletionContextsSchema.optional(),
  })
  .strict();
export type SearchUnitsCompletionPayload = z.infer<typeof SearchUnitsCompletionPayloadSchema>;
export const SearchUnitRollupCompletionPayloadSchema = z
  .object({
    input: z.array(z.string().min(1)).min(1),
    weight: z.number().int().nonnegative().optional(),
    contexts: SearchUnitRollupCompletionContextsSchema.optional(),
  })
  .strict();
export type SearchUnitRollupCompletionPayload = z.infer<typeof SearchUnitRollupCompletionPayloadSchema>;
export const SearchSequenceCompletionPayloadSchema = z
  .object({
    input: z.array(z.string().min(1)).min(1),
    weight: z.number().int().nonnegative().optional(),
    contexts: SearchSequenceCompletionContextsSchema.optional(),
  })
  .strict();
export type SearchSequenceCompletionPayload = z.infer<typeof SearchSequenceCompletionPayloadSchema>;
export const SearchThreadCompletionPayloadSchema = z
  .object({
    input: z.array(z.string().min(1)).min(1),
    weight: z.number().int().nonnegative().optional(),
    contexts: SearchThreadCompletionContextsSchema.optional(),
  })
  .strict();
export type SearchThreadCompletionPayload = z.infer<typeof SearchThreadCompletionPayloadSchema>;

// Index Document Schemas
export const SearchThreadIndexDocSchema = z
  .object({
    thread_slug: z.string().min(1),
    thread_title: z.string().min(1),
    unit_count: z.number().int().nonnegative(),
    subject_slugs: z.array(z.string().min(1)).optional(),
    thread_semantic: z.string().min(1).optional(),
    thread_url: z.string().min(1),
    title_suggest: SearchThreadCompletionPayloadSchema.optional(),
  })
  .strict();
export type SearchThreadIndexDoc = z.infer<typeof SearchThreadIndexDocSchema>;
export function isSearchThreadIndexDoc(value: unknown): value is SearchThreadIndexDoc {
  return SearchThreadIndexDocSchema.safeParse(value).success;
}
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
    title_suggest: SearchLessonsCompletionPayloadSchema.optional(),
    tier: z.string().min(1).optional(),
    doc_type: z.string().min(1),
  })
  .strict();
export type SearchLessonsIndexDoc = z.infer<typeof SearchLessonsIndexDocSchema>;
export function isSearchLessonsIndexDoc(value: unknown): value is SearchLessonsIndexDoc {
  return SearchLessonsIndexDocSchema.safeParse(value).success;
}
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
    title_suggest: SearchUnitsCompletionPayloadSchema.optional(),
    doc_type: z.string().min(1),
  })
  .strict();
export type SearchUnitsIndexDoc = z.infer<typeof SearchUnitsIndexDocSchema>;
export function isSearchUnitsIndexDoc(value: unknown): value is SearchUnitsIndexDoc {
  return SearchUnitsIndexDocSchema.safeParse(value).success;
}
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
    title_suggest: SearchUnitRollupCompletionPayloadSchema.optional(),
    tier: z.string().min(1).optional(),
    doc_type: z.string().min(1),
  })
  .strict();
export type SearchUnitRollupDoc = z.infer<typeof SearchUnitRollupDocSchema>;
export function isSearchUnitRollupDoc(value: unknown): value is SearchUnitRollupDoc {
  return SearchUnitRollupDocSchema.safeParse(value).success;
}
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
    title_suggest: SearchSequenceCompletionPayloadSchema.optional(),
    doc_type: z.string().min(1),
  })
  .strict();
export type SearchSequenceIndexDoc = z.infer<typeof SearchSequenceIndexDocSchema>;
export function isSearchSequenceIndexDoc(value: unknown): value is SearchSequenceIndexDoc {
  return SearchSequenceIndexDocSchema.safeParse(value).success;
}
export const SearchSequenceFacetsIndexDocSchema = z
  .object({
    sequence_slug: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    phase_slug: z.string().min(1),
    phase_title: z.string().min(1),
    key_stages: z.array(z.string().min(1)),
    key_stage_title: z.string().min(1).optional(),
    years: z.array(z.string().min(1)),
    unit_slugs: z.array(z.string().min(1)),
    unit_titles: z.array(z.string().min(1)),
    unit_count: z.number().int().nonnegative(),
    lesson_count: z.number().int().nonnegative(),
    has_ks4_options: z.boolean(),
    sequence_canonical_url: z.string().min(1).optional(),
  })
  .strict();
export type SearchSequenceFacetsIndexDoc = z.infer<typeof SearchSequenceFacetsIndexDocSchema>;
export function isSearchSequenceFacetsIndexDoc(value: unknown): value is SearchSequenceFacetsIndexDoc {
  return SearchSequenceFacetsIndexDocSchema.safeParse(value).success;
}
// Index Metadata Schema
export const IndexMetaDocSchema = z
  .object({
    version: z.string().min(1),
    ingested_at: z.string().min(1),
    subjects: z.array(z.string().min(1)),
    key_stages: z.array(z.string().min(1)),
    duration_ms: z.number().int().nonnegative(),
    doc_counts: z.record(z.string(), z.unknown()),
  })
  .strict();
export type IndexMetaDoc = z.infer<typeof IndexMetaDocSchema>;
export function isIndexMetaDoc(value: unknown): value is IndexMetaDoc {
  return IndexMetaDocSchema.safeParse(value).success;
}
// Zero-Hit Telemetry Schema
export const ZeroHitDocSchema = z
  .object({
    '@timestamp': z.string().min(1),
    search_scope: z.string().min(1),
    query: z.string().min(1),
    filters: z.record(z.string(), z.unknown()),
    index_version: z.string().min(1),
    request_id: z.string().min(1).optional(),
    session_id: z.string().min(1).optional(),
    took_ms: z.number().int().nonnegative().optional(),
    timed_out: z.boolean().optional(),
  })
  .strict();
export type ZeroHitDoc = z.infer<typeof ZeroHitDocSchema>;
export function isZeroHitDoc(value: unknown): value is ZeroHitDoc {
  return ZeroHitDocSchema.safeParse(value).success;
}
