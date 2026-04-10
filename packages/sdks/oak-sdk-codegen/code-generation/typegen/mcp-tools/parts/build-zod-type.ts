import type { ParamMetadata } from './param-metadata.js';
import {
  CANONICAL_YEAR_VALUES,
  isYearParameterRequiringNormalisation,
} from './year-normalisation.js';

/**
 * Build a z.preprocess() string that normalises year parameters from numeric
 * to canonical string format (M1-S002).
 *
 * @returns Zod preprocess string wrapping a z.enum of canonical year values
 */
function buildCanonicalYearPreprocess(): string {
  const enumValues = CANONICAL_YEAR_VALUES.map((value) => JSON.stringify(value)).join(', ');
  return `z.preprocess((val) => typeof val === 'number' && Number.isInteger(val) && val >= 1 && val <= 11 ? String(val) : val, z.enum([${enumValues}] as const))`;
}

/**
 * Build a Zod type string from parameter metadata.
 *
 * Generates Zod schema strings that include:
 * - Type-appropriate schemas (z.string(), z.number(), etc.)
 * - z.enum() for allowed values (proper JSON Schema conversion)
 * - .describe() when description is provided (preserves metadata for MCP clients)
 * - .meta() with examples in flat context when example is defined (enables AI
 *   agents to see parameter examples via Zod 4 to JSON Schema conversion)
 * - M1-S002 year normalisation for known upstream schema inconsistency
 *
 * Year parameters using z.preprocess() skip .meta() because Zod 4's
 * toJSONSchema(io:'input') strips examples from transforming schemas.
 *
 * @param meta - Parameter metadata from OpenAPI schema
 * @param paramName - Optional parameter name for name-based normalisation logic
 * @param context - Schema context ('flat' for MCP input, 'nested' for SDK invoke)
 * @returns Zod type string (e.g., `z.string().describe("...").meta(\{ examples: ["ks1"] \})`)
 */
export function buildZodType(
  meta: ParamMetadata,
  paramName?: string,
  context: 'nested' | 'flat' = 'nested',
): string {
  let base: string;

  // Year normalisation: z.preprocess wraps the entire expression.
  // .meta() is skipped because Zod 4's toJSONSchema(io:'input') strips
  // `examples` from transforming schemas. The enum constraint provides
  // sufficient guidance. See ws3-off-the-shelf-mcp-sdk-adoption.plan.md.
  const isYearPreprocess =
    context === 'flat' && paramName === 'year' && isYearParameterRequiringNormalisation(meta);

  if (isYearPreprocess) {
    base = buildCanonicalYearPreprocess();
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

  if (meta.description) {
    base = `${base}.describe(${JSON.stringify(meta.description)})`;
  }

  // Attach .meta({ examples }) for flat MCP schemas when examples exist.
  // Enables AI agents to see parameter examples via Zod 4 → JSON Schema conversion.
  if (context === 'flat' && meta.example !== undefined && !isYearPreprocess) {
    base = `${base}.meta({ examples: [${JSON.stringify(meta.example)}] })`;
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
