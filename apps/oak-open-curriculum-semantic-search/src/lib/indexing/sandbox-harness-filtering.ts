import type { SearchIndexKind } from '../search-index-target';
import { inferKindFromIndex } from './sandbox-harness-ops';

/**
 * Filter bulk operations to only include specified index kinds.
 * If no indexes are specified (empty array), returns all operations.
 *
 * @param operations - The bulk operations array (action, doc pairs)
 * @param allowedKinds - The index kinds to include, or empty array for all
 * @returns Filtered operations array
 */
export function filterOperationsByIndex(
  operations: readonly unknown[],
  allowedKinds: readonly SearchIndexKind[],
): unknown[] {
  if (allowedKinds.length === 0) {
    return [...operations];
  }

  const result: unknown[] = [];
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
function getIndexFromAction(action: unknown): string | null {
  if (!isUnknownObject(action)) {
    return null;
  }
  const indexAction = action.index;
  if (!isUnknownObject(indexAction)) {
    return null;
  }
  const indexName = indexAction._index;
  return typeof indexName === 'string' ? indexName : null;
}

/**
 * Type guard to check if a value is a non-null object.
 *
 * @param value - The value to check
 * @returns True if the value is a non-null object
 */
function isUnknownObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
