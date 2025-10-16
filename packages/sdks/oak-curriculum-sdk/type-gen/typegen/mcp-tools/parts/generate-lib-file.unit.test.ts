import { describe, expect, it } from 'vitest';

import { generateLibFile } from './generate-lib-file.js';

describe('generateLibFile', () => {
  it('references only the curated helper surface', () => {
    const output = generateLibFile();

    expect(output).toContain(
      "import {\n  toolNames,\n  getToolFromToolName,\n  getToolNameFromOperationId,\n  isToolName,\n} from './definitions.js';",
    );
    expect(output).toContain('type ToolOperationId');
    expect(output).toContain('type ToolDescriptorForName');
    expect(output).not.toContain('MCP_TOOLS');
  });

  it('initialises the registry from canonical descriptors and forwards the client', () => {
    const output = generateLibFile();

    expect(output).toContain('function storeDescriptor<TName extends ToolName>(');
    expect(output).toContain('storeDescriptor(this.descriptors, name, getToolFromToolName(name));');
    expect(output).toContain('const output = await descriptor.invoke(this.client, parsed.data);');
    expect(output).toContain('export function createMcpToolRegistry');
    expect(output).toContain('export function getToolDescriptorForOperationId');
  });
});
