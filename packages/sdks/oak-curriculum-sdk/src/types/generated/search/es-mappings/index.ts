/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * Barrel exports for all Elasticsearch index mappings.
 *
 * Import mappings from this module to use in index creation.
 *
 * @example
 * ```typescript
 * import { OAK_LESSONS_MAPPING } from '@oaknational/curriculum-sdk/search/es-mappings';
 *
 * await esClient.indices.create({
 *   index: 'oak_lessons',
 *   ...OAK_LESSONS_MAPPING,
 * });
 * ```
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

export { OAK_THREADS_MAPPING } from './oak-threads.js';
export type { OakThreadsMapping } from './oak-threads.js';

export { OAK_REF_SUBJECTS_MAPPING } from './oak-ref-subjects.js';
export type { OakRefSubjectsMapping } from './oak-ref-subjects.js';

export { OAK_REF_KEY_STAGES_MAPPING } from './oak-ref-key-stages.js';
export type { OakRefKeyStagesMapping } from './oak-ref-key-stages.js';

export { OAK_CURRICULUM_GLOSSARY_MAPPING } from './oak-curriculum-glossary.js';
export type { OakCurriculumGlossaryMapping } from './oak-curriculum-glossary.js';

export { OAK_META_MAPPING } from './oak-meta.js';
export type { OakMetaMapping } from './oak-meta.js';

export { OAK_ZERO_HIT_MAPPING } from './oak-zero-hit-telemetry.js';
export type { OakZeroHitMapping } from './oak-zero-hit-telemetry.js';
