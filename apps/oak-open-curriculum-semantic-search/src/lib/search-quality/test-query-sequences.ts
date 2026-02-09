/**
 * Simple script to test a single query against the sequences index using 2-way RRF hybrid search.
 *
 * Usage: pnpm tsx src/lib/search-quality/test-query-sequences.ts "your query here" [subject] [phase]
 *
 * Example: pnpm tsx src/lib/search-quality/test-query-sequences.ts "secondary mathematics" maths secondary
 *
 * Sequences represent subject-phase programmes. The index has ~30 documents.
 * Note: Sequences may be better served by filters/navigation than search.
 *
 * @packageDocumentation
 */

import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env.local
const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '../../../.env.local');
dotenvConfig({ path: envLocalPath });

import { esSearch } from '../elastic-http.js';
import { buildSequenceRrfRequest } from '../hybrid-search/rrf-query-builders.js';
import type { SearchSequenceIndexDoc, SearchSubjectSlug } from '../../types/oak.js';

/** Print usage instructions and exit. */
function printUsageAndExit(): never {
  console.log(
    'Usage: pnpm tsx src/lib/search-quality/test-query-sequences.ts "query" [subject] [phase]',
  );
  console.log(
    'Example: pnpm tsx src/lib/search-quality/test-query-sequences.ts "secondary mathematics" maths secondary',
  );
  process.exit(1);
}

/** Print search configuration header. */
function printHeader(query: string, subject?: string, phaseSlug?: string): void {
  console.log(`\n2-way RRF Hybrid Search (Sequences)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Query: "${query}"`);
  if (subject) {
    console.log(`Subject: ${subject}`);
  }
  if (phaseSlug) {
    console.log(`Phase: ${phaseSlug}`);
  }
  console.log(`${'='.repeat(60)}\n`);
}

/** Print search results. */
function printResults(
  hits: readonly { _source: SearchSequenceIndexDoc; _score: number | null }[],
  latency: number,
): void {
  console.log(`Results (${hits.length} hits, ${latency.toFixed(0)}ms):\n`);
  hits.forEach((hit, index) => {
    console.log(`${index + 1}. ${hit._source.sequence_slug}`);
    console.log(`   Title: ${hit._source.sequence_title}`);
    console.log(`   Subject: ${hit._source.subject_slug}`);
    if (hit._source.phase_slug) {
      console.log(`   Phase: ${hit._source.phase_slug}`);
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
  const subject = args[1] as SearchSubjectSlug | undefined;
  const phaseSlug = args[2];

  if (query === undefined) {
    console.error('Query is required');
    process.exit(1);
  }

  printHeader(query, subject, phaseSlug);

  const start = performance.now();
  const request = buildSequenceRrfRequest({ text: query, size: 10, subject, phaseSlug });
  const response = await esSearch<SearchSequenceIndexDoc>(request);

  printResults(response.hits.hits, performance.now() - start);
}

main().catch((error: unknown) => {
  console.error('Test query failed:', error);
  process.exit(1);
});
