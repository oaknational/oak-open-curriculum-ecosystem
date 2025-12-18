/**
 * Functions for running search experiments.
 *
 * Uses two-way hybrid search (BM25 + ELSER) per ADR-075 - dense vectors removed.
 */

import type { Client } from '@elastic/elasticsearch';
import type { ExperimentResult, QueryResult, SearchConfig } from './types';
import { buildSearchBody } from './query-builders';
import { calculateAverages } from './result-analysis';
import { calculateMRR, calculateNDCG } from '../../src/lib/search-quality/metrics.js';
import { GROUND_TRUTH_QUERIES } from '../../src/lib/search-quality/ground-truth.js';

/** BM25 fields for lesson search. */
const BM25_FIELDS = [
  'lesson_title^2',
  'lesson_content',
  'lesson_keywords^1.5',
  'key_learning_points',
] as const;

/** Log with timestamp. */
function log(msg: string): void {
  console.log(`[${new Date().toISOString().slice(11, 23)}] ${msg}`);
}

/** Build search config from parameters. */
function buildConfig(
  query: string,
  useRerank: boolean,
  retrieveSize: number,
  rerankSize: number,
): SearchConfig {
  return { query, useRerank, retrieveSize, rerankSize, bm25Fields: BM25_FIELDS };
}

/** Execute search and calculate metrics. */
async function executeSearch(
  client: Client,
  config: SearchConfig,
): Promise<{ results: string[]; latency: number }> {
  const start = Date.now();
  const res = await client.search<{ lesson_slug: string }>(buildSearchBody(config));
  const results = res.hits.hits.flatMap((hit) => (hit._source ? [hit._source.lesson_slug] : []));
  return { results, latency: Date.now() - start };
}

/** Execute a single search query and calculate metrics. */
export async function runSingleQuery(
  client: Client,
  query: string,
  expectedRelevance: Record<string, number>,
  useRerank: boolean,
  retrieveSize: number,
  rerankSize: number,
): Promise<QueryResult> {
  const config = buildConfig(query, useRerank, retrieveSize, rerankSize);
  const { results, latency } = await executeSearch(client, config);
  return {
    mrr: calculateMRR(results, expectedRelevance),
    ndcg: calculateNDCG(results, expectedRelevance, 10),
    latency,
  };
}

/** Process single ground truth query. */
async function processQuery(
  client: Client,
  gt: { query: string; expectedRelevance: Record<string, number> },
  useRerank: boolean,
  retrieveSize: number,
  rerankSize: number,
): Promise<QueryResult> {
  return runSingleQuery(
    client,
    gt.query,
    gt.expectedRelevance,
    useRerank,
    retrieveSize,
    rerankSize,
  );
}

/** Record successful query result. */
function recordSuccess(
  mrrs: number[],
  ndcgs: number[],
  latencies: number[],
  result: QueryResult,
): void {
  mrrs.push(result.mrr);
  ndcgs.push(result.ndcg);
  latencies.push(result.latency);
}

/** Record failed query. */
function recordFailure(mrrs: number[], ndcgs: number[]): void {
  mrrs.push(0);
  ndcgs.push(0);
}

/** Run a complete experiment across all ground truth queries. */
export async function runExperiment(
  client: Client,
  name: string,
  useRerank: boolean,
  retrieveSize: number,
  rerankSize: number,
): Promise<ExperimentResult> {
  log(`Starting: ${name}`);

  const mrrs: number[] = [];
  const ndcgs: number[] = [];
  const latencies: number[] = [];
  let errors = 0;

  for (let i = 0; i < GROUND_TRUTH_QUERIES.length; i++) {
    const gt = GROUND_TRUTH_QUERIES[i];
    if (!gt) {
      continue;
    }

    try {
      recordSuccess(
        mrrs,
        ndcgs,
        latencies,
        await processQuery(client, gt, useRerank, retrieveSize, rerankSize),
      );
      if ((i + 1) % 10 === 0) {
        log(`  ${name}: ${i + 1}/${GROUND_TRUTH_QUERIES.length} queries done`);
      }
    } catch (e) {
      errors++;
      log(
        `  ERROR on "${gt.query}": ${(e instanceof Error ? e.message : String(e)).slice(0, 100)}`,
      );
      recordFailure(mrrs, ndcgs);
    }
  }

  const result = calculateAverages(name, { mrrs, ndcgs, latencies, errors });
  log(
    `Finished: ${name} - MRR=${result.avgMRR.toFixed(3)}, NDCG=${result.avgNDCG.toFixed(3)}, avgLatency=${result.avgLatency.toFixed(0)}ms`,
  );
  return result;
}
