/**
 * Index metadata read/write using the Result pattern.
 *
 * @packageDocumentation
 */

import type { Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { IndexMetaDocSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { IndexMetaError } from '../types/admin-types.js';
import { INDEX_META_INDEX, INDEX_VERSION_DOC_ID } from '../internal/index-resolver.js';
import { isNotFoundError, isMappingError } from './es-error-guards.js';

/** Read index metadata from Elasticsearch. */
export async function readIndexMeta(
  client: Client,
): Promise<Result<IndexMetaDoc | null, IndexMetaError>> {
  try {
    const response = await client.get({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
    });
    const parsed = IndexMetaDocSchema.safeParse(response._source);
    if (!parsed.success) {
      return err({
        type: 'validation_error' as const,
        message: 'Index metadata validation failed',
        details: parsed.error.message,
      });
    }
    return ok(parsed.data);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return ok(null);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return err({ type: 'network_error' as const, message });
  }
}

/** Write index metadata to Elasticsearch. */
export async function writeIndexMeta(
  client: Client,
  meta: IndexMetaDoc,
): Promise<Result<void, IndexMetaError>> {
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
      return err({ type: 'mapping_error' as const, field: 'unknown', message });
    }
    return err({ type: 'network_error' as const, message });
  }
}
