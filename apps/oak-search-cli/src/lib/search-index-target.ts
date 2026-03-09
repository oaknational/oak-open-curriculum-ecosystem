export const SEARCH_INDEX_TARGETS = ['primary', 'sandbox'] as const;
export type SearchIndexTarget = (typeof SEARCH_INDEX_TARGETS)[number];

export const ZERO_HIT_INDEX_BASE = 'oak_zero_hit_events';

export const SEARCH_INDEX_KINDS = [
  'lessons',
  'unit_rollup',
  'units',
  'sequences',
  'sequence_facets',
  'threads',
] as const;
export type SearchIndexKind = (typeof SEARCH_INDEX_KINDS)[number];

const BASE_INDEX_NAMES: Record<SearchIndexKind, string> = {
  lessons: 'oak_lessons',
  unit_rollup: 'oak_unit_rollup',
  units: 'oak_units',
  sequences: 'oak_sequences',
  sequence_facets: 'oak_sequence_facets',
  threads: 'oak_threads',
};

/**
 * Function that resolves a search index kind to a concrete Elasticsearch index name.
 *
 * Created from the target at factory time and passed through the ingestion pipeline,
 * ensuring index names are correct from the point of generation rather than requiring
 * post-hoc rewriting.
 */
export type IndexResolverFn = (kind: SearchIndexKind) => string;

/**
 * Create an index resolver function bound to a specific target.
 *
 * @param target - The index target to bind (`'primary'` or `'sandbox'`)
 * @returns A function that resolves index names for the bound target
 */
export function createIndexResolver(target: SearchIndexTarget): IndexResolverFn {
  return (kind: SearchIndexKind) => resolveSearchIndexName(kind, target);
}

/** Resolve the Elasticsearch index name for the supplied kind/target pair. */
export function resolveSearchIndexName(kind: SearchIndexKind, target: SearchIndexTarget): string {
  const baseName = BASE_INDEX_NAMES[kind];
  if (!baseName) {
    throw new Error(`Unknown search index kind: ${kind}`);
  }
  return target === 'primary' ? baseName : `${baseName}_sandbox`;
}

/** Resolve the canonical index name for the primary (production) target. */
export function resolvePrimarySearchIndexName(kind: SearchIndexKind): string {
  return resolveSearchIndexName(kind, 'primary');
}

/** Config shape for resolving search index target. */
export interface SearchIndexTargetConfig {
  readonly SEARCH_INDEX_TARGET?: SearchIndexTarget;
}

/**
 * Return the configured search index target.
 *
 * Pass a target explicitly, or pass config with SEARCH_INDEX_TARGET.
 * Callers must provide one or the other — no env fallback.
 */
export function currentSearchIndexTarget(
  targetOrConfig?: SearchIndexTarget | SearchIndexTargetConfig,
): SearchIndexTarget {
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
  kind: SearchIndexKind,
  targetOrConfig?: SearchIndexTarget | SearchIndexTargetConfig,
): string {
  return resolveSearchIndexName(kind, currentSearchIndexTarget(targetOrConfig));
}

/** Resolve the zero-hit telemetry index name for the given target. */
export function resolveZeroHitIndexName(target: SearchIndexTarget): string {
  return target === 'primary' ? ZERO_HIT_INDEX_BASE : `${ZERO_HIT_INDEX_BASE}_sandbox`;
}

/**
 * Coerce an arbitrary string (e.g. CLI flag value) into a known search index target.
 * Returns `null` when the value is not recognised.
 */
export function coerceSearchIndexTarget(value: string | undefined): SearchIndexTarget | null {
  if (!value) {
    return null;
  }
  return value === 'primary' || value === 'sandbox' ? value : null;
}
