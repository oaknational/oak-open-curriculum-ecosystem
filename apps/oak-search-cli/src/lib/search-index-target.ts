/**
 * CLI-specific index target helpers.
 *
 * Foundation types and constants are re-exported from the SDK
 * (single source of truth per ADR-030). This file adds CLI-only
 * concerns: config resolution, CLI flag coercion, and index
 * resolver factory.
 */

// ---------------------------------------------------------------------------
// Re-exports from SDK — single source of truth (ADR-030)
// ---------------------------------------------------------------------------

export { BASE_INDEX_NAMES } from '@oaknational/oak-search-sdk/read';

export type {
  SearchIndexTarget,
  SearchIndexKind,
  IndexResolverFn,
} from '@oaknational/oak-search-sdk/read';

// ---------------------------------------------------------------------------
// CLI-only helpers
// ---------------------------------------------------------------------------

import { BASE_INDEX_NAMES } from '@oaknational/oak-search-sdk/read';

import type {
  SearchIndexTarget,
  SearchIndexKind,
  IndexResolverFn,
} from '@oaknational/oak-search-sdk/read';

function resolveIndexName(kind: SearchIndexKind, target: SearchIndexTarget): string {
  const baseName = BASE_INDEX_NAMES[kind];
  return target === 'sandbox' ? `${baseName}_sandbox` : baseName;
}

/**
 * Resolve the canonical index name for the requested target.
 */
export function resolveSearchIndexName(kind: SearchIndexKind, target: SearchIndexTarget): string {
  return resolveIndexName(kind, target);
}

/**
 * Create an index resolver function bound to a specific target.
 *
 * @param target - The index target to bind (`'primary'` or `'sandbox'`)
 * @returns A function that resolves index names for the bound target
 */
export function createIndexResolver(target: SearchIndexTarget): IndexResolverFn {
  return (kind: SearchIndexKind) => resolveSearchIndexName(kind, target);
}

/** Resolve the canonical index name for the primary (production) target. */
export function resolvePrimarySearchIndexName(kind: SearchIndexKind): string {
  return resolveSearchIndexName(kind, 'primary');
}

interface SearchIndexTargetConfigCandidate {
  readonly SEARCH_INDEX_TARGET?: unknown;
}

/**
 * Return the configured search index target.
 *
 * Pass a target explicitly, or pass config with SEARCH_INDEX_TARGET.
 * Callers must provide one or the other — no env fallback.
 */
export function currentSearchIndexTarget(
  targetOrConfig?: SearchIndexTarget | SearchIndexTargetConfigCandidate,
): SearchIndexTarget {
  if (targetOrConfig === 'primary' || targetOrConfig === 'sandbox') {
    return targetOrConfig;
  }
  if (targetOrConfig && typeof targetOrConfig === 'object') {
    const configuredTarget = coerceSearchIndexTarget(targetOrConfig.SEARCH_INDEX_TARGET);
    if (configuredTarget !== null) {
      return configuredTarget;
    }
  }
  return 'primary';
}

/** Resolve the index name for the given target or config. */
export function resolveCurrentSearchIndexName(
  kind: SearchIndexKind,
  targetOrConfig?: SearchIndexTarget | SearchIndexTargetConfigCandidate,
): string {
  return resolveSearchIndexName(kind, currentSearchIndexTarget(targetOrConfig));
}

/**
 * Coerce an arbitrary string (e.g. CLI flag value) into a known search index target.
 * Returns `null` when the value is not recognised.
 */
export function coerceSearchIndexTarget(value: unknown): SearchIndexTarget | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }
  return value === 'primary' || value === 'sandbox' ? value : null;
}
