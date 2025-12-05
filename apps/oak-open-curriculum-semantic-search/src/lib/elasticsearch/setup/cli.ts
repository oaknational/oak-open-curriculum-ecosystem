#!/usr/bin/env npx tsx
/**
 * @module cli
 * @description Elasticsearch setup CLI.
 * Creates synonyms set and all search indexes from SDK ontology data.
 * Loads configuration from .env.local in the app directory.
 */
/* eslint-disable max-statements, max-lines-per-function, complexity */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { runSetup, runReset, verifyConnection, listIndexes } from './index.js';
import { esClient } from '../../es-client.js';
import { readIndexMeta } from '../index-meta.js';
import { sandboxLogger, setLogLevel } from '../../logger';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  readonly command: 'setup' | 'reset' | 'status' | 'help';
  readonly verbose: boolean;
}

function parseArgs(args: readonly string[]): CliArgs {
  const verbose = args.includes('--verbose') || args.includes('-v');
  const commandArg = args.find((a) => !a.startsWith('-'));

  if (commandArg === 'status') {
    return { command: 'status', verbose };
  }
  if (commandArg === 'reset') {
    return { command: 'reset', verbose };
  }
  if (commandArg === 'help' || args.includes('--help') || args.includes('-h')) {
    return { command: 'help', verbose };
  }
  return { command: 'setup', verbose };
}

/** Prints CLI help text. Uses console.log as this is program output, not logging. */
function printHelp(): void {
  console.log(`
Elasticsearch Setup CLI

Usage:
  npx tsx src/lib/elasticsearch/setup/cli.ts [command] [options]

Commands:
  setup     Create synonyms and indexes (default)
  reset     Delete and recreate all indexes (for mapping changes)
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
    sandboxLogger.error('Missing environment variables', {
      error: 'ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set',
    });
    process.exitCode = 1;
    return;
  }

  const config = { elasticsearchUrl: esUrl, elasticsearchApiKey: esKey, verbose };

  sandboxLogger.info('Checking Elasticsearch connection');

  const connection = await verifyConnection(config);
  if (!connection.connected) {
    sandboxLogger.error('Connection failed', { error: connection.error });
    process.exitCode = 1;
    return;
  }

  sandboxLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  const indexes = await listIndexes(config);
  const oakIndexes = indexes.filter((idx) => idx.index.startsWith('oak_'));

  if (oakIndexes.length === 0) {
    sandboxLogger.info('No Oak indexes found', { action: 'Run setup to create them' });
    return;
  }

  sandboxLogger.info('Oak Indexes', {
    indexes: oakIndexes.map((idx) => ({
      name: idx.index,
      health: idx.health,
      docs: idx.docsCount,
    })),
  });

  // Show index metadata if available
  try {
    const client = esClient();
    const meta = await readIndexMeta(client);
    if (meta) {
      sandboxLogger.info('Index version metadata', {
        version: meta.version,
        lastIngestion: meta.timestamp,
        durationSeconds: meta.ingestionDuration,
        subjects: meta.subjects,
        keyStages: meta.keyStages,
      });
    }
  } catch {
    // No metadata available yet
  }
}

async function main(): Promise<void> {
  // Load environment from app directory
  const envResult = loadAppEnv(CURRENT_DIR);

  const args = parseArgs(process.argv.slice(2));

  // Set log level based on verbose flag
  if (args.verbose) {
    setLogLevel('DEBUG');
  }

  if (envResult.loaded) {
    sandboxLogger.debug('Environment loaded', { path: envResult.path });
  } else {
    sandboxLogger.debug('No .env.local found', { appRoot: envResult.appRoot });
  }

  if (args.command === 'help') {
    printHelp();
    return;
  }

  if (args.command === 'status') {
    await runStatus(args.verbose);
    return;
  }

  // Setup or reset command
  const esUrl = process.env.ELASTICSEARCH_URL;
  const esKey = process.env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esKey) {
    sandboxLogger.error('Missing environment variables', {
      error: 'ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set',
      hint: 'Create a .env.local file with these values in the app directory',
    });
    process.exitCode = 1;
    return;
  }

  const config = { elasticsearchUrl: esUrl, elasticsearchApiKey: esKey, verbose: true };

  // Verify connection first
  const connection = await verifyConnection(config);
  if (!connection.connected) {
    sandboxLogger.error('Connection failed', { error: connection.error });
    process.exitCode = 1;
    return;
  }

  sandboxLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  // Run setup or reset
  const result = args.command === 'reset' ? await runReset(config) : await runSetup(config);

  // Summary
  const created = result.indexResults.filter((r) => r.status === 'created').length;
  const exists = result.indexResults.filter((r) => r.status === 'exists').length;
  const errors = result.indexResults.filter((r) => r.status === 'error').length;

  sandboxLogger.info('Setup complete', {
    synonyms: result.synonymCount,
    indexes: { created, exists, errors },
  });

  if (errors > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  sandboxLogger.error('Fatal error', error instanceof Error ? error : undefined, {
    message: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
