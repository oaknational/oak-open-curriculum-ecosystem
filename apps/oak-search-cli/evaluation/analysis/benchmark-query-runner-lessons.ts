/**
 * Query runner for benchmark with dependency injection.
 *
 * Uses the Search SDK retrieval service for all queries, ensuring
 * benchmarks exercise the same code paths as production consumers
 * (MCP server, CLI search commands).
 *
 * @see benchmark.ts
 * @see ADR-078 Dependency Injection for Testability
 */

import { isSubject, type AllSubjectSlug, type KeyStage } from '@oaknational/curriculum-sdk';
import type { Result } from '@oaknational/result';
import type { SearchSubjectSlug } from '@oaknational/curriculum-sdk/public/search.js';
import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { typeSafeKeys } from '@oaknational/curriculum-sdk';
import type {
  SearchLessonsParams,
  LessonsSearchResult,
  RetrievalError,
} from '@oaknational/oak-search-sdk';

/**
 * Search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns a `Result` containing
 * the search results or an error. Production code passes
 * `sdk.retrieval.searchLessons`; tests pass a mock.
 *
 * @param params - SDK search parameters for lesson search
 * @returns Promise resolving to Result with lesson search results or error
 */
export type SearchFunction = (
  params: SearchLessonsParams,
) => Promise<Result<LessonsSearchResult, RetrievalError>>;

/**
 * Input parameters for running a single benchmark query.
 *
 * Includes the query category for per-category metric aggregation.
 * Uses AllSubjectSlug to support KS4 science variants.
 *
 * When `subject` is undefined, the query runs across all subjects
 * (cross-subject benchmarking for unfiltered search quality).
 */
export interface RunQueryInput {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly subject: AllSubjectSlug | undefined;
  readonly phase: Phase | undefined;
  readonly queryKeyStage?: KeyStage;
  /** Category of user scenario this query represents. */
  readonly category: QueryCategory;
}

/**
 * Result of running a single benchmark query.
 *
 * Contains all IR metrics as defined in IR-METRICS.md,
 * plus the category for per-category aggregation.
 *
 * In review mode, also includes the actual results and expected relevance
 * for detailed analysis.
 */
export interface QueryResult {
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
 * Calculate all IR metrics for a single benchmark query.
 *
 * Computes MRR, NDCG\@10, Precision\@3, and Recall\@10 by comparing
 * the actual search results against the expected relevance judgements.
 *
 * @param actualResults - Ordered list of lesson slugs returned by search
 * @param expectedRelevance - Ground truth relevance map (slug to grade)
 * @returns Object with mrr, ndcg10, precision3, and recall10 scores
 */
function calculateBenchmarkMetrics(
  actualResults: readonly string[],
  expectedRelevance: Readonly<Record<string, number>>,
): { mrr: number; ndcg10: number; precision3: number; recall10: number } {
  return {
    mrr: calculateMRR(actualResults, expectedRelevance),
    ndcg10: calculateNDCG(actualResults, expectedRelevance, 10),
    precision3: calculatePrecisionAtK(actualResults, expectedRelevance, 3),
    recall10: calculateRecallAtK(actualResults, expectedRelevance, 10),
  };
}

/**
 * Run a single benchmark query and calculate metrics.
 *
 * Uses the SDK retrieval service to execute the search, ensuring
 * benchmarks use the same RRF query building, search execution,
 * and result processing as production consumers.
 *
 * @param input - Query configuration
 * @param searchFn - SDK search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 *
 * @example
 * ```typescript
 * // Production usage with SDK
 * const sdk = createSearchSdk({ deps, config });
 * const result = await runQuery(queryInput, sdk.retrieval.searchLessons);
 *
 * // Test usage with mock
 * const mockSearch = vi.fn().mockResolvedValue({ results: [], ... });
 * const result = await runQuery(queryInput, mockSearch);
 * ```
 */
export async function runQuery(
  input: RunQueryInput,
  searchFn: SearchFunction,
): Promise<QueryResult> {
  const start = performance.now();

  // Build SDK params from benchmark input.
  // When subject is undefined, run an unfiltered cross-subject query.
  // Otherwise map AllSubjectSlug to SearchSubjectSlug: KS4 science variants
  // (physics, chemistry, biology, combined-science) map to parent 'science'
  // because the SDK subject filter accepts canonical subjects only.
  const sdkParams: SearchLessonsParams = {
    text: input.query,
    keyStage: input.queryKeyStage,
    size: 10,
    ...(input.subject !== undefined && {
      subject: isSubject(input.subject) ? input.subject : ('science' satisfies SearchSubjectSlug),
    }),
  };

  // Execute search via injected SDK function
  const result = await searchFn(sdkParams);
  if (!result.ok) {
    throw new Error(
      `Benchmark search failed for query "${input.query}": ${result.error.type}: ${result.error.message}`,
    );
  }
  const latencyMs = performance.now() - start;

  const actualResults = result.value.results.map((r) => r.lesson.lesson_slug);
  const metrics = calculateBenchmarkMetrics(actualResults, input.expectedRelevance);

  return {
    category: input.category,
    ...metrics,
    latencyMs,
    hasHit: actualResults.some((slug) => typeSafeKeys(input.expectedRelevance).includes(slug)),
    actualResults,
    expectedRelevance: input.expectedRelevance,
  };
}
