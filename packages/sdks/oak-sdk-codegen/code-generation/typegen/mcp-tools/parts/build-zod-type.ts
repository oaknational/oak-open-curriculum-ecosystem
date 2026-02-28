import type { ParamMetadata } from './param-metadata.js';

const CANONICAL_YEAR_VALUES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  'all-years',
];

function buildCanonicalYearUnion(): string {
  const enumValues = CANONICAL_YEAR_VALUES.map((value) => JSON.stringify(value)).join(', ');
  return `z.union([z.enum([${enumValues}] as const), z.number().int().min(1).max(11).transform(String)])`;
}

function isNumericYearParameter(
  meta: ParamMetadata,
  paramName: string | undefined,
  context: 'nested' | 'flat',
): boolean {
  return (
    context === 'flat' &&
    paramName === 'year' &&
    meta.typePrimitive === 'number' &&
    !meta.valueConstraint
  );
}

/**
 * Build a Zod type string from parameter metadata.
 *
 * Generates Zod schema strings that include:
 * - Type-appropriate schemas (z.string(), z.number(), etc.)
 * - z.enum() for allowed values (proper JSON Schema conversion)
 * - .describe() when description is provided (preserves metadata for MCP clients)
 * - M1-S002 year normalisation for known upstream schema inconsistency
 *
 * @param meta - Parameter metadata from OpenAPI schema
 * @param paramName - Optional parameter name for name-based normalisation logic
 * @param context - Schema context ('flat' for MCP input, 'nested' for SDK invoke)
 * @returns Zod type string (e.g., 'z.string().describe("User name")')
 */
export function buildZodType(
  meta: ParamMetadata,
  paramName?: string,
  context: 'nested' | 'flat' = 'nested',
): string {
  let base: string;

  if (isNumericYearParameter(meta, paramName, context)) {
    base = buildCanonicalYearUnion();
  } else if (meta.allowedValues && meta.allowedValues.length > 0) {
    // Use z.enum() for proper JSON Schema conversion via zodToJsonSchema
    const values = meta.allowedValues.map((v) => JSON.stringify(v)).join(', ');
    base = `z.enum([${values}] as const)`;
  } else {
    switch (meta.typePrimitive) {
      case 'string':
        base = 'z.string()';
        break;
      case 'number':
        base = 'z.number()';
        break;
      case 'boolean':
        base = 'z.boolean()';
        break;
      case 'string[]':
        base = 'z.array(z.string())';
        break;
      case 'number[]':
        base = 'z.array(z.number())';
        break;
      case 'boolean[]':
        base = 'z.array(z.boolean())';
        break;
      default:
        base = 'z.unknown()';
    }
  }

  // Add .describe() if description exists - enables MCP SDK to preserve
  // parameter descriptions when converting Zod to JSON Schema
  if (meta.description) {
    return `${base}.describe(${JSON.stringify(meta.description)})`;
  }

  return base;
}

/**
 * Build Zod field definitions from parameter entries.
 *
 * @param entries - Array of [name, metadata] tuples
 * @returns Array of Zod field strings
 */
export function buildZodFields(
  entries: [string, ParamMetadata][],
  context: 'nested' | 'flat' = 'nested',
): string[] {
  return entries.map(([name, meta]) => {
    const base = buildZodType(meta, name, context);
    return `${name}: ${base}${meta.required ? '' : '.optional()'}`;
  });
}
