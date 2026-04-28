/**
 * Orphan detection and deletion safety for blue/green lifecycle (ADR-130).
 *
 * Domain logic for identifying orphaned index versions, validating
 * that a version is safe to delete, and resolving orphan state from
 * a live cluster. Pure functions where possible; I/O functions accept
 * injected deps.
 */

import type { AdminError } from '../types/admin-types.js';
import type { AliasLifecycleDeps, AliasTargetMap } from '../types/index-lifecycle-types.js';
import { BASE_INDEX_NAMES, SEARCH_INDEX_KINDS } from '../internal/index.js';
import {
  extractVersionFromIndexName,
  identifyOrphanedVersions,
  type OrphanedVersion,
} from './lifecycle-version-identity.js';

/**
 * Extract the set of version strings currently serving live aliases.
 *
 * Iterates all 6 index kinds and extracts the version suffix from
 * each alias target's physical index name.
 *
 * @param targets - Current alias target map from `resolveCurrentAliasTargets`
 * @returns Set of version strings (e.g. `v2026-03-07-143022`) that are live
 */
export function extractLiveVersions(targets: AliasTargetMap): ReadonlySet<string> {
  const versions = new Set<string>();
  for (const kind of SEARCH_INDEX_KINDS) {
    const info = targets[kind];
    if (info.isAlias) {
      const v = extractVersionFromIndexName(info.targetIndex);
      if (v) {
        versions.add(v);
      }
    }
  }
  return versions;
}

/** Result of validating whether a version is safe to delete. */
export type DeletionValidation =
  | { readonly blocked: true; readonly message: string }
  | { readonly blocked: false };

/**
 * Validate that a version is safe to delete.
 *
 * Refuses if the version is currently serving live aliases. Blocks
 * if the version is the rollback target (previous_version) unless
 * `force` is true.
 *
 * @param deps - Alias lifecycle deps for alias resolution and metadata
 * @param version - Version string to validate for deletion
 * @param force - If true, allow deletion of the rollback target
 * @returns `{ blocked: false }` if safe, or `{ blocked: true, message }` with reason
 */
export async function validateVersionDeletion(
  deps: AliasLifecycleDeps,
  version: string,
  force: boolean,
): Promise<DeletionValidation> {
  deps.logger?.debug('Validating version deletion', { version, force });
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return { blocked: true, message: `Cannot resolve alias targets: ${aliasResult.error.message}` };
  }

  const liveVersions = extractLiveVersions(aliasResult.value);
  if (liveVersions.has(version)) {
    return {
      blocked: true,
      message: `Version ${version} is currently serving live aliases. Refusing to delete.`,
    };
  }

  if (!force) {
    const metaResult = await deps.readIndexMeta();
    if (metaResult.ok && metaResult.value?.previous_version === version) {
      return {
        blocked: true,
        message:
          `Version ${version} is the rollback target (previous_version). ` +
          `Use --force to delete anyway.`,
      };
    }
  }

  return { blocked: false };
}

/**
 * Gather all versioned index names across all 6 index kinds.
 *
 * Listing failures for individual kinds are skipped (best-effort)
 * and logged as warnings by the underlying `listVersionedIndexes`.
 *
 * @param deps - Alias lifecycle deps providing `listVersionedIndexes` and `target`
 * @returns Flat array of all versioned index names found in the cluster
 */
async function gatherAllVersionedIndexNames(deps: AliasLifecycleDeps): Promise<string[]> {
  const allNames: string[] = [];
  for (const kind of SEARCH_INDEX_KINDS) {
    const listResult = await deps.listVersionedIndexes(BASE_INDEX_NAMES[kind], deps.target);
    if (listResult.ok) {
      allNames.push(...listResult.value);
    }
  }
  return allNames;
}

/** Result of resolving orphaned versions from cluster state. */
export type OrphanResolution =
  | { readonly ok: true; readonly orphans: readonly OrphanedVersion[] }
  | { readonly ok: false; readonly error: AdminError };

/**
 * Resolve orphaned versions from current cluster state.
 *
 * Queries alias targets, index metadata, and all versioned indexes
 * to identify versions that are no longer referenced.
 *
 * @param deps - Alias lifecycle deps for cluster state resolution
 * @returns Orphaned versions, or an error if alias resolution fails
 */
export async function resolveOrphanedVersions(deps: AliasLifecycleDeps): Promise<OrphanResolution> {
  deps.logger?.debug('Resolving orphaned search index versions', { target: deps.target });
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return { ok: false, error: aliasResult.error };
  }

  const liveVersions = extractLiveVersions(aliasResult.value);
  const metaResult = await deps.readIndexMeta();
  const previousVersion = metaResult.ok ? (metaResult.value?.previous_version ?? null) : null;
  const allIndexNames = await gatherAllVersionedIndexNames(deps);

  return {
    ok: true,
    orphans: identifyOrphanedVersions(liveVersions, previousVersion, allIndexNames),
  };
}
