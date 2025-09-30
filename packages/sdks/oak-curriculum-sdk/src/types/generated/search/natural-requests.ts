/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search request modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';
import { SEARCH_SCOPES_WITH_ALL, type SearchScopeWithAll } from './scopes.js';

/** Zod schema describing the natural language search body. */
export const SearchNaturalLanguageRequestSchema = z
  .object({
    q: z.string().min(1),
    scope: z.enum(SEARCH_SCOPES_WITH_ALL as unknown as [SearchScopeWithAll, ...SearchScopeWithAll[]]).optional(),
    size: z.number().int().min(1).max(100).optional(),
    includeFacets: z.boolean().optional(),
    phaseSlug: z.string().min(1).optional(),
    subject: z.enum(SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]).optional(),
    keyStage: z.enum(KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]).optional(),
    minLessons: z.number().int().min(0).optional(),
  })
  .strict();

/** Natural language search request payload. */
export type SearchNaturalLanguageRequest = z.infer<typeof SearchNaturalLanguageRequestSchema>;

/** Runtime guard for natural language search requests. */
export function isSearchNaturalLanguageRequest(value: unknown): value is SearchNaturalLanguageRequest {
  return SearchNaturalLanguageRequestSchema.safeParse(value).success;
}
