/**
 * Handler for true parent document counts via the ES `_count` API.
 *
 * @remarks
 * The `_cat/indices` API reports inflated document counts for indexes
 * containing `semantic_text` fields because ELSER chunking creates
 * internal nested Lucene documents. The `_count` API returns the true
 * parent document count, which matches the number of documents indexed
 * by the ingestion pipeline.
 *
 * @see https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text-reference
 */

import type { AdminService, AdminError, IndexDocCount } from '@oaknational/oak-search-sdk/admin';
import type { Result } from '@oaknational/result';
import { adminLogger } from '../../lib/logger';

export type { IndexDocCount } from '@oaknational/oak-search-sdk/admin';

/**
 * Fetch true parent document counts for all known search indexes.
 *
 * Delegates to the SDK admin service so index resolution and Elasticsearch
 * access remain inside the SDK boundary (ADR-030).
 *
 * @param admin - Search SDK admin service
 * @returns Array of per-index counts, or an `AdminError` on failure
 *
 * @example
 * ```typescript
 * const result = await handleCount(sdk.admin);
 * if (result.ok) {
 *   for (const { kind, index, count } of result.value) {
 *     console.log(`${kind}: ${count} documents (${index})`);
 *   }
 * }
 * ```
 */
export async function handleCount(
  admin: Pick<AdminService, 'countDocs'>,
): Promise<Result<readonly IndexDocCount[], AdminError>> {
  adminLogger.debug('Handling admin count command', { capability: 'admin_count_docs' });
  return admin.countDocs();
}
