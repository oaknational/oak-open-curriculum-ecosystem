import { describe, expect, it } from 'vitest';
import { generateCompleteMcpTools } from './mcp-tool-generator.js';
import { schemaWithPathParams, buildSchemaWithEnumParam } from '../../test-fixtures.js';
import { generateMcpToolName } from './name-generator.js';

describe('generateCompleteMcpTools (descriptor schema layering)', () => {
  it('emits contract, data, alias, and runtime artefacts with correct dependencies', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);

    expect(output.contract['tool-descriptor.contract.ts']).toContain(
      'export interface ToolDescriptor<TClient = unknown, TArgs = unknown, TResult = unknown> extends Tool',
    );
    expect(output.data['definitions.ts']).toContain('const MCP_TOOL_DEFINITIONS');
    expect(output.data['index.ts']).toContain('export { toolNames, getToolFromToolName');
    const aliasesFile = output.aliases['types.ts'];
    expect(aliasesFile).toContain(
      "import type { ToolOperationId, ToolDescriptorForName, ToolDescriptorForOperationId, ToolMap, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';",
    );
    expect(aliasesFile).toContain('type ToolDescriptorInvocation<TDescriptor> =');
    expect(output.runtime['lib.ts']).toContain(
      "import {\n  toolNames,\n  getToolFromToolName,\n  getToolNameFromOperationId,\n  isToolName,\n  type ToolDescriptorForName,\n  type ToolDescriptorForOperationId,\n  type ToolName,\n  type ToolOperationId,\n} from '../data/definitions.js';",
    );
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
