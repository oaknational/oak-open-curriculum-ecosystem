/**
 * Index generation cleanup for blue/green lifecycle (ADR-130).
 *
 * Retains at most MAX_GENERATIONS versioned indexes per kind,
 * deleting the oldest surplus. Extracted to keep the main
 * lifecycle service within the max-lines limit.
 */

import type { IndexLifecycleDeps } from '../types/index-lifecycle-types.js';
import { BASE_INDEX_NAMES, SEARCH_INDEX_KINDS } from '../internal/index.js';

/** Maximum number of index generations to retain (including current). */
const MAX_GENERATIONS = 2;

/** Delete old versioned indexes exceeding the generation limit. */
export async function cleanupOldGenerations(deps: IndexLifecycleDeps): Promise<number> {
  let deleted = 0;
  for (const kind of SEARCH_INDEX_KINDS) {
    deleted += await cleanupKindGenerations(deps, BASE_INDEX_NAMES[kind]);
  }
  return deleted;
}

/** Cleanup old generations for a single index kind. */
async function cleanupKindGenerations(deps: IndexLifecycleDeps, baseName: string): Promise<number> {
  const listResult = await deps.listVersionedIndexes(baseName, deps.target);
  if (!listResult.ok) {
    deps.logger?.warn('Failed to list versioned indexes for cleanup', { baseName });
    return 0;
  }
  // Version strings are fixed-width (vYYYY-MM-DD-HHmmss), so lexicographic sort equals chronological sort.
  // With MAX_GENERATIONS=2 and cleanup running after the swap, the retained indexes are the current
  // version (n) and previous version (n-1). The rollback target is always n-1, which is naturally
  // protected without consulting metadata.
  const sorted = [...listResult.value].sort();
  const toDelete = sorted.slice(0, Math.max(0, sorted.length - MAX_GENERATIONS));
  let deleted = 0;
  for (const indexName of toDelete) {
    const deleteResult = await deps.deleteVersionedIndex(indexName);
    if (deleteResult.ok) {
      deleted++;
    } else {
      deps.logger?.warn('Failed to delete old versioned index', { indexName });
    }
  }
  return deleted;
}
