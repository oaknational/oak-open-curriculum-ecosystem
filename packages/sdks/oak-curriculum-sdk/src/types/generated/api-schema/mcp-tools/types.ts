/* eslint-disable @typescript-eslint/no-restricted-types */
/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-types-file.ts
 *
 * Tool type definitions and guards.
 */

import type { OperationId, ToolDescriptorForName, ToolDescriptorForOperationId, ToolMap, ToolName, ToolNameForOperationId, OperationIdForToolName } from './definitions.js';

export type ToolInvoke<TName extends ToolName> = ToolDescriptorForName<TName>['invoke'];
export type ToolClient<TName extends ToolName> = Parameters<ToolInvoke<TName>>[0];
export type ToolArgs<TName extends ToolName> = Parameters<ToolInvoke<TName>>[1];
export type ToolResult<TName extends ToolName> = Awaited<ReturnType<ToolInvoke<TName>>>;
export type ToolArgsForOperationId<TId extends OperationId> = Parameters<ToolDescriptorForOperationId<TId>['invoke']>[1];
export type ToolResultForOperationId<TId extends OperationId> = Awaited<ReturnType<ToolDescriptorForOperationId<TId>['invoke']>>;
export type ToolOperationIdForName<TName extends ToolName> = OperationIdForToolName<TName>;
export type ToolNameFromOperationId<TId extends OperationId> = ToolNameForOperationId<TId>;
export type RegisteredToolEntries = {
  readonly [TName in ToolName]: {
    readonly descriptor: ToolDescriptorForName<TName>;
    readonly operationId: ToolOperationIdForName<TName>;
  };
};
export type ToolDescriptors = ToolMap;
