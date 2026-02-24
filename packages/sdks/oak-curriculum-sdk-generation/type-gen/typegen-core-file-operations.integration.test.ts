import { describe, it, expect } from 'vitest';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { writeMcpToolsDirectory } from './typegen-core-file-operations.js';
import type { GeneratedMcpToolFiles } from './typegen/mcp-tools/mcp-tool-generator.js';

describe('writeMcpToolsDirectory', () => {
  it('writes contract, data, aliases, and runtime artefacts into the expected structure', () => {
    const outDir = mkdtempSync(path.join(os.tmpdir(), 'mcp-tools-writer-test-'));
    const files: GeneratedMcpToolFiles = {
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

    try {
      writeMcpToolsDirectory(outDir, files);

      const rootIndexPath = path.join(outDir, 'mcp-tools', 'index.ts');
      const contractPath = path.join(
        outDir,
        'mcp-tools',
        'contract',
        'tool-descriptor.contract.ts',
      );
      const definitionsPath = path.join(outDir, 'mcp-tools', 'definitions.ts');
      const toolPath = path.join(outDir, 'mcp-tools', 'tools', 'alpha.ts');
      const aliasesPath = path.join(outDir, 'mcp-tools', 'aliases', 'types.ts');
      const runtimePath = path.join(outDir, 'mcp-tools', 'runtime', 'lib.ts');
      const stubIndexPath = path.join(outDir, 'mcp-tools', 'stubs', 'index.ts');
      const stubToolsIndexPath = path.join(outDir, 'mcp-tools', 'stubs', 'tools', 'index.ts');
      const stubToolPath = path.join(outDir, 'mcp-tools', 'stubs', 'tools', 'alpha.ts');

      expect(readFileSync(rootIndexPath, 'utf8')).toBe('root index content');
      expect(readFileSync(contractPath, 'utf8')).toBe('contract content');
      expect(readFileSync(definitionsPath, 'utf8')).toBe('definitions content');
      expect(readFileSync(toolPath, 'utf8')).toBe('alpha tool content');
      expect(readFileSync(aliasesPath, 'utf8')).toBe('types content');
      expect(readFileSync(runtimePath, 'utf8')).toBe('lib content');
      expect(readFileSync(stubIndexPath, 'utf8')).toBe('stub index content');
      expect(readFileSync(stubToolsIndexPath, 'utf8')).toBe('stub tools index content');
      expect(readFileSync(stubToolPath, 'utf8')).toBe('stub alpha content');
    } finally {
      rmSync(outDir, { force: true, recursive: true });
    }
  });
});
