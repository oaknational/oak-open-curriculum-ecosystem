/**
 * @module es-mapping-generators-minimal
 * @description Generators for indexes with minimal ES settings (no text analyzers).
 */

import {
  UNITS_FIELD_OVERRIDES,
  META_FIELD_OVERRIDES,
  type EsFieldMapping,
} from './es-field-config.js';
import {
  HEADER,
  generateMinimalSettingsBlock,
  generatePropertiesBlock,
} from './es-mapping-utils.js';

/**
 * Creates the oak_units mapping module.
 */
export function createUnitsMappingModule(): string {
  const fields: [string, EsFieldMapping][] = [
    ['unit_id', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['subject_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['key_stage', { type: 'keyword', normalizer: 'oak_lower' }],
    ['years', { type: 'keyword', normalizer: 'oak_lower' }],
    ['lesson_count', { type: 'integer' }],
    ['sequence_ids', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_url', UNITS_FIELD_OVERRIDES.unit_url],
    ['subject_programmes_url', UNITS_FIELD_OVERRIDES.subject_programmes_url],
    ['updated_at', { type: 'date' }],
    ['thread_slugs', UNITS_FIELD_OVERRIDES.thread_slugs],
    ['thread_titles', UNITS_FIELD_OVERRIDES.thread_titles],
    ['thread_orders', UNITS_FIELD_OVERRIDES.thread_orders],
  ];

  return (
    HEADER +
    `/**
 * @module oak-units
 * @description Elasticsearch mapping for the oak_units index.
 * Contains basic unit metadata for filtering and navigation.
 */

export const OAK_UNITS_MAPPING = {
${generateMinimalSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakUnitsMapping = typeof OAK_UNITS_MAPPING;
`
  );
}

/**
 * Creates the oak_sequence_facets mapping module.
 */
export function createSequenceFacetsMappingModule(): string {
  const fields: [string, EsFieldMapping][] = [
    ['sequence_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['subject_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['phase_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['key_stages', { type: 'keyword', normalizer: 'oak_lower' }],
    ['years', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_count', { type: 'integer' }],
  ];

  return (
    HEADER +
    `/**
 * @module oak-sequence-facets
 * @description Elasticsearch mapping for the oak_sequence_facets index.
 * Contains sequence facet data for navigation.
 */

export const OAK_SEQUENCE_FACETS_MAPPING = {
${generateMinimalSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakSequenceFacetsMapping = typeof OAK_SEQUENCE_FACETS_MAPPING;
`
  );
}

/**
 * Creates the oak_meta mapping module.
 */
export function createMetaMappingModule(): string {
  const fields: [string, EsFieldMapping][] = [
    ['version', META_FIELD_OVERRIDES.version],
    ['ingested_at', META_FIELD_OVERRIDES.ingested_at],
    ['doc_counts', { type: 'keyword' }],
    ['duration_ms', { type: 'integer' }],
  ];

  return (
    HEADER +
    `/**
 * @module oak-meta
 * @description Elasticsearch mapping for the oak_meta index.
 * Contains ingestion metadata and version tracking.
 */

export const OAK_META_MAPPING = {
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakMetaMapping = typeof OAK_META_MAPPING;
`
  );
}
