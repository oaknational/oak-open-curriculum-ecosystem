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
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';

/**
 * Elasticsearch bulk index action metadata.
 */
export interface BulkIndexAction {
  readonly index: {
    readonly _index: string;
    readonly _id?: string;
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
export type BulkAction = BulkIndexAction | BulkDeleteAction;

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
 * Type guard to check if a value is a bulk action (index or delete).
 */
export function isBulkAction(value: unknown): value is BulkAction {
  return isBulkIndexAction(value) || isBulkDeleteAction(value);
}
