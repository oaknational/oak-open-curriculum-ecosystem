const GENERATED_BANNER = [
  '/* eslint-disable @typescript-eslint/no-restricted-types */',
  '/**',
  ' * GENERATED FILE - DO NOT EDIT',
  ' *',
  ' * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-types-file.ts',
  ' *',
  ' * Tool type definitions and guards.',
  ' */',
  '',
].join('\n');

const GENERATED_IMPORTS =
  "import type { ToolOperationId, ToolDescriptorForName, ToolMap, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';";

const TOOL_TYPE_ALIASES = `export type ToolInvoke<TName extends ToolName> = ToolDescriptorForName<TName>['invoke'];
export type ToolClientForName<TName extends ToolName> = Parameters<ToolInvoke<TName>>[0];
export type ToolArgsForName<TName extends ToolName> = Parameters<ToolInvoke<TName>>[1];
export type ToolResultForName<TName extends ToolName> = Awaited<ReturnType<ToolInvoke<TName>>>;
export type ToolArgs<TName extends ToolName = ToolName> = ToolArgsForName<TName>;
export type ToolClient<TName extends ToolName = ToolName> = ToolClientForName<TName>;
export type ToolResult<TName extends ToolName> = ToolResultForName<TName>;
export type ToolArgsForOperationId<TId extends ToolOperationId> =
  Parameters<ToolInvoke<ToolNameForOperationId<TId>>>[1];
export type ToolResultForOperationId<TId extends ToolOperationId> =
  Awaited<ReturnType<ToolInvoke<ToolNameForOperationId<TId>>>>;
export type ToolOperationIdForName<TName extends ToolName> = GeneratedToolOperationIdForName<TName>;
export type ToolNameFromOperationId<TId extends ToolOperationId> = ToolNameForOperationId<TId>;
export type RegisteredToolEntries = {
  readonly [TName in ToolName]: {
    readonly descriptor: ToolDescriptorForName<TName>;
    readonly operationId: ToolOperationIdForName<TName>;
  };
};
export type ToolDescriptors = ToolMap;
`;

export function generateTypesFile(): string {
  return [GENERATED_BANNER, GENERATED_IMPORTS, '', TOOL_TYPE_ALIASES].join('\n');
}
