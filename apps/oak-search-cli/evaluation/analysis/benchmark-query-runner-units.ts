/**
 * Query runner for unit benchmarks with dependency injection.
 *
 * Uses the Search SDK retrieval service for all queries, ensuring
 * benchmarks exercise the same code paths as production consumers.
 *
 * @see benchmark-units.ts
 * @see ADR-078 Dependency Injection for Testability
 */

import { isSubject, type AllSubjectSlug, type KeyStage } from '@oaknational/oak-curriculum-sdk';
import type { Result } from '@oaknational/result';
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
import type {
  SearchUnitsParams,
  UnitsSearchResult,
  RetrievalError,
} from '@oaknational/oak-search-sdk';

/**
 * Unit search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns a `Result` containing
 * the search results or an error. Production code passes
 * `sdk.retrieval.searchUnits`; tests pass a mock.
 *
 * @param params - SDK search parameters for unit search
 * @returns Promise resolving to Result with unit search results or error
 */
export type UnitSearchFunction = (
  params: SearchUnitsParams,
) => Promise<Result<UnitsSearchResult, RetrievalError>>;

/**
 * Input parameters for running a single unit benchmark query.
 *
 * Uses AllSubjectSlug to support KS4 science variants.
 */
export interface RunUnitQueryInput {
  /** The search query text. */
  readonly query: string;
  /** Map of unit slug to expected relevance score. */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /** Subject slug (supports KS4 science variants). */
  readonly subject: AllSubjectSlug;
  /** Phase (e.g. primary, secondary). */
  readonly phase: Phase;
  /** Optional key stage for query filtering. */
  readonly queryKeyStage?: KeyStage;
  /** Category of user scenario this query represents. */
  readonly category: QueryCategory;
}

/**
 * Result of running a single unit benchmark query.
 *
 * Contains all IR metrics as defined in IR-METRICS.md, plus category for aggregation.
 */
export interface UnitQueryResult {
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
 * Map AllSubjectSlug to SearchSubjectSlug for SDK consumption.
 *
 * KS4 science variants (physics, chemistry, biology, combined-science)
 * map to parent 'science' because the SDK subject filter accepts
 * canonical subjects only.
 *
 * @param subject - Subject slug (may be KS4 science variant)
 * @returns Canonical SearchSubjectSlug for SDK
 */
function toSearchSubject(subject: AllSubjectSlug): SearchSubjectSlug {
  if (isSubject(subject)) {
    return subject;
  }
  return 'science';
}

/**
 * Extract unit slugs from SDK results, filtering out null units.
 *
 * @param results - SDK unit search results array
 * @returns Array of unit slugs from non-null results
 */
function extractUnitSlugs(results: UnitsSearchResult['results']): string[] {
  return results
    .filter((r) => r.unit !== null)
    .map((r) => {
      if (r.unit === null) {
        throw new Error('Unexpected null unit after filter');
      }
      return r.unit.unit_slug;
    });
}

/**
 * Run a single unit benchmark query and calculate metrics.
 *
 * Uses the SDK retrieval service to execute the search, ensuring
 * benchmarks use the same code paths as production consumers.
 *
 * @param input - Query configuration
 * @param searchFn - SDK search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
export async function runUnitQuery(
  input: RunUnitQueryInput,
  searchFn: UnitSearchFunction,
): Promise<UnitQueryResult> {
  const start = performance.now();

  const sdkParams: SearchUnitsParams = {
    text: input.query,
    subject: toSearchSubject(input.subject),
    keyStage: input.queryKeyStage,
    size: 10,
  };

  const result = await searchFn(sdkParams);
  if (!result.ok) {
    throw new Error(
      `Benchmark unit search failed for query "${input.query}": ${result.error.type}: ${result.error.message}`,
    );
  }
  const latencyMs = performance.now() - start;
  const actualResults = extractUnitSlugs(result.value.results);
  const expectedSlugs = typeSafeKeys(input.expectedRelevance);

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
