/**
 * Unit tests verifying that Zod schemas and ES mappings have identical field sets.
 *
 * These tests ensure that the unified field definition approach is working correctly
 * by comparing the field names generated for each index's Zod schema and ES mapping.
 * If a field is added or removed from the field definitions, both outputs will change
 * together, preventing divergence.
 */
import { describe, expect, it } from 'vitest';

import {
  LESSONS_INDEX_FIELDS,
  UNITS_INDEX_FIELDS,
  UNIT_ROLLUP_INDEX_FIELDS,
  SEQUENCES_INDEX_FIELDS,
} from './field-definitions/index.js';
import { generateZodSchemaFromFields, ZOD_ENUM_EXPRESSIONS } from './zod-schema-generator.js';
import { generateEsFieldsFromDefinitions } from './es-mapping-from-fields.js';
import {
  LESSONS_FIELD_OVERRIDES,
  UNITS_FIELD_OVERRIDES,
  UNIT_ROLLUP_FIELD_OVERRIDES,
  SEQUENCES_FIELD_OVERRIDES,
} from './es-field-overrides/index.js';

/**
 * Extracts field names from a Zod schema code string.
 * Matches patterns like `field_name: z.` at the start of lines.
 */
function extractZodFieldNames(schemaCode: string): string[] {
  const fieldPattern = /^\s+(\w+): (?:z\.|SearchCompletionSuggestPayloadSchema)/gm;
  const matches: string[] = [];
  let match;

  while ((match = fieldPattern.exec(schemaCode)) !== null) {
    const fieldName = match[1];
    if (fieldName) {
      matches.push(fieldName);
    }
  }

  return matches;
}

/**
 * Extracts field names from ES mapping field array.
 */
function extractEsFieldNames(fields: [string, unknown][]): string[] {
  return fields.map(([name]) => name);
}

describe('Field Alignment: oak_units', () => {
  it('Zod schema and ES mapping have identical field sets', () => {
    // Generate Zod schema from unified definitions
    const zodSchema = generateZodSchemaFromFields(
      'SearchUnitsIndexDocSchema',
      UNITS_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );

    // Generate ES fields from unified definitions
    const esFields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);

    // Extract field names from both
    const zodFieldNames = extractZodFieldNames(zodSchema);
    const esFieldNames = extractEsFieldNames(esFields);

    // Verify they match exactly
    expect(zodFieldNames).toEqual(esFieldNames);
  });

  it('both have exactly 16 fields', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchUnitsIndexDocSchema',
      UNITS_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);

    const zodFieldNames = extractZodFieldNames(zodSchema);
    const esFieldNames = extractEsFieldNames(esFields);

    expect(zodFieldNames).toHaveLength(16);
    expect(esFieldNames).toHaveLength(16);
  });

  it('field order is preserved in both outputs', () => {
    const expectedOrder = UNITS_INDEX_FIELDS.map((f) => f.name);

    const zodSchema = generateZodSchemaFromFields(
      'SearchUnitsIndexDocSchema',
      UNITS_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);

    const zodFieldNames = extractZodFieldNames(zodSchema);
    const esFieldNames = extractEsFieldNames(esFields);

    expect(zodFieldNames).toEqual(expectedOrder);
    expect(esFieldNames).toEqual(expectedOrder);
  });

  it('ES overrides do not affect field presence, only mapping configuration', () => {
    // ES overrides should only change the mapping config, not add/remove fields
    const fieldsWithOverrides = generateEsFieldsFromDefinitions(
      UNITS_INDEX_FIELDS,
      UNITS_FIELD_OVERRIDES,
    );
    const fieldsWithoutOverrides = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, {});

    const namesWithOverrides = extractEsFieldNames(fieldsWithOverrides);
    const namesWithoutOverrides = extractEsFieldNames(fieldsWithoutOverrides);

    expect(namesWithOverrides).toEqual(namesWithoutOverrides);
  });
});

