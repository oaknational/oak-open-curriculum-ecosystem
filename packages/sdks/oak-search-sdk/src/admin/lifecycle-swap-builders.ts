/**
 * Pure functions for building alias swap actions (ADR-130).
 *
 * Extracted from the index lifecycle service to keep the orchestration
 * file within the max-lines limit and each function under complexity caps.
 *
 * All functions are pure — no IO, no side effects.
 */

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { SearchIndexTarget } from '../internal/index.js';
import {
  BASE_INDEX_NAMES,
  SEARCH_INDEX_KINDS,
  resolveAliasName,
  resolveVersionedIndexName,
} from '../internal/index.js';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type { AdminError } from '../types/admin-types.js';
import type {
  AliasSwap,
  AliasTargetInfo,
  AliasTargetMap,
  AliasHealthEntry,
} from '../types/index-lifecycle-types.js';

/**
 * Resolve the alias names for all 6 curriculum indexes.
 *
 * @param target - primary or sandbox
 * @returns Array of alias names
 */
export function resolveAliasNames(target: SearchIndexTarget): readonly string[] {
  return SEARCH_INDEX_KINDS.map((kind) => resolveAliasName(BASE_INDEX_NAMES[kind], target));
}

/**
 * Extract the fromIndex from alias target info.
 *
 * Returns null when the alias doesn't exist (first-run case, Wilma finding #3).
 */
function extractFromIndex(info: AliasTargetInfo | undefined): string | null {
  return info?.isAlias === true ? (info.targetIndex ?? null) : null;
}

/**
 * Build alias swap actions from current alias state to new versioned indexes.
 *
 * When an alias is already pointing to a versioned index, include a remove action.
 * When no alias exists (first-run), include only add (Wilma finding #3).
 */
export function buildSwapActions(
  currentTargets: AliasTargetMap,
  version: string,
  target: SearchIndexTarget,
): readonly AliasSwap[] {
  return SEARCH_INDEX_KINDS.map((kind) => {
    const base = BASE_INDEX_NAMES[kind];
    const alias = resolveAliasName(base, target);
    const toIndex = resolveVersionedIndexName(base, target, version);
    const fromIndex = extractFromIndex(currentTargets[kind]);
    return { fromIndex, toIndex, alias };
  });
}

/**
 * Build rollback swap actions: reverse the swap from current to previous aliases.
 *
 * Returns `err` if any alias has a null `targetIndex` — rollback cannot
 * proceed because we don't know what the alias was pointing to.
 *
 * Used when metadata write fails after a successful alias swap.
 */
export function buildRollbackSwaps(
  originalTargets: AliasTargetMap,
  newVersion: string,
  target: SearchIndexTarget,
): Result<readonly AliasSwap[], AdminError> {
  const swaps: AliasSwap[] = [];
  for (const kind of SEARCH_INDEX_KINDS) {
    const base = BASE_INDEX_NAMES[kind];
    const alias = resolveAliasName(base, target);
    const fromIndex = resolveVersionedIndexName(base, target, newVersion);
    const toIndex = originalTargets[kind].targetIndex;
    if (toIndex === null) {
      return err({
        type: 'validation_error',
        message:
          `Cannot rollback: alias '${alias}' currently has no target index ` +
          `in Elasticsearch (alias may be corrupted or missing)`,
      });
    }
    swaps.push({ fromIndex, toIndex, alias });
  }
  return ok(swaps);
}

/**
 * Build swap actions to move aliases to a specific version.
 *
 * Used by rollback to swap from current versioned indexes to previous.
 */
export function buildVersionSwapActions(
  currentTargets: AliasTargetMap,
  toVersion: string,
  target: SearchIndexTarget,
): readonly AliasSwap[] {
  return SEARCH_INDEX_KINDS.map((kind) => {
    const base = BASE_INDEX_NAMES[kind];
    const alias = resolveAliasName(base, target);
    const toIndex = resolveVersionedIndexName(base, target, toVersion);
    const fromIndex = extractFromIndex(currentTargets[kind]);
    return { fromIndex, toIndex, alias };
  });
}

/** Validate that metadata supports rollback. Returns `err` when no previous version recorded. */
export function validateRollbackMeta(
  meta: IndexMetaDoc,
): Result<{ currentVersion: string; previousVersion: string }, AdminError> {
  if (meta.previous_version === undefined) {
    return err({
      type: 'not_found',
      message: 'No previous version recorded; rollback not available',
    });
  }
  return ok({ currentVersion: meta.version, previousVersion: meta.previous_version });
}

/** Assess the health of a single alias. */
export function assessAliasHealth(
  alias: string,
  info: AliasTargetInfo | undefined,
): AliasHealthEntry {
  if (info === undefined) {
    return { alias, healthy: false, targetIndex: null, issue: 'Alias not found in ES response' };
  }
  if (!info.isAlias) {
    return {
      alias,
      healthy: false,
      targetIndex: null,
      issue: 'Name is a bare index, not an alias',
    };
  }
  if (info.targetIndex === null) {
    return { alias, healthy: false, targetIndex: null, issue: 'Alias exists but has no target' };
  }
  return { alias, healthy: true, targetIndex: info.targetIndex };
}

/**
 * Build the metadata document for a completed ingest.
 *
 * @param version - Version string for the new indexes
 * @param previousVersion - Previous live version, or null if first run
 * @param subjectFilter - Subjects ingested, or undefined for all
 * @param durationMs - Total ingest duration in milliseconds
 * @returns A fully populated {@link IndexMetaDoc}
 */
export function buildIngestMeta(
  version: string,
  previousVersion: string | null,
  subjectFilter: readonly string[] | undefined,
  durationMs: number,
): IndexMetaDoc {
  return {
    version,
    ingested_at: new Date().toISOString(),
    subjects: subjectFilter ? [...subjectFilter] : [],
    key_stages: [],
    duration_ms: durationMs,
    doc_counts: {},
    ...(previousVersion !== null ? { previous_version: previousVersion } : {}),
  };
}

/**
 * Build the metadata document for a promote operation.
 *
 * Unlike {@link buildIngestMeta}, promote metadata does not record
 * subject filter or ingest duration since those belong to the staging phase.
 *
 * @param version - Version being promoted to live
 * @param previousVersion - Previous live version, or null if first run
 * @returns A {@link IndexMetaDoc} for the promoted version
 */
export function buildPromoteMeta(version: string, previousVersion: string | null): IndexMetaDoc {
  return {
    version,
    ingested_at: new Date().toISOString(),
    subjects: [],
    key_stages: [],
    duration_ms: 0,
    doc_counts: {},
    ...(previousVersion !== null ? { previous_version: previousVersion } : {}),
  };
}
