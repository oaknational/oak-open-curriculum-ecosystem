/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search request modules derived from the Open Curriculum schema.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';

/** Enumerated intents returned by the natural language parser. */
export const PARSED_INTENT_ENUM = ['lessons', 'units'] as const;

/** Structured output of the natural language parser. */
export const SearchParsedQuerySchema = z
  .object({
    intent: z.enum(PARSED_INTENT_ENUM),
    text: z.string().default(''),
    subject: z.enum(SUBJECTS).optional(),
    keyStage: z.enum(KEY_STAGES).optional(),
    minLessons: z.number().int().min(0).optional(),
  })
  .strict();

/** Parsed natural language query. */
export type SearchParsedQuery = z.infer<typeof SearchParsedQuerySchema>;

/** Parsed query intent union. */
export type SearchParsedIntent = (typeof PARSED_INTENT_ENUM)[number];

/** Runtime guard for parsed natural language search payloads. */
export function isSearchParsedQuery(value: unknown): value is SearchParsedQuery {
  return SearchParsedQuerySchema.safeParse(value).success;
}
