/**
 * Admin service factory.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import { buildElasticsearchSynonyms } from '@oaknational/sdk-codegen/synonyms';

import type { AdminService } from '../types/admin.js';
import type {
  AdminError,
  SetupResult,
  ConnectionStatus,
  IndexInfo,
  IndexDocCount,
  SynonymsResult,
} from '../types/admin-types.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import {
  createIndexResolver,
  SEARCH_INDEX_KINDS,
  type IndexResolverFn,
} from '../internal/index-resolver.js';
import { readIndexMeta, writeIndexMeta } from './index-meta.js';
import { createAllIndexes, deleteAllIndexes } from './admin-index-operations.js';
import { verifyDocCounts } from './verify-doc-counts.js';

/**
 * Convert an unknown caught error into an `AdminError`.
 *
 * @param error - The caught error value
 * @returns A typed `AdminError` discriminated union member
 */
function toAdminError(error: unknown): AdminError {
  const message = error instanceof Error ? error.message : String(error);
  return { type: 'es_error', message };
}

/** Elasticsearch synonym set identifier used for upsert operations. */
const SYNONYM_SET_ID = 'oak-syns';

/**
 * Create the admin service implementation.
 *
 * @param esClient - Elasticsearch client for all admin operations
 * @param config - SDK configuration (index target, version, etc.)
 * @param logger - Optional structured logger for debug/info output
 * @returns AdminService with setup, reset, verifyConnection, listIndexes, updateSynonyms, getIndexMeta, setIndexMeta, verifyDocCounts
 *
 * @example
 * ```typescript
 * const admin = createAdminService(esClient, config, logger);
 * const result = await admin.setup();
 * ```
 */
export function createAdminService(
  esClient: Client,
  config: SearchSdkConfig,
  logger?: Logger,
): AdminService {
  const resolveIndex = createIndexResolver(config.indexTarget);

  return {
    setup: () => runSetup(esClient, resolveIndex, logger),
    reset: () => runReset(esClient, resolveIndex, logger),
    verifyConnection: () => verifyConnection(esClient),
    listIndexes: () => listIndexes(esClient),
    updateSynonyms: () => upsertSynonyms(esClient, logger),
    getIndexMeta: () => readIndexMeta(esClient),
    setIndexMeta: (meta) => writeIndexMeta(esClient, meta),
    verifyDocCounts: (expectations) => verifyDocCounts(esClient, resolveIndex, expectations),
    countDocs: () => countDocs(esClient, resolveIndex),
  };
}

/**
 * Run setup: create synonyms and all indexes.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with synonyms count and index results
 */
async function runSetup(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger: Logger | undefined,
): Promise<Result<SetupResult, AdminError>> {
  try {
    const synonymResult = await upsertSynonyms(client, logger);
    if (!synonymResult.ok) {
      return synonymResult;
    }
    const indexResults = await createAllIndexes(client, resolveIndex, logger);
    return ok({
      synonymsCreated: true,
      synonymCount: synonymResult.value.count,
      indexResults,
    });
  } catch (error: unknown) {
    return err(toAdminError(error));
  }
}

/**
 * Run reset: delete all indexes, then run setup.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with synonyms count and index results
 */
async function runReset(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger: Logger | undefined,
): Promise<Result<SetupResult, AdminError>> {
  try {
    const deleteResult = await deleteAllIndexes(client, resolveIndex, logger);
    if (!deleteResult.ok) {
      return deleteResult;
    }
    return runSetup(client, resolveIndex, logger);
  } catch (error: unknown) {
    return err(toAdminError(error));
  }
}

/**
 * Verify Elasticsearch cluster connection and return cluster info.
 *
 * @param client - Elasticsearch client
 * @returns Result with cluster name and version, or AdminError
 */
async function verifyConnection(client: Client): Promise<Result<ConnectionStatus, AdminError>> {
  try {
    const info = await client.info();
    return ok({ clusterName: info.cluster_name, version: info.version.number });
  } catch (error: unknown) {
    return err(toAdminError(error));
  }
}

/**
 * List all indexes with health and doc count.
 *
 * @param client - Elasticsearch client
 * @returns Result with array of index info, or AdminError
 */
async function listIndexes(client: Client): Promise<Result<readonly IndexInfo[], AdminError>> {
  try {
    const response = await client.cat.indices({ format: 'json' });
    if (!Array.isArray(response)) {
      return ok([]);
    }
    return ok(
      response.map((entry) => ({
        index: typeof entry.index === 'string' ? entry.index : '',
        health: typeof entry.health === 'string' ? entry.health : 'unknown',
        docsCount: typeof entry['docs.count'] === 'string' ? parseInt(entry['docs.count'], 10) : 0,
      })),
    );
  } catch (error: unknown) {
    return err(toAdminError(error));
  }
}

/**
 * Fetch true parent document counts for all known search indexes.
 *
 * Uses Elasticsearch `_count` which excludes nested Lucene documents
 * created by `semantic_text` field chunking.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Index name resolver
 * @returns Per-index parent document counts
 */
async function countDocs(
  client: Client,
  resolveIndex: IndexResolverFn,
): Promise<Result<readonly IndexDocCount[], AdminError>> {
  try {
    const counts = await Promise.all(
      SEARCH_INDEX_KINDS.map(async (kind) => {
        const index = resolveIndex(kind);
        const response = await client.count({ index });
        return { kind, index, count: response.count } satisfies IndexDocCount;
      }),
    );
    return ok(counts);
  } catch (error: unknown) {
    return err(toAdminError(error));
  }
}

/**
 * Upsert the curriculum synonym set into Elasticsearch.
 *
 * @param client - Elasticsearch client
 * @param logger - Optional logger for debug output
 * @returns Result with synonym count
 */
async function upsertSynonyms(
  client: Client,
  logger?: Logger,
): Promise<Result<SynonymsResult, AdminError>> {
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
    return ok({ count: synonymSet.synonyms_set.length });
  } catch (error: unknown) {
    return err(toAdminError(error));
  }
}
