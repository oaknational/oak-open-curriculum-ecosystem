import { describe, expect, it } from 'vitest';

import { parseManifestText, parseWorkspacePatterns } from './install-time-manifest.js';

describe('parseWorkspacePatterns', () => {
  it('reads the packages patterns a workspace file declares', () => {
    expect(
      parseWorkspacePatterns(
        'pnpm-workspace.yaml',
        'packages:\n  - agent-tools\n  - packages/core/*\n',
      ),
    ).toStrictEqual({ ok: true, value: ['agent-tools', 'packages/core/*'] });
  });

  it.each([
    ['declares no packages key', 'catalog:\n  zod: ^4.0.0\n'],
    ['declares an empty packages list', 'packages: []\n'],
    ['is not YAML', 'packages: [agent-tools\n'],
  ])('refuses a workspace file that %s, naming it', (_case, text) => {
    const result = parseWorkspacePatterns('/repo/pnpm-workspace.yaml', text);

    expect(result).toHaveProperty('ok', false);
    expect(result).toHaveProperty('error', expect.stringContaining('/repo/pnpm-workspace.yaml'));
  });
});

describe('parseManifestText', () => {
  it('pairs the parsed manifest with the directory its path names', () => {
    expect(
      parseManifestText('packages/core/result/package.json', '{"name":"@x/result"}'),
    ).toStrictEqual({
      ok: true,
      value: { dir: 'packages/core/result', manifest: { name: '@x/result' } },
    });
  });

  it('refuses a manifest that is not JSON, naming its path', () => {
    const result = parseManifestText('packages/broken/package.json', '{"name":');

    expect(result).toHaveProperty('ok', false);
    expect(result).toHaveProperty('error', expect.stringContaining('packages/broken/package.json'));
  });
});
