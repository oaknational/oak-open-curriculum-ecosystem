/**
 * Query runner for sequence benchmarks with dependency injection.
 *
 * Uses the Search SDK retrieval service for all queries, ensuring
 * benchmarks exercise the same code paths as production consumers.
 *
 * @see benchmark-sequences.ts
 * @see ADR-078 Dependency Injection for Testability
 */

import type { Result } from '@oaknational/result';
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
  SearchSequencesParams,
  SequencesSearchResult,
  RetrievalError,
} from '@oaknational/oak-search-sdk/read';
import type { SearchSubjectSlug } from '@oaknational/sdk-codegen/search';

/**
 * Sequence search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns a `Result` containing
 * the search results or an error. Production code passes
 * `sdk.retrieval.searchSequences`; tests pass a mock.
 *
 * @param params - SDK search parameters for sequence search
 * @returns Promise resolving to Result with sequence search results or error
 */
export type SequenceSearchFunction = (
  params: SearchSequencesParams,
) => Promise<Result<SequencesSearchResult, RetrievalError>>;

/**
 * Input parameters for running a single sequence benchmark query.
 */
export interface RunSequenceQueryInput {
  /** The search query. */
  readonly query: string;
  /** Map of sequence slug to expected relevance score. */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /** Subject slug for filtering. */
  readonly subject: SearchSubjectSlug;
  /** Phase (e.g. primary, secondary). */
  readonly phase: Phase;
  /** Category of user scenario this query represents. */
  readonly category: QueryCategory;
}

/**
 * Result of running a single sequence benchmark query.
 *
 * Contains all IR metrics as defined in IR-METRICS.md, plus category for aggregation.
 */
export interface SequenceQueryResult {
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
 * Run a single sequence benchmark query and calculate metrics.
 *
 * Uses the SDK retrieval service to execute the search, ensuring
 * benchmarks use the same code paths as production consumers.
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
    query: input.query,
    subject: input.subject,
    phaseSlug: input.phase,
    size: 10,
  };

  // Execute search via injected SDK function
  const result = await searchFn(sdkParams);
  if (!result.ok) {
    throw new Error(
      `Benchmark sequence search failed for query "${input.query}": ${result.error.type}: ${result.error.message}`,
    );
  }
  const latencyMs = performance.now() - start;

  // Extract results - using sequence_slug from SDK results
  const actualResults = result.value.results.map((r) => r.sequence.sequence_slug);
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
