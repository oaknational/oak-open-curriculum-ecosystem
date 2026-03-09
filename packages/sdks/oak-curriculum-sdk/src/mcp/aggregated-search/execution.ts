/**
 * Execution logic for the SDK-backed search tool.
 *
 * Dispatches validated search arguments to the appropriate Search SDK
 * retrieval method based on the scope. Maps `Result<T, RetrievalError>`
 * from the Search SDK to MCP `CallToolResult`.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { Result } from '@oaknational/result';
import { formatError, type UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type {
  SearchRetrievalService,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SearchParamsBase,
  SuggestParams,
  SearchRetrievalError,
} from '../search-retrieval-types.js';
import type { SearchSdkArgs, SearchDispatchResult } from './types.js';
import { formatSearchResults } from './formatting.js';

/**
 * Builds SearchLessonsParams from validated SearchSdkArgs.
 */
function buildLessonsParams(args: SearchSdkArgs): SearchLessonsParams {
  return {
    query: args.query,
    subject: args.subject,
    keyStage: args.keyStage,
    size: args.size,
    from: args.from,
    unitSlug: args.unitSlug,
    tier: args.tier,
    examBoard: args.examBoard,
    year: args.year,
    threadSlug: args.threadSlug,
    highlight: args.highlight,
  };
}

/**
 * Builds SearchUnitsParams from validated SearchSdkArgs.
 */
function buildUnitsParams(args: SearchSdkArgs): SearchUnitsParams {
  return {
    query: args.query,
    subject: args.subject,
    keyStage: args.keyStage,
    size: args.size,
    from: args.from,
    highlight: args.highlight,
    minLessons: args.minLessons,
  };
}

/**
 * Builds SearchParamsBase for threads from validated SearchSdkArgs.
 */
function buildThreadsParams(args: SearchSdkArgs): SearchParamsBase {
  return {
    query: args.query,
    subject: args.subject,
    keyStage: args.keyStage,
    size: args.size,
    from: args.from,
  };
}

/**
 * Builds SearchSequencesParams from validated SearchSdkArgs.
 */
function buildSequencesParams(args: SearchSdkArgs): SearchSequencesParams {
  return {
    query: args.query,
    subject: args.subject,
    keyStage: args.keyStage,
    size: args.size,
    from: args.from,
    phaseSlug: args.phaseSlug,
    category: args.category,
  };
}

/**
 * Builds SuggestParams from validated SearchSdkArgs.
 * Maps `query` to `prefix` and defaults scope to 'lessons'.
 */
function buildSuggestParams(args: SearchSdkArgs): SuggestParams {
  return {
    prefix: args.query,
    scope: 'lessons',
    subject: args.subject,
    keyStage: args.keyStage,
    limit: args.limit,
  };
}

/** Formats a SearchRetrievalError into a human-readable error message. */
function formatRetrievalError(error: SearchRetrievalError): string {
  if (error.type === 'es_error') {
    const suffix = error.statusCode !== undefined ? ` (status ${String(error.statusCode)})` : '';
    return `Elasticsearch error: ${error.message}${suffix}`;
  }
  if (error.type === 'timeout') {
    return `Search timed out: ${error.message}`;
  }
  if (error.type === 'validation_error') {
    return `Invalid search parameters: ${error.message}`;
  }
  return `Unexpected search error: ${error.message}`;
}

/**
 * Dispatches a search request to the appropriate SDK retrieval method.
 *
 * Uses a `switch` on `args.scope` to preserve per-scope return types
 * through the `SearchDispatchResult` union. The `default: never` guard
 * ensures exhaustiveness at compile time.
 */
async function dispatchByScope(
  args: SearchSdkArgs,
  retrieval: SearchRetrievalService,
): Promise<Result<SearchDispatchResult, SearchRetrievalError>> {
  switch (args.scope) {
    case 'lessons':
      return retrieval.searchLessons(buildLessonsParams(args));
    case 'units':
      return retrieval.searchUnits(buildUnitsParams(args));
    case 'threads':
      return retrieval.searchThreads(buildThreadsParams(args));
    case 'sequences':
      return retrieval.searchSequences(buildSequencesParams(args));
    case 'suggest':
      return retrieval.suggest(buildSuggestParams(args));
    default: {
      const exhaustive: never = args.scope;
      throw new Error(`Unhandled search scope: ${String(exhaustive)}`);
    }
  }
}

/**
 * Executes the SDK-backed search tool.
 *
 * Dispatches to the appropriate Search SDK retrieval method based on scope:
 * - `lessons`   maps to `retrieval.searchLessons()`
 * - `units`     maps to `retrieval.searchUnits()`
 * - `threads`   maps to `retrieval.searchThreads()`
 * - `sequences` maps to `retrieval.searchSequences()`
 * - `suggest`   maps to `retrieval.suggest()`
 *
 * @param args - Validated search arguments with scope and filters
 * @param deps - Dependencies including searchRetrieval service
 * @returns CallToolResult with formatted search results or error
 */
export async function runSearchSdkTool(
  args: SearchSdkArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const result = await dispatchByScope(args, deps.searchRetrieval);

  if (!result.ok) {
    return formatError(formatRetrievalError(result.error));
  }

  return formatSearchResults(result.value, args.query);
}
