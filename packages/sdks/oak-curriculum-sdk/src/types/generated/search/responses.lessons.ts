/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search response modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';
import { SearchFacetsSchema } from '../zod/search/output/sequence-facets.js';
import type { SearchSuggestionItem, SearchSuggestionResponse } from './suggestions.js';
import { SearchSuggestionItemSchema, SearchSuggestionResponseSchema, DEFAULT_SUGGESTION_CACHE } from './suggestions.js';

const AggregationsSchema = z.record(z.string(), z.unknown()).default({});

/** Schema describing the lesson metadata returned in lesson search results. */
const LessonDocumentSchema = z
  .object({
    lesson_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    key_stage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]),
    year_group: z.string().optional(),
  })
  .strict();

/** Schema describing an individual lesson search result entry. */
export const LessonResultSchema = z
  .object({
    id: z.string().min(1),
    rankScore: z.number(),
    lesson: LessonDocumentSchema.nullable(),
    highlights: z.array(z.string()).default([]),
  })
  .strict();

/** Lesson search result payload derived from the Open Curriculum API schema. */
export type SearchLessonResult = z.infer<typeof LessonResultSchema>;

/** Schema describing the full lesson search response envelope. */
export const SearchLessonsResponseSchema = z
  .object({
    scope: z.literal('lessons'),
    results: z.array(LessonResultSchema),
    total: z.number().int().nonnegative(),
    took: z.number().int().nonnegative(),
    timedOut: z.boolean(),
    aggregations: AggregationsSchema,
    facets: SearchFacetsSchema.nullable().default(null),
    suggestionCache: SearchSuggestionResponseSchema.shape.cache.default(DEFAULT_SUGGESTION_CACHE),
    suggestions: z.array(SearchSuggestionItemSchema).optional(),
  })
  .strict();

export type SearchLessonsResponse = z.infer<typeof SearchLessonsResponseSchema>;

export type SearchLessonsSuggestions = SearchSuggestionItem[];
export type SearchLessonsSuggestionCache = SearchSuggestionResponse['cache'];
