/**
 * Simple script to test a single query against the threads index using 2-way RRF hybrid search.
 *
 * Usage: pnpm tsx src/lib/search-quality/test-query-threads.ts "your query here" [subject]
 *
 * Example: pnpm tsx src/lib/search-quality/test-query-threads.ts "algebra progression" maths
 *
 * Threads are curriculum progressions (predominantly Maths). The index has ~164 documents.
 */

import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env.local
const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '../../../.env.local');
dotenvConfig({ path: envLocalPath });

import { esSearch } from '../elastic-http.js';
import { buildThreadRrfRequest } from '../hybrid-search/rrf-query-builders.js';
import type { SearchThreadIndexDoc } from '../../types/oak.js';

/** Print usage instructions and exit. */
function printUsageAndExit(): never {
  console.log('Usage: pnpm tsx src/lib/search-quality/test-query-threads.ts "query" [subject]');
  console.log(
    'Example: pnpm tsx src/lib/search-quality/test-query-threads.ts "algebra progression" maths',
  );
  process.exit(1);
}

/** Print search configuration header. */
function printHeader(query: string, subjectSlug?: string): void {
  console.log(`\n2-way RRF Hybrid Search (Threads)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Query: "${query}"`);
  if (subjectSlug) {
    console.log(`Subject: ${subjectSlug}`);
  }
  console.log(`${'='.repeat(60)}\n`);
}

/** Print search results. */
function printResults(
  hits: readonly { _source: SearchThreadIndexDoc; _score: number | null }[],
  latency: number,
): void {
  console.log(`Results (${hits.length} hits, ${latency.toFixed(0)}ms):\n`);
  hits.forEach((hit, index) => {
    console.log(`${index + 1}. ${hit._source.thread_slug}`);
    console.log(`   Title: ${hit._source.thread_title}`);
    console.log(`   Units: ${hit._source.unit_count}`);
    if (hit._source.subject_slugs && hit._source.subject_slugs.length > 0) {
      console.log(`   Subjects: ${hit._source.subject_slugs.join(', ')}`);
    }
    console.log(`   Score: ${hit._score?.toFixed(4) ?? 'N/A'}\n`);
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    printUsageAndExit();
  }

  const query = args[0];
  const subjectSlug = args[1];

  if (query === undefined) {
    console.error('Query is required');
    process.exit(1);
  }

  printHeader(query, subjectSlug);

  const start = performance.now();
  const request = buildThreadRrfRequest({ text: query, size: 10, subjectSlug });
  const response = await esSearch<SearchThreadIndexDoc>(request);

  printResults(response.hits.hits, performance.now() - start);
}

main().catch((error: unknown) => {
  console.error('Test query failed:', error);
  process.exit(1);
});
