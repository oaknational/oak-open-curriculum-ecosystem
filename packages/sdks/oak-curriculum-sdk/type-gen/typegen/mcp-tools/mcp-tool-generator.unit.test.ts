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
    expect(output.data['definitions.ts']).toContain(
      'export type ToolDescriptorMap = typeof MCP_TOOL_DESCRIPTORS;',
    );
    const aliasesFile = output.aliases['types.ts'];
    expect(aliasesFile).toContain(
      "import type { ToolOperationId, ToolDescriptorForName, ToolDescriptorForOperationId, ToolMap, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';",
    );
    expect(output.runtime['execute.ts']).toContain(
      'export async function callTool<TName extends ToolName>(',
    );
    expect(output.runtime['execute.ts']).toContain('return callTool(name, client, args);');
    expect(output.runtime['lib.ts']).toContain(
      "import { getToolFromOperationId, isToolName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolName, type ToolOperationId } from '../data/definitions.js';",
    );
    expect(output.runtime['lib.ts']).toContain(
      "import { callTool, listAllToolDescriptors } from './execute.js';",
    );
    expect(output.runtime['lib.ts']).not.toContain('override');
    expect(output.runtime['lib.ts']).not.toContain('switch (name)');
    expect(output.index).toContain('generated/data/index.js');
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
