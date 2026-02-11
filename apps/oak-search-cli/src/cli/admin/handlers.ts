/**
 * Admin CLI handler functions.
 *
 * Handlers for SDK-mapped admin operations. Each handler is a thin
 * pass-through returning the `Result` from the SDK. The `handleStatus`
 * handler combines two SDK calls and must merge their Results.
 *
 * Complex orchestration operations (ingest-live, verify, diagnostics)
 * are wired separately via their existing implementation files.
 */

import { ok, type Result } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type {
  AdminService,
  AdminError,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
} from '@oaknational/oak-search-sdk';

/**
 * Combined status result for the `admin status` command.
 *
 * Merges connection verification and index listing from two SDK calls.
 */
export interface StatusResult {
  /** Elasticsearch connection status (cluster health, reachability). */
  readonly connection: ConnectionStatus;

  /** List of search indexes with their aliases and document counts. */
  readonly indexes: readonly IndexInfo[];
}

/**
 * Run Elasticsearch setup (synonyms + index mappings).
 *
 * @param admin - The SDK admin service
 * @param options - Optional setup options (verbose flag)
 * @returns `ok` with setup result, or `err` with an `AdminError`
 */
export async function handleSetup(
  admin: AdminService,
  options?: SetupOptions,
): Promise<Result<SetupResult, AdminError>> {
  return admin.setup(options);
}

/**
 * Delete and recreate all indexes with fresh mappings.
 *
 * @param admin - The SDK admin service
 * @param options - Optional setup options (verbose flag)
 * @returns `ok` with setup result, or `err` with an `AdminError`
 */
export async function handleReset(
  admin: AdminService,
  options?: SetupOptions,
): Promise<Result<SetupResult, AdminError>> {
  return admin.reset(options);
}

/**
 * Get Elasticsearch connection status and index listing.
 *
 * Combines two SDK calls. If either fails, the first error is returned.
 *
 * @param admin - The SDK admin service
 * @returns `ok` with connection status and index list, or `err` with an `AdminError`
 */
export async function handleStatus(admin: AdminService): Promise<Result<StatusResult, AdminError>> {
  const [connectionResult, indexesResult] = await Promise.all([
    admin.verifyConnection(),
    admin.listIndexes(),
  ]);
  if (!connectionResult.ok) {
    return connectionResult;
  }
  if (!indexesResult.ok) {
    return indexesResult;
  }
  return ok({ connection: connectionResult.value, indexes: indexesResult.value });
}

/**
 * Update the synonym set in Elasticsearch.
 *
 * @param admin - The SDK admin service
 * @returns `ok` with synonym count, or `err` with an `AdminError`
 */
export async function handleSynonyms(
  admin: AdminService,
): Promise<Result<SynonymsResult, AdminError>> {
  return admin.updateSynonyms();
}

/**
 * Read current index metadata from Elasticsearch.
 *
 * @param admin - The SDK admin service
 * @returns `ok` with the metadata document (or null), or `err` with an `AdminError`
 */
export async function handleGetMeta(
  admin: AdminService,
): Promise<Result<IndexMetaDoc | null, AdminError>> {
  return admin.getIndexMeta();
}

/**
 * Write index metadata to Elasticsearch.
 *
 * @param admin - The SDK admin service
 * @param meta - The metadata document to write
 * @returns `ok` on success, or `err` with an `AdminError`
 */
export async function handleSetMeta(
  admin: AdminService,
  meta: IndexMetaDoc,
): Promise<Result<void, AdminError>> {
  return admin.setIndexMeta(meta);
}
