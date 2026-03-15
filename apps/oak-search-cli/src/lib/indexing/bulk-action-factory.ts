/** Factory for creating Elasticsearch bulk `index` action metadata. */
import type { BulkIndexAction } from './bulk-operation-types';

/**
 * Create a bulk index action for a document.
 *
 * @remarks
 * Legacy incremental/create-mode behavior has been removed. Ingestion uses
 * deterministic overwrite semantics through the `index` action only.
 */
export function createBulkAction(indexName: string, documentId: string): BulkIndexAction {
  return { index: { _index: indexName, _id: documentId } };
}
