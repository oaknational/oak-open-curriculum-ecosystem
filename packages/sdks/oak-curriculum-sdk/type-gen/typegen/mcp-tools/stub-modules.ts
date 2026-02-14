interface StubModuleMap {
  readonly 'index.ts': string;
  readonly 'tools/index.ts': string;
  readonly tools: Record<string, string>;
}

export function generateStubModules(
  toolNames: readonly string[],
  stubMap: Map<string, unknown>,
): StubModuleMap {
  const tools: Record<string, string> = {};
  const toolExports: string[] = [];
  const toolImports: string[] = [];

  for (const name of toolNames) {
    const stub = stubMap.get(name);
    if (stub === undefined) {
      continue;
    }
    const exportIdentifier = toExportIdentifier(name);
    tools[`${name}.ts`] = renderToolModule(exportIdentifier, stub);
    toolImports.push(`import { ${exportIdentifier} } from './${name}.js';`);
    toolExports.push(`  '${name}': () => ${exportIdentifier},`);
  }

  const toolIndex = [
    '/* GENERATED FILE - DO NOT EDIT */',
    ...toolImports,
    '',
    'export const stubbedToolResponses = {',
    ...toolExports,
    '} as const;',
    '',
    'export type StubbedToolName = keyof typeof stubbedToolResponses;',
  ].join('\n');

  const mainIndex = [
    '/* GENERATED FILE - DO NOT EDIT */',
    "import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';",
    "import { stubbedToolResponses } from './tools/index.js';",
    "import type { StubbedToolName } from './tools/index.js';",
    '',
    '/** Type alias for structuredContent to avoid broad generic object types in code */',
    'type StructuredContent = NonNullable<CallToolResult["structuredContent"]>;',
    '',
    '/**',
    ' * Creates a stub tool executor that returns pre-defined responses.',
    ' *',
    ' * Returns both `content` (JSON text for MCP clients/model) and `structuredContent`',
    ' * (object for OpenAI Apps SDK widgets to receive via `window.openai.toolOutput`).',
    ' */',
    'export function createStubToolExecutor(): (name: string) => Promise<CallToolResult> {',
    '  return (name: string) => {',
    '    const entry = stubbedToolResponses[name as StubbedToolName];',
    '    if (!entry) {',
    "      return Promise.resolve({ isError: true, content: [{ type: 'text', text: `Stub not found for ${name}` }] });",
    '    }',
    '    const payload = entry();',
    '    // structuredContent is required for OpenAI Apps SDK widgets',
    '    // Type assertion necessary: payload type varies by tool, but SDK requires StructuredContent',
    '    const structuredContent: StructuredContent = typeof payload === "object" && payload !== null',
    '      ? (payload as StructuredContent)',
    '      : { data: payload };',
    "    return Promise.resolve({ content: [{ type: 'text', text: JSON.stringify(payload) }], structuredContent });",
    '  };',
    '}',
    '',
    "export { stubbedToolResponses } from './tools/index.js';",
    "export type { StubbedToolName } from './tools/index.js';",
  ].join('\n');

  return {
    'index.ts': mainIndex,
    'tools/index.ts': toolIndex,
    tools,
  };
}

function renderToolModule(exportIdentifier: string, value: unknown): string {
  const serialisedValue = JSON.stringify(value, null, 2);
  return [
    '/* GENERATED FILE - DO NOT EDIT */',
    `export const ${exportIdentifier} = ${serialisedValue} as const;`,
  ].join('\n');
}

function toExportIdentifier(toolName: string): string {
  return `stub${toolName
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')}Response`;
}
