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

function emitToolEntries(
  names: readonly string[],
  toolNameToOperationId: ReadonlyMap<string, string>,
): string {
  const rows = names.map((toolName) => {
    const operationId = toolNameToOperationId.get(toolName);
    if (!operationId) {
      throw new Error(`No operation id found for tool ${toolName}`);
    }
    return `  { name: '${toolName}', descriptor: ${toolNameToIdentifier(toolName)}, operationId: '${operationId}' },`;
  });
  return `export const MCP_TOOL_ENTRIES = [\n${rows.join('\n')}\n] as const;`;
}

const TOOL_ENTRY_TYPE_BLOCK = `type ToolEntryByNameMap = typeof TOOL_ENTRY_BY_NAME;
export type ToolEntry = ToolEntryByNameMap[keyof ToolEntryByNameMap];
export type ToolName = keyof ToolEntryByNameMap;
export type ToolOperationId = ToolEntry['operationId'];
export type ToolEntryForName<TName extends ToolName> = ToolEntryByNameMap[TName];
export type ToolDescriptors = { readonly [E in ToolEntry as E['name']]: E['descriptor'] };
export type ToolDescriptorMap = ToolDescriptors;
export type ToolMap = ToolDescriptorMap;
export type ToolDescriptorForName<TName extends ToolName> = ToolEntryForName<TName>['descriptor'];
export type ToolOperationIdForName<TName extends ToolName> = ToolEntryForName<TName>['operationId'];
type ToolNameToOperationIdMap = { readonly [E in ToolEntry as E['name']]: E['operationId'] };
type OperationIdToToolNameMap = Readonly<Record<ToolOperationId, ToolName>>;`;

const OPERATION_ID_TYPE_BLOCK = `export type ToolNameForOperationId<TId extends ToolOperationId> = OperationIdToToolNameMap[TId];
export type ToolDescriptorForOperationId<TId extends ToolOperationId> = ToolDescriptorForName<ToolNameForOperationId<TId>>;`;

function emitToolEntryByNameMap(names: readonly string[]): string {
  const rows = names.map(
    (toolName, index) => `  '${toolName}': MCP_TOOL_ENTRIES[${String(index)}],`,
  );
  return `const TOOL_ENTRY_BY_NAME = {\n${rows.join('\n')}\n} as const;`;
}

function emitDescriptorMap(names: readonly string[]): string {
  const rows = names.map((toolName) => `  '${toolName}': ${toolNameToIdentifier(toolName)},`);
  return `export const MCP_TOOL_DESCRIPTORS = {\n${rows.join('\n')}\n} satisfies ToolDescriptors;`;
}

const TOOL_NAMES_BLOCK =
  'export const toolNames = Object.freeze(MCP_TOOL_ENTRIES.map((entry) => entry.name)) satisfies readonly ToolName[];';

const IS_TOOL_NAME_BLOCK = `export function isToolName(value: unknown): value is ToolName {
  return typeof value === 'string' && value in MCP_TOOL_DESCRIPTORS;
}`;

const GET_TOOL_ENTRY_FROM_TOOL_NAME_BLOCK = `export function getToolEntryFromToolName<TName extends ToolName>(toolName: TName): ToolEntryForName<TName> {
  const entry = TOOL_ENTRY_BY_NAME[toolName];
  if (!entry) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return entry;
}`;

const GET_TOOL_FROM_TOOL_NAME_BLOCK = `export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
  const entry = getToolEntryFromToolName(toolName);
  return entry.descriptor;
}`;

const OPERATION_ID_MAP_BLOCK = (operationIdToToolNameCases: string): string =>
  `const OPERATION_ID_TO_TOOL_NAME = {\n${operationIdToToolNameCases}\n} as const satisfies OperationIdToToolNameMap;`;

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
  `const TOOL_NAME_TO_OPERATION_ID = {\n${toolNameToOperationIdCases}\n} as const satisfies ToolNameToOperationIdMap;`;

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

export function generateDefinitionsFile(
  toolNames: string[],
  operationToTool: readonly OperationToToolEntry[],
): string {
  const names = toolNames.slice().toSorted();
  const toolNameToOperationId = new Map<string, string>();

  for (const { operationId, toolName } of operationToTool) {
    if (!toolNameToOperationId.has(toolName)) {
      toolNameToOperationId.set(toolName, operationId);
    }
  }

  const operationIdToToolNameCases = operationToTool
    .map(({ operationId, toolName }) => `  '${operationId}': '${toolName}',`)
    .join('\n');

  const toolNameToOperationIdCases = operationToTool
    .map(({ operationId, toolName }) => `  '${toolName}': '${operationId}',`)
    .join('\n');

  return [
    banner,
    '// Import canonical tool descriptors',
    emitToolImports(names),
    emitToolEntries(names, toolNameToOperationId),
    emitToolEntryByNameMap(names),
    TOOL_ENTRY_TYPE_BLOCK,
    emitDescriptorMap(names),
    TOOL_NAMES_BLOCK,
    IS_TOOL_NAME_BLOCK,
    GET_TOOL_ENTRY_FROM_TOOL_NAME_BLOCK,
    GET_TOOL_FROM_TOOL_NAME_BLOCK,
    OPERATION_ID_MAP_BLOCK(operationIdToToolNameCases),
    OPERATION_ID_TYPE_BLOCK,
    IS_TOOL_OPERATION_ID_BLOCK,
    GET_TOOL_NAME_FROM_ID_BLOCK,
    GET_TOOL_FROM_ID_BLOCK,
    TOOL_NAME_TO_OPERATION_ID_BLOCK(toolNameToOperationIdCases),
    GET_ID_FROM_TOOL_NAME_BLOCK,
  ].join('\n\n');
}
