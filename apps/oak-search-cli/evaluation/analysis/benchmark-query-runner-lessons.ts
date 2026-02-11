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

import { isSubject, type AllSubjectSlug, type KeyStage } from '@oaknational/oak-curriculum-sdk';
import type { SearchSubjectSlug } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { SearchLessonsParams, LessonsSearchResult } from '@oaknational/oak-search-sdk';

/**
 * Search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns SDK results.
 * Production code passes `sdk.retrieval.searchLessons`;
 * tests pass a mock.
 */
export type SearchFunction = (params: SearchLessonsParams) => Promise<LessonsSearchResult>;

/**
 * Input parameters for running a single benchmark query.
 *
 * Includes the query category for per-category metric aggregation.
 * Uses AllSubjectSlug to support KS4 science variants.
 */
export interface RunQueryInput {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly subject: AllSubjectSlug;
  readonly phase: Phase;
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
 * Runs a single benchmark query and calculates metrics.
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
  // Map AllSubjectSlug → SearchSubjectSlug: KS4 science variants
  // (physics, chemistry, biology, combined-science) map to parent 'science'
  // because the SDK subject filter accepts canonical subjects only.
  const subject: SearchSubjectSlug = isSubject(input.subject) ? input.subject : 'science';

  const sdkParams: SearchLessonsParams = {
    text: input.query,
    subject,
    keyStage: input.queryKeyStage,
    size: 10,
  };

  // Execute search via injected SDK function
  const result = await searchFn(sdkParams);
  const latencyMs = performance.now() - start;

  // Extract slugs from SDK results
  const actualResults = result.results.map((r) => r.lesson.lesson_slug);
  const expectedSlugs = typeSafeKeys(input.expectedRelevance);

  // Calculate all metrics
  const relevanceMap = input.expectedRelevance;
  const mrr = calculateMRR(actualResults, relevanceMap);
  const ndcg10 = calculateNDCG(actualResults, relevanceMap, 10);
  const precision3 = calculatePrecisionAtK(actualResults, relevanceMap, 3);
  const recall10 = calculateRecallAtK(actualResults, relevanceMap, 10);

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
