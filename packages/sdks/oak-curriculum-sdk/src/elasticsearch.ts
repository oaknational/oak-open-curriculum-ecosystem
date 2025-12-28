/**
 * Elasticsearch Infrastructure Types
 *
 * Type-safe Elasticsearch structures for index creation, search requests,
 * and observability operations. All Elasticsearch-related imports MUST
 * come through this entry point to maintain boundary discipline.
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   EsIndexBody,
 *   EsSearchBody,
 *   OAK_ZERO_HIT_MAPPING
 * } from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
 * ```
 *
 * ## Architecture
 *
 * These types are generated at compile time from field definitions in
 * `type-gen/typegen/search/field-definitions/`. Never edit generated
 * files directly - always update the generators.
 *
 * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html}
 */

// ============================================================================
// Elasticsearch Request/Response Types
// ============================================================================

/**
 * Type-safe Elasticsearch request and response structures.
 * Replaces generic `Record<string, unknown>` with specific types.
 */
export type {
  /** Index creation body structure */
  EsIndexBody,
  /** ILM policy definition structure */
  EsIlmPolicyBody,
  /** Search request body structure */
  EsSearchBody,
  /** Hit source structure in search results */
  EsHitSource,
  /** Individual search hit structure */
  EsSearchHit,
  /** Search hits collection structure */
  EsSearchHits,
  /** Search aggregations structure */
  EsSearchAggregations,
  /** Complete search response structure */
  EsSearchResponse,
  /** Elasticsearch mappings structure */
  EsMappings,
  /** Elasticsearch settings structure */
  EsSettings,
} from './types/es-types.js';

// ============================================================================
// Curriculum Index Mappings
// ============================================================================

/**
 * Generated Elasticsearch index mappings for curriculum content.
 * These flow from field definitions in `field-definitions/curriculum.ts`.
 */
export {
  /** oak_lessons index mapping */
  OAK_LESSONS_MAPPING,
  /** oak_units index mapping */
  OAK_UNITS_MAPPING,
  /** oak_unit_rollup index mapping */
  OAK_UNIT_ROLLUP_MAPPING,
  /** oak_sequences index mapping */
  OAK_SEQUENCES_MAPPING,
  /** oak_sequence_facets index mapping */
  OAK_SEQUENCE_FACETS_MAPPING,
  /** oak_threads index mapping */
  OAK_THREADS_MAPPING,
} from './types/generated/search/es-mappings/index.js';

export type {
  OakLessonsMapping,
  OakUnitsMapping,
  OakUnitRollupMapping,
  OakSequencesMapping,
  OakSequenceFacetsMapping,
  OakThreadsMapping,
} from './types/generated/search/es-mappings/index.js';

// ============================================================================
// Observability Index Mappings
// ============================================================================

/**
 * Generated Elasticsearch index mappings for system observability.
 * These flow from field definitions in `field-definitions/observability.ts`.
 */
export {
  /** oak_meta index mapping - tracks index versions and metadata */
  OAK_META_MAPPING,
  /** oak_zero_hit_telemetry index mapping - tracks zero-result searches */
  OAK_ZERO_HIT_MAPPING,
} from './types/generated/search/es-mappings/index.js';

export type {
  OakMetaMapping,
  OakZeroHitMapping,
} from './types/generated/search/es-mappings/index.js';
