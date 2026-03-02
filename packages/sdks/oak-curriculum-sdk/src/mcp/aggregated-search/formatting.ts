/**
 * Result formatting for the SDK-backed search tool.
 *
 * Formats typed `SearchDispatchResult` into MCP `CallToolResult` with:
 * - Human-readable summary for conversation display
 * - Structured content for model reasoning and widget display
 * - Widget metadata for routing
 *
 * Discriminates `SuggestionResponse` from `ScopedSearchResult` using
 * `'suggestions' in result` — no runtime type guards needed because
 * the dispatch layer preserves per-scope types through the union.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatToolResponse } from '../universal-tool-shared.js';
import type { SearchSdkScope, ScopedSearchResult, SearchDispatchResult } from './types.js';
import type { SuggestionResponse } from '../search-retrieval-types.js';

/** Scope labels for human-readable summaries. */
const SCOPE_LABELS: Readonly<Record<SearchSdkScope, string>> = {
  lessons: 'lesson',
  units: 'unit',
  threads: 'learning thread',
  sequences: 'sequence',
  suggest: 'suggestion',
};

/**
 * Builds a human-readable summary for search result scopes.
 */
function buildSearchSummary(scope: SearchSdkScope, total: number, query: string): string {
  const label = SCOPE_LABELS[scope];
  const plural = total === 1 ? label : `${label}s`;

  if (total === 0) {
    return `No ${plural} found for "${query}". Try broadening your search or using a different scope.`;
  }

  return `Found ${String(total)} ${plural} matching "${query}"`;
}

/**
 * Builds a human-readable summary for suggestion results.
 */
function buildSuggestSummary(count: number, prefix: string): string {
  if (count === 0) {
    return `No suggestions found for "${prefix}"`;
  }
  const word = count === 1 ? 'suggestion' : 'suggestions';
  return `Found ${String(count)} ${word} for "${prefix}"`;
}

/** Annotation titles per scope. */
const SCOPE_TITLES: Readonly<Record<SearchSdkScope, string>> = {
  lessons: 'Search Lessons',
  units: 'Search Units',
  threads: 'Search Threads',
  sequences: 'Search Sequences',
  suggest: 'Search Suggestions',
};

/** Formats a scoped search result (lessons, units, threads, sequences). */
function formatScopedResult(data: ScopedSearchResult, query: string): CallToolResult {
  return formatToolResponse({
    summary: buildSearchSummary(data.scope, data.total, query),
    data: { scope: data.scope, total: data.total, took: data.took, results: data.results },
    query,
    timestamp: Date.now(),
    status: 'success',
    toolName: 'search',
    annotationsTitle: SCOPE_TITLES[data.scope],
  });
}

/** Formats suggestion results. */
function formatSuggestResult(data: SuggestionResponse, prefix: string): CallToolResult {
  return formatToolResponse({
    summary: buildSuggestSummary(data.suggestions.length, prefix),
    data: { suggestions: data.suggestions, cache: data.cache },
    query: prefix,
    timestamp: Date.now(),
    status: 'success',
    toolName: 'search',
    annotationsTitle: SCOPE_TITLES.suggest,
  });
}

/**
 * Formats search results into a CallToolResult appropriate for the scope.
 *
 * Discriminates `SuggestionResponse` from `ScopedSearchResult` using
 * `'suggestions' in result`. The compile-time `VerifiedScopedSearchResult`
 * assertion in `types.ts` guards against this invariant drifting.
 *
 * @param result - Typed dispatch result from the search retrieval service
 * @param query - The original search query text
 * @returns Formatted CallToolResult for MCP response
 */
export function formatSearchResults(result: SearchDispatchResult, query: string): CallToolResult {
  if ('suggestions' in result) {
    return formatSuggestResult(result, query);
  }

  return formatScopedResult(result, query);
}
