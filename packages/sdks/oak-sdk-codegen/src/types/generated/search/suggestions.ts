/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search suggestion modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';
import { SEARCH_SCOPES } from './scopes.js';

/** Shared default cache metadata for suggestion responses. */
export const DEFAULT_SUGGESTION_CACHE = Object.freeze({ version: 'v1', ttlSeconds: 300 });

/** Zod schema describing additional metadata returned with suggestions. */
export const SearchSuggestionContextSchema = z
  .object({
    sequenceId: z.string().min(1).optional(),
    phaseSlug: z.string().min(1).optional(),
    unitSlug: z.string().min(1).optional(),
    years: z.array(z.union([z.number().int(), z.string()])).optional(),
    keyStages: z.array(z.string().min(1)).optional(),
    ks4OptionSlug: z.string().min(1).optional(),
  })
  .strict()
  .default({});

/** Zod schema describing an individual suggestion entry. */
export const SearchSuggestionItemSchema = z
  .object({
    label: z.string().min(1),
    scope: z.enum(SEARCH_SCOPES),
    url: z.string().min(1),
    subject: z.enum(SUBJECTS).optional(),
    keyStage: z.enum(KEY_STAGES).optional(),
    contexts: SearchSuggestionContextSchema,
  })
  .strict();

/** Suggestion item contract. */
export type SearchSuggestionItem = z.infer<typeof SearchSuggestionItemSchema>;

/** Zod schema for suggestion response envelopes. */
export const SearchSuggestionResponseSchema = z
  .object({
    suggestions: z.array(SearchSuggestionItemSchema).default([]),
    cache: z
      .object({
        version: z.string().min(1),
        ttlSeconds: z.number().int().nonnegative(),
      })
      .strict()
      .default(DEFAULT_SUGGESTION_CACHE),
  })
  .strict();

/** Suggestion response contract. */
export type SearchSuggestionResponse = z.infer<typeof SearchSuggestionResponseSchema>;

/** Zod schema for suggestion request payloads. */
export const SearchSuggestionRequestSchema = z
  .object({
    prefix: z.string().min(1),
    scope: z.enum(SEARCH_SCOPES),
    subject: z.enum(SUBJECTS).optional(),
    keyStage: z.enum(KEY_STAGES).optional(),
    phaseSlug: z.string().min(1).optional(),
    limit: z.number().int().min(1).max(20).optional(),
  })
  .strict();

/** Suggestion request contract. */
export type SearchSuggestionRequest = z.infer<typeof SearchSuggestionRequestSchema>;

/** Guard validating suggestion requests. */
export function isSearchSuggestionRequest(value: unknown): value is SearchSuggestionRequest {
  return SearchSuggestionRequestSchema.safeParse(value).success;
}

/** Guard validating suggestion responses. */
export function isSearchSuggestionResponse(value: unknown): value is SearchSuggestionResponse {
  return SearchSuggestionResponseSchema.safeParse(value).success;
}
