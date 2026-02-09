/**
 * Units benchmark runner for the unified benchmark CLI.
 *
 * @packageDocumentation
 */

import { esSearch } from '../../src/lib/elastic-http.js';
import type { SearchUnitRollupDoc } from '../../src/types/oak.js';
import { runUnitQuery, type UnitSearchFunction } from './benchmark-query-runner-units.js';
import { getUnitGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

const searchAdapter: UnitSearchFunction = async (request) => {
  const response = await esSearch<SearchUnitRollupDoc>(request);
  return {
    hits: {
      hits: response.hits.hits.map((hit) => ({
        _source: { unit_slug: hit._source.unit_slug },
      })),
    },
  };
};

/** Run all unit ground truth queries and return summary metrics. */
export async function benchmarkUnits(): Promise<IndexResult> {
  const entries = getUnitGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    for (const query of entry.queries) {
      const result = await runUnitQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          queryKeyStage: query.keyStage,
          category: query.category,
        },
        searchAdapter,
      );
      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`    ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      results.push(result);
    }
  }

  return { index: 'units', queries: results.length, metrics: averageMetrics(results) };
}
