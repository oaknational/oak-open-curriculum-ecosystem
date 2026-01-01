import type { SearchIndexKind } from '../search-index-target';
import { inferKindFromIndex } from './ingest-harness-ops';
import type { BulkOperations, BulkOperationEntry } from './bulk-operation-types';
import { isBulkIndexAction as isBulkIndexActionTyped } from './bulk-operation-types';

/**
 * Filter bulk operations to only include specified index kinds.
 * If no indexes are specified (empty array), returns all operations.
 *
 * @param operations - The bulk operations array (action, doc pairs)
 * @param allowedKinds - The index kinds to include, or empty array for all
 * @returns Filtered operations array
 */
export function filterOperationsByIndex(
  operations: BulkOperations,
  allowedKinds: readonly SearchIndexKind[],
): BulkOperations {
  if (allowedKinds.length === 0) {
    return [...operations];
  }

  const result: BulkOperationEntry[] = [];
  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    const doc = operations[i + 1];

    const indexName = getIndexFromAction(action);
    if (!indexName) {
      continue;
    }

    const kind = inferKindFromIndex(indexName);
    if (kind && allowedKinds.includes(kind)) {
      result.push(action);
      result.push(doc);
    }
  }

  return result;
}

/**
 * Extract index name from a bulk action.
 *
 * @param action - The bulk action object
 * @returns The index name, or null if not found
 */
function getIndexFromAction(action: BulkOperationEntry): string | null {
  if (!isBulkIndexActionTyped(action)) {
    return null;
  }
  return action.index._index;
}
