/**
 * Index metadata read/write using the Result pattern.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import { IndexMetaDocSchema } from '@oaknational/sdk-codegen/search';

import type { AdminError } from '../types/admin-types.js';
import { INDEX_META_INDEX, INDEX_VERSION_DOC_ID } from '../internal/index-resolver.js';
import { isNotFoundError, isMappingError } from './es-error-guards.js';
import { ensureIndexMetaMappingContract } from './index-meta-mapping-contract.js';

/** Build a validation_error AdminError. */
function toValidationError(message: string, details?: string): AdminError {
  return { type: 'validation_error', message, details };
}

/** Build an es_error AdminError. */
function toEsError(message: string): AdminError {
  return { type: 'es_error', message };
}

/** Build a mapping_error AdminError. */
function toMappingError(message: string, field?: string): AdminError {
  return { type: 'mapping_error', message, field };
}

/**
 * Read index metadata from Elasticsearch.
 *
 * @param client - Elasticsearch client
 * @returns Result with IndexMetaDoc or null if not found, or AdminError
 *
 * @example
 * ```typescript
 * const result = await readIndexMeta(esClient);
 * if (result.ok) {
 *   console.log(result.value?.indexVersion);
 * }
 * ```
 */
export async function readIndexMeta(
  client: Client,
  logger?: Logger,
): Promise<Result<IndexMetaDoc | null, AdminError>> {
  logger?.debug('Reading search index metadata');
  try {
    const response = await client.get({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
    });
    const parsed = IndexMetaDocSchema.safeParse(response._source);
    if (!parsed.success) {
      return err(toValidationError('Index metadata validation failed', parsed.error.message));
    }
    return ok(parsed.data);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return ok(null);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return err(toEsError(message));
  }
}

/**
 * Write index metadata to Elasticsearch.
 *
 * @param client - Elasticsearch client
 * @param meta - Index metadata document to write
 * @returns Result; err on validation or ES failure
 *
 * @example
 * ```typescript
 * const result = await writeIndexMeta(esClient, {
 *   indexVersion: 'v1',
 *   lastIngestedAt: new Date().toISOString(),
 * });
 * ```
 */
export async function writeIndexMeta(
  client: Client,
  meta: IndexMetaDoc,
  logger?: Logger,
): Promise<Result<void, AdminError>> {
  logger?.info('Writing search index metadata', {
    version: meta.version,
    previousVersion: meta.previous_version,
  });
  const mappingResult = await ensureIndexMetaMappingContract(client, INDEX_META_INDEX, logger);
  if (!mappingResult.ok) {
    return mappingResult;
  }

  try {
    await client.index({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
      document: meta,
    });
    return ok(undefined);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (isMappingError(error)) {
      return err(toMappingError(message, 'unknown'));
    }
    return err(toEsError(message));
  }
}
