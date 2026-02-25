/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search response modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';
import { SearchFacetsSchema } from '../zod/search/output/sequence-facets.js';
import { SearchSuggestionItemSchema, SearchSuggestionResponseSchema, DEFAULT_SUGGESTION_CACHE } from './suggestions.js';

const AggregationsSchema = z.record(z.string(), z.unknown()).default({});

/** Schema describing the unit metadata returned in unit search results. */
const UnitDocumentSchema = z
  .object({
    unit_title: z.string().min(1),
    subject_slug: z.enum(SUBJECTS),
    key_stage: z.enum(KEY_STAGES).optional(),
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
