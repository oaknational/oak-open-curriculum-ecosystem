import type { FileMap } from '../extraction-types.js';

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Natural language query parser boundary types.
 */\n\n`;

function createQueryParserModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { PARSED_INTENT_ENUM, SearchParsedQuerySchema } from '../search/parsed-query.js';\n` +
    `import type { SearchParsedIntent, SearchParsedQuery } from '../search/parsed-query.js';\n\n` +
    `/** Request payload accepted by the natural language query parser. */\n` +
    `export const QueryParserRequestSchema = z\n` +
    `  .object({\n` +
    `    query: z.string().min(1),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Query parser request. */\n` +
    `export type QueryParserRequest = z.infer<typeof QueryParserRequestSchema>;\n\n` +
    `/** Canonical schema describing the structured output of the query parser. */\n` +
    `export const QueryParserResponseSchema = SearchParsedQuerySchema;\n\n` +
    `/** Query parser response payload. */\n` +
    `export type QueryParserResponse = SearchParsedQuery;\n\n` +
    `/** Enumerated parser intent union. */\n` +
    `export type QueryParserIntent = SearchParsedIntent;\n\n` +
    `/** Enumerated intent literal tuple for parser responses. */\n` +
    `export const QUERY_PARSER_INTENT_ENUM = PARSED_INTENT_ENUM;\n\n` +
    `/** Runtime guard for query parser responses. */\n` +
    `export function isQueryParserResponse(value: unknown): value is QueryParserResponse {\n` +
    `  return QueryParserResponseSchema.safeParse(value).success;\n` +
    `}\n`
  );
}

export function generateQueryParserModules(): FileMap {
  return {
    '../query-parser/index.ts': createQueryParserModule(),
  };
}
