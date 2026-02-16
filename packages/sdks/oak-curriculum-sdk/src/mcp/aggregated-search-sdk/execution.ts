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
import type { SearchSdkArgs, SearchSdkScope } from './types.js';
import { formatSearchResults } from './formatting.js';

/** Error message when search retrieval service is not configured. */
const NOT_CONFIGURED_MESSAGE =
  'Search is not configured. Elasticsearch credentials are required. ' +
  'All other tools remain available.';

/**
 * Builds SearchLessonsParams from validated SearchSdkArgs.
 */
function buildLessonsParams(args: SearchSdkArgs): SearchLessonsParams {
  return {
    text: args.text,
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
    text: args.text,
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
    text: args.text,
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
    text: args.text,
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
 * Maps `text` to `prefix` and defaults scope to 'lessons'.
 */
function buildSuggestParams(args: SearchSdkArgs): SuggestParams {
  return {
    prefix: args.text,
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

type ScopeDispatcher = (
  args: SearchSdkArgs,
  retrieval: SearchRetrievalService,
) => Promise<Result<unknown, SearchRetrievalError>>;

const SCOPE_DISPATCHERS: Readonly<Record<SearchSdkScope, ScopeDispatcher>> = {
  lessons: (args, r) => r.searchLessons(buildLessonsParams(args)),
  units: (args, r) => r.searchUnits(buildUnitsParams(args)),
  threads: (args, r) => r.searchThreads(buildThreadsParams(args)),
  sequences: (args, r) => r.searchSequences(buildSequencesParams(args)),
  suggest: (args, r) => r.suggest(buildSuggestParams(args)),
};

/** Dispatches a search request to the appropriate SDK method by scope. */
async function dispatchByScope(
  scope: SearchSdkScope,
  args: SearchSdkArgs,
  retrieval: SearchRetrievalService,
): Promise<{ ok: true; data: unknown } | { ok: false; result: CallToolResult }> {
  const dispatch = SCOPE_DISPATCHERS[scope];
  const result = await dispatch(args, retrieval);

  if (!result.ok) {
    return { ok: false, result: formatError(formatRetrievalError(result.error)) };
  }
  return { ok: true, data: result.value };
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
  if (deps.searchRetrieval === undefined) {
    return formatError(NOT_CONFIGURED_MESSAGE);
  }

  const outcome = await dispatchByScope(args.scope, args, deps.searchRetrieval);

  if (!outcome.ok) {
    return outcome.result;
  }

  return formatSearchResults(args.scope, outcome.data, args.text);
}
