/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-types-file.ts
 *
 * Tool type definitions and guards.
 */

import type { ToolOperationId, ToolDescriptors as GeneratedToolDescriptors, ToolEntryForName, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../definitions.js';

type ToolDescriptorMap = { readonly [TName in ToolName]: ToolEntryForName<TName>['descriptor'] };
type ToolInvokeParametersMap = {
  readonly [TName in ToolName]: Parameters<ToolDescriptorMap[TName]['invoke']>;
};
type ToolInvokeMap = { readonly [TName in ToolName]: ToolDescriptorMap[TName]['invoke'] };
type ToolClientMap = {
  readonly [TName in ToolName]: ToolInvokeParametersMap[TName][0];
};
type ToolArgsMap = {
  readonly [TName in ToolName]: Parameters<ToolDescriptorMap[TName]['transformFlatToNestedArgs']>[0];
};
type ToolValidationResult<TName extends ToolName> = ReturnType<
  ToolDescriptorMap[TName]['validateOutput']
>;
type ToolValidationSuccess<TName extends ToolName> = Extract<
  ToolValidationResult<TName>,
  { readonly ok: true }
>;
export type ToolDescriptorForName<TName extends ToolName> = ToolDescriptorMap[TName];
export type ToolInvoke<TName extends ToolName> = ToolInvokeMap[TName];
export type ToolClientForName<TName extends ToolName> = ToolClientMap[TName];
export type ToolArgsForName<TName extends ToolName> = ToolArgsMap[TName];
export type ToolStatusForName<TName extends ToolName> = ToolValidationSuccess<TName>['status'];
export interface ToolResultForName<TName extends ToolName> {
  readonly status: ToolStatusForName<TName>;
  readonly data: ToolValidationSuccess<TName>['data'];
}
export type ToolArgs<TName extends ToolName = ToolName> = ToolArgsForName<TName>;
export type ToolClient<TName extends ToolName = ToolName> = ToolClientForName<TName>;
export type ToolResult<TName extends ToolName> = ToolResultForName<TName>;
export type ToolArgsForOperationId<TId extends ToolOperationId> =
  ToolArgsForName<ToolNameForOperationId<TId>>;
export type ToolResultForOperationId<TId extends ToolOperationId> =
  ToolResultForName<ToolNameForOperationId<TId>>;
export type ToolDescriptorForOperationId<TId extends ToolOperationId> =
  ToolDescriptorForName<ToolNameForOperationId<TId>>;
export type ToolOperationIdForName<TName extends ToolName> = GeneratedToolOperationIdForName<TName>;
export type ToolNameFromOperationId<TId extends ToolOperationId> = ToolNameForOperationId<TId>;
export type RegisteredToolEntries = {
  readonly [TName in ToolName]: {
    readonly descriptor: ToolDescriptorForName<TName>;
    readonly operationId: ToolOperationIdForName<TName>;
  };
};
export type ToolDescriptors = GeneratedToolDescriptors;
