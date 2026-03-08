/**
 * Elasticsearch alias operations for blue/green index swapping (ADR-130).
 *
 * Pure TypeScript wrappers over the ES `/_aliases` API. All functions
 * accept an injected ES client and return `Result<T, AdminError>`.
 *
 * Replaces the previous `alias-swap.sh` bash script with a testable,
 * multi-alias-atomic TypeScript implementation.
 *
 * @see {@link ../types/admin-types.ts} for `AdminError` definition
 */

import type { Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type { AliasSwap, AliasTargetInfo, AliasTargetMap } from '../types/index-lifecycle-types.js';
import type { SearchIndexKind, SearchIndexTarget } from '../internal/index.js';
import { BASE_INDEX_NAMES, resolveAliasName } from '../internal/index.js';
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

/** Resolve all curriculum alias names for a target and return a strict map. */
async function resolveAllAliases(
  client: Client,
  target: SearchIndexTarget,
): Promise<AliasTargetMap> {
  const resolve = (kind: SearchIndexKind) =>
    resolveOneAlias(client, resolveAliasName(BASE_INDEX_NAMES[kind], target));
  return {
    lessons: await resolve('lessons'),
    unit_rollup: await resolve('unit_rollup'),
    units: await resolve('units'),
    sequences: await resolve('sequences'),
    sequence_facets: await resolve('sequence_facets'),
    threads: await resolve('threads'),
  };
}

/**
 * Resolve a single alias name to its target info.
 *
 * @param client - Elasticsearch client
 * @param aliasName - The alias name to check
 * @returns AliasTargetInfo for this name
 */
async function resolveOneAlias(client: Client, aliasName: string): Promise<AliasTargetInfo> {
  const exists = await client.indices.existsAlias({ name: aliasName });
  if (!exists) {
    return { isAlias: false, targetIndex: null };
  }
  const aliasResponse = await client.indices.getAlias({ name: aliasName });
  return { isAlias: true, targetIndex: firstKey(aliasResponse) };
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
  const prefix = target === 'primary' ? `${baseName}_v` : `${baseName}_sandbox_v`;

  try {
    const indices = await client.cat.indices({ format: 'json' });
    const indexArray = Array.isArray(indices) ? indices : [];

    const matching = indexArray
      .filter(
        (entry): entry is { index: string } =>
          typeof entry === 'object' &&
          entry !== null &&
          'index' in entry &&
          typeof entry.index === 'string' &&
          entry.index.startsWith(prefix),
      )
      .map((entry) => entry.index)
      .sort();

    return ok(matching);
  } catch (error) {
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
