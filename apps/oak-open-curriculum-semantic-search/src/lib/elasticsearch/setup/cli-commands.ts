/**
 * @module cli-commands
 * @description CLI command handlers for Elasticsearch setup.
 *
 * Handles execution of status, setup, and reset commands.
 */

import { verifyConnection, listIndexes, runSetup, runReset } from './index.js';
import { esClient } from '../../es-client.js';
import { readIndexMeta } from '../index-meta.js';
import { sandboxLogger } from '../../logger';

interface ElasticsearchConfig {
  readonly elasticsearchUrl: string;
  readonly elasticsearchApiKey: string;
  readonly verbose: boolean;
}

interface ConnectionResult {
  readonly connected: boolean;
  readonly clusterName?: string;
  readonly version?: string;
  readonly error?: string;
}

interface SetupResult {
  readonly synonymCount: number;
  readonly indexResults: readonly { status: string }[];
}

/**
 * Executes the status command.
 *
 * Shows Elasticsearch connection info, Oak indexes, and ingestion metadata.
 *
 * @param verbose - Enable verbose output
 * @returns Exit code (0 for success, 1 for failure)
 */
export async function executeStatusCommand(verbose: boolean): Promise<number> {
  const esUrl = process.env.ELASTICSEARCH_URL;
  const esKey = process.env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esKey) {
    sandboxLogger.error('Missing environment variables', {
      error: 'ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set',
    });
    return 1;
  }

  const config: ElasticsearchConfig = {
    elasticsearchUrl: esUrl,
    elasticsearchApiKey: esKey,
    verbose,
  };

  return executeStatus(config);
}

/**
 * Executes status check with the given configuration.
 *
 * @param config - Elasticsearch configuration
 * @returns Exit code (0 for success, 1 for failure)
 */
async function executeStatus(config: ElasticsearchConfig): Promise<number> {
  sandboxLogger.info('Checking Elasticsearch connection');

  const connection: ConnectionResult = await verifyConnection(config);
  if (!connection.connected) {
    sandboxLogger.error('Connection failed', { error: connection.error });
    return 1;
  }

  sandboxLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  const indexes = await listIndexes(config);
  const oakIndexes = indexes.filter((idx) => idx.index.startsWith('oak_'));

  if (oakIndexes.length === 0) {
    sandboxLogger.info('No Oak indexes found', { action: 'Run setup to create them' });
    return 0;
  }

  sandboxLogger.info('Oak Indexes', {
    indexes: oakIndexes.map((idx) => ({
      name: idx.index,
      health: idx.health,
      docs: idx.docsCount,
    })),
  });

  await logIndexMetadata();
  return 0;
}

/**
 * Logs index metadata if available.
 */
async function logIndexMetadata(): Promise<void> {
  try {
    const client = esClient();
    const meta = await readIndexMeta(client);
    if (meta.ok && meta.value) {
      sandboxLogger.info('Index version metadata', {
        version: meta.value.version,
        ingestedAt: meta.value.ingested_at,
        durationMs: meta.value.duration_ms,
        subjects: meta.value.subjects,
        keyStages: meta.value.key_stages,
      });
    }
  } catch {
    // No metadata available yet
  }
}

/**
 * Executes setup or reset command.
 *
 * @param command - Command to execute ('setup' or 'reset')
 * @returns Setup result or undefined if connection failed
 */
export async function executeSetupOrResetCommand(
  command: 'setup' | 'reset',
): Promise<SetupResult | undefined> {
  const esUrl = process.env.ELASTICSEARCH_URL;
  const esKey = process.env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esKey) {
    sandboxLogger.error('Missing environment variables', {
      error: 'ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set',
      hint: 'Create a .env.local file with these values in the app directory',
    });
    return undefined;
  }

  const config: ElasticsearchConfig = {
    elasticsearchUrl: esUrl,
    elasticsearchApiKey: esKey,
    verbose: true,
  };

  return executeSetupOrReset(config, command);
}

/**
 * Executes setup or reset with the given configuration.
 *
 * @param config - Elasticsearch configuration
 * @param command - Command to execute
 * @returns Setup result or undefined if connection failed
 */
async function executeSetupOrReset(
  config: ElasticsearchConfig,
  command: 'setup' | 'reset',
): Promise<SetupResult | undefined> {
  // Verify connection first
  const connection: ConnectionResult = await verifyConnection(config);
  if (!connection.connected) {
    sandboxLogger.error('Connection failed', { error: connection.error });
    return undefined;
  }

  sandboxLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  // Run setup or reset
  const result: SetupResult = command === 'reset' ? await runReset(config) : await runSetup(config);

  return result;
}
