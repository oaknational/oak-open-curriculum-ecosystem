/**
 * Query runner for unit benchmarks with dependency injection.
 *
 * Separates the query execution logic from the ES client, enabling
 * integration testing with mock search functions.
 *
 * Uses buildUnitRrfRequest and extracts unit_slug from results.
 *
 * @see benchmark-units.ts
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import type { AllSubjectSlug, KeyStage } from '@oaknational/oak-curriculum-sdk';
import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  calculateMRR,
  calculateNDCG,
  calculatePrecisionAtK,
  calculateRecallAtK,
} from '../../src/lib/search-quality/metrics.js';
import { buildUnitRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import { buildBenchmarkRequestParams } from './benchmark-request-builder.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { EsSearchRequest } from '../../src/lib/elastic-http.js';

/** Simplified ES response type for unit benchmark purposes. */
export interface UnitSearchResponse {
  readonly hits: {
    readonly hits: readonly {
      readonly _source: {
        readonly unit_slug: string;
      };
    }[];
  };
}

/**
 * Unit search function type for dependency injection.
 *
 * Accepts an ES request and returns a promise of search results.
 * Production code passes esSearch; tests pass a mock.
 */
export type UnitSearchFunction = (request: EsSearchRequest) => Promise<UnitSearchResponse>;

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
 * @param searchFn - Search function (injected for testability)
 * @returns Query result with MRR, NDCG, latency, and hit status
 */
export async function runUnitQuery(
  input: RunUnitQueryInput,
  searchFn: UnitSearchFunction,
): Promise<UnitQueryResult> {
  const start = performance.now();

  // Build request params using pure function
  const requestParams = buildBenchmarkRequestParams({
    text: input.query,
    subject: input.subject,
    phase: input.phase,
    queryKeyStage: input.queryKeyStage,
  });

  // Build the full ES request for units
  const request = buildUnitRrfRequest(requestParams);

  // Execute search via injected function
  const response = await searchFn(request);
  const latencyMs = performance.now() - start;

  // Extract results - using unit_slug instead of lesson_slug
  const actualResults = response.hits.hits.map((hit) => hit._source.unit_slug);
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
