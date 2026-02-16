/**
 * Result formatting for the SDK-backed search tool.
 *
 * Formats Search SDK results into MCP CallToolResult with:
 * - Human-readable summary for conversation display
 * - Structured content for model reasoning and widget display
 * - Widget metadata for routing
 *
 * Each scope has formatting logic that extracts the most useful
 * information for both the agent (structured data) and the teacher
 * (readable summary with next-action suggestions).
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatOptimizedResult } from '../universal-tool-shared.js';
import type { SearchSdkScope } from './types.js';
import type { SuggestionResponse } from '../search-retrieval-types.js';

/** Type guard for SuggestionResponse. */
function isSuggestionResponse(value: unknown): value is SuggestionResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'suggestions' in value && 'cache' in value;
}

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

/** Common shape for scoped search results (all except suggest). */
interface ScopedSearchData {
  readonly scope: string;
  readonly total: number;
  readonly took: number;
  readonly results: readonly unknown[];
}

/** Type guard for common scoped search result shape. */
function isScopedSearchResult(scope: SearchSdkScope, value: unknown): value is ScopedSearchData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    'scope' in value &&
    value.scope === scope &&
    'total' in value &&
    'took' in value &&
    'results' in value
  );
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
function formatScopedResult(
  scope: SearchSdkScope,
  data: ScopedSearchData,
  query: string,
): CallToolResult {
  return formatOptimizedResult({
    summary: buildSearchSummary(scope, data.total, query),
    fullData: { scope: data.scope, total: data.total, took: data.took, results: data.results },
    query,
    timestamp: Date.now(),
    status: 'success',
    toolName: 'search',
    annotationsTitle: SCOPE_TITLES[scope],
  });
}

/** Formats suggestion results. */
function formatSuggestResult(data: SuggestionResponse, prefix: string): CallToolResult {
  return formatOptimizedResult({
    summary: buildSuggestSummary(data.suggestions.length, prefix),
    fullData: { suggestions: data.suggestions, cache: data.cache },
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
 * @param scope - Which search scope produced the results
 * @param result - Raw result data from the Search SDK
 * @param query - The original search query text
 * @returns Formatted CallToolResult for MCP response
 */
export function formatSearchResults(
  scope: SearchSdkScope,
  result: unknown,
  query: string,
): CallToolResult {
  if (scope === 'suggest' && isSuggestionResponse(result)) {
    return formatSuggestResult(result, query);
  }

  if (scope !== 'suggest' && isScopedSearchResult(scope, result)) {
    return formatScopedResult(scope, result, query);
  }

  throw new Error(
    `Unexpected result shape for scope "${scope}": ` +
      `expected ${scope === 'suggest' ? 'SuggestionResponse' : `SearchResultMeta with scope="${scope}"`}, ` +
      `got ${typeof result}`,
  );
}
