import type { OpenAPI3 } from 'openapi-typescript';
import type { FileMap } from '../extraction-types.js';

const HEADER = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Search suggestion modules derived from the Open Curriculum schema.\n */\n\n`;

const KEY_STAGE_TUPLE =
  'KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]';
const SUBJECT_TUPLE =
  'SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]';
const SCOPE_TUPLE = 'SEARCH_SCOPES as unknown as [SearchScope, ...SearchScope[]]';

function createSuggestionsModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { KEY_STAGES, SUBJECTS } from '../api-schema/path-parameters.js';\n` +
    `import { SEARCH_SCOPES, type SearchScope } from './scopes.js';\n\n` +
    `/** Shared default cache metadata for suggestion responses. */\n` +
    `export const DEFAULT_SUGGESTION_CACHE = Object.freeze({ version: 'v1', ttlSeconds: 300 });\n\n` +
    `/** Zod schema describing additional metadata returned with suggestions. */\n` +
    `export const SearchSuggestionContextSchema = z\n` +
    `  .object({\n` +
    `    sequenceId: z.string().min(1).optional(),\n` +
    `    phaseSlug: z.string().min(1).optional(),\n` +
    `  })\n` +
    `  .catchall(z.unknown())\n` +
    `  .default({});\n\n` +
    `/** Zod schema describing an individual suggestion entry. */\n` +
    `export const SearchSuggestionItemSchema = z\n` +
    `  .object({\n` +
    `    label: z.string().min(1),\n` +
    `    scope: z.enum(${SCOPE_TUPLE}),\n` +
    `    url: z.string().min(1),\n` +
    `    subject: z.enum(${SUBJECT_TUPLE}).optional(),\n` +
    `    keyStage: z.enum(${KEY_STAGE_TUPLE}).optional(),\n` +
    `    contexts: SearchSuggestionContextSchema,\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Suggestion item contract. */\n` +
    `export type SearchSuggestionItem = z.infer<typeof SearchSuggestionItemSchema>;\n\n` +
    `/** Zod schema for suggestion response envelopes. */\n` +
    `export const SearchSuggestionResponseSchema = z\n` +
    `  .object({\n` +
    `    suggestions: z.array(SearchSuggestionItemSchema).default([]),\n` +
    `    cache: z\n` +
    `      .object({\n` +
    `        version: z.string().min(1),\n` +
    `        ttlSeconds: z.number().int().nonnegative(),\n` +
    `      })\n` +
    `      .strict()\n` +
    `      .default(DEFAULT_SUGGESTION_CACHE),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Suggestion response contract. */\n` +
    `export type SearchSuggestionResponse = z.infer<typeof SearchSuggestionResponseSchema>;\n\n` +
    `/** Zod schema for suggestion request payloads. */\n` +
    `export const SearchSuggestionRequestSchema = z\n` +
    `  .object({\n` +
    `    prefix: z.string().min(1),\n` +
    `    scope: z.enum(${SCOPE_TUPLE}),\n` +
    `    subject: z.enum(${SUBJECT_TUPLE}).optional(),\n` +
    `    keyStage: z.enum(${KEY_STAGE_TUPLE}).optional(),\n` +
    `    phaseSlug: z.string().min(1).optional(),\n` +
    `    limit: z.number().int().min(1).max(20).optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Suggestion request contract. */\n` +
    `export type SearchSuggestionRequest = z.infer<typeof SearchSuggestionRequestSchema>;\n\n` +
    `/** Guard validating suggestion requests. */\n` +
    `export function isSearchSuggestionRequest(value: unknown): value is SearchSuggestionRequest {\n` +
    `  return SearchSuggestionRequestSchema.safeParse(value).success;\n` +
    `}\n\n` +
    `/** Guard validating suggestion responses. */\n` +
    `export function isSearchSuggestionResponse(value: unknown): value is SearchSuggestionResponse {\n` +
    `  return SearchSuggestionResponseSchema.safeParse(value).success;\n` +
    `}\n`
  );
}

export function generateSearchSuggestionModules(_schema: OpenAPI3): FileMap {
  void _schema;
  return {
    '../search/suggestions.ts': createSuggestionsModule(),
  };
}
