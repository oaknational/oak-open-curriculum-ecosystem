#!/usr/bin/env npx tsx
/** Live data ingestion CLI. Run with: pnpm es:ingest-live -- --subject history --keystage ks2 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { createOakSdkClient } from '../../../adapters/oak-adapter-sdk.js';
import {
  createCachedOakSdkClient,
  clearSdkCache,
  getSdkCacheStatus,
  type CachedOakClient,
} from '../../../adapters/oak-adapter-cached.js';
import { createSandboxHarness } from '../../indexing/sandbox-harness.js';
import { sandboxLogger } from '../../logger.js';
import { esClient } from '../../es-client.js';
import { writeIndexMeta, generateVersionFromTimestamp } from '../index-meta.js';
import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';

/** CLI logger with console output for immediate feedback */
function cliLog(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${message}`);
}

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

/** Available key stages */
const ALL_KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;

/** Common subjects for testing */
const COMMON_SUBJECTS = ['maths', 'english', 'science', 'history', 'geography'] as const;

function isKeyStage(value: string): value is KeyStage {
  return ALL_KEY_STAGES.includes(value as KeyStage);
}

function isSearchSubject(value: string): value is SearchSubjectSlug {
  // Accept any non-empty string as SDK accepts dynamic subjects
  return value.length > 0;
}

interface CliArgs {
  readonly subjects: SearchSubjectSlug[];
  readonly keyStages: KeyStage[];
  readonly dryRun: boolean;
  readonly verbose: boolean;
  readonly help: boolean;
  readonly clearCache: boolean;
}

function parseArgs(args: readonly string[]): CliArgs {
  const subjects: SearchSubjectSlug[] = [];
  const keyStages: KeyStage[] = [];
  const flags = { dryRun: false, verbose: false, help: false, clearCache: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    i += handleArg(arg, nextArg, subjects, keyStages, flags);
  }

  return {
    subjects: subjects.length > 0 ? subjects : [...COMMON_SUBJECTS],
    keyStages: keyStages.length > 0 ? keyStages : [...ALL_KEY_STAGES],
    ...flags,
  };
}

/* eslint-disable complexity */
function handleArg(
  arg: string,
  nextArg: string | undefined,
  subjects: SearchSubjectSlug[],
  keyStages: KeyStage[],
  flags: { dryRun: boolean; verbose: boolean; help: boolean; clearCache: boolean },
): number {
  if (arg === '--help' || arg === '-h') {
    flags.help = true;
    return 0;
  }
  if (arg === '--dry-run') {
    flags.dryRun = true;
    return 0;
  }
  if (arg === '--verbose' || arg === '-v') {
    flags.verbose = true;
    return 0;
  }
  if (arg === '--clear-cache') {
    flags.clearCache = true;
    return 0;
  }
  if (arg === '--subject' && nextArg) {
    if (!isSearchSubject(nextArg)) {
      throw new Error(`Invalid subject: ${nextArg}`);
    }
    subjects.push(nextArg);
    return 1;
  }
  if (arg === '--keystage' && nextArg) {
    if (!isKeyStage(nextArg)) {
      throw new Error(`Invalid key stage: ${nextArg}. Valid values: ${ALL_KEY_STAGES.join(', ')}`);
    }
    keyStages.push(nextArg);
    return 1;
  }
  return 0;
}
/* eslint-enable complexity */

function printHelp(): void {
  console.log(`
Live Data Ingestion CLI

Usage:
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts [options]

Options:
  --subject <slug>    Subject to ingest (can repeat, defaults to common subjects)
  --keystage <ks>     Key stage to ingest (can repeat, defaults to all)
  --dry-run           Preview what would be ingested without writing to ES
  --clear-cache       Clear SDK response cache before ingestion
  --verbose, -v       Show detailed output
  --help, -h          Show this help message

Examples:
  # Ingest history for KS2 (small, good for testing)
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts --subject history --keystage ks2

  # Ingest all common subjects for all key stages
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts

  # Dry run for maths with fresh cache
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts --subject maths --dry-run --clear-cache

Environment:
  Requires ELASTICSEARCH_URL, ELASTICSEARCH_API_KEY, and OAK_API_KEY
  in .env.local in the app directory.

Caching:
  SDK responses can be cached in Redis to speed up repeated runs.
  Set SDK_CACHE_ENABLED=true and ensure Redis is running (docker compose up -d).
  See docs/SDK-CACHING.md for full documentation.

Note:
  Live ingestion makes many API calls and can take several minutes.
  Start with a single subject to test your setup.
`);
}

function printHeader(args: CliArgs): void {
  console.log('Live Data Ingestion');
  console.log('─'.repeat(50));
  console.log(`Key Stages: ${args.keyStages.join(', ')}`);
  console.log(`Subjects: ${args.subjects.join(', ')}`);
  console.log(`Dry Run: ${args.dryRun}`);
  console.log('─'.repeat(50));
  console.log('');
}

interface IngestionResult {
  readonly summary: {
    readonly totalDocs: number;
    readonly counts: {
      readonly lessons: number;
      readonly units: number;
      readonly unit_rollup: number;
      readonly sequences: number;
      readonly sequence_facets: number;
    };
  };
}

function printSummary(result: IngestionResult, duration: string): void {
  console.log('\n' + '─'.repeat(50));
  console.log('Summary:');
  console.log(`  Total documents: ${result.summary.totalDocs}`);
  console.log(`  Lessons: ${result.summary.counts.lessons}`);
  console.log(`  Units: ${result.summary.counts.units}`);
  console.log(`  Unit Rollups: ${result.summary.counts.unit_rollup}`);
  console.log(`  Sequences: ${result.summary.counts.sequences}`);
  console.log(`  Sequence Facets: ${result.summary.counts.sequence_facets}`);
  console.log(`  Duration: ${duration}s`);
}

async function writeMetadata(
  args: CliArgs,
  result: IngestionResult,
  duration: string,
): Promise<void> {
  const version = generateVersionFromTimestamp();
  console.log(`\n  Writing index metadata (version: ${version})...`);
  const client = esClient();
  await writeIndexMeta(client, {
    version,
    timestamp: new Date().toISOString(),
    docCounts: result.summary.counts,
    ingestionDuration: parseFloat(duration),
    subjects: args.subjects,
    keyStages: args.keyStages,
  });
  console.log('  Index metadata written successfully.');
}

function initEnv(): boolean {
  const envResult = loadAppEnv(CURRENT_DIR);
  if (!envResult.loaded) {
    console.error(`No .env.local found in ${envResult.appRoot}`);
    process.exitCode = 1;
    return false;
  }
  console.log(`Loaded env from: ${envResult.path}\n`);
  return true;
}

async function runIngestion(args: CliArgs): Promise<void> {
  printHeader(args);

  // Handle cache clearing if requested
  if (args.clearCache) {
    cliLog('Clearing SDK response cache...');
    const deleted = await clearSdkCache();
    cliLog(`Cleared ${deleted} cached entries`);
  }

  // Check cache status and create appropriate client
  cliLog('Creating Oak SDK client...');
  const cacheStatus = await getSdkCacheStatus();
  let client: CachedOakClient;

  if (cacheStatus.enabled && cacheStatus.connected) {
    client = await createCachedOakSdkClient();
    cliLog(`SDK client created with Redis caching (${cacheStatus.keyCount} cached entries)`);
  } else {
    // Use uncached client wrapped as CachedOakClient
    const baseClient = createOakSdkClient();
    client = {
      ...baseClient,
      getCacheStats: () => ({ hits: 0, misses: 0, connected: false }),
      disconnect: async () => {},
    };
    if (cacheStatus.enabled) {
      cliLog('SDK client created (cache enabled but Redis not available)');
    } else {
      cliLog('SDK client created (caching disabled)');
    }
  }

  cliLog('Creating ingestion harness...');
  cliLog(`  Subjects: ${args.subjects.join(', ')}`);
  cliLog(`  Key stages: ${args.keyStages.join(', ')}`);

  const harness = await createSandboxHarness({
    client,
    keyStages: args.keyStages,
    subjects: args.subjects,
    target: 'primary',
    logger: sandboxLogger,
  });
  cliLog('Harness created successfully');

  cliLog(args.dryRun ? 'Starting DRY RUN (no ES writes)...' : 'Starting LIVE ingestion...');
  cliLog('This may take several minutes - fetching data from Oak API...\n');

  const startTime = Date.now();
  const result = await harness.ingest({ dryRun: args.dryRun, verbose: args.verbose });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  cliLog(`Ingestion phase complete in ${duration}s`);

  printSummary(result, duration);

  // Print cache statistics
  const cacheStats = client.getCacheStats();
  if (cacheStats.connected) {
    console.log(`  Cache: ${cacheStats.hits} hits, ${cacheStats.misses} misses`);
  }

  if (args.dryRun) {
    console.log('\n  (Dry run - no documents written to ES)');
  } else {
    await writeMetadata(args, result, duration);
  }

  // Clean up Redis connection
  await client.disconnect();
}

async function main(): Promise<void> {
  if (!initEnv()) return;
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  await runIngestion(args);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exitCode = 1;
});
