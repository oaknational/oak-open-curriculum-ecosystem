/**
 * Elasticsearch index name resolution.
 *
 * Pure functions that map a search index kind and target to the
 * concrete Elasticsearch index name. No environment reads —
 * the target is provided by the SDK configuration.
 */

/**
 * Known search index targets.
 *
 * - `'primary'` targets the live production indexes.
 * - `'sandbox'` targets the sandbox aliases for development and testing.
 */
export const SEARCH_INDEX_TARGETS = ['primary', 'sandbox'] as const;

/** Elasticsearch index target: `'primary'` or `'sandbox'`. */
export type SearchIndexTarget = (typeof SEARCH_INDEX_TARGETS)[number];

/**
 * Known search index kinds.
 *
 * Each kind maps to a base index name (e.g. `'lessons'` \> `'oak_lessons'`).
 */
export const SEARCH_INDEX_KINDS = [
  'lessons',
  'unit_rollup',
  'units',
  'sequences',
  'sequence_facets',
  'threads',
] as const;

/** A search index kind. */
export type SearchIndexKind = (typeof SEARCH_INDEX_KINDS)[number];

/** Base name for the zero-hit telemetry index. */
export const ZERO_HIT_INDEX_BASE = 'oak_zero_hit_events';

/** Base name for the index metadata index. */
export const INDEX_META_INDEX = 'oak_meta';

/** Document ID for the index version metadata document. */
export const INDEX_VERSION_DOC_ID = 'index_version';

/**
 * Mapping from search index kind to base Elasticsearch index name.
 *
 * Used internally by resolveSearchIndexName.
 */
const BASE_INDEX_NAMES: Readonly<Record<SearchIndexKind, string>> = {
  lessons: 'oak_lessons',
  unit_rollup: 'oak_unit_rollup',
  units: 'oak_units',
  sequences: 'oak_sequences',
  sequence_facets: 'oak_sequence_facets',
  threads: 'oak_threads',
};

/**
 * Resolve the Elasticsearch index name for a given kind and target.
 *
 * @param kind - The search index kind (e.g. `'lessons'`, `'units'`)
 * @param target - The index target (`'primary'` or `'sandbox'`)
 * @returns The concrete Elasticsearch index name
 *
 * @example
 * ```typescript
 * resolveSearchIndexName('lessons', 'primary')   // 'oak_lessons'
 * resolveSearchIndexName('lessons', 'sandbox')    // 'oak_lessons_sandbox'
 * ```
 */
export function resolveSearchIndexName(kind: SearchIndexKind, target: SearchIndexTarget): string {
  const baseName = BASE_INDEX_NAMES[kind];
  return target === 'primary' ? baseName : `${baseName}_sandbox`;
}

/**
 * Resolve the zero-hit telemetry index name for a given target.
 *
 * @param target - The index target (`'primary'` or `'sandbox'`)
 * @returns The concrete zero-hit index name
 */
export function resolveZeroHitIndexName(target: SearchIndexTarget): string {
  return target === 'primary' ? ZERO_HIT_INDEX_BASE : `${ZERO_HIT_INDEX_BASE}_sandbox`;
}

/**
 * Convenience type for a function that resolves index names.
 *
 * Created from the SDK config at factory time and passed to service
 * implementations as a closure.
 */
export type IndexResolverFn = (kind: SearchIndexKind) => string;

/**
 * Create an index resolver function bound to a specific target.
 *
 * @param target - The index target to bind
 * @returns A function that resolves index names for the bound target
 */
export function createIndexResolver(target: SearchIndexTarget): IndexResolverFn {
  return (kind: SearchIndexKind) => resolveSearchIndexName(kind, target);
}
