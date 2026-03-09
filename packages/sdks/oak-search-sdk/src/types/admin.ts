/**
 * Admin service interface — Elasticsearch setup and index management.
 *
 * Covers the write-path operations: creating indexes, updating synonyms,
 * and managing index metadata. Ingestion has moved to the lifecycle
 * service layer (`IndexLifecycleService.stage` / `.versionedIngest`),
 * backed by the CLI bulk ingestion pipeline.
 *
 * Types are in `admin-types.ts`.
 */

import type { Result } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type {
  AdminError,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
} from './admin-types.js';
import type { DocCountExpectations, DocCountVerification } from '../admin/verify-doc-counts.js';

// Re-export admin types for convenience
export type {
  AdminError,
  IndexSetupResult,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IngestOptions,
  IngestResult,
} from './admin-types.js';

// Re-export doc count verification types
export type {
  DocCountExpectations,
  DocCountVerification,
  IndexDocCountStatus,
} from '../admin/verify-doc-counts.js';

/**
 * Admin service — Elasticsearch setup, ingestion, and index management.
 *
 * Provides the write-path operations needed by operators and CLI tools.
 * The retrieval service handles read-path operations.
 *
 * @example
 * ```typescript
 * const { admin } = createSearchSdk({ deps, config });
 *
 * // Verify connection
 * const connResult = await admin.verifyConnection();
 * if (connResult.ok) {
 *   console.log(`Connected to ${connResult.value.clusterName}`);
 * }
 *
 * // Full setup: synonyms + all indexes
 * const setupResult = await admin.setup({ verbose: true });
 * ```
 */
export interface AdminService {
  /**
   * Run full Elasticsearch setup: synonyms + all index mappings.
   *
   * Creates or updates the synonym set and ensures all indexes exist
   * with the correct mappings. Safe to run repeatedly (idempotent).
   * Per-index outcomes are encoded in the `SetupResult` data; the
   * `Result` wrapper captures catastrophic failures.
   *
   * @param options - Optional verbose flag
   * @returns `ok` with per-index results and synonym count, or `err` with an `AdminError`
   */
  setup(options?: SetupOptions): Promise<Result<SetupResult, AdminError>>;

  /**
   * Delete and recreate all indexes with fresh mappings.
   *
   * **Destructive operation**: removes all existing data. Use for
   * development and testing, not production.
   *
   * @param options - Optional verbose flag
   * @returns `ok` with per-index results and synonym count, or `err` with an `AdminError`
   */
  reset(options?: SetupOptions): Promise<Result<SetupResult, AdminError>>;

  /**
   * Verify Elasticsearch connectivity.
   *
   * On success, returns cluster name and version. On connection
   * failure, returns an `AdminError` with the reason.
   *
   * @returns `ok` with cluster info, or `err` with an `AdminError`
   */
  verifyConnection(): Promise<Result<ConnectionStatus, AdminError>>;

  /**
   * List current indexes and their document counts.
   *
   * @returns `ok` with an array of index information, or `err` with an `AdminError`
   */
  listIndexes(): Promise<Result<readonly IndexInfo[], AdminError>>;

  /**
   * Update the synonym set only (no index changes).
   *
   * @returns `ok` with the synonym count, or `err` with an `AdminError`
   */
  updateSynonyms(): Promise<Result<SynonymsResult, AdminError>>;

  /**
   * Read current index metadata from Elasticsearch.
   *
   * @returns `ok` with the metadata document (or `null` if not found), or `err` with an `AdminError`
   */
  getIndexMeta(): Promise<Result<IndexMetaDoc | null, AdminError>>;

  /**
   * Write index metadata to Elasticsearch.
   *
   * @param meta - The metadata document to write
   * @returns `ok` on success, or `err` with an `AdminError`
   */
  setIndexMeta(meta: IndexMetaDoc): Promise<Result<void, AdminError>>;

  /**
   * Verify document counts across all search indexes.
   *
   * Iterates ALL index kinds and accumulates per-index pass/fail
   * results. When multiple indexes fail their minimum doc count
   * threshold, all failures are reported in a single invocation
   * rather than early-exiting on the first failure.
   *
   * @param expectations - Minimum expected doc count per index kind
   * @returns `ok` with comprehensive verification when all pass,
   *   or `err` with a `validation_error` listing all failures
   */
  verifyDocCounts(
    expectations: DocCountExpectations,
  ): Promise<Result<DocCountVerification, AdminError>>;
}
