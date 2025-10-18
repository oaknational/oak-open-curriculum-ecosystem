/* eslint-disable @typescript-eslint/no-restricted-types */
/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-types-file.ts
 *
 * Tool type definitions and guards.
 */

import type { ToolOperationId, ToolDescriptors as GeneratedToolDescriptors, ToolEntryForName, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';
import type { ToolDescriptor } from '../../contract/tool-descriptor.contract.js';

export type ToolDescriptorForName<TName extends ToolName> = ToolEntryForName<TName>['descriptor'];
type ToolDescriptorInstance<TName extends ToolName> = ToolDescriptorForName<TName>;
export type ToolInvoke<TName extends ToolName> = ToolDescriptorInstance<TName>['invoke'];
export type ToolClientForName<TName extends ToolName> =
  ToolDescriptorInstance<TName> extends ToolDescriptor<TName, infer TClient, any, any> ? TClient : never;
export type ToolArgsForName<TName extends ToolName> =
  ToolDescriptorInstance<TName> extends ToolDescriptor<TName, any, infer TArgs, any> ? TArgs : never;
export type ToolResultForName<TName extends ToolName> =
  ToolDescriptorInstance<TName> extends ToolDescriptor<TName, any, any, infer TResult> ? Awaited<TResult> : never;
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
