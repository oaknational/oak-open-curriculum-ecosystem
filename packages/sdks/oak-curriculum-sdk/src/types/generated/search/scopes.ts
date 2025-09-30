/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search scope helpers derived from the Open Curriculum schema.
 */

/** Enumerated search scopes supported by hybrid search. */
export const SEARCH_SCOPES = ['lessons', 'units', 'sequences'] as const;
/** Narrow search scope union. */
export type SearchScope = (typeof SEARCH_SCOPES)[number];

/** Search scope union including the synthetic 'all' multi-scope mode. */
export const SEARCH_SCOPES_WITH_ALL = ['all', ...SEARCH_SCOPES] as const;
/** Search scope union including multi-scope. */
export type SearchScopeWithAll = (typeof SEARCH_SCOPES_WITH_ALL)[number];

/** Guard for narrow search scopes. */
export function isSearchScope(value: unknown): value is SearchScope {
  return typeof value === 'string' && (SEARCH_SCOPES as readonly string[]).includes(value);
}

/** Guard for search scopes including multi-scope. */
export function isSearchScopeWithAll(value: unknown): value is SearchScopeWithAll {
  return typeof value === 'string' && (SEARCH_SCOPES_WITH_ALL as readonly string[]).includes(value);
}
