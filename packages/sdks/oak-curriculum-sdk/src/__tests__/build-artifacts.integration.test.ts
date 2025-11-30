import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

/**
 * Integration coverage ensuring the SDK build emits runtime-ready artefacts.
 */
describe('SDK build artefacts', () => {
  it('emits compiled JS for generated search and MCP barrels', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const repoRoot = join(here, '..', '..', '..', '..', '..');

    expect(() => {
      execSync('pnpm -F @oaknational/oak-curriculum-sdk build', {
        stdio: 'inherit',
        cwd: repoRoot,
      });
    }).not.toThrow();

    const dist = join(repoRoot, 'packages', 'sdks', 'oak-curriculum-sdk', 'dist');

    const expectedFiles = [
      join(dist, 'types/generated/search/index.js'),
      join(dist, 'types/generated/api-schema/mcp-tools/index.js'),
      join(dist, 'mcp/universal-tools/index.js'),
    ];

    expectedFiles.forEach((file) => {
      expect(existsSync(file)).toBe(true);
    });
  }, 30000);
});
