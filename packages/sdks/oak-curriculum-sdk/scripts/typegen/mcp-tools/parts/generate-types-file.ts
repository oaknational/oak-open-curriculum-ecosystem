import { typeSafeEntries } from '../../../../src/types/helpers.js';

function headerBlock(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Type definitions and guards for MCP tools
 */

import {
  type Tool as BaseTool,
} from '@modelcontextprotocol/sdk/types.js';
import type { ZodSchema } from 'zod';
import type { OakApiPathBasedClient } from '../../../../client/index.js';
import type { ToolInputJsonSchema } from '../../../../mcp/zod-input-schema.js';
`;
}

function toolDescriptorBlock(): string {
  return [
    '// Minimal shape to avoid leaking per-tool internal types (e.g. ValidRequestParams)',
    'export interface ToolDescriptor extends BaseTool {',
    '  readonly invoke: (client: OakApiPathBasedClient, _params: unknown) => Promise<unknown>;',
    '  readonly inputSchema: ToolInputJsonSchema;',
    '  readonly operationId: string;',
    '  readonly name: string;',
    '  readonly description: string;',
    '  readonly path: string;',
    '  readonly method: string;',
    '  readonly pathParams: Readonly<Record<string, { readonly required?: boolean }>>;',
    '  readonly queryParams: Readonly<Record<string, { readonly required?: boolean }>>;',
    '}',
  ].join('\n');
}

function mappingBlock(
  operationIdMap: Record<string, { toolName: string; operationId: string }>,
): string {
  const lines: string[] = [];
  lines.push('/**\n * Operation ID to tool name mapping\n */');
  lines.push('const operationIdToToolName = {');
  for (const [operationId, mapping] of typeSafeEntries(operationIdMap)) {
    lines.push(`  '${operationId}': {`);
    lines.push(`    toolName: '${mapping.toolName}',`);
    lines.push(`    operationIdKey: '${operationId}',`);
    lines.push('  },');
  }
  lines.push('} as const;');
  lines.push('');
  // Reverse mapping for runtime guards without array scans
  lines.push('const toolNameToOperationId = {');
  for (const [operationId, mapping] of typeSafeEntries(operationIdMap)) {
    lines.push(`  '${mapping.toolName}': '${operationId}',`);
  }
  lines.push('} as const;');
  lines.push('');
  // Strongly-typed views over the maps
  lines.push('export type OperationIdToToolNameMap = typeof operationIdToToolName;');
  lines.push('export type AllOperationIds = keyof OperationIdToToolNameMap;');
  lines.push('export type AllToolNames = OperationIdToToolNameMap[AllOperationIds]["toolName"];');
  lines.push('export type ToolNameToOperationIdMap = typeof toolNameToOperationId;');
  lines.push('');
  // Guards and helpers
  lines.push('/**');
  lines.push('* Type guard for operation IDs');
  lines.push('*/');
  lines.push(
    'function isOperationId(operationId: string): operationId is AllOperationIds { return operationId in operationIdToToolName; }',
  );
  lines.push('');
  lines.push('/**');
  lines.push('* Type guard for tool names');
  lines.push('*/');
  lines.push(
    'export function isToolName(value: unknown): value is AllToolNames { return typeof value === "string" && value in toolNameToOperationId; }',
  );
  lines.push('');
  lines.push('export function getToolNameFromOperationId(operationId: string): AllToolNames {');
  lines.push('  if (!isOperationId(operationId)) {');
  lines.push('    const allowed: AllOperationIds[] = [];');
  lines.push('    for (const key in operationIdToToolName) {');
  lines.push('      if (key in operationIdToToolName) {');
  lines.push('        allowed.push(key as AllOperationIds);');
  lines.push('      }');
  lines.push('    }');
  lines.push(
    '    throw new TypeError(`Invalid operation ID: ${operationId}. Allowed values: ${allowed.join(", ")}`);',
  );
  lines.push('  }');
  lines.push('  return operationIdToToolName[operationId].toolName;');
  lines.push('}');

  // Add OakMcp types for compatibility with @modelcontextprotocol/sdk
  lines.push('');
  lines.push('/**');
  lines.push(' * OakMcp types that extend @modelcontextprotocol/sdk types for compatibility');
  lines.push(' * Uses Zod schemas for validation instead of custom validation logic');
  lines.push(' */');
  lines.push('');
  lines.push('export interface ZodValidator<T> {');
  lines.push('  validate(data: unknown): { ok: true; data: T } | { ok: false; message: string };');
  lines.push('}');
  lines.push('');
  lines.push('export interface ToolHandler<ToolInput, ToolOutput> {');
  lines.push('  handle(args: ToolInput): Promise<ToolOutput>;');
  lines.push('}');
  lines.push('');
  lines.push("type BaseInputSchema = BaseTool['inputSchema'];");
  lines.push("type BaseOutputSchema = BaseTool['outputSchema'];");
  lines.push('');
  lines.push('export interface OakInputSchemaBase extends BaseInputSchema {');
  lines.push("  readonly type: 'object';");
  lines.push('  readonly zodSchema: ZodSchema;');
  lines.push(
    '  readonly validate: (args: unknown) => { ok: true; data: unknown } | { ok: false; message: string };',
  );
  lines.push('}');
  lines.push('');
  lines.push('export type OakOutputSchemaBase = BaseOutputSchema & {');
  lines.push("  readonly type: 'object';");
  lines.push('  readonly zodSchema: ZodSchema;');
  lines.push(
    '  readonly validate: (result: unknown) => { ok: true; data: unknown } | { ok: false; message: string };',
  );
  lines.push('}');
  lines.push('');
  lines.push('export interface OakMcpToolBase<ToolInput, ToolOutput> extends BaseTool {');
  lines.push('  readonly inputSchema: BaseTool["inputSchema"];');
  lines.push('  readonly outputSchema: BaseTool["outputSchema"];');
  lines.push('  readonly zodInputSchema: ZodSchema<ToolInput>;');
  lines.push('  readonly zodOutputSchema: ZodSchema<ToolOutput>;');
  lines.push(
    '  readonly validateInput: (args: unknown) => { ok: true; data: ToolInput } | { ok: false; message: string };',
  );
  lines.push(
    '  readonly validateOutput: (result: unknown) => { ok: true; data: ToolOutput } | { ok: false; message: string };',
  );
  lines.push('  readonly handle: (args: ToolInput) => Promise<ToolOutput>;');
  lines.push('}');

  return lines.join('\n');
}

function zodMappingBlock(
  operationIdMap: Record<string, { toolName: string; operationId: string }>,
): string {
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * Dynamic mapping from operation IDs to Zod schemas');
  lines.push(' * Generated at compile time from OpenAPI schema and Zod endpoints');
  lines.push(' */');
  lines.push('export const operationIdToZodSchemas = {');

  for (const [operationId, mapping] of typeSafeEntries(operationIdMap)) {
    lines.push(`  '${operationId}': {`);
    lines.push(`    toolName: '${mapping.toolName}',`);
    lines.push(`    operationId: '${operationId}',`);
    lines.push(`    // TODO: Add dynamic schema resolution based on endpoint analysis`);
    lines.push(`    inputSchema: null, // Will be resolved from endpoint parameters`);
    lines.push(`    outputSchema: null, // Will be resolved from endpoint response`);
    lines.push('  },');
  }

  lines.push('} as const;');
  lines.push('');
  lines.push('export type OperationIdToZodSchemasMap = typeof operationIdToZodSchemas;');
  lines.push(
    'export type ZodSchemaInfo = OperationIdToZodSchemasMap[keyof OperationIdToZodSchemasMap];',
  );

  return lines.join('\n');
}

function responseSchemaMappingBlock(): string {
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * Dynamic response schema mapping from endpoints');
  lines.push(' * Generated at compile time from the actual endpoints array');
  lines.push(' */');
  lines.push("import { endpoints } from '../../zod/zodSchemas.js';");
  lines.push('');
  lines.push('function getResponseSchemaForEndpoint(method: string, path: string): ZodSchema {');
  lines.push(
    '  const endpoint = endpoints.find((ep: { method: string; path: string; response: ZodSchema }) => ep.method === method && ep.path === path);',
  );
  lines.push('  if (!endpoint) {');
  lines.push('    throw new Error(`No endpoint found for ${method} ${path}`);');
  lines.push('  }');
  lines.push('  return endpoint.response;');
  lines.push('}');
  lines.push('');
  lines.push('export { getResponseSchemaForEndpoint };');

  return lines.join('\n');
}

export function generateTypesFile(
  operationIdMap: Record<string, { toolName: string; operationId: string }>,
): string {
  return [
    headerBlock(),
    toolDescriptorBlock(),
    mappingBlock(operationIdMap),
    zodMappingBlock(operationIdMap),
    responseSchemaMappingBlock(),
  ].join('\n\n');
}
