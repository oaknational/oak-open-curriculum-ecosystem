/**
 * MCP Tool Validator Mapping
 *
 * Maps MCP tool names to their corresponding Zod validators.
 * This enables runtime validation of API responses for each tool.
 * ALL mappings are generated from the OpenAPI schema - NO HARDCODING.
 */

import type { OpenAPI3 } from 'openapi-typescript';
import type { McpToolInfo } from './index.js';
import { generateValidatorMappingCode } from './schema-mapper.js';

/**
 * Generate the mapping between MCP tool names and Zod validators
 *
 * Creates code like:
 * ```typescript
 * export const MCP_TOOL_VALIDATORS = {
 *   'oak-get-sequences-units': schemas.SequenceUnitsResponseSchema,
 *   'oak-get-lessons-transcript': schemas.LessonTranscriptResponseSchema,
 *   // ... all tools
 * } as const;
 * ```
 */

/**
 * Generate imports section
 */
function generateImports(): string[] {
  const lines: string[] = [];

  lines.push("import type { McpToolName } from './mcp-tools.js';");
  lines.push("import { z } from 'zod';");
  lines.push('');
  lines.push('// Import schemas object from generated Zod endpoints');
  lines.push("import { schemas } from '../zod/endpoints.js';");

  return lines;
}

/**
 * Generate helper types and functions
 */
function generateHelpers(): string[] {
  return [
    '/**',
    ' * Helper type to extract the validated response type for a tool',
    ' */',
    'export type GetToolValidatedResponse<T extends McpToolName> =',
    '  T extends keyof typeof MCP_TOOL_VALIDATORS',
    '    ? z.infer<typeof MCP_TOOL_VALIDATORS[T]>',
    '    : unknown;',
    '',
    '/**',
    ' * Validate a response for a specific tool',
    ' * @param toolName - The MCP tool name',
    ' * @param response - The response to validate',
    ' * @returns The validated response',
    ' * @throws ZodError if validation fails',
    ' */',
    'export function validateToolResponse<T extends McpToolName>(',
    '  toolName: T,',
    '  response: unknown',
    '): GetToolValidatedResponse<T> {',
    '  const validator = MCP_TOOL_VALIDATORS[toolName];',
    '  if (!validator) {',
    '    throw new Error(`No validator found for tool: ${toolName}`);',
    '  }',
    '  return validator.parse(response) as GetToolValidatedResponse<T>;',
    '}',
  ];
}

export function generateValidatorMapping(schema: OpenAPI3, tools: McpToolInfo[]): string {
  // Generate the mapping code from the schema - NO HARDCODING
  const validatorEntries = generateValidatorMappingCode(schema, tools);

  const sections = [
    ...generateImports(),
    '/**',
    ' * MCP Tool Validator Mapping',
    ' * Generated from OpenAPI schema - DO NOT EDIT MANUALLY',
    ' * ',
    ' * Maps tool names to their corresponding Zod validators.',
    ' * This enables runtime validation at the API boundary (ADR-032).',
    ' * ALL mappings flow from the schema - NO HARDCODING.',
    ' */',
    '',
    '',
    '/**',
    ' * Map of MCP tool names to their Zod validators',
    ' * Used for runtime validation of API responses',
    ' */',
    'export const MCP_TOOL_VALIDATORS = {',
    validatorEntries,
    '} as const;',
    '',
    ...generateHelpers(),
    '',
  ];

  return sections.join('\n');
}

/**
 * Generate the complete validators module
 */
export function generateValidatorsModule(schema: OpenAPI3, tools: McpToolInfo[]): string {
  return generateValidatorMapping(schema, tools);
}
