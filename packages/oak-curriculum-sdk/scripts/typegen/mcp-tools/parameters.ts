/**
 * MCP Tool Parameter Type Generation
 *
 * Generates discriminated unions for tool parameters based on the OpenAPI schema.
 * Each tool has strongly-typed parameters that flow from the schema.
 */

import type { ParameterObject, SchemaObject } from 'openapi-typescript';
import type { McpToolInfo } from './index.js';
import { hasEnumSchema, formatEnumValue } from './parameter-helpers.js';

/**
 * Generate ToolParameters discriminated union type
 *
 * Creates a type like:
 * ```typescript
 * export type ToolParameters<T extends McpToolName> =
 *   T extends 'oak-get-sequences-units' ? {
 *     sequence: string;
 *     year?: '1' | '2' | '3' | ... | 'all-years';
 *   } :
 *   T extends 'oak-get-lessons-transcript' ? {
 *     lesson: string;
 *   } :
 *   // ... all tools
 *   never;
 * ```
 */
export function generateToolParametersType(tools: McpToolInfo[]): string {
  const lines: string[] = [
    '/**',
    ' * Discriminated union of tool parameters',
    ' * Each tool has its own strongly-typed parameter interface',
    ' */',
    'export type ToolParameters<T extends McpToolName> =',
  ];

  for (const tool of tools) {
    lines.push(`  T extends '${tool.mcpName}' ? {`);

    // Add path parameters (always required)
    for (const paramName of tool.pathParams) {
      const param = tool.parameters.find((p) => p.name === paramName);
      const typeStr = generateParameterType(param);
      lines.push(`    ${paramName}: ${typeStr};`);
    }

    // Add query parameters (usually optional)
    for (const paramName of tool.queryParams) {
      const param = tool.parameters.find((p) => p.name === paramName);
      const required = param?.required ?? false;
      const typeStr = generateParameterType(param);
      lines.push(`    ${paramName}${required ? '' : '?'}: ${typeStr};`);
    }

    lines.push('  } :');
  }

  lines.push('  never;');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate TypeScript type string for a parameter
 */
function generateParameterType(param: ParameterObject | undefined): string {
  if (!param?.schema) {
    return 'string'; // Default for missing parameters
  }

  const schema = param.schema;

  // Handle enum types
  if (hasEnumSchema(schema)) {
    const enumValues = schema.enum
      .filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
      .map((v) => formatEnumValue(v))
      .join(' | ');
    return enumValues || 'string';
  }

  // Handle basic types
  if ('type' in schema) {
    switch (schema.type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        return generateArrayType(schema);
      case 'object':
        return generateObjectType(schema);
      default:
        return 'string'; // Fallback for unknown types
    }
  }

  return 'string'; // Fallback when no type specified
}

/**
 * Generate TypeScript type for array schemas
 */
function generateArrayType(schema: SchemaObject): string {
  if (!('items' in schema) || !schema.items) {
    return 'Array<string>'; // Default array type
  }

  const items = schema.items;
  if (typeof items !== 'object' || !items) {
    return 'Array<string>';
  }

  // Handle enum items
  if (hasEnumSchema(items)) {
    const enumValues = items.enum
      .filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
      .map((v) => formatEnumValue(v))
      .join(' | ');
    return `Array<${enumValues}>`;
  }

  // Handle basic item types
  if ('type' in items) {
    switch (items.type) {
      case 'string':
        return 'string[]';
      case 'number':
      case 'integer':
        return 'number[]';
      case 'boolean':
        return 'boolean[]';
      default:
        return 'Array<string>';
    }
  }

  return 'Array<string>';
}

/**
 * Generate TypeScript type for object schemas
 */
function generateObjectType(_schema: SchemaObject): string {
  // For now, use a generic object type
  // Could be enhanced to generate specific interfaces
  return 'Record<string, string>';
}

/**
 * Generate parameter validation functions
 */
export function generateParameterValidators(): string {
  const lines: string[] = [
    '/**',
    ' * Type predicate to check if value is a valid parameters object',
    ' */',
    'function isParametersObject(value: unknown): value is Record<string, unknown> {',
    '  return (',
    '    value !== null &&',
    '    value !== undefined &&',
    "    typeof value === 'object' &&",
    '    !Array.isArray(value)',
    '  );',
    '}',
    '',
    '/**',
    ' * Validate parameters for a specific tool',
    ' * @param toolName - The MCP tool name',
    ' * @param params - Parameters to validate',
    ' * @returns True if parameters are valid',
    ' */',
    'export function validateToolParameters<T extends McpToolName>(',
    '  toolName: T,',
    '  params: unknown',
    '): params is ToolParameters<T> {',
    '  if (!isParametersObject(params)) {',
    '    return false;',
    '  }',
    '  ',
    '  const tool = MCP_TOOLS_DATA[toolName];',
    '  if (!tool) {',
    '    return false;',
    '  }',
    '  ',
    '  // Check required path parameters using the validated object',
    '  for (const paramName of tool.pathParams) {',
    '    if (!(paramName in params)) {',
    '      return false;',
    '    }',
    '  }',
    '  ',
    '  return true;',
    '}',
    '',
  ];

  return lines.join('\n');
}

/**
 * Generate helper type for extracting parameters of a specific tool
 */
export function generateParameterHelpers(): string {
  return `/**
 * Helper type to extract parameters for a specific tool
 */
export type GetToolParameters<T extends McpToolName> = ToolParameters<T>;

/**
 * Helper type to extract the return type for a specific tool
 * (This will be connected to Zod schemas for runtime validation)
 */
export type GetToolResponse<T extends McpToolName> = 
  T extends keyof ToolResponseMap ? ToolResponseMap[T] : unknown;

/**
 * Map of tool names to their response types
 * This will be populated with actual response types from the schema
 */
export type ToolResponseMap = {
  // This will be generated from the OpenAPI response schemas
  // For now, using 'unknown' as placeholder
  [K in McpToolName]: unknown;
}

`;
}

/**
 * Generate the complete parameters module
 */
export function generateParametersModule(tools: McpToolInfo[]): string {
  const sections = [
    '/**',
    ' * MCP Tool Parameters Module',
    ' * Generated from OpenAPI schema - DO NOT EDIT MANUALLY',
    ' */',
    '',
    "import type { McpToolName } from './mcp-tools.js';",
    "import { MCP_TOOLS_DATA } from './mcp-tools.js';",
    '',
    generateToolParametersType(tools),

    /** @todo Figure out if this function should take the tools as an argument */
    generateParameterValidators(),

    generateParameterHelpers(),
  ];

  return sections.join('\n');
}
