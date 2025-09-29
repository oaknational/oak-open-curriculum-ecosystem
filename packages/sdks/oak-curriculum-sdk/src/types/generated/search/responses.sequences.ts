/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search response modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
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
