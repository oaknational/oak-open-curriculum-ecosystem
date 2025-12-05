#!/usr/bin/env npx tsx
/**
 * Elasticsearch setup CLI.
 * Creates synonyms set and all search indexes from SDK ontology data.
 * Loads configuration from .env.local in the app directory.
 */
/* eslint-disable max-statements, max-lines-per-function, complexity */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { runSetup, verifyConnection, listIndexes } from './index.js';
import { esClient } from '../../es-client.js';
import { readIndexMeta } from '../index-meta.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  readonly command: 'setup' | 'status' | 'help';
  readonly verbose: boolean;
}

function parseArgs(args: readonly string[]): CliArgs {
  const verbose = args.includes('--verbose') || args.includes('-v');
  const commandArg = args.find((a) => !a.startsWith('-'));

  if (commandArg === 'status') {
    return { command: 'status', verbose };
  }
  if (commandArg === 'help' || args.includes('--help') || args.includes('-h')) {
    return { command: 'help', verbose };
  }
  return { command: 'setup', verbose };
}

function printHelp(): void {
  console.log(`
Elasticsearch Setup CLI

Usage:
  npx tsx src/lib/elasticsearch/setup/cli.ts [command] [options]

Commands:
  setup     Create synonyms and indexes (default)
  status    Show cluster info and index counts
  help      Show this help message

Options:
  -v, --verbose   Show detailed output

Environment:
  Reads ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY from .env.local
  in the app directory (apps/oak-open-curriculum-semantic-search/).
`);
}

async function runStatus(verbose: boolean): Promise<void> {
  const esUrl = process.env.ELASTICSEARCH_URL;
  const esKey = process.env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esKey) {
    console.error('Error: ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set');
    process.exitCode = 1;
    return;
  }

  const config = { elasticsearchUrl: esUrl, elasticsearchApiKey: esKey, verbose };

  console.log('Checking Elasticsearch connection...\n');

  const connection = await verifyConnection(config);
  if (!connection.connected) {
    console.error(`✗ Connection failed: ${connection.error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`✓ Connected to ${connection.clusterName} (v${connection.version})\n`);

  const indexes = await listIndexes(config);
  const oakIndexes = indexes.filter((idx) => idx.index.startsWith('oak_'));

  if (oakIndexes.length === 0) {
    console.log('No Oak indexes found. Run setup to create them.');
    return;
  }

  console.log('Oak Indexes:');
  console.log('─'.repeat(50));
  for (const idx of oakIndexes) {
    const healthIcon = idx.health === 'green' ? '●' : idx.health === 'yellow' ? '◐' : '○';
    console.log(`  ${healthIcon} ${idx.index.padEnd(25)} ${idx.docsCount.toLocaleString()} docs`);
  }

  // Show index metadata if available
  try {
    const client = esClient();
    const meta = await readIndexMeta(client);
    if (meta) {
      console.log('\nIndex Version Metadata:');
      console.log('─'.repeat(50));
      console.log(`  Version: ${meta.version}`);
      console.log(`  Last Ingestion: ${meta.timestamp}`);
      console.log(`  Duration: ${meta.ingestionDuration}s`);
      console.log(`  Subjects: ${meta.subjects.join(', ')}`);
      console.log(`  Key Stages: ${meta.keyStages.join(', ')}`);
    }
  } catch {
    // No metadata available yet
  }
}

async function main(): Promise<void> {
  // Load environment from app directory
  const envResult = loadAppEnv(CURRENT_DIR);
  if (envResult.loaded) {
    console.log(`Loaded env from: ${envResult.path}\n`);
  } else {
    console.log(`No .env.local found in ${envResult.appRoot}\n`);
  }

  const args = parseArgs(process.argv.slice(2));

  if (args.command === 'help') {
    printHelp();
    return;
  }

  if (args.command === 'status') {
    await runStatus(args.verbose);
    return;
  }

  // Setup command
  const esUrl = process.env.ELASTICSEARCH_URL;
  const esKey = process.env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esKey) {
    console.error('Error: ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set');
    console.error('Create a .env.local file with these values in the app directory.');
    process.exitCode = 1;
    return;
  }

  const config = { elasticsearchUrl: esUrl, elasticsearchApiKey: esKey, verbose: true };

  // Verify connection first
  const connection = await verifyConnection(config);
  if (!connection.connected) {
    console.error(`✗ Connection failed: ${connection.error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✓ Connected to ${connection.clusterName} (v${connection.version})\n`);

  // Run setup
  const result = await runSetup(config);

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log('Summary:');
  console.log(`  Synonyms: ${result.synonymCount} entries`);

  const created = result.indexResults.filter((r) => r.status === 'created').length;
  const exists = result.indexResults.filter((r) => r.status === 'exists').length;
  const errors = result.indexResults.filter((r) => r.status === 'error').length;

  console.log(`  Indexes: ${created} created, ${exists} already exist, ${errors} errors`);

  if (errors > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exitCode = 1;
});
