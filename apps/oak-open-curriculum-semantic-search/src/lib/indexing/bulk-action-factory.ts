/**
 * Factory for creating Elasticsearch bulk action metadata.
 *
 * This module provides a centralized way to create bulk action metadata
 * that respects the current ingestion mode. It supports two modes:
 *
 * ## Incremental Mode (Default)
 *
 * Uses the ES `create` action which fails if the document already exists.
 * This is the safe default for:
 * - Resumable ingestion after interruption
 * - Incremental updates where existing data should be preserved
 * - Multiple ingestion runs without data duplication
 *
 * When a document already exists, ES returns a `version_conflict_engine_exception`
 * which is handled gracefully by the bulk response handler.
 *
 * ## Force Mode
 *
 * Uses the ES `index` action which upserts (creates or updates).
 * Use this mode when:
 * - Schema has changed and all documents need refreshing
 * - Data needs to be completely replaced
 * - Running with `--force` CLI flag
 *
 * @example Setting ingestion mode at startup
 * ```typescript
 * import { setIngestionMode } from './bulk-action-factory';
 *
 * // At the start of ingestion
 * setIngestionMode(args.force ? 'force' : 'incremental');
 * ```
 *
 * @example Creating bulk actions
 * ```typescript
 * import { createBulkAction } from './bulk-action-factory';
 *
 * // Create action respects current mode
 * const action = createBulkAction('oak_lessons', 'lesson-slug-123');
 *
 * // In incremental mode: { create: { _index: 'oak_lessons', _id: 'lesson-slug-123' } }
 * // In force mode: { index: { _index: 'oak_lessons', _id: 'lesson-slug-123' } }
 * ```
 *
 * @see {@link IngestionMode} for mode definitions
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 * @module bulk-action-factory
 */

import type { BulkIndexAction, BulkCreateAction } from './bulk-operation-types';

/**
 * Ingestion mode determines how documents are indexed to Elasticsearch.
 *
 * - `'incremental'`: Uses `create` action - fails if document exists (safe for resume)
 * - `'force'`: Uses `index` action - upserts documents (overwrites existing)
 *
 * @example
 * ```typescript
 * const mode: IngestionMode = args.force ? 'force' : 'incremental';
 * setIngestionMode(mode);
 * ```
 */
export type IngestionMode = 'incremental' | 'force';

/**
 * Global ingestion mode configuration.
 * Defaults to 'incremental' for safe operation.
 * @internal
 */
let currentMode: IngestionMode = 'incremental';

/**
 * Set the ingestion mode for bulk action creation.
 *
 * This should be called once at the start of ingestion, before any
 * documents are processed. The mode affects all subsequent calls to
 * {@link createBulkAction}.
 *
 * @param mode - The ingestion mode to use
 *
 * @example
 * ```typescript
 * // At CLI startup
 * const mode = args.force ? 'force' : 'incremental';
 * setIngestionMode(mode);
 * logger.info('Ingestion mode configured', { mode });
 * ```
 */
export function setIngestionMode(mode: IngestionMode): void {
  currentMode = mode;
}

/**
 * Get the current ingestion mode.
 *
 * Useful for logging and conditional logic based on the current mode.
 *
 * @returns The current ingestion mode
 *
 * @example
 * ```typescript
 * const mode = getIngestionMode();
 * logger.info('Current mode', { mode, willOverwrite: mode === 'force' });
 * ```
 */
export function getIngestionMode(): IngestionMode {
  return currentMode;
}

/**
 * Create a bulk action for indexing a document.
 *
 * The action type depends on the current ingestion mode:
 * - **Incremental mode**: Returns a `create` action that fails if the document exists.
 *   This ensures documents are only created once, making ingestion resumable.
 * - **Force mode**: Returns an `index` action that upserts (creates or updates).
 *   This overwrites existing documents, useful for schema changes.
 *
 * @param indexName - The Elasticsearch index name (e.g., 'oak_lessons')
 * @param documentId - The unique document ID (e.g., lesson slug)
 * @returns Bulk action metadata for ES bulk API
 *
 * @example Typical usage in document building
 * ```typescript
 * import { createBulkAction } from './bulk-action-factory';
 * import { resolvePrimarySearchIndexName } from '../search-index-target';
 *
 * const indexName = resolvePrimarySearchIndexName('lessons');
 * const action = createBulkAction(indexName, lesson.lessonSlug);
 * const document = createLessonDocument(lesson);
 *
 * bulkOps.push(action, document);
 * ```
 *
 * @example Verifying action type
 * ```typescript
 * import { createBulkAction, setIngestionMode } from './bulk-action-factory';
 *
 * setIngestionMode('incremental');
 * const action = createBulkAction('oak_lessons', 'my-lesson');
 * // action = { create: { _index: 'oak_lessons', _id: 'my-lesson' } }
 *
 * setIngestionMode('force');
 * const forceAction = createBulkAction('oak_lessons', 'my-lesson');
 * // forceAction = { index: { _index: 'oak_lessons', _id: 'my-lesson' } }
 * ```
 */
export function createBulkAction(
  indexName: string,
  documentId: string,
): BulkIndexAction | BulkCreateAction {
  if (currentMode === 'force') {
    return { index: { _index: indexName, _id: documentId } };
  }
  // Incremental mode - use create action (fails if exists)
  return { create: { _index: indexName, _id: documentId } };
}

/**
 * Check if the current mode allows overwriting existing documents.
 *
 * Convenience function for conditional logic based on ingestion mode.
 *
 * @returns `true` if in force mode (documents will be overwritten)
 *
 * @example
 * ```typescript
 * if (isForceMode()) {
 *   logger.warn('Force mode enabled - existing documents will be overwritten');
 * }
 * ```
 */
export function isForceMode(): boolean {
  return currentMode === 'force';
}

/**
 * Reset the ingestion mode to its default (incremental).
 *
 * Primarily useful for testing to ensure clean state between tests.
 *
 * @internal
 */
export function resetIngestionMode(): void {
  currentMode = 'incremental';
}
