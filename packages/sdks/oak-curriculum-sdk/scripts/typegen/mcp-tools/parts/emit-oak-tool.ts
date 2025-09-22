import type { OperationObject } from 'openapi-typescript';
import { typeSafeKeys } from '../../../../src/types/helpers.js';
import type { ParamMetadata } from './generate-tool-file.js';

/**
 * Generates input schema from parameter metadata
 */
function generateInputSchema(
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  const pathParams = typeSafeKeys(pathParamMetadata);
  const queryParams = typeSafeKeys(queryParamMetadata);

  if (pathParams.length === 0 && queryParams.length === 0) {
    return 'z.object({})';
  }

  const schemaParts: string[] = [];

  if (pathParams.length > 0) {
    const pathFields: string[] = [];
    for (const param of pathParams) {
      const meta = pathParamMetadata[param];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!meta) {
        continue; // Skip if no metadata
      }
      const required = meta.required ? '' : '.optional()';
      const zodType = getZodTypeForParam(meta);
      if (!zodType || zodType.trim() === '') {
        continue; // Skip if no Zod type
      }
      const field = `${param}: ${zodType}${required}`;
      pathFields.push(field);
    }
    if (pathFields.length > 0) {
      schemaParts.push(`path: z.object({ ${pathFields.join(', ')} })`);
    }
  }

  if (queryParams.length > 0) {
    const queryFields: string[] = [];
    for (const param of queryParams) {
      const meta = queryParamMetadata[param];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!meta) {
        continue; // Skip if no metadata
      }
      const paramRequired = meta.required ? '' : '.optional()';
      const zodType = getZodTypeForParam(meta);
      if (!zodType || zodType.trim() === '') {
        continue; // Skip if no Zod type
      }
      const field = `${param}: ${zodType}${paramRequired}`;
      queryFields.push(field);
    }
    if (queryFields.length > 0) {
      const queryRequired = queryParams.some((p) => queryParamMetadata[p].required)
        ? ''
        : '.optional()';
      schemaParts.push(`query: z.object({ ${queryFields.join(', ')} })${queryRequired}`);
    }
  }

  return `z.object({ ${schemaParts.join(', ')} })`;
}

/**
 * Converts parameter metadata to Zod type
 */
function getZodTypeForParam(meta: ParamMetadata): string {
  if (Array.isArray(meta.allowedValues) && meta.allowedValues.length > 0) {
    const values = meta.allowedValues.map((v: unknown) => `z.literal("${String(v)}")`).join(', ');
    return `z.union([${values}])`;
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

function buildSafeName(toolName: string): string {
  const segments = toolName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return (
    (segments[0] ?? '') +
    segments
      .slice(1)
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ''))
      .join('')
  );
}

export function emitOakTool(
  toolName: string,
  path: string,
  method: string,
  _operationId: string,
  operation: OperationObject,
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  try {
    const lines: string[] = [];

    // Add debug comment
    lines.push('// DEBUG: OakMcpTool generation started');

    // Import statements
    lines.push("import { z } from 'zod';");
    lines.push("import type { ZodSchema } from 'zod';");
    lines.push('');

    // Generate schemas
    const inputSchema = generateInputSchema(pathParamMetadata, queryParamMetadata);
    const outputSchema = `getResponseSchemaForEndpoint('${method.toLowerCase()}', '${path}')`;

    // Tool definition
    const safeName = buildSafeName(toolName);
    lines.push('/**');
    lines.push(
      ' * @internal Generated Oak MCP tool stub kept for documentation and regression tests.',
    );
    lines.push(
      ' * @remarks Runtime execution flows through the ToolDescriptor entry; this stub will be replaced when tool handlers adopt schema-derived types.',
    );
    lines.push(' */');
    lines.push(`export const ${safeName}Tool: OakMcpToolBase<unknown, unknown> = {`);
    lines.push(`  name: '${toolName}',`);

    // Escape description for JavaScript string literal
    const escapedDescription = (operation.description ?? 'No description available')
      .replace(/\\/g, '\\\\') // Escape backslashes first
      .replace(/'/g, "\\'") // Escape single quotes
      .replace(/\n/g, '\\n') // Escape newlines
      .replace(/\r/g, '\\r'); // Escape carriage returns

    lines.push(`  description: '${escapedDescription}',`);
    lines.push(`  inputSchema: { type: "object", properties: {}, additionalProperties: false },`);
    lines.push(`  outputSchema: { type: "object", properties: {}, additionalProperties: false },`);
    lines.push(`  zodInputSchema: ${inputSchema},`);
    lines.push('  zodOutputSchema: z.any(), // Response schema will be resolved at runtime');
    lines.push('  validateInput: (input: unknown) => {');
    lines.push(`    const result = ${inputSchema}.safeParse(input);`);
    lines.push('    if (result.success) {');
    lines.push('      return { ok: true, data: result.data };');
    lines.push('    } else {');
    lines.push('      return { ok: false, message: result.error.message };');
    lines.push('    }');
    lines.push('  },');
    lines.push('  validateOutput: (data: unknown) => {');
    lines.push(`    const schema: ZodSchema = ${outputSchema};`);
    lines.push('    const result = schema.safeParse(data);');
    lines.push('    if (result.success) {');
    lines.push('      return { ok: true, data: result.data };');
    lines.push('    } else {');
    lines.push('      return { ok: false, message: result.error.message };');
    lines.push('    }');
    lines.push('  },');
    lines.push('  handle: async (input: unknown) => {');
    lines.push('    // This will be implemented by the actual tool implementation');
    lines.push('    // For now, just return the input to avoid unused parameter warning');
    lines.push('    await Promise.resolve(); // Satisfy ESLint require-await rule');
    lines.push('    return input;');
    lines.push('  }');
    lines.push('};');

    return lines.join('\n');
  } catch (error) {
    // Return debug info if there's an error
    return `// ERROR in emitOakTool: ${String(error)}\n// Tool: ${toolName}, Path: ${path}, Method: ${method}`;
  }
}
