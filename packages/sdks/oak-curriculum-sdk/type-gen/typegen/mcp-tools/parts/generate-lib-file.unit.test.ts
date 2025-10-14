import { describe, expect, it } from 'vitest';

import { generateLibFile } from './generate-lib-file.js';

describe('generateLibFile', () => {
  it('emits canonical imports using literal helpers', () => {
    const output = generateLibFile();

    expect(output).toContain("import { MCP_TOOLS, type ToolDescriptor } from './definitions.js';");
    expect(output).toContain(
      "import {\n  getToolNameFromOperationId,\n  isToolName,\n  type AllOperationIds,\n  type AllToolNames,\n} from './types.js';",
    );
    expect(output).toContain(
      'export function getToolFromOperationId(operationId: AllOperationIds): ToolDescriptor {',
    );
  });

  it('guards tool invocation and output using literal descriptors', () => {
    const output = generateLibFile();

    expect(output).toContain('const entry = this.tools.get(name);');
    expect(output).toContain('const parsed = descriptor.toolZodSchema.safeParse(args);');
    expect(output).toContain('const outputValidation = descriptor.validateOutput(output);');
  });
});
