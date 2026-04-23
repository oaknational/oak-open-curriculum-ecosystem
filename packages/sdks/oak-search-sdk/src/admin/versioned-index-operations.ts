/**
 * Versioned index listing and deletion utilities.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type { SearchIndexTarget } from '../internal/index.js';
import { TARGET_SUFFIXES } from '../internal/index.js';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { isNotFoundError } from './es-error-guards.js';

/**
 * List all versioned indexes matching a base name and target.
 *
 * @param client - Elasticsearch client
 * @param baseName - Base index name (for example `oak_lessons`)
 * @param target - Index target (`primary` or `sandbox`)
 * @returns Sorted array of matching versioned index names
 */
export async function listVersionedIndexes(
  client: Client,
  baseName: string,
  target: SearchIndexTarget,
  logger?: Logger,
): Promise<Result<readonly string[], AdminError>> {
  const prefix = `${baseName}${TARGET_SUFFIXES[target]}_v`;
  logger?.debug('Listing versioned indexes', { baseName, target });

  try {
    const response = await client.indices.get({ index: `${prefix}*` });
    return ok(typeSafeKeys(response).sort());
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return ok([]);
    }
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Failed to list versioned indexes: ${message}` });
  }
}

/**
 * Delete a single versioned index. Treats 404 as success.
 *
 * @param client - Elasticsearch client
 * @param indexName - The versioned index name to delete
 * @returns `ok` on success (including 404), `err` for other failures
 */
export async function deleteVersionedIndex(
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<Result<void, AdminError>> {
  logger?.info('Deleting versioned index', { indexName });
  try {
    await client.indices.delete({ index: indexName });
    return ok(undefined);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return ok(undefined);
    }
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Failed to delete index ${indexName}: ${message}` });
  }
}
