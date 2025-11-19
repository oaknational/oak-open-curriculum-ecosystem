import type { ParamMetadata } from './param-metadata.js';

/**
 * Build a Zod type string from parameter metadata.
 *
 * @param meta - Parameter metadata
 * @returns Zod type string (e.g., "z.string()", "z.union([...])")
 */
export function buildZodType(meta: ParamMetadata): string {
  if (meta.allowedValues && meta.allowedValues.length > 0) {
    const literals = meta.allowedValues.map((value) => `z.literal(${JSON.stringify(value)})`);
    return `z.union([${literals.join(', ')}])`;
  }
  switch (meta.typePrimitive) {
    case 'string':
      return 'z.string()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'string[]':
      return 'z.array(z.string())';
    case 'number[]':
      return 'z.array(z.number())';
    case 'boolean[]':
      return 'z.array(z.boolean())';
    default:
      return 'z.unknown()';
  }
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
