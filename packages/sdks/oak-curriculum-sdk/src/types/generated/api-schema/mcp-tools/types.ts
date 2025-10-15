/* eslint-disable @typescript-eslint/no-restricted-types */
/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-types-file.ts
 *
 * Tool type definitions and guards.
 */


import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodTypeAny, ZodSchema } from 'zod';
import type { OperationId, ToolDescriptorForName, ToolDescriptorForOperationId, ToolMap, ToolName, ToolNameForOperationId, OperationIdForToolName } from './definitions.js';

export interface ToolDescriptor extends Tool {
  readonly name: string;
  readonly description: string;
  readonly operationId: string;
  readonly toolZodSchema: ZodTypeAny;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties?: Readonly<Record<string, unknown>>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodSchema<unknown>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties?: Readonly<Record<string, unknown>>;
    readonly required?: readonly string[];
    readonly additionalProperties?: boolean;
  };
  readonly validateOutput: (value: unknown) =>
    | { readonly ok: true; readonly data: unknown }
    | { readonly ok: false; readonly message: string };
  readonly path: string;
  readonly method: string;
}

export type ToolInvoke<TName extends ToolName> = ToolDescriptorForName<TName>['invoke'];
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
