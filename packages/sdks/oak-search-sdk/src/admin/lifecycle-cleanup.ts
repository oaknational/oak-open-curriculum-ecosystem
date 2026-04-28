/**
 * Index generation cleanup for blue/green lifecycle (ADR-130).
 *
 * Retains at most MAX_GENERATIONS versioned indexes per kind,
 * deleting the oldest surplus. Pure version-identity functions
 * live in `lifecycle-version-identity.ts`; this module handles I/O.
 */

import type { AliasLifecycleDeps } from '../types/index-lifecycle-types.js';
import {
  BASE_INDEX_NAMES,
  SEARCH_INDEX_KINDS,
  resolveVersionedIndexName,
} from '../internal/index.js';
import { extractVersionFromIndexName } from './lifecycle-version-identity.js';

/** Re-export pure functions and types for consumers that imported from this module. */
export {
  extractVersionFromIndexName,
  identifyOrphanedVersions,
} from './lifecycle-version-identity.js';
export type { OrphanedVersion } from './lifecycle-version-identity.js';

/** Maximum number of index generations to retain (including current). */
const MAX_GENERATIONS = 2;

/** Result of a cleanup operation, tracking both successes and failures. */
export interface CleanupResult {
  readonly deleted: number;
  readonly failed: number;
}

/**
 * Delete old versioned indexes exceeding the generation limit.
 *
 * @param deps - Alias lifecycle deps providing index listing and deletion
 * @param protectedVersions - Version strings (e.g. `v2026-03-07-143022`) that
 *   must never be deleted, regardless of their position in the generation list.
 *   Typically contains the metadata `previous_version` (rollback target).
 * @returns Counts of successfully deleted and failed index deletions across all 6 kinds
 */
export async function cleanupOldGenerations(
  deps: AliasLifecycleDeps,
  protectedVersions?: ReadonlySet<string>,
): Promise<CleanupResult> {
  deps.logger?.info('Cleaning up old search index generations', {
    protectedVersionCount: protectedVersions?.size ?? 0,
  });
  let deleted = 0;
  let failed = 0;
  for (const kind of SEARCH_INDEX_KINDS) {
    const result = await cleanupKindGenerations(deps, BASE_INDEX_NAMES[kind], protectedVersions);
    deleted += result.deleted;
    failed += result.failed;
  }
  return { deleted, failed };
}

/** Cleanup old generations for a single index kind. */
async function cleanupKindGenerations(
  deps: AliasLifecycleDeps,
  baseName: string,
  protectedVersions?: ReadonlySet<string>,
): Promise<CleanupResult> {
  const listResult = await deps.listVersionedIndexes(baseName, deps.target);
  if (!listResult.ok) {
    deps.logger?.warn('Failed to list versioned indexes for cleanup', { baseName });
    return { deleted: 0, failed: 0 };
  }
  // Version strings are fixed-width (vYYYY-MM-DD-HHmmss), so lexicographic sort equals chronological sort.
  // protectedVersions guards the rollback target when orphaned indexes inflate the count.
  const sorted = [...listResult.value].sort();
  const candidates = sorted.slice(0, Math.max(0, sorted.length - MAX_GENERATIONS));
  const toDelete =
    protectedVersions && protectedVersions.size > 0
      ? candidates.filter((name) => {
          const version = extractVersionFromIndexName(name);
          if (version === null) {
            deps.logger?.warn('Index name does not match version pattern — skipping deletion', {
              indexName: name,
              baseName,
            });
            return false;
          }
          return !protectedVersions.has(version);
        })
      : candidates;
  let deleted = 0;
  let failed = 0;
  for (const indexName of toDelete) {
    const deleteResult = await deps.deleteVersionedIndex(indexName);
    if (deleteResult.ok) {
      deleted++;
    } else {
      failed++;
      deps.logger?.warn('Failed to delete old versioned index', { indexName });
    }
  }
  return { deleted, failed };
}

/**
 * Delete all 6 versioned indexes for a given version. Best-effort: cleanup
 * failures are logged as warnings but never mask the original error.
 *
 * @param deps - Subset of lifecycle deps providing deletion, target, and logging
 * @param version - Version string whose 6 indexes should be deleted (e.g. `v2026-03-07-143022`)
 */
export async function cleanupOrphanedIndexes(
  deps: Pick<AliasLifecycleDeps, 'deleteVersionedIndex' | 'target' | 'logger'>,
  version: string,
): Promise<void> {
  deps.logger?.info('Cleaning up orphaned versioned indexes', { version });
  for (const kind of SEARCH_INDEX_KINDS) {
    const indexName = resolveVersionedIndexName(BASE_INDEX_NAMES[kind], deps.target, version);
    const deleteResult = await deps.deleteVersionedIndex(indexName);
    if (!deleteResult.ok) {
      deps.logger?.warn('Failed to clean up orphaned versioned index', {
        indexName,
        version,
        error: deleteResult.error.message,
      });
    }
  }
}
