/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Natural language query parser boundary types.
 */

import { z } from 'zod';
import { PARSED_INTENT_ENUM, SearchParsedQuerySchema } from '../search/parsed-query.js';
import type { SearchParsedIntent, SearchParsedQuery } from '../search/parsed-query.js';

/** Request payload accepted by the natural language query parser. */
export const QueryParserRequestSchema = z
  .object({
    query: z.string().min(1),
  })
  .strict();

/** Query parser request. */
export type QueryParserRequest = z.infer<typeof QueryParserRequestSchema>;

/** Canonical schema describing the structured output of the query parser. */
export const QueryParserResponseSchema = SearchParsedQuerySchema;

/** Query parser response payload. */
export type QueryParserResponse = SearchParsedQuery;

/** Enumerated parser intent union. */
export type QueryParserIntent = SearchParsedIntent;

/** Enumerated intent literal tuple for parser responses. */
export const QUERY_PARSER_INTENT_ENUM = PARSED_INTENT_ENUM;

/** Runtime guard for query parser responses. */
export function isQueryParserResponse(value: unknown): value is QueryParserResponse {
  return QueryParserResponseSchema.safeParse(value).success;
}
