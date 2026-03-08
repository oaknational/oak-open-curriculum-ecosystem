/**
 * CLI-specific index target helpers.
 *
 * Foundation types and constants are re-exported from the SDK
 * (single source of truth per ADR-030). This file adds CLI-only
 * concerns: config resolution, CLI flag coercion, and bulk
 * operation rewriting.
 */

import type { BulkOperations } from './indexing/bulk-operation-types';

// ---------------------------------------------------------------------------
// Re-exports from SDK — single source of truth (ADR-030)
// ---------------------------------------------------------------------------

export {
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  BASE_INDEX_NAMES,
  resolveSearchIndexName,
  resolveZeroHitIndexName,
} from '@oaknational/oak-search-sdk';

export type { SearchIndexTarget, SearchIndexKind } from '@oaknational/oak-search-sdk';

// ---------------------------------------------------------------------------
// CLI-only: reverse map for bulk operation rewriting
// ---------------------------------------------------------------------------

import {
  BASE_INDEX_NAMES as baseNames,
  SEARCH_INDEX_KINDS as kinds,
  resolveSearchIndexName as resolveIndexName,
} from '@oaknational/oak-search-sdk';

import type {
  SearchIndexTarget as Target,
  SearchIndexKind as Kind,
} from '@oaknational/oak-search-sdk';

const BASE_INDEX_TO_KIND = new Map<string, Kind>(kinds.map((kind) => [baseNames[kind], kind]));

// ---------------------------------------------------------------------------
// CLI-only helpers
// ---------------------------------------------------------------------------

/** Resolve the canonical index name for the primary (production) target. */
export function resolvePrimarySearchIndexName(kind: Kind): string {
  return resolveIndexName(kind, 'primary');
}

/** Config shape for resolving search index target. */
export interface SearchIndexTargetConfig {
  readonly SEARCH_INDEX_TARGET?: Target;
}

/**
 * Return the configured search index target.
 *
 * Pass a target explicitly, or pass config with SEARCH_INDEX_TARGET.
 * Callers must provide one or the other — no env fallback.
 */
export function currentSearchIndexTarget(
  targetOrConfig?: Target | SearchIndexTargetConfig,
): Target {
  if (targetOrConfig === 'primary' || targetOrConfig === 'sandbox') {
    return targetOrConfig;
  }
  if (targetOrConfig && typeof targetOrConfig === 'object' && targetOrConfig.SEARCH_INDEX_TARGET) {
    return targetOrConfig.SEARCH_INDEX_TARGET;
  }
  return 'primary';
}

/** Resolve the index name for the given target or config. */
export function resolveCurrentSearchIndexName(
  kind: Kind,
  targetOrConfig?: Target | SearchIndexTargetConfig,
): string {
  return resolveIndexName(kind, currentSearchIndexTarget(targetOrConfig));
}

/**
 * Coerce an arbitrary string (e.g. CLI flag value) into a known search index target.
 * Returns `null` when the value is not recognised.
 */
export function coerceSearchIndexTarget(value: string | undefined): Target | null {
  if (!value) {
    return null;
  }
  return value === 'primary' || value === 'sandbox' ? value : null;
}

/** Rewrite bulk operations so `_index` entries align with the selected target. */
export function rewriteBulkOperations(operations: BulkOperations, target: Target): BulkOperations {
  if (target === 'primary') {
    return [...operations];
  }

  return operations.map((entry) => {
    if (!isIndexAction(entry)) {
      return entry;
    }
    const currentIndex = entry.index._index;
    const kind = BASE_INDEX_TO_KIND.get(currentIndex);
    if (!kind) {
      return entry;
    }
    const nextIndex = resolveIndexName(kind, target);
    if (nextIndex === currentIndex) {
      return entry;
    }
    const nextAction: IndexAction = {
      index: {
        ...entry.index,
        _index: nextIndex,
      },
    };
    return nextAction;
  });
}

/**
 * Shape of an ES bulk index action's metadata.
 * Used only for bulk operation rewriting - not a general-purpose type.
 */
interface IndexMetadata {
  readonly _index: string;
}

/**
 * Shape of an ES bulk index action used in bulk operations.
 * Used only for bulk operation rewriting - not a general-purpose type.
 */
interface IndexAction {
  readonly index: IndexMetadata;
}

/**
 * Type guard to check if a value is a bulk index action.
 * Narrows directly to IndexAction without intermediate generic types.
 */
function isIndexAction(value: unknown): value is IndexAction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('index' in value)) {
    return false;
  }
  const indexProp = value.index;
  if (typeof indexProp !== 'object' || indexProp === null) {
    return false;
  }
  if (!('_index' in indexProp)) {
    return false;
  }
  return typeof indexProp._index === 'string' && indexProp._index.length > 0;
}
