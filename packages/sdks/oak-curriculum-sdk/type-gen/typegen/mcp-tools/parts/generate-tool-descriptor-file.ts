export function generateToolDescriptorFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Tool descriptor contract used by all generated MCP tools.
 * 
 * The primary purpose of this type is to provide a type-safe
 * contract for the tool descriptor. Generators rely on it in
 * their \`satisfies\` clauses, while most consumers interact with
 * the derived helpers we emit from the tool list constant data
 * structure. Keep this contract available, but treat the derived
 * aliases as the preferred public surface.
 *
 * This file is intentionally standalone. Do not add imports from other generated modules.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodSchema, ZodTypeAny } from 'zod';

// Standalone definition: keep this interface free from dependencies on other generated files.
export interface ToolDescriptor<TClient = unknown, TArgs = unknown, TResult = unknown> extends Tool {
  readonly name: string;
  readonly description: string;
  readonly operationId: string;
  readonly path: string;
  readonly method: string;
  readonly toolZodSchema: ZodTypeAny;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- genuine unknown at incoming boundary
    readonly properties?: Readonly<Record<string, unknown>>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodSchema<TResult>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- genuine unknown at incoming boundary
    readonly properties?: Readonly<Record<string, unknown>>;
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
