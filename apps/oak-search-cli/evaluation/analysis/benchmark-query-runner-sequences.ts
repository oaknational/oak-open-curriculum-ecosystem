/**
 * Query runner for sequence benchmarks with dependency injection.
 *
 * Uses the Search SDK retrieval service for all queries, ensuring
 * benchmarks exercise the same code paths as production consumers.
 *
 * @see benchmark-sequences.ts
 * @see ADR-078 Dependency Injection for Testability
 */

import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { SearchSequencesParams, SequencesSearchResult } from '@oaknational/oak-search-sdk';
import type { SearchSubjectSlug } from '@oaknational/oak-curriculum-sdk/public/search.js';

/**
 * Sequence search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns SDK results.
 * Production code passes `sdk.retrieval.searchSequences`;
 * tests pass a mock.
 */
export type SequenceSearchFunction = (
  params: SearchSequencesParams,
) => Promise<SequencesSearchResult>;

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
 * @param searchFn - SDK search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
export async function runSequenceQuery(
  input: RunSequenceQueryInput,
  searchFn: SequenceSearchFunction,
): Promise<SequenceQueryResult> {
  const start = performance.now();

  // Build SDK params from benchmark input
  const sdkParams: SearchSequencesParams = {
    text: input.query,
    subject: input.subject,
    phaseSlug: input.phase,
    size: 10,
  };

  // Execute search via injected SDK function
  const result = await searchFn(sdkParams);
  const latencyMs = performance.now() - start;

  // Extract results - using sequence_slug from SDK results
  const actualResults = result.results.map((r) => r.sequence.sequence_slug);
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
