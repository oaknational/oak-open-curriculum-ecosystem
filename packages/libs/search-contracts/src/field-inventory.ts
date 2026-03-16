import {
  IndexMetaDocSchema,
  OAK_LESSONS_MAPPING,
  OAK_META_MAPPING,
  OAK_SEQUENCE_FACETS_MAPPING,
  OAK_SEQUENCES_MAPPING,
  OAK_THREADS_MAPPING,
  OAK_UNIT_ROLLUP_MAPPING,
  OAK_UNITS_MAPPING,
  SearchLessonsIndexDocSchema,
  SearchSequenceFacetsIndexDocSchema,
  SearchSequenceIndexDocSchema,
  SearchThreadIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchUnitsIndexDocSchema,
} from '@oaknational/sdk-codegen/search';
import { typeSafeKeys } from '@oaknational/type-helpers';
import type { z } from 'zod';

/**
 * Canonical index families covered by semantic-search field integrity checks.
 */
export const SEARCH_INDEX_FAMILIES = [
  'lessons',
  'units',
  'unit_rollup',
  'threads',
  'sequences',
  'sequence_facets',
  'meta',
] as const;

/**
 * Normalised field group taxonomy used across inventory and stage contracts.
 */
export const FIELD_GROUPS = [
  'identity_and_routing',
  'curriculum_context',
  'relationships',
  'pedagogical_and_domain_content',
  'semantic_and_text_search_surfaces',
  'enrichment_and_programme_metadata',
] as const;

/**
 * Field-level semantics used to distinguish required vs conditional behaviour.
 */
export const FIELD_SEMANTICS = [
  'must_be_populated',
  'optional_with_source_precondition',
  'expected_empty_with_precondition',
] as const;

export interface FieldInventoryEntry {
  readonly indexFamily: (typeof SEARCH_INDEX_FAMILIES)[number];
  readonly fieldName: string;
  readonly mappingType: string;
  readonly schemaHasField: boolean;
  readonly schemaFieldIsOptional: boolean;
  readonly fieldGroup: (typeof FIELD_GROUPS)[number];
  readonly semantics: (typeof FIELD_SEMANTICS)[number];
}

interface InventoryConfig {
  readonly mappingProperties: Record<string, { type?: string }>;
  readonly schema: z.ZodObject;
}

const INVENTORY_CONFIG: Record<(typeof SEARCH_INDEX_FAMILIES)[number], InventoryConfig> = {
  lessons: {
    mappingProperties: OAK_LESSONS_MAPPING.mappings.properties,
    schema: SearchLessonsIndexDocSchema,
  },
  units: {
    mappingProperties: OAK_UNITS_MAPPING.mappings.properties,
    schema: SearchUnitsIndexDocSchema,
  },
  unit_rollup: {
    mappingProperties: OAK_UNIT_ROLLUP_MAPPING.mappings.properties,
    schema: SearchUnitRollupDocSchema,
  },
  threads: {
    mappingProperties: OAK_THREADS_MAPPING.mappings.properties,
    schema: SearchThreadIndexDocSchema,
  },
  sequences: {
    mappingProperties: OAK_SEQUENCES_MAPPING.mappings.properties,
    schema: SearchSequenceIndexDocSchema,
  },
  sequence_facets: {
    mappingProperties: OAK_SEQUENCE_FACETS_MAPPING.mappings.properties,
    schema: SearchSequenceFacetsIndexDocSchema,
  },
  meta: {
    mappingProperties: OAK_META_MAPPING.mappings.properties,
    schema: IndexMetaDocSchema,
  },
};

function sortUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

const FIELD_GROUP_MATCHERS: readonly [
  (typeof FIELD_GROUPS)[number],
  readonly ((name: string) => boolean)[],
][] = [
  [
    'identity_and_routing',
    [
      (name) => name.endsWith('_id'),
      (name) => name.endsWith('_slug'),
      (name) => name.endsWith('_url'),
      (name) => name === 'doc_type',
    ],
  ],
  [
    'curriculum_context',
    [
      (name) => name.includes('subject'),
      (name) => name.includes('key_stage'),
      (name) => name.includes('phase'),
      (name) => name.includes('year'),
    ],
  ],
  [
    'relationships',
    [
      (name) => name.includes('thread'),
      (name) => name.includes('unit_'),
      (name) => name.includes('lesson_'),
    ],
  ],
  [
    'pedagogical_and_domain_content',
    [
      (name) => name.includes('misconception'),
      (name) => name.includes('teacher'),
      (name) => name.includes('learning'),
      (name) => name.includes('category'),
      (name) => name.includes('keyword'),
    ],
  ],
  [
    'semantic_and_text_search_surfaces',
    [
      (name) => name.includes('semantic'),
      (name) => name.includes('suggest'),
      (name) => name.includes('content'),
      (name) => name.includes('title'),
    ],
  ],
];

function inferFieldGroup(fieldName: string): (typeof FIELD_GROUPS)[number] {
  for (const [group, predicates] of FIELD_GROUP_MATCHERS) {
    if (predicates.some((predicate) => predicate(fieldName))) {
      return group;
    }
  }

  return 'enrichment_and_programme_metadata';
}

function inferSemantics(schemaFieldIsOptional: boolean): (typeof FIELD_SEMANTICS)[number] {
  return schemaFieldIsOptional ? 'optional_with_source_precondition' : 'must_be_populated';
}

function extractSchemaFieldMetadata(schema: z.ZodObject): Map<string, boolean> {
  const fieldMap = new Map<string, boolean>();
  const shape = schema.shape;
  for (const key of typeSafeKeys(shape)) {
    fieldMap.set(key, shape[key].isOptional());
  }
  return fieldMap;
}

export function createFieldInventory(): readonly FieldInventoryEntry[] {
  const entries: FieldInventoryEntry[] = [];

  for (const indexFamily of SEARCH_INDEX_FAMILIES) {
    const config = INVENTORY_CONFIG[indexFamily];
    const schemaFieldMap = extractSchemaFieldMetadata(config.schema);
    const mappingFieldNames = typeSafeKeys(config.mappingProperties);
    const schemaFieldNames = [...schemaFieldMap.keys()];
    const allFieldNames = sortUnique([...mappingFieldNames, ...schemaFieldNames]);

    for (const fieldName of allFieldNames) {
      const mappingType = config.mappingProperties[fieldName]?.type ?? 'missing_in_mapping';
      const schemaOptional = schemaFieldMap.get(fieldName);
      const schemaHasField = schemaOptional !== undefined;
      const schemaFieldIsOptional = schemaOptional ?? false;

      entries.push({
        indexFamily,
        fieldName,
        mappingType,
        schemaHasField,
        schemaFieldIsOptional,
        fieldGroup: inferFieldGroup(fieldName),
        semantics: inferSemantics(schemaFieldIsOptional),
      });
    }
  }

  return entries;
}

/**
 * Generated-artifact-derived canonical field inventory for all in-scope families.
 */
export const SEARCH_FIELD_INVENTORY = createFieldInventory();
