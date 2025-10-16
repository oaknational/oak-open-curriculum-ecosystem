import { describe, expect, it } from 'vitest';
import { generateCompleteMcpTools } from './mcp-tool-generator.js';
import { schemaWithPathParams, buildSchemaWithEnumParam } from '../../test-fixtures.js';
import { generateMcpToolName } from './name-generator.js';

describe('generateCompleteMcpTools (descriptor schema threading)', () => {
  it('emits standalone descriptor contract and curated exports', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);

    expect(output['tool-descriptor.ts']).toContain('export interface ToolDescriptor extends Tool');
    expect(output['types.ts']).toContain(
      "import type { ToolDescriptor } from './tool-descriptor.js';",
    );
    expect(output['lib.ts']).toContain(
      "import type { ToolDescriptor } from './tool-descriptor.js';",
    );
    expect(output['index.ts']).toContain(
      'export { type ToolDescriptor } from "./tool-descriptor.js";',
    );
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
