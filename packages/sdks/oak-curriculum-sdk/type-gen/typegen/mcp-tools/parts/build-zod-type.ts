import type { ParamMetadata } from './param-metadata.js';

/**
 * Build a Zod type string from parameter metadata.
 *
 * Generates Zod schema strings that include:
 * - Type-appropriate schemas (z.string(), z.number(), etc.)
 * - z.enum() for allowed values (proper JSON Schema conversion)
 * - .describe() when description is provided (preserves metadata for MCP clients)
 *
 * @param meta - Parameter metadata from OpenAPI schema
 * @returns Zod type string (e.g., 'z.string().describe("User name")')
 */
export function buildZodType(meta: ParamMetadata): string {
  let base: string;

  if (meta.allowedValues && meta.allowedValues.length > 0) {
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
export function buildZodFields(entries: [string, ParamMetadata][]): string[] {
  return entries.map(([name, meta]) => {
    const base = buildZodType(meta);
    return `${name}: ${base}${meta.required ? '' : '.optional()'}`;
  });
}
