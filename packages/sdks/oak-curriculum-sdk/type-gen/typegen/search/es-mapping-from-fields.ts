/**
 * @module es-mapping-from-fields
 * @description Pure functions for generating ES field mappings from field definitions.
 *
 * This module converts the shared field definitions into Elasticsearch field mappings.
 * It is used by the ES mapping generators to produce index mappings that are guaranteed
 * to match the Zod schemas generated from the same field definitions.
 *
 * @example
 * ```typescript
 * import { generateEsFieldsFromDefinitions } from './es-mapping-from-fields.js';
 * import { UNITS_INDEX_FIELDS } from './field-definitions.js';
 * import { UNITS_FIELD_OVERRIDES } from './es-field-overrides.js';
 *
 * const fields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);
 * // Returns: [['unit_id', { type: 'keyword', normalizer: 'oak_lower' }], ...]
 * ```
 */

import type { FieldDefinition, IndexFieldDefinitions } from './field-definitions.js';
import type { EsFieldMapping } from './es-field-config.js';

/**
 * Converts a single FieldDefinition to its default ES field mapping.
 *
 * This provides the base mapping before any overrides are applied:
 * - `string` → `{ type: 'keyword', normalizer: 'oak_lower' }`
 * - `number` → `{ type: 'integer' }`
 * - `array-string` → `{ type: 'keyword', normalizer: 'oak_lower' }` (ES handles multi-value)
 * - `array-number` → `{ type: 'integer' }` (ES handles multi-value)
 * - `object` → `{ type: 'keyword', normalizer: 'oak_lower' }` (expects override)
 *
 * Note: ES doesn't distinguish between single and array values - all fields can
 * hold multiple values. The optional flag is also ignored as it's a Zod concern.
 *
 * @param field - The field definition to convert
 * @returns The default ES field mapping
 *
 * @example
 * ```typescript
 * fieldDefinitionToEsMapping({ name: 'unit_id', zodType: 'string', optional: false });
 * // Returns: { type: 'keyword', normalizer: 'oak_lower' }
 * ```
 */
export function fieldDefinitionToEsMapping(field: FieldDefinition): EsFieldMapping {
  switch (field.zodType) {
    case 'string':
    case 'array-string':
    case 'object':
      // Strings and arrays of strings map to keyword
      // Objects also default to keyword but should be overridden (e.g., completion)
      return {
        type: 'keyword',
        normalizer: 'oak_lower',
      };

    case 'number':
    case 'array-number':
      // Numbers map to integer (ES handles multi-value automatically)
      return {
        type: 'integer',
      };

    default: {
      // Exhaustiveness check
      const exhaustiveCheck: never = field.zodType;
      throw new Error(`Unhandled zodType: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * Generates an array of ES field mappings from field definitions with overrides.
 *
 * For each field definition:
 * 1. If an override exists for the field name, use the override
 * 2. Otherwise, use the default mapping from `fieldDefinitionToEsMapping`
 *
 * Field order is preserved from the input definitions.
 *
 * @param fields - The field definitions to convert
 * @param overrides - Optional ES-specific field configurations keyed by field name
 * @returns Array of [fieldName, mapping] tuples ready for ES mapping generation
 *
 * @example
 * ```typescript
 * const fields = [
 *   { name: 'unit_id', zodType: 'string', optional: false },
 *   { name: 'unit_title', zodType: 'string', optional: false },
 * ];
 *
 * const overrides = {
 *   unit_title: { type: 'text', analyzer: 'standard' },
 * };
 *
 * generateEsFieldsFromDefinitions(fields, overrides);
 * // Returns:
 * // [
 * //   ['unit_id', { type: 'keyword', normalizer: 'oak_lower' }],
 * //   ['unit_title', { type: 'text', analyzer: 'standard' }],
 * // ]
 * ```
 */
export function generateEsFieldsFromDefinitions(
  fields: IndexFieldDefinitions,
  overrides: Readonly<Partial<Record<string, EsFieldMapping>>>,
): [string, EsFieldMapping][] {
  return fields.map((field): [string, EsFieldMapping] => {
    const override = overrides[field.name];

    if (override) {
      return [field.name, override];
    }

    return [field.name, fieldDefinitionToEsMapping(field)];
  });
}
