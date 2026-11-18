import { describe, it, expect } from 'vitest';

import { createInMemoryFileSystem } from '../src/io/test-helpers/in-memory-file-system.js';
import { createMcpToolsFileMap, writeFileMap } from './codegen-core-file-operations.js';
import type { GeneratedMcpToolFiles } from './typegen/mcp-tools/mcp-tool-generator.js';

const generatedMcpTools: GeneratedMcpToolFiles = {
  index: 'root index content',
  contract: {
    'tool-descriptor.contract.ts': 'contract content',
  },
  data: {
    'definitions.ts': 'definitions content',
    'scopes-supported.ts': 'scopes supported content',
    tools: {
      'alpha.ts': 'alpha tool content',
    },
  },
  aliases: {
    'types.ts': 'types content',
  },
  runtime: {
    'lib.ts': 'lib content',
  },
  stubs: {
    'index.ts': 'stub index content',
    'tools/index.ts': 'stub tools index content',
    tools: {
      'alpha.ts': 'stub alpha content',
    },
  },
};

describe('createMcpToolsFileMap', () => {
  it('lays out contract, data, aliases, runtime and stub modules under mcp-tools/', () => {
    expect(createMcpToolsFileMap(generatedMcpTools)).toEqual({
      'mcp-tools/index.ts': 'root index content',
      'mcp-tools/contract/tool-descriptor.contract.ts': 'contract content',
      'mcp-tools/definitions.ts': 'definitions content',
      'mcp-tools/scopes-supported.ts': 'scopes supported content',
      'mcp-tools/tools/alpha.ts': 'alpha tool content',
      'mcp-tools/aliases/types.ts': 'types content',
      'mcp-tools/runtime/lib.ts': 'lib content',
      'mcp-tools/stubs/index.ts': 'stub index content',
      'mcp-tools/stubs/tools/index.ts': 'stub tools index content',
      'mcp-tools/stubs/tools/alpha.ts': 'stub alpha content',
    });
  });
});

describe('writeFileMap', () => {
  it('creates every parent directory and writes each file beneath the output directory', async () => {
    const fs = createInMemoryFileSystem();

    await writeFileMap('/out', createMcpToolsFileMap(generatedMcpTools), fs);

    expect(fs.files.get('/out/mcp-tools/index.ts')).toBe('root index content');
    expect(fs.files.get('/out/mcp-tools/contract/tool-descriptor.contract.ts')).toBe(
      'contract content',
    );
    expect(fs.files.get('/out/mcp-tools/stubs/tools/alpha.ts')).toBe('stub alpha content');
    expect(fs.directories.has('/out/mcp-tools/stubs/tools')).toBe(true);
    expect(fs.files.size).toBe(10);
  });
});
