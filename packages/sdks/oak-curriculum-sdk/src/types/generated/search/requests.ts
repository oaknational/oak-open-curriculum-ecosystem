/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search request modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';
import { SEARCH_SCOPES_WITH_ALL, type SearchScopeWithAll, type SearchScope } from './scopes.js';

/** Governs the default behaviour for structured hybrid searches. */
export const DEFAULT_INCLUDE_FACETS = true;

/** Zod schema describing the structured hybrid search body used by the semantic search app. */
export const SearchStructuredRequestSchema = z
  .object({
    scope: z.enum(SEARCH_SCOPES_WITH_ALL as unknown as [SearchScopeWithAll, ...SearchScopeWithAll[]]),
    text: z.string().min(1),
    subject: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]).optional(),
    keyStage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]).optional(),
    minLessons: z.number().int().min(0).optional(),
    size: z.number().int().min(1).max(100).optional(),
    includeFacets: z.boolean().optional().default(DEFAULT_INCLUDE_FACETS),
    phaseSlug: z.string().min(1).optional(),
    unitSlug: z.string().min(1).optional(),
    from: z.number().int().min(0).optional(),
    highlight: z.boolean().optional(),
    // KS4 and metadata filter fields (Phase 3 completion)
    tier: z.string().min(1).optional(),
    examBoard: z.string().min(1).optional(),
    examSubject: z.string().min(1).optional(),
    ks4Option: z.string().min(1).optional(),
    year: z.string().min(1).optional(),
    threadSlug: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
  })
  .strict();

/** Structured hybrid search request payload. */
export type SearchStructuredRequest = z.infer<typeof SearchStructuredRequestSchema>;

/** Narrowed structured scope helper excluding multi-scope. */
export type SearchStructuredScope = Extract<SearchScopeWithAll, SearchScope>;

/** Runtime guard for structured hybrid search requests. */
export function isSearchStructuredRequest(value: unknown): value is SearchStructuredRequest {
  return SearchStructuredRequestSchema.safeParse(value).success;
}
