/**
 * Query runner for thread benchmarks with dependency injection.
 *
 * Separates the query execution logic from the ES client, enabling
 * integration testing with mock search functions.
 *
 * Uses buildThreadRrfRequest and extracts thread_slug from results.
 *
 * @see benchmark-threads.ts
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import type { AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { buildThreadRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { EsSearchRequest } from '../../src/lib/elastic-http.js';

/** Simplified ES response type for thread benchmark purposes. */
export interface ThreadSearchResponse {
  readonly hits: {
    readonly hits: readonly {
      readonly _source: {
        readonly thread_slug: string;
      };
    }[];
  };
}

/**
 * Thread search function type for dependency injection.
 *
 * Accepts an ES request and returns a promise of search results.
 * Production code passes esSearch; tests pass a mock.
 */
export type ThreadSearchFunction = (request: EsSearchRequest) => Promise<ThreadSearchResponse>;

/**
 * Input parameters for running a single thread benchmark query.
 *
 * Note: Threads don't use phase or keyStage for filtering - they span multiple.
 */
export interface RunThreadQueryInput {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly subject: AllSubjectSlug;
  readonly category: QueryCategory;
}

/**
 * Result of running a single thread benchmark query.
 */
export interface ThreadQueryResult {
  readonly category: QueryCategory;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
  readonly latencyMs: number;
  readonly hasHit: boolean;
  readonly actualResults: readonly string[];
  readonly expectedRelevance: Readonly<Record<string, number>>;
}

/**
 * Runs a single thread benchmark query and calculates metrics.
 *
 * @param input - Query configuration
 * @param searchFn - Search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
export async function runThreadQuery(
  input: RunThreadQueryInput,
  searchFn: ThreadSearchFunction,
): Promise<ThreadQueryResult> {
  const start = performance.now();

  // Build the full ES request for threads
  // Threads use subject slug for filtering, not keyStage
  const request = buildThreadRrfRequest({
    text: input.query,
    size: 10,
    subjectSlug: input.subject,
  });

  // Execute search via injected function
  const response = await searchFn(request);
  const latencyMs = performance.now() - start;

  // Extract results - using thread_slug
  const actualResults = response.hits.hits.map((hit) => hit._source.thread_slug);
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
