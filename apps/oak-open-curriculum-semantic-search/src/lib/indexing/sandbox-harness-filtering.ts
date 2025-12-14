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
  if (!isBulkIndexAction(action)) {
    return null;
  }
  return action.index._index;
}

/**
 * Shape of a bulk index action's index property.
 * Used only for bulk operation filtering - not a general-purpose type.
 */
interface BulkActionIndex {
  readonly _index: string;
}

/**
 * Shape of a bulk index action used in ES bulk operations.
 * Used only for bulk operation filtering - not a general-purpose type.
 */
interface BulkIndexAction {
  readonly index: BulkActionIndex;
}

/**
 * Type guard to check if a value is a bulk index action.
 * Narrows directly to BulkIndexAction without intermediate generic types.
 *
 * @param value - The value to check
 * @returns True if the value is a bulk index action with _index property
 */
function isBulkIndexAction(value: unknown): value is BulkIndexAction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('index' in value)) {
    return false;
  }
  const indexProp = value.index;
  if (typeof indexProp !== 'object' || indexProp === null) {
    return false;
  }
  if (!('_index' in indexProp)) {
    return false;
  }
  return typeof indexProp._index === 'string';
}
