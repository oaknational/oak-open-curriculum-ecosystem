import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search request modules derived from the Open Curriculum schema.
 */\n\n`;

/** Zod v4 accepts as const arrays directly. */
const KEY_STAGE_TUPLE = 'KEY_STAGES';
const SUBJECT_TUPLE = 'SUBJECTS';
const SCOPE_WITH_ALL_TUPLE = 'SEARCH_SCOPES_WITH_ALL';

function createStructuredRequestModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';\n` +
    `import { SEARCH_SCOPES_WITH_ALL, type SearchScopeWithAll, type SearchScope } from './scopes.js';\n\n` +
    `/** Governs the default behaviour for structured hybrid searches. */\n` +
    `export const DEFAULT_INCLUDE_FACETS = true;\n\n` +
    `/** Zod schema describing the structured hybrid search body used by the semantic search app. */\n` +
    `export const SearchStructuredRequestSchema = z\n` +
    `  .object({\n` +
    `    scope: z.enum(${SCOPE_WITH_ALL_TUPLE}),\n` +
    `    text: z.string().min(1),\n` +
    `    subject: z.enum(${SUBJECT_TUPLE}).optional(),\n` +
    `    keyStage: z.enum(${KEY_STAGE_TUPLE}).optional(),\n` +
    `    minLessons: z.number().int().min(0).optional(),\n` +
    `    size: z.number().int().min(1).max(100).optional(),\n` +
    `    includeFacets: z.boolean().optional().default(DEFAULT_INCLUDE_FACETS),\n` +
    `    phaseSlug: z.string().min(1).optional(),\n` +
    `    unitSlug: z.string().min(1).optional(),\n` +
    `    from: z.number().int().min(0).optional(),\n` +
    `    highlight: z.boolean().optional(),\n` +
    `    // KS4 and metadata filter fields (Phase 3 completion)\n` +
    `    tier: z.string().min(1).optional(),\n` +
    `    examBoard: z.string().min(1).optional(),\n` +
    `    examSubject: z.string().min(1).optional(),\n` +
    `    ks4Option: z.string().min(1).optional(),\n` +
    `    year: z.string().min(1).optional(),\n` +
    `    threadSlug: z.string().min(1).optional(),\n` +
    `    category: z.string().min(1).optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Structured hybrid search request payload. */\n` +
    `export type SearchStructuredRequest = z.infer<typeof SearchStructuredRequestSchema>;\n\n` +
    `/** Narrowed structured scope helper excluding multi-scope. */\n` +
    `export type SearchStructuredScope = Extract<SearchScopeWithAll, SearchScope>;\n\n` +
    `/** Runtime guard for structured hybrid search requests. */\n` +
    `export function isSearchStructuredRequest(value: unknown): value is SearchStructuredRequest {\n` +
    `  return SearchStructuredRequestSchema.safeParse(value).success;\n` +
    `}\n`
  );
}

function createNaturalRequestModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';\n` +
    `import { SEARCH_SCOPES_WITH_ALL } from './scopes.js';\n\n` +
    `/** Zod schema describing the natural language search body. */\n` +
    `export const SearchNaturalLanguageRequestSchema = z\n` +
    `  .object({\n` +
    `    q: z.string().min(1),\n` +
    `    scope: z.enum(${SCOPE_WITH_ALL_TUPLE}).optional(),\n` +
    `    size: z.number().int().min(1).max(100).optional(),\n` +
    `    includeFacets: z.boolean().optional(),\n` +
    `    phaseSlug: z.string().min(1).optional(),\n` +
    `    subject: z.enum(${SUBJECT_TUPLE}).optional(),\n` +
    `    keyStage: z.enum(${KEY_STAGE_TUPLE}).optional(),\n` +
    `    minLessons: z.number().int().min(0).optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Natural language search request payload. */\n` +
    `export type SearchNaturalLanguageRequest = z.infer<typeof SearchNaturalLanguageRequestSchema>;\n\n` +
    `/** Runtime guard for natural language search requests. */\n` +
    `export function isSearchNaturalLanguageRequest(value: unknown): value is SearchNaturalLanguageRequest {\n` +
    `  return SearchNaturalLanguageRequestSchema.safeParse(value).success;\n` +
    `}\n`
  );
}

function createParsedQueryModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';\n\n` +
    `/** Enumerated intents returned by the natural language parser. */\n` +
    `export const PARSED_INTENT_ENUM = ['lessons', 'units'] as const;\n\n` +
    `/** Structured output of the natural language parser. */\n` +
    `export const SearchParsedQuerySchema = z\n` +
    `  .object({\n` +
    `    intent: z.enum(PARSED_INTENT_ENUM),\n` +
    `    text: z.string().default(''),\n` +
    `    subject: z.enum(${SUBJECT_TUPLE}).optional(),\n` +
    `    keyStage: z.enum(${KEY_STAGE_TUPLE}).optional(),\n` +
    `    minLessons: z.number().int().min(0).optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Parsed natural language query. */\n` +
    `export type SearchParsedQuery = z.infer<typeof SearchParsedQuerySchema>;\n\n` +
    `/** Parsed query intent union. */\n` +
    `export type SearchParsedIntent = (typeof PARSED_INTENT_ENUM)[number];\n\n` +
    `/** Runtime guard for parsed natural language search payloads. */\n` +
    `export function isSearchParsedQuery(value: unknown): value is SearchParsedQuery {\n` +
    `  return SearchParsedQuerySchema.safeParse(value).success;\n` +
    `}\n`
  );
}

export function generateSearchRequestModules(_schema: OpenAPIObject): FileMap {
  void _schema;
  return {
    '../search/requests.ts': createStructuredRequestModule(),
    '../search/natural-requests.ts': createNaturalRequestModule(),
    '../search/parsed-query.ts': createParsedQueryModule(),
  };
}
