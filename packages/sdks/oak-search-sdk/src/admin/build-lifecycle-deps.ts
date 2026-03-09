/**
 * Factory for building {@link IndexLifecycleDeps} from an Elasticsearch
 * client, target, injected ingest function, and optional logger.
 *
 * Each dependency delegates to existing admin building blocks, keeping
 * the lifecycle service decoupled from the ES client (ADR-078).
 * The `runVersionedIngest` function is injected by the caller (typically
 * the CLI layer) rather than built internally — see Phase 2 of the
 * unified versioned ingestion plan.
 */

import type { Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { Logger } from '@oaknational/logger';

import type { IndexLifecycleDeps } from '../types/index-lifecycle-types.js';
import type { AdminError } from '../types/admin-types.js';
import type { SearchIndexTarget } from '../internal/index.js';
import { SEARCH_INDEX_KINDS } from '../internal/index.js';
import { createVersionedIndexResolver } from './versioned-index-resolver.js';
import {
  atomicAliasSwap,
  resolveCurrentAliasTargets,
  listVersionedIndexes,
  deleteVersionedIndex,
} from './alias-operations.js';
import { createAllIndexes } from './admin-index-operations.js';
import { readIndexMeta, writeIndexMeta } from './index-meta.js';

// ---------------------------------------------------------------------------
// Small helpers — each under 50 lines, used by the factory
// ---------------------------------------------------------------------------

/** Format a zero-padded two-digit number. */
function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Generate a timestamp-based version string.
 *
 * Format: `vYYYY-MM-DD-HHmmss` (e.g. `v2026-03-08-143022`).
 */
function generateTimestampVersion(): string {
  const now = new Date();
  const date = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  const time = `${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
  return `v${date}-${time}`;
}

/** Check whether any index setup results have an error status, returning all errors combined. */
function hasSetupError(
  results: readonly { readonly status: string; readonly error?: string }[],
): string | undefined {
  const errors = results
    .filter((r) => r.status === 'error')
    .map((r) => r.error ?? 'Unknown index creation error');
  return errors.length > 0 ? errors.join('; ') : undefined;
}

/**
 * Create versioned indexes and return a Result.
 *
 * Wraps `createAllIndexes` — the underlying function returns an array of
 * per-index results rather than a Result, so we check for errors here.
 */
async function buildCreateVersionedIndexes(
  client: Client,
  target: SearchIndexTarget,
  logger: Logger | undefined,
  version: string,
): Promise<Result<void, AdminError>> {
  const resolver = createVersionedIndexResolver(version, target);
  const results = await createAllIndexes(client, resolver, logger);
  const errorMessage = hasSetupError(results);
  if (errorMessage !== undefined) {
    return err({ type: 'es_error', message: `Index creation failed: ${errorMessage}` });
  }
  return ok(undefined);
}

/**
 * Verify that all 6 curriculum indexes for a version meet the minimum
 * document count threshold.
 */
async function buildVerifyDocCounts(
  client: Client,
  target: SearchIndexTarget,
  version: string,
  minDocCount: number,
): Promise<Result<void, AdminError>> {
  const resolver = createVersionedIndexResolver(version, target);
  try {
    for (const kind of SEARCH_INDEX_KINDS) {
      const resolvedName = resolver(kind);
      const response = await client.count({ index: resolvedName });
      if (response.count < minDocCount) {
        return err({
          type: 'validation_error',
          message:
            `Index ${resolvedName} has ${response.count} docs, ` +
            `expected at least ${minDocCount}`,
        });
      }
    }
    return ok(undefined);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Doc count verification failed: ${message}` });
  }
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

/**
 * Build {@link IndexLifecycleDeps} from an Elasticsearch client, target,
 * and an injected `runVersionedIngest` implementation.
 *
 * The caller supplies `runVersionedIngest` — typically the CLI-layer
 * closure from `createRunVersionedIngest` which uses the proven bulk
 * pipeline.
 *
 * @param client - Elasticsearch client instance
 * @param target - Which index alias set to target (`'primary'` or `'sandbox'`)
 * @param runVersionedIngest - Injected ingest function matching {@link IndexLifecycleDeps.runVersionedIngest}
 * @param logger - Optional logger for diagnostic output
 * @returns A fully wired {@link IndexLifecycleDeps} object
 *
 * @example
 * ```typescript
 * import { Client } from '@elastic/elasticsearch';
 * import { buildLifecycleDeps, createIndexLifecycleService } from '@oaknational/oak-search-sdk';
 *
 * const client = new Client({ node: 'http://localhost:9200' });
 * const runIngest = createRunVersionedIngest({ oakClient, esTransport: client, target: 'primary' });
 * const deps = buildLifecycleDeps(client, 'primary', runIngest);
 * const service = createIndexLifecycleService(deps);
 * ```
 */
export function buildLifecycleDeps(
  client: Client,
  target: SearchIndexTarget,
  runVersionedIngest: IndexLifecycleDeps['runVersionedIngest'],
  logger?: Logger,
): IndexLifecycleDeps {
  return {
    createVersionedIndexes: (version) =>
      buildCreateVersionedIndexes(client, target, logger, version),
    runVersionedIngest,
    resolveCurrentAliasTargets: () => resolveCurrentAliasTargets(client, target),
    atomicAliasSwap: (swaps) => atomicAliasSwap(client, swaps),
    readIndexMeta: () => readIndexMeta(client),
    writeIndexMeta: (meta) => writeIndexMeta(client, meta),
    listVersionedIndexes: (baseName, t) => listVersionedIndexes(client, baseName, t),
    deleteVersionedIndex: (name) => deleteVersionedIndex(client, name),
    verifyDocCounts: (version, minDocCount) =>
      buildVerifyDocCounts(client, target, version, minDocCount),
    generateVersion: generateTimestampVersion,
    target,
    logger,
  };
}
