/**
 * Simple script to test a single query against the units index using 4-way RRF hybrid search.
 *
 * Usage: pnpm tsx src/lib/search-quality/test-query-units.ts "your query here" [subject] [keyStage]
 *
 * Example: pnpm tsx src/lib/search-quality/test-query-units.ts "fractions year 5" maths ks2
 */

import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env.local
const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '../../../.env.local');
dotenvConfig({ path: envLocalPath });

import { esSearch } from '../elastic-http.js';
import { buildUnitRrfRequest } from '../hybrid-search/rrf-query-builders.js';
import type { SearchUnitRollupDoc, SearchSubjectSlug, KeyStage } from '../../types/oak.js';

/** Print usage instructions and exit. */
function printUsageAndExit(): never {
  console.log(
    'Usage: pnpm tsx src/lib/search-quality/test-query-units.ts "query" [subject] [keyStage]',
  );
  console.log(
    'Example: pnpm tsx src/lib/search-quality/test-query-units.ts "fractions year 5" maths ks2',
  );
  process.exit(1);
}

/** Print search configuration header. */
function printHeader(query: string, subject?: string, keyStage?: string): void {
  console.log(`\n4-way RRF Hybrid Search (Units)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Query: "${query}"`);
  if (subject) {
    console.log(`Subject: ${subject}`);
  }
  if (keyStage) {
    console.log(`Key Stage: ${keyStage}`);
  }
  console.log(`${'='.repeat(60)}\n`);
}

/** Print search results. */
function printResults(
  hits: readonly { _source: SearchUnitRollupDoc; _score: number | null }[],
  latency: number,
): void {
  console.log(`Results (${hits.length} hits, ${latency.toFixed(0)}ms):\n`);
  hits.forEach((hit, index) => {
    console.log(`${index + 1}. ${hit._source.unit_slug}`);
    console.log(`   Title: ${hit._source.unit_title}`);
    console.log(`   Lessons: ${hit._source.lesson_count}`);
    console.log(`   Score: ${hit._score?.toFixed(4) ?? 'N/A'}\n`);
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    printUsageAndExit();
  }

  const query = args[0];
  const subject = args[1] as SearchSubjectSlug | undefined;
  const keyStage = args[2] as KeyStage | undefined;

  if (query === undefined) {
    console.error('Query is required');
    process.exit(1);
  }

  printHeader(query, subject, keyStage);

  const start = performance.now();
  const request = buildUnitRrfRequest({ text: query, size: 10, subject, keyStage });
  const response = await esSearch<SearchUnitRollupDoc>(request);

  printResults(response.hits.hits, performance.now() - start);
}

main().catch((error: unknown) => {
  console.error('Test query failed:', error);
  process.exit(1);
});