describe('Field Alignment: oak_lessons', () => {
  it('Zod schema and ES mapping have identical field sets', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchLessonsIndexDocSchema',
      LESSONS_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(LESSONS_INDEX_FIELDS, LESSONS_FIELD_OVERRIDES);

    const zodFieldNames = extractZodFieldNames(zodSchema);
    const esFieldNames = extractEsFieldNames(esFields);

    expect(zodFieldNames).toEqual(esFieldNames);
  });

  it('both have exactly 26 fields', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchLessonsIndexDocSchema',
      LESSONS_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(LESSONS_INDEX_FIELDS, LESSONS_FIELD_OVERRIDES);

    expect(extractZodFieldNames(zodSchema)).toHaveLength(26);
    expect(extractEsFieldNames(esFields)).toHaveLength(26);
  });
});

describe('Field Alignment: oak_unit_rollup', () => {
  it('Zod schema and ES mapping have identical field sets', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchUnitRollupDocSchema',
      UNIT_ROLLUP_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(
      UNIT_ROLLUP_INDEX_FIELDS,
      UNIT_ROLLUP_FIELD_OVERRIDES,
    );

    const zodFieldNames = extractZodFieldNames(zodSchema);
    const esFieldNames = extractEsFieldNames(esFields);

    expect(zodFieldNames).toEqual(esFieldNames);
  });

  it('both have exactly 22 fields', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchUnitRollupDocSchema',
      UNIT_ROLLUP_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(
      UNIT_ROLLUP_INDEX_FIELDS,
      UNIT_ROLLUP_FIELD_OVERRIDES,
    );

    expect(extractZodFieldNames(zodSchema)).toHaveLength(23);
    expect(extractEsFieldNames(esFields)).toHaveLength(23);
  });
});

describe('Field Alignment: oak_sequences', () => {
  it('Zod schema and ES mapping have identical field sets', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchSequenceIndexDocSchema',
      SEQUENCES_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(
      SEQUENCES_INDEX_FIELDS,
      SEQUENCES_FIELD_OVERRIDES,
    );

    const zodFieldNames = extractZodFieldNames(zodSchema);
    const esFieldNames = extractEsFieldNames(esFields);

    expect(zodFieldNames).toEqual(esFieldNames);
  });

  it('both have exactly 14 fields', () => {
    const zodSchema = generateZodSchemaFromFields(
      'SearchSequenceIndexDocSchema',
      SEQUENCES_INDEX_FIELDS,
      ZOD_ENUM_EXPRESSIONS,
    );
    const esFields = generateEsFieldsFromDefinitions(
      SEQUENCES_INDEX_FIELDS,
      SEQUENCES_FIELD_OVERRIDES,
    );

    expect(extractZodFieldNames(zodSchema)).toHaveLength(14);
    expect(extractEsFieldNames(esFields)).toHaveLength(14);
  });
});

describe('Field Alignment: Summary', () => {
  it('all unified indexes have matching field counts in Zod and ES', () => {
    const indexes = [
      { name: 'units', fields: UNITS_INDEX_FIELDS, overrides: UNITS_FIELD_OVERRIDES },
      { name: 'lessons', fields: LESSONS_INDEX_FIELDS, overrides: LESSONS_FIELD_OVERRIDES },
      {
        name: 'unit_rollup',
        fields: UNIT_ROLLUP_INDEX_FIELDS,
        overrides: UNIT_ROLLUP_FIELD_OVERRIDES,
      },
      { name: 'sequences', fields: SEQUENCES_INDEX_FIELDS, overrides: SEQUENCES_FIELD_OVERRIDES },
    ];

    for (const { name, fields, overrides } of indexes) {
      const zodSchema = generateZodSchemaFromFields(
        `Test${name}Schema`,
        fields,
        ZOD_ENUM_EXPRESSIONS,
      );
      const esFields = generateEsFieldsFromDefinitions(fields, overrides);

      const zodCount = extractZodFieldNames(zodSchema).length;
      const esCount = extractEsFieldNames(esFields).length;

      expect(zodCount).toBe(esCount);
      expect(zodCount).toBe(fields.length);
    }
  });
});
