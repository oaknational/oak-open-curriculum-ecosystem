/**
 * Sequences benchmark runner for the unified benchmark CLI.
 *
 * @packageDocumentation
 */

import { esSearch } from '../../src/lib/elastic-http.js';
import type { SearchSequenceIndexDoc } from '../../src/types/oak.js';
import { isSubject } from '@oaknational/oak-curriculum-sdk';
import {
  runSequenceQuery,
  type SequenceSearchFunction,
} from './benchmark-query-runner-sequences.js';
import { getSequenceGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

const searchAdapter: SequenceSearchFunction = async (request) => {
  const response = await esSearch<SearchSequenceIndexDoc>(request);
  return {
    hits: {
      hits: response.hits.hits.map((hit) => ({
        _source: { sequence_slug: hit._source.sequence_slug },
      })),
    },
  };
};

/** Run all sequence ground truth queries and return summary metrics. */
export async function benchmarkSequences(): Promise<IndexResult> {
  const entries = getSequenceGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    if (!isSubject(entry.subject)) {
      console.warn(`  \u26A0 Skipping: subject "${entry.subject}" is not a valid sequence subject`);
      continue;
    }

    for (const query of entry.queries) {
      const result = await runSequenceQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          category: query.category,
        },
        searchAdapter,
      );
      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`    ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      results.push(result);
    }
  }

  return { index: 'sequences', queries: results.length, metrics: averageMetrics(results) };
}
