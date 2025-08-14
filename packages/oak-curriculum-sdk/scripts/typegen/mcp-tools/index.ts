/**
 * MCP Tool Generation from OpenAPI Schema
 *
 * This module generates all MCP tool types and data structures from the OpenAPI schema.
 * Everything flows from the schema - types, type guards, Zod validators, and tool definitions.
 *
 * Central Contract: When the API changes, running type-gen is the ONLY action required.
 */

import type {
  OpenAPI3,
  OperationObject,
  ParameterObject,
  PathItemObject,
} from 'openapi-typescript';
import { generateMcpToolName } from './name-generator.js';
import { sanitizeParameterName } from './parameter-helpers.js';

/**
 * MCP tool information extracted from OpenAPI operation
 */
export interface McpToolInfo {
  /** MCP tool name (e.g., 'oak-get-lessons-summary') */
  mcpName: string;
  /** OpenAPI path (e.g., '/lessons/{lesson}/summary') */
  path: string;
  /** HTTP method (lowercase) */
  method: string;
  /** Operation ID from OpenAPI */
  operationId: string;
  /** Description from OpenAPI */
  description?: string;
  /** Path parameters */
  pathParams: string[];
  /** Query parameters */
  queryParams: string[];
  /** All parameters with their schemas */
  parameters: ParameterObject[];
}

/**
 * Extract parameters from an operation
 */
function extractOperationParameters(operation: OperationObject): {
  pathParams: string[];
  queryParams: string[];
  parameters: ParameterObject[];
} {
  const pathParams: string[] = [];
  const queryParams: string[] = [];
  const parameters: ParameterObject[] = [];

  if (!operation.parameters) {
    return { pathParams, queryParams, parameters };
  }

  for (const param of operation.parameters) {
    // Skip reference objects
    if ('$ref' in param) continue;

    // Sanitize the parameter name to avoid reserved words
    const sanitizedName = sanitizeParameterName(param.name);

    // Create sanitized parameter object
    const sanitizedParam: ParameterObject = {
      ...param,
      name: sanitizedName,
    };

    // Type narrowing - param is ParameterObject after $ref check
    parameters.push(sanitizedParam);

    if (param.in === 'path') {
      pathParams.push(sanitizedName);
    } else if (param.in === 'query') {
      queryParams.push(sanitizedName);
    }
  }

  return { pathParams, queryParams, parameters };
}

/**
 * Process a single operation and create MCP tool info
 */
function processOperation(path: string, method: string, operation: OperationObject): McpToolInfo {
  const mcpName = generateMcpToolName(path, method, operation.operationId);
  const { pathParams, queryParams, parameters } = extractOperationParameters(operation);

  return {
    mcpName,
    path,
    method,
    operationId: operation.operationId ?? `${method}-${path}`,
    description: operation.description ?? operation.summary,
    pathParams,
    queryParams,
    parameters,
  };
}

/**
 * Process all operations in a path item
 */
function processPathItem(path: string, pathItem: PathItemObject): McpToolInfo[] {
  const tools: McpToolInfo[] = [];
  const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;

  for (const method of methods) {
    const operation = pathItem[method];
    if (!operation || typeof operation !== 'object') continue;

    const tool = processOperation(path, method, operation);
    tools.push(tool);
  }

  return tools;
}

/**
 * Extract all MCP tools from OpenAPI schema
 * Pure function - derives everything from schema
 */
export function extractMcpTools(schema: OpenAPI3): McpToolInfo[] {
  if (!schema.paths) {
    return [];
  }

  const tools: McpToolInfo[] = [];

  for (const [path, pathItem] of Object.entries(schema.paths)) {
    if (!pathItem || typeof pathItem !== 'object' || '$ref' in pathItem) {
      continue;
    }

    // Type guard ensures pathItem is not a ReferenceObject
    // processPathItem expects PathItemObject which pathItem now is
    tools.push(...processPathItem(path, pathItem));
  }

  return tools;
}

/**
 * Generate MCP_TOOLS_DATA constant
 */
export function generateMcpToolsData(tools: McpToolInfo[]): string {
  const lines: string[] = [
    '/**',
    ' * MCP Tools Data Structure',
    ' * Generated from OpenAPI schema - DO NOT EDIT MANUALLY',
    ' * ',
    ' * This is the single source of truth for all MCP tools.',
    ' * Everything flows from this: types, type guards, validators.',
    ' */',
    'export const MCP_TOOLS_DATA = {',
  ];

  for (const tool of tools) {
    lines.push(`  '${tool.mcpName}': {`);
    lines.push(`    path: '${tool.path}',`);
    lines.push(`    method: '${tool.method}' as const,`);
    lines.push(`    operationId: '${tool.operationId}',`);

    if (tool.description) {
      lines.push(`    description: ${JSON.stringify(tool.description)},`);
    }

    lines.push(`    pathParams: [${tool.pathParams.map((p) => `'${p}'`).join(', ')}] as const,`);
    lines.push(`    queryParams: [${tool.queryParams.map((p) => `'${p}'`).join(', ')}] as const,`);
    lines.push('  },');
  }

  lines.push('} as const;');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate McpToolName type (literal union)
 */
export function generateMcpToolNameType(tools: McpToolInfo[]): string {
  const lines: string[] = [
    '/**',
    ' * Literal union of all MCP tool names',
    ' * This enables compile-time type safety for tool names',
    ' */',
    'export type McpToolName = keyof typeof MCP_TOOLS_DATA;',
    `// ${tools.map((t) => `'${t.mcpName}'`).join(' | ')}`,
    '',
  ];

  return lines.join('\n');
}

/**
 * Generate type guard for McpToolName
 */
export function generateMcpToolNameGuard(): string {
  return `/**
 * Type guard to check if a value is a valid MCP tool name
 * @param value - Unknown value to check
 * @returns True if value is a valid McpToolName
 */
export function isMcpToolName(value: unknown): value is McpToolName {
  return typeof value === 'string' && value in MCP_TOOLS_DATA;
}

`;
}

/**
 * Generate the complete MCP tools module
 */
export function generateMcpToolsModule(schema: OpenAPI3): string {
  const tools = extractMcpTools(schema);

  const sections = [
    '/**',
    ' * MCP Tools Module',
    ' * Generated from OpenAPI schema - DO NOT EDIT MANUALLY',
    ' * ',
    ' * Central Contract: Everything flows from the OpenAPI schema.',
    " * When the API changes, re-run type-gen. That's it.",
    ' */',
    '',
    generateMcpToolsData(tools),
    generateMcpToolNameType(tools),
    generateMcpToolNameGuard(),
    '/**',
    ' * Get tool information by name',
    ' * @param name - MCP tool name',
    ' * @returns Tool information or undefined',
    ' */',
    'export function getMcpTool<T extends McpToolName>(name: T): typeof MCP_TOOLS_DATA[T] {',
    '  return MCP_TOOLS_DATA[name];',
    '}',
    '',
  ];

  return sections.join('\n');
}
