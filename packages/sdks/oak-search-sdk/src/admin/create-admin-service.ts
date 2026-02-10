/**
 * Admin service factory.
 *
 * @packageDocumentation
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import {
  OAK_LESSONS_MAPPING,
  OAK_UNIT_ROLLUP_MAPPING,
  OAK_UNITS_MAPPING,
  OAK_SEQUENCES_MAPPING,
  OAK_SEQUENCE_FACETS_MAPPING,
  OAK_THREADS_MAPPING,
  OAK_META_MAPPING,
} from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
import { buildElasticsearchSynonyms } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

import type { AdminService } from '../types/admin.js';
import type {
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IndexSetupResult,
} from '../types/admin-types.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';
import { createIndexResolver, INDEX_META_INDEX } from '../internal/index-resolver.js';
import { isResourceExistsError } from './es-error-guards.js';
import { runIngest } from './ingest.js';
import { readIndexMeta, writeIndexMeta } from './index-meta.js';

const SYNONYM_SET_ID = 'oak-syns';

const INDEX_DEFINITIONS = [
  { kind: 'lessons', mapping: OAK_LESSONS_MAPPING },
  { kind: 'unit_rollup', mapping: OAK_UNIT_ROLLUP_MAPPING },
  { kind: 'units', mapping: OAK_UNITS_MAPPING },
  { kind: 'sequences', mapping: OAK_SEQUENCES_MAPPING },
  { kind: 'sequence_facets', mapping: OAK_SEQUENCE_FACETS_MAPPING },
  { kind: 'threads', mapping: OAK_THREADS_MAPPING },
] as const;

/** Create the admin service implementation. */
export function createAdminService(
  esClient: Client,
  config: SearchSdkConfig,
  logger?: Logger,
): AdminService {
  const resolveIndex = createIndexResolver(config.indexTarget);

  return {
    setup: (options) => runSetup(esClient, resolveIndex, logger, options),
    reset: (options) => runReset(esClient, resolveIndex, logger, options),
    verifyConnection: () => verifyConnection(esClient),
    listIndexes: () => listIndexes(esClient),
    updateSynonyms: () => upsertSynonyms(esClient, logger),
    ingest: (options) => runIngest(esClient, resolveIndex, logger, options),
    getIndexMeta: () => readIndexMeta(esClient),
    setIndexMeta: (meta) => writeIndexMeta(esClient, meta),
  };
}

async function runSetup(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger: Logger | undefined,
  options?: SetupOptions,
): Promise<SetupResult> {
  const synonymResult = await upsertSynonyms(client, logger);
  const indexResults = await createAllIndexes(client, resolveIndex, logger, options);
  return {
    synonymsCreated: synonymResult.success,
    synonymCount: synonymResult.count,
    indexResults,
  };
}

async function runReset(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger: Logger | undefined,
  options?: SetupOptions,
): Promise<SetupResult> {
  await deleteAllIndexes(client, resolveIndex, logger);
  return runSetup(client, resolveIndex, logger, options);
}

async function createAllIndexes(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger: Logger | undefined,
  options?: SetupOptions,
): Promise<IndexSetupResult[]> {
  const results: IndexSetupResult[] = [];
  for (const def of INDEX_DEFINITIONS) {
    results.push(
      await createIndex(client, resolveIndex(def.kind), def.mapping, logger, options?.verbose),
    );
  }
  results.push(
    await createIndex(client, INDEX_META_INDEX, OAK_META_MAPPING, logger, options?.verbose),
  );
  return results;
}

async function deleteAllIndexes(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger?: Logger,
): Promise<void> {
  for (const def of INDEX_DEFINITIONS) {
    await safeDeleteIndex(client, resolveIndex(def.kind), logger);
  }
  await safeDeleteIndex(client, INDEX_META_INDEX, logger);
}

async function safeDeleteIndex(client: Client, indexName: string, logger?: Logger): Promise<void> {
  try {
    await client.indices.delete({ index: indexName });
    logger?.debug('Deleted index', { index: indexName });
  } catch {
    // Index may not exist
  }
}

async function createIndex(
  client: Client,
  indexName: string,
  mapping: unknown,
  logger: Logger | undefined,
  verbose?: boolean,
): Promise<IndexSetupResult> {
  try {
    const params = extractMappingParams(mapping);
    await client.indices.create({ index: indexName, ...params });
    if (verbose) {
      logger?.info('Created index', { index: indexName });
    }
    return { indexName, status: 'created' };
  } catch (error: unknown) {
    if (isResourceExistsError(error)) {
      return { indexName, status: 'exists' };
    }
    return {
      indexName,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function extractMappingParams(mapping: unknown): {
  settings?: estypes.IndicesIndexSettings;
  mappings?: estypes.MappingTypeMapping;
} {
  if (typeof mapping !== 'object' || mapping === null) {
    return {};
  }
  const result: { settings?: estypes.IndicesIndexSettings; mappings?: estypes.MappingTypeMapping } =
    {};
  if ('settings' in mapping && isPlainObject(mapping.settings)) {
    result.settings = mapping.settings;
  }
  if ('mappings' in mapping && isPlainObject(mapping.mappings)) {
    result.mappings = mapping.mappings;
  }
  return result;
}

function isPlainObject(
  value: unknown,
): value is estypes.IndicesIndexSettings & estypes.MappingTypeMapping {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function verifyConnection(client: Client): Promise<ConnectionStatus> {
  try {
    const info = await client.info();
    return { connected: true, clusterName: info.cluster_name, version: info.version.number };
  } catch (error: unknown) {
    return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function listIndexes(client: Client): Promise<readonly IndexInfo[]> {
  const response = await client.cat.indices({ format: 'json' });
  if (!Array.isArray(response)) {
    return [];
  }
  return response.map((entry) => ({
    index: typeof entry.index === 'string' ? entry.index : '',
    health: typeof entry.health === 'string' ? entry.health : 'unknown',
    docsCount: typeof entry['docs.count'] === 'string' ? parseInt(entry['docs.count'], 10) : 0,
  }));
}

async function upsertSynonyms(client: Client, logger?: Logger): Promise<SynonymsResult> {
  try {
    const synonymSet = buildElasticsearchSynonyms();
    await client.synonyms.putSynonym({
      id: SYNONYM_SET_ID,
      synonyms_set: [...synonymSet.synonyms_set],
    });
    logger?.debug('Upserted synonym set', {
      id: SYNONYM_SET_ID,
      count: synonymSet.synonyms_set.length,
    });
    return { success: true, count: synonymSet.synonyms_set.length };
  } catch (error: unknown) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
