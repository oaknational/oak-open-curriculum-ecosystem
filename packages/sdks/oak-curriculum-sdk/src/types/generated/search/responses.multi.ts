/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search response modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
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
