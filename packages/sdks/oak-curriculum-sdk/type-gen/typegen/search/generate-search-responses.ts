import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';

const HEADER = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Search response modules derived from the Open Curriculum schema.\n */\n\n`;

const KEY_STAGE_TUPLE =
  'KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]';

function createLessonsModule(): string {
  return (
    HEADER +
    String.raw`import { z } from 'zod';
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
    key_stage: z.enum(${KEY_STAGE_TUPLE}),
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
`
  );
}

function createUnitsModule(): string {
  return (
    HEADER +
    String.raw`import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';
import { SearchFacetsSchema } from '../zod/search/output/sequence-facets.js';
import { SearchSuggestionItemSchema, SearchSuggestionResponseSchema, DEFAULT_SUGGESTION_CACHE } from './suggestions.js';

const AggregationsSchema = z.record(z.string(), z.unknown()).default({});

/** Schema describing the unit metadata returned in unit search results. */
const UnitDocumentSchema = z
  .object({
    unit_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]),
    key_stage: z.enum(${KEY_STAGE_TUPLE}).optional(),
  })
  .strict();

/** Schema describing an individual unit search result entry. */
export const UnitResultSchema = z
  .object({
    id: z.string().min(1),
    rankScore: z.number(),
    unit: UnitDocumentSchema.nullable(),
    highlights: z.array(z.string()).default([]),
  })
  .strict();

/** Unit search result payload derived from the Open Curriculum API schema. */
export type SearchUnitResult = z.infer<typeof UnitResultSchema>;

/** Schema describing the full unit search response envelope. */
export const SearchUnitsResponseSchema = z
  .object({
    scope: z.literal('units'),
    results: z.array(UnitResultSchema),
    total: z.number().int().nonnegative(),
    took: z.number().int().nonnegative(),
    timedOut: z.boolean(),
    aggregations: AggregationsSchema,
    facets: SearchFacetsSchema.nullable().default(null),
    suggestionCache: SearchSuggestionResponseSchema.shape.cache.default(DEFAULT_SUGGESTION_CACHE),
    suggestions: z.array(SearchSuggestionItemSchema).optional(),
  })
  .strict();

export type SearchUnitsResponse = z.infer<typeof SearchUnitsResponseSchema>;
`
  );
}

function createSequencesModule(): string {
  return (
    HEADER +
    String.raw`import { z } from 'zod';
import { SearchFacetsSchema } from '../zod/search/output/sequence-facets.js';
import { SearchSuggestionItemSchema, SearchSuggestionResponseSchema, DEFAULT_SUGGESTION_CACHE } from './suggestions.js';

const AggregationsSchema = z.record(z.string(), z.unknown()).default({});

/** Schema describing the sequence metadata returned in sequence search results. */
const SequenceDocumentSchema = z
  .object({
    sequence_title: z.string().optional(),
    sequence_url: z.string().optional(),
    subject_slug: z.string().optional(),
    phase_slug: z.string().optional(),
  })
  .strict();

/** Schema describing an individual sequence search result entry. */
export const SequenceResultSchema = z
  .object({
    id: z.string().min(1),
    sequence: SequenceDocumentSchema.optional(),
    highlights: z.array(z.string()).default([]),
  })
  .strict();

/** Sequence search result payload derived from the Open Curriculum API schema. */
export type SearchSequenceResult = z.infer<typeof SequenceResultSchema>;

/** Schema describing the full sequence search response envelope. */
export const SearchSequencesResponseSchema = z
  .object({
    scope: z.literal('sequences'),
    results: z.array(SequenceResultSchema),
    total: z.number().int().nonnegative(),
    took: z.number().int().nonnegative(),
    timedOut: z.boolean(),
    aggregations: AggregationsSchema,
    facets: SearchFacetsSchema.nullable().default(null),
    suggestionCache: SearchSuggestionResponseSchema.shape.cache.default(DEFAULT_SUGGESTION_CACHE),
    suggestions: z.array(SearchSuggestionItemSchema).optional(),
  })
  .strict();

export type SearchSequencesResponse = z.infer<typeof SearchSequencesResponseSchema>;
`
  );
}

function createMultiModule(): string {
  return (
    HEADER +
    String.raw`import { z } from 'zod';
import { SEARCH_SCOPES } from './scopes.js';
import { SearchLessonsResponseSchema } from './responses.lessons.js';
import { SearchUnitsResponseSchema } from './responses.units.js';
import { SearchSequencesResponseSchema } from './responses.sequences.js';
import type { SearchLessonsResponse } from './responses.lessons.js';
import type { SearchUnitsResponse } from './responses.units.js';
import type { SearchSequencesResponse } from './responses.sequences.js';
import { SearchSuggestionItemSchema, SearchSuggestionResponseSchema, DEFAULT_SUGGESTION_CACHE } from './suggestions.js';

const NarrowScopeSchema = z.enum(SEARCH_SCOPES as unknown as ['lessons', 'units', 'sequences']);
const ResultUnionSchema = z.union([
  SearchLessonsResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
]);

/** Schema describing the aggregated multi-scope search response envelope. */
export const SearchMultiScopeResponseSchema = z
  .object({
    scope: z.literal('all'),
    buckets: z.array(
      z
        .object({
          scope: NarrowScopeSchema,
          result: ResultUnionSchema,
        })
        .strict(),
    ),
    suggestions: z.array(SearchSuggestionItemSchema).optional(),
    suggestionCache: SearchSuggestionResponseSchema.shape.cache.default(DEFAULT_SUGGESTION_CACHE),
  })
  .strict();

/** Bucket entry combining scope identifier with its typed result set. */
export interface SearchMultiScopeBucket {
  scope: 'lessons' | 'units' | 'sequences';
  result: SearchLessonsResponse | SearchUnitsResponse | SearchSequencesResponse;
}

export type SearchMultiScopeResponse = z.infer<typeof SearchMultiScopeResponseSchema>;
`
  );
}

export function generateSearchResponseModules(_schema: OpenAPIObject): FileMap {
  void _schema;
  return {
    '../search/responses.lessons.ts': createLessonsModule(),
    '../search/responses.units.ts': createUnitsModule(),
    '../search/responses.sequences.ts': createSequencesModule(),
    '../search/responses.multi.ts': createMultiModule(),
  };
}
