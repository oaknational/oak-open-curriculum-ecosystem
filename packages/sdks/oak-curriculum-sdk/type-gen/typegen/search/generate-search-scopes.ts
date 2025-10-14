import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search scope helpers derived from the Open Curriculum schema.
 */\n\n`;

function createScopesModule(): string {
  return (
    HEADER +
    `/** Enumerated search scopes supported by hybrid search. */\n` +
    `export const SEARCH_SCOPES = ['lessons', 'units', 'sequences'] as const;\n` +
    `/** Narrow search scope union. */\n` +
    `export type SearchScope = (typeof SEARCH_SCOPES)[number];\n\n` +
    `/** Search scope union including the synthetic 'all' multi-scope mode. */\n` +
    `export const SEARCH_SCOPES_WITH_ALL = ['all', ...SEARCH_SCOPES] as const;\n` +
    `/** Search scope union including multi-scope. */\n` +
    `export type SearchScopeWithAll = (typeof SEARCH_SCOPES_WITH_ALL)[number];\n\n` +
    `/** Guard for narrow search scopes. */\n` +
    `export function isSearchScope(value: unknown): value is SearchScope {\n` +
    `  return typeof value === 'string' && (SEARCH_SCOPES as readonly string[]).includes(value);\n` +
    `}\n\n` +
    `/** Guard for search scopes including multi-scope. */\n` +
    `export function isSearchScopeWithAll(value: unknown): value is SearchScopeWithAll {\n` +
    `  return typeof value === 'string' && (SEARCH_SCOPES_WITH_ALL as readonly string[]).includes(value);\n` +
    `}\n`
  );
}

export function generateSearchScopeModules(_schema: OpenAPIObject): FileMap {
  void _schema;
  return {
    '../search/scopes.ts': createScopesModule(),
  };
}
