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

const GENERATED_IMPORTS = [
  "import type { Tool } from '@modelcontextprotocol/sdk/types.js';",
  "import type { ZodTypeAny, ZodSchema } from 'zod';",
].join('\n');

const TOOL_DESCRIPTORS_BLOCK = `export interface ToolDescriptor extends Tool {
  readonly name: string;
  readonly description: string;
  readonly operationId: string;
  readonly toolZodSchema: ZodTypeAny;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties?: Readonly<Record<string, unknown>>;
    readonly required?: readonly string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodSchema<unknown>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties?: Readonly<Record<string, unknown>>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly validateOutput: (value: unknown) =>
    | { readonly ok: true; readonly data: unknown }
    | { readonly ok: false; readonly message: string };
  readonly path: string;
  readonly method: string;
}`;

export function generateTypesFile({
  toolNames,
}: {
  readonly toolNames: readonly string[];
}): string {
  if (toolNames.length === 0) {
    throw new TypeError('toolNames must be a non-empty array');
  }

  return [GENERATED_BANNER, GENERATED_IMPORTS, TOOL_DESCRIPTORS_BLOCK].join('\n\n');
}
