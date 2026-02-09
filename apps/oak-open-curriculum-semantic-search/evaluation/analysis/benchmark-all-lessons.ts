/**
 * Lessons benchmark runner for the unified benchmark CLI.
 *
 * @packageDocumentation
 */

import { esSearch } from '../../src/lib/elastic-http.js';
import type { SearchLessonsIndexDoc } from '../../src/types/oak.js';
import { runQuery, type SearchFunction } from './benchmark-query-runner-lessons.js';
import { getLessonGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

const searchAdapter: SearchFunction = async (request) => {
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return {
    hits: {
      hits: response.hits.hits.map((hit) => ({
        _source: { lesson_slug: hit._source.lesson_slug },
      })),
    },
  };
};

/** Run all lesson ground truth queries and return summary metrics. */
export async function benchmarkLessons(): Promise<IndexResult> {
  const entries = getLessonGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    for (const query of entry.queries) {
      const result = await runQuery(
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

  return { index: 'lessons', queries: results.length, metrics: averageMetrics(results) };
}
