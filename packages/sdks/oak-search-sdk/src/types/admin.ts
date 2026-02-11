/**
 * Admin service interface — Elasticsearch setup, ingestion, and index management.
 *
 * Covers the write-path operations: creating indexes, updating synonyms,
 * ingesting curriculum data, and managing index metadata.
 *
 * The Oak Curriculum SDK client is not part of the core {@link SearchSdkDeps}
 * because many SDK consumers (e.g. MCP servers) never ingest data. Instead,
 * the `ingest()` method accepts the Oak client as a parameter.
 *
 * Types are in {@link ./admin-types}.
 */

import type { Result } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type {
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IngestOptions,
  IngestResult,
  IndexMetaError,
} from './admin-types.js';

// Re-export admin types for convenience
export type {
  IndexSetupResult,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IngestOptions,
  IngestResult,
  IndexMetaError,
} from './admin-types.js';

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
 * const status = await admin.verifyConnection();
 *
 * // Full setup: synonyms + all indexes
 * const setup = await admin.setup({ verbose: true });
 *
 * // Ingest curriculum data
 * const result = await admin.ingest({
 *   bulkDir: '/path/to/bulk-data',
 * });
 * ```
 */
export interface AdminService {
  /**
   * Run full Elasticsearch setup: synonyms + all index mappings.
   *
   * Creates or updates the synonym set and ensures all indexes exist
   * with the correct mappings. Safe to run repeatedly (idempotent).
   *
   * @param options - Optional verbose flag
   * @returns Per-index results and synonym count
   */
  setup(options?: SetupOptions): Promise<SetupResult>;

  /**
   * Delete and recreate all indexes with fresh mappings.
   *
   * **Destructive operation**: removes all existing data. Use for
   * development and testing, not production.
   *
   * @param options - Optional verbose flag
   * @returns Per-index results and synonym count
   */
  reset(options?: SetupOptions): Promise<SetupResult>;

  /**
   * Verify Elasticsearch connectivity.
   *
   * @returns Connection status with cluster info or error
   */
  verifyConnection(): Promise<ConnectionStatus>;

  /**
   * List current indexes and their document counts.
   *
   * @returns Array of index information
   */
  listIndexes(): Promise<readonly IndexInfo[]>;

  /**
   * Update the synonym set only (no index changes).
   *
   * @returns Success status with synonym count
   */
  updateSynonyms(): Promise<SynonymsResult>;

  /**
   * Run ingestion from bulk data.
   *
   * Processes curriculum bulk download files and indexes documents
   * into Elasticsearch. Supports resilient batching with exponential
   * backoff.
   *
   * @param options - Ingestion options including bulk data path
   * @returns Summary statistics from the ingestion run
   */
  ingest(options: IngestOptions): Promise<IngestResult>;

  /**
   * Read current index metadata from Elasticsearch.
   *
   * @returns The metadata document, null if not found, or an error
   */
  getIndexMeta(): Promise<Result<IndexMetaDoc | null, IndexMetaError>>;

  /**
   * Write index metadata to Elasticsearch.
   *
   * @param meta - The metadata document to write
   * @returns Success or error
   */
  setIndexMeta(meta: IndexMetaDoc): Promise<Result<void, IndexMetaError>>;
}
