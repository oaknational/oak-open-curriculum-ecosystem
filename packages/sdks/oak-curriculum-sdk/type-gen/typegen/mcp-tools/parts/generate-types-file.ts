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
  "import type { ToolOperationId, ToolDescriptorForName, ToolDescriptorForOperationId, ToolMap, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';";

const TOOL_TYPE_ALIASES = `type ToolDescriptorInvocation<TDescriptor> =
  TDescriptor extends { invoke: (client: infer TClient, args: infer TArgs) => unknown }
    ? { client: TClient; args: TArgs }
    : never;

type ToolDescriptorInvocationForName<TName extends ToolName> = ToolDescriptorInvocation<ToolDescriptorForName<TName>>;
type ToolDescriptorInvocationForOperationId<TId extends ToolOperationId> = ToolDescriptorInvocation<ToolDescriptorForOperationId<TId>>;

export type ToolInvoke<TName extends ToolName> = ToolDescriptorForName<TName>['invoke'];
export type ToolClient<TName extends ToolName> = ToolDescriptorInvocationForName<TName>['client'];
export type ToolArgs<TName extends ToolName = ToolName> = ToolDescriptorInvocationForName<TName>['args'];
export type ToolResult<TName extends ToolName> = Awaited<ReturnType<ToolInvoke<TName>>>;
export type ToolClientForName<TName extends ToolName> = ToolClient<TName>;
export type ToolArgsForName<TName extends ToolName> = ToolArgs<TName>;
export type ToolResultForName<TName extends ToolName> = ToolResult<TName>;
export type ToolArgsForOperationId<TId extends ToolOperationId> = ToolDescriptorInvocationForOperationId<TId>['args'];
export type ToolResultForOperationId<TId extends ToolOperationId> = Awaited<ReturnType<ToolDescriptorForOperationId<TId>['invoke']>>;
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
