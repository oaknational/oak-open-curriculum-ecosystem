/**
 * Generators for reference data indexes.
 *
 * Reference indexes store metadata about curriculum entities (subjects, key stages,
 * glossary terms) with aggregated counts. They are used for navigation, autocomplete,
 * and enrichment of primary content indexes.
 *
 * These indexes use text analysers where appropriate (for term search) but are
 * generally simpler than content indexes.
 */

import {
  REF_SUBJECTS_FIELD_OVERRIDES,
  REF_KEY_STAGES_FIELD_OVERRIDES,
  CURRICULUM_GLOSSARY_FIELD_OVERRIDES,
} from './es-field-overrides/index.js';
import {
  HEADER,
  generateSettingsBlock,
  generateMinimalSettingsBlock,
  generatePropertiesBlock,
} from './es-mapping-utils.js';
import {
  REF_SUBJECTS_INDEX_FIELDS,
  REF_KEY_STAGES_INDEX_FIELDS,
  CURRICULUM_GLOSSARY_INDEX_FIELDS,
} from './field-definitions/index.js';
import { generateEsFieldsFromDefinitions } from './es-mapping-from-fields.js';

/**
 * Creates the oak_ref_subjects mapping module.
 *
 * Uses unified field definitions from REF_SUBJECTS_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * Subject reference data provides metadata about subjects for navigation,
 * filtering, and autocomplete.
 *
 * @see REF_SUBJECTS_INDEX_FIELDS - Single source of truth for field definitions
 * @see REF_SUBJECTS_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createRefSubjectsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(
    REF_SUBJECTS_INDEX_FIELDS,
    REF_SUBJECTS_FIELD_OVERRIDES,
  );

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_ref_subjects index.
 *
 * Contains subject metadata with aggregated counts for navigation and filtering.
 */

export const OAK_REF_SUBJECTS_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakRefSubjectsMapping = typeof OAK_REF_SUBJECTS_MAPPING;
`
  );
}

/**
 * Creates the oak_ref_key_stages mapping module.
 *
 * Uses unified field definitions from REF_KEY_STAGES_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * Key stage reference data provides metadata about key stages for navigation
 * and filtering.
 *
 * @see REF_KEY_STAGES_INDEX_FIELDS - Single source of truth for field definitions
 * @see REF_KEY_STAGES_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createRefKeyStagesMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(
    REF_KEY_STAGES_INDEX_FIELDS,
    REF_KEY_STAGES_FIELD_OVERRIDES,
  );

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_ref_key_stages index.
 *
 * Contains key stage metadata with aggregated counts for navigation and filtering.
 */

export const OAK_REF_KEY_STAGES_MAPPING = {
${generateMinimalSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakRefKeyStagesMapping = typeof OAK_REF_KEY_STAGES_MAPPING;
`
  );
}

/**
 * Creates the oak_curriculum_glossary mapping module.
 *
 * Uses unified field definitions from CURRICULUM_GLOSSARY_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * Glossary data provides curriculum term definitions for glossary lookups,
 * enrichment, and semantic search.
 *
 * @see CURRICULUM_GLOSSARY_INDEX_FIELDS - Single source of truth for field definitions
 * @see CURRICULUM_GLOSSARY_FIELD_OVERRIDES - ES-specific field configurations
 */
export function createCurriculumGlossaryMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(
    CURRICULUM_GLOSSARY_INDEX_FIELDS,
    CURRICULUM_GLOSSARY_FIELD_OVERRIDES,
  );

  return (
    HEADER +
    `/**
 * Elasticsearch mapping for the oak_curriculum_glossary index.
 *
 * Contains curriculum term definitions with semantic search capabilities.
 */

export const OAK_CURRICULUM_GLOSSARY_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakCurriculumGlossaryMapping = typeof OAK_CURRICULUM_GLOSSARY_MAPPING;
`
  );
}
