import { describe, expect, it } from 'vitest';
import { generateCompleteMcpTools } from './mcp-tool-generator.js';
import { schemaWithPathParams, buildSchemaWithEnumParam } from '../../test-fixtures.js';
import { generateMcpToolName } from './name-generator.js';

/****
 * These tests focus on compile-time generator outputs.
 * They ensure descriptor files expose both the Zod and JSON schemas required by the runtime.
 */
describe('generateCompleteMcpTools (descriptor schema threading)', () => {
  it('threads toolZodSchema and toolOutputJsonSchema through generated descriptors', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);

    expect(output['types.ts']).toContain('getDescriptorSchemaForEndpoint');
    const toolFiles = Object.values(output.tools);
    expect(toolFiles.some((content) => content.includes('toolZodSchema'))).toBe(true);
    expect(output['types.ts']).toContain('export type ToolOutputJsonSchema =');
    expect(output['types.ts']).not.toContain('Tool["outputSchema"]');
    expect(toolFiles.some((content) => content.includes('toolOutputJsonSchema'))).toBe(true);
    expect(toolFiles.some((content) => content.includes('Invalid response payload'))).toBe(true);
    expect(toolFiles.some((content) => content.includes('invoke: async'))).toBe(true);
    expect(
      toolFiles.every((content) => !content.includes('getExecutorFromGenericRequestParams')),
    ).toBe(true);

    const toolEntries = Object.entries(output.tools);
    expect(
      toolEntries.some(([, content]) =>
        content.includes('toolOutputJsonSchema: responseDescriptor.json'),
      ),
    ).toBe(true);
    expect(
      toolEntries.every(
        ([, content]) => !content.includes('outputSchema: responseDescriptor.json'),
      ),
    ).toBe(true);
    expect(
      toolEntries.every(([, content]) =>
        content.includes("import type { ToolDescriptor } from '../definitions.js';"),
      ),
    ).toBe(true);
    expect(
      toolEntries.every(([, content]) => content.includes('} as const satisfies ToolDescriptor;')),
    ).toBe(true);

    const definitionsFile = output['definitions.ts'];
    expect(definitionsFile).toContain('export const MCP_TOOLS = {');
    expect(definitionsFile).toContain('export const TOOL_NAMES = [');
    expect(definitionsFile).toContain('export type ToolDescriptor = typeof MCP_TOOLS');
    expect(definitionsFile).not.toContain('export const toolEntries');
    expect(definitionsFile).not.toContain('createToolMap');
    expect(definitionsFile).not.toContain('DESCRIPTORS.map');

    const indexFile = output['index.ts'];
    expect(indexFile).toContain("export { MCP_TOOLS, TOOL_NAMES } from './definitions.js';");
    expect(indexFile).toContain("export type { ToolDescriptor } from './definitions.js';");

    const typesFile = output['types.ts'];
    expect(typesFile).toContain(
      "import { MCP_TOOLS, type ToolDescriptor } from './definitions.js';",
    );
    expect(typesFile).toContain('export const TOOL_NAMES = [');
    expect(typesFile).toContain('export type AllToolNames = typeof TOOL_NAMES[number];');
    expect(typesFile).toContain('const OPERATION_TO_TOOL = {');
    expect(typesFile).toContain('export type AllOperationIds = keyof typeof OPERATION_TO_TOOL;');
    expect(typesFile).not.toContain("export type { ToolDescriptor } from './definitions.js';");
    expect(typesFile).toContain(
      "export type ToolOutputJsonSchema = ReturnType<typeof getDescriptorSchemaForEndpoint>['json'];",
    );
    expect(typesFile).toContain('return value in MCP_TOOLS;');
    expect(typesFile).not.toContain('toolEntries');
    expect(typesFile).not.toContain('createToolMap');
    expect(typesFile).not.toContain('export type ToolDescriptor = Tool;');

    const libFile = output['lib.ts'];
    expect(libFile).toContain("import { MCP_TOOLS, type ToolDescriptor } from './definitions.js';");
    expect(libFile).not.toContain('type ToolDescriptor = typeof MCP_TOOLS');
  });

  it('captures enum parameter metadata when schema provides enum', () => {
    const schema = buildSchemaWithEnumParam();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/courses', 'get');
    const toolFile = files.tools[`${toolName}.ts`];
    expect(toolFile).toBeDefined();
    expect(toolFile ?? '').toContain("'CourseA' | 'CourseB'");
    expect(toolFile ?? '').toContain('Allowed values: CourseA, CourseB');
  });
});
