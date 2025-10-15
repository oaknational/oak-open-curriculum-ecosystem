const banner = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts
 *
 * MCP Tools definitions
 * 
 * Canonical literal descriptors for every tool.
 * 
 * This is an internal file, all types and utilities are created in the types.js file
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

function emitToolsLiteral(names: readonly string[]): string {
  const rows = names.map((toolName) => `  '${toolName}': ${toolNameToIdentifier(toolName)},`);
  return `
  // DO NOT EXPORT
  const MCP_TOOLS = {\n${rows.join('\n')}\n} as const;
  `;
}

const TOOL_NAME_BLOCK = `
export type ToolMap = typeof MCP_TOOLS;
export type ToolName = keyof ToolMap;
export type ToolDescriptorForName<TName extends ToolName> = ToolMap[TName];
`;

function emitToolNames(names: readonly string[]): string {
  return `
  // THIS IS GENERATED FROM THE SAME DATA AS MCP_TOOLS, THEY ARE ALWAYS IN SYNC
  export const toolNames = [${names.map((name) => `'${name}'`).join(', ')}] as const;
  `;
}

const IS_TOOL_NAME_BLOCK = `export function isToolName(value: unknown): value is ToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return value in MCP_TOOLS;
}`;

const GET_TOOL_FROM_TOOL_NAME_BLOCK = `export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
  return MCP_TOOLS[toolName];
}`;

const IS_OPERATION_ID_BLOCK = `export function isOperationId(value: unknown): value is OperationId {
  if (typeof value !== 'string') {
    return false;
  }
  return value in OPERATION_ID_TO_TOOL_NAME;
}`;

const GET_TOOL_NAME_FROM_ID_BLOCK = `export function getToolNameFromOperationId(operationId: OperationId): ToolName {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}`;

const GET_ID_FROM_TOOL_NAME_BLOCK = `export function getOperationIdFromToolName(toolName: ToolName): OperationId {
  const operationId = TOOL_NAME_TO_OPERATION_ID[toolName];
  if (!operationId) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return operationId;
}`;

const GET_TOOL_FROM_ID_BLOCK = `
export function getToolFromOperationId(operationId: OperationId): ToolDescriptorForName<ToolNameForOperationId<OperationId>> {
  const toolName = getToolNameFromOperationId(operationId);
  return MCP_TOOLS[toolName];
}
`;

const OPERATION_TYPE_BLOCK = `type OperationIdToToolName = typeof OPERATION_ID_TO_TOOL_NAME;
export type OperationId = keyof OperationIdToToolName;
export type ToolNameForOperationId<TId extends OperationId> = OperationIdToToolName[TId];
`;

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
    '// Import all tool definitions',
    emitToolImports(names),
    emitToolsLiteral(names),
    TOOL_NAME_BLOCK,
    IS_TOOL_NAME_BLOCK,
    emitToolNames(names),
    GET_TOOL_FROM_TOOL_NAME_BLOCK,
    `const OPERATION_ID_TO_TOOL_NAME = {\n${operationIdToToolNameCases}\n} as const;`,
    OPERATION_TYPE_BLOCK,
    IS_OPERATION_ID_BLOCK,
    GET_TOOL_NAME_FROM_ID_BLOCK,
    GET_TOOL_FROM_ID_BLOCK,
    `const TOOL_NAME_TO_OPERATION_ID = {\n${toolNameToOperationIdCases}\n} as const;`,
    GET_ID_FROM_TOOL_NAME_BLOCK,
  ].join('\n\n');
}
