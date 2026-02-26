/**
 * CLI command handlers for Elasticsearch setup.
 *
 * All functions accept credentials as parameters — callers (CLI entry points)
 * are responsible for loading the environment via `loadRuntimeConfig()`.
 */

import { verifyConnection, listIndexes, runSetup, runReset, runSynonymsUpdate } from './index.js';
import { esClient } from '../../es-client.js';
import { readIndexMeta } from '../index-meta.js';
import { ingestLogger } from '../../logger';

/** Elasticsearch credentials required by all CLI commands. */
export interface ElasticsearchCredentials {
  readonly ELASTICSEARCH_URL: string;
  readonly ELASTICSEARCH_API_KEY: string;
}

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
 * @param credentials - Elasticsearch connection credentials
 * @param verbose - Enable verbose output
 * @returns Exit code (0 for success, 1 for failure)
 */
export async function executeStatusCommand(
  credentials: ElasticsearchCredentials,
  verbose: boolean,
): Promise<number> {
  const config: ElasticsearchConfig = {
    elasticsearchUrl: credentials.ELASTICSEARCH_URL,
    elasticsearchApiKey: credentials.ELASTICSEARCH_API_KEY,
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
  ingestLogger.info('Checking Elasticsearch connection');

  const connection: ConnectionResult = await verifyConnection(config);
  if (!connection.connected) {
    ingestLogger.error('Connection failed', { error: connection.error });
    return 1;
  }

  ingestLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  const indexes = await listIndexes(config);
  const oakIndexes = indexes.filter((idx) => idx.index.startsWith('oak_'));

  if (oakIndexes.length === 0) {
    ingestLogger.info('No Oak indexes found', { action: 'Run setup to create them' });
    return 0;
  }

  ingestLogger.info('Oak Indexes', {
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
      ingestLogger.info('Index version metadata', {
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
 * @param credentials - Elasticsearch connection credentials
 * @param command - Command to execute ('setup' or 'reset')
 * @returns Setup result or undefined if connection failed
 */
export async function executeSetupOrResetCommand(
  credentials: ElasticsearchCredentials,
  command: 'setup' | 'reset',
): Promise<SetupResult | undefined> {
  const config: ElasticsearchConfig = {
    elasticsearchUrl: credentials.ELASTICSEARCH_URL,
    elasticsearchApiKey: credentials.ELASTICSEARCH_API_KEY,
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
    ingestLogger.error('Connection failed', { error: connection.error });
    return undefined;
  }

  ingestLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  // Run setup or reset
  const result: SetupResult = command === 'reset' ? await runReset(config) : await runSetup(config);

  return result;
}

/**
 * Executes the synonyms update command.
 *
 * Updates the synonym set without touching indexes.
 * Uses the Elasticsearch Synonyms API for live updates.
 *
 * @param credentials - Elasticsearch connection credentials
 * @returns Exit code (0 for success, 1 for failure)
 */
export async function executeSynonymsCommand(
  credentials: ElasticsearchCredentials,
): Promise<number> {
  const config: ElasticsearchConfig = {
    elasticsearchUrl: credentials.ELASTICSEARCH_URL,
    elasticsearchApiKey: credentials.ELASTICSEARCH_API_KEY,
    verbose: true,
  };

  // Verify connection first
  const connection: ConnectionResult = await verifyConnection(config);
  if (!connection.connected) {
    ingestLogger.error('Connection failed', { error: connection.error });
    return 1;
  }

  ingestLogger.info('Connected to Elasticsearch', {
    cluster: connection.clusterName,
    version: connection.version,
  });

  // Update synonyms
  const result = await runSynonymsUpdate(config);

  if (!result.success) {
    ingestLogger.error('Synonym update failed', { error: result.error });
    return 1;
  }

  ingestLogger.info('Synonyms updated successfully', {
    count: result.count,
    note: 'Search analyzers reloaded automatically (no reindexing required)',
  });

  return 0;
}
