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
import type { SearchUnitsParams, UnitsSearchResult } from '@oaknational/oak-search-sdk';

/**
 * Unit search function type for dependency injection.
 *
 * Accepts SDK search parameters and returns SDK results.
 * Production code passes `sdk.retrieval.searchUnits`;
 * tests pass a mock.
 */
export type UnitSearchFunction = (params: SearchUnitsParams) => Promise<UnitsSearchResult>;

/**
 * Input parameters for running a single unit benchmark query.
 */
export interface RunUnitQueryInput {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
  readonly subject: AllSubjectSlug;
  readonly phase: Phase;
  readonly queryKeyStage?: KeyStage;
  readonly category: QueryCategory;
}

/**
 * Result of running a single unit benchmark query.
 */
export interface UnitQueryResult {
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
 * Runs a single unit benchmark query and calculates metrics.
 *
 * @param input - Query configuration
 * @param searchFn - SDK search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
/**
 * Map AllSubjectSlug → SearchSubjectSlug for SDK consumption.
 *
 * KS4 science variants (physics, chemistry, biology, combined-science)
 * map to parent 'science' because the SDK subject filter accepts
 * canonical subjects only.
 */
function toSearchSubject(subject: AllSubjectSlug): SearchSubjectSlug {
  if (isSubject(subject)) {
    return subject;
  }
  return 'science';
}

/** Extract unit slugs from SDK results, filtering out null units. */
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
  const latencyMs = performance.now() - start;
  const actualResults = extractUnitSlugs(result.results);
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
