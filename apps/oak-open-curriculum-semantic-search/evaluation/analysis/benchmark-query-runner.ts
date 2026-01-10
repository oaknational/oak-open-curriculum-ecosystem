/**
 * Query runner for benchmark with dependency injection.
 *
 * Separates the query execution logic from the ES client, enabling
 * integration testing with mock search functions.
 *
 * @see benchmark.ts
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import type { KeyStage } from '@oaknational/oak-curriculum-sdk';
import type { Phase } from '../../src/lib/search-quality/ground-truth/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth/types.js';
import type { SearchSubjectSlug } from '../../src/types/oak.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import { buildBenchmarkRequestParams } from './benchmark-request-builder.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { EsSearchRequest } from '../../src/lib/elastic-http.js';

/** Simplified ES response type for benchmark purposes. */
export interface SearchResponse {
  readonly hits: {
    readonly hits: readonly {
      readonly _source: {
        readonly lesson_slug: string;
      };
    }[];
  };
}

/**
 * Search function type for dependency injection.
 *
 * Accepts an ES request and returns a promise of search results.
 * Production code passes esSearch; tests pass a mock.
 */
export type SearchFunction = (request: EsSearchRequest) => Promise<SearchResponse>;

/**
 * Input parameters for running a single benchmark query.
 *
 * Includes the query category for per-category metric aggregation.
 */
export interface RunQueryInput {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly subject: SearchSubjectSlug;
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
 */
export interface QueryResult {
  /** Category of user scenario this query represents. */
  readonly category: QueryCategory;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision10: number;
  readonly recall10: number;
  readonly latencyMs: number;
  readonly hasHit: boolean;
}

/**
 * Runs a single benchmark query and calculates metrics.
 *
 * @param input - Query configuration
 * @param searchFn - Search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 *
 * @example
 * ```typescript
 * // Production usage with real ES client
 * import { esSearch } from '../../src/lib/elastic-http.js';
 * const result = await runQuery(queryInput, esSearch);
 *
 * // Test usage with mock
 * const mockSearch = vi.fn().mockResolvedValue({ hits: { hits: [] } });
 * const result = await runQuery(queryInput, mockSearch);
 * ```
 */
export async function runQuery(
  input: RunQueryInput,
  searchFn: SearchFunction,
): Promise<QueryResult> {
  const start = performance.now();

  // Build request params using pure function
  const requestParams = buildBenchmarkRequestParams({
    text: input.query,
    subject: input.subject,
    phase: input.phase,
    queryKeyStage: input.queryKeyStage,
  });

  // Build the full ES request
  const request = buildLessonRrfRequest(requestParams);

  // Execute search via injected function
  const response = await searchFn(request);
  const latencyMs = performance.now() - start;

  // Extract results
  const actualResults = response.hits.hits.map((hit) => hit._source.lesson_slug);
  const expectedSlugs = typeSafeKeys(input.expectedRelevance);

  // Calculate all metrics
  const relevanceMap = input.expectedRelevance;
  const mrr = calculateMRR(actualResults, relevanceMap);
  const ndcg10 = calculateNDCG(actualResults, relevanceMap, 10);
  const precision10 = calculatePrecisionAtK(actualResults, relevanceMap, 10);
  const recall10 = calculateRecallAtK(actualResults, relevanceMap, 10);

  return {
    category: input.category,
    mrr,
    ndcg10,
    precision10,
    recall10,
    latencyMs,
    hasHit: actualResults.some((slug) => expectedSlugs.includes(slug)),
  };
}
