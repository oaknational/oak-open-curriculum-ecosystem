import { describe, expect, it } from 'vitest';
import { generateCompleteMcpTools } from './mcp-tool-generator.js';
import { schemaWithPathParams, buildSchemaWithEnumParam } from '../../test-fixtures.js';
import { generateMcpToolName } from './name-generator.js';

describe('generateCompleteMcpTools (schema-first execution DAG)', () => {
  it('emits contract, data, aliases, and runtime executors with strict dependencies', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);

    expect(output.contract['tool-descriptor.contract.ts']).toContain(
      'export interface ToolDescriptor<TName extends string, TClient, TArgs, TResult> extends Tool',
    );
    expect(output.data['definitions.ts']).toContain('export const MCP_TOOL_DESCRIPTORS');
    expect(output.data['definitions.ts']).toContain('export const MCP_TOOL_ENTRIES = [');
    expect(output.data['definitions.ts']).toContain(
      "export type ToolDescriptors = { readonly [E in ToolEntry as E['name']]: E['descriptor'] };",
    );
    const aliasesFile = output.aliases['types.ts'];
    expect(aliasesFile).toContain(
      "import type { ToolOperationId, ToolDescriptors as GeneratedToolDescriptors, ToolEntryForName, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';",
    );
    expect(output.runtime['execute.ts']).toContain(
      "export function callTool(\n  name: 'get-lessons-transcript',",
    );
    expect(output.runtime['execute.ts']).toContain('switch (name) {');
    expect(output.runtime['execute.ts']).not.toContain('callToolEntry(');
    expect(output.runtime['lib.ts']).toContain(
      "import { getToolFromOperationId, isToolName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolName, type ToolOperationId } from '../data/definitions.js';",
    );
    expect(output.runtime['lib.ts']).toContain(
      "import { callTool, listAllToolDescriptors } from './execute.js';",
    );
    expect(output.runtime['lib.ts']).not.toContain('override');
    expect(output.index).toContain('generated/data/index.js');

    expect(output.stubs['index.ts']).toContain('createStubToolExecutor');
    expect(output.stubs['tools/index.ts']).toContain('stubbedToolResponses');
  });

  it('captures enum parameter metadata when schema provides enum', () => {
    const schema = buildSchemaWithEnumParam();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/courses', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    expect(toolFile).toContain("'CourseA' | 'CourseB'");
    expect(toolFile).toContain('Allowed values: CourseA, CourseB');
  });
});
