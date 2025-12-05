#!/usr/bin/env npx tsx
/** Live data ingestion CLI. Run with: pnpm es:ingest-live -- --subject history --keystage ks2 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { createOakSdkClient } from '../../../adapters/oak-adapter-sdk.js';
import { createSandboxHarness } from '../../indexing/sandbox-harness.js';
import { sandboxLogger } from '../../logger.js';
import { esClient } from '../../es-client.js';
import { writeIndexMeta, generateVersionFromTimestamp } from '../index-meta.js';
import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';

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
}

function parseArgs(args: readonly string[]): CliArgs {
  const subjects: SearchSubjectSlug[] = [];
  const keyStages: KeyStage[] = [];
  const flags = { dryRun: false, verbose: false, help: false };

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
  flags: { dryRun: boolean; verbose: boolean; help: boolean },
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
  --verbose, -v       Show detailed output
  --help, -h          Show this help message

Examples:
  # Ingest history for KS2 (small, good for testing)
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts --subject history --keystage ks2

  # Ingest all common subjects for all key stages
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts

  # Dry run for maths
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts --subject maths --dry-run

Environment:
  Requires ELASTICSEARCH_URL, ELASTICSEARCH_API_KEY, and OAK_API_KEY
  in .env.local in the app directory.

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
  console.log('Creating Oak SDK client...');
  const client = createOakSdkClient();

  console.log('Creating ingestion harness...');
  const harness = await createSandboxHarness({
    client,
    keyStages: args.keyStages,
    subjects: args.subjects,
    target: 'primary',
    logger: sandboxLogger,
  });

  console.log(args.dryRun ? 'Running dry run...' : 'Starting ingestion...\n');
  const startTime = Date.now();
  const result = await harness.ingest({ dryRun: args.dryRun, verbose: args.verbose });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  printSummary(result, duration);
  if (args.dryRun) {
    console.log('\n  (Dry run - no documents written to ES)');
  } else {
    await writeMetadata(args, result, duration);
  }
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
