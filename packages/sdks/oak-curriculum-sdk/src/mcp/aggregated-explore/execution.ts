/**
 * Execution logic for the explore-topic compound tool.
 *
 * Searches lessons, units, and threads in parallel using `Promise.all`,
 * then merges results into a unified topic map. Handles partial failures
 * gracefully (if one scope errors, still returns the others).
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatError, type UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type {
  SearchRetrievalService,
  LessonsSearchResult,
  UnitsSearchResult,
  ThreadsSearchResult,
} from '../search-retrieval-types.js';
import type { ExploreArgs } from './types.js';
import { formatTopicMap } from './formatting.js';

/** Error message when search retrieval service is not configured. */
const NOT_CONFIGURED_MESSAGE =
  'Topic exploration is not configured. Elasticsearch credentials are required. ' +
  'All other tools remain available.';

/** Small page size for explore results (overview, not exhaustive). */
const EXPLORE_PAGE_SIZE = 5;

/** Result shape for each scope in the parallel search. */
interface ScopeOutcome {
  readonly ok: boolean;
  readonly data?: unknown;
  readonly error?: string;
}

/**
 * Searches a single scope, catching errors to allow partial success.
 */
async function searchScope(
  scopeName: string,
  searchFn: () => Promise<{ ok: boolean; value?: unknown; error?: { message: string } }>,
): Promise<ScopeOutcome> {
  try {
    const result = await searchFn();
    if (result.ok) {
      return { ok: true, data: result.value };
    }
    return {
      ok: false,
      error: `${scopeName} search failed: ${result.error?.message ?? 'unknown error'}`,
    };
  } catch (thrown: unknown) {
    const message = thrown instanceof Error ? thrown.message : 'unknown error';
    return { ok: false, error: `${scopeName} search error: ${message}` };
  }
}

/**
 * Runs parallel searches across lessons, units, and threads.
 */
async function parallelSearch(
  args: ExploreArgs,
  retrieval: SearchRetrievalService,
): Promise<{
  lessons: ScopeOutcome;
  units: ScopeOutcome;
  threads: ScopeOutcome;
}> {
  const baseParams = {
    text: args.text,
    subject: args.subject,
    keyStage: args.keyStage,
    size: EXPLORE_PAGE_SIZE,
  };

  const [lessons, units, threads] = await Promise.all([
    searchScope('Lessons', () => retrieval.searchLessons({ ...baseParams, highlight: true })),
    searchScope('Units', () => retrieval.searchUnits({ ...baseParams, highlight: true })),
    searchScope('Threads', () => retrieval.searchThreads(baseParams)),
  ]);

  return { lessons, units, threads };
}

/**
 * Type guards for narrowing scope outcomes to typed results.
 */
function isLessonsData(
  outcome: ScopeOutcome,
): outcome is ScopeOutcome & { data: LessonsSearchResult } {
  return (
    outcome.ok &&
    outcome.data !== undefined &&
    typeof outcome.data === 'object' &&
    outcome.data !== null &&
    'scope' in outcome.data &&
    outcome.data.scope === 'lessons'
  );
}

function isUnitsData(outcome: ScopeOutcome): outcome is ScopeOutcome & { data: UnitsSearchResult } {
  return (
    outcome.ok &&
    outcome.data !== undefined &&
    typeof outcome.data === 'object' &&
    outcome.data !== null &&
    'scope' in outcome.data &&
    outcome.data.scope === 'units'
  );
}

function isThreadsData(
  outcome: ScopeOutcome,
): outcome is ScopeOutcome & { data: ThreadsSearchResult } {
  return (
    outcome.ok &&
    outcome.data !== undefined &&
    typeof outcome.data === 'object' &&
    outcome.data !== null &&
    'scope' in outcome.data &&
    outcome.data.scope === 'threads'
  );
}

/**
 * Computes totals from the parallel search results.
 */
function computeTotals(outcomes: {
  lessons: ScopeOutcome;
  units: ScopeOutcome;
  threads: ScopeOutcome;
}): { lessonTotal: number; unitTotal: number; threadTotal: number } {
  const lessonTotal = isLessonsData(outcomes.lessons) ? outcomes.lessons.data.total : 0;
  const unitTotal = isUnitsData(outcomes.units) ? outcomes.units.data.total : 0;
  const threadTotal = isThreadsData(outcomes.threads) ? outcomes.threads.data.total : 0;
  return { lessonTotal, unitTotal, threadTotal };
}

/**
 * Executes the explore-topic compound tool.
 *
 * @param args - Validated explore arguments (text, optional subject/keyStage)
 * @param deps - Dependencies including searchRetrieval service
 * @returns CallToolResult with unified topic map or error
 */
export async function runExploreTool(
  args: ExploreArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  if (deps.searchRetrieval === undefined) {
    return formatError(NOT_CONFIGURED_MESSAGE);
  }

  const outcomes = await parallelSearch(args, deps.searchRetrieval);
  const allFailed = !outcomes.lessons.ok && !outcomes.units.ok && !outcomes.threads.ok;

  if (allFailed) {
    const errors = [outcomes.lessons.error, outcomes.units.error, outcomes.threads.error]
      .filter((e): e is string => e !== undefined)
      .join('; ');
    return formatError(`All searches failed: ${errors}`);
  }

  const totals = computeTotals(outcomes);

  return formatTopicMap(args.text, outcomes, totals);
}
