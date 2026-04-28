/**
 * Elasticsearch index metadata management.
 *
 * Provides functions to read and write index version metadata using
 * generated types from the SDK to ensure schema-first consistency.
 *
 * All functions use `Result<T, E>` pattern for explicit error handling.
 */

import { errors, type Client } from '@elastic/elasticsearch';
import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import { IndexMetaDocSchema } from '@oaknational/sdk-codegen/search';
import { ensureIndexMetaMappingContract } from './index-meta-mapping-contract.js';
import type { IndexMetaError } from './index-meta-types.js';
import { adminLogger } from '../logger';

export const INDEX_META_INDEX = 'oak_meta';
export const INDEX_VERSION_DOC_ID = 'index_version';

/**
 * Generates a version string from current timestamp.
 * Format: `v\{YYYY-MM-DD\}-\{HHmmss\}`
 */
export function generateVersionFromTimestamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toISOString().slice(11, 19).replace(/:/g, '');
  return `v${date}-${time}`;
}

/**
 * Check if error is a mapping exception.
 */
function isMappingException(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.message.includes('strict_dynamic_mapping_exception');
}

/**
 * Extract field name from mapping error message.
 */
function extractFieldFromMappingError(message: string | undefined): string {
  const fieldMatch = message?.match(/introduction of \[([^\]]+)\]/);
  return fieldMatch ? fieldMatch[1] : 'unknown';
}

/**
 * Create mapping error from ES exception.
 */
function createMappingError(error: unknown): IndexMetaError {
  const message = error instanceof Error ? error.message : String(error);
  const field = extractFieldFromMappingError(message);
  return {
    type: 'mapping_error',
    field,
    message: `Field '${field}' not in ES mapping. IndexMetaDoc must match OAK_META_MAPPING. ${message}`,
  };
}

/**
 * Check if error is a network error (5xx status).
 */
function isNetworkError(error: unknown): boolean {
  return (
    error instanceof errors.ResponseError &&
    error.statusCode !== undefined &&
    error.statusCode >= 500
  );
}

/**
 * Create network error from ES exception.
 */
function createNetworkError(error: unknown): IndexMetaError {
  const statusCode = error instanceof errors.ResponseError ? error.statusCode : undefined;
  const message = error instanceof Error ? error.message : String(error);
  return {
    type: 'network_error',
    message: `Elasticsearch network error (${statusCode ?? 'unknown'}): ${message}`,
  };
}

/**
 * Creates an IndexMetaError from an unknown exception.
 * Provides detailed error messages for common failure modes.
 */
export function createErrorFromException(error: unknown): IndexMetaError {
  if (isMappingException(error)) {
    return createMappingError(error);
  }

  if (isNetworkError(error)) {
    return createNetworkError(error);
  }

  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : String(error),
  };
}

/**
 * Type guard for Elasticsearch not-found errors.
 */
function isNotFoundError(error: unknown): boolean {
  return error instanceof errors.ResponseError && error.statusCode === 404;
}

/**
 * Reads the current index metadata from Elasticsearch.
 * Returns Ok(null) if no metadata exists.
 * Returns Err if there's a validation or network error.
 */
export async function readIndexMeta(
  client: Client,
): Promise<Result<IndexMetaDoc | null, IndexMetaError>> {
  adminLogger.debug('Reading index metadata document', { index: INDEX_META_INDEX });
  try {
    const response = await client.get<IndexMetaDoc>({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
    });

    if (!response._source) {
      return ok(null);
    }

    // Validate with generated schema
    const parseResult = IndexMetaDocSchema.safeParse(response._source);
    if (!parseResult.success) {
      return err({
        type: 'validation_error',
        message: 'Invalid metadata doc retrieved from Elasticsearch',
        details: parseResult.error.message,
      });
    }

    return ok(parseResult.data);
  } catch (error: unknown) {
    // Document not found is expected for fresh indexes
    if (isNotFoundError(error)) {
      return ok(null);
    }
    return err(createErrorFromException(error));
  }
}

/**
 * Writes index metadata to Elasticsearch.
 * Validates the document before writing to ensure schema compliance.
 * Returns Ok(void) on success, Err with details on failure.
 */
export async function writeIndexMeta(
  client: Client,
  meta: unknown,
): Promise<Result<void, IndexMetaError>> {
  adminLogger.debug('Writing index metadata document', { index: INDEX_META_INDEX });
  // Validate before writing
  const parseResult = IndexMetaDocSchema.safeParse(meta);
  if (!parseResult.success) {
    return err({
      type: 'validation_error',
      message: 'Invalid metadata document',
      details: parseResult.error.message,
    });
  }

  const mappingContractResult = await ensureIndexMetaMappingContract(client, INDEX_META_INDEX);
  if (!mappingContractResult.ok) {
    return mappingContractResult;
  }

  try {
    await client.index({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
      document: parseResult.data,
      refresh: true,
    });
    return ok(undefined);
  } catch (error: unknown) {
    return err(createErrorFromException(error));
  }
}
