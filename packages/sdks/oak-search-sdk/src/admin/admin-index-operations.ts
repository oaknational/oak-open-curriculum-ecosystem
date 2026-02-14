/**
 * Admin index operations — create, delete, and mapping extraction.
 *
 * Encapsulates the bulk index lifecycle operations (create all,
 * delete all) and the low-level helpers for individual index
 * creation, deletion, and mapping parameter extraction.
 *
 * Used by `createAdminService` for `setup()` and `reset()` flows.
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import { ok, err, type Result } from '@oaknational/result';
import {
  OAK_LESSONS_MAPPING,
  OAK_UNIT_ROLLUP_MAPPING,
  OAK_UNITS_MAPPING,
  OAK_SEQUENCES_MAPPING,
  OAK_SEQUENCE_FACETS_MAPPING,
  OAK_THREADS_MAPPING,
  OAK_META_MAPPING,
} from '@oaknational/curriculum-sdk/elasticsearch.js';

import type { AdminError, IndexSetupResult, SetupOptions } from '../types/admin-types.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';
import { INDEX_META_INDEX } from '../internal/index-resolver.js';
import { isResourceExistsError, isNotFoundError } from './es-error-guards.js';

/**
 * Index definitions for all curriculum content types.
 *
 * Maps each index kind to its Elasticsearch mapping definition
 * from the curriculum SDK. The meta index is handled separately
 * because it uses a fixed name rather than the resolver.
 */
const INDEX_DEFINITIONS = [
  { kind: 'lessons' as const, mapping: OAK_LESSONS_MAPPING },
  { kind: 'unit_rollup' as const, mapping: OAK_UNIT_ROLLUP_MAPPING },
  { kind: 'units' as const, mapping: OAK_UNITS_MAPPING },
  { kind: 'sequences' as const, mapping: OAK_SEQUENCES_MAPPING },
  { kind: 'sequence_facets' as const, mapping: OAK_SEQUENCE_FACETS_MAPPING },
  { kind: 'threads' as const, mapping: OAK_THREADS_MAPPING },
] as const;

/**
 * Convert an unknown caught error into an `AdminError`.
 *
 * @param error - The caught error value
 * @returns A typed `AdminError` with `es_error` type
 */
function toAdminError(error: unknown): AdminError {
  const message = error instanceof Error ? error.message : String(error);
  return { type: 'es_error', message };
}

/**
 * Create all curriculum indexes and the meta index.
 *
 * Iterates through every index definition, creating each one
 * idempotently (existing indexes are reported as `exists` rather
 * than causing an error). The meta index is created last.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Resolves index kind to concrete index name
 * @param logger - Optional logger for debug output
 * @param options - Setup options (e.g. verbose logging)
 * @returns Array of results, one per index, with status of created/exists/error
 */
export async function createAllIndexes(
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

/**
 * Delete all curriculum indexes and the meta index.
 *
 * Deletes each index in sequence. A 404 (index not found) is treated
 * as success — deleting a non-existent index is not an error.
 * Returns early on the first real failure.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Resolves index kind to concrete index name
 * @param logger - Optional logger for debug output
 * @returns Ok on success, or the first AdminError encountered
 */
export async function deleteAllIndexes(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger?: Logger,
): Promise<Result<void, AdminError>> {
  for (const def of INDEX_DEFINITIONS) {
    const result = await safeDeleteIndex(client, resolveIndex(def.kind), logger);
    if (!result.ok) {
      return result;
    }
  }
  return safeDeleteIndex(client, INDEX_META_INDEX, logger);
}

/**
 * Delete an index if it exists; treat 404 as success.
 *
 * This is the correct semantics for a "delete if exists" operation:
 * the goal is for the index to not exist afterwards, which is
 * already true if it doesn't exist now.
 *
 * @param client - Elasticsearch client
 * @param indexName - Concrete index name to delete
 * @param logger - Optional logger for debug output
 * @returns Ok on success (including not-found), or AdminError
 */
async function safeDeleteIndex(
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<Result<void, AdminError>> {
  try {
    await client.indices.delete({ index: indexName });
    logger?.debug('Deleted index', { index: indexName });
    return ok(undefined);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return ok(undefined);
    }
    return err(toAdminError(error));
  }
}

/**
 * Create a single index with the given mapping.
 *
 * Extracts settings and mappings from the curriculum mapping object,
 * then calls the Elasticsearch create index API. If the index already
 * exists, reports `exists` status rather than failing.
 *
 * @param client - Elasticsearch client
 * @param indexName - Concrete index name to create
 * @param mapping - Curriculum mapping object (settings + mappings)
 * @param logger - Optional logger for verbose output
 * @param verbose - Whether to log creation events
 * @returns IndexSetupResult with created/exists/error status
 */
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

/**
 * Extract settings and mappings from a curriculum mapping object.
 *
 * Curriculum SDK mapping exports are plain objects with optional
 * `settings` and `mappings` properties. This function safely
 * extracts those properties with proper Elasticsearch types.
 *
 * @param mapping - Raw mapping object from the curriculum SDK
 * @returns Object with optional settings and mappings properties
 */
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

/**
 * Type guard for plain objects (non-null, non-array).
 *
 * Used to safely narrow unknown mapping properties to
 * Elasticsearch settings and mapping types.
 *
 * @param value - Value to check
 * @returns True if value is a non-null, non-array object
 */
function isPlainObject(
  value: unknown,
): value is estypes.IndicesIndexSettings & estypes.MappingTypeMapping {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
