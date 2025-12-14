/**
 * Elasticsearch index metadata management.
 *
 * Provides functions to read and write index version metadata using
 * generated types from the SDK to ensure schema-first consistency.
 *
 * All functions use Result<T, E> pattern for explicit error handling.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { IndexMetaDocSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';

export const INDEX_META_INDEX = 'oak_meta';
export const INDEX_VERSION_DOC_ID = 'index_version';

/**
 * Errors that can occur during index metadata operations.
 */
export type IndexMetaError =
  | { readonly type: 'not_found' }
  | { readonly type: 'network_error'; readonly message: string }
  | { readonly type: 'mapping_error'; readonly field: string; readonly message: string }
  | { readonly type: 'validation_error'; readonly message: string; readonly details: string }
  | { readonly type: 'unknown'; readonly message: string };

/**
 * Generates a version string from current timestamp.
 * Format: v{YYYY-MM-DD}-{HHmmss}
 */
export function generateVersionFromTimestamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toISOString().slice(11, 19).replace(/:/g, '');
  return `v${date}-${time}`;
}

/**
 * ES error structure extracted from exception.
 */
interface EsErrorLike {
  message?: string;
  meta?: { statusCode?: number; body?: { error?: { type?: string } } };
}

/**
 * Check if error is an ES object error.
 */
function isEsError(error: unknown): error is EsErrorLike {
  return typeof error === 'object' && error !== null;
}

/**
 * Check if error is a mapping exception.
 */
function isMappingException(err: EsErrorLike): boolean {
  return (
    err.message?.includes('strict_dynamic_mapping_exception') === true ||
    err.meta?.body?.error?.type === 'strict_dynamic_mapping_exception'
  );
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
function createMappingError(err: EsErrorLike): IndexMetaError {
  const field = extractFieldFromMappingError(err.message);
  return {
    type: 'mapping_error',
    field,
    message: `Field '${field}' not in ES mapping. IndexMetaDoc must match OAK_META_MAPPING. ${err.message ?? ''}`,
  };
}

/**
 * Check if error is a network error (5xx status).
 */
function isNetworkError(err: EsErrorLike): boolean {
  return err.meta?.statusCode !== undefined && err.meta.statusCode >= 500;
}

/**
 * Create network error from ES exception.
 */
function createNetworkError(err: EsErrorLike): IndexMetaError {
  return {
    type: 'network_error',
    message: `Elasticsearch network error (${err.meta?.statusCode ?? 'unknown'}): ${err.message ?? 'Unknown error'}`,
  };
}

/**
 * Creates an IndexMetaError from an unknown exception.
 * Provides detailed error messages for common failure modes.
 */
export function createErrorFromException(error: unknown): IndexMetaError {
  if (!isEsError(error)) {
    return {
      type: 'unknown',
      message: String(error),
    };
  }

  if (isMappingException(error)) {
    return createMappingError(error);
  }

  if (isNetworkError(error)) {
    return createNetworkError(error);
  }

  return {
    type: 'unknown',
    message: error.message ?? String(error),
  };
}

/**
 * Type guard for Elasticsearch not-found errors.
 */
function isNotFoundError(error: unknown): boolean {
  if (!isEsError(error)) {
    return false;
  }
  return error.meta?.statusCode === 404;
}

/**
 * Reads the current index metadata from Elasticsearch.
 * Returns Ok(null) if no metadata exists.
 * Returns Err if there's a validation or network error.
 */
export async function readIndexMeta(
  client: Client,
): Promise<Result<IndexMetaDoc | null, IndexMetaError>> {
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
  meta: IndexMetaDoc,
): Promise<Result<void, IndexMetaError>> {
  // Validate before writing
  const parseResult = IndexMetaDocSchema.safeParse(meta);
  if (!parseResult.success) {
    return err({
      type: 'validation_error',
      message: 'Invalid metadata document',
      details: parseResult.error.message,
    });
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

/**
 * Gets the current index version, or a fallback if none exists.
 * This is the function apps should use to get the version for cache keys.
 *
 * Note: This function unwraps the Result and throws on error for backwards
 * compatibility. New code should use readIndexMeta directly.
 */
export async function getIndexVersion(client: Client): Promise<string> {
  const result = await readIndexMeta(client);
  if (!result.ok) {
    const errorMsg =
      result.error.type === 'not_found' ? 'Index metadata not found' : result.error.message;
    throw new Error(`Failed to read index version: ${errorMsg}`);
  }
  if (result.value) {
    return result.value.version;
  }
  // Fallback to timestamp-based version if no metadata exists
  return generateVersionFromTimestamp();
}
