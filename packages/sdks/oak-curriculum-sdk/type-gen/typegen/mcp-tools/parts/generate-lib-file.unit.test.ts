import { describe, expect, it } from 'vitest';

import { generateLibFile } from './generate-lib-file.js';

describe('generateLibFile', () => {
  it('imports the schema-first executor helpers', () => {
    const output = generateLibFile();

    expect(output).toContain(
      "import { getToolFromOperationId, isToolName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolName, type ToolOperationId } from '../data/definitions.js';",
    );
    expect(output).toContain("import { callTool, listAllToolDescriptors } from './execute.js';");
    expect(output).not.toContain('override');
    expect(output).not.toContain('switch (name)');
  });

  it('emits a registry that delegates directly to callTool', () => {
    const output = generateLibFile();

    expect(output).toContain('export class McpToolRegistry');
    expect(output).toContain('const result = await callTool(name, this.client, rawArgs);');
    expect(output).toContain('return listAllToolDescriptors();');
    expect(output).toContain('return formatSuccess(result);');
    expect(output).toContain('return formatError(error);');
  });
});
