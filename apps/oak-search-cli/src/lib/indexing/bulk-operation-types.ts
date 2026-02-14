/**
 * Type definitions for Elasticsearch bulk operations.
 *
 * Bulk operations are heterogeneous arrays that alternate between action
 * metadata and document bodies. These types preserve type information
 * throughout the ingestion pipeline per rules.md.
 */

import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchThreadIndexDoc,
} from '../../types/oak';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';

/**
 * Elasticsearch bulk index action metadata.
 * Uses 'index' which upserts (creates or updates).
 */
export interface BulkIndexAction {
  readonly index: {
    readonly _index: string;
    readonly _id?: string;
  };
}

/**
 * Elasticsearch bulk create action metadata.
 * Uses 'create' which only creates (fails if document exists).
 * This is the safer option for incremental ingestion.
 */
export interface BulkCreateAction {
  readonly create: {
    readonly _index: string;
    readonly _id: string;
  };
}

/**
 * Elasticsearch bulk delete action metadata.
 */
export interface BulkDeleteAction {
  readonly delete: {
    readonly _index: string;
    readonly _id: string;
  };
}

/**
 * Union of all action metadata types.
 */
export type BulkAction = BulkIndexAction | BulkCreateAction | BulkDeleteAction;

function isBulkActionObject(value: unknown): value is BulkAction {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('index' in value || 'create' in value || 'delete' in value)
  );
}

/**
 * Union of all document types that can be indexed.
 */
export type BulkDocument =
  | SearchLessonsIndexDoc
  | SearchUnitsIndexDoc
  | SearchUnitRollupDoc
  | SearchSequenceIndexDoc
  | SearchSequenceFacetsIndexDoc
  | SearchThreadIndexDoc;

/**
 * A bulk operation entry (either action metadata or document body).
 */
export type BulkOperationEntry = BulkAction | BulkDocument;

/**
 * Array of bulk operations for Elasticsearch.
 *
 * Structure: [action1, document1, action2, document2, ...]
 * Note: Delete actions have no following document.
 */
export type BulkOperations = BulkOperationEntry[];

/**
 * Type guard to check if a value is a bulk index action.
 */
export function isBulkIndexAction(value: unknown): value is BulkIndexAction {
  if (!isBulkActionObject(value)) {
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

/**
 * Type guard to check if a value is a bulk create action.
 */
export function isBulkCreateAction(value: unknown): value is BulkCreateAction {
  if (!isBulkActionObject(value)) {
    return false;
  }
  if (!('create' in value)) {
    return false;
  }
  const createProp = value.create;
  if (typeof createProp !== 'object' || createProp === null) {
    return false;
  }
  if (!('_index' in createProp) || !('_id' in createProp)) {
    return false;
  }
  return typeof createProp._index === 'string' && typeof createProp._id === 'string';
}

/**
 * Type guard for any indexing action (index or create).
 */
export function isBulkIndexingAction(value: unknown): value is BulkIndexAction | BulkCreateAction {
  return isBulkIndexAction(value) || isBulkCreateAction(value);
}

/**
 * Helper to check if delete metadata is valid.
 */
function isValidDeleteMetadata(deleteProp: unknown): deleteProp is { _index: string; _id: string } {
  return (
    typeof deleteProp === 'object' &&
    deleteProp !== null &&
    '_index' in deleteProp &&
    '_id' in deleteProp &&
    typeof deleteProp._index === 'string' &&
    typeof deleteProp._id === 'string'
  );
}

/**
 * Type guard to check if a value is a bulk delete action.
 */
export function isBulkDeleteAction(value: unknown): value is BulkDeleteAction {
  if (typeof value !== 'object' || value === null || !('delete' in value)) {
    return false;
  }
  return isValidDeleteMetadata(value.delete);
}

/**
 * Type guard to check if a value is a bulk action (index, create, or delete).
 */
export function isBulkAction(value: unknown): value is BulkAction {
  return isBulkIndexAction(value) || isBulkCreateAction(value) || isBulkDeleteAction(value);
}

/**
 * Extracts document IDs from bulk operations.
 *
 * @remarks
 * Bulk operations alternate action and document: [action, doc, action, doc, ...].
 * The document ID is in the action's `index._id` or `create._id` field.
 *
 * @param operations - Bulk operations array
 * @returns Array of document IDs (empty if ID not found in action)
 */
export function extractDocumentIds(operations: BulkOperations): readonly string[] {
  const ids: string[] = [];
  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    if (isBulkIndexAction(action) && action.index._id !== undefined) {
      ids.push(action.index._id);
    } else if (isBulkCreateAction(action)) {
      ids.push(action.create._id);
    }
  }
  return ids;
}
