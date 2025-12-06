/**
 * @module zod-schema-generator
 * @description Pure functions for generating Zod schema code from field definitions.
 *
 * This module converts the shared field definitions into Zod schema TypeScript code.
 * It is used by the search index document generator to produce `SearchUnitsIndexDocSchema`
 * and other index document schemas.
 *
 * It also generates per-index completion context schemas from the single source of truth
 * in `completion-contexts.ts`, ensuring compile-time enforcement of valid contexts.
 *
 * @example
 * ```typescript
 * import { generateZodSchemaFromFields, ZOD_ENUM_EXPRESSIONS } from './zod-schema-generator.js';
 * import { UNITS_INDEX_FIELDS } from './field-definitions.js';
 *
 * const schemaCode = generateZodSchemaFromFields('SearchUnitsIndexDocSchema', UNITS_INDEX_FIELDS, ZOD_ENUM_EXPRESSIONS);
 * // Produces: export const SearchUnitsIndexDocSchema = z.object({ ... }).strict();
 * ```
 */

import type { FieldDefinition, IndexFieldDefinitions } from './field-definitions.js';
import type { CompletionContextName } from './completion-contexts.js';

/**
 * Maps enum reference names to their full Zod enum expressions.
 *
 * These expressions are used in generated schemas to provide proper type inference
 * from the KEY_STAGES and SUBJECTS constants.
 */
export const ZOD_ENUM_EXPRESSIONS: Readonly<Record<string, string>> = {
  KEY_STAGE_TUPLE:
    'KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]',
  SUBJECT_TUPLE: 'SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]',
} as const;

/**
 * Options for Zod field code generation.
 */
export interface ZodFieldCodeOptions {
  /**
   * Map of enum reference names to their full Zod expressions.
   * If not provided, enum references are used as-is.
   */
  readonly enumExpressions?: Readonly<Record<string, string>>;
}

/**
 * Generates a single Zod field definition code string.
 *
 * Maps FieldDefinition to Zod schema builder calls:
 * - `string` → `z.string().min(1)`
 * - `string` with enumRef → `z.enum(${resolvedEnumExpression})`
 * - `number` → `z.number().int().nonnegative()`
 * - `array-string` → `z.array(z.string().min(1))`
 * - `array-number` → `z.array(z.number())`
 * - `object` → `SearchCompletionSuggestPayloadSchema`
 *
 * @param field - The field definition to convert
 * @param options - Optional configuration for enum expression resolution
 * @returns The Zod field code as a string (e.g., `unit_id: z.string().min(1),`)
 *
 * @example
 * ```typescript
 * generateZodFieldCode({ name: 'unit_id', zodType: 'string', optional: false });
 * // Returns: 'unit_id: z.string().min(1),'
 *
 * generateZodFieldCode(
 *   { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
 *   { enumExpressions: ZOD_ENUM_EXPRESSIONS }
 * );
 * // Returns: 'subject_slug: z.enum(SUBJECTS as unknown as [...]),'
 * ```
 */
export function generateZodFieldCode(
  field: FieldDefinition,
  options?: ZodFieldCodeOptions,
): string {
  let zodExpression: string;

  switch (field.zodType) {
    case 'string':
      if (field.enumRef) {
        const enumExpression = options?.enumExpressions?.[field.enumRef] ?? field.enumRef;
        zodExpression = `z.enum(${enumExpression})`;
      } else {
        zodExpression = 'z.string().min(1)';
      }
      break;

    case 'number':
      zodExpression = 'z.number().int().nonnegative()';
      break;

    case 'array-string':
      zodExpression = 'z.array(z.string().min(1))';
      break;

    case 'array-number':
      zodExpression = 'z.array(z.number())';
      break;

    case 'object':
      // Object fields reference SearchCompletionSuggestPayloadSchema
      zodExpression = 'SearchCompletionSuggestPayloadSchema';
      break;

    default: {
      // Exhaustiveness check
      const exhaustiveCheck: never = field.zodType;
      throw new Error(`Unhandled zodType: ${String(exhaustiveCheck)}`);
    }
  }

  if (field.optional) {
    zodExpression += '.optional()';
  }

  return `${field.name}: ${zodExpression},`;
}

/**
 * Generates a complete Zod schema definition from field definitions.
 *
 * Produces TypeScript code in the form:
 * ```typescript
 * export const SchemaName = z
 *   .object({
 *     field1: z.string().min(1),
 *     field2: z.number().int().nonnegative(),
 *   })
 *   .strict();
 * ```
 *
 * @param schemaName - The name of the exported schema constant
 * @param fields - The field definitions to include in the schema
 * @param enumExpressions - Optional map of enum refs to their full Zod expressions
 * @returns The complete Zod schema code as a string
 *
 * @example
 * ```typescript
 * const code = generateZodSchemaFromFields(
 *   'SearchUnitsIndexDocSchema',
 *   UNITS_INDEX_FIELDS,
 *   ZOD_ENUM_EXPRESSIONS
 * );
 * ```
 */
export function generateZodSchemaFromFields(
  schemaName: string,
  fields: IndexFieldDefinitions,
  enumExpressions?: Readonly<Record<string, string>>,
): string {
  const options: ZodFieldCodeOptions = enumExpressions ? { enumExpressions } : {};
  const fieldLines = fields.map((field) => `    ${generateZodFieldCode(field, options)}`);

  return [
    `export const ${schemaName} = z`,
    '  .object({',
    ...fieldLines,
    '  })',
    '  .strict();',
  ].join('\n');
}

/**
 * Generates a per-index completion contexts Zod schema.
 *
 * Creates a strict Zod object schema that only allows the specified context names.
 * Each context is an optional array of strings (matching ES completion context structure).
 *
 * This ensures that at compile time, documents cannot include contexts that are not
 * defined in the ES mapping for that index.
 *
 * @param schemaName - The name of the exported schema constant
 * @param contexts - The readonly tuple of allowed context names for this index
 * @returns The complete Zod schema code as a string
 *
 * @example
 * ```typescript
 * import { LESSONS_COMPLETION_CONTEXTS } from './completion-contexts.js';
 *
 * const code = generateCompletionContextsSchema(
 *   'SearchLessonsCompletionContextsSchema',
 *   LESSONS_COMPLETION_CONTEXTS
 * );
 * // Produces a schema that only allows 'subject' and 'key_stage' contexts
 * ```
 */
export function generateCompletionContextsSchema(
  schemaName: string,
  contexts: readonly CompletionContextName[],
): string {
  const fieldLines = contexts.map(
    (contextName) => `    ${contextName}: z.array(z.string().min(1)).optional(),`,
  );

  return [
    `export const ${schemaName} = z`,
    '  .object({',
    ...fieldLines,
    '  })',
    '  .strict();',
  ].join('\n');
}
