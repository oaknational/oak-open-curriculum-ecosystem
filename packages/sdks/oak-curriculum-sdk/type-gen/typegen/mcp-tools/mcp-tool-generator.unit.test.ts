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
    expect(definitionsFile).toContain('const MCP_TOOLS = {');
    expect(definitionsFile).not.toContain('export const MCP_TOOLS');
    expect(definitionsFile).toContain('export const toolNames =');
    expect(definitionsFile).toContain('export type ToolMap = typeof MCP_TOOLS;');
    expect(definitionsFile).toContain(
      'export type ToolDescriptorForOperationId<TId extends OperationId> = ToolDescriptorForName<ToolNameForOperationId<TId>>;',
    );
    expect(definitionsFile).toContain(
      'export type OperationIdForToolName<TName extends ToolName> = ToolNameToOperationId[TName];',
    );
    expect(definitionsFile).toContain(
      'export function getToolNameFromOperationId<TId extends OperationId>(operationId: TId): ToolNameForOperationId<TId> {',
    );
    expect(definitionsFile).toContain(
      'export function getToolFromOperationId<TId extends OperationId>(operationId: TId): ToolDescriptorForName<ToolNameForOperationId<TId>> {',
    );
    expect(definitionsFile).toContain(
      'export function getOperationIdFromToolName<TName extends ToolName>(toolName: TName): OperationIdForToolName<TName> {',
    );
    expect(definitionsFile).not.toContain('export const toolEntries');
    expect(definitionsFile).not.toContain('createToolMap');
    expect(definitionsFile).not.toContain('DESCRIPTORS.map');

    const indexFile = output['index.ts'];
    expect(indexFile).toContain(
      'export { toolNames, getToolFromToolName, getToolFromOperationId, getToolNameFromOperationId, getOperationIdFromToolName, isToolName, isOperationId, type OperationId, type OperationIdForToolName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolMap, type ToolName, type ToolNameForOperationId } from "./definitions.js";',
    );
    expect(indexFile).toContain(
      'export { type ToolDescriptor, type ToolArgs, type ToolArgsForOperationId, type ToolDescriptors, type ToolInvoke, type ToolNameFromOperationId, type ToolOperationIdForName, type ToolResult, type ToolResultForOperationId, type RegisteredToolEntries } from "./types.js";',
    );
    expect(indexFile).not.toContain('MCP_TOOLS');

    const typesFile = output['types.ts'];
    expect(typesFile).toContain(
      "import type { OakApiPathBasedClient } from '../../../../client/index.js';",
    );
    expect(typesFile).toContain("import type { ToolDescriptorForName } from './definitions.js';");
    expect(typesFile).toContain(
      "import type { ToolDescriptorForOperationId } from './definitions.js';",
    );
    expect(typesFile).toContain("import type { ToolMap } from './definitions.js';");
    expect(typesFile).toContain("import type { ToolName } from './definitions.js';");
    expect(typesFile).toContain("import type { ToolNameForOperationId } from './definitions.js';");
    expect(typesFile).toContain("import type { OperationId } from './definitions.js';");
    expect(typesFile).toContain("import type { OperationIdForToolName } from './definitions.js';");
    expect(typesFile).not.toContain('MCP_TOOLS');
    expect(typesFile).toContain('export interface ToolDescriptor');
    expect(typesFile).toContain('export type ToolInvoke<TName extends ToolName> =');
    expect(typesFile).toContain('export type ToolArgs<TName extends ToolName> =');
    expect(typesFile).toContain('export type ToolResult<TName extends ToolName> =');
    expect(typesFile).toContain('export type ToolArgsForOperationId<TId extends OperationId> =');
    expect(typesFile).toContain('export type ToolResultForOperationId<TId extends OperationId> =');
    expect(typesFile).toContain('export type ToolOperationIdForName<TName extends ToolName> =');
    expect(typesFile).toContain('export type ToolNameFromOperationId<TId extends OperationId> =');
    expect(typesFile).toContain('export type RegisteredToolEntries = {');
    expect(typesFile).toContain('export type ToolDescriptors = ToolMap;');
    expect(typesFile).not.toContain('createToolMap');

    const libFile = output['lib.ts'];
    expect(libFile).toContain("import { type ToolArgs, type ToolResult } from './types.js';");
    expect(libFile).toContain(
      "import type { OakApiPathBasedClient } from '../../../client/index.js';",
    );
    expect(libFile).toContain(
      'private readonly tools = new Map<ToolName, ToolRegistryEntry<ToolName>>();',
    );
    expect(libFile).toContain('constructor(private readonly client: OakApiPathBasedClient) {}');
    expect(libFile).toContain(
      'register<TName extends ToolName>(name: TName, descriptor: ToolDescriptorForName<TName>): void {',
    );
    expect(libFile).toContain('const output = await descriptor.invoke(this.client, parsed.data);');
    expect(libFile).toContain('const outputValidation = descriptor.validateOutput(output);');
    expect(libFile).not.toContain('MCP_TOOLS');
  });

  it('captures enum parameter metadata when schema provides enum', () => {
    const schema = buildSchemaWithEnumParam();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/courses', 'get');
    const toolFile = files.tools[`${toolName}.ts`];
    expect(toolFile).toBeDefined();
    expect(toolFile).toContain("'CourseA' | 'CourseB'");
    expect(toolFile).toContain('Allowed values: CourseA, CourseB');
  });
});
