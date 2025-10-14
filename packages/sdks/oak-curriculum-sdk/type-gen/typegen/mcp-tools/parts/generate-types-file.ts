const GENERATED_BANNER = [
  '/**',
  ' * GENERATED FILE - DO NOT EDIT',
  ' *',
  ' * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-types-file.ts',
  ' *',
  ' * Tool type definitions and guards.',
  ' */',
  '',
].join('\n');

const GENERATED_IMPORTS = ["import type { Tool } from '@modelcontextprotocol/sdk/types.js';"].join(
  '\n',
);

const TOOL_DESCRIPTORS_BLOCK = `// Tool definition which can be expanded with additional properties as necessary
export interface ToolDescriptor extends Tool {
  readonly name: string;
  readonly description: string;
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
