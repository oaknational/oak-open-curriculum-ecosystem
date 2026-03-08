/**
 * Elasticsearch alias operations for blue/green index swapping (ADR-130).
 *
 * Pure TypeScript wrappers over the ES `/_aliases` API. All functions
 * accept an injected ES client and return `Result<T, AdminError>`.
 *
 * Multi-alias-atomic TypeScript implementation — all six curriculum
 * aliases are swapped in a single `POST /_aliases` request.
 *
 * @see {@link ../types/admin-types.ts} for `AdminError` definition
 */

import type { Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type { AliasSwap, AliasTargetInfo, AliasTargetMap } from '../types/index-lifecycle-types.js';
import type { SearchIndexKind, SearchIndexTarget } from '../internal/index.js';
import { BASE_INDEX_NAMES, TARGET_SUFFIXES, resolveAliasName } from '../internal/index.js';
import { isNotFoundError } from './es-error-guards.js';

// ---------------------------------------------------------------------------
// Alias swap
// ---------------------------------------------------------------------------

/**
 * Atomically swap aliases for one or more indexes in a single ES request.
 *
 * Uses `POST /_aliases` with multiple actions — either all succeed or
 * none do. When `fromIndex` is `null` in a swap entry, the `remove`
 * action is omitted (first-run case per Wilma finding #3).
 *
 * `is_write_index` is intentionally omitted — each alias points to
 * exactly one index, making it unnecessary (ES reviewer finding #1).
 *
 * @param client - Elasticsearch client
 * @param swaps - Array of alias swap descriptors
 * @returns `ok` on success, `err` with `AdminError` on failure
 */
export async function atomicAliasSwap(
  client: Client,
  swaps: readonly AliasSwap[],
): Promise<Result<void, AdminError>> {
  const actions: (
    | { remove: { index: string; alias: string } }
    | { add: { index: string; alias: string } }
  )[] = [];

  for (const { fromIndex, toIndex, alias } of swaps) {
    if (fromIndex !== null) {
      actions.push({ remove: { index: fromIndex, alias } });
    }
    actions.push({ add: { index: toIndex, alias } });
  }

  try {
    await client.indices.updateAliases({ actions });
    return ok(undefined);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Alias swap failed: ${message}` });
  }
}

// ---------------------------------------------------------------------------
// Alias target resolution
// ---------------------------------------------------------------------------

/**
 * For each curriculum index kind, determine whether its alias exists in
 * Elasticsearch and which physical index it points to.
 *
 * Returns an {@link AliasTargetMap} keyed by {@link SearchIndexKind},
 * replacing the previous `Record<string, AliasTargetInfo>` signature to
 * prevent loose string keys from propagating entropy (principles.md).
 *
 * @param client - Elasticsearch client
 * @param target - The index target (`'primary'` or `'sandbox'`)
 * @returns Map of kind to {@link AliasTargetInfo}
 */
export async function resolveCurrentAliasTargets(
  client: Client,
  target: SearchIndexTarget,
): Promise<Result<AliasTargetMap, AdminError>> {
  try {
    const entries = await resolveAllAliases(client, target);
    return ok(entries);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Failed to resolve alias targets: ${message}` });
  }
}

/**
 * Resolve all curriculum alias names for a target and return a strict map.
 *
 * All 6 alias resolutions run concurrently via `Promise.all` (E2),
 * halving the total HTTP round-trips compared to sequential resolution.
 */
async function resolveAllAliases(
  client: Client,
  target: SearchIndexTarget,
): Promise<AliasTargetMap> {
  const resolve = (kind: SearchIndexKind) =>
    resolveOneAlias(client, resolveAliasName(BASE_INDEX_NAMES[kind], target));
  const [lessons, unitRollup, units, sequences, sequenceFacets, threads] = await Promise.all([
    resolve('lessons'),
    resolve('unit_rollup'),
    resolve('units'),
    resolve('sequences'),
    resolve('sequence_facets'),
    resolve('threads'),
  ]);
  return {
    lessons,
    unit_rollup: unitRollup,
    units,
    sequences,
    sequence_facets: sequenceFacets,
    threads,
  };
}

/**
 * Resolve a single alias name to its target info.
 *
 * Uses a single `getAlias` call with 404 catch (E1), replacing the
 * previous two-call `existsAlias` + `getAlias` pattern to halve
 * HTTP calls per alias.
 *
 * An empty response (no keys) is treated as not-found (CR-1) —
 * this can occur if ES returns a successful response with no backing
 * index for the alias.
 *
 * @param client - Elasticsearch client
 * @param aliasName - The alias name to check
 * @returns AliasTargetInfo for this name
 */
async function resolveOneAlias(client: Client, aliasName: string): Promise<AliasTargetInfo> {
  try {
    const aliasResponse = await client.indices.getAlias({ name: aliasName });
    const target = firstKey(aliasResponse);
    if (target === null) {
      return { isAlias: false, targetIndex: null };
    }
    return { isAlias: true, targetIndex: target };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { isAlias: false, targetIndex: null };
    }
    throw error;
  }
}

/**
 * Extract the first key from a record, or null if empty.
 *
 * @param record - The record to extract from
 * @returns The first key, or null
 */
function firstKey<T>(record: Readonly<Record<string, T>>): string | null {
  for (const key in record) {
    return key;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Versioned index listing
// ---------------------------------------------------------------------------

/**
 * List all versioned indexes matching a base name and target.
 *
 * Filters by exact target suffix to prevent sandbox/primary interference
 * (Wilma finding #5). For primary, matches `oak_lessons_v*` but NOT
 * `oak_lessons_sandbox_v*`. For sandbox, matches `oak_lessons_sandbox_v*`.
 *
 * Uses `indices.get` with a wildcard pattern. On ES Serverless,
 * `allow_no_indices` defaults to `true`, so a no-match returns an
 * empty object rather than a 404 — the 404 catch is retained as a
 * safety net for non-default ES configurations (ES-1). The response
 * includes full index metadata; a lighter API like `resolveIndex`
 * could reduce payload size but is deferred given the small generation
 * count (ES-2).
 *
 * @param client - Elasticsearch client
 * @param baseName - Base index name (e.g. `'oak_lessons'`)
 * @param target - Index target (`'primary'` or `'sandbox'`)
 * @returns Sorted array of matching versioned index names
 */
export async function listVersionedIndexes(
  client: Client,
  baseName: string,
  target: SearchIndexTarget,
): Promise<Result<readonly string[], AdminError>> {
  const prefix = `${baseName}${TARGET_SUFFIXES[target]}_v`;

  try {
    const response = await client.indices.get({ index: `${prefix}*` });
    const names: string[] = [];
    for (const key in response) {
      names.push(key);
    }
    names.sort();
    return ok(names);
  } catch (error) {
    if (isNotFoundError(error)) {
      return ok([]);
    }
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Failed to list versioned indexes: ${message}` });
  }
}

// ---------------------------------------------------------------------------
// Versioned index deletion
// ---------------------------------------------------------------------------

/**
 * Delete a single versioned index. Treats 404 as success (index already gone).
 *
 * @param client - Elasticsearch client
 * @param indexName - The versioned index name to delete
 * @returns `ok` on success (including 404), `err` for other failures
 */
export async function deleteVersionedIndex(
  client: Client,
  indexName: string,
): Promise<Result<void, AdminError>> {
  try {
    await client.indices.delete({ index: indexName });
    return ok(undefined);
  } catch (error) {
    if (isNotFoundError(error)) {
      return ok(undefined);
    }
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message: `Failed to delete index ${indexName}: ${message}` });
  }
}
