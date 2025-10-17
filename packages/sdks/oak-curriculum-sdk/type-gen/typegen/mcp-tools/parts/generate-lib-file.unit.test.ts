import { describe, expect, it } from 'vitest';

import { generateLibFile } from './generate-lib-file.js';

describe('generateLibFile', () => {
  it('references only the curated helper surface', () => {
    const output = generateLibFile();

    expect(output).toContain(
      "import {\n  toolNames,\n  getToolFromToolName,\n  getToolNameFromOperationId,\n  isToolName,\n  type ToolDescriptorForName,\n  type ToolDescriptorForOperationId,\n  type ToolName,\n  type ToolOperationId,\n} from '../data/definitions.js';",
    );
    expect(output).not.toContain('MCP_TOOLS');
  });

  it('initialises the registry from canonical descriptors and forwards the client', () => {
    const output = generateLibFile();

    expect(output).toContain(
      'type ToolOverrideStore = Map<ToolName, ToolDescriptorForName<ToolName>>;',
    );
    expect(output).toContain('this.overrides = new Map();');
    expect(output).toContain('return toolNames.map((name) => this.resolveDescriptor(name));');
    expect(output).toContain('const parsed = descriptor.toolZodSchema.safeParse(args);');
    expect(output).toContain('const output = await descriptor.invoke(this.client, parsed.data);');
    expect(output).toContain('export function createMcpToolRegistry');
    expect(output).toContain('export function getToolDescriptorForOperationId');
  });
});
