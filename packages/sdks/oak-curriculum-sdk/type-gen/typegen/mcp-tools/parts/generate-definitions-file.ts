const banner = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts
 *
 * MCP Tools definitions
 *
 * Canonical literal descriptors for every tool.
 *
 * This file participates in the schema-first execution DAG. See
 * .agent/directives-and-memory/schema-first-execution.md for details.
 */`;

interface OperationToToolEntry {
  readonly operationId: string;
  readonly toolName: string;
}

function toolNameToIdentifier(toolName: string): string {
  return toolName.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
}

function emitToolImports(names: readonly string[]): string {
  return names
    .map(
      (toolName) => `import { ${toolNameToIdentifier(toolName)} } from './tools/${toolName}.js';`,
    )
    .join('\n');
}

function emitDescriptorEntriesType(names: readonly string[]): string {
  const rows = names.map((toolName) => {
    const identifier = toolNameToIdentifier(toolName);
    return [
      `  readonly '${toolName}': ToolDescriptor<`,
      `    typeof ${identifier}['name'],`,
      `    Parameters<typeof ${identifier}['invoke']>[0],`,
      `    Parameters<typeof ${identifier}['invoke']>[1],`,
      `    Awaited<ReturnType<typeof ${identifier}['invoke']>>`,
      `  >;`,
    ].join('\n');
  });
  return `type ToolDescriptorEntries = {\n${rows.join('\n')}\n};`;
}

function emitDescriptorLiteral(names: readonly string[]): string {
  const rows = names.map((toolName) => `  '${toolName}': ${toolNameToIdentifier(toolName)},`);
  return `export const MCP_TOOL_DESCRIPTORS = {\n${rows.join('\n')}\n} as const satisfies ToolDescriptorEntries;`;
}

const TOOL_TYPE_BLOCK = `export type ToolDescriptorMap = typeof MCP_TOOL_DESCRIPTORS;
export type ToolMap = ToolDescriptorMap;
export type ToolName = keyof ToolDescriptorMap;
export type ToolDescriptorForName<TName extends ToolName> = ToolDescriptorMap[TName];`;

function emitToolNames(names: readonly string[]): string {
  return `export const toolNames = [${names.map((name) => `'${name}'`).join(', ')}] as const;`;
}

const IS_TOOL_NAME_BLOCK = `export function isToolName(value: unknown): value is ToolName {
  return typeof value === 'string' && value in MCP_TOOL_DESCRIPTORS;
}`;

const GET_TOOL_FROM_TOOL_NAME_BLOCK = `export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
  const descriptor = MCP_TOOL_DESCRIPTORS[toolName];
  if (!descriptor) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return descriptor;
}`;

const OPERATION_ID_MAP_BLOCK = (operationIdToToolNameCases: string): string =>
  `const OPERATION_ID_TO_TOOL_NAME = {\n${operationIdToToolNameCases}\n} as const;`;

const TOOL_OPERATION_TYPES_BLOCK = `type OperationIdToToolName = typeof OPERATION_ID_TO_TOOL_NAME;
export type ToolOperationId = keyof OperationIdToToolName;
export type ToolNameForOperationId<TId extends ToolOperationId> = OperationIdToToolName[TId];
export type ToolDescriptorForOperationId<TId extends ToolOperationId> = ToolDescriptorForName<ToolNameForOperationId<TId>>;`;

const IS_TOOL_OPERATION_ID_BLOCK = `export function isToolOperationId(value: unknown): value is ToolOperationId {
  return typeof value === 'string' && value in OPERATION_ID_TO_TOOL_NAME;
}`;

const GET_TOOL_NAME_FROM_ID_BLOCK = `export function getToolNameFromOperationId<TId extends ToolOperationId>(operationId: TId): ToolNameForOperationId<TId> {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}`;

const TOOL_NAME_TO_OPERATION_ID_BLOCK = (toolNameToOperationIdCases: string): string =>
  `const TOOL_NAME_TO_OPERATION_ID = {\n${toolNameToOperationIdCases}\n} as const;`;

const TOOL_NAME_OPERATION_TYPES_BLOCK = `type ToolNameToOperationId = typeof TOOL_NAME_TO_OPERATION_ID;
export type ToolOperationIdForName<TName extends ToolName> = ToolNameToOperationId[TName];`;

const GET_TOOL_FROM_ID_BLOCK = `export function getToolFromOperationId<TId extends ToolOperationId>(operationId: TId): ToolDescriptorForOperationId<TId> {
  const toolName = getToolNameFromOperationId(operationId);
  return getToolFromToolName(toolName);
}`;

const GET_ID_FROM_TOOL_NAME_BLOCK = `export function getOperationIdFromToolName<TName extends ToolName>(toolName: TName): ToolOperationIdForName<TName> {
  const operationId = TOOL_NAME_TO_OPERATION_ID[toolName];
  if (!operationId) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return operationId;
}`;

const TOOL_DESCRIPTOR_IMPORT = `import type { ToolDescriptor } from '../../contract/tool-descriptor.contract.js';`;

export function generateDefinitionsFile(
  toolNames: string[],
  operationToTool: readonly OperationToToolEntry[],
): string {
  const names = toolNames.slice().toSorted();

  const operationIdToToolNameCases = operationToTool
    .map(({ operationId, toolName }) => `  '${operationId}': '${toolName}',`)
    .join('\n');

  const toolNameToOperationIdCases = operationToTool
    .map(({ operationId, toolName }) => `  '${toolName}': '${operationId}',`)
    .join('\n');

  return [
    banner,
    TOOL_DESCRIPTOR_IMPORT,
    '// Import canonical tool descriptors',
    emitToolImports(names),
    emitDescriptorEntriesType(names),
    emitDescriptorLiteral(names),
    TOOL_TYPE_BLOCK,
    emitToolNames(names),
    IS_TOOL_NAME_BLOCK,
    GET_TOOL_FROM_TOOL_NAME_BLOCK,
    OPERATION_ID_MAP_BLOCK(operationIdToToolNameCases),
    TOOL_OPERATION_TYPES_BLOCK,
    IS_TOOL_OPERATION_ID_BLOCK,
    GET_TOOL_NAME_FROM_ID_BLOCK,
    GET_TOOL_FROM_ID_BLOCK,
    TOOL_NAME_TO_OPERATION_ID_BLOCK(toolNameToOperationIdCases),
    TOOL_NAME_OPERATION_TYPES_BLOCK,
    GET_ID_FROM_TOOL_NAME_BLOCK,
  ].join('\n\n');
}
