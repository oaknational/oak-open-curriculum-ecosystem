/**
 * Query runner for thread benchmarks with dependency injection.
 *
 * Uses the Search SDK retrieval service for all queries, ensuring
 * benchmarks exercise the same code paths as production consumers
 * (MCP server, CLI search commands).
 *
 * @see benchmark-threads.ts
 * @see ADR-078 Dependency Injection for Testability
 */

import { isSubject, type AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';
import type { Result } from '@oaknational/result';
import type { SearchSubjectSlug } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type {
  SearchParamsBase,
  ThreadsSearchResult,
  RetrievalError,
} from '@oaknational/oak-search-sdk';

/**
 * Thread search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns a `Result` containing
 * the search results or an error. Production code passes
 * `sdk.retrieval.searchThreads`; tests pass a mock.
 *
 * @param params - SDK search parameters for thread search
 * @returns Promise resolving to Result with thread search results or error
 */
export type ThreadSearchFunction = (
  params: SearchParamsBase,
) => Promise<Result<ThreadsSearchResult, RetrievalError>>;

/**
 * Input parameters for running a single thread benchmark query.
 *
 * Threads do not use phase or keyStage for filtering — they are
 * programme-agnostic conceptual progression strands spanning
 * multiple key stages.
 */
export interface RunThreadQueryInput {
  /** The search query text. */
  readonly query: string;
  /** Map of thread slug to expected relevance score. */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /** Subject slug for filtering. */
  readonly subject: AllSubjectSlug;
  /** Category of user scenario this query represents. */
  readonly category: QueryCategory;
}

/**
 * Result of running a single thread benchmark query.
 *
 * Contains all IR metrics as defined in IR-METRICS.md, plus category for aggregation.
 */
export interface ThreadQueryResult {
  /** Category of user scenario this query represents. */
  readonly category: QueryCategory;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
  readonly latencyMs: number;
  readonly hasHit: boolean;
  /** Actual result slugs returned by search, in rank order. */
  readonly actualResults: readonly string[];
  /** Expected relevance map from ground truth. */
  readonly expectedRelevance: Readonly<Record<string, number>>;
}

/**
 * Run a single thread benchmark query and calculate metrics.
 *
 * Uses the SDK retrieval service to execute the search, ensuring
 * benchmarks use the same RRF query building, search execution,
 * and result processing as production consumers.
 *
 * @param input - Query configuration
 * @param searchFn - SDK search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
export async function runThreadQuery(
  input: RunThreadQueryInput,
  searchFn: ThreadSearchFunction,
): Promise<ThreadQueryResult> {
  const start = performance.now();

  // Map AllSubjectSlug to SearchSubjectSlug: KS4 science variants
  // map to parent 'science' because the SDK subject filter accepts
  // canonical subjects only.
  const subject: SearchSubjectSlug = isSubject(input.subject) ? input.subject : 'science';

  const sdkParams: SearchParamsBase = {
    text: input.query,
    subject,
    size: 10,
  };

  // Execute search via injected SDK function
  const result = await searchFn(sdkParams);
  if (!result.ok) {
    throw new Error(
      `Thread benchmark search failed for query "${input.query}": ${result.error.type}: ${result.error.message}`,
    );
  }
  const latencyMs = performance.now() - start;

  // Extract thread slugs from SDK results
  const actualResults = result.value.results.map((r) => r.thread.thread_slug);
  const expectedSlugs = typeSafeKeys(input.expectedRelevance);

  // Calculate all metrics
  const mrr = calculateMRR(actualResults, input.expectedRelevance);
  const ndcg10 = calculateNDCG(actualResults, input.expectedRelevance, 10);
  const precision3 = calculatePrecisionAtK(actualResults, input.expectedRelevance, 3);
  const recall10 = calculateRecallAtK(actualResults, input.expectedRelevance, 10);

  return {
    category: input.category,
    mrr,
    ndcg10,
    precision3,
    recall10,
    latencyMs,
    hasHit: actualResults.some((slug) => expectedSlugs.includes(slug)),
    actualResults,
    expectedRelevance: input.expectedRelevance,
  };
}
