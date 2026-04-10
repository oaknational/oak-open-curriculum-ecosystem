import { describe, expect, it } from 'vitest';

import { generateStubModules } from './stub-modules.js';

describe('stub-modules', () => {
  it('emits index and per-tool modules for a trivial stub map', () => {
    const toolNames = ['alpha-tool', 'beta-tool'];
    const stubMap = new Map<string, unknown>([
      [
        'alpha-tool',
        {
          data: {
            id: 'alpha',
          },
        },
      ],
      [
        'beta-tool',
        {
          data: [{ id: 'beta-1' }],
        },
      ],
    ]);

    const modules = generateStubModules(toolNames, stubMap);

    expect(modules['index.ts']).toContain('createStubToolExecutor');
    expect(modules['tools/index.ts']).toContain(
      "import { stubAlphaToolResponse } from './alpha-tool.js'",
    );

    const alphaModule = modules.tools['alpha-tool.ts'];
    expect(alphaModule).toContain('export const stubAlphaToolResponse');
    expect(alphaModule).toContain('"id": "alpha"');

    const betaModule = modules.tools['beta-tool.ts'];
    expect(betaModule).toContain('export const stubBetaToolResponse');
    expect(betaModule).toContain('"id": "beta-1"');
  });

  it('uses Node ESM-compatible MCP SDK specifiers in the stub index', () => {
    const modules = generateStubModules([], new Map());

    expect(modules['index.ts']).toContain(
      "import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';",
    );
  });
});
