/**
 * @module es-mapping-generators-minimal
 * @description Generators for indexes with minimal ES settings (no text analyzers).
 */

import type { EsFieldMapping } from './es-field-config.js';
import {
  UNITS_FIELD_OVERRIDES,
  META_FIELD_OVERRIDES,
  ZERO_HIT_FIELD_OVERRIDES,
} from './es-field-overrides.js';
import {
  HEADER,
  generateMinimalSettingsBlock,
  generatePropertiesBlock,
} from './es-mapping-utils.js';
import {
  UNITS_INDEX_FIELDS,
  META_INDEX_FIELDS,
  ZERO_HIT_INDEX_FIELDS,
} from './field-definitions/index.js';
import { generateEsFieldsFromDefinitions } from './es-mapping-from-fields.js';

/**
 * Creates the oak_units mapping module.
 *
 * Uses unified field definitions from UNITS_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see UNITS_INDEX_FIELDS - Single source of truth for field definitions
 * @see UNITS_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createUnitsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);

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
 *
 * Uses unified field definitions from META_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see META_INDEX_FIELDS - Single source of truth for field definitions
 * @see META_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createMetaMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(META_INDEX_FIELDS, META_FIELD_OVERRIDES);

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

/**
 * Creates the oak_zero_hit_telemetry mapping module.
 *
 * Uses unified field definitions from ZERO_HIT_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * This index tracks zero-result search queries for content gap analysis.
 *
 * @see ZERO_HIT_INDEX_FIELDS - Single source of truth for field definitions
 * @see ZERO_HIT_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createZeroHitMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(ZERO_HIT_INDEX_FIELDS, ZERO_HIT_FIELD_OVERRIDES);

  return (
    HEADER +
    `/**
 * @module oak-zero-hit-telemetry
 * @description Elasticsearch mapping for the oak_zero_hit_telemetry index.
 * Tracks zero-result search queries for content gap analysis.
 */

export const OAK_ZERO_HIT_MAPPING = {
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakZeroHitMapping = typeof OAK_ZERO_HIT_MAPPING;
`
  );
}
