/**
 * Query runner for sequence benchmarks with dependency injection.
 *
 * Separates the query execution logic from the ES client, enabling
 * integration testing with mock search functions.
 *
 * Uses buildSequenceRrfRequest and extracts sequence_slug from results.
 *
 * @see benchmark-sequences.ts
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { buildSequenceRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { EsSearchRequest } from '../../src/lib/elastic-http.js';
import type { SearchSubjectSlug } from '../../src/types/oak.js';

/** Simplified ES response type for sequence benchmark purposes. */
export interface SequenceSearchResponse {
  readonly hits: {
    readonly hits: readonly {
      readonly _source: {
        readonly sequence_slug: string;
      };
    }[];
  };
}

/**
 * Sequence search function type for dependency injection.
 *
 * Accepts an ES request and returns a promise of search results.
 * Production code passes esSearch; tests pass a mock.
 */
export type SequenceSearchFunction = (request: EsSearchRequest) => Promise<SequenceSearchResponse>;

/**
 * Input parameters for running a single sequence benchmark query.
 */
export interface RunSequenceQueryInput {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly subject: SearchSubjectSlug;
  readonly phase: Phase;
  readonly category: QueryCategory;
}

/**
 * Result of running a single sequence benchmark query.
 */
export interface SequenceQueryResult {
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
 * Runs a single sequence benchmark query and calculates metrics.
 *
 * @param input - Query configuration
 * @param searchFn - Search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
export async function runSequenceQuery(
  input: RunSequenceQueryInput,
  searchFn: SequenceSearchFunction,
): Promise<SequenceQueryResult> {
  const start = performance.now();

  // Build the full ES request for sequences
  const request = buildSequenceRrfRequest({
    text: input.query,
    size: 10,
    subject: input.subject,
    phaseSlug: input.phase,
  });

  // Execute search via injected function
  const response = await searchFn(request);
  const latencyMs = performance.now() - start;

  // Extract results - using sequence_slug
  const actualResults = response.hits.hits.map((hit) => hit._source.sequence_slug);
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
