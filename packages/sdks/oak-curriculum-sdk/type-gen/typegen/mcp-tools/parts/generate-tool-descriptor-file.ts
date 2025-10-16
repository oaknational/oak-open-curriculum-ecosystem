export function generateToolDescriptorFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Tool descriptor contract used by all generated MCP tools.
 *
 * This contract intentionally avoids importing generated data.
 * All concrete tool descriptors are emitted under generated/data/tools
 * and must depend on this contract rather than the other way around.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodSchema, ZodType } from 'zod';

export interface ToolDescriptor<TClient = unknown, TArgs = unknown, TResult = unknown> extends Tool {
  readonly name: string;
  readonly description?: string;
  readonly operationId: string;
  readonly path: string;
  readonly method: string;
  readonly toolZodSchema: ZodType<TArgs>;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- genuine unknown at incoming boundary
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodSchema<TResult>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- genuine unknown at incoming boundary
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly validateOutput: (value: unknown) =>
    | { readonly ok: true; readonly data: TResult }
    | { readonly ok: false; readonly message: string };
  readonly invoke: (client: TClient, args: TArgs) => TResult | Promise<TResult>;
}
`;
}
