#!/usr/bin/env npx tsx

/* eslint-disable max-lines-per-function, max-statements */
/**
 * Check current ingestion progress - both in ES and in progress file
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { IndexMetaDocSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { loadAppEnv } from '../src/lib/elasticsearch/setup/load-app-env.js';
import { esClient } from '../src/lib/es-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE = join(__dirname, '..', '.ingest-progress.json');

const IngestProgressSchema = z.object({
  startedAt: z.string(),
  lastUpdatedAt: z.string(),
  totalCombinations: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  results: z.array(
    z.object({
      status: z.enum(['pending', 'success', 'failed', 'skipped']),
      combination: z.object({
        id: z.string(),
      }),
      exitCode: z.number().int().optional(),
    }),
  ),
});

function safeJsonParse(text: string): unknown {
  return JSON.parse(text);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

async function checkElasticsearch() {
  console.log('📊 Elasticsearch Index Status:\n');

  loadAppEnv(__dirname);
  const client = esClient();

  const indices = [
    'oak_lessons',
    'oak_units',
    'oak_unit_rollup',
    'oak_sequences',
    'oak_sequence_facets',
  ];

  for (const index of indices) {
    try {
      const count = await client.count({ index });
      console.log(`   ${index.padEnd(25)} ${count.count.toString().padStart(5)} documents`);
    } catch (err) {
      console.log(`   ${index.padEnd(25)} ERROR: ${getErrorMessage(err)}`);
    }
  }

  // Try to get meta info
  try {
    const search = await client.search({
      index: 'oak_meta',
      size: 1,
      sort: [{ ingested_at: 'desc' }],
    });

    if (search.hits.hits.length > 0) {
      const metaCandidate = search.hits.hits[0]._source;
      const meta = IndexMetaDocSchema.parse(metaCandidate);
      console.log(`\n📅 Last Index Update:`);
      console.log(`   Version: ${meta.version}`);
      console.log(`   Ingested at: ${meta.ingested_at}`);
    }
  } catch (err) {
    console.warn(`   oak_meta ERROR: ${getErrorMessage(err)}`);
    // Meta index might not exist yet
  }
}

function checkProgressFile() {
  if (!existsSync(PROGRESS_FILE)) {
    console.log('\n📁 Progress File: Not found');
    console.log('   Run "pnpm ingest:all" to start systematic ingestion\n');
    return;
  }

  const json = readFileSync(PROGRESS_FILE, 'utf-8');
  const progress = IngestProgressSchema.parse(safeJsonParse(json));

  console.log('\n📁 Systematic Ingestion Progress:\n');
  console.log(`   Started: ${progress.startedAt}`);
  console.log(`   Last Updated: ${progress.lastUpdatedAt}`);
  console.log(`   Total Combinations: ${progress.totalCombinations}`);
  console.log(`   ✅ Completed: ${progress.completed}`);
  console.log(`   ❌ Failed: ${progress.failed}`);
  console.log(`   ⏭️  Skipped: ${progress.skipped}`);

  const pending = progress.results.filter((result) => result.status === 'pending').length;
  const percentage = (
    ((progress.completed + progress.failed + progress.skipped) / progress.totalCombinations) *
    100
  ).toFixed(1);

  console.log(`   ⏳ Pending: ${pending}`);
  console.log(`   Progress: ${percentage}%`);

  // Show recent successes
  const recentSuccesses = progress.results
    .filter((result) => result.status === 'success')
    .slice(-5);

  if (recentSuccesses.length > 0) {
    console.log('\n   Recent Successes:');
    recentSuccesses.forEach((r: { combination: { id: string } }) => {
      console.log(`   - ${r.combination.id}`);
    });
  }

  // Show failures
  const failures = progress.results.filter((result) => result.status === 'failed');

  if (failures.length > 0) {
    console.log('\n   ❌ Failed Combinations:');
    failures.forEach((r: { combination: { id: string }; exitCode?: number }) => {
      console.log(`   - ${r.combination.id} (exit code: ${r.exitCode})`);
    });
  }

  console.log('');
}

async function main() {
  console.log('🔍 Checking Ingestion Progress\n');
  console.log('='.repeat(80));

  try {
    await checkElasticsearch();
  } catch (err) {
    console.log(`\n❌ Could not connect to Elasticsearch: ${getErrorMessage(err)}`);
  }

  console.log('\n' + '='.repeat(80));
  checkProgressFile();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
