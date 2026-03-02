/**
 * Generators for primary search indexes with full ES settings.
 *
 * These indexes use text analyzers for full-text search capabilities.
 */

import {
  LESSONS_FIELD_OVERRIDES,
  UNIT_ROLLUP_FIELD_OVERRIDES,
  SEQUENCES_FIELD_OVERRIDES,
  THREADS_FIELD_OVERRIDES,
} from './es-field-config.js';
import { HEADER, generateSettingsBlock, generatePropertiesBlock } from './es-mapping-utils.js';
import {
  LESSONS_INDEX_FIELDS,
  UNIT_ROLLUP_INDEX_FIELDS,
  SEQUENCES_INDEX_FIELDS,
  THREADS_INDEX_FIELDS,
} from './field-definitions/index.js';
import { generateEsFieldsFromDefinitions } from './es-mapping-from-fields.js';

// Re-export minimal generators for convenience
export {
  createUnitsMappingModule,
  createSequenceFacetsMappingModule,
  createMetaMappingModule,
} from './es-mapping-generators-minimal.js';

/**
 * Creates the oak_lessons mapping module.
 *
 * Uses unified field definitions from LESSONS_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see LESSONS_INDEX_FIELDS - Single source of truth for field definitions
 * @see LESSONS_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createLessonsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(LESSONS_INDEX_FIELDS, LESSONS_FIELD_OVERRIDES);

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_lessons index.
 *
 * Contains lesson documents with semantic embeddings for hybrid search.
 */

export const OAK_LESSONS_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakLessonsMapping = typeof OAK_LESSONS_MAPPING;
`
  );
}

/**
 * Creates the oak_unit_rollup mapping module.
 *
 * Uses unified field definitions from UNIT_ROLLUP_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see UNIT_ROLLUP_INDEX_FIELDS - Single source of truth for field definitions
 * @see UNIT_ROLLUP_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createUnitRollupMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(
    UNIT_ROLLUP_INDEX_FIELDS,
    UNIT_ROLLUP_FIELD_OVERRIDES,
  );

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_unit_rollup index.
 *
 * Contains aggregated unit content for semantic search across lessons.
 */

export const OAK_UNIT_ROLLUP_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakUnitRollupMapping = typeof OAK_UNIT_ROLLUP_MAPPING;
`
  );
}

/**
 * Creates the oak_sequences mapping module.
 *
 * Uses unified field definitions from SEQUENCES_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see SEQUENCES_INDEX_FIELDS - Single source of truth for field definitions
 * @see SEQUENCES_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createSequencesMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(SEQUENCES_INDEX_FIELDS, SEQUENCES_FIELD_OVERRIDES);

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_sequences index.
 *
 * Contains programme sequence documents for navigation and search.
 */

export const OAK_SEQUENCES_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakSequencesMapping = typeof OAK_SEQUENCES_MAPPING;
`
  );
}

/**
 * Creates the oak_threads mapping module.
 *
 * Uses unified field definitions from THREADS_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * Threads represent curriculum progressions (e.g., Number, Algebra, Geometry)
 * that span multiple units and years, providing conceptual navigation.
 *
 * @see THREADS_INDEX_FIELDS - Single source of truth for field definitions
 * @see THREADS_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createThreadsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(THREADS_INDEX_FIELDS, THREADS_FIELD_OVERRIDES);

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_threads index.
 *
 * Contains curriculum thread documents for thread-centric navigation.
 * Threads represent conceptual progressions (e.g., Number, Algebra) that
 * span multiple units and key stages within a subject.
 */

export const OAK_THREADS_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakThreadsMapping = typeof OAK_THREADS_MAPPING;
`
  );
}
