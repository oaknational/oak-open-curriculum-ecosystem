/**
 * @module generate-es-mappings
 * @description Generator for Elasticsearch index mapping TypeScript modules.
 * Produces typed ES mapping objects that can be imported by the search app.
 *
 * This generator creates mapping modules for all search indexes:
 * - oak_lessons: Lesson documents with semantic embeddings
 * - oak_units: Unit metadata
 * - oak_unit_rollup: Unit aggregated content for search
 * - oak_sequences: Programme sequence documents
 * - oak_sequence_facets: Sequence facet navigation
 * - oak_meta: Ingestion metadata
 */

import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';
import { HEADER } from './es-mapping-utils.js';
import {
  createLessonsMappingModule,
  createUnitsMappingModule,
  createUnitRollupMappingModule,
  createSequencesMappingModule,
  createSequenceFacetsMappingModule,
  createMetaMappingModule,
} from './es-mapping-generators.js';

/**
 * Creates the barrel export index module.
 */
function createEsMappingsIndexModule(): string {
  return (
    HEADER +
    `/**
 * @module es-mappings
 * @description Barrel exports for all Elasticsearch index mappings.
 * Import mappings from this module to use in index creation.
 *
 * @example
 * \`\`\`typescript
 * import { OAK_LESSONS_MAPPING } from '@oaknational/oak-curriculum-sdk/search/es-mappings';
 *
 * await esClient.indices.create({
 *   index: 'oak_lessons',
 *   ...OAK_LESSONS_MAPPING,
 * });
 * \`\`\`
 */

export { OAK_LESSONS_MAPPING } from './oak-lessons.js';
export type { OakLessonsMapping } from './oak-lessons.js';

export { OAK_UNITS_MAPPING } from './oak-units.js';
export type { OakUnitsMapping } from './oak-units.js';

export { OAK_UNIT_ROLLUP_MAPPING } from './oak-unit-rollup.js';
export type { OakUnitRollupMapping } from './oak-unit-rollup.js';

export { OAK_SEQUENCES_MAPPING } from './oak-sequences.js';
export type { OakSequencesMapping } from './oak-sequences.js';

export { OAK_SEQUENCE_FACETS_MAPPING } from './oak-sequence-facets.js';
export type { OakSequenceFacetsMapping } from './oak-sequence-facets.js';

export { OAK_META_MAPPING } from './oak-meta.js';
export type { OakMetaMapping } from './oak-meta.js';
`
  );
}

/**
 * Generates all ES mapping modules.
 *
 * @param _schema - The OpenAPI schema (not used, but kept for consistency with other generators)
 * @returns FileMap of generated modules
 */
export function generateEsMappingModules(_schema: OpenAPIObject): FileMap {
  void _schema;

  return {
    '../search/es-mappings/index.ts': createEsMappingsIndexModule(),
    '../search/es-mappings/oak-lessons.ts': createLessonsMappingModule(),
    '../search/es-mappings/oak-units.ts': createUnitsMappingModule(),
    '../search/es-mappings/oak-unit-rollup.ts': createUnitRollupMappingModule(),
    '../search/es-mappings/oak-sequences.ts': createSequencesMappingModule(),
    '../search/es-mappings/oak-sequence-facets.ts': createSequenceFacetsMappingModule(),
    '../search/es-mappings/oak-meta.ts': createMetaMappingModule(),
  };
}
