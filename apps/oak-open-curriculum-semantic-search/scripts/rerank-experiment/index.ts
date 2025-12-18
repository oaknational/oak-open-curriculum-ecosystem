#!/usr/bin/env npx tsx
/**
 * @packageDocumentation
 * Reranker experiment script entry point.
 *
 * Compares two-way hybrid search (BM25 + ELSER) with and without reranking.
 * Uses two-way hybrid search per ADR-075 - dense vectors removed.
 *
 * Usage: npx tsx scripts/rerank-experiment/index.ts
 *
 * NOTE: Using `lesson_title` for reranker field instead of `lesson_content`.
 * Full transcripts cause 20+ second latencies due to cross-encoder O(n²) complexity.
 */

import { Client } from '@elastic/elasticsearch';
import { config } from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GROUND_TRUTH_QUERIES } from '../../src/lib/search-quality/ground-truth.js';
import type { ExperimentResult } from './types';
import { runSingleQuery, runExperiment } from './experiment-runner';
import { formatResultRow, compareResults } from './result-analysis';

// Load env from app directory
const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: join(currentDir, '..', '..', '.env.local') });

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: { apiKey: process.env.ELASTICSEARCH_API_KEY ?? '' },
});

const RETRIEVE_SIZE = 50;
const RERANK_SIZE = 20;

/** Log with timestamp. */
function log(msg: string): void {
  const timestamp = new Date().toISOString().slice(11, 23);
  console.log(`[${timestamp}] ${msg}`);
}

/** Test Elasticsearch connection. */
async function testConnection(): Promise<boolean> {
  log('Testing ES connection...');
  try {
    const info = await client.info();
    log(`Connected to ES cluster: ${info.cluster_name}`);
    return true;
  } catch (e) {
    log(`ERROR: Cannot connect to ES - ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

/** Test a single rerank query. */
async function testRerankQuery(): Promise<void> {
  log('Testing single rerank query...');
  try {
    const result = await runSingleQuery(
      client,
      'quadratic equations',
      { 'solving-quadratic-equations-by-factorising': 3 },
      true,
      RETRIEVE_SIZE,
      RERANK_SIZE,
    );
    log(`Single rerank test: latency=${result.latency}ms, mrr=${result.mrr.toFixed(3)}`);
  } catch (e) {
    log(`ERROR: Rerank test failed - ${e instanceof Error ? e.message : e}`);
    log('Continuing without rerank tests...');
  }
}

/** Print results table. */
function printResultsTable(results: readonly ExperimentResult[]): void {
  log('');
  log('=== RESULTS SUMMARY ===');
  console.log('');
  console.log('Config'.padEnd(22) + '| MRR   | NDCG@10 | Latency | Errors');
  console.log('-'.repeat(60));

  for (const r of results) {
    console.log(formatResultRow(r));
  }

  console.log('');
}

/** Print comparison analysis. */
function printAnalysis(results: readonly ExperimentResult[]): void {
  const noRerank = results.find((r) => r.name === '2-way (no rerank)');
  const withRerank = results.find((r) => r.name === '2-way + rerank');

  if (noRerank && withRerank) {
    const comp = compareResults(noRerank, withRerank);
    console.log('Effect of reranking on 2-way hybrid:');
    console.log(`  MRR diff:  ${comp.mrrDiff.toFixed(3)}`);
    console.log(`  NDCG diff: ${comp.ndcgDiff.toFixed(3)}`);
  }
}

/** Main entry point. */
async function main(): Promise<void> {
  log('=== RERANKER EXPERIMENT ===');
  log(`Retrieve size: ${RETRIEVE_SIZE}, Rerank window: ${RERANK_SIZE}`);
  log(`Total queries: ${GROUND_TRUTH_QUERIES.length}`);
  log('');

  if (!(await testConnection())) {
    process.exit(1);
  }

  await testRerankQuery();

  log('');
  log('Running experiments...');
  log('');

  const results: ExperimentResult[] = [];

  results.push(await runExperiment(client, '2-way (no rerank)', false, RETRIEVE_SIZE, RERANK_SIZE));
  results.push(await runExperiment(client, '2-way + rerank', true, RETRIEVE_SIZE, RERANK_SIZE));

  printResultsTable(results);
  printAnalysis(results);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
