/**
 * Admin CLI handler functions.
 *
 * Handlers for SDK-mapped admin operations. Complex orchestration
 * operations (ingest-live, verify, diagnostics) are wired separately
 * via their existing implementation files.
 */

import type { Result } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type {
  AdminService,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IndexMetaError,
} from '@oaknational/oak-search-sdk';

/** Combined status result for the `admin status` command. */
export interface StatusResult {
  readonly connection: ConnectionStatus;
  readonly indexes: readonly IndexInfo[];
}

/**
 * Run Elasticsearch setup (synonyms + index mappings).
 *
 * @param admin - The SDK admin service
 * @param options - Optional setup options (verbose flag)
 * @returns Setup result with per-index details and synonym count
 */
export async function handleSetup(
  admin: AdminService,
  options?: SetupOptions,
): Promise<SetupResult> {
  return admin.setup(options);
}

/**
 * Delete and recreate all indexes with fresh mappings.
 *
 * @param admin - The SDK admin service
 * @param options - Optional setup options (verbose flag)
 * @returns Setup result with per-index details and synonym count
 */
export async function handleReset(
  admin: AdminService,
  options?: SetupOptions,
): Promise<SetupResult> {
  return admin.reset(options);
}

/**
 * Get Elasticsearch connection status and index listing.
 *
 * @param admin - The SDK admin service
 * @returns Connection status and array of index information
 */
export async function handleStatus(admin: AdminService): Promise<StatusResult> {
  const [connection, indexes] = await Promise.all([admin.verifyConnection(), admin.listIndexes()]);
  return { connection, indexes };
}

/**
 * Update the synonym set in Elasticsearch.
 *
 * @param admin - The SDK admin service
 * @returns Synonym update result with count
 */
export async function handleSynonyms(admin: AdminService): Promise<SynonymsResult> {
  return admin.updateSynonyms();
}

/**
 * Read current index metadata from Elasticsearch.
 *
 * @param admin - The SDK admin service
 * @returns Result containing the metadata document or null
 */
export async function handleGetMeta(
  admin: AdminService,
): Promise<Result<IndexMetaDoc | null, IndexMetaError>> {
  return admin.getIndexMeta();
}

/**
 * Write index metadata to Elasticsearch.
 *
 * @param admin - The SDK admin service
 * @param meta - The metadata document to write
 * @returns Result indicating success or error
 */
export async function handleSetMeta(
  admin: AdminService,
  meta: IndexMetaDoc,
): Promise<Result<void, IndexMetaError>> {
  return admin.setIndexMeta(meta);
}
